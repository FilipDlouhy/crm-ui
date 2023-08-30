<template>
  <div class="dashboard">
    <div class="side-bar">
      <div class="side-bar-logo"><p>TechTrack</p></div>
      <div class="service">
        <i class="fas fa-user"></i>
        <p>Users</p>
      </div>
    </div>

    <div class="side-bar2"></div>

    <div class="main-bar">
      <div class="main-bar-top">
        <div class="main-bar-top-menu-container">
          <div class="main-bar-top-menu-item">
            <i class="fas fa-users"></i>
            <p>Users</p>
          </div>
          <div class="main-bar-top-menu-item">
            <i class="fas fa-user-tag"></i>
            <p>Roles</p>
          </div>
          <div class="main-bar-top-menu-item">
            <i class="fas fa-database"></i>
            <p>Audit</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.side-bar {
  width: 10%;
  height: 100%;
  background: radial-gradient(
    circle at 10% 20%,
    #1e3b5a 0%,
    // Deep blue
    #0e1e2e 100.2% // Darker deep blue
  );
}

.side-bar-logo {
  width: 100%;
  height: 7%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid whitesmoke;
  p {
    font-size: 1.75rem;
    color: whitesmoke;
    letter-spacing: 2px;
  }
}

.service {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  transition: 0.3s;
  i {
    font-size: 1.75rem;
    color: white;
  }

  p {
    font-size: 1.25rem;
    color: white;
  }

  &:hover {
    background-color: white;
    i {
      color: #0e1e2e;
    }

    p {
      color: #0e1e2e;
    }
  }
}

.main-bar {
  width: 90%;
  height: 100%;
  background-color: white;
}

.main-bar-top {
  width: 100%;
  height: 7%;
  border-bottom: 2px solid whitesmoke;
  background: radial-gradient(circle at 10% 20%, #1e3b5a 0%, #0e1e2e 100.2%),
    linear-gradient(to bottom, #0e1e2e, #000);
}

.main-bar-top-menu-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.main-bar-top-menu-item {
  width: 250px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-around;
  cursor: pointer;
  transition: 0.4s;

  i {
    font-size: 1.75rem;
    color: white;
  }

  p {
    font-size: 1.25rem;
    color: white;
  }

  &:hover {
    background-color: #577096;
    i {
      color: whitesmoke;
    }

    p {
      color: whitesmoke;
    }
  }
}
</style>
