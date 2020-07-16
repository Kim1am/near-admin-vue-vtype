import utils from './utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {}
  },
  created() {
    // global log tool
    window.Logline = utils.loglineObj
  },
  computed: {
    ...mapGetters(['locale', 'gloablLocale'])
  }
}
