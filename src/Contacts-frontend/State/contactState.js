import axios from "axios";
import {
  addSelectedFilter,
  removeSelectedFilter,
  addSelectedFilterSort,
} from "../../Dashboard/Components/Core/FilterHelper/FilterHelper";
const contactState = {
  state: {
    contacts: [],
    contactsToChange: [],
    contactFilters: [],
    contactFiltersSort: [],
    totalCount: 0,
    contactFirstPage: 1,
    contactLastPage: 0,
  },
  mutations: {
    setConstacts(state, contact) {
      state.contacts = contact;
    },
    setConstactsToChange(state, contactsToChange) {
      state.contactsToChange = contactsToChange;
    },
    setConstactFilters(state, contactFilters) {
      state.contactFilters = contactFilters;
    },

    setConstactFiltersSort(state, contactFiltersSort) {
      state.contactFiltersSort = contactFiltersSort;
    },

    setTotalCount(state, totalCount) {
      state.totalCount = totalCount;
    },
    setContactFirstPage(state, contactFirstPage) {
      state.contactFirstPage = contactFirstPage;
    },
    setContactLastPage(state, contactLastPage) {
      state.contactLastPage = contactLastPage;
    },
  },
  actions: {
    // Action to add a contact
    async getContacts({ commit, state }) {
      console.log("KUNDO");
      const response = await axios.get(
        "http://localhost:5000/contact/get-contacts",
        {
          params: { page: state.contactFirstPage },
          withCredentials: true,
        }
      );
      commit("setTotalCount", response.data.count);
      commit("setContactLastPage", Math.ceil(response.data.count / 25));
      commit("setConstacts", response.data.contacts);
    },

    async addContact({ commit, state }, contact) {
      let newContacts = state.contacts;

      if (state.contacts.length < 25) {
        newContacts.push(contact);
      } else {
        newContacts.pop();
        newContacts.push(contact);
      }

      commit("setConstacts", newContacts);
    },

    async deleteContacts({ commit, state }) {
      const response = await axios.post(
        "http://localhost:5000/contact/remove-contacts",
        state.contactsToChange,
        {
          withCredentials: true,
        }
      );

      if (!response.data.error) {
        const filteredContacts = state.contacts.filter(
          (contact) => !state.contactsToChange.includes(contact.contact_id)
        );
        commit("setConstacts", filteredContacts);

        commit("setTotalCount", response.data.count);
        commit("setContactLastPage", Math.ceil(response.data.count / 25));
      }

      return response;
    },

    addFilterstToContact({ commit, state }, filter) {
      let newContactFilterArray;
      if (filter.filterName === "organization_or_person") {
        newContactFilterArray = state.contactFilters.filter((filter) => {
          return filter.filterName !== "organization_or_person";
        });

        if (filter.filterValue !== "all") {
          newContactFilterArray.push(filter);
        }
      }

      if (filter.filterName !== "organization_or_person") {
        newContactFilterArray = addSelectedFilter(state.contactFilters, {
          filterName: filter.filterName,
          filterValue: filter.filterValue,
        });
      }
      commit("setConstactFilters", newContactFilterArray);
    },

    async getContactsWithFilters({ commit, state }) {
      const response = await axios.post(
        "http://localhost:5000/contact/get-contacts-with-filters",
        {
          filters: state.contactFilters,
          sortables: state.contactFiltersSort,
          page: state.contactFirstPage,
        },
        {
          withCredentials: true,
        }
      );
      commit("setConstacts", response.data.contacts);
      commit("setTotalCount", response.data.count);
      commit("setContactLastPage", Math.ceil(response.data.count / 25));
    },

    removeFilterContacts({ commit, state }, filterName) {
      const newFilterArray = removeSelectedFilter(
        state.contactFilters,
        filterName
      );
      commit("setConstactFilters", newFilterArray);
    },

    addFilterSortForContacts({ commit, state }, filter) {
      const newSortables = addSelectedFilterSort(
        state.contactFiltersSort,
        filter
      );
      commit("setConstactFiltersSort", newSortables);
    },

    removeFilterSortForContacts({ commit, state }, filterName) {
      const newSortables = removeSelectedFilter(
        state.contactFiltersSort,
        filterName
      );
      commit("setConstactFiltersSort", newSortables);
    },
  },
  getters: {
    contacts(state) {
      return state.contacts;
    },

    contactsToChange(state) {
      return state.contactsToChange;
    },
    contactFilters(state) {
      return state.contactFilters;
    },
    contactFiltersSort(state) {
      return state.contactFiltersSort;
    },

    totalCount(state) {
      return state.totalCount;
    },
    contactFirstPage(state) {
      return state.contactFirstPage;
    },
    contactLastPage(state) {
      return state.contactLastPage;
    },
  },
};

export default contactState;
