const modalState = {
  state: {
    isModalVisible: false,
    modalMessage: "",
    isInfoPopupVisible: false,
    infoPopupMessage: "",
    showAnimation: false,
    showDoYouWantToModal: false,
    doYouWantToModalMessage: "",
    doYouWantToModalFunction: "",
  },
  mutations: {
    showModal(state, message) {
      state.isModalVisible = true;
      state.modalMessage = message;
    },
    hideModal(state) {
      state.isModalVisible = false;
      state.modalMessage = "";
    },
    showInfoPopUp(state, message) {
      state.isInfoPopupVisible = true;
      state.showAnimation = true;
      state.infoPopupMessage = message;
    },
    hideInfoPopUp(state) {
      state.isInfoPopupVisible = false;
      state.showAnimation = false;
      state.infoPopupMessage = "";
    },
    closePopupAnimation(state) {
      state.showAnimation = false;
    },

    showDoYouWantToModal(state, message) {
      state.showDoYouWantToModal = true;
      state.doYouWantToModalMessage = message;
    },

    hideDoYouWantToModal(state) {
      state.showDoYouWantToModal = false;
      state.doYouWantToModalMessage = "";
    },
    setDoYouWantToModalFunction(state, func) {
      state.doYouWantToModalFunction = func;
    },
  },
  actions: {
    openModal({ commit }, message) {
      commit("showModal", message);
    },
    closeModal({ commit }) {
      commit("hideModal");
    },
    openInfoPopUp({ commit }, message) {
      commit("showInfoPopUp", message);

      setTimeout(() => {
        commit("closePopupAnimation", message);
      }, 3000);

      setTimeout(() => {
        commit("hideInfoPopUp");
      }, 4000);
    },
    closeInfoPopUp({ commit }) {
      commit("hideInfoPopUp");
    },

    openDoYouWantToModal({ commit }, message) {
      commit("showDoYouWantToModal", message);
    },
    hideDoYouWantToModal({ commit }) {
      commit("hideDoYouWantToModal");
    },

    setDoYouWantToModalFunction({ commit }, func) {
      commit("setDoYouWantToModalFunction", func);
    },
  },
  getters: {
    isModalVisible: (state) => state.isModalVisible,
    modalMessage: (state) => state.modalMessage,
    isInfoPopupVisible: (state) => state.isInfoPopupVisible,
    infoPopupMessage: (state) => state.infoPopupMessage,
    showAnimation: (state) => state.showAnimation,
    doYouWantToModalMessage: (state) => state.doYouWantToModalMessage,
    showDoYouWantToModal: (state) => state.showDoYouWantToModal,
    doYouWantToModalFunction: (state) => state.doYouWantToModalFunction,
  },
};
export default modalState;
