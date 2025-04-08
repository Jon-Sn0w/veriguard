import{i as e,r as t,R as i,m as r,x as a}from"./bundle.js";import{r as n,c as s}from"./if-defined-yLNCJnJO.js";import{T as w}from"./index-D90hOOI2.js";var c=e`
  :host {
    --prev-height: 0px;
    --new-height: 0px;
    display: block;
  }

  div.w3m-router-container {
    transform: translateY(0);
    opacity: 1;
  }

  div.w3m-router-container[view-direction='prev'] {
    animation:
      slide-left-out 150ms forwards ease,
      slide-left-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  div.w3m-router-container[view-direction='next'] {
    animation:
      slide-right-out 150ms forwards ease,
      slide-right-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(-10px);
      opacity: 0;
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`,o=window&&window.__decorate||function(e,t,i,r){var a,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var w=e.length-1;w>=0;w--)(a=e[w])&&(s=(n<3?a(s):n>3?a(t,i,s):a(t,i))||s);return n>3&&s&&Object.defineProperty(t,i,s),s};let m=class extends t{constructor(){super(),this.resizeObserver=void 0,this.prevHeight="0px",this.prevHistoryLength=1,this.unsubscribe=[],this.view=i.state.view,this.viewDirection="",this.unsubscribe.push(i.subscribeKey("view",(e=>this.onViewChange(e))))}firstUpdated(){this.resizeObserver=new ResizeObserver((([e])=>{const t=`${e?.contentRect.height}px`;"0px"!==this.prevHeight&&(this.style.setProperty("--prev-height",this.prevHeight),this.style.setProperty("--new-height",t),this.style.animation="w3m-view-height 150ms forwards ease",this.style.height="auto"),setTimeout((()=>{this.prevHeight=t,this.style.animation="unset"}),r.ANIMATION_DURATIONS.ModalHeight)})),this.resizeObserver?.observe(this.getWrapper())}disconnectedCallback(){this.resizeObserver?.unobserve(this.getWrapper()),this.unsubscribe.forEach((e=>e()))}render(){return a`<div class="w3m-router-container" view-direction="${this.viewDirection}">
      ${this.viewTemplate()}
    </div>`}viewTemplate(){switch(this.view){case"AccountSettings":return a`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return a`<w3m-account-view></w3m-account-view>`;case"AllWallets":return a`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return a`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return a`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return a`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":default:return a`<w3m-connect-view></w3m-connect-view>`;case"Create":return a`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return a`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return a`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return a`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return a`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return a`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return a`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return a`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"Downloads":return a`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return a`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return a`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return a`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return a`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return a`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return a`<w3m-network-switch-view></w3m-network-switch-view>`;case"Profile":return a`<w3m-profile-view></w3m-profile-view>`;case"SwitchAddress":return a`<w3m-switch-address-view></w3m-switch-address-view>`;case"Transactions":return a`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return a`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampActivity":return a`<w3m-onramp-activity-view></w3m-onramp-activity-view>`;case"OnRampTokenSelect":return a`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return a`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return a`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return a`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return a`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return a`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return a`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return a`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return a`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return a`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return a`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return a`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return a`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WhatIsABuy":return a`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return a`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return a`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return a`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return a`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return a`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return a`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return a`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return a`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return a`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return a`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return a`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return a`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`}}onViewChange(e){w.hide();let t=r.VIEW_DIRECTION.Next;const{history:a}=i.state;a.length<this.prevHistoryLength&&(t=r.VIEW_DIRECTION.Prev),this.prevHistoryLength=a.length,this.viewDirection=t,setTimeout((()=>{this.view=e}),r.ANIMATION_DURATIONS.ViewTransition)}getWrapper(){return this.shadowRoot?.querySelector("div")}};m.styles=c,o([n()],m.prototype,"view",void 0),o([n()],m.prototype,"viewDirection",void 0),m=o([s("w3m-router")],m);export{m as W};
//# sourceMappingURL=index-DeVXELIx.js.map
