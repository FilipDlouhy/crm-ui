import axios from "axios";
import {
  addSelectedFilterSort,
  removeSelectedFilter,
  addSelectedFilter,
} from "@/Dashboard/Components/Core/FilterHelper/FilterHelper";

const usersState = {
  state: {
    showUserAddForm: false,
    addRemoveRoleForm: { show: false, add: false },
    addRemoveRoleFormAnimaton: true,
    selectedFiltersUser: [],
    selectedFiltersSortUser: [],
    users: [],
    usersToChange: [],
    stateToChange: null,
    userPage: 1,
    userLastPage: 0,
    userTotal: 0,
    updatedUser: null,
    updatedUserIndex: 0,
  },
  mutations: {
    closeAddRemoveRoleFormAnimaton(state) {
      state.addRemoveRoleFormAnimaton = false;
    },
    toggleUserAddForm(state, showForm) {
      state.showUserAddForm = showForm;
    },

    toggleAddRemoveRoleForm(state, { showForm, addRole }) {
      state.addRemoveRoleForm = { show: showForm, add: addRole };

      state.addRemoveRoleFormAnimaton = showForm;
    },

    addSelectedFilterUser(state, { filterName, filterValue }) {
      state.selectedFiltersUser = addSelectedFilter(state.selectedFiltersUser, {
        filterName,
        filterValue,
      });
    },
    removeSelectedFilterUser(state, filterName) {
      // Use filter method to create a new array without the filter to be removed
      state.selectedFiltersUser = removeSelectedFilter(
        state.selectedFiltersUser,
        filterName
      );
    },

    addSelectedFilterSortUser(state, { filterName, ascending }) {
      state.selectedFiltersSortUser = addSelectedFilterSort(
        state.selectedFiltersSortUser,
        { filterName, ascending }
      );
    },
    removeSelectedFilterSortUser(state, filterName) {
      state.selectedFiltersSortUser = removeSelectedFilter(
        state.selectedFiltersSortUser,
        filterName
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

    setUpdatedUser(state, updatedUser) {
      state.updatedUser = updatedUser;
    },

    setUpdatedUserIndex(state, updatedUserIndex) {
      state.updatedUserIndex = updatedUserIndex;
    },
  },
  actions: {
    toggleUserAddForm({ commit }, showForm) {
      commit("toggleUserAddForm", showForm);
    },

    toggleAddRemoveRoleForm({ commit }, { showForm, addRole }) {
      commit("toggleAddRemoveRoleForm", { showForm, addRole });
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

    async updateUsersRoles({ commit, state }, updatedUserRoles) {
      const userIdsToUpdate = updatedUserRoles.map((user) => {
        return user.user_id;
      });

      const newUsers = state.users.map((user) => {
        if (userIdsToUpdate.includes(user.user_id)) {
          const index = userIdsToUpdate.findIndex((id) => id === user.user_id);

          user.roles = updatedUserRoles[index].roles;
          return user;
        } else {
          return user;
        }
      });
      commit("setUsers", newUsers);
    },

    updateUser({ commit, state }, userDto) {
      const userToUpdate = state.users[state.updatedUserIndex];
      userToUpdate.first_name = userDto.first_name;
      userToUpdate.last_name = userDto.last_name;
      userToUpdate.roles = userDto.roles;
      userToUpdate.email = userDto.email;
      userToUpdate.tel_number = userDto.tel_number;

      const newUsersArray = state.users;

      newUsersArray.slice(state.updatedUserIndex, 1);
      newUsersArray.push(userToUpdate);
      commit("setUsers", newUsersArray);
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
    addRemoveRoleForm: (state) => state.addRemoveRoleForm,
    addRemoveRoleFormAnimaton: (state) => state.addRemoveRoleFormAnimaton,
    updatedUser: (state) => state.updatedUser,
    updatedUserIndex: (state) => state.updatedUserIndex,
  },
};

export default usersState;
