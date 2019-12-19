declare namespace QyForm {
  interface Option {
    label: string
    value: any
  }

  interface CascaderOption extends Option {
    children?: CascaderOption[]
  }

  interface IField {
    type: string
    prop: string
    label: string
    required?: boolean
    disabled?: boolean | ((formData: object) => boolean)
    rules?: any[]
  }

  interface SelectorField extends IField {
    type: "selector"
    options: Option[]
    multiple?: boolean
  }

  interface RadioField extends IField {
    type: "radio"
    options: Option[]
  }

  interface CascaderField extends IField {
    type: "cascader"
    options: CascaderOption[]
    checkStrictly?: boolean
  }

  interface SwitchField extends IField {
    type: "switch"
  }

  interface InputField extends IField {
    type: "input"
    valueType?: "count" | "number" | "text" | "percent" | "phone" | "textarea" | "search"
    width?: boolean
  }

  /** 只适用于日期单位为“天”(带快捷选项)，其他单位自行定制 */
  interface DateField extends IField {
    type: "date"
    limit?: "past" | "future"
  }

  interface DateRangeField extends IField {
    type: "daterange"
    limit?: "past" | "future"
    dateEndProp: string
  }

  interface CustomField extends IField {
    type: "custom"
  }

  type Field = SelectorField | RadioField | CascaderField | SwitchField | InputField | DateField | DateRangeField | CustomField

  interface FormSection {
    title: string
    fields: Field[]
  }

  interface Props {
    fields: Field[] | FormSection[]
    data?: object
    type: "new" | "edit" | "detail" | "search"
  }
}

interface QyForm {
  submit(): void
}
