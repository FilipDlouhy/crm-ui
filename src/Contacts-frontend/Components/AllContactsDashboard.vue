<template>
  <div>
    <div class="main-bar-buttons">
      <div class="main-bar-add-button-container">
        <select @change="chooseContactFormToOpen">
          <option value="none">
            Chosen {{ chosenFormText.length === 0 ? "None" : chosenFormText }}
          </option>
          <option value="customer">Add Customer</option>
          <option value="worker">Add Worker</option>
          <option value="vendor">Add Vendor</option>
          <option value="jobCandidate">Add Job Candidate</option>
        </select>

        <button
          @click="removeContacts('Dou you want to delete these contacts')"
        >
          Remove Contacts

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

      <div class="main-bar-service-button-container"></div>
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
      :total-message="'Total number of contacts is'"
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
export default {
  data() {
    return {
      contactTableRows: [
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
          displayText: "Organization name",
          value: "organization_name",
          bigger: true,
          sortable: true,
        },
        {
          displayText: "Created",
          value: "created_at",
          sortable: true,
        },
        {
          displayText: "Contact roles",
          value: "contact_roles",
        },
        {
          displayText: "Address",
          value: "address",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Organization/Person",
          value: "organization_or_person",
          bigger: true,
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
      ],
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
    }),
  },

  methods: {
    async chooseContactFormToOpen(event) {
      // Check if the addContactForm component is rendered
      if (this.$refs.addContactForm) {
        this.$refs.addContactForm.unShowContactForm();
        setTimeout(() => {
          this.setAddContactFormToShow(event);
        }, 1400);
      } else {
        this.setAddContactFormToShow(event);
      }

      // Wait for 1.25 seconds before executing the rest of the code
    },

    setAddContactFormToShow(event) {
      this.$store.dispatch("updateCurrentContactForm", event.target.value);
      switch (event.target.value) {
        case "jobCandidate":
          this.chosenFormText = "Job Candidate";
          break;
        case "customer":
          this.chosenFormText = "Customer";
          break;
        case "worker":
          this.chosenFormText = "Worker";
          break;
        case "vendor":
          this.chosenFormText = "Vendor";
          break;
        default:
          break;
      }
      event.target.value = "none";
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

      this.$store.dispatch("getContactsWithFilters");
    },

    addFilter() {
      if (this.filterName.length === 0 || this.filterValue.length === 0) {
        return;
      }

      this.$store.dispatch("addFilterstToContact", {
        filterName: this.filterName,
        filterValue: this.filterValue,
      });

      this.$store.dispatch("getContactsWithFilters");
      this.filterValue = "";
    },

    removeFilter(collumName) {
      this.$store.dispatch("removeFilterContacts", collumName);
      this.$store.dispatch("getContactsWithFilters");
    },

    async addFilterSort(collumName, ascending) {
      await this.$store.dispatch("addFilterSortForContacts", {
        filterName: collumName,
        ascending: ascending,
      });

      await this.$store.dispatch("getContactsWithFilters");
    },
    async removeFilterSort(collumName) {
      await this.$store.dispatch("removeFilterSortForContacts", collumName);
      await this.$store.dispatch("getContactsWithFilters");
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
        this.$store.dispatch("getContactsWithFilters");
      } else {
        this.$store.dispatch("getContacts");
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
        this.$store.dispatch("getContactsWithFilters");
      } else {
        this.$store.dispatch("getContacts");
      }
    },

    goToContactPage(contact) {
      this.$store.commit("setContactToUpdate", contact);
      this.$router.push("/Contacts/ContactPage");
    },
  },
  async mounted() {
    await this.$store.dispatch("getContacts");
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
  width: 380px;
  display: flex;
  align-items: center;
  height: 100%;

  button {
    display: flex;
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
