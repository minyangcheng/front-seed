<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryObj" label-width="100px" size="small">
      <el-form-item label="门店名称">
        <el-input v-model="queryObj.storeName" placeholder="请输入门店名称关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getStoreListRequest(1)">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" max-height="650" border stripe>
      <el-table-column prop="storeName" label="门店名称"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="dealerName" label="所属加盟商"></el-table-column>
      <el-table-column prop="arrivalTime" label="加盟日期" :formatter="formatterTime"></el-table-column>
    </el-table>
    <el-pagination :page-size="tableDataPageSize" :total="tableDataTotalCount" layout="total,prev, pager, next" @current-change="getStoreListRequest">
    </el-pagination>
  </div>
</template>

<script>
  import { getStoreListByAreaQuery } from '@/api/store'

  export default {
    data() {
      return {
        queryObj: {},
        tableData: []
      }
    },
    methods: {
      getStoreListRequest(pageIndex) {
        getStoreListByAreaQuery(this.queryObj.storeName, pageIndex).then(res => {
          this.tableDataTotalCount = res.data.total
          this.tableData = res.data.list
        }).catch(err => {
        })
      }
    },
    created() {
      this.getStoreListRequest(1)
    }
  }
</script>
<style lang="scss" scoped>

</style>
