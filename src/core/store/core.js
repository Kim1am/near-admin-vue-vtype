import { globalLocaleObj } from '@corejs/lang'
import comConfig from '@custom/config'

const CACHE_LOCALE = localStorage.getItem('nearAdminLang') || 'zh-cn'

const state = {
  locale: CACHE_LOCALE,
  gloablLocale: globalLocaleObj,
  comConfig
}

const getters = {
  locale: getterState => {
    return getterState.locale
  },
  gloablLocale: getterState => {
    return getterState.gloablLocale
  },
  comConfig: getterState => {
    return getterState.comConfig
  }
}
const mutations = {
  changeLocale: (mutationState, locale) => {
    mutationState.locale = locale
  }
}
const actions = {
  changeLocale: (context, locale) => {
    context.commit('changeLocale', locale)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
