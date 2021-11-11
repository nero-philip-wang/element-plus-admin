<template>
  <div v-loading="loading" class="flex flex-wrap">
    <div v-for="(url, idx) in vlist" :key="url" class="imgbox relative rounded m-1" :style="boxsize">
      <div class="mask absolute z-10 flex justify-center items-center" :class="url ? '' : 'show'" :style="boxsize">
        <template v-if="!disabled">
          <!-- 向前 -->
          <i v-if="url" class="el-icon-back mr-2" @click="move(idx, idx - 1)" />
          <!-- 上传 -->
          <label>
            <i v-if="!url" class="el-icon-plus" />
            <input accept="image/*" class="hidden" multiple type="file" @change="getMyFile">
          </label>
          <!-- 删除 -->
          <i v-if="url" class="el-icon-delete mr-2" @click="del(idx)" />
          <!-- 向后 -->
          <i v-if="url" class="el-icon-right" @click="move(idx, idx + 1)" />
        </template>
        <template v-else>
          <i v-if="url" class="el-icon-zoom-in mr-2" @click="show(idx)" />
        </template>
      </div>
      <!-- 展示图片 -->
      <el-image v-if="url" class="z-0" fit="contain" :src="url" :style="boxsize" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, h, PropType } from 'vue'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'QxMultiImageUpload',
  props: {
    dir: {
      type: String,
      default: 'img',
    },
    size: {
      type: String,
      default: '60px',
    },
    modelValue: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    api: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  data(): { list: Array<string | null>; loading: boolean } {
    return {
      list: [],
      loading: false,
    }
  },
  computed: {
    vlist(): Array<string | null> {
      let l = [...this.list, null]
      let result = l.map((url) => (url && url.indexOf('re4.top') !== -1 ? `${url}!t360` : url))
      return result
    },
    boxsize(): string {
      return `width:${this.size}; height:${this.size}`
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(v) {
        this.list = v
      },
    },
  },
  methods: {
    del(idx: number) {
      this.list.splice(idx, 1)
      this.$emit('update:modelValue', this.list)
    },
    move(left: number, right: number) {
      if (left < 0 || right < 0 || left > this.list.length - 1 || right > this.list.length - 1) return
      else {
        let tem = this.list[left]
        this.list[left] = this.list[right]
        this.list[right] = tem
      }
      this.$emit('update:modelValue', this.list)
    },
    show(idx: number) {
      ElMessageBox({
        title: '预览',
        message: h('img', { src: this.list[idx] }),
        showCancelButton: false,
        showConfirmButton: false,
        customClass: 'preview_MultiImageUpload',
      })
    },
    async getMyFile(e: { target: { files: any } }) {
      let { files } = e.target
      if (files && files.length) {
        this.loading = true
        for (let i = 0; i < files.length; i++) {
          let url: string | null = ''
          try {
            const ossconfig = await this.api.uploadImg(this.dir)
            url = await this.api.upLoad(ossconfig, files[i])
          } catch (error) {
            url = ''
          } finally {
            this.list.push(url)
          }
        }
        this.loading = false
        this.$emit('update:modelValue', this.list)
      }
    },
    // 获取文件本地地址
    getFileUrl(file: any): string {
      let url = ''
      let agent = navigator.userAgent
      if (agent.indexOf('MSIE') >= 1 || agent.indexOf('NET') != -1) {
        url = window.URL.createObjectURL(file)
      } else if (agent.indexOf('Firefox') > 0) {
        url = window.URL.createObjectURL(file)
      } else if (agent.indexOf('Chrome') > 0) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
  },
})
</script>

<style lang="postcss" scoped>
.imgbox {
  border: #c0ccda 1px solid;
  overflow: hidden;
  i {
    cursor: pointer;
  }
}

.mask {
  font-size: 20px;
  display: none;
}
.mask.show {
  display: flex;
  color: #8c939d;
}

.imgbox:hover .mask {
  display: flex;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

<style>
.preview_MultiImageUpload {
  width: fit-content !important;
  max-width: 1000px;
}
</style>
