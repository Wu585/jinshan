<template>
  <div class="layers-tree">
    <div class="title">
      <span>{{ title }}</span>
      <i class="el-icon-close" @click="$emit('close-layers-tree')"></i>
    </div>
    <div class="layer-tree-wrapper">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        :expand-on-click-node="false"
        check-on-click-node
        :props="defaultProps"
        @check-change="handleCheckChange"
      >
        <!--        <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <img class="organization-img" src="../assets/images/layersTree/jian.png" alt="">
                    {{ node.label }}
                  </span>
                </span>-->
      </el-tree>
    </div>
  </div>
</template>

<script>
import { s3mUrlHashmap } from "@/assets/js/s3m-url";
import axios from "axios";
import { queryChildren, queryPoi } from "@/apis/queryPoi";
import { dataServiceUrlHashmap } from "@/assets/js/dataService-url";
import { addCameraEntity, addPolyline } from "@/utils/entity";

export default {
  name: "LayersTree",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  props: {
    title: {
      type: String,
    },
    treeData: {
      type: Array,
    },
  },
  methods: {
    async handleCheckChange(data, checked) {
      const { name } = data;
      console.log(data, checked);
      if (data?.type === "map") {
        viewer.imageryLayers._layers.find(
          (item) => item._imageryProvider.name === name
        ).show = checked;
      } else if (data?.type === "s3m") {
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
      } else if (data?.type === "line") {
        if (!checked) {
          viewer.entities.removeById(name);
        } else {
          const { serviceName, dataSource, dataSets } =
            dataServiceUrlHashmap.find((item) => item.name === name);
          const res = await queryPoi(serviceName, dataSource, dataSets);
          const pointsArray = res.data.features.reduce((prev, cur) => {
            prev.push(cur.geometry.center.x, cur.geometry.center.y);
            return prev;
          }, []);
          addPolyline(pointsArray, name);
        }
      } else if (data?.type === "poi") {
        if (!checked) {
          window.traceLayer.entities.show = checked;
        } else {
          window.traceLayer = new Cesium.CustomDataSource("traceLayer");
          viewer.dataSources.add(window.traceLayer);
          const { serviceName, dataSource } = dataServiceUrlHashmap.find(
            (item) => item.name === name
          );
          const res = await queryChildren(serviceName, dataSource);
          res.data.datasetNames.map(async (datasetName) => {
            const childRes = await queryPoi(
              serviceName,
              dataSource,
              datasetName
            );
            childRes.data.features.forEach((item) => {
              window.traceLayer.entities.add(
                addCameraEntity(item.geometry.center.x, item.geometry.center.y)
              );
            });
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.layer-tree-wrapper::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}

.layer-tree-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(21, 40, 64, 0.7);
}

.layer-tree-wrapper::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
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
