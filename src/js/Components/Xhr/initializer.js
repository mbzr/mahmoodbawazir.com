import Xhr from './xhr'
import XhrEvents from './events'

import M from 'utils'

class XhrInitializer {
  constructor(params) {
    this.m = MBZ
    this.m.outroIsOn = false
    this.m.is404 = !M.G.qs('meta[name=description]')
    this.m.path = {
      new: M.Win.path,
    }
    Xhr.onPopstate()
    this.m404Controller = params.m404
    this.mainController = params.main

    const controller = this.getController()
    new XhrEvents(this.getController)
    controller.preload()
  }

  getController = () => {
    return this.m.is404 ? this.m404Controller : this.mainController
  }
}

export default XhrInitializer
