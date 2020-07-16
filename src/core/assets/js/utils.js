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
  if (!params.url) {
    Vue.prototype.$message.error(
      Vue.prototype.$t(dict.localeObj.requestInfo.withoutUrl)
    )
    return false
  }
  // set default value
  params.headers = params.headers || {}
  params.headers['Content-Type'] =
    params.headers['Content-Type'] || 'application/json'
  params.timeout = params.timeout || 20000
  params.method = params.method || 'POST'
  params.responseType = params.responseType || 'json'
  const rCfg = {
    headers: params.headers,
    responseType: params.responseType,
    timeout: params.timeout
  }
  if (params.method === 'POST') {
    try {
      const result = await axios.post(params.url, params.data, rCfg)
      const resData = result.data
      const resCode = resData.code
      const mainData = resData.data
      if (resCode === 0) {
        if (params.success) {
          params.success(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        loglineObj.setLog({
          logType: 'error',
          desc: 'api fail',
          data: {
            message: resData.message,
            params,
            response: resData
          }
        })
        if (params.fail) {
          params.fail(resData)
        } else {
          // eslint-disable-next-line
          console.log('request fail')
        }
      }
      return resData
    } catch (e) {
      loglineObj.setLog({
        logType: 'error',
        desc: 'api fail',
        data: {
          message: e,
          params
        }
      })
      if (params.error) {
        params.error(e)
      } else {
        // eslint-disable-next-line
        console.log('request error')
      }
      return e
    }
  } else if (params.method === 'GET') {
    try {
      const getParams = Object.assign({ params: params.data }, rCfg)
      const result = await axios.get(params.url, getParams)
      const resData = result.data
      const resCode = resData.code
      const mainData = resData.data
      if (resCode === 0) {
        if (params.success) {
          params.success(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        loglineObj.setLog({
          logType: 'error',
          desc: 'api fail',
          data: {
            message: resData.message,
            params,
            response: resData
          }
        })
        if (params.fail) {
          params.fail(resData)
        } else {
          // eslint-disable-next-line
          console.log('request fail')
        }
      }
      return resData
    } catch (e) {
      loglineObj.setLog({
        logType: 'error',
        desc: 'api fail',
        data: {
          message: e,
          params
        }
      })
      if (params.error) {
        params.error(e)
      } else {
        // eslint-disable-next-line
        console.log('request error')
      }
      return e
    }
  } else if (params.method === 'PUT') {
    try {
      const result = await axios.put(params.url, params.data, rCfg)
      const resData = result.data
      const resCode = resData.code
      const mainData = resData.data
      if (resCode === 0) {
        if (params.success) {
          params.success(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        loglineObj.setLog({
          logType: 'error',
          desc: 'api fail',
          data: {
            message: resData.message,
            params,
            response: resData
          }
        })
        if (params.fail) {
          params.fail(resData)
        } else {
          // eslint-disable-next-line
          console.log('request fail')
        }
      }
      return resData
    } catch (e) {
      loglineObj.setLog({
        logType: 'error',
        desc: 'api fail',
        data: {
          message: e,
          params
        }
      })
      if (params.error) {
        params.error(e)
      } else {
        // eslint-disable-next-line
        console.log('request error')
      }
      return e
    }
  } else if (params.method === 'DELETE') {
    try {
      const getParams = Object.assign({ params: params.data }, rCfg)
      const result = await axios.delete(params.url, getParams)
      const resData = result.data
      const resCode = resData.code
      const mainData = resData.data
      if (resCode === 0) {
        if (params.success) {
          params.success(mainData)
        } else {
          // eslint-disable-next-line
          console.log('request successful')
        }
      } else {
        loglineObj.setLog({
          logType: 'error',
          desc: 'api fail',
          data: {
            message: resData.message,
            params,
            response: resData
          }
        })
        if (params.fail) {
          params.fail(resData)
        } else {
          // eslint-disable-next-line
          console.log('request fail')
        }
      }
      return resData
    } catch (e) {
      loglineObj.setLog({
        logType: 'error',
        desc: 'api fail',
        data: {
          message: e,
          params
        }
      })
      if (params.error) {
        params.error(e)
      } else {
        // eslint-disable-next-line
        console.log('request error')
      }
      return e
    }
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
  sendReq
}