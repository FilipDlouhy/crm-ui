const contactHelper = {
  checkContactFormValues(contact) {
    for (const property in contact) {
      if (contact[property] == null || contact[property].length === 0) {
        return false;
      }

      if (
        (property === "email" && !isValidEmail(contact[property])) ||
        (property === "contactEmail" && !isValidEmail(contact[property]))
      ) {
        return false;
      }
    }
    return true;
  },
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default contactHelper;
