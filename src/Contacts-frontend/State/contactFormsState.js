const contactFormState = {
  state: {
    currentContactForm: "",
  },
  mutations: {
    setCurrentContactForm(state, formName) {
      state.currentContactForm = formName;
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
  },
};

export default contactFormState;
