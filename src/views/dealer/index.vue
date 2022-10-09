<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryObj">
      <el-form-item label="代理商名称">
        <el-input v-model="queryObj.dealerName" placeholder="请输入代理商关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDealerListRequest(1)">查询</el-button>
        <el-button type="primary" @click="onAddDealer">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" max-height="650" border stripe>
      <el-table-column prop="dealerName" label="代理商名称"></el-table-column>
      <el-table-column prop="dealerCategory" label="类别"></el-table-column>
      <!--<el-table-column prop="dealerPhone" label="联系方式"></el-table-column>-->
      <!--<el-table-column prop="provincesName" label="省"></el-table-column>-->
      <!--<el-table-column prop="cityName" label="市"></el-table-column>-->
      <!--<el-table-column prop="areaName" label="区"></el-table-column>-->
      <!--<el-table-column prop="address" label="地址"></el-table-column>-->
      <!--<el-table-column prop="uptTime" label="更新日期" :formatter="formatterTime"></el-table-column>-->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="onLook(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="onEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="onDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :page-count="paginationPageCount" layout="prev, pager, next" style="margin-top: 30px;"
                   v-show="showPaginationFlag" @current-change="getDealerListRequest">
    </el-pagination>
  </div>
</template>

<script>
  import { getDealerList } from '@/api/dealer'

  export default {
    data() {
      return {
        queryObj: {},
        tableData: []
      }
    },
    methods: {
      getDealerListRequest(page) {
        getDealerList(this.queryObj.dealerName, page).then(res => {
          this.tableData = res.data.list
          this.paginationPageCount = res.data.pages
        }).catch(err => {
        })
      },
      onAddDealer(row) {
        this.$router.push({ path: '/dealer/detail', query: { isAdd: true } })
      },
      onLook(row) {
        this.$router.push({ path: '/dealer/detail', query: { isAdd: false, ...row } })
      },
      onEdit(row) {
        this.$router.push({ path: '/dealer/detail', query: { isAdd: false, ...row } })
      },
      onDelete(row) {
        this.$confirm('确认删除?', '提示').then(() => {
          this.$message({ type: 'success', message: '删除成功!' })
        }).catch(() => {
        })
      }
    },
    created() {
      this.getDealerListRequest(1)
    }
  }
</script>
<style lang="scss" scoped>
  .right {
    float: right;
  }

</style>
