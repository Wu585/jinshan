<template>
  <div class="container">
    <div class="title">重点防控</div>
    <el-table
      :data="tableData"
      stripe
      height="230"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "FooterTable",
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
$background-dark: rgba(15, 44, 87, 0.8);
$background-light: rgba(31, 62, 100, 0.4);

::v-deep .el-table .el-table__cell.gutter {
  background: $background-light
}

/*::v-deep .el-table, .el-table__expanded-cell {
  background-color: transparent;
  &:hover{
    background-color: transparent;
  }
}*/

/*::v-deep .el-table th.el-table__cell{
  background:$background-light
}*/


::v-deep .el-table__row {
  color: #fff;
}

::v-deep .el-table th.is-leaf,
.el-table td {
  /* background: #172fa9 !important; */
  color: #fff;
  background: $background-light;
  /* text-align: center; */
  font-size: 16px;
  border: none;
}

::v-deep .el-table tr:nth-of-type(odd) {
  background: $background-dark !important;
  border: 1px solid red;
}

::v-deep .el-table--enable-row-transition .el-table__body td {
  color: #fff;
  /* text-align: center; */
  font-size: 14px;
  background: $background-dark !important;
  border-bottom: 1px solid $background-dark;
}

.el-table::before {
  //去除底部白线
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
}

.container {
  padding: 0 15px;
  width: 50%;
  height: 290px;
  background: $background-dark;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;

  .title {
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 76, 120, 1);
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 400;
  }
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 17px;
  background: $background-dark !important
}

// 设置滚动条的背景色和圆角
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: $background-dark;
  border-radius: 8px;
}

/*.el-table tr {
  background: rgba(31, 62, 100, 1);
}*/

</style>
