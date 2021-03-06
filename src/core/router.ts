import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  { path: "/", component: () => import("@/views/list.vue") },
  { path: "/edit", component: () => import("@/views/form.vue") },
  {
    path: "*",
    component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
