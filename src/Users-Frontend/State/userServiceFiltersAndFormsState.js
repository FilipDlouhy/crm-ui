const userServiceState = {
  state: {
    showUserAddForm: false,
    selectedFiltersUser: [],
    selectedFiltersDatesUser: [],
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

    addSelectedFilterDateUser(state, { filterName, filterValue }) {
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
        state.selectedFiltersDatesUser.push({ filterName, filterValue });
      }

      // If the object exists and the value needs to be changed
      if (exists && valueChangeObject.filterValue !== filterValue) {
        // Find the index of the object to delete based on filterName
        const indexToDelete = state.selectedFiltersDatesUser.findIndex(
          (filter) => filter.filterName === filterName
        );

        // Remove the existing object from the selectedFiltersDatesUser array
        state.selectedFiltersDatesUser.splice(indexToDelete, 1);

        // Push a new object with the updated filterValue
        state.selectedFiltersDatesUser.push({ filterName, filterValue });
      }
    },
    removeSelectedFilterDateUser(state, filterName) {
      // Use filter method to create a new array without the filter to be removed
      state.selectedFiltersDatesUser = state.selectedFiltersDatesUser.filter(
        (filter) => filter.filterName !== filterName
      );
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

    addSelectedFilterDateUser({ commit }, { filterName, filterValue }) {
      commit("addSelectedFilterDateUser", { filterName, filterValue });
    },
    removeSelectedFilterDateUser({ commit }, filterName) {
      commit("removeSelectedFilterDateUser", filterName);
    },
  },
  getters: {
    showUserAddForm: (state) => state.showUserAddForm,
    selectedFiltersUser: (state) => state.selectedFiltersUser,
    selectedFiltersDatesUser: (state) => state.selectedFiltersDatesUser,
  },
};

export default userServiceState;
