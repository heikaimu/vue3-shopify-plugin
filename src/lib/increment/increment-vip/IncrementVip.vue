<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-22 17:48:57
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-01 11:13:24
-->
<template>
  <div class="increment-wrapper">
    <div class="increment-blank" @click="handleClose"></div>
    <div class="increment-vip">
      <span class="close-icon">
        <base-icon icon="close" @click="handleClose" />
      </span>

      <div class="vip-wrapper">
        <div class="button-layout">
          <div
            class="vip-button"
            :class="{ active: active }"
            @click="handleSelect"
            id="button_add_to_cart_9"
          >
            <div class="checkbox-inner">
              <base-icon
                v-if="active"
                icon="check"
                :size="18"
                color="#fbe4a4"
              ></base-icon>
            </div>
            <div class="button-content">VIP SERVICE + ${{data.price}}</div>
            <div class="crown"></div>
            <div class="light"></div>
          </div>
        </div>

        <p class="vip-text">{{ data.desc }}</p>
      </div>

      <div class="add-to-cart">
        <base-button type="primary" size="large" @click="handleNext(true)" id="button_add_to_cart_10"
          >Sure & Add To Cart</base-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, toRaw, onMounted, nextTick } from "vue";

import BaseButton from "../../../base/BaseButton.vue";
import BaseIcon from "../../../base/BaseIcon.vue";

