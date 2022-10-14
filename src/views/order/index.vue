<template>
  <div class="app-container">
    <el-form ref="queryFormObjRef" :model="queryObj" label-width="100px" size="small">
      <el-row>
        <el-col :span="10">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="queryObj.name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="getOrderList(1)">查询</el-button>
            <el-button icon="el-icon-error" @click="onReset">清除查询条件</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="float: right">
            <el-button type="primary" @click="onAdd">添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" max-height="650" border stripe>
      <el-table-column prop="orderId" label="订单ID"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="ownerId" label="归属人"></el-table-column>
      <el-table-column prop="createTime" label="订单创建时间" :formatter="formatterTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="onEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="tableDataPageSize" :total="tableDataTotalCount" layout="total,prev, pager, next"
                   @current-change="getOrderList">
    </el-pagination>

    <el-dialog title="订单" :visible.sync="dialogFormVisible">
      <el-form ref="formRef" :model="formObj" :rules="formRule" label-width="100px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="formObj.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input type="number" v-model="formObj.price" placeholder="请输入价格"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属人" prop="ownerId">
              <el-select v-model="formObj.ownerId" placeholder="请选择归属人">
                <el-option label="1" value='1'></el-option>
                <el-option label="2" value='2'></el-option>
                <el-option label="3" value='3'></el-option>
                <el-option label="4" value='4'></el-option>
                <el-option label="5" value='5'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-upload
            action=""
            accept="*/*"
            :http-request="uploadFileToServer"
            :on-success="onFileUploadSuccess"
            multiple
            :show-file-list="true"
            :limit="3"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onFormDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onFormDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getOrderList, deleteOrder, addOrder, updateOrder} from '@/api/order'
  import {uploadFileOnSystem} from '@/api/file'

  export default {
    data() {
      return {
        queryObj: {},
        tableData: [],

        dialogFormVisible: false,
        formObj: {},
        formRule: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'}
          ],
          ownerId: [
            {required: true, message: '请选择归属人', trigger: 'blur'}
          ],
        },

        fileList:[],
      }
    },
    methods: {
      getOrderList(pageIndex) {
        getOrderList(this.queryObj, pageIndex).then(res => {
          this.tableDataTotalCount = res.data.total
          this.tableData = res.data.list
        }).catch(err => {
        })
      },
      onAdd() {
        this.formObj = {isAdd: true}
        this.dialogFormVisible = true
      },
      onDelete(row) {
        this.$confirm('确认删除?', '提示').then(() => {
          deleteOrder(row.orderId).then(res => {
            this.$message({type: 'success', message: '删除成功!'})
            this.getOrderList(1)
          }).catch(err => {
          })
        })
      },
      onEdit(row) {
        this.formObj = {...row}
        this.formObj.isAdd = false
        this.dialogFormVisible = true
      },
      onFormDialogCancel() {
        this.dialogFormVisible = false
      },
      onFormDialogSure() {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            if (this.formObj.isAdd) {
              addOrder(this.formObj).then(res => {
                this.$message({type: 'success', message: '添加成功!'})
                this.dialogFormVisible = false
                this.getOrderList(1)
              }).catch(err => {
              })
            } else {
              updateOrder(this.formObj).then(res => {
                this.$message({type: 'success', message: '更新成功!'})
                this.dialogFormVisible = false
                this.getOrderList(1)
              }).catch(err => {
              })
            }
          } else {
            return false
          }
        })
      },
      onReset() {
        this.$refs.queryFormObjRef.resetFields()
        this.getOrderList(1)
      },

      uploadFileToServer(fileObj) {
        return uploadFileOnSystem(fileObj).then(res => {
          fileObj.onSuccess(res)
        }).catch(err => {
          fileObj.onError(err)
        })
      },
      onFileUploadSuccess(response, file, fileList) {
        if(response == null){
          return
        }
        this.$message({type: 'message', message: '上传成功!'})
        console.log('----->fileList:')
        console.log(response)
      },
    },
    created() {
      this.getOrderList(1)
    }
  }
</script>
<style lang="scss" scoped>

</style>
