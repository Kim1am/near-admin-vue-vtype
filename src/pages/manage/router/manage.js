import Vue from 'vue'
import VueRouter from 'vue-router'
import dict from '@custom/dict'
import utils from '@corejs/utils'
const NManage = () => import('@corecp/NManage.vue')

Vue.use(VueRouter)

const routesConfig = [
  {
    path: '/',
    name: 'Manage',
    component: NManage
  }
]

const routerOpt = {
  mode: 'history',
  base: `/${dict.commonObj.managePath}`,
  routes: routesConfig
}

const routesList =
  localStorage.getItem(`${dict.commonObj.managePath}AsyncRoute`) || ''
let newRoutesList
try {
  newRoutesList = JSON.parse(routesList)
  if (!Array.isArray(newRoutesList)) {
    newRoutesList = []
  }
} catch (e) {
  newRoutesList = []
}

newRoutesList.forEach(item => {
  item.component = () => import('../view/' + item.componentPath)
})

if (routerOpt && routerOpt.routes) {
  routerOpt.routes = routerOpt.routes.concat(newRoutesList)
}

const routeObj = new VueRouter(routerOpt)

routeObj.beforeEach((to, from, next) => {
  const title = to.meta.title
  if (to.meta.title) {
    utils.setPageTitle(title)
  } else {
    utils.setPageTitle('')
  }
  next()
})

export default routeObj
