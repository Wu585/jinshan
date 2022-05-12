<template>
  <div class="wrapperx">
    <div class="dialog-wrapper" v-loading="loading">
      <div class="building-picture">
        <div class="title center">{{ $store.getters.houseUrlPrefix }} <br> {{ $store.getters.houseUrlEnd }}</div>
        <ul class="category center">
          <li>
            <span class="box" style="background: #048adf"></span>
            <span class="text">出租房屋</span>
          </li>
          <li>
            <span class="box" style="background: #03ffff"></span>
            <span class="text">闲置房屋</span>
          </li>
          <li>
            <span class="round" style="background: #03ffff"></span>
            <span class="text">群租</span>
          </li>
          <li>
            <span class="round" style="background: #f5a56e"></span>
            <span class="text">关爱</span>
          </li>
          <li>
            <span class="round" style="background: #ed5689"></span>
            <span class="text">特殊</span>
          </li>
        </ul>
        <div class="custom-scroll table-wrapper center">
          <ul class="building-table">
            <li v-for="item in roomInfoArray"
                :class="{active:selectedRoom&&item.roomNum===selectedRoom.roomNum}"
                :key="item.roomNum"
                @click="handleClickRoom(item)">
              <div class="content">
                <span class="room-number center">
                  {{ item.roomNum }}
                  <span class="people-number">({{ item.JZRS }})</span>
                </span>
              </div>
              <div class="footer center">{{ item.JZFWLXMC }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="building-info">
        <router-view></router-view>
      </div>
    </div>
    <i class="el-icon-close" @click="$router.push('/')"></i>
  </div>
</template>

<script>
import bus from "@/utils/bus";
import { getFWXQBYFWBH, getJZRBYFWBH } from "@/apis/information";

export default {
  name: "BuildingDialog",
  data() {
    return {
      loading: true,
      roomInfoArray: [],
      selectedRoom: null
    };
  },
  mounted() {
    bus.$on("finish-loading", () => {
      this.loading = false;
      this.roomInfoArray = this.$store.getters.houseArray.map(item => ({
        ...item,
        roomNum: item.SH.slice(0, -1)
      }));
      this.roomInfoArray.sort((a, b) => b.roomNum - a.roomNum);
    });
  },
  methods: {
    async handleClickRoom(item) {
      this.selectedRoom = item;
      await this.$router.push({
        name: "Tabs",
        params: {
          id: this.selectedRoom.roomNum
        }
      }).catch((error) => {
        console.log(error);
      });
      const res = await getFWXQBYFWBH(item.FWBM);
      this.$store.commit("SET_roomInfo", res.data.data[0]);
      const res1 = await getJZRBYFWBH(item.FWBM);
      this.$store.commit("SET_roomPeopleInfo", res1.data.data.filter(item => item.XM !== "null"));
    }
  }
};
</script>

<style lang="scss" scoped>
.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.box {
  display: inline-block;
  width: 10px;
  height: 10px;
}

.round {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.text {
  padding: 0 4px;
}

.wrapperx {
  position: absolute;
  z-index: 9999;
  width: 1304px;
  height: 816px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(19, 48, 82, 0.8);

  .el-icon-close {
    position: absolute;
    right: 6px;
    top: 6px;
    font-size: 32px;
    cursor: pointer;
    color: white;
  }
}

.dialog-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 32px;

  .building-picture {
    width: 588px;
    height: 749px;
    background-image: url("../../assets/images/building-dialog/building-dialog.png");
    position: relative;

    .title {
      color: white;
      font-weight: 600;
      font-size: 20px;
      top: 71px;
    }

    .category {
      top: 155px;
      display: flex;
    }

    .table-wrapper {
      height: 470px;
      width: 310px;
      overflow: auto;
      top: 180px;
      display: flex;
      padding-left: 50px;
    }

    .building-table {
      width: 235px;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 111px;
        height: 88px;
        background-image: url("../../assets/images/building-dialog/room-bg.png");
        position: relative;
        cursor: pointer;

        &.active {
          background-image: url("../../assets/images/building-dialog/room-bg-active.png");
        }

        .content {
          .room-number {
            font-size: 18px;
            top: 25px;
            white-space: nowrap;
          }

          .people-number {
            font-size: 14px;
            color: orange;
          }
        }

        .footer {
          position: absolute;
          bottom: 8px;
          white-space: nowrap;
        }
      }
    }
  }

  .building-info {
    width: 600px;
    height: 500px;
  }
}
</style>
