<template>
  <div class="layers-tree">
    <div class="title">
      <span>{{ title }}</span>
      <i class="el-icon-close" @click="$emit('close-layers-tree')"></i>
    </div>
    <div class="layer-tree-wrapper custom-scroll">
      <el-tree
        @node-click="handleNodeClick"
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        :expand-on-click-node="false"
        :props="defaultProps"
        @check-change="handleCheckChange"
        @check="handleLineChecked"
        :render-after-expand="false"
        :default-checked-keys="defaultCheckedKeys"
        :render-content="renderContent"
      />
    </div>
  </div>
</template>

<script>
import { s3mUrlHashmap } from "@/assets/js/s3m-url";
import axios from "axios";
import { queryPoi } from "@/apis/queryPoi";
import { dataServiceUrlHashmap } from "@/assets/js/dataService-url";
import { flyTo, transformGeometricPosition } from "@/utils/view";
import bus from "@/utils/bus";
import { nameOfImageMap } from "@/assets/js/entity-image";
import { clickQuery, debounce } from "@/utils/tools";
import { addEntity, addEntityWithDistance, addLabel, addMapLabel, addPolygon, addPolyline } from "@/utils/entity";
import { findCameraInfoByIndexCode, getIndexCodeByCollectionCode } from "@/apis/information";
import layersJson from "../assets/json/layer.json";

let entityArray = [];
let polygonEntityArray = [];

