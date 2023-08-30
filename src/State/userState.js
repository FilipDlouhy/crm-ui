import Vuex from "vuex";
import Vue from "vue";
import Axios from "axios";

Vue.use(Vuex);

const userState = {
  state: {
    isUserLogged: true,
  },

  mutations: {
    setLoginState(state, loginStatus) {
      state.isUserLogged = loginStatus;
    },
  },

  actions: {
    checkUserLogin({ commit }) {
      Axios.get("http://localhost:5000/check-token-from-login", {
        withCredentials: true,
      })
        .then((response) => {
          if (response.data.isLogged === true) {
            commit("setLoginState", true);
          } else {
            commit("setLoginState", false);
          }
        })
        .catch((error) => {
          // add error handling
          console.log(error);
        });
    },

    setIsUserLogged({ commit }, isLogged) {
      commit("setLoginState", isLogged);
    },
  },

  getters: {
    isUserLogged: (state) => state.isUserLogged,
  },
};

export default userState;
