const getters = {
  peopleInfo: state => state["building-dialog"].peopleInfo,
  houseUrlPrefix: state => state["building-dialog"].houseUrlPrefix,
  houseUrlEnd: state => state["building-dialog"].houseUrlEnd,
  houseArray: state => state["building-dialog"].houseArray,
  roomInfo: state => state["building-dialog"].roomInfo,
  roomPeopleInfo: state => state["building-dialog"].roomPeopleInfo,
  componentName: state => state["dynamic-component"].componentName,
  firstCameraId: state => state["dynamic-component"].firstCameraId,
  currentClickPoint: state => state["system"].currentClickPoint
};

export default getters;
