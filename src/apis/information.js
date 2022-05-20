import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API;
const supermap = process.env.VUE_APP_SUPERMAP;
const gps = process.env.VUE_APP_GPS;
const fxft = process.env.VUE_APP_FXFT;
const fxft2 = "http://10.233.250.26:8001";

export function getTree() {
  return request({
    method: "get",
    url: `${api}/collection-information/getTree`
  });
}

export function getIndexCodeByCollectionCode(collectionCode) {
  return request({
    method: "get",
    url: `${api}/point-information/getIndexCodeByCollectionCode/${collectionCode}`
  });
}

export function findCameraInfoByIndexCode(indexCode) {
  return request({
    method: "get",
    url: `${supermap}/supermap/findCameraInfoByIndexCode/${indexCode}`
  });
}

export function gps84_to_cd(lng, lat) {
  return request({
    method: "get",
    url: `${gps}/convert/gps84_to_cd`,
    params: { lat, lng }
  });
}

export function findAllParentTreeNode(treeNodeIndexcode) {
  return request({
    method: "get",
    url: `${supermap}/supermap/findAllParentTreeNode/${treeNodeIndexcode}`
  });
}

export function findHlsByIndexCode(indexCode) {
  return request({
    method: "get",
    url: `${supermap}/supermap/findHlsByIndexCode/${indexCode}`
  });
}

export function getAllPointInfo() {
  return request({
    method: "post",
    url: `${api}/point-information/getAllPointInfo`
  });
}

export function updatePointInfo(data) {
  return request({
    method: "post",
    url: `${api}/point-information/updatePointInfo`,
    data
  });
}

export function getGpsToken() {
  return request({
    method: "get",
    url: `${gps}/com/getToken4Corp?corpid=12298qz6&secret=Mf9kC3AIW8atE3v04V8atP7Hh07q1p6l`
  });
}

// 下立交
export function getXiaLiJiao() {
  return request({
    method: "get",
    url: `${gps}/exchange/getData?appid=q71T98MD&pno=1&psize=100`
  });
}

// 防汛队伍
export function getFxDw() {
  return request({
    method: "get",
    url: `${gps}/exchange/getData?appid=5Qihu9en&pno=1&psize=100`
  });
}

// 防患点
export function getFhD() {
  return request({
    method: "get",
    url: `${gps}/exchange/getData?appid=Bn0i39l9&pno=1&psize=100`
  });
}

// 实时水位
export function getAllSW() {
  return request({
    method: "get",
    url: `${fxft}/fxftZhxqSw/getAllSw/`
  });
}

// 除涝泵闸
export function getAllRecord() {
  return request({
    method: "get",
    url: `${fxft}/fxftZhxqBz/getAllRecord/`
  });
}

export function getYuLiangJC() {
  return request({
    method: "get",
    url: `${api}/getYuLiangJC`
  });
}

export function getFxft(appid) {
  return request({
    method: "get",
    url: `${gps}/exchange/getData?appid=${appid}&pno=1&psize=100`
  });
}

export function getXiaLiJiao2() {
  return request({
    method: "get",
    url: `${fxft2}/getXiaLiJiao`
  });
}

// 防汛队伍
export function getFxdw() {
  return request({
    method: "get",
    url: `${fxft2}/getFangXun`
  });
}

// 防汛物资
export function getFxwz() {
  return request({
    method: "get",
    url: `${fxft2}/getYingJiWZ`
  });
}

// 安置点
export function getAzd() {
  return request({
    method: "get",
    url: `${fxft2}/getAnZhiDian`
  });
}

// 医疗点
export function getYld() {
  return request({
    method: "get",
    url: `${fxft2}/getYiLiaoDian`
  });
}

// 隐患点
export function getYhd() {
  return request({
    method: "get",
    url: `${fxft2}/getFangXunYH`
  });
}

// 危化企业
export function getWhqy() {
  return request({
    method: "get",
    url: `${fxft2}/getWeiHuaQY`
  });
}

// 地下空间
export function getDxkj() {
  return request({
    method: "get",
    url: `${fxft2}/getDiXiaKJ`
  });
}

// 在建工地
export function getZjgd() {
  return request({
    method: "get",
    url: `${fxft2}/getZaiJianGD`
  });
}

// 玻璃幕墙
export function getBlmq() {
  return request({
    method: "get",
    url: `${fxft2}/getBoLiMQ`
  });
}

export function getBlockIdByName(name) {
  return request({
    method: "get",
    url: `${api}/xqxx/getBlockIdByName/${name}`
  });
}

export function getAllInfoByBlockId(blockId) {
  return request({
    method: "post",
    url: `${api}/getAllInfoByBlockId?blockId=${blockId}`
  });
}

export function getSummaryInfoByHouseNumber(houseUrl) {
  return request({
    method: "post",
    url: `${api}/getSummaryInfoByHouseNumber?houseUrl=${houseUrl}`
  });
}

export function getHouseInfoByHouseNumber(houseNumber) {
  return request({
    method: "post",
    url: `${api}/getHouseInfoByHouseNumber?houseNumber=${houseNumber}`
  });
}

// 根据房屋编码获取房屋信息
export function getFWXQBYFWBH(FWBM) {
  return request({
    method: "post",
    url: `${api}/getFWXQBYFWBH?houseId=${FWBM}`
  });
}

// 根据房屋编码获取居住人信息
export function getJZRBYFWBH(FWBM) {
  return request({
    method: "post",
    url: `${api}/getJZRBYFWBH?houseId=${FWBM}`
  });
}

export function getWeatherInfo() {
  return request({
    method: "post",
    url: `${api}/getDRQWTQAQI`
  });
}

// 获取所有摄像头点位
export function getAllCameraPoints() {
  return request({
    method: "post",
    url: `${api}/point-information/getAllPointInfo`
  });
}
