<template>
  <el-select v-model="value" placeholder="请选择" @change="onChange">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "Select",
  data() {
    return {
      value: "500米"
    };
  },
  props: {
    options: {
      type: Array
    }
  },
  methods: {
    onChange(currentValue) {
      this.$emit("change", currentValue);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100px;
  height: 30px;

  ::v-deep {
    .el-input__inner {
      color: white;
      height: 30px;
      background: rgba(29, 214, 226, 0.1) !important;
      border: 1px solid #01DEEF !important;
    }

    .el-input__prefix, .el-input__suffix {
      height: 30px;
    }

    /* 下面设置右侧按钮居中 */
    .el-input__suffix {
      top: 5px;
    }

    .el-input__icon {
      line-height: inherit;
    }

    .el-input__suffix-inner {
      display: inline-block;
    }
  }
}
</style>
