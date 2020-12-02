import { N } from './Scroll/lib'
import M from '../Utils'



const y = {
  vertex: ["precision mediump float;attribute vec4 a_p;uniform mat4 u_m;attribute vec2 a_t;varying vec2 v_t;uniform float u_ma;uniform float u_dM;uniform float u_z;float q(float t){float p=2.0*t* t;return t<0.5?p:-p+(4.0*t)-1.0;}void main(){float d=length(a_p.xy);float z=0.0;if(d<u_dM){float nD=d/u_dM;float eD=q(nD);z=u_z-(eD*u_z);z=-z*u_ma;}gl_Position=u_m*vec4(a_p.x,a_p.y,a_p.z +z,1.0);v_t=a_t;}"].join("\n"),
  fragment: ["precision mediump float;varying vec2 v_t;uniform sampler2D u_tex;uniform float u_bw;uniform float u_o;uniform float u_oC;void main(){vec4 oC = vec4(u_oC,u_oC,u_oC,1.0);vec4 tC=texture2D(u_tex,v_t);vec4 tB=vec4(vec3(tC.r+tC.g+tC.b)/3.0,1.0);vec4 tF=mix(tB,oC,0.9);vec4 tex=mix(tC,tF,u_bw);gl_FragColor=mix(oC,tex,u_o);}"].join("\n")
}

