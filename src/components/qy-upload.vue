<template lang="pug">
el-upload(action="" :http-request="upload" v-bind="$attrs")
  slot(name="trigger" slot="trigger")
  slot()
  slot(name="tip" slot="tip")
</template>

<script>
import Vue from "vue"
import AliOSS from "ali-oss"
import { ossConfig } from "@/business/config"

/**
 * TODO:
 *  file-list 同步优化
 *  1. 服务器一般返回一个url列表，所以要从url提取文件名
 *  2. 使其支持 sync
 */
export default Vue.extend({
  name: "QyUpload",
  inheritAttrs: false,
  data() {
    return {}
  },
  methods: {
    upload(event) {
      const { file } = event
      const filename = `data/${Date.now()}${this.getSuffix(file.name)}`
      const client = new AliOSS({
        region: ossConfig.region,
        accessKeyId: ossConfig.accessKeyId,
        accessKeySecret: ossConfig.accessKeySecret,
        bucket: ossConfig.bucket
      })
      client
        .multipartUpload(filename, file, {
          progress(percent, checkpoint, res) {
            event.onProgress &&
              event.onProgress({
                percent: percent * 100
              })
          }
        })
        .then(res => {
          const url = `https://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com/${filename}`
          event.onSuccess &&
            event.onSuccess({
              ...res,
              url
            })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },

    /**
     * 获取文件后缀名
     * @param {string} filename 文件名
     * @return {string} suffix
     */
    getSuffix(filename) {
      const pos = filename.lastIndexOf(".")
      const suffix = pos !== -1 ? filename.substring(pos) : ""
      return suffix
    }
  }
})
</script>
