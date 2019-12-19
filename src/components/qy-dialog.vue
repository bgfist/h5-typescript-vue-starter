<template lang="pug">
  el-dialog.simple-dialog(:visible.sync='dialogVisible',
    :title='title',
    :close-on-click-modal='closeOnClickModal',
    :before-close='handleDialogClose',
    @open='handleDialogOpen'
    )
    qy_form(:formData="dialogFormConfig" ref='qyForm' @on-click-btn='handleClickBtn', 
      @on-value-change='handleFormValueChange')
</template>

<script>
import { Loading } from "element-ui"
import qy_form from "@/components/qy-form.vue"

export default {
  name: "qy-dialog",
  components: {
    qy_form
  },
  props: {
    dialogFormConfig: Object,
    title: String
  },
  data() {
    return {
      dialogVisible: false,
      isLoading: false,
      closeOnClickModal: false,
      loadingIns: null,
      formTempValue: {} // 缓存传入表单的初始值
    }
  },
  computed: {},
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.clearValidate()
      this.dialogVisible = false
    },
    handleDialogOpen() {
      this.formTempValue = JSON.parse(JSON.stringify(this.dialogFormConfig.data))
    },
    handleClickBtn({ data, btnStatus }) {
      switch (btnStatus) {
        case "confirm":
          this.handleConfirm()
          break
        case "cancel":
          this.closeDialog()
          break
        case "reset":
          this.resetForm("qyForm")
          break
        default:
      }
    },
    handleConfirm() {
      // this.dialogVisible = false
      this.$emit("on-submit")
    },
    /**
     * 初始化表单
     * 不再使用 resetFieilds 进行缓存。因为表单组件被复用并且不会销毁。
     * 因此多次打开表单，使用 resetFieilds 函数都会将值设置为第一次渲染表单的数据
     *
     * 解决方案是缓存每次传入表单的值，在点击重置时回写到当前表单中
     */
    resetForm(formName) {
      this.$refs[formName].resetForm()
      for (const key in this.formTempValue) {
        this.dialogFormConfig.data[key] = JSON.parse(JSON.stringify(this.formTempValue[key]))
      }
    },
    clearValidate() {
      this.$refs.qyForm && this.$refs.qyForm.clearValidate()
    },
    /**
     * 重设表单某字段数据
     */
    resetFormItem(key, val) {
      this.dialogFormConfig.data[key] = val
    },
    /**
     * 模态框关闭的回调
     */
    handleDialogClose(done) {
      this.clearValidate()
      done()
    },
    /**
     * 展示 loading
     */
    showLoading() {
      // let target = document.querySelector('.el-dialog')
      const options = {
        // target,
        background: "rgba(0,0,0,.2)"
      }
      this.loadingIns = Loading.service(options)
    },
    /**
     * 关闭 loading
     */
    hideLoading() {
      this.loadingIns.close()
    },
    handleFormValueChange({ model, value }) {
      this.$emit("on-form-value-change", { model, value })
    }
  }
}
</script>

<style lang="stylus"></style>
