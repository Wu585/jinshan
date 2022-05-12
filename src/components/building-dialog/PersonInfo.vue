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
    <tr v-for="(item,index) in $store.getters.roomPeopleInfo" :key="item.ID">
      <td height="48">{{ index + 1 }}</td>
      <td>{{ item.XM }}</td>
      <td>{{ item.XBHZ }}</td>
      <td>{{ item.AGE }}</td>
      <td colspan="2">{{ item.ZJHM }}</td>
      <td>{{ item.SYRKLBHZ }}</td>
      <td>{{ item.SYRKLBHZ }}</td>
      <td>{{ item.YHZGXHZ === 'null' ? "暂无信息" : item.YHZGXHZ }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "PersonInfo"
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
