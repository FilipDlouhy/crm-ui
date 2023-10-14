<template>
  <div>
    <div class="contact-page-tableview-sections">
      <div>
        <button @click="goBackToContactDashboard" :style="{ width: '100px' }">
          <span :style="{ fontSize: '2rem' }" class="material-icons">
            arrow_back
          </span>
        </button>
        <button
          v-for="(contactRole, index) in contactToUpdate.contact_roles"
          :class="[contactRole === typeOfContactToShow ? 'selected' : '']"
          @click="setContactRole(contactRole)"
          :key="index"
        >
          {{ getContactText(contactRole) }}
        </button>
      </div>
      <div>
        <button
          @click="showUpdateRoleForm"
          :style="{ width: '200px', marginRight: '10px' }"
        >
          Update roles
        </button>
      </div>
    </div>
    <div class="contact-info-header">
      <div class="contact-info-header-info-container">
        <div class="contact-info-header-contact-info-contact">
          <span class="material-icons"> mood </span>
        </div>
        <div class="contact-info-header-contact-info-details-container">
          <div class="contact-info-header-contact-info-details">
            <div
              v-if="contactToUpdate.organization_or_person === 'organization'"
              class="contact-info-header-contact-info-details-container-div-large"
            >
              <p>Organization name</p>
              <input
                @change="setUpdated"
                type="text"
                v-model="organization_name"
              />
            </div>
            <div
              v-if="contactToUpdate.organization_or_person === 'person'"
              class="contact-info-header-contact-info-details-container-div"
            >
              <p>First name:</p>
              <input @change="setUpdated" type="text" v-model="first_name" />
            </div>

            <div
              v-if="contactToUpdate.organization_or_person === 'person'"
              class="contact-info-header-contact-info-details-container-div"
            >
              <p>Last name:</p>
              <input @change="setUpdated" type="text" v-model="last_name" />
            </div>

            <div class="contact-info-header-contact-info-details-container-div">
              <p>Email:</p>
              <input @change="setUpdated" type="text" v-model="email" />
            </div>

            <div class="contact-info-header-contact-info-details-container-div">
              <p>Tel number:</p>
              <input @change="setUpdated" type="text" v-model="tel_number" />
            </div>

            <div class="contact-info-header-contact-info-details-container-div">
              <p>Adress:</p>
              <input @change="setUpdated" type="text" v-model="address" />
            </div>
          </div>
          <div class="contact-info-header-contact-info-details">
            <div
              class="contact-info-header-contact-info-details-container-div-large"
            >
              <p>Created:</p>
              <input type="text" disabled v-model="created_at" />
            </div>
            <div
              class="contact-info-header-contact-info-details-container-div-large"
            >
              <p>Organization/Person:</p>
              <input type="text" disabled v-model="organization_or_person" />
            </div>

            <div
              v-if="
                typeOfContactToShow === 'worker' ||
                typeOfContactToShow === 'jobCandidate'
              "
              class="contact-info-header-contact-info-details-container-div-large"
            >
              <p>Seniority:</p>
              <select @change="setUpdated" v-model="seniority">
                <option value="Junior">Junior</option>
                <option value="Medior">Medior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div
              v-if="
                typeOfContactToShow === 'worker' ||
                typeOfContactToShow === 'jobCandidate'
              "
              class="contact-info-header-contact-info-details-container-div-large"
            >
              <p>Worker Role:</p>
              <select @change="setUpdated" v-model="worker_role">
                <option value="UI Dev">UI Dev</option>
                <option value="Backend Dev">Backend Dev</option>
                <option value="God Emperor">God Emperor</option>
              </select>
            </div>

            <div
              v-if="
                typeOfContactToShow === 'worker' ||
                typeOfContactToShow === 'jobCandidate'
              "
              class="contact-info-header-contact-info-details-container-div-large"
            >
              <p>Hired:</p>
              <select @change="setUpdated" v-model="hired">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-info-header-bottom">
        <p>{{ `${this.first_name}  ${this.last_name}` }}</p>
        <button @click="updateContact" v-if="updated">Update</button>
      </div>
    </div>
    <div class="contact-page-tableview-sections">
      <button>Activities</button>
      <button>Contracts</button>
    </div>
    <div class="contact-page-tablewiev-container"></div>
    <add-remove-role-from-contact
      :updated="updated"
      v-if="showUpdateContactRolesForm"
      @update="setUpdated"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AddRemoveRoleFromContact from "./AddRemoveRoleFromContact.vue";
