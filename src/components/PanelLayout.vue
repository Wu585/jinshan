<template>
  <div class="panel-wrapper">
    <div class="panel-title">
      <slot name="title"></slot>
      <i class="el-icon-close" @click="$emit('close-panel')"></i>
    </div>
    <div class="panel-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PanelLayout",
};
</script>

<style lang="scss" scoped>
.panel-wrapper {
  width: 331px;
  height: 535px;
  background-image: url("../assets/images/layersTree/layer-tree-bg.png");
  background-size: 100% 100%;
  padding: 8px 20px;

  .panel-title {
    color: white;
    padding: 12px 0;
    border-bottom: 1px solid #4bc1ff;
    font-weight: 600;
    font-size: 18px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .el-icon-close {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .panel-content {
    color: white;
  }
}
</style>
