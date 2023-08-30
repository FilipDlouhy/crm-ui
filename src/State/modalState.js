const modalState = {
  state: {
    isModalVisible: false,
    modalMessage: "",
    isInfoPopupVisible: false,
    infoPopupMessage: "",
    showAnimation: false,
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
  },
  getters: {
    isModalVisible: (state) => state.isModalVisible,
    modalMessage: (state) => state.modalMessage,
    isInfoPopupVisible: (state) => state.isInfoPopupVisible,
    infoPopupMessage: (state) => state.infoPopupMessage,
    showAnimation: (state) => state.showAnimation,
  },
};
export default modalState;