class Vertices {
  constructor(t) {
    this.m = MBZ
    var i = this.m.win.w,
    e = this.m.win.h,
    s = t.winGl;
  this.dependToH = this.m.winHpsdH,
    this.dependToW = this.m.winWpsdW,
    this.winGlWinW = s / i, this.winGlWinH = s / e,
    this.demiWinGl = s / 2, this.ratio = e / i
    this.mLib = M
  }


run = (t) => {
  var i = t.plane;
      if(this.mLib.Is.def(i.proportion)) {
        var e = i.proportion;
        this.HpxToHwin = "h" === e ? (this.WpxToWwin = this.dependToH, this.dependToH) : (this.WpxToWwin = this.dependToW, this.dependToW)
      } else this.WpxToWwin = this.dependToW, this.HpxToHwin = this.dependToH;
      var s = this.mLib.Is.und(t.scroll) ? 0 : this.mLib.Is.und(t.scroll.x) ? 0 : t.scroll.x,
        r = this.mLib.Is.und(t.scroll) ? 0 : this.mLib.Is.und(t.scroll.y) ? 0 : t.scroll.y,
        o = {};
      i.isInsightsOneHeader ? (o.x = i.x * this.dependToW - s, o.y = i.y - r, o.w = i.w * this.dependToW, o.h = i.h * this.dependToW) : i.isNext ? (o.x = i.x * this.dependToW - s, o.y = i.y - r, o.w = i.w * this.dependToW, o.h = i.h * this.dependToH) : (o.x = i.x * this.WpxToWwin - s, o.y = i.y * this.HpxToHwin - r, o.w = i.w * this.WpxToWwin, o.h = i.h * this.HpxToHwin);
      for(var a = o.x * this.winGlWinW, n = o.y * this.winGlWinH, h = o.w * this.winGlWinW, l = o.h * this.winGlWinH, c = i.points.hori, p = c - 1, u = i.points.vert - 1, d = h / p, g = l / u, f = this.demiWinGl - a, v = -this.demiWinGl + l + n, m = [], y = 0, w = 0; w < u; w++)
        for(var x = g * w - v, k = x + g, b = 0; b < c; b++) {
          var L = d * b - f;
          m[y++] = L, m[y++] = x, m[y++] = 0, m[y++] = L, m[y++] = k, m[y++] = 0, b === p && w !== u - 1 && (m[y++] = L, m[y++] = k, m[y++] = 0, m[y++] = -f, m[y++] = k, m[y++] = 0)
        }
      var T = m.length,
        M = T / 3;
      if(this.mLib.Is.def(t.pulse))
        for(var W = t.pulse.arrL, S = t.pulse.zMax, C = t.pulse.radius, O = 0; O < T; O++)
          if(0 !== O && O % 3 == 2)
            for(var G = 0, I = 0; I < W; I++) {
              var D = t.pulse.arr[I],
                A = m[O - 2] - (D.x * this.winGlWinW - this.demiWinGl),
                R = (m[O - 1] + (D.y * this.winGlWinH - this.demiWinGl)) * this.ratio,
                N = Math.sqrt(A * A + R * R),
                z = this.cubicPulse(D.progress * C, S, N);
              G += Math.min(z / (1 / S), S), m[O] = Math.min(G, S)
            }
          var P = t.img,
            H = {};
      H.img = this.mLib.R(P.width / P.height, 7), H.plane = 0 === o.h ? 0 : this.mLib.R(o.w / o.h, 7);
      var E, F, X = i.scale,
        B = {};
      if(this.mLib.Is.def(i.static)) {
        var _ = i.static.w * this.WpxToWwin,
          j = i.static.h * this.HpxToHwin;
        if(H.planeStatic = this.mLib.R(_ / j, 7), H.planeStatic > H.img) B.w = X, B.h = X / H.img * H.plane;
        else {
          var Y = H.plane / H.planeStatic;
          B.w = X * H.img / H.plane * Y, B.h = X * Y
        }
      } else H.plane > H.img ? (B.w = X, B.h = X / H.img * H.plane) : (B.w = X * H.img / H.plane, B.h = X);
      if(this.mLib.Is.def(i.position)) {
        var U = i.position.hori;
        E = "left" === U ? 0 : "center" === U ? (1 - 1 / B.w) / 2 : 1 - 1 / B.w;
        var Z = i.position.vert;
        F = "top" === Z ? 1 - 1 / B.h : "center" === Z ? (1 - 1 / B.h) / 2 : 0
      } else E = (1 - 1 / B.w) / 2, F = (1 - 1 / B.h) / 2;
      for(var q = [], V = 0, J = 0; J < u; J++)
        for(var K = 1 - J / u / B.h - F, Q = 1 - (J + 1) / u / B.h - F, $ = 0; $ < c; $++) {
          var tt = $ / p / B.w + E;
          if(q[V++] = tt, q[V++] = K, q[V++] = tt, q[V++] = Q, $ === p && J !== u - 1)
            for(var it = 0; it < 4; it++) q[V++] = 0
        }
      return {
        pos: {
          type: "TRIANGLE_STRIP",
          arr: m,
          l: M
        },
        texCoord: {
          arr: q
        }
      }
}
  
cubicPulse = (t, i, e) => {
  return i < (e = Math.abs(e - t)) ? 0 : 1 - (e /= i) * e * (3 - 2 * e)
}
}

const createTextures = (i, e) => {
  console.log('ie', i, e)
  for(var s = e.length, r = [], o = 0; o < s; o++) {
    var a = i.createTexture();
    i.bindTexture(i.TEXTURE_2D, a), i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, e[o]), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, i.LINEAR), r[o] = a
  }
  return r
}
  
