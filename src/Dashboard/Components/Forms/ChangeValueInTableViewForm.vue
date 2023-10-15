<template>
  <div :class="['popUp-content', showFormAnimation ? 'zoomIn' : 'zoomOut']">
    <div class="heading-text-container">
      <p>{{ formTitle }}</p>
    </div>

    <div class="roles-container">
      <div v-for="(value, index) in values" :key="index">
        <p>{{ value[valueToDisplay] }}</p>
        <input
          @change="addOrRemoveValue(value, index)"
          type="checkbox"
          :ref="index"
        />
      </div>
    </div>

    <div class="button-container">
      <button @click="unShowForm">Close</button>
      <button @click="updateFunc">{{ updateButtonText }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    updateFunc: {
      type: Function,
      default: () => null,
    },
    values: {
      type: Array,
    },
    valueToDisplay: {
      type: String,
      default: "",
    },
    valueToFilterInnerArray: {
      type: String,
      default: "",
    },
    updateButtonText: {
      type: String,
      default: "",
    },
    formTitle: {
      type: String,
      default: "",
    },
    onlyOne: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showFormAnimation: false,
      valuesTochange: [],
    };
  },

  methods: {
    unShowForm() {
      this.showFormAnimation = false;
      this.$emit("unshowTableViewForm", false);
    },
    addOrRemoveValue(value, index) {
      const isChecked = this.$refs[index][0].checked;

      if (this.onlyOne) {
        Object.values(this.$refs).map((input) => {
          input[0].checked = false;
        });
        this.$refs[index][0].checked = isChecked;
        this.valuesTochange = isChecked ? [value] : [];
      } else {
        if (isChecked) {
          this.valuesTochange.push(value);
        } else {
          const newValuesToChange = this.valuesTochange.filter(
            (valueToFilter) => {
              if (
                value[this.valueToFilterInnerArray] !==
                value[this.valueToFilterInnerArray]
              ) {
                return valueToFilter;
              }
            }
          );
          this.valuesTochange = newValuesToChange;
        }
      }

      this.$emit("valuesChanged", this.valuesTochange);
    },

    handleUnshowFromParrent() {
      this.unShowForm();
    },
  },
  async mounted() {
    this.showFormAnimation = true;
    this.$parent.$on("unshowFormFromParent", this.handleUnshowFromParrent);
  },
};
</script>

<style lang="scss" scoped>
.popUp-content {
  background-color: white;
  position: absolute;
  left: 38%;
  height: 400px;
  width: 500px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
  opacity: 0;
  top: 10rem;
  animation-duration: 0.5s;
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

.heading-text-container {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    text-align: center;
    font-weight: 600;
    letter-spacing: 1px;
  }
}

.roles-container {
  width: 100%;
  height: 300px;
  overflow-y: auto;

  div {
    width: 300px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    margin: 20px auto;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

    p {
      font-weight: 100;
      letter-spacing: 1px;
    }

    input[type="checkbox"] {
      height: 18px;
      width: 18px;
      cursor: pointer;
      &:checked {
        background-color: #008000; /* Green color as an example */
      }
    }
  }
}

.button-container {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    width: 40%;
    margin-bottom: 15px;
    border: none;
    height: 30px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    cursor: pointer;
    margin: 0 10px;
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
