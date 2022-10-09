<template>
  <div class="app-container">
    <el-form ref="queryFormObjRef" :model="queryFormObj" label-width="100px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="代理商" prop="dealerName">
            <el-input placeholder="请输入代理商关键词" v-model="queryFormObj.dealerName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司抬头" prop="company">
            <el-input placeholder="请输入公司抬头" v-model="queryFormObj.company" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="getApplyList(1)">查询</el-button>
            <el-button icon="el-icon-error" @click="onReset">清除查询条件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData" max-height="650" border stripe>
      <el-table-column prop="dealerName" label="代理商名称"></el-table-column>
      <el-table-column prop="systemName" label="系统名称"></el-table-column>
      <el-table-column prop="company" label="公司抬头"></el-table-column>
      <el-table-column prop="price" label="报备价格"></el-table-column>
      <el-table-column prop="qualification" label="资质" :formatter="formatterQualification"></el-table-column>
      <el-table-column prop="entryTime" label="进场时间" :formatter="formatterTime"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatterApplyStatus"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="onAgree(scope.row)" type="text" size="small" :disabled="scope.row.status!='0'">同意</el-button>
          <el-button @click="onDisagree(scope.row)" type="text" size="small" :disabled="scope.row.status!='0'">不同意
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-size="tableDataPageSize" :total="tableDataTotalCount" layout="total,prev, pager, next" @current-change="getApplyList">
    </el-pagination>
  </div>
</template>

<script>
  import { changeApplyStatus, getApplyList } from '@/api/chain'

  export default {
    data() {
      return {
        queryFormObj: {},
        tableData: []
      }
    },
    methods: {
      getApplyList(pageIndex) {
        getApplyList(this.queryFormObj,pageIndex).then(response => {
          this.tableDataTotalCount = response.data.total
          this.tableData = response.data.list
        }).catch(error => {
        })
      },
      onAgree(row) {
        this.$confirm('确认审批通过?', '提示').then(() => {
          changeApplyStatus(row.id, 1).then(res => {
            this.$message({ type: 'success', message: '审批通过成功!' })
            this.getApplyList(1)
          }).catch(err => {
          })
        })
      },
      onDisagree(row) {
        this.$confirm('确认审批拒绝?', '提示').then(() => {
          changeApplyStatus(row.id, 2).then(res => {
            this.$message({ type: 'success', message: '审批拒绝成功!' })
            this.getApplyList(1)
          }).catch(err => {
          })
        })
      },
      onReset() {
        this.$refs.queryFormObjRef.resetFields()
        this.getApplyList(1)
      }
    },
    created() {
      this.getApplyList(1)
    }
  }
</script>
<style lang="scss" scoped>
  .right {
    float: right;
  }
</style>
