import Vue from "vue";
import Vuex from "vuex";
import modalState from "./State/modalState";
import userState from "./State/userState";
import activeMenuState from "./State/ActiveMenuState";
import userServiceState from "./Users-Frontend/State/userServiceState";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    modal: modalState,
    userState: userState,
    activeMenuState: activeMenuState,
    userServiceState: userServiceState,
  },
});

export default store;
