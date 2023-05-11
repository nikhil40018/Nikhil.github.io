import{E as EventTracker,a as assertInstanceof,b as assert,h as hasKeyModifiers,i as isRTL,g as getDeepActiveElement,F as FocusOutlineManager,S as SaveRequestType,P as PromiseResolver,c as PluginController,d as PluginControllerEventType,r as record,U as UserAction,e as FittingType,f as PdfViewerBaseElement,s as shouldIgnoreKeyEvents,j as hasCtrlModifier,k as assertNotReached,l as listenOnce}from"./shared.rollup.js";export{C as CrIconButtonElement,G as GestureDetector,O as OpenPdfParamsParser,q as PAGE_SHADOW,o as SwipeDetector,p as SwipeDirection,V as Viewport,t as ViewportScroller,Z as ZoomManager,m as recordFitTo,n as resetForTesting}from"./shared.rollup.js";import{html,PolymerElement,FlattenedNodesObserver,Polymer}from"chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js";export{BrowserApi,ZoomBehavior}from"./browser_api.js";import{loadTimeData}from"chrome://resources/js/load_time_data.js";import{LoadState,deserializeKeyEvent}from"./pdf_scripting_api.js";
// Copyright 2014 The Chromium Authors
const ACTIVE_CLASS="focus-row-active";class FocusRow{constructor(root,boundary,delegate){this.eventTracker=new EventTracker;this.root=root;this.boundary_=boundary||document.documentElement;this.delegate=delegate}static isFocusable(element){if(!element||element.disabled){return false}let current=element;while(true){assertInstanceof(current,Element);const style=window.getComputedStyle(current);if(style.visibility==="hidden"||style.display==="none"){return false}const parent=current.parentNode;if(!parent){return false}if(parent===current.ownerDocument||parent instanceof DocumentFragment){return true}current=parent}}static getFocusableElement(element){const withFocusable=element;if(withFocusable.getFocusableElement){return withFocusable.getFocusableElement()}return element}addItem(type,selectorOrElement){assert(type);let element;if(typeof selectorOrElement==="string"){element=this.root.querySelector(selectorOrElement)}else{element=selectorOrElement}if(!element){return false}element.setAttribute("focus-type",type);element.tabIndex=this.isActive()?0:-1;this.eventTracker.add(element,"blur",this.onBlur_.bind(this));this.eventTracker.add(element,"focus",this.onFocus_.bind(this));this.eventTracker.add(element,"keydown",this.onKeydown_.bind(this));this.eventTracker.add(element,"mousedown",this.onMousedown_.bind(this));return true}destroy(){this.eventTracker.removeAll()}getCustomEquivalent(_sampleElement){const focusable=this.getFirstFocusable();assert(focusable);return focusable}getElements(){return Array.from(this.root.querySelectorAll("[focus-type]")).map(FocusRow.getFocusableElement)}getEquivalentElement(sampleElement){if(this.getFocusableElements().indexOf(sampleElement)>=0){return sampleElement}const sampleFocusType=this.getTypeForElement(sampleElement);if(sampleFocusType){const sameType=this.getFirstFocusable(sampleFocusType);if(sameType){return sameType}}return this.getCustomEquivalent(sampleElement)}getFirstFocusable(type){const element=this.getFocusableElements().find((el=>!type||el.getAttribute("focus-type")===type));return element||null}getFocusableElements(){return this.getElements().filter(FocusRow.isFocusable)}getTypeForElement(element){return element.getAttribute("focus-type")||""}isActive(){return this.root.classList.contains(ACTIVE_CLASS)}makeActive(active){if(active===this.isActive()){return}this.getElements().forEach((function(element){element.tabIndex=active?0:-1}));this.root.classList.toggle(ACTIVE_CLASS,active)}onBlur_(e){if(!this.boundary_.contains(e.relatedTarget)){return}const currentTarget=e.currentTarget;if(this.getFocusableElements().indexOf(currentTarget)>=0){this.makeActive(false)}}onFocus_(e){if(this.delegate){this.delegate.onFocus(this,e)}}onMousedown_(e){if(e.button){return}const target=e.currentTarget;if(!target.disabled){target.tabIndex=0}}onKeydown_(e){const elements=this.getFocusableElements();const currentElement=FocusRow.getFocusableElement(e.currentTarget);const elementIndex=elements.indexOf(currentElement);assert(elementIndex>=0);if(this.delegate&&this.delegate.onKeydown(this,e)){return}const isShiftTab=!e.altKey&&!e.ctrlKey&&!e.metaKey&&e.shiftKey&&e.key==="Tab";if(hasKeyModifiers(e)&&!isShiftTab){return}let index=-1;let shouldStopPropagation=true;if(isShiftTab){index=elementIndex-1;if(index<0){return}}else if(e.key==="ArrowLeft"){index=elementIndex+(isRTL()?1:-1)}else if(e.key==="ArrowRight"){index=elementIndex+(isRTL()?-1:1)}else if(e.key==="Home"){index=0}else if(e.key==="End"){index=elements.length-1}else{shouldStopPropagation=false}const elementToFocus=elements[index];if(elementToFocus){this.getEquivalentElement(elementToFocus).focus();e.preventDefault()}if(shouldStopPropagation){e.stopPropagation()}}}
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const isMac=/Mac/.test(navigator.platform);const isWindows=/Win/.test(navigator.platform);const isIOS=/CriOS/.test(navigator.userAgent);
// Copyright 2017 The Chromium Authors
let hideInk=false;assert(!isIOS,"pointerdown doesn't work on iOS");document.addEventListener("pointerdown",(function(){hideInk=true}),true);document.addEventListener("keydown",(function(){hideInk=false}),true);function focusWithoutInk(toFocus){if(!("noink"in toFocus)||!hideInk){toFocus.focus();return}const toFocusWithNoInk=toFocus;assert(document===toFocusWithNoInk.ownerDocument);const{noink:noink}=toFocusWithNoInk;toFocusWithNoInk.noink=true;toFocusWithNoInk.focus();toFocusWithNoInk.noink=noink}function getTemplate$c(){return html`<!--_html_template_start_-->    <style>:host dialog{background-color:var(--cr-menu-background-color);border:none;border-radius:4px;box-shadow:var(--cr-menu-shadow);margin:0;min-width:128px;outline:0;padding:0;position:absolute}@media (forced-colors:active){:host dialog{border:var(--cr-border-hcm)}}:host dialog::backdrop{background-color:transparent}:host ::slotted(.dropdown-item){-webkit-tap-highlight-color:transparent;background:0 0;border:none;border-radius:0;box-sizing:border-box;color:var(--cr-primary-text-color);font:inherit;min-height:32px;padding:0 24px;text-align:start;user-select:none;width:100%}:host ::slotted(.dropdown-item:not([hidden])){align-items:center;display:flex}:host ::slotted(.dropdown-item[disabled]){opacity:var(--cr-action-menu-disabled-item-opacity,.65)}:host ::slotted(.dropdown-item:not([disabled])){cursor:pointer}:host ::slotted(.dropdown-item:focus){background-color:var(--cr-menu-background-focus-color);outline:0}@media (forced-colors:active){:host ::slotted(.dropdown-item:focus){outline:var(--cr-focus-outline-hcm)}}.item-wrapper{background:var(--cr-menu-background-sheen);outline:0;padding:8px 0}</style>
    <dialog id="dialog" part="dialog" on-close="onNativeDialogClose_" role="application" aria-roledescription$="[[roleDescription]]">
      <div id="wrapper" class="item-wrapper" role="menu" tabindex="-1" aria-label$="[[accessibilityLabel]]">
        <slot id="contentNode"></slot>
      </div>
    </dialog>
<!--_html_template_end_-->`}
// Copyright 2016 The Chromium Authors
var AnchorAlignment;(function(AnchorAlignment){AnchorAlignment[AnchorAlignment["BEFORE_START"]=-2]="BEFORE_START";AnchorAlignment[AnchorAlignment["AFTER_START"]=-1]="AFTER_START";AnchorAlignment[AnchorAlignment["CENTER"]=0]="CENTER";AnchorAlignment[AnchorAlignment["BEFORE_END"]=1]="BEFORE_END";AnchorAlignment[AnchorAlignment["AFTER_END"]=2]="AFTER_END"})(AnchorAlignment||(AnchorAlignment={}));const DROPDOWN_ITEM_CLASS="dropdown-item";const SELECTABLE_DROPDOWN_ITEM_QUERY=`.${DROPDOWN_ITEM_CLASS}:not([hidden]):not([disabled])`;const AFTER_END_OFFSET=10;function getStartPointWithAnchor(start,end,menuLength,anchorAlignment,min,max){let startPoint=0;switch(anchorAlignment){case AnchorAlignment.BEFORE_START:startPoint=-menuLength;break;case AnchorAlignment.AFTER_START:startPoint=start;break;case AnchorAlignment.CENTER:startPoint=(start+end-menuLength)/2;break;case AnchorAlignment.BEFORE_END:startPoint=end-menuLength;break;case AnchorAlignment.AFTER_END:startPoint=end;break}if(startPoint+menuLength>max){startPoint=end-menuLength}if(startPoint<min){startPoint=start}startPoint=Math.max(min,Math.min(startPoint,max-menuLength));return startPoint}function getDefaultShowConfig(){return{top:0,left:0,height:0,width:0,anchorAlignmentX:AnchorAlignment.AFTER_START,anchorAlignmentY:AnchorAlignment.AFTER_START,minX:0,minY:0,maxX:0,maxY:0}}class CrActionMenuElement extends PolymerElement{constructor(){super(...arguments);this.boundClose_=null;this.contentObserver_=null;this.resizeObserver_=null;this.hasMousemoveListener_=false;this.anchorElement_=null;this.lastConfig_=null}static get is(){return"cr-action-menu"}static get template(){return getTemplate$c()}static get properties(){return{accessibilityLabel:String,autoReposition:{type:Boolean,value:false},open:{type:Boolean,notify:true,value:false},roleDescription:String}}ready(){super.ready();this.addEventListener("keydown",this.onKeyDown_.bind(this));this.addEventListener("mouseover",this.onMouseover_);this.addEventListener("click",this.onClick_)}disconnectedCallback(){super.disconnectedCallback();this.removeListeners_()}fire_(eventName,detail){this.dispatchEvent(new CustomEvent(eventName,{bubbles:true,composed:true,detail:detail}))}getDialog(){return this.$.dialog}removeListeners_(){window.removeEventListener("resize",this.boundClose_);window.removeEventListener("popstate",this.boundClose_);if(this.contentObserver_){this.contentObserver_.disconnect();this.contentObserver_=null}if(this.resizeObserver_){this.resizeObserver_.disconnect();this.resizeObserver_=null}}onNativeDialogClose_(e){if(e.target!==this.$.dialog){return}this.fire_("close")}onClick_(e){if(e.target===this){this.close();e.stopPropagation()}}onKeyDown_(e){e.stopPropagation();if(e.key==="Tab"||e.key==="Escape"){this.close();if(e.key==="Tab"){this.fire_("tabkeyclose",{shiftKey:e.shiftKey})}e.preventDefault();return}if(e.key!=="Enter"&&e.key!=="ArrowUp"&&e.key!=="ArrowDown"){return}const options=Array.from(this.querySelectorAll(SELECTABLE_DROPDOWN_ITEM_QUERY));if(options.length===0){return}const focused=getDeepActiveElement();const index=options.findIndex((option=>FocusRow.getFocusableElement(option)===focused));if(e.key==="Enter"){if(index!==-1){return}if(isWindows||isMac){this.close();e.preventDefault();return}}e.preventDefault();this.updateFocus_(options,index,e.key!=="ArrowUp");if(!this.hasMousemoveListener_){this.hasMousemoveListener_=true;this.addEventListener("mousemove",(e=>{this.onMouseover_(e);this.hasMousemoveListener_=false}),{once:true})}}onMouseover_(e){const item=e.composedPath().find((el=>el.matches&&el.matches(SELECTABLE_DROPDOWN_ITEM_QUERY)));(item||this.$.wrapper).focus()}updateFocus_(options,focusedIndex,next){const numOptions=options.length;assert(numOptions>0);let index;if(focusedIndex===-1){index=next?0:numOptions-1}else{const delta=next?1:-1;index=(numOptions+focusedIndex+delta)%numOptions}options[index].focus()}close(){this.removeListeners_();this.$.dialog.close();this.open=false;if(this.anchorElement_){assert(this.anchorElement_);focusWithoutInk(this.anchorElement_);this.anchorElement_=null}if(this.lastConfig_){this.lastConfig_=null}}showAt(anchorElement,config){this.anchorElement_=anchorElement;this.anchorElement_.scrollIntoViewIfNeeded();const rect=this.anchorElement_.getBoundingClientRect();let height=rect.height;if(config&&!config.noOffset&&config.anchorAlignmentY===AnchorAlignment.AFTER_END){height-=AFTER_END_OFFSET}this.showAtPosition(Object.assign({top:rect.top,left:rect.left,height:height,width:rect.width,anchorAlignmentX:AnchorAlignment.BEFORE_END},config));this.$.wrapper.focus()}showAtPosition(config){const doc=document.scrollingElement;const scrollLeft=doc.scrollLeft;const scrollTop=doc.scrollTop;this.resetStyle_();this.$.dialog.showModal();this.open=true;config.top+=scrollTop;config.left+=scrollLeft;this.positionDialog_(Object.assign({minX:scrollLeft,minY:scrollTop,maxX:scrollLeft+doc.clientWidth,maxY:scrollTop+doc.clientHeight},config));doc.scrollTop=scrollTop;doc.scrollLeft=scrollLeft;this.addListeners_();const openedByKey=FocusOutlineManager.forDocument(document).visible;if(openedByKey){const firstSelectableItem=this.querySelector(SELECTABLE_DROPDOWN_ITEM_QUERY);if(firstSelectableItem){requestAnimationFrame((()=>{firstSelectableItem.focus()}))}}}resetStyle_(){this.$.dialog.style.left="";this.$.dialog.style.right="";this.$.dialog.style.top="0"}positionDialog_(config){this.lastConfig_=config;const c=Object.assign(getDefaultShowConfig(),config);const top=c.top;const left=c.left;const bottom=top+c.height;const right=left+c.width;const rtl=getComputedStyle(this).direction==="rtl";if(rtl){c.anchorAlignmentX*=-1}const offsetWidth=this.$.dialog.offsetWidth;const menuLeft=getStartPointWithAnchor(left,right,offsetWidth,c.anchorAlignmentX,c.minX,c.maxX);if(rtl){const menuRight=document.scrollingElement.clientWidth-menuLeft-offsetWidth;this.$.dialog.style.right=menuRight+"px"}else{this.$.dialog.style.left=menuLeft+"px"}const menuTop=getStartPointWithAnchor(top,bottom,this.$.dialog.offsetHeight,c.anchorAlignmentY,c.minY,c.maxY);this.$.dialog.style.top=menuTop+"px"}addListeners_(){this.boundClose_=this.boundClose_||(()=>{if(this.$.dialog.open){this.close()}});window.addEventListener("resize",this.boundClose_);window.addEventListener("popstate",this.boundClose_);this.contentObserver_=new FlattenedNodesObserver(this.$.contentNode,(info=>{info.addedNodes.forEach((node=>{if(node.classList&&node.classList.contains(DROPDOWN_ITEM_CLASS)&&!node.getAttribute("role")){node.setAttribute("role","menuitem")}}))}));if(this.autoReposition){this.resizeObserver_=new ResizeObserver((()=>{if(this.lastConfig_){this.positionDialog_(this.lastConfig_);this.fire_("cr-action-menu-repositioned")}}));this.resizeObserver_.observe(this.$.dialog)}}}customElements.define(CrActionMenuElement.is,CrActionMenuElement);const styleMod$2=document.createElement("dom-module");styleMod$2.appendChild(html`
  <template>
    <style>
cr-icon-button{--cr-icon-button-fill-color:var(--pdf-toolbar-text-color);--cr-icon-button-focus-outline-color:var(--google-grey-500);margin:0}cr-icon-button:hover{background:rgba(255,255,255,.08);border-radius:50%}cr-action-menu,viewer-bookmark{--cr-menu-background-color:var(--google-grey-900);--cr-menu-shadow:rgba(0, 0, 0, .3) 0 1px 2px 0,rgba(0, 0, 0, .15) 0 3px 6px 2px;--cr-primary-text-color:var(--google-grey-200);--cr-menu-background-focus-color:var(--google-grey-700);--cr-menu-background-sheen:rgba(255, 255, 255, .06);--cr-separator-line:var(--cr-separator-height) solid rgba(255, 255, 255, .1)}
    </style>
  </template>
`.content);styleMod$2.register("pdf-shared");function getTemplate$b(){return html`<!--_html_template_start_-->    <style include="pdf-shared">#item{align-items:flex-start;cursor:pointer;display:flex;padding:5px 0;position:relative;transition:background-color .1s ease-out}#item:hover{background-color:var(--cr-menu-background-focus-color)}#item:active{background-color:rgba(255,255,255,.25)}#title{outline:0;overflow:hidden;text-overflow:ellipsis}#title:focus-visible{outline:auto -webkit-focus-ring-color}#expand-container{--expand-button-size:28px;flex-shrink:0;position:relative;width:var(--expand-button-size)}#expand-container::before{content:'.';visibility:hidden}#expand{--cr-icon-button-fill-color:var(--primary-text-color);--cr-icon-button-icon-size:16px;--cr-icon-button-size:var(--expand-button-size);left:0;margin:0;position:absolute;top:calc((100% - var(--cr-icon-button-size))/ 2);transition:transform 150ms}:host-context([dir=rtl]) #expand{transform:rotate(180deg)}:host([children-shown_]) #expand{transform:rotate(90deg)}</style>
    <div id="item" on-click="onClick_">
      <div id="expand-container">
        <cr-icon-button id="expand" iron-icon="cr:chevron-right" aria-label="Section" aria-expanded$="[[getAriaExpanded_(childrenShown_)]]" on-click="toggleChildren_"></cr-icon-button>
      </div>
      <span id="title" tabindex="0">[[bookmark.title]]</span>
    </div>
    
    <template is="dom-if" if="[[childrenShown_]]">
      <template is="dom-repeat" items="[[bookmark.children]]">
        <viewer-bookmark bookmark="[[item]]" depth="[[childDepth_]]">
        </viewer-bookmark>
      </template>
    </template>
<!--_html_template_end_-->`}
// Copyright 2015 The Chromium Authors
const BOOKMARK_INDENT=20;var ChangePageOrigin;(function(ChangePageOrigin){ChangePageOrigin["BOOKMARK"]="bookmark";ChangePageOrigin["THUMBNAIL"]="thumbnail";ChangePageOrigin["PAGE_SELECTOR"]="pageSelector"})(ChangePageOrigin||(ChangePageOrigin={}));class ViewerBookmarkElement extends PolymerElement{static get is(){return"viewer-bookmark"}static get template(){return getTemplate$b()}static get properties(){return{bookmark:{type:Object,observer:"bookmarkChanged_"},depth:{type:Number,observer:"depthChanged_"},childDepth_:Number,childrenShown_:{type:Boolean,reflectToAttribute:true,value:false}}}ready(){super.ready();this.$.item.addEventListener("keydown",(e=>{if(e.key==="Enter"){this.onEnter_(e)}else if(e.key===" "){this.onSpace_(e)}}))}fire_(eventName,detail){this.dispatchEvent(new CustomEvent(eventName,{bubbles:true,composed:true,detail:detail}))}bookmarkChanged_(){this.$.expand.style.visibility=this.bookmark.children.length>0?"visible":"hidden"}depthChanged_(){this.childDepth_=this.depth+1;this.$.item.style.paddingInlineStart=this.depth*BOOKMARK_INDENT+"px"}onClick_(){if(this.bookmark.page!=null){if(this.bookmark.zoom!=null){this.fire_("change-zoom",{zoom:this.bookmark.zoom})}if(this.bookmark.x!=null&&this.bookmark.y!=null){this.fire_("change-page-and-xy",{page:this.bookmark.page,x:this.bookmark.x,y:this.bookmark.y,origin:ChangePageOrigin.BOOKMARK})}else{this.fire_("change-page",{page:this.bookmark.page,origin:ChangePageOrigin.BOOKMARK})}}else if(this.bookmark.uri!=null){this.fire_("navigate",{uri:this.bookmark.uri,newtab:true})}}onEnter_(e){if(e.target!==this.$.expand){this.onClick_()}}onSpace_(e){this.onClick_();e.preventDefault()}toggleChildren_(e){this.childrenShown_=!this.childrenShown_;e.stopPropagation()}getAriaExpanded_(){return this.childrenShown_?"true":"false"}}customElements.define(ViewerBookmarkElement.is,ViewerBookmarkElement);function getTemplate$a(){return html`<!--_html_template_start_--><style include="pdf-shared">:host{display:block;padding-inline-end:20px;padding-top:20px}</style>
<template is="dom-repeat" items="[[bookmarks]]">
  <viewer-bookmark bookmark="[[item]]" depth="0"></viewer-bookmark>
</template>
<!--_html_template_end_-->`}
// Copyright 2020 The Chromium Authors
class ViewerDocumentOutlineElement extends PolymerElement{static get is(){return"viewer-document-outline"}static get template(){return getTemplate$a()}static get properties(){return{bookmarks:Array}}}customElements.define(ViewerDocumentOutlineElement.is,ViewerDocumentOutlineElement);function getTemplate$9(){return html`<!--_html_template_start_--><style include="pdf-shared">:host{display:contents}cr-action-menu::part(dialog){position:fixed;top:48px}:host([menu-open_]) #download{background-color:var(--active-button-bg);border-radius:50%}</style>
<cr-icon-button id="download" iron-icon="cr:file-download" on-click="onDownloadClick_" aria-label="Download" aria-haspopup$="[[downloadHasPopup_]]" title="Download"></cr-icon-button>
<cr-action-menu id="menu" on-open-changed="onOpenChanged_">
  <button id="download-edited" class="dropdown-item" on-click="onDownloadEditedClick_">
    With your changes
  </button>
  <button id="download-original" class="dropdown-item" on-click="onDownloadOriginalClick_">
    Without your changes
  </button>
</cr-action-menu>
<!--_html_template_end_-->`}
// Copyright 2020 The Chromium Authors
class ViewerDownloadControlsElement extends PolymerElement{constructor(){super(...arguments);this.waitForFormFocusChange_=null}static get is(){return"viewer-download-controls"}static get template(){return getTemplate$9()}static get properties(){return{hasEdits:Boolean,hasEnteredAnnotationMode:Boolean,isFormFieldFocused:{type:Boolean,observer:"onFormFieldFocusedChanged_"},downloadHasPopup_:{type:String,computed:"computeDownloadHasPopup_(hasEdits,"+"hasEnteredAnnotationMode)"},menuOpen_:{type:Boolean,reflectToAttribute:true,value:false}}}isMenuOpen(){return this.menuOpen_}closeMenu(){this.$.menu.close()}onOpenChanged_(e){this.menuOpen_=e.detail.value}hasEditsToSave_(){return this.hasEnteredAnnotationMode||this.hasEdits}computeDownloadHasPopup_(){return this.hasEditsToSave_()?"menu":"false"}showDownloadMenu_(){this.$.menu.showAt(this.$.download,{anchorAlignmentX:AnchorAlignment.CENTER});this.dispatchEvent(new CustomEvent("download-menu-shown-for-testing",{bubbles:true,composed:true}))}onDownloadClick_(){this.waitForEdits_().then((hasEdits=>{if(hasEdits){this.showDownloadMenu_()}else{this.dispatchSaveEvent_(SaveRequestType.ORIGINAL)}}))}waitForEdits_(){if(this.hasEditsToSave_()){return Promise.resolve(true)}if(!this.isFormFieldFocused){return Promise.resolve(false)}this.waitForFormFocusChange_=new PromiseResolver;return this.waitForFormFocusChange_.promise}onFormFieldFocusedChanged_(){if(!this.waitForFormFocusChange_){return}this.waitForFormFocusChange_.resolve(this.hasEdits);this.waitForFormFocusChange_=null}dispatchSaveEvent_(type){this.dispatchEvent(new CustomEvent("save",{detail:type,bubbles:true,composed:true}))}onDownloadOriginalClick_(){this.dispatchSaveEvent_(SaveRequestType.ORIGINAL);this.$.menu.close()}onDownloadEditedClick_(){this.dispatchSaveEvent_(this.hasEnteredAnnotationMode?SaveRequestType.ANNOTATION:SaveRequestType.EDITED);this.$.menu.close()}}customElements.define(ViewerDownloadControlsElement.is,ViewerDownloadControlsElement);const template=html`
<custom-style>
  <style>
html{--iron-icon-height:20px;--iron-icon-width:20px;--viewer-icon-ink-color:rgb(189, 189, 189);--viewer-pdf-toolbar-background-color:rgb(50, 54, 57);--viewer-text-input-selection-color:rgba(255, 255, 255, 0.3)}
  </style>
</custom-style>
`;document.head.appendChild(template.content);function getTemplate$8(){return html`<!--_html_template_start_-->    <style>#content{align-items:center;color:#fff;direction:ltr;display:flex;font-size:.81rem;text-align:center;--page-selector-spacing:4px}#pageSelector::selection{background-color:var(--viewer-text-input-selection-color)}#pagelength,input{width:calc(max(2,var(--page-length-digits)) * 1ch + 1px)}input{background:rgba(0,0,0,.5);border:none;color:#fff;font-family:inherit;line-height:inherit;outline:0;padding:0 var(--page-selector-spacing);text-align:center}#divider{margin:0 var(--page-selector-spacing)}</style>
    <div id="content">
      <input part="input" type="text" id="pageSelector" value="[[pageNo]]" on-pointerup="select" on-input="onInput_" on-change="pageNoCommitted" aria-label="Page number">
      <span id="divider">/</span>
      <span id="pagelength">[[docLength]]</span>
    </div>
<!--_html_template_end_-->`}
// Copyright 2015 The Chromium Authors
class ViewerPageSelectorElement extends PolymerElement{static get is(){return"viewer-page-selector"}static get template(){return getTemplate$8()}static get properties(){return{docLength:{type:Number,value:1,observer:"docLengthChanged_"},pageNo:{type:Number,value:1}}}pageNoCommitted(){const page=parseInt(this.$.pageSelector.value,10);if(!isNaN(page)&&page<=this.docLength&&page>0){this.dispatchEvent(new CustomEvent("change-page",{detail:{page:page-1,origin:ChangePageOrigin.PAGE_SELECTOR},composed:true}))}else{this.$.pageSelector.value=this.pageNo.toString()}this.$.pageSelector.blur()}docLengthChanged_(){const numDigits=this.docLength.toString().length;this.style.setProperty("--page-length-digits",`${numDigits}`)}select(){this.$.pageSelector.select()}isActive(){return this.shadowRoot.activeElement===this.$.pageSelector}onInput_(){this.$.pageSelector.value=this.$.pageSelector.value.replace(/[^\d]/,"")}}customElements.define(ViewerPageSelectorElement.is,ViewerPageSelectorElement);const styleMod$1=document.createElement("dom-module");styleMod$1.appendChild(html`
  <template>
    <style include="cr-hidden-style cr-icons">
:host,html{--scrollable-border-color:var(--google-grey-300)}@media (prefers-color-scheme:dark){:host,html{--scrollable-border-color:var(--google-grey-700)}}[actionable]{cursor:pointer}.hr{border-top:var(--cr-separator-line)}iron-list.cr-separators>:not([first]){border-top:var(--cr-separator-line)}[scrollable]{border-color:transparent;border-style:solid;border-width:1px 0;overflow-y:auto}[scrollable].is-scrolled{border-top-color:var(--scrollable-border-color)}[scrollable].can-scroll:not(.scrolled-to-bottom){border-bottom-color:var(--scrollable-border-color)}[scrollable] iron-list>:not(.no-outline):focus,[selectable]:focus,[selectable]>:focus{background-color:var(--cr-focused-item-color);outline:0}.scroll-container{display:flex;flex-direction:column;min-height:1px}[selectable]>*{cursor:pointer}.cr-centered-card-container{box-sizing:border-box;display:block;height:inherit;margin:0 auto;max-width:var(--cr-centered-card-max-width);min-width:550px;position:relative;width:calc(100% * var(--cr-centered-card-width-percentage))}.cr-container-shadow{box-shadow:inset 0 5px 6px -3px rgba(0,0,0,.4);height:var(--cr-container-shadow-height);left:0;margin:0 0 var(--cr-container-shadow-margin);opacity:0;pointer-events:none;position:relative;right:0;top:0;transition:opacity .5s;z-index:1}#cr-container-shadow-bottom{margin-bottom:0;margin-top:var(--cr-container-shadow-margin);transform:scaleY(-1)}#cr-container-shadow-bottom.has-shadow,#cr-container-shadow-top.has-shadow{opacity:var(--cr-container-shadow-max-opacity)}.cr-row{align-items:center;border-top:var(--cr-separator-line);display:flex;min-height:var(--cr-section-min-height);padding:0 var(--cr-section-padding)}.cr-row.continuation,.cr-row.first{border-top:none}.cr-row-gap{padding-inline-start:16px}.cr-button-gap{margin-inline-start:8px}paper-tooltip::part(tooltip){border-radius:var(--paper-tooltip-border-radius,2px);font-size:92.31%;font-weight:500;max-width:330px;min-width:var(--paper-tooltip-min-width,200px);padding:var(--paper-tooltip-padding,10px 8px)}.cr-padded-text{padding-block-end:var(--cr-section-vertical-padding);padding-block-start:var(--cr-section-vertical-padding)}.cr-title-text{color:var(--cr-title-text-color);font-size:107.6923%;font-weight:500}.cr-secondary-text{color:var(--cr-secondary-text-color);font-weight:400}.cr-form-field-label{color:var(--cr-form-field-label-color);display:block;font-size:var(--cr-form-field-label-font-size);font-weight:500;letter-spacing:.4px;line-height:var(--cr-form-field-label-line-height);margin-bottom:8px}.cr-vertical-tab{align-items:center;display:flex}.cr-vertical-tab::before{border-radius:0 3px 3px 0;content:'';display:block;flex-shrink:0;height:var(--cr-vertical-tab-height,100%);width:4px}.cr-vertical-tab.selected::before{background:var(--cr-vertical-tab-selected-color,var(--cr-checked-color))}:host-context([dir=rtl]) .cr-vertical-tab::before{transform:scaleX(-1)}.iph-anchor-highlight{background-color:var(--cr-iph-anchor-highlight-color)}
    </style>
  </template>
`.content);styleMod$1.register("cr-shared-style");const styleMod=document.createElement("dom-module");styleMod.appendChild(html`
  <template>
    <style>
:host{--cr-input-background-color:var(--google-grey-100);--cr-input-color:var(--cr-primary-text-color);--cr-input-error-color:var(--google-red-600);--cr-input-focus-color:var(--google-blue-600);display:block;outline:0}@media (prefers-color-scheme:dark){:host{--cr-input-background-color:rgba(0, 0, 0, .3);--cr-input-error-color:var(--google-red-300);--cr-input-focus-color:var(--google-blue-300)}}:host([focused_]:not([readonly]):not([invalid])) #label{color:var(--cr-input-focus-color)}#input-container{border-radius:var(--cr-input-border-radius,4px);overflow:hidden;position:relative;width:var(--cr-input-width,100%)}#inner-input-container{background-color:var(--cr-input-background-color);box-sizing:border-box;padding:0}#input{-webkit-appearance:none;background-color:transparent;border:none;box-sizing:border-box;caret-color:var(--cr-input-focus-color);color:var(--cr-input-color);font-family:inherit;font-size:inherit;font-weight:inherit;line-height:inherit;min-height:var(--cr-input-min-height,auto);outline:0;padding-bottom:var(--cr-input-padding-bottom,6px);padding-inline-end:var(--cr-input-padding-end,8px);padding-inline-start:var(--cr-input-padding-start,8px);padding-top:var(--cr-input-padding-top,6px);text-align:inherit;text-overflow:ellipsis;width:100%}#underline{border-bottom:2px solid var(--cr-input-focus-color);border-radius:var(--cr-input-underline-border-radius,0);bottom:0;box-sizing:border-box;display:var(--cr-input-underline-display);height:var(--cr-input-underline-height,0);left:0;margin:auto;opacity:0;position:absolute;right:0;transition:opacity 120ms ease-out,width 0s linear 180ms;width:0}:host([focused_]) #underline,:host([force-underline]) #underline,:host([invalid]) #underline{opacity:1;transition:opacity 120ms ease-in,width 180ms ease-out;width:100%}
    </style>
  </template>
`.content);styleMod.register("cr-input-style");function getTemplate$7(){return html`<!--_html_template_start_-->    <style include="cr-hidden-style cr-input-style cr-shared-style">:host([disabled]) :-webkit-any(#label,#error,#input-container){opacity:var(--cr-disabled-opacity);pointer-events:none}:host ::slotted(cr-button[slot=suffix]){margin-inline-start:var(--cr-button-edge-spacing)!important}:host([invalid]) #label{color:var(--cr-input-error-color)}#input{border-bottom:var(--cr-input-border-bottom,none);letter-spacing:var(--cr-input-letter-spacing)}:host-context([chrome-refresh-2023]) #input-container{border:var(--cr-input-border,none)}#input::placeholder{color:var(--cr-input-placeholder-color,var(--cr-secondary-text-color));letter-spacing:var(--cr-input-placeholder-letter-spacing)}:host([invalid]) #input{caret-color:var(--cr-input-error-color)}:host([readonly]) #input{opacity:var(--cr-input-readonly-opacity,.6)}:host([invalid]) #underline{border-color:var(--cr-input-error-color)}#error{color:var(--cr-input-error-color);display:var(--cr-input-error-display,block);font-size:var(--cr-form-field-label-font-size);height:var(--cr-form-field-label-height);line-height:var(--cr-form-field-label-line-height);margin:8px 0;visibility:hidden;white-space:var(--cr-input-error-white-space)}:host([invalid]) #error{visibility:visible}#inner-input-container,#row-container{align-items:center;display:flex;justify-content:space-between;position:relative}#input[type=search]::-webkit-search-cancel-button{display:none}:host-context([dir=rtl]) #input[type=url]{text-align:right}#input[type=url]{direction:ltr}</style>
    <div id="label" class="cr-form-field-label" hidden="[[!label]]" aria-hidden="true">
      [[label]]
    </div>
    <div id="row-container" part="row-container">
      <div id="input-container">
        <div id="inner-input-container">
          <slot name="inline-prefix"></slot>
          
          <input id="input" disabled="[[disabled]]" autofocus="[[autofocus]]" value="{{value::input}}" tabindex$="[[inputTabindex]]" type="[[type]]" readonly$="[[readonly]]" maxlength$="[[maxlength]]" pattern$="[[pattern]]" required="[[required]]" minlength$="[[minlength]]" inputmode$="[[inputmode]]" aria-description$="[[ariaDescription]]" aria-label$="[[getAriaLabel_(ariaLabel, label, placeholder)]]" aria-invalid$="[[getAriaInvalid_(invalid)]]" max="[[max]]" min="[[min]]" on-focus="onInputFocus_" on-blur="onInputBlur_" on-change="onInputChange_" part="input" autocomplete="off">
          <slot name="inline-suffix"></slot>
        </div>
        <div id="underline"></div>
      </div>
      <slot name="suffix"></slot>
    </div>
    <div id="error" aria-live="assertive">[[displayErrorMessage_]]</div>
<!--_html_template_end_-->`}
// Copyright 2018 The Chromium Authors
const SUPPORTED_INPUT_TYPES=new Set(["number","password","search","text","url"]);class CrInputElement extends PolymerElement{static get is(){return"cr-input"}static get template(){return getTemplate$7()}static get properties(){return{ariaDescription:{type:String},ariaLabel:{type:String,value:""},autofocus:{type:Boolean,value:false,reflectToAttribute:true},autoValidate:Boolean,disabled:{type:Boolean,value:false,reflectToAttribute:true},errorMessage:{type:String,value:"",observer:"onInvalidOrErrorMessageChanged_"},displayErrorMessage_:{type:String,value:""},focused_:{type:Boolean,value:false,reflectToAttribute:true},invalid:{type:Boolean,value:false,notify:true,reflectToAttribute:true,observer:"onInvalidOrErrorMessageChanged_"},max:{type:Number,reflectToAttribute:true},min:{type:Number,reflectToAttribute:true},maxlength:{type:Number,reflectToAttribute:true},minlength:{type:Number,reflectToAttribute:true},pattern:{type:String,reflectToAttribute:true},inputmode:String,label:{type:String,value:""},placeholder:{type:String,value:null,observer:"placeholderChanged_"},readonly:{type:Boolean,reflectToAttribute:true},required:{type:Boolean,reflectToAttribute:true},inputTabindex:{type:Number,value:0,observer:"onInputTabindexChanged_"},type:{type:String,value:"text",observer:"onTypeChanged_"},value:{type:String,value:"",notify:true,observer:"onValueChanged_"}}}ready(){super.ready();assert(!this.hasAttribute("tabindex"))}onInputTabindexChanged_(){assert(this.inputTabindex===0||this.inputTabindex===-1)}onTypeChanged_(){assert(SUPPORTED_INPUT_TYPES.has(this.type))}get inputElement(){return this.$.input}getAriaLabel_(ariaLabel,label,placeholder){return ariaLabel||label||placeholder}getAriaInvalid_(invalid){return invalid?"true":"false"}onInvalidOrErrorMessageChanged_(){this.displayErrorMessage_=this.invalid?this.errorMessage:"";const ERROR_ID="error";const errorElement=this.shadowRoot.querySelector(`#${ERROR_ID}`);assert(errorElement);if(this.invalid){errorElement.setAttribute("role","alert");this.inputElement.setAttribute("aria-errormessage",ERROR_ID)}else{errorElement.removeAttribute("role");this.inputElement.removeAttribute("aria-errormessage")}}placeholderChanged_(){if(this.placeholder||this.placeholder===""){this.inputElement.setAttribute("placeholder",this.placeholder)}else{this.inputElement.removeAttribute("placeholder")}}focus(){this.focusInput()}focusInput(){if(this.shadowRoot.activeElement===this.inputElement){return false}this.inputElement.focus();return true}onValueChanged_(newValue,oldValue){if(!newValue&&!oldValue){return}if(this.autoValidate){this.validate()}}onInputChange_(e){this.dispatchEvent(new CustomEvent("change",{bubbles:true,composed:true,detail:{sourceEvent:e}}))}onInputFocus_(){this.focused_=true}onInputBlur_(){this.focused_=false}select(start,end){this.inputElement.focus();if(start!==undefined&&end!==undefined){this.inputElement.setSelectionRange(start,end)}else{assert(start===undefined&&end===undefined);this.inputElement.select()}}validate(){this.invalid=!this.inputElement.checkValidity();return!this.invalid}}customElements.define(CrInputElement.is,CrInputElement);function getTemplate$6(){return html`<!--_html_template_start_-->    <style include="cr-shared-style">#password{margin-top:var(--cr-form-field-bottom-spacing)}</style>
    <cr-dialog id="dialog" no-cancel show-on-attach>
      <div slot="title">Password required</div>
      <div slot="body">
        <div id="message">This document is password protected.  Please enter a password.</div>
        <cr-input id="password" type="password" error-message="Incorrect password" invalid="[[invalid]]" autofocus>
        </cr-input>
      </div>
      <div slot="button-container">
        <cr-button id="submit" class="action-button" on-click="submit">
          Submit
        </cr-button>
      </div>
    </cr-dialog>
<!--_html_template_end_-->`}
// Copyright 2014 The Chromium Authors
class ViewerPasswordDialogElement extends PolymerElement{static get is(){return"viewer-password-dialog"}static get template(){return getTemplate$6()}static get properties(){return{invalid:Boolean}}close(){this.$.dialog.close()}deny(){const password=this.$.password;password.disabled=false;this.$.submit.disabled=false;this.invalid=true;password.select();this.dispatchEvent(new CustomEvent("password-denied-for-testing"))}submit(){const password=this.$.password;if(password.value.length===0){return}password.disabled=true;this.$.submit.disabled=true;this.dispatchEvent(new CustomEvent("password-submitted",{detail:{password:password.value}}))}}customElements.define(ViewerPasswordDialogElement.is,ViewerPasswordDialogElement);function getTemplate$5(){return html`<!--_html_template_start_--><style>:host{--focus-border-color:var(--google-blue-300);display:block}:host(:focus){outline:0}#thumbnail{align-items:center;display:inline-flex;height:140px;justify-content:center;margin-bottom:12px;margin-inline-end:auto;margin-inline-start:auto;width:108px}:host([is-active]) #thumbnail{--active-background-color:white;background-color:var(--active-background-color);box-shadow:0 0 0 6px var(--focus-border-color)}:host(:focus-visible) #thumbnail{box-shadow:0 0 0 2px var(--focus-border-color)}:host([is-active]:focus-visible) #thumbnail{box-shadow:0 0 0 8px var(--focus-border-color)}canvas{display:block;opacity:.5}:host([is-active]) canvas{opacity:1}:host([is-active]) canvas:hover,canvas:hover{opacity:.7}#pageNumber{line-height:1}</style>
<div id="thumbnail" on-click="onClick_" role="button"></div>
<div id="pageNumber">[[pageNumber]]</div>
<!--_html_template_end_-->`}
// Copyright 2020 The Chromium Authors
const PORTRAIT_WIDTH=108;const LANDSCAPE_WIDTH=140;const PAINTED_ATTRIBUTE="painted";class ViewerThumbnailElement extends PolymerElement{static get is(){return"viewer-thumbnail"}static get template(){return getTemplate$5()}static get properties(){return{clockwiseRotations:{type:Number,value:0,observer:"clockwiseRotationsChanged_"},isActive:{type:Boolean,observer:"isActiveChanged_",reflectToAttribute:true},pageNumber:Number}}set image(imageData){let canvas=this.getCanvas_();if(!canvas){canvas=document.createElement("canvas");canvas.oncontextmenu=e=>e.preventDefault();this.$.thumbnail.appendChild(canvas)}canvas.width=imageData.width;canvas.height=imageData.height;this.styleCanvas_();const ctx=canvas.getContext("2d");ctx.putImageData(imageData,0,0)}clearImage(){if(!this.isPainted()){return}const canvas=this.getCanvas_();if(canvas){canvas.remove()}this.removeAttribute(PAINTED_ATTRIBUTE)}getClickTarget(){return this.$.thumbnail}clockwiseRotationsChanged_(){if(this.getCanvas_()){this.styleCanvas_()}}getCanvas_(){return this.shadowRoot.querySelector("canvas")}getThumbnailCssSize_(rotated){const canvas=this.getCanvas_();const isPortrait=canvas.width<canvas.height!==rotated;const orientedWidth=rotated?canvas.height:canvas.width;const orientedHeight=rotated?canvas.width:canvas.height;const cssWidth=Math.min(isPortrait?PORTRAIT_WIDTH:LANDSCAPE_WIDTH,Math.trunc(orientedWidth/window.devicePixelRatio));const scale=cssWidth/orientedWidth;const cssHeight=Math.trunc(orientedHeight*scale);return{width:cssWidth,height:cssHeight}}focusAndScroll(){this.scrollIntoView({block:"nearest"});this.focus({preventScroll:true})}isPainted(){return this.hasAttribute(PAINTED_ATTRIBUTE)}setPainted(){this.toggleAttribute(PAINTED_ATTRIBUTE,true)}isActiveChanged_(){if(this.isActive){this.scrollIntoView({block:"nearest"})}}onClick_(){this.dispatchEvent(new CustomEvent("change-page",{detail:{page:this.pageNumber-1,origin:ChangePageOrigin.THUMBNAIL},bubbles:true,composed:true}))}styleCanvas_(){assert(this.clockwiseRotations>=0&&this.clockwiseRotations<4);const canvas=this.getCanvas_();const div=this.shadowRoot.querySelector("#thumbnail");const degreesRotated=this.clockwiseRotations*90;canvas.style.transform=`rotate(${degreesRotated}deg)`;const rotated=this.clockwiseRotations%2!==0;const cssSize=this.getThumbnailCssSize_(rotated);div.style.width=`${cssSize.width}px`;div.style.height=`${cssSize.height}px`;canvas.style.width=`${rotated?cssSize.height:cssSize.width}px`;canvas.style.height=`${rotated?cssSize.width:cssSize.height}px`}}customElements.define(ViewerThumbnailElement.is,ViewerThumbnailElement);function getTemplate$4(){return html`<!--_html_template_start_--><style>:host(:focus){outline:0}#thumbnails{box-sizing:border-box;height:100%;overflow:auto;padding-bottom:24px;padding-inline-end:var(--viewer-thumbnail-bar-padding-inline-end);text-align:center}viewer-thumbnail{padding-top:24px}</style>
<div id="thumbnails" hidden$="[[!isPluginActive_]]" role="tablist">
  <template is="dom-repeat" items="[[pageNumbers_]]" on-dom-change="onDomChange_">
    <viewer-thumbnail tabindex="0" role="tab" aria-label$="[[getAriaLabel_(item)]]" aria-selected="[[isActivePage_(item, activePage)]]" , clockwise-rotations="[[clockwiseRotations]]" is-active="[[isActivePage_(item, activePage)]]" page-number="[[item]]">
    </viewer-thumbnail>
  </template>
</div>
<!--_html_template_end_-->`}
// Copyright 2020 The Chromium Authors
class ViewerThumbnailBarElement extends PolymerElement{static get is(){return"viewer-thumbnail-bar"}static get template(){return getTemplate$4()}static get properties(){return{activePage:{type:Number,observer:"activePageChanged_"},clockwiseRotations:Number,docLength:Number,isPluginActive_:Boolean,pageNumbers_:{type:Array,computed:"computePageNumbers_(docLength)"}}}constructor(){super();this.pluginController_=PluginController.getInstance();this.tracker_=new EventTracker;this.inTest=false;this.isPluginActive_=this.pluginController_.isActive;this.tracker_.add(this.pluginController_.getEventTarget(),PluginControllerEventType.IS_ACTIVE_CHANGED,(e=>this.isPluginActive_=e.detail))}ready(){super.ready();this.addEventListener("focus",this.onFocus_);this.addEventListener("keydown",this.onKeydown_);const thumbnailsDiv=this.$.thumbnails;this.intersectionObserver_=new IntersectionObserver((entries=>{entries.forEach((entry=>{const thumbnail=entry.target;if(!entry.isIntersecting){thumbnail.clearImage();return}if(thumbnail.isPainted()){return}thumbnail.setPainted();if(!this.isPluginActive_||this.inTest){return}this.pluginController_.requestThumbnail(thumbnail.pageNumber).then((response=>{const array=new Uint8ClampedArray(response.imageData);const imageData=new ImageData(array,response.width);thumbnail.image=imageData}))}))}),{root:thumbnailsDiv,rootMargin:"500% 0% 100%"});FocusOutlineManager.forDocument(document)}activePageChanged_(){if(this.shadowRoot.activeElement){this.getThumbnailForPage(this.activePage).focusAndScroll()}}clickThumbnailForPage(pageNumber){const thumbnail=this.getThumbnailForPage(pageNumber);if(!thumbnail){return}thumbnail.getClickTarget().click()}getThumbnailForPage(pageNumber){return this.shadowRoot.querySelector(`viewer-thumbnail:nth-child(${pageNumber})`)}computePageNumbers_(){return Array.from({length:this.docLength},((_,i)=>i+1))}getAriaLabel_(pageNumber){return loadTimeData.getStringF("thumbnailPageAriaLabel",pageNumber)}isActivePage_(page){return this.activePage===page}onDomChange_(){this.shadowRoot.querySelectorAll("viewer-thumbnail").forEach((thumbnail=>{this.intersectionObserver_.observe(thumbnail)}))}onFocus_(){const focusOutlineManager=FocusOutlineManager.forDocument(document);if(!focusOutlineManager.visible){return}const activeThumbnail=this.shadowRoot.querySelector("viewer-thumbnail[is-active]");if(activeThumbnail){activeThumbnail.focus();return}const firstThumbnail=this.shadowRoot.querySelector("viewer-thumbnail");if(!firstThumbnail){return}firstThumbnail.focus()}onKeydown_(e){switch(e.key){case"Tab":if(e.shiftKey){this.focus();return}const lastThumbnail=this.shadowRoot.querySelector("viewer-thumbnail:last-of-type");assert(lastThumbnail);lastThumbnail.focus({preventScroll:true});break;case"ArrowRight":case"ArrowDown":e.preventDefault();this.clickThumbnailForPage(this.activePage+1);break;case"ArrowLeft":case"ArrowUp":e.preventDefault();this.clickThumbnailForPage(this.activePage-1);break}}}customElements.define(ViewerThumbnailBarElement.is,ViewerThumbnailBarElement);function getTemplate$3(){return html`<!--_html_template_start_--><style include="pdf-shared cr-hidden-style cr-shared-style">:host{--sidenav-selected-tab-color:var(--google-blue-300);background-color:var(--viewer-pdf-toolbar-background-color);display:flex;height:100%;min-width:var(--viewer-pdf-sidenav-width);overflow:hidden;width:var(--viewer-pdf-sidenav-width)}#icons{display:flex;flex-direction:column;min-width:64px}#content{color:#fff;flex:1;overflow-x:hidden}#icons:not([hidden])+#content{--viewer-thumbnail-bar-padding-inline-end:28px}.selected cr-icon-button{--cr-icon-button-fill-color:var(--sidenav-selected-tab-color)}.button-wrapper{--button-wrapper-height:36px;--button-wrapper-margin:12px;--button-wrapper-total-height:calc(
        var(--button-wrapper-height) + var(--button-wrapper-margin));align-items:center;display:flex;height:var(--button-wrapper-height);margin:var(--button-wrapper-margin) 0;width:100%}.cr-vertical-tab{--cr-vertical-tab-selected-color:var(--sidenav-selected-tab-color)}.cr-vertical-tab::before{transform:translateY(var(--button-wrapper-total-height));transition:transform 250ms cubic-bezier(.4,0,.2,1)}.cr-vertical-tab.selected+.cr-vertical-tab::before{transform:translateY(calc(-1 * var(--button-wrapper-total-height)))}.cr-vertical-tab.selected::before{transform:translateY(0)}cr-icon-button{margin:0 auto}</style>
<div id="icons" hidden$="[[!bookmarks.length]]" role="tablist">
  <div class$="
      button-wrapper cr-vertical-tab [[thumbnailButtonClass_(thumbnailView_)]]">
    <cr-icon-button iron-icon="pdf:thumbnails" role="tab" title="Thumbnails" aria-label="Thumbnails" aria-selected$="[[getAriaSelectedThumbnails_(thumbnailView_)]]" on-click="onThumbnailClick_" tabindex$="[[getTabIndexThumbnail_(thumbnailView_)]]">
    </cr-icon-button>
  </div>
  <div class$="
      button-wrapper cr-vertical-tab [[outlineButtonClass_(thumbnailView_)]]">
    <cr-icon-button iron-icon="pdf:doc-outline" role="tab" title="Document outline" aria-label="Document outline" aria-selected$="[[getAriaSelectedOutline_(thumbnailView_)]]" on-click="onOutlineClick_" tabindex$="[[getTabIndexOutline_(thumbnailView_)]]">
    </cr-icon-button>
  </div>
</div>
<div id="content">
  <viewer-thumbnail-bar id="thumbnail-bar" tabindex="0" hidden="[[!thumbnailView_]]" active-page="[[activePage]]" clockwise-rotations="[[clockwiseRotations]]" doc-length="[[docLength]]">
  </viewer-thumbnail-bar>
  <viewer-document-outline id="outline" hidden="[[thumbnailView_]]" bookmarks="[[bookmarks]]">
  </viewer-document-outline>
</div>
<!--_html_template_end_-->`}
// Copyright 2020 The Chromium Authors
class ViewerPdfSidenavElement extends PolymerElement{static get is(){return"viewer-pdf-sidenav"}static get template(){return getTemplate$3()}static get properties(){return{activePage:Number,bookmarks:{type:Array,value:()=>[]},clockwiseRotations:Number,docLength:Number,thumbnailView_:{type:Boolean,value:true}}}ready(){super.ready();this.$.icons.addEventListener("keydown",this.onKeydown_.bind(this))}onThumbnailClick_(){record(UserAction.SELECT_SIDENAV_THUMBNAILS);this.thumbnailView_=true}onOutlineClick_(){record(UserAction.SELECT_SIDENAV_OUTLINE);this.thumbnailView_=false}outlineButtonClass_(){return this.thumbnailView_?"":"selected"}thumbnailButtonClass_(){return this.thumbnailView_?"selected":""}getAriaSelectedThumbnails_(){return this.thumbnailView_?"true":"false"}getAriaSelectedOutline_(){return this.thumbnailView_?"false":"true"}getTabIndexThumbnail_(){return this.thumbnailView_?"0":"-1"}getTabIndexOutline_(){return this.thumbnailView_?"-1":"0"}onKeydown_(e){if((e.key==="ArrowUp"||e.key==="ArrowDown")&&this.bookmarks.length>0){e.preventDefault();e.stopPropagation();this.thumbnailView_=!this.thumbnailView_}}}customElements.define(ViewerPdfSidenavElement.is,ViewerPdfSidenavElement);function getTemplate$2(){return html`<!--_html_template_start_--><style include="cr-shared-style">:host{--break-padding:8px}cr-dialog::part(dialog){width:fit-content}table{border-spacing:0}.break>td{--break-color:var(--google-grey-300);border-bottom:1px solid var(--break-color);padding-bottom:var(--break-padding)}.break+tr>td{padding-top:var(--break-padding)}.name{color:var(--cr-primary-text-color);padding-inline-end:12px;vertical-align:top}.value{color:var(--cr-secondary-text-color);max-width:300px;min-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#keywords{white-space:normal}</style>
<cr-dialog id="dialog" show-on-attach>
  <div slot="title">Document properties</div>
  <div slot="body">
    <table>
      <tr>
        <td class="name">File name:</td>
        <td class="value" id="file-name">[[fileName]]</td>
      </tr>
      <tr class="break">
        <td class="name">File size:</td>
        <td class="value" id="file-size">[[documentMetadata.fileSize]]</td>
      </tr>
      <tr>
        <td class="name">Title:</td>
        <td class="value" id="title">
          [[getOrPlaceholder_(documentMetadata.title)]]
        </td>
      </tr>
      <tr>
        <td class="name">Author:</td>
        <td class="value" id="author">
          [[getOrPlaceholder_(documentMetadata.author)]]
        </td>
      </tr>
      <tr>
        <td class="name">Subject:</td>
        <td class="value" id="subject">
          [[getOrPlaceholder_(documentMetadata.subject)]]
        </td>
      </tr>
      <tr>
        <td class="name">Keywords:</td>
        <td class="value" id="keywords">
          [[getOrPlaceholder_(documentMetadata.keywords)]]
        </td>
      </tr>
      <tr>
        <td class="name">Created:</td>
        <td class="value" id="created">
          [[getOrPlaceholder_(documentMetadata.creationDate)]]
        </td>
      </tr>
      <tr>
        <td class="name">Modified:</td>
        <td class="value" id="modified">
          [[getOrPlaceholder_(documentMetadata.modDate)]]
        </td>
      </tr>
      <tr class="break">
        <td class="name">Application:</td>
        <td class="value" id="application">
          [[getOrPlaceholder_(documentMetadata.creator)]]
        </td>
      </tr>
      <tr>
        <td class="name">PDF producer:</td>
        <td class="value" id="pdf-producer">
          [[getOrPlaceholder_(documentMetadata.producer)]]
        </td>
      </tr>
      <tr>
        <td class="name">PDF version:</td>
        <td class="value" id="pdf-version">
          [[getOrPlaceholder_(documentMetadata.version)]]
        </td>
      </tr>
      <tr>
        <td class="name">Page count:</td>
        <td class="value" id="page-count">[[pageCount]]</td>
      </tr>
      <tr class="break">
        <td class="name">Page size:</td>
        <td class="value" id="page-size">
          [[getOrPlaceholder_(documentMetadata.pageSize)]]
        </td>
      </tr>
      <tr>
        <td class="name">Fast web view:</td>
        <td class="value" id="fast-web-view">
          [[getFastWebViewValue_('Yes',
              'No',
              documentMetadata.linearized)]]
        </td>
      </tr>
    </table>
  </div>
  <div slot="button-container">
    <cr-button id="close" class="action-button" on-click="onClickClose_">
      Close
    </cr-button>
  </div>
</cr-dialog>
<!--_html_template_end_-->`}
// Copyright 2021 The Chromium Authors
class ViewerPropertiesDialogElement extends PolymerElement{static get is(){return"viewer-properties-dialog"}static get template(){return getTemplate$2()}static get properties(){return{documentMetadata:Object,fileName:String,pageCount:Number}}getFastWebViewValue_(yesLabel,noLabel,linearized){return linearized?yesLabel:noLabel}getOrPlaceholder_(value){return value||"-"}onClickClose_(){this.$.dialog.close()}}customElements.define(ViewerPropertiesDialogElement.is,ViewerPropertiesDialogElement);
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const IronRangeBehavior={properties:{value:{type:Number,value:0,notify:true,reflectToAttribute:true},min:{type:Number,value:0,notify:true},max:{type:Number,value:100,notify:true},step:{type:Number,value:1,notify:true},ratio:{type:Number,value:0,readOnly:true,notify:true}},observers:["_update(value, min, max, step)"],_calcRatio:function(value){return(this._clampValue(value)-this.min)/(this.max-this.min)},_clampValue:function(value){return Math.min(this.max,Math.max(this.min,this._calcStep(value)))},_calcStep:function(value){value=parseFloat(value);if(!this.step){return value}var numSteps=Math.round((value-this.min)/this.step);if(this.step<1){return numSteps/(1/this.step)+this.min}else{return numSteps*this.step+this.min}},_validateValue:function(){var v=this._clampValue(this.value);this.value=this.oldValue=isNaN(v)?this.oldValue:v;return this.value!==v},_update:function(){this._validateValue();this._setRatio(this._calcRatio(this.value)*100)}};
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/Polymer({_template:html`
    <style>
      :host {
        display: block;
        width: 200px;
        position: relative;
        overflow: hidden;
      }

      :host([hidden]), [hidden] {
        display: none !important;
      }

      #progressContainer {
        position: relative;
      }

      #progressContainer,
      /* the stripe for the indeterminate animation*/
      .indeterminate::after {
        height: var(--paper-progress-height, 4px);
      }

      #primaryProgress,
      #secondaryProgress,
      .indeterminate::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      #progressContainer,
      .indeterminate::after {
        background: var(--paper-progress-container-color, var(--google-grey-300));
      }

      :host(.transiting) #primaryProgress,
      :host(.transiting) #secondaryProgress {
        transition-property: transform;

        /* Duration */
        transition-duration: var(--paper-progress-transition-duration, 0.08s);

        /* Timing function */
        transition-timing-function: var(--paper-progress-transition-timing-function, ease);

        /* Delay */
        transition-delay: var(--paper-progress-transition-delay, 0s);
      }

      #primaryProgress,
      #secondaryProgress {
        transform-origin: left center;
        transform: scaleX(0);
        will-change: transform;
      }

      #primaryProgress {
        background: var(--paper-progress-active-color, var(--google-green-500));
      }

      #secondaryProgress {
        background: var(--paper-progress-secondary-color, var(--google-green-100));
      }

      :host([disabled]) #primaryProgress {
        background: var(--paper-progress-disabled-active-color, var(--google-grey-500));
      }

      :host([disabled]) #secondaryProgress {
        background: var(--paper-progress-disabled-secondary-color, var(--google-grey-300));
      }

      :host(:not([disabled])) #primaryProgress.indeterminate {
        transform-origin: right center;
        animation: indeterminate-bar var(--paper-progress-indeterminate-cycle-duration, 2s) linear infinite;
      }

      :host(:not([disabled])) #primaryProgress.indeterminate::after {
        content: "";
        transform-origin: center center;

        animation: indeterminate-splitter var(--paper-progress-indeterminate-cycle-duration, 2s) linear infinite;
      }

      @-webkit-keyframes indeterminate-bar {
        0% {
        }
        50% {
        }
        75% {
        }
        100% {
        }
      }

      @-webkit-keyframes indeterminate-splitter {
        0% {
        }
        30% {
        }
        90% {
        }
        100% {
        }
      }

      @keyframes indeterminate-bar {
        0% {
          transform: scaleX(1) translateX(-100%);
        }
        50% {
          transform: scaleX(1) translateX(0%);
        }
        75% {
          transform: scaleX(1) translateX(0%);
          animation-timing-function: cubic-bezier(.28,.62,.37,.91);
        }
        100% {
          transform: scaleX(0) translateX(0%);
        }
      }

      @keyframes indeterminate-splitter {
        0% {
          transform: scaleX(.75) translateX(-125%);
        }
        30% {
          transform: scaleX(.75) translateX(-125%);
          animation-timing-function: cubic-bezier(.42,0,.6,.8);
        }
        90% {
          transform: scaleX(.75) translateX(125%);
        }
        100% {
          transform: scaleX(.75) translateX(125%);
        }
      }
    </style>

    <div id="progressContainer">
      <div id="secondaryProgress" hidden\$="[[_hideSecondaryProgress(secondaryRatio)]]"></div>
      <div id="primaryProgress"></div>
    </div>
`,is:"paper-progress",behaviors:[IronRangeBehavior],properties:{secondaryProgress:{type:Number,value:0},secondaryRatio:{type:Number,value:0,readOnly:true},indeterminate:{type:Boolean,value:false,observer:"_toggleIndeterminate"},disabled:{type:Boolean,value:false,reflectToAttribute:true,observer:"_disabledChanged"}},observers:["_progressChanged(secondaryProgress, value, min, max, indeterminate)"],hostAttributes:{role:"progressbar"},_toggleIndeterminate:function(indeterminate){this.toggleClass("indeterminate",indeterminate,this.$.primaryProgress)},_transformProgress:function(progress,ratio){var transform="scaleX("+ratio/100+")";progress.style.transform=progress.style.webkitTransform=transform},_mainRatioChanged:function(ratio){this._transformProgress(this.$.primaryProgress,ratio)},_progressChanged:function(secondaryProgress,value,min,max,indeterminate){secondaryProgress=this._clampValue(secondaryProgress);value=this._clampValue(value);var secondaryRatio=this._calcRatio(secondaryProgress)*100;var mainRatio=this._calcRatio(value)*100;this._setSecondaryRatio(secondaryRatio);this._transformProgress(this.$.secondaryProgress,secondaryRatio);this._transformProgress(this.$.primaryProgress,mainRatio);this.secondaryProgress=secondaryProgress;if(indeterminate){this.removeAttribute("aria-valuenow")}else{this.setAttribute("aria-valuenow",value)}this.setAttribute("aria-valuemin",min);this.setAttribute("aria-valuemax",max)},_disabledChanged:function(disabled){this.setAttribute("aria-disabled",disabled?"true":"false")},_hideSecondaryProgress:function(secondaryRatio){return secondaryRatio===0}});
// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class PdfViewerPrivateProxyImpl{isPdfOcrAlwaysActive(){return new Promise((resolve=>{chrome.pdfViewerPrivate.isPdfOcrAlwaysActive((result=>resolve(result)))}))}setPdfOcrPref(value){return new Promise((resolve=>{chrome.pdfViewerPrivate.setPdfOcrPref(value,(result=>resolve(result)))}))}addPdfOcrPrefChangedListener(listener){chrome.pdfViewerPrivate.onPdfOcrPrefChanged.addListener(listener)}removePdfOcrPrefChangedListener(listener){chrome.pdfViewerPrivate.onPdfOcrPrefChanged.removeListener(listener)}static getInstance(){return instance$1||(instance$1=new PdfViewerPrivateProxyImpl)}}let instance$1=null;function getTemplate$1(){return html`<!--_html_template_start_--><style include="pdf-shared">:host{--viewer-pdf-toolbar-height:56px;box-shadow:0 -2px 8px rgba(0,0,0,.09),0 4px 8px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.3),0 2px 6px rgba(0,0,0,.15);position:relative}:host([more-menu-open_]) #more{background-color:var(--active-button-bg);border-radius:50%}#toolbar{align-items:center;background-color:var(--viewer-pdf-toolbar-background-color);color:#fff;display:flex;height:var(--viewer-pdf-toolbar-height);padding:0 16px}#title{font-size:.87rem;font-weight:500;margin-inline-start:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#actionMenuTrigger{margin-inline-end:6px}#start{align-items:center;display:flex;overflow:hidden;padding-inline-end:20px}#end,#start{flex:1}#center{align-items:center;display:flex}#end{display:flex;justify-content:flex-end;padding-inline-start:20px;text-align:end;white-space:nowrap}.vertical-separator{background:rgba(255,255,255,.3);height:15px;width:1px}#zoom-controls{align-items:center;display:flex;padding:0 4px}#zoom-controls input::selection{background-color:var(--viewer-text-input-selection-color)}@media(max-width:600px){#title,#zoom-controls input{display:none}}@media(max-width:500px){#fit,#start{display:none}}@media(max-width:420px){#center{display:none}#end{padding-inline-start:initial;text-align:center}}viewer-page-selector{display:inline-flex;height:36px;margin-inline-end:20px}input,viewer-page-selector::part(input){max-height:var(--viewer-pdf-toolbar-height)}input{background:rgba(0,0,0,.5);border:none;caret-color:currentColor;color:inherit;font-family:inherit;line-height:inherit;margin:0 4px;outline:0;padding:0 4px;text-align:center;width:5ch}#fit{margin-inline-start:12px}paper-progress{--paper-progress-active-color:var(--google-blue-300);--paper-progress-container-color:transparent;--paper-progress-height:3px;bottom:0;position:absolute;width:100%}#center,#end,paper-progress{transition:opacity .1s cubic-bezier(0,0,.2,1)}:host([loading_]) #center,:host([loading_]) #end,:host([loading_]) #menuButton,paper-progress{opacity:0;visibility:hidden}#center,#end,#menuButton,:host([loading_]) paper-progress{opacity:1;visibility:visible}#more,#print{margin-inline-start:4px}.dropdown-item{padding-inline-end:16px;padding-inline-start:12px}.only-visible-to-screen-reader{height:1px;left:-10000px;overflow:hidden;position:absolute;top:auto;width:1px}.check-container{margin-inline-end:12px;width:16px}cr-action-menu hr{border:none;border-top:var(--cr-separator-line)}</style>
<div id="toolbar">
  <div id="start">
    <cr-icon-button id="sidenavToggle" iron-icon="cr20:menu" title="Menu" aria-label="Menu" aria-expanded$="[[getAriaExpanded_(sidenavCollapsed)]]" on-click="onSidenavToggleClick_">
    </cr-icon-button>
    <span id="title">[[docTitle]]</span>
  </div>
  <div id="center">
    <viewer-page-selector doc-length="[[docLength]]" page-no="[[pageNo]]">
    </viewer-page-selector>
    <span class="vertical-separator"></span>
    <span id="zoom-controls">
      <cr-icon-button iron-icon="pdf:remove" title="Zoom out" disabled="[[isAtMinimumZoom_(zoomBounds.min, viewportZoomPercent_)]]" aria-label="Zoom out" on-click="onZoomOutClick_">
      </cr-icon-button>
      <input type="text" value="100%" aria-label="Zoom level" on-change="onZoomChange_" on-pointerup="onZoomInputPointerup_" on-blur="onZoomChange_">
      
      <cr-icon-button iron-icon="pdf:add" title="Zoom in" disabled="[[isAtMaximumZoom_(zoomBounds.max, viewportZoomPercent_)]]" aria-label="Zoom in" on-click="onZoomInClick_">
      </cr-icon-button>
    </span>
    <span class="vertical-separator"></span>
    <cr-icon-button id="fit" iron-icon="[[fitToButtonIcon_]]" title="[[getFitToButtonTooltip_('Fit to page',
                                        'Fit to width',
                                        fittingType_)]]" aria-label="[[getFitToButtonTooltip_('Fit to page',
                                             'Fit to width',
                                             fittingType_)]]" on-click="onFitToButtonClick_">
    </cr-icon-button>
    <cr-icon-button iron-icon="pdf:rotate-left" dir="ltr" aria-label="Rotate counterclockwise" title="Rotate counterclockwise" on-click="onRotateClick_">
    </cr-icon-button>
  </div>
  <div id="end">
  
    <viewer-download-controls id="downloads" has-edits="[[hasEdits]]" has-entered-annotation-mode="[[hasEnteredAnnotationMode]]" is-form-field-focused="[[isFormFieldFocused]]">
    </viewer-download-controls>
    <cr-icon-button id="print" iron-icon="cr:print" hidden="[[!printingEnabled]]" title="Print" aria-label="Print" on-click="onPrintClick_">
    </cr-icon-button>
    <cr-icon-button id="more" iron-icon="cr:more-vert" title="More actions" aria-label="More actions" on-click="onMoreClick_"></cr-icon-button>
  </div>
