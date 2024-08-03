import Support from 'components/support'
import XhrInitializer from 'components/xhr/initializer'
import MainController from 'components/main-controller'

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
      m404: () => {},
    })
  }
}

export default App
