<template>
  <div :class="['n-common-title', noTop ? 'no-top' : '']">{{ $t(title) }}</div>
</template>

<script>

export default {
  name: 'NCommonTitle',
  props: {
    title: {
      type: String
    },
    noTop: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@corescss/manage/commontitle.scss';
</style>
