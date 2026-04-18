var e = Object.create,
  t = Object.defineProperty,
  n = Object.getOwnPropertyDescriptor,
  r = Object.getOwnPropertyNames,
  i = Object.getPrototypeOf,
  a = Object.prototype.hasOwnProperty,
  o = (e, t) => () => (e && (t = e((e = 0))), t),
  s = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  c = (e, n) => {
    let r = {};
    for (var i in e) t(r, i, { get: e[i], enumerable: !0 });
    return (n || t(r, Symbol.toStringTag, { value: `Module` }), r);
  },
  l = (e, i, o, s) => {
    if ((i && typeof i == `object`) || typeof i == `function`)
      for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
        ((d = c[l]),
          !a.call(e, d) &&
            d !== o &&
            t(e, d, {
              get: ((e) => i[e]).bind(null, d),
              enumerable: !(s = n(i, d)) || s.enumerable,
            }));
    return e;
  },
  u = (n, r, a) => (
    (a = n == null ? {} : e(i(n))),
    l(
      r || !n || !n.__esModule
        ? t(a, `default`, { value: n, enumerable: !0 })
        : a,
      n,
    )
  ),
  d = (e) =>
    a.call(e, `module.exports`)
      ? e[`module.exports`]
      : l(t({}, `__esModule`, { value: !0 }), e);
(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e)
      if (t.type === `childList`)
        for (let e of t.addedNodes)
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return (
      e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      e.crossOrigin === `use-credentials`
        ? (t.credentials = `include`)
        : e.crossOrigin === `anonymous`
          ? (t.credentials = `omit`)
          : (t.credentials = `same-origin`),
      t
    );
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var f = s((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.portal`),
      r = Symbol.for(`react.fragment`),
      i = Symbol.for(`react.strict_mode`),
      a = Symbol.for(`react.profiler`),
      o = Symbol.for(`react.consumer`),
      s = Symbol.for(`react.context`),
      c = Symbol.for(`react.forward_ref`),
      l = Symbol.for(`react.suspense`),
      u = Symbol.for(`react.memo`),
      d = Symbol.for(`react.lazy`),
      f = Symbol.for(`react.activity`),
      p = Symbol.iterator;
    function m(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (p && e[p]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var h = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      g = Object.assign,
      _ = {};
    function v(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    ((v.prototype.isReactComponent = {}),
      (v.prototype.setState = function (e, t) {
        if (typeof e != `object` && typeof e != `function` && e != null)
          throw Error(
            `takes an object of state variables to update or a function which returns an object of state variables.`,
          );
        this.updater.enqueueSetState(this, e, t, `setState`);
      }),
      (v.prototype.forceUpdate = function (e) {
        this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
      }));
    function y() {}
    y.prototype = v.prototype;
    function b(e, t, n) {
      ((this.props = e),
        (this.context = t),
        (this.refs = _),
        (this.updater = n || h));
    }
    var x = (b.prototype = new y());
    ((x.constructor = b), g(x, v.prototype), (x.isPureReactComponent = !0));
    var S = Array.isArray;
    function C() {}
    var w = { H: null, A: null, T: null, S: null },
      T = Object.prototype.hasOwnProperty;
    function E(e, n, r) {
      var i = r.ref;
      return {
        $$typeof: t,
        type: e,
        key: n,
        ref: i === void 0 ? null : i,
        props: r,
      };
    }
    function D(e, t) {
      return E(e.type, t, e.props);
    }
    function O(e) {
      return typeof e == `object` && !!e && e.$$typeof === t;
    }
    function ee(e) {
      var t = { "=": `=0`, ":": `=2` };
      return (
        `$` +
        e.replace(/[=:]/g, function (e) {
          return t[e];
        })
      );
    }
    var k = /\/+/g;
    function A(e, t) {
      return typeof e == `object` && e && e.key != null
        ? ee(`` + e.key)
        : t.toString(36);
    }
    function j(e) {
      switch (e.status) {
        case `fulfilled`:
          return e.value;
        case `rejected`:
          throw e.reason;
        default:
          switch (
            (typeof e.status == `string`
              ? e.then(C, C)
              : ((e.status = `pending`),
                e.then(
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `fulfilled`), (e.value = t));
                  },
                  function (t) {
                    e.status === `pending` &&
                      ((e.status = `rejected`), (e.reason = t));
                  },
                )),
            e.status)
          ) {
            case `fulfilled`:
              return e.value;
            case `rejected`:
              throw e.reason;
          }
      }
      throw e;
    }
    function M(e, r, i, a, o) {
      var s = typeof e;
      (s === `undefined` || s === `boolean`) && (e = null);
      var c = !1;
      if (e === null) c = !0;
      else
        switch (s) {
          case `bigint`:
          case `string`:
          case `number`:
            c = !0;
            break;
          case `object`:
            switch (e.$$typeof) {
              case t:
              case n:
                c = !0;
                break;
              case d:
                return ((c = e._init), M(c(e._payload), r, i, a, o));
            }
        }
      if (c)
        return (
          (o = o(e)),
          (c = a === `` ? `.` + A(e, 0) : a),
          S(o)
            ? ((i = ``),
              c != null && (i = c.replace(k, `$&/`) + `/`),
              M(o, r, i, ``, function (e) {
                return e;
              }))
            : o != null &&
              (O(o) &&
                (o = D(
                  o,
                  i +
                    (o.key == null || (e && e.key === o.key)
                      ? ``
                      : (`` + o.key).replace(k, `$&/`) + `/`) +
                    c,
                )),
              r.push(o)),
          1
        );
      c = 0;
      var l = a === `` ? `.` : a + `:`;
      if (S(e))
        for (var u = 0; u < e.length; u++)
          ((a = e[u]), (s = l + A(a, u)), (c += M(a, r, i, s, o)));
      else if (((u = m(e)), typeof u == `function`))
        for (e = u.call(e), u = 0; !(a = e.next()).done; )
          ((a = a.value), (s = l + A(a, u++)), (c += M(a, r, i, s, o)));
      else if (s === `object`) {
        if (typeof e.then == `function`) return M(j(e), r, i, a, o);
        throw (
          (r = String(e)),
          Error(
            `Objects are not valid as a React child (found: ` +
              (r === `[object Object]`
                ? `object with keys {` + Object.keys(e).join(`, `) + `}`
                : r) +
              `). If you meant to render a collection of children, use an array instead.`,
          )
        );
      }
      return c;
    }
    function N(e, t, n) {
      if (e == null) return e;
      var r = [],
        i = 0;
      return (
        M(e, r, ``, ``, function (e) {
          return t.call(n, e, i++);
        }),
        r
      );
    }
    function te(e) {
      if (e._status === -1) {
        var t = e._result;
        ((t = t()),
          t.then(
            function (t) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 1), (e._result = t));
            },
            function (t) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 2), (e._result = t));
            },
          ),
          e._status === -1 && ((e._status = 0), (e._result = t)));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    var P =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (
                typeof window == `object` &&
                typeof window.ErrorEvent == `function`
              ) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                typeof process == `object` &&
                typeof process.emit == `function`
              ) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      F = {
        map: N,
        forEach: function (e, t, n) {
          N(
            e,
            function () {
              t.apply(this, arguments);
            },
            n,
          );
        },
        count: function (e) {
          var t = 0;
          return (
            N(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            N(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!O(e))
            throw Error(
              `React.Children.only expected to receive a single React element child.`,
            );
          return e;
        },
      };
    ((e.Activity = f),
      (e.Children = F),
      (e.Component = v),
      (e.Fragment = r),
      (e.Profiler = a),
      (e.PureComponent = b),
      (e.StrictMode = i),
      (e.Suspense = l),
      (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = w),
      (e.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (e) {
          return w.H.useMemoCache(e);
        },
      }),
      (e.cache = function (e) {
        return function () {
          return e.apply(null, arguments);
        };
      }),
      (e.cacheSignal = function () {
        return null;
      }),
      (e.cloneElement = function (e, t, n) {
        if (e == null)
          throw Error(
            `The argument must be a React element, but you passed ` + e + `.`,
          );
        var r = g({}, e.props),
          i = e.key;
        if (t != null)
          for (a in (t.key !== void 0 && (i = `` + t.key), t))
            !T.call(t, a) ||
              a === `key` ||
              a === `__self` ||
              a === `__source` ||
              (a === `ref` && t.ref === void 0) ||
              (r[a] = t[a]);
        var a = arguments.length - 2;
        if (a === 1) r.children = n;
        else if (1 < a) {
          for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
          r.children = o;
        }
        return E(e.type, i, r);
      }),
      (e.createContext = function (e) {
        return (
          (e = {
            $$typeof: s,
            _currentValue: e,
            _currentValue2: e,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (e.Provider = e),
          (e.Consumer = { $$typeof: o, _context: e }),
          e
        );
      }),
      (e.createElement = function (e, t, n) {
        var r,
          i = {},
          a = null;
        if (t != null)
          for (r in (t.key !== void 0 && (a = `` + t.key), t))
            T.call(t, r) &&
              r !== `key` &&
              r !== `__self` &&
              r !== `__source` &&
              (i[r] = t[r]);
        var o = arguments.length - 2;
        if (o === 1) i.children = n;
        else if (1 < o) {
          for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
          i.children = s;
        }
        if (e && e.defaultProps)
          for (r in ((o = e.defaultProps), o)) i[r] === void 0 && (i[r] = o[r]);
        return E(e, a, i);
      }),
      (e.createRef = function () {
        return { current: null };
      }),
      (e.forwardRef = function (e) {
        return { $$typeof: c, render: e };
      }),
      (e.isValidElement = O),
      (e.lazy = function (e) {
        return {
          $$typeof: d,
          _payload: { _status: -1, _result: e },
          _init: te,
        };
      }),
      (e.memo = function (e, t) {
        return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
      }),
      (e.startTransition = function (e) {
        var t = w.T,
          n = {};
        w.T = n;
        try {
          var r = e(),
            i = w.S;
          (i !== null && i(n, r),
            typeof r == `object` &&
              r &&
              typeof r.then == `function` &&
              r.then(C, P));
        } catch (e) {
          P(e);
        } finally {
          (t !== null && n.types !== null && (t.types = n.types), (w.T = t));
        }
      }),
      (e.unstable_useCacheRefresh = function () {
        return w.H.useCacheRefresh();
      }),
      (e.use = function (e) {
        return w.H.use(e);
      }),
      (e.useActionState = function (e, t, n) {
        return w.H.useActionState(e, t, n);
      }),
      (e.useCallback = function (e, t) {
        return w.H.useCallback(e, t);
      }),
      (e.useContext = function (e) {
        return w.H.useContext(e);
      }),
      (e.useDebugValue = function () {}),
      (e.useDeferredValue = function (e, t) {
        return w.H.useDeferredValue(e, t);
      }),
      (e.useEffect = function (e, t) {
        return w.H.useEffect(e, t);
      }),
      (e.useEffectEvent = function (e) {
        return w.H.useEffectEvent(e);
      }),
      (e.useId = function () {
        return w.H.useId();
      }),
      (e.useImperativeHandle = function (e, t, n) {
        return w.H.useImperativeHandle(e, t, n);
      }),
      (e.useInsertionEffect = function (e, t) {
        return w.H.useInsertionEffect(e, t);
      }),
      (e.useLayoutEffect = function (e, t) {
        return w.H.useLayoutEffect(e, t);
      }),
      (e.useMemo = function (e, t) {
        return w.H.useMemo(e, t);
      }),
      (e.useOptimistic = function (e, t) {
        return w.H.useOptimistic(e, t);
      }),
      (e.useReducer = function (e, t, n) {
        return w.H.useReducer(e, t, n);
      }),
      (e.useRef = function (e) {
        return w.H.useRef(e);
      }),
      (e.useState = function (e) {
        return w.H.useState(e);
      }),
      (e.useSyncExternalStore = function (e, t, n) {
        return w.H.useSyncExternalStore(e, t, n);
      }),
      (e.useTransition = function () {
        return w.H.useTransition();
      }),
      (e.version = `19.2.5`));
  }),
  p = s((e, t) => {
    t.exports = f();
  }),
  m = s((e) => {
    function t(e, t) {
      var n = e.length;
      e.push(t);
      a: for (; 0 < n; ) {
        var r = (n - 1) >>> 1,
          a = e[r];
        if (0 < i(a, t)) ((e[r] = t), (e[n] = a), (n = r));
        else break a;
      }
    }
    function n(e) {
      return e.length === 0 ? null : e[0];
    }
    function r(e) {
      if (e.length === 0) return null;
      var t = e[0],
        n = e.pop();
      if (n !== t) {
        e[0] = n;
        a: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
          var s = 2 * (r + 1) - 1,
            c = e[s],
            l = s + 1,
            u = e[l];
          if (0 > i(c, n))
            l < a && 0 > i(u, c)
              ? ((e[r] = u), (e[l] = n), (r = l))
              : ((e[r] = c), (e[s] = n), (r = s));
          else if (l < a && 0 > i(u, n)) ((e[r] = u), (e[l] = n), (r = l));
          else break a;
        }
      }
      return t;
    }
    function i(e, t) {
      var n = e.sortIndex - t.sortIndex;
      return n === 0 ? e.id - t.id : n;
    }
    if (
      ((e.unstable_now = void 0),
      typeof performance == `object` && typeof performance.now == `function`)
    ) {
      var a = performance;
      e.unstable_now = function () {
        return a.now();
      };
    } else {
      var o = Date,
        s = o.now();
      e.unstable_now = function () {
        return o.now() - s;
      };
    }
    var c = [],
      l = [],
      u = 1,
      d = null,
      f = 3,
      p = !1,
      m = !1,
      h = !1,
      g = !1,
      _ = typeof setTimeout == `function` ? setTimeout : null,
      v = typeof clearTimeout == `function` ? clearTimeout : null,
      y = typeof setImmediate < `u` ? setImmediate : null;
    function b(e) {
      for (var i = n(l); i !== null; ) {
        if (i.callback === null) r(l);
        else if (i.startTime <= e)
          (r(l), (i.sortIndex = i.expirationTime), t(c, i));
        else break;
        i = n(l);
      }
    }
    function x(e) {
      if (((h = !1), b(e), !m))
        if (n(c) !== null) ((m = !0), S || ((S = !0), O()));
        else {
          var t = n(l);
          t !== null && A(x, t.startTime - e);
        }
    }
    var S = !1,
      C = -1,
      w = 5,
      T = -1;
    function E() {
      return g ? !0 : !(e.unstable_now() - T < w);
    }
    function D() {
      if (((g = !1), S)) {
        var t = e.unstable_now();
        T = t;
        var i = !0;
        try {
          a: {
            ((m = !1), h && ((h = !1), v(C), (C = -1)), (p = !0));
            var a = f;
            try {
              b: {
                for (
                  b(t), d = n(c);
                  d !== null && !(d.expirationTime > t && E());
                ) {
                  var o = d.callback;
                  if (typeof o == `function`) {
                    ((d.callback = null), (f = d.priorityLevel));
                    var s = o(d.expirationTime <= t);
                    if (((t = e.unstable_now()), typeof s == `function`)) {
                      ((d.callback = s), b(t), (i = !0));
                      break b;
                    }
                    (d === n(c) && r(c), b(t));
                  } else r(c);
                  d = n(c);
                }
                if (d !== null) i = !0;
                else {
                  var u = n(l);
                  (u !== null && A(x, u.startTime - t), (i = !1));
                }
              }
              break a;
            } finally {
              ((d = null), (f = a), (p = !1));
            }
            i = void 0;
          }
        } finally {
          i ? O() : (S = !1);
        }
      }
    }
    var O;
    if (typeof y == `function`)
      O = function () {
        y(D);
      };
    else if (typeof MessageChannel < `u`) {
      var ee = new MessageChannel(),
        k = ee.port2;
      ((ee.port1.onmessage = D),
        (O = function () {
          k.postMessage(null);
        }));
    } else
      O = function () {
        _(D, 0);
      };
    function A(t, n) {
      C = _(function () {
        t(e.unstable_now());
      }, n);
    }
    ((e.unstable_IdlePriority = 5),
      (e.unstable_ImmediatePriority = 1),
      (e.unstable_LowPriority = 4),
      (e.unstable_NormalPriority = 3),
      (e.unstable_Profiling = null),
      (e.unstable_UserBlockingPriority = 2),
      (e.unstable_cancelCallback = function (e) {
        e.callback = null;
      }),
      (e.unstable_forceFrameRate = function (e) {
        0 > e || 125 < e
          ? console.error(
              `forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
            )
          : (w = 0 < e ? Math.floor(1e3 / e) : 5);
      }),
      (e.unstable_getCurrentPriorityLevel = function () {
        return f;
      }),
      (e.unstable_next = function (e) {
        switch (f) {
          case 1:
          case 2:
          case 3:
            var t = 3;
            break;
          default:
            t = f;
        }
        var n = f;
        f = t;
        try {
          return e();
        } finally {
          f = n;
        }
      }),
      (e.unstable_requestPaint = function () {
        g = !0;
      }),
      (e.unstable_runWithPriority = function (e, t) {
        switch (e) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            e = 3;
        }
        var n = f;
        f = e;
        try {
          return t();
        } finally {
          f = n;
        }
      }),
      (e.unstable_scheduleCallback = function (r, i, a) {
        var o = e.unstable_now();
        switch (
          (typeof a == `object` && a
            ? ((a = a.delay), (a = typeof a == `number` && 0 < a ? o + a : o))
            : (a = o),
          r)
        ) {
          case 1:
            var s = -1;
            break;
          case 2:
            s = 250;
            break;
          case 5:
            s = 1073741823;
            break;
          case 4:
            s = 1e4;
            break;
          default:
            s = 5e3;
        }
        return (
          (s = a + s),
          (r = {
            id: u++,
            callback: i,
            priorityLevel: r,
            startTime: a,
            expirationTime: s,
            sortIndex: -1,
          }),
          a > o
            ? ((r.sortIndex = a),
              t(l, r),
              n(c) === null &&
                r === n(l) &&
                (h ? (v(C), (C = -1)) : (h = !0), A(x, a - o)))
            : ((r.sortIndex = s),
              t(c, r),
              m || p || ((m = !0), S || ((S = !0), O()))),
          r
        );
      }),
      (e.unstable_shouldYield = E),
      (e.unstable_wrapCallback = function (e) {
        var t = f;
        return function () {
          var n = f;
          f = t;
          try {
            return e.apply(this, arguments);
          } finally {
            f = n;
          }
        };
      }));
  }),
  h = s((e, t) => {
    t.exports = m();
  }),
  g = s((e) => {
    var t = p();
    function n(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function r() {}
    var i = {
        d: {
          f: r,
          r: function () {
            throw Error(n(522));
          },
          D: r,
          C: r,
          L: r,
          m: r,
          X: r,
          S: r,
          M: r,
        },
        p: 0,
        findDOMNode: null,
      },
      a = Symbol.for(`react.portal`);
    function o(e, t, n) {
      var r =
        3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
      return {
        $$typeof: a,
        key: r == null ? null : `` + r,
        children: e,
        containerInfo: t,
        implementation: n,
      };
    }
    var s = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function c(e, t) {
      if (e === `font`) return ``;
      if (typeof t == `string`) return t === `use-credentials` ? t : ``;
    }
    ((e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
      (e.createPortal = function (e, t) {
        var r =
          2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
          throw Error(n(299));
        return o(e, t, null, r);
      }),
      (e.flushSync = function (e) {
        var t = s.T,
          n = i.p;
        try {
          if (((s.T = null), (i.p = 2), e)) return e();
        } finally {
          ((s.T = t), (i.p = n), i.d.f());
        }
      }),
      (e.preconnect = function (e, t) {
        typeof e == `string` &&
          (t
            ? ((t = t.crossOrigin),
              (t =
                typeof t == `string`
                  ? t === `use-credentials`
                    ? t
                    : ``
                  : void 0))
            : (t = null),
          i.d.C(e, t));
      }),
      (e.prefetchDNS = function (e) {
        typeof e == `string` && i.d.D(e);
      }),
      (e.preinit = function (e, t) {
        if (typeof e == `string` && t && typeof t.as == `string`) {
          var n = t.as,
            r = c(n, t.crossOrigin),
            a = typeof t.integrity == `string` ? t.integrity : void 0,
            o = typeof t.fetchPriority == `string` ? t.fetchPriority : void 0;
          n === `style`
            ? i.d.S(
                e,
                typeof t.precedence == `string` ? t.precedence : void 0,
                { crossOrigin: r, integrity: a, fetchPriority: o },
              )
            : n === `script` &&
              i.d.X(e, {
                crossOrigin: r,
                integrity: a,
                fetchPriority: o,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
        }
      }),
      (e.preinitModule = function (e, t) {
        if (typeof e == `string`)
          if (typeof t == `object` && t) {
            if (t.as == null || t.as === `script`) {
              var n = c(t.as, t.crossOrigin);
              i.d.M(e, {
                crossOrigin: n,
                integrity:
                  typeof t.integrity == `string` ? t.integrity : void 0,
                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
              });
            }
          } else t ?? i.d.M(e);
      }),
      (e.preload = function (e, t) {
        if (
          typeof e == `string` &&
          typeof t == `object` &&
          t &&
          typeof t.as == `string`
        ) {
          var n = t.as,
            r = c(n, t.crossOrigin);
          i.d.L(e, n, {
            crossOrigin: r,
            integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            nonce: typeof t.nonce == `string` ? t.nonce : void 0,
            type: typeof t.type == `string` ? t.type : void 0,
            fetchPriority:
              typeof t.fetchPriority == `string` ? t.fetchPriority : void 0,
            referrerPolicy:
              typeof t.referrerPolicy == `string` ? t.referrerPolicy : void 0,
            imageSrcSet:
              typeof t.imageSrcSet == `string` ? t.imageSrcSet : void 0,
            imageSizes: typeof t.imageSizes == `string` ? t.imageSizes : void 0,
            media: typeof t.media == `string` ? t.media : void 0,
          });
        }
      }),
      (e.preloadModule = function (e, t) {
        if (typeof e == `string`)
          if (t) {
            var n = c(t.as, t.crossOrigin);
            i.d.m(e, {
              as: typeof t.as == `string` && t.as !== `script` ? t.as : void 0,
              crossOrigin: n,
              integrity: typeof t.integrity == `string` ? t.integrity : void 0,
            });
          } else i.d.m(e);
      }),
      (e.requestFormReset = function (e) {
        i.d.r(e);
      }),
      (e.unstable_batchedUpdates = function (e, t) {
        return e(t);
      }),
      (e.useFormState = function (e, t, n) {
        return s.H.useFormState(e, t, n);
      }),
      (e.useFormStatus = function () {
        return s.H.useHostTransitionStatus();
      }),
      (e.version = `19.2.5`));
  }),
  _ = s((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = g()));
  }),
  v = s((e) => {
    var t = h(),
      n = p(),
      r = _();
    function i(e) {
      var t = `https://react.dev/errors/` + e;
      if (1 < arguments.length) {
        t += `?args[]=` + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += `&args[]=` + encodeURIComponent(arguments[n]);
      }
      return (
        `Minified React error #` +
        e +
        `; visit ` +
        t +
        ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
      );
    }
    function a(e) {
      return !(
        !e ||
        (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
      );
    }
    function o(e) {
      var t = e,
        n = e;
      if (e.alternate) for (; t.return; ) t = t.return;
      else {
        e = t;
        do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
        while (e);
      }
      return t.tag === 3 ? n : null;
    }
    function s(e) {
      if (e.tag === 13) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function c(e) {
      if (e.tag === 31) {
        var t = e.memoizedState;
        if (
          (t === null &&
            ((e = e.alternate), e !== null && (t = e.memoizedState)),
          t !== null)
        )
          return t.dehydrated;
      }
      return null;
    }
    function l(e) {
      if (o(e) !== e) throw Error(i(188));
    }
    function u(e) {
      var t = e.alternate;
      if (!t) {
        if (((t = o(e)), t === null)) throw Error(i(188));
        return t === e ? e : null;
      }
      for (var n = e, r = t; ; ) {
        var a = n.return;
        if (a === null) break;
        var s = a.alternate;
        if (s === null) {
          if (((r = a.return), r !== null)) {
            n = r;
            continue;
          }
          break;
        }
        if (a.child === s.child) {
          for (s = a.child; s; ) {
            if (s === n) return (l(a), e);
            if (s === r) return (l(a), t);
            s = s.sibling;
          }
          throw Error(i(188));
        }
        if (n.return !== r.return) ((n = a), (r = s));
        else {
          for (var c = !1, u = a.child; u; ) {
            if (u === n) {
              ((c = !0), (n = a), (r = s));
              break;
            }
            if (u === r) {
              ((c = !0), (r = a), (n = s));
              break;
            }
            u = u.sibling;
          }
          if (!c) {
            for (u = s.child; u; ) {
              if (u === n) {
                ((c = !0), (n = s), (r = a));
                break;
              }
              if (u === r) {
                ((c = !0), (r = s), (n = a));
                break;
              }
              u = u.sibling;
            }
            if (!c) throw Error(i(189));
          }
        }
        if (n.alternate !== r) throw Error(i(190));
      }
      if (n.tag !== 3) throw Error(i(188));
      return n.stateNode.current === n ? e : t;
    }
    function d(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e;
      for (e = e.child; e !== null; ) {
        if (((t = d(e)), t !== null)) return t;
        e = e.sibling;
      }
      return null;
    }
    var f = Object.assign,
      m = Symbol.for(`react.element`),
      g = Symbol.for(`react.transitional.element`),
      v = Symbol.for(`react.portal`),
      y = Symbol.for(`react.fragment`),
      b = Symbol.for(`react.strict_mode`),
      x = Symbol.for(`react.profiler`),
      S = Symbol.for(`react.consumer`),
      C = Symbol.for(`react.context`),
      w = Symbol.for(`react.forward_ref`),
      T = Symbol.for(`react.suspense`),
      E = Symbol.for(`react.suspense_list`),
      D = Symbol.for(`react.memo`),
      O = Symbol.for(`react.lazy`),
      ee = Symbol.for(`react.activity`),
      k = Symbol.for(`react.memo_cache_sentinel`),
      A = Symbol.iterator;
    function j(e) {
      return typeof e != `object` || !e
        ? null
        : ((e = (A && e[A]) || e[`@@iterator`]),
          typeof e == `function` ? e : null);
    }
    var M = Symbol.for(`react.client.reference`);
    function N(e) {
      if (e == null) return null;
      if (typeof e == `function`)
        return e.$$typeof === M ? null : e.displayName || e.name || null;
      if (typeof e == `string`) return e;
      switch (e) {
        case y:
          return `Fragment`;
        case x:
          return `Profiler`;
        case b:
          return `StrictMode`;
        case T:
          return `Suspense`;
        case E:
          return `SuspenseList`;
        case ee:
          return `Activity`;
      }
      if (typeof e == `object`)
        switch (e.$$typeof) {
          case v:
            return `Portal`;
          case C:
            return e.displayName || `Context`;
          case S:
            return (e._context.displayName || `Context`) + `.Consumer`;
          case w:
            var t = e.render;
            return (
              (e = e.displayName),
              (e ||=
                ((e = t.displayName || t.name || ``),
                e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)),
              e
            );
          case D:
            return (
              (t = e.displayName || null),
              t === null ? N(e.type) || `Memo` : t
            );
          case O:
            ((t = e._payload), (e = e._init));
            try {
              return N(e(t));
            } catch {}
        }
      return null;
    }
    var te = Array.isArray,
      P = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      F = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      ne = { pending: !1, data: null, method: null, action: null },
      I = [],
      re = -1;
    function ie(e) {
      return { current: e };
    }
    function ae(e) {
      0 > re || ((e.current = I[re]), (I[re] = null), re--);
    }
    function L(e, t) {
      (re++, (I[re] = e.current), (e.current = t));
    }
    var oe = ie(null),
      se = ie(null),
      ce = ie(null),
      le = ie(null);
    function ue(e, t) {
      switch ((L(ce, t), L(se, e), L(oe, null), t.nodeType)) {
        case 9:
        case 11:
          e = (e = t.documentElement) && (e = e.namespaceURI) ? Wd(e) : 0;
          break;
        default:
          if (((e = t.tagName), (t = t.namespaceURI)))
            ((t = Wd(t)), (e = Gd(t, e)));
          else
            switch (e) {
              case `svg`:
                e = 1;
                break;
              case `math`:
                e = 2;
                break;
              default:
                e = 0;
            }
      }
      (ae(oe), L(oe, e));
    }
    function de() {
      (ae(oe), ae(se), ae(ce));
    }
    function fe(e) {
      e.memoizedState !== null && L(le, e);
      var t = oe.current,
        n = Gd(t, e.type);
      t !== n && (L(se, e), L(oe, n));
    }
    function pe(e) {
      (se.current === e && (ae(oe), ae(se)),
        le.current === e && (ae(le), (tp._currentValue = ne)));
    }
    var me, he;
    function ge(e) {
      if (me === void 0)
        try {
          throw Error();
        } catch (e) {
          var t = e.stack.trim().match(/\n( *(at )?)/);
          ((me = (t && t[1]) || ``),
            (he =
              -1 <
              e.stack.indexOf(`
    at`)
                ? ` (<anonymous>)`
                : -1 < e.stack.indexOf(`@`)
                  ? `@unknown:0:0`
                  : ``));
        }
      return (
        `
` +
        me +
        e +
        he
      );
    }
    var _e = !1;
    function ve(e, t) {
      if (!e || _e) return ``;
      _e = !0;
      var n = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      try {
        var r = {
          DetermineComponentFrameRoot: function () {
            try {
              if (t) {
                var n = function () {
                  throw Error();
                };
                if (
                  (Object.defineProperty(n.prototype, `props`, {
                    set: function () {
                      throw Error();
                    },
                  }),
                  typeof Reflect == `object` && Reflect.construct)
                ) {
                  try {
                    Reflect.construct(n, []);
                  } catch (e) {
                    var r = e;
                  }
                  Reflect.construct(e, [], n);
                } else {
                  try {
                    n.call();
                  } catch (e) {
                    r = e;
                  }
                  e.call(n.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (e) {
                  r = e;
                }
                (n = e()) &&
                  typeof n.catch == `function` &&
                  n.catch(function () {});
              }
            } catch (e) {
              if (e && r && typeof e.stack == `string`)
                return [e.stack, r.stack];
            }
            return [null, null];
          },
        };
        r.DetermineComponentFrameRoot.displayName = `DetermineComponentFrameRoot`;
        var i = Object.getOwnPropertyDescriptor(
          r.DetermineComponentFrameRoot,
          `name`,
        );
        i &&
          i.configurable &&
          Object.defineProperty(r.DetermineComponentFrameRoot, `name`, {
            value: `DetermineComponentFrameRoot`,
          });
        var a = r.DetermineComponentFrameRoot(),
          o = a[0],
          s = a[1];
        if (o && s) {
          var c = o.split(`
`),
            l = s.split(`
`);
          for (
            i = r = 0;
            r < c.length && !c[r].includes(`DetermineComponentFrameRoot`);
          )
            r++;
          for (
            ;
            i < l.length && !l[i].includes(`DetermineComponentFrameRoot`);
          )
            i++;
          if (r === c.length || i === l.length)
            for (
              r = c.length - 1, i = l.length - 1;
              1 <= r && 0 <= i && c[r] !== l[i];
            )
              i--;
          for (; 1 <= r && 0 <= i; r--, i--)
            if (c[r] !== l[i]) {
              if (r !== 1 || i !== 1)
                do
                  if ((r--, i--, 0 > i || c[r] !== l[i])) {
                    var u =
                      `
` + c[r].replace(` at new `, ` at `);
                    return (
                      e.displayName &&
                        u.includes(`<anonymous>`) &&
                        (u = u.replace(`<anonymous>`, e.displayName)),
                      u
                    );
                  }
                while (1 <= r && 0 <= i);
              break;
            }
        }
      } finally {
        ((_e = !1), (Error.prepareStackTrace = n));
      }
      return (n = e ? e.displayName || e.name : ``) ? ge(n) : ``;
    }
    function ye(e, t) {
      switch (e.tag) {
        case 26:
        case 27:
        case 5:
          return ge(e.type);
        case 16:
          return ge(`Lazy`);
        case 13:
          return e.child !== t && t !== null
            ? ge(`Suspense Fallback`)
            : ge(`Suspense`);
        case 19:
          return ge(`SuspenseList`);
        case 0:
        case 15:
          return ve(e.type, !1);
        case 11:
          return ve(e.type.render, !1);
        case 1:
          return ve(e.type, !0);
        case 31:
          return ge(`Activity`);
        default:
          return ``;
      }
    }
    function be(e) {
      try {
        var t = ``,
          n = null;
        do ((t += ye(e, n)), (n = e), (e = e.return));
        while (e);
        return t;
      } catch (e) {
        return (
          `
Error generating stack: ` +
          e.message +
          `
` +
          e.stack
        );
      }
    }
    var xe = Object.prototype.hasOwnProperty,
      Se = t.unstable_scheduleCallback,
      Ce = t.unstable_cancelCallback,
      we = t.unstable_shouldYield,
      Te = t.unstable_requestPaint,
      Ee = t.unstable_now,
      De = t.unstable_getCurrentPriorityLevel,
      Oe = t.unstable_ImmediatePriority,
      ke = t.unstable_UserBlockingPriority,
      Ae = t.unstable_NormalPriority,
      je = t.unstable_LowPriority,
      Me = t.unstable_IdlePriority,
      Ne = t.log,
      Pe = t.unstable_setDisableYieldValue,
      Fe = null,
      Ie = null;
    function Le(e) {
      if (
        (typeof Ne == `function` && Pe(e),
        Ie && typeof Ie.setStrictMode == `function`)
      )
        try {
          Ie.setStrictMode(Fe, e);
        } catch {}
    }
    var Re = Math.clz32 ? Math.clz32 : Ve,
      ze = Math.log,
      Be = Math.LN2;
    function Ve(e) {
      return ((e >>>= 0), e === 0 ? 32 : (31 - ((ze(e) / Be) | 0)) | 0);
    }
    var He = 256,
      Ue = 262144,
      We = 4194304;
    function Ge(e) {
      var t = e & 42;
      if (t !== 0) return t;
      switch (e & -e) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return e & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return e;
      }
    }
    function Ke(e, t, n) {
      var r = e.pendingLanes;
      if (r === 0) return 0;
      var i = 0,
        a = e.suspendedLanes,
        o = e.pingedLanes;
      e = e.warmLanes;
      var s = r & 134217727;
      return (
        s === 0
          ? ((s = r & ~a),
            s === 0
              ? o === 0
                ? n || ((n = r & ~e), n !== 0 && (i = Ge(n)))
                : (i = Ge(o))
              : (i = Ge(s)))
          : ((r = s & ~a),
            r === 0
              ? ((o &= s),
                o === 0
                  ? n || ((n = s & ~e), n !== 0 && (i = Ge(n)))
                  : (i = Ge(o)))
              : (i = Ge(r))),
        i === 0
          ? 0
          : t !== 0 &&
              t !== i &&
              (t & a) === 0 &&
              ((a = i & -i), (n = t & -t), a >= n || (a === 32 && n & 4194048))
            ? t
            : i
      );
    }
    function qe(e, t) {
      return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
    }
    function Je(e, t) {
      switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return -1;
      }
    }
    function Ye() {
      var e = We;
      return ((We <<= 1), !(We & 62914560) && (We = 4194304), e);
    }
    function Xe(e) {
      for (var t = [], n = 0; 31 > n; n++) t.push(e);
      return t;
    }
    function Ze(e, t) {
      ((e.pendingLanes |= t),
        t !== 268435456 &&
          ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
    }
    function Qe(e, t, n, r, i, a) {
      var o = e.pendingLanes;
      ((e.pendingLanes = n),
        (e.suspendedLanes = 0),
        (e.pingedLanes = 0),
        (e.warmLanes = 0),
        (e.expiredLanes &= n),
        (e.entangledLanes &= n),
        (e.errorRecoveryDisabledLanes &= n),
        (e.shellSuspendCounter = 0));
      var s = e.entanglements,
        c = e.expirationTimes,
        l = e.hiddenUpdates;
      for (n = o & ~n; 0 < n; ) {
        var u = 31 - Re(n),
          d = 1 << u;
        ((s[u] = 0), (c[u] = -1));
        var f = l[u];
        if (f !== null)
          for (l[u] = null, u = 0; u < f.length; u++) {
            var p = f[u];
            p !== null && (p.lane &= -536870913);
          }
        n &= ~d;
      }
      (r !== 0 && $e(e, r, 0),
        a !== 0 &&
          i === 0 &&
          e.tag !== 0 &&
          (e.suspendedLanes |= a & ~(o & ~t)));
    }
    function $e(e, t, n) {
      ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
      var r = 31 - Re(t);
      ((e.entangledLanes |= t),
        (e.entanglements[r] = e.entanglements[r] | 1073741824 | (n & 261930)));
    }
    function et(e, t) {
      var n = (e.entangledLanes |= t);
      for (e = e.entanglements; n; ) {
        var r = 31 - Re(n),
          i = 1 << r;
        ((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i));
      }
    }
    function tt(e, t) {
      var n = t & -t;
      return (
        (n = n & 42 ? 1 : nt(n)),
        (n & (e.suspendedLanes | t)) === 0 ? n : 0
      );
    }
    function nt(e) {
      switch (e) {
        case 2:
          e = 1;
          break;
        case 8:
          e = 4;
          break;
        case 32:
          e = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          e = 128;
          break;
        case 268435456:
          e = 134217728;
          break;
        default:
          e = 0;
      }
      return e;
    }
    function rt(e) {
      return (
        (e &= -e),
        2 < e ? (8 < e ? (e & 134217727 ? 32 : 268435456) : 8) : 2
      );
    }
    function it() {
      var e = F.p;
      return e === 0 ? ((e = window.event), e === void 0 ? 32 : _p(e.type)) : e;
    }
    function at(e, t) {
      var n = F.p;
      try {
        return ((F.p = e), t());
      } finally {
        F.p = n;
      }
    }
    var ot = Math.random().toString(36).slice(2),
      st = `__reactFiber$` + ot,
      ct = `__reactProps$` + ot,
      lt = `__reactContainer$` + ot,
      ut = `__reactEvents$` + ot,
      dt = `__reactListeners$` + ot,
      ft = `__reactHandles$` + ot,
      pt = `__reactResources$` + ot,
      mt = `__reactMarker$` + ot;
    function ht(e) {
      (delete e[st], delete e[ct], delete e[ut], delete e[dt], delete e[ft]);
    }
    function gt(e) {
      var t = e[st];
      if (t) return t;
      for (var n = e.parentNode; n; ) {
        if ((t = n[lt] || n[st])) {
          if (
            ((n = t.alternate),
            t.child !== null || (n !== null && n.child !== null))
          )
            for (e = mf(e); e !== null; ) {
              if ((n = e[st])) return n;
              e = mf(e);
            }
          return t;
        }
        ((e = n), (n = e.parentNode));
      }
      return null;
    }
    function _t(e) {
      if ((e = e[st] || e[lt])) {
        var t = e.tag;
        if (
          t === 5 ||
          t === 6 ||
          t === 13 ||
          t === 31 ||
          t === 26 ||
          t === 27 ||
          t === 3
        )
          return e;
      }
      return null;
    }
    function vt(e) {
      var t = e.tag;
      if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
      throw Error(i(33));
    }
    function yt(e) {
      var t = e[pt];
      return (
        (t ||= e[pt] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
        t
      );
    }
    function bt(e) {
      e[mt] = !0;
    }
    var xt = new Set(),
      St = {};
    function Ct(e, t) {
      (wt(e, t), wt(e + `Capture`, t));
    }
    function wt(e, t) {
      for (St[e] = t, e = 0; e < t.length; e++) xt.add(t[e]);
    }
    var Tt = RegExp(
        `^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
      ),
      Et = {},
      Dt = {};
    function Ot(e) {
      return xe.call(Dt, e)
        ? !0
        : xe.call(Et, e)
          ? !1
          : Tt.test(e)
            ? (Dt[e] = !0)
            : ((Et[e] = !0), !1);
    }
    function kt(e, t, n) {
      if (Ot(t))
        if (n === null) e.removeAttribute(t);
        else {
          switch (typeof n) {
            case `undefined`:
            case `function`:
            case `symbol`:
              e.removeAttribute(t);
              return;
            case `boolean`:
              var r = t.toLowerCase().slice(0, 5);
              if (r !== `data-` && r !== `aria-`) {
                e.removeAttribute(t);
                return;
              }
          }
          e.setAttribute(t, `` + n);
        }
    }
    function At(e, t, n) {
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(t);
            return;
        }
        e.setAttribute(t, `` + n);
      }
    }
    function jt(e, t, n, r) {
      if (r === null) e.removeAttribute(n);
      else {
        switch (typeof r) {
          case `undefined`:
          case `function`:
          case `symbol`:
          case `boolean`:
            e.removeAttribute(n);
            return;
        }
        e.setAttributeNS(t, n, `` + r);
      }
    }
    function Mt(e) {
      switch (typeof e) {
        case `bigint`:
        case `boolean`:
        case `number`:
        case `string`:
        case `undefined`:
          return e;
        case `object`:
          return e;
        default:
          return ``;
      }
    }
    function Nt(e) {
      var t = e.type;
      return (
        (e = e.nodeName) &&
        e.toLowerCase() === `input` &&
        (t === `checkbox` || t === `radio`)
      );
    }
    function Pt(e, t, n) {
      var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      if (
        !e.hasOwnProperty(t) &&
        r !== void 0 &&
        typeof r.get == `function` &&
        typeof r.set == `function`
      ) {
        var i = r.get,
          a = r.set;
        return (
          Object.defineProperty(e, t, {
            configurable: !0,
            get: function () {
              return i.call(this);
            },
            set: function (e) {
              ((n = `` + e), a.call(this, e));
            },
          }),
          Object.defineProperty(e, t, { enumerable: r.enumerable }),
          {
            getValue: function () {
              return n;
            },
            setValue: function (e) {
              n = `` + e;
            },
            stopTracking: function () {
              ((e._valueTracker = null), delete e[t]);
            },
          }
        );
      }
    }
    function Ft(e) {
      if (!e._valueTracker) {
        var t = Nt(e) ? `checked` : `value`;
        e._valueTracker = Pt(e, t, `` + e[t]);
      }
    }
    function It(e) {
      if (!e) return !1;
      var t = e._valueTracker;
      if (!t) return !0;
      var n = t.getValue(),
        r = ``;
      return (
        e && (r = Nt(e) ? (e.checked ? `true` : `false`) : e.value),
        (e = r),
        e === n ? !1 : (t.setValue(e), !0)
      );
    }
    function Lt(e) {
      if (((e ||= typeof document < `u` ? document : void 0), e === void 0))
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Rt = /[\n"\\]/g;
    function zt(e) {
      return e.replace(Rt, function (e) {
        return `\\` + e.charCodeAt(0).toString(16) + ` `;
      });
    }
    function Bt(e, t, n, r, i, a, o, s) {
      ((e.name = ``),
        o != null &&
        typeof o != `function` &&
        typeof o != `symbol` &&
        typeof o != `boolean`
          ? (e.type = o)
          : e.removeAttribute(`type`),
        t == null
          ? (o !== `submit` && o !== `reset`) || e.removeAttribute(`value`)
          : o === `number`
            ? ((t === 0 && e.value === ``) || e.value != t) &&
              (e.value = `` + Mt(t))
            : e.value !== `` + Mt(t) && (e.value = `` + Mt(t)),
        t == null
          ? n == null
            ? r != null && e.removeAttribute(`value`)
            : Ht(e, o, Mt(n))
          : Ht(e, o, Mt(t)),
        i == null && a != null && (e.defaultChecked = !!a),
        i != null &&
          (e.checked = i && typeof i != `function` && typeof i != `symbol`),
        s != null &&
        typeof s != `function` &&
        typeof s != `symbol` &&
        typeof s != `boolean`
          ? (e.name = `` + Mt(s))
          : e.removeAttribute(`name`));
    }
    function Vt(e, t, n, r, i, a, o, s) {
      if (
        (a != null &&
          typeof a != `function` &&
          typeof a != `symbol` &&
          typeof a != `boolean` &&
          (e.type = a),
        t != null || n != null)
      ) {
        if (!((a !== `submit` && a !== `reset`) || t != null)) {
          Ft(e);
          return;
        }
        ((n = n == null ? `` : `` + Mt(n)),
          (t = t == null ? n : `` + Mt(t)),
          s || t === e.value || (e.value = t),
          (e.defaultValue = t));
      }
      ((r ??= i),
        (r = typeof r != `function` && typeof r != `symbol` && !!r),
        (e.checked = s ? e.checked : !!r),
        (e.defaultChecked = !!r),
        o != null &&
          typeof o != `function` &&
          typeof o != `symbol` &&
          typeof o != `boolean` &&
          (e.name = o),
        Ft(e));
    }
    function Ht(e, t, n) {
      (t === `number` && Lt(e.ownerDocument) === e) ||
        e.defaultValue === `` + n ||
        (e.defaultValue = `` + n);
    }
    function Ut(e, t, n, r) {
      if (((e = e.options), t)) {
        t = {};
        for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
        for (n = 0; n < e.length; n++)
          ((i = t.hasOwnProperty(`$` + e[n].value)),
            e[n].selected !== i && (e[n].selected = i),
            i && r && (e[n].defaultSelected = !0));
      } else {
        for (n = `` + Mt(n), t = null, i = 0; i < e.length; i++) {
          if (e[i].value === n) {
            ((e[i].selected = !0), r && (e[i].defaultSelected = !0));
            return;
          }
          t !== null || e[i].disabled || (t = e[i]);
        }
        t !== null && (t.selected = !0);
      }
    }
    function Wt(e, t, n) {
      if (
        t != null &&
        ((t = `` + Mt(t)), t !== e.value && (e.value = t), n == null)
      ) {
        e.defaultValue !== t && (e.defaultValue = t);
        return;
      }
      e.defaultValue = n == null ? `` : `` + Mt(n);
    }
    function Gt(e, t, n, r) {
      if (t == null) {
        if (r != null) {
          if (n != null) throw Error(i(92));
          if (te(r)) {
            if (1 < r.length) throw Error(i(93));
            r = r[0];
          }
          n = r;
        }
        ((n ??= ``), (t = n));
      }
      ((n = Mt(t)),
        (e.defaultValue = n),
        (r = e.textContent),
        r === n && r !== `` && r !== null && (e.value = r),
        Ft(e));
    }
    function Kt(e, t) {
      if (t) {
        var n = e.firstChild;
        if (n && n === e.lastChild && n.nodeType === 3) {
          n.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }
    var qt = new Set(
      `animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(
        ` `,
      ),
    );
    function Jt(e, t, n) {
      var r = t.indexOf(`--`) === 0;
      n == null || typeof n == `boolean` || n === ``
        ? r
          ? e.setProperty(t, ``)
          : t === `float`
            ? (e.cssFloat = ``)
            : (e[t] = ``)
        : r
          ? e.setProperty(t, n)
          : typeof n != `number` || n === 0 || qt.has(t)
            ? t === `float`
              ? (e.cssFloat = n)
              : (e[t] = (`` + n).trim())
            : (e[t] = n + `px`);
    }
    function Yt(e, t, n) {
      if (t != null && typeof t != `object`) throw Error(i(62));
      if (((e = e.style), n != null)) {
        for (var r in n)
          !n.hasOwnProperty(r) ||
            (t != null && t.hasOwnProperty(r)) ||
            (r.indexOf(`--`) === 0
              ? e.setProperty(r, ``)
              : r === `float`
                ? (e.cssFloat = ``)
                : (e[r] = ``));
        for (var a in t)
          ((r = t[a]), t.hasOwnProperty(a) && n[a] !== r && Jt(e, a, r));
      } else for (var o in t) t.hasOwnProperty(o) && Jt(e, o, t[o]);
    }
    function Xt(e) {
      if (e.indexOf(`-`) === -1) return !1;
      switch (e) {
        case `annotation-xml`:
        case `color-profile`:
        case `font-face`:
        case `font-face-src`:
        case `font-face-uri`:
        case `font-face-format`:
        case `font-face-name`:
        case `missing-glyph`:
          return !1;
        default:
          return !0;
      }
    }
    var Zt = new Map([
        [`acceptCharset`, `accept-charset`],
        [`htmlFor`, `for`],
        [`httpEquiv`, `http-equiv`],
        [`crossOrigin`, `crossorigin`],
        [`accentHeight`, `accent-height`],
        [`alignmentBaseline`, `alignment-baseline`],
        [`arabicForm`, `arabic-form`],
        [`baselineShift`, `baseline-shift`],
        [`capHeight`, `cap-height`],
        [`clipPath`, `clip-path`],
        [`clipRule`, `clip-rule`],
        [`colorInterpolation`, `color-interpolation`],
        [`colorInterpolationFilters`, `color-interpolation-filters`],
        [`colorProfile`, `color-profile`],
        [`colorRendering`, `color-rendering`],
        [`dominantBaseline`, `dominant-baseline`],
        [`enableBackground`, `enable-background`],
        [`fillOpacity`, `fill-opacity`],
        [`fillRule`, `fill-rule`],
        [`floodColor`, `flood-color`],
        [`floodOpacity`, `flood-opacity`],
        [`fontFamily`, `font-family`],
        [`fontSize`, `font-size`],
        [`fontSizeAdjust`, `font-size-adjust`],
        [`fontStretch`, `font-stretch`],
        [`fontStyle`, `font-style`],
        [`fontVariant`, `font-variant`],
        [`fontWeight`, `font-weight`],
        [`glyphName`, `glyph-name`],
        [`glyphOrientationHorizontal`, `glyph-orientation-horizontal`],
        [`glyphOrientationVertical`, `glyph-orientation-vertical`],
        [`horizAdvX`, `horiz-adv-x`],
        [`horizOriginX`, `horiz-origin-x`],
        [`imageRendering`, `image-rendering`],
        [`letterSpacing`, `letter-spacing`],
        [`lightingColor`, `lighting-color`],
        [`markerEnd`, `marker-end`],
        [`markerMid`, `marker-mid`],
        [`markerStart`, `marker-start`],
        [`overlinePosition`, `overline-position`],
        [`overlineThickness`, `overline-thickness`],
        [`paintOrder`, `paint-order`],
        [`panose-1`, `panose-1`],
        [`pointerEvents`, `pointer-events`],
        [`renderingIntent`, `rendering-intent`],
        [`shapeRendering`, `shape-rendering`],
        [`stopColor`, `stop-color`],
        [`stopOpacity`, `stop-opacity`],
        [`strikethroughPosition`, `strikethrough-position`],
        [`strikethroughThickness`, `strikethrough-thickness`],
        [`strokeDasharray`, `stroke-dasharray`],
        [`strokeDashoffset`, `stroke-dashoffset`],
        [`strokeLinecap`, `stroke-linecap`],
        [`strokeLinejoin`, `stroke-linejoin`],
        [`strokeMiterlimit`, `stroke-miterlimit`],
        [`strokeOpacity`, `stroke-opacity`],
        [`strokeWidth`, `stroke-width`],
        [`textAnchor`, `text-anchor`],
        [`textDecoration`, `text-decoration`],
        [`textRendering`, `text-rendering`],
        [`transformOrigin`, `transform-origin`],
        [`underlinePosition`, `underline-position`],
        [`underlineThickness`, `underline-thickness`],
        [`unicodeBidi`, `unicode-bidi`],
        [`unicodeRange`, `unicode-range`],
        [`unitsPerEm`, `units-per-em`],
        [`vAlphabetic`, `v-alphabetic`],
        [`vHanging`, `v-hanging`],
        [`vIdeographic`, `v-ideographic`],
        [`vMathematical`, `v-mathematical`],
        [`vectorEffect`, `vector-effect`],
        [`vertAdvY`, `vert-adv-y`],
        [`vertOriginX`, `vert-origin-x`],
        [`vertOriginY`, `vert-origin-y`],
        [`wordSpacing`, `word-spacing`],
        [`writingMode`, `writing-mode`],
        [`xmlnsXlink`, `xmlns:xlink`],
        [`xHeight`, `x-height`],
      ]),
      Qt =
        /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function $t(e) {
      return Qt.test(`` + e)
        ? `javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`
        : e;
    }
    function en() {}
    var tn = null;
    function nn(e) {
      return (
        (e = e.target || e.srcElement || window),
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
      );
    }
    var rn = null,
      an = null;
    function on(e) {
      var t = _t(e);
      if (t && (e = t.stateNode)) {
        var n = e[ct] || null;
        a: switch (((e = t.stateNode), t.type)) {
          case `input`:
            if (
              (Bt(
                e,
                n.value,
                n.defaultValue,
                n.defaultValue,
                n.checked,
                n.defaultChecked,
                n.type,
                n.name,
              ),
              (t = n.name),
              n.type === `radio` && t != null)
            ) {
              for (n = e; n.parentNode; ) n = n.parentNode;
              for (
                n = n.querySelectorAll(
                  `input[name="` + zt(`` + t) + `"][type="radio"]`,
                ),
                  t = 0;
                t < n.length;
                t++
              ) {
                var r = n[t];
                if (r !== e && r.form === e.form) {
                  var a = r[ct] || null;
                  if (!a) throw Error(i(90));
                  Bt(
                    r,
                    a.value,
                    a.defaultValue,
                    a.defaultValue,
                    a.checked,
                    a.defaultChecked,
                    a.type,
                    a.name,
                  );
                }
              }
              for (t = 0; t < n.length; t++)
                ((r = n[t]), r.form === e.form && It(r));
            }
            break a;
          case `textarea`:
            Wt(e, n.value, n.defaultValue);
            break a;
          case `select`:
            ((t = n.value), t != null && Ut(e, !!n.multiple, t, !1));
        }
      }
    }
    var sn = !1;
    function cn(e, t, n) {
      if (sn) return e(t, n);
      sn = !0;
      try {
        return e(t);
      } finally {
        if (
          ((sn = !1),
          (rn !== null || an !== null) &&
            (Cu(), rn && ((t = rn), (e = an), (an = rn = null), on(t), e)))
        )
          for (t = 0; t < e.length; t++) on(e[t]);
      }
    }
    function ln(e, t) {
      var n = e.stateNode;
      if (n === null) return null;
      var r = n[ct] || null;
      if (r === null) return null;
      n = r[t];
      a: switch (t) {
        case `onClick`:
        case `onClickCapture`:
        case `onDoubleClick`:
        case `onDoubleClickCapture`:
        case `onMouseDown`:
        case `onMouseDownCapture`:
        case `onMouseMove`:
        case `onMouseMoveCapture`:
        case `onMouseUp`:
        case `onMouseUpCapture`:
        case `onMouseEnter`:
          ((r = !r.disabled) ||
            ((e = e.type),
            (r = !(
              e === `button` ||
              e === `input` ||
              e === `select` ||
              e === `textarea`
            ))),
            (e = !r));
          break a;
        default:
          e = !1;
      }
      if (e) return null;
      if (n && typeof n != `function`) throw Error(i(231, t, typeof n));
      return n;
    }
    var un = !(
        typeof window > `u` ||
        window.document === void 0 ||
        window.document.createElement === void 0
      ),
      dn = !1;
    if (un)
      try {
        var fn = {};
        (Object.defineProperty(fn, `passive`, {
          get: function () {
            dn = !0;
          },
        }),
          window.addEventListener(`test`, fn, fn),
          window.removeEventListener(`test`, fn, fn));
      } catch {
        dn = !1;
      }
    var pn = null,
      mn = null,
      hn = null;
    function gn() {
      if (hn) return hn;
      var e,
        t = mn,
        n = t.length,
        r,
        i = `value` in pn ? pn.value : pn.textContent,
        a = i.length;
      for (e = 0; e < n && t[e] === i[e]; e++);
      var o = n - e;
      for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
      return (hn = i.slice(e, 1 < r ? 1 - r : void 0));
    }
    function _n(e) {
      var t = e.keyCode;
      return (
        `charCode` in e
          ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
          : (e = t),
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
      );
    }
    function vn() {
      return !0;
    }
    function yn() {
      return !1;
    }
    function bn(e) {
      function t(t, n, r, i, a) {
        for (var o in ((this._reactName = t),
        (this._targetInst = r),
        (this.type = n),
        (this.nativeEvent = i),
        (this.target = a),
        (this.currentTarget = null),
        e))
          e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(i) : i[o]));
        return (
          (this.isDefaultPrevented = (
            i.defaultPrevented == null
              ? !1 === i.returnValue
              : i.defaultPrevented
          )
            ? vn
            : yn),
          (this.isPropagationStopped = yn),
          this
        );
      }
      return (
        f(t.prototype, {
          preventDefault: function () {
            this.defaultPrevented = !0;
            var e = this.nativeEvent;
            e &&
              (e.preventDefault
                ? e.preventDefault()
                : typeof e.returnValue != `unknown` && (e.returnValue = !1),
              (this.isDefaultPrevented = vn));
          },
          stopPropagation: function () {
            var e = this.nativeEvent;
            e &&
              (e.stopPropagation
                ? e.stopPropagation()
                : typeof e.cancelBubble != `unknown` && (e.cancelBubble = !0),
              (this.isPropagationStopped = vn));
          },
          persist: function () {},
          isPersistent: vn,
        }),
        t
      );
    }
    var xn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function (e) {
          return e.timeStamp || Date.now();
        },
        defaultPrevented: 0,
        isTrusted: 0,
      },
      Sn = bn(xn),
      Cn = f({}, xn, { view: 0, detail: 0 }),
      wn = bn(Cn),
      Tn,
      En,
      Dn,
      On = f({}, Cn, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: zn,
        button: 0,
        buttons: 0,
        relatedTarget: function (e) {
          return e.relatedTarget === void 0
            ? e.fromElement === e.srcElement
              ? e.toElement
              : e.fromElement
            : e.relatedTarget;
        },
        movementX: function (e) {
          return `movementX` in e
            ? e.movementX
            : (e !== Dn &&
                (Dn && e.type === `mousemove`
                  ? ((Tn = e.screenX - Dn.screenX),
                    (En = e.screenY - Dn.screenY))
                  : (En = Tn = 0),
                (Dn = e)),
              Tn);
        },
        movementY: function (e) {
          return `movementY` in e ? e.movementY : En;
        },
      }),
      kn = bn(On),
      An = bn(f({}, On, { dataTransfer: 0 })),
      jn = bn(f({}, Cn, { relatedTarget: 0 })),
      Mn = bn(
        f({}, xn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
      ),
      Nn = bn(
        f({}, xn, {
          clipboardData: function (e) {
            return `clipboardData` in e
              ? e.clipboardData
              : window.clipboardData;
          },
        }),
      ),
      Pn = bn(f({}, xn, { data: 0 })),
      Fn = {
        Esc: `Escape`,
        Spacebar: ` `,
        Left: `ArrowLeft`,
        Up: `ArrowUp`,
        Right: `ArrowRight`,
        Down: `ArrowDown`,
        Del: `Delete`,
        Win: `OS`,
        Menu: `ContextMenu`,
        Apps: `ContextMenu`,
        Scroll: `ScrollLock`,
        MozPrintableKey: `Unidentified`,
      },
      In = {
        8: `Backspace`,
        9: `Tab`,
        12: `Clear`,
        13: `Enter`,
        16: `Shift`,
        17: `Control`,
        18: `Alt`,
        19: `Pause`,
        20: `CapsLock`,
        27: `Escape`,
        32: ` `,
        33: `PageUp`,
        34: `PageDown`,
        35: `End`,
        36: `Home`,
        37: `ArrowLeft`,
        38: `ArrowUp`,
        39: `ArrowRight`,
        40: `ArrowDown`,
        45: `Insert`,
        46: `Delete`,
        112: `F1`,
        113: `F2`,
        114: `F3`,
        115: `F4`,
        116: `F5`,
        117: `F6`,
        118: `F7`,
        119: `F8`,
        120: `F9`,
        121: `F10`,
        122: `F11`,
        123: `F12`,
        144: `NumLock`,
        145: `ScrollLock`,
        224: `Meta`,
      },
      Ln = {
        Alt: `altKey`,
        Control: `ctrlKey`,
        Meta: `metaKey`,
        Shift: `shiftKey`,
      };
    function Rn(e) {
      var t = this.nativeEvent;
      return t.getModifierState
        ? t.getModifierState(e)
        : (e = Ln[e])
          ? !!t[e]
          : !1;
    }
    function zn() {
      return Rn;
    }
    var Bn = bn(
        f({}, Cn, {
          key: function (e) {
            if (e.key) {
              var t = Fn[e.key] || e.key;
              if (t !== `Unidentified`) return t;
            }
            return e.type === `keypress`
              ? ((e = _n(e)), e === 13 ? `Enter` : String.fromCharCode(e))
              : e.type === `keydown` || e.type === `keyup`
                ? In[e.keyCode] || `Unidentified`
                : ``;
          },
          code: 0,
          location: 0,
          ctrlKey: 0,
          shiftKey: 0,
          altKey: 0,
          metaKey: 0,
          repeat: 0,
          locale: 0,
          getModifierState: zn,
          charCode: function (e) {
            return e.type === `keypress` ? _n(e) : 0;
          },
          keyCode: function (e) {
            return e.type === `keydown` || e.type === `keyup` ? e.keyCode : 0;
          },
          which: function (e) {
            return e.type === `keypress`
              ? _n(e)
              : e.type === `keydown` || e.type === `keyup`
                ? e.keyCode
                : 0;
          },
        }),
      ),
      Vn = bn(
        f({}, On, {
          pointerId: 0,
          width: 0,
          height: 0,
          pressure: 0,
          tangentialPressure: 0,
          tiltX: 0,
          tiltY: 0,
          twist: 0,
          pointerType: 0,
          isPrimary: 0,
        }),
      ),
      Hn = bn(
        f({}, Cn, {
          touches: 0,
          targetTouches: 0,
          changedTouches: 0,
          altKey: 0,
          metaKey: 0,
          ctrlKey: 0,
          shiftKey: 0,
          getModifierState: zn,
        }),
      ),
      Un = bn(f({}, xn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
      Wn = bn(
        f({}, On, {
          deltaX: function (e) {
            return `deltaX` in e
              ? e.deltaX
              : `wheelDeltaX` in e
                ? -e.wheelDeltaX
                : 0;
          },
          deltaY: function (e) {
            return `deltaY` in e
              ? e.deltaY
              : `wheelDeltaY` in e
                ? -e.wheelDeltaY
                : `wheelDelta` in e
                  ? -e.wheelDelta
                  : 0;
          },
          deltaZ: 0,
          deltaMode: 0,
        }),
      ),
      Gn = bn(f({}, xn, { newState: 0, oldState: 0 })),
      Kn = [9, 13, 27, 32],
      qn = un && `CompositionEvent` in window,
      Jn = null;
    un && `documentMode` in document && (Jn = document.documentMode);
    var Yn = un && `TextEvent` in window && !Jn,
      Xn = un && (!qn || (Jn && 8 < Jn && 11 >= Jn)),
      Zn = ` `,
      Qn = !1;
    function $n(e, t) {
      switch (e) {
        case `keyup`:
          return Kn.indexOf(t.keyCode) !== -1;
        case `keydown`:
          return t.keyCode !== 229;
        case `keypress`:
        case `mousedown`:
        case `focusout`:
          return !0;
        default:
          return !1;
      }
    }
    function er(e) {
      return (
        (e = e.detail),
        typeof e == `object` && `data` in e ? e.data : null
      );
    }
    var tr = !1;
    function nr(e, t) {
      switch (e) {
        case `compositionend`:
          return er(t);
        case `keypress`:
          return t.which === 32 ? ((Qn = !0), Zn) : null;
        case `textInput`:
          return ((e = t.data), e === Zn && Qn ? null : e);
        default:
          return null;
      }
    }
    function rr(e, t) {
      if (tr)
        return e === `compositionend` || (!qn && $n(e, t))
          ? ((e = gn()), (hn = mn = pn = null), (tr = !1), e)
          : null;
      switch (e) {
        case `paste`:
          return null;
        case `keypress`:
          if (
            !(t.ctrlKey || t.altKey || t.metaKey) ||
            (t.ctrlKey && t.altKey)
          ) {
            if (t.char && 1 < t.char.length) return t.char;
            if (t.which) return String.fromCharCode(t.which);
          }
          return null;
        case `compositionend`:
          return Xn && t.locale !== `ko` ? null : t.data;
        default:
          return null;
      }
    }
    var ir = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0,
    };
    function ar(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === `input` ? !!ir[e.type] : t === `textarea`;
    }
    function or(e, t, n, r) {
      (rn ? (an ? an.push(r) : (an = [r])) : (rn = r),
        (t = kd(t, `onChange`)),
        0 < t.length &&
          ((n = new Sn(`onChange`, `change`, null, n, r)),
          e.push({ event: n, listeners: t })));
    }
    var sr = null,
      cr = null;
    function lr(e) {
      Sd(e, 0);
    }
    function ur(e) {
      if (It(vt(e))) return e;
    }
    function dr(e, t) {
      if (e === `change`) return t;
    }
    var fr = !1;
    if (un) {
      var pr;
      if (un) {
        var mr = `oninput` in document;
        if (!mr) {
          var hr = document.createElement(`div`);
          (hr.setAttribute(`oninput`, `return;`),
            (mr = typeof hr.oninput == `function`));
        }
        pr = mr;
      } else pr = !1;
      fr = pr && (!document.documentMode || 9 < document.documentMode);
    }
    function gr() {
      sr && (sr.detachEvent(`onpropertychange`, _r), (cr = sr = null));
    }
    function _r(e) {
      if (e.propertyName === `value` && ur(cr)) {
        var t = [];
        (or(t, cr, e, nn(e)), cn(lr, t));
      }
    }
    function vr(e, t, n) {
      e === `focusin`
        ? (gr(), (sr = t), (cr = n), sr.attachEvent(`onpropertychange`, _r))
        : e === `focusout` && gr();
    }
    function yr(e) {
      if (e === `selectionchange` || e === `keyup` || e === `keydown`)
        return ur(cr);
    }
    function br(e, t) {
      if (e === `click`) return ur(t);
    }
    function xr(e, t) {
      if (e === `input` || e === `change`) return ur(t);
    }
    function Sr(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var Cr = typeof Object.is == `function` ? Object.is : Sr;
    function wr(e, t) {
      if (Cr(e, t)) return !0;
      if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
      var n = Object.keys(e),
        r = Object.keys(t);
      if (n.length !== r.length) return !1;
      for (r = 0; r < n.length; r++) {
        var i = n[r];
        if (!xe.call(t, i) || !Cr(e[i], t[i])) return !1;
      }
      return !0;
    }
    function Tr(e) {
      for (; e && e.firstChild; ) e = e.firstChild;
      return e;
    }
    function Er(e, t) {
      var n = Tr(e);
      e = 0;
      for (var r; n; ) {
        if (n.nodeType === 3) {
          if (((r = e + n.textContent.length), e <= t && r >= t))
            return { node: n, offset: t - e };
          e = r;
        }
        a: {
          for (; n; ) {
            if (n.nextSibling) {
              n = n.nextSibling;
              break a;
            }
            n = n.parentNode;
          }
          n = void 0;
        }
        n = Tr(n);
      }
    }
    function Dr(e, t) {
      return e && t
        ? e === t
          ? !0
          : e && e.nodeType === 3
            ? !1
            : t && t.nodeType === 3
              ? Dr(e, t.parentNode)
              : `contains` in e
                ? e.contains(t)
                : e.compareDocumentPosition
                  ? !!(e.compareDocumentPosition(t) & 16)
                  : !1
        : !1;
    }
    function Or(e) {
      e =
        e != null &&
        e.ownerDocument != null &&
        e.ownerDocument.defaultView != null
          ? e.ownerDocument.defaultView
          : window;
      for (var t = Lt(e.document); t instanceof e.HTMLIFrameElement; ) {
        try {
          var n = typeof t.contentWindow.location.href == `string`;
        } catch {
          n = !1;
        }
        if (n) e = t.contentWindow;
        else break;
        t = Lt(e.document);
      }
      return t;
    }
    function kr(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return (
        t &&
        ((t === `input` &&
          (e.type === `text` ||
            e.type === `search` ||
            e.type === `tel` ||
            e.type === `url` ||
            e.type === `password`)) ||
          t === `textarea` ||
          e.contentEditable === `true`)
      );
    }
    var Ar = un && `documentMode` in document && 11 >= document.documentMode,
      jr = null,
      Mr = null,
      Nr = null,
      Pr = !1;
    function Fr(e, t, n) {
      var r =
        n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
      Pr ||
        jr == null ||
        jr !== Lt(r) ||
        ((r = jr),
        `selectionStart` in r && kr(r)
          ? (r = { start: r.selectionStart, end: r.selectionEnd })
          : ((r = (
              (r.ownerDocument && r.ownerDocument.defaultView) ||
              window
            ).getSelection()),
            (r = {
              anchorNode: r.anchorNode,
              anchorOffset: r.anchorOffset,
              focusNode: r.focusNode,
              focusOffset: r.focusOffset,
            })),
        (Nr && wr(Nr, r)) ||
          ((Nr = r),
          (r = kd(Mr, `onSelect`)),
          0 < r.length &&
            ((t = new Sn(`onSelect`, `select`, null, t, n)),
            e.push({ event: t, listeners: r }),
            (t.target = jr))));
    }
    function Ir(e, t) {
      var n = {};
      return (
        (n[e.toLowerCase()] = t.toLowerCase()),
        (n[`Webkit` + e] = `webkit` + t),
        (n[`Moz` + e] = `moz` + t),
        n
      );
    }
    var Lr = {
        animationend: Ir(`Animation`, `AnimationEnd`),
        animationiteration: Ir(`Animation`, `AnimationIteration`),
        animationstart: Ir(`Animation`, `AnimationStart`),
        transitionrun: Ir(`Transition`, `TransitionRun`),
        transitionstart: Ir(`Transition`, `TransitionStart`),
        transitioncancel: Ir(`Transition`, `TransitionCancel`),
        transitionend: Ir(`Transition`, `TransitionEnd`),
      },
      Rr = {},
      zr = {};
    un &&
      ((zr = document.createElement(`div`).style),
      `AnimationEvent` in window ||
        (delete Lr.animationend.animation,
        delete Lr.animationiteration.animation,
        delete Lr.animationstart.animation),
      `TransitionEvent` in window || delete Lr.transitionend.transition);
    function Br(e) {
      if (Rr[e]) return Rr[e];
      if (!Lr[e]) return e;
      var t = Lr[e],
        n;
      for (n in t) if (t.hasOwnProperty(n) && n in zr) return (Rr[e] = t[n]);
      return e;
    }
    var Vr = Br(`animationend`),
      Hr = Br(`animationiteration`),
      Ur = Br(`animationstart`),
      Wr = Br(`transitionrun`),
      Gr = Br(`transitionstart`),
      Kr = Br(`transitioncancel`),
      qr = Br(`transitionend`),
      Jr = new Map(),
      Yr =
        `abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
          ` `,
        );
    Yr.push(`scrollEnd`);
    function Xr(e, t) {
      (Jr.set(e, t), Ct(t, [e]));
    }
    var Zr =
        typeof reportError == `function`
          ? reportError
          : function (e) {
              if (
                typeof window == `object` &&
                typeof window.ErrorEvent == `function`
              ) {
                var t = new window.ErrorEvent(`error`, {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof e == `object` && e && typeof e.message == `string`
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                typeof process == `object` &&
                typeof process.emit == `function`
              ) {
                process.emit(`uncaughtException`, e);
                return;
              }
              console.error(e);
            },
      Qr = [],
      $r = 0,
      ei = 0;
    function ti() {
      for (var e = $r, t = (ei = $r = 0); t < e; ) {
        var n = Qr[t];
        Qr[t++] = null;
        var r = Qr[t];
        Qr[t++] = null;
        var i = Qr[t];
        Qr[t++] = null;
        var a = Qr[t];
        if (((Qr[t++] = null), r !== null && i !== null)) {
          var o = r.pending;
          (o === null ? (i.next = i) : ((i.next = o.next), (o.next = i)),
            (r.pending = i));
        }
        a !== 0 && ai(n, i, a);
      }
    }
    function ni(e, t, n, r) {
      ((Qr[$r++] = e),
        (Qr[$r++] = t),
        (Qr[$r++] = n),
        (Qr[$r++] = r),
        (ei |= r),
        (e.lanes |= r),
        (e = e.alternate),
        e !== null && (e.lanes |= r));
    }
    function ri(e, t, n, r) {
      return (ni(e, t, n, r), oi(e));
    }
    function ii(e, t) {
      return (ni(e, null, null, t), oi(e));
    }
    function ai(e, t, n) {
      e.lanes |= n;
      var r = e.alternate;
      r !== null && (r.lanes |= n);
      for (var i = !1, a = e.return; a !== null; )
        ((a.childLanes |= n),
          (r = a.alternate),
          r !== null && (r.childLanes |= n),
          a.tag === 22 &&
            ((e = a.stateNode), e === null || e._visibility & 1 || (i = !0)),
          (e = a),
          (a = a.return));
      return e.tag === 3
        ? ((a = e.stateNode),
          i &&
            t !== null &&
            ((i = 31 - Re(n)),
            (e = a.hiddenUpdates),
            (r = e[i]),
            r === null ? (e[i] = [t]) : r.push(t),
            (t.lane = n | 536870912)),
          a)
        : null;
    }
    function oi(e) {
      if (50 < mu) throw ((mu = 0), (hu = null), Error(i(185)));
      for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
      return e.tag === 3 ? e.stateNode : null;
    }
    var si = {};
    function ci(e, t, n, r) {
      ((this.tag = e),
        (this.key = n),
        (this.sibling =
          this.child =
          this.return =
          this.stateNode =
          this.type =
          this.elementType =
            null),
        (this.index = 0),
        (this.refCleanup = this.ref = null),
        (this.pendingProps = t),
        (this.dependencies =
          this.memoizedState =
          this.updateQueue =
          this.memoizedProps =
            null),
        (this.mode = r),
        (this.subtreeFlags = this.flags = 0),
        (this.deletions = null),
        (this.childLanes = this.lanes = 0),
        (this.alternate = null));
    }
    function li(e, t, n, r) {
      return new ci(e, t, n, r);
    }
    function ui(e) {
      return ((e = e.prototype), !(!e || !e.isReactComponent));
    }
    function di(e, t) {
      var n = e.alternate;
      return (
        n === null
          ? ((n = li(e.tag, t, e.key, e.mode)),
            (n.elementType = e.elementType),
            (n.type = e.type),
            (n.stateNode = e.stateNode),
            (n.alternate = e),
            (e.alternate = n))
          : ((n.pendingProps = t),
            (n.type = e.type),
            (n.flags = 0),
            (n.subtreeFlags = 0),
            (n.deletions = null)),
        (n.flags = e.flags & 65011712),
        (n.childLanes = e.childLanes),
        (n.lanes = e.lanes),
        (n.child = e.child),
        (n.memoizedProps = e.memoizedProps),
        (n.memoizedState = e.memoizedState),
        (n.updateQueue = e.updateQueue),
        (t = e.dependencies),
        (n.dependencies =
          t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
        (n.sibling = e.sibling),
        (n.index = e.index),
        (n.ref = e.ref),
        (n.refCleanup = e.refCleanup),
        n
      );
    }
    function fi(e, t) {
      e.flags &= 65011714;
      var n = e.alternate;
      return (
        n === null
          ? ((e.childLanes = 0),
            (e.lanes = t),
            (e.child = null),
            (e.subtreeFlags = 0),
            (e.memoizedProps = null),
            (e.memoizedState = null),
            (e.updateQueue = null),
            (e.dependencies = null),
            (e.stateNode = null))
          : ((e.childLanes = n.childLanes),
            (e.lanes = n.lanes),
            (e.child = n.child),
            (e.subtreeFlags = 0),
            (e.deletions = null),
            (e.memoizedProps = n.memoizedProps),
            (e.memoizedState = n.memoizedState),
            (e.updateQueue = n.updateQueue),
            (e.type = n.type),
            (t = n.dependencies),
            (e.dependencies =
              t === null
                ? null
                : { lanes: t.lanes, firstContext: t.firstContext })),
        e
      );
    }
    function pi(e, t, n, r, a, o) {
      var s = 0;
      if (((r = e), typeof e == `function`)) ui(e) && (s = 1);
      else if (typeof e == `string`)
        s = Kf(e, n, oe.current)
          ? 26
          : e === `html` || e === `head` || e === `body`
            ? 27
            : 5;
      else
        a: switch (e) {
          case ee:
            return (
              (e = li(31, n, t, a)),
              (e.elementType = ee),
              (e.lanes = o),
              e
            );
          case y:
            return mi(n.children, a, o, t);
          case b:
            ((s = 8), (a |= 24));
            break;
          case x:
            return (
              (e = li(12, n, t, a | 2)),
              (e.elementType = x),
              (e.lanes = o),
              e
            );
          case T:
            return (
              (e = li(13, n, t, a)),
              (e.elementType = T),
              (e.lanes = o),
              e
            );
          case E:
            return (
              (e = li(19, n, t, a)),
              (e.elementType = E),
              (e.lanes = o),
              e
            );
          default:
            if (typeof e == `object` && e)
              switch (e.$$typeof) {
                case C:
                  s = 10;
                  break a;
                case S:
                  s = 9;
                  break a;
                case w:
                  s = 11;
                  break a;
                case D:
                  s = 14;
                  break a;
                case O:
                  ((s = 16), (r = null));
                  break a;
              }
            ((s = 29),
              (n = Error(i(130, e === null ? `null` : typeof e, ``))),
              (r = null));
        }
      return (
        (t = li(s, n, t, a)),
        (t.elementType = e),
        (t.type = r),
        (t.lanes = o),
        t
      );
    }
    function mi(e, t, n, r) {
      return ((e = li(7, e, r, t)), (e.lanes = n), e);
    }
    function hi(e, t, n) {
      return ((e = li(6, e, null, t)), (e.lanes = n), e);
    }
    function gi(e) {
      var t = li(18, null, null, 0);
      return ((t.stateNode = e), t);
    }
    function _i(e, t, n) {
      return (
        (t = li(4, e.children === null ? [] : e.children, e.key, t)),
        (t.lanes = n),
        (t.stateNode = {
          containerInfo: e.containerInfo,
          pendingChildren: null,
          implementation: e.implementation,
        }),
        t
      );
    }
    var vi = new WeakMap();
    function yi(e, t) {
      if (typeof e == `object` && e) {
        var n = vi.get(e);
        return n === void 0
          ? ((t = { value: e, source: t, stack: be(t) }), vi.set(e, t), t)
          : n;
      }
      return { value: e, source: t, stack: be(t) };
    }
    var bi = [],
      xi = 0,
      Si = null,
      Ci = 0,
      wi = [],
      Ti = 0,
      Ei = null,
      Di = 1,
      Oi = ``;
    function ki(e, t) {
      ((bi[xi++] = Ci), (bi[xi++] = Si), (Si = e), (Ci = t));
    }
    function Ai(e, t, n) {
      ((wi[Ti++] = Di), (wi[Ti++] = Oi), (wi[Ti++] = Ei), (Ei = e));
      var r = Di;
      e = Oi;
      var i = 32 - Re(r) - 1;
      ((r &= ~(1 << i)), (n += 1));
      var a = 32 - Re(t) + i;
      if (30 < a) {
        var o = i - (i % 5);
        ((a = (r & ((1 << o) - 1)).toString(32)),
          (r >>= o),
          (i -= o),
          (Di = (1 << (32 - Re(t) + i)) | (n << i) | r),
          (Oi = a + e));
      } else ((Di = (1 << a) | (n << i) | r), (Oi = e));
    }
    function ji(e) {
      e.return !== null && (ki(e, 1), Ai(e, 1, 0));
    }
    function Mi(e) {
      for (; e === Si; )
        ((Si = bi[--xi]), (bi[xi] = null), (Ci = bi[--xi]), (bi[xi] = null));
      for (; e === Ei; )
        ((Ei = wi[--Ti]),
          (wi[Ti] = null),
          (Oi = wi[--Ti]),
          (wi[Ti] = null),
          (Di = wi[--Ti]),
          (wi[Ti] = null));
    }
    function Ni(e, t) {
      ((wi[Ti++] = Di),
        (wi[Ti++] = Oi),
        (wi[Ti++] = Ei),
        (Di = t.id),
        (Oi = t.overflow),
        (Ei = e));
    }
    var Pi = null,
      Fi = null,
      R = !1,
      Ii = null,
      Li = !1,
      Ri = Error(i(519));
    function zi(e) {
      throw (
        Gi(
          yi(
            Error(
              i(
                418,
                1 < arguments.length && arguments[1] !== void 0 && arguments[1]
                  ? `text`
                  : `HTML`,
                ``,
              ),
            ),
            e,
          ),
        ),
        Ri
      );
    }
    function Bi(e) {
      var t = e.stateNode,
        n = e.type,
        r = e.memoizedProps;
      switch (((t[st] = e), (t[ct] = r), n)) {
        case `dialog`:
          (Y(`cancel`, t), Y(`close`, t));
          break;
        case `iframe`:
        case `object`:
        case `embed`:
          Y(`load`, t);
          break;
        case `video`:
        case `audio`:
          for (n = 0; n < bd.length; n++) Y(bd[n], t);
          break;
        case `source`:
          Y(`error`, t);
          break;
        case `img`:
        case `image`:
        case `link`:
          (Y(`error`, t), Y(`load`, t));
          break;
        case `details`:
          Y(`toggle`, t);
          break;
        case `input`:
          (Y(`invalid`, t),
            Vt(
              t,
              r.value,
              r.defaultValue,
              r.checked,
              r.defaultChecked,
              r.type,
              r.name,
              !0,
            ));
          break;
        case `select`:
          Y(`invalid`, t);
          break;
        case `textarea`:
          (Y(`invalid`, t), Gt(t, r.value, r.defaultValue, r.children));
      }
      ((n = r.children),
        (typeof n != `string` &&
          typeof n != `number` &&
          typeof n != `bigint`) ||
        t.textContent === `` + n ||
        !0 === r.suppressHydrationWarning ||
        Fd(t.textContent, n)
          ? (r.popover != null && (Y(`beforetoggle`, t), Y(`toggle`, t)),
            r.onScroll != null && Y(`scroll`, t),
            r.onScrollEnd != null && Y(`scrollend`, t),
            r.onClick != null && (t.onclick = en),
            (t = !0))
          : (t = !1),
        t || zi(e, !0));
    }
    function Vi(e) {
      for (Pi = e.return; Pi; )
        switch (Pi.tag) {
          case 5:
          case 31:
          case 13:
            Li = !1;
            return;
          case 27:
          case 3:
            Li = !0;
            return;
          default:
            Pi = Pi.return;
        }
    }
    function Hi(e) {
      if (e !== Pi) return !1;
      if (!R) return (Vi(e), (R = !0), !1);
      var t = e.tag,
        n;
      if (
        ((n = t !== 3 && t !== 27) &&
          ((n = t === 5) &&
            ((n = e.type),
            (n =
              !(n !== `form` && n !== `button`) ||
              Kd(e.type, e.memoizedProps))),
          (n = !n)),
        n && Fi && zi(e),
        Vi(e),
        t === 13)
      ) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        Fi = pf(e);
      } else if (t === 31) {
        if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
          throw Error(i(317));
        Fi = pf(e);
      } else
        t === 27
          ? ((t = Fi),
            ef(e.type) ? ((e = ff), (ff = null), (Fi = e)) : (Fi = t))
          : (Fi = Pi ? df(e.stateNode.nextSibling) : null);
      return !0;
    }
    function Ui() {
      ((Fi = Pi = null), (R = !1));
    }
    function Wi() {
      var e = Ii;
      return (
        e !== null &&
          (eu === null ? (eu = e) : eu.push.apply(eu, e), (Ii = null)),
        e
      );
    }
    function Gi(e) {
      Ii === null ? (Ii = [e]) : Ii.push(e);
    }
    var Ki = ie(null),
      qi = null,
      Ji = null;
    function Yi(e, t, n) {
      (L(Ki, t._currentValue), (t._currentValue = n));
    }
    function Xi(e) {
      ((e._currentValue = Ki.current), ae(Ki));
    }
    function Zi(e, t, n) {
      for (; e !== null; ) {
        var r = e.alternate;
        if (
          ((e.childLanes & t) === t
            ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t)
            : ((e.childLanes |= t), r !== null && (r.childLanes |= t)),
          e === n)
        )
          break;
        e = e.return;
      }
    }
    function Qi(e, t, n, r) {
      var a = e.child;
      for (a !== null && (a.return = e); a !== null; ) {
        var o = a.dependencies;
        if (o !== null) {
          var s = a.child;
          o = o.firstContext;
          a: for (; o !== null; ) {
            var c = o;
            o = a;
            for (var l = 0; l < t.length; l++)
              if (c.context === t[l]) {
                ((o.lanes |= n),
                  (c = o.alternate),
                  c !== null && (c.lanes |= n),
                  Zi(o.return, n, e),
                  r || (s = null));
                break a;
              }
            o = c.next;
          }
        } else if (a.tag === 18) {
          if (((s = a.return), s === null)) throw Error(i(341));
          ((s.lanes |= n),
            (o = s.alternate),
            o !== null && (o.lanes |= n),
            Zi(s, n, e),
            (s = null));
        } else s = a.child;
        if (s !== null) s.return = a;
        else
          for (s = a; s !== null; ) {
            if (s === e) {
              s = null;
              break;
            }
            if (((a = s.sibling), a !== null)) {
              ((a.return = s.return), (s = a));
              break;
            }
            s = s.return;
          }
        a = s;
      }
    }
    function $i(e, t, n, r) {
      e = null;
      for (var a = t, o = !1; a !== null; ) {
        if (!o) {
          if (a.flags & 524288) o = !0;
          else if (a.flags & 262144) break;
        }
        if (a.tag === 10) {
          var s = a.alternate;
          if (s === null) throw Error(i(387));
          if (((s = s.memoizedProps), s !== null)) {
            var c = a.type;
            Cr(a.pendingProps.value, s.value) ||
              (e === null ? (e = [c]) : e.push(c));
          }
        } else if (a === le.current) {
          if (((s = a.alternate), s === null)) throw Error(i(387));
          s.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
            (e === null ? (e = [tp]) : e.push(tp));
        }
        a = a.return;
      }
      (e !== null && Qi(t, e, n, r), (t.flags |= 262144));
    }
    function ea(e) {
      for (e = e.firstContext; e !== null; ) {
        if (!Cr(e.context._currentValue, e.memoizedValue)) return !0;
        e = e.next;
      }
      return !1;
    }
    function ta(e) {
      ((qi = e),
        (Ji = null),
        (e = e.dependencies),
        e !== null && (e.firstContext = null));
    }
    function na(e) {
      return ia(qi, e);
    }
    function ra(e, t) {
      return (qi === null && ta(e), ia(e, t));
    }
    function ia(e, t) {
      var n = t._currentValue;
      if (((t = { context: t, memoizedValue: n, next: null }), Ji === null)) {
        if (e === null) throw Error(i(308));
        ((Ji = t),
          (e.dependencies = { lanes: 0, firstContext: t }),
          (e.flags |= 524288));
      } else Ji = Ji.next = t;
      return n;
    }
    var aa =
        typeof AbortController < `u`
          ? AbortController
          : function () {
              var e = [],
                t = (this.signal = {
                  aborted: !1,
                  addEventListener: function (t, n) {
                    e.push(n);
                  },
                });
              this.abort = function () {
                ((t.aborted = !0),
                  e.forEach(function (e) {
                    return e();
                  }));
              };
            },
      oa = t.unstable_scheduleCallback,
      sa = t.unstable_NormalPriority,
      ca = {
        $$typeof: C,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0,
      };
    function la() {
      return { controller: new aa(), data: new Map(), refCount: 0 };
    }
    function ua(e) {
      (e.refCount--,
        e.refCount === 0 &&
          oa(sa, function () {
            e.controller.abort();
          }));
    }
    var da = null,
      fa = 0,
      pa = 0,
      ma = null;
    function ha(e, t) {
      if (da === null) {
        var n = (da = []);
        ((fa = 0),
          (pa = md()),
          (ma = {
            status: `pending`,
            value: void 0,
            then: function (e) {
              n.push(e);
            },
          }));
      }
      return (fa++, t.then(ga, ga), t);
    }
    function ga() {
      if (--fa === 0 && da !== null) {
        ma !== null && (ma.status = `fulfilled`);
        var e = da;
        ((da = null), (pa = 0), (ma = null));
        for (var t = 0; t < e.length; t++) (0, e[t])();
      }
    }
    function _a(e, t) {
      var n = [],
        r = {
          status: `pending`,
          value: null,
          reason: null,
          then: function (e) {
            n.push(e);
          },
        };
      return (
        e.then(
          function () {
            ((r.status = `fulfilled`), (r.value = t));
            for (var e = 0; e < n.length; e++) (0, n[e])(t);
          },
          function (e) {
            for (r.status = `rejected`, r.reason = e, e = 0; e < n.length; e++)
              (0, n[e])(void 0);
          },
        ),
        r
      );
    }
    var va = P.S;
    P.S = function (e, t) {
      ((ru = Ee()),
        typeof t == `object` && t && typeof t.then == `function` && ha(e, t),
        va !== null && va(e, t));
    };
    var ya = ie(null);
    function ba() {
      var e = ya.current;
      return e === null ? Vl.pooledCache : e;
    }
    function xa(e, t) {
      t === null ? L(ya, ya.current) : L(ya, t.pool);
    }
    function Sa() {
      var e = ba();
      return e === null ? null : { parent: ca._currentValue, pool: e };
    }
    var Ca = Error(i(460)),
      wa = Error(i(474)),
      Ta = Error(i(542)),
      Ea = { then: function () {} };
    function Da(e) {
      return ((e = e.status), e === `fulfilled` || e === `rejected`);
    }
    function Oa(e, t, n) {
      switch (
        ((n = e[n]),
        n === void 0 ? e.push(t) : n !== t && (t.then(en, en), (t = n)),
        t.status)
      ) {
        case `fulfilled`:
          return t.value;
        case `rejected`:
          throw ((e = t.reason), Ma(e), e);
        default:
          if (typeof t.status == `string`) t.then(en, en);
          else {
            if (((e = Vl), e !== null && 100 < e.shellSuspendCounter))
              throw Error(i(482));
            ((e = t),
              (e.status = `pending`),
              e.then(
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `fulfilled`), (n.value = e));
                  }
                },
                function (e) {
                  if (t.status === `pending`) {
                    var n = t;
                    ((n.status = `rejected`), (n.reason = e));
                  }
                },
              ));
          }
          switch (t.status) {
            case `fulfilled`:
              return t.value;
            case `rejected`:
              throw ((e = t.reason), Ma(e), e);
          }
          throw ((Aa = t), Ca);
      }
    }
    function ka(e) {
      try {
        var t = e._init;
        return t(e._payload);
      } catch (e) {
        throw typeof e == `object` && e && typeof e.then == `function`
          ? ((Aa = e), Ca)
          : e;
      }
    }
    var Aa = null;
    function ja() {
      if (Aa === null) throw Error(i(459));
      var e = Aa;
      return ((Aa = null), e);
    }
    function Ma(e) {
      if (e === Ca || e === Ta) throw Error(i(483));
    }
    var Na = null,
      Pa = 0;
    function Fa(e) {
      var t = Pa;
      return ((Pa += 1), Na === null && (Na = []), Oa(Na, e, t));
    }
    function Ia(e, t) {
      ((t = t.props.ref), (e.ref = t === void 0 ? null : t));
    }
    function La(e, t) {
      throw t.$$typeof === m
        ? Error(i(525))
        : ((e = Object.prototype.toString.call(t)),
          Error(
            i(
              31,
              e === `[object Object]`
                ? `object with keys {` + Object.keys(t).join(`, `) + `}`
                : e,
            ),
          ));
    }
    function Ra(e) {
      function t(t, n) {
        if (e) {
          var r = t.deletions;
          r === null ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
        }
      }
      function n(n, r) {
        if (!e) return null;
        for (; r !== null; ) (t(n, r), (r = r.sibling));
        return null;
      }
      function r(e) {
        for (var t = new Map(); e !== null; )
          (e.key === null ? t.set(e.index, e) : t.set(e.key, e),
            (e = e.sibling));
        return t;
      }
      function a(e, t) {
        return ((e = di(e, t)), (e.index = 0), (e.sibling = null), e);
      }
      function o(t, n, r) {
        return (
          (t.index = r),
          e
            ? ((r = t.alternate),
              r === null
                ? ((t.flags |= 67108866), n)
                : ((r = r.index), r < n ? ((t.flags |= 67108866), n) : r))
            : ((t.flags |= 1048576), n)
        );
      }
      function s(t) {
        return (e && t.alternate === null && (t.flags |= 67108866), t);
      }
      function c(e, t, n, r) {
        return t === null || t.tag !== 6
          ? ((t = hi(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function l(e, t, n, r) {
        var i = n.type;
        return i === y
          ? d(e, t, n.props.children, r, n.key)
          : t !== null &&
              (t.elementType === i ||
                (typeof i == `object` &&
                  i &&
                  i.$$typeof === O &&
                  ka(i) === t.type))
            ? ((t = a(t, n.props)), Ia(t, n), (t.return = e), t)
            : ((t = pi(n.type, n.key, n.props, null, e.mode, r)),
              Ia(t, n),
              (t.return = e),
              t);
      }
      function u(e, t, n, r) {
        return t === null ||
          t.tag !== 4 ||
          t.stateNode.containerInfo !== n.containerInfo ||
          t.stateNode.implementation !== n.implementation
          ? ((t = _i(n, e.mode, r)), (t.return = e), t)
          : ((t = a(t, n.children || [])), (t.return = e), t);
      }
      function d(e, t, n, r, i) {
        return t === null || t.tag !== 7
          ? ((t = mi(n, e.mode, r, i)), (t.return = e), t)
          : ((t = a(t, n)), (t.return = e), t);
      }
      function f(e, t, n) {
        if (
          (typeof t == `string` && t !== ``) ||
          typeof t == `number` ||
          typeof t == `bigint`
        )
          return ((t = hi(`` + t, e.mode, n)), (t.return = e), t);
        if (typeof t == `object` && t) {
          switch (t.$$typeof) {
            case g:
              return (
                (n = pi(t.type, t.key, t.props, null, e.mode, n)),
                Ia(n, t),
                (n.return = e),
                n
              );
            case v:
              return ((t = _i(t, e.mode, n)), (t.return = e), t);
            case O:
              return ((t = ka(t)), f(e, t, n));
          }
          if (te(t) || j(t))
            return ((t = mi(t, e.mode, n, null)), (t.return = e), t);
          if (typeof t.then == `function`) return f(e, Fa(t), n);
          if (t.$$typeof === C) return f(e, ra(e, t), n);
          La(e, t);
        }
        return null;
      }
      function p(e, t, n, r) {
        var i = t === null ? null : t.key;
        if (
          (typeof n == `string` && n !== ``) ||
          typeof n == `number` ||
          typeof n == `bigint`
        )
          return i === null ? c(e, t, `` + n, r) : null;
        if (typeof n == `object` && n) {
          switch (n.$$typeof) {
            case g:
              return n.key === i ? l(e, t, n, r) : null;
            case v:
              return n.key === i ? u(e, t, n, r) : null;
            case O:
              return ((n = ka(n)), p(e, t, n, r));
          }
          if (te(n) || j(n)) return i === null ? d(e, t, n, r, null) : null;
          if (typeof n.then == `function`) return p(e, t, Fa(n), r);
          if (n.$$typeof === C) return p(e, t, ra(e, n), r);
          La(e, n);
        }
        return null;
      }
      function m(e, t, n, r, i) {
        if (
          (typeof r == `string` && r !== ``) ||
          typeof r == `number` ||
          typeof r == `bigint`
        )
          return ((e = e.get(n) || null), c(t, e, `` + r, i));
        if (typeof r == `object` && r) {
          switch (r.$$typeof) {
            case g:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                l(t, e, r, i)
              );
            case v:
              return (
                (e = e.get(r.key === null ? n : r.key) || null),
                u(t, e, r, i)
              );
            case O:
              return ((r = ka(r)), m(e, t, n, r, i));
          }
          if (te(r) || j(r))
            return ((e = e.get(n) || null), d(t, e, r, i, null));
          if (typeof r.then == `function`) return m(e, t, n, Fa(r), i);
          if (r.$$typeof === C) return m(e, t, n, ra(t, r), i);
          La(t, r);
        }
        return null;
      }
      function h(i, a, s, c) {
        for (
          var l = null, u = null, d = a, h = (a = 0), g = null;
          d !== null && h < s.length;
          h++
        ) {
          d.index > h ? ((g = d), (d = null)) : (g = d.sibling);
          var _ = p(i, d, s[h], c);
          if (_ === null) {
            d === null && (d = g);
            break;
          }
          (e && d && _.alternate === null && t(i, d),
            (a = o(_, a, h)),
            u === null ? (l = _) : (u.sibling = _),
            (u = _),
            (d = g));
        }
        if (h === s.length) return (n(i, d), R && ki(i, h), l);
        if (d === null) {
          for (; h < s.length; h++)
            ((d = f(i, s[h], c)),
              d !== null &&
                ((a = o(d, a, h)),
                u === null ? (l = d) : (u.sibling = d),
                (u = d)));
          return (R && ki(i, h), l);
        }
        for (d = r(d); h < s.length; h++)
          ((g = m(d, i, h, s[h], c)),
            g !== null &&
              (e &&
                g.alternate !== null &&
                d.delete(g.key === null ? h : g.key),
              (a = o(g, a, h)),
              u === null ? (l = g) : (u.sibling = g),
              (u = g)));
        return (
          e &&
            d.forEach(function (e) {
              return t(i, e);
            }),
          R && ki(i, h),
          l
        );
      }
      function _(a, s, c, l) {
        if (c == null) throw Error(i(151));
        for (
          var u = null, d = null, h = s, g = (s = 0), _ = null, v = c.next();
          h !== null && !v.done;
          g++, v = c.next()
        ) {
          h.index > g ? ((_ = h), (h = null)) : (_ = h.sibling);
          var y = p(a, h, v.value, l);
          if (y === null) {
            h === null && (h = _);
            break;
          }
          (e && h && y.alternate === null && t(a, h),
            (s = o(y, s, g)),
            d === null ? (u = y) : (d.sibling = y),
            (d = y),
            (h = _));
        }
        if (v.done) return (n(a, h), R && ki(a, g), u);
        if (h === null) {
          for (; !v.done; g++, v = c.next())
            ((v = f(a, v.value, l)),
              v !== null &&
                ((s = o(v, s, g)),
                d === null ? (u = v) : (d.sibling = v),
                (d = v)));
          return (R && ki(a, g), u);
        }
        for (h = r(h); !v.done; g++, v = c.next())
          ((v = m(h, a, g, v.value, l)),
            v !== null &&
              (e &&
                v.alternate !== null &&
                h.delete(v.key === null ? g : v.key),
              (s = o(v, s, g)),
              d === null ? (u = v) : (d.sibling = v),
              (d = v)));
        return (
          e &&
            h.forEach(function (e) {
              return t(a, e);
            }),
          R && ki(a, g),
          u
        );
      }
      function b(e, r, o, c) {
        if (
          (typeof o == `object` &&
            o &&
            o.type === y &&
            o.key === null &&
            (o = o.props.children),
          typeof o == `object` && o)
        ) {
          switch (o.$$typeof) {
            case g:
              a: {
                for (var l = o.key; r !== null; ) {
                  if (r.key === l) {
                    if (((l = o.type), l === y)) {
                      if (r.tag === 7) {
                        (n(e, r.sibling),
                          (c = a(r, o.props.children)),
                          (c.return = e),
                          (e = c));
                        break a;
                      }
                    } else if (
                      r.elementType === l ||
                      (typeof l == `object` &&
                        l &&
                        l.$$typeof === O &&
                        ka(l) === r.type)
                    ) {
                      (n(e, r.sibling),
                        (c = a(r, o.props)),
                        Ia(c, o),
                        (c.return = e),
                        (e = c));
                      break a;
                    }
                    n(e, r);
                    break;
                  } else t(e, r);
                  r = r.sibling;
                }
                o.type === y
                  ? ((c = mi(o.props.children, e.mode, c, o.key)),
                    (c.return = e),
                    (e = c))
                  : ((c = pi(o.type, o.key, o.props, null, e.mode, c)),
                    Ia(c, o),
                    (c.return = e),
                    (e = c));
              }
              return s(e);
            case v:
              a: {
                for (l = o.key; r !== null; ) {
                  if (r.key === l)
                    if (
                      r.tag === 4 &&
                      r.stateNode.containerInfo === o.containerInfo &&
                      r.stateNode.implementation === o.implementation
                    ) {
                      (n(e, r.sibling),
                        (c = a(r, o.children || [])),
                        (c.return = e),
                        (e = c));
                      break a;
                    } else {
                      n(e, r);
                      break;
                    }
                  else t(e, r);
                  r = r.sibling;
                }
                ((c = _i(o, e.mode, c)), (c.return = e), (e = c));
              }
              return s(e);
            case O:
              return ((o = ka(o)), b(e, r, o, c));
          }
          if (te(o)) return h(e, r, o, c);
          if (j(o)) {
            if (((l = j(o)), typeof l != `function`)) throw Error(i(150));
            return ((o = l.call(o)), _(e, r, o, c));
          }
          if (typeof o.then == `function`) return b(e, r, Fa(o), c);
          if (o.$$typeof === C) return b(e, r, ra(e, o), c);
          La(e, o);
        }
        return (typeof o == `string` && o !== ``) ||
          typeof o == `number` ||
          typeof o == `bigint`
          ? ((o = `` + o),
            r !== null && r.tag === 6
              ? (n(e, r.sibling), (c = a(r, o)), (c.return = e), (e = c))
              : (n(e, r), (c = hi(o, e.mode, c)), (c.return = e), (e = c)),
            s(e))
          : n(e, r);
      }
      return function (e, t, n, r) {
        try {
          Pa = 0;
          var i = b(e, t, n, r);
          return ((Na = null), i);
        } catch (t) {
          if (t === Ca || t === Ta) throw t;
          var a = li(29, t, null, e.mode);
          return ((a.lanes = r), (a.return = e), a);
        }
      };
    }
    var za = Ra(!0),
      Ba = Ra(!1),
      Va = !1;
    function Ha(e) {
      e.updateQueue = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null,
      };
    }
    function Ua(e, t) {
      ((e = e.updateQueue),
        t.updateQueue === e &&
          (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null,
          }));
    }
    function Wa(e) {
      return { lane: e, tag: 0, payload: null, callback: null, next: null };
    }
    function Ga(e, t, n) {
      var r = e.updateQueue;
      if (r === null) return null;
      if (((r = r.shared), W & 2)) {
        var i = r.pending;
        return (
          i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
          (r.pending = t),
          (t = oi(e)),
          ai(e, null, n),
          t
        );
      }
      return (ni(e, r, t, n), oi(e));
    }
    function Ka(e, t, n) {
      if (((t = t.updateQueue), t !== null && ((t = t.shared), n & 4194048))) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), et(e, n));
      }
    }
    function qa(e, t) {
      var n = e.updateQueue,
        r = e.alternate;
      if (r !== null && ((r = r.updateQueue), n === r)) {
        var i = null,
          a = null;
        if (((n = n.firstBaseUpdate), n !== null)) {
          do {
            var o = {
              lane: n.lane,
              tag: n.tag,
              payload: n.payload,
              callback: null,
              next: null,
            };
            (a === null ? (i = a = o) : (a = a.next = o), (n = n.next));
          } while (n !== null);
          a === null ? (i = a = t) : (a = a.next = t);
        } else i = a = t;
        ((n = {
          baseState: r.baseState,
          firstBaseUpdate: i,
          lastBaseUpdate: a,
          shared: r.shared,
          callbacks: r.callbacks,
        }),
          (e.updateQueue = n));
        return;
      }
      ((e = n.lastBaseUpdate),
        e === null ? (n.firstBaseUpdate = t) : (e.next = t),
        (n.lastBaseUpdate = t));
    }
    var Ja = !1;
    function Ya() {
      if (Ja) {
        var e = ma;
        if (e !== null) throw e;
      }
    }
    function Xa(e, t, n, r) {
      Ja = !1;
      var i = e.updateQueue;
      Va = !1;
      var a = i.firstBaseUpdate,
        o = i.lastBaseUpdate,
        s = i.shared.pending;
      if (s !== null) {
        i.shared.pending = null;
        var c = s,
          l = c.next;
        ((c.next = null), o === null ? (a = l) : (o.next = l), (o = c));
        var u = e.alternate;
        u !== null &&
          ((u = u.updateQueue),
          (s = u.lastBaseUpdate),
          s !== o &&
            (s === null ? (u.firstBaseUpdate = l) : (s.next = l),
            (u.lastBaseUpdate = c)));
      }
      if (a !== null) {
        var d = i.baseState;
        ((o = 0), (u = l = c = null), (s = a));
        do {
          var p = s.lane & -536870913,
            m = p !== s.lane;
          if (m ? (K & p) === p : (r & p) === p) {
            (p !== 0 && p === pa && (Ja = !0),
              u !== null &&
                (u = u.next =
                  {
                    lane: 0,
                    tag: s.tag,
                    payload: s.payload,
                    callback: null,
                    next: null,
                  }));
            a: {
              var h = e,
                g = s;
              p = t;
              var _ = n;
              switch (g.tag) {
                case 1:
                  if (((h = g.payload), typeof h == `function`)) {
                    d = h.call(_, d, p);
                    break a;
                  }
                  d = h;
                  break a;
                case 3:
                  h.flags = (h.flags & -65537) | 128;
                case 0:
                  if (
                    ((h = g.payload),
                    (p = typeof h == `function` ? h.call(_, d, p) : h),
                    p == null)
                  )
                    break a;
                  d = f({}, d, p);
                  break a;
                case 2:
                  Va = !0;
              }
            }
            ((p = s.callback),
              p !== null &&
                ((e.flags |= 64),
                m && (e.flags |= 8192),
                (m = i.callbacks),
                m === null ? (i.callbacks = [p]) : m.push(p)));
          } else
            ((m = {
              lane: p,
              tag: s.tag,
              payload: s.payload,
              callback: s.callback,
              next: null,
            }),
              u === null ? ((l = u = m), (c = d)) : (u = u.next = m),
              (o |= p));
          if (((s = s.next), s === null)) {
            if (((s = i.shared.pending), s === null)) break;
            ((m = s),
              (s = m.next),
              (m.next = null),
              (i.lastBaseUpdate = m),
              (i.shared.pending = null));
          }
        } while (1);
        (u === null && (c = d),
          (i.baseState = c),
          (i.firstBaseUpdate = l),
          (i.lastBaseUpdate = u),
          a === null && (i.shared.lanes = 0),
          (Jl |= o),
          (e.lanes = o),
          (e.memoizedState = d));
      }
    }
    function Za(e, t) {
      if (typeof e != `function`) throw Error(i(191, e));
      e.call(t);
    }
    function Qa(e, t) {
      var n = e.callbacks;
      if (n !== null)
        for (e.callbacks = null, e = 0; e < n.length; e++) Za(n[e], t);
    }
    var $a = ie(null),
      eo = ie(0);
    function to(e, t) {
      ((e = Kl), L(eo, e), L($a, t), (Kl = e | t.baseLanes));
    }
    function no() {
      (L(eo, Kl), L($a, $a.current));
    }
    function z() {
      ((Kl = eo.current), ae($a), ae(eo));
    }
    var ro = ie(null),
      io = null;
    function ao(e) {
      var t = e.alternate;
      (L(uo, uo.current & 1),
        L(ro, e),
        io === null &&
          (t === null || $a.current !== null || t.memoizedState !== null) &&
          (io = e));
    }
    function oo(e) {
      (L(uo, uo.current), L(ro, e), io === null && (io = e));
    }
    function so(e) {
      e.tag === 22
        ? (L(uo, uo.current), L(ro, e), io === null && (io = e))
        : co(e);
    }
    function co() {
      (L(uo, uo.current), L(ro, ro.current));
    }
    function lo(e) {
      (ae(ro), io === e && (io = null), ae(uo));
    }
    var uo = ie(0);
    function fo(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === 13) {
          var n = t.memoizedState;
          if (n !== null && ((n = n.dehydrated), n === null || cf(n) || lf(n)))
            return t;
        } else if (
          t.tag === 19 &&
          (t.memoizedProps.revealOrder === `forwards` ||
            t.memoizedProps.revealOrder === `backwards` ||
            t.memoizedProps.revealOrder === `unstable_legacy-backwards` ||
            t.memoizedProps.revealOrder === `together`)
        ) {
          if (t.flags & 128) return t;
        } else if (t.child !== null) {
          ((t.child.return = t), (t = t.child));
          continue;
        }
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return null;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
      return null;
    }
    var po = 0,
      B = null,
      V = null,
      mo = null,
      ho = !1,
      go = !1,
      _o = !1,
      H = 0,
      vo = 0,
      yo = null,
      bo = 0;
    function xo() {
      throw Error(i(321));
    }
    function So(e, t) {
      if (t === null) return !1;
      for (var n = 0; n < t.length && n < e.length; n++)
        if (!Cr(e[n], t[n])) return !1;
      return !0;
    }
    function Co(e, t, n, r, i, a) {
      return (
        (po = a),
        (B = t),
        (t.memoizedState = null),
        (t.updateQueue = null),
        (t.lanes = 0),
        (P.H = e === null || e.memoizedState === null ? zs : Bs),
        (_o = !1),
        (a = n(r, i)),
        (_o = !1),
        go && (a = To(t, n, r, i)),
        wo(e),
        a
      );
    }
    function wo(e) {
      P.H = Rs;
      var t = V !== null && V.next !== null;
      if (((po = 0), (mo = V = B = null), (ho = !1), (vo = 0), (yo = null), t))
        throw Error(i(300));
      e === null ||
        rc ||
        ((e = e.dependencies), e !== null && ea(e) && (rc = !0));
    }
    function To(e, t, n, r) {
      B = e;
      var a = 0;
      do {
        if ((go && (yo = null), (vo = 0), (go = !1), 25 <= a))
          throw Error(i(301));
        if (((a += 1), (mo = V = null), e.updateQueue != null)) {
          var o = e.updateQueue;
          ((o.lastEffect = null),
            (o.events = null),
            (o.stores = null),
            o.memoCache != null && (o.memoCache.index = 0));
        }
        ((P.H = Vs), (o = t(n, r)));
      } while (go);
      return o;
    }
    function Eo() {
      var e = P.H,
        t = e.useState()[0];
      return (
        (t = typeof t.then == `function` ? No(t) : t),
        (e = e.useState()[0]),
        (V === null ? null : V.memoizedState) !== e && (B.flags |= 1024),
        t
      );
    }
    function Do() {
      var e = H !== 0;
      return ((H = 0), e);
    }
    function Oo(e, t, n) {
      ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
    }
    function ko(e) {
      if (ho) {
        for (e = e.memoizedState; e !== null; ) {
          var t = e.queue;
          (t !== null && (t.pending = null), (e = e.next));
        }
        ho = !1;
      }
      ((po = 0), (mo = V = B = null), (go = !1), (vo = H = 0), (yo = null));
    }
    function Ao() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
      };
      return (
        mo === null ? (B.memoizedState = mo = e) : (mo = mo.next = e),
        mo
      );
    }
    function jo() {
      if (V === null) {
        var e = B.alternate;
        e = e === null ? null : e.memoizedState;
      } else e = V.next;
      var t = mo === null ? B.memoizedState : mo.next;
      if (t !== null) ((mo = t), (V = e));
      else {
        if (e === null)
          throw B.alternate === null ? Error(i(467)) : Error(i(310));
        ((V = e),
          (e = {
            memoizedState: V.memoizedState,
            baseState: V.baseState,
            baseQueue: V.baseQueue,
            queue: V.queue,
            next: null,
          }),
          mo === null ? (B.memoizedState = mo = e) : (mo = mo.next = e));
      }
      return mo;
    }
    function Mo() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function No(e) {
      var t = vo;
      return (
        (vo += 1),
        yo === null && (yo = []),
        (e = Oa(yo, e, t)),
        (t = B),
        (mo === null ? t.memoizedState : mo.next) === null &&
          ((t = t.alternate),
          (P.H = t === null || t.memoizedState === null ? zs : Bs)),
        e
      );
    }
    function Po(e) {
      if (typeof e == `object` && e) {
        if (typeof e.then == `function`) return No(e);
        if (e.$$typeof === C) return na(e);
      }
      throw Error(i(438, String(e)));
    }
    function Fo(e) {
      var t = null,
        n = B.updateQueue;
      if ((n !== null && (t = n.memoCache), t == null)) {
        var r = B.alternate;
        r !== null &&
          ((r = r.updateQueue),
          r !== null &&
            ((r = r.memoCache),
            r != null &&
              (t = {
                data: r.data.map(function (e) {
                  return e.slice();
                }),
                index: 0,
              })));
      }
      if (
        ((t ??= { data: [], index: 0 }),
        n === null && ((n = Mo()), (B.updateQueue = n)),
        (n.memoCache = t),
        (n = t.data[t.index]),
        n === void 0)
      )
        for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = k;
      return (t.index++, n);
    }
    function Io(e, t) {
      return typeof t == `function` ? t(e) : t;
    }
    function Lo(e) {
      return Ro(jo(), V, e);
    }
    function Ro(e, t, n) {
      var r = e.queue;
      if (r === null) throw Error(i(311));
      r.lastRenderedReducer = n;
      var a = e.baseQueue,
        o = r.pending;
      if (o !== null) {
        if (a !== null) {
          var s = a.next;
          ((a.next = o.next), (o.next = s));
        }
        ((t.baseQueue = a = o), (r.pending = null));
      }
      if (((o = e.baseState), a === null)) e.memoizedState = o;
      else {
        t = a.next;
        var c = (s = null),
          l = null,
          u = t,
          d = !1;
        do {
          var f = u.lane & -536870913;
          if (f === u.lane ? (po & f) === f : (K & f) === f) {
            var p = u.revertLane;
            if (p === 0)
              (l !== null &&
                (l = l.next =
                  {
                    lane: 0,
                    revertLane: 0,
                    gesture: null,
                    action: u.action,
                    hasEagerState: u.hasEagerState,
                    eagerState: u.eagerState,
                    next: null,
                  }),
                f === pa && (d = !0));
            else if ((po & p) === p) {
              ((u = u.next), p === pa && (d = !0));
              continue;
            } else
              ((f = {
                lane: 0,
                revertLane: u.revertLane,
                gesture: null,
                action: u.action,
                hasEagerState: u.hasEagerState,
                eagerState: u.eagerState,
                next: null,
              }),
                l === null ? ((c = l = f), (s = o)) : (l = l.next = f),
                (B.lanes |= p),
                (Jl |= p));
            ((f = u.action),
              _o && n(o, f),
              (o = u.hasEagerState ? u.eagerState : n(o, f)));
          } else
            ((p = {
              lane: f,
              revertLane: u.revertLane,
              gesture: u.gesture,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
              l === null ? ((c = l = p), (s = o)) : (l = l.next = p),
              (B.lanes |= f),
              (Jl |= f));
          u = u.next;
        } while (u !== null && u !== t);
        if (
          (l === null ? (s = o) : (l.next = c),
          !Cr(o, e.memoizedState) && ((rc = !0), d && ((n = ma), n !== null)))
        )
          throw n;
        ((e.memoizedState = o),
          (e.baseState = s),
          (e.baseQueue = l),
          (r.lastRenderedState = o));
      }
      return (a === null && (r.lanes = 0), [e.memoizedState, r.dispatch]);
    }
    function zo(e) {
      var t = jo(),
        n = t.queue;
      if (n === null) throw Error(i(311));
      n.lastRenderedReducer = e;
      var r = n.dispatch,
        a = n.pending,
        o = t.memoizedState;
      if (a !== null) {
        n.pending = null;
        var s = (a = a.next);
        do ((o = e(o, s.action)), (s = s.next));
        while (s !== a);
        (Cr(o, t.memoizedState) || (rc = !0),
          (t.memoizedState = o),
          t.baseQueue === null && (t.baseState = o),
          (n.lastRenderedState = o));
      }
      return [o, r];
    }
    function Bo(e, t, n) {
      var r = B,
        a = jo(),
        o = R;
      if (o) {
        if (n === void 0) throw Error(i(407));
        n = n();
      } else n = t();
      var s = !Cr((V || a).memoizedState, n);
      if (
        (s && ((a.memoizedState = n), (rc = !0)),
        (a = a.queue),
        ds(Uo.bind(null, r, a, e), [e]),
        a.getSnapshot !== t || s || (mo !== null && mo.memoizedState.tag & 1))
      ) {
        if (
          ((r.flags |= 2048),
          os(9, { destroy: void 0 }, Ho.bind(null, r, a, n, t), null),
          Vl === null)
        )
          throw Error(i(349));
        o || po & 127 || Vo(r, t, n);
      }
      return n;
    }
    function Vo(e, t, n) {
      ((e.flags |= 16384),
        (e = { getSnapshot: t, value: n }),
        (t = B.updateQueue),
        t === null
          ? ((t = Mo()), (B.updateQueue = t), (t.stores = [e]))
          : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
    }
    function Ho(e, t, n, r) {
      ((t.value = n), (t.getSnapshot = r), Wo(t) && Go(e));
    }
    function Uo(e, t, n) {
      return n(function () {
        Wo(t) && Go(e);
      });
    }
    function Wo(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !Cr(e, n);
      } catch {
        return !0;
      }
    }
    function Go(e) {
      var t = ii(e, 2);
      t !== null && vu(t, e, 2);
    }
    function Ko(e) {
      var t = Ao();
      if (typeof e == `function`) {
        var n = e;
        if (((e = n()), _o)) {
          Le(!0);
          try {
            n();
          } finally {
            Le(!1);
          }
        }
      }
      return (
        (t.memoizedState = t.baseState = e),
        (t.queue = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Io,
          lastRenderedState: e,
        }),
        t
      );
    }
    function qo(e, t, n, r) {
      return ((e.baseState = n), Ro(e, V, typeof r == `function` ? r : Io));
    }
    function Jo(e, t, n, r, a) {
      if (Is(e)) throw Error(i(485));
      if (((e = t.action), e !== null)) {
        var o = {
          payload: a,
          action: e,
          next: null,
          isTransition: !0,
          status: `pending`,
          value: null,
          reason: null,
          listeners: [],
          then: function (e) {
            o.listeners.push(e);
          },
        };
        (P.T === null ? (o.isTransition = !1) : n(!0),
          r(o),
          (n = t.pending),
          n === null
            ? ((o.next = t.pending = o), Yo(t, o))
            : ((o.next = n.next), (t.pending = n.next = o)));
      }
    }
    function Yo(e, t) {
      var n = t.action,
        r = t.payload,
        i = e.state;
      if (t.isTransition) {
        var a = P.T,
          o = {};
        P.T = o;
        try {
          var s = n(i, r),
            c = P.S;
          (c !== null && c(o, s), Xo(e, t, s));
        } catch (n) {
          Qo(e, t, n);
        } finally {
          (a !== null && o.types !== null && (a.types = o.types), (P.T = a));
        }
      } else
        try {
          ((a = n(i, r)), Xo(e, t, a));
        } catch (n) {
          Qo(e, t, n);
        }
    }
    function Xo(e, t, n) {
      typeof n == `object` && n && typeof n.then == `function`
        ? n.then(
            function (n) {
              Zo(e, t, n);
            },
            function (n) {
              return Qo(e, t, n);
            },
          )
        : Zo(e, t, n);
    }
    function Zo(e, t, n) {
      ((t.status = `fulfilled`),
        (t.value = n),
        $o(t),
        (e.state = n),
        (t = e.pending),
        t !== null &&
          ((n = t.next),
          n === t
            ? (e.pending = null)
            : ((n = n.next), (t.next = n), Yo(e, n))));
    }
    function Qo(e, t, n) {
      var r = e.pending;
      if (((e.pending = null), r !== null)) {
        r = r.next;
        do ((t.status = `rejected`), (t.reason = n), $o(t), (t = t.next));
        while (t !== r);
      }
      e.action = null;
    }
    function $o(e) {
      e = e.listeners;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
    function es(e, t) {
      return t;
    }
    function ts(e, t) {
      if (R) {
        var n = Vl.formState;
        if (n !== null) {
          a: {
            var r = B;
            if (R) {
              if (Fi) {
                b: {
                  for (var i = Fi, a = Li; i.nodeType !== 8; ) {
                    if (!a) {
                      i = null;
                      break b;
                    }
                    if (((i = df(i.nextSibling)), i === null)) {
                      i = null;
                      break b;
                    }
                  }
                  ((a = i.data), (i = a === `F!` || a === `F` ? i : null));
                }
                if (i) {
                  ((Fi = df(i.nextSibling)), (r = i.data === `F!`));
                  break a;
                }
              }
              zi(r);
            }
            r = !1;
          }
          r && (t = n[0]);
        }
      }
      return (
        (n = Ao()),
        (n.memoizedState = n.baseState = t),
        (r = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: es,
          lastRenderedState: t,
        }),
        (n.queue = r),
        (n = Ns.bind(null, B, r)),
        (r.dispatch = n),
        (r = Ko(!1)),
        (a = Fs.bind(null, B, !1, r.queue)),
        (r = Ao()),
        (i = { state: t, dispatch: null, action: e, pending: null }),
        (r.queue = i),
        (n = Jo.bind(null, B, i, a, n)),
        (i.dispatch = n),
        (r.memoizedState = e),
        [t, n, !1]
      );
    }
    function ns(e) {
      return rs(jo(), V, e);
    }
    function rs(e, t, n) {
      if (
        ((t = Ro(e, t, es)[0]),
        (e = Lo(Io)[0]),
        typeof t == `object` && t && typeof t.then == `function`)
      )
        try {
          var r = No(t);
        } catch (e) {
          throw e === Ca ? Ta : e;
        }
      else r = t;
      t = jo();
      var i = t.queue,
        a = i.dispatch;
      return (
        n !== t.memoizedState &&
          ((B.flags |= 2048),
          os(9, { destroy: void 0 }, is.bind(null, i, n), null)),
        [r, a, e]
      );
    }
    function is(e, t) {
      e.action = t;
    }
    function as(e) {
      var t = jo(),
        n = V;
      if (n !== null) return rs(t, n, e);
      (jo(), (t = t.memoizedState), (n = jo()));
      var r = n.queue.dispatch;
      return ((n.memoizedState = e), [t, r, !1]);
    }
    function os(e, t, n, r) {
      return (
        (e = { tag: e, create: n, deps: r, inst: t, next: null }),
        (t = B.updateQueue),
        t === null && ((t = Mo()), (B.updateQueue = t)),
        (n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
        e
      );
    }
    function ss() {
      return jo().memoizedState;
    }
    function cs(e, t, n, r) {
      var i = Ao();
      ((B.flags |= e),
        (i.memoizedState = os(
          1 | t,
          { destroy: void 0 },
          n,
          r === void 0 ? null : r,
        )));
    }
    function ls(e, t, n, r) {
      var i = jo();
      r = r === void 0 ? null : r;
      var a = i.memoizedState.inst;
      V !== null && r !== null && So(r, V.memoizedState.deps)
        ? (i.memoizedState = os(t, a, n, r))
        : ((B.flags |= e), (i.memoizedState = os(1 | t, a, n, r)));
    }
    function us(e, t) {
      cs(8390656, 8, e, t);
    }
    function ds(e, t) {
      ls(2048, 8, e, t);
    }
    function fs(e) {
      B.flags |= 4;
      var t = B.updateQueue;
      if (t === null) ((t = Mo()), (B.updateQueue = t), (t.events = [e]));
      else {
        var n = t.events;
        n === null ? (t.events = [e]) : n.push(e);
      }
    }
    function ps(e) {
      var t = jo().memoizedState;
      return (
        fs({ ref: t, nextImpl: e }),
        function () {
          if (W & 2) throw Error(i(440));
          return t.impl.apply(void 0, arguments);
        }
      );
    }
    function ms(e, t) {
      return ls(4, 2, e, t);
    }
    function hs(e, t) {
      return ls(4, 4, e, t);
    }
    function gs(e, t) {
      if (typeof t == `function`) {
        e = e();
        var n = t(e);
        return function () {
          typeof n == `function` ? n() : t(null);
        };
      }
      if (t != null)
        return (
          (e = e()),
          (t.current = e),
          function () {
            t.current = null;
          }
        );
    }
    function _s(e, t, n) {
      ((n = n == null ? null : n.concat([e])),
        ls(4, 4, gs.bind(null, t, e), n));
    }
    function vs() {}
    function ys(e, t) {
      var n = jo();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      return t !== null && So(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
    }
    function bs(e, t) {
      var n = jo();
      t = t === void 0 ? null : t;
      var r = n.memoizedState;
      if (t !== null && So(t, r[1])) return r[0];
      if (((r = e()), _o)) {
        Le(!0);
        try {
          e();
        } finally {
          Le(!1);
        }
      }
      return ((n.memoizedState = [r, t]), r);
    }
    function xs(e, t, n) {
      return n === void 0 || (po & 1073741824 && !(K & 261930))
        ? (e.memoizedState = t)
        : ((e.memoizedState = n), (e = _u()), (B.lanes |= e), (Jl |= e), n);
    }
    function Ss(e, t, n, r) {
      return Cr(n, t)
        ? n
        : $a.current === null
          ? !(po & 42) || (po & 1073741824 && !(K & 261930))
            ? ((rc = !0), (e.memoizedState = n))
            : ((e = _u()), (B.lanes |= e), (Jl |= e), t)
          : ((e = xs(e, n, r)), Cr(e, t) || (rc = !0), e);
    }
    function Cs(e, t, n, r, i) {
      var a = F.p;
      F.p = a !== 0 && 8 > a ? a : 8;
      var o = P.T,
        s = {};
      ((P.T = s), Fs(e, !1, t, n));
      try {
        var c = i(),
          l = P.S;
        (l !== null && l(s, c),
          typeof c == `object` && c && typeof c.then == `function`
            ? Ps(e, t, _a(c, r), gu(e))
            : Ps(e, t, r, gu(e)));
      } catch (n) {
        Ps(e, t, { then: function () {}, status: `rejected`, reason: n }, gu());
      } finally {
        ((F.p = a),
          o !== null && s.types !== null && (o.types = s.types),
          (P.T = o));
      }
    }
    function ws() {}
    function Ts(e, t, n, r) {
      if (e.tag !== 5) throw Error(i(476));
      var a = Es(e).queue;
      Cs(
        e,
        a,
        t,
        ne,
        n === null
          ? ws
          : function () {
              return (Ds(e), n(r));
            },
      );
    }
    function Es(e) {
      var t = e.memoizedState;
      if (t !== null) return t;
      t = {
        memoizedState: ne,
        baseState: ne,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Io,
          lastRenderedState: ne,
        },
        next: null,
      };
      var n = {};
      return (
        (t.next = {
          memoizedState: n,
          baseState: n,
          baseQueue: null,
          queue: {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Io,
            lastRenderedState: n,
          },
          next: null,
        }),
        (e.memoizedState = t),
        (e = e.alternate),
        e !== null && (e.memoizedState = t),
        t
      );
    }
    function Ds(e) {
      var t = Es(e);
      (t.next === null && (t = e.alternate.memoizedState),
        Ps(e, t.next.queue, {}, gu()));
    }
    function Os() {
      return na(tp);
    }
    function ks() {
      return jo().memoizedState;
    }
    function As() {
      return jo().memoizedState;
    }
    function js(e) {
      for (var t = e.return; t !== null; ) {
        switch (t.tag) {
          case 24:
          case 3:
            var n = gu();
            e = Wa(n);
            var r = Ga(t, e, n);
            (r !== null && (vu(r, t, n), Ka(r, t, n)),
              (t = { cache: la() }),
              (e.payload = t));
            return;
        }
        t = t.return;
      }
    }
    function Ms(e, t, n) {
      var r = gu();
      ((n = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
        Is(e)
          ? Ls(t, n)
          : ((n = ri(e, t, n, r)), n !== null && (vu(n, e, r), U(n, t, r))));
    }
    function Ns(e, t, n) {
      Ps(e, t, n, gu());
    }
    function Ps(e, t, n, r) {
      var i = {
        lane: r,
        revertLane: 0,
        gesture: null,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
      if (Is(e)) Ls(t, i);
      else {
        var a = e.alternate;
        if (
          e.lanes === 0 &&
          (a === null || a.lanes === 0) &&
          ((a = t.lastRenderedReducer), a !== null)
        )
          try {
            var o = t.lastRenderedState,
              s = a(o, n);
            if (((i.hasEagerState = !0), (i.eagerState = s), Cr(s, o)))
              return (ni(e, t, i, 0), Vl === null && ti(), !1);
          } catch {}
        if (((n = ri(e, t, i, r)), n !== null))
          return (vu(n, e, r), U(n, t, r), !0);
      }
      return !1;
    }
    function Fs(e, t, n, r) {
      if (
        ((r = {
          lane: 2,
          revertLane: md(),
          gesture: null,
          action: r,
          hasEagerState: !1,
          eagerState: null,
          next: null,
        }),
        Is(e))
      ) {
        if (t) throw Error(i(479));
      } else ((t = ri(e, n, r, 2)), t !== null && vu(t, e, 2));
    }
    function Is(e) {
      var t = e.alternate;
      return e === B || (t !== null && t === B);
    }
    function Ls(e, t) {
      go = ho = !0;
      var n = e.pending;
      (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
        (e.pending = t));
    }
    function U(e, t, n) {
      if (n & 4194048) {
        var r = t.lanes;
        ((r &= e.pendingLanes), (n |= r), (t.lanes = n), et(e, n));
      }
    }
    var Rs = {
      readContext: na,
      use: Po,
      useCallback: xo,
      useContext: xo,
      useEffect: xo,
      useImperativeHandle: xo,
      useLayoutEffect: xo,
      useInsertionEffect: xo,
      useMemo: xo,
      useReducer: xo,
      useRef: xo,
      useState: xo,
      useDebugValue: xo,
      useDeferredValue: xo,
      useTransition: xo,
      useSyncExternalStore: xo,
      useId: xo,
      useHostTransitionStatus: xo,
      useFormState: xo,
      useActionState: xo,
      useOptimistic: xo,
      useMemoCache: xo,
      useCacheRefresh: xo,
    };
    Rs.useEffectEvent = xo;
    var zs = {
        readContext: na,
        use: Po,
        useCallback: function (e, t) {
          return ((Ao().memoizedState = [e, t === void 0 ? null : t]), e);
        },
        useContext: na,
        useEffect: us,
        useImperativeHandle: function (e, t, n) {
          ((n = n == null ? null : n.concat([e])),
            cs(4194308, 4, gs.bind(null, t, e), n));
        },
        useLayoutEffect: function (e, t) {
          return cs(4194308, 4, e, t);
        },
        useInsertionEffect: function (e, t) {
          cs(4, 2, e, t);
        },
        useMemo: function (e, t) {
          var n = Ao();
          t = t === void 0 ? null : t;
          var r = e();
          if (_o) {
            Le(!0);
            try {
              e();
            } finally {
              Le(!1);
            }
          }
          return ((n.memoizedState = [r, t]), r);
        },
        useReducer: function (e, t, n) {
          var r = Ao();
          if (n !== void 0) {
            var i = n(t);
            if (_o) {
              Le(!0);
              try {
                n(t);
              } finally {
                Le(!1);
              }
            }
          } else i = t;
          return (
            (r.memoizedState = r.baseState = i),
            (e = {
              pending: null,
              lanes: 0,
              dispatch: null,
              lastRenderedReducer: e,
              lastRenderedState: i,
            }),
            (r.queue = e),
            (e = e.dispatch = Ms.bind(null, B, e)),
            [r.memoizedState, e]
          );
        },
        useRef: function (e) {
          var t = Ao();
          return ((e = { current: e }), (t.memoizedState = e));
        },
        useState: function (e) {
          e = Ko(e);
          var t = e.queue,
            n = Ns.bind(null, B, t);
          return ((t.dispatch = n), [e.memoizedState, n]);
        },
        useDebugValue: vs,
        useDeferredValue: function (e, t) {
          return xs(Ao(), e, t);
        },
        useTransition: function () {
          var e = Ko(!1);
          return (
            (e = Cs.bind(null, B, e.queue, !0, !1)),
            (Ao().memoizedState = e),
            [!1, e]
          );
        },
        useSyncExternalStore: function (e, t, n) {
          var r = B,
            a = Ao();
          if (R) {
            if (n === void 0) throw Error(i(407));
            n = n();
          } else {
            if (((n = t()), Vl === null)) throw Error(i(349));
            K & 127 || Vo(r, t, n);
          }
          a.memoizedState = n;
          var o = { value: n, getSnapshot: t };
          return (
            (a.queue = o),
            us(Uo.bind(null, r, o, e), [e]),
            (r.flags |= 2048),
            os(9, { destroy: void 0 }, Ho.bind(null, r, o, n, t), null),
            n
          );
        },
        useId: function () {
          var e = Ao(),
            t = Vl.identifierPrefix;
          if (R) {
            var n = Oi,
              r = Di;
            ((n = (r & ~(1 << (32 - Re(r) - 1))).toString(32) + n),
              (t = `_` + t + `R_` + n),
              (n = H++),
              0 < n && (t += `H` + n.toString(32)),
              (t += `_`));
          } else ((n = bo++), (t = `_` + t + `r_` + n.toString(32) + `_`));
          return (e.memoizedState = t);
        },
        useHostTransitionStatus: Os,
        useFormState: ts,
        useActionState: ts,
        useOptimistic: function (e) {
          var t = Ao();
          t.memoizedState = t.baseState = e;
          var n = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: null,
            lastRenderedState: null,
          };
          return (
            (t.queue = n),
            (t = Fs.bind(null, B, !0, n)),
            (n.dispatch = t),
            [e, t]
          );
        },
        useMemoCache: Fo,
        useCacheRefresh: function () {
          return (Ao().memoizedState = js.bind(null, B));
        },
        useEffectEvent: function (e) {
          var t = Ao(),
            n = { impl: e };
          return (
            (t.memoizedState = n),
            function () {
              if (W & 2) throw Error(i(440));
              return n.impl.apply(void 0, arguments);
            }
          );
        },
      },
      Bs = {
        readContext: na,
        use: Po,
        useCallback: ys,
        useContext: na,
        useEffect: ds,
        useImperativeHandle: _s,
        useInsertionEffect: ms,
        useLayoutEffect: hs,
        useMemo: bs,
        useReducer: Lo,
        useRef: ss,
        useState: function () {
          return Lo(Io);
        },
        useDebugValue: vs,
        useDeferredValue: function (e, t) {
          return Ss(jo(), V.memoizedState, e, t);
        },
        useTransition: function () {
          var e = Lo(Io)[0],
            t = jo().memoizedState;
          return [typeof e == `boolean` ? e : No(e), t];
        },
        useSyncExternalStore: Bo,
        useId: ks,
        useHostTransitionStatus: Os,
        useFormState: ns,
        useActionState: ns,
        useOptimistic: function (e, t) {
          return qo(jo(), V, e, t);
        },
        useMemoCache: Fo,
        useCacheRefresh: As,
      };
    Bs.useEffectEvent = ps;
    var Vs = {
      readContext: na,
      use: Po,
      useCallback: ys,
      useContext: na,
      useEffect: ds,
      useImperativeHandle: _s,
      useInsertionEffect: ms,
      useLayoutEffect: hs,
      useMemo: bs,
      useReducer: zo,
      useRef: ss,
      useState: function () {
        return zo(Io);
      },
      useDebugValue: vs,
      useDeferredValue: function (e, t) {
        var n = jo();
        return V === null ? xs(n, e, t) : Ss(n, V.memoizedState, e, t);
      },
      useTransition: function () {
        var e = zo(Io)[0],
          t = jo().memoizedState;
        return [typeof e == `boolean` ? e : No(e), t];
      },
      useSyncExternalStore: Bo,
      useId: ks,
      useHostTransitionStatus: Os,
      useFormState: as,
      useActionState: as,
      useOptimistic: function (e, t) {
        var n = jo();
        return V === null
          ? ((n.baseState = e), [e, n.queue.dispatch])
          : qo(n, V, e, t);
      },
      useMemoCache: Fo,
      useCacheRefresh: As,
    };
    Vs.useEffectEvent = ps;
    function Hs(e, t, n, r) {
      ((t = e.memoizedState),
        (n = n(r, t)),
        (n = n == null ? t : f({}, t, n)),
        (e.memoizedState = n),
        e.lanes === 0 && (e.updateQueue.baseState = n));
    }
    var Us = {
      enqueueSetState: function (e, t, n) {
        e = e._reactInternals;
        var r = gu(),
          i = Wa(r);
        ((i.payload = t),
          n != null && (i.callback = n),
          (t = Ga(e, i, r)),
          t !== null && (vu(t, e, r), Ka(t, e, r)));
      },
      enqueueReplaceState: function (e, t, n) {
        e = e._reactInternals;
        var r = gu(),
          i = Wa(r);
        ((i.tag = 1),
          (i.payload = t),
          n != null && (i.callback = n),
          (t = Ga(e, i, r)),
          t !== null && (vu(t, e, r), Ka(t, e, r)));
      },
      enqueueForceUpdate: function (e, t) {
        e = e._reactInternals;
        var n = gu(),
          r = Wa(n);
        ((r.tag = 2),
          t != null && (r.callback = t),
          (t = Ga(e, r, n)),
          t !== null && (vu(t, e, n), Ka(t, e, n)));
      },
    };
    function Ws(e, t, n, r, i, a, o) {
      return (
        (e = e.stateNode),
        typeof e.shouldComponentUpdate == `function`
          ? e.shouldComponentUpdate(r, a, o)
          : t.prototype && t.prototype.isPureReactComponent
            ? !wr(n, r) || !wr(i, a)
            : !0
      );
    }
    function Gs(e, t, n, r) {
      ((e = t.state),
        typeof t.componentWillReceiveProps == `function` &&
          t.componentWillReceiveProps(n, r),
        typeof t.UNSAFE_componentWillReceiveProps == `function` &&
          t.UNSAFE_componentWillReceiveProps(n, r),
        t.state !== e && Us.enqueueReplaceState(t, t.state, null));
    }
    function Ks(e, t) {
      var n = t;
      if (`ref` in t) for (var r in ((n = {}), t)) r !== `ref` && (n[r] = t[r]);
      if ((e = e.defaultProps))
        for (var i in (n === t && (n = f({}, n)), e))
          n[i] === void 0 && (n[i] = e[i]);
      return n;
    }
    function qs(e) {
      Zr(e);
    }
    function Js(e) {
      console.error(e);
    }
    function Ys(e) {
      Zr(e);
    }
    function Xs(e, t) {
      try {
        var n = e.onUncaughtError;
        n(t.value, { componentStack: t.stack });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function Zs(e, t, n) {
      try {
        var r = e.onCaughtError;
        r(n.value, {
          componentStack: n.stack,
          errorBoundary: t.tag === 1 ? t.stateNode : null,
        });
      } catch (e) {
        setTimeout(function () {
          throw e;
        });
      }
    }
    function Qs(e, t, n) {
      return (
        (n = Wa(n)),
        (n.tag = 3),
        (n.payload = { element: null }),
        (n.callback = function () {
          Xs(e, t);
        }),
        n
      );
    }
    function $s(e) {
      return ((e = Wa(e)), (e.tag = 3), e);
    }
    function ec(e, t, n, r) {
      var i = n.type.getDerivedStateFromError;
      if (typeof i == `function`) {
        var a = r.value;
        ((e.payload = function () {
          return i(a);
        }),
          (e.callback = function () {
            Zs(t, n, r);
          }));
      }
      var o = n.stateNode;
      o !== null &&
        typeof o.componentDidCatch == `function` &&
        (e.callback = function () {
          (Zs(t, n, r),
            typeof i != `function` &&
              (ou === null ? (ou = new Set([this])) : ou.add(this)));
          var e = r.stack;
          this.componentDidCatch(r.value, {
            componentStack: e === null ? `` : e,
          });
        });
    }
    function tc(e, t, n, r, a) {
      if (
        ((n.flags |= 32768),
        typeof r == `object` && r && typeof r.then == `function`)
      ) {
        if (
          ((t = n.alternate),
          t !== null && $i(t, n, a, !0),
          (n = ro.current),
          n !== null)
        ) {
          switch (n.tag) {
            case 31:
            case 13:
              return (
                io === null
                  ? Au()
                  : n.alternate === null && ql === 0 && (ql = 3),
                (n.flags &= -257),
                (n.flags |= 65536),
                (n.lanes = a),
                r === Ea
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null ? (n.updateQueue = new Set([r])) : t.add(r),
                    Ju(e, r, a)),
                !1
              );
            case 22:
              return (
                (n.flags |= 65536),
                r === Ea
                  ? (n.flags |= 16384)
                  : ((t = n.updateQueue),
                    t === null
                      ? ((t = {
                          transitions: null,
                          markerInstances: null,
                          retryQueue: new Set([r]),
                        }),
                        (n.updateQueue = t))
                      : ((n = t.retryQueue),
                        n === null ? (t.retryQueue = new Set([r])) : n.add(r)),
                    Ju(e, r, a)),
                !1
              );
          }
          throw Error(i(435, n.tag));
        }
        return (Ju(e, r, a), Au(), !1);
      }
      if (R)
        return (
          (t = ro.current),
          t === null
            ? (r !== Ri && ((t = Error(i(423), { cause: r })), Gi(yi(t, n))),
              (e = e.current.alternate),
              (e.flags |= 65536),
              (a &= -a),
              (e.lanes |= a),
              (r = yi(r, n)),
              (a = Qs(e.stateNode, r, a)),
              qa(e, a),
              ql !== 4 && (ql = 2))
            : (!(t.flags & 65536) && (t.flags |= 256),
              (t.flags |= 65536),
              (t.lanes = a),
              r !== Ri && ((e = Error(i(422), { cause: r })), Gi(yi(e, n)))),
          !1
        );
      var o = Error(i(520), { cause: r });
      if (
        ((o = yi(o, n)),
        $l === null ? ($l = [o]) : $l.push(o),
        ql !== 4 && (ql = 2),
        t === null)
      )
        return !0;
      ((r = yi(r, n)), (n = t));
      do {
        switch (n.tag) {
          case 3:
            return (
              (n.flags |= 65536),
              (e = a & -a),
              (n.lanes |= e),
              (e = Qs(n.stateNode, r, e)),
              qa(n, e),
              !1
            );
          case 1:
            if (
              ((t = n.type),
              (o = n.stateNode),
              !(n.flags & 128) &&
                (typeof t.getDerivedStateFromError == `function` ||
                  (o !== null &&
                    typeof o.componentDidCatch == `function` &&
                    (ou === null || !ou.has(o)))))
            )
              return (
                (n.flags |= 65536),
                (a &= -a),
                (n.lanes |= a),
                (a = $s(a)),
                ec(a, e, n, r),
                qa(n, a),
                !1
              );
        }
        n = n.return;
      } while (n !== null);
      return !1;
    }
    var nc = Error(i(461)),
      rc = !1;
    function ic(e, t, n, r) {
      t.child = e === null ? Ba(t, null, n, r) : za(t, e.child, n, r);
    }
    function ac(e, t, n, r, i) {
      n = n.render;
      var a = t.ref;
      if (`ref` in r) {
        var o = {};
        for (var s in r) s !== `ref` && (o[s] = r[s]);
      } else o = r;
      return (
        ta(t),
        (r = Co(e, t, n, o, a, i)),
        (s = Do()),
        e !== null && !rc
          ? (Oo(e, t, i), kc(e, t, i))
          : (R && s && ji(t), (t.flags |= 1), ic(e, t, r, i), t.child)
      );
    }
    function oc(e, t, n, r, i) {
      if (e === null) {
        var a = n.type;
        return typeof a == `function` &&
          !ui(a) &&
          a.defaultProps === void 0 &&
          n.compare === null
          ? ((t.tag = 15), (t.type = a), sc(e, t, a, r, i))
          : ((e = pi(n.type, null, r, t, t.mode, i)),
            (e.ref = t.ref),
            (e.return = t),
            (t.child = e));
      }
      if (((a = e.child), !Ac(e, i))) {
        var o = a.memoizedProps;
        if (
          ((n = n.compare),
          (n = n === null ? wr : n),
          n(o, r) && e.ref === t.ref)
        )
          return kc(e, t, i);
      }
      return (
        (t.flags |= 1),
        (e = di(a, r)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e)
      );
    }
    function sc(e, t, n, r, i) {
      if (e !== null) {
        var a = e.memoizedProps;
        if (wr(a, r) && e.ref === t.ref)
          if (((rc = !1), (t.pendingProps = r = a), Ac(e, i)))
            e.flags & 131072 && (rc = !0);
          else return ((t.lanes = e.lanes), kc(e, t, i));
      }
      return hc(e, t, n, r, i);
    }
    function cc(e, t, n, r) {
      var i = r.children,
        a = e === null ? null : e.memoizedState;
      if (
        (e === null &&
          t.stateNode === null &&
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        r.mode === `hidden`)
      ) {
        if (t.flags & 128) {
          if (((a = a === null ? n : a.baseLanes | n), e !== null)) {
            for (r = t.child = e.child, i = 0; r !== null; )
              ((i = i | r.lanes | r.childLanes), (r = r.sibling));
            r = i & ~a;
          } else ((r = 0), (t.child = null));
          return uc(e, t, a, n, r);
        }
        if (n & 536870912)
          ((t.memoizedState = { baseLanes: 0, cachePool: null }),
            e !== null && xa(t, a === null ? null : a.cachePool),
            a === null ? no() : to(t, a),
            so(t));
        else
          return (
            (r = t.lanes = 536870912),
            uc(e, t, a === null ? n : a.baseLanes | n, n, r)
          );
      } else
        a === null
          ? (e !== null && xa(t, null), no(), co(t))
          : (xa(t, a.cachePool), to(t, a), co(t), (t.memoizedState = null));
      return (ic(e, t, i, n), t.child);
    }
    function lc(e, t) {
      return (
        (e !== null && e.tag === 22) ||
          t.stateNode !== null ||
          (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null,
          }),
        t.sibling
      );
    }
    function uc(e, t, n, r, i) {
      var a = ba();
      return (
        (a = a === null ? null : { parent: ca._currentValue, pool: a }),
        (t.memoizedState = { baseLanes: n, cachePool: a }),
        e !== null && xa(t, null),
        no(),
        so(t),
        e !== null && $i(e, t, r, !0),
        (t.childLanes = i),
        null
      );
    }
    function dc(e, t) {
      return (
        (t = wc({ mode: t.mode, children: t.children }, e.mode)),
        (t.ref = e.ref),
        (e.child = t),
        (t.return = e),
        t
      );
    }
    function fc(e, t, n) {
      return (
        za(t, e.child, null, n),
        (e = dc(t, t.pendingProps)),
        (e.flags |= 2),
        lo(t),
        (t.memoizedState = null),
        e
      );
    }
    function pc(e, t, n) {
      var r = t.pendingProps,
        a = (t.flags & 128) != 0;
      if (((t.flags &= -129), e === null)) {
        if (R) {
          if (r.mode === `hidden`)
            return ((e = dc(t, r)), (t.lanes = 536870912), lc(null, e));
          if (
            (oo(t),
            (e = Fi)
              ? ((e = sf(e, Li)),
                (e = e !== null && e.data === `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Ei === null ? null : { id: Di, overflow: Oi },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = gi(e)),
                  (n.return = t),
                  (t.child = n),
                  (Pi = t),
                  (Fi = null)))
              : (e = null),
            e === null)
          )
            throw zi(t);
          return ((t.lanes = 536870912), null);
        }
        return dc(t, r);
      }
      var o = e.memoizedState;
      if (o !== null) {
        var s = o.dehydrated;
        if ((oo(t), a))
          if (t.flags & 256) ((t.flags &= -257), (t = fc(e, t, n)));
          else if (t.memoizedState !== null)
            ((t.child = e.child), (t.flags |= 128), (t = null));
          else throw Error(i(558));
        else if (
          (rc || $i(e, t, n, !1), (a = (n & e.childLanes) !== 0), rc || a)
        ) {
          if (
            ((r = Vl),
            r !== null && ((s = tt(r, n)), s !== 0 && s !== o.retryLane))
          )
            throw ((o.retryLane = s), ii(e, s), vu(r, e, s), nc);
          (Au(), (t = fc(e, t, n)));
        } else
          ((e = o.treeContext),
            (Fi = df(s.nextSibling)),
            (Pi = t),
            (R = !0),
            (Ii = null),
            (Li = !1),
            e !== null && Ni(t, e),
            (t = dc(t, r)),
            (t.flags |= 4096));
        return t;
      }
      return (
        (e = di(e.child, { mode: r.mode, children: r.children })),
        (e.ref = t.ref),
        (t.child = e),
        (e.return = t),
        e
      );
    }
    function mc(e, t) {
      var n = t.ref;
      if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
      else {
        if (typeof n != `function` && typeof n != `object`) throw Error(i(284));
        (e === null || e.ref !== n) && (t.flags |= 4194816);
      }
    }
    function hc(e, t, n, r, i) {
      return (
        ta(t),
        (n = Co(e, t, n, r, void 0, i)),
        (r = Do()),
        e !== null && !rc
          ? (Oo(e, t, i), kc(e, t, i))
          : (R && r && ji(t), (t.flags |= 1), ic(e, t, n, i), t.child)
      );
    }
    function gc(e, t, n, r, i, a) {
      return (
        ta(t),
        (t.updateQueue = null),
        (n = To(t, r, n, i)),
        wo(e),
        (r = Do()),
        e !== null && !rc
          ? (Oo(e, t, a), kc(e, t, a))
          : (R && r && ji(t), (t.flags |= 1), ic(e, t, n, a), t.child)
      );
    }
    function _c(e, t, n, r, i) {
      if ((ta(t), t.stateNode === null)) {
        var a = si,
          o = n.contextType;
        (typeof o == `object` && o && (a = na(o)),
          (a = new n(r, a)),
          (t.memoizedState =
            a.state !== null && a.state !== void 0 ? a.state : null),
          (a.updater = Us),
          (t.stateNode = a),
          (a._reactInternals = t),
          (a = t.stateNode),
          (a.props = r),
          (a.state = t.memoizedState),
          (a.refs = {}),
          Ha(t),
          (o = n.contextType),
          (a.context = typeof o == `object` && o ? na(o) : si),
          (a.state = t.memoizedState),
          (o = n.getDerivedStateFromProps),
          typeof o == `function` &&
            (Hs(t, n, o, r), (a.state = t.memoizedState)),
          typeof n.getDerivedStateFromProps == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function` ||
            (typeof a.UNSAFE_componentWillMount != `function` &&
              typeof a.componentWillMount != `function`) ||
            ((o = a.state),
            typeof a.componentWillMount == `function` && a.componentWillMount(),
            typeof a.UNSAFE_componentWillMount == `function` &&
              a.UNSAFE_componentWillMount(),
            o !== a.state && Us.enqueueReplaceState(a, a.state, null),
            Xa(t, r, a, i),
            Ya(),
            (a.state = t.memoizedState)),
          typeof a.componentDidMount == `function` && (t.flags |= 4194308),
          (r = !0));
      } else if (e === null) {
        a = t.stateNode;
        var s = t.memoizedProps,
          c = Ks(n, s);
        a.props = c;
        var l = a.context,
          u = n.contextType;
        ((o = si), typeof u == `object` && u && (o = na(u)));
        var d = n.getDerivedStateFromProps;
        ((u =
          typeof d == `function` ||
          typeof a.getSnapshotBeforeUpdate == `function`),
          (s = t.pendingProps !== s),
          u ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((s || l !== o) && Gs(t, a, r, o)),
          (Va = !1));
        var f = t.memoizedState;
        ((a.state = f),
          Xa(t, r, a, i),
          Ya(),
          (l = t.memoizedState),
          s || f !== l || Va
            ? (typeof d == `function` &&
                (Hs(t, n, d, r), (l = t.memoizedState)),
              (c = Va || Ws(t, n, c, r, f, l, o))
                ? (u ||
                    (typeof a.UNSAFE_componentWillMount != `function` &&
                      typeof a.componentWillMount != `function`) ||
                    (typeof a.componentWillMount == `function` &&
                      a.componentWillMount(),
                    typeof a.UNSAFE_componentWillMount == `function` &&
                      a.UNSAFE_componentWillMount()),
                  typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308))
                : (typeof a.componentDidMount == `function` &&
                    (t.flags |= 4194308),
                  (t.memoizedProps = r),
                  (t.memoizedState = l)),
              (a.props = r),
              (a.state = l),
              (a.context = o),
              (r = c))
            : (typeof a.componentDidMount == `function` && (t.flags |= 4194308),
              (r = !1)));
      } else {
        ((a = t.stateNode),
          Ua(e, t),
          (o = t.memoizedProps),
          (u = Ks(n, o)),
          (a.props = u),
          (d = t.pendingProps),
          (f = a.context),
          (l = n.contextType),
          (c = si),
          typeof l == `object` && l && (c = na(l)),
          (s = n.getDerivedStateFromProps),
          (l =
            typeof s == `function` ||
            typeof a.getSnapshotBeforeUpdate == `function`) ||
            (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
              typeof a.componentWillReceiveProps != `function`) ||
            ((o !== d || f !== c) && Gs(t, a, r, c)),
          (Va = !1),
          (f = t.memoizedState),
          (a.state = f),
          Xa(t, r, a, i),
          Ya());
        var p = t.memoizedState;
        o !== d ||
        f !== p ||
        Va ||
        (e !== null && e.dependencies !== null && ea(e.dependencies))
          ? (typeof s == `function` && (Hs(t, n, s, r), (p = t.memoizedState)),
            (u =
              Va ||
              Ws(t, n, u, r, f, p, c) ||
              (e !== null && e.dependencies !== null && ea(e.dependencies)))
              ? (l ||
                  (typeof a.UNSAFE_componentWillUpdate != `function` &&
                    typeof a.componentWillUpdate != `function`) ||
                  (typeof a.componentWillUpdate == `function` &&
                    a.componentWillUpdate(r, p, c),
                  typeof a.UNSAFE_componentWillUpdate == `function` &&
                    a.UNSAFE_componentWillUpdate(r, p, c)),
                typeof a.componentDidUpdate == `function` && (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate == `function` &&
                  (t.flags |= 1024))
              : (typeof a.componentDidUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 4),
                typeof a.getSnapshotBeforeUpdate != `function` ||
                  (o === e.memoizedProps && f === e.memoizedState) ||
                  (t.flags |= 1024),
                (t.memoizedProps = r),
                (t.memoizedState = p)),
            (a.props = r),
            (a.state = p),
            (a.context = c),
            (r = u))
          : (typeof a.componentDidUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != `function` ||
              (o === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (r = !1));
      }
      return (
        (a = r),
        mc(e, t),
        (r = (t.flags & 128) != 0),
        a || r
          ? ((a = t.stateNode),
            (n =
              r && typeof n.getDerivedStateFromError != `function`
                ? null
                : a.render()),
            (t.flags |= 1),
            e !== null && r
              ? ((t.child = za(t, e.child, null, i)),
                (t.child = za(t, null, n, i)))
              : ic(e, t, n, i),
            (t.memoizedState = a.state),
            (e = t.child))
          : (e = kc(e, t, i)),
        e
      );
    }
    function vc(e, t, n, r) {
      return (Ui(), (t.flags |= 256), ic(e, t, n, r), t.child);
    }
    var yc = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null,
    };
    function bc(e) {
      return { baseLanes: e, cachePool: Sa() };
    }
    function xc(e, t, n) {
      return ((e = e === null ? 0 : e.childLanes & ~n), t && (e |= Zl), e);
    }
    function Sc(e, t, n) {
      var r = t.pendingProps,
        a = !1,
        o = (t.flags & 128) != 0,
        s;
      if (
        ((s = o) ||
          (s =
            e !== null && e.memoizedState === null
              ? !1
              : (uo.current & 2) != 0),
        s && ((a = !0), (t.flags &= -129)),
        (s = (t.flags & 32) != 0),
        (t.flags &= -33),
        e === null)
      ) {
        if (R) {
          if (
            (a ? ao(t) : co(t),
            (e = Fi)
              ? ((e = sf(e, Li)),
                (e = e !== null && e.data !== `&` ? e : null),
                e !== null &&
                  ((t.memoizedState = {
                    dehydrated: e,
                    treeContext: Ei === null ? null : { id: Di, overflow: Oi },
                    retryLane: 536870912,
                    hydrationErrors: null,
                  }),
                  (n = gi(e)),
                  (n.return = t),
                  (t.child = n),
                  (Pi = t),
                  (Fi = null)))
              : (e = null),
            e === null)
          )
            throw zi(t);
          return (lf(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
        }
        var c = r.children;
        return (
          (r = r.fallback),
          a
            ? (co(t),
              (a = t.mode),
              (c = wc({ mode: `hidden`, children: c }, a)),
              (r = mi(r, a, n, null)),
              (c.return = t),
              (r.return = t),
              (c.sibling = r),
              (t.child = c),
              (r = t.child),
              (r.memoizedState = bc(n)),
              (r.childLanes = xc(e, s, n)),
              (t.memoizedState = yc),
              lc(null, r))
            : (ao(t), Cc(t, c))
        );
      }
      var l = e.memoizedState;
      if (l !== null && ((c = l.dehydrated), c !== null)) {
        if (o)
          t.flags & 256
            ? (ao(t), (t.flags &= -257), (t = Tc(e, t, n)))
            : t.memoizedState === null
              ? (co(t),
                (c = r.fallback),
                (a = t.mode),
                (r = wc({ mode: `visible`, children: r.children }, a)),
                (c = mi(c, a, n, null)),
                (c.flags |= 2),
                (r.return = t),
                (c.return = t),
                (r.sibling = c),
                (t.child = r),
                za(t, e.child, null, n),
                (r = t.child),
                (r.memoizedState = bc(n)),
                (r.childLanes = xc(e, s, n)),
                (t.memoizedState = yc),
                (t = lc(null, r)))
              : (co(t), (t.child = e.child), (t.flags |= 128), (t = null));
        else if ((ao(t), lf(c))) {
          if (((s = c.nextSibling && c.nextSibling.dataset), s)) var u = s.dgst;
          ((s = u),
            (r = Error(i(419))),
            (r.stack = ``),
            (r.digest = s),
            Gi({ value: r, source: null, stack: null }),
            (t = Tc(e, t, n)));
        } else if (
          (rc || $i(e, t, n, !1), (s = (n & e.childLanes) !== 0), rc || s)
        ) {
          if (
            ((s = Vl),
            s !== null && ((r = tt(s, n)), r !== 0 && r !== l.retryLane))
          )
            throw ((l.retryLane = r), ii(e, r), vu(s, e, r), nc);
          (cf(c) || Au(), (t = Tc(e, t, n)));
        } else
          cf(c)
            ? ((t.flags |= 192), (t.child = e.child), (t = null))
            : ((e = l.treeContext),
              (Fi = df(c.nextSibling)),
              (Pi = t),
              (R = !0),
              (Ii = null),
              (Li = !1),
              e !== null && Ni(t, e),
              (t = Cc(t, r.children)),
              (t.flags |= 4096));
        return t;
      }
      return a
        ? (co(t),
          (c = r.fallback),
          (a = t.mode),
          (l = e.child),
          (u = l.sibling),
          (r = di(l, { mode: `hidden`, children: r.children })),
          (r.subtreeFlags = l.subtreeFlags & 65011712),
          u === null
            ? ((c = mi(c, a, n, null)), (c.flags |= 2))
            : (c = di(u, c)),
          (c.return = t),
          (r.return = t),
          (r.sibling = c),
          (t.child = r),
          lc(null, r),
          (r = t.child),
          (c = e.child.memoizedState),
          c === null
            ? (c = bc(n))
            : ((a = c.cachePool),
              a === null
                ? (a = Sa())
                : ((l = ca._currentValue),
                  (a = a.parent === l ? a : { parent: l, pool: l })),
              (c = { baseLanes: c.baseLanes | n, cachePool: a })),
          (r.memoizedState = c),
          (r.childLanes = xc(e, s, n)),
          (t.memoizedState = yc),
          lc(e.child, r))
        : (ao(t),
          (n = e.child),
          (e = n.sibling),
          (n = di(n, { mode: `visible`, children: r.children })),
          (n.return = t),
          (n.sibling = null),
          e !== null &&
            ((s = t.deletions),
            s === null ? ((t.deletions = [e]), (t.flags |= 16)) : s.push(e)),
          (t.child = n),
          (t.memoizedState = null),
          n);
    }
    function Cc(e, t) {
      return (
        (t = wc({ mode: `visible`, children: t }, e.mode)),
        (t.return = e),
        (e.child = t)
      );
    }
    function wc(e, t) {
      return ((e = li(22, e, null, t)), (e.lanes = 0), e);
    }
    function Tc(e, t, n) {
      return (
        za(t, e.child, null, n),
        (e = Cc(t, t.pendingProps.children)),
        (e.flags |= 2),
        (t.memoizedState = null),
        e
      );
    }
    function Ec(e, t, n) {
      e.lanes |= t;
      var r = e.alternate;
      (r !== null && (r.lanes |= t), Zi(e.return, t, n));
    }
    function Dc(e, t, n, r, i, a) {
      var o = e.memoizedState;
      o === null
        ? (e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: r,
            tail: n,
            tailMode: i,
            treeForkCount: a,
          })
        : ((o.isBackwards = t),
          (o.rendering = null),
          (o.renderingStartTime = 0),
          (o.last = r),
          (o.tail = n),
          (o.tailMode = i),
          (o.treeForkCount = a));
    }
    function Oc(e, t, n) {
      var r = t.pendingProps,
        i = r.revealOrder,
        a = r.tail;
      r = r.children;
      var o = uo.current,
        s = (o & 2) != 0;
      if (
        (s ? ((o = (o & 1) | 2), (t.flags |= 128)) : (o &= 1),
        L(uo, o),
        ic(e, t, r, n),
        (r = R ? Ci : 0),
        !s && e !== null && e.flags & 128)
      )
        a: for (e = t.child; e !== null; ) {
          if (e.tag === 13) e.memoizedState !== null && Ec(e, n, t);
          else if (e.tag === 19) Ec(e, n, t);
          else if (e.child !== null) {
            ((e.child.return = e), (e = e.child));
            continue;
          }
          if (e === t) break a;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break a;
            e = e.return;
          }
          ((e.sibling.return = e.return), (e = e.sibling));
        }
      switch (i) {
        case `forwards`:
          for (n = t.child, i = null; n !== null; )
            ((e = n.alternate),
              e !== null && fo(e) === null && (i = n),
              (n = n.sibling));
          ((n = i),
            n === null
              ? ((i = t.child), (t.child = null))
              : ((i = n.sibling), (n.sibling = null)),
            Dc(t, !1, i, n, a, r));
          break;
        case `backwards`:
        case `unstable_legacy-backwards`:
          for (n = null, i = t.child, t.child = null; i !== null; ) {
            if (((e = i.alternate), e !== null && fo(e) === null)) {
              t.child = i;
              break;
            }
            ((e = i.sibling), (i.sibling = n), (n = i), (i = e));
          }
          Dc(t, !0, n, null, a, r);
          break;
        case `together`:
          Dc(t, !1, null, null, void 0, r);
          break;
        default:
          t.memoizedState = null;
      }
      return t.child;
    }
    function kc(e, t, n) {
      if (
        (e !== null && (t.dependencies = e.dependencies),
        (Jl |= t.lanes),
        (n & t.childLanes) === 0)
      )
        if (e !== null) {
          if (($i(e, t, n, !1), (n & t.childLanes) === 0)) return null;
        } else return null;
      if (e !== null && t.child !== e.child) throw Error(i(153));
      if (t.child !== null) {
        for (
          e = t.child, n = di(e, e.pendingProps), t.child = n, n.return = t;
          e.sibling !== null;
        )
          ((e = e.sibling),
            (n = n.sibling = di(e, e.pendingProps)),
            (n.return = t));
        n.sibling = null;
      }
      return t.child;
    }
    function Ac(e, t) {
      return (e.lanes & t) === 0
        ? ((e = e.dependencies), !!(e !== null && ea(e)))
        : !0;
    }
    function jc(e, t, n) {
      switch (t.tag) {
        case 3:
          (ue(t, t.stateNode.containerInfo),
            Yi(t, ca, e.memoizedState.cache),
            Ui());
          break;
        case 27:
        case 5:
          fe(t);
          break;
        case 4:
          ue(t, t.stateNode.containerInfo);
          break;
        case 10:
          Yi(t, t.type, t.memoizedProps.value);
          break;
        case 31:
          if (t.memoizedState !== null) return ((t.flags |= 128), oo(t), null);
          break;
        case 13:
          var r = t.memoizedState;
          if (r !== null)
            return r.dehydrated === null
              ? (n & t.child.childLanes) === 0
                ? (ao(t), (e = kc(e, t, n)), e === null ? null : e.sibling)
                : Sc(e, t, n)
              : (ao(t), (t.flags |= 128), null);
          ao(t);
          break;
        case 19:
          var i = (e.flags & 128) != 0;
          if (
            ((r = (n & t.childLanes) !== 0),
            (r ||= ($i(e, t, n, !1), (n & t.childLanes) !== 0)),
            i)
          ) {
            if (r) return Oc(e, t, n);
            t.flags |= 128;
          }
          if (
            ((i = t.memoizedState),
            i !== null &&
              ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
            L(uo, uo.current),
            r)
          )
            break;
          return null;
        case 22:
          return ((t.lanes = 0), cc(e, t, n, t.pendingProps));
        case 24:
          Yi(t, ca, e.memoizedState.cache);
      }
      return kc(e, t, n);
    }
    function Mc(e, t, n) {
      if (e !== null)
        if (e.memoizedProps !== t.pendingProps) rc = !0;
        else {
          if (!Ac(e, n) && !(t.flags & 128)) return ((rc = !1), jc(e, t, n));
          rc = !!(e.flags & 131072);
        }
      else ((rc = !1), R && t.flags & 1048576 && Ai(t, Ci, t.index));
      switch (((t.lanes = 0), t.tag)) {
        case 16:
          a: {
            var r = t.pendingProps;
            if (((e = ka(t.elementType)), (t.type = e), typeof e == `function`))
              ui(e)
                ? ((r = Ks(e, r)), (t.tag = 1), (t = _c(null, t, e, r, n)))
                : ((t.tag = 0), (t = hc(null, t, e, r, n)));
            else {
              if (e != null) {
                var a = e.$$typeof;
                if (a === w) {
                  ((t.tag = 11), (t = ac(null, t, e, r, n)));
                  break a;
                } else if (a === D) {
                  ((t.tag = 14), (t = oc(null, t, e, r, n)));
                  break a;
                }
              }
              throw ((t = N(e) || e), Error(i(306, t, ``)));
            }
          }
          return t;
        case 0:
          return hc(e, t, t.type, t.pendingProps, n);
        case 1:
          return ((r = t.type), (a = Ks(r, t.pendingProps)), _c(e, t, r, a, n));
        case 3:
          a: {
            if ((ue(t, t.stateNode.containerInfo), e === null))
              throw Error(i(387));
            r = t.pendingProps;
            var o = t.memoizedState;
            ((a = o.element), Ua(e, t), Xa(t, r, null, n));
            var s = t.memoizedState;
            if (
              ((r = s.cache),
              Yi(t, ca, r),
              r !== o.cache && Qi(t, [ca], n, !0),
              Ya(),
              (r = s.element),
              o.isDehydrated)
            )
              if (
                ((o = { element: r, isDehydrated: !1, cache: s.cache }),
                (t.updateQueue.baseState = o),
                (t.memoizedState = o),
                t.flags & 256)
              ) {
                t = vc(e, t, r, n);
                break a;
              } else if (r !== a) {
                ((a = yi(Error(i(424)), t)), Gi(a), (t = vc(e, t, r, n)));
                break a;
              } else {
                switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                  case 9:
                    e = e.body;
                    break;
                  default:
                    e = e.nodeName === `HTML` ? e.ownerDocument.body : e;
                }
                for (
                  Fi = df(e.firstChild),
                    Pi = t,
                    R = !0,
                    Ii = null,
                    Li = !0,
                    n = Ba(t, null, r, n),
                    t.child = n;
                  n;
                )
                  ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
              }
            else {
              if ((Ui(), r === a)) {
                t = kc(e, t, n);
                break a;
              }
              ic(e, t, r, n);
            }
            t = t.child;
          }
          return t;
        case 26:
          return (
            mc(e, t),
            e === null
              ? (n = Mf(t.type, null, t.pendingProps, null))
                ? (t.memoizedState = n)
                : R ||
                  ((n = t.type),
                  (e = t.pendingProps),
                  (r = X(ce.current).createElement(n)),
                  (r[st] = t),
                  (r[ct] = e),
                  Rd(r, n, e),
                  bt(r),
                  (t.stateNode = r))
              : (t.memoizedState = Mf(
                  t.type,
                  e.memoizedProps,
                  t.pendingProps,
                  e.memoizedState,
                )),
            null
          );
        case 27:
          return (
            fe(t),
            e === null &&
              R &&
              ((r = t.stateNode = hf(t.type, t.pendingProps, ce.current)),
              (Pi = t),
              (Li = !0),
              (a = Fi),
              ef(t.type) ? ((ff = a), (Fi = df(r.firstChild))) : (Fi = a)),
            ic(e, t, t.pendingProps.children, n),
            mc(e, t),
            e === null && (t.flags |= 4194304),
            t.child
          );
        case 5:
          return (
            e === null &&
              R &&
              ((a = r = Fi) &&
                ((r = af(r, t.type, t.pendingProps, Li)),
                r === null
                  ? (a = !1)
                  : ((t.stateNode = r),
                    (Pi = t),
                    (Fi = df(r.firstChild)),
                    (Li = !1),
                    (a = !0))),
              a || zi(t)),
            fe(t),
            (a = t.type),
            (o = t.pendingProps),
            (s = e === null ? null : e.memoizedProps),
            (r = o.children),
            Kd(a, o) ? (r = null) : s !== null && Kd(a, s) && (t.flags |= 32),
            t.memoizedState !== null &&
              ((a = Co(e, t, Eo, null, null, n)), (tp._currentValue = a)),
            mc(e, t),
            ic(e, t, r, n),
            t.child
          );
        case 6:
          return (
            e === null &&
              R &&
              ((e = n = Fi) &&
                ((n = of(n, t.pendingProps, Li)),
                n === null
                  ? (e = !1)
                  : ((t.stateNode = n), (Pi = t), (Fi = null), (e = !0))),
              e || zi(t)),
            null
          );
        case 13:
          return Sc(e, t, n);
        case 4:
          return (
            ue(t, t.stateNode.containerInfo),
            (r = t.pendingProps),
            e === null ? (t.child = za(t, null, r, n)) : ic(e, t, r, n),
            t.child
          );
        case 11:
          return ac(e, t, t.type, t.pendingProps, n);
        case 7:
          return (ic(e, t, t.pendingProps, n), t.child);
        case 8:
          return (ic(e, t, t.pendingProps.children, n), t.child);
        case 12:
          return (ic(e, t, t.pendingProps.children, n), t.child);
        case 10:
          return (
            (r = t.pendingProps),
            Yi(t, t.type, r.value),
            ic(e, t, r.children, n),
            t.child
          );
        case 9:
          return (
            (a = t.type._context),
            (r = t.pendingProps.children),
            ta(t),
            (a = na(a)),
            (r = r(a)),
            (t.flags |= 1),
            ic(e, t, r, n),
            t.child
          );
        case 14:
          return oc(e, t, t.type, t.pendingProps, n);
        case 15:
          return sc(e, t, t.type, t.pendingProps, n);
        case 19:
          return Oc(e, t, n);
        case 31:
          return pc(e, t, n);
        case 22:
          return cc(e, t, n, t.pendingProps);
        case 24:
          return (
            ta(t),
            (r = na(ca)),
            e === null
              ? ((a = ba()),
                a === null &&
                  ((a = Vl),
                  (o = la()),
                  (a.pooledCache = o),
                  o.refCount++,
                  o !== null && (a.pooledCacheLanes |= n),
                  (a = o)),
                (t.memoizedState = { parent: r, cache: a }),
                Ha(t),
                Yi(t, ca, a))
              : ((e.lanes & n) !== 0 && (Ua(e, t), Xa(t, null, null, n), Ya()),
                (a = e.memoizedState),
                (o = t.memoizedState),
                a.parent === r
                  ? ((r = o.cache),
                    Yi(t, ca, r),
                    r !== a.cache && Qi(t, [ca], n, !0))
                  : ((a = { parent: r, cache: r }),
                    (t.memoizedState = a),
                    t.lanes === 0 &&
                      (t.memoizedState = t.updateQueue.baseState = a),
                    Yi(t, ca, r))),
            ic(e, t, t.pendingProps.children, n),
            t.child
          );
        case 29:
          throw t.pendingProps;
      }
      throw Error(i(156, t.tag));
    }
    function Nc(e) {
      e.flags |= 4;
    }
    function Pc(e, t, n, r, i) {
      if (((t = (e.mode & 32) != 0) && (t = !1), t)) {
        if (((e.flags |= 16777216), (i & 335544128) === i))
          if (e.stateNode.complete) e.flags |= 8192;
          else if (Du()) e.flags |= 8192;
          else throw ((Aa = Ea), wa);
      } else e.flags &= -16777217;
    }
    function Fc(e, t) {
      if (t.type !== `stylesheet` || t.state.loading & 4) e.flags &= -16777217;
      else if (((e.flags |= 16777216), !qf(t)))
        if (Du()) e.flags |= 8192;
        else throw ((Aa = Ea), wa);
    }
    function Ic(e, t) {
      (t !== null && (e.flags |= 4),
        e.flags & 16384 &&
          ((t = e.tag === 22 ? 536870912 : Ye()), (e.lanes |= t), (Ql |= t)));
    }
    function Lc(e, t) {
      if (!R)
        switch (e.tailMode) {
          case `hidden`:
            t = e.tail;
            for (var n = null; t !== null; )
              (t.alternate !== null && (n = t), (t = t.sibling));
            n === null ? (e.tail = null) : (n.sibling = null);
            break;
          case `collapsed`:
            n = e.tail;
            for (var r = null; n !== null; )
              (n.alternate !== null && (r = n), (n = n.sibling));
            r === null
              ? t || e.tail === null
                ? (e.tail = null)
                : (e.tail.sibling = null)
              : (r.sibling = null);
        }
    }
    function Rc(e) {
      var t = e.alternate !== null && e.alternate.child === e.child,
        n = 0,
        r = 0;
      if (t)
        for (var i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags & 65011712),
            (r |= i.flags & 65011712),
            (i.return = e),
            (i = i.sibling));
      else
        for (i = e.child; i !== null; )
          ((n |= i.lanes | i.childLanes),
            (r |= i.subtreeFlags),
            (r |= i.flags),
            (i.return = e),
            (i = i.sibling));
      return ((e.subtreeFlags |= r), (e.childLanes = n), t);
    }
    function zc(e, t, n) {
      var r = t.pendingProps;
      switch ((Mi(t), t.tag)) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return (Rc(t), null);
        case 1:
          return (Rc(t), null);
        case 3:
          return (
            (n = t.stateNode),
            (r = null),
            e !== null && (r = e.memoizedState.cache),
            t.memoizedState.cache !== r && (t.flags |= 2048),
            Xi(ca),
            de(),
            n.pendingContext &&
              ((n.context = n.pendingContext), (n.pendingContext = null)),
            (e === null || e.child === null) &&
              (Hi(t)
                ? Nc(t)
                : e === null ||
                  (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                  ((t.flags |= 1024), Wi())),
            Rc(t),
            null
          );
        case 26:
          var a = t.type,
            o = t.memoizedState;
          return (
            e === null
              ? (Nc(t),
                o === null ? (Rc(t), Pc(t, a, null, r, n)) : (Rc(t), Fc(t, o)))
              : o
                ? o === e.memoizedState
                  ? (Rc(t), (t.flags &= -16777217))
                  : (Nc(t), Rc(t), Fc(t, o))
                : ((e = e.memoizedProps),
                  e !== r && Nc(t),
                  Rc(t),
                  Pc(t, a, e, r, n)),
            null
          );
        case 27:
          if (
            (pe(t),
            (n = ce.current),
            (a = t.type),
            e !== null && t.stateNode != null)
          )
            e.memoizedProps !== r && Nc(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return (Rc(t), null);
            }
            ((e = oe.current),
              Hi(t) ? Bi(t, e) : ((e = hf(a, r, n)), (t.stateNode = e), Nc(t)));
          }
          return (Rc(t), null);
        case 5:
          if ((pe(t), (a = t.type), e !== null && t.stateNode != null))
            e.memoizedProps !== r && Nc(t);
          else {
            if (!r) {
              if (t.stateNode === null) throw Error(i(166));
              return (Rc(t), null);
            }
            if (((o = oe.current), Hi(t))) Bi(t, o);
            else {
              var s = X(ce.current);
              switch (o) {
                case 1:
                  o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                  break;
                case 2:
                  o = s.createElementNS(
                    `http://www.w3.org/1998/Math/MathML`,
                    a,
                  );
                  break;
                default:
                  switch (a) {
                    case `svg`:
                      o = s.createElementNS(`http://www.w3.org/2000/svg`, a);
                      break;
                    case `math`:
                      o = s.createElementNS(
                        `http://www.w3.org/1998/Math/MathML`,
                        a,
                      );
                      break;
                    case `script`:
                      ((o = s.createElement(`div`)),
                        (o.innerHTML = `<script><\/script>`),
                        (o = o.removeChild(o.firstChild)));
                      break;
                    case `select`:
                      ((o =
                        typeof r.is == `string`
                          ? s.createElement(`select`, { is: r.is })
                          : s.createElement(`select`)),
                        r.multiple
                          ? (o.multiple = !0)
                          : r.size && (o.size = r.size));
                      break;
                    default:
                      o =
                        typeof r.is == `string`
                          ? s.createElement(a, { is: r.is })
                          : s.createElement(a);
                  }
              }
              ((o[st] = t), (o[ct] = r));
              a: for (s = t.child; s !== null; ) {
                if (s.tag === 5 || s.tag === 6) o.appendChild(s.stateNode);
                else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                  ((s.child.return = s), (s = s.child));
                  continue;
                }
                if (s === t) break a;
                for (; s.sibling === null; ) {
                  if (s.return === null || s.return === t) break a;
                  s = s.return;
                }
                ((s.sibling.return = s.return), (s = s.sibling));
              }
              t.stateNode = o;
              a: switch ((Rd(o, a, r), a)) {
                case `button`:
                case `input`:
                case `select`:
                case `textarea`:
                  r = !!r.autoFocus;
                  break a;
                case `img`:
                  r = !0;
                  break a;
                default:
                  r = !1;
              }
              r && Nc(t);
            }
          }
          return (
            Rc(t),
            Pc(
              t,
              t.type,
              e === null ? null : e.memoizedProps,
              t.pendingProps,
              n,
            ),
            null
          );
        case 6:
          if (e && t.stateNode != null) e.memoizedProps !== r && Nc(t);
          else {
            if (typeof r != `string` && t.stateNode === null)
              throw Error(i(166));
            if (((e = ce.current), Hi(t))) {
              if (
                ((e = t.stateNode),
                (n = t.memoizedProps),
                (r = null),
                (a = Pi),
                a !== null)
              )
                switch (a.tag) {
                  case 27:
                  case 5:
                    r = a.memoizedProps;
                }
              ((e[st] = t),
                (e = !!(
                  e.nodeValue === n ||
                  (r !== null && !0 === r.suppressHydrationWarning) ||
                  Fd(e.nodeValue, n)
                )),
                e || zi(t, !0));
            } else
              ((e = X(e).createTextNode(r)), (e[st] = t), (t.stateNode = e));
          }
          return (Rc(t), null);
        case 31:
          if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
            if (((r = Hi(t)), n !== null)) {
              if (e === null) {
                if (!r) throw Error(i(318));
                if (
                  ((e = t.memoizedState),
                  (e = e === null ? null : e.dehydrated),
                  !e)
                )
                  throw Error(i(557));
                e[st] = t;
              } else
                (Ui(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (Rc(t), (e = !1));
            } else
              ((n = Wi()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = n),
                (e = !0));
            if (!e) return t.flags & 256 ? (lo(t), t) : (lo(t), null);
            if (t.flags & 128) throw Error(i(558));
          }
          return (Rc(t), null);
        case 13:
          if (
            ((r = t.memoizedState),
            e === null ||
              (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
          ) {
            if (((a = Hi(t)), r !== null && r.dehydrated !== null)) {
              if (e === null) {
                if (!a) throw Error(i(318));
                if (
                  ((a = t.memoizedState),
                  (a = a === null ? null : a.dehydrated),
                  !a)
                )
                  throw Error(i(317));
                a[st] = t;
              } else
                (Ui(),
                  !(t.flags & 128) && (t.memoizedState = null),
                  (t.flags |= 4));
              (Rc(t), (a = !1));
            } else
              ((a = Wi()),
                e !== null &&
                  e.memoizedState !== null &&
                  (e.memoizedState.hydrationErrors = a),
                (a = !0));
            if (!a) return t.flags & 256 ? (lo(t), t) : (lo(t), null);
          }
          return (
            lo(t),
            t.flags & 128
              ? ((t.lanes = n), t)
              : ((n = r !== null),
                (e = e !== null && e.memoizedState !== null),
                n &&
                  ((r = t.child),
                  (a = null),
                  r.alternate !== null &&
                    r.alternate.memoizedState !== null &&
                    r.alternate.memoizedState.cachePool !== null &&
                    (a = r.alternate.memoizedState.cachePool.pool),
                  (o = null),
                  r.memoizedState !== null &&
                    r.memoizedState.cachePool !== null &&
                    (o = r.memoizedState.cachePool.pool),
                  o !== a && (r.flags |= 2048)),
                n !== e && n && (t.child.flags |= 8192),
                Ic(t, t.updateQueue),
                Rc(t),
                null)
          );
        case 4:
          return (
            de(),
            e === null && Td(t.stateNode.containerInfo),
            Rc(t),
            null
          );
        case 10:
          return (Xi(t.type), Rc(t), null);
        case 19:
          if ((ae(uo), (r = t.memoizedState), r === null)) return (Rc(t), null);
          if (((a = (t.flags & 128) != 0), (o = r.rendering), o === null))
            if (a) Lc(r, !1);
            else {
              if (ql !== 0 || (e !== null && e.flags & 128))
                for (e = t.child; e !== null; ) {
                  if (((o = fo(e)), o !== null)) {
                    for (
                      t.flags |= 128,
                        Lc(r, !1),
                        e = o.updateQueue,
                        t.updateQueue = e,
                        Ic(t, e),
                        t.subtreeFlags = 0,
                        e = n,
                        n = t.child;
                      n !== null;
                    )
                      (fi(n, e), (n = n.sibling));
                    return (
                      L(uo, (uo.current & 1) | 2),
                      R && ki(t, r.treeForkCount),
                      t.child
                    );
                  }
                  e = e.sibling;
                }
              r.tail !== null &&
                Ee() > iu &&
                ((t.flags |= 128), (a = !0), Lc(r, !1), (t.lanes = 4194304));
            }
          else {
            if (!a)
              if (((e = fo(o)), e !== null)) {
                if (
                  ((t.flags |= 128),
                  (a = !0),
                  (e = e.updateQueue),
                  (t.updateQueue = e),
                  Ic(t, e),
                  Lc(r, !0),
                  r.tail === null &&
                    r.tailMode === `hidden` &&
                    !o.alternate &&
                    !R)
                )
                  return (Rc(t), null);
              } else
                2 * Ee() - r.renderingStartTime > iu &&
                  n !== 536870912 &&
                  ((t.flags |= 128), (a = !0), Lc(r, !1), (t.lanes = 4194304));
            r.isBackwards
              ? ((o.sibling = t.child), (t.child = o))
              : ((e = r.last),
                e === null ? (t.child = o) : (e.sibling = o),
                (r.last = o));
          }
          return r.tail === null
            ? (Rc(t), null)
            : ((e = r.tail),
              (r.rendering = e),
              (r.tail = e.sibling),
              (r.renderingStartTime = Ee()),
              (e.sibling = null),
              (n = uo.current),
              L(uo, a ? (n & 1) | 2 : n & 1),
              R && ki(t, r.treeForkCount),
              e);
        case 22:
        case 23:
          return (
            lo(t),
            z(),
            (r = t.memoizedState !== null),
            e === null
              ? r && (t.flags |= 8192)
              : (e.memoizedState !== null) !== r && (t.flags |= 8192),
            r
              ? n & 536870912 &&
                !(t.flags & 128) &&
                (Rc(t), t.subtreeFlags & 6 && (t.flags |= 8192))
              : Rc(t),
            (n = t.updateQueue),
            n !== null && Ic(t, n.retryQueue),
            (n = null),
            e !== null &&
              e.memoizedState !== null &&
              e.memoizedState.cachePool !== null &&
              (n = e.memoizedState.cachePool.pool),
            (r = null),
            t.memoizedState !== null &&
              t.memoizedState.cachePool !== null &&
              (r = t.memoizedState.cachePool.pool),
            r !== n && (t.flags |= 2048),
            e !== null && ae(ya),
            null
          );
        case 24:
          return (
            (n = null),
            e !== null && (n = e.memoizedState.cache),
            t.memoizedState.cache !== n && (t.flags |= 2048),
            Xi(ca),
            Rc(t),
            null
          );
        case 25:
          return null;
        case 30:
          return null;
      }
      throw Error(i(156, t.tag));
    }
    function Bc(e, t) {
      switch ((Mi(t), t.tag)) {
        case 1:
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 3:
          return (
            Xi(ca),
            de(),
            (e = t.flags),
            e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 26:
        case 27:
        case 5:
          return (pe(t), null);
        case 31:
          if (t.memoizedState !== null) {
            if ((lo(t), t.alternate === null)) throw Error(i(340));
            Ui();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 13:
          if (
            (lo(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)
          ) {
            if (t.alternate === null) throw Error(i(340));
            Ui();
          }
          return (
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 19:
          return (ae(uo), null);
        case 4:
          return (de(), null);
        case 10:
          return (Xi(t.type), null);
        case 22:
        case 23:
          return (
            lo(t),
            z(),
            e !== null && ae(ya),
            (e = t.flags),
            e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
          );
        case 24:
          return (Xi(ca), null);
        case 25:
          return null;
        default:
          return null;
      }
    }
    function Vc(e, t) {
      switch ((Mi(t), t.tag)) {
        case 3:
          (Xi(ca), de());
          break;
        case 26:
        case 27:
        case 5:
          pe(t);
          break;
        case 4:
          de();
          break;
        case 31:
          t.memoizedState !== null && lo(t);
          break;
        case 13:
          lo(t);
          break;
        case 19:
          ae(uo);
          break;
        case 10:
          Xi(t.type);
          break;
        case 22:
        case 23:
          (lo(t), z(), e !== null && ae(ya));
          break;
        case 24:
          Xi(ca);
      }
    }
    function Hc(e, t) {
      try {
        var n = t.updateQueue,
          r = n === null ? null : n.lastEffect;
        if (r !== null) {
          var i = r.next;
          n = i;
          do {
            if ((n.tag & e) === e) {
              r = void 0;
              var a = n.create,
                o = n.inst;
              ((r = a()), (o.destroy = r));
            }
            n = n.next;
          } while (n !== i);
        }
      } catch (e) {
        J(t, t.return, e);
      }
    }
    function Uc(e, t, n) {
      try {
        var r = t.updateQueue,
          i = r === null ? null : r.lastEffect;
        if (i !== null) {
          var a = i.next;
          r = a;
          do {
            if ((r.tag & e) === e) {
              var o = r.inst,
                s = o.destroy;
              if (s !== void 0) {
                ((o.destroy = void 0), (i = t));
                var c = n,
                  l = s;
                try {
                  l();
                } catch (e) {
                  J(i, c, e);
                }
              }
            }
            r = r.next;
          } while (r !== a);
        }
      } catch (e) {
        J(t, t.return, e);
      }
    }
    function Wc(e) {
      var t = e.updateQueue;
      if (t !== null) {
        var n = e.stateNode;
        try {
          Qa(t, n);
        } catch (t) {
          J(e, e.return, t);
        }
      }
    }
    function Gc(e, t, n) {
      ((n.props = Ks(e.type, e.memoizedProps)), (n.state = e.memoizedState));
      try {
        n.componentWillUnmount();
      } catch (n) {
        J(e, t, n);
      }
    }
    function Kc(e, t) {
      try {
        var n = e.ref;
        if (n !== null) {
          switch (e.tag) {
            case 26:
            case 27:
            case 5:
              var r = e.stateNode;
              break;
            case 30:
              r = e.stateNode;
              break;
            default:
              r = e.stateNode;
          }
          typeof n == `function` ? (e.refCleanup = n(r)) : (n.current = r);
        }
      } catch (n) {
        J(e, t, n);
      }
    }
    function qc(e, t) {
      var n = e.ref,
        r = e.refCleanup;
      if (n !== null)
        if (typeof r == `function`)
          try {
            r();
          } catch (n) {
            J(e, t, n);
          } finally {
            ((e.refCleanup = null),
              (e = e.alternate),
              e != null && (e.refCleanup = null));
          }
        else if (typeof n == `function`)
          try {
            n(null);
          } catch (n) {
            J(e, t, n);
          }
        else n.current = null;
    }
    function Jc(e) {
      var t = e.type,
        n = e.memoizedProps,
        r = e.stateNode;
      try {
        a: switch (t) {
          case `button`:
          case `input`:
          case `select`:
          case `textarea`:
            n.autoFocus && r.focus();
            break a;
          case `img`:
            n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
        }
      } catch (t) {
        J(e, e.return, t);
      }
    }
    function Yc(e, t, n) {
      try {
        var r = e.stateNode;
        (zd(r, e.type, n, t), (r[ct] = t));
      } catch (t) {
        J(e, e.return, t);
      }
    }
    function Xc(e) {
      return (
        e.tag === 5 ||
        e.tag === 3 ||
        e.tag === 26 ||
        (e.tag === 27 && ef(e.type)) ||
        e.tag === 4
      );
    }
    function Zc(e) {
      a: for (;;) {
        for (; e.sibling === null; ) {
          if (e.return === null || Xc(e.return)) return null;
          e = e.return;
        }
        for (
          e.sibling.return = e.return, e = e.sibling;
          e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
        ) {
          if (
            (e.tag === 27 && ef(e.type)) ||
            e.flags & 2 ||
            e.child === null ||
            e.tag === 4
          )
            continue a;
          ((e.child.return = e), (e = e.child));
        }
        if (!(e.flags & 2)) return e.stateNode;
      }
    }
    function Qc(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        ((e = e.stateNode),
          t
            ? (n.nodeType === 9
                ? n.body
                : n.nodeName === `HTML`
                  ? n.ownerDocument.body
                  : n
              ).insertBefore(e, t)
            : ((t =
                n.nodeType === 9
                  ? n.body
                  : n.nodeName === `HTML`
                    ? n.ownerDocument.body
                    : n),
              t.appendChild(e),
              (n = n._reactRootContainer),
              n != null || t.onclick !== null || (t.onclick = en)));
      else if (
        r !== 4 &&
        (r === 27 && ef(e.type) && ((n = e.stateNode), (t = null)),
        (e = e.child),
        e !== null)
      )
        for (Qc(e, t, n), e = e.sibling; e !== null; )
          (Qc(e, t, n), (e = e.sibling));
    }
    function $c(e, t, n) {
      var r = e.tag;
      if (r === 5 || r === 6)
        ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
      else if (
        r !== 4 &&
        (r === 27 && ef(e.type) && (n = e.stateNode), (e = e.child), e !== null)
      )
        for ($c(e, t, n), e = e.sibling; e !== null; )
          ($c(e, t, n), (e = e.sibling));
    }
    function el(e) {
      var t = e.stateNode,
        n = e.memoizedProps;
      try {
        for (var r = e.type, i = t.attributes; i.length; )
          t.removeAttributeNode(i[0]);
        (Rd(t, r, n), (t[st] = e), (t[ct] = n));
      } catch (t) {
        J(e, e.return, t);
      }
    }
    var tl = !1,
      nl = !1,
      rl = !1,
      il = typeof WeakSet == `function` ? WeakSet : Set,
      al = null;
    function ol(e, t) {
      if (((e = e.containerInfo), (Hd = up), (e = Or(e)), kr(e))) {
        if (`selectionStart` in e)
          var n = { start: e.selectionStart, end: e.selectionEnd };
        else
          a: {
            n = ((n = e.ownerDocument) && n.defaultView) || window;
            var r = n.getSelection && n.getSelection();
            if (r && r.rangeCount !== 0) {
              n = r.anchorNode;
              var a = r.anchorOffset,
                o = r.focusNode;
              r = r.focusOffset;
              try {
                (n.nodeType, o.nodeType);
              } catch {
                n = null;
                break a;
              }
              var s = 0,
                c = -1,
                l = -1,
                u = 0,
                d = 0,
                f = e,
                p = null;
              b: for (;;) {
                for (
                  var m;
                  f !== n || (a !== 0 && f.nodeType !== 3) || (c = s + a),
                    f !== o || (r !== 0 && f.nodeType !== 3) || (l = s + r),
                    f.nodeType === 3 && (s += f.nodeValue.length),
                    (m = f.firstChild) !== null;
                )
                  ((p = f), (f = m));
                for (;;) {
                  if (f === e) break b;
                  if (
                    (p === n && ++u === a && (c = s),
                    p === o && ++d === r && (l = s),
                    (m = f.nextSibling) !== null)
                  )
                    break;
                  ((f = p), (p = f.parentNode));
                }
                f = m;
              }
              n = c === -1 || l === -1 ? null : { start: c, end: l };
            } else n = null;
          }
        n ||= { start: 0, end: 0 };
      } else n = null;
      for (
        Ud = { focusedElem: e, selectionRange: n }, up = !1, al = t;
        al !== null;
      )
        if (((t = al), (e = t.child), t.subtreeFlags & 1028 && e !== null))
          ((e.return = t), (al = e));
        else
          for (; al !== null; ) {
            switch (((t = al), (o = t.alternate), (e = t.flags), t.tag)) {
              case 0:
                if (
                  e & 4 &&
                  ((e = t.updateQueue),
                  (e = e === null ? null : e.events),
                  e !== null)
                )
                  for (n = 0; n < e.length; n++)
                    ((a = e[n]), (a.ref.impl = a.nextImpl));
                break;
              case 11:
              case 15:
                break;
              case 1:
                if (e & 1024 && o !== null) {
                  ((e = void 0),
                    (n = t),
                    (a = o.memoizedProps),
                    (o = o.memoizedState),
                    (r = n.stateNode));
                  try {
                    var h = Ks(n.type, a);
                    ((e = r.getSnapshotBeforeUpdate(h, o)),
                      (r.__reactInternalSnapshotBeforeUpdate = e));
                  } catch (e) {
                    J(n, n.return, e);
                  }
                }
                break;
              case 3:
                if (e & 1024) {
                  if (
                    ((e = t.stateNode.containerInfo), (n = e.nodeType), n === 9)
                  )
                    rf(e);
                  else if (n === 1)
                    switch (e.nodeName) {
                      case `HEAD`:
                      case `HTML`:
                      case `BODY`:
                        rf(e);
                        break;
                      default:
                        e.textContent = ``;
                    }
                }
                break;
              case 5:
              case 26:
              case 27:
              case 6:
              case 4:
              case 17:
                break;
              default:
                if (e & 1024) throw Error(i(163));
            }
            if (((e = t.sibling), e !== null)) {
              ((e.return = t.return), (al = e));
              break;
            }
            al = t.return;
          }
    }
    function sl(e, t, n) {
      var r = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (Sl(e, n), r & 4 && Hc(5, n));
          break;
        case 1:
          if ((Sl(e, n), r & 4))
            if (((e = n.stateNode), t === null))
              try {
                e.componentDidMount();
              } catch (e) {
                J(n, n.return, e);
              }
            else {
              var i = Ks(n.type, t.memoizedProps);
              t = t.memoizedState;
              try {
                e.componentDidUpdate(
                  i,
                  t,
                  e.__reactInternalSnapshotBeforeUpdate,
                );
              } catch (e) {
                J(n, n.return, e);
              }
            }
          (r & 64 && Wc(n), r & 512 && Kc(n, n.return));
          break;
        case 3:
          if ((Sl(e, n), r & 64 && ((e = n.updateQueue), e !== null))) {
            if (((t = null), n.child !== null))
              switch (n.child.tag) {
                case 27:
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
            try {
              Qa(e, t);
            } catch (e) {
              J(n, n.return, e);
            }
          }
          break;
        case 27:
          t === null && r & 4 && el(n);
        case 26:
        case 5:
          (Sl(e, n), t === null && r & 4 && Jc(n), r & 512 && Kc(n, n.return));
          break;
        case 12:
          Sl(e, n);
          break;
        case 31:
          (Sl(e, n), r & 4 && pl(e, n));
          break;
        case 13:
          (Sl(e, n),
            r & 4 && ml(e, n),
            r & 64 &&
              ((e = n.memoizedState),
              e !== null &&
                ((e = e.dehydrated),
                e !== null && ((n = Zu.bind(null, n)), uf(e, n)))));
          break;
        case 22:
          if (((r = n.memoizedState !== null || tl), !r)) {
            ((t = (t !== null && t.memoizedState !== null) || nl), (i = tl));
            var a = nl;
            ((tl = r),
              (nl = t) && !a
                ? wl(e, n, (n.subtreeFlags & 8772) != 0)
                : Sl(e, n),
              (tl = i),
              (nl = a));
          }
          break;
        case 30:
          break;
        default:
          Sl(e, n);
      }
    }
    function cl(e) {
      var t = e.alternate;
      (t !== null && ((e.alternate = null), cl(t)),
        (e.child = null),
        (e.deletions = null),
        (e.sibling = null),
        e.tag === 5 && ((t = e.stateNode), t !== null && ht(t)),
        (e.stateNode = null),
        (e.return = null),
        (e.dependencies = null),
        (e.memoizedProps = null),
        (e.memoizedState = null),
        (e.pendingProps = null),
        (e.stateNode = null),
        (e.updateQueue = null));
    }
    var ll = null,
      ul = !1;
    function dl(e, t, n) {
      for (n = n.child; n !== null; ) (fl(e, t, n), (n = n.sibling));
    }
    function fl(e, t, n) {
      if (Ie && typeof Ie.onCommitFiberUnmount == `function`)
        try {
          Ie.onCommitFiberUnmount(Fe, n);
        } catch {}
      switch (n.tag) {
        case 26:
          (nl || qc(n, t),
            dl(e, t, n),
            n.memoizedState
              ? n.memoizedState.count--
              : n.stateNode &&
                ((n = n.stateNode), n.parentNode.removeChild(n)));
          break;
        case 27:
          nl || qc(n, t);
          var r = ll,
            i = ul;
          (ef(n.type) && ((ll = n.stateNode), (ul = !1)),
            dl(e, t, n),
            gf(n.stateNode),
            (ll = r),
            (ul = i));
          break;
        case 5:
          nl || qc(n, t);
        case 6:
          if (
            ((r = ll),
            (i = ul),
            (ll = null),
            dl(e, t, n),
            (ll = r),
            (ul = i),
            ll !== null)
          )
            if (ul)
              try {
                (ll.nodeType === 9
                  ? ll.body
                  : ll.nodeName === `HTML`
                    ? ll.ownerDocument.body
                    : ll
                ).removeChild(n.stateNode);
              } catch (e) {
                J(n, t, e);
              }
            else
              try {
                ll.removeChild(n.stateNode);
              } catch (e) {
                J(n, t, e);
              }
          break;
        case 18:
          ll !== null &&
            (ul
              ? ((e = ll),
                tf(
                  e.nodeType === 9
                    ? e.body
                    : e.nodeName === `HTML`
                      ? e.ownerDocument.body
                      : e,
                  n.stateNode,
                ),
                Ip(e))
              : tf(ll, n.stateNode));
          break;
        case 4:
          ((r = ll),
            (i = ul),
            (ll = n.stateNode.containerInfo),
            (ul = !0),
            dl(e, t, n),
            (ll = r),
            (ul = i));
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          (Uc(2, n, t), nl || Uc(4, n, t), dl(e, t, n));
          break;
        case 1:
          (nl ||
            (qc(n, t),
            (r = n.stateNode),
            typeof r.componentWillUnmount == `function` && Gc(n, t, r)),
            dl(e, t, n));
          break;
        case 21:
          dl(e, t, n);
          break;
        case 22:
          ((nl = (r = nl) || n.memoizedState !== null), dl(e, t, n), (nl = r));
          break;
        default:
          dl(e, t, n);
      }
    }
    function pl(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
      ) {
        e = e.dehydrated;
        try {
          Ip(e);
        } catch (e) {
          J(t, t.return, e);
        }
      }
    }
    function ml(e, t) {
      if (
        t.memoizedState === null &&
        ((e = t.alternate),
        e !== null &&
          ((e = e.memoizedState),
          e !== null && ((e = e.dehydrated), e !== null)))
      )
        try {
          Ip(e);
        } catch (e) {
          J(t, t.return, e);
        }
    }
    function hl(e) {
      switch (e.tag) {
        case 31:
        case 13:
        case 19:
          var t = e.stateNode;
          return (t === null && (t = e.stateNode = new il()), t);
        case 22:
          return (
            (e = e.stateNode),
            (t = e._retryCache),
            t === null && (t = e._retryCache = new il()),
            t
          );
        default:
          throw Error(i(435, e.tag));
      }
    }
    function gl(e, t) {
      var n = hl(e);
      t.forEach(function (t) {
        if (!n.has(t)) {
          n.add(t);
          var r = Qu.bind(null, e, t);
          t.then(r, r);
        }
      });
    }
    function _l(e, t) {
      var n = t.deletions;
      if (n !== null)
        for (var r = 0; r < n.length; r++) {
          var a = n[r],
            o = e,
            s = t,
            c = s;
          a: for (; c !== null; ) {
            switch (c.tag) {
              case 27:
                if (ef(c.type)) {
                  ((ll = c.stateNode), (ul = !1));
                  break a;
                }
                break;
              case 5:
                ((ll = c.stateNode), (ul = !1));
                break a;
              case 3:
              case 4:
                ((ll = c.stateNode.containerInfo), (ul = !0));
                break a;
            }
            c = c.return;
          }
          if (ll === null) throw Error(i(160));
          (fl(o, s, a),
            (ll = null),
            (ul = !1),
            (o = a.alternate),
            o !== null && (o.return = null),
            (a.return = null));
        }
      if (t.subtreeFlags & 13886)
        for (t = t.child; t !== null; ) (yl(t, e), (t = t.sibling));
    }
    var vl = null;
    function yl(e, t) {
      var n = e.alternate,
        r = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (_l(t, e),
            bl(e),
            r & 4 && (Uc(3, e, e.return), Hc(3, e), Uc(5, e, e.return)));
          break;
        case 1:
          (_l(t, e),
            bl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            r & 64 &&
              tl &&
              ((e = e.updateQueue),
              e !== null &&
                ((r = e.callbacks),
                r !== null &&
                  ((n = e.shared.hiddenCallbacks),
                  (e.shared.hiddenCallbacks = n === null ? r : n.concat(r))))));
          break;
        case 26:
          var a = vl;
          if (
            (_l(t, e),
            bl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            r & 4)
          ) {
            var o = n === null ? null : n.memoizedState;
            if (((r = e.memoizedState), n === null))
              if (r === null)
                if (e.stateNode === null) {
                  a: {
                    ((r = e.type),
                      (n = e.memoizedProps),
                      (a = a.ownerDocument || a));
                    b: switch (r) {
                      case `title`:
                        ((o = a.getElementsByTagName(`title`)[0]),
                          (!o ||
                            o[mt] ||
                            o[st] ||
                            o.namespaceURI === `http://www.w3.org/2000/svg` ||
                            o.hasAttribute(`itemprop`)) &&
                            ((o = a.createElement(r)),
                            a.head.insertBefore(
                              o,
                              a.querySelector(`head > title`),
                            )),
                          Rd(o, r, n),
                          (o[st] = e),
                          bt(o),
                          (r = o));
                        break a;
                      case `link`:
                        var s = Wf(`link`, `href`, a).get(r + (n.href || ``));
                        if (s) {
                          for (var c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`href`) ===
                                (n.href == null || n.href === ``
                                  ? null
                                  : n.href) &&
                                o.getAttribute(`rel`) ===
                                  (n.rel == null ? null : n.rel) &&
                                o.getAttribute(`title`) ===
                                  (n.title == null ? null : n.title) &&
                                o.getAttribute(`crossorigin`) ===
                                  (n.crossOrigin == null
                                    ? null
                                    : n.crossOrigin))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        ((o = a.createElement(r)),
                          Rd(o, r, n),
                          a.head.appendChild(o));
                        break;
                      case `meta`:
                        if (
                          (s = Wf(`meta`, `content`, a).get(
                            r + (n.content || ``),
                          ))
                        ) {
                          for (c = 0; c < s.length; c++)
                            if (
                              ((o = s[c]),
                              o.getAttribute(`content`) ===
                                (n.content == null ? null : `` + n.content) &&
                                o.getAttribute(`name`) ===
                                  (n.name == null ? null : n.name) &&
                                o.getAttribute(`property`) ===
                                  (n.property == null ? null : n.property) &&
                                o.getAttribute(`http-equiv`) ===
                                  (n.httpEquiv == null ? null : n.httpEquiv) &&
                                o.getAttribute(`charset`) ===
                                  (n.charSet == null ? null : n.charSet))
                            ) {
                              s.splice(c, 1);
                              break b;
                            }
                        }
                        ((o = a.createElement(r)),
                          Rd(o, r, n),
                          a.head.appendChild(o));
                        break;
                      default:
                        throw Error(i(468, r));
                    }
                    ((o[st] = e), bt(o), (r = o));
                  }
                  e.stateNode = r;
                } else Gf(a, e.type, e.stateNode);
              else e.stateNode = zf(a, r, e.memoizedProps);
            else
              o === r
                ? r === null &&
                  e.stateNode !== null &&
                  Yc(e, e.memoizedProps, n.memoizedProps)
                : (o === null
                    ? n.stateNode !== null &&
                      ((n = n.stateNode), n.parentNode.removeChild(n))
                    : o.count--,
                  r === null
                    ? Gf(a, e.type, e.stateNode)
                    : zf(a, r, e.memoizedProps));
          }
          break;
        case 27:
          (_l(t, e),
            bl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            n !== null && r & 4 && Yc(e, e.memoizedProps, n.memoizedProps));
          break;
        case 5:
          if (
            (_l(t, e),
            bl(e),
            r & 512 && (nl || n === null || qc(n, n.return)),
            e.flags & 32)
          ) {
            a = e.stateNode;
            try {
              Kt(a, ``);
            } catch (t) {
              J(e, e.return, t);
            }
          }
          (r & 4 &&
            e.stateNode != null &&
            ((a = e.memoizedProps), Yc(e, a, n === null ? a : n.memoizedProps)),
            r & 1024 && (rl = !0));
          break;
        case 6:
          if ((_l(t, e), bl(e), r & 4)) {
            if (e.stateNode === null) throw Error(i(162));
            ((r = e.memoizedProps), (n = e.stateNode));
            try {
              n.nodeValue = r;
            } catch (t) {
              J(e, e.return, t);
            }
          }
          break;
        case 3:
          if (
            ((Uf = null),
            (a = vl),
            (vl = yf(t.containerInfo)),
            _l(t, e),
            (vl = a),
            bl(e),
            r & 4 && n !== null && n.memoizedState.isDehydrated)
          )
            try {
              Ip(t.containerInfo);
            } catch (t) {
              J(e, e.return, t);
            }
          rl && ((rl = !1), xl(e));
          break;
        case 4:
          ((r = vl),
            (vl = yf(e.stateNode.containerInfo)),
            _l(t, e),
            bl(e),
            (vl = r));
          break;
        case 12:
          (_l(t, e), bl(e));
          break;
        case 31:
          (_l(t, e),
            bl(e),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), gl(e, r))));
          break;
        case 13:
          (_l(t, e),
            bl(e),
            e.child.flags & 8192 &&
              (e.memoizedState !== null) !=
                (n !== null && n.memoizedState !== null) &&
              (nu = Ee()),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), gl(e, r))));
          break;
        case 22:
          a = e.memoizedState !== null;
          var l = n !== null && n.memoizedState !== null,
            u = tl,
            d = nl;
          if (
            ((tl = u || a),
            (nl = d || l),
            _l(t, e),
            (nl = d),
            (tl = u),
            bl(e),
            r & 8192)
          )
            a: for (
              t = e.stateNode,
                t._visibility = a ? t._visibility & -2 : t._visibility | 1,
                a && (n === null || l || tl || nl || Cl(e)),
                n = null,
                t = e;
              ;
            ) {
              if (t.tag === 5 || t.tag === 26) {
                if (n === null) {
                  l = n = t;
                  try {
                    if (((o = l.stateNode), a))
                      ((s = o.style),
                        typeof s.setProperty == `function`
                          ? s.setProperty(`display`, `none`, `important`)
                          : (s.display = `none`));
                    else {
                      c = l.stateNode;
                      var f = l.memoizedProps.style,
                        p =
                          f != null && f.hasOwnProperty(`display`)
                            ? f.display
                            : null;
                      c.style.display =
                        p == null || typeof p == `boolean`
                          ? ``
                          : (`` + p).trim();
                    }
                  } catch (e) {
                    J(l, l.return, e);
                  }
                }
              } else if (t.tag === 6) {
                if (n === null) {
                  l = t;
                  try {
                    l.stateNode.nodeValue = a ? `` : l.memoizedProps;
                  } catch (e) {
                    J(l, l.return, e);
                  }
                }
              } else if (t.tag === 18) {
                if (n === null) {
                  l = t;
                  try {
                    var m = l.stateNode;
                    a ? nf(m, !0) : nf(l.stateNode, !1);
                  } catch (e) {
                    J(l, l.return, e);
                  }
                }
              } else if (
                ((t.tag !== 22 && t.tag !== 23) ||
                  t.memoizedState === null ||
                  t === e) &&
                t.child !== null
              ) {
                ((t.child.return = t), (t = t.child));
                continue;
              }
              if (t === e) break a;
              for (; t.sibling === null; ) {
                if (t.return === null || t.return === e) break a;
                (n === t && (n = null), (t = t.return));
              }
              (n === t && (n = null),
                (t.sibling.return = t.return),
                (t = t.sibling));
            }
          r & 4 &&
            ((r = e.updateQueue),
            r !== null &&
              ((n = r.retryQueue),
              n !== null && ((r.retryQueue = null), gl(e, n))));
          break;
        case 19:
          (_l(t, e),
            bl(e),
            r & 4 &&
              ((r = e.updateQueue),
              r !== null && ((e.updateQueue = null), gl(e, r))));
          break;
        case 30:
          break;
        case 21:
          break;
        default:
          (_l(t, e), bl(e));
      }
    }
    function bl(e) {
      var t = e.flags;
      if (t & 2) {
        try {
          for (var n, r = e.return; r !== null; ) {
            if (Xc(r)) {
              n = r;
              break;
            }
            r = r.return;
          }
          if (n == null) throw Error(i(160));
          switch (n.tag) {
            case 27:
              var a = n.stateNode;
              $c(e, Zc(e), a);
              break;
            case 5:
              var o = n.stateNode;
              (n.flags & 32 && (Kt(o, ``), (n.flags &= -33)), $c(e, Zc(e), o));
              break;
            case 3:
            case 4:
              var s = n.stateNode.containerInfo;
              Qc(e, Zc(e), s);
              break;
            default:
              throw Error(i(161));
          }
        } catch (t) {
          J(e, e.return, t);
        }
        e.flags &= -3;
      }
      t & 4096 && (e.flags &= -4097);
    }
    function xl(e) {
      if (e.subtreeFlags & 1024)
        for (e = e.child; e !== null; ) {
          var t = e;
          (xl(t),
            t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
            (e = e.sibling));
        }
    }
    function Sl(e, t) {
      if (t.subtreeFlags & 8772)
        for (t = t.child; t !== null; )
          (sl(e, t.alternate, t), (t = t.sibling));
    }
    function Cl(e) {
      for (e = e.child; e !== null; ) {
        var t = e;
        switch (t.tag) {
          case 0:
          case 11:
          case 14:
          case 15:
            (Uc(4, t, t.return), Cl(t));
            break;
          case 1:
            qc(t, t.return);
            var n = t.stateNode;
            (typeof n.componentWillUnmount == `function` && Gc(t, t.return, n),
              Cl(t));
            break;
          case 27:
            gf(t.stateNode);
          case 26:
          case 5:
            (qc(t, t.return), Cl(t));
            break;
          case 22:
            t.memoizedState === null && Cl(t);
            break;
          case 30:
            Cl(t);
            break;
          default:
            Cl(t);
        }
        e = e.sibling;
      }
    }
    function wl(e, t, n) {
      for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null; ) {
        var r = t.alternate,
          i = e,
          a = t,
          o = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            (wl(i, a, n), Hc(4, a));
            break;
          case 1:
            if (
              (wl(i, a, n),
              (r = a),
              (i = r.stateNode),
              typeof i.componentDidMount == `function`)
            )
              try {
                i.componentDidMount();
              } catch (e) {
                J(r, r.return, e);
              }
            if (((r = a), (i = r.updateQueue), i !== null)) {
              var s = r.stateNode;
              try {
                var c = i.shared.hiddenCallbacks;
                if (c !== null)
                  for (
                    i.shared.hiddenCallbacks = null, i = 0;
                    i < c.length;
                    i++
                  )
                    Za(c[i], s);
              } catch (e) {
                J(r, r.return, e);
              }
            }
            (n && o & 64 && Wc(a), Kc(a, a.return));
            break;
          case 27:
            el(a);
          case 26:
          case 5:
            (wl(i, a, n), n && r === null && o & 4 && Jc(a), Kc(a, a.return));
            break;
          case 12:
            wl(i, a, n);
            break;
          case 31:
            (wl(i, a, n), n && o & 4 && pl(i, a));
            break;
          case 13:
            (wl(i, a, n), n && o & 4 && ml(i, a));
            break;
          case 22:
            (a.memoizedState === null && wl(i, a, n), Kc(a, a.return));
            break;
          case 30:
            break;
          default:
            wl(i, a, n);
        }
        t = t.sibling;
      }
    }
    function Tl(e, t) {
      var n = null;
      (e !== null &&
        e.memoizedState !== null &&
        e.memoizedState.cachePool !== null &&
        (n = e.memoizedState.cachePool.pool),
        (e = null),
        t.memoizedState !== null &&
          t.memoizedState.cachePool !== null &&
          (e = t.memoizedState.cachePool.pool),
        e !== n && (e != null && e.refCount++, n != null && ua(n)));
    }
    function El(e, t) {
      ((e = null),
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        (t = t.memoizedState.cache),
        t !== e && (t.refCount++, e != null && ua(e)));
    }
    function Dl(e, t, n, r) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) (Ol(e, t, n, r), (t = t.sibling));
    }
    function Ol(e, t, n, r) {
      var i = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          (Dl(e, t, n, r), i & 2048 && Hc(9, t));
          break;
        case 1:
          Dl(e, t, n, r);
          break;
        case 3:
          (Dl(e, t, n, r),
            i & 2048 &&
              ((e = null),
              t.alternate !== null && (e = t.alternate.memoizedState.cache),
              (t = t.memoizedState.cache),
              t !== e && (t.refCount++, e != null && ua(e))));
          break;
        case 12:
          if (i & 2048) {
            (Dl(e, t, n, r), (e = t.stateNode));
            try {
              var a = t.memoizedProps,
                o = a.id,
                s = a.onPostCommit;
              typeof s == `function` &&
                s(
                  o,
                  t.alternate === null ? `mount` : `update`,
                  e.passiveEffectDuration,
                  -0,
                );
            } catch (e) {
              J(t, t.return, e);
            }
          } else Dl(e, t, n, r);
          break;
        case 31:
          Dl(e, t, n, r);
          break;
        case 13:
          Dl(e, t, n, r);
          break;
        case 23:
          break;
        case 22:
          ((a = t.stateNode),
            (o = t.alternate),
            t.memoizedState === null
              ? a._visibility & 2
                ? Dl(e, t, n, r)
                : ((a._visibility |= 2),
                  kl(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1))
              : a._visibility & 2
                ? Dl(e, t, n, r)
                : Al(e, t),
            i & 2048 && Tl(o, t));
          break;
        case 24:
          (Dl(e, t, n, r), i & 2048 && El(t.alternate, t));
          break;
        default:
          Dl(e, t, n, r);
      }
    }
    function kl(e, t, n, r, i) {
      for (
        i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child;
        t !== null;
      ) {
        var a = e,
          o = t,
          s = n,
          c = r,
          l = o.flags;
        switch (o.tag) {
          case 0:
          case 11:
          case 15:
            (kl(a, o, s, c, i), Hc(8, o));
            break;
          case 23:
            break;
          case 22:
            var u = o.stateNode;
            (o.memoizedState === null
              ? ((u._visibility |= 2), kl(a, o, s, c, i))
              : u._visibility & 2
                ? kl(a, o, s, c, i)
                : Al(a, o),
              i && l & 2048 && Tl(o.alternate, o));
            break;
          case 24:
            (kl(a, o, s, c, i), i && l & 2048 && El(o.alternate, o));
            break;
          default:
            kl(a, o, s, c, i);
        }
        t = t.sibling;
      }
    }
    function Al(e, t) {
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; ) {
          var n = e,
            r = t,
            i = r.flags;
          switch (r.tag) {
            case 22:
              (Al(n, r), i & 2048 && Tl(r.alternate, r));
              break;
            case 24:
              (Al(n, r), i & 2048 && El(r.alternate, r));
              break;
            default:
              Al(n, r);
          }
          t = t.sibling;
        }
    }
    var jl = 8192;
    function Ml(e, t, n) {
      if (e.subtreeFlags & jl)
        for (e = e.child; e !== null; ) (Nl(e, t, n), (e = e.sibling));
    }
    function Nl(e, t, n) {
      switch (e.tag) {
        case 26:
          (Ml(e, t, n),
            e.flags & jl &&
              e.memoizedState !== null &&
              Jf(n, vl, e.memoizedState, e.memoizedProps));
          break;
        case 5:
          Ml(e, t, n);
          break;
        case 3:
        case 4:
          var r = vl;
          ((vl = yf(e.stateNode.containerInfo)), Ml(e, t, n), (vl = r));
          break;
        case 22:
          e.memoizedState === null &&
            ((r = e.alternate),
            r !== null && r.memoizedState !== null
              ? ((r = jl), (jl = 16777216), Ml(e, t, n), (jl = r))
              : Ml(e, t, n));
          break;
        default:
          Ml(e, t, n);
      }
    }
    function Pl(e) {
      var t = e.alternate;
      if (t !== null && ((e = t.child), e !== null)) {
        t.child = null;
        do ((t = e.sibling), (e.sibling = null), (e = t));
        while (e !== null);
      }
    }
    function Fl(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((al = r), Rl(r, e));
          }
        Pl(e);
      }
      if (e.subtreeFlags & 10256)
        for (e = e.child; e !== null; ) (Il(e), (e = e.sibling));
    }
    function Il(e) {
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (Fl(e), e.flags & 2048 && Uc(9, e, e.return));
          break;
        case 3:
          Fl(e);
          break;
        case 12:
          Fl(e);
          break;
        case 22:
          var t = e.stateNode;
          e.memoizedState !== null &&
          t._visibility & 2 &&
          (e.return === null || e.return.tag !== 13)
            ? ((t._visibility &= -3), Ll(e))
            : Fl(e);
          break;
        default:
          Fl(e);
      }
    }
    function Ll(e) {
      var t = e.deletions;
      if (e.flags & 16) {
        if (t !== null)
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            ((al = r), Rl(r, e));
          }
        Pl(e);
      }
      for (e = e.child; e !== null; ) {
        switch (((t = e), t.tag)) {
          case 0:
          case 11:
          case 15:
            (Uc(8, t, t.return), Ll(t));
            break;
          case 22:
            ((n = t.stateNode),
              n._visibility & 2 && ((n._visibility &= -3), Ll(t)));
            break;
          default:
            Ll(t);
        }
        e = e.sibling;
      }
    }
    function Rl(e, t) {
      for (; al !== null; ) {
        var n = al;
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            Uc(8, n, t);
            break;
          case 23:
          case 22:
            if (
              n.memoizedState !== null &&
              n.memoizedState.cachePool !== null
            ) {
              var r = n.memoizedState.cachePool.pool;
              r != null && r.refCount++;
            }
            break;
          case 24:
            ua(n.memoizedState.cache);
        }
        if (((r = n.child), r !== null)) ((r.return = n), (al = r));
        else
          a: for (n = e; al !== null; ) {
            r = al;
            var i = r.sibling,
              a = r.return;
            if ((cl(r), r === n)) {
              al = null;
              break a;
            }
            if (i !== null) {
              ((i.return = a), (al = i));
              break a;
            }
            al = a;
          }
      }
    }
    var zl = {
        getCacheForType: function (e) {
          var t = na(ca),
            n = t.data.get(e);
          return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
        },
        cacheSignal: function () {
          return na(ca).controller.signal;
        },
      },
      Bl = typeof WeakMap == `function` ? WeakMap : Map,
      W = 0,
      Vl = null,
      G = null,
      K = 0,
      q = 0,
      Hl = null,
      Ul = !1,
      Wl = !1,
      Gl = !1,
      Kl = 0,
      ql = 0,
      Jl = 0,
      Yl = 0,
      Xl = 0,
      Zl = 0,
      Ql = 0,
      $l = null,
      eu = null,
      tu = !1,
      nu = 0,
      ru = 0,
      iu = 1 / 0,
      au = null,
      ou = null,
      su = 0,
      cu = null,
      lu = null,
      uu = 0,
      du = 0,
      fu = null,
      pu = null,
      mu = 0,
      hu = null;
    function gu() {
      return W & 2 && K !== 0 ? K & -K : P.T === null ? it() : md();
    }
    function _u() {
      if (Zl === 0)
        if (!(K & 536870912) || R) {
          var e = Ue;
          ((Ue <<= 1), !(Ue & 3932160) && (Ue = 262144), (Zl = e));
        } else Zl = 536870912;
      return ((e = ro.current), e !== null && (e.flags |= 32), Zl);
    }
    function vu(e, t, n) {
      (((e === Vl && (q === 2 || q === 9)) || e.cancelPendingCommit !== null) &&
        (Tu(e, 0), Su(e, K, Zl, !1)),
        Ze(e, n),
        (!(W & 2) || e !== Vl) &&
          (e === Vl && (!(W & 2) && (Yl |= n), ql === 4 && Su(e, K, Zl, !1)),
          od(e)));
    }
    function yu(e, t, n) {
      if (W & 6) throw Error(i(327));
      var r = (!n && (t & 127) == 0 && (t & e.expiredLanes) === 0) || qe(e, t),
        a = r ? Nu(e, t) : ju(e, t, !0),
        o = r;
      do {
        if (a === 0) {
          Wl && !r && Su(e, t, 0, !1);
          break;
        } else {
          if (((n = e.current.alternate), o && !xu(n))) {
            ((a = ju(e, t, !1)), (o = !1));
            continue;
          }
          if (a === 2) {
            if (((o = t), e.errorRecoveryDisabledLanes & o)) var s = 0;
            else
              ((s = e.pendingLanes & -536870913),
                (s = s === 0 ? (s & 536870912 ? 536870912 : 0) : s));
            if (s !== 0) {
              t = s;
              a: {
                var c = e;
                a = $l;
                var l = c.current.memoizedState.isDehydrated;
                if (
                  (l && (Tu(c, s).flags |= 256), (s = ju(c, s, !1)), s !== 2)
                ) {
                  if (Gl && !l) {
                    ((c.errorRecoveryDisabledLanes |= o), (Yl |= o), (a = 4));
                    break a;
                  }
                  ((o = eu),
                    (eu = a),
                    o !== null &&
                      (eu === null ? (eu = o) : eu.push.apply(eu, o)));
                }
                a = s;
              }
              if (((o = !1), a !== 2)) continue;
            }
          }
          if (a === 1) {
            (Tu(e, 0), Su(e, t, 0, !0));
            break;
          }
          a: {
            switch (((r = e), (o = a), o)) {
              case 0:
              case 1:
                throw Error(i(345));
              case 4:
                if ((t & 4194048) !== t) break;
              case 6:
                Su(r, t, Zl, !Ul);
                break a;
              case 2:
                eu = null;
                break;
              case 3:
              case 5:
                break;
              default:
                throw Error(i(329));
            }
            if ((t & 62914560) === t && ((a = nu + 300 - Ee()), 10 < a)) {
              if ((Su(r, t, Zl, !Ul), Ke(r, 0, !0) !== 0)) break a;
              ((uu = t),
                (r.timeoutHandle = Yd(
                  bu.bind(
                    null,
                    r,
                    n,
                    eu,
                    au,
                    tu,
                    t,
                    Zl,
                    Yl,
                    Ql,
                    Ul,
                    o,
                    `Throttled`,
                    -0,
                    0,
                  ),
                  a,
                )));
              break a;
            }
            bu(r, n, eu, au, tu, t, Zl, Yl, Ql, Ul, o, null, -0, 0);
          }
        }
        break;
      } while (1);
      od(e);
    }
    function bu(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
      if (
        ((e.timeoutHandle = -1),
        (d = t.subtreeFlags),
        d & 8192 || (d & 16785408) == 16785408)
      ) {
        ((d = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: en,
        }),
          Nl(t, a, d));
        var m =
          (a & 62914560) === a
            ? nu - Ee()
            : (a & 4194048) === a
              ? ru - Ee()
              : 0;
        if (((m = Xf(d, m)), m !== null)) {
          ((uu = a),
            (e.cancelPendingCommit = m(
              Bu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p),
            )),
            Su(e, a, o, !l));
          return;
        }
      }
      Bu(e, t, a, n, r, i, o, s, c);
    }
    function xu(e) {
      for (var t = e; ; ) {
        var n = t.tag;
        if (
          (n === 0 || n === 11 || n === 15) &&
          t.flags & 16384 &&
          ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
        )
          for (var r = 0; r < n.length; r++) {
            var i = n[r],
              a = i.getSnapshot;
            i = i.value;
            try {
              if (!Cr(a(), i)) return !1;
            } catch {
              return !1;
            }
          }
        if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
          ((n.return = t), (t = n));
        else {
          if (t === e) break;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e) return !0;
            t = t.return;
          }
          ((t.sibling.return = t.return), (t = t.sibling));
        }
      }
      return !0;
    }
    function Su(e, t, n, r) {
      ((t &= ~Xl),
        (t &= ~Yl),
        (e.suspendedLanes |= t),
        (e.pingedLanes &= ~t),
        r && (e.warmLanes |= t),
        (r = e.expirationTimes));
      for (var i = t; 0 < i; ) {
        var a = 31 - Re(i),
          o = 1 << a;
        ((r[a] = -1), (i &= ~o));
      }
      n !== 0 && $e(e, n, t);
    }
    function Cu() {
      return W & 6 ? !0 : (sd(0, !1), !1);
    }
    function wu() {
      if (G !== null) {
        if (q === 0) var e = G.return;
        else ((e = G), (Ji = qi = null), ko(e), (Na = null), (Pa = 0), (e = G));
        for (; e !== null; ) (Vc(e.alternate, e), (e = e.return));
        G = null;
      }
    }
    function Tu(e, t) {
      var n = e.timeoutHandle;
      (n !== -1 && ((e.timeoutHandle = -1), Xd(n)),
        (n = e.cancelPendingCommit),
        n !== null && ((e.cancelPendingCommit = null), n()),
        (uu = 0),
        wu(),
        (Vl = e),
        (G = n = di(e.current, null)),
        (K = t),
        (q = 0),
        (Hl = null),
        (Ul = !1),
        (Wl = qe(e, t)),
        (Gl = !1),
        (Ql = Zl = Xl = Yl = Jl = ql = 0),
        (eu = $l = null),
        (tu = !1),
        t & 8 && (t |= t & 32));
      var r = e.entangledLanes;
      if (r !== 0)
        for (e = e.entanglements, r &= t; 0 < r; ) {
          var i = 31 - Re(r),
            a = 1 << i;
          ((t |= e[i]), (r &= ~a));
        }
      return ((Kl = t), ti(), n);
    }
    function Eu(e, t) {
      ((B = null),
        (P.H = Rs),
        t === Ca || t === Ta
          ? ((t = ja()), (q = 3))
          : t === wa
            ? ((t = ja()), (q = 4))
            : (q =
                t === nc
                  ? 8
                  : typeof t == `object` && t && typeof t.then == `function`
                    ? 6
                    : 1),
        (Hl = t),
        G === null && ((ql = 1), Xs(e, yi(t, e.current))));
    }
    function Du() {
      var e = ro.current;
      return e === null
        ? !0
        : (K & 4194048) === K
          ? io === null
          : (K & 62914560) === K || K & 536870912
            ? e === io
            : !1;
    }
    function Ou() {
      var e = P.H;
      return ((P.H = Rs), e === null ? Rs : e);
    }
    function ku() {
      var e = P.A;
      return ((P.A = zl), e);
    }
    function Au() {
      ((ql = 4),
        Ul || ((K & 4194048) !== K && ro.current !== null) || (Wl = !0),
        (!(Jl & 134217727) && !(Yl & 134217727)) ||
          Vl === null ||
          Su(Vl, K, Zl, !1));
    }
    function ju(e, t, n) {
      var r = W;
      W |= 2;
      var i = Ou(),
        a = ku();
      ((Vl !== e || K !== t) && ((au = null), Tu(e, t)), (t = !1));
      var o = ql;
      a: do
        try {
          if (q !== 0 && G !== null) {
            var s = G,
              c = Hl;
            switch (q) {
              case 8:
                (wu(), (o = 6));
                break a;
              case 3:
              case 2:
              case 9:
              case 6:
                ro.current === null && (t = !0);
                var l = q;
                if (((q = 0), (Hl = null), Lu(e, s, c, l), n && Wl)) {
                  o = 0;
                  break a;
                }
                break;
              default:
                ((l = q), (q = 0), (Hl = null), Lu(e, s, c, l));
            }
          }
          (Mu(), (o = ql));
          break;
        } catch (t) {
          Eu(e, t);
        }
      while (1);
      return (
        t && e.shellSuspendCounter++,
        (Ji = qi = null),
        (W = r),
        (P.H = i),
        (P.A = a),
        G === null && ((Vl = null), (K = 0), ti()),
        o
      );
    }
    function Mu() {
      for (; G !== null; ) Fu(G);
    }
    function Nu(e, t) {
      var n = W;
      W |= 2;
      var r = Ou(),
        a = ku();
      Vl !== e || K !== t
        ? ((au = null), (iu = Ee() + 500), Tu(e, t))
        : (Wl = qe(e, t));
      a: do
        try {
          if (q !== 0 && G !== null) {
            t = G;
            var o = Hl;
            b: switch (q) {
              case 1:
                ((q = 0), (Hl = null), Lu(e, t, o, 1));
                break;
              case 2:
              case 9:
                if (Da(o)) {
                  ((q = 0), (Hl = null), Iu(t));
                  break;
                }
                ((t = function () {
                  ((q !== 2 && q !== 9) || Vl !== e || (q = 7), od(e));
                }),
                  o.then(t, t));
                break a;
              case 3:
                q = 7;
                break a;
              case 4:
                q = 5;
                break a;
              case 7:
                Da(o)
                  ? ((q = 0), (Hl = null), Iu(t))
                  : ((q = 0), (Hl = null), Lu(e, t, o, 7));
                break;
              case 5:
                var s = null;
                switch (G.tag) {
                  case 26:
                    s = G.memoizedState;
                  case 5:
                  case 27:
                    var c = G;
                    if (s ? qf(s) : c.stateNode.complete) {
                      ((q = 0), (Hl = null));
                      var l = c.sibling;
                      if (l !== null) G = l;
                      else {
                        var u = c.return;
                        u === null ? (G = null) : ((G = u), Ru(u));
                      }
                      break b;
                    }
                }
                ((q = 0), (Hl = null), Lu(e, t, o, 5));
                break;
              case 6:
                ((q = 0), (Hl = null), Lu(e, t, o, 6));
                break;
              case 8:
                (wu(), (ql = 6));
                break a;
              default:
                throw Error(i(462));
            }
          }
          Pu();
          break;
        } catch (t) {
          Eu(e, t);
        }
      while (1);
      return (
        (Ji = qi = null),
        (P.H = r),
        (P.A = a),
        (W = n),
        G === null ? ((Vl = null), (K = 0), ti(), ql) : 0
      );
    }
    function Pu() {
      for (; G !== null && !we(); ) Fu(G);
    }
    function Fu(e) {
      var t = Mc(e.alternate, e, Kl);
      ((e.memoizedProps = e.pendingProps), t === null ? Ru(e) : (G = t));
    }
    function Iu(e) {
      var t = e,
        n = t.alternate;
      switch (t.tag) {
        case 15:
        case 0:
          t = gc(n, t, t.pendingProps, t.type, void 0, K);
          break;
        case 11:
          t = gc(n, t, t.pendingProps, t.type.render, t.ref, K);
          break;
        case 5:
          ko(t);
        default:
          (Vc(n, t), (t = G = fi(t, Kl)), (t = Mc(n, t, Kl)));
      }
      ((e.memoizedProps = e.pendingProps), t === null ? Ru(e) : (G = t));
    }
    function Lu(e, t, n, r) {
      ((Ji = qi = null), ko(t), (Na = null), (Pa = 0));
      var i = t.return;
      try {
        if (tc(e, i, t, n, K)) {
          ((ql = 1), Xs(e, yi(n, e.current)), (G = null));
          return;
        }
      } catch (t) {
        if (i !== null) throw ((G = i), t);
        ((ql = 1), Xs(e, yi(n, e.current)), (G = null));
        return;
      }
      t.flags & 32768
        ? (R || r === 1
            ? (e = !0)
            : Wl || K & 536870912
              ? (e = !1)
              : ((Ul = e = !0),
                (r === 2 || r === 9 || r === 3 || r === 6) &&
                  ((r = ro.current),
                  r !== null && r.tag === 13 && (r.flags |= 16384))),
          zu(t, e))
        : Ru(t);
    }
    function Ru(e) {
      var t = e;
      do {
        if (t.flags & 32768) {
          zu(t, Ul);
          return;
        }
        e = t.return;
        var n = zc(t.alternate, t, Kl);
        if (n !== null) {
          G = n;
          return;
        }
        if (((t = t.sibling), t !== null)) {
          G = t;
          return;
        }
        G = t = e;
      } while (t !== null);
      ql === 0 && (ql = 5);
    }
    function zu(e, t) {
      do {
        var n = Bc(e.alternate, e);
        if (n !== null) {
          ((n.flags &= 32767), (G = n));
          return;
        }
        if (
          ((n = e.return),
          n !== null &&
            ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
          !t && ((e = e.sibling), e !== null))
        ) {
          G = e;
          return;
        }
        G = e = n;
      } while (e !== null);
      ((ql = 6), (G = null));
    }
    function Bu(e, t, n, r, a, o, s, c, l) {
      e.cancelPendingCommit = null;
      do Gu();
      while (su !== 0);
      if (W & 6) throw Error(i(327));
      if (t !== null) {
        if (t === e.current) throw Error(i(177));
        if (
          ((o = t.lanes | t.childLanes),
          (o |= ei),
          Qe(e, n, o, s, c, l),
          e === Vl && ((G = Vl = null), (K = 0)),
          (lu = t),
          (cu = e),
          (uu = n),
          (du = o),
          (fu = a),
          (pu = r),
          t.subtreeFlags & 10256 || t.flags & 10256
            ? ((e.callbackNode = null),
              (e.callbackPriority = 0),
              $u(Ae, function () {
                return (Ku(), null);
              }))
            : ((e.callbackNode = null), (e.callbackPriority = 0)),
          (r = (t.flags & 13878) != 0),
          t.subtreeFlags & 13878 || r)
        ) {
          ((r = P.T), (P.T = null), (a = F.p), (F.p = 2), (s = W), (W |= 4));
          try {
            ol(e, t, n);
          } finally {
            ((W = s), (F.p = a), (P.T = r));
          }
        }
        ((su = 1), Vu(), Hu(), Uu());
      }
    }
    function Vu() {
      if (su === 1) {
        su = 0;
        var e = cu,
          t = lu,
          n = (t.flags & 13878) != 0;
        if (t.subtreeFlags & 13878 || n) {
          ((n = P.T), (P.T = null));
          var r = F.p;
          F.p = 2;
          var i = W;
          W |= 4;
          try {
            yl(t, e);
            var a = Ud,
              o = Or(e.containerInfo),
              s = a.focusedElem,
              c = a.selectionRange;
            if (
              o !== s &&
              s &&
              s.ownerDocument &&
              Dr(s.ownerDocument.documentElement, s)
            ) {
              if (c !== null && kr(s)) {
                var l = c.start,
                  u = c.end;
                if ((u === void 0 && (u = l), `selectionStart` in s))
                  ((s.selectionStart = l),
                    (s.selectionEnd = Math.min(u, s.value.length)));
                else {
                  var d = s.ownerDocument || document,
                    f = (d && d.defaultView) || window;
                  if (f.getSelection) {
                    var p = f.getSelection(),
                      m = s.textContent.length,
                      h = Math.min(c.start, m),
                      g = c.end === void 0 ? h : Math.min(c.end, m);
                    !p.extend && h > g && ((o = g), (g = h), (h = o));
                    var _ = Er(s, h),
                      v = Er(s, g);
                    if (
                      _ &&
                      v &&
                      (p.rangeCount !== 1 ||
                        p.anchorNode !== _.node ||
                        p.anchorOffset !== _.offset ||
                        p.focusNode !== v.node ||
                        p.focusOffset !== v.offset)
                    ) {
                      var y = d.createRange();
                      (y.setStart(_.node, _.offset),
                        p.removeAllRanges(),
                        h > g
                          ? (p.addRange(y), p.extend(v.node, v.offset))
                          : (y.setEnd(v.node, v.offset), p.addRange(y)));
                    }
                  }
                }
              }
              for (d = [], p = s; (p = p.parentNode); )
                p.nodeType === 1 &&
                  d.push({ element: p, left: p.scrollLeft, top: p.scrollTop });
              for (
                typeof s.focus == `function` && s.focus(), s = 0;
                s < d.length;
                s++
              ) {
                var b = d[s];
                ((b.element.scrollLeft = b.left),
                  (b.element.scrollTop = b.top));
              }
            }
            ((up = !!Hd), (Ud = Hd = null));
          } finally {
            ((W = i), (F.p = r), (P.T = n));
          }
        }
        ((e.current = t), (su = 2));
      }
    }
    function Hu() {
      if (su === 2) {
        su = 0;
        var e = cu,
          t = lu,
          n = (t.flags & 8772) != 0;
        if (t.subtreeFlags & 8772 || n) {
          ((n = P.T), (P.T = null));
          var r = F.p;
          F.p = 2;
          var i = W;
          W |= 4;
          try {
            sl(e, t.alternate, t);
          } finally {
            ((W = i), (F.p = r), (P.T = n));
          }
        }
        su = 3;
      }
    }
    function Uu() {
      if (su === 4 || su === 3) {
        ((su = 0), Te());
        var e = cu,
          t = lu,
          n = uu,
          r = pu;
        t.subtreeFlags & 10256 || t.flags & 10256
          ? (su = 5)
          : ((su = 0), (lu = cu = null), Wu(e, e.pendingLanes));
        var i = e.pendingLanes;
        if (
          (i === 0 && (ou = null),
          rt(n),
          (t = t.stateNode),
          Ie && typeof Ie.onCommitFiberRoot == `function`)
        )
          try {
            Ie.onCommitFiberRoot(Fe, t, void 0, (t.current.flags & 128) == 128);
          } catch {}
        if (r !== null) {
          ((t = P.T), (i = F.p), (F.p = 2), (P.T = null));
          try {
            for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
              var s = r[o];
              a(s.value, { componentStack: s.stack });
            }
          } finally {
            ((P.T = t), (F.p = i));
          }
        }
        (uu & 3 && Gu(),
          od(e),
          (i = e.pendingLanes),
          n & 261930 && i & 42
            ? e === hu
              ? mu++
              : ((mu = 0), (hu = e))
            : (mu = 0),
          sd(0, !1));
      }
    }
    function Wu(e, t) {
      (e.pooledCacheLanes &= t) === 0 &&
        ((t = e.pooledCache), t != null && ((e.pooledCache = null), ua(t)));
    }
    function Gu() {
      return (Vu(), Hu(), Uu(), Ku());
    }
    function Ku() {
      if (su !== 5) return !1;
      var e = cu,
        t = du;
      du = 0;
      var n = rt(uu),
        r = P.T,
        a = F.p;
      try {
        ((F.p = 32 > n ? 32 : n), (P.T = null), (n = fu), (fu = null));
        var o = cu,
          s = uu;
        if (((su = 0), (lu = cu = null), (uu = 0), W & 6)) throw Error(i(331));
        var c = W;
        if (
          ((W |= 4),
          Il(o.current),
          Ol(o, o.current, s, n),
          (W = c),
          sd(0, !1),
          Ie && typeof Ie.onPostCommitFiberRoot == `function`)
        )
          try {
            Ie.onPostCommitFiberRoot(Fe, o);
          } catch {}
        return !0;
      } finally {
        ((F.p = a), (P.T = r), Wu(e, t));
      }
    }
    function qu(e, t, n) {
      ((t = yi(n, t)),
        (t = Qs(e.stateNode, t, 2)),
        (e = Ga(e, t, 2)),
        e !== null && (Ze(e, 2), od(e)));
    }
    function J(e, t, n) {
      if (e.tag === 3) qu(e, e, n);
      else
        for (; t !== null; ) {
          if (t.tag === 3) {
            qu(t, e, n);
            break;
          } else if (t.tag === 1) {
            var r = t.stateNode;
            if (
              typeof t.type.getDerivedStateFromError == `function` ||
              (typeof r.componentDidCatch == `function` &&
                (ou === null || !ou.has(r)))
            ) {
              ((e = yi(n, e)),
                (n = $s(2)),
                (r = Ga(t, n, 2)),
                r !== null && (ec(n, r, t, e), Ze(r, 2), od(r)));
              break;
            }
          }
          t = t.return;
        }
    }
    function Ju(e, t, n) {
      var r = e.pingCache;
      if (r === null) {
        r = e.pingCache = new Bl();
        var i = new Set();
        r.set(t, i);
      } else ((i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i)));
      i.has(n) ||
        ((Gl = !0), i.add(n), (e = Yu.bind(null, e, t, n)), t.then(e, e));
    }
    function Yu(e, t, n) {
      var r = e.pingCache;
      (r !== null && r.delete(t),
        (e.pingedLanes |= e.suspendedLanes & n),
        (e.warmLanes &= ~n),
        Vl === e &&
          (K & n) === n &&
          (ql === 4 || (ql === 3 && (K & 62914560) === K && 300 > Ee() - nu)
            ? !(W & 2) && Tu(e, 0)
            : (Xl |= n),
          Ql === K && (Ql = 0)),
        od(e));
    }
    function Xu(e, t) {
      (t === 0 && (t = Ye()), (e = ii(e, t)), e !== null && (Ze(e, t), od(e)));
    }
    function Zu(e) {
      var t = e.memoizedState,
        n = 0;
      (t !== null && (n = t.retryLane), Xu(e, n));
    }
    function Qu(e, t) {
      var n = 0;
      switch (e.tag) {
        case 31:
        case 13:
          var r = e.stateNode,
            a = e.memoizedState;
          a !== null && (n = a.retryLane);
          break;
        case 19:
          r = e.stateNode;
          break;
        case 22:
          r = e.stateNode._retryCache;
          break;
        default:
          throw Error(i(314));
      }
      (r !== null && r.delete(t), Xu(e, n));
    }
    function $u(e, t) {
      return Se(e, t);
    }
    var ed = null,
      td = null,
      nd = !1,
      rd = !1,
      id = !1,
      ad = 0;
    function od(e) {
      (e !== td &&
        e.next === null &&
        (td === null ? (ed = td = e) : (td = td.next = e)),
        (rd = !0),
        nd || ((nd = !0), pd()));
    }
    function sd(e, t) {
      if (!id && rd) {
        id = !0;
        do
          for (var n = !1, r = ed; r !== null; ) {
            if (!t)
              if (e !== 0) {
                var i = r.pendingLanes;
                if (i === 0) var a = 0;
                else {
                  var o = r.suspendedLanes,
                    s = r.pingedLanes;
                  ((a = (1 << (31 - Re(42 | e) + 1)) - 1),
                    (a &= i & ~(o & ~s)),
                    (a = a & 201326741 ? (a & 201326741) | 1 : a ? a | 2 : 0));
                }
                a !== 0 && ((n = !0), fd(r, a));
              } else
                ((a = K),
                  (a = Ke(
                    r,
                    r === Vl ? a : 0,
                    r.cancelPendingCommit !== null || r.timeoutHandle !== -1,
                  )),
                  !(a & 3) || qe(r, a) || ((n = !0), fd(r, a)));
            r = r.next;
          }
        while (n);
        id = !1;
      }
    }
    function cd() {
      ld();
    }
    function ld() {
      rd = nd = !1;
      var e = 0;
      ad !== 0 && Jd() && (e = ad);
      for (var t = Ee(), n = null, r = ed; r !== null; ) {
        var i = r.next,
          a = ud(r, t);
        (a === 0
          ? ((r.next = null),
            n === null ? (ed = i) : (n.next = i),
            i === null && (td = n))
          : ((n = r), (e !== 0 || a & 3) && (rd = !0)),
          (r = i));
      }
      ((su !== 0 && su !== 5) || sd(e, !1), ad !== 0 && (ad = 0));
    }
    function ud(e, t) {
      for (
        var n = e.suspendedLanes,
          r = e.pingedLanes,
          i = e.expirationTimes,
          a = e.pendingLanes & -62914561;
        0 < a;
      ) {
        var o = 31 - Re(a),
          s = 1 << o,
          c = i[o];
        (c === -1
          ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Je(s, t))
          : c <= t && (e.expiredLanes |= s),
          (a &= ~s));
      }
      if (
        ((t = Vl),
        (n = K),
        (n = Ke(
          e,
          e === t ? n : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        (r = e.callbackNode),
        n === 0 ||
          (e === t && (q === 2 || q === 9)) ||
          e.cancelPendingCommit !== null)
      )
        return (
          r !== null && r !== null && Ce(r),
          (e.callbackNode = null),
          (e.callbackPriority = 0)
        );
      if (!(n & 3) || qe(e, n)) {
        if (((t = n & -n), t === e.callbackPriority)) return t;
        switch ((r !== null && Ce(r), rt(n))) {
          case 2:
          case 8:
            n = ke;
            break;
          case 32:
            n = Ae;
            break;
          case 268435456:
            n = Me;
            break;
          default:
            n = Ae;
        }
        return (
          (r = dd.bind(null, e)),
          (n = Se(n, r)),
          (e.callbackPriority = t),
          (e.callbackNode = n),
          t
        );
      }
      return (
        r !== null && r !== null && Ce(r),
        (e.callbackPriority = 2),
        (e.callbackNode = null),
        2
      );
    }
    function dd(e, t) {
      if (su !== 0 && su !== 5)
        return ((e.callbackNode = null), (e.callbackPriority = 0), null);
      var n = e.callbackNode;
      if (Gu() && e.callbackNode !== n) return null;
      var r = K;
      return (
        (r = Ke(
          e,
          e === Vl ? r : 0,
          e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
        )),
        r === 0
          ? null
          : (yu(e, r, t),
            ud(e, Ee()),
            e.callbackNode != null && e.callbackNode === n
              ? dd.bind(null, e)
              : null)
      );
    }
    function fd(e, t) {
      if (Gu()) return null;
      yu(e, t, !0);
    }
    function pd() {
      Qd(function () {
        W & 6 ? Se(Oe, cd) : ld();
      });
    }
    function md() {
      if (ad === 0) {
        var e = pa;
        (e === 0 && ((e = He), (He <<= 1), !(He & 261888) && (He = 256)),
          (ad = e));
      }
      return ad;
    }
    function hd(e) {
      return e == null || typeof e == `symbol` || typeof e == `boolean`
        ? null
        : typeof e == `function`
          ? e
          : $t(`` + e);
    }
    function gd(e, t) {
      var n = t.ownerDocument.createElement(`input`);
      return (
        (n.name = t.name),
        (n.value = t.value),
        e.id && n.setAttribute(`form`, e.id),
        t.parentNode.insertBefore(n, t),
        (e = new FormData(e)),
        n.parentNode.removeChild(n),
        e
      );
    }
    function _d(e, t, n, r, i) {
      if (t === `submit` && n && n.stateNode === i) {
        var a = hd((i[ct] || null).action),
          o = r.submitter;
        o &&
          ((t = (t = o[ct] || null)
            ? hd(t.formAction)
            : o.getAttribute(`formAction`)),
          t !== null && ((a = t), (o = null)));
        var s = new Sn(`action`, `action`, null, r, i);
        e.push({
          event: s,
          listeners: [
            {
              instance: null,
              listener: function () {
                if (r.defaultPrevented) {
                  if (ad !== 0) {
                    var e = o ? gd(i, o) : new FormData(i);
                    Ts(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      null,
                      e,
                    );
                  }
                } else
                  typeof a == `function` &&
                    (s.preventDefault(),
                    (e = o ? gd(i, o) : new FormData(i)),
                    Ts(
                      n,
                      { pending: !0, data: e, method: i.method, action: a },
                      a,
                      e,
                    ));
              },
              currentTarget: i,
            },
          ],
        });
      }
    }
    for (var vd = 0; vd < Yr.length; vd++) {
      var yd = Yr[vd];
      Xr(yd.toLowerCase(), `on` + (yd[0].toUpperCase() + yd.slice(1)));
    }
    (Xr(Vr, `onAnimationEnd`),
      Xr(Hr, `onAnimationIteration`),
      Xr(Ur, `onAnimationStart`),
      Xr(`dblclick`, `onDoubleClick`),
      Xr(`focusin`, `onFocus`),
      Xr(`focusout`, `onBlur`),
      Xr(Wr, `onTransitionRun`),
      Xr(Gr, `onTransitionStart`),
      Xr(Kr, `onTransitionCancel`),
      Xr(qr, `onTransitionEnd`),
      wt(`onMouseEnter`, [`mouseout`, `mouseover`]),
      wt(`onMouseLeave`, [`mouseout`, `mouseover`]),
      wt(`onPointerEnter`, [`pointerout`, `pointerover`]),
      wt(`onPointerLeave`, [`pointerout`, `pointerover`]),
      Ct(
        `onChange`,
        `change click focusin focusout input keydown keyup selectionchange`.split(
          ` `,
        ),
      ),
      Ct(
        `onSelect`,
        `focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(
          ` `,
        ),
      ),
      Ct(`onBeforeInput`, [`compositionend`, `keypress`, `textInput`, `paste`]),
      Ct(
        `onCompositionEnd`,
        `compositionend focusout keydown keypress keyup mousedown`.split(` `),
      ),
      Ct(
        `onCompositionStart`,
        `compositionstart focusout keydown keypress keyup mousedown`.split(` `),
      ),
      Ct(
        `onCompositionUpdate`,
        `compositionupdate focusout keydown keypress keyup mousedown`.split(
          ` `,
        ),
      ));
    var bd =
        `abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
          ` `,
        ),
      xd = new Set(
        `beforetoggle cancel close invalid load scroll scrollend toggle`
          .split(` `)
          .concat(bd),
      );
    function Sd(e, t) {
      t = (t & 4) != 0;
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          i = r.event;
        r = r.listeners;
        a: {
          var a = void 0;
          if (t)
            for (var o = r.length - 1; 0 <= o; o--) {
              var s = r[o],
                c = s.instance,
                l = s.currentTarget;
              if (((s = s.listener), c !== a && i.isPropagationStopped()))
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                Zr(e);
              }
              ((i.currentTarget = null), (a = c));
            }
          else
            for (o = 0; o < r.length; o++) {
              if (
                ((s = r[o]),
                (c = s.instance),
                (l = s.currentTarget),
                (s = s.listener),
                c !== a && i.isPropagationStopped())
              )
                break a;
              ((a = s), (i.currentTarget = l));
              try {
                a(i);
              } catch (e) {
                Zr(e);
              }
              ((i.currentTarget = null), (a = c));
            }
        }
      }
    }
    function Y(e, t) {
      var n = t[ut];
      n === void 0 && (n = t[ut] = new Set());
      var r = e + `__bubble`;
      n.has(r) || (Ed(t, e, 2, !1), n.add(r));
    }
    function Cd(e, t, n) {
      var r = 0;
      (t && (r |= 4), Ed(n, e, r, t));
    }
    var wd = `_reactListening` + Math.random().toString(36).slice(2);
    function Td(e) {
      if (!e[wd]) {
        ((e[wd] = !0),
          xt.forEach(function (t) {
            t !== `selectionchange` &&
              (xd.has(t) || Cd(t, !1, e), Cd(t, !0, e));
          }));
        var t = e.nodeType === 9 ? e : e.ownerDocument;
        t === null || t[wd] || ((t[wd] = !0), Cd(`selectionchange`, !1, t));
      }
    }
    function Ed(e, t, n, r) {
      switch (_p(t)) {
        case 2:
          var i = dp;
          break;
        case 8:
          i = fp;
          break;
        default:
          i = pp;
      }
      ((n = i.bind(null, t, n, e)),
        (i = void 0),
        !dn ||
          (t !== `touchstart` && t !== `touchmove` && t !== `wheel`) ||
          (i = !0),
        r
          ? i === void 0
            ? e.addEventListener(t, n, !0)
            : e.addEventListener(t, n, { capture: !0, passive: i })
          : i === void 0
            ? e.addEventListener(t, n, !1)
            : e.addEventListener(t, n, { passive: i }));
    }
    function Dd(e, t, n, r, i) {
      var a = r;
      if (!(t & 1) && !(t & 2) && r !== null)
        a: for (;;) {
          if (r === null) return;
          var s = r.tag;
          if (s === 3 || s === 4) {
            var c = r.stateNode.containerInfo;
            if (c === i) break;
            if (s === 4)
              for (s = r.return; s !== null; ) {
                var l = s.tag;
                if ((l === 3 || l === 4) && s.stateNode.containerInfo === i)
                  return;
                s = s.return;
              }
            for (; c !== null; ) {
              if (((s = gt(c)), s === null)) return;
              if (((l = s.tag), l === 5 || l === 6 || l === 26 || l === 27)) {
                r = a = s;
                continue a;
              }
              c = c.parentNode;
            }
          }
          r = r.return;
        }
      cn(function () {
        var r = a,
          i = nn(n),
          s = [];
        a: {
          var c = Jr.get(e);
          if (c !== void 0) {
            var l = Sn,
              u = e;
            switch (e) {
              case `keypress`:
                if (_n(n) === 0) break a;
              case `keydown`:
              case `keyup`:
                l = Bn;
                break;
              case `focusin`:
                ((u = `focus`), (l = jn));
                break;
              case `focusout`:
                ((u = `blur`), (l = jn));
                break;
              case `beforeblur`:
              case `afterblur`:
                l = jn;
                break;
              case `click`:
                if (n.button === 2) break a;
              case `auxclick`:
              case `dblclick`:
              case `mousedown`:
              case `mousemove`:
              case `mouseup`:
              case `mouseout`:
              case `mouseover`:
              case `contextmenu`:
                l = kn;
                break;
              case `drag`:
              case `dragend`:
              case `dragenter`:
              case `dragexit`:
              case `dragleave`:
              case `dragover`:
              case `dragstart`:
              case `drop`:
                l = An;
                break;
              case `touchcancel`:
              case `touchend`:
              case `touchmove`:
              case `touchstart`:
                l = Hn;
                break;
              case Vr:
              case Hr:
              case Ur:
                l = Mn;
                break;
              case qr:
                l = Un;
                break;
              case `scroll`:
              case `scrollend`:
                l = wn;
                break;
              case `wheel`:
                l = Wn;
                break;
              case `copy`:
              case `cut`:
              case `paste`:
                l = Nn;
                break;
              case `gotpointercapture`:
              case `lostpointercapture`:
              case `pointercancel`:
              case `pointerdown`:
              case `pointermove`:
              case `pointerout`:
              case `pointerover`:
              case `pointerup`:
                l = Vn;
                break;
              case `toggle`:
              case `beforetoggle`:
                l = Gn;
            }
            var d = (t & 4) != 0,
              f = !d && (e === `scroll` || e === `scrollend`),
              p = d ? (c === null ? null : c + `Capture`) : c;
            d = [];
            for (var m = r, h; m !== null; ) {
              var g = m;
              if (
                ((h = g.stateNode),
                (g = g.tag),
                (g !== 5 && g !== 26 && g !== 27) ||
                  h === null ||
                  p === null ||
                  ((g = ln(m, p)), g != null && d.push(Od(m, g, h))),
                f)
              )
                break;
              m = m.return;
            }
            0 < d.length &&
              ((c = new l(c, u, null, n, i)),
              s.push({ event: c, listeners: d }));
          }
        }
        if (!(t & 7)) {
          a: {
            if (
              ((c = e === `mouseover` || e === `pointerover`),
              (l = e === `mouseout` || e === `pointerout`),
              c &&
                n !== tn &&
                (u = n.relatedTarget || n.fromElement) &&
                (gt(u) || u[lt]))
            )
              break a;
            if (
              (l || c) &&
              ((c =
                i.window === i
                  ? i
                  : (c = i.ownerDocument)
                    ? c.defaultView || c.parentWindow
                    : window),
              l
                ? ((u = n.relatedTarget || n.toElement),
                  (l = r),
                  (u = u ? gt(u) : null),
                  u !== null &&
                    ((f = o(u)),
                    (d = u.tag),
                    u !== f || (d !== 5 && d !== 27 && d !== 6)) &&
                    (u = null))
                : ((l = null), (u = r)),
              l !== u)
            ) {
              if (
                ((d = kn),
                (g = `onMouseLeave`),
                (p = `onMouseEnter`),
                (m = `mouse`),
                (e === `pointerout` || e === `pointerover`) &&
                  ((d = Vn),
                  (g = `onPointerLeave`),
                  (p = `onPointerEnter`),
                  (m = `pointer`)),
                (f = l == null ? c : vt(l)),
                (h = u == null ? c : vt(u)),
                (c = new d(g, m + `leave`, l, n, i)),
                (c.target = f),
                (c.relatedTarget = h),
                (g = null),
                gt(i) === r &&
                  ((d = new d(p, m + `enter`, u, n, i)),
                  (d.target = h),
                  (d.relatedTarget = f),
                  (g = d)),
                (f = g),
                l && u)
              )
                b: {
                  for (d = Ad, p = l, m = u, h = 0, g = p; g; g = d(g)) h++;
                  g = 0;
                  for (var _ = m; _; _ = d(_)) g++;
                  for (; 0 < h - g; ) ((p = d(p)), h--);
                  for (; 0 < g - h; ) ((m = d(m)), g--);
                  for (; h--; ) {
                    if (p === m || (m !== null && p === m.alternate)) {
                      d = p;
                      break b;
                    }
                    ((p = d(p)), (m = d(m)));
                  }
                  d = null;
                }
              else d = null;
              (l !== null && jd(s, c, l, d, !1),
                u !== null && f !== null && jd(s, f, u, d, !0));
            }
          }
          a: {
            if (
              ((c = r ? vt(r) : window),
              (l = c.nodeName && c.nodeName.toLowerCase()),
              l === `select` || (l === `input` && c.type === `file`))
            )
              var v = dr;
            else if (ar(c))
              if (fr) v = xr;
              else {
                v = yr;
                var y = vr;
              }
            else
              ((l = c.nodeName),
                !l ||
                l.toLowerCase() !== `input` ||
                (c.type !== `checkbox` && c.type !== `radio`)
                  ? r && Xt(r.elementType) && (v = dr)
                  : (v = br));
            if ((v &&= v(e, r))) {
              or(s, v, n, i);
              break a;
            }
            (y && y(e, c, r),
              e === `focusout` &&
                r &&
                c.type === `number` &&
                r.memoizedProps.value != null &&
                Ht(c, `number`, c.value));
          }
          switch (((y = r ? vt(r) : window), e)) {
            case `focusin`:
              (ar(y) || y.contentEditable === `true`) &&
                ((jr = y), (Mr = r), (Nr = null));
              break;
            case `focusout`:
              Nr = Mr = jr = null;
              break;
            case `mousedown`:
              Pr = !0;
              break;
            case `contextmenu`:
            case `mouseup`:
            case `dragend`:
              ((Pr = !1), Fr(s, n, i));
              break;
            case `selectionchange`:
              if (Ar) break;
            case `keydown`:
            case `keyup`:
              Fr(s, n, i);
          }
          var b;
          if (qn)
            b: {
              switch (e) {
                case `compositionstart`:
                  var x = `onCompositionStart`;
                  break b;
                case `compositionend`:
                  x = `onCompositionEnd`;
                  break b;
                case `compositionupdate`:
                  x = `onCompositionUpdate`;
                  break b;
              }
              x = void 0;
            }
          else
            tr
              ? $n(e, n) && (x = `onCompositionEnd`)
              : e === `keydown` &&
                n.keyCode === 229 &&
                (x = `onCompositionStart`);
          (x &&
            (Xn &&
              n.locale !== `ko` &&
              (tr || x !== `onCompositionStart`
                ? x === `onCompositionEnd` && tr && (b = gn())
                : ((pn = i),
                  (mn = `value` in pn ? pn.value : pn.textContent),
                  (tr = !0))),
            (y = kd(r, x)),
            0 < y.length &&
              ((x = new Pn(x, e, null, n, i)),
              s.push({ event: x, listeners: y }),
              b ? (x.data = b) : ((b = er(n)), b !== null && (x.data = b)))),
            (b = Yn ? nr(e, n) : rr(e, n)) &&
              ((x = kd(r, `onBeforeInput`)),
              0 < x.length &&
                ((y = new Pn(`onBeforeInput`, `beforeinput`, null, n, i)),
                s.push({ event: y, listeners: x }),
                (y.data = b))),
            _d(s, e, r, n, i));
        }
        Sd(s, t);
      });
    }
    function Od(e, t, n) {
      return { instance: e, listener: t, currentTarget: n };
    }
    function kd(e, t) {
      for (var n = t + `Capture`, r = []; e !== null; ) {
        var i = e,
          a = i.stateNode;
        if (
          ((i = i.tag),
          (i !== 5 && i !== 26 && i !== 27) ||
            a === null ||
            ((i = ln(e, n)),
            i != null && r.unshift(Od(e, i, a)),
            (i = ln(e, t)),
            i != null && r.push(Od(e, i, a))),
          e.tag === 3)
        )
          return r;
        e = e.return;
      }
      return [];
    }
    function Ad(e) {
      if (e === null) return null;
      do e = e.return;
      while (e && e.tag !== 5 && e.tag !== 27);
      return e || null;
    }
    function jd(e, t, n, r, i) {
      for (var a = t._reactName, o = []; n !== null && n !== r; ) {
        var s = n,
          c = s.alternate,
          l = s.stateNode;
        if (((s = s.tag), c !== null && c === r)) break;
        ((s !== 5 && s !== 26 && s !== 27) ||
          l === null ||
          ((c = l),
          i
            ? ((l = ln(n, a)), l != null && o.unshift(Od(n, l, c)))
            : i || ((l = ln(n, a)), l != null && o.push(Od(n, l, c)))),
          (n = n.return));
      }
      o.length !== 0 && e.push({ event: t, listeners: o });
    }
    var Md = /\r\n?/g,
      Nd = /\u0000|\uFFFD/g;
    function Pd(e) {
      return (typeof e == `string` ? e : `` + e)
        .replace(
          Md,
          `
`,
        )
        .replace(Nd, ``);
    }
    function Fd(e, t) {
      return ((t = Pd(t)), Pd(e) === t);
    }
    function Id(e, t, n, r, a, o) {
      switch (n) {
        case `children`:
          typeof r == `string`
            ? t === `body` || (t === `textarea` && r === ``) || Kt(e, r)
            : (typeof r == `number` || typeof r == `bigint`) &&
              t !== `body` &&
              Kt(e, `` + r);
          break;
        case `className`:
          At(e, `class`, r);
          break;
        case `tabIndex`:
          At(e, `tabindex`, r);
          break;
        case `dir`:
        case `role`:
        case `viewBox`:
        case `width`:
        case `height`:
          At(e, n, r);
          break;
        case `style`:
          Yt(e, r, o);
          break;
        case `data`:
          if (t !== `object`) {
            At(e, `data`, r);
            break;
          }
        case `src`:
        case `href`:
          if (r === `` && (t !== `a` || n !== `href`)) {
            e.removeAttribute(n);
            break;
          }
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `symbol` ||
            typeof r == `boolean`
          ) {
            e.removeAttribute(n);
            break;
          }
          ((r = $t(`` + r)), e.setAttribute(n, r));
          break;
        case `action`:
        case `formAction`:
          if (typeof r == `function`) {
            e.setAttribute(
              n,
              `javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`,
            );
            break;
          } else
            typeof o == `function` &&
              (n === `formAction`
                ? (t !== `input` && Id(e, t, `name`, a.name, a, null),
                  Id(e, t, `formEncType`, a.formEncType, a, null),
                  Id(e, t, `formMethod`, a.formMethod, a, null),
                  Id(e, t, `formTarget`, a.formTarget, a, null))
                : (Id(e, t, `encType`, a.encType, a, null),
                  Id(e, t, `method`, a.method, a, null),
                  Id(e, t, `target`, a.target, a, null)));
          if (r == null || typeof r == `symbol` || typeof r == `boolean`) {
            e.removeAttribute(n);
            break;
          }
          ((r = $t(`` + r)), e.setAttribute(n, r));
          break;
        case `onClick`:
          r != null && (e.onclick = en);
          break;
        case `onScroll`:
          r != null && Y(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && Y(`scrollend`, e);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `multiple`:
          e.multiple = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `muted`:
          e.muted = r && typeof r != `function` && typeof r != `symbol`;
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `defaultValue`:
        case `defaultChecked`:
        case `innerHTML`:
        case `ref`:
          break;
        case `autoFocus`:
          break;
        case `xlinkHref`:
          if (
            r == null ||
            typeof r == `function` ||
            typeof r == `boolean` ||
            typeof r == `symbol`
          ) {
            e.removeAttribute(`xlink:href`);
            break;
          }
          ((n = $t(`` + r)),
            e.setAttributeNS(`http://www.w3.org/1999/xlink`, `xlink:href`, n));
          break;
        case `contentEditable`:
        case `spellCheck`:
        case `draggable`:
        case `value`:
        case `autoReverse`:
        case `externalResourcesRequired`:
        case `focusable`:
        case `preserveAlpha`:
          r != null && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, `` + r)
            : e.removeAttribute(n);
          break;
        case `inert`:
        case `allowFullScreen`:
        case `async`:
        case `autoPlay`:
        case `controls`:
        case `default`:
        case `defer`:
        case `disabled`:
        case `disablePictureInPicture`:
        case `disableRemotePlayback`:
        case `formNoValidate`:
        case `hidden`:
        case `loop`:
        case `noModule`:
        case `noValidate`:
        case `open`:
        case `playsInline`:
        case `readOnly`:
        case `required`:
        case `reversed`:
        case `scoped`:
        case `seamless`:
        case `itemScope`:
          r && typeof r != `function` && typeof r != `symbol`
            ? e.setAttribute(n, ``)
            : e.removeAttribute(n);
          break;
        case `capture`:
        case `download`:
          !0 === r
            ? e.setAttribute(n, ``)
            : !1 !== r &&
                r != null &&
                typeof r != `function` &&
                typeof r != `symbol`
              ? e.setAttribute(n, r)
              : e.removeAttribute(n);
          break;
        case `cols`:
        case `rows`:
        case `size`:
        case `span`:
          r != null &&
          typeof r != `function` &&
          typeof r != `symbol` &&
          !isNaN(r) &&
          1 <= r
            ? e.setAttribute(n, r)
            : e.removeAttribute(n);
          break;
        case `rowSpan`:
        case `start`:
          r == null ||
          typeof r == `function` ||
          typeof r == `symbol` ||
          isNaN(r)
            ? e.removeAttribute(n)
            : e.setAttribute(n, r);
          break;
        case `popover`:
          (Y(`beforetoggle`, e), Y(`toggle`, e), kt(e, `popover`, r));
          break;
        case `xlinkActuate`:
          jt(e, `http://www.w3.org/1999/xlink`, `xlink:actuate`, r);
          break;
        case `xlinkArcrole`:
          jt(e, `http://www.w3.org/1999/xlink`, `xlink:arcrole`, r);
          break;
        case `xlinkRole`:
          jt(e, `http://www.w3.org/1999/xlink`, `xlink:role`, r);
          break;
        case `xlinkShow`:
          jt(e, `http://www.w3.org/1999/xlink`, `xlink:show`, r);
          break;
        case `xlinkTitle`:
          jt(e, `http://www.w3.org/1999/xlink`, `xlink:title`, r);
          break;
        case `xlinkType`:
          jt(e, `http://www.w3.org/1999/xlink`, `xlink:type`, r);
          break;
        case `xmlBase`:
          jt(e, `http://www.w3.org/XML/1998/namespace`, `xml:base`, r);
          break;
        case `xmlLang`:
          jt(e, `http://www.w3.org/XML/1998/namespace`, `xml:lang`, r);
          break;
        case `xmlSpace`:
          jt(e, `http://www.w3.org/XML/1998/namespace`, `xml:space`, r);
          break;
        case `is`:
          kt(e, `is`, r);
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          (!(2 < n.length) ||
            (n[0] !== `o` && n[0] !== `O`) ||
            (n[1] !== `n` && n[1] !== `N`)) &&
            ((n = Zt.get(n) || n), kt(e, n, r));
      }
    }
    function Ld(e, t, n, r, a, o) {
      switch (n) {
        case `style`:
          Yt(e, r, o);
          break;
        case `dangerouslySetInnerHTML`:
          if (r != null) {
            if (typeof r != `object` || !(`__html` in r)) throw Error(i(61));
            if (((n = r.__html), n != null)) {
              if (a.children != null) throw Error(i(60));
              e.innerHTML = n;
            }
          }
          break;
        case `children`:
          typeof r == `string`
            ? Kt(e, r)
            : (typeof r == `number` || typeof r == `bigint`) && Kt(e, `` + r);
          break;
        case `onScroll`:
          r != null && Y(`scroll`, e);
          break;
        case `onScrollEnd`:
          r != null && Y(`scrollend`, e);
          break;
        case `onClick`:
          r != null && (e.onclick = en);
          break;
        case `suppressContentEditableWarning`:
        case `suppressHydrationWarning`:
        case `innerHTML`:
        case `ref`:
          break;
        case `innerText`:
        case `textContent`:
          break;
        default:
          if (!St.hasOwnProperty(n))
            a: {
              if (
                n[0] === `o` &&
                n[1] === `n` &&
                ((a = n.endsWith(`Capture`)),
                (t = n.slice(2, a ? n.length - 7 : void 0)),
                (o = e[ct] || null),
                (o = o == null ? null : o[n]),
                typeof o == `function` && e.removeEventListener(t, o, a),
                typeof r == `function`)
              ) {
                (typeof o != `function` &&
                  o !== null &&
                  (n in e
                    ? (e[n] = null)
                    : e.hasAttribute(n) && e.removeAttribute(n)),
                  e.addEventListener(t, r, a));
                break a;
              }
              n in e
                ? (e[n] = r)
                : !0 === r
                  ? e.setAttribute(n, ``)
                  : kt(e, n, r);
            }
      }
    }
    function Rd(e, t, n) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `img`:
          (Y(`error`, e), Y(`load`, e));
          var r = !1,
            a = !1,
            o;
          for (o in n)
            if (n.hasOwnProperty(o)) {
              var s = n[o];
              if (s != null)
                switch (o) {
                  case `src`:
                    r = !0;
                    break;
                  case `srcSet`:
                    a = !0;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    throw Error(i(137, t));
                  default:
                    Id(e, t, o, s, n, null);
                }
            }
          (a && Id(e, t, `srcSet`, n.srcSet, n, null),
            r && Id(e, t, `src`, n.src, n, null));
          return;
        case `input`:
          Y(`invalid`, e);
          var c = (o = s = a = null),
            l = null,
            u = null;
          for (r in n)
            if (n.hasOwnProperty(r)) {
              var d = n[r];
              if (d != null)
                switch (r) {
                  case `name`:
                    a = d;
                    break;
                  case `type`:
                    s = d;
                    break;
                  case `checked`:
                    l = d;
                    break;
                  case `defaultChecked`:
                    u = d;
                    break;
                  case `value`:
                    o = d;
                    break;
                  case `defaultValue`:
                    c = d;
                    break;
                  case `children`:
                  case `dangerouslySetInnerHTML`:
                    if (d != null) throw Error(i(137, t));
                    break;
                  default:
                    Id(e, t, r, d, n, null);
                }
            }
          Vt(e, o, c, l, u, s, a, !1);
          return;
        case `select`:
          for (a in (Y(`invalid`, e), (r = s = o = null), n))
            if (n.hasOwnProperty(a) && ((c = n[a]), c != null))
              switch (a) {
                case `value`:
                  o = c;
                  break;
                case `defaultValue`:
                  s = c;
                  break;
                case `multiple`:
                  r = c;
                default:
                  Id(e, t, a, c, n, null);
              }
          ((t = o),
            (n = s),
            (e.multiple = !!r),
            t == null ? n != null && Ut(e, !!r, n, !0) : Ut(e, !!r, t, !1));
          return;
        case `textarea`:
          for (s in (Y(`invalid`, e), (o = a = r = null), n))
            if (n.hasOwnProperty(s) && ((c = n[s]), c != null))
              switch (s) {
                case `value`:
                  r = c;
                  break;
                case `defaultValue`:
                  a = c;
                  break;
                case `children`:
                  o = c;
                  break;
                case `dangerouslySetInnerHTML`:
                  if (c != null) throw Error(i(91));
                  break;
                default:
                  Id(e, t, s, c, n, null);
              }
          Gt(e, r, a, o);
          return;
        case `option`:
          for (l in n)
            if (n.hasOwnProperty(l) && ((r = n[l]), r != null))
              switch (l) {
                case `selected`:
                  e.selected =
                    r && typeof r != `function` && typeof r != `symbol`;
                  break;
                default:
                  Id(e, t, l, r, n, null);
              }
          return;
        case `dialog`:
          (Y(`beforetoggle`, e), Y(`toggle`, e), Y(`cancel`, e), Y(`close`, e));
          break;
        case `iframe`:
        case `object`:
          Y(`load`, e);
          break;
        case `video`:
        case `audio`:
          for (r = 0; r < bd.length; r++) Y(bd[r], e);
          break;
        case `image`:
          (Y(`error`, e), Y(`load`, e));
          break;
        case `details`:
          Y(`toggle`, e);
          break;
        case `embed`:
        case `source`:
        case `link`:
          (Y(`error`, e), Y(`load`, e));
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (u in n)
            if (n.hasOwnProperty(u) && ((r = n[u]), r != null))
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  throw Error(i(137, t));
                default:
                  Id(e, t, u, r, n, null);
              }
          return;
        default:
          if (Xt(t)) {
            for (d in n)
              n.hasOwnProperty(d) &&
                ((r = n[d]), r !== void 0 && Ld(e, t, d, r, n, void 0));
            return;
          }
      }
      for (c in n)
        n.hasOwnProperty(c) &&
          ((r = n[c]), r != null && Id(e, t, c, r, n, null));
    }
    function zd(e, t, n, r) {
      switch (t) {
        case `div`:
        case `span`:
        case `svg`:
        case `path`:
        case `a`:
        case `g`:
        case `p`:
        case `li`:
          break;
        case `input`:
          var a = null,
            o = null,
            s = null,
            c = null,
            l = null,
            u = null,
            d = null;
          for (m in n) {
            var f = n[m];
            if (n.hasOwnProperty(m) && f != null)
              switch (m) {
                case `checked`:
                  break;
                case `value`:
                  break;
                case `defaultValue`:
                  l = f;
                default:
                  r.hasOwnProperty(m) || Id(e, t, m, null, r, f);
              }
          }
          for (var p in r) {
            var m = r[p];
            if (((f = n[p]), r.hasOwnProperty(p) && (m != null || f != null)))
              switch (p) {
                case `type`:
                  o = m;
                  break;
                case `name`:
                  a = m;
                  break;
                case `checked`:
                  u = m;
                  break;
                case `defaultChecked`:
                  d = m;
                  break;
                case `value`:
                  s = m;
                  break;
                case `defaultValue`:
                  c = m;
                  break;
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (m != null) throw Error(i(137, t));
                  break;
                default:
                  m !== f && Id(e, t, p, m, r, f);
              }
          }
          Bt(e, s, c, l, u, d, o, a);
          return;
        case `select`:
          for (o in ((m = s = c = p = null), n))
            if (((l = n[o]), n.hasOwnProperty(o) && l != null))
              switch (o) {
                case `value`:
                  break;
                case `multiple`:
                  m = l;
                default:
                  r.hasOwnProperty(o) || Id(e, t, o, null, r, l);
              }
          for (a in r)
            if (
              ((o = r[a]),
              (l = n[a]),
              r.hasOwnProperty(a) && (o != null || l != null))
            )
              switch (a) {
                case `value`:
                  p = o;
                  break;
                case `defaultValue`:
                  c = o;
                  break;
                case `multiple`:
                  s = o;
                default:
                  o !== l && Id(e, t, a, o, r, l);
              }
          ((t = c),
            (n = s),
            (r = m),
            p == null
              ? !!r != !!n &&
                (t == null ? Ut(e, !!n, n ? [] : ``, !1) : Ut(e, !!n, t, !0))
              : Ut(e, !!n, p, !1));
          return;
        case `textarea`:
          for (c in ((m = p = null), n))
            if (
              ((a = n[c]),
              n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c))
            )
              switch (c) {
                case `value`:
                  break;
                case `children`:
                  break;
                default:
                  Id(e, t, c, null, r, a);
              }
          for (s in r)
            if (
              ((a = r[s]),
              (o = n[s]),
              r.hasOwnProperty(s) && (a != null || o != null))
            )
              switch (s) {
                case `value`:
                  p = a;
                  break;
                case `defaultValue`:
                  m = a;
                  break;
                case `children`:
                  break;
                case `dangerouslySetInnerHTML`:
                  if (a != null) throw Error(i(91));
                  break;
                default:
                  a !== o && Id(e, t, s, a, r, o);
              }
          Wt(e, p, m);
          return;
        case `option`:
          for (var h in n)
            if (
              ((p = n[h]),
              n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h))
            )
              switch (h) {
                case `selected`:
                  e.selected = !1;
                  break;
                default:
                  Id(e, t, h, null, r, p);
              }
          for (l in r)
            if (
              ((p = r[l]),
              (m = n[l]),
              r.hasOwnProperty(l) && p !== m && (p != null || m != null))
            )
              switch (l) {
                case `selected`:
                  e.selected =
                    p && typeof p != `function` && typeof p != `symbol`;
                  break;
                default:
                  Id(e, t, l, p, r, m);
              }
          return;
        case `img`:
        case `link`:
        case `area`:
        case `base`:
        case `br`:
        case `col`:
        case `embed`:
        case `hr`:
        case `keygen`:
        case `meta`:
        case `param`:
        case `source`:
        case `track`:
        case `wbr`:
        case `menuitem`:
          for (var g in n)
            ((p = n[g]),
              n.hasOwnProperty(g) &&
                p != null &&
                !r.hasOwnProperty(g) &&
                Id(e, t, g, null, r, p));
          for (u in r)
            if (
              ((p = r[u]),
              (m = n[u]),
              r.hasOwnProperty(u) && p !== m && (p != null || m != null))
            )
              switch (u) {
                case `children`:
                case `dangerouslySetInnerHTML`:
                  if (p != null) throw Error(i(137, t));
                  break;
                default:
                  Id(e, t, u, p, r, m);
              }
          return;
        default:
          if (Xt(t)) {
            for (var _ in n)
              ((p = n[_]),
                n.hasOwnProperty(_) &&
                  p !== void 0 &&
                  !r.hasOwnProperty(_) &&
                  Ld(e, t, _, void 0, r, p));
            for (d in r)
              ((p = r[d]),
                (m = n[d]),
                !r.hasOwnProperty(d) ||
                  p === m ||
                  (p === void 0 && m === void 0) ||
                  Ld(e, t, d, p, r, m));
            return;
          }
      }
      for (var v in n)
        ((p = n[v]),
          n.hasOwnProperty(v) &&
            p != null &&
            !r.hasOwnProperty(v) &&
            Id(e, t, v, null, r, p));
      for (f in r)
        ((p = r[f]),
          (m = n[f]),
          !r.hasOwnProperty(f) ||
            p === m ||
            (p == null && m == null) ||
            Id(e, t, f, p, r, m));
    }
    function Bd(e) {
      switch (e) {
        case `css`:
        case `script`:
        case `font`:
        case `img`:
        case `image`:
        case `input`:
        case `link`:
          return !0;
        default:
          return !1;
      }
    }
    function Vd() {
      if (typeof performance.getEntriesByType == `function`) {
        for (
          var e = 0, t = 0, n = performance.getEntriesByType(`resource`), r = 0;
          r < n.length;
          r++
        ) {
          var i = n[r],
            a = i.transferSize,
            o = i.initiatorType,
            s = i.duration;
          if (a && s && Bd(o)) {
            for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
              var c = n[r],
                l = c.startTime;
              if (l > s) break;
              var u = c.transferSize,
                d = c.initiatorType;
              u &&
                Bd(d) &&
                ((c = c.responseEnd),
                (o += u * (c < s ? 1 : (s - l) / (c - l))));
            }
            if ((--r, (t += (8 * (a + o)) / (i.duration / 1e3)), e++, 10 < e))
              break;
          }
        }
        if (0 < e) return t / e / 1e6;
      }
      return navigator.connection &&
        ((e = navigator.connection.downlink), typeof e == `number`)
        ? e
        : 5;
    }
    var Hd = null,
      Ud = null;
    function X(e) {
      return e.nodeType === 9 ? e : e.ownerDocument;
    }
    function Wd(e) {
      switch (e) {
        case `http://www.w3.org/2000/svg`:
          return 1;
        case `http://www.w3.org/1998/Math/MathML`:
          return 2;
        default:
          return 0;
      }
    }
    function Gd(e, t) {
      if (e === 0)
        switch (t) {
          case `svg`:
            return 1;
          case `math`:
            return 2;
          default:
            return 0;
        }
      return e === 1 && t === `foreignObject` ? 0 : e;
    }
    function Kd(e, t) {
      return (
        e === `textarea` ||
        e === `noscript` ||
        typeof t.children == `string` ||
        typeof t.children == `number` ||
        typeof t.children == `bigint` ||
        (typeof t.dangerouslySetInnerHTML == `object` &&
          t.dangerouslySetInnerHTML !== null &&
          t.dangerouslySetInnerHTML.__html != null)
      );
    }
    var qd = null;
    function Jd() {
      var e = window.event;
      return e && e.type === `popstate`
        ? e === qd
          ? !1
          : ((qd = e), !0)
        : ((qd = null), !1);
    }
    var Yd = typeof setTimeout == `function` ? setTimeout : void 0,
      Xd = typeof clearTimeout == `function` ? clearTimeout : void 0,
      Zd = typeof Promise == `function` ? Promise : void 0,
      Qd =
        typeof queueMicrotask == `function`
          ? queueMicrotask
          : Zd === void 0
            ? Yd
            : function (e) {
                return Zd.resolve(null).then(e).catch($d);
              };
    function $d(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function ef(e) {
      return e === `head`;
    }
    function tf(e, t) {
      var n = t,
        r = 0;
      do {
        var i = n.nextSibling;
        if ((e.removeChild(n), i && i.nodeType === 8))
          if (((n = i.data), n === `/$` || n === `/&`)) {
            if (r === 0) {
              (e.removeChild(i), Ip(t));
              return;
            }
            r--;
          } else if (
            n === `$` ||
            n === `$?` ||
            n === `$~` ||
            n === `$!` ||
            n === `&`
          )
            r++;
          else if (n === `html`) gf(e.ownerDocument.documentElement);
          else if (n === `head`) {
            ((n = e.ownerDocument.head), gf(n));
            for (var a = n.firstChild; a; ) {
              var o = a.nextSibling,
                s = a.nodeName;
              (a[mt] ||
                s === `SCRIPT` ||
                s === `STYLE` ||
                (s === `LINK` && a.rel.toLowerCase() === `stylesheet`) ||
                n.removeChild(a),
                (a = o));
            }
          } else n === `body` && gf(e.ownerDocument.body);
        n = i;
      } while (n);
      Ip(t);
    }
    function nf(e, t) {
      var n = e;
      e = 0;
      do {
        var r = n.nextSibling;
        if (
          (n.nodeType === 1
            ? t
              ? ((n._stashedDisplay = n.style.display),
                (n.style.display = `none`))
              : ((n.style.display = n._stashedDisplay || ``),
                n.getAttribute(`style`) === `` && n.removeAttribute(`style`))
            : n.nodeType === 3 &&
              (t
                ? ((n._stashedText = n.nodeValue), (n.nodeValue = ``))
                : (n.nodeValue = n._stashedText || ``)),
          r && r.nodeType === 8)
        )
          if (((n = r.data), n === `/$`)) {
            if (e === 0) break;
            e--;
          } else (n !== `$` && n !== `$?` && n !== `$~` && n !== `$!`) || e++;
        n = r;
      } while (n);
    }
    function rf(e) {
      var t = e.firstChild;
      for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
        var n = t;
        switch (((t = t.nextSibling), n.nodeName)) {
          case `HTML`:
          case `HEAD`:
          case `BODY`:
            (rf(n), ht(n));
            continue;
          case `SCRIPT`:
          case `STYLE`:
            continue;
          case `LINK`:
            if (n.rel.toLowerCase() === `stylesheet`) continue;
        }
        e.removeChild(n);
      }
    }
    function af(e, t, n, r) {
      for (; e.nodeType === 1; ) {
        var i = n;
        if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
          if (!r && (e.nodeName !== `INPUT` || e.type !== `hidden`)) break;
        } else if (!r)
          if (t === `input` && e.type === `hidden`) {
            var a = i.name == null ? null : `` + i.name;
            if (i.type === `hidden` && e.getAttribute(`name`) === a) return e;
          } else return e;
        else if (!e[mt])
          switch (t) {
            case `meta`:
              if (!e.hasAttribute(`itemprop`)) break;
              return e;
            case `link`:
              if (
                ((a = e.getAttribute(`rel`)),
                (a === `stylesheet` && e.hasAttribute(`data-precedence`)) ||
                  a !== i.rel ||
                  e.getAttribute(`href`) !==
                    (i.href == null || i.href === `` ? null : i.href) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin) ||
                  e.getAttribute(`title`) !==
                    (i.title == null ? null : i.title))
              )
                break;
              return e;
            case `style`:
              if (e.hasAttribute(`data-precedence`)) break;
              return e;
            case `script`:
              if (
                ((a = e.getAttribute(`src`)),
                (a !== (i.src == null ? null : i.src) ||
                  e.getAttribute(`type`) !== (i.type == null ? null : i.type) ||
                  e.getAttribute(`crossorigin`) !==
                    (i.crossOrigin == null ? null : i.crossOrigin)) &&
                  a &&
                  e.hasAttribute(`async`) &&
                  !e.hasAttribute(`itemprop`))
              )
                break;
              return e;
            default:
              return e;
          }
        if (((e = df(e.nextSibling)), e === null)) break;
      }
      return null;
    }
    function of(e, t, n) {
      if (t === ``) return null;
      for (; e.nodeType !== 3; )
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !n) ||
          ((e = df(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function sf(e, t) {
      for (; e.nodeType !== 8; )
        if (
          ((e.nodeType !== 1 ||
            e.nodeName !== `INPUT` ||
            e.type !== `hidden`) &&
            !t) ||
          ((e = df(e.nextSibling)), e === null)
        )
          return null;
      return e;
    }
    function cf(e) {
      return e.data === `$?` || e.data === `$~`;
    }
    function lf(e) {
      return (
        e.data === `$!` ||
        (e.data === `$?` && e.ownerDocument.readyState !== `loading`)
      );
    }
    function uf(e, t) {
      var n = e.ownerDocument;
      if (e.data === `$~`) e._reactRetry = t;
      else if (e.data !== `$?` || n.readyState !== `loading`) t();
      else {
        var r = function () {
          (t(), n.removeEventListener(`DOMContentLoaded`, r));
        };
        (n.addEventListener(`DOMContentLoaded`, r), (e._reactRetry = r));
      }
    }
    function df(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === 1 || t === 3) break;
        if (t === 8) {
          if (
            ((t = e.data),
            t === `$` ||
              t === `$!` ||
              t === `$?` ||
              t === `$~` ||
              t === `&` ||
              t === `F!` ||
              t === `F`)
          )
            break;
          if (t === `/$` || t === `/&`) return null;
        }
      }
      return e;
    }
    var ff = null;
    function pf(e) {
      e = e.nextSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === `/$` || n === `/&`) {
            if (t === 0) return df(e.nextSibling);
            t--;
          } else
            (n !== `$` &&
              n !== `$!` &&
              n !== `$?` &&
              n !== `$~` &&
              n !== `&`) ||
              t++;
        }
        e = e.nextSibling;
      }
      return null;
    }
    function mf(e) {
      e = e.previousSibling;
      for (var t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (
            n === `$` ||
            n === `$!` ||
            n === `$?` ||
            n === `$~` ||
            n === `&`
          ) {
            if (t === 0) return e;
            t--;
          } else (n !== `/$` && n !== `/&`) || t++;
        }
        e = e.previousSibling;
      }
      return null;
    }
    function hf(e, t, n) {
      switch (((t = X(n)), e)) {
        case `html`:
          if (((e = t.documentElement), !e)) throw Error(i(452));
          return e;
        case `head`:
          if (((e = t.head), !e)) throw Error(i(453));
          return e;
        case `body`:
          if (((e = t.body), !e)) throw Error(i(454));
          return e;
        default:
          throw Error(i(451));
      }
    }
    function gf(e) {
      for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
      ht(e);
    }
    var _f = new Map(),
      vf = new Set();
    function yf(e) {
      return typeof e.getRootNode == `function`
        ? e.getRootNode()
        : e.nodeType === 9
          ? e
          : e.ownerDocument;
    }
    var bf = F.d;
    F.d = { f: xf, r: Sf, D: Tf, C: Ef, L: Df, m: Of, X: Af, S: kf, M: jf };
    function xf() {
      var e = bf.f(),
        t = Cu();
      return e || t;
    }
    function Sf(e) {
      var t = _t(e);
      t !== null && t.tag === 5 && t.type === `form` ? Ds(t) : bf.r(e);
    }
    var Cf = typeof document > `u` ? null : document;
    function wf(e, t, n) {
      var r = Cf;
      if (r && typeof t == `string` && t) {
        var i = zt(t);
        ((i = `link[rel="` + e + `"][href="` + i + `"]`),
          typeof n == `string` && (i += `[crossorigin="` + n + `"]`),
          vf.has(i) ||
            (vf.add(i),
            (e = { rel: e, crossOrigin: n, href: t }),
            r.querySelector(i) === null &&
              ((t = r.createElement(`link`)),
              Rd(t, `link`, e),
              bt(t),
              r.head.appendChild(t))));
      }
    }
    function Tf(e) {
      (bf.D(e), wf(`dns-prefetch`, e, null));
    }
    function Ef(e, t) {
      (bf.C(e, t), wf(`preconnect`, e, t));
    }
    function Df(e, t, n) {
      bf.L(e, t, n);
      var r = Cf;
      if (r && e && t) {
        var i = `link[rel="preload"][as="` + zt(t) + `"]`;
        t === `image` && n && n.imageSrcSet
          ? ((i += `[imagesrcset="` + zt(n.imageSrcSet) + `"]`),
            typeof n.imageSizes == `string` &&
              (i += `[imagesizes="` + zt(n.imageSizes) + `"]`))
          : (i += `[href="` + zt(e) + `"]`);
        var a = i;
        switch (t) {
          case `style`:
            a = Nf(e);
            break;
          case `script`:
            a = Lf(e);
        }
        _f.has(a) ||
          ((e = f(
            {
              rel: `preload`,
              href: t === `image` && n && n.imageSrcSet ? void 0 : e,
              as: t,
            },
            n,
          )),
          _f.set(a, e),
          r.querySelector(i) !== null ||
            (t === `style` && r.querySelector(Pf(a))) ||
            (t === `script` && r.querySelector(Rf(a))) ||
            ((t = r.createElement(`link`)),
            Rd(t, `link`, e),
            bt(t),
            r.head.appendChild(t)));
      }
    }
    function Of(e, t) {
      bf.m(e, t);
      var n = Cf;
      if (n && e) {
        var r = t && typeof t.as == `string` ? t.as : `script`,
          i =
            `link[rel="modulepreload"][as="` +
            zt(r) +
            `"][href="` +
            zt(e) +
            `"]`,
          a = i;
        switch (r) {
          case `audioworklet`:
          case `paintworklet`:
          case `serviceworker`:
          case `sharedworker`:
          case `worker`:
          case `script`:
            a = Lf(e);
        }
        if (
          !_f.has(a) &&
          ((e = f({ rel: `modulepreload`, href: e }, t)),
          _f.set(a, e),
          n.querySelector(i) === null)
        ) {
          switch (r) {
            case `audioworklet`:
            case `paintworklet`:
            case `serviceworker`:
            case `sharedworker`:
            case `worker`:
            case `script`:
              if (n.querySelector(Rf(a))) return;
          }
          ((r = n.createElement(`link`)),
            Rd(r, `link`, e),
            bt(r),
            n.head.appendChild(r));
        }
      }
    }
    function kf(e, t, n) {
      bf.S(e, t, n);
      var r = Cf;
      if (r && e) {
        var i = yt(r).hoistableStyles,
          a = Nf(e);
        t ||= `default`;
        var o = i.get(a);
        if (!o) {
          var s = { loading: 0, preload: null };
          if ((o = r.querySelector(Pf(a)))) s.loading = 5;
          else {
            ((e = f({ rel: `stylesheet`, href: e, "data-precedence": t }, n)),
              (n = _f.get(a)) && Vf(e, n));
            var c = (o = r.createElement(`link`));
            (bt(c),
              Rd(c, `link`, e),
              (c._p = new Promise(function (e, t) {
                ((c.onload = e), (c.onerror = t));
              })),
              c.addEventListener(`load`, function () {
                s.loading |= 1;
              }),
              c.addEventListener(`error`, function () {
                s.loading |= 2;
              }),
              (s.loading |= 4),
              Bf(o, t, r));
          }
          ((o = { type: `stylesheet`, instance: o, count: 1, state: s }),
            i.set(a, o));
        }
      }
    }
    function Af(e, t) {
      bf.X(e, t);
      var n = Cf;
      if (n && e) {
        var r = yt(n).hoistableScripts,
          i = Lf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Rf(i))),
          a ||
            ((e = f({ src: e, async: !0 }, t)),
            (t = _f.get(i)) && Hf(e, t),
            (a = n.createElement(`script`)),
            bt(a),
            Rd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function jf(e, t) {
      bf.M(e, t);
      var n = Cf;
      if (n && e) {
        var r = yt(n).hoistableScripts,
          i = Lf(e),
          a = r.get(i);
        a ||
          ((a = n.querySelector(Rf(i))),
          a ||
            ((e = f({ src: e, async: !0, type: `module` }, t)),
            (t = _f.get(i)) && Hf(e, t),
            (a = n.createElement(`script`)),
            bt(a),
            Rd(a, `link`, e),
            n.head.appendChild(a)),
          (a = { type: `script`, instance: a, count: 1, state: null }),
          r.set(i, a));
      }
    }
    function Mf(e, t, n, r) {
      var a = (a = ce.current) ? yf(a) : null;
      if (!a) throw Error(i(446));
      switch (e) {
        case `meta`:
        case `title`:
          return null;
        case `style`:
          return typeof n.precedence == `string` && typeof n.href == `string`
            ? ((t = Nf(n.href)),
              (n = yt(a).hoistableStyles),
              (r = n.get(t)),
              r ||
                ((r = { type: `style`, instance: null, count: 0, state: null }),
                n.set(t, r)),
              r)
            : { type: `void`, instance: null, count: 0, state: null };
        case `link`:
          if (
            n.rel === `stylesheet` &&
            typeof n.href == `string` &&
            typeof n.precedence == `string`
          ) {
            e = Nf(n.href);
            var o = yt(a).hoistableStyles,
              s = o.get(e);
            if (
              (s ||
                ((a = a.ownerDocument || a),
                (s = {
                  type: `stylesheet`,
                  instance: null,
                  count: 0,
                  state: { loading: 0, preload: null },
                }),
                o.set(e, s),
                (o = a.querySelector(Pf(e))) &&
                  !o._p &&
                  ((s.instance = o), (s.state.loading = 5)),
                _f.has(e) ||
                  ((n = {
                    rel: `preload`,
                    as: `style`,
                    href: n.href,
                    crossOrigin: n.crossOrigin,
                    integrity: n.integrity,
                    media: n.media,
                    hrefLang: n.hrefLang,
                    referrerPolicy: n.referrerPolicy,
                  }),
                  _f.set(e, n),
                  o || If(a, e, n, s.state))),
              t && r === null)
            )
              throw Error(i(528, ``));
            return s;
          }
          if (t && r !== null) throw Error(i(529, ``));
          return null;
        case `script`:
          return (
            (t = n.async),
            (n = n.src),
            typeof n == `string` &&
            t &&
            typeof t != `function` &&
            typeof t != `symbol`
              ? ((t = Lf(n)),
                (n = yt(a).hoistableScripts),
                (r = n.get(t)),
                r ||
                  ((r = {
                    type: `script`,
                    instance: null,
                    count: 0,
                    state: null,
                  }),
                  n.set(t, r)),
                r)
              : { type: `void`, instance: null, count: 0, state: null }
          );
        default:
          throw Error(i(444, e));
      }
    }
    function Nf(e) {
      return `href="` + zt(e) + `"`;
    }
    function Pf(e) {
      return `link[rel="stylesheet"][` + e + `]`;
    }
    function Ff(e) {
      return f({}, e, { "data-precedence": e.precedence, precedence: null });
    }
    function If(e, t, n, r) {
      e.querySelector(`link[rel="preload"][as="style"][` + t + `]`)
        ? (r.loading = 1)
        : ((t = e.createElement(`link`)),
          (r.preload = t),
          t.addEventListener(`load`, function () {
            return (r.loading |= 1);
          }),
          t.addEventListener(`error`, function () {
            return (r.loading |= 2);
          }),
          Rd(t, `link`, n),
          bt(t),
          e.head.appendChild(t));
    }
    function Lf(e) {
      return `[src="` + zt(e) + `"]`;
    }
    function Rf(e) {
      return `script[async]` + e;
    }
    function zf(e, t, n) {
      if ((t.count++, t.instance === null))
        switch (t.type) {
          case `style`:
            var r = e.querySelector(`style[data-href~="` + zt(n.href) + `"]`);
            if (r) return ((t.instance = r), bt(r), r);
            var a = f({}, n, {
              "data-href": n.href,
              "data-precedence": n.precedence,
              href: null,
              precedence: null,
            });
            return (
              (r = (e.ownerDocument || e).createElement(`style`)),
              bt(r),
              Rd(r, `style`, a),
              Bf(r, n.precedence, e),
              (t.instance = r)
            );
          case `stylesheet`:
            a = Nf(n.href);
            var o = e.querySelector(Pf(a));
            if (o) return ((t.state.loading |= 4), (t.instance = o), bt(o), o);
            ((r = Ff(n)),
              (a = _f.get(a)) && Vf(r, a),
              (o = (e.ownerDocument || e).createElement(`link`)),
              bt(o));
            var s = o;
            return (
              (s._p = new Promise(function (e, t) {
                ((s.onload = e), (s.onerror = t));
              })),
              Rd(o, `link`, r),
              (t.state.loading |= 4),
              Bf(o, n.precedence, e),
              (t.instance = o)
            );
          case `script`:
            return (
              (o = Lf(n.src)),
              (a = e.querySelector(Rf(o)))
                ? ((t.instance = a), bt(a), a)
                : ((r = n),
                  (a = _f.get(o)) && ((r = f({}, n)), Hf(r, a)),
                  (e = e.ownerDocument || e),
                  (a = e.createElement(`script`)),
                  bt(a),
                  Rd(a, `link`, r),
                  e.head.appendChild(a),
                  (t.instance = a))
            );
          case `void`:
            return null;
          default:
            throw Error(i(443, t.type));
        }
      else
        t.type === `stylesheet` &&
          !(t.state.loading & 4) &&
          ((r = t.instance), (t.state.loading |= 4), Bf(r, n.precedence, e));
      return t.instance;
    }
    function Bf(e, t, n) {
      for (
        var r = n.querySelectorAll(
            `link[rel="stylesheet"][data-precedence],style[data-precedence]`,
          ),
          i = r.length ? r[r.length - 1] : null,
          a = i,
          o = 0;
        o < r.length;
        o++
      ) {
        var s = r[o];
        if (s.dataset.precedence === t) a = s;
        else if (a !== i) break;
      }
      a
        ? a.parentNode.insertBefore(e, a.nextSibling)
        : ((t = n.nodeType === 9 ? n.head : n),
          t.insertBefore(e, t.firstChild));
    }
    function Vf(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.title ??= t.title));
    }
    function Hf(e, t) {
      ((e.crossOrigin ??= t.crossOrigin),
        (e.referrerPolicy ??= t.referrerPolicy),
        (e.integrity ??= t.integrity));
    }
    var Uf = null;
    function Wf(e, t, n) {
      if (Uf === null) {
        var r = new Map(),
          i = (Uf = new Map());
        i.set(n, r);
      } else ((i = Uf), (r = i.get(n)), r || ((r = new Map()), i.set(n, r)));
      if (r.has(e)) return r;
      for (
        r.set(e, null), n = n.getElementsByTagName(e), i = 0;
        i < n.length;
        i++
      ) {
        var a = n[i];
        if (
          !(
            a[mt] ||
            a[st] ||
            (e === `link` && a.getAttribute(`rel`) === `stylesheet`)
          ) &&
          a.namespaceURI !== `http://www.w3.org/2000/svg`
        ) {
          var o = a.getAttribute(t) || ``;
          o = e + o;
          var s = r.get(o);
          s ? s.push(a) : r.set(o, [a]);
        }
      }
      return r;
    }
    function Gf(e, t, n) {
      ((e = e.ownerDocument || e),
        e.head.insertBefore(
          n,
          t === `title` ? e.querySelector(`head > title`) : null,
        ));
    }
    function Kf(e, t, n) {
      if (n === 1 || t.itemProp != null) return !1;
      switch (e) {
        case `meta`:
        case `title`:
          return !0;
        case `style`:
          if (
            typeof t.precedence != `string` ||
            typeof t.href != `string` ||
            t.href === ``
          )
            break;
          return !0;
        case `link`:
          if (
            typeof t.rel != `string` ||
            typeof t.href != `string` ||
            t.href === `` ||
            t.onLoad ||
            t.onError
          )
            break;
          switch (t.rel) {
            case `stylesheet`:
              return (
                (e = t.disabled),
                typeof t.precedence == `string` && e == null
              );
            default:
              return !0;
          }
        case `script`:
          if (
            t.async &&
            typeof t.async != `function` &&
            typeof t.async != `symbol` &&
            !t.onLoad &&
            !t.onError &&
            t.src &&
            typeof t.src == `string`
          )
            return !0;
      }
      return !1;
    }
    function qf(e) {
      return !(e.type === `stylesheet` && !(e.state.loading & 3));
    }
    function Jf(e, t, n, r) {
      if (
        n.type === `stylesheet` &&
        (typeof r.media != `string` || !1 !== matchMedia(r.media).matches) &&
        !(n.state.loading & 4)
      ) {
        if (n.instance === null) {
          var i = Nf(r.href),
            a = t.querySelector(Pf(i));
          if (a) {
            ((t = a._p),
              typeof t == `object` &&
                t &&
                typeof t.then == `function` &&
                (e.count++, (e = Zf.bind(e)), t.then(e, e)),
              (n.state.loading |= 4),
              (n.instance = a),
              bt(a));
            return;
          }
          ((a = t.ownerDocument || t),
            (r = Ff(r)),
            (i = _f.get(i)) && Vf(r, i),
            (a = a.createElement(`link`)),
            bt(a));
          var o = a;
          ((o._p = new Promise(function (e, t) {
            ((o.onload = e), (o.onerror = t));
          })),
            Rd(a, `link`, r),
            (n.instance = a));
        }
        (e.stylesheets === null && (e.stylesheets = new Map()),
          e.stylesheets.set(n, t),
          (t = n.state.preload) &&
            !(n.state.loading & 3) &&
            (e.count++,
            (n = Zf.bind(e)),
            t.addEventListener(`load`, n),
            t.addEventListener(`error`, n)));
      }
    }
    var Yf = 0;
    function Xf(e, t) {
      return (
        e.stylesheets && e.count === 0 && $f(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount
          ? function (n) {
              var r = setTimeout(function () {
                if ((e.stylesheets && $f(e, e.stylesheets), e.unsuspend)) {
                  var t = e.unsuspend;
                  ((e.unsuspend = null), t());
                }
              }, 6e4 + t);
              0 < e.imgBytes && Yf === 0 && (Yf = 62500 * Vd());
              var i = setTimeout(
                function () {
                  if (
                    ((e.waitingForImages = !1),
                    e.count === 0 &&
                      (e.stylesheets && $f(e, e.stylesheets), e.unsuspend))
                  ) {
                    var t = e.unsuspend;
                    ((e.unsuspend = null), t());
                  }
                },
                (e.imgBytes > Yf ? 50 : 800) + t,
              );
              return (
                (e.unsuspend = n),
                function () {
                  ((e.unsuspend = null), clearTimeout(r), clearTimeout(i));
                }
              );
            }
          : null
      );
    }
    function Zf() {
      if (
        (this.count--,
        this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
      ) {
        if (this.stylesheets) $f(this, this.stylesheets);
        else if (this.unsuspend) {
          var e = this.unsuspend;
          ((this.unsuspend = null), e());
        }
      }
    }
    var Qf = null;
    function $f(e, t) {
      ((e.stylesheets = null),
        e.unsuspend !== null &&
          (e.count++,
          (Qf = new Map()),
          t.forEach(ep, e),
          (Qf = null),
          Zf.call(e)));
    }
    function ep(e, t) {
      if (!(t.state.loading & 4)) {
        var n = Qf.get(e);
        if (n) var r = n.get(null);
        else {
          ((n = new Map()), Qf.set(e, n));
          for (
            var i = e.querySelectorAll(
                `link[data-precedence],style[data-precedence]`,
              ),
              a = 0;
            a < i.length;
            a++
          ) {
            var o = i[a];
            (o.nodeName === `LINK` || o.getAttribute(`media`) !== `not all`) &&
              (n.set(o.dataset.precedence, o), (r = o));
          }
          r && n.set(null, r);
        }
        ((i = t.instance),
          (o = i.getAttribute(`data-precedence`)),
          (a = n.get(o) || r),
          a === r && n.set(null, i),
          n.set(o, i),
          this.count++,
          (r = Zf.bind(this)),
          i.addEventListener(`load`, r),
          i.addEventListener(`error`, r),
          a
            ? a.parentNode.insertBefore(i, a.nextSibling)
            : ((e = e.nodeType === 9 ? e.head : e),
              e.insertBefore(i, e.firstChild)),
          (t.state.loading |= 4));
      }
    }
    var tp = {
      $$typeof: C,
      Provider: null,
      Consumer: null,
      _currentValue: ne,
      _currentValue2: ne,
      _threadCount: 0,
    };
    function np(e, t, n, r, i, a, o, s, c) {
      ((this.tag = 1),
        (this.containerInfo = e),
        (this.pingCache = this.current = this.pendingChildren = null),
        (this.timeoutHandle = -1),
        (this.callbackNode =
          this.next =
          this.pendingContext =
          this.context =
          this.cancelPendingCommit =
            null),
        (this.callbackPriority = 0),
        (this.expirationTimes = Xe(-1)),
        (this.entangledLanes =
          this.shellSuspendCounter =
          this.errorRecoveryDisabledLanes =
          this.expiredLanes =
          this.warmLanes =
          this.pingedLanes =
          this.suspendedLanes =
          this.pendingLanes =
            0),
        (this.entanglements = Xe(0)),
        (this.hiddenUpdates = Xe(null)),
        (this.identifierPrefix = r),
        (this.onUncaughtError = i),
        (this.onCaughtError = a),
        (this.onRecoverableError = o),
        (this.pooledCache = null),
        (this.pooledCacheLanes = 0),
        (this.formState = c),
        (this.incompleteTransitions = new Map()));
    }
    function rp(e, t, n, r, i, a, o, s, c, l, u, d) {
      return (
        (e = new np(e, t, n, o, c, l, u, d, s)),
        (t = 1),
        !0 === a && (t |= 24),
        (a = li(3, null, null, t)),
        (e.current = a),
        (a.stateNode = e),
        (t = la()),
        t.refCount++,
        (e.pooledCache = t),
        t.refCount++,
        (a.memoizedState = { element: r, isDehydrated: n, cache: t }),
        Ha(a),
        e
      );
    }
    function ip(e) {
      return e ? ((e = si), e) : si;
    }
    function ap(e, t, n, r, i, a) {
      ((i = ip(i)),
        r.context === null ? (r.context = i) : (r.pendingContext = i),
        (r = Wa(t)),
        (r.payload = { element: n }),
        (a = a === void 0 ? null : a),
        a !== null && (r.callback = a),
        (n = Ga(e, r, t)),
        n !== null && (vu(n, e, t), Ka(n, e, t)));
    }
    function op(e, t) {
      if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
        var n = e.retryLane;
        e.retryLane = n !== 0 && n < t ? n : t;
      }
    }
    function sp(e, t) {
      (op(e, t), (e = e.alternate) && op(e, t));
    }
    function cp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = ii(e, 67108864);
        (t !== null && vu(t, e, 67108864), sp(e, 67108864));
      }
    }
    function lp(e) {
      if (e.tag === 13 || e.tag === 31) {
        var t = gu();
        t = nt(t);
        var n = ii(e, t);
        (n !== null && vu(n, e, t), sp(e, t));
      }
    }
    var up = !0;
    function dp(e, t, n, r) {
      var i = P.T;
      P.T = null;
      var a = F.p;
      try {
        ((F.p = 2), pp(e, t, n, r));
      } finally {
        ((F.p = a), (P.T = i));
      }
    }
    function fp(e, t, n, r) {
      var i = P.T;
      P.T = null;
      var a = F.p;
      try {
        ((F.p = 8), pp(e, t, n, r));
      } finally {
        ((F.p = a), (P.T = i));
      }
    }
    function pp(e, t, n, r) {
      if (up) {
        var i = mp(r);
        if (i === null) (Dd(e, t, r, hp, n), Ep(e, r));
        else if (Op(i, e, t, n, r)) r.stopPropagation();
        else if ((Ep(e, r), t & 4 && -1 < Tp.indexOf(e))) {
          for (; i !== null; ) {
            var a = _t(i);
            if (a !== null)
              switch (a.tag) {
                case 3:
                  if (
                    ((a = a.stateNode), a.current.memoizedState.isDehydrated)
                  ) {
                    var o = Ge(a.pendingLanes);
                    if (o !== 0) {
                      var s = a;
                      for (s.pendingLanes |= 2, s.entangledLanes |= 2; o; ) {
                        var c = 1 << (31 - Re(o));
                        ((s.entanglements[1] |= c), (o &= ~c));
                      }
                      (od(a), !(W & 6) && ((iu = Ee() + 500), sd(0, !1)));
                    }
                  }
                  break;
                case 31:
                case 13:
                  ((s = ii(a, 2)), s !== null && vu(s, a, 2), Cu(), sp(a, 2));
              }
            if (((a = mp(r)), a === null && Dd(e, t, r, hp, n), a === i)) break;
            i = a;
          }
          i !== null && r.stopPropagation();
        } else Dd(e, t, r, null, n);
      }
    }
    function mp(e) {
      return ((e = nn(e)), gp(e));
    }
    var hp = null;
    function gp(e) {
      if (((hp = null), (e = gt(e)), e !== null)) {
        var t = o(e);
        if (t === null) e = null;
        else {
          var n = t.tag;
          if (n === 13) {
            if (((e = s(t)), e !== null)) return e;
            e = null;
          } else if (n === 31) {
            if (((e = c(t)), e !== null)) return e;
            e = null;
          } else if (n === 3) {
            if (t.stateNode.current.memoizedState.isDehydrated)
              return t.tag === 3 ? t.stateNode.containerInfo : null;
            e = null;
          } else t !== e && (e = null);
        }
      }
      return ((hp = e), null);
    }
    function _p(e) {
      switch (e) {
        case `beforetoggle`:
        case `cancel`:
        case `click`:
        case `close`:
        case `contextmenu`:
        case `copy`:
        case `cut`:
        case `auxclick`:
        case `dblclick`:
        case `dragend`:
        case `dragstart`:
        case `drop`:
        case `focusin`:
        case `focusout`:
        case `input`:
        case `invalid`:
        case `keydown`:
        case `keypress`:
        case `keyup`:
        case `mousedown`:
        case `mouseup`:
        case `paste`:
        case `pause`:
        case `play`:
        case `pointercancel`:
        case `pointerdown`:
        case `pointerup`:
        case `ratechange`:
        case `reset`:
        case `resize`:
        case `seeked`:
        case `submit`:
        case `toggle`:
        case `touchcancel`:
        case `touchend`:
        case `touchstart`:
        case `volumechange`:
        case `change`:
        case `selectionchange`:
        case `textInput`:
        case `compositionstart`:
        case `compositionend`:
        case `compositionupdate`:
        case `beforeblur`:
        case `afterblur`:
        case `beforeinput`:
        case `blur`:
        case `fullscreenchange`:
        case `focus`:
        case `hashchange`:
        case `popstate`:
        case `select`:
        case `selectstart`:
          return 2;
        case `drag`:
        case `dragenter`:
        case `dragexit`:
        case `dragleave`:
        case `dragover`:
        case `mousemove`:
        case `mouseout`:
        case `mouseover`:
        case `pointermove`:
        case `pointerout`:
        case `pointerover`:
        case `scroll`:
        case `touchmove`:
        case `wheel`:
        case `mouseenter`:
        case `mouseleave`:
        case `pointerenter`:
        case `pointerleave`:
          return 8;
        case `message`:
          switch (De()) {
            case Oe:
              return 2;
            case ke:
              return 8;
            case Ae:
            case je:
              return 32;
            case Me:
              return 268435456;
            default:
              return 32;
          }
        default:
          return 32;
      }
    }
    var vp = !1,
      yp = null,
      bp = null,
      xp = null,
      Sp = new Map(),
      Cp = new Map(),
      wp = [],
      Tp =
        `mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(
          ` `,
        );
    function Ep(e, t) {
      switch (e) {
        case `focusin`:
        case `focusout`:
          yp = null;
          break;
        case `dragenter`:
        case `dragleave`:
          bp = null;
          break;
        case `mouseover`:
        case `mouseout`:
          xp = null;
          break;
        case `pointerover`:
        case `pointerout`:
          Sp.delete(t.pointerId);
          break;
        case `gotpointercapture`:
        case `lostpointercapture`:
          Cp.delete(t.pointerId);
      }
    }
    function Dp(e, t, n, r, i, a) {
      return e === null || e.nativeEvent !== a
        ? ((e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: r,
            nativeEvent: a,
            targetContainers: [i],
          }),
          t !== null && ((t = _t(t)), t !== null && cp(t)),
          e)
        : ((e.eventSystemFlags |= r),
          (t = e.targetContainers),
          i !== null && t.indexOf(i) === -1 && t.push(i),
          e);
    }
    function Op(e, t, n, r, i) {
      switch (t) {
        case `focusin`:
          return ((yp = Dp(yp, e, t, n, r, i)), !0);
        case `dragenter`:
          return ((bp = Dp(bp, e, t, n, r, i)), !0);
        case `mouseover`:
          return ((xp = Dp(xp, e, t, n, r, i)), !0);
        case `pointerover`:
          var a = i.pointerId;
          return (Sp.set(a, Dp(Sp.get(a) || null, e, t, n, r, i)), !0);
        case `gotpointercapture`:
          return (
            (a = i.pointerId),
            Cp.set(a, Dp(Cp.get(a) || null, e, t, n, r, i)),
            !0
          );
      }
      return !1;
    }
    function kp(e) {
      var t = gt(e.target);
      if (t !== null) {
        var n = o(t);
        if (n !== null) {
          if (((t = n.tag), t === 13)) {
            if (((t = s(n)), t !== null)) {
              ((e.blockedOn = t),
                at(e.priority, function () {
                  lp(n);
                }));
              return;
            }
          } else if (t === 31) {
            if (((t = c(n)), t !== null)) {
              ((e.blockedOn = t),
                at(e.priority, function () {
                  lp(n);
                }));
              return;
            }
          } else if (
            t === 3 &&
            n.stateNode.current.memoizedState.isDehydrated
          ) {
            e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
            return;
          }
        }
      }
      e.blockedOn = null;
    }
    function Ap(e) {
      if (e.blockedOn !== null) return !1;
      for (var t = e.targetContainers; 0 < t.length; ) {
        var n = mp(e.nativeEvent);
        if (n === null) {
          n = e.nativeEvent;
          var r = new n.constructor(n.type, n);
          ((tn = r), n.target.dispatchEvent(r), (tn = null));
        } else return ((t = _t(n)), t !== null && cp(t), (e.blockedOn = n), !1);
        t.shift();
      }
      return !0;
    }
    function jp(e, t, n) {
      Ap(e) && n.delete(t);
    }
    function Mp() {
      ((vp = !1),
        yp !== null && Ap(yp) && (yp = null),
        bp !== null && Ap(bp) && (bp = null),
        xp !== null && Ap(xp) && (xp = null),
        Sp.forEach(jp),
        Cp.forEach(jp));
    }
    function Np(e, n) {
      e.blockedOn === n &&
        ((e.blockedOn = null),
        vp ||
          ((vp = !0),
          t.unstable_scheduleCallback(t.unstable_NormalPriority, Mp)));
    }
    var Pp = null;
    function Fp(e) {
      Pp !== e &&
        ((Pp = e),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
          Pp === e && (Pp = null);
          for (var t = 0; t < e.length; t += 3) {
            var n = e[t],
              r = e[t + 1],
              i = e[t + 2];
            if (typeof r != `function`) {
              if (gp(r || n) === null) continue;
              break;
            }
            var a = _t(n);
            a !== null &&
              (e.splice(t, 3),
              (t -= 3),
              Ts(
                a,
                { pending: !0, data: i, method: n.method, action: r },
                r,
                i,
              ));
          }
        }));
    }
    function Ip(e) {
      function t(t) {
        return Np(t, e);
      }
      (yp !== null && Np(yp, e),
        bp !== null && Np(bp, e),
        xp !== null && Np(xp, e),
        Sp.forEach(t),
        Cp.forEach(t));
      for (var n = 0; n < wp.length; n++) {
        var r = wp[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
      for (; 0 < wp.length && ((n = wp[0]), n.blockedOn === null); )
        (kp(n), n.blockedOn === null && wp.shift());
      if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
        for (r = 0; r < n.length; r += 3) {
          var i = n[r],
            a = n[r + 1],
            o = i[ct] || null;
          if (typeof a == `function`) o || Fp(n);
          else if (o) {
            var s = null;
            if (a && a.hasAttribute(`formAction`)) {
              if (((i = a), (o = a[ct] || null))) s = o.formAction;
              else if (gp(i) !== null) continue;
            } else s = o.action;
            (typeof s == `function`
              ? (n[r + 1] = s)
              : (n.splice(r, 3), (r -= 3)),
              Fp(n));
          }
        }
    }
    function Lp() {
      function e(e) {
        e.canIntercept &&
          e.info === `react-transition` &&
          e.intercept({
            handler: function () {
              return new Promise(function (e) {
                return (i = e);
              });
            },
            focusReset: `manual`,
            scroll: `manual`,
          });
      }
      function t() {
        (i !== null && (i(), (i = null)), r || setTimeout(n, 20));
      }
      function n() {
        if (!r && !navigation.transition) {
          var e = navigation.currentEntry;
          e &&
            e.url != null &&
            navigation.navigate(e.url, {
              state: e.getState(),
              info: `react-transition`,
              history: `replace`,
            });
        }
      }
      if (typeof navigation == `object`) {
        var r = !1,
          i = null;
        return (
          navigation.addEventListener(`navigate`, e),
          navigation.addEventListener(`navigatesuccess`, t),
          navigation.addEventListener(`navigateerror`, t),
          setTimeout(n, 100),
          function () {
            ((r = !0),
              navigation.removeEventListener(`navigate`, e),
              navigation.removeEventListener(`navigatesuccess`, t),
              navigation.removeEventListener(`navigateerror`, t),
              i !== null && (i(), (i = null)));
          }
        );
      }
    }
    function Rp(e) {
      this._internalRoot = e;
    }
    ((zp.prototype.render = Rp.prototype.render =
      function (e) {
        var t = this._internalRoot;
        if (t === null) throw Error(i(409));
        var n = t.current;
        ap(n, gu(), e, t, null, null);
      }),
      (zp.prototype.unmount = Rp.prototype.unmount =
        function () {
          var e = this._internalRoot;
          if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            (ap(e.current, 2, null, e, null, null), Cu(), (t[lt] = null));
          }
        }));
    function zp(e) {
      this._internalRoot = e;
    }
    zp.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = it();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < wp.length && t !== 0 && t < wp[n].priority; n++);
        (wp.splice(n, 0, e), n === 0 && kp(e));
      }
    };
    var Bp = n.version;
    if (Bp !== `19.2.5`) throw Error(i(527, Bp, `19.2.5`));
    F.findDOMNode = function (e) {
      var t = e._reactInternals;
      if (t === void 0)
        throw typeof e.render == `function`
          ? Error(i(188))
          : ((e = Object.keys(e).join(`,`)), Error(i(268, e)));
      return (
        (e = u(t)),
        (e = e === null ? null : d(e)),
        (e = e === null ? null : e.stateNode),
        e
      );
    };
    var Vp = {
      bundleType: 0,
      version: `19.2.5`,
      rendererPackageName: `react-dom`,
      currentDispatcherRef: P,
      reconcilerVersion: `19.2.5`,
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
      var Hp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!Hp.isDisabled && Hp.supportsFiber)
        try {
          ((Fe = Hp.inject(Vp)), (Ie = Hp));
        } catch {}
    }
    e.createRoot = function (e, t) {
      if (!a(e)) throw Error(i(299));
      var n = !1,
        r = ``,
        o = qs,
        s = Js,
        c = Ys;
      return (
        t != null &&
          (!0 === t.unstable_strictMode && (n = !0),
          t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
          t.onCaughtError !== void 0 && (s = t.onCaughtError),
          t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
        (t = rp(e, 1, !1, null, null, n, r, null, o, s, c, Lp)),
        (e[lt] = t.current),
        Td(e),
        new Rp(t)
      );
    };
  }),
  y = s((e, t) => {
    function n() {
      if (
        !(
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > `u` ||
          typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != `function`
        )
      )
        try {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
        } catch (e) {
          console.error(e);
        }
    }
    (n(), (t.exports = v()));
  }),
  b = `modulepreload`,
  x = function (e) {
    return `/` + e;
  },
  S = {},
  C = function (e, t, n) {
    let r = Promise.resolve();
    if (t && t.length > 0) {
      let e = document.getElementsByTagName(`link`),
        i = document.querySelector(`meta[property=csp-nonce]`),
        a = i?.nonce || i?.getAttribute(`nonce`);
      function o(e) {
        return Promise.all(
          e.map((e) =>
            Promise.resolve(e).then(
              (e) => ({ status: `fulfilled`, value: e }),
              (e) => ({ status: `rejected`, reason: e }),
            ),
          ),
        );
      }
      r = o(
        t.map((t) => {
          if (((t = x(t, n)), t in S)) return;
          S[t] = !0;
          let r = t.endsWith(`.css`),
            i = r ? `[rel="stylesheet"]` : ``;
          if (n)
            for (let n = e.length - 1; n >= 0; n--) {
              let i = e[n];
              if (i.href === t && (!r || i.rel === `stylesheet`)) return;
            }
          else if (document.querySelector(`link[href="${t}"]${i}`)) return;
          let o = document.createElement(`link`);
          if (
            ((o.rel = r ? `stylesheet` : b),
            r || (o.as = `script`),
            (o.crossOrigin = ``),
            (o.href = t),
            a && o.setAttribute(`nonce`, a),
            document.head.appendChild(o),
            r)
          )
            return new Promise((e, n) => {
              (o.addEventListener(`load`, e),
                o.addEventListener(`error`, () =>
                  n(Error(`Unable to preload CSS for ${t}`)),
                ));
            });
        }),
      );
    }
    function i(e) {
      let t = new Event(`vite:preloadError`, { cancelable: !0 });
      if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented))
        throw e;
    }
    return r.then((t) => {
      for (let e of t || []) e.status === `rejected` && i(e.reason);
      return e().catch(i);
    });
  },
  w = u(p(), 1),
  T = (e) => {
    throw TypeError(e);
  },
  E = (e, t, n) => t.has(e) || T(`Cannot ` + n),
  D = (e, t, n) => (
    E(e, t, `read from private field`),
    n ? n.call(e) : t.get(e)
  ),
  O = (e, t, n) =>
    t.has(e)
      ? T(`Cannot add the same private member more than once`)
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, n),
  ee = `popstate`;
function k(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `pathname` in e &&
    `search` in e &&
    `hash` in e &&
    `state` in e &&
    `key` in e
  );
}
function A(e = {}) {
  function t(e, t) {
    let {
      pathname: n = `/`,
      search: r = ``,
      hash: i = ``,
    } = ne(e.location.hash.substring(1));
    return (
      !n.startsWith(`/`) && !n.startsWith(`.`) && (n = `/` + n),
      P(
        ``,
        { pathname: n, search: r, hash: i },
        (t.state && t.state.usr) || null,
        (t.state && t.state.key) || `default`,
      )
    );
  }
  function n(e, t) {
    let n = e.document.querySelector(`base`),
      r = ``;
    if (n && n.getAttribute(`href`)) {
      let t = e.location.href,
        n = t.indexOf(`#`);
      r = n === -1 ? t : t.slice(0, n);
    }
    return r + `#` + (typeof t == `string` ? t : F(t));
  }
  function r(e, t) {
    M(
      e.pathname.charAt(0) === `/`,
      `relative pathnames are not supported in hash history.push(${JSON.stringify(t)})`,
    );
  }
  return I(t, n, r, e);
}
function j(e, t) {
  if (e === !1 || e == null) throw Error(t);
}
function M(e, t) {
  if (!e) {
    typeof console < `u` && console.warn(t);
    try {
      throw Error(t);
    } catch {}
  }
}
function N() {
  return Math.random().toString(36).substring(2, 10);
}
function te(e, t) {
  return {
    usr: e.state,
    key: e.key,
    idx: t,
    masked: e.unstable_mask
      ? { pathname: e.pathname, search: e.search, hash: e.hash }
      : void 0,
  };
}
function P(e, t, n = null, r, i) {
  return {
    pathname: typeof e == `string` ? e : e.pathname,
    search: ``,
    hash: ``,
    ...(typeof t == `string` ? ne(t) : t),
    state: n,
    key: (t && t.key) || r || N(),
    unstable_mask: i,
  };
}
function F({ pathname: e = `/`, search: t = ``, hash: n = `` }) {
  return (
    t && t !== `?` && (e += t.charAt(0) === `?` ? t : `?` + t),
    n && n !== `#` && (e += n.charAt(0) === `#` ? n : `#` + n),
    e
  );
}
function ne(e) {
  let t = {};
  if (e) {
    let n = e.indexOf(`#`);
    n >= 0 && ((t.hash = e.substring(n)), (e = e.substring(0, n)));
    let r = e.indexOf(`?`);
    (r >= 0 && ((t.search = e.substring(r)), (e = e.substring(0, r))),
      e && (t.pathname = e));
  }
  return t;
}
function I(e, t, n, r = {}) {
  let { window: i = document.defaultView, v5Compat: a = !1 } = r,
    o = i.history,
    s = `POP`,
    c = null,
    l = u();
  l ?? ((l = 0), o.replaceState({ ...o.state, idx: l }, ``));
  function u() {
    return (o.state || { idx: null }).idx;
  }
  function d() {
    s = `POP`;
    let e = u(),
      t = e == null ? null : e - l;
    ((l = e), c && c({ action: s, location: h.location, delta: t }));
  }
  function f(e, t) {
    s = `PUSH`;
    let r = k(e) ? e : P(h.location, e, t);
    (n && n(r, e), (l = u() + 1));
    let d = te(r, l),
      f = h.createHref(r.unstable_mask || r);
    try {
      o.pushState(d, ``, f);
    } catch (e) {
      if (e instanceof DOMException && e.name === `DataCloneError`) throw e;
      i.location.assign(f);
    }
    a && c && c({ action: s, location: h.location, delta: 1 });
  }
  function p(e, t) {
    s = `REPLACE`;
    let r = k(e) ? e : P(h.location, e, t);
    (n && n(r, e), (l = u()));
    let i = te(r, l),
      d = h.createHref(r.unstable_mask || r);
    (o.replaceState(i, ``, d),
      a && c && c({ action: s, location: h.location, delta: 0 }));
  }
  function m(e) {
    return re(e);
  }
  let h = {
    get action() {
      return s;
    },
    get location() {
      return e(i, o);
    },
    listen(e) {
      if (c) throw Error(`A history only accepts one active listener`);
      return (
        i.addEventListener(ee, d),
        (c = e),
        () => {
          (i.removeEventListener(ee, d), (c = null));
        }
      );
    },
    createHref(e) {
      return t(i, e);
    },
    createURL: m,
    encodeLocation(e) {
      let t = m(e);
      return { pathname: t.pathname, search: t.search, hash: t.hash };
    },
    push: f,
    replace: p,
    go(e) {
      return o.go(e);
    },
  };
  return h;
}
function re(e, t = !1) {
  let n = `http://localhost`;
  (typeof window < `u` &&
    (n =
      window.location.origin === `null`
        ? window.location.href
        : window.location.origin),
    j(n, `No window.location.(origin|href) available to create URL`));
  let r = typeof e == `string` ? e : F(e);
  return (
    (r = r.replace(/ $/, `%20`)),
    !t && r.startsWith(`//`) && (r = n + r),
    new URL(r, n)
  );
}
var ie,
  ae = class {
    constructor(e) {
      if ((O(this, ie, new Map()), e)) for (let [t, n] of e) this.set(t, n);
    }
    get(e) {
      if (D(this, ie).has(e)) return D(this, ie).get(e);
      if (e.defaultValue !== void 0) return e.defaultValue;
      throw Error(`No value found for context`);
    }
    set(e, t) {
      D(this, ie).set(e, t);
    }
  };
ie = new WeakMap();
var L = new Set([`lazy`, `caseSensitive`, `path`, `id`, `index`, `children`]);
function oe(e) {
  return L.has(e);
}
var se = new Set([
  `lazy`,
  `caseSensitive`,
  `path`,
  `id`,
  `index`,
  `middleware`,
  `children`,
]);
function ce(e) {
  return se.has(e);
}
function le(e) {
  return e.index === !0;
}
function ue(e, t, n = [], r = {}, i = !1) {
  return e.map((e, a) => {
    let o = [...n, String(a)],
      s = typeof e.id == `string` ? e.id : o.join(`-`);
    if (
      (j(
        e.index !== !0 || !e.children,
        `Cannot specify children on an index route`,
      ),
      j(
        i || !r[s],
        `Found a route id collision on id "${s}".  Route id's must be globally unique within Data Router usages`,
      ),
      le(e))
    ) {
      let n = { ...e, id: s };
      return ((r[s] = de(n, t(n))), n);
    } else {
      let n = { ...e, id: s, children: void 0 };
      return (
        (r[s] = de(n, t(n))),
        e.children && (n.children = ue(e.children, t, o, r, i)),
        n
      );
    }
  });
}
function de(e, t) {
  return Object.assign(e, {
    ...t,
    ...(typeof t.lazy == `object` && t.lazy != null
      ? { lazy: { ...e.lazy, ...t.lazy } }
      : {}),
  });
}
function fe(e, t, n = `/`) {
  return pe(e, t, n, !1);
}
function pe(e, t, n, r) {
  let i = je((typeof t == `string` ? ne(t) : t).pathname || `/`, n);
  if (i == null) return null;
  let a = he(e);
  _e(a);
  let o = null;
  for (let e = 0; o == null && e < a.length; ++e) {
    let t = Ae(i);
    o = De(a[e], t, r);
  }
  return o;
}
function me(e, t) {
  let { route: n, pathname: r, params: i } = e;
  return {
    id: n.id,
    pathname: r,
    params: i,
    data: t[n.id],
    loaderData: t[n.id],
    handle: n.handle,
  };
}
function he(e, t = [], n = [], r = ``, i = !1) {
  let a = (e, a, o = i, s) => {
    let c = {
      relativePath: s === void 0 ? e.path || `` : s,
      caseSensitive: e.caseSensitive === !0,
      childrenIndex: a,
      route: e,
    };
    if (c.relativePath.startsWith(`/`)) {
      if (!c.relativePath.startsWith(r) && o) return;
      (j(
        c.relativePath.startsWith(r),
        `Absolute route path "${c.relativePath}" nested under path "${r}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (c.relativePath = c.relativePath.slice(r.length)));
    }
    let l = He([r, c.relativePath]),
      u = n.concat(c);
    (e.children &&
      e.children.length > 0 &&
      (j(
        e.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${l}".`,
      ),
      he(e.children, t, u, l, o)),
      !(e.path == null && !e.index) &&
        t.push({ path: l, score: Te(l, e.index), routesMeta: u }));
  };
  return (
    e.forEach((e, t) => {
      if (e.path === `` || !e.path?.includes(`?`)) a(e, t);
      else for (let n of ge(e.path)) a(e, t, !0, n);
    }),
    t
  );
}
function ge(e) {
  let t = e.split(`/`);
  if (t.length === 0) return [];
  let [n, ...r] = t,
    i = n.endsWith(`?`),
    a = n.replace(/\?$/, ``);
  if (r.length === 0) return i ? [a, ``] : [a];
  let o = ge(r.join(`/`)),
    s = [];
  return (
    s.push(...o.map((e) => (e === `` ? a : [a, e].join(`/`)))),
    i && s.push(...o),
    s.map((t) => (e.startsWith(`/`) && t === `` ? `/` : t))
  );
}
function _e(e) {
  e.sort((e, t) =>
    e.score === t.score
      ? Ee(
          e.routesMeta.map((e) => e.childrenIndex),
          t.routesMeta.map((e) => e.childrenIndex),
        )
      : t.score - e.score,
  );
}
var ve = /^:[\w-]+$/,
  ye = 3,
  be = 2,
  xe = 1,
  Se = 10,
  Ce = -2,
  we = (e) => e === `*`;
function Te(e, t) {
  let n = e.split(`/`),
    r = n.length;
  return (
    n.some(we) && (r += Ce),
    t && (r += be),
    n
      .filter((e) => !we(e))
      .reduce((e, t) => e + (ve.test(t) ? ye : t === `` ? xe : Se), r)
  );
}
function Ee(e, t) {
  return e.length === t.length && e.slice(0, -1).every((e, n) => e === t[n])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function De(e, t, n = !1) {
  let { routesMeta: r } = e,
    i = {},
    a = `/`,
    o = [];
  for (let e = 0; e < r.length; ++e) {
    let s = r[e],
      c = e === r.length - 1,
      l = a === `/` ? t : t.slice(a.length) || `/`,
      u = Oe(
        { path: s.relativePath, caseSensitive: s.caseSensitive, end: c },
        l,
      ),
      d = s.route;
    if (
      (!u &&
        c &&
        n &&
        !r[r.length - 1].route.index &&
        (u = Oe(
          { path: s.relativePath, caseSensitive: s.caseSensitive, end: !1 },
          l,
        )),
      !u)
    )
      return null;
    (Object.assign(i, u.params),
      o.push({
        params: i,
        pathname: He([a, u.pathname]),
        pathnameBase: We(He([a, u.pathnameBase])),
        route: d,
      }),
      u.pathnameBase !== `/` && (a = He([a, u.pathnameBase])));
  }
  return o;
}
function Oe(e, t) {
  typeof e == `string` && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = ke(e.path, e.caseSensitive, e.end),
    i = t.match(n);
  if (!i) return null;
  let a = i[0],
    o = a.replace(/(.)\/+$/, `$1`),
    s = i.slice(1);
  return {
    params: r.reduce((e, { paramName: t, isOptional: n }, r) => {
      if (t === `*`) {
        let e = s[r] || ``;
        o = a.slice(0, a.length - e.length).replace(/(.)\/+$/, `$1`);
      }
      let i = s[r];
      return (
        n && !i ? (e[t] = void 0) : (e[t] = (i || ``).replace(/%2F/g, `/`)),
        e
      );
    }, {}),
    pathname: a,
    pathnameBase: o,
    pattern: e,
  };
}
function ke(e, t = !1, n = !0) {
  M(
    e === `*` || !e.endsWith(`*`) || e.endsWith(`/*`),
    `Route path "${e}" will be treated as if it were "${e.replace(/\*$/, `/*`)}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${e.replace(/\*$/, `/*`)}".`,
  );
  let r = [],
    i =
      `^` +
      e
        .replace(/\/*\*?$/, ``)
        .replace(/^\/*/, `/`)
        .replace(/[\\.*+^${}|()[\]]/g, `\\$&`)
        .replace(/\/:([\w-]+)(\?)?/g, (e, t, n, i, a) => {
          if ((r.push({ paramName: t, isOptional: n != null }), n)) {
            let t = a.charAt(i + e.length);
            return t && t !== `/` ? `/([^\\/]*)` : `(?:/([^\\/]*))?`;
          }
          return `/([^\\/]+)`;
        })
        .replace(/\/([\w-]+)\?(\/|$)/g, `(/$1)?$2`);
  return (
    e.endsWith(`*`)
      ? (r.push({ paramName: `*` }),
        (i += e === `*` || e === `/*` ? `(.*)$` : `(?:\\/(.+)|\\/*)$`))
      : n
        ? (i += `\\/*$`)
        : e !== `` && e !== `/` && (i += `(?:(?=\\/|$))`),
    [new RegExp(i, t ? void 0 : `i`), r]
  );
}
function Ae(e) {
  try {
    return e
      .split(`/`)
      .map((e) => decodeURIComponent(e).replace(/\//g, `%2F`))
      .join(`/`);
  } catch (t) {
    return (
      M(
        !1,
        `The URL path "${e}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${t}).`,
      ),
      e
    );
  }
}
function je(e, t) {
  if (t === `/`) return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith(`/`) ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== `/` ? null : e.slice(n) || `/`;
}
function Me({ basename: e, pathname: t }) {
  return t === `/` ? e : He([e, t]);
}
var Ne = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Pe = (e) => Ne.test(e);
function Fe(e, t = `/`) {
  let {
      pathname: n,
      search: r = ``,
      hash: i = ``,
    } = typeof e == `string` ? ne(e) : e,
    a;
  return (
    n
      ? ((n = Ve(n)),
        (a = n.startsWith(`/`) ? Ie(n.substring(1), `/`) : Ie(n, t)))
      : (a = t),
    { pathname: a, search: Ge(r), hash: Ke(i) }
  );
}
function Ie(e, t) {
  let n = Ue(t).split(`/`);
  return (
    e.split(`/`).forEach((e) => {
      e === `..` ? n.length > 1 && n.pop() : e !== `.` && n.push(e);
    }),
    n.length > 1 ? n.join(`/`) : `/`
  );
}
function Le(e, t, n, r) {
  return `Cannot include a '${e}' character in a manually specified \`to.${t}\` field [${JSON.stringify(r)}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function Re(e) {
  return e.filter(
    (e, t) => t === 0 || (e.route.path && e.route.path.length > 0),
  );
}
function ze(e) {
  let t = Re(e);
  return t.map((e, n) => (n === t.length - 1 ? e.pathname : e.pathnameBase));
}
function Be(e, t, n, r = !1) {
  let i;
  typeof e == `string`
    ? (i = ne(e))
    : ((i = { ...e }),
      j(
        !i.pathname || !i.pathname.includes(`?`),
        Le(`?`, `pathname`, `search`, i),
      ),
      j(
        !i.pathname || !i.pathname.includes(`#`),
        Le(`#`, `pathname`, `hash`, i),
      ),
      j(!i.search || !i.search.includes(`#`), Le(`#`, `search`, `hash`, i)));
  let a = e === `` || i.pathname === ``,
    o = a ? `/` : i.pathname,
    s;
  if (o == null) s = n;
  else {
    let e = t.length - 1;
    if (!r && o.startsWith(`..`)) {
      let t = o.split(`/`);
      for (; t[0] === `..`; ) (t.shift(), --e);
      i.pathname = t.join(`/`);
    }
    s = e >= 0 ? t[e] : `/`;
  }
  let c = Fe(i, s),
    l = o && o !== `/` && o.endsWith(`/`),
    u = (a || o === `.`) && n.endsWith(`/`);
  return (!c.pathname.endsWith(`/`) && (l || u) && (c.pathname += `/`), c);
}
var Ve = (e) => e.replace(/\/\/+/g, `/`),
  He = (e) => Ve(e.join(`/`)),
  Ue = (e) => e.replace(/\/+$/, ``),
  We = (e) => Ue(e).replace(/^\/*/, `/`),
  Ge = (e) => (!e || e === `?` ? `` : e.startsWith(`?`) ? e : `?` + e),
  Ke = (e) => (!e || e === `#` ? `` : e.startsWith(`#`) ? e : `#` + e),
  qe = class {
    constructor(e, t, n, r = !1) {
      ((this.status = e),
        (this.statusText = t || ``),
        (this.internal = r),
        n instanceof Error
          ? ((this.data = n.toString()), (this.error = n))
          : (this.data = n));
    }
  };
function Je(e) {
  return (
    e != null &&
    typeof e.status == `number` &&
    typeof e.statusText == `string` &&
    typeof e.internal == `boolean` &&
    `data` in e
  );
}
function Ye(e) {
  return He(e.map((e) => e.route.path).filter(Boolean)) || `/`;
}
var Xe =
  typeof window < `u` &&
  window.document !== void 0 &&
  window.document.createElement !== void 0;
function Ze(e, t) {
  let n = e;
  if (typeof n != `string` || !Ne.test(n))
    return { absoluteURL: void 0, isExternal: !1, to: n };
  let r = n,
    i = !1;
  if (Xe)
    try {
      let e = new URL(window.location.href),
        r = n.startsWith(`//`) ? new URL(e.protocol + n) : new URL(n),
        a = je(r.pathname, t);
      r.origin === e.origin && a != null
        ? (n = a + r.search + r.hash)
        : (i = !0);
    } catch {
      M(
        !1,
        `<Link to="${n}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: r, isExternal: i, to: n };
}
var Qe = Symbol(`Uninstrumented`);
function $e(e, t) {
  let n = {
    lazy: [],
    "lazy.loader": [],
    "lazy.action": [],
    "lazy.middleware": [],
    middleware: [],
    loader: [],
    action: [],
  };
  e.forEach((e) =>
    e({
      id: t.id,
      index: t.index,
      path: t.path,
      instrument(e) {
        let t = Object.keys(n);
        for (let r of t) e[r] && n[r].push(e[r]);
      },
    }),
  );
  let r = {};
  if (typeof t.lazy == `function` && n.lazy.length > 0) {
    let e = tt(n.lazy, t.lazy, () => void 0);
    e && (r.lazy = e);
  }
  if (typeof t.lazy == `object`) {
    let e = t.lazy;
    [`middleware`, `loader`, `action`].forEach((t) => {
      let i = e[t],
        a = n[`lazy.${t}`];
      if (typeof i == `function` && a.length > 0) {
        let e = tt(a, i, () => void 0);
        e && (r.lazy = Object.assign(r.lazy || {}, { [t]: e }));
      }
    });
  }
  return (
    [`loader`, `action`].forEach((e) => {
      let i = t[e];
      if (typeof i == `function` && n[e].length > 0) {
        let t = i[Qe] ?? i,
          a = tt(n[e], t, (...e) => rt(e[0]));
        a &&
          (e === `loader` && t.hydrate === !0 && (a.hydrate = !0),
          (a[Qe] = t),
          (r[e] = a));
      }
    }),
    t.middleware &&
      t.middleware.length > 0 &&
      n.middleware.length > 0 &&
      (r.middleware = t.middleware.map((e) => {
        let t = e[Qe] ?? e,
          r = tt(n.middleware, t, (...e) => rt(e[0]));
        return r ? ((r[Qe] = t), r) : e;
      })),
    r
  );
}
function et(e, t) {
  let n = { navigate: [], fetch: [] };
  if (
    (t.forEach((e) =>
      e({
        instrument(e) {
          let t = Object.keys(e);
          for (let r of t) e[r] && n[r].push(e[r]);
        },
      }),
    ),
    n.navigate.length > 0)
  ) {
    let t = e.navigate[Qe] ?? e.navigate,
      r = tt(n.navigate, t, (...t) => {
        let [n, r] = t;
        return {
          to: typeof n == `number` || typeof n == `string` ? n : n ? F(n) : `.`,
          ...it(e, r ?? {}),
        };
      });
    r && ((r[Qe] = t), (e.navigate = r));
  }
  if (n.fetch.length > 0) {
    let t = e.fetch[Qe] ?? e.fetch,
      r = tt(n.fetch, t, (...t) => {
        let [n, , r, i] = t;
        return { href: r ?? `.`, fetcherKey: n, ...it(e, i ?? {}) };
      });
    r && ((r[Qe] = t), (e.fetch = r));
  }
  return e;
}
function tt(e, t, n) {
  return e.length === 0
    ? null
    : async (...r) => {
        let i = await nt(e, n(...r), () => t(...r), e.length - 1);
        if (i.type === `error`) throw i.value;
        return i.value;
      };
}
async function nt(e, t, n, r) {
  let i = e[r],
    a;
  if (i) {
    let o,
      s = async () => (
        o
          ? console.error(
              `You cannot call instrumented handlers more than once`,
            )
          : (o = nt(e, t, n, r - 1)),
        (a = await o),
        j(a, `Expected a result`),
        a.type === `error` && a.value instanceof Error
          ? { status: `error`, error: a.value }
          : { status: `success`, error: void 0 }
      );
    try {
      await i(s, t);
    } catch (e) {
      console.error(`An instrumentation function threw an error:`, e);
    }
    (o || (await s()), await o);
  } else
    try {
      a = { type: `success`, value: await n() };
    } catch (e) {
      a = { type: `error`, value: e };
    }
  return (
    a || {
      type: `error`,
      value: Error(`No result assigned in instrumentation chain.`),
    }
  );
}
function rt(e) {
  let { request: t, context: n, params: r, unstable_pattern: i } = e;
  return {
    request: at(t),
    params: { ...r },
    unstable_pattern: i,
    context: ot(n),
  };
}
function it(e, t) {
  return {
    currentUrl: F(e.state.location),
    ...(`formMethod` in t ? { formMethod: t.formMethod } : {}),
    ...(`formEncType` in t ? { formEncType: t.formEncType } : {}),
    ...(`formData` in t ? { formData: t.formData } : {}),
    ...(`body` in t ? { body: t.body } : {}),
  };
}
function at(e) {
  return {
    method: e.method,
    url: e.url,
    headers: { get: (...t) => e.headers.get(...t) },
  };
}
function ot(e) {
  if (ct(e)) {
    let t = { ...e };
    return (Object.freeze(t), t);
  } else return { get: (t) => e.get(t) };
}
var st = Object.getOwnPropertyNames(Object.prototype).sort().join(`\0`);
function ct(e) {
  if (typeof e != `object` || !e) return !1;
  let t = Object.getPrototypeOf(e);
  return (
    t === Object.prototype ||
    t === null ||
    Object.getOwnPropertyNames(t).sort().join(`\0`) === st
  );
}
var lt = [`POST`, `PUT`, `PATCH`, `DELETE`],
  ut = new Set(lt),
  dt = [`GET`, ...lt],
  ft = new Set(dt),
  pt = new Set([301, 302, 303, 307, 308]),
  mt = new Set([307, 308]),
  ht = {
    state: `idle`,
    location: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
  },
  gt = {
    state: `idle`,
    data: void 0,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
  },
  _t = { state: `unblocked`, proceed: void 0, reset: void 0, location: void 0 },
  vt = (e) => ({ hasErrorBoundary: !!e.hasErrorBoundary }),
  yt = `remix-router-transitions`,
  bt = Symbol(`ResetLoaderData`);
function xt(e) {
  let t = e.window ? e.window : typeof window < `u` ? window : void 0,
    n =
      t !== void 0 &&
      t.document !== void 0 &&
      t.document.createElement !== void 0;
  j(
    e.routes.length > 0,
    `You must provide a non-empty routes array to createRouter`,
  );
  let r = e.hydrationRouteProperties || [],
    i = e.mapRouteProperties || vt,
    a = i;
  if (e.unstable_instrumentations) {
    let t = e.unstable_instrumentations;
    a = (e) => ({ ...i(e), ...$e(t.map((e) => e.route).filter(Boolean), e) });
  }
  let o = {},
    s = ue(e.routes, a, void 0, o),
    c,
    l = e.basename || `/`;
  l.startsWith(`/`) || (l = `/${l}`);
  let u = e.dataStrategy || Rt,
    d = { unstable_passThroughRequests: !1, ...e.future },
    f = null,
    p = new Set(),
    m = null,
    h = null,
    g = null,
    _ = e.hydrationData != null,
    v = fe(s, e.history.location, l),
    y = !1,
    b = null,
    x,
    S;
  if (v == null && !e.patchRoutesOnNavigation) {
    let t = ln(404, { pathname: e.history.location.pathname }),
      { matches: n, route: r } = cn(s);
    ((x = !0), (S = !x), (v = n), (b = { [r.id]: t }));
  } else if (
    (v &&
      !e.hydrationData &&
      st(v, s, e.history.location.pathname).active &&
      (v = null),
    !v)
  ) {
    ((x = !1), (S = !x), (v = []));
    let t = st(null, s, e.history.location.pathname);
    t.active && t.matches && ((y = !0), (v = t.matches));
  } else if (v.some((e) => e.route.lazy)) ((x = !1), (S = !x));
  else if (!v.some((e) => Et(e.route))) ((x = !0), (S = !x));
  else {
    let t = e.hydrationData ? e.hydrationData.loaderData : null,
      n = e.hydrationData ? e.hydrationData.errors : null,
      r = v;
    if (n) {
      let e = v.findIndex((e) => n[e.route.id] !== void 0);
      r = r.slice(0, e + 1);
    }
    ((S = !1),
      (x = !0),
      r.forEach((e) => {
        let r = Dt(e.route, t, n);
        ((S ||= r.renderFallback), (x &&= !r.shouldLoad));
      }));
  }
  let C,
    w = {
      historyAction: e.history.action,
      location: e.history.location,
      matches: v,
      initialized: x,
      renderFallback: S,
      navigation: ht,
      restoreScrollPosition: e.hydrationData == null ? null : !1,
      preventScrollReset: !1,
      revalidation: `idle`,
      loaderData: (e.hydrationData && e.hydrationData.loaderData) || {},
      actionData: (e.hydrationData && e.hydrationData.actionData) || null,
      errors: (e.hydrationData && e.hydrationData.errors) || b,
      fetchers: new Map(),
      blockers: new Map(),
    },
    T = `POP`,
    E = null,
    D = !1,
    O,
    ee = !1,
    k = new Map(),
    A = null,
    N = !1,
    te = !1,
    F = new Set(),
    I = new Map(),
    ie = 0,
    L = -1,
    oe = new Map(),
    se = new Set(),
    ce = new Map(),
    le = new Map(),
    de = new Set(),
    he = new Map(),
    ge,
    _e = null;
  function ve() {
    if (
      ((f = e.history.listen(({ action: t, location: n, delta: r }) => {
        if (ge) {
          (ge(), (ge = void 0));
          return;
        }
        M(
          he.size === 0 || r != null,
          "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.",
        );
        let i = tt({
          currentLocation: w.location,
          nextLocation: n,
          historyAction: t,
        });
        if (i && r != null) {
          let t = new Promise((e) => {
            ge = e;
          });
          (e.history.go(r * -1),
            Qe(i, {
              state: `blocked`,
              location: n,
              proceed() {
                (Qe(i, {
                  state: `proceeding`,
                  proceed: void 0,
                  reset: void 0,
                  location: n,
                }),
                  t.then(() => e.history.go(r)));
              },
              reset() {
                let e = new Map(w.blockers);
                (e.set(i, _t), xe({ blockers: e }));
              },
            }),
            E?.resolve(),
            (E = null));
          return;
        }
        return Te(t, n);
      })),
      n)
    ) {
      Nn(t, k);
      let e = () => Pn(t, k);
      (t.addEventListener(`pagehide`, e),
        (A = () => t.removeEventListener(`pagehide`, e)));
    }
    return (
      w.initialized || Te(`POP`, w.location, { initialHydration: !0 }),
      C
    );
  }
  function ye() {
    (f && f(),
      A && A(),
      p.clear(),
      O && O.abort(),
      w.fetchers.forEach((e, t) => Ue(t)),
      w.blockers.forEach((e, t) => Ze(t)));
  }
  function be(e) {
    return (p.add(e), () => p.delete(e));
  }
  function xe(e, t = {}) {
    ((e.matches &&= e.matches.map((e) => {
      let t = o[e.route.id],
        n = e.route;
      return n.element !== t.element ||
        n.errorElement !== t.errorElement ||
        n.hydrateFallbackElement !== t.hydrateFallbackElement
        ? { ...e, route: t }
        : e;
    })),
      (w = { ...w, ...e }));
    let n = [],
      r = [];
    (w.fetchers.forEach((e, t) => {
      e.state === `idle` && (de.has(t) ? n.push(t) : r.push(t));
    }),
      de.forEach((e) => {
        !w.fetchers.has(e) && !I.has(e) && n.push(e);
      }),
      [...p].forEach((r) =>
        r(w, {
          deletedFetchers: n,
          newErrors: e.errors ?? null,
          viewTransitionOpts: t.viewTransitionOpts,
          flushSync: t.flushSync === !0,
        }),
      ),
      n.forEach((e) => Ue(e)),
      r.forEach((e) => w.fetchers.delete(e)));
  }
  function Se(t, n, { flushSync: r } = {}) {
    let i =
        w.actionData != null &&
        w.navigation.formMethod != null &&
        wn(w.navigation.formMethod) &&
        w.navigation.state === `loading` &&
        t.state?._isRedirect !== !0,
      a;
    a = n.actionData
      ? Object.keys(n.actionData).length > 0
        ? n.actionData
        : null
      : i
        ? w.actionData
        : null;
    let o = n.loaderData
        ? an(w.loaderData, n.loaderData, n.matches || [], n.errors)
        : w.loaderData,
      l = w.blockers;
    l.size > 0 && ((l = new Map(l)), l.forEach((e, t) => l.set(t, _t)));
    let u = N ? !1 : ot(t, n.matches || w.matches),
      d =
        D === !0 ||
        (w.navigation.formMethod != null &&
          wn(w.navigation.formMethod) &&
          t.state?._isRedirect !== !0);
    ((c &&= ((s = c), void 0)),
      N ||
        T === `POP` ||
        (T === `PUSH`
          ? e.history.push(t, t.state)
          : T === `REPLACE` && e.history.replace(t, t.state)));
    let f;
    if (T === `POP`) {
      let e = k.get(w.location.pathname);
      e && e.has(t.pathname)
        ? (f = { currentLocation: w.location, nextLocation: t })
        : k.has(t.pathname) &&
          (f = { currentLocation: t, nextLocation: w.location });
    } else if (ee) {
      let e = k.get(w.location.pathname);
      (e
        ? e.add(t.pathname)
        : ((e = new Set([t.pathname])), k.set(w.location.pathname, e)),
        (f = { currentLocation: w.location, nextLocation: t }));
    }
    (xe(
      {
        ...n,
        actionData: a,
        loaderData: o,
        historyAction: T,
        location: t,
        initialized: !0,
        renderFallback: !1,
        navigation: ht,
        revalidation: `idle`,
        restoreScrollPosition: u,
        preventScrollReset: d,
        blockers: l,
      },
      { viewTransitionOpts: f, flushSync: r === !0 },
    ),
      (T = `POP`),
      (D = !1),
      (ee = !1),
      (N = !1),
      (te = !1),
      E?.resolve(),
      (E = null),
      _e?.resolve(),
      (_e = null));
  }
  async function Ce(t, n) {
    if ((E?.resolve(), (E = null), typeof t == `number`)) {
      E ||= Fn();
      let n = E.promise;
      return (e.history.go(t), n);
    }
    let {
        path: r,
        submission: i,
        error: a,
      } = wt(
        !1,
        Ct(w.location, w.matches, l, t, n?.fromRouteId, n?.relative),
        n,
      ),
      o;
    n?.unstable_mask &&
      (o = {
        pathname: ``,
        search: ``,
        hash: ``,
        ...(typeof n.unstable_mask == `string`
          ? ne(n.unstable_mask)
          : { ...w.location.unstable_mask, ...n.unstable_mask }),
      });
    let s = w.location,
      c = P(s, r, n && n.state, void 0, o);
    c = { ...c, ...e.history.encodeLocation(c) };
    let u = n && n.replace != null ? n.replace : void 0,
      d = `PUSH`;
    u === !0
      ? (d = `REPLACE`)
      : u === !1 ||
        (i != null &&
          wn(i.formMethod) &&
          i.formAction === w.location.pathname + w.location.search &&
          (d = `REPLACE`));
    let f =
        n && `preventScrollReset` in n ? n.preventScrollReset === !0 : void 0,
      p = (n && n.flushSync) === !0,
      m = tt({ currentLocation: s, nextLocation: c, historyAction: d });
    if (m) {
      Qe(m, {
        state: `blocked`,
        location: c,
        proceed() {
          (Qe(m, {
            state: `proceeding`,
            proceed: void 0,
            reset: void 0,
            location: c,
          }),
            Ce(t, n));
        },
        reset() {
          let e = new Map(w.blockers);
          (e.set(m, _t), xe({ blockers: e }));
        },
      });
      return;
    }
    await Te(d, c, {
      submission: i,
      pendingError: a,
      preventScrollReset: f,
      replace: n && n.replace,
      enableViewTransition: n && n.viewTransition,
      flushSync: p,
      callSiteDefaultShouldRevalidate: n && n.unstable_defaultShouldRevalidate,
    });
  }
  function we() {
    ((_e ||= Fn()), Re(), xe({ revalidation: `loading` }));
    let e = _e.promise;
    return w.navigation.state === `submitting`
      ? e
      : w.navigation.state === `idle`
        ? (Te(w.historyAction, w.location, {
            startUninterruptedRevalidation: !0,
          }),
          e)
        : (Te(T || w.historyAction, w.navigation.location, {
            overrideNavigation: w.navigation,
            enableViewTransition: ee === !0,
          }),
          e);
  }
  async function Te(t, n, r) {
    (O && O.abort(),
      (O = null),
      (T = t),
      (N = (r && r.startUninterruptedRevalidation) === !0),
      at(w.location, w.matches),
      (D = (r && r.preventScrollReset) === !0),
      (ee = (r && r.enableViewTransition) === !0));
    let i = c || s,
      a = r && r.overrideNavigation,
      o =
        r?.initialHydration && w.matches && w.matches.length > 0 && !y
          ? w.matches
          : fe(i, n, l),
      u = (r && r.flushSync) === !0;
    if (
      o &&
      w.initialized &&
      !te &&
      fn(w.location, n) &&
      !(r && r.submission && wn(r.submission.formMethod))
    ) {
      Se(n, { matches: o }, { flushSync: u });
      return;
    }
    let d = st(o, i, n.pathname);
    if ((d.active && d.matches && (o = d.matches), !o)) {
      let { error: e, notFoundMatches: t, route: r } = nt(n.pathname);
      Se(
        n,
        { matches: t, loaderData: {}, errors: { [r.id]: e } },
        { flushSync: u },
      );
      return;
    }
    O = new AbortController();
    let f = Qt(e.history, n, O.signal, r && r.submission),
      p = e.getContext ? await e.getContext() : new ae(),
      m;
    if (r && r.pendingError)
      m = [sn(o).route.id, { type: `error`, error: r.pendingError }];
    else if (r && r.submission && wn(r.submission.formMethod)) {
      let t = await Ee(
        f,
        n,
        r.submission,
        o,
        p,
        d.active,
        r && r.initialHydration === !0,
        { replace: r.replace, flushSync: u },
      );
      if (t.shortCircuited) return;
      if (t.pendingActionResult) {
        let [e, r] = t.pendingActionResult;
        if (_n(r) && Je(r.error) && r.error.status === 404) {
          ((O = null),
            Se(n, {
              matches: t.matches,
              loaderData: {},
              errors: { [e]: r.error },
            }));
          return;
        }
      }
      ((o = t.matches || o),
        (m = t.pendingActionResult),
        (a = On(n, r.submission)),
        (u = !1),
        (d.active = !1),
        (f = Qt(e.history, f.url, f.signal)));
    }
    let {
      shortCircuited: h,
      matches: g,
      loaderData: _,
      errors: v,
    } = await De(
      f,
      n,
      o,
      p,
      d.active,
      a,
      r && r.submission,
      r && r.fetcherSubmission,
      r && r.replace,
      r && r.initialHydration === !0,
      u,
      m,
      r && r.callSiteDefaultShouldRevalidate,
    );
    h ||
      ((O = null),
      Se(n, { matches: g || o, ...on(m), loaderData: _, errors: v }));
  }
  async function Ee(t, n, i, c, u, d, f, p = {}) {
    if (
      (Re(), xe({ navigation: kn(n, i) }, { flushSync: p.flushSync === !0 }), d)
    ) {
      let e = await ct(c, n.pathname, t.signal);
      if (e.type === `aborted`) return { shortCircuited: !0 };
      if (e.type === `error`) {
        if (e.partialMatches.length === 0) {
          let { matches: t, route: n } = cn(s);
          return {
            matches: t,
            pendingActionResult: [n.id, { type: `error`, error: e.error }],
          };
        }
        let t = sn(e.partialMatches).route.id;
        return {
          matches: e.partialMatches,
          pendingActionResult: [t, { type: `error`, error: e.error }],
        };
      } else if (e.matches) c = e.matches;
      else {
        let { notFoundMatches: e, error: t, route: r } = nt(n.pathname);
        return {
          matches: e,
          pendingActionResult: [r.id, { type: `error`, error: t }],
        };
      }
    }
    let m,
      h = En(c, n);
    if (!h.route.action && !h.route.lazy)
      m = {
        type: `error`,
        error: ln(405, {
          method: t.method,
          pathname: n.pathname,
          routeId: h.route.id,
        }),
      };
    else {
      let e = await Ie(t, n, Wt(a, o, t, n, c, h, f ? [] : r, u), u, null);
      if (((m = e[h.route.id]), !m)) {
        for (let t of c)
          if (e[t.route.id]) {
            m = e[t.route.id];
            break;
          }
      }
      if (t.signal.aborted) return { shortCircuited: !0 };
    }
    if (vn(m)) {
      let n;
      return (
        (n =
          p && p.replace != null
            ? p.replace
            : Zt(
                m.response.headers.get(`Location`),
                new URL(t.url),
                l,
                e.history,
              ) ===
              w.location.pathname + w.location.search),
        await Fe(t, m, !0, { submission: i, replace: n }),
        { shortCircuited: !0 }
      );
    }
    if (_n(m)) {
      let e = sn(c, h.route.id);
      return (
        (p && p.replace) !== !0 && (T = `PUSH`),
        { matches: c, pendingActionResult: [e.route.id, m, h.route.id] }
      );
    }
    return { matches: c, pendingActionResult: [h.route.id, m] };
  }
  async function De(t, n, i, u, d, f, p, m, h, g, _, v, y) {
    let b = f || On(n, p),
      x = p || m || Dn(b),
      S = !N && !g;
    if (d) {
      if (S) {
        let e = Oe(v);
        xe(
          { navigation: b, ...(e === void 0 ? {} : { actionData: e }) },
          { flushSync: _ },
        );
      }
      let e = await ct(i, n.pathname, t.signal);
      if (e.type === `aborted`) return { shortCircuited: !0 };
      if (e.type === `error`) {
        if (e.partialMatches.length === 0) {
          let { matches: t, route: n } = cn(s);
          return { matches: t, loaderData: {}, errors: { [n.id]: e.error } };
        }
        let t = sn(e.partialMatches).route.id;
        return {
          matches: e.partialMatches,
          loaderData: {},
          errors: { [t]: e.error },
        };
      } else if (e.matches) i = e.matches;
      else {
        let { error: e, notFoundMatches: t, route: r } = nt(n.pathname);
        return { matches: t, loaderData: {}, errors: { [r.id]: e } };
      }
    }
    let C = c || s,
      { dsMatches: T, revalidatingFetchers: E } = Tt(
        t,
        u,
        a,
        o,
        e.history,
        w,
        i,
        x,
        n,
        g ? [] : r,
        g === !0,
        te,
        F,
        de,
        ce,
        se,
        C,
        l,
        e.patchRoutesOnNavigation != null,
        v,
        y,
      );
    if (
      ((L = ++ie),
      !e.dataStrategy &&
        !T.some((e) => e.shouldLoad) &&
        !T.some((e) => e.route.middleware && e.route.middleware.length > 0) &&
        E.length === 0)
    ) {
      let e = qe();
      return (
        Se(
          n,
          {
            matches: i,
            loaderData: {},
            errors: v && _n(v[1]) ? { [v[0]]: v[1].error } : null,
            ...on(v),
            ...(e ? { fetchers: new Map(w.fetchers) } : {}),
          },
          { flushSync: _ },
        ),
        { shortCircuited: !0 }
      );
    }
    if (S) {
      let e = {};
      if (!d) {
        e.navigation = b;
        let t = Oe(v);
        t !== void 0 && (e.actionData = t);
      }
      (E.length > 0 && (e.fetchers = ke(E)), xe(e, { flushSync: _ }));
    }
    E.forEach((e) => {
      (Ge(e.key), e.controller && I.set(e.key, e.controller));
    });
    let D = () => E.forEach((e) => Ge(e.key));
    O && O.signal.addEventListener(`abort`, D);
    let { loaderResults: ee, fetcherResults: k } = await Le(T, E, t, n, u);
    if (t.signal.aborted) return { shortCircuited: !0 };
    (O && O.signal.removeEventListener(`abort`, D),
      E.forEach((e) => I.delete(e.key)));
    let A = un(ee);
    if (A)
      return (
        await Fe(t, A.result, !0, { replace: h }),
        { shortCircuited: !0 }
      );
    if (((A = un(k)), A))
      return (
        se.add(A.key),
        await Fe(t, A.result, !0, { replace: h }),
        { shortCircuited: !0 }
      );
    let { loaderData: j, errors: M } = rn(w, i, ee, v, E, k);
    g && w.errors && (M = { ...w.errors, ...M });
    let P = qe(),
      ne = Ye(L),
      re = P || ne || E.length > 0;
    return {
      matches: i,
      loaderData: j,
      errors: M,
      ...(re ? { fetchers: new Map(w.fetchers) } : {}),
    };
  }
  function Oe(e) {
    if (e && !_n(e[1])) return { [e[0]]: e[1].data };
    if (w.actionData)
      return Object.keys(w.actionData).length === 0 ? null : w.actionData;
  }
  function ke(e) {
    return (
      e.forEach((e) => {
        let t = w.fetchers.get(e.key),
          n = An(void 0, t ? t.data : void 0);
        w.fetchers.set(e.key, n);
      }),
      new Map(w.fetchers)
    );
  }
  async function Ae(t, n, r, i) {
    Ge(t);
    let a = (i && i.flushSync) === !0,
      o = c || s,
      u = Ct(w.location, w.matches, l, r, n, i?.relative),
      d = fe(o, u, l),
      f = st(d, o, u);
    if ((f.active && f.matches && (d = f.matches), !d)) {
      Be(t, n, ln(404, { pathname: u }), { flushSync: a });
      return;
    }
    let { path: p, submission: m, error: h } = wt(!0, u, i);
    if (h) {
      Be(t, n, h, { flushSync: a });
      return;
    }
    let g = e.getContext ? await e.getContext() : new ae(),
      _ = (i && i.preventScrollReset) === !0;
    if (m && wn(m.formMethod)) {
      await Me(
        t,
        n,
        p,
        d,
        g,
        f.active,
        a,
        _,
        m,
        i && i.unstable_defaultShouldRevalidate,
      );
      return;
    }
    (ce.set(t, { routeId: n, path: p }),
      await Ne(t, n, p, d, g, f.active, a, _, m));
  }
  async function Me(t, n, i, u, d, f, p, m, h, g) {
    (Re(), ce.delete(t), ze(t, jn(h, w.fetchers.get(t)), { flushSync: p }));
    let _ = new AbortController(),
      v = Qt(e.history, i, _.signal, h);
    if (f) {
      let e = await ct(u, new URL(v.url).pathname, v.signal, t);
      if (e.type === `aborted`) return;
      if (e.type === `error`) {
        Be(t, n, e.error, { flushSync: p });
        return;
      } else if (e.matches) u = e.matches;
      else {
        Be(t, n, ln(404, { pathname: i }), { flushSync: p });
        return;
      }
    }
    let y = En(u, i);
    if (!y.route.action && !y.route.lazy) {
      Be(t, n, ln(405, { method: h.formMethod, pathname: i, routeId: n }), {
        flushSync: p,
      });
      return;
    }
    I.set(t, _);
    let b = ie,
      x = Wt(a, o, v, i, u, y, r, d),
      S = await Ie(v, i, x, d, t),
      C = S[y.route.id];
    if (!C) {
      for (let e of x)
        if (S[e.route.id]) {
          C = S[e.route.id];
          break;
        }
    }
    if (v.signal.aborted) {
      I.get(t) === _ && I.delete(t);
      return;
    }
    if (de.has(t)) {
      if (vn(C) || _n(C)) {
        ze(t, Mn(void 0));
        return;
      }
    } else {
      if (vn(C))
        if ((I.delete(t), L > b)) {
          ze(t, Mn(void 0));
          return;
        } else
          return (
            se.add(t),
            ze(t, An(h)),
            Fe(v, C, !1, { fetcherSubmission: h, preventScrollReset: m })
          );
      if (_n(C)) {
        Be(t, n, C.error);
        return;
      }
    }
    let E = w.navigation.location || w.location,
      D = Qt(e.history, E, _.signal),
      ee = c || s,
      k =
        w.navigation.state === `idle`
          ? w.matches
          : fe(ee, w.navigation.location, l);
    j(k, `Didn't find any matches after fetcher action`);
    let A = ++ie;
    oe.set(t, A);
    let M = An(h, C.data);
    w.fetchers.set(t, M);
    let { dsMatches: N, revalidatingFetchers: P } = Tt(
      D,
      d,
      a,
      o,
      e.history,
      w,
      k,
      h,
      E,
      r,
      !1,
      te,
      F,
      de,
      ce,
      se,
      ee,
      l,
      e.patchRoutesOnNavigation != null,
      [y.route.id, C],
      g,
    );
    (P.filter((e) => e.key !== t).forEach((e) => {
      let t = e.key,
        n = w.fetchers.get(t),
        r = An(void 0, n ? n.data : void 0);
      (w.fetchers.set(t, r), Ge(t), e.controller && I.set(t, e.controller));
    }),
      xe({ fetchers: new Map(w.fetchers) }));
    let ne = () => P.forEach((e) => Ge(e.key));
    _.signal.addEventListener(`abort`, ne);
    let { loaderResults: re, fetcherResults: ae } = await Le(N, P, D, E, d);
    if (_.signal.aborted) return;
    if (
      (_.signal.removeEventListener(`abort`, ne),
      oe.delete(t),
      I.delete(t),
      P.forEach((e) => I.delete(e.key)),
      w.fetchers.has(t))
    ) {
      let e = Mn(C.data);
      w.fetchers.set(t, e);
    }
    let le = un(re);
    if (le) return Fe(D, le.result, !1, { preventScrollReset: m });
    if (((le = un(ae)), le))
      return (se.add(le.key), Fe(D, le.result, !1, { preventScrollReset: m }));
    let { loaderData: ue, errors: pe } = rn(w, k, re, void 0, P, ae);
    (Ye(A),
      w.navigation.state === `loading` && A > L
        ? (j(T, `Expected pending action`),
          O && O.abort(),
          Se(w.navigation.location, {
            matches: k,
            loaderData: ue,
            errors: pe,
            fetchers: new Map(w.fetchers),
          }))
        : (xe({
            errors: pe,
            loaderData: an(w.loaderData, ue, k, pe),
            fetchers: new Map(w.fetchers),
          }),
          (te = !1)));
  }
  async function Ne(t, n, i, s, c, l, u, d, f) {
    let p = w.fetchers.get(t);
    ze(t, An(f, p ? p.data : void 0), { flushSync: u });
    let m = new AbortController(),
      h = Qt(e.history, i, m.signal);
    if (l) {
      let e = await ct(s, new URL(h.url).pathname, h.signal, t);
      if (e.type === `aborted`) return;
      if (e.type === `error`) {
        Be(t, n, e.error, { flushSync: u });
        return;
      } else if (e.matches) s = e.matches;
      else {
        Be(t, n, ln(404, { pathname: i }), { flushSync: u });
        return;
      }
    }
    let g = En(s, i);
    I.set(t, m);
    let _ = ie,
      v = (await Ie(h, i, Wt(a, o, h, i, s, g, r, c), c, t))[g.route.id];
    if ((I.get(t) === m && I.delete(t), !h.signal.aborted)) {
      if (de.has(t)) {
        ze(t, Mn(void 0));
        return;
      }
      if (vn(v))
        if (L > _) {
          ze(t, Mn(void 0));
          return;
        } else {
          (se.add(t), await Fe(h, v, !1, { preventScrollReset: d }));
          return;
        }
      if (_n(v)) {
        Be(t, n, v.error);
        return;
      }
      ze(t, Mn(v.data));
    }
  }
  async function Fe(
    r,
    i,
    a,
    {
      submission: o,
      fetcherSubmission: s,
      preventScrollReset: c,
      replace: u,
    } = {},
  ) {
    (a || (E?.resolve(), (E = null)),
      i.response.headers.has(`X-Remix-Revalidate`) && (te = !0));
    let d = i.response.headers.get(`Location`);
    (j(d, `Expected a Location header on the redirect Response`),
      (d = Zt(d, new URL(r.url), l, e.history)));
    let f = P(w.location, d, { _isRedirect: !0 });
    if (n) {
      let e = !1;
      if (i.response.headers.has(`X-Remix-Reload-Document`)) e = !0;
      else if (Pe(d)) {
        let n = re(d, !0);
        e = n.origin !== t.location.origin || je(n.pathname, l) == null;
      }
      if (e) {
        u ? t.location.replace(d) : t.location.assign(d);
        return;
      }
    }
    O = null;
    let p =
        u === !0 || i.response.headers.has(`X-Remix-Replace`)
          ? `REPLACE`
          : `PUSH`,
      { formMethod: m, formAction: h, formEncType: g } = w.navigation;
    !o && !s && m && h && g && (o = Dn(w.navigation));
    let _ = o || s;
    mt.has(i.response.status) && _ && wn(_.formMethod)
      ? await Te(p, f, {
          submission: { ..._, formAction: d },
          preventScrollReset: c || D,
          enableViewTransition: a ? ee : void 0,
        })
      : await Te(p, f, {
          overrideNavigation: On(f, o),
          fetcherSubmission: s,
          preventScrollReset: c || D,
          enableViewTransition: a ? ee : void 0,
        });
  }
  async function Ie(e, t, n, r, i) {
    let a,
      o = {};
    try {
      a = await Gt(u, e, t, n, i, r, !1);
    } catch (e) {
      return (
        n
          .filter((e) => e.shouldLoad)
          .forEach((t) => {
            o[t.route.id] = { type: `error`, error: e };
          }),
        o
      );
    }
    if (e.signal.aborted) return o;
    if (!wn(e.method))
      for (let e of n) {
        if (a[e.route.id]?.type === `error`) break;
        !a.hasOwnProperty(e.route.id) &&
          !w.loaderData.hasOwnProperty(e.route.id) &&
          (!w.errors || !w.errors.hasOwnProperty(e.route.id)) &&
          e.shouldCallHandler() &&
          (a[e.route.id] = {
            type: `error`,
            result: Error(
              `No result returned from dataStrategy for route ${e.route.id}`,
            ),
          });
      }
    for (let [t, r] of Object.entries(a))
      if (gn(r)) {
        let i = r.result;
        o[t] = { type: `redirect`, response: Yt(i, e, t, n, l) };
      } else o[t] = await Jt(r);
    return o;
  }
  async function Le(e, t, n, r, i) {
    let a = Ie(n, r, e, i, null),
      o = Promise.all(
        t.map(async (e) => {
          if (e.matches && e.match && e.request && e.controller) {
            let t = (await Ie(e.request, e.path, e.matches, i, e.key))[
              e.match.route.id
            ];
            return { [e.key]: t };
          } else
            return Promise.resolve({
              [e.key]: { type: `error`, error: ln(404, { pathname: e.path }) },
            });
        }),
      );
    return {
      loaderResults: await a,
      fetcherResults: (await o).reduce((e, t) => Object.assign(e, t), {}),
    };
  }
  function Re() {
    ((te = !0),
      ce.forEach((e, t) => {
        (I.has(t) && F.add(t), Ge(t));
      }));
  }
  function ze(e, t, n = {}) {
    (w.fetchers.set(e, t),
      xe(
        { fetchers: new Map(w.fetchers) },
        { flushSync: (n && n.flushSync) === !0 },
      ));
  }
  function Be(e, t, n, r = {}) {
    let i = sn(w.matches, t);
    (Ue(e),
      xe(
        { errors: { [i.route.id]: n }, fetchers: new Map(w.fetchers) },
        { flushSync: (r && r.flushSync) === !0 },
      ));
  }
  function Ve(e) {
    return (
      le.set(e, (le.get(e) || 0) + 1),
      de.has(e) && de.delete(e),
      w.fetchers.get(e) || gt
    );
  }
  function He(e, t) {
    (Ge(e, t?.reason), ze(e, Mn(null)));
  }
  function Ue(e) {
    let t = w.fetchers.get(e);
    (I.has(e) && !(t && t.state === `loading` && oe.has(e)) && Ge(e),
      ce.delete(e),
      oe.delete(e),
      se.delete(e),
      de.delete(e),
      F.delete(e),
      w.fetchers.delete(e));
  }
  function We(e) {
    let t = (le.get(e) || 0) - 1;
    (t <= 0 ? (le.delete(e), de.add(e)) : le.set(e, t),
      xe({ fetchers: new Map(w.fetchers) }));
  }
  function Ge(e, t) {
    let n = I.get(e);
    n && (n.abort(t), I.delete(e));
  }
  function Ke(e) {
    for (let t of e) {
      let e = Mn(Ve(t).data);
      w.fetchers.set(t, e);
    }
  }
  function qe() {
    let e = [],
      t = !1;
    for (let n of se) {
      let r = w.fetchers.get(n);
      (j(r, `Expected fetcher: ${n}`),
        r.state === `loading` && (se.delete(n), e.push(n), (t = !0)));
    }
    return (Ke(e), t);
  }
  function Ye(e) {
    let t = [];
    for (let [n, r] of oe)
      if (r < e) {
        let e = w.fetchers.get(n);
        (j(e, `Expected fetcher: ${n}`),
          e.state === `loading` && (Ge(n), oe.delete(n), t.push(n)));
      }
    return (Ke(t), t.length > 0);
  }
  function Xe(e, t) {
    let n = w.blockers.get(e) || _t;
    return (he.get(e) !== t && he.set(e, t), n);
  }
  function Ze(e) {
    (w.blockers.delete(e), he.delete(e));
  }
  function Qe(e, t) {
    let n = w.blockers.get(e) || _t;
    j(
      (n.state === `unblocked` && t.state === `blocked`) ||
        (n.state === `blocked` && t.state === `blocked`) ||
        (n.state === `blocked` && t.state === `proceeding`) ||
        (n.state === `blocked` && t.state === `unblocked`) ||
        (n.state === `proceeding` && t.state === `unblocked`),
      `Invalid blocker state transition: ${n.state} -> ${t.state}`,
    );
    let r = new Map(w.blockers);
    (r.set(e, t), xe({ blockers: r }));
  }
  function tt({ currentLocation: e, nextLocation: t, historyAction: n }) {
    if (he.size === 0) return;
    he.size > 1 && M(!1, `A router only supports one blocker at a time`);
    let r = Array.from(he.entries()),
      [i, a] = r[r.length - 1],
      o = w.blockers.get(i);
    if (
      !(o && o.state === `proceeding`) &&
      a({ currentLocation: e, nextLocation: t, historyAction: n })
    )
      return i;
  }
  function nt(e) {
    let t = ln(404, { pathname: e }),
      { matches: n, route: r } = cn(c || s);
    return { notFoundMatches: n, route: r, error: t };
  }
  function rt(e, t, n) {
    if (((m = e), (g = t), (h = n || null), !_ && w.navigation === ht)) {
      _ = !0;
      let e = ot(w.location, w.matches);
      e != null && xe({ restoreScrollPosition: e });
    }
    return () => {
      ((m = null), (g = null), (h = null));
    };
  }
  function it(e, t) {
    return (
      (h &&
        h(
          e,
          t.map((e) => me(e, w.loaderData)),
        )) ||
      e.key
    );
  }
  function at(e, t) {
    if (m && g) {
      let n = it(e, t);
      m[n] = g();
    }
  }
  function ot(e, t) {
    if (m) {
      let n = it(e, t),
        r = m[n];
      if (typeof r == `number`) return r;
    }
    return null;
  }
  function st(t, n, r) {
    if (e.patchRoutesOnNavigation) {
      if (!t) return { active: !0, matches: pe(n, r, l, !0) || [] };
      if (Object.keys(t[0].params).length > 0)
        return { active: !0, matches: pe(n, r, l, !0) };
    }
    return { active: !1, matches: null };
  }
  async function ct(t, n, r, i) {
    if (!e.patchRoutesOnNavigation) return { type: `success`, matches: t };
    let u = t;
    for (;;) {
      let t = c == null,
        d = c || s,
        f = o;
      try {
        await e.patchRoutesOnNavigation({
          signal: r,
          path: n,
          matches: u,
          fetcherKey: i,
          patch: (e, t) => {
            r.aborted || jt(e, t, d, f, a, !1);
          },
        });
      } catch (e) {
        return { type: `error`, error: e, partialMatches: u };
      } finally {
        t && !r.aborted && (s = [...s]);
      }
      if (r.aborted) return { type: `aborted` };
      let p = fe(d, n, l),
        m = null;
      if (
        p &&
        (Object.keys(p[0].params).length === 0 ||
          ((m = pe(d, n, l, !0)),
          !(m && u.length < m.length && lt(u, m.slice(0, u.length)))))
      )
        return { type: `success`, matches: p };
      if (((m ||= pe(d, n, l, !0)), !m || lt(u, m)))
        return { type: `success`, matches: null };
      u = m;
    }
  }
  function lt(e, t) {
    return (
      e.length === t.length && e.every((e, n) => e.route.id === t[n].route.id)
    );
  }
  function ut(e) {
    ((o = {}), (c = ue(e, a, void 0, o)));
  }
  function dt(e, t, n = !1) {
    let r = c == null;
    (jt(e, t, c || s, o, a, n), r && ((s = [...s]), xe({})));
  }
  return (
    (C = {
      get basename() {
        return l;
      },
      get future() {
        return d;
      },
      get state() {
        return w;
      },
      get routes() {
        return s;
      },
      get window() {
        return t;
      },
      initialize: ve,
      subscribe: be,
      enableScrollRestoration: rt,
      navigate: Ce,
      fetch: Ae,
      revalidate: we,
      createHref: (t) => e.history.createHref(t),
      encodeLocation: (t) => e.history.encodeLocation(t),
      getFetcher: Ve,
      resetFetcher: He,
      deleteFetcher: We,
      dispose: ye,
      getBlocker: Xe,
      deleteBlocker: Ze,
      patchRoutes: dt,
      _internalFetchControllers: I,
      _internalSetRoutes: ut,
      _internalSetStateDoNotUseOrYouWillBreakYourApp(e) {
        xe(e);
      },
    }),
    e.unstable_instrumentations &&
      (C = et(
        C,
        e.unstable_instrumentations.map((e) => e.router).filter(Boolean),
      )),
    C
  );
}
function St(e) {
  return (
    e != null &&
    ((`formData` in e && e.formData != null) ||
      (`body` in e && e.body !== void 0))
  );
}
function Ct(e, t, n, r, i, a) {
  let o, s;
  if (i) {
    o = [];
    for (let e of t)
      if ((o.push(e), e.route.id === i)) {
        s = e;
        break;
      }
  } else ((o = t), (s = t[t.length - 1]));
  let c = Be(r || `.`, ze(o), je(e.pathname, n) || e.pathname, a === `path`);
  if (
    (r ?? ((c.search = e.search), (c.hash = e.hash)),
    (r == null || r === `` || r === `.`) && s)
  ) {
    let e = Tn(c.search);
    if (s.route.index && !e)
      c.search = c.search ? c.search.replace(/^\?/, `?index&`) : `?index`;
    else if (!s.route.index && e) {
      let e = new URLSearchParams(c.search),
        t = e.getAll(`index`);
      (e.delete(`index`),
        t.filter((e) => e).forEach((t) => e.append(`index`, t)));
      let n = e.toString();
      c.search = n ? `?${n}` : ``;
    }
  }
  return (
    n !== `/` && (c.pathname = Me({ basename: n, pathname: c.pathname })),
    F(c)
  );
}
function wt(e, t, n) {
  if (!n || !St(n)) return { path: t };
  if (n.formMethod && !Cn(n.formMethod))
    return { path: t, error: ln(405, { method: n.formMethod }) };
  let r = () => ({ path: t, error: ln(400, { type: `invalid-body` }) }),
    i = (n.formMethod || `get`).toUpperCase(),
    a = dn(t);
  if (n.body !== void 0) {
    if (n.formEncType === `text/plain`) {
      if (!wn(i)) return r();
      let e =
        typeof n.body == `string`
          ? n.body
          : n.body instanceof FormData || n.body instanceof URLSearchParams
            ? Array.from(n.body.entries()).reduce(
                (e, [t, n]) => `${e}${t}=${n}
`,
                ``,
              )
            : String(n.body);
      return {
        path: t,
        submission: {
          formMethod: i,
          formAction: a,
          formEncType: n.formEncType,
          formData: void 0,
          json: void 0,
          text: e,
        },
      };
    } else if (n.formEncType === `application/json`) {
      if (!wn(i)) return r();
      try {
        let e = typeof n.body == `string` ? JSON.parse(n.body) : n.body;
        return {
          path: t,
          submission: {
            formMethod: i,
            formAction: a,
            formEncType: n.formEncType,
            formData: void 0,
            json: e,
            text: void 0,
          },
        };
      } catch {
        return r();
      }
    }
  }
  j(
    typeof FormData == `function`,
    `FormData is not available in this environment`,
  );
  let o, s;
  if (n.formData) ((o = en(n.formData)), (s = n.formData));
  else if (n.body instanceof FormData) ((o = en(n.body)), (s = n.body));
  else if (n.body instanceof URLSearchParams) ((o = n.body), (s = tn(o)));
  else if (n.body == null) ((o = new URLSearchParams()), (s = new FormData()));
  else
    try {
      ((o = new URLSearchParams(n.body)), (s = tn(o)));
    } catch {
      return r();
    }
  let c = {
    formMethod: i,
    formAction: a,
    formEncType: (n && n.formEncType) || `application/x-www-form-urlencoded`,
    formData: s,
    json: void 0,
    text: void 0,
  };
  if (wn(c.formMethod)) return { path: t, submission: c };
  let l = ne(t);
  return (
    e && l.search && Tn(l.search) && o.append(`index`, ``),
    (l.search = `?${o}`),
    { path: F(l), submission: c }
  );
}
function Tt(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b) {
  let x = y ? (_n(y[1]) ? y[1].error : y[1].data) : void 0,
    S = i.createURL(a.location),
    C = i.createURL(c),
    w;
  if (u && a.errors) {
    let e = Object.keys(a.errors)[0];
    w = o.findIndex((t) => t.route.id === e);
  } else if (y && _n(y[1])) {
    let e = y[0];
    w = o.findIndex((t) => t.route.id === e) - 1;
  }
  let T = y ? y[1].statusCode : void 0,
    E = T && T >= 400,
    D = {
      currentUrl: S,
      currentParams: a.matches[0]?.params || {},
      nextUrl: C,
      nextParams: o[0].params,
      ...s,
      actionResult: x,
      actionStatus: T,
    },
    O = Ye(o),
    ee = o.map((i, o) => {
      let { route: s } = i,
        f = null;
      if (w != null && o > w) f = !1;
      else if (s.lazy) f = !0;
      else if (!Et(s)) f = !1;
      else if (u) {
        let { shouldLoad: e } = Dt(s, a.loaderData, a.errors);
        f = e;
      } else Ot(a.loaderData, a.matches[o], i) && (f = !0);
      if (f !== null) return Ut(n, r, e, c, O, i, l, t, f);
      let p = !1;
      typeof b == `boolean`
        ? (p = b)
        : E
          ? (p = !1)
          : d || S.pathname + S.search === C.pathname + C.search
            ? (p = !0)
            : S.search === C.search
              ? kt(a.matches[o], i) && (p = !0)
              : (p = !0);
      let m = { ...D, defaultShouldRevalidate: p };
      return Ut(n, r, e, c, O, i, l, t, At(i, m), m, b);
    }),
    k = [];
  return (
    m.forEach((e, s) => {
      if (u || !o.some((t) => t.route.id === e.routeId) || p.has(s)) return;
      let c = a.fetchers.get(s),
        m = c && c.state !== `idle` && c.data === void 0,
        y = fe(g, e.path, _);
      if (!y) {
        if (v && m) return;
        k.push({
          key: s,
          routeId: e.routeId,
          path: e.path,
          matches: null,
          match: null,
          request: null,
          controller: null,
        });
        return;
      }
      if (h.has(s)) return;
      let x = En(y, e.path),
        S = new AbortController(),
        C = Qt(i, e.path, S.signal),
        w = null;
      if (f.has(s)) (f.delete(s), (w = Wt(n, r, C, e.path, y, x, l, t)));
      else if (m) d && (w = Wt(n, r, C, e.path, y, x, l, t));
      else {
        let i;
        i = typeof b == `boolean` ? b : E ? !1 : d;
        let a = { ...D, defaultShouldRevalidate: i };
        At(x, a) && (w = Wt(n, r, C, e.path, y, x, l, t, a));
      }
      w &&
        k.push({
          key: s,
          routeId: e.routeId,
          path: e.path,
          matches: w,
          match: x,
          request: C,
          controller: S,
        });
    }),
    { dsMatches: ee, revalidatingFetchers: k }
  );
}
function Et(e) {
  return e.loader != null || (e.middleware != null && e.middleware.length > 0);
}
function Dt(e, t, n) {
  if (e.lazy) return { shouldLoad: !0, renderFallback: !0 };
  if (!Et(e)) return { shouldLoad: !1, renderFallback: !1 };
  let r = t != null && e.id in t,
    i = n != null && n[e.id] !== void 0;
  if (!r && i) return { shouldLoad: !1, renderFallback: !1 };
  if (typeof e.loader == `function` && e.loader.hydrate === !0)
    return { shouldLoad: !0, renderFallback: !r };
  let a = !r && !i;
  return { shouldLoad: a, renderFallback: a };
}
function Ot(e, t, n) {
  let r = !t || n.route.id !== t.route.id,
    i = !e.hasOwnProperty(n.route.id);
  return r || i;
}
function kt(e, t) {
  let n = e.route.path;
  return (
    e.pathname !== t.pathname ||
    (n != null && n.endsWith(`*`) && e.params[`*`] !== t.params[`*`])
  );
}
function At(e, t) {
  if (e.route.shouldRevalidate) {
    let n = e.route.shouldRevalidate(t);
    if (typeof n == `boolean`) return n;
  }
  return t.defaultShouldRevalidate;
}
function jt(e, t, n, r, i, a) {
  let o;
  if (e) {
    let t = r[e];
    (j(t, `No route found to patch children into: routeId = ${e}`),
      (t.children ||= []),
      (o = t.children));
  } else o = n;
  let s = [],
    c = [];
  if (
    (t.forEach((e) => {
      let t = o.find((t) => Mt(e, t));
      t ? c.push({ existingRoute: t, newRoute: e }) : s.push(e);
    }),
    s.length > 0)
  ) {
    let t = ue(s, i, [e || `_`, `patch`, String(o?.length || `0`)], r);
    o.push(...t);
  }
  if (a && c.length > 0)
    for (let e = 0; e < c.length; e++) {
      let { existingRoute: t, newRoute: n } = c[e],
        r = t,
        [a] = ue([n], i, [], {}, !0);
      Object.assign(r, {
        element: a.element ? a.element : r.element,
        errorElement: a.errorElement ? a.errorElement : r.errorElement,
        hydrateFallbackElement: a.hydrateFallbackElement
          ? a.hydrateFallbackElement
          : r.hydrateFallbackElement,
      });
    }
}
function Mt(e, t) {
  return `id` in e && `id` in t && e.id === t.id
    ? !0
    : e.index === t.index &&
        e.path === t.path &&
        e.caseSensitive === t.caseSensitive
      ? (!e.children || e.children.length === 0) &&
        (!t.children || t.children.length === 0)
        ? !0
        : (e.children?.every((e, n) => t.children?.some((t) => Mt(e, t))) ?? !1)
      : !1;
}
var Nt = new WeakMap(),
  Pt = ({ key: e, route: t, manifest: n, mapRouteProperties: r }) => {
    let i = n[t.id];
    if (
      (j(i, `No route found in manifest`), !i.lazy || typeof i.lazy != `object`)
    )
      return;
    let a = i.lazy[e];
    if (!a) return;
    let o = Nt.get(i);
    o || ((o = {}), Nt.set(i, o));
    let s = o[e];
    if (s) return s;
    let c = (async () => {
      let t = oe(e),
        n = i[e] !== void 0 && e !== `hasErrorBoundary`;
      if (t)
        (M(
          !t,
          `Route property ` +
            e +
            ` is not a supported lazy route property. This property will be ignored.`,
        ),
          (o[e] = Promise.resolve()));
      else if (n)
        M(
          !1,
          `Route "${i.id}" has a static property "${e}" defined. The lazy property will be ignored.`,
        );
      else {
        let t = await a();
        t != null && (Object.assign(i, { [e]: t }), Object.assign(i, r(i)));
      }
      typeof i.lazy == `object` &&
        ((i.lazy[e] = void 0),
        Object.values(i.lazy).every((e) => e === void 0) && (i.lazy = void 0));
    })();
    return ((o[e] = c), c);
  },
  Ft = new WeakMap();
function It(e, t, n, r, i) {
  let a = n[e.id];
  if ((j(a, `No route found in manifest`), !e.lazy))
    return { lazyRoutePromise: void 0, lazyHandlerPromise: void 0 };
  if (typeof e.lazy == `function`) {
    let t = Ft.get(a);
    if (t) return { lazyRoutePromise: t, lazyHandlerPromise: t };
    let n = (async () => {
      j(typeof e.lazy == `function`, `No lazy route function found`);
      let t = await e.lazy(),
        n = {};
      for (let e in t) {
        let r = t[e];
        if (r === void 0) continue;
        let i = ce(e),
          o = a[e] !== void 0 && e !== `hasErrorBoundary`;
        i
          ? M(
              !i,
              `Route property ` +
                e +
                ` is not a supported property to be returned from a lazy route function. This property will be ignored.`,
            )
          : o
            ? M(
                !o,
                `Route "${a.id}" has a static property "${e}" defined but its lazy function is also returning a value for this property. The lazy route property "${e}" will be ignored.`,
              )
            : (n[e] = r);
      }
      (Object.assign(a, n), Object.assign(a, { ...r(a), lazy: void 0 }));
    })();
    return (
      Ft.set(a, n),
      n.catch(() => {}),
      { lazyRoutePromise: n, lazyHandlerPromise: n }
    );
  }
  let o = Object.keys(e.lazy),
    s = [],
    c;
  for (let a of o) {
    if (i && i.includes(a)) continue;
    let o = Pt({ key: a, route: e, manifest: n, mapRouteProperties: r });
    o && (s.push(o), a === t && (c = o));
  }
  let l = s.length > 0 ? Promise.all(s).then(() => {}) : void 0;
  return (
    l?.catch(() => {}),
    c?.catch(() => {}),
    { lazyRoutePromise: l, lazyHandlerPromise: c }
  );
}
async function Lt(e) {
  let t = e.matches.filter((e) => e.shouldLoad),
    n = {};
  return (
    (await Promise.all(t.map((e) => e.resolve()))).forEach((e, r) => {
      n[t[r].route.id] = e;
    }),
    n
  );
}
async function Rt(e) {
  return e.matches.some((e) => e.route.middleware) ? zt(e, () => Lt(e)) : Lt(e);
}
function zt(e, t) {
  return Bt(
    e,
    t,
    (e) => {
      if (Sn(e)) throw e;
      return e;
    },
    mn,
    n,
  );
  function n(t, n, r) {
    if (r)
      return Promise.resolve(
        Object.assign(r.value, { [n]: { type: `error`, result: t } }),
      );
    {
      let { matches: r } = e,
        i = sn(
          r,
          r[
            Math.min(
              Math.max(
                r.findIndex((e) => e.route.id === n),
                0,
              ),
              Math.max(
                r.findIndex((e) => e.shouldCallHandler()),
                0,
              ),
            )
          ].route.id,
        ).route.id;
      return Promise.resolve({ [i]: { type: `error`, result: t } });
    }
  }
}
async function Bt(e, t, n, r, i) {
  let { matches: a, ...o } = e;
  return await Vt(
    o,
    a.flatMap((e) =>
      e.route.middleware ? e.route.middleware.map((t) => [e.route.id, t]) : [],
    ),
    t,
    n,
    r,
    i,
  );
}
async function Vt(e, t, n, r, i, a, o = 0) {
  let { request: s } = e;
  if (s.signal.aborted)
    throw s.signal.reason ?? Error(`Request aborted: ${s.method} ${s.url}`);
  let c = t[o];
  if (!c) return await n();
  let [l, u] = c,
    d,
    f = async () => {
      if (d) throw Error("You may only call `next()` once per middleware");
      try {
        return ((d = { value: await Vt(e, t, n, r, i, a, o + 1) }), d.value);
      } catch (e) {
        return ((d = { value: await a(e, l, d) }), d.value);
      }
    };
  try {
    let t = await u(e, f),
      n = t == null ? void 0 : r(t);
    return i(n)
      ? n
      : d
        ? (n ?? d.value)
        : ((d = { value: await f() }), d.value);
  } catch (e) {
    return await a(e, l, d);
  }
}
function Ht(e, t, n, r, i) {
  let a = Pt({
      key: `middleware`,
      route: r.route,
      manifest: t,
      mapRouteProperties: e,
    }),
    o = It(r.route, wn(n.method) ? `action` : `loader`, t, e, i);
  return {
    middleware: a,
    route: o.lazyRoutePromise,
    handler: o.lazyHandlerPromise,
  };
}
function Ut(e, t, n, r, i, a, o, s, c, l = null, u) {
  let d = !1,
    f = Ht(e, t, n, a, o);
  return {
    ...a,
    _lazyPromises: f,
    shouldLoad: c,
    shouldRevalidateArgs: l,
    shouldCallHandler(e) {
      return (
        (d = !0),
        l
          ? typeof u == `boolean`
            ? At(a, { ...l, defaultShouldRevalidate: u })
            : typeof e == `boolean`
              ? At(a, { ...l, defaultShouldRevalidate: e })
              : At(a, l)
          : c
      );
    },
    resolve(e) {
      let { lazy: t, loader: o, middleware: l } = a.route,
        u = d || c || (e && !wn(n.method) && (t || o)),
        p = l && l.length > 0 && !o && !t;
      return u && (wn(n.method) || !p)
        ? Kt({
            request: n,
            path: r,
            unstable_pattern: i,
            match: a,
            lazyHandlerPromise: f?.handler,
            lazyRoutePromise: f?.route,
            handlerOverride: e,
            scopedContext: s,
          })
        : Promise.resolve({ type: `data`, result: void 0 });
    },
  };
}
function Wt(e, t, n, r, i, a, o, s, c = null) {
  return i.map((l) =>
    l.route.id === a.route.id
      ? Ut(e, t, n, r, Ye(i), l, o, s, !0, c)
      : {
          ...l,
          shouldLoad: !1,
          shouldRevalidateArgs: c,
          shouldCallHandler: () => !1,
          _lazyPromises: Ht(e, t, n, l, o),
          resolve: () => Promise.resolve({ type: `data`, result: void 0 }),
        },
  );
}
async function Gt(e, t, n, r, i, a, o) {
  r.some((e) => e._lazyPromises?.middleware) &&
    (await Promise.all(r.map((e) => e._lazyPromises?.middleware)));
  let s = {
      request: t,
      unstable_url: $t(t, n),
      unstable_pattern: Ye(r),
      params: r[0].params,
      context: a,
      matches: r,
    },
    c = o
      ? () => {
          throw Error(
            "You cannot call `runClientMiddleware()` from a static handler `dataStrategy`. Middleware is run outside of `dataStrategy` during SSR in order to bubble up the Response.  You can enable middleware via the `respond` API in `query`/`queryRoute`",
          );
        }
      : (e) => {
          let t = s;
          return zt(t, () =>
            e({
              ...t,
              fetcherKey: i,
              runClientMiddleware: () => {
                throw Error(
                  "Cannot call `runClientMiddleware()` from within an `runClientMiddleware` handler",
                );
              },
            }),
          );
        },
    l = await e({ ...s, fetcherKey: i, runClientMiddleware: c });
  try {
    await Promise.all(
      r.flatMap((e) => [e._lazyPromises?.handler, e._lazyPromises?.route]),
    );
  } catch {}
  return l;
}
async function Kt({
  request: e,
  path: t,
  unstable_pattern: n,
  match: r,
  lazyHandlerPromise: i,
  lazyRoutePromise: a,
  handlerOverride: o,
  scopedContext: s,
}) {
  let c,
    l,
    u = wn(e.method),
    d = u ? `action` : `loader`,
    f = (i) => {
      let a,
        c = new Promise((e, t) => (a = t));
      ((l = () => a()), e.signal.addEventListener(`abort`, l));
      let u = (a) =>
          typeof i == `function`
            ? i(
                {
                  request: e,
                  unstable_url: $t(e, t),
                  unstable_pattern: n,
                  params: r.params,
                  context: s,
                },
                ...(a === void 0 ? [] : [a]),
              )
            : Promise.reject(
                Error(
                  `You cannot call the handler for a route which defines a boolean "${d}" [routeId: ${r.route.id}]`,
                ),
              ),
        f = (async () => {
          try {
            return { type: `data`, result: await (o ? o((e) => u(e)) : u()) };
          } catch (e) {
            return { type: `error`, result: e };
          }
        })();
      return Promise.race([f, c]);
    };
  try {
    let t = u ? r.route.action : r.route.loader;
    if (i || a)
      if (t) {
        let e,
          [n] = await Promise.all([
            f(t).catch((t) => {
              e = t;
            }),
            i,
            a,
          ]);
        if (e !== void 0) throw e;
        c = n;
      } else {
        await i;
        let t = u ? r.route.action : r.route.loader;
        if (t) [c] = await Promise.all([f(t), a]);
        else if (d === `action`) {
          let t = new URL(e.url),
            n = t.pathname + t.search;
          throw ln(405, { method: e.method, pathname: n, routeId: r.route.id });
        } else return { type: `data`, result: void 0 };
      }
    else if (t) c = await f(t);
    else {
      let t = new URL(e.url);
      throw ln(404, { pathname: t.pathname + t.search });
    }
  } catch (e) {
    return { type: `error`, result: e };
  } finally {
    l && e.signal.removeEventListener(`abort`, l);
  }
  return c;
}
async function qt(e) {
  let t = e.headers.get(`Content-Type`);
  return t && /\bapplication\/json\b/.test(t)
    ? e.body == null
      ? null
      : e.json()
    : e.text();
}
async function Jt(e) {
  let { result: t, type: n } = e;
  if (bn(t)) {
    let e;
    try {
      e = await qt(t);
    } catch (e) {
      return { type: `error`, error: e };
    }
    return n === `error`
      ? {
          type: `error`,
          error: new qe(t.status, t.statusText, e),
          statusCode: t.status,
          headers: t.headers,
        }
      : { type: `data`, data: e, statusCode: t.status, headers: t.headers };
  }
  return n === `error`
    ? yn(t)
      ? t.data instanceof Error
        ? {
            type: `error`,
            error: t.data,
            statusCode: t.init?.status,
            headers: t.init?.headers ? new Headers(t.init.headers) : void 0,
          }
        : {
            type: `error`,
            error: pn(t),
            statusCode: Je(t) ? t.status : void 0,
            headers: t.init?.headers ? new Headers(t.init.headers) : void 0,
          }
      : { type: `error`, error: t, statusCode: Je(t) ? t.status : void 0 }
    : yn(t)
      ? {
          type: `data`,
          data: t.data,
          statusCode: t.init?.status,
          headers: t.init?.headers ? new Headers(t.init.headers) : void 0,
        }
      : { type: `data`, data: t };
}
function Yt(e, t, n, r, i) {
  let a = e.headers.get(`Location`);
  if (
    (j(
      a,
      `Redirects returned/thrown from loaders/actions must have a Location header`,
    ),
    !Pe(a))
  ) {
    let o = r.slice(0, r.findIndex((e) => e.route.id === n) + 1);
    ((a = Ct(new URL(t.url), o, i, a)), e.headers.set(`Location`, a));
  }
  return e;
}
var Xt = [
  `about:`,
  `blob:`,
  `chrome:`,
  `chrome-untrusted:`,
  `content:`,
  `data:`,
  `devtools:`,
  `file:`,
  `filesystem:`,
  `javascript:`,
];
function Zt(e, t, n, r) {
  if (Pe(e)) {
    let r = e,
      i = r.startsWith(`//`) ? new URL(t.protocol + r) : new URL(r);
    if (Xt.includes(i.protocol)) throw Error(`Invalid redirect location`);
    let a = je(i.pathname, n) != null;
    if (i.origin === t.origin && a) return Ve(i.pathname) + i.search + i.hash;
  }
  try {
    let t = r.createURL(e);
    if (Xt.includes(t.protocol)) throw Error(`Invalid redirect location`);
  } catch {}
  return e;
}
function Qt(e, t, n, r) {
  let i = e.createURL(dn(t)).toString(),
    a = { signal: n };
  if (r && wn(r.formMethod)) {
    let { formMethod: e, formEncType: t } = r;
    ((a.method = e.toUpperCase()),
      t === `application/json`
        ? ((a.headers = new Headers({ "Content-Type": t })),
          (a.body = JSON.stringify(r.json)))
        : t === `text/plain`
          ? (a.body = r.text)
          : t === `application/x-www-form-urlencoded` && r.formData
            ? (a.body = en(r.formData))
            : (a.body = r.formData));
  }
  return new Request(i, a);
}
function $t(e, t) {
  let n = new URL(e.url),
    r = typeof t == `string` ? ne(t) : t;
  if (((n.pathname = r.pathname || `/`), r.search)) {
    let e = new URLSearchParams(r.search),
      t = e.getAll(`index`);
    e.delete(`index`);
    for (let n of t.filter(Boolean)) e.append(`index`, n);
    n.search = e.size ? `?${e.toString()}` : ``;
  } else n.search = ``;
  return ((n.hash = r.hash || ``), n);
}
function en(e) {
  let t = new URLSearchParams();
  for (let [n, r] of e.entries())
    t.append(n, typeof r == `string` ? r : r.name);
  return t;
}
function tn(e) {
  let t = new FormData();
  for (let [n, r] of e.entries()) t.append(n, r);
  return t;
}
function nn(e, t, n, r = !1, i = !1) {
  let a = {},
    o = null,
    s,
    c = !1,
    l = {},
    u = n && _n(n[1]) ? n[1].error : void 0;
  return (
    e.forEach((n) => {
      if (!(n.route.id in t)) return;
      let d = n.route.id,
        f = t[d];
      if (
        (j(!vn(f), `Cannot handle redirect results in processLoaderData`),
        _n(f))
      ) {
        let t = f.error;
        if ((u !== void 0 && ((t = u), (u = void 0)), (o ||= {}), i)) o[d] = t;
        else {
          let n = sn(e, d);
          o[n.route.id] ?? (o[n.route.id] = t);
        }
        (r || (a[d] = bt),
          c || ((c = !0), (s = Je(f.error) ? f.error.status : 500)),
          f.headers && (l[d] = f.headers));
      } else
        ((a[d] = f.data),
          f.statusCode && f.statusCode !== 200 && !c && (s = f.statusCode),
          f.headers && (l[d] = f.headers));
    }),
    u !== void 0 && n && ((o = { [n[0]]: u }), n[2] && (a[n[2]] = void 0)),
    { loaderData: a, errors: o, statusCode: s || 200, loaderHeaders: l }
  );
}
function rn(e, t, n, r, i, a) {
  let { loaderData: o, errors: s } = nn(t, n, r);
  return (
    i
      .filter((e) => !e.matches || e.matches.some((e) => e.shouldLoad))
      .forEach((t) => {
        let { key: n, match: r, controller: i } = t;
        if (i && i.signal.aborted) return;
        let o = a[n];
        if ((j(o, `Did not find corresponding fetcher result`), _n(o))) {
          let t = sn(e.matches, r?.route.id);
          ((s && s[t.route.id]) || (s = { ...s, [t.route.id]: o.error }),
            e.fetchers.delete(n));
        } else if (vn(o)) j(!1, `Unhandled fetcher revalidation redirect`);
        else {
          let t = Mn(o.data);
          e.fetchers.set(n, t);
        }
      }),
    { loaderData: o, errors: s }
  );
}
function an(e, t, n, r) {
  let i = Object.entries(t)
    .filter(([, e]) => e !== bt)
    .reduce((e, [t, n]) => ((e[t] = n), e), {});
  for (let a of n) {
    let n = a.route.id;
    if (
      (!t.hasOwnProperty(n) &&
        e.hasOwnProperty(n) &&
        a.route.loader &&
        (i[n] = e[n]),
      r && r.hasOwnProperty(n))
    )
      break;
  }
  return i;
}
function on(e) {
  return e
    ? _n(e[1])
      ? { actionData: {} }
      : { actionData: { [e[0]]: e[1].data } }
    : {};
}
function sn(e, t) {
  return (
    (t ? e.slice(0, e.findIndex((e) => e.route.id === t) + 1) : [...e])
      .reverse()
      .find((e) => e.route.hasErrorBoundary === !0) || e[0]
  );
}
function cn(e) {
  let t =
    e.length === 1
      ? e[0]
      : e.find((e) => e.index || !e.path || e.path === `/`) || {
          id: `__shim-error-route__`,
        };
  return {
    matches: [{ params: {}, pathname: ``, pathnameBase: ``, route: t }],
    route: t,
  };
}
function ln(
  e,
  { pathname: t, routeId: n, method: r, type: i, message: a } = {},
) {
  let o = `Unknown Server Error`,
    s = `Unknown @remix-run/router error`;
  return (
    e === 400
      ? ((o = `Bad Request`),
        r && t && n
          ? (s = `You made a ${r} request to "${t}" but did not provide a \`loader\` for route "${n}", so there is no way to handle the request.`)
          : i === `invalid-body` && (s = `Unable to encode submission body`))
      : e === 403
        ? ((o = `Forbidden`), (s = `Route "${n}" does not match URL "${t}"`))
        : e === 404
          ? ((o = `Not Found`), (s = `No route matches URL "${t}"`))
          : e === 405 &&
            ((o = `Method Not Allowed`),
            r && t && n
              ? (s = `You made a ${r.toUpperCase()} request to "${t}" but did not provide an \`action\` for route "${n}", so there is no way to handle the request.`)
              : r && (s = `Invalid request method "${r.toUpperCase()}"`)),
    new qe(e || 500, o, Error(s), !0)
  );
}
function un(e) {
  let t = Object.entries(e);
  for (let e = t.length - 1; e >= 0; e--) {
    let [n, r] = t[e];
    if (vn(r)) return { key: n, result: r };
  }
}
function dn(e) {
  return F({ ...(typeof e == `string` ? ne(e) : e), hash: `` });
}
function fn(e, t) {
  return e.pathname !== t.pathname || e.search !== t.search
    ? !1
    : e.hash === ``
      ? t.hash !== ``
      : e.hash === t.hash
        ? !0
        : t.hash !== ``;
}
function pn(e) {
  return new qe(
    e.init?.status ?? 500,
    e.init?.statusText ?? `Internal Server Error`,
    e.data,
  );
}
function mn(e) {
  return (
    typeof e == `object` &&
    !!e &&
    Object.entries(e).every(([e, t]) => typeof e == `string` && hn(t))
  );
}
function hn(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `type` in e &&
    `result` in e &&
    (e.type === `data` || e.type === `error`)
  );
}
function gn(e) {
  return bn(e.result) && pt.has(e.result.status);
}
function _n(e) {
  return e.type === `error`;
}
function vn(e) {
  return (e && e.type) === `redirect`;
}
function yn(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `type` in e &&
    `data` in e &&
    `init` in e &&
    e.type === `DataWithResponseInit`
  );
}
function bn(e) {
  return (
    e != null &&
    typeof e.status == `number` &&
    typeof e.statusText == `string` &&
    typeof e.headers == `object` &&
    e.body !== void 0
  );
}
function xn(e) {
  return pt.has(e);
}
function Sn(e) {
  return bn(e) && xn(e.status) && e.headers.has(`Location`);
}
function Cn(e) {
  return ft.has(e.toUpperCase());
}
function wn(e) {
  return ut.has(e.toUpperCase());
}
function Tn(e) {
  return new URLSearchParams(e).getAll(`index`).some((e) => e === ``);
}
function En(e, t) {
  let n = typeof t == `string` ? ne(t).search : t.search;
  if (e[e.length - 1].route.index && Tn(n || ``)) return e[e.length - 1];
  let r = Re(e);
  return r[r.length - 1];
}
function Dn(e) {
  let {
    formMethod: t,
    formAction: n,
    formEncType: r,
    text: i,
    formData: a,
    json: o,
  } = e;
  if (!(!t || !n || !r)) {
    if (i != null)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: void 0,
        json: void 0,
        text: i,
      };
    if (a != null)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: a,
        json: void 0,
        text: void 0,
      };
    if (o !== void 0)
      return {
        formMethod: t,
        formAction: n,
        formEncType: r,
        formData: void 0,
        json: o,
        text: void 0,
      };
  }
}
function On(e, t) {
  return t
    ? {
        state: `loading`,
        location: e,
        formMethod: t.formMethod,
        formAction: t.formAction,
        formEncType: t.formEncType,
        formData: t.formData,
        json: t.json,
        text: t.text,
      }
    : {
        state: `loading`,
        location: e,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
      };
}
function kn(e, t) {
  return {
    state: `submitting`,
    location: e,
    formMethod: t.formMethod,
    formAction: t.formAction,
    formEncType: t.formEncType,
    formData: t.formData,
    json: t.json,
    text: t.text,
  };
}
function An(e, t) {
  return e
    ? {
        state: `loading`,
        formMethod: e.formMethod,
        formAction: e.formAction,
        formEncType: e.formEncType,
        formData: e.formData,
        json: e.json,
        text: e.text,
        data: t,
      }
    : {
        state: `loading`,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
        data: t,
      };
}
function jn(e, t) {
  return {
    state: `submitting`,
    formMethod: e.formMethod,
    formAction: e.formAction,
    formEncType: e.formEncType,
    formData: e.formData,
    json: e.json,
    text: e.text,
    data: t ? t.data : void 0,
  };
}
function Mn(e) {
  return {
    state: `idle`,
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: e,
  };
}
function Nn(e, t) {
  try {
    let n = e.sessionStorage.getItem(yt);
    if (n) {
      let e = JSON.parse(n);
      for (let [n, r] of Object.entries(e || {}))
        r && Array.isArray(r) && t.set(n, new Set(r || []));
    }
  } catch {}
}
function Pn(e, t) {
  if (t.size > 0) {
    let n = {};
    for (let [e, r] of t) n[e] = [...r];
    try {
      e.sessionStorage.setItem(yt, JSON.stringify(n));
    } catch (e) {
      M(
        !1,
        `Failed to save applied view transitions in sessionStorage (${e}).`,
      );
    }
  }
}
function Fn() {
  let e,
    t,
    n = new Promise((r, i) => {
      ((e = async (e) => {
        r(e);
        try {
          await n;
        } catch {}
      }),
        (t = async (e) => {
          i(e);
          try {
            await n;
          } catch {}
        }));
    });
  return { promise: n, resolve: e, reject: t };
}
var In = w.createContext(null);
In.displayName = `DataRouter`;
var Ln = w.createContext(null);
Ln.displayName = `DataRouterState`;
var Rn = w.createContext(!1);
function zn() {
  return w.useContext(Rn);
}
var Bn = w.createContext({ isTransitioning: !1 });
Bn.displayName = `ViewTransition`;
var Vn = w.createContext(new Map());
Vn.displayName = `Fetchers`;
var Hn = w.createContext(null);
Hn.displayName = `Await`;
var Un = w.createContext(null);
Un.displayName = `Navigation`;
var Wn = w.createContext(null);
Wn.displayName = `Location`;
var Gn = w.createContext({ outlet: null, matches: [], isDataRoute: !1 });
Gn.displayName = `Route`;
var Kn = w.createContext(null);
Kn.displayName = `RouteError`;
var qn = `REACT_ROUTER_ERROR`,
  Jn = `REDIRECT`,
  Yn = `ROUTE_ERROR_RESPONSE`;
function Xn(e) {
  if (e.startsWith(`${qn}:${Jn}:{`))
    try {
      let t = JSON.parse(e.slice(28));
      if (
        typeof t == `object` &&
        t &&
        typeof t.status == `number` &&
        typeof t.statusText == `string` &&
        typeof t.location == `string` &&
        typeof t.reloadDocument == `boolean` &&
        typeof t.replace == `boolean`
      )
        return t;
    } catch {}
}
function Zn(e) {
  if (e.startsWith(`${qn}:${Yn}:{`))
    try {
      let t = JSON.parse(e.slice(40));
      if (
        typeof t == `object` &&
        t &&
        typeof t.status == `number` &&
        typeof t.statusText == `string`
      )
        return new qe(t.status, t.statusText, t.data);
    } catch {}
}
function Qn(e, { relative: t } = {}) {
  j($n(), `useHref() may be used only in the context of a <Router> component.`);
  let { basename: n, navigator: r } = w.useContext(Un),
    { hash: i, pathname: a, search: o } = sr(e, { relative: t }),
    s = a;
  return (
    n !== `/` && (s = a === `/` ? n : He([n, a])),
    r.createHref({ pathname: s, search: o, hash: i })
  );
}
function $n() {
  return w.useContext(Wn) != null;
}
function er() {
  return (
    j(
      $n(),
      `useLocation() may be used only in the context of a <Router> component.`,
    ),
    w.useContext(Wn).location
  );
}
var tr = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
function nr(e) {
  w.useContext(Un).static || w.useLayoutEffect(e);
}
function rr() {
  let { isDataRoute: e } = w.useContext(Gn);
  return e ? Tr() : ir();
}
function ir() {
  j(
    $n(),
    `useNavigate() may be used only in the context of a <Router> component.`,
  );
  let e = w.useContext(In),
    { basename: t, navigator: n } = w.useContext(Un),
    { matches: r } = w.useContext(Gn),
    { pathname: i } = er(),
    a = JSON.stringify(ze(r)),
    o = w.useRef(!1);
  return (
    nr(() => {
      o.current = !0;
    }),
    w.useCallback(
      (r, s = {}) => {
        if ((M(o.current, tr), !o.current)) return;
        if (typeof r == `number`) {
          n.go(r);
          return;
        }
        let c = Be(r, JSON.parse(a), i, s.relative === `path`);
        (e == null &&
          t !== `/` &&
          (c.pathname = c.pathname === `/` ? t : He([t, c.pathname])),
          (s.replace ? n.replace : n.push)(c, s.state, s));
      },
      [t, n, a, i, e],
    )
  );
}
var ar = w.createContext(null);
function or(e) {
  let t = w.useContext(Gn).outlet;
  return w.useMemo(
    () => t && w.createElement(ar.Provider, { value: e }, t),
    [t, e],
  );
}
function sr(e, { relative: t } = {}) {
  let { matches: n } = w.useContext(Gn),
    { pathname: r } = er(),
    i = JSON.stringify(ze(n));
  return w.useMemo(() => Be(e, JSON.parse(i), r, t === `path`), [e, i, r, t]);
}
function cr(e, t, n) {
  j(
    $n(),
    `useRoutes() may be used only in the context of a <Router> component.`,
  );
  let { navigator: r } = w.useContext(Un),
    { matches: i } = w.useContext(Gn),
    a = i[i.length - 1],
    o = a ? a.params : {},
    s = a ? a.pathname : `/`,
    c = a ? a.pathnameBase : `/`,
    l = a && a.route;
  {
    let e = (l && l.path) || ``;
    Dr(
      s,
      !l || e.endsWith(`*`) || e.endsWith(`*?`),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${s}" (under <Route path="${e}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${e}"> to <Route path="${e === `/` ? `*` : `${e}/*`}">.`,
    );
  }
  let u = er(),
    d;
  if (t) {
    let e = typeof t == `string` ? ne(t) : t;
    (j(
      c === `/` || e.pathname?.startsWith(c),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${c}" but pathname "${e.pathname}" was given in the \`location\` prop.`,
    ),
      (d = e));
  } else d = u;
  let f = d.pathname || `/`,
    p = f;
  if (c !== `/`) {
    let e = c.replace(/^\//, ``).split(`/`);
    p = `/` + f.replace(/^\//, ``).split(`/`).slice(e.length).join(`/`);
  }
  let m = fe(e, { pathname: p });
  (M(
    l || m != null,
    `No routes matched location "${d.pathname}${d.search}${d.hash}" `,
  ),
    M(
      m == null ||
        m[m.length - 1].route.element !== void 0 ||
        m[m.length - 1].route.Component !== void 0 ||
        m[m.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${d.pathname}${d.search}${d.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    ));
  let h = hr(
    m &&
      m.map((e) =>
        Object.assign({}, e, {
          params: Object.assign({}, o, e.params),
          pathname: He([
            c,
            r.encodeLocation
              ? r.encodeLocation(
                  e.pathname
                    .replace(/%/g, `%25`)
                    .replace(/\?/g, `%3F`)
                    .replace(/#/g, `%23`),
                ).pathname
              : e.pathname,
          ]),
          pathnameBase:
            e.pathnameBase === `/`
              ? c
              : He([
                  c,
                  r.encodeLocation
                    ? r.encodeLocation(
                        e.pathnameBase
                          .replace(/%/g, `%25`)
                          .replace(/\?/g, `%3F`)
                          .replace(/#/g, `%23`),
                      ).pathname
                    : e.pathnameBase,
                ]),
        }),
      ),
    i,
    n,
  );
  return t && h
    ? w.createElement(
        Wn.Provider,
        {
          value: {
            location: {
              pathname: `/`,
              search: ``,
              hash: ``,
              state: null,
              key: `default`,
              unstable_mask: void 0,
              ...d,
            },
            navigationType: `POP`,
          },
        },
        h,
      )
    : h;
}
function lr() {
  let e = wr(),
    t = Je(e)
      ? `${e.status} ${e.statusText}`
      : e instanceof Error
        ? e.message
        : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    r = `rgba(200,200,200, 0.5)`,
    i = { padding: `0.5rem`, backgroundColor: r },
    a = { padding: `2px 4px`, backgroundColor: r },
    o = null;
  return (
    console.error(`Error handled by React Router default ErrorBoundary:`, e),
    (o = w.createElement(
      w.Fragment,
      null,
      w.createElement(`p`, null, `💿 Hey developer 👋`),
      w.createElement(
        `p`,
        null,
        `You can provide a way better UX than this when your app throws errors by providing your own `,
        w.createElement(`code`, { style: a }, `ErrorBoundary`),
        ` or`,
        ` `,
        w.createElement(`code`, { style: a }, `errorElement`),
        ` prop on your route.`,
      ),
    )),
    w.createElement(
      w.Fragment,
      null,
      w.createElement(`h2`, null, `Unexpected Application Error!`),
      w.createElement(`h3`, { style: { fontStyle: `italic` } }, t),
      n ? w.createElement(`pre`, { style: i }, n) : null,
      o,
    )
  );
}
var ur = w.createElement(lr, null),
  dr = class extends w.Component {
    constructor(e) {
      (super(e),
        (this.state = {
          location: e.location,
          revalidation: e.revalidation,
          error: e.error,
        }));
    }
    static getDerivedStateFromError(e) {
      return { error: e };
    }
    static getDerivedStateFromProps(e, t) {
      return t.location !== e.location ||
        (t.revalidation !== `idle` && e.revalidation === `idle`)
        ? { error: e.error, location: e.location, revalidation: e.revalidation }
        : {
            error: e.error === void 0 ? t.error : e.error,
            location: t.location,
            revalidation: e.revalidation || t.revalidation,
          };
    }
    componentDidCatch(e, t) {
      this.props.onError
        ? this.props.onError(e, t)
        : console.error(
            `React Router caught the following error during render`,
            e,
          );
    }
    render() {
      let e = this.state.error;
      if (
        this.context &&
        typeof e == `object` &&
        e &&
        `digest` in e &&
        typeof e.digest == `string`
      ) {
        let t = Zn(e.digest);
        t && (e = t);
      }
      let t =
        e === void 0
          ? this.props.children
          : w.createElement(
              Gn.Provider,
              { value: this.props.routeContext },
              w.createElement(Kn.Provider, {
                value: e,
                children: this.props.component,
              }),
            );
      return this.context ? w.createElement(pr, { error: e }, t) : t;
    }
  };
dr.contextType = Rn;
var fr = new WeakMap();
function pr({ children: e, error: t }) {
  let { basename: n } = w.useContext(Un);
  if (
    typeof t == `object` &&
    t &&
    `digest` in t &&
    typeof t.digest == `string`
  ) {
    let e = Xn(t.digest);
    if (e) {
      let r = fr.get(t);
      if (r) throw r;
      let i = Ze(e.location, n);
      if (Xe && !fr.get(t))
        if (i.isExternal || e.reloadDocument)
          window.location.href = i.absoluteURL || i.to;
        else {
          let n = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(i.to, {
              replace: e.replace,
            }),
          );
          throw (fr.set(t, n), n);
        }
      return w.createElement(`meta`, {
        httpEquiv: `refresh`,
        content: `0;url=${i.absoluteURL || i.to}`,
      });
    }
  }
  return e;
}
function mr({ routeContext: e, match: t, children: n }) {
  let r = w.useContext(In);
  return (
    r &&
      r.static &&
      r.staticContext &&
      (t.route.errorElement || t.route.ErrorBoundary) &&
      (r.staticContext._deepestRenderedBoundaryId = t.route.id),
    w.createElement(Gn.Provider, { value: e }, n)
  );
}
function hr(e, t = [], n) {
  let r = n?.state;
  if (e == null) {
    if (!r) return null;
    if (r.errors) e = r.matches;
    else if (t.length === 0 && !r.initialized && r.matches.length > 0)
      e = r.matches;
    else return null;
  }
  let i = e,
    a = r?.errors;
  if (a != null) {
    let e = i.findIndex((e) => e.route.id && a?.[e.route.id] !== void 0);
    (j(
      e >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(a).join(`,`)}`,
    ),
      (i = i.slice(0, Math.min(i.length, e + 1))));
  }
  let o = !1,
    s = -1;
  if (n && r) {
    o = r.renderFallback;
    for (let e = 0; e < i.length; e++) {
      let t = i[e];
      if (
        ((t.route.HydrateFallback || t.route.hydrateFallbackElement) && (s = e),
        t.route.id)
      ) {
        let { loaderData: e, errors: a } = r,
          c =
            t.route.loader &&
            !e.hasOwnProperty(t.route.id) &&
            (!a || a[t.route.id] === void 0);
        if (t.route.lazy || c) {
          (n.isStatic && (o = !0), (i = s >= 0 ? i.slice(0, s + 1) : [i[0]]));
          break;
        }
      }
    }
  }
  let c = n?.onError,
    l =
      r && c
        ? (e, t) => {
            c(e, {
              location: r.location,
              params: r.matches?.[0]?.params ?? {},
              unstable_pattern: Ye(r.matches),
              errorInfo: t,
            });
          }
        : void 0;
  return i.reduceRight((e, n, c) => {
    let u,
      d = !1,
      f = null,
      p = null;
    r &&
      ((u = a && n.route.id ? a[n.route.id] : void 0),
      (f = n.route.errorElement || ur),
      o &&
        (s < 0 && c === 0
          ? (Dr(
              `route-fallback`,
              !1,
              "No `HydrateFallback` element provided to render during initial hydration",
            ),
            (d = !0),
            (p = null))
          : s === c &&
            ((d = !0), (p = n.route.hydrateFallbackElement || null))));
    let m = t.concat(i.slice(0, c + 1)),
      h = () => {
        let t;
        return (
          (t = u
            ? f
            : d
              ? p
              : n.route.Component
                ? w.createElement(n.route.Component, null)
                : n.route.element
                  ? n.route.element
                  : e),
          w.createElement(mr, {
            match: n,
            routeContext: { outlet: e, matches: m, isDataRoute: r != null },
            children: t,
          })
        );
      };
    return r && (n.route.ErrorBoundary || n.route.errorElement || c === 0)
      ? w.createElement(dr, {
          location: r.location,
          revalidation: r.revalidation,
          component: f,
          error: u,
          children: h(),
          routeContext: { outlet: null, matches: m, isDataRoute: !0 },
          onError: l,
        })
      : h();
  }, null);
}
function gr(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function _r(e) {
  let t = w.useContext(In);
  return (j(t, gr(e)), t);
}
function vr(e) {
  let t = w.useContext(Ln);
  return (j(t, gr(e)), t);
}
function yr(e) {
  let t = w.useContext(Gn);
  return (j(t, gr(e)), t);
}
function br(e) {
  let t = yr(e),
    n = t.matches[t.matches.length - 1];
  return (
    j(n.route.id, `${e} can only be used on routes that contain a unique "id"`),
    n.route.id
  );
}
function xr() {
  return br(`useRouteId`);
}
function Sr() {
  return vr(`useNavigation`).navigation;
}
function Cr() {
  let { matches: e, loaderData: t } = vr(`useMatches`);
  return w.useMemo(() => e.map((e) => me(e, t)), [e, t]);
}
function wr() {
  let e = w.useContext(Kn),
    t = vr(`useRouteError`),
    n = br(`useRouteError`);
  return e === void 0 ? t.errors?.[n] : e;
}
function Tr() {
  let { router: e } = _r(`useNavigate`),
    t = br(`useNavigate`),
    n = w.useRef(!1);
  return (
    nr(() => {
      n.current = !0;
    }),
    w.useCallback(
      async (r, i = {}) => {
        (M(n.current, tr),
          n.current &&
            (typeof r == `number`
              ? await e.navigate(r)
              : await e.navigate(r, { fromRouteId: t, ...i })));
      },
      [e, t],
    )
  );
}
var Er = {};
function Dr(e, t, n) {
  !t && !Er[e] && ((Er[e] = !0), M(!1, n));
}
var Or = {};
function kr(e, t) {
  !e && !Or[t] && ((Or[t] = !0), console.warn(t));
}
var Ar = w.useOptimistic,
  jr = () => void 0;
function Mr(e) {
  return Ar ? Ar(e) : [e, jr];
}
function Nr(e) {
  let t = {
    hasErrorBoundary:
      e.hasErrorBoundary || e.ErrorBoundary != null || e.errorElement != null,
  };
  return (
    e.Component &&
      (e.element &&
        M(
          !1,
          "You should not include both `Component` and `element` on your route - `Component` will be used.",
        ),
      Object.assign(t, {
        element: w.createElement(e.Component),
        Component: void 0,
      })),
    e.HydrateFallback &&
      (e.hydrateFallbackElement &&
        M(
          !1,
          "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - `HydrateFallback` will be used.",
        ),
      Object.assign(t, {
        hydrateFallbackElement: w.createElement(e.HydrateFallback),
        HydrateFallback: void 0,
      })),
    e.ErrorBoundary &&
      (e.errorElement &&
        M(
          !1,
          "You should not include both `ErrorBoundary` and `errorElement` on your route - `ErrorBoundary` will be used.",
        ),
      Object.assign(t, {
        errorElement: w.createElement(e.ErrorBoundary),
        ErrorBoundary: void 0,
      })),
    t
  );
}
var Pr = [`HydrateFallback`, `hydrateFallbackElement`],
  Fr = class {
    constructor() {
      ((this.status = `pending`),
        (this.promise = new Promise((e, t) => {
          ((this.resolve = (t) => {
            this.status === `pending` && ((this.status = `resolved`), e(t));
          }),
            (this.reject = (e) => {
              this.status === `pending` && ((this.status = `rejected`), t(e));
            }));
        })));
    }
  };
function Ir({
  router: e,
  flushSync: t,
  onError: n,
  unstable_useTransitions: r,
}) {
  r = zn() || r;
  let [i, a] = w.useState(e.state),
    [o, s] = Mr(i),
    [c, l] = w.useState(),
    [u, d] = w.useState({ isTransitioning: !1 }),
    [f, p] = w.useState(),
    [m, h] = w.useState(),
    [g, _] = w.useState(),
    v = w.useRef(new Map()),
    y = w.useCallback(
      (
        i,
        {
          deletedFetchers: o,
          newErrors: c,
          flushSync: u,
          viewTransitionOpts: g,
        },
      ) => {
        (c &&
          n &&
          Object.values(c).forEach((e) =>
            n(e, {
              location: i.location,
              params: i.matches[0]?.params ?? {},
              unstable_pattern: Ye(i.matches),
            }),
          ),
          i.fetchers.forEach((e, t) => {
            e.data !== void 0 && v.current.set(t, e.data);
          }),
          o.forEach((e) => v.current.delete(e)),
          kr(
            u === !1 || t != null,
            'You provided the `flushSync` option to a router update, but you are not using the `<RouterProvider>` from `react-router/dom` so `ReactDOM.flushSync()` is unavailable.  Please update your app to `import { RouterProvider } from "react-router/dom"` and ensure you have `react-dom` installed as a dependency to use the `flushSync` option.',
          ));
        let y =
          e.window != null &&
          e.window.document != null &&
          typeof e.window.document.startViewTransition == `function`;
        if (
          (kr(
            g == null || y,
            "You provided the `viewTransition` option to a router update, but you do not appear to be running in a DOM environment as `window.startViewTransition` is not available.",
          ),
          !g || !y)
        ) {
          t && u
            ? t(() => a(i))
            : r === !1
              ? a(i)
              : w.startTransition(() => {
                  (r === !0 && s((e) => Lr(e, i)), a(i));
                });
          return;
        }
        if (t && u) {
          t(() => {
            (m && (f?.resolve(), m.skipTransition()),
              d({
                isTransitioning: !0,
                flushSync: !0,
                currentLocation: g.currentLocation,
                nextLocation: g.nextLocation,
              }));
          });
          let n = e.window.document.startViewTransition(() => {
            t(() => a(i));
          });
          (n.finished.finally(() => {
            t(() => {
              (p(void 0), h(void 0), l(void 0), d({ isTransitioning: !1 }));
            });
          }),
            t(() => h(n)));
          return;
        }
        m
          ? (f?.resolve(),
            m.skipTransition(),
            _({
              state: i,
              currentLocation: g.currentLocation,
              nextLocation: g.nextLocation,
            }))
          : (l(i),
            d({
              isTransitioning: !0,
              flushSync: !1,
              currentLocation: g.currentLocation,
              nextLocation: g.nextLocation,
            }));
      },
      [e.window, t, m, f, r, s, n],
    );
  w.useLayoutEffect(() => e.subscribe(y), [e, y]);
  let b = o.initialized;
  (w.useLayoutEffect(() => {
    !b &&
      e.state.initialized &&
      y(e.state, { deletedFetchers: [], flushSync: !1, newErrors: null });
  }, [b, y, e.state]),
    w.useEffect(() => {
      u.isTransitioning && !u.flushSync && p(new Fr());
    }, [u]),
    w.useEffect(() => {
      if (f && c && e.window) {
        let t = c,
          n = f.promise,
          i = e.window.document.startViewTransition(async () => {
            (r === !1
              ? a(t)
              : w.startTransition(() => {
                  (r === !0 && s((e) => Lr(e, t)), a(t));
                }),
              await n);
          });
        (i.finished.finally(() => {
          (p(void 0), h(void 0), l(void 0), d({ isTransitioning: !1 }));
        }),
          h(i));
      }
    }, [c, f, e.window, r, s]),
    w.useEffect(() => {
      f && c && o.location.key === c.location.key && f.resolve();
    }, [f, m, o.location, c]),
    w.useEffect(() => {
      !u.isTransitioning &&
        g &&
        (l(g.state),
        d({
          isTransitioning: !0,
          flushSync: !1,
          currentLocation: g.currentLocation,
          nextLocation: g.nextLocation,
        }),
        _(void 0));
    }, [u.isTransitioning, g]));
  let x = w.useMemo(
      () => ({
        createHref: e.createHref,
        encodeLocation: e.encodeLocation,
        go: (t) => e.navigate(t),
        push: (t, n, r) =>
          e.navigate(t, {
            state: n,
            preventScrollReset: r?.preventScrollReset,
          }),
        replace: (t, n, r) =>
          e.navigate(t, {
            replace: !0,
            state: n,
            preventScrollReset: r?.preventScrollReset,
          }),
      }),
      [e],
    ),
    S = e.basename || `/`,
    C = w.useMemo(
      () => ({ router: e, navigator: x, static: !1, basename: S, onError: n }),
      [e, x, S, n],
    );
  return w.createElement(
    w.Fragment,
    null,
    w.createElement(
      In.Provider,
      { value: C },
      w.createElement(
        Ln.Provider,
        { value: o },
        w.createElement(
          Vn.Provider,
          { value: v.current },
          w.createElement(
            Bn.Provider,
            { value: u },
            w.createElement(
              Hr,
              {
                basename: S,
                location: o.location,
                navigationType: o.historyAction,
                navigator: x,
                unstable_useTransitions: r,
              },
              w.createElement(Rr, {
                routes: e.routes,
                future: e.future,
                state: o,
                isStatic: !1,
                onError: n,
              }),
            ),
          ),
        ),
      ),
    ),
    null,
  );
}
function Lr(e, t) {
  return {
    ...e,
    navigation: t.navigation.state === `idle` ? e.navigation : t.navigation,
    revalidation: t.revalidation === `idle` ? e.revalidation : t.revalidation,
    actionData:
      t.navigation.state === `submitting` ? e.actionData : t.actionData,
    fetchers: t.fetchers,
  };
}
var Rr = w.memo(zr);
function zr({ routes: e, future: t, state: n, isStatic: r, onError: i }) {
  return cr(e, void 0, { state: n, isStatic: r, onError: i, future: t });
}
function Br({ to: e, replace: t, state: n, relative: r }) {
  j(
    $n(),
    `<Navigate> may be used only in the context of a <Router> component.`,
  );
  let { static: i } = w.useContext(Un);
  M(
    !i,
    `<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.`,
  );
  let { matches: a } = w.useContext(Gn),
    { pathname: o } = er(),
    s = rr(),
    c = Be(e, ze(a), o, r === `path`),
    l = JSON.stringify(c);
  return (
    w.useEffect(() => {
      s(JSON.parse(l), { replace: t, state: n, relative: r });
    }, [s, l, r, t, n]),
    null
  );
}
function Vr(e) {
  return or(e.context);
}
function Hr({
  basename: e = `/`,
  children: t = null,
  location: n,
  navigationType: r = `POP`,
  navigator: i,
  static: a = !1,
  unstable_useTransitions: o,
}) {
  j(
    !$n(),
    `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`,
  );
  let s = e.replace(/^\/*/, `/`),
    c = w.useMemo(
      () => ({
        basename: s,
        navigator: i,
        static: a,
        unstable_useTransitions: o,
        future: {},
      }),
      [s, i, a, o],
    );
  typeof n == `string` && (n = ne(n));
  let {
      pathname: l = `/`,
      search: u = ``,
      hash: d = ``,
      state: f = null,
      key: p = `default`,
      unstable_mask: m,
    } = n,
    h = w.useMemo(() => {
      let e = je(l, s);
      return e == null
        ? null
        : {
            location: {
              pathname: e,
              search: u,
              hash: d,
              state: f,
              key: p,
              unstable_mask: m,
            },
            navigationType: r,
          };
    }, [s, l, u, d, f, p, r, m]);
  return (
    M(
      h != null,
      `<Router basename="${s}"> is not able to match the URL "${l}${u}${d}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    h == null
      ? null
      : w.createElement(
          Un.Provider,
          { value: c },
          w.createElement(Wn.Provider, { children: t, value: h }),
        )
  );
}
w.Component;
var Ur = `get`,
  Wr = `application/x-www-form-urlencoded`;
function Gr(e) {
  return typeof HTMLElement < `u` && e instanceof HTMLElement;
}
function Kr(e) {
  return Gr(e) && e.tagName.toLowerCase() === `button`;
}
function qr(e) {
  return Gr(e) && e.tagName.toLowerCase() === `form`;
}
function Jr(e) {
  return Gr(e) && e.tagName.toLowerCase() === `input`;
}
function Yr(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function Xr(e, t) {
  return e.button === 0 && (!t || t === `_self`) && !Yr(e);
}
function Zr(e = ``) {
  return new URLSearchParams(
    typeof e == `string` || Array.isArray(e) || e instanceof URLSearchParams
      ? e
      : Object.keys(e).reduce((t, n) => {
          let r = e[n];
          return t.concat(Array.isArray(r) ? r.map((e) => [n, e]) : [[n, r]]);
        }, []),
  );
}
function Qr(e, t) {
  let n = Zr(e);
  return (
    t &&
      t.forEach((e, r) => {
        n.has(r) ||
          t.getAll(r).forEach((e) => {
            n.append(r, e);
          });
      }),
    n
  );
}
var $r = null;
function ei() {
  if ($r === null)
    try {
      (new FormData(document.createElement(`form`), 0), ($r = !1));
    } catch {
      $r = !0;
    }
  return $r;
}
var ti = new Set([
  `application/x-www-form-urlencoded`,
  `multipart/form-data`,
  `text/plain`,
]);
function ni(e) {
  return e != null && !ti.has(e)
    ? (M(
        !1,
        `"${e}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Wr}"`,
      ),
      null)
    : e;
}
function ri(e, t) {
  let n, r, i, a, o;
  if (qr(e)) {
    let o = e.getAttribute(`action`);
    ((r = o ? je(o, t) : null),
      (n = e.getAttribute(`method`) || Ur),
      (i = ni(e.getAttribute(`enctype`)) || Wr),
      (a = new FormData(e)));
  } else if (Kr(e) || (Jr(e) && (e.type === `submit` || e.type === `image`))) {
    let o = e.form;
    if (o == null)
      throw Error(
        `Cannot submit a <button> or <input type="submit"> without a <form>`,
      );
    let s = e.getAttribute(`formaction`) || o.getAttribute(`action`);
    if (
      ((r = s ? je(s, t) : null),
      (n = e.getAttribute(`formmethod`) || o.getAttribute(`method`) || Ur),
      (i =
        ni(e.getAttribute(`formenctype`)) ||
        ni(o.getAttribute(`enctype`)) ||
        Wr),
      (a = new FormData(o, e)),
      !ei())
    ) {
      let { name: t, type: n, value: r } = e;
      if (n === `image`) {
        let e = t ? `${t}.` : ``;
        (a.append(`${e}x`, `0`), a.append(`${e}y`, `0`));
      } else t && a.append(t, r);
    }
  } else if (Gr(e))
    throw Error(
      `Cannot submit element that is not <form>, <button>, or <input type="submit|image">`,
    );
  else ((n = Ur), (r = null), (i = Wr), (o = e));
  return (
    a && i === `text/plain` && ((o = a), (a = void 0)),
    { action: r, method: n.toLowerCase(), encType: i, formData: a, body: o }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join(`\0`);
var ii = {
    "&": `\\u0026`,
    ">": `\\u003e`,
    "<": `\\u003c`,
    "\u2028": `\\u2028`,
    "\u2029": `\\u2029`,
  },
  ai = /[&><\u2028\u2029]/g;
function oi(e) {
  return e.replace(ai, (e) => ii[e]);
}
function si(e, t) {
  if (e === !1 || e == null) throw Error(t);
}
function ci(e, t, n, r) {
  let i =
    typeof e == `string`
      ? new URL(
          e,
          typeof window > `u`
            ? `server://singlefetch/`
            : window.location.origin,
        )
      : e;
  return (
    n
      ? i.pathname.endsWith(`/`)
        ? (i.pathname = `${i.pathname}_.${r}`)
        : (i.pathname = `${i.pathname}.${r}`)
      : i.pathname === `/`
        ? (i.pathname = `_root.${r}`)
        : t && je(i.pathname, t) === `/`
          ? (i.pathname = `${Ue(t)}/_root.${r}`)
          : (i.pathname = `${Ue(i.pathname)}.${r}`),
    i
  );
}
async function li(e, t) {
  if (e.id in t) return t[e.id];
  try {
    let n = await C(() => import(e.module), []);
    return ((t[e.id] = n), n);
  } catch (t) {
    return (
      console.error(
        `Error loading route module \`${e.module}\`, reloading page...`,
      ),
      console.error(t),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function ui(e) {
  return e != null && typeof e.page == `string`;
}
function di(e) {
  return e == null
    ? !1
    : e.href == null
      ? e.rel === `preload` &&
        typeof e.imageSrcSet == `string` &&
        typeof e.imageSizes == `string`
      : typeof e.rel == `string` && typeof e.href == `string`;
}
async function fi(e, t, n) {
  return _i(
    (
      await Promise.all(
        e.map(async (e) => {
          let r = t.routes[e.route.id];
          if (r) {
            let e = await li(r, n);
            return e.links ? e.links() : [];
          }
          return [];
        }),
      )
    )
      .flat(1)
      .filter(di)
      .filter((e) => e.rel === `stylesheet` || e.rel === `preload`)
      .map((e) =>
        e.rel === `stylesheet`
          ? { ...e, rel: `prefetch`, as: `style` }
          : { ...e, rel: `prefetch` },
      ),
  );
}
function pi(e, t, n, r, i, a) {
  let o = (e, t) => (n[t] ? e.route.id !== n[t].route.id : !0),
    s = (e, t) =>
      n[t].pathname !== e.pathname ||
      (n[t].route.path?.endsWith(`*`) && n[t].params[`*`] !== e.params[`*`]);
  return a === `assets`
    ? t.filter((e, t) => o(e, t) || s(e, t))
    : a === `data`
      ? t.filter((t, a) => {
          let c = r.routes[t.route.id];
          if (!c || !c.hasLoader) return !1;
          if (o(t, a) || s(t, a)) return !0;
          if (t.route.shouldRevalidate) {
            let r = t.route.shouldRevalidate({
              currentUrl: new URL(
                i.pathname + i.search + i.hash,
                window.origin,
              ),
              currentParams: n[0]?.params || {},
              nextUrl: new URL(e, window.origin),
              nextParams: t.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof r == `boolean`) return r;
          }
          return !0;
        })
      : [];
}
function mi(e, t, { includeHydrateFallback: n } = {}) {
  return hi(
    e
      .map((e) => {
        let r = t.routes[e.route.id];
        if (!r) return [];
        let i = [r.module];
        return (
          r.clientActionModule && (i = i.concat(r.clientActionModule)),
          r.clientLoaderModule && (i = i.concat(r.clientLoaderModule)),
          n &&
            r.hydrateFallbackModule &&
            (i = i.concat(r.hydrateFallbackModule)),
          r.imports && (i = i.concat(r.imports)),
          i
        );
      })
      .flat(1),
  );
}
function hi(e) {
  return [...new Set(e)];
}
function gi(e) {
  let t = {},
    n = Object.keys(e).sort();
  for (let r of n) t[r] = e[r];
  return t;
}
function _i(e, t) {
  let n = new Set(),
    r = new Set(t);
  return e.reduce((e, i) => {
    if (t && !ui(i) && i.as === `script` && i.href && r.has(i.href)) return e;
    let a = JSON.stringify(gi(i));
    return (n.has(a) || (n.add(a), e.push({ key: a, link: i })), e);
  }, []);
}
function vi() {
  let e = w.useContext(In);
  return (
    si(
      e,
      `You must render this element inside a <DataRouterContext.Provider> element`,
    ),
    e
  );
}
function yi() {
  let e = w.useContext(Ln);
  return (
    si(
      e,
      `You must render this element inside a <DataRouterStateContext.Provider> element`,
    ),
    e
  );
}
var bi = w.createContext(void 0);
bi.displayName = `FrameworkContext`;
function xi() {
  let e = w.useContext(bi);
  return (
    si(e, `You must render this element inside a <HydratedRouter> element`),
    e
  );
}
function Si(e, t) {
  let n = w.useContext(bi),
    [r, i] = w.useState(!1),
    [a, o] = w.useState(!1),
    {
      onFocus: s,
      onBlur: c,
      onMouseEnter: l,
      onMouseLeave: u,
      onTouchStart: d,
    } = t,
    f = w.useRef(null);
  (w.useEffect(() => {
    if ((e === `render` && o(!0), e === `viewport`)) {
      let e = new IntersectionObserver(
        (e) => {
          e.forEach((e) => {
            o(e.isIntersecting);
          });
        },
        { threshold: 0.5 },
      );
      return (
        f.current && e.observe(f.current),
        () => {
          e.disconnect();
        }
      );
    }
  }, [e]),
    w.useEffect(() => {
      if (r) {
        let e = setTimeout(() => {
          o(!0);
        }, 100);
        return () => {
          clearTimeout(e);
        };
      }
    }, [r]));
  let p = () => {
      i(!0);
    },
    m = () => {
      (i(!1), o(!1));
    };
  return n
    ? e === `intent`
      ? [
          a,
          f,
          {
            onFocus: Ci(s, p),
            onBlur: Ci(c, m),
            onMouseEnter: Ci(l, p),
            onMouseLeave: Ci(u, m),
            onTouchStart: Ci(d, p),
          },
        ]
      : [a, f, {}]
    : [!1, f, {}];
}
function Ci(e, t) {
  return (n) => {
    (e && e(n), n.defaultPrevented || t(n));
  };
}
function wi({ page: e, ...t }) {
  let n = zn(),
    { router: r } = vi(),
    i = w.useMemo(() => fe(r.routes, e, r.basename), [r.routes, e, r.basename]);
  return i
    ? n
      ? w.createElement(Ei, { page: e, matches: i, ...t })
      : w.createElement(Di, { page: e, matches: i, ...t })
    : null;
}
function Ti(e) {
  let { manifest: t, routeModules: n } = xi(),
    [r, i] = w.useState([]);
  return (
    w.useEffect(() => {
      let r = !1;
      return (
        fi(e, t, n).then((e) => {
          r || i(e);
        }),
        () => {
          r = !0;
        }
      );
    }, [e, t, n]),
    r
  );
}
function Ei({ page: e, matches: t, ...n }) {
  let r = er(),
    { future: i } = xi(),
    { basename: a } = vi(),
    o = w.useMemo(() => {
      if (e === r.pathname + r.search + r.hash) return [];
      let n = ci(e, a, i.unstable_trailingSlashAwareDataRequests, `rsc`),
        o = !1,
        s = [];
      for (let e of t)
        typeof e.route.shouldRevalidate == `function`
          ? (o = !0)
          : s.push(e.route.id);
      return (
        o && s.length > 0 && n.searchParams.set(`_routes`, s.join(`,`)),
        [n.pathname + n.search]
      );
    }, [a, i.unstable_trailingSlashAwareDataRequests, e, r, t]);
  return w.createElement(
    w.Fragment,
    null,
    o.map((e) =>
      w.createElement(`link`, {
        key: e,
        rel: `prefetch`,
        as: `fetch`,
        href: e,
        ...n,
      }),
    ),
  );
}
function Di({ page: e, matches: t, ...n }) {
  let r = er(),
    { future: i, manifest: a, routeModules: o } = xi(),
    { basename: s } = vi(),
    { loaderData: c, matches: l } = yi(),
    u = w.useMemo(() => pi(e, t, l, a, r, `data`), [e, t, l, a, r]),
    d = w.useMemo(() => pi(e, t, l, a, r, `assets`), [e, t, l, a, r]),
    f = w.useMemo(() => {
      if (e === r.pathname + r.search + r.hash) return [];
      let n = new Set(),
        l = !1;
      if (
        (t.forEach((e) => {
          let t = a.routes[e.route.id];
          !t ||
            !t.hasLoader ||
            ((!u.some((t) => t.route.id === e.route.id) &&
              e.route.id in c &&
              o[e.route.id]?.shouldRevalidate) ||
            t.hasClientLoader
              ? (l = !0)
              : n.add(e.route.id));
        }),
        n.size === 0)
      )
        return [];
      let d = ci(e, s, i.unstable_trailingSlashAwareDataRequests, `data`);
      return (
        l &&
          n.size > 0 &&
          d.searchParams.set(
            `_routes`,
            t
              .filter((e) => n.has(e.route.id))
              .map((e) => e.route.id)
              .join(`,`),
          ),
        [d.pathname + d.search]
      );
    }, [s, i.unstable_trailingSlashAwareDataRequests, c, r, a, u, t, e, o]),
    p = w.useMemo(() => mi(d, a), [d, a]),
    m = Ti(d);
  return w.createElement(
    w.Fragment,
    null,
    f.map((e) =>
      w.createElement(`link`, {
        key: e,
        rel: `prefetch`,
        as: `fetch`,
        href: e,
        ...n,
      }),
    ),
    p.map((e) =>
      w.createElement(`link`, { key: e, rel: `modulepreload`, href: e, ...n }),
    ),
    m.map(({ key: e, link: t }) =>
      w.createElement(`link`, {
        key: e,
        nonce: n.nonce,
        ...t,
        crossOrigin: t.crossOrigin ?? n.crossOrigin,
      }),
    ),
  );
}
function Oi(...e) {
  return (t) => {
    e.forEach((e) => {
      typeof e == `function` ? e(t) : e != null && (e.current = t);
    });
  };
}
w.Component;
var ki =
  typeof window < `u` &&
  window.document !== void 0 &&
  window.document.createElement !== void 0;
try {
  ki && (window.__reactRouterVersion = `7.14.1`);
} catch {}
function Ai(e, t) {
  return xt({
    basename: t?.basename,
    getContext: t?.getContext,
    future: t?.future,
    history: A({ window: t?.window }),
    hydrationData: t?.hydrationData || ji(),
    routes: e,
    mapRouteProperties: Nr,
    hydrationRouteProperties: Pr,
    dataStrategy: t?.dataStrategy,
    patchRoutesOnNavigation: t?.patchRoutesOnNavigation,
    window: t?.window,
    unstable_instrumentations: t?.unstable_instrumentations,
  }).initialize();
}
function ji() {
  let e = window?.__staticRouterHydrationData;
  return (e && e.errors && (e = { ...e, errors: Mi(e.errors) }), e);
}
function Mi(e) {
  if (!e) return null;
  let t = Object.entries(e),
    n = {};
  for (let [e, r] of t)
    if (r && r.__type === `RouteErrorResponse`)
      n[e] = new qe(r.status, r.statusText, r.data, r.internal === !0);
    else if (r && r.__type === `Error`) {
      if (r.__subType) {
        let t = window[r.__subType];
        if (typeof t == `function`)
          try {
            let i = new t(r.message);
            ((i.stack = ``), (n[e] = i));
          } catch {}
      }
      if (n[e] == null) {
        let t = Error(r.message);
        ((t.stack = ``), (n[e] = t));
      }
    } else n[e] = r;
  return n;
}
function Ni({
  basename: e,
  children: t,
  history: n,
  unstable_useTransitions: r,
}) {
  let [i, a] = w.useState({ action: n.action, location: n.location }),
    o = w.useCallback(
      (e) => {
        r === !1 ? a(e) : w.startTransition(() => a(e));
      },
      [r],
    );
  return (
    w.useLayoutEffect(() => n.listen(o), [n, o]),
    w.createElement(Hr, {
      basename: e,
      children: t,
      location: i.location,
      navigationType: i.action,
      navigator: n,
      unstable_useTransitions: r,
    })
  );
}
Ni.displayName = `unstable_HistoryRouter`;
var Pi = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Fi = w.forwardRef(function (
    {
      onClick: e,
      discover: t = `render`,
      prefetch: n = `none`,
      relative: r,
      reloadDocument: i,
      replace: a,
      unstable_mask: o,
      state: s,
      target: c,
      to: l,
      preventScrollReset: u,
      viewTransition: d,
      unstable_defaultShouldRevalidate: f,
      ...p
    },
    m,
  ) {
    let {
        basename: h,
        navigator: g,
        unstable_useTransitions: _,
      } = w.useContext(Un),
      v = typeof l == `string` && Pi.test(l),
      y = Ze(l, h);
    l = y.to;
    let b = Qn(l, { relative: r }),
      x = er(),
      S = null;
    if (o) {
      let e = Be(o, [], x.unstable_mask ? x.unstable_mask.pathname : `/`, !0);
      (h !== `/` && (e.pathname = e.pathname === `/` ? h : He([h, e.pathname])),
        (S = g.createHref(e)));
    }
    let [C, T, E] = Si(n, p),
      D = Vi(l, {
        replace: a,
        unstable_mask: o,
        state: s,
        target: c,
        preventScrollReset: u,
        relative: r,
        viewTransition: d,
        unstable_defaultShouldRevalidate: f,
        unstable_useTransitions: _,
      });
    function O(t) {
      (e && e(t), t.defaultPrevented || D(t));
    }
    let ee = !(y.isExternal || i),
      k = w.createElement(`a`, {
        ...p,
        ...E,
        href: (ee ? S : void 0) || y.absoluteURL || b,
        onClick: ee ? O : e,
        ref: Oi(m, T),
        target: c,
        "data-discover": !v && t === `render` ? `true` : void 0,
      });
    return C && !v
      ? w.createElement(w.Fragment, null, k, w.createElement(wi, { page: b }))
      : k;
  });
Fi.displayName = `Link`;
var R = w.forwardRef(function (
  {
    "aria-current": e = `page`,
    caseSensitive: t = !1,
    className: n = ``,
    end: r = !1,
    style: i,
    to: a,
    viewTransition: o,
    children: s,
    ...c
  },
  l,
) {
  let u = sr(a, { relative: c.relative }),
    d = er(),
    f = w.useContext(Ln),
    { navigator: p, basename: m } = w.useContext(Un),
    h = f != null && Qi(u) && o === !0,
    g = p.encodeLocation ? p.encodeLocation(u).pathname : u.pathname,
    _ = d.pathname,
    v =
      f && f.navigation && f.navigation.location
        ? f.navigation.location.pathname
        : null;
  (t ||
    ((_ = _.toLowerCase()),
    (v = v ? v.toLowerCase() : null),
    (g = g.toLowerCase())),
    v && m && (v = je(v, m) || v));
  let y = g !== `/` && g.endsWith(`/`) ? g.length - 1 : g.length,
    b = _ === g || (!r && _.startsWith(g) && _.charAt(y) === `/`),
    x =
      v != null &&
      (v === g || (!r && v.startsWith(g) && v.charAt(g.length) === `/`)),
    S = { isActive: b, isPending: x, isTransitioning: h },
    C = b ? e : void 0,
    T;
  T =
    typeof n == `function`
      ? n(S)
      : [
          n,
          b ? `active` : null,
          x ? `pending` : null,
          h ? `transitioning` : null,
        ]
          .filter(Boolean)
          .join(` `);
  let E = typeof i == `function` ? i(S) : i;
  return w.createElement(
    Fi,
    {
      ...c,
      "aria-current": C,
      className: T,
      ref: l,
      style: E,
      to: a,
      viewTransition: o,
    },
    typeof s == `function` ? s(S) : s,
  );
});
R.displayName = `NavLink`;
var Ii = w.forwardRef(
  (
    {
      discover: e = `render`,
      fetcherKey: t,
      navigate: n,
      reloadDocument: r,
      replace: i,
      state: a,
      method: o = Ur,
      action: s,
      onSubmit: c,
      relative: l,
      preventScrollReset: u,
      viewTransition: d,
      unstable_defaultShouldRevalidate: f,
      ...p
    },
    m,
  ) => {
    let { unstable_useTransitions: h } = w.useContext(Un),
      g = Gi(),
      _ = Ki(s, { relative: l }),
      v = o.toLowerCase() === `get` ? `get` : `post`,
      y = typeof s == `string` && Pi.test(s);
    return w.createElement(`form`, {
      ref: m,
      method: v,
      action: _,
      onSubmit: r
        ? c
        : (e) => {
            if ((c && c(e), e.defaultPrevented)) return;
            e.preventDefault();
            let r = e.nativeEvent.submitter,
              s = r?.getAttribute(`formmethod`) || o,
              p = () =>
                g(r || e.currentTarget, {
                  fetcherKey: t,
                  method: s,
                  navigate: n,
                  replace: i,
                  state: a,
                  relative: l,
                  preventScrollReset: u,
                  viewTransition: d,
                  unstable_defaultShouldRevalidate: f,
                });
            h && n !== !1 ? w.startTransition(() => p()) : p();
          },
      ...p,
      "data-discover": !y && e === `render` ? `true` : void 0,
    });
  },
);
Ii.displayName = `Form`;
function Li({ getKey: e, storageKey: t, ...n }) {
  let r = w.useContext(bi),
    { basename: i } = w.useContext(Un),
    a = er(),
    o = Cr();
  Xi({ getKey: e, storageKey: t });
  let s = w.useMemo(() => {
    if (!r || !e) return null;
    let t = Yi(a, o, i, e);
    return t === a.key ? null : t;
  }, []);
  if (!r || r.isSpaMode) return null;
  let c = ((e, t) => {
    if (!window.history.state || !window.history.state.key) {
      let e = Math.random().toString(32).slice(2);
      window.history.replaceState({ key: e }, ``);
    }
    try {
      let n = JSON.parse(sessionStorage.getItem(e) || `{}`)[
        t || window.history.state.key
      ];
      typeof n == `number` && window.scrollTo(0, n);
    } catch (t) {
      (console.error(t), sessionStorage.removeItem(e));
    }
  }).toString();
  return w.createElement(`script`, {
    ...n,
    suppressHydrationWarning: !0,
    dangerouslySetInnerHTML: {
      __html: `(${c})(${oi(JSON.stringify(t || qi))}, ${oi(JSON.stringify(s))})`,
    },
  });
}
Li.displayName = `ScrollRestoration`;
function Ri(e) {
  return `${e} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function zi(e) {
  let t = w.useContext(In);
  return (j(t, Ri(e)), t);
}
function Bi(e) {
  let t = w.useContext(Ln);
  return (j(t, Ri(e)), t);
}
function Vi(
  e,
  {
    target: t,
    replace: n,
    unstable_mask: r,
    state: i,
    preventScrollReset: a,
    relative: o,
    viewTransition: s,
    unstable_defaultShouldRevalidate: c,
    unstable_useTransitions: l,
  } = {},
) {
  let u = rr(),
    d = er(),
    f = sr(e, { relative: o });
  return w.useCallback(
    (p) => {
      if (Xr(p, t)) {
        p.preventDefault();
        let t = n === void 0 ? F(d) === F(f) : n,
          m = () =>
            u(e, {
              replace: t,
              unstable_mask: r,
              state: i,
              preventScrollReset: a,
              relative: o,
              viewTransition: s,
              unstable_defaultShouldRevalidate: c,
            });
        l ? w.startTransition(() => m()) : m();
      }
    },
    [d, u, f, n, r, i, t, e, a, o, s, c, l],
  );
}
function Hi(e) {
  M(
    typeof URLSearchParams < `u`,
    "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.",
  );
  let t = w.useRef(Zr(e)),
    n = w.useRef(!1),
    r = er(),
    i = w.useMemo(() => Qr(r.search, n.current ? null : t.current), [r.search]),
    a = rr();
  return [
    i,
    w.useCallback(
      (e, t) => {
        let r = Zr(typeof e == `function` ? e(new URLSearchParams(i)) : e);
        ((n.current = !0), a(`?` + r, t));
      },
      [a, i],
    ),
  ];
}
var Ui = 0,
  Wi = () => `__${String(++Ui)}__`;
function Gi() {
  let { router: e } = zi(`useSubmit`),
    { basename: t } = w.useContext(Un),
    n = xr(),
    r = e.fetch,
    i = e.navigate;
  return w.useCallback(
    async (e, a = {}) => {
      let { action: o, method: s, encType: c, formData: l, body: u } = ri(e, t);
      a.navigate === !1
        ? await r(a.fetcherKey || Wi(), n, a.action || o, {
            unstable_defaultShouldRevalidate:
              a.unstable_defaultShouldRevalidate,
            preventScrollReset: a.preventScrollReset,
            formData: l,
            body: u,
            formMethod: a.method || s,
            formEncType: a.encType || c,
            flushSync: a.flushSync,
          })
        : await i(a.action || o, {
            unstable_defaultShouldRevalidate:
              a.unstable_defaultShouldRevalidate,
            preventScrollReset: a.preventScrollReset,
            formData: l,
            body: u,
            formMethod: a.method || s,
            formEncType: a.encType || c,
            replace: a.replace,
            state: a.state,
            fromRouteId: n,
            flushSync: a.flushSync,
            viewTransition: a.viewTransition,
          });
    },
    [r, i, t, n],
  );
}
function Ki(e, { relative: t } = {}) {
  let { basename: n } = w.useContext(Un),
    r = w.useContext(Gn);
  j(r, `useFormAction must be used inside a RouteContext`);
  let [i] = r.matches.slice(-1),
    a = { ...sr(e || `.`, { relative: t }) },
    o = er();
  if (e == null) {
    a.search = o.search;
    let e = new URLSearchParams(a.search),
      t = e.getAll(`index`);
    if (t.some((e) => e === ``)) {
      (e.delete(`index`),
        t.filter((e) => e).forEach((t) => e.append(`index`, t)));
      let n = e.toString();
      a.search = n ? `?${n}` : ``;
    }
  }
  return (
    (!e || e === `.`) &&
      i.route.index &&
      (a.search = a.search ? a.search.replace(/^\?/, `?index&`) : `?index`),
    n !== `/` && (a.pathname = a.pathname === `/` ? n : He([n, a.pathname])),
    F(a)
  );
}
var qi = `react-router-scroll-positions`,
  Ji = {};
function Yi(e, t, n, r) {
  let i = null;
  return (
    r &&
      (i = r(
        n === `/` ? e : { ...e, pathname: je(e.pathname, n) || e.pathname },
        t,
      )),
    (i ??= e.key),
    i
  );
}
function Xi({ getKey: e, storageKey: t } = {}) {
  let { router: n } = zi(`useScrollRestoration`),
    { restoreScrollPosition: r, preventScrollReset: i } =
      Bi(`useScrollRestoration`),
    { basename: a } = w.useContext(Un),
    o = er(),
    s = Cr(),
    c = Sr();
  (w.useEffect(
    () => (
      (window.history.scrollRestoration = `manual`),
      () => {
        window.history.scrollRestoration = `auto`;
      }
    ),
    [],
  ),
    Zi(
      w.useCallback(() => {
        if (c.state === `idle`) {
          let t = Yi(o, s, a, e);
          Ji[t] = window.scrollY;
        }
        try {
          sessionStorage.setItem(t || qi, JSON.stringify(Ji));
        } catch (e) {
          M(
            !1,
            `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${e}).`,
          );
        }
        window.history.scrollRestoration = `auto`;
      }, [c.state, e, a, o, s, t]),
    ),
    typeof document < `u` &&
      (w.useLayoutEffect(() => {
        try {
          let e = sessionStorage.getItem(t || qi);
          e && (Ji = JSON.parse(e));
        } catch {}
      }, [t]),
      w.useLayoutEffect(() => {
        let t = n?.enableScrollRestoration(
          Ji,
          () => window.scrollY,
          e ? (t, n) => Yi(t, n, a, e) : void 0,
        );
        return () => t && t();
      }, [n, a, e]),
      w.useLayoutEffect(() => {
        if (r !== !1) {
          if (typeof r == `number`) {
            window.scrollTo(0, r);
            return;
          }
          try {
            if (o.hash) {
              let e = document.getElementById(
                decodeURIComponent(o.hash.slice(1)),
              );
              if (e) {
                e.scrollIntoView();
                return;
              }
            }
          } catch {
            M(
              !1,
              `"${o.hash.slice(1)}" is not a decodable element ID. The view will not scroll to it.`,
            );
          }
          i !== !0 && window.scrollTo(0, 0);
        }
      }, [o, r, i])));
}
function Zi(e, t) {
  let { capture: n } = t || {};
  w.useEffect(() => {
    let t = n == null ? void 0 : { capture: n };
    return (
      window.addEventListener(`pagehide`, e, t),
      () => {
        window.removeEventListener(`pagehide`, e, t);
      }
    );
  }, [e, n]);
}
function Qi(e, { relative: t } = {}) {
  let n = w.useContext(Bn);
  j(
    n != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: r } = zi(`useViewTransitionState`),
    i = sr(e, { relative: t });
  if (!n.isTransitioning) return !1;
  let a = je(n.currentLocation.pathname, r) || n.currentLocation.pathname,
    o = je(n.nextLocation.pathname, r) || n.nextLocation.pathname;
  return Oe(i.pathname, o) != null || Oe(i.pathname, a) != null;
}
var $i = u(_(), 1);
function ea(e) {
  return w.createElement(Ir, { flushSync: $i.flushSync, ...e });
}
var ta = /\s+/g,
  na = (e) => (typeof e != `string` || !e ? e : e.replace(ta, ` `).trim()),
  ra = (...e) => {
    let t = [],
      n = (e) => {
        if (!e && e !== 0 && e !== 0n) return;
        if (Array.isArray(e)) {
          for (let t = 0, r = e.length; t < r; t++) n(e[t]);
          return;
        }
        let r = typeof e;
        if (r === `string` || r === `number` || r === `bigint`) {
          if (r === `number` && e !== e) return;
          t.push(String(e));
        } else if (r === `object`) {
          let n = Object.keys(e);
          for (let r = 0, i = n.length; r < i; r++) {
            let i = n[r];
            e[i] && t.push(i);
          }
        }
      };
    for (let t = 0, r = e.length; t < r; t++) {
      let r = e[t];
      r != null && n(r);
    }
    return t.length > 0 ? na(t.join(` `)) : void 0;
  },
  ia = (e) => (e === !1 ? `false` : e === !0 ? `true` : e === 0 ? `0` : e),
  aa = (e) => {
    if (!e || typeof e != `object`) return !0;
    for (let t in e) return !1;
    return !0;
  },
  oa = (e, t) => {
    if (e === t) return !0;
    if (!e || !t) return !1;
    let n = Object.keys(e),
      r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (let i = 0; i < n.length; i++) {
      let a = n[i];
      if (!r.includes(a) || e[a] !== t[a]) return !1;
    }
    return !0;
  },
  sa = (e, t) => {
    for (let n in t)
      if (Object.prototype.hasOwnProperty.call(t, n)) {
        let r = t[n];
        n in e ? (e[n] = ra(e[n], r)) : (e[n] = r);
      }
    return e;
  },
  ca = (e, t) => {
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      Array.isArray(r) ? ca(r, t) : r && t.push(r);
    }
  },
  la = (...e) => {
    let t = [];
    ca(e, t);
    let n = [];
    for (let e = 0; e < t.length; e++) t[e] && n.push(t[e]);
    return n;
  },
  ua = (e, t) => {
    let n = {};
    for (let r in e) {
      let i = e[r];
      if (r in t) {
        let e = t[r];
        Array.isArray(i) || Array.isArray(e)
          ? (n[r] = la(e, i))
          : typeof i == `object` && typeof e == `object` && i && e
            ? (n[r] = ua(i, e))
            : (n[r] = e + ` ` + i);
      } else n[r] = i;
    }
    for (let r in t) r in e || (n[r] = t[r]);
    return n;
  },
  da = { twMerge: !0, twMergeConfig: {} };
function fa() {
  let e = null,
    t = {},
    n = !1;
  return {
    get cachedTwMerge() {
      return e;
    },
    set cachedTwMerge(t) {
      e = t;
    },
    get cachedTwMergeConfig() {
      return t;
    },
    set cachedTwMergeConfig(e) {
      t = e;
    },
    get didTwMergeConfigChange() {
      return n;
    },
    set didTwMergeConfigChange(e) {
      n = e;
    },
    reset() {
      ((e = null), (t = {}), (n = !1));
    },
  };
}
var pa = fa(),
  ma = (e) => {
    let t = (t, n) => {
      let {
          extend: r = null,
          slots: i = {},
          variants: a = {},
          compoundVariants: o = [],
          compoundSlots: s = [],
          defaultVariants: c = {},
        } = t,
        l = { ...da, ...n },
        u = r?.base ? ra(r.base, t?.base) : t?.base,
        d = r?.variants && !aa(r.variants) ? ua(a, r.variants) : a,
        f =
          r?.defaultVariants && !aa(r.defaultVariants)
            ? { ...r.defaultVariants, ...c }
            : c;
      !aa(l.twMergeConfig) &&
        !oa(l.twMergeConfig, pa.cachedTwMergeConfig) &&
        ((pa.didTwMergeConfigChange = !0),
        (pa.cachedTwMergeConfig = l.twMergeConfig));
      let p = aa(r?.slots),
        m = aa(i) ? {} : { base: ra(t?.base, p && r?.base), ...i },
        h = p ? m : sa({ ...r?.slots }, aa(m) ? { base: t?.base } : m),
        g = aa(r?.compoundVariants) ? o : la(r?.compoundVariants, o),
        _ = (t) => {
          if (aa(d) && aa(i) && p) return e(u, t?.class, t?.className)(l);
          if (g && !Array.isArray(g))
            throw TypeError(
              `The "compoundVariants" prop must be an array. Received: ${typeof g}`,
            );
          if (s && !Array.isArray(s))
            throw TypeError(
              `The "compoundSlots" prop must be an array. Received: ${typeof s}`,
            );
          let n = (e, n = d, r = null, i = null) => {
              let a = n[e];
              if (!a || aa(a)) return null;
              let o = i?.[e] ?? t?.[e];
              if (o === null) return null;
              let s = ia(o);
              if (typeof s == `object`) return null;
              let c = f?.[e];
              return a[(s ?? ia(c)) || `false`];
            },
            r = () => {
              if (!d) return null;
              let e = Object.keys(d),
                t = [];
              for (let r = 0; r < e.length; r++) {
                let i = n(e[r], d);
                i && t.push(i);
              }
              return t;
            },
            a = (e, t) => {
              if (!d || typeof d != `object`) return null;
              let r = [];
              for (let i in d) {
                let a = n(i, d, e, t),
                  o = e === `base` && typeof a == `string` ? a : a && a[e];
                o && r.push(o);
              }
              return r;
            },
            o = {};
          for (let e in t) {
            let n = t[e];
            n !== void 0 && (o[e] = n);
          }
          let c = (e, n) => {
              let r = typeof t?.[e] == `object` ? { [e]: t[e]?.initial } : {};
              return { ...f, ...o, ...r, ...n };
            },
            m = (e = [], t) => {
              let n = [],
                r = e.length;
              for (let i = 0; i < r; i++) {
                let { class: r, className: a, ...o } = e[i],
                  s = !0,
                  l = c(null, t);
                for (let e in o) {
                  let t = o[e],
                    n = l[e];
                  if (Array.isArray(t)) {
                    if (!t.includes(n)) {
                      s = !1;
                      break;
                    }
                  } else {
                    if ((t == null || t === !1) && (n == null || n === !1))
                      continue;
                    if (n !== t) {
                      s = !1;
                      break;
                    }
                  }
                }
                s && (r && n.push(r), a && n.push(a));
              }
              return n;
            },
            _ = (t) => {
              let n = m(g, t);
              if (!Array.isArray(n)) return n;
              let r = {},
                i = e;
              for (let e = 0; e < n.length; e++) {
                let t = n[e];
                if (typeof t == `string`) r.base = i(r.base, t)(l);
                else if (typeof t == `object`)
                  for (let e in t) r[e] = i(r[e], t[e])(l);
              }
              return r;
            },
            v = (e) => {
              if (s.length < 1) return null;
              let t = {},
                n = c(null, e);
              for (let e = 0; e < s.length; e++) {
                let { slots: r = [], class: i, className: a, ...o } = s[e];
                if (!aa(o)) {
                  let e = !0;
                  for (let t in o) {
                    let r = n[t],
                      i = o[t];
                    if (
                      r === void 0 ||
                      (Array.isArray(i) ? !i.includes(r) : i !== r)
                    ) {
                      e = !1;
                      break;
                    }
                  }
                  if (!e) continue;
                }
                for (let e = 0; e < r.length; e++) {
                  let n = r[e];
                  (t[n] || (t[n] = []), t[n].push([i, a]));
                }
              }
              return t;
            };
          if (!aa(i) || !p) {
            let t = {};
            if (typeof h == `object` && !aa(h)) {
              let n = e;
              for (let e in h)
                t[e] = (t) => {
                  let r = _(t),
                    i = v(t);
                  return n(
                    h[e],
                    a(e, t),
                    r ? r[e] : void 0,
                    i ? i[e] : void 0,
                    t?.class,
                    t?.className,
                  )(l);
                };
            }
            return t;
          }
          return e(u, r(), m(g), t?.class, t?.className)(l);
        };
      return (
        (_.variantKeys = (() => {
          if (!(!d || typeof d != `object`)) return Object.keys(d);
        })()),
        (_.extend = r),
        (_.base = u),
        (_.slots = h),
        (_.variants = d),
        (_.defaultVariants = f),
        (_.compoundSlots = s),
        (_.compoundVariants = g),
        _
      );
    };
    return { tv: t, createTV: (e) => (n, r) => t(n, r ? ua(e, r) : e) };
  },
  ha = (e, t) => {
    let n = Array(e.length + t.length);
    for (let t = 0; t < e.length; t++) n[t] = e[t];
    for (let r = 0; r < t.length; r++) n[e.length + r] = t[r];
    return n;
  },
  ga = (e, t) => ({ classGroupId: e, validator: t }),
  _a = (e = new Map(), t = null, n) => ({
    nextPart: e,
    validators: t,
    classGroupId: n,
  }),
  va = `-`,
  ya = [],
  ba = `arbitrary..`,
  xa = (e) => {
    let t = wa(e),
      { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (e) => {
        if (e.startsWith(`[`) && e.endsWith(`]`)) return Ca(e);
        let n = e.split(va);
        return Sa(n, +(n[0] === `` && n.length > 1), t);
      },
      getConflictingClassGroupIds: (e, t) => {
        if (t) {
          let t = r[e],
            i = n[e];
          return t ? (i ? ha(i, t) : t) : i || ya;
        }
        return n[e] || ya;
      },
    };
  },
  Sa = (e, t, n) => {
    if (e.length - t === 0) return n.classGroupId;
    let r = e[t],
      i = n.nextPart.get(r);
    if (i) {
      let n = Sa(e, t + 1, i);
      if (n) return n;
    }
    let a = n.validators;
    if (a === null) return;
    let o = t === 0 ? e.join(va) : e.slice(t).join(va),
      s = a.length;
    for (let e = 0; e < s; e++) {
      let t = a[e];
      if (t.validator(o)) return t.classGroupId;
    }
  },
  Ca = (e) =>
    e.slice(1, -1).indexOf(`:`) === -1
      ? void 0
      : (() => {
          let t = e.slice(1, -1),
            n = t.indexOf(`:`),
            r = t.slice(0, n);
          return r ? ba + r : void 0;
        })(),
  wa = (e) => {
    let { theme: t, classGroups: n } = e;
    return Ta(n, t);
  },
  Ta = (e, t) => {
    let n = _a();
    for (let r in e) {
      let i = e[r];
      Ea(i, n, r, t);
    }
    return n;
  },
  Ea = (e, t, n, r) => {
    let i = e.length;
    for (let a = 0; a < i; a++) {
      let i = e[a];
      Da(i, t, n, r);
    }
  },
  Da = (e, t, n, r) => {
    if (typeof e == `string`) {
      Oa(e, t, n);
      return;
    }
    if (typeof e == `function`) {
      ka(e, t, n, r);
      return;
    }
    Aa(e, t, n, r);
  },
  Oa = (e, t, n) => {
    let r = e === `` ? t : ja(t, e);
    r.classGroupId = n;
  },
  ka = (e, t, n, r) => {
    if (Ma(e)) {
      Ea(e(r), t, n, r);
      return;
    }
    (t.validators === null && (t.validators = []), t.validators.push(ga(n, e)));
  },
  Aa = (e, t, n, r) => {
    let i = Object.entries(e),
      a = i.length;
    for (let e = 0; e < a; e++) {
      let [a, o] = i[e];
      Ea(o, ja(t, a), n, r);
    }
  },
  ja = (e, t) => {
    let n = e,
      r = t.split(va),
      i = r.length;
    for (let e = 0; e < i; e++) {
      let t = r[e],
        i = n.nextPart.get(t);
      (i || ((i = _a()), n.nextPart.set(t, i)), (n = i));
    }
    return n;
  },
  Ma = (e) => `isThemeGetter` in e && e.isThemeGetter === !0,
  Na = (e) => {
    if (e < 1) return { get: () => void 0, set: () => {} };
    let t = 0,
      n = Object.create(null),
      r = Object.create(null),
      i = (i, a) => {
        ((n[i] = a),
          t++,
          t > e && ((t = 0), (r = n), (n = Object.create(null))));
      };
    return {
      get(e) {
        let t = n[e];
        if (t !== void 0) return t;
        if ((t = r[e]) !== void 0) return (i(e, t), t);
      },
      set(e, t) {
        e in n ? (n[e] = t) : i(e, t);
      },
    };
  },
  Pa = `!`,
  Fa = `:`,
  Ia = [],
  La = (e, t, n, r, i) => ({
    modifiers: e,
    hasImportantModifier: t,
    baseClassName: n,
    maybePostfixModifierPosition: r,
    isExternal: i,
  }),
  Ra = (e) => {
    let { prefix: t, experimentalParseClassName: n } = e,
      r = (e) => {
        let t = [],
          n = 0,
          r = 0,
          i = 0,
          a,
          o = e.length;
        for (let s = 0; s < o; s++) {
          let o = e[s];
          if (n === 0 && r === 0) {
            if (o === Fa) {
              (t.push(e.slice(i, s)), (i = s + 1));
              continue;
            }
            if (o === `/`) {
              a = s;
              continue;
            }
          }
          o === `[`
            ? n++
            : o === `]`
              ? n--
              : o === `(`
                ? r++
                : o === `)` && r--;
        }
        let s = t.length === 0 ? e : e.slice(i),
          c = s,
          l = !1;
        s.endsWith(Pa)
          ? ((c = s.slice(0, -1)), (l = !0))
          : s.startsWith(Pa) && ((c = s.slice(1)), (l = !0));
        let u = a && a > i ? a - i : void 0;
        return La(t, l, c, u);
      };
    if (t) {
      let e = t + Fa,
        n = r;
      r = (t) =>
        t.startsWith(e) ? n(t.slice(e.length)) : La(Ia, !1, t, void 0, !0);
    }
    if (n) {
      let e = r;
      r = (t) => n({ className: t, parseClassName: e });
    }
    return r;
  },
  za = (e) => {
    let t = new Map();
    return (
      e.orderSensitiveModifiers.forEach((e, n) => {
        t.set(e, 1e6 + n);
      }),
      (e) => {
        let n = [],
          r = [];
        for (let i = 0; i < e.length; i++) {
          let a = e[i],
            o = a[0] === `[`,
            s = t.has(a);
          o || s
            ? (r.length > 0 && (r.sort(), n.push(...r), (r = [])), n.push(a))
            : r.push(a);
        }
        return (r.length > 0 && (r.sort(), n.push(...r)), n);
      }
    );
  },
  Ba = (e) => ({
    cache: Na(e.cacheSize),
    parseClassName: Ra(e),
    sortModifiers: za(e),
    ...xa(e),
  }),
  Va = /\s+/,
  Ha = (e, t) => {
    let {
        parseClassName: n,
        getClassGroupId: r,
        getConflictingClassGroupIds: i,
        sortModifiers: a,
      } = t,
      o = [],
      s = e.trim().split(Va),
      c = ``;
    for (let e = s.length - 1; e >= 0; --e) {
      let t = s[e],
        {
          isExternal: l,
          modifiers: u,
          hasImportantModifier: d,
          baseClassName: f,
          maybePostfixModifierPosition: p,
        } = n(t);
      if (l) {
        c = t + (c.length > 0 ? ` ` + c : c);
        continue;
      }
      let m = !!p,
        h = r(m ? f.substring(0, p) : f);
      if (!h) {
        if (!m) {
          c = t + (c.length > 0 ? ` ` + c : c);
          continue;
        }
        if (((h = r(f)), !h)) {
          c = t + (c.length > 0 ? ` ` + c : c);
          continue;
        }
        m = !1;
      }
      let g = u.length === 0 ? `` : u.length === 1 ? u[0] : a(u).join(`:`),
        _ = d ? g + Pa : g,
        v = _ + h;
      if (o.indexOf(v) > -1) continue;
      o.push(v);
      let y = i(h, m);
      for (let e = 0; e < y.length; ++e) {
        let t = y[e];
        o.push(_ + t);
      }
      c = t + (c.length > 0 ? ` ` + c : c);
    }
    return c;
  },
  Ua = (...e) => {
    let t = 0,
      n,
      r,
      i = ``;
    for (; t < e.length; )
      (n = e[t++]) && (r = Wa(n)) && (i && (i += ` `), (i += r));
    return i;
  },
  Wa = (e) => {
    if (typeof e == `string`) return e;
    let t,
      n = ``;
    for (let r = 0; r < e.length; r++)
      e[r] && (t = Wa(e[r])) && (n && (n += ` `), (n += t));
    return n;
  },
  Ga = (e, ...t) => {
    let n,
      r,
      i,
      a,
      o = (o) => (
        (n = Ba(t.reduce((e, t) => t(e), e()))),
        (r = n.cache.get),
        (i = n.cache.set),
        (a = s),
        s(o)
      ),
      s = (e) => {
        let t = r(e);
        if (t) return t;
        let a = Ha(e, n);
        return (i(e, a), a);
      };
    return ((a = o), (...e) => a(Ua(...e)));
  },
  Ka = [],
  qa = (e) => {
    let t = (t) => t[e] || Ka;
    return ((t.isThemeGetter = !0), t);
  },
  Ja = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Ya = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  Xa = /^\d+\/\d+$/,
  Za = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  Qa =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  $a = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  eo = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  to =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  no = (e) => Xa.test(e),
  z = (e) => !!e && !Number.isNaN(Number(e)),
  ro = (e) => !!e && Number.isInteger(Number(e)),
  io = (e) => e.endsWith(`%`) && z(e.slice(0, -1)),
  ao = (e) => Za.test(e),
  oo = () => !0,
  so = (e) => Qa.test(e) && !$a.test(e),
  co = () => !1,
  lo = (e) => eo.test(e),
  uo = (e) => to.test(e),
  fo = (e) => !B(e) && !H(e),
  po = (e) => wo(e, Oo, co),
  B = (e) => Ja.test(e),
  V = (e) => wo(e, ko, so),
  mo = (e) => wo(e, Ao, z),
  ho = (e) => wo(e, Eo, co),
  go = (e) => wo(e, Do, uo),
  _o = (e) => wo(e, Mo, lo),
  H = (e) => Ya.test(e),
  vo = (e) => To(e, ko),
  yo = (e) => To(e, jo),
  bo = (e) => To(e, Eo),
  xo = (e) => To(e, Oo),
  So = (e) => To(e, Do),
  Co = (e) => To(e, Mo, !0),
  wo = (e, t, n) => {
    let r = Ja.exec(e);
    return r ? (r[1] ? t(r[1]) : n(r[2])) : !1;
  },
  To = (e, t, n = !1) => {
    let r = Ya.exec(e);
    return r ? (r[1] ? t(r[1]) : n) : !1;
  },
  Eo = (e) => e === `position` || e === `percentage`,
  Do = (e) => e === `image` || e === `url`,
  Oo = (e) => e === `length` || e === `size` || e === `bg-size`,
  ko = (e) => e === `length`,
  Ao = (e) => e === `number`,
  jo = (e) => e === `family-name`,
  Mo = (e) => e === `shadow`,
  No = () => {
    let e = qa(`color`),
      t = qa(`font`),
      n = qa(`text`),
      r = qa(`font-weight`),
      i = qa(`tracking`),
      a = qa(`leading`),
      o = qa(`breakpoint`),
      s = qa(`container`),
      c = qa(`spacing`),
      l = qa(`radius`),
      u = qa(`shadow`),
      d = qa(`inset-shadow`),
      f = qa(`text-shadow`),
      p = qa(`drop-shadow`),
      m = qa(`blur`),
      h = qa(`perspective`),
      g = qa(`aspect`),
      _ = qa(`ease`),
      v = qa(`animate`),
      y = () => [
        `auto`,
        `avoid`,
        `all`,
        `avoid-page`,
        `page`,
        `left`,
        `right`,
        `column`,
      ],
      b = () => [
        `center`,
        `top`,
        `bottom`,
        `left`,
        `right`,
        `top-left`,
        `left-top`,
        `top-right`,
        `right-top`,
        `bottom-right`,
        `right-bottom`,
        `bottom-left`,
        `left-bottom`,
      ],
      x = () => [...b(), H, B],
      S = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`],
      C = () => [`auto`, `contain`, `none`],
      w = () => [H, B, c],
      T = () => [no, `full`, `auto`, ...w()],
      E = () => [ro, `none`, `subgrid`, H, B],
      D = () => [`auto`, { span: [`full`, ro, H, B] }, ro, H, B],
      O = () => [ro, `auto`, H, B],
      ee = () => [`auto`, `min`, `max`, `fr`, H, B],
      k = () => [
        `start`,
        `end`,
        `center`,
        `between`,
        `around`,
        `evenly`,
        `stretch`,
        `baseline`,
        `center-safe`,
        `end-safe`,
      ],
      A = () => [
        `start`,
        `end`,
        `center`,
        `stretch`,
        `center-safe`,
        `end-safe`,
      ],
      j = () => [`auto`, ...w()],
      M = () => [
        no,
        `auto`,
        `full`,
        `dvw`,
        `dvh`,
        `lvw`,
        `lvh`,
        `svw`,
        `svh`,
        `min`,
        `max`,
        `fit`,
        ...w(),
      ],
      N = () => [e, H, B],
      te = () => [...b(), bo, ho, { position: [H, B] }],
      P = () => [`no-repeat`, { repeat: [``, `x`, `y`, `space`, `round`] }],
      F = () => [`auto`, `cover`, `contain`, xo, po, { size: [H, B] }],
      ne = () => [io, vo, V],
      I = () => [``, `none`, `full`, l, H, B],
      re = () => [``, z, vo, V],
      ie = () => [`solid`, `dashed`, `dotted`, `double`],
      ae = () => [
        `normal`,
        `multiply`,
        `screen`,
        `overlay`,
        `darken`,
        `lighten`,
        `color-dodge`,
        `color-burn`,
        `hard-light`,
        `soft-light`,
        `difference`,
        `exclusion`,
        `hue`,
        `saturation`,
        `color`,
        `luminosity`,
      ],
      L = () => [z, io, bo, ho],
      oe = () => [``, `none`, m, H, B],
      se = () => [`none`, z, H, B],
      ce = () => [`none`, z, H, B],
      le = () => [z, H, B],
      ue = () => [no, `full`, ...w()];
    return {
      cacheSize: 500,
      theme: {
        animate: [`spin`, `ping`, `pulse`, `bounce`],
        aspect: [`video`],
        blur: [ao],
        breakpoint: [ao],
        color: [oo],
        container: [ao],
        "drop-shadow": [ao],
        ease: [`in`, `out`, `in-out`],
        font: [fo],
        "font-weight": [
          `thin`,
          `extralight`,
          `light`,
          `normal`,
          `medium`,
          `semibold`,
          `bold`,
          `extrabold`,
          `black`,
        ],
        "inset-shadow": [ao],
        leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
        perspective: [
          `dramatic`,
          `near`,
          `normal`,
          `midrange`,
          `distant`,
          `none`,
        ],
        radius: [ao],
        shadow: [ao],
        spacing: [`px`, z],
        text: [ao],
        "text-shadow": [ao],
        tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`],
      },
      classGroups: {
        aspect: [{ aspect: [`auto`, `square`, no, B, H, g] }],
        container: [`container`],
        columns: [{ columns: [z, B, H, s] }],
        "break-after": [{ "break-after": y() }],
        "break-before": [{ "break-before": y() }],
        "break-inside": [
          { "break-inside": [`auto`, `avoid`, `avoid-page`, `avoid-column`] },
        ],
        "box-decoration": [{ "box-decoration": [`slice`, `clone`] }],
        box: [{ box: [`border`, `content`] }],
        display: [
          `block`,
          `inline-block`,
          `inline`,
          `flex`,
          `inline-flex`,
          `table`,
          `inline-table`,
          `table-caption`,
          `table-cell`,
          `table-column`,
          `table-column-group`,
          `table-footer-group`,
          `table-header-group`,
          `table-row-group`,
          `table-row`,
          `flow-root`,
          `grid`,
          `inline-grid`,
          `contents`,
          `list-item`,
          `hidden`,
        ],
        sr: [`sr-only`, `not-sr-only`],
        float: [{ float: [`right`, `left`, `none`, `start`, `end`] }],
        clear: [{ clear: [`left`, `right`, `both`, `none`, `start`, `end`] }],
        isolation: [`isolate`, `isolation-auto`],
        "object-fit": [
          { object: [`contain`, `cover`, `fill`, `none`, `scale-down`] },
        ],
        "object-position": [{ object: x() }],
        overflow: [{ overflow: S() }],
        "overflow-x": [{ "overflow-x": S() }],
        "overflow-y": [{ "overflow-y": S() }],
        overscroll: [{ overscroll: C() }],
        "overscroll-x": [{ "overscroll-x": C() }],
        "overscroll-y": [{ "overscroll-y": C() }],
        position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
        inset: [{ inset: T() }],
        "inset-x": [{ "inset-x": T() }],
        "inset-y": [{ "inset-y": T() }],
        start: [{ start: T() }],
        end: [{ end: T() }],
        top: [{ top: T() }],
        right: [{ right: T() }],
        bottom: [{ bottom: T() }],
        left: [{ left: T() }],
        visibility: [`visible`, `invisible`, `collapse`],
        z: [{ z: [ro, `auto`, H, B] }],
        basis: [{ basis: [no, `full`, `auto`, s, ...w()] }],
        "flex-direction": [
          { flex: [`row`, `row-reverse`, `col`, `col-reverse`] },
        ],
        "flex-wrap": [{ flex: [`nowrap`, `wrap`, `wrap-reverse`] }],
        flex: [{ flex: [z, no, `auto`, `initial`, `none`, B] }],
        grow: [{ grow: [``, z, H, B] }],
        shrink: [{ shrink: [``, z, H, B] }],
        order: [{ order: [ro, `first`, `last`, `none`, H, B] }],
        "grid-cols": [{ "grid-cols": E() }],
        "col-start-end": [{ col: D() }],
        "col-start": [{ "col-start": O() }],
        "col-end": [{ "col-end": O() }],
        "grid-rows": [{ "grid-rows": E() }],
        "row-start-end": [{ row: D() }],
        "row-start": [{ "row-start": O() }],
        "row-end": [{ "row-end": O() }],
        "grid-flow": [
          { "grid-flow": [`row`, `col`, `dense`, `row-dense`, `col-dense`] },
        ],
        "auto-cols": [{ "auto-cols": ee() }],
        "auto-rows": [{ "auto-rows": ee() }],
        gap: [{ gap: w() }],
        "gap-x": [{ "gap-x": w() }],
        "gap-y": [{ "gap-y": w() }],
        "justify-content": [{ justify: [...k(), `normal`] }],
        "justify-items": [{ "justify-items": [...A(), `normal`] }],
        "justify-self": [{ "justify-self": [`auto`, ...A()] }],
        "align-content": [{ content: [`normal`, ...k()] }],
        "align-items": [{ items: [...A(), { baseline: [``, `last`] }] }],
        "align-self": [{ self: [`auto`, ...A(), { baseline: [``, `last`] }] }],
        "place-content": [{ "place-content": k() }],
        "place-items": [{ "place-items": [...A(), `baseline`] }],
        "place-self": [{ "place-self": [`auto`, ...A()] }],
        p: [{ p: w() }],
        px: [{ px: w() }],
        py: [{ py: w() }],
        ps: [{ ps: w() }],
        pe: [{ pe: w() }],
        pt: [{ pt: w() }],
        pr: [{ pr: w() }],
        pb: [{ pb: w() }],
        pl: [{ pl: w() }],
        m: [{ m: j() }],
        mx: [{ mx: j() }],
        my: [{ my: j() }],
        ms: [{ ms: j() }],
        me: [{ me: j() }],
        mt: [{ mt: j() }],
        mr: [{ mr: j() }],
        mb: [{ mb: j() }],
        ml: [{ ml: j() }],
        "space-x": [{ "space-x": w() }],
        "space-x-reverse": [`space-x-reverse`],
        "space-y": [{ "space-y": w() }],
        "space-y-reverse": [`space-y-reverse`],
        size: [{ size: M() }],
        w: [{ w: [s, `screen`, ...M()] }],
        "min-w": [{ "min-w": [s, `screen`, `none`, ...M()] }],
        "max-w": [
          { "max-w": [s, `screen`, `none`, `prose`, { screen: [o] }, ...M()] },
        ],
        h: [{ h: [`screen`, `lh`, ...M()] }],
        "min-h": [{ "min-h": [`screen`, `lh`, `none`, ...M()] }],
        "max-h": [{ "max-h": [`screen`, `lh`, ...M()] }],
        "font-size": [{ text: [`base`, n, vo, V] }],
        "font-smoothing": [`antialiased`, `subpixel-antialiased`],
        "font-style": [`italic`, `not-italic`],
        "font-weight": [{ font: [r, H, mo] }],
        "font-stretch": [
          {
            "font-stretch": [
              `ultra-condensed`,
              `extra-condensed`,
              `condensed`,
              `semi-condensed`,
              `normal`,
              `semi-expanded`,
              `expanded`,
              `extra-expanded`,
              `ultra-expanded`,
              io,
              B,
            ],
          },
        ],
        "font-family": [{ font: [yo, B, t] }],
        "fvn-normal": [`normal-nums`],
        "fvn-ordinal": [`ordinal`],
        "fvn-slashed-zero": [`slashed-zero`],
        "fvn-figure": [`lining-nums`, `oldstyle-nums`],
        "fvn-spacing": [`proportional-nums`, `tabular-nums`],
        "fvn-fraction": [`diagonal-fractions`, `stacked-fractions`],
        tracking: [{ tracking: [i, H, B] }],
        "line-clamp": [{ "line-clamp": [z, `none`, H, mo] }],
        leading: [{ leading: [a, ...w()] }],
        "list-image": [{ "list-image": [`none`, H, B] }],
        "list-style-position": [{ list: [`inside`, `outside`] }],
        "list-style-type": [{ list: [`disc`, `decimal`, `none`, H, B] }],
        "text-alignment": [
          { text: [`left`, `center`, `right`, `justify`, `start`, `end`] },
        ],
        "placeholder-color": [{ placeholder: N() }],
        "text-color": [{ text: N() }],
        "text-decoration": [
          `underline`,
          `overline`,
          `line-through`,
          `no-underline`,
        ],
        "text-decoration-style": [{ decoration: [...ie(), `wavy`] }],
        "text-decoration-thickness": [
          { decoration: [z, `from-font`, `auto`, H, V] },
        ],
        "text-decoration-color": [{ decoration: N() }],
        "underline-offset": [{ "underline-offset": [z, `auto`, H, B] }],
        "text-transform": [
          `uppercase`,
          `lowercase`,
          `capitalize`,
          `normal-case`,
        ],
        "text-overflow": [`truncate`, `text-ellipsis`, `text-clip`],
        "text-wrap": [{ text: [`wrap`, `nowrap`, `balance`, `pretty`] }],
        indent: [{ indent: w() }],
        "vertical-align": [
          {
            align: [
              `baseline`,
              `top`,
              `middle`,
              `bottom`,
              `text-top`,
              `text-bottom`,
              `sub`,
              `super`,
              H,
              B,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              `normal`,
              `nowrap`,
              `pre`,
              `pre-line`,
              `pre-wrap`,
              `break-spaces`,
            ],
          },
        ],
        break: [{ break: [`normal`, `words`, `all`, `keep`] }],
        wrap: [{ wrap: [`break-word`, `anywhere`, `normal`] }],
        hyphens: [{ hyphens: [`none`, `manual`, `auto`] }],
        content: [{ content: [`none`, H, B] }],
        "bg-attachment": [{ bg: [`fixed`, `local`, `scroll`] }],
        "bg-clip": [{ "bg-clip": [`border`, `padding`, `content`, `text`] }],
        "bg-origin": [{ "bg-origin": [`border`, `padding`, `content`] }],
        "bg-position": [{ bg: te() }],
        "bg-repeat": [{ bg: P() }],
        "bg-size": [{ bg: F() }],
        "bg-image": [
          {
            bg: [
              `none`,
              {
                linear: [
                  { to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`] },
                  ro,
                  H,
                  B,
                ],
                radial: [``, H, B],
                conic: [ro, H, B],
              },
              So,
              go,
            ],
          },
        ],
        "bg-color": [{ bg: N() }],
        "gradient-from-pos": [{ from: ne() }],
        "gradient-via-pos": [{ via: ne() }],
        "gradient-to-pos": [{ to: ne() }],
        "gradient-from": [{ from: N() }],
        "gradient-via": [{ via: N() }],
        "gradient-to": [{ to: N() }],
        rounded: [{ rounded: I() }],
        "rounded-s": [{ "rounded-s": I() }],
        "rounded-e": [{ "rounded-e": I() }],
        "rounded-t": [{ "rounded-t": I() }],
        "rounded-r": [{ "rounded-r": I() }],
        "rounded-b": [{ "rounded-b": I() }],
        "rounded-l": [{ "rounded-l": I() }],
        "rounded-ss": [{ "rounded-ss": I() }],
        "rounded-se": [{ "rounded-se": I() }],
        "rounded-ee": [{ "rounded-ee": I() }],
        "rounded-es": [{ "rounded-es": I() }],
        "rounded-tl": [{ "rounded-tl": I() }],
        "rounded-tr": [{ "rounded-tr": I() }],
        "rounded-br": [{ "rounded-br": I() }],
        "rounded-bl": [{ "rounded-bl": I() }],
        "border-w": [{ border: re() }],
        "border-w-x": [{ "border-x": re() }],
        "border-w-y": [{ "border-y": re() }],
        "border-w-s": [{ "border-s": re() }],
        "border-w-e": [{ "border-e": re() }],
        "border-w-t": [{ "border-t": re() }],
        "border-w-r": [{ "border-r": re() }],
        "border-w-b": [{ "border-b": re() }],
        "border-w-l": [{ "border-l": re() }],
        "divide-x": [{ "divide-x": re() }],
        "divide-x-reverse": [`divide-x-reverse`],
        "divide-y": [{ "divide-y": re() }],
        "divide-y-reverse": [`divide-y-reverse`],
        "border-style": [{ border: [...ie(), `hidden`, `none`] }],
        "divide-style": [{ divide: [...ie(), `hidden`, `none`] }],
        "border-color": [{ border: N() }],
        "border-color-x": [{ "border-x": N() }],
        "border-color-y": [{ "border-y": N() }],
        "border-color-s": [{ "border-s": N() }],
        "border-color-e": [{ "border-e": N() }],
        "border-color-t": [{ "border-t": N() }],
        "border-color-r": [{ "border-r": N() }],
        "border-color-b": [{ "border-b": N() }],
        "border-color-l": [{ "border-l": N() }],
        "divide-color": [{ divide: N() }],
        "outline-style": [{ outline: [...ie(), `none`, `hidden`] }],
        "outline-offset": [{ "outline-offset": [z, H, B] }],
        "outline-w": [{ outline: [``, z, vo, V] }],
        "outline-color": [{ outline: N() }],
        shadow: [{ shadow: [``, `none`, u, Co, _o] }],
        "shadow-color": [{ shadow: N() }],
        "inset-shadow": [{ "inset-shadow": [`none`, d, Co, _o] }],
        "inset-shadow-color": [{ "inset-shadow": N() }],
        "ring-w": [{ ring: re() }],
        "ring-w-inset": [`ring-inset`],
        "ring-color": [{ ring: N() }],
        "ring-offset-w": [{ "ring-offset": [z, V] }],
        "ring-offset-color": [{ "ring-offset": N() }],
        "inset-ring-w": [{ "inset-ring": re() }],
        "inset-ring-color": [{ "inset-ring": N() }],
        "text-shadow": [{ "text-shadow": [`none`, f, Co, _o] }],
        "text-shadow-color": [{ "text-shadow": N() }],
        opacity: [{ opacity: [z, H, B] }],
        "mix-blend": [
          { "mix-blend": [...ae(), `plus-darker`, `plus-lighter`] },
        ],
        "bg-blend": [{ "bg-blend": ae() }],
        "mask-clip": [
          {
            "mask-clip": [
              `border`,
              `padding`,
              `content`,
              `fill`,
              `stroke`,
              `view`,
            ],
          },
          `mask-no-clip`,
        ],
        "mask-composite": [
          { mask: [`add`, `subtract`, `intersect`, `exclude`] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [z] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": L() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": L() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": N() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": N() }],
        "mask-image-t-from-pos": [{ "mask-t-from": L() }],
        "mask-image-t-to-pos": [{ "mask-t-to": L() }],
        "mask-image-t-from-color": [{ "mask-t-from": N() }],
        "mask-image-t-to-color": [{ "mask-t-to": N() }],
        "mask-image-r-from-pos": [{ "mask-r-from": L() }],
        "mask-image-r-to-pos": [{ "mask-r-to": L() }],
        "mask-image-r-from-color": [{ "mask-r-from": N() }],
        "mask-image-r-to-color": [{ "mask-r-to": N() }],
        "mask-image-b-from-pos": [{ "mask-b-from": L() }],
        "mask-image-b-to-pos": [{ "mask-b-to": L() }],
        "mask-image-b-from-color": [{ "mask-b-from": N() }],
        "mask-image-b-to-color": [{ "mask-b-to": N() }],
        "mask-image-l-from-pos": [{ "mask-l-from": L() }],
        "mask-image-l-to-pos": [{ "mask-l-to": L() }],
        "mask-image-l-from-color": [{ "mask-l-from": N() }],
        "mask-image-l-to-color": [{ "mask-l-to": N() }],
        "mask-image-x-from-pos": [{ "mask-x-from": L() }],
        "mask-image-x-to-pos": [{ "mask-x-to": L() }],
        "mask-image-x-from-color": [{ "mask-x-from": N() }],
        "mask-image-x-to-color": [{ "mask-x-to": N() }],
        "mask-image-y-from-pos": [{ "mask-y-from": L() }],
        "mask-image-y-to-pos": [{ "mask-y-to": L() }],
        "mask-image-y-from-color": [{ "mask-y-from": N() }],
        "mask-image-y-to-color": [{ "mask-y-to": N() }],
        "mask-image-radial": [{ "mask-radial": [H, B] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": L() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": L() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": N() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": N() }],
        "mask-image-radial-shape": [{ "mask-radial": [`circle`, `ellipse`] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: [`side`, `corner`], farthest: [`side`, `corner`] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": b() }],
        "mask-image-conic-pos": [{ "mask-conic": [z] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": L() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": L() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": N() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": N() }],
        "mask-mode": [{ mask: [`alpha`, `luminance`, `match`] }],
        "mask-origin": [
          {
            "mask-origin": [
              `border`,
              `padding`,
              `content`,
              `fill`,
              `stroke`,
              `view`,
            ],
          },
        ],
        "mask-position": [{ mask: te() }],
        "mask-repeat": [{ mask: P() }],
        "mask-size": [{ mask: F() }],
        "mask-type": [{ "mask-type": [`alpha`, `luminance`] }],
        "mask-image": [{ mask: [`none`, H, B] }],
        filter: [{ filter: [``, `none`, H, B] }],
        blur: [{ blur: oe() }],
        brightness: [{ brightness: [z, H, B] }],
        contrast: [{ contrast: [z, H, B] }],
        "drop-shadow": [{ "drop-shadow": [``, `none`, p, Co, _o] }],
        "drop-shadow-color": [{ "drop-shadow": N() }],
        grayscale: [{ grayscale: [``, z, H, B] }],
        "hue-rotate": [{ "hue-rotate": [z, H, B] }],
        invert: [{ invert: [``, z, H, B] }],
        saturate: [{ saturate: [z, H, B] }],
        sepia: [{ sepia: [``, z, H, B] }],
        "backdrop-filter": [{ "backdrop-filter": [``, `none`, H, B] }],
        "backdrop-blur": [{ "backdrop-blur": oe() }],
        "backdrop-brightness": [{ "backdrop-brightness": [z, H, B] }],
        "backdrop-contrast": [{ "backdrop-contrast": [z, H, B] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": [``, z, H, B] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [z, H, B] }],
        "backdrop-invert": [{ "backdrop-invert": [``, z, H, B] }],
        "backdrop-opacity": [{ "backdrop-opacity": [z, H, B] }],
        "backdrop-saturate": [{ "backdrop-saturate": [z, H, B] }],
        "backdrop-sepia": [{ "backdrop-sepia": [``, z, H, B] }],
        "border-collapse": [{ border: [`collapse`, `separate`] }],
        "border-spacing": [{ "border-spacing": w() }],
        "border-spacing-x": [{ "border-spacing-x": w() }],
        "border-spacing-y": [{ "border-spacing-y": w() }],
        "table-layout": [{ table: [`auto`, `fixed`] }],
        caption: [{ caption: [`top`, `bottom`] }],
        transition: [
          {
            transition: [
              ``,
              `all`,
              `colors`,
              `opacity`,
              `shadow`,
              `transform`,
              `none`,
              H,
              B,
            ],
          },
        ],
        "transition-behavior": [{ transition: [`normal`, `discrete`] }],
        duration: [{ duration: [z, `initial`, H, B] }],
        ease: [{ ease: [`linear`, `initial`, _, H, B] }],
        delay: [{ delay: [z, H, B] }],
        animate: [{ animate: [`none`, v, H, B] }],
        backface: [{ backface: [`hidden`, `visible`] }],
        perspective: [{ perspective: [h, H, B] }],
        "perspective-origin": [{ "perspective-origin": x() }],
        rotate: [{ rotate: se() }],
        "rotate-x": [{ "rotate-x": se() }],
        "rotate-y": [{ "rotate-y": se() }],
        "rotate-z": [{ "rotate-z": se() }],
        scale: [{ scale: ce() }],
        "scale-x": [{ "scale-x": ce() }],
        "scale-y": [{ "scale-y": ce() }],
        "scale-z": [{ "scale-z": ce() }],
        "scale-3d": [`scale-3d`],
        skew: [{ skew: le() }],
        "skew-x": [{ "skew-x": le() }],
        "skew-y": [{ "skew-y": le() }],
        transform: [{ transform: [H, B, ``, `none`, `gpu`, `cpu`] }],
        "transform-origin": [{ origin: x() }],
        "transform-style": [{ transform: [`3d`, `flat`] }],
        translate: [{ translate: ue() }],
        "translate-x": [{ "translate-x": ue() }],
        "translate-y": [{ "translate-y": ue() }],
        "translate-z": [{ "translate-z": ue() }],
        "translate-none": [`translate-none`],
        accent: [{ accent: N() }],
        appearance: [{ appearance: [`none`, `auto`] }],
        "caret-color": [{ caret: N() }],
        "color-scheme": [
          {
            scheme: [
              `normal`,
              `dark`,
              `light`,
              `light-dark`,
              `only-dark`,
              `only-light`,
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              `auto`,
              `default`,
              `pointer`,
              `wait`,
              `text`,
              `move`,
              `help`,
              `not-allowed`,
              `none`,
              `context-menu`,
              `progress`,
              `cell`,
              `crosshair`,
              `vertical-text`,
              `alias`,
              `copy`,
              `no-drop`,
              `grab`,
              `grabbing`,
              `all-scroll`,
              `col-resize`,
              `row-resize`,
              `n-resize`,
              `e-resize`,
              `s-resize`,
              `w-resize`,
              `ne-resize`,
              `nw-resize`,
              `se-resize`,
              `sw-resize`,
              `ew-resize`,
              `ns-resize`,
              `nesw-resize`,
              `nwse-resize`,
              `zoom-in`,
              `zoom-out`,
              H,
              B,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": [`fixed`, `content`] }],
        "pointer-events": [{ "pointer-events": [`auto`, `none`] }],
        resize: [{ resize: [`none`, ``, `y`, `x`] }],
        "scroll-behavior": [{ scroll: [`auto`, `smooth`] }],
        "scroll-m": [{ "scroll-m": w() }],
        "scroll-mx": [{ "scroll-mx": w() }],
        "scroll-my": [{ "scroll-my": w() }],
        "scroll-ms": [{ "scroll-ms": w() }],
        "scroll-me": [{ "scroll-me": w() }],
        "scroll-mt": [{ "scroll-mt": w() }],
        "scroll-mr": [{ "scroll-mr": w() }],
        "scroll-mb": [{ "scroll-mb": w() }],
        "scroll-ml": [{ "scroll-ml": w() }],
        "scroll-p": [{ "scroll-p": w() }],
        "scroll-px": [{ "scroll-px": w() }],
        "scroll-py": [{ "scroll-py": w() }],
        "scroll-ps": [{ "scroll-ps": w() }],
        "scroll-pe": [{ "scroll-pe": w() }],
        "scroll-pt": [{ "scroll-pt": w() }],
        "scroll-pr": [{ "scroll-pr": w() }],
        "scroll-pb": [{ "scroll-pb": w() }],
        "scroll-pl": [{ "scroll-pl": w() }],
        "snap-align": [{ snap: [`start`, `end`, `center`, `align-none`] }],
        "snap-stop": [{ snap: [`normal`, `always`] }],
        "snap-type": [{ snap: [`none`, `x`, `y`, `both`] }],
        "snap-strictness": [{ snap: [`mandatory`, `proximity`] }],
        touch: [{ touch: [`auto`, `none`, `manipulation`] }],
        "touch-x": [{ "touch-pan": [`x`, `left`, `right`] }],
        "touch-y": [{ "touch-pan": [`y`, `up`, `down`] }],
        "touch-pz": [`touch-pinch-zoom`],
        select: [{ select: [`none`, `text`, `all`, `auto`] }],
        "will-change": [
          { "will-change": [`auto`, `scroll`, `contents`, `transform`, H, B] },
        ],
        fill: [{ fill: [`none`, ...N()] }],
        "stroke-w": [{ stroke: [z, vo, V, mo] }],
        stroke: [{ stroke: [`none`, ...N()] }],
        "forced-color-adjust": [{ "forced-color-adjust": [`auto`, `none`] }],
      },
      conflictingClassGroups: {
        overflow: [`overflow-x`, `overflow-y`],
        overscroll: [`overscroll-x`, `overscroll-y`],
        inset: [
          `inset-x`,
          `inset-y`,
          `start`,
          `end`,
          `top`,
          `right`,
          `bottom`,
          `left`,
        ],
        "inset-x": [`right`, `left`],
        "inset-y": [`top`, `bottom`],
        flex: [`basis`, `grow`, `shrink`],
        gap: [`gap-x`, `gap-y`],
        p: [`px`, `py`, `ps`, `pe`, `pt`, `pr`, `pb`, `pl`],
        px: [`pr`, `pl`],
        py: [`pt`, `pb`],
        m: [`mx`, `my`, `ms`, `me`, `mt`, `mr`, `mb`, `ml`],
        mx: [`mr`, `ml`],
        my: [`mt`, `mb`],
        size: [`w`, `h`],
        "font-size": [`leading`],
        "fvn-normal": [
          `fvn-ordinal`,
          `fvn-slashed-zero`,
          `fvn-figure`,
          `fvn-spacing`,
          `fvn-fraction`,
        ],
        "fvn-ordinal": [`fvn-normal`],
        "fvn-slashed-zero": [`fvn-normal`],
        "fvn-figure": [`fvn-normal`],
        "fvn-spacing": [`fvn-normal`],
        "fvn-fraction": [`fvn-normal`],
        "line-clamp": [`display`, `overflow`],
        rounded: [
          `rounded-s`,
          `rounded-e`,
          `rounded-t`,
          `rounded-r`,
          `rounded-b`,
          `rounded-l`,
          `rounded-ss`,
          `rounded-se`,
          `rounded-ee`,
          `rounded-es`,
          `rounded-tl`,
          `rounded-tr`,
          `rounded-br`,
          `rounded-bl`,
        ],
        "rounded-s": [`rounded-ss`, `rounded-es`],
        "rounded-e": [`rounded-se`, `rounded-ee`],
        "rounded-t": [`rounded-tl`, `rounded-tr`],
        "rounded-r": [`rounded-tr`, `rounded-br`],
        "rounded-b": [`rounded-br`, `rounded-bl`],
        "rounded-l": [`rounded-tl`, `rounded-bl`],
        "border-spacing": [`border-spacing-x`, `border-spacing-y`],
        "border-w": [
          `border-w-x`,
          `border-w-y`,
          `border-w-s`,
          `border-w-e`,
          `border-w-t`,
          `border-w-r`,
          `border-w-b`,
          `border-w-l`,
        ],
        "border-w-x": [`border-w-r`, `border-w-l`],
        "border-w-y": [`border-w-t`, `border-w-b`],
        "border-color": [
          `border-color-x`,
          `border-color-y`,
          `border-color-s`,
          `border-color-e`,
          `border-color-t`,
          `border-color-r`,
          `border-color-b`,
          `border-color-l`,
        ],
        "border-color-x": [`border-color-r`, `border-color-l`],
        "border-color-y": [`border-color-t`, `border-color-b`],
        translate: [`translate-x`, `translate-y`, `translate-none`],
        "translate-none": [
          `translate`,
          `translate-x`,
          `translate-y`,
          `translate-z`,
        ],
        "scroll-m": [
          `scroll-mx`,
          `scroll-my`,
          `scroll-ms`,
          `scroll-me`,
          `scroll-mt`,
          `scroll-mr`,
          `scroll-mb`,
          `scroll-ml`,
        ],
        "scroll-mx": [`scroll-mr`, `scroll-ml`],
        "scroll-my": [`scroll-mt`, `scroll-mb`],
        "scroll-p": [
          `scroll-px`,
          `scroll-py`,
          `scroll-ps`,
          `scroll-pe`,
          `scroll-pt`,
          `scroll-pr`,
          `scroll-pb`,
          `scroll-pl`,
        ],
        "scroll-px": [`scroll-pr`, `scroll-pl`],
        "scroll-py": [`scroll-pt`, `scroll-pb`],
        touch: [`touch-x`, `touch-y`, `touch-pz`],
        "touch-x": [`touch`],
        "touch-y": [`touch`],
        "touch-pz": [`touch`],
      },
      conflictingClassGroupModifiers: { "font-size": [`leading`] },
      orderSensitiveModifiers: [
        `*`,
        `**`,
        `after`,
        `backdrop`,
        `before`,
        `details-content`,
        `file`,
        `first-letter`,
        `first-line`,
        `marker`,
        `placeholder`,
        `selection`,
      ],
    };
  },
  Po = (
    e,
    {
      cacheSize: t,
      prefix: n,
      experimentalParseClassName: r,
      extend: i = {},
      override: a = {},
    },
  ) => (
    Fo(e, `cacheSize`, t),
    Fo(e, `prefix`, n),
    Fo(e, `experimentalParseClassName`, r),
    Io(e.theme, a.theme),
    Io(e.classGroups, a.classGroups),
    Io(e.conflictingClassGroups, a.conflictingClassGroups),
    Io(e.conflictingClassGroupModifiers, a.conflictingClassGroupModifiers),
    Fo(e, `orderSensitiveModifiers`, a.orderSensitiveModifiers),
    Lo(e.theme, i.theme),
    Lo(e.classGroups, i.classGroups),
    Lo(e.conflictingClassGroups, i.conflictingClassGroups),
    Lo(e.conflictingClassGroupModifiers, i.conflictingClassGroupModifiers),
    Ro(e, i, `orderSensitiveModifiers`),
    e
  ),
  Fo = (e, t, n) => {
    n !== void 0 && (e[t] = n);
  },
  Io = (e, t) => {
    if (t) for (let n in t) Fo(e, n, t[n]);
  },
  Lo = (e, t) => {
    if (t) for (let n in t) Ro(e, t, n);
  },
  Ro = (e, t, n) => {
    let r = t[n];
    r !== void 0 && (e[n] = e[n] ? e[n].concat(r) : r);
  },
  zo = (e, ...t) =>
    typeof e == `function` ? Ga(No, e, ...t) : Ga(() => Po(No(), e), ...t),
  Bo = Ga(No),
  Vo = (e) =>
    aa(e)
      ? Bo
      : zo({
          ...e,
          extend: {
            theme: e.theme,
            classGroups: e.classGroups,
            conflictingClassGroupModifiers: e.conflictingClassGroupModifiers,
            conflictingClassGroups: e.conflictingClassGroups,
            ...e.extend,
          },
        }),
  Ho = (e, t) => {
    let n = ra(e);
    return !n || !(t?.twMerge ?? !0)
      ? n
      : ((!pa.cachedTwMerge || pa.didTwMergeConfigChange) &&
          ((pa.didTwMergeConfigChange = !1),
          (pa.cachedTwMerge = Vo(pa.cachedTwMergeConfig))),
        pa.cachedTwMerge(n) || void 0);
  },
  { createTV: Uo, tv: Wo } = ma(
    (...e) =>
      (t) =>
        Ho(e, t),
  ),
  Go = Wo({
    base: `button`,
    defaultVariants: {
      fullWidth: !1,
      isIconOnly: !1,
      size: `md`,
      variant: `primary`,
    },
    variants: {
      fullWidth: { false: ``, true: `button--full-width` },
      isIconOnly: { true: `button--icon-only` },
      size: { lg: `button--lg`, md: `button--md`, sm: `button--sm` },
      variant: {
        danger: `button--danger`,
        "danger-soft": `button--danger-soft`,
        ghost: `button--ghost`,
        outline: `button--outline`,
        primary: `button--primary`,
        secondary: `button--secondary`,
        tertiary: `button--tertiary`,
      },
    },
  }),
  Ko = Wo({
    base: `close-button`,
    defaultVariants: { variant: `default` },
    variants: { variant: { default: `close-button--default` } },
  }),
  qo = Wo({
    base: `spinner`,
    defaultVariants: { color: `accent`, size: `md` },
    variants: {
      color: {
        accent: `spinner--accent`,
        current: `spinner--current`,
        danger: `spinner--danger`,
        success: `spinner--success`,
        warning: `spinner--warning`,
      },
      size: {
        lg: `spinner--lg`,
        md: `spinner--md`,
        sm: `spinner--sm`,
        xl: `spinner--xl`,
      },
    },
  }),
  Jo = Wo({
    defaultVariants: { placement: `bottom`, variant: `default` },
    slots: {
      action: `toast__action`,
      close: `toast__close-button`,
      content: `toast__content`,
      description: `toast__description`,
      indicator: `toast__indicator`,
      region: `toast-region`,
      title: `toast__title`,
      toast: `toast`,
    },
    variants: {
      placement: {
        bottom: { region: `toast-region--bottom`, toast: `toast--bottom` },
        "bottom end": {
          region: `toast-region--bottom-end`,
          toast: `toast--bottom-end`,
        },
        "bottom start": {
          region: `toast-region--bottom-start`,
          toast: `toast--bottom-start`,
        },
        top: { region: `toast-region--top`, toast: `toast--top` },
        "top end": { region: `toast-region--top-end`, toast: `toast--top-end` },
        "top start": {
          region: `toast-region--top-start`,
          toast: `toast--top-start`,
        },
      },
      variant: {
        accent: { toast: `toast--accent` },
        danger: { toast: `toast--danger` },
        default: { toast: `toast--default` },
        success: { toast: `toast--success` },
        warning: { toast: `toast--warning` },
      },
    },
  }),
  Yo = typeof document < `u` ? w.useLayoutEffect : () => {};
String(Math.round(Math.random() * 1e10));
var Xo = w.createContext(!1);
(typeof window < `u` && window.document && window.document.createElement,
  w.useId);
function Zo() {
  return !1;
}
function Qo() {
  return !0;
}
function $o(e) {
  return () => {};
}
function es() {
  return typeof w.useSyncExternalStore == `function`
    ? w.useSyncExternalStore($o, Zo, Qo)
    : (0, w.useContext)(Xo);
}
typeof window < `u` && window.document && window.document.createElement;
var ts = new Map();
typeof FinalizationRegistry < `u` &&
  new FinalizationRegistry((e) => {
    ts.delete(e);
  });
function ns(e, t) {
  if (e === t) return e;
  let n = ts.get(e);
  if (n) return (n.forEach((e) => (e.current = t)), t);
  let r = ts.get(t);
  return r ? (r.forEach((t) => (t.current = e)), e) : t;
}
function rs(...e) {
  return (...t) => {
    for (let n of e) typeof n == `function` && n(...t);
  };
}
var is = !1;
function as() {
  return is;
}
function os(...e) {
  return e.length === 1 && e[0]
    ? e[0]
    : (t) => {
        let n = !1,
          r = e.map((e) => {
            let r = ss(e, t);
            return ((n ||= typeof r == `function`), r);
          });
        if (n)
          return () => {
            r.forEach((t, n) => {
              typeof t == `function` ? t() : ss(e[n], null);
            });
          };
      };
}
function ss(e, t) {
  if (typeof e == `function`) return e(t);
  e != null && (e.current = t);
}
function cs(e) {
  var t,
    n,
    r = ``;
  if (typeof e == `string` || typeof e == `number`) r += e;
  else if (typeof e == `object`)
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++)
        e[t] && (n = cs(e[t])) && (r && (r += ` `), (r += n));
    } else for (n in e) e[n] && (r && (r += ` `), (r += n));
  return r;
}
function ls() {
  for (var e, t, n = 0, r = ``, i = arguments.length; n < i; n++)
    (e = arguments[n]) && (t = cs(e)) && (r && (r += ` `), (r += t));
  return r;
}
function us(...e) {
  let t = { ...e[0] };
  for (let n = 1; n < e.length; n++) {
    let r = e[n];
    for (let e in r) {
      let n = t[e],
        i = r[e];
      typeof n == `function` &&
      typeof i == `function` &&
      e[0] === `o` &&
      e[1] === `n` &&
      e.charCodeAt(2) >= 65 &&
      e.charCodeAt(2) <= 90
        ? (t[e] = rs(n, i))
        : (e === `className` || e === `UNSAFE_className`) &&
            typeof n == `string` &&
            typeof i == `string`
          ? (t[e] = ls(n, i))
          : e === `id` && n && i
            ? (t.id = ns(n, i))
            : e === `ref` && n && i
              ? (t.ref = os(n, i))
              : (t[e] = i === void 0 ? n : i);
    }
  }
  return t;
}
var ds = new Set([`id`]),
  fs = new Set([
    `aria-label`,
    `aria-labelledby`,
    `aria-describedby`,
    `aria-details`,
  ]),
  ps = new Set([
    `href`,
    `hrefLang`,
    `target`,
    `rel`,
    `download`,
    `ping`,
    `referrerPolicy`,
  ]),
  ms = new Set([`dir`, `lang`, `hidden`, `inert`, `translate`]),
  hs = new Set(
    `onClick.onAuxClick.onContextMenu.onDoubleClick.onMouseDown.onMouseEnter.onMouseLeave.onMouseMove.onMouseOut.onMouseOver.onMouseUp.onTouchCancel.onTouchEnd.onTouchMove.onTouchStart.onPointerDown.onPointerMove.onPointerUp.onPointerCancel.onPointerEnter.onPointerLeave.onPointerOver.onPointerOut.onGotPointerCapture.onLostPointerCapture.onScroll.onWheel.onAnimationStart.onAnimationEnd.onAnimationIteration.onTransitionCancel.onTransitionEnd.onTransitionRun.onTransitionStart`.split(
      `.`,
    ),
  ),
  gs = /^(data-.*)$/;
function _s(e, t = {}) {
  let { labelable: n, isLink: r, global: i, events: a = i, propNames: o } = t,
    s = {};
  for (let t in e)
    Object.prototype.hasOwnProperty.call(e, t) &&
      (ds.has(t) ||
        (n && fs.has(t)) ||
        (r && ps.has(t)) ||
        (i && ms.has(t)) ||
        (a &&
          (hs.has(t) || (t.endsWith(`Capture`) && hs.has(t.slice(0, -7))))) ||
        o?.has(t) ||
        gs.test(t)) &&
      (s[t] = e[t]);
  return s;
}
function vs(e) {
  let t = (0, w.useRef)(null),
    n = (0, w.useRef)(void 0),
    r = (0, w.useCallback)(
      (t) => {
        if (typeof e == `function`) {
          let n = e,
            r = n(t);
          return () => {
            typeof r == `function` ? r() : n(null);
          };
        } else if (e)
          return (
            (e.current = t),
            () => {
              e.current = null;
            }
          );
      },
      [e],
    );
  return (0, w.useMemo)(
    () => ({
      get current() {
        return t.current;
      },
      set current(e) {
        ((t.current = e),
          (n.current &&= (n.current(), void 0)),
          e != null && (n.current = r(e)));
      },
    }),
    [r],
  );
}
var ys = Symbol(`default`);
function bs({ values: e, children: t }) {
  for (let [n, r] of e) t = w.createElement(n.Provider, { value: r }, t);
  return t;
}
function xs(e) {
  let {
    className: t,
    style: n,
    children: r,
    defaultClassName: i,
    defaultChildren: a,
    defaultStyle: o,
    values: s,
    render: c,
  } = e;
  return (0, w.useMemo)(() => {
    let e, l, u;
    return (
      (e = typeof t == `function` ? t({ ...s, defaultClassName: i }) : t),
      (l = typeof n == `function` ? n({ ...s, defaultStyle: o || {} }) : n),
      (u = typeof r == `function` ? r({ ...s, defaultChildren: a }) : (r ?? a)),
      {
        className: e ?? i,
        style: l || o ? { ...o, ...l } : void 0,
        children: u ?? a,
        "data-rac": ``,
        render: c ? (e) => c(e, s) : void 0,
      }
    );
  }, [t, n, r, i, a, o, s, c]);
}
function Ss(e, t) {
  return (n) => t(typeof e == `function` ? e(n) : e, n);
}
function Cs(e, t) {
  let n = (0, w.useContext)(e);
  if (t === null) return null;
  if (n && typeof n == `object` && `slots` in n && n.slots) {
    let e = t || ys;
    if (!n.slots[e]) {
      let e = new Intl.ListFormat().format(
          Object.keys(n.slots).map((e) => `"${e}"`),
        ),
        r = t ? `Invalid slot "${t}".` : `A slot prop is required.`;
      throw Error(`${r} Valid slot names are ${e}.`);
    }
    return n.slots[e];
  }
  return n;
}
function ws(e, t, n) {
  let { ref: r, ...i } = Cs(n, e.slot) || {},
    a = vs((0, w.useMemo)(() => os(t, r), [t, r])),
    o = us(i, e);
  return (
    `style` in i &&
      i.style &&
      `style` in e &&
      e.style &&
      (typeof i.style == `function` || typeof e.style == `function`
        ? (o.style = (t) => {
            let n = typeof i.style == `function` ? i.style(t) : i.style,
              r = { ...t.defaultStyle, ...n },
              a =
                typeof e.style == `function`
                  ? e.style({ ...t, defaultStyle: r })
                  : e.style;
            return { ...r, ...a };
          })
        : (o.style = { ...i.style, ...e.style })),
    [o, a]
  );
}
function Ts(e, t, n) {
  let { render: r, ...i } = t,
    a = (0, w.useRef)(null),
    o = (0, w.useMemo)(() => os(n, a), [n, a]);
  Yo(() => {}, [e, r]);
  let s = { ...i, ref: o };
  return r ? r(s, void 0) : w.createElement(e, s);
}
var Es = {},
  Ds = new Proxy(
    {},
    {
      get(e, t) {
        if (typeof t != `string`) return;
        let n = Es[t];
        return (
          n || ((n = (0, w.forwardRef)(Ts.bind(null, t))), (Es[t] = n)),
          n
        );
      },
    },
  ),
  Os = 7e3,
  ks = null;
function As(e, t = `assertive`, n = Os) {
  ks
    ? ks.announce(e, t, n)
    : ((ks = new js()),
      (
        typeof IS_REACT_ACT_ENVIRONMENT == `boolean`
          ? IS_REACT_ACT_ENVIRONMENT
          : typeof jest < `u`
      )
        ? ks.announce(e, t, n)
        : setTimeout(() => {
            ks?.isAttached() && ks?.announce(e, t, n);
          }, 100));
}
var js = class {
    constructor() {
      ((this.node = null),
        (this.assertiveLog = null),
        (this.politeLog = null),
        typeof document < `u` &&
          ((this.node = document.createElement(`div`)),
          (this.node.dataset.liveAnnouncer = `true`),
          Object.assign(this.node.style, {
            border: 0,
            clip: `rect(0 0 0 0)`,
            clipPath: `inset(50%)`,
            height: `1px`,
            margin: `-1px`,
            overflow: `hidden`,
            padding: 0,
            position: `absolute`,
            width: `1px`,
            whiteSpace: `nowrap`,
          }),
          (this.assertiveLog = this.createLog(`assertive`)),
          this.node.appendChild(this.assertiveLog),
          (this.politeLog = this.createLog(`polite`)),
          this.node.appendChild(this.politeLog),
          document.body.prepend(this.node)));
    }
    isAttached() {
      return this.node?.isConnected;
    }
    createLog(e) {
      let t = document.createElement(`div`);
      return (
        t.setAttribute(`role`, `log`),
        t.setAttribute(`aria-live`, e),
        t.setAttribute(`aria-relevant`, `additions`),
        t
      );
    }
    destroy() {
      this.node &&= (document.body.removeChild(this.node), null);
    }
    announce(e, t = `assertive`, n = Os) {
      if (!this.node) return;
      let r = document.createElement(`div`);
      (typeof e == `object`
        ? (r.setAttribute(`role`, `img`),
          r.setAttribute(`aria-labelledby`, e[`aria-labelledby`]))
        : (r.textContent = e),
        t === `assertive`
          ? this.assertiveLog?.appendChild(r)
          : this.politeLog?.appendChild(r),
        e !== `` &&
          setTimeout(() => {
            r.remove();
          }, n));
    }
    clear(e) {
      this.node &&
        ((!e || e === `assertive`) &&
          this.assertiveLog &&
          (this.assertiveLog.innerHTML = ``),
        (!e || e === `polite`) &&
          this.politeLog &&
          (this.politeLog.innerHTML = ``));
    }
  },
  Ms = (e) => e?.ownerDocument ?? document,
  Ns = (e) =>
    e && `window` in e && e.window === e ? e : Ms(e).defaultView || window;
function Ps(e) {
  return (
    typeof e == `object` &&
    !!e &&
    `nodeType` in e &&
    typeof e.nodeType == `number`
  );
}
function Fs(e) {
  return Ps(e) && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE && `host` in e;
}
function Is(e, t) {
  if (!as()) return t && e ? e.contains(t) : !1;
  if (!e || !t) return !1;
  let n = t;
  for (; n !== null; ) {
    if (n === e) return !0;
    n =
      n.tagName === `SLOT` && n.assignedSlot
        ? n.assignedSlot.parentNode
        : Fs(n)
          ? n.host
          : n.parentNode;
  }
  return !1;
}
var Ls = (e = document) => {
  if (!as()) return e.activeElement;
  let t = e.activeElement;
  for (; t && `shadowRoot` in t && t.shadowRoot?.activeElement; )
    t = t.shadowRoot.activeElement;
  return t;
};
function U(e) {
  if (as() && e.target instanceof Element && e.target.shadowRoot) {
    if (`composedPath` in e) return e.composedPath()[0] ?? null;
    if (`composedPath` in e.nativeEvent)
      return e.nativeEvent.composedPath()[0] ?? null;
  }
  return e.target;
}
function Rs(...e) {
  return (...t) => {
    for (let n of e) typeof n == `function` && n(...t);
  };
}
function zs(e) {
  if (typeof window > `u` || window.navigator == null) return !1;
  let t = window.navigator.userAgentData?.brands;
  return (
    (Array.isArray(t) && t.some((t) => e.test(t.brand))) ||
    e.test(window.navigator.userAgent)
  );
}
function Bs(e) {
  return typeof window < `u` && window.navigator != null
    ? e.test(
        window.navigator.userAgentData?.platform || window.navigator.platform,
      )
    : !1;
}
function Vs(e) {
  let t = null;
  return () => ((t ??= e()), t);
}
var Hs = Vs(function () {
    return Bs(/^Mac/i);
  }),
  Us = Vs(function () {
    return Bs(/^iPhone/i);
  }),
  Ws = Vs(function () {
    return Bs(/^iPad/i) || (Hs() && navigator.maxTouchPoints > 1);
  }),
  Gs = Vs(function () {
    return Us() || Ws();
  }),
  Ks = Vs(function () {
    return zs(/AppleWebKit/i) && !qs();
  }),
  qs = Vs(function () {
    return zs(/Chrome/i);
  }),
  Js = Vs(function () {
    return zs(/Android/i);
  }),
  Ys = Vs(function () {
    return zs(/Firefox/i);
  }),
  Xs = typeof document < `u` ? w.useLayoutEffect : () => {},
  Zs = { prefix: String(Math.round(Math.random() * 1e10)), current: 0 },
  Qs = w.createContext(Zs),
  $s = w.createContext(!1);
typeof window < `u` && window.document && window.document.createElement;
var ec = new WeakMap();
function tc(e = !1) {
  let t = (0, w.useContext)(Qs),
    n = (0, w.useRef)(null);
  if (n.current === null && !e) {
    let e =
      w.default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
        ?.ReactCurrentOwner?.current;
    if (e) {
      let n = ec.get(e);
      n == null
        ? ec.set(e, { id: t.current, state: e.memoizedState })
        : e.memoizedState !== n.state && ((t.current = n.id), ec.delete(e));
    }
    n.current = ++t.current;
  }
  return n.current;
}
function nc(e) {
  let t = (0, w.useContext)(Qs),
    n = tc(!!e),
    r = `react-aria${t.prefix}`;
  return e || `${r}-${n}`;
}
function rc(e) {
  let t = w.useId(),
    [n] = (0, w.useState)(cc()),
    r = n ? `react-aria` : `react-aria${Zs.prefix}`;
  return e || `${r}-${t}`;
}
var ic = typeof w.useId == `function` ? rc : nc;
function ac() {
  return !1;
}
function oc() {
  return !0;
}
function sc(e) {
  return () => {};
}
function cc() {
  return typeof w.useSyncExternalStore == `function`
    ? w.useSyncExternalStore(sc, ac, oc)
    : (0, w.useContext)($s);
}
function lc(e) {
  let [t, n] = (0, w.useState)(e),
    r = (0, w.useRef)(t),
    i = (0, w.useRef)(null),
    a = (0, w.useRef)(() => {
      if (!i.current) return;
      let e = i.current.next();
      if (e.done) {
        i.current = null;
        return;
      }
      r.current === e.value ? a.current() : n(e.value);
    });
  return (
    Xs(() => {
      ((r.current = t), i.current && a.current());
    }),
    [
      t,
      (0, w.useCallback)(
        (e) => {
          ((i.current = e(r.current)), a.current());
        },
        [a],
      ),
    ]
  );
}
var uc = !!(
    typeof window < `u` &&
    window.document &&
    window.document.createElement
  ),
  dc = new Map(),
  fc;
typeof FinalizationRegistry < `u` &&
  (fc = new FinalizationRegistry((e) => {
    dc.delete(e);
  }));
function pc(e) {
  let [t, n] = (0, w.useState)(e),
    r = (0, w.useRef)(null),
    i = ic(t),
    a = (0, w.useRef)(null);
  if ((fc && fc.register(a, i), uc)) {
    let e = dc.get(i);
    e && !e.includes(r) ? e.push(r) : dc.set(i, [r]);
  }
  return (
    Xs(() => {
      let e = i;
      return () => {
        (fc && fc.unregister(a), dc.delete(e));
      };
    }, [i]),
    (0, w.useEffect)(() => {
      let e = r.current;
      return (
        e && n(e),
        () => {
          e && (r.current = null);
        }
      );
    }),
    i
  );
}
function mc(e, t) {
  if (e === t) return e;
  let n = dc.get(e);
  if (n) return (n.forEach((e) => (e.current = t)), t);
  let r = dc.get(t);
  return r ? (r.forEach((t) => (t.current = e)), e) : t;
}
function hc(e = []) {
  let t = pc(),
    [n, r] = lc(t),
    i = (0, w.useCallback)(() => {
      r(function* () {
        (yield t, yield document.getElementById(t) ? t : void 0);
      });
    }, [t, r]);
  return (Xs(i, [t, i, ...e]), n);
}
function gc(...e) {
  return e.length === 1 && e[0]
    ? e[0]
    : (t) => {
        let n = !1,
          r = e.map((e) => {
            let r = _c(e, t);
            return ((n ||= typeof r == `function`), r);
          });
        if (n)
          return () => {
            r.forEach((t, n) => {
              typeof t == `function` ? t() : _c(e[n], null);
            });
          };
      };
}
function _c(e, t) {
  if (typeof e == `function`) return e(t);
  e != null && (e.current = t);
}
function vc(...e) {
  let t = { ...e[0] };
  for (let n = 1; n < e.length; n++) {
    let r = e[n];
    for (let e in r) {
      let n = t[e],
        i = r[e];
      typeof n == `function` &&
      typeof i == `function` &&
      e[0] === `o` &&
      e[1] === `n` &&
      e.charCodeAt(2) >= 65 &&
      e.charCodeAt(2) <= 90
        ? (t[e] = Rs(n, i))
        : (e === `className` || e === `UNSAFE_className`) &&
            typeof n == `string` &&
            typeof i == `string`
          ? (t[e] = ls(n, i))
          : e === `id` && n && i
            ? (t.id = mc(n, i))
            : e === `ref` && n && i
              ? (t.ref = gc(n, i))
              : (t[e] = i === void 0 ? n : i);
    }
  }
  return t;
}
var yc = w.useInsertionEffect ?? Xs;
function bc(e) {
  let t = (0, w.useRef)(null);
  return (
    yc(() => {
      t.current = e;
    }, [e]),
    (0, w.useCallback)((...e) => {
      let n = t.current;
      return n?.(...e);
    }, [])
  );
}
var xc = new Set([
    `Arab`,
    `Syrc`,
    `Samr`,
    `Mand`,
    `Thaa`,
    `Mend`,
    `Nkoo`,
    `Adlm`,
    `Rohg`,
    `Hebr`,
  ]),
  Sc = new Set([
    `ae`,
    `ar`,
    `arc`,
    `bcc`,
    `bqi`,
    `ckb`,
    `dv`,
    `fa`,
    `glk`,
    `he`,
    `ku`,
    `mzn`,
    `nqo`,
    `pnb`,
    `ps`,
    `sd`,
    `ug`,
    `ur`,
    `yi`,
  ]);
function Cc(e) {
  if (Intl.Locale) {
    let t = new Intl.Locale(e).maximize(),
      n = typeof t.getTextInfo == `function` ? t.getTextInfo() : t.textInfo;
    if (n) return n.direction === `rtl`;
    if (t.script) return xc.has(t.script);
  }
  let t = e.split(`-`)[0];
  return Sc.has(t);
}
var wc = Symbol.for(`react-aria.i18n.locale`);
function Tc() {
  let e =
    (typeof window < `u` && window[wc]) ||
    (typeof navigator < `u` &&
      (navigator.language || navigator.userLanguage)) ||
    `en-US`;
  try {
    Intl.DateTimeFormat.supportedLocalesOf([e]);
  } catch {
    e = `en-US`;
  }
  return { locale: e, direction: Cc(e) ? `rtl` : `ltr` };
}
var Ec = Tc(),
  Dc = new Set();
function Oc() {
  Ec = Tc();
  for (let e of Dc) e(Ec);
}
function kc() {
  let e = cc(),
    [t, n] = (0, w.useState)(Ec);
  return (
    (0, w.useEffect)(
      () => (
        Dc.size === 0 && window.addEventListener(`languagechange`, Oc),
        Dc.add(n),
        () => {
          (Dc.delete(n),
            Dc.size === 0 && window.removeEventListener(`languagechange`, Oc));
        }
      ),
      [],
    ),
    e
      ? {
          locale: (typeof window < `u` && window[wc]) || `en-US`,
          direction: `ltr`,
        }
      : t
  );
}
var Ac = w.createContext(null);
function jc() {
  let e = kc();
  return (0, w.useContext)(Ac) || e;
}
var Mc = Symbol.for(`react-aria.i18n.locale`),
  Nc = Symbol.for(`react-aria.i18n.strings`),
  Pc = void 0,
  Fc = class e {
    constructor(e, t = `en-US`) {
      ((this.strings = Object.fromEntries(
        Object.entries(e).filter(([, e]) => e),
      )),
        (this.defaultLocale = t));
    }
    getStringForLocale(e, t) {
      let n = this.getStringsForLocale(t)[e];
      if (!n) throw Error(`Could not find intl message ${e} in ${t} locale`);
      return n;
    }
    getStringsForLocale(e) {
      let t = this.strings[e];
      return (
        t ||
          ((t = Ic(e, this.strings, this.defaultLocale)),
          (this.strings[e] = t)),
        t
      );
    }
    static getGlobalDictionaryForPackage(t) {
      if (typeof window > `u`) return null;
      let n = window[Mc];
      if (Pc === void 0) {
        let t = window[Nc];
        if (!t) return null;
        Pc = {};
        for (let r in t) Pc[r] = new e({ [n]: t[r] }, n);
      }
      let r = Pc?.[t];
      if (!r)
        throw Error(
          `Strings for package "${t}" were not included by LocalizedStringProvider. Please add it to the list passed to createLocalizedStringDictionary.`,
        );
      return r;
    }
  };
function Ic(e, t, n = `en-US`) {
  if (t[e]) return t[e];
  let r = Lc(e);
  if (t[r]) return t[r];
  for (let e in t) if (e.startsWith(r + `-`)) return t[e];
  return t[n];
}
function Lc(e) {
  return Intl.Locale ? new Intl.Locale(e).language : e.split(`-`)[0];
}
var Rc = new Map(),
  zc = new Map(),
  Bc = class {
    constructor(e, t) {
      ((this.locale = e), (this.strings = t));
    }
    format(e, t) {
      let n = this.strings.getStringForLocale(e, this.locale);
      return typeof n == `function` ? n(t, this) : n;
    }
    plural(e, t, n = `cardinal`) {
      let r = t[`=` + e];
      if (r) return typeof r == `function` ? r() : r;
      let i = this.locale + `:` + n,
        a = Rc.get(i);
      return (
        a ||
          ((a = new Intl.PluralRules(this.locale, { type: n })), Rc.set(i, a)),
        (r = t[a.select(e)] || t.other),
        typeof r == `function` ? r() : r
      );
    }
    number(e) {
      let t = zc.get(this.locale);
      return (
        t || ((t = new Intl.NumberFormat(this.locale)), zc.set(this.locale, t)),
        t.format(e)
      );
    }
    select(e, t) {
      let n = e[t] || e.other;
      return typeof n == `function` ? n() : n;
    }
  },
  Vc = new WeakMap();
function Hc(e) {
  let t = Vc.get(e);
  return (t || ((t = new Fc(e)), Vc.set(e, t)), t);
}
function Uc(e, t) {
  return (t && Fc.getGlobalDictionaryForPackage(t)) || Hc(e);
}
function Wc(e, t) {
  let { locale: n } = jc(),
    r = Uc(e, t);
  return (0, w.useMemo)(() => new Bc(n, r), [n, r]);
}
function Gc(e) {
  if (qc()) e.focus({ preventScroll: !0 });
  else {
    let t = Jc(e);
    (e.focus(), Yc(t));
  }
}
var Kc = null;
function qc() {
  if (Kc == null) {
    Kc = !1;
    try {
      document.createElement(`div`).focus({
        get preventScroll() {
          return ((Kc = !0), !0);
        },
      });
    } catch {}
  }
  return Kc;
}
function Jc(e) {
  let t = e.parentNode,
    n = [],
    r = document.scrollingElement || document.documentElement;
  for (; t instanceof HTMLElement && t !== r; )
    ((t.offsetHeight < t.scrollHeight || t.offsetWidth < t.scrollWidth) &&
      n.push({ element: t, scrollTop: t.scrollTop, scrollLeft: t.scrollLeft }),
      (t = t.parentNode));
  return (
    r instanceof HTMLElement &&
      n.push({ element: r, scrollTop: r.scrollTop, scrollLeft: r.scrollLeft }),
    n
  );
}
function Yc(e) {
  for (let { element: t, scrollTop: n, scrollLeft: r } of e)
    ((t.scrollTop = n), (t.scrollLeft = r));
}
function Xc() {
  let e = (0, w.useRef)(new Map()),
    t = (0, w.useCallback)((t, n, r, i) => {
      let a = i?.once
        ? (...t) => {
            (e.current.delete(r), r(...t));
          }
        : r;
      (e.current.set(r, { type: n, eventTarget: t, fn: a, options: i }),
        t.addEventListener(n, a, i));
    }, []),
    n = (0, w.useCallback)((t, n, r, i) => {
      let a = e.current.get(r)?.fn || r;
      (t.removeEventListener(n, a, i), e.current.delete(r));
    }, []),
    r = (0, w.useCallback)(() => {
      e.current.forEach((e, t) => {
        n(e.eventTarget, e.type, t, e.options);
      });
    }, [n]);
  return (
    (0, w.useEffect)(() => r, [r]),
    {
      addGlobalListener: t,
      removeGlobalListener: n,
      removeAllGlobalListeners: r,
    }
  );
}
var Zc = typeof Element < `u` && `checkVisibility` in Element.prototype;
function Qc(e) {
  let t = Ns(e);
  if (!(e instanceof t.HTMLElement) && !(e instanceof t.SVGElement)) return !1;
  let { display: n, visibility: r } = e.style,
    i = n !== `none` && r !== `hidden` && r !== `collapse`;
  if (i) {
    let { getComputedStyle: t } = e.ownerDocument.defaultView,
      { display: n, visibility: r } = t(e);
    i = n !== `none` && r !== `hidden` && r !== `collapse`;
  }
  return i;
}
function $c(e, t) {
  return (
    !e.hasAttribute(`hidden`) &&
    !e.hasAttribute(`data-react-aria-prevent-focus`) &&
    (e.nodeName === `DETAILS` && t && t.nodeName !== `SUMMARY`
      ? e.hasAttribute(`open`)
      : !0)
  );
}
function el(e, t) {
  return Zc
    ? e.checkVisibility({ visibilityProperty: !0 }) &&
        !e.closest(`[data-react-aria-prevent-focus]`)
    : e.nodeName !== `#comment` &&
        Qc(e) &&
        $c(e, t) &&
        (!e.parentElement || el(e.parentElement, e));
}
var tl = [
    `input:not([disabled]):not([type=hidden])`,
    `select:not([disabled])`,
    `textarea:not([disabled])`,
    `button:not([disabled])`,
    `a[href]`,
    `area[href]`,
    `summary`,
    `iframe`,
    `object`,
    `embed`,
    `audio[controls]`,
    `video[controls]`,
    `[contenteditable]:not([contenteditable^="false"])`,
    `permission`,
  ],
  nl = tl.join(`:not([hidden]),`) + `,[tabindex]:not([disabled]):not([hidden])`;
(tl.push(`[tabindex]:not([tabindex="-1"]):not([disabled])`),
  tl.join(`:not([hidden]):not([tabindex="-1"]),`));
function rl(e, t) {
  return e.matches(nl) && !il(e) && (t?.skipVisibilityCheck || el(e));
}
function il(e) {
  let t = e;
  for (; t != null; ) {
    if (t instanceof t.ownerDocument.defaultView.HTMLElement && t.inert)
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function al(e) {
  let t = e;
  return (
    (t.nativeEvent = e),
    (t.isDefaultPrevented = () => t.defaultPrevented),
    (t.isPropagationStopped = () => t.cancelBubble),
    (t.persist = () => {}),
    t
  );
}
function ol(e, t) {
  (Object.defineProperty(e, `target`, { value: t }),
    Object.defineProperty(e, `currentTarget`, { value: t }));
}
function sl(e) {
  let t = (0, w.useRef)({ isFocused: !1, observer: null });
  return (
    Xs(() => {
      let e = t.current;
      return () => {
        e.observer &&= (e.observer.disconnect(), null);
      };
    }, []),
    (0, w.useCallback)(
      (n) => {
        let r = U(n);
        if (
          r instanceof HTMLButtonElement ||
          r instanceof HTMLInputElement ||
          r instanceof HTMLTextAreaElement ||
          r instanceof HTMLSelectElement
        ) {
          t.current.isFocused = !0;
          let n = r;
          (n.addEventListener(
            `focusout`,
            (r) => {
              if (((t.current.isFocused = !1), n.disabled)) {
                let t = al(r);
                e?.(t);
              }
              t.current.observer &&
                (t.current.observer.disconnect(), (t.current.observer = null));
            },
            { once: !0 },
          ),
            (t.current.observer = new MutationObserver(() => {
              if (t.current.isFocused && n.disabled) {
                t.current.observer?.disconnect();
                let e = n === Ls() ? null : Ls();
                (n.dispatchEvent(new FocusEvent(`blur`, { relatedTarget: e })),
                  n.dispatchEvent(
                    new FocusEvent(`focusout`, {
                      bubbles: !0,
                      relatedTarget: e,
                    }),
                  ));
              }
            })),
            t.current.observer.observe(n, {
              attributes: !0,
              attributeFilter: [`disabled`],
            }));
        }
      },
      [e],
    )
  );
}
var cl = !1;
function ll(e) {
  for (; e && !rl(e, { skipVisibilityCheck: !0 }); ) e = e.parentElement;
  let t = Ns(e),
    n = t.document.activeElement;
  if (!n || n === e) return;
  cl = !0;
  let r = !1,
    i = (e) => {
      (U(e) === n || r) && e.stopImmediatePropagation();
    },
    a = (t) => {
      (U(t) === n || r) &&
        (t.stopImmediatePropagation(), !e && !r && ((r = !0), Gc(n), c()));
    },
    o = (t) => {
      (U(t) === e || r) && t.stopImmediatePropagation();
    },
    s = (t) => {
      (U(t) === e || r) &&
        (t.stopImmediatePropagation(), r || ((r = !0), Gc(n), c()));
    };
  (t.addEventListener(`blur`, i, !0),
    t.addEventListener(`focusout`, a, !0),
    t.addEventListener(`focusin`, s, !0),
    t.addEventListener(`focus`, o, !0));
  let c = () => {
      (cancelAnimationFrame(l),
        t.removeEventListener(`blur`, i, !0),
        t.removeEventListener(`focusout`, a, !0),
        t.removeEventListener(`focusin`, s, !0),
        t.removeEventListener(`focus`, o, !0),
        (cl = !1),
        (r = !1));
    },
    l = requestAnimationFrame(c);
  return c;
}
var ul = new Map(),
  dl = new Set();
function fl() {
  if (typeof window > `u`) return;
  function e(e) {
    return `propertyName` in e;
  }
  let t = (t) => {
      let r = U(t);
      if (!e(t) || !r) return;
      let i = ul.get(r);
      (i ||
        ((i = new Set()),
        ul.set(r, i),
        r.addEventListener(`transitioncancel`, n, { once: !0 })),
        i.add(t.propertyName));
    },
    n = (t) => {
      let r = U(t);
      if (!e(t) || !r) return;
      let i = ul.get(r);
      if (
        i &&
        (i.delete(t.propertyName),
        i.size === 0 &&
          (r.removeEventListener(`transitioncancel`, n), ul.delete(r)),
        ul.size === 0)
      ) {
        for (let e of dl) e();
        dl.clear();
      }
    };
  (document.body.addEventListener(`transitionrun`, t),
    document.body.addEventListener(`transitionend`, n));
}
typeof document < `u` &&
  (document.readyState === `loading`
    ? document.addEventListener(`DOMContentLoaded`, fl)
    : fl());
function pl() {
  for (let [e] of ul) `isConnected` in e && !e.isConnected && ul.delete(e);
}
function ml(e) {
  requestAnimationFrame(() => {
    (pl(), ul.size === 0 ? e() : dl.add(e));
  });
}
var hl = `default`,
  gl = ``,
  _l = new WeakMap();
function vl(e) {
  if (Gs()) {
    if (hl === `default`) {
      let t = Ms(e);
      ((gl = t.documentElement.style.webkitUserSelect),
        (t.documentElement.style.webkitUserSelect = `none`));
    }
    hl = `disabled`;
  } else if (e instanceof HTMLElement || e instanceof SVGElement) {
    let t = `userSelect` in e.style ? `userSelect` : `webkitUserSelect`;
    (_l.set(e, e.style[t]), (e.style[t] = `none`));
  }
}
function yl(e) {
  if (Gs()) {
    if (hl !== `disabled`) return;
    ((hl = `restoring`),
      setTimeout(() => {
        ml(() => {
          if (hl === `restoring`) {
            let t = Ms(e);
            (t.documentElement.style.webkitUserSelect === `none` &&
              (t.documentElement.style.webkitUserSelect = gl || ``),
              (gl = ``),
              (hl = `default`));
          }
        });
      }, 300));
  } else if (
    (e instanceof HTMLElement || e instanceof SVGElement) &&
    e &&
    _l.has(e)
  ) {
    let t = _l.get(e),
      n = `userSelect` in e.style ? `userSelect` : `webkitUserSelect`;
    (e.style[n] === `none` && (e.style[n] = t),
      e.getAttribute(`style`) === `` && e.removeAttribute(`style`),
      _l.delete(e));
  }
}
function bl(e) {
  return (
    e?.defaultView?.__webpack_nonce__ || globalThis.__webpack_nonce__ || void 0
  );
}
var xl = new WeakMap();
function Sl(e) {
  let t = e ?? (typeof document < `u` ? document : void 0);
  if (!t) return bl(t);
  if (xl.has(t)) return xl.get(t);
  let n = t.querySelector(`meta[property="csp-nonce"]`),
    r =
      (n && n instanceof Ns(n).HTMLMetaElement && (n.nonce || n.content)) ||
      bl(t) ||
      void 0;
  return (r !== void 0 && xl.set(t, r), r);
}
function Cl(e) {
  return e.pointerType === `` && e.isTrusted
    ? !0
    : Js() && e.pointerType
      ? e.type === `click` && e.buttons === 1
      : e.detail === 0 && !e.pointerType;
}
function wl(e) {
  return (
    (!Js() && e.width === 0 && e.height === 0) ||
    (e.width === 1 &&
      e.height === 1 &&
      e.pressure === 0 &&
      e.detail === 0 &&
      e.pointerType === `mouse`)
  );
}
function Tl(e, t, n = !0) {
  let { metaKey: r, ctrlKey: i, altKey: a, shiftKey: o } = t;
  Ys() &&
    window.event?.type?.startsWith(`key`) &&
    e.target === `_blank` &&
    (Hs() ? (r = !0) : (i = !0));
  let s =
    Ks() && Hs() && !Ws()
      ? new KeyboardEvent(`keydown`, {
          keyIdentifier: `Enter`,
          metaKey: r,
          ctrlKey: i,
          altKey: a,
          shiftKey: o,
        })
      : new MouseEvent(`click`, {
          metaKey: r,
          ctrlKey: i,
          altKey: a,
          shiftKey: o,
          detail: 1,
          bubbles: !0,
          cancelable: !0,
        });
  ((Tl.isOpening = n), Gc(e), e.dispatchEvent(s), (Tl.isOpening = !1));
}
Tl.isOpening = !1;
var El = w.createContext({ register: () => {} });
El.displayName = `PressResponderContext`;
function Dl(e, t) {
  Xs(() => {
    if (e && e.ref && t)
      return (
        (e.ref.current = t.current),
        () => {
          e.ref && (e.ref.current = null);
        }
      );
  });
}
function Ol(e) {
  let t = (0, w.useContext)(El);
  if (t) {
    let { register: n, ref: r, ...i } = t;
    ((e = vc(i, e)), n());
  }
  return (Dl(t, e.ref), e);
}
var kl = class {
    #e;
    constructor(e, t, n, r) {
      this.#e = !0;
      let i = (r?.target ?? n.currentTarget)?.getBoundingClientRect(),
        a,
        o = 0,
        s,
        c = null;
      (n.clientX != null &&
        n.clientY != null &&
        ((s = n.clientX), (c = n.clientY)),
        i &&
          (s != null && c != null
            ? ((a = s - i.left), (o = c - i.top))
            : ((a = i.width / 2), (o = i.height / 2))),
        (this.type = e),
        (this.pointerType = t),
        (this.target = n.currentTarget),
        (this.shiftKey = n.shiftKey),
        (this.metaKey = n.metaKey),
        (this.ctrlKey = n.ctrlKey),
        (this.altKey = n.altKey),
        (this.x = a),
        (this.y = o),
        (this.key = n.key));
    }
    continuePropagation() {
      this.#e = !1;
    }
    get shouldStopPropagation() {
      return this.#e;
    }
  },
  Al = Symbol(`linkClicked`),
  jl = `react-aria-pressable-style`,
  Ml = `data-react-aria-pressable`;
function Nl(e) {
  let {
      onPress: t,
      onPressChange: n,
      onPressStart: r,
      onPressEnd: i,
      onPressUp: a,
      onClick: o,
      isDisabled: s,
      isPressed: c,
      preventFocusOnPress: l,
      shouldCancelOnPointerExit: u,
      allowTextSelectionOnPress: d,
      ref: f,
      ...p
    } = Ol(e),
    [m, h] = (0, w.useState)(!1),
    g = (0, w.useRef)({
      isPressed: !1,
      ignoreEmulatedMouseEvents: !1,
      didFirePressStart: !1,
      isTriggeringEvent: !1,
      activePointerId: null,
      target: null,
      isOverTarget: !1,
      pointerType: null,
      disposables: [],
    }),
    { addGlobalListener: _, removeAllGlobalListeners: v } = Xc(),
    y = (0, w.useCallback)(
      (e, t) => {
        let i = g.current;
        if (s || i.didFirePressStart) return !1;
        let a = !0;
        if (((i.isTriggeringEvent = !0), r)) {
          let n = new kl(`pressstart`, t, e);
          (r(n), (a = n.shouldStopPropagation));
        }
        return (
          n && n(!0),
          (i.isTriggeringEvent = !1),
          (i.didFirePressStart = !0),
          h(!0),
          a
        );
      },
      [s, r, n],
    ),
    b = (0, w.useCallback)(
      (e, r, a = !0) => {
        let o = g.current;
        if (!o.didFirePressStart) return !1;
        ((o.didFirePressStart = !1), (o.isTriggeringEvent = !0));
        let c = !0;
        if (i) {
          let t = new kl(`pressend`, r, e);
          (i(t), (c = t.shouldStopPropagation));
        }
        if ((n && n(!1), h(!1), t && a && !s)) {
          let n = new kl(`press`, r, e);
          (t(n), (c &&= n.shouldStopPropagation));
        }
        return ((o.isTriggeringEvent = !1), c);
      },
      [s, i, n, t],
    ),
    x = bc(b),
    S = bc(
      (0, w.useCallback)(
        (e, t) => {
          let n = g.current;
          if (s) return !1;
          if (a) {
            n.isTriggeringEvent = !0;
            let r = new kl(`pressup`, t, e);
            return (a(r), (n.isTriggeringEvent = !1), r.shouldStopPropagation);
          }
          return !0;
        },
        [s, a],
      ),
    ),
    C = (0, w.useCallback)(
      (e) => {
        let t = g.current;
        if (t.isPressed && t.target) {
          (t.didFirePressStart &&
            t.pointerType != null &&
            b(Il(t.target, e), t.pointerType, !1),
            (t.isPressed = !1),
            (t.isOverTarget = !1),
            (t.activePointerId = null),
            (t.pointerType = null),
            v(),
            d || yl(t.target));
          for (let e of t.disposables) e();
          t.disposables = [];
        }
      },
      [d, v, b],
    ),
    T = bc(C),
    E = (0, w.useCallback)(
      (e) => {
        u && C(e);
      },
      [u, C],
    ),
    D = (0, w.useCallback)(
      (e) => {
        s || o?.(e);
      },
      [s, o],
    ),
    O = (0, w.useCallback)(
      (e, t) => {
        if (!s && o) {
          let n = new MouseEvent(`click`, e);
          (ol(n, t), o(al(n)));
        }
      },
      [s, o],
    ),
    ee = (0, w.useMemo)(() => {
      let e = g.current,
        t = {
          onKeyDown(t) {
            if (
              Fl(t.nativeEvent, t.currentTarget) &&
              Is(t.currentTarget, U(t))
            ) {
              Rl(U(t), t.key) && t.preventDefault();
              let r = !0;
              !e.isPressed &&
                !t.repeat &&
                ((e.target = t.currentTarget),
                (e.isPressed = !0),
                (e.pointerType = `keyboard`),
                (r = y(t, `keyboard`)));
              let i = t.currentTarget;
              (_(
                Ms(t.currentTarget),
                `keyup`,
                Rs((t) => {
                  Fl(t, i) &&
                    !t.repeat &&
                    Is(i, U(t)) &&
                    e.target &&
                    S(Il(e.target, t), `keyboard`);
                }, n),
                !0,
              ),
                r && t.stopPropagation(),
                t.metaKey &&
                  Hs() &&
                  e.metaKeyEvents?.set(t.key, t.nativeEvent));
            } else t.key === `Meta` && (e.metaKeyEvents = new Map());
          },
          onClick(t) {
            if (
              !(t && !Is(t.currentTarget, U(t))) &&
              t &&
              t.button === 0 &&
              !e.isTriggeringEvent &&
              !Tl.isOpening
            ) {
              let n = !0;
              if (
                (s && t.preventDefault(),
                !e.ignoreEmulatedMouseEvents &&
                  !e.isPressed &&
                  (e.pointerType === `virtual` || Cl(t.nativeEvent)))
              ) {
                let e = y(t, `virtual`),
                  r = S(t, `virtual`),
                  i = x(t, `virtual`);
                (D(t), (n = e && r && i));
              } else if (e.isPressed && e.pointerType !== `keyboard`) {
                let r = e.pointerType || t.nativeEvent.pointerType || `virtual`,
                  i = S(Il(t.currentTarget, t), r),
                  a = x(Il(t.currentTarget, t), r, !0);
                ((n = i && a), (e.isOverTarget = !1), D(t), T(t));
              }
              ((e.ignoreEmulatedMouseEvents = !1), n && t.stopPropagation());
            }
          },
        },
        n = (t) => {
          if (e.isPressed && e.target && Fl(t, e.target)) {
            Rl(U(t), t.key) && t.preventDefault();
            let n = U(t),
              r = Is(e.target, n);
            (x(Il(e.target, t), `keyboard`, r),
              r && O(t, e.target),
              v(),
              t.key !== `Enter` &&
                Pl(e.target) &&
                Is(e.target, n) &&
                !t[Al] &&
                ((t[Al] = !0), Tl(e.target, t, !1)),
              (e.isPressed = !1),
              e.metaKeyEvents?.delete(t.key));
          } else if (t.key === `Meta` && e.metaKeyEvents?.size) {
            let t = e.metaKeyEvents;
            e.metaKeyEvents = void 0;
            for (let n of t.values())
              e.target?.dispatchEvent(new KeyboardEvent(`keyup`, n));
          }
        };
      if (typeof PointerEvent < `u`) {
        ((t.onPointerDown = (t) => {
          if (t.button !== 0 || !Is(t.currentTarget, U(t))) return;
          if (wl(t.nativeEvent)) {
            e.pointerType = `virtual`;
            return;
          }
          e.pointerType = t.pointerType;
          let i = !0;
          if (!e.isPressed) {
            ((e.isPressed = !0),
              (e.isOverTarget = !0),
              (e.activePointerId = t.pointerId),
              (e.target = t.currentTarget),
              d || vl(e.target),
              (i = y(t, e.pointerType)));
            let a = U(t);
            (`releasePointerCapture` in a &&
              (`hasPointerCapture` in a
                ? a.hasPointerCapture(t.pointerId) &&
                  a.releasePointerCapture(t.pointerId)
                : a.releasePointerCapture(t.pointerId)),
              _(Ms(t.currentTarget), `pointerup`, n, !1),
              _(Ms(t.currentTarget), `pointercancel`, r, !1));
          }
          i && t.stopPropagation();
        }),
          (t.onMouseDown = (t) => {
            if (Is(t.currentTarget, U(t)) && t.button === 0) {
              if (l) {
                let n = ll(t.target);
                n && e.disposables.push(n);
              }
              t.stopPropagation();
            }
          }),
          (t.onPointerUp = (t) => {
            !Is(t.currentTarget, U(t)) ||
              e.pointerType === `virtual` ||
              (t.button === 0 &&
                !e.isPressed &&
                S(t, e.pointerType || t.pointerType));
          }),
          (t.onPointerEnter = (t) => {
            t.pointerId === e.activePointerId &&
              e.target &&
              !e.isOverTarget &&
              e.pointerType != null &&
              ((e.isOverTarget = !0), y(Il(e.target, t), e.pointerType));
          }),
          (t.onPointerLeave = (t) => {
            t.pointerId === e.activePointerId &&
              e.target &&
              e.isOverTarget &&
              e.pointerType != null &&
              ((e.isOverTarget = !1),
              x(Il(e.target, t), e.pointerType, !1),
              E(t));
          }));
        let n = (t) => {
            if (
              t.pointerId === e.activePointerId &&
              e.isPressed &&
              t.button === 0 &&
              e.target
            ) {
              if (Is(e.target, U(t)) && e.pointerType != null) {
                let n = !1,
                  r = setTimeout(() => {
                    e.isPressed &&
                      e.target instanceof HTMLElement &&
                      (n ? T(t) : (Gc(e.target), e.target.click()));
                  }, 80);
                (_(t.currentTarget, `click`, () => (n = !0), !0),
                  e.disposables.push(() => clearTimeout(r)));
              } else T(t);
              e.isOverTarget = !1;
            }
          },
          r = (e) => {
            T(e);
          };
        t.onDragStart = (e) => {
          Is(e.currentTarget, U(e)) && T(e);
        };
      }
      return t;
    }, [_, s, l, v, d, E, y, D, O]);
  return (
    (0, w.useEffect)(() => {
      if (!f) return;
      let e = Ms(f.current);
      if (!e || !e.head || e.getElementById(jl)) return;
      let t = e.createElement(`style`);
      t.id = jl;
      let n = Sl(e);
      (n && (t.nonce = n),
        (t.textContent = `
@layer {
  [${Ml}] {
    touch-action: pan-x pan-y pinch-zoom;
  }
}
    `.trim()),
        e.head.prepend(t));
    }, [f]),
    (0, w.useEffect)(() => {
      let e = g.current;
      return () => {
        d || yl(e.target ?? void 0);
        for (let t of e.disposables) t();
        e.disposables = [];
      };
    }, [d]),
    { isPressed: c || m, pressProps: vc(p, ee, { [Ml]: !0 }) }
  );
}
function Pl(e) {
  return e.tagName === `A` && e.hasAttribute(`href`);
}
function Fl(e, t) {
  let { key: n, code: r } = e,
    i = t,
    a = i.getAttribute(`role`);
  return (
    (n === `Enter` || n === ` ` || n === `Spacebar` || r === `Space`) &&
    !(
      (i instanceof Ns(i).HTMLInputElement && !Bl(i, n)) ||
      i instanceof Ns(i).HTMLTextAreaElement ||
      i.isContentEditable
    ) &&
    !((a === `link` || (!a && Pl(i))) && n !== `Enter`)
  );
}
function Il(e, t) {
  let n = t.clientX,
    r = t.clientY;
  return {
    currentTarget: e,
    shiftKey: t.shiftKey,
    ctrlKey: t.ctrlKey,
    metaKey: t.metaKey,
    altKey: t.altKey,
    clientX: n,
    clientY: r,
    key: t.key,
  };
}
function Ll(e) {
  return e instanceof HTMLInputElement
    ? !1
    : e instanceof HTMLButtonElement
      ? e.type !== `submit` && e.type !== `reset`
      : !Pl(e);
}
function Rl(e, t) {
  return e instanceof HTMLInputElement ? !Bl(e, t) : Ll(e);
}
var zl = new Set([
  `checkbox`,
  `radio`,
  `range`,
  `color`,
  `file`,
  `image`,
  `button`,
  `submit`,
  `reset`,
]);
function Bl(e, t) {
  return e.type === `checkbox` || e.type === `radio`
    ? t === ` `
    : zl.has(e.type);
}
var W = null,
  Vl = new Set(),
  G = new Map(),
  K = !1,
  q = !1,
  Hl = { Tab: !0, Escape: !0 };
function Ul(e, t) {
  for (let n of Vl) n(e, t);
}
function Wl(e) {
  return !(
    e.metaKey ||
    (!Hs() && e.altKey) ||
    e.ctrlKey ||
    e.key === `Control` ||
    e.key === `Shift` ||
    e.key === `Meta`
  );
}
function Gl(e) {
  ((K = !0), !Tl.isOpening && Wl(e) && ((W = `keyboard`), Ul(`keyboard`, e)));
}
function Kl(e) {
  ((W = `pointer`),
    `pointerType` in e && e.pointerType,
    (e.type === `mousedown` || e.type === `pointerdown`) &&
      ((K = !0), Ul(`pointer`, e)));
}
function ql(e) {
  !Tl.isOpening && Cl(e) && ((K = !0), (W = `virtual`));
}
function Jl(e) {
  let t = Ns(U(e)),
    n = Ms(U(e));
  U(e) === t ||
    U(e) === n ||
    cl ||
    !e.isTrusted ||
    (!K && !q && ((W = `virtual`), Ul(`virtual`, e)), (K = !1), (q = !1));
}
function Yl() {
  cl || ((K = !1), (q = !0));
}
function Xl(e) {
  if (typeof window > `u` || typeof document > `u`) return;
  let t = Ns(e),
    n = Ms(e);
  if (G.get(t)) return;
  let r = t.HTMLElement.prototype.focus;
  ((t.HTMLElement.prototype.focus = function () {
    ((K = !0), r.apply(this, arguments));
  }),
    n.addEventListener(`keydown`, Gl, !0),
    n.addEventListener(`keyup`, Gl, !0),
    n.addEventListener(`click`, ql, !0),
    t.addEventListener(`focus`, Jl, !0),
    t.addEventListener(`blur`, Yl, !1),
    typeof PointerEvent < `u` &&
      (n.addEventListener(`pointerdown`, Kl, !0),
      n.addEventListener(`pointermove`, Kl, !0),
      n.addEventListener(`pointerup`, Kl, !0)),
    t.addEventListener(
      `beforeunload`,
      () => {
        Zl(e);
      },
      { once: !0 },
    ),
    G.set(t, { focus: r }));
}
var Zl = (e, t) => {
  let n = Ns(e),
    r = Ms(e);
  (t && r.removeEventListener(`DOMContentLoaded`, t),
    G.has(n) &&
      ((n.HTMLElement.prototype.focus = G.get(n).focus),
      r.removeEventListener(`keydown`, Gl, !0),
      r.removeEventListener(`keyup`, Gl, !0),
      r.removeEventListener(`click`, ql, !0),
      n.removeEventListener(`focus`, Jl, !0),
      n.removeEventListener(`blur`, Yl, !1),
      typeof PointerEvent < `u` &&
        (r.removeEventListener(`pointerdown`, Kl, !0),
        r.removeEventListener(`pointermove`, Kl, !0),
        r.removeEventListener(`pointerup`, Kl, !0)),
      G.delete(n)));
};
function Ql(e) {
  let t = Ms(e),
    n;
  return (
    t.readyState === `loading`
      ? ((n = () => {
          Xl(e);
        }),
        t.addEventListener(`DOMContentLoaded`, n))
      : Xl(e),
    () => Zl(e, n)
  );
}
typeof document < `u` && Ql();
function $l() {
  return W !== `pointer`;
}
function eu() {
  return W;
}
var tu = new Set([
  `checkbox`,
  `radio`,
  `range`,
  `color`,
  `file`,
  `image`,
  `button`,
  `submit`,
  `reset`,
]);
function nu(e, t, n) {
  let r = n ? U(n) : void 0,
    i = Ms(r),
    a = Ns(r),
    o = a === void 0 ? HTMLInputElement : a.HTMLInputElement,
    s = a === void 0 ? HTMLTextAreaElement : a.HTMLTextAreaElement,
    c = a === void 0 ? HTMLElement : a.HTMLElement,
    l = a === void 0 ? KeyboardEvent : a.KeyboardEvent,
    u = Ls(i);
  return (
    (e =
      e ||
      (u instanceof o && !tu.has(u.type)) ||
      u instanceof s ||
      (u instanceof c && u.isContentEditable)),
    !(e && t === `keyboard` && n instanceof l && !Hl[n.key])
  );
}
function ru(e, t, n) {
  (Xl(),
    (0, w.useEffect)(() => {
      if (n?.enabled === !1) return;
      let t = (t, r) => {
        nu(!!n?.isTextInput, t, r) && e($l());
      };
      return (
        Vl.add(t),
        () => {
          Vl.delete(t);
        }
      );
    }, t));
}
function iu(e) {
  if (!e.isConnected) return;
  let t = Ms(e);
  if (eu() === `virtual`) {
    let n = Ls(t);
    ml(() => {
      let r = Ls(t);
      (r === n || r === t.body) && e.isConnected && Gc(e);
    });
  } else Gc(e);
}
var au = new Set([`id`]),
  ou = new Set([
    `aria-label`,
    `aria-labelledby`,
    `aria-describedby`,
    `aria-details`,
  ]),
  su = new Set([
    `href`,
    `hrefLang`,
    `target`,
    `rel`,
    `download`,
    `ping`,
    `referrerPolicy`,
  ]),
  cu = new Set([`dir`, `lang`, `hidden`, `inert`, `translate`]),
  lu = new Set(
    `onClick.onAuxClick.onContextMenu.onDoubleClick.onMouseDown.onMouseEnter.onMouseLeave.onMouseMove.onMouseOut.onMouseOver.onMouseUp.onTouchCancel.onTouchEnd.onTouchMove.onTouchStart.onPointerDown.onPointerMove.onPointerUp.onPointerCancel.onPointerEnter.onPointerLeave.onPointerOver.onPointerOut.onGotPointerCapture.onLostPointerCapture.onScroll.onWheel.onAnimationStart.onAnimationEnd.onAnimationIteration.onTransitionCancel.onTransitionEnd.onTransitionRun.onTransitionStart`.split(
      `.`,
    ),
  ),
  uu = /^(data-.*)$/;
function du(e, t = {}) {
  let { labelable: n, isLink: r, global: i, events: a = i, propNames: o } = t,
    s = {};
  for (let t in e)
    Object.prototype.hasOwnProperty.call(e, t) &&
      (au.has(t) ||
        (n && ou.has(t)) ||
        (r && su.has(t)) ||
        (i && cu.has(t)) ||
        (a &&
          (lu.has(t) || (t.endsWith(`Capture`) && lu.has(t.slice(0, -7))))) ||
        o?.has(t) ||
        uu.test(t)) &&
      (s[t] = e[t]);
  return s;
}
function fu(e) {
  let { isDisabled: t, onFocus: n, onBlur: r, onFocusChange: i } = e,
    a = (0, w.useCallback)(
      (e) => {
        if (U(e) === e.currentTarget) return (r && r(e), i && i(!1), !0);
      },
      [r, i],
    ),
    o = sl(a),
    s = (0, w.useCallback)(
      (e) => {
        let t = U(e),
          r = Ms(t),
          a = r ? Ls(r) : Ls();
        t === e.currentTarget && t === a && (n && n(e), i && i(!0), o(e));
      },
      [i, n, o],
    );
  return {
    focusProps: {
      onFocus: !t && (n || i || r) ? s : void 0,
      onBlur: !t && (r || i) ? a : void 0,
    },
  };
}
function pu(e) {
  if (!e) return;
  let t = !0;
  return (n) => {
    (e({
      ...n,
      preventDefault() {
        n.preventDefault();
      },
      isDefaultPrevented() {
        return n.isDefaultPrevented();
      },
      stopPropagation() {
        t = !0;
      },
      continuePropagation() {
        t = !1;
      },
      isPropagationStopped() {
        return t;
      },
    }),
      t && n.stopPropagation());
  };
}
function mu(e) {
  return {
    keyboardProps: e.isDisabled
      ? {}
      : { onKeyDown: pu(e.onKeyDown), onKeyUp: pu(e.onKeyUp) },
  };
}
var hu = w.createContext(null);
function gu(e) {
  let t = (0, w.useContext)(hu) || {};
  Dl(t, e);
  let { ref: n, ...r } = t;
  return r;
}
function _u(e, t) {
  let { focusProps: n } = fu(e),
    { keyboardProps: r } = mu(e),
    i = vc(n, r),
    a = gu(t),
    o = e.isDisabled ? {} : a,
    s = (0, w.useRef)(e.autoFocus);
  (0, w.useEffect)(() => {
    (s.current && t.current && iu(t.current), (s.current = !1));
  }, [t]);
  let c = e.excludeFromTabOrder ? -1 : 0;
  return (
    e.isDisabled && (c = void 0),
    { focusableProps: vc({ ...i, tabIndex: c }, o) }
  );
}
function vu(e) {
  let {
      isDisabled: t,
      onBlurWithin: n,
      onFocusWithin: r,
      onFocusWithinChange: i,
    } = e,
    a = (0, w.useRef)({ isFocusWithin: !1 }),
    { addGlobalListener: o, removeAllGlobalListeners: s } = Xc(),
    c = (0, w.useCallback)(
      (e) => {
        Is(e.currentTarget, U(e)) &&
          a.current.isFocusWithin &&
          !Is(e.currentTarget, e.relatedTarget) &&
          ((a.current.isFocusWithin = !1), s(), n && n(e), i && i(!1));
      },
      [n, i, a, s],
    ),
    l = sl(c),
    u = (0, w.useCallback)(
      (e) => {
        if (!Is(e.currentTarget, U(e))) return;
        let t = U(e),
          n = Ms(t),
          s = Ls(n);
        if (!a.current.isFocusWithin && s === t) {
          (r && r(e), i && i(!0), (a.current.isFocusWithin = !0), l(e));
          let t = e.currentTarget;
          o(
            n,
            `focus`,
            (e) => {
              let r = U(e);
              if (a.current.isFocusWithin && !Is(t, r)) {
                let e = new n.defaultView.FocusEvent(`blur`, {
                  relatedTarget: r,
                });
                (ol(e, t), c(al(e)));
              }
            },
            { capture: !0 },
          );
        }
      },
      [r, i, l, o, c],
    );
  return t
    ? { focusWithinProps: { onFocus: void 0, onBlur: void 0 } }
    : { focusWithinProps: { onFocus: u, onBlur: c } };
}
function yu(e = {}) {
  let { autoFocus: t = !1, isTextInput: n, within: r } = e,
    i = (0, w.useRef)({ isFocused: !1, isFocusVisible: t || $l() }),
    [a, o] = (0, w.useState)(!1),
    [s, c] = (0, w.useState)(
      () => i.current.isFocused && i.current.isFocusVisible,
    ),
    l = (0, w.useCallback)(
      () => c(i.current.isFocused && i.current.isFocusVisible),
      [],
    ),
    u = (0, w.useCallback)(
      (e) => {
        ((i.current.isFocused = e),
          (i.current.isFocusVisible = $l()),
          o(e),
          l());
      },
      [l],
    );
  ru(
    (e) => {
      ((i.current.isFocusVisible = e), l());
    },
    [n, a],
    { enabled: a, isTextInput: n },
  );
  let { focusProps: d } = fu({ isDisabled: r, onFocusChange: u }),
    { focusWithinProps: f } = vu({ isDisabled: !r, onFocusWithinChange: u });
  return { isFocused: a, isFocusVisible: s, focusProps: r ? f : d };
}
var bu = !1,
  xu = 0;
function Su() {
  ((bu = !0),
    setTimeout(() => {
      bu = !1;
    }, 500));
}
function Cu(e) {
  e.pointerType === `touch` && Su();
}
function wu() {
  let e = Ms(null);
  if (e !== void 0)
    return (
      xu === 0 &&
        typeof PointerEvent < `u` &&
        e.addEventListener(`pointerup`, Cu),
      xu++,
      () => {
        (xu--,
          !(xu > 0) &&
            typeof PointerEvent < `u` &&
            e.removeEventListener(`pointerup`, Cu));
      }
    );
}
function Tu(e) {
  let { onHoverStart: t, onHoverChange: n, onHoverEnd: r, isDisabled: i } = e,
    [a, o] = (0, w.useState)(!1),
    s = (0, w.useRef)({
      isHovered: !1,
      ignoreEmulatedMouseEvents: !1,
      pointerType: ``,
      target: null,
    }).current;
  (0, w.useEffect)(wu, []);
  let { addGlobalListener: c, removeAllGlobalListeners: l } = Xc(),
    { hoverProps: u, triggerHoverEnd: d } = (0, w.useMemo)(() => {
      let e = (e, r) => {
          if (
            ((s.pointerType = r),
            i || r === `touch` || s.isHovered || !Is(e.currentTarget, U(e)))
          )
            return;
          s.isHovered = !0;
          let l = e.currentTarget;
          ((s.target = l),
            c(
              Ms(U(e)),
              `pointerover`,
              (e) => {
                s.isHovered &&
                  s.target &&
                  !Is(s.target, U(e)) &&
                  a(e, e.pointerType);
              },
              { capture: !0 },
            ),
            t && t({ type: `hoverstart`, target: l, pointerType: r }),
            n && n(!0),
            o(!0));
        },
        a = (e, t) => {
          let i = s.target;
          ((s.pointerType = ``),
            (s.target = null),
            !(t === `touch` || !s.isHovered || !i) &&
              ((s.isHovered = !1),
              l(),
              r && r({ type: `hoverend`, target: i, pointerType: t }),
              n && n(!1),
              o(!1)));
        },
        u = {};
      return (
        typeof PointerEvent < `u` &&
          ((u.onPointerEnter = (t) => {
            (bu && t.pointerType === `mouse`) || e(t, t.pointerType);
          }),
          (u.onPointerLeave = (e) => {
            !i && Is(e.currentTarget, U(e)) && a(e, e.pointerType);
          })),
        { hoverProps: u, triggerHoverEnd: a }
      );
    }, [t, n, r, i, s, c, l]);
  return (
    (0, w.useEffect)(() => {
      i && d({ currentTarget: s.target }, s.pointerType);
    }, [i]),
    { hoverProps: u, isHovered: a }
  );
}
typeof HTMLTemplateElement < `u` &&
  (Object.defineProperty(HTMLTemplateElement.prototype, `firstChild`, {
    configurable: !0,
    enumerable: !0,
    get: function () {
      return this.content.firstChild;
    },
  }),
  Object.defineProperty(HTMLTemplateElement.prototype, `appendChild`, {
    configurable: !0,
    enumerable: !0,
    value: function (e) {
      return this.content.appendChild(e);
    },
  }),
  Object.defineProperty(HTMLTemplateElement.prototype, `removeChild`, {
    configurable: !0,
    enumerable: !0,
    value: function (e) {
      return this.content.removeChild(e);
    },
  }),
  Object.defineProperty(HTMLTemplateElement.prototype, `insertBefore`, {
    configurable: !0,
    enumerable: !0,
    value: function (e, t) {
      return this.content.insertBefore(e, t);
    },
  }));
var Eu = (0, w.createContext)(!1);
function Du(e) {
  let t = (t, n) => ((0, w.useContext)(Eu) ? null : e(t, n));
  return ((t.displayName = e.displayName || e.name), (0, w.forwardRef)(t));
}
var Ou = s((e) => {
    var t = p();
    function n(e, t) {
      return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
    }
    var r = typeof Object.is == `function` ? Object.is : n,
      i = t.useState,
      a = t.useEffect,
      o = t.useLayoutEffect,
      s = t.useDebugValue;
    function c(e, t) {
      var n = t(),
        r = i({ inst: { value: n, getSnapshot: t } }),
        c = r[0].inst,
        u = r[1];
      return (
        o(
          function () {
            ((c.value = n), (c.getSnapshot = t), l(c) && u({ inst: c }));
          },
          [e, n, t],
        ),
        a(
          function () {
            return (
              l(c) && u({ inst: c }),
              e(function () {
                l(c) && u({ inst: c });
              })
            );
          },
          [e],
        ),
        s(n),
        n
      );
    }
    function l(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var n = t();
        return !r(e, n);
      } catch {
        return !0;
      }
    }
    function u(e, t) {
      return t();
    }
    var d =
      typeof window > `u` ||
      window.document === void 0 ||
      window.document.createElement === void 0
        ? u
        : c;
    e.useSyncExternalStore =
      t.useSyncExternalStore === void 0 ? d : t.useSyncExternalStore;
  }),
  ku = s((e, t) => {
    t.exports = Ou();
  });
function Au(e, t) {
  let {
      elementType: n = `button`,
      isDisabled: r,
      onPress: i,
      onPressStart: a,
      onPressEnd: o,
      onPressUp: s,
      onPressChange: c,
      preventFocusOnPress: l,
      allowFocusWhenDisabled: u,
      onClick: d,
      href: f,
      target: p,
      rel: m,
      type: h = `button`,
    } = e,
    g;
  g =
    n === `button`
      ? {
          type: h,
          disabled: r,
          form: e.form,
          formAction: e.formAction,
          formEncType: e.formEncType,
          formMethod: e.formMethod,
          formNoValidate: e.formNoValidate,
          formTarget: e.formTarget,
          name: e.name,
          value: e.value,
        }
      : {
          role: `button`,
          href: n === `a` && !r ? f : void 0,
          target: n === `a` ? p : void 0,
          type: n === `input` ? h : void 0,
          disabled: n === `input` ? r : void 0,
          "aria-disabled": !r || n === `input` ? void 0 : r,
          rel: n === `a` ? m : void 0,
        };
  let { pressProps: _, isPressed: v } = Nl({
      onPressStart: a,
      onPressEnd: o,
      onPressChange: c,
      onPress: i,
      onPressUp: s,
      onClick: d,
      isDisabled: r,
      preventFocusOnPress: l,
      ref: t,
    }),
    { focusableProps: y } = _u(e, t);
  u && (y.tabIndex = r ? -1 : y.tabIndex);
  let b = vc(y, _, du(e, { labelable: !0 }));
  return {
    isPressed: v,
    buttonProps: vc(g, b, {
      "aria-haspopup": e[`aria-haspopup`],
      "aria-expanded": e[`aria-expanded`],
      "aria-controls": e[`aria-controls`],
      "aria-pressed": e[`aria-pressed`],
      "aria-current": e[`aria-current`],
      "aria-disabled": e[`aria-disabled`],
    }),
  };
}
var ju = (0, w.createContext)({});
function Mu() {
  return (0, w.useContext)(ju) ?? {};
}
var Nu = ku(),
  Pu = 1,
  Fu = Symbol.for(`react-aria-landmark-manager`);
function Iu(e) {
  return (
    document.addEventListener(`react-aria-landmark-manager-change`, e),
    () => document.removeEventListener(`react-aria-landmark-manager-change`, e)
  );
}
function Lu() {
  if (typeof document > `u`) return null;
  let e = document[Fu];
  return e && e.version >= Pu
    ? e
    : ((document[Fu] = new zu()),
      document.dispatchEvent(
        new CustomEvent(`react-aria-landmark-manager-change`),
      ),
      document[Fu]);
}
function Ru() {
  return (0, Nu.useSyncExternalStore)(Iu, Lu, Lu);
}
var zu = class {
  constructor() {
    ((this.landmarks = []),
      (this.isListening = !1),
      (this.refCount = 0),
      (this.version = Pu),
      (this.f6Handler = this.f6Handler.bind(this)),
      (this.focusinHandler = this.focusinHandler.bind(this)),
      (this.focusoutHandler = this.focusoutHandler.bind(this)));
  }
  setupIfNeeded() {
    this.isListening ||=
      (document.addEventListener(`keydown`, this.f6Handler, { capture: !0 }),
      document.addEventListener(`focusin`, this.focusinHandler, {
        capture: !0,
      }),
      document.addEventListener(`focusout`, this.focusoutHandler, {
        capture: !0,
      }),
      !0);
  }
  teardownIfNeeded() {
    !this.isListening ||
      this.landmarks.length > 0 ||
      this.refCount > 0 ||
      (document.removeEventListener(`keydown`, this.f6Handler, { capture: !0 }),
      document.removeEventListener(`focusin`, this.focusinHandler, {
        capture: !0,
      }),
      document.removeEventListener(`focusout`, this.focusoutHandler, {
        capture: !0,
      }),
      (this.isListening = !1));
  }
  focusLandmark(e, t) {
    this.landmarks.find((t) => t.ref.current === e)?.focus?.(t);
  }
  getLandmarksByRole(e) {
    return new Set(this.landmarks.filter((t) => t.role === e));
  }
  getLandmarkByRole(e) {
    return this.landmarks.find((t) => t.role === e);
  }
  addLandmark(e) {
    if (
      (this.setupIfNeeded(),
      this.landmarks.find((t) => t.ref === e.ref) || !e.ref.current)
    )
      return;
    if (
      (this.landmarks.filter((e) => e.role === `main`).length,
      this.landmarks.length === 0)
    ) {
      ((this.landmarks = [e]), this.checkLabels(e.role));
      return;
    }
    let t = 0,
      n = this.landmarks.length - 1;
    for (; t <= n; ) {
      let r = Math.floor((t + n) / 2),
        i = e.ref.current.compareDocumentPosition(
          this.landmarks[r].ref.current,
        );
      i & Node.DOCUMENT_POSITION_PRECEDING ||
      i & Node.DOCUMENT_POSITION_CONTAINS
        ? (t = r + 1)
        : (n = r - 1);
    }
    (this.landmarks.splice(t, 0, e), this.checkLabels(e.role));
  }
  updateLandmark(e) {
    let t = this.landmarks.findIndex((t) => t.ref === e.ref);
    t >= 0 &&
      ((this.landmarks[t] = { ...this.landmarks[t], ...e }),
      this.checkLabels(this.landmarks[t].role));
  }
  removeLandmark(e) {
    ((this.landmarks = this.landmarks.filter((t) => t.ref !== e)),
      this.teardownIfNeeded());
  }
  checkLabels(e) {
    let t = this.getLandmarksByRole(e);
    t.size > 1 && [...t].filter((e) => !e.label).length;
  }
  closestLandmark(e) {
    let t = new Map(this.landmarks.map((e) => [e.ref.current, e])),
      n = e;
    for (; n && !t.has(n) && n !== document.body && n.parentElement; )
      n = n.parentElement;
    return t.get(n);
  }
  getNextLandmark(e, { backward: t }) {
    let n = this.closestLandmark(e),
      r = t ? this.landmarks.length - 1 : 0;
    n && (r = this.landmarks.indexOf(n) + (t ? -1 : 1));
    let i = () => {
      if (r < 0) {
        if (
          !e.dispatchEvent(
            new CustomEvent(`react-aria-landmark-navigation`, {
              detail: { direction: `backward` },
              bubbles: !0,
              cancelable: !0,
            }),
          )
        )
          return !0;
        r = this.landmarks.length - 1;
      } else if (r >= this.landmarks.length) {
        if (
          !e.dispatchEvent(
            new CustomEvent(`react-aria-landmark-navigation`, {
              detail: { direction: `forward` },
              bubbles: !0,
              cancelable: !0,
            }),
          )
        )
          return !0;
        r = 0;
      }
      return r < 0 || r >= this.landmarks.length;
    };
    if (i()) return;
    let a = r;
    for (; this.landmarks[r].ref.current?.closest(`[aria-hidden=true]`); ) {
      if (((r += t ? -1 : 1), i())) return;
      if (r === a) break;
    }
    return this.landmarks[r];
  }
  f6Handler(e) {
    e.key === `F6` &&
      (e.altKey ? this.focusMain() : this.navigate(U(e), e.shiftKey)) &&
      (e.preventDefault(), e.stopPropagation());
  }
  focusMain() {
    let e = this.getLandmarkByRole(`main`);
    return e && e.ref.current && e.ref.current.isConnected
      ? (this.focusLandmark(e.ref.current, `forward`), !0)
      : !1;
  }
  navigate(e, t) {
    let n = this.getNextLandmark(e, { backward: t });
    if (!n) return !1;
    if (n.lastFocused) {
      let e = n.lastFocused;
      if (Is(document.body, e)) return (e.focus(), !0);
    }
    return n.ref.current && n.ref.current.isConnected
      ? (this.focusLandmark(n.ref.current, t ? `backward` : `forward`), !0)
      : !1;
  }
  focusinHandler(e) {
    let t = this.closestLandmark(U(e));
    t &&
      t.ref.current !== U(e) &&
      this.updateLandmark({ ref: t.ref, lastFocused: U(e) });
    let n = e.relatedTarget;
    if (n) {
      let e = this.closestLandmark(n);
      e && e.ref.current === n && e.blur();
    }
  }
  focusoutHandler(e) {
    let t = U(e),
      n = e.relatedTarget;
    if (!n || n === document) {
      let e = this.closestLandmark(t);
      e && e.ref.current === t && e.blur();
    }
  }
  createLandmarkController() {
    let e = this;
    return (
      e.refCount++,
      e.setupIfNeeded(),
      {
        navigate(t, n) {
          let r = n?.from || document.activeElement;
          return e.navigate(r, t === `backward`);
        },
        focusNext(t) {
          let n = t?.from || document.activeElement;
          return e.navigate(n, !1);
        },
        focusPrevious(t) {
          let n = t?.from || document.activeElement;
          return e.navigate(n, !0);
        },
        focusMain() {
          return e.focusMain();
        },
        dispose() {
          e &&= (e.refCount--, e.teardownIfNeeded(), null);
        },
      }
    );
  }
  registerLandmark(e) {
    return (
      this.landmarks.find((t) => t.ref === e.ref)
        ? this.updateLandmark(e)
        : this.addLandmark(e),
      () => this.removeLandmark(e.ref)
    );
  }
};
function Bu(e, t) {
  let { role: n, "aria-label": r, "aria-labelledby": i, focus: a } = e,
    o = Ru(),
    s = r || i,
    [c, l] = (0, w.useState)(!1),
    u = (0, w.useCallback)(() => {
      l(!0);
    }, [l]),
    d = (0, w.useCallback)(() => {
      l(!1);
    }, [l]);
  return (
    Xs(() => {
      if (o)
        return o.registerLandmark({
          ref: t,
          label: s,
          role: n,
          focus: a || u,
          blur: d,
        });
    }, [o, s, t, n, a, u, d]),
    (0, w.useEffect)(() => {
      c && t.current?.focus();
    }, [c, t]),
    {
      landmarkProps: {
        role: n,
        tabIndex: c ? -1 : void 0,
        "aria-label": r,
        "aria-labelledby": i,
      },
    }
  );
}
var Vu = {};
Vu = {
  close: `إغلاق`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{625}\u{634}\u{639}\u{627}\u{631}`, other: () => `${t.number(e.count)} \u{625}\u{634}\u{639}\u{627}\u{631}\u{627}\u{62A}` })}.`,
};
var Hu = {};
Hu = {
  close: `Затвори`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{438}\u{437}\u{432}\u{435}\u{441}\u{442}\u{438}\u{435}`, other: () => `${t.number(e.count)} \u{438}\u{437}\u{432}\u{435}\u{441}\u{442}\u{438}\u{44F}` })}.`,
};
var Uu = {};
Uu = {
  close: `Zavřít`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} ozn\xe1men\xed`, other: () => `${t.number(e.count)} ozn\xe1men\xed` })}.`,
};
var Wu = {};
Wu = {
  close: `Luk`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} besked`, other: () => `${t.number(e.count)} beskeder` })}.`,
};
var Gu = {};
Gu = {
  close: `Schließen`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} Benachrichtigung`, other: () => `${t.number(e.count)} Benachrichtigungen` })}.`,
};
var Ku = {};
Ku = {
  close: `Κλείσιμο`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{3B5}\u{3B9}\u{3B4}\u{3BF}\u{3C0}\u{3BF}\u{3AF}\u{3B7}\u{3C3}\u{3B7}`, other: () => `${t.number(e.count)} \u{3B5}\u{3B9}\u{3B4}\u{3BF}\u{3C0}\u{3BF}\u{3B9}\u{3AE}\u{3C3}\u{3B5}\u{3B9}\u{3C2}` })}.`,
};
var qu = {};
qu = {
  close: `Close`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} notification`, other: () => `${t.number(e.count)} notifications` })}.`,
};
var J = {};
J = {
  close: `Cerrar`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} notificaci\xf3n`, other: () => `${t.number(e.count)} notificaciones` })}.`,
};
var Ju = {};
Ju = {
  close: `Sule`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} teatis`, other: () => `${t.number(e.count)} teatist` })}.`,
};
var Yu = {};
Yu = {
  close: `Sulje`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} ilmoitus`, other: () => `${t.number(e.count)} ilmoitusta` })}.`,
};
var Xu = {};
Xu = {
  close: `Fermer`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} notification`, other: () => `${t.number(e.count)} notifications` })}.`,
};
var Zu = {};
Zu = {
  close: `סגור`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{5D4}\u{5EA}\u{5E8}\u{5D0}\u{5D4}`, other: () => `${t.number(e.count)} \u{5D4}\u{5EA}\u{5E8}\u{5D0}\u{5D5}\u{5EA}` })}.`,
};
var Qu = {};
Qu = {
  close: `Zatvori`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} obavijest`, other: () => `${t.number(e.count)} obavijesti` })}.`,
};
var $u = {};
$u = {
  close: `Bezárás`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \xe9rtes\xedt\xe9s`, other: () => `${t.number(e.count)} \xe9rtes\xedt\xe9s` })}.`,
};
var ed = {};
ed = {
  close: `Chiudi`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} notifica`, other: () => `${t.number(e.count)} notifiche` })}.`,
};
var td = {};
td = {
  close: `閉じる`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{500B}\u{306E}\u{901A}\u{77E5}`, other: () => `${t.number(e.count)} \u{500B}\u{306E}\u{901A}\u{77E5}` })}\u{3002}`,
};
var nd = {};
nd = {
  close: `닫기`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)}\u{AC1C} \u{C54C}\u{B9BC}`, other: () => `${t.number(e.count)}\u{AC1C} \u{C54C}\u{B9BC}` })}.`,
};
var rd = {};
rd = {
  close: `Uždaryti`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} prane\u{161}imas`, other: () => `${t.number(e.count)} prane\u{161}imai` })}.`,
};
var id = {};
id = {
  close: `Aizvērt`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} pazi\u{146}ojums`, other: () => `${t.number(e.count)} pazi\u{146}ojumi` })}.`,
};
var ad = {};
ad = {
  close: `Lukk`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} varsling`, other: () => `${t.number(e.count)} varsler` })}.`,
};
var od = {};
od = {
  close: `Sluiten`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} melding`, other: () => `${t.number(e.count)} meldingen` })}.`,
};
var sd = {};
sd = {
  close: `Zamknij`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} powiadomienie`, few: () => `${t.number(e.count)} powiadomienia`, many: () => `${t.number(e.count)} powiadomie\u{144}`, other: () => `${t.number(e.count)} powiadomienia` })}.`,
};
var cd = {};
cd = {
  close: `Fechar`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} notifica\xe7\xe3o`, other: () => `${t.number(e.count)} notifica\xe7\xf5es` })}.`,
};
var ld = {};
ld = {
  close: `Fechar`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} notifica\xe7\xe3o`, other: () => `${t.number(e.count)} notifica\xe7\xf5es` })}.`,
};
var ud = {};
ud = {
  close: `Închideţi`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} notificare`, other: () => `${t.number(e.count)} notific\u{103}ri` })}.`,
};
var dd = {};
dd = {
  close: `Закрыть`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{443}\u{432}\u{435}\u{434}\u{43E}\u{43C}\u{43B}\u{435}\u{43D}\u{438}\u{435}`, other: () => `${t.number(e.count)} \u{443}\u{432}\u{435}\u{434}\u{43E}\u{43C}\u{43B}\u{435}\u{43D}\u{438}\u{44F}` })}.`,
};
var fd = {};
fd = {
  close: `Zatvoriť`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} ozn\xe1menie`, few: () => `${t.number(e.count)} ozn\xe1menia`, other: () => `${t.number(e.count)} ozn\xe1men\xed` })}.`,
};
var pd = {};
pd = {
  close: `Zapri`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} obvestilo`, two: () => `${t.number(e.count)} obvestili`, few: () => `${t.number(e.count)} obvestila`, other: () => `${t.number(e.count)} obvestil` })}.`,
};
var md = {};
md = {
  close: `Zatvori`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} obave\u{161}tenje`, other: () => `${t.number(e.count)} obave\u{161}tenja` })}.`,
};
var hd = {};
hd = {
  close: `Stäng`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} meddelande`, other: () => `${t.number(e.count)} meddelanden` })}.`,
};
var gd = {};
gd = {
  close: `Kapat`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} bildirim`, other: () => `${t.number(e.count)} bildirim` })}.`,
};
var _d = {};
_d = {
  close: `Закрити`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{441}\u{43F}\u{43E}\u{432}\u{456}\u{449}\u{435}\u{43D}\u{43D}\u{44F}`, other: () => `${t.number(e.count)} \u{441}\u{43F}\u{43E}\u{432}\u{456}\u{449}\u{435}\u{43D}\u{43D}\u{44F}` })}.`,
};
var vd = {};
vd = {
  close: `关闭`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{4E2A}\u{901A}\u{77E5}`, other: () => `${t.number(e.count)} \u{4E2A}\u{901A}\u{77E5}` })}\u{3002}`,
};
var yd = {};
yd = {
  close: `關閉`,
  notifications: (e, t) =>
    `${t.plural(e.count, { one: () => `${t.number(e.count)} \u{500B}\u{901A}\u{77E5}`, other: () => `${t.number(e.count)} \u{500B}\u{901A}\u{77E5}` })}\u{3002}`,
};
var bd = {};
bd = {
  "ar-AE": Vu,
  "bg-BG": Hu,
  "cs-CZ": Uu,
  "da-DK": Wu,
  "de-DE": Gu,
  "el-GR": Ku,
  "en-US": qu,
  "es-ES": J,
  "et-EE": Ju,
  "fi-FI": Yu,
  "fr-FR": Xu,
  "he-IL": Zu,
  "hr-HR": Qu,
  "hu-HU": $u,
  "it-IT": ed,
  "ja-JP": td,
  "ko-KR": nd,
  "lt-LT": rd,
  "lv-LV": id,
  "nb-NO": ad,
  "nl-NL": od,
  "pl-PL": sd,
  "pt-BR": cd,
  "pt-PT": ld,
  "ro-RO": ud,
  "ru-RU": dd,
  "sk-SK": fd,
  "sl-SI": pd,
  "sr-SP": md,
  "sv-SE": hd,
  "tr-TR": gd,
  "uk-UA": _d,
  "zh-CN": vd,
  "zh-TW": yd,
};
function xd(e) {
  return e && e.__esModule ? e.default : e;
}
function Sd(e, t, n) {
  let { key: r, timer: i, timeout: a } = e.toast;
  (0, w.useEffect)(() => {
    if (!(i == null || a == null))
      return (
        i.reset(a),
        () => {
          i.pause();
        }
      );
  }, [i, a]);
  let o = pc(),
    s = hc(),
    c = Wc(xd(bd), `@react-aria/toast`),
    [l, u] = (0, w.useState)(!1);
  return (
    Xs(() => {
      u(!0);
    }, []),
    {
      toastProps: {
        ...du(e, { labelable: !0 }),
        role: `alertdialog`,
        "aria-modal": `false`,
        "aria-labelledby": e[`aria-labelledby`] || o,
        "aria-describedby": e[`aria-describedby`] || s,
        tabIndex: 0,
      },
      contentProps: {
        role: `alert`,
        "aria-atomic": `true`,
        "aria-hidden": l ? void 0 : `true`,
      },
      titleProps: { id: o },
      descriptionProps: { id: s },
      closeButtonProps: {
        "aria-label": c.format(`close`),
        onPress: () => t.close(r),
      },
    }
  );
}
function Y(e) {
  return e && e.__esModule ? e.default : e;
}
function Cd(e, t, n) {
  let r = Wc(Y(bd), `@react-aria/toast`),
    { landmarkProps: i } = Bu(
      {
        role: `region`,
        "aria-label":
          e[`aria-label`] ||
          r.format(`notifications`, { count: t.visibleToasts.length }),
      },
      n,
    ),
    a = (0, w.useRef)(!1),
    o = (0, w.useRef)(!1),
    s = (0, w.useCallback)(() => {
      a.current || o.current ? t.pauseAll() : t.resumeAll();
    }, [t]),
    { hoverProps: c } = Tu({
      onHoverStart: () => {
        ((a.current = !0), s());
      },
      onHoverEnd: () => {
        ((a.current = !1), s());
      },
    }),
    l = (0, w.useRef)([]),
    u = (0, w.useRef)(t.visibleToasts),
    d = (0, w.useRef)(null);
  Xs(() => {
    if (d.current === -1 || t.visibleToasts.length === 0 || !n.current) {
      ((l.current = []), (u.current = t.visibleToasts));
      return;
    }
    if (
      ((l.current = [...n.current.querySelectorAll(`[role="alertdialog"]`)]),
      u.current.length === t.visibleToasts.length &&
        t.visibleToasts.every((e, t) => e.key === u.current[t].key))
    ) {
      u.current = t.visibleToasts;
      return;
    }
    let e = u.current.map((e, n) => ({
        ...e,
        i: n,
        isRemoved: !t.visibleToasts.some((t) => e.key === t.key),
      })),
      r = e.findIndex((e) => e.i === d.current && e.isRemoved);
    if (r > -1)
      if (eu() === `pointer` && f.current?.isConnected) Gc(f.current);
      else {
        let t = 0,
          n,
          i;
        for (; t <= r; ) (e[t].isRemoved || (i = Math.max(0, t - 1)), t++);
        for (; t < e.length; ) {
          if (!e[t].isRemoved) {
            n = t - 1;
            break;
          }
          t++;
        }
        (i === void 0 && n === void 0 && (i = 0),
          i >= 0 && i < l.current.length
            ? Gc(l.current[i])
            : n >= 0 && n < l.current.length && Gc(l.current[n]));
      }
    u.current = t.visibleToasts;
  }, [t.visibleToasts, n]);
  let f = (0, w.useRef)(null),
    { focusWithinProps: p } = vu({
      onFocusWithin: (e) => {
        ((o.current = !0), (f.current = e.relatedTarget), s());
      },
      onBlurWithin: () => {
        ((o.current = !1), (f.current = null), s());
      },
    });
  return (
    (0, w.useEffect)(() => {
      t.visibleToasts.length === 0 &&
        f.current?.isConnected &&
        (eu() === `pointer` ? Gc(f.current) : f.current.focus(),
        (f.current = null));
    }, [n, t.visibleToasts.length]),
    (0, w.useEffect)(
      () => () => {
        f.current?.isConnected &&
          (eu() === `pointer` ? Gc(f.current) : f.current.focus(),
          (f.current = null));
      },
      [n],
    ),
    {
      regionProps: vc(i, c, p, {
        tabIndex: -1,
        "data-react-aria-top-layer": !0,
        onFocus: (e) => {
          let t = U(e).closest(`[role="alertdialog"]`);
          d.current = l.current.findIndex((e) => e === t);
        },
        onBlur: () => {
          d.current = -1;
        },
      }),
    }
  );
}
var wd = (0, w.createContext)(null),
  Td = (0, w.createContext)({}),
  Ed = Du(function (e, t) {
    [e, t] = ws(e, t, Td);
    let n = e,
      { isPending: r } = n,
      { buttonProps: i, isPressed: a } = Au(e, t);
    i = Od(i, r);
    let { focusProps: o, isFocused: s, isFocusVisible: c } = yu(e),
      { hoverProps: l, isHovered: u } = Tu({
        ...e,
        isDisabled: e.isDisabled || r,
      }),
      d = {
        isHovered: u,
        isPressed: (n.isPressed || a) && !r,
        isFocused: s,
        isFocusVisible: c,
        isDisabled: e.isDisabled || !1,
        isPending: r ?? !1,
      },
      f = xs({ ...e, values: d, defaultClassName: `react-aria-Button` }),
      p = pc(i.id),
      m = pc(),
      h = i[`aria-labelledby`];
    r && (h ? (h = `${h} ${m}`) : i[`aria-label`] && (h = `${p} ${m}`));
    let g = (0, w.useRef)(r);
    (0, w.useEffect)(() => {
      let e = { "aria-labelledby": h || p };
      (((!g.current && s && r) || (g.current && s && !r)) && As(e, `assertive`),
        (g.current = r));
    }, [r, s, h, p]);
    let _ = _s(e, { global: !0 });
    return (
      delete _.onClick,
      w.createElement(
        Ds.button,
        {
          ...vc(_, f, i, o, l),
          type: i.type === `submit` && r ? `button` : i.type,
          id: p,
          ref: t,
          "aria-labelledby": h,
          slot: e.slot || void 0,
          "aria-disabled": r ? `true` : i[`aria-disabled`],
          "data-disabled": e.isDisabled || void 0,
          "data-pressed": d.isPressed || void 0,
          "data-hovered": u || void 0,
          "data-focused": s || void 0,
          "data-pending": r || void 0,
          "data-focus-visible": c || void 0,
        },
        w.createElement(wd.Provider, { value: { id: m } }, f.children),
      )
    );
  }),
  Dd =
    /Focus|Blur|Hover|Pointer(Enter|Leave|Over|Out)|Mouse(Enter|Leave|Over|Out)/;
function Od(e, t) {
  if (t) {
    for (let t in e) t.startsWith(`on`) && !Dd.test(t) && (e[t] = void 0);
    ((e.href = void 0), (e.target = void 0));
  }
  return e;
}
var kd = (0, w.createContext)({}),
  Ad = (0, w.forwardRef)(function (e, t) {
    [e, t] = ws(e, t, kd);
    let { elementType: n = `span`, ...r } = e,
      i = Ds[n];
    return w.createElement(i, { className: `react-aria-Text`, ...r, ref: t });
  });
function jd(e) {
  let t = (0, w.useCallback)((t) => e.subscribe(t), [e]),
    n = (0, w.useCallback)(() => e.visibleToasts, [e]);
  return {
    visibleToasts: (0, Nu.useSyncExternalStore)(t, n, n),
    add: (t, n) => e.add(t, n),
    close: (t) => e.close(t),
    pauseAll: () => e.pauseAll(),
    resumeAll: () => e.resumeAll(),
  };
}
var Md = class {
    constructor(e) {
      ((this.queue = []),
        (this.subscriptions = new Set()),
        (this.visibleToasts = []),
        (this.maxVisibleToasts = e?.maxVisibleToasts ?? 1 / 0),
        (this.wrapUpdate = e?.wrapUpdate));
    }
    runWithWrapUpdate(e, t) {
      this.wrapUpdate ? this.wrapUpdate(e, t) : e();
    }
    subscribe(e) {
      return (this.subscriptions.add(e), () => this.subscriptions.delete(e));
    }
    add(e, t = {}) {
      let n = `_` + Math.random().toString(36).slice(2),
        r = {
          ...t,
          content: e,
          key: n,
          timer: t.timeout ? new Nd(() => this.close(n), t.timeout) : void 0,
        };
      return (this.queue.unshift(r), this.updateVisibleToasts(`add`), n);
    }
    close(e) {
      let t = this.queue.findIndex((t) => t.key === e);
      (t >= 0 && (this.queue[t].onClose?.(), this.queue.splice(t, 1)),
        this.updateVisibleToasts(`remove`));
    }
    updateVisibleToasts(e) {
      ((this.visibleToasts = this.queue.slice(0, this.maxVisibleToasts)),
        this.runWithWrapUpdate(() => {
          for (let e of this.subscriptions) e();
        }, e));
    }
    pauseAll() {
      for (let e of this.visibleToasts) e.timer && e.timer.pause();
    }
    resumeAll() {
      for (let e of this.visibleToasts) e.timer && e.timer.resume();
    }
    clear() {
      ((this.queue = []), this.updateVisibleToasts(`clear`));
    }
  },
  Nd = class {
    constructor(e, t) {
      ((this.startTime = null), (this.remaining = t), (this.callback = e));
    }
    reset(e) {
      ((this.remaining = e), this.resume());
    }
    pause() {
      this.timerId != null &&
        (clearTimeout(this.timerId),
        (this.timerId = null),
        (this.remaining -= Date.now() - this.startTime));
    }
    resume() {
      this.remaining <= 0 ||
        ((this.startTime = Date.now()),
        (this.timerId = setTimeout(() => {
          ((this.timerId = null), (this.remaining = 0), this.callback());
        }, this.remaining)));
    }
  },
  Pd = (0, w.createContext)(null),
  Fd = (0, w.forwardRef)(function (e, t) {
    let n = es(),
      r = jd(e.queue),
      i = vs(t),
      { regionProps: a } = Cd(e, r, i),
      { focusProps: o, isFocused: s, isFocusVisible: c } = yu(),
      { hoverProps: l, isHovered: u } = Tu({}),
      d = xs({
        ...e,
        children: void 0,
        defaultClassName: `react-aria-ToastRegion`,
        values: {
          visibleToasts: r.visibleToasts,
          isHovered: u,
          isFocused: s,
          isFocusVisible: c,
        },
      }),
      { direction: f } = jc(),
      p,
      { getContainer: m } = Mu();
    n || ((p = document.body), m && (p = m()));
    let h = _s(e, { global: !0 }),
      g = w.createElement(
        Pd.Provider,
        { value: r },
        w.createElement(
          Ds.div,
          {
            ...vc(h, d, a, o, l),
            dir: f,
            ref: i,
            "data-hovered": u || void 0,
            "data-focused": s || void 0,
            "data-focus-visible": c || void 0,
          },
          typeof e.children == `function`
            ? w.createElement(
                Id,
                {
                  ...e,
                  render: void 0,
                  className: void 0,
                  style: { display: `contents` },
                },
                e.children,
              )
            : e.children,
        ),
      );
    return r.visibleToasts.length > 0 && p ? (0, $i.createPortal)(g, p) : null;
  }),
  Id = (0, w.forwardRef)(function (e, t) {
    let n = (0, w.useContext)(Pd),
      { hoverProps: r, isHovered: i } = Tu({}),
      a = xs({
        ...e,
        children: void 0,
        defaultClassName: `react-aria-ToastList`,
        values: {
          visibleToasts: n.visibleToasts,
          isFocused: !1,
          isFocusVisible: !1,
          isHovered: i,
        },
      });
    return w.createElement(
      Ds.ol,
      { ...r, ...a, ref: t },
      n.visibleToasts.map((t) =>
        w.createElement(
          `li`,
          { key: t.key, style: { display: `contents` } },
          e.children({ toast: t }),
        ),
      ),
    );
  }),
  Ld = (0, w.forwardRef)(function (e, t) {
    let n = (0, w.useContext)(Pd),
      r = vs(t),
      {
        toastProps: i,
        contentProps: a,
        titleProps: o,
        descriptionProps: s,
        closeButtonProps: c,
      } = Sd(e, n, r),
      { focusProps: l, isFocused: u, isFocusVisible: d } = yu(),
      f = xs({
        ...e,
        defaultClassName: `react-aria-Toast`,
        values: { toast: e.toast, isFocused: u, isFocusVisible: d },
      }),
      p = _s(e, { global: !0 });
    return w.createElement(
      Ds.div,
      {
        ...vc(p, f, i, l),
        ref: r,
        "data-focused": u || void 0,
        "data-focus-visible": d || void 0,
      },
      w.createElement(
        bs,
        {
          values: [
            [Rd, a],
            [kd, { slots: { [ys]: {}, title: o, description: s } }],
            [Td, { slots: { [ys]: {}, close: c } }],
          ],
        },
        f.children,
      ),
    );
  }),
  Rd = (0, w.createContext)({}),
  zd = (0, w.forwardRef)(function (e, t) {
    return (
      ([e, t] = ws(e, t, Rd)),
      w.createElement(
        Ds.div,
        {
          render: e.render,
          className: `react-aria-ToastContent`,
          ...e,
          ref: t,
        },
        e.children,
      )
    );
  }),
  Bd = (e) => (e ? `true` : void 0);
function Vd(e, t) {
  return Ss(
    e,
    (e, n) =>
      ra(typeof t == `function` ? (t(n) ?? ``) : (t ?? ``), e ?? ``) ?? ``,
  );
}
var Hd = (e, t, n) =>
    typeof e == `function` ? e({ ...(n ?? {}), className: t }) : t,
  Ud = s((e) => {
    var t = Symbol.for(`react.transitional.element`),
      n = Symbol.for(`react.fragment`);
    function r(e, n, r) {
      var i = null;
      if (
        (r !== void 0 && (i = `` + r),
        n.key !== void 0 && (i = `` + n.key),
        `key` in n)
      )
        for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
      else r = n;
      return (
        (n = r.ref),
        { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r }
      );
    }
    ((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
  }),
  X = s((e, t) => {
    t.exports = Ud();
  })(),
  Wd = (e) =>
    (0, X.jsx)(`svg`, {
      "aria-hidden": `true`,
      "aria-label": `Close icon`,
      fill: `none`,
      height: 16,
      role: `presentation`,
      viewBox: `0 0 16 16`,
      width: 16,
      xmlns: `http://www.w3.org/2000/svg`,
      ...e,
      children: (0, X.jsx)(`path`, {
        clipRule: `evenodd`,
        d: `M3.47 3.47a.75.75 0 0 1 1.06 0L8 6.94l3.47-3.47a.75.75 0 1 1 1.06 1.06L9.06 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L8 9.06l-3.47 3.47a.75.75 0 0 1-1.06-1.06L6.94 8 3.47 4.53a.75.75 0 0 1 0-1.06Z`,
        fill: `currentColor`,
        fillRule: `evenodd`,
      }),
    }),
  Gd = (e) =>
    (0, X.jsx)(`svg`, {
      "aria-hidden": `true`,
      "aria-label": `Info icon`,
      fill: `none`,
      height: 16,
      role: `presentation`,
      viewBox: `0 0 16 16`,
      width: 16,
      xmlns: `http://www.w3.org/2000/svg`,
      ...e,
      children: (0, X.jsx)(`path`, {
        clipRule: `evenodd`,
        d: `M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z`,
        fill: `currentColor`,
        fillRule: `evenodd`,
      }),
    }),
  Kd = (e) =>
    (0, X.jsx)(`svg`, {
      "aria-hidden": `true`,
      "aria-label": `Warning icon`,
      fill: `none`,
      height: 16,
      role: `presentation`,
      viewBox: `0 0 16 16`,
      width: 16,
      xmlns: `http://www.w3.org/2000/svg`,
      ...e,
      children: (0, X.jsx)(`path`, {
        clipRule: `evenodd`,
        d: `M7.134 2.994L2.217 11.5a1 1 0 0 0 .866 1.5h9.834a1 1 0 0 0 .866-1.5L8.866 2.993a1 1 0 0 0-1.732 0m3.03-.75c-.962-1.665-3.366-1.665-4.329 0L.918 10.749c-.963 1.666.24 3.751 2.165 3.751h9.834c1.925 0 3.128-2.085 2.164-3.751zM8 5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 5m1 5.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0`,
        fill: `currentColor`,
        fillRule: `evenodd`,
      }),
    }),
  qd = (e) =>
    (0, X.jsx)(`svg`, {
      "aria-hidden": `true`,
      "aria-label": `Danger icon`,
      fill: `none`,
      height: 16,
      role: `presentation`,
      viewBox: `0 0 16 16`,
      width: 16,
      xmlns: `http://www.w3.org/2000/svg`,
      ...e,
      children: (0, X.jsx)(`path`, {
        clipRule: `evenodd`,
        d: `M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8.75 5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0z`,
        fill: `currentColor`,
        fillRule: `evenodd`,
      }),
    }),
  Jd = (e) =>
    (0, X.jsx)(`svg`, {
      "aria-hidden": `true`,
      "aria-label": `Success icon`,
      fill: `none`,
      height: 16,
      role: `presentation`,
      viewBox: `0 0 16 16`,
      width: 16,
      xmlns: `http://www.w3.org/2000/svg`,
      ...e,
      children: (0, X.jsx)(`path`, {
        clipRule: `evenodd`,
        d: `M13.5 8a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-3.9-1.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z`,
        fill: `currentColor`,
        fillRule: `evenodd`,
      }),
    }),
  Yd = ({ children: e, className: t, slot: n, style: r, variant: i, ...a }) =>
    (0, X.jsx)(Ed, {
      "aria-label": `Close`,
      className: Vd(
        t,
        (0, w.useMemo)(() => Ko({ variant: i }), [i]),
      ),
      "data-slot": `close-button`,
      slot: n,
      style: r,
      ...a,
      children: (t) =>
        typeof e == `function`
          ? e(t)
          : (e ?? (0, X.jsx)(Wd, { "data-slot": `close-button-icon` })),
    }),
  Xd = Object.assign(Yd, { Root: Yd }),
  Zd = (0, w.createContext)({}),
  Qd = `__button_group_child`,
  $d = ({
    children: e,
    className: t,
    fullWidth: n,
    isDisabled: r,
    isIconOnly: i,
    size: a,
    slot: o,
    style: s,
    variant: c,
    [Qd]: l,
    ...u
  }) => {
    let d = (0, w.useContext)(Zd),
      f = l === !0,
      p = a ?? (f ? d?.size : void 0),
      m = c ?? (f ? d?.variant : void 0),
      h = r ?? (f ? d?.isDisabled : void 0);
    return (0, X.jsx)(Ed, {
      className: Vd(
        t,
        Go({
          fullWidth: n ?? (f ? d?.fullWidth : void 0),
          isIconOnly: i,
          size: p,
          variant: m,
        }),
      ),
      "data-slot": `button`,
      isDisabled: h,
      slot: o,
      style: s,
      ...u,
      children: (t) => (typeof e == `function` ? e(t) : e),
    });
  },
  ef = Object.assign($d, { Root: $d }),
  tf = ({ ...e }) => {
    let t = (0, w.useId)();
    return (0, X.jsxs)(`svg`, {
      "data-slot": `spinner-icon`,
      viewBox: `0 0 24 24`,
      ...e,
      children: [
        (0, X.jsxs)(`defs`, {
          children: [
            (0, X.jsxs)(`linearGradient`, {
              id: `«data-slot-icon-def-1»-${t}`,
              x1: `50%`,
              x2: `50%`,
              y1: `5.271%`,
              y2: `91.793%`,
              children: [
                (0, X.jsx)(`stop`, { offset: `0%`, stopColor: `currentColor` }),
                (0, X.jsx)(`stop`, {
                  offset: `100%`,
                  stopColor: `currentColor`,
                  stopOpacity: 0.55,
                }),
              ],
            }),
            (0, X.jsxs)(`linearGradient`, {
              id: `«data-slot-icon-def-2»-${t}`,
              x1: `50%`,
              x2: `50%`,
              y1: `15.24%`,
              y2: `87.15%`,
              children: [
                (0, X.jsx)(`stop`, {
                  offset: `0%`,
                  stopColor: `currentColor`,
                  stopOpacity: 0,
                }),
                (0, X.jsx)(`stop`, {
                  offset: `100%`,
                  stopColor: `currentColor`,
                  stopOpacity: 0.55,
                }),
              ],
            }),
          ],
        }),
        (0, X.jsxs)(`g`, {
          fill: `none`,
          children: [
            (0, X.jsx)(`path`, {
              d: `m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z`,
            }),
            (0, X.jsx)(`path`, {
              d: `M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021`,
              fill: `url(#«data-slot-icon-def-1»-${t})`,
              transform: `translate(1.5 1.625)`,
            }),
            (0, X.jsx)(`path`, {
              d: `M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118`,
              fill: `url(#«data-slot-icon-def-2»-${t})`,
              transform: `translate(1.5 1.625)`,
            }),
          ],
        }),
      ],
    });
  },
  nf = ({ className: e, color: t, size: n, ...r }) =>
    (0, X.jsx)(`span`, {
      "data-slot": `spinner`,
      className: qo({ className: e, color: t, size: n }),
      children: (0, X.jsx)(tf, {
        "aria-hidden": !0,
        "aria-label": `Loading`,
        role: `presentation`,
        ...r,
      }),
    }),
  rf = Object.assign(nf, { Root: nf }),
  af = 2 ** 53 - 1,
  of = 0.05,
  sf = 4e3,
  cf = class {
    constructor(e) {
      ((this.maxVisibleToasts = e?.maxVisibleToasts),
        (this.queue = new Md({
          maxVisibleToasts: af,
          wrapUpdate: e?.wrapUpdate
            ? e.wrapUpdate
            : (e) => {
                `startViewTransition` in document
                  ? document.startViewTransition(() => {
                      (0, $i.flushSync)(e);
                    })
                  : e();
              },
        })));
    }
    add(e, t) {
      let n = t?.timeout === void 0 ? sf : t.timeout;
      return this.queue.add(e, { ...t, timeout: n });
    }
    close(e) {
      this.queue.close(e);
    }
    pauseAll() {
      this.queue.pauseAll();
    }
    resumeAll() {
      this.queue.resumeAll();
    }
    clear() {
      this.queue.clear();
    }
    subscribe(e) {
      return this.queue.subscribe(e);
    }
    get visibleToasts() {
      return this.queue.visibleToasts;
    }
    getQueue() {
      return this.queue;
    }
  };
function lf(e) {
  let t = (t, n) => {
    let r = n?.timeout === void 0 ? sf : n.timeout;
    return e.add(
      {
        title: t,
        description: n?.description,
        indicator: n?.indicator,
        variant: n?.variant || `default`,
        actionProps: n?.actionProps,
        isLoading: n?.isLoading,
      },
      {
        timeout: r,
        onClose: () => {
          requestAnimationFrame(() => {
            n?.onClose?.();
          });
        },
      },
    );
  };
  return (
    (t.success = (e, n) => t(e, { ...n, variant: `success` })),
    (t.danger = (e, n) => t(e, { ...n, variant: `danger` })),
    (t.info = (e, n) => t(e, { ...n, variant: `accent` })),
    (t.warning = (e, n) => t(e, { ...n, variant: `warning` })),
    (t.promise = (n, r) => {
      let i = typeof n == `function` ? n() : n,
        a = e.add(
          { title: r.loading, variant: `default`, isLoading: !0 },
          { timeout: 0 },
        );
      return (
        i
          .then((n) => {
            let i = typeof r.success == `function` ? r.success(n) : r.success;
            return (e.close(a), t.success(i));
          })
          .catch((n) => {
            let i = typeof r.error == `function` ? r.error(n) : r.error;
            return (e.close(a), t.danger(i));
          }),
        a
      );
    }),
    (t.getQueue = () => e.getQueue()),
    (t.close = (t) => e.close(t)),
    (t.pauseAll = () => e.pauseAll()),
    (t.resumeAll = () => e.resumeAll()),
    (t.clear = () => e.clear()),
    t
  );
}
var uf = lf(new cf({ maxVisibleToasts: af })),
  df = (e) => {
    let [t, n] = (0, w.useState)(void 0),
      r = (0, w.useCallback)(() => {
        if (e.current) {
          let t = e.current.scrollHeight;
          n((e) => (e === t ? e : t));
        }
      }, [e]);
    return (
      (0, w.useEffect)(() => {
        let t = e.current;
        if (!t) return;
        let n = new ResizeObserver(r),
          i = new MutationObserver((e) => {
            e.some(
              (e) =>
                e.type === `attributes` && e.attributeName === `aria-hidden`,
            ) && r();
          });
        return (
          n.observe(t),
          i.observe(t, { attributeFilter: [`aria-hidden`], attributes: !0 }),
          () => {
            (n.disconnect(), i.disconnect());
          }
        );
      }, [e, r]),
      { height: t }
    );
  },
  ff = typeof window < `u` ? w.useLayoutEffect : w.useEffect,
  pf = typeof window > `u`;
function mf(e, { defaultValue: t = !1, initializeWithValue: n = !0 } = {}) {
  let r = (e) => (pf ? t : window.matchMedia(e).matches),
    [i, a] = (0, w.useState)(() => (n ? r(e) : t));
  function o() {
    a(r(e));
  }
  return (
    ff(() => {
      let t = window.matchMedia(e);
      return (
        o(),
        t.addListener ? t.addListener(o) : t.addEventListener(`change`, o),
        () => {
          t.removeListener
            ? t.removeListener(o)
            : t.removeEventListener(`change`, o);
        }
      );
    }, [e]),
    i
  );
}
var hf = (0, w.createContext)({}),
  gf = ({
    children: e,
    className: t,
    placement: n,
    scaleFactor: r = of,
    toast: i,
    variant: a,
    ...o
  }) => {
    let {
        gap: s = 12,
        heightsByKey: c,
        maxVisibleToasts: l = 3,
        onToastHeightChange: u,
        placement: d,
        scaleFactor: f,
        slots: p,
      } = (0, w.useContext)(hf),
      m = n ?? d,
      h = r ?? f,
      g = (0, w.useContext)(Pd).visibleToasts,
      _ = g.indexOf(i),
      v = _ <= 0,
      y = m?.startsWith(`bottom`),
      b = _ >= l,
      x = i?.key,
      S = (0, w.useRef)(null),
      { height: C } = df(S);
    (0, w.useEffect)(() => {
      x && typeof C == `number` && u?.(x, C);
    }, [x, C, u]);
    let T = (0, w.useMemo)(() => {
      let e = g[0]?.key,
        t = (e ? c?.[e] : void 0) ?? C ?? 0,
        n = _ * s,
        r = (y ? -1 : 1) * n,
        a = 1 - _ * h;
      return {
        viewTransitionName: `toast-${String(i.key).replace(/[^a-zA-Z0-9]/g, `-`)}`,
        translate: `0 ${r}px 0`,
        scale: `${a}`,
        zIndex: g.length - _,
        tabindex: v ? 0 : -1,
        ...(t ? { "--front-height": `${t}px` } : null),
        opacity: +!b,
        pointerEvents: b ? `none` : `auto`,
        ...o.style,
      };
    }, [h, s, c, _, y, v, b, o.style, i?.key, C, g]);
    return (0, X.jsx)(Ld, {
      ref: S,
      "aria-hidden": b,
      className: Vd(t, p?.toast({ variant: a })),
      "data-frontmost": Bd(v),
      "data-hidden": Bd(b),
      "data-index": _,
      "data-slot": `toast`,
      style: T,
      toast: i,
      ...o,
      children: e,
    });
  };
gf.displayName = `HeroUI.Toast`;
var _f = ({ children: e, className: t, ...n }) => {
    let { slots: r } = (0, w.useContext)(hf);
    return (0, X.jsx)(zd, {
      className: Hd(r?.content, t),
      "data-slot": `toast-content`,
      ...n,
      children: e,
    });
  },
  vf = ({ children: e, className: t, variant: n, ...r }) => {
    let { slots: i } = (0, w.useContext)(hf),
      a = (0, w.useCallback)(() => {
        switch (n) {
          case `accent`:
            return (0, X.jsx)(Gd, { "data-slot": `toast-default-icon` });
          case `success`:
            return (0, X.jsx)(Jd, { "data-slot": `toast-default-icon` });
          case `warning`:
            return (0, X.jsx)(Kd, { "data-slot": `toast-default-icon` });
          case `danger`:
            return (0, X.jsx)(qd, { "data-slot": `toast-default-icon` });
          default:
            return (0, X.jsx)(Gd, { "data-slot": `toast-default-icon` });
        }
      }, [n]);
    return (0, X.jsx)(`div`, {
      className: Hd(i?.indicator, t),
      "data-slot": `toast-indicator`,
      ...r,
      children: e ?? a(),
    });
  };
vf.displayName = `HeroUI.ToastIndicator`;
var yf = ({ children: e, className: t, ...n }) => {
  let { slots: r } = (0, w.useContext)(hf);
  return (0, X.jsx)(Ad, {
    className: Hd(r?.title, t),
    "data-slot": `toast-title`,
    slot: `title`,
    ...n,
    children: e,
  });
};
yf.displayName = `HeroUI.ToastTitle`;
var bf = ({ children: e, className: t, ...n }) => {
  let { slots: r } = (0, w.useContext)(hf);
  return (0, X.jsx)(Ad, {
    className: Hd(r?.description, t),
    "data-slot": `toast-description`,
    slot: `description`,
    ...n,
    children: e,
  });
};
bf.displayName = `HeroUI.ToastDescription`;
var xf = ({ className: e, ...t }) => {
  let { slots: n } = (0, w.useContext)(hf);
  return (0, X.jsx)(Xd, {
    className: Vd(e, n?.close()),
    "data-slot": `toast-close`,
    slot: `close`,
    ...t,
  });
};
xf.displayName = `HeroUI.ToastCloseButton`;
var Sf = ({ children: e, className: t, ...n }) => {
  let { slots: r } = (0, w.useContext)(hf);
  return (0, X.jsx)(ef, {
    className: Vd(t, r?.action?.()),
    "data-slot": `toast-action-button`,
    ...n,
    children: e,
  });
};
Sf.displayName = `HeroUI.ToastActionButton`;
var Cf = ({
  children: e,
  className: t,
  gap: n = 12,
  maxVisibleToasts: r,
  placement: i = `bottom`,
  queue: a,
  scaleFactor: o = of,
  width: s = 460,
  ...c
}) => {
  let l = (0, w.useMemo)(() => Jo({ placement: i }), [i]),
    u = mf(`(max-width: 768px)`),
    [d, f] = w.useState({}),
    p = (0, w.useMemo)(
      () => (a ? (`getQueue` in a ? a.getQueue() : a) : uf.getQueue()),
      [a],
    ),
    m = (0, w.useMemo)(() => {
      let e = a && `maxVisibleToasts` in a ? a.maxVisibleToasts : void 0;
      return r ?? e ?? 3;
    }, [r, a]),
    h = (0, w.useCallback)((e, t) => {
      f((n) => (n[e] === t ? n : { ...n, [e]: t }));
    }, []),
    g = (0, w.useCallback)(
      (e) => {
        let {
          actionProps: t,
          description: n,
          indicator: r,
          isLoading: a,
          title: s,
          variant: c,
        } = e.toast.content ?? {};
        return (0, X.jsxs)(gf, {
          placement: i,
          scaleFactor: o,
          toast: e.toast,
          variant: c,
          children: [
            r === null
              ? null
              : a
                ? (0, X.jsx)(vf, {
                    variant: c,
                    children: (0, X.jsx)(rf, { color: `current`, size: `sm` }),
                  })
                : (0, X.jsx)(vf, { variant: c, children: r }),
            (0, X.jsxs)(_f, {
              children: [
                !!s && (0, X.jsx)(yf, { children: s }),
                !!n && (0, X.jsx)(bf, { children: n }),
                u && t?.children
                  ? (0, X.jsx)(Sf, { ...t, children: t.children })
                  : null,
              ],
            }),
            !u && t?.children
              ? (0, X.jsx)(Sf, { ...t, children: t.children })
              : null,
            (0, X.jsx)(xf, {}),
          ],
        });
      },
      [u, i, o],
    );
  return (0, X.jsx)(Fd, {
    className: Vd(t, l?.region()),
    "data-slot": `toast-region`,
    queue: p,
    style: {
      "--gap": `${n}px`,
      "--scale-factor": o,
      "--placement": i,
      "--toast-width": typeof s == `number` ? `${s}px` : s,
    },
    ...c,
    children: (t) => {
      let r = t.toast.content,
        a = { ...t, isLoading: r?.isLoading ?? !1 };
      return (0, X.jsx)(hf, {
        value: {
          slots: l,
          placement: i,
          scaleFactor: o,
          gap: n,
          maxVisibleToasts: m,
          heightsByKey: d,
          onToastHeightChange: h,
          width: s,
        },
        children: e === void 0 ? g(t) : typeof e == `function` ? e(a) : e,
      });
    },
  });
};
Cf.displayName = `HeroUI.ToastProvider`;
var wf = Object.assign(gf, {
    Provider: Cf,
    Content: _f,
    Indicator: vf,
    Title: yf,
    Description: bf,
    ActionButton: Sf,
    CloseButton: xf,
    Queue: cf,
    toast: uf,
  }),
  Tf = (0, w.createContext)({});
function Ef(e) {
  let t = (0, w.useRef)(null);
  return (t.current === null && (t.current = e()), t.current);
}
var Df = typeof window < `u` ? w.useLayoutEffect : w.useEffect,
  Of = (0, w.createContext)(null);
function kf(e, t) {
  e.indexOf(t) === -1 && e.push(t);
}
function Af(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
var jf = (e, t, n) => (n > t ? t : n < e ? e : n),
  Mf = {},
  Nf = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e);
function Pf(e) {
  return typeof e == `object` && !!e;
}
var Ff = (e) => /^0[^.\s]+$/u.test(e);
function If(e) {
  let t;
  return () => (t === void 0 && (t = e()), t);
}
var Lf = (e) => e,
  Rf = (e, t) => (n) => t(e(n)),
  zf = (...e) => e.reduce(Rf),
  Bf = (e, t, n) => {
    let r = t - e;
    return r === 0 ? 1 : (n - e) / r;
  },
  Vf = class {
    constructor() {
      this.subscriptions = [];
    }
    add(e) {
      return (kf(this.subscriptions, e), () => Af(this.subscriptions, e));
    }
    notify(e, t, n) {
      let r = this.subscriptions.length;
      if (r)
        if (r === 1) this.subscriptions[0](e, t, n);
        else
          for (let i = 0; i < r; i++) {
            let r = this.subscriptions[i];
            r && r(e, t, n);
          }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  },
  Hf = (e) => e * 1e3,
  Uf = (e) => e / 1e3;
function Wf(e, t) {
  return t ? (1e3 / t) * e : 0;
}
var Gf = (e, t, n) =>
    (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e,
  Kf = 1e-7,
  qf = 12;
function Jf(e, t, n, r, i) {
  let a,
    o,
    s = 0;
  do ((o = t + (n - t) / 2), (a = Gf(o, r, i) - e), a > 0 ? (n = o) : (t = o));
  while (Math.abs(a) > Kf && ++s < qf);
  return o;
}
function Yf(e, t, n, r) {
  if (e === t && n === r) return Lf;
  let i = (t) => Jf(t, 0, 1, e, n);
  return (e) => (e === 0 || e === 1 ? e : Gf(i(e), t, r));
}
var Xf = (e) => (t) => (t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2),
  Zf = (e) => (t) => 1 - e(1 - t),
  Qf = Yf(0.33, 1.53, 0.69, 0.99),
  $f = Zf(Qf),
  ep = Xf($f),
  tp = (e) =>
    e >= 1 ? 1 : (e *= 2) < 1 ? 0.5 * $f(e) : 0.5 * (2 - 2 ** (-10 * (e - 1))),
  np = (e) => 1 - Math.sin(Math.acos(e)),
  rp = Zf(np),
  ip = Xf(np),
  ap = Yf(0.42, 0, 1, 1),
  op = Yf(0, 0, 0.58, 1),
  sp = Yf(0.42, 0, 0.58, 1),
  cp = (e) => Array.isArray(e) && typeof e[0] != `number`,
  lp = (e) => Array.isArray(e) && typeof e[0] == `number`,
  up = {
    linear: Lf,
    easeIn: ap,
    easeInOut: sp,
    easeOut: op,
    circIn: np,
    circInOut: ip,
    circOut: rp,
    backIn: $f,
    backInOut: ep,
    backOut: Qf,
    anticipate: tp,
  },
  dp = (e) => typeof e == `string`,
  fp = (e) => {
    if (lp(e)) {
      e.length;
      let [t, n, r, i] = e;
      return Yf(t, n, r, i);
    } else if (dp(e)) return (up[e], `${e}`, up[e]);
    return e;
  },
  pp = [
    `setup`,
    `read`,
    `resolveKeyframes`,
    `preUpdate`,
    `update`,
    `preRender`,
    `render`,
    `postRender`,
  ],
  mp = { value: null, addProjectionMetrics: null };
function hp(e, t) {
  let n = new Set(),
    r = new Set(),
    i = !1,
    a = !1,
    o = new WeakSet(),
    s = { delta: 0, timestamp: 0, isProcessing: !1 },
    c = 0;
  function l(t) {
    (o.has(t) && (u.schedule(t), e()), c++, t(s));
  }
  let u = {
    schedule: (e, t = !1, a = !1) => {
      let s = a && i ? n : r;
      return (t && o.add(e), s.add(e), e);
    },
    cancel: (e) => {
      (r.delete(e), o.delete(e));
    },
    process: (e) => {
      if (((s = e), i)) {
        a = !0;
        return;
      }
      i = !0;
      let o = n;
      ((n = r),
        (r = o),
        n.forEach(l),
        t && mp.value && mp.value.frameloop[t].push(c),
        (c = 0),
        n.clear(),
        (i = !1),
        a && ((a = !1), u.process(e)));
    },
  };
  return u;
}
var gp = 40;
function _p(e, t) {
  let n = !1,
    r = !0,
    i = { delta: 0, timestamp: 0, isProcessing: !1 },
    a = () => (n = !0),
    o = pp.reduce((e, n) => ((e[n] = hp(a, t ? n : void 0)), e), {}),
    {
      setup: s,
      read: c,
      resolveKeyframes: l,
      preUpdate: u,
      update: d,
      preRender: f,
      render: p,
      postRender: m,
    } = o,
    h = () => {
      let a = Mf.useManualTiming,
        o = a ? i.timestamp : performance.now();
      ((n = !1),
        a ||
          (i.delta = r ? 1e3 / 60 : Math.max(Math.min(o - i.timestamp, gp), 1)),
        (i.timestamp = o),
        (i.isProcessing = !0),
        s.process(i),
        c.process(i),
        l.process(i),
        u.process(i),
        d.process(i),
        f.process(i),
        p.process(i),
        m.process(i),
        (i.isProcessing = !1),
        n && t && ((r = !1), e(h)));
    },
    g = () => {
      ((n = !0), (r = !0), i.isProcessing || e(h));
    };
  return {
    schedule: pp.reduce((e, t) => {
      let r = o[t];
      return (
        (e[t] = (e, t = !1, i = !1) => (n || g(), r.schedule(e, t, i))),
        e
      );
    }, {}),
    cancel: (e) => {
      for (let t = 0; t < pp.length; t++) o[pp[t]].cancel(e);
    },
    state: i,
    steps: o,
  };
}
var {
    schedule: vp,
    cancel: yp,
    state: bp,
    steps: xp,
  } = _p(typeof requestAnimationFrame < `u` ? requestAnimationFrame : Lf, !0),
  Sp;
function Cp() {
  Sp = void 0;
}
var wp = {
    now: () => (
      Sp === void 0 &&
        wp.set(
          bp.isProcessing || Mf.useManualTiming
            ? bp.timestamp
            : performance.now(),
        ),
      Sp
    ),
    set: (e) => {
      ((Sp = e), queueMicrotask(Cp));
    },
  },
  Tp = { layout: 0, mainThread: 0, waapi: 0 },
  Ep = (e) => (t) => typeof t == `string` && t.startsWith(e),
  Dp = Ep(`--`),
  Op = Ep(`var(--`),
  kp = (e) => (Op(e) ? Ap.test(e.split(`/*`)[0].trim()) : !1),
  Ap =
    /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function jp(e) {
  return typeof e == `string` ? e.split(`/*`)[0].includes(`var(--`) : !1;
}
var Mp = {
    test: (e) => typeof e == `number`,
    parse: parseFloat,
    transform: (e) => e,
  },
  Np = { ...Mp, transform: (e) => jf(0, 1, e) },
  Pp = { ...Mp, default: 1 },
  Fp = (e) => Math.round(e * 1e5) / 1e5,
  Ip = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function Lp(e) {
  return e == null;
}
var Rp =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  zp = (e, t) => (n) =>
    !!(
      (typeof n == `string` && Rp.test(n) && n.startsWith(e)) ||
      (t && !Lp(n) && Object.prototype.hasOwnProperty.call(n, t))
    ),
  Bp = (e, t, n) => (r) => {
    if (typeof r != `string`) return r;
    let [i, a, o, s] = r.match(Ip);
    return {
      [e]: parseFloat(i),
      [t]: parseFloat(a),
      [n]: parseFloat(o),
      alpha: s === void 0 ? 1 : parseFloat(s),
    };
  },
  Vp = (e) => jf(0, 255, e),
  Hp = { ...Mp, transform: (e) => Math.round(Vp(e)) },
  Up = {
    test: zp(`rgb`, `red`),
    parse: Bp(`red`, `green`, `blue`),
    transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) =>
      `rgba(` +
      Hp.transform(e) +
      `, ` +
      Hp.transform(t) +
      `, ` +
      Hp.transform(n) +
      `, ` +
      Fp(Np.transform(r)) +
      `)`,
  };
function Wp(e) {
  let t = ``,
    n = ``,
    r = ``,
    i = ``;
  return (
    e.length > 5
      ? ((t = e.substring(1, 3)),
        (n = e.substring(3, 5)),
        (r = e.substring(5, 7)),
        (i = e.substring(7, 9)))
      : ((t = e.substring(1, 2)),
        (n = e.substring(2, 3)),
        (r = e.substring(3, 4)),
        (i = e.substring(4, 5)),
        (t += t),
        (n += n),
        (r += r),
        (i += i)),
    {
      red: parseInt(t, 16),
      green: parseInt(n, 16),
      blue: parseInt(r, 16),
      alpha: i ? parseInt(i, 16) / 255 : 1,
    }
  );
}
var Gp = { test: zp(`#`), parse: Wp, transform: Up.transform },
  Kp = (e) => ({
    test: (t) =>
      typeof t == `string` && t.endsWith(e) && t.split(` `).length === 1,
    parse: parseFloat,
    transform: (t) => `${t}${e}`,
  }),
  qp = Kp(`deg`),
  Jp = Kp(`%`),
  Z = Kp(`px`),
  Yp = Kp(`vh`),
  Xp = Kp(`vw`),
  Zp = {
    ...Jp,
    parse: (e) => Jp.parse(e) / 100,
    transform: (e) => Jp.transform(e * 100),
  },
  Qp = {
    test: zp(`hsl`, `hue`),
    parse: Bp(`hue`, `saturation`, `lightness`),
    transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) =>
      `hsla(` +
      Math.round(e) +
      `, ` +
      Jp.transform(Fp(t)) +
      `, ` +
      Jp.transform(Fp(n)) +
      `, ` +
      Fp(Np.transform(r)) +
      `)`,
  },
  $p = {
    test: (e) => Up.test(e) || Gp.test(e) || Qp.test(e),
    parse: (e) =>
      Up.test(e) ? Up.parse(e) : Qp.test(e) ? Qp.parse(e) : Gp.parse(e),
    transform: (e) =>
      typeof e == `string`
        ? e
        : e.hasOwnProperty(`red`)
          ? Up.transform(e)
          : Qp.transform(e),
    getAnimatableNone: (e) => {
      let t = $p.parse(e);
      return ((t.alpha = 0), $p.transform(t));
    },
  },
  em =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function tm(e) {
  return (
    isNaN(e) &&
    typeof e == `string` &&
    (e.match(Ip)?.length || 0) + (e.match(em)?.length || 0) > 0
  );
}
var nm = `number`,
  rm = `color`,
  im = `var`,
  am = `var(`,
  om = "${}",
  sm =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function cm(e) {
  let t = e.toString(),
    n = [],
    r = { color: [], number: [], var: [] },
    i = [],
    a = 0;
  return {
    values: n,
    split: t
      .replace(
        sm,
        (e) => (
          $p.test(e)
            ? (r.color.push(a), i.push(rm), n.push($p.parse(e)))
            : e.startsWith(am)
              ? (r.var.push(a), i.push(im), n.push(e))
              : (r.number.push(a), i.push(nm), n.push(parseFloat(e))),
          ++a,
          om
        ),
      )
      .split(om),
    indexes: r,
    types: i,
  };
}
function lm(e) {
  return cm(e).values;
}
function um({ split: e, types: t }) {
  let n = e.length;
  return (r) => {
    let i = ``;
    for (let a = 0; a < n; a++)
      if (((i += e[a]), r[a] !== void 0)) {
        let e = t[a];
        e === nm
          ? (i += Fp(r[a]))
          : e === rm
            ? (i += $p.transform(r[a]))
            : (i += r[a]);
      }
    return i;
  };
}
function dm(e) {
  return um(cm(e));
}
var fm = (e) =>
    typeof e == `number` ? 0 : $p.test(e) ? $p.getAnimatableNone(e) : e,
  pm = (e, t) =>
    typeof e == `number` ? (t?.trim().endsWith(`/`) ? e : 0) : fm(e);
function mm(e) {
  let t = cm(e);
  return um(t)(t.values.map((e, n) => pm(e, t.split[n])));
}
var hm = { test: tm, parse: lm, createTransformer: dm, getAnimatableNone: mm };
function gm(e, t, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && --n,
    n < 1 / 6
      ? e + (t - e) * 6 * n
      : n < 1 / 2
        ? t
        : n < 2 / 3
          ? e + (t - e) * (2 / 3 - n) * 6
          : e
  );
}
function _m({ hue: e, saturation: t, lightness: n, alpha: r }) {
  ((e /= 360), (t /= 100), (n /= 100));
  let i = 0,
    a = 0,
    o = 0;
  if (!t) i = a = o = n;
  else {
    let r = n < 0.5 ? n * (1 + t) : n + t - n * t,
      s = 2 * n - r;
    ((i = gm(s, r, e + 1 / 3)), (a = gm(s, r, e)), (o = gm(s, r, e - 1 / 3)));
  }
  return {
    red: Math.round(i * 255),
    green: Math.round(a * 255),
    blue: Math.round(o * 255),
    alpha: r,
  };
}
function vm(e, t) {
  return (n) => (n > 0 ? t : e);
}
var ym = (e, t, n) => e + (t - e) * n,
  bm = (e, t, n) => {
    let r = e * e,
      i = n * (t * t - r) + r;
    return i < 0 ? 0 : Math.sqrt(i);
  },
  xm = [Gp, Up, Qp],
  Sm = (e) => xm.find((t) => t.test(e));
function Cm(e) {
  let t = Sm(e);
  if ((`${e}`, !t)) return !1;
  let n = t.parse(e);
  return (t === Qp && (n = _m(n)), n);
}
var wm = (e, t) => {
    let n = Cm(e),
      r = Cm(t);
    if (!n || !r) return vm(e, t);
    let i = { ...n };
    return (e) => (
      (i.red = bm(n.red, r.red, e)),
      (i.green = bm(n.green, r.green, e)),
      (i.blue = bm(n.blue, r.blue, e)),
      (i.alpha = ym(n.alpha, r.alpha, e)),
      Up.transform(i)
    );
  },
  Tm = new Set([`none`, `hidden`]);
function Em(e, t) {
  return Tm.has(e) ? (n) => (n <= 0 ? e : t) : (n) => (n >= 1 ? t : e);
}
function Dm(e, t) {
  return (n) => ym(e, t, n);
}
function Om(e) {
  return typeof e == `number`
    ? Dm
    : typeof e == `string`
      ? kp(e)
        ? vm
        : $p.test(e)
          ? wm
          : Mm
      : Array.isArray(e)
        ? km
        : typeof e == `object`
          ? $p.test(e)
            ? wm
            : Am
          : vm;
}
function km(e, t) {
  let n = [...e],
    r = n.length,
    i = e.map((e, n) => Om(e)(e, t[n]));
  return (e) => {
    for (let t = 0; t < r; t++) n[t] = i[t](e);
    return n;
  };
}
function Am(e, t) {
  let n = { ...e, ...t },
    r = {};
  for (let i in n)
    e[i] !== void 0 && t[i] !== void 0 && (r[i] = Om(e[i])(e[i], t[i]));
  return (e) => {
    for (let t in r) n[t] = r[t](e);
    return n;
  };
}
function jm(e, t) {
  let n = [],
    r = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < t.values.length; i++) {
    let a = t.types[i],
      o = e.indexes[a][r[a]];
    ((n[i] = e.values[o] ?? 0), r[a]++);
  }
  return n;
}
var Mm = (e, t) => {
  let n = hm.createTransformer(t),
    r = cm(e),
    i = cm(t);
  return r.indexes.var.length === i.indexes.var.length &&
    r.indexes.color.length === i.indexes.color.length &&
    r.indexes.number.length >= i.indexes.number.length
    ? (Tm.has(e) && !i.values.length) || (Tm.has(t) && !r.values.length)
      ? Em(e, t)
      : zf(km(jm(r, i), i.values), n)
    : (`${e}${t}`, vm(e, t));
};
function Nm(e, t, n) {
  return typeof e == `number` && typeof t == `number` && typeof n == `number`
    ? ym(e, t, n)
    : Om(e)(e, t);
}
var Pm = (e) => {
    let t = ({ timestamp: t }) => e(t);
    return {
      start: (e = !0) => vp.update(t, e),
      stop: () => yp(t),
      now: () => (bp.isProcessing ? bp.timestamp : wp.now()),
    };
  },
  Fm = (e, t, n = 10) => {
    let r = ``,
      i = Math.max(Math.round(t / n), 2);
    for (let t = 0; t < i; t++)
      r += Math.round(e(t / (i - 1)) * 1e4) / 1e4 + `, `;
    return `linear(${r.substring(0, r.length - 2)})`;
  },
  Im = 2e4;
function Lm(e) {
  let t = 0,
    n = e.next(t);
  for (; !n.done && t < 2e4; ) ((t += 50), (n = e.next(t)));
  return t >= 2e4 ? 1 / 0 : t;
}
function Rm(e, t = 100, n) {
  let r = n({ ...e, keyframes: [0, t] }),
    i = Math.min(Lm(r), Im);
  return {
    type: `keyframes`,
    ease: (e) => r.next(i * e).value / t,
    duration: Uf(i),
  };
}
var zm = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  duration: 800,
  bounce: 0.3,
  visualDuration: 0.3,
  restSpeed: { granular: 0.01, default: 2 },
  restDelta: { granular: 0.005, default: 0.5 },
  minDuration: 0.01,
  maxDuration: 10,
  minDamping: 0.05,
  maxDamping: 1,
};
function Bm(e, t) {
  return e * Math.sqrt(1 - t * t);
}
var Vm = 12;
function Hm(e, t, n) {
  let r = n;
  for (let n = 1; n < Vm; n++) r -= e(r) / t(r);
  return r;
}
var Um = 0.001;
function Wm({
  duration: e = zm.duration,
  bounce: t = zm.bounce,
  velocity: n = zm.velocity,
  mass: r = zm.mass,
}) {
  let i, a;
  zm.maxDuration;
  let o = 1 - t;
  ((o = jf(zm.minDamping, zm.maxDamping, o)),
    (e = jf(zm.minDuration, zm.maxDuration, Uf(e))),
    o < 1
      ? ((i = (t) => {
          let r = t * o,
            i = r * e,
            a = r - n,
            s = Bm(t, o),
            c = Math.exp(-i);
          return Um - (a / s) * c;
        }),
        (a = (t) => {
          let r = t * o * e,
            a = r * n + n,
            s = o ** 2 * t ** 2 * e,
            c = Math.exp(-r),
            l = Bm(t ** 2, o);
          return ((-i(t) + Um > 0 ? -1 : 1) * ((a - s) * c)) / l;
        }))
      : ((i = (t) => {
          let r = Math.exp(-t * e),
            i = (t - n) * e + 1;
          return -Um + r * i;
        }),
        (a = (t) => Math.exp(-t * e) * ((n - t) * (e * e)))));
  let s = 5 / e,
    c = Hm(i, a, s);
  if (((e = Hf(e)), isNaN(c)))
    return { stiffness: zm.stiffness, damping: zm.damping, duration: e };
  {
    let t = c ** 2 * r;
    return { stiffness: t, damping: o * 2 * Math.sqrt(r * t), duration: e };
  }
}
var Gm = [`duration`, `bounce`],
  Km = [`stiffness`, `damping`, `mass`];
function qm(e, t) {
  return t.some((t) => e[t] !== void 0);
}
function Jm(e) {
  let t = {
    velocity: zm.velocity,
    stiffness: zm.stiffness,
    damping: zm.damping,
    mass: zm.mass,
    isResolvedFromDuration: !1,
    ...e,
  };
  if (!qm(e, Km) && qm(e, Gm))
    if (((t.velocity = 0), e.visualDuration)) {
      let n = e.visualDuration,
        r = (2 * Math.PI) / (n * 1.2),
        i = r * r,
        a = 2 * jf(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(i);
      t = { ...t, mass: zm.mass, stiffness: i, damping: a };
    } else {
      let n = Wm({ ...e, velocity: 0 });
      ((t = { ...t, ...n, mass: zm.mass }), (t.isResolvedFromDuration = !0));
    }
  return t;
}
function Ym(e = zm.visualDuration, t = zm.bounce) {
  let n =
      typeof e == `object`
        ? e
        : { visualDuration: e, keyframes: [0, 1], bounce: t },
    { restSpeed: r, restDelta: i } = n,
    a = n.keyframes[0],
    o = n.keyframes[n.keyframes.length - 1],
    s = { done: !1, value: a },
    {
      stiffness: c,
      damping: l,
      mass: u,
      duration: d,
      velocity: f,
      isResolvedFromDuration: p,
    } = Jm({ ...n, velocity: -Uf(n.velocity || 0) }),
    m = f || 0,
    h = l / (2 * Math.sqrt(c * u)),
    g = o - a,
    _ = Uf(Math.sqrt(c / u)),
    v = Math.abs(g) < 5;
  ((r ||= v ? zm.restSpeed.granular : zm.restSpeed.default),
    (i ||= v ? zm.restDelta.granular : zm.restDelta.default));
  let y, b, x, S, C, w;
  if (h < 1)
    ((x = Bm(_, h)),
      (S = (m + h * _ * g) / x),
      (y = (e) =>
        o - Math.exp(-h * _ * e) * (S * Math.sin(x * e) + g * Math.cos(x * e))),
      (C = h * _ * S + g * x),
      (w = h * _ * g - S * x),
      (b = (e) =>
        Math.exp(-h * _ * e) * (C * Math.sin(x * e) + w * Math.cos(x * e))));
  else if (h === 1) {
    y = (e) => o - Math.exp(-_ * e) * (g + (m + _ * g) * e);
    let e = m + _ * g;
    b = (t) => Math.exp(-_ * t) * (_ * e * t - m);
  } else {
    let e = _ * Math.sqrt(h * h - 1);
    y = (t) => {
      let n = Math.exp(-h * _ * t),
        r = Math.min(e * t, 300);
      return (
        o - (n * ((m + h * _ * g) * Math.sinh(r) + e * g * Math.cosh(r))) / e
      );
    };
    let t = (m + h * _ * g) / e,
      n = h * _ * t - g * e,
      r = h * _ * g - t * e;
    b = (t) => {
      let i = Math.exp(-h * _ * t),
        a = Math.min(e * t, 300);
      return i * (n * Math.sinh(a) + r * Math.cosh(a));
    };
  }
  let T = {
    calculatedDuration: (p && d) || null,
    velocity: (e) => Hf(b(e)),
    next: (e) => {
      if (!p && h < 1) {
        let t = Math.exp(-h * _ * e),
          n = Math.sin(x * e),
          a = Math.cos(x * e),
          c = o - t * (S * n + g * a),
          l = Hf(t * (C * n + w * a));
        return (
          (s.done = Math.abs(l) <= r && Math.abs(o - c) <= i),
          (s.value = s.done ? o : c),
          s
        );
      }
      let t = y(e);
      if (p) s.done = e >= d;
      else {
        let n = Hf(b(e));
        s.done = Math.abs(n) <= r && Math.abs(o - t) <= i;
      }
      return ((s.value = s.done ? o : t), s);
    },
    toString: () => {
      let e = Math.min(Lm(T), Im),
        t = Fm((t) => T.next(e * t).value, e, 30);
      return e + `ms ` + t;
    },
    toTransition: () => {},
  };
  return T;
}
Ym.applyToOptions = (e) => {
  let t = Rm(e, 100, Ym);
  return (
    (e.ease = t.ease),
    (e.duration = Hf(t.duration)),
    (e.type = `keyframes`),
    e
  );
};
var Xm = 5;
function Zm(e, t, n) {
  let r = Math.max(t - Xm, 0);
  return Wf(n - e(r), t - r);
}
function Qm({
  keyframes: e,
  velocity: t = 0,
  power: n = 0.8,
  timeConstant: r = 325,
  bounceDamping: i = 10,
  bounceStiffness: a = 500,
  modifyTarget: o,
  min: s,
  max: c,
  restDelta: l = 0.5,
  restSpeed: u,
}) {
  let d = e[0],
    f = { done: !1, value: d },
    p = (e) => (s !== void 0 && e < s) || (c !== void 0 && e > c),
    m = (e) =>
      s === void 0
        ? c
        : c === void 0 || Math.abs(s - e) < Math.abs(c - e)
          ? s
          : c,
    h = n * t,
    g = d + h,
    _ = o === void 0 ? g : o(g);
  _ !== g && (h = _ - d);
  let v = (e) => -h * Math.exp(-e / r),
    y = (e) => _ + v(e),
    b = (e) => {
      let t = v(e),
        n = y(e);
      ((f.done = Math.abs(t) <= l), (f.value = f.done ? _ : n));
    },
    x,
    S,
    C = (e) => {
      p(f.value) &&
        ((x = e),
        (S = Ym({
          keyframes: [f.value, m(f.value)],
          velocity: Zm(y, e, f.value),
          damping: i,
          stiffness: a,
          restDelta: l,
          restSpeed: u,
        })));
    };
  return (
    C(0),
    {
      calculatedDuration: null,
      next: (e) => {
        let t = !1;
        return (
          !S && x === void 0 && ((t = !0), b(e), C(e)),
          x !== void 0 && e >= x ? S.next(e - x) : (!t && b(e), f)
        );
      },
    }
  );
}
function $m(e, t, n) {
  let r = [],
    i = n || Mf.mix || Nm,
    a = e.length - 1;
  for (let n = 0; n < a; n++) {
    let a = i(e[n], e[n + 1]);
    (t && (a = zf(Array.isArray(t) ? t[n] || Lf : t, a)), r.push(a));
  }
  return r;
}
function eh(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
  let a = e.length;
  if ((t.length, a === 1)) return () => t[0];
  if (a === 2 && t[0] === t[1]) return () => t[1];
  let o = e[0] === e[1];
  e[0] > e[a - 1] && ((e = [...e].reverse()), (t = [...t].reverse()));
  let s = $m(t, r, i),
    c = s.length,
    l = (n) => {
      if (o && n < e[0]) return t[0];
      let r = 0;
      if (c > 1) for (; r < e.length - 2 && !(n < e[r + 1]); r++);
      let i = Bf(e[r], e[r + 1], n);
      return s[r](i);
    };
  return n ? (t) => l(jf(e[0], e[a - 1], t)) : l;
}
function th(e, t) {
  let n = e[e.length - 1];
  for (let r = 1; r <= t; r++) {
    let i = Bf(0, t, r);
    e.push(ym(n, 1, i));
  }
}
function nh(e) {
  let t = [0];
  return (th(t, e.length - 1), t);
}
function rh(e, t) {
  return e.map((e) => e * t);
}
function ih(e, t) {
  return e.map(() => t || sp).splice(0, e.length - 1);
}
function ah({
  duration: e = 300,
  keyframes: t,
  times: n,
  ease: r = `easeInOut`,
}) {
  let i = cp(r) ? r.map(fp) : fp(r),
    a = { done: !1, value: t[0] },
    o = eh(rh(n && n.length === t.length ? n : nh(t), e), t, {
      ease: Array.isArray(i) ? i : ih(t, i),
    });
  return {
    calculatedDuration: e,
    next: (t) => ((a.value = o(t)), (a.done = t >= e), a),
  };
}
var oh = (e) => e !== null;
function sh(e, { repeat: t, repeatType: n = `loop` }, r, i = 1) {
  let a = e.filter(oh),
    o = i < 0 || (t && n !== `loop` && t % 2 == 1) ? 0 : a.length - 1;
  return !o || r === void 0 ? a[o] : r;
}
var ch = { decay: Qm, inertia: Qm, tween: ah, keyframes: ah, spring: Ym };
function lh(e) {
  typeof e.type == `string` && (e.type = ch[e.type]);
}
var uh = class {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((e) => {
        this.resolve = e;
      });
    }
    notifyFinished() {
      this.resolve();
    }
    then(e, t) {
      return this.finished.then(e, t);
    }
  },
  dh = (e) => e / 100,
  fh = class extends uh {
    constructor(e) {
      (super(),
        (this.state = `idle`),
        (this.startTime = null),
        (this.isStopped = !1),
        (this.currentTime = 0),
        (this.holdTime = null),
        (this.playbackSpeed = 1),
        (this.delayState = { done: !1, value: void 0 }),
        (this.stop = () => {
          let { motionValue: e } = this.options;
          (e && e.updatedAt !== wp.now() && this.tick(wp.now()),
            (this.isStopped = !0),
            this.state !== `idle` &&
              (this.teardown(), this.options.onStop?.()));
        }),
        Tp.mainThread++,
        (this.options = e),
        this.initAnimation(),
        this.play(),
        e.autoplay === !1 && this.pause());
    }
    initAnimation() {
      let { options: e } = this;
      lh(e);
      let {
          type: t = ah,
          repeat: n = 0,
          repeatDelay: r = 0,
          repeatType: i,
          velocity: a = 0,
        } = e,
        { keyframes: o } = e,
        s = t || ah;
      s !== ah &&
        typeof o[0] != `number` &&
        ((this.mixKeyframes = zf(dh, Nm(o[0], o[1]))), (o = [0, 100]));
      let c = s({ ...e, keyframes: o });
      (i === `mirror` &&
        (this.mirroredGenerator = s({
          ...e,
          keyframes: [...o].reverse(),
          velocity: -a,
        })),
        c.calculatedDuration === null && (c.calculatedDuration = Lm(c)));
      let { calculatedDuration: l } = c;
      ((this.calculatedDuration = l),
        (this.resolvedDuration = l + r),
        (this.totalDuration = this.resolvedDuration * (n + 1) - r),
        (this.generator = c));
    }
    updateTime(e) {
      let t = Math.round(e - this.startTime) * this.playbackSpeed;
      this.holdTime === null
        ? (this.currentTime = t)
        : (this.currentTime = this.holdTime);
    }
    tick(e, t = !1) {
      let {
        generator: n,
        totalDuration: r,
        mixKeyframes: i,
        mirroredGenerator: a,
        resolvedDuration: o,
        calculatedDuration: s,
      } = this;
      if (this.startTime === null) return n.next(0);
      let {
        delay: c = 0,
        keyframes: l,
        repeat: u,
        repeatType: d,
        repeatDelay: f,
        type: p,
        onUpdate: m,
        finalKeyframe: h,
      } = this.options;
      (this.speed > 0
        ? (this.startTime = Math.min(this.startTime, e))
        : this.speed < 0 &&
          (this.startTime = Math.min(e - r / this.speed, this.startTime)),
        t ? (this.currentTime = e) : this.updateTime(e));
      let g = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1),
        _ = this.playbackSpeed >= 0 ? g < 0 : g > r;
      ((this.currentTime = Math.max(g, 0)),
        this.state === `finished` &&
          this.holdTime === null &&
          (this.currentTime = r));
      let v = this.currentTime,
        y = n;
      if (u) {
        let e = Math.min(this.currentTime, r) / o,
          t = Math.floor(e),
          n = e % 1;
        (!n && e >= 1 && (n = 1),
          n === 1 && t--,
          (t = Math.min(t, u + 1)),
          t % 2 &&
            (d === `reverse`
              ? ((n = 1 - n), f && (n -= f / o))
              : d === `mirror` && (y = a)),
          (v = jf(0, 1, n) * o));
      }
      let b;
      (_
        ? ((this.delayState.value = l[0]), (b = this.delayState))
        : (b = y.next(v)),
        i && !_ && (b.value = i(b.value)));
      let { done: x } = b;
      !_ &&
        s !== null &&
        (x =
          this.playbackSpeed >= 0
            ? this.currentTime >= r
            : this.currentTime <= 0);
      let S =
        this.holdTime === null &&
        (this.state === `finished` || (this.state === `running` && x));
      return (
        S && p !== Qm && (b.value = sh(l, this.options, h, this.speed)),
        m && m(b.value),
        S && this.finish(),
        b
      );
    }
    then(e, t) {
      return this.finished.then(e, t);
    }
    get duration() {
      return Uf(this.calculatedDuration);
    }
    get iterationDuration() {
      let { delay: e = 0 } = this.options || {};
      return this.duration + Uf(e);
    }
    get time() {
      return Uf(this.currentTime);
    }
    set time(e) {
      ((e = Hf(e)),
        (this.currentTime = e),
        this.startTime === null ||
        this.holdTime !== null ||
        this.playbackSpeed === 0
          ? (this.holdTime = e)
          : this.driver &&
            (this.startTime = this.driver.now() - e / this.playbackSpeed),
        this.driver
          ? this.driver.start(!1)
          : ((this.startTime = 0),
            (this.state = `paused`),
            (this.holdTime = e),
            this.tick(e)));
    }
    getGeneratorVelocity() {
      let e = this.currentTime;
      if (e <= 0) return this.options.velocity || 0;
      if (this.generator.velocity) return this.generator.velocity(e);
      let t = this.generator.next(e).value;
      return Zm((e) => this.generator.next(e).value, e, t);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(e) {
      let t = this.playbackSpeed !== e;
      (t && this.driver && this.updateTime(wp.now()),
        (this.playbackSpeed = e),
        t && this.driver && (this.time = Uf(this.currentTime)));
    }
    play() {
      if (this.isStopped) return;
      let { driver: e = Pm, startTime: t } = this.options;
      ((this.driver ||= e((e) => this.tick(e))), this.options.onPlay?.());
      let n = this.driver.now();
      (this.state === `finished`
        ? (this.updateFinished(), (this.startTime = n))
        : this.holdTime === null
          ? (this.startTime ||= t ?? n)
          : (this.startTime = n - this.holdTime),
        this.state === `finished` &&
          this.speed < 0 &&
          (this.startTime += this.calculatedDuration),
        (this.holdTime = null),
        (this.state = `running`),
        this.driver.start());
    }
    pause() {
      ((this.state = `paused`),
        this.updateTime(wp.now()),
        (this.holdTime = this.currentTime));
    }
    complete() {
      (this.state !== `running` && this.play(),
        (this.state = `finished`),
        (this.holdTime = null));
    }
    finish() {
      (this.notifyFinished(),
        this.teardown(),
        (this.state = `finished`),
        this.options.onComplete?.());
    }
    cancel() {
      ((this.holdTime = null),
        (this.startTime = 0),
        this.tick(0),
        this.teardown(),
        this.options.onCancel?.());
    }
    teardown() {
      ((this.state = `idle`),
        this.stopDriver(),
        (this.startTime = this.holdTime = null),
        Tp.mainThread--);
    }
    stopDriver() {
      this.driver &&= (this.driver.stop(), void 0);
    }
    sample(e) {
      return ((this.startTime = 0), this.tick(e, !0));
    }
    attachTimeline(e) {
      return (
        this.options.allowFlatten &&
          ((this.options.type = `keyframes`),
          (this.options.ease = `linear`),
          this.initAnimation()),
        this.driver?.stop(),
        e.observe(this)
      );
    }
  };
function ph(e) {
  for (let t = 1; t < e.length; t++) e[t] ?? (e[t] = e[t - 1]);
}
var mh = (e) => (e * 180) / Math.PI,
  hh = (e) => _h(mh(Math.atan2(e[1], e[0]))),
  gh = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (e) => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
    rotate: hh,
    rotateZ: hh,
    skewX: (e) => mh(Math.atan(e[1])),
    skewY: (e) => mh(Math.atan(e[2])),
    skew: (e) => (Math.abs(e[1]) + Math.abs(e[2])) / 2,
  },
  _h = (e) => ((e %= 360), e < 0 && (e += 360), e),
  vh = hh,
  yh = (e) => Math.sqrt(e[0] * e[0] + e[1] * e[1]),
  bh = (e) => Math.sqrt(e[4] * e[4] + e[5] * e[5]),
  xh = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: yh,
    scaleY: bh,
    scale: (e) => (yh(e) + bh(e)) / 2,
    rotateX: (e) => _h(mh(Math.atan2(e[6], e[5]))),
    rotateY: (e) => _h(mh(Math.atan2(-e[2], e[0]))),
    rotateZ: vh,
    rotate: vh,
    skewX: (e) => mh(Math.atan(e[4])),
    skewY: (e) => mh(Math.atan(e[1])),
    skew: (e) => (Math.abs(e[1]) + Math.abs(e[4])) / 2,
  };
function Sh(e) {
  return +!!e.includes(`scale`);
}
function Ch(e, t) {
  if (!e || e === `none`) return Sh(t);
  let n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u),
    r,
    i;
  if (n) ((r = xh), (i = n));
  else {
    let t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((r = gh), (i = t));
  }
  if (!i) return Sh(t);
  let a = r[t],
    o = i[1].split(`,`).map(Th);
  return typeof a == `function` ? a(o) : o[a];
}
var wh = (e, t) => {
  let { transform: n = `none` } = getComputedStyle(e);
  return Ch(n, t);
};
function Th(e) {
  return parseFloat(e.trim());
}
var Eh = [
    `transformPerspective`,
    `x`,
    `y`,
    `z`,
    `translateX`,
    `translateY`,
    `translateZ`,
    `scale`,
    `scaleX`,
    `scaleY`,
    `rotate`,
    `rotateX`,
    `rotateY`,
    `rotateZ`,
    `skew`,
    `skewX`,
    `skewY`,
  ],
  Dh = new Set(Eh),
  Oh = (e) => e === Mp || e === Z,
  kh = new Set([`x`, `y`, `z`]),
  Ah = Eh.filter((e) => !kh.has(e));
function jh(e) {
  let t = [];
  return (
    Ah.forEach((n) => {
      let r = e.getValue(n);
      r !== void 0 && (t.push([n, r.get()]), r.set(+!!n.startsWith(`scale`)));
    }),
    t
  );
}
var Mh = {
  width: (
    { x: e },
    { paddingLeft: t = `0`, paddingRight: n = `0`, boxSizing: r },
  ) => {
    let i = e.max - e.min;
    return r === `border-box` ? i : i - parseFloat(t) - parseFloat(n);
  },
  height: (
    { y: e },
    { paddingTop: t = `0`, paddingBottom: n = `0`, boxSizing: r },
  ) => {
    let i = e.max - e.min;
    return r === `border-box` ? i : i - parseFloat(t) - parseFloat(n);
  },
  top: (e, { top: t }) => parseFloat(t),
  left: (e, { left: t }) => parseFloat(t),
  bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
  right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
  x: (e, { transform: t }) => Ch(t, `x`),
  y: (e, { transform: t }) => Ch(t, `y`),
};
((Mh.translateX = Mh.x), (Mh.translateY = Mh.y));
var Nh = new Set(),
  Ph = !1,
  Fh = !1,
  Ih = !1;
function Lh() {
  if (Fh) {
    let e = Array.from(Nh).filter((e) => e.needsMeasurement),
      t = new Set(e.map((e) => e.element)),
      n = new Map();
    (t.forEach((e) => {
      let t = jh(e);
      t.length && (n.set(e, t), e.render());
    }),
      e.forEach((e) => e.measureInitialState()),
      t.forEach((e) => {
        e.render();
        let t = n.get(e);
        t &&
          t.forEach(([t, n]) => {
            e.getValue(t)?.set(n);
          });
      }),
      e.forEach((e) => e.measureEndState()),
      e.forEach((e) => {
        e.suspendedScrollY !== void 0 && window.scrollTo(0, e.suspendedScrollY);
      }));
  }
  ((Fh = !1), (Ph = !1), Nh.forEach((e) => e.complete(Ih)), Nh.clear());
}
function Rh() {
  Nh.forEach((e) => {
    (e.readKeyframes(), e.needsMeasurement && (Fh = !0));
  });
}
function zh() {
  ((Ih = !0), Rh(), Lh(), (Ih = !1));
}
var Bh = class {
    constructor(e, t, n, r, i, a = !1) {
      ((this.state = `pending`),
        (this.isAsync = !1),
        (this.needsMeasurement = !1),
        (this.unresolvedKeyframes = [...e]),
        (this.onComplete = t),
        (this.name = n),
        (this.motionValue = r),
        (this.element = i),
        (this.isAsync = a));
    }
    scheduleResolve() {
      ((this.state = `scheduled`),
        this.isAsync
          ? (Nh.add(this),
            Ph || ((Ph = !0), vp.read(Rh), vp.resolveKeyframes(Lh)))
          : (this.readKeyframes(), this.complete()));
    }
    readKeyframes() {
      let {
        unresolvedKeyframes: e,
        name: t,
        element: n,
        motionValue: r,
      } = this;
      if (e[0] === null) {
        let i = r?.get(),
          a = e[e.length - 1];
        if (i !== void 0) e[0] = i;
        else if (n && t) {
          let r = n.readValue(t, a);
          r != null && (e[0] = r);
        }
        (e[0] === void 0 && (e[0] = a), r && i === void 0 && r.set(e[0]));
      }
      ph(e);
    }
    setFinalKeyframe() {}
    measureInitialState() {}
    renderEndStyles() {}
    measureEndState() {}
    complete(e = !1) {
      ((this.state = `complete`),
        this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e),
        Nh.delete(this));
    }
    cancel() {
      this.state === `scheduled` && (Nh.delete(this), (this.state = `pending`));
    }
    resume() {
      this.state === `pending` && this.scheduleResolve();
    }
  },
  Vh = (e) => e.startsWith(`--`);
function Hh(e, t, n) {
  Vh(t) ? e.style.setProperty(t, n) : (e.style[t] = n);
}
var Uh = {};
function Wh(e, t) {
  let n = If(e);
  return () => Uh[t] ?? n();
}
var Gh = Wh(() => window.ScrollTimeline !== void 0, `scrollTimeline`),
  Kh = Wh(() => {
    try {
      document
        .createElement(`div`)
        .animate({ opacity: 0 }, { easing: `linear(0, 1)` });
    } catch {
      return !1;
    }
    return !0;
  }, `linearEasing`),
  qh = ([e, t, n, r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`,
  Jh = {
    linear: `linear`,
    ease: `ease`,
    easeIn: `ease-in`,
    easeOut: `ease-out`,
    easeInOut: `ease-in-out`,
    circIn: qh([0, 0.65, 0.55, 1]),
    circOut: qh([0.55, 0, 1, 0.45]),
    backIn: qh([0.31, 0.01, 0.66, -0.59]),
    backOut: qh([0.33, 1.53, 0.69, 0.99]),
  };
function Yh(e, t) {
  if (e)
    return typeof e == `function`
      ? Kh()
        ? Fm(e, t)
        : `ease-out`
      : lp(e)
        ? qh(e)
        : Array.isArray(e)
          ? e.map((e) => Yh(e, t) || Jh.easeOut)
          : Jh[e];
}
function Xh(
  e,
  t,
  n,
  {
    delay: r = 0,
    duration: i = 300,
    repeat: a = 0,
    repeatType: o = `loop`,
    ease: s = `easeOut`,
    times: c,
  } = {},
  l = void 0,
) {
  let u = { [t]: n };
  c && (u.offset = c);
  let d = Yh(s, i);
  (Array.isArray(d) && (u.easing = d), mp.value && Tp.waapi++);
  let f = {
    delay: r,
    duration: i,
    easing: Array.isArray(d) ? `linear` : d,
    fill: `both`,
    iterations: a + 1,
    direction: o === `reverse` ? `alternate` : `normal`,
  };
  l && (f.pseudoElement = l);
  let p = e.animate(u, f);
  return (
    mp.value &&
      p.finished.finally(() => {
        Tp.waapi--;
      }),
    p
  );
}
function Zh(e) {
  return typeof e == `function` && `applyToOptions` in e;
}
function Qh({ type: e, ...t }) {
  return Zh(e) && Kh()
    ? e.applyToOptions(t)
    : ((t.duration ??= 300), (t.ease ??= `easeOut`), t);
}
var $h = class extends uh {
    constructor(e) {
      if (
        (super(),
        (this.finishedTime = null),
        (this.isStopped = !1),
        (this.manualStartTime = null),
        !e)
      )
        return;
      let {
        element: t,
        name: n,
        keyframes: r,
        pseudoElement: i,
        allowFlatten: a = !1,
        finalKeyframe: o,
        onComplete: s,
      } = e;
      ((this.isPseudoElement = !!i),
        (this.allowFlatten = a),
        (this.options = e),
        e.type);
      let c = Qh(e);
      ((this.animation = Xh(t, n, r, c, i)),
        c.autoplay === !1 && this.animation.pause(),
        (this.animation.onfinish = () => {
          if (((this.finishedTime = this.time), !i)) {
            let e = sh(r, this.options, o, this.speed);
            (this.updateMotionValue && this.updateMotionValue(e),
              Hh(t, n, e),
              this.animation.cancel());
          }
          (s?.(), this.notifyFinished());
        }));
    }
    play() {
      this.isStopped ||
        ((this.manualStartTime = null),
        this.animation.play(),
        this.state === `finished` && this.updateFinished());
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch {}
    }
    stop() {
      if (this.isStopped) return;
      this.isStopped = !0;
      let { state: e } = this;
      e === `idle` ||
        e === `finished` ||
        (this.updateMotionValue
          ? this.updateMotionValue()
          : this.commitStyles(),
        this.isPseudoElement || this.cancel());
    }
    commitStyles() {
      let e = this.options?.element;
      !this.isPseudoElement &&
        e?.isConnected &&
        this.animation.commitStyles?.();
    }
    get duration() {
      let e = this.animation.effect?.getComputedTiming?.().duration || 0;
      return Uf(Number(e));
    }
    get iterationDuration() {
      let { delay: e = 0 } = this.options || {};
      return this.duration + Uf(e);
    }
    get time() {
      return Uf(Number(this.animation.currentTime) || 0);
    }
    set time(e) {
      let t = this.finishedTime !== null;
      ((this.manualStartTime = null),
        (this.finishedTime = null),
        (this.animation.currentTime = Hf(e)),
        t && this.animation.pause());
    }
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(e) {
      (e < 0 && (this.finishedTime = null), (this.animation.playbackRate = e));
    }
    get state() {
      return this.finishedTime === null ? this.animation.playState : `finished`;
    }
    get startTime() {
      return this.manualStartTime ?? Number(this.animation.startTime);
    }
    set startTime(e) {
      this.manualStartTime = this.animation.startTime = e;
    }
    attachTimeline({ timeline: e, rangeStart: t, rangeEnd: n, observe: r }) {
      return (
        this.allowFlatten &&
          this.animation.effect?.updateTiming({ easing: `linear` }),
        (this.animation.onfinish = null),
        e && Gh()
          ? ((this.animation.timeline = e),
            t && (this.animation.rangeStart = t),
            n && (this.animation.rangeEnd = n),
            Lf)
          : r(this)
      );
    }
  },
  eg = { anticipate: tp, backInOut: ep, circInOut: ip };
function tg(e) {
  return e in eg;
}
function ng(e) {
  typeof e.ease == `string` && tg(e.ease) && (e.ease = eg[e.ease]);
}
var rg = 10,
  ig = class extends $h {
    constructor(e) {
      (ng(e),
        lh(e),
        super(e),
        e.startTime !== void 0 &&
          e.autoplay !== !1 &&
          (this.startTime = e.startTime),
        (this.options = e));
    }
    updateMotionValue(e) {
      let {
        motionValue: t,
        onUpdate: n,
        onComplete: r,
        element: i,
        ...a
      } = this.options;
      if (!t) return;
      if (e !== void 0) {
        t.set(e);
        return;
      }
      let o = new fh({ ...a, autoplay: !1 }),
        s = Math.max(rg, wp.now() - this.startTime),
        c = jf(0, rg, s - rg),
        l = o.sample(s).value,
        { name: u } = this.options;
      (i && u && Hh(i, u, l),
        t.setWithVelocity(o.sample(Math.max(0, s - c)).value, l, c),
        o.stop());
    }
  },
  ag = (e, t) =>
    t === `zIndex`
      ? !1
      : !!(
          typeof e == `number` ||
          Array.isArray(e) ||
          (typeof e == `string` &&
            (hm.test(e) || e === `0`) &&
            !e.startsWith(`url(`))
        );
function og(e) {
  let t = e[0];
  if (e.length === 1) return !0;
  for (let n = 0; n < e.length; n++) if (e[n] !== t) return !0;
}
function sg(e, t, n, r) {
  let i = e[0];
  if (i === null) return !1;
  if (t === `display` || t === `visibility`) return !0;
  let a = e[e.length - 1],
    o = ag(i, t),
    s = ag(a, t);
  return (
    `${t}${i}${a}${o ? a : i}`,
    !o || !s ? !1 : og(e) || ((n === `spring` || Zh(n)) && r)
  );
}
function cg(e) {
  ((e.duration = 0), (e.type = `keyframes`));
}
var lg = new Set([`opacity`, `clipPath`, `filter`, `transform`]),
  ug = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function dg(e) {
  for (let t = 0; t < e.length; t++)
    if (typeof e[t] == `string` && ug.test(e[t])) return !0;
  return !1;
}
var fg = new Set([
    `color`,
    `backgroundColor`,
    `outlineColor`,
    `fill`,
    `stroke`,
    `borderColor`,
    `borderTopColor`,
    `borderRightColor`,
    `borderBottomColor`,
    `borderLeftColor`,
  ]),
  pg = If(() => Object.hasOwnProperty.call(Element.prototype, `animate`));
function mg(e) {
  let {
    motionValue: t,
    name: n,
    repeatDelay: r,
    repeatType: i,
    damping: a,
    type: o,
    keyframes: s,
  } = e;
  if (!(t?.owner?.current instanceof HTMLElement)) return !1;
  let { onUpdate: c, transformTemplate: l } = t.owner.getProps();
  return (
    pg() &&
    n &&
    (lg.has(n) || (fg.has(n) && dg(s))) &&
    (n !== `transform` || !l) &&
    !c &&
    !r &&
    i !== `mirror` &&
    a !== 0 &&
    o !== `inertia`
  );
}
var hg = 40,
  gg = class extends uh {
    constructor({
      autoplay: e = !0,
      delay: t = 0,
      type: n = `keyframes`,
      repeat: r = 0,
      repeatDelay: i = 0,
      repeatType: a = `loop`,
      keyframes: o,
      name: s,
      motionValue: c,
      element: l,
      ...u
    }) {
      (super(),
        (this.stop = () => {
          (this._animation && (this._animation.stop(), this.stopTimeline?.()),
            this.keyframeResolver?.cancel());
        }),
        (this.createdAt = wp.now()));
      let d = {
        autoplay: e,
        delay: t,
        type: n,
        repeat: r,
        repeatDelay: i,
        repeatType: a,
        name: s,
        motionValue: c,
        element: l,
        ...u,
      };
      ((this.keyframeResolver = new (l?.KeyframeResolver || Bh)(
        o,
        (e, t, n) => this.onKeyframesResolved(e, t, d, !n),
        s,
        c,
        l,
      )),
        this.keyframeResolver?.scheduleResolve());
    }
    onKeyframesResolved(e, t, n, r) {
      this.keyframeResolver = void 0;
      let {
        name: i,
        type: a,
        velocity: o,
        delay: s,
        isHandoff: c,
        onUpdate: l,
      } = n;
      this.resolvedAt = wp.now();
      let u = !0;
      sg(e, i, a, o) ||
        ((u = !1),
        (Mf.instantAnimations || !s) && l?.(sh(e, n, t)),
        (e[0] = e[e.length - 1]),
        cg(n),
        (n.repeat = 0));
      let d = {
          startTime: r
            ? this.resolvedAt && this.resolvedAt - this.createdAt > hg
              ? this.resolvedAt
              : this.createdAt
            : void 0,
          finalKeyframe: t,
          ...n,
          keyframes: e,
        },
        f = u && !c && mg(d),
        p = d.motionValue?.owner?.current,
        m;
      if (f)
        try {
          m = new ig({ ...d, element: p });
        } catch {
          m = new fh(d);
        }
      else m = new fh(d);
      (m.finished
        .then(() => {
          this.notifyFinished();
        })
        .catch(Lf),
        (this.pendingTimeline &&=
          ((this.stopTimeline = m.attachTimeline(this.pendingTimeline)),
          void 0)),
        (this._animation = m));
    }
    get finished() {
      return this._animation ? this.animation.finished : this._finished;
    }
    then(e, t) {
      return this.finished.finally(e).then(() => {});
    }
    get animation() {
      return (
        this._animation || (this.keyframeResolver?.resume(), zh()),
        this._animation
      );
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(e) {
      this.animation.time = e;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(e) {
      this.animation.speed = e;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(e) {
      return (
        this._animation
          ? (this.stopTimeline = this.animation.attachTimeline(e))
          : (this.pendingTimeline = e),
        () => this.stop()
      );
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      (this._animation && this.animation.cancel(),
        this.keyframeResolver?.cancel());
    }
  };
function _g(e, t, n, r = 0, i = 1) {
  let a = Array.from(e)
      .sort((e, t) => e.sortNodePosition(t))
      .indexOf(t),
    o = e.size,
    s = (o - 1) * r;
  return typeof n == `function` ? n(a, o) : i === 1 ? a * r : s - a * r;
}
var vg = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function yg(e) {
  let t = vg.exec(e);
  if (!t) return [,];
  let [, n, r, i] = t;
  return [`--${n ?? r}`, i];
}
function bg(e, t, n = 1) {
  `${e}`;
  let [r, i] = yg(e);
  if (!r) return;
  let a = window.getComputedStyle(t).getPropertyValue(r);
  if (a) {
    let e = a.trim();
    return Nf(e) ? parseFloat(e) : e;
  }
  return kp(i) ? bg(i, t, n + 1) : i;
}
var xg = { type: `spring`, stiffness: 500, damping: 25, restSpeed: 10 },
  Sg = (e) => ({
    type: `spring`,
    stiffness: 550,
    damping: e === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  Cg = { type: `keyframes`, duration: 0.8 },
  wg = { type: `keyframes`, ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  Tg = (e, { keyframes: t }) =>
    t.length > 2
      ? Cg
      : Dh.has(e)
        ? e.startsWith(`scale`)
          ? Sg(t[1])
          : xg
        : wg;
function Eg(e, t) {
  if (e?.inherit && t) {
    let { inherit: n, ...r } = e;
    return { ...t, ...r };
  }
  return e;
}
function Dg(e, t) {
  let n = e?.[t] ?? e?.default ?? e;
  return n === e ? n : Eg(n, e);
}
var Og = new Set([
  `when`,
  `delay`,
  `delayChildren`,
  `staggerChildren`,
  `staggerDirection`,
  `repeat`,
  `repeatType`,
  `repeatDelay`,
  `from`,
  `elapsed`,
]);
function kg(e) {
  for (let t in e) if (!Og.has(t)) return !0;
  return !1;
}
var Ag =
  (e, t, n, r = {}, i, a) =>
  (o) => {
    let s = Dg(r, e) || {},
      c = s.delay || r.delay || 0,
      { elapsed: l = 0 } = r;
    l -= Hf(c);
    let u = {
      keyframes: Array.isArray(n) ? n : [null, n],
      ease: `easeOut`,
      velocity: t.getVelocity(),
      ...s,
      delay: -l,
      onUpdate: (e) => {
        (t.set(e), s.onUpdate && s.onUpdate(e));
      },
      onComplete: () => {
        (o(), s.onComplete && s.onComplete());
      },
      name: e,
      motionValue: t,
      element: a ? void 0 : i,
    };
    (kg(s) || Object.assign(u, Tg(e, u)),
      (u.duration &&= Hf(u.duration)),
      (u.repeatDelay &&= Hf(u.repeatDelay)),
      u.from !== void 0 && (u.keyframes[0] = u.from));
    let d = !1;
    if (
      ((u.type === !1 || (u.duration === 0 && !u.repeatDelay)) &&
        (cg(u), u.delay === 0 && (d = !0)),
      (Mf.instantAnimations || Mf.skipAnimations || i?.shouldSkipAnimations) &&
        ((d = !0), cg(u), (u.delay = 0)),
      (u.allowFlatten = !s.type && !s.ease),
      d && !a && t.get() !== void 0)
    ) {
      let e = sh(u.keyframes, s);
      if (e !== void 0) {
        vp.update(() => {
          (u.onUpdate(e), u.onComplete());
        });
        return;
      }
    }
    return s.isSync ? new fh(u) : new gg(u);
  };
function jg(e) {
  let t = [{}, {}];
  return (
    e?.values.forEach((e, n) => {
      ((t[0][n] = e.get()), (t[1][n] = e.getVelocity()));
    }),
    t
  );
}
function Mg(e, t, n, r) {
  if (typeof t == `function`) {
    let [i, a] = jg(r);
    t = t(n === void 0 ? e.custom : n, i, a);
  }
  if (
    (typeof t == `string` && (t = e.variants && e.variants[t]),
    typeof t == `function`)
  ) {
    let [i, a] = jg(r);
    t = t(n === void 0 ? e.custom : n, i, a);
  }
  return t;
}
function Ng(e, t, n) {
  let r = e.getProps();
  return Mg(r, t, n === void 0 ? r.custom : n, e);
}
var Pg = new Set([`width`, `height`, `top`, `left`, `right`, `bottom`, ...Eh]),
  Fg = 30,
  Ig = (e) => !isNaN(parseFloat(e)),
  Lg = { current: void 0 },
  Rg = class {
    constructor(e, t = {}) {
      ((this.canTrackVelocity = null),
        (this.events = {}),
        (this.updateAndNotify = (e) => {
          let t = wp.now();
          if (
            (this.updatedAt !== t && this.setPrevFrameValue(),
            (this.prev = this.current),
            this.setCurrent(e),
            this.current !== this.prev &&
              (this.events.change?.notify(this.current), this.dependents))
          )
            for (let e of this.dependents) e.dirty();
        }),
        (this.hasAnimated = !1),
        this.setCurrent(e),
        (this.owner = t.owner));
    }
    setCurrent(e) {
      ((this.current = e),
        (this.updatedAt = wp.now()),
        this.canTrackVelocity === null &&
          e !== void 0 &&
          (this.canTrackVelocity = Ig(this.current)));
    }
    setPrevFrameValue(e = this.current) {
      ((this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt));
    }
    onChange(e) {
      return this.on(`change`, e);
    }
    on(e, t) {
      this.events[e] || (this.events[e] = new Vf());
      let n = this.events[e].add(t);
      return e === `change`
        ? () => {
            (n(),
              vp.read(() => {
                this.events.change.getSize() || this.stop();
              }));
          }
        : n;
    }
    clearListeners() {
      for (let e in this.events) this.events[e].clear();
    }
    attach(e, t) {
      ((this.passiveEffect = e), (this.stopPassiveEffect = t));
    }
    set(e) {
      this.passiveEffect
        ? this.passiveEffect(e, this.updateAndNotify)
        : this.updateAndNotify(e);
    }
    setWithVelocity(e, t, n) {
      (this.set(t),
        (this.prev = void 0),
        (this.prevFrameValue = e),
        (this.prevUpdatedAt = this.updatedAt - n));
    }
    jump(e, t = !0) {
      (this.updateAndNotify(e),
        (this.prev = e),
        (this.prevUpdatedAt = this.prevFrameValue = void 0),
        t && this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect());
    }
    dirty() {
      this.events.change?.notify(this.current);
    }
    addDependent(e) {
      ((this.dependents ||= new Set()), this.dependents.add(e));
    }
    removeDependent(e) {
      this.dependents && this.dependents.delete(e);
    }
    get() {
      return (Lg.current && Lg.current.push(this), this.current);
    }
    getPrevious() {
      return this.prev;
    }
    getVelocity() {
      let e = wp.now();
      if (
        !this.canTrackVelocity ||
        this.prevFrameValue === void 0 ||
        e - this.updatedAt > Fg
      )
        return 0;
      let t = Math.min(this.updatedAt - this.prevUpdatedAt, Fg);
      return Wf(parseFloat(this.current) - parseFloat(this.prevFrameValue), t);
    }
    start(e) {
      return (
        this.stop(),
        new Promise((t) => {
          ((this.hasAnimated = !0),
            (this.animation = e(t)),
            this.events.animationStart && this.events.animationStart.notify());
        }).then(() => {
          (this.events.animationComplete &&
            this.events.animationComplete.notify(),
            this.clearAnimation());
        })
      );
    }
    stop() {
      (this.animation &&
        (this.animation.stop(),
        this.events.animationCancel && this.events.animationCancel.notify()),
        this.clearAnimation());
    }
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    destroy() {
      (this.dependents?.clear(),
        this.events.destroy?.notify(),
        this.clearListeners(),
        this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect());
    }
  };
function zg(e, t) {
  return new Rg(e, t);
}
var Bg = (e) => Array.isArray(e);
function Vg(e, t, n) {
  e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, zg(n));
}
function Hg(e) {
  return Bg(e) ? e[e.length - 1] || 0 : e;
}
function Ug(e, t) {
  let { transitionEnd: n = {}, transition: r = {}, ...i } = Ng(e, t) || {};
  i = { ...i, ...n };
  for (let t in i) Vg(e, t, Hg(i[t]));
}
var Wg = (e) => !!(e && e.getVelocity);
function Gg(e) {
  return !!(Wg(e) && e.add);
}
function Kg(e, t) {
  let n = e.getValue(`willChange`);
  if (Gg(n)) return n.add(t);
  if (!n && Mf.WillChange) {
    let n = new Mf.WillChange(`auto`);
    (e.addValue(`willChange`, n), n.add(t));
  }
}
function qg(e) {
  return e.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
var Jg = `data-` + qg(`framerAppearId`);
function Yg(e) {
  return e.props[Jg];
}
function Xg({ protectedKeys: e, needsAnimating: t }, n) {
  let r = e.hasOwnProperty(n) && t[n] !== !0;
  return ((t[n] = !1), r);
}
function Zg(e, t, { delay: n = 0, transitionOverride: r, type: i } = {}) {
  let { transition: a, transitionEnd: o, ...s } = t,
    c = e.getDefaultTransition();
  a = a ? Eg(a, c) : c;
  let l = a?.reduceMotion;
  r && (a = r);
  let u = [],
    d = i && e.animationState && e.animationState.getState()[i];
  for (let t in s) {
    let r = e.getValue(t, e.latestValues[t] ?? null),
      i = s[t];
    if (i === void 0 || (d && Xg(d, t))) continue;
    let o = { delay: n, ...Dg(a || {}, t) },
      c = r.get();
    if (
      c !== void 0 &&
      !r.isAnimating() &&
      !Array.isArray(i) &&
      i === c &&
      !o.velocity
    ) {
      vp.update(() => r.set(i));
      continue;
    }
    let f = !1;
    if (window.MotionHandoffAnimation) {
      let n = Yg(e);
      if (n) {
        let e = window.MotionHandoffAnimation(n, t, vp);
        e !== null && ((o.startTime = e), (f = !0));
      }
    }
    Kg(e, t);
    let p = l ?? e.shouldReduceMotion;
    r.start(Ag(t, r, i, p && Pg.has(t) ? { type: !1 } : o, e, f));
    let m = r.animation;
    m && u.push(m);
  }
  if (o) {
    let t = () =>
      vp.update(() => {
        o && Ug(e, o);
      });
    u.length ? Promise.all(u).then(t) : t();
  }
  return u;
}
function Qg(e, t, n = {}) {
  let r = Ng(e, t, n.type === `exit` ? e.presenceContext?.custom : void 0),
    { transition: i = e.getDefaultTransition() || {} } = r || {};
  n.transitionOverride && (i = n.transitionOverride);
  let a = r ? () => Promise.all(Zg(e, r, n)) : () => Promise.resolve(),
    o =
      e.variantChildren && e.variantChildren.size
        ? (r = 0) => {
            let {
              delayChildren: a = 0,
              staggerChildren: o,
              staggerDirection: s,
            } = i;
            return $g(e, t, r, a, o, s, n);
          }
        : () => Promise.resolve(),
    { when: s } = i;
  if (s) {
    let [e, t] = s === `beforeChildren` ? [a, o] : [o, a];
    return e().then(() => t());
  } else return Promise.all([a(), o(n.delay)]);
}
function $g(e, t, n = 0, r = 0, i = 0, a = 1, o) {
  let s = [];
  for (let c of e.variantChildren)
    (c.notify(`AnimationStart`, t),
      s.push(
        Qg(c, t, {
          ...o,
          delay:
            n +
            (typeof r == `function` ? 0 : r) +
            _g(e.variantChildren, c, r, i, a),
        }).then(() => c.notify(`AnimationComplete`, t)),
      ));
  return Promise.all(s);
}
function e_(e, t, n = {}) {
  e.notify(`AnimationStart`, t);
  let r;
  if (Array.isArray(t)) {
    let i = t.map((t) => Qg(e, t, n));
    r = Promise.all(i);
  } else if (typeof t == `string`) r = Qg(e, t, n);
  else {
    let i = typeof t == `function` ? Ng(e, t, n.custom) : t;
    r = Promise.all(Zg(e, i, n));
  }
  return r.then(() => {
    e.notify(`AnimationComplete`, t);
  });
}
var t_ = { test: (e) => e === `auto`, parse: (e) => e },
  n_ = (e) => (t) => t.test(e),
  r_ = [Mp, Z, Jp, qp, Xp, Yp, t_],
  i_ = (e) => r_.find(n_(e));
function a_(e) {
  return typeof e == `number`
    ? e === 0
    : e === null
      ? !0
      : e === `none` || e === `0` || Ff(e);
}
var o_ = new Set([`brightness`, `contrast`, `saturate`, `opacity`]);
function s_(e) {
  let [t, n] = e.slice(0, -1).split(`(`);
  if (t === `drop-shadow`) return e;
  let [r] = n.match(Ip) || [];
  if (!r) return e;
  let i = n.replace(r, ``),
    a = +!!o_.has(t);
  return (r !== n && (a *= 100), t + `(` + a + i + `)`);
}
var c_ = /\b([a-z-]*)\(.*?\)/gu,
  l_ = {
    ...hm,
    getAnimatableNone: (e) => {
      let t = e.match(c_);
      return t ? t.map(s_).join(` `) : e;
    },
  },
  u_ = {
    ...hm,
    getAnimatableNone: (e) => {
      let t = hm.parse(e);
      return hm.createTransformer(e)(
        t.map((e) =>
          typeof e == `number`
            ? 0
            : typeof e == `object`
              ? { ...e, alpha: 1 }
              : e,
        ),
      );
    },
  },
  d_ = { ...Mp, transform: Math.round },
  f_ = {
    borderWidth: Z,
    borderTopWidth: Z,
    borderRightWidth: Z,
    borderBottomWidth: Z,
    borderLeftWidth: Z,
    borderRadius: Z,
    borderTopLeftRadius: Z,
    borderTopRightRadius: Z,
    borderBottomRightRadius: Z,
    borderBottomLeftRadius: Z,
    width: Z,
    maxWidth: Z,
    height: Z,
    maxHeight: Z,
    top: Z,
    right: Z,
    bottom: Z,
    left: Z,
    inset: Z,
    insetBlock: Z,
    insetBlockStart: Z,
    insetBlockEnd: Z,
    insetInline: Z,
    insetInlineStart: Z,
    insetInlineEnd: Z,
    padding: Z,
    paddingTop: Z,
    paddingRight: Z,
    paddingBottom: Z,
    paddingLeft: Z,
    paddingBlock: Z,
    paddingBlockStart: Z,
    paddingBlockEnd: Z,
    paddingInline: Z,
    paddingInlineStart: Z,
    paddingInlineEnd: Z,
    margin: Z,
    marginTop: Z,
    marginRight: Z,
    marginBottom: Z,
    marginLeft: Z,
    marginBlock: Z,
    marginBlockStart: Z,
    marginBlockEnd: Z,
    marginInline: Z,
    marginInlineStart: Z,
    marginInlineEnd: Z,
    fontSize: Z,
    backgroundPositionX: Z,
    backgroundPositionY: Z,
    rotate: qp,
    rotateX: qp,
    rotateY: qp,
    rotateZ: qp,
    scale: Pp,
    scaleX: Pp,
    scaleY: Pp,
    scaleZ: Pp,
    skew: qp,
    skewX: qp,
    skewY: qp,
    distance: Z,
    translateX: Z,
    translateY: Z,
    translateZ: Z,
    x: Z,
    y: Z,
    z: Z,
    perspective: Z,
    transformPerspective: Z,
    opacity: Np,
    originX: Zp,
    originY: Zp,
    originZ: Z,
    zIndex: d_,
    fillOpacity: Np,
    strokeOpacity: Np,
    numOctaves: d_,
  },
  p_ = {
    ...f_,
    color: $p,
    backgroundColor: $p,
    outlineColor: $p,
    fill: $p,
    stroke: $p,
    borderColor: $p,
    borderTopColor: $p,
    borderRightColor: $p,
    borderBottomColor: $p,
    borderLeftColor: $p,
    filter: l_,
    WebkitFilter: l_,
    mask: u_,
    WebkitMask: u_,
  },
  m_ = (e) => p_[e],
  h_ = new Set([l_, u_]);
function g_(e, t) {
  let n = m_(e);
  return (
    h_.has(n) || (n = hm),
    n.getAnimatableNone ? n.getAnimatableNone(t) : void 0
  );
}
var __ = new Set([`auto`, `none`, `0`]);
function v_(e, t, n) {
  let r = 0,
    i;
  for (; r < e.length && !i; ) {
    let t = e[r];
    (typeof t == `string` && !__.has(t) && cm(t).values.length && (i = e[r]),
      r++);
  }
  if (i && n) for (let r of t) e[r] = g_(n, i);
}
var y_ = class extends Bh {
  constructor(e, t, n, r, i) {
    super(e, t, n, r, i, !0);
  }
  readKeyframes() {
    let { unresolvedKeyframes: e, element: t, name: n } = this;
    if (!t || !t.current) return;
    super.readKeyframes();
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (typeof r == `string` && ((r = r.trim()), kp(r))) {
        let i = bg(r, t.current);
        (i !== void 0 && (e[n] = i),
          n === e.length - 1 && (this.finalKeyframe = r));
      }
    }
    if ((this.resolveNoneKeyframes(), !Pg.has(n) || e.length !== 2)) return;
    let [r, i] = e,
      a = i_(r),
      o = i_(i);
    if (jp(r) !== jp(i) && Mh[n]) {
      this.needsMeasurement = !0;
      return;
    }
    if (a !== o)
      if (Oh(a) && Oh(o))
        for (let t = 0; t < e.length; t++) {
          let n = e[t];
          typeof n == `string` && (e[t] = parseFloat(n));
        }
      else Mh[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    let { unresolvedKeyframes: e, name: t } = this,
      n = [];
    for (let t = 0; t < e.length; t++) (e[t] === null || a_(e[t])) && n.push(t);
    n.length && v_(e, n, t);
  }
  measureInitialState() {
    let { element: e, unresolvedKeyframes: t, name: n } = this;
    if (!e || !e.current) return;
    (n === `height` && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = Mh[n](
        e.measureViewportBox(),
        window.getComputedStyle(e.current),
      )),
      (t[0] = this.measuredOrigin));
    let r = t[t.length - 1];
    r !== void 0 && e.getValue(n, r).jump(r, !1);
  }
  measureEndState() {
    let { element: e, name: t, unresolvedKeyframes: n } = this;
    if (!e || !e.current) return;
    let r = e.getValue(t);
    r && r.jump(this.measuredOrigin, !1);
    let i = n.length - 1,
      a = n[i];
    ((n[i] = Mh[t](e.measureViewportBox(), window.getComputedStyle(e.current))),
      a !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = a),
      this.removedTransforms?.length &&
        this.removedTransforms.forEach(([t, n]) => {
          e.getValue(t).set(n);
        }),
      this.resolveNoneKeyframes());
  }
};
function b_(e, t, n) {
  if (e == null) return [];
  if (e instanceof EventTarget) return [e];
  if (typeof e == `string`) {
    let r = document;
    t && (r = t.current);
    let i = n?.[e] ?? r.querySelectorAll(e);
    return i ? Array.from(i) : [];
  }
  return Array.from(e).filter((e) => e != null);
}
var x_ = (e, t) => (t && typeof e == `number` ? t.transform(e) : e);
function S_(e) {
  return Pf(e) && `offsetHeight` in e && !(`ownerSVGElement` in e);
}
var { schedule: C_, cancel: w_ } = _p(queueMicrotask, !1),
  T_ = { x: !1, y: !1 };
function E_() {
  return T_.x || T_.y;
}
function D_(e) {
  return e === `x` || e === `y`
    ? T_[e]
      ? null
      : ((T_[e] = !0),
        () => {
          T_[e] = !1;
        })
    : T_.x || T_.y
      ? null
      : ((T_.x = T_.y = !0),
        () => {
          T_.x = T_.y = !1;
        });
}
function O_(e, t) {
  let n = b_(e),
    r = new AbortController();
  return [n, { passive: !0, ...t, signal: r.signal }, () => r.abort()];
}
function k_(e) {
  return !(e.pointerType === `touch` || E_());
}
function A_(e, t, n = {}) {
  let [r, i, a] = O_(e, n);
  return (
    r.forEach((e) => {
      let n = !1,
        r = !1,
        a,
        o = () => {
          e.removeEventListener(`pointerleave`, u);
        },
        s = (e) => {
          ((a &&= (a(e), void 0)), o());
        },
        c = (e) => {
          ((n = !1),
            window.removeEventListener(`pointerup`, c),
            window.removeEventListener(`pointercancel`, c),
            r && ((r = !1), s(e)));
        },
        l = () => {
          ((n = !0),
            window.addEventListener(`pointerup`, c, i),
            window.addEventListener(`pointercancel`, c, i));
        },
        u = (e) => {
          if (e.pointerType !== `touch`) {
            if (n) {
              r = !0;
              return;
            }
            s(e);
          }
        };
      (e.addEventListener(
        `pointerenter`,
        (n) => {
          if (!k_(n)) return;
          r = !1;
          let o = t(e, n);
          typeof o == `function` &&
            ((a = o), e.addEventListener(`pointerleave`, u, i));
        },
        i,
      ),
        e.addEventListener(`pointerdown`, l, i));
    }),
    a
  );
}
var j_ = (e, t) => (t ? (e === t ? !0 : j_(e, t.parentElement)) : !1),
  M_ = (e) =>
    e.pointerType === `mouse`
      ? typeof e.button != `number` || e.button <= 0
      : e.isPrimary !== !1,
  N_ = new Set([`BUTTON`, `INPUT`, `SELECT`, `TEXTAREA`, `A`]);
function P_(e) {
  return N_.has(e.tagName) || e.isContentEditable === !0;
}
var F_ = new Set([`INPUT`, `SELECT`, `TEXTAREA`]);
function I_(e) {
  return F_.has(e.tagName) || e.isContentEditable === !0;
}
var L_ = new WeakSet();
function R_(e) {
  return (t) => {
    t.key === `Enter` && e(t);
  };
}
function z_(e, t) {
  e.dispatchEvent(
    new PointerEvent(`pointer` + t, { isPrimary: !0, bubbles: !0 }),
  );
}
var B_ = (e, t) => {
  let n = e.currentTarget;
  if (!n) return;
  let r = R_(() => {
    if (L_.has(n)) return;
    z_(n, `down`);
    let e = R_(() => {
      z_(n, `up`);
    });
    (n.addEventListener(`keyup`, e, t),
      n.addEventListener(`blur`, () => z_(n, `cancel`), t));
  });
  (n.addEventListener(`keydown`, r, t),
    n.addEventListener(`blur`, () => n.removeEventListener(`keydown`, r), t));
};
function V_(e) {
  return M_(e) && !E_();
}
var H_ = new WeakSet();
function U_(e, t, n = {}) {
  let [r, i, a] = O_(e, n),
    o = (e) => {
      let r = e.currentTarget;
      if (!V_(e) || H_.has(e)) return;
      (L_.add(r), n.stopPropagation && H_.add(e));
      let a = t(r, e),
        o = (e, t) => {
          (window.removeEventListener(`pointerup`, s),
            window.removeEventListener(`pointercancel`, c),
            L_.has(r) && L_.delete(r),
            V_(e) && typeof a == `function` && a(e, { success: t }));
        },
        s = (e) => {
          o(
            e,
            r === window ||
              r === document ||
              n.useGlobalTarget ||
              j_(r, e.target),
          );
        },
        c = (e) => {
          o(e, !1);
        };
      (window.addEventListener(`pointerup`, s, i),
        window.addEventListener(`pointercancel`, c, i));
    };
  return (
    r.forEach((e) => {
      ((n.useGlobalTarget ? window : e).addEventListener(`pointerdown`, o, i),
        S_(e) &&
          (e.addEventListener(`focus`, (e) => B_(e, i)),
          !P_(e) && !e.hasAttribute(`tabindex`) && (e.tabIndex = 0)));
    }),
    a
  );
}
function W_(e) {
  return Pf(e) && `ownerSVGElement` in e;
}
var G_ = new WeakMap(),
  K_,
  q_ = (e, t, n) => (r, i) =>
    i && i[0]
      ? i[0][e + `Size`]
      : W_(r) && `getBBox` in r
        ? r.getBBox()[t]
        : r[n],
  J_ = q_(`inline`, `width`, `offsetWidth`),
  Y_ = q_(`block`, `height`, `offsetHeight`);
function X_({ target: e, borderBoxSize: t }) {
  G_.get(e)?.forEach((n) => {
    n(e, {
      get width() {
        return J_(e, t);
      },
      get height() {
        return Y_(e, t);
      },
    });
  });
}
function Z_(e) {
  e.forEach(X_);
}
function Q_() {
  typeof ResizeObserver > `u` || (K_ = new ResizeObserver(Z_));
}
function $_(e, t) {
  K_ || Q_();
  let n = b_(e);
  return (
    n.forEach((e) => {
      let n = G_.get(e);
      (n || ((n = new Set()), G_.set(e, n)), n.add(t), K_?.observe(e));
    }),
    () => {
      n.forEach((e) => {
        let n = G_.get(e);
        (n?.delete(t), n?.size || K_?.unobserve(e));
      });
    }
  );
}
var ev = new Set(),
  tv;
function nv() {
  ((tv = () => {
    let e = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      },
    };
    ev.forEach((t) => t(e));
  }),
    window.addEventListener(`resize`, tv));
}
function rv(e) {
  return (
    ev.add(e),
    tv || nv(),
    () => {
      (ev.delete(e),
        !ev.size &&
          typeof tv == `function` &&
          (window.removeEventListener(`resize`, tv), (tv = void 0)));
    }
  );
}
function iv(e, t) {
  return typeof e == `function` ? rv(e) : $_(e, t);
}
function av(e) {
  return W_(e) && e.tagName === `svg`;
}
var ov = [...r_, $p, hm],
  sv = (e) => ov.find(n_(e)),
  cv = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  lv = () => ({ x: cv(), y: cv() }),
  uv = () => ({ min: 0, max: 0 }),
  dv = () => ({ x: uv(), y: uv() }),
  fv = new WeakMap();
function pv(e) {
  return typeof e == `object` && !!e && typeof e.start == `function`;
}
function mv(e) {
  return typeof e == `string` || Array.isArray(e);
}
var hv = [
    `animate`,
    `whileInView`,
    `whileFocus`,
    `whileHover`,
    `whileTap`,
    `whileDrag`,
    `exit`,
  ],
  gv = [`initial`, ...hv];
function _v(e) {
  return pv(e.animate) || gv.some((t) => mv(e[t]));
}
function vv(e) {
  return !!(_v(e) || e.variants);
}
function yv(e, t, n) {
  for (let r in t) {
    let i = t[r],
      a = n[r];
    if (Wg(i)) e.addValue(r, i);
    else if (Wg(a)) e.addValue(r, zg(i, { owner: e }));
    else if (a !== i)
      if (e.hasValue(r)) {
        let t = e.getValue(r);
        t.liveStyle === !0 ? t.jump(i) : t.hasAnimated || t.set(i);
      } else {
        let t = e.getStaticValue(r);
        e.addValue(r, zg(t === void 0 ? i : t, { owner: e }));
      }
  }
  for (let r in n) t[r] === void 0 && e.removeValue(r);
  return t;
}
var bv = { current: null },
  xv = { current: !1 },
  Sv = typeof window < `u`;
function Cv() {
  if (((xv.current = !0), Sv))
    if (window.matchMedia) {
      let e = window.matchMedia(`(prefers-reduced-motion)`),
        t = () => (bv.current = e.matches);
      (e.addEventListener(`change`, t), t());
    } else bv.current = !1;
}
var wv = [
    `AnimationStart`,
    `AnimationComplete`,
    `Update`,
    `BeforeLayoutMeasure`,
    `LayoutMeasure`,
    `LayoutAnimationStart`,
    `LayoutAnimationComplete`,
  ],
  Tv = {};
function Ev(e) {
  Tv = e;
}
function Dv() {
  return Tv;
}
var Ov = class {
    scrapeMotionValuesFromProps(e, t, n) {
      return {};
    }
    constructor(
      {
        parent: e,
        props: t,
        presenceContext: n,
        reducedMotionConfig: r,
        skipAnimations: i,
        blockInitialAnimation: a,
        visualState: o,
      },
      s = {},
    ) {
      ((this.current = null),
        (this.children = new Set()),
        (this.isVariantNode = !1),
        (this.isControllingVariants = !1),
        (this.shouldReduceMotion = null),
        (this.shouldSkipAnimations = !1),
        (this.values = new Map()),
        (this.KeyframeResolver = Bh),
        (this.features = {}),
        (this.valueSubscriptions = new Map()),
        (this.prevMotionValues = {}),
        (this.hasBeenMounted = !1),
        (this.events = {}),
        (this.propEventSubscriptions = {}),
        (this.notifyUpdate = () => this.notify(`Update`, this.latestValues)),
        (this.render = () => {
          this.current &&
            (this.triggerBuild(),
            this.renderInstance(
              this.current,
              this.renderState,
              this.props.style,
              this.projection,
            ));
        }),
        (this.renderScheduledAt = 0),
        (this.scheduleRender = () => {
          let e = wp.now();
          this.renderScheduledAt < e &&
            ((this.renderScheduledAt = e), vp.render(this.render, !1, !0));
        }));
      let { latestValues: c, renderState: l } = o;
      ((this.latestValues = c),
        (this.baseTarget = { ...c }),
        (this.initialValues = t.initial ? { ...c } : {}),
        (this.renderState = l),
        (this.parent = e),
        (this.props = t),
        (this.presenceContext = n),
        (this.depth = e ? e.depth + 1 : 0),
        (this.reducedMotionConfig = r),
        (this.skipAnimationsConfig = i),
        (this.options = s),
        (this.blockInitialAnimation = !!a),
        (this.isControllingVariants = _v(t)),
        (this.isVariantNode = vv(t)),
        this.isVariantNode && (this.variantChildren = new Set()),
        (this.manuallyAnimateOnMount = !!(e && e.current)));
      let { willChange: u, ...d } = this.scrapeMotionValuesFromProps(
        t,
        {},
        this,
      );
      for (let e in d) {
        let t = d[e];
        c[e] !== void 0 && Wg(t) && t.set(c[e]);
      }
    }
    mount(e) {
      if (this.hasBeenMounted)
        for (let e in this.initialValues)
          (this.values.get(e)?.jump(this.initialValues[e]),
            (this.latestValues[e] = this.initialValues[e]));
      ((this.current = e),
        fv.set(e, this),
        this.projection &&
          !this.projection.instance &&
          this.projection.mount(e),
        this.parent &&
          this.isVariantNode &&
          !this.isControllingVariants &&
          (this.removeFromVariantTree = this.parent.addVariantChild(this)),
        this.values.forEach((e, t) => this.bindToMotionValue(t, e)),
        this.reducedMotionConfig === `never`
          ? (this.shouldReduceMotion = !1)
          : this.reducedMotionConfig === `always`
            ? (this.shouldReduceMotion = !0)
            : (xv.current || Cv(), (this.shouldReduceMotion = bv.current)),
        (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
        this.parent?.addChild(this),
        this.update(this.props, this.presenceContext),
        (this.hasBeenMounted = !0));
    }
    unmount() {
      (this.projection && this.projection.unmount(),
        yp(this.notifyUpdate),
        yp(this.render),
        this.valueSubscriptions.forEach((e) => e()),
        this.valueSubscriptions.clear(),
        this.removeFromVariantTree && this.removeFromVariantTree(),
        this.parent?.removeChild(this));
      for (let e in this.events) this.events[e].clear();
      for (let e in this.features) {
        let t = this.features[e];
        t && (t.unmount(), (t.isMounted = !1));
      }
      this.current = null;
    }
    addChild(e) {
      (this.children.add(e),
        (this.enteringChildren ??= new Set()),
        this.enteringChildren.add(e));
    }
    removeChild(e) {
      (this.children.delete(e),
        this.enteringChildren && this.enteringChildren.delete(e));
    }
    bindToMotionValue(e, t) {
      if (
        (this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)(),
        t.accelerate && lg.has(e) && this.current instanceof HTMLElement)
      ) {
        let {
            factory: n,
            keyframes: r,
            times: i,
            ease: a,
            duration: o,
          } = t.accelerate,
          s = new $h({
            element: this.current,
            name: e,
            keyframes: r,
            times: i,
            ease: a,
            duration: Hf(o),
          }),
          c = n(s);
        this.valueSubscriptions.set(e, () => {
          (c(), s.cancel());
        });
        return;
      }
      let n = Dh.has(e);
      n && this.onBindTransform && this.onBindTransform();
      let r = t.on(`change`, (t) => {
          ((this.latestValues[e] = t),
            this.props.onUpdate && vp.preRender(this.notifyUpdate),
            n && this.projection && (this.projection.isTransformDirty = !0),
            this.scheduleRender());
        }),
        i;
      (typeof window < `u` &&
        window.MotionCheckAppearSync &&
        (i = window.MotionCheckAppearSync(this, e, t)),
        this.valueSubscriptions.set(e, () => {
          (r(), i && i(), t.owner && t.stop());
        }));
    }
    sortNodePosition(e) {
      return !this.current ||
        !this.sortInstanceNodePosition ||
        this.type !== e.type
        ? 0
        : this.sortInstanceNodePosition(this.current, e.current);
    }
    updateFeatures() {
      let e = `animation`;
      for (e in Tv) {
        let t = Tv[e];
        if (!t) continue;
        let { isEnabled: n, Feature: r } = t;
        if (
          (!this.features[e] &&
            r &&
            n(this.props) &&
            (this.features[e] = new r(this)),
          this.features[e])
        ) {
          let t = this.features[e];
          t.isMounted ? t.update() : (t.mount(), (t.isMounted = !0));
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
    measureViewportBox() {
      return this.current
        ? this.measureInstanceViewportBox(this.current, this.props)
        : dv();
    }
    getStaticValue(e) {
      return this.latestValues[e];
    }
    setStaticValue(e, t) {
      this.latestValues[e] = t;
    }
    update(e, t) {
      ((e.transformTemplate || this.props.transformTemplate) &&
        this.scheduleRender(),
        (this.prevProps = this.props),
        (this.props = e),
        (this.prevPresenceContext = this.presenceContext),
        (this.presenceContext = t));
      for (let t = 0; t < wv.length; t++) {
        let n = wv[t];
        this.propEventSubscriptions[n] &&
          (this.propEventSubscriptions[n](),
          delete this.propEventSubscriptions[n]);
        let r = e[`on` + n];
        r && (this.propEventSubscriptions[n] = this.on(n, r));
      }
      ((this.prevMotionValues = yv(
        this,
        this.scrapeMotionValuesFromProps(e, this.prevProps || {}, this),
        this.prevMotionValues,
      )),
        this.handleChildMotionValue && this.handleChildMotionValue());
    }
    getProps() {
      return this.props;
    }
    getVariant(e) {
      return this.props.variants ? this.props.variants[e] : void 0;
    }
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode
        ? this
        : this.parent
          ? this.parent.getClosestVariantNode()
          : void 0;
    }
    addVariantChild(e) {
      let t = this.getClosestVariantNode();
      if (t)
        return (
          t.variantChildren && t.variantChildren.add(e),
          () => t.variantChildren.delete(e)
        );
    }
    addValue(e, t) {
      let n = this.values.get(e);
      t !== n &&
        (n && this.removeValue(e),
        this.bindToMotionValue(e, t),
        this.values.set(e, t),
        (this.latestValues[e] = t.get()));
    }
    removeValue(e) {
      this.values.delete(e);
      let t = this.valueSubscriptions.get(e);
      (t && (t(), this.valueSubscriptions.delete(e)),
        delete this.latestValues[e],
        this.removeValueFromRenderState(e, this.renderState));
    }
    hasValue(e) {
      return this.values.has(e);
    }
    getValue(e, t) {
      if (this.props.values && this.props.values[e])
        return this.props.values[e];
      let n = this.values.get(e);
      return (
        n === void 0 &&
          t !== void 0 &&
          ((n = zg(t === null ? void 0 : t, { owner: this })),
          this.addValue(e, n)),
        n
      );
    }
    readValue(e, t) {
      let n =
        this.latestValues[e] !== void 0 || !this.current
          ? this.latestValues[e]
          : (this.getBaseTargetFromProps(this.props, e) ??
            this.readValueFromInstance(this.current, e, this.options));
      return (
        n != null &&
          (typeof n == `string` && (Nf(n) || Ff(n))
            ? (n = parseFloat(n))
            : !sv(n) && hm.test(t) && (n = g_(e, t)),
          this.setBaseTarget(e, Wg(n) ? n.get() : n)),
        Wg(n) ? n.get() : n
      );
    }
    setBaseTarget(e, t) {
      this.baseTarget[e] = t;
    }
    getBaseTarget(e) {
      let { initial: t } = this.props,
        n;
      if (typeof t == `string` || typeof t == `object`) {
        let r = Mg(this.props, t, this.presenceContext?.custom);
        r && (n = r[e]);
      }
      if (t && n !== void 0) return n;
      let r = this.getBaseTargetFromProps(this.props, e);
      return r !== void 0 && !Wg(r)
        ? r
        : this.initialValues[e] !== void 0 && n === void 0
          ? void 0
          : this.baseTarget[e];
    }
    on(e, t) {
      return (
        this.events[e] || (this.events[e] = new Vf()),
        this.events[e].add(t)
      );
    }
    notify(e, ...t) {
      this.events[e] && this.events[e].notify(...t);
    }
    scheduleRenderMicrotask() {
      C_.render(this.render);
    }
  },
  kv = class extends Ov {
    constructor() {
      (super(...arguments), (this.KeyframeResolver = y_));
    }
    sortInstanceNodePosition(e, t) {
      return e.compareDocumentPosition(t) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(e, t) {
      let n = e.style;
      return n ? n[t] : void 0;
    }
    removeValueFromRenderState(e, { vars: t, style: n }) {
      (delete t[e], delete n[e]);
    }
    handleChildMotionValue() {
      this.childSubscription &&
        (this.childSubscription(), delete this.childSubscription);
      let { children: e } = this.props;
      Wg(e) &&
        (this.childSubscription = e.on(`change`, (e) => {
          this.current && (this.current.textContent = `${e}`);
        }));
    }
  },
  Av = class {
    constructor(e) {
      ((this.isMounted = !1), (this.node = e));
    }
    update() {}
  };
function jv({ top: e, left: t, right: n, bottom: r }) {
  return { x: { min: t, max: n }, y: { min: e, max: r } };
}
function Mv({ x: e, y: t }) {
  return { top: t.min, right: e.max, bottom: t.max, left: e.min };
}
function Nv(e, t) {
  if (!t) return e;
  let n = t({ x: e.left, y: e.top }),
    r = t({ x: e.right, y: e.bottom });
  return { top: n.y, left: n.x, bottom: r.y, right: r.x };
}
function Pv(e) {
  return e === void 0 || e === 1;
}
function Fv({ scale: e, scaleX: t, scaleY: n }) {
  return !Pv(e) || !Pv(t) || !Pv(n);
}
function Iv(e) {
  return (
    Fv(e) ||
    Lv(e) ||
    e.z ||
    e.rotate ||
    e.rotateX ||
    e.rotateY ||
    e.skewX ||
    e.skewY
  );
}
function Lv(e) {
  return Rv(e.x) || Rv(e.y);
}
function Rv(e) {
  return e && e !== `0%`;
}
function zv(e, t, n) {
  return n + t * (e - n);
}
function Bv(e, t, n, r, i) {
  return (i !== void 0 && (e = zv(e, i, r)), zv(e, n, r) + t);
}
function Vv(e, t = 0, n = 1, r, i) {
  ((e.min = Bv(e.min, t, n, r, i)), (e.max = Bv(e.max, t, n, r, i)));
}
function Hv(e, { x: t, y: n }) {
  (Vv(e.x, t.translate, t.scale, t.originPoint),
    Vv(e.y, n.translate, n.scale, n.originPoint));
}
var Uv = 0.999999999999,
  Wv = 1.0000000000001;
function Gv(e, t, n, r = !1) {
  let i = n.length;
  if (!i) return;
  t.x = t.y = 1;
  let a, o;
  for (let s = 0; s < i; s++) {
    ((a = n[s]), (o = a.projectionDelta));
    let { visualElement: i } = a.options;
    (i && i.props.style && i.props.style.display === `contents`) ||
      (r &&
        a.options.layoutScroll &&
        a.scroll &&
        a !== a.root &&
        (Kv(e.x, -a.scroll.offset.x), Kv(e.y, -a.scroll.offset.y)),
      o && ((t.x *= o.x.scale), (t.y *= o.y.scale), Hv(e, o)),
      r && Iv(a.latestValues) && Yv(e, a.latestValues, a.layout?.layoutBox));
  }
  (t.x < Wv && t.x > Uv && (t.x = 1), t.y < Wv && t.y > Uv && (t.y = 1));
}
function Kv(e, t) {
  ((e.min += t), (e.max += t));
}
function qv(e, t, n, r, i = 0.5) {
  Vv(e, t, n, ym(e.min, e.max, i), r);
}
function Jv(e, t) {
  return typeof e == `string` ? (parseFloat(e) / 100) * (t.max - t.min) : e;
}
function Yv(e, t, n) {
  let r = n ?? e;
  (qv(e.x, Jv(t.x, r.x), t.scaleX, t.scale, t.originX),
    qv(e.y, Jv(t.y, r.y), t.scaleY, t.scale, t.originY));
}
function Xv(e, t) {
  return jv(Nv(e.getBoundingClientRect(), t));
}
function Zv(e, t, n) {
  let r = Xv(e, n),
    { scroll: i } = t;
  return (i && (Kv(r.x, i.offset.x), Kv(r.y, i.offset.y)), r);
}
var Qv = {
    x: `translateX`,
    y: `translateY`,
    z: `translateZ`,
    transformPerspective: `perspective`,
  },
  $v = Eh.length;
function ey(e, t, n) {
  let r = ``,
    i = !0;
  for (let a = 0; a < $v; a++) {
    let o = Eh[a],
      s = e[o];
    if (s === void 0) continue;
    let c = !0;
    if (typeof s == `number`) c = s === +!!o.startsWith(`scale`);
    else {
      let e = parseFloat(s);
      c = o.startsWith(`scale`) ? e === 1 : e === 0;
    }
    if (!c || n) {
      let e = x_(s, f_[o]);
      if (!c) {
        i = !1;
        let t = Qv[o] || o;
        r += `${t}(${e}) `;
      }
      n && (t[o] = e);
    }
  }
  return ((r = r.trim()), n ? (r = n(t, i ? `` : r)) : i && (r = `none`), r);
}
function ty(e, t, n) {
  let { style: r, vars: i, transformOrigin: a } = e,
    o = !1,
    s = !1;
  for (let e in t) {
    let n = t[e];
    if (Dh.has(e)) {
      o = !0;
      continue;
    } else if (Dp(e)) {
      i[e] = n;
      continue;
    } else {
      let t = x_(n, f_[e]);
      e.startsWith(`origin`) ? ((s = !0), (a[e] = t)) : (r[e] = t);
    }
  }
  if (
    (t.transform ||
      (o || n
        ? (r.transform = ey(t, e.transform, n))
        : (r.transform &&= `none`)),
    s)
  ) {
    let { originX: e = `50%`, originY: t = `50%`, originZ: n = 0 } = a;
    r.transformOrigin = `${e} ${t} ${n}`;
  }
}
function ny(e, { style: t, vars: n }, r, i) {
  let a = e.style,
    o;
  for (o in t) a[o] = t[o];
  for (o in (i?.applyProjectionStyles(a, r), n)) a.setProperty(o, n[o]);
}
function ry(e, t) {
  return t.max === t.min ? 0 : (e / (t.max - t.min)) * 100;
}
var iy = {
    correct: (e, t) => {
      if (!t.target) return e;
      if (typeof e == `string`)
        if (Z.test(e)) e = parseFloat(e);
        else return e;
      return `${ry(e, t.target.x)}% ${ry(e, t.target.y)}%`;
    },
  },
  ay = {
    correct: (e, { treeScale: t, projectionDelta: n }) => {
      let r = e,
        i = hm.parse(e);
      if (i.length > 5) return r;
      let a = hm.createTransformer(e),
        o = typeof i[0] == `number` ? 0 : 1,
        s = n.x.scale * t.x,
        c = n.y.scale * t.y;
      ((i[0 + o] /= s), (i[1 + o] /= c));
      let l = ym(s, c, 0.5);
      return (
        typeof i[2 + o] == `number` && (i[2 + o] /= l),
        typeof i[3 + o] == `number` && (i[3 + o] /= l),
        a(i)
      );
    },
  },
  oy = {
    borderRadius: {
      ...iy,
      applyTo: [
        `borderTopLeftRadius`,
        `borderTopRightRadius`,
        `borderBottomLeftRadius`,
        `borderBottomRightRadius`,
      ],
    },
    borderTopLeftRadius: iy,
    borderTopRightRadius: iy,
    borderBottomLeftRadius: iy,
    borderBottomRightRadius: iy,
    boxShadow: ay,
  };
function sy(e, { layout: t, layoutId: n }) {
  return (
    Dh.has(e) ||
    e.startsWith(`origin`) ||
    ((t || n !== void 0) && (!!oy[e] || e === `opacity`))
  );
}
function cy(e, t, n) {
  let r = e.style,
    i = t?.style,
    a = {};
  if (!r) return a;
  for (let t in r)
    (Wg(r[t]) ||
      (i && Wg(i[t])) ||
      sy(t, e) ||
      n?.getValue(t)?.liveStyle !== void 0) &&
      (a[t] = r[t]);
  return a;
}
function ly(e) {
  return window.getComputedStyle(e);
}
var uy = class extends kv {
    constructor() {
      (super(...arguments), (this.type = `html`), (this.renderInstance = ny));
    }
    readValueFromInstance(e, t) {
      if (Dh.has(t)) return this.projection?.isProjecting ? Sh(t) : wh(e, t);
      {
        let n = ly(e),
          r = (Dp(t) ? n.getPropertyValue(t) : n[t]) || 0;
        return typeof r == `string` ? r.trim() : r;
      }
    }
    measureInstanceViewportBox(e, { transformPagePoint: t }) {
      return Xv(e, t);
    }
    build(e, t, n) {
      ty(e, t, n.transformTemplate);
    }
    scrapeMotionValuesFromProps(e, t, n) {
      return cy(e, t, n);
    }
  },
  dy = { offset: `stroke-dashoffset`, array: `stroke-dasharray` },
  fy = { offset: `strokeDashoffset`, array: `strokeDasharray` };
function py(e, t, n = 1, r = 0, i = !0) {
  e.pathLength = 1;
  let a = i ? dy : fy;
  ((e[a.offset] = `${-r}`), (e[a.array] = `${t} ${n}`));
}
var my = [`offsetDistance`, `offsetPath`, `offsetRotate`, `offsetAnchor`];
function hy(
  e,
  {
    attrX: t,
    attrY: n,
    attrScale: r,
    pathLength: i,
    pathSpacing: a = 1,
    pathOffset: o = 0,
    ...s
  },
  c,
  l,
  u,
) {
  if ((ty(e, s, l), c)) {
    e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
    return;
  }
  ((e.attrs = e.style), (e.style = {}));
  let { attrs: d, style: f } = e;
  (d.transform && ((f.transform = d.transform), delete d.transform),
    (f.transform || d.transformOrigin) &&
      ((f.transformOrigin = d.transformOrigin ?? `50% 50%`),
      delete d.transformOrigin),
    f.transform &&
      ((f.transformBox = u?.transformBox ?? `fill-box`),
      delete d.transformBox));
  for (let e of my) d[e] !== void 0 && ((f[e] = d[e]), delete d[e]);
  (t !== void 0 && (d.x = t),
    n !== void 0 && (d.y = n),
    r !== void 0 && (d.scale = r),
    i !== void 0 && py(d, i, a, o, !1));
}
var gy = new Set([
    `baseFrequency`,
    `diffuseConstant`,
    `kernelMatrix`,
    `kernelUnitLength`,
    `keySplines`,
    `keyTimes`,
    `limitingConeAngle`,
    `markerHeight`,
    `markerWidth`,
    `numOctaves`,
    `targetX`,
    `targetY`,
    `surfaceScale`,
    `specularConstant`,
    `specularExponent`,
    `stdDeviation`,
    `tableValues`,
    `viewBox`,
    `gradientTransform`,
    `pathLength`,
    `startOffset`,
    `textLength`,
    `lengthAdjust`,
  ]),
  _y = (e) => typeof e == `string` && e.toLowerCase() === `svg`;
function vy(e, t, n, r) {
  ny(e, t, void 0, r);
  for (let n in t.attrs) e.setAttribute(gy.has(n) ? n : qg(n), t.attrs[n]);
}
function yy(e, t, n) {
  let r = cy(e, t, n);
  for (let n in e)
    if (Wg(e[n]) || Wg(t[n])) {
      let t =
        Eh.indexOf(n) === -1
          ? n
          : `attr` + n.charAt(0).toUpperCase() + n.substring(1);
      r[t] = e[n];
    }
  return r;
}
var by = class extends kv {
    constructor() {
      (super(...arguments),
        (this.type = `svg`),
        (this.isSVGTag = !1),
        (this.measureInstanceViewportBox = dv));
    }
    getBaseTargetFromProps(e, t) {
      return e[t];
    }
    readValueFromInstance(e, t) {
      if (Dh.has(t)) {
        let e = m_(t);
        return (e && e.default) || 0;
      }
      return ((t = gy.has(t) ? t : qg(t)), e.getAttribute(t));
    }
    scrapeMotionValuesFromProps(e, t, n) {
      return yy(e, t, n);
    }
    build(e, t, n) {
      hy(e, t, this.isSVGTag, n.transformTemplate, n.style);
    }
    renderInstance(e, t, n, r) {
      vy(e, t, n, r);
    }
    mount(e) {
      ((this.isSVGTag = _y(e.tagName)), super.mount(e));
    }
  },
  xy = gv.length;
function Sy(e) {
  if (!e) return;
  if (!e.isControllingVariants) {
    let t = (e.parent && Sy(e.parent)) || {};
    return (e.props.initial !== void 0 && (t.initial = e.props.initial), t);
  }
  let t = {};
  for (let n = 0; n < xy; n++) {
    let r = gv[n],
      i = e.props[r];
    (mv(i) || i === !1) && (t[r] = i);
  }
  return t;
}
function Cy(e, t) {
  if (!Array.isArray(t)) return !1;
  let n = t.length;
  if (n !== e.length) return !1;
  for (let r = 0; r < n; r++) if (t[r] !== e[r]) return !1;
  return !0;
}
var wy = [...hv].reverse(),
  Ty = hv.length;
function Ey(e) {
  return (t) =>
    Promise.all(t.map(({ animation: t, options: n }) => e_(e, t, n)));
}
function Dy(e) {
  let t = Ey(e),
    n = Ay(),
    r = !0,
    i = !1,
    a = (t) => (n, r) => {
      let i = Ng(e, r, t === `exit` ? e.presenceContext?.custom : void 0);
      if (i) {
        let { transition: e, transitionEnd: t, ...r } = i;
        n = { ...n, ...r, ...t };
      }
      return n;
    };
  function o(n) {
    t = n(e);
  }
  function s(o) {
    let { props: s } = e,
      c = Sy(e.parent) || {},
      l = [],
      u = new Set(),
      d = {},
      f = 1 / 0;
    for (let t = 0; t < Ty; t++) {
      let p = wy[t],
        m = n[p],
        h = s[p] === void 0 ? c[p] : s[p],
        g = mv(h),
        _ = p === o ? m.isActive : null;
      _ === !1 && (f = t);
      let v = h === c[p] && h !== s[p] && g;
      if (
        (v && (r || i) && e.manuallyAnimateOnMount && (v = !1),
        (m.protectedKeys = { ...d }),
        (!m.isActive && _ === null) ||
          (!h && !m.prevProp) ||
          pv(h) ||
          typeof h == `boolean`)
      )
        continue;
      if (p === `exit` && m.isActive && _ !== !0) {
        m.prevResolvedValues && (d = { ...d, ...m.prevResolvedValues });
        continue;
      }
      let y = Oy(m.prevProp, h),
        b = y || (p === o && m.isActive && !v && g) || (t > f && g),
        x = !1,
        S = Array.isArray(h) ? h : [h],
        C = S.reduce(a(p), {});
      _ === !1 && (C = {});
      let { prevResolvedValues: w = {} } = m,
        T = { ...w, ...C },
        E = (t) => {
          ((b = !0),
            u.has(t) && ((x = !0), u.delete(t)),
            (m.needsAnimating[t] = !0));
          let n = e.getValue(t);
          n && (n.liveStyle = !1);
        };
      for (let e in T) {
        let t = C[e],
          n = w[e];
        if (d.hasOwnProperty(e)) continue;
        let r = !1;
        ((r = Bg(t) && Bg(n) ? !Cy(t, n) : t !== n),
          r
            ? t == null
              ? u.add(e)
              : E(e)
            : t !== void 0 && u.has(e)
              ? E(e)
              : (m.protectedKeys[e] = !0));
      }
      ((m.prevProp = h),
        (m.prevResolvedValues = C),
        m.isActive && (d = { ...d, ...C }),
        (r || i) && e.blockInitialAnimation && (b = !1));
      let D = v && y;
      b &&
        (!D || x) &&
        l.push(
          ...S.map((t) => {
            let n = { type: p };
            if (
              typeof t == `string` &&
              (r || i) &&
              !D &&
              e.manuallyAnimateOnMount &&
              e.parent
            ) {
              let { parent: r } = e,
                i = Ng(r, t);
              if (r.enteringChildren && i) {
                let { delayChildren: t } = i.transition || {};
                n.delay = _g(r.enteringChildren, e, t);
              }
            }
            return { animation: t, options: n };
          }),
        );
    }
    if (u.size) {
      let t = {};
      if (typeof s.initial != `boolean`) {
        let n = Ng(e, Array.isArray(s.initial) ? s.initial[0] : s.initial);
        n && n.transition && (t.transition = n.transition);
      }
      (u.forEach((n) => {
        let r = e.getBaseTarget(n),
          i = e.getValue(n);
        (i && (i.liveStyle = !0), (t[n] = r ?? null));
      }),
        l.push({ animation: t }));
    }
    let p = !!l.length;
    return (
      r &&
        (s.initial === !1 || s.initial === s.animate) &&
        !e.manuallyAnimateOnMount &&
        (p = !1),
      (r = !1),
      (i = !1),
      p ? t(l) : Promise.resolve()
    );
  }
  function c(t, r) {
    if (n[t].isActive === r) return Promise.resolve();
    (e.variantChildren?.forEach((e) => e.animationState?.setActive(t, r)),
      (n[t].isActive = r));
    let i = s(t);
    for (let e in n) n[e].protectedKeys = {};
    return i;
  }
  return {
    animateChanges: s,
    setActive: c,
    setAnimateFunction: o,
    getState: () => n,
    reset: () => {
      ((n = Ay()), (i = !0));
    },
  };
}
function Oy(e, t) {
  return typeof t == `string` ? t !== e : Array.isArray(t) ? !Cy(t, e) : !1;
}
function ky(e = !1) {
  return {
    isActive: e,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {},
  };
}
function Ay() {
  return {
    animate: ky(!0),
    whileInView: ky(),
    whileHover: ky(),
    whileTap: ky(),
    whileDrag: ky(),
    whileFocus: ky(),
    exit: ky(),
  };
}
function jy(e, t) {
  ((e.min = t.min), (e.max = t.max));
}
function My(e, t) {
  (jy(e.x, t.x), jy(e.y, t.y));
}
function Ny(e, t) {
  ((e.translate = t.translate),
    (e.scale = t.scale),
    (e.originPoint = t.originPoint),
    (e.origin = t.origin));
}
var Py = 1e-4,
  Fy = 1 - Py,
  Iy = 1 + Py,
  Ly = 0.01,
  Ry = 0 - Ly,
  zy = 0 + Ly;
function By(e) {
  return e.max - e.min;
}
function Vy(e, t, n) {
  return Math.abs(e - t) <= n;
}
function Hy(e, t, n, r = 0.5) {
  ((e.origin = r),
    (e.originPoint = ym(t.min, t.max, e.origin)),
    (e.scale = By(n) / By(t)),
    (e.translate = ym(n.min, n.max, e.origin) - e.originPoint),
    ((e.scale >= Fy && e.scale <= Iy) || isNaN(e.scale)) && (e.scale = 1),
    ((e.translate >= Ry && e.translate <= zy) || isNaN(e.translate)) &&
      (e.translate = 0));
}
function Uy(e, t, n, r) {
  (Hy(e.x, t.x, n.x, r ? r.originX : void 0),
    Hy(e.y, t.y, n.y, r ? r.originY : void 0));
}
function Wy(e, t, n, r = 0) {
  ((e.min = (r ? ym(n.min, n.max, r) : n.min) + t.min),
    (e.max = e.min + By(t)));
}
function Gy(e, t, n, r) {
  (Wy(e.x, t.x, n.x, r?.x), Wy(e.y, t.y, n.y, r?.y));
}
function Ky(e, t, n, r = 0) {
  let i = r ? ym(n.min, n.max, r) : n.min;
  ((e.min = t.min - i), (e.max = e.min + By(t)));
}
function qy(e, t, n, r) {
  (Ky(e.x, t.x, n.x, r?.x), Ky(e.y, t.y, n.y, r?.y));
}
function Jy(e, t, n, r, i) {
  return (
    (e -= t),
    (e = zv(e, 1 / n, r)),
    i !== void 0 && (e = zv(e, 1 / i, r)),
    e
  );
}
function Yy(e, t = 0, n = 1, r = 0.5, i, a = e, o = e) {
  if (
    (Jp.test(t) &&
      ((t = parseFloat(t)), (t = ym(o.min, o.max, t / 100) - o.min)),
    typeof t != `number`)
  )
    return;
  let s = ym(a.min, a.max, r);
  (e === a && (s -= t),
    (e.min = Jy(e.min, t, n, s, i)),
    (e.max = Jy(e.max, t, n, s, i)));
}
function Xy(e, t, [n, r, i], a, o) {
  Yy(e, t[n], t[r], t[i], t.scale, a, o);
}
var Zy = [`x`, `scaleX`, `originX`],
  Qy = [`y`, `scaleY`, `originY`];
function $y(e, t, n, r) {
  (Xy(e.x, t, Zy, n ? n.x : void 0, r ? r.x : void 0),
    Xy(e.y, t, Qy, n ? n.y : void 0, r ? r.y : void 0));
}
function eb(e) {
  return e.translate === 0 && e.scale === 1;
}
function tb(e) {
  return eb(e.x) && eb(e.y);
}
function nb(e, t) {
  return e.min === t.min && e.max === t.max;
}
function rb(e, t) {
  return nb(e.x, t.x) && nb(e.y, t.y);
}
function ib(e, t) {
  return (
    Math.round(e.min) === Math.round(t.min) &&
    Math.round(e.max) === Math.round(t.max)
  );
}
function ab(e, t) {
  return ib(e.x, t.x) && ib(e.y, t.y);
}
function ob(e) {
  return By(e.x) / By(e.y);
}
function sb(e, t) {
  return (
    e.translate === t.translate &&
    e.scale === t.scale &&
    e.originPoint === t.originPoint
  );
}
function cb(e) {
  return [e(`x`), e(`y`)];
}
function lb(e, t, n) {
  let r = ``,
    i = e.x.translate / t.x,
    a = e.y.translate / t.y,
    o = n?.z || 0;
  if (
    ((i || a || o) && (r = `translate3d(${i}px, ${a}px, ${o}px) `),
    (t.x !== 1 || t.y !== 1) && (r += `scale(${1 / t.x}, ${1 / t.y}) `),
    n)
  ) {
    let {
      transformPerspective: e,
      rotate: t,
      rotateX: i,
      rotateY: a,
      skewX: o,
      skewY: s,
    } = n;
    (e && (r = `perspective(${e}px) ${r}`),
      t && (r += `rotate(${t}deg) `),
      i && (r += `rotateX(${i}deg) `),
      a && (r += `rotateY(${a}deg) `),
      o && (r += `skewX(${o}deg) `),
      s && (r += `skewY(${s}deg) `));
  }
  let s = e.x.scale * t.x,
    c = e.y.scale * t.y;
  return ((s !== 1 || c !== 1) && (r += `scale(${s}, ${c})`), r || `none`);
}
var ub = [
    `borderTopLeftRadius`,
    `borderTopRightRadius`,
    `borderBottomLeftRadius`,
    `borderBottomRightRadius`,
  ],
  db = ub.length,
  fb = (e) => (typeof e == `string` ? parseFloat(e) : e),
  pb = (e) => typeof e == `number` || Z.test(e);
function mb(e, t, n, r, i, a) {
  i
    ? ((e.opacity = ym(0, n.opacity ?? 1, gb(r))),
      (e.opacityExit = ym(t.opacity ?? 1, 0, _b(r))))
    : a && (e.opacity = ym(t.opacity ?? 1, n.opacity ?? 1, r));
  for (let i = 0; i < db; i++) {
    let a = ub[i],
      o = hb(t, a),
      s = hb(n, a);
    (o === void 0 && s === void 0) ||
      ((o ||= 0),
      (s ||= 0),
      o === 0 || s === 0 || pb(o) === pb(s)
        ? ((e[a] = Math.max(ym(fb(o), fb(s), r), 0)),
          (Jp.test(s) || Jp.test(o)) && (e[a] += `%`))
        : (e[a] = s));
  }
  (t.rotate || n.rotate) && (e.rotate = ym(t.rotate || 0, n.rotate || 0, r));
}
function hb(e, t) {
  return e[t] === void 0 ? e.borderRadius : e[t];
}
var gb = vb(0, 0.5, rp),
  _b = vb(0.5, 0.95, Lf);
function vb(e, t, n) {
  return (r) => (r < e ? 0 : r > t ? 1 : n(Bf(e, t, r)));
}
function yb(e, t, n) {
  let r = Wg(e) ? e : zg(e);
  return (r.start(Ag(``, r, t, n)), r.animation);
}
function bb(e, t, n, r = { passive: !0 }) {
  return (e.addEventListener(t, n, r), () => e.removeEventListener(t, n));
}
var xb = (e, t) => e.depth - t.depth,
  Sb = class {
    constructor() {
      ((this.children = []), (this.isDirty = !1));
    }
    add(e) {
      (kf(this.children, e), (this.isDirty = !0));
    }
    remove(e) {
      (Af(this.children, e), (this.isDirty = !0));
    }
    forEach(e) {
      (this.isDirty && this.children.sort(xb),
        (this.isDirty = !1),
        this.children.forEach(e));
    }
  };
function Cb(e, t) {
  let n = wp.now(),
    r = ({ timestamp: i }) => {
      let a = i - n;
      a >= t && (yp(r), e(a - t));
    };
  return (vp.setup(r, !0), () => yp(r));
}
function wb(e) {
  return Wg(e) ? e.get() : e;
}
var Tb = class {
    constructor() {
      this.members = [];
    }
    add(e) {
      kf(this.members, e);
      for (let t = this.members.length - 1; t >= 0; t--) {
        let n = this.members[t];
        if (n === e || n === this.lead || n === this.prevLead) continue;
        let r = n.instance;
        (!r || r.isConnected === !1) &&
          !n.snapshot &&
          (Af(this.members, n), n.unmount());
      }
      e.scheduleRender();
    }
    remove(e) {
      if (
        (Af(this.members, e),
        e === this.prevLead && (this.prevLead = void 0),
        e === this.lead)
      ) {
        let e = this.members[this.members.length - 1];
        e && this.promote(e);
      }
    }
    relegate(e) {
      for (let t = this.members.indexOf(e) - 1; t >= 0; t--) {
        let e = this.members[t];
        if (e.isPresent !== !1 && e.instance?.isConnected !== !1)
          return (this.promote(e), !0);
      }
      return !1;
    }
    promote(e, t) {
      let n = this.lead;
      if (e !== n && ((this.prevLead = n), (this.lead = e), e.show(), n)) {
        (n.updateSnapshot(), e.scheduleRender());
        let { layoutDependency: r } = n.options,
          { layoutDependency: i } = e.options;
        ((r === void 0 || r !== i) &&
          ((e.resumeFrom = n),
          t && (n.preserveOpacity = !0),
          n.snapshot &&
            ((e.snapshot = n.snapshot),
            (e.snapshot.latestValues = n.animationValues || n.latestValues)),
          e.root?.isUpdating && (e.isLayoutDirty = !0)),
          e.options.crossfade === !1 && n.hide());
      }
    }
    exitAnimationComplete() {
      this.members.forEach((e) => {
        (e.options.onExitComplete?.(),
          e.resumingFrom?.options.onExitComplete?.());
      });
    }
    scheduleRender() {
      this.members.forEach((e) => e.instance && e.scheduleRender(!1));
    }
    removeLeadSnapshot() {
      this.lead?.snapshot && (this.lead.snapshot = void 0);
    }
  },
  Eb = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 },
  Db = { nodes: 0, calculatedTargetDeltas: 0, calculatedProjections: 0 },
  Ob = [``, `X`, `Y`, `Z`],
  kb = 1e3,
  Ab = 0;
function jb(e, t, n, r) {
  let { latestValues: i } = t;
  i[e] && ((n[e] = i[e]), t.setStaticValue(e, 0), r && (r[e] = 0));
}
function Mb(e) {
  if (((e.hasCheckedOptimisedAppear = !0), e.root === e)) return;
  let { visualElement: t } = e.options;
  if (!t) return;
  let n = Yg(t);
  if (window.MotionHasOptimisedAnimation(n, `transform`)) {
    let { layout: t, layoutId: r } = e.options;
    window.MotionCancelOptimisedAnimation(n, `transform`, vp, !(t || r));
  }
  let { parent: r } = e;
  r && !r.hasCheckedOptimisedAppear && Mb(r);
}
function Nb({
  attachResizeListener: e,
  defaultParent: t,
  measureScroll: n,
  checkIsScrollRoot: r,
  resetTransform: i,
}) {
  return class {
    constructor(e = {}, n = t?.()) {
      ((this.id = Ab++),
        (this.animationId = 0),
        (this.animationCommitId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.layoutVersion = 0),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            mp.value &&
              (Db.nodes =
                Db.calculatedTargetDeltas =
                Db.calculatedProjections =
                  0),
            this.nodes.forEach(Ib),
            this.nodes.forEach(Gb),
            this.nodes.forEach(Kb),
            this.nodes.forEach(Lb),
            mp.addProjectionMetrics && mp.addProjectionMetrics(Db));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.linkedParentVersion = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = e),
        (this.root = n ? n.root || n : this),
        (this.path = n ? [...n.path, n] : []),
        (this.parent = n),
        (this.depth = n ? n.depth + 1 : 0));
      for (let e = 0; e < this.path.length; e++)
        this.path[e].shouldResetTransform = !0;
      this.root === this && (this.nodes = new Sb());
    }
    addEventListener(e, t) {
      return (
        this.eventHandlers.has(e) || this.eventHandlers.set(e, new Vf()),
        this.eventHandlers.get(e).add(t)
      );
    }
    notifyListeners(e, ...t) {
      let n = this.eventHandlers.get(e);
      n && n.notify(...t);
    }
    hasListeners(e) {
      return this.eventHandlers.has(e);
    }
    mount(t) {
      if (this.instance) return;
      ((this.isSVG = W_(t) && !av(t)), (this.instance = t));
      let { layoutId: n, layout: r, visualElement: i } = this.options;
      if (
        (i && !i.current && i.mount(t),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        this.root.hasTreeAnimated && (r || n) && (this.isLayoutDirty = !0),
        e)
      ) {
        let n,
          r = 0,
          i = () => (this.root.updateBlockedByResize = !1);
        (vp.read(() => {
          r = window.innerWidth;
        }),
          e(t, () => {
            let e = window.innerWidth;
            e !== r &&
              ((r = e),
              (this.root.updateBlockedByResize = !0),
              n && n(),
              (n = Cb(i, 250)),
              Eb.hasAnimatedSinceResize &&
                ((Eb.hasAnimatedSinceResize = !1), this.nodes.forEach(Wb)));
          }));
      }
      (n && this.root.registerSharedNode(n, this),
        this.options.animate !== !1 &&
          i &&
          (n || r) &&
          this.addEventListener(
            `didUpdate`,
            ({
              delta: e,
              hasLayoutChanged: t,
              hasRelativeLayoutChanged: n,
              layout: r,
            }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              let a = this.options.transition || i.getDefaultTransition() || $b,
                { onLayoutAnimationStart: o, onLayoutAnimationComplete: s } =
                  i.getProps(),
                c = !this.targetLayout || !ab(this.targetLayout, r),
                l = !t && n;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                l ||
                (t && (c || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                let t = { ...Dg(a, `layout`), onPlay: o, onComplete: s };
                ((i.shouldReduceMotion || this.options.layoutRoot) &&
                  ((t.delay = 0), (t.type = !1)),
                  this.startAnimation(t),
                  this.setAnimationOrigin(e, l));
              } else
                (t || Wb(this),
                  this.isLead() &&
                    this.options.onExitComplete &&
                    this.options.onExitComplete());
              this.targetLayout = r;
            },
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(),
        this.root.nodes.remove(this));
      let e = this.getStack();
      (e && e.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        this.eventHandlers.clear(),
        yp(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return (
        this.isAnimationBlocked ||
        (this.parent && this.parent.isTreeAnimationBlocked()) ||
        !1
      );
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0),
        this.nodes && this.nodes.forEach(qb),
        this.animationId++);
    }
    getTransformTemplate() {
      let { visualElement: e } = this.options;
      return e && e.getProps().transformTemplate;
    }
    willUpdate(e = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (window.MotionCancelOptimisedAnimation &&
          !this.hasCheckedOptimisedAppear &&
          Mb(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let e = 0; e < this.path.length; e++) {
        let t = this.path[e];
        ((t.shouldResetTransform = !0),
          (typeof t.latestValues.x == `string` ||
            typeof t.latestValues.y == `string`) &&
            (t.isLayoutDirty = !0),
          t.updateScroll(`snapshot`),
          t.options.layoutRoot && t.willUpdate(!1));
      }
      let { layoutId: t, layout: n } = this.options;
      if (t === void 0 && !n) return;
      let r = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = r
        ? r(this.latestValues, ``)
        : void 0),
        this.updateSnapshot(),
        e && this.notifyListeners(`willUpdate`));
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        let e = this.updateBlockedByResize;
        (this.unblockUpdate(),
          (this.updateBlockedByResize = !1),
          this.clearAllSnapshots(),
          e && this.nodes.forEach(Bb),
          this.nodes.forEach(zb));
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Vb);
        return;
      }
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(Hb),
            this.nodes.forEach(Ub),
            this.nodes.forEach(Pb),
            this.nodes.forEach(Fb))
          : this.nodes.forEach(Vb),
        this.clearAllSnapshots());
      let e = wp.now();
      ((bp.delta = jf(0, 1e3 / 60, e - bp.timestamp)),
        (bp.timestamp = e),
        (bp.isProcessing = !0),
        xp.update.process(bp),
        xp.preRender.process(bp),
        xp.render.process(bp),
        (bp.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled ||
        ((this.updateScheduled = !0), C_.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(Rb), this.sharedNodes.forEach(Jb));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0),
        vp.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      vp.postRender(() => {
        this.isLayoutDirty
          ? this.root.didUpdate()
          : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot ||
        !this.instance ||
        ((this.snapshot = this.measure()),
        this.snapshot &&
          !By(this.snapshot.measuredBox.x) &&
          !By(this.snapshot.measuredBox.y) &&
          (this.snapshot = void 0));
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) &&
          !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
      let e = this.layout;
      ((this.layout = this.measure(!1)),
        this.layoutVersion++,
        (this.layoutCorrected ||= dv()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners(`measure`, this.layout.layoutBox));
      let { visualElement: t } = this.options;
      t &&
        t.notify(
          `LayoutMeasure`,
          this.layout.layoutBox,
          e ? e.layoutBox : void 0,
        );
    }
    updateScroll(e = `measure`) {
      let t = !!(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === e &&
          (t = !1),
        t && this.instance)
      ) {
        let t = r(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: e,
          isRoot: t,
          offset: n(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : t,
        };
      }
    }
    resetTransform() {
      if (!i) return;
      let e =
          this.isLayoutDirty ||
          this.shouldResetTransform ||
          this.options.alwaysMeasureLayout,
        t = this.projectionDelta && !tb(this.projectionDelta),
        n = this.getTransformTemplate(),
        r = n ? n(this.latestValues, ``) : void 0,
        a = r !== this.prevTransformTemplateValue;
      e &&
        this.instance &&
        (t || Iv(this.latestValues) || a) &&
        (i(this.instance, r),
        (this.shouldResetTransform = !1),
        this.scheduleRender());
    }
    measure(e = !0) {
      let t = this.measurePageBox(),
        n = this.removeElementScroll(t);
      return (
        e && (n = this.removeTransform(n)),
        rx(n),
        {
          animationId: this.root.animationId,
          measuredBox: t,
          layoutBox: n,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      let { visualElement: e } = this.options;
      if (!e) return dv();
      let t = e.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(ax))) {
        let { scroll: e } = this.root;
        e && (Kv(t.x, e.offset.x), Kv(t.y, e.offset.y));
      }
      return t;
    }
    removeElementScroll(e) {
      let t = dv();
      if ((My(t, e), this.scroll?.wasRoot)) return t;
      for (let n = 0; n < this.path.length; n++) {
        let r = this.path[n],
          { scroll: i, options: a } = r;
        r !== this.root &&
          i &&
          a.layoutScroll &&
          (i.wasRoot && My(t, e), Kv(t.x, i.offset.x), Kv(t.y, i.offset.y));
      }
      return t;
    }
    applyTransform(e, t = !1, n) {
      let r = n || dv();
      My(r, e);
      for (let e = 0; e < this.path.length; e++) {
        let n = this.path[e];
        (!t &&
          n.options.layoutScroll &&
          n.scroll &&
          n !== n.root &&
          (Kv(r.x, -n.scroll.offset.x), Kv(r.y, -n.scroll.offset.y)),
          Iv(n.latestValues) && Yv(r, n.latestValues, n.layout?.layoutBox));
      }
      return (
        Iv(this.latestValues) &&
          Yv(r, this.latestValues, this.layout?.layoutBox),
        r
      );
    }
    removeTransform(e) {
      let t = dv();
      My(t, e);
      for (let e = 0; e < this.path.length; e++) {
        let n = this.path[e];
        if (!Iv(n.latestValues)) continue;
        let r;
        (n.instance &&
          (Fv(n.latestValues) && n.updateSnapshot(),
          (r = dv()),
          My(r, n.measurePageBox())),
          $y(t, n.latestValues, n.snapshot?.layoutBox, r));
      }
      return (Iv(this.latestValues) && $y(t, this.latestValues), t);
    }
    setTargetDelta(e) {
      ((this.targetDelta = e),
        this.root.scheduleUpdateProjection(),
        (this.isProjectionDirty = !0));
    }
    setOptions(e) {
      this.options = {
        ...this.options,
        ...e,
        crossfade: e.crossfade === void 0 ? !0 : e.crossfade,
      };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== bp.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(e = !1) {
      let t = this.getLead();
      ((this.isProjectionDirty ||= t.isProjectionDirty),
        (this.isTransformDirty ||= t.isTransformDirty),
        (this.isSharedProjectionDirty ||= t.isSharedProjectionDirty));
      let n = !!this.resumingFrom || this !== t;
      if (
        !(
          e ||
          (n && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          this.parent?.isProjectionDirty ||
          this.attemptToResolveRelativeTarget ||
          this.root.updateBlockedByResize
        )
      )
        return;
      let { layout: r, layoutId: i } = this.options;
      if (!this.layout || !(r || i)) return;
      this.resolvedRelativeTargetAt = bp.timestamp;
      let a = this.getClosestProjectingParent();
      (a &&
        this.linkedParentVersion !== a.layoutVersion &&
        !a.options.layoutRoot &&
        this.removeRelativeTarget(),
        !this.targetDelta &&
          !this.relativeTarget &&
          (this.options.layoutAnchor !== !1 && a && a.layout
            ? this.createRelativeTarget(
                a,
                this.layout.layoutBox,
                a.layout.layoutBox,
              )
            : this.removeRelativeTarget()),
        !(!this.relativeTarget && !this.targetDelta) &&
          (this.target ||
            ((this.target = dv()), (this.targetWithTransforms = dv())),
          this.relativeTarget &&
          this.relativeTargetOrigin &&
          this.relativeParent &&
          this.relativeParent.target
            ? (this.forceRelativeParentToResolveTarget(),
              Gy(
                this.target,
                this.relativeTarget,
                this.relativeParent.target,
                this.options.layoutAnchor || void 0,
              ))
            : this.targetDelta
              ? (this.resumingFrom
                  ? this.applyTransform(this.layout.layoutBox, !1, this.target)
                  : My(this.target, this.layout.layoutBox),
                Hv(this.target, this.targetDelta))
              : My(this.target, this.layout.layoutBox),
          this.attemptToResolveRelativeTarget &&
            ((this.attemptToResolveRelativeTarget = !1),
            this.options.layoutAnchor !== !1 &&
            a &&
            !!a.resumingFrom == !!this.resumingFrom &&
            !a.options.layoutScroll &&
            a.target &&
            this.animationProgress !== 1
              ? this.createRelativeTarget(a, this.target, a.target)
              : (this.relativeParent = this.relativeTarget = void 0)),
          mp.value && Db.calculatedTargetDeltas++));
    }
    getClosestProjectingParent() {
      if (
        !(
          !this.parent ||
          Fv(this.parent.latestValues) ||
          Lv(this.parent.latestValues)
        )
      )
        return this.parent.isProjecting()
          ? this.parent
          : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    createRelativeTarget(e, t, n) {
      ((this.relativeParent = e),
        (this.linkedParentVersion = e.layoutVersion),
        this.forceRelativeParentToResolveTarget(),
        (this.relativeTarget = dv()),
        (this.relativeTargetOrigin = dv()),
        qy(
          this.relativeTargetOrigin,
          t,
          n,
          this.options.layoutAnchor || void 0,
        ),
        My(this.relativeTarget, this.relativeTargetOrigin));
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      let e = this.getLead(),
        t = !!this.resumingFrom || this !== e,
        n = !0;
      if (
        ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1),
        t &&
          (this.isSharedProjectionDirty || this.isTransformDirty) &&
          (n = !1),
        this.resolvedRelativeTargetAt === bp.timestamp && (n = !1),
        n)
      )
        return;
      let { layout: r, layoutId: i } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating ||
          (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(r || i))
      )
        return;
      My(this.layoutCorrected, this.layout.layoutBox);
      let a = this.treeScale.x,
        o = this.treeScale.y;
      (Gv(this.layoutCorrected, this.treeScale, this.path, t),
        e.layout &&
          !e.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((e.target = e.layout.layoutBox), (e.targetWithTransforms = dv())));
      let { target: s } = e;
      if (!s) {
        this.prevProjectionDelta &&
          (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : (Ny(this.prevProjectionDelta.x, this.projectionDelta.x),
          Ny(this.prevProjectionDelta.y, this.projectionDelta.y)),
        Uy(this.projectionDelta, this.layoutCorrected, s, this.latestValues),
        (this.treeScale.x !== a ||
          this.treeScale.y !== o ||
          !sb(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !sb(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners(`projectionUpdate`, s)),
        mp.value && Db.calculatedProjections++);
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(e = !0) {
      if ((this.options.visualElement?.scheduleRender(), e)) {
        let e = this.getStack();
        e && e.scheduleRender();
      }
      this.resumingFrom &&
        !this.resumingFrom.instance &&
        (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = lv()),
        (this.projectionDelta = lv()),
        (this.projectionDeltaWithTransform = lv()));
    }
    setAnimationOrigin(e, t = !1) {
      let n = this.snapshot,
        r = n ? n.latestValues : {},
        i = { ...this.latestValues },
        a = lv();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !t));
      let o = dv(),
        s =
          (n ? n.source : void 0) !==
          (this.layout ? this.layout.source : void 0),
        c = this.getStack(),
        l = !c || c.members.length <= 1,
        u = !!(s && !l && this.options.crossfade === !0 && !this.path.some(Qb));
      this.animationProgress = 0;
      let d;
      ((this.mixTargetDelta = (t) => {
        let n = t / 1e3;
        (Yb(a.x, e.x, n),
          Yb(a.y, e.y, n),
          this.setTargetDelta(a),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (qy(
              o,
              this.layout.layoutBox,
              this.relativeParent.layout.layoutBox,
              this.options.layoutAnchor || void 0,
            ),
            Zb(this.relativeTarget, this.relativeTargetOrigin, o, n),
            d && rb(this.relativeTarget, d) && (this.isProjectionDirty = !1),
            (d ||= dv()),
            My(d, this.relativeTarget)),
          s &&
            ((this.animationValues = i), mb(i, r, this.latestValues, n, u, l)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = n));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(e) {
      (this.notifyListeners(`animationStart`),
        this.currentAnimation?.stop(),
        this.resumingFrom?.currentAnimation?.stop(),
        (this.pendingAnimation &&= (yp(this.pendingAnimation), void 0)),
        (this.pendingAnimation = vp.update(() => {
          ((Eb.hasAnimatedSinceResize = !0),
            Tp.layout++,
            (this.motionValue ||= zg(0)),
            this.motionValue.jump(0, !1),
            (this.currentAnimation = yb(this.motionValue, [0, 1e3], {
              ...e,
              velocity: 0,
              isSync: !0,
              onUpdate: (t) => {
                (this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t));
              },
              onStop: () => {
                Tp.layout--;
              },
              onComplete: () => {
                (Tp.layout--,
                  e.onComplete && e.onComplete(),
                  this.completeAnimation());
              },
            })),
            this.resumingFrom &&
              (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      let e = this.getStack();
      (e && e.exitAnimationComplete(),
        (this.resumingFrom =
          this.currentAnimation =
          this.animationValues =
            void 0),
        this.notifyListeners(`animationComplete`));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(kb),
        this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      let e = this.getLead(),
        { targetWithTransforms: t, target: n, layout: r, latestValues: i } = e;
      if (!(!t || !n || !r)) {
        if (
          this !== e &&
          this.layout &&
          r &&
          ix(this.options.animationType, this.layout.layoutBox, r.layoutBox)
        ) {
          n = this.target || dv();
          let t = By(this.layout.layoutBox.x);
          ((n.x.min = e.target.x.min), (n.x.max = n.x.min + t));
          let r = By(this.layout.layoutBox.y);
          ((n.y.min = e.target.y.min), (n.y.max = n.y.min + r));
        }
        (My(t, n),
          Yv(t, i),
          Uy(this.projectionDeltaWithTransform, this.layoutCorrected, t, i));
      }
    }
    registerSharedNode(e, t) {
      (this.sharedNodes.has(e) || this.sharedNodes.set(e, new Tb()),
        this.sharedNodes.get(e).add(t));
      let n = t.options.initialPromotionConfig;
      t.promote({
        transition: n ? n.transition : void 0,
        preserveFollowOpacity:
          n && n.shouldPreserveFollowOpacity
            ? n.shouldPreserveFollowOpacity(t)
            : void 0,
      });
    }
    isLead() {
      let e = this.getStack();
      return e ? e.lead === this : !0;
    }
    getLead() {
      let { layoutId: e } = this.options;
      return (e && this.getStack()?.lead) || this;
    }
    getPrevLead() {
      let { layoutId: e } = this.options;
      return e ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      let { layoutId: e } = this.options;
      if (e) return this.root.sharedNodes.get(e);
    }
    promote({ needsReset: e, transition: t, preserveFollowOpacity: n } = {}) {
      let r = this.getStack();
      (r && r.promote(this, n),
        e && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        t && this.setOptions({ transition: t }));
    }
    relegate() {
      let e = this.getStack();
      return e ? e.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      let { visualElement: e } = this.options;
      if (!e) return;
      let t = !1,
        { latestValues: n } = e;
      if (
        ((n.z ||
          n.rotate ||
          n.rotateX ||
          n.rotateY ||
          n.rotateZ ||
          n.skewX ||
          n.skewY) &&
          (t = !0),
        !t)
      )
        return;
      let r = {};
      n.z && jb(`z`, e, r, this.animationValues);
      for (let t = 0; t < Ob.length; t++)
        (jb(`rotate${Ob[t]}`, e, r, this.animationValues),
          jb(`skew${Ob[t]}`, e, r, this.animationValues));
      e.render();
      for (let t in r)
        (e.setStaticValue(t, r[t]),
          this.animationValues && (this.animationValues[t] = r[t]));
      e.scheduleRender();
    }
    applyProjectionStyles(e, t) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) {
        e.visibility = `hidden`;
        return;
      }
      let n = this.getTransformTemplate();
      if (this.needsReset) {
        ((this.needsReset = !1),
          (e.visibility = ``),
          (e.opacity = ``),
          (e.pointerEvents = wb(t?.pointerEvents) || ``),
          (e.transform = n ? n(this.latestValues, ``) : `none`));
        return;
      }
      let r = this.getLead();
      if (!this.projectionDelta || !this.layout || !r.target) {
        (this.options.layoutId &&
          ((e.opacity =
            this.latestValues.opacity === void 0
              ? 1
              : this.latestValues.opacity),
          (e.pointerEvents = wb(t?.pointerEvents) || ``)),
          this.hasProjected &&
            !Iv(this.latestValues) &&
            ((e.transform = n ? n({}, ``) : `none`), (this.hasProjected = !1)));
        return;
      }
      e.visibility = ``;
      let i = r.animationValues || r.latestValues;
      this.applyTransformsToTarget();
      let a = lb(this.projectionDeltaWithTransform, this.treeScale, i);
      (n && (a = n(i, a)), (e.transform = a));
      let { x: o, y: s } = this.projectionDelta;
      ((e.transformOrigin = `${o.origin * 100}% ${s.origin * 100}% 0`),
        r.animationValues
          ? (e.opacity =
              r === this
                ? (i.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : i.opacityExit)
          : (e.opacity =
              r === this
                ? i.opacity === void 0
                  ? ``
                  : i.opacity
                : i.opacityExit === void 0
                  ? 0
                  : i.opacityExit));
      for (let t in oy) {
        if (i[t] === void 0) continue;
        let { correct: n, applyTo: o, isCSSVariable: s } = oy[t],
          c = a === `none` ? i[t] : n(i[t], r);
        if (o) {
          let t = o.length;
          for (let n = 0; n < t; n++) e[o[n]] = c;
        } else
          s ? (this.options.visualElement.renderState.vars[t] = c) : (e[t] = c);
      }
      this.options.layoutId &&
        (e.pointerEvents = r === this ? wb(t?.pointerEvents) || `` : `none`);
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((e) => e.currentAnimation?.stop()),
        this.root.nodes.forEach(zb),
        this.root.sharedNodes.clear());
    }
  };
}
function Pb(e) {
  e.updateLayout();
}
function Fb(e) {
  let t = e.resumeFrom?.snapshot || e.snapshot;
  if (e.isLead() && e.layout && t && e.hasListeners(`didUpdate`)) {
    let { layoutBox: n, measuredBox: r } = e.layout,
      { animationType: i } = e.options,
      a = t.source !== e.layout.source;
    if (i === `size`)
      cb((e) => {
        let r = a ? t.measuredBox[e] : t.layoutBox[e],
          i = By(r);
        ((r.min = n[e].min), (r.max = r.min + i));
      });
    else if (i === `x` || i === `y`) {
      let e = i === `x` ? `y` : `x`;
      jy(a ? t.measuredBox[e] : t.layoutBox[e], n[e]);
    } else
      ix(i, t.layoutBox, n) &&
        cb((r) => {
          let i = a ? t.measuredBox[r] : t.layoutBox[r],
            o = By(n[r]);
          ((i.max = i.min + o),
            e.relativeTarget &&
              !e.currentAnimation &&
              ((e.isProjectionDirty = !0),
              (e.relativeTarget[r].max = e.relativeTarget[r].min + o)));
        });
    let o = lv();
    Uy(o, n, t.layoutBox);
    let s = lv();
    a ? Uy(s, e.applyTransform(r, !0), t.measuredBox) : Uy(s, n, t.layoutBox);
    let c = !tb(o),
      l = !1;
    if (!e.resumeFrom) {
      let r = e.getClosestProjectingParent();
      if (r && !r.resumeFrom) {
        let { snapshot: i, layout: a } = r;
        if (i && a) {
          let o = e.options.layoutAnchor || void 0,
            s = dv();
          qy(s, t.layoutBox, i.layoutBox, o);
          let c = dv();
          (qy(c, n, a.layoutBox, o),
            ab(s, c) || (l = !0),
            r.options.layoutRoot &&
              ((e.relativeTarget = c),
              (e.relativeTargetOrigin = s),
              (e.relativeParent = r)));
        }
      }
    }
    e.notifyListeners(`didUpdate`, {
      layout: n,
      snapshot: t,
      delta: s,
      layoutDelta: o,
      hasLayoutChanged: c,
      hasRelativeLayoutChanged: l,
    });
  } else if (e.isLead()) {
    let { onExitComplete: t } = e.options;
    t && t();
  }
  e.options.transition = void 0;
}
function Ib(e) {
  (mp.value && Db.nodes++,
    e.parent &&
      (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
      (e.isSharedProjectionDirty ||= !!(
        e.isProjectionDirty ||
        e.parent.isProjectionDirty ||
        e.parent.isSharedProjectionDirty
      )),
      (e.isTransformDirty ||= e.parent.isTransformDirty)));
}
function Lb(e) {
  e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
}
function Rb(e) {
  e.clearSnapshot();
}
function zb(e) {
  e.clearMeasurements();
}
function Bb(e) {
  ((e.isLayoutDirty = !0), e.updateLayout());
}
function Vb(e) {
  e.isLayoutDirty = !1;
}
function Hb(e) {
  e.isAnimationBlocked &&
    e.layout &&
    !e.isLayoutDirty &&
    ((e.snapshot = e.layout), (e.isLayoutDirty = !0));
}
function Ub(e) {
  let { visualElement: t } = e.options;
  (t && t.getProps().onBeforeLayoutMeasure && t.notify(`BeforeLayoutMeasure`),
    e.resetTransform());
}
function Wb(e) {
  (e.finishAnimation(),
    (e.targetDelta = e.relativeTarget = e.target = void 0),
    (e.isProjectionDirty = !0));
}
function Gb(e) {
  e.resolveTargetDelta();
}
function Kb(e) {
  e.calcProjection();
}
function qb(e) {
  e.resetSkewAndRotation();
}
function Jb(e) {
  e.removeLeadSnapshot();
}
function Yb(e, t, n) {
  ((e.translate = ym(t.translate, 0, n)),
    (e.scale = ym(t.scale, 1, n)),
    (e.origin = t.origin),
    (e.originPoint = t.originPoint));
}
function Xb(e, t, n, r) {
  ((e.min = ym(t.min, n.min, r)), (e.max = ym(t.max, n.max, r)));
}
function Zb(e, t, n, r) {
  (Xb(e.x, t.x, n.x, r), Xb(e.y, t.y, n.y, r));
}
function Qb(e) {
  return e.animationValues && e.animationValues.opacityExit !== void 0;
}
var $b = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  ex = (e) =>
    typeof navigator < `u` &&
    navigator.userAgent &&
    navigator.userAgent.toLowerCase().includes(e),
  tx = ex(`applewebkit/`) && !ex(`chrome/`) ? Math.round : Lf;
function nx(e) {
  ((e.min = tx(e.min)), (e.max = tx(e.max)));
}
function rx(e) {
  (nx(e.x), nx(e.y));
}
function ix(e, t, n) {
  return (
    e === `position` || (e === `preserve-aspect` && !Vy(ob(t), ob(n), 0.2))
  );
}
function ax(e) {
  return e !== e.root && e.scroll?.wasRoot;
}
var ox = Nb({
    attachResizeListener: (e, t) => bb(e, `resize`, t),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
      y: document.documentElement.scrollTop || document.body?.scrollTop || 0,
    }),
    checkIsScrollRoot: () => !0,
  }),
  sx = { current: void 0 },
  cx = Nb({
    measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
    defaultParent: () => {
      if (!sx.current) {
        let e = new ox({});
        (e.mount(window), e.setOptions({ layoutScroll: !0 }), (sx.current = e));
      }
      return sx.current;
    },
    resetTransform: (e, t) => {
      e.style.transform = t === void 0 ? `none` : t;
    },
    checkIsScrollRoot: (e) => window.getComputedStyle(e).position === `fixed`,
  }),
  lx = (0, w.createContext)({
    transformPagePoint: (e) => e,
    isStatic: !1,
    reducedMotion: `never`,
  });
function ux(e, t) {
  if (typeof e == `function`) return e(t);
  e != null && (e.current = t);
}
function dx(...e) {
  return (t) => {
    let n = !1,
      r = e.map((e) => {
        let r = ux(e, t);
        return (!n && typeof r == `function` && (n = !0), r);
      });
    if (n)
      return () => {
        for (let t = 0; t < r.length; t++) {
          let n = r[t];
          typeof n == `function` ? n() : ux(e[t], null);
        }
      };
  };
}
function fx(...e) {
  return w.useCallback(dx(...e), e);
}
var px = class extends w.Component {
  getSnapshotBeforeUpdate(e) {
    let t = this.props.childRef.current;
    if (
      S_(t) &&
      e.isPresent &&
      !this.props.isPresent &&
      this.props.pop !== !1
    ) {
      let e = t.offsetParent,
        n = (S_(e) && e.offsetWidth) || 0,
        r = (S_(e) && e.offsetHeight) || 0,
        i = getComputedStyle(t),
        a = this.props.sizeRef.current;
      ((a.height = parseFloat(i.height)),
        (a.width = parseFloat(i.width)),
        (a.top = t.offsetTop),
        (a.left = t.offsetLeft),
        (a.right = n - a.width - a.left),
        (a.bottom = r - a.height - a.top));
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
};
function mx({
  children: e,
  isPresent: t,
  anchorX: n,
  anchorY: r,
  root: i,
  pop: a,
}) {
  let o = (0, w.useId)(),
    s = (0, w.useRef)(null),
    c = (0, w.useRef)({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    { nonce: l } = (0, w.useContext)(lx),
    u = fx(s, e.props?.ref ?? e?.ref);
  return (
    (0, w.useInsertionEffect)(() => {
      let {
        width: e,
        height: u,
        top: d,
        left: f,
        right: p,
        bottom: m,
      } = c.current;
      if (t || a === !1 || !s.current || !e || !u) return;
      let h = n === `left` ? `left: ${f}` : `right: ${p}`,
        g = r === `bottom` ? `bottom: ${m}` : `top: ${d}`;
      s.current.dataset.motionPopId = o;
      let _ = document.createElement(`style`);
      l && (_.nonce = l);
      let v = i ?? document.head;
      return (
        v.appendChild(_),
        _.sheet &&
          _.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${u}px !important;
            ${h}px !important;
            ${g}px !important;
          }
        `),
        () => {
          (s.current?.removeAttribute(`data-motion-pop-id`),
            v.contains(_) && v.removeChild(_));
        }
      );
    }, [t]),
    (0, X.jsx)(px, {
      isPresent: t,
      childRef: s,
      sizeRef: c,
      pop: a,
      children: a === !1 ? e : w.cloneElement(e, { ref: u }),
    })
  );
}
var hx = ({
  children: e,
  initial: t,
  isPresent: n,
  onExitComplete: r,
  custom: i,
  presenceAffectsLayout: a,
  mode: o,
  anchorX: s,
  anchorY: c,
  root: l,
}) => {
  let u = Ef(gx),
    d = (0, w.useId)(),
    f = !0,
    p = (0, w.useMemo)(
      () => (
        (f = !1),
        {
          id: d,
          initial: t,
          isPresent: n,
          custom: i,
          onExitComplete: (e) => {
            u.set(e, !0);
            for (let e of u.values()) if (!e) return;
            r && r();
          },
          register: (e) => (u.set(e, !1), () => u.delete(e)),
        }
      ),
      [n, u, r],
    );
  return (
    a && f && (p = { ...p }),
    (0, w.useMemo)(() => {
      u.forEach((e, t) => u.set(t, !1));
    }, [n]),
    w.useEffect(() => {
      !n && !u.size && r && r();
    }, [n]),
    (e = (0, X.jsx)(mx, {
      pop: o === `popLayout`,
      isPresent: n,
      anchorX: s,
      anchorY: c,
      root: l,
      children: e,
    })),
    (0, X.jsx)(Of.Provider, { value: p, children: e })
  );
};
function gx() {
  return new Map();
}
function _x(e = !0) {
  let t = (0, w.useContext)(Of);
  if (t === null) return [!0, null];
  let { isPresent: n, onExitComplete: r, register: i } = t,
    a = (0, w.useId)();
  (0, w.useEffect)(() => {
    if (e) return i(a);
  }, [e]);
  let o = (0, w.useCallback)(() => e && r && r(a), [a, r, e]);
  return !n && r ? [!1, o] : [!0];
}
var vx = (e) => e.key || ``;
function yx(e) {
  let t = [];
  return (
    w.Children.forEach(e, (e) => {
      (0, w.isValidElement)(e) && t.push(e);
    }),
    t
  );
}
var bx = ({
    children: e,
    custom: t,
    initial: n = !0,
    onExitComplete: r,
    presenceAffectsLayout: i = !0,
    mode: a = `sync`,
    propagate: o = !1,
    anchorX: s = `left`,
    anchorY: c = `top`,
    root: l,
  }) => {
    let [u, d] = _x(o),
      f = (0, w.useMemo)(() => yx(e), [e]),
      p = o && !u ? [] : f.map(vx),
      m = (0, w.useRef)(!0),
      h = (0, w.useRef)(f),
      g = Ef(() => new Map()),
      _ = (0, w.useRef)(new Set()),
      [v, y] = (0, w.useState)(f),
      [b, x] = (0, w.useState)(f);
    Df(() => {
      ((m.current = !1), (h.current = f));
      for (let e = 0; e < b.length; e++) {
        let t = vx(b[e]);
        p.includes(t)
          ? (g.delete(t), _.current.delete(t))
          : g.get(t) !== !0 && g.set(t, !1);
      }
    }, [b, p.length, p.join(`-`)]);
    let S = [];
    if (f !== v) {
      let e = [...f];
      for (let t = 0; t < b.length; t++) {
        let n = b[t],
          r = vx(n);
        p.includes(r) || (e.splice(t, 0, n), S.push(n));
      }
      return (a === `wait` && S.length && (e = S), x(yx(e)), y(f), null);
    }
    let { forceRender: C } = (0, w.useContext)(Tf);
    return (0, X.jsx)(X.Fragment, {
      children: b.map((e) => {
        let v = vx(e),
          y = o && !u ? !1 : f === b || p.includes(v);
        return (0, X.jsx)(
          hx,
          {
            isPresent: y,
            initial: !m.current || n ? void 0 : !1,
            custom: t,
            presenceAffectsLayout: i,
            mode: a,
            root: l,
            onExitComplete: y
              ? void 0
              : () => {
                  if (_.current.has(v)) return;
                  if (g.has(v)) (_.current.add(v), g.set(v, !0));
                  else return;
                  let e = !0;
                  (g.forEach((t) => {
                    t || (e = !1);
                  }),
                    e && (C?.(), x(h.current), o && d?.(), r && r()));
                },
            anchorX: s,
            anchorY: c,
            children: e,
          },
          v,
        );
      }),
    });
  },
  xx = (0, w.createContext)({ strict: !1 }),
  Sx = {
    animation: [
      `animate`,
      `variants`,
      `whileHover`,
      `whileTap`,
      `exit`,
      `whileInView`,
      `whileFocus`,
      `whileDrag`,
    ],
    exit: [`exit`],
    drag: [`drag`, `dragControls`],
    focus: [`whileFocus`],
    hover: [`whileHover`, `onHoverStart`, `onHoverEnd`],
    tap: [`whileTap`, `onTap`, `onTapStart`, `onTapCancel`],
    pan: [`onPan`, `onPanStart`, `onPanSessionStart`, `onPanEnd`],
    inView: [`whileInView`, `onViewportEnter`, `onViewportLeave`],
    layout: [`layout`, `layoutId`],
  },
  Cx = !1;
function wx() {
  if (Cx) return;
  let e = {};
  for (let t in Sx) e[t] = { isEnabled: (e) => Sx[t].some((t) => !!e[t]) };
  (Ev(e), (Cx = !0));
}
function Tx() {
  return (wx(), Dv());
}
function Ex(e) {
  let t = Tx();
  for (let n in e) t[n] = { ...t[n], ...e[n] };
  Ev(t);
}
var Dx = new Set(
  `animate.exit.variants.initial.style.values.variants.transition.transformTemplate.custom.inherit.onBeforeLayoutMeasure.onAnimationStart.onAnimationComplete.onUpdate.onDragStart.onDrag.onDragEnd.onMeasureDragConstraints.onDirectionLock.onDragTransitionEnd._dragX._dragY.onHoverStart.onHoverEnd.onViewportEnter.onViewportLeave.globalTapTarget.propagate.ignoreStrict.viewport`.split(
    `.`,
  ),
);
function Ox(e) {
  return (
    e.startsWith(`while`) ||
    (e.startsWith(`drag`) && e !== `draggable`) ||
    e.startsWith(`layout`) ||
    e.startsWith(`onTap`) ||
    e.startsWith(`onPan`) ||
    e.startsWith(`onLayout`) ||
    Dx.has(e)
  );
}
var kx = c({ default: () => Ax }),
  Ax,
  jx = o(() => {
    throw (
      (Ax = {}),
      Error(
        `Could not resolve "@emotion/is-prop-valid" imported by "framer-motion". Is it installed?`,
      )
    );
  }),
  Mx = (e) => !Ox(e);
function Nx(e) {
  typeof e == `function` && (Mx = (t) => (t.startsWith(`on`) ? !Ox(t) : e(t)));
}
try {
  Nx((jx(), d(kx)).default);
} catch {}
function Px(e, t, n) {
  let r = {};
  for (let i in e)
    (i === `values` && typeof e.values == `object`) ||
      Wg(e[i]) ||
      ((Mx(i) ||
        (n === !0 && Ox(i)) ||
        (!t && !Ox(i)) ||
        (e.draggable && i.startsWith(`onDrag`))) &&
        (r[i] = e[i]));
  return r;
}
var Fx = (0, w.createContext)({});
function Ix(e, t) {
  if (_v(e)) {
    let { initial: t, animate: n } = e;
    return {
      initial: t === !1 || mv(t) ? t : void 0,
      animate: mv(n) ? n : void 0,
    };
  }
  return e.inherit === !1 ? {} : t;
}
function Lx(e) {
  let { initial: t, animate: n } = Ix(e, (0, w.useContext)(Fx));
  return (0, w.useMemo)(() => ({ initial: t, animate: n }), [Rx(t), Rx(n)]);
}
function Rx(e) {
  return Array.isArray(e) ? e.join(` `) : e;
}
var zx = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function Bx(e, t, n) {
  for (let r in t) !Wg(t[r]) && !sy(r, n) && (e[r] = t[r]);
}
function Vx({ transformTemplate: e }, t) {
  return (0, w.useMemo)(() => {
    let n = zx();
    return (ty(n, t, e), Object.assign({}, n.vars, n.style));
  }, [t]);
}
function Hx(e, t) {
  let n = e.style || {},
    r = {};
  return (Bx(r, n, e), Object.assign(r, Vx(e, t)), r);
}
function Ux(e, t) {
  let n = {},
    r = Hx(e, t);
  return (
    e.drag &&
      e.dragListener !== !1 &&
      ((n.draggable = !1),
      (r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = `none`),
      (r.touchAction =
        e.drag === !0 ? `none` : `pan-${e.drag === `x` ? `y` : `x`}`)),
    e.tabIndex === void 0 &&
      (e.onTap || e.onTapStart || e.whileTap) &&
      (n.tabIndex = 0),
    (n.style = r),
    n
  );
}
var Wx = () => ({ ...zx(), attrs: {} });
function Gx(e, t, n, r) {
  let i = (0, w.useMemo)(() => {
    let n = Wx();
    return (
      hy(n, t, _y(r), e.transformTemplate, e.style),
      { ...n.attrs, style: { ...n.style } }
    );
  }, [t]);
  if (e.style) {
    let t = {};
    (Bx(t, e.style, e), (i.style = { ...t, ...i.style }));
  }
  return i;
}
var Kx = [
  `animate`,
  `circle`,
  `defs`,
  `desc`,
  `ellipse`,
  `g`,
  `image`,
  `line`,
  `filter`,
  `marker`,
  `mask`,
  `metadata`,
  `path`,
  `pattern`,
  `polygon`,
  `polyline`,
  `rect`,
  `stop`,
  `switch`,
  `symbol`,
  `svg`,
  `text`,
  `tspan`,
  `use`,
  `view`,
];
function qx(e) {
  return typeof e != `string` || e.includes(`-`)
    ? !1
    : !!(Kx.indexOf(e) > -1 || /[A-Z]/u.test(e));
}
function Jx(e, t, n, { latestValues: r }, i, a = !1, o) {
  let s = ((o ?? qx(e)) ? Gx : Ux)(t, r, i, e),
    c = Px(t, typeof e == `string`, a),
    l = e === w.Fragment ? {} : { ...c, ...s, ref: n },
    { children: u } = t,
    d = (0, w.useMemo)(() => (Wg(u) ? u.get() : u), [u]);
  return (0, w.createElement)(e, { ...l, children: d });
}
function Yx({ scrapeMotionValuesFromProps: e, createRenderState: t }, n, r, i) {
  return { latestValues: Xx(n, r, i, e), renderState: t() };
}
function Xx(e, t, n, r) {
  let i = {},
    a = r(e, {});
  for (let e in a) i[e] = wb(a[e]);
  let { initial: o, animate: s } = e,
    c = _v(e),
    l = vv(e);
  t &&
    l &&
    !c &&
    e.inherit !== !1 &&
    (o === void 0 && (o = t.initial), s === void 0 && (s = t.animate));
  let u = n ? n.initial === !1 : !1;
  u ||= o === !1;
  let d = u ? s : o;
  if (d && typeof d != `boolean` && !pv(d)) {
    let t = Array.isArray(d) ? d : [d];
    for (let n = 0; n < t.length; n++) {
      let r = Mg(e, t[n]);
      if (r) {
        let { transitionEnd: e, transition: t, ...n } = r;
        for (let e in n) {
          let t = n[e];
          if (Array.isArray(t)) {
            let e = u ? t.length - 1 : 0;
            t = t[e];
          }
          t !== null && (i[e] = t);
        }
        for (let t in e) i[t] = e[t];
      }
    }
  }
  return i;
}
var Zx = (e) => (t, n) => {
    let r = (0, w.useContext)(Fx),
      i = (0, w.useContext)(Of),
      a = () => Yx(e, t, r, i);
    return n ? a() : Ef(a);
  },
  Qx = Zx({ scrapeMotionValuesFromProps: cy, createRenderState: zx }),
  $x = Zx({ scrapeMotionValuesFromProps: yy, createRenderState: Wx }),
  eS = Symbol.for(`motionComponentSymbol`);
function tS(e, t, n) {
  let r = (0, w.useRef)(n);
  (0, w.useInsertionEffect)(() => {
    r.current = n;
  });
  let i = (0, w.useRef)(null);
  return (0, w.useCallback)(
    (n) => {
      n && e.onMount?.(n);
      let a = r.current;
      if (typeof a == `function`)
        if (n) {
          let e = a(n);
          typeof e == `function` && (i.current = e);
        } else i.current ? (i.current(), (i.current = null)) : a(n);
      else a && (a.current = n);
      t && (n ? t.mount(n) : t.unmount());
    },
    [t],
  );
}
var nS = (0, w.createContext)({});
function rS(e) {
  return (
    e &&
    typeof e == `object` &&
    Object.prototype.hasOwnProperty.call(e, `current`)
  );
}
function iS(e, t, n, r, i, a) {
  let { visualElement: o } = (0, w.useContext)(Fx),
    s = (0, w.useContext)(xx),
    c = (0, w.useContext)(Of),
    l = (0, w.useContext)(lx),
    u = l.reducedMotion,
    d = l.skipAnimations,
    f = (0, w.useRef)(null),
    p = (0, w.useRef)(!1);
  ((r ||= s.renderer),
    !f.current &&
      r &&
      ((f.current = r(e, {
        visualState: t,
        parent: o,
        props: n,
        presenceContext: c,
        blockInitialAnimation: c ? c.initial === !1 : !1,
        reducedMotionConfig: u,
        skipAnimations: d,
        isSVG: a,
      })),
      p.current && f.current && (f.current.manuallyAnimateOnMount = !0)));
  let m = f.current,
    h = (0, w.useContext)(nS);
  m &&
    !m.projection &&
    i &&
    (m.type === `html` || m.type === `svg`) &&
    aS(f.current, n, i, h);
  let g = (0, w.useRef)(!1);
  (0, w.useInsertionEffect)(() => {
    m && g.current && m.update(n, c);
  });
  let _ = n[Jg],
    v = (0, w.useRef)(
      !!_ &&
        typeof window < `u` &&
        !window.MotionHandoffIsComplete?.(_) &&
        window.MotionHasOptimisedAnimation?.(_),
    );
  return (
    Df(() => {
      ((p.current = !0),
        m &&
          ((g.current = !0),
          (window.MotionIsMounted = !0),
          m.updateFeatures(),
          m.scheduleRenderMicrotask(),
          v.current && m.animationState && m.animationState.animateChanges()));
    }),
    (0, w.useEffect)(() => {
      m &&
        (!v.current && m.animationState && m.animationState.animateChanges(),
        (v.current &&=
          (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete?.(_);
          }),
          !1)),
        (m.enteringChildren = void 0));
    }),
    m
  );
}
function aS(e, t, n, r) {
  let {
    layoutId: i,
    layout: a,
    drag: o,
    dragConstraints: s,
    layoutScroll: c,
    layoutRoot: l,
    layoutAnchor: u,
    layoutCrossfade: d,
  } = t;
  ((e.projection = new n(
    e.latestValues,
    t[`data-framer-portal-id`] ? void 0 : oS(e.parent),
  )),
    e.projection.setOptions({
      layoutId: i,
      layout: a,
      alwaysMeasureLayout: !!o || (s && rS(s)),
      visualElement: e,
      animationType: typeof a == `string` ? a : `both`,
      initialPromotionConfig: r,
      crossfade: d,
      layoutScroll: c,
      layoutRoot: l,
      layoutAnchor: u,
    }));
}
function oS(e) {
  if (e) return e.options.allowProjection === !1 ? oS(e.parent) : e.projection;
}
function sS(e, { forwardMotionProps: t = !1, type: n } = {}, r, i) {
  r && Ex(r);
  let a = n ? n === `svg` : qx(e),
    o = a ? $x : Qx;
  function s(n, s) {
    let c,
      l = { ...(0, w.useContext)(lx), ...n, layoutId: cS(n) },
      { isStatic: u } = l,
      d = Lx(n),
      f = o(n, u);
    if (!u && typeof window < `u`) {
      lS(l, r);
      let t = uS(l);
      ((c = t.MeasureLayout),
        (d.visualElement = iS(e, f, l, i, t.ProjectionNode, a)));
    }
    return (0, X.jsxs)(Fx.Provider, {
      value: d,
      children: [
        c && d.visualElement
          ? (0, X.jsx)(c, { visualElement: d.visualElement, ...l })
          : null,
        Jx(e, n, tS(f, d.visualElement, s), f, u, t, a),
      ],
    });
  }
  s.displayName = `motion.${typeof e == `string` ? e : `create(${e.displayName ?? e.name ?? ``})`}`;
  let c = (0, w.forwardRef)(s);
  return ((c[eS] = e), c);
}
function cS({ layoutId: e }) {
  let t = (0, w.useContext)(Tf).id;
  return t && e !== void 0 ? t + `-` + e : e;
}
function lS(e, t) {
  (0, w.useContext)(xx).strict;
}
function uS(e) {
  let { drag: t, layout: n } = Tx();
  if (!t && !n) return {};
  let r = { ...t, ...n };
  return {
    MeasureLayout:
      t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
    ProjectionNode: r.ProjectionNode,
  };
}
function dS(e, t) {
  if (typeof Proxy > `u`) return sS;
  let n = new Map(),
    r = (n, r) => sS(n, r, e, t);
  return new Proxy((e, t) => r(e, t), {
    get: (i, a) =>
      a === `create`
        ? r
        : (n.has(a) || n.set(a, sS(a, void 0, e, t)), n.get(a)),
  });
}
var fS = (e, t) =>
    (t.isSVG ?? qx(e))
      ? new by(t)
      : new uy(t, { allowProjection: e !== w.Fragment }),
  pS = class extends Av {
    constructor(e) {
      (super(e), (e.animationState ||= Dy(e)));
    }
    updateAnimationControlsSubscription() {
      let { animate: e } = this.node.getProps();
      pv(e) && (this.unmountControls = e.subscribe(this.node));
    }
    mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      let { animate: e } = this.node.getProps(),
        { animate: t } = this.node.prevProps || {};
      e !== t && this.updateAnimationControlsSubscription();
    }
    unmount() {
      (this.node.animationState.reset(), this.unmountControls?.());
    }
  },
  mS = 0,
  hS = {
    animation: { Feature: pS },
    exit: {
      Feature: class extends Av {
        constructor() {
          (super(...arguments), (this.id = mS++), (this.isExitComplete = !1));
        }
        update() {
          if (!this.node.presenceContext) return;
          let { isPresent: e, onExitComplete: t } = this.node.presenceContext,
            { isPresent: n } = this.node.prevPresenceContext || {};
          if (!this.node.animationState || e === n) return;
          if (e && n === !1) {
            if (this.isExitComplete) {
              let { initial: e, custom: t } = this.node.getProps();
              if (typeof e == `string`) {
                let n = Ng(this.node, e, t);
                if (n) {
                  let { transition: e, transitionEnd: t, ...r } = n;
                  for (let e in r) this.node.getValue(e)?.jump(r[e]);
                }
              }
              (this.node.animationState.reset(),
                this.node.animationState.animateChanges());
            } else this.node.animationState.setActive(`exit`, !1);
            this.isExitComplete = !1;
            return;
          }
          let r = this.node.animationState.setActive(`exit`, !e);
          t &&
            !e &&
            r.then(() => {
              ((this.isExitComplete = !0), t(this.id));
            });
        }
        mount() {
          let { register: e, onExitComplete: t } =
            this.node.presenceContext || {};
          (t && t(this.id), e && (this.unmount = e(this.id)));
        }
        unmount() {}
      },
    },
  };
function gS(e) {
  return { point: { x: e.pageX, y: e.pageY } };
}
var _S = (e) => (t) => M_(t) && e(t, gS(t));
function vS(e, t, n, r) {
  return bb(e, t, _S(n), r);
}
var yS = ({ current: e }) => (e ? e.ownerDocument.defaultView : null),
  bS = (e, t) => Math.abs(e - t);
function xS(e, t) {
  let n = bS(e.x, t.x),
    r = bS(e.y, t.y);
  return Math.sqrt(n ** 2 + r ** 2);
}
var SS = new Set([`auto`, `scroll`]),
  CS = class {
    constructor(
      e,
      t,
      {
        transformPagePoint: n,
        contextWindow: r = window,
        dragSnapToOrigin: i = !1,
        distanceThreshold: a = 3,
        element: o,
      } = {},
    ) {
      if (
        ((this.startEvent = null),
        (this.lastMoveEvent = null),
        (this.lastMoveEventInfo = null),
        (this.lastRawMoveEventInfo = null),
        (this.handlers = {}),
        (this.contextWindow = window),
        (this.scrollPositions = new Map()),
        (this.removeScrollListeners = null),
        (this.onElementScroll = (e) => {
          this.handleScroll(e.target);
        }),
        (this.onWindowScroll = () => {
          this.handleScroll(window);
        }),
        (this.updatePoint = () => {
          if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
          this.lastRawMoveEventInfo &&
            (this.lastMoveEventInfo = wS(
              this.lastRawMoveEventInfo,
              this.transformPagePoint,
            ));
          let e = ES(this.lastMoveEventInfo, this.history),
            t = this.startEvent !== null,
            n = xS(e.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
          if (!t && !n) return;
          let { point: r } = e,
            { timestamp: i } = bp;
          this.history.push({ ...r, timestamp: i });
          let { onStart: a, onMove: o } = this.handlers;
          (t ||
            (a && a(this.lastMoveEvent, e),
            (this.startEvent = this.lastMoveEvent)),
            o && o(this.lastMoveEvent, e));
        }),
        (this.handlePointerMove = (e, t) => {
          ((this.lastMoveEvent = e),
            (this.lastRawMoveEventInfo = t),
            (this.lastMoveEventInfo = wS(t, this.transformPagePoint)),
            vp.update(this.updatePoint, !0));
        }),
        (this.handlePointerUp = (e, t) => {
          this.end();
          let { onEnd: n, onSessionEnd: r, resumeAnimation: i } = this.handlers;
          if (
            ((this.dragSnapToOrigin || !this.startEvent) && i && i(),
            !(this.lastMoveEvent && this.lastMoveEventInfo))
          )
            return;
          let a = ES(
            e.type === `pointercancel`
              ? this.lastMoveEventInfo
              : wS(t, this.transformPagePoint),
            this.history,
          );
          (this.startEvent && n && n(e, a), r && r(e, a));
        }),
        !M_(e))
      )
        return;
      ((this.dragSnapToOrigin = i),
        (this.handlers = t),
        (this.transformPagePoint = n),
        (this.distanceThreshold = a),
        (this.contextWindow = r || window));
      let s = wS(gS(e), this.transformPagePoint),
        { point: c } = s,
        { timestamp: l } = bp;
      this.history = [{ ...c, timestamp: l }];
      let { onSessionStart: u } = t;
      (u && u(e, ES(s, this.history)),
        (this.removeListeners = zf(
          vS(this.contextWindow, `pointermove`, this.handlePointerMove),
          vS(this.contextWindow, `pointerup`, this.handlePointerUp),
          vS(this.contextWindow, `pointercancel`, this.handlePointerUp),
        )),
        o && this.startScrollTracking(o));
    }
    startScrollTracking(e) {
      let t = e.parentElement;
      for (; t; ) {
        let e = getComputedStyle(t);
        ((SS.has(e.overflowX) || SS.has(e.overflowY)) &&
          this.scrollPositions.set(t, { x: t.scrollLeft, y: t.scrollTop }),
          (t = t.parentElement));
      }
      (this.scrollPositions.set(window, {
        x: window.scrollX,
        y: window.scrollY,
      }),
        window.addEventListener(`scroll`, this.onElementScroll, {
          capture: !0,
        }),
        window.addEventListener(`scroll`, this.onWindowScroll),
        (this.removeScrollListeners = () => {
          (window.removeEventListener(`scroll`, this.onElementScroll, {
            capture: !0,
          }),
            window.removeEventListener(`scroll`, this.onWindowScroll));
        }));
    }
    handleScroll(e) {
      let t = this.scrollPositions.get(e);
      if (!t) return;
      let n = e === window,
        r = n
          ? { x: window.scrollX, y: window.scrollY }
          : { x: e.scrollLeft, y: e.scrollTop },
        i = { x: r.x - t.x, y: r.y - t.y };
      (i.x === 0 && i.y === 0) ||
        (n
          ? this.lastMoveEventInfo &&
            ((this.lastMoveEventInfo.point.x += i.x),
            (this.lastMoveEventInfo.point.y += i.y))
          : this.history.length > 0 &&
            ((this.history[0].x -= i.x), (this.history[0].y -= i.y)),
        this.scrollPositions.set(e, r),
        vp.update(this.updatePoint, !0));
    }
    updateHandlers(e) {
      this.handlers = e;
    }
    end() {
      (this.removeListeners && this.removeListeners(),
        this.removeScrollListeners && this.removeScrollListeners(),
        this.scrollPositions.clear(),
        yp(this.updatePoint));
    }
  };
function wS(e, t) {
  return t ? { point: t(e.point) } : e;
}
function TS(e, t) {
  return { x: e.x - t.x, y: e.y - t.y };
}
function ES({ point: e }, t) {
  return {
    point: e,
    delta: TS(e, OS(t)),
    offset: TS(e, DS(t)),
    velocity: kS(t, 0.1),
  };
}
function DS(e) {
  return e[0];
}
function OS(e) {
  return e[e.length - 1];
}
function kS(e, t) {
  if (e.length < 2) return { x: 0, y: 0 };
  let n = e.length - 1,
    r = null,
    i = OS(e);
  for (; n >= 0 && ((r = e[n]), !(i.timestamp - r.timestamp > Hf(t))); ) n--;
  if (!r) return { x: 0, y: 0 };
  r === e[0] &&
    e.length > 2 &&
    i.timestamp - r.timestamp > Hf(t) * 2 &&
    (r = e[1]);
  let a = Uf(i.timestamp - r.timestamp);
  if (a === 0) return { x: 0, y: 0 };
  let o = { x: (i.x - r.x) / a, y: (i.y - r.y) / a };
  return (o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o);
}
function AS(e, { min: t, max: n }, r) {
  return (
    t !== void 0 && e < t
      ? (e = r ? ym(t, e, r.min) : Math.max(e, t))
      : n !== void 0 && e > n && (e = r ? ym(n, e, r.max) : Math.min(e, n)),
    e
  );
}
function jS(e, t, n) {
  return {
    min: t === void 0 ? void 0 : e.min + t,
    max: n === void 0 ? void 0 : e.max + n - (e.max - e.min),
  };
}
function MS(e, { top: t, left: n, bottom: r, right: i }) {
  return { x: jS(e.x, n, i), y: jS(e.y, t, r) };
}
function NS(e, t) {
  let n = t.min - e.min,
    r = t.max - e.max;
  return (
    t.max - t.min < e.max - e.min && ([n, r] = [r, n]),
    { min: n, max: r }
  );
}
function PS(e, t) {
  return { x: NS(e.x, t.x), y: NS(e.y, t.y) };
}
function FS(e, t) {
  let n = 0.5,
    r = By(e),
    i = By(t);
  return (
    i > r
      ? (n = Bf(t.min, t.max - r, e.min))
      : r > i && (n = Bf(e.min, e.max - i, t.min)),
    jf(0, 1, n)
  );
}
function IS(e, t) {
  let n = {};
  return (
    t.min !== void 0 && (n.min = t.min - e.min),
    t.max !== void 0 && (n.max = t.max - e.min),
    n
  );
}
var LS = 0.35;
function RS(e = LS) {
  return (
    e === !1 ? (e = 0) : e === !0 && (e = LS),
    { x: zS(e, `left`, `right`), y: zS(e, `top`, `bottom`) }
  );
}
function zS(e, t, n) {
  return { min: BS(e, t), max: BS(e, n) };
}
function BS(e, t) {
  return typeof e == `number` ? e : e[t] || 0;
}
var VS = new WeakMap(),
  HS = class {
    constructor(e) {
      ((this.openDragLock = null),
        (this.isDragging = !1),
        (this.currentDirection = null),
        (this.originPoint = { x: 0, y: 0 }),
        (this.constraints = !1),
        (this.hasMutatedConstraints = !1),
        (this.elastic = dv()),
        (this.latestPointerEvent = null),
        (this.latestPanInfo = null),
        (this.visualElement = e));
    }
    start(e, { snapToCursor: t = !1, distanceThreshold: n } = {}) {
      let { presenceContext: r } = this.visualElement;
      if (r && r.isPresent === !1) return;
      let i = (e) => {
          (t && this.snapToCursor(gS(e).point), this.stopAnimation());
        },
        a = (e, t) => {
          let { drag: n, dragPropagation: r, onDragStart: i } = this.getProps();
          if (
            n &&
            !r &&
            (this.openDragLock && this.openDragLock(),
            (this.openDragLock = D_(n)),
            !this.openDragLock)
          )
            return;
          ((this.latestPointerEvent = e),
            (this.latestPanInfo = t),
            (this.isDragging = !0),
            (this.currentDirection = null),
            this.resolveConstraints(),
            this.visualElement.projection &&
              ((this.visualElement.projection.isAnimationBlocked = !0),
              (this.visualElement.projection.target = void 0)),
            cb((e) => {
              let t = this.getAxisMotionValue(e).get() || 0;
              if (Jp.test(t)) {
                let { projection: n } = this.visualElement;
                if (n && n.layout) {
                  let r = n.layout.layoutBox[e];
                  r && (t = By(r) * (parseFloat(t) / 100));
                }
              }
              this.originPoint[e] = t;
            }),
            i && vp.update(() => i(e, t), !1, !0),
            Kg(this.visualElement, `transform`));
          let { animationState: a } = this.visualElement;
          a && a.setActive(`whileDrag`, !0);
        },
        o = (e, t) => {
          ((this.latestPointerEvent = e), (this.latestPanInfo = t));
          let {
            dragPropagation: n,
            dragDirectionLock: r,
            onDirectionLock: i,
            onDrag: a,
          } = this.getProps();
          if (!n && !this.openDragLock) return;
          let { offset: o } = t;
          if (r && this.currentDirection === null) {
            ((this.currentDirection = KS(o)),
              this.currentDirection !== null && i && i(this.currentDirection));
            return;
          }
          (this.updateAxis(`x`, t.point, o),
            this.updateAxis(`y`, t.point, o),
            this.visualElement.render(),
            a && vp.update(() => a(e, t), !1, !0));
        },
        s = (e, t) => {
          ((this.latestPointerEvent = e),
            (this.latestPanInfo = t),
            this.stop(e, t),
            (this.latestPointerEvent = null),
            (this.latestPanInfo = null));
        },
        c = () => {
          let { dragSnapToOrigin: e } = this.getProps();
          (e || this.constraints) && this.startAnimation({ x: 0, y: 0 });
        },
        { dragSnapToOrigin: l } = this.getProps();
      this.panSession = new CS(
        e,
        {
          onSessionStart: i,
          onStart: a,
          onMove: o,
          onSessionEnd: s,
          resumeAnimation: c,
        },
        {
          transformPagePoint: this.visualElement.getTransformPagePoint(),
          dragSnapToOrigin: l,
          distanceThreshold: n,
          contextWindow: yS(this.visualElement),
          element: this.visualElement.current,
        },
      );
    }
    stop(e, t) {
      let n = e || this.latestPointerEvent,
        r = t || this.latestPanInfo,
        i = this.isDragging;
      if ((this.cancel(), !i || !r || !n)) return;
      let { velocity: a } = r;
      this.startAnimation(a);
      let { onDragEnd: o } = this.getProps();
      o && vp.postRender(() => o(n, r));
    }
    cancel() {
      this.isDragging = !1;
      let { projection: e, animationState: t } = this.visualElement;
      (e && (e.isAnimationBlocked = !1), this.endPanSession());
      let { dragPropagation: n } = this.getProps();
      (!n &&
        this.openDragLock &&
        (this.openDragLock(), (this.openDragLock = null)),
        t && t.setActive(`whileDrag`, !1));
    }
    endPanSession() {
      (this.panSession && this.panSession.end(), (this.panSession = void 0));
    }
    updateAxis(e, t, n) {
      let { drag: r } = this.getProps();
      if (!n || !GS(e, r, this.currentDirection)) return;
      let i = this.getAxisMotionValue(e),
        a = this.originPoint[e] + n[e];
      (this.constraints &&
        this.constraints[e] &&
        (a = AS(a, this.constraints[e], this.elastic[e])),
        i.set(a));
    }
    resolveConstraints() {
      let { dragConstraints: e, dragElastic: t } = this.getProps(),
        n =
          this.visualElement.projection && !this.visualElement.projection.layout
            ? this.visualElement.projection.measure(!1)
            : this.visualElement.projection?.layout,
        r = this.constraints;
      (e && rS(e)
        ? (this.constraints ||= this.resolveRefConstraints())
        : e && n
          ? (this.constraints = MS(n.layoutBox, e))
          : (this.constraints = !1),
        (this.elastic = RS(t)),
        r !== this.constraints &&
          !rS(e) &&
          n &&
          this.constraints &&
          !this.hasMutatedConstraints &&
          cb((e) => {
            this.constraints !== !1 &&
              this.getAxisMotionValue(e) &&
              (this.constraints[e] = IS(n.layoutBox[e], this.constraints[e]));
          }));
    }
    resolveRefConstraints() {
      let { dragConstraints: e, onMeasureDragConstraints: t } = this.getProps();
      if (!e || !rS(e)) return !1;
      let n = e.current,
        { projection: r } = this.visualElement;
      if (!r || !r.layout) return !1;
      let i = Zv(n, r.root, this.visualElement.getTransformPagePoint()),
        a = PS(r.layout.layoutBox, i);
      if (t) {
        let e = t(Mv(a));
        ((this.hasMutatedConstraints = !!e), e && (a = jv(e)));
      }
      return a;
    }
    startAnimation(e) {
      let {
          drag: t,
          dragMomentum: n,
          dragElastic: r,
          dragTransition: i,
          dragSnapToOrigin: a,
          onDragTransitionEnd: o,
        } = this.getProps(),
        s = this.constraints || {},
        c = cb((o) => {
          if (!GS(o, t, this.currentDirection)) return;
          let c = (s && s[o]) || {};
          (a === !0 || a === o) && (c = { min: 0, max: 0 });
          let l = r ? 200 : 1e6,
            u = r ? 40 : 1e7,
            d = {
              type: `inertia`,
              velocity: n ? e[o] : 0,
              bounceStiffness: l,
              bounceDamping: u,
              timeConstant: 750,
              restDelta: 1,
              restSpeed: 10,
              ...i,
              ...c,
            };
          return this.startAxisValueAnimation(o, d);
        });
      return Promise.all(c).then(o);
    }
    startAxisValueAnimation(e, t) {
      let n = this.getAxisMotionValue(e);
      return (
        Kg(this.visualElement, e),
        n.start(Ag(e, n, 0, t, this.visualElement, !1))
      );
    }
    stopAnimation() {
      cb((e) => this.getAxisMotionValue(e).stop());
    }
    getAxisMotionValue(e) {
      let t = `_drag${e.toUpperCase()}`,
        n = this.visualElement.getProps();
      return (
        n[t] ||
        this.visualElement.getValue(e, (n.initial ? n.initial[e] : void 0) || 0)
      );
    }
    snapToCursor(e) {
      cb((t) => {
        let { drag: n } = this.getProps();
        if (!GS(t, n, this.currentDirection)) return;
        let { projection: r } = this.visualElement,
          i = this.getAxisMotionValue(t);
        if (r && r.layout) {
          let { min: n, max: a } = r.layout.layoutBox[t],
            o = i.get() || 0;
          i.set(e[t] - ym(n, a, 0.5) + o);
        }
      });
    }
    scalePositionWithinConstraints() {
      if (!this.visualElement.current) return;
      let { drag: e, dragConstraints: t } = this.getProps(),
        { projection: n } = this.visualElement;
      if (!rS(t) || !n || !this.constraints) return;
      this.stopAnimation();
      let r = { x: 0, y: 0 };
      cb((e) => {
        let t = this.getAxisMotionValue(e);
        if (t && this.constraints !== !1) {
          let n = t.get();
          r[e] = FS({ min: n, max: n }, this.constraints[e]);
        }
      });
      let { transformTemplate: i } = this.visualElement.getProps();
      ((this.visualElement.current.style.transform = i ? i({}, ``) : `none`),
        n.root && n.root.updateScroll(),
        n.updateLayout(),
        (this.constraints = !1),
        this.resolveConstraints(),
        cb((t) => {
          if (!GS(t, e, null)) return;
          let n = this.getAxisMotionValue(t),
            { min: i, max: a } = this.constraints[t];
          n.set(ym(i, a, r[t]));
        }),
        this.visualElement.render());
    }
    addListeners() {
      if (!this.visualElement.current) return;
      VS.set(this.visualElement, this);
      let e = this.visualElement.current,
        t = vS(e, `pointerdown`, (t) => {
          let { drag: n, dragListener: r = !0 } = this.getProps(),
            i = t.target,
            a = i !== e && I_(i);
          n && r && !a && this.start(t);
        }),
        n,
        r = () => {
          let { dragConstraints: t } = this.getProps();
          rS(t) &&
            t.current &&
            ((this.constraints = this.resolveRefConstraints()),
            (n ||= WS(e, t.current, () =>
              this.scalePositionWithinConstraints(),
            )));
        },
        { projection: i } = this.visualElement,
        a = i.addEventListener(`measure`, r);
      (i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()),
        vp.read(r));
      let o = bb(window, `resize`, () => this.scalePositionWithinConstraints()),
        s = i.addEventListener(
          `didUpdate`,
          ({ delta: e, hasLayoutChanged: t }) => {
            this.isDragging &&
              t &&
              (cb((t) => {
                let n = this.getAxisMotionValue(t);
                n &&
                  ((this.originPoint[t] += e[t].translate),
                  n.set(n.get() + e[t].translate));
              }),
              this.visualElement.render());
          },
        );
      return () => {
        (o(), t(), a(), s && s(), n && n());
      };
    }
    getProps() {
      let e = this.visualElement.getProps(),
        {
          drag: t = !1,
          dragDirectionLock: n = !1,
          dragPropagation: r = !1,
          dragConstraints: i = !1,
          dragElastic: a = LS,
          dragMomentum: o = !0,
        } = e;
      return {
        ...e,
        drag: t,
        dragDirectionLock: n,
        dragPropagation: r,
        dragConstraints: i,
        dragElastic: a,
        dragMomentum: o,
      };
    }
  };
function US(e) {
  let t = !0;
  return () => {
    if (t) {
      t = !1;
      return;
    }
    e();
  };
}
function WS(e, t, n) {
  let r = iv(e, US(n)),
    i = iv(t, US(n));
  return () => {
    (r(), i());
  };
}
function GS(e, t, n) {
  return (t === !0 || t === e) && (n === null || n === e);
}
function KS(e, t = 10) {
  let n = null;
  return (Math.abs(e.y) > t ? (n = `y`) : Math.abs(e.x) > t && (n = `x`), n);
}
var qS = class extends Av {
    constructor(e) {
      (super(e),
        (this.removeGroupControls = Lf),
        (this.removeListeners = Lf),
        (this.controls = new HS(e)));
    }
    mount() {
      let { dragControls: e } = this.node.getProps();
      (e && (this.removeGroupControls = e.subscribe(this.controls)),
        (this.removeListeners = this.controls.addListeners() || Lf));
    }
    update() {
      let { dragControls: e } = this.node.getProps(),
        { dragControls: t } = this.node.prevProps || {};
      e !== t &&
        (this.removeGroupControls(),
        e && (this.removeGroupControls = e.subscribe(this.controls)));
    }
    unmount() {
      (this.removeGroupControls(),
        this.removeListeners(),
        this.controls.isDragging || this.controls.endPanSession());
    }
  },
  JS = (e) => (t, n) => {
    e && vp.update(() => e(t, n), !1, !0);
  },
  YS = class extends Av {
    constructor() {
      (super(...arguments), (this.removePointerDownListener = Lf));
    }
    onPointerDown(e) {
      this.session = new CS(e, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: yS(this.node),
      });
    }
    createPanHandlers() {
      let {
        onPanSessionStart: e,
        onPanStart: t,
        onPan: n,
        onPanEnd: r,
      } = this.node.getProps();
      return {
        onSessionStart: JS(e),
        onStart: JS(t),
        onMove: JS(n),
        onEnd: (e, t) => {
          (delete this.session, r && vp.postRender(() => r(e, t)));
        },
      };
    }
    mount() {
      this.removePointerDownListener = vS(
        this.node.current,
        `pointerdown`,
        (e) => this.onPointerDown(e),
      );
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      (this.removePointerDownListener(), this.session && this.session.end());
    }
  },
  XS = !1,
  ZS = class extends w.Component {
    componentDidMount() {
      let {
          visualElement: e,
          layoutGroup: t,
          switchLayoutGroup: n,
          layoutId: r,
        } = this.props,
        { projection: i } = e;
      (i &&
        (t.group && t.group.add(i),
        n && n.register && r && n.register(i),
        XS && i.root.didUpdate(),
        i.addEventListener(`animationComplete`, () => {
          this.safeToRemove();
        }),
        i.setOptions({
          ...i.options,
          layoutDependency: this.props.layoutDependency,
          onExitComplete: () => this.safeToRemove(),
        })),
        (Eb.hasEverUpdated = !0));
    }
    getSnapshotBeforeUpdate(e) {
      let {
          layoutDependency: t,
          visualElement: n,
          drag: r,
          isPresent: i,
        } = this.props,
        { projection: a } = n;
      return a
        ? ((a.isPresent = i),
          e.layoutDependency !== t &&
            a.setOptions({ ...a.options, layoutDependency: t }),
          (XS = !0),
          r || e.layoutDependency !== t || t === void 0 || e.isPresent !== i
            ? a.willUpdate()
            : this.safeToRemove(),
          e.isPresent !== i &&
            (i
              ? a.promote()
              : a.relegate() ||
                vp.postRender(() => {
                  let e = a.getStack();
                  (!e || !e.members.length) && this.safeToRemove();
                })),
          null)
        : null;
    }
    componentDidUpdate() {
      let { visualElement: e, layoutAnchor: t } = this.props,
        { projection: n } = e;
      n &&
        ((n.options.layoutAnchor = t),
        n.root.didUpdate(),
        C_.postRender(() => {
          !n.currentAnimation && n.isLead() && this.safeToRemove();
        }));
    }
    componentWillUnmount() {
      let {
          visualElement: e,
          layoutGroup: t,
          switchLayoutGroup: n,
        } = this.props,
        { projection: r } = e;
      ((XS = !0),
        r &&
          (r.scheduleCheckAfterUnmount(),
          t && t.group && t.group.remove(r),
          n && n.deregister && n.deregister(r)));
    }
    safeToRemove() {
      let { safeToRemove: e } = this.props;
      e && e();
    }
    render() {
      return null;
    }
  };
function QS(e) {
  let [t, n] = _x(),
    r = (0, w.useContext)(Tf);
  return (0, X.jsx)(ZS, {
    ...e,
    layoutGroup: r,
    switchLayoutGroup: (0, w.useContext)(nS),
    isPresent: t,
    safeToRemove: n,
  });
}
var $S = {
  pan: { Feature: YS },
  drag: { Feature: qS, ProjectionNode: cx, MeasureLayout: QS },
};
function eC(e, t, n) {
  let { props: r } = e;
  e.animationState &&
    r.whileHover &&
    e.animationState.setActive(`whileHover`, n === `Start`);
  let i = r[`onHover` + n];
  i && vp.postRender(() => i(t, gS(t)));
}
var tC = class extends Av {
    mount() {
      let { current: e } = this.node;
      e &&
        (this.unmount = A_(
          e,
          (e, t) => (eC(this.node, t, `Start`), (e) => eC(this.node, e, `End`)),
        ));
    }
    unmount() {}
  },
  nC = class extends Av {
    constructor() {
      (super(...arguments), (this.isActive = !1));
    }
    onFocus() {
      let e = !1;
      try {
        e = this.node.current.matches(`:focus-visible`);
      } catch {
        e = !0;
      }
      !e ||
        !this.node.animationState ||
        (this.node.animationState.setActive(`whileFocus`, !0),
        (this.isActive = !0));
    }
    onBlur() {
      !this.isActive ||
        !this.node.animationState ||
        (this.node.animationState.setActive(`whileFocus`, !1),
        (this.isActive = !1));
    }
    mount() {
      this.unmount = zf(
        bb(this.node.current, `focus`, () => this.onFocus()),
        bb(this.node.current, `blur`, () => this.onBlur()),
      );
    }
    unmount() {}
  };
function rC(e, t, n) {
  let { props: r } = e;
  if (e.current instanceof HTMLButtonElement && e.current.disabled) return;
  e.animationState &&
    r.whileTap &&
    e.animationState.setActive(`whileTap`, n === `Start`);
  let i = r[`onTap` + (n === `End` ? `` : n)];
  i && vp.postRender(() => i(t, gS(t)));
}
var iC = class extends Av {
    mount() {
      let { current: e } = this.node;
      if (!e) return;
      let { globalTapTarget: t, propagate: n } = this.node.props;
      this.unmount = U_(
        e,
        (e, t) => (
          rC(this.node, t, `Start`),
          (e, { success: t }) => rC(this.node, e, t ? `End` : `Cancel`)
        ),
        { useGlobalTarget: t, stopPropagation: n?.tap === !1 },
      );
    }
    unmount() {}
  },
  aC = new WeakMap(),
  oC = new WeakMap(),
  sC = (e) => {
    let t = aC.get(e.target);
    t && t(e);
  },
  cC = (e) => {
    e.forEach(sC);
  };
function lC({ root: e, ...t }) {
  let n = e || document;
  oC.has(n) || oC.set(n, {});
  let r = oC.get(n),
    i = JSON.stringify(t);
  return (
    r[i] || (r[i] = new IntersectionObserver(cC, { root: e, ...t })),
    r[i]
  );
}
function uC(e, t, n) {
  let r = lC(t);
  return (
    aC.set(e, n),
    r.observe(e),
    () => {
      (aC.delete(e), r.unobserve(e));
    }
  );
}
var dC = { some: 0, all: 1 },
  fC = class extends Av {
    constructor() {
      (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
    }
    startObserver() {
      this.stopObserver?.();
      let { viewport: e = {} } = this.node.getProps(),
        { root: t, margin: n, amount: r = `some`, once: i } = e,
        a = {
          root: t ? t.current : void 0,
          rootMargin: n,
          threshold: typeof r == `number` ? r : dC[r],
        };
      this.stopObserver = uC(this.node.current, a, (e) => {
        let { isIntersecting: t } = e;
        if (
          this.isInView === t ||
          ((this.isInView = t), i && !t && this.hasEnteredView)
        )
          return;
        (t && (this.hasEnteredView = !0),
          this.node.animationState &&
            this.node.animationState.setActive(`whileInView`, t));
        let { onViewportEnter: n, onViewportLeave: r } = this.node.getProps(),
          a = t ? n : r;
        a && a(e);
      });
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver > `u`) return;
      let { props: e, prevProps: t } = this.node;
      [`amount`, `margin`, `root`].some(pC(e, t)) && this.startObserver();
    }
    unmount() {
      (this.stopObserver?.(), (this.hasEnteredView = !1), (this.isInView = !1));
    }
  };
function pC({ viewport: e = {} }, { viewport: t = {} } = {}) {
  return (n) => e[n] !== t[n];
}
var mC = {
    inView: { Feature: fC },
    tap: { Feature: iC },
    focus: { Feature: nC },
    hover: { Feature: tC },
  },
  hC = { layout: { ProjectionNode: cx, MeasureLayout: QS } },
  gC = dS({ ...hS, ...mC, ...$S, ...hC }, fS),
  _C = u(y(), 1),
  vC = {
    dashboard: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`rect`, {
          x: `3`,
          y: `3`,
          width: `7`,
          height: `9`,
          rx: `1.5`,
        }),
        (0, X.jsx)(`rect`, {
          x: `14`,
          y: `3`,
          width: `7`,
          height: `5`,
          rx: `1.5`,
        }),
        (0, X.jsx)(`rect`, {
          x: `14`,
          y: `12`,
          width: `7`,
          height: `9`,
          rx: `1.5`,
        }),
        (0, X.jsx)(`rect`, {
          x: `3`,
          y: `16`,
          width: `7`,
          height: `5`,
          rx: `1.5`,
        }),
      ],
    }),
    bots: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`rect`, {
          x: `4`,
          y: `6`,
          width: `16`,
          height: `12`,
          rx: `2`,
        }),
        (0, X.jsx)(`circle`, { cx: `9`, cy: `12`, r: `1` }),
        (0, X.jsx)(`circle`, { cx: `15`, cy: `12`, r: `1` }),
        (0, X.jsx)(`path`, { d: `M12 3v3` }),
      ],
    }),
    messages: (0, X.jsx)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: (0, X.jsx)(`path`, {
        d: `M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z`,
      }),
    }),
    contacts: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`path`, { d: `M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2` }),
        (0, X.jsx)(`circle`, { cx: `9`, cy: `7`, r: `4` }),
        (0, X.jsx)(`path`, { d: `M23 21v-2a4 4 0 0 0-3-3.87` }),
        (0, X.jsx)(`path`, { d: `M16 3.13a4 4 0 0 1 0 7.75` }),
      ],
    }),
    schedule: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`rect`, {
          x: `3`,
          y: `4`,
          width: `18`,
          height: `18`,
          rx: `2`,
        }),
        (0, X.jsx)(`line`, { x1: `16`, y1: `2`, x2: `16`, y2: `6` }),
        (0, X.jsx)(`line`, { x1: `8`, y1: `2`, x2: `8`, y2: `6` }),
        (0, X.jsx)(`line`, { x1: `3`, y1: `10`, x2: `21`, y2: `10` }),
      ],
    }),
    napcat: (0, X.jsx)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: (0, X.jsx)(`path`, {
        d: `M12 2l3 5 5 .5-3.5 3.5 1 5-5.5-2.5L6.5 16l1-5L4 7.5 9 7z`,
      }),
    }),
    console: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`polyline`, { points: `4 17 10 11 4 5` }),
        (0, X.jsx)(`line`, { x1: `12`, y1: `19`, x2: `20`, y2: `19` }),
      ],
    }),
    logs: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`path`, {
          d: `M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z`,
        }),
        (0, X.jsx)(`polyline`, { points: `14 2 14 8 20 8` }),
        (0, X.jsx)(`line`, { x1: `8`, y1: `13`, x2: `16`, y2: `13` }),
        (0, X.jsx)(`line`, { x1: `8`, y1: `17`, x2: `13`, y2: `17` }),
      ],
    }),
    ncLogs: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`rect`, {
          x: `3`,
          y: `4`,
          width: `18`,
          height: `16`,
          rx: `2`,
        }),
        (0, X.jsx)(`line`, { x1: `3`, y1: `9`, x2: `21`, y2: `9` }),
        (0, X.jsx)(`line`, { x1: `7`, y1: `13`, x2: `13`, y2: `13` }),
        (0, X.jsx)(`line`, { x1: `7`, y1: `16`, x2: `11`, y2: `16` }),
      ],
    }),
    serverLogs: (0, X.jsxs)(`svg`, {
      width: `18`,
      height: `18`,
      viewBox: `0 0 24 24`,
      fill: `none`,
      stroke: `currentColor`,
      strokeWidth: `1.8`,
      strokeLinecap: `round`,
      strokeLinejoin: `round`,
      children: [
        (0, X.jsx)(`rect`, {
          x: `2`,
          y: `4`,
          width: `20`,
          height: `6`,
          rx: `1.5`,
        }),
        (0, X.jsx)(`rect`, {
          x: `2`,
          y: `14`,
          width: `20`,
          height: `6`,
          rx: `1.5`,
        }),
        (0, X.jsx)(`line`, { x1: `6`, y1: `7`, x2: `6.01`, y2: `7` }),
        (0, X.jsx)(`line`, { x1: `6`, y1: `17`, x2: `6.01`, y2: `17` }),
      ],
    }),
  },
  yC = [
    { to: `/dashboard`, label: `仪表盘`, icon: vC.dashboard, group: `概览` },
    { to: `/bots`, label: `Bot 实例`, icon: vC.bots, group: `机器人` },
    { to: `/messages`, label: `消息`, icon: vC.messages, group: `机器人` },
    { to: `/contacts`, label: `联系人`, icon: vC.contacts, group: `机器人` },
    { to: `/schedules`, label: `定时任务`, icon: vC.schedule, group: `机器人` },
    { to: `/napcat`, label: `NapCat`, icon: vC.napcat, group: `系统` },
    { to: `/console`, label: `控制台`, icon: vC.console, group: `系统` },
    { to: `/nc-logs`, label: `NapCat 日志`, icon: vC.ncLogs, group: `日志` },
    {
      to: `/server-logs`,
      label: `服务端日志`,
      icon: vC.serverLogs,
      group: `日志`,
    },
    { to: `/logs`, label: `操作日志`, icon: vC.logs, group: `日志` },
  ];
function bC({ open: e, onClose: t }) {
  let n = Array.from(new Set(yC.map((e) => e.group ?? ``))).filter(Boolean);
  return (0, X.jsxs)(X.Fragment, {
    children: [
      e &&
        (0, X.jsx)(`div`, {
          className: `fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden`,
          onClick: t,
        }),
      (0, X.jsxs)(`aside`, {
        className: `
          fixed lg:relative inset-y-0 left-0 z-50
          w-60 shrink-0
          bg-[rgba(15,20,25,0.72)] backdrop-blur-[20px] backdrop-saturate-150
          border-r border-[var(--glass-border)]
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${e ? `translate-x-0` : `-translate-x-full lg:translate-x-0`}
        `,
        children: [
          (0, X.jsxs)(`div`, {
            className: `h-16 flex items-center gap-3 px-5 border-b border-[var(--glass-border)]`,
            children: [
              (0, X.jsx)(`div`, {
                className: `w-9 h-9 rounded-lg bg-gradient-to-br from-[#5a7dff] to-[#ec4899] flex items-center justify-center shadow-[var(--shadow-glow-primary)]`,
                children: (0, X.jsx)(`span`, {
                  className: `text-white font-bold text-sm`,
                  children: `Q`,
                }),
              }),
              (0, X.jsxs)(`div`, {
                className: `flex flex-col leading-tight`,
                children: [
                  (0, X.jsx)(`span`, {
                    className: `text-sm font-semibold text-[var(--color-text-primary)] tracking-tight`,
                    children: `QQBot Fire`,
                  }),
                  (0, X.jsx)(`span`, {
                    className: `text-[10px] text-[var(--color-text-muted)]`,
                    children: `Control Console`,
                  }),
                ],
              }),
            ],
          }),
          (0, X.jsx)(`nav`, {
            className: `flex-1 overflow-y-auto px-3 py-4 space-y-5`,
            children: n.map((e) =>
              (0, X.jsxs)(
                `div`,
                {
                  children: [
                    (0, X.jsx)(`h4`, {
                      className: `px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]`,
                      children: e,
                    }),
                    (0, X.jsx)(`ul`, {
                      className: `space-y-0.5`,
                      children: yC
                        .filter((t) => t.group === e)
                        .map((e) =>
                          (0, X.jsx)(
                            `li`,
                            {
                              children: (0, X.jsxs)(R, {
                                to: e.to,
                                onClick: t,
                                className: ({ isActive: e }) => `
                        group flex items-center gap-3 px-3 h-9 rounded-md
                        text-sm transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                        ${e ? `bg-gradient-to-r from-[rgba(90,125,255,0.18)] to-[rgba(236,72,153,0.08)] text-white border-l-2 border-[var(--color-primary-500)]` : `text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--color-text-primary)]`}
                      `,
                                children: [
                                  (0, X.jsx)(`span`, {
                                    className: `shrink-0`,
                                    children: e.icon,
                                  }),
                                  (0, X.jsx)(`span`, {
                                    className: `truncate`,
                                    children: e.label,
                                  }),
                                ],
                              }),
                            },
                            e.to,
                          ),
                        ),
                    }),
                  ],
                },
                e,
              ),
            ),
          }),
          (0, X.jsx)(`div`, {
            className: `p-3 border-t border-[var(--glass-border)]`,
            children: (0, X.jsxs)(`div`, {
              className: `flex items-center gap-2 px-2 h-8 text-[11px] text-[var(--color-text-muted)]`,
              children: [
                (0, X.jsx)(`span`, {
                  className: `w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse`,
                }),
                (0, X.jsx)(`span`, { children: `系统运行中` }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
var xC = {
    default: `bg-[rgba(255,255,255,0.08)] text-[var(--color-text-secondary)] border-[var(--glass-border)]`,
    primary: `bg-[rgba(90,125,255,0.15)] text-[#a2bdff] border-[rgba(90,125,255,0.3)]`,
    accent: `bg-[rgba(236,72,153,0.15)] text-[#f8b4dd] border-[rgba(236,72,153,0.3)]`,
    success: `bg-[rgba(16,185,129,0.15)] text-[#6ee7b7] border-[rgba(16,185,129,0.3)]`,
    warning: `bg-[rgba(245,158,11,0.15)] text-[#fcd34d] border-[rgba(245,158,11,0.3)]`,
    error: `bg-[rgba(239,68,68,0.15)] text-[#fca5a5] border-[rgba(239,68,68,0.3)]`,
    info: `bg-[rgba(59,130,246,0.15)] text-[#93c5fd] border-[rgba(59,130,246,0.3)]`,
  },
  SC = {
    default: `bg-[var(--color-neutral-400)]`,
    primary: `bg-[var(--color-primary-500)]`,
    accent: `bg-[var(--color-accent-500)]`,
    success: `bg-[var(--color-success)]`,
    warning: `bg-[var(--color-warning)]`,
    error: `bg-[var(--color-error)]`,
    info: `bg-[var(--color-info)]`,
  },
  CC = { sm: `h-5 px-2 text-[10px] gap-1`, md: `h-6 px-2.5 text-xs gap-1.5` };
function wC({
  variant: e = `default`,
  size: t = `sm`,
  dot: n = !1,
  pulse: r = !1,
  className: i = ``,
  children: a,
  ...o
}) {
  return (0, X.jsxs)(`span`, {
    className: `
        inline-flex items-center justify-center
        font-medium rounded-full border
        ${xC[e]}
        ${CC[t]}
        ${i}
      `,
    ...o,
    children: [
      n &&
        (0, X.jsxs)(`span`, {
          className: `relative flex items-center justify-center`,
          children: [
            r &&
              (0, X.jsx)(`span`, {
                className: `absolute inline-flex h-2 w-2 rounded-full opacity-60 animate-ping ${SC[e]}`,
              }),
            (0, X.jsx)(`span`, {
              className: `relative inline-flex h-1.5 w-1.5 rounded-full ${SC[e]}`,
            }),
          ],
        }),
      a,
    ],
  });
}
var TC = {
  "/dashboard": { title: `仪表盘`, desc: `系统概览与实时状态` },
  "/bots": { title: `Bot 实例`, desc: `管理多个 Bot 连接与配置` },
  "/messages": { title: `消息`, desc: `收发消息与事件追踪` },
  "/contacts": { title: `联系人`, desc: `好友与群组管理` },
  "/schedules": { title: `定时任务`, desc: `NTP 同步的定时消息调度` },
  "/napcat": { title: `NapCat`, desc: `NapCat 进程与配置管理` },
  "/console": { title: `控制台`, desc: `交互式命令行` },
  "/logs": { title: `日志`, desc: `服务端与 NapCat 日志查看` },
};
function EC({ onMenuToggle: e }) {
  let t = TC[er().pathname] ?? { title: ``, desc: `` };
  return (0, X.jsxs)(`header`, {
    className: `h-16 shrink-0 flex items-center justify-between px-5 lg:px-7 border-b border-[var(--glass-border)] bg-[rgba(15,20,25,0.6)] backdrop-blur-[16px]`,
    children: [
      (0, X.jsxs)(`div`, {
        className: `flex items-center gap-3 min-w-0`,
        children: [
          (0, X.jsx)(`button`, {
            onClick: e,
            className: `lg:hidden w-9 h-9 rounded-md hover:bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[var(--color-text-secondary)]`,
            "aria-label": `切换侧边栏`,
            children: (0, X.jsxs)(`svg`, {
              width: `18`,
              height: `18`,
              viewBox: `0 0 24 24`,
              fill: `none`,
              stroke: `currentColor`,
              strokeWidth: `2`,
              strokeLinecap: `round`,
              children: [
                (0, X.jsx)(`line`, { x1: `3`, y1: `6`, x2: `21`, y2: `6` }),
                (0, X.jsx)(`line`, { x1: `3`, y1: `12`, x2: `21`, y2: `12` }),
                (0, X.jsx)(`line`, { x1: `3`, y1: `18`, x2: `21`, y2: `18` }),
              ],
            }),
          }),
          (0, X.jsxs)(`div`, {
            className: `min-w-0`,
            children: [
              (0, X.jsx)(`h1`, {
                className: `text-base font-semibold text-[var(--color-text-primary)] tracking-tight truncate`,
                children: t.title,
              }),
              (0, X.jsx)(`p`, {
                className: `text-xs text-[var(--color-text-muted)] truncate`,
                children: t.desc,
              }),
            ],
          }),
        ],
      }),
      (0, X.jsx)(`div`, {
        className: `flex items-center gap-3`,
        children: (0, X.jsx)(wC, {
          variant: `success`,
          dot: !0,
          pulse: !0,
          size: `sm`,
          children: `在线`,
        }),
      }),
    ],
  });
}
function DC() {
  let [e, t] = (0, w.useState)(!1);
  return (0, X.jsxs)(`div`, {
    className: `relative flex h-screen overflow-hidden`,
    children: [
      (0, X.jsxs)(`div`, {
        className: `pointer-events-none fixed inset-0 overflow-hidden`,
        "aria-hidden": `true`,
        children: [
          (0, X.jsx)(`div`, {
            className: `absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-[120px]`,
            style: {
              background: `radial-gradient(circle, #5a7dff 0%, transparent 70%)`,
            },
          }),
          (0, X.jsx)(`div`, {
            className: `absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-[0.12] blur-[120px]`,
            style: {
              background: `radial-gradient(circle, #ec4899 0%, transparent 70%)`,
            },
          }),
        ],
      }),
      (0, X.jsx)(bC, { open: e, onClose: () => t(!1) }),
      (0, X.jsxs)(`div`, {
        className: `relative z-10 flex flex-1 flex-col overflow-hidden`,
        children: [
          (0, X.jsx)(EC, { onMenuToggle: () => t(!0) }),
          (0, X.jsx)(`main`, {
            className: `flex-1 overflow-y-auto`,
            children: (0, X.jsx)(Vr, {}),
          }),
        ],
      }),
    ],
  });
}
function OC(e, t) {
  let n = (0, w.useRef)(e);
  ((0, w.useEffect)(() => {
    n.current = e;
  }, [e]),
    (0, w.useEffect)(() => {
      if (t === null) return;
      let e = setInterval(() => n.current(), t);
      return () => clearInterval(e);
    }, [t]));
}
var kC = (e) => {
    let t,
      n = new Set(),
      r = (e, r) => {
        let i = typeof e == `function` ? e(t) : e;
        if (!Object.is(i, t)) {
          let e = t;
          ((t =
            (r ?? (typeof i != `object` || !i)) ? i : Object.assign({}, t, i)),
            n.forEach((n) => n(t, e)));
        }
      },
      i = () => t,
      a = {
        setState: r,
        getState: i,
        getInitialState: () => o,
        subscribe: (e) => (n.add(e), () => n.delete(e)),
      },
      o = (t = e(r, i, a));
    return a;
  },
  AC = (e) => (e ? kC(e) : kC),
  jC = (e) => e;
function MC(e, t = jC) {
  let n = w.useSyncExternalStore(
    e.subscribe,
    w.useCallback(() => t(e.getState()), [e, t]),
    w.useCallback(() => t(e.getInitialState()), [e, t]),
  );
  return (w.useDebugValue(n), n);
}
var NC = (e) => {
    let t = AC(e),
      n = (e) => MC(t, e);
    return (Object.assign(n, t), n);
  },
  PC = ((e) => (e ? NC(e) : NC))((e) => ({
    cachedBots: [],
    activeBotName: null,
    setCachedBots: (t, n) => e({ cachedBots: t, activeBotName: n }),
    operationLogs: [],
    appendLog: (t) =>
      e((e) => ({
        operationLogs: [
          ...e.operationLogs,
          `[${new Date().toLocaleTimeString()}] ${t}`,
        ].slice(-500),
      })),
    clearLogs: () => e({ operationLogs: [] }),
  }));
async function Q(e, t, n) {
  try {
    let r = { method: e, headers: { "Content-Type": `application/json` } };
    n && (r.body = JSON.stringify(n));
    let i = await (await fetch(t, r)).json();
    return i.ok
      ? i.data
      : (uf.danger(`请求失败`, { description: i.error || `未知错误` }), null);
  } catch (e) {
    let t = e instanceof Error ? e.message : `未知错误`;
    return (uf.danger(`网络错误`, { description: t }), null);
  }
}
var FC = encodeURIComponent,
  IC = () => Q(`GET`, `/api/bots`),
  LC = (e) => Q(`POST`, `/api/bots`, { name: e }),
  RC = (e) => Q(`DELETE`, `/api/bots/${FC(e)}`),
  zC = (e) => Q(`GET`, `/api/bots/${FC(e)}/config`),
  BC = (e, t) => Q(`PUT`, `/api/bots/${FC(e)}/config`, t),
  VC = (e) => Q(`POST`, `/api/bots/${FC(e)}/connect`),
  HC = (e) => Q(`POST`, `/api/bots/${FC(e)}/disconnect`),
  UC = () => Q(`POST`, `/api/connect-all`),
  WC = () => Q(`POST`, `/api/disconnect-all`),
  GC = (e) => Q(`GET`, `/api/bots/${FC(e)}/friends`),
  KC = (e) => Q(`GET`, `/api/bots/${FC(e)}/groups`),
  qC = (e, t) => Q(`GET`, `/api/bots/${FC(e)}/groups/${t}/members`),
  JC = (e, t, n, r) =>
    Q(`POST`, `/api/bots/${FC(e)}/send`, { type: t, target: n, message: r }),
  YC = (e) => Q(`GET`, `/api/bots/${FC(e)}/schedules`),
  XC = (e, t) => Q(`POST`, `/api/bots/${FC(e)}/schedules`, t),
  ZC = (e, t) => Q(`DELETE`, `/api/bots/${FC(e)}/schedules/${FC(t)}`),
  QC = (e, t, n) =>
    Q(`PUT`, `/api/bots/${FC(e)}/schedules/${FC(t)}/toggle`, { enabled: n }),
  $C = (e, t) => Q(`POST`, `/api/bots/${FC(e)}/schedules/${FC(t)}/test`),
  ew = (e, t, n) => Q(`PUT`, `/api/bots/${FC(e)}/schedules/${FC(t)}`, n),
  tw = () => Q(`GET`, `/api/napcat/config`),
  nw = (e) => Q(`PUT`, `/api/napcat/config`, e),
  rw = (e, t, n) =>
    Q(`POST`, `/api/napcat/start`, {
      name: e,
      ...(t ? { qq: t } : {}),
      ...(n ? { webuiPort: n } : {}),
    }),
  iw = (e) => Q(`POST`, `/api/napcat/stop`, { name: e }),
  aw = () => Q(`GET`, `/api/napcat/instances`),
  ow = (e) => Q(`GET`, `/api/napcat/instances/${FC(e)}/log`),
  sw = () => Q(`POST`, `/api/napcat/discover`),
  cw = (e) => Q(`POST`, `/api/napcat/forget`, { name: e }),
  lw = (e, t, n) =>
    Q(`PUT`, `/api/napcat/saved`, { name: e, qqUin: t, webuiPort: n }),
  uw = (e) => Q(`POST`, `/api/console/exec`, { command: e }),
  dw = () => Q(`GET`, `/api/logs/list`),
  fw = (e, t) => Q(`GET`, `/api/logs/read?file=${FC(e)}&lines=${t}`);
function pw({ children: e, className: t = `` }) {
  return (0, X.jsx)(`div`, {
    className: `mx-auto max-w-7xl p-6 lg:p-8 ${t}`,
    children: e,
  });
}
function mw({ title: e, description: t, actions: n }) {
  return (0, X.jsxs)(`div`, {
    className: `mb-8 flex items-start justify-between gap-4`,
    children: [
      (0, X.jsxs)(`div`, {
        className: `min-w-0 flex-1`,
        children: [
          (0, X.jsx)(`h1`, {
            className: `text-2xl font-semibold tracking-tight text-white`,
            children: e,
          }),
          t &&
            (0, X.jsx)(`p`, {
              className: `mt-1.5 text-sm text-neutral-400`,
              children: t,
            }),
        ],
      }),
      n &&
        (0, X.jsx)(`div`, {
          className: `flex flex-shrink-0 items-center gap-2`,
          children: n,
        }),
    ],
  });
}
var hw = {
    primary: `bg-gradient-to-b from-[#6a8dff] to-[#4a6de8] text-white border border-[rgba(255,255,255,0.12)] hover:from-[#7a9dff] hover:to-[#5a7dff] active:from-[#4a6de8] active:to-[#3a5dd1] shadow-[0_4px_12px_-2px_rgba(90,125,255,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]`,
    secondary: `bg-[rgba(255,255,255,0.06)] text-[var(--color-text-primary)] border border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.1)] hover:border-[var(--glass-border-hover)] backdrop-blur-md`,
    ghost: `bg-transparent text-[var(--color-text-secondary)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--color-text-primary)]`,
    danger: `bg-gradient-to-b from-[#f87171] to-[#dc2626] text-white border border-[rgba(255,255,255,0.12)] hover:from-[#fca5a5] hover:to-[#ef4444] shadow-[0_4px_12px_-2px_rgba(239,68,68,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]`,
    success: `bg-gradient-to-b from-[#34d399] to-[#059669] text-white border border-[rgba(255,255,255,0.12)] hover:from-[#6ee7b7] hover:to-[#10b981] shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.15)]`,
  },
  gw = {
    sm: `h-8 px-3 text-xs rounded-md gap-1.5`,
    md: `h-10 px-4 text-sm rounded-lg gap-2`,
    lg: `h-12 px-6 text-base rounded-lg gap-2.5`,
  },
  $ = (0, w.forwardRef)(function (
    {
      variant: e = `primary`,
      size: t = `md`,
      loading: n = !1,
      leftIcon: r,
      rightIcon: i,
      fullWidth: a = !1,
      disabled: o,
      children: s,
      className: c = ``,
      ...l
    },
    u,
  ) {
    return (0, X.jsxs)(`button`, {
      ref: u,
      disabled: o || n,
      className: `
        inline-flex items-center justify-center
        font-medium whitespace-nowrap select-none
        transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${hw[e]}
        ${gw[t]}
        ${a ? `w-full` : ``}
        ${c}
      `,
      ...l,
      children: [
        n &&
          (0, X.jsxs)(`svg`, {
            className: `animate-spin h-4 w-4`,
            viewBox: `0 0 24 24`,
            fill: `none`,
            children: [
              (0, X.jsx)(`circle`, {
                cx: `12`,
                cy: `12`,
                r: `10`,
                stroke: `currentColor`,
                strokeWidth: `3`,
                strokeOpacity: `0.25`,
              }),
              (0, X.jsx)(`path`, {
                d: `M12 2a10 10 0 0 1 10 10`,
                stroke: `currentColor`,
                strokeWidth: `3`,
                strokeLinecap: `round`,
              }),
            ],
          }),
        !n && r,
        s,
        !n && i,
      ],
    });
  }),
  _w = {
    glass: `bg-[var(--glass-medium)] backdrop-blur-[var(--glass-blur)] backdrop-saturate-150 border border-[var(--glass-border)] shadow-[var(--shadow-md),var(--shadow-glass-highlight)]`,
    solid: `bg-[var(--color-bg-elevated)] border border-[var(--glass-border)] shadow-[var(--shadow-base)]`,
    outline: `bg-transparent border border-[var(--glass-border)]`,
  },
  vw = { none: ``, sm: `p-3`, md: `p-5`, lg: `p-7` },
  yw = (0, w.forwardRef)(function (
    {
      variant: e = `glass`,
      interactive: t = !1,
      padding: n = `md`,
      className: r = ``,
      children: i,
      ...a
    },
    o,
  ) {
    return (0, X.jsx)(`div`, {
      ref: o,
      className: `
        rounded-xl
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${_w[e]}
        ${vw[n]}
        ${t ? `hover:border-[var(--glass-border-hover)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg),var(--shadow-glass-highlight)] cursor-pointer` : ``}
        ${r}
      `,
      ...a,
      children: i,
    });
  }),
  bw = (0, w.forwardRef)(function (
    {
      label: e,
      hint: t,
      error: n,
      leftIcon: r,
      rightIcon: i,
      fullWidth: a = !0,
      className: o = ``,
      id: s,
      ...c
    },
    l,
  ) {
    let u = s || `input-${Math.random().toString(36).slice(2, 9)}`,
      d = !!n;
    return (0, X.jsxs)(`div`, {
      className: a ? `w-full` : ``,
      children: [
        e &&
          (0, X.jsx)(`label`, {
            htmlFor: u,
            className: `block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5`,
            children: e,
          }),
        (0, X.jsxs)(`div`, {
          className: `relative`,
          children: [
            r &&
              (0, X.jsx)(`span`, {
                className: `absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none`,
                children: r,
              }),
            (0, X.jsx)(`input`, {
              ref: l,
              id: u,
              className: `
            w-full h-10 rounded-lg
            bg-[rgba(0,0,0,0.25)] backdrop-blur-sm
            border transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            text-sm text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${r ? `pl-10` : `pl-3.5`}
            ${i ? `pr-10` : `pr-3.5`}
            ${d ? `border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]` : `border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] focus:border-[var(--color-primary-500)] focus:shadow-[0_0_0_3px_rgba(90,125,255,0.15)]`}
            ${o}
          `,
              ...c,
            }),
            i &&
              (0, X.jsx)(`span`, {
                className: `absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]`,
                children: i,
              }),
          ],
        }),
        (t || n) &&
          (0, X.jsx)(`p`, {
            className: `mt-1.5 text-xs ${d ? `text-[var(--color-error)]` : `text-[var(--color-text-muted)]`}`,
            children: n || t,
          }),
      ],
    });
  }),
  xw = {
    sm: `h-4 w-4 border-2`,
    md: `h-6 w-6 border-2`,
    lg: `h-10 w-10 border-[3px]`,
  };
function Sw({ size: e = `md`, className: t = `` }) {
  return (0, X.jsx)(`div`, {
    role: `status`,
    "aria-label": `加载中`,
    className: `inline-block animate-spin rounded-full border-white/15 border-t-[#5a7dff] ${xw[e]} ${t}`,
  });
}
var Cw = (0, w.forwardRef)(function (
    {
      label: e,
      hint: t,
      error: n,
      options: r,
      fullWidth: i,
      className: a = ``,
      id: o,
      ...s
    },
    c,
  ) {
    let l = o ?? `sel-${Math.random().toString(36).slice(2, 8)}`;
    return (0, X.jsxs)(`div`, {
      className: i ? `w-full` : ``,
      children: [
        e &&
          (0, X.jsx)(`label`, {
            htmlFor: l,
            className: `mb-1.5 block text-xs font-medium text-neutral-300`,
            children: e,
          }),
        (0, X.jsxs)(`div`, {
          className: `relative`,
          children: [
            (0, X.jsx)(`select`, {
              ref: c,
              id: l,
              className: `h-10 w-full appearance-none rounded-lg border bg-[rgba(0,0,0,0.25)] px-3 pr-9 text-sm text-white backdrop-blur-sm transition outline-none ${n ? `border-[#ef4444] focus:ring-2 focus:ring-[rgba(239,68,68,0.25)]` : `border-white/10 focus:border-[#5a7dff] focus:ring-[3px] focus:ring-[rgba(90,125,255,0.25)]`} ${a}`,
              ...s,
              children: r.map((e) =>
                (0, X.jsx)(
                  `option`,
                  {
                    value: e.value,
                    disabled: e.disabled,
                    className: `bg-[#1a1f2e] text-white`,
                    children: e.label,
                  },
                  e.value,
                ),
              ),
            }),
            (0, X.jsx)(`svg`, {
              className: `pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400`,
              width: `14`,
              height: `14`,
              viewBox: `0 0 24 24`,
              fill: `none`,
              stroke: `currentColor`,
              strokeWidth: `2`,
              strokeLinecap: `round`,
              strokeLinejoin: `round`,
              children: (0, X.jsx)(`polyline`, { points: `6 9 12 15 18 9` }),
            }),
          ],
        }),
        n
          ? (0, X.jsx)(`p`, {
              className: `mt-1 text-xs text-[#fca5a5]`,
              children: n,
            })
          : t
            ? (0, X.jsx)(`p`, {
                className: `mt-1 text-xs text-neutral-500`,
                children: t,
              })
            : null,
      ],
    });
  }),
  ww = { sm: `max-w-md`, md: `max-w-lg`, lg: `max-w-2xl` },
  Tw = [0.25, 0.1, 0.25, 1];
function Ew({
  open: e,
  onClose: t,
  title: n,
  description: r,
  children: i,
  footer: a,
  size: o = `md`,
  closeOnBackdrop: s = !0,
}) {
  return (
    (0, w.useEffect)(() => {
      if (!e) return;
      let n = (e) => {
        e.key === `Escape` && t();
      };
      window.addEventListener(`keydown`, n);
      let r = document.body.style.overflow;
      return (
        (document.body.style.overflow = `hidden`),
        () => {
          (window.removeEventListener(`keydown`, n),
            (document.body.style.overflow = r));
        }
      );
    }, [e, t]),
    (0, X.jsx)(bx, {
      children:
        e &&
        (0, X.jsxs)(gC.div, {
          className: `fixed inset-0 z-[1400] flex items-center justify-center p-4`,
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.18, ease: Tw },
          children: [
            (0, X.jsx)(`div`, {
              className: `absolute inset-0 bg-black/60 backdrop-blur-sm`,
              onClick: () => {
                s && t();
              },
              "aria-hidden": `true`,
            }),
            (0, X.jsxs)(gC.div, {
              role: `dialog`,
              "aria-modal": `true`,
              "aria-label": n,
              className: `relative w-full ${ww[o]} overflow-hidden rounded-xl border border-white/10 bg-[rgba(26,31,46,0.88)] backdrop-blur-[20px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]`,
              initial: { opacity: 0, scale: 0.96, y: 8 },
              animate: { opacity: 1, scale: 1, y: 0 },
              exit: { opacity: 0, scale: 0.97, y: 4 },
              transition: { duration: 0.22, ease: Tw },
              children: [
                (n || r) &&
                  (0, X.jsxs)(`div`, {
                    className: `border-b border-white/5 px-6 pt-5 pb-4`,
                    children: [
                      n &&
                        (0, X.jsx)(`h3`, {
                          className: `text-base font-semibold text-white`,
                          children: n,
                        }),
                      r &&
                        (0, X.jsx)(`p`, {
                          className: `mt-1 text-sm text-neutral-400`,
                          children: r,
                        }),
                    ],
                  }),
                (0, X.jsx)(`div`, { className: `px-6 py-5`, children: i }),
                a &&
                  (0, X.jsx)(`div`, {
                    className: `flex items-center justify-end gap-2 border-t border-white/5 bg-white/[0.02] px-6 py-4`,
                    children: a,
                  }),
                (0, X.jsx)(`button`, {
                  type: `button`,
                  onClick: t,
                  "aria-label": `关闭`,
                  className: `absolute right-4 top-4 rounded-md p-1.5 text-neutral-400 transition hover:bg-white/5 hover:text-white`,
                  children: (0, X.jsxs)(`svg`, {
                    width: `16`,
                    height: `16`,
                    viewBox: `0 0 24 24`,
                    fill: `none`,
                    stroke: `currentColor`,
                    strokeWidth: `2`,
                    strokeLinecap: `round`,
                    strokeLinejoin: `round`,
                    children: [
                      (0, X.jsx)(`line`, {
                        x1: `18`,
                        y1: `6`,
                        x2: `6`,
                        y2: `18`,
                      }),
                      (0, X.jsx)(`line`, {
                        x1: `6`,
                        y1: `6`,
                        x2: `18`,
                        y2: `18`,
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
    })
  );
}
function Dw() {
  let e = rr(),
    { cachedBots: t, setCachedBots: n, appendLog: r } = PC(),
    [i, a] = (0, w.useState)(!0),
    [o, s] = (0, w.useState)(null),
    c = (0, w.useCallback)(async () => {
      let e = await IC();
      (e && n(e.bots || [], e.activeBot), a(!1));
    }, [n]);
  ((0, w.useEffect)(() => {
    c();
  }, [c]),
    OC(c, 5e3));
  let l = async (e, t) => {
      (s(e),
        (t ? await VC(e) : await HC(e)) !== null &&
          (r(`${e} ${t ? `连接成功` : `已断开`}`), c()),
        s(null));
    },
    u = async () => {
      (s(`__all__`), (await UC()) !== null && c(), s(null));
    },
    d = async () => {
      (s(`__all__`), (await WC()) !== null && c(), s(null));
    },
    f = t.length,
    p = t.filter((e) => e.connected).length,
    m = f - p;
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `仪表盘`,
        description: `Bot 实例概览与连接状态`,
        actions: (0, X.jsxs)(X.Fragment, {
          children: [
            (0, X.jsx)($, {
              size: `sm`,
              variant: `secondary`,
              onClick: u,
              loading: o === `__all__`,
              children: `全部连接`,
            }),
            (0, X.jsx)($, {
              size: `sm`,
              variant: `ghost`,
              onClick: d,
              loading: o === `__all__`,
              children: `全部断开`,
            }),
          ],
        }),
      }),
      (0, X.jsxs)(`div`, {
        className: `grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6`,
        children: [
          (0, X.jsx)(Ow, { label: `Bot 总数`, value: f, tone: `primary` }),
          (0, X.jsx)(Ow, { label: `在线`, value: p, tone: `success` }),
          (0, X.jsx)(Ow, { label: `离线`, value: m, tone: `neutral` }),
        ],
      }),
      i
        ? (0, X.jsx)(`div`, {
            className: `flex items-center justify-center py-20`,
            children: (0, X.jsx)(Sw, { size: `lg` }),
          })
        : t.length === 0
          ? (0, X.jsx)(yw, {
              variant: `glass`,
              padding: `lg`,
              children: (0, X.jsxs)(`div`, {
                className: `text-center py-12`,
                children: [
                  (0, X.jsx)(`p`, {
                    className: `text-sm text-[var(--color-text-secondary)]`,
                    children: `暂无 Bot 实例`,
                  }),
                  (0, X.jsx)($, {
                    size: `sm`,
                    variant: `primary`,
                    className: `mt-4`,
                    onClick: () => e(`/bots`),
                    children: `前往添加`,
                  }),
                ],
              }),
            })
          : (0, X.jsx)(gC.div, {
              initial: `hidden`,
              animate: `visible`,
              variants: {
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              },
              className: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`,
              children: t.map((t) =>
                (0, X.jsx)(
                  gC.div,
                  {
                    variants: {
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    },
                    children: (0, X.jsxs)(yw, {
                      variant: `glass`,
                      padding: `md`,
                      interactive: !0,
                      className: `h-full flex flex-col gap-3`,
                      children: [
                        (0, X.jsxs)(`div`, {
                          className: `flex items-center justify-between gap-2`,
                          children: [
                            (0, X.jsx)(`span`, {
                              className: `font-semibold text-sm text-[var(--color-text-primary)] truncate`,
                              children: t.name,
                            }),
                            (0, X.jsx)(wC, {
                              variant: t.mode === `ws` ? `primary` : `warning`,
                              size: `sm`,
                              children: t.mode.toUpperCase(),
                            }),
                          ],
                        }),
                        (0, X.jsxs)(`div`, {
                          className: `space-y-1.5 text-xs text-[var(--color-text-secondary)]`,
                          children: [
                            (0, X.jsx)(`div`, {
                              className: `flex items-center gap-2`,
                              children: (0, X.jsx)(wC, {
                                variant: t.connected ? `success` : `default`,
                                size: `sm`,
                                dot: !0,
                                pulse: t.connected,
                                children: t.connected ? `已连接` : `未连接`,
                              }),
                            }),
                            t.connected
                              ? (0, X.jsxs)(X.Fragment, {
                                  children: [
                                    (0, X.jsxs)(`div`, {
                                      children: [
                                        `QQ:`,
                                        ` `,
                                        (0, X.jsx)(`span`, {
                                          className: `text-[var(--color-text-primary)]`,
                                          children: t.userId ?? `-`,
                                        }),
                                      ],
                                    }),
                                    (0, X.jsxs)(`div`, {
                                      className: `truncate`,
                                      children: [
                                        `昵称:`,
                                        ` `,
                                        (0, X.jsx)(`span`, {
                                          className: `text-[var(--color-text-primary)]`,
                                          children: t.nickname || `-`,
                                        }),
                                      ],
                                    }),
                                  ],
                                })
                              : (0, X.jsx)(`div`, {
                                  className: `truncate text-[var(--color-text-muted)]`,
                                  children:
                                    t.mode === `ws` ? t.wsUrl : t.httpUrl,
                                }),
                          ],
                        }),
                        (0, X.jsxs)(`div`, {
                          className: `flex gap-2 mt-auto pt-1`,
                          children: [
                            t.connected
                              ? (0, X.jsx)($, {
                                  size: `sm`,
                                  variant: `ghost`,
                                  onClick: () => l(t.name, !1),
                                  loading: o === t.name,
                                  children: `断开`,
                                })
                              : (0, X.jsx)($, {
                                  size: `sm`,
                                  variant: `primary`,
                                  onClick: () => l(t.name, !0),
                                  loading: o === t.name,
                                  children: `连接`,
                                }),
                            (0, X.jsx)($, {
                              size: `sm`,
                              variant: `ghost`,
                              onClick: () => e(`/bots`),
                              children: `管理`,
                            }),
                          ],
                        }),
                      ],
                    }),
                  },
                  t.name,
                ),
              ),
            }),
    ],
  });
}
function Ow({ label: e, value: t, tone: n }) {
  return (0, X.jsxs)(yw, {
    variant: `glass`,
    padding: `md`,
    children: [
      (0, X.jsx)(`div`, {
        className: `text-xs text-[var(--color-text-muted)] uppercase tracking-wider`,
        children: e,
      }),
      (0, X.jsx)(`div`, {
        className: `mt-2 text-3xl font-semibold tracking-tight ${{ primary: `text-[#a2bdff]`, success: `text-[#6ee7b7]`, neutral: `text-[var(--color-text-secondary)]` }[n]}`,
        children: t,
      }),
    ],
  });
}
function kw() {
  let {
      cachedBots: e,
      activeBotName: t,
      setCachedBots: n,
      appendLog: r,
    } = PC(),
    [i, a] = (0, w.useState)(!0),
    [o, s] = (0, w.useState)(``),
    [c, l] = (0, w.useState)(null),
    [u, d] = (0, w.useState)(null),
    [f, p] = (0, w.useState)(null),
    [m, h] = (0, w.useState)(!1),
    g = (0, w.useCallback)(async () => {
      let e = await IC();
      (e && n(e.bots || [], e.activeBot), a(!1));
    }, [n]);
  (0, w.useEffect)(() => {
    g();
  }, [g]);
  let _ = async () => {
      let e = o.trim();
      e && (await LC(e)) !== null && (s(``), r(`添加 Bot: ${e}`), g());
    },
    v = async () => {
      c && (await RC(c)) !== null && (r(`删除 Bot: ${c}`), l(null), g());
    },
    y = async (e, t) => {
      (t ? await VC(e) : await HC(e)) !== null &&
        (r(`${e} ${t ? `连接成功` : `已断开`}`), g());
    },
    b = async (e) => {
      let t = await zC(e);
      t && (p({ ...t }), d(e));
    },
    x = async () => {
      if (!u || !f) return;
      h(!0);
      let e = await BC(u, {
        mode: f.mode,
        wsUrl: f.wsUrl,
        httpUrl: f.httpUrl,
        wsToken: f.wsToken,
        httpToken: f.httpToken,
      });
      (h(!1), e !== null && (r(`更新配置: ${u}`), d(null), g()));
    },
    S = (e) => {
      f && p({ ...f, ...e });
    };
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `Bot 实例`,
        description: `管理多个 Bot 连接与配置`,
        actions: (0, X.jsxs)(`div`, {
          className: `flex items-center gap-2`,
          children: [
            (0, X.jsx)(bw, {
              placeholder: `新 Bot 名称`,
              value: o,
              onChange: (e) => s(e.target.value),
              onKeyDown: (e) => e.key === `Enter` && _(),
              className: `w-48`,
              fullWidth: !1,
            }),
            (0, X.jsx)($, {
              size: `sm`,
              variant: `primary`,
              onClick: _,
              children: `添加`,
            }),
          ],
        }),
      }),
      i
        ? (0, X.jsx)(`div`, {
            className: `flex items-center justify-center py-20`,
            children: (0, X.jsx)(Sw, { size: `lg` }),
          })
        : e.length === 0
          ? (0, X.jsx)(yw, {
              variant: `glass`,
              padding: `lg`,
              children: (0, X.jsx)(`p`, {
                className: `text-center py-12 text-sm text-[var(--color-text-secondary)]`,
                children: `暂无 Bot，使用上方输入框添加`,
              }),
            })
          : (0, X.jsx)(gC.div, {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.3 },
              children: (0, X.jsx)(yw, {
                variant: `glass`,
                padding: `none`,
                className: `overflow-hidden`,
                children: (0, X.jsx)(`div`, {
                  className: `overflow-x-auto`,
                  children: (0, X.jsxs)(`table`, {
                    className: `w-full text-sm`,
                    children: [
                      (0, X.jsx)(`thead`, {
                        children: (0, X.jsxs)(`tr`, {
                          className: `text-xs uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--glass-border)]`,
                          children: [
                            (0, X.jsx)(`th`, {
                              className: `text-left px-5 py-3 font-medium`,
                              children: `名称`,
                            }),
                            (0, X.jsx)(`th`, {
                              className: `text-left px-5 py-3 font-medium`,
                              children: `模式`,
                            }),
                            (0, X.jsx)(`th`, {
                              className: `text-left px-5 py-3 font-medium`,
                              children: `地址`,
                            }),
                            (0, X.jsx)(`th`, {
                              className: `text-left px-5 py-3 font-medium`,
                              children: `状态`,
                            }),
                            (0, X.jsx)(`th`, {
                              className: `text-right px-5 py-3 font-medium`,
                              children: `操作`,
                            }),
                          ],
                        }),
                      }),
                      (0, X.jsx)(`tbody`, {
                        children: e.map((e) =>
                          (0, X.jsxs)(
                            `tr`,
                            {
                              className: `border-b border-[var(--glass-border)] last:border-0 hover:bg-white/[0.02] transition-colors`,
                              children: [
                                (0, X.jsx)(`td`, {
                                  className: `px-5 py-3`,
                                  children: (0, X.jsxs)(`div`, {
                                    className: `flex items-center gap-2`,
                                    children: [
                                      (0, X.jsx)(`span`, {
                                        className: `text-[var(--color-text-primary)] font-medium`,
                                        children: e.name,
                                      }),
                                      e.name === t &&
                                        (0, X.jsx)(wC, {
                                          variant: `success`,
                                          size: `sm`,
                                          children: `当前`,
                                        }),
                                    ],
                                  }),
                                }),
                                (0, X.jsx)(`td`, {
                                  className: `px-5 py-3`,
                                  children: (0, X.jsx)(wC, {
                                    variant:
                                      e.mode === `ws` ? `primary` : `warning`,
                                    size: `sm`,
                                    children: e.mode.toUpperCase(),
                                  }),
                                }),
                                (0, X.jsx)(`td`, {
                                  className: `px-5 py-3`,
                                  children: (0, X.jsx)(`span`, {
                                    className: `text-[var(--color-text-secondary)] truncate inline-block max-w-[260px] font-mono text-xs`,
                                    children:
                                      e.mode === `ws` ? e.wsUrl : e.httpUrl,
                                  }),
                                }),
                                (0, X.jsx)(`td`, {
                                  className: `px-5 py-3`,
                                  children: (0, X.jsx)(wC, {
                                    variant: e.connected
                                      ? `success`
                                      : `default`,
                                    size: `sm`,
                                    dot: !0,
                                    pulse: e.connected,
                                    children: e.connected ? `在线` : `离线`,
                                  }),
                                }),
                                (0, X.jsx)(`td`, {
                                  className: `px-5 py-3`,
                                  children: (0, X.jsxs)(`div`, {
                                    className: `flex items-center gap-1.5 justify-end flex-wrap`,
                                    children: [
                                      (0, X.jsx)($, {
                                        size: `sm`,
                                        variant: `secondary`,
                                        onClick: () => b(e.name),
                                        children: `配置`,
                                      }),
                                      e.connected
                                        ? (0, X.jsx)($, {
                                            size: `sm`,
                                            variant: `ghost`,
                                            onClick: () => y(e.name, !1),
                                            children: `断开`,
                                          })
                                        : (0, X.jsx)($, {
                                            size: `sm`,
                                            variant: `primary`,
                                            onClick: () => y(e.name, !0),
                                            children: `连接`,
                                          }),
                                      (0, X.jsx)($, {
                                        size: `sm`,
                                        variant: `danger`,
                                        onClick: () => l(e.name),
                                        children: `删除`,
                                      }),
                                    ],
                                  }),
                                }),
                              ],
                            },
                            e.name,
                          ),
                        ),
                      }),
                    ],
                  }),
                }),
              }),
            }),
      (0, X.jsx)(Ew, {
        open: c !== null,
        onClose: () => l(null),
        title: `确认删除`,
        description: `确定要删除 Bot "${c ?? ``}" 吗？此操作不可恢复。`,
        size: `sm`,
        footer: (0, X.jsxs)(X.Fragment, {
          children: [
            (0, X.jsx)($, {
              size: `sm`,
              variant: `ghost`,
              onClick: () => l(null),
              children: `取消`,
            }),
            (0, X.jsx)($, {
              size: `sm`,
              variant: `danger`,
              onClick: v,
              children: `删除`,
            }),
          ],
        }),
        children: (0, X.jsx)(`p`, {
          className: `text-sm text-[var(--color-text-secondary)]`,
          children: `相关配置和调度任务将一同移除。`,
        }),
      }),
      (0, X.jsx)(Ew, {
        open: u !== null,
        onClose: () => d(null),
        title: `配置 · ${u ?? ``}`,
        size: `lg`,
        footer: (0, X.jsxs)(X.Fragment, {
          children: [
            (0, X.jsx)($, {
              size: `sm`,
              variant: `ghost`,
              onClick: () => d(null),
              children: `取消`,
            }),
            (0, X.jsx)($, {
              size: `sm`,
              variant: `primary`,
              onClick: x,
              loading: m,
              children: `保存`,
            }),
          ],
        }),
        children:
          f &&
          (0, X.jsxs)(`div`, {
            className: `space-y-4`,
            children: [
              (0, X.jsx)(Cw, {
                label: `连接模式`,
                value: f.mode,
                onChange: (e) => S({ mode: e.target.value }),
                options: [
                  { value: `ws`, label: `WebSocket` },
                  { value: `http`, label: `HTTP` },
                ],
              }),
              (0, X.jsx)(bw, {
                label: `WebSocket 地址`,
                value: f.wsUrl || ``,
                onChange: (e) => S({ wsUrl: e.target.value }),
                placeholder: `ws://host:port`,
              }),
              (0, X.jsx)(bw, {
                label: `HTTP 地址`,
                value: f.httpUrl || ``,
                onChange: (e) => S({ httpUrl: e.target.value }),
                placeholder: `http://host:port`,
              }),
              (0, X.jsxs)(`div`, {
                className: `grid grid-cols-1 sm:grid-cols-2 gap-4`,
                children: [
                  (0, X.jsx)(bw, {
                    label: `WS Token`,
                    type: `password`,
                    value: f.wsToken || ``,
                    onChange: (e) => S({ wsToken: e.target.value }),
                  }),
                  (0, X.jsx)(bw, {
                    label: `HTTP Token`,
                    type: `password`,
                    value: f.httpToken || ``,
                    onChange: (e) => S({ httpToken: e.target.value }),
                  }),
                ],
              }),
            ],
          }),
      }),
    ],
  });
}
function Aw(e, t) {
  let [n, r] = (0, w.useState)(() => {
    try {
      let n = localStorage.getItem(e);
      return n ? JSON.parse(n) : t;
    } catch {
      return t;
    }
  });
  return [
    n,
    (0, w.useCallback)(
      (t) => {
        r((n) => {
          let r = t instanceof Function ? t(n) : t;
          try {
            localStorage.setItem(e, JSON.stringify(r));
          } catch {}
          return r;
        });
      },
      [e],
    ),
  ];
}
function jw({ storageKey: e, connectedOnly: t = !1, value: n, onChange: r }) {
  let i = PC((e) => e.cachedBots),
    [a, o] = Aw(e, ``),
    s = (0, w.useMemo)(() => (t ? i.filter((e) => e.connected) : i), [i, t]);
  (0, w.useEffect)(() => {
    !n && a && s.some((e) => e.name === a) && r(a);
  }, []);
  let c = (0, w.useMemo)(
    () => [
      { value: ``, label: `选择 Bot...` },
      ...s.map((e) => ({
        value: e.name,
        label: `${e.name}${e.connected ? ` (QQ:${e.userId || `?`})` : ` (未连接)`}`,
      })),
    ],
    [s],
  );
  return (0, X.jsx)(`div`, {
    className: `min-w-[180px]`,
    children: (0, X.jsx)(Cw, {
      options: c,
      value: n,
      onChange: (e) => {
        let t = e.target.value;
        (r(t), o(t));
      },
      fullWidth: !0,
    }),
  });
}
function Mw({
  storageKey: e,
  placeholder: t = `QQ 号`,
  value: n,
  onChange: r,
  className: i = ``,
}) {
  let [a, o] = Aw(`qqHistory_` + e, []),
    [s, c] = (0, w.useState)(!1),
    l = (0, w.useRef)(null);
  (0, w.useEffect)(() => {
    let e = (e) => {
      l.current && !l.current.contains(e.target) && c(!1);
    };
    return (
      document.addEventListener(`click`, e),
      () => document.removeEventListener(`click`, e)
    );
  }, []);
  let u = (e) => {
      ((e = e.trim()),
        !(!e || !/^\d+$/.test(e)) &&
          o((t) => [e, ...t.filter((t) => t !== e)].slice(0, 20)));
    },
    d = (e) => {
      o((t) => t.filter((t) => t !== e));
    };
  return (0, X.jsxs)(`div`, {
    ref: l,
    className: `relative ${i}`,
    children: [
      (0, X.jsxs)(`div`, {
        className: `flex`,
        children: [
          (0, X.jsx)(`input`, {
            type: `text`,
            value: n,
            onChange: (e) => r(e.target.value),
            onBlur: () => {
              n.trim() && /^\d+$/.test(n.trim()) && u(n);
            },
            placeholder: t,
            autoComplete: `off`,
            className: `flex-1 bg-input-bg border border-border-theme text-text-primary rounded-l-lg px-3 py-2 text-sm outline-none focus:border-accent transition-colors min-w-0`,
          }),
          (0, X.jsx)(`button`, {
            type: `button`,
            onClick: () => c(!s),
            className: `bg-content2 border border-border-theme border-l-0 rounded-r-lg px-2 text-text-muted hover:text-text-primary text-xs cursor-pointer transition-colors`,
            children: `▼`,
          }),
        ],
      }),
      s &&
        (0, X.jsx)(gC.div, {
          initial: { opacity: 0, y: -4, scaleY: 0.95 },
          animate: { opacity: 1, y: 0, scaleY: 1 },
          transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
          style: { transformOrigin: `top` },
          className: `absolute top-full left-0 right-0 bg-card-bg backdrop-blur-[var(--glass-blur)] border border-border-theme rounded-b-xl max-h-[200px] overflow-y-auto z-50 shadow-[var(--shadow-lg)]`,
          children:
            a.length === 0
              ? (0, X.jsx)(`div`, {
                  className: `px-3 py-2 text-center text-text-muted text-xs`,
                  children: `暂无历史记录`,
                })
              : a.map((e) =>
                  (0, X.jsxs)(
                    `div`,
                    {
                      className: `flex justify-between items-center px-3 py-2 hover:bg-white/10 cursor-pointer text-sm text-text-primary transition-colors`,
                      children: [
                        (0, X.jsx)(`span`, {
                          onClick: () => {
                            (r(e), c(!1));
                          },
                          children: e,
                        }),
                        (0, X.jsx)(`span`, {
                          onClick: (t) => {
                            (t.stopPropagation(), d(e));
                          },
                          className: `text-text-muted hover:text-accent text-xs px-1 cursor-pointer`,
                          style: { opacity: 1 },
                          children: `✕`,
                        }),
                      ],
                    },
                    e,
                  ),
                ),
        }),
    ],
  });
}
function Nw() {
  let { setCachedBots: e, appendLog: t } = PC(),
    [n, r] = (0, w.useState)(``),
    [i, a] = Aw(`msgType`, `group`),
    [o, s] = (0, w.useState)(``),
    [c, l] = (0, w.useState)(``),
    [u, d] = (0, w.useState)(!1);
  (0, w.useEffect)(() => {
    IC().then((t) => {
      t && e(t.bots || [], t.activeBot);
    });
  }, [e]);
  let f = async () => {
      if (!n) {
        t(`[错误] 请选择 Bot`);
        return;
      }
      let e = parseInt(o, 10);
      if (!Number.isFinite(e) || e <= 0) {
        t(`[错误] 请输入有效的目标号码`);
        return;
      }
      let r = c.trim();
      if (!r) {
        t(`[错误] 请输入消息内容`);
        return;
      }
      d(!0);
      let a = await JC(n, i, e, r);
      (d(!1),
        a !== null &&
          (t(`[${n}] ${i === `group` ? `群` : `私聊`}消息 -> ${o}: ${r}`),
          t(`[成功] 消息已发送`),
          l(``)));
    },
    p = `h-9 px-4 rounded-md text-xs border transition-colors cursor-pointer`,
    m = `bg-[rgba(90,125,255,0.15)] text-[#a2bdff] border-[rgba(90,125,255,0.4)]`,
    h = `bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]`;
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `消息发送`,
        description: `发送群消息或私聊消息`,
      }),
      (0, X.jsx)(gC.div, {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        children: (0, X.jsx)(yw, {
          variant: `glass`,
          padding: `lg`,
          className: `max-w-2xl`,
          children: (0, X.jsxs)(`div`, {
            className: `space-y-5`,
            children: [
              (0, X.jsxs)(`div`, {
                children: [
                  (0, X.jsx)(`label`, {
                    className: `text-xs text-neutral-400 mb-1.5 block`,
                    children: `选择 Bot`,
                  }),
                  (0, X.jsx)(jw, {
                    storageKey: `select_msgBotSelect`,
                    connectedOnly: !0,
                    value: n,
                    onChange: r,
                  }),
                ],
              }),
              (0, X.jsxs)(`div`, {
                children: [
                  (0, X.jsx)(`label`, {
                    className: `text-xs text-neutral-400 mb-1.5 block`,
                    children: `消息类型`,
                  }),
                  (0, X.jsxs)(`div`, {
                    className: `flex gap-2`,
                    children: [
                      (0, X.jsx)(`button`, {
                        type: `button`,
                        onClick: () => a(`group`),
                        className: `${p} ${i === `group` ? m : h}`,
                        children: `群消息`,
                      }),
                      (0, X.jsx)(`button`, {
                        type: `button`,
                        onClick: () => a(`private`),
                        className: `${p} ${i === `private` ? m : h}`,
                        children: `私聊消息`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, X.jsxs)(`div`, {
                children: [
                  (0, X.jsxs)(`label`, {
                    className: `text-xs text-neutral-400 mb-1.5 block`,
                    children: [
                      `目标`,
                      ` `,
                      (0, X.jsx)(`span`, {
                        className: `text-neutral-500`,
                        children: i === `group` ? `(群号)` : `(QQ号)`,
                      }),
                    ],
                  }),
                  (0, X.jsx)(Mw, {
                    storageKey: `msgTarget`,
                    placeholder: i === `group` ? `群号` : `QQ号`,
                    value: o,
                    onChange: s,
                  }),
                ],
              }),
              (0, X.jsxs)(`div`, {
                children: [
                  (0, X.jsx)(`label`, {
                    className: `text-xs text-neutral-400 mb-1.5 block`,
                    children: `消息内容`,
                  }),
                  (0, X.jsx)(`textarea`, {
                    className: `w-full min-h-[88px] rounded-lg border border-white/10 bg-[rgba(0,0,0,0.25)] px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-[#5a7dff] focus:outline-none resize-y transition`,
                    value: c,
                    onChange: (e) => l(e.target.value),
                    placeholder: `输入消息内容...`,
                  }),
                ],
              }),
              (0, X.jsx)($, {
                variant: `primary`,
                loading: u,
                onClick: f,
                children: `发送消息`,
              }),
            ],
          }),
        }),
      }),
    ],
  });
}
function Pw({ message: e, icon: t, action: n }) {
  return (0, X.jsxs)(gC.div, {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
    className: `py-16 text-center`,
    children: [
      t &&
        (0, X.jsx)(`div`, {
          className: `mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400`,
          children: t,
        }),
      (0, X.jsx)(`div`, { className: `text-sm text-neutral-400`, children: e }),
      n &&
        (0, X.jsx)(`div`, {
          className: `mt-5 flex justify-center`,
          children: n,
        }),
    ],
  });
}
var Fw = [0.25, 0.1, 0.25, 1];
function Iw() {
  let { setCachedBots: e } = PC(),
    [t, n] = (0, w.useState)(``),
    [r, i] = Aw(`contactTab`, `friends`),
    [a, o] = (0, w.useState)(!1),
    [s, c] = (0, w.useState)([]),
    [l, u] = (0, w.useState)([]),
    [d, f] = (0, w.useState)(null),
    [p, m] = (0, w.useState)([]),
    [h, g] = (0, w.useState)(!1);
  (0, w.useEffect)(() => {
    IC().then((t) => {
      t && e(t.bots || [], t.activeBot);
    });
  }, [e]);
  let _ = (0, w.useCallback)(async () => {
    if (!t) {
      (c([]), u([]));
      return;
    }
    (o(!0),
      f(null),
      r === `friends` ? c((await GC(t)) || []) : u((await KC(t)) || []),
      o(!1));
  }, [t, r]);
  (0, w.useEffect)(() => {
    _();
  }, [_]);
  let v = async (e, n) => {
      (g(!0),
        m((await qC(t, e)) || []),
        f({ groupId: e, groupName: n }),
        g(!1));
    },
    y = (e) =>
      `relative px-4 py-2 text-sm font-medium transition-colors ${e ? `text-text-primary` : `text-text-muted hover:text-text-primary`}`,
    b = (e) =>
      e === `owner` ? `error` : e === `admin` ? `warning` : `default`,
    x = (e) => (e === `owner` ? `群主` : e === `admin` ? `管理员` : `成员`);
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `好友与群`,
        description: `查看 Bot 的好友和群组`,
        actions: (0, X.jsx)(jw, {
          storageKey: `select_contactBotSelect`,
          connectedOnly: !0,
          value: t,
          onChange: n,
        }),
      }),
      (0, X.jsxs)(`div`, {
        className: `flex border-b border-white/10 mb-4`,
        children: [
          (0, X.jsxs)(`button`, {
            type: `button`,
            className: y(r === `friends`),
            onClick: () => i(`friends`),
            children: [
              `好友列表`,
              r === `friends` &&
                (0, X.jsx)(`span`, {
                  className: `absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#5a7dff] rounded-full`,
                }),
            ],
          }),
          (0, X.jsxs)(`button`, {
            type: `button`,
            className: y(r === `groups`),
            onClick: () => i(`groups`),
            children: [
              `群列表`,
              r === `groups` &&
                (0, X.jsx)(`span`, {
                  className: `absolute left-0 right-0 bottom-[-1px] h-[2px] bg-[#5a7dff] rounded-full`,
                }),
            ],
          }),
        ],
      }),
      r === `friends` &&
        (0, X.jsx)(X.Fragment, {
          children: t
            ? a
              ? (0, X.jsx)(`div`, {
                  className: `flex justify-center py-12`,
                  children: (0, X.jsx)(Sw, { size: `lg` }),
                })
              : s.length === 0
                ? (0, X.jsx)(Pw, { message: `暂无好友` })
                : (0, X.jsx)(yw, {
                    variant: `glass`,
                    padding: `none`,
                    className: `overflow-hidden`,
                    children: (0, X.jsxs)(`table`, {
                      className: `w-full text-sm`,
                      children: [
                        (0, X.jsx)(`thead`, {
                          className: `bg-white/[0.03] border-b border-white/10`,
                          children: (0, X.jsxs)(`tr`, {
                            className: `text-left text-xs text-neutral-400 uppercase tracking-wider`,
                            children: [
                              (0, X.jsx)(`th`, {
                                className: `px-4 py-3`,
                                children: `QQ`,
                              }),
                              (0, X.jsx)(`th`, {
                                className: `px-4 py-3`,
                                children: `昵称`,
                              }),
                              (0, X.jsx)(`th`, {
                                className: `px-4 py-3`,
                                children: `备注`,
                              }),
                            ],
                          }),
                        }),
                        (0, X.jsx)(`tbody`, {
                          children: s.map((e) =>
                            (0, X.jsxs)(
                              `tr`,
                              {
                                className: `border-b border-white/5 hover:bg-white/[0.02] transition-colors`,
                                children: [
                                  (0, X.jsx)(`td`, {
                                    className: `px-4 py-3 text-text-primary`,
                                    children: e.userId,
                                  }),
                                  (0, X.jsx)(`td`, {
                                    className: `px-4 py-3 text-text-primary`,
                                    children: e.nickname,
                                  }),
                                  (0, X.jsx)(`td`, {
                                    className: `px-4 py-3 text-text-primary`,
                                    children: e.remark || ``,
                                  }),
                                ],
                              },
                              e.userId,
                            ),
                          ),
                        }),
                      ],
                    }),
                  })
            : (0, X.jsx)(Pw, { message: `请选择 Bot` }),
        }),
      r === `groups` &&
        (0, X.jsx)(X.Fragment, {
          children: t
            ? a
              ? (0, X.jsx)(`div`, {
                  className: `flex justify-center py-12`,
                  children: (0, X.jsx)(Sw, { size: `lg` }),
                })
              : l.length === 0
                ? (0, X.jsx)(Pw, { message: `暂无群组` })
                : (0, X.jsxs)(X.Fragment, {
                    children: [
                      (0, X.jsx)(yw, {
                        variant: `glass`,
                        padding: `none`,
                        className: `overflow-hidden`,
                        children: (0, X.jsxs)(`table`, {
                          className: `w-full text-sm`,
                          children: [
                            (0, X.jsx)(`thead`, {
                              className: `bg-white/[0.03] border-b border-white/10`,
                              children: (0, X.jsxs)(`tr`, {
                                className: `text-left text-xs text-neutral-400 uppercase tracking-wider`,
                                children: [
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3`,
                                    children: `群号`,
                                  }),
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3`,
                                    children: `群名`,
                                  }),
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3`,
                                    children: `成员数`,
                                  }),
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3`,
                                    children: `操作`,
                                  }),
                                ],
                              }),
                            }),
                            (0, X.jsx)(`tbody`, {
                              children: l.map((e) =>
                                (0, X.jsxs)(
                                  `tr`,
                                  {
                                    className: `border-b border-white/5 hover:bg-white/[0.02] transition-colors`,
                                    children: [
                                      (0, X.jsx)(`td`, {
                                        className: `px-4 py-3 text-text-primary`,
                                        children: e.groupId,
                                      }),
                                      (0, X.jsx)(`td`, {
                                        className: `px-4 py-3 text-text-primary`,
                                        children: e.groupName,
                                      }),
                                      (0, X.jsxs)(`td`, {
                                        className: `px-4 py-3 text-text-primary`,
                                        children: [
                                          e.memberCount,
                                          `/`,
                                          e.maxMemberCount,
                                        ],
                                      }),
                                      (0, X.jsx)(`td`, {
                                        className: `px-4 py-3`,
                                        children: (0, X.jsx)($, {
                                          size: `sm`,
                                          variant: `ghost`,
                                          onClick: () =>
                                            v(e.groupId, e.groupName),
                                          children: `查看成员`,
                                        }),
                                      }),
                                    ],
                                  },
                                  e.groupId,
                                ),
                              ),
                            }),
                          ],
                        }),
                      }),
                      d &&
                        (0, X.jsxs)(gC.div, {
                          initial: { opacity: 0, y: 12 },
                          animate: { opacity: 1, y: 0 },
                          transition: { duration: 0.35, ease: Fw },
                          className: `mt-6`,
                          children: [
                            (0, X.jsxs)(`div`, {
                              className: `flex items-center justify-between mb-3`,
                              children: [
                                (0, X.jsxs)(`h3`, {
                                  className: `text-base font-semibold text-text-primary`,
                                  children: [
                                    `群成员 - `,
                                    d.groupName,
                                    ` (`,
                                    d.groupId,
                                    `)`,
                                  ],
                                }),
                                (0, X.jsx)($, {
                                  size: `sm`,
                                  variant: `ghost`,
                                  onClick: () => f(null),
                                  children: `关闭`,
                                }),
                              ],
                            }),
                            h
                              ? (0, X.jsx)(`div`, {
                                  className: `flex justify-center py-8`,
                                  children: (0, X.jsx)(Sw, { size: `md` }),
                                })
                              : p.length === 0
                                ? (0, X.jsx)(Pw, { message: `暂无成员` })
                                : (0, X.jsx)(yw, {
                                    variant: `glass`,
                                    padding: `none`,
                                    className: `overflow-hidden`,
                                    children: (0, X.jsxs)(`table`, {
                                      className: `w-full text-sm`,
                                      children: [
                                        (0, X.jsx)(`thead`, {
                                          className: `bg-white/[0.03] border-b border-white/10`,
                                          children: (0, X.jsxs)(`tr`, {
                                            className: `text-left text-xs text-neutral-400 uppercase tracking-wider`,
                                            children: [
                                              (0, X.jsx)(`th`, {
                                                className: `px-4 py-3`,
                                                children: `QQ`,
                                              }),
                                              (0, X.jsx)(`th`, {
                                                className: `px-4 py-3`,
                                                children: `昵称`,
                                              }),
                                              (0, X.jsx)(`th`, {
                                                className: `px-4 py-3`,
                                                children: `群名片`,
                                              }),
                                              (0, X.jsx)(`th`, {
                                                className: `px-4 py-3`,
                                                children: `角色`,
                                              }),
                                            ],
                                          }),
                                        }),
                                        (0, X.jsx)(`tbody`, {
                                          children: p.map((e) =>
                                            (0, X.jsxs)(
                                              `tr`,
                                              {
                                                className: `border-b border-white/5 hover:bg-white/[0.02] transition-colors`,
                                                children: [
                                                  (0, X.jsx)(`td`, {
                                                    className: `px-4 py-3 text-text-primary`,
                                                    children: e.userId,
                                                  }),
                                                  (0, X.jsx)(`td`, {
                                                    className: `px-4 py-3 text-text-primary`,
                                                    children: e.nickname,
                                                  }),
                                                  (0, X.jsx)(`td`, {
                                                    className: `px-4 py-3 text-text-primary`,
                                                    children: e.card || ``,
                                                  }),
                                                  (0, X.jsx)(`td`, {
                                                    className: `px-4 py-3`,
                                                    children: (0, X.jsx)(wC, {
                                                      size: `sm`,
                                                      variant: b(e.role),
                                                      children: x(e.role),
                                                    }),
                                                  }),
                                                ],
                                              },
                                              e.userId,
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                  }),
                          ],
                        }),
                    ],
                  })
            : (0, X.jsx)(Pw, { message: `请选择 Bot` }),
        }),
    ],
  });
}
function Lw({ isOpen: e, onClose: t, title: n, children: r, footer: i }) {
  return (0, X.jsx)(Ew, {
    open: e,
    onClose: t,
    title: n,
    footer: i,
    size: `md`,
    children: r,
  });
}
var Rw = [0.25, 0.1, 0.25, 1];
function zw() {
  let { setCachedBots: e, appendLog: t } = PC(),
    [n, r] = (0, w.useState)(``),
    [i, a] = (0, w.useState)([]),
    [o, s] = (0, w.useState)(!1),
    [c, l] = (0, w.useState)(``),
    [u, d] = (0, w.useState)(``),
    [f, p] = (0, w.useState)(``),
    [m, h] = (0, w.useState)(`private`),
    [g, _] = (0, w.useState)(``),
    [v, y] = (0, w.useState)(!0),
    [b, x] = (0, w.useState)(null),
    [S, C] = (0, w.useState)(``),
    [T, E] = (0, w.useState)(``),
    [D, O] = (0, w.useState)(`private`),
    [ee, k] = (0, w.useState)(``),
    [A, j] = (0, w.useState)(!1),
    [M, N] = (0, w.useState)(!1),
    [te, P] = (0, w.useState)(!1);
  (0, w.useEffect)(() => {
    IC().then((t) => {
      t && e(t.bots || [], t.activeBot);
    });
  }, [e]);
  let F = (0, w.useCallback)(async () => {
    if (!n) {
      a([]);
      return;
    }
    (s(!0), a((await YC(n)) || []), s(!1));
  }, [n]);
  (0, w.useEffect)(() => {
    F();
  }, [F]);
  let ne = async () => {
      if (!n) {
        t(`[错误] 请选择 Bot`);
        return;
      }
      if (!c.trim() || !u || !f.trim() || !g.trim()) {
        t(`[错误] 请填写所有字段`);
        return;
      }
      let e = f
        .split(`,`)
        .map((e) => parseInt(e.trim()))
        .filter((e) => !isNaN(e));
      if (e.length === 0) {
        t(`[错误] 目标格式错误`);
        return;
      }
      (await XC(n, {
        name: c.trim(),
        time: u,
        targets: e,
        targetType: m,
        message: g.trim(),
        autoConnect: v,
      })) !== null &&
        (t(`添加定时任务: ${c.trim()}`),
        l(``),
        d(``),
        p(``),
        h(`private`),
        _(``),
        y(!0),
        F());
    },
    I = (e) => {
      (x(e),
        C(e.time),
        E((e.targets || []).join(`, `)),
        O(e.targetType),
        k(e.message),
        j(e.autoConnect),
        N(e.autoStopAfterSend ?? !1));
    },
    re = async () => {
      if (!b || !n) return;
      let e = T.split(`,`)
        .map((e) => parseInt(e.trim()))
        .filter((e) => !isNaN(e));
      if (e.length === 0) {
        t(`[错误] 目标格式错误`);
        return;
      }
      P(!0);
      let r = await ew(n, b.name, {
        time: S,
        targets: e,
        targetType: D,
        message: ee.trim(),
        autoConnect: A,
        autoStopAfterSend: M,
      });
      (P(!1), r !== null && (t(`编辑定时任务: ${b.name}`), x(null), F()));
    },
    ie = async (e, r) => {
      ((await QC(n, e, r)) === null && t(`[错误] 切换失败`), F());
    },
    ae = async (e) => {
      (await $C(n, e)) !== null && t(`[成功] 测试定时任务: ${e}`);
    },
    L = async (e) => {
      (await ZC(n, e)) !== null && (t(`[成功] 删除定时任务: ${e}`), F());
    },
    oe = (e) =>
      `h-9 px-4 rounded-md text-xs border transition-colors ${e ? `bg-[rgba(90,125,255,0.15)] text-[#a2bdff] border-[rgba(90,125,255,0.4)]` : `bg-white/[0.04] text-neutral-300 border-white/10 hover:bg-white/[0.08]`}`;
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `定时任务`,
        description: `Bot 定时消息管理`,
        actions: (0, X.jsx)(jw, {
          storageKey: `select_scheduleBotSelect`,
          value: n,
          onChange: r,
        }),
      }),
      n
        ? o
          ? (0, X.jsx)(`div`, {
              className: `flex justify-center py-12`,
              children: (0, X.jsx)(Sw, { size: `lg` }),
            })
          : (0, X.jsxs)(X.Fragment, {
              children: [
                i.length === 0
                  ? (0, X.jsx)(Pw, { message: `暂无定时任务` })
                  : (0, X.jsx)(yw, {
                      variant: `glass`,
                      padding: `none`,
                      className: `overflow-hidden mb-6`,
                      children: (0, X.jsxs)(`table`, {
                        className: `w-full text-sm`,
                        children: [
                          (0, X.jsx)(`thead`, {
                            className: `bg-white/[0.03] border-b border-white/10`,
                            children: (0, X.jsxs)(`tr`, {
                              className: `text-left text-xs text-neutral-400 uppercase tracking-wider`,
                              children: [
                                (0, X.jsx)(`th`, {
                                  className: `px-4 py-3`,
                                  children: `任务名`,
                                }),
                                (0, X.jsx)(`th`, {
                                  className: `px-4 py-3`,
                                  children: `时间`,
                                }),
                                (0, X.jsx)(`th`, {
                                  className: `px-4 py-3`,
                                  children: `目标`,
                                }),
                                (0, X.jsx)(`th`, {
                                  className: `px-4 py-3`,
                                  children: `消息`,
                                }),
                                (0, X.jsx)(`th`, {
                                  className: `px-4 py-3`,
                                  children: `启用`,
                                }),
                                (0, X.jsx)(`th`, {
                                  className: `px-4 py-3`,
                                  children: `操作`,
                                }),
                              ],
                            }),
                          }),
                          (0, X.jsx)(`tbody`, {
                            children: i.map((e) =>
                              (0, X.jsxs)(
                                `tr`,
                                {
                                  className: `border-b border-white/5 hover:bg-white/[0.02] transition-colors`,
                                  children: [
                                    (0, X.jsx)(`td`, {
                                      className: `px-4 py-3 text-text-primary`,
                                      children: e.name,
                                    }),
                                    (0, X.jsx)(`td`, {
                                      className: `px-4 py-3 text-text-primary`,
                                      children: e.time,
                                    }),
                                    (0, X.jsxs)(`td`, {
                                      className: `px-4 py-3 text-text-primary`,
                                      children: [
                                        (0, X.jsx)(wC, {
                                          variant:
                                            e.targetType === `group`
                                              ? `info`
                                              : `accent`,
                                          size: `sm`,
                                          className: `mr-2`,
                                          children:
                                            e.targetType === `group`
                                              ? `群`
                                              : `好友`,
                                        }),
                                        (e.targets || []).join(`, `),
                                      ],
                                    }),
                                    (0, X.jsx)(`td`, {
                                      className: `px-4 py-3 text-text-primary`,
                                      children: (0, X.jsx)(`span`, {
                                        className: `max-w-[200px] truncate inline-block`,
                                        children: e.message,
                                      }),
                                    }),
                                    (0, X.jsx)(`td`, {
                                      className: `px-4 py-3`,
                                      children: (0, X.jsx)(`input`, {
                                        type: `checkbox`,
                                        className: `accent-[#5a7dff] w-4 h-4 cursor-pointer`,
                                        checked: e.enabled,
                                        onChange: (t) =>
                                          ie(e.name, t.target.checked),
                                      }),
                                    }),
                                    (0, X.jsx)(`td`, {
                                      className: `px-4 py-3`,
                                      children: (0, X.jsxs)(`div`, {
                                        className: `flex items-center gap-1.5`,
                                        children: [
                                          (0, X.jsx)($, {
                                            size: `sm`,
                                            variant: `ghost`,
                                            onClick: () => I(e),
                                            children: `编辑`,
                                          }),
                                          (0, X.jsx)($, {
                                            size: `sm`,
                                            variant: `ghost`,
                                            onClick: () => ae(e.name),
                                            children: `测试`,
                                          }),
                                          (0, X.jsx)($, {
                                            size: `sm`,
                                            variant: `danger`,
                                            onClick: () => L(e.name),
                                            children: `删除`,
                                          }),
                                        ],
                                      }),
                                    }),
                                  ],
                                },
                                e.name,
                              ),
                            ),
                          }),
                        ],
                      }),
                    }),
                (0, X.jsx)(gC.div, {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.4, ease: Rw },
                  children: (0, X.jsxs)(yw, {
                    variant: `glass`,
                    padding: `md`,
                    children: [
                      (0, X.jsx)(`h3`, {
                        className: `text-base font-semibold text-text-primary mb-4`,
                        children: `添加定时任务`,
                      }),
                      (0, X.jsxs)(`div`, {
                        className: `grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4`,
                        children: [
                          (0, X.jsx)(bw, {
                            label: `任务名称`,
                            placeholder: `任务名称`,
                            value: c,
                            onChange: (e) => l(e.target.value),
                          }),
                          (0, X.jsx)(bw, {
                            label: `执行时间 (HH:mm)`,
                            type: `time`,
                            value: u,
                            onChange: (e) => d(e.target.value),
                          }),
                          (0, X.jsxs)(`div`, {
                            children: [
                              (0, X.jsx)(`label`, {
                                className: `text-sm text-text-muted mb-1 block`,
                                children: `目标类型`,
                              }),
                              (0, X.jsxs)(`div`, {
                                className: `flex gap-2`,
                                children: [
                                  (0, X.jsx)(`button`, {
                                    type: `button`,
                                    className: oe(m === `group`),
                                    onClick: () => h(`group`),
                                    children: `群`,
                                  }),
                                  (0, X.jsx)(`button`, {
                                    type: `button`,
                                    className: oe(m === `private`),
                                    onClick: () => h(`private`),
                                    children: `好友`,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, X.jsx)(bw, {
                            label:
                              m === `group`
                                ? `群号 (逗号分隔)`
                                : `QQ号 (逗号分隔)`,
                            placeholder: `123456,789012`,
                            value: f,
                            onChange: (e) => p(e.target.value),
                          }),
                          (0, X.jsx)(bw, {
                            label: `消息内容`,
                            placeholder: `消息内容`,
                            value: g,
                            onChange: (e) => _(e.target.value),
                          }),
                          (0, X.jsxs)(`label`, {
                            className: `flex items-center gap-2 cursor-pointer self-end pb-2`,
                            children: [
                              (0, X.jsx)(`input`, {
                                type: `checkbox`,
                                className: `accent-[#5a7dff] w-4 h-4`,
                                checked: v,
                                onChange: (e) => y(e.target.checked),
                              }),
                              (0, X.jsx)(`span`, {
                                className: `text-sm text-text-primary`,
                                children: `自动连接（到点自动启动 NapCat 并连接 Bot）`,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, X.jsx)($, {
                        variant: `primary`,
                        onClick: ne,
                        children: `添加任务`,
                      }),
                    ],
                  }),
                }),
              ],
            })
        : (0, X.jsx)(Pw, { message: `请选择 Bot` }),
      (0, X.jsx)(Lw, {
        isOpen: b !== null,
        onClose: () => x(null),
        title: `编辑定时任务`,
        footer: (0, X.jsxs)(`div`, {
          className: `flex gap-2 justify-end`,
          children: [
            (0, X.jsx)($, {
              variant: `ghost`,
              onClick: () => x(null),
              children: `取消`,
            }),
            (0, X.jsx)($, {
              variant: `primary`,
              disabled: te,
              onClick: re,
              children: te ? `保存中...` : `保存`,
            }),
          ],
        }),
        children: (0, X.jsxs)(`div`, {
          className: `grid grid-cols-1 gap-4`,
          children: [
            (0, X.jsx)(bw, {
              label: `任务名称`,
              value: b?.name || ``,
              disabled: !0,
            }),
            (0, X.jsx)(bw, {
              label: `执行时间 (HH:mm)`,
              type: `time`,
              value: S,
              onChange: (e) => C(e.target.value),
            }),
            (0, X.jsxs)(`div`, {
              children: [
                (0, X.jsx)(`label`, {
                  className: `text-sm text-text-muted mb-1 block`,
                  children: `目标类型`,
                }),
                (0, X.jsxs)(`div`, {
                  className: `flex gap-2`,
                  children: [
                    (0, X.jsx)(`button`, {
                      type: `button`,
                      className: oe(D === `group`),
                      onClick: () => O(`group`),
                      children: `群`,
                    }),
                    (0, X.jsx)(`button`, {
                      type: `button`,
                      className: oe(D === `private`),
                      onClick: () => O(`private`),
                      children: `好友`,
                    }),
                  ],
                }),
              ],
            }),
            (0, X.jsx)(bw, {
              label: D === `group` ? `群号 (逗号分隔)` : `QQ号 (逗号分隔)`,
              placeholder: `123456,789012`,
              value: T,
              onChange: (e) => E(e.target.value),
            }),
            (0, X.jsx)(bw, {
              label: `消息内容`,
              placeholder: `消息内容`,
              value: ee,
              onChange: (e) => k(e.target.value),
            }),
            (0, X.jsxs)(`label`, {
              className: `flex items-center gap-2 cursor-pointer`,
              children: [
                (0, X.jsx)(`input`, {
                  type: `checkbox`,
                  className: `accent-[#5a7dff] w-4 h-4`,
                  checked: A,
                  onChange: (e) => j(e.target.checked),
                }),
                (0, X.jsx)(`span`, {
                  className: `text-sm text-text-primary`,
                  children: `自动连接（到点自动启动 NapCat 并连接 Bot）`,
                }),
              ],
            }),
            (0, X.jsxs)(`label`, {
              className: `flex items-center gap-2 cursor-pointer`,
              children: [
                (0, X.jsx)(`input`, {
                  type: `checkbox`,
                  className: `accent-[#5a7dff] w-4 h-4`,
                  checked: M,
                  onChange: (e) => N(e.target.checked),
                }),
                (0, X.jsx)(`span`, {
                  className: `text-sm text-text-primary`,
                  children: `发送完自动停止（发送完消息后自动停止 NapCat 并断开连接）`,
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
var Bw = [0.25, 0.1, 0.25, 1];
function Vw() {
  let e = rr(),
    { appendLog: t } = PC(),
    [n, r] = (0, w.useState)({ napCatDir: ``, workRoot: `` }),
    [i, a] = (0, w.useState)([]),
    [o, s] = (0, w.useState)(!0),
    [c, l] = (0, w.useState)(``),
    [u, d] = (0, w.useState)(``),
    [f, p] = (0, w.useState)(``),
    [m, h] = (0, w.useState)(null),
    [g, _] = (0, w.useState)(null),
    [v, y] = (0, w.useState)(!1),
    b = (0, w.useMemo)(() => {
      let e = c.trim();
      return (e && i.find((t) => t.name === e && t.saved && !t.alive)) || null;
    }, [c, i]),
    x = (0, w.useCallback)(async () => {
      let [e, t] = await Promise.all([tw(), aw()]);
      (e && r(e), a(t || []), s(!1));
    }, []);
  (0, w.useEffect)(() => {
    x();
  }, [x]);
  let S = (0, w.useMemo)(() => i.filter((e) => e.alive), [i]),
    C = (0, w.useMemo)(() => i.filter((e) => !e.alive && e.saved), [i]),
    T = async () => {
      (await nw(n)) !== null && t(`[成功] NapCat 配置已保存`);
    },
    E = async () => {
      let e = c.trim();
      if (!e) {
        t(`[错误] 请填写实例名称`);
        return;
      }
      if (b) {
        (await rw(e)) !== null &&
          (t(`[成功] 从记忆启动: ${e}`),
          t(`NapCat ${e} 从记忆启动`),
          l(``),
          d(``),
          p(``),
          x());
        return;
      }
      if (!u.trim()) {
        t(`[错误] 请填写 QQ 号（或输入已记忆的实例名称直接启动）`);
        return;
      }
      let n = parseInt(f) || 6099;
      (await rw(e, u.trim(), n)) !== null &&
        (t(`[成功] NapCat 实例 ${e} 已启动`),
        t(`NapCat ${e} (QQ:${u.trim()}) 已启动`),
        l(``),
        d(``),
        p(``),
        x());
    },
    D = async (e) => {
      (await rw(e)) !== null &&
        (t(`[成功] 从记忆启动: ${e}`), t(`NapCat ${e} 从记忆启动`), x());
    },
    O = async (e) => {
      (await iw(e)) !== null &&
        ((await rw(e)) !== null &&
          (t(`[成功] 已重新启动: ${e}`), t(`NapCat ${e} 已重新启动`)),
        x());
    },
    ee = async (e) => {
      (await iw(e)) !== null && (t(`[成功] 已停止 ${e}`), x());
    },
    k = async () => {
      (await iw(`all`)) !== null && (t(`[成功] 已停止所有实例`), x());
    },
    A = async (e) => {
      (await cw(e)) !== null && (t(`[成功] 已删除: ${e}`), x());
    },
    j = async () => {
      (await cw(`all`)) !== null && (t(`[成功] 已删除全部实例`), x());
    },
    M = (e) => {
      (_({ qqUin: e.qqUin, webuiPort: String(e.webuiPort || 6099) }),
        h(e.name));
    },
    N = async (e) => {
      (await iw(e.name)) !== null &&
        (t(`[成功] 已停止 ${e.name}，请编辑后重新启动`), await x(), M(e));
    },
    te = async () => {
      if (!m || !g) return;
      y(!0);
      let e = parseInt(g.webuiPort) || 6099,
        n = await lw(m, g.qqUin, e);
      (y(!1),
        n !== null &&
          (t(`[成功] 已更新: ${m}`),
          t(`NapCat ${m} 配置已更新`),
          h(null),
          x()));
    },
    P = async () => {
      let e = await sw();
      e !== null &&
        (t(
          `[成功] 发现完成: 新建 ${e.created || 0} 个，共 ${e.total || 0} 个 Bot`,
        ),
        t(`NapCat 自动发现: 新建 ${e.created || 0} 个`));
    },
    F = (t) => {
      e(`/nc-logs?instance=${encodeURIComponent(t)}`);
    };
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `NapCat 管理`,
        description: `NapCat 进程与配置管理`,
        actions: (0, X.jsx)($, {
          size: `sm`,
          variant: `secondary`,
          onClick: P,
          children: `自动发现`,
        }),
      }),
      o
        ? (0, X.jsx)(`div`, {
            className: `flex justify-center items-center py-20`,
            children: (0, X.jsx)(Sw, { size: `lg` }),
          })
        : (0, X.jsxs)(`div`, {
            className: `space-y-6`,
            children: [
              (0, X.jsx)(gC.div, {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, ease: Bw },
                children: (0, X.jsxs)(yw, {
                  variant: `glass`,
                  padding: `lg`,
                  children: [
                    (0, X.jsx)(`h3`, {
                      className: `text-base font-semibold text-neutral-100 mb-4`,
                      children: `NapCat 配置`,
                    }),
                    (0, X.jsxs)(`div`, {
                      className: `grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4`,
                      children: [
                        (0, X.jsx)(bw, {
                          label: `NapCat 目录`,
                          placeholder: `NapCat 安装目录`,
                          value: n.napCatDir,
                          onChange: (e) =>
                            r({ ...n, napCatDir: e.target.value }),
                        }),
                        (0, X.jsx)(bw, {
                          label: `工作目录`,
                          placeholder: `工作目录根路径`,
                          value: n.workRoot,
                          onChange: (e) =>
                            r({ ...n, workRoot: e.target.value }),
                        }),
                      ],
                    }),
                    (0, X.jsx)($, {
                      size: `sm`,
                      variant: `primary`,
                      onClick: T,
                      children: `保存配置`,
                    }),
                  ],
                }),
              }),
              (0, X.jsx)(gC.div, {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.06, ease: Bw },
                children: (0, X.jsxs)(yw, {
                  variant: `glass`,
                  padding: `lg`,
                  children: [
                    (0, X.jsxs)(`div`, {
                      className: `flex items-center justify-between mb-4`,
                      children: [
                        (0, X.jsx)(`h3`, {
                          className: `text-base font-semibold text-neutral-100`,
                          children: `运行中实例`,
                        }),
                        S.length > 0
                          ? (0, X.jsx)($, {
                              size: `sm`,
                              variant: `danger`,
                              onClick: k,
                              children: `停止全部`,
                            })
                          : null,
                      ],
                    }),
                    S.length === 0
                      ? (0, X.jsx)(Pw, { message: `暂无运行中的实例` })
                      : (0, X.jsx)(yw, {
                          variant: `glass`,
                          padding: `none`,
                          className: `overflow-hidden`,
                          children: (0, X.jsxs)(`table`, {
                            className: `w-full text-sm`,
                            children: [
                              (0, X.jsx)(`thead`, {
                                className: `bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-400`,
                                children: (0, X.jsxs)(`tr`, {
                                  children: [
                                    (0, X.jsx)(`th`, {
                                      className: `px-4 py-3 text-left font-medium`,
                                      children: `名称`,
                                    }),
                                    (0, X.jsx)(`th`, {
                                      className: `px-4 py-3 text-left font-medium`,
                                      children: `QQ`,
                                    }),
                                    (0, X.jsx)(`th`, {
                                      className: `px-4 py-3 text-left font-medium`,
                                      children: `WS 端口`,
                                    }),
                                    (0, X.jsx)(`th`, {
                                      className: `px-4 py-3 text-left font-medium`,
                                      children: `HTTP 端口`,
                                    }),
                                    (0, X.jsx)(`th`, {
                                      className: `px-4 py-3 text-left font-medium`,
                                      children: `PID`,
                                    }),
                                    (0, X.jsx)(`th`, {
                                      className: `px-4 py-3 text-left font-medium`,
                                      children: `记忆`,
                                    }),
                                    (0, X.jsx)(`th`, {
                                      className: `px-4 py-3 text-left font-medium`,
                                      children: `操作`,
                                    }),
                                  ],
                                }),
                              }),
                              (0, X.jsx)(`tbody`, {
                                className: `divide-y divide-white/5`,
                                children: S.map((e) =>
                                  (0, X.jsxs)(
                                    `tr`,
                                    {
                                      className: `hover:bg-white/[0.02]`,
                                      children: [
                                        (0, X.jsx)(`td`, {
                                          className: `px-4 py-3 text-neutral-200`,
                                          children: e.name,
                                        }),
                                        (0, X.jsx)(`td`, {
                                          className: `px-4 py-3 text-neutral-200`,
                                          children: e.qqUin,
                                        }),
                                        (0, X.jsx)(`td`, {
                                          className: `px-4 py-3 text-neutral-200`,
                                          children: e.wsPort,
                                        }),
                                        (0, X.jsx)(`td`, {
                                          className: `px-4 py-3 text-neutral-200`,
                                          children: e.httpPort,
                                        }),
                                        (0, X.jsx)(`td`, {
                                          className: `px-4 py-3 text-neutral-200`,
                                          children: e.pid,
                                        }),
                                        (0, X.jsx)(`td`, {
                                          className: `px-4 py-3 text-neutral-200`,
                                          children: e.saved
                                            ? (0, X.jsx)(wC, {
                                                variant: `primary`,
                                                size: `sm`,
                                                children: `已记忆`,
                                              })
                                            : (0, X.jsx)(`span`, {
                                                className: `text-xs text-neutral-500`,
                                                children: `未记忆`,
                                              }),
                                        }),
                                        (0, X.jsx)(`td`, {
                                          className: `px-4 py-3 text-neutral-200`,
                                          children: (0, X.jsxs)(`div`, {
                                            className: `flex items-center gap-1.5`,
                                            children: [
                                              (0, X.jsx)($, {
                                                size: `sm`,
                                                variant: `ghost`,
                                                onClick: () => F(e.name),
                                                children: `日志`,
                                              }),
                                              (0, X.jsx)($, {
                                                size: `sm`,
                                                variant: `secondary`,
                                                onClick: () => N(e),
                                                children: `编辑`,
                                              }),
                                              (0, X.jsx)($, {
                                                size: `sm`,
                                                variant: `primary`,
                                                onClick: () => O(e.name),
                                                children: `重启`,
                                              }),
                                              (0, X.jsx)($, {
                                                size: `sm`,
                                                variant: `danger`,
                                                onClick: () => ee(e.name),
                                                children: `停止`,
                                              }),
                                            ],
                                          }),
                                        }),
                                      ],
                                    },
                                    e.name,
                                  ),
                                ),
                              }),
                            ],
                          }),
                        }),
                  ],
                }),
              }),
              C.length > 0 &&
                (0, X.jsx)(gC.div, {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.4, delay: 0.09, ease: Bw },
                  children: (0, X.jsxs)(yw, {
                    variant: `glass`,
                    padding: `lg`,
                    children: [
                      (0, X.jsxs)(`div`, {
                        className: `flex items-center justify-between mb-4`,
                        children: [
                          (0, X.jsx)(`h3`, {
                            className: `text-base font-semibold text-neutral-100`,
                            children: `记忆实例 (已停止)`,
                          }),
                          C.length > 1
                            ? (0, X.jsx)($, {
                                size: `sm`,
                                variant: `danger`,
                                onClick: j,
                                children: `删除全部`,
                              })
                            : null,
                        ],
                      }),
                      (0, X.jsx)(yw, {
                        variant: `glass`,
                        padding: `none`,
                        className: `overflow-hidden`,
                        children: (0, X.jsxs)(`table`, {
                          className: `w-full text-sm`,
                          children: [
                            (0, X.jsx)(`thead`, {
                              className: `bg-white/[0.03] text-xs uppercase tracking-wider text-neutral-400`,
                              children: (0, X.jsxs)(`tr`, {
                                children: [
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3 text-left font-medium`,
                                    children: `名称`,
                                  }),
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3 text-left font-medium`,
                                    children: `QQ`,
                                  }),
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3 text-left font-medium`,
                                    children: `WebUI 端口`,
                                  }),
                                  (0, X.jsx)(`th`, {
                                    className: `px-4 py-3 text-left font-medium`,
                                    children: `操作`,
                                  }),
                                ],
                              }),
                            }),
                            (0, X.jsx)(`tbody`, {
                              className: `divide-y divide-white/5`,
                              children: C.map((e) =>
                                (0, X.jsxs)(
                                  `tr`,
                                  {
                                    className: `hover:bg-white/[0.02]`,
                                    children: [
                                      (0, X.jsx)(`td`, {
                                        className: `px-4 py-3 text-neutral-200`,
                                        children: e.name,
                                      }),
                                      (0, X.jsx)(`td`, {
                                        className: `px-4 py-3 text-neutral-200`,
                                        children: e.qqUin,
                                      }),
                                      (0, X.jsx)(`td`, {
                                        className: `px-4 py-3 text-neutral-200`,
                                        children: e.webuiPort,
                                      }),
                                      (0, X.jsx)(`td`, {
                                        className: `px-4 py-3 text-neutral-200`,
                                        children: (0, X.jsxs)(`div`, {
                                          className: `flex items-center gap-1.5`,
                                          children: [
                                            (0, X.jsx)($, {
                                              size: `sm`,
                                              variant: `primary`,
                                              onClick: () => D(e.name),
                                              children: `启动`,
                                            }),
                                            (0, X.jsx)($, {
                                              size: `sm`,
                                              variant: `secondary`,
                                              onClick: () => M(e),
                                              children: `编辑`,
                                            }),
                                            (0, X.jsx)($, {
                                              size: `sm`,
                                              variant: `danger`,
                                              onClick: () => A(e.name),
                                              children: `删除`,
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  e.name,
                                ),
                              ),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              (0, X.jsx)(gC.div, {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: 0.12, ease: Bw },
                children: (0, X.jsxs)(yw, {
                  variant: `glass`,
                  padding: `lg`,
                  children: [
                    (0, X.jsx)(`h3`, {
                      className: `text-base font-semibold text-neutral-100 mb-4`,
                      children: `启动新实例`,
                    }),
                    b &&
                      (0, X.jsxs)(`div`, {
                        className: `mb-4 px-3 py-2 rounded-lg border border-[rgba(90,125,255,0.3)] bg-[rgba(90,125,255,0.08)] text-sm text-[#a2bdff]`,
                        children: [
                          `匹配到记忆实例: QQ `,
                          b.qqUin,
                          `, WebUI 端口`,
                          ` `,
                          b.webuiPort,
                          ` — 点击启动将直接从记忆恢复`,
                        ],
                      }),
                    (0, X.jsxs)(`div`, {
                      className: `grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4`,
                      children: [
                        (0, X.jsx)(bw, {
                          label: `实例名称`,
                          placeholder: `实例名称`,
                          value: c,
                          onChange: (e) => l(e.target.value),
                        }),
                        (0, X.jsxs)(`div`, {
                          children: [
                            (0, X.jsxs)(`label`, {
                              className: `text-xs font-medium text-neutral-300 mb-1.5 block`,
                              children: [
                                `QQ 号`,
                                ` `,
                                b &&
                                  (0, X.jsx)(`span`, {
                                    className: `text-[#a2bdff] ml-1`,
                                    children: `(自动填充)`,
                                  }),
                              ],
                            }),
                            (0, X.jsx)(Mw, {
                              storageKey: `ncQQ`,
                              placeholder: b ? b.qqUin : `QQ 号`,
                              value: u,
                              onChange: d,
                            }),
                          ],
                        }),
                        (0, X.jsx)(bw, {
                          label: b ? `WebUI 端口 (自动填充)` : `WebUI 端口`,
                          placeholder: b ? String(b.webuiPort) : `6099`,
                          value: f,
                          onChange: (e) => p(e.target.value),
                        }),
                      ],
                    }),
                    (0, X.jsx)($, {
                      variant: `primary`,
                      onClick: E,
                      children: b ? `从记忆启动` : `启动实例`,
                    }),
                  ],
                }),
              }),
            ],
          }),
      (0, X.jsx)(Ew, {
        open: m !== null,
        onClose: () => h(null),
        title: `编辑实例 - ${m}`,
        size: `md`,
        footer: (0, X.jsxs)(X.Fragment, {
          children: [
            (0, X.jsx)($, {
              size: `sm`,
              variant: `ghost`,
              onClick: () => h(null),
              children: `取消`,
            }),
            (0, X.jsx)($, {
              size: `sm`,
              variant: `primary`,
              loading: v,
              onClick: te,
              children: `保存`,
            }),
          ],
        }),
        children: (0, X.jsxs)(`div`, {
          className: `space-y-4`,
          children: [
            (0, X.jsx)(bw, { label: `实例名称`, value: m || ``, disabled: !0 }),
            (0, X.jsxs)(`div`, {
              children: [
                (0, X.jsx)(`label`, {
                  className: `text-xs font-medium text-neutral-300 mb-1.5 block`,
                  children: `QQ 号`,
                }),
                (0, X.jsx)(Mw, {
                  storageKey: `ncQQ`,
                  placeholder: `QQ 号`,
                  value: g?.qqUin || ``,
                  onChange: (e) => g && _({ ...g, qqUin: e }),
                }),
              ],
            }),
            (0, X.jsx)(bw, {
              label: `WebUI 端口`,
              placeholder: `6099`,
              value: g?.webuiPort || ``,
              onChange: (e) => g && _({ ...g, webuiPort: e.target.value }),
            }),
          ],
        }),
      }),
    ],
  });
}
function Hw(e) {
  return e
    .replace(/&/g, `&amp;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`)
    .replace(/"/g, `&quot;`)
    .replace(/'/g, `&#39;`);
}
function Uw(e) {
  let t = Hw(e);
  return / ERROR /.test(e)
    ? `<span class="text-red-400">${t}</span>`
    : / WARN /.test(e)
      ? `<span class="text-yellow-400">${t}</span>`
      : / DEBUG /.test(e)
        ? `<span class="text-neutral-500">${t}</span>`
        : t;
}
function Ww({
  lines: e,
  colorized: t = !1,
  tall: n = !1,
  emptyMessage: r = `暂无日志`,
}) {
  let i = (0, w.useRef)(null);
  (0, w.useEffect)(() => {
    i.current && (i.current.scrollTop = i.current.scrollHeight);
  }, [e]);
  let a = n ? `max-h-[calc(100vh-240px)] min-h-[400px]` : `max-h-[420px]`;
  return (0, X.jsx)(gC.div, {
    ref: i,
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
    className: `rounded-xl border border-white/10 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm ${a} overflow-y-auto mt-2`,
    children: (0, X.jsx)(`pre`, {
      className: `font-mono text-[0.82rem] leading-relaxed p-3.5 m-0 whitespace-pre-wrap break-all text-neutral-300`,
      children:
        e.length === 0
          ? (0, X.jsx)(`span`, {
              className: `block text-center text-neutral-500 text-sm`,
              children: r,
            })
          : t
            ? (0, X.jsx)(`span`, {
                dangerouslySetInnerHTML: {
                  __html: e.map(Uw).join(`
`),
                },
              })
            : e.join(`
`),
    }),
  });
}
function Gw() {
  let [e] = Hi(),
    [t, n] = (0, w.useState)([]),
    [r, i] = (0, w.useState)(``),
    [a, o] = (0, w.useState)([]),
    [s, c] = (0, w.useState)(!1),
    [l, u] = (0, w.useState)(!0);
  (0, w.useEffect)(() => {
    aw().then((t) => {
      let r = t || [];
      n(r);
      let a = e.get(`instance`),
        o = localStorage.getItem(`select_ncLogSelect`) || ``,
        s = a || o;
      (s && r.some((e) => e.name === s) && i(s), u(!1));
    });
  }, [e]);
  let d = (0, w.useCallback)(async () => {
    if (!r) return;
    localStorage.setItem(`select_ncLogSelect`, r);
    let e = await ow(r);
    e && e.lines && o(e.lines);
  }, [r]);
  return (
    (0, w.useEffect)(() => {
      r && d();
    }, [r, d]),
    OC(d, s ? 2e3 : null),
    (0, X.jsxs)(pw, {
      children: [
        (0, X.jsx)(mw, {
          title: `NapCat 日志`,
          description: `NapCat 实例运行日志`,
          actions: (0, X.jsxs)(`div`, {
            className: `flex items-center gap-2 flex-wrap`,
            children: [
              (0, X.jsx)(`div`, {
                className: `min-w-[200px]`,
                children: (0, X.jsx)(Cw, {
                  options: [
                    { value: ``, label: `选择实例...` },
                    ...t.map((e) => ({
                      value: e.name,
                      label: `${e.name} (QQ:${e.qqUin || `?`})`,
                    })),
                  ],
                  value: r,
                  onChange: (e) => i(e.target.value),
                  fullWidth: !0,
                }),
              }),
              (0, X.jsxs)(`label`, {
                className: `flex items-center gap-2 text-xs text-neutral-400 select-none`,
                children: [
                  (0, X.jsx)(`input`, {
                    type: `checkbox`,
                    checked: s,
                    onChange: (e) => c(e.target.checked),
                    className: `accent-[#5a7dff]`,
                  }),
                  (0, X.jsx)(`span`, { children: `自动刷新` }),
                ],
              }),
              (0, X.jsx)($, {
                size: `sm`,
                variant: `ghost`,
                onClick: d,
                children: `刷新`,
              }),
            ],
          }),
        }),
        l
          ? (0, X.jsx)(`div`, {
              className: `flex items-center justify-center py-20`,
              children: (0, X.jsx)(Sw, { size: `lg` }),
            })
          : (0, X.jsx)(Ww, { lines: a, tall: !0, emptyMessage: `无日志` }),
      ],
    })
  );
}
function Kw(e = `cmdHistory`, t = 50) {
  let [n, r] = Aw(e, []),
    [i, a] = (0, w.useState)(-1);
  return {
    history: n,
    push: (0, w.useCallback)(
      (e) => {
        (r((n) => [e, ...n.filter((t) => t !== e)].slice(0, t)), a(-1));
      },
      [r, t],
    ),
    navigateUp: (0, w.useCallback)(() => {
      if (n.length === 0) return null;
      let e = Math.min(i + 1, n.length - 1);
      return (a(e), n[e]);
    }, [n, i]),
    navigateDown: (0, w.useCallback)(() => {
      if (i <= 0) return (a(-1), ``);
      let e = i - 1;
      return (a(e), n[e]);
    }, [n, i]),
    reset: (0, w.useCallback)(() => a(-1), []),
  };
}
var qw = 1e5,
  Jw = `QQBot-Fire Web 控制台
输入 /help 查看命令列表
`,
  Yw = [0.25, 0.1, 0.25, 1];
function Xw() {
  let [e, t] = (0, w.useState)(Jw),
    [n, r] = (0, w.useState)(``),
    [i, a] = (0, w.useState)(`>`),
    o = (0, w.useRef)(null),
    s = (0, w.useRef)(null),
    c = Kw(),
    l = (0, w.useCallback)(async () => {
      try {
        let e = (await IC())?.bots || [];
        if (e.length === 0) {
          a(`>`);
          return;
        }
        let t = e[0];
        t.connected && t.userId
          ? a(`[${t.name}:${t.userId}] >`)
          : a(`[${t.name}] >`);
      } catch {
        a(`>`);
      }
    }, []);
  ((0, w.useEffect)(() => {
    (l(), s.current?.focus());
  }, [l]),
    (0, w.useEffect)(() => {
      o.current && (o.current.scrollTop = o.current.scrollHeight);
    }, [e]));
  let u = (0, w.useCallback)((e) => {
      t((t) => {
        let n = t + e;
        return n.length > qw ? n.slice(n.length - qw) : n;
      });
    }, []),
    d = (0, w.useCallback)(async () => {
      let e = n.trim();
      if (!e) return;
      let t = e.startsWith(`/`) ? e : `/` + e;
      (c.push(t), u(`${i} ${t}\n`), r(``));
      try {
        let e = await uw(t);
        e && typeof e.output == `string` && u(e.output);
      } catch (e) {
        u(`错误: ${e.message}\n`);
      }
      l();
    }, [n, i, c, u, l]),
    f = (0, w.useCallback)(
      (e) => {
        if (e.key === `Enter`) (e.preventDefault(), d());
        else if (e.key === `ArrowUp`) {
          e.preventDefault();
          let t = c.navigateUp();
          t !== null && r(t);
        } else
          e.key === `ArrowDown` &&
            (e.preventDefault(), r(c.navigateDown() ?? ``));
      },
      [d, c],
    ),
    p = (0, w.useCallback)(() => {
      t(Jw);
    }, []),
    m = (0, w.useCallback)(() => {
      s.current?.focus();
    }, []);
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `控制台`,
        description: `交互式命令行`,
        actions: (0, X.jsx)($, {
          size: `sm`,
          variant: `ghost`,
          onClick: p,
          children: `清屏`,
        }),
      }),
      (0, X.jsxs)(`div`, {
        className: `flex flex-col`,
        style: { height: `calc(100vh - 210px)` },
        children: [
          (0, X.jsx)(gC.div, {
            ref: o,
            onClick: m,
            className: `flex-1 rounded-t-xl border border-white/10 bg-[rgba(0,0,0,0.35)] backdrop-blur-sm overflow-y-auto`,
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, ease: Yw },
            children: (0, X.jsx)(`pre`, {
              className: `font-mono text-[0.82rem] leading-relaxed p-3.5 m-0 whitespace-pre-wrap break-all text-emerald-300`,
              children: e,
            }),
          }),
          (0, X.jsxs)(gC.div, {
            className: `flex items-center rounded-b-xl border border-t-0 border-white/10 bg-[rgba(0,0,0,0.35)] px-3.5 py-2`,
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35, delay: 0.1, ease: Yw },
            children: [
              (0, X.jsx)(`span`, {
                className: `font-mono text-[0.82rem] text-[#a2bdff] mr-2 select-none whitespace-nowrap`,
                children: i,
              }),
              (0, X.jsx)(`input`, {
                ref: s,
                value: n,
                onChange: (e) => r(e.target.value),
                onKeyDown: f,
                placeholder: `输入命令，Enter 执行`,
                className: `flex-1 bg-transparent border-none outline-none font-mono text-[0.82rem] text-white placeholder:text-neutral-500`,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Zw() {
  let [e, t] = (0, w.useState)([]),
    [n, r] = (0, w.useState)(`latest.log`),
    [i, a] = (0, w.useState)(`200`),
    [o, s] = (0, w.useState)([]),
    [c, l] = (0, w.useState)(``),
    [u, d] = (0, w.useState)(!1),
    [f, p] = (0, w.useState)(!0);
  (0, w.useEffect)(() => {
    dw().then((e) => {
      (t(e || []), p(!1));
    });
  }, []);
  let m = (0, w.useCallback)(async () => {
    let e = await fw(n, parseInt(i) || 200);
    e &&
      e.lines &&
      (s(e.lines),
      l(
        `${e.file} - 显示第 ${e.from + 1} ~ ${e.from + e.lines.length} 行 (共 ${e.total} 行)`,
      ));
  }, [n, i]);
  return (
    (0, w.useEffect)(() => {
      m();
    }, [m]),
    OC(m, u ? 3e3 : null),
    f
      ? (0, X.jsx)(pw, {
          children: (0, X.jsx)(`div`, {
            className: `flex items-center justify-center py-20`,
            children: (0, X.jsx)(Sw, { size: `lg` }),
          }),
        })
      : (0, X.jsxs)(pw, {
          children: [
            (0, X.jsx)(mw, {
              title: `服务端日志`,
              description: `查看应用运行日志并支持自动刷新`,
              actions: (0, X.jsxs)(`div`, {
                className: `flex items-end gap-3 flex-wrap`,
                children: [
                  (0, X.jsx)(Cw, {
                    value: n,
                    onChange: (e) => r(e.target.value),
                    options: e.map((e) => ({ value: e.name, label: e.name })),
                    className: `min-w-[180px]`,
                  }),
                  (0, X.jsx)(bw, {
                    type: `number`,
                    value: i,
                    onChange: (e) => a(e.target.value),
                    placeholder: `行数`,
                    className: `w-[110px]`,
                  }),
                  (0, X.jsxs)(`label`, {
                    className: `flex h-10 items-center gap-2 cursor-pointer rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-text-primary`,
                    children: [
                      (0, X.jsx)(`input`, {
                        type: `checkbox`,
                        className: `accent-[#5a7dff] h-4 w-4`,
                        checked: u,
                        onChange: (e) => d(e.target.checked),
                      }),
                      (0, X.jsx)(`span`, { children: `自动刷新` }),
                    ],
                  }),
                  (0, X.jsx)($, {
                    size: `sm`,
                    variant: `ghost`,
                    onClick: m,
                    children: `刷新`,
                  }),
                ],
              }),
            }),
            c &&
              (0, X.jsx)(`div`, {
                className: `mb-1 text-xs text-text-muted`,
                children: c,
              }),
            (0, X.jsx)(Ww, { lines: o, colorized: !0, tall: !0 }),
          ],
        })
  );
}
function Qw() {
  let { operationLogs: e, clearLogs: t } = PC();
  return (0, X.jsxs)(pw, {
    children: [
      (0, X.jsx)(mw, {
        title: `操作日志`,
        description: `Web 操作记录`,
        actions: (0, X.jsx)($, {
          size: `sm`,
          variant: `danger`,
          onClick: t,
          children: `清空日志`,
        }),
      }),
      (0, X.jsx)(Ww, { lines: e, tall: !0, emptyMessage: `等待日志...` }),
    ],
  });
}
var $w = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};
function eT() {
  let e = er();
  return (0, X.jsx)(bx, {
    mode: `wait`,
    children: (0, X.jsx)(
      gC.div,
      {
        variants: $w,
        initial: `initial`,
        animate: `animate`,
        exit: `exit`,
        className: `h-full`,
        children: (0, X.jsx)(Vr, {}),
      },
      e.pathname,
    ),
  });
}
function tT() {
  return (0, X.jsx)(DC, {});
}
var nT = Ai([
  {
    element: (0, X.jsx)(tT, {}),
    children: [
      {
        element: (0, X.jsx)(eT, {}),
        children: [
          {
            index: !0,
            element: (0, X.jsx)(Br, { to: `/dashboard`, replace: !0 }),
          },
          { path: `dashboard`, element: (0, X.jsx)(Dw, {}) },
          { path: `bots`, element: (0, X.jsx)(kw, {}) },
          { path: `messages`, element: (0, X.jsx)(Nw, {}) },
          { path: `contacts`, element: (0, X.jsx)(Iw, {}) },
          { path: `schedules`, element: (0, X.jsx)(zw, {}) },
          { path: `napcat`, element: (0, X.jsx)(Vw, {}) },
          { path: `nc-logs`, element: (0, X.jsx)(Gw, {}) },
          { path: `console`, element: (0, X.jsx)(Xw, {}) },
          { path: `server-logs`, element: (0, X.jsx)(Zw, {}) },
          { path: `logs`, element: (0, X.jsx)(Qw, {}) },
          {
            path: `*`,
            element: (0, X.jsx)(Br, { to: `/dashboard`, replace: !0 }),
          },
        ],
      },
    ],
  },
]);
(document.documentElement.classList.add(`dark`),
  _C.createRoot(document.getElementById(`root`)).render(
    (0, X.jsxs)(w.StrictMode, {
      children: [
        (0, X.jsx)(ea, { router: nT }),
        (0, X.jsx)(wf.Provider, { placement: `top end` }),
      ],
    }),
  ));
