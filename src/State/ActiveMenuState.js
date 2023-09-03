const activeMenuState = {
  state: {
    activeMenu: localStorage.getItem("activeMenu") || undefined,
    activeMenuText: localStorage.getItem("activeMenuText") || undefined,
    activeSubMenu: localStorage.getItem("activeSubMenu") || undefined,
  },
  mutations: {
    setActiveMenu(state, menuName) {
      state.activeMenu = menuName;
    },
    setActiveMenuText(state, menuName) {
      state.activeMenuText = menuName;
    },
    setActiveSubMenu(state, subMenuName) {
      state.activeSubMenu = subMenuName;
    },
  },
  actions: {
    setActiveMenu({ commit }, menuName) {
      commit("setActiveMenu", menuName);
    },

    setActiveMenuText({ commit }, menuName) {
      commit("setActiveMenuText", menuName);
    },

    setActiveSubMenu({ commit }, subMenuName) {
      commit("setActiveSubMenu", subMenuName);
    },
  },
  getters: {
    activeMenu: (state) => {
      return state.activeMenu;
    },
    activeSubMenu: (state) => {
      return state.activeSubMenu;
    },

    activeMenuText: (state) => {
      return state.activeMenuText;
    },
  },
};

export default activeMenuState;
