<template>
  <div class="home" id="cesiumContainer">
    <Header />
    <SideBar
      @show-layers-tree="layersTreeVisible = true"
      @change-title="handleChangeTitle"
    />
    <!--    <Layers />-->
    <LayersTree
      v-if="layersTreeVisible"
      @close-layers-tree="layersTreeVisible = false"
      :title="layersTreeTitle"
      :tree-data="layersTreeData"
    />
    <Map />
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import { setViewport } from "@/utils/view";
import SideBar from "@/components/SideBar";
import LayersTree from "@/components/LayersTree";
import Map from "@/components/Map";
import { MapUrlHashmap } from "@/assets/js/map-url";
import { s3mUrlHashmap } from "@/assets/js/s3m-url";

export default {
  name: "Home",
  components: { Map, LayersTree, SideBar, Header },
  data() {
    return {
      EARTH_RADIUS: 6378137.0,
      PI: Math.PI,
      linecolor: undefined,
      buildsDialogVisible: false,
      layersTreeVisible: false,
      layersTreeTitle: "",
      layersTreeData: null,
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

    await this.addAllLayers();
    this.addTraceLayers();
  },
  methods: {
    handleChangeTitle(title, treeData) {
      this.layersTreeTitle = title;
      this.layersTreeData = treeData.children;
    },
    addMapLayers() {
      MapUrlHashmap.forEach((map) => {
        const layer = new Cesium.SuperMapImageryProvider({
          url: map.url, //影像服务的地址
          name: map.name,
        });
        viewer.imageryLayers.addImageryProvider(layer);
      });
      viewer.imageryLayers._layers.forEach((item, index) => {
        if (index > 0) {
          item.show = false;
        }
      });
    },
    async addS3mLayers() {
      for (let i = 0; i < s3mUrlHashmap.length; i++) {
        for (let j = 0; j < s3mUrlHashmap[i].urls.length; j++) {
          const { data } = await axios.get(s3mUrlHashmap[i].urls[j]);
          data.map((layer) => {
            const url = layer.path + "/config";
            const name = layer.name;
            const promise = viewer.scene.addS3MTilesLayerByScp(url, { name });
            promise.then((item) => {
              item.visible = false;
            });
          });
        }
      }
    },
    async addAllLayers() {
      this.addMapLayers();
      await this.addS3mLayers();
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
