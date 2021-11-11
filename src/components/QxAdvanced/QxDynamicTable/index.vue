<template>
  <div>
    <el-table
      :ref="tableName"
      v-loading="loading"
      :data="data"
      fit
      header-row-class-name="tableheader"
      :height="tableheight ? tableheight : undefined"
      highlight-current-row
      :show-summary="showsummary"
      stripe
      :summary-method="sum"
      @selection-change="handleSelectionChange"
    >
      <!-- 批量勾选框 -->
      <el-table-column v-if="showselection" type="selection" width="55" />
      <!-- 渲染columns -->
      <el-table-column
        v-for="item in columns.filter((c) => !c.hidden)"
        :key="item.key"
        :fixed="item.fixed"
        :label="item.title"
        :min-width="getminwitdh(item.width)"
        :prop="item.sumable ? item.key : null"
        :width="getwitdh(item.width)"
      >
        <template #default="scope">
          <!-- buttons -->
          <template v-if="item.type === ColumnType.buttons">
            <el-button
              v-for="it in item.buttons(scope.row).filter((c) => !c.hidden)"
              :key="it.title"
              type="text"
              @click="item.onClick && item.onClick(it.title, scope.row)"
            >
              {{ it.title }}
            </el-button>
          </template>

          <!-- image -->
          <template v-else-if="item.type === ColumnType.image">
            <el-image fit="contain" :src="scope.row[item.key]" :style="`width: ${item.width}; height:calc(${item.width} / 2)`" />
          </template>

          <!-- switch -->
          <template v-else-if="item.type === ColumnType.switch">
            <el-switch v-model="scope.row[item.key]" @change="item.onChange" />
          </template>

          <!-- slot -->
          <template v-else-if="item.type === ColumnType.slot">
            <slot :item="scope.row" :name="item.key" />
          </template>

          <!-- text -->
          <template v-else>
            <div v-html="cell(scope.row, item)" />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-between">
      <div>
        <slot name="footer" />
      </div>
      <!-- <el-button type="text" @click="exportpage">
        下载表格
      </el-button> -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Column, ColumnType } from './Column'

export default defineComponent({
  name: 'QxDynamicTable',
  props: {
    tableheight: { type: String, default: null },
    /** 显示复选框  */
    showselection: { type: Boolean, default: false },
    /** 显示合计  */
    showsummary: { type: Boolean, default: false },
    /** 手动增加的预设行数 */
    data: { type: Array, default: () => [] },
    /** 返回行数据解析格式 */
    columns: { type: Array as PropType<Array<Column>>, default: () => [] },
    /** 加载中指示器 */
    loading: { type: Boolean, default: false },
  },
  emits: ['selection-change', 'exportpage'],
  data() {
    return {
      ColumnType,
      tableName: 'table',
    }
  },
  created() {
    this.tableName = `table${Math.random().toFixed(5)}`
  },
  methods: {
    getwitdh(width: string) {
      if (width && width.startsWith('>')) return undefined
      else return width
    },
    getminwitdh(width: string) {
      if (!width) return '100px'
      else if (width.startsWith('>')) return width.replace('>', '')
      else return undefined
    },
    /** 计算每个单元格显示的值 */
    cell(row: any, column: Column) {
      if (typeof column.formatter === 'function') return column.formatter(row[column.key], row)
      else return row[column.key]
    },
    /** 求和函数 */
    sum(param: any) {
      const { columns, data } = param
      const sums: any[] = []
      columns.forEach((column: { property: string | number }, index: number) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item: { [x: string]: any }) => Number(item[column.property]))
        if (!values.every((value: number) => isNaN(value))) {
          sums[index] = values.reduce((prev: any, curr: any) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = (sums[index] / 100).toFixed(2)
          sums[index] += ' 元'
        } else {
          sums[index] = ' '
        }
      })

      return sums
    },
    /** 行数据勾选 */
    handleSelectionChange(val: any) {
      this.$emit('selection-change', val)
    },
    /** 清除选中，暴露给外部的 */
    clearSelection() {
      const form = this.$refs[this.tableName] as any
      form.clearSelection()
    },
    /** 导出本页 */
    exportpage() {
      const header = this.columns.filter((c) => c.type !== ColumnType.buttons).map((c) => c.title)
      const filterVal = this.columns.filter((c) => c.type !== ColumnType.buttons).map((c) => c.key)
      const data = this.formatJson(filterVal, this.data)
      this.$emit('exportpage', {
        header, // 表头 必填
        data, // 具体数据 必填
      })
    },
    formatJson(filterVal: Array<any>, jsonData: Array<any>) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return this.cell(v, this.columns.filter((c) => c.key === j)[0])
        })
      )
    },
  },
})
</script>

<style>
tr.tableheader {
  background-color: #f0f0f0;
}

.tableheader th {
  background-color: #f0f0f0;
  color: #333;
}
</style>
