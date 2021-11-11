import { AxiosPromise } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  methods: {
    async submitEditor(
      formdata: { id: string | undefined | null },
      createapi: (data: any) => AxiosPromise,
      updateapi: (id: string, data: any) => AxiosPromise,
      refresh: () => void | undefined
    ): Promise<void> {
      const win = this as any
      try {
        // 更新数据
        if (formdata.id !== null && formdata.id !== undefined) {
          await updateapi(formdata.id, formdata)
        }
        // 新建数据
        else {
          await createapi(formdata)
        }
        win.$emit('close', true)
        ElMessage({ type: 'success', message: '提交成功!' })
        if (refresh) refresh()
      } catch (error: any) {
        ElMessage({ type: 'info', message: `提交失败： ${error.message}` })
      }
    },
    async del(id: string, delapi: (id: string) => AxiosPromise): Promise<void> {
      try {
        await ElMessageBox.confirm('此操作将删除该商品, 是否继续?', '提示', { type: 'warning' })
        await delapi(id)
      } catch (error: any) {
        error == 'cancel' || ElMessage({ type: 'info', message: `提交失败： ${error.message}` })
      }
    },
  },
}
