import{A as e,j as t,e as o,R as r,C as i,S as a,d as n,n as l,i as s,b as c,r as d,x as u,f as g}from"./bundle.js";import{n as p,c as f,o as w}from"./if-defined-yLNCJnJO.js";async function h(o){r.push("ConnectingSocial");const s=i.getAuthConnector();let c=null;try{const r=setTimeout((()=>{throw new Error("Social login timed out. Please try again.")}),45e3);if(s&&o){if(n.isTelegram()||(c=function(){try{return n.returnOpenHref("","popupWindow","width=600,height=800,scrollbars=yes")}catch(e){throw new Error("Could not open social popup")}}()),c)e.setSocialWindow(c,t.state.activeChain);else if(!n.isTelegram())throw new Error("Could not create social popup");const{uri:i}=await s.provider.getSocialRedirectUri({provider:o});if(!i)throw c?.close(),new Error("Could not fetch the social redirect uri");if(c&&(c.location.href=i),n.isTelegram()){l.setTelegramSocialProvider(o);const e=n.formatTelegramSocialLoginUrl(i);n.openHref(e,"_top")}clearTimeout(r)}}catch(e){c?.close(),a.showError(e?.message)}}async function v(n){e.setSocialProvider(n,t.state.activeChain),o.sendEvent({type:"track",event:"SOCIAL_LOGIN_STARTED",properties:{provider:n}}),"farcaster"===n?await async function(){r.push("ConnectingFarcaster");const o=i.getAuthConnector();if(o&&!e.state.farcasterUrl)try{const{url:r}=await o.provider.getFarcasterUri();e.setFarcasterUrl(r,t.state.activeChain)}catch(e){r.goBack(),a.showError(e)}}():await h(n)}var y=s`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`,b=window&&window.__decorate||function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var l=e.length-1;l>=0;l--)(i=e[l])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let x=class extends d{constructor(){super(...arguments),this.logo="google"}render(){return u`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};x.styles=[c,y],b([p()],x.prototype,"logo",void 0),x=b([f("wui-logo")],x);var m=s`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    justify-content: flex-start;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-text[data-align='left'] {
    display: flex;
    flex: 1;
  }

  wui-text[data-align='center'] {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  .invisible {
    opacity: 0;
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`,C=window&&window.__decorate||function(e,t,o,r){var i,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,o,r);else for(var l=e.length-1;l>=0;l--)(i=e[l])&&(n=(a<3?i(n):a>3?i(t,o,n):i(t,o))||n);return a>3&&n&&Object.defineProperty(t,o,n),n};let j=class extends d{constructor(){super(...arguments),this.logo="google",this.name="Continue with google",this.align="left",this.disabled=!1}render(){return u`
      <button ?disabled=${this.disabled} tabindex=${w(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
        <wui-text
          data-align=${this.align}
          variant="paragraph-500"
          color="inherit"
          align=${this.align}
          >${this.name}</wui-text
        >
        ${this.templatePlacement()}
      </button>
    `}templatePlacement(){return"center"===this.align?u` <wui-logo class="invisible" logo=${this.logo}></wui-logo>`:null}};j.styles=[c,g,m],C([p()],j.prototype,"logo",void 0),C([p()],j.prototype,"name",void 0),C([p()],j.prototype,"align",void 0),C([p()],j.prototype,"tabIdx",void 0),C([p({type:Boolean})],j.prototype,"disabled",void 0),j=C([f("wui-list-social")],j);export{v as e};
//# sourceMappingURL=index-CnAx4xtl.js.map
