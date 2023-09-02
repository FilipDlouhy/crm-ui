const userServiceState = {
  state: {
    showUserAddForm: false,
  },
  mutations: {
    toggleUserAddForm(state, showForm) {
      state.showUserAddForm = showForm;
    },
  },
  actions: {
    toggleUserAddForm({ commit }, showForm) {
      commit("toggleUserAddForm", showForm);
    },
  },
  getters: {
    showUserAddForm: (state) => state.showUserAddForm,
  },
};

export default userServiceState;
