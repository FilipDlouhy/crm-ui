<template>
  <div class="tableview-bar-dashboard">
    <div class="tableview-bar-dashboard-main-row">
      <div v-for="(collumName, index) in rows" :key="index">
        <div v-if="index === 0">
          <input type="checkbox" @click="toggleSelectAll" />
        </div>
        <p @click="removeFilterDate(collumName)">{{ collumName }}</p>

        <span>
          <i
            v-if="
              filterValues.some((filter) => filter.filterName === collumName)
            "
            @click="removeFilterFunc(collumName)"
            class="material-icons"
          >
            filter_alt
          </i>
        </span>

        <span>
          <i
            v-if="
              filterValuesDate.some(
                (filter) =>
                  filter.filterName === collumName &&
                  filter.filterValue === false
              ) ||
              !filterValuesDate.some(
                (filter) => filter.filterName === collumName
              )
            "
            @click="addFilterDate(collumName, false)"
            class="material-icons tableViewSpanIconShow"
          >
            expand_less
          </i>

          <div
            v-if="
              filterValuesDate.some(
                (filter) =>
                  filter.filterName === collumName &&
                  filter.filterValue === true
              ) ||
              !filterValuesDate.some(
                (filter) => filter.filterName === collumName
              )
            "
          ></div>

          <i
            v-if="
              filterValuesDate.some(
                (filter) =>
                  filter.filterName === collumName &&
                  filter.filterValue === true
              ) ||
              !filterValuesDate.some(
                (filter) => filter.filterName === collumName
              )
            "
            @click="addFilterDate(collumName, true)"
            class="material-icons tableViewSpanIconShow"
          >
            expand_more
          </i>

          <div
            v-if="
              filterValuesDate.some(
                (filter) =>
                  filter.filterName === collumName &&
                  filter.filterValue === false
              ) ||
              !filterValuesDate.some(
                (filter) => filter.filterName === collumName
              )
            "
          ></div>
        </span>
      </div>
    </div>

    <div
      class="tableview-bar-dashboard-nomal-row"
      v-for="(collumValues, MainIndex) in values"
      :key="MainIndex"
    >
      <div v-for="(collumValue, index) in collumValues" :key="index">
        <div v-if="index === 0">
          <input type="checkbox" :ref="generateRefName(MainIndex)" />
        </div>
        <p>{{ collumValue }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkAll: false,
    };
  },

  props: {
    rows: [],
    values: [],
    removeFilterFunc: Function,
    filterValues: [],
    filterValuesDate: [],
  },

  methods: {
    toggleSelectAll() {
      this.checkAll = !this.checkAll;
      this.values.map((value, index) => {
        const refName = this.generateRefName(index);

        this.$refs[refName][0].checked = this.checkAll;
      });
    },

    generateRefName(index) {
      return `normalRowCheckBox${index}`;
    },

    addFilterDate(collumName, filterValue) {
      this.$store.commit("addSelectedFilterDateUser", {
        filterName: collumName,
        filterValue,
      });
    },

    removeFilterDate(collumName) {
      this.$store.commit("removeSelectedFilterDateUser", collumName);
    },
  },
};
</script>

<style lang="scss" scoped>
.tableview-bar-dashboard {
  width: 1645px;
  height: 820px;
  border-bottom: 2px solid #2c3968;
  border-top: 2px solid #2c3968;
  overflow: auto;
}

.tableview-bar-dashboard-main-row {
  width: 1645px; /* taking width larger then the parent's width */
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

.tableview-bar-dashboard-nomal-row {
  width: 100%;
  height: 35px;
  display: flex;
  border-bottom: 1px solid #2c3968;
  div {
    width: 220px;
    height: 100%;
    display: flex;
    align-items: center;
    word-wrap: break-word;
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
