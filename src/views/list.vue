<template lang="pug">
div(class="page")
  qy-table(class="page__lt", :tableConfig="tableConfig", :operationConfig="operationConfig", :searchConfig="searchConfig", :currentRow.sync="currentRow",
    :onFetchTableData="fetchDemoList1", border)
  el-card(class='page__rt item')
    div(slot="header") 附加信息
    div(v-if="!currentRow") 无
    div(v-else)
      div(class='item__name') {{currentRow.name}}
      div(class='item__age')  {{currentRow.age}}
</template>

<script>
import Vue from "vue"
import { getDemoList } from "../api"

export default Vue.extend({
  data() {
    return {
      orgTypes: [
        {
          value: 1,
          label: "学校"
        },
        {
          value: 2,
          label: "公寓"
        },
        {
          value: 3,
          label: "酒店"
        }
      ],
      currentRow: null
    }
  },
  computed: {
    /** @returns {QyTable.Column[]} */
    tableConfig() {
      return [
        {
          prop: "name",
          label: "名称"
        },
        {
          prop: "age",
          label: "年龄"
        },
        {
          prop: "remark",
          label: "备注",
          width: "200px"
        },
        {
          type: "action",
          options: [
            {
              label: "变年轻",
              disabled(row) {
                return row.age < 30
              },
              handler: row => {
                this.$message({
                  type: "success",
                  message: `${row.name}年轻了十岁`
                })
              }
            },
            {
              label: "删除",
              type: "danger",
              handler: row => {
                this.$message({
                  type: "success",
                  message: `删除成功`
                })
              }
            },
            {
              label: "查看",
              type: "primary",
              handler: row => {
                console.log("查看", row)
              }
            }
          ]
        }
      ]
    },
    /** @returns {QyTable.Operation[]} */
    operationConfig() {
      return [
        {
          label: "创建",
          handler() {
            console.log("创建")
          }
        },
        {
          label: "批量分配",
          type: "selection",
          handler(selection) {
            console.log("批量选择", selection)
          }
        },
        {
          label: "新建下属",
          type: "currentRow",
          handler(currentRow) {
            console.log("新建下属", currentRow)
          }
        },
        {
          label: "导出",
          type: "export",
          handler(params) {
            console.log("新建下属", params)
          }
        }
      ]
    },
    /** @returns {QyForm.Field[]} */
    searchConfig() {
      return [
        {
          type: "input",
          label: "示例搜索",
          prop: "search",
          valueType: "search",
          placeholder: "机构名/BD名"
        },
        {
          type: "selector",
          label: "示例下拉",
          prop: "orgType",
          options: this.orgTypes
        },
        {
          type: "radio",
          label: "示例单选",
          prop: "orgType2",
          options: this.orgTypes
        }
      ]
    }
  },
  methods: {
    fetchDemoList1(params) {
      return getDemoList(params)
    },
    fetchDemoList2(params) {
      return getDemoList(params)
    },
    handleViewDetail() {}
  }
})
</script>

<style lang="stylus" scoped>
.page
  display flex
  align-items flex-start

  &__lt
    flex 1

  &__rt
    margin-left 40px
    margin-top 250px
    width 400px
</style>
