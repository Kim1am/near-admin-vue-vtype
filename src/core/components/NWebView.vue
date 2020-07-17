<template>
  <iframe :src="cpParams.dataUrl" frameborder="0" class="n-iframe"></iframe>
</template>

<script>
import CoreBase from '@corejs/base'

export default {
  name: 'NWebView',
  mixins: [CoreBase],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@corescss/manage/iframe.scss';
</style>
