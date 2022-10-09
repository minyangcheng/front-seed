<template>
  <div class="app-container">
    <el-table :data="tableData" max-height="650" border stripe>
      <el-table-column prop="systemName" label="公告标题"></el-table-column>
      <el-table-column prop="reason" label="原因"></el-table-column>
      <el-table-column prop="图片数量" label="图片数量" :formatter="formatterTime"></el-table-column>
      <el-table-column prop="applyTime" label="提交日期" :formatter="formatterTime"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="onMarkHasDone(scope.row)" type="text" size="small">标记为已处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-count="paginationPageCount" layout="prev, pager, next" style="margin-top: 30px;"
                   v-show="showPaginationFlag" @current-change="getUserListRequest">
    </el-pagination>

    <el-form ref="formRef" :model="formObj" :rules="formRule" label-width="100px">
      <el-form-item label="系统名称">
        <el-input v-model="formObj.systemName" disabled></el-input>
      </el-form-item>
      <el-form-item label="投诉原因" prop="message">
        <el-input type="textarea" v-model="formObj.reason" placeholder="请投诉原因"></el-input>
      </el-form-item>
      <el-form-item label="门店图片">
        <el-upload action="" list-type="picture-card" accept="image/*"
                   :on-preview="handlePictureCardPreview" :on-success="onFileUploadSuccess_1"
                   :on-remove="onFileUploadRemove_1" :data="{ fileType:1 }" :http-request="uploadFileToServer"
                   :file-list="formObj.media1">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-row type="flex" justify="center" v-if="!formObj.disabled">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { getUserList, resetPassword, addUser, updateUser, deleteUser } from '@/api/user'
  import { getStoreList, bindToDealerFromUser, getHasBindStoreList } from '@/api/store'

  export default {
    data() {
      return {
        formObj: {
          media1:[],
        },

        tableData: [],
        dialogFormVisible: false,

        formRule: {
          title: [
            { required: true, message: '请输入标题', trigger: 'change' }
          ],
          message: [
            { required: true, message: '请输入内容', trigger: 'change' }
          ]
        },

        dialogImageVisible: false,
        dialogImageUrl: '',
      }
    },
    methods: {
      getUserListRequest(pageIndex) {
        getUserList('', '', pageIndex).then(response => {
          this.paginationPageCount = response.data.pages
          this.tableData = response.data.list
        }).catch(error => {
        })
      },
      onMarkHasDone() {
        this.formObj = { isAdd: true }
        this.dialogFormVisible = true
      },
      onCancel() {
        this.dialogFormVisible = false
      },
      onSubmit() {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            if (this.formObj.isAdd) {
              addUser(this.formObj).then(res => {
                this.$message({ type: 'success', message: '添加成功!' })
                this.dialogFormVisible = false
                this.getUserListRequest(1)
              }).catch(err => {
              })
            } else {
              updateUser(this.formObj).then(res => {
                this.$message({ type: 'success', message: '更新成功!' })
                this.dialogFormVisible = false
                this.getUserListRequest(1)
              }).catch(err => {
              })
            }
          } else {
            return false
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogImageVisible = true
      },
      onFileUploadSuccess_1(response, file, fileList) {
        this.formObj.media1_.push({ name: file.name, url: response.data })
      },
      onFileUploadRemove_1(file, fileList) {
        this.formObj.media1_ = fileList
      },
      uploadFileToServer(fileObj) {
        return uploadFile(fileObj).then(res => {
          fileObj.onSuccess(res)
        }).catch(err => {
          fileObj.onError(err)
        })
      },
    },
    created() {
      this.getUserListRequest(1)
    }
  }
</script>
<style lang="scss" scoped>
  .right {
    float: right;
  }
</style>
