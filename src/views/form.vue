<template lang="pug">
qy-form(:fields="fields", :data="detail", type="edit", label-width="150px", @submit="submit", inline, label-position="left")
</template>

<script>
import Vue from "vue"
import { mapState } from "vuex"

export default Vue.extend({
  data() {
    return {
      detail: {},
      orgTypes: [],
      provinceCitys: []
    }
  },
  computed: {
    /** @return {QyForm.Field[]} */
    fields() {
      return [
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
        },
        {
          type: "cascader",
          label: "示例级联",
          prop: "address",
          options: this.provinceCitys
        },
        {
          type: "cascader",
          label: "示例级联2",
          prop: "address2",
          options: this.provinceCitys,
          checkStrictly: true
        },
        {
          type: "selector",
          label: "示例多选",
          prop: "orgType3",
          options: this.orgTypes,
          multiple: true
        },
        {
          type: "switch",
          label: "示例开关",
          prop: "isVIP"
        },
        {
          type: "radio",
          label: "示例开关2",
          prop: "showPower",
          options: [
            {
              label: "显示",
              value: true
            },
            {
              label: "隐藏",
              value: false
            }
          ]
        },
        {
          type: "input",
          label: "示例正整数",
          prop: "goodsCount",
          valueType: "count"
        },
        {
          type: "input",
          label: "示例小数",
          prop: "goodsPrice",
          valueType: "number"
        },
        {
          type: "input",
          label: "示例百分比(%)",
          prop: "serviceRate",
          valueType: "percent"
        },
        {
          type: "input",
          label: "示例电话号码",
          prop: "phone",
          valueType: "phone"
        },
        {
          type: "input",
          label: "示例文本",
          prop: "title"
        },
        {
          type: "input",
          label: "示例搜索",
          prop: "search",
          valueType: "search",
          placeholder: "订单ID"
        },
        {
          type: "input",
          label: "示例文本域",
          prop: "remark",
          valueType: "textarea"
        },
        {
          type: "date",
          label: "示例日期",
          prop: "createAt"
        },
        {
          type: "daterange",
          label: "示例日期范围",
          prop: "startDate",
          endDateProp: "endDate"
        },
        {
          type: "date",
          label: "示例未来日期",
          prop: "planDate",
          limit: "future"
        },
        {
          type: "input",
          label: "示例禁用",
          prop: "yourName",
          disabled: true
        },
        {
          type: "input",
          label: "示例禁用(动态)",
          prop: "yourName2",
          disabled: formData => {
            return formData.orgType === 2
          }
        },
        {
          type: "input",
          label: "示例输入必选",
          prop: "yourName3",
          valueType: "count",
          placeholder: "请输入你的姓名",
          required: true
        },
        {
          type: "selector",
          label: "示例下拉必选",
          prop: "orgType4",
          options: this.orgTypes,
          required: true
        },
        {
          type: "selector",
          label: "示例透传其他属性",
          prop: "orgType5",
          options: this.orgTypes,
          size: "small" // 会透传到form-item和上，不会覆盖已有属性
        }
      ]
    }
  },
  mounted() {
    // 动态获取下拉选项
    setTimeout(() => this.getOrgTypes(), 2000)
    setTimeout(() => this.getProvinceCitys(), 2000)
    setTimeout(() => this.getDetail(), 2000)
  },
  methods: {
    getOrgTypes() {
      this.orgTypes = [
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
      ]
    },
    getProvinceCitys() {
      this.provinceCitys = [
        {
          label: "北京市",
          value: 10001,
          children: [
            {
              label: "朝阳区",
              value: 101
            },
            {
              label: "长安区",
              value: 102
            }
          ]
        },
        {
          label: "湖北省",
          value: 10002,
          children: [
            {
              label: "武汉市",
              value: 101
            },
            {
              label: "荆门市",
              value: 102
            }
          ]
        }
      ]
    },
    getDetail() {
      this.detail = {
        orgType: 1,
        orgType2: 2
      }
    },
    submit(formData) {
      console.log(formData)
    }
  }
})
</script>
