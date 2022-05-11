<template>
  <div>
    <header>
      <div class="wrapper">
        <div v-for="item in tabs"
             :key="item.name"
             class="tab"
             :class="{active:selected===item.name}"
             @click="selected=item.name"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="back" @click="$router.push({name:'Description',params:{
        prefix:$route.params.prefix,
        houseUrl:$route.params.houseUrl
      }})"></div>
    </header>
    <main v-show="selected==='房屋信息'">
      <HouseInfoItem title="所属区域" :content="roomInfo.JDMC+roomInfo.JCWMC" />
      <HouseInfoItem title="房屋详情" :content="roomInfo.MLPHXX_S" />
      <HouseInfoItem title="居住房屋类型" :content="roomInfo.JZFWLXMC" />
      <div style="display: flex">
        <HouseInfoItem style="width: 300px" title="房主姓名" :content="roomInfo.FZXM" />
        <HouseInfoItem title="房主身份证号" :content="roomInfo.FZZJHM" style="flex: 1" />
      </div>
      <div style="display: flex">
        <HouseInfoItem style="width: 300px" title="房主联系电话" :content="roomInfo.FZLXDH" />
        <HouseInfoItem title="房屋单位名称" :content="roomInfo.FWDWMC==='null'?'暂无信息':roomInfo.FWDWMC" style="flex: 1" />
      </div>
      <div style="display: flex">
        <HouseInfoItem style="width: 300px" title="居住人数" :content="roomInfo.JZJWRS" />
        <HouseInfoItem title="居住户籍人数" :content="roomInfo.JZHJRS" style="flex: 1" />
      </div>
      <div style="display: flex">
        <HouseInfoItem style="width: 300px" title="居住来沪人数" :content="roomInfo.JZLHRS" />
        <HouseInfoItem title="居住境外人数" :content="roomInfo.JZHJRS" style="flex: 1" />
      </div>
      <HouseInfoItem title="居住60岁以上老人 " :content="roomInfo.JZHJRS_60" />
    </main>
    <main v-show="selected==='居住人员'">
      <PersonInfo />
    </main>
  </div>
</template>

<script>
import HouseInfoItem from "@/components/building-dialog/HouseInfoItem";
import PersonInfo from "@/components/building-dialog/PersonInfo";
import { mapState } from "vuex";

export default {
  name: "BuildingTabs",
  components: { PersonInfo, HouseInfoItem },
  data() {
    return {
      tabs: [
        {
          name: "房屋信息"
        },
        {
          name: "居住人员"
        }
      ],
      selected: "房屋信息"
    };
  },
  computed: {
    ...mapState({
      roomInfo: state => state["building-dialog"].roomInfo
    })
  }
};
</script>

<style lang="scss" scoped>
header {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .wrapper {
    display: flex;

    .tab {
      width: 123px;
      height: 54px;
      background-image: url("../../assets/images/building-dialog/tab.png");
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: 500;
      font-size: 18px;

      &.active {
        background-image: url("../../assets/images/building-dialog/tab-active.png");
      }
    }
  }

  .back {
    background-image: url("../../assets/images/building-dialog/back.png");
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
}

main {
  width: 100%;
  height: 347px;
  margin-top: 32px;

  .house-info {

  }
}
</style>
