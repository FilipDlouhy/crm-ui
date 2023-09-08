<template>
  <div class="tableview-bar-footer">
    <div class="footerDiv">
      <p>{{ page }}/{{ lastPage }}</p>
    </div>

    <div class="footerDiv">
      <i @click="decrementPage" class="material-icons"> arrow_back </i>
      <i @click="incrementPage" class="material-icons"> arrow_forward </i>
    </div>

    <div class="footerDivLarge">
      <p>{{ totalMessage }} {{ total }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: Number,
    lastPage: Number,
    total: Number,
    incrementPage: Function,
    decrementPage: Function,

    totalMessage: String,
  },
};
</script>

<style lang="scss" scoped>
.tableview-bar-footer {
  display: flex;
  width: 100%;
  height: 30px;
}

.footerDiv {
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

.footerDivLarge {
  width: 300px;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;

  p {
    font-size: 1rem;
    font-weight: lighter;
  }
}
</style>
