<template>
  <div
    ref="roleFormContainer"
    :class="
      showRoleForm ? 'role-form-container-show' : 'role-form-container-unshow'
    "
  >
    <div class="role-form">
      <i @click="unShowAddroleForm" class="material-icons"> login </i>
      <div class="role-form-header">
        <h1>Create role</h1>
      </div>
      <div>
        <div class="role-form-login-data-input-container">
          <div class="role-form-text-div">
            <p>Role name</p>
            <input v-model="roleName" type="role_name" />
          </div>

          <div class="role-rights-container">
            <select>
              <option value="users">Users</option>
            </select>

            <div class="check-box-container">
              <div v-for="checkbox in userServiceRights" :key="checkbox.id">
                <input
                  type="checkbox"
                  :id="checkbox.id"
                  :name="checkbox.name"
                  v-model="checkbox.checked"
                  @change="addOrRemoveRight"
                />
                <p>{{ checkbox.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="role-form-create-button">
          <button v-if="roleToUpdate == null" @click="createRole">
            Create role
          </button>
          <button v-else @click="updateRole">Update role</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      roleName: "",
      rights: [],
      rightsToUpdate: [],

      userServiceRights: [
        {
          id: "addRemoveRole",
          name: "Add/Remove role",
          checked: false,
        },
        {
          id: "createDeleteRole",
          name: "Create/Delete role",
          checked: false,
        },
        {
          id: "changeUserState",
          name: "Change user state",
          checked: false,
        },
        {
          id: "seeUsers",
          name: "See users",
          checked: false,
        },
        {
          id: "seeUserService",
          name: "See user service",
          checked: false,
        },
        {
          id: "seeRoles",
          name: "See roles",
          checked: false,
        },
        {
          id: "updateRole",
          name: "Update role",
          checked: false,
        },
        {
          id: "updateUser",
          name: "Update user",
          checked: false,
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      showRoleForm: "showRoleForm",
      roleToUpdate: "roleToUpdate",
      roleToUpdateIndex: "roleToUpdateIndex",
    }),
  },

  methods: {
    unShowAddroleForm() {
      const roleFormContainer = this.$refs.roleFormContainer;
      this.$store.commit("setRoleToUpdate", null);

      // Remove all classes from the element
      roleFormContainer.className = "role-form-container-unshow";

      // After a delay of 1.25 seconds, toggle the Vuex state to false
      setTimeout(() => {
        this.$store.dispatch("toggleRoleForm", false);
      }, 1250);
    },

    // This function is used to add or remove rights to/from an array based on a checkbox event.
    addOrRemoveRight(event) {
      // Determine the rights array to modify based on whether 'roleToUpdate' is null.
      let rightsArray =
        this.roleToUpdate == null ? this.rights : this.rightsToUpdate;

      // If the checkbox is checked (event.target.checked === true), add a new right object to the array.
      if (event.target.checked === true) {
        rightsArray.push({
          displayName: event.target.name,
          name: event.target.id,
        });
      } else {
        // If the checkbox is unchecked, filter out the right with the matching 'id' from the array.
        rightsArray = rightsArray.filter(
          (right) => right.name !== event.target.id
        );
      }

      // Update the original rights array or rightsToUpdate array based on 'roleToUpdate' value.
      if (this.roleToUpdate == null) {
        this.rights = rightsArray; // Update the 'rights' array if 'roleToUpdate' is null.
      } else {
        this.rightsToUpdate = rightsArray; // Update the 'rightsToUpdate' array if 'roleToUpdate' is not null.
      }
    },

    // This asynchronous function is responsible for creating a role and sending a POST request to the server.
    async createRole() {
      // Check if there are no selected rights and show a modal message if none are selected.
      if (this.rights.length === 0) {
        this.$store.commit("showModal", "Select at least one right");
        return;
      }

      // Check if the role name is empty and show a modal message if it is.
      if (this.roleName.length === 0) {
        this.$store.commit("showModal", "Name the role");
        return;
      }

      // Prepare a data object ('roleDto') containing selected rights and the role name.
      const roleDto = {
        rights: this.rights,
        roleName: this.roleName,
      };

      // Send a POST request to the server to create the role using axios.
      const response = await axios.post(
        "http://localhost:5000/user/role/role-create",
        roleDto,
        {
          withCredentials: true,
        }
      );

      // Check if the server response contains an error message and show it in a modal if present.
      if (response.data.error) {
        this.$store.commit("showModal", response.data.error);
        return;
      }

      // Show an informational popup indicating the successful creation of the role.
      this.$store.dispatch("openInfoPopUp", "Role created");

      // Dispatch an action to add the created role to the store's data.
      this.$store.dispatch("addRole", response.data);

      // Call a method ('unShowAddroleForm') to hide the role creation form.
      this.unShowAddroleForm();
    },

    // This asynchronous function is responsible for updating a role and sending a POST request to the server for the update.
    async updateRole() {
      // Send a POST request to the server to update the role using axios.
      const response = await axios.post(
        "http://localhost:5000/user/role/update-role",
        {
          role_name: this.roleName,
          rights: this.rightsToUpdate,
          role_id: this.roleToUpdate.role_id,
        },
        {
          withCredentials: true,
        }
      );

      // Check if the server response contains an error message and show it in a modal if present.
      if (response.data.error) {
        this.$store.commit("showModal", response.data.error);
        return;
      }

      // Show an informational popup indicating the successful update of the role.
      this.$store.dispatch("openInfoPopUp", "Role updated");

      // Dispatch an action to update the role data in the store.
      this.$store.dispatch("updateOneRole", {
        roleToUpdate: { role_name: this.roleName, rights: this.rightsToUpdate },
        indexOfTheRole: this.roleToUpdateIndex,
      });

      // Dispatch an action to update user rights (assuming this is necessary for your application).
      this.$store.dispatch("updateUserRights");

      // Call a method ('unShowAddroleForm') to hide the role update form.
      this.unShowAddroleForm();
    },

    // This method updates the role data and rights based on the 'roleToUpdate' property.
    // The 'watch' parameter is used to control whether to update 'right.checked' when it's false.
    updateRoleData(watch) {
      // Check if 'roleToUpdate' is not null.
      if (this.roleToUpdate != null) {
        // Update the 'roleName' with the name from 'roleToUpdate'.
        this.roleName = this.roleToUpdate.role_name;

        // Extract the names of rights associated with 'roleToUpdate'.
        const roleRights = this.roleToUpdate.rights.map((right) => right.name);

        // Iterate through 'userServiceRights'.
        this.userServiceRights.forEach((right) => {
          // Check if 'roleRights' includes the 'id' of the current 'right'.
          if (roleRights.includes(right.id)) {
            // If included, set 'right.checked' to true and add it to 'rightsToUpdate'.
            right.checked = true;
            this.rightsToUpdate.push({
              displayName: right.name,
              name: right.id,
            });
          } else {
            // If not included and 'watch' is true, set 'right.checked' to false.
            if (watch) {
              right.checked = false;
            }
          }
        });
      }
    },
  },

  mounted() {
    this.updateRoleData(false);
  },

  watch: {
    roleToUpdate() {
      this.updateRoleData(true);
    },
  },
};
</script>

