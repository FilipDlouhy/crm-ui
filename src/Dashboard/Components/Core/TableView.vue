<template>
  <div class="tableview-bar-dashboard">
    <div
      class="tableview-bar-dashboard-main-row"
      :style="{ width: rowWidth + 'px' }"
    >
      <div
        v-for="(collumName, index) in rows"
        :style="{ width: getLarge(index) + 'px' }"
        :key="index"
      >
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
      :class="{
        'tableview-bar-dashboard-normal-row-clickable': clickable,
        'tableview-bar-dashboard-normal-row': !clickable,
      }"
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
        <p v-if="Object.keys(collumValues)[index] !== 'organization_or_person'">
          {{ formatRowValue(collumValue, collumValues, index) }}
        </p>

        <i v-else class="material-icons" :style="{ margin: '0 auto' }">{{
          getIcon(collumValue)
        }}</i>
      </div>
    </div>
  </div>
</template>

<script>
import ContactHelper from "../../../Contacts-frontend/ContactHelper";

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
    clickable: {
      type: Boolean,
      default: false,
    },
    updateFunc: {
      type: Function,
      default: () => null,
    },
  },
  computed: {
    // This function is responsible for rendering values in a specific format.
    renderValues() {
      // Create an empty array to store the formatted values.
      const formattedValues = [];

      // Iterate through each object in the 'values' array.
      this.values.map((obj) => {
        // Create an empty object to store the rendered values for the current object.
        const renderObjs = {};

        // Iterate through each 'row' specified in the 'rows' array.
        this.rows.map((row) => {
          // Check if the value associated with 'row.value' in the current object is an array.
          if (Array.isArray(obj[row.value])) {
            // Check if the array elements are objects.
            if (obj[row.value][0] && typeof obj[row.value][0] === "object") {
              // If they are objects, extract the 'displayName' property from each object
              // and join them into a comma-separated string.
              const displayNames = obj[row.value].map(
                (item) => item.displayName
              );
              renderObjs[row.value] = displayNames.join(", ");
            } else {
              // If they are not objects, join the array elements into a comma-separated string.
              renderObjs[row.value] = obj[row.value]
                .map((word) =>
                  word && typeof word === "string"
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
                )
                .join(", ");
            }
          } else {
            // If the value is not an array, simply assign it to the 'renderObjs' object.
            renderObjs[row.value] = obj[row.value];
          }
        });

        // Push the 'renderObjs' object into the 'formattedValues' array.
        formattedValues.push(renderObjs);
      });

      // Return the array of formatted values.
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
    formatRowValue(columnValue, columnValues, index) {
      // Check if the value is a valid date
      const isDate = !isNaN(Date.parse(columnValue));

      if (isDate) {
        // If it's a valid date, you can format it or perform any other actions
        const formattedDate = this.formatDateString(columnValue);
        return formattedDate;
      } else if (Object.keys(columnValues)[index] === "contact_type") {
        return ContactHelper.getContactNameText(columnValue);
      } else if (typeof columnValue === "boolean") {
        // If it's a boolean, return "Yes" for true and "No" for false
        return columnValue ? "Yes" : "No";
      } else {
        // Return the original value for other data types
        return columnValue;
      }
    },

    getIcon(icon) {
      return ContactHelper.getContactIcon(icon);
    },

    // This method toggles the selection of all values in a list.
    toggleSelectAll() {
      // Clear the 'valuesToChange' array.
      this.valuesToChange = [];

      // Toggle the 'checkAll' flag to its opposite value.
      this.checkAll = !this.checkAll;

      // Iterate through each value and update its checkbox state based on 'checkAll'.
      this.values.map((value, index) => {
        // Generate a reference name for the value's checkbox element.
        const refName = this.generateRefName(index);

        // Set the checkbox state to 'checkAll'.
        this.$refs[refName][0].checked = this.checkAll;

        // If 'checkAll' is true, add the value to 'valuesToChange'.
        if (this.checkAll) {
          this.valuesToChange.push(value[this.idOfValueToChangeBy]);
        } else {
          // If 'checkAll' is false, clear 'valuesToChange'.
          this.valuesToChange = [];
        }
      });

      // Call a method to set the updated 'valuesToChange'.
      this.setValuesToChange(this.valuesToChange);
    },

    // This method toggles the selection of a single value based on its checkbox state.
    toggleSelect(index) {
      // Check if the checkbox is checked.
      if (event.target.checked) {
        // If checked, add the corresponding value to 'valuesToChange'.
        this.valuesToChange.push(this.values[index][this.idOfValueToChangeBy]);
      } else {
        // If unchecked, remove the corresponding value from 'valuesToChange'.
        this.valuesToChange.splice(
          this.values[index][this.idOfValueToChangeBy],
          1
        );
      }

      // Call a method to set the updated 'valuesToChange'.
      this.setValuesToChange(this.valuesToChange);
    },

    // This method unchecks all checkboxes and clears the 'valuesToChange' array.
    uncheckAll() {
      // Set the 'checkAll' flag to false.
      this.checkAll = false;

      // Clear the 'valuesToChange' array.
      this.valuesToChange = [];

      // Uncheck the main checkbox.
      this.$refs["main"][0].checked = false;

      // Iterate through each value and uncheck its checkbox.
      this.values.forEach((value, index) => {
        const refName = this.generateRefName(index);
        if (this.$refs[refName] && this.$refs[refName][0] != null) {
          this.$refs[refName][0].checked = false;
        }
      });

      // Call a method to set the updated 'valuesToChange'.
      this.setValuesToChange(this.valuesToChange);
    },

    handleRowClick(collumnIndex) {
      if (!this.clickable) {
        return;
      }

      this.updateFunc(this.values[collumnIndex], collumnIndex);
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
      } else if (this.rows[index].bigger) {
        return 280;
      } else {
        return 220;
      }
    },
  },

  watch: {
    values() {
      if (this.valuesToChange.length === 0) {
        return;
      }
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

.tableview-bar-dashboard-normal-row-clickable {
  width: 100%;
  height: 35px;
  display: flex;
  border-bottom: 1px solid #2c3968;
  cursor: pointer;
  transition: 0.3s;
  div {
    height: 100%;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    line-break: anywhere;
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

  &:hover {
    background-color: #1941d1;
    color: whitesmoke;
  }
}
</style>
