import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home";
import BuildingDialog from "@/components/building-dialog/BuildingDialog";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "dialog",
        component: BuildingDialog,
        name: "Dialog",
        children: [
          {
            path: "description",
            name: "Description",
            component: resolve => require(['@/components/building-dialog/BuildingDescription'], resolve)
          },
          {
            path: "tabs/:id",
            name: "Tabs",
            component: resolve => require(['@/components/building-dialog/BuildingTabs'], resolve)
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
