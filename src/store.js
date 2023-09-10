import Vue from "vue";
import Vuex from "vuex";
import modalState from "./State/modalState";
import userState from "./State/userState";
import activeMenuState from "./State/ActiveMenuState";
import usersState from "./Users-Frontend/State/usersState";
import rolesState from "./Users-Frontend/State/roleState";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    modal: modalState,
    userState: userState,
    activeMenuState: activeMenuState,
    usersState: usersState,
    rolesState: rolesState,
  },
});

export default store;