class CanvasMethods {
    constructor() {
      
    }
    inverse = (t, i) => {
      i = i || new Float32Array(16);
      var e = t[0]
        , s = t[1]
        , r = t[2]
        , o = t[3]
        , a = t[4]
        , n = t[5]
        , h = t[6]
        , l = t[7]
        , c = t[8]
        , p = t[9]
        , u = t[10]
        , d = t[11]
        , g = t[12]
        , f = t[13]
        , v = t[14]
        , m = t[15]
        , y = u * m
        , w = v * d
        , x = h * m
        , k = v * l
        , b = h * d
        , L = u * l
        , T = r * m
        , M = v * o
        , W = r * d
        , S = u * o
        , C = r * l
        , O = h * o
        , G = c * f
        , I = g * p
        , D = a * f
        , A = g * n
        , R = a * p
        , N = c * n
        , z = e * f
        , P = g * s
        , H = e * p
        , E = c * s
        , F = e * n
        , X = a * s
        , B = y * n + k * p + b * f - (w * n + x * p + L * f)
        , _ = w * s + T * p + S * f - (y * s + M * p + W * f)
        , j = x * s + M * n + C * f - (k * s + T * n + O * f)
        , Y = L * s + W * n + O * p - (b * s + S * n + C * p)
        , U = 1 / (e * B + a * _ + c * j + g * Y);
      return i[0] = U * B,
      i[1] = U * _,
      i[2] = U * j,
      i[3] = U * Y,
      i[4] = U * (w * a + x * c + L * g - (y * a + k * c + b * g)),
      i[5] = U * (y * e + M * c + W * g - (w * e + T * c + S * g)),
      i[6] = U * (k * e + T * a + O * g - (x * e + M * a + C * g)),
      i[7] = U * (b * e + S * a + C * c - (L * e + W * a + O * c)),
      i[8] = U * (G * l + A * d + R * m - (I * l + D * d + N * m)),
      i[9] = U * (I * o + z * d + E * m - (G * o + P * d + H * m)),
      i[10] = U * (D * o + P * l + F * m - (A * o + z * l + X * m)),
      i[11] = U * (N * o + H * l + X * d - (R * o + E * l + F * d)),
      i[12] = U * (D * u + N * v + I * h - (R * v + G * h + A * u)),
      i[13] = U * (H * v + G * r + P * u - (z * u + E * v + I * r)),
      i[14] = U * (z * h + X * v + A * r - (F * v + D * r + P * h)),
      i[15] = U * (F * u + R * r + E * h - (H * h + X * u + N * r)),
      i
  }
      
    perspective = (t, i, e, s, r) => {
      r = r || new Float32Array(16);
      var o = Math.tan(.5 * Math.PI - .5 * t)
        , a = 1 / (e - s);
      return r[0] = o / i,
      r[1] = 0,
      r[2] = 0,
      r[3] = 0,
      r[4] = 0,
      r[5] = o,
      r[6] = 0,
      r[7] = 0,
      r[8] = 0,
      r[9] = 0,
      r[10] = (e + s) * a,
      r[11] = -1,
      r[12] = 0,
      r[13] = 0,
      r[14] = e * s * a * 2,
      r[15] = 0,
      r
    }

    translation = (t, i, e, s) => {
      return (s = s || new Float32Array(16))[0] = 1,
      s[1] = 0,
      s[2] = 0,
      s[3] = 0,
      s[4] = 0,
      s[5] = 1,
      s[6] = 0,
      s[7] = 0,
      s[8] = 0,
      s[9] = 0,
      s[10] = 1,
      s[11] = 0,
      s[12] = t,
      s[13] = i,
      s[14] = e,
      s[15] = 1,
      s
    }
    
    translate = (t, i, e, s, r) => {
      r = r || new Float32Array(16);
      var o = t[0]
        , a = t[1]
        , n = t[2]
        , h = t[3]
        , l = t[4]
        , c = t[5]
        , p = t[6]
        , u = t[7]
        , d = t[8]
        , g = t[9]
        , f = t[10]
        , v = t[11]
        , m = t[12]
        , y = t[13]
        , w = t[14]
        , x = t[15];
      return t !== r && (r[0] = o,
      r[1] = a,
      r[2] = n,
      r[3] = h,
      r[4] = l,
      r[5] = c,
      r[6] = p,
      r[7] = u,
      r[8] = d,
      r[9] = g,
      r[10] = f,
      r[11] = v),
      r[12] = o * i + l * e + d * s + m,
      r[13] = a * i + c * e + g * s + y,
      r[14] = n * i + p * e + f * s + w,
      r[15] = h * i + u * e + v * s + x,
      r
    }
    
