<template>
  <div class="fxft-wrapper">
    <PanelLayout @close-panel="handleClose">
      <template v-slot:title> 防汛防台</template>
      <template v-slot:content>
        <div class="tree-wrapper custom-scroll">
          <MyTree :data="treeData"
                  :props="defaultProps"
                  show-checkbox
                  @check-change="handleCheckChange"
                  @node-click="handleNodeClick" />
        </div>
      </template>
    </PanelLayout>
  </div>
</template>

<script>
import PanelLayout from "@/components/PanelLayout";
import * as apis from "@/apis/information";
import { addEntity } from "@/utils/entity";
import { transformGeometricPosition } from "@/utils/view";
import { clickQuery } from "@/utils/tools";
import { fxftMap } from "@/assets/js/fxft";
import bus from "@/utils/bus";
import MyTree from "@/components/MyTree";
import { queryPoi } from "@/apis/queryPoi";

export default {
  name: "Fxft",
  components: { MyTree, PanelLayout },
  data() {
    return {
      value: false,
      dataArray: [
        {
          label: "下立交",
          value: false,
          imagePath: "./images/fxft/xlj.png",
          apiName: "getXiaLiJiao"
        },
        {
          label: "防汛队伍",
          value: false,
          imagePath: "./images/fxft/fxdw.png",
          apiName: "getFxDw"
        },
        {
          label: "隐患点",
          value: false,
          imagePath: "./images/fxft/fhd.png",
          apiName: "getFhD"
        },
        {
          label: "实时水位",
          value: false,
          imagePath: "./images/fxft/sssw.png",
          apiName: "getAllSW"
        },
        {
          label: "除涝泵闸",
          value: false,
          imagePath: "./images/fxft/clbz.png",
          apiName: "getAllRecord"
        }
      ],
      treeData: [
        {
          label: "处理力量",
          children: [
            {
              label: "防汛队伍",
              appid: "B9bIcP93",
              imagePath: "./images/fxft/fxdw.png",
              apiName: "getFxdw"
            },
            {
              label: "防汛物资",
              appid: "106M48t3",
              imagePath: "./images/fxft/fxwz.png",
              apiName: "getFxwz"

            },
            {
              label: "安置点",
              appid: "D2ZS6FR3",
              imagePath: "./images/fxft/azd.png",
              apiName: "getAzd"
            },
            {
              label: "医疗点",
              appid: "3yPexA82",
              imagePath: "./images/fxft/yld.png",
              apiName: "getYld"
            }
          ]
        },
        {
          label: "重点区域",
          children: [
            {
              label: "下立交",
              appid: "q71T98MD",
              imagePath: "./images/fxft/xlj.png",
              apiName: "getXiaLiJiao2"
            },
            {
              label: "隐患点",
              appid: "Bn0i39l9",
              imagePath: "./images/fxft/yhd.png",
              apiName: "getYhd"
            },
            {
              label: "危化企业",
              appid: "EhyM0Z8g",
              imagePath: "./images/fxft/whqy.png",
              apiName: "getWhqy"
            },
            {
              label: "地下空间",
              appid: "31056588",
              imagePath: "./images/fxft/dxkj.png",
              apiName: "getDxkj"
            },
            {
              label: "在建工地",
              appid: "P0GP9VLH",
              imagePath: "./images/fxft/zjgd.png",
              apiName: "getZjgd"
            },
            {
              label: "玻璃幕墙",
              appid: "Vw624d0R",
              imagePath: "./images/fxft/blmq.png",
              apiName: "getBlmq"
            }
          ]
        },
        {
          label: "实时水位",
          imagePath: "./images/fxft/sssw.png",
          apiName_: "getAllSW"
        },
        {
          label: "除涝泵闸",
          imagePath: "./images/fxft/clbz.png",
          apiName_: "getAllRecord"
        },
        {
          label: "雨量监测",
          imagePath: "./images/fxft/clbz.png",
          apiName_: "getYuLiangJC"
        },
        {
          label: "广播站",
          imagePath: "./images/fxft/clbz.png",
          apiName_: "getYuLiangJC"
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    async handleCheckChange(data, checked) {
      clickQuery();
      console.log("data");
      console.log(data);
      const { imagePath, label, apiName, apiName_ } = data;
      const traceLayer = `traceLayer${label}`;
      if (window[traceLayer]) {
        window[traceLayer].show = checked;
        return;
      }
      window[traceLayer] = new Cesium.CustomDataSource(traceLayer);
      viewer.dataSources.add(window[traceLayer]);
      const mapItem = fxftMap.find(x => x.name === label);
      console.log("mapItem");
      console.log(mapItem);
      if (mapItem) {
        const keys = Object.keys(mapItem.engZhMap);
        if (apiName) {
          const res = await apis[apiName]();
          console.log("res====");
          console.log(JSON.parse(res.data.data.result).data);
          JSON.parse(res.data.data.result).data.forEach(point => {
            console.log("point");
            console.log(point);
            const attr = {};
            const { xx_cd, yy_cd } = point;
            keys?.forEach(key => {
              attr[mapItem.engZhMap[key]] = point[key];
            });
            if (xx_cd && yy_cd) {
              const { longitude, latitude } = transformGeometricPosition(+xx_cd, +yy_cd);
              window[traceLayer].entities.add(addEntity(imagePath, longitude, latitude, JSON.stringify(attr)));
            }
          });
        } else if (apiName_) {
          const res = await apis[apiName_]();
          console.log("res---");
          console.log(res);
          if (label === "雨量监测") {
            const data = JSON.parse(res.data.data.result);
            data.data.forEach(item => {
              const attr = {};
              keys?.forEach(key => {
                attr[mapItem.engZhMap[key]] = item[key];
              });
              const { longitude, latitude } = transformGeometricPosition(+item.xx, +item.yy);
              if (item.yl === 0) {
                window[traceLayer].entities.add(addEntity("./images/fxft/shuidi-0.png", longitude, latitude, JSON.stringify(attr)));
              } else if (0.1 <= item.yl < 10) {
                window[traceLayer].entities.add(addEntity("./images/fxft/shuidi-0.1-10.png", longitude, latitude, JSON.stringify(attr)));
              } else if (10 <= item.yl < 25) {
                window[traceLayer].entities.add(addEntity("./images/fxft/shuidi-10-25.png", longitude, latitude, JSON.stringify(attr)));
              } else if (25 <= item.yl < 50) {
                window[traceLayer].entities.add(addEntity("./images/fxft/shuidi-25-50.png", longitude, latitude, JSON.stringify(attr)));
              } else if (50 <= item.yl < 100) {
                window[traceLayer].entities.add(addEntity("./images/fxft/shuidi-50-100.png", longitude, latitude, JSON.stringify(attr)));
              } else if (100 <= item.yl < 200) {
                window[traceLayer].entities.add(addEntity("./images/fxft/shuidi-100-200.png", longitude, latitude, JSON.stringify(attr)));
              } else {
                window[traceLayer].entities.add(addEntity("./images/fxft/shuidiover200.png", longitude, latitude, JSON.stringify(attr)));
              }
            });
          } else if (label === "广播站") {
            const res = await queryPoi("GBZ", "GBZ", "应急广播数据_shcity", "SMID", arcgisIP_Port);
            res.data.features.forEach(item => {
              const attr = {
                "小区村名": "",
                "所属乡镇": "",
                "业务类型": "",
                "设备名称": "",
                "设备品牌型号": "",
                "安装地址": ""
              };
              for (let key in attr) {
                const index = item.fieldNames.indexOf(key);
                attr[key] = item.fieldValues[index];
              }
              const {
                longitude,
                latitude
              } = transformGeometricPosition(item.geometry.center.x, item.geometry.center.y);
              window[traceLayer].entities.add(addEntity("./images/fxft/guangbozhan.png", longitude, latitude, JSON.stringify(attr)));
            });
          } else {
            res.data.data.list.forEach(item => {
              const attr = {};
              keys?.forEach(key => {
                attr[mapItem.engZhMap[key]] = item[key];
              });
              const { longitude, latitude } = transformGeometricPosition(+item.x, +item.y);
              window[traceLayer].entities.add(addEntity(imagePath, longitude, latitude, JSON.stringify(attr)));
            });
          }
        }
      }
      /*const res = await getFxft(appid);
      console.log("res");
      console.log(res);
      if (res.data.code === 200) {
        res.data.data.forEach(item => {
          const { xx_cd, yy_cd } = item;
          keys?.forEach(key => {
            attr[mapItem.engZhMap[key]] = item[key];
          });
          console.log("attr");
          console.log(attr);
          const { longitude, latitude } = transformGeometricPosition(xx_cd, yy_cd);
          window[traceLayer].entities.add(addEntity(imagePath, longitude, latitude, JSON.stringify(attr)));
        });
      }*/
    },
    handleNodeClick() {
      console.log("node click");
    },
    handleClose() {
      bus.$emit("reset-bottom-nav");
      this.$store.commit("SET_componentName", "");
    },
    async handleChange(item) {
      clickQuery();
      const traceLayer = `traceLayer${item.label}`;
      if (window[traceLayer]) {
        window[traceLayer].show = item.value;
        return;
      }
      const selected = this.dataArray.find(poi => poi.label === item.label);
      const apiName = selected["apiName"];
      const res = await apis[apiName]();
      console.log("res");
      console.log(res);
      window[traceLayer] = new Cesium.CustomDataSource(traceLayer);
      viewer.dataSources.add(window[traceLayer]);
      const mapItem = fxftMap.find(x => x.name === item.label);
      const keys = Object.keys(mapItem.engZhMap);
      const attr = {};
      if (selected.label === "实时水位" || selected.label === "除涝泵闸") {
        res.data.data.list.forEach(point => {
          const { longitude, latitude } = transformGeometricPosition(point.x, point.y);
          keys.forEach(key => {
            attr[mapItem.engZhMap[key]] = point[key];
          });
          window[traceLayer].entities.add(addEntity(selected.imagePath, longitude, latitude, JSON.stringify(attr)));
        });
        return;
      }
      res.data.data.forEach(point => {
        const { xx_cd, yy_cd } = point;
        keys.forEach(key => {
          attr[mapItem.engZhMap[key]] = point[key];
        });
        if (xx_cd && yy_cd) {
          const { longitude, latitude } = transformGeometricPosition(+xx_cd, +yy_cd);
          window[traceLayer].entities.add(addEntity(selected.imagePath, longitude, latitude, JSON.stringify(attr)));
        }
      });
    }
  },
  beforeDestroy() {
    this.treeData.forEach(item => {
      if (window[`traceLayer${item.label}`]) {
        window[`traceLayer${item.label}`].show = false;
      }
      if (item.children) {
        item.children.forEach(layer => {
          if (window[`traceLayer${layer.label}`]) {
            window[`traceLayer${layer.label}`].show = false;
          }
        });
      }
    });
  }
};
</script>

<style scoped lang="scss">
::v-deep .panel-wrapper {
  height: 400px;
  width: 300px;
}

.fxft-wrapper {
  position: absolute;
  z-index: 999;
  right: 8px;
  top: 213px;

  .checkbox-wrapper {
    display: flex;
    flex-direction: column;
    padding: 12px 20px;

    .el-checkbox {
      padding: 6px 0;
      color: white;
    }
  }

  .tree-wrapper {
    height: 288px;
    overflow: auto;
  }
}
</style>
