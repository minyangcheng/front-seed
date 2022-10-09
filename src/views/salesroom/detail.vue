<template>
  <div class="app-container">
    <el-form ref="formRef" :rules="formRule" :model="formObj" label-width="150px" size="small"
             :disabled="formObj.disabled">
      <el-row>
        <el-col :span="10">
          <el-form-item label="渠道名称" prop="channelsName">
            <!--<el-input v-model="formObj.channelsName"></el-input>-->
            <el-select v-model="formObj.channelsName" filterable placeholder="请选择渠道" style="width: 100%;">
              <el-option
                v-for="item in channelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="线下店名称" prop="storeName">
            <el-input v-model="formObj.storeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="门店状态" prop="status">
            <el-select v-model="formObj.status" placeholder="请选择门店状态" style="width: 100%;">
              <el-option label="重点上架" value='1'></el-option>
              <el-option label="上架" value='2'></el-option>
              <el-option label="未上架" value='3'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="省" prop="provincesName" label-width="150px">
            <el-input v-model="formObj.provincesName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="市" prop="cityName" label-width="50px">
            <el-input v-model="formObj.cityName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="区" prop="areaName" label-width="50px">
            <el-input v-model="formObj.areaName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="formObj.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="系统类别" prop="proxyCategory">
            <el-select v-model="formObj.proxyCategory" placeholder="请选择系统类别" style="width: 100%;">
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
        <el-col :span="10">
          <el-form-item label="门店级别" prop="storeCategory">
            <el-select v-model="formObj.storeCategory" placeholder="请选择门店级别" style="width: 100%;">
              <el-option label="S" value='1'></el-option>
              <el-option label="A" value='2'></el-option>
              <el-option label="B" value='3'></el-option>
              <el-option label="C" value='4'></el-option>
              <el-option label="D" value='5'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="店铺数量" prop="storeNumber">
            <el-input v-model="formObj.storeNumber" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="经营面积" prop="businessArea">
            <el-input v-model="formObj.businessArea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="卷装供货价格" prop="price1">
            <el-input v-model="formObj.price1" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="卷装月销售额" prop="monthlySales1">
            <el-input v-model="formObj.monthlySales1" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="旅行装供货价格" prop="price2">
            <el-input v-model="formObj.price2" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="旅行装月销售额" prop="monthlySales2">
            <el-input v-model="formObj.monthlySales2" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="浴巾套装供货价格" prop="price3">
            <el-input v-model="formObj.price3" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="浴巾套装月销售额" prop="monthlySales3">
            <el-input v-model="formObj.monthlySales3" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="浴巾供货价格" prop="price4">
            <el-input v-model="formObj.price4" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="浴巾月销售额" prop="monthlySales4">
            <el-input v-model="formObj.monthlySales4" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="进场时间" prop="arrivalTime">
            <el-date-picker v-model="formObj.arrivalTime" type="date" placeholder="请选择进场时间" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系方式" prop="storePhone">
            <el-input v-model="formObj.storePhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="formObj.remarks"></el-input>
      </el-form-item>
      <el-form-item label="门头照片">
        <el-upload action="" list-type="picture-card" accept="image/*"
                   :on-preview="handlePictureCardPreview" :on-success="onFileUploadSuccess_1"
                   :on-remove="onFileUploadRemove_1" :data="{ fileType:1 }" :http-request="uploadFileToServer"
                   :file-list="formObj.media1_">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="陈列近景照片">
        <el-upload action="" list-type="picture-card" accept="image/*"
                   :on-preview="handlePictureCardPreview" :on-success="onFileUploadSuccess_2"
                   :on-remove="onFileUploadRemove_2" :data="{ fileType:1 }" :http-request="uploadFileToServer"
                   :file-list="formObj.media2_">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="陈列远景照片">
        <el-upload action="" list-type="picture-card" accept="image/*"
                   :on-preview="handlePictureCardPreview" :on-success="onFileUploadSuccess_3"
                   :on-remove="onFileUploadRemove_3" :data="{ fileType:1 }" :http-request="uploadFileToServer"
                   :file-list="formObj.media3_">
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
  import { updateStore, addStore } from '@/api/store'
  import { uploadFileOnStore } from '@/api/file'
  import { getSystemList } from '@/api/chain'

  export default {
    data() {
      return {
        queryObj: {},
        formObj: {},

        dialogImageVisible: false,
        dialogImageUrl: '',
        channelList: [],

        formRule: {
          storeName: [
            { required: true, message: '请输入线下店名称', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请输入门店状态', trigger: 'change' }
          ],
          provincesName: [
            { required: true, message: '请输入省', trigger: 'change' }
          ],
          cityName: [
            { required: true, message: '请输入市', trigger: 'change' }
          ],
          areaName: [
            { required: true, message: '请输入区', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'change' }
          ],
          storePhone: [
            { required: false, message: '请输入联系方式', trigger: 'change' }
          ],
          channelsName: [
            { required: true, message: '请输入渠道名称', trigger: 'change' }
          ],
          proxyCategory: [
            { required: true, message: '请选择店铺级别', trigger: 'change' }
          ],
          storeCategory: [
            { required: true, message: '请选择商场类别', trigger: 'change' }
          ],
          storeNumber: [
            { required: false, message: '请输入店铺数量', trigger: 'change' }
          ],
          businessArea: [
            { required: false, message: '请输入经营面积', trigger: 'change' }
          ],
          price: [
            { required: false, message: '请输入供货价格', trigger: 'change' }
          ],
          monthlySales: [
            { required: false, message: '请输入月销售额', trigger: 'change' }
          ],
          arrivalTime: [
            { required: false, message: '请输入进场时间', trigger: 'change', type: 'date' }
          ],
          remarks: [
            { required: false, message: '请输入备注', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      uploadFileToServer(fileObj) {
        return uploadFileOnStore(fileObj).then(res => {
          fileObj.onSuccess(res)
        }).catch(err => {
          fileObj.onError(err)
        })
      },
      onCancel() {
        this.$router.go(-1)
      },
      onSubmit() {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            this.doSubmit()
          } else {
            return false
          }
        })
      },
      doSubmit() {
        let data = {
          ...this.formObj,
          media1: JSON.stringify(this.formObj.media1_),
          media2: JSON.stringify(this.formObj.media2_),
          media3: JSON.stringify(this.formObj.media3_)
        }
        delete data.media1_
        delete data.media2_
        delete data.media3_

        if (this.formObj.isAdd) {
          addStore(data).then(res => {
            this.$message({ type: 'success', message: '添加成功!' })
            this.$router.go(-1)
          }).catch(err => {
          })
        } else {
          updateStore(data).then(res => {
            this.$message({ type: 'success', message: '更新成功!' })
            this.$router.go(-1)
          }).catch(err => {
          })
        }
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
      onFileUploadSuccess_2(response, file, fileList) {
        this.formObj.media2_.push({ name: file.name, url: response.data })
      },
      onFileUploadRemove_2(file, fileList) {
        this.formObj.media2_ = fileList
      },
      onFileUploadSuccess_3(response, file, fileList) {
        this.formObj.media3_.push({ name: file.name, url: response.data })
      },
      onFileUploadRemove_3(file, fileList) {
        this.formObj.media3_ = fileList
      }
    },
    created() {
      getSystemList({ systemStatus: 2 }, 0, 0).then(response => {
        this.channelList = response.data.list.map(item => {
          return { value: item.systemName, label: item.systemName }
        })
      }).catch(error => {
      })

      let row = JSON.parse(this.$route.query.row)
      console.log(row)
      if (row.isAdd) {
        this.formObj = { disabled: false, isAdd: true, media1_: [], media2_: [], media3_: [], region: null }
      } else {
        let media1_ = row.media1 ? JSON.parse(row.media1) : []
        let media2_ = row.media2 ? JSON.parse(row.media2) : []
        let media3_ = row.media3 ? JSON.parse(row.media3) : []
        this.formObj = { ...row, media1_, media2_, media3_ }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .right {
    float: right;
  }

  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>
