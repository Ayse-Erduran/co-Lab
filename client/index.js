import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'

import App from './app.js'

// establishes socket connection
import './socket'

ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById('app')
)
