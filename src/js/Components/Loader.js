import anime from 'animejs/lib/anime.es.js'

import Transitions from './Transitions'
import Listeners from "./Listeners";
import PathListener from './PathListener'
import M from '../Utils'

class Loader {
  constructor() {
    this.m = MBZ
  }

  run = () => {
    this.m.outroIsOn = false
    this.m.page = PathListener.run()
    const years = M.G.class('ls__years')[0],
    scroll = M.G.class('ls__scroll')[0],
    logo = M.G.class('ls__logo')[0],
    duration = 2000,
      easing = 'easeOutExpo',
    delay = this.m.page.is.home ? 500 : 0
    this.rsTl = anime.timeline({ autoplay: false }) 
    this.rsTl.add({
      targets: logo,
      translateY: [15, 0],
      opacity: [0, 1],
      duration,
      easing,
      delay
    })
    this.rsTl.add({
      targets: [years, scroll],
      translateX: [100, 0],
      rotate: [180, 180],
      easing,
      duration,
      delay: anime.stagger(150)
    }, '-=2400')
    
    this.imgArr = ['/media/bayzat/hover.png', '/media/dxblive/hover.png', '/media/rivoli/hover.png', '/media/ddw/hover.png', '/media/mtli/hover.png']
    this.m.listeners = new Listeners()
    this.loading()

  }

  loadImgs = (imgArr, cb) => {
    function load(imgToLoad, loadedCb) {
      let img = new Image;
      return img.onload = function (t) {
          loadedCb()
      }, img.crossOrigin = "anonymous", img.src = imgToLoad, img
    }
    
    !function (imgArr) {
      let imgsLoaded = [],
          imgArrL = imgArr.length;
      
      function decrementL() {
        0 == --imgArrL && cb(imgsLoaded)
      }

      if (0 === imgArrL) {
        cb()
      } else {
        for (let i = 0; i < imgArrL; ++i) {
          let loadedImg = load(imgArr[i], decrementL);

          imgsLoaded.push(loadedImg)
        }
      }
    }(imgArr)
  }

  loading = () => {
    this.intro()


      this.anim()
     
  }

  intro = () => {
    setTimeout(() => {
      this.rsTl.play()
      Transitions.run()
    }, 400)    
  }

  anim = () => {
    let delay = this.m.page.is.home ? 1500 : 500
    setTimeout(() => {
      this.hideCb()
  }, delay)
  }

  hideCb = () => {
    this.m.listeners.init()
    this.m.listeners.on()
    this.m.outroIsOn = true
  }
}

export default Loader