<template>
    <div class="flex justify-center items-center h-screen">
        <span>Hello World from Vue SSR! This page has been viewed {{ count }} time<span v-if="count">s</span></span>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCounterStore } from '../store/counter'

const counterStore = useCounterStore()

const increment = () => {
    counterStore.increment()
}

onMounted(() => {
    console.log(`The initial count is ${counterStore.count}.`)
})

const count = computed(() => counterStore.count)
</script>