</div>
<paper-progress id="progress" value="[[loadProgress]]" hidden="[[!loading_]]">
</paper-progress>

<cr-action-menu id="menu" on-open-changed="onMoreOpenChanged_">
  <button id="two-page-view-button" class="dropdown-item" on-click="toggleTwoPageViewClick_" role="checkbox" aria-checked="[[getAriaChecked_(twoUpViewEnabled)]]">
    <span class="check-container">
      <iron-icon icon="pdf:check" hidden="[[!twoUpViewEnabled]]"></iron-icon>
    </span>
    Two page view
  </button>

  <button id="show-annotations-button" class="dropdown-item" on-click="toggleDisplayAnnotations_" role="checkbox" aria-checked="[[getAriaChecked_(displayAnnotations_)]]">
    <span class="check-container">
      <iron-icon icon="pdf:check" hidden="[[!displayAnnotations_]]"></iron-icon>
    </span>
    Annotations
  </button>


  <template is="dom-if" if="[[pdfOcrEnabled]]">
    <button id="pdf-ocr-button" class="dropdown-item only-visible-to-screen-reader" on-click="onPdfOcrClick_" role="checkbox" aria-checked="[[getAriaChecked_(pdfOcrAlwaysActive_)]]">
      <span class="check-container">
        <iron-icon icon="pdf:check" hidden="[[!pdfOcrAlwaysActive_]]">
        </iron-icon>
      </span>
      Convert image to text
    </button>
  </template>


  <hr>

  <button id="present-button" class="dropdown-item" on-click="onPresentClick_">
    <span class="check-container" aria-hidden="true"></span>
    Present
  </button>

  <button id="properties-button" class="dropdown-item" on-click="onPropertiesClick_">
    <span class="check-container" aria-hidden="true"></span>
    Document properties
  </button>
