import utils from './utils'
import { mapGetters, mapActions } from 'vuex'
import Bus from '@corejs/eventbus'
import hotKeyConfig from '@custom/hotkeyconfig'

export default {
  created () {
    window.Logline = utils.loglineObj
  },
  computed: {
    ...mapGetters(['locale', 'gloablLocale', 'comConfig', 'isFullScreen'])
  },
  methods: {
    ...mapActions(['changeFullScreen']),
    bindHotKeyEvent () {
      const self = this
      if (self.comConfig.buildSwitch.isHotKey) {
        window.onkeyup = e => {
          e.preventDefault()
          Bus.$emit('windowKeyup', e)
        }
      }
    },
    bindResizeEvent () {
      window.onresize = () => {
        Bus.$emit('windowResize')
      }
    },
    bindScreenEvent () {
      document.onfullscreenchange = () => {
        Bus.$emit('windowFullScreen')
      }
    },
    initBusListener () {
      const self = this
      // listen key up event
      Bus.$off('windowKeyup').$on('windowKeyup', e => {
        const hotKey = utils.getHotKeyStringList(e)
        const hotKeyPathObj = hotKeyConfig[hotKey]
        const activeCp = self.$refs['active-cp']
        if (hotKeyPathObj) {
          const hotKeyWildcardList = hotKeyPathObj['*'] || []
          const hotKeyPageList = hotKeyPathObj[activeCp.pagePath] || []
          const allHotKeyList = hotKeyWildcardList.concat(hotKeyPageList)
          allHotKeyList.forEach(item => {
            activeCp.triggerEvent(item.method, item.params, hotKey)
          })
        }
      })
      // listen screen event
      Bus.$off('windowFullScreen').$on('windowFullScreen', () => {
        self.changeFullScreen(!self.isFullScreen)
      })
    }
  },
  mounted () {
    const self = this
    self.bindHotKeyEvent()
    self.bindResizeEvent()
    self.bindScreenEvent()
    self.initBusListener()
  }
}
