// 点聚合
export class PointCluster {
  constructor(viewer, data = [], imagePath, option = {}) {
    this.viewer = viewer;
    option = Object.assign(
      {},
      {
        enabled: true,
        pixelRange: 100, //聚合像素
        minimumClusterSize: 2, //最低聚合数
        billboardImg: imagePath,
        defaultEntity: false, //使用默认entity
        colors: [
          {
            value: 100, //聚合数大于等于100红色
            color: "rgb(255,0,0)",
          },
          {
            value: 50, //聚合数大于等于50黄
            color: "rgb(255,255,0)",
          },
          {
            value: 10, //聚合数大于等于10蓝色
            color: "rgb(51,133,255)",
          },
          {
            value: 1, //聚合数大于等于1绿
            color: "rgb(0,255,0)",
          },
        ], //绘制默认样式
      },
      option
    );
    this.options = option;
    // 创建群组
    this.dataSource = new Cesium.CustomDataSource("traceLayer");
    this.viewer.dataSources.add(this.dataSource);
    // enabled - false，单纯创建entity，enabled - true，使用聚合
    // 使用点聚合，entity类型为广告牌，点，标签
    if (option.enabled === true) {
      // 是否开启群组
      this.dataSource.clustering.enabled = option.enabled;
      // 扩展屏幕空间边界框的像素范围
      this.dataSource.clustering.pixelRange = option.pixelRange;
      // 可以聚集的最小屏幕空间对象数
      this.dataSource.clustering.minimumClusterSize = option.minimumClusterSize;
      // clusteredEntities就是被聚合的那些entity，cluster就是聚合之后形成的那个entity；
      this.dataSource.clustering.clusterEvent.addEventListener(
        (clusteredEntities, cluster) => {
          // 关闭自带的显示聚合数量的标签
          cluster.label.show = false;
          cluster.billboard.show = true;
          cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          // 根据聚合数量的多少设置不同层级的颜色以及大小
          if (
            this.options["colors"] !== undefined &&
            this.options["colors"].constructor.name === "Array"
          ) {
            let colors = this.options["colors"];
            let cl = colors.length;
            for (let i = 0; i < cl; i++) {
              let ele = colors[i];
              if (clusteredEntities.length >= ele["value"]) {
                cluster.billboard.image = this.combineIconAndLabel1(
                  ele["color"],
                  clusteredEntities.length,
                  64
                );
                let w = ele["size"],
                  h = ele["size"];
                if (ele["size"] === undefined) {
                  let num = (ele["value"] / 36).toFixed(2);
                  w = 36 + 20 * num;
                  h = 36 + 20 * num;
                }
                cluster.billboard.width = w;
                cluster.billboard.height = h;
                break;
              }
            }
            return;
          }
          // 根据聚合数量的多少设置不同层级的图片以及大小
          if (clusteredEntities.length >= 3 && clusteredEntities.length < 10) {
            // 色调-#008CFF
            cluster.billboard.image = this.combineIconAndLabel(
              "./images/cricle1.png",
              clusteredEntities.length,
              64
            );
            cluster.billboard.width = 40;
            cluster.billboard.height = 40;
          } else if (
            clusteredEntities.length >= 10 &&
            clusteredEntities.length < 30
          ) {
            // 色调-#008CFF
            cluster.billboard.image = this.combineIconAndLabel(
              "./images/cricle1.png",
              clusteredEntities.length,
              64
            );
            cluster.billboard.width = 44;
            cluster.billboard.height = 44;
          } else if (
            clusteredEntities.length >= 30 &&
            clusteredEntities.length < 100
          ) {
            // 色调-#FFBE0A
            cluster.billboard.image = this.combineIconAndLabel(
              "./images/cricle2.png",
              clusteredEntities.length,
              64
            );
            cluster.billboard.width = 48;
            cluster.billboard.height = 48;
          } else if (
            clusteredEntities.length >= 100 &&
            clusteredEntities.length < 150
          ) {
            // 色调-#DC143C
            cluster.billboard.image = this.combineIconAndLabel(
              "./images/cricle3.png",
              clusteredEntities.length,
              64
            );
            cluster.billboard.width = 52;
            cluster.billboard.height = 52;
          } else if (clusteredEntities.length >= 150) {
            // 色调-#FF00FF
            cluster.billboard.image = this.combineIconAndLabel(
              "./images/cricle4.png",
              clusteredEntities.length,
              64
            );
            cluster.billboard.width = 58;
            cluster.billboard.height = 58;
          } else {
            cluster.billboard.image = this.combineIconAndLabel(
              "./images/cricle1.png",
              clusteredEntities.length,
              64
            );
            cluster.billboard.width = 36;
            cluster.billboard.height = 36;
          }
        }
      );
    }
    if (option.defaultEntity === false) {
      // 创建entity
      this.createEntity(data);
    }
  }

  createEntity(data) {
    for (let i = 0; i < data.length; i++) {
      // let text = 'poi-'+i;
      let lon = data[i][0];
      let lat = data[i][1];
      let h = data[i][3] || 20;
      this.dataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, h),
        /*label: {
                    text: text,
                    color: Cesium.Color.BLACK,
                    font: 'bold 52px Microsoft YaHei',
                    scale: 0.25,
                    fillColor: Cesium.Color.WHITESMOKE,
                    outlineWidth: 5,
                    outlineColor: Cesium.Color.fromCssColorString('#000'),
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE, //为Cesium.LabelStyle.CENTER_LABEL时不可设置outline
                    showBackground: false,
                    // 竖直对齐方式
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    // 水平对齐方式
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    // 偏移量
                    pixelOffset: new Cesium.Cartesian2(0, -36)
                },*/
        description: JSON.stringify(data[i][2]),
        billboard: {
          image: this.options["billboardImg"],
          width: 32, // 宽高必须设置，否则首次无法聚合
          height: 32,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
        point: {
          color: Cesium.Color.YELLOW, //颜色
          pixelSize: 4, //点大小
        },
      });
    }
  }

  addEntity(entity) {
    this.dataSource.entities.add(entity);
  }

  removeDataSource() {
    this.viewer.dataSources.remove(this.dataSource);
  }

  showDataSource(boolean) {
    this.dataSource.show = boolean;
  }

  combineIconAndLabel(url, label, size) {
    // 创建画布对象
    let canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    let ctx = canvas.getContext("2d");
    let promise = new Cesium.Resource.fetchImage(url).then((image) => {
      // 异常判断
      try {
        ctx.drawImage(image, 0, 0);
      } catch (e) {
        console.log(e);
      }
      // 渲染字体
      // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
      ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
      ctx.font = "bold 20px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, size / 2, size / 2);
      return canvas;
    });
    return promise;
  }

  combineIconAndLabel1(color, label, size) {
    // 创建画布对象
    let canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 6, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = Cesium.Color.WHITE.toCssColorString();
    ctx.font = "bold 20pt Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, size / 2, size / 2);
    return canvas;
  }
}
