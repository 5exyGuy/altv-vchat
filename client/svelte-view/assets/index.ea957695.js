const S = function () {
    const t = document.createElement('link').relList;
    if (t && t.supports && t.supports('modulepreload')) return;
    for (const n of document.querySelectorAll('link[rel="modulepreload"]')) l(n);
    new MutationObserver((n) => {
        for (const c of n)
            if (c.type === 'childList')
                for (const s of c.addedNodes) s.tagName === 'LINK' && s.rel === 'modulepreload' && l(s);
    }).observe(document, { childList: !0, subtree: !0 });
    function r(n) {
        const c = {};
        return (
            n.integrity && (c.integrity = n.integrity),
            n.referrerpolicy && (c.referrerPolicy = n.referrerpolicy),
            n.crossorigin === 'use-credentials'
                ? (c.credentials = 'include')
                : n.crossorigin === 'anonymous'
                ? (c.credentials = 'omit')
                : (c.credentials = 'same-origin'),
            c
        );
    }
    function l(n) {
        if (n.ep) return;
        n.ep = !0;
        const c = r(n);
        fetch(n.href, c);
    }
};
S();
function L() {}
function N(e) {
    return e();
}
function v() {
    return Object.create(null);
}
function m(e) {
    e.forEach(N);
}
function A(e) {
    return typeof e == 'function';
}
function P(e, t) {
    return e != e ? t == t : e !== t || (e && typeof e == 'object') || typeof e == 'function';
}
function C(e) {
    return Object.keys(e).length === 0;
}
function I(e) {
    e.parentNode.removeChild(e);
}
function M(e) {
    return Array.from(e.childNodes);
}
let $;
function a(e) {
    $ = e;
}
const f = [],
    E = [],
    h = [],
    O = [],
    q = Promise.resolve();
let g = !1;
function B() {
    g || ((g = !0), q.then(j));
}
function y(e) {
    h.push(e);
}
const _ = new Set();
let d = 0;
function j() {
    const e = $;
    do {
        for (; d < f.length; ) {
            const t = f[d];
            d++, a(t), F(t.$$);
        }
        for (a(null), f.length = 0, d = 0; E.length; ) E.pop()();
        for (let t = 0; t < h.length; t += 1) {
            const r = h[t];
            _.has(r) || (_.add(r), r());
        }
        h.length = 0;
    } while (f.length);
    for (; O.length; ) O.pop()();
    (g = !1), _.clear(), a(e);
}
function F(e) {
    if (e.fragment !== null) {
        e.update(), m(e.before_update);
        const t = e.dirty;
        (e.dirty = [-1]), e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(y);
    }
}
const K = new Set();
function z(e, t) {
    e && e.i && (K.delete(e), e.i(t));
}
function D(e, t, r, l) {
    const { fragment: n, on_mount: c, on_destroy: s, after_update: p } = e.$$;
    n && n.m(t, r),
        l ||
            y(() => {
                const u = c.map(N).filter(A);
                s ? s.push(...u) : m(u), (e.$$.on_mount = []);
            }),
        p.forEach(y);
}
function G(e, t) {
    const r = e.$$;
    r.fragment !== null &&
        (m(r.on_destroy), r.fragment && r.fragment.d(t), (r.on_destroy = r.fragment = null), (r.ctx = []));
}
function H(e, t) {
    e.$$.dirty[0] === -1 && (f.push(e), B(), e.$$.dirty.fill(0)), (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function J(e, t, r, l, n, c, s, p = [-1]) {
    const u = $;
    a(e);
    const o = (e.$$ = {
        fragment: null,
        ctx: null,
        props: c,
        update: L,
        not_equal: n,
        bound: v(),
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(t.context || (u ? u.$$.context : [])),
        callbacks: v(),
        dirty: p,
        skip_bound: !1,
        root: t.target || u.$$.root,
    });
    s && s(o.root);
    let b = !1;
    if (
        ((o.ctx = r
            ? r(e, t.props || {}, (i, x, ...k) => {
                  const w = k.length ? k[0] : x;
                  return (
                      o.ctx &&
                          n(o.ctx[i], (o.ctx[i] = w)) &&
                          (!o.skip_bound && o.bound[i] && o.bound[i](w), b && H(e, i)),
                      x
                  );
              })
            : []),
        o.update(),
        (b = !0),
        m(o.before_update),
        (o.fragment = l ? l(o.ctx) : !1),
        t.target)
    ) {
        if (t.hydrate) {
            const i = M(t.target);
            o.fragment && o.fragment.l(i), i.forEach(I);
        } else o.fragment && o.fragment.c();
        t.intro && z(e.$$.fragment), D(e, t.target, t.anchor, t.customElement), j();
    }
    a(u);
}
class Q {
    $destroy() {
        G(this, 1), (this.$destroy = L);
    }
    $on(t, r) {
        const l = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
        return (
            l.push(r),
            () => {
                const n = l.indexOf(r);
                n !== -1 && l.splice(n, 1);
            }
        );
    }
    $set(t) {
        this.$$set && !C(t) && ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
    }
}
class R extends Q {
    constructor(t) {
        super(), J(this, t, null, null, P, {});
    }
}
new R({ target: document.getElementById('app') });
