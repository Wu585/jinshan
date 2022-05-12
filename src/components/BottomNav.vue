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
import { flyTo, transformGeometricPosition } from "@/utils/view";
import { queryPoi } from "@/apis/queryPoi";
import { addBillboard, addDynamicWall, addLabel, resetEntitiesArray } from "@/utils/entity";
import { setAllLayersVisibleOfOneDataset, findLayer, findMapLayer, findAllLayersOfOneDataset } from "@/utils/layer";
import { clearBubble, initView } from "@/utils/tools";
import bus from "@/utils/bus";
import { getHouseInfoByHouseNumber, getSummaryInfoByHouseNumber } from "@/apis/information";

let entitiesArray = [];

export default {
  name: "BottomNav",
  data() {
    return {
      navArray: [
        {
          name: "防汛防台",
          img: require("../assets/images/bottomNav/fxft.png")
        },
        {
          name: "人房信息",
          img: require("../assets/images/bottomNav/zhyq.png"),
          link: ""
        },
        {
          name: "疫情防控",
          img: require("../assets/images/bottomNav/yqfk.png"),
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
      selected: null,
      description: {
        "居住人数": 0,
        "户籍人员": 0,
        "来沪人员": 0
      }
    };
  },
  mounted() {
    bus.$on("reset-bottom-nav", () => {
      this.selected = null;
    });
    setTimeout(() => {
      findLayer("A02").setQueryParameter({
        name: "A02",
        url: `${arcgisIP_Port}/iserver/services/data-rfsd/rest/data`,
        dataSourceName: "DemonArea",
        dataSetName: "A02_2"
      });
      viewer.pickEvent.addEventListener(this.cb);
    }, 2000);
  },
  methods: {
    async cb(info) {
      this.description["居住人数"] = ~~(+info["居住人数"]);
      this.description["户籍人员"] = ~~(+info["户籍人员"]);
      this.description["来沪人员"] = ~~(+info["来沪人员"]);
      const houseUrl = "上海市金山区山阳镇" + info["父对象"] + info["图层名称"];
      await this.$router.push({
        name: "Description"
      });
      this.$store.commit("SET_houseUrlEnd", info["父对象"] + info["图层名称"]);
      const res = await getSummaryInfoByHouseNumber(houseUrl);
      this.$store.commit("SET_peopleInfo", res.data.data[0]);
      const houseNumber = res.data.data[0].NO;
      const res1 = await getHouseInfoByHouseNumber(houseNumber);
      this.$store.commit("SET_houseArray", res1.data.data);
      bus.$emit("finish-loading");
    },
    async addA02ClickListener() {
      const layersNameArray = await findAllLayersOfOneDataset("精模三维模型");
      layersNameArray.forEach(name => {
        if (name !== "A02") {
          findLayer(name).selectEnabled = false;
        }
      });
    },
    async addBuildingLabel() {
      const { data } = await queryPoi("rfsd", "DemonArea", "A02_2", "SMID", arcgisIP_Port);
      const pointsArray = data.features.filter(item => +item.fieldValues[13] !== 0).map(item => {
        return {
          x: item.fieldValues[15],
          y: item.fieldValues[16],
          buildNum: item.fieldValues[13]
        };
      });
      pointsArray.forEach(item => {
        const { longitude, latitude } = transformGeometricPosition(item.x, item.y);
        entitiesArray.push(addLabel({ x: longitude, y: latitude, z: 70 }, item.buildNum));
      });
    },
    async onClick(item) {
      if (this.selected === item) {
        this.selected = null;
        await this.clearAllEffects();
        return;
      }
      this.selected = item;
      await this.clearAllEffects();
      if (item.name === "防汛防台") {
        this.$store.commit("SET_componentName", "fxft");
      } else if (item.name === "人房信息") {
        this.$store.commit("SET_componentName", "house");
        await this.addA02ClickListener();
        flyTo(-12474.4018649403, -54268.983091464266, 483.90533797442913, 5.939856468821999, -0.45023693649058627, 6.283185307179586);
        await setAllLayersVisibleOfOneDataset("精模三维模型", true);
        const res = await queryPoi("rfsd", "DemonArea", "区域", "SMID", arcgisIP_Port);
        res.data.features.forEach(item => {
          const map = {
            "万盛金邸西区": "./images/west.png",
            "万盛金邸东区": "./images/east.png"
          };
          const { center } = item.geometry;
          const { longitude, latitude } = transformGeometricPosition(center.x, center.y);
          const name = item.fieldValues[10];
          entitiesArray.push(addBillboard(longitude, latitude, map[name]));
          const pointsArray = [];
          const min = [];
          const max = [];
          const dayMaxmumHeights = [];
          const fenceHeight = 50;
          const wallSteep = 0.005;
          item.geometry.points.forEach(point => {
            const { longitude, latitude } = transformGeometricPosition(+point.x, +point.y);
            pointsArray.push(longitude, latitude);
            dayMaxmumHeights.push(0.1);
            min.push(0.1);
            max.push(fenceHeight);
          });
          console.log(pointsArray);
          entitiesArray.push(addDynamicWall(pointsArray, min, max, dayMaxmumHeights, fenceHeight, wallSteep));
        });
        await this.addBuildingLabel();
      } else if (item.name === "疫情防控") {
        initView();
        findMapLayer(item.name).show = true;
      }
    },
    async clearAllEffects() {
      await setAllLayersVisibleOfOneDataset("精模三维模型", false);
      resetEntitiesArray(entitiesArray);
      clearBubble();
      findMapLayer("疫情防控").show = false;
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
