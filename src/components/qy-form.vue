<template lang="pug">
el-form(ref="form", :model="model", :rules="rules", :disabled="isDetail", 
  :class="isDetail ? 'qy-form__is-detail' : ''", v-bind="$attrs")
  el-card(v-for="formSection, index in formSections", :key="index")
    div(slot="header") {{formSection.title}}
    el-form-item(v-for="field, index in formSection.fields", :key="index", :label="field.label", :prop="field.prop", v-bind="field")
      el-select(v-if="field.type==='selector'", v-model="model[field.prop]", :placeholder="getPlaceHolder('请选择')", :multiple="!!field.multiple", 
        clearable, filterable, :disabled="typeof field.disabled==='function' ? field.disabled(formData) : !!field.disabled")
        el-option(v-for="option, index in field.options", :key="index", :label="option.label", :value="index")
      el-radio-group(v-if="field.type==='radio'", v-model="model[field.prop]", 
        :disabled="typeof field.disabled==='function' ? field.disabled(formData) : !!field.disabled")
        el-radio(v-for="option, index in field.options", :key="index", :label="index")  {{option.label}}
      el-cascader(v-if="field.type==='cascader'", v-model="model[field.prop]", :placeholder="getPlaceHolder('请选择')",
        :props="{ expandTrigger: 'hover', checkStrictly: !!field.checkStrictly }", :options="field.options", clearable, filterable,
        :disabled="typeof field.disabled==='function' ? field.disabled(formData) : !!field.disabled")
      el-select(v-if="field.type==='switch'", v-model="model[field.prop]", :placeholder="getPlaceHolder('请选择')", clearable, filterable,
        :disabled="typeof field.disabled==='function' ? field.disabled(formData) : !!field.disabled")
        el-option(label="是", :value="1")
        el-option(label="否", :value="0")
      el-input(v-if="field.type==='input'", v-model.trim="model[field.prop]", :placeholder="getPlaceHolder(field.placeholder)",
        :type="getInputType(field.valueType)", :style="{width: field.width || 'auto'}", clearable, :prefix-icon="field.valueType==='search' ? 'el-icon-search' : ''",
        :disabled="typeof field.disabled==='function' ? field.disabled(formData) : !!field.disabled")
      el-date-picker(v-if="field.type==='date'", v-model="model[field.prop]", :placeholder="getPlaceHolder('选择日期')", value-format="yyyy-MM-dd",
        type="date", :pickerOptions="getDatePickerOptions(field)", clearable,
        :disabled="typeof field.disabled==='function' ? field.disabled(formData) : !!field.disabled")
      el-date-picker(v-if="field.type==='daterange'", v-model="model[field.prop]", type="daterange", :pickerOptions="getDatePickerOptions(field)",
        range-separator="至", :start-placeholder="getPlaceHolder('开始日期')", :end-placeholder="getPlaceHolder('结束日期')", clearable, value-format="yyyy-MM-dd",
        :disabled="typeof field.disabled==='function' ? field.disabled(formData) : !!field.disabled")
      slot(v-if="field.type==='custom'", :name="field.prop")
    div(style="margin-top: 40px", v-if="(type==='new' || type==='edit') && !isFormSection",)
      el-button(type="primary", @click="submit") 保存
    div(style="margin-top: 20px", v-if="type==='search'")
      el-button(type="primary", size="small", @click="submit") 筛选
      el-button(@click="resetFields", size='small') 重置
  el-button(v-if="type!=='detail' && isFormSection", type="primary",  @click="submit") 保存
</template>
<script>
import Vue from "vue"
import { Form } from "element-ui"
import dayjs from "dayjs"
import { isEmpty, sillyClone } from "@/utils/utils"

