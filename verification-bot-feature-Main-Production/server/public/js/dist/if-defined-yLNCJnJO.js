import{U as t,V as e,X as i,i as o,b as a,F as r,r as n,x as s,L as c}from"./bundle.js";const l={getSpacingStyles:(t,e)=>Array.isArray(t)?t[e]?`var(--wui-spacing-${t[e]})`:void 0:"string"==typeof t?`var(--wui-spacing-${t})`:void 0,getFormattedDate:t=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(t),getHostName(t){try{return new URL(t).hostname}catch(t){return""}},getTruncateString:({string:t,charsStart:e,charsEnd:i,truncate:o})=>t.length<=e+i?t:"end"===o?`${t.substring(0,e)}...`:"start"===o?`...${t.substring(t.length-i)}`:`${t.substring(0,Math.floor(e))}...${t.substring(t.length-Math.floor(i))}`,generateAvatarColors(t){const e=t.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),i=this.hexToRgb(e),o=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),a=100-3*Number(o?.replace("px","")),r=`${a}% ${a}% at 65% 40%`,n=[];for(let t=0;t<5;t+=1){const e=this.tintColor(i,.15*t);n.push(`rgb(${e[0]}, ${e[1]}, ${e[2]})`)}return`\n    --local-color-1: ${n[0]};\n    --local-color-2: ${n[1]};\n    --local-color-3: ${n[2]};\n    --local-color-4: ${n[3]};\n    --local-color-5: ${n[4]};\n    --local-radial-circle: ${r}\n   `},hexToRgb(t){const e=parseInt(t,16);return[e>>16&255,e>>8&255,255&e]},tintColor(t,e){const[i,o,a]=t;return[Math.round(i+(255-i)*e),Math.round(o+(255-o)*e),Math.round(a+(255-a)*e)]},isNumber:t=>/^[0-9]+$/u.test(t),getColorTheme:t=>t||("undefined"!=typeof window&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark"),splitBalance(t){const e=t.split(".");return 2===e.length?[e[0],e[1]]:["0","00"]},roundNumber:(t,e,i)=>t.toString().length>=e?Number(t).toFixed(i):t,formatNumberToLocalString:(t,e=2)=>void 0===t?"0.00":"number"==typeof t?t.toLocaleString("en-US",{maximumFractionDigits:e,minimumFractionDigits:e}):parseFloat(t).toLocaleString("en-US",{maximumFractionDigits:e,minimumFractionDigits:e})};function p(t){return function(e){return"function"==typeof e?function(t,e){return customElements.get(t)||customElements.define(t,e),e}(t,e):function(t,e){const{kind:i,elements:o}=e;return{kind:i,elements:o,finisher(e){customElements.get(t)||customElements.define(t,e)}}}(t,e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const h={attribute:!0,type:String,converter:e,reflect:!1,hasChanged:t},w=(t=h,e,i)=>{const{kind:o,metadata:a}=i;let r=globalThis.litPropertyMetadata.get(a);if(void 0===r&&globalThis.litPropertyMetadata.set(a,r=new Map),r.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const a=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,a,t)},init(e){return void 0!==e&&this.P(o,void 0,t),e}}}if("setter"===o){const{name:o}=i;return function(i){const a=this[o];e.call(this,i),this.requestUpdate(o,a,t)}}throw Error("Unsupported decorator location: "+o)};function g(t){return(e,i)=>"object"==typeof i?w(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,o?{...t,wrapped:!0}:t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function d(t){return g({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const u=1,m=2,f=t=>(...e)=>({_$litDirective$:t,values:e});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let v=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const y=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const t of i)t._$AO?.(e,!1),y(t,e);return!0},S=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},$=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),x(e)}};function j(t){void 0!==this._$AN?(S(this),this._$AM=t,$(this)):this._$AM=t}function b(t,e=!1,i=0){const o=this._$AH,a=this._$AN;if(void 0!==a&&0!==a.size)if(e)if(Array.isArray(o))for(let t=i;t<o.length;t++)y(o[t],!1),S(o[t]);else null!=o&&(y(o,!1),S(o));else y(this,t)}const x=t=>{t.type==m&&(t._$AP??=b,t._$AQ??=j)};class _ extends v{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),$(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(y(this,t),S(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class C{constructor(t){this.Y=t}disconnect(){this.Y=void 0}reconnect(t){this.Y=t}deref(){return this.Y}}class k{constructor(){this.Z=void 0,this.q=void 0}get(){return this.Z}pause(){this.Z??=new Promise((t=>this.q=t))}resume(){this.q?.(),this.Z=this.q=void 0}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const z=t=>!(t=>null===t||"object"!=typeof t&&"function"!=typeof t)(t)&&"function"==typeof t.then,A=1073741823;const P=f(class extends _{constructor(){super(...arguments),this._$Cwt=A,this._$Cbt=[],this._$CK=new C(this),this._$CX=new k}render(...t){return t.find((t=>!z(t)))??i}update(t,e){const o=this._$Cbt;let a=o.length;this._$Cbt=e;const r=this._$CK,n=this._$CX;this.isConnected||this.disconnected();for(let t=0;t<e.length&&!(t>this._$Cwt);t++){const i=e[t];if(!z(i))return this._$Cwt=t,i;t<a&&i===o[t]||(this._$Cwt=A,a=0,Promise.resolve(i).then((async t=>{for(;n.get();)await n.get();const e=r.deref();if(void 0!==e){const o=e._$Cbt.indexOf(i);o>-1&&o<e._$Cwt&&(e._$Cwt=o,e.setValue(t))}})))}return i}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}});const B=new class{constructor(){this.cache=new Map}set(t,e){this.cache.set(t,e)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}};var R=o`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`,T=window&&window.__decorate||function(t,e,i,o){var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};const M={add:async()=>(await import("./add-CDQYwwO0.js")).addSvg,allWallets:async()=>(await import("./all-wallets-DNsHKdzT.js")).allWalletsSvg,arrowBottomCircle:async()=>(await import("./arrow-bottom-circle-wuwlzTqd.js")).arrowBottomCircleSvg,appStore:async()=>(await import("./app-store-DRS6Cnxp.js")).appStoreSvg,apple:async()=>(await import("./apple-Dry0Ocbq.js")).appleSvg,arrowBottom:async()=>(await import("./arrow-bottom-RPDFvGiS.js")).arrowBottomSvg,arrowLeft:async()=>(await import("./arrow-left-Bp-tK1IG.js")).arrowLeftSvg,arrowRight:async()=>(await import("./arrow-right-ChQe0UCg.js")).arrowRightSvg,arrowTop:async()=>(await import("./arrow-top-B-TvzfhO.js")).arrowTopSvg,bank:async()=>(await import("./bank-DIYj4Axk.js")).bankSvg,browser:async()=>(await import("./browser-TC6oxnEP.js")).browserSvg,card:async()=>(await import("./card-CQbC-fTt.js")).cardSvg,checkmark:async()=>(await import("./checkmark-CXTMFEf0.js")).checkmarkSvg,checkmarkBold:async()=>(await import("./checkmark-bold-BWgZVnSb.js")).checkmarkBoldSvg,chevronBottom:async()=>(await import("./chevron-bottom-qsEuRNDS.js")).chevronBottomSvg,chevronLeft:async()=>(await import("./chevron-left-CFqpMUBe.js")).chevronLeftSvg,chevronRight:async()=>(await import("./chevron-right-BtMCmgsW.js")).chevronRightSvg,chevronTop:async()=>(await import("./chevron-top-BF8Ya70Q.js")).chevronTopSvg,chromeStore:async()=>(await import("./chrome-store-gHJIfCCY.js")).chromeStoreSvg,clock:async()=>(await import("./clock-BhKIV2I3.js")).clockSvg,close:async()=>(await import("./close-h0_4jZBH.js")).closeSvg,compass:async()=>(await import("./compass-wzGvQBla.js")).compassSvg,coinPlaceholder:async()=>(await import("./coinPlaceholder-CAlQj1hX.js")).coinPlaceholderSvg,copy:async()=>(await import("./copy-Cli_VDMv.js")).copySvg,cursor:async()=>(await import("./cursor-LxYIyc3-.js")).cursorSvg,cursorTransparent:async()=>(await import("./cursor-transparent-TmLIRSEd.js")).cursorTransparentSvg,desktop:async()=>(await import("./desktop-D_AL-nTr.js")).desktopSvg,disconnect:async()=>(await import("./disconnect-BnqUHOqC.js")).disconnectSvg,discord:async()=>(await import("./discord-D8A13aMK.js")).discordSvg,etherscan:async()=>(await import("./etherscan-JohvlKd1.js")).etherscanSvg,extension:async()=>(await import("./extension-pzCjCwmE.js")).extensionSvg,externalLink:async()=>(await import("./external-link-et6oEd47.js")).externalLinkSvg,facebook:async()=>(await import("./facebook-BG9TpAAm.js")).facebookSvg,farcaster:async()=>(await import("./farcaster-a-qU4YDx.js")).farcasterSvg,filters:async()=>(await import("./filters-Cns1TPf7.js")).filtersSvg,github:async()=>(await import("./github-BWJl8OeQ.js")).githubSvg,google:async()=>(await import("./google-zU-S5nCW.js")).googleSvg,helpCircle:async()=>(await import("./help-circle-uLq9DVB0.js")).helpCircleSvg,image:async()=>(await import("./image-BV2prhTp.js")).imageSvg,id:async()=>(await import("./id-DN2yHLho.js")).idSvg,infoCircle:async()=>(await import("./info-circle-BfChRMFh.js")).infoCircleSvg,lightbulb:async()=>(await import("./lightbulb-CMNERjHm.js")).lightbulbSvg,mail:async()=>(await import("./mail-BZdZsE4x.js")).mailSvg,mobile:async()=>(await import("./mobile-D6CcCt0d.js")).mobileSvg,more:async()=>(await import("./more-6nPalAcC.js")).moreSvg,networkPlaceholder:async()=>(await import("./network-placeholder-CVI1m-WF.js")).networkPlaceholderSvg,nftPlaceholder:async()=>(await import("./nftPlaceholder-k_C3yp7O.js")).nftPlaceholderSvg,off:async()=>(await import("./off-CDyBGLpB.js")).offSvg,playStore:async()=>(await import("./play-store-EH5W5XZH.js")).playStoreSvg,plus:async()=>(await import("./plus-Ccc7d5rW.js")).plusSvg,qrCode:async()=>(await import("./qr-code-CjbAGK1t.js")).qrCodeIcon,recycleHorizontal:async()=>(await import("./recycle-horizontal-BiHoeub9.js")).recycleHorizontalSvg,refresh:async()=>(await import("./refresh-D_d29uy3.js")).refreshSvg,search:async()=>(await import("./search-BzNGAq-N.js")).searchSvg,send:async()=>(await import("./send-BqI7x3VQ.js")).sendSvg,swapHorizontal:async()=>(await import("./swapHorizontal-Dnp9xN85.js")).swapHorizontalSvg,swapHorizontalMedium:async()=>(await import("./swapHorizontalMedium-E0HpmyTO.js")).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await import("./swapHorizontalBold-DPHCFPso.js")).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await import("./swapHorizontalRoundedBold-Kguxa_S3.js")).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await import("./swapVertical-DoSrBLZ2.js")).swapVerticalSvg,telegram:async()=>(await import("./telegram-DkQ4yJiG.js")).telegramSvg,threeDots:async()=>(await import("./three-dots-CAYqLA2y.js")).threeDotsSvg,twitch:async()=>(await import("./twitch-qhii32X5.js")).twitchSvg,twitter:async()=>(await import("./x-PJF0ZWpj.js")).xSvg,twitterIcon:async()=>(await import("./twitterIcon-lG8nb7BY.js")).twitterIconSvg,verify:async()=>(await import("./verify-DYeyIZBA.js")).verifySvg,verifyFilled:async()=>(await import("./verify-filled-ldyT7b_p.js")).verifyFilledSvg,wallet:async()=>(await import("./wallet-CUwvodyO.js")).walletSvg,walletConnect:async()=>(await import("./walletconnect-Cgnq1AEk.js")).walletConnectSvg,walletConnectLightBrown:async()=>(await import("./walletconnect-Cgnq1AEk.js")).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await import("./walletconnect-Cgnq1AEk.js")).walletConnectBrownSvg,walletPlaceholder:async()=>(await import("./wallet-placeholder-PHXec1yJ.js")).walletPlaceholderSvg,warningCircle:async()=>(await import("./warning-circle-DFOEOzay.js")).warningCircleSvg,x:async()=>(await import("./x-PJF0ZWpj.js")).xSvg,info:async()=>(await import("./info-DDdVYk0B.js")).infoSvg,exclamationTriangle:async()=>(await import("./exclamation-triangle-BfboTFHb.js")).exclamationTriangleSvg,reown:async()=>(await import("./reown-logo-2hKAqTma.js")).reownSvg};let D=class extends n{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`\n      --local-color: var(--wui-color-${this.color});\n      --local-width: var(--wui-icon-size-${this.size});\n      --local-aspect-ratio: ${this.aspectRatio}\n    `,s`${P(async function(t){if(B.has(t))return B.get(t);const e=(M[t]??M.copy)();return B.set(t,e),e}(this.name),s`<div class="fallback"></div>`)}`}};D.styles=[a,r,R],T([g()],D.prototype,"size",void 0),T([g()],D.prototype,"name",void 0),T([g()],D.prototype,"color",void 0),T([g()],D.prototype,"aspectRatio",void 0),D=T([p("wui-icon")],D);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H=f(class extends v{constructor(t){if(super(t),t.type!==u||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const o=t.element.classList;for(const t of this.st)t in e||(o.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(o.add(t),this.st.add(t)):(o.remove(t),this.st.delete(t)))}return i}});var O=o`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`,L=window&&window.__decorate||function(t,e,i,o){var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let N=class extends n{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){const t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`\n      --local-align: ${this.align};\n      --local-color: var(--wui-color-${this.color});\n    `,s`<slot class=${H(t)}></slot>`}};N.styles=[a,O],L([g()],N.prototype,"variant",void 0),L([g()],N.prototype,"color",void 0),L([g()],N.prototype,"align",void 0),L([g()],N.prototype,"lineClamp",void 0),N=L([p("wui-text")],N);var F=o`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`,U=window&&window.__decorate||function(t,e,i,o){var a,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(r<3?a(n):r>3?a(e,i,n):a(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n};let I=class extends n{render(){return this.style.cssText=`\n      flex-direction: ${this.flexDirection};\n      flex-wrap: ${this.flexWrap};\n      flex-basis: ${this.flexBasis};\n      flex-grow: ${this.flexGrow};\n      flex-shrink: ${this.flexShrink};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&l.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&l.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&l.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&l.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&l.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&l.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&l.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&l.getSpacingStyles(this.margin,3)};\n    `,s`<slot></slot>`}};I.styles=[a,F],U([g()],I.prototype,"flexDirection",void 0),U([g()],I.prototype,"flexWrap",void 0),U([g()],I.prototype,"flexBasis",void 0),U([g()],I.prototype,"flexGrow",void 0),U([g()],I.prototype,"flexShrink",void 0),U([g()],I.prototype,"alignItems",void 0),U([g()],I.prototype,"justifyContent",void 0),U([g()],I.prototype,"columnGap",void 0),U([g()],I.prototype,"rowGap",void 0),U([g()],I.prototype,"gap",void 0),U([g()],I.prototype,"padding",void 0),U([g()],I.prototype,"margin",void 0),I=U([p("wui-flex")],I);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=t=>t??c;export{l as U,f as a,p as c,H as e,_ as f,g as n,E as o,d as r};
//# sourceMappingURL=if-defined-yLNCJnJO.js.map