import contactHelper from "../ContactHelper";
import axios from "axios";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      organization_or_person: "",
      activities: [],
      contracts: [],
      tel_number: "",
      contact_roles: [],
      worker_role: "",
      seniority: "",
      hired: false,
      email: "",
      address: "",
      organization_name: "",
      created_at: "",
      updated: false,
    };
  },

  components: {
    AddRemoveRoleFromContact,
  },

  computed: {
    ...mapGetters({
      contactToUpdate: "contactToUpdate",
      showUpdateContactRolesForm: "showUpdateContactRolesForm",
      typeOfContactToShow: "typeOfContactToShow",
    }),
  },

  methods: {
    getInitialContactInfo() {
      this.first_name = this.contactToUpdate.first_name || "";
      this.last_name = this.contactToUpdate.last_name || "";
      this.organization_or_person =
        this.contactToUpdate.organization_or_person || "";
      this.tel_number = this.contactToUpdate.tel_number || "";
      this.worker_role = this.contactToUpdate.worker_role || "";
      this.seniority = this.contactToUpdate.seniority || "";
      this.hired = this.contactToUpdate.hired === true ? "Yes" : "No" || "";
      this.email = this.contactToUpdate.email || "";
      this.address = this.contactToUpdate.address || "";
      this.organization_name = this.contactToUpdate.organization_name || "";
      this.created_at = this.contactToUpdate.created_at.slice(0, 10) || "";
    },

    goBackToContactDashboard() {
      const type =
        this.typeOfContactToShow.charAt(0).toUpperCase() +
        this.typeOfContactToShow.slice(1) +
        "s";
      const path = `/Contacts/${type}`;

      localStorage.setItem("path", path);
      this.$router.push(path);

      const subMenuText = `/Contact-Service/${
        type === "JobCandidates" ? "Job Candidates" : type
      }`;
      this.$store.commit("setActiveMenuText", subMenuText);
      localStorage.setItem("activeMenuText", subMenuText);

      this.$store.commit("setActiveSubMenu", this.typeOfContactToShow + "s");
      localStorage.setItem("activeSubMenu", this.typeOfContactToShow + "s");
    },

    setUpdated() {
      this.updated = true;
    },

    showUpdateRoleForm() {
      this.$store.commit("setShowUpdateContactRolesForm", true);
    },
    getContactText(contactRole) {
      return contactHelper.getContactNameText(contactRole);
    },

    setContactRole(contactRole) {
      this.$store.commit("setTypeOfContactToShow", contactRole);
    },
    async updateContact() {
      let updatedContact;
      if (this.contactToUpdate.organization_or_person === "person") {
        updatedContact = {
          first_name: this.first_name,
          last_name: this.last_name,
          tel_number: this.tel_number,
          worker_role: this.worker_role,
          seniority: this.seniority,
          hired: this.hired === "Yes" ? true : false,
          email: this.email,
          address: this.address,
          contact_roles: this.contactToUpdate.contact_roles,
          contact_id: this.contactToUpdate.contact_id,
        };
      } else {
        updatedContact = {
          tel_number: this.tel_number,
          email: this.email,
          address: this.address,
          organization_name: this.organization_name,
          contact_id: this.contactToUpdate.contact_id,
        };
      }

      const response = await axios.post(
        "http://localhost:5000/contact/update-contact",
        updatedContact,
        {
          withCredentials: true,
        }
      );

      if (!response.data.error) {
        this.$store.dispatch("openInfoPopUp", `User updated`);
        this.updated = false;
      } else {
        this.$store.dispatch("openInfoPopUp", response.data.error);
        this.updated = false;
      }
    },
  },
  async mounted() {
    this.updated = false;
    if (!this.typeOfContactToShow) {
      this.$store.commit(
        "setTypeOfContactToShow",
        this.contactToUpdate.contact_roles[0]
      );
    }

    this.getInitialContactInfo();
  },
};
</script>

