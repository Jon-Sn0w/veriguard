import{s as e,t,B as r,u as i,j as o,c as a,A as s,v as n,w as c,y as l,i as u,r as d,x as p,z as h,D as m,O as w,M as y,q as g,e as f,W as b,R as v,d as x,a as C,k,S as T,T as A}from"./bundle.js";import{n as P,c as I,o as R,r as $}from"./if-defined-yLNCJnJO.js";import{D as O,T as _}from"./index-C_pryA1E.js";import"./index-BYuvcniW.js";import"./index-D9KSP8X3.js";import"./index-Ckd861mn.js";import"./index-DtcmM8RX.js";import"./index-ByyQhA-G.js";import"./index-DB5k-Dct.js";import"./index-DAFiFOtU.js";import"./index-DCqi0O7E.js";import"./index-CIpWLpox.js";const j={id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},S={id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},D=e({providers:t,selectedProvider:null,error:null,purchaseCurrency:j,paymentCurrency:S,purchaseCurrencies:[j],paymentCurrencies:[],quotesLoading:!1}),N={state:D,subscribe:e=>l(D,(()=>e(D))),subscribeKey:(e,t)=>c(D,e,t),setSelectedProvider(e){if(e&&"meld"===e.name){const t=o.state.activeChain===a.CHAIN.SOLANA?"SOL":"USDC",r=s.state.address??"",i=new URL(e.url);i.searchParams.append("publicKey",n),i.searchParams.append("destinationCurrencyCode",t),i.searchParams.append("walletAddress",r),e.url=i.toString()}D.selectedProvider=e},setPurchaseCurrency(e){D.purchaseCurrency=e},setPaymentCurrency(e){D.paymentCurrency=e},setPurchaseAmount(e){this.state.purchaseAmount=e},setPaymentAmount(e){this.state.paymentAmount=e},async getAvailableCurrencies(){const e=await r.getOnrampOptions();D.purchaseCurrencies=e.purchaseCurrencies,D.paymentCurrencies=e.paymentCurrencies,D.paymentCurrency=e.paymentCurrencies[0]||S,D.purchaseCurrency=e.purchaseCurrencies[0]||j,await i.fetchCurrencyImages(e.paymentCurrencies.map((e=>e.id))),await i.fetchTokenImages(e.purchaseCurrencies.map((e=>e.symbol)))},async getQuote(){D.quotesLoading=!0;try{const e=await r.getOnrampQuote({purchaseCurrency:D.purchaseCurrency,paymentCurrency:D.paymentCurrency,amount:D.paymentAmount?.toString()||"0",network:D.purchaseCurrency?.symbol});return D.quotesLoading=!1,D.purchaseAmount=Number(e?.purchaseAmount.amount),e}catch(e){return D.error=e.message,D.quotesLoading=!1,null}finally{D.quotesLoading=!1}},resetState(){D.providers=t,D.selectedProvider=null,D.error=null,D.purchaseCurrency=j,D.paymentCurrency=S,D.purchaseCurrencies=[j],D.paymentCurrencies=[],D.paymentAmount=void 0,D.purchaseAmount=void 0,D.quotesLoading=!1}};var B=u`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    width: 100%;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xs);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--wui-spacing-s);
  }

  :host > wui-flex:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  .purchase-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: var(--wui-icon-box-size-lg);
    height: var(--wui-icon-box-size-lg);
  }

  .purchase-image-container wui-image {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: calc(var(--wui-icon-box-size-lg) / 2);
  }

  .purchase-image-container wui-image::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-icon-box-size-lg) / 2);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  .purchase-image-container wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }
`,U=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let E=class extends d{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="Bought",this.purchaseValue="",this.purchaseCurrency="",this.date="",this.completed=!1,this.inProgress=!1,this.failed=!1,this.onClick=null,this.symbol=""}firstUpdated(){this.icon||this.fetchTokenImage()}render(){return p`
      <wui-flex>
        ${this.imageTemplate()}
        <wui-flex flexDirection="column" gap="4xs" flexGrow="1">
          <wui-flex gap="xxs" alignItems="center" justifyContent="flex-start">
            ${this.statusIconTemplate()}
            <wui-text variant="paragraph-500" color="fg-100"> ${this.label}</wui-text>
          </wui-flex>
          <wui-text variant="small-400" color="fg-200">
            + ${this.purchaseValue} ${this.purchaseCurrency}
          </wui-text>
        </wui-flex>
        ${this.inProgress?p`<wui-loading-spinner color="fg-200" size="md"></wui-loading-spinner>`:p`<wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>`}
      </wui-flex>
    `}async fetchTokenImage(){await i._fetchTokenImage(this.purchaseCurrency)}statusIconTemplate(){return this.inProgress?null:this.completed?this.boughtIconTemplate():this.errorIconTemplate()}errorIconTemplate(){return p`<wui-icon-box
      size="xxs"
      iconColor="error-100"
      backgroundColor="error-100"
      background="opaque"
      icon="close"
      borderColor="wui-color-bg-125"
    ></wui-icon-box>`}imageTemplate(){const e=this.icon||`https://avatar.vercel.sh/andrew.svg?size=50&text=${this.symbol}`;return p`<wui-flex class="purchase-image-container">
      <wui-image src=${e}></wui-image>
    </wui-flex>`}boughtIconTemplate(){return p`<wui-icon-box
      size="xxs"
      iconColor="success-100"
      backgroundColor="success-100"
      background="opaque"
      icon="arrowBottom"
      borderColor="wui-color-bg-125"
    ></wui-icon-box>`}};E.styles=[B],U([P({type:Boolean})],E.prototype,"disabled",void 0),U([P()],E.prototype,"color",void 0),U([P()],E.prototype,"label",void 0),U([P()],E.prototype,"purchaseValue",void 0),U([P()],E.prototype,"purchaseCurrency",void 0),U([P()],E.prototype,"date",void 0),U([P({type:Boolean})],E.prototype,"completed",void 0),U([P({type:Boolean})],E.prototype,"inProgress",void 0),U([P({type:Boolean})],E.prototype,"failed",void 0),U([P()],E.prototype,"onClick",void 0),U([P()],E.prototype,"symbol",void 0),U([P()],E.prototype,"icon",void 0),E=U([I("w3m-onramp-activity-item")],E);var L=u`
  :host > wui-flex {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    padding: var(--wui-spacing-m);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }

  :host > wui-flex > wui-flex {
    width: 100%;
  }

  wui-transaction-list-item-loader {
    width: 100%;
  }
`,z=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let q=class extends d{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=N.state.selectedProvider,this.loading=!1,this.coinbaseTransactions=h.state.coinbaseTransactions,this.tokenImages=m.state.tokenImages,this.unsubscribe.push(N.subscribeKey("selectedProvider",(e=>{this.selectedOnRampProvider=e})),m.subscribeKey("tokenImages",(e=>this.tokenImages=e)),(()=>{clearTimeout(this.refetchTimeout)}),h.subscribe((e=>{this.coinbaseTransactions={...e.coinbaseTransactions}}))),h.clearCursor(),this.fetchTransactions()}render(){return p`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.loading?this.templateLoading():this.templateTransactionsByYear()}
      </wui-flex>
    `}templateTransactions(e){return e?.map((e=>{const t=O.formatDate(e?.metadata?.minedAt),r=e.transfers[0],i=r?.fungible_info;if(!i)return null;const o=i?.icon?.url||this.tokenImages?.[i.symbol||""];return p`
        <w3m-onramp-activity-item
          label="Bought"
          .completed=${"ONRAMP_TRANSACTION_STATUS_SUCCESS"===e.metadata.status}
          .inProgress=${"ONRAMP_TRANSACTION_STATUS_IN_PROGRESS"===e.metadata.status}
          .failed=${"ONRAMP_TRANSACTION_STATUS_FAILED"===e.metadata.status}
          purchaseCurrency=${R(i.symbol)}
          purchaseValue=${r.quantity.numeric}
          date=${t}
          icon=${R(o)}
          symbol=${R(i.symbol)}
        ></w3m-onramp-activity-item>
      `}))}templateTransactionsByYear(){return Object.keys(this.coinbaseTransactions).sort().reverse().map((e=>{const t=parseInt(e,10);return new Array(12).fill(null).map(((e,t)=>t)).reverse().map((e=>{const r=_.getTransactionGroupTitle(t,e),i=this.coinbaseTransactions[t]?.[e];return i?p`
          <wui-flex flexDirection="column">
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200">${r}</wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(i)}
            </wui-flex>
          </wui-flex>
        `:null}))}))}async fetchTransactions(){await this.fetchCoinbaseTransactions()}async fetchCoinbaseTransactions(){const e=s.state.address,t=w.state.projectId;if(!e)throw new Error("No address found");if(!t)throw new Error("No projectId found");this.loading=!0,await h.fetchTransactions(e,"coinbase"),this.loading=!1,this.refetchLoadingTransactions()}refetchLoadingTransactions(){const e=new Date;0!==(this.coinbaseTransactions[e.getFullYear()]?.[e.getMonth()]||[]).filter((e=>"ONRAMP_TRANSACTION_STATUS_IN_PROGRESS"===e.metadata.status)).length?this.refetchTimeout=setTimeout((async()=>{const e=s.state.address;await h.fetchTransactions(e,"coinbase"),this.refetchLoadingTransactions()}),3e3):clearTimeout(this.refetchTimeout)}templateLoading(){return Array(7).fill(p` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map((e=>e))}};q.styles=L,z([$()],q.prototype,"selectedOnRampProvider",void 0),z([$()],q.prototype,"loading",void 0),z([$()],q.prototype,"coinbaseTransactions",void 0),z([$()],q.prototype,"tokenImages",void 0),q=z([I("w3m-onramp-activity-view")],q);var W=u`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`,K=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let M=class extends d{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=N.state.paymentCurrency,this.currencies=N.state.paymentCurrencies,this.currencyImages=m.state.currencyImages,this.checked=!1,this.unsubscribe.push(N.subscribe((e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies})),m.subscribeKey("currencyImages",(e=>this.currencyImages=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=w.state,r=w.state.features?.legalCheckbox,i=Boolean(e||t)&&Boolean(r)&&!this.checked;return p`
      <w3m-legal-checkbox @checkboxChange=${this.onCheckboxChange.bind(this)}></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${R(i?"disabled":void 0)}
      >
        ${this.currenciesTemplate(i)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.currencies.map((t=>p`
        <wui-list-item
          imageSrc=${R(this.currencyImages?.[t.id])}
          @click=${()=>this.selectCurrency(t)}
          variant="image"
          tabIdx=${R(e?-1:void 0)}
        >
          <wui-text variant="paragraph-500" color="fg-100">${t.id}</wui-text>
        </wui-list-item>
      `))}selectCurrency(e){e&&(N.setPaymentCurrency(e),y.close())}onCheckboxChange(e){this.checked=Boolean(e.detail)}};M.styles=W,K([$()],M.prototype,"selectedCurrency",void 0),K([$()],M.prototype,"currencies",void 0),K([$()],M.prototype,"currencyImages",void 0),K([$()],M.prototype,"checked",void 0),M=K([I("w3m-onramp-fiat-select-view")],M);var Y=u`
  button {
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xs);
    border: none;
    outline: none;
    background-color: var(--wui-color-gray-glass-002);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--wui-spacing-s);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }

  .provider-image {
    width: var(--wui-spacing-3xl);
    min-width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    border-radius: calc(var(--wui-border-radius-xs) - calc(var(--wui-spacing-s) / 2));
    position: relative;
    overflow: hidden;
  }

  .provider-image::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-xs) - calc(var(--wui-spacing-s) / 2));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  .network-icon {
    width: var(--wui-spacing-m);
    height: var(--wui-spacing-m);
    border-radius: calc(var(--wui-spacing-m) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
    transition: box-shadow var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-005),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`,F=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let H=class extends d{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return p`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${R(this.name)} class="provider-image"></wui-visual>
        <wui-flex flexDirection="column" gap="4xs">
          <wui-text variant="paragraph-500" color="fg-100">${this.label}</wui-text>
          <wui-flex alignItems="center" justifyContent="flex-start" gap="l">
            <wui-text variant="tiny-500" color="fg-100">
              <wui-text variant="tiny-400" color="fg-200">Fees</wui-text>
              ${this.feeRange}
            </wui-text>
            <wui-flex gap="xxs">
              <wui-icon name="bank" size="xs" color="fg-150"></wui-icon>
              <wui-icon name="card" size="xs" color="fg-150"></wui-icon>
            </wui-flex>
            ${this.networksTemplate()}
          </wui-flex>
        </wui-flex>
        ${this.loading?p`<wui-loading-spinner color="fg-200" size="md"></wui-loading-spinner>`:p`<wui-icon name="chevronRight" color="fg-200" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){const e=o.getAllRequestedCaipNetworks(),t=e?.filter((e=>e?.assets?.imageId))?.slice(0,5);return p`
      <wui-flex class="networks">
        ${t?.map((e=>p`
            <wui-flex class="network-icon">
              <wui-image src=${R(g.getNetworkImage(e))}></wui-image>
            </wui-flex>
          `))}
      </wui-flex>
    `}};H.styles=[Y],F([P({type:Boolean})],H.prototype,"disabled",void 0),F([P()],H.prototype,"color",void 0),F([P()],H.prototype,"name",void 0),F([P()],H.prototype,"label",void 0),F([P()],H.prototype,"feeRange",void 0),F([P({type:Boolean})],H.prototype,"loading",void 0),F([P()],H.prototype,"onClick",void 0),H=F([I("w3m-onramp-provider-item")],H);var G=u`
  wui-flex {
    border-top: 1px solid var(--wui-color-gray-glass-005);
  }

  a {
    text-decoration: none;
    color: var(--wui-color-fg-175);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-3xs);
  }
`,Q=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let V=class extends d{render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=w.state;return e||t?p`
      <wui-flex
        .padding=${["m","s","s","s"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="s"
      >
        <wui-text color="fg-250" variant="small-400" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `:null}howDoesItWorkTemplate(){return p` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){f.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:s.state.preferredAccountType===b.ACCOUNT_TYPES.SMART_ACCOUNT}}),v.push("WhatIsABuy")}};V.styles=[G],V=Q([I("w3m-onramp-providers-footer")],V);var X=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let J=class extends d{constructor(){super(),this.unsubscribe=[],this.providers=N.state.providers,this.unsubscribe.push(N.subscribeKey("providers",(e=>{this.providers=e})))}firstUpdated(){const e=this.providers.map((async e=>"coinbase"===e.name?await this.getCoinbaseOnRampURL():Promise.resolve(e?.url)));Promise.all(e).then((e=>{this.providers=this.providers.map(((t,r)=>({...t,url:e[r]||""})))}))}render(){return p`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
      <w3m-onramp-providers-footer></w3m-onramp-providers-footer>
    `}onRampProvidersTemplate(){return this.providers.filter((e=>e.supportedChains.includes(o.state.activeChain??"eip155"))).map((e=>p`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
          ></w3m-onramp-provider-item>
        `))}onClickProvider(e){N.setSelectedProvider(e),v.push("BuyInProgress"),x.openHref(e.url,"popupWindow","width=600,height=800,scrollbars=yes"),f.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:s.state.preferredAccountType===b.ACCOUNT_TYPES.SMART_ACCOUNT}})}async getCoinbaseOnRampURL(){const e=s.state.address,t=o.state.activeCaipNetwork;if(!e)throw new Error("No address found");if(!t?.name)throw new Error("No network found");const i=C.WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP[t.name]??C.WC_COINBASE_PAY_SDK_FALLBACK_CHAIN,a=N.state.purchaseCurrency,n=a?[a.symbol]:N.state.purchaseCurrencies.map((e=>e.symbol));return await r.generateOnRampURL({defaultNetwork:i,destinationWallets:[{address:e,blockchains:C.WC_COINBASE_PAY_SDK_CHAINS,assets:n}],partnerUserId:e,purchaseAmount:N.state.purchaseAmount})}};X([$()],J.prototype,"providers",void 0),J=X([I("w3m-onramp-providers-view")],J);var Z=u`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`,ee=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let te=class extends d{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=N.state.purchaseCurrencies,this.tokens=N.state.purchaseCurrencies,this.tokenImages=m.state.tokenImages,this.checked=!1,this.unsubscribe.push(N.subscribe((e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies})),m.subscribeKey("tokenImages",(e=>this.tokenImages=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=w.state,r=w.state.features?.legalCheckbox,i=Boolean(e||t)&&Boolean(r)&&!this.checked;return p`
      <w3m-legal-checkbox @checkboxChange=${this.onCheckboxChange.bind(this)}></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${R(i?"disabled":void 0)}
      >
        ${this.currenciesTemplate(i)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.tokens.map((t=>p`
        <wui-list-item
          imageSrc=${R(this.tokenImages?.[t.symbol])}
          @click=${()=>this.selectToken(t)}
          variant="image"
          tabIdx=${R(e?-1:void 0)}
        >
          <wui-flex gap="3xs" alignItems="center">
            <wui-text variant="paragraph-500" color="fg-100">${t.name}</wui-text>
            <wui-text variant="small-400" color="fg-200">${t.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `))}selectToken(e){e&&(N.setPurchaseCurrency(e),y.close())}onCheckboxChange(e){this.checked=Boolean(e.detail)}};te.styles=Z,ee([$()],te.prototype,"selectedCurrency",void 0),ee([$()],te.prototype,"tokens",void 0),ee([$()],te.prototype,"tokenImages",void 0),ee([$()],te.prototype,"checked",void 0),te=ee([I("w3m-onramp-token-select-view")],te);var re=u`
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
`,ie=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let oe=class extends d{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=N.state.selectedProvider,this.uri=k.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.startTime=null,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(N.subscribeKey("selectedProvider",(e=>{this.selectedOnRampProvider=e}))),this.watchTransactions()}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);const t=this.error?"Buy can be declined from your side or due to and error on the provider app":"We’ll notify you once your Buy is processed";return p`
      <wui-flex
        data-error=${R(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${R(this.selectedOnRampProvider?.name)}
            size="lg"
            class="provider-image"
          >
          </wui-visual>

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
            ${e}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="fg-200">
          <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}watchTransactions(){if(this.selectedOnRampProvider&&"coinbase"===this.selectedOnRampProvider.name)this.startTime=Date.now(),this.initializeCoinbaseTransactions()}async initializeCoinbaseTransactions(){await this.watchCoinbaseTransactions(),this.intervalId=setInterval((()=>this.watchCoinbaseTransactions()),4e3)}async watchCoinbaseTransactions(){try{const e=s.state.address;if(!e)throw new Error("No address found");const t=await r.fetchTransactions({account:e,onramp:"coinbase"});t.data.filter((e=>new Date(e.metadata.minedAt)>new Date(this.startTime)||"ONRAMP_TRANSACTION_STATUS_IN_PROGRESS"===e.metadata.status)).length?(clearInterval(this.intervalId),v.replace("OnRampActivity")):this.startTime&&Date.now()-this.startTime>=18e4&&(clearInterval(this.intervalId),this.error=!0)}catch(e){T.showError(e)}}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,x.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?p`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){const e=A.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return p`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url)return T.showError("No link found"),void v.goBack();try{x.copyToClopboard(this.selectedOnRampProvider.url),T.showSuccess("Link copied")}catch{T.showError("Failed to copy")}}};oe.styles=re,ie([$()],oe.prototype,"intervalId",void 0),ie([$()],oe.prototype,"selectedOnRampProvider",void 0),ie([$()],oe.prototype,"uri",void 0),ie([$()],oe.prototype,"ready",void 0),ie([$()],oe.prototype,"showRetry",void 0),ie([$()],oe.prototype,"buffering",void 0),ie([$()],oe.prototype,"error",void 0),ie([$()],oe.prototype,"startTime",void 0),ie([P({type:Boolean})],oe.prototype,"isMobile",void 0),ie([P()],oe.prototype,"onRetry",void 0),oe=ie([I("w3m-buy-in-progress-view")],oe);var ae=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let se=class extends d{render(){return p`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","3xl","xl","3xl"]}
        alignItems="center"
        gap="xl"
      >
        <wui-visual name="onrampCard"></wui-visual>
        <wui-flex flexDirection="column" gap="xs" alignItems="center">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            Quickly and easily buy digital assets!
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            Simply select your preferred onramp provider and add digital assets to your account
            using your credit card or bank transfer
          </wui-text>
        </wui-flex>
        <wui-button @click=${v.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};se=ae([I("w3m-what-is-a-buy-view")],se);var ne=u`
  :host {
    width: 100%;
  }

  wui-loading-spinner {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .currency-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: var(--wui-spacing-1xs);
    height: 40px;
    padding: var(--wui-spacing-xs) var(--wui-spacing-1xs) var(--wui-spacing-xs)
      var(--wui-spacing-xs);
    min-width: 95px;
    border-radius: var(--FULL, 1000px);
    border: 1px solid var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`,ce=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};let le=class extends d{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=m.state.currencyImages,this.tokenImages=m.state.tokenImages,this.unsubscribe.push(N.subscribeKey("purchaseCurrency",(e=>{e&&"Fiat"!==this.type&&(this.selectedCurrency=this.formatPurchaseCurrency(e))})),N.subscribeKey("paymentCurrency",(e=>{e&&"Token"!==this.type&&(this.selectedCurrency=this.formatPaymentCurrency(e))})),N.subscribe((e=>{"Fiat"===this.type?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)})),m.subscribe((e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}})))}firstUpdated(){N.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.selectedCurrency?.symbol||"",t=this.currencyImages[e]||this.tokenImages[e];return p`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?p` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="xxs"
            @click=${()=>y.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${R(t)}></wui-image>
            <wui-text color="fg-100">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:p`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};le.styles=ne,ce([P({type:String})],le.prototype,"type",void 0),ce([P({type:Number})],le.prototype,"value",void 0),ce([$()],le.prototype,"currencies",void 0),ce([$()],le.prototype,"selectedCurrency",void 0),ce([$()],le.prototype,"currencyImages",void 0),ce([$()],le.prototype,"tokenImages",void 0),le=ce([I("w3m-onramp-input")],le);var ue=u`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: var(--wui-border-radius-l);
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`,de=window&&window.__decorate||function(e,t,r,i){var o,a=arguments.length,s=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,r,s):o(t,r))||s);return a>3&&s&&Object.defineProperty(t,r,s),s};const pe={USD:"$",EUR:"€",GBP:"£"},he=[100,250,500,1e3];let me=class extends d{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=o.state.activeCaipAddress,this.loading=y.state.loading,this.paymentCurrency=N.state.paymentCurrency,this.paymentAmount=N.state.paymentAmount,this.purchaseAmount=N.state.purchaseAmount,this.quoteLoading=N.state.quotesLoading,this.unsubscribe.push(o.subscribeKey("activeCaipAddress",(e=>this.caipAddress=e)),y.subscribeKey("loading",(e=>{this.loading=e})),N.subscribe((e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return p`
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center">
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <w3m-onramp-input
            type="Fiat"
            @inputChange=${this.onPaymentAmountChange.bind(this)}
            .value=${this.paymentAmount||0}
          ></w3m-onramp-input>
          <w3m-onramp-input
            type="Token"
            .value=${this.purchaseAmount||0}
            .loading=${this.quoteLoading}
          ></w3m-onramp-input>
          <wui-flex justifyContent="space-evenly" class="amounts-container" gap="xs">
            ${he.map((e=>p`<wui-button
                  variant=${this.paymentAmount===e?"accent":"neutral"}
                  size="md"
                  textVariant="paragraph-600"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${pe[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`))}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?p`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="main"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:p`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||y.open({view:"OnRampProviders"})}openModal(){y.open({view:"Connect"})}async onPaymentAmountChange(e){N.setPaymentAmount(Number(e.detail)),await N.getQuote()}async selectPresetAmount(e){N.setPaymentAmount(e),await N.getQuote()}};me.styles=ue,de([P({type:Boolean})],me.prototype,"disabled",void 0),de([$()],me.prototype,"caipAddress",void 0),de([$()],me.prototype,"loading",void 0),de([$()],me.prototype,"paymentCurrency",void 0),de([$()],me.prototype,"paymentAmount",void 0),de([$()],me.prototype,"purchaseAmount",void 0),de([$()],me.prototype,"quoteLoading",void 0),me=de([I("w3m-onramp-widget")],me);export{oe as W3mBuyInProgressView,q as W3mOnRampActivityView,J as W3mOnRampProvidersView,M as W3mOnrampFiatSelectView,te as W3mOnrampTokensView,me as W3mOnrampWidget,se as W3mWhatIsABuyView};
//# sourceMappingURL=onramp-uqSk6xdm.js.map
