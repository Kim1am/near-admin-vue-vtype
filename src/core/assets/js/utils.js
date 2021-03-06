import Logline from 'logline'
import comConfig from '@custom/config'
import axios from 'axios'
import dict from '@custom/dict'
import Vue from 'vue'
const coreLocale = require('@corejs/locale_BASE')

const loglineObj = {
  setLog({ module, logType, desc, data }) {
    Logline.using(Logline.PROTOCOL.INDEXEDDB)
    if (!module) {
      // 默认是接口请求的错误
      module = 'api-request'
    }
    const logObj = new Logline(module)
    switch (logType) {
      case 'info':
        logObj.info(desc)
        break
      case 'error':
        logObj.error(desc, data)
        break
      case 'warning':
        logObj.warning(desc)
        break
      default:
        logObj.error(desc, data)
    }
  },
  // get log
  getLog({ start, end, callback }) {
    // start, end的单位为d，例如：1天-1d，半天-.5d，
    if (start && end) {
      // 获取start-end范围内的日志
      Logline.get(start, end, logs => {
        if (callback) {
          callback(logs)
        } else {
          // eslint-disable-next-line
          console.log(logs)
        }
      })
    } else if (start && !end) {
      // 获取start天内的日志
      Logline.get(start, logs => {
        if (callback) {
          callback(logs)
        } else {
          // eslint-disable-next-line
          console.log(logs)
        }
      })
    } else {
      // 获取所有日志
      Logline.all(logs => {
        if (callback) {
          callback(logs)
        } else {
          // eslint-disable-next-line
          console.log(logs)
        }
      })
    }
  },
  // clear log
  cleanLog() {
    Logline.clean()
  }
}
const isRegExp = v => {
  return Object.prototype.toString.call(v) === '[object RegExp]'
}
const arrayRemove = (arr, item) => {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
const isDef = v => {
  return v !== undefined && v !== null
}

const isAsyncPlaceholder = node => {
  return node.isComment && node.asyncFactory
}

const getFirstComponentChild = children => {
  if (Array.isArray(children)) {
    for (const c of children) {
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}
const setPageTitle = title => {
  if (title) {
    window.document.title = title
  }
}

const randomCharacter = rdn => {
  const newList = []
  const characterList = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  for (let i = 0; i < rdn; i++) {
    const rdnChar =
      characterList[
        parseInt((Math.random() * characterList.length).toString(), 10)
      ]
    newList.push(i === 0 ? rdnChar : rdnChar.toLowerCase())
  }
  return newList.join('')
}

const getObjAttrByStr = (obj, path) => {
  if (!obj || !path) {
    return null
  } else {
    const pathList = path
      .replace(/\[/g, '.')
      .replace(/\]/g, '.')
      .split('.')
    let result = null
    try {
      pathList.forEach(item => {
        if (result === null) {
          result = obj[item]
        } else {
          result = result[item]
        }
      })
      return result
    } catch (e) {
      return null
    }
  }
}

const getLocaleIfI18nOff = str => {
  if (!comConfig.buildSwitch.isI18n) {
    return getObjAttrByStr(coreLocale, str) || str
  } else {
    return str
  }
}

const getDeviceInfo = qt => {
  const userAgent = window.navigator.userAgent
  if (qt === 'browser') {
    const isOpera = userAgent.indexOf('Opera') > -1
    const isIE =
      userAgent.indexOf('compatible') > -1 &&
      userAgent.indexOf('MSIE') > -1 &&
      !isOpera
    const isFF = userAgent.indexOf('Firefox') > -1
    const isSafari = userAgent.indexOf('Safari') > -1
    const isChrome = userAgent.indexOf('Chrome') > -1
    const isEdge = userAgent.indexOf('Edge') > -1
    if (isIE) {
      const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      const ieVersion = parseFloat(RegExp.$1)
      return `IE${ieVersion}`
    } else if (isFF) {
      return 'Firefox'
    } else if (isOpera) {
      return 'Opera'
    } else if (isChrome) {
      return 'Chrome'
    } else if (isEdge) {
      return 'Edge'
    } else if (isSafari) {
      return 'Safari'
    } else {
      return 'Unknown'
    }
  } else if (qt === 'machine') {
    const isAndroid = userAgent.indexOf('Android') > -1
    const isIphone = userAgent.indexOf('iPhone') > -1
    const isIpad = userAgent.indexOf('iPad') > -1
    const isMac = /macintosh|mac os x/i.test(userAgent)
    const isWindows =
      userAgent.indexOf('win64') >= 0 || userAgent.indexOf('wow64') >= 0
    if (isAndroid) {
      return 'Android'
    } else if (isIphone) {
      return 'Iphone'
    } else if (isIpad) {
      return 'Ipad'
    } else if (isMac) {
      return 'OSX'
    } else if (isWindows) {
      return 'Windows'
    } else {
      return 'Unknown'
    }
  } else {
    // eslint-disable-next-line
    console.warn('no match query type')
  }
}
const sendReq = async params => {
  // check url
  const {
    headers: pHeaders = {},
    url: pUrl,
    timeout: pTimeout = 20000,
    method: pMethod = 'POST',
    responseType: pResponseType = 'json',
    data: pData,
    success: pSuccess,
    fail: pFail,
    error: pError
  } = params
  if (!pUrl) {
    Vue.prototype.$message.error(
      Vue.prototype.$t(dict.localeObj.requestInfo.withoutUrl)
    )
    return false
  }
  // set Content-Type default value
  pHeaders['Content-Type'] = pHeaders['Content-Type'] || 'application/json'
  const rCfg = {
    pHeaders,
    pResponseType,
    pTimeout
  }
  if (pMethod === 'POST') {
    try {
      const {
        data: resData,
        data: { code: resCode, data: mainData }
      } = await axios.post(pUrl, pData, rCfg)
      if (resCode === 0) {
        if (pSuccess) {
          pSuccess(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        resQuestFail(resData, params, pFail)
      }
      return resData
    } catch (e) {
      return catchError(e, params, pError)
    }
  } else if (pMethod === 'GET') {
    try {
      const getParams = Object.assign({ params: pData }, rCfg)
      const {
        data: resData,
        data: { code: resCode, data: mainData }
      } = await axios.get(pUrl, getParams)
      if (resCode === 0) {
        if (pSuccess) {
          pSuccess(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        resQuestFail(resData, params, pFail)
      }
      return resData
    } catch (e) {
      return catchError(e, params, pError)
    }
  } else if (pMethod === 'PUT') {
    try {
      const {
        data: resData,
        data: { code: resCode, data: mainData }
      } = await axios.put(pUrl, pData, rCfg)
      if (resCode === 0) {
        if (pSuccess) {
          pSuccess(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        resQuestFail(resData, params, pFail)
      }
      return resData
    } catch (e) {
      return catchError(e, params, pError)
    }
  } else if (pMethod === 'DELETE') {
    try {
      const getParams = Object.assign({ params: pData }, rCfg)
      const {
        data: resData,
        data: { code: resCode, data: mainData }
      } = await axios.delete(pUrl, getParams)
      if (resCode === 0) {
        if (pSuccess) {
          pSuccess(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        resQuestFail(resData, params, pFail)
      }
      return resData
    } catch (e) {
      return catchError(e, params, pError)
    }
  }
}
const fullScreenCtl = tp => {
  const ele = document.documentElement
  if (tp) {
    if (ele.requestFullscreen) {
      ele.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}
const getHotKeyStringList = e => {
  console.log(e)
  // confirm if combine keyboard
  const ctrlKey = {
    isKey: e.ctrlKey,
    name: 'ctrl'
  }
  const altKey = {
    isKey: e.altKey,
    name: 'alt'
  }
  const shiftKey = {
    isKey: e.shiftKey,
    name: 'shift'
  }
  const metaKey = {
    isKey: e.metaKey,
    name: 'command'
  }
  const exKeyList = [ctrlKey, altKey, shiftKey, metaKey]
  const keyStringList = []
  exKeyList.forEach(item => {
    if (item.isKey) {
      keyStringList.push(item.name)
    }
  })
  keyStringList.push(e.key.toLowerCase())
  return keyStringList.join('+')
}
const isUrl = str => {
  const urlReg = /^((http:\/\/)|(https:\/\/))/g
  if (urlReg.test(str)) {
    return true
  } else {
    return false
  }
}

const isEmpty = val => {
  if (Array.isArray(val)) {
    if (val.length > 0) {
      return false
    } else {
      return true
    }
  } else {
    return !(val !== undefined && val !== null && val !== '')
  }
}

const handlerMenuSelect = (self, n) => {
  if (!n || !n[0] || typeof n[0] !== 'string') {
    // check if have value
    return false
  }
  // check if click by tag, if true, no need to emit change-cp
  const notFromMenuReg = /@bytag@/g
  const isNotFromMenu = notFromMenuReg.test(n[0])
  const cpIndex = n[0].replace('@bytag@', '')
  const existMenu = getCpMenuByNavIndex(self, cpIndex)
  // check if side menu exist index
  if (existMenu) {
    // exist
    const cpPath = existMenu.path
    const cpTitle = existMenu.name
    const menuParams = existMenu.params
    if (!isNotFromMenu) {
      self.$emit('change-cp', {
        component: cpPath, //组件对应路劲
        title: cpTitle, //菜单名
        navIndex: cpIndex, //菜单路径路径，ex：menu-0-sub-1-0-0
        params: menuParams || null,
        pk: cpIndex,
        breadList: getBreadList(self, cpIndex) //组装“面包屑”
      })
    }
  }
}
const getCpMenuByNavIndex = (self, navIndex) => {
  if (navIndex.startsWith('menu')) {
    const [navIndexListFather, navIndexListSon] = navIndex.split('-sub-')
    const [, topMenuIndex] = navIndexListFather.split('-')
    const asideMenuIndexList = navIndexListSon.split('-')
    const menuObj = self.$store.getters.menuObj
    //获取首级菜单数组
    const topMenuObj = menuObj.menuList[topMenuIndex]
    //获取子菜单
    let temMenuList = topMenuObj.child
    let targetMenuObj
    //根据子菜单数组，逐层查找,直至找到对应菜单对象
    asideMenuIndexList.forEach(item => {
      const temMenuObj = temMenuList[item]
      temMenuList = temMenuObj.child || []
      targetMenuObj = temMenuObj
    })
    return targetMenuObj
  } else {
    return undefined
  }
}
//组装面包屑
const getBreadList = (self, navIndex) => {
  //ex：menu-0-sub-1-0-0
  const [topMenu, asideMenu] = navIndex.split('-sub-')
  const [, topMenuIndex] = topMenu.split('-')
  const asideMenuIndexList = asideMenu.split('-')
  const breadList = []
  const menuObj = self.$store.getters.menuObj

  const topMenuObj = menuObj.menuList[topMenuIndex]
  topMenuObj.navIndex = `menu-${topMenuIndex}`

  let temMenuList = topMenuObj.child
  temMenuList.forEach((item, index) => {
    item.navIndex = `${topMenuObj.navIndex}-sub-${index}`
  })
  breadList.push(topMenuObj)
  asideMenuIndexList.forEach(item => {
    const temMenuObj = temMenuList[item]
    temMenuList = temMenuObj.child || []
    //WARNING:this loop for the object which is  the max deep level 3
    temMenuList.forEach((sitem, sindex) => {
      sitem.navIndex = `${temMenuObj.navIndex}-${sindex}`
    })
    breadList.push(temMenuObj)
  })
  return breadList
}
const encodeParams = params => {
  try {
    return encodeURIComponent(JSON.stringify(params))
  } catch (e) {
    return ''
  }
}
const timestampToDateString = (stamp, gap, isToday, isObj, withoutMinSec) => {
  if (typeof stamp === 'string') {
    // for transfer string to timestamp, and fix osx or ios bug
    stamp = new Date(stamp.replace(/-/g, '/')).getTime()
  }

  const date = new Date(stamp)
  const year = date.getFullYear()
  const month = formatTwice(date.getMonth() + 1)
  const day = formatTwice(date.getDate())
  const hour = formatTwice(date.getHours())
  const minutes = formatTwice(date.getMinutes())
  const seconds = formatTwice(date.getSeconds())

  if (!isToday) {
    if (isObj) {
      return { year, month, day, hour, minutes, seconds }
    } else {
      if (withoutMinSec) {
        return [year, month, day].join(gap)
      } else {
        return `${[year, month, day].join(gap)} ${[hour, minutes].join(':')}`
      }
    }
  } else {
    // 获取今天的时间戳范围
    const toady = new Date()
    const toadyStartStamp = new Date(
      `${[toady.getFullYear(), toady.getMonth() + 1, toady.getDate()].join(
        '/'
      )} 00:00:00`
    ).getTime()
    const toadyEndStamp = toadyStartStamp + 24 * 60 * 60 * 1000

    if (stamp >= toadyStartStamp && stamp <= toadyEndStamp) {
      if (withoutMinSec) {
        return '今天'
      } else {
        return `今天 ${[hour, minutes].join(':')}`
      }
    } else {
      if (isObj) {
        return { year, month, day, hour, minutes, seconds }
      } else {
        if (withoutMinSec) {
          return [year, month, day].join(gap)
        } else {
          return `${[year, month, day].join(gap)} ${[hour, minutes].join(':')}`
        }
      }
    }
  }
}
const formatTwice = str => {
  let temStr = str.toString()
  temStr = temStr.length === 2 ? temStr : `0${temStr}`
  return temStr
}

const exportExcel = (columnList, dataList, fileName) => {
  let ctx = ''
  columnList.forEach(item => {
    ctx = ctx + `<td>${item}</td>`
  })
  ctx = `<tr>${ctx}</tr>`

  dataList.forEach(item => {
    ctx += '<tr>'
    for (const key of Object.keys(item)) {
      ctx += `<td>${item[key] + '\t'}</td>`
    }
    ctx += '</tr>'
  })

  const worksheet = fileName
  const uri = 'data:application/vnd.ms-excel;base64,'

  const tpl = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>${ctx}</table></body></html>`

  const link = document.createElement('a')
  link.href = uri + toBase64(tpl)
  link.download = `download_${timestampToDateString(
    new Date().getTime(),
    '-',
    false,
    false,
    true
  )}_${fileName}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const toBase64 = str => {
  return window.btoa(unescape(encodeURIComponent(str)))
}
const getMenuRootCp = (
  menuList,
  isObj,
  replaceField = { title: 'name' },
  targetMenu
) => {
  let rightPathList = []
  menuList.forEach((item, index) => {
    if (isEmpty(item.child) && !isEmpty(item.path)) {
      if (isObj) {
        const key = `Customer-Entry-${index}-${item[replaceField.title]}`
        if (targetMenu) {
          if (targetMenu.indexOf(key) !== -1) {
            rightPathList.push({
              key,
              path: item.path,
              title: item[replaceField.title]
            })
          }
        } else {
          rightPathList.push({
            key,
            path: item.path,
            title: item[replaceField.title]
          })
        }
      } else {
        rightPathList.push(item.path)
      }
    } else if (!isEmpty(item.child) && isEmpty(item.path)) {
      rightPathList = rightPathList.concat(
        getMenuRootCp(item.child, isObj, replaceField, targetMenu)
      )
    }
  })
  return rightPathList
}

const catchError = (e, params, pError) => {
  loglineObj.setLog({
    logType: 'error',
    desc: 'api fail',
    data: {
      message: e,
      params
    }
  })
  if (pError) {
    pError(e)
  } else {
    // eslint-disable-next-line
    console.log('request error')
  }
  return e
}

const resQuestFail = (resData, params, pFail) => {
  loglineObj.setLog({
    logType: 'error',
    desc: 'api fail',
    data: {
      message: resData.message,
      params,
      response: resData
    }
  })
  if (pFail) {
    pFail(resData)
  } else {
    // eslint-disable-next-line
    console.log('request fail')
  }
}

export default {
  loglineObj,
  isRegExp,
  arrayRemove,
  isDef,
  isAsyncPlaceholder,
  getFirstComponentChild,
  setPageTitle,
  randomCharacter,
  getObjAttrByStr,
  getLocaleIfI18nOff,
  getDeviceInfo,
  sendReq,
  fullScreenCtl,
  getHotKeyStringList,
  isUrl,
  isEmpty,
  handlerMenuSelect,
  getCpMenuByNavIndex,
  getBreadList,
  encodeParams,
  exportExcel,
  toBase64,
  formatTwice,
  timestampToDateString,
  getMenuRootCp
}
