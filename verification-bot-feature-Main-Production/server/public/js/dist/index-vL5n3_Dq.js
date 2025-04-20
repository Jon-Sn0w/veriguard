import{i as o,b as r,f as t,F as i,r as e,x as a}from"./bundle.js";import{n as s,c as n}from"./if-defined-yLNCJnJO.js";var c=o`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`,d=window&&window.__decorate||function(o,r,t,i){var e,a=arguments.length,s=a<3?r:null===i?i=Object.getOwnPropertyDescriptor(r,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(o,r,t,i);else for(var n=o.length-1;n>=0;n--)(e=o[n])&&(s=(a<3?e(s):a>3?e(r,t,s):e(r,t))||s);return a>3&&s&&Object.defineProperty(r,t,s),s};let l=class extends e{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){const o="lg"===this.size?"--wui-border-radius-xs":"--wui-border-radius-xxs",r="lg"===this.size?"--wui-spacing-1xs":"--wui-spacing-2xs";return this.style.cssText=`\n    --local-border-radius: var(${o});\n    --local-padding: var(${r});\n`,a`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};l.styles=[r,t,i,c],d([s()],l.prototype,"size",void 0),d([s({type:Boolean})],l.prototype,"disabled",void 0),d([s()],l.prototype,"icon",void 0),d([s()],l.prototype,"iconColor",void 0),l=d([n("wui-icon-link")],l);var u=o`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`,p=window&&window.__decorate||function(o,r,t,i){var e,a=arguments.length,s=a<3?r:null===i?i=Object.getOwnPropertyDescriptor(r,t):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(o,r,t,i);else for(var n=o.length-1;n>=0;n--)(e=o[n])&&(s=(a<3?e(s):a>3?e(r,t,s):e(r,t))||s);return a>3&&s&&Object.defineProperty(r,t,s),s};let v=class extends e{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;const o="md"===this.size?"mini-700":"micro-700";return a`
      <wui-text data-variant=${this.variant} variant=${o} color="inherit">
        <slot></slot>
      </wui-text>
    `}};v.styles=[r,u],p([s()],v.prototype,"variant",void 0),p([s()],v.prototype,"size",void 0),v=p([n("wui-tag")],v);
//# sourceMappingURL=index-vL5n3_Dq.js.map
