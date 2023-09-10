import axios from "axios";

const rolesState = {
  state: {
    showRoleForm: false,
    roles: [],
    rolesToChange: [],
    selectedFiltersRole: [],
    selectedFiltersSortRole: [],
    rolePage: 1,
    roleLastPage: 0,
    roleTotal: 0,
  },
  mutations: {
    setShowRoleForm(state, value) {
      state.showRoleForm = value;
    },

    setRoles(state, roles) {
      state.roles = roles;
    },

    addRole(state, role) {
      if (state.roles.length > 25) {
        state.roles.pop();
        state.roles.push(role);
      } else {
        state.roles.push(role);
      }
    },

    setRolesToChange(state, rolesToChange) {
      state.rolesToChange = rolesToChange;
    },

    addSelectedFilterRole(state, filterValue) {
      state.selectedFiltersRole.pop();
      state.selectedFiltersRole.push({ filterName: "role_name", filterValue });
    },

    removeSelectedFilterRole(state) {
      state.selectedFiltersRole = [];
    },

    addSelectedFilterSortRole(state, { filterName, ascending }) {
      console.log({ filterName, ascending });
      let valueChangeObject; // Initialize a variable to hold the object to be updated
      let exists; // Initialize a variable to check if the object already exists
      // Loop through the selectedFiltersSortRole array to find the object
      for (const filter of state.selectedFiltersSortRole) {
        if (filter.filterName === filterName) {
          exists = true;
          valueChangeObject = filter;
          break;
        }
      }

      // If the object doesn't exist, add it to the selectedFiltersSortRole array
      if (!exists) {
        state.selectedFiltersSortRole.push({
          filterName,
          ascending,
        });
      }

      // If the object exists and the value needs to be changed
      if (exists && valueChangeObject.ascending !== ascending) {
        // Find the index of the object to delete based on filterName
        const indexToDelete = state.selectedFiltersSortRole.findIndex(
          (filter) => filter.filterName === filterName
        );

        // Remove the existing object from the selectedFiltersSortRole array
        state.selectedFiltersSortRole.splice(indexToDelete, 1);

        // Push a new object with the updated filterValue
        state.selectedFiltersSortRole.push({
          filterName,
          ascending,
        });
      }

      console.log(state.selectedFiltersSortRole);
    },

    removeSelectedFilterSorRole(state, filterName) {
      // Use filter method to create a new array without the filter to be removed

      state.selectedFiltersSortRole = state.selectedFiltersSortRole.filter(
        (filter) => filter.filterName !== filterName
      );
    },

    setRolePage(state, rolePage) {
      if (rolePage > state.roleLastPage || rolePage < 1) {
        return;
      }
      state.rolePage = rolePage;
    },

    setRoleTotal(state, roleTotal) {
      state.roleTotal = roleTotal;
    },
    setRoleLastPage(state, roleLastPage) {
      state.roleLastPage = roleLastPage;
    },
  },
  actions: {
    toggleRoleForm({ commit }, show) {
      commit("setShowRoleForm", show);
    },

    addRole({ commit }, role) {
      commit("addRole", role);
    },

    async getRoles({ commit, state }) {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/role/role-get",
          {
            params: {
              page: state.rolePage,
            },
            withCredentials: true,
          }
        );

        console.log(response.data);
        commit("setRoles", response.data.data);
        commit("setRoleTotal", response.data.count);
        commit("setRoleLastPage", Math.ceil(response.data.count / 25));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    setRolesToChange({ commit }, roleToChange) {
      commit("setRolesToChange", roleToChange);
    },

    async deleteRoles({ state, commit }) {
      let response;

      if (state.rolesToChange.length === 1) {
        response = await axios.get(
          "http://localhost:5000/user/role/role-delete",
          {
            params: {
              roleId: state.rolesToChange[0],
            },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/user/role/roles-delete",
          {
            roles: state.rolesToChange,
          },
          {
            withCredentials: true,
          }
        );
      }

      if (response.data.error === false) {
        const newRoles = state.roles.filter((role) => {
          return !state.rolesToChange.includes(role.role_id);
        });

        commit("setRoles", newRoles);
        return response;
      }

      if (response.data.error.length > 0) {
        return response;
      }

      return response;
    },

    addSelectedFilterRole({ commit }, filterValue) {
      commit("addSelectedFilterRole", filterValue);
    },

    removeSelectedFilterRole({ commit }) {
      commit("removeSelectedFilterRole");
    },

    async getRolesWithFilters({ commit, state }) {
      try {
        const response = await axios.post(
          "http://localhost:5000/user/role/role-get-with-filter",
          {
            filters: state.selectedFiltersRole,
            sortables: state.selectedFiltersSortRole,
            page: state.rolePage,
          },
          {
            withCredentials: true,
          }
        );

        commit("setRoles", response.data.data);
        commit("setRoleTotal", response.data.count);
        commit("setRoleLastPage", Math.ceil(response.data.count / 25));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    addSelectedFilterSortRole({ commit }, { filterName, ascending }) {
      commit("addSelectedFilterSortRole", {
        filterName,
        ascending,
      });
    },

    removeSelectedFilterSorRole({ commit }, filterName) {
      commit("removeSelectedFilterSorRole", filterName);
    },

    setRolePage({ commit }, rolePage) {
      commit("setRolePage", rolePage);
    },
    setRoleTotal({ commit }, roleTotal) {
      commit("setRoleTotal", roleTotal);
    },

    setRoleLastPage({ commit }, roleLastPage) {
      commit("setRoleLastPage", roleLastPage);
    },
  },
  getters: {
    showRoleForm: (state) => state.showRoleForm,
    roles: (state) => state.roles,
    rolesToChange: (state) => state.rolesToChange,
    selectedFiltersRole: (state) => state.selectedFiltersRole,
    selectedFiltersSortRole: (state) => state.selectedFiltersSortRole,
    rolePage: (state) => state.rolePage,
    roleLastPage: (state) => state.roleLastPage,
    roleTotal: (state) => state.roleTotal,
  },
};

export default rolesState;
