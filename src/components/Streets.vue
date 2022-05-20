<template>
  <div class="street-container">
    <div class="selector">
      <span style="white-space: nowrap">{{ streetName }}</span>
      <i class="el-icon-arrow-down" @click="streetsListVisible=true" v-show="!streetsListVisible"></i>
      <i class="el-icon-arrow-up" @click="streetsListVisible=false" v-show="streetsListVisible"></i>
    </div>
    <div class="streets-list" v-show="streetsListVisible">
      <div class="street-current">
        <span>当前位置: {{ currentName }}</span>
        <img src="../assets/images/fanhui.png" alt="" @click="goBack">
      </div>
      <div class="street-info">
        <div class="street-info-wrapper custom-scroll" v-show="!jwList.length">
          <span v-for="item in streetsList"
                :key="item.ID"
                @click="handleClickStreet(item.fieldValues[nameIndex])"
          >
            {{ item.fieldValues[nameIndex] }}
          </span>
        </div>
        <div class="street-info-wrapper custom-scroll" v-show="jwList.length">
          <span v-for="item in jwList"
                :key="item.ID"
                @click="handleClickJw(item.fieldValues[10])"
          >
            {{ item.fieldValues[10] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryPoi } from "@/apis/queryPoi";
import { findLayer } from "@/utils/layer";
import { flyTo } from "@/utils/view";
import { initView } from "@/utils/tools";

export default {
  name: "Streets",
  data() {
    return {
      state: "city",  //区 、街道、居委
      cityName: "金山区",  // 区名
      streetName: "金山区", // 街道名
      jwName: "", //居委名
      currentName: "金山区", // 当前显示名
      streetsListVisible: false,
      streetsList: [],
      jwList: [],
      nameIndex: 0,
      streetSmid: 0,
      streetCenter: { x: 0, y: 0 },
      jwSmid: 0,
      jwCenter: { x: 0, y: 0 }
    };
  },
  mounted() {
    this.getStreetsList();
  },
  methods: {
    goBack() {
      if (this.state === "jw") {
        this.state = "street";
        this.currentName = this.streetName;
        findLayer("jwh@xzqh").visible = false;
        findLayer("jz@xzqh").visible = true;
        findLayer("jz@xzqh").setObjsVisible(this.streetSmid, false);
        flyTo(this.streetCenter.x, this.streetCenter.y, 33000, 0.01614302261320244, -1.5446777533264031, 0);
      } else if (this.state === "street") {
        initView();
        this.currentName = this.cityName;
        this.streetName = "金山区";
        this.getStreetsList();
        this.jwList = [];
        findLayer("jwh@xzqh").visible = false;
        findLayer("jz@xzqh").visible = false;
      }
    },
    async getStreetsList() {
      const res = await queryPoi("jw", "xzqh", "jz", "SMID", arcgisIP_Port);
      this.streetsList = res.data.features;
      this.nameIndex = this.streetsList[0].fieldNames.indexOf("NAME");
    },
    handleClickStreet(name) {
      this.currentName = name;
      this.state = "street";
      this.streetName = name;
      queryPoi("jz_jw", "xzqh", "jz", "SMID", arcgisIP_Port).then(res => {
        const selectedStreet = res.data.features.find(item => item.fieldValues[10] === name);
        const { center } = selectedStreet.geometry;
        this.streetCenter = center;
        flyTo(center.x, center.y, 33000, 0.01614302261320244, -1.5446777533264031, 0);
        const smid = selectedStreet.fieldValues[0];
        this.streetSmid = +smid;
        findLayer("jwh@xzqh").visible = false;
        findLayer("jz@xzqh").visible = true;
        findLayer("jz@xzqh").setObjsVisible([+smid], false);
      });
      queryPoi("jz_jw", "xzqh", "jw_all", "SMID", arcgisIP_Port).then(res => {
        this.jwList = res.data.features.filter(item => item.fieldValues[13] === name);
      });
    },
    handleClickJw(name) {
      this.state = "jw";
      this.currentName = name;
      this.jwName = name;
      queryPoi("jz_jw", "xzqh", "jw_all", "SMID", arcgisIP_Port).then(res => {
        const selectedJw = res.data.features.find(item => item.fieldValues[10] === name);
        const smid = selectedJw.fieldValues[0];
        const { center } = selectedJw.geometry;
        this.jwCenter = center;
        flyTo(center.x, center.y, 11000, 0.01614302261320244, -1.5446777533264031, 0);
        this.jwSmid = +smid;
        findLayer("jz@xzqh").visible = false;
        findLayer("jwh@xzqh").visible = true;
        findLayer("jwh@xzqh").setObjsVisible([+smid], false);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.street-container {
  position: absolute;
  z-index: 999;
  width: 356px;
  height: 240px;
  right: 160px;
  top: 115px;

  .selector {
    width: 95px;
    height: 30px;
    border: 1px solid #11D7F5;
    border-radius: 3px;
    background: rgba(26, 63, 98, 0.5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon-arrow-down, .el-icon-arrow-up {
      cursor: pointer;
      margin-left: 12px;
    }
  }

  .streets-list {
    border: 1px solid #11D7F5;
    border-radius: 3px;
    background: rgba(26, 63, 98, 0.5);
    width: 100%;
    height: 202px;
    margin-top: 6px;
    color: white;

    .street-current {
      border-bottom: 1px solid rgba(255, 255, 255, 1);
      padding: 18px 12px;
      font-size: 16px;

      img {
        position: absolute;
        right: 12px;
        cursor: pointer;
      }
    }

    .street-info {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 6px;

      &-wrapper {
        height: 120px;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;

        span {
          cursor: pointer;
          width: 25%;
          padding: 6px 2px;
          text-align: center;
        }
      }

    }
  }
}
</style>
