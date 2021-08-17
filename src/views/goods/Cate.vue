<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddCateDiallogVisible"
            >添加分类
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="catelist"
        style="width: 100%"
        row-key="cat_id"
        border
        lazy
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template #default="scope">
            <!-- // true时的图标 -->
            <el-icon v-show="!scope.row.cat_deleted" :size="20" color="#409EFC">
              <circle-check-filled />
            </el-icon>
            <!-- false 时的图标 -->
            <el-icon v-show="scope.row.cat_deleted" :size="20" color="red">
              <circle-close-filled />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" sortable label="排序">
          <template #default="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              size="mini"
              v-else-if="scope.row.cat_level === 1"
              type="success"
              >二级</el-tag
            >
            <el-tag size="mini" v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cat_pid" label="操作">
          <template #default="scope">
            <el-button
              @click="editClick(scope.row.cat_id)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              @click="deleteClick(scope.row.cat_id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类卡片区域 -->
    <el-dialog
      title="添加分类"
      @close="addCateDialogClosed"
      v-model="addCateDiallogVisible"
      width="50%"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRulesRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateDiallogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 商品分类编辑对话框 -->
    <el-dialog
      title="编辑分类名称"
      v-model="editCateDiallogVisible"
      width="50%"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCateDiallogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getGoodsList, addCatwGories, editCate,
  getCatename, deleteCategories
} from '../../network/goods'
import { onMounted, reactive, ref, toRefs } from '@vue/runtime-core'
export default {
  name: 'Cate',
  components: {
    CircleCheckFilled,
    CircleCloseFilled
  },
  data () {
    return {
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' },
        ]
      }
    }
  },
  setup () {

    // 分类ID
    const cateGoriesId = ref('')

    // 编辑分类名称对话框显示与隐藏
    let editCateDiallogVisible = ref(false)

    // 选中的父级分类的ID数据
    const selectedKeys = ref([])

    // 查询条件
    const querInfo = reactive({
      type: 3,
      pagenum: 1,
      pagesize: 5
    })
    // 添加分类的表单数据对象
    const addCateForm = reactive({
      // 将要添加的分类的名称
      cat_name: '',
      //分类的父ID
      cat_pid: 0,
      // 分类的层级
      cat_level: 0
    })
    // 父级分类的列表数据
    const parentCateList = ref([])

    // 指定级联选择器的配置对象
    let cascaderProps = reactive({
      value: 'cat_id',
      label: 'cat_name',
      children: 'children',
      checkStrictly: true,
      expandTrigger: 'hover'
    })
    // 商品分类的数据列表 默认为空
    let catelist = ref([])
    // 总数据条数
    let total = ref(0)
    //为table指定列的定义
    let columns = ref([{
      label: '分类名称',
      prop: 'cat_name',
    },])
    const defaultProps = reactive({
      children: 'children',
      label: 'cat_name'
    })
    // 是否显示添加商品对话框
    let addCateDiallogVisible = ref(false)
    const showaddCateDiallogVisible = () => {
      addCateForm.cat_name = ''
      // 获取分级分类列表的数据
      getGoodsList({ type: 2 }).then(res => {
        if (res.status !== 200) {
          return ElMessage.error('获取父级分类数据失败')
        }
        parentCateList.value = res.data.data
      })
      addCateDiallogVisible.value = true
    }
    // 初始化商品分类数据
    const init = () => {
      getGoodsList(querInfo).then(res => {
        if (res.status !== 200) {
          return ElMessage.error('获取用户列表失败')
        } else {
          catelist.value = res.data.data.result
          total.value = res.data.data.total
        }

      })
    }

    // 选择项发生变化触发
    const parentCateChange = () => {
      // 如果 selectedKeys 中的 lengrth 大于0 证明选中了 父级分类
      // 反之说明没有选中任何父级分类
      if (selectedKeys.value !== null) {
        // 父级分类的ID
        addCateForm.cat_pid = selectedKeys.value[selectedKeys.value.length - 1]
        // 为当前分类的等级赋值
        addCateForm.cat_level = selectedKeys.value.length
        return
      } else {
        //父级分类的ID
        addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        addCateForm.cat_level = 0
      }

    }
    // 监听 添加分类对话框的关闭事件，重置表单数据
    let addCateFormRulesRef = ref()
    const addCateDialogClosed = () => {
      addCateFormRulesRef.value.resetFields()
      selectedKeys.value = []
      addCateForm.cat_level = 0
      addCateForm.cat_pid = 0
    }
    // 点击按钮添加新的分类
    const addCate = () => {
      addCateFormRulesRef.value.validate(valid => {
        if (!valid) return
        addCatwGories(addCateForm).then(res => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            ElMessage.error(res.data.meta.msg)
          } else {
            ElMessage({
              showClose: true,
              message: '更新成功',
              type: 'success'
            });
            init()
          }
        })
        addCateDiallogVisible.value = false
      }
      )
    }
    // 监听pagesize 改变的事件处理
    const handleSizeChange = (newSize) => {
      querInfo.pagesize = newSize
      init()
    }
    // 点击编辑按钮显示对话框,和获取商品名称
    const editClick = (id) => {
      cateGoriesId.value = id
      getCatename(id).then(res => {
        if (res.data.meta.status !== 200)
          return ElMessage.error('获取信息失败')
        addCateForm.cat_name = res.data.data.cat_name

      })
      editCateDiallogVisible.value = true
    }

    // 点击编辑分类对话框 确定按钮，修改分类名称
    const editCateClick = () => {
      editCate(cateGoriesId.value, addCateForm.cat_name).then(res => {
        if (res.data.meta.status !== 200)
          return ElMessage.error(res.data.meta.msg)
        ElMessage({
          showClose: true,
          message: '更新成功',
          type: 'success'
        });
        editCateDiallogVisible.value = false
        init()
      })

    }
    // 监听 pagenum 的改变
    const handleCurrentChange = (newPage) => {
      querInfo.pagenum = newPage
      init()
    }

    // 删除按钮事件
    const deleteClick = (id) => {
      ElMessageBox.confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteCategories(id).then(res => {
          console.log(res);
          if (res.data.meta.status !== 200)
            return ElMessage.error(res.data.meta.msg)
          ElMessage({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
          init()
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消删除',
        });
      })


    }


    onMounted(() => {
      init()
    })

    return {
      catelist,
      columns,
      defaultProps,
      handleSizeChange,
      handleCurrentChange,
      total,
      querInfo,
      showaddCateDiallogVisible,
      addCateDiallogVisible,
      addCateForm,
      parentCateList,
      cascaderProps,
      parentCateChange,
      parentCateList,
      selectedKeys,
      addCate,
      addCateDialogClosed,
      addCateFormRulesRef,
      editCateDiallogVisible,
      editClick,
      editCateClick,
      deleteClick
    }
  }
}
</script>

<style scoped lang='scss'>
</style>