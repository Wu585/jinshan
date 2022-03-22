<template>
  <div class="query-panel">
    <PanelLayout @close-panel="$emit('hideQueryPanel')">
      <template v-slot:title> 框选查询 </template>
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
                <span>{{ item.name }}</span>
              </template>
            </el-autocomplete>
            <span class="query-action" @click="onClickDraw">
              <img src="../assets/images/header/huizhi.png" alt="" />
            </span>
          </div>
          <ul class="query-panel-content-list custom-scroll">
            <li v-for="item in contentListArray" :key="item.name">
              {{ item.name }}
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
import layersTreeJson from "../assets/json/layer.json";
import { dataServiceUrlHashmap } from "@/assets/js/dataService-url";
import { queryPoiBySpecial } from "@/apis/queryPoi";
import { addEntity } from "@/utils/entity";
import { transformGeometricPosition } from "@/utils/view";
import { nameOfImageMap } from "@/assets/js/entity-image";

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
    };
  },
  mounted() {
    this.addDrawHandler();
    layersTreeJson.filter((item) => {
      item.children.filter((child) => {
        child.children.forEach((x) => {
          x?.type === "poi" && this.dropDownData.push(x);
        });
      });
    });
  },
  methods: {
    addDrawHandler() {
      this.$nextTick(() => {
        let clampMode = 0;
        handlerPolygon = new Cesium.DrawHandler(
          viewer,
          Cesium.DrawMode.Polygon,
          clampMode
        );
        handlerPolygon.drawEvt.addEventListener((obj) => {
          this.pointArray = [];
          this.contentListArray = [];
          let positions = obj.object.positions;
          // 四个坐标点
          positions.forEach((item) => {
            // noinspection JSSuspiciousNameCombination
            this.pointArray.push({ x: item.y, y: item.z });
          });
          this.pointArray.push({ x: positions[0].y, y: positions[0].z });
          const dataServiceItem = dataServiceUrlHashmap.find(
            (item) => item.dataSets.indexOf(this.item.datasetName[0]) >= 0
          );
          this.item.datasetName.map(async (dataset) => {
            const res = await queryPoiBySpecial(
              this.pointArray,
              dataServiceItem.serviceName,
              dataServiceItem.dataSource,
              dataset
            );
            res.data.features.forEach((point) => {
              // 处理description信息
              const attrObj = {};
              point.fieldNames.forEach((key, index) => {
                if (key.indexOf("SM") < 0 && key.indexOf("F") < 0) {
                  attrObj[key] = point.fieldValues[index];
                }
              });
              const { longitude, latitude } = transformGeometricPosition(
                point.geometry.center.x,
                point.geometry.center.y
              );
              let imagePath;
              if (point.fieldNames.indexOf("点位名") >= 0) {
                // 摄像头
                console.log("camera");
                this.contentListArray.push({
                  name: point.fieldValues[4],
                });
                imagePath =
                  "./images/queryEntities/" +
                  nameOfImageMap["治安视频"] +
                  ".png";
              } else {
                // POI
                console.log("poi");
                this.contentListArray.push({
                  name: point.fieldValues[7],
                });
                imagePath =
                  "./images/queryEntities/" +
                  nameOfImageMap[this.state] +
                  ".png";
              }
              entitiesArray.push(
                addEntity(imagePath, longitude, latitude, attrObj)
              );
            });
          });
        });
      });
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      cb(this.dropDownData);
    },
    handleSelect(item) {
      this.item = item;
      this.state = item.name;
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
    },
  },
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
