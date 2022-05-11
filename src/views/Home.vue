<template>
  <div class="home" id="cesiumContainer">
    <Header />
    <Search />
    <SideBar
      @show-layers-tree="layersTreeVisible = true"
      :title.sync="layersTreeTitle"
      :treeData.sync="layersTreeData"
      :treeDataProps.sync="treeDataProps"
    />
<!--    <BuildingDialog/>-->
    <!--    <Layers />-->
    <router-view></router-view>
    <LayersTree
      v-if="layersTreeVisible"
      @close-layers-tree="layersTreeVisible = false"
      :title="layersTreeTitle"
      :tree-data="layersTreeData"
      :checked-keys="checkedKeys"
      :tree-default-props="treeDataProps"
    />
    <Houses v-if="housesVisible" @hide-house="housesVisible=false" />
    <QueryPanel
      v-if="queryPanelVisible"
      @hideQueryPanel="queryPanelVisible = false"
    />
    <ViewsPanel
      v-else-if="viewsPanelVisible"
      @hideViewsPanel="viewsPanelVisible = false"
    />
    <Fxft v-if="fxftVisible" @hide-fxft="fxftVisible=false" />
    <BottomNav @update:description="poiDescription=$event"
               @show-house="housesVisible=true"
               @hide-house="housesVisible=false"
               @hide-fxft="fxftVisible=false"
               @show-fxft="fxftVisible=true"
    />
    <!--    <Map />-->
    <div id="bubble" class="bubble-wrapper-1">
      <EntityBubble :is-camera="isCamera" :description="poiDescription" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import { setViewport, transformGeometricPosition } from "@/utils/view";
import SideBar from "@/components/SideBar";
import LayersTree from "@/components/LayersTree";
import { MapUrlHashmap } from "@/assets/js/map-url";
import { s3mUrlHashmap } from "@/assets/js/s3m-url";
import EntityBubble from "@/components/EntityBubble";
import bus from "@/utils/bus";
import { dataServiceUrlHashmap } from "@/assets/js/dataService-url";
import { queryPoi } from "@/apis/queryPoi";
import { addPolyline } from "@/utils/entity";
import QueryPanel from "@/components/QueryPanel";
import BottomNav from "@/components/BottomNav";
import ViewsPanel from "@/components/ViewsPanel";
import Search from "@/components/Search";
import Houses from "@/components/Houses";
import Fxft from "@/components/Fxft";

export default {
  name: "Home",
  components: {
    Fxft,
    Search,
    ViewsPanel,
    BottomNav,
    QueryPanel,
    EntityBubble,
    LayersTree,
    SideBar,
    Header,
    Houses
  },
  data() {
    return {
      layersTreeVisible: false,
      layersTreeTitle: "",
      layersTreeData: null,
      checkedKeys: [],
      poiDescription: null,
      queryPanelVisible: false,
      viewsPanelVisible: false,
      isCamera: false,
      treeDataProps: {
        children: "children",
        label: "name"
      },
      housesVisible: false,
      fxftVisible: false
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
    bus.$on("setQueryPanelVisible", () => {
      this.queryPanelVisible = true;
      this.viewsPanelVisible = false;
    });
    bus.$on("setViewsPanelVisible", () => {
      this.viewsPanelVisible = true;
      this.queryPanelVisible = false;
    });

    await this.addAllLayers();
    // await setToken();
  },
  methods: {
    async addBoundLines() {
      window.traceLayerLines = new Cesium.CustomDataSource("traceLayerLines");
      viewer.dataSources.add(window.traceLayerLines);
      const { serviceName, dataSource, dataSets } = dataServiceUrlHashmap.find(
        (item) => item.name === "乡镇行政区"
      );
      const res = await queryPoi(serviceName, dataSource, dataSets);
      // 二维数组
      const pointsArray = [];
      const centerArray = [];
      res.data.features.forEach((polygon) => {
        const { center } = polygon.geometry;
        const { longitude, latitude } = transformGeometricPosition(
          center.x,
          center.y
        );
        // console.log(longitude, latitude);
        centerArray.push({
          center: { longitude, latitude }
        });
        const arr = [];
        polygon.geometry.points.forEach((point) => {
          const { longitude, latitude } = transformGeometricPosition(
            point.x,
            point.y
          );
          arr.push(longitude, latitude);
        });
        pointsArray.push(arr);
      });
      pointsArray.forEach((item) => {
        window.traceLayerLines.entities.add(addPolyline(item));
      });
      window.traceLayerLines.entities.show = false;
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
