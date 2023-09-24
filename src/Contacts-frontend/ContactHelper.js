import axios from "axios";
import store from "@/store";
const contactHelper = {
  async createContact(contactType, contactToCreate, unShowForm) {
    const isContactOk = checkContactFormValues(contactToCreate);
    if (isContactOk) {
      const response = await axios.post(
        "http://localhost:5000/contact/create-contact",
        contactToCreate,
        {
          withCredentials: true,
        }
      );

      if (!response.data.error) {
        unShowForm();

        store.dispatch(
          "openInfoPopUp",
          ` ${capitalizeFirstLetter(contactType)} contact created`
        );
        store.commit("setTotalCount", response.data.count);
        store.commit("setContactLastPage", Math.ceil(response.data.count / 25));

        store.dispatch("addContact", contactToCreate);
      } else {
        store.dispatch("openInfoPopUp", response.data.error);
      }
    } else {
      store.commit("showModal", "Fill all fields correctly");
    }
    return false;
  },

  getContactNameText(contact) {
    if (contact === "jobCandidate") {
      return "Job candidate";
    } else {
      return contact.charAt(0).toUpperCase() + contact.slice(1);
    }
  },

  getContactIcon(contactType) {
    if (contactType === "person") {
      return "person";
    } else {
      return "store";
    }
  },
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  return /^\d{7,}$/.test(phoneNumber);
}

function checkContactFormValues(contact) {
  for (const property in contact) {
    if (contact[property] == null || contact[property].length === 0) {
      return false;
    }

    if (
      (property === "email" && !isValidEmail(contact[property])) ||
      (property === "contactEmail" && !isValidEmail(contact[property])) ||
      (property === "telNumber" && !isValidPhoneNumber(contact[property]))
    ) {
      return false;
    }
  }
  return true;
}

function capitalizeFirstLetter(str) {
  if (str === "jobCandidate") {
    return " Job Cadidate";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default contactHelper;
