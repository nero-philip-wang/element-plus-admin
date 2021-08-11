<template>
  <table-search
    :current-page="table.page"
    :page-size="table.size"
    :total="table.total"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  >
    <template #search>
      <el-row class="clear-both" :gutter="15">
        <el-col :span="24">
          <card-list :show-header="true" title="高级搜索" type="keyvalue">
            <template #btn>
              <el-button-group>
                <el-button icon="el-icon-search" size="mini" @click="submit">
                  搜索
                </el-button>
              </el-button-group>
            </template>
            <template #keyvalue>
              <el-form ref="refForm" class="card-list-form" :model="form" :rules="rules" size="mini">
                <el-row :gutter="15">
                  <card-list-item prop="name" width="100px">
                    <template #key>
                      日期
                    </template>
                    <template #value>
                      <el-date-picker
                        v-model="form.date"
                        end-placeholder="结束日期"
                        range-separator="至"
                        start-placeholder="开始日期"
                        type="daterange"
                      />
                    </template>
                  </card-list-item>
                  <card-list-item prop="name" width="100px">
                    <template #key>
                      姓名
                    </template>
                    <template #value>
                      <el-input v-model="form.name" placeholder="请输入姓名" />
                    </template>
                  </card-list-item>
                  <card-list-item prop="address" width="100px">
                    <template #key>
                      地址
                    </template>
                    <template #value>
                      <el-input v-model="form.address" placeholder="请输入地址" />
                    </template>
                  </card-list-item>
                  <card-list-item prop="tag" width="100px">
                    <template #key>
                      标签
                    </template>
                    <template #value>
                      <el-radio-group v-model="form.tag">
                        <el-radio label="所有" />
                        <el-radio label="家" />
                        <el-radio label="学校" />
                        <el-radio label="超市" />
                        <el-radio label="公司" />
                      </el-radio-group>
                    </template>
                  </card-list-item>
                </el-row>
              </el-form>
            </template>
          </card-list>
        </el-col>
      </el-row>
    </template>
    <el-table ref="filterTable" border :data="tableData.data" row-key="date" show-summary
              style="width: 100%" :summary-method="getSummaries"
    >
      <el-table-column :index="indexMethod" type="index" width="50" />
      <el-table-column column-key="date" label="日期" prop="date" sortable width="180" />
      <el-table-column label="姓名" prop="name" width="180" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="金额" prop="amt">
        <template #default="scope">
          <el-input v-model.number="scope.row.amt" v-format:money="[scope.row, 'amt']" />
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="tag" width="100">
        <template #default="scope">
          <el-tag
            disable-transitions
            :type="scope.row.tag === '家' ? 'primary' : scope.row.tag === '公司' ? 'danger' : scope.row.tag === '超市' ? 'info' : 'success'"
          >
            {{ scope.row.tag }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </table-search>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import TableSearch from '/@/components/TableSearch/index.vue'
import CardList from '/@/components/CardList/CardList.vue'
import CardListItem from '/@/components/CardList/CardListItem.vue'
import { getTableList, ITag } from '/@/api/components/index'
import { format, tableSummaries } from '/@/utils/tools'
import { validate } from '/@/utils/formExtend'
import { IRenderTableList } from '/@/type/views/Components/TableSearchTest'

interface ISearchForm {
  date: string
  name: string
  address: string
  tag: ITag
}

// 键值对样式，及表单校验
const search = (table: ITable<IRenderTableList>, form: ISearchForm) => {
  const rules = reactive({})
  const refForm = ref(null)
  const submit = async() => {
    if (!(await validate(refForm))) return
    table.page = 1
    renderTableList(table, form)
  }
  return {
    rules,
    submit,
    refForm,
  }
}

const renderTableList = async(table: ITable<IRenderTableList>, form: ISearchForm) => {
  const d = await getTableList({ page: table.page, size: table.size, tag: form.tag })
  table.data = d.data.Data.data
  table.total = d.data.Data.total
}
const tableRender = (table: ITable<IRenderTableList>, form: ISearchForm) => {
  renderTableList(table, form)
  const handleSizeChange = (v: number) => (table.size = v) && renderTableList(table, form)
  const handleCurrentChange = (v: number) => (table.page = v) && renderTableList(table, form)
  const indexMethod = (index: number) => (table.page - 1) * table.size + index + 1
  const getSummaries = tableSummaries
  return { table, handleSizeChange, handleCurrentChange, indexMethod, getSummaries }
}

export default defineComponent({
  name: 'TableSearchTest',
  components: {
    TableSearch,
    CardList,
    CardListItem,
  },
  setup() {
    const form: ISearchForm = reactive({
      date: '',
      name: '',
      address: '',
      tag: '所有',
    })

    // const
    const tableData: ITable<IRenderTableList> = reactive({
      data: [],
      total: 0,
      page: 1,
      size: 10,
    })
    return {
      form,
      tableData,
      format,
      ...tableRender(tableData, form),
      ...search(tableData, form),
    }
  },
})
</script>
