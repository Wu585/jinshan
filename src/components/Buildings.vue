<template>
  <div class="container">
    <header>户室信息</header>
    <div class="buildings"></div>
    <div class="buildingInfo"></div>
  </div>
</template>

<script>
export default {
  name: "Building",
};
</script>

<style lang="scss" scoped>
.container {
  z-index: 999;
  position: absolute;
  width: 300px;
  height: 600px;
  right: 12px;
  top: 200px;
  background: rgba(15, 44, 87, 1);
  padding: 0 14px;
  header {
    height: 50px;
  }
  .buildings {
    border: 1px solid red;
    height: 400px;
  }
  .buildingInfo {
    border: 1px solid red;
    height: 600-400-50px;
  }
}
</style>
