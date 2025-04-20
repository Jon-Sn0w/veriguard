import{i as t,b as e,f as r,r as o,x as i}from"./bundle.js";import{n as a,c as s}from"./if-defined-yLNCJnJO.js";import"./index-D9KSP8X3.js";import"./index-BYuvcniW.js";var n=t`
  :host {
    display: block;
  }

  :host > button {
    gap: var(--wui-spacing-xxs);
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-1xs);
    height: 40px;
    border-radius: var(--wui-border-radius-l);
    background: var(--wui-color-gray-glass-002);
    border-width: 0px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
  }

  :host > button wui-image {
    width: 24px;
    height: 24px;
    border-radius: var(--wui-border-radius-s);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }
`,c=window&&window.__decorate||function(t,e,r,o){var i,a=arguments.length,s=a<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,r,o);else for(var n=t.length-1;n>=0;n--)(i=t[n])&&(s=(a<3?i(s):a>3?i(e,r,s):i(e,r))||s);return a>3&&s&&Object.defineProperty(e,r,s),s};let d=class extends o{constructor(){super(...arguments),this.text=""}render(){return i`
      <button>
        ${this.tokenTemplate()}
        <wui-text variant="paragraph-600" color="fg-100">${this.text}</wui-text>
      </button>
    `}tokenTemplate(){return this.imageSrc?i`<wui-image src=${this.imageSrc}></wui-image>`:i`
      <wui-icon-box
        size="sm"
        iconColor="fg-200"
        backgroundColor="fg-300"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};d.styles=[e,r,n],c([a()],d.prototype,"imageSrc",void 0),c([a()],d.prototype,"text",void 0),d=c([s("wui-token-button")],d);
//# sourceMappingURL=index-L45GYZLV.js.map
