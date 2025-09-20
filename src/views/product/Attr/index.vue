<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 表格：展示平台属性 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" style="margin: 10px 0;" @click="addAttr">添加属性</el-button>
        <el-table style="width: 100%;" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" type="success" style="margin: 0 10px;">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="200">
            <template slot-scope="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">编辑</el-button>
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                <!-- <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button> -->
              </el-popconfirm>
              <!-- 气泡确认框 -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- /表格 -->
      <!-- 添加属性0r修改属性 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :model="attrInfo" :inline="true" label-width="80px">
          <el-form-item label="属性名">
            <el-input v-model.trim="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0;" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input v-if="row.flag" :ref="$index" v-model.trim="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display: block" @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popconfirm>
              <!-- 气泡确认框 -->
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
      <!-- /添加属性0r修改属性 -->
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'AttrPage',
  components: {},
  props: {},
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接受平台属性的数据
      attrList: [],
      // 这个属性控制table表格显示与隐藏的
      isShowTable: true,
      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3 // 因为服务器也需要区分几级id
      }
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    // 自定义事件回调
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (level === 3) {
        // 代表三级分类的 id 有了
        this.category3Id = categoryId
        // 发请求获取品牌属性
        this.getAttrList()
      }
    },
    // 获取平台属性数据
    async getAttrList() {
      // console.log('平台属性发请求')
      // 获取分类ID
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      // console.log('三级分类：', result)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      // attrId: 是你相应的属性的id,目前而言我们是添加属性操作，还没有相应的id，目前而言带给服务器的id为unfinished
      // valueName: 相应属性值名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    updateAttr(row) {
      // 切换table显示与隐藏
      this.isShowTable = false
      // 将选中的属性绑定表单展示
      // 由于数据结构当中存在对象里面套数组，数组里面套对象，因此需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值元素添加尚flag
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },
    toLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      const isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepat) {
        this.$message('添加的属性值已存在')
        return
      }
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      // 获取input节点，实现自动聚焦
      this.$nextTick(() => {
        // console.log(this.$refs[index])
        this.$refs[index].focus()
      })
    },
    // 气泡确认框的回调
    deleteAttrValue(index) {
      // console.log('删除')
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮回调：添加属性或者修改属性
    async addOrUpdateAttr() {
      // console.log('1111')
      // 整理参数，提交给服务器的数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值不是空的
        if (item.valueName !== '') {
          // 删除掉flag属性
          delete item.flag
          return true
        }
      })
      // 发请求
      const result = await this.$API.attr.reqAddOrUpadteAttr(this.attrInfo)
      if (result.code === 200) {
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        // 保存成功，更新界面列表
        this.getAttrList()
      } else {
        this.$message({ type: 'error', message: '保存失败' })
      }
      // try {
      //   await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
      //   this.isShowTable = true
      //   this.$message({ type: 'success', message: '保存成功' })
      //   // 保存成功，更新界面列表
      //   this.getAttrList()
      // } catch (error) {
      //   console.log(error)
      //   this.$message({ type: 'error', message: '保存失败' })
      // }
    },
    async deleteAttr(row) {
      console.log(row)
      // 发请求
      const result = await this.$API.attr.reqDeleteAttr(row.id)
      console.log(result.code)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        // 保存成功，更新界面列表
        this.getAttrList()
      } else {
        this.$message({ type: 'error', message: '删除失败' })
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
