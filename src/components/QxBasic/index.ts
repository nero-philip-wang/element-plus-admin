import { App as Application, Component } from 'vue'
import QxYuanInput from './QxYuanInput.vue'
import QxTimePicker from './QxTimePicker.vue'
import QxSingleImageUpload from './QxSingleImageUpload.vue'
import QxMultiImageUpload from './QxMultiImageUpload.vue'
import QxTags from './QxTags.vue'

const registerComponent = (instance: Application, component: Component): void => {
  if (component) {
    instance.component(component.name || '', component)
  }
}

const Plugin = {
  install(vue: Application): void {
    registerComponent(vue, QxYuanInput)
    registerComponent(vue, QxTimePicker)
    registerComponent(vue, QxSingleImageUpload)
    registerComponent(vue, QxMultiImageUpload)
    registerComponent(vue, QxTags)
  },
}

export default Plugin
