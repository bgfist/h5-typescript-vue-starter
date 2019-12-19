import Vue from "vue"
import router from "@/core/router"
import store from "@/store"
import ElementUI from "element-ui"
import "@/styles/element-theme.scss"
import QyApp from "@/components/qy-app.vue"
import QyDialog from "@/components/qy-dialog.vue"
import QyForm from "@/components/qy-form.vue"
import QyTable from "@/components/qy-table.vue"
import QyUpload from "@/components/qy-upload.vue"

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component("qy-dialog", QyDialog)
Vue.component("qy-form", QyForm)
Vue.component("qy-table", QyTable)
Vue.component("qy-upload", QyUpload)

new Vue({
  router,
  store,
  render: h => h(QyApp)
}).$mount("#app")
