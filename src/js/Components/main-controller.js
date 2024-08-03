import XhrController from './xhr/controller'
import Loader from './loader'

export default new (class MainController {
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
