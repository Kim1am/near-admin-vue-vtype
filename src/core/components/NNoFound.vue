<template>
  <div class="n-not-found-wrp">
    <div class="n-not-found">
      <div class="n-not-found-icon">
        <img :src="iconUrl" alt="404" />
      </div>
      <div class="n-not-found-tip">{{ $t(dict.localeObj.errorPage.errorTip.notfoundTip) }}</div>
      <div class="n-not-found-op">
        <a-button @click="closeCurTag" type="primary">{{ $t(dict.localeObj.errorPage.btnText) }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import dict from '@custom/dict'
import { mapGetters } from 'vuex'
import CoreBase from '@corejs/base'

export default {
  name: 'NNoFound',
  mixins: [CoreBase],
  data () {
    return {
      iconUrl: '/static/images/manage/404.png',
      dict
    }
  },
  computed: {
    ...mapGetters(['curTagIndex'])
  },
  methods: {
    closeCurTag () {
      const self = this
      self.$closepage({
        idx: self.curTagIndex
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@corescss/manage/error.scss';
</style>
