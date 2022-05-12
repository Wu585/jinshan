const buildingDialog = {
  state: {
    peopleInfo: {},
    houseUrlPrefix: "上海市金山区山阳镇",
    houseUrlEnd: "",
    houseArray: [],
    roomInfo: {},
    roomPeopleInfo: []
  },
  mutations: {
    SET_peopleInfo: (state, value) => {
      state.peopleInfo = value;
    },
    SET_houseUrlEnd: (state, value) => {
      state.houseUrlEnd = value;
    },
    SET_houseArray: (state, value) => {
      state.houseArray = value;
    },
    SET_roomInfo: (state, value) => {
      state.roomInfo = value;
    },
    SET_roomPeopleInfo: (state, value) => {
      state.roomPeopleInfo = value;
    }
  },
  actions: {}
};

export default buildingDialog;

