<template>
  <ul class="bottom-nav">
    <li
      class="nav-wrapper"
      v-for="item in navArray"
      :key="item.name"
      @click="onClick(item)"
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
          name: "防汛防台",
          img: require("../assets/images/bottomNav/zhxf.png"),
          link: "http://10.233.250.25:8190/distback/dist/index.html#/"
        },
        {
          name: "人房信息",
          img: require("../assets/images/bottomNav/zhyq.png"),
          link: ""
        },
        {
          name: "智慧交通",
          img: require("../assets/images/bottomNav/zhjt.png"),
          link: ""
        },
        {
          name: "智慧旅游",
          img: require("../assets/images/bottomNav/zhly.png"),
          link: ""
        },
        {
          name: "智慧社区",
          img: require("../assets/images/bottomNav/zhsq.png"),
          link: ""
        }
      ],
      selected: null
    };
  },
  methods: {
    onClick(item) {
      this.selected = item;
      if (item.name === "球面对比") {
        window.open("http://10.233.250.25:8090/iserver/services/3D-CBD/rest/realspace/scenes/CBD.openrealspace", "_blank");
      }
    }
  }
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
      .nav-logo {
        background-image: url("../assets/images/bottomNav/bg-active.png");
      }

      span {
        color: #1cfbff;
      }
    }

    &:hover {
      .nav-logo {
        background-image: url("../assets/images/bottomNav/bg-active.png");
      }

      span {
        color: #1cfbff;
      }
    }

    &:not(:last-child) {
      margin-right: 83px;
    }

    .nav-logo {
      background-image: url("../assets/images/bottomNav/bg.png");
      width: 95px;
      height: 103px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    span {
      color: white;
      font-weight: 400;
      font-size: 18px;
    }
  }
}
</style>
