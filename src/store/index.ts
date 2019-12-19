import Vue from "vue"
import Vuex from "vuex"
import config from "./config"
import permission from "./permission"
import userinfo from "./userinfo"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    config,
    permission,
    userinfo
  }
})
