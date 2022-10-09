<template>
  <div class="app-container">
    <el-form ref="queryFormObjRef" :model="queryFormObj" label-width="100px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="系统入驻状态" prop="systemStatus">
            <el-select v-model="queryFormObj.systemStatus" placeholder="系统入驻状态" style="width: 100%" clearable>
              <el-option label="全部" value=''></el-option>
              <el-option label="未合作" value='0'></el-option>
              <el-option label="洽谈中" value='1'></el-option>
              <el-option label="已合作" value='2'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统名称" prop="systemName">
            <el-input placeholder="请输入系统名称" v-model="queryFormObj.systemName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="省" prop="provincesName">
            <el-input placeholder="请输入省名称" v-model="queryFormObj.provincesName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="市" prop="cityName">
            <el-input placeholder="请输入省名称" v-model="queryFormObj.cityName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="getSystemList(1)">查询</el-button>
            <el-button icon="el-icon-error" @click="onReset">清除查询条件</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="float: right">
            <el-button type="primary" @click="onDownloadTemplate">模版下载</el-button>
            <el-button type="primary" @click="onAdd" v-if="roles[0]=='admin'">添加</el-button>
            <el-button type="primary" @click="onImport" v-if="roles[0]=='admin'">导入</el-button>
            <el-button type="primary" @click="onExport" v-if="roles[0]=='admin'">导出</el-button>
            <el-button type="primary" @click="onBatchDelete" v-if="roles[0]=='admin'">批量删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" max-height="650" @selection-change="handleTableSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="systemName" label="系统名称"></el-table-column>
      <el-table-column prop="storeCount" label="店铺数量"></el-table-column>
      <el-table-column prop="provincesName" label="省"></el-table-column>
      <el-table-column prop="cityName" label="市"></el-table-column>
      <el-table-column prop="systemStatus" label="系统入驻状态" :formatter="formatterSystemStatus"></el-table-column>
      <el-table-column prop="settleTime" label="入驻时间" :formatter="formatterTime"></el-table-column>
      <el-table-column prop="systemPrice" label="供货价格"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间" :formatter="formatterTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="onApply(scope.row)" type="text" size="small" :disabled="scope.row.systemStatus!=0">我要申请授权</el-button>
          <el-button @click="onDelete(scope.row)" type="text" size="small" v-if="roles[0]=='admin'">删除</el-button>
          <el-button @click="onModify(scope.row)" type="text" size="small" v-if="roles[0]=='admin'">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="tableDataPageSize" :total="tableDataTotalCount" layout="total,prev, pager, next"
                   @current-change="getSystemList">
    </el-pagination>

    <el-dialog title="添加/更新" :visible.sync="dialogSystemFormVisible">
      <el-form ref="formSystemRef" :model="formSystemObj" :rules="formSystemRule" label-width="120px" size="small">
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="formSystemObj.systemName" placeholder="请输入系统名称"></el-input>
        </el-form-item>
        <el-form-item label="店铺数量" prop="storeCount">
          <el-input v-model="formSystemObj.storeCount" type="number" placeholder="请输入店铺数量"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="省" prop="provincesName">
              <el-input v-model="formSystemObj.provincesName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="市" prop="cityName">
              <el-input v-model="formSystemObj.cityName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="供货价格" prop="systemPrice">
          <el-input v-model="formSystemObj.systemPrice" placeholder="请输入供货价格"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onFormSystemDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onFormSystemDialogSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="30%">
      <el-upload action="" accept="*/*" :on-success="onFileUploadSuccess" :data="{ fileType:3 }"
                 :http-request="uploadFileToServer" :show-file-list="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处<em>点击上传</em></div>
      </el-upload>
    </el-dialog>

    <el-dialog title="我要申请授权" :visible.sync="dialogApplyFormVisible">
      <el-form ref="formApplyRef" :model="formApplyObj" :rules="formApplyRule" label-width="100px" size="small">
        <el-form-item label="公司抬头" prop="company">
          <el-input v-model="formApplyObj.company" placeholder="请输入公司抬头"></el-input>
        </el-form-item>
        <el-form-item label="报备价格" prop="price">
          <el-input v-model="formApplyObj.price" placeholder="请输入报备价格"></el-input>
        </el-form-item>
        <el-form-item label="资质" prop="qualification">
          <el-select v-model="formApplyObj.qualification" placeholder="请选择资质">
            <el-option label="有其它产品在合作" value='1'></el-option>
            <el-option label="认识采购" value='2'></el-option>
            <el-option label="想去跟进一下" value='3'></el-option>
            <el-option label="其它原因" value='4'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formApplyObj.qualification==4" label="" prop="remark">
          <el-input type="textarea" v-model="formApplyObj.remark" placeholder="请输入具体原因"></el-input>
        </el-form-item>
        <el-form-item label="进场时间" prop="entryTime">
          <el-date-picker v-model="formApplyObj.entryTime" type="date" placeholder="请预计进场时间"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onFormApplyDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onFormApplyDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addApply, addSystem, getSystemList, deleteSystem, modifySystem } from '@/api/chain'
  import { uploadFileOnSystem } from '@/api/file'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        queryFormObj: {},
        tableData: [],
        multipleSelection:[],

        dialogSystemFormVisible: false,
        formSystemObj: {},
        formSystemRule: {
          systemName: [
            { required: true, message: '请输入系统名称', trigger: 'change' }
          ],
          storeCount: [
            { required: true, message: '请输入店铺数量', trigger: 'change' }
          ],
          provincesName: [
            { required: true, message: '请输入省名', trigger: 'change' }
          ],
          cityName: [
            { required: true, message: '请输入市名', trigger: 'change' }
          ],
          systemStatus: [
            { required: true, message: '请选择系统入驻状态', trigger: 'change' }
          ],
          settleTime: [
            { required: true, message: '请选择入驻时间', trigger: 'change' }
          ],
          systemPrice: [
            { required: true, message: '请选择入驻时间', trigger: 'change' }
          ]
        },

        dialogImportVisible: false,

        dialogApplyFormVisible: false,
        formApplyObj: {},
        formApplyRule: {
          company: [
            { required: true, message: '请输入公司抬头', trigger: 'change' }
          ],
          price: [
            { required: true, message: '请输入报备价格', trigger: 'change' }
          ],
          qualification: [
            { required: true, message: '请选择资质', trigger: 'change' }
          ],
          remark: [
            { required: true, message: '请输入具体原因', trigger: 'change' }
          ],
          entryTime: [
            { required: true, message: '请预计进场时间', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      getSystemList(pageIndex) {
        getSystemList(this.queryFormObj, pageIndex).then(response => {
          this.tableDataTotalCount = response.data.total
          this.tableData = response.data.list
        }).catch(error => {
        })
      },
      handleTableSelectionChange(val) {
        this.multipleSelection = val
      },
      onBatchDelete() {
        if(this.multipleSelection.length == 0){
          this.$message({message: '请至少选择一项!' })
          return;
        }
        this.$confirm('确认批量删除?', '提示').then(() => {
          let requestPromises = []
          this.multipleSelection.forEach(item => {
            requestPromises.push(deleteSystem(item.sid))
          })
          Promise.all(requestPromises).then((result) => {
            this.$message({ type: 'success', message: '删除成功!' })
          }).catch((error) => {
          })
        })
      },
      onAdd() {
        this.formSystemObj = { isAdd: true }
        this.dialogSystemFormVisible = true
      },
      onFormSystemDialogCancel() {
        this.dialogSystemFormVisible = false
      },
      onFormSystemDialogSure() {
        this.$refs.formSystemRef.validate(valid => {
          if (valid) {
            if (this.formSystemObj.isAdd) {
              addSystem(this.formSystemObj).then(res => {
                this.$message({ type: 'success', message: '添加成功!' })
                this.dialogSystemFormVisible = false
                this.getSystemList(1)
              }).catch(err => {
              })
            } else {
              modifySystem(this.formSystemObj).then(res => {
                this.$message({ type: 'success', message: '更新成功!' })
                this.dialogSystemFormVisible = false
                this.getSystemList(1)
              }).catch(err => {
              })
            }
          } else {
            return false
          }
        })
      },
      onImport() {
        this.dialogImportVisible = true
      },
      onExport(){
        window.open('/api/system/download?id=' + this.userInfo.id)
      },
      uploadFileToServer(fileObj) {
        return uploadFileOnSystem(fileObj).then(res => {
          fileObj.onSuccess(res)
        }).catch(err => {
          fileObj.onError(err)
        })
      },
      onFileUploadSuccess(response, file, fileList) {
        this.$message({ type: 'message', message: '导入成功!' })
        this.dialogImportVisible = false
        this.getSystemList(1)
      },
      onApply(row) {
        this.formApplyObj = { sid: row.sid }
        this.dialogApplyFormVisible = true
      },
      onFormApplyDialogCancel() {
        this.dialogApplyFormVisible = false
      },
      onFormApplyDialogSure() {
        this.$refs.formApplyRef.validate(valid => {
          if (valid) {
            addApply(this.formApplyObj).then(res => {
              this.$message({ type: 'success', message: '申请成功!' })
              this.dialogApplyFormVisible = false
              this.getSystemList(1)
            }).catch(err => {
            })
          } else {
            return false
          }
        })
      },
      onDelete(row) {
        this.$confirm('确认删除?', '提示').then(() => {
          deleteSystem(row.sid).then(res => {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getSystemList(1)
          }).catch(err => {
          })
        })
      },
      onModify(row) {
        this.formSystemObj = { ...row, isAdd: false }
        this.dialogSystemFormVisible = true
      },
      onReset() {
        this.$refs.queryFormObjRef.resetFields()
        this.getSystemList(1)
      },
      onDownloadTemplate() {
        window.open('https://solon-dealer.oss-cn-hangzhou.aliyuncs.com/%E7%B3%BB%E7%BB%9F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx')
      }
    },
    computed: {
      ...mapGetters([
        'roles',
        'userInfo'
      ])
    },
    created() {
      this.getSystemList(1)
    }
  }
</script>
<style lang="scss" scoped>
  .right {
    float: right;
  }
</style>
