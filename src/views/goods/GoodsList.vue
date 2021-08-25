<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 第一列 -->
        <el-col :span="8">
          <el-input
            clearable
            @clear="getGoodsList"
            placeholder="请输入内容"
            v-model="goodsInfo.query"
            class="input-with-select"
          >
            <template #append>
              <el-button
                @click="getGoodsList"
                icon="el-icon-search"
              ></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区 -->
      <el-table
        border
        stripe
        v-loading="loading"
        :data="goodsList"
        style="width: 100%"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" width="140px">
          <template v-slot:default="{ row }">
            {{ showDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template late v-slot:default="{ row }">
            <!-- 修改按钮 -->
            <el-button
              v-loading.fullscreen.lock="loading"
              @click="showEditDialog(row.goods_id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              v-loading.fullscreen.lock="loading"
              @click="deleteCommodity(row.goods_id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码z组件 -->
      <el-pagination
        v-loading.fullscreen.lock="loading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsListData, deleteCommodity } from '../../network/goods'
export default {
  name: 'GoodsList',
  data () {
    return {
      // 商品列表数据
      goodsList: [],
      // 查询参数对象
      goodsInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前每页展示的数据数量
        pagesize: 10
      },
      total: 0,
      // loading 加载
      loading: true
    }
  },
  methods: {
    // 获取商品列表数据
    getGoodsList () {
      getGoodsListData(this.goodsInfo).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return ElMessage.error('获取商品列表失败')
        }
        setTimeout(() => {
          this.loading = false
        }, 1000)
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total

      })
    },
    // 监听 pagination 改变的事件
    handleSizeChange (val) {
      this.loading = true;
      this.goodsInfo.pagesize = val
      setTimeout(() => {
        this.loading = false
      }, 1000)
      this.getGoodsList()
    },
    // 监听 页码值改变的事件
    handleCurrentChange (val) {
      this.loading = true;
      this.goodsInfo.pagenum = val
      setTimeout(() => {
        this.loading = false
      }, 1000)
      this.getGoodsList()
    },

    // 删除商品
    deleteCommodity (goods_id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除的业务逻辑
        this.loading = true;
        deleteCommodity(goods_id).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('删除参数失败！')
          }
          setTimeout(() => {
            this.loading = false
          }, 1000)
          this.$message.success('删除参数成功！')
          this.getGoodsList()

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    goAddpage () {
      this.$router.push('/goods/add')
    },
    showEditDialog () {
      console.log(666);
    }
  },
  computed: {
    showDate () {
      let time = ''
      this.goodsList.forEach(item => {
        time = item.add_time
      });
      const dt = new Date(time)

      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')

      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
  },
  created () {
    this.getGoodsList()

  },
}
</script>

<style>
</style>