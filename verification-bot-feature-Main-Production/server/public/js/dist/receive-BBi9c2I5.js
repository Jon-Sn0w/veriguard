import{i as e,b as t,f as r,r as i,x as o,A as s,j as a,S as c,q as n,T as l,W as d,R as p,d as w}from"./bundle.js";import{n as u,c as h,U as f,o as m,r as g}from"./if-defined-yLNCJnJO.js";import"./index-CladwI1f.js";import"./index-D9KSP8X3.js";import"./index-D4Burr6A.js";var b=e`
  button {
    display: flex;
    gap: var(--wui-spacing-xl);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-m) var(--wui-spacing-s);
  }

  wui-text {
    width: 100%;
  }

  wui-flex {
    width: auto;
  }

  .network-icon {
    width: var(--wui-spacing-2l);
    height: var(--wui-spacing-2l);
    border-radius: calc(var(--wui-spacing-2l) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`,k=window&&window.__decorate||function(e,t,r,i){var o,s=arguments.length,a=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(s<3?o(a):s>3?o(t,r,a):o(t,r))||a);return s>3&&a&&Object.defineProperty(t,r,a),a};let v=class extends i{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return o`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){const e=this.networkImages.slice(0,5);return o` <wui-flex class="networks">
      ${e?.map((e=>o` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`))}
    </wui-flex>`}};v.styles=[t,r,b],k([u({type:Array})],v.prototype,"networkImages",void 0),k([u()],v.prototype,"text",void 0),v=k([h("wui-compatible-network")],v);var y=e`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`,x=window&&window.__decorate||function(e,t,r,i){var o,s=arguments.length,a=s<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var c=e.length-1;c>=0;c--)(o=e[c])&&(a=(s<3?o(a):s>3?o(t,r,a):o(t,r))||a);return s>3&&a&&Object.defineProperty(t,r,a),a};let C=class extends i{constructor(){super(),this.unsubscribe=[],this.address=s.state.address,this.profileName=s.state.profileName,this.network=a.state.activeCaipNetwork,this.preferredAccountType=s.state.preferredAccountType,this.unsubscribe.push(s.subscribe((e=>{e.address?(this.address=e.address,this.profileName=e.profileName,this.preferredAccountType=e.preferredAccountType):c.showError("Account not found")})),a.subscribeKey("activeCaipNetwork",(e=>{e?.id&&(this.network=e)})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");const e=n.getNetworkImage(this.network);return o` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${f.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["l","0","0","0"]}
        alignItems="center"
        gap="s"
      >
        <wui-qr-code
          size=${232}
          theme=${l.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${m(l.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){const e=a.getAllRequestedCaipNetworks(),t=a.checkIfSmartAccountEnabled(),r=a.state.activeCaipNetwork;if(this.preferredAccountType===d.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return r?o`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[n.getNetworkImage(r)??""]}
      ></wui-compatible-network>`:null;const i=e?.filter((e=>e?.assets?.imageId))?.slice(0,5),s=i.map(n.getNetworkImage).filter(Boolean);return o`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${s}
    ></wui-compatible-network>`}onReceiveClick(){p.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(w.copyToClopboard(this.address),c.showSuccess("Address copied"))}catch{c.showError("Failed to copy")}}};C.styles=y,x([g()],C.prototype,"address",void 0),x([g()],C.prototype,"profileName",void 0),x([g()],C.prototype,"network",void 0),x([g()],C.prototype,"preferredAccountType",void 0),C=x([h("w3m-wallet-receive-view")],C);export{C as W3mWalletReceiveView};
//# sourceMappingURL=receive-BBi9c2I5.js.map
