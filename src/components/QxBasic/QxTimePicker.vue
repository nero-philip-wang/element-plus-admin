<template>
  <el-date-picker
    v-model="date"
    :default-time="v_dTime"
    :disabled="disabled"
    end-placeholder="结束日期"
    format="YYYY-MM-DD"
    range-separator="至"
    :shortcuts="v_shortcuts"
    start-placeholder="开始日期"
    type="daterange"
    unlink-panels
  />
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'QxTimePicker',
  props: {
    /** v-model绑定的值 */
    modelValue: { type: Array, default: () => [] },
    start: { type: String, default: '' },
    end: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:start', 'update:end', 'update:modelValue'],
  data() {
    return {
      v_shortcuts: [
        {
          text: '今日',
          value: (() => {
            const oneDayLong = 24 * 60 * 60 * 1000
            const now = new Date()
            const day = new Date(now.toLocaleDateString())
            const end = new Date(day.getTime() + oneDayLong - 1)
            return [day, end]
          })(),
        },
        {
          text: '本周',
          value: (() => {
            const oneDayLong = 24 * 60 * 60 * 1000
            const now = new Date()
            const day = new Date(now.toLocaleDateString())
            const mondayTime = day.getTime() - (day.getDay() - 1) * oneDayLong
            const sundayTime = day.getTime() + (8 - now.getDay()) * oneDayLong - 1
            const monday = new Date(mondayTime)
            const sunday = new Date(sundayTime)
            return [monday, sunday]
          })(),
        },
        {
          text: '本月',
          value: (() => {
            const oneDayLong = 24 * 60 * 60 * 1000
            const now = new Date()
            const year = now.getFullYear()
            const monthStartDate = new Date(year, now.getMonth(), 1) // 当前月1号
            const nextMonthStartDate = new Date(year, now.getMonth() + 2, 1) // 下个月1号
            const days = (nextMonthStartDate.getTime() - monthStartDate.getTime()) / oneDayLong // 计算当前月份的天数
            const monthEndDate = new Date(year, now.getMonth() - 1, days, 23, 59, 59, 999)
            return [monthStartDate, monthEndDate]
          })(),
        },
      ],
      v_dTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)],
      date: ['', ''],
    }
  },
  watch: {
    start: {
      immediate: true,
      handler(value) {
        // 参考 https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
        if (value) this.date.splice(0, 1, new Date(value))
      },
    },
    end: {
      immediate: true,
      handler(value) {
        // 参考 https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项
        if (value) this.date.splice(1, 1, new Date(value))
      },
    },
    date() {
      this.$emit('update:modelValue', this.date)
      if (this.date) {
        if (this.date[0]) this.$emit('update:start', this.date[0].toISOString())
        if (this.date[1]) this.$emit('update:end', this.date[1].toISOString())
      } else {
        this.$emit('update:start', null)
        this.$emit('update:end', null)
      }
    },
  },
})
</script>
