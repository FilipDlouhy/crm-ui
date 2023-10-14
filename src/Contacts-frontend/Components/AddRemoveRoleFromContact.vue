<template>
  <div :class="['popUp-content', animation ? 'zoomIn' : 'zoomOut']">
    <div class="heading-text-container">
      <p>Select contact type</p>
    </div>

    <div class="roles-container">
      <div>
        <p>Customer</p>
        <input
          value="customer"
          @change="toggleContactRole"
          :disabled="getDisabledCheckBox('customer')"
          v-model="hasCustomer"
          type="checkbox"
        />
      </div>

      <div>
        <p>Vendor</p>
        <input
          @change="toggleContactRole"
          value="vendor"
          v-model="hasVendor"
          :disabled="getDisabledCheckBox('vendor')"
          type="checkbox"
        />
      </div>

      <div v-if="contactToUpdate.organization_or_person === 'person'">
        <p>Worker</p>
        <input
          @change="toggleContactRole"
          :disabled="getDisabledCheckBox('worker')"
          value="worker"
          v-model="hasWorker"
          type="checkbox"
        />
      </div>

      <div v-if="contactToUpdate.organization_or_person === 'person'">
        <p>Job Candidate</p>
        <input
          :disabled="getDisabledCheckBox('jobCandidate')"
          @change="toggleContactRole"
          value="jobCandidate"
          v-model="hasJobCandidate"
          type="checkbox"
        />
      </div>
    </div>

    <div class="button-container">
      <button @click="unShowForm(true)">Close</button>
      <button @click="updateContactRoles">Update Contact Roles</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    updated: Boolean,
  },
  data() {
    return {
      animation: true,
      hasCustomer: false,
      hasVendor: false,
      hasWorker: false,
      hasJobCandidate: false,
      contactRoles: [],
      initialContactRoles: [],
    };
  },

  computed: {
    ...mapGetters({ contactToUpdate: "contactToUpdate" }),
  },

  methods: {
    unShowForm(resetContactRoles = false) {
      if (resetContactRoles) {
        this.$store.commit("setContactToUpdateRoles", this.initialContactRoles);
      }
      this.animation = false;
      setTimeout(() => {
        this.$store.commit("setShowUpdateContactRolesForm", false);
      }, 500);
    },

    getContactRolesOfContact() {
      if (this.contactToUpdate.contact_roles.includes("customer")) {
        this.hasCustomer = true;
      } else {
        this.hasCustomer = false;
      }

      if (this.contactToUpdate.contact_roles.includes("vendor")) {
        this.hasVendor = true;
      } else {
        this.hasVendor = false;
      }

      if (this.contactToUpdate.contact_roles.includes("worker")) {
        this.hasWorker = true;
      } else {
        this.hasWorker = false;
      }

      if (this.contactToUpdate.contact_roles.includes("jobCandidate")) {
        this.hasJobCandidate = true;
      } else {
        this.hasJobCandidate = false;
      }
    },

    toggleContactRole(event) {
      if (event.target.checked) {
        if (this.contactRoles.includes(event.target.value)) {
          return;
        }
        this.contactRoles.push(event.target.value);
      } else {
        if (this.contactRoles.length === 1) {
          event.preventDefault();
          return;
        }
        const indexToRemove = this.contactRoles.indexOf(event.target.value);

        if (indexToRemove !== -1) {
          this.contactRoles.splice(indexToRemove, 1);
        }
      }
    },

    updateContactRoles() {
      this.$emit("update", true);
      this.$store.commit("setContactToUpdateRoles", this.contactRoles);
      this.unShowForm();
    },

    getDisabledCheckBox(value) {
      if (this.contactRoles.length === 1 && this.contactRoles.includes(value)) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.contactRoles = this.contactToUpdate.contact_roles;
    const initialContactRoles = [];
    this.contactToUpdate.contact_roles.map((role) => {
      initialContactRoles.push(role);
    });

    this.initialContactRoles = initialContactRoles;

    this.getContactRolesOfContact();
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
