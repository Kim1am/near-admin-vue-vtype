import { globalLocaleObj, i18nObj } from '@corejs/lang'
import comConfig from '@custom/config'
import dict from '@custom/dict'
import utils from '@corejs/utils'
import Vue from 'vue'

const CACHE_LOCALE = localStorage.getItem('nearAdminLang') || 'zh-cn'
const RDN_KEY = utils.randomCharacter(6)
//用于初始化后默认首页
const defaultTagList = [
  {
    component: 'home/HomePage',
    title: dict.localeObj.menuObj.defaultMenu.home,
    navIndex: '-1',
    pk: RDN_KEY,
    params: {
      isAffix: true
    }
  }
]

let cacheTagList
let cacheTagIndex

if (comConfig.buildSwitch.isCache) {
  cacheTagList = JSON.parse(
    localStorage.getItem('nearAdminTagList') || JSON.stringify(defaultTagList)
  )
  cacheTagIndex = JSON.parse(localStorage.getItem('nearAdminTagIndex') || '0')
} else {
  cacheTagList = []
  cacheTagIndex = 0
}

const rmTagOp = (rmTagState, closeOpt) => {
  const self = Vue.prototype
  const targetList = []
  switch (closeOpt.type) {
    case 'right':
      const rmLength = rmTagState.curTagList.length - 1 - closeOpt.idx
      // get affix tag in remove items
      for (let i = closeOpt.idx + 1; i < closeOpt.idx + rmLength + 1; i++) {
        const item = rmTagState.curTagList[i]
        if (item.params && item.params.isAffix) {
          targetList.push(item)
        }
      }
      rmTagState.curTagList.splice(closeOpt.idx + 1, rmLength)
      // add affix items
      rmTagState.curTagList = rmTagState.curTagList.concat(targetList)
      if (!closeOpt.target || closeOpt.target === 0) {
        if (closeOpt.idx <= state.curTagIndex) {
          rmTagState.curTagIndex = closeOpt.idx
        }
      } else {
        rmTagState.curTagIndex = closeOpt.target
      }
      break
    case 'other':
      // get affix tag in remove items
      for (let i = 1; i < rmTagState.curTagList.length; i++) {
        const item = rmTagState.curTagList[i]
        if (item.params && item.params.isAffix && i !== closeOpt.idx) {
          targetList.push(item)
        }
      }
      if (closeOpt.idx === 0) {
        rmTagState.curTagList = [rmTagState.curTagList[0]]
        rmTagState.curTagIndex = 0
      } else {
        rmTagState.curTagList = [
          rmTagState.curTagList[0],
          rmTagState.curTagList[closeOpt.idx]
        ]
        rmTagState.curTagIndex = 1
      }
      rmTagState.curTagList = rmTagState.curTagList.concat(targetList)
      break
    case 'all':
      // get affix tag in remove items
      for (let i = 1; i < rmTagState.curTagList.length; i++) {
        const item = rmTagState.curTagList[i]
        if (item.params && item.params.isAffix) {
          targetList.push(item)
        }
      }
      rmTagState.curTagList = [rmTagState.curTagList[0]]
      rmTagState.curTagIndex = 0
      rmTagState.curTagList = rmTagState.curTagList.concat(targetList)
      break
    // default is type 'cur'
    default:
      const targetTag = rmTagState.curTagList[closeOpt.idx]
      if (targetTag.params && targetTag.params.isAffix) {
        self.$message.warn(
          i18nObj.$t(dict.localeObj.tagObj.errorTip.affixPageCloseError)
        )
      } else {
        rmTagState.curTagList.splice(closeOpt.idx, 1)
        if (!closeOpt.target || closeOpt.target === 0) {
          if (closeOpt.idx <= state.curTagIndex) {
            rmTagState.curTagIndex--
          }
        } else {
          rmTagState.curTagIndex = closeOpt.target
        }
      }
  }
  // change default index
  const curIndex = rmTagState.curTagList[rmTagState.curTagIndex].navIndex
  if (curIndex) {
    rmTagState.defaultIndexs = [curIndex]
  }
}

const state = {
  userInfo: {
    avatar: '',
    userName: '',
    role: '',
    roleName: '',
    gender: 0
  },
  locale: CACHE_LOCALE,
  gloablLocale: globalLocaleObj,
  comConfig,
  menuObj: {
    menuList: []
  },
  curMenu: [0],
  defaultIndexs: [],
  curTagList: cacheTagList,
  curTagIndex: cacheTagIndex,
  rightPathList: [],
  shrinkLeftMenu: false,
  saveWarning: false,
  isFullScreen: false,
  isCpLoading: true
}

const getters = {
  userInfo: getterState => {
    return getterState.userInfo
  },
  locale: getterState => {
    return getterState.locale
  },
  gloablLocale: getterState => {
    return getterState.gloablLocale
  },
  comConfig: getterState => {
    return getterState.comConfig
  },
  menuObj: getterState => {
    return getterState.menuObj
  },
  curMenu: getterState => {
    return getterState.curMenu
  },
  defaultIndexs: getterState => {
    return getterState.defaultIndexs
  },
  curTagList: getterState => {
    return getterState.curTagList
  },
  curTagIndex: getterState => {
    return getterState.curTagIndex
  },
  rightPathList: getterState => {
    return getterState.rightPathList
  },
  shrinkLeftMenu: getterState => {
    return getterState.shrinkLeftMenu
  },
  saveWarning: getterSate => {
    return getterSate.saveWarning
  },
  isFullScreen: getterSate => {
    return getterSate.isFullScreen
  },
  isCpLoading: getterSate => {
    return getterSate.isCpLoading
  }
}

