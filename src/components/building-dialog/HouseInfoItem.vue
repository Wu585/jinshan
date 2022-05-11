<template>
  <div class="wrapper">
    <span class="title">{{ title }}</span>
    <span class="content">{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: "HouseInfoItem",
  props: {
    title: String,
    content: String
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  border-bottom: 1px solid #fff;

  .title {
    width: 137px;
    height: 42px;
    background: #007fd0;
    line-height: 42px;
    text-align: center;
  }

  .content {
    background: #0A4878;
    line-height: 42px;
    padding-left: 12px;
    flex: 1;
    color: #06CCFD;
  }
}
</style>
