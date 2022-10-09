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
          <el-form-item label="店铺级别" prop="proxyCategory">
            <el-select v-model="queryFormObj.proxyCategory" placeholder="请选择店铺级别" style="width: 100%" clearable>
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
        <!--<el-col :span="8">-->
          <!--<el-form-item label="系统名称" prop="systemName">-->
            <!--<el-input placeholder="请输入系统名称" v-model="queryFormObj.systemName" clearable></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="8">
          <el-form-item label="门店状态" prop="status">
            <el-select v-model="queryFormObj.status" placeholder="请选择门店状态" style="width: 100%" clearable>
              <el-option label="全部" value=''></el-option>
              <el-option label="已合作" value='1'></el-option>
              <el-option label="洽谈中" value='2'></el-option>
              <el-option label="未合作" value='3'></el-option>
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
            <el-button type="primary" @click="onQuery">查询</el-button>
            <el-button icon="el-icon-error" @click="onReset">清除查询条件</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item style="float: right;">
            <span style="margin-top: 5px;color: #666666;">查询结果： {{allStoreList.length}} 家门店</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <baidu-map :style="mapStyle" :center="centerPoint" :scroll-wheel-zoom="true" :zoom="15"
               ak="Lw94ZiPeqxG007iOq2VeqlDC8oHaHuQF" @ready="onMapReady">
      <baidu-marker v-for="item in lngLatStoreList" :position="{lng: item.lng, lat: item.lat}" :dragging="false"
                    @click="open(item)">
        <baidu-label :content="item.storeName" :labelStyle="labelStyle" :offset="offset" @click="open(item)"/>
        <baidu-info-window :show="item.showFlag" @close="close(item)" @open="open(item)">
          <div>门店名称：{{item.storeName}}</div>
          <div style="margin-top: 10px">门店详细地址：{{item.address}}</div>
          <div class="btn" @click="onLookDetail(item)">查看详情</div>
        </baidu-info-window>
      </baidu-marker>
      <baidu-scale anchor="BMAP_ANCHOR_TOP_LEFT"></baidu-scale>
      <baidu-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></baidu-navigation>
      <baidu-panorama></baidu-panorama>
      <baidu-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></baidu-overview-map>
    </baidu-map>
  </div>
</template>

<script>
  import { getStoreList } from '@/api/store'
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import BaiduMarker from 'vue-baidu-map/components/overlays/Marker'
  import BaiduLabel from 'vue-baidu-map/components/overlays/Label'
  import BaiduInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'
  import BaiduScale from 'vue-baidu-map/components/controls/Scale'
  import BaiduNavigation from 'vue-baidu-map/components/controls/Navigation'
  import BaiduPanorama from 'vue-baidu-map/components/controls/Panorama'
  import BaiduOverviewMap from 'vue-baidu-map/components/controls/OverviewMap'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        mapStyle: {
          width: '100%',
          height: (document.documentElement.clientHeight - 260) + 'px'
        },
        labelStyle: {
          color: '#333333',
          fontSize: '18px',
          borderColor: '#333333',
          borderRadius: '5px',
          padding: '5px 8px'
        },
        offset: { width: -35, height: 30 },
        centerPoint: { lng: 120.212997, lat: 30.29133 },
        queryFormObj: {},
        allStoreList: [],
        lngLatStoreList: []
      }
    },
    methods: {
      getStoreList() {
        getStoreList(this.queryFormObj,0,0).then(res => {
          res.data.list.forEach(item => {
            item.showFlag = false
            if (item.latitudeLongitude) {
              let positionArr = item.latitudeLongitude.split(',')
              item.lng = positionArr[0]
              item.lat = positionArr[1]
            }
          })
          this.allStoreList = res.data.list
          this.lngLatStoreList = []
          this.allStoreList.forEach((item, index) => {
            if (item.lng && item.lat) {
              this.lngLatStoreList.push(item)
              this.centerPoint = { ...item }
            }
          })
        }).catch(err => {
        })
      },
      open(value) {
        this.lngLatStoreList.forEach(item => {
          item.showFlag = false
        })
        value.showFlag = true
      },
      close(value) {
        this.lngLatStoreList.forEach(item => {
          item.showFlag = false
        })
      },
      onLookDetail(item) {
        this.$router.push({ path: '/salesroom/detail', query: { row: JSON.stringify({ disabled: true, ...item }) } })
      },
      onMapReady() {
        this.getStoreList()
      },
      onQuery() {
        this.getStoreList()
      },
      onReset() {
        this.$refs.queryFormObjRef.resetFields()
        this.getStoreList()
      }
    },
    computed: {
      ...mapGetters([
        'roles',
        'userInfo'
      ])
    },
    components: {
      BaiduMap,
      BaiduMarker,
      BaiduLabel,
      BaiduScale,
      BaiduNavigation,
      BaiduPanorama,
      BaiduOverviewMap,
      BaiduInfoWindow
    }
  }
</script>

<style scoped>
  .btn {
    margin-top: 10px;
    float: right;
    border: 1px solid #333333;
    font-size: 16px;
    border-radius: 5px;
    padding: 5px;
  }
</style>
