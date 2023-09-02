<template>
  <div class="dashboard">
    <div class="side-bar">
      <div class="side-bar-logo"><p>TechTrack</p></div>
      <users-side-menu />
    </div>

    <div v-if="activeMenu" class="main-bar">
      <div class="main-bar-top">
        <p>TechTrack/Users-Service/Users</p>
      </div>

      <users-dashboard />
    </div>
  </div>
</template>

<script>
import UsersDashboard from "../../Users-Frontend/Components/UsersDashboard.vue";
import UsersSideMenu from "../../Users-Frontend/Components/UsersSideMenu.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    UsersDashboard,
    UsersSideMenu,
  },

  computed: {
    ...mapGetters({
      activeMenu: "activeMenu",
    }),
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
  justify-content: center;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #2c3968;

  p {
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
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