</cr-action-menu>



<!--_html_template_end_-->`}
// Copyright 2020 The Chromium Authors
class ViewerToolbarElement extends PolymerElement{constructor(){super(...arguments);this.sidenavCollapsed=false;this.displayAnnotations_=true;this.fittingType_=FittingType.FIT_TO_PAGE;this.moreMenuOpen_=false;this.loading_=true;this.pdfOcrPrefChanged_=null}static get is(){return"viewer-toolbar"}static get template(){return getTemplate$1()}static get properties(){return{docTitle:String,docLength:Number,hasEdits:Boolean,hasEnteredAnnotationMode:Boolean,isFormFieldFocused:Boolean,loadProgress:{type:Number,observer:"loadProgressChanged_"},loading_:{type:Boolean,reflectToAttribute:true},pageNo:Number,pdfAnnotationsEnabled:Boolean,pdfOcrEnabled:Boolean,printingEnabled:Boolean,rotated:Boolean,viewportZoom:Number,zoomBounds:Object,sidenavCollapsed:Boolean,twoUpViewEnabled:Boolean,moreMenuOpen_:{type:Boolean,reflectToAttribute:true},fittingType_:Number,fitToButtonIcon_:{type:String,computed:"computeFitToButtonIcon_(fittingType_)"},pdfOcrAlwaysActive_:{type:Boolean,value:false},viewportZoomPercent_:{type:Number,computed:"computeViewportZoomPercent_(viewportZoom)",observer:"viewportZoomPercentChanged_"}}}async connectedCallback(){super.connectedCallback();this.pdfOcrAlwaysActive_=await PdfViewerPrivateProxyImpl.getInstance().isPdfOcrAlwaysActive();this.pdfOcrPrefChanged_=this.onPdfOcrPrefChanged.bind(this);PdfViewerPrivateProxyImpl.getInstance().addPdfOcrPrefChangedListener(this.pdfOcrPrefChanged_)}disconnectedCallback(){super.disconnectedCallback();PdfViewerPrivateProxyImpl.getInstance().removePdfOcrPrefChangedListener(this.pdfOcrPrefChanged_);this.pdfOcrPrefChanged_=null}onSidenavToggleClick_(){record(UserAction.TOGGLE_SIDENAV);this.dispatchEvent(new CustomEvent("sidenav-toggle-click"))}computeFitToButtonIcon_(){return this.fittingType_===FittingType.FIT_TO_PAGE?"pdf:fit-to-height":"pdf:fit-to-width"}computeViewportZoomPercent_(){return Math.round(100*this.viewportZoom)}getFitToButtonTooltip_(fitToPageTooltip,fitToWidthTooltip){return this.fittingType_===FittingType.FIT_TO_PAGE?fitToPageTooltip:fitToWidthTooltip}loadProgressChanged_(){this.loading_=this.loadProgress<100}viewportZoomPercentChanged_(){this.getZoomInput_().value=`${this.viewportZoomPercent_}%`}onPrintClick_(){this.dispatchEvent(new CustomEvent("print"))}onRotateClick_(){this.dispatchEvent(new CustomEvent("rotate-left"))}toggleDisplayAnnotations_(){record(UserAction.TOGGLE_DISPLAY_ANNOTATIONS);this.displayAnnotations_=!this.displayAnnotations_;this.dispatchEvent(new CustomEvent("display-annotations-changed",{detail:this.displayAnnotations_}));this.$.menu.close()}onPresentClick_(){record(UserAction.PRESENT);this.$.menu.close();this.dispatchEvent(new CustomEvent("present-click"))}onPropertiesClick_(){record(UserAction.PROPERTIES);this.$.menu.close();this.dispatchEvent(new CustomEvent("properties-click"))}getAriaChecked_(checked){return checked?"true":"false"}getAriaExpanded_(){return this.sidenavCollapsed?"false":"true"}toggleTwoPageViewClick_(){const newTwoUpViewEnabled=!this.twoUpViewEnabled;this.dispatchEvent(new CustomEvent("two-up-view-changed",{detail:newTwoUpViewEnabled}));this.$.menu.close()}onZoomInClick_(){this.dispatchEvent(new CustomEvent("zoom-in"))}onZoomOutClick_(){this.dispatchEvent(new CustomEvent("zoom-out"))}forceFit(fittingType){this.fittingType_=fittingType===FittingType.FIT_TO_WIDTH?FittingType.FIT_TO_PAGE:FittingType.FIT_TO_WIDTH}fitToggle(){const newState=this.fittingType_===FittingType.FIT_TO_PAGE?FittingType.FIT_TO_WIDTH:FittingType.FIT_TO_PAGE;this.dispatchEvent(new CustomEvent("fit-to-changed",{detail:this.fittingType_}));this.fittingType_=newState}onFitToButtonClick_(){this.fitToggle()}getZoomInput_(){return this.shadowRoot.querySelector("#zoom-controls input")}onZoomChange_(){const input=this.getZoomInput_();let value=Number.parseInt(input.value,10);value=Math.max(Math.min(value,this.zoomBounds.max),this.zoomBounds.min);if(this.sendZoomChanged_(value)){return}const zoomString=`${this.viewportZoomPercent_}%`;input.value=zoomString}sendZoomChanged_(value){if(Number.isNaN(value)){return false}if(Math.abs(this.viewportZoom*100-value)<.5){return false}this.dispatchEvent(new CustomEvent("zoom-changed",{detail:value}));return true}onZoomInputPointerup_(e){e.target.select()}onMoreClick_(){const anchor=this.shadowRoot.querySelector("#more");this.$.menu.showAt(anchor,{anchorAlignmentX:AnchorAlignment.CENTER,anchorAlignmentY:AnchorAlignment.AFTER_END,noOffset:true})}onMoreOpenChanged_(e){this.moreMenuOpen_=e.detail.value}isAtMinimumZoom_(){return this.zoomBounds!==undefined&&this.viewportZoomPercent_===this.zoomBounds.min}isAtMaximumZoom_(){return this.zoomBounds!==undefined&&this.viewportZoomPercent_===this.zoomBounds.max}async onPdfOcrClick_(){const valueToSet=!this.pdfOcrAlwaysActive_;const success=await PdfViewerPrivateProxyImpl.getInstance().setPdfOcrPref(valueToSet);if(success){this.pdfOcrAlwaysActive_=valueToSet}}onPdfOcrPrefChanged(isPdfOcrAlwaysActive){this.pdfOcrAlwaysActive_=isPdfOcrAlwaysActive}}customElements.define(ViewerToolbarElement.is,ViewerToolbarElement);
// Copyright 2015 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class NavigatorDelegateImpl{constructor(browserApi){this.browserApi_=browserApi}navigateInCurrentTab(url){this.browserApi_.navigateInCurrentTab(url)}navigateInNewTab(url,active){if(chrome.tabs){chrome.tabs.create({url:url,active:active})}else{window.open(url)}}navigateInNewWindow(url){if(chrome.windows){chrome.windows.create({url:url})}else{window.open(url,"_blank")}}isAllowedLocalFileAccess(url){return new Promise((resolve=>{chrome.pdfViewerPrivate.isAllowedLocalFileAccess(url,(result=>resolve(result)))}))}}class PdfNavigator{constructor(originalUrl,viewport,paramsParser,navigatorDelegate){this.originalUrl_=null;try{this.originalUrl_=new URL(originalUrl)}catch(err){console.warn("Invalid original URL")}this.viewport_=viewport;this.paramsParser_=paramsParser;this.navigatorDelegate_=navigatorDelegate}async navigate(urlString,disposition){if(urlString.length===0){return Promise.resolve()}if(urlString[0]==="#"&&this.originalUrl_){const newUrl=new URL(this.originalUrl_.href);newUrl.hash=urlString;urlString=newUrl.href}if(!urlString.includes("://")&&!urlString.includes("mailto:")){urlString=await this.guessUrlWithoutScheme_(urlString)}let url=null;try{url=new URL(urlString)}catch(err){return Promise.reject(err)}if(!await this.isValidUrl_(url)){return Promise.resolve()}let whenDone=Promise.resolve();switch(disposition){case WindowOpenDisposition.CURRENT_TAB:whenDone=this.paramsParser_.getViewportFromUrlParams(url.href).then(this.onViewportReceived_.bind(this));break;case WindowOpenDisposition.NEW_BACKGROUND_TAB:this.navigatorDelegate_.navigateInNewTab(url.href,false);break;case WindowOpenDisposition.NEW_FOREGROUND_TAB:this.navigatorDelegate_.navigateInNewTab(url.href,true);break;case WindowOpenDisposition.NEW_WINDOW:this.navigatorDelegate_.navigateInNewWindow(url.href);break;case WindowOpenDisposition.SAVE_TO_DISK:whenDone=this.paramsParser_.getViewportFromUrlParams(url.href).then(this.onViewportReceived_.bind(this));break}return whenDone}onViewportReceived_(viewportPosition){let newUrl=null;try{newUrl=new URL(viewportPosition.url)}catch(err){}const pageNumber=viewportPosition.page;if(pageNumber!==undefined&&this.originalUrl_&&newUrl&&this.originalUrl_.origin===newUrl.origin&&this.originalUrl_.pathname===newUrl.pathname){this.viewport_.goToPage(pageNumber)}else{this.navigatorDelegate_.navigateInCurrentTab(viewportPosition.url)}}async isValidUrl_(url){const validSchemes=["http:","https:","ftp:","file:","mailto:"];if(!validSchemes.includes(url.protocol)){return false}if(url.protocol==="file:"&&this.originalUrl_&&this.originalUrl_.protocol!=="file:"){return this.navigatorDelegate_.isAllowedLocalFileAccess(this.originalUrl_.toString())}return true}async guessUrlWithoutScheme_(url){if(!this.originalUrl_||this.originalUrl_.protocol==="mailto:"||!await this.isValidUrl_(this.originalUrl_)){return url}if(url.startsWith("/")){return this.originalUrl_.origin+url}if(url.startsWith("\\")){url="./"+url}if(!url.startsWith(".")){const domainSeparatorIndex=url.indexOf("/");const domainName=domainSeparatorIndex===-1?url:url.substr(0,domainSeparatorIndex);const domainDotCount=(domainName.match(/\./g)||[]).length;if(domainDotCount>=2){return"http://"+url}}return new URL(url,this.originalUrl_.href).href}}var WindowOpenDisposition;(function(WindowOpenDisposition){WindowOpenDisposition[WindowOpenDisposition["CURRENT_TAB"]=1]="CURRENT_TAB";WindowOpenDisposition[WindowOpenDisposition["NEW_FOREGROUND_TAB"]=3]="NEW_FOREGROUND_TAB";WindowOpenDisposition[WindowOpenDisposition["NEW_BACKGROUND_TAB"]=4]="NEW_BACKGROUND_TAB";WindowOpenDisposition[WindowOpenDisposition["NEW_WINDOW"]=6]="NEW_WINDOW";WindowOpenDisposition[WindowOpenDisposition["SAVE_TO_DISK"]=7]="SAVE_TO_DISK"})(WindowOpenDisposition||(WindowOpenDisposition={}));Object.assign(window,{PdfNavigator:PdfNavigator,WindowOpenDisposition:WindowOpenDisposition});
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class LocalStorageProxyImpl{getItem(key){return window.localStorage.getItem(key)}setItem(key,value){window.localStorage.setItem(key,value)}static getInstance(){return instance||(instance=new LocalStorageProxyImpl)}}let instance=null;function getTemplate(){return html`<!--_html_template_start_--><style include="pdf-viewer-shared-style cr-hidden-style">:host{--viewer-pdf-sidenav-width:300px;display:flex;flex-direction:column;height:100%;width:100%}viewer-pdf-sidenav,viewer-toolbar{--pdf-toolbar-text-color:rgb(241, 241, 241)}viewer-toolbar{--active-button-bg:rgba(255, 255, 255, 0.24);z-index:1}@media(max-width:200px),(max-height:250px){viewer-toolbar{display:none}}#sidenav-container{overflow:hidden;transition:transform 250ms cubic-bezier(.6,0,0,1),visibility 250ms;visibility:visible;width:var(--viewer-pdf-sidenav-width)}#sidenav-container.floating{bottom:0;position:absolute;top:0;z-index:1}#sidenav-container[closed]{transform:translateX(-100%);transition:transform .2s cubic-bezier(.6,0,0,1),visibility .2s,width 0s .2s;visibility:hidden;width:0}:host-context([dir=rtl]) #sidenav-container[closed]{transform:translateX(100%)}@media(max-width:500px),(max-height:250px){#sidenav-container{display:none}}#content-focus-rectangle{border:2px solid var(--google-grey-500);border-radius:2px;box-sizing:border-box;height:100%;pointer-events:none;position:absolute;top:0;width:100%}viewer-ink-host{height:100%;position:absolute;width:100%}#container{display:flex;flex:1;overflow:hidden;position:relative}#plugin{position:initial}#content{height:100%;left:0;position:sticky;top:0;z-index:initial}#sizer{top:0;width:100%;z-index:initial}#main{flex:1;overflow:hidden;position:relative}#scroller{direction:ltr;height:100%;overflow:auto;position:relative}#scroller:fullscreen{overflow:hidden}</style>

