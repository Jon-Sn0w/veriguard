import{i as e,b as t,r as i,x as r}from"./bundle.js";import{n as o,c as a,o as s}from"./if-defined-yLNCJnJO.js";import"./index-DCqi0O7E.js";var l=e`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`,n=window&&window.__decorate||function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(o=e[l])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let d=class extends i{constructor(){super(...arguments),this.disabled=!1}render(){return r`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="mdl"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${s(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?r`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};d.styles=[t,l],n([o()],d.prototype,"errorMessage",void 0),n([o({type:Boolean})],d.prototype,"disabled",void 0),n([o()],d.prototype,"value",void 0),n([o()],d.prototype,"tabIdx",void 0),d=n([a("wui-email-input")],d);
//# sourceMappingURL=index-DeTvlsr3.js.map
