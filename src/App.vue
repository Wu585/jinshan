<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import "~@/assets/styles/reset.scss";

.header-popover-content {
  > li {
    display: flex;
    align-items: center;
    color: white;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
