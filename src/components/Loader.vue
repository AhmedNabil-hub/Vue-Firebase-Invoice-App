<template>
  <div class="loader">
    <span></span>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
.loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 101;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);

  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }

  span {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 3px solid transparent;
    border-top-color: #ffffff;
    border-bottom-color: #ffffff;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}
</style>
