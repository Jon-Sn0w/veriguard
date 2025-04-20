import{i as e,b as t,F as i,r,x as o}from"./bundle.js";import{n as s,c}from"./if-defined-yLNCJnJO.js";var a=e`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`,n=window&&window.__decorate||function(e,t,i,r){var o,s=arguments.length,c=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(c=(s<3?o(c):s>3?o(t,i,c):o(t,i))||c);return s>3&&c&&Object.defineProperty(t,i,c),c};let h=class extends r{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`\n      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};\n      `,o`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};h.styles=[t,i,a],n([s()],h.prototype,"src",void 0),n([s()],h.prototype,"alt",void 0),n([s()],h.prototype,"size",void 0),h=n([c("wui-image")],h);
//# sourceMappingURL=index-D9KSP8X3.js.map
