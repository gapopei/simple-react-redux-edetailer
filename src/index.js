import React from "react"
import ReactDOM from "react-dom"
import "./styles/index.scss"
import App from "./components/App"
import { Provider } from "react-redux"
import { configureStore } from "redux-starter-kit"
import rootReducer from "./reducers"
import Axios from "axios"
import path from "path"
import isDev from "electron-is-dev"

let config = null

Axios.get(isDev ? "/config.json" : `file://${path.join(__dirname, "/config.json")}`)
	.then(res => {
		config = res.data || {}
	})
	.then(() => {
		// console.log(config)

		window.ELECTRON_DISABLE_SECURITY_WARNINGS = true

		let initialState = {
			timer: {
				defaultTime:
					config && config.timeoutTime ? config.timeoutTime * 60 : 120,
				counter: config && config.timeoutTime ? config.timeoutTime * 60 : 120,
				isOn: false
			}
		}

		const store = configureStore({
			reducer: rootReducer,
			preloadedState: initialState,
			devTools: true
		})

		ReactDOM.render(
			<Provider store={store}>
				<App />
			</Provider>,
			document.getElementById("root")
		)
	})
