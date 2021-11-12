<template>
  <div class="flex">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#202c30"
      :class="{
        'ele-override': true,
        'el-menu-vertical-demo': true,
        'w-20': menubar.status === 0 || menubar.status === 2,
        'w-0': menubar.status === 3,
        'w-0': menubar.status === 1,
      }"
      :default-active="rootActiveMenu"
      text-color="#fff"
      @select="rootSelected"
    >
      <menubar-item v-for="v in rootMenus" :key="v.path" :index="v.path" :menu-list="v" />
    </el-menu>
    <el-scrollbar class="whitelize" wrap-class="scrollbar-wrapper">
      <el-menu
        ref="rightmenu"
        :class="{
          'el-menu-vertical-demo': true,
          'w-44': menubar.status === 0 || menubar.status === 2,
          'w-0': menubar.status === 3,
          'w-16': menubar.status === 1,
        }"
        :collapse="menubar.status === 1"
        :collapse-transition="false"
        :default-active="activeMenu"
        :default-openeds="allOpenedIndex"
        @select="onOpenChange"
      >
        <menubar-item v-for="v in rightMenus" :key="v.path" :index="v.path" :menu-list="v" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import MenubarItem from '/@/layout/components/menubarItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { IMenubarList } from '/@/type/store/layout'
import { useLayoutStore } from '/@/store/modules/layout'

// 过滤隐藏的菜单，并提取单条的子菜单
const filterMenubar = (menuList: IMenubarList[]) => {
  const f = (menuList: IMenubarList[]) => {
    let arr: IMenubarList[] = []
    menuList
      .filter((v) => !v.meta.hidden)
      .forEach((v) => {
        // let child = v.children && v.children.filter((v) => !v.meta.hidden)
        let currentItem = v
        // if (!v.meta.alwaysShow && child && child.length === 1) {
        //   [currentItem] = child
        // }
        arr.push(currentItem)
        if (currentItem.children && currentItem.children.length > 0) {
          arr[arr.length - 1].children = f(currentItem.children)
        }
      })
    return arr
  }
  return f(menuList)
}

export default defineComponent({
  name: 'LayoutMenubar',
  components: {
    MenubarItem,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { getMenubar, setRoutes, changeCollapsed } = useLayoutStore()

    const filterMenubarData = filterMenubar(getMenubar.menuList)

    setRoutes(filterMenubarData)

    const activeMenu = computed(() => {
      if (route.meta.activeMenu) return route.meta.activeMenu
      return route.path
    })
    let selectroot: any = ref(null)
    const rootActiveMenu = computed(() => {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      selectroot.value = null
      let result = activeMenu.value && `/${(activeMenu.value as any as string).split('/')[1]}`
      let any = filterMenubarData.filter((c) => c.path == result).length > 0
      return any ? result : '/'
    })
    const onOpenChange = (d: any) => {
      router.push({ path: d })
      getMenubar.status === 2 && changeCollapsed()
    }
    // 左侧一级菜单的数据
    let rootMenus = computed(() =>
      filterMenubarData.map((c) => {
        let d = { ...c }
        d.children = undefined
        d.meta.title = c.meta.title.substr(0, 3)
        return d
      })
    )
    // 右侧二级菜单的数据
    let rightMenus = computed(() => {
      if (getMenubar.status == 0 || getMenubar.status == 2) {
        let selected = filterMenubarData.filter((c) => c.path == (selectroot.value || rootActiveMenu.value))
        return (selected[0] && selected[0].children) || filterMenubarData[0].children || []
      } else {
        return filterMenubarData
      }
    })
    let allOpenedIndex: any = []
    filterMenubarData.forEach((c) => {
      if (c.children) allOpenedIndex.push(...c.children?.map((c) => c.path))
    })

    return {
      selectroot,
      menubar: getMenubar,
      filterMenubarData,
      rootMenus,
      rightMenus,
      allOpenedIndex,
      rootActiveMenu,
      activeMenu,
      onOpenChange,
    }
  },
  watch: {
    'menubar.status'(v) {
      if (v == 2 || v == 0) {
        this.allOpenedIndex = [...this.allOpenedIndex]
      }
    },
  },
  mounted() {
    this.selectroot = this.rootActiveMenu
  },
  methods: {
    rootSelected(idx: string) {
      this.selectroot = idx
    },
  },
})
</script>
<style lang="postcss">
.ele-override {
  .el-menu-item {
    padding: 0 8px !important;
    font-size: 0.7rem;
    i {
      width: 0.7rem;
      font-size: 0.7rem;
    }
  }
}
</style>
