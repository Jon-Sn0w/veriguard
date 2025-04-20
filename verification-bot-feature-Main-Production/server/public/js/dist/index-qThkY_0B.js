import{i as o,b as e,f as t,r,x as a}from"./bundle.js";import{n as i,c as l,U as c}from"./if-defined-yLNCJnJO.js";import"./index-D9KSP8X3.js";var n=o`
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

  wui-image,
  wui-icon {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
  }
`,s=window&&window.__decorate||function(o,e,t,r){var a,i=arguments.length,l=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,t):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(o,e,t,r);else for(var c=o.length-1;c>=0;c--)(a=o[c])&&(l=(i<3?a(l):i>3?a(e,t,l):a(e,t))||l);return i>3&&l&&Object.defineProperty(e,t,l),l};let d=class extends r{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1}render(){return a`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="s" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex flexDirection="column" justifyContent="spaceBetween">
            <wui-text variant="paragraph-500" color="fg-100">${this.tokenName}</wui-text>
            <wui-text variant="small-400" color="fg-200">
              ${c.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-text variant="paragraph-500" color="fg-100">$${this.tokenValue.toFixed(2)}</wui-text>
      </button>
    `}visualTemplate(){return this.tokenName&&this.tokenImageUrl?a`<wui-image alt=${this.tokenName} src=${this.tokenImageUrl}></wui-image>`:a`<wui-icon name="coinPlaceholder" color="fg-100"></wui-icon>`}};d.styles=[e,t,n],s([i()],d.prototype,"tokenName",void 0),s([i()],d.prototype,"tokenImageUrl",void 0),s([i({type:Number})],d.prototype,"tokenValue",void 0),s([i()],d.prototype,"tokenAmount",void 0),s([i()],d.prototype,"tokenCurrency",void 0),s([i({type:Boolean})],d.prototype,"clickable",void 0),d=s([l("wui-list-token")],d);var u=o`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: var(--wui-color-gray-glass-005);
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 10px;
    background-color: var(--wui-color-modal-bg);
    transition: background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color;
  }
`,v=window&&window.__decorate||function(o,e,t,r){var a,i=arguments.length,l=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,t):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(o,e,t,r);else for(var c=o.length-1;c>=0;c--)(a=o[c])&&(l=(i<3?a(l):i>3?a(e,t,l):a(e,t))||l);return i>3&&l&&Object.defineProperty(e,t,l),l};let g=class extends r{constructor(){super(...arguments),this.text=""}render(){return a`${this.template()}`}template(){return this.text?a`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};g.styles=[e,u],v([i()],g.prototype,"text",void 0),g=v([l("wui-separator")],g);var m=o`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
    border-radius: var(--wui-border-radius-3xl);
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    overflow: hidden;
    position: relative;
  }

  :host([data-variant='generated']) {
    --mixed-local-color-1: var(--local-color-1);
    --mixed-local-color-2: var(--local-color-2);
    --mixed-local-color-3: var(--local-color-3);
    --mixed-local-color-4: var(--local-color-4);
    --mixed-local-color-5: var(--local-color-5);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host([data-variant='generated']) {
      --mixed-local-color-1: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-1)
      );
      --mixed-local-color-2: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-2)
      );
      --mixed-local-color-3: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-3)
      );
      --mixed-local-color-4: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-4)
      );
      --mixed-local-color-5: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-5)
      );
    }
  }

  :host([data-variant='generated']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      var(--local-radial-circle),
      #fff 0.52%,
      var(--mixed-local-color-5) 31.25%,
      var(--mixed-local-color-3) 51.56%,
      var(--mixed-local-color-2) 65.63%,
      var(--mixed-local-color-1) 82.29%,
      var(--mixed-local-color-4) 100%
    );
  }

  :host([data-variant='default']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      75.29% 75.29% at 64.96% 24.36%,
      #fff 0.52%,
      #f5ccfc 31.25%,
      #dba4f5 51.56%,
      #9a8ee8 65.63%,
      #6493da 82.29%,
      #6ebdea 100%
    );
  }
`,p=window&&window.__decorate||function(o,e,t,r){var a,i=arguments.length,l=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,t):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(o,e,t,r);else for(var c=o.length-1;c>=0;c--)(a=o[c])&&(l=(i<3?a(l):i>3?a(e,t,l):a(e,t))||l);return i>3&&l&&Object.defineProperty(e,t,l),l};let w=class extends r{constructor(){super(...arguments),this.imageSrc=void 0,this.alt=void 0,this.address=void 0,this.size="xl"}render(){return this.style.cssText=`\n    --local-width: var(--wui-icon-box-size-${this.size});\n    --local-height: var(--wui-icon-box-size-${this.size});\n    `,a`${this.visualTemplate()}`}visualTemplate(){if(this.imageSrc)return this.dataset.variant="image",a`<wui-image src=${this.imageSrc} alt=${this.alt??"avatar"}></wui-image>`;if(this.address){this.dataset.variant="generated";const o=c.generateAvatarColors(this.address);return this.style.cssText+=`\n ${o}`,null}return this.dataset.variant="default",null}};w.styles=[e,m],p([i()],w.prototype,"imageSrc",void 0),p([i()],w.prototype,"alt",void 0),p([i()],w.prototype,"address",void 0),p([i()],w.prototype,"size",void 0),w=p([l("wui-avatar")],w);
//# sourceMappingURL=index-qThkY_0B.js.map
