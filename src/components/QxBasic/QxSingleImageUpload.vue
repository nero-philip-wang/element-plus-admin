<template>
  <div class="imgbox relative rounded" :style="boxsize">
    <div class="mask absolute z-10 flex justify-center items-center" :class="url ? '' : 'show'" :style="boxsize">
      <!-- 上传 -->
      <label>
        <i v-if="url" class="el-icon-refresh mr-2" />
        <i v-else class="el-icon-plus" />
        <input accept="image/*" style="display: none" type="file" @change="getMyFile">
      </label>
      <!-- 删除 -->
      <i v-if="url" class="el-icon-delete" @click="del" />
    </div>
    <!-- 展示图片 -->
    <el-image v-if="url" class="z-0" fit="contain" :src="vurl" :style="boxsize" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'QxSingleImageUpload',
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
      type: String,
      default: null,
    },
    api: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  data(): { url: string | null } {
    return {
      url: null,
    }
  },
  computed: {
    vurl(): string | null {
      if (this.url && this.url.indexOf('re4.top') !== -1) return `${this.url}!t360`
      else return this.url
    },
    boxsize(): string {
      return `width:${this.size}; height:${this.size}`
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(v) {
        this.url = v
      },
    },
  },
  methods: {
    del() {
      this.url = null
      this.$emit('update:modelValue', null)
    },
    getMyFile(e: { target: { files: any } }) {
      const { files } = e.target
      if (files && files[0]) {
        this.url = this.getFileUrl(files[0])
        this.$nextTick(async() => {
          try {
            const ossconfig = await this.api.uploadImg(this.dir)
            this.url = await this.api.upLoad(ossconfig, { file: files[0] })
            this.$emit('update:modelValue', this.url)
          } catch (error) {
            this.url = null
          }
        })
      }
    },
    // 获取文件本地地址
    getFileUrl(file: any): string {
      let url = ''
      const agent = navigator.userAgent
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

<style scoped>
.imgbox {
  border: #c0ccda 1px solid;
  overflow: hidden;
}

.imgbox i {
  cursor: pointer;
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
