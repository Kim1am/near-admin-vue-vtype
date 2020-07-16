import apiUrl from './apiUrl'
import utils from '@corejs/utils'

const getSendMsg = async reqType => {
  reqType.method = 'POST'
  reqType.url = apiUrl.getSendMsg
  const result = await utils.sendReq(reqType)
  return result
}

const checkLoginByAccount = async reqType => {
  reqType.method = 'POST'
  reqType.url = apiUrl.checkLoginByAccount
  const result = await utils.sendReq(reqType)
  return result
}

const checkLoginByPhone = async reqType => {
  reqType.method = 'POST'
  reqType.url = apiUrl.checkLoginByPhone
  const result = await utils.sendReq(reqType)
  return result
}

export default {
  getSendMsg,
  checkLoginByAccount,
  checkLoginByPhone
}