<style lang="scss" scoped>
.contact-info-header {
  width: 100%;
  height: 250px;
}
.contact-page-tableview-sections {
  width: 100%;
  height: 50px;
  border-top: 1px solid #2c3968;
  border-bottom: 1px solid #2c3968;
  display: flex;

  button {
    height: 96%;
    width: 150px;
    outline: none;
    border: none;
    transition: 0.3s;
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: bold;

    &:hover {
      box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px,
        rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px,
        rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px,
        rgba(0, 0, 0, 0.07) 0px 32px 64px;
    }
  }

  div {
    width: 50%;
    height: 100%;
    display: flex;
    button {
      height: 96%;
      width: 150px;
      outline: none;
      border: none;
      transition: 0.3s;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: bold;

      &:hover {
        box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px,
          rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px,
          rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px,
          rgba(0, 0, 0, 0.07) 0px 32px 64px;
      }
    }
  }
}

.selected {
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
}

.contact-page-tableview-sections div:last-child {
  display: flex;
  justify-content: end;
}

.contact-page-tablewiev-container {
  width: 100%;
  height: 550px;
}

.contact-info-header-bottom {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    width: 100px;
    height: 100%;
    background-color: #2c3968;
    border: none;
    border-top-left-radius: 5px;
    color: whitesmoke;
    letter-spacing: 2px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background-color: #3a4a85;
    }
  }

  p {
    margin-left: 10px;
    font-size: 1.25rem;
    font-weight: bolder;
  }
}

.contact-info-header-contact-info-contact {
  width: 160px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  span {
    font-size: 10rem;
  }
}

.contact-info-header-contact-info-details-container {
  height: 100%;
  width: 100%;
}

.contact-info-header-contact-info-details {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.contact-info-header-contact-info-details-container-div {
  width: 290px;
  height: 50%;
  padding: 5px;
  display: flex;

  p {
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 1.25rem;
    color: #3a4a85;
  }

  input {
    width: 150px;
    height: 30px;
    border: none;
    margin-left: 5px;
    font-size: 1.3rem;
    padding-bottom: 1px;
    transition: 0.3s;
    border-bottom: 3px solid transparent;
    padding: 5px;
    cursor: pointer;

    &:focus {
      border: none;
      outline: none;
      background-color: #3a4a85;
      border-radius: 5px;
      border-bottom: 3px solid transparent;

      color: whitesmoke;
    }
  }

  select {
    width: 150px;
    height: 30px;
    border: none;
    margin-left: 5px;
    font-size: 1.3rem;
    padding-bottom: 1px;
    transition: 0.3s;
    border-bottom: 3px solid transparent;
    cursor: pointer;

    &:focus {
      border: none;
      outline: none;
      background-color: #3a4a85;
      border-radius: 5px;
      border-bottom: 3px solid transparent;

      color: whitesmoke;
    }
  }
}

.contact-info-header-contact-info-details-container-div-large {
  width: 370px;
  height: 50%;
  padding: 5px;
  display: flex;

  p {
    font-weight: bold;
    letter-spacing: 1px;
    font-size: 1.25rem;
    color: #3a4a85;
  }

  input {
    width: 180px;
    height: 30px;
    border: none;
    margin-left: 5px;
    font-size: 1.3rem;
    padding-bottom: 1px;
    transition: 0.3s;
    border-bottom: 3px solid transparent;
    padding: 5px;

    &:focus {
      border: none;
      outline: none;
      background-color: #3a4a85;
      border-radius: 5px;
      border-bottom: 3px solid transparent;

      color: whitesmoke;
    }
  }

  select {
    width: 180px;
    height: 30px;
    border: none;
    margin-left: 5px;
    font-size: 1.3rem;
    padding-bottom: 1px;
    transition: 0.3s;
    border-bottom: 3px solid transparent;
    cursor: pointer;

    &:focus {
      border: none;
      outline: none;
      background-color: #3a4a85;
      border-radius: 5px;
      border-bottom: 3px solid transparent;

      color: whitesmoke;
    }
  }
}

.contact-info-header-info-container {
  width: 100%;
  height: 210px;
  display: flex;
}
</style>
