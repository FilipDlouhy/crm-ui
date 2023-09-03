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
        <select v-model="filterName">
          <option>User name</option>
          <option>User state</option>
          <option>Email</option>
          <option>Roles</option>
          <option>Telephone</option>
        </select>
        <input v-model="filterValue" type="text" />
        <button @click="addFilter">Filter</button>
      </div>

      <div class="main-bar-service-button-container">
        <button
          @click="showRemoveUserForm('Do you want to change state to pending ')"
        >
          Change to pending

          <i class="material-icons"> pending_actions </i>
        </button>

        <button
          @click="showRemoveUserForm('Do you want to change state to active ')"
        >
          Change to Active

          <i class="material-icons"> how_to_reg </i>
        </button>

        <button
          @click="showRemoveUserForm('Do you want to change state to blocked ')"
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
      :rows="['User name', 'User state', 'Email', 'Roles', 'Telephone']"
      :values="[]"
      :removeFilterFunc="removeFilter"
      :filterValues="selectedFiltersUser"
      :filterValuesDate="selectedFiltersDatesUser"
    />
    <table-view-footer />
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
      filterName: "",
      filterValue: "",
    };
  },
  components: {
    TableView,
    TableViewFooter,
    AddUserForm,
  },

  computed: {
    ...mapGetters({
      isUserLogged: "isUserLogged",
      showUserAddForm: "showUserAddForm",
      selectedFilters: "selectedFilters",
      selectedFiltersUser: "selectedFiltersUser",
      selectedFiltersDatesUser: "selectedFiltersDatesUser",
    }),
  },

  methods: {
    showAddUserForm() {
      this.$store.commit("toggleUserAddForm", true);
    },
    addFilter() {
      if (this.filterValue.length === 0 || this.filterName.length === 0) {
        return;
      }

      this.$store.commit("addSelectedFilterUser", {
        filterName: this.filterName,
        filterValue: this.filterValue,
      });
    },

    removeFilter(collumName) {
      this.$store.commit("removeSelectedFilterUser", collumName);
    },

    showRemoveUserForm(message) {
      this.$store.commit("showDoYouWantToModal", message);
    },
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
