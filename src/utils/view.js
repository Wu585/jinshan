export function transformGeometricPosition(x, y) {
  const point = new Cesium.Cartesian3(x, y, 0.5); //平面坐标
  const positionTr = viewer.scene.camera._projection.unproject(point); //平面坐标值转弧度
  const longitude = Cesium.Math.toDegrees(positionTr.longitude); //弧度转经纬度
  const latitude = Cesium.Math.toDegrees(positionTr.latitude);
  return { longitude, latitude };
}

export function setViewport(x, y, z, heading, pitch, roll) {
  const point = new Cesium.Cartesian3(x, y, z); //平面坐标
  const positionTr = viewer.scene.camera._projection.unproject(point); //平面坐标值转弧度
  const longitude = Cesium.Math.toDegrees(positionTr.longitude); //弧度转经纬度
  const latitude = Cesium.Math.toDegrees(positionTr.latitude);
  viewer.camera.setView({
    destination: new Cesium.Cartesian3.fromDegrees(longitude, latitude, z),
    orientation: {
      heading,
      pitch,
      roll
    }
  });
}

export function flyTo(x, y, z, heading, pitch, roll) {
  const point = new Cesium.Cartesian3(x, y, z); //平面坐标
  const positionTr = viewer.scene.camera._projection.unproject(point); //平面坐标值转弧度
  const longitude = Cesium.Math.toDegrees(positionTr.longitude); //弧度转经纬度
  const latitude = Cesium.Math.toDegrees(positionTr.latitude);
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3.fromDegrees(longitude, latitude, z),
    orientation: {
      heading,
      pitch,
      roll
    }, duration: 1
  });
}

export function setViewportByLonAndLat(lon, lat) {
  viewer.camera.setView({
    destination: new Cesium.Cartesian3.fromDegrees(lon, lat, 100),
    orientation: {
      heading: 6.119334705779381,
      pitch: -0.7930082176213968,
      roll: 6.283185307179558
    }

  });
}
