<template>
  <div class="app-container">
    <el-table :data="tableData" max-height="650" border stripe>
      <el-table-column prop="message" label="公告内容"></el-table-column>
      <el-table-column prop="crtTime" label="发布日期" :formatter="formatterTime"></el-table-column>
      <el-table-column label="操作">
        <template slot="header" slot-scope="scope">
          <el-button type="text" size="small" @click="onAdd">添加新公告</el-button>
        </template>
        <template slot-scope="scope">
          <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="tableDataPageSize" :total="tableDataTotalCount" layout="total,prev, pager, next" @current-change="getMessageList">
    </el-pagination>

    <el-dialog title="添加公告" :visible.sync="dialogFormVisible">
      <el-form ref="formRef" :model="formObj" :rules="formRule" label-width="100px" size="small">
        <!--<el-form-item label="标题" prop="title">-->
        <!--<el-input v-model="formObj.title" placeholder="请输入标题"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="内容" prop="message">
          <el-input type="textarea" v-model="formObj.message" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onFormDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onFormDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getMessageList, addMessage, deleteMessage } from '@/api/message'

  export default {
    data() {
      return {
        formObj: {},

        tableData: [],
        dialogFormVisible: false,

        formRule: {
          // title: [
          //   { required: true, message: '请输入标题', trigger: 'change' }
          // ],
          message: [
            { required: true, message: '请输入内容', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      getMessageList(pageIndex) {
        getMessageList(pageIndex).then(response => {
          this.tableDataTotalCount = response.data.total
          this.tableData = response.data.list
        }).catch(error => {
        })
      },
      onDelete(row) {
        this.$confirm('确认删除?', '提示').then(() => {
          deleteMessage(row.id).then(res => {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getMessageList(1)
          }).catch(err => {
          })
        })
      },
      onAdd() {
        this.formObj = { message: '' }
        this.dialogFormVisible = true
      },
      onFormDialogCancel() {
        this.dialogFormVisible = false
      },
      onFormDialogSure() {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            addMessage(this.formObj).then(res => {
              this.$message({ type: 'success', message: '添加成功!' })
              this.dialogFormVisible = false
              this.getMessageList(1)
            }).catch(err => {
            })
          } else {
            return false
          }
        })
      }
    },
    created() {
      this.getMessageList(1)
    }
  }
</script>
<style lang="scss" scoped>
</style>
