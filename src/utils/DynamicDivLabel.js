export class DynamicDivLabel {
  // [lon, lat, h] 经纬度
  // label 文字标签
  constructor(viewer, [lon, lat, h], label, id = "") {
    this.viewer = viewer;
    this.position = Cesium.Cartesian3.fromDegrees(lon, lat, h);
    this.divInstance = this.createDiv(label);
    this.id = id;
    this.addPostRender();
  }
  createDiv(label) {
    let divContainer = document.createElement("div");
    divContainer.id = this.id;
    divContainer.className = "divlabel-container";
    let div2 = document.createElement("div");
    div2.className = "animate-maker-border";
    let span = document.createElement("span");
    span.className = "animate-marker__text";
    span.innerText = label;
    // 添加标签
    div2.appendChild(span);
    divContainer.appendChild(div2);
    // 加入场景
    this.viewer.cesiumWidget.container.appendChild(divContainer);
    return divContainer;
  }
  addPostRender() {
    this.viewer.scene.postRender.addEventListener(this.postRender, this);
  }
  postRender() {
    const canvasHeight = this.viewer.scene.canvas.height;
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      this.position,
      windowPosition
    );
    this.divInstance.style.bottom = canvasHeight - windowPosition.y + "px";
    const elWidth = this.divInstance.offsetWidth;
    this.divInstance.style.left = windowPosition.x - elWidth / 2 + "px";
    const camerPosition = this.viewer.camera.position;
    let height =
      this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        camerPosition
      ).height;
    height += this.viewer.scene.globe.ellipsoid.maximumRadius;
    if (
      !(Cesium.Cartesian3.distance(camerPosition, this.position) > height) &&
      this.viewer.camera.positionCartographic.height < 50000000
    ) {
      this.divInstance.style.display = "block";
    } else {
      this.divInstance.style.display = "none";
    }
  }
}
