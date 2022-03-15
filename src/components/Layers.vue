<template>
  <div class="layers-container">
    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleTabClick">
      <el-tab-pane label="图层控制" name="first">
        <el-tree
          ref="tree"
          :data="defaultData"
          :props="defaultProps"
          :highlight-current="false"
          node-key="id"
          show-checkbox
          @check-change="handleCheckChange"
          @node-click="onNodeClick"
          :default-checked-keys="defaultDataKey"
          :accordion="true"
          :render-content="renderContent"
        ></el-tree>
      </el-tab-pane>
      <el-tab-pane label="查询" name="second">
        <el-select
          v-model="selectionValue"
          placeholder="请选择"
          @change="onChangeSelectionValue"
        >
          <el-option
            v-for="item in defaultData[0].children"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
        <el-button @click="handleQuery">查询</el-button>
        <el-button @click="clear">清除</el-button>
      </el-tab-pane>
    </el-tabs>
    <!--    <div class="title">图层</div>-->
    <!--    <div class="control">
          <div class="tab"></div>
        </div>-->
  </div>
</template>

<script>
import axios from "axios";
import { setViewport, transformGeometricPosition } from "@/utils/view";
import { queryPoi, queryPoiBySpecial } from "@/apis/queryPoi";
import { addCameraEntity, addEntity } from "@/utils/entity";

let handlerPolygon;
let queryEntityArray = [];

export default {
  name: "Layers",
  data() {
    return {
      activeName: "first",
      currentViewport: "jm",
      selectionValue: "",
      pointArray: [],
      defaultData: [
        {
          id: 1,
          label: "POI",
          children: [
            {
              id: 98,
              label: "公用设施",
              traceLayer: "traceLayer1",
              imageName: "gyss",
              value: "选项一",
            },
            {
              id: 99,
              label: "教育文化",
              traceLayer: "traceLayer2",
              imageName: "jywh",
              value: "选项二",
            },
            {
              id: 5,
              label: "金融保险",
              traceLayer: "traceLayer3",
              imageName: "jrbx",
              value: "选项三",
            },
            {
              id: 6,
              label: "农林牧渔业",
              traceLayer: "traceLayer4",
              imageName: "nlmyy",
              value: "选项四",
            },
            {
              id: 7,
              label: "商业设施及服务",
              traceLayer: "traceLayer5",
              imageName: "syss",
              value: "选项五",
            },
            {
              id: 8,
              label: "卫生社保",
              traceLayer: "traceLayer6",
              imageName: "wssb",
              value: "选项六",
            },
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
            { id: 12, label: "影像底图" },
            { id: 13, label: "暗色底图" },
            { id: 14, label: "政务底图" },
            { id: 15, label: "金山区边界底图" },
            // { id: 16, label: "水系底图" }
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultDataKey: [3, 11],
    };
  },
  mounted() {
    let clampMode = 0;
    this.$nextTick(() => {
      handlerPolygon = new Cesium.DrawHandler(
        viewer,
        Cesium.DrawMode.Polygon,
        clampMode
      );
      handlerPolygon.drawEvt.addEventListener((obj) => {
        this.pointArray = [];
        let positions = obj.object.positions;
        // 四个坐标点
        positions.forEach((item) => {
          // noinspection JSSuspiciousNameCombination
          this.pointArray.push({ x: item.y, y: item.z });
        });
        // 多加一个坐标构成闭环
        // noinspection JSSuspiciousNameCombination
        this.pointArray.push({ x: positions[0].y, y: positions[0].z });
        const current = this.defaultData[0].children.find(
          (item) => item.label === this.selectionValue
        );
        const { imageName } = current;
        queryPoiBySpecial(this.pointArray, "JS_POI", this.selectionValue).then(
          (res) => {
            res.data.features.forEach((item) => {
              const { x, y } = item.geometry.center;
              const { longitude, latitude } = transformGeometricPosition(x, y);
              queryEntityArray.push(
                addEntity(`./images/${imageName}.png`, longitude, latitude)
              );
            });
          }
        );
      });
    });
  },
  methods: {
    renderContent(h, { node, data }) {
      if (data.children) {
        return (
          // render-content采用jsx语法,需安装依赖转换js语法,
          //依赖1：npm install babel-plugin-transform-vue-jsx,
          //依赖2：npm install babel-helper-vue-jsx-merge-props,
          //依赖3：npm install babel-plugin-syntax-jsx
          <span class="custom-tree-node">
            <span>{node.label + "（" + data.children.length + "）"}</span>
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }
    },
    clear() {
      queryEntityArray.forEach((item) => {
        viewer.entities.remove(item);
      });
      queryEntityArray = [];
      handlerPolygon.clear();
    },
    handleQuery() {
      handlerPolygon.activate();
    },
    handleTabClick(tab) {
      if (tab.name === "first") {
        this.$refs.tree.setChecked(1, false, true);
      }
      if (tab.name === "second") {
        for (let i = 1; i <= 17; i++) {
          const name = "traceLayer" + i;
          window[name].entities.show = false;
        }
      }
    },
    onChangeSelectionValue() {},
    handleCheckChange(data, checked) {
      const { label, layerName, traceLayer, imageName } = data;

      switch (label) {
        // case ["公用设施", "金融保险", "教育文化", "农林牧渔业", "商业设施及服务", "卫生社保"].indexOf(label) >= 0:
        case "公用设施":
        case "金融保险":
        case "教育文化":
        case "商业设施及服务":
        case "卫生社保":
        case "农林牧渔业":
          window[traceLayer].entities.show = checked;
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
                  addEntity(`./images/${imageName}.png`, longitude, latitude)
                );
              });
            });
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
          window[traceLayer].entities.show = checked;
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
                  addCameraEntity(longitude, latitude)
                );
              });
            });
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
          viewer.scene.layers.find(layerName[0]).style3D.lineWidth = 1;
          viewer.scene.layers.find(layerName[0]).style3D.fillStyle = 2;
          viewer.scene.layers.find(layerName[0]).wireFrameMode = 2;
          viewer.scene.layers.find(layerName[0]).style3D.lineColor =
            new Cesium.Color(0, 0, 0, 0.8);
          break;
        case "精模":
          this.currentViewport = "jm";
          if (this.currentViewport === "jm" && checked) {
            setViewport(
              12964705.068095665,
              4444261.215635712,
              138.62713523767889,
              3.82391039847943,
              -0.11545016746853176,
              6.283185307179572
            );
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
::v-deep .el-tabs__item {
  color: #ffffff;
}

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

  .el-select {
    margin-left: 30px;
  }

  .el-button {
    margin-left: 30px;
    margin-top: 30px;
  }
}
</style>
