<template>
  <ul class="bottom-nav">
    <li
      class="nav-wrapper"
      v-for="item in navArray"
      :key="item.name"
      @click="selected = item"
      :class="{ active: selected && item.name === selected.name }"
    >
      <div class="nav-logo">
        <img :src="item.img" alt="" />
      </div>
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "BottomNav",
  data() {
    return {
      navArray: [
        {
          name: "智慧消防",
          img: require("../assets/images/bottomNav/zhxf.png"),
        },
        {
          name: "智慧园区",
          img: require("../assets/images/bottomNav/zhyq.png"),
        },
        {
          name: "智慧交通",
          img: require("../assets/images/bottomNav/zhjt.png"),
        },
        {
          name: "智慧旅游",
          img: require("../assets/images/bottomNav/zhly.png"),
        },
        {
          name: "智慧社区",
          img: require("../assets/images/bottomNav/zhsq.png"),
        },
      ],
      selected: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.bottom-nav {
  position: absolute;
  z-index: 999;
  bottom: 37px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;

  > .nav-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;

    &.active {
      > .nav-logo {
        background-image: url("../assets/images/bottomNav/bg-active.png");
      }

      > span {
        color: #1cfbff;
      }
    }

    &:hover {
      > .nav-logo {
        background-image: url("../assets/images/bottomNav/bg-active.png");
      }

      > span {
        color: #1cfbff;
      }
    }

    &:not(:last-child) {
      margin-right: 83px;
    }

    > .nav-logo {
      background-image: url("../assets/images/bottomNav/bg.png");
      width: 95px;
      height: 103px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    > span {
      color: white;
      font-weight: 400;
      font-size: 18px;
    }
  }
}
</style>