export default {
  components: {
    BaseButton,
    BaseIcon,
  },

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    change: null,
    close: null,
    next: null,
  },

  setup(props, context) {
    const state = reactive({
      active: false
    });

    onMounted(() => {
      state.active = props.value;
    });

    // 选择vip
    async function handleSelect() {
      state.active = !state.active;
      await nextTick();
      context.emit("change", state.active);
    }

    // 关闭
    function handleClose() {
      context.emit("close");
    }

    // 前往下一步
    function handleNext() {
      context.emit("next");
    }

    return {
      ...toRefs(state),
      handleSelect,
      handleClose,
      handleNext,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "src/styles/_variables.scss";
@import "src/styles/_mixins.scss";

.increment-wrapper {
  @include pos-absolute(0, 0, 0, 0, 1000);
  .increment-blank {
    @include glass;
    @include pos-absolute(0, 0, 0, 0, 1001);
    cursor: pointer;
  }

  .increment-vip {
    @include pos-absolute(auto, 0, 0, 0, 1002);
    border-radius: 10px 10px 0 0;
    background-color: #ffffff;

    .close-icon {
      @include pos-absolute(20px, auto, auto, 20px, 1004);
      cursor: pointer;
    }

    .vip-wrapper {
      padding: 70px 20px 20px 20px;

      .vip-button {
        @include flex-row-sb;
        height: 60px;
        padding: 0 15px 0 20px;
        position: relative;
        border-radius: 12px 12px 0 0;
        background: linear-gradient(132deg, #131313, #4d4052);
        -webkit-tap-highlight-color: transparent;
        opacity: 0.8;
        cursor: pointer;
        .checkbox-inner {
          box-sizing: border-box;
          width: 22px;
          height: 22px;
          border-radius: 22px;
          vertical-align: middle;
          border: 2px solid #fff;
          background-color: hsla(0, 0%, 100%, 0.25);
        }
        .button-content {
          font-size: 16px;
          font-weight: 900;
          color: #fbe4a4;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
        }
        .crown {
          width: 30px;
          height: 100%;
          background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAPKADAAQAAAABAAAAPAAAAACL3+lcAAAIY0lEQVRoBe1azWtdRRSfc9+7Se2Hpa1ptaZqtVBduVGwbhQXUhfiRqotwY+FFYt0U8SK4KI7N/0DhG5KoxAU8QO1KFoXCiJUEISqtNg2aSIWLK1UfPfeGX+/MzMvL4/X5N2X5Ir0TrjvzMeZmfM758yZD2JMnWoN1BqoNVBroNZArYH/SgNS5cTOTQzlF7JD4twznNeJHG1uTt8Q2dWqSo5mVRNxHoI1zr3q4qTIo46lg7FquWmy3BN0jh8tu1BdZ/tS5ysFvNTCDzJepYC5ZruF7FXXzbOU5UrXMAMU12x07Ri0lhJQPdb1roFK92EqG3txI5tqjYmT3c3R7Y+L3Kf7UlWGqDRoKajpfAe0vN2IedhO/7yvKqBxnkoBO/dV0zrzCI5YKWydFYXb7379ZDgKUwWtFHA+NX2/dXYdwjR3hzwRs7644c+nqgAa56gMMK1rnN0pzqT8CNjByiJmv/tpYigKtNy0MsD51MxDInIz1m5TP2cyMZJb6zZna7PnlhtoHL8SwH+deXuTJPZJ6+DKAuvic2JySyuDIogdcNPv3BGFWk4677aUTx97zBTmLRWgYfY2bxn7tKwwMzNHV23Ik9dwQ7qts29i5EEoQOdPBGcv5041V5o9smHscidfP/kycs5vYYCFoKP82sD7kSDwuD+OrNmQNw46Z+7EBow1DHdW6ppYvzmCFz64tbEFrL4t/9scuXR2fF2JKTxrCTnnB1x65tkOrcljDxStFYex/dyNwJTCimmkzIMzw/aEdexaWMstACb4e1Y3zPvZuWOPzo60tLn5Lw9wY+lw6YWmdjPHV5ni4o7cuZ0Q/i7lB8qeydG6+INGtF1/YXeRtSYxb+ZT488a695trFjzhYw8caXnGLGyhJzXkCaONJe66YmRvGjtxXobgXyX0PmiMQm2U7cyScwWHCpuR10QHZCRR0HniPl2u2PERjNCN7gUqZYxJYoiGNDXO5xC5YyY5DQqrlokTLgRDOvRMvNPKzu8euvzM3MlvXZpfgt39ctttg8C7qCMkBKtxKL4jGUeGywQ+F4W4iSoANWKmCf1yZ+hqRIkhaWDYeyoKjYIwpsxW4yx+ACb6o0TO7NteGgIwb7/J6JSgF1hb4Lmuf6QArA27axjM8Qi1oCPRiSrUmWVzGuJBTQlQXORqAbRkASNsMw8qOfFeMwbc6MO0OdPKcCmYU7CYvfq2BRQhYgSds1oIYsKSJloOtqe1oGgSMjhJYAxkwZCcl3xU3uhTetBycuurNchfJ017jt27zeVApw23AmcFF7QwaP1gsd2SUPjYneFQYkSCURtTKplkasKXhUDCHT9tpV1BujC+zbXs+fFMF7RwO/rCpETgbsvosL0xRmY8snxCUi+VeVHNPE40KjQAkQW8bWNoXkvKSXWJO53UvCoInxlj9+gpl68mOP80OjYSz16XbOqlIU5ClzoS8B8UUcM65N5YA/mIPFJTRkLHlfAB6AiWbt9TmDDOqH1LFxWIzVZ4R0oM6SbEPQ4CTi+bg/fZ6Y04DRtfp7n+csuLitQJojCeETUbRy+JfzCF2h/+rbWOKxhdCMzAdEnuB3FgUjJzxof8HxHncQ7kCmk8U0YvW/SFSkW7iebnj4NYc7iY7TGZQDU52ep8RcEtOtFARBT4PEXBz1eaj4HJlg5HjFxkcANip/WUyE4evo6vUZm2Oe1DbYu4FFnV966+/zCEs/lKG1hdoeWjhcOR0ZVPmyABCGDiVlCwsbKH091KUiCOgir/ACSY4dVm9NJNI8jBi0AYEiiFNuubgZax54cl56UuG/JVTYNBDiz+WdNaRyg8P4coOtJ8/R0L4RKjaynAKJgSdlOa1mx4OX5hGXkCUYR++XLRRpWjC5nLmtsdVjGxjTSRqntiHMycfjSacXos7/ATr9hXiqMrs1XDM2T9vo6ebQPb0q4QCAG5VBBBgvjAuH4IOBvUaoQnwdAXjT4JAS3drg/yzkZ2X0B/UungSzMWRKTfAzfeiXaM9gYLdEm3sm9swezQkPR7gDQfp5Vw3FMRGUAohF1FC17/0Y5eIpGcPM9ZRgkDWRhTgQ1fwTxEYz8B61rnlTzsH6kYPf34EhxJ2ZgQn+cYwSWJmXAYuT2dTFwIYJrW5sfPI3h9OQgYNlnYMDDm/ecgrCI2BpxcaGfpZqHm0eKeWYjeIjq3jXpopb7sbosQhEe9pi36rp0Y7aTd7bNXZCNu/q+HXUrZmCX1oEK+4FLktfjoPDGjhQdNbp4iEZBx7ou4QJwX/QKbZqDLbmX647tcJLGOtAaBjfm5YeOSUpnB7YwZ7KpvKduTdfWt+ZANc/9me/P3K878qzz9Qxa+FcHuLRYuDIprCverQEOebo96nVPJo/Lm43ix9Io6w7XkQawKBaXssnxQwgqKXaLhrNuCGuuaQVlEb5S8mjZxNpmBPfHUK3TF0y0JeG4SdfXoJfidMI+iPQo+z0+UPJImo6ONRYj8aLWcJwYAUjvs3yK4DGIx0SeihiucJAIbIw4SLwlMkjprQdZPT5hdSJI4abA0xpbEbRCPzbotYP941hhyAHI4gHzXs+Iqom3OD6E+DMxB+cbFP54Bm1Lq8x8LWEimKAL6A08PG+zS2z2IVv54jTacbCfxQOGWXTj4d0VSUF6odsWhkYULSDosxB/NAGUXglpRZpWkyqLSvQl6kAVqmpoK823lv9dPGAxlyErMPDwJwoea5oWCggC4SsmLacJ0+oLjSJRbFj/oLxJ0eL41W/W+miiyw90fu5Uy6IBF85+iAGvqM3gjHRhBCy+0PLQAOEJgsmbyufBrS6tqGg1qgeQqBPwBztigaiGWA/OSbwJ+pcWP0j9W2ug1kCtgVoDtQZqDfzPNPAveL/xYuBwHRMAAAAASUVORK5CYII=")
            no-repeat center center / contain;
        }
        .light {
          @include pos-absolute(0, auto, auto, -50%);
          width: 100%;
          height: 60px;
          background-image: -webkit-linear-gradient(
            0deg,
            hsla(0, 0%, 100%, 0) 25%,
            hsla(0, 0%, 100%, 0.15) 40%,
            hsla(0, 0%, 100%, 0) 55%
          );
          transform: skewx(-25deg);
          transition: 0.3s;
        }
        &.active {
          opacity: 1;
          .checkbox-inner {
            border: 2px solid #fbe4a4;
          }
          .light {
            left: 0;
          }
        }
      }

      .vip-text {
        padding-top: 20px;
        text-align: center;
        font-size: 15px;
        color: $context-color;
      }
    }

    .add-to-cart {
      padding: 0 20px 20px 20px;
    }
  }
}
</style>