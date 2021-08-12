<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- 第一列 -->
        <el-col :span="8">
          <el-input
            clearable
            @clear="int"
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
          >
            <template #append>
              <el-button @click="int" icon="el-icon-search"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDiallogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table border stripe :data="userlist" style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="{ row }">
            <el-switch @change="userStateChange(row)" v-model="row.mg_state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot:default="{ row }">
            <!-- 修改按钮 -->
            <el-button
              @click="showEditDialog(row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="deleteUser(row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色按钮 -->

            <el-tooltip
              :enterable="false"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                @click="setRole(row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码z组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      @close="addDialogClosed"
      v-model="addDiallogVisible"
      width="50%"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item type="email" label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDiallogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      @close="editFromDialogClosed"
      title="修改用户信息"
      v-model="editDialogVisible"
      width="50%"
    >
      <!-- 修改用户的面板 -->
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFromRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
        <el-form-item type="email" label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色角色的对话框 -->
    <el-dialog
      @close="setRoleDialogClosed"
      title="分配角色"
      v-model="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectdRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, toRefs, ref, defineComponent } from 'vue'
import {
  deletetUserInfo,
  editUser, getusersList,
  modifyStatus, addusers,
  getUsersInfo, geDistributetRolesList, Distributetusers
} from '../../network/user'
export default defineComponent(
  {
    name: 'Users',
    data () {
      // 验证手机号的验证规则
      var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的手机号'))

      }
      return {
        // 添加表单的验证规则
        addFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [

            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }

          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, message: '请输入正确的手机号', trigger: 'blur' },
          ],

        },
        // 修改表单的验证规则
        editFromRules: {
          email: [
            { required: true, message: '请输入用户邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkMobile, message: '请输入正确的手机号', trigger: 'blur' },
          ],
        }

      }

    },
    setup () {
      // 是否关闭添加用户框
      // 获取用户列表的参数对象
      const queryInfo = reactive({
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前每页展示的数据数量
        pagesize: 2
      })
      // 数据结构
      const userslist = reactive({
        userlist: [],
        total: 0,
      })
      //添加用户的表单数据
      let addForm = reactive({
        username: '',
        password: '',
        email: '',
        mobile: ''

      })

      // 控制添加用户对话框的显示与隐藏
      let addDiallogVisible = ref(false)

      // 控制修改用户对话框的显示与隐藏
      let editDialogVisible = ref(false)

      // 查询到的用户信息
      let editFrom = ref({})

      // 分配角色的对话框显示
      let setRoleDialogVisible = ref(false)
      // 需要被分配角色的用户信息
      let userInfo = reactive({
        username: '',
        role_name: '',
        id: ''
      })

      // 所有角色的数据列表
      let rolesList = ref([])
      // 以选中的角色ID值
      let selectdRoleId = ref('')
      // 初始化 用户列表数据
      const int = () => {
        getusersList(queryInfo).then(res => {
          if (res.status !== 200) return ElMessage.error('获取用户列表失败')
          userslist.userlist = res.data.data.users
          userslist.total = res.data.data.total


        })

      }
      // 监听 pagination 改变的事件
      const handleSizeChange = (val) => {
        queryInfo.pagesize = val
        int()

      };
      // 监听 页码值改变的事件
      const handleCurrentChange = (val) => {
        queryInfo.pagenum = val
        int()
      };
      // 监听switch 开关状态的改变
      const userStateChange = (userinfo) => {
        modifyStatus(userinfo.id, userinfo.mg_state).then(res => {
          // console.log(res);
          if (res.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state
            return ElMessage({
              showClose: true,
              message: '修改失败',
              type: 'error'
            });
          }
          ElMessage({
            showClose: true,
            message: '更新用户状态成功',
            type: 'success'
          });

        })
      }

      // 监听添加用户对话框的关闭事件
      const addFormRef = ref() // 拿到ref 引用对象
      const addDialogClosed = () => {
        addFormRef.value.resetFields()


      }
      // 点击按钮添加，新用户

      const addUser = () => {
        addFormRef.value.validate(valid => {
          console.log(valid);
          if (!valid) return
          // 可以发起添加用户的网络请求
          addusers(addForm).then(res => {
            console.log(res);
            if (res.data.meta.status !== 201) {
              ElMessage({
                showClose: true,
                message: '添加用户失败',
                type: 'error'
              })
            } else {
              ElMessage({
                showClose: true,
                message: '添加用户成功',
                type: 'success'
              });
              // 隐藏添加用户的对话框
              addDiallogVisible.value = false
              // 重新更新列表
              int()
            }
          })
        })
      }
      // 监听修改用户对话框的关闭事件
      const editFromRef = ref()
      const editFromDialogClosed = () => {
        editFromRef.value.resetFields()

      }
      // 点击确定按钮修改 ，用户信息
      const editUserInfo = () => {
        editFromRef.value.validate(valid => {
          if (!valid) return

          // 校验通过 可以发起添加用户的网络请求
          editUser(editFrom.value.id,
            {
              mobile: editFrom.value.mobile,
              email: editFrom.value.email
            }).then(res => {
              if (res.data.meta.status !== 200) {
                ElMessage({
                  showClose: true,
                  message: '更新信息失败',
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
                editDialogVisible.value = false
                // 刷新数据列表
                int()

              }
            })
        })
      }
      // 展示编辑用户的对话框
      const showEditDialog = (id) => {
        editDialogVisible.value = true
        // 调用接口，获取用户的信息
        getUsersInfo(id).then(res => {

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

      // 删除用户信息
      const deleteUser = (id) => {
        ElMessageBox.confirm('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            deletetUserInfo(id).then(res => {
              if (res.data.meta.status !== 200)
                return ElMessage({
                  type: 'error',
                  message: '权限不足，删除失败!',
                });
              ElMessage({
                type: 'success',
                message: '删除成功!',
              });
              int()
            })

          })
          .catch(() => {
            console.log('取消');
            ElMessage({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
      //  分配角色按钮事件处理函数
      const setRole = (userInfos) => {
        userInfo.username = userInfos.username
        userInfo.role_name = userInfos.role_name
        userInfo.id = userInfos.id
        // 在展示对话框之前获取所有角色的列表
        geDistributetRolesList().then(res => {
          if (res.data.meta.status !== 200) {
            return ElMessage({
              showClose: true,
              message: '查询用户信息失败',
              type: 'error'
            })

          }
          rolesList.value = res.data.data
          console.log(res);
        })
        setRoleDialogVisible.value = true
      }

      // 点击按钮分配角色----角色分配面板
      const saveRoleInfo = () => {
        if (!selectdRoleId.value) {
          return ElMessage({
            showClose: true,
            message: '请选择要分配的角色',
            type: 'error'
          })
        }
        Distributetusers(userInfo.id, selectdRoleId.value).then(res => {
          if (res.data.meta.status !== 200) {
            return ElMessage({
              showClose: true,
              message: res.data.meta.msg,
              type: 'error'
            })

          }
          ElMessage({
            type: 'success',
            message: res.data.meta.msg,
          });
          setRoleDialogVisible.value = false
          int()
        })

      }

      // 监听 分配角色对话框的关闭事件
      const setRoleDialogClosed = () => {
        selectdRoleId.value = ''
      }
      onMounted(() => {
        int()
      })
      return {
        ...toRefs(userslist),
        handleSizeChange,
        handleCurrentChange,
        queryInfo,
        userStateChange,
        int,
        addDiallogVisible,
        addForm,
        addDialogClosed,
        addFormRef,
        addUser,
        showEditDialog,
        editDialogVisible,
        editFrom,
        editFromDialogClosed,
        editFromRef,
        editUserInfo,
        deleteUser,
        setRoleDialogVisible,
        setRole,
        userInfo,
        rolesList,
        selectdRoleId,
        saveRoleInfo,
        setRoleDialogClosed

      }

    }
  }
)
</script>

<style lang='scss' scoped>
</style>