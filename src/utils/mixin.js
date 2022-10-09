import Vue from 'vue'
import { parseTime } from './index'

function formatterSex(row, column, value) {
  let temp = parseInt(value)
  return temp == 2 ? '男' : '女'
}

function formatterRole(row, column, value) {
  if (!value) {
    return ''
  }
  let result = ''
  switch (value) {
    case 'admin':
      result = '管理员'
      break
    case 'dealer':
      result = '代理商'
      break
  }
  return result
}

function formatterTime(row, column, value) {
  if (!value) {
    return ''
  }
  if (typeof value == 'number') {
    value = value.toString()
  }
  if (value.indexOf('-') > 0) {
    return value
  }
  return parseTime(value, '{y}-{m}-{d} {h}:{i}')
}

function formatterStoreStatus(row, column, value) {
  if (!value) {
    return ''
  }
  value = parseInt(value)
  let result = ''
  switch (value) {
    case 1:
      result = '重点上架'
      break
    case 2:
      result = '上架'
      break
    case 3:
      result = '未上架'
      break
  }
  return result
}

function formatterStoreCategory(row, column, value) {
  if (!value) {
    return ''
  }
  value = parseInt(value)
  let result = ''
  switch (value) {
    case 1:
      result = 'S'
      break
    case 2:
      result = 'A'
      break
    case 3:
      result = 'B'
      break
    case 4:
      result = 'C'
      break
    case 5:
      result = 'D'
      break
  }
  return result
}

function formatterStoreProxyCategory(row, column, value) {
  if (!value) {
    return ''
  }
  value = parseInt(value)
  let result = ''
  switch (value) {
    case 1:
      result = '大卖场'
      break
    case 2:
      result = '精品超市'
      break
    case 3:
      result = '便利店'
      break
    case 4:
      result = '化妆品店'
      break
    case 5:
      result = '母婴店'
      break
    case 6:
      result = '美容院'
      break
    case 7:
      result = '标超'
      break
    case 8:
      result = '零食店'
      break
    case 9:
      result = '药妆铺'
      break
  }
  return result
}

function formatterDealerCategory(row, column, value) {
  if (!value || row.roles == 'admin') {
    return ''
  }
  value = parseInt(value)
  let result = ''
  switch (value) {
    case 1:
      result = '核心代理'
      break
    case 2:
      result = '区域代理'
      break
  }
  return result
}

function formatterAddress(row, column, value) {
  return row.provincesName + row.cityName + row.areaName + row.address
}

function formatterSystemStatus(row, column, value) {
  if (!value) {
    return ''
  }
  value = parseInt(value)
  let result = ''// 0未合作 1洽谈中 2已合作
  switch (value) {
    case 0:
      result = '未合作'
      break
    case 1:
      result = '洽谈中'
      break
    case 2:
      result = '已合作'
      break
  }
  return result
}

function formatterApplyStatus(row, column, value) {
  if (!value) {
    return ''
  }
  value = parseInt(value)
  let result = ''// 0未审批 1同意 2拒绝
  switch (value) {
    case 0:
      result = '未审批'
      break
    case 1:
      result = '已同意'
      break
    case 2:
      result = '已拒绝'
      break
  }
  return result
}

function formatterQualification(row, column, value) {
  if (!value) {
    return ''
  }
  value = parseInt(value)
  let result = ''
  switch (value) {
    case 1:
      result = '有其它产品在合作'
      break
    case 2:
      result = '认识采购'
      break
    case 3:
      result = '想去跟进一下'
      break
    case 4:
      result = row.remark
      break
  }
  return result
}

Vue.mixin({
  data() {
    return {
      paginationPageCount: 0,
      tableDataTotalCount: 0,
      tableDataPageSize: 20,

      formatterSex,
      formatterRole,
      formatterStoreStatus,
      formatterStoreCategory,
      formatterStoreProxyCategory,
      formatterDealerCategory,
      formatterTime,
      formatterAddress,
      formatterSystemStatus,
      formatterQualification,
      formatterApplyStatus,
    }
  },
  methods: {},
  computed: {
    showPaginationFlag() {
      return this.paginationPageCount > 1
    }
  }
})
