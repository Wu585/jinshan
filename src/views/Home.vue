<template>
  <div class="home" id="cesiumContainer">
    <Header />
    <Streets />
    <Search />
    <SideBar
      ref="sidebar"
      @show-layers-tree="layersTreeVisible = true"
      :title.sync="layersTreeTitle"
      :treeData.sync="layersTreeData"
      :treeDataProps.sync="treeDataProps"
    />
    <router-view></router-view>
    <div v-show="hasFlashed">
      <LayersTree
        v-if="layersTreeVisible"
        @close-layers-tree="layersTreeVisible = false"
        :title="layersTreeTitle"
        :tree-data="layersTreeData"
        :checked-keys="checkedKeys"
        :tree-default-props="treeDataProps"
      />
    </div>
    <component :is="$store.getters.componentName" v-if="$store.getters.componentName" />
    <BottomNav @update:description="poiDescription=$event" />
    <!--    <Map />-->
    <div id="bubble" class="bubble-wrapper-1">
      <EntityBubble :is-camera="isCamera" :description="poiDescription" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import { setViewport } from "@/utils/view";
import SideBar from "@/components/SideBar";
import LayersTree from "@/components/LayersTree";
import { MapUrlHashmap } from "@/assets/js/map-url";
import { s3mUrlHashmap } from "@/assets/js/s3m-url";
import EntityBubble from "@/components/EntityBubble";
import bus from "@/utils/bus";
import BottomNav from "@/components/BottomNav";
import Search from "@/components/Search";
import { circle } from "@turf/turf";
import Streets from "@/components/Streets";

export default {
  name: "Home",
  components: {
    Streets,
    Search,
    BottomNav,
    EntityBubble,
    LayersTree,
    SideBar,
    Header
  },
  data() {
    return {
      layersTreeVisible: false,
      layersTreeTitle: "",
      layersTreeData: null,
      checkedKeys: [],
      poiDescription: null,
      isCamera: false,
      treeDataProps: {
        children: "children",
        label: "name"
      },
      hasFlashed: false
    };
  },
  async mounted() {
    window.viewer = new Cesium.Viewer("cesiumContainer", {
      shadows: true,
      infoBox: false,
      contextOptions: {
        webgl: {
          //alpha: true,
          depth: true,
          stencil: true,
          antialias: true,
          premultipliedAlpha: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: true
        }
      }
    });
    const { scene } = viewer;
    scene.mode = Cesium.SceneMode.COLUMBUS_VIEW; // 平面场景
    scene.globe.depthTestAgainstTerrain = false; // 图标不埋地下

    viewer.scene.undergroundMode = true; //设置开启地下场景
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000; //设置相机最小缩放距离,距离地表-1000米
    viewer.scene.terrainProvider.isCreateSkirt = false; // 关闭裙边
    viewer.scene.moon.show = false;
    // viewer.scene.globe.globeAlpha=0.5;
    // Cesium.MemoryManager.setCacheSize(4096);

    setViewport(
      -27759.734718155116,
      -48104.06818978442,
      67365.37159326952,
      0.016143022611845304,
      -1.5446777533263947,
      0
    );

    bus.$on("update:description", (description) => {
      this.poiDescription = description;
    });

    await this.addAllLayers();
    await this.initPoi();

    console.log("turf");
    console.log(circle);
    const center = [-0.12350245845442284, -0.4839280278711758];
    // addCameraEntity(center[0],center[1])
    var radius = 100;
    var options = { units: "kilometers", properties: { foo: "bar" } };
    var x = circle(center, radius, options);
    console.log("x");
    console.log(x);
    window.circlePolygon = x;
  },
  methods: {
    async initPoi() {
      await this.$refs.sidebar.handleClick({
        name: "社会POI数据",
        defaultKeys: [328, 339, 345, 364, 378, 387]
      });
      setTimeout(() => {
        this.layersTreeVisible = false;
        this.hasFlashed = true;
      });
    },
    addMapLayers() {
      MapUrlHashmap.forEach((map) => {
        const layer = new Cesium.SuperMapImageryProvider({
          url: map.url, //影像服务的地址
          name: map.name
        });
        viewer.imageryLayers.addImageryProvider(layer);
      });
      viewer.imageryLayers._layers.forEach((item, index) => {
        if (
          index > 0 &&
          item._imageryProvider.name !== "村居行政区" &&
          item._imageryProvider.name !== "区级行政区"
        ) {
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
              // viewer.scene.layers.find(item.name).clearMemoryImmediately=false;
              if (item.name === "WS_NetWork" || item.name === "YS_NetWork" ||
                item.name === "YSPOINTZ_P" || item.name === "WSPOINTZ_P"
                || item.name === "WS_NetWork_Node" || item.name === "YS_NetWork_Node") {
                viewer.scene.layers.find(item.name).lodRangeScale = 200;
              }
              if (item.name === "Dimian" || item.name === "A01" || item.name === "A02" || item.name === "A03" || item.name === "A04" || item.name === "A05") {
                viewer.scene.layers.find(item.name).brightness = 4;
              }
              // if(item.name==="Baimo_SH@JS"){
              //   viewer.scene.layers.find(item.name).style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
              //   viewer.scene.layers.find(item.name).wireFrameMode = Cesium.WireFrameType.EffectOutline;
              // }
            });
          });
        }
      }
    },
    async addAllLayers() {
      this.addMapLayers();
      await this.addS3mLayers();
    }
  }
};
</script>

<style lang="scss" scoped>
.bubble-wrapper-1 {
  z-index: 998;
  position: fixed;
  visibility: hidden;
  //transform: translate(-280px, 80px);
}

#cesiumContainer {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
