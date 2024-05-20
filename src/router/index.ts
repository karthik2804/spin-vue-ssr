import { createWebHistory, createRouter, createMemoryHistory } from 'vue-router'

import index from '../pages/index.vue'
import about from '../pages/about.vue'

const routes = [
    { path: '/', component: index },
    { path: '/about', component: about },
]

export function initRouter(server: boolean) {
    if (server) {
        return createRouter({
            history: createMemoryHistory(),
            routes,
        })
    }
    return createRouter({
        history: createWebHistory(),
        routes,
    })
}
