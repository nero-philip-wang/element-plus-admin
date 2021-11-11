<template>
  <div class="content">
    <JsFrom v-model="info" :fields="fields" inline>
      <template #passer="{ field, data }">
        <el-switch v-model="v_s" />
        <el-input v-if="v_s" v-model="data[field.key]" />
        <el-input v-else v-model="data[field.key]" type="textarea" />
      </template>
    </JsFrom>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Field, FieldType } from './Field'
import rules from './rule'
import JsFrom from './index.vue'

export default defineComponent({
  name: 'TestDynamicForm',
  components: { JsFrom },
  data() {
    const options = [
      { label: '天津', value: 'tj' },
      { label: '上海', value: 'sh' },
    ]
    const info = {}
    return {
      v_s: true,
      list: [52, 25, 25, 25, 252],
      info,
      fields: [
        new Field({
          key: 'mobile',
          title: '手机号',
          type: FieldType.Input,
          placeholder: '请输入手机号',
          rule: [rules.required],
          attributes: { maxlength: 11, inputType: 'textarea' },
        }),
        new Field({
          key: 'age',
          title: '年龄',
          type: FieldType.InputNumber,
          placeholder: '请输入年龄',
          attributes: { min: 1, max: 200 },
        }),
        new Field({
          key: 'region',
          title: '活动区域',
          type: FieldType.Select,
          placeholder: '请选择活动区域',
          options,
        }),
        new Field({
          key: 'resource',
          title: '活动',
          type: FieldType.Radio,
          placeholder: '请选择活动区域',
          options,
        }),
        new Field({
          key: 'type',
          title: '活动性质',
          type: FieldType.Checkbox,
          rule: [rules.required],
          options,
        }),
        new Field({
          key: 'delivery',
          title: '即时配送',
          type: FieldType.Switch,
          rule: [rules.required],
        }),
        new Field({
          key: 'timer',
          title: '时间',
          type: FieldType.DateTimePicker,
          hidden: true,
        }),
        new Field({
          key: 'range',
          title: '有效期',
          type: FieldType.DateTimeRange,
          size: 2,
          hidden: true,
          attributes: {
            range: {
              root: false,
              startKey: 'start',
              endKey: 'end',
            },
          },
          rule: [rules.rangeRequired],
        }),
        new Field({
          key: 'passer',
          title: '即送',
          type: FieldType.Slot,
          rule: [rules.required],
        }),
      ],
    }
  },
})
</script>
