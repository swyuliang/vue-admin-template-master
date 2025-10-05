<template>
  <div>
    <el-form :model="spu" ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option v-for="tm in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" placeholder="SPU描述" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片:
        action：上传图片的地址
        list-type：文件列表的类型
        on-preview：图片预览的时候触发
        on-remove：删除图片的时候触发 -->
        <el-upload
          action="/admin/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选中`" v-model="attrIdAndAttrName">
          <el-option v-for="unselect in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin-left: 10px;" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的市当前SPU属于自己的销售属性 -->
        <el-table :data="spu.spuSaleAttrList" style="width: 100%;" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- el-tag: 用户展示已有属性值列表的数据 -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                :ref="$index"
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row, $index)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSaleAttr($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  components: {},
  props: {},
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [{
          // id: 0,
          // imgName: '',
          // imgUrl: '',
          // spuId: 0
        }],
        spuSaleAttrList: [{
          // baseSaleAttrId: 0,
          // id: 0,
          // saleAttrName: '',
          // spuId: 0,
          // spuSaleAttrValueList: [{
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: '',
          //   saleAttrName: '',
          //   saleAttrValueName: '',
          //   spuId: 0
          // }]
        }]
      }, // 存储SPU信息属性
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储SPU图片的数据
      saleAttrList: [], // 销售属性数据
      attrIdAndAttrName: '' // 收集未选择的销售属性ID
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个： 颜色，尺寸，版本 --- saleAttrList
      // 当前SPU拥有的属于自己的销售属性----spu.spuSaleAttrList
      // filter数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并返回一个新的数组
      const result = this.saleAttrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('changeScene', { scene:0, flag:'' })
      // 清空data
      // Object.assign: ES6中新增的方法可以合并对象
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      console.log('添加')
      // 添加SPU的时候收集三级分类的id
      this.spu.category3Id = category3Id
      // 获取品牌信息***************
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      // console.log('tradeMarkResult', tradeMarkResult)
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台所有的销售属性*********************
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log('saleResult', saleResult)
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // console.log('保存成功')
      // 整理参数，需要把照片墙里面的数据整理到spu里面
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      // console.log(result)
      if (result.code === 200) {
        // 提示
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        // 刷新跳转到scene: 0
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id? '修改' : '添加'
        })
        // 清空数据
        Object.assign(this._data, this.$options.data())
      } else {
        // 提示
        this.$message({
          type: 'error',
          message: '保存失败！'
        })
      }
    },
    // 删除销售属性
    deleteSaleAttr($index) {
      this.spu.spuSaleAttrList.splice($index, 1)
    },
    // 删除销售属性标签
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // el-input失去焦点的事件
    handleInputConfirm(row) {
      console.log('blur')
      // 解构出销售属性当中收集的数据
      const { baseSaleAttrId, inputValue } = row
      // 新增的销售属性值不能为空
      if (inputValue.trim() === '') {
        this.$message({
          type: 'error',
          message: '属性值不能为空'
        })
        return
      }
      // 属性值不能重复
      const result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName !== inputValue)
      // 没重复的为true，重复的为false
      if (!result) {
        this.$message({
          type: 'error',
          message: '属性不能重复'
        })
        return
      }
      // // 新增销售属性值
      const newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue
      }
      // 把数据push到数组
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 添加新销售属性的按钮回调
    addSaleAttrValue(row, index) {
      // 点击销售属性值当中添加按钮的时候，需要有button变为input，通过当前销售属性的inputVisible控制
      // 挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row, 'inputVisible', true)
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '')
      this.$nextTick(() => {
        // console.log(this.$refs[index])
        this.$refs[index].focus()
      })
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName = ''
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // console.log(response, file, fileList)
      // 收集照片墙图片的数据
      this.spuImageList = fileList
    },
    // 照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      // file参数代表删除的那张图片
      // fileList参数代表照片墙删除某一张图片后剩余的其他图片
      // console.log(file, fileList)
      // 收集照片墙图片的数据
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个对话框
      this.dialogImageUrl = file.url
      // 对话框显示
      this.dialogVisible = true
    },
    async initSpuData(spu) {
      // console.log('发请求', spu)
      // 获取SPU信息的数据*****************
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      // console.log('spuResult', spuResult)
      if (spuResult.code === 200) {
        // 在修改spu的时候，需要向服务器发请求，把服务器返回的数据（对象）,赋值给SPU属性
        this.spu = spuResult.data
      }
      // 获取品牌信息***************
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      // console.log('tradeMarkResult', tradeMarkResult)
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取SPU图片的数据********************
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      // console.log('spuImageResult', spuImageResult)
      if (spuImageResult.code === 200) {
        const listArr = spuImageResult.data
        // 由于照片墙显示图片的数据需要数组里面的元素包含name和url字段
        // 需要把服务器返回的数据进行修改
        listArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值
        this.spuImageList = listArr
      }
      // 获取平台所有的销售属性*********************
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      // console.log('saleResult', saleResult)
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
