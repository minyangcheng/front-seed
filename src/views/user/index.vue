<template>
  <div class="app-container">
    <el-form ref="queryFormObjRef" :model="queryFormObj" label-width="100px" size="small">
      <el-row>
        <el-col :span="10">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="queryFormObj.username" placeholder="请输入用户名关键字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="代理商名称" prop="dealerName">
            <el-input v-model="queryFormObj.dealerName" placeholder="请输入代理商关键字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="getUserListRequest(1)">查询</el-button>
            <el-button icon="el-icon-error" @click="onReset">清除查询条件</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="float: right">
            <el-button type="primary" @click="onAdd">添加</el-button>
            <el-button type="primary" @click="onBatchDelete">批量删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" max-height="650" @selection-change="handleTableSelectionChange" border stripe>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="dealerName" label="代理商名称"></el-table-column>
      <el-table-column prop="roles" label="角色" :formatter="formatterRole"></el-table-column>
      <el-table-column prop="dealerCategory" label="代理商类型" :formatter="formatterDealerCategory"></el-table-column>
      <el-table-column prop="uptTime" label="更新日期" :formatter="formatterTime"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="onEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="onResetPassword(scope.row)" type="text" size="small">重置密码</el-button>
          <el-button @click="onBindStores(scope.row)" type="text" size="small">管理门店</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="tableDataPageSize" :total="tableDataTotalCount" layout="total,prev, pager, next"
                   @current-change="getUserListRequest">
    </el-pagination>

    <el-dialog title="用户" :visible.sync="dialogFormVisible">
      <el-form ref="formRef" :model="formObj" :rules="formRule" label-width="100px" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formObj.username" placeholder="请输入用户名（手机号）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="角色" prop="roles">
              <el-select v-model="formObj.roles" placeholder="请选择角色">
                <el-option label="管理员" value='admin'></el-option>
                <el-option label="代理商" value='dealer'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formObj.roles!='admin'">
          <el-col :span="10">
            <el-form-item label="代理商名称" prop="dealerName">
              <el-input v-model="formObj.dealerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="代理商类型" prop="dealerCategory">
              <el-select v-model="formObj.dealerCategory" placeholder="代理商类型">
                <el-option label="核心代理" value='1'></el-option>
                <el-option label="区域代理" value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onFormDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onFormDialogSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="关联门店" :visible.sync="dialogBindStoreVisible" :close-on-click-modal="false" top="5vh" width="60%">
      <el-transfer v-model="selectStoreList" filterable :titles="['可选门店列表', '已选门店']" :button-texts="['移出', '添加']"
                   :data="allStoreList">
        <span slot-scope="{ option }">{{ option.label }}</span>
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onBindStoreDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onBindStoreDialogSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getUserList, resetPassword, addUser, updateUser, deleteUser } from '@/api/user'
  import { getStoreList, bindToDealerFromUser, getHasBindStoreList } from '@/api/store'

  export default {
    data() {
      return {
        queryFormObj: {},
        formObj: {},
        selectStoreList: [],
        allStoreList: [],

        tableData: [],
        multipleSelection: [],
        dialogFormVisible: false,
        dialogBindStoreVisible: false,

        formRule: {
          username: [
            { required: true, message: '用户名（手机号）', trigger: 'change' },
            { min: 11, max: 11, message: '用户名（手机号）格式不对', trigger: 'blur' }
          ],
          roles: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          dealerName: [
            { required: true, message: '请输入代理商名称', trigger: 'change' }
          ],
          dealerCategory: [
            { required: true, message: '请选择代理商类型', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      getUserListRequest(pageIndex) {
        getUserList(this.queryFormObj.username, this.queryFormObj.dealerName, pageIndex).then(response => {
          this.tableDataTotalCount = response.data.total
          this.tableData = response.data.list
        }).catch(error => {
        })
      },
      handleTableSelectionChange(val) {
        this.multipleSelection = val
      },
      onBatchDelete() {
        if (this.multipleSelection.length == 0) {
          this.$message({ message: '请至少选择一项!' })
          return
        }
        this.$confirm('确认批量删除?', '提示').then(() => {
          let requestPromises = []
          this.multipleSelection.forEach(item => {
            requestPromises.push(deleteUser(item.id))
          })
          Promise.all(requestPromises).then((result) => {
            this.$message({ type: 'success', message: '删除成功!' })
          }).catch((error) => {
          })
        })
      },
      onAdd() {
        this.formObj = { isAdd: true }
        this.dialogFormVisible = true
      },
      onEdit(row) {
        this.formObj = { ...row }
        this.formObj.isAdd = false
        this.dialogFormVisible = true
      },
      onResetPassword(row) {
        this.$confirm('确认重置密码?', '提示').then(() => {
          resetPassword(row.id).then(res => {
            this.$message({ type: 'success', message: '重置密码成功!' })
            this.getUserListRequest(1)
          }).catch(err => {
          })
        })
      },
      onBindStores(row) {
        this.formObj = { ...row }

        getStoreList({}, 0, 0).then(res => {
          let dataList = []
          res.data.list.forEach(item => {
            if (item.dealerId && item.dealerId != row.id) {
              return
            }
            item.key = item.id
            item.label = item.storeName
            dataList.push(item)
          })
          this.allStoreList = dataList
        }).then(() => {
          return getHasBindStoreList(row.id)
        }).then(res => {
          this.selectStoreList = res.data.list.map(item => {
            return item.id
          })
          this.dialogBindStoreVisible = true
        }).catch(() => {
        })
      },
      onDelete(row) {
        this.$confirm('确认删除?', '提示').then(() => {
          deleteUser(row.id).then(res => {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getUserListRequest(1)
          }).catch(err => {
          })
        })
      },
      onFormDialogCancel() {
        this.dialogFormVisible = false
      },
      onFormDialogSure() {
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
      onBindStoreDialogCancel() {
        this.dialogBindStoreVisible = false
      },
      onBindStoreDialogSure() {
        bindToDealerFromUser(this.formObj.id, this.selectStoreList).then(() => {
          this.$message({ type: 'success', message: '绑定成功成功!' })
          this.dialogBindStoreVisible = false
          this.getUserListRequest(1)
        }).catch()
      },
      onReset() {
        this.$refs.queryFormObjRef.resetFields()
        this.getUserListRequest(1)
      }
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
