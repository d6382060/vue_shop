<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        center
        show-icon
        title="添加商品信息"
        type="info"
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title=" 商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          :tab-position="'left'"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="(item, index) in item.attr_vals"
                  :label="item"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传的后台API地址 -->
            <el-upload
              :on-success="handleSuccess"
              :headers="headersObj"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  只能上传 jpg/png 文件，且不超过 500kb
                </div>
              </template>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- <QuillEditor theme="snow" /> -->
             <quill-editor
              ref="editor"
              :options="editorOption"
              toolbar="full"
              theme="snow"
            >
            </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button @click="add" type="primary" class="btnAdd"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" v-model="previewVisible" width="80%">
      <img class="previewImg" :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, addCommodity, getAttributeslist } from '../../network/goods'
import _ from 'lodash'
export default {
  name: 'Add',
  data () {
    return {
      editorOption: {
        placeholder: '只支持文本，不支持图片链接等...',
        modules: {
          toolbar: '#toolbar',
        },
      },
      // 所有商品分类数据
      cateList: [],
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数据
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      // 校验规则
      addFormrules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },

      //  商品参数列表数据
      manyTableData: [],
      // 商品属性列表数据
      onlyTableData: [],
      sel: 'many',
      // 上传图片的地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      // 打开隐藏对话框
      previewVisible: false


    }
  },

  methods: {
    getCateList () {
      getGoodsList().then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        this.cateList = res.data.data
      })
    },
    // 级联选择器选中项变化会触发这个函数
    handleChange () {
      console.log(this.addForm.goods_cat);

      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      // console.log('即将离开的标签页' + oldActiveName);
      // console.log('即将进入的标签页' + activeName);
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }

    },
    // 获取 参数列表 的请求
    getGoodsList () {
      getAttributeslist(this.cateId, this.sel).then(res => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取商品分类失败！')
        }
        res.data.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data.data
        this.onlyTableData = res.data.data
      })
    },
    tabClicked () {
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        this.getGoodsList()
      } else if (this.activeIndex === '2') {
        this.sel = 'only'
        this.getGoodsList()

      }
    },

    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //  处理移除图片的操作
    handleRemove (file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path

      // 2. 从pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => {
        x.pics === filePath
      })
      // 3 .调用数组的splice 方法 ， 把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
    },

    // 监听图片上传成功的事件
    handleSuccess (response) {
      console.log(response);
      // 1.拼接，的到一个图片信息对象
      const picInfo = {
        pics: response.data.tmp_path
      }

      //2.将图片信息对象 push到 pics 数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add () {
      // 把获取到的P 标签的值 赋值给 addForm 下的 goods_introduce
      // 获取 quill 元素
      const quill = this.$refs.editor
      let values = quill.getContents()
      values.forEach(item => {
        this.addForm.goods_introduce = item.insert
      })
      this.$refs.addFormRef.validate(
        valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项目')
          }
          // 执行添加的业务逻辑
          // lodash  cloneDeep(obj)
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          // 处理动态参数 和 静态属性
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })
          form.attrs = this.addForm.attrs
          addCommodity(form).then(res => {
            if (res.data.meta.status !== 201) {
              return this.$message.error(res.data.meta.msg)
            }
            this.$router.push('/goods')
          })
        }
      )
    }

  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style scoped lang='scss'>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>