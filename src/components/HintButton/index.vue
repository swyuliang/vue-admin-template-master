<template>
  <a :title="title" style="margin: 10px;">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: 'HintButton',
  components: {},
  props: ['title'],
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
