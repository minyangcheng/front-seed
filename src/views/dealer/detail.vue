<template>
  <div class="app-container">
    <el-form ref="formObj" :model="formObj" :rules="formRule" size="medium" label-width="120px">
      <el-row>
        <el-col :span="9">
          <el-form-item label="代理商名称" prop="dealerName">
            <el-input v-model="formObj.dealerName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="类别" prop="dealerCategory">
            <el-select v-model="formObj.dealerCategory" placeholder="请选择角色">
              <el-option label="A" value='1'></el-option>
              <el-option label="B" value='2'></el-option>
              <el-option label="C" value='3'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item label="省市区">
            <el-cascader v-model="formObj.address" :props="addressCascaderProps" placeholder="请选择省市区" clearable
                         filterable separator="-"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="详细地址">
            <el-input v-model="formObj.detailAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item label="联系方式" prop="dealerPhone">
            <el-input v-model="formObj.dealerPhone" type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
        </el-col>
      </el-row>
      <el-form-item label="旗下门店">
        <el-table :data="tableData" border stripe>
          <el-table-column prop="dealerName" label="名称" width="150"></el-table-column>
          <el-table-column prop="dealerCategory" label="类别" width="120"></el-table-column>
          <el-table-column prop="dealerPhone" label="联系方式" width="120"></el-table-column>
          <el-table-column prop="provincesName" label="地址" width="120" :formatter="formatterAddress"></el-table-column>
          <el-table-column prop="uptTime" label="添加日期" width="180" :formatter="formatterTime"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="onDeleteStore(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-button type="primary" @click="onAddStore">关联门店</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog title="关联门店" :visible.sync="dialogStoreVisible" :close-on-click-modal="false" top="5vh" width="60%">
      <el-transfer v-model="formObj.selectStoreList" filterable :titles="['可选门店列表', '已选门店']"
                   :button-texts="['移出', '添加']"
                   @change="handleChange" :data="allStoreList">
        <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
      </el-transfer>

      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onDialogSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogImageVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { getStoreList } from '@/api/store'

  export default {
    data() {
      return {
        allStoreList: [],
        formObj: {
          selectStoreList: [1]
        },
        tableData: [],
        dialogStoreVisible: false,
        dialogImageUrl: '',
        dialogImageVisible: false,
        uploadFileList: [
          { name: 'a.jpg', url: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif' },
          { name: 'b.jpg', url: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif' }
        ]
      }
    },
    methods: {
      handleChange(val) {
      },
      onAddStore() {
        this.dialogStoreVisible = true
      },
      onDeleteStore(row) {
        this.$confirm('确认删除?', '提示').then(() => {
          this.$message({ type: 'success', message: '删除成功!' })
        }).catch(() => {
        })
      },
      onDialogCancel() {
        this.dialogStoreVisible = false
      },
      onDialogSure() {
        this.dialogStoreVisible = false
      },
      onSubmit() {

      }
    },
    created() {
      getStoreList().then(res => {
        res.data.list.forEach(item=>{
          item.key = item.id
          item.label = item.storeName
        })
        this.allStoreList = res.data.list
      })
    }
  }
</script>
<style lang="scss" scoped>

</style>
