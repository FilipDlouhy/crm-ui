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
              <div @change="addOrRemoveRight">
                <input
                  type="checkbox"
                  id="addRemoveRole"
                  name="Add/Remove role"
                />
                <p>Add/Remove role</p>
              </div>

              <div @change="addOrRemoveRight">
                <input
                  type="checkbox"
                  id="createDeleteRole"
                  name="Create/Delete role"
                />
                <p>Create/Delete role</p>
              </div>

              <div @change="addOrRemoveRight">
                <input
                  type="checkbox"
                  id="changeUserState"
                  name="Change user state"
                />
                <p>Change user state</p>
              </div>

              <div @change="addOrRemoveRight">
                <input type="checkbox" id="seeUsers" name="See users" />
                <p>See users</p>
              </div>

              <div @change="addOrRemoveRight">
                <input
                  type="checkbox"
                  id="seeUserService"
                  name="See user service"
                />
                <p>See user service</p>
              </div>

              <div @change="addOrRemoveRight">
                <input type="checkbox" id="seeRoles" name="See roles" />
                <p>See roles</p>
              </div>

              <div @change="addOrRemoveRight">
                <input type="checkbox" id="updateRole" name="Update role" />
                <p>Update role</p>
              </div>

              <div @change="addOrRemoveRight">
                <input type="checkbox" id="updateUser" name="Update user" />
                <p>Update user</p>
              </div>
            </div>
          </div>
        </div>

        <div class="role-form-create-button">
          <button @click="createRole">Create role</button>
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
    };
  },

  computed: {
    ...mapGetters({
      showRoleForm: "showRoleForm",
    }),
  },

  methods: {
    unShowAddroleForm() {
      const roleFormContainer = this.$refs.roleFormContainer;

      // Remove all classes from the element
      roleFormContainer.className = "role-form-container-unshow";

      // After a delay of 1.25 seconds, toggle the Vuex state to false
      setTimeout(() => {
        this.$store.dispatch("toggleRoleForm", false);
      }, 1250);
    },

    addOrRemoveRight(event) {
      if (event.target.checked === true) {
        this.rights.push({
          displayName: event.target.name,
          name: event.target.id,
        });
      } else {
        this.rights = this.rights.filter(
          (right) => right.displayName !== event.target.name
        );
      }
    },

    async createRole() {
      if (this.rights.length === 0) {
        this.$store.commit("showModal", "Select at least one right");
        return;
      }

      if (this.roleName.length === 0) {
        this.$store.commit("showModal", "Name the role");
        return;
      }

      const roleDto = {
        rights: this.rights,
        roleName: this.roleName,
      };
      const response = await axios.post(
        "http://localhost:5000/user/role/role-create",
        roleDto,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      if (response.data.error) {
        this.$store.commit("showModal", response.data.error);
        return;
      }
      this.$store.dispatch("openInfoPopUp", "Role created");
      this.$store.dispatch("addRole", response.data);
      this.unShowAddroleForm();
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
