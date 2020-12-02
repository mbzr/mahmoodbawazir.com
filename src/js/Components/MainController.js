import XhrController from './Xhr/controller'
import Loader from './Loader'

export default new(class MainController {
  preload() {
    new Loader().run()
  }

  intro() {
    XhrController.intro()
  }

  outro() {
    XhrController.outro()
  }
})()
