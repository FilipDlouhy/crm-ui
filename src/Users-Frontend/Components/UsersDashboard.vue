<template>
  <div>
    <div class="main-bar-add-buttons">
      <div class="main-bar-add-button-container">
        <button @click="showAddUserForm">
          User Add

          <i class="material-icons"> person_add </i>
        </button>

        <button>
          User Remove

          <i class="material-icons"> person_remove </i>
        </button>
      </div>

      <div class="main-bar-service-button-container">
        <button>
          Change to pending

          <i class="material-icons"> pending_actions </i>
        </button>

        <button>
          Change to Active

          <i class="material-icons"> how_to_reg </i>
        </button>

        <button>
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
    <table-view />
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
  components: {
    TableView,
    TableViewFooter,
    AddUserForm,
  },

  computed: {
    ...mapGetters({
      isUserLogged: "isUserLogged",
      showUserAddForm: "showUserAddForm",
    }),
  },

  methods: {
    showAddUserForm() {
      this.$store.commit("toggleUserAddForm", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.main-bar-add-buttons {
  width: 100%;
  height: 60px;
  padding-left: 50px;
  display: flex;
  justify-content: space-between;
}

.main-bar-add-button-container {
  width: 400px;
  display: flex;
  align-items: center;
  height: 100%;

  button {
    display: flex;
    width: 180px;
    height: 30px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 30px;
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
