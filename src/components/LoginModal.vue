<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const authStore = useAuthStore()
const credentials = reactive({
  username: '',
  password: '',
})

const isSubmitting = ref(false)
const formError = ref<string | null>(null)

const handleLogin = async () => {
  if (!credentials.username || !credentials.password) {
    formError.value = 'Please enter both username and password.'
    return
  }

  isSubmitting.value = true
  formError.value = null

  try {
    const success = await authStore.login({ ...credentials })
    if (success) {
      emit('close')
      // Reset form
      credentials.username = ''
      credentials.password = ''
    } else {
      formError.value = authStore.error
    }
  } catch (err) {
    formError.value = 'An unexpected error occurred.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')" data-test="login-modal">
      <div class="modal-content" role="dialog" aria-modal="true">
        <BaseButton
          variant="ghost"
          size="sm"
          class="close-btn"
          data-test="close-modal"
          @click="emit('close')"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </BaseButton>

        <div class="modal-header">
          <h2 class="modal-title">Welcome Back</h2>
          <p class="modal-subtitle">Login to access your account and orders</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="formError" class="error-message">
            {{ formError }}
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="credentials.username"
              type="text"
              placeholder="Enter your username"
              required
              :disabled="isSubmitting"
              autofocus
              data-test="username-input"
            />
            <p class="hint">Try: <span>johnd</span></p>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="Enter your password"
              required
              :disabled="isSubmitting"
              data-test="password-input"
            />
            <p class="hint">Try: <span>m38rmF$</span></p>
          </div>

          <BaseButton
            type="submit"
            class="submit-btn"
            :isLoading="isSubmitting"
            block
            data-test="login-button"
            >
            Login
          </BaseButton>
        </form>

        <div class="modal-footer">
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background-color: var(--bg-card);
  width: 100%;
  max-width: 400px;
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  position: relative;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  input {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--bg-body);
    color: var(--text-primary);
    font-size: 0.95rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .hint {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;

    span {
      font-weight: 700;
      color: var(--color-primary);
    }
  }
}

.error-message {
  padding: 0.75rem 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #ef4444;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  text-align: center;
}



.modal-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);

  a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}



/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content {
  transform: scale(0.9) translateY(20px);
}
</style>
