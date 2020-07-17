<template>
  <a-breadcrumb class="n-bread-crumb">
    <a-breadcrumb-item v-for="(item, index) in cpBread" :key="index">
      {{ $t(item.name) }}
      <template v-if="item.child && item.child.length > 0">
        <a-menu slot="overlay" mode="inline">
          <a-menu-item
            v-for="(sitem) in item.child"
            :key="sitem.navIndex"
            :nav-index="sitem.navIndex"
            :cp-path="sitem.path"
            :params-detail="encodeParams(sitem.params)"
            :cp-name="sitem.name"
            @click="handlerSelect([sitem.navIndex])"
          >{{ $t(sitem.name) }}</a-menu-item>
        </a-menu>
      </template>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import utils from '@corejs/utils'

export default {
  name: 'NBreadCrumb',
  props: {
    cpBread: {
      type: Array
    }
  },
  data () {
    return {}
  },
  methods: {
    encodeParams: utils.encodeParams,
    handlerSelect (n) {
      const self = this
      utils.handlerMenuSelect(self, n)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@corescss/manage/breadcrumb.scss';
</style>
