export function createEntity({ id, x, y, imagePath, name, text }) {
  return viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(x, y, 120),
    billboard: {
      image: imagePath,
      width: 40,
      height: 40
    },
    name,
    label: {
      text,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      font: "bold 20px Source Han Sans CN",
      fillColor: Cesium.Color.fromCssColorString("#0090a5"),
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 3,
      pixelOffset: new Cesium.Cartesian2(0.0, -20)
    },
    polyline: {
      show: true,
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        x,
        y,
        55,
        x,
        y,
        120
      ]),
      width: 5,
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.WHITE,
        outlineWidth: 3,
        outlineColor: Cesium.Color.fromCssColorString("#1570c0")
      })
    }
  });
}

export function addEntity(imagePath, lon, lat, description = "", name = "", id) {
  return viewer.entities.add({
    id,
    name,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, 20),
    billboard: {
      image: imagePath,
      width: 20,
      height: 25
    },
    description
  });
}

export function addEntityWithLabel(imagePath, lon, lat, description = "", name = "", text, fontsize,id) {
  return viewer.entities.add({
    id,
    name,
    label: {
      text,
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      font:`bold ${fontsize}px Microsoft YaHei`,
      pixelOffset: new Cesium.Cartesian2(15, -3)
    },
    position: Cesium.Cartesian3.fromDegrees(lon, lat, 20),
    billboard: {
      image: imagePath,
      width: 20,
      height: 25
    },
    description
  });
}

export function addEntityWithDistance(imagePath, lon, lat, description = "", name = "", id) {
  return viewer.entities.add({
    id,
    name,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, 20),
    billboard: {
      image: imagePath,
      width: 20,
      height: 22,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000)
    },
    description
  });
}

export function addCameraEntity(lon, lat, description) {
  return viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lon, lat, 60),
    point: {
      color: Cesium.Color.YELLOW, //??????
      pixelSize: 40 //?????????
    },
    description
  });
}

export function addPolyline(pointArray, id) {
  return viewer.entities.add({
    id,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(pointArray),
      width: 6,
      material: Cesium.Color.fromCssColorString(`rgba(0, 226, 176, 1)`)
    }
  });
}

export function addLabel({ x, y, z }, label, [r, g, b, a] = [1, 1, 1, 1]) {
  return viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(x, y, z),
    label: {
      text: label,
      font: "8pt Source Han Sans CN", //????????????
      fillColor: Cesium.Color.fromCssColorString(`rgba(255, 255, 255, 1)`), //????????????
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 20,
      // backgroundColor: Cesium.Color.fromCssColorString(`rgba(51,52,140,1)`),
      backgroundColor: Cesium.Color.ORANGE,
      showBackground: true,
      verticalOrigin: Cesium.VerticalOrigin.CENTER, //????????????
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //????????????
      pixelOffset: new Cesium.Cartesian2(10, 0) //??????
    }
  });
}

export function addMapLabel({ x, y, z }, label, [r, g, b, a] = [1, 1, 1, 1]) {
  return viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(x, y, z),
    label: {
      text: label,
      font: "14pt Source Han Sans CN", //????????????
      fillColor: Cesium.Color.fromCssColorString(`rgba(255, 255, 255, 1)`), //????????????
      // backgroundColor: Cesium.Color.fromCssColorString(`rgba(51,52,140,1)`),
      verticalOrigin: Cesium.VerticalOrigin.CENTER, //????????????
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //????????????
      pixelOffset: new Cesium.Cartesian2(10, 0) //??????
    }
  });
}

export function addPolygon(pointArray, id, fill = true, outline = false) {
  return viewer.entities.add({
    id,
    fill,
    outline,
    outlineColor: Cesium.Color.RED,
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(pointArray),
      material: Cesium.Color.fromCssColorString(`rgba(0, 0, 0, 1)`),
      height: 0
    }
  });
}

export function addDynamicWall(pointsArray, minmumHeights, maxmumHeights, dayMaxmumHeights, fenceHeight, wallSteep) {
  return viewer.entities.add({
    wall: {
      positions: new Cesium.CallbackProperty(e => {
        return Cesium.Cartesian3.fromDegreesArray(pointsArray);
      }, false),
      minimumHeights: new Cesium.CallbackProperty(e => {
        return minmumHeights;
      }, false),
      maximumHeights: new Cesium.CallbackProperty(e => {
        minmumHeights.forEach((ele, index) => {
          dayMaxmumHeights[index] += fenceHeight * wallSteep;
          if (dayMaxmumHeights[index] > maxmumHeights[index]) {
            dayMaxmumHeights[index] = minmumHeights[index];
          }
        });
        return dayMaxmumHeights;
      }, false),
      material: new Cesium.ImageMaterialProperty({
        image: "./images/dynamicDTH.png",
        transparent: true
      })
    }
  });
}

export function resetEntitiesArray(arr) {
  arr.forEach(entity => viewer.entities.remove(entity));
  arr.splice(0, arr.length);
}

export function addBillboard(lon, lat, imgPath) {
  return viewer.entities.add({
    position: new Cesium.Cartesian3.fromDegrees(
      lon, lat, 150
    ),
    billboard: {
      image: imgPath,
      width: 150,
      height: 80
    }
  });
}
