import Support from './Components/Support'
import XhrInitializer from './Components/Xhr/initializer'
import MainController from './Components/MainController'

class App {
  constructor() {    
    Promise.all([App.domReady()]).then(this.init.bind(this))
  }

  static domReady() {
    return new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', resolve)
    })
  }

  init = () => {
    new Support()
    new XhrInitializer({
      main: MainController,
      m404: () => {}
    })
  }
}

export default App
