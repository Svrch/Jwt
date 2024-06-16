import axios from "axios";
import { useAuthStore } from "./stores/auth";
import router from "./router";

const axiosApiInstance = axios.create()

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

axiosApiInstance.interceptors.request.use((config) => {
    const url = config.url
    if (!url.includes('signInWithPassword') && (!url.includes('signUp'))) {
        const authStore = useAuthStore()
        let params = new URLSearchParams()
        params.append('auth', authStore.userInfo.token)
        config.params = params
    }
    return config
})

axiosApiInstance.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const authStore = useAuthStore()
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
            const newToken = await axios.post(
                `https://securetoken.googleapis.com/v1/token?key=${apiKey}`, {
                grant_type: 'refresh_token',
                refresh_token: JSON.parse(localStorage.getItem('userTokens')).refreshToken
            }
            )
            console.log(newToken.data);
            authStore.userInfo.token = newToken.data.access_token
            authStore.userInfo.refreshToken = newToken.data.refreshToken
            localStorage.setItem('userTokens', JSON.stringify({
                token: newToken.data.access_token,
                refreshToken: newToken.data.refresh_token
            }))
        } catch (err) {
            console.log(err);
            localStorage.removeItem('userTokens')
            router.push('/signin')
            authStore.userInfo.token = ''
            authStore.userInfo.refreshToken = ''
        }
    }
    console.log(error);
})

export default axiosApiInstance