export default {
  name: "LayersTree",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultCheckedKeys: []
    };
  },
  props: {
    title: {
      type: String
    },
    treeData: {
      type: Array
    },
    checkedKeys: {
      type: Array
    },
    treeDefaultProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "name"
      })
    }
  },
  methods: {
    controlEntityWithLabel(checked) {
      const pointsArray = [
        {
          name: "科创智造区",
          point: {
            x: -16026.35366,
            y: -55833.45963,
            z: 50
          },
          textColor: [255, 83, 174, 1]
        },
        {
          name: "卫城文创区",
          point: {
            x: -14379.13463,
            y: -56326.25303,
            z: 50
          },
          textColor: [255, 195, 112, 1]
        },
        {
          name: "地区服务中心",
          point: {
            x: -13023.00708,
            y: -54593.20598,
            z: 50
          },
          textColor: [255, 254, 139, 1]
        },
        {
          name: "枢纽商务区",
          point: {
            x: -12421.18444,
            y: -51252.36216,
            z: 50
          },
          textColor: [255, 130, 115, 1]
        },
        {
          name: "制造研发区",
          point: {
            x: -10918.62845,
            y: -51533.47785,
            z: 50
          },
          textColor: [236, 178, 145, 1]
        },
        {
          name: "滨海旅游区",
          point: {
            x: -9306.328095,
            y: -56261.38187,
            z: 50
          },
          textColor: [119, 161, 210, 1]
        },
        {
          name: "绕城森林区",
          point: {
            x: -14252.0626,
            y: -51761.26586,
            z: 50
          },
          textColor: [64, 234, 104, 1]
        }
      ];
      if (checked) {
        entityArray = pointsArray.map(item => {
          const { longitude, latitude } = transformGeometricPosition(item.point.x, item.point.y);
          const [r, g, b, a] = item.textColor;
          return addLabel({ x: longitude, y: latitude, z: item.point.z }, item.name, [r, g, b, a]);
        });
      } else {
        entityArray.forEach(entity => {
          viewer.entities.remove(entity);
        });
        entityArray = [];
      }
    },
    renderContent(h, { node, data }) {
      if (data.children && data.imagePath) {
        return (
          <span class="custom-tree-node">
            <img
              class="organization-img"
              src={data.imagePath}
              alt=""
              style="transform: translate(-3px,1px);margin-right: 2px;width: 14px;height: 14px;"
            />
            {data.count ? (
              <span>{node.label + "（" + data.count + "）"}</span>
            ) : (
              <span>{node.label}</span>
            )}
          </span>
        );
      } else {
        if (data.count) {
          return (
            <span class="custom-tree-node">
              <span>
                {node.label + "（" + data.count + "）"}
                <el-popover
                  popper-class="icon-popover"
                  placement="right"
                  width="200"
                  trigger="hover"
                  content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                >
                  <ul>
                    <li>
                      <span>数据格式：</span>
                      <span>{data.info && data.info["数据格式"]}</span>
                    </li>
                    <li>
                      <span>生产日期：</span>
                      <span>{data.info && data.info["生产日期"]}</span>
                    </li>
                    <li>
                      <span>生产单位名称：</span>
                      <span>{data.info && data.info["生产单位名称"]}</span>
                    </li>
                    <li>
                      <span>维护人：</span>
                      <span>{data.info && data.info["维护人"]}</span>
                    </li>
                    <li>
                      <span>维护人联系方式：：</span>
                      <span>{data.info && data.info["维护人联系方式"]}</span>
                    </li>
                  </ul>
                  <i class="el-icon-info" slot="reference" />
                </el-popover>
              </span>
            </span>
          );
        } else {
          return (
            <span class="custom-tree-node">
              <span>{node.label}</span>
            </span>
          );
        }
      }
    },
    handleNodeClick(data) {
      if (data.name === "地下三维模型") {
        viewer.scene.globe.globeAlpha = 0.7;
      } else {
        viewer.scene.globe.globeAlpha = 1;
      }
      if (data.camera) {
        const { x, y, z, heading, pitch, roll } = data.camera;
        flyTo(x, y, z, heading, pitch, roll);
      }
    },
    handleMapCheckChange(data, checked) {
      const { name } = data;
      const mapLayer = viewer.imageryLayers._layers.find(
        (item) => item._imageryProvider.name === name
      );
      mapLayer.show = checked;
      if (name === "总体规划") {
        this.controlEntityWithLabel(checked);
      }
      // 置顶图层
      if (["总体规划", "详细规划"].indexOf(name) >= 0) {
        viewer.imageryLayers.raiseToTop(mapLayer);
      } else if (["区级行政区", "数字正射影像图"].indexOf(name) >= 0) {
        viewer.imageryLayers.raiseToTop(mapLayer);
        ["总体规划", "详细规划"].forEach(map => {
          const mapLayer = viewer.imageryLayers._layers.find(
            (item) => item._imageryProvider.name === map
          );
          viewer.imageryLayers.raiseToTop(mapLayer);
        });
      }
    },
    async handleS3mCheckChange(data, checked) {
      clickQuery();
      const { name } = data;
      const s3mNameArr = [];
      const s3mItem = s3mUrlHashmap.find((item) => name === item.name);
      for (let i = 0; i < s3mItem.urls.length; i++) {
        const { data } = await axios.get(s3mItem.urls[i]);
        data.forEach((obj) => {
          s3mNameArr.push(obj.name);
        });
      }
      s3mNameArr.forEach(
        (name) => (viewer.scene.layers.find(name).visible = checked)
      );
    },
    async handleLineChecked(data) {
      const namesArray = layersJson[0].children[0].children[2].children.map(item => item.name);
      console.log("namesArray");
      console.log(namesArray);
      if (!namesArray.includes(data.name)) {
        return;
      }
      if (window.hasLine) {
        polygonEntityArray.forEach(item => {
          viewer.entities.remove(item);
        });
        polygonEntityArray = [];
        window.hasLine = false;
        return;
      }
      if (!data.children) {
        const { data: result } = await queryPoi("arcgis-sh_jd_boundary", "ArcGISFeatureServer",
          "sh_jd_boundary", "OBJECTID", arcgisIP_Port);
        console.log("result");
        console.log(result);
        result.features.forEach(item => {
          const arr = [];
          item.geometry.points.forEach(point => {
            const { longitude, latitude } = transformGeometricPosition(point.x, point.y);
            arr.push(longitude, latitude);
          });
          const name = item.fieldValues[5];
          console.log(name);
          if (name === data.name) {
            console.log("name");
            console.log(name);
            const { center } = item.geometry;
            const { longitude, latitude } = transformGeometricPosition(center.x, center.y);
            const polyline = addPolyline(arr, name);
            viewer.flyTo(polyline, {
              duration: 1
            });
            window.hasLine = true;
            polygonEntityArray.push(polyline, addMapLabel({ x: longitude, y: latitude, z: 20 }, name));
          } else {
            polygonEntityArray.push(addPolygon(arr, name));
          }
        });
      }
      /*const selectedItem = result.features.find(item => item.fieldValues[5] === data.name);
      const arr = [];
      selectedItem.geometry.points.forEach(item => {
        const { longitude, latitude } = transformGeometricPosition(item.x, item.y);
        arr.push(longitude, latitude);
      });
      window[tracyName].entities.add(addPolygon(arr, data.name));*/
    },
    handlePoiCheckChange(data, checked) {
      console.log("data------");
      console.log(data);
      const { id } = data;
      let traceLayer = `traceLayer${id}`;
      // window[traceLayer] = new Cesium.CustomDataSource(traceLayer);
      // viewer.dataSources.add(window[traceLayer]);
      if (window[traceLayer]) {
        window[traceLayer].show = checked;
        return;
      }
      const { datasetName } = data;
      if (datasetName) {
        if (!window[traceLayer]) {
          window[traceLayer] = new Cesium.CustomDataSource(traceLayer);
          viewer.dataSources.add(window[traceLayer]);
        }
        const arr = [];
        datasetName.map(async (name) => {
          const { serviceName, dataSource } = dataServiceUrlHashmap.find(
            (item) => item.dataSets.indexOf(name) >= 0
          );
          const res = await queryPoi(serviceName, dataSource, name);
          console.log("res");
          console.log(res);
          res.data.features.map(async (item) => {
            const { longitude, latitude } = transformGeometricPosition(
              item.geometry.center.x,
              item.geometry.center.y
            );
            /*if(data.name==='小区'){
              const itemName = item.fieldValues[7]
              const res1 =await getBlockIdByName(itemName)
              if(res1.data.data.blockId===null){
                console.log(itemName);
              }
            }*/
            // 处理description信息
            const attrObj = {};
            item.fieldNames.forEach((key, index) => {
              if (
                key.indexOf("SM") < 0 &&
                key.indexOf("F") < 0 &&
                item.fieldValues[index] !== ""
              ) {
                attrObj[key] = item.fieldValues[index];
              }
            });
            arr.push([longitude, latitude, attrObj]);
            if (data?.type3 === "point") {
              console.log("111");
              if (!window[traceLayer]) {
                window[traceLayer] = new Cesium.CustomDataSource(traceLayer);
                viewer.dataSources.add(window[traceLayer]);
              }
              addEntity("./images/camera.png", longitude, latitude, JSON.stringify(attrObj));
            }
            if (data.name === "小区") {
              if (JSON.stringify(attrObj).indexOf("万盛金邸东区") >= 0) {
                window[traceLayer].entities.add(addEntityWithDistance("./images/queryEntities/wsjd-east.png",
                  longitude, latitude, JSON.stringify(attrObj), data.name));
              } else {
                window[traceLayer].entities.add(addEntityWithDistance("./images/queryEntities/" + nameOfImageMap[data.name] + ".png",
                  longitude, latitude, JSON.stringify(attrObj), data.name));
              }
            } else {
              window[traceLayer].entities.add(addEntity("./images/queryEntities/" + nameOfImageMap[data.name] + ".png",
                longitude, latitude, JSON.stringify(attrObj), data.name));
            }
          });
          clickQuery();
          isClickQuery = true;
        });
      }
    },
    async handleMonitorCheckChange(data, checked) {
      const { id } = data;
      let traceLayer = `traceLayer${id}`;
      /*if (window[traceLayer]) {
        window[traceLayer].show = checked;
        return;
      }*/
      if (!checked) {
        window[traceLayer].forEach(item => viewer.entities.remove(item));
        window[traceLayer] = [];
        return;
      }
      clickQuery();
      const { collectionCode } = data;
      const res = await getIndexCodeByCollectionCode(collectionCode);
      const list = res.data.data.list;
      console.log("list");
      console.log(list);
      if (!window[traceLayer]) {
        /* window[traceLayer] = new Cesium.CustomDataSource(traceLayer);
         viewer.dataSources.add(window[traceLayer]);*/
        window[traceLayer] = [];
      }
      list.map(async item => {
        const { x, y, streetTown, name, indexCode } = item;
        /*findCameraInfoByIndexCode(indexCode).then(res=>{
          if(+res.data.data.data[0].isOnline===0){
            console.log('res');
            console.log(res);
          }
        })*/
        if (x) {
          const { longitude, latitude } = transformGeometricPosition(+x, +y);
          const attr = {};
          if (streetTown) {
            attr["点位名"] = name;
            attr["街镇"] = streetTown;
          } else {
            attr["点位名"] = name;
          }
          /*monitorEntityArray.push(addEntity("./images/camera.png",
            longitude, latitude, JSON.stringify(attr), "monitor", indexCode));*/
          try {
            const res = await findCameraInfoByIndexCode(indexCode);
            if (+res.data === 1) {
              const entity = addEntity("./images/camera.png",
                longitude, latitude, JSON.stringify({}), "monitor", indexCode);
              window[traceLayer].push(entity);
            } else {
              const entity = addEntity("./images/camera_1.png",
                longitude, latitude, JSON.stringify({}), "monitor", indexCode);
              window[traceLayer].push(entity);
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          console.log("x is null");
        }
      });
      this.flyTo(window[traceLayer]);
    },
    flyTo: debounce((traceLayer) => {
      viewer.flyTo(traceLayer, {
        duration: 1
      });
    }),
    async handleCheckChange(data, checked) {
      this.defaultCheckedKeys = this.$refs.tree.getCheckedKeys();
      sessionStorage.setItem(
        this.title,
        JSON.stringify(this.defaultCheckedKeys)
      );
      const hashMap = {
        map: "handleMapCheckChange",
        s3m: "handleS3mCheckChange",
        // line: "handleLineChecked",
        poi: "handlePoiCheckChange",
        monitor: "handleMonitorCheckChange"  //视频监控设备
      };
      data.type && this[hashMap[data.type]]?.(data, checked);
    }
  },
  mounted() {
    bus.$on("update:defaultCheckedKeys", () => {
      this.$nextTick(() => {
        this.defaultCheckedKeys = JSON.parse(
          sessionStorage.getItem(this.title)
        );
      });
    });

    this.$nextTick(() => {
      this.defaultCheckedKeys = JSON.parse(sessionStorage.getItem(this.title));
    });
  }
};
</script>

<style lang="scss" scoped>
::v-deep .is-leaf {
  .custom-tree-node {
    border: 1px solid red;
  }
}

::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: none;
}

