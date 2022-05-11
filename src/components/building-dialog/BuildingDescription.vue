<template>
  <div class="wrapper">
    <header>
      <span class="arrow"></span>
      <span class="title">{{ $store.getters.houseUrlPrefix }}{{ $store.getters.houseUrlEnd }}</span>
    </header>
    <main>
      <div style="padding: 16px">
        <span class="round" style="background: #0ae8fc"></span>
        <span style="padding-left: 10px">此门牌共 <span class="text-highlight">{{ floors
          }}</span> 层，有 <span>{{ rooms
          }}</span> 户。闲置空房 <span class="text-highlight">{{ freeRooms }}</span> 户，出租房屋 <span
          class="text-highlight">{{ renTalRooms }}</span> 户，其中群租（出租房 居住5人以上）<span
          class="text-highlight">{{ renTalRoomsMuilty }}</span> 户，单位内部集体宿舍 <span
          class="text-highlight">0</span> 户。</span>
      </div>
      <div style="padding: 16px">
        <span class="round" style="background: #0ae8fc"></span>
        <span
          style="padding-left: 10px">户籍人员 <span class="text-highlight">{{ peopleInfo.HJRS
          }}</span> 人，共居住 <span class="text-highlight">{{ peopleInfo.JZRS
          }}</span> 人，居住户籍人员 <span class="text-highlight">{{ peopleInfo.JZHJRS }}</span> 人，居住户籍人员中超过60岁以上<span
          class="text-highlight"> {{ peopleInfo.JZHJRS_60 }}</span> 人，居住来沪人员<span
          class="text-highlight"> {{ peopleInfo.JZLHRS }}</span> 人，居住来沪人员中超过60岁以上<span
          class="text-highlight"> {{ peopleInfo.JZLHRS_60 }}</span> 人，居住境外人员<span
          class="text-highlight"> {{ peopleInfo.JZJWRS }}</span> 人。</span>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BuildingDescription",
  computed: {
    ...mapState({
      peopleInfo: state => state["building-dialog"].peopleInfo,
      houseArray: state => state["building-dialog"].houseArray
    }),
    floors() {
      return this.houseArray.length / 2;
    },
    rooms() {
      return this.houseArray.length;
    },
    // 閑置空房
    freeRooms() {
      return this.houseArray.filter(item => item.JZFWLXMC === "闲置空房").length;
    },
    // 出租房屋
    renTalRooms() {
      return this.houseArray.filter(item => item.JZFWLXMC === "出租房屋").length || 0;
    },
    // 群租房屋
    renTalRoomsMuilty() {
      return this.houseArray.filter(item => item.JZFWLXMC === "出租房屋").filter(item => item.JZRS > 5).length || 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.text-highlight {
  color: #09EAFF;
  font-size: 20px;
}

.round {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

header {
  .arrow {
    display: inline-block;
    width: 27px;
    height: 18px;
    background-image: url("../../assets/images/building-dialog/arrow.png");
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    color: #0AE8FC;
  }
}

main {
  font-size: 16px;
  font-weight: 400;
}
</style>
