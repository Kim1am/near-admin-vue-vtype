import { globalLocaleObj } from '@corejs/lang'
import comConfig from '@custom/config'

const CACHE_LOCALE = localStorage.getItem('nearAdminLang') || 'zh-cn'

const state = {
  locale: CACHE_LOCALE,
  gloablLocale: globalLocaleObj,
  comConfig,
  menuObj: {
    menuList: []
  },
  curMenu: [0],
  isFullScreen: false,
  userInfo: {
    avatar: '',
    userName: '',
    role: '',
    roleName: '',
    gender: 0
  }
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
  },
  isFullScreen: getterSate => {
    return getterSate.isFullScreen
  },
  menuObj: getterState => {
    return getterState.menuObj
  },
  curMenu: getterState => {
    return getterState.curMenu
  },
  userInfo: getterState => {
    return getterState.userInfo
  }
}
const mutations = {
  changeLocale: (mutationState, locale) => {
    mutationState.locale = locale
  },
  changeFullScreen: (mutationState, fullScreen) => {
    mutationState.isFullScreen = fullScreen
  },
  changeMenu: (mutationState, menuObj) => {
    mutationState.menuObj = menuObj
  },
  changeCurMenu: (mutationState, curMenu) => {
    mutationState.curMenu = curMenu
  },
  changeUserInfo: (mutationState, userInfo) => {
    mutationState.userInfo = userInfo
  }
}
const actions = {
  changeLocale: (context, locale) => {
    context.commit('changeLocale', locale)
  },
  changeFullScreen: (context, fullScreen) => {
    context.commit('changeFullScreen', fullScreen)
  },
  changeMenu: (context, menuObj) => {
    context.commit('changeMenu', menuObj)
  },
  changeCurMenu: (context, curMenu) => {
    context.commit('changeCurMenu', curMenu)
  },
  changeUserInfo: (context, userObj) => {
    context.commit('changeUserInfo', userObj)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
