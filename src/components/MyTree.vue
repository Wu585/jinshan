<template>
  <el-tree v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default {
  name: "MyTree"
};
</script>

<style scoped lang="scss">
::v-deep .is-leaf {

  .custom-tree-node {
    border: 1px solid red;
  }

}

::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: none;
}

::v-deep .el-tree-node__content:hover {
  background: none;
}

::v-deep .el-tree-node__children label.el-checkbox {
  display: inline-block;
}

::v-deep .el-tree-node__expand-icon.is-leaf {
  visibility: hidden;
}

/*::v-deep .el-tree .el-tree-node__expand-icon.expanded {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}*/

::v-deep .el-tree .el-icon-caret-right:before {
  background: url("../assets/images/layersTree/jia.png") no-repeat center center;
  content: "";
  display: block;
  width: 18px;
  height: 18px;
  font-size: 18px;
  background-size: 18px;
}

::v-deep .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
  background: url("../assets/images/layersTree/jian.png") no-repeat center center;
  content: "";
  display: block;
  width: 18px;
  height: 18px;
  font-size: 18px;
  background-size: 18px;
}

.el-tree {
  color: white;
  background: none;
}
</style>
