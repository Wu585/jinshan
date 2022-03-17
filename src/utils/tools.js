let skyline; // 天际线类
let viewshed3D; // 可视域类
let pointHandler; // 点类

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
    invisibleAreaColor: "#ffffffff",
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
  handler.setInputAction(function (e) {
    // 若此标记为false，则激活对可视域分析对象的操作
    if (!scene.viewFlag) {
      //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
      var position = e.endPosition;
      var last = scene.pickPosition(position);

      //计算该点与视口位置点坐标的距离
      var distance = Cesium.Cartesian3.distance(viewPosition, last);

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

  handler.setInputAction(function () {
    //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
    scene.viewFlag = true;
    viewModel.direction = viewshed3D.direction;
    viewModel.pitch = viewshed3D.pitch;
    viewModel.distance = viewshed3D.distance;
    viewModel.horizontalFov = viewshed3D.horizontalFov;
    viewModel.verticalFov = viewshed3D.verticalFov;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  pointHandler.drawEvt.addEventListener(function (result) {
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

export function clear() {
  skyline?.clear();
  viewshed3D?.clear();
  pointHandler?.clear();
}
