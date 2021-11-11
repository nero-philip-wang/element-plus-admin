import { App as Application, Component } from 'vue'
import QxDynamicForm from './QxDynamicForm/index.vue'
import QxDynamicTable from './QxDynamicTable/index.vue'
import QxDynamicSearchTable from './QxDynamicSearchTable/index.vue'
import QxBrowerSelection from './QxBrowerSelection.vue'

const registerComponent = (instance: Application, component: Component): void => {
  if (component) {
    instance.component(component.name || '', component)
  }
}

const Plugin = {
  install(vue: Application): void {
    registerComponent(vue, QxDynamicForm)
    registerComponent(vue, QxDynamicTable)
    registerComponent(vue, QxDynamicSearchTable)
    registerComponent(vue, QxBrowerSelection)
  },
}

export default Plugin

export { QxDynamicForm, QxDynamicTable, QxDynamicSearchTable, QxBrowerSelection }
