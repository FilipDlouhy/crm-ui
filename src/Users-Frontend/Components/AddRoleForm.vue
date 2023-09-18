<template>
  <div
    v-if="addRemoveRoleForm.show"
    :class="['popUp-content', addRemoveRoleFormAnimaton ? 'zoomIn' : 'zoomOut']"
  >
    <div class="heading-text-container">
      <p>Select role</p>
    </div>

    <div class="roles-container">
      <div v-for="(role, index) in roles" :key="index">
        <p>{{ role.role_name }}</p>
        <input @change="addOrRemoveRole(role)" type="checkbox" />
      </div>
    </div>

    <div class="button-container">
      <button @click="unShowForm">Close</button>
      <button @click="updateUserRoles">
        {{ addRemoveRoleForm.add ? "Add Role" : "Remove Role" }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import RoleHelper from "../RoleHelper";
export default {
  data() {
    return {
      rolesToChange: [],
    };
  },

  computed: {
    ...mapGetters({
      addRemoveRoleForm: "addRemoveRoleForm",
      addRemoveRoleFormAnimaton: "addRemoveRoleFormAnimaton",
      roles: "roles",
      usersToChange: "usersToChange",
    }),
  },

  methods: {
    // This method hides the form for adding or removing roles.
    unShowForm() {
      // Clear the 'rolesToChange' array.
      this.rolesToChange = [];

      // Commit a Vuex mutation to close the add/remove role form animation.
      this.$store.commit("closeAddRemoveRoleFormAnimaton");

      // Use a setTimeout to delay committing a Vuex mutation to toggle the form visibility.
      setTimeout(() => {
        this.$store.commit("toggleAddRemoveRoleForm", {
          showForm: false,
          addRole: false,
        });
      }, 500);
    },

    // This method adds or removes a role from 'rolesToChange' based on checkbox state.
    addOrRemoveRole(role) {
      if (event.target.checked) {
        // Add the role to 'rolesToChange'.
        this.rolesToChange.push({
          role_id: role.role_id,
          displayName: role.role_name,
        });
      } else {
        // Remove the role from 'rolesToChange' based on 'role_id'.
        this.rolesToChange = this.rolesToChange.filter(
          (filterRole) => filterRole.role_id !== role.role_id
        );
      }
    },

    // This asynchronous method updates user roles and handles server responses.
    async updateUserRoles() {
      // Send a POST request to the server to update user roles using axios.
      const response = await axios.post(
        "http://localhost:5000/user/update-roles",
        {
          users: this.usersToChange,
          add: this.addRemoveRoleForm.add,
          roles: this.rolesToChange,
        },
        {
          withCredentials: true,
        }
      );

      // Check if there is no error in the server response.
      if (response.data.error === false) {
        if (response.data.isCurentChanged) {
          const uniqueUserRighs = RoleHelper.fetchUserRights();

          // Commit a Vuex mutation to set the user rights in the store.
          this.$store.commit("setUserRights", uniqueUserRighs);
        }

        // Dispatch an action to update users' roles in the store.
        this.$store.dispatch("updateUsersRoles", response.data.updatedUsers);

        // Hide the form.
        this.unShowForm();

        // Use a setTimeout to delay displaying an informational popup.
        setTimeout(() => {
          this.$store.dispatch("openInfoPopUp", response.data.message);
        }, 500);
      }
    },
  },

  async mounted() {
    if (this.roles.length === 0) {
      this.$store.dispatch("getRoles");
    }
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
