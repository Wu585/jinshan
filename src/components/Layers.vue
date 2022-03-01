<template>
  <div class="layers-container">
    <div class="title">图层</div>
    <el-tree
      :data="defaultData"
      :props="defaultProps"
      :highlight-current="false"
      node-key="id"
      show-checkbox
      @check-change="handleCheckChange"
      @node-click="onNodeClick"
      :default-checked-keys="defaultDataKey"
      :accordion="true"
    ></el-tree>
    <div class="control">
      <div class="tab"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  setViewportByLonAndLat,
  transformGeometricPosition,
} from "@/utils/view";
import { queryPoi } from "@/apis/queryPoi";
import { addEntity } from "@/utils/entity";

export default {
  name: "Layers",
  data() {
    return {
      currentViewport: "jm",
      defaultData: [
        {
          id: 1,
          label: "POI",
          children: [
            { id: 3, label: "公用设施", traceLayer: "traceLayer1" },
            { id: 4, label: "教育文化", traceLayer: "traceLayer2" },
            { id: 5, label: "金融保险", traceLayer: "traceLayer3" },
            { id: 6, label: "农林牧渔业", traceLayer: "traceLayer4" },
            { id: 7, label: "商业设施及服务", traceLayer: "traceLayer5" },
            { id: 8, label: "卫生社保", traceLayer: "traceLayer6" },
          ],
        },
        {
          id: 2,
          label: "摄像头",
          children: [
            { id: 21, label: "亭林镇", traceLayer: "traceLayer7" },
            { id: 22, label: "吕巷镇", traceLayer: "traceLayer8" },
            { id: 23, label: "山阳镇", traceLayer: "traceLayer9" },
            { id: 24, label: "廊下镇", traceLayer: "traceLayer10" },
            { id: 25, label: "张堰镇", traceLayer: "traceLayer11" },
            { id: 26, label: "朱泾镇", traceLayer: "traceLayer12" },
            { id: 27, label: "枫泾镇", traceLayer: "traceLayer13" },
            { id: 28, label: "漕泾镇", traceLayer: "traceLayer14" },
            { id: 29, label: "石化街道", traceLayer: "traceLayer15" },
            { id: 30, label: "金山卫镇", traceLayer: "traceLayer16" },
            { id: 31, label: "金山工业区", traceLayer: "traceLayer17" },
          ],
        },
        {
          id: 3,
          label: "模型",
          children: [
            { id: 18, label: "BIM" },
            { id: 9, label: "精模" },
            { id: 10, label: "白模", layerName: ["Baimo_SH@JS"] },
          ],
        },
        {
          id: 4,
          label: "底图",
          children: [
            { id: 11, label: "矢量底图" },
            { id: 12, label: "影像底图" },
            { id: 13, label: "暗色底图" },
            { id: 14, label: "政务底图" },
            { id: 15, label: "金山区边界底图" },
            { id: 16, label: "水系底图" },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultDataKey: [3, 11, 12, 13, 14, 15, 16],
    };
  },
  methods: {
    handleCheckChange(data, checked) {
      const { label, layerName, traceLayer } = data;
      // const entityTreeDataArray = this.defaultData.filter(item => item.label === "POI" || item.label === "摄像头");
      // entityTreeDataArray.map()
      // console.log('eneityTreeDataArray');
      // console.log(entityTreeDataArray);
      /*if (label !== "精模") {
        this.currentViewport = "bm";
        if (checked) {
          setViewport(-42632.91500853168, -37128.53534274688);
        }
      }*/
      switch (label) {
        // case ["公用设施", "金融保险", "教育文化", "农林牧渔业", "商业设施及服务", "卫生社保"].indexOf(label) >= 0:
        case "公用设施":
        case "金融保险":
        case "教育文化":
        case "商业设施及服务":
        case "卫生社保":
        case "农林牧渔业":
          if (window[traceLayer].entities._entities._array.length === 0) {
            queryPoi("JS_POI", label).then((res) => {
              res.data.features.forEach((item) => {
                // const indexOfName = item.fieldNames.indexOf("NAME");
                // const name = item.fieldValues[indexOfName];
                const { x, y } = item.geometry.center;
                const { longitude, latitude } = transformGeometricPosition(
                  x,
                  y
                );
                window[traceLayer].entities.add(
                  addEntity(`/images/${label}.png`, longitude, latitude)
                );
              });
            });
          } else {
            window[traceLayer].entities.show = checked;
          }
          break;
        /*case ["亭林镇", "吕巷镇", "山阳镇",
          "廊下镇", "张堰镇", "朱泾镇", "枫泾镇", "漕泾镇", "石化街道", "金山卫镇", "金山工业区"].indexOf(label) >= 0:*/
        case "亭林镇":
        case "吕巷镇":
        case "山阳镇":
        case "廊下镇":
        case "张堰镇":
        case "朱泾镇":
        case "枫泾镇":
        case "漕泾镇":
        case "金山卫镇":
        case "石化街道":
        case "金山工业区":
          if (window[traceLayer].entities._entities._array.length === 0) {
            queryPoi("JS_Camera", label).then((res) => {
              res.data.features.forEach((item) => {
                // const indexOfName = item.fieldNames.indexOf("NAME");
                // const name = item.fieldValues[indexOfName];
                const { x, y } = item.geometry.center;
                const { longitude, latitude } = transformGeometricPosition(
                  x,
                  y
                );
                window[traceLayer].entities.add(
                  addEntity(`/images/摄像头.png`, longitude, latitude)
                );
              });
            });
          } else {
            window[traceLayer].entities.show = checked;
          }
          break;
        case "BIM":
          axios
            .get(
              `${iServerIP_Port}/iserver/services/3D-JS_Model/rest/realspace/datas.json`
            )
            .then((res) => {
              const layerNames = res.data.filter(
                (layer) => layer.name !== "Baimo_SH@JS"
              );
              layerNames.forEach((layer) => {
                viewer.scene.layers.find(layer.name).visible = checked;
              });
            });
          break;
        case "白模":
          viewer.scene.layers.find(layerName[0]).visible = checked;
          break;
        case "精模":
          this.currentViewport = "jm";
          if (this.currentViewport === "jm" && checked) {
            setViewportByLonAndLat(116.4580393229838, 39.91143438827206);
          }
          axios
            .get(
              `${iServerIP_Port}/iserver/services/3D-CBD2/rest/realspace/datas.json`
            )
            .then((res) => {
              res.data.forEach((layer) => {
                viewer.scene.layers.find(layer.name).visible = checked;
              });
            });
          break;
        case "矢量底图":
        case "影像底图":
        case "暗色底图":
        case "政务底图":
        case "金山区边界底图":
        case "水系底图":
          viewer.imageryLayers._layers.find(
            (item) => item._imageryProvider.name === label
          ).show = checked;
      }
    },
    onNodeClick() {},
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: none;
}

::v-deep .el-tree-node__content label.el-checkbox {
  display: none;
}

::v-deep .el-tree-node__content:hover {
  background: none;
}

::v-deep .el-tree-node__children label.el-checkbox {
  display: inline-block;
  margin-left: -12px;
}

.layers-container {
  z-index: 999;
  width: 314px;
  height: 500px;
  position: absolute;
  left: 15px;
  top: 205px;
  background-image: url("../assets/images/layers-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .title {
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    padding: 12px;
    text-align: center;
    letter-spacing: 10px;
  }

  .el-tree {
    width: 150px;
    margin-left: 20px;
    background: none;
    color: #fff;
  }

  .control {
    position: absolute;
    right: -37px;
    top: 50%;

    .tab {
      width: 60px;
      height: 15px;
      position: relative;
      font-size: 60px;
      text-align: center;
      transform: rotate(90deg);
    }

    .tab::before {
      content: ""; /* 用伪元素来生成一个矩形 */
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: #58a;
      transform: perspective(0.5em) rotateX(35deg);
    }
  }
}
</style>
