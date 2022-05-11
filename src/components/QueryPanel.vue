<template>
  <div class="query-panel">
    <PanelLayout @close-panel="$emit('hideQueryPanel')">
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
            <span class="query-action" @click="onClickDraw">
              <img src="../assets/images/header/huizhi.png" alt="" />
            </span>
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
import { queryPoiBySpecial } from "@/apis/queryPoi";
import { addEntity } from "@/utils/entity";
import { transformGeometricPosition } from "@/utils/view";
import { nameOfImageMap } from "@/assets/js/entity-image";
import { clickQuery } from "@/utils/tools";

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
      allPoiData: []
    };
  },
  mounted() {
    this.addDrawHandler();
  },
  methods: {
    handleClickItem(item) {
      viewer.flyTo(entitiesArray.find(poi => poi.id === item.ID), {
        duration: 1
      });
    },
    addDrawHandler() {
      this.$nextTick(() => {
        let clampMode = 0;
        handlerPolygon = new Cesium.DrawHandler(
          viewer,
          Cesium.DrawMode.Polygon,
          clampMode
        );
        handlerPolygon.drawEvt.addEventListener(async (obj) => {
          this.pointArray = [];
          this.contentListArray = [];
          let positions = obj.object.positions;
          // 四个坐标点
          positions.forEach((item) => {
            // noinspection JSSuspiciousNameCombination
            this.pointArray.push({ x: item.y, y: item.z });
          });
          this.pointArray.push({ x: positions[0].y, y: positions[0].z });
          const res = await queryPoiBySpecial(this.pointArray, "POI_all", "JS_POI_type", "POI_type", arcgisIP_Port);
          this.allPoiData = res.data.features;
          const typesArray = [...new Set(res.data.features.map(item => item.fieldValues[30]))];
          this.dropDownData = [...typesArray].filter(poi => poi !== "公司企业" && poi !== "商业设施及服务" && poi !== "卫生社保");
          clickQuery();
        });
      });
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      cb(this.dropDownData);
    },
    handleSelect(item) {
      this.clear();
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
    }
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
