import Vue from "vue";
import Vuex from "vuex";
import modalState from "./State/modalState";
import userState from "./State/userState";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    modal: modalState,
    userState: userState,
  },
});

export default store;