export default {
  name: "QyForm",
  inheritAttrs: false,
  props: {
    /** 表单配置项 */
    fields: {
      type: Array,
      required: true
    },
    /** 表单详情数据 */
    data: {
      type: Object,
      default: function() {
        return {}
      }
    },
    /** 新建 or 编辑 or 详情 or 筛选 */
    type: {
      validator: function(value) {
        return ["new", "edit", "detail", "search"].indexOf(value) !== -1
      },
      required: true
    }
  },
  data() {
    return {
      model: {},
      rules: {}
    }
  },
  computed: {
    isDetail() {
      return this.type === "detail"
    },
    isFormSection() {
      if (!this.fields.length) {
        return false
      }
      return typeof this.fields[0].title !== "undefined"
    },
    formSections() {
      if (this.isFormSection) {
        return this.fields
      }
      return [
        {
          title: {
            new: "创建",
            detail: "详情",
            edit: "编辑",
            search: "查询"
          }[this.type],
          fields: this.fields
        }
      ]
    },
    formFields() {
      return this.formSection ? this.fields.reduce((fields, section) => fields.concat(section.fields), []) : this.fields
    },
    formData() {
      return this.formFields.reduce((formData, field) => {
        const { type, prop } = field
        const modelValue = this.model[prop]
        if (isEmpty(modelValue)) {
          return formData
        }
        formData[prop] = modelValue

        if (type === "radio") {
          formData[prop] = field.options[modelValue].value
        } else if (type === "selector") {
          if (field.multiple) {
            formData[prop] = modelValue.map(v => field.options[v].value)
          } else {
            formData[prop] = field.options[modelValue].value
          }
        } else if (type === "input") {
          if (field.valueType === "percent") {
            formData[prop] = (modelValue / 100).toFixed(2)
          } else if (field.valueType === "number" || field.valueType === "count") {
            formData[prop] = Number(modelValue)
          }
        }

        return formData
      }, {})
    }
  },
  watch: {
    data() {
      this.calModel()
    },
    fields() {
      this.calModel()
    }
  },
  mounted() {
    this.calcRules()
    this.calModel()
  },
  methods: {
    calModel() {
      this.model = this.formFields.reduce((model, field) => {
        const { prop, type, options, valueType } = field
        const data = this.data
        const value = data[prop]
        if (isEmpty(value)) {
          model[prop] = ""
        } else {
          if (!options || !options.length) {
            return model
          }
          if (type === "radio") {
            model[prop] = options.findIndex(option => option.value === value)
          } else if (type === "selector") {
            if (field.multiple) {
              model[prop] = value.map(value => options.findIndex(option => option.value === value))
            } else {
              model[prop] = options.findIndex(option => option.value === value)
            }
          } else if (type === "input" && valueType === "percent") {
            model[prop] = (value * 100).toFixed(2)
          } else {
            model[prop] = value
          }
        }
        return model
      }, {})
      // 清除内部主动触发的校验
      this.$nextTick(() => this.$refs.form.clearValidate())
    },
    calcRules() {
      this.rules = this.formFields.reduce((rules, field) => {
        const { type, prop, label, valueType, required } = field
        let validators = []
        if (required) {
          validators.push({
            required: true,
            message: `${label}必填`,
            trigger: ["blur", "change"]
          })
        }
        if (type === "input") {
          if (valueType === "count") {
            validators.push({
              validator(rule, value, callback) {
                callback(value && Number(value) < 0 ? `${label}必须大于0` : undefined)
              },
              trigger: ["blur"]
            })
          } else if (valueType === "percent") {
            validators.push({
              validator(rule, value, callback) {
                callback(value && (Number(value) < 0 || Number(value) > 100) ? `${label}必须在0-100间` : undefined)
              },
              trigger: ["blur"]
            })
          } else if (valueType === "phone") {
            validators.push({
              validator(rule, value, callback) {
                callback(value && !/^\d{11}$/.test(value) ? `${label}格式不正确` : undefined)
              },
              trigger: ["blur"]
            })
          }
        }
        rules[prop] = validators
        return rules
      }, {})
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message.error("字段填写有误，请检查")
          return
        }
        console.log(this.formData)
        this.$emit("submit", this.formData)
        // this.$emit("submit", sillyClone(this.formData))
      })
    },
    resetFields() {
      this.model = {}
      this.submit()
    },
    getInputType(type) {
      if (type === "count" || type === "number" || type === "percent") {
        return "number"
      }
      if (type === "textarea") {
        return "textarea"
      }
      return "text"
    },
    getPlaceHolder(placeholder) {
      return this.isDetail ? "(无)" : placeholder
    },
    getDatePickerOptions(field) {
      const { limit = "past", type } = field
      const disabledDate = time => {
        if (limit === "past") {
          return (
            time.getTime() >
            dayjs()
              .endOf("date")
              .toDate()
              .getTime()
          )
        } else if (limit === "future") {
          return (
            time.getTime() <
            dayjs()
              .startOf("date")
              .toDate()
              .getTime()
          )
        }
      }
      const ret = {
        disabledDate
      }
      if (limit === "past" && type === "date") {
        ret.shortcuts = [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date())
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit("pick", date)
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", date)
            }
          }
        ]
      }
      if (limit === "past" && type === "daterange") {
        ret.shortcuts = [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit("pick", [start, end])
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit("pick", [start, end])
            }
          }
        ]
      }
      return ret
    }
  }
}
</script>
<style lang="stylus">
.qy-form__is-detail
  .is-disabled, .is-disabled *
    color unset !important
    background unset !important

.el-form-item__content
  width 300px
</style>
