import barba from '@barba/core'
import barbaRouter from '@barba/router'

import routes from './routes'
import DefaultTransition from './Transitions/default'
import HomeController from '../HomeController'
import AboutController from '../AboutController'
import WorkController from '../WorkController'
import Header from '../../Components/Header'
import ContactController from '../ContactController'
import ExpertiseController from '../ExpertiseController'

class XhrController {
  constructor() {
    this.m = MBZ
  }

  init() {
    try {
      barba.use(barbaRouter, {
        routes
      })
      barba.init({
        debug: true,
        transitions: [DefaultTransition],
        schema: {
          prefix: 'data-xhr',
          wrapper: 'wrap'
        },
        requestError: (trigger, action, url, response) => {
          debugger
          // go to a custom 404 page if the user click on a link that return a 404 response status
          if (
            action === 'click' &&
            response.status &&
            response.status === 404
          ) {
            barba.go('/404')
          }
          // prevent Barba from redirecting the user to the requested URL
          // this is equivalent to e.preventDefault()
          return false
        },
        views: [
          {
            namespace: 'home',
            beforeEnter() {
              setTimeout(() => HomeController.init(), 1050)
            }
          },
          {
            namespace: 'about',
            beforeEnter() {
              setTimeout(() => AboutController.init(), 1050)
            }
          },
          {
            namespace: 'work',
            beforeEnter() {
              setTimeout(() => {
                WorkController.init()
              }, 1050)
            }
          },
          {
            namespace: 'contact',
            beforeEnter() {
              setTimeout(() => {
                ContactController.init()
              }, 1050)
            }
          },
          {
            namespace: 'expertise',
            beforeEnter() {
              setTimeout(() => {
                ExpertiseController.init()
              }, 1050)
            }
          }
        ]
      })
      // window.BARBA_DEBUG = {
      //   barba,
      //   router,
      // }
      barba.hooks.before(() => {
        this.m.html.classList.add('is-transitioning')
      })
      barba.hooks.after(() => {
        this.m.html.classList.remove('is-transitioning')
      })
      barba.hooks.afterLeave((data) => {
        Header.updateMenu(data)
      })
    } catch (err) {
      console.error(err)
    }
  }
}

export default XhrController
