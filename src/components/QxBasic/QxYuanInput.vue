<template>
  <el-input v-model="data" :disabled="disabled" placeholder="请输入金额" @change="input">
    <template #prepend>
      ￥
    </template>
  </el-input>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'QxYuanInput',
  props: {
    modelValue: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      data: '',
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(v) {
        this.data = (v / 100).toFixed(2)
      },
    },
  },
  methods: {
    input(v) {
      if (v === '') {
        this.$emit('update:modelValue', '')
      }
      if (v.indexOf('.') !== v.length - 1) {
        const f = parseInt((parseFloat(v) * 100).toFixed(0))
        this.$emit('update:modelValue', f)
      }
    },
  },
})
</script>
