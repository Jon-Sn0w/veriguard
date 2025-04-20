import{i as o,b as r,f as i,r as e,x as t}from"./bundle.js";import{n as c,c as s}from"./if-defined-yLNCJnJO.js";var n=o`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`,l=window&&window.__decorate||function(o,r,i,e){var t,c=arguments.length,s=c<3?r:null===e?e=Object.getOwnPropertyDescriptor(r,i):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(o,r,i,e);else for(var n=o.length-1;n>=0;n--)(t=o[n])&&(s=(c<3?t(s):c>3?t(r,i,s):t(r,i))||s);return c>3&&s&&Object.defineProperty(r,i,s),s};let a=class extends e{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const o=this.iconSize||this.size,r="lg"===this.size,i="xl"===this.size,e=r?"12%":"16%",c=r?"xxs":i?"s":"3xl",s="gray"===this.background,n="opaque"===this.background,l="accent-100"===this.backgroundColor&&n||"success-100"===this.backgroundColor&&n||"error-100"===this.backgroundColor&&n||"inverse-100"===this.backgroundColor&&n;let a=`var(--wui-color-${this.backgroundColor})`;return l?a=`var(--wui-icon-box-bg-${this.backgroundColor})`:s&&(a=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`\n       --local-bg-value: ${a};\n       --local-bg-mix: ${l||s?"100%":e};\n       --local-border-radius: var(--wui-border-radius-${c});\n       --local-size: var(--wui-icon-box-size-${this.size});\n       --local-border: ${"wui-color-bg-125"===this.borderColor?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}\n   `,t` <wui-icon color=${this.iconColor} size=${o} name=${this.icon}></wui-icon> `}};a.styles=[r,i,n],l([c()],a.prototype,"size",void 0),l([c()],a.prototype,"backgroundColor",void 0),l([c()],a.prototype,"iconColor",void 0),l([c()],a.prototype,"iconSize",void 0),l([c()],a.prototype,"background",void 0),l([c({type:Boolean})],a.prototype,"border",void 0),l([c()],a.prototype,"borderColor",void 0),l([c()],a.prototype,"icon",void 0),a=l([s("wui-icon-box")],a);
//# sourceMappingURL=index-BYuvcniW.js.map
