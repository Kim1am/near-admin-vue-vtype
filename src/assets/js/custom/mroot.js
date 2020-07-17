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
    setRightPath(menuObj) {
      const self = this
      // to set right path for visitor, not in the right path will show 403 page
      const rightPathList = self.getRootCp(menuObj.menuList)
      const uniqueRightPathSet = new Set(rightPathList)
      self.changeRightPathList([...uniqueRightPathSet])
    },
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
    self.getUserMenu()
    self.getUserInfo()
  }
}
