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

    async addOrUpdateUser() {
      const error = this.checkFormValues();
      if (error) {
        return;
      }

      if (this.updatedUser != null) {
        const userDto = {
          email: this.email,
          roles: this.rolesToAddOrRemove,
          last_name: this.lastName,
          first_name: this.firstName,
          tel_number: this.telNumber,
          user_id: this.updatedUser.user_id,
        };

        const response = await axios.post(
          "http://localhost:5000/user/update-user",
          userDto,
          {
            withCredentials: true,
          }
        );

        if (response.data.error) {
          this.$store.commit("showModal", response.data.error);
          return;
        }
        this.$store.dispatch("openInfoPopUp", "User update");
        if (response.data.isCurentChanged) {
          const rights = await axios.get(
            "http://localhost:5000/get-user-rights",
            {
              withCredentials: true,
            }
          );
          if (rights.data.error) {
            this.$store.commit("showModal", rights.data.error);
            return;
          }

          const userRights = rights.data.rights.map((roleRight) => {
            return roleRight.rights.map((right) => {
              return right.name;
            });
          });

          // Flatten the array and remove duplicates using a Set
          const uniqueUserRighs = [...new Set(userRights.flat())];
          this.$store.commit("setUserRights", uniqueUserRighs);
        }
        this.$store.dispatch("updateUser", userDto);
        this.unShowAddUserForm();
      } else {
        const userDto = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          telNumber: this.telNumber,
          password: this.password,
        };

        try {
          const response = await axios.post(
            "http://localhost:5000/user/user-create",
            userDto,
            {
              withCredentials: true,
            }
          );

          if (response.data.error) {
            this.$store.commit("showModal", response.data.error);
            return;
          }
          this.unShowAddUserForm();
          this.$store.dispatch("openInfoPopUp", "User created");
          this.$store.commit("addUser", response.data);
        } catch (error) {
          console.log(error);

          this.$store.commit(
            "showModal",
            "Something went wrong we are working on the repair"
          );
        }
      }
    },

    checkFormValues() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const telPattern = /^\d{10}$/;

      let error = "";

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

      if (error) {
        this.$store.commit("showModal", error);
        return true;
      }
    },

    setUpdateUser() {
      if (this.updatedUser != null) {
        this.firstName = this.updatedUser.first_name;
        this.lastName = this.updatedUser.last_name;
        this.email = this.updatedUser.email;
        this.telNumber = this.updatedUser.tel_number;
        this.rolesToAddOrRemove = this.updatedUser.roles.map((role) => {
          return role;
        });

        if (this.roles.length === 0) {
          this.$store.dispatch("getRoles");
        }
        this.setRoleText();
      }
    },

    setRoleToAddOrRemoveId(role) {
      this.roleToRemoveOrAddId = role;
    },

    addOrRemoveRole(add) {
      if (add) {
        const roleToAdd = this.roles.filter((role) => {
          return role.role_id === this.roleToRemoveOrAddId;
        });

        const roleIds = this.rolesToAddOrRemove.map((role) => {
          return role.role_id;
        });

        if (!roleIds.includes(roleToAdd[0].role_id)) {
          this.rolesToAddOrRemove.push({
            displayName: roleToAdd[0].role_name,
            role_id: roleToAdd[0].role_id,
          });
        }
      } else {
        this.rolesToAddOrRemove = this.rolesToAddOrRemove.filter((role) => {
          return role.role_id !== this.roleToRemoveOrAddId;
        });
      }

      this.setRoleText();
    },

    setRoleText() {
      this.rolesText = "";

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
