<template>
  <div class="tableview-bar-dashboard">
    <div
      class="tableview-bar-dashboard-main-row"
      :style="{ width: rowWidth + 'px' }"
    >
      <div v-for="(collumName, index) in rows" :key="index">
        <div v-if="index === 0">
          <input type="checkbox" @click="toggleSelectAll" :ref="'main'" />
        </div>
        <p @click="removeFilterSort(collumName.value)">
          {{ collumName.displayText }}
        </p>

        <span>
          <i
            v-if="
              filterValues?.some(
                (filter) => filter.filterName === collumName.value
              )
            "
            @click="removeFilterFunc(collumName.value)"
            class="material-icons"
          >
            filter_alt
          </i>
        </span>

        <span v-if="collumName.sortable === true">
          <i
            v-if="
              filterValuesSort?.some(
                (filter) =>
                  filter.filterName === collumName.value &&
                  filter.ascending === false
              ) ||
              !filterValuesSort?.some(
                (filter) => filter.filterName === collumName.value
              )
            "
            @click="addFilterSort(collumName.value, false)"
            class="material-icons tableViewSpanIconShow"
          >
            expand_less
          </i>

          <div
            v-if="
              filterValuesSort?.some(
                (filter) =>
                  filter.filterName === collumName.value &&
                  filter.ascending === true
              ) ||
              !filterValuesSort?.some(
                (filter) => filter.filterName === collumName.value
              )
            "
          ></div>

          <i
            v-if="
              filterValuesSort?.some(
                (filter) =>
                  filter.filterName === collumName.value &&
                  filter.ascending === true
              ) ||
              !filterValuesSort?.some(
                (filter) => filter.filterName === collumName.value
              )
            "
            @click="addFilterSort(collumName.value, true)"
            class="material-icons tableViewSpanIconShow"
          >
            expand_more
          </i>

          <div
            v-if="
              filterValuesSort?.some(
                (filter) =>
                  filter.filterName === collumName.value &&
                  filter.ascending === false
              ) ||
              !filterValuesSort?.some(
                (filter) => filter.filterName === collumName.value
              )
            "
          ></div>
        </span>
      </div>
    </div>

    <div
      class="tableview-bar-dashboard-normal-row"
      v-for="(collumValues, MainIndex) in renderValues"
      :key="MainIndex"
      @click="handleRowClick(MainIndex)"
      :style="{ width: rowWidth + 'px' }"
    >
      <div
        v-for="(collumValue, index) in Object.values(collumValues)"
        :key="index"
        :style="{ width: getLarge(index) + 'px' }"
      >
        <div v-if="index === 0">
          <input
            type="checkbox"
            @click="toggleSelect(MainIndex)"
            :ref="generateRefName(MainIndex)"
          />
        </div>
        <p>{{ formatDateString(collumValue) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkAll: false,
      valuesToChange: [],
    };
  },

  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    values: {
      type: Array,
      default: () => [],
    },
    removeFilterFunc: {
      type: Function,
      default: () => null,
    },
    filterValues: {
      type: Array,
      default: () => [],
    },
    filterValuesSort: {
      type: Array,
      default: () => [],
    },
    addFilterSort: {
      type: Function,
      default: () => null,
    },
    removeFilterSort: {
      type: Function,
      default: () => null,
    },
    setValuesToChange: {
      type: Function,
      default: () => null,
    },
    idOfValueToChangeBy: {
      type: String,
      default: "",
    },
  },
  computed: {
    renderValues() {
      const formattedValues = [];

      this.values.map((obj) => {
        const renderObjs = {};
        this.rows.map((row) => {
          if (Array.isArray(obj[row.value])) {
            if (obj[row.value][0] && typeof obj[row.value][0] === "object") {
              const displayNames = obj[row.value].map(
                (item) => item.displayName
              );

              renderObjs[row.value] = displayNames.join(", ");
            } else {
              // It's an array of non-objects, join them as before
              renderObjs[row.value] = obj[row.value].join(", ");
            }
          } else {
            renderObjs[row.value] = obj[row.value];
          }
        });

        formattedValues.push(renderObjs);
      });

      return formattedValues;
    },

    rowWidth() {
      if (this.rows.length > 7) {
        const widthToAdd = 1628 + 220 * (this.rows.length - 7);
        return widthToAdd;
      } else {
        return 1628;
      }
    },
  },

  methods: {
    toggleSelectAll() {
      this.valuesToChange = [];
      this.checkAll = !this.checkAll;

      this.values.map((value, index) => {
        const refName = this.generateRefName(index);

        this.$refs[refName][0].checked = this.checkAll;

        if (this.checkAll) {
          this.valuesToChange.push(value[this.idOfValueToChangeBy]);
        } else {
          this.valuesToChange = [];
        }
      });

      this.setValuesToChange(this.valuesToChange);
    },

    toggleSelect(index) {
      if (event.target.checked) {
        this.valuesToChange.push(this.values[index][this.idOfValueToChangeBy]);
      } else {
        this.valuesToChange.splice(
          this.values[index][this.idOfValueToChangeBy],
          1
        );
      }

      this.setValuesToChange(this.valuesToChange);
    },
    uncheckAll() {
      this.checkAll = false;
      this.valuesToChange = [];

      this.$refs["main"][0].checked = false;

      this.values.forEach((value, index) => {
        const refName = this.generateRefName(index);
        if (this.$refs[refName] && this.$refs[refName][0] != null) {
          this.$refs[refName][0].checked = false;
        }
      });

      this.setValuesToChange(this.valuesToChange);
    },

    handleRowClick(collumnIndex) {
      console.log(this.values[collumnIndex]);
    },
    generateRefName(index) {
      return `normalRowCheckBox${index}`;
    },

    formatDateString(inputString) {
      // Check if the input is a number
      if (!isNaN(inputString)) {
        // Return the number as-is
        return inputString;
      }

      const dateObject = new Date(inputString);

      if (!isNaN(dateObject.getTime())) {
        const formattedDate = `${dateObject.getFullYear()}-${String(
          dateObject.getMonth() + 1
        ).padStart(2, "0")}-${String(dateObject.getDate()).padStart(
          2,
          "0"
        )} ${String(dateObject.getHours()).padStart(2, "0")}:${String(
          dateObject.getMinutes()
        ).padStart(2, "0")}:${String(dateObject.getSeconds()).padStart(
          2,
          "0"
        )}`;

        return formattedDate;
      } else {
        // Return the original string if it's not a valid date or number
        return inputString;
      }
    },

    getLarge(index) {
      if (this.rows[index].large) {
        return 440;
      } else {
        return 220;
      }
    },
  },

  watch: {
    values() {
      this.uncheckAll();
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    font-size: 4rem;
    &::after {
      content: "";
      animation: loading 1.5s infinite;
    }
  }
}

