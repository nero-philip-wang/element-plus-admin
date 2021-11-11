<template>
  <div class="content">
    <DynamicTable ref="tb" :columns="columns" :data="table" showselection showsummary />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Column, ColumnType } from './Column'
import DynamicTable from './index.vue'

export default defineComponent({
  name: 'TestDynamicTable',
  components: { DynamicTable },
  data() {
    const table = [
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1517 弄', date: new Date().toISOString() },
      { amount: 9989, name: '王小虎', address: '上海市普陀区金沙江路 1519 弄', date: new Date().toISOString() },
      { amount: 9989, name: '李达虎', address: '上海市普陀区金沙江路 1516 弄', date: new Date().toISOString() },
    ]
    const columns: Column[] = [
      new Column({ key: 'date', title: '日期时间', width: '90px', hidden: true }),
      new Column({ key: 'name', title: '姓名' }),
      new Column({ key: 'address', title: '地址' }),
      new Column({
        key: 'opt',
        title: '操作',
        type: ColumnType.buttons,
        fixed: 'right',
        buttons: (item) =>
          item.name.indexOf('小') == -1
            ? [
              { title: '复制', hidden: false },
              { title: '编辑', hidden: true },
            ]
            : [{ title: '编辑', hidden: false }],
        onClick: (item) => this.$notify({ message: `您点击了 ${item}` }),
      }),
      new Column({ key: 'amount', title: '党费金额', sumable: true }),
    ]
    return {
      table,
      columns,
    }
  },
})
</script>
