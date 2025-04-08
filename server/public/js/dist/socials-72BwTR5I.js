import{i as e,r as i,C as t,O as o,R as r,a,x as s,A as n,m as c,j as l,e as d,n as u,k as h,S as p,M as w,T as g,d as m}from"./bundle.js";import{n as f,r as v,c as x,o as b}from"./if-defined-yLNCJnJO.js";import"./index-ByyQhA-G.js";import{e as y}from"./index-CnAx4xtl.js";import"./index-BYuvcniW.js";import"./index-DAFiFOtU.js";import"./index-DB5k-Dct.js";import"./index-D4Burr6A.js";import"./index-CIpWLpox.js";import"./index-Ckd861mn.js";import"./index-D9KSP8X3.js";var C=e`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`,k=window&&window.__decorate||function(e,i,t,o){var r,a=arguments.length,s=a<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,t):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,i,t,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(i,t,s):r(i,t))||s);return a>3&&s&&Object.defineProperty(i,t,s),s};let P=class extends i{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=t.state.connectors,this.authConnector=this.connectors.find((e=>"AUTH"===e.type)),this.features=o.state.features,this.unsubscribe.push(t.subscribeKey("connectors",(e=>{this.connectors=e,this.authConnector=this.connectors.find((e=>"AUTH"===e.type))})),o.subscribeKey("features",(e=>this.features=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){let e=this.features?.socials||[];const i=Boolean(this.authConnector),t=e?.length,o="ConnectSocials"===r.state.view;return i&&t||o?(o&&!t&&(e=a.DEFAULT_FEATURES.socials),s` <wui-flex flexDirection="column" gap="xs">
      ${e.map((e=>s`<wui-list-social
            @click=${()=>{this.onSocialClick(e)}}
            name=${e}
            logo=${e}
            tabIdx=${b(this.tabIdx)}
          ></wui-list-social>`))}
    </wui-flex>`):null}async onSocialClick(e){e&&await y(e)}};P.styles=C,k([f()],P.prototype,"tabIdx",void 0),k([v()],P.prototype,"connectors",void 0),k([v()],P.prototype,"authConnector",void 0),k([v()],P.prototype,"features",void 0),P=k([x("w3m-social-login-list")],P);var S=e`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`,$=window&&window.__decorate||function(e,i,t,o){var r,a=arguments.length,s=a<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,t):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,i,t,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(i,t,s):r(i,t))||s);return a>3&&s&&Object.defineProperty(i,t,s),s};let E=class extends i{constructor(){super(...arguments),this.checked=!1}render(){const{termsConditionsUrl:e,privacyPolicyUrl:i}=o.state,t=o.state.features?.legalCheckbox,r=Boolean(e||i)&&Boolean(t),a=r&&!this.checked,n=a?-1:void 0;return s`
      <w3m-legal-checkbox @checkboxChange=${this.onCheckboxChange.bind(this)}></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${r?["0","s","s","s"]:"s"}
        gap="xs"
        class=${b(a?"disabled":void 0)}
      >
        <w3m-social-login-list tabIdx=${b(n)}></w3m-social-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}onCheckboxChange(e){this.checked=Boolean(e.detail)}};E.styles=S,$([v()],E.prototype,"checked",void 0),E=$([x("w3m-connect-socials-view")],E);var I=e`
  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: var(--wui-border-radius-m);
  }
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }
  wui-flex:first-child:not(:only-child) {
    position: relative;
  }
  wui-loading-thumbnail {
    position: absolute;
  }
  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }
  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }
  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }
  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  .capitalize {
    text-transform: capitalize;
  }
`,O=window&&window.__decorate||function(e,i,t,o){var r,a=arguments.length,s=a<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,t):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,i,t,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(i,t,s):r(i,t))||s);return a>3&&s&&Object.defineProperty(i,t,s),s};let R=class extends i{constructor(){super(),this.unsubscribe=[],this.socialProvider=n.state.socialProvider,this.socialWindow=n.state.socialWindow,this.error=!1,this.connecting=!1,this.message="Connect in the provider window",this.authConnector=t.getAuthConnector(),this.handleSocialConnection=async e=>{if(e.data?.resultUri)if(e.origin===c.SECURE_SITE_ORIGIN){window.removeEventListener("message",this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.socialWindow&&(this.socialWindow.close(),n.setSocialWindow(void 0,l.state.activeChain)),this.connecting=!0,this.updateMessage();const i=e.data.resultUri;this.socialProvider&&d.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}}),await this.authConnector.provider.connectSocial(i),this.socialProvider&&(u.setConnectedSocialProvider(this.socialProvider),await h.connectExternal(this.authConnector,this.authConnector.chain),d.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}))}}catch(e){this.error=!0,this.updateMessage(),this.socialProvider&&d.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}})}}else r.goBack(),p.showError("Untrusted Origin"),this.socialProvider&&d.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}})},this.unsubscribe.push(n.subscribe((e=>{e.socialProvider&&(this.socialProvider=e.socialProvider),e.socialWindow&&(this.socialWindow=e.socialWindow),e.address&&(w.state.open||o.state.enableEmbedded)&&w.close()}))),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),window.removeEventListener("message",this.handleSocialConnection,!1),this.socialWindow?.close(),n.setSocialWindow(void 0,l.state.activeChain)}render(){return s`
      <wui-flex
        data-error=${b(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${b(this.socialProvider)}></wui-logo>
          ${this.error?null:this.loaderTemplate()}
          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100"
            >Log in with
            <span class="capitalize">${this.socialProvider??"Social"}</span></wui-text
          >
          <wui-text align="center" variant="small-400" color=${this.error?"error-100":"fg-200"}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `}loaderTemplate(){const e=g.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return s`<wui-loading-thumbnail radius=${9*i}></wui-loading-thumbnail>`}connectSocial(){const e=setInterval((()=>{this.socialWindow?.closed&&(this.connecting||"ConnectingSocial"!==r.state.view||(this.socialProvider&&d.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}}),r.goBack()),clearInterval(e))}),1e3);window.addEventListener("message",this.handleSocialConnection,!1)}updateMessage(){this.error?this.message="Something went wrong":this.connecting?this.message="Retrieving user data":this.message="Connect in the provider window"}};R.styles=I,O([v()],R.prototype,"socialProvider",void 0),O([v()],R.prototype,"socialWindow",void 0),O([v()],R.prototype,"error",void 0),O([v()],R.prototype,"connecting",void 0),O([v()],R.prototype,"message",void 0),R=O([x("w3m-connecting-social-view")],R);var T=e`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }

  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: var(--wui-border-radius-m);
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }
  wui-loading-thumbnail {
    position: absolute;
  }
  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }
