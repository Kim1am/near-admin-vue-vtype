<template>
  <a-config-provider :locale="gloablLocale[locale]">
    <div class="n-main-ctx">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>

<script>
import CoreRoot from '@corejs/root'
import ManageRoot from '@custom/mroot'

export default {
  name: 'App',
  mixins: [CoreRoot, ManageRoot]
}
</script>

<style lang="css">
@import '~@font/iconfont/iconfont.css';
</style>

<style lang="scss">
@import '~@scss/custom/index.scss';
</style>
