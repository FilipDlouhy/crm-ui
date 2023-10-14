<template>
  <div>
    <div
      :class="activeMenu === 'contacts' ? 'selected-service' : 'service'"
      @click="setContactsAsActiveMenu"
    >
      <div class="service-name">
        <i class="material-icons"> account_box </i>
        <p>Contacts</p>
      </div>
    </div>

    <div v-if="activeMenu === 'contacts'" class="activeMenu">
      <div
        :class="
          activeSubMenu === 'allContacts'
            ? 'selected-sub-service'
            : 'sub-service'
        "
        @click="
          setAsActiveSubMenu('allContacts'),
            setAsActiveMenuText('/Contact-Service/All Contacts'),
            navigateToAllContacts()
        "
      >
        <div>
          <i class="material-icons"> contacts </i>
          <p>All contacts</p>
        </div>
      </div>

      <div
        :class="
          activeSubMenu === 'customers' ? 'selected-sub-service' : 'sub-service'
        "
        @click="
          setAsActiveSubMenu('customers'),
            setAsActiveMenuText('/Contact-Service/Customers'),
            navigateToContact('Customers')
        "
      >
        <div>
          <i class="material-icons"> call </i>
          <p>Customers</p>
        </div>
      </div>

      <div
        :class="
          activeSubMenu === 'workers' ? 'selected-sub-service' : 'sub-service'
        "
        @click="
          setAsActiveSubMenu('workers'),
            setAsActiveMenuText('/Contact-Service/Workers'),
            navigateToContact('Workers')
        "
      >
        <div>
          <i class="material-icons"> work </i>
          <p>Workers</p>
        </div>
      </div>

      <div
        :class="
          activeSubMenu === 'vendors' ? 'selected-sub-service' : 'sub-service'
        "
        @click="
          setAsActiveSubMenu('vendors'),
            setAsActiveMenuText('/Contact-Service/Vendors'),
            navigateToContact('Vendors')
        "
      >
        <div>
          <i class="material-icons"> shopping_cart </i>
          <p>Vendors</p>
        </div>
      </div>

      <div
        :class="
          activeSubMenu === 'jobCandidates'
            ? 'selected-sub-service'
            : 'sub-service'
        "
        @click="
          setAsActiveSubMenu('jobCandidates'),
            setAsActiveMenuText('/Contact-Service/Job Candidates'),
            navigateToContact('JobCandidates')
        "
      >
        <div>
          <i class="material-icons"> work_history </i>
          <p>Job candidate</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      activeMenu: "activeMenu",
      activeSubMenu: "activeSubMenu",
      userRights: "userRights",
    }),
  },

  methods: {
    setContactsAsActiveMenu() {
      if (this.activeMenu !== "contacts") {
        localStorage.setItem("activeMenu", "contacts");
        this.$store.commit("setActiveMenu", "contacts");
        this.$store.commit("setActiveSubMenu", "allContacts");
        localStorage.setItem("path", "/Contacts/AllContacts");
        this.$router.push("/Contacts/AllContacts");
        this.$store.commit(
          "setActiveMenuText",
          "/Contact-Service/All Contacts"
        );
        localStorage.setItem("activeMenuText", "/Contact-Service/All Contacts");
      }
    },

    navigateToContact(type) {
      const path = `/Contacts/${type}`;
      if (this.$route.path !== path) {
        localStorage.setItem("path", path);
        this.$router.push(path);
        this.$store.dispatch("resetAllContactsState");
        const contactType =
          type === "JobCandidates"
            ? "jobCandidate"
            : type.toLowerCase().slice(0, -1);
        this.$store.commit("setTypeOfContactToShow", contactType);
      }
    },

    navigateToAllContacts() {
      if (this.$route.path !== "/Contacts/AllContacts") {
        this.$store.dispatch("resetAllContactsState");
        localStorage.setItem("path", "/Contacts/AllContacts");
        this.$router.push("/Contacts/AllContacts");
      }
    },

    setAsActiveSubMenu(subMenu) {
      this.$store.commit("setActiveSubMenu", subMenu);
      localStorage.setItem("activeSubMenu", subMenu);
    },

    setAsActiveMenuText(subMenuText) {
      this.$store.commit("setActiveMenuText", subMenuText);
      localStorage.setItem("activeMenuText", subMenuText);
    },
  },
};
</script>
<style lang="scss" scoped>
.service {
  width: 100%;
  height: 50px;
  display: flex;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #2c3968;
    color: whitesmoke;
    box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
      rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
      rgba(0, 0, 0, 0.09) 0px 32px 16px;
  }
}

.service-name {
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 50px;

  i {
    font-size: 2.25rem;
  }

  p {
    font-size: 1.1rem;
  }
}

.selected-service {
  width: 100%;
  height: 50px;
  display: flex;
  cursor: pointer;
  background-color: #2c3968;
  color: whitesmoke;
  box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
    rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
    rgba(0, 0, 0, 0.09) 0px 32px 16px;
}

.sub-service {
  width: 100%;
  height: 35px;
  display: flex;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #2c3968;
    color: whitesmoke;
  }

  div {
    display: flex;
    align-items: center;
    padding-left: 50px;
    width: 100%;
    i {
      font-size: 1.5rem;
      margin: 0 20px;
    }
  }
}

.selected-sub-service {
  width: 100%;
  height: 35px;
  display: flex;
  cursor: pointer;
  background-color: #2c3968;
  color: whitesmoke;

  div {
    display: flex;
    align-items: center;
    padding-left: 50px;
    width: 100%;
    i {
      font-size: 1.5rem;
      margin: 0 20px;
    }
  }
}

.activeMenu {
  animation: slideInSubMenu 1s ease-out forwards;
}

@keyframes slideInSubMenu {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOutSubMenu {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}
</style>
