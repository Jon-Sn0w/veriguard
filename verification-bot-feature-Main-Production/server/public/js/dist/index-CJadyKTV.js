import{i as e,r as t,R as o,M as r,x as i}from"./bundle.js";import{n,r as s,c as h}from"./if-defined-yLNCJnJO.js";import{T as d}from"./index-D90hOOI2.js";const a={interpolate(e,t,o){if(2!==e.length||2!==t.length)throw new Error("inputRange and outputRange must be an array of length 2");const r=e[0]||0,i=e[1]||0,n=t[0]||0,s=t[1]||0;return o<r?n:o>i?s:(s-n)/(i-r)*(o-r)+n}};var c=e`
  :host {
    width: 100%;
    display: block;
  }
`,p=window&&window.__decorate||function(e,t,o,r){var i,n=arguments.length,s=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,o,r);else for(var h=e.length-1;h>=0;h--)(i=e[h])&&(s=(n<3?i(s):n>3?i(t,o,s):i(t,o))||s);return n>3&&s&&Object.defineProperty(t,o,s),s};let l=class extends t{constructor(){super(),this.unsubscribe=[],this.text="",this.open=d.state.open,this.unsubscribe.push(o.subscribeKey("view",(()=>{d.hide()})),r.subscribeKey("open",(e=>{e||d.hide()})),d.subscribeKey("open",(e=>{this.open=e})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),d.hide()}render(){return i`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return i`<slot></slot> `}onMouseEnter(){const e=this.getBoundingClientRect();this.open||d.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||d.hide()}};l.styles=[c],p([n()],l.prototype,"text",void 0),p([s()],l.prototype,"open",void 0),l=p([h("w3m-tooltip-trigger")],l);export{a as M};
//# sourceMappingURL=index-CJadyKTV.js.map
