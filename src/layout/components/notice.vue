<template>
  <el-dropdown trigger="click">
    <el-badge class="el-dropdown-link item mx-2 cursor-pointer leading-none" type="danger" :value="6">
      <i class="el-icon-bell text-xl" />
    </el-badge>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs class="notice-tabs z-10" type="border-card">
          <el-tab-pane class="notice-tabs-pane" label="通知">
            <el-scrollbar class="scrollbar-wrapper">
              <list :data="data" />
              <el-pagination :hide-on-single-page="false" layout="prev, pager, next" :pager-count="5" small :total="1000" />
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane class="notice-tabs-pane" label="关注">
            <el-scrollbar class="scrollbar-wrapper">
              <list :data="data" />
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane class="notice-tabs-pane" label="待办">
            <el-scrollbar class="scrollbar-wrapper">
              <list :data="data" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import List, { IList } from '/@/components/List/index.vue'

export default defineComponent({
  name: 'Notice',
  components: {
    List,
  },
  setup() {
    const data: IList[] = [
      {
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subTitle: '斗通关无际县军连用知政以该果思快领a。',
        time: '2021/01/28 15:21:32',
        href: 'javascript:;',
      },
      {
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subTitle: '斗通关无际县军连用知政以该果思快领a。',
        time: '2021/01/28 15:21:32',
      },
      {
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subTitle: '斗通关无际县军连用知政以该果思快领a。',
        time: '2021/01/28 15:21:32',
      },
      {
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subTitle: '斗通关无际县军连用知政以该果思快领a。',
        time: '2021/01/28 15:21:32',
      },
      {
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subTitle: '斗通关无际县军连用知政以该果思快领a。',
        time: '2021/01/28 15:21:32',
      },
      {
        imgUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        subTitle: '斗通关无际县军连用知政以该果思快领a。',
        time: '2021/01/28 15:21:32',
      },
    ]
    return {
      data,
    }
  },
})
</script>

<style lang="postcss" scoped>
.notice-tabs {
  margin: -10px 0;
  border: none;
  width: 300px;
}

.notice-tabs-pane {
  height: 400px;
  overflow: hidden;
  margin: -15px;
}

.scrollbar-wrapper {
  padding: 15px;
}
</style>
