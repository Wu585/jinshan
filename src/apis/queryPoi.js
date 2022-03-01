import axios from "axios";

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
