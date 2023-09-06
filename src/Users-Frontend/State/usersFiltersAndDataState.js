import axios from "axios";

const userServiceState = {
  state: {
    showUserAddForm: false,
    selectedFiltersUser: [],
    selectedFiltersDatesUser: [],
    users: [],
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
      if (state.user.length > 40) {
        state.user.pop();
        state.users.push(user);
      } else {
        state.users.push(user);
      }
    },

    setUsers(state, users) {
      state.users = users;
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

    async getUsers({ commit }) {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/get-users",
          {
            withCredentials: true,
          }
        );

        commit("setUsers", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    async getUsersWithFilters({ commit, state }) {
      console.log(state);
      try {
        const response = await axios.post(
          "http://localhost:5000/user/get-users-with-filter",
          {
            filters: state.selectedFiltersUser,
            sortables: state.selectedFiltersDatesUser,
          },
          {
            withCredentials: true,
          }
        );

        commit("setUsers", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
  },

  getters: {
    showUserAddForm: (state) => state.showUserAddForm,
    selectedFiltersUser: (state) => state.selectedFiltersUser,
    selectedFiltersDatesUser: (state) => state.selectedFiltersDatesUser,
    users: (state) => state.users,
  },
};

export default userServiceState;
