import Vue from 'vue'
import VueRouter from 'vue-router'
import dict from '@custom/dict'
import utils from '@corejs/utils'
const Login = () => import('../view/Login.vue')

Vue.use(VueRouter)

const routesConfig = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const routerOpt = {
  mode: 'history',
  base: `/${dict.commonObj.authPath}`,
  routes: routesConfig
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
