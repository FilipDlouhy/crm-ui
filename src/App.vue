<template>
  <DashboardContainer />
</template>

<script>
import DashboardContainer from "./Dashboard/Components/DashboardContainer.vue";

export default {
  components: {
    DashboardContainer, // Register the imported component
  },
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Roboto Slab", sans-serif;
}
</style>
