const contactFormState = {
  state: {
    currentContactForm: "",
    showChangeWorkerRoleForm: false,
    showChangeSeniorityForm: false,
  },
  mutations: {
    setCurrentContactForm(state, formName) {
      state.currentContactForm = "";

      state.currentContactForm = formName;
    },
    setShowChangeWorkerRoleForm(state, showChangeWorkerRoleForm) {
      state.showChangeWorkerRoleForm = showChangeWorkerRoleForm;
    },
    setShowChangeSeniorityForm(state, showChangeSeniorityForm) {
      state.showChangeSeniorityForm = showChangeSeniorityForm;
    },
  },
  actions: {
    updateCurrentContactForm({ commit }, formName) {
      commit("setCurrentContactForm", formName);
    },
  },
  getters: {
    currentContactForm(state) {
      return state.currentContactForm;
    },

    showChangeWorkerRoleForm(state) {
      return state.showChangeWorkerRoleForm;
    },
    showChangeSeniorityForm(state) {
      return state.showChangeSeniorityForm;
    },
  },
};

export default contactFormState;
