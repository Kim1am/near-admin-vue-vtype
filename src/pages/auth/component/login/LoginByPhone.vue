<template>
  <div class="n-login-by-phone">
    <a-form-model :model="formModel" ref="formModel" :rules="formModel.rules">
      <a-form-model-item prop="account.value">
        <a-input
          v-model="formModel.account.value"
          autocomplete="autocomplete"
          name="name"
          :placeholder="$t(formModel.account.placeholder)"
        >
          <a-icon slot="prefix" :type="formModel.account.prefixIconType" class="primary-color" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="valid.value">
        <a-row :gutter="12">
          <a-col :span="16">
            <a-input
              autocomplete="autocomplete"
              v-model="formModel.valid.value"
              :placeholder="$t(formModel.valid.placeholder)"
            >
              <a-icon slot="prefix" :type="formModel.valid.prefixIconType" class="primary-color" />
            </a-input>
          </a-col>
          <a-col class="n-valid-btn" :span="8">
            <a-button :title="$t(validBtn.btnText)" @click="sendMsg" :disabled="isSendMsg">
              <template v-if="isSendMsg">{{ lastSeconds }}s</template>
              <template v-else>{{ $t(validBtn.btnText) }}</template>
            </a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import dict from '@custom/dict'
import { mapGetters } from 'vuex'
import api from '@api/auth/apiMethod'

export default {
  name: 'LoginByPhone',
  data() {
    return {
      formModel: {
        account: {
          placeholder: dict.localeObj.loginForm.phonePlaceholder,
          value: '',
          prefixIconType: 'mobile'
        },
        valid: {
          placeholder: dict.localeObj.loginForm.validPlaceholder,
          value: '',
          prefixIconType: 'mail'
        },
        rules: {}
      },
      validBtn: {
        btnText: dict.localeObj.loginForm.validBtn
      },
      isSendMsg: false,
      lastSeconds: dict.commonObj.loginForm.sendMsgGap,
      validCode: null
    }
  },
  computed: {
    ...mapGetters([
      'locale'
    ])
  },
  watch: {
    locale() {
      // change locale to initRules for i18n show
      const self = this
      self.$refs.formModel.clearValidate()
      self.initRules()
    }
  },
  created() {
    const self = this
    self.initRules()
    self.getLastSeconds()
  },
  methods: {
    initRules() {
      const self = this
      self.formModel.rules = {
        ['account.value']: [
          {
            required: true,
            message: self.$t(dict.localeObj.loginForm.accountEmptyErr),
            trigger: 'blur'
          }
        ],
        ['valid.value']: [
          {
            required: true,
            message: self.$t(dict.localeObj.loginForm.validEmptyErr),
            trigger: 'blur'
          }
        ]
      }
    },
    sendMsg() {
      const self = this
      if (self.isSendMsg) {
        self.$message.warn(self.$t(dict.localeObj.loginForm.repeatSendMsgWarn))
      } else {
        localStorage.setItem('msgSendTime', new Date().getTime().toString())
        self.isSendMsg = true
        self.startTimer()
        self.toSendMsg()
      }
    },
    getLastSeconds() {
      const self = this
      const msgSendTime = localStorage.getItem('msgSendTime')
      if (msgSendTime) {
        // if have msgSendTime
        const nowTime = new Date().getTime()
        const gapTime = nowTime - parseInt(msgSendTime, 10)
        if (gapTime > dict.commonObj.loginForm.sendMsgGap * 1000) {
          // able click
          self.isSendMsg = false
          localStorage.removeItem('msgSendTime')
        } else {
          // count last seconds
          self.isSendMsg = true
          self.lastSeconds = dict.commonObj.loginForm.sendMsgGap - parseInt((gapTime / 1000).toString(), 10)
          self.startTimer()
        }
      }
    },
    startTimer() {
      const self = this
      const timer = setInterval(() => {
        self.lastSeconds--
        if (self.lastSeconds <= 0) {
          clearInterval(timer)
          self.isSendMsg = false
          localStorage.removeItem('msgSendTime')
          self.lastSeconds = dict.commonObj.loginForm.sendMsgGap
        }
      }, 1000)
    },
    async toSendMsg() {
      const self = this
      await api.getSendMsg({
        success: (res) => {
          self.$notification.success({
            message: self.$t(dict.localeObj.loginForm.getMsgSuccess),
            description: `${self.$t(dict.localeObj.loginForm.getMsgTip)}：${res.msgCode}`
          })
          self.validCode = res.msgCode
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
