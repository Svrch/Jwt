import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const apiKey = 'AIzaSyDhsr_szBuhFk2NQhj42dVl2Ae8OU4IxnE'

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

    const signup = async payload => {
        error.value = ''
        loader.value = true
        try {
            let response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
                ...payload,
                returnSecureToken: true

            });
            userInfo.value = {
                token: 'response.data.idToken',
                email: 'response.data.email',
                userId: 'response.data.localId',
                refreshToken: 'response.data.refreshToken',
                expiresIn: 'response.data.expiresIn'
            }
            loader.value = false
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
                default:
                    error.value = 'Error'
                    break;
            }
            loader.value = false
        }
    }
    return { signup, userInfo, error, loader }
})
