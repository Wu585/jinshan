import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import CameraVideo from "@/components/CameraVideo";
import QueryPanel from "@/components/QueryPanel";
import ViewsPanel from "@/components/ViewsPanel";
import Fxft from "@/components/Fxft";
import Houses from "@/components/Houses";

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

console.log('store');
console.log(store);

Vue.component('camera-video',CameraVideo)
Vue.component('query-panel',QueryPanel)
Vue.component('views-panel',ViewsPanel)
Vue.component('fxft',Fxft)
Vue.component('house',Houses)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
