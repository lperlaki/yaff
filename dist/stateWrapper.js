!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function r(t,...e){const n=document.createElement("template");n.innerHTML=t.join("<store-wrapper>");const r=document.importNode(n.content,!0);return r.querySelectorAll("store-wrapper").forEach((t,n)=>{t.state=e[n]}),r}n.r(e),window&&(window.html=function(t,...e){return document.createElement("template").innerHTML=t.map((t,n)=>`${t}${e[n]||""}`).join(""),temo.content},window.h=r),n.d(e,"StateWrapper",function(){return o}),n.d(e,"define",function(){return i}),n.d(e,"h",function(){return r});class o extends HTMLElement{connectedCallback(){this.watch()}disconnectedCallback(){this.watcher&&this.watcher()}set state(t){store in t?(this.stateref=t,this.watch()):this.update(t)}get state(){return this.stateref}get value(){return this.ref}update(t){this.ref=t,this.innerHTML=this.value}watch(){this.state&&(this.watcher=this.state.watch(t=>this.update(t)))}constructor(t=""){super(),this.state=t}}function i(){window.customElements.get("state-wrapper")||window.customElements.define("state-wrapper",o)}window&&(window.StateWrapper=o,window.h=h,i())}]);