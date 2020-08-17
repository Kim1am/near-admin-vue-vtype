import coreLocale from '@corejs/locale'

export default {
  localeObj: {
    ...coreLocale,
    menuObj: {
      defaultMenu: {
        home: 'menuObj.defaultMenu.home'
      },
      errorTip: {
        notfoundTip: 'menuObj.errorTip.notfoundTip',
        emptyErr: 'menuObj.errorTip.emptyErr'
      }
    },
    loginForm: {
      byAccountBtn: 'loginForm.byAccountBtn',
      byPhoneBtn: 'loginForm.byPhoneBtn',
      accountPlaceholder: 'loginForm.accountPlaceholder',
      passwordPlaceholder: 'loginForm.passwordPlaceholder',
      phonePlaceholder: 'loginForm.phonePlaceholder',
      validPlaceholder: 'loginForm.validPlaceholder',
      validBtn: 'loginForm.validBtn',
      autoLoginPlaceholder: 'loginForm.autoLogin',
      forgetBtn: 'loginForm.forgetBtn',
      loginBtn: 'loginForm.loginBtn',
      accountEmptyErr: 'loginForm.byAccountTip.emptyErr',
      passwordEmptyErr: 'loginForm.byPasswordTip.emptyErr',
      validEmptyErr: 'loginForm.byValidTip.emptyErr',
      repeatSendMsgWarn: 'loginForm.sendMsg.repeatErr',
      getMsgSuccess: 'loginForm.sendMsg.success',
      getMsgTip: 'loginForm.sendMsg.codeTip',
      loginSuccess: 'loginForm.loginSuccess'
    }
  },
  commonObj: {
    authPath: 'auth',
    managePath: 'manage',
    loglinePath: 'logline/Logline',
    settingPath: 'setting/Setting',
    loginForm: {
      sendMsgGap: 10
    },
    copyright: {
      githubUrl: 'https://github.com/Kim1am/near-admin-vue-vtype.git'
    },
    shrinkThresholdValue: 800,
    tablePagingInfoOpt: {
      current: 1,
      pageSize: 10,
      total: 0,
      'show-size-changer': true,
      pageSizeOptions: ['10', '30', '50']
    },
    localStorageKey: [
      'nearAdminCustomerEntry',
      'nearAdminCacheConfig',
      'nearAdminTagIndex',
      'nearAdminTagList',
      'nearAdminLang'
    ]
  }
}
