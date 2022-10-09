import Vue from 'vue'
import { parseTime } from './index'

Vue.filter('filterSex', function(data, ...args) {
  let temp = parseInt(data)
  return temp == 2 ? '男' : '女'
})

Vue.filter('filterDateTime', function(data, ...args) {
  return parseTime(data)
})
