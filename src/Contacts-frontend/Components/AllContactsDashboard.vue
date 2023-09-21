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

        <button>
          Contact remove

          <i class="material-icons"> person_remove </i>
        </button>
      </div>

      <div class="main-bar-filter-container">
        <select
          @change="setIndexOfFilter($event.target.selectedIndex)"
          v-model="filterName"
        >
          <option
            v-for="(row, index) in filterableContactTableRows"
            :key="index"
          >
            {{ row.displayText }}
          </option>
        </select>
        <input v-model="filterValue" type="text" />
        <button>Filter</button>
      </div>

      <div class="main-bar-service-button-container"></div>
    </div>
    <table-view :rows="contactTableRows" :values="values" />
    <table-view-footer />
    <add-job-candidate-form v-if="currentContactForm === 'jobCandidate'" />
    <add-customer-vendor-form
      v-if="
        currentContactForm === 'customer' || currentContactForm === 'vendor'
      "
    />
    <add-worker-form v-if="currentContactForm === 'worker'" />
  </div>
</template>
<script>
import TableView from "../../Dashboard/Components/Core/TableView.vue";
import TableViewFooter from "../../Dashboard/Components/Core/TableViewFooter.vue";
import AddJobCandidateForm from "./AddJobCandidateForm.vue";
import { mapGetters } from "vuex";
import AddWorkerForm from "./AddWorkerForm.vue";
import AddCustomerVendorForm from "./AddCustomerVendorForm.vue";
export default {
  data() {
    return {
      contactTableRows: [
        {
          displayText: "First name",
          value: "contact_first_name",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Last name",
          value: "contact_last_name",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Organization name",
          value: "organization_name",
          bigger: true,
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Created",
          value: "created_at",
          sortable: true,
        },
        {
          displayText: "Contact type",
          value: "type",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Adress",
          value: "type",
          sortable: true,
          filterable: true,
        },
        {
          displayText: "Organization/Person",
          value: "organization_or_peson",
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
          displayText: "Contact roles",
          value: "contact_role",
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
      values: [],
      filterValue: "",
      selectedIndex: 0,
      filterName: "",
      chosenFormText: "",
    };
  },
  components: {
    TableView,
    TableViewFooter,
    AddJobCandidateForm,
    AddWorkerForm,
    AddCustomerVendorForm,
  },

  computed: {
    filterableContactTableRows() {
      return this.contactTableRows.filter((row) => row.filterable);
    },

    ...mapGetters({
      currentContactForm: "currentContactForm",
    }),
  },

  methods: {
    chooseContactFormToOpen(event) {
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
  width: 500px;
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
  width: 600px;
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
