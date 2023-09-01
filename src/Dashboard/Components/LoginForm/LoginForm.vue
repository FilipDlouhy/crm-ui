<template>
  <div class="dashboard-form">
    <div class="dashboard-form-header">
      <h1>Sing up into TechTrack CRM</h1>
      <h2 @click="setIsloggingIn">Or are you already registered</h2>
    </div>
    <div class="dashboard-form-login-data">
      <div class="dashboard-form-login-data-input-container">
        <input
          v-if="!isLoggingIn"
          v-model="firstName"
          type="text"
          placeholder="First name"
        />
        <input
          v-if="!isLoggingIn"
          v-model="lastName"
          type="text"
          placeholder="Last name"
        />
        <input v-model="email" type="text" placeholder="Email" />
        <input
          v-if="!isLoggingIn"
          v-model="telNumber"
          type="tel"
          placeholder="Telephone"
        />
        <input v-model="password" type="password" placeholder="Password" />
      </div>

      <div>
        <button v-if="!isLoggingIn" @click="registerUser">Sign up</button>
        <button v-else @click="loginUser">Login</button>
        <button>Try as a guest</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      telNumber: "",
      password: "",
      isLoggingIn: false,
    };
  },

  methods: {
    async registerUser() {
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
          "http://localhost:5000/create-user-from-login",
          userDto,
          {
            withCredentials: true, // Send cookies
          }
        );

        if (response.data.error) {
          this.$store.commit("showModal", response.data.error);
        }

        this.$store.dispatch("openInfoPopUp", "User created");

        this.setIsloggingIn();
      } catch (error) {
        this.$store.commit(
          "showModal",
          "Something went wrong we are working on the repair"
        );
      }
    },

    async loginUser() {
      try {
        const userDto = {
          email: this.email,
          password: this.password,
          decode: true,
        };

        if (this.email.length === 0 || this.password.length === 0) {
          this.$store.commit("showModal", "Please fill all fields in the form");
          return;
        }
        const response = await axios.post(
          "http://localhost:5000/login-from-login",
          userDto,
          {
            withCredentials: true,
          }
        );

        if (response.data.error) {
          this.$store.commit("showModal", response.data.error);
        }

        this.$store.dispatch("setIsUserLogged", true);
      } catch (error) {
        this.$store.commit(
          "showModal",
          "Something Went wrong we are working on the repair"
        );
      }
    },

    setIsloggingIn() {
      this.isLoggingIn = !this.isLoggingIn;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-form {
  width: 40%;
  height: 70%;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 5px;
}

.dashboard-form-header {
  width: 100%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  color: radial-gradient(
    circle at 10% 20%,
    #1e3b5a 0%,
    // Deep blue
    #0e1e2e 100.2% // Darker deep blue
  );

  h2 {
    font-size: 1.2rem;
    color: rgba(128, 128, 128, 0.61);
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      color: rgb(1, 45, 58);
    }
  }
}

.dashboard-form-login-data {
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  button {
    width: 250px;
    height: 40px;
    background-color: #2fd37e;
    outline: none;
    border: none;
    color: white;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: 1px;
    margin: 0 10px;
    cursor: pointer;
  }
}
.dashboard-form-login-data-input-container {
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  input {
    width: 300px;
    height: 30px;
    text-align: center;
    border-right: none;
    border-left: none;
    border-top: none;
    border-bottom-color: rgb(199, 199, 199);
  }
  input:focus {
    border-right: none;
    border-left: none;
    border-top: none;
    outline: none;
    border-bottom-color: rgb(10, 176, 227);
  }
  input:focus::placeholder {
    transform: translateY(-120%); /* Move the placeholder text up */
    color: rgb(10, 176, 227); /* Change placeholder color when focused */
  }
}
</style>
