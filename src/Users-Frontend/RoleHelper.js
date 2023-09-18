import axios from "axios";

const RoleHelper = {
  async fetchUserRights() {
    const rights = await axios.get("http://localhost:5000/get-user-rights", {
      withCredentials: true,
    });

    // Check if there is an error fetching user rights.
    if (rights.data.error) {
      // You can handle the error as needed, e.g., throw an exception or return an error message.
      throw new Error(rights.data.error);
    }

    // Extract and flatten user rights data, removing duplicates using a Set.
    const userRights = rights.data.rights.flatMap((roleRight) => {
      return roleRight.rights.map((right) => {
        return right.name;
      });
    });

    const uniqueUserRights = [...new Set(userRights)];
    return uniqueUserRights;
  },
};

export default RoleHelper;
