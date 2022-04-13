import request from "@/utils/request";

const api = process.env.VUE_APP_BASE_API;
const supermap = process.env.VUE_APP_SUPERMAP;
const gps = process.env.VUE_APP_GPS;

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

export function updatePointInfo(data){
  return request({
    method:'post',
    url:`${api}/point-information/updatePointInfo`,
    data
  })
}
