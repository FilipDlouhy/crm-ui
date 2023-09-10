<template>
  <div>
    <div class="main-bar-buttons">
      <div class="main-bar-add-button-container">
        <button @click="showAddUserForm">
          User Add

          <i class="material-icons"> person_add </i>
        </button>

        <button @click="showRemoveUserForm('Do you want to delete user')">
          User Remove

          <i class="material-icons"> person_remove </i>
        </button>
      </div>

      <div class="main-bar-filter-container">
        <select
          @change="setIndexOfFilter($event.target.selectedIndex)"
          v-model="filterName"
        >
          <option v-for="(row, index) in filterableUserTableRows" :key="index">
            {{ row.displayText }}
          </option>
        </select>
        <input v-model="filterValue" type="text" />
        <button @click="addFilter">Filter</button>
      </div>

      <div class="main-bar-service-button-container">
        <button
          @click="
            showUserChangeStateForm(
              'Do you want to change state to pending ',
              1
            )
          "
        >
          Change to pending

          <i class="material-icons"> pending_actions </i>
        </button>

        <button
          @click="
            showUserChangeStateForm(
              'Do you want to change state to pending ',
              2
            )
          "
        >
          Change to Active

          <i class="material-icons"> how_to_reg </i>
        </button>

        <button
          @click="
            showUserChangeStateForm(
              'Do you want to change state to pending ',
              0
            )
          "
        >
          Change to Block

          <i class="material-icons"> block </i>
        </button>

        <button>
          Add Role
          <i class="material-icons"> add_circle </i>
        </button>

        <button>
          Remove Role
          <i class="material-icons"> remove </i>
        </button>
      </div>
    </div>
    <table-view
      :rows="userTableRows"
      :values="users"
      :removeFilterFunc="removeFilter"
      :filterValues="selectedFiltersUser"
      :filterValuesSort="selectedFiltersSortUser"
      :addFilterSort="addFilteSort"
      :removeFilterSort="removeFilterSort"
      :idOfValueToChangeBy="'user_id'"
      :setValuesToChange="setValuesToChange"
    />
    <table-view-footer
      :lastPage="userLastPage"
      :page="userPage"
      :total="userTotal"
      :totalMessage="'Total number of users'"
      :decrementPage="removePage"
      :incrementPage="addPage"
    />
    <add-user-form v-if="showUserAddForm" />
  </div>
</template>
<script>
import TableView from "../../Dashboard/Components/Core/TableView.vue";
import TableViewFooter from "../../Dashboard/Components/Core/TableViewFooter.vue";
import AddUserForm from "./AddUserForm.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      filterName: "First name",
      filterValue: "",
      userTableRows: [
        {
          displayText: "First name",
          value: "first_name",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Last name",
          value: "last_name",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "User state",
          value: "state",
          sortable: true,
        },
        {
          displayText: "Email",
          value: "email",
          sortable: true,

          filterable: true,
        },
        { displayText: "Roles", value: "role_ids", filterable: true },
        {
          displayText: "Telephone",
          value: "tel_number",
          filterable: true,

          sortable: true,
        },
        {
          displayText: "Created",
          value: "created_at",
          filterable: false,
          sortable: true,
        },
      ],

      selectedIndex: 0,
    };
  },
  components: {
    TableView,
    TableViewFooter,
    AddUserForm,
  },

  computed: {
    ...mapGetters({
      showUserAddForm: "showUserAddForm",
      selectedFiltersUser: "selectedFiltersUser",
      selectedFiltersSortUser: "selectedFiltersSortUser",
      users: "users",
      usersToChange: "usersToChange",
      userPage: "userPage",
      userTotal: "userTotal",
      userLastPage: "userLastPage",
    }),

    filterableUserTableRows() {
      return this.userTableRows.filter((row) => row.filterable);
    },
  },

  methods: {
    showAddUserForm() {
      this.$store.commit("toggleUserAddForm", true);
    },
    async addFilter() {
      if (this.filterValue.length === 0) {
        return;
      }

      const selectedRow = this.filterableUserTableRows[this.selectedIndex];
      if (!selectedRow) {
        return;
      }

      await this.$store.commit("addSelectedFilterUser", {
        filterName: selectedRow.value,
        filterValue: this.filterValue,
      });

      this.filterValue = "";

      await this.$store.dispatch("getUsersWithFilters");
    },

    async removeFilter(collumName) {
      await this.$store.commit("removeSelectedFilterUser", collumName);

      await this.$store.dispatch("getUsersWithFilters");
    },

    showRemoveUserForm(message) {
      if (this.usersToChange.length === 0) {
        return;
      }
      this.$store.commit("showDoYouWantToModal", message);
      this.$store.dispatch("setDoYouWantToModalFunction", "deleteUsers");
    },

    showUserChangeStateForm(message, stateToChange) {
      if (this.usersToChange.length === 0) {
        return;
      }
      this.$store.dispatch("setStateToChange", stateToChange);

      this.$store.commit("showDoYouWantToModal", message);
      this.$store.dispatch("setDoYouWantToModalFunction", "updateUsersState");
    },

    async addFilteSort(collumName, ascending) {
      await this.$store.commit("addSelectedFilterSortUser", {
        filterName: collumName,
        ascending,
      });

      await this.$store.dispatch("getUsersWithFilters");
    },

    async removeFilterSort(collumName) {
      await this.$store.commit("removeSelectedFilterSortUser", collumName);

      await this.$store.dispatch("getUsersWithFilters");
    },

    setIndexOfFilter(rowIndex) {
      this.selectedIndex = rowIndex;
    },

    setValuesToChange(valuesToChange) {
      this.$store.dispatch("setUsersToChange", valuesToChange);
    },

    addPage() {
      this.$store.dispatch("setUserPage", this.userPage + 1);
      if (
        this.selectedFiltersUser.length > 0 ||
        this.selectedFiltersSortUser.length > 0
      ) {
        this.$store.dispatch("getUsersWithFilters");
      } else {
        this.$store.dispatch("getUsers");
      }
    },

    removePage() {
      this.$store.dispatch("setUserPage", this.userPage - 1);
      if (
        this.selectedFiltersUser.length > 0 ||
        this.selectedFiltersSortUser.length > 0
      ) {
        this.$store.dispatch("getUsersWithFilters");
      } else {
        this.$store.dispatch("getUsers");
      }
    },
  },

  async mounted() {
    this.$store.dispatch("getUsers");
  },
};
</script>

<style lang="scss" scoped>
.main-bar-buttons {
  width: 100%;
  height: 60px;
  padding-left: 30px;
  display: flex;
  justify-content: space-between;
}

.main-bar-add-button-container {
  width: 350px;
  display: flex;
  align-items: center;
  height: 100%;

  button {
    display: flex;
    width: 150px;
    height: 30px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 10px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }
}

.main-bar-filter-container {
  width: 500px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;

  button {
    display: flex;
    width: 120px;
    height: 25px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 10px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    border-radius: 2px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }

  select {
    width: 130px;
    height: 25px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    outline: none;
    border-radius: 2px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }

  input {
    width: 150px;
    height: 25px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    outline: none;
    border-radius: 2px;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;

    &:focus {
      background-color: #435b93;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.7); /* Add box shadow on focus */
    }
  }
}

.main-bar-service-button-container {
  width: 600px;
  display: flex;
  align-items: center;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  button {
    display: flex;
    width: 180px;
    flex: 0 0 auto;
    height: 30px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 10px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    border-radius: 2px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }
}
</style>
