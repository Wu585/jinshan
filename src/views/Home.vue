<template>
  <div class="home" id="cesiumContainer">
    <Header />
    <Layers />
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import Layers from "@/components/Layers";
import { setViewport } from "@/utils/view";

export default {
  name: "Home",
  components: { Layers, Header },
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
    const { scene } = viewer;
    scene.mode = Cesium.SceneMode.COLUMBUS_VIEW; // 平面场景
    scene.globe.depthTestAgainstTerrain = false; // 图标不埋地下
    setViewport(
      -44284.506684487686,
      -35422.487200479954,
      130.52507693413645,
      2.416732144074675,
      -0.04451864534215688,
      6.283185307179586
    );
    /*scene.bloomEffect.show = true;
    scene.bloomEffect.threshold = 0.3;
    scene.bloomEffect.bloomIntensity = 1;*/
    // 加载s3M服务
    await this.addAllLayers();
    this.addTraceLayers();
  },
  methods: {
    async addAllLayers() {
      const { data: data1 } = await axios.get(
        `${iServerIP_Port}/iserver/services/3D-JS_Model/rest/realspace/datas.json`
      );
      const { data: data2 } = await axios.get(
        `${iServerIP_Port}/iserver/services/3D-CBD2/rest/realspace/datas.json`
      );
      data1.map((layer) => {
        const url = layer.path + "/config";
        const name = layer.name;
        viewer.scene.addS3MTilesLayerByScp(url, { name });
      });
      data2.map((layer) => {
        const url = layer.path + "/config";
        const name = layer.name;
        viewer.scene.addS3MTilesLayerByScp(url, { name });
      });
      const mapUrls = [
        /*{
          name: "矢量底图",
          url: `${iServerIP_Port}/iserver/services/map-ugcv5-JSmap2d/rest/maps/JS_map_2d`,
        },*/
        {
          name: "影像底图",
          url: `${iServerIP_Port}/iserver/services/map-arcgis-basemapair/rest/maps/basemap_air`,
        },
        {
          name: "暗色底图",
          url: `${iServerIP_Port}/iserver/services/map-arcgis-basemapdark/rest/maps/basemap_dark`,
        },
        {
          name: "政务底图",
          url: `${iServerIP_Port}/iserver/services/map-arcgis-basemaplight/rest/maps/basemap_light`,
        },
        {
          name: "金山区边界底图",
          url: `${iServerIP_Port}/iserver/services/map-arcgis-jsmaskboundary/rest/maps/jsmaskboundary`,
        },
        /*{
          name: "水系底图",
          url: `${iServerIP_Port}/iserver/services/map-arcgis-wbshsx/rest/maps/wb_sh_sx`
        }*/
      ];
      mapUrls.forEach((map) => {
        const layer = new Cesium.SuperMapImageryProvider({
          url: map.url, //影像服务的地址
          name: map.name,
        });
        viewer.imageryLayers.addImageryProvider(layer);
      });
      setTimeout(() => {
        viewer.imageryLayers._layers.forEach((item, index) => {
          if (index > 0) {
            item.show = false;
          }
        });
      }, 2000);
    },
    addTraceLayers() {
      for (let i = 1; i <= 17; i++) {
        const name = "traceLayer" + i;
        window[name] = new Cesium.CustomDataSource("traceLayer");
        viewer.dataSources.add(window[name]);
      }
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