`,_=window&&window.__decorate||function(e,i,t,o){var r,a=arguments.length,s=a<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,t):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,i,t,o);else for(var n=e.length-1;n>=0;n--)(r=e[n])&&(s=(a<3?r(s):a>3?r(i,t,s):r(i,t))||s);return a>3&&s&&Object.defineProperty(i,t,s),s};let L=class extends i{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=n.state.socialProvider,this.uri=n.state.farcasterUrl,this.ready=!1,this.loading=!1,this.authConnector=t.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(n.subscribeKey("farcasterUrl",(e=>{e&&(this.uri=e,this.connectFarcaster())})),n.subscribeKey("socialProvider",(e=>{e&&(this.socialProvider=e)}))),window.addEventListener("resize",this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),s`${this.platformTemplate()}`}platformTemplate(){return m.isMobile()?s`${this.mobileTemplate()}`:s`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?s`${this.loadingTemplate()}`:s`${this.qrTemplate()}`}qrTemplate(){return s` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["0","xl","xl","xl"]}
      gap="xl"
    >
      <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="paragraph-500" color="fg-100">
        Scan this QR Code with your phone
      </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`}loadingTemplate(){return s`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo="farcaster"></wui-logo>
          ${this.loaderTemplate()}
          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            Loading user data
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            Please wait a moment while we load your data.
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}mobileTemplate(){return s` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["3xl","xl","xl","xl"]}
      gap="xl"
    >
      <wui-flex justifyContent="center" alignItems="center">
        <wui-logo logo="farcaster"></wui-logo>
        ${this.loaderTemplate()}
        <wui-icon-box
          backgroundColor="error-100"
          background="opaque"
          iconColor="error-100"
          icon="close"
          size="sm"
          border
          borderColor="wui-color-bg-125"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >Continue in Farcaster</span></wui-text
        >
        <wui-text align="center" variant="small-400" color="fg-200"
          >Accept connection request in the app</wui-text
        ></wui-flex
      >
      ${this.mobileLinkTemplate()}
    </wui-flex>`}loaderTemplate(){const e=g.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return s`<wui-loading-thumbnail radius=${9*i}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await(this.authConnector?.provider.connectFarcaster()),this.socialProvider&&(u.setConnectedSocialProvider(this.socialProvider),d.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}})),this.loading=!0,await h.connectExternal(this.authConnector,this.authConnector.chain),this.socialProvider&&d.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}),this.loading=!1,w.close()}catch(e){this.socialProvider&&d.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}}),r.goBack(),p.showError(e)}}mobileLinkTemplate(){return s`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&m.openHref(this.uri,"_blank")}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout((()=>{this.ready=!0}),200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const e=this.getBoundingClientRect().width-40;return s` <wui-qr-code
      size=${e}
      theme=${g.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${b(g.state.themeVariables["--w3m-qr-color"])}
    ></wui-qr-code>`}copyTemplate(){const e=!this.uri||!this.ready;return s`<wui-link
      .disabled=${e}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}onCopyUri(){try{this.uri&&(m.copyToClopboard(this.uri),p.showSuccess("Link copied"))}catch{p.showError("Failed to copy")}}};L.styles=T,_([v()],L.prototype,"socialProvider",void 0),_([v()],L.prototype,"uri",void 0),_([v()],L.prototype,"ready",void 0),_([v()],L.prototype,"loading",void 0),L=_([x("w3m-connecting-farcaster-view")],L);export{E as W3mConnectSocialsView,L as W3mConnectingFarcasterView,R as W3mConnectingSocialView};
//# sourceMappingURL=socials-72BwTR5I.js.map