<viewer-toolbar id="toolbar" annotation-mode="[[annotationMode_]]" doc-title="[[title_]]" doc-length="[[docLength_]]" page-no="[[pageNo_]]" load-progress="[[loadProgress_]]" has-edits="[[hasEdits_]]" has-entered-annotation-mode="[[hasEnteredAnnotationMode_]]" printing-enabled="[[printingEnabled_]]" rotated="[[isRotated_(clockwiseRotations_)]]" is-form-field-focused="[[isFormFieldFocused_]]" sidenav-collapsed="[[sidenavCollapsed_]]" two-up-view-enabled="[[twoUpViewEnabled_]]" viewport-zoom="[[viewportZoom_]]" zoom-bounds="[[zoomBounds_]]" pdf-ocr-enabled="[[pdfOcrEnabled_]]" on-change-page="onChangePage_" on-display-annotations-changed="onDisplayAnnotationsChanged_" on-fit-to-changed="onFitToChanged" on-present-click="onPresentClick_" on-properties-click="onPropertiesClick_" on-annotation-mode-dialog-confirmed="onResetView_" on-sidenav-toggle-click="onSidenavToggleClick_" on-two-up-view-changed="onTwoUpViewChanged_" on-zoom-changed="onZoomChanged" on-zoom-in="onZoomIn" on-zoom-out="onZoomOut" on-rotate-left="rotateCounterclockwise" on-print="onPrint_" on-save="onToolbarSave_" hidden>
</viewer-toolbar>

