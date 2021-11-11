<template>
  <span class="flex">
    <el-input v-model="vtitle" class="w-52" disabled placeholder="请选择" />
    <el-button :disabled="disabled" @click="showDialog = true">更改…</el-button>
    <el-dialog v-model="showDialog">
      <QxDynamicSearchTable ref="dt" :columns="columns2" :dosearch="dosearch" :fields="fields">
        <template v-for="f in slotFields" #[f.key]>
          <slot :data="($refs.dt && $refs.dt.searchArgv) || {}" :field="f" :name="f.key" />
        </template>
      </QxDynamicSearchTable>
    </el-dialog>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Field, FieldType } from './QxDynamicForm/Field'
import QxDynamicSearchTable from './QxDynamicSearchTable/index.vue'
import { Column, ColumnType } from './QxDynamicTable/Column'

export default defineComponent({
  name: 'QxBrowerSelection',
  components: { QxDynamicSearchTable },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    dosearch: { type: Function, default: null },
    /** 搜索条件 */
    fields: { type: Array as PropType<Array<Field>>, default: () => [] },
    /** 返回行数据解析格式 */
    columns: { type: Array as PropType<Array<Column>>, default: () => [] },
  },
  data() {
    return {
      showDialog: false,
    }
  },
  computed: {
    slotFields(): Array<Field> {
      return this.fields.filter((c) => c.type === FieldType.Slot)
    },
    vtitle(): string | null {
      return this.title || (this.id != null && `编号 ${this.id}`) || ''
    },
    columns2(): Array<Column> {
      return this.columns.map((c) => {
        if (c.type == ColumnType.buttons) {
          let oldfunc = c.onClick
          c.onClick = (i, r) => {
            this.showDialog = false
            if (oldfunc) oldfunc(i, r)
          }
        }
        return c
      })
    },
  },
})
</script>
