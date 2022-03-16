<template>
  <ul class="map">
    <li
      v-for="item in mapList"
      :key="item.type"
      @click="changeMap(item)"
      :class="{ active: item.type === selectType }"
    >
      <span :class="{ active: item.type === selectType }">
        {{ item.type }}
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Map",
  data() {
    return {
      mapList: [
        { type: "矢量" },
        { type: "影像" },
        { type: "影像1" },
        { type: "影像2" },
      ],
      selectType: "影像",
    };
  },
  methods: {
    changeMap({ type }) {
      this.selectType = type;
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  position: absolute;
  right: 9px;
  bottom: 14px;
  z-index: 999;
  padding: 6px 6px;
  background: rgba(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;

  &:hover {
    li:not(:last-child) {
      margin-right: 16px;
    }
  }

  li {
    width: 107px;
    height: 75px;
    background: url("../assets/images/map/img.png") no-repeat;
    position: relative;
    transition: all 0.3s;

    &.active {
      z-index: 99999;
    }

    &:hover {
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-right: -100-7px;
    }

    span {
      color: #333;
      width: 43px;
      height: 22px;
      background: white;
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 0;
      text-align: center;
      line-height: 22px;
      font-weight: bold;
      font-size: 14px;

      &.active {
        background: #00c3ff;
        color: white;
      }
    }
  }
}
</style>
