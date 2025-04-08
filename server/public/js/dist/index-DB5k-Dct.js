import{i as o,b as t,f as r,r as e,x as a}from"./bundle.js";import{n as i,c as s,o as n}from"./if-defined-yLNCJnJO.js";var l=o`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`,c=window&&window.__decorate||function(o,t,r,e){var a,i=arguments.length,s=i<3?t:null===e?e=Object.getOwnPropertyDescriptor(t,r):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(o,t,r,e);else for(var n=o.length-1;n>=0;n--)(a=o[n])&&(s=(i<3?a(s):i>3?a(t,r,s):a(t,r))||s);return i>3&&s&&Object.defineProperty(t,r,s),s};let d=class extends e{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return a`
      <button ?disabled=${this.disabled} tabindex=${n(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};d.styles=[t,r,l],c([i()],d.prototype,"tabIdx",void 0),c([i({type:Boolean})],d.prototype,"disabled",void 0),c([i()],d.prototype,"color",void 0),d=c([s("wui-link")],d);
//# sourceMappingURL=index-DB5k-Dct.js.map
