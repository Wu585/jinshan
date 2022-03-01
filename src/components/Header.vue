<template>
  <div class="header">
    <div class="content">金山地图中台展示系统</div>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>

<style lang="scss" scoped>
.header {
  z-index: 999;
  position: absolute;
  width: 100%;
  top: -25px;
  color: rgba(178, 227, 255, 1);
  background-image: url("../assets/images/header-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  height: 81px;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    margin-top: 20px;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: 2px;
  }
}
</style>
