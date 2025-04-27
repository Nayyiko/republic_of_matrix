<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="input-box">
        <input 
          v-model="formData.username" 
          type="text" 
          placeholder="Username" 
          required
        >
        <i class='bx bxs-user'></i>
      </div>
      
      <div class="input-box">
        <input 
          v-model="formData.password" 
          type="password" 
          placeholder="Password" 
          required
        >
        <i class='bx bxs-lock-alt'></i>
      </div>
      
      <div v-if="isRegister" class="input-box">
        <input 
          v-model="formData.email" 
          type="email" 
          placeholder="Email" 
          required
        >
        <i class='bx bxs-envelope'></i>
      </div>
      
      <button type="submit" class="btn">
        {{ isRegister ? 'Register' : 'Login' }}
      </button>
    </form>
  </div>
</template>
<!--开发环境版本，包含了有帮助的命令行警告-->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
export default {
  props: {
    isRegister: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '',
        password: '',
        email: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const endpoint = this.isRegister ? '/api/register' : '/api/login';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.$emit('success', data);
        } else {
          this.$emit('error', data.message || 'An error occurred');
        }
      } catch (error) {
        this.$emit('error', 'Network error');
      }
    }
  }
}
</script>

<style scoped>
/* 复用现有样式 */
.input-box, .btn {
  margin: 30px 0;
}
</style>