<template>
  <div>
    <!-- inline: 代表的是行内表单,代表一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" :disabled="show" @change="handler1">
          <el-option v-for="c1 in list1" :key="c1.id" :value="c1.id" :label="c1.name"></el-option>
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" :disabled="show" @change="handler2">
          <el-option v-for="c2 in list2" :key="c2.id" :value="c2.id" :label="c2.name"></el-option>
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" :disabled="show" @change="handler3">
          <el-option v-for="c3 in list3" :key="c3.id" :value="c3.id" :label="c3.name"></el-option>
          <!-- <el-option label="区域一" value="shanghai"></el-option> -->
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  components: {},
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      // 收集相应的一级二级三级分类的id
      cForm: {
        category1Id: '',
        category3Id: '',
        category2Id: ''
      }
    }
  },
  created() {},
  mounted() {
    // 组件挂载完毕： 向服务器发请求，获取相应的一级分类的数据
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据的方法
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      // console.log('getCategory1List:',result)
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    // 一级分类的select事件回调（当一级分类的option发生变化的时候获取相应二级分类的数据）
    async handler1() {
      // 清除数据
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.list3 = []
      // console.log('一级分类变化')
      // 解构出一级分类的id
      const { category1Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      const result = await this.$API.attr.reqCategory2List(category1Id)
      // console.log('getCategory2List:', result)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    async handler2() {
      // 清除数据
      this.cForm.category3Id = ''
      // console.log('二级分类变化')
      // 解构出一级分类的id
      const { category2Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      const result = await this.$API.attr.reqCategory3List(category2Id)
      // console.log('getCategory3List:', result)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    handler3() {
      // console.log('三级分类变化')
      const { category3Id } = this.cForm
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style scoped lang="less"></style>
