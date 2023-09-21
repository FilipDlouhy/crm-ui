<template>
  <div class="dashboard">
    <div class="side-bar">
      <div class="side-bar-logo">
        <span @click="logout" class="material-icons"> logout </span>
        <p>TechTrack</p>
      </div>
      <users-side-menu />
      <contacts-side-menu />
    </div>

    <div v-if="activeMenu" class="main-bar">
      <div class="main-bar-top">
        <p>TechTrack{{ activeMenuText }}</p>
      </div>

      <router-view />
    </div>
  </div>
</template>

<script>
import UsersSideMenu from "../../Users-Frontend/Components/UsersSideMenu.vue";
import { mapGetters } from "vuex";
import axios from "axios";
import ContactsSideMenu from "../../Contacts-frontend/Components/ContactsSideMenu.vue";

export default {
  components: {
    UsersSideMenu,
    ContactsSideMenu,
  },

  computed: {
    ...mapGetters({
      activeMenu: "activeMenu",
      activeMenuText: "activeMenuText",
    }),
  },

  methods: {
    async logout() {
      const response = await axios.post("http://localhost:5000/logout", null, {
        withCredentials: true,
      });
      if (response.data.logout) {
        this.$store.commit("setLoginState", false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: white;
}

.side-bar {
  width: 275px;
  border-right: 1px solid #2c3968;
  height: 100%;
}

.side-bar-logo {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding-right: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #2c3968;

  p {
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
  }
  span {
    cursor: pointer;
    transition: 0.3s;
    font-weight: 700;
    transform: rotate(-180deg);
    &:hover {
      color: #2c3968;
    }
  }
}

.main-bar {
  height: 100%;
  width: 86%;
}

.main-bar-top {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-weight: 600;
  color: rgb(109, 106, 106);
  border-bottom: 1px solid #2c3968;
}
</style>
