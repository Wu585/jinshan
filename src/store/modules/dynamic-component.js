const buildingDialog = {
  state: {
    componentName: "",
    firstCameraId: ""
  },
  mutations: {
    SET_componentName: (state, value) => {
      state.componentName = value;
    },
    SET_firstCameraId: (state, value) => {
      state.firstCameraId = value;
    }
  }
};

export default buildingDialog;

