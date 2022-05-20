<template>
  <div class="weather-wrapper">
    <span>气温: </span>
    <span class="weather-data">{{ weatherInfo.temperature }} ℃</span>
    <span>天气: </span>
    <span class="weather-data">{{ weatherInfo.weather }}</span>
    <span>AQI: </span>
    <span class="weather-data">{{ weatherInfo.aqi }}</span>
    <span>风向: </span>
    <span class="weather-data">{{ weatherInfo.fx }}</span>
    <span>风力: </span>
    <span class="weather-data">{{ weatherInfo.fl }}</span>
    <span>湿度: </span>
    <span class="weather-data">{{ weatherInfo.sd }}</span>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { getWeatherInfo } from "@/apis/information";

export default {
  name: "Weather",
  data() {
    return {
      date: "",
      time: "",
      weatherInfo: {
        temperature: "",
        aqi: "",
        weather: "",
        fx:"",
        fl:"",
        sd:""
      }
    };
  },
  mounted() {
    // this.getDateAndTime();
    setInterval(() => {
      this.getWeatherInfo();
    }, 1000 * 60 * 60);
    this.getWeatherInfo();
  },
  methods: {
    getDateAndTime() {
      this.date = dayjs().format("YYYY-MM-DD");
      setInterval(() => {
        this.time = dayjs().format("HH:mm:ss");
        if (this.time === "00:00:00") {
          this.date = dayjs().format("YYYY-MM-DD");
        }
      }, 1000);
    },
    async getWeatherInfo() {
      const res = await getWeatherInfo();
      this.weatherInfo.temperature = res.data.data[0].TEM;
      this.weatherInfo.aqi = res.data.data[0].AQIVAL;
      this.weatherInfo.weather = res.data.data[0].WEATHER;
      this.weatherInfo.fx = res.data.data[0].FX;
      this.weatherInfo.fl = res.data.data[0].FL;
      this.weatherInfo.sd = res.data.data[0].SD;
    }
  }
};
</script>

<style lang="scss" scoped>
.weather-wrapper {
  position: absolute;
  z-index: 999;
  height: 20px;
  left: 300px;

  span {
    font-size: 16px;

    &.weather-data {
      color: #FFA721;
      padding: 0 12px 0 6px;
    }
  }
}
</style>