const mutations = {
  changeLocale: (mutationState, locale) => {
    mutationState.locale = locale
  },
  changeMenu: (mutationState, menuObj) => {
    mutationState.menuObj = menuObj
  },
  changeCurMenu: (mutationState, curMenu) => {
    mutationState.curMenu = curMenu
  },
  changeDefaultIndexs: (mutationState, curSideMenu) => {
    mutationState.defaultIndexs = curSideMenu
  },
  addCurTag: (mutationState, cpInfo) => {
    // insert after cur tag index
    if (cpInfo.params && cpInfo.params.apiNew) {
      // if api new page, add it to the last tag
      mutationState.curTagList.push(cpInfo)
      mutationState.curTagIndex = mutationState.curTagList.length - 1
      // set menu index to null
      if (cpInfo.navIndex) {
        mutationState.defaultIndexs = [cpInfo.navIndex]
      }
    } else {
      // else add it the cur tag' next position
      mutationState.curTagList.splice(mutationState.curTagIndex + 1, 0, cpInfo)
      mutationState.curTagIndex++
    }
  },
  removeCurTag: (mutationState, closeOpt) => {
    const self = Vue.prototype
    if (closeOpt.idx || closeOpt.idx === 0) {
      // alert if check save or not
      const curOpCp = mutationState.curTagList[closeOpt.idx]
      let checkSaveFlag = false

      switch (closeOpt.type) {
        case 'right':
          const rightList = mutationState.curTagList.slice(
            closeOpt.idx + 1,
            mutationState.curTagList.length
          )
          for (const item of rightList) {
            if (item.params && item.params.checkSave && !item.params.isAffix) {
              checkSaveFlag = true
              break
            }
          }
          break
        case 'other':
          for (let i = 1; i < mutationState.curTagList.length; i++) {
            const item = mutationState.curTagList[i]
            if (
              i !== closeOpt.idx &&
              item.params &&
              item.params.checkSave &&
              !item.params.isAffix
            ) {
              checkSaveFlag = true
              break
            }
          }
          break
        case 'all':
          for (let i = 1; i < mutationState.curTagList.length; i++) {
            const item = mutationState.curTagList[i]
            if (item.params && item.params.checkSave && !item.params.isAffix) {
              checkSaveFlag = true
              break
            }
          }
          break
        default:
          checkSaveFlag =
            curOpCp.params &&
            curOpCp.params.checkSave &&
            !curOpCp.params.isAffix
      }

      if (checkSaveFlag) {
        mutationState.saveWarning = true
        self.$confirm({
          content: i18nObj.$t(dict.localeObj.tagObj.checkSave),
          onOk() {
            rmTagOp(mutationState, closeOpt)
            mutationState.saveWarning = false
          },
          onCancel() {
            self.$message.info(i18nObj.$t(dict.localeObj.tagObj.cancelClose))
            mutationState.saveWarning = false
          }
        })
      } else {
        rmTagOp(mutationState, closeOpt)
      }
    }
  },
  updateCurTag: (mutationState, updatePageOpt) => {
    for (const key of Object.keys(updatePageOpt.updateCpInfo)) {
      mutationState.curTagList[updatePageOpt.idx][key] =
        updatePageOpt.updateCpInfo[key]
    }
  },
  changeCurTagIndex: (mutationState, tagIndex) => {
    mutationState.curTagIndex = tagIndex
  },
  changeShrinkLeftMenu: (mutationState, isShrink) => {
    mutationState.shrinkLeftMenu = isShrink
  },
  changeUserInfo: (mutationState, userInfo) => {
    mutationState.userInfo = userInfo
  },
  changeRightPathList: (mutationState, rightPathList) => {
    mutationState.rightPathList = rightPathList
  },
  changeFullScreen: (mutationState, fullScreen) => {
    mutationState.isFullScreen = fullScreen
  },
  changeCpLoading: (mutationState, isCpLoading) => {
    mutationState.isCpLoading = isCpLoading
  }
}

const actions = {
  changeLocale: (context, locale) => {
    context.commit('changeLocale', locale)
  },
  changeMenu: (context, menuObj) => {
    context.commit('changeMenu', menuObj)
  },
  changeUserInfo: (context, userObj) => {
    context.commit('changeUserInfo', userObj)
  },
  changeCurMenu: (context, curMenu) => {
    context.commit('changeCurMenu', curMenu)
  },
  changeDefaultIndexs: (context, curSideMenu) => {
    context.commit('changeDefaultIndexs', curSideMenu)
  },
  changeTag: (context, tagOp) => {
    if (tagOp.op === 'add') {
      context.state.isCpLoading = true
      context.commit('addCurTag', tagOp.cpInfo)
    } else if (tagOp.op === 'remove') {
      context.commit('removeCurTag', tagOp.closeOpt)
    } else if (tagOp.op === 'update') {
      if (tagOp.updateOpt.updateCpInfo.pk) {
        context.state.isCpLoading = true
      }
      context.commit('updateCurTag', tagOp.updateOpt)
    }
    // cache tag component
    if (comConfig.buildSwitch.isCache) {
      localStorage.setItem(
        'nearAdminTagList',
        JSON.stringify(context.state.curTagList)
      )
    }
  },
  changeCurTagIndex: (context, tagIndex) => {
    context.commit('changeCurTagIndex', tagIndex)
  },
  changeShrinkLeftMenu: (context, isShrink) => {
    context.commit('changeShrinkLeftMenu', isShrink)
  },
  changeRightPathList: (context, rightPathList) => {
    context.commit('changeRightPathList', rightPathList)
  },
  changeFullScreen: (context, fullScreen) => {
    context.commit('changeFullScreen', fullScreen)
  },
  changeCpLoading: (context, isCpLoading) => {
    context.commit('changeCpLoading', isCpLoading)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
