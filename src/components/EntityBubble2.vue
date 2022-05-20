<template>
  <div class="bubble-wrapper">
    <i class="el-icon-close" @click="close"></i>
    <ul class="attr-info custom-scroll">
      <li v-for="(val, key) in description" :key="key" style="padding: 3px 2px;">
        <span class="key">{{ key }}: </span>
        <span>{{ val }}</span>
      </li>
    </ul>
    <div class="query">
      <span class="text">查看周边: </span>
      <Select :options="options" @change="onChange" />
      <ul class="logo">
        <li v-for="(item,index) in imageList" :key="index" :class="{active:item.active}" @click="toggle(item,undefined)">
          <img :src="item.imagePath" alt="">
          <span style="padding: 0 4px">{{ item.number }}</span>
        </li>
      </ul>
    </div>
    <ul class="list custom-scroll">
      <li v-for="item in imageList[0].infoList" :key="item.indexCode">
        <img src="../assets/images/bubble/pg-1.png" alt="">
        <span>{{ item.name }}</span>
        <img class="play" src="../assets/images/bubble/play.png" alt="">
      </li>
      <li v-for="(item,index) in imageList[1].infoList" :key="index">
        <img src="../assets/images/bubble/pg-2.png" alt="">
        <span>{{ item.name }}</span>
        <img class="play" src="../assets/images/bubble/play.png" alt="">
      </li>
      <li v-for="(item,index) in imageList[2].infoList" :key="index">
        <img src="../assets/images/bubble/pg-3.png" alt="">
        <span>{{ item.name }}</span>
        <img class="play" src="../assets/images/bubble/play.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
import { ArraySet, clearFxftBubble } from "@/utils/tools";
import Select from "@/components/Select";
import { circle, pointsWithinPolygon, points, point } from "@turf/turf";
import { getAllCameraPoints } from "@/apis/information";
import { transformGeometricPosition } from "@/utils/view";
import { queryByCircle } from "@/apis/queryPoi";
import { mapState } from "vuex";
import { addEntity, resetEntitiesArray } from "@/utils/entity";

const entity = [
  { name: "摄像头", entityArray: [] },
  { name: "安置点", entityArray: [] },
  { name: "防汛物资", entityArray: [] }
];

