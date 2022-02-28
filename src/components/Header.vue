<template>
  <ul class="wrapper">
    <li
      v-for="item in titles"
      :key="item.name"
      :class="{ active: item.name === selected.name }"
      @click="select(item)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      titles: [
        { name: "区域分布" },
        { name: "重点企业分布" },
        { name: "重点产业分布" },
        { name: "楼宇经济" },
      ],
      selected: {
        name: "区域分布",
      },
    };
  },
  methods: {
    select(item) {
      this.selected = item;
      switch (item.name) {
        case "楼宇经济":
          this.$emit("setBuildsDialogVisible");
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  z-index: 999;
  width: vw(809);
  height: 53px;
  border: 1px solid #79eef3;
  position: absolute;
  left: 50%;
  top: 48px;
  transform: translateX(-50%);
  color: #fff;
  display: flex;
  background: rgba(15, 44, 87, 0.58);
  border-radius: 24px;
  white-space: nowrap;
  min-width: 520px;

  > li {
    height: 100%;
    width: 25%;
    text-align: center;
    line-height: 48px;
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
    -webkit-border-radius: 24px;
    -moz-border-radius: 24px;
    border-radius: 24px;

    &.active {
      background: rgba(121, 238, 243, 0.58);
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
