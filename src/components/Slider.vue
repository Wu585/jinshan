<template>
  <div class="slider-container">
    <div class="number">{{ number }}</div>
    <ul class="rooms">
      <li v-for="(item, index) in rooms" :key="index">
        <div>{{ item.roomNumber }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Slider",
  props: {
    number: {
      type: Number,
      required: true,
    },
    rooms: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.slider-container {
  z-index: 999;
  border: 1px solid green;
  display: flex;

  .number {
    color: #fff;
    background-image: url(../assets/images/back-circle.png);
    background-repeat: no-repeat;
    background-size: cover;
    width: 41px;
    height: 41px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }

  .rooms {
    display: flex;
    color: #fff;
    border: 1px solid red;
    align-items: center;
    justify-content: center;
    li {
      padding: 4px;
      > div {
        width: 45px;
        height: 35px;
        background: #0d3c66;
        color: #fff;
        border: 1px solid #749dd9;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
      }
    }
  }
}
</style>
