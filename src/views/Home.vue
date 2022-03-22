<template>
  <div class="home" id="cesiumContainer">
    <Header />
    <SideBar
      @show-layers-tree="layersTreeVisible = true"
      :title.sync="layersTreeTitle"
      :treeData.sync="layersTreeData"
    />
    <!--    <Layers />-->
    <LayersTree
      v-if="layersTreeVisible"
      @close-layers-tree="layersTreeVisible = false"
      :title="layersTreeTitle"
      :tree-data="layersTreeData"
      :checked-keys="checkedKeys"
    />
    <QueryPanel
      v-if="queryPanelVisible"
      @hideQueryPanel="queryPanelVisible = false"
    />
    <ViewsPanel
      v-else-if="viewsPanelVisible"
      @hideViewsPanel="viewsPanelVisible = false"
    />
    <BottomNav />
    <Map />
    <div id="bubble" class="bubble-wrapper-1">
      <EntityBubble :description="poiDescription" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Header from "@/components/Header";
import { setViewport, transformGeometricPosition } from "@/utils/view";
import SideBar from "@/components/SideBar";
import LayersTree from "@/components/LayersTree";
import Map from "@/components/Map";
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

export default {
  name: "Home",
  components: {
    ViewsPanel,
    BottomNav,
    QueryPanel,
    EntityBubble,
    Map,
    LayersTree,
    SideBar,
    Header,
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

    /*scene.sun.show = false;
    scene.lightSource.ambientLightColor = new Cesium.Color(0, 0, 0, 1);
    var position1 = new Cesium.Cartesian3.fromDegrees(-0.415034617512684,-0.3550666355014696, 480);
    var targetPosition1 = new Cesium.Cartesian3.fromDegrees(-0.42094800196895676,-0.3476541457117489,430);
    var dirLightOptions = {
      targetPosition: targetPosition1,
      color: new Cesium.Color(0.01, 0.01, 0.3, 1.0),
      intensity: 0.1
    };
// 新增点光源-整个环境
    var pointLightOptions3 = {
      cutoffDistance: 2000,
      color: new Cesium.Color(0.04, 0.18, 0.43, 1.0),
      intensity: 0.001
    }*/

    setViewport(
      -23961.547803674825,
      -46502.581011517905,
      67365.37159326114,
      0.01614302261320244,
      -1.5446777533264031,
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
    await this.addBoundLines(); // 加载乡镇行政区，都是线
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
        console.log("polygon");
        console.log(polygon);
        const { center } = polygon.geometry;
        console.log("center");
        console.log(center);
        const { longitude, latitude } = transformGeometricPosition(
          center.x,
          center.y
        );
        console.log(longitude, latitude);
        centerArray.push({
          center: { longitude, latitude },
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
          name: map.name,
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
            });
          });
        }
      }
    },
    async addAllLayers() {
      this.addMapLayers();
      await this.addS3mLayers();
    },
  },
};
</script>

<style lang="scss" scoped>
.bubble-wrapper-1 {
  z-index: 99999;
  position: fixed;
  visibility: hidden;
  transform: translate(-220px);
}

#cesiumContainer {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
