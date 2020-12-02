
  var t,
    N =
      ((function (y) {
        !(function () {
          function e(t, i) {
            if (!(t instanceof i))
              throw new TypeError("Cannot call a class as a function");
          }

          function s(t, i) {
            for (var e = 0; e < i.length; e++) {
              var s = i[e];
              (s.enumerable = s.enumerable || !1),
                (s.configurable = !0),
                "value" in s && (s.writable = !0),
                Object.defineProperty(t, s.key, s);
            }
          }

          function t(t, i, e) {
            return i && s(t.prototype, i), e && s(t, e), t;
          }
          var x = {};

          function n(t, i) {
            e(this, n),
              (this.cb = t),
              (this.d = i),
              x.BM(this, ["loop"]),
              (this.raf = new x.RafR(this.loop));
          }

          function i() {
            e(this, i), (this.arr = []), (this.del = 0);
          }

          function r(t) {
            e(this, r),
              x.BM(this, ["gRaf", "run", "uSvg", "uLine", "uProp"]),
              (this.v = this.vInit(t)),
              (this.raf = new x.RafR(this.run));
          }
          ((y.exports = x).M =
            (t(r, [
              {
                key: "vInit",
                value: function (t) {
                  var i = {
                    el: x.Select.el(t.el),
                    e: {
                      curve: t.e || "linear",
                    },
                    d: {
                      origin: t.d || 0,
                      curr: 0,
                    },
                    delay: t.delay || 0,
                    cb: t.cb || !1,
                    r: t.r || 2,
                    prog: 0,
                    progE: 0,
                    elapsed: 0,
                  };
                  (i.elL = i.el.length),
                    x.Has(t, "update")
                      ? (i.up = function () {
                        t.update(i);
                      })
                      : x.Has(t, "svg")
                        ? (i.up = this.uSvg)
                        : x.Has(t, "line")
                          ? (i.up = this.uLine)
                          : (i.up = this.uProp);
                  var e = t.p || !1,
                    s = t.svg || !1,
                    n = t.line || !1,
                    r = !1;
                  if (e) {
                    (i.prop = {}), (i.propI = []);
                    var a = Object.keys(e);
                    i.propL = a.length;
                    for (var o = 0; o < i.propL; o++) {
                      var h = a[o];
                      i.prop[o] = {
                        name: h,
                        origin: {
                          start: e[h][0],
                          end: e[h][1],
                        },
                        curr: e[h][0],
                        start: e[h][0],
                        end: e[h][1],
                        unit: e[h][2] || "%",
                      };
                      var l = h.charAt(0),
                        u = "r" === l && r ? "r2" : l;
                      (r = "r" === l), (i.propI[u] = o);
                    }
                  } else if (s)
                    (i.svg = {
                      type: s.type,
                      attr: "polygon" === s.type ? "points" : "d",
                      end: s.end,
                      originArr: {},
                      arr: {},
                      val: [],
                    }),
                      (i.svg.start =
                        s.start || i.el[0].getAttribute(i.svg.attr)),
                      (i.svg.curr = i.svg.start),
                      (i.svg.originArr.start = x.Svg.split(i.svg.start)),
                      (i.svg.originArr.end = x.Svg.split(i.svg.end)),
                      (i.svg.arr.start = i.svg.originArr.start),
                      (i.svg.arr.end = i.svg.originArr.end),
                      (i.svg.arrL = i.svg.arr.start.length);
                  else if (n) {
                    i.line = {
                      dashed: n.dashed,
                      coeff: {
                        start: x.Is.def(n.start)
                          ? (100 - n.start) / 100
                          : 1,
                        end: x.Is.def(n.end) ? (100 - n.end) / 100 : 0,
                      },
                      shapeL: [],
                      origin: {
                        start: [],
                        end: [],
                      },
                      curr: [],
                      start: [],
                      end: [],
                    };
                    for (var c = 0; c < i.elL; c++) {
                      var f = n.elWL || i.el[c];
                      i.line.shapeL[c] = x.Svg.shapeL(f);
                      var v = void 0;
                      if (i.line.dashed) {
                        for (
                          var d = i.line.dashed,
                          p = 0,
                          g = d.split(/[\s,]/),
                          y = g.length,
                          m = 0;
                          m < y;
                          m++
                        )
                          p += parseFloat(g[m]) || 0;
                        for (
                          var w = "",
                          k = Math.ceil(i.line.shapeL[c] / p),
                          b = 0;
                          b < k;
                          b++
                        )
                          w += d + " ";
                        v = w + "0 " + i.line.shapeL[c];
                      } else v = i.line.shapeL[c];
                      (i.el[c].style.strokeDasharray = v),
                        (i.line.origin.start[c] =
                          i.line.coeff.start * i.line.shapeL[c]),
                        (i.line.origin.end[c] =
                          i.line.coeff.end * i.line.shapeL[c]),
                        (i.line.curr[c] = i.line.origin.start[c]),
                        (i.line.start[c] = i.line.origin.start[c]),
                        (i.line.end[c] = i.line.origin.end[c]);
                    }
                  }
                  return i;
                },
              },
              {
                key: "play",
                value: function (t) {
                  this.pause(), this.vUpd(t), this.delay.run();
                },
              },
              {
                key: "pause",
                value: function () {
                  this.raf.stop(), this.delay && this.delay.stop();
                },
              },
              {
                key: "vUpd",
                value: function (t) {
                  var i = t || {},
                    e = x.Has(i, "reverse") ? "start" : "end";
                  if (x.Has(this.v, "prop"))
                    for (var s = 0; s < this.v.propL; s++)
                      (this.v.prop[s].end = this.v.prop[s].origin[e]),
                        (this.v.prop[s].start = this.v.prop[s].curr),
                        x.Has(i, "p") &&
                        x.Has(i.p, this.v.prop[s].name) &&
                        (x.Has(i.p[this.v.prop[s].name], "newEnd") &&
                          (this.v.prop[s].end =
                            i.p[this.v.prop[s].name].newEnd),
                          x.Has(i.p[this.v.prop[s].name], "newStart") &&
                          (this.v.prop[s].start =
                            i.p[this.v.prop[s].name].newStart));
                  else if (x.Has(this.v, "svg"))
                    x.Has(i, "svg") && x.Has(i.svg, "start")
                      ? (this.v.svg.arr.start = i.svg.start)
                      : (this.v.svg.arr.start = x.Svg.split(
                        this.v.svg.curr
                      )),
                      x.Has(i, "svg") && x.Has(i.svg, "end")
                        ? (this.v.svg.arr.end = i.svg.end)
                        : (this.v.svg.arr.end = this.v.svg.originArr[e]);
                  else if (x.Has(this.v, "line")) {
                    for (var n = 0; n < this.v.elL; n++)
                      this.v.line.start[n] = this.v.line.curr[n];
                    if (x.Has(i, "line") && x.Has(i.line, "end")) {
                      this.v.line.coeff.end = (100 - i.line.end) / 100;
                      for (var r = 0; r < this.v.elL; r++)
                        this.v.line.end[r] =
                          this.v.line.coeff.end * this.v.line.shapeL[r];
                    } else
                      for (var a = 0; a < this.v.elL; a++)
                        this.v.line.end[a] = this.v.line.origin[e][a];
                  }
                  (this.v.d.curr = x.Has(i, "d")
                    ? i.d
                    : x.R(
                      this.v.d.origin - this.v.d.curr + this.v.elapsed
                    )),
                    (this.v.e.curve = i.e || this.v.e.curve),
                    (this.v.e.calc = x.Ease[this.v.e.curve]),
                    (this.v.delay = x.Has(i, "delay")
                      ? i.delay
                      : this.v.delay),
                    (this.v.cb = x.Has(i, "cb") ? i.cb : this.v.cb),
                    (this.v.prog = this.v.progE =
                      0 === this.v.d.curr ? 1 : 0),
                    (this.delay = new x.Delay(this.gRaf, this.v.delay));
                },
              },
              {
                key: "gRaf",
                value: function () {
                  this.raf.run();
                },
              },
              {
                key: "run",
                value: function (t) {
                  1 === this.v.prog
                    ? (this.pause(),
                      this.v.up(),
                      this.v.cb && this.v.cb())
                    : ((this.v.elapsed = x.Clamp(t, 0, this.v.d.curr)),
                      (this.v.prog = x.Clamp(
                        this.v.elapsed / this.v.d.curr,
                        0,
                        1
                      )),
                      (this.v.progE = this.v.e.calc(this.v.prog)),
                      this.v.up());
                },
              },
              {
                key: "uProp",
                value: function () {
                  for (
                    var t = this.v.prop, i = this.v.propI, e = 0;
                    e < this.v.propL;
                    e++
                  )
                    t[e].curr = this.lerp(t[e].start, t[e].end);
                  for (
                    var s = x.Has(i, "x") ? t[i.x].curr + t[i.x].unit : 0,
                    n = x.Has(i, "y") ? t[i.y].curr + t[i.y].unit : 0,
                    r =
                      s + n === 0
                        ? 0
                        : "translate3d(" + s + "," + n + ",0)",
                    a = x.Has(i, "r")
                      ? t[i.r].name + "(" + t[i.r].curr + "deg)"
                      : 0,
                    o = x.Has(i, "r2")
                      ? t[i.r2].name + "(" + t[i.r2].curr + "deg)"
                      : 0,
                    h = x.Has(i, "s")
                      ? t[i.s].name + "(" + t[i.s].curr + ")"
                      : 0,
                    l =
                      r + a + o + h === 0
                        ? 0
                        : [r, a, o, h]
                          .filter(function (t) {
                            return 0 !== t;
                          })
                          .join(" "),
                    u = x.Has(i, "o") ? t[i.o].curr : -1,
                    c = 0;
                    c < this.v.elL && !x.Is.und(this.v.el[c]);
                    c++
                  )
                    0 !== l && (this.v.el[c].style.transform = l),
                      0 <= u && (this.v.el[c].style.opacity = u);
                },
              },
              {
                key: "uSvg",
                value: function () {
                  var t = this.v.svg;
                  t.currTemp = "";
                  for (var i = 0; i < t.arrL; i++)
                    (t.val[i] = isNaN(t.arr.start[i])
                      ? t.arr.start[i]
                      : this.lerp(t.arr.start[i], t.arr.end[i])),
                      (t.currTemp += t.val[i] + " "),
                      (t.curr = t.currTemp.trim());
                  for (
                    var e = 0;
                    e < this.v.elL && !x.Is.und(this.v.el[e]);
                    e++
                  )
                    this.v.el[e].setAttribute(t.attr, t.curr);
                },
              },
              {
                key: "uLine",
                value: function () {
                  for (var t = this.v.line, i = 0; i < this.v.elL; i++) {
                    var e = this.v.el[i].style;
                    (t.curr[i] = this.lerp(t.start[i], t.end[i])),
                      (e.strokeDashoffset = t.curr[i]),
                      0 === this.v.prog && (e.opacity = 1);
                  }
                },
              },
              {
                key: "lerp",
                value: function (t, i) {
                  return x.R(x.Lerp(t, i, this.v.progE), this.v.r);
                },
              },
            ]),
              r)),
            (x.TL =
              (t(i, [
                {
                  key: "from",
                  value: function (t) {
                    (this.del += x.Has(t, "delay") ? t.delay : 0),
                      (t.delay = this.del),
                      this.arr.push(new x.M(t));
                  },
                },
                {
                  key: "play",
                  value: function (t) {
                    this.run("play", t);
                  },
                },
                {
                  key: "pause",
                  value: function () {
                    this.run("pause");
                  },
                },
                {
                  key: "run",
                  value: function (t, i) {
                    for (
                      var e = this.arr.length, s = i || void 0, n = 0;
                      n < e;
                      n++
                    )
                      this.arr[n][t](s);
                  },
                },
              ]),
                i)),
            (x.BM = function (t, i) {
              for (var e = i.length, s = 0; s < e; s++)
                t[i[s]] = t[i[s]].bind(t);
            }),
            (x.Clamp = function (t, i, e) {
              return Math.min(Math.max(t, i), e);
            }),
            (x.Delay =
              (t(n, [
                {
                  key: "run",
                  value: function () {
                    0 === this.d ? this.cb() : this.raf.run();
                  },
                },
                {
                  key: "stop",
                  value: function () {
                    this.raf.stop();
                  },
                },
                {
                  key: "loop",
                  value: function (t) {
                    var i = x.Clamp(t, 0, this.d);
                    1 === x.Clamp(i / this.d, 0, 1) &&
                      (this.stop(), this.cb());
                  },
                },
              ]),
                n)),
            (x.Ease = {
              linear: function (t) {
                return t;
              },
              i1: function (t) {
                return 1 - Math.cos(t * (Math.PI / 2));
              },
              o1: function (t) {
                return Math.sin(t * (Math.PI / 2));
              },
              io1: function (t) {
                return -0.5 * (Math.cos(Math.PI * t) - 1);
              },
              i2: function (t) {
                return t * t;
              },
              o2: function (t) {
                return t * (2 - t);
              },
              io2: function (t) {
                return t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1;
              },
              i3: function (t) {
                return t * t * t;
              },
              o3: function (t) {
                return --t * t * t + 1;
              },
              io3: function (t) {
                return t < 0.5
                  ? 4 * t * t * t
                  : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
              },
              i4: function (t) {
                return t * t * t * t;
              },
              o4: function (t) {
                return 1 - --t * t * t * t;
              },
              io4: function (t) {
                return t < 0.5
                  ? 8 * t * t * t * t
                  : 1 - 8 * --t * t * t * t;
              },
              i5: function (t) {
                return t * t * t * t * t;
              },
              o5: function (t) {
                return 1 + --t * t * t * t * t;
              },
              io5: function (t) {
                return t < 0.5
                  ? 16 * t * t * t * t * t
                  : 1 + 16 * --t * t * t * t * t;
              },
              i6: function (t) {
                return 0 === t ? 0 : Math.pow(2, 10 * (t - 1));
              },
              o6: function (t) {
                return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
              },
              io6: function (t) {
                return 0 === t
                  ? 0
                  : 1 === t
                    ? 1
                    : (t /= 0.5) < 1
                      ? 0.5 * Math.pow(2, 10 * (t - 1))
                      : 0.5 * (2 - Math.pow(2, -10 * --t));
              },
            }),
            (x.Has = function (t, i) {
              return !!t && hasOwnProperty.call(t, i);
            }),
            (x.Is = {
              str: function (t) {
                return "string" == typeof t;
              },
              obj: function (t) {
                return t === Object(t);
              },
              arr: function (t) {
                return t.constructor === Array;
              },
              def: function (t) {
                return void 0 !== t;
              },
              und: function (t) {
                return void 0 === t;
              },
            }),
            (x.Lerp = function (t, i, e) {
              return t * (1 - e) + i * e;
            }),
            (x.R = function (t, i) {
              var e = x.Is.und(i) ? 100 : Math.pow(10, i);
              return Math.round(t * e) / e;
            }),
            (x.Select = {
              el: function (t) {
                var i = [];
                if (x.Is.str(t)) {
                  var e = t.substring(1);
                  "#" === t.charAt(0)
                    ? (i[0] = x.G.id(e))
                    : (i = x.G.class(e));
                } else i[0] = t;
                return i;
              },
              type: function (t) {
                return "#" === t.charAt(0) ? "id" : "class";
              },
              name: function (t) {
                return t.substring(1);
              },
            }),
            (x.L = function (t, i, e, s) {
              var n = document,
                r = x.Select.el(t),
                a = r.length,
                o = e,
                h = "wheel",
                l = "mouse",
                u = [l + "Wheel", l + "move", "touchmove", "touchstart"],
                c = -1 !== u.indexOf(e) && {
                  passive: !1,
                };
              e === u[0]
                ? (o =
                  "on" + h in n
                    ? h
                    : x.Is.def(n.onmousewheel)
                      ? l + h
                      : "DOMMouseScroll")
                : "focusOut" === e &&
                (o = x.Snif.isFirefox ? "blur" : "focusout");
              for (
                var f = "a" === i ? "add" : "remove", v = 0;
                v < a;
                v++
              )
                r[v][f + "EventListener"](o, s, c);
            });
          var a =
            (t(o, [
              {
                key: "add",
                value: function (t) {
                  this.arr.push(t);
                },
              },
              {
                key: "v",
                value: function () {
                  var t,
                    i,
                    e = performance.now();
                  i = document.hidden
                    ? ((this.pause = e), "stop")
                    : ((t = e - this.pause), "start");
                  for (var s = this.l(); 0 <= s; s--) this.arr[s][i](t);
                },
              },
              {
                key: "l",
                value: function () {
                  return this.arr.length - 1;
                },
              },
            ]),
              o);

          function o() {
            e(this, o),
              (this.arr = []),
              (this.pause = 0),
              x.BM(this, ["v"]),
              x.L(document, "a", "visibilitychange", this.v);
          }

          function h() {
            e(this, h),
              (this.arr = []),
              (this.pause = 0),
              (this.on = !0),
              x.BM(this, ["loop", "tOff", "tOn"]),
              x.Tab.add({
                stop: this.tOff,
                start: this.tOn,
              }),
              this.raf();
          }
          (x.Tab = new a()),
            (x.Raf =
              (t(h, [
                {
                  key: "tOff",
                  value: function () {
                    this.on = !1;
                  },
                },
                {
                  key: "tOn",
                  value: function (t) {
                    for (var i = this.l(); 0 <= i; i--)
                      this.arr[i].sT += t;
                    this.on = !0;
                  },
                },
                {
                  key: "add",
                  value: function (t) {
                    this.arr.push(t);
                  },
                },
                {
                  key: "remove",
                  value: function (t) {
                    for (var i = this.l(); 0 <= i; i--)
                      if (this.arr[i].id === t)
                        return void this.arr.splice(i, 1);
                  },
                },
                {
                  key: "loop",
                  value: function (t) {
                    if (this.on)
                      for (var i = this.l(); 0 <= i; i--) {
                        var e = this.arr[i];
                        e.sT || (e.sT = t);
                        var s = t - e.sT;
                        e.cb(s);
                      }
                    this.raf();
                  },
                },
                {
                  key: "raf",
                  value: function () {
                    requestAnimationFrame(this.loop);
                  },
                },
                {
                  key: "l",
                  value: function () {
                    return this.arr.length - 1;
                  },
                },
              ]),
                h));
          var l = new x.Raf(),
            u = 0;

          function c(t) {
            e(this, c),
              (this.eT = x.Snif.isMobile
                ? "orientationchange"
                : "resize"),
              (this.tick = !1),
              (this.arr = []),
              x.BM(this, ["fn", "gRaf", "run"]),
              (this.t = new x.Throttle({
                delay: 100,
                onlyAtEnd: !0,
                cb: this.gRaf,
              })),
              (this.raf = new x.RafR(this.run)),
              x.L(window, "a", this.eT, this.fn);
          }

          function f(t) {
            e(this, f),
              (this.del = t.delay),
              (this.onlyAtEnd = t.onlyAtEnd),
              (this.cb = t.cb),
              (this.last = 0),
              (this.t = 0);
          }

          function v(t) {
            e(this, v), (this.cb = t), (this.on = !1), (this.id = u), u++;
          }
          (x.RafR =
            (t(v, [
              {
                key: "run",
                value: function () {
                  this.on ||
                    (l.add({
                      id: this.id,
                      cb: this.cb,
                    }),
                      (this.on = !0));
                },
              },
              {
                key: "stop",
                value: function () {
                  this.on && (l.remove(this.id), (this.on = !1));
                },
              },
            ]),
              v)),
            (x.Rand = {
              range: function (t, i, e) {
                return x.R(Math.random() * (i - t) + t, e);
              },
              uniq: function (t) {
                for (var i = [], e = 0; e < t; e++) i[e] = e;
                for (var s, n = t, r = 0; n--;)
                  (r = Math.floor(Math.random() * (n + 1))),
                    (s = i[n]),
                    (i[n] = i[r]),
                    (i[r] = s);
                return i;
              },
            }),
            (x.Snif = {
              uA: navigator.userAgent.toLowerCase(),
              get isMobile() {
                return (
                  /mobi|android|tablet|ipad|iphone/.test(this.uA) ||
                  ("MacIntel" === navigator.platform &&
                    1 < navigator.maxTouchPoints)
                );
              },
              get isMobileAndroid() {
                return /android.*mobile/.test(this.uA);
              },
              get isAndroid() {
                return (
                  this.isMobileAndroid ||
                  (!this.isMobileAndroid && /android/i.test(this.uA))
                );
              },
              get isFirefox() {
                return -1 < this.uA.indexOf("firefox");
              },
              get safari() {
                return this.uA.match(/version\/[\d.]+.*safari/);
              },
              get isSafari() {
                return !!this.safari && !this.isAndroid;
              },
              get isSafariOlderThan8() {
                var t = 8;
                return (
                  this.isSafari &&
                  (t = +this.safari[0]
                    .match(/version\/\d{1,2}/)[0]
                    .split("/")[1]),
                  t < 8
                );
              },
              get isIEolderThan11() {
                return -1 < this.uA.indexOf("msie");
              },
              get isIE11() {
                return 0 < navigator.appVersion.indexOf("Trident/");
              },
              get isEdge() {
                return /Edge\/\d./i.test(this.uA);
              },
            }),
            (x.Svg = {
              shapeL: function (t) {
                if ("circle" === t.tagName)
                  return 2 * t.getAttribute("r") * Math.PI;
                if ("line" === t.tagName) {
                  var i = t.getAttribute("x1"),
                    e = t.getAttribute("x2"),
                    s = t.getAttribute("y1"),
                    n = t.getAttribute("y2");
                  return Math.sqrt((e -= i) * e + (n -= s) * n);
                }
                if ("polyline" !== t.tagName) return t.getTotalLength();
                for (
                  var r, a = 0, o = t.points.numberOfItems, h = 0;
                  h < o;
                  h++
                ) {
                  var l = t.points.getItem(h);
                  0 < h &&
                    (a += Math.sqrt(
                      Math.pow(l.x - r.x, 2) + Math.pow(l.y - r.y, 2)
                    )),
                    (r = l);
                }
                return a;
              },
              split: function (t) {
                for (
                  var i = [], e = t.split(" "), s = e.length, n = 0;
                  n < s;
                  n++
                )
                  for (
                    var r = e[n].split(","), a = r.length, o = 0;
                    o < a;
                    o++
                  ) {
                    var h = r[o];
                    (h = isNaN(h) ? h : +h), i.push(h);
                  }
                return i;
              },
            }),
            (x.Throttle =
              (t(f, [
                {
                  key: "run",
                  value: function () {
                    var i = this,
                      t = !0,
                      e = Date.now();
                    (this.last && e < this.last + this.del) || t
                      ? ((t = !1),
                        clearTimeout(this.t),
                        (this.t = setTimeout(function (t) {
                          (i.last = e), i.cb();
                        }, this.del)))
                      : ((this.last = e),
                        this.onlyAtEnd || ((t = !1), this.cb()));
                  },
                },
              ]),
                f)),
            (x.Cr = function (t) {
              return document.createElement(t);
            }),
            (x.G = {
              p: function (t) {
                return t || document;
              },
              id: function (t, i) {
                return this.p(i).getElementById(t);
              },
              class: function (t, i) {
                return this.p(i).getElementsByClassName(t);
              },
              tag: function (t, i) {
                return this.p(i).getElementsByTagName(t);
              },
            }),
            (x.Dom = {
              html: document.documentElement,
              body: document.body,
            }),
            (x.Index = {
              i: function (t, i) {
                for (var e = i.length, s = 0; s < e; s++)
                  if (t === i[s]) return s;
                return -1;
              },
              list: function (t) {
                var i = t.parentNode.children;
                return this.i(t, i);
              },
              class: function (t, i) {
                var e = x.G.class(i);
                return this.i(t, e);
              },
            }),
            (x.RO =
              (t(c, [
                {
                  key: "add",
                  value: function (t) {
                    this.arr.push(t);
                  },
                },
                {
                  key: "remove",
                  value: function (t) {
                    for (var i = this.l(); 0 <= i; i--)
                      if (this.arr[i].id === t)
                        return void this.arr.splice(i, 1);
                  },
                },
                {
                  key: "fn",
                  value: function (t) {
                    (this.e = t), this.t.run();
                  },
                },
                {
                  key: "gRaf",
                  value: function () {
                    this.tick || ((this.tick = !0), this.raf.run());
                  },
                },
                {
                  key: "run",
                  value: function () {
                    for (var t = this.l(); 0 <= t; t--)
                      this.arr[t].cb(this.e);
                    this.raf.stop(), (this.tick = !1);
                  },
                },
                {
                  key: "l",
                  value: function () {
                    return this.arr.length - 1;
                  },
                },
              ]),
                c));
          var d = new x.RO(),
            p = 0;

          function g(t) {
            e(this, g), (this.cb = t), (this.id = p), p++;
          }
          (x.ROR =
            (t(g, [
              {
                key: "on",
                value: function () {
                  d.add({
                    id: this.id,
                    cb: this.cb,
                  });
                },
              },
              {
                key: "off",
                value: function () {
                  d.remove(this.id);
                },
              },
            ]),
              g)),
            (x.TopReload = function (t) {
              "scrollRestoration" in history
                ? (history.scrollRestoration = "manual")
                : (window.onbeforeunload = function (t) {
                  window.scrollTo(0, 0);
                });
            }),
            (x.PE = {
              s: function (t, i) {
                t.style.pointerEvents = i;
              },
              all: function (t) {
                this.s(t, "all");
              },
              none: function (t) {
                this.s(t, "none");
              },
            }),
            (x.T = function (t, i, e, s) {
              var n = x.Is.und(s) ? "%" : s;
              t.style.transform =
                "translate3d(" + i + n + "," + e + n + ",0)";
            });
        })();
      })(
        (t = {
          exports: {},
        }),
        t.exports
      ),
        t.exports);

        export { N }