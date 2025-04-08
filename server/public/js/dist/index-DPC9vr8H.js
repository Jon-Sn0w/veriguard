import{i as e,b as t,f as i,r as o,x as r,j as a,q as n,O as s,D as l,A as c,d,M as u,e as p,n as w,C as h,c as g,R as f,a as b,S as m,W as v,k as x,p as y,m as k,B as C,F as $,G as S,u as T,H as R,I,l as O,T as A,J as E}from"./bundle.js";import{n as N,c as j,o as _,U as P,r as D,e as U}from"./if-defined-yLNCJnJO.js";import"./index-D9KSP8X3.js";import"./index-Ckd861mn.js";import"./index-qThkY_0B.js";import"./index-BYuvcniW.js";export{W as W3mRouter}from"./index-DeVXELIx.js";import"./index-vL5n3_Dq.js";import"./index-DtcmM8RX.js";import{e as L,n as z}from"./index-DAFiFOtU.js";import"./index-Di0_PZl8.js";import"./index-DB5k-Dct.js";import{M as B}from"./index-CJadyKTV.js";import"./index-D90hOOI2.js";import"./index-DCqi0O7E.js";import"./index-CIpWLpox.js";import"./index-DeTvlsr3.js";import"./index-ByyQhA-G.js";import{e as M}from"./index-CnAx4xtl.js";import{N as V}from"./index-BhxjpPFp.js";import"./index-CladwI1f.js";import"./index-D4Burr6A.js";import"./index-C_pryA1E.js";var H=e`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    background: var(--wui-color-gray-glass-002);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-3xs) var(--wui-spacing-xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  button:disabled {
    background: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-image,
  button:disabled > wui-flex > wui-avatar {
    filter: grayscale(1);
  }

  button:has(wui-image) {
    padding: var(--wui-spacing-3xs) var(--wui-spacing-3xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
  }

  wui-text {
    color: var(--wui-color-fg-100);
  }

  wui-flex > wui-text {
    color: var(--wui-color-fg-200);
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  wui-flex {
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    background: var(--wui-color-gray-glass-005);
    padding: 4px var(--wui-spacing-m) 4px var(--wui-spacing-xxs);
  }

  button.local-no-balance {
    border-radius: 0px;
    border: none;
    background: transparent;
  }

  wui-avatar {
    width: 20px;
    height: 20px;
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-010);
  }

  @media (max-width: 500px) {
    button {
      gap: 0px;
      padding: var(--wui-spacing-3xs) var(--wui-spacing-xs) !important;
      height: 32px;
    }
    wui-image,
    wui-icon-box,
    button > wui-text {
      visibility: hidden;
      width: 0px;
      height: 0px;
    }
    button {
      border-radius: 0px;
      border: none;
      background: transparent;
      padding: 0px;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }

    button:active:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }
  }
`,K=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let q=class extends o{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address="",this.profileName="",this.charsStart=4,this.charsEnd=6}render(){return r`
      <button
        ?disabled=${this.disabled}
        class=${_(this.balance?void 0:"local-no-balance")}
      >
        ${this.balanceTemplate()}
        <wui-flex gap="xxs" alignItems="center">
          <wui-avatar
            .imageSrc=${this.avatarSrc}
            alt=${this.address}
            address=${this.address}
          ></wui-avatar>
          <wui-text variant="paragraph-600" color="inherit">
            ${this.address?P.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"}):null}
          </wui-text>
        </wui-flex>
      </button>
    `}balanceTemplate(){if(this.isUnsupportedChain)return r` <wui-icon-box
          size="sm"
          iconColor="error-100"
          backgroundColor="error-100"
          icon="warningCircle"
        ></wui-icon-box>
        <wui-text variant="paragraph-600" color="inherit"> Switch Network</wui-text>`;if(this.balance){const e=this.networkSrc?r`<wui-image src=${this.networkSrc}></wui-image>`:r`
            <wui-icon-box
              size="sm"
              iconColor="fg-200"
              backgroundColor="fg-300"
              icon="networkPlaceholder"
            ></wui-icon-box>
          `,t=this.loading?r`<wui-loading-spinner size="md" color="fg-200"></wui-loading-spinner>`:r`<wui-text variant="paragraph-600" color="inherit"> ${this.balance}</wui-text>`;return r`${e} ${t}`}return null}};q.styles=[t,i,H],K([N()],q.prototype,"networkSrc",void 0),K([N()],q.prototype,"avatarSrc",void 0),K([N()],q.prototype,"balance",void 0),K([N({type:Boolean})],q.prototype,"isUnsupportedChain",void 0),K([N({type:Boolean})],q.prototype,"disabled",void 0),K([N({type:Boolean})],q.prototype,"loading",void 0),K([N()],q.prototype,"address",void 0),K([N()],q.prototype,"profileName",void 0),K([N()],q.prototype,"charsStart",void 0),K([N()],q.prototype,"charsEnd",void 0),q=K([j("wui-account-button")],q);var F=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};class G extends o{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance="show",this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.caipAddress=a.getAccountData(this.namespace)?.caipAddress,this.balanceVal=a.getAccountData(this.namespace)?.balance,this.balanceSymbol=a.getAccountData(this.namespace)?.balanceSymbol,this.profileName=a.getAccountData(this.namespace)?.profileName,this.profileImage=a.getAccountData(this.namespace)?.profileImage,this.network=a.getNetworkData(this.namespace)?.caipNetwork,this.networkImage=n.getNetworkImage(this.network),this.isSupported=!!s.state.allowUnsupportedChain||(!a.state.activeChain||a.checkIfSupportedNetwork(a.state.activeChain))}firstUpdated(){const e=this.namespace;e?this.unsubscribe.push(a.subscribeChainProp("accountState",(e=>{this.caipAddress=e?.caipAddress,this.balanceVal=e?.balance,this.balanceSymbol=e?.balanceSymbol,this.profileName=e?.profileName,this.profileImage=e?.profileImage}),e),a.subscribeChainProp("networkState",(t=>{this.network=t?.caipNetwork,this.isSupported=a.checkIfSupportedNetwork(e,t?.caipNetwork),this.networkImage=n.getNetworkImage(t?.caipNetwork)}),e)):this.unsubscribe.push(l.subscribeNetworkImages((()=>{this.networkImage=n.getNetworkImage(this.network)})),a.subscribeKey("activeCaipAddress",(e=>{this.caipAddress=e})),c.subscribeKey("balance",(e=>this.balanceVal=e)),c.subscribeKey("balanceSymbol",(e=>this.balanceSymbol=e)),c.subscribeKey("profileName",(e=>this.profileName=e)),c.subscribeKey("profileImage",(e=>this.profileImage=e)),a.subscribeKey("activeCaipNetwork",(e=>{this.network=e,this.networkImage=n.getNetworkImage(e),this.isSupported=!e?.chainNamespace||a.checkIfSupportedNetwork(e?.chainNamespace),this.fetchNetworkImage(e)})))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){if(!a.state.activeChain)return null;const e="show"===this.balance,t="string"!=typeof this.balanceVal;return r`
      <wui-account-button
        .disabled=${Boolean(this.disabled)}
        .isUnsupportedChain=${!s.state.allowUnsupportedChain&&!this.isSupported}
        address=${_(d.getPlainAddress(this.caipAddress))}
        profileName=${_(this.profileName)}
        networkSrc=${_(this.networkImage)}
        avatarSrc=${_(this.profileImage)}
        balance=${e?d.formatBalance(this.balanceVal,this.balanceSymbol):""}
        @click=${this.onClick.bind(this)}
        data-testid=${"account-button"+(this.namespace?`-${this.namespace}`:"")}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${t}
      >
      </wui-account-button>
    `}async onClick(){await a.switchActiveNamespace(this.namespace),this.isSupported||s.state.allowUnsupportedChain?u.open():u.open({view:"UnsupportedChain"})}async fetchNetworkImage(e){e?.assets?.imageId&&(this.networkImage=await n.fetchNetworkImage(e?.assets?.imageId))}}F([N({type:Boolean})],G.prototype,"disabled",void 0),F([N()],G.prototype,"balance",void 0),F([N()],G.prototype,"charsStart",void 0),F([N()],G.prototype,"charsEnd",void 0),F([N()],G.prototype,"namespace",void 0),F([D()],G.prototype,"caipAddress",void 0),F([D()],G.prototype,"balanceVal",void 0),F([D()],G.prototype,"balanceSymbol",void 0),F([D()],G.prototype,"profileName",void 0),F([D()],G.prototype,"profileImage",void 0),F([D()],G.prototype,"network",void 0),F([D()],G.prototype,"networkImage",void 0),F([D()],G.prototype,"isSupported",void 0);let Y=class extends G{};Y=F([j("w3m-account-button")],Y);let X=class extends G{};X=F([j("appkit-account-button")],X);var Q=e`
  :host {
    display: block;
    width: max-content;
  }
`,Z=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};class J extends o{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.caipAddress=a.state.activeCaipAddress}firstUpdated(){this.namespace?this.unsubscribe.push(a.subscribeChainProp("accountState",(e=>{this.caipAddress=e?.caipAddress}),this.namespace)):this.unsubscribe.push(a.subscribeKey("activeCaipAddress",(e=>this.caipAddress=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return this.caipAddress?r`
          <appkit-account-button
            .disabled=${Boolean(this.disabled)}
            balance=${_(this.balance)}
            .charsStart=${_(this.charsStart)}
            .charsEnd=${_(this.charsEnd)}
            namespace=${_(this.namespace)}
          >
          </appkit-account-button>
        `:r`
          <appkit-connect-button
            size=${_(this.size)}
            label=${_(this.label)}
            loadingLabel=${_(this.loadingLabel)}
            namespace=${_(this.namespace)}
          ></appkit-connect-button>
        `}}J.styles=Q,Z([N({type:Boolean})],J.prototype,"disabled",void 0),Z([N()],J.prototype,"balance",void 0),Z([N()],J.prototype,"size",void 0),Z([N()],J.prototype,"label",void 0),Z([N()],J.prototype,"loadingLabel",void 0),Z([N()],J.prototype,"charsStart",void 0),Z([N()],J.prototype,"charsEnd",void 0),Z([N()],J.prototype,"namespace",void 0),Z([D()],J.prototype,"caipAddress",void 0);let ee=class extends J{};ee=Z([j("w3m-button")],ee);let te=class extends J{};te=Z([j("appkit-button")],te);var ie=e`
  :host {
    position: relative;
    display: block;
  }

  button {
    background: var(--wui-color-accent-100);
    border: 1px solid var(--wui-color-gray-glass-010);
    border-radius: var(--wui-border-radius-m);
    gap: var(--wui-spacing-xs);
  }

  button.loading {
    background: var(--wui-color-gray-glass-010);
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  button:disabled > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button:active:enabled {
      background-color: var(--wui-color-accent-080);
    }
  }

  button:focus-visible {
    border: 1px solid var(--wui-color-gray-glass-010);
    background-color: var(--wui-color-accent-090);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  button[data-size='sm'] {
    padding: 6.75px 10px 7.25px;
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
    color: var(--wui-color-inverse-100);
  }

  button[data-size='md'] {
    padding: 9px var(--wui-spacing-l) 9px var(--wui-spacing-l);
  }

  button[data-size='md'] + wui-text {
    padding-left: var(--wui-spacing-3xs);
  }

  @media (max-width: 500px) {
    button[data-size='md'] {
      height: 32px;
      padding: 5px 12px;
    }

    button[data-size='md'] > wui-text > slot {
      font-size: 14px !important;
    }
  }

  wui-loading-spinner {
    width: 14px;
    height: 14px;
  }

  wui-loading-spinner::slotted(svg) {
    width: 10px !important;
    height: 10px !important;
  }

  button[data-size='sm'] > wui-loading-spinner {
    width: 12px;
    height: 12px;
  }
`,oe=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let re=class extends o{constructor(){super(...arguments),this.size="md",this.loading=!1}render(){const e="md"===this.size?"paragraph-600":"small-600";return r`
      <button data-size=${this.size} ?disabled=${this.loading}>
        ${this.loadingTemplate()}
        <wui-text variant=${e} color=${this.loading?"accent-100":"inherit"}>
          <slot></slot>
        </wui-text>
      </button>
    `}loadingTemplate(){return this.loading?r`<wui-loading-spinner size=${this.size} color="accent-100"></wui-loading-spinner>`:null}};re.styles=[t,i,ie],oe([N()],re.prototype,"size",void 0),oe([N({type:Boolean})],re.prototype,"loading",void 0),re=oe([j("wui-connect-button")],re);var ae=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};class ne extends o{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=u.state.open,this.loading=this.namespace?u.state.loadingNamespaceMap.get(this.namespace):u.state.loading,this.unsubscribe.push(u.subscribe((e=>{this.open=e.open,this.loading=this.namespace?e.loadingNamespaceMap.get(this.namespace):e.loading})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r`
      <wui-connect-button
        size=${_(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${"connect-button"+(this.namespace?`-${this.namespace}`:"")}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?u.close():this.loading||u.open({view:"Connect",namespace:this.namespace})}}ae([N()],ne.prototype,"size",void 0),ae([N()],ne.prototype,"label",void 0),ae([N()],ne.prototype,"loadingLabel",void 0),ae([N()],ne.prototype,"namespace",void 0),ae([D()],ne.prototype,"open",void 0),ae([D()],ne.prototype,"loading",void 0);let se=class extends ne{};se=ae([j("w3m-connect-button")],se);let le=class extends ne{};le=ae([j("appkit-connect-button")],le);var ce=e`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-2xs) var(--wui-spacing-s) var(--wui-spacing-2xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-color-gray-glass-010);
    background-color: var(--wui-color-gray-glass-005);
    color: var(--wui-color-fg-100);
  }

  button:disabled {
    border: 1px solid var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-015);
    }
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }
`,de=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ue=class extends o{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1}render(){return r`
      <button data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant="paragraph-600" color="inherit">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?r`
        <wui-icon-box
          size="sm"
          iconColor="error-100"
          backgroundColor="error-100"
          icon="warningCircle"
        ></wui-icon-box>
      `:this.imageSrc?r`<wui-image src=${this.imageSrc}></wui-image>`:r`
      <wui-icon-box
        size="sm"
        iconColor="inverse-100"
        backgroundColor="fg-100"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};ue.styles=[t,i,ce],de([N()],ue.prototype,"imageSrc",void 0),de([N({type:Boolean})],ue.prototype,"isUnsupportedChain",void 0),de([N({type:Boolean})],ue.prototype,"disabled",void 0),ue=de([j("wui-network-button")],ue);var pe=e`
  :host {
    display: block;
    width: max-content;
  }
