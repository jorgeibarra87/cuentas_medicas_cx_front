import { Provider } from 'react-redux'
import './App.css'

import store from './store'
import RutasConfig from './components/config/RutasConfig'

function App() {
  return (
    <>
      <Provider store={store}>
        <RutasConfig />
      </Provider>
    </>
  )
}

export default App
