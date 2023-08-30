<template>
  <div
    v-if="isPopUpVisible"
    :class="['popUp-content', showAnimation ? 'zoomIn' : 'zoomOut']"
  >
    <div class="error-text-container">
      <p>{{ popUpMessage }}</p>
    </div>
    <div class="icon-container">
      <button @click="unShowPopup">Close</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      isPopUpVisible: "isInfoPopupVisible",
      popUpMessage: "infoPopupMessage",
      showAnimation: "showAnimation",
    }),
  },

  methods: {
    unShowPopup() {
      this.$store.dispatch("closeInfoPopUp");
    },
  },
};
</script>

<style lang="scss" scoped>
.popUp-content {
  background-color: white;
  position: absolute;
  height: 200px;
  width: 400px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  opacity: 0;
  top: 5rem;
  animation-duration: 0.5s;
  button {
    width: 40%;
    margin-bottom: 15px;
    border: none;
    height: 30%;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    cursor: pointer;
  }
}

.zoomIn {
  animation-name: zoomIn;
  animation-fill-mode: forwards;
  animation-duration: 0.5s;
}

.zoomOut {
  animation-name: zoomOut;
  animation-fill-mode: forwards;
  animation-duration: 0.5s;
}

.icon-container {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
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
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0); // Start with 0 scale
  }
  to {
    opacity: 1;
    transform: scale(1); // End with 1 scale (normal size)
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1); // Start with 1 scale (normal size)
  }
  to {
    opacity: 0;
    transform: scale(0); // End with 0 scale
  }
}
</style>
