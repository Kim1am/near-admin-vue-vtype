<template>
  <codemirror v-model="codeData" :options="codeOpt"></codemirror>
</template>

<script>
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/mode/javascript/javascript.js'

export default {
  name: 'NCodemirror',
  props: {
    codeData: {
      type: String
    },
    codeOpt: {
      type: Object,
      default () {
        return {
          readOnly: true,
          tabSize: 4,
          mode: 'application/json',
          lineNumbers: true,
          line: true
        }
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
