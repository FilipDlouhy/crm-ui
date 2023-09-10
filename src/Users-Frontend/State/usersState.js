import axios from "axios";

const usersState = {
  state: {
    showUserAddForm: false,
    selectedFiltersUser: [],
    selectedFiltersSortUser: [],
    users: [],
    usersToChange: [],
    stateToChange: null,
    userPage: 1,
    userLastPage: 0,
    userTotal: 0,
  },
  mutations: {
    toggleUserAddForm(state, showForm) {
      state.showUserAddForm = showForm;
    },
    addSelectedFilterUser(state, { filterName, filterValue }) {
      let valueChangeObject; // Initialize a variable to hold the object to be updated
      let exists; // Initialize a variable to check if the object already exists
      // Loop through the selectedFiltersUser array to find the object
      for (const filter of state.selectedFiltersUser) {
        if (filter.filterName === filterName) {
          exists = true;
          valueChangeObject = filter;
          break;
        }
      }

      // If the object doesn't exist, add it to the selectedFiltersUser array
      if (!exists) {
        state.selectedFiltersUser.push({ filterName, filterValue });
      }

      // If the object exists and the value needs to be changed
      if (exists && valueChangeObject.filterValue !== filterValue) {
        // Find the index of the object to delete based on filterName
        const indexToDelete = state.selectedFiltersUser.findIndex(
          (filter) => filter.filterName === filterName
        );

        // Remove the existing object from the selectedFiltersUser array
        state.selectedFiltersUser.splice(indexToDelete, 1);

        // Push a new object with the updated filterValue
        state.selectedFiltersUser.push({ filterName, filterValue });
      }
    },
    removeSelectedFilterUser(state, filterName) {
      // Use filter method to create a new array without the filter to be removed
      state.selectedFiltersUser = state.selectedFiltersUser.filter(
        (filter) => filter.filterName !== filterName
      );
    },

    addSelectedFilterSortUser(state, { filterName, ascending }) {
      let valueChangeObject; // Initialize a variable to hold the object to be updated
      let exists; // Initialize a variable to check if the object already exists
      // Loop through the selectedFiltersSortUser array to find the object
      for (const filter of state.selectedFiltersSortUser) {
        if (filter.filterName === filterName) {
          exists = true;
          valueChangeObject = filter;
          break;
        }
      }

      // If the object doesn't exist, add it to the selectedFiltersSortUser array
      if (!exists) {
        state.selectedFiltersSortUser.push({
          filterName,
          ascending,
        });
      }

      // If the object exists and the value needs to be changed
      if (exists && valueChangeObject.ascending !== ascending) {
        // Find the index of the object to delete based on filterName
        const indexToDelete = state.selectedFiltersSortUser.findIndex(
          (filter) => filter.filterName === filterName
        );

        // Remove the existing object from the selectedFiltersSortUser array
        state.selectedFiltersSortUser.splice(indexToDelete, 1);

        // Push a new object with the updated filterValue
        state.selectedFiltersSortUser.push({
          filterName,
          ascending,
        });
      }
    },
    removeSelectedFilterSortUser(state, filterName) {
      // Use filter method to create a new array without the filter to be removed

      state.selectedFiltersSortUser = state.selectedFiltersSortUser.filter(
        (filter) => filter.filterName !== filterName
      );
    },
    addUser(state, user) {
      if (state.users.length > 25) {
        state.users.pop();
        state.users.push(user);
      } else {
        state.users.push(user);
      }
    },

    setUsers(state, users) {
      state.users = users;
    },

    setUsersToChange(state, usersToChange) {
      state.usersToChange = usersToChange;
    },

    setStateToChange(state, newState) {
      state.stateToChange = newState;
    },

    setUserPage(state, userPage) {
      if (userPage > state.userLastPage || userPage < 1) {
        return;
      }
      state.userPage = userPage;
    },
    setUserTotal(state, userTotal) {
      state.userTotal = userTotal;
    },
    setUserLastPage(state, userLastPage) {
      state.userLastPage = userLastPage;
    },
  },
  actions: {
    toggleUserAddForm({ commit }, showForm) {
      commit("toggleUserAddForm", showForm);
    },
    addSelectedFilterUser({ commit }, { filterName, filterValue }) {
      commit("addSelectedFilterUser", { filterName, filterValue });
    },
    removeSelectedFilterUser({ commit }, filterName) {
      commit("removeSelectedFilterUser", filterName);
    },

    addSelectedFilterSortUser({ commit }, { filterName, ascending }) {
      commit("addSelectedFilterSortUser", {
        filterName,
        ascending,
      });
    },
    removeSelectedFilterSortUser({ commit }, filterName) {
      commit("removeSelectedFilterSortUser", filterName);
    },
    addUser({ commit }, user) {
      commit("addUser", user);
    },

    async getUsers({ commit, state }) {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/get-users",
          {
            params: {
              page: state.userPage,
            },
            withCredentials: true,
          }
        );

        commit("setUsers", response.data.data);
        commit("setUserTotal", response.data.count);
        commit("setUserLastPage", Math.ceil(response.data.count / 25));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    async getUsersWithFilters({ commit, state }) {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/get-users-with-filter",
          {
            filters: state.selectedFiltersUser,
            sortables: state.selectedFiltersSortUser,
            page: state.userPage,
          },
          {
            withCredentials: true,
          }
        );

        commit("setUsers", response.data.data);
        commit("setUserTotal", response.data.count);
        commit("setUserLastPage", Math.ceil(response.data.count / 25));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    setUsersToChange({ commit }, usersToChange) {
      commit("setUsersToChange", usersToChange);
    },

    async deleteUsers({ commit, state }) {
      let response;
      if (state.usersToChange.length === 1) {
        response = await axios.get("http://localhost:5000/user/delete-user", {
          params: {
            userId: state.usersToChange[0], // Replace paramName and paramValue with your query parameter name and value
          },
          withCredentials: true, // Include this if you need to send cookies or credentials
        });
      } else {
        response = await axios.post(
          "http://localhost:5000/user/delete-users",
          {
            users: state.usersToChange,
          },
          {
            withCredentials: true,
          }
        );
      }

      if (response.data.error === false) {
        const newUsers = state.users.filter((user) => {
          return !state.usersToChange.includes(user.user_id);
        });

        commit("setUsers", newUsers);
        return response;
      }

      if (response.data.error.length > 0) {
        return response;
      }

      return response;
    },

    async updateUsersState({ commit, state }) {
      let response;

      if (state.usersToChange.length === 1) {
        response = await axios.get(
          "http://localhost:5000/user/update-user-state",
          {
            params: {
              userId: state.usersToChange[0],
              userState: state.stateToChange,
            },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/user/update-users-state",
          {
            users: state.usersToChange,
            userState: state.stateToChange,
          },
          {
            withCredentials: true,
          }
        );
      }

      if (response.data.error === false) {
        const newUsers = state.users.filter((user) => {
          if (state.usersToChange.includes(user.user_id)) {
            user.state = state.stateToChange;
            return user;
          } else {
            return user;
          }
        });
        commit("setUsers", newUsers);

        return response;
      }
    },

    setStateToChange({ commit }, newState) {
      commit("setStateToChange", newState);
    },

    setUserPage({ commit }, userPage) {
      commit("setUserPage", userPage);
    },
    setUserTotal({ commit }, userTotal) {
      commit("setUserTotal", userTotal);
    },

    setUserLastPage({ commit }, userLastPage) {
      commit("setUserLastPage", userLastPage);
    },
  },

  getters: {
    showUserAddForm: (state) => state.showUserAddForm,
    selectedFiltersUser: (state) => state.selectedFiltersUser,
    selectedFiltersSortUser: (state) => state.selectedFiltersSortUser,
    users: (state) => state.users,
    usersToChange: (state) => state.usersToChange,
    stateToChange: (state) => state.stateToChange,
    userPage: (state) => state.userPage,
    userTotal: (state) => state.userTotal,
    userLastPage: (state) => state.userLastPage,
  },
};

export default usersState;