    multiply = (t, i, e) => {
      e = e || new Float32Array(16);
      var s = i[0]
        , r = i[1]
        , o = i[2]
        , a = i[3]
        , n = i[4]
        , h = i[5]
        , l = i[6]
        , c = i[7]
        , p = i[8]
        , u = i[9]
        , d = i[10]
        , g = i[11]
        , f = i[12]
        , v = i[13]
        , m = i[14]
        , y = i[15]
        , w = t[0]
        , x = t[1]
        , k = t[2]
        , b = t[3]
        , L = t[4]
        , T = t[5]
        , M = t[6]
        , W = t[7]
        , S = t[8]
        , C = t[9]
        , O = t[10]
        , G = t[11]
        , I = t[12]
        , D = t[13]
        , A = t[14]
        , R = t[15];
      return e[0] = s * w + r * L + o * S + a * I,
      e[1] = s * x + r * T + o * C + a * D,
      e[2] = s * k + r * M + o * O + a * A,
      e[3] = s * b + r * W + o * G + a * R,
      e[4] = n * w + h * L + l * S + c * I,
      e[5] = n * x + h * T + l * C + c * D,
      e[6] = n * k + h * M + l * O + c * A,
      e[7] = n * b + h * W + l * G + c * R,
      e[8] = p * w + u * L + d * S + g * I,
      e[9] = p * x + u * T + d * C + g * D,
      e[10] = p * k + u * M + d * O + g * A,
      e[11] = p * b + u * W + d * G + g * R,
      e[12] = f * w + v * L + m * S + y * I,
      e[13] = f * x + v * T + m * C + y * D,
      e[14] = f * k + v * M + m * O + y * A,
      e[15] = f * b + v * W + m * G + y * R,
      e
    }
    
    identity = (t) => {
      return (t = t || new Float32Array(16))[0] = 1,
      t[1] = 0,
      t[2] = 0,
      t[3] = 0,
      t[4] = 0,
      t[5] = 1,
      t[6] = 0,
      t[7] = 0,
      t[8] = 0,
      t[9] = 0,
      t[10] = 1,
      t[11] = 0,
      t[12] = 0,
      t[13] = 0,
      t[14] = 0,
      t[15] = 1,
      t
    }
    
    lookAt = (t, i, e, s) => {
      s = s || new Float32Array(16);
      var r = this.normalize(this.subtract(t, i))
        , o = this.normalize(this.cross(e, r))
        , a = this.normalize(this.cross(r, o));
      return s[0] = o[0],
      s[1] = o[1],
      s[2] = o[2],
      s[3] = 0,
      s[4] = a[0],
      s[5] = a[1],
      s[6] = a[2],
      s[7] = 0,
      s[8] = r[0],
      s[9] = r[1],
      s[10] = r[2],
      s[11] = 0,
      s[12] = t[0],
      s[13] = t[1],
      s[14] = t[2],
      s[15] = 1,
      s
  }

    subtract = (t, i, e) => {
      return (e = e || new Float32Array(3))[0] = t[0] - i[0],
      e[1] = t[1] - i[1],
      e[2] = t[2] - i[2],
      e
    }
    
    cross = (t, i, e) => {
      return (e = e || new Float32Array(3))[0] = t[1] * i[2] - t[2] * i[1],
      e[1] = t[2] * i[0] - t[0] * i[2],
      e[2] = t[0] * i[1] - t[1] * i[0],
      e
    }
    
    normalize = (t, i) => {
      i = i || new Float32Array(3);
      var e = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]);
      return 1e-5 < e && (i[0] = t[0] / e,
      i[1] = t[1] / e,
      i[2] = t[2] / e),
      i
  }
  }
  
function returnMatrix() {
  var t = (45 * Math.PI) / 180;
  const canvasMethods = new CanvasMethods()
  return {
    matrix: canvasMethods.multiply(
      canvasMethods.perspective(t, 1, 1, 10),
      canvasMethods.inverse(canvasMethods.lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]))
    ),
    winGl: N.R(2 * Math.tan(t / 2) * 5, 5),
  };
}

