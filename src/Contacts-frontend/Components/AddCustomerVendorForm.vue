<template>
  <div ref="contactFormContainer" :class="'contact-form-container-show'">
    <div class="contact-form">
      <i @click="unShowContactForm" class="material-icons"> login </i>
      <div class="contact-form-header">
        <h1>Create customer</h1>
      </div>
      <div>
        <div
          v-if="personOrOrganization === 'person'"
          class="contact-form-login-data-input-container"
        >
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
            <p>Adress</p>
            <input v-model="adress" type="tel" />
          </div>
        </div>

        <div
          v-if="personOrOrganization === 'organization'"
          class="contact-form-login-data-input-container"
        >
          <div>
            <p>Organization Name</p>
            <input v-model="organizationName" type="text" />
          </div>

          <div>
            <p>Contact Email</p>
            <input v-model="contactEmail" type="text" />
          </div>
          <div>
            <p>Telephone</p>
            <input v-model="telNumber" type="tel" />
          </div>

          <div>
            <p>Adress</p>
            <input v-model="adress" type="tel" />
          </div>
        </div>

        <div class="contact-form-create-button">
          <button @click="createContact">
            Create
            {{ personOrOrganization === "person" ? "person" : "organization" }}
          </button>
          <button @click="setPersonOrOrganization">
            {{ personOrOrganization === "person" ? "Person" : "Organization" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import contactHelper from "../ContactHelper";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      organizationName: "",
      email: "",
      contactEmail: "",
      telNumber: "",
      adress: "",
      personOrOrganization: "person",
    };
  },

  methods: {
    setPersonOrOrganization() {
      this.personOrOrganization =
        this.personOrOrganization === "person" ? "organization" : "person";
      this.firstName = "";
      this.lastName = "";
      this.organizationName = "";
      this.email = "";
      this.contactEmail = "";
      this.telNumber = "";
      this.adress = "";
    },

    unShowContactForm() {
      const contactFormContainer = this.$refs.contactFormContainer;

      // Remove all classes from the element
      contactFormContainer.className = "role-form-container-unshow";

      // After a delay of 1.25 seconds, toggle the Vuex state to false
      setTimeout(() => {
        this.$store.dispatch("updateCurrentContactForm", "");
      }, 1250);
    },

    async createContact() {
      let contact;

      if (this.personOrOrganization === "person") {
        contact = {
          personOrOrganization: this.personOrOrganization,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          telNumber: this.telNumber,
          adress: this.adress,
          contactType: "customer",
        };
      } else {
        contact = {
          personOrOrganization: this.personOrOrganization,
          telNumber: this.telNumber,
          adress: this.adress,
          organizationName: this.organizationName,
          contactEmail: this.contactEmail,
          contactType: "customer",
        };
      }

      const isContactOk = contactHelper.checkContactFormValues(contact);

      if (isContactOk) {
        const response = await axios.post(
          "http://localhost:5000/contact/create-contact",
          contact,
          {
            withCredentials: true,
          }
        );

        console.log(response);
      } else {
        this.$store.commit("showModal", "Fill all fields correctly");
      }
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
        width: 150px;
        height: 25px;
        background-color: whitesmoke;
        border: none;
        border-radius: 4px;
        margin: 0 5px;
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
    width: 185px;
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
