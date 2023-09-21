<template>
  <div>
    <div
      v-if="userRights.includes('seeUserService')"
      :class="activeMenu === 'users' ? 'selected-service' : 'service'"
      @click="setUsersAsActiveMenu"
    >
      <div class="service-name">
        <i class="material-icons"> person_outline </i>
        <p>Users</p>
      </div>
    </div>

    <div v-if="activeMenu === 'users'" class="activeMenu">
      <div
        :class="
          activeSubMenu === 'users' ? 'selected-sub-service' : 'sub-service'
        "
        @click="
          setAsActiveSubMenu('users'),
            setAsActiveMenuText('/User-Service/Users')
        "
      >
        <div v-if="userRights.includes('seeUsers')" @click="navigateToUsers">
          <i class="material-icons"> people_outline </i>
          <p>Users</p>
        </div>
      </div>

      <div
        :class="
          activeSubMenu === 'roles' ? 'selected-sub-service' : 'sub-service'
        "
        @click="
          setAsActiveSubMenu('roles'),
            setAsActiveMenuText('/User-Service/Roles')
        "
      >
        <div v-if="userRights.includes('seeRoles')" @click="navigateToRoles">
          <i class="material-icons"> list_alt </i>
          <p>Roles</p>
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
    setUsersAsActiveMenu() {
      if (this.activeMenu !== "users") {
        localStorage.setItem("activeMenu", "users");
        this.$store.commit("setActiveMenu", "users");
        this.$store.commit("setActiveSubMenu", "users");
        localStorage.setItem("path", "/Users");
        this.$router.push("/Users");
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

    navigateToUsers() {
      if (this.$route.path !== "/Users") {
        this.$router.push("/Users");

        localStorage.setItem("path", "/Users");
      }
    },

    navigateToRoles() {
      if (this.$route.path !== "/Roles") {
        this.$router.push("/Roles");
        localStorage.setItem("path", "/Roles");
      }
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
