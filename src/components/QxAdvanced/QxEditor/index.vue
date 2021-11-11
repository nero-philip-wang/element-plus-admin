<template>
  <slot>
    <el-button icon="el-icon-plus" type="warning" @click="$emit('beforeAdd')">
      新建
    </el-button>
  </slot>
  <el-dialog v-model="isEditorVisible" title="编辑" :width="width">
    <QxDynamicForm v-if="isEditorVisible" v-model="currentData" :fields="fields" submit-text="提交" @submit="submit">
      <template v-for="f in slotFields" #[f.key]>
        <slot :data="currentData" :field="f" :name="f.key" />
      </template>
    </QxDynamicForm>
  </el-dialog>
</template>

<script lang="ts">
import { AxiosPromise } from 'axios'
import { defineComponent, PropType } from 'vue'
import { Field, FieldType } from '../QxDynamicForm/Field'
import mixin from './mixin'

export default defineComponent({
  name: 'QxEditor',
  mixins: [mixin],
  props: {
    /** 当前编辑的值 */
    data: {
      type: Object,
      default: () => ({}),
    },
    /** add,update,searchtable */
    sumbitparam: {
      type: Object as PropType<{
        add: (data: any) => AxiosPromise
        update: (id: string, data: any) => AxiosPromise
        refresh: () => void | undefined
      }>,
      required: true,
    },
    /** 返回行数据解析格式 */
    fields: { type: Array as PropType<Array<Field>>, default: () => [] },
    /** dialog的宽度 */
    width: { type: String, default: undefined },
  },
  emits: ['beforeAdd', 'close'],
  data() {
    return {
      isEditorVisible: false,
      currentData: {},
    }
  },
  computed: {
    slotFields(): Array<Field> {
      return this.fields.filter((c) => c.type === FieldType.Slot)
    },
  },
  watch: {
    data(v) {
      this.currentData = v
    },
    currentData() {
      this.isEditorVisible = true
    },
  },
  methods: {
    async submit(data: { id: string | undefined | null }) {
      this.submitEditor(data, this.sumbitparam.add, this.sumbitparam.update, this.sumbitparam.refresh)
      this.isEditorVisible = false
    },
  },
})
</script>
