<template>
  <div ref="contactFormContainer" :class="'contact-form-container-show'">
    <div class="contact-form">
      <i @click="unShowContactForm" class="material-icons"> login </i>
      <div class="contact-form-header">
        <h1 :class="isCreating ? 'loadingText' : ''">
          {{
            isCreating ? "Loading" : capitalizeFirstLetter(currentContactForm)
          }}
        </h1>
      </div>
      <div>
        <div
          v-if="organization_or_person === 'person'"
          class="contact-form-login-data-input-container"
        >
          <div>
            <p>First Name</p>
            <input v-model="first_name" type="text" />
          </div>
          <div>
            <p>Last Name</p>
            <input v-model="last_name" type="text" />
          </div>

          <div>
            <p>Email</p>
            <input v-model="email" type="text" />
          </div>
          <div>
            <p>Telephone</p>
            <input v-model="tel_number" type="tel" />
          </div>

          <div>
            <p>Address</p>
            <input v-model="address" type="tel" />
          </div>

          <div
            v-if="
              currentContactForm === 'jobCandidate' ||
              currentContactForm === 'worker'
            "
          >
            <p>Worker role</p>
            <select v-model="worker_role">
              <option value="UI Dev">UI Dev</option>
              <option value="Backend Dev">Backend Dev</option>
              <option value="God Emperor">God Emperor</option>
            </select>
          </div>

          <div
            v-if="
              currentContactForm === 'jobCandidate' ||
              currentContactForm === 'worker'
            "
          >
            <p>Seniority</p>
            <select v-model="seniority">
              <option value="Junior">Junior</option>
              <option value="Medior">Medior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>

        <div
          v-if="organization_or_person === 'organization'"
          class="contact-form-login-data-input-container"
        >
          <div>
            <p>Organization Name</p>
            <input v-model="organization_name" type="text" />
          </div>

          <div>
            <p>Contact Email</p>
            <input v-model="contactEmail" type="text" />
          </div>
          <div>
            <p>Telephone</p>
            <input v-model="tel_number" type="tel" />
          </div>

          <div>
            <p>Address</p>
            <input v-model="address" type="tel" />
          </div>
        </div>

        <div class="contact-form-create-button">
          <button
            :class="
              currentContactForm === 'jobCandidate'
                ? 'contact-form-larger-button'
                : 'contact-form-normal-button'
            "
            @click="createContact(currentContactForm)"
          >
            {{ capitalizeFirstLetter(currentContactForm) }}
          </button>
          <button
            class="contact-form-normal-button"
            v-if="
              currentContactForm === 'customer' ||
              currentContactForm === 'vendor'
            "
            @click="setorganization_or_person"
          >
            {{
              organization_or_person === "person" ? "Person" : "Organization"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import contactHelper from "../ContactHelper";
import { v4 as uuidv4 } from "uuid";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      organization_name: "",
      email: "",
      contactEmail: "",
      tel_number: "",
      address: "",
      organization_or_person: "person",
      isCreating: false,
      worker_role: "",
      seniority: "",
    };
  },

  computed: {
    ...mapGetters({
      currentContactForm: "currentContactForm",
    }),
  },

  methods: {
    setorganization_or_person() {
      this.organization_or_person =
        this.organization_or_person === "person" ? "organization" : "person";
      this.first_name = "";
      this.last_name = "";
      this.organization_name = "";
      this.email = "";
      this.contactEmail = "";
      this.tel_number = "";
      this.address = "";
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

    async createContact(contact_type) {
      let contact;
      const contactId = uuidv4();
      if (
        this.organization_or_person === "person" &&
        (this.currentContactForm === "customer" ||
          this.currentContactForm === "vendor")
      ) {
        contact = {
          organization_or_person: this.organization_or_person,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          tel_number: this.tel_number,
          address: this.address,
          contact_type: contact_type,
          contact_id: contactId,
        };
      } else {
        contact = {
          organization_or_person: this.organization_or_person,
          tel_number: this.tel_number,
          address: this.address,
          organization_name: this.organization_name,
          email: this.contactEmail,
          contact_type: contact_type,
          contact_id: contactId,
        };
      }

      if (
        this.currentContactForm === "jobCandidate" ||
        this.currentContactForm === "worker"
      ) {
        contact = {
          organization_or_person: this.organization_or_person,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          tel_number: this.tel_number,
          address: this.address,
          contact_type: contact_type,
          worker_role: this.worker_role,
          seniority: this.seniority,
          contact_id: contactId,
        };
      }
      this.isCreating = true;

      (contact.created_at = new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })),
        (this.isCreating = await contactHelper.createContact(
          this.currentContactForm,
          contact,
          this.unShowContactForm
        ));
    },

    capitalizeFirstLetter(str) {
      if (str === "jobCandidate") {
        return "Create Job Cadidate";
      }

      return "Create " + str.charAt(0).toUpperCase() + str.slice(1);
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
}

.contact-form-normal-button {
  width: 185px;
  height: 40px;
  background-color: whitesmoke;
  border: none;
  border-radius: 4px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
      rgba(0, 0, 0, 0.22) 0px 15px 12px;
  }
}

.contact-form-larger-button {
  width: 280px;
  height: 40px;
  background-color: whitesmoke;
  border: none;
  border-radius: 4px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: 0.2s;
}

.loadingText {
  animation: loading 0.7s infinite;
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

@keyframes loading {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
