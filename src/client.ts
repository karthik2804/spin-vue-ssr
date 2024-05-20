import './styles.css'

import App from './App.vue'
import { initRouter } from './router'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'

const app = createSSRApp(App)
const router = initRouter(false)
app.use(router)
const pinia = createPinia()

// Replace state with server-side state
//@ts-ignore
if (window.__INITIAL_STATE__) {
    //@ts-ignore
    pinia.state.value = window.__INITIAL_STATE__
}
app.use(pinia)
app.mount('#app')
