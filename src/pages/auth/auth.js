import Vue from 'vue'
import App from './App.vue'
import router from './router/auth'
import store from '@store/index'
import i18n from '@corejs/lang'
import mock from '@mock/index'

// antd component
import {
  ConfigProvider,
  Row,
  Col,
  Tabs,
  FormModel,
  Input,
  Icon,
  Checkbox,
  Button,
  Dropdown,
  Menu,
  Form,
  message,
  notification
} from 'ant-design-vue'
import comConfig from '@custom/config'
import utils from '@corejs/utils'

// config
Vue.config.productionTip = false

// import antd component
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(ConfigProvider.name, ConfigProvider)
Vue.component(Tabs.name, Tabs)
Vue.component(Tabs.TabPane.name, Tabs.TabPane)
Vue.component(FormModel.name, FormModel)
Vue.component(FormModel.Item.name, FormModel.Item)
Vue.component(Icon.name, Icon)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Checkbox.Group.name, Checkbox.Group)
Vue.component(Input.name, Input)
Vue.component(Button.name, Button)
Vue.component(Dropdown.name, Dropdown)
Vue.component(Menu.name, Menu)
Vue.component(Menu.Item.name, Menu.Item)
Vue.component(Form.name, Form)

// import antd directive
Vue.prototype.$message = message
Vue.prototype.$notification = notification

// reset `$t` directive when isI18n switch is on
if (!comConfig.buildSwitch.isI18n) {
  Vue.prototype.$t = str => {
    return utils.getLocaleIfI18nOff(str)
  }
}

// mockjs
if (comConfig.buildSwitch.isMock) {
  Vue.use(mock)
}

new Vue({
  render: h => h(App),
  store,
  router,
  i18n
}).$mount('#app')
