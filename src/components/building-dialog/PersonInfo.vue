<template>
  <table cellspacing="0" width="100%" align="center">
    <tr>
      <th height="48">序号</th>
      <th>姓名</th>
      <th>性别</th>
      <th>年龄</th>
      <th colspan="2">证件号码</th>
      <th>实有人口类别</th>
      <th>人员类别</th>
      <th>与户主关系</th>
    </tr>
    <tr>
      <td height="48">1</td>
      <td>西西域</td>
      <td>西西域</td>
      <td>西西域</td>
      <td colspan="2">3209222000005010000</td>
      <td>西西域</td>
      <td>西西域</td>
      <td>西西域</td>
    </tr>
    <tr>
      <td height="48">2</td>
      <td>南国</td>
      <td>南国</td>
      <td>南国</td>
      <td colspan="2">320922200005010000</td>
      <td>南国</td>
      <td>南国</td>
      <td>南国</td>
    </tr>
  </table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: "2016-05-02",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1518 弄"
      }, {
        date: "2016-05-04",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1517 弄"
      }, {
        date: "2016-05-01",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1519 弄"
      }, {
        date: "2016-05-03",
        name: "王小虎",
        address: "上海市普陀区金沙江路 1516 弄"
      }]
    };
  }
};
</script>

<style lang="scss" scoped>
table {

  th {
    background: #007FD0;
  }

  td {
    background: #0A4878;
    text-align: center;
  }
}
</style>
