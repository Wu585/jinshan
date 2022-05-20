const system = {
  state: {
    currentClickPoint: {
      x: 0,
      y: 0,
    }
  },
  mutations: {
    SET_currentClickPoint: (state, value) => {
      state.currentClickPoint = value;
    }
  }
};

export default system;