<style lang="scss">
.role-form-container-show {
  padding-top: 30px;
  width: 400px;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #2c3968;
  i {
    position: absolute;
    color: whitesmoke;
    top: 10px;
    left: 10px;
    font-size: 2rem;
    transition: 0.2s;
    cursor: pointer;
  }

  animation: slideIn 1s ease-out forwards;
}

.role-form-container-unshow {
  padding-top: 30px;
  width: 400px;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #2c3968;
  i {
    position: absolute;
    color: whitesmoke;
    top: 10px;
    left: 10px;
    font-size: 2rem;
    transition: 0.2s;
    cursor: pointer;
  }

  animation: slideOut 1s ease-out forwards;
}

.role-form-header {
  height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: whitesmoke;
  letter-spacing: 2px;
}

.role-form-login-data-input-container {
  width: 100%;
  height: 625px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
}

.role-form-text-div {
  height: 125px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;

  input {
    height: 30px;
    width: 250px;
    padding: 5px;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    transition: box-shadow 0.2s;
  }

  input:focus {
    box-shadow: 0 0 5px 3px rgba(50, 50, 93, 0.5),
      0 0 8px 5px rgba(0, 0, 0, 0.3);
  }

  p {
    font-size: 1.25rem;
    color: whitesmoke;
    letter-spacing: 4px;
  }
}

.role-form-create-button {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;

  button {
    width: 200px;
    height: 40px;
    background-color: whitesmoke;
    border: none;
    border-radius: 4px;
    font-size: 1.25rem;
    cursor: pointer;
    transition: 0.2s;
  }

  button:hover {
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
      rgba(0, 0, 0, 0.22) 0px 15px 12px;
  }
}

.role-rights-container {
  width: 100%;
  height: 600px;

  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;

  select {
    height: 30px;
    width: 250px;
    padding: 5px;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    transition: box-shadow 0.2s;
  }
}
.check-box-container {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;

  div {
    height: 30px;
    width: 250px;
    display: flex;
    align-items: center;

    input {
      width: 17.5px;
      height: 17.5px;
      margin-right: 10px;
    }

    p {
      font-size: 1.25rem;
      color: whitesmoke;
      padding-bottom: 5px;
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}
</style>
