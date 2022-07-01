class Utils{static SPEED=1e3*Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--speed").replace("s",""));static IS_MOBILE=window.matchMedia("(any-pointer:coarse)").matches;static#t=!1;constructor(){}static init(){this.#t||(this.#t=!0,history.URL=t=>{history.replaceState({},"",t),window.dispatchEvent(new Event("locationchange"))})}static getIcon(t,e=null){const s=[...document.querySelector("#icons-template").content.cloneNode(!0).children].find((e=>`icon-${t}`==`${e.className.baseVal}`));return e?s.setAttribute("class",`icon-${t} ${e} icon`):s.setAttribute("class",`icon-${t} icon`),s}static getButton(t){return[...document.querySelector("#buttons-template").content.cloneNode(!0).children].find((e=>`${t}-button`==`${e.className}`))}static getBrowserPath(){const t=new Proxy(new URLSearchParams(window.location.search),{get:(t,e)=>t.get(e)});return null===t.path||"none"===t.path?[]:t.path.split("/")}static getDataFromPath(t,e){let s=null,i=null;const n=t=>{i=t;for(let a=0;a<t.length;a++){const l=t[a],r=`${l.path}`;if(l.children&&r!==e)i=l,n(l.children);else if(r===e){s={parent:i,item:l};break}}return s};return n(t)}static setStartTouchOrMouseEvent(t,e){this.IS_MOBILE?t.addEventListener("touchstart",(t=>e({x:t.touches[0].clientX,y:t.touches[0].clientY})),{passive:!0}):t.addEventListener("mousedown",(t=>e({x:t.clientX,y:t.clientY})))}static setEndTouchOrMouseEvent(t,e){this.IS_MOBILE?t.ontouchend=t=>{let s,i;t.touches.length?(s=t.touches[0].clientX,i=t.touches[0].clientY):(s=t.changedTouches[0].clientX,i=t.changedTouches[0].clientY),e({x:s,y:i})}:t.onmouseup=t=>{e({x:t.clientX,y:t.clientY})}}static setMoveEvent(t,e){const s=window.innerWidth/2,i=window.innerHeight/2;this.IS_MOBILE?t.ontouchmove=t=>{e({x:t.touches[0].clientX-s,y:t.touches[0].clientY-i})}:t.onmousemove=t=>{e({x:t.clientX-s,y:t.clientY-i})}}static unsetTouchOrMouseEvents(t){this.IS_MOBILE?(t.ontouchstart,t.ontouchend,t.ontouchmove=null):(t.onmousedown,t.onmouseup,t.onmousemove=null)}static Wait(t=this.SPEED){return new Promise((e=>setTimeout((()=>{e(!0)}),t)))}static OpenFiles(t=null){if(!t)throw new Error("Need callback to open files...");let e=[],s=document.querySelector("#files-input");s.onchange=()=>{for(let t=0;t<s.files.length;t++){const i=s.files[t];e.push({id:t.toString(),title:i.name.replace(".mp3",""),url:URL.createObjectURL(i),type:"file",action:"play"})}t(e)},s.click()}static async copyTextToClipboard(t){if(navigator.clipboard)try{await navigator.clipboard.writeText(t)}catch(t){}}static async updateClipboard(t){try{await navigator.clipboard.writeText(t)}catch(t){}}static Opacity(t,e){return t.style.opacity=e,new Promise((t=>setTimeout((()=>{t("opacity done")}),this.SPEED)))}static TranslateY(t,e){let s={x:0,y:e};return e.includes("%")||(s.y=e+"px"),this.Translate(t,s)}static TranslateX(t,e){let s={x:e,y:0};return e.includes("%")||(s.x=e+"px"),this.Translate(t,s)}static Translate(t,e){return this.#e(t,`translate3D(${e.x},${e.y},0)`)}static Rotate(t,e){return this.#e(t,`rotate3D(0,0,${e}deg)`)}static Scale(t,e){return this.#e(t,`scale3D(${e},${e},1)`)}static#e(t,e){return t.style.transform=e,new Promise((t=>setTimeout((()=>{t("done")}),this.SPEED)))}static Distance(t,e){const s=t.getBoundingClientRect(),i=e.getBoundingClientRect(),n=s.left+s.width/2,a=s.top+s.height/2,l=i.left+i.width/2,r=i.top+i.height/2;return Math.sqrt((r-a)*(r-a)+(l-n)*(l-n))}static PeekY(t,e="0"){const s=i=>{t.length?t.forEach((t=>s(t))):"0"===e?this.Opacity(i,1):this.Opacity(i,0),this.TranslateY(t,e)};s(t)}static PeekX(t,e="0"){return e.includes("-")||e<0?this.Opacity(t,0):this.Opacity(t,1),this.TranslateX(t,e)}static Spin(t,e="0"){return this.#e(t,`scale3D(1,1,1) rotate(${e}deg)`)}static Pop(t){return this.#e(t,"scale3D(1,1,1)")}}Utils.init();class Component{#s;#i=[];animID=null;#n={x:0,y:0};constructor(t){this.#s=t}addEventListener(t,e){this.#s.addEventListener(t,e),this.#i.push({name:t,event:e})}dispatchEvent(t,e){this.#s.dispatchEvent(new CustomEvent(t,e))}removeEventListener(t){let e=[];for(let s=0;s<this.#i.length;s++){const i=this.#i[s];i.name!==t?e.push(i):this.#s.removeEventListener(i.name,i.event)}this.#i=e}async translate(t,e){Utils.Translate(t,e)}set id(t){this.#s.setAttribute("id",t)}get id(){return this.#s.getAttribute("id")}set width(t){this.#s.style.width=`${t}px`}get width(){return this.#s.offsetWidth}set height(t){let e=""+t;e.includes("var")||e.includes("%")||(e=`${t}px`),this.#s.style.height=e}get height(){return this.#s.offsetHeight}get element(){return this.#s}set element(t){this.#s=t}set opacity(t){this.#s.style.opacity=t}get opacity(){return this.#s.style.opacity}}class Controls extends Component{#a;#l;#r;#o=Controls.States.PAUSED;constructor(){super(document.querySelector("#controls"));const t=this.element;this.#a=new IconButton(["previous"],null,"previous track"),this.#a.addEventListener("click",(()=>{t.dispatchEvent(new CustomEvent(Controls.States.ON_ACTION,{detail:{state:Controls.States.PREVIOUS}}))})),t.appendChild(this.#a.element),this.#l=new IconButton(["play","pause","loading","cross"],null,"play pause"),this.#l.setFill(3,"var(--red-a)"),this.#l.id="play-pause-button",this.#l.addEventListener("click",(()=>{t.dispatchEvent(new CustomEvent(Controls.States.ON_ACTION,{detail:{state:this.#o}}))})),t.appendChild(this.#l.element),this.#r=new IconButton(["next"],null,"next track"),this.#r.addEventListener("click",(()=>{this.element.dispatchEvent(new CustomEvent(Controls.States.ON_ACTION,{detail:{state:Controls.States.NEXT}}))})),t.appendChild(this.#r.element)}set state(t){switch(this.#o=t,this.#o){case Controls.States.PLAYING:this.#l.toggle(1);break;case Controls.States.PAUSED:this.#l.toggle(0);break;case Controls.States.SEEKING:this.#l.toggle(2);break;case Controls.States.ERROR:this.#l.toggle(3)}}get state(){return this.#o}}Controls.States={ON_ACTION:"controlsastatesonaction",PLAYING:"controlsastatesplaying",PLAY:"controlsastatesplay",PAUSED:"controlsastatespaused",SEEKING:"controlsastatesseeking",ERROR:"controlsastateserror",NEXT:"controlsastatesnext",PREVIOUS:"controlsastatesprevious"};class Info extends Component{#c;#h=!1;#u=null;#d=null;#p=null;#m=null;constructor(){super(document.querySelector("#info")),this.#c=new LabelButton("music player",Utils.getIcon("cross")),this.#d=this.element.querySelector("#info-content"),this.#p=this.element.querySelector(".info-details"),this.element.appendChild(this.#c.element),this.#c.addEventListener("click",(()=>this.#h?this.close():this.open())),this.#m=new LabelButton("share",Utils.getIcon("link"),!0),this.#d.appendChild(this.#m.element),this.#m.addEventListener("click",(()=>{this.dispatchEvent(Info.States.ON_ACTION,{detail:Info.States.COPY_2_CLIPBOARD}),this.#m.showSubText("link copied!",2e3)}))}async open(){this.#h||(this.#h=this.#c.iconed=!0,this.element.dispatchEvent(new CustomEvent(Info.States.ON_ACTION,{detail:Info.States.OPENING})),await Utils.TranslateY(this.#d,"0"),Utils.TranslateX(this.#p,"0"),await Utils.Opacity(this.#p,1),Utils.Opacity(this.#m.element,1))}async close(){this.#h&&(this.#h=this.#c.iconed=!1,this.#p.style.display=this.#m.element.style.display="none",await Utils.TranslateY(this.#d,"-100%"),this.#p.style.display="block",this.#m.element.style.display="flex",Utils.TranslateX(this.#p,"100%"),Utils.Opacity(this.#p,0),Utils.Opacity(this.#m.element,0),this.element.dispatchEvent(new CustomEvent(Info.States.ON_ACTION,{detail:Info.States.CLOSING})))}setupLayout(t){this.#c.text=t.title,this.#p.querySelector(".title").innerText=t.title;const e=this.#p.querySelector(".duration");"file"!==t.type?e.innerText="∞":e.innerText=`${parseInt(t.duration/60%60)}:${parseInt(t.duration%60)}`,this.#p.querySelector(".type").innerText=t.type}update(t,e=null){switch(this.#u=e,this.dimmed=!1,t){case Info.States.DISABLED:this.dimmed=!0;break;case Info.States.ERROR:this.#c.error=!0}e&&this.setupLayout(e)}set dimmed(t=!1){this.#c.dimmed=t}get dimmed(){return this.#c.dimmed}set data(t){this.#u=t}get data(){return this.#u}get isOpened(){return this.#h}}Info.States={ENABLED:"infostatesenabled",DISABLED:"infostatesdisabled",ERROR:"infostateserror",ON_ACTION:"infostatesonaction",OPENING:"infostatesopening",CLOSING:"infostatesclosing",COPY_2_CLIPBOARD:"infostatescopy2clipboard"};class List extends Component{#y;#g=[];currentItem=null;constructor(t=null,e=null){if(super(),!t)throw new Error("List missing data! Please add data to list");this.#y=t,this.build(t),this.highlightItem(e)}build(t){this.element=document.createElement("ul");for(let e=0;e<t.children.length;e++){const s=document.createElement("li"),i=new ListButton(t.children[e]);i.addEventListener("click",(()=>{this.currentItem=i,this.dispatchEvent(List.CLICK,{detail:i.data})})),s.appendChild(i.element),this.element.appendChild(s),this.#g.push(i)}}set activated(t){t?this.currentItem.setIcon("active","pulse"):this.currentItem.icon=[]}get activated(){return this.currentItem.icon}highlightItem(t=null){null!==t&&this.#g.forEach((e=>{e.highlight(!1),t===e.data.title&&(this.currentItem=e,e.highlight(!0))}))}set data(t){this.#y=t}get data(){return this.#y}get children(){return this.#g}async show(t="0",e=1){return Utils.Opacity(this.element,e),Utils.TranslateX(this.element,t)}async hide(t="100%",e=0){return Utils.Opacity(this.element,e),Utils.TranslateX(this.element,t)}async peekX(t="0"){return Utils.PeekX(this.element,t)}static get CLICK(){return"listclick"}}class Locker extends Component{#E;#b;#I=window.innerWidth/2.5;constructor(){super(document.querySelector("#locker"));const t=this.element.querySelector(".container");this.#E=new IconButton(["lock","unlock"],"locker-button"),this.#E.setFill(0,"var(--yellow-b)"),this.#E.setFill(1,"var(--yellow-b)"),t.appendChild(this.#E.element),this.#b=new IconButton(["lock","unlock"],"locker-target"),t.appendChild(this.#b.element),Utils.setStartTouchOrMouseEvent(this.#E.element,(()=>{this.startDrag()}))}startDrag(){Utils.setEndTouchOrMouseEvent(document,(t=>this.endDrag(t))),Utils.setMoveEvent(document,(t=>{Utils.Distance(this.#E.element,this.#b.element)>=this.#I?(this.#E.toggle(1),this.#b.toggle(1)):(this.#E.toggle(0),this.#b.toggle(0)),Utils.Translate(this.#E.element,{x:`${t.x}px`,y:`${t.y}px`})}))}endDrag(){Utils.unsetTouchOrMouseEvents(document),Utils.Distance(this.#E.element,this.#b.element)>=this.#I?(this.element.dispatchEvent(new CustomEvent(Locker.ACTION,{detail:{type:Locker.Actions.UNLOCKED}})),this.hide()):Utils.Translate(this.#E.element,{x:0,y:0}),this.#E.toggle(0)}show(){this.element.dispatchEvent(new CustomEvent(Locker.ACTION,{detail:{type:Locker.Actions.OPENING}})),this.element.style.display="flex",requestAnimationFrame((()=>this.element.style.transform="scale(1)"))}async hide(){this.element.dispatchEvent(new CustomEvent(Locker.ACTION,{detail:{type:Locker.Actions.CLOSING}})),this.element.style.transform="scale(0)",await Utils.Wait(),Utils.Translate(this.#E.element,{x:0,y:0}),this.element.style.display="none"}static get ACTION(){return"lockeraction"}static get Actions(){return{UNLOCKED:"lockeractionsunlocked",OPENING:"lockeractionsopening",CLOSING:"lockeractionsclosing"}}}class Menu extends Component{#v;#C;#T;#f=[];#S=null;#L=[];#O=!1;isOpened=!1;#w;constructor(t){super(document.querySelector("#menu")),this.#v=t,this.#w=new Breadcrumb("menu-breadcrumb"),this.#w.addEventListener(Breadcrumb.GO_TO,(t=>this.gotoList(t.detail))),this.#C=new IconButton(["menu","cross"],"menu-button","open close menu"),this.#C.addEventListener("click",(()=>{this.isOpened?this.close():this.open()})),this.element.appendChild(this.#C.element),this.#T=this.element.querySelector("#menu-list-container")}async open(){this.buildMenu(),this.dispatchEvent(Menu.ACTION,{detail:{action:"opening"}}),this.#C.toggle(1),await Utils.TranslateY(this.#T,"0"),this.#O?this.#S.show():this.#f.forEach((t=>t.show())),this.isOpened=!0}async close(){this.clearMenu(),this.#w.hide(),this.dispatchEvent(Menu.ACTION,{detail:{action:"closing"}}),this.#C.toggle(0),await Utils.TranslateY(this.#T,"100%"),this.isOpened=!1}buildMenu(){this.#L=[];const t=Utils.getBrowserPath();if(t&&(this.#L=t),this.addList(this.#v[0],!1),this.#O){let t=[];const e=s=>{for(let i=0;i<this.#L.length;i++)for(let n=0;n<s.length;n++)if(s[n].title===this.#L[i]){const i=s[n];t.push(i),i.children&&e(i.children);break}};e(this.#v[0].children),t.forEach((t=>{t.children&&this.addList(t,!1)}))}}clearMenu(){this.#f.forEach((t=>this.#T.removeChild(t.element))),this.#f=[],this.#S=null}addList(t,e=!0){this.#S&&this.#S.peekX("-30%",0);const s=new List(t,this.#L[this.#f.length]);s.addEventListener(List.CLICK,(t=>{const e=t.detail;e.children?this.addList(e):e.action&&this.dispatchEvent(Menu.ACTION,{detail:{action:e.action,listData:s.data,currentItem:e}})})),this.#T.appendChild(s.element),this.#f.push(s),this.#S=s,this.#w.update(this.#S.data),this.#S.currentItem&&this.#O&&(this.#S.currentItem.data.children||(s.activated=!0)),e&&requestAnimationFrame((()=>s.show())),this.dispatchEvent(Menu.ACTION,{detail:{action:"list_added"}})}async gotoList(t=0){let e=[];for(let s=this.#f.length-1;s>t;s--)e.push(this.#f[s]);this.#S=this.#f[t],this.#S.peekX("0"),e.forEach((t=>t.hide())),this.#f.length-e.length>1?this.#w.show():this.#w.hide(),await Utils.Wait(),e.forEach((t=>this.removeList(t)))}removeList(t){this.#T.removeChild(t.element),this.#f=this.#f.filter((e=>e!==t)),this.#f.length>1?this.#w.show():this.#w.hide(),this.dispatchEvent(Menu.ACTION,{detail:{action:"list_removed"}})}static get ACTION(){return"menuaction"}set activated(t){this.#O=t}get activated(){return this.#O}get currentData(){return this.#S.currentItem.data}}class Player{#A;#k;#P=[];#D=0;#N=Player.PLAY_MODE.REPEAT_ALL;constructor(t,e=null){this.#P=t,e&&(this.#D=t.findIndex((t=>t.id===e.id))),this.#A=new Audio,this.#k=Player.Actions.PAUSED,this.#A.onended=()=>{switch(this.#N){case Player.PLAY_MODE.REPEAT_ALL:this.#D<this.#P.length-1&&this.next();break;case Player.PLAY_MODE.REPEAT_CURRENT:this.play(this.#P,this.#D);case Player.PLAY_MODE.SHUFFLE:}this.#A.dispatchEvent(new CustomEvent(Player.ACTION,{detail:{type:Player.Actions.ENDED}}))}}async play(t=null,e=null){null!==e&&(this.#D=e),null!==t&&(this.#P=t),this.#P[this.#D].url!==this.#A.src&&(this.#A.src=this.#P[this.#D].url),this.#A.dispatchEvent(new CustomEvent(Player.ACTION,{detail:{type:Player.Actions.LOADING}}));try{await this.#A.play(),this.#A.dispatchEvent(new CustomEvent(Player.ACTION,{detail:{type:Player.Actions.PLAYING}})),Number.isFinite(this.duration)?this.#A.ontimeupdate=()=>{this.#A.dispatchEvent(new CustomEvent(Player.ACTION,{detail:{type:Player.Actions.TIME_UPDATE,time:this.currentTime/this.duration}}))}:this.#A.ontimeupdate=null}catch(t){if(!this.#A.error)return;let e;switch(this.#A.error.code){case MediaError.MEDIA_ERR_ABORTED:e="Aborted!";break;case MediaError.MEDIA_ERR_NETWORK:e="No Network!";break;case MediaError.MEDIA_ERR_DECODE:e="Error decoding!";break;case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:e="Not Suported/Found!";break;default:e="UnknownError"}this.#A.dispatchEvent(new CustomEvent(Player.ACTION,{detail:{type:Player.Actions.ERROR,error:t,message:e}}))}}pause(){this.#A.pause(),this.#A.dispatchEvent(new CustomEvent(Player.ACTION,{detail:{type:Player.Actions.PAUSED}}))}next(){this.#P.length<=1&&this.#N===Player.PLAY_MODE.REPEAT_ALL||(this.#D++,this.#D>=this.#P.length&&(this.#D=0),this.play())}previous(){this.#P.length<=1||(this.#D--,this.#D<0&&(this.#D=this.#P.length-1),this.play())}addEventListener(t,e){this.#A.addEventListener(t,e)}set volume(t){this.#A.volume=t,this.#A.dispatchEvent(new CustomEvent(Player.ACTION,{detail:{type:Player.Actions.VOLUME}}))}get volume(){return this.#A.volume}get playmode(){return this.#N}set playmode(t){this.#N=t}get state(){this.#k}get duration(){return this.#A.duration}set currentTime(t){this.currentTrack&&"stream"!==this.currentTrack.type&&(this.#A.currentTime=t*this.#A.duration)}get currentTime(){return Number.isFinite(this.duration)?this.#A.currentTime:-1}get currentTrack(){return this.#P.length?{...this.#P[this.#D],duration:this.duration,currentTime:this.currentTime}:null}get isPlaying(){return!this.#A.paused}}Player.ACTION="playeraction",Player.Actions={LOADING:"playeractionsloading",PLAYING:"playeractionsplaying",PAUSED:"playeractionspaused",ENDED:"playeractionsended",VOLUME:"playeractionsvolume",TIME_UPDATE:"playeractionstimeupdate",ERROR:"playeractionserror"},Player.PLAY_MODE={REPEAT_ALL:"repeat_all",REPEAT_CURRENT:"repeat_current",SHUFFLE:"shuffle"};class Settings extends Component{#x=null;#B=null;#U;constructor(t=null){super(document.querySelector("#settings")),this.#B=this.element.querySelector("#settings-container"),this.#x=t,this.buildView()}buildView(){const t=document.createElement("ul");let e=document.createElement("li");const s=this.#x.find((t=>"playmode"===t.type));this.#U=new ToggleButton(s.name,s.value,["repeat_all","repeat_current","shuffle"]),this.#U.addEventListener(ToggleButton.CLICK,(t=>{this.#x[0].value=t.detail.value,this.#R(0)})),e.appendChild(this.#U.element),t.appendChild(e);const i=new IconButton(["check"],"settings-close-button");i.addEventListener("click",(()=>{this.hide()})),this.#B.appendChild(t),this.#B.appendChild(i.element)}#R(t=0){this.lock(this.#x[t].type),this.dispatchEvent(Settings.ACTION,{detail:{type:Settings.Actions.HAS_CHANGED,data:this.#x[t]}})}lock(t){this.#_(t,!1)}#_(t,e){if("playmode"===t)this.#U.setEnabled(e,this.#x[0].value)}unlock(t){this.#_(t,!0)}async show(){this.element.dispatchEvent(new CustomEvent(Settings.ACTION,{detail:{type:Settings.Actions.OPENING}})),this.element.style.display="flex",requestAnimationFrame((()=>this.element.style.transform="scale(1)")),this.#B.style.display="grid",await Utils.Wait(),requestAnimationFrame((()=>Utils.Opacity(this.#B,1)))}async hide(){this.element.dispatchEvent(new CustomEvent(Settings.ACTION,{detail:{type:Settings.Actions.CLOSING}})),this.#B.style.display="none",Utils.Opacity(this.#B,0),this.element.style.transform="scale(0)",await Utils.Wait(),this.element.style.display="none"}static get ACTION(){return"settingsaction"}static get Actions(){return{OPENING:"settingsctionsopening",CLOSING:"settingsactionsclosing",HAS_CHANGED:"settingsactionshaschanged"}}}class Button extends Component{#M;#q=!0;constructor(t,e=null){super(t),this.#M=e}addEventListener(t,e){super.addEventListener(t,e)}highlight(t=!1){this.element.style.backgroundColor=""+(t?"var(--yellow-b)":"transparent")}setEnabled(t){this.enabled=t}get enabled(){return this.#q}set enabled(t){let e;this.#q=t,e=this.#q?"initial":"none",this.element.style.pointerEvents=e}set data(t){this.#M=t}get data(){return this.#M}}class IconButton extends Button{#Y;#G=[];#$=!1;#X=0;constructor(t,e=null,s=null){super(Utils.getButton("icon")),this.#Y=this.element.querySelector(".icons-container");for(let e=0;e<t.length;e++){const s=Utils.getIcon(t[e]);this.#Y.appendChild(s),this.#G.push(s)}this.#$=this.#Y.children.length>1,this.#$&&this.toggle(this.#X),e&&(this.id=e),s&&this.element.setAttribute("aria-label",s)}toggle(t=0){for(let e=0;e<this.#G.length;e++){const s=this.#G[e];s.style.display="none",e===t&&(s.style.display="initial")}}setFill(t=0,e){this.#G[t].style.fill=e}set state(t){this.#X=t,this.toggle(this.#X)}get state(){return this.#X}}class LabelButton extends Button{#F;#E;#V;constructor(t="...",e=null,s=!1){super(Utils.getButton("labeled")),this.#F=this.element.querySelector("label"),this.#V=this.element.querySelector("span"),this.#E=this.element.querySelector(".icons-container"),e&&(this.#E.appendChild(e),this.#E.style.display="none"),this.text=t,s&&(this.#F.style.display="initial",this.#E.style.display="flex")}showSubText(t="",e=Utils.SPEED){this.#V.innerText=t,Utils.Opacity(this.#V,1),null!==this.animID&&(clearTimeout(this.animID),this.animID=null),this.animID=setTimeout((()=>Utils.Opacity(this.#V,0)),e)}addEventListener(t,e){super.addEventListener(t,(t=>e(t)))}set error(t){this.#F.style.color=t?"var(--red-a)":"var(--red-b)"}set dimmed(t){this.#F.style.color=t?"var(--blue-b)":"var(--yellow-b)"}get dimmed(){return this.enabled}set iconed(t){t?(this.#F.style.display="none",this.#E.style.display="flex"):(this.#F.style.display="initial",this.#E.style.display="none")}get iconed(){return"initial"===this.#E.style.display}get text(){return this.#F.innerText}set text(t){this.#F.innerText=t}}class ListButton extends Button{#H;#W;#Y;constructor(t){super(Utils.getButton("list-item"),t),this.#H=this.element.querySelector(".label-container"),this.#W=this.element.querySelector("label"),this.#Y=this.element.querySelector(".icons-container"),t.icon?this.icon=[t.icon]:t.children?this.icon=["leaf"]:this.#H.style.maxWidth="100%",this.label=t.title}setIcon(t,e=null){this.#Y.append(Utils.getIcon(t,e)),this.#H.style.maxWidth="calc(100% - var(--button-height))"}set icon(t){if(t.length)for(let e=0;e<t.length;e++)this.#Y.append(Utils.getIcon(t[e]));else this.#Y.innerHtml=""}get icon(){return this.#Y.children}set label(t){this.#W.innerText=t}get label(){return this.#W.innerText}}class ToggleButton extends Button{#j;#K;#Z=0;#z;constructor(t="",e="",s=[]){super(Utils.getButton("toggle")),this.#z=t,this.#j=this.element.querySelector(".icons-container"),this.#K=this.element.querySelector("label"),this.#K.innerHTML=`${this.#z}<span>${e}</span>`;for(let t=0;t<s.length;t++){const e=Utils.getIcon(s[t]);t!==this.#Z&&(e.style.display="none"),this.#j.appendChild(e)}const i=this.#j.children;this.addEventListener("click",(()=>{this.#Z++,this.#Z>=i.length&&(this.#Z=0);for(let t=0;t<i.length;t++)t!==this.#Z?i[t].style.display="none":i[t].style.display="initial";this.dispatchEvent(ToggleButton.CLICK,{detail:{index:this.#Z,value:s[this.#Z]}})}))}setEnabled(t,e=""){let s;super.setEnabled(t),this.enabled?(s=1,this.#K.innerHTML=`${this.#z}<span>${e}</span>`):(s=.7,this.#K.innerHTML=`${this.#z}<span>...</span>`),this.element.style.opacity=s}}ToggleButton.CLICK="togglebuttonclick";class Breadcrumb extends Component{#J=[];#Y;#Q;#tt=!1;#et=5;constructor(t){super(document.querySelector(`#${t}`)),this.#Y=this.element.querySelector(".crumbs-container"),this.#Q=this.element.querySelector("label"),this.height=0}addCrumb(t="crumb"){const e=new IconButton(["crumb"]),s=this.#J.length;this.#Y.appendChild(e.element),this.#J.push({elem:e,title:t}),e.addEventListener("click",(()=>{this.dispatchEvent(Breadcrumb.GO_TO,{detail:s}),this.removeCrumb(s)})),Utils.Pop(e.element),this.title=t}removeCrumb(t=-1){if(0!==t){for(let e=this.#J.length-1;e>0&&(this.#Y.removeChild(this.#J[e].elem.element),this.#J.pop(),t!==e);e--);this.title=this.#J[this.#J.length-1].title}}show(){this.#tt||(this.height="var(--button-height)",this.#tt=!0)}hide(){this.#tt&&(this.#J.forEach((t=>this.#Y.removeChild(t.elem.element))),this.#J=[],this.height=0,this.title="",this.#tt=!1)}update(t){if(!t.path||!t.children)return;t.id.split(".").map((t=>+t+0)).length>this.#J.length&&(this.show(),this.addCrumb(t.title))}get length(){return this.#J.length}set title(t=""){this.#Q.innerText=t}get title(){return this.#Q.innerText}static get GO_TO(){return"breadcrumbactionsgoto"}}class RangeSlider extends Component{#st;#it;#nt=!1;#at=0;#lt=null;constructor(t){super(document.querySelector(t));const e=this.element.querySelector("input");this.#st=this.element.querySelector(".input-background"),e.oninput=()=>{this.#it=e.value,this.element.dispatchEvent(new CustomEvent(RangeSlider.Actions.ON_INPUT,{detail:this.value}))},this.#it=e.value}async hide(){this.#at=0,this.#lt&&(clearInterval(this.#lt),this.#lt=null),Utils.Opacity(this.element,0),this.#lt=setInterval((()=>{this.element.style.visibility="hidden",this.#st.style.transform="scaleX(0)"}),Utils.SPEED)}show(){this.#lt&&(clearInterval(this.#lt),this.#lt=null),this.element.style.visibility="initial",Utils.Opacity(this.element,1)}animateBackground(){this.#nt&&(this.#at+=2,this.element.style.backgroundPosition=`${this.#at}px 0px`,this.#at>=this.element.width&&(this.#at=0))}set animated(t=!1){this.#nt=t,this.#nt?this.element.style.backgroundImage='url("loading_bar.svg")':this.element.style.backgroundImage=null}get animated(){return this.#nt}set value(t){this.#it=t,this.#st.style.transform=`scaleX(${100*this.#it}%)`}get value(){return this.#it/100}}RangeSlider.Actions={ON_INPUT:"rangeslideractionsoninput"};class Splash{constructor(){}async doSplash(t){const e=document.querySelector("#splash"),s=e.querySelectorAll(".a, .b"),i=e.querySelector(".splash-container"),n=i.querySelector("svg");i.removeChild(n),Utils.Spin(t),s[0].style.transform="translateY(-100%)",s[1].style.transform="translateY(100%)",await Utils.Wait(),document.body.removeChild(e)}}import{initializeApp as t}from"https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";import{getFirestore as e,collection as s,getDocs as i,updateDoc as n,doc as a,getDoc as l}from"https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";import{getStorage as r,ref as o,listAll as c,getDownloadURL as h}from"https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";t({apiKey:"AIzaSyDfWfH1NKuOw0LV8zsrs1qMZb9GMwTasNY",authDomain:"music-player-9d063.firebaseapp.com",projectId:"music-player-9d063",storageBucket:"music-player-9d063.appspot.com",messagingSenderId:"330573243041",appId:"1:330573243041:web:fd1c00053e3739f041c6e0"});export const getAllData=async t=>{let e=[{title:t,children:[]}];const s=await getDB("streams"),i=e[0].children;return i.push({id:"0",title:"streams",path:"streams",children:s.children}),i.push({id:"1",title:"music",path:"music",children:await getFolder("music","1")}),i.push({id:"2",title:"playlists",path:"playlists",children:[]}),i.push({id:"3",title:"open",path:"open",icon:"open",action:"open"}),i.push({id:"4",title:"settings",path:"settings",icon:"settings",action:"settings"}),i.push({id:"5",title:"lock",path:"lock",icon:"lock",action:"lock"}),i.push({id:"6",title:"exit",path:"exit",icon:"exit",action:"exit"}),e};export const getDB=async t=>{const n=e();let a=null;return(await i(s(n,t))).forEach((t=>a=t.data())),a};export const updateDB=async(t,l)=>{const r=e();let o=null;(await i(s(r,t))).forEach((t=>o=t.id));const c=a(r,t,o);return await n(c,{data:[l]}),l.type};export const getFolder=async(t,e="0")=>{try{const s=await r(),i=o(s,t),n=await c(i);if(!n.prefixes.length)return[];const a=async(e,i=[],n="0")=>{for(let l=0;l<e.length;l++){const r=e[l],u=await c(r),d=`${n}.${l}`;if(u.prefixes.length){let t=await a(u.prefixes,[],d);i.push({id:d,title:r.name,path:r.fullPath,children:t})}else if(u.items.length){let e=[];for(let i=0;i<u.items.length;i++){const n=u.items[i],a=await h(o(s,n.fullPath));e.push({id:`${d}.${i})`,title:n.name,path:n.fullPath,url:a,type:t,action:"play"})}i.push({id:d,title:r.name,path:r.fullPath,children:e})}}return i};return await a(n.prefixes,[],e)}catch(t){}};const u=document.querySelector("#main-container"),d=document.querySelector("#ui"),p=d.querySelector("#ui-sub");let m=!1;window.onload=async()=>{document.body.style.opacity=1,"serviceWorker"in navigator&&navigator.serviceWorker.register("service-worker.js")};const y=await fetch("data.json"),g=await y.json(),E=await fetch("settings.json"),b=await E.json();(async()=>{m||(m=!0,await(new Splash).doSplash(u))})();const I=new Info;I.addEventListener(Info.States.ON_ACTION,(t=>{switch(t.detail){case Info.States.OPENING:Utils.PeekY(p,"5%");break;case Info.States.CLOSING:Utils.PeekY(p,"0");break;case Info.States.COPY_2_CLIPBOARD:const t=window.location;Utils.copyTextToClipboard(t)}}));const v=new Controls;v.addEventListener(Controls.States.ON_ACTION,(async t=>{switch(t.detail.state){case Controls.States.PREVIOUS:k.previous();break;case Controls.States.PLAYING:k.pause();break;case Controls.States.PAUSED:if(!f.isOpened&&!k.currentTrack){f.open();break}await k.play();break;case Controls.States.NEXT:k.next()}}));const C=new RangeSlider("#progress-bar");C.addEventListener(RangeSlider.Actions.ON_INPUT,(t=>{k.duration!==Number.POSITIVE_INFINITY&&(k.currentTime=t.detail)}));const T=new RangeSlider("#volume");T.addEventListener(RangeSlider.Actions.ON_INPUT,(()=>{k.volume=T.value}));const f=new Menu(g);f.addEventListener(Menu.ACTION,(async t=>{switch(t.detail.action){case"opening":Utils.PeekY(d,"-10%"),I.isOpened&&I.close();break;case"play":f.close();const e=t.detail,s=e.listData.children;k.play(s,s.findIndex((t=>t.id===e.currentItem.id)));break;case"closing":Utils.PeekY(d);break;case"lock":f.close(),S.show();break;case"settings":L.show();break;case"open":Utils.OpenFiles((t=>{t.length&&(k.play(t,0),f.close())}));break;case"exit":window.close()}}));const S=new Locker;S.addEventListener(Locker.ACTION,(t=>{switch(t.detail.type){case Locker.Actions.OPENING:Utils.Scale(u,"0.5");break;case Locker.Actions.CLOSING:Utils.Scale(u,"1.0")}}));const L=new Settings(b[0].data);L.addEventListener(Settings.ACTION,(async t=>{switch(t.detail.type){case Settings.Actions.HAS_CHANGED:const e=await updateDB("settings",t.detail.data);L.unlock(e),(t=>{switch(t.type){case"playmode":case"theme":k.playmode=t.value}})(t.detail.data);break;case Settings.Actions.OPENING:Utils.Scale(u,"0.5");break;case Settings.Actions.CLOSING:Utils.Scale(u,"1")}}));const O=Utils.getBrowserPath();let w=[],A=null;if(O){let t=Utils.getDataFromPath(g,O.join("/"));t&&(w=t.parent,A=t.item)}const k=new Player(w,A);k.addEventListener(Player.ACTION,(t=>{switch(t.detail.type){case Player.Actions.LOADING:v.state=Controls.States.SEEKING,I.update(Info.States.DISABLED,k.currentTrack);break;case Player.Actions.PLAYING:v.state=Controls.States.PLAYING,I.update(Info.States.ENABLED,k.currentTrack);let e="?path=none";"file"!==k.currentTrack.type&&(e=`?path=${k.currentTrack.path}`),history.URL(e),Number.isFinite(k.duration)?(C.animated=!0,C.show()):(C.animated=!1,C.hide()),f.activated=!0;break;case Player.Actions.ENDED:v.state=Controls.States.PAUSED;break;case Player.Actions.PAUSED:I.update(Info.States.DISABLED,{...k.currentTrack,duration:k.duration,currentTime:k.currentTime}),v.state=Controls.States.PAUSED,f.activated=!1;break;case Player.Actions.VOLUME:T.value=k.volume;break;case Player.Actions.TIME_UPDATE:C.value=t.detail.time,C.animateBackground();break;case Player.Actions.ERROR:I.update(Info.States.ERROR,k.currentTrack),v.state=Controls.States.ERROR,I.state=Info.States.ERROR}})),k.volume=T.value,k.currentTrack?I.title=k.currentTrack.title:I.title="Music Player";