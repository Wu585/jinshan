<template>
  <div class="header">
    <div class="content" @click="setView">金山区地图中台展示系统</div>
  </div>
</template>

<script>
import { setViewport } from "@/utils/view";

export default {
  name: "Header",
  methods: {
    setView() {
      setViewport(
        -44284.506684487686,
        -35422.487200479954,
        130.52507693413645,
        2.416732144074675,
        -0.04451864534215688,
        6.283185307179586
      );
    },
  },
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

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
