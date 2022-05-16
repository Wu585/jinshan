import axios from "axios";
import request from "@/utils/request";

// 查询所有poi坐标
export function queryPoi(serviceName, dataSourceName, dataSetName, idType = "SMID", serviceIp = iServerIP_Port) {
  const dataServiceUrl =
    serviceIp +
    `/iserver/services/data-${serviceName}/rest/data/featureResults.rjson?returnContent=true`; // 数据服务URL
  const queryObj = {
    getFeatureMode: "SQL",
    datasetNames: [dataSourceName + ":" + dataSetName],
    maxFeatures: 1000000,
    queryParameter: {
      attributeFilter: `${idType}>0`
    }
  };
  return request({
    method: "post",
    url: dataServiceUrl,
    data: queryObj
  });
}

// 查询数据集下所有子集名
export function queryChildren(serviceName, dataSourceName) {
  const url = `${iServerIP_Port}/iserver/services/data-${serviceName}/rest/data/datasources/${dataSourceName}/datasets.json`;
  return axios({
    method: "get",
    url
  });
}

// 根据范围面空间查询
export function queryPoiBySpecial(
  pointsArray,
  serviceName,
  dataSourceName,
  dataSetName,
  severIp = iServerIP_Port
) {
  const dataServiceUrl =
    severIp +
    `/iserver/services/data-${serviceName}/rest/data/featureResults.rjson?returnContent=true`; // 数据服务URL
  const queryObj = {
    getFeatureMode: "SPATIAL",
    spatialQueryMode: "INTERSECT",
    datasetNames: [dataSourceName + ":" + dataSetName],
    geometry: {
      id: 1,
      parts: [4],
      points: pointsArray,
      type: "REGION",
      style: null
      // polygon
    },
    maxFeatures: -1
  };
  return axios({
    url: dataServiceUrl,
    method: "post",
    data: queryObj
  });
}

export function queryByCircle(pointsArray,
                  serviceName,
                  dataSourceName,
                  dataSetName,
                  bufferDistance,
                  severIp = iServerIP_Port) {
  const dataServiceUrl =
    severIp +
    `/iserver/services/data-${serviceName}/rest/data/featureResults.rjson?returnContent=true`; // 数据服务URL
  const queryObj = {
    getFeatureMode: "BUFFER",
    datasetNames: [dataSourceName + ":" + dataSetName],
    geometry: {
      id: 1,
      parts: [1],
      points: pointsArray,
      type: "POINT",
      style: null
      // polygon
    },
    maxFeatures: -1,
    bufferDistance
  };
  return axios({
    url: dataServiceUrl,
    method: "post",
    data: queryObj
  });
}
