(function () {
    const t = document.createElement('link').relList;
    if (t && t.supports && t.supports('modulepreload')) return;
    for (const s of document.querySelectorAll('link[rel="modulepreload"]')) o(s);
    new MutationObserver((s) => {
        for (const i of s)
            if (i.type === 'childList')
                for (const r of i.addedNodes) r.tagName === 'LINK' && r.rel === 'modulepreload' && o(r);
    }).observe(document, { childList: !0, subtree: !0 });
    function n(s) {
        const i = {};
        return (
            s.integrity && (i.integrity = s.integrity),
            s.referrerpolicy && (i.referrerPolicy = s.referrerpolicy),
            s.crossorigin === 'use-credentials'
                ? (i.credentials = 'include')
                : s.crossorigin === 'anonymous'
                ? (i.credentials = 'omit')
                : (i.credentials = 'same-origin'),
            i
        );
    }
    function o(s) {
        if (s.ep) return;
        s.ep = !0;
        const i = n(s);
        fetch(s.href, i);
    }
})();
function S() {}
function we(e, t) {
    for (const n in t) e[n] = t[n];
    return e;
}
function ge(e) {
    return e();
}
function ie() {
    return Object.create(null);
}
function j(e) {
    e.forEach(ge);
}
function be(e) {
    return typeof e == 'function';
}
function Y(e, t) {
    return e != e ? t == t : e !== t || (e && typeof e == 'object') || typeof e == 'function';
}
function ve(e) {
    return Object.keys(e).length === 0;
}
function ke(e, t, n, o) {
    if (e) {
        const s = pe(e, t, n, o);
        return e[0](s);
    }
}
function pe(e, t, n, o) {
    return e[1] && o ? we(n.ctx.slice(), e[1](o(t))) : n.ctx;
}
function Ee(e, t, n, o) {
    if (e[2] && o) {
        const s = e[2](o(n));
        if (t.dirty === void 0) return s;
        if (typeof s == 'object') {
            const i = [],
                r = Math.max(t.dirty.length, s.length);
            for (let a = 0; a < r; a += 1) i[a] = t.dirty[a] | s[a];
            return i;
        }
        return t.dirty | s;
    }
    return t.dirty;
}
function Me(e, t, n, o, s, i) {
    if (s) {
        const r = pe(t, n, o, i);
        e.p(r, s);
    }
}
function Pe(e) {
    if (e.ctx.length > 32) {
        const t = [],
            n = e.ctx.length / 32;
        for (let o = 0; o < n; o++) t[o] = -1;
        return t;
    }
    return -1;
}
function p(e, t) {
    e.appendChild(t);
}
function C(e, t, n) {
    e.insertBefore(t, n || null);
}
function I(e) {
    e.parentNode.removeChild(e);
}
function te(e, t) {
    for (let n = 0; n < e.length; n += 1) e[n] && e[n].d(t);
}
function v(e) {
    return document.createElement(e);
}
function Ie(e) {
    return document.createElementNS('http://www.w3.org/2000/svg', e);
}
function N(e) {
    return document.createTextNode(e);
}
function L() {
    return N(' ');
}
function $e() {
    return N('');
}
function O(e, t, n, o) {
    return e.addEventListener(t, n, o), () => e.removeEventListener(t, n, o);
}
function P(e, t, n) {
    n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Ce(e) {
    return Array.from(e.childNodes);
}
function K(e, t) {
    (t = '' + t), e.wholeText !== t && (e.data = t);
}
function re(e, t) {
    e.value = t == null ? '' : t;
}
function _(e, t, n) {
    e.classList[n ? 'add' : 'remove'](t);
}
class Ne {
    constructor(t = !1) {
        (this.is_svg = !1), (this.is_svg = t), (this.e = this.n = null);
    }
    c(t) {
        this.h(t);
    }
    m(t, n, o = null) {
        this.e || (this.is_svg ? (this.e = Ie(n.nodeName)) : (this.e = v(n.nodeName)), (this.t = n), this.c(t)),
            this.i(o);
    }
    h(t) {
        (this.e.innerHTML = t), (this.n = Array.from(this.e.childNodes));
    }
    i(t) {
        for (let n = 0; n < this.n.length; n += 1) C(this.t, this.n[n], t);
    }
    p(t) {
        this.d(), this.h(t), this.i(this.a);
    }
    d() {
        this.n.forEach(I);
    }
}
let D;
function q(e) {
    D = e;
}
function xe() {
    if (!D) throw new Error('Function called outside component initialization');
    return D;
}
function ne(e) {
    xe().$$.on_mount.push(e);
}
function Ae(e, t) {
    const n = e.$$.callbacks[t.type];
    n && n.slice().forEach((o) => o.call(this, t));
}
const B = [],
    G = [],
    R = [],
    X = [],
    Te = Promise.resolve();
let Z = !1;
function Le() {
    Z || ((Z = !0), Te.then(_e));
}
function ee(e) {
    R.push(e);
}
function le(e) {
    X.push(e);
}
const V = new Set();
let J = 0;
function _e() {
    const e = D;
    do {
        for (; J < B.length; ) {
            const t = B[J];
            J++, q(t), Oe(t.$$);
        }
        for (q(null), B.length = 0, J = 0; G.length; ) G.pop()();
        for (let t = 0; t < R.length; t += 1) {
            const n = R[t];
            V.has(n) || (V.add(n), n());
        }
        R.length = 0;
    } while (B.length);
    for (; X.length; ) X.pop()();
    (Z = !1), V.clear(), q(e);
}
function Oe(e) {
    if (e.fragment !== null) {
        e.update(), j(e.before_update);
        const t = e.dirty;
        (e.dirty = [-1]), e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(ee);
    }
}
const W = new Set();
let x;
function Se() {
    x = { r: 0, c: [], p: x };
}
function je() {
    x.r || j(x.c), (x = x.p);
}
function $(e, t) {
    e && e.i && (W.delete(e), e.i(t));
}
function A(e, t, n, o) {
    if (e && e.o) {
        if (W.has(e)) return;
        W.add(e),
            x.c.push(() => {
                W.delete(e), o && (n && e.d(1), o());
            }),
            e.o(t);
    } else o && o();
}
const Be = typeof window < 'u' ? window : typeof globalThis < 'u' ? globalThis : global;
function ae(e, t, n) {
    const o = e.$$.props[t];
    o !== void 0 && ((e.$$.bound[o] = n), n(e.$$.ctx[o]));
}
function Q(e) {
    e && e.c();
}
function z(e, t, n, o) {
    const { fragment: s, on_mount: i, on_destroy: r, after_update: a } = e.$$;
    s && s.m(t, n),
        o ||
            ee(() => {
                const l = i.map(ge).filter(be);
                r ? r.push(...l) : j(l), (e.$$.on_mount = []);
            }),
        a.forEach(ee);
}
function H(e, t) {
    const n = e.$$;
    n.fragment !== null &&
        (j(n.on_destroy), n.fragment && n.fragment.d(t), (n.on_destroy = n.fragment = null), (n.ctx = []));
}
function qe(e, t) {
    e.$$.dirty[0] === -1 && (B.push(e), Le(), e.$$.dirty.fill(0)), (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function F(e, t, n, o, s, i, r, a = [-1]) {
    const l = D;
    q(e);
    const f = (e.$$ = {
        fragment: null,
        ctx: null,
        props: i,
        update: S,
        not_equal: s,
        bound: ie(),
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(t.context || (l ? l.$$.context : [])),
        callbacks: ie(),
        dirty: a,
        skip_bound: !1,
        root: t.target || l.$$.root,
    });
    r && r(f.root);
    let u = !1;
    if (
        ((f.ctx = n
            ? n(e, t.props || {}, (d, k, ...c) => {
                  const h = c.length ? c[0] : k;
                  return (
                      f.ctx &&
                          s(f.ctx[d], (f.ctx[d] = h)) &&
                          (!f.skip_bound && f.bound[d] && f.bound[d](h), u && qe(e, d)),
                      k
                  );
              })
            : []),
        f.update(),
        (u = !0),
        j(f.before_update),
        (f.fragment = o ? o(f.ctx) : !1),
        t.target)
    ) {
        if (t.hydrate) {
            const d = Ce(t.target);
            f.fragment && f.fragment.l(d), d.forEach(I);
        } else f.fragment && f.fragment.c();
        t.intro && $(e.$$.fragment), z(e, t.target, t.anchor, t.customElement), _e();
    }
    q(l);
}
class U {
    $destroy() {
        H(this, 1), (this.$destroy = S);
    }
    $on(t, n) {
        const o = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
        return (
            o.push(n),
            () => {
                const s = o.indexOf(n);
                s !== -1 && o.splice(s, 1);
            }
        );
    }
    $set(t) {
        this.$$set && !ve(t) && ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
    }
}
const ze = [
    { name: 'help', description: 'Show this help !' },
    { name: 'help', description: 'Show this help #', parameters: [{ name: 'page', description: 'Help page' }] },
    {
        name: 'ban',
        description: 'Ban a player',
        parameters: [
            { name: 'player', description: "Player's name" },
            { name: 'reason', description: 'Reason' },
        ],
    },
    { name: 'heal', description: 'Heal a player', parameters: [{ name: 'player', description: "Player's name" }] },
];
function ue(e, t, n) {
    const o = e.slice();
    return (o[10] = t[n]), (o[12] = n), o;
}
function fe(e, t, n) {
    const o = e.slice();
    return (o[13] = t[n]), (o[15] = n), o;
}
function ce(e) {
    let t,
        n,
        o = e[13].name + '',
        s,
        i;
    return {
        c() {
            (t = v('span')),
                (n = N('[')),
                (s = N(o)),
                (i = N(`]\r
                    `)),
                P(t, 'class', 'ml-1'),
                _(t, 'font-bold', e[10].currentParam === e[15] + 1);
        },
        m(r, a) {
            C(r, t, a), p(t, n), p(t, s), p(t, i);
        },
        p(r, a) {
            a & 8 && o !== (o = r[13].name + '') && K(s, o),
                a & 8 && _(t, 'font-bold', r[10].currentParam === r[15] + 1);
        },
        d(r) {
            r && I(t);
        },
    };
}
function he(e) {
    var se;
    let t,
        n,
        o,
        s,
        i,
        r,
        a = e[10].name + '',
        l,
        f,
        u,
        d,
        k = (e[10].currentParam <= 0 ? e[10].description : e[10].parameters[e[10].currentParam - 1].description) + '',
        c,
        h,
        g,
        E,
        w = (se = e[10].parameters) != null ? se : [],
        m = [];
    for (let y = 0; y < w.length; y += 1) m[y] = ce(fe(e, w, y));
    function ye() {
        return e[7](e[10]);
    }
    return {
        c() {
            (t = v('div')),
                (n = v('div')),
                (o = v('span')),
                (s = N(e[1])),
                (i = L()),
                (r = v('span')),
                (l = N(a)),
                (f = L());
            for (let y = 0; y < m.length; y += 1) m[y].c();
            (u = L()),
                (d = v('div')),
                (c = N(k)),
                (h = L()),
                _(r, 'font-bold', e[10].currentParam === 0),
                P(n, 'class', 'flex text-base text-white text-opacity-100'),
                P(d, 'class', 'text-xs text-white text-opacity-50'),
                P(t, 'class', 'bg-black px-4 py-2 transition duration-200 select-none'),
                _(t, 'bg-opacity-50', e[12] === e[2]),
                _(t, 'bg-opacity-30', e[12] !== e[2]),
                _(t, 'hover:bg-opacity-50', e[12] !== e[2]);
        },
        m(y, M) {
            C(y, t, M), p(t, n), p(n, o), p(o, s), p(n, i), p(n, r), p(r, l), p(n, f);
            for (let T = 0; T < m.length; T += 1) m[T].m(n, null);
            p(t, u), p(t, d), p(d, c), p(t, h), g || ((E = O(t, 'click', ye)), (g = !0));
        },
        p(y, M) {
            var T;
            if (
                ((e = y),
                M & 2 && K(s, e[1]),
                M & 8 && a !== (a = e[10].name + '') && K(l, a),
                M & 8 && _(r, 'font-bold', e[10].currentParam === 0),
                M & 8)
            ) {
                w = (T = e[10].parameters) != null ? T : [];
                let b;
                for (b = 0; b < w.length; b += 1) {
                    const oe = fe(e, w, b);
                    m[b] ? m[b].p(oe, M) : ((m[b] = ce(oe)), m[b].c(), m[b].m(n, null));
                }
                for (; b < m.length; b += 1) m[b].d(1);
                m.length = w.length;
            }
            M & 8 &&
                k !==
                    (k =
                        (e[10].currentParam <= 0
                            ? e[10].description
                            : e[10].parameters[e[10].currentParam - 1].description) + '') &&
                K(c, k),
                M & 4 && _(t, 'bg-opacity-50', e[12] === e[2]),
                M & 4 && _(t, 'bg-opacity-30', e[12] !== e[2]),
                M & 4 && _(t, 'hover:bg-opacity-50', e[12] !== e[2]);
        },
        d(y) {
            y && I(t), te(m, y), (g = !1), E();
        },
    };
}
function He(e) {
    let t,
        n,
        o,
        s = e[3],
        i = [];
    for (let r = 0; r < s.length; r += 1) i[r] = he(ue(e, s, r));
    return {
        c() {
            t = v('div');
            for (let r = 0; r < i.length; r += 1) i[r].c();
            P(t, 'class', 'mt-1 text-white flex flex-col transition origin-top'),
                _(t, 'scale-y-100', e[0].length > 0),
                _(t, 'scale-y-0', e[0].length === 0);
        },
        m(r, a) {
            C(r, t, a);
            for (let l = 0; l < i.length; l += 1) i[l].m(t, null);
            n || ((o = O(window, 'keydown', e[4])), (n = !0));
        },
        p(r, [a]) {
            if (a & 15) {
                s = r[3];
                let l;
                for (l = 0; l < s.length; l += 1) {
                    const f = ue(r, s, l);
                    i[l] ? i[l].p(f, a) : ((i[l] = he(f)), i[l].c(), i[l].m(t, null));
                }
                for (; l < i.length; l += 1) i[l].d(1);
                i.length = s.length;
            }
            a & 1 && _(t, 'scale-y-100', r[0].length > 0), a & 1 && _(t, 'scale-y-0', r[0].length === 0);
        },
        i: S,
        o: S,
        d(r) {
            r && I(t), te(i, r), (n = !1), o();
        },
    };
}
function De(e, t, n) {
    let { commands: o = ze } = t,
        { message: s = '' } = t,
        { prefix: i = '/' } = t,
        { max: r = 3 } = t,
        a = -1,
        l = [];
    function f(c) {
        return i + c;
    }
    function u(c) {
        (c.key !== 'ArrowDown' && c.key !== 'ArrowUp' && c.key !== 'Tab') ||
            (c.key === 'ArrowUp' && l.length > 1
                ? n(2, (a = Math.max(0, a - 1)))
                : c.key === 'ArrowDown' && l.length > 1
                ? n(2, (a = Math.min(l.length - 1, a + 1)))
                : c.key === 'Tab' && a >= 0 && !(l[a].currentParam > -1) && n(0, (s = f(l[a].name))),
            c.preventDefault());
    }
    function d(c) {
        const h = c.split(' ');
        n(
            3,
            (l = o
                .filter((g) => {
                    var w, m;
                    const E = h[0];
                    return (
                        f(g.name).startsWith(E) &&
                        h.length - 1 <=
                            ((m = (w = g == null ? void 0 : g.parameters) == null ? void 0 : w.length) != null ? m : 0)
                    );
                })
                .splice(0, r)
                .map((g) => {
                    var m;
                    let E = -1;
                    const w = f(g.name);
                    return (
                        h.length === 1 && h[0] === w && (E = 0),
                        h.length > 1 &&
                            h.length - 1 <= ((m = g.parameters.length) != null ? m : 0) &&
                            (E = h.length - 1),
                        { currentParam: E, ...g }
                    );
                })),
        ),
            l.length === 0 ? n(2, (a = -1)) : n(2, (a = 0));
    }
    const k = (c) => n(0, (s = c.name));
    return (
        (e.$$set = (c) => {
            'commands' in c && n(5, (o = c.commands)),
                'message' in c && n(0, (s = c.message)),
                'prefix' in c && n(1, (i = c.prefix)),
                'max' in c && n(6, (r = c.max));
        }),
        (e.$$.update = () => {
            e.$$.dirty & 1 && d(s);
        }),
        [s, i, a, l, u, o, r, k]
    );
}
class Ge extends U {
    constructor(t) {
        super(), F(this, t, De, He, Y, { commands: 5, message: 0, prefix: 1, max: 6 });
    }
}
function Ye(e) {
    let t, n, o;
    return {
        c() {
            (t = v('input')),
                P(t, 'class', 'bg-black bg-opacity-50 text-base text-white px-4 py-2 focus:outline-none'),
                P(t, 'placeholder', e[1]),
                _(t, 'invisible', e[2]);
        },
        m(s, i) {
            C(s, t, i),
                re(t, e[0]),
                n || ((o = [O(t, 'input', e[5]), O(t, 'keydown', e[3]), O(t, 'input', e[4])]), (n = !0));
        },
        p(s, [i]) {
            i & 2 && P(t, 'placeholder', s[1]),
                i & 1 && t.value !== s[0] && re(t, s[0]),
                i & 4 && _(t, 'invisible', s[2]);
        },
        i: S,
        o: S,
        d(s) {
            s && I(t), (n = !1), j(o);
        },
    };
}
function Fe(e, t, n) {
    let { placeholder: o = 'Type a message...' } = t,
        { message: s = '' } = t,
        i = !0,
        r = [];
    async function a(u) {
        u.key === 'Enter' &&
            (!s ||
                typeof s != 'string' ||
                s.length === 0 ||
                (window.alt && window.alt.emit('vchat:message', s),
                (r = [...r, s]),
                n(0, (s = '')),
                u.preventDefault()));
    }
    ne(() => {
        !window.alt || window.alt.on('vchat:focus', (u) => n(2, (i = u)));
    });
    function l(u) {
        Ae.call(this, e, u);
    }
    function f() {
        (s = this.value), n(0, s);
    }
    return (
        (e.$$set = (u) => {
            'placeholder' in u && n(1, (o = u.placeholder)), 'message' in u && n(0, (s = u.message));
        }),
        [s, o, i, a, l, f]
    );
}
class Ue extends U {
    constructor(t) {
        super(), F(this, t, Fe, Ye, Y, { placeholder: 1, message: 0 });
    }
}
function Je(e) {
    let t, n;
    const o = e[1].default,
        s = ke(o, e, e[0], null);
    return {
        c() {
            (t = v('div')), s && s.c(), P(t, 'class', 'text-white text-base select-none fade-in svelte-1aat9j5');
        },
        m(i, r) {
            C(i, t, r), s && s.m(t, null), (n = !0);
        },
        p(i, [r]) {
            s && s.p && (!n || r & 1) && Me(s, o, i, i[0], n ? Ee(o, i[0], r, null) : Pe(i[0]), null);
        },
        i(i) {
            n || ($(s, i), (n = !0));
        },
        o(i) {
            A(s, i), (n = !1);
        },
        d(i) {
            i && I(t), s && s.d(i);
        },
    };
}
function Ke(e, t, n) {
    let { $$slots: o = {}, $$scope: s } = t;
    return (
        (e.$$set = (i) => {
            '$$scope' in i && n(0, (s = i.$$scope));
        }),
        [s, o]
    );
}
class Re extends U {
    constructor(t) {
        super(), F(this, t, Ke, Je, Y, {});
    }
}
const { window: We } = Be;
function de(e, t, n) {
    const o = e.slice();
    return (o[7] = t[n]), o;
}
function Qe(e) {
    let t,
        n = e[7] + '',
        o;
    return {
        c() {
            (t = new Ne(!1)), (o = $e()), (t.a = o);
        },
        m(s, i) {
            t.m(n, s, i), C(s, o, i);
        },
        p(s, i) {
            i & 1 && n !== (n = s[7] + '') && t.p(n);
        },
        d(s) {
            s && I(o), s && t.d();
        },
    };
}
function me(e) {
    let t, n;
    return (
        (t = new Re({ props: { $$slots: { default: [Qe] }, $$scope: { ctx: e } } })),
        {
            c() {
                Q(t.$$.fragment);
            },
            m(o, s) {
                z(t, o, s), (n = !0);
            },
            p(o, s) {
                const i = {};
                s & 1025 && (i.$$scope = { dirty: s, ctx: o }), t.$set(i);
            },
            i(o) {
                n || ($(t.$$.fragment, o), (n = !0));
            },
            o(o) {
                A(t.$$.fragment, o), (n = !1);
            },
            d(o) {
                H(t, o);
            },
        }
    );
}
function Ve(e) {
    let t,
        n,
        o,
        s,
        i = e[0],
        r = [];
    for (let l = 0; l < i.length; l += 1) r[l] = me(de(e, i, l));
    const a = (l) =>
        A(r[l], 1, 1, () => {
            r[l] = null;
        });
    return {
        c() {
            t = v('div');
            for (let l = 0; l < r.length; l += 1) r[l].c();
            P(t, 'class', 'flex flex-col gap-2 mb-4 h-80 overflow-y-scroll mask svelte-1hx5uno');
        },
        m(l, f) {
            C(l, t, f);
            for (let u = 0; u < r.length; u += 1) r[u].m(t, null);
            e[4](t), (n = !0), o || ((s = O(We, 'keyup', e[3])), (o = !0));
        },
        p(l, [f]) {
            if (f & 1) {
                i = l[0];
                let u;
                for (u = 0; u < i.length; u += 1) {
                    const d = de(l, i, u);
                    r[u] ? (r[u].p(d, f), $(r[u], 1)) : ((r[u] = me(d)), r[u].c(), $(r[u], 1), r[u].m(t, null));
                }
                for (Se(), u = i.length; u < r.length; u += 1) a(u);
                je();
            }
        },
        i(l) {
            if (!n) {
                for (let f = 0; f < i.length; f += 1) $(r[f]);
                n = !0;
            }
        },
        o(l) {
            r = r.filter(Boolean);
            for (let f = 0; f < r.length; f += 1) A(r[f]);
            n = !1;
        },
        d(l) {
            l && I(t), te(r, l), e[4](null), (o = !1), s();
        },
    };
}
function Xe(e, t, n) {
    let { history: o = [] } = t,
        s,
        i = !1;
    function r(u) {
        n(0, (o = [...o, u])), i && a();
    }
    function a() {
        s.scroll({ top: s.scrollHeight, left: 0, behavior: 'smooth' });
    }
    ne(() => {
        !window.alt || (window.alt.on('vchat:focus', (u) => (i = u)), window.alt.on('vchat:message', (u) => r(u)));
    });
    const l = (u) => u.key === '+' && a();
    function f(u) {
        G[u ? 'unshift' : 'push'](() => {
            (s = u), n(1, s);
        });
    }
    return (
        (e.$$set = (u) => {
            'history' in u && n(0, (o = u.history));
        }),
        [o, s, a, l, f]
    );
}
class Ze extends U {
    constructor(t) {
        super(), F(this, t, Xe, Ve, Y, { history: 0 });
    }
}
function et(e) {
    let t, n, o, s, i, r, a, l, f;
    n = new Ze({ props: { history: e[1] } });
    function u(h) {
        e[2](h);
    }
    let d = {};
    e[0] !== void 0 && (d.message = e[0]), (s = new Ue({ props: d })), G.push(() => ae(s, 'message', u));
    function k(h) {
        e[3](h);
    }
    let c = { max: 3, prefix: tt };
    return (
        e[0] !== void 0 && (c.message = e[0]),
        (a = new Ge({ props: c })),
        G.push(() => ae(a, 'message', k)),
        {
            c() {
                (t = v('div')),
                    Q(n.$$.fragment),
                    (o = L()),
                    Q(s.$$.fragment),
                    (r = L()),
                    Q(a.$$.fragment),
                    P(t, 'class', 'flex flex-col m-4 top-60 w-[40rem]');
            },
            m(h, g) {
                C(h, t, g), z(n, t, null), p(t, o), z(s, t, null), p(t, r), z(a, t, null), (f = !0);
            },
            p(h, [g]) {
                const E = {};
                !i && g & 1 && ((i = !0), (E.message = h[0]), le(() => (i = !1))), s.$set(E);
                const w = {};
                !l && g & 1 && ((l = !0), (w.message = h[0]), le(() => (l = !1))), a.$set(w);
            },
            i(h) {
                f || ($(n.$$.fragment, h), $(s.$$.fragment, h), $(a.$$.fragment, h), (f = !0));
            },
            o(h) {
                A(n.$$.fragment, h), A(s.$$.fragment, h), A(a.$$.fragment, h), (f = !1);
            },
            d(h) {
                h && I(t), H(n), H(s), H(a);
            },
        }
    );
}
const tt = '/';
function nt(e, t, n) {
    let o = [
            'My life is a crazy explosion of shapes and colors - Creativity',
            'I tend to be the peacemaker between friends',
            'Every day - if walking through the shops count as working out!',
            'Yes, but I only have a couple of items on it',
            'Good question - I am still trying to figure that out!',
            'My life is a crazy explosion of shapes and colors - Creativity',
            'I tend to be the peacemaker between friends',
            'Every day - if walking through the shops count as working out!',
            'Yes, but I only have a couple of items on it',
            'Good question - I am still trying to figure that out!',
            'My life is a crazy explosion of shapes and colors - Creativity',
            'I tend to be the peacemaker between friends',
            'Every day - if walking through the shops count as working out!',
            'Yes, but I only have a couple of items on it',
            'Good question - I am still trying to figure that out!',
            'My life is a crazy explosion of shapes and colors - Creativity',
            'I tend to be the peacemaker between friends',
            'Every day - if walking through the shops count as working out!',
            'Yes, but I only have a couple of items on it',
            'Good question - I am still trying to figure that out!',
        ],
        s = '';
    ne(() => {
        !window.alt || window.alt.emit('vchat:mounted');
    });
    function i(a) {
        (s = a), n(0, s);
    }
    function r(a) {
        (s = a), n(0, s);
    }
    return [s, o, i, r];
}
class st extends U {
    constructor(t) {
        super(), F(this, t, nt, et, Y, {});
    }
}
new st({ target: document.getElementById('app') });
