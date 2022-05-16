import bus from "@/utils/bus";
import { flyTo, transformGeometricPosition } from "@/utils/view";
import QueryPanel from "@/components/QueryPanel";
import { getAllInfoByBlockId, getBlockIdByName } from "@/apis/information";
import { xiaoquMap } from "@/assets/js/xiaoqu";
import store from "@/store";

let skyline; // 天际线类
let viewshed3D; // 可视域类
let pointHandler; // 点类
// let isGetPosition = false;

let layers,
  isoline,
  lineHeight,
  setHypFlag,
  height_0 = 0,
  point1,
  point2;
let isShowLine = true;
let handlerDis, handlerHeight;
let clampMode = 0; // 空间模式
let scenePosition;
let hasListener = false;

// 初始化等高线
function init() {
  // 等高线
  isoline = new Cesium.HypsometricSetting();
  isoline.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
  let colorTable = new Cesium.ColorTable();
  isoline._lineColor = Cesium.Color.fromCssColorString("#ff7d00");
  isoline.ColorTable = colorTable;
  isoline.Opacity = 0.6;
  isoline.MaxVisibleValue = -100;
  isoline.MinVisibleValue = -100;
  layers = viewer.scene.layers.layerQueue;
  viewer.scene.globe.HypsometricSetting = {
    hypsometricSetting: isoline,
    analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
  };
}

export function calcDistance() {
  handlerDis = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Distance,
    clampMode
  );
  handlerDis.measureEvt.addEventListener(function(result) {
    const dis = Number(result.distance);
    // const positions = result.positions;
    const distance =
      dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
    handlerDis.disLabel.text = "距离:" + distance;
  });
  handlerDis && handlerDis.activate();
}

// 初始化设置图层等高线
function setHypsometricSetting() {
  for (let i = 0; i < layers.length; i++) {
    layers[i].hypsometricSetting = {
      hypsometricSetting: isoline,
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
    };
  }
  setHypFlag = true;
}

//   设置等值线
function updateContourLine(height) {
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MaxVisibleValue =
    height;
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MinVisibleValue =
    height;
  if (!setHypFlag) return;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].hypsometricSetting.hypsometricSetting) {
      layers[i].hypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
      layers[i].hypsometricSetting.hypsometricSetting.MinVisibleValue = height;
    } else {
      setHypsometricSetting();
    }
  }
}

export function calcHeight() {
  init();
  const { scene } = viewer;
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
  handlerHeight.measureEvt.addEventListener(function(result) {
    const distance =
      result.distance > 1000
        ? (result.distance / 1000).toFixed(2) + "km"
        : result.distance + "m";
    const vHeight =
      result.verticalHeight > 1000
        ? (result.verticalHeight / 1000).toFixed(2) + "km"
        : result.verticalHeight + "m";
    const hDistance =
      result.horizontalDistance > 1000
        ? (result.horizontalDistance / 1000).toFixed(2) + "km"
        : result.horizontalDistance + "m";
    handlerHeight.disLabel.text = "空间距离:" + distance;
    handlerHeight.vLabel.text = "垂直高度:" + vHeight;
    handlerHeight.hLabel.text = "水平距离:" + hDistance;
    //实时等高线显示
    point1 = Cesium.Cartographic.fromCartesian(result.verticalPositions[0]);
    point2 = Cesium.Cartographic.fromCartesian(result.verticalPositions[1]);
    if (point1.height > point2.height)
      lineHeight = Number(result.verticalHeight) + height_0;
    else lineHeight = -Number(result.verticalHeight) + height_0;
    if (isShowLine) updateContourLine(lineHeight);
  });
  handler.setInputAction(
    measureHeightClk,
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );

  function measureHeightClk(e) {
    //记录点击点高度
    let position = scene.pickPosition(e.position);
    let p = Cesium.Cartographic.fromCartesian(position); // 将获取的点的位置转化成经纬度
    height_0 = p.height;
  }

  handlerHeight && handlerHeight.activate();
}

