<template>
  <el-form :ref="formName" :inline="inline" label-width="100px" :model="formData" :rules="rules">
    <el-row>
      <template v-for="f in fields.filter((c) => !c.hidden)" :key="f.key">
        <el-col
          :lg="span[inline ? f.size : 0].lg"
          :md="span[inline ? f.size : 0].md"
          :sm="span[inline ? f.size : 0].sm"
          :xl="span[inline ? f.size : 0].xl"
          :xs="span[inline ? f.size : 0].xs"
        >
          <el-form-item :class="f.class" :label="f.title" :prop="f.key" @keydown.enter="onSubmit">
            <!-- Input -->
            <template v-if="f.type == FieldType.Input">
              <QxYuanInput v-if="(f.attributes && f.attributes.inputType) == 'price'" v-model="formData[f.key]" :disabled="f.readonly" />
              <el-input
                v-else
                v-model="formData[f.key]"
                clearable
                :disabled="f.readonly"
                :maxlength="f.attributes.maxlength"
                :placeholder="f.placeholder"
                :show-word-limit="!!f.attributes.maxlength"
                :type="(f.attributes && f.attributes.inputType) || 'text'"
              />
            </template>

            <!-- InputNumber -->
            <el-input-number
              v-if="f.type == FieldType.InputNumber"
              v-model="formData[f.key]"
              clearable
              :controls="false"
              :disabled="f.readonly"
              :max="f.attributes.max"
              :min="f.attributes.min"
              :placeholder="f.placeholder"
            />

            <!-- Select -->
            <el-select
              v-else-if="f.type == FieldType.Select"
              v-model="formData[f.key]"
              clearable
              collapse-tags
              :disabled="f.readonly"
              :multiple="f.attributes.multiple || false"
              :multiple-limit="f.attributes.maxlength || 0"
              :placeholder="f.placeholder"
            >
              <el-option v-for="item in f.options" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>

            <!-- Radio -->
            <el-radio-group v-else-if="f.type == FieldType.Radio" v-model="formData[f.key]" :disabled="f.readonly">
              <el-radio v-for="item in f.options" :key="item.label" :label="item.value">
                {{ item.label }}
              </el-radio>
            </el-radio-group>

            <!-- Checkbox -->
            <el-checkbox-group v-else-if="f.type == FieldType.Checkbox && init(f.key, [])" v-model="formData[f.key]" :disabled="f.readonly">
              <el-checkbox v-for="item in f.options" :key="item.label" :label="item.value">
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>

            <!-- Switch -->
            <el-switch v-else-if="f.type == FieldType.Switch && init(f.key, false)" v-model="formData[f.key]" :disabled="f.readonly" />

            <!-- DateTimePicker -->
            <template v-else-if="f.type == FieldType.DateTimePicker">
              <el-date-picker
                v-model="formData[f.key]"
                :default-time="new Date(2000, 1, 1, 23, 59, 59)"
                :disabled="f.readonly"
                :placeholder="f.placeholder || '选择日期'"
                :type="(f.attributes && f.attributes.inputType) || 'date'"
              />
            </template>

            <!-- DateTimeRange -->
            <template v-else-if="f.type == FieldType.DateTimeRange">
              <TimePicker
                v-if="!f.attributes.range.root && init(f.key, {})"
                v-model:end="formData[f.key][f.attributes.range.endKey]"
                v-model:start="formData[f.key][f.attributes.range.startKey]"
                :disabled="f.readonly"
              />
              <TimePicker
                v-else
                v-model="formData[f.key]"
                v-model:end="formData[f.attributes.range.endKey]"
                v-model:start="formData[f.attributes.range.startKey]"
                :disabled="f.readonly"
              />
            </template>

            <!-- Other -->
            <template v-else>
              <slot :data="formData" :field="f" :name="f.key" />
            </template>
            <div
              v-if="f.type != FieldType.Input && f.type != FieldType.InputNumber && f.type != FieldType.Select && f.placeholder && !formData[f.key]"
              class="el-upload__tip mt-0 -mb-4"
            >
              {{ f.placeholder }}
            </div>
          </el-form-item>
        </el-col>
      </template>
      <el-col :lg="span[1 & inline].lg" :md="span[1 & inline].md" :sm="span[1 & inline].sm" :xl="span[1 & inline].xl" :xs="span[1 & inline].xs">
        <el-form-item class="mx-5">
          <el-button v-if="submitText" type="primary" @click="onSubmit">
            {{ submitText }}
          </el-button>
          <!-- 自定义按钮 -->
          <slot name="button" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Field, FieldType } from './Field'
import TimePicker from '../../QxBasic/QxTimePicker.vue'
import QxYuanInput from '../../QxBasic/QxYuanInput.vue'

const span = [
  { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
  { xs: 12, sm: 12, md: 12, lg: 8, xl: 6 },
  { xs: 24, sm: 24, md: 12, lg: 16, xl: 12 },
]

export default defineComponent({
  name: 'QxDynamicForm',
  components: { TimePicker, QxYuanInput },
  props: {
    /** 返回行数据解析格式 */
    fields: { type: Array as PropType<Array<Field>>, default: () => [] },
    /** v-model绑定的值 */
    modelValue: { type: Object, default: () => ({}) },
    /** 同form的inline */
    inline: { type: Boolean, default: false },
    /** 提交按钮文字 */
    submitText: { type: String, default: '确定' },
  },
  emits: ['submit'],
  data() {
    const formData: any = {}
    return {
      FieldType,
      formData,
      span,
      formName: '',
    }
  },
  computed: {
    rules() {
      const set: any = {}
      this.fields.forEach((f) => {
        set[f.key] = f.rule
      })
      return set
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(v) {
        this.formData = v || {}
      },
    },
  },
  created() {
    this.formName = `form${Math.random().toFixed(5)}`
  },
  methods: {
    init(key: string, value: any) {
      this.formData[key] = this.formData[key] ? this.formData[key] : value
      return true
    },
    async validate() {
      try {
        await (this.$refs[this.formName] as any).validate()
        return true
      } catch (error) {
        return false
      }
    },
    onSubmit() {
      (this.$refs[this.formName] as any)
        .validate()
        .then(() => {
          this.$emit('submit', this.formData)
        })
        .catch((err: any) => {
          // 提示错误信息
          const elist = []
          for (const key in err) {
            elist.push(...err[key].map((c: { message: string }) => c.message))
          }
          (this as any).$notify.info({
            title: '请检查表单',
            dangerouslyUseHTMLString: true,
            message: elist.join('<br>'),
          })
        })
    },
  },
})
</script>

<style></style>
