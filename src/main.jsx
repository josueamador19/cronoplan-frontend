import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/custom.css'
import './styles/auth.css'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/dashboard.css'
import './styles/modal.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)