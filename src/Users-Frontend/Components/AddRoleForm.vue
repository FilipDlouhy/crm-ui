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
    unShowForm() {
      this.rolesToChange = [];
      this.$store.commit("closeAddRemoveRoleFormAnimaton");

      setTimeout(() => {
        this.$store.commit("toggleAddRemoveRoleForm", {
          showForm: false,
          addRole: false,
        });
      }, 500);
    },

    addOrRemoveRole(role) {
      if (event.target.checked) {
        this.rolesToChange.push({
          role_id: role.role_id,
          displayName: role.role_name,
        });
      } else {
        this.rolesToChange = this.rolesToChange.filter(
          (filterRole) => filterRole.role_id !== role.role_id
        );
      }
    },

    async updateUserRoles() {
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

      if (response.data.error === false) {
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

        this.$store.dispatch("updateUsersRoles", response.data.updatedUsers);

        this.unShowForm();

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
