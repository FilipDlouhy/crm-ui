<template>
  <div>
    <div class="main-bar-buttons">
      <div class="main-bar-add-button-container">
        <button @click="customerAddFormOpen">
          Add {{ getContactText() }}

          <i class="material-icons"> person_add </i>
        </button>

        <button
          @click="removeContacts('Dou you want to delete these contacts')"
        >
          Remove {{ getContactText() }}

          <i class="material-icons"> person_remove </i>
        </button>
      </div>

      <div class="main-bar-filter-container">
        <select v-model="filterName">
          <option
            v-for="(row, index) in filterableContactTableRows"
            :key="index"
            :value="row.value"
          >
            {{ row.displayText }}
          </option>
        </select>
        <select
          v-model="personOrOrganizationValue"
          @change="addFilterPersonOrOrganization"
        >
          <option value="all">All</option>
          <option value="person">Person</option>
          <option value="organization">Organization</option>
        </select>
        <input v-model="filterValue" type="text" />
        <button @click="addFilter">Filter</button>
      </div>

      <div class="main-bar-service-button-container">
        <button v-if="typeOfContactToShow === 'worker'">
          Change Seniority <span class="material-icons"> person_search </span>
        </button>
        <button
          v-if="
            typeOfContactToShow === 'worker' ||
            typeOfContactToShow === 'jobCandidate'
          "
        >
          {{
            typeOfContactToShow === "worker"
              ? "Change Worker role"
              : "Change position to apply"
          }}
          <span class="material-icons"> engineering </span>
        </button>
        <button
          @click="changeWorkerOrJobCandidateHireStatus(false)"
          v-if="
            typeOfContactToShow === 'worker' ||
            typeOfContactToShow === 'jobCandidate'
          "
        >
          {{ typeOfContactToShow === "worker" ? "Fire" : "Reject" }}
          <span class="material-icons"> domain_disabled </span>
        </button>
        <button
          @click="changeWorkerOrJobCandidateHireStatus(true)"
          v-if="typeOfContactToShow === 'jobCandidate'"
        >
          Select
          <span class="material-icons"> add_business </span>
        </button>
      </div>
    </div>

    <table-view
      :rows="contactTableRows"
      :values="contacts"
      :id-of-value-to-change-by="'contact_id'"
      :clickable="true"
      :set-values-to-change="setValuesToChange"
      :filter-values="contactFilters"
      :remove-filter-func="removeFilter"
      :add-filter-sort="addFilterSort"
      :remove-filter-sort="removeFilterSort"
      :filter-values-sort="contactFiltersSort"
      :updateFunc="goToContactPage"
    />
    <table-view-footer
      :page="contactFirstPage"
      :total="totalCount"
      :total-message="`Total number ${getContactText()}s of is`"
      :last-page="contactLastPage"
      :decrement-page="removePage"
      :increment-page="addPage"
    />

    <add-contact-form
      ref="addContactForm"
      v-if="currentContactForm.length > 0"
    />
  </div>
