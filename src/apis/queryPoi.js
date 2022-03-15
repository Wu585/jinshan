import axios from "axios";

// 查询所有poi坐标
export function queryPoi(dataSourceName, dataSetName) {
  const dataServiceUrl =
    iServerIP_Port +
    `/iserver/services/data-${dataSourceName}/rest/data/featureResults.rjson?returnContent=true`; // 数据服务URL
  const queryObj = {
    getFeatureMode: "SQL",
    datasetNames: [dataSourceName + ":" + dataSetName],
    maxFeatures: 1000000,
    queryParameter: {
      attributeFilter: "SMID>0",
    },
  };
  return axios({
    method: "post",
    url: dataServiceUrl,
    data: queryObj,
  });
}

// 根据范围面空间查询
export function queryPoiBySpecial(pointsArray, dataSourceName, dataSetName) {
  const dataServiceUrl =
    iServerIP_Port +
    `/iserver/services/data-${dataSourceName}/rest/data/featureResults.rjson?returnContent=true`; // 数据服务URL
  const queryObj = {
    getFeatureMode: "SPATIAL",
    spatialQueryMode: "INTERSECT",
    datasetNames: [dataSourceName + ":" + dataSetName],
    geometry: {
      id: 1,
      parts: [4],
      points: pointsArray,
      type: "REGION",
      style: null,
      // polygon
    },
  };
  return axios({
    url: dataServiceUrl,
    method: "post",
    data: queryObj,
  });
}
