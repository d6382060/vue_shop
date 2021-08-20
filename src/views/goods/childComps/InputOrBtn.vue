<template>
  <el-tag
    :key="index"
    v-for="(item, index) in row.attr_vals"
    closable
    :disable-transitions="false"
    @close="handleClose(index, row)"
  >
    {{ item }}
  </el-tag>
  <el-input
    class="input-new-tag"
    v-if="inputVisible"
    v-model="inputValue"
    ref="saveTagInput"
    size="small"
    @keyup.enter.native="handleInputConfirm(row)"
    @blur="handleInputConfirm(row)"
  >
  </el-input>
  <el-button v-else class="button-new-tag" size="small" @click="showInput">
    + New Tag
  </el-button>
</template>

<script>
import { editSubmitAttrId } from '../../../network/goods'
export default {
  name: 'InputOrBtn',
  props: {
    row: {
      type: Object,
      default () {
        return {}
      }
    },
    cateId: {
      type: Number
    }

  },
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      cateIds: this.$props.cateId
    };
  },
  methods: {
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    showInput () {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 文本框失去焦点，或摁下了 Enter 都会触发
    handleInputConfirm (row) {
      let inputValue = this.inputValue;

      if (inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      if (inputValue) {
        row.attr_vals.push(inputValue);
      }
      // 需要发起请求，保存这次操作
      this.saveAttrVals(row)
      this.inputValue = ''
      this.inputVisible = false


    },
    // 将对 attr_vals 的操作，保存到数据库
    saveAttrVals (row) {
      editSubmitAttrId(this.cateIds, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('修改参数项失败！')
        }
        this.$message.success('修改参数项成功！')
      })
    }
  },
}

</script>

<style scoped lang='scss'>
.el-tag {
  margin: 10px;
}
.el-input {
  width: 100px;
}
</style>