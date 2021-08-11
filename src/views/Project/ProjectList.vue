<template>
  <div>
    <el-table border :data="list.tableData" style="width: 100%;">
      <el-table-column fixed label="日期" prop="date" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="省份" prop="province" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button size="small" type="text">
            <router-link :to="&quot;/Project/ProjectDetail/&quot; + scope.row.projName">
              编辑
            </router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'ProjectList',
  setup() {
    const list = reactive({
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        projName: '001'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        projName: '002'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        projName: '003'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        projName: '004'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        projName: '005'
      }]
    })
    const handleClick = (row: any) => {
      console.log(row)
    }
    return {
      list,
      handleClick
    }
  }
})
</script>