const w = {
  psd: {
    over500: {
      w: 1680,
      h: 992
    },
    under500: {
      w: 414,
      h: 736
    }
  },
  gl: {
    over500: {
      x: 210,
      y: 142,
      w: 400,
      h: 600,
      points: {
        hori: 18,
        vert: 14
      },
      marge: {
        x: 210,
        y: 120
      }
    },
    under500: {
      x: 154,
      y: 84,
      w: 260,
      h: 339,
      points: {
        hori: 18,
        vert: 14
      },
      marge: {
        x: 60,
        y: 50
      }
    }
  },

}

class Positions {
  constructor() {
    this.m = MBZ
  }
  init = (t) => {
    var i = w.gl[this.m.over500Prop], e = t, work = document.getElementById('work'), s = {
      arr: [],
      ty: work.getBoundingClientRect().top
    },
    r = 0

  //   for(var r = 0, o = 0; o < 5; o++) {
  //   var a = o - 2,
  //     n = a < 0 ? e + a : a;
  //   s.arr[r] = {
  //     x: i.x,
  //     y: i.y + s.ty * a,
  //     w: i.w,
  //     h: i.h,
  //     points: i.points,
  //     direction: 1,
  //     imgNo: n,
  //     scale: 1
  //   }, r++
  // }
    
    /**
     * x: 210,
      y: 935,
      w: 494,
      h: 714,
      points: {
        hori: 18,
        vert: 14
      },
      marge: {
        x: 210,
        y: 120
      }
     * 
     * 
     */
  for(var h = i.w + i.marge.x, c = -350 + i.y, p = 0; p < 3; p++) {
    var u = p + 1,
      d = 4 - p;
    var sy = s.ty + 142
    s.arr[r] = {
      x: i.x,
          y: p === 0 ? sy : sy + (i.h * p) + (i.marge.y * p),
          w: i.w,
          h: i.h,
          points: i.points,
          direction: -1,
          imgNo: d,
          scale: 1
    }, r++
  }
  // if(this.m.over500)
  //   for(var g = i.x - 2 * h, f = 0; f < 5; f++) {
  //     var v = f - 2,
  //       m = v - 1,
  //       y = m < 0 ? e + m : m;
  //     s.arr[r] = {
  //       x: g,
  //       y: i.y + s.ty * v,
  //       w: i.w,
  //       h: i.h,
  //       points: i.points,
  //       direction: 1,
  //       imgNo: y,
  //       scale: 1
  //     }, r++
  //   }
  return s.arrL = s.arr.length, s
  }
}

