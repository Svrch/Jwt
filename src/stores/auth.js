import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref({
        token: '',
        email: '',
        userId: '',
        refreshToken: '',
        expiresIn: ''
    })

    const error = ref('')
    const loader = ref(false)

    const auth = async (payload, type) => {
        const stringUrl = type === 'signup' ? 'signUp' : 'signInWithPassword'
        error.value = ''
        loader.value = true
        try {
            let response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`, {
                ...payload,
                returnSecureToken: true
            });
            console.log(response.data);
            userInfo.value = {
                token: 'response.data.idToken',
                email: 'response.data.email',
                userId: 'response.data.localId',
                refreshToken: 'response.data.refreshToken',
                expiresIn: 'response.data.expiresIn'
            }
            console.log(response);
        } catch (err) {
            console.log(err.response);
            switch (err.response.data.error.message) {
                case 'EMAIL_EXISTS':
                    error.value = 'Email exist'
                    break;
                case 'OPERATION_NOT_ALLOWED':
                    error.value = 'Operation not allowed'
                    break;
                case 'INVALID_EMAIL':
                    error.value = 'Invalid email'
                    break;
                case 'MISSING_PASSWORD':
                    error.value = 'Missing password'
                    break;
                case 'INVALID_LOGIN_CREDENTIALS':
                    error.value = 'Invalid login'
                    break;
                default:
                    error.value = 'Error'
                    break;
            }
            throw error.value
        } finally { loader.value = false }
    }
    return { auth, userInfo, error, loader }
})
