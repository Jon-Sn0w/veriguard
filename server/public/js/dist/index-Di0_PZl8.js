import{i as t,r as e,x as i,b as r,j as a,z as o,d as s,R as n,O as c,e as l,A as p,W as u}from"./bundle.js";import{n as d,c as h,o as g,r as w}from"./if-defined-yLNCJnJO.js";import{T as m,D as x}from"./index-C_pryA1E.js";import"./index-BYuvcniW.js";import"./index-DB5k-Dct.js";import"./index-D9KSP8X3.js";var y;!function(t){t.approve="approved",t.bought="bought",t.borrow="borrowed",t.burn="burnt",t.cancel="canceled",t.claim="claimed",t.deploy="deployed",t.deposit="deposited",t.execute="executed",t.mint="minted",t.receive="received",t.repay="repaid",t.send="sent",t.sell="sold",t.stake="staked",t.trade="swapped",t.unstake="unstaked",t.withdraw="withdrawn"}(y||(y={}));var f=t`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`,v=window&&window.__decorate||function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let b=class extends e{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[t,e]=this.images,r="NFT"===t?.type,a=r?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",o=(e?.url?"NFT"===e.type:r)?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`\n    --local-left-border-radius: ${a};\n    --local-right-border-radius: ${o};\n    `,i`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[t,e]=this.images,r=t?.type;return 2===this.images.length&&(t?.url||e?.url)?i`<div class="swap-images-container">
        ${t?.url?i`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${e?.url?i`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t?.url?i`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:"NFT"===r?i`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:i`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t,e="accent-100";return t=this.getIcon(),this.status&&(e=this.getStatusColor()),t?i`
      <wui-icon-box
        size="xxs"
        iconColor=${e}
        backgroundColor=${e}
        background="opaque"
        icon=${t}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():"trade"===this.type?"swapHorizontalBold":"approve"===this.type?"checkmark":"cancel"===this.type?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};b.styles=[f],v([d()],b.prototype,"type",void 0),v([d()],b.prototype,"status",void 0),v([d()],b.prototype,"direction",void 0),v([d({type:Boolean})],b.prototype,"onlyDirectionIcon",void 0),v([d({type:Array})],b.prototype,"images",void 0),v([d({type:Object})],b.prototype,"secondImage",void 0),b=v([h("wui-transaction-visual")],b);var $=t`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-xs) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`,T=window&&window.__decorate||function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};let A=class extends e{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return i`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${g(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${g(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${y[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){const t=this.descriptions?.[0];return t?i`
          <wui-text variant="small-500" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){const t=this.descriptions?.[1];return t?i`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}};A.styles=[r,$],T([d()],A.prototype,"type",void 0),T([d({type:Array})],A.prototype,"descriptions",void 0),T([d()],A.prototype,"date",void 0),T([d({type:Boolean})],A.prototype,"onlyDirectionIcon",void 0),T([d()],A.prototype,"status",void 0),T([d()],A.prototype,"direction",void 0),T([d({type:Array})],A.prototype,"images",void 0),T([d({type:Array})],A.prototype,"price",void 0),T([d({type:Array})],A.prototype,"amount",void 0),T([d({type:Array})],A.prototype,"symbol",void 0),A=T([h("wui-transaction-list-item")],A);var C=t`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: var(--wui-spacing-m);
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

  .emptyContainer {
    height: 100%;
  }
`,k=window&&window.__decorate||function(t,e,i,r){var a,o=arguments.length,s=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(o<3?a(s):o>3?a(e,i,s):a(e,i))||s);return o>3&&s&&Object.defineProperty(e,i,s),s};const I="last-transaction";let D=class extends e{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=a.state.activeCaipAddress,this.transactionsByYear=o.state.transactionsByYear,this.loading=o.state.loading,this.empty=o.state.empty,this.next=o.state.next,o.clearCursor(),this.unsubscribe.push(a.subscribeKey("activeCaipAddress",(t=>{t&&this.caipAddress!==t&&(o.resetTransactions(),o.fetchTransactions(t)),this.caipAddress=t})),a.subscribeKey("activeCaipNetwork",(()=>{this.updateTransactionView()})),o.subscribe((t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next})))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){return i` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){const t=a.state.activeCaipNetwork?.caipNetworkId;o.state.lastNetworkInView!==t&&(o.resetTransactions(),this.caipAddress&&o.fetchTransactions(s.getPlainAddress(this.caipAddress))),o.setLastNetworkInView(t)}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map((t=>{const e=parseInt(t,10),r=new Array(12).fill(null).map(((t,i)=>{const r=m.getTransactionGroupTitle(e,i),a=this.transactionsByYear[e]?.[i];return{groupTitle:r,transactions:a}})).filter((({transactions:t})=>t)).reverse();return r.map((({groupTitle:t,transactions:e},a)=>{const o=a===r.length-1;return e?i`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${o?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${t}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(e,o)}
            </wui-flex>
          </wui-flex>
        `:null}))}))}templateRenderTransaction(t,e){const{date:r,descriptions:a,direction:o,isAllNFT:s,images:n,status:c,transfers:l,type:p}=this.getTransactionListItemProps(t),u=l?.length>1;return 2===l?.length&&!s?i`
        <wui-transaction-list-item
          date=${r}
          .direction=${o}
          id=${e&&this.next?I:""}
          status=${c}
          type=${p}
          .images=${n}
          .descriptions=${a}
        ></wui-transaction-list-item>
      `:u?l.map(((t,a)=>{const o=m.getTransferDescription(t),s=e&&a===l.length-1;return i` <wui-transaction-list-item
          date=${r}
          direction=${t.direction}
          id=${s&&this.next?I:""}
          status=${c}
          type=${p}
          .onlyDirectionIcon=${!0}
          .images=${[n[a]]}
          .descriptions=${[o]}
        ></wui-transaction-list-item>`})):i`
      <wui-transaction-list-item
        date=${r}
        .direction=${o}
        id=${e&&this.next?I:""}
        status=${c}
        type=${p}
        .images=${n}
        .descriptions=${a}
      ></wui-transaction-list-item>
    `}templateTransactions(t,e){return t.map(((r,a)=>{const o=e&&a===t.length-1;return i`${this.templateRenderTransaction(r,o)}`}))}emptyStateActivity(){return i`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["3xl","xl","3xl","xl"]}
      gap="xl"
      data-testid="empty-activity-state"
    >
      <wui-icon-box
        backgroundColor="gray-glass-005"
        background="gray"
        iconColor="fg-200"
        icon="wallet"
        size="lg"
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >No Transactions yet</wui-text
        >
        <wui-text align="center" variant="small-500" color="fg-200"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return i`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
      data-testid="empty-account-state"
    >
      <wui-icon-box
        icon="swapHorizontal"
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
        <wui-text variant="paragraph-500" align="center" color="fg-100">No activity yet</wui-text>
        <wui-text variant="small-400" align="center" color="fg-200"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return"account"===this.page?i`${this.emptyStateAccount()}`:i`${this.emptyStateActivity()}`}templateLoading(){return"activity"===this.page?Array(7).fill(i` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map((t=>t)):null}onReceiveClick(){n.push("WalletReceive")}createPaginationObserver(){const{projectId:t}=c.state;this.paginationObserver=new IntersectionObserver((([e])=>{e?.isIntersecting&&!this.loading&&(o.fetchTransactions(s.getPlainAddress(this.caipAddress)),l.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:s.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:p.state.preferredAccountType===u.ACCOUNT_TYPES.SMART_ACCOUNT}}))}),{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();const t=this.shadowRoot?.querySelector(`#${I}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){const e=x.formatDate(t?.metadata?.minedAt),i=m.getTransactionDescriptions(t),r=t?.transfers,a=t?.transfers?.[0],o=Boolean(a)&&t?.transfers?.every((t=>Boolean(t.nft_info))),s=m.getTransactionImages(r);return{date:e,direction:a?.direction,descriptions:i,isAllNFT:o,images:s,status:t.metadata?.status,transfers:r,type:t.metadata?.operationType}}};D.styles=C,k([d()],D.prototype,"page",void 0),k([w()],D.prototype,"caipAddress",void 0),k([w()],D.prototype,"transactionsByYear",void 0),k([w()],D.prototype,"loading",void 0),k([w()],D.prototype,"empty",void 0),k([w()],D.prototype,"next",void 0),D=k([h("w3m-activity-list")],D);
//# sourceMappingURL=index-Di0_PZl8.js.map