const cb = () => {
  if (scenePosition) {
    const canvasHeight = viewer.scene.canvas.height;
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      viewer.scene,
      scenePosition,
      windowPosition
    );
    const infoboxContainer = document.getElementById("bubble");
    infoboxContainer.style.bottom = canvasHeight - windowPosition.y + "px";
    infoboxContainer.style.left = windowPosition.x - 280 + "px";
    console.log("infoboxContainer.offsetWidth", infoboxContainer.offsetWidth);
    infoboxContainer.style.visibility = "visible";
  }
};

export const addListener = () => {
  if (!hasListener) {
    viewer.scene.postRender.addEventListener(cb);
    hasListener = true;
  }
};

async function leftClickListenFunc(movement) {
  isClickQuery = true;
  const infoboxContainer = document.getElementById("bubble");
  infoboxContainer.style.visibility = "hidden";
  const pick = viewer.scene.pick(movement.position);
  console.log(pick);

  const cartesian = viewer.scene.pickPosition2D(movement.position);
  console.log("cartesian");
  console.log(cartesian);
  const { longitude, latitude } = transformGeometricPosition(cartesian.x, cartesian.y);
  console.log("lon lat");
  console.log(longitude, latitude);

  if (pick?.primitive?._baseUri?.path.indexOf("Camera_Model") >= 0) {
    bus.$emit("update:description", null, "31011619001180026011", "monitor");
    const cartesian = viewer.scene.pickPosition2D(movement.position);
    const { longitude, latitude } = transformGeometricPosition(cartesian.x, cartesian.y);
    scenePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
    addListener();
  } else if (pick && pick.id && pick.id._description) {
    // 针对poi点击
    // 视频监控poi不弹出bubble面板
    if (pick.id._name === "monitor") {
      store.commit("SET_componentName", "camera-video");
      const description = pick.id._description._value;
      bus.$emit("update:description", JSON.parse(description) || {}, pick.id.id, pick.id._name);
      store.commit("SET_firstCameraId", pick.id.id);
      return;
    }
    const description = pick.id._description._value;
    bus.$emit("update:description", JSON.parse(description) || {}, pick.id.id, pick.id._name);
    const cartesian = viewer.scene.pickPosition2D(movement.position);
    // const entityId = pick.id._id;
    if (pick.id.name === "小区") {
      // 小区面板信息处理
      const res1 = await getBlockIdByName(JSON.parse(description)["名称"]);
      const blockId = res1.data.data.blockId;
      if (blockId) {
        const res2 = await getAllInfoByBlockId(blockId.blockId);
        const xiaoquAttr = {};
        for (let key in xiaoquMap) {
          xiaoquAttr[xiaoquMap[key]] = res2.data.data[0][key];
        }
        bus.$emit("update:description", xiaoquAttr, pick.id.id, pick.id._name);
      }
    }
    /*viewer.flyTo(
      viewer.entities.getById(entityId), {
        offset: new Cesium.HeadingPitchRange(viewer.camera.heading, viewer.camera.pitch, 45000)
      }
    );*/
    const { heading, pitch, roll } = viewer.camera;
    flyTo(cartesian.x, cartesian.y, viewer.camera.position.z, heading, pitch, roll);
    const { longitude, latitude } = transformGeometricPosition(cartesian.x, cartesian.y);
    scenePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
    addListener();
  } else if (pick && pick?.primitive.queryParameter) {
    // 针对人房信息点击
    const cartesian = viewer.scene.pickPosition2D(movement.position);
    const { longitude, latitude } = transformGeometricPosition(cartesian.x, cartesian.y);
    scenePosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
    addListener();
    clearBubble();
    // await router.push('dialog/description')
  }
}

