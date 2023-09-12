import Vuex from "vuex";
import Vue from "vue";
import Axios from "axios";

Vue.use(Vuex);

const userState = {
  state: {
    isUserLogged: false,
    userRights: [],
  },

  mutations: {
    setLoginState(state, loginStatus) {
      state.isUserLogged = loginStatus;
    },

    setUserRights(state, userRights) {
      console.log(userRights);

      state.userRights = userRights;
    },
  },

  actions: {
    checkUserLogin({ commit }) {
      Axios.get("http://localhost:5000/check-token-from-login", {
        withCredentials: true,
      })
        .then((response) => {
          if (response.data.isLogged === true) {
            const userRights = response.data.rights.map((roleRight) => {
              return roleRight.rights.map((right) => {
                return right.name;
              });
            });

            // Flatten the array and remove duplicates using a Set
            const uniqueUserRighs = [...new Set(userRights.flat())];
            commit("setLoginState", true);
            commit("setUserRights", uniqueUserRighs);
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
    userRights: (state) => state.userRights,
  },
};

export default userState;
