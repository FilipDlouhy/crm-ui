import Vue from "vue";
import Vuex from "vuex";
import modalState from "./State/modalState";
import userState from "./State/userState";
import activeMenuState from "./State/ActiveMenuState";
import usersState from "./Users-Frontend/State/usersState";
import rolesState from "./Users-Frontend/State/roleState";
import contactFormState from "./Contacts-frontend/State/contactFormsState";
import contactState from "./Contacts-frontend/State/contactState";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    modal: modalState,
    userState: userState,
    activeMenuState: activeMenuState,
    usersState: usersState,
    rolesState: rolesState,
    contactFormState: contactFormState,
    contactState: contactState,
  },
});

export default store;
