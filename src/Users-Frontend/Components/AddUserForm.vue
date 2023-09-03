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
          <div>
            <p>Password</p>
            <input v-model="password" type="password" />
          </div>
        </div>

        <div class="user-form-create-button">
          <button @click="addUser">Create User</button>
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
    };
  },

  computed: {
    ...mapGetters({
      showUserAddForm: "showUserAddForm",
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
      }, 1250);
    },

    async addUser() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const telPattern = /^\d{10}$/;

      let error = "";

      switch (true) {
        case this.firstName.length === 0:
        case this.lastName.length === 0:
        case this.email.length === 0:
        case this.telNumber.length === 0:
        case this.password.length === 0:
          error = "Please fill all fields in the form";
          break;

        case !emailPattern.test(this.email):
          error = "Please enter a valid email address";
          break;

        case !telPattern.test(this.telNumber):
          error = "Please enter a valid telephone number";
          break;

        case this.password.length < 8:
          error = "Password should be at least 8 characters long";
          break;
      }

      if (error) {
        this.$store.commit("showModal", error);
        return;
      }

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
          userDto
        );
        console.log(response);

        if (response.data.error) {
          this.$store.commit("showModal", response.data.error);
        }

        this.$store.dispatch("openInfoPopUp", "User created");
      } catch (error) {
        this.$store.commit(
          "showModal",
          "Something went wrong we are working on the repair"
        );
      }

      this.unShowAddUserForm();
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
  height: 625px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;

  div {
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
}

.user-form-create-button {
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