class Canvas {
  constructor() {
    this.m = MBZ
  }
  init = () => {
    this.glEl = document.getElementById('gl')
    this.glOptions = {
      antialias: !0,
      alpha: !0,
      premultipliedAlpha: !1,
    }
    this.gl = this.glEl.getContext("webgl", this.glOptions) || this.glEl.getContext("experimental-webgl")
    this.mrogram = this.createProgram(this.gl, [y.vertex, y.fragment])
    this.attrib = this.loc("a", this.gl, this.mrogram, ["p", "t"]),
             this.uniform = this.loc("u", this.gl, this.mrogram, ["m", "ma", "dM", "z", "bw", "o", "oC"]), 
             this.texCoordBuffer = this.gl.createBuffer(), 
             this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer),
              this.gl.vertexAttribPointer(this.attrib.t, 2, this.gl.FLOAT, !1, 0, 0), 
              this.mositionBuffer = this.gl.createBuffer(),
               this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
                 this.mositionBuffer),
      this.gl.vertexAttribPointer(this.attrib.p, 3, this.gl.FLOAT, !1, 0, 0), 
               this.gl.enableVertexAttribArray(this.attrib.p)
    this.resize()

  //   var t = N.G.id("gl-data-work").children,
  //   i = t.length;
  // this.m.imgL = {
  //   work: i
  // }, this.imgArr = [];
  // for(var r = 0; r < this.m.imgL.work; r++) this.imgArr[r] = t[r].dataset.img;
  //   this.bloc = new Positions().init(this.m.imgL)
  //   this.loadImgs(this.imgArr, this.img)
    
  }

  createShader = (gl, source, shaderType) => {
    const shader = gl.createShader(shaderType);
    return gl.shaderSource(shader, source), gl.compileShader(shader), shader;
  }

  createProgram = (gl, shaderSource) => {
    var vertexShader = this.createShader(gl, shaderSource[0], gl.VERTEX_SHADER),
        fragmentShader = this.createShader(gl, shaderSource[1], gl.FRAGMENT_SHADER),
         program = gl.createProgram();
    
      return (
        gl.attachShader(program, vertexShader),
        gl.attachShader(program, fragmentShader),
        gl.linkProgram(program),
        program
      )
  }

  loc = (t, i, e, s) => {
    for(var r = s.length, o = {}, a = "a" === t ? "Attrib" : "Uniform", n = 0; n < r; n++) o[s[n]] = i["get" + a + "Location"](e, t + "_" + s[n]);
    return o
  }

  resizeCanvasToDisplaySize = (t, i) => {
    var e = t.canvas,
      s = e.clientWidth * i,
      n = e.clientHeight * i;
    (e.width === s && e.height === n) ||
      ((e.width = s), (e.height = n)),
      t.viewport(0, 0, e.width, e.height);
  }

  img = (img) => {
    this.img = img
    this.tex = createTextures(this.gl, this.img)

    // console.log(object)
    // for (var i = 0; i < this.m.imgL.work; i++) {
    //   this.draw({
    //     magnitude: 0,
    //     bw: 0,
    //     opacity: 1,
    //     opacityColor: 1,
    //     plane: this.bloc.arr[i],
    //     pulse: 0,
    //     scroll: {
    //       y: 0
    //     },
    //     textureNo: 0
    //   })
    // }
    
  }

  loadImgs = (t, a) => {
    function n(t, i) {
      var e = new Image;
      return e.onload = function(t) {
        i()
      }, e.crossOrigin = "anonymous", e.src = t, e
    }! function(t) {
      var i = [],
        e = t.length;

      function s() {
        0 == --e && a(i)
      }
      if(0 === e) a();
      else
        for(var r = 0; r < e; ++r) {
          var o = n(t[r], s);
          i.push(o)
        }
    }(t)
  }

  resize = () => {
    var t = true ? 1 : 2;
    this.resizeCanvasToDisplaySize(this.gl, t), 
    this.gl.enable(this.gl.CULL_FACE)
    this.gl.cullFace(this.gl.FRONT)
    this.gl.useProgram(this.mrogram)
    
    const returnedMatrix = returnMatrix(),
          winGl = returnedMatrix.winGl;
      //define vertices
      this.vertices = new Vertices({
        winGl
      })
    this.gl.uniformMatrix4fv(this.uniform.m, !1, returnedMatrix.matrix), 
    this.gl.uniform1f(this.uniform.dM, winGl), 
    this.gl.uniform1f(this.uniform.z, 1.1)
  }

  draw = (t) => {
    console.log('draw gl', this.gl)
    this.gl.uniform1f(this.uniform.ma, t.magnitude)
    this.gl.uniform1f(this.uniform.bw, t.bw) 
    this.gl.uniform1f(this.uniform.o, t.opacity) 
    this.gl.uniform1f(this.uniform.oC, t.opacityColor)
    //run vertices
    var i = this.vertices.run({
      plane: t.plane,
      scroll: t.scroll,
      pulse: t.pulse,
      img: this.img[t.textureNo]
    });

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex[t.textureNo]) 
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer) 
    this.gl.enableVertexAttribArray(this.attrib.t) 
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(i.texCoord.arr), 
      this.gl.STATIC_DRAW),
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.mositionBuffer)
    this.gl.enableVertexAttribArray(this.attrib.p) 
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(i.pos.arr), 
    this.gl.STATIC_DRAW), this.gl.drawArrays(this.gl[i.pos.type], 0, i.pos.l)
  } 
}

export default Canvas
export { Positions }