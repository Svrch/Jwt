<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import axios from 'axios'

import Card from 'primevue/card'
import loader from '../components/loader.vue'

const authStore = useAuthStore()

const cars = ref()
const showLoader = ref(false)

const getAllCars = async () => {
    try {
        showLoader.value = true
        const response = await axios.get(`https://jwt-vue3-5e0fa-default-rtdb.europe-west1.firebasedatabase.app/cars.json`)
        cars.value = response.data
        console.log(response.data);
    } catch (err) {
        console.log(err.response);
    } finally {
        showLoader.value = false
    }
}

onMounted(async () => {
    await getAllCars()
})

</script>

<template>
    <div>
        <h2>Cars</h2>
        <loader v-if="showLoader" />
        <div
            class="flex flex-column gap-3"
            v-else
        >
            <Card
                v-for="(car, i) in cars"
                :key="i"
            >
                <template #title> {{ car.name }} </template>
                <template #subtitle> {{ car.type }} </template>
            </Card>
        </div>
    </div>
</template>