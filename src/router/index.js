import Vue from "vue";
import VueRouter from "vue-router";
import UsersDashboard from "../Users-Frontend/Components/UsersDashboard.vue";
import RolesDashboard from "../Users-Frontend/Components/RolesDashboard.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/Users", component: UsersDashboard },
  { path: "/Roles", component: RolesDashboard },
];

const router = new VueRouter({
  routes,
});

export default router;
