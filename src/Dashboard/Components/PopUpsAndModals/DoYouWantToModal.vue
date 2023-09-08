<template>
  <div v-show="showDoYouWantToModal" @click="unShowPopup" class="modal">
    <div class="modal-content">
      <div class="error-text-container">
        <p>{{ doYouWantToModalMessage }}</p>
      </div>
      <div class="icon-container">
        <button @click="doActionPopup">Yes</button>
        <button @click="unShowPopup">No</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      showDoYouWantToModal: "showDoYouWantToModal",
      doYouWantToModalMessage: "doYouWantToModalMessage",
      doYouWantToModalFunction: "doYouWantToModalFunction",
    }),
  },

  methods: {
    async doActionPopup() {
      this.$store.commit("hideDoYouWantToModal");
      const response = await this.$store.dispatch(
        this.doYouWantToModalFunction
      );

      if (response.data.error === false) {
        this.$store.dispatch("openInfoPopUp", response.data.message);
        return;
      }

      if (response.data.error.length > 0) {
        this.$store.commit("showModal", response.data.error);
        return;
      }
    },

    unShowPopup() {
      this.$store.commit("hideDoYouWantToModal");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
  background-color: rgba(0, 0, 0, 0.199);
}

.modal-content {
  background: radial-gradient(
    circle at 10% 20%,
    rgb(10, 174, 227) 0%,
    rgb(124, 182, 255) 100.2%
  );
  background-color: white;
  height: 250px;
  width: 500px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;
}

.icon-container {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  button {
    width: 200px;
    margin-bottom: 15px;
    border: none;
    height: 30%;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    cursor: pointer;
  }
}
.error-text-container {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    text-align: center;
    font-weight: 600;
    letter-spacing: 1px;
    color: white;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