`,we=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};class he extends o{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=a.state.activeCaipNetwork,this.networkImage=n.getNetworkImage(this.network),this.caipAddress=a.state.activeCaipAddress,this.loading=u.state.loading,this.isSupported=!!s.state.allowUnsupportedChain||(!a.state.activeChain||a.checkIfSupportedNetwork(a.state.activeChain)),this.unsubscribe.push(l.subscribeNetworkImages((()=>{this.networkImage=n.getNetworkImage(this.network)})),a.subscribeKey("activeCaipAddress",(e=>{this.caipAddress=e})),a.subscribeKey("activeCaipNetwork",(e=>{this.network=e,this.networkImage=n.getNetworkImage(e),this.isSupported=!e?.chainNamespace||a.checkIfSupportedNetwork(e.chainNamespace),n.fetchNetworkImage(e?.assets?.imageId)})),u.subscribeKey("loading",(e=>this.loading=e)))}firstUpdated(){n.fetchNetworkImage(this.network?.assets?.imageId)}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=!this.network||a.checkIfSupportedNetwork(this.network.chainNamespace);return r`
      <wui-network-button
        .disabled=${Boolean(this.disabled||this.loading)}
        .isUnsupportedChain=${!s.state.allowUnsupportedChain&&!e}
        imageSrc=${_(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?this.isSupported||s.state.allowUnsupportedChain?this.network.name:"Switch Network":this.label?this.label:this.caipAddress?"Unknown Network":"Select Network"}onClick(){this.loading||(p.sendEvent({type:"track",event:"CLICK_NETWORKS"}),u.open({view:"Networks"}))}}he.styles=pe,we([N({type:Boolean})],he.prototype,"disabled",void 0),we([N({type:String})],he.prototype,"label",void 0),we([D()],he.prototype,"network",void 0),we([D()],he.prototype,"networkImage",void 0),we([D()],he.prototype,"caipAddress",void 0),we([D()],he.prototype,"loading",void 0),we([D()],he.prototype,"isSupported",void 0);let ge=class extends he{};ge=we([j("w3m-network-button")],ge);let fe=class extends he{};fe=we([j("appkit-network-button")],fe);var be=e`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: block;
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    padding-left: var(--wui-spacing-s);
    padding-right: var(--wui-spacing-2l);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-accent-glass-010);
  }

  button:hover {
    background-color: var(--wui-color-accent-glass-015) !important;
  }

  button:active {
    background-color: var(--wui-color-accent-glass-020) !important;
  }
`,me=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ve=class extends o{constructor(){super(...arguments),this.label="",this.description="",this.icon="wallet"}render(){return r`
      <button>
        <wui-flex gap="m" alignItems="center" justifyContent="space-between">
          <wui-icon-box
            size="lg"
            iconcolor="accent-100"
            backgroundcolor="accent-100"
            icon=${this.icon}
            background="transparent"
          ></wui-icon-box>

          <wui-flex flexDirection="column" gap="3xs">
            <wui-text variant="paragraph-500" color="fg-100">${this.label}</wui-text>
            <wui-text variant="small-400" color="fg-200">${this.description}</wui-text>
          </wui-flex>

          <wui-icon size="md" color="fg-200" name="chevronRight"></wui-icon>
        </wui-flex>
      </button>
    `}};ve.styles=[t,i,be],me([N()],ve.prototype,"label",void 0),me([N()],ve.prototype,"description",void 0),me([N()],ve.prototype,"icon",void 0),ve=me([j("wui-notice-card")],ve);var xe=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ye=class extends o{constructor(){super(),this.unsubscribe=[],this.socialProvider=w.getConnectedSocialProvider(),this.socialUsername=w.getConnectedSocialUsername(),this.namespace=a.state.activeChain,this.unsubscribe.push(a.subscribeKey("activeChain",(e=>{this.namespace=e})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=h.getConnectorId(this.namespace),t=h.getAuthConnector();if(!t||e!==g.CONNECTOR_ID.AUTH)return this.style.cssText="display: none",null;const i=t.provider.getEmail()??"";return i||this.socialUsername?r`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon=${this.socialProvider??"mail"}
        iconSize=${this.socialProvider?"xxl":"sm"}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(i,this.socialProvider)}}
      >
        <wui-text variant="paragraph-500" color="fg-100">${this.getAuthName(i)}</wui-text>
      </wui-list-item>
    `:(this.style.cssText="display: none",null)}onGoToUpdateEmail(e,t){t||f.push("UpdateEmailWallet",{email:e,redirectView:"Account"})}getAuthName(e){return this.socialUsername?"discord"===this.socialProvider&&this.socialUsername.endsWith("0")?this.socialUsername.slice(0,-1):this.socialUsername:e.length>30?`${e.slice(0,-3)}...`:e}};xe([D()],ye.prototype,"namespace",void 0),ye=xe([j("w3m-account-auth-button")],ye);var ke=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ce=class extends o{constructor(){super(),this.usubscribe=[],this.networkImages=l.state.networkImages,this.address=c.state.address,this.profileImage=c.state.profileImage,this.profileName=c.state.profileName,this.network=a.state.activeCaipNetwork,this.preferredAccountType=c.state.preferredAccountType,this.disconnecting=!1,this.loading=!1,this.switched=!1,this.text="",this.usubscribe.push(c.subscribe((e=>{e.address?(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName,this.preferredAccountType=e.preferredAccountType):u.close()})),c.subscribeKey("preferredAccountType",(e=>this.preferredAccountType=e)),a.subscribeKey("activeCaipNetwork",(e=>{e?.id&&(this.network=e)})))}disconnectedCallback(){this.usubscribe.forEach((e=>e()))}render(){if(!this.address)throw new Error("w3m-account-settings-view: No account provided");const e=this.networkImages[this.network?.assets?.imageId??""];return r`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="l"
        .padding=${["0","xl","m","xl"]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${_(this.profileImage)}
          size="2lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="3xs" alignItems="center" justifyContent="center">
            <wui-text variant="title-6-600" color="fg-100" data-testid="account-settings-address">
              ${P.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="fg-200"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="m">
        <wui-flex flexDirection="column" gap="xs" .padding=${["0","l","m","l"]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            .variant=${e?"image":"icon"}
            iconVariant="overlay"
            icon="networkPlaceholder"
            imageSrc=${_(e)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="paragraph-500" color="fg-100">
              ${this.network?.name??"Unknown"}
            </wui-text>
          </wui-list-item>
          ${this.togglePreferredAccountBtnTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="disconnect"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){const e=this.network?.chainNamespace,t=h.getConnectorId(e),i=h.getAuthConnector();return a.checkIfNamesSupported()&&i&&t===g.CONNECTOR_ID.AUTH&&!this.profileName?r`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="id"
        iconSize="sm"
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="paragraph-500" color="fg-100">Choose account name </wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){const e=this.network?.chainNamespace,t=h.getConnectorId(e),i=h.getAuthConnector(),{origin:o}=location;return!i||t!==g.CONNECTOR_ID.AUTH||o.includes(b.SECURE_SITE)?null:r`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){const e=a.getAllRequestedCaipNetworks(),t=!!e&&e.length>1,i=e?.find((({id:e})=>e===this.network?.id));return t||!i}onCopyAddress(){try{this.address&&(d.copyToClopboard(this.address),m.showSuccess("Address copied"))}catch{m.showError("Failed to copy")}}togglePreferredAccountBtnTemplate(){const e=this.network?.chainNamespace,t=a.checkIfSmartAccountEnabled(),i=h.getConnectorId(e);return h.getAuthConnector()&&i===g.CONNECTOR_ID.AUTH&&t?(this.switched||(this.text=this.preferredAccountType===v.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your smart account"),r`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="swapHorizontalBold"
        iconSize="sm"
        ?chevron=${!0}
        ?loading=${this.loading}
        @click=${this.changePreferredAccountType.bind(this)}
        data-testid="account-toggle-preferred-account-type"
      >
        <wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text>
      </wui-list-item>
    `):null}onChooseName(){f.push("ChooseAccountName")}async changePreferredAccountType(){const e=a.checkIfSmartAccountEnabled(),t=this.preferredAccountType!==v.ACCOUNT_TYPES.SMART_ACCOUNT&&e?v.ACCOUNT_TYPES.SMART_ACCOUNT:v.ACCOUNT_TYPES.EOA;h.getAuthConnector()&&(this.loading=!0,await x.setPreferredAccountType(t),this.text=t===v.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your smart account",this.switched=!0,y.resetSend(),this.loading=!1,this.requestUpdate())}onNetworks(){this.isAllowedNetworkSwitch()&&f.push("Networks")}async onDisconnect(){try{this.disconnecting=!0,await x.disconnect(),u.close()}catch{p.sendEvent({type:"track",event:"DISCONNECT_ERROR"}),m.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onGoToUpgradeView(){p.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),f.push("UpgradeEmailWallet")}};ke([D()],Ce.prototype,"address",void 0),ke([D()],Ce.prototype,"profileImage",void 0),ke([D()],Ce.prototype,"profileName",void 0),ke([D()],Ce.prototype,"network",void 0),ke([D()],Ce.prototype,"preferredAccountType",void 0),ke([D()],Ce.prototype,"disconnecting",void 0),ke([D()],Ce.prototype,"loading",void 0),ke([D()],Ce.prototype,"switched",void 0),ke([D()],Ce.prototype,"text",void 0),Ce=ke([j("w3m-account-settings-view")],Ce);var $e=e`
  button {
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-002);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s) var(--wui-spacing-xs) var(--wui-spacing-xs);
    position: relative;
  }

  wui-avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 0;
    outline: 3px solid var(--wui-color-gray-glass-005);
  }

  wui-icon-box,
  wui-image {
    width: 16px;
    height: 16px;
    border-radius: var(--wui-border-radius-3xl);
    position: absolute;
    left: 26px;
    top: 24px;
  }

  wui-image {
    outline: 2px solid var(--wui-color-bg-125);
  }

  wui-icon-box {
    outline: 2px solid var(--wui-color-bg-200);
    background-color: var(--wui-color-bg-250);
  }
`,Se=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Te=class extends o{constructor(){super(...arguments),this.avatarSrc=void 0,this.profileName="",this.address="",this.icon="mail"}render(){const e=a.state.activeChain,t=h.getConnectorId(e)===g.CONNECTOR_ID.AUTH;return r`<button data-testid="wui-profile-button" @click=${this.handleClick}>
      <wui-flex gap="xs" alignItems="center">
        <wui-avatar
          .imageSrc=${this.avatarSrc}
          alt=${this.address}
          address=${this.address}
        ></wui-avatar>
        ${t?this.getIconTemplate(this.icon):""}
        <wui-flex gap="xs" alignItems="center">
          <wui-text variant="large-600" color="fg-100">
            ${P.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
          </wui-text>
          <wui-icon size="sm" color="fg-200" name="copy" id="copy-address"></wui-icon>
        </wui-flex>
      </wui-flex>
    </button>`}handleClick(e){e.target instanceof HTMLElement&&"copy-address"===e.target.id?this.onCopyClick?.(e):this.onProfileClick?.(e)}getIconTemplate(e){return r`
      <wui-icon-box
        size="xxs"
        iconColor="fg-200"
        backgroundColor="bg-100"
        icon="${e||"networkPlaceholder"}"
      ></wui-icon-box>
    `}};Te.styles=[t,i,$e],Se([N()],Te.prototype,"avatarSrc",void 0),Se([N()],Te.prototype,"profileName",void 0),Se([N()],Te.prototype,"address",void 0),Se([N()],Te.prototype,"icon",void 0),Se([N()],Te.prototype,"onProfileClick",void 0),Se([N()],Te.prototype,"onCopyClick",void 0),Te=Se([j("wui-profile-button-v2")],Te);var Re=e`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`,Ie=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Oe=class extends o{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`\n      --local-tab: ${this.activeTab};\n      --local-tab-width: ${this.localTabWidth};\n    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map(((e,t)=>{const i=t===this.activeTab;return r`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(t)}
          data-active=${i}
          data-testid="tab-${e.label?.toLowerCase()}"
        >
          ${this.iconTemplate(e)}
          <wui-text variant="small-600" color="inherit"> ${e.label} </wui-text>
        </button>
      `}))}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout((()=>{this.animateTabs(0,!0)}),0))}iconTemplate(e){return e.icon?r`<wui-icon size="xs" color="inherit" name=${e.icon}></wui-icon>`:null}onTabClick(e){this.buttons&&this.animateTabs(e,!1),this.activeTab=e,this.onTabChange(e)}animateTabs(e,t){const i=this.buttons[this.activeTab],o=this.buttons[e],r=i?.querySelector("wui-text"),a=o?.querySelector("wui-text"),n=o?.getBoundingClientRect(),s=a?.getBoundingClientRect();i&&r&&!t&&e!==this.activeTab&&(r.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),i.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),o&&n&&s&&a&&(e!==this.activeTab||t)&&(this.localTabWidth=`${Math.round(n.width+s.width)+6}px`,o.animate([{width:`${n.width+s.width}px`}],{duration:t?0:500,fill:"forwards",easing:"ease"}),a.animate([{opacity:1}],{duration:t?0:125,delay:t?0:200,fill:"forwards",easing:"ease"}))}};Oe.styles=[t,i,Re],Ie([N({type:Array})],Oe.prototype,"tabs",void 0),Ie([N()],Oe.prototype,"onTabChange",void 0),Ie([N({type:Array})],Oe.prototype,"buttons",void 0),Ie([N({type:Boolean})],Oe.prototype,"disabled",void 0),Ie([N()],Oe.prototype,"localTabWidth",void 0),Ie([D()],Oe.prototype,"activeTab",void 0),Ie([D()],Oe.prototype,"isDense",void 0),Oe=Ie([j("wui-tabs")],Oe);var Ae=e`
  wui-flex {
    width: 100%;
  }

  :host > wui-flex:first-child {
    transform: translateY(calc(var(--wui-spacing-xxs) * -1));
  }

  wui-icon-link {
    margin-right: calc(var(--wui-icon-box-size-md) * -1);
  }

  wui-notice-card {
    margin-bottom: var(--wui-spacing-3xs);
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-s);
    height: 48px;
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-s);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: 24px;
    transition: background-color 0.2s linear;
  }

  .account-button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition:
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md),
      opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #667dff;
  }
`,Ee=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ne=class extends o{constructor(){super(),this.unsubscribe=[],this.caipAddress=c.state.caipAddress,this.address=d.getPlainAddress(c.state.caipAddress),this.allAccounts=c.state.allAccounts,this.profileImage=c.state.profileImage,this.profileName=c.state.profileName,this.disconnecting=!1,this.balance=c.state.balance,this.balanceSymbol=c.state.balanceSymbol,this.features=s.state.features,this.namespace=a.state.activeChain,this.chainId=a.state.activeCaipNetwork?.id,this.unsubscribe.push(c.subscribeKey("caipAddress",(e=>{this.address=d.getPlainAddress(e),this.caipAddress=e})),c.subscribeKey("balance",(e=>this.balance=e)),c.subscribeKey("balanceSymbol",(e=>this.balanceSymbol=e)),c.subscribeKey("profileName",(e=>this.profileName=e)),c.subscribeKey("profileImage",(e=>this.profileImage=e)),s.subscribeKey("features",(e=>this.features=e)),c.subscribeKey("allAccounts",(e=>{this.allAccounts=e})),a.subscribeKey("activeChain",(e=>this.namespace=e)),a.subscribeKey("activeCaipNetwork",(e=>{if(e){const[t,i]=e?.caipNetworkId?.split(":")||[];t&&i&&(this.namespace=t,this.chainId=i)}})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){if(!this.caipAddress)return null;const e=a.state.activeChain!==g.CHAIN.SOLANA&&this.allAccounts.length>1;return r`<wui-flex
        flexDirection="column"
        .padding=${["0","xl","m","xl"]}
        alignItems="center"
        gap="l"
      >
        ${e?this.multiAccountTemplate():this.singleAccountTemplate()}
        <wui-flex flexDirection="column" alignItems="center">
          <wui-text variant="paragraph-500" color="fg-200">
            ${d.formatBalance(this.balance,this.balanceSymbol)}
          </wui-text>
        </wui-flex>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="xs" .padding=${["0","s","s","s"]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          variant="icon"
          iconVariant="overlay"
          icon="disconnect"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}onrampTemplate(){if(!this.namespace)return null;const e=this.features?.onramp,t=b.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace);return e&&t?r`
      <wui-list-item
        data-testid="w3m-account-default-onramp-button"
        iconVariant="blue"
        icon="card"
        ?chevron=${!0}
        @click=${this.handleClickPay.bind(this)}
      >
        <wui-text variant="paragraph-500" color="fg-100">Buy crypto</wui-text>
      </wui-list-item>
    `:null}orderedFeaturesTemplate(){return(this.features?.walletFeaturesOrder||b.DEFAULT_FEATURES.walletFeaturesOrder).map((e=>{switch(e){case"onramp":return this.onrampTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}}))}activityTemplate(){if(!this.namespace)return null;const e=a.state.activeChain===g.CHAIN.SOLANA;return this.features?.history&&b.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?r` <wui-list-item
          iconVariant="blue"
          icon="clock"
          iconSize="sm"
          ?chevron=${!e}
          ?disabled=${e}
          @click=${this.onTransactions.bind(this)}
        >
          <wui-text variant="paragraph-500" color="fg-100" ?disabled=${e}>
            Activity
          </wui-text>
          ${e?r`<wui-tag variant="main">Coming soon</wui-tag>`:""}
        </wui-list-item>`:null}swapsTemplate(){const e=this.features?.swaps,t=a.state.activeChain===g.CHAIN.EVM;return e&&t?r`
      <wui-list-item
        iconVariant="blue"
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
      >
        <wui-text variant="paragraph-500" color="fg-100">Swap</wui-text>
      </wui-list-item>
    `:null}sendTemplate(){const e=this.features?.send,t=a.state.activeChain===g.CHAIN.EVM;return e&&t?r`
      <wui-list-item
        iconVariant="blue"
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
      >
        <wui-text variant="paragraph-500" color="fg-100">Send</wui-text>
      </wui-list-item>
    `:null}authCardTemplate(){const e=a.state.activeChain,t=h.getConnectorId(e),i=h.getAuthConnector(),{origin:o}=location;return!i||t!==g.CONNECTOR_ID.AUTH||o.includes(b.SECURE_SITE)?null:r`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleSwitchAccountsView(){f.push("SwitchAddress")}handleClickPay(){f.push("OnRampProviders")}handleClickSwap(){f.push("Swap")}handleClickSend(){f.push("WalletSend")}explorerBtnTemplate(){return c.state.addressExplorerUrl?r`
      <wui-button size="md" variant="neutral" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}singleAccountTemplate(){return r`
      <wui-avatar
        alt=${_(this.caipAddress)}
        address=${_(d.getPlainAddress(this.caipAddress))}
        imageSrc=${_(null===this.profileImage?void 0:this.profileImage)}
        data-testid="single-account-avatar"
      ></wui-avatar>
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex gap="3xs" alignItems="center" justifyContent="center">
          <wui-text variant="large-600" color="fg-100">
            ${this.profileName?P.getTruncateString({string:this.profileName,charsStart:20,charsEnd:0,truncate:"end"}):P.getTruncateString({string:this.address||"",charsStart:4,charsEnd:4,truncate:"middle"})}
          </wui-text>
          <wui-icon-link
            size="md"
            icon="copy"
            iconColor="fg-200"
            @click=${this.onCopyAddress}
          ></wui-icon-link> </wui-flex
      ></wui-flex>
    `}multiAccountTemplate(){if(!this.address)throw new Error("w3m-account-view: No account provided");const e=this.allAccounts.find((e=>e.address===this.address)),t=c.state.addressLabels.get(this.address);return"bip122"===this.namespace?this.btcAccountsTemplate():r`
      <wui-profile-button-v2
        .onProfileClick=${this.handleSwitchAccountsView.bind(this)}
        address=${_(this.address)}
        icon="${e?.type===v.ACCOUNT_TYPES.SMART_ACCOUNT&&a.state.activeChain===g.CHAIN.EVM?"lightbulb":"mail"}"
        avatarSrc=${_(this.profileImage?this.profileImage:void 0)}
        profileName=${_(t||this.profileName)}
        .onCopyClick=${this.onCopyAddress.bind(this)}
      ></wui-profile-button-v2>
    `}btcAccountsTemplate(){return r`<wui-flex gap="m" alignItems="center" flexDirection="column">
      <wui-avatar
        .imageSrc=${_(this.profileImage?this.profileImage:void 0)}
        alt=${this.address}
        address=${this.address}
      ></wui-avatar>
      <wui-tabs
        .tabs=${[{label:"Payment"},{label:"Ordinals"}]}
        .onTabChange=${e=>c.setCaipAddress(`bip122:${this.chainId}:${this.allAccounts[e]?.address||""}`,this.namespace)}
      ></wui-tabs>
      <wui-flex gap="xs" alignItems="center" justifyContent="center">
        <wui-text variant="large-600" color="fg-100">
          ${P.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
        </wui-text>
        <wui-icon-link
          size="md"
          icon="copy"
          iconColor="fg-200"
          @click=${this.onCopyAddress}
        ></wui-icon-link>
      </wui-flex>
    </wui-flex>`}onCopyAddress(){try{this.address&&(d.copyToClopboard(this.address),m.showSuccess("Address copied"))}catch{m.showError("Failed to copy")}}onTransactions(){p.sendEvent({type:"track",event:"CLICK_TRANSACTIONS",properties:{isSmartAccount:c.state.preferredAccountType===v.ACCOUNT_TYPES.SMART_ACCOUNT}}),f.push("Transactions")}async onDisconnect(){try{this.disconnecting=!0,await x.disconnect(),u.close()}catch{p.sendEvent({type:"track",event:"DISCONNECT_ERROR"}),m.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onExplorer(){const e=c.state.addressExplorerUrl;e&&d.openHref(e,"_blank")}onGoToUpgradeView(){p.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),f.push("UpgradeEmailWallet")}};Ne.styles=Ae,Ee([D()],Ne.prototype,"caipAddress",void 0),Ee([D()],Ne.prototype,"address",void 0),Ee([D()],Ne.prototype,"allAccounts",void 0),Ee([D()],Ne.prototype,"profileImage",void 0),Ee([D()],Ne.prototype,"profileName",void 0),Ee([D()],Ne.prototype,"disconnecting",void 0),Ee([D()],Ne.prototype,"balance",void 0),Ee([D()],Ne.prototype,"balanceSymbol",void 0),Ee([D()],Ne.prototype,"features",void 0),Ee([D()],Ne.prototype,"namespace",void 0),Ee([D()],Ne.prototype,"chainId",void 0),Ne=Ee([j("w3m-account-default-widget")],Ne);var je=e`
  span {
    font-weight: 500;
    font-size: 40px;
    color: var(--wui-color-fg-100);
    line-height: 130%; /* 52px */
    letter-spacing: -1.6px;
    text-align: center;
  }

  .pennies {
    color: var(--wui-color-fg-200);
  }
`,_e=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Pe=class extends o{constructor(){super(...arguments),this.dollars="0",this.pennies="00"}render(){return r`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};Pe.styles=[t,je],_e([N()],Pe.prototype,"dollars",void 0),_e([N()],Pe.prototype,"pennies",void 0),Pe=_e([j("wui-balance")],Pe);var De=e`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 100%;
    background-color: var(--wui-color-accent-glass-010);
    border-radius: var(--wui-border-radius-xs);
    border: 1px solid var(--wui-color-accent-glass-010);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  wui-tooltip {
    padding: 7px var(--wui-spacing-s) 8px var(--wui-spacing-s);
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translate(-50%, -100%);
    opacity: 0;
    display: none;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }
  }
`,Ue=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Le=class extends o{constructor(){super(...arguments),this.text="",this.icon="card"}render(){return r`<button>
      <wui-icon color="accent-100" name=${this.icon} size="lg"></wui-icon>
    </button>`}};Le.styles=[t,i,De],Ue([N()],Le.prototype,"text",void 0),Ue([N()],Le.prototype,"icon",void 0),Le=Ue([j("wui-icon-button")],Le);var ze=e`
  button {
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-002);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s) var(--wui-spacing-xs) var(--wui-spacing-xs);
    position: relative;
  }

  wui-avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 0;
    outline: 3px solid var(--wui-color-gray-glass-005);
  }

  wui-icon-box,
  wui-image {
    width: 16px;
    height: 16px;
    border-radius: var(--wui-border-radius-3xl);
    position: absolute;
    left: 26px;
    top: 24px;
  }

  wui-image {
    outline: 2px solid var(--wui-color-bg-125);
  }

  wui-icon-box {
    outline: 2px solid var(--wui-color-bg-200);
    background-color: var(--wui-color-bg-250);
  }
`,We=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Be=class extends o{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.profileName="",this.address="",this.icon="chevronBottom"}render(){return r`<button data-testid="wui-profile-button">
      <wui-flex gap="xs" alignItems="center">
        <wui-avatar
          .imageSrc=${this.avatarSrc}
          alt=${this.address}
          address=${this.address}
        ></wui-avatar>
        ${this.networkImageTemplate()}
        <wui-flex gap="xs" alignItems="center">
          <wui-text variant="large-600" color="fg-100">
            ${P.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
          </wui-text>
          <wui-icon size="sm" color="fg-200" name=${this.icon}></wui-icon>
        </wui-flex>
      </wui-flex>
    </button>`}networkImageTemplate(){return this.networkSrc?r`<wui-image src=${this.networkSrc}></wui-image>`:r`
      <wui-icon-box
        size="xxs"
        iconColor="fg-200"
        backgroundColor="bg-100"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};Be.styles=[t,i,ze],We([N()],Be.prototype,"networkSrc",void 0),We([N()],Be.prototype,"avatarSrc",void 0),We([N()],Be.prototype,"profileName",void 0),We([N()],Be.prototype,"address",void 0),We([N()],Be.prototype,"icon",void 0),Be=We([j("wui-profile-button")],Be);var Me=e`
  :host {
    display: block;
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);

    color: var(--wui-color-bg-100);
    position: relative;
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`,Ve=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let He=class extends o{constructor(){super(...arguments),this.placement="top",this.variant="fill",this.message=""}render(){return this.dataset.variant=this.variant,r`<wui-icon
        data-placement=${this.placement}
        color="fg-100"
        size="inherit"
        name=${"fill"===this.variant?"cursor":"cursorTransparent"}
      ></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>`}};He.styles=[t,i,Me],Ve([N()],He.prototype,"placement",void 0),Ve([N()],He.prototype,"variant",void 0),Ve([N()],He.prototype,"message",void 0),He=Ve([j("wui-tooltip")],He);var Ke=e`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`,qe=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Fe=class extends o{render(){return r`<w3m-activity-list page="account"></w3m-activity-list>`}};Fe.styles=Ke,Fe=qe([j("w3m-account-activity-widget")],Fe);var Ge=e`
  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`,Ye=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Xe=class extends o{render(){return r`${this.nftTemplate()}`}nftTemplate(){return r` <wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
    >
      <wui-icon-box
        icon="wallet"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text
          variant="paragraph-500"
          align="center"
          color="fg-100"
          data-testid="nft-template-title"
          >Coming soon</wui-text
        >
        <wui-text
          variant="small-400"
          align="center"
          color="fg-200"
          data-testid="nft-template-description"
          >Stay tuned for our upcoming NFT feature</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)} data-testid="link-receive-funds"
        >Receive funds</wui-link
      >
    </wui-flex>`}onReceiveClick(){f.push("WalletReceive")}};Xe.styles=Ge,Xe=Ye([j("w3m-account-nfts-widget")],Xe);var Qe=e`
  button {
    width: 100%;
    display: flex;
    gap: var(--wui-spacing-s);
    align-items: center;
    justify-content: flex-start;
    padding: var(--wui-spacing-s) var(--wui-spacing-m) var(--wui-spacing-s) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon-box {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
  }

  wui-flex {
    width: auto;
  }
`,Ze=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Je=class extends o{constructor(){super(...arguments),this.icon="card",this.text="",this.description="",this.tag=void 0,this.iconBackgroundColor="accent-100",this.iconColor="accent-100",this.disabled=!1}render(){return r`
      <button ?disabled=${this.disabled}>
        <wui-icon-box
          iconColor=${this.iconColor}
          backgroundColor=${this.iconBackgroundColor}
          size="inherit"
          icon=${this.icon}
          iconSize="md"
        ></wui-icon-box>
        <wui-flex flexDirection="column" justifyContent="spaceBetween">
          ${this.titleTemplate()}
          <wui-text variant="small-400" color="fg-200"> ${this.description}</wui-text></wui-flex
        >
      </button>
    `}titleTemplate(){return this.tag?r` <wui-flex alignItems="center" gap="xxs"
        ><wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text
        ><wui-tag tagType="main" size="md">${this.tag}</wui-tag>
      </wui-flex>`:r`<wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text>`}};Je.styles=[t,i,Qe],Ze([N()],Je.prototype,"icon",void 0),Ze([N()],Je.prototype,"text",void 0),Ze([N()],Je.prototype,"description",void 0),Ze([N()],Je.prototype,"tag",void 0),Ze([N()],Je.prototype,"iconBackgroundColor",void 0),Ze([N()],Je.prototype,"iconColor",void 0),Ze([N({type:Boolean})],Je.prototype,"disabled",void 0),Je=Ze([j("wui-list-description")],Je);var et=e`
  :host {
    width: 100%;
  }

  wui-flex {
    width: 100%;
  }

  .contentContainer {
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }
`,tt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let it=class extends o{constructor(){super(),this.unsubscribe=[],this.tokenBalance=c.state.tokenBalance,this.unsubscribe.push(c.subscribe((e=>{this.tokenBalance=e.tokenBalance})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r`${this.tokenTemplate()}`}tokenTemplate(){return this.tokenBalance&&this.tokenBalance?.length>0?r`<wui-flex class="contentContainer" flexDirection="column" gap="xs">
        ${this.tokenItemTemplate()}
      </wui-flex>`:r` <wui-flex flexDirection="column" gap="xs"
      ><wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="buy-crypto"
      ></wui-list-description
      ><wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Transfer tokens on your wallet"
        icon="arrowBottomCircle"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="receive-funds"
      ></wui-list-description
    ></wui-flex>`}tokenItemTemplate(){return this.tokenBalance?.map((e=>r`<wui-list-token
          tokenName=${e.name}
          tokenImageUrl=${e.iconUrl}
          tokenAmount=${e.quantity.numeric}
          tokenValue=${e.value}
          tokenCurrency=${e.symbol}
        ></wui-list-token>`))}onReceiveClick(){f.push("WalletReceive")}onBuyClick(){p.sendEvent({type:"track",event:"SELECT_BUY_CRYPTO",properties:{isSmartAccount:c.state.preferredAccountType===v.ACCOUNT_TYPES.SMART_ACCOUNT}}),f.push("OnRampProviders")}};it.styles=et,tt([D()],it.prototype,"tokenBalance",void 0),it=tt([j("w3m-account-tokens-widget")],it);var ot=e`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * var(--wui-spacing-2l));
  }

  wui-promo + wui-profile-button {
    margin-top: var(--wui-spacing-2l);
  }

  wui-tabs {
    width: 100%;
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`,rt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let at=class extends o{constructor(){super(),this.unsubscribe=[],this.address=c.state.address,this.profileImage=c.state.profileImage,this.profileName=c.state.profileName,this.network=a.state.activeCaipNetwork,this.currentTab=c.state.currentTab,this.tokenBalance=c.state.tokenBalance,this.features=s.state.features,this.networkImage=n.getNetworkImage(this.network),this.unsubscribe.push(l.subscribeNetworkImages((()=>{this.networkImage=n.getNetworkImage(this.network)})),c.subscribe((e=>{e.address?(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName,this.currentTab=e.currentTab,this.tokenBalance=e.tokenBalance):u.close()})),a.subscribeKey("activeCaipNetwork",(e=>this.network=e)),s.subscribeKey("features",(e=>this.features=e))),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),clearInterval(this.watchTokenBalance)}firstUpdated(){c.fetchTokenBalance()}render(){if(!this.address)throw new Error("w3m-account-view: No account provided");return r`<wui-flex
      flexDirection="column"
      .padding=${["0","xl","m","xl"]}
      alignItems="center"
      gap="m"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-profile-button
        @click=${this.onProfileButtonClick.bind(this)}
        address=${_(this.address)}
        networkSrc=${_(this.networkImage)}
        icon="chevronBottom"
        avatarSrc=${_(this.profileImage?this.profileImage:void 0)}
        profileName=${_(this.profileName??void 0)}
        data-testid="w3m-profile-button"
      ></wui-profile-button>

      ${this.tokenBalanceTemplate()} ${this.orderedWalletFeatures()}

      <wui-tabs
        .onTabChange=${this.onTabChange.bind(this)}
        .activeTab=${this.currentTab}
        localTabWidth=${d.isMobile()&&window.innerWidth<430?(window.innerWidth-48)/3+"px":"104px"}
        .tabs=${k.ACCOUNT_TABS}
      ></wui-tabs>
      ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){const e=this.features?.walletFeaturesOrder||b.DEFAULT_FEATURES.walletFeaturesOrder;return e.every((e=>!this.features?.[e]))?null:r`<wui-flex gap="s">
      ${e.map((e=>{switch(e){case"onramp":return this.onrampTemplate();case"swaps":return this.swapsTemplate();case"receive":return this.receiveTemplate();case"send":return this.sendTemplate();default:return null}}))}
    </wui-flex>`}onrampTemplate(){const e=this.features?.onramp;return e?r`
      <w3m-tooltip-trigger text="Buy">
        <wui-icon-button
          data-testid="wallet-features-onramp-button"
          @click=${this.onBuyClick.bind(this)}
          icon="card"
        ></wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}swapsTemplate(){const e=this.features?.swaps,t=a.state.activeChain===g.CHAIN.EVM;return e&&t?r`
      <w3m-tooltip-trigger text="Swap">
        <wui-icon-button
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          icon="recycleHorizontal"
        >
        </wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}receiveTemplate(){const e=this.features?.receive;return e?r`
      <w3m-tooltip-trigger text="Receive">
        <wui-icon-button
          data-testid="wallet-features-receive-button"
          @click=${this.onReceiveClick.bind(this)}
          icon="arrowBottomCircle"
        >
        </wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}sendTemplate(){const e=this.features?.send,t=a.state.activeChain===g.CHAIN.EVM;return e&&t?r`
      <w3m-tooltip-trigger text="Send">
        <wui-icon-button
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          icon="send"
        ></wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}watchSwapValues(){this.watchTokenBalance=setInterval((()=>c.fetchTokenBalance((e=>this.onTokenBalanceError(e)))),1e4)}onTokenBalanceError(e){if(e instanceof Error&&e.cause instanceof Response){e.cause.status===g.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}}listContentTemplate(){return 0===this.currentTab?r`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:1===this.currentTab?r`<w3m-account-nfts-widget></w3m-account-nfts-widget>`:2===this.currentTab?r`<w3m-account-activity-widget></w3m-account-activity-widget>`:r`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){if(this.tokenBalance&&this.tokenBalance?.length>=0){const e=d.calculateBalance(this.tokenBalance),{dollars:t="0",pennies:i="00"}=d.formatTokenBalance(e);return r`<wui-balance dollars=${t} pennies=${i}></wui-balance>`}return r`<wui-balance dollars="0" pennies="00"></wui-balance>`}onTabChange(e){c.setCurrentTab(e)}onProfileButtonClick(){const{allAccounts:e}=c.state;e.length>1?f.push("Profile"):f.push("AccountSettings")}onBuyClick(){f.push("OnRampProviders")}onSwapClick(){this.network?.caipNetworkId&&!b.SWAP_SUPPORTED_NETWORKS.includes(this.network?.caipNetworkId)?f.push("UnsupportedChain",{swapUnsupportedChain:!0}):(p.sendEvent({type:"track",event:"OPEN_SWAP",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:c.state.preferredAccountType===v.ACCOUNT_TYPES.SMART_ACCOUNT}}),f.push("Swap"))}onReceiveClick(){f.push("WalletReceive")}onSendClick(){p.sendEvent({type:"track",event:"OPEN_SEND",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:c.state.preferredAccountType===v.ACCOUNT_TYPES.SMART_ACCOUNT}}),f.push("WalletSend")}};at.styles=ot,rt([D()],at.prototype,"watchTokenBalance",void 0),rt([D()],at.prototype,"address",void 0),rt([D()],at.prototype,"profileImage",void 0),rt([D()],at.prototype,"profileName",void 0),rt([D()],at.prototype,"network",void 0),rt([D()],at.prototype,"currentTab",void 0),rt([D()],at.prototype,"tokenBalance",void 0),rt([D()],at.prototype,"features",void 0),rt([D()],at.prototype,"networkImage",void 0),at=rt([j("w3m-account-wallet-features-widget")],at);var nt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let st=class extends o{constructor(){super(),this.unsubscribe=[],this.namespace=a.state.activeChain,this.unsubscribe.push(a.subscribeKey("activeChain",(e=>{this.namespace=e})))}render(){if(!this.namespace)return null;const e=h.getConnectorId(this.namespace),t=h.getAuthConnector();return r`
      ${t&&e===g.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return r`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return r`<w3m-account-default-widget></w3m-account-default-widget>`}};nt([D()],st.prototype,"namespace",void 0),st=nt([j("w3m-account-view")],st);var lt=e`
  button {
    padding: 6.5px var(--wui-spacing-l) 6.5px var(--wui-spacing-xs);
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    background-color: var(--wui-color-gray-glass-002);
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    border-radius: var(--wui-border-radius-3xl);
  }

  wui-avatar {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    box-shadow: 0 0 0 0;
  }
  .address {
    color: var(--wui-color-fg-base-100);
  }
  .address-description {
    text-transform: capitalize;
    color: var(--wui-color-fg-base-200);
  }

  wui-icon-box {
    position: relative;
    right: 15px;
    top: 15px;
    border: 2px solid var(--wui-color-bg-150);
    background-color: var(--wui-color-bg-125);
  }
`,ct=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let dt=class extends o{constructor(){super(...arguments),this.accountAddress="",this.accountType="",this.labels=c.state.addressLabels,this.caipNetwork=a.state.activeCaipNetwork,this.socialProvider=w.getConnectedSocialProvider(),this.balance=0,this.fetchingBalance=!0,this.shouldShowIcon=!1,this.selected=!1}connectedCallback(){super.connectedCallback(),C.getBalance(this.accountAddress,this.caipNetwork?.caipNetworkId).then((e=>{let t=this.balance;e.balances.length>0&&(t=e.balances.reduce(((e,t)=>e+(t?.value||0)),0)),this.balance=t,this.fetchingBalance=!1,this.requestUpdate()})).catch((()=>{this.fetchingBalance=!1,this.requestUpdate()}))}render(){const e=this.getLabel(),t=a.state.activeChain,i=h.getConnectorId(t);return this.shouldShowIcon=i===g.CONNECTOR_ID.AUTH,r`
      <wui-flex
        flexDirection="row"
        justifyContent="space-between"
        .padding=${["0","0","s","1xs"]}
      >
        <wui-flex gap="md" alignItems="center">
          <wui-avatar address=${this.accountAddress}></wui-avatar>
          ${this.shouldShowIcon?r`<wui-icon-box
                size="sm"
                iconcolor="fg-200"
                backgroundcolor="fg-300"
                icon=${this.accountType===v.ACCOUNT_TYPES.EOA?this.socialProvider??"mail":"lightbulb"}
                background="fg-300"
              ></wui-icon-box>`:r`<wui-flex .padding="${["0","0","0","s"]}"></wui-flex>`}
          <wui-flex flexDirection="column">
            <wui-text class="address" variant="paragraph-500" color="fg-100"
              >${P.getTruncateString({string:this.accountAddress,charsStart:4,charsEnd:6,truncate:"middle"})}</wui-text
            >
            <wui-text class="address-description" variant="small-400">${e}</wui-text></wui-flex
          >
        </wui-flex>
        <wui-flex gap="s" alignItems="center">
          <slot name="action"></slot>
          ${this.fetchingBalance?r`<wui-loading-spinner size="sm" color="accent-100"></wui-loading-spinner>`:r` <wui-text variant="small-400">$${this.balance.toFixed(2)}</wui-text>`}
        </wui-flex>
      </wui-flex>
    `}getLabel(){let e=this.labels?.get(this.accountAddress);const t=a.state.activeChain,i=h.getConnectorId(t);return e||i!==g.CONNECTOR_ID.AUTH?e||(e="EOA"):e=`${"eoa"===this.accountType?this.socialProvider??"Email":"Smart"} Account`,e}};dt.styles=[t,i,lt],ct([N()],dt.prototype,"accountAddress",void 0),ct([N()],dt.prototype,"accountType",void 0),ct([N({type:Boolean})],dt.prototype,"selected",void 0),ct([N({type:Function})],dt.prototype,"onSelect",void 0),dt=ct([j("wui-list-account")],dt);var ut=e`
  wui-flex {
    width: 100%;
  }

  wui-icon-link {
    margin-right: calc(var(--wui-icon-box-size-md) * -1);
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;

    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #47a1ff;
  }

  .account-settings-button {
    padding: calc(var(--wui-spacing-m) - 1px) var(--wui-spacing-2l);
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
    border: 1px solid var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    cursor: pointer;
  }

  .account-settings-button:hover {
    background: var(--wui-color-gray-glass-005);
  }
`,pt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let wt=class extends o{constructor(){super(),this.usubscribe=[],this.address=c.state.address,this.profileImage=c.state.profileImage,this.profileName=c.state.profileName,this.accounts=c.state.allAccounts,this.loading=!1,this.usubscribe.push(c.subscribeKey("address",(e=>{e?this.address=e:u.close()}))),this.usubscribe.push(c.subscribeKey("profileImage",(e=>{this.profileImage=e}))),this.usubscribe.push(c.subscribeKey("profileName",(e=>{this.profileName=e})))}disconnectedCallback(){this.usubscribe.forEach((e=>e()))}render(){if(!this.address)throw new Error("w3m-profile-view: No account provided");return r`
      <wui-flex flexDirection="column" gap="l" .padding=${["0","xl","m","xl"]}>
        <wui-flex flexDirection="column" alignItems="center" gap="l">
          <wui-avatar
            alt=${this.address}
            address=${this.address}
            imageSrc=${_(this.profileImage)}
            size="2lg"
          ></wui-avatar>
          <wui-flex flexDirection="column" alignItems="center">
            <wui-flex gap="3xs" alignItems="center" justifyContent="center">
              <wui-text variant="title-6-600" color="fg-100" data-testid="account-settings-address">
                ${this.profileName?P.getTruncateString({string:this.profileName,charsStart:20,charsEnd:0,truncate:"end"}):P.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
              </wui-text>
              <wui-icon-link
                size="md"
                icon="copy"
                iconColor="fg-200"
                @click=${this.onCopyAddress}
              ></wui-icon-link>
            </wui-flex>
          </wui-flex>
        </wui-flex>
        <wui-flex
          data-testid="account-settings-button"
          justifyContent="center"
          alignItems="center"
          class="account-settings-button"
          @click=${()=>f.push("AccountSettings")}
        >
          <wui-text variant="paragraph-500" color="fg-100">Account Settings</wui-text>
        </wui-flex>
        ${this.accountsTemplate()}
      </wui-flex>
    `}accountsTemplate(){return r`<wui-flex flexDirection="column">
      <wui-flex .padding=${["3xs","m","s","s"]}>
        <wui-text color="fg-200" variant="paragraph-400">Your accounts</wui-text>
      </wui-flex>
      <wui-flex flexDirection="column" gap="xxs">
        ${this.accounts.map((e=>this.accountTemplate(e)))}
      </wui-flex>
    </wui-flex>`}async onSwitchAccount(e){this.loading=!0;if(h.getAuthConnector()){const t=e.type;await x.setPreferredAccountType(t)}c.setShouldUpdateToAddress(e.address,a.state.activeChain),this.loading=!1}accountTemplate(e){return r`<wui-list-account accountAddress=${e.address} accountType=${e.type}>
      ${e.address===this.address?"":r`<wui-button
            slot="action"
            textVariant="small-600"
            size="md"
            variant="accent"
            @click=${()=>this.onSwitchAccount(e)}
            .loading=${this.loading}
            >Switch</wui-button
          >`}
    </wui-list-account>`}onCopyAddress(){try{this.address&&(d.copyToClopboard(this.address),m.showSuccess("Address copied"))}catch{m.showError("Failed to copy")}}};wt.styles=ut,pt([D()],wt.prototype,"address",void 0),pt([D()],wt.prototype,"profileImage",void 0),pt([D()],wt.prototype,"profileName",void 0),pt([D()],wt.prototype,"accounts",void 0),pt([D()],wt.prototype,"loading",void 0),wt=pt([j("w3m-profile-view")],wt);var ht=e`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-m);
    padding: var(--wui-spacing-1xs) var(--wui-spacing-s) var(--wui-spacing-1xs)
      var(--wui-spacing-1xs);
  }
`,gt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ft=class extends o{constructor(){super(...arguments),this.imageSrc="",this.text="",this.size=""}render(){return r`
      <wui-flex gap="1xs" alignItems="center">
        <wui-avatar size=${this.size} imageSrc=${this.imageSrc}></wui-avatar>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
      </wui-flex>
    `}};ft.styles=[t,i,ht],gt([N()],ft.prototype,"imageSrc",void 0),gt([N()],ft.prototype,"text",void 0),gt([N()],ft.prototype,"size",void 0),ft=gt([j("wui-banner-img")],ft);var bt=e`
  wui-avatar {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    box-shadow: 0 0 0 0;
  }

  wui-icon-box {
    position: relative;
    right: 15px;
    top: 15px;
    border: 2px solid var(--wui-color-bg-150);
    background-color: var(--wui-color-bg-125);
  }
`,mt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let vt=class extends o{constructor(){super(),this.metadata=s.state.metadata,this.allAccounts=c.state.allAccounts||[],this.balances={},this.labels=c.state.addressLabels,this.currentAddress=c.state.address||"",this.caipNetwork=a.state.activeCaipNetwork,c.subscribeKey("allAccounts",(e=>{this.allAccounts=e}))}connectedCallback(){super.connectedCallback(),this.allAccounts.forEach((e=>{C.getBalance(e.address,this.caipNetwork?.caipNetworkId).then((t=>{let i=this.balances[e.address]||0;t.balances.length>0&&(i=t.balances.reduce(((e,t)=>e+(t?.value||0)),0)),this.balances[e.address]=i,this.requestUpdate()}))}))}getAddressIcon(e){return"smartAccount"===e?"lightbulb":"mail"}render(){return r`
      <wui-flex justifyContent="center" .padding=${["xl","0","xl","0"]}>
        <wui-banner-img
          imageSrc=${_(this.metadata?.icons[0])}
          text=${_(this.metadata?.url)}
          size="sm"
        ></wui-banner-img>
      </wui-flex>
      <wui-flex flexDirection="column" gap="xxl" .padding=${["l","xl","xl","xl"]}>
        ${this.allAccounts.map(((e,t)=>this.getAddressTemplate(e,t)))}
      </wui-flex>
    `}getAddressTemplate(e,t){const i=this.labels?.get(e.address),o=a.state.activeChain,n=h.getConnectorId(o)===g.CONNECTOR_ID.AUTH;return r`
      <wui-flex
        flexDirection="row"
        justifyContent="space-between"
        data-testid="switch-address-item"
      >
        <wui-flex alignItems="center">
          <wui-avatar address=${e.address}></wui-avatar>
          ${n?r`<wui-icon-box
                size="sm"
                iconcolor="fg-200"
                backgroundcolor="glass-002"
                background="gray"
                icon="${this.getAddressIcon(e.type)}"
                ?border=${!0}
              ></wui-icon-box>`:r`<wui-flex .padding="${["0","0","0","s"]}"></wui-flex>`}
          <wui-flex flexDirection="column">
            <wui-text class="address" variant="paragraph-500" color="fg-100"
              >${i||P.getTruncateString({string:e.address,charsStart:4,charsEnd:6,truncate:"middle"})}</wui-text
            >
            <wui-text class="address-description" variant="small-400">
              ${"number"==typeof this.balances[e.address]?`$${this.balances[e.address]?.toFixed(2)}`:r`<wui-loading-spinner size="sm" color="accent-100"></wui-loading-spinner>`}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-flex gap="s" alignItems="center">
          ${e.address?.toLowerCase()===this.currentAddress?.toLowerCase()?"":r`
                <wui-button
                  data-testid=${`w3m-switch-address-button-${t}`}
                  textVariant="small-600"
                  size="md"
                  variant="accent"
                  @click=${()=>this.onSwitchAddress(e.address)}
                  >Switch to</wui-button
                >
              `}
        </wui-flex>
      </wui-flex>
    `}onSwitchAddress(e){const t=a.state.activeCaipNetwork,i=t?.chainNamespace,o=`${i}:${t?.id}:${e}`;c.setCaipAddress(o,i),u.close()}};vt.styles=bt,mt([D()],vt.prototype,"allAccounts",void 0),mt([D()],vt.prototype,"balances",void 0),vt=mt([j("w3m-switch-address-view")],vt);var xt=e`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`,yt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let kt=class extends o{constructor(){super(...arguments),this.inputElementRef=L(),this.checked=void 0}render(){return r`
      <label>
        <input
          ${z(this.inputElementRef)}
          type="checkbox"
          ?checked=${_(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};kt.styles=[t,i,$,xt],yt([N({type:Boolean})],kt.prototype,"checked",void 0),kt=yt([j("wui-switch")],kt);var Ct=e`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`,$t=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let St=class extends o{constructor(){super(...arguments),this.checked=void 0}render(){return r`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${_(this.checked)}></wui-switch>
      </button>
    `}};St.styles=[t,i,Ct],$t([N({type:Boolean})],St.prototype,"checked",void 0),St=$t([j("wui-certified-switch")],St);var Tt=e`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`,Rt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let It=class extends o{constructor(){super(...arguments),this.icon="copy"}render(){return r`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};It.styles=[t,i,Tt],Rt([N()],It.prototype,"icon",void 0),It=Rt([j("wui-input-element")],It);var Ot=e`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`,At=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Et=class extends o{constructor(){super(...arguments),this.inputComponentRef=L()}render(){return r`
      <wui-input-text
        ${z(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){const e=this.inputComponentRef.value,t=e?.inputElementRef.value;t&&(t.value="",t.focus(),t.dispatchEvent(new Event("input")))}};Et.styles=[t,Ot],Et=At([j("wui-search-bar")],Et);const Nt=S`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`;var jt=e`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`,_t=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Pt=class extends o{constructor(){super(...arguments),this.type="wallet"}render(){return r`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?r` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${Nt}`:r`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};Pt.styles=[t,i,jt],_t([N()],Pt.prototype,"type",void 0),Pt=_t([j("wui-card-select-loader")],Pt);var Dt=e`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`,Ut=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Lt=class extends o{render(){return this.style.cssText=`\n      grid-template-rows: ${this.gridTemplateRows};\n      grid-template-columns: ${this.gridTemplateColumns};\n      justify-items: ${this.justifyItems};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      align-content: ${this.alignContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&P.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&P.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&P.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&P.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&P.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&P.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&P.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&P.getSpacingStyles(this.margin,3)};\n    `,r`<slot></slot>`}};Lt.styles=[t,Dt],Ut([N()],Lt.prototype,"gridTemplateRows",void 0),Ut([N()],Lt.prototype,"gridTemplateColumns",void 0),Ut([N()],Lt.prototype,"justifyItems",void 0),Ut([N()],Lt.prototype,"alignItems",void 0),Ut([N()],Lt.prototype,"justifyContent",void 0),Ut([N()],Lt.prototype,"alignContent",void 0),Ut([N()],Lt.prototype,"columnGap",void 0),Ut([N()],Lt.prototype,"rowGap",void 0),Ut([N()],Lt.prototype,"gap",void 0),Ut([N()],Lt.prototype,"padding",void 0),Ut([N()],Lt.prototype,"margin",void 0),Lt=Ut([j("wui-grid")],Lt);var zt=e`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`,Wt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Bt=class extends o{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let e="xxs";return e="lg"===this.size?"m":"md"===this.size?"xs":"xxs",this.style.cssText=`\n       --local-border-radius: var(--wui-border-radius-${e});\n       --local-size: var(--wui-wallet-image-size-${this.size});\n   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),r`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?r`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?r`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:r`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};Bt.styles=[i,t,zt],Wt([N()],Bt.prototype,"size",void 0),Wt([N()],Bt.prototype,"name",void 0),Wt([N()],Bt.prototype,"imageSrc",void 0),Wt([N()],Bt.prototype,"walletIcon",void 0),Wt([N({type:Boolean})],Bt.prototype,"installed",void 0),Wt([N()],Bt.prototype,"badgeSize",void 0),Bt=Wt([j("wui-wallet-image")],Bt);var Mt=e`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`,Vt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ht=class extends o{constructor(){super(),this.observer=new IntersectionObserver((()=>{})),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1}))}),{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){const e="certified"===this.wallet?.badge_type;return r`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${_(e?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?r`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():r`
      <wui-wallet-image
        size="md"
        imageSrc=${_(this.imageSrc)}
        name=${this.wallet?.name}
        .installed=${this.wallet?.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return r`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=n.getWalletImage(this.wallet),this.imageSrc||(this.imageLoading=!0,this.imageSrc=await n.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};Ht.styles=Mt,Vt([D()],Ht.prototype,"visible",void 0),Vt([D()],Ht.prototype,"imageSrc",void 0),Vt([D()],Ht.prototype,"imageLoading",void 0),Vt([N()],Ht.prototype,"wallet",void 0),Ht=Vt([j("w3m-all-wallets-list-item")],Ht);var Kt=e`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`,qt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const Ft="local-paginator";let Gt=class extends o{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!T.state.wallets.length,this.wallets=T.state.wallets,this.recommended=T.state.recommended,this.featured=T.state.featured,this.unsubscribe.push(T.subscribeKey("wallets",(e=>this.wallets=e)),T.subscribeKey("recommended",(e=>this.recommended=e)),T.subscribeKey("featured",(e=>this.featured=e)))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),this.paginationObserver?.disconnect()}render(){return r`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;const e=this.shadowRoot?.querySelector("wui-grid");e&&(await T.fetchWallets({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,t){return[...Array(e)].map((()=>r`
        <wui-card-select-loader type="wallet" id=${_(t)}></wui-card-select-loader>
      `))}walletsTemplate(){const e=d.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id");return R.markWalletsAsInstalled(e).map((e=>r`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
        ></w3m-all-wallets-list-item>
      `))}paginationLoaderTemplate(){const{wallets:e,recommended:t,featured:i,count:o}=T.state,r=window.innerWidth<352?3:4,a=e.length+t.length;let n=Math.ceil(a/r)*r-a+r;return n-=e.length?i.length%r:0,0===o&&i.length>0?null:0===o||[...i,...e,...t].length<o?this.shimmerTemplate(n,Ft):null}createPaginationObserver(){const e=this.shadowRoot?.querySelector(`#${Ft}`);e&&(this.paginationObserver=new IntersectionObserver((([e])=>{if(e?.isIntersecting&&!this.loading){const{page:e,count:t,wallets:i}=T.state;i.length<t&&T.fetchWallets({page:e+1})}})),this.paginationObserver.observe(e))}onConnectWallet(e){h.selectWalletConnector(e)}};Gt.styles=Kt,qt([D()],Gt.prototype,"loading",void 0),qt([D()],Gt.prototype,"wallets",void 0),qt([D()],Gt.prototype,"recommended",void 0),qt([D()],Gt.prototype,"featured",void 0),Gt=qt([j("w3m-all-wallets-list")],Gt);var Yt=e`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`,Xt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Qt=class extends o{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?r`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){this.query.trim()===this.prevQuery.trim()&&this.badge===this.prevBadge||(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await T.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){const{search:e}=T.state,t=R.markWalletsAsInstalled(e);return e.length?r`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${t.map((e=>r`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(e)}
              .wallet=${e}
              data-testid="wallet-search-item-${e.id}"
            ></w3m-all-wallets-list-item>
          `))}
      </wui-grid>
    `:r`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){h.selectWalletConnector(e)}};Qt.styles=Yt,Xt([D()],Qt.prototype,"loading",void 0),Xt([N()],Qt.prototype,"query",void 0),Xt([N()],Qt.prototype,"badge",void 0),Qt=Xt([j("w3m-all-wallets-search")],Qt);var Zt=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Jt=class extends o{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=d.debounce((e=>{this.search=e}))}render(){const e=this.search.length>=2;return r`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?r`<w3m-all-wallets-search
            query=${this.search}
            badge=${_(this.badge)}
          ></w3m-all-wallets-search>`:r`<w3m-all-wallets-list badge=${_(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onClick(){"certified"!==this.badge?(this.badge="certified",m.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return d.isMobile()?r`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){f.push("ConnectingWalletConnect")}};Zt([D()],Jt.prototype,"search",void 0),Zt([D()],Jt.prototype,"badge",void 0),Jt=Zt([j("w3m-all-wallets-view")],Jt);var ei=e`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 16.5px var(--wui-spacing-l) 16.5px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
    justify-content: center;
    align-items: center;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`,ti=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ii=class extends o{constructor(){super(...arguments),this.text="",this.disabled=!1,this.tabIdx=void 0}render(){return r`
      <button ?disabled=${this.disabled} tabindex=${_(this.tabIdx)}>
        <wui-text align="center" variant="paragraph-500" color="inherit">${this.text}</wui-text>
      </button>
    `}};ii.styles=[t,i,ei],ti([N()],ii.prototype,"text",void 0),ti([N({type:Boolean})],ii.prototype,"disabled",void 0),ti([N()],ii.prototype,"tabIdx",void 0),ii=ti([j("wui-list-button")],ii);var oi=e`
  wui-separator {
    margin: var(--wui-spacing-s) calc(var(--wui-spacing-s) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }

  wui-icon-link,
  wui-loading-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  wui-icon-link {
    right: var(--wui-spacing-xs);
  }

  wui-loading-spinner {
    right: var(--wui-spacing-m);
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`,ri=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ai=class extends o{constructor(){super(...arguments),this.unsubscribe=[],this.formRef=L(),this.email="",this.loading=!1,this.error=""}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}firstUpdated(){this.formRef.value?.addEventListener("keydown",(e=>{"Enter"===e.key&&this.onSubmitEmail(e)}))}render(){return r`
      <form ${z(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${_(this.tabIdx)}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?r`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?r`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:null}templateError(){return this.error?r`<wui-text variant="tiny-500" color="error-100">${this.error}</wui-text>`:null}onEmailInputChange(e){this.email=e.detail.trim(),this.error=""}async onSubmitEmail(e){if(!g.AUTH_CONNECTOR_SUPPORTED_CHAINS.find((e=>e===a.state.activeChain))){const e=a.getFirstCaipNetworkSupportsAuthConnector();if(e)return void f.push("SwitchNetwork",{network:e})}try{if(this.loading)return;this.loading=!0,e.preventDefault();const t=h.getAuthConnector();if(!t)throw new Error("w3m-email-login-widget: Auth connector not found");const{action:i}=await t.provider.connectEmail({email:this.email});p.sendEvent({type:"track",event:"EMAIL_SUBMITTED"}),"VERIFY_OTP"===i?(p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),f.push("EmailVerifyOtp",{email:this.email})):"VERIFY_DEVICE"===i?f.push("EmailVerifyDevice",{email:this.email}):"CONNECT"===i&&(await x.connectExternal(t,a.state.activeChain),f.replace("Account"))}catch(e){const t=d.parseError(e);t?.includes("Invalid email")?this.error="Invalid email. Try again.":m.showError(e)}finally{this.loading=!1}}onFocusEvent(){p.sendEvent({type:"track",event:"EMAIL_LOGIN_SELECTED"})}};ai.styles=oi,ri([N()],ai.prototype,"tabIdx",void 0),ri([D()],ai.prototype,"email",void 0),ri([D()],ai.prototype,"loading",void 0),ri([D()],ai.prototype,"error",void 0),ai=ri([j("w3m-email-login-widget")],ai);var ni=e`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 56px;
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`,si=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let li=class extends o{constructor(){super(...arguments),this.logo="google",this.disabled=!1,this.tabIdx=void 0}render(){return r`
      <button ?disabled=${this.disabled} tabindex=${_(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
      </button>
    `}};li.styles=[t,i,ni],si([N()],li.prototype,"logo",void 0),si([N({type:Boolean})],li.prototype,"disabled",void 0),si([N()],li.prototype,"tabIdx",void 0),li=si([j("wui-logo-select")],li);var ci=e`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-m)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`,di=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ui=class extends o{constructor(){super(),this.unsubscribe=[],this.walletGuide="get-started",this.tabIdx=void 0,this.connectors=h.state.connectors,this.features=s.state.features,this.authConnector=this.connectors.find((e=>"AUTH"===e.type)),this.unsubscribe.push(h.subscribeKey("connectors",(e=>{this.connectors=e,this.authConnector=this.connectors.find((e=>"AUTH"===e.type))})),s.subscribeKey("features",(e=>this.features=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="xs"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){const e="explore"===this.walletGuide;let t=this.features?.socials;return!t&&e?(t=b.DEFAULT_FEATURES.socials,this.renderTopViewContent(t)):t?this.renderTopViewContent(t):null}renderTopViewContent(e){return 2===e.length?r` <wui-flex gap="xs">
        ${e.slice(0,2).map((e=>r`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${_(this.tabIdx)}
            ></wui-logo-select>`))}
      </wui-flex>`:r` <wui-list-social
      data-testid=${`social-selector-${e[0]}`}
      @click=${()=>{this.onSocialClick(e[0])}}
      logo=${_(e[0])}
      align="center"
      name=${`Continue with ${e[0]}`}
      tabIdx=${_(this.tabIdx)}
    ></wui-list-social>`}bottomViewTemplate(){let e=this.features?.socials;const t="explore"===this.walletGuide;return(!this.authConnector||!e||!e?.length)&&t&&(e=b.DEFAULT_FEATURES.socials),e?e.length<=2?null:e&&e.length>6?r`<wui-flex gap="xs">
        ${e.slice(1,5).map((e=>r`<wui-logo-select
              data-testid=${`social-selector-${e}`}
              @click=${()=>{this.onSocialClick(e)}}
              logo=${e}
              tabIdx=${_(this.tabIdx)}
            ></wui-logo-select>`))}
        <wui-logo-select
          logo="more"
          tabIdx=${_(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
        ></wui-logo-select>
      </wui-flex>`:e?r`<wui-flex gap="xs">
      ${e.slice(1,e.length).map((e=>r`<wui-logo-select
            data-testid=${`social-selector-${e}`}
            @click=${()=>{this.onSocialClick(e)}}
            logo=${e}
            tabIdx=${_(this.tabIdx)}
          ></wui-logo-select>`))}
    </wui-flex>`:null:null}onMoreSocialsClick(){f.push("ConnectSocials")}async onSocialClick(e){if(!g.AUTH_CONNECTOR_SUPPORTED_CHAINS.find((e=>e===a.state.activeChain))){const e=a.getFirstCaipNetworkSupportsAuthConnector();if(e)return void f.push("SwitchNetwork",{network:e})}e&&await M(e)}};ui.styles=ci,di([N()],ui.prototype,"walletGuide",void 0),di([N()],ui.prototype,"tabIdx",void 0),di([D()],ui.prototype,"connectors",void 0),di([D()],ui.prototype,"features",void 0),di([D()],ui.prototype,"authConnector",void 0),ui=di([j("w3m-social-login-widget")],ui);var pi=e`
  :host {
    padding-bottom: var(--wui-spacing-s);
  }
  wui-flex {
    width: 100%;
  }

  .wallet-guide {
    width: 100%;
  }

  .chip-box {
    width: fit-content;
    background-color: var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }
`,wi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let hi=class extends o{constructor(){super(...arguments),this.walletGuide="get-started"}render(){return"explore"===this.walletGuide?r`<wui-flex
          class="wallet-guide"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap="xs"
          data-testid="w3m-wallet-guide-explore"
        >
          <wui-text variant="small-400" color="fg-200" align="center">
            Looking for a self-custody wallet?
          </wui-text>

          <wui-flex class="chip-box">
            <wui-chip
              imageIcon="walletConnectLightBrown"
              icon="externalLink"
              variant="transparent"
              href="https://walletguide.walletconnect.network"
              title="Find one on WalletGuide"
            ></wui-chip>
          </wui-flex>
        </wui-flex>`:r`<wui-flex
          columnGap="4xs"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          .padding=${["s","0","s","0"]}
        >
          <wui-text variant="small-400" class="title" color="fg-200"
            >Haven't got a wallet?</wui-text
          >
          <wui-link
            data-testid="w3m-wallet-guide-get-started"
            color="blue-100"
            class="get-started-link"
            @click=${this.onGetStarted}
            tabIdx=${_(this.tabIdx)}
          >
            Get started
          </wui-link>
        </wui-flex>`}onGetStarted(){f.push("Create")}};hi.styles=pi,wi([N()],hi.prototype,"tabIdx",void 0),wi([N()],hi.prototype,"walletGuide",void 0),hi=wi([j("w3m-wallet-guide")],hi);var gi=e`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`,fi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let bi=class extends o{constructor(){super(...arguments),this.walletImages=[]}render(){const e=this.walletImages.length<4;return r`${this.walletImages.slice(0,4).map((({src:e,walletName:t})=>r`
            <wui-wallet-image
              size="inherit"
              imageSrc=${e}
              name=${_(t)}
            ></wui-wallet-image>
          `))}
      ${e?[...Array(4-this.walletImages.length)].map((()=>r` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`)):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};bi.styles=[t,gi],fi([N({type:Array})],bi.prototype,"walletImages",void 0),bi=fi([j("wui-all-wallets-image")],bi);var mi=e`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`,vi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let xi=class extends o{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return r`
      <button ?disabled=${this.disabled} tabindex=${_(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?r` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?r` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?r`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:r`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.loading?r`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?r`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?r`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};xi.styles=[t,i,mi],vi([N({type:Array})],xi.prototype,"walletImages",void 0),vi([N()],xi.prototype,"imageSrc",void 0),vi([N()],xi.prototype,"name",void 0),vi([N()],xi.prototype,"tagLabel",void 0),vi([N()],xi.prototype,"tagVariant",void 0),vi([N()],xi.prototype,"icon",void 0),vi([N()],xi.prototype,"walletIcon",void 0),vi([N()],xi.prototype,"tabIdx",void 0),vi([N({type:Boolean})],xi.prototype,"installed",void 0),vi([N({type:Boolean})],xi.prototype,"disabled",void 0),vi([N({type:Boolean})],xi.prototype,"showAllWallets",void 0),vi([N({type:Boolean})],xi.prototype,"loading",void 0),vi([N({type:String})],xi.prototype,"loadingSpinnerColor",void 0),xi=vi([j("wui-list-wallet")],xi);var yi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ki=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.count=T.state.count,this.isFetchingRecommendedWallets=T.state.isFetchingRecommendedWallets,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e)),T.subscribeKey("count",(e=>this.count=e)),T.subscribeKey("isFetchingRecommendedWallets",(e=>this.isFetchingRecommendedWallets=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.connectors.find((e=>"walletConnect"===e.id)),{allWallets:t}=s.state;if(!e||"HIDE"===t)return null;if("ONLY_MOBILE"===t&&!d.isMobile())return null;const i=T.state.featured.length,o=this.count+i,a=o<10?o:10*Math.floor(o/10),n=a<o?`${a}+`:`${a}`;return r`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${n}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${_(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
      ></wui-list-wallet>
    `}onAllWallets(){p.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),f.push("AllWallets")}};yi([N()],ki.prototype,"tabIdx",void 0),yi([D()],ki.prototype,"connectors",void 0),yi([D()],ki.prototype,"count",void 0),yi([D()],ki.prototype,"isFetchingRecommendedWallets",void 0),ki=yi([j("w3m-all-wallets-widget")],ki);var Ci=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let $i=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.connectors.filter((e=>"ANNOUNCED"===e.type));return e?.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map((e=>e.info?.rdns&&T.state.excludedRDNS&&T.state.excludedRDNS.includes(e?.info?.rdns)?null:r`
            <wui-list-wallet
              imageSrc=${_(n.getConnectorImage(e))}
              name=${e.name??"Unknown"}
              @click=${()=>this.onConnector(e)}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${e.id}`}
              .installed=${!0}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){"walletConnect"===e.id?d.isMobile()?f.push("AllWallets"):f.push("ConnectingWalletConnect"):f.push("ConnectingExternal",{connector:e})}};Ci([N()],$i.prototype,"tabIdx",void 0),Ci([D()],$i.prototype,"connectors",void 0),$i=Ci([j("w3m-connect-announced-widget")],$i);var Si=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ti=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.loading=!1,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e))),d.isTelegram()&&d.isIos()&&(this.loading=!x.state.wcUri,this.unsubscribe.push(x.subscribeKey("wcUri",(e=>this.loading=!e))))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const{customWallets:e}=s.state;if(!e?.length)return this.style.cssText="display: none",null;const t=this.filterOutDuplicateWallets(e);return r`<wui-flex flexDirection="column" gap="xs">
      ${t.map((e=>r`
          <wui-list-wallet
            imageSrc=${_(n.getWalletImage(e))}
            name=${e.name??"Unknown"}
            @click=${()=>this.onConnectWallet(e)}
            data-testid=${`wallet-selector-${e.id}`}
            tabIdx=${_(this.tabIdx)}
            ?loading=${this.loading}
          >
          </wui-list-wallet>
        `))}
    </wui-flex>`}filterOutDuplicateWallets(e){const t=w.getRecentWallets(),i=this.connectors.map((e=>e.info?.rdns)).filter(Boolean),o=t.map((e=>e.rdns)).filter(Boolean),r=i.concat(o);if(r.includes("io.metamask.mobile")&&d.isMobile()){const e=r.indexOf("io.metamask.mobile");r[e]="io.metamask"}return e.filter((e=>!r.includes(String(e?.rdns))))}onConnectWallet(e){this.loading||f.push("ConnectingWalletConnect",{wallet:e})}};Si([N()],Ti.prototype,"tabIdx",void 0),Si([D()],Ti.prototype,"connectors",void 0),Si([D()],Ti.prototype,"loading",void 0),Ti=Si([j("w3m-connect-custom-widget")],Ti);var Ri=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ii=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.connectors.filter((e=>"EXTERNAL"===e.type)).filter((e=>e.id!==g.CONNECTOR_ID.COINBASE_SDK));return e?.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map((e=>r`
            <wui-list-wallet
              imageSrc=${_(n.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              data-testid=${`wallet-selector-external-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){f.push("ConnectingExternal",{connector:e})}};Ri([N()],Ii.prototype,"tabIdx",void 0),Ri([D()],Ii.prototype,"connectors",void 0),Ii=Ri([j("w3m-connect-external-widget")],Ii);var Oi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ai=class extends o{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){return this.wallets.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map((e=>r`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${e.id}`}
              imageSrc=${_(n.getWalletImage(e))}
              name=${e.name??"Unknown"}
              @click=${()=>this.onConnectWallet(e)}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(e){h.selectWalletConnector(e)}};Oi([N()],Ai.prototype,"tabIdx",void 0),Oi([N()],Ai.prototype,"wallets",void 0),Ai=Oi([j("w3m-connect-featured-widget")],Ai);var Ei=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ni=class extends o{constructor(){super(...arguments),this.tabIdx=void 0,this.connectors=[]}render(){const e=this.connectors;return!e?.length||1===e.length&&"Browser Wallet"===e[0]?.name&&!d.isMobile()?(this.style.cssText="display: none",null):r`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map((e=>{if(!d.isMobile()&&"Browser Wallet"===e.name)return null;const t=e.info?.rdns;return t||x.checkInstalled(void 0)?t&&T.state.excludedRDNS&&T.state.excludedRDNS.includes(t)?null:r`
            <wui-list-wallet
              imageSrc=${_(n.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `:(this.style.cssText="display: none",null)}))}
      </wui-flex>
    `}onConnector(e){h.setActiveConnector(e),f.push("ConnectingExternal",{connector:e})}};Ei([N()],Ni.prototype,"tabIdx",void 0),Ei([N()],Ni.prototype,"connectors",void 0),Ni=Ei([j("w3m-connect-injected-widget")],Ni);var ji=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let _i=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.connectors.filter((e=>"MULTI_CHAIN"===e.type&&"WalletConnect"!==e.name));return e?.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map((e=>r`
            <wui-list-wallet
              imageSrc=${_(n.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${_(this.tabIdx)}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){h.setActiveConnector(e),f.push("ConnectingMultiChain")}};ji([N()],_i.prototype,"tabIdx",void 0),ji([D()],_i.prototype,"connectors",void 0),_i=ji([j("w3m-connect-multi-chain-widget")],_i);var Pi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Di=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.loading=!1,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e))),d.isTelegram()&&d.isIos()&&(this.loading=!x.state.wcUri,this.unsubscribe.push(x.subscribeKey("wcUri",(e=>this.loading=!e))))}render(){const e=w.getRecentWallets().filter((e=>!this.connectors.some((t=>t.id===e.id||t.name===e.name))));return e.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map((e=>r`
            <wui-list-wallet
              imageSrc=${_(n.getWalletImage(e))}
              name=${e.name??"Unknown"}
              @click=${()=>this.onConnectWallet(e)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${_(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(e){this.loading||h.selectWalletConnector(e)}};Pi([N()],Di.prototype,"tabIdx",void 0),Pi([D()],Di.prototype,"connectors",void 0),Pi([D()],Di.prototype,"loading",void 0),Di=Pi([j("w3m-connect-recent-widget")],Di);var Ui=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Li=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,d.isTelegram()&&d.isIos()&&(this.loading=!x.state.wcUri,this.unsubscribe.push(x.subscribeKey("wcUri",(e=>this.loading=!e))))}render(){const{connectors:e}=h.state,{customWallets:t,featuredWalletIds:i}=s.state,o=w.getRecentWallets(),a=e.find((e=>"walletConnect"===e.id)),l=e.filter((e=>"INJECTED"===e.type||"ANNOUNCED"===e.type||"MULTI_CHAIN"===e.type)).filter((e=>"Browser Wallet"!==e.name));if(!a)return null;if(i||t||!this.wallets.length)return this.style.cssText="display: none",null;const c=l.length+o.length,d=Math.max(0,2-c),u=R.filterOutDuplicateWallets(this.wallets).slice(0,d);return u.length?r`
      <wui-flex flexDirection="column" gap="xs">
        ${u.map((e=>r`
            <wui-list-wallet
              imageSrc=${_(n.getWalletImage(e))}
              name=${e?.name??"Unknown"}
              @click=${()=>this.onConnectWallet(e)}
              tabIdx=${_(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `))}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(e){if(this.loading)return;const t=h.getConnector(e.id,e.rdns);t?f.push("ConnectingExternal",{connector:t}):f.push("ConnectingWalletConnect",{wallet:e})}};Ui([N()],Li.prototype,"tabIdx",void 0),Ui([N()],Li.prototype,"wallets",void 0),Ui([D()],Li.prototype,"loading",void 0),Li=Ui([j("w3m-connect-recommended-widget")],Li);var zi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Wi=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.connectorImages=l.state.connectorImages,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e)),l.subscribeKey("connectorImages",(e=>this.connectorImages=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){if(d.isMobile())return this.style.cssText="display: none",null;const e=this.connectors.find((e=>"walletConnect"===e.id));if(!e)return this.style.cssText="display: none",null;const t=e.imageUrl||this.connectorImages[e?.imageId??""];return r`
      <wui-list-wallet
        imageSrc=${_(t)}
        name=${e.name??"Unknown"}
        @click=${()=>this.onConnector(e)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${_(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `}onConnector(e){h.setActiveConnector(e),f.push("ConnectingWalletConnect")}};zi([N()],Wi.prototype,"tabIdx",void 0),zi([D()],Wi.prototype,"connectors",void 0),zi([D()],Wi.prototype,"connectorImages",void 0),Wi=zi([j("w3m-connect-walletconnect-widget")],Wi);var Bi=e`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`,Mi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Vi=class extends o{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=h.state.connectors,this.recommended=T.state.recommended,this.featured=T.state.featured,this.unsubscribe.push(h.subscribeKey("connectors",(e=>this.connectors=e)),T.subscribeKey("recommended",(e=>this.recommended=e)),T.subscribeKey("featured",(e=>this.featured=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){const{custom:e,recent:t,announced:i,injected:o,multiChain:a,recommended:n,featured:s,external:l}=I.getConnectorsByType(this.connectors,this.recommended,this.featured);return I.getConnectorTypeOrder({custom:e,recent:t,announced:i,injected:o,multiChain:a,recommended:n,featured:s,external:l}).map((e=>{switch(e){case"injected":return r`
            ${a.length?r`<w3m-connect-multi-chain-widget
                  tabIdx=${_(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${i.length?r`<w3m-connect-announced-widget
                  tabIdx=${_(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${o.length?r`<w3m-connect-injected-widget
                  .connectors=${o}
                  tabIdx=${_(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return r`<w3m-connect-walletconnect-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return r`<w3m-connect-recent-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return r`<w3m-connect-featured-widget
            .wallets=${s}
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return r`<w3m-connect-custom-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return r`<w3m-connect-external-widget
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return r`<w3m-connect-recommended-widget
            .wallets=${n}
            tabIdx=${_(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return console.warn(`Unknown connector type: ${e}`),null}}))}};Vi.styles=Bi,Mi([N()],Vi.prototype,"tabIdx",void 0),Mi([D()],Vi.prototype,"connectors",void 0),Mi([D()],Vi.prototype,"recommended",void 0),Mi([D()],Vi.prototype,"featured",void 0),Vi=Mi([j("w3m-connector-list")],Vi);var Hi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ki=class extends o{constructor(){super(...arguments),this.tabIdx=void 0}render(){return r`
      <wui-flex flexDirection="column" gap="xs">
        <w3m-connector-list tabIdx=${_(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${_(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};Hi([N()],Ki.prototype,"tabIdx",void 0),Ki=Hi([j("w3m-wallet-login-list")],Ki);var qi=e`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
    --connect-mask-image: none;
  }

  .connect {
    max-height: clamp(360px, 470px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  .connect::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .connect.disabled,
  .guide.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }

  wui-separator {
    margin: var(--wui-spacing-s) calc(var(--wui-spacing-s) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`,Fi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Gi=class extends o{constructor(){super(),this.unsubscribe=[],this.connectors=h.state.connectors,this.authConnector=this.connectors.find((e=>"AUTH"===e.type)),this.features=s.state.features,this.enableWallets=s.state.enableWallets,this.noAdapters=a.state.noAdapters,this.walletGuide="get-started",this.checked=!1,this.isEmailEnabled=this.features?.email&&!a.state.noAdapters,this.isSocialEnabled=this.features?.socials&&this.features.socials.length>0&&!a.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push(h.subscribeKey("connectors",(e=>{this.connectors=e,this.authConnector=this.connectors.find((e=>"AUTH"===e.type)),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})),s.subscribeKey("features",(e=>this.setEmailAndSocialEnableCheck(e,this.noAdapters))),s.subscribeKey("enableWallets",(e=>this.enableWallets=e)),a.subscribeKey("noAdapters",(e=>this.setEmailAndSocialEnableCheck(this.features,e))))}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),this.resizeObserver?.disconnect();const e=this.shadowRoot?.querySelector(".connect");e?.removeEventListener("scroll",this.handleConnectListScroll.bind(this))}firstUpdated(){const e=this.shadowRoot?.querySelector(".connect");e&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),e?.addEventListener("scroll",this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver((()=>{this.handleConnectListScroll()})),this.resizeObserver?.observe(e),this.handleConnectListScroll())}render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=s.state,i=s.state.features?.legalCheckbox,o=Boolean(e||t)&&Boolean(i)&&"get-started"===this.walletGuide&&!this.checked,a={connect:!0,disabled:o},n=s.state.enableWalletGuide,l=this.enableWallets,c=this.isSocialEnabled||this.authConnector,d=o?-1:void 0;return r`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          class=${U(a)}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="s"
            .padding=${c&&l&&n&&"get-started"===this.walletGuide?["3xs","s","0","s"]:["3xs","s","s","s"]}
          >
            ${this.renderConnectMethod(d)}
          </wui-flex>
        </wui-flex>
        ${this.guideTemplate(o)}
        <w3m-legal-footer></w3m-legal-footer>
      </wui-flex>
    `}setEmailAndSocialEnableCheck(e,t){this.isEmailEnabled=e?.email&&!t,this.isSocialEnabled=e?.socials&&e.socials.length>0&&!t,this.features=e,this.noAdapters=t}checkIfAuthEnabled(e){const t=e.filter((e=>e.type===O.CONNECTOR_TYPE_AUTH)).map((e=>e.chain));return g.AUTH_CONNECTOR_SUPPORTED_CHAINS.some((e=>t.includes(e)))}renderConnectMethod(e){const t=R.getConnectOrderMethod(this.features,this.connectors);return r`${t.map(((t,i)=>{switch(t){case"email":return r`${this.emailTemplate(e)} ${this.separatorTemplate(i,"email")}`;case"social":return r`${this.socialListTemplate(e)}
          ${this.separatorTemplate(i,"social")}`;case"wallet":return r`${this.walletListTemplate(e)}
          ${this.separatorTemplate(i,"wallet")}`;default:return null}}))}`}checkMethodEnabled(e){switch(e){case"wallet":return this.enableWallets;case"social":return this.isSocialEnabled&&this.isAuthEnabled;case"email":return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(e){const t=R.getConnectOrderMethod(this.features,this.connectors)[e+1];if(!t)return;return this.checkMethodEnabled(t)?t:this.checkIsThereNextMethod(e+1)}separatorTemplate(e,t){const i=this.checkIsThereNextMethod(e),o="explore"===this.walletGuide;switch(t){case"wallet":return this.enableWallets&&i&&!o?r`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case"email":{const e="social"===i;return this.isAuthEnabled&&this.isEmailEnabled&&!e&&i?r`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null}case"social":{const e="email"===i;return this.isAuthEnabled&&this.isSocialEnabled&&!e&&i?r`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null}default:return null}}emailTemplate(e){return this.isEmailEnabled&&this.isAuthEnabled?r`<w3m-email-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${_(e)}
    ></w3m-email-login-widget>`:null}socialListTemplate(e){return this.isSocialEnabled&&this.isAuthEnabled?r`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${_(e)}
    ></w3m-social-login-widget>`:null}walletListTemplate(e){const t=this.enableWallets,i=!1===this.features?.emailShowWallets,o=this.features?.collapseWallets,a=i||o;if(!t)return null;if((d.isTelegram()||d.isSafari())&&d.isIos()&&x.connectWalletConnect().catch((e=>({}))),"explore"===this.walletGuide)return null;return this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&a?r`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${_(e)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
      ></wui-list-button>`:r`<w3m-wallet-login-list tabIdx=${_(e)}></w3m-wallet-login-list>`}guideTemplate(e=!1){if(!s.state.enableWalletGuide)return null;const t={guide:!0,disabled:e},i=e?-1:void 0;return this.authConnector||this.isSocialEnabled?r`
      ${"explore"!==this.walletGuide||a.state.noAdapters?null:r`<wui-separator data-testid="wui-separator" id="explore" text="or"></wui-separator>`}
      <wui-flex flexDirection="column" .padding=${["l","0","0","0"]} class=${U(t)}>
        <w3m-wallet-guide
          tabIdx=${_(i)}
          walletGuide=${this.walletGuide}
        ></w3m-wallet-guide>
      </wui-flex>
    `:null}legalCheckboxTemplate(){return"explore"===this.walletGuide?null:r`<w3m-legal-checkbox
      @checkboxChange=${this.onCheckboxChange.bind(this)}
      data-testid="w3m-legal-checkbox"
    ></w3m-legal-checkbox>`}handleConnectListScroll(){const e=this.shadowRoot?.querySelector(".connect");if(!e)return;e.scrollHeight>470?(e.style.setProperty("--connect-mask-image","linear-gradient(\n          to bottom,\n          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,\n          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,\n          black 40px,\n          black calc(100% - 40px),\n          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),\n          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%\n        )"),e.style.setProperty("--connect-scroll--top-opacity",B.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",B.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--connect-mask-image","none"),e.style.setProperty("--connect-scroll--top-opacity","0"),e.style.setProperty("--connect-scroll--bottom-opacity","0"))}onContinueWalletClick(){f.push("ConnectWallets")}onCheckboxChange(e){this.checked=Boolean(e.detail)}};Gi.styles=qi,Fi([D()],Gi.prototype,"connectors",void 0),Fi([D()],Gi.prototype,"authConnector",void 0),Fi([D()],Gi.prototype,"features",void 0),Fi([D()],Gi.prototype,"enableWallets",void 0),Fi([D()],Gi.prototype,"noAdapters",void 0),Fi([N()],Gi.prototype,"walletGuide",void 0),Fi([D()],Gi.prototype,"checked",void 0),Fi([D()],Gi.prototype,"isEmailEnabled",void 0),Fi([D()],Gi.prototype,"isSocialEnabled",void 0),Fi([D()],Gi.prototype,"isAuthEnabled",void 0),Gi=Fi([j("w3m-connect-view")],Gi);var Yi=e`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`,Xi=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Qi=class extends o{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return r`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};Qi.styles=[t,i,Yi],Xi([N({type:Boolean})],Qi.prototype,"disabled",void 0),Xi([N()],Qi.prototype,"label",void 0),Xi([N()],Qi.prototype,"buttonLabel",void 0),Qi=Xi([j("wui-cta-button")],Qi);var Zi=e`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`,Ji=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let eo=class extends o{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:e,app_store:t,play_store:i,chrome_store:o,homepage:a}=this.wallet,n=d.isMobile(),s=d.isIos(),l=d.isAndroid(),c=[t,i,a,o].filter(Boolean).length>1,u=P.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return c&&!n?r`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${()=>f.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!c&&a?r`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:t&&s?r`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:i&&l?r`
        <wui-cta-button
          label=${`Don't have ${u}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&d.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&d.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&d.openHref(this.wallet.homepage,"_blank")}};eo.styles=[Zi],Ji([N({type:Object})],eo.prototype,"wallet",void 0),eo=Ji([j("w3m-mobile-download-links")],eo);var to=e`
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
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`,io=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};class oo extends o{constructor(){super(),this.wallet=f.state.data?.wallet,this.connector=f.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=n.getWalletImage(this.wallet)??n.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=x.state.wcUri,this.error=x.state.wcError,this.ready=!1,this.showRetry=!1,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.buffering=!1,this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(x.subscribeKey("wcUri",(e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())})),x.subscribeKey("wcError",(e=>this.error=e)),x.subscribeKey("buffering",(e=>this.buffering=e))),(d.isTelegram()||d.isSafari())&&d.isIos()&&x.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();const e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let t=`Continue in ${this.name}`;return this.buffering&&(t="Connecting..."),this.error&&(t="Connection declined"),r`
      <wui-flex
        data-error=${_(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${_(this.imageSrc)}></wui-wallet-image>

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
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${t}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?r`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||!this.error&&this.buffering||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?r`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;const e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){this.buffering||(x.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.())}loaderTemplate(){const e=A.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return r`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(d.copyToClopboard(this.uri),m.showSuccess("Link copied"))}catch{m.showError("Failed to copy")}}}oo.styles=to,io([D()],oo.prototype,"isRetrying",void 0),io([D()],oo.prototype,"uri",void 0),io([D()],oo.prototype,"error",void 0),io([D()],oo.prototype,"ready",void 0),io([D()],oo.prototype,"showRetry",void 0),io([D()],oo.prototype,"secondaryBtnLabel",void 0),io([D()],oo.prototype,"secondaryLabel",void 0),io([D()],oo.prototype,"buffering",void 0),io([D()],oo.prototype,"isLoading",void 0),io([N({type:Boolean})],oo.prototype,"isMobile",void 0),io([N()],oo.prototype,"onRetry",void 0);var ro=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ao=class extends oo{constructor(){if(super(),this.externalViewUnsubscribe=[],!this.connector)throw new Error("w3m-connecting-view: No connector provided");p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:"browser"}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push(a.subscribeKey("activeCaipAddress",(e=>{e&&u.close()})))}disconnectedCallback(){this.externalViewUnsubscribe.forEach((e=>e()))}async onConnectProxy(){try{this.error=!1,this.connector&&(this.connector.id===g.CONNECTOR_ID.COINBASE_SDK&&this.error||(await x.connectExternal(this.connector,this.connector.chain),p.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.connector.name||"Unknown"}})))}catch(e){p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};ao=ro([j("w3m-connecting-external-view")],ao);var no=e`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`,so=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let lo=class extends o{constructor(){super(),this.unsubscribe=[],this.activeConnector=h.state.activeConnector,this.unsubscribe.push(h.subscribeKey("activeConnector",(e=>this.activeConnector=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["m","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${_(n.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="xs"
          .padding=${["0","s","0","s"]}
        >
          <wui-text variant="paragraph-500" color="fg-100">
            Select Chain for ${this.activeConnector?.name}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="xs"
          .padding=${["xs","0","xs","0"]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){return this.activeConnector?.connectors?.map((e=>e.name?r`
            <wui-list-wallet
              imageSrc=${_(n.getChainImage(e.chain))}
              name=${g.CHAIN_NAME_MAP[e.chain]}
              @click=${()=>this.onConnector(e)}
              data-testid="wui-list-chain-${e.chain}"
            ></wui-list-wallet>
          `:null))}onConnector(e){const t=this.activeConnector?.connectors?.find((t=>t.chain===e.chain));t?"walletConnect"===t.id?d.isMobile()?f.push("AllWallets"):f.push("ConnectingWalletConnect"):f.push("ConnectingExternal",{connector:t}):m.showError("Failed to find connector")}};lo.styles=no,so([D()],lo.prototype,"activeConnector",void 0),lo=so([j("w3m-connecting-multi-chain-view")],lo);var co=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let uo=class extends o{constructor(){super(),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0,this.buffering=!1,this.unsubscribe.push(x.subscribeKey("buffering",(e=>this.buffering=e)))}disconnectCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.generateTabs();return r`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs
          ?disabled=${this.buffering}
          .tabs=${e}
          .onTabChange=${this.onTabChange.bind(this)}
        ></wui-tabs>
      </wui-flex>
    `}generateTabs(){const e=this.platforms.map((e=>"browser"===e?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===e?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===e?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===e?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===e?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"}));return this.platformTabs=e.map((({platform:e})=>e)),e}onTabChange(e){const t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};co([N({type:Array})],uo.prototype,"platforms",void 0),co([N()],uo.prototype,"onSelectPlatfrom",void 0),co([D()],uo.prototype,"buffering",void 0),uo=co([j("w3m-connecting-header")],uo);var po=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let wo=class extends oo{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){try{this.error=!1;const{connectors:e}=h.state,t=e.find((e=>"ANNOUNCED"===e.type&&e.info?.rdns===this.wallet?.rdns||"INJECTED"===e.type||e.name===this.wallet?.name));if(!t)throw new Error("w3m-connecting-wc-browser: No connector found");await x.connectExternal(t,t.chain),u.close(),p.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown"}})}catch(e){p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};wo=po([j("w3m-connecting-wc-browser")],wo);var ho=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let go=class extends oo{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;const{desktop_link:e,name:t}=this.wallet,{redirect:i,href:o}=d.formatNativeUrl(e,this.uri);x.setWcLinking({name:t,href:o}),x.setRecentWallet(this.wallet),d.openHref(i,"_blank")}catch{this.error=!0}}};go=ho([j("w3m-connecting-wc-desktop")],go);var fo=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let bo=class extends oo{constructor(){if(super(),this.btnLabelTimeout=void 0,this.labelTimeout=void 0,this.onRender=()=>{!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())},this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;const{mobile_link:e,name:t}=this.wallet,{redirect:i,href:o}=d.formatNativeUrl(e,this.uri);x.setWcLinking({name:t,href:o}),x.setRecentWallet(this.wallet);const r=d.isIframe()?"_top":"_self";d.openHref(i,r),clearTimeout(this.labelTimeout),this.secondaryLabel=b.CONNECT_LABELS.MOBILE}catch(e){p.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:e instanceof Error?e.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel=void 0,this.secondaryLabel=b.CONNECT_LABELS.MOBILE,document.addEventListener("visibilitychange",this.onBuffering.bind(this)),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}}),this.btnLabelTimeout=setTimeout((()=>{this.secondaryBtnLabel="Try again",this.secondaryLabel=b.CONNECT_LABELS.MOBILE}),b.FIVE_SEC_MS),this.labelTimeout=setTimeout((()=>{this.secondaryLabel="Hold tight... it's taking longer than expected"}),b.THREE_SEC_MS)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this.onBuffering.bind(this)),clearTimeout(this.btnLabelTimeout),clearTimeout(this.labelTimeout)}onBuffering(){const e=d.isIos();"visible"===document?.visibilityState&&!this.error&&e&&(x.setBuffering(!0),setTimeout((()=>{x.setBuffering(!1)}),5e3))}onTryAgain(){this.buffering||(x.setWcError(!1),this.onConnect())}};bo=fo([j("w3m-connecting-wc-mobile")],bo);var mo=e`
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
`,vo=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let xo=class extends oo{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach((e=>e())),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),r`
      <wui-flex
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
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout((()=>{this.ready=!0}),200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const e=this.getBoundingClientRect().width-40,t=this.wallet?this.wallet.name:void 0;return x.setWcLinking(void 0),x.setRecentWallet(this.wallet),r` <wui-qr-code
      size=${e}
      theme=${A.state.themeMode}
      uri=${this.uri}
      imageSrc=${_(n.getWalletImage(this.wallet))}
      color=${_(A.state.themeVariables["--w3m-qr-color"])}
      alt=${_(t)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){const e=!this.uri||!this.ready;return r`<wui-link
      .disabled=${e}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};xo.styles=mo,xo=vo([j("w3m-connecting-wc-qrcode")],xo);var yo=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let ko=class extends o{constructor(){if(super(),this.wallet=f.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return r`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${_(n.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};ko=yo([j("w3m-connecting-wc-unsupported")],ko);var Co=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let $o=class extends oo{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel="Open and continue in a new browser tab",this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(x.subscribeKey("wcUri",(()=>{this.updateLoadingState()}))),p.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;const{webapp_link:e,name:t}=this.wallet,{redirect:i,href:o}=d.formatUniversalUrl(e,this.uri);x.setWcLinking({name:t,href:o}),x.setRecentWallet(this.wallet),d.openHref(i,"_blank")}catch{this.error=!0}}};Co([D()],$o.prototype,"isLoading",void 0),$o=Co([j("w3m-connecting-wc-web")],$o);var So=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let To=class extends o{constructor(){super(),this.wallet=f.state.data?.wallet,this.platform=void 0,this.platforms=[],this.isSiwxEnabled=Boolean(s.state.siwx),this.determinePlatforms(),this.initializeConnection()}render(){return r`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      <wui-ux-by-reown></wui-ux-by-reown>
    `}async initializeConnection(e=!1){if("browser"!==this.platform&&(!s.state.manualWCControl||e))try{const{wcPairingExpiry:t,status:i}=x.state;(e||d.isPairingExpired(t)||"connecting"===i)&&(await x.connectWalletConnect(),this.isSiwxEnabled||u.close())}catch(e){p.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),x.setWcError(!0),m.showError(e.message??"Connection error"),x.resetWcConnection(),f.goBack()}}determinePlatforms(){if(!this.wallet)return this.platforms.push("qrcode"),void(this.platform="qrcode");if(this.platform)return;const{mobile_link:e,desktop_link:t,webapp_link:i,injected:o,rdns:r}=this.wallet,n=o?.map((({injected_id:e})=>e)).filter(Boolean),l=[...r?[r]:n??[]],c=!s.state.isUniversalProvider&&l.length,u=e,p=i,w=x.checkInstalled(l),h=c&&w,g=t&&!d.isMobile();h&&!a.state.noAdapters&&this.platforms.push("browser"),u&&this.platforms.push(d.isMobile()?"mobile":"qrcode"),p&&this.platforms.push("web"),g&&this.platforms.push("desktop"),h||!c||a.state.noAdapters||this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return r`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return r`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return r`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return r`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return r`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return r`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?r`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){const t=this.shadowRoot?.querySelector("div");t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};So([D()],To.prototype,"platform",void 0),So([D()],To.prototype,"platforms",void 0),So([D()],To.prototype,"isSiwxEnabled",void 0),To=So([j("w3m-connecting-wc-view")],To);var Ro=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Io=class extends o{constructor(){super(...arguments),this.isMobile=d.isMobile()}render(){if(this.isMobile){const{featured:e,recommended:t}=T.state,{customWallets:i}=s.state,o=w.getRecentWallets(),a=e.length||t.length||i?.length||o.length;return r`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${a?r`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return r`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};Ro([D()],Io.prototype,"isMobile",void 0),Io=Ro([j("w3m-connecting-wc-basic-view")],Io);var Oo=e`
  .continue-button-container {
    width: 100%;
  }
`,Ao=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Eo=class extends o{constructor(){super(...arguments),this.loading=!1}render(){return r`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="xxl"
        .padding=${["0","0","l","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{d.openHref(V.URLS.FAQ,"_blank")}}
        >
          Learn more about names
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return r` <wui-flex
      flexDirection="column"
      gap="xxl"
      alignItems="center"
      .padding=${["0","xxl","0","xxl"]}
    >
      <wui-flex gap="s" alignItems="center" justifyContent="center">
        <wui-icon-box
          icon="id"
          size="xl"
          iconSize="xxl"
          iconColor="fg-200"
          backgroundColor="fg-200"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="s">
        <wui-text align="center" variant="medium-600" color="fg-100">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="paragraph-400" color="fg-100">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return r`<wui-flex
      .padding=${["0","2l","0","2l"]}
      gap="s"
      class="continue-button-container"
    >
      <wui-button
        fullWidth
        .loading=${this.loading}
        size="lg"
        borderRadius="xs"
        @click=${this.handleContinue.bind(this)}
        >Choose name
      </wui-button>
    </wui-flex>`}handleContinue(){f.push("RegisterAccountName"),p.sendEvent({type:"track",event:"OPEN_ENS_FLOW",properties:{isSmartAccount:c.state.preferredAccountType===v.ACCOUNT_TYPES.SMART_ACCOUNT}})}};Eo.styles=Oo,Ao([D()],Eo.prototype,"loading",void 0),Eo=Ao([j("w3m-choose-account-name-view")],Eo);var No=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let jo=class extends o{constructor(){super(...arguments),this.wallet=f.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return r`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?r`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?r`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?r`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?r`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&d.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&d.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&d.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&d.openHref(this.wallet.homepage,"_blank")}};jo=No([j("w3m-downloads-view")],jo);var _o=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Po=class extends o{render(){return r`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.recommendedWalletsTemplate()}
        <wui-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          @click=${()=>{d.openHref("https://walletconnect.com/explorer?type=wallet","_blank")}}
        ></wui-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){const{recommended:e,featured:t}=T.state,{customWallets:i}=s.state;return[...t,...i??[],...e].slice(0,4).map((e=>r`
        <wui-list-wallet
          name=${e.name??"Unknown"}
          tagVariant="main"
          imageSrc=${_(n.getWalletImage(e))}
          @click=${()=>{d.openHref(e.homepage??"https://walletconnect.com/explorer","_blank")}}
        ></wui-list-wallet>
      `))}};Po=_o([j("w3m-get-wallet-view")],Po);var Do=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Uo=class extends o{constructor(){super(...arguments),this.data=[]}render(){return r`
      <wui-flex flexDirection="column" alignItems="center" gap="l">
        ${this.data.map((e=>r`
            <wui-flex flexDirection="column" alignItems="center" gap="xl">
              <wui-flex flexDirection="row" justifyContent="center" gap="1xs">
                ${e.images.map((e=>r`<wui-visual name=${e}></wui-visual>`))}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="xxs">
              <wui-text variant="paragraph-500" color="fg-100" align="center">
                ${e.title}
              </wui-text>
              <wui-text variant="small-500" color="fg-200" align="center">${e.text}</wui-text>
            </wui-flex>
          `))}
      </wui-flex>
    `}};Do([N({type:Array})],Uo.prototype,"data",void 0),Uo=Do([j("w3m-help-widget")],Uo);var Lo=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const zo=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}];let Wo=class extends o{render(){return r`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${zo}></w3m-help-widget>
        <wui-button variant="main" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){p.sendEvent({type:"track",event:"CLICK_GET_WALLET"}),f.push("GetWallet")}};Wo=Lo([j("w3m-what-is-a-wallet-view")],Wo);var Bo=e`
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
`,Mo=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Vo=class extends o{constructor(){super(...arguments),this.checked=!1}render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=s.state,i=s.state.features?.legalCheckbox,o=Boolean(e||t)&&Boolean(i),a=o&&!this.checked,n=a?-1:void 0;return r`
      <w3m-legal-checkbox @checkboxChange=${this.onCheckboxChange.bind(this)}></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${o?["0","s","s","s"]:"s"}
        gap="xs"
        class=${_(a?"disabled":void 0)}
      >
        <w3m-wallet-login-list tabIdx=${_(n)}></w3m-wallet-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}onCheckboxChange(e){this.checked=Boolean(e.detail)}};Vo.styles=Bo,Mo([D()],Vo.prototype,"checked",void 0),Vo=Mo([j("w3m-connect-wallets-view")],Vo);var Ho=e`
  :host {
    display: block;
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
  }

  svg {
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: var(--wui-color-accent-100);
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`,Ko=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let qo=class extends o{render(){return r`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};qo.styles=[t,Ho],qo=Ko([j("wui-loading-hexagon")],qo);const Fo=S`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`,Go=S`
  <svg fill="none" viewBox="0 0 36 40">
    <path
      d="M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z"
    />
  </svg>
`;var Yo=e`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-round='true']) {
    background: var(--wui-color-gray-glass-002);
    border-radius: 100%;
    outline: 1px solid var(--wui-color-gray-glass-005);
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    fill: var(--wui-color-gray-glass-002);
  }

  svg > path {
    stroke: var(--local-stroke);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: var(--wui-color-gray-glass-002);
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`,Xo=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Qo=class extends o{constructor(){super(...arguments),this.size="md",this.name="uknown",this.networkImagesBySize={sm:Go,md:Nt,lg:Fo},this.selected=!1,this.round=!1}render(){return this.round?(this.dataset.round="true",this.style.cssText="\n      --local-width: var(--wui-spacing-3xl);\n      --local-height: var(--wui-spacing-3xl);\n      --local-icon-size: var(--wui-spacing-l);\n    "):this.style.cssText=`\n\n      --local-path: var(--wui-path-network-${this.size});\n      --local-width:  var(--wui-width-network-${this.size});\n      --local-height:  var(--wui-height-network-${this.size});\n      --local-icon-size:  var(--wui-icon-size-network-${this.size});\n    `,r`${this.templateVisual()} ${this.svgTemplate()} `}svgTemplate(){return this.round?null:this.networkImagesBySize[this.size]}templateVisual(){return this.imageSrc?r`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:r`<wui-icon size="inherit" color="fg-200" name="networkPlaceholder"></wui-icon>`}};Qo.styles=[t,Yo],Xo([N()],Qo.prototype,"size",void 0),Xo([N()],Qo.prototype,"name",void 0),Xo([N({type:Object})],Qo.prototype,"networkImagesBySize",void 0),Xo([N()],Qo.prototype,"imageSrc",void 0),Xo([N({type:Boolean})],Qo.prototype,"selected",void 0),Xo([N({type:Boolean})],Qo.prototype,"round",void 0),Qo=Xo([j("wui-network-image")],Qo);var Zo=e`
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

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`,Jo=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let er=class extends o{constructor(){super(),this.network=f.state.data?.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw new Error("w3m-network-switch-view: No network provided");this.onShowRetry();const e=this.getLabel(),t=this.getSubLabel();return r`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","3xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${_(n.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:r`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            ?border=${!0}
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">${e}</wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){const e=a.state.activeChain,t=h.getConnectorId(e);return h.getAuthConnector()&&t===g.CONNECTOR_ID.AUTH?"":this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet"}getLabel(){const e=a.state.activeChain,t=h.getConnectorId(e);return h.getAuthConnector()&&t===g.CONNECTOR_ID.AUTH?`Switching to ${this.network?.name??"Unknown"} network...`:this.error?"Switch declined":"Approve in wallet"}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;const e=this.shadowRoot?.querySelector("wui-button");e?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}async onSwitchNetwork(){try{this.error=!1,this.network&&await a.switchActiveNetwork(this.network)}catch(e){this.error=!0}}};er.styles=Zo,Jo([D()],er.prototype,"showRetry",void 0),Jo([D()],er.prototype,"error",void 0),er=Jo([j("w3m-network-switch-view")],er);var tr=e`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button[data-transparent='true'] {
    pointer-events: none;
    background-color: transparent;
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-image {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    border-radius: 100%;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }
`,ir=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let or=class extends o{constructor(){super(...arguments),this.imageSrc="",this.name="",this.disabled=!1,this.selected=!1,this.transparent=!1}render(){return r`
      <button data-transparent=${this.transparent} ?disabled=${this.disabled}>
        <wui-flex gap="s" alignItems="center">
          ${this.templateNetworkImage()}
          <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text></wui-flex
        >
        ${this.checkmarkTemplate()}
      </button>
    `}checkmarkTemplate(){return this.selected?r`<wui-icon size="sm" color="accent-100" name="checkmarkBold"></wui-icon>`:null}templateNetworkImage(){return this.imageSrc?r`<wui-image size="sm" src=${this.imageSrc} name=${this.name}></wui-image>`:this.imageSrc?null:r`<wui-network-image
        ?round=${!0}
        size="md"
        name=${this.name}
      ></wui-network-image>`}};or.styles=[t,i,tr],ir([N()],or.prototype,"imageSrc",void 0),ir([N()],or.prototype,"name",void 0),ir([N({type:Boolean})],or.prototype,"disabled",void 0),ir([N({type:Boolean})],or.prototype,"selected",void 0),ir([N({type:Boolean})],or.prototype,"transparent",void 0),or=ir([j("wui-list-network")],or);var rr=e`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`,ar=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let nr=class extends o{constructor(){super(),this.unsubscribe=[],this.network=a.state.activeCaipNetwork,this.requestedCaipNetworks=a.getAllRequestedCaipNetworks(),this.search="",this.onDebouncedSearch=d.debounce((e=>{this.search=e}),100),this.unsubscribe.push(l.subscribeNetworkImages((()=>this.requestUpdate())),a.subscribeKey("activeCaipNetwork",(e=>this.network=e)),a.subscribeKey("chains",(()=>this.requestedCaipNetworks=a.getAllRequestedCaipNetworks())))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${["0","s","s","s"]}
        flexDirection="column"
        gap="xs"
      >
        ${this.networksTemplate()}
      </wui-flex>

      <wui-separator></wui-separator>

      <wui-flex padding="s" flexDirection="column" gap="m" alignItems="center">
        <wui-text variant="small-400" color="fg-300" align="center">
          Your connected wallet may not support some of the networks available for this dApp
        </wui-text>
        <wui-link @click=${this.onNetworkHelp.bind(this)}>
          <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
          What is a network
        </wui-link>
      </wui-flex>
    `}templateSearchInput(){return r`
      <wui-flex gap="xs" .padding=${["0","s","s","s"]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onNetworkHelp(){p.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),f.push("WhatIsANetwork")}networksTemplate(){const e=a.getAllRequestedCaipNetworks(),t=a.getAllApprovedCaipNetworkIds(),i=d.sortRequestedNetworks(t,e);return this.search?this.filteredNetworks=i?.filter((e=>e?.name?.toLowerCase().includes(this.search.toLowerCase()))):this.filteredNetworks=i,this.filteredNetworks?.map((e=>r`
        <wui-list-network
          .selected=${this.network?.id===e.id}
          imageSrc=${_(n.getNetworkImage(e))}
          type="network"
          name=${e.name??e.id}
          @click=${()=>this.onSwitchNetwork(e)}
          .disabled=${this.getNetworkDisabled(e)}
          data-testid=${`w3m-network-switch-${e.name??e.id}`}
        ></wui-list-network>
      `))}getNetworkDisabled(e){const t=e.chainNamespace,i=c.getCaipAddress(t),o=a.getAllApprovedCaipNetworkIds(),r=!1!==a.getNetworkProp("supportsAllNetworks",t),n=h.getConnectorId(t),s=h.getAuthConnector(),l=n===g.CONNECTOR_ID.AUTH&&s;return!(!i||r||l)&&!o?.includes(e.caipNetworkId)}onSwitchNetwork(e){const t=f.state.data;if(e.id===this.network?.id)return;const i=e.chainNamespace!==a.state.activeChain,o=c.state.caipAddress,r=c.getCaipAddress(e.chainNamespace),n=h.getConnectorId(a.state.activeChain)===g.CONNECTOR_ID.AUTH,s=g.AUTH_CONNECTOR_SUPPORTED_CHAINS.find((t=>t===e.chainNamespace));o?n&&s?f.push("SwitchNetwork",{...t,network:e}):n&&!s||i&&!r?f.push("SwitchActiveChain",{switchToChain:e.chainNamespace,navigateTo:"Connect",navigateWithReplace:!0,network:e}):f.push("SwitchNetwork",{...t,network:e}):f.push("SwitchNetwork",{...t,network:e})}};nr.styles=rr,ar([D()],nr.prototype,"network",void 0),ar([D()],nr.prototype,"requestedCaipNetworks",void 0),ar([D()],nr.prototype,"filteredNetworks",void 0),ar([D()],nr.prototype,"search",void 0),nr=ar([j("w3m-networks-view")],nr);var sr=e`
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

  wui-visual {
    width: var(--wui-wallet-image-size-lg);
    height: var(--wui-wallet-image-size-lg);
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity var(--wui-ease-out-power-2) var(--wui-duration-lg),
      transform var(--wui-ease-out-power-2) var(--wui-duration-lg);
    will-change: opacity, transform;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
  }

  .capitalize {
    text-transform: capitalize;
  }
`,lr=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const cr={eip155:"eth",solana:"solana",bip122:"bitcoin",polkadot:void 0};let dr=class extends o{constructor(){super(...arguments),this.unsubscribe=[],this.switchToChain=f.state.data?.switchToChain,this.caipNetwork=f.state.data?.network,this.activeChain=a.state.activeChain}firstUpdated(){this.unsubscribe.push(a.subscribeKey("activeChain",(e=>this.activeChain=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.switchToChain?g.CHAIN_NAME_MAP[this.switchToChain]:"supported";if(!this.switchToChain)return null;const t=g.CHAIN_NAME_MAP[this.switchToChain];return r`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="xl">
          <wui-visual name=${_(cr[this.switchToChain])}></wui-visual>
          <wui-text
            data-testid=${`w3m-switch-active-chain-to-${t}`}
            variant="paragraph-500"
            color="fg-100"
            align="center"
            >Switch to <span class="capitalize">${t}</span></wui-text
          >
          <wui-text variant="small-400" color="fg-200" align="center">
            Connected wallet doesn't support connecting to ${e} chain. You
            need to connect with a different wallet.
          </wui-text>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(a.setIsSwitchingNamespace(!0),h.setFilterByNamespace(this.switchToChain),this.caipNetwork?await a.switchActiveNetwork(this.caipNetwork):a.setActiveNamespace(this.switchToChain),f.reset("Connect"))}};dr.styles=sr,lr([N()],dr.prototype,"activeChain",void 0),dr=lr([j("w3m-switch-active-chain-view")],dr);var ur=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const pr=[{images:["network","layers","system"],title:"The system’s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}];let wr=class extends o{render(){return r`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${pr}></w3m-help-widget>
        <wui-button
          variant="main"
          size="md"
          @click=${()=>{d.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};wr=ur([j("w3m-what-is-a-network-view")],wr);var hr=e`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`,gr=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let fr=class extends o{constructor(){super(),this.swapUnsupportedChain=f.state.data?.swapUnsupportedChain,this.unsubscribe=[],this.disconecting=!1,this.unsubscribe.push(l.subscribeNetworkImages((()=>this.requestUpdate())))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${["m","xl","xs","xl"]}
          alignItems="center"
          gap="xl"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="s" gap="xs">
          ${this.networksTemplate()}
        </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="s" gap="xs">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="disconnect"
            ?chevron=${!1}
            .loading=${this.disconecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?r`
        <wui-text variant="small-400" color="fg-200" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:r`
      <wui-text variant="small-400" color="fg-200" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){const e=a.getAllRequestedCaipNetworks(),t=a.getAllApprovedCaipNetworkIds(),i=d.sortRequestedNetworks(t,e);return(this.swapUnsupportedChain?i.filter((e=>b.SWAP_SUPPORTED_NETWORKS.includes(e.caipNetworkId))):i).map((e=>r`
        <wui-list-network
          imageSrc=${_(n.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onSwitchNetwork(e)}
        >
        </wui-list-network>
      `))}async onDisconnect(){try{this.disconecting=!0,await x.disconnect(),u.close()}catch{p.sendEvent({type:"track",event:"DISCONNECT_ERROR"}),m.showError("Failed to disconnect")}finally{this.disconecting=!1}}async onSwitchNetwork(e){const t=c.state.caipAddress,i=a.getAllApprovedCaipNetworkIds(),o=(a.getNetworkProp("supportsAllNetworks",e.chainNamespace),f.state.data);t?i?.includes(e.caipNetworkId)?await a.switchActiveNetwork(e):f.push("SwitchNetwork",{...o,network:e}):t||(a.setActiveCaipNetwork(e),f.push("Connect"))}};fr.styles=hr,gr([D()],fr.prototype,"disconecting",void 0),fr=gr([j("w3m-unsupported-chain-view")],fr);var br=e`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-s);
    padding: var(--wui-spacing-1xs) var(--wui-spacing-s) var(--wui-spacing-1xs)
      var(--wui-spacing-1xs);
  }
`,mr=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let vr=class extends o{constructor(){super(...arguments),this.icon="externalLink",this.text=""}render(){return r`
      <wui-flex gap="1xs" alignItems="center">
        <wui-icon-box
          size="sm"
          iconcolor="fg-200"
          backgroundcolor="fg-200"
          icon=${this.icon}
          background="transparent"
        ></wui-icon-box>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
      </wui-flex>
    `}};vr.styles=[t,i,br],mr([N()],vr.prototype,"icon",void 0),mr([N()],vr.prototype,"text",void 0),vr=mr([j("wui-banner")],vr);var xr=e`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`,yr=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let kr=class extends o{constructor(){super(),this.unsubscribe=[],this.preferredAccountType=c.state.preferredAccountType,this.unsubscribe.push(c.subscribeKey("preferredAccountType",(e=>{this.preferredAccountType=e})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return r` <wui-flex
      flexDirection="column"
      .padding=${["xs","s","m","s"]}
      gap="xs"
    >
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){const e=a.getAllRequestedCaipNetworks(),t=a.getAllApprovedCaipNetworkIds(),i=a.state.activeCaipNetwork,o=a.checkIfSmartAccountEnabled();let s=d.sortRequestedNetworks(t,e);if(o&&this.preferredAccountType===v.ACCOUNT_TYPES.SMART_ACCOUNT){if(!i)return null;s=[i]}return s.map((e=>r`
        <wui-list-network
          imageSrc=${_(n.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          ?transparent=${!0}
        >
        </wui-list-network>
      `))}};kr.styles=xr,yr([D()],kr.prototype,"preferredAccountType",void 0),kr=yr([j("w3m-wallet-compatible-networks-view")],kr);var Cr=e`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--wui-icon-box-size-xl);
    height: var(--wui-icon-box-size-xl);
    box-shadow: 0 0 0 8px var(--wui-thumbnail-border);
    border-radius: var(--local-border-radius);
    overflow: hidden;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`,$r=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Sr=class extends o{render(){return this.style.cssText=`--local-border-radius: ${this.borderRadiusFull?"1000px":"20px"}; background-color: var(--wui-color-modal-bg);`,r`${this.templateVisual()}`}templateVisual(){return this.imageSrc?r`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:r`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};Sr.styles=[t,Cr],$r([N()],Sr.prototype,"imageSrc",void 0),$r([N()],Sr.prototype,"alt",void 0),$r([N({type:Boolean})],Sr.prototype,"borderRadiusFull",void 0),Sr=$r([j("wui-visual-thumbnail")],Sr);var Tr=e`
  :host {
    display: flex;
    justify-content: center;
    gap: var(--wui-spacing-2xl);
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`,Rr=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ir=class extends o{constructor(){super(...arguments),this.dappImageUrl=s.state.metadata?.icons,this.walletImageUrl=c.state.connectedWalletInfo?.icon}firstUpdated(){const e=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");e?.[0]&&this.createAnimation(e[0],"translate(18px)"),e?.[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){return r`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,t){e.animate([{transform:"translateX(0px)"},{transform:t}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};Ir.styles=Tr,Ir=Rr([j("w3m-siwx-sign-message-thumbnails")],Ir);var Or=window&&window.__decorate||function(e,t,i,o){var r,a=arguments.length,n=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,o);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ar=class extends o{constructor(){super(...arguments),this.dappName=s.state.metadata?.name,this.isCancelling=!1,this.isSigning=!1}render(){return r`
      <wui-flex justifyContent="center" .padding=${["2xl","0","xxl","0"]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex
        .padding=${["0","4xl","l","4xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex
        .padding=${["0","3xl","l","3xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["l","xl","xl","xl"]} gap="s" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          ${this.isCancelling?"Cancelling...":"Cancel"}
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="main"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0,await E.requestSignMessage().finally((()=>this.isSigning=!1))}async onCancel(){this.isCancelling=!0,await E.cancelSignMessage().finally((()=>this.isCancelling=!1))}};Or([D()],Ar.prototype,"isCancelling",void 0),Or([D()],Ar.prototype,"isSigning",void 0),Ar=Or([j("w3m-siwx-sign-message-view")],Ar);export{X as AppKitAccountButton,te as AppKitButton,le as AppKitConnectButton,fe as AppKitNetworkButton,Y as W3mAccountButton,Ce as W3mAccountSettingsView,st as W3mAccountView,Jt as W3mAllWalletsView,ee as W3mButton,Eo as W3mChooseAccountNameView,se as W3mConnectButton,Gi as W3mConnectView,Vo as W3mConnectWalletsView,ao as W3mConnectingExternalView,lo as W3mConnectingMultiChainView,Io as W3mConnectingWcBasicView,To as W3mConnectingWcView,jo as W3mDownloadsView,Po as W3mGetWalletView,ge as W3mNetworkButton,er as W3mNetworkSwitchView,nr as W3mNetworksView,wt as W3mProfileView,Ar as W3mSIWXSignMessageView,dr as W3mSwitchActiveChainView,vt as W3mSwitchAddressView,fr as W3mUnsupportedChainView,kr as W3mWalletCompatibleNetworksView,wr as W3mWhatIsANetworkView,Wo as W3mWhatIsAWalletView};
//# sourceMappingURL=index-DPC9vr8H.js.map
