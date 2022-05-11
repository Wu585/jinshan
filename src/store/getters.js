const getters = {
  peopleInfo: state => state["building-dialog"].peopleInfo,
  houseUrlPrefix: state => state["building-dialog"].houseUrlPrefix,
  houseUrlEnd: state => state["building-dialog"].houseUrlEnd,
  houseArray: state => state["building-dialog"].houseArray,
  roomInfo: state => state["building-dialog"].roomInfo,
};

export default getters;
