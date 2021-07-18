<template>
  <div class="base-button" :class="[type, size, { plain: plain }]">
    <slot />
  </div>
</template>

<script>
export default {
  name: "BaseButton",

  props: {
    type: {
      type: String,
      default: "info",
    },
    plain: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "normal",
    },
  },
};
</script>

<style lang="scss" scoped>
$primaryColor: #ff533a;
$infoColor: #909399;
$successColor: #67c23a;
$warningColor: #e6a23c;
$errorColor: #f56c6c;
$whiteColor: #ffffff;

// 默认
.base-button {
  box-sizing: border-box;
  width: 100%;
  height: 36px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: normal;

  background-color: $infoColor;
  color: $whiteColor;

  transition: 0.3s;
}

.base-button.plain {
  background-color: transparent;
  color: $infoColor;
  border: 1px solid rgba($color: $infoColor, $alpha: 0.8);
}

.base-button:active {
  opacity: 0.7;
}

// info
.base-button.info {
  background-color: $infoColor;
  color: $whiteColor;
}

.base-button.info.plain {
  background-color: transparent;
  color: $infoColor;
  border: 1px solid rgba($color: $infoColor, $alpha: 0.8);
}

// primary
.base-button.primary {
  background-color: $primaryColor;
  color: $whiteColor;
}

.base-button.primary.plain {
  background-color: $whiteColor;
  color: $primaryColor;
  border: 1px solid $primaryColor;
}

// success
.base-button.success {
  background-color: $successColor;
  color: $whiteColor;
}

.base-button.success.plain {
  background-color: $whiteColor;
  color: $successColor;
  border: 1px solid $successColor;
}

// warning
.base-button.warning {
  background-color: $warningColor;
  color: $whiteColor;
}

.base-button.warning.plain {
  background-color: $whiteColor;
  color: $warningColor;
  border: 1px solid $warningColor;
}

// error
.base-button.error {
  background-color: $errorColor;
  color: $whiteColor;
}

.base-button.error.plain {
  background-color: $whiteColor;
  color: $errorColor;
  border: 1px solid $errorColor;
}
</style>
