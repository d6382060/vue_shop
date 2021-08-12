<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button @click="rolesDiallogVisible = true" type="primary"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot:default="{ row }">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for 循环 嵌套循环二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 左边 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(row, item2.id)"
                      type="success"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 右边三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot:default="{ row }">
            <!-- 编辑按钮区域 -->
            <el-button
              @click="editButton(row.id)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <!-- 删除按钮区域 -->
            <el-button
              @click="deleteRoles(row.id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
            <!-- 分配权限区域 -->
            <el-button
              @click="showSetRightDialog(row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加用户" v-model="rolesDiallogVisible" width="50%">
      <!-- 内容主题区域 -->
      <el-form
        :model="rolesForm"
        :rules="editFromRules"
        ref="rolesFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="rolesForm.roleName" prop="roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="rolesForm.roleDesc" prop="roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rolesDiallogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUsers">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      @close="editFromRolesClosed"
      title="修改用户信息"
      v-model="editRolesVisible"
      width="50%"
    >
      <!-- 修改角色的面板 -->
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="70px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="editFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editFrom.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="yesEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      @close="setRightDialogClosed"
      title="分配权限"
      v-model="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :default-checked-keys="defKeys"
        default-expand-all
        show-checkbox
        node-key="id"
        :data="rightsList"
        :props="treeProps"
      ></el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getRoleList,
  addRoles, editGitUser,
  rolesList, deleteRolesList, deleteUserAu,
  getRightsList, rolesAuthority
} from '../../network/user'
import { onMounted, ref, reactive, toRefs } from 'vue'
export default {
  name: 'Roles',
  data () {
    return {
      // 修改表单的验证规则
      editFromRules: {
        email: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { type: 'email', message: '长度在 3 到 10 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  setup () {
    let rolesForm = reactive({
      roleName: '',
      roleDesc: ''
    })
    // 编辑对话框
    let editRolesVisible = ref(false)
    // 添加对话框
    let rolesDiallogVisible = ref(false)
    // 权限飞分配对话框
    let setRightDialogVisible = ref(false)
    const rolelist = ref([])
    // 查询到的用户信息
    let editFrom = ref({})

    // 权限列表数据
    const rightsList = ref([])
    // 树形控件的属性绑定对象
    const treeProps = reactive({
      children: 'children',
      label: 'authName'
    })

    // 角色的ID
    const roleId = ref()
    // 默认选中的节点ID值数据
    const defKeys = ref([])

    // 初始化数据
    const init = () => {
      getRoleList().then(res => {
        if (res.data.meta.status != 200)
          return ElMessage({
            type: 'error',
            message: '获取角色列表失败',
          });
        rolelist.value = res.data.data
      })
    }

    // 点击确定按钮 添加角色
    const rolesFormRef = ref()
    const addUsers = () => {
      rolesFormRef.value.validate(valid => {
        console.log(valid);
        if (!valid) return
        // 可以发起添加用户的网络请求
        addRoles(rolesForm).then(res => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            ElMessage({
              showClose: true,
              message: res.data.meta.msg,
              type: 'error'
            })
          } else {
            ElMessage({
              showClose: true,
              message: '添加用户成功',
              type: 'success'
            });
            // 隐藏添加用户的对话框
            rolesDiallogVisible.value = false
            // 重新更新列表
            init()
          }
        })
      })
    }

    // 编辑按钮
    const editButton = (id) => {
      editRolesVisible.value = true
      rolesList(id).then(res => {

        if (res.data.meta.status !== 200) {
          ElMessage({
            showClose: true,
            message: '查询用户信息失败',
            type: 'error'
          })

        } else {
          // 保存数据到  editFrom 对象 并且绑定到表格中
          editFrom.value = res.data.data
        }
      })
    }

    // 监听修改用户对话框的关闭事件
    const editFromRef = ref()
    const editFromRolesClosed = () => {
      editFromRef.value.resetFields()
    }
    // 确认编辑信息
    const yesEdit = () => {
      editFromRef.value.validate(valid => {
        if (!valid) return

        // 校验通过 可以发起添加用户的网络请求
        editGitUser(editFrom.value.roleId,
          {
            roleName: editFrom.value.roleName,
            roleDesc: editFrom.value.roleDesc
          }).then(res => {

            if (res.data.meta.status !== 200) {
              ElMessage({
                showClose: true,
                message: res.data.meta.msg,
                type: 'error'
              })

            } else {
              // 提示修改成功
              ElMessage({
                showClose: true,
                message: '更新成功',
                type: 'success'
              });
              // 关闭对话框
              editRolesVisible.value = false
              // 刷新数据列表
              init()

            }
          })
      })
    }
    // 删除部分
    // 删除按钮点击事件
    const deleteRoles = (id) => {
      ElMessageBox.confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteRolesList(id).then(res => {
            if (res.data.meta.status !== 200)
              return ElMessage({
                type: 'error',
                message: res.data.meta.msg,
              });
            ElMessage({
              type: 'success',
              message: '删除成功!',
            });
            init()
          })

        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          });
        });
    }

    // 删除权限
    const removeRightById = (userid, auid) => {
      // 弹框提示用户是否要删除
      ElMessageBox.confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUserAu(userid.id, auid).then(res => {

            if (res.data.meta.status !== 200) {
              return ElMessage({
                type: 'error',
                message: res.data.meta.msg,
              });
            }
            userid.children = res.data.data
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          });
        });

    }

    // 分配权限 按钮
    const showSetRightDialog = (role) => {
      roleId.value = role.id
      // 获取所有权限的数据
      getRightsList().then(res => {
        if (res.data.meta.status !== 200)
          return ElMessage({
            type: 'error',
            message: res.data.meta.msg,
          });
        // 把获取到的权限数据 进行赋值
        rightsList.value = res.data.data
      })
      // 递归获取三级节点的ID
      getteafKeys(role, defKeys)
      setRightDialogVisible.value = true

    }

    // 通过递归的形式获取角色下所有三级权限的ID 并保存在 defKeys 中
    const getteafKeys = (node, arr) => {
      // 如果当前node 节点不包含 Children 属性，则是三级节点
      if (!node.children) {
        return arr.value.push(node.id)
      }
      node.children.forEach(item => getteafKeys(item, arr))
    }

    // 监听 分配权限对话框的关闭时间
    const setRightDialogClosed = () => {
      // 对defksys 进行清空处理
      defKeys.value = []
    }
    // 获取 tree 组件的引用
    const treeRef = ref()
    // 点击确定为角色分配权限
    const allotRights = () => {
      const keys = ref([
        // 获取全部选中
        ...treeRef.value.getCheckedKeys(),
        ...treeRef.value.getHalfCheckedKeys()
      ])
      const idStr = keys.value.join(',')
      rolesAuthority(roleId.value, idStr).then(res => {
        if (res.data.meta.status !== 200)
          return ElMessage({
            type: 'error',
            message: res.data.meta.msg,
          });
        ElMessage({
          type: 'success',
          message: res.data.meta.msg,
        });
        setRightDialogVisible.value = false
        init()
      })
    }
    onMounted(() => {
      init()
    })

    return {
      rolelist,
      rolesDiallogVisible,
      rolesForm,
      addUsers,
      rolesFormRef,
      editButton,
      editRolesVisible,
      editFrom,
      editFromRef,
      editFromRolesClosed,
      yesEdit,
      deleteRoles,
      removeRightById,
      showSetRightDialog,
      setRightDialogVisible,
      rightsList,
      treeProps,
      defKeys,
      setRightDialogClosed,
      allotRights,
      treeRef

    }
  }
}
</script>

<style scoped lang='scss'>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>