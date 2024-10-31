<template>
  <div class="register"></div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'RegisterView',
  components: {},
  setup() {
    let form = {
      username: '',
      full_name: '',
      password: ''
    }
    let showError = false
    async function submit() {
      try {
        await this.Register(this.form)
        this.$router.push('/posts')
        this.showError = false
      } catch (error) {
        this.showError = true
      }
    }

    return { ...mapActions(['Register']), showError, submit, form }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}
button[type='submit'] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 30px;
}
button[type='submit']:hover {
  background-color: #45a049;
}
input {
  margin: 5px;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
  padding: 10px;
  border-radius: 30px;
}
#error {
  color: red;
}
</style>
