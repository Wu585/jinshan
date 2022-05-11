<template>
  <div class="weather-wrapper">

  </div>
</template>

<script>
export default {
  name: "Weather",
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.weather-wrapper {
  position: absolute;
  z-index: 999;
  width: 100px;
  height: 20px;
  border: 1px solid red;
  left: 300px;
}
</style>
