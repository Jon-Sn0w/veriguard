import{i as r,r as o,x as i}from"./bundle.js";import{n as e,c as t}from"./if-defined-yLNCJnJO.js";var a=r`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`,c=window&&window.__decorate||function(r,o,i,e){var t,a=arguments.length,c=a<3?o:null===e?e=Object.getOwnPropertyDescriptor(o,i):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(r,o,i,e);else for(var s=r.length-1;s>=0;s--)(t=r[s])&&(c=(a<3?t(c):a>3?t(o,i,c):t(o,i))||c);return a>3&&c&&Object.defineProperty(o,i,c),c};let s=class extends o{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`\n      width: ${this.width};\n      height: ${this.height};\n      border-radius: clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px);\n    `,i`<slot></slot>`}};s.styles=[a],c([e()],s.prototype,"width",void 0),c([e()],s.prototype,"height",void 0),c([e()],s.prototype,"borderRadius",void 0),c([e()],s.prototype,"variant",void 0),s=c([t("wui-shimmer")],s);
//# sourceMappingURL=index-CIpWLpox.js.map