</template>
<script>
import TableView from "../../Dashboard/Components/Core/TableView.vue";
import TableViewFooter from "../../Dashboard/Components/Core/TableViewFooter.vue";
import { mapGetters } from "vuex";
import AddContactForm from "./AddContactForm.vue";
import contactHelper from "../ContactHelper";
import axios from "axios";
export default {
  data() {
    return {
      contactTableRows: [],
      filterValue: "",
      selectedIndex: 0,
      filterName: "",
      chosenFormText: "",
      personOrOrganizationValue: "",
      unShowFormFunction: undefined,
    };
  },
  components: {
    TableView,
    TableViewFooter,
    AddContactForm,
  },

  computed: {
    filterableContactTableRows() {
      return this.contactTableRows.filter((row) => row.filterable);
    },

    ...mapGetters({
      currentContactForm: "currentContactForm",
      contacts: "contacts",
      contactsToChange: "contactsToChange",
      contactFilters: "contactFilters",
      contactFiltersSort: "contactFiltersSort",
      totalCount: "totalCount",
      contactFirstPage: "contactFirstPage",
      contactLastPage: "contactLastPage",
      typeOfContactToShow: "typeOfContactToShow",
    }),
  },

  methods: {
    async changeWorkerOrJobCandidateHireStatus(isHired) {
      if (this.contactsToChange.length === 0) {
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/contact/change-contact-hire-status",
        {
          contactIdsToUpdate: this.contactsToChange,
          isHired: isHired,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data.error) {
        this.$store.dispatch("updateHireStatus", isHired);
        this.$store.dispatch("openInfoPopUp", `Hire status Updated`);
      } else {
        this.$store.dispatch("openInfoPopUp", response.data.error);
      }
    },

    customerAddFormOpen() {
      this.$store.dispatch(
        "updateCurrentContactForm",
        this.typeOfContactToShow
      );
    },

    setValuesToChange(valuesToChange) {
      this.$store.commit("setConstactsToChange", valuesToChange);
    },

    removeContacts(message) {
      if (this.contactsToChange.length === 0) {
        return 0;
      }
      this.$store.commit("showDoYouWantToModal", message);
      this.$store.dispatch("setDoYouWantToModalFunction", "deleteContacts");
    },

    addFilterPersonOrOrganization(event) {
      this.$store.dispatch("addFilterstToContact", {
        filterName: "organization_or_person",
        filterValue: event.target.value,
      });

      this.$store.dispatch(
        "getContactsWithFiltersByType",
        this.typeOfContactToShow
      );
    },

    addFilter() {
      if (this.filterName.length === 0 || this.filterValue.length === 0) {
        return;
      }

      this.$store.dispatch("addFilterstToContact", {
        filterName: this.filterName,
        filterValue: this.filterValue,
      });

      this.$store.dispatch(
        "getContactsWithFiltersByType",
        this.typeOfContactToShow
      );
      this.filterValue = "";
    },

    removeFilter(collumName) {
      this.$store.dispatch("removeFilterContacts", collumName);
      this.$store.dispatch(
        "getContactsWithFiltersByType",
        this.typeOfContactToShow
      );
    },

    async addFilterSort(collumName, ascending) {
      await this.$store.dispatch("addFilterSortForContacts", {
        filterName: collumName,
        ascending: ascending,
      });

      await this.$store.dispatch(
        "getContactsWithFiltersByType",
        this.typeOfContactToShow
      );
    },
    async removeFilterSort(collumName) {
      await this.$store.dispatch("removeFilterSortForContacts", collumName);
      await this.$store.dispatch(
        "getContactsWithFiltersByType",
        this.typeOfContactToShow
      );
    },

    addPage() {
      if (this.contactFirstPage + 1 > this.contactLastPage) {
        return;
      }
      this.$store.commit("setContactFirstPage", this.contactFirstPage + 1);
      if (
        this.contactFilters.length > 0 ||
        this.contactFiltersSort.length > 0
      ) {
        this.$store.dispatch(
          "getContactsWithFiltersByType",
          this.typeOfContactToShow
        );
      } else {
        this.$store.dispatch("getContactsByType", this.typeOfContactToShow);
      }
    },

    removePage() {
      if (this.contactFirstPage - 1 < 1) {
        return;
      }
      this.$store.commit("setContactFirstPage", this.contactFirstPage - 1);
      if (
        this.contactFilters.length > 0 ||
        this.contactFiltersSort.length > 0
      ) {
        this.$store.dispatch(
          "getContactsWithFiltersByType",
          this.typeOfContactToShow
        );
      } else {
        this.$store.dispatch("getContactsByType", this.typeOfContactToShow);
      }
    },

    getContactText() {
      return contactHelper.getContactNameText(this.typeOfContactToShow);
    },

    goToContactPage(contact) {
      this.$store.commit("setContactToUpdate", contact);
      this.$router.push("/Contacts/ContactPage");
    },

    populateContactTableRows() {
      this.contactTableRows = [
        {
          displayText: "First name",
          value: "first_name",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Last name",
          value: "last_name",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Created",
          value: "created_at",
          sortable: true,
        },
        {
          displayText: "Address",
          value: "address",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Telephone",
          value: "tel_number",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Contact email",
          value: "email",
          sortable: true,
          filterable: true,
        },
      ];

      switch (this.typeOfContactToShow) {
        case "vendor":
        case "customer":
          this.contactTableRows.push(
            {
              displayText: "Organization name",
              value: "organization_name",
              bigger: true,
              sortable: true,
            },
            {
              displayText: "Organization/Person",
              value: "organization_or_person",
              bigger: true,
              sortable: true,
              filterable: true,
            }
          );
          break;

        case "jobCandidate":
          this.contactTableRows.push(
            {
              displayText: "Worker role",
              value: "worker_role",
            },
            {
              displayText: "Hired",
              value: "hired",
              sortable: true,
            }
          );
          break;

        case "worker":
          this.contactTableRows.push(
            {
              displayText: "Seniority",
              value: "seniority",
            },
            {
              displayText: "Worker role",
              value: "worker_role",
            },
            {
              displayText: "Hired",
              value: "hired",
              sortable: true,
            }
          );
          break;
      }
    },
  },
  async mounted() {
    this.populateContactTableRows();

    if (this.typeOfContactToShow.length === 0) {
      this.$store.commit(
        "setTypeOfContactToShow",
        localStorage.getItem("activeSubMenu").slice(0, -1)
      );
    }
    await this.$store.dispatch("getContactsByType", this.typeOfContactToShow);
  },

  watch: {
    contactFilters() {
      const containsOrganizationOrPersonFilter = this.contactFilters.some(
        (filter) => filter.filterName === "organization_or_person"
      );
      if (!containsOrganizationOrPersonFilter) {
        this.personOrOrganizationValue = "all";
      }
    },

    typeOfContactToShow() {
      if (
        this.contactFilters.length > 0 ||
        this.contactFiltersSort.length > 0
      ) {
        this.$store.dispatch(
          "getContactsWithFiltersByType",
          this.typeOfContactToShow
        );
      } else {
        this.$store.dispatch("getContactsByType", this.typeOfContactToShow);
      }

      this.populateContactTableRows();
    },
  },
};
</script>

<style lang="scss" scoped>
.main-bar-buttons {
  width: 100%;
  height: 60px;
  padding-left: 30px;
  display: flex;
  justify-content: space-between;
}

.main-bar-add-button-container {
  width: 400px;
  display: flex;
  align-items: center;
  height: 100%;

  button {
    display: flex;
    width: 200px;
    height: 30px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 10px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }

  select {
    display: flex;
    text-align: start;
    padding-left: 5px;
    width: 170px;
    height: 30px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 10px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }

    &:focus {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
      outline: none;
      border: none;
    }
  }
}

.main-bar-filter-container {
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;

  button {
    display: flex;
    width: 120px;
    height: 25px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 10px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    border-radius: 2px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }

  select {
    width: 130px;
    height: 25px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    outline: none;
    border-radius: 2px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }

  input {
    width: 150px;
    height: 25px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    outline: none;
    border-radius: 2px;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;

    &:focus {
      background-color: #435b93;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.7); /* Add box shadow on focus */
    }
  }
}

.main-bar-service-button-container {
  width: 400px;
  display: flex;
  align-items: center;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  button {
    display: flex;
    width: 180px;
    flex: 0 0 auto;
    height: 30px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 10px;
    background-color: #2c3968;
    color: whitesmoke;
    border: none;
    border-radius: 2px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
        rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    }
  }
}
</style>
