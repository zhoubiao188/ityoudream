<template>
        <footer class="diyFooter">© 2020 ityoudream.cn 版权所有 <span class="target"  @click="handleOpen">{{ code }}</span></footer>
</template>

<script>
export default {
  data () {
    return {
      url: 'https://beian.miit.gov.cn/',
      code: '蜀ICP备20015312号-1'
    }
  },
  methods: {
    handleOpen () {
      window.open(this.url)
    }
  }
}
</script>

<style scoped>
.diyFooter {
    padding: 2.5rem;
    border-top: 1px solid #eaecef;
    text-align: center;
    color: lighten(#4e6e8e, 25%);
}
.target {
  cursor: pointer;
}
</style>