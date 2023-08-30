<template>
  <div class="dashboard-container">
    <error-popup-modal />
    <login-form v-if="isUserLogged" />
    <user-info-po-up />
    <main-dashboard v-if="!isUserLogged" />
  </div>
</template>

<script>
import ErrorPopupModal from "./PopUpsAndModals/ErrorPopupModal.vue";
import LoginForm from "./LoginForm/LoginForm.vue";
import UserInfoPoUp from "./PopUpsAndModals/InfoPopup.vue";
import { mapGetters } from "vuex";
import MainDashboard from "./MainDashboard.vue";
export default {
  components: {
    ErrorPopupModal,
    LoginForm,
    UserInfoPoUp,
    MainDashboard,
  },

  beforeCreate() {
    this.$store.dispatch("checkUserLogin");
  },

  computed: {
    ...mapGetters({
      isUserLogged: "isUserLogged",
    }),
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at 10% 20%,
    #1e3b5a 0%,
    // Deep blue
    #0e1e2e 100.2% // Darker deep blue
  );
}
</style>
