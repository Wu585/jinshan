<template>
  <div class="wrapper">
    <PanelLayout @close-panel="$emit('hide-house')">
      <template v-slot:title> 小区信息</template>
      <template v-slot:content>
        <ul class="house-content">
          <li>
            <span>小区名称: </span>
            <span>万盛金邸</span>
          </li>
          <li>
            <span>小区描述: </span>
            <span>
              万盛金邸小区位于金山区龙轩路866弄，龙轩路1000弄。总建筑面积300000平方米，总占地面积187000平方米，共计房屋1884户。
            </span>
          </li>
          <li>
            <span>派出所名称: </span>
            <span>山阳派出所</span>
          </li>
          <li>
            <span>村居委名称: </span>
            <span>海趣居委</span>
          </li>
          <li>
            <span>门牌数: </span>
            <span>66</span>
          </li>
          <li>
            <span>户数: </span>
            <span>1884</span>
          </li>
          <li>
            <span>户籍人数: </span>
            <span>1228(+0)</span>
          </li>
          <li>
            <span>居住人数: </span>
            <span>5356(+0)</span>
          </li>
          <li>
            <span>居住户籍人数: </span>
            <span>4461(+0)</span>
          </li>
          <li>
            <span>居住来沪人数: </span>
            <span>880(+0)</span>
          </li>
        </ul>
      </template>
    </PanelLayout>
  </div>
</template>

<script>
import PanelLayout from "@/components/PanelLayout";

export default {
  name: "Houses",
  components: { PanelLayout }
};
</script>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  top: 232px;
  right: 13px;
  z-index: 999;
  .house-content{
    li{
      font-size: 16px;
      font-weight: 400;
      padding: 6px 0;
      span{
        &:first-child{

        }
        &:nth-child(2){
          color: #1CFBFF;
        }
      }
    }
  }
}
</style>
