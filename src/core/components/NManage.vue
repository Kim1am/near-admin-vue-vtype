<template>
  <div class="n-manage-ctx">
    <a-layout class="n-layout-wrp">
      <n-header></n-header>
      <a-layout></a-layout>
    </a-layout>
  </div>
</template>

<script>
import NHeader from '@corecp/NHeader.vue'

export default {
  name: 'NManage',
  // mixins: [CoreManageBase],
  components: {
    NHeader,
  },
  computed: {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~@corescss/manage/manage.scss';
</style>
