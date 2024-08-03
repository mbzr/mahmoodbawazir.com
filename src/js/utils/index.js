import BM from './core/bind-manager'
import Detect from './core/detect'
import Throttle from './core/throttle'
import Raf from './core/raf'
import Dom from './el/dom'
import G from './el/get-element-by'
import Select from './el/select'
import Siblings from './el/siblings'
import Parent from './el/parent'
// import Tab from './Event/Tab'
import RO from './event/resize-orientation'
import WT from './event/wheel-touch'
import WTP from './event/wheel-touch-prevent'
import L from './listener/listener'
import SZero from './scroll/scroll-zero'
import TopRefresh from './scroll/top-refresh'
import T from './style/translate'
import R from './math/round'
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
M.Siblings = Siblings
M.Parent = Parent
M.RO = RO
M.WT = WT
M.WTP = WTP
M.SZero = SZero
M.TopRefresh = TopRefresh
// M.Tab = new Tab()
M.L = L
M.T = T
M.R = R
M.Is = Is
M.Clamp = Clamp
M.Win = Win

export default M
