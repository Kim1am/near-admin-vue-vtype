import api from '@api/manage/apiMethod'
import { mapActions } from 'vuex'
import utils from '@corejs/utils'

export default {
  methods: {
    ...mapActions(['changeMenu', 'changeUserInfo', 'changeRightPathList']),
    getUserMenu() {
      const self = this
      api.getUserMenu({
        success(res) {
          self.changeMenu(res)
          self.setRightPath(res)
        }
      })
    },
    getUserInfo() {
      const self = this
      api.getUserInfo({
        success(res) {
          self.changeUserInfo(res)
        }
      })
    },
    //过滤可访问的链接
    setRightPath(menuObj) {
      const self = this
      // to set right path for visitor, not in the right path will show 403 page
      const rightPathList = self.getRootCp(menuObj.menuList)
      const uniqueRightPathSet = new Set(rightPathList)
      self.changeRightPathList([...uniqueRightPathSet])
    },
    //把菜单可访问的组件/链接收集起来
    getRootCp(menuList) {
      const self = this
      let rightPathList = []
      menuList.forEach(item => {
        if (utils.isEmpty(item.child) && !utils.isEmpty(item.path)) {
          if (utils.isUrl(item.path)) {
            rightPathList.push(item.path)
          }
          rightPathList.push(item.path)
        } else if (!utils.isEmpty(item.child) && utils.isEmpty(item.path)) {
          rightPathList = rightPathList.concat(self.getRootCp(item.child))
        }
      })
      return rightPathList
    }
  },
  created() {
    const self = this
    //获取用户菜单
    self.getUserMenu()
    //获取用户信息
    self.getUserInfo()
  }
}
