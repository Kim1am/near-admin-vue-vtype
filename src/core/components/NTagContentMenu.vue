<template>
  <div ref="ctx-menu" class="n-tag-ctx-menu-wrp" v-if="showCtxMenu" :style="curCtxPosStyle">
    <a-menu class="n-tag-ctx-menu" @select="selectItem">
      <a-menu-item
        key="cur"
        v-if="curCtxPos.idx !== 0 && !(curTagList[curCtxPos.idx].params && curTagList[curCtxPos.idx].params.isAffix)"
      >
        <a target="_blank" rel="noopener noreferrer">{{ $t(dict.localeObj.tagObj.closeCur) }}</a>
      </a-menu-item>
      <a-menu-item key="right" v-if="curCtxPos.idx !== curTagList.length - 1">
        <a target="_blank" rel="noopener noreferrer">{{ $t(dict.localeObj.tagObj.closeRight) }}</a>
      </a-menu-item>
      <a-menu-item key="other" v-if="curTagList.length > 1 && curCtxPos.idx !== 0">
        <a target="_blank" rel="noopener noreferrer">{{ $t(dict.localeObj.tagObj.closeOther) }}</a>
      </a-menu-item>
      <a-menu-item key="all" v-if="curTagList.length > 1">
        <a target="_blank" rel="noopener noreferrer">{{ $t(dict.localeObj.tagObj.closeAll) }}</a>
      </a-menu-item>
      <a-menu-item key="single">
        <a target="_blank" rel="noopener noreferrer">{{ $t(dict.localeObj.tagObj.singlePage) }}</a>
      </a-menu-item>
      <a-menu-item key="refresh" v-if="curTagIndex === curCtxPos.idx">
        <a target="_blank" rel="noopener noreferrer">{{ $t(dict.localeObj.tagObj.refreshPage) }}</a>
      </a-menu-item>
      <a-menu-item key="affix">
        <a
          target="_blank"
          rel="noopener noreferrer"
        >{{ (curTagList[curCtxPos.idx].params && curTagList[curCtxPos.idx].params.isAffix) ? $t(dict.localeObj.tagObj.cancelAffixPage) : $t(dict.localeObj.tagObj.affixPage) }}</a>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dict from '@custom/dict'
import bus from '@corejs/eventbus'

export default {
  name: 'NTagContentMenu',
  data () {
    return {
      dict,
      showCtxMenu: false,
      curCtxPos: {
        x: 0,
        y: 0,
        idx: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'curTagIndex',
      'shrinkLeftMenu',
      'curTagList'
    ]),
    curCtxPosStyle () {
      const self = this
      const leftMargin = self.shrinkLeftMenu ? self.curCtxPos.x : self.curCtxPos.x - 200
      return `margin-top: ${self.curCtxPos.y}px; margin-left: ${leftMargin}px`
    }
  },
  methods: {
    initBusEvent () {
      const self = this
      bus.$off('tagCtxMenu').$on('tagCtxMenu', (val) => {
        self.showCtxMenu = true
        self.curCtxPos = val
      })
    },
    initGlobalClickClose () {
      const self = this
      document.addEventListener('click', (e) => {
        const ctxMenu = self.$refs['ctx-menu']
        if (!(ctxMenu && ctxMenu.contains(e.target))) {
          self.showCtxMenu = false
        }
      })
    },
    selectItem ({ key }) {
      const self = this
      if (['single', 'refresh', 'affix'].indexOf(key) === -1) {
        self.$closepage({
          idx: self.curCtxPos.idx,
          type: key
        })
      } else {
        // single page and refresh
        if (key === 'single') {
          self.$emit('single', self.curCtxPos.idx)
        } else if (key === 'refresh') {
          self.$emit('refresh', self.curCtxPos.idx)
        } else if (key === 'affix') {
          self.$emit('affix', self.curCtxPos.idx)
        }
      }

      self.showCtxMenu = false
    }
  },
  created () {
    const self = this
    self.initBusEvent()
    self.initGlobalClickClose()
  }
}
</script>

<style lang="scss" scoped>
@import '~@corescss/manage/tagmenu.scss';
</style>
