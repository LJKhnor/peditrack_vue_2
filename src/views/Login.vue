<template>
  <div class="login">
    <div>
      <form>
        <div>
          <label for="username">Username:</label>
          <input type="text" name="username" v-model="form.username" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="form.password" />
        </div>
        <input
          type="submit"
          class="btn patient-record-validation"
          value="Se connecter"
          @click.prevent="login"
        />
      </form>
      <p v-if="showError" id="error">Username or Password is incorrect</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'LoginVue',
  setup() {
    let form = {
      username: '',
      password: ''
    }
    let showError = false

    async function login() {
      // Send login request and handle authentication token
      const urlLogin = 'http://localhost:8085/api/auth/signin'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173'
        }
      }
      try {
        const response = await axios.post(
          urlLogin,
          {
            username: this.username,
            password: this.password
          },
          options
        )
        // Store token in local storage
        localStorage.setItem('token', response.data.token)
        this.$router.push('/')
      } catch (error) {
        console.error('Login failed : ', error)
      }
    }

    return { form, showError, login }
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
  background-color: var(--color-theme);
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
