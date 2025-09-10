<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px;" @click="showDialog">添加</el-button>
    <!-- /按钮 -->
    <!-- 表格组件：
         data：表格组件将来需要展示的数据----数组类型
         border：是给表格添加边框
         column：
         label：显示标题
         width: 对应列的宽度
         align: 标题的对齐方式
         prop： 需要展示数据的字段
         注意1：elment当中的table组件，展示的数据是一列一列进行展示数据-->
    <el-table border style="width: 100%" :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{row}">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template>
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 分页器
      当前第几页，数据总条数，每一页展示条数，连续页码数
       @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      current-page: 代表当前第几页
      total: 代表分页器一共需要展示数据条数
      page-size: 代表每一页需要展示多少条数据
      page-sizes: 代表可以设置每一页展示多少跳数据
      layout: 可以实现分页器布局
      pager-count: 按钮的数量 如果9 连续页码数就是7
    -->
    <el-pagination
      style="margin-top: 20px; text-Align: center;"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="5"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <!-- /分页器 -->
    <!-- 添加按钮对话框
     :visible.sync 控制对话框显示与隐藏
    -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- form表单 -->
      <el-form style="width: 80%;">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100xp">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加按钮对话框 -->
  </div>
</template>
<script>
export default {
  name: 'TradeMark',
  components: {},
  props: {},
  data() {
    return {
      page: 1, // 分页器在第几页
      limit: 3, // 当前页数展示数据条数
      total: 0, // 总共数据条数
      list: [], // 列表展示的数据
      dialogFormVisible: false, // 控制对话框显示与隐藏
      imageUrl: '' // 上次图片使用的属性
    }
  },
  created() {},
  mounted() {
    // 获取列表数据方法
    this.getPageList()
  },
  methods: {
    async getPageList() {
      // 解构this
      const { page, limit } = this
      // 获取品牌列表的接口
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(page) {
      // console.log(page)
      // 修改参数
      this.page = page
      // 再发请求更新
      this.getPageList()
    },
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit
      // 再发请求更新
      this.getPageList()
    },
    // 点击添加品牌对话框
    showDialog() {
      this.dialogFormVisible = true
    },
    // 修改品牌对话框
    updateTradeMark() {
      this.dialogFormVisible = true
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
