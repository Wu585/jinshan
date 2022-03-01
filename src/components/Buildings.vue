<template>
  <div class="container">
    <header>户室信息</header>
    <div class="buildings">
      <div
        style="display: flex; margin-bottom: 8px"
        v-for="item in floor"
        :key="item.floorNumber"
      >
        <div class="number" @click="setFloorsVisible(item)">
          {{ item.floorNumber }}
        </div>
        <div class="wrapper">
          <div class="swiper">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="room in item.roomNumber"
                :key="room"
                @click="selectRoom(room)"
              >
                {{ room }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buildingInfo" v-if="selectedRoom">
      <div class="title">{{ selectedRoom }}室基础信息</div>
      <ul class="description">
        <li><span></span> 成立时间: 2007年</li>
        <li><span></span> 地理位置: 淮海商圈</li>
        <li><span></span> 在职员工: 130人</li>
        <li><span></span> 所属行业: 其他金融业</li>
        <li><span></span> 公司性质: 有限责任公司</li>
        <li><span></span> 企业注册资本: 2000万元</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";

export default {
  name: "Building",
  data() {
    return {
      floor: [
        {
          floorNumber: 1,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 2,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 3,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 4,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 5,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 6,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 7,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 8,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 9,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 10,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 11,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 12,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 13,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 14,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 15,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
        {
          floorNumber: 16,
          roomNumber: [101, 102, 103, 104, 105, 106, 107, 108, 109],
        },
      ],
      selectedRoom: undefined,
    };
  },
  mounted() {
    new Swiper(".swiper", {
      slidesPerView: "auto", //设置slider容器能够同时显示的slides数量(carousel模式)。
      autoplay: false, //设置为true启动自动切换，并使用默认的切换设置。
      direction: "horizontal", //设置滑动方向
      centeredSlides: false,
      grabCursor: true, //置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。（根据浏览器形状有所不同）
      mousewheel: true, //开启鼠标滚轮控制Swiper切换。可设置鼠标选项，或true使用默认值。
    });
  },
  methods: {
    setFloorsVisible({ floorNumber }) {
      const restFloors = this.floor.filter(
        (item) => item.floorNumber !== floorNumber
      );
      restFloors.forEach((floor) => {
        // 其他楼层
        const layer = viewer.scene.layers.find(`E_${floor.floorNumber}`);
        layer.style3D.fillForeColor.alpha = 0.1;
        // 当前楼层
        viewer.scene.layers.find(
          `E_${floorNumber}`
        ).style3D.fillForeColor.alpha = 1;
      });
    },
    selectRoom(roomNumber) {
      this.selectedRoom = roomNumber;
    },
  },
};
</script>

<style lang="scss" scoped>
.buildings::-webkit-scrollbar {
  width: 0;
}

.container {
  z-index: 999;
  position: absolute;
  width: 300px;
  right: 12px;
  top: 200px;
  background: rgba(15, 44, 87, 1);
  padding-left: 14px;
  padding-bottom: 14px;

  header {
    height: 50px;
    color: #fff;
    font-size: 18px;
    font-weight: 400;
    line-height: 50px;
  }

  .buildings {
    overflow: auto;
    height: 400px;

    .wrapper {
      overflow: hidden;

      .swiper-wrapper {
        display: flex;

        div {
          color: #fff;
          height: 40px;
          background: #0d3c66;
          border: 1px solid #749dd9;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          margin-right: 10px;
          padding: 0 10px;
        }
      }
    }

    .number {
      color: #fff;
      background-image: url(../assets/images/back-circle.png);
      background-repeat: no-repeat;
      background-size: cover;
      width: 95px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .buildingInfo {
    color: #fff;
    padding-top: 6px;

    .title {
      width: 250px;
      height: 44px;
      background-image: url(../assets/images/title-bg.png);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 400;
    }

    .description {
      letter-spacing: 2px;
      font-size: 14px;
      font-weight: 400;

      > li {
        padding: 2px 0 2px 24px;

        span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
          background: rgba(38, 255, 255, 1);
        }
      }
    }
  }
}
</style>
