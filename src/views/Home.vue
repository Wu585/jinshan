<template>
  <div class="home" id="cesiumContainer">
    <Header
      @setBuildsDialogVisible="buildsDialogVisible = !buildsDialogVisible"
    />
    <!--    <FooterTable />-->
    <!--    <InfoContainer />-->
    <Building v-show="buildsDialogVisible" />
  </div>
</template>

<script>
import Header from "@/components/Header";
import axios from "axios";
import Building from "@/components/Buildings";

export default {
  name: "Home",
  components: { Building, Header },
  data() {
    return {
      EARTH_RADIUS: 6378137.0,
      PI: Math.PI,
      linecolor: undefined,
      buildsDialogVisible: false,
    };
  },
  async mounted() {
    window.viewer = new Cesium.Viewer("cesiumContainer", {
      shadows: true,
      infoBox: false,
      contextOptions: {
        webgl: {
          alpha: true,
          depth: true,
          stencil: true,
          antialias: true,
          premultipliedAlpha: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: true,
        },
      },
    });
    const { viewer } = window;
    const { scene } = viewer;

    viewer.camera.setView({
      destination: new Cesium.Cartesian3.fromDegrees(
        121.2084528228285,
        31.2214951000063,
        100
      ),
      orientation: {
        heading: 6.119334705779381,
        pitch: -0.7930082176213968,
        roll: 6.283185307179558,
      },
    }); // 开启泛光
    scene.bloomEffect.show = true;
    scene.bloomEffect.threshold = 0.3;
    scene.bloomEffect.bloomIntensity = 1;
    // 加载s3M服务
    await this.addAllLayers();

    setTimeout(() => {
      /*this.addLightLine([121.30688903427414, 31.217951080645553], [121.30740665748, 31.217906414430226]);
      this.addLightLine([121.30688903427414, 31.217951080645553], [121.30774075058393, 31.217797948094746]);
      this.changeTransparency();*/
    }, 1000);
  },
  methods: {
    async addAllLayers() {
      const { data } = await axios.get(
        "http://192.168.0.145:8090/iserver/services/3D-jjlu/rest/realspace/datas.json"
      );
      console.log("data");
      console.log(data);
      data.map((layer) => {
        const url = layer.path + "/config";
        const name = layer.name;
        viewer.scene.addS3MTilesLayerByScp(url, { name });
      });
    },
    getRad(d) {
      return (d * this.PI) / 180.0;
    },
    getGreatCircleDistance(lng1, lat1, lng2, lat2) {
      const radLat1 = this.getRad(lat1);
      const radLat2 = this.getRad(lat2);

      const a = radLat1 - radLat2;
      const b = this.getRad(lng1) - this.getRad(lng2);

      let s =
        2 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radLat1) *
                Math.cos(radLat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      s = s * this.EARTH_RADIUS;
      s = Math.round(s * 10000) / 10000.0;
      return s;
    },
    addAirLines(startpoint, endpoint) {
      const color1 = new Cesium.Color(34 / 255, 165 / 255, 255 / 255);
      const color2 = new Cesium.Color(255 / 255, 59 / 255, 179 / 255);
      const distance = this.getGreatCircleDistance(
        parseFloat(startpoint[0]),
        parseFloat(startpoint[1]),
        parseFloat(endpoint[0]),
        parseFloat(endpoint[1])
      );
      const pointArray = [
        parseFloat(startpoint[0]),
        parseFloat(startpoint[1]),
        parseFloat(endpoint[0]),
        parseFloat(endpoint[1]),
      ];
      Math.random() < 0.5
        ? (this.linecolor = color1)
        : (this.linecolor = color2);
      viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(pointArray),
          width: 0.5, // 线的宽度，像素为单位
          material: Cesium.Color.fromCssColorString("rgba(118, 233, 241, 0.1)"),
        },
      });
      viewer.entities.add({
        name: "PolylineDynamic",
        show: true,
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(pointArray),
          width: 8,
          hMax: distance / 15,
          material: new Cesium.PolylineDynamicMaterialProperty({
            color: this.linecolor,
            outlineWidth: 0,
            outlineColor: Cesium.Color.BLACK,
            bAsy: true,
            period: 10000,
          }),
        },
      });
      // viewer.flyTo(lineEntity);
    },
    addLightLine(startpoint, endpoint) {
      viewer.entities.add({
        // 背景线
        description: "background-line",
        polyline: {
          width: 3,
          positions: Cesium.Cartesian3.fromDegreesArray([
            ...startpoint,
            ...endpoint,
          ]),
          material: new Cesium.PolylineDashMaterialProperty({
            color: new Cesium.Color(255 / 255, 249 / 255, 0, 0.5),
          }),
        },
      });

      const lineEntity = viewer.entities.add({
        // 尾迹线
        description: "trail-line",
        polyline: {
          width: 5,
          positions: Cesium.Cartesian3.fromDegreesArray([
            ...startpoint,
            ...endpoint,
          ]),
          material: new Cesium.PolylineTrailMaterialProperty({
            // 尾迹线材质
            color: Cesium.Color.fromCssColorString("rgba(118, 233, 241, 1.0)"),
            trailLength: 0.2,
            period: 5.0,
          }),
        },
      });
      viewer.flyTo(lineEntity);
    },
    changeTransparency() {
      viewer.scene.layers.find("经济楼宇");
      // louyu.style3D.fillForeColor.alpha = 0.1
      // louyu.setObjsColor([1],Cesium.Color.fromCssColorString('rgba(255, 255, 255, 1)'))
    },
  },
};
</script>

<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
