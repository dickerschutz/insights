import { frappeRequest, initSocket, setConfig } from 'frappe-ui'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueGridLayout from 'vue3-drr-grid-layout'
import 'vue3-drr-grid-layout/dist/style.css'
import App from './App.vue'
import './index.css'
import router from './router'
import { createToast } from './utils/toasts'

import { registerControllers, registerGlobalComponents } from './globals'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
setConfig('resourceFetcher', (options) => {
	return frappeRequest({
		...options,
		onError(err) {
			if (err.error.messages && err.error.messages[0]) {
				createToast({
					title: 'Error',
					appearance: 'error',
					message: err.error.messages[0],
				})
			}
		},
	})
})

app.use(router)
app.use(VueGridLayout)
app.config.unwrapInjectedRef = true
app.provide(
	'$socket',
	initSocket({
		port: parseInt(import.meta.env.VITE_SOCKETIO_PORT),
	})
)

registerGlobalComponents(app)
registerControllers(app)

app.mount('#app')
