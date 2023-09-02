const activeMenuState = {
  state: {
    activeMenu: localStorage.getItem("activeMenu") || undefined,
    activeSubMenu: undefined,
  },
  mutations: {
    setActiveMenu(state, menuName) {
      state.activeMenu = menuName;
    },
    setActiveSubMenu(state, subMenuName) {
      state.activeSubMenu = subMenuName;
    },
  },
  actions: {
    setActiveMenu({ commit }, menuName) {
      commit("setActiveMenu", menuName);
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
  },
};

export default activeMenuState;
