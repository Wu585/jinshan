<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "InfoContainer",
};
</script>

<style lang="scss" scoped>
.container {
  z-index: 999;
  width: 353px;
  height: 206px;
  background-image: url(../assets/images/container.png);
  position: absolute;
}
</style>
