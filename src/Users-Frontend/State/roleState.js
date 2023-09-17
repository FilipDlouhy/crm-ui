import axios from "axios";

import {
  addSelectedFilterSort,
  removeSelectedFilter,
  addSelectedFilter,
} from "@/Dashboard/Components/Core/FilterHelper/FilterHelper";

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
    roleToUpdate: null,
    roleToUpdateIndex: null,
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

    addSelectedFilterRole(state, { filterName, filterValue }) {
      state.selectedFiltersRole = addSelectedFilter(state.selectedFiltersRole, {
        filterName,
        filterValue,
      });
    },

    removeSelectedFilterRole(state, filterName) {
      state.selectedFiltersRole = removeSelectedFilter(
        state.selectedFiltersRole,
        filterName
      );
    },

    addSelectedFilterSortRole(state, { filterName, ascending }) {
      state.selectedFiltersSortRole = addSelectedFilterSort(
        state.selectedFiltersSortRole,
        { filterName, ascending }
      );
    },

    removeSelectedFilterSorRole(state, filterName) {
      state.selectedFiltersSortRole = removeSelectedFilter(
        state.selectedFiltersSortRole,
        filterName
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

    setRoleToUpdate(state, roleToUpdate) {
      state.roleToUpdate = roleToUpdate;
    },

    setRoleToUpdateIndex(state, roleToUpdateIndex) {
      state.roleToUpdateIndex = roleToUpdateIndex;
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

    removeSelectedFilterRole({ commit }, filterName) {
      commit("removeSelectedFilterRole", filterName);
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

    updateOneRole({ commit, state }, { roleToUpdate, indexOfTheRole }) {
      const newRoles = state.roles;

      newRoles[indexOfTheRole].role_name = roleToUpdate.role_name;
      newRoles[indexOfTheRole].rights = roleToUpdate.rights;

      commit("setRoles", newRoles);
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
    roleToUpdate: (state) => state.roleToUpdate,
    roleToUpdateIndex: (state) => state.roleToUpdateIndex,
  },
};

export default rolesState;
