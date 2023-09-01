<template>
  <div class="dashboard">
    <div class="side-bar">
      <div class="side-bar-logo"><p>TechTrack</p></div>

      <div
        :class="isServiceSelected ? 'selected-service' : 'service'"
        @click="toggleService"
      >
        <div class="service-name">
          <i class="material-icons"> person_outline </i>
          <p>Users</p>
        </div>
        <div class="service-submenu-icon">
          <i
            class="material-icons"
            :class="{ 'rotate-icon': isSubMenuOpen }"
            @click="toggleSubMenu"
          >
            arrow_back
          </i>
        </div>
      </div>

      <div
        :class="isSubServiceSelected ? 'selected-sub-service' : 'sub-service'"
        @click="toggleSubService"
      >
        <div>
          <i class="material-icons"> people_outline </i>
          <p>Users</p>
        </div>
      </div>

      <div
        :class="isSubServiceSelected ? 'selected-sub-service' : 'sub-service'"
        @click="toggleSubService"
      >
        <div>
          <i class="material-icons"> list_alt </i>
          <p>Roles</p>
        </div>
      </div>

      <div
        :class="isSubServiceSelected ? 'selected-sub-service' : 'sub-service'"
        @click="toggleSubService"
      >
        <div>
          <i class="material-icons"> history </i>
          <p>Audit</p>
        </div>
      </div>
    </div>

    <div class="main-bar">
      <div class="main-bar-top">
        <p>TechTrack/Users-Service/Users</p>
      </div>

      <div class="main-bar-add-buttons">
        <div class="main-bar-add-button-container">
          <button>
            User Add

            <i class="material-icons"> person_add </i>
          </button>
          <button>
            User Remove

            <i class="material-icons"> person_remove </i>
          </button>
        </div>

        <div class="main-bar-service-button-container">
          <button>
            Change to pending

            <i class="material-icons"> pending_actions </i>
          </button>
          <button>
            Change to Active

            <i class="material-icons"> how_to_reg </i>
          </button>

          <button>
            Change to Block

            <i class="material-icons"> how_to_reg </i>
          </button>

          <button>
            Add Role
            <i class="material-icons"> person_remove </i>
          </button>

          <button>
            Remove Role
            <i class="material-icons"> person_remove </i>
          </button>
        </div>
      </div>
      <table-view />
      <table-view-footer />
    </div>
  </div>
</template>

<script>
import TableView from "./Core/TableView.vue";
import TableViewFooter from "./Core/TableViewFooter.vue";

export default {
  components: {
    TableView,
    TableViewFooter,
  },

  data() {
    return {
      isSubMenuOpen: false,
      isServiceSelected: false,
      isSubServiceSelected: false,
    };
  },
  methods: {
    toggleSubMenu() {
      this.isSubMenuOpen = !this.isSubMenuOpen;
      this.isServiceSelected = !this.isSubMenuOpen;
    },

    toggleService() {
      this.isServiceSelected = !this.isServiceSelected;
    },

    toggleSubService() {
      this.isSubServiceSelected = !this.isSubServiceSelected;
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: white;
}

.side-bar {
  width: 275px;
  border-right: 1px solid #2c3968;
  height: 100%;
}

.side-bar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #2c3968;

  p {
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
  }
}

.service {
  width: 100%;
  height: 50px;
  display: flex;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #2c3968;
    color: whitesmoke;
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

.service-submenu-icon {
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  i {
    font-size: 1.25rem;
    transition: 0.3s;
    &:hover {
      transform: rotate(-90deg);
    }
  }
}

.rotate-icon {
  transform: rotate(-90deg);
}

.selected-service {
  width: 100%;
  height: 50px;
  display: flex;
  cursor: pointer;
  background-color: #2c3968;
  color: whitesmoke;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
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

.main-bar {
  height: 100%;
  width: 86%;
}

.main-bar-top {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-weight: 600;
  color: rgb(109, 106, 106);
  border-bottom: 1px solid #2c3968;
}

.main-bar-add-buttons {
  width: 100%;
  height: 60px;
  padding-left: 50px;
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
    width: 180px;
    height: 30px;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 30px;
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
