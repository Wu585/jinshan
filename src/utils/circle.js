const activeShapePoints = [];
let floatingPoint;
const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

//绘制点
function createPoint(worldPosition) {
  return viewer.entities.add({
    position: worldPosition,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 5,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
}

//鼠标左键
handler.setInputAction(function(event) {
  // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
  // we get the correct point when mousing over terrain.
  const earthPosition = viewer.scene.pickPosition(event.position);
  // `earthPosition` will be undefined if our mouse is not over the globe.
  if (Cesium.defined(earthPosition)) {
    if (activeShapePoints.length === 0) {
      floatingPoint = createPoint(earthPosition);
      activeShapePoints.push(earthPosition);
      const dynamicPositions = new Cesium.CallbackProperty(function() {
        return activeShapePoints;
      }, false);
      activeShape = drawShape(dynamicPositions);//绘制动态图
    }
    activeShapePoints.push(earthPosition);
    createPoint(earthPosition);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function drawShape(positionData) {
  const value = typeof positionData.getValue === "function" ? positionData.getValue(0) : positionData;
  return viewer.entities.add({
    position: activeShapePoints[0],
    name: "Blue translucent, rotated, and extruded ellipse with outline",
    type: "Selection tool",
    ellipse: {
      semiMinorAxis: new Cesium.CallbackProperty(function() {
        //半径 两点间距离
        const r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
        return r ? r : r + 1;
      }, false),
      semiMajorAxis: new Cesium.CallbackProperty(function() {
        const r = Math.sqrt(Math.pow(value[0].x - value[value.length - 1].x, 2) + Math.pow(value[0].y - value[value.length - 1].y, 2));
        return r ? r : r + 1;
      }, false),
      material: Cesium.Color.BLUE.withAlpha(0.5),
      outline: true
    }
  });
}

//鼠标移动
handler.setInputAction(function (event) {
  if (Cesium.defined(floatingPoint)) {
    const newPosition = viewer.scene.pickPosition(event.endPosition);
    if (Cesium.defined(newPosition)) {
      floatingPoint.position.setValue(newPosition);
      activeShapePoints.pop();
      activeShapePoints.push(newPosition);
    }
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
