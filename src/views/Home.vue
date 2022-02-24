<template>
  <div class="home">
    <Header/>
    <FooterTable/>
    <InfoContainer/>
  </div>
</template>

<script>
import Header from "@/components/Header";
import FooterTable from "@/components/FooterTable";
import InfoContainer from "@/components/InfoContainer";

export default {
  name: "Home",
  components: {InfoContainer, FooterTable, Header},
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/background.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
