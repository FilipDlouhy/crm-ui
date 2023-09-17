<template>
  <div>
    <div class="main-bar-buttons">
      <div class="main-bar-add-button-container">
        <button
          v-if="userRights.includes('createDeleteRole')"
          @click="toggleRoleForm"
        >
          Create Role

          <i class="material-icons"> supervised_user_circle </i>
        </button>

        <button
          v-if="userRights.includes('createDeleteRole')"
          @click="showRemoveRoleForm('Do you want to delete roles')"
        >
          Delete Role

          <i class="material-icons">do_not_disturb_on </i>
        </button>
      </div>

      <div class="main-bar-filter-container">
        <input v-model="filterValue" type="text" />
        <button @click="addFilter">Filter</button>
      </div>

      <div class="main-bar-service-button-container"></div>
    </div>
    <table-view
      :clickable="userRights.includes('updateRole')"
      :rows="roleTableRows"
      :values="roles"
      :idOfValueToChangeBy="'role_id'"
      :setValuesToChange="setValuesToChange"
      :filterValues="selectedFiltersRole"
      :removeFilterFunc="removeFilter"
      :filterValuesSort="selectedFiltersSortRole"
      :addFilterSort="addFilterSort"
      :removeFilterSort="removeFilterSort"
      :updateFunc="updateRole"
    />
    <table-view-footer
      :decrementPage="removePage"
      :incrementPage="addPage"
      :lastPage="roleLastPage"
      :page="rolePage"
      :total="roleTotal"
      :totalMessage="'Number of roles is'"
    />

    <add-or-update-role-form-vue v-if="showRoleForm === true" />
  </div>
</template>
<script>
import AddOrUpdateRoleFormVue from "./AddOrUpdateRoleForm.vue";
import TableView from "../../Dashboard/Components/Core/TableView.vue";
import TableViewFooter from "../../Dashboard/Components/Core/TableViewFooter.vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      filterName: "First name",
      filterValue: "",
      roleTableRows: [
        {
          displayText: "Role name",
          value: "role_name",
          sortable: true,
          filterable: true,
        },

        {
          displayText: "Created",
          value: "created_at",
          sortable: true,
        },
      ],

      selectedIndex: 0,
    };
  },
  components: {
    AddOrUpdateRoleFormVue,
    TableView,
    TableViewFooter,
  },

  computed: {
    ...mapGetters({
      showRoleForm: "showRoleForm",
      roles: "roles",
      rolesToChange: "rolesToChange",
      selectedFiltersRole: "selectedFiltersRole",
      selectedFiltersSortRole: "selectedFiltersSortRole",
      rolePage: "rolePage",
      roleLastPage: "roleLastPage",
      roleTotal: "roleTotal",
      isUserLogged: "isUserLogged",
      userRights: "userRights",
    }),

    filterableUserTableRows() {
      return this.userTableRows.filter((row) => row.filterable);
    },
  },

  methods: {
    toggleRoleForm() {
      this.$store.dispatch("toggleRoleForm", true);
    },
    async addFilter() {
      if (this.filterValue.length === 0) {
        return;
      }

      this.$store.dispatch("addSelectedFilterRole", {
        filterName: "role_name",
        filterValue: this.filterValue,
      });
      this.$store.dispatch("getRolesWithFilters");
    },

    async removeFilter() {
      this.filterValue = "";

      this.$store.dispatch("removeSelectedFilterRole", "role_name");
      await this.$store.dispatch("getRolesWithFilters");
    },

    showRemoveRoleForm(message) {
      if (this.rolesToChange.length === 0) {
        return;
      }
      this.$store.commit("showDoYouWantToModal", message);
      this.$store.dispatch("setDoYouWantToModalFunction", "deleteRoles");
    },

    async addFilterSort(collumName, ascending) {
      this.$store.dispatch("addSelectedFilterSortRole", {
        filterName: collumName,
        ascending,
      });

      this.$store.dispatch("getRolesWithFilters");
    },

    async removeFilterSort(collumName) {
      await this.$store.commit("removeSelectedFilterSorRole", collumName);

      await this.$store.dispatch("getRolesWithFilters");
    },

    setIndexOfFilter(rowIndex) {
      this.selectedIndex = rowIndex;
    },

    setValuesToChange(valuesToChange) {
      this.$store.dispatch("setRolesToChange", valuesToChange);
    },

    addPage() {
      this.$store.dispatch("setRolePage", this.rolePage + 1);
      if (
        this.selectedFiltersRole.length > 0 ||
        this.selectedFiltersSortRole.length > 0
      ) {
        this.$store.dispatch("getRolesWithFilters");
      } else {
        this.$store.dispatch("getRoles");
      }
    },

    removePage() {
      this.$store.dispatch("setRolePage", this.rolePage - 1);
      if (
        this.selectedFiltersRole.length > 0 ||
        this.selectedFiltersSortRole.length > 0
      ) {
        this.$store.dispatch("getRolesWithFilters");
      } else {
        this.$store.dispatch("getRoles");
      }
    },

    updateRole(role, index) {
      this.$store.dispatch("toggleRoleForm", true);
      this.$store.commit("setRoleToUpdate", role);
      this.$store.commit("setRoleToUpdateIndex", index);
    },
  },

  async mounted() {
    if (this.roles.length === 0 && this.isUserLogged) {
      this.$store.dispatch("getRoles");
    }
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

<table-view
  :rows="roleTableRows"
  :values="[
    {
      role_name: 'Admin',
      created_at: '2023-09-09T10:00:00Z',
    },
    {
      role_name: 'Manager',
      created_at: '2023-09-08T14:30:00Z',
    },
    {
      role_name: 'Sales Representative',
      created_at: '2023-09-07T16:45:00Z',
    },
    {
      role_name: 'Customer Support Agent',
      created_at: '2023-09-06T11:15:00Z',
    },
  ]"
/>
