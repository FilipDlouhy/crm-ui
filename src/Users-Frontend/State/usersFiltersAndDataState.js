import axios from "axios";

const userServiceState = {
  state: {
    showUserAddForm: false,
    selectedFiltersUser: [],
    selectedFiltersDatesUser: [],
    users: [],
    usersToChange: [],
    stateToChange: null,
    page: 1,
    lastPage: 0,
    total: 0,
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

    addSelectedFilterDateUser(state, { filterName, ascending }) {
      console.log({ filterName, ascending });
      let valueChangeObject; // Initialize a variable to hold the object to be updated
      let exists; // Initialize a variable to check if the object already exists
      // Loop through the selectedFiltersDatesUser array to find the object
      for (const filter of state.selectedFiltersDatesUser) {
        if (filter.filterName === filterName) {
          exists = true;
          valueChangeObject = filter;
          break;
        }
      }

      // If the object doesn't exist, add it to the selectedFiltersDatesUser array
      if (!exists) {
        state.selectedFiltersDatesUser.push({
          filterName,
          ascending,
        });
      }

      // If the object exists and the value needs to be changed
      if (exists && valueChangeObject.ascending !== ascending) {
        // Find the index of the object to delete based on filterName
        const indexToDelete = state.selectedFiltersDatesUser.findIndex(
          (filter) => filter.filterName === filterName
        );

        // Remove the existing object from the selectedFiltersDatesUser array
        state.selectedFiltersDatesUser.splice(indexToDelete, 1);

        // Push a new object with the updated filterValue
        state.selectedFiltersDatesUser.push({
          filterName,
          ascending,
        });
      }
    },
    removeSelectedFilterDateUser(state, filterName) {
      // Use filter method to create a new array without the filter to be removed

      state.selectedFiltersDatesUser = state.selectedFiltersDatesUser.filter(
        (filter) => filter.filterName !== filterName
      );
    },
    addUser(state, user) {
      if (state.users.length > 25) {
        state.user.pop();
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

    setPage(state, page) {
      if (page > state.lastPage || page < 1) {
        return;
      }
      state.page = page;
    },
    setTotal(state, total) {
      state.total = total;
    },
    setLastPage(state, lastPage) {
      state.lastPage = lastPage;
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

    addSelectedFilterDateUser({ commit }, { filterName, ascending }) {
      commit("addSelectedFilterDateUser", {
        filterName,
        ascending,
      });
    },
    removeSelectedFilterDateUser({ commit }, filterName) {
      commit("removeSelectedFilterDateUser", filterName);
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
              page: state.page,
            },
            withCredentials: true,
          }
        );

        commit("setUsers", response.data.data);
        commit("setTotal", response.data.count);
        commit("setLastPage", Math.ceil(response.data.count / 25));
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
            sortables: state.selectedFiltersDatesUser,
            page: state.page,
          },
          {
            withCredentials: true,
          }
        );

        commit("setUsers", response.data.data);
        commit("setTotal", response.data.count);
        commit("setLastPage", Math.ceil(response.data.count / 25));
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

    setPage({ commit }, page) {
      commit("setPage", page);
    },
    setTotal({ commit }, total) {
      commit("setTotal", total);
    },

    setLastPage({ commit }, lastPage) {
      commit("setLastPage", lastPage);
    },
  },

  getters: {
    showUserAddForm: (state) => state.showUserAddForm,
    selectedFiltersUser: (state) => state.selectedFiltersUser,
    selectedFiltersDatesUser: (state) => state.selectedFiltersDatesUser,
    users: (state) => state.users,
    usersToChange: (state) => state.usersToChange,
    stateToChange: (state) => state.stateToChange,
    page: (state) => state.page,
    total: (state) => state.total,
    lastPage: (state) => state.lastPage,
  },
};

export default userServiceState;