<div id="container">
  <div id="sidenav-container" closed$="[[sidenavCollapsed_]]" hidden$="[[!toolbarEnabled_]]">
    <viewer-pdf-sidenav id="sidenav" active-page="[[pageNo_]]" bookmarks="[[bookmarks_]]" clockwise-rotations="[[clockwiseRotations_]]" doc-length="[[docLength_]]" on-change-page="onChangePage_" on-change-page-and-xy="onChangePageAndXy_" on-navigate="onNavigate_">
    </viewer-pdf-sidenav>
  </div>
  <div id="main">
    <div id="scroller">
      <div id="sizer"></div>
      <div id="content"></div>
    </div>
    <div id="content-focus-rectangle" hidden$="[[!documentHasFocus_]]"></div>
  </div>
</div>

<template is="dom-if" if="[[showErrorDialog]]" on-dom-change="onErrorDialog_">
  <viewer-error-dialog id="error-dialog"></viewer-error-dialog>
</template>

<template is="dom-if" if="[[showPasswordDialog_]]" restamp>
  <viewer-password-dialog id="password-dialog" on-close="onPasswordDialogClose_" on-password-submitted="onPasswordSubmitted_">
  </viewer-password-dialog>
</template>

<template is="dom-if" if="[[showPropertiesDialog_]]" restamp>
  <viewer-properties-dialog id="properties-dialog" document-metadata="[[documentMetadata_]]" file-name="[[fileName_]]" page-count="[[docLength_]]" on-close="onPropertiesDialogClose_">
  </viewer-properties-dialog>
