<template>
  <div class="tableview-bar-footer">
    <div><p>2/50</p></div>

    <div>
      <i class="material-icons"> arrow_back </i>
      <i class="material-icons"> arrow_forward </i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tableview-bar-footer {
  display: flex;
  width: 100%;
  height: 30px;

  div {
    width: 100px;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;

    p {
      font-size: 1.25rem;
      font-weight: bold;
    }

    i {
      font-weight: bold;
      margin: 0 5px;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        color: #2c3968;
      }
    }
  }
}
</style>
