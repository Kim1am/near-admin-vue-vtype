import apiUrl from './apiUrl'
import utils from '@corejs/utils'

const getUserMenu = async reqType => {
  reqType.method = 'POST'
  reqType.url = apiUrl.getUserMenu
  const result = await utils.sendReq(reqType)
  return result
}

const getUserInfo = async reqType => {
  reqType.method = 'POST'
  reqType.url = apiUrl.getUserInfo
  const result = await utils.sendReq(reqType)
  return result
}

export default {
  getUserMenu,
  getUserInfo
}
