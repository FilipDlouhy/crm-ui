<template>
  <div
    ref="userFormContainer"
    :class="
      showUserAddForm
        ? 'user-form-container-show'
        : 'user-form-container-unshow'
    "
  >
    <div class="user-form">
      <i @click="unShowAddUserForm" class="material-icons"> login </i>
      <div class="user-form-header">
        <h1>Create User</h1>
      </div>
      <div>
        <div class="user-form-login-data-input-container">
          <div>
            <p>First Name</p>
            <input v-model="firstName" type="text" />
          </div>
          <div>
            <p>Last Name</p>
            <input v-model="lastName" type="text" />
          </div>
          <div>
            <p>Email</p>
            <input v-model="email" type="text" />
          </div>
          <div>
            <p>Telephone</p>
            <input v-model="telNumber" type="tel" />
          </div>
          <div v-if="updatedUser == null">
            <p>Password</p>
            <input v-model="password" type="password" />
          </div>

          <div v-if="updatedUser != null">
            <p>Roles: {{ rolesText }}</p>
          </div>

          <div v-if="updatedUser != null">
            <select @change="setRoleToAddOrRemoveId($event.target.value)">
              <option></option>

              <option
                v-for="role in roles"
                :key="role.role_id"
                :value="role.role_id"
              >
                {{ role.role_name }}
              </option>
            </select>

            <div>
              <button @click="addOrRemoveRole(true)">Add</button>
              <button @click="addOrRemoveRole(false)">Remove</button>
            </div>
          </div>
        </div>

        <div class="user-form-create-button">
          <button @click="addOrUpdateUser">
            {{ updatedUser != null ? "Update user" : "Create role" }}
          </button>
        </div>
      </div>
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
      firstName: "",
      lastName: "",
      email: "",
      telNumber: "",
      password: "",
      rolesText: "",
      rolesToAddOrRemove: [],
      roleToRemoveOrAddId: undefined,
    };
  },

  computed: {
    ...mapGetters({
      showUserAddForm: "showUserAddForm",
      updatedUser: "updatedUser",
      updatedUserIndex: "updatedUserIndex",
      roles: "roles",
    }),
  },

  methods: {
    unShowAddUserForm() {
      const userFormContainer = this.$refs.userFormContainer;

      // Remove all classes from the element
      userFormContainer.className = "user-form-container-unshow";

      // After a delay of 1.25 seconds, toggle the Vuex state to false
      setTimeout(() => {
        this.$store.commit("toggleUserAddForm", false);
        this.$store.commit("setUpdatedUser", null);
        this.$store.commit("setUpdatedUserIndex", null);
      }, 1250);
    },

    // This asynchronous method is responsible for adding or updating a user's information.
    async addOrUpdateUser() {
      // Check for form validation errors by calling 'checkFormValues'.
      const error = this.checkFormValues();

      // If there are validation errors, return early without proceeding further.
      if (error) {
        return;
      }

      // If 'updatedUser' is not null, update an existing user.
      if (this.updatedUser != null) {
        // Prepare user data to send for updating an existing user.
        const userDto = {
          email: this.email,
          roles: this.rolesToAddOrRemove,
          last_name: this.lastName,
          first_name: this.firstName,
          tel_number: this.telNumber,
          user_id: this.updatedUser.user_id,
        };

        // Send a POST request to the server to update the user's information using axios.
        const response = await axios.post(
          "http://localhost:5000/user/update-user",
          userDto,
          {
            withCredentials: true,
          }
        );

        // Check if there is an error in the server response.
        if (response.data.error) {
          // Show a modal with the error message.
          this.$store.commit("showModal", response.data.error);
          return;
        }

        // Show an informational popup indicating the user was updated.
        this.$store.dispatch("openInfoPopUp", "User update");

        // If the user's roles have changed, fetch and update their rights.
        if (response.data.isCurentChanged) {
          const uniqueUserRighs = RoleHelper.fetchUserRights();

          // Commit a Vuex mutation to set the user rights in the store.
          this.$store.commit("setUserRights", uniqueUserRighs);
        }

        // Dispatch an action to update the user in the store.
        this.$store.dispatch("updateUser", userDto);

        // Call a method to hide the user creation/update form.
        this.unShowAddUserForm();
      } else {
        // If 'updatedUser' is null, create a new user.

        // Prepare user data to send for creating a new user.
        const userDto = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          telNumber: this.telNumber,
          password: this.password,
        };

        try {
          // Send a POST request to the server to create a new user using axios.
          const response = await axios.post(
            "http://localhost:5000/user/user-create",
            userDto,
            {
              withCredentials: true,
            }
          );

          // Check if there is an error in the server response.
          if (response.data.error) {
            // Show a modal with the error message.
            this.$store.commit("showModal", response.data.error);
            return;
          }

          // Hide the user creation form.
          this.unShowAddUserForm();

          // Show an informational popup indicating the user was created.
          this.$store.dispatch("openInfoPopUp", "User created");

          // Commit a Vuex mutation to add the new user to the store.
          this.$store.commit("addUser", response.data);
        } catch (error) {
          // Handle errors that occur during the user creation process.
          console.log(error);

          // Show a modal with a generic error message.
          this.$store.commit(
            "showModal",
            "Something went wrong we are working on the repair"
          );
        }
      }
    },

    // This function validates form values and shows an error modal if validation fails.
    checkFormValues() {
      // Regular expressions for email and telephone number validation.
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const telPattern = /^\d{10}$/;

      let error = "";

      // Check various conditions for form validation.
      switch (true) {
        case this.firstName.length === 0:
        case this.lastName.length === 0:
        case this.email.length === 0:
        case this.telNumber.length === 0:
        case this.password.length === 0 && this.updatedUser == null:
          error = "Please fill all fields in the form";
          break;

        case !emailPattern.test(this.email):
          error = "Please enter a valid email address";
          break;

        case !telPattern.test(this.telNumber):
          error = "Please enter a valid telephone number";
          break;

        case this.password.length < 8 && this.updatedUser == null:
          error = "Password should be at least 8 characters long";
          break;
      }

      // If there's an error, show it in a modal and return true to indicate validation failure.
      if (error) {
        this.$store.commit("showModal", error);
        return true;
      }
    },

    // This function sets the form fields with values from the 'updatedUser' object.
    setUpdateUser() {
      if (this.updatedUser != null) {
        this.firstName = this.updatedUser.first_name;
        this.lastName = this.updatedUser.last_name;
        this.email = this.updatedUser.email;
        this.telNumber = this.updatedUser.tel_number;
        this.rolesToAddOrRemove = this.updatedUser.roles.map((role) => {
          return role;
        });

        // If 'roles' is empty, fetch the roles using 'getRoles' action.
        if (this.roles.length === 0) {
          this.$store.dispatch("getRoles");
        }
        // Set the text for selected roles.
        this.setRoleText();
      }
    },

    // This function sets the 'roleToRemoveOrAddId' variable for adding or removing roles.
    setRoleToAddOrRemoveId(role) {
      this.roleToRemoveOrAddId = role;
    },

    // This function adds or removes a role based on the 'add' parameter.
    addOrRemoveRole(add) {
      if (add) {
        // Find the role to add based on 'roleToRemoveOrAddId'.
        const roleToAdd = this.roles.filter((role) => {
          return role.role_id === this.roleToRemoveOrAddId;
        });

        // Extract role IDs from 'rolesToAddOrRemove'.
        const roleIds = this.rolesToAddOrRemove.map((role) => {
          return role.role_id;
        });

        // Add the role if it's not already in 'rolesToAddOrRemove'.
        if (!roleIds.includes(roleToAdd[0].role_id)) {
          this.rolesToAddOrRemove.push({
            displayName: roleToAdd[0].role_name,
            role_id: roleToAdd[0].role_id,
          });
        }
      } else {
        // Remove the role from 'rolesToAddOrRemove' based on 'roleToRemoveOrAddId'.
        this.rolesToAddOrRemove = this.rolesToAddOrRemove.filter((role) => {
          return role.role_id !== this.roleToRemoveOrAddId;
        });
      }

      // Update the text for selected roles.
      this.setRoleText();
    },

    // This function sets the text representation of selected roles in 'rolesText'.
    setRoleText() {
      this.rolesText = "";

      // Map selected roles to their display names and join them into a comma-separated string.
      this.rolesText = this.rolesToAddOrRemove.map((role) => {
        return role.displayName;
      });

      this.rolesText = this.rolesText.join(", ");
    },
  },

  mounted() {
    this.setUpdateUser();
  },

  watch: {
    updatedUser() {
      this.setUpdateUser();
    },
  },
};
</script>

<style lang="scss">
.user-form-container-show {
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

.user-form-container-unshow {
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

.user-form-header {
  height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: whitesmoke;
  letter-spacing: 2px;
}

.user-form-login-data-input-container {
  width: 100%;
  height: 800px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;

  div {
    height: 170px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;

    div {
      display: flex;
      flex-direction: row;
      width: 80%;
      height: 50px;

      button {
        width: 120px;
        height: 25px;
        background-color: whitesmoke;
        border: none;
        border-radius: 4px;
        margin: 0 10px;
        font-size: 1rem;
        cursor: pointer;
        transition: 0.2s;
      }
    }

    input {
      height: 30px;
      width: 250px;
      padding: 5px;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
      transition: box-shadow 0.2s;
    }

    select {
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
      text-align: center;
      color: whitesmoke;
      letter-spacing: 4px;
    }
  }
}

.user-form-create-button {
  width: 100%;
  height: 70px;
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
