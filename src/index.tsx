import ReactDOM from 'react-dom/client'
import App from './app/app'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store/store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <Router>
        <Provider store={store}>
            <App />
            <div id='portal'></div>
        </Provider>
    </Router>
)
