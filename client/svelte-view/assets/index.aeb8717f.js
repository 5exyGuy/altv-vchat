(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))l(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();function M(){}function Ie(t,e){for(const n in e)t[n]=e[n];return t}function Me(t){return t()}function ce(){return Object.create(null)}function K(t){t.forEach(Me)}function Ze(t){return typeof t=="function"}function B(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function Ae(t){return Object.keys(t).length===0}function Ne(t,e,n,l){if(t){const r=Ee(t,e,n,l);return t[0](r)}}function Ee(t,e,n,l){return t[1]&&l?Ie(n.ctx.slice(),t[1](l(e))):n.ctx}function Be(t,e,n,l){if(t[2]&&l){const r=t[2](l(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const i=[],s=Math.max(e.dirty.length,r.length);for(let u=0;u<s;u+=1)i[u]=e.dirty[u]|r[u];return i}return e.dirty|r}return e.dirty}function We(t,e,n,l,r,i){if(r){const s=Ee(e,n,l,i);t.p(s,r)}}function Oe(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let l=0;l<n;l++)e[l]=-1;return e}return-1}function v(t,e){t.appendChild(e)}function x(t,e,n){t.insertBefore(e,n||null)}function S(t){t.parentNode.removeChild(t)}function fe(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function P(t){return document.createElement(t)}function N(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function j(t){return document.createTextNode(t)}function I(){return j(" ")}function Te(){return j("")}function V(t,e,n,l){return t.addEventListener(e,n,l),()=>t.removeEventListener(e,n,l)}function je(t){return function(e){return e.preventDefault(),t.call(this,e)}}function m(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Ue(t){return Array.from(t.childNodes)}function $(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function ae(t,e){t.value=e==null?"":e}function R(t,e,n,l){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,l?"important":"")}function b(t,e,n){t.classList[n?"add":"remove"](e)}class Ve{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,l=null){this.e||(this.is_svg?this.e=N(n.nodeName):this.e=P(n.nodeName),this.t=n,this.c(e)),this.i(l)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)x(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(S)}}let Q;function G(t){Q=t}function Fe(){if(!Q)throw new Error("Function called outside component initialization");return Q}function ne(t){Fe().$$.on_mount.push(t)}const q=[],z=[],ee=[],re=[],De=Promise.resolve();let oe=!1;function Se(){oe||(oe=!0,De.then(Pe))}function se(){return Se(),De}function ie(t){ee.push(t)}function he(t){re.push(t)}const le=new Set;let X=0;function Pe(){const t=Q;do{for(;X<q.length;){const e=q[X];X++,G(e),Ke(e.$$)}for(G(null),q.length=0,X=0;z.length;)z.pop()();for(let e=0;e<ee.length;e+=1){const n=ee[e];le.has(n)||(le.add(n),n())}ee.length=0}while(q.length);for(;re.length;)re.pop()();oe=!1,le.clear(),G(t)}function Ke(t){if(t.fragment!==null){t.update(),K(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(ie)}}const te=new Set;let F;function J(){F={r:0,c:[],p:F}}function Y(){F.r||K(F.c),F=F.p}function C(t,e){t&&t.i&&(te.delete(t),t.i(e))}function L(t,e,n,l){if(t&&t.o){if(te.has(t))return;te.add(t),F.c.push(()=>{te.delete(t),l&&(n&&t.d(1),l())}),t.o(e)}else l&&l()}const ue=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function me(t,e,n){const l=t.$$.props[e];l!==void 0&&(t.$$.bound[l]=n,n(t.$$.ctx[l]))}function U(t){t&&t.c()}function Z(t,e,n,l){const{fragment:r,on_mount:i,on_destroy:s,after_update:u}=t.$$;r&&r.m(e,n),l||ie(()=>{const o=i.map(Me).filter(Ze);s?s.push(...o):K(o),t.$$.on_mount=[]}),u.forEach(ie)}function A(t,e){const n=t.$$;n.fragment!==null&&(K(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ze(t,e){t.$$.dirty[0]===-1&&(q.push(t),Se(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function W(t,e,n,l,r,i,s,u=[-1]){const o=Q;G(t);const f=t.$$={fragment:null,ctx:null,props:i,update:M,not_equal:r,bound:ce(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:ce(),dirty:u,skip_bound:!1,root:e.target||o.$$.root};s&&s(f.root);let a=!1;if(f.ctx=n?n(t,e.props||{},(g,w,...y)=>{const c=y.length?y[0]:w;return f.ctx&&r(f.ctx[g],f.ctx[g]=c)&&(!f.skip_bound&&f.bound[g]&&f.bound[g](c),a&&ze(t,g)),w}):[],f.update(),a=!0,K(f.before_update),f.fragment=l?l(f.ctx):!1,e.target){if(e.hydrate){const g=Ue(e.target);f.fragment&&f.fragment.l(g),g.forEach(S)}else f.fragment&&f.fragment.c();e.intro&&C(t.$$.fragment),Z(t,e.target,e.anchor,e.customElement),Pe()}G(o)}class O{$destroy(){A(this,1),this.$destroy=M}$on(e,n){const l=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return l.push(n),()=>{const r=l.indexOf(n);r!==-1&&l.splice(r,1)}}$set(e){this.$$set&&!Ae(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const qe=[],{window:Je}=ue;function ge(t,e,n){const l=t.slice();return l[11]=e[n],l[13]=n,l}function de(t,e,n){const l=t.slice();return l[14]=e[n],l[16]=n,l}function pe(t){let e,n,l=t[14].name+"",r,i;return{c(){e=P("span"),n=j("["),r=j(l),i=j(`]\r
                    `),m(e,"class","ml-1"),b(e,"font-bold",t[11].currentParam===t[16]+1)},m(s,u){x(s,e,u),v(e,n),v(e,r),v(e,i)},p(s,u){u&4&&l!==(l=s[14].name+"")&&$(r,l),u&4&&b(e,"font-bold",s[11].currentParam===s[16]+1)},d(s){s&&S(e)}}}function _e(t){var E;let e,n,l,r,i,s,u=t[11].name+"",o,f,a,g,w=(t[11].currentParam<=0?t[11].description:t[11].parameters[t[11].currentParam-1].description)+"",y,c,d=(E=t[11].parameters)!=null?E:[],h=[];for(let _=0;_<d.length;_+=1)h[_]=pe(de(t,d,_));return{c(){e=P("div"),n=P("div"),l=P("span"),r=j(t[0]),i=I(),s=P("span"),o=j(u),f=I();for(let _=0;_<h.length;_+=1)h[_].c();a=I(),g=P("div"),y=j(w),c=I(),b(s,"font-bold",t[11].currentParam===0),m(n,"class","flex text-base text-white text-opacity-100"),m(g,"class","text-xs text-white text-opacity-50"),m(e,"class","bg-black px-[16px] py-[8px] transition duration-200 select-none"),b(e,"bg-opacity-50",t[13]===t[1]),b(e,"bg-opacity-30",t[13]!==t[1]),b(e,"hover:bg-opacity-50",t[13]!==t[1])},m(_,H){x(_,e,H),v(e,n),v(n,l),v(l,r),v(n,i),v(n,s),v(s,o),v(n,f);for(let T=0;T<h.length;T+=1)h[T].m(n,null);v(e,a),v(e,g),v(g,y),v(e,c)},p(_,H){var T;if(H&1&&$(r,_[0]),H&4&&u!==(u=_[11].name+"")&&$(o,u),H&4&&b(s,"font-bold",_[11].currentParam===0),H&4){d=(T=_[11].parameters)!=null?T:[];let D;for(D=0;D<d.length;D+=1){const p=de(_,d,D);h[D]?h[D].p(p,H):(h[D]=pe(p),h[D].c(),h[D].m(n,null))}for(;D<h.length;D+=1)h[D].d(1);h.length=d.length}H&4&&w!==(w=(_[11].currentParam<=0?_[11].description:_[11].parameters[_[11].currentParam-1].description)+"")&&$(y,w),H&2&&b(e,"bg-opacity-50",_[13]===_[1]),H&2&&b(e,"bg-opacity-30",_[13]!==_[1]),H&2&&b(e,"hover:bg-opacity-50",_[13]!==_[1])},d(_){_&&S(e),fe(h,_)}}}function Ye(t){let e,n,l,r=t[2],i=[];for(let s=0;s<r.length;s+=1)i[s]=_e(ge(t,r,s));return{c(){e=P("div");for(let s=0;s<i.length;s+=1)i[s].c();m(e,"class","mt-[4px] text-white flex flex-col transition origin-top scale-y-0"),b(e,"!scale-y-100",t[2].length>0&&t[3])},m(s,u){x(s,e,u);for(let o=0;o<i.length;o+=1)i[o].m(e,null);n||(l=V(Je,"keydown",t[4]),n=!0)},p(s,[u]){if(u&7){r=s[2];let o;for(o=0;o<r.length;o+=1){const f=ge(s,r,o);i[o]?i[o].p(f,u):(i[o]=_e(f),i[o].c(),i[o].m(e,null))}for(;o<i.length;o+=1)i[o].d(1);i.length=r.length}u&12&&b(e,"!scale-y-100",s[2].length>0&&s[3])},i:M,o:M,d(s){s&&S(e),fe(i,s),n=!1,l()}}}function Ge(t,e,n){let{commands:l=qe}=e,{message:r=""}=e,{prefix:i="/"}=e,{max:s=3}=e,u=-1,o=[],f=!1;function a(c){return i+c}function g(c){return c.startsWith(i)?c.substring(1):c}function w(c){c.key!=="ArrowDown"&&c.key!=="ArrowUp"&&c.key!=="Tab"||(c.preventDefault(),c.key==="ArrowUp"&&o.length>1?n(1,u=Math.max(0,u-1)):c.key==="ArrowDown"&&o.length>1?n(1,u=Math.min(o.length-1,u+1)):c.key==="Tab"&&u>=0&&!(o[u].currentParam>-1)&&n(5,r=a(o[u].name)))}function y(c){if(!c)return;const d=c.split(" ");if(!d[0].startsWith(i)){n(2,o=[]);return}n(2,o=l.filter(h=>{var _,H;const E=g(d[0]);return E.length>0&&h.name.startsWith(E)&&d.length-1<=((H=(_=h.parameters)==null?void 0:_.length)!=null?H:0)}).splice(0,s).map(h=>{var H;let E=-1;const _=a(h.name);return d.length===1&&d[0]===_&&(E=0),d.length>1&&d.length-1<=((H=h.parameters.length)!=null?H:0)&&(E=d.length-1),{currentParam:E,...h}})),o.length===0?n(1,u=-1):n(1,u=0)}return ne(()=>{!window.alt||(window.alt.on("vchat:focus",c=>n(3,f=c)),window.alt.on("vhat:addSuggestion",c=>{n(6,l=[...l,c]),y(r)}),window.alt.on("vchat:addSuggestions",c=>{n(6,l=[...l,...c]),y(r)}))}),t.$$set=c=>{"commands"in c&&n(6,l=c.commands),"message"in c&&n(5,r=c.message),"prefix"in c&&n(0,i=c.prefix),"max"in c&&n(7,s=c.max)},t.$$.update=()=>{t.$$.dirty&32&&y(r)},[i,u,o,f,w,r,l,s]}class Qe extends O{constructor(e){super(),W(this,e,Ge,Ye,B,{commands:6,message:5,prefix:0,max:7})}}const{window:Re}=ue;function Xe(t){let e,n,l;return{c(){e=P("input"),m(e,"class","bg-black bg-opacity-50 text-base text-white px-[16px] py-[8px] focus:outline-none w-full"),m(e,"placeholder",t[1]),b(e,"invisible",!t[3]),b(e,"visible",t[3])},m(r,i){x(r,e,i),ae(e,t[0]),t[8](e),n||(l=[V(Re,"keydown",t[5]),V(e,"input",t[7]),V(e,"keydown",t[4]),V(e,"blur",t[9])],n=!0)},p(r,[i]){i&2&&m(e,"placeholder",r[1]),i&1&&e.value!==r[0]&&ae(e,r[0]),i&8&&b(e,"invisible",!r[3]),i&8&&b(e,"visible",r[3])},i:M,o:M,d(r){r&&S(e),t[8](null),n=!1,K(l)}}}function $e(t,e,n){let{placeholder:l="Type a message..."}=e,{message:r=""}=e,{prefix:i="/"}=e,s=[],u=-1,o,f=!1,a="";async function g(h){h.key==="Enter"&&(window.alt&&window.alt.emit("vchat:message",r),s.length>100&&s.shift(),s=[r,...s],u=-1,n(0,r=""),h.preventDefault())}function w(h){r&&r.startsWith(i)||s.length!==0&&(h.key==="ArrowDown"?(h.preventDefault(),u>0?n(0,r=s[--u]):u===0&&(u=-1,n(0,r=a))):h.key==="ArrowUp"&&(h.preventDefault(),u<0&&(a=r),u<s.length-1&&n(0,r=s[++u])))}ne(()=>{!window.alt||window.alt.on("vchat:focus",async h=>{n(3,f=h),h?(await se(),o&&o.focus()):u=-1})});function y(){r=this.value,n(0,r)}function c(h){z[h?"unshift":"push"](()=>{o=h,n(2,o)})}const d=()=>o.focus();return t.$$set=h=>{"placeholder"in h&&n(1,l=h.placeholder),"message"in h&&n(0,r=h.message),"prefix"in h&&n(6,i=h.prefix)},[r,l,o,f,g,w,i,y,c,d]}class et extends O{constructor(e){super(),W(this,e,$e,Xe,B,{placeholder:1,message:0,prefix:6})}}var k=(t=>(t[t.Default=0]="Default",t[t.Info=1]="Info",t[t.Success=2]="Success",t[t.Warning=3]="Warning",t[t.Error=4]="Error",t))(k||{});function tt(t){let e,n;return{c(){e=N("svg"),n=N("path"),m(n,"d","M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z"),m(n,"fill","currentColor"),m(n,"fill-rule","evenodd"),m(n,"clip-rule","evenodd"),m(e,"width","20"),m(e,"height","20"),m(e,"viewBox","0 0 15 15"),m(e,"fill","none"),m(e,"xmlns","http://www.w3.org/2000/svg")},m(l,r){x(l,e,r),v(e,n)},p:M,i:M,o:M,d(l){l&&S(e)}}}class nt extends O{constructor(e){super(),W(this,e,null,tt,B,{})}}function lt(t){let e,n;return{c(){e=N("svg"),n=N("path"),m(n,"d","M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"),m(n,"fill","currentColor"),m(n,"fill-rule","evenodd"),m(n,"clip-rule","evenodd"),m(e,"width","20"),m(e,"height","20"),m(e,"viewBox","0 0 15 15"),m(e,"fill","none"),m(e,"xmlns","http://www.w3.org/2000/svg")},m(l,r){x(l,e,r),v(e,n)},p:M,i:M,o:M,d(l){l&&S(e)}}}class rt extends O{constructor(e){super(),W(this,e,null,lt,B,{})}}function ot(t){let e,n;return{c(){e=N("svg"),n=N("path"),m(n,"d","M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"),m(n,"fill","currentColor"),m(n,"fill-rule","evenodd"),m(n,"clip-rule","evenodd"),m(e,"width","20"),m(e,"height","20"),m(e,"viewBox","0 0 15 15"),m(e,"fill","none"),m(e,"xmlns","http://www.w3.org/2000/svg")},m(l,r){x(l,e,r),v(e,n)},p:M,i:M,o:M,d(l){l&&S(e)}}}class st extends O{constructor(e){super(),W(this,e,null,ot,B,{})}}function it(t){let e,n;return{c(){e=N("svg"),n=N("path"),m(n,"d","M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9798 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02018 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98664 7.5 8.98664C7.2208 8.98664 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z"),m(n,"fill","currentColor"),m(n,"fill-rule","evenodd"),m(n,"clip-rule","evenodd"),m(e,"width","20"),m(e,"height","20"),m(e,"viewBox","0 0 15 15"),m(e,"fill","none"),m(e,"xmlns","http://www.w3.org/2000/svg")},m(l,r){x(l,e,r),v(e,n)},p:M,i:M,o:M,d(l){l&&S(e)}}}class ft extends O{constructor(e){super(),W(this,e,null,it,B,{})}}function we(t){let e,n;return e=new rt({}),{c(){U(e.$$.fragment)},m(l,r){Z(e,l,r),n=!0},i(l){n||(C(e.$$.fragment,l),n=!0)},o(l){L(e.$$.fragment,l),n=!1},d(l){A(e,l)}}}function be(t){let e,n;return e=new st({}),{c(){U(e.$$.fragment)},m(l,r){Z(e,l,r),n=!0},i(l){n||(C(e.$$.fragment,l),n=!0)},o(l){L(e.$$.fragment,l),n=!1},d(l){A(e,l)}}}function ye(t){let e,n;return e=new ft({}),{c(){U(e.$$.fragment)},m(l,r){Z(e,l,r),n=!0},i(l){n||(C(e.$$.fragment,l),n=!0)},o(l){L(e.$$.fragment,l),n=!1},d(l){A(e,l)}}}function Ce(t){let e,n;return e=new nt({}),{c(){U(e.$$.fragment)},m(l,r){Z(e,l,r),n=!0},i(l){n||(C(e.$$.fragment,l),n=!0)},o(l){L(e.$$.fragment,l),n=!1},d(l){A(e,l)}}}function ut(t){let e,n,l,r,i,s,u,o=t[0]===k.Info&&we(),f=t[0]===k.Success&&be(),a=t[0]===k.Warning&&ye(),g=t[0]===k.Error&&Ce();const w=t[2].default,y=Ne(w,t,t[1],null);return{c(){e=P("div"),o&&o.c(),n=I(),f&&f.c(),l=I(),a&&a.c(),r=I(),g&&g.c(),i=I(),s=P("div"),y&&y.c(),m(e,"class","flex flex-row items-center gap-[8px] text-white text-base select-none fade-in px-[8px] svelte-wffzt"),b(e,"py-[4px]",t[0]!==k.Default),b(e,"info",t[0]===k.Info),b(e,"success",t[0]===k.Success),b(e,"warning",t[0]===k.Warning),b(e,"error",t[0]===k.Error)},m(c,d){x(c,e,d),o&&o.m(e,null),v(e,n),f&&f.m(e,null),v(e,l),a&&a.m(e,null),v(e,r),g&&g.m(e,null),v(e,i),v(e,s),y&&y.m(s,null),u=!0},p(c,[d]){c[0]===k.Info?o?d&1&&C(o,1):(o=we(),o.c(),C(o,1),o.m(e,n)):o&&(J(),L(o,1,1,()=>{o=null}),Y()),c[0]===k.Success?f?d&1&&C(f,1):(f=be(),f.c(),C(f,1),f.m(e,l)):f&&(J(),L(f,1,1,()=>{f=null}),Y()),c[0]===k.Warning?a?d&1&&C(a,1):(a=ye(),a.c(),C(a,1),a.m(e,r)):a&&(J(),L(a,1,1,()=>{a=null}),Y()),c[0]===k.Error?g?d&1&&C(g,1):(g=Ce(),g.c(),C(g,1),g.m(e,i)):g&&(J(),L(g,1,1,()=>{g=null}),Y()),y&&y.p&&(!u||d&2)&&We(y,w,c,c[1],u?Be(w,c[1],d,null):Oe(c[1]),null),d&1&&b(e,"py-[4px]",c[0]!==k.Default),d&1&&b(e,"info",c[0]===k.Info),d&1&&b(e,"success",c[0]===k.Success),d&1&&b(e,"warning",c[0]===k.Warning),d&1&&b(e,"error",c[0]===k.Error)},i(c){u||(C(o),C(f),C(a),C(g),C(y,c),u=!0)},o(c){L(o),L(f),L(a),L(g),L(y,c),u=!1},d(c){c&&S(e),o&&o.d(),f&&f.d(),a&&a.d(),g&&g.d(),y&&y.d(c)}}}function ct(t,e,n){let{$$slots:l={},$$scope:r}=e,{type:i=k.Default}=e;return t.$$set=s=>{"type"in s&&n(0,i=s.type),"$$scope"in s&&n(1,r=s.$$scope)},[i,r,l]}class at extends O{constructor(e){super(),W(this,e,ct,ut,B,{type:0})}}const{window:ve}=ue;function ke(t,e,n){const l=t.slice();return l[19]=e[n],l}function ht(t){let e,n=t[19].content+"",l;return{c(){e=new Ve(!1),l=Te(),e.a=l},m(r,i){e.m(n,r,i),x(r,l,i)},p(r,i){i&1&&n!==(n=r[19].content+"")&&e.p(n)},d(r){r&&S(l),r&&e.d()}}}function He(t){let e,n;return e=new at({props:{type:t[19].type,$$slots:{default:[ht]},$$scope:{ctx:t}}}),{c(){U(e.$$.fragment)},m(l,r){Z(e,l,r),n=!0},p(l,r){const i={};r&1&&(i.type=l[19].type),r&4194305&&(i.$$scope={dirty:r,ctx:l}),e.$set(i)},i(l){n||(C(e.$$.fragment,l),n=!0)},o(l){L(e.$$.fragment,l),n=!1},d(l){A(e,l)}}}function mt(t){let e,n,l,r,i=t[0],s=[];for(let o=0;o<i.length;o+=1)s[o]=He(ke(t,i,o));const u=o=>L(s[o],1,1,()=>{s[o]=null});return{c(){var o,f;e=P("div");for(let a=0;a<s.length;a+=1)s[a].c();m(e,"class","flex flex-col gap-[4px] h-[320px] w-full mask mb-[16px] pr-2 svelte-1capi9f"),b(e,"opacity-50",!t[2]),b(e,"opacity-100",t[2]),b(e,"overflow-y-scroll",t[2]&&((o=t[1])==null?void 0:o.scrollHeight)>((f=t[1])==null?void 0:f.clientHeight)),b(e,"overflow-y-hidden",!t[2]),R(e,"--mask-top-height",t[4],!1),R(e,"--mask-bottom-height",t[3],!1)},m(o,f){x(o,e,f);for(let a=0;a<s.length;a+=1)s[a].m(e,null);t[10](e),n=!0,l||(r=[V(ve,"keydown",t[5]),V(ve,"mousewheel",je(t[6]),{passive:!1})],l=!0)},p(o,[f]){var a,g;if(f&1){i=o[0];let w;for(w=0;w<i.length;w+=1){const y=ke(o,i,w);s[w]?(s[w].p(y,f),C(s[w],1)):(s[w]=He(y),s[w].c(),C(s[w],1),s[w].m(e,null))}for(J(),w=i.length;w<s.length;w+=1)u(w);Y()}f&4&&b(e,"opacity-50",!o[2]),f&4&&b(e,"opacity-100",o[2]),f&6&&b(e,"overflow-y-scroll",o[2]&&((a=o[1])==null?void 0:a.scrollHeight)>((g=o[1])==null?void 0:g.clientHeight)),f&4&&b(e,"overflow-y-hidden",!o[2]),f&16&&R(e,"--mask-top-height",o[4],!1),f&8&&R(e,"--mask-bottom-height",o[3],!1)},i(o){if(!n){for(let f=0;f<i.length;f+=1)C(s[f]);n=!0}},o(o){s=s.filter(Boolean);for(let f=0;f<s.length;f+=1)L(s[f]);n=!1},d(o){o&&S(e),fe(s,o),t[10](null),l=!1,K(r)}}}function gt(t,e,n){let l,r,{scrollStep:i=20}=e,s=[],u,o=!1,f=0,a=0;async function g(p,xe=k.Default){n(0,s=[...s,{content:p,type:xe}]),await se(),u&&n(8,f=u.scrollHeight-u.clientHeight),(!o||o&&a===f)&&h()}async function w(p){n(0,s=p),await se(),u&&n(8,f=u.scrollHeight-u.clientHeight),(!o||o&&a===f)&&h("auto")}function y(){w([])}function c(p){n(2,o=p),p||h()}function d(p="smooth"){n(9,a=0),u&&u.scrollTo({top:0,behavior:p})}function h(p="smooth"){n(9,a=f),u&&u.scroll({top:f,behavior:p})}function E(){const p=a-i;n(9,a=p<0?0:p),n(1,u.scrollTop=p,u)}function _(){const p=a+i;n(9,a=p>f?f:p),n(1,u.scrollTop=p,u)}function H(p){!o||(p.key==="PageUp"?(p.preventDefault(),E()):p.key==="PageDown"?(p.preventDefault(),_()):p.key==="Home"?(p.preventDefault(),d()):p.key==="End"&&(p.preventDefault(),h()))}async function T(p){!o||(p.deltaY>0?_():E())}ne(()=>{n(8,f=u.scrollHeight-u.clientHeight),h("auto"),window.alt&&(window.alt.on("vchat:loadHistory",w),window.alt.on("vchat:message",g),window.alt.on("vchat:focus",c),window.alt.on("chat:clear",y))});function D(p){z[p?"unshift":"push"](()=>{u=p,n(1,u)})}return t.$$set=p=>{"scrollStep"in p&&n(7,i=p.scrollStep)},t.$$.update=()=>{t.$$.dirty&768&&n(4,l=a===0?"0px":`${Math.floor(64*a/f)}px`),t.$$.dirty&768&&n(3,r=a===f?"0px":`${Math.floor(64*(f-a)/f)}px`)},[s,u,o,r,l,H,T,i,f,a,D]}class dt extends O{constructor(e){super(),W(this,e,gt,mt,B,{scrollStep:7})}}function pt(t){let e,n,l,r,i,s,u,o,f;n=new dt({});function a(c){t[1](c)}let g={prefix:Le};t[0]!==void 0&&(g.message=t[0]),r=new et({props:g}),z.push(()=>me(r,"message",a));function w(c){t[2](c)}let y={max:_t,prefix:Le};return t[0]!==void 0&&(y.message=t[0]),u=new Qe({props:y}),z.push(()=>me(u,"message",w)),{c(){e=P("div"),U(n.$$.fragment),l=I(),U(r.$$.fragment),s=I(),U(u.$$.fragment),m(e,"class","fixed top-[16px] left-[16px] w-[640px]")},m(c,d){x(c,e,d),Z(n,e,null),v(e,l),Z(r,e,null),v(e,s),Z(u,e,null),f=!0},p(c,[d]){const h={};!i&&d&1&&(i=!0,h.message=c[0],he(()=>i=!1)),r.$set(h);const E={};!o&&d&1&&(o=!0,E.message=c[0],he(()=>o=!1)),u.$set(E)},i(c){f||(C(n.$$.fragment,c),C(r.$$.fragment,c),C(u.$$.fragment,c),f=!0)},o(c){L(n.$$.fragment,c),L(r.$$.fragment,c),L(u.$$.fragment,c),f=!1},d(c){c&&S(e),A(n),A(r),A(u)}}}const Le="/",_t=3;function wt(t,e,n){let l="";ne(()=>{!window.alt||window.alt.emit("vchat:mounted")});function r(s){l=s,n(0,l)}function i(s){l=s,n(0,l)}return[l,r,i]}class bt extends O{constructor(e){super(),W(this,e,wt,pt,B,{})}}new bt({target:document.getElementById("app")});
