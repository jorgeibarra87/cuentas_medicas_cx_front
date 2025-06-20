import { Provider } from 'react-redux'
import './App.css'

import store from './store'
import RutasConfig from './components/config/RutasConfig'

const apiUrl = window.env.VITE_URL_API_GATEWAY;

function App() {
  console.log("API URL:", apiUrl);
  return (
    <>
      <Provider store={store}>
        <RutasConfig />
      </Provider>
    </>
  )
}

export default App
