<template>
  <div>
    <el-tag v-for="(tag, idx) in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag, idx)">
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      size="mini"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="mini" @click="showInput">
      新增
    </el-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'QxTags',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['add', 'remove', 'update:modelValue'],
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(v) {
        this.dynamicTags = v
      },
    },
  },
  methods: {
    handleClose(tag, idx) {
      this.$emit('remove', idx, tag)
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.$emit('update:modelValue', this.dynamicTags)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let { inputValue } = this
      if (inputValue) {
        this.$emit('add', inputValue)
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      this.$emit('update:modelValue', this.dynamicTags)
    },
  },
})
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
