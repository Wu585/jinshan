<template>
  <div class="wrapper">
    <input v-model="value" type="text">
    <span>
      <img src="../assets/images/search.png" alt="">
    </span>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      value: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: absolute;
  z-index: 999;
  right: 160px;
  top: 115px;
  width: 257px;
  height: 30px;
  border: 1px solid #11D7F5;
  border-radius: 3px;
  display: flex;

  > input {
    height: 30px;
    width: 216px;
    background: rgba(26, 63, 98, 0.5);
    border: none;
    color: white;
    padding: 0 6px;
  }

  > span {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: rgba(17, 215, 245, 1);
  }
}
</style>
