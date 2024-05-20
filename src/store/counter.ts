import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0
    }),
    actions: {
        setCount(value: number) {
            this.count = value
        }
    }
})