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
      state.userRights = userRights;
    },
  },

  actions: {
    // This action checks the user's login status and retrieves their rights.
    checkUserLogin({ commit }) {
      // Send a GET request to the server to check the user's token from login using Axios.
      Axios.get("http://localhost:5000/check-token-from-login", {
        withCredentials: true,
      })
        .then((response) => {
          // Check if the user is logged in based on the server response.
          if (response.data.isLogged === true) {
            // Extract user rights from the server response and flatten the array, removing duplicates using a Set.
            const userRights = response.data.rights.map((roleRight) => {
              return roleRight.rights.map((right) => {
                return right.name;
              });
            });
            const uniqueUserRights = [...new Set(userRights.flat())];

            // Commit a Vuex mutation to set the login state to true.
            commit("setLoginState", true);

            // Commit a Vuex mutation to set the user rights in the store.
            commit("setUserRights", uniqueUserRights);
          } else {
            // Commit a Vuex mutation to set the login state to false if the user is not logged in.
            commit("setLoginState", false);
          }
        })
        .catch((error) => {
          // Add error handling: Log the error to the console for debugging purposes.
          console.log(error);
        });
    },

    setIsUserLogged({ commit }, isLogged) {
      commit("setLoginState", isLogged);
    },

    async updateUserRights({ commit }) {
      const response = await Axios.get(
        "http://localhost:5000/user/get-user-rights",
        {
          withCredentials: true,
        }
      );

      const userRights = response.data.rights.map((roleRight) => {
        return roleRight.rights.map((right) => {
          return right.name;
        });
      });

      // Flatten the array and remove duplicates using a Set
      const uniqueUserRighs = [...new Set(userRights.flat())];
      commit("setUserRights", uniqueUserRighs);
    },
  },

  getters: {
    isUserLogged: (state) => state.isUserLogged,
    userRights: (state) => state.userRights,
  },
};

export default userState;
