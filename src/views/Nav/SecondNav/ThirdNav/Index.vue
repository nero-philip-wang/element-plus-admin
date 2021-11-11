<template>
  <div class="bg-white">
    <el-form label-width="160px">
      <el-form-item label="时间范围">
        <QxTimePicker v-model="timerange" />
        {{ timerange }}
      </el-form-item>
      <el-form-item label="价格">
        <QxYuanInput v-model="price" class="w-72" />
        {{ price }}
      </el-form-item>
      <el-form-item label="图片单选">
        <QxSingleImageUpload v-model="photo" />
        {{ photo }}
      </el-form-item>
      <el-form-item label="图片多选">
        <QxMultiImageUpload v-model="images" />
        {{ images }}
      </el-form-item>
      <el-form-item label="标签">
        <QxTags v-model="list" />
        {{ list }}
      </el-form-item>
    </el-form>
    <TestQxDynamicForm />
    <TestQxDynamicTable />
    <TestQxDynamicSearchTable />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import TestQxDynamicTable from '/@/components/QxAdvanced/QxDynamicTable/test.vue'
import TestQxDynamicForm from '/@/components/QxAdvanced/QxDynamicForm/test.vue'
import TestQxDynamicSearchTable from '/@/components/QxAdvanced/QxDynamicSearchTable/test.vue'

export default defineComponent({
  name: 'ThirdNav',
  components: { TestQxDynamicTable, TestQxDynamicForm, TestQxDynamicSearchTable },
  setup() {
    return reactive({
      timerange: [],
      price: 0,
      photo: '',
      images: [],
      list: [],
    })
  },
})
</script>
