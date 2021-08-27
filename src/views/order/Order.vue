<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容">
            <template #append>
              <el-button icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot:default="{ row }">
            <el-tag v-if="row.pay_status == 1" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot:default="{ row }">
            {{ showDates }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="{ row }">
            <!-- 修改按钮 -->
            <el-button
              @click="showEditDialog(row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 物流进度按钮 -->
            <el-button
              @click="showProgressBox(row.id)"
              type="success"
              icon="el-icon-location"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码组件 -->
      <el-pagination
        v-loading.fullscreen.lock="loading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      @close="addresssDialogClose"
      title="修改地址"
      v-model="editDialogVisible"
      width="50%"
    >
      <!-- 修改用户的面板 -->
      <el-form
        :rules="addressRules"
        :model="addressForm"
        ref="addressRef"
        label-width="100px"
      >
        <el-form-item prop="address1" label="省市区/县">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" v-model="progressVisible" width="50%">
      <!-- 展示物流进度的对话框 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import cityData from '../../common/citydata'
import { showDate } from '../../common/utils'
import { orderDataList, aaa } from '../../network/order'
import { onMounted, ref, reactive, computed } from 'vue'
export default {
  name: 'Order',
  // 验证规则
  data () {
    return {
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      addressRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      cityData

    }
  },
  setup () {

    let progressVisible = ref(false)

    const addressForm = reactive({
      address1: [],
      address2: ""
    })
    // loading 加载
    let loading = ref(true)
    // 获取用户列表的参数对象
    const queryInfo = reactive({
      query: '',
      // 当前页码
      pagenum: 1,
      // 当前每页展示的数据数量
      pagesize: 10
    })
    let progressInfo = ref([])

    // 数据总数
    let total = ref(0)
    const orderList = ref([])
    // 修改地址对话框
    let editDialogVisible = ref(false)


    // 订单数据列表请求函数
    const init = () => {
      orderDataList(queryInfo).then(res => {
        if (res.status !== 200)
          return ElMessage.error('获取订单列表失败')
        setTimeout(() => {
          loading.value = false
        }, 1000)
        total.value = res.data.data.total
        orderList.value = res.data.data.goods
      })

    }
    const showDates = computed(() => {
      return showDate(orderList.value)
    })
    const handleSizeChange = (newSize) => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false
      }, 1000)
      queryInfo.pagesize = newSize
      init()
    }
    let addressRef = ref()
    const addresssDialogClose = () => {
      addressRef.value.resetFields()
    }

    // 物流信息按钮
    const showProgressBox = () => {
      progressVisible.value = true
    }

    // 修改地址 时间
    const showEditDialog = () => {
      editDialogVisible.value = true
    }

    // 页码发生变化
    const handleCurrentChange = (newPage) => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false
      }, 1000)
      queryInfo.pagenum = newPage
      init()
    }
    onMounted(() => {
      init()
    })


    return {
      orderList,
      showProgressBox,
      addresssDialogClose,
      addressRef,
      addressForm,
      handleSizeChange,
      handleCurrentChange,
      queryInfo,
      total,
      progressVisible,
      showDates,
      showEditDialog,
      loading,
      progressInfo,
      editDialogVisible
    }
  }
}
</script>

<style>
.el-cascader {
  width: 100%;
}
</style>