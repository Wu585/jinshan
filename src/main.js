import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

window.entitiesArray = [];
window.getPosition = function () {
  const { position, heading, pitch, roll } = viewer.camera;
  const { x, y, z } = position;
  // return `${x},${y},${z},${heading},${pitch},${roll}`;
  return `"x":${x},"y":${y},"z":${z},"heading":${heading},"pitch":${pitch},"roll":${roll}`;
};

window.hasLine = false
window.hasFly = false

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
