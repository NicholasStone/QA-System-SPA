<template>
  <div>
    <b-row class="justify-content-md-center">
      <b-col cols="8">
        <alert
          v-for="(alert, key, index) in alerts"
          :key="index"
          :alerts="alert"/>
        <b-card
          id="register"
          title="注册"
          sub-title="下一站，考拉">
          <b-form
            @submit="validate"
            @reset="formReset">
            <b-form-group
              id="name-group"
              label="昵称"
              label-for="name"
              description="选一个名字">
              <b-form-input
                id="name"
                v-model="form.name"
                :state="nameStates"
                type="text"
                required
                aria-describedby="name-feedback"
                placeholder="请填写您的昵称"/>
              <b-form-invalid-feedback id="name-feedback">
                <span
                  v-for="(error, key, index) in errors.name"
                  :key="index">{{ error }}</span>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="email-group"
              label="电子邮箱"
              label-for="email"
              description="注意：您在注册后将不能修改邮箱">
              <b-form-input
                id="email"
                v-model.lazy="form.email"
                :state="emailStates"
                type="email"
                required
                aria-describedby="email-feedback"
                placeholder="请填写您的电子邮件"/>
              <b-form-invalid-feedback id="email-feedback">
                <span
                  v-for="(error, key, index) in errors.email"
                  :key="index">{{ error }}</span>
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="password-group"
              label="Password"
              label-for="password"
              description="请选择一个强密码，至少6个字符">
              <b-form-input
                id="password"
                v-model="form.password"
                :state="passwordStates"
                type="password"
                required
                aria-describedby="password-feedback"
                placeholder="请在此填写密码"/>
              <b-form-invalid-feedback id="password-feedback">
                密码需要至少6个字符
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="password-repeat-group"
              label="确认密码"
              label-for="password"
              description="再次输入密码以进行确认">
              <b-form-input
                id="password-repeat"
                v-model.lazy="form.passwordRepeat"
                :state="passwordRepeatStates"
                type="password"
                required
                aria-describedby="password-repeat-feedback"
                placeholder="请在此再次输入密码以进行确认"/>
              <b-form-invalid-feedback id="password-repeat-feedback">
                您两次输入的密码不一致
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="captcha-group"
              :description="captcha.hit"
              label="验证码"
              label-for="captcha">
              <b-row>
                <b-col cols="9">
                  <b-form-input
                    id="captcha"
                    v-model="form.captcha.code"
                    :state="captchaStates"
                    typt="text"
                    required
                    placeholder="请输入验证码"
                    aria-describedby="captcha-feedback"/>
                  <b-form-invalid-feedback id="captcha-feedback">
                    {{ errors.captcha }}
                  </b-form-invalid-feedback>
                </b-col>
                <b-col cols="3">
                  <b-button
                    v-if="captcha.image === ''"
                    @click="getCaptcha()">点击获取验证码
                  </b-button>
                  <b-img
                    v-else
                    :src="captcha.image"
                    fluid
                    @click="getCaptcha()"/>
                </b-col>
              </b-row>
            </b-form-group>
            <b-button
              type="submit"
              variant="primary">注册
            </b-button>
            <b-button
              typt="reset"
              variant="default">重写
            </b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',
  data () {
    return {
      alerts: [],
      captcha: {
        hit: '请输入验证码以确认您不是机器人',
        image: ''
      },
      errors: {
        name: '',
        email: '',
        password: '',
        captcha: ''
      },
      form: {
        name: '',
        email: '',
        password: '',
        passwordRepeat: '',
        captcha: {
          key: '',
          code: ''
        }
      }
    }
  },
  computed: {
    nameStates: function () {
      return this.errors.name === '' ? null : false
    },
    emailStates: function () {
      return this.errors.email === '' ? null : false
    },
    passwordStates: function () {
      return this.form.password === '' ? null : this.form.password.length >= 6
    },
    captchaStates: function () {
      return this.errors.captcha === '' ? null : false
    },
    passwordRepeatStates: function () {
      if (this.form.passwordRepeat === '' || this.form.passwordRepeat.length < 6) {
        return null
      } else {
        return this.form.passwordRepeat === this.form.password
      }
    }
  },
  methods: {
    validate: function (evt) {
      evt.preventDefault()
      if (this.form.password.length >= 6 &&
        this.form.password === this.form.passwordRepeat &&
        this.form.captcha.code !== '') {
        this.register()
      }
    },
    formReset: function (evt) {
      evt.preventDefault()
      this.form.email = ''
      this.form.password = ''
      this.form.passwordRepeat = ''
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    getCaptcha: function () {
      if (this.form.email === '') {
        this.errors.email = '请先填写电子邮件'
      } else {
        axios.post('/captchas', {email: this.form.email, name: this.form.name})
          .then(response => {
            this.form.captcha.key = response.data['captcha_key']
            this.captcha.hit += '  Hit:验证码将于' + response.data['expired_at'] + '过期'
            this.captcha.image = response.data['captcha_image_content']
          })
          .catch(response => {
            console.log(response)
          })
      }
    },
    register: function () {
      axios.post('/user', this.form)
        .then(response => {
          this.$store.dispatch('update', response.data)
            .then(() => {
              this.$store.dispatch('addMessage', {message: '登录成功', type: 'success'})
              this.$router.push('Home')
            })
            .catch(() => {
              this.alerts.push({
                type: 'danger',
                message: '自动登录时发生错误，'
              })
            })
        })
        .catch(this.errorHandler)
    },
    errorHandler: function (error) {
      this.errors = Object.assign(this.errors, error.response.data.errors)
    }
  }
}
</script>

<style scoped>
  #register {
    margin-top: 5%;
  }
</style>
