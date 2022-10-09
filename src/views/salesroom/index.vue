<template>
  <div class="app-container">
    <el-form ref="queryFormObjRef" :model="queryFormObj" label-width="100px" size="small">
      <el-row>
        <el-col :span="8" v-if="roles[0]=='admin'">
          <el-form-item label="代理商" prop="dealerName">
            <el-input placeholder="请输入代理商关键词" v-model="queryFormObj.dealerName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="省" prop="provincesName">
            <el-input placeholder="请输入省名称" v-model="queryFormObj.provincesName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="市" prop="cityName">
            <el-input placeholder="请输入省名称" v-model="queryFormObj.cityName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="系统类别" prop="proxyCategory">
            <el-select v-model="queryFormObj.proxyCategory" placeholder="请选择系统类别" style="width: 100%" clearable>
              <el-option label="全部" value=''></el-option>
              <el-option label="大卖场" value='1'></el-option>
              <el-option label="精品超市" value='2'></el-option>
              <el-option label="便利店" value='3'></el-option>
              <el-option label="化妆品店" value='4'></el-option>
              <el-option label="母婴店" value='5'></el-option>
              <el-option label="美容院" value='6'></el-option>
              <el-option label="标超" value='7'></el-option>
              <el-option label="零食店" value='8'></el-option>
              <el-option label="药妆铺" value='9'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门店级别" prop="status">
            <el-select v-model="queryFormObj.status" placeholder="请选择门店级别" style="width: 100%" clearable>
              <el-option label="全部" value=''></el-option>
              <el-option label="S" value='1'></el-option>
              <el-option label="A" value='2'></el-option>
              <el-option label="B" value='3'></el-option>
              <el-option label="C" value='4'></el-option>
              <el-option label="D" value='5'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门店名称" prop="storeName">
           <el-input placeholder="请输入名店名称" v-model="queryFormObj.storeName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="getStoreListRequest(1)">查询</el-button>
            <el-button icon="el-icon-error" @click="onReset">清除查询条件</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="float: right">
            <el-button type="primary" @click="onDownloadTemplate">模版下载</el-button>
            <el-button type="primary" @click="onAddStore">添加</el-button>
            <el-button type="primary" @click="onImportStore">导入</el-button>
            <el-button type="primary" @click="onExportStore">导出</el-button>
            <el-button type="primary" @click="onBatchDelete">批量删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" max-height="650" @selection-change="handleTableSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="storeName" label="线下店名称"></el-table-column>
      <el-table-column prop="channelsName" label="系统名称"></el-table-column>
      <el-table-column prop="provincesName" label="省"></el-table-column>
      <el-table-column prop="cityName" label="市"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <!--<el-table-column prop="storePhone" label="联系方式"></el-table-column>-->
      <el-table-column prop="status" label="状态" :formatter="formatterStoreStatus"></el-table-column>
      <el-table-column prop="proxyCategory" label="系统类别" :formatter="formatterStoreProxyCategory"></el-table-column>
      <el-table-column prop="storeCategory" label="门店级别" :formatter="formatterStoreCategory"></el-table-column>
      <!--<el-table-column prop="storeNumber" label="店铺数量"></el-table-column>-->
      <el-table-column prop="businessArea" label="经营面积"></el-table-column>
      <!--<el-table-column prop="price" label="供货价格"></el-table-column>-->
      <!--<el-table-column prop="monthlySales" label="月销售额"></el-table-column>-->
      <!--<el-table-column prop="remarks" label="备注"></el-table-column>-->
      <el-table-column prop="arrivalTime" label="进场时间" :formatter="formatterTime"></el-table-column>
      <el-table-column prop="dealerName" label="所属代理商"></el-table-column>
      <!--<el-table-column prop="uptTime" label="更新日期" :formatter="formatterTime"></el-table-column>-->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="onLook(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="onEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="onBind(scope.row)" v-if="roles[0]=='admin'" type="text" size="small">{{scope.row.dealerId ?
            '换绑' :'绑定'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="tableDataPageSize" :total="tableDataTotalCount" layout="total,prev, pager, next" @current-change="getStoreListRequest">
    </el-pagination>

    <el-dialog title="关联代理商" :visible.sync="dialogBindVisible" :close-on-click-modal="false" width="30%">
      <el-form size="small" label-width="100px">
        <el-form-item label="门店名称">
          <span>{{formObj.storeName}}</span>
        </el-form-item>
        <el-form-item label="代理商">
          <el-select v-model="userId" placeholder="请输入关键词" filterable>
            <el-option v-for="item in allUserList" :key="item.id" :label="item.dealerName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogBindCancel">取 消</el-button>
        <el-button type="primary" @click="onDialogBindSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导入门店" :visible.sync="dialogImportVisible" width="30%">
      <el-upload action="" accept="*/*" :on-success="onFileUploadSuccess" :data="{ fileType:3 }"
                 :http-request="uploadFileToServer" :show-file-list="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处<em>点击上传</em></div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
  import { getStoreList, updateStore, addStore, deleteStore, bindToDealer } from '@/api/store'
  import { getUserList } from '@/api/user'
  import { uploadFileOnStore, downloadStoreFile } from '@/api/file'
  import { getMessageList } from '@/api/message'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        allUserList: [],
        queryFormObj: {},
        formObj: {},
        tableData: [],
        multipleSelection:[],
        userId: '',

        dialogBindVisible: false,
        dialogImportVisible: false
      }
    },
    methods: {
      getStoreListRequest(page) {
        getStoreList(this.queryFormObj, page).then(res => {
          this.tableDataTotalCount = res.data.total
          this.tableData = res.data.list
        }).catch(err => {
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
            requestPromises.push(deleteStore(item.id))
          })
          Promise.all(requestPromises).then((result) => {
            this.$message({ type: 'success', message: '删除成功!' })
          }).catch((error) => {
          })
        })
      },
      onImportStore() {
        this.dialogImportVisible = true
      },
      onExportStore() {
        window.open('/api/store/download?id=' + this.userInfo.id)
      },
      onAddStore() {
        this.$router.push({
          path: '/salesroom/detail',
          query: { row: JSON.stringify({ disabled: false, isAdd: true }) }
        })
      },
      onLook(row) {
        this.$router.push({ path: '/salesroom/detail', query: { row: JSON.stringify({ disabled: true, ...row }) } })
      },
      onEdit(row) {
        this.$router.push({ path: '/salesroom/detail', query: { row: JSON.stringify({ disabled: false, ...row }) } })
      },
      onDelete(row) {
        this.$confirm('确认删除?', '提示').then(() => {
          deleteStore(row.id).then(() => {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getStoreListRequest(1)
          }).catch(() => {
          })
        }).catch(() => {
        })
      },
      onBind(row) {
        getUserList().then(res => {
          this.allUserList = res.data.list
          this.formObj = { ...row }
          this.userId = this.formObj.dealerId ? this.formObj.dealerId : ''
          this.dialogBindVisible = true
        }).catch(err => {
        })
      },
      onDialogBindCancel() {
        this.dialogBindVisible = false
      },
      onDialogBindSure() {
        if (!this.userId) {
          this.$message('请选择代理商')
          return
        }
        bindToDealer(this.userId, [this.formObj.id]).then(() => {
          this.$message({ type: 'success', message: '绑定成功!' })
          this.dialogBindVisible = false
          this.getStoreListRequest(1)
        }).catch(() => {
        })
      },
      uploadFileToServer(fileObj) {
        return uploadFileOnStore(fileObj).then(res => {
          fileObj.onSuccess(res)
        }).catch(err => {
          fileObj.onError(err)
        })
      },
      onFileUploadSuccess(response, file, fileList) {
        this.$message({ type: 'message', message: '导入成功!' })
        this.dialogImportVisible = false
        this.getStoreListRequest(1)
      },
      onReset() {
        this.$refs.queryFormObjRef.resetFields()
        this.getStoreList()
      },
      onDownloadTemplate(){
        window.open('https://solon-dealer.oss-cn-hangzhou.aliyuncs.com/%E7%BA%BF%E4%B8%8B%E5%BA%97%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx')
      }
    },
    created() {
      this.getStoreListRequest(1)
    },
    computed: {
      ...mapGetters([
        'roles',
        'userInfo'
      ])
    }
  }
</script>
<style lang="scss" scoped>

</style>
