<template>
  <div>
    <el-card style="margin: 20px 0px;">
      <CategorySelect @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 底下这里将来是由三部分进行切换 -->
      <!-- 展示SPU列表的结构 -->
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0;" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table :data="records" style="width: 100%;" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- 这里按钮将来用hinButton替换 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"></hint-button>
              <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              <!-- <el-button type="success" icon="el-icon-plus" size="mini" title="添加sku"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改spu"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" title="删除spu"></el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="margin-top: 20px; text-Align: center;"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :pager-count="5"
          layout="prev, pager, next, jumper, ->, total, sizes"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
        <!-- /分页器 -->
      </div>
      <!-- /展示SPU列表的结构 -->
      <!-- 添加SPU|修改SPU -->
      <spu-form v-show="scene === 1" ref="spu" @changeScene="changeScene"></spu-form>
      <!-- /添加SPU|修改SPU -->
      <!-- 添加SKU -->
      <sku-form v-show="scene === 2"></sku-form>
      <!-- /添加SKU -->
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'SpuPage',
  components: {
    SpuForm,
    SkuForm
  },
  props: {},
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1, // 分页器当前第几页
      limit: 3, // 每一页需要展示多少条数据
      records: [], // spu列表数据
      total: 0, // 分页器一共需要展示数据的条数
      scene: 0 // 0代表展示SPU列表数据   1代表添加SPU|修改SPU   2添加SKU
    }
  },
  created() {},
  mounted() {},
  methods: {
    // spuForm自定义事件回调
    changeScene(scene) {
      this.scene = scene
    },
    // 修改Spu回调
    updateSpu(row) {
      this.scene = 1
      this.$refs.spu.initSpuData(row)
    },
    // 添加Spu回调
    addSpu() {
      this.scene = 1
    },
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再发请求更新
      this.getSpuList()
    },
    // 点击分页器的第几页按钮的回调
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
        this.getSpuList()
      }
    },
    // 获取平台属性数据
    async getSpuList(pages = 1) {
      this.page = pages
      // 携带三个参数：page:第几页，limit:每一页需要展示多少条数据 三级分类id
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      // console.log('Spu：', result)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
