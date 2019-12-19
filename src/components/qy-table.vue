<template lang="pug">
div()
  qy-form(v-if="searchConfig", :fields="searchConfig", type="search", :data="searchParams_", label-width="100px", @submit="fetchTableData", inline)
  div.operations(v-if="operationConfig")
    template(v-for="config,index in operationConfig")
      el-button(v-if="config.type==='selection'", size="medium", type="primary", @click="config.handler(selection_)", :disabled='!selection_.length') {{config.label}}
      el-button(v-if="config.type==='currentRow'",size="medium", type="primary", @click="config.handler(currentRow_)") {{config.label}}
      el-button(v-if="config.type==='export'",size="medium", type="primary", @click="config.handler(queryParams)") {{config.label}}
      el-button(v-if="!config.type", @click="config.handler()",size="medium", type="primary") {{config.label}}
  el-table(:data="tableData", v-loading="loading", element-loading-text="加载中", :highlight-current-row="needCurrentRowSelect",
    @current-change="onCurrentRowChange", @selection-change="onSelectionChange", v-bind="$attrs")
    el-table-column(v-if="needBatchSelect", type="selection")
    el-table-column(type="index", label="序号", fixed="left", align="center", width="70px")
    el-table-column(v-for="item, index in tableConfig", :key="index", :prop="item.prop", :label="item.label", 
      :fixed="item.type==='action' ? 'right' : false", align="center", :min-width="item.width || '80px'", show-overflow-tooltip)
      template(slot-scope="{row}")
        template(v-if="item.type==='action'")
          template(v-if="item.options.length <= 2")
            el-button(v-for="option,index in item.options", size="small", :type="option.type || 'primary'", 
              @click="item.options[index].handler(row)", :disabled='!!option.disabled && option.disabled(row)') {{option.label}}
          el-select(v-else, @change="item.options[$event].handler(row)", placeholder='操作', value="")
            el-option(v-for="option,index in item.options", :key="index", :label="option.label", :value='index', :disabled='!!option.disabled && option.disabled(row)')
        slot(v-else-if="item.type==='custom'", :name="item.prop")
        div(v-else) {{row[item.prop] | emptyText}}

  el-pagination.pagination(layout="total, sizes, prev, pager, next", :total="totalCount", :current-page="pageable.pageIndex", 
    :page-size="pageable.pageSize", @current-change="handlePageIndexChange", @size-change="handlePageSizeChange")
</template>

<script>
import Vue from "vue"
import { isEmpty } from "@/utils/utils"

export default {
  name: "QyTable",
  inheritAttrs: false,
  props: {
    tableConfig: {
      type: Array,
      required: true
    },
    searchConfig: Array,
    operationConfig: Array,
    onFetchTableData: {
      tyep: Function,
      required: true
    },
    currentRow: {
      type: Object,
      default: null
    },
    selection: {
      type: Array,
      default() {
        return []
      }
    },
    /** 是否将查询参数放在url中 */
    paramsInUrl: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableData: [],
      totalCount: 0,
      loading: false,
      pageable: {
        pageIndex: 1,
        pageSize: 10
      },
      searchParams_: {},
      searchParams: {},
      currentRow_: null,
      selection_: []
    }
  },
  computed: {
    needBatchSelect() {
      return (this.operationConfig || []).filter(config => config.type === "selection").length > 0
    },
    needCurrentRowSelect() {
      return (this.operationConfig || []).filter(config => config.type === "currentRow").length > 0
    },
    queryParams() {
      return {
        ...this.searchParams,
        ...this.pageable
      }
    }
  },
  mounted() {
    this.getParamsFromUrl()
    this.fetchTableData()
  },
  methods: {
    getParamsFromUrl() {
      if (!this.paramsInUrl) {
        return
      }
      // 将url中的参数解析出来放到model中
      const { query } = this.$route
      const { pageIndex, pageSize, q } = query
      if (pageIndex) {
        this.pageable.pageIndex = Number(pageIndex)
      }
      if (pageSize) {
        this.pageable.pageSize = Number(pageSize)
      }
      if (this.searchConfig && q) {
        this.searchParams_ = JSON.parse(decodeURIComponent(q))
        this.searchParams = JSON.parse(decodeURIComponent(q))
      }
    },
    setParamsToUrl() {
      if (!this.paramsInUrl) {
        return
      }
      const { query, ...$route } = this.$route
      // TODO：解决NavigationDuplicated的bug
      this.$router.push({
        ...$route,
        query: {
          ...query,
          ...this.pageable,
          q: encodeURIComponent(JSON.stringify(this.searchParams))
        }
      })
    },
    handlePageSizeChange(val) {
      this.pageable.pageIndex = 1
      this.pageable.pageSize = val
      this.fetchTableData()
    },
    handlePageIndexChange(val) {
      this.pageable.pageIndex = val
      this.fetchTableData()
    },
    async fetchTableData(params) {
      if (params) {
        // 将search参数存起来
        this.searchParams = params
      }

      this.setParamsToUrl()
      this.loading = true
      // 在这里进行分页相关字段的转换
      const { total_count: totalCount, items } = await this.onFetchTableData(this.queryParams).catch(() => {
        this.$message({
          type: "error",
          message: "数据获取失败"
        })
        return {
          totalCount: this.totalCount,
          items: []
        }
      })
      this.loading = false
      this.tableData = items
      this.totalCount = totalCount
    },
    onCurrentRowChange(currentRow) {
      if (this.needCurrentRowSelect) {
        this.currentRow_ = currentRow
        this.$emit("update:currentRow", currentRow)
      }
    },
    onSelectionChange(selection) {
      if (this.needBatchSelect) {
        this.selection_ = selection
        this.$emit("update:selection", selection)
      }
    }
  },
  filters: {
    emptyText(val) {
      return isEmpty(val) ? "-" : val
    }
  }
}
</script>
<style lang="stylus" scoped>
.operations
  margin 20px 0
  display flex
  align-items center
  justify-content flex-end

.pagination
  margin-top 40px
  text-align right
</style>
