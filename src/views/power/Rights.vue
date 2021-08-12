<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot:default="{ row }">
            <el-tag v-show="row.level === '0'">一级</el-tag>
            <el-tag v-show="row.level === '1'" type="success">二级</el-tag>
            <el-tag v-show="row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getrightsList } from '../../network/Authority'
import { ref, reactive } from 'vue'
export default {
  name: "Rights",
  setup () {
    //  数据结构
    // 所有的权限列表
    const rightsList = ref([])

    // 初始化数据
    const init = () => {
      getrightsList().then(res => {
        if (res.data.meta.status !== 200)
          return ElMessage({
            type: 'error',
            message: '获取权限列表失败',
          });
        rightsList.value = res.data.data
        // console.log(rightsList.value);
      })

    }
    init()


    return {
      rightsList
    }
  }
}
</script>

<style scoped lang='scss'>
</style>