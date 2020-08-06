<template>
  <div class="customer-entry"></div>
</template>

<script>
import CoreBase from '@corejs/base'
import Base from '@custom/base'
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',
  mixins: [CoreBase, Base],
  computed: {
    ...mapGetters([
      'cacheEntry'
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>
