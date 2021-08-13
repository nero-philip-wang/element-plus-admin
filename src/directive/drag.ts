/* eslint-disable prefer-destructuring */
import { App } from 'vue'
const getViewportSize = function() {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  return {
    width,
    height,
  }
}
const containment = true

export default (app: App<Element>): void => {
  app.directive('draggable', {
    mounted(el) {
      const dlg = el.getElementsByClassName('el-dialog')[0]
      const title = el.getElementsByClassName('el-dialog__title')[0]
      title.style.userSelect = 'none'
      title.style['-ms-user-select'] = 'none'
      title.style['-moz-user-select'] = 'none'
      title.style.cursor = 'move'

      dlg.offsetX = 0
      dlg.offsetY = 0

      const move = function(e: any) {
        let left = e.pageX - dlg.offsetX
        let top = e.pageY - dlg.offsetY
        if (containment) {
          // Constrains left & top
          left = Math.max(left, 0)
          top = Math.max(top, 0)
          // Constrains right & bottom
          const viewport = getViewportSize()
          left = Math.min(left, viewport.width - dlg.offsetWidth)
          top = Math.min(top, viewport.height - dlg.offsetHeight)
        }
        dlg.style.margin = '0px'
        dlg.style.left = `${left}px`
        dlg.style.top = `${top}px`
      }

      const up = function() {
        removeEventListener('mousemove', move)
        removeEventListener('mouseup', up)
      }

      const down = function(e: any) {
        dlg.offsetX = e.pageX - dlg.offsetLeft
        dlg.offsetY = e.pageY - dlg.offsetTop
        addEventListener('mousemove', move)
        addEventListener('mouseup', up)
      }

      const header = el.getElementsByClassName('el-dialog__header')[0]
      header.addEventListener('mousedown', down)
      header.style.cursor = 'move'
    },
  })
}
