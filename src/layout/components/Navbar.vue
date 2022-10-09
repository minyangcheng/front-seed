<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="mineInfo">我的信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="modifyPassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided v-if="userInfo.username == 'root'">
            <span style="display:block;" @click="formatSystem">格式化</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">注销</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="我的信息" :visible.sync="dialogInfoVisible">
      <el-form :model="userInfo" disabled label-width="100px" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username" placeholder="请输入用户名（手机号）"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="角色">
              <el-select v-model="userInfo.roles[0]" placeholder="请选择角色">
                <el-option label="管理员" value='admin'></el-option>
                <el-option label="代理商" value='dealer'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="userInfo.roles[0]!='admin'">
          <el-col :span="10">
            <el-form-item label="代理商名称">
              <el-input v-model="userInfo.dealerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="代理商类型">
              <el-select v-model="userInfo.dealerCategory" placeholder="请选择代理商类型">
                <el-option label="核心代理" value='1'></el-option>
                <el-option label="区域代理" value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <el-dialog title="修改信息" :visible.sync="dialogModifyPasswordVisible">
      <el-form size="small" label-width="100px">
        <el-form-item label="老密码">
          <el-input v-model="formObj.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="formObj.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="formObj.surePassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogCancel">取 消</el-button>
        <el-button type="primary" @click="onDialogSure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogNoticeVisible" width="40%" :close-on-click-modal="false">
      <div style="display: flex;flex-flow:column wrap;align-items: center;">
        <div style="font-size: 25px;">{{notice.title}}</div>
        <div
          style="font-size: 20px;margin-top: 20px;min-height: 80px;display: flex;justify-content: center;align-items: center;">
          {{notice.message}}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import { getMessageList } from '@/api/message'
  import store from '@/store'
  import { modifyPassword, formatSystem } from '@/api/user'

  export default {
    data() {
      return {
        formObj: {},
        dialogInfoVisible: false,
        dialogModifyPasswordVisible: false,
        dialogNoticeVisible: false,
        notice: {
          title: '公告栏',
          message: 'message'
        }
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'userInfo'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      },
      mineInfo() {
        this.dialogInfoVisible = true
      },
      modifyPassword() {
        this.dialogModifyPasswordVisible = true
      },
      onDialogCancel() {
        this.dialogModifyPasswordVisible = false
      },
      onDialogSure() {
        if (!this.formObj.oldPassword) {
          this.$message('请输入老密码')
          return
        }
        if (!this.formObj.newPassword) {
          this.$message('请输入新密码')
          return
        }
        if (!this.formObj.surePassword) {
          this.$message('请重新输入新密码')
          return
        }
        if (this.formObj.surePassword != this.formObj.newPassword) {
          this.$message('新密码和确认密码不一致，请重新输入')
          return
        }
        modifyPassword(this.formObj.oldPassword, this.formObj.newPassword).then(() => {
          this.dialogModifyPasswordVisible = false
          this.$message({ type: 'success', message: '密码修改成功，请重新登陆!' })
          setTimeout(() => {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }, 2000)
        }).catch(() => {
        })
      },
      formatSystem() {
        this.$confirm('确认格式化成功?', '提示').then(() => {
          formatSystem().then(res => {
            this.$message({ type: 'success', message: '格式化成功!' })
          }).catch(err => {
          })
        })
      }
    },
    created() {
      getMessageList(1, 1).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          this.dialogNoticeVisible = true
          this.notice.message = res.data.list[0].message
          setTimeout(() => {
            this.dialogNoticeVisible = false
          }, 30000)
        }
      }).catch(err => {
      })
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
