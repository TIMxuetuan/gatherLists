<template>
  <div class="home">
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from "vue";
import { Button } from "vant";

Vue.use(Button);
import Services from "../../utils/api";
export default {
  components: {},
  data() {
    return {
      phone: "18237203633"
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    //获得用户信息
    getUser() {
      let publicData = {
        mobile: this.phone
      };
      let jiami = {
        mobile: this.phone
      };
      Services.userIf(publicData, jiami).then(res => {
        if (res.event == 100) {
          console.log("res", res);
          this.userInfo = res.data[0];
          this.yiqianDate = res.data[0].signDate;
          console.log(this.yiqianDate);
        } else {
          console.log(res.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.home {
  width: 23.44rem;
  height: 6.25rem;
  border: 1px solid red;
  box-sizing: border-box;
}
</style>
