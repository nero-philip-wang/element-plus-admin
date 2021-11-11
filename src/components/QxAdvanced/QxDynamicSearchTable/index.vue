<template>
  <div>
    <!-- 搜索条件 -->
    <DynamicForm :ref="formName" :fields="fields" inline :model-value="searchArgv" submit-text="搜索" @submit="refresh">
      <template #button>
        <el-button v-if="doexport" @click="doexport({ ...searchArgv })">
          导出全部
        </el-button>
      </template>
      <template v-for="f in slotFields" #[f.key]>
        <slot :data="searchArgv" :field="f" :name="f.key" />
      </template>
    </DynamicForm>

    <!-- 中部自定义区域 -->
    <slot name="middle" />

    <!-- 搜索结果展示区域 -->
    <DynamicTable
      :ref="tableName"
      :columns="columns"
      :data="resultTable"
      :showselection="showselection"
      :showsummary="showsummary"
      :tableheight="tableheight"
      @selection-change="(val) => $emit('selection-change', val)"
    >
      <template #footer>
        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pageindex"
          v-model:page-size="pagesize"
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 50, 100, 500, 1000]"
          :total="total"
          @current-change="refresh"
          @size-change="sizeChange"
        />
      </template>
      <template v-for="f in slotColumns" #[f.key]="{ item }">
        <slot :item="item" :name="f.key" />
      </template>
    </DynamicTable>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Field, FieldType } from '../QxDynamicForm/Field'
import { Column, ColumnType } from '../QxDynamicTable/Column'
import DynamicForm from '../QxDynamicForm/index.vue'
import DynamicTable from '../QxDynamicTable/index.vue'

export default defineComponent({
  name: 'QxDynamicSearchTable',
  components: { DynamicForm, DynamicTable },
  props: {
    tableheight: { type: String, default: null },
    /** 显示复选框  */
    showselection: { type: Boolean, default: false },
    /** 显示合计  */
    showsummary: { type: Boolean, default: false },
    /** 传入一个搜索的api  */
    dosearch: { type: Function, default: null },
    /** 传入一个导出搜索结果的api，并反馈结果  */
    doexport: { type: Function, default: null },
    /** 搜索条件 */
    fields: { type: Array as PropType<Array<Field>>, default: () => [] },
    /** 返回行数据解析格式 */
    columns: { type: Array as PropType<Array<Column>>, default: () => [] },
  },
  emits: ['searched', 'selection-change'],
  data() {
    const lastargv: any = null
    const total: any = 0
    return {
      formName: 'form',
      tableName: 'table',
      resultTable: [],
      max: null,
      total,
      pagesize: 10,
      pageindex: 1,
      loading: false,
      lastargv,
      searchArgv: {},
    }
  },
  computed: {
    slotFields(): Array<Field> {
      return this.fields.filter((c) => c.type === FieldType.Slot)
    },
    slotColumns(): Array<Column> {
      return this.columns.filter((c) => c.type === ColumnType.slot)
    },
  },
  created() {
    this.formName = `form${Math.random().toFixed(5)}`
    this.tableName = `table${Math.random().toFixed(5)}`
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async validate(): Promise<boolean> {
      const form = this.$refs[this.formName] as any
      return await form.validate()
    },
    sizeChange() {
      if (this.pageindex == 1) this.refresh()
      else this.pageindex = 1
    },
    /** 调用api搜索，可暴露给外部的 */
    async refresh() {
      // 检验不通过就返回
      if (!(await this.validate())) return

      this.loading = true
      try {
        // 如果筛选条件改变,这返回第一页
        if (JSON.stringify(this.lastargv) !== JSON.stringify(this.searchArgv)) {
          this.pageindex = 1
          this.max = null
          this.total = 0
          this.lastargv = { ...this.searchArgv }
        }
        // 发送请求参数
        const pagingArgv = {
          skip: (this.pageindex - 1) * this.pagesize,
          take: this.pagesize,
        }
        const response = await this.dosearch({
          ...pagingArgv,
          ...this.searchArgv,
        })
        // 处理api返回值
        if (!response.data) {
          // 如果数据没有返回total，处理分页显示的最大数值 total
          this.resultTable = response
          if (response.length < this.pagesize) {
            this.max = (this.pageindex - 1) * this.pagesize + response.length
          } else {
            this.total = Math.max((this.pageindex + 1) * this.pagesize, this.total)
          }
          if (this.max !== null) this.total = this.max
        } else {
          // 如果数据返回total了
          if (response.total) this.total = response.total
          this.resultTable = response.data
        }
        this.$emit('searched', this.resultTable)
      } catch (err) {
        this.resultTable = []
      } finally {
        this.loading = false
      }
    },
    /** 清除选中，暴露给外部的 */
    clearSelection() {
      const form = this.$refs[this.tableName] as any
      form.clearSelection()
    },
  },
})
</script>

<style></style>
