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
import { PointCluster } from "@/utils/pointCluster";
import { flyTo, transformGeometricPosition } from "@/utils/view";
import bus from "@/utils/bus";
import { nameOfImageMap } from "@/assets/js/entity-image";
import { clickQuery } from "@/utils/tools";

export default {
  name: "LayersTree",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      defaultCheckedKeys: [],
    };
  },
  props: {
    title: {
      type: String,
    },
    treeData: {
      type: Array,
    },
    checkedKeys: {
      type: Array,
    },
  },
  methods: {
    renderContent(h, { node, data }) {
      if (data.children) {
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
      const { x, y, z, heading, pitch, roll } = data?.camera;
      console.log(x, y, z, heading, pitch, roll);
      flyTo(x, y, z, heading, pitch, roll);
    },
    handleMapCheckChange(data, checked) {
      const { name } = data;
      const mapLayer = viewer.imageryLayers._layers.find(
        (item) => item._imageryProvider.name === name
      );
      mapLayer.show = checked;
      // 置顶图层
      if (["总体规划", "详细规划"].indexOf(name) >= 0) {
        viewer.imageryLayers.raiseToTop(mapLayer);
      }
    },
    async handleS3mCheckChange(data, checked) {
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
    handleLineChecked(data, checked) {
      window.traceLayerLines.show = checked;
    },
    handlePoiCheckChange(data, checked) {
      const { id } = data;
      let traceLayer = `traceLayer${id}`;
      if (!checked) {
        window[traceLayer].entities.show = checked;
      } else {
        // window[traceLayer] = new Cesium.CustomDataSource(traceLayer);
        // viewer.dataSources.add(window[traceLayer]);
        if (window[traceLayer]) {
          window[traceLayer].entities.show = checked;
          return;
        }
        const { datasetName } = data;
        if (datasetName) {
          const arr = [];
          datasetName.map(async (name) => {
            const { serviceName, dataSource } = dataServiceUrlHashmap.find(
              (item) => item.dataSets.indexOf(name) >= 0
            );
            const res = await queryPoi(serviceName, dataSource, name);
            res.data.features.forEach((item) => {
              const { longitude, latitude } = transformGeometricPosition(
                item.geometry.center.x,
                item.geometry.center.y
              );
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
            });
            let imagePath;
            if (data?.type2 === "camera") {
              imagePath = "images/" + "摄像头" + ".png";
            } else {
              imagePath =
                "images/queryEntities/" + nameOfImageMap[data.name] + ".png";
            }
            const juhePoint = new PointCluster(viewer, arr, imagePath);
            window[traceLayer] = juhePoint.dataSource;
            clickQuery();
          });
        }
      }
    },
    async handleCheckChange(data, checked) {
      this.defaultCheckedKeys = this.$refs.tree.getCheckedKeys();
      sessionStorage.setItem(
        this.title,
        JSON.stringify(this.defaultCheckedKeys)
      );
      const hashMap = {
        map: "handleMapCheckChange",
        s3m: "handleS3mCheckChange",
        line: "handleLineChecked",
        poi: "handlePoiCheckChange",
      };
      data.type && this[hashMap[data.type]](data, checked);
    },
  },
  mounted() {
    bus.$on("update:defaultCheckedKeys", () => {
      this.$nextTick(() => {
        this.defaultCheckedKeys = JSON.parse(
          sessionStorage.getItem(this.title)
        );
      });
    });
    this.defaultCheckedKeys = JSON.parse(sessionStorage.getItem(this.title));
  },
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

::v-deep
  .el-tree
  .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url("../assets/images/layersTree/jian.png") no-repeat center
    center;
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