</template>
<!--_html_template_end_-->`}
// Copyright 2013 The Chromium Authors
function getFilenameFromURL(url){const mainUrl=url.split(/#|\?/)[0];const components=mainUrl.split(/\/|\\/);const filename=components[components.length-1];try{return decodeURIComponent(filename)}catch(e){if(e instanceof URIError){return filename}throw e}}function eventToPromise(event,target){return new Promise((resolve=>listenOnce(target,event,(_e=>resolve()))))}const LOCAL_STORAGE_SIDENAV_COLLAPSED_KEY="sidenavCollapsed";const BACKGROUND_COLOR=4283586137;class PdfViewerElement extends PdfViewerBaseElement{static get is(){return"pdf-viewer"}static get template(){return getTemplate()}static get properties(){return{annotationAvailable_:{type:Boolean,computed:"computeAnnotationAvailable_("+"hadPassword_, clockwiseRotations_, canSerializeDocument_,"+"twoUpViewEnabled_)"},annotationMode_:{type:Boolean,value:false},attachments_:{type:Array,value:()=>[]},bookmarks_:{type:Array,value:()=>[]},canSerializeDocument_:{type:Boolean,value:false},clockwiseRotations_:{type:Number,value:0},docLength_:Number,documentHasFocus_:{type:Boolean,value:false},documentMetadata_:{type:Object,value:()=>{}},fileName_:String,hadPassword_:{type:Boolean,value:false},hasEdits_:{type:Boolean,value:false},hasEnteredAnnotationMode_:{type:Boolean,value:false},isFormFieldFocused_:{type:Boolean,value:false},loadProgress_:Number,pageNo_:Number,pdfAnnotationsEnabled_:{type:Boolean,value:false},pdfOcrEnabled_:{type:Boolean,value:false},printingEnabled_:{type:Boolean,value:false},showPasswordDialog_:{type:Boolean,value:false},showPropertiesDialog_:{type:Boolean,value:false},sidenavCollapsed_:{type:Boolean,value:false},title_:String,twoUpViewEnabled_:{type:Boolean,value:false},viewportZoom_:{type:Number,value:1},zoomBounds_:{type:Object,value:()=>({min:0,max:0})}}}constructor(){super();this.beepCount=0;this.navigator_=null;this.pluginController_=null;this.sidenavRestoreState_=false;this.toolbarEnabled_=false;this.sidenavCollapsed_=Boolean(Number.parseInt(LocalStorageProxyImpl.getInstance().getItem(LOCAL_STORAGE_SIDENAV_COLLAPSED_KEY),10))}getBackgroundColor(){return BACKGROUND_COLOR}setPluginSrc(plugin){plugin.src=this.browserApi.getStreamInfo().streamUrl}init(browserApi){this.initInternal(browserApi,this.$.scroller,this.$.sizer,this.$.content);this.pluginController_=PluginController.getInstance();this.fileName_=getFilenameFromURL(this.originalUrl);this.title_=this.fileName_;assert(this.paramsParser);this.toolbarEnabled_=this.paramsParser.shouldShowToolbar(this.originalUrl);if(this.toolbarEnabled_){this.$.toolbar.hidden=false}const showSidenav=this.paramsParser.shouldShowSidenav(this.originalUrl,this.sidenavCollapsed_);this.sidenavCollapsed_=!showSidenav;this.navigator_=new PdfNavigator(this.originalUrl,this.viewport,this.paramsParser,new NavigatorDelegateImpl(browserApi));if(chrome.mimeHandlerPrivate&&chrome.mimeHandlerPrivate.onSave){chrome.mimeHandlerPrivate.onSave.addListener(this.onSave_.bind(this))}}handleKeyEvent(e){if(shouldIgnoreKeyEvents()||e.defaultPrevented){return}if(this.viewport.handleDirectionalKeyEvent(e,this.isFormFieldFocused_)){return}if(document.fullscreenElement!==null){if(hasCtrlModifier(e)&&(e.key==="="||e.key==="-"||e.key==="+")){e.preventDefault()}return}switch(e.key){case"a":if(hasCtrlModifier(e)){this.pluginController_.selectAll();e.preventDefault()}return;case"[":if(e.ctrlKey){this.rotateCounterclockwise()}return;case"]":if(e.ctrlKey){this.rotateClockwise()}return}this.handleToolbarKeyEvent_(e)}handleToolbarKeyEvent_(e){if(e.key==="\\"&&e.ctrlKey){this.$.toolbar.fitToggle()}}onDisplayAnnotationsChanged_(e){assert(this.currentController);this.currentController.setDisplayAnnotations(e.detail)}async enterPresentationMode_(){const scroller=this.$.scroller;this.viewport.saveZoomState();await Promise.all([eventToPromise("fullscreenchange",scroller),scroller.requestFullscreen()]);this.forceFit(FittingType.FIT_TO_HEIGHT);this.viewport.setPresentationMode(true);this.pluginController_.setPresentationMode(true)}exitPresentationMode_(){assert(document.fullscreenElement===null);this.viewport.setPresentationMode(false);this.pluginController_.setPresentationMode(false);this.shadowRoot.querySelector("embed").focus();this.viewport.restoreZoomState()}async onPresentClick_(){await this.enterPresentationMode_();await eventToPromise("fullscreenchange",this.$.scroller);this.exitPresentationMode_()}onPropertiesClick_(){assert(!this.showPropertiesDialog_);this.showPropertiesDialog_=true}onPropertiesDialogClose_(){assert(this.showPropertiesDialog_);this.showPropertiesDialog_=false}onTwoUpViewChanged_(e){const twoUpViewEnabled=e.detail;assert(this.currentController);this.currentController.setTwoUpView(twoUpViewEnabled);record(twoUpViewEnabled?UserAction.TWO_UP_VIEW_ENABLE:UserAction.TWO_UP_VIEW_DISABLE)}goToPageAndXy_(origin,page,message){this.viewport.goToPageAndXy(page,message.x,message.y);if(origin===ChangePageOrigin.BOOKMARK){record(UserAction.FOLLOW_BOOKMARK)}}get bookmarks(){return this.bookmarks_}setLoadState(loadState){super.setLoadState(loadState);if(loadState===LoadState.FAILED){this.closePasswordDialog_()}}updateProgress(progress){if(this.toolbarEnabled_){this.loadProgress_=progress}super.updateProgress(progress)}onErrorDialog_(){if(!chrome.tabs||this.browserApi.getStreamInfo().tabId===-1){return}const errorDialog=this.shadowRoot.querySelector("#error-dialog");errorDialog.reloadFn=()=>{chrome.tabs.reload(this.browserApi.getStreamInfo().tabId)}}closePasswordDialog_(){const passwordDialog=this.shadowRoot.querySelector("#password-dialog");if(passwordDialog){passwordDialog.close()}}onPasswordDialogClose_(){this.showPasswordDialog_=false}onPasswordSubmitted_(event){this.pluginController_.getPasswordComplete(event.detail.password)}updateUiForViewportChange(){this.clockwiseRotations_=this.viewport.getClockwiseRotations();this.pageNo_=this.viewport.getMostVisiblePage()+1;this.twoUpViewEnabled_=this.viewport.twoUpViewEnabled();assert(this.currentController);this.currentController.viewportChanged()}handleStrings(strings){super.handleStrings(strings);this.pdfAnnotationsEnabled_=loadTimeData.getBoolean("pdfAnnotationsEnabled");this.pdfOcrEnabled_=loadTimeData.getBoolean("pdfOcrEnabled");this.printingEnabled_=loadTimeData.getBoolean("printingEnabled");const presetZoomFactors=this.viewport.presetZoomFactors;this.zoomBounds_.min=Math.round(presetZoomFactors[0]*100);this.zoomBounds_.max=Math.round(presetZoomFactors[presetZoomFactors.length-1]*100)}handleScriptingMessage(message){if(super.handleScriptingMessage(message)){return true}if(this.delayScriptingMessage(message)){return true}switch(message.data.type.toString()){case"getSelectedText":this.pluginController_.getSelectedText().then(this.handleSelectedTextReply.bind(this));break;case"print":this.pluginController_.print();break;case"selectAll":this.pluginController_.selectAll();break;default:return false}return true}handlePluginMessage(e){const data=e.detail;switch(data.type.toString()){case"attachments":const attachmentsData=data;this.setAttachments_(attachmentsData.attachmentsData);return;case"beep":this.handleBeep_();return;case"bookmarks":const bookmarksData=data;this.setBookmarks_(bookmarksData.bookmarksData);return;case"documentDimensions":this.setDocumentDimensions(data);return;case"email":const emailData=data;const href="mailto:"+emailData.to+"?cc="+emailData.cc+"&bcc="+emailData.bcc+"&subject="+emailData.subject+"&body="+emailData.body;this.handleNavigate_(href,WindowOpenDisposition.CURRENT_TAB);return;case"getPassword":this.handlePasswordRequest_();return;case"loadProgress":const progressData=data;this.updateProgress(progressData.progress);return;case"navigate":const navigateData=data;this.handleNavigate_(navigateData.url,navigateData.disposition);return;case"navigateToDestination":const destinationData=data;this.viewport.handleNavigateToDestination(destinationData.page,destinationData.x,destinationData.y,destinationData.zoom);return;case"metadata":const metadataData=data;this.setDocumentMetadata_(metadataData.metadataData);return;case"setIsEditing":this.hasEdits_=true;return;case"setIsSelecting":const selectingData=data;this.viewportScroller.setEnableScrolling(selectingData.isSelecting);return;case"setSmoothScrolling":this.viewport.setSmoothScrolling(data.smoothScrolling);return;case"formFocusChange":const focusedData=data;this.isFormFieldFocused_=focusedData.focused;return;case"touchSelectionOccurred":this.sendScriptingMessage({type:"touchSelectionOccurred"});return;case"documentFocusChanged":const hasFocusData=data;this.documentHasFocus_=hasFocusData.hasFocus;return;case"sendKeyEvent":const keyEventData=data;const keyEvent=deserializeKeyEvent(keyEventData.keyEvent);keyEvent.fromPlugin=true;this.handleKeyEvent(keyEvent);return}assertNotReached("Unknown message type received: "+data.type)}forceFit(view){this.$.toolbar.forceFit(view)}afterZoom(viewportZoom){this.viewportZoom_=viewportZoom}setDocumentDimensions(documentDimensions){super.setDocumentDimensions(documentDimensions);this.closePasswordDialog_();if(this.toolbarEnabled_){this.docLength_=this.documentDimensions.pageDimensions.length}}handleBeep_(){this.beepCount+=1}handlePasswordRequest_(){if(!this.showPasswordDialog_){this.showPasswordDialog_=true;this.sendScriptingMessage({type:"passwordPrompted"})}else{const passwordDialog=this.shadowRoot.querySelector("#password-dialog");assert(passwordDialog);passwordDialog.deny()}}handleNavigate_(url,disposition){this.navigator_.navigate(url,disposition)}setAttachments_(attachments){this.attachments_=attachments}setBookmarks_(bookmarks){this.bookmarks_=bookmarks}setDocumentMetadata_(metadata){this.documentMetadata_=metadata;this.title_=this.documentMetadata_.title||this.fileName_;document.title=this.title_;this.canSerializeDocument_=this.documentMetadata_.canSerializeDocument}async onSaveAttachment_(e){const index=e.detail;const size=this.attachments_[index].size;assert(size!==-1);let dataArray=[];if(size!==0){assert(this.currentController);const result=await this.currentController.saveAttachment(index);const MAX_FILE_SIZE=100*1e3*1e3;const bufView=new Uint8Array(result.dataToSave);assert(bufView.length<=MAX_FILE_SIZE,`File too large to be saved: ${bufView.length} bytes.`);assert(bufView.length===size,`Received attachment size does not match its expected value: ${size} bytes.`);dataArray=[result.dataToSave]}const blob=new Blob(dataArray);const fileName=this.attachments_[index].name;chrome.fileSystem.chooseEntry({type:"saveFile",suggestedName:fileName},(entry=>{if(chrome.runtime.lastError){if(chrome.runtime.lastError.message!=="User cancelled"){console.error("chrome.fileSystem.chooseEntry failed: "+chrome.runtime.lastError.message)}return}entry.createWriter((writer=>{writer.write(blob);chrome.mimeHandlerPrivate.setShowBeforeUnloadDialog(false)}))}))}async onSave_(streamUrl){if(streamUrl!==this.browserApi.getStreamInfo().streamUrl){return}let saveMode;if(this.hasEnteredAnnotationMode_){saveMode=SaveRequestType.ANNOTATION}else if(this.hasEdits_){saveMode=SaveRequestType.EDITED}else{saveMode=SaveRequestType.ORIGINAL}this.save_(saveMode)}onToolbarSave_(e){this.save_(e.detail)}onChangePage_(e){this.viewport.goToPage(e.detail.page);if(e.detail.origin===ChangePageOrigin.BOOKMARK){record(UserAction.FOLLOW_BOOKMARK)}else if(e.detail.origin===ChangePageOrigin.PAGE_SELECTOR){record(UserAction.PAGE_SELECTOR_NAVIGATE)}else if(e.detail.origin===ChangePageOrigin.THUMBNAIL){record(UserAction.THUMBNAIL_NAVIGATE)}}onChangePageAndXy_(e){const point=this.viewport.convertPageToScreen(e.detail.page,e.detail);this.goToPageAndXy_(e.detail.origin,e.detail.page,point)}onNavigate_(e){const disposition=e.detail.newtab?WindowOpenDisposition.NEW_BACKGROUND_TAB:WindowOpenDisposition.CURRENT_TAB;this.navigator_.navigate(e.detail.uri,disposition)}onSidenavToggleClick_(){this.sidenavCollapsed_=!this.sidenavCollapsed_;const container=this.shadowRoot.querySelector("#sidenav-container");if(!this.sidenavCollapsed_){container.classList.add("floating");container.addEventListener("transitionend",(()=>{container.classList.remove("floating")}),{once:true})}LocalStorageProxyImpl.getInstance().setItem(LOCAL_STORAGE_SIDENAV_COLLAPSED_KEY,(this.sidenavCollapsed_?1:0).toString())}async save_(requestType){this.recordSaveMetrics_(requestType);let result=null;assert(this.currentController);if(requestType!==SaveRequestType.ORIGINAL||!this.annotationMode_){result=await this.currentController.save(requestType)}if(result==null){return}let fileName=result.fileName;if(!fileName.toLowerCase().endsWith(".pdf")){fileName=fileName+".pdf"}const blob=new Blob([result.dataToSave],{type:"application/pdf"});chrome.fileSystem.chooseEntry({type:"saveFile",accepts:[{description:"*.pdf",extensions:["pdf"]}],suggestedName:fileName},(entry=>{if(chrome.runtime.lastError){if(chrome.runtime.lastError.message!=="User cancelled"){console.error("chrome.fileSystem.chooseEntry failed: "+chrome.runtime.lastError.message)}return}entry.createWriter((writer=>{writer.write(blob);chrome.mimeHandlerPrivate.setShowBeforeUnloadDialog(false)}))}))}recordSaveMetrics_(requestType){record(UserAction.SAVE);switch(requestType){case SaveRequestType.ANNOTATION:record(UserAction.SAVE_WITH_ANNOTATION);break;case SaveRequestType.ORIGINAL:record(this.hasEdits_?UserAction.SAVE_ORIGINAL:UserAction.SAVE_ORIGINAL_ONLY);break;case SaveRequestType.EDITED:record(UserAction.SAVE_EDITED);break}}async onPrint_(){record(UserAction.PRINT);assert(this.currentController);this.currentController.print()}computeAnnotationAvailable_(){return this.canSerializeDocument_&&!this.hadPassword_}isRotated_(){return this.clockwiseRotations_!==0}}customElements.define(PdfViewerElement.is,PdfViewerElement);export{ChangePageOrigin,CrActionMenuElement,FittingType,PAINTED_ATTRIBUTE,PdfNavigator,PdfViewerBaseElement,PdfViewerElement,PluginController,SaveRequestType,UserAction,ViewerBookmarkElement,ViewerDocumentOutlineElement,ViewerDownloadControlsElement,ViewerPageSelectorElement,ViewerPasswordDialogElement,ViewerPdfSidenavElement,ViewerPropertiesDialogElement,ViewerThumbnailBarElement,ViewerThumbnailElement,ViewerToolbarElement,WindowOpenDisposition,getFilenameFromURL,record,shouldIgnoreKeyEvents};