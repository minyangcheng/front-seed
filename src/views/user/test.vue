<template>
  <div class="map-container">
    <el-form>
      <el-form-item label="设备地址: ">
        <!-- <el-form-item label="街道地址"><el-input v-model="form.name"></el-input></el-form-item>
        <el-form-item label="详细地址"><el-input v-model="form.name"></el-input></el-form-item> -->
        <el-input v-model="address" :disabled="disabled">
          <span class="el-icon-edit el-input__icon" v-if="is_edit===false" slot="suffix" @click="edit_address"></span>
          <span class="el-icon-search el-input__icon" v-if="is_edit===true" slot="suffix" @click="_search"></span>
        </el-input>
      </el-form-item>
      <el-form-item label="设备坐标: ">{{ location }}</el-form-item>
    </el-form>
    <baidu-map :center="location" :zoom="zoom" @click="getClickInfo">
      <bm-view class="bm-view"></bm-view>
      <bm-local-search v-if="is_search===true" :keyword="address" :auto-viewport="true" :location="city" :forceLocal="true"></bm-local-search>
      <!-- <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list> -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-marker :position="location" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" @click="infoWindowOpen">
        <bm-info-window :title="address" :show="show" @open="infoWindowOpen" @close="infoWindowClose">
          <p v-text="content"></p >
        </bm-info-window>
      </bm-marker>
    </baidu-map>
    <!-- <el-tables>
      <el-tab-pane label="定位信息">
        <template>
        </template>
      </el-tab-pane>
    </el-tables> -->
  </div>
</template>
<style>
  .bm-view {
    width: 800px;
    height: 600px;
  }
  .map-container {
    margin-left:10px;
    margin-top:10px;
    width: 500px;
    position: relative;
    margin-bottom: 100px;
  }
</style>
<script>
  export default {
    name: 'bd-baidu',
    props: {
      locationData: {
        type: Object
      }
    },
    data () {
      return {
        //   center: {lng: '121.0009212', lat: '31.8938231'},
        // positions: {
        //   location: {lng: '120.2625893', lat: '030.4609038'},
        //   content: '设备2台',
        //   address: '',
        //   city: '杭州市'
        // },
        // positions: {
        //   location: {
        //     lng: '',
        //     lat: ''
        //   },
        //   address: '',
        //   city: '',
        //   content: ''
        // },
        location: {
          lng: '',
          lat: ''
        },
        address: '',
        content: '',
        city: '',
        show: true,
        zoom: 12,
        is_search: false,
        is_edit: false,
        disabled: true
      }
    },
    methods: {
      // handler ({BMap, map}) {
      //   console.log(BMap, map)
      //   this.positions.location.lng = this.data.location.lng
      //   this.positions.location.lat = this.data.location.lat
      //   this.zoom = 13
      // },
      infoWindowOpen () {
        this.show = true
      },
      infoWindowClose () {
        this.show = false
      },
      _show_address () {
        var params = {
          location: this.locationData.location
        }
        this.search(params)
      },
      _search () {
        //   this.is_search = true
        var params = {
          address: this.address,
          city: this.city
        }
        this.search(params)
      },
      search (params) {
        this.$request.bmap.showLocation(params).then(res => {
          if (res.code === 200) {
            const lng = res.data.location.lng
            const lat = res.data.location.lat
            this.positions.location.lng = lng
            this.positions.location.lat = lat
            if (this.positions.address === '') {
              this.positions.address = res.data.formatted_address
            }
          }
          // this.positions.city = res.data.city
        })
      },
      edit_address () {
        this.is_edit = true
        this.disabled = false
        this.is_search = true
      },
      getClickInfo (e) {
        if (this.is_edit) {
          this.location = {lng: e.point.lng, lat: e.point.lat}
          this._show_address()
        }
      }
    },
    // created () {
    //   this._show_address()
    // },
    mounted () {
      console.log('data: ', this.locationData)
      console.log('data: ', this.locationData.address)
      console.log('data lng: ', this.locationData.location.lng)
      this.$nextTick(() => {
        if (this.locationData.address !== undefined && this.locationData.address !== '') {
          this.address = this.locationData.address
        } else {
          this.location = this.locationData.location
          console.log('location: ', this.location)
        }
        this._show_address()
      })
    }
  }
</script>
