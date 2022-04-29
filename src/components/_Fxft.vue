<template>
  <div class="fxft-wrapper">
    <PanelLayout @close-panel="handleClose">
      <template v-slot:title> 防汛防台</template>
      <template v-slot:content>
        <div class="checkbox-wrapper">
          <el-checkbox v-for="item in dataArray"
                       :key="item.label"
                       v-model="item.value"
                       @change="handleChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
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

export default {
  name: "Fxft",
  components: { PanelLayout },
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
      ]
    };
  },
  methods: {
    handleClose() {
      this.$emit("hide-fxft");
      bus.$emit("reset-bottom-nav");
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
}
</style>