export default {
  name: "EntityBubble2",
  components: { Select },
  data() {
    return {
      options: [
        {
          value: "500",
          label: "500米"
        },
        {
          value: "1000",
          label: "1000米"
        },
        {
          value: "1500",
          label: "1500米"
        },
        {
          value: "2000",
          label: "2000米"
        }],
      imageList: [
        {
          name: "摄像头",
          imagePath: require("../assets/images/bubble/pg-1.png"),
          number: 0,
          active: true,
          dateSet: "camera",
          infoList: [],
          entityImagePath: "./images/circle-camera.png"
        },
        {
          name: "防汛物资",
          imagePath: require("../assets/images/bubble/pg-2.png"),
          number: 0,
          active: true,
          dateSet: "yjwz",
          infoList: [],
          entityImagePath: "./images/circle-camera.png"
        },
        {
          name: "安置点",
          imagePath: require("../assets/images/bubble/pg-3.png"),
          number: 0,
          active: true,
          dateSet: "azd",
          infoList: [],
          entityImagePath: "./images/circle-camera.png"
        }
      ],
      currentValue: 500
    };
  },
  props: {
    description: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      currentClickPoint: state => state.system.currentClickPoint
    })
  },
  watch: {
    currentClickPoint: {
      deep: true,
      handler() {
        this.onChange(this.currentValue);
      }
    }
  },
  methods: {
    close() {
      clearFxftBubble();
    },
    onChange(value) {
      this.currentValue = value;
      this.imageList.forEach(item => {
        resetEntitiesArray(entity.find(x => x.name === item.name).entityArray);
        item.active = true;
        this.toggle({ name: item.name }, item.active);
      });
    },
    async turfQuery() {
      const { x, y } = this.$store.getters.currentClickPoint;
      const center = [x, y];
      const radius = 500;
      const options = { units: "meters", properties: { foo: "bar" } };
      const circlePolygon = circle(center, radius, options);
      const res = await getAllCameraPoints();
      console.log("res---all--camera");
      console.log(res);
      const turfPoints = [];
      res.data.data.list.forEach(item => {
        const { x, y } = item;
        const { longitude, latitude } = transformGeometricPosition(+x, +y);
        turfPoints.push([longitude, latitude]);
      });
      const xxx = point([-75.343, 39.984]);
      console.log("xxx");
      console.log(xxx);
      console.log("points(turfPoints)");
      console.log(points(turfPoints));
      const ptsWithin = pointsWithinPolygon(points(turfPoints), circlePolygon);
      console.log("ptsWithin");
      console.log(ptsWithin);
    },
    async toggle({ name }, visible) {
      const { x, y } = this.$store.getters.currentClickPoint;
      const center = [{ x, y }];
      const selected = this.imageList.find(item => item.name === name);
      if (visible !== undefined) {
        selected.active = visible;
      } else {
        selected.active = !selected.active;
      }
      const entityItem = entity.find(item => item.name === selected.name);
      if (selected.active) {
        const res = await queryByCircle(center, "fxft", "jinshan", selected.dateSet, this.currentValue, arcgisIP_Port);
        console.log("res---fxft");
        console.log(res);
        if (selected.name === "摄像头") {
          selected.infoList = res.data.features.map(item => ({
            indexCode: item.fieldValues[8],
            name: item.fieldValues[9],
            point: item.geometry.center
          }));
          selected.infoList = ArraySet(selected.infoList, "indexCode");
        } else if (selected.name === "防汛物资") {
          selected.infoList = res.data.features.map(item => ({
            name: item.fieldValues[9],
            point: item.geometry.center
          }));
        }
        selected.number = selected.infoList.length;
        selected.infoList.forEach(item => {
          const { longitude, latitude } = transformGeometricPosition(item.point.x, item.point.y);
          entityItem.entityArray.push(addEntity(selected.entityImagePath, longitude, latitude));
        });
      } else {
        selected.infoList = [];
        resetEntitiesArray(entityItem.entityArray);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.bubble-wrapper {
  z-index: 999;
  color: white;
  width: 379px;
  height: 329px;
  background-image: url("../assets/images/bubble2-bg.png");
  background-size: 100% 100%;
  padding-top: 8px;
  position: absolute;
  top: -329px;
  left: 0;

  .el-icon-close {
    font-size: 16px;
    position: absolute;
    right: 8px;
    top: 16px;
    cursor: pointer;
  }

  .attr-info {
    padding: 0 12px;
    height: 132px;
    width: 100%;
    border-bottom: 2px solid #17dde3;
    margin-top: 28px;
    overflow: auto;
  }

  .query {
    padding: 10px 6px;
    display: flex;
    align-items: center;

    .text {
      height: 28px;
      line-height: 28px;
      padding: 0 6px;
      white-space: nowrap;
    }

    .logo {
      display: inline-flex;

      > li {
        width: 58px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(17, 78, 108, 1);
        margin-left: 10px;
        cursor: pointer;

        &.active {
          box-shadow: 0 0 3px 3px rgba(235, 225, 33, 0.56);
        }

      }
    }
  }

  .list {
    width: 100%;
    height: 100px;
    padding: 0 12px;
    overflow: auto;

    > li {
      height: 36px;
      width: 100%;
      border-bottom: 1px solid grey;
      line-height: 36px;
      display: flex;
      align-items: center;
      position: relative;

      span {
        padding: 0 6px;
      }

      .play {
        position: absolute;
        right: 0;
        cursor: pointer;
      }
    }
  }
}
</style>
