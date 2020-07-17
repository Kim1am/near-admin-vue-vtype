import dict from '@custom/dict'
export default {
  props: {
    pagePath: {
      type: String
    },
    cpParams: {}
  },
  data() {
    return {
      dict
    }
  },
  methods: {
    triggerEvent(methodName, params, hotKey) {
      const self = this
      if (self[methodName]) {
        self[methodName](params, hotKey)
      }
    }
  },
  mounted() {
    const self = this
    self.$emit('load')
  }
}
