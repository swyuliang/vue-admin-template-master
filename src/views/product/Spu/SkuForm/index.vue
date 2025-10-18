<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="价格(元)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table :data="spuImageList" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" prop="prop" width="width"></el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button v-if="row.isDefault === 0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else @click="changeDefault(row)">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  components: {},
  props: {},
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku数据字段
      skuInfo: {
        // 第一类收集的数据，父组件给的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定v-model收集
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类，需要发请求获得
        // 设置默认图片
        skuDefaultImg: '',
        // 收集图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   isDefault: '',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        // sku销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: '',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: '',
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: '',
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: ''
          // }
        ]
      },
      spu: {},
      // 收集图片的数据字段
      imageList: []
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 表单保存按钮回调
    async save() {
      console.log('SKUForm保存')
      // 整理参数
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // // 整理平台属性的数据方式1
      // // 新建数组
      // let arr = []
      // // 把收集到的数据整理一下
      // attrInfoList.forEach(item => {
      //   // 当前平台属性用户进行选择
      //   if (item.attrIdAndValueId) {
      //     let obj = { valueId, attrId }
      //     arr.push(obj)
      //   }
      // })
      // 将整理好的参数赋值给skuInfo.skuAttrValueList
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
      }, [])
      // 整理销售属性
      spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
      }, [])
      // 整理图片数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddSku(skuInfo)
      console.log(result)
      if (result.code === 200) {
        this.$message({
          type: 'success',
          message: '添加SKU成功'
        })
        this.$emit('changeScenes', 0)
      }
    },
    // 表单取消按钮回调
    cancel() {
      // console.log('SKUForm取消')
      // 自定义事件，让父组件切换场景0
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 获取SkuForm数据
    // async getData(category1Id, category2Id, spu) {
    //   console.log('获取sku数据')
    //   // 收集父组件给予的数据
    //   this.skuInfo.category3Id = spu.category3Id
    //   this.skuInfo.spuId = spu.id
    //   this.skuInfo.tmId = spu.tmId
    //   this.spu = spu
    //   // 发请求获取图片数据*******************************************************
    //   let result = await this.$API.spu.reqSpuImageList(spu.id)
    //   console.log(result)
    //   if (result.code === 200) {
    //     this.spuSaleAttrList = result.data
    //   }
    //   // 发请求获取图片数据*******************************************************
    //   // 获取销售属性的数据***********************************************************
    //   let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
    //   console.log(result1)
    //   if (result1.code === 200) {
    //     this.spuSaleAttrList = result1.data
    //   }
    //   // 获取销售属性的数据***********************************************************
    //   // 获取平台属性的数据***********************************************************
    //   let result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
    //   console.log(result2)
    //   if (result1.code === 200) {
    //     this.attrInfoList = result1.data
    //   }
    //   // 获取平台属性的数据***********************************************************
    // },
    // // 使用Promise.all 改下三个await
    async getData(category1Id, category2Id, spu) {
      console.log('获取sku数据')
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 并行执行三个请求
      const [imageResult, saleAttrResult, attrResult] = await Promise.all([
        this.$API.spu.reqSpuImageList(spu.id), // 获取图片数据
        this.$API.spu.reqSpuSaleAttrList(spu.id), // 获取销售属性
        this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id) // 获取平台属性
      ])
      // 统一处理响应结果
      if (imageResult.code === 200) {
        let list = imageResult.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      if (saleAttrResult.code === 200) {
        this.spuSaleAttrList = saleAttrResult.data
      }
      if (attrResult.code === 200) {
        this.attrInfoList = attrResult.data
      }
      // console.log(imageResult, saleAttrResult, attrResult)
      console.log(this.spuSaleAttrList)
    },
    // table表格复选框按钮的事件
    handleSelectionChange(params) {
      console.log(params)
      // 获取到用户选择图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault
      this.imageList = params
    },
    // 默认图片排他操作
    changeDefault(row) {
      // 图片列表的数据isDefault字段为0
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      // 点击的图片为1
      row.isDefault = 1
      // 收集默认图片地址
      this.skuDefaultImg = row.imgUrl
    }
  }
}
</script>

<style scoped lang="less"></style>
