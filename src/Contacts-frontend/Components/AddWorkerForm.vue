<template>
  <div ref="contactFormContainer" :class="'contact-form-container-show'">
    <div class="contact-form">
      <i @click="unShowContactForm" class="material-icons"> login </i>
      <div class="contact-form-header">
        <h1>Create Worker</h1>
      </div>
      <div>
        <div class="contact-form-login-data-input-container">
          <div>
            <p>First Name</p>
            <input v-model="firstName" type="text" />
          </div>
          <div>
            <p>Last Name</p>
            <input v-model="lastName" type="text" />
          </div>
          <div>
            <p>Seniority</p>
            <select>
              <option>Junior</option>
              <option>Medior</option>
              <option>Senior</option>
            </select>
          </div>
          <div>
            <p>Worker role</p>
            <select>
              <option>Los muertes</option>
              <option>Pracant</option>
            </select>
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
            <p>Adress</p>
            <input v-model="telNumber" type="tel" />
          </div>
        </div>

        <div class="contact-form-create-button">
          <button>Create Worker</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      telNumber: "",
      adress: "",
      workerRole: "",
      seniority: "",
    };
  },

  computed: {
    ...mapGetters({ currentContactForm: "currentContactForm" }),
  },

  methods: {
    unShowContactForm() {
      const contactFormContainer = this.$refs.contactFormContainer;

      // Remove all classes from the element
      contactFormContainer.className = "role-form-container-unshow";

      // After a delay of 1.25 seconds, toggle the Vuex state to false
      setTimeout(() => {
        this.$store.dispatch("toggleRoleForm", false);
      }, 1250);
    },
  },
};
</script>

<style lang="scss">
.contact-form-container-show {
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

.contact-form-container-unshow {
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

.contact-form-header {
  height: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: whitesmoke;
  letter-spacing: 2px;
}

.contact-form-login-data-input-container {
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

.contact-form-create-button {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  button {
    width: 170px;
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
