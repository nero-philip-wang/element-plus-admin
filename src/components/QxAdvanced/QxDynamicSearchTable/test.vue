<template>
  <div class="content">
    <SearchTable ref="tb"
                 :columns="columns"
                 :doexport="() => {}"
                 :dosearch="() => ({ data: table, total: 10230 })"
                 :fields="fields"
                 showselection
                 showsummary
    >
      <template #passer="{ field, data }">
        <el-input v-model="data[field.key]" />
      </template>
    </SearchTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Field, FieldType } from '../QxDynamicForm/Field'
import { Column, ColumnType } from '../QxDynamicTable/Column'
import SearchTable from './index.vue'

export default defineComponent({
  name: 'TestDynamicSearchTable',
  components: { SearchTable },
  data() {
    const table = [
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1517 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1519 弄', date: new Date().toISOString() },
      { amount: 9989, name: '李达虎', address: '上海市普陀区金沙江路 1516 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1517 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1519 弄', date: new Date().toISOString() },
      { amount: 9989, name: '李达虎', address: '上海市普陀区金沙江路 1516 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1517 弄', date: new Date().toISOString() },
    ]
    const options = [
      { label: '天津', value: 'tj' },
      { label: '上海', value: 'sh' },
    ]
    const columns: Column[] = [
      new Column({ key: 'date', title: '日期时间', width: '90px' }),
      new Column({ key: 'name', title: '姓名' }),
      new Column({ key: 'address', title: '地址' }),
      new Column({
        key: 'opt',
        title: '操作',
        type: ColumnType.buttons,
        fixed: 'right',
        buttons: (item) => (item.name.indexOf('小') == -1 ? [{ title: '复制' }, { title: '编辑' }] : [{ title: '编辑' }]),
        onClick: (item) => this.$notify({ message: `您点击了 ${item}` }),
      }),
      new Column({ key: 'amount', title: '党费金额', sumable: true }),
    ]
    return {
      table,
      columns,
      fields: [
        new Field({
          key: 'mobile',
          title: '手机号',
          type: FieldType.Input,
          placeholder: '请输入手机号',
          rule: [{ required: true }],
          attributes: { maxlength: 11 },
        }),
        new Field({ key: 'region', title: '活动区域', type: FieldType.Select, placeholder: '请选择活动区域', options }),
        new Field({ key: 'resource', title: '活动', type: FieldType.Radio, options }),
        new Field({ key: 'type', title: '活动性质', type: FieldType.Checkbox, rule: [{ required: true }], options }),
        new Field({ key: 'passer', title: '即送', type: FieldType.Slot, rule: [{ required: true }] }),
      ],
      searchArgv: {},
    }
  },
})
</script>
