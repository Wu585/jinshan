import axios from "axios";
import { queryPoi } from "@/apis/queryPoi";

export function addView(name, X, Y, Z, heading, pitch, roll, cb) {
  const features = {
    fieldNames: [
      "name",
      "positionX",
      "positionY",
      "positionZ",
      "heading",
      "pitch",
      "roll",
    ],
    fieldValues: [name, X, Y, Z, heading, pitch, roll],
  };
  const editFeatureParameter = new SuperMap.REST.EditFeaturesParameters({
    features: [features],
    editType: SuperMap.REST.EditType.ADD,
    returnContent: false,
  });
  const editFeatureService = new SuperMap.REST.EditFeaturesService(
    `${iServerIP_Port}/iserver/services/data-view/rest/data/datasources/view/datasets/cameraView`,
    {
      eventListeners: {
        processCompleted: cb,
      },
    }
  );
  editFeatureService.processAsync(editFeatureParameter);
}

export function getView() {
  return queryPoi("view", "view", "cameraView");
}

export function deleteView(id) {
  const query = [id];
  const dataServiceUrl =
    iServerIP_Port +
    `/iserver/services/data-view/rest/data/datasources/view/datasets/cameraView/features.json?_method=DELETE`; // 数据服务URL
  return axios({
    method: "post",
    url: dataServiceUrl,
    data: query,
  });
}

export function patchView(smId, name, X, Y, Z, heading, pitch, roll) {
  const features = [
    {
      ID: smId,
      fieldNames: [
        "name",
        "positionX",
        "positionY",
        "positionZ",
        "heading",
        "pitch",
        "roll",
      ],
      fieldValues: [name, X, Y, Z, heading, pitch, roll],
    },
  ];
  const dataServiceUrl =
    iServerIP_Port +
    `/iserver/services/data-view/rest/data/datasources/view/datasets/cameraView/features.json?_method=PUT`; // 数据服务URL
  return axios({
    method: "post",
    url: dataServiceUrl,
    data: features,
  });
}
