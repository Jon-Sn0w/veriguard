import{s as t,w as e,y as o,i,r as a,x as r}from"./bundle.js";import{r as s,c as n}from"./if-defined-yLNCJnJO.js";const p=t({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),c={state:p,subscribe:t=>o(p,(()=>t(p))),subscribeKey:(t,o)=>e(p,t,o),showTooltip({message:t,triggerRect:e,variant:o}){p.open=!0,p.message=t,p.triggerRect=e,p.variant=o},hide(){p.open=!1,p.message="",p.triggerRect={width:0,height:0,top:0,left:0}}};var l=i`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-bg-100);
    position: fixed;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--w3m-modal-width) - var(--wui-spacing-xl));
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: var(--wui-color-bg-150);
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
`,g=window&&window.__decorate||function(t,e,o,i){var a,r=arguments.length,s=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,o,i);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(s=(r<3?a(s):r>3?a(e,o,s):a(e,o))||s);return r>3&&s&&Object.defineProperty(e,o,s),s};let d=class extends a{constructor(){super(),this.unsubscribe=[],this.open=c.state.open,this.message=c.state.message,this.triggerRect=c.state.triggerRect,this.variant=c.state.variant,this.unsubscribe.push(c.subscribe((t=>{this.open=t.open,this.message=t.message,this.triggerRect=t.triggerRect,this.variant=t.variant})))}disconnectedCallback(){this.unsubscribe.forEach((t=>t()))}render(){this.dataset.variant=this.variant;const t=this.triggerRect.top,e=this.triggerRect.left;return this.style.cssText=`\n    --w3m-tooltip-top: ${t}px;\n    --w3m-tooltip-left: ${e}px;\n    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;\n    --w3m-tooltip-display: ${this.open?"flex":"none"};\n    --w3m-tooltip-opacity: ${this.open?1:0};\n    `,r`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`}};d.styles=[l],g([s()],d.prototype,"open",void 0),g([s()],d.prototype,"message",void 0),g([s()],d.prototype,"triggerRect",void 0),g([s()],d.prototype,"variant",void 0),d=g([n("w3m-tooltip"),n("w3m-tooltip")],d);export{c as T};
//# sourceMappingURL=index-D90hOOI2.js.map
