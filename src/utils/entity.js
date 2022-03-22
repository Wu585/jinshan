export function createEntity({ id, x, y, imagePath, name, text }) {
  return viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(x, y, 120),
    billboard: {
      image: imagePath,
      width: 40,
      height: 40,
    },
    name,
    description: "des",
    label: {
      text,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      font: "bold 20px Source Han Sans CN",
      fillColor: Cesium.Color.fromCssColorString("#0090a5"),
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 3,
      pixelOffset: new Cesium.Cartesian2(0.0, -20),
    },
    polyline: {
      show: true,
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        x,
        y,
        55,
        x,
        y,
        120,
      ]),
      width: 5,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.WHITE,
        outlineWidth: 3,
        outlineColor: Cesium.Color.fromCssColorString("#1570c0"),
      }),
    },
  });
}

export function addEntity(imagePath, lon, lat, description, text = "") {
  return viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lon, lat, 20),
    billboard: {
      image: imagePath,
      width: 40,
      height: 40,
    },
    description: JSON.stringify(description),
    label: {
      text,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      font: "bold 14px Source Han Sans CN",
      fillColor: Cesium.Color.fromCssColorString("#0090a5"),
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 3,
      pixelOffset: new Cesium.Cartesian2(0.0, -20),
    },
  });
}

export function addCameraEntity(lon, lat, description) {
  return viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lon, lat, 60),
    point: {
      color: Cesium.Color.YELLOW, //颜色
      pixelSize: 4, //点大小
    },
    description,
  });
}

export function addPolyline(pointArray, id) {
  return viewer.entities.add({
    id,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(pointArray),
      width: 8,
      material: Cesium.Color.RED,
    },
  });
}