::v-deep .el-tree-node__content:hover {
  background: none;
}

::v-deep .el-tree-node__children label.el-checkbox {
  display: inline-block;
}

::v-deep .el-tree-node__expand-icon.is-leaf {
  visibility: hidden;
}

/*::v-deep .el-tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}*/

::v-deep .el-tree .el-icon-caret-right:before {
  background: url("../assets/images/layersTree/jia.png") no-repeat center center;
  content: "";
  display: block;
  width: 18px;
  height: 18px;
  font-size: 18px;
  background-size: 18px;
}

::v-deep .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url("../assets/images/layersTree/jian.png") no-repeat center center;
  content: "";
  display: block;
  width: 18px;
  height: 18px;
  font-size: 18px;
  background-size: 18px;
}

.layers-tree {
  position: absolute;
  z-index: 999;
  width: 350px;
  height: 535px;
  top: 11+78px;
  left: 164px;
  background-size: 100% 100%;
  color: white;
  padding: 12px;
  background-image: url("../assets/images/layersTree/layer-tree-bg.png");

  .title {
    padding: 12px 0;
    border-bottom: 1px solid #4bc1ff;
    font-weight: 600;
    font-size: 18px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    > span {
      padding: 0 12px;
    }

    .el-icon-close {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .layer-tree-wrapper {
    height: 420px;
    overflow: auto;
    width: 320px;
  }

  .el-tree {
    color: white;
    background: none;
  }
}
</style>