export function clickQuery() {
  if (isClickQuery) {
    return;
  }
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(leftClickListenFunc, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export function handleSkyline() {
  skyline?.clear();
  const { scene } = viewer;
  skyline = new Cesium.Skyline(scene); //创建天际线分析对象
  const cartographic = scene.camera.positionCartographic;
  console.log("cartographic");
  console.log(cartographic);
  const longitude = Cesium.Math.toDegrees(cartographic.longitude);
  const latitude = Cesium.Math.toDegrees(cartographic.latitude);
  const height = cartographic.height;
  skyline.viewPosition = [longitude, latitude, height];
  //设置俯仰和方向
  skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
  skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);
  skyline.radius = 10000; // 天际线分析半径设置为10000米
  skyline.build();
}

export function handleVisual() {
  const { scene } = viewer;

  viewshed3D?.clear();
  pointHandler?.clear();

  const viewModel = {
    direction: 1.0,
    pitch: 1.0,
    distance: 1.0,
    verticalFov: 1.0,
    horizontalFov: 1.0,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff"
  };
  let viewPosition;
  // 先将此标记置为true，不激活鼠标移动事件中对可视域分析对象的操作
  scene.viewFlag = true;
  pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);
  // 创建可视域分析对象
  viewshed3D = new Cesium.ViewShed3D(scene);

  viewshed3D.distance = 0.1;
  scene.viewFlag = true;

  //激活绘制点类
  pointHandler.activate();

  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  // 鼠标移动时间回调
  handler.setInputAction(function(e) {
    // 若此标记为false，则激活对可视域分析对象的操作
    if (!scene.viewFlag) {
      //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
      const position = e.endPosition;
      const last = scene.pickPosition(position);

      //计算该点与视口位置点坐标的距离
      const distance = Cesium.Cartesian3.distance(viewPosition, last);

      if (distance > 0) {
        // 将鼠标当前点坐标转化成经纬度
        const cartographic = Cesium.Cartographic.fromCartesian(last);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height;
        // 通过该点设置可视域分析对象的距离及方向
        viewshed3D.setDistDirByPoint([longitude, latitude, height]);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(function() {
    //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
    scene.viewFlag = true;
    viewModel.direction = viewshed3D.direction;
    viewModel.pitch = viewshed3D.pitch;
    viewModel.distance = viewshed3D.distance;
    viewModel.horizontalFov = viewshed3D.horizontalFov;
    viewModel.verticalFov = viewshed3D.verticalFov;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  pointHandler.drawEvt.addEventListener(function(result) {
    const point = result.object;
    const position = point.position;
    viewPosition = position;

    // 将获取的点的位置转化成经纬度
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    const height = cartographic.height + 1.8;
    point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);

    if (scene.viewFlag) {
      // 设置视口位置
      viewshed3D.viewPosition = [longitude, latitude, height];
      viewshed3D.build();
      // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
      scene.viewFlag = false;
    }
  });
}

export function initView() {
  flyTo(
    -23961.547803674825,
    -46502.581011517905,
    67365.37159326114,
    0.01614302261320244,
    -1.5446777533264031,
    0
  );
}

export function queryByRegion() {
  store.commit("SET_componentName", "query-panel");
}

export function viewsMange() {
  store.commit("SET_componentName", "views-panel");
}

export function clearBubble() {
  viewer.scene.postRender.removeEventListener(cb);
  hasListener = false;
  document.getElementById("bubble").style.visibility = "hidden";
}

export function clear() {
  bus.$emit("clear");
  handlerDis && handlerDis.deactivate();
  handlerDis && handlerDis.clear();
  handlerHeight && handlerHeight.deactivate();
  handlerHeight && handlerHeight.clear();
  skyline?.clear();
  viewshed3D?.clear();
  pointHandler?.clear();
  QueryPanel.methods.clear();
}

export function debounce(fn, delay) {
  let timerId = null;
  return function() {
    let context = this;
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(context, arguments);
    }, delay || 500);
  };
}

export function addS3mModel(url, position) {
  const { scene } = viewer;
  const s3mInstanceColc = new Cesium.S3MInstanceCollection(scene._context);
  scene.primitives.add(s3mInstanceColc);
  s3mInstanceColc.add(url, {
    position,
    hpr: new Cesium.HeadingPitchRoll(0, 0, 0),
    scale: new Cesium.Cartesian3(1, 1, 1),
    color: Cesium.Color.WHITE
  });
}

export function initSystem(){

}
