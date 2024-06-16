import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosApiInstance from '../api'


const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

export const useAuthStore = defineStore('auth', () => {
    const userInfo = ref({
        token: '',
        email: '',
        userId: '',
        refreshToken: '',
    })

    const error = ref('')
    const loader = ref(false)

    const auth = async (payload, type) => {
        const stringUrl = type === 'signup' ? 'signUp' : 'signInWithPassword'
        error.value = ''
        loader.value = true
        try {
            let response = await axiosApiInstance.post(`https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`, {
                ...payload,
                returnSecureToken: true
            });
            console.log(response.data);
            userInfo.value = {
                token: response.data.idToken,
                email: response.data.email,
                userId: response.data.localId,
                refreshToken: response.data.refreshToken,
            }
            localStorage.setItem('userTokens', JSON.stringify({
                token: userInfo.value.token,
                refreshToken: userInfo.value.refreshToken,
            }))
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

    const logout = () => {
        userInfo.value = {
            token: '',
            email: '',
            userId: '',
            refreshToken: '',
        }
    }
    return { auth, userInfo, error, loader, logout }
})
