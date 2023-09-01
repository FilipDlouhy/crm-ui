<template>
  <div class="tableview-bar-dashboard">
    <div class="tableview-bar-dashboard-main-row">
      <div>
        <div><input type="checkbox" /></div>

        <p>User name</p>

        <span>
          <i class="material-icons"> expand_less </i>
          <i class="material-icons"> expand_more </i>
        </span>
      </div>

      <div>
        <p>Roles</p>

        <span>
          <i class="material-icons"> expand_less </i>
          <i class="material-icons"> expand_more </i>
        </span>
      </div>

      <div>
        <p>State</p>

        <span>
          <i class="material-icons"> expand_less </i>
          <i class="material-icons"> expand_more </i>
        </span>
      </div>

      <div>
        <p>Email</p>

        <span>
          <i class="material-icons"> expand_less </i>
          <i class="material-icons"> expand_more </i>
        </span>
      </div>
    </div>

    <div class="tableview-bar-dashboard-nomal-row">
      <div>
        <div><input type="checkbox" /></div>

        <p>Phillipe Augustus</p>
      </div>

      <div>
        <p>Augustus, Emperor,Augustus, Emperor,</p>
      </div>

      <div>
        <p>Pending</p>
      </div>

      <div>
        <p>Fi.dlo@emai.com</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tableview-bar-dashboard {
  width: 1645px;
  height: 820px;
  border-bottom: 2px solid #2c3968;
  border-top: 2px solid #2c3968;
  overflow: auto;
}

.tableview-bar-dashboard-main-row {
  width: 1645px; /* taking width larger then the parent's width */
  height: 40px;
  background-color: #2c3968;
  display: flex;
  flex: 0 0 auto;

  div {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    color: whitesmoke;
    font-size: 1.25rem;

    p {
      &:hover {
        cursor: pointer;
      }
    }

    div {
      width: 30px;
      height: 100%;
      border-right: none;
      display: flex;
      align-items: center;
      justify-content: center;

      input {
        cursor: pointer;
        width: 17.5px;
        height: 17.5px;
      }
    }

    span {
      width: 30px;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-left: 20px;
      i {
        font-size: 1.25rem;
        cursor: pointer;
        transition: 0.3s;
        &:hover {
          color: black;
        }
      }
    }
  }
}

.tableview-bar-dashboard-nomal-row {
  width: 100%;
  height: 35px;
  display: flex;
  border-bottom: 1px solid #2c3968;
  div {
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    color: black;
    font-size: 0.8rem;
    border-right: 1px solid #2c3968;
    padding: 1px;

    div {
      width: 30px;
      height: 100%;
      border-right: none;
      display: flex;
      align-items: center;
      justify-content: center;
      input {
        cursor: pointer;
        width: 15px;
        height: 15px;
      }
    }
  }
}
</style>
