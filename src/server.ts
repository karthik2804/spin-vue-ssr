import { HttpHandler, HttpRequest, ResponseBuilder } from "@fermyon/spin-sdk"
import { renderToString } from "@vue/server-renderer"
import { createSSRApp, Text } from "vue";
import { initRouter } from "./router";
import App from "./App.vue";
import { useCounterStore } from './store/counter'
import { createPinia, setActivePinia } from "pinia";
import { Kv } from "@fermyon/spin-sdk";


const decoder = new TextDecoder()
class Handler extends HttpHandler {
    async handleRequest(req: HttpRequest, res: ResponseBuilder) {
        return handleRequest(req, res)
    }
}

export default async function handleRequest(req: HttpRequest, res: ResponseBuilder) {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.ico" />
    <title>Vue + TailwindCSS app</title>
    <!--app-head-->
</head>
<body>
    <div id="app"><!--app-html--></div>
    <script>
            window.__INITIAL_STATE__ = <!--app-state-->
        </script>
    <script type="module" src="/static/client.js"></script>
</body>
</html>
`

    try {
        let app = createSSRApp(App)
        let router = initRouter(true)
        app.use(router)
        let pinia = createPinia()
        app.use(pinia)
        setActivePinia(pinia)
        let counterStore = useCounterStore()
        counterStore.setCount(getViewCount())
        let rendered = await renderToString(app)
        let state = pinia.state.value

        incrementViewCount()

        res.status(200)
        res.set('Content-Type', 'text/html')
        let html = template.replace("<!--app-html-->", rendered)
        html = html.replace("<!--app-state-->", JSON.stringify(state))
        res.send(html)
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal Server Error")
    }
}

export const incomingHandler = new Handler()

function getViewCount() {
    let store = Kv.openDefault()
    let val = store.get("viewCount")
    if (!val) {
        return 0
    }
    return JSON.parse(decoder.decode(val))
}

function incrementViewCount() {
    let store = Kv.openDefault()
    let val = store.get("viewCount")
    let count = 0
    if (val) {
        count = JSON.parse(decoder.decode(val)) + 1
    }
    store.set("viewCount", JSON.stringify(count))
}