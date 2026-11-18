import BM from './core/bind-manager'
import Detect from './core/detect'
import Throttle from './core/throttle'
import Raf from './core/raf'
import Dom from './el/dom'
import G from './el/get-element-by'
import Select from './el/select'
import RO from './event/resize-orientation'
import L from './listener/listener'
import Clamp from './math/clamp'
import Is from './core/is'
import Win from './window/window'

var M = {}
M.BM = BM
M.Detect = Detect
M.Throttle = Throttle
M.Raf = Raf
M.Dom = Dom
M.G = G
M.Select = Select
M.RO = RO
M.L = L
M.Is = Is
M.Clamp = Clamp
M.Win = Win

export default M
