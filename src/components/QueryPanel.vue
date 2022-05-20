<template>
  <div class="query-panel">
    <PanelLayout @close-panel="$store.commit('SET_componentName','')">
      <template v-slot:title> 框选查询</template>
      <template v-slot:content>
        <div class="query-panel-content">
          <div class="query-panel-content-header">
            <el-autocomplete
              v-model="state"
              placeholder="请选择"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <span>{{ item }}</span>
              </template>
            </el-autocomplete>
          </div>
          <ul class="query-panel-content-list custom-scroll">
            <li v-for="item in contentListArray" :key="item" @click="handleClickItem(item)">
              {{ item.fieldValues[26] }}
            </li>
          </ul>
        </div>
      </template>
    </PanelLayout>
  </div>
</template>

<!--suppress JSSuspiciousNameCombination -->
<script>
import PanelLayout from "@/components/PanelLayout";
import { queryByCircle } from "@/apis/queryPoi";
import { addEntity } from "@/utils/entity";
import { transformGeometricPosition } from "@/utils/view";
import { nameOfImageMap } from "@/assets/js/entity-image";
import { clickQuery } from "@/utils/tools";
import bus from "@/utils/bus";

let handlerPolygon;
let entitiesArray = [];

export default {
  name: "QueryPanel",
  components: { PanelLayout },
  data() {
    return {
      dropDownData: [],
      state: "",
      pointArray: [],
      item: {},
      contentListArray: [],
      allPoiData: [],
      circleCenter: [],
      radius: 0,
      active: false
    };
  },
  mounted() {
    // this.addDrawHandler();
    bus.$on("active-handler", () => {
      this.active = false;
      this.clear();
    });
    bus.$on("clear", () => {
      this.active = true;
      this.clear();
    });
    let activeShapePoints = [];
    let activeShape;
    let floatingPoint;
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    //鼠标左键
    handler.setInputAction((event) => {
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      if (this.active) return;
      const earthPosition = viewer.scene.pickPosition(event.position);
      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          floatingPoint = this.createPoint(earthPosition);
          activeShapePoints.push(earthPosition);
          const dynamicPositions = new Cesium.CallbackProperty(function() {
            return activeShapePoints;
          }, false);
          activeShape = drawShape(dynamicPositions);//绘制动态图
        }
        activeShapePoints.push(earthPosition);
        this.circleCenter.push({ x: earthPosition.y, y: earthPosition.z });
        this.createPoint(earthPosition);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    const drawShape = (positionData) => {
      const value = typeof positionData.getValue === "function" ? positionData.getValue(0) : positionData;
      const circleEntity = viewer.entities.add({
        position: activeShapePoints[0],
        name: "Blue translucent, rotated, and extruded ellipse with outline",
        type: "Selection tool",
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(() => {
            //半径 两点间距离
            const r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
            this.radius = r;
            return r ? r : r + 1;
          }, false),
          semiMajorAxis: new Cesium.CallbackProperty(function() {
            const r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
            return r ? r : r + 1;
          }, false),
          material: Cesium.Color.BLUE.withAlpha(0.3),
          outline: true
        }
      });
      entitiesArray.push(circleEntity);
      return circleEntity;
    };

    //鼠标移动
    handler.setInputAction(function(event) {
      if (Cesium.defined(floatingPoint)) {
        const newPosition = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          floatingPoint.position.setValue(newPosition);
          activeShapePoints.pop();
          activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    const terminateShape = () => {
      activeShapePoints.pop();//去除最后一个动态点
      if (activeShapePoints.length) {
        drawShape(activeShapePoints).ellipse._semiMajorAxis.getValue();//绘制最终图
      }
      viewer.entities.remove(floatingPoint);//去除动态点图形（当前鼠标点）
      viewer.entities.remove(activeShape);//去除动态图形
      floatingPoint = undefined;
      activeShape = undefined;
      activeShapePoints = [];
    };

    handler.setInputAction(async () => {
      terminateShape();
      const res = await queryByCircle([this.circleCenter[0]], "POI_all", "JS_POI_type",
        "POI_type", this.radius, arcgisIP_Port);
      this.allPoiData = res.data.features;
      const typesArray = [...new Set(res.data.features.map(item => item.fieldValues[30]))];
      this.dropDownData = [...typesArray].filter(poi => poi !== "公司企业" && poi !== "商业设施及服务" && poi !== "卫生社保");
      clickQuery();
      this.active = true;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  },
  methods: {
    createPoint(worldPosition) {
      const point = viewer.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });
      entitiesArray.push(point);
      return point;
    },
    handleClickItem(item) {
      viewer.flyTo(entitiesArray.find(poi => poi.id === item.ID), {
        duration: 1
      });
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      cb(this.dropDownData);
    },
    handleSelect(item) {
      this.item = item;
      this.state = item;
      const currentPois = this.allPoiData.filter(poi => poi.fieldValues[30] === item);
      this.contentListArray = currentPois;
      currentPois.forEach(poi => {
        const attrObj = {};
        const nameIndex = poi.fieldNames.indexOf("NAME");
        const addressIndex = poi.fieldNames.indexOf("ADDRESS");
        attrObj["名称"] = poi.fieldValues[nameIndex];
        if (addressIndex && poi.fieldValues[addressIndex]) {
          attrObj["地址"] = poi.fieldValues[addressIndex];
        }
        const { longitude, latitude } = transformGeometricPosition(poi.geometry.center.x, poi.geometry.center.y);
        let imagePath =
          "./images/queryEntities/" +
          nameOfImageMap[this.state] +
          ".png";
        entitiesArray.push(addEntity(imagePath, longitude, latitude, JSON.stringify(attrObj), "", poi.ID));
      });
    },
    onClickDraw() {
      handlerPolygon.activate();
    },
    clear() {
      handlerPolygon && handlerPolygon.clear();
      entitiesArray.forEach((entity) => {
        viewer.entities.remove(entity);
      });
      entitiesArray = [];
      this.dropDownData = [];
      this.contentListArray = [];
      this.state = "";
      this.circleCenter = [];
      this.radius = 0;
    }
  },
  beforeDestroy() {
    this.clear();
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  height: 28px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.query-panel {
  position: absolute;
  z-index: 999;
  right: 8px;
  top: 213px;

  .query-panel-content {
    &-list {
      padding-top: 12px;
      overflow: auto;
      height: 400px;

      > li {
        padding: 6px 0;
        border-bottom: 1px solid grey;
      }
    }

    &-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .query-action {
      width: 36px;
      height: 28px;
      background: rgb(11, 188, 215);
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        cursor: pointer;
      }

      > img {
        height: 20px;
        width: 20px;
      }
    }
  }
}
</style>