@keyframes loading {
  0% {
    content: "";
  }
  33% {
    content: ".";
  }
  66% {
    content: "..";
  }
  100% {
    content: "...";
  }
}

.tableview-bar-dashboard {
  width: 1645px;
  height: 820px;
  border-bottom: 2px solid #2c3968;
  border-top: 2px solid #2c3968;
  overflow: auto;
}

.tableview-bar-dashboard-main-row {
  width: 100%; /* taking width larger then the parent's width */
  height: 45px;
  background-color: #2c3968;
  display: flex;
  flex: 0 0 auto;

  div {
    width: 220px;
    height: 100%;
    display: flex;
    align-items: center;
    color: whitesmoke;
    font-size: 1.25rem;

    p {
      &:hover {
        cursor: pointer;
      }
    }

    div {
      width: 30px;
      height: 100%;
      border-right: none;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
      input {
        cursor: pointer;
        width: 17.5px;
        height: 17.5px;
      }
    }

    span {
      padding-top: 2px;
      padding-bottom: 2px;
      width: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-left: 10px;
      i {
        font-size: 1.5rem;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          color: black;
        }
      }

      div {
        width: 24px;
        height: 24px;
      }
    }

    i {
      font-size: 1.5rem;
      cursor: pointer;
      transition: 0.3s;
    }
  }
}

.tableViewSpanIconShow {
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: black;
  }
}

.tableview-bar-dashboard-normal-row {
  width: 100%;
  height: 35px;
  display: flex;
  border-bottom: 1px solid #2c3968;
  div {
    height: 100%;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    line-break: anywhere;
    color: black;
    font-size: 0.8rem;
    border-right: 1px solid #2c3968;
    padding: 1px;

    div {
      width: 30px;
      height: 100%;
      border-right: none;
      display: flex;
      align-items: center;
      justify-content: center;
      input {
        cursor: pointer;
        width: 15px;
        height: 15px;
      }
    }
  }
}
</style>
