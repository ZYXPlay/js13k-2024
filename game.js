!function(){function C(t){var e=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=document.createElementNS("http://www.w3.org/2000/svg","path");return e.appendChild(i),i.setAttribute("d",t),i.setAttribute("fill","none"),i.setAttribute("stroke","black"),i.setAttribute("stroke-width","2"),i.setAttribute("id","path"),i}function h(t){let{x:e=0,y:i=0,width:s,height:h}=t;return e-=.5*s,i-=.5*h,s<0&&(e+=s,s*=-1),h<0&&(i+=h,h*=-1),{x:e,y:i,width:s,height:h}}function H(t,e,...i){return setTimeout(t,e,...i)}function L(t=0,e=1){return Math.random()*(e-t)+t}function N(t,e){r[t]=r[t]||[],r[t].push(e)}function D(t,...e){(r[t]||[]).map(t=>t(...e))}function a(t,e){return new URL(t,e).href}function s(){window.Ca||(window.Ca={Pa:a,La:o,d:B})}function t(t,e,i){if(s(),B[t])return B[t];B[t]=e(...i)}function e(h){return s(),new Promise((t,e)=>{let i,s;if(o[h])return t(o[h]);(i=new Image).onload=()=>{s=a(h,window.location.href),o[s]=o[h]=i,t(i)},i.onerror=()=>{e()},i.src=h})}function z(t){return new v(t)}function k(t){return new E(t)}function n(t=()=>{},e){t.Da&&e.preventDefault(),t(e)}function f(t){var e=p[t.code],i=l[e];d[e]=!0,n(i,t)}function x(t){var e=p[t.code],i=c[e];d[e]=!1,n(i,t)}function i(t){return[].concat(t).some(t=>d[t])}function F(t,e,{Ha:i="keydown",preventDefault:s=!0}={}){let h="keydown"==i?l:c;e.Da=s,[].concat(t).map(t=>h[t]=e)}function X(t,{Ha:e="keydown"}={}){let i="keydown"==e?l:c;[].concat(t).map(t=>delete i[t])}function P(t){return new O(t)}function G(e=1){var i=P({create:W,s:241});i.Ma=function(e){this.u.forEach(t=>{t.dy*=e})},i.va=function(){this.u.forEach(t=>{t.dy/=2})},i.Qa=e;for(let t=0;t<240;t++){var s=L(1,3)*e,h=Math.floor(s/e*50)+50;i.get({x:Math.floor(L(0,256)),y:t,width:1,height:1,dy:s/4,color:`rgb(${h}, ${h}, ${h})`,update(){this.advance(),240<this.y&&(this.y=0)}})}return i.F=()=>!0,i}function q(t){return new S(t)}function w(t,e){var i=[],s=e.x+e.width/2,h=e.y+e.height/2;return e=t.y<h,h=t.y+t.height>=h,t.x<s&&(e&&i.push(0),h)&&i.push(2),t.x+t.width>=s&&(e&&i.push(1),h)&&i.push(3),i}function Q(t){return new M(t)}function _(t){return new A(t)}function j(s,t){s.F()&&t.forEach(t=>{var e,i;(e=(e="enemy"!==s.name||"enemy"!==t.name)&&(t.F()&&!s.m&&!t.m))&&(e=h(t),i=h(s),e=e.x<i.x+i.width&&e.x+e.width>i.x&&e.y<i.y+i.height&&e.y+e.height>i.y),e&&("ship-bullet"!=s.name||t.m||(s.g=0,t.T(1)),"ship"!=s.name||"asteroid"!=t.name&&"boss"!=t.name||(s.G(),s.g=0,t.T(5)),"ship"==s.name&&"enemy"==t.name&&(t.G(),t.g=0,s.T(50)),"ship"==s.name&&"enemy-bullet"==t.name&&(t.g=0,s.T(10)),"ship"!=s.name||"powerup"!=t.name||t.na||(t.G(),s.Ia(t)))})}function tt(t){return new T(t)}function U(t){t=Z[t];var e=Math.max(...Object.keys(t[0]),...Object.keys(t[1])),i=t[0][e];return e+(i??=t[1][e])[1]/1e3*60*i[0]}function m(){F(["esc"],()=>{D("change-scene","menu")}),F(["p"],()=>{D("pause")}),F(["m"],()=>{$.ka?$.stop():$.start()}),X(["enter"]),F(["enter"],()=>i.Ka()),$.set("song1"),$.start();const r=new et({x:120,y:248}),o=G(20),i=new it(void 0),l=new it(void 0);let c=0,d=0,p=3<d?Math.floor(.5*d):0,g=0,u=!0,f=!1,x=U(c),s=!1;const n=P({create:k,s:400}),w=P({create:W,s:40}),m=P({create:W,s:400}),y=P({create:q,s:10}),v=P({create:Q,s:50}),E=P({create:_,s:4}),O=P({create:tt,s:4}),S=z({text:"SCORE 00000",x:8,y:8}),M=z({x:224,y:8,text:"@@@",color:"red"}),A=z({x:128,y:120,text:"LEVEL 1",align:"center",color:"lightgreen"}),t=new V({x:192,y:8,width:24,height:8,anchor:{x:0,y:0},j(){var t=this.context,e=0<=r.h?r.h/5:0;t.strokeStyle="white",t.lineWidth=2,t.strokeRect(0,0,this.width,this.height),t.fillStyle="green",r.h<25&&(t.fillStyle="red"),t.fillRect(2,2,e,this.height-4)}}),T=new V({x:0,y:0,active:!1,K:384,update:function(){this.active&&60<this.K&&(this.K-=2),!this.active&&this.K<384&&(this.K+=1),this.advance()},j(){var t=this.context;t.save(),t.beginPath(),t.strokeStyle="white",t.lineWidth=3,t.arc(r.x,r.y,this.K,0,2*Math.PI,!0),t.clip(),t.stroke()},start(){K(B.transition),this.K=384,this.active=!0},end(){K(B.transition),this.active=!1},o(){this.j()}}),e=new V({x:0,y:0,update(){},j(){this.context.restore()},o(){this.j()}}),I=(N("hit",()=>{K(B.hit)}),N("explosion",(e,i,s,h,a)=>{K(B.explosion);for(let t=0;t<s;t++)0==t%2&&n.get({x:e,y:i,dx:L(-1,1)/2,dy:L(-1,1)/2,color:null,g:30}),n.get({x:e,y:i,dx:L(-h/2,h/2),dy:L(-h/2,h/2),color:a,g:30*h})}),N("ship-fire",(t,e,i)=>{K(B.shoot),w.get({name:"ship-bullet",x:t,y:e,width:2,height:4,dy:-4,dx:i,color:null,l:17,g:100,update(){this.advance(),this.y<0&&(this.g=0)}})}),N("ship-die",()=>{D("spawn-powerup","fire",128,.6)}),N("enemy-fire",(t,e)=>{K(B.shoot);var i=r.x-4-t,s=r.y-4-e,h=+Math.hypot(i,s);m.get({name:"enemy-bullet",x:t+4,y:e+4,dx:i/h,dy:s/h,width:2,height:2,color:"red",g:300})}),N("boss-fire",(e,i)=>{K(B.shoot2);for(let t=0;t<12;t++)m.get({name:"enemy-bullet",x:e,y:i,dx:+Math.cos(30*t*Math.PI/180),dy:+Math.sin(30*t*Math.PI/180),width:2,height:2,color:"red",g:400})}),N("score",t=>{r.L+=Math.floor(t+2*p)}),N("spawn-boss",(t,e,i,s,h,a,n,r,o,l)=>{f=!1,D("spawn-enemy",a,0,{l:n,h:2,W:l,Ga:r,parent:t=E.get({l:t,h:e,W:i,rotate:!1,loop:!0,m:!0,aa:"pink",ua:o,ta:h,path:C(s)}),path:null})}),N("spawn-enemy",(e,i,s)=>{e+=p;for(let t=0;t<e;t++){const h=Math.min(Math.max(1,s.l/4),2);H(t=>{v.get({...s,speed:h,sa:t*Math.PI/180,h:s.h+p})},t*i,360/e*t)}}),N("spawn-asteroid",(e,i,s,h,a)=>{13===e&&(T.start(),H(()=>T.end(),15e3));let n=0;for(let t=0;t<e;t++)n>s.length-1&&(n=0),H((t,e)=>{y.get({x:s[e],y:-8,dx:h[e],dy:a[e],h:10+p})},t*i,t,n),n++}),N("spawn-powerup",(t,e,i)=>{"shield"===t&&s||O.get({type:t,x:e,y:-8,dy:i})}),N("set-dialog",(t,e)=>{t?l.start({B:e,Z:!0}):i.start({B:e,Z:!1})}),N("next-level",t=>{f=!1,c=t,d++,g=0,u=!1,x=U(t),p=3<d?Math.floor(.25*d):0,D("score",100),12===d&&D("level-13"),25===d&&D("level-26")}),N("boss-die",()=>{D("score",200),D("next-level",c=++c>=st?0:c)}),N("game-over",()=>{var t=localStorage.getItem("hiScore")||0;r.L>t&&localStorage.setItem("hiScore",r.L),D("change-scene","game-over",{L:r.L,Ja:t})}),N("level-13",()=>{D("set-dialog",!0,["LETS MAKE THIS","INSTERESTING.","NOW WITH ONE LIFE ONLY"]),r.Y=1,r.h=100}),N("level-26",()=>{D("set-dialog",!0,["HEY! YOU ARE GOOD AT THIS!","NOW ONE HIT AND YOU DIE!","AND NO SHIELD POWERUPS."]),r.Y=1,r.h=10,s=!0}),new J(void 0)),R=new J(void 0),b=new J(void 0);return new Y({children:[T,o,w,m,r,v,E,y,O,n,e,i,l,t,A,S,M],ya:!1,update(){var t,e,i,s,h,a,n;this.paused=!1,l.ja&&l.Z?(l.update(),this.paused=!0):(g<40&&(A.text="LEVEL "+(d+1),A.g=100),t=v.size+y.size,g===x&&(f=!0),[t=0,e=0,i,s=!1]=[g,c,t,f],a=Z[e],n=U(e),a[0][t]&&D("spawn-enemy",(h=a[0][t])[0],h[1],{l:h[2],rotate:h[3],loop:h[4],h:h[5],Ga:h[6],W:h[7],path:C(h[8])}),a[1][t]&&D("spawn-asteroid",...a[1][t]),a[2][t]&&D("spawn-powerup",...a[2][t]),a[3][t]&&D("set-dialog",...a[3][t]),0===a[4].length&&n<=t&&0===i&&D("next-level",e+1>=st?0:e+1),0<a[4].length&&s&&0===i&&D("spawn-boss",...a[4]),r.Y<=0&&!this.ya?(this.ya=!0,H(()=>D("game-over"),1e3)):(w.D().forEach(t=>{I.clear(),I.add(t,y.D(),v.D(),E.D()),j(t,I.get(t))}),R.clear(),R.add(r,y.D(),v.D(),m.D(),E.D(),O.D()),j(r,R.get(r)),b.clear(),b.add(y.D()),y.D().forEach(t=>{j(t,b.get(t))}),S.text="SCORE "+r.L,M.text="@@@".slice(0,r.Y),u&&40<g&&g<140&&0==g%20&&o.va(),g++))}})}function y(){F(["enter"],()=>{D("change-scene","game")}),X(["esc"]);const t=G(20),e=z({x:128,y:32,text:"MICRO SHOOTER",align:"center",color:"red",v:2,I:4}),i=z({x:128,y:88,text:"JS13K 2024 EDITION",align:"center",color:"yellow"}),s=z({x:128,y:128,text:"A GAME BY\nMARCO FERNANDES",lineHeight:16,color:"white",align:"center"}),h=z({x:128,y:176,text:"ARROWS OR WASD TO MOVE\nSPACE TO SHOOT",lineHeight:16,align:"center"}),a=z({x:128,y:224,text:"ENTER TO START",color:"lightgreen",align:"center"}),n=new Y({frame:0,children:[t,a],update(){40<this.frame&&this.frame<140&&0==this.frame%20&&t.va(),this.frame++}});return H(()=>{n.add(e)},1e3),H(()=>{n.add(i)},2e3),H(()=>{n.add(s)},3e3),H(()=>{n.add(h)},4e3),n}let r={},o={},B={};class V{constructor(t){this.i(t)}i(t={}){Object.assign(this,{name:"",x:0,y:0,width:8,height:8,rotation:0,v:1,I:1,anchor:{x:0,y:0},color:"white",dx:0,dy:0,V:0,S:0,g:1/0,frame:0,l:0,context:window.U.context,A:[o["spritesheet.png"],8,8],h:20,X:!1,O:t.update,ia:t.o,ra:t.j,...t})}T(t){D("hit"),this.h-=t,this.X=!0,this.h<=0&&this.G&&this.G(),H(()=>this.X=!1,100)}advance(){this.x+=this.dx,this.y+=this.dy,this.dx+=this.V,this.dy+=this.S,this.g--,this.frame++}update(){this.O?this.O():this.advance()}o(){if(this.ia)return this.ia();var t=this.context,e=this.x,i=this.y,s=this.anchor,h=this.rotation,a=this.v,n=this.I,r=this.width,o=this.height;t.save(),t.translate(e,i),h&&t.rotate(h),a&&n&&t.scale(a,n),t.translate(-r*s.x,-o*s.y),this.j(),t.restore()}j(){if(this.ra)return this.ra();var t=this.context,e=this.color,i=this.width,s=this.height;this.X&&(t.save(),t.translate(0,-1)),this.color?(t.fillStyle=e,t.fillRect(0,0,i,s)):t.drawImage(this.A[0],this.l*this.A[1],0,i,s,0,0,i,s),this.X&&(t.globalCompositeOperation="source-atop",t.fillStyle="white",t.fillRect(0,0,i,s),t.globalCompositeOperation="source-over",t.restore())}F(){return 0<this.g}}const W=t=>new V(t);class Y{constructor(t){this.i(t)}i(i={}){var t=Object.keys(i).reduce((t,e)=>("function"!=typeof i[e]&&(t[e]=i[e]),t),{});Object.assign(this,{id:"scene",context:window.U.context,O:i.update,ia:i.o,children:[],paused:!1,...t})}add(t){this.children.push(t)}pause(){this.paused=!0}resume(){this.paused=!1}update(e){this.paused||(this.children.forEach(t=>{if(!t.F)return t.update(e);t.F()&&t.update(e)}),this.O&&this.O())}o(){this.context.save(),this.O&&this.O(),this.children.forEach(t=>{if(!t.F)return t.o();t.F()&&t.o()}),this.context.restore()}}class v extends V{constructor(t={}){super({name:"text",x:0,y:0,text:"",color:"white",align:"left",lineHeight:8,scale:1,A:o["font.png"],...t})}j(){const t=this.text.split("\n"),h=this.context,e=this.align,a=this.lineHeight,n=this.color;h.save(),t.forEach(i=>{h.save(),"center"===e&&h.translate(8*-i.length/2,0),"right"===e&&h.translate(8*-i.length,0);for(let e=0;e<i.length;e++){var s=i.charCodeAt(e);let t=64===s?41:58===s?40:33===s?39:63===s?38:44===s?37:46===s?36:32===s?-1:48<=s&&s<=57?s-22:65<=s&&s<=90?s-65:0;-1!==t&&(s=8*e,h.drawImage(this.A,8*t,0,8,8,s,0,8,8),h.globalCompositeOperation="source-atop",h.fillStyle=n||"white",h.fillRect(s,0,8,8),h.globalCompositeOperation="source-over")}h.restore(),h.translate(0,a)}),h.restore()}}class E extends V{constructor(t){super({name:"explosion-particle",color:"white",anchor:{x:.5,y:.5},...t})}update(){!this.color&&this.g<30&&(this.v=this.I=this.g/30),this.color&&this.g<60&&(this.v=this.I=this.g/60),this.advance()}j(){this.color||this.context.drawImage(this.A[0],128,0,8,8,0,0,8,8),this.color&&(this.context.fillStyle=this.color,this.context.fillRect(0,0,1,1))}}let l={},c={},d={},p={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",ArrowDown:"arrowdown"};const K=(...t)=>{let e=g.createBufferSource(),i=g.createBuffer(t.length,t[0].length,44100);return t.map((t,e)=>i.getChannelData(e).set(t)),e.buffer=i,e.connect(g.destination),e.start(),e},R=(t=1,e=.05,i=220,s=0,h=0,a=.1,n=0,r=1,o=0,l=0,c=0,d=0,p=0,g=0,u=0,f=0,x=0,w=1,m=0,y=0)=>{var v=2*Math.PI,E=o*=500*v/194481e4,O=(0<u?1:-1)*v/4;e=i*=(1+2*e*Math.random()-e)*v/44100;let S=[],M=0,A=0,T=0,I=1,R=0,b=0,C=0,H,L;for(l*=500*v/44100**3,u*=v/44100,c*=v/44100,d*=44100,p=44100*p|0,L=(s=99+44100*s)+(m*=44100)+(h*=44100)+(a*=44100)+(x*=44100)|0;T<L;S[T++]=C)++b%(100*f|0)||(C=n?1<n?2<n?3<n?Math.sin((M%v)**3):Math.max(Math.min(Math.tan(M),1),-1):1-(2*M/v%2+2)%2:1-4*Math.abs(Math.round(M/v)-M/v):Math.sin(M),C=(p?1-y+y*Math.sin(2*Math.PI*T/p):1)*(0<C?1:-1)*Math.abs(C)**r*t*.3*(T<s?T/s:T<s+m?1-(T-s)/m*(1-w):T<s+m+h?w:T<L-x?(L-T-x)/a*w:0),C=x?C/2+(x>T?0:(T<L-x?1:(L-T)/x)*S[T-x|0]/2):C),H=(i+=o+=l)*Math.sin(A*u-O),M+=H-H*g*(1-1e9*(Math.sin(T)+1)%2),A+=H-H*g*(1-1e9*(Math.sin(T)**2+1)%2),I&&++I>d&&(i+=c,e+=c,I=0),!p||++R%p||(i=e,o=E,I=I||1);return S},g=new(window.AudioContext||webkitAudioContext);class et extends V{i(t){super.i({name:"ship",ea:!0,y:248,m:!1,Fa:!1,h:100,Y:3,L:0,C:0,H:!1,wa:null,anchor:{x:.5,y:.5},l:1,...t}),this.Aa()}Ia(t){K(B.powerup),"shield"===t.type&&(this.h+=50,100<this.h)&&(this.h=100),"fire"===t.type&&(this.C++,4<this.C&&(this.C=4),clearTimeout(this.wa),this.wa=H(()=>{4===this.C&&(this.C=3)},3e4))}ba(){this.H||(this.H=!0,D("ship-fire",this.x-1,this.y-8,L(-.3,.3)),0<this.C&&D("ship-fire",this.x-1,this.y-8,L(-.5,.5)),1<this.C&&H(()=>{D("ship-fire",this.x-1,this.y-8,L(-.3,.3)),D("ship-fire",this.x-1,this.y-8,L(-.5,.5))},100),2<this.C&&H(()=>{D("ship-fire",this.x-1,this.y-8,-2),D("ship-fire",this.x-1,this.y-8,2)},400),3<this.C&&H(()=>{D("ship-fire",this.x-16,this.y-4,L(-.1,.1)),D("ship-fire",this.x+14,this.y-4,L(-.1,.1))},200),H(()=>{this.H=!1},200))}G(){D("ship-die"),D("explosion",this.x,this.y-4,60,4,"white"),this.Fa=!0,this.g=0,this.Y--,this.m=!0,this.V=this.dx=0,this.x=128,H(()=>{this.Aa()},1e3)}Aa(){this.ea=this.m=!0,this.g=1/0,this.y=248,this.frame=0,this.h=100,this.C=0,H(()=>{this.m=this.ea=!1},1e3)}update(){this.S=this.V=0,this.dx*=.96,this.dy*=.96,this.l=1,i(["d","arrowright"])&&this.dx<5&&(this.V=.2,this.l=2),i(["a","arrowleft"])&&-5<this.dx&&(this.V=-.2,this.l=0),this.ea||(i(["s","arrowdown"])&&this.dy<5&&(this.S=.2),i(["w","arrowup"])&&-5<this.dy&&(this.S=-.2)),!this.H&&i("space")&&this.ba(),this.ea&&(this.S=-.03,this.v=this.I=Math.min(Math.max(1,2-this.frame/60),2)),this.h<=0&&this.G(),this.advance(),this.x<4&&(this.x=4,this.dx=0),252<this.x&&(this.x=252,this.dx=0),this.y<4&&(this.y=4,this.dy=0),236<this.y&&(this.y=236,this.dy=0)}j(){var t=this.context,e=this.width,i=this.height;t.drawImage(this.A[0],this.A[1]*this.l,0,e,i,0,0,e,i);let s=1;this.S<0&&(s=this.frame%10<5?2:3),t.fillStyle="#FFaa33",t.fillRect(3,7,2,s),t.fillStyle="#FF6633",t.fillRect(this.frame%10<5?3:4,7+s,1,s),4===this.C&&(t.fillStyle="#FFF",t.fillRect(18,4,2,2),t.fillRect(-12,4,2,2)),this.X&&(t.globalCompositeOperation="source-atop",t.fillStyle="red",t.fillRect(0,0,e,i),t.globalCompositeOperation="source-over")}}class O{constructor({create:t,s:e=1024}={}){let i;if(!(t&&(i=t({id:""}))&&i.update&&i.i&&i.F&&i.o))throw Error("Must provide create() function which returns an object with init(), update(), render(), and isAlive() functions");this.qa=t,this.u=[t({id:""})],this.size=0,this.s=e}get(t={}){if(this.size==this.u.length){if(this.size==this.s)return;for(var e=0;e<this.size&&this.u.length<this.s;e++)this.u.push(this.qa())}return e=this.u[this.size],this.size++,e.i(t),e}D(){return this.u.slice(0,this.size)}clear(){this.size=this.u.length=0,this.u.push(this.qa())}update(e){let i,s=!1;for(let t=this.size;t--;)(i=this.u[t]).update(e),i.F()||(s=!0,this.size--);s&&this.u.sort((t,e)=>e.F()-t.F())}o(){for(let t=this.size;t--;)this.u[t].o()}}class S extends V{i(t){super.i({name:"asteroid",A:[o["spritesheet16.png"],16,16],l:2,width:16,height:16,color:null,anchor:{x:.5,y:.5},h:10,...t})}G(){D("explosion",this.x,this.y,50,4,"white"),D("score",10),this.g=0}update(){this.rotation=this.frame/(10/this.dy),this.advance(),this.x<0||264<this.x||248<this.y&&(this.g=0)}}class J{constructor({ca:t=3,da:e=25,J:i}={}){this.ca=t,this.da=e,t=window.U.context.canvas,this.J=i||{x:0,y:0,width:t.width,height:t.height},this.$=!1,this.ha=0,this.R=[],this.N=[]}clear(){this.N.map(t=>{t.clear()}),this.$=!1,this.R.length=0}get(e){let i=new Set;return this.N.length&&this.$?(w(e,this.J).map(t=>{this.N[t].get(e).map(t=>i.add(t))}),Array.from(i)):this.R.filter(t=>t!==e)}add(...t){t.flat().map(t=>{this.$?this.pa(t):(this.R.push(t),this.R.length>this.da&&this.ha<this.ca&&(this.Ea(),this.R.map(t=>this.pa(t)),this.R.length=0))})}pa(e){w(e,this.J).map(t=>{this.N[t].add(e)})}Ea(){if(this.$=!0,!this.N.length)for(var t=this.J.width/2|0,e=this.J.height/2|0,i=0;i<4;i++)this.N[i]=new J({J:{x:this.J.x+(1==i%2?t:0),y:this.J.y+(2<=i?e:0),width:t,height:e},ca:this.ca,da:this.da}),this.N[i].ha=this.ha+1}}class M extends V{i(t){t={name:"enemy",l:3,color:null,anchor:{x:.5,y:.5},h:1,frame:0,loop:!0,xa:!0,aa:"white",W:200,speed:1,...t},super.i(t),this.path&&(this.g=Math.floor(t.path.getTotalLength()/this.speed)),this.loop&&(this.g=1/0)}ba(){D("enemy-fire",this.x-4,this.y-4,this.rotation,3)}G(){D("explosion",this.x,this.y,30,3,this.aa),D("score",10),this.g=0}update(){var t,e;this.rotation=180*Math.PI/180,this.path?(t=this.path.getPointAtLength(this.frame*this.speed),e=this.path.getPointAtLength(this.frame*this.speed+1),this.x=Math.floor(t.x),this.y=Math.floor(t.y),this.rotate&&(this.rotation=90*Math.PI/180+Math.atan2(e.y-t.y,e.x-t.x))):(this.x=this.parent.x+Math.cos(this.frame/this.parent.ua+this.sa)*this.parent.ta,this.y=this.parent.y+Math.sin(this.frame/this.parent.ua+this.sa)*this.parent.ta),this.xa&&(this.v=this.I=Math.min(Math.max(0,(this.frame*this.speed+1)/100),1)),!this.loop&&this.g<100&&(this.v=this.I=Math.min(Math.max(0,this.g/100),1)),this.v<1&&(this.m=!0),1<=this.v&&(this.m=!1),1==this.v&&0==this.frame%this.W&&this.ba(),this.path&&this.frame*this.speed>=this.path.getTotalLength()&&this.loop&&(this.frame=0,this.xa=!1),this.frame++,this.g--}}class A extends M{i(t){super.i({name:"boss",A:[o["spritesheet16.png"],16,16],l:0,width:16,height:16,color:null,h:10,aa:"white",W:200,H:!1,loop:!1,m:!0,la:!1,ga:[],...t}),this.za=this.h}T(t){super.T(t),this.la=!0,H(()=>{this.la=!1},1e3)}ba(){this.H=!0,this.m=!1,this.ga[0]=H(()=>{D("boss-fire",this.x,this.y,this.rotation,3)},400),this.ga[1]=H(()=>{D("boss-fire",this.x,this.y,this.rotation,3)},800),this.ga[2]=H(()=>{D("boss-fire",this.x,this.y,this.rotation,3)},1200),H(()=>{this.H=!1,this.m=!0},1600)}G(){D("explosion",this.x,this.y,30,3,this.aa),D("score",10),this.g=0,this.ga.map(t=>clearTimeout(t)),D("boss-die")}update(){this.H||super.update(),this.H||(this.m=!0)}j(){var t,e;super.j(),this.la&&(t=this.context,e=20*this.h/this.za,t.save(),t.translate(this.width/2,this.height/2),t.rotate(-this.rotation),t.fillStyle="white",t.fillRect(-12,-16,24,6),t.fillStyle="black",t.fillRect(-11,-15,22,4),t.fillStyle="green",this.h<this.za/4&&(t.fillStyle="red"),t.fillRect(-10,-14,e,2),t.restore())}}class it extends V{i(t){t={name:"dialog",x:-16,y:200,Ba:[10,11,12,13,14],text:z({text:"",x:16,y:8,align:"left"}),M:0,B:[],P:0,fa:0,frame:0,anchor:{x:0,y:0},oa:!1,ja:!1,ma:!1,Z:!0,...t},super.i(t)}Ka(){0==this.B.length||this.P>this.B.length||(this.M=this.B[this.P].length)}start(t){this.ma=!1,setTimeout(()=>{this.ja=!0,this.B=["",...t.B],this.frame=0,this.Z=t.Z},1e3),this.dx=2}stop(){this.ma=!0,this.text.text="        ",this.ja=!1,setTimeout(()=>{this.B=[],this.frame=this.M=this.P=0},1e3),this.dx=-2}update(){var t;8<this.x&&(this.dx=0,this.x=8),this.y<-16&&(this.dx=0,this.x=-16),0!=this.B.length&&(this.oa=!1," "!==(t=this.B[this.P]+"      ")[this.M]&&(this.oa=!0),0==this.frame%5&&(this.M++," "!==t[this.M])&&K(B.typing),this.P<this.B.length&&(this.text.text=t.slice(0,this.M)),this.frame++,this.M>=t.length&&(this.P++,this.M=this.frame=0),this.P>=this.B.length&&!this.ma&&this.stop(),this.oa&&0==this.frame%5&&this.fa++,this.fa>=this.Ba.length&&(this.fa=0),super.update())}j(){var t=this.context,e=this.A;t.fillStyle="white",t.fillRect(-2,-2,12,12),t.drawImage(e[0],8*this.Ba[this.fa],0,8,8,0,0,8,8),t.translate(16,0),this.text.j()}}class T extends V{i(t){super.i({name:"powerup",type:"fire",width:16,height:16,na:!1,anchor:{x:.5,y:.5},A:[o["font.png"],8,8],...t})}G(){this.na=!0,this.g=10,this.frame=0}update(){248<this.y&&(this.g=0),super.update()}j(){var t=this.context,e=this.type,i=this.na,s=this.frame;let h,a;"shield"===e&&(h="yellow",a=18),"fire"===e&&(h="lightblue",a=15),t.strokeStyle=h,t.lineWidth=2,s%20<10&&!i&&t.strokeRect(0,0,16,16),t.fillStyle=h,t.fillRect(3,3,10,10),t.drawImage(this.A[0],8*a,0,8,8,4,4,8,8),i&&(t.globalAlpha=1-this.frame/10,t.strokeRect(-this.frame,-this.frame,16+2*this.frame,16+2*this.frame),t.globalAlpha=1)}}var u={Oa:"M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z",Sa:"M287 13-21 61l293 46-293 31 293 48-290 52",Ta:"m-21 13 308 48-293 46 293 31-293 48 291 52",Ua:"m20 7 50 48-48 46 48 31-48 48 48 52",Va:"m237 7-50 48 48 46-48 31 48 48-48 52",Na:"M121 123S-30 40 24 24C78 6 168 7 233 24 298 40-40 214 24 227c63 12 159 12 209 0 51-12-112-104-112-104Z",w:"M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27",Ra:"M27-33v238c0 42 61 41 61 0V41c0-44 64-44 64 0v164c0 43 71 33 71 0V-27"};const Z=[[{500:[3,400,4,!0,!0,1,0,200,u.sandClock],1e3:[3,400,5,!0,!0,2,0,200,u.sandClock]},{},{1500:["fire",128,.6]},{100:[!1,["CAPTAIN","    ","WE DETECTED SOME ENEMY SCOUTS","BETTER DESTROY THEM"]],1e3:[!1,["TOO LATE!","THEY ARE COMING","WITH A FULL FLEET","    ","GOOD LUCK!"]]},[]],[{1e3:[3,1e3,3,!0,!1,1,0,200,u.zigzag],2e3:[5,1500,6,!1,!1,1,0,130,u.zigzagLeft]},{},{2500:["fire",128,.6],550:["shield",140,.3]},{100:[!1,["TOO LATE!","THEY ARE COMING","WITH A FULL FLEET","    ","GOOD LUCK!"]]},[0,10,50,"M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z",30,8,9,1,20,150]],[{},{1e3:[13,1e3,[20,200,120,180,60,220,180,40,120,60],[0,-.1,0,-.1,.1,-.1,0,.1,0,.1],[1,.5,.7,.5,.9,.5,1,.8,.4,.7]]},{1500:["fire",128,.6],2500:["shield",140,.3],3500:["fire",128,.6]},{100:[!1,"13 ASTEROIDS DETECTED;      ;OOOPSS...;HOPE THIS DOES NOT TRIGGER;YOUR TRISKAIDEKAPHOBIA...;         ".split(";")]},[0,10,100,"M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z",40,4,9,1,60,50]],[{800:[5,400,9,!0,!1,4,0,400,u.zigzag],810:[5,400,9,!0,!1,4,0,400,u.zigzagLeft],2e3:[5,400,7,!0,!1,4,0,400,u.w],2010:[5,400,7,!0,!1,4,0,400,u.wReversed]},{},{1500:["fire",128,.6]},{100:[!1,["THAT CONDITION STILL","AFFECTING YOUR","VISION, HUH!?","         "]]},[0,10,250,u.sandClock,30,8,8,0,10,50]],[{2500:[13,200,5,!0,!0,1,0,50,u.spiral]},{1e3:[13,1e3,[20,200,120,180,60,220,180,40,120,60],[0,-.1,0,-.1,.1,-.1,0,.1,0,.1],[1,.5,.7,.5,.9,.5,1,.8,.4,.7]]},{1500:["fire",128,.6]},{100:[!1,"HERE COME MORE ASTEROIDS;12 PLUS 1, HEHE!;         ;ALSO 13 SHIPS;        ;OH MAN! NOT AGAIN!".split(";")]},[]],[{500:[10,400,3,!1,!1,2,0,200,u.zzLeft],800:[10,400,4,!1,!1,2,0,200,u.zzRight],1500:[10,400,3,!1,!1,2,0,200,u.zzLeft],1800:[10,400,4,!1,!1,2,0,200,u.zzRight],2500:[5,1e3,6,!1,!1,1,0,40,u.spiral]},{},{1500:["fire",128,.6]},{100:[!1,["HMMM... ZIGZAGERS?","    "]]},[]]],st=Z.length,$={node:null,ka:!1,buffer:null,async set(t){var e=!!this.node;e&&await this.stop(),this.buffer=B[t],e&&await this.start()},async start(){this.node||(this.node=K(...this.buffer),this.node.loop=!0,await g.resume(),this.ka=!0)},async stop(){this.node&&(this.node.stop(),this.node.disconnect(),this.node=null,this.ka=!1)}};var I,b=zzfxM=(i,s,h,t=125)=>{let a,n,r,o,l,c,d,p,g,u,f,x,w,m,y=0,v=[],E=[],O=[],S=0,M=0,A=1,T={},I=44100/t*60>>2;for(;A;S++)v=[A=p=x=0],h.map((t,e)=>{for(d=s[t][S]||[0,0,0],A|=!!s[t][S],m=x+(s[t][0].length-2-!p)*I,w=e==h.length-1,n=2,o=x;n<d.length+w;p=++n){for(l=d[n],g=n==d.length+w-1&&w||u!=(d[0]||0)|l|0,r=0;r<I&&p;r++>I-99&&g&&(f+=(f<1)/99))c=(1-f)*v[y++]/2||0,E[o]=(E[o]||0)-c*M+c,O[o]=(O[o++]||0)+c*M+c;l&&(f=l%1,M=d[1]||0,l|=0)&&(v=T[[u=d[y=0]||0,l]]=T[[u,l]]||((a=[...i[u]])[2]*=2**((l-12)/12),0<l?R(...a):[]))}x=m});return[E,O]},ht=[[[,0,77,,,.7,2,.41,,,,,,,,.06],[,0,43,.01,,.3,2,,,,,,,,,.02,.01],[,0,170,.003,,.008,,.97,-35,53,,,,,,.1],[.8,0,270,,,.12,3,1.65,-2,,,,,4.5,,.02],[,0,86,,,,,.7,,,,.5,,6.7,1,.05],[,0,41,,.05,.4,2,0,,,9,.01,,,,.08,.02],[,0,2200,,,.04,3,2,,,800,.02,,4.8,,.01,.1],[.3,0,16,,,.3,3]],[[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33],[3,1,22,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,24,,,,,,,,,,,,,,,,,,,,,,,,22,,22,,22,,,,],[5,-1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],[,1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,]],[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33],[3,1,24,,,,,,,,27,,,,,,,,,,,,,,,,27,,,,24,,,,24,,,,,,,,27,,,,,,,,,,,,,,,,24,,24,,24,,,,],[5,-1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],[,1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],[6,1,,,34,34,34,,,,,,34,34,,,,,34,,,,34,34,,,,,34,,,,34,,,,34,34,34,,,,,,34,,,,,,34,34,,,34,34,,,,,,,,,34,34],[4,1,,,,,,,24,,,,,,24,,24,,,,24,,,,24,,,,,,,,,,,,,,,,24,,,,,,24,,24,,,,24,,,,24,,,,,,,,,,]],[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,23,23,35,23,23,36,23,23,35,23,23,36,23,23,35,35,23,23,35,23,23,35,23,23,36,23,23,35,23,23,36,36],[5,-1,21,,,19,,,21,,,,,,,,,,21,,,19,,,17,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[3,1,24,,,24,,,24,,,,,,,,,,24,,,24,,,24,,,,24.75,24.5,24.26,24.01,24.01,24.01,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25],[4,-1,,,,,,,,,,,,,,,,,,,,,,,,,,,24.75,24.5,24.26,24.01,24.01,24.01,24.01,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],[7,-1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,23,,21,23,,35,,23,,21,23,,35,,35,,23,,21,23,,35,,21,23,,35,,21,23,,,],[6,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34,36,34,,33,34,34,36,31,36,34,,31,34,32,,33,36,34,,31,34,34,36,33,36,33,,31,,,]],[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29],[4,1,24,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],[7,-1,21,,19,21,,33,,21,,19,21,,33,,33,,21,,19,21,,33,,21,,19,21,,33,,33,,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29],[2,1,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,,,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,,,],[6,1,,,36,,,,,,36,,36,,,,,,,,36,,,,,,36,,36,,,,,,,,36,,,,,,,,,,,,,,,,36,,,,,,36,,36,,,,,,],[3,1,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25,,,,,25,,,,,25,,,25,,,,,,,,25,,,,,,,,25,25,25,25]],[[1,-1,14,14,26,14,14,26,14,14,26,14,14,26,14,14,26,26,14,14,26,14,14,26,14,14,26,14,14,26,14,14,26,26,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29,19,19,31,19,19,31,19,19,31,19,19,31,19,19,31,31],[4,1,24,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,36,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],[7,-1,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,19,,19,19,31,19,19,31,19,,19,19,31,19,19,31],[2,1,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,,,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,,,],[3,1,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25],[6,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34,,,,,,34,,34,,,,,,,,34,,,,,,34,,34,,,,,,]]],[0,1,1,2,3,4,4]],at=[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26],nt=[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237],rt=[1.5,,261,.01,.02,.08,1,1.5,-.5,,,-.5,,,,,.9,.05],ot=[1.6,,291,.01,.21,.35,,2.2,,,-136,.09,.03,,,.2,.2,.7,.28],lt=[,,468,.05,.62,.7,,.3,,,300,.05,.02,,,,.32,,.6],ct=[.8,,112,.03,.1,.2,3,3.6,18,-9,,,,,,,.03,.83,.12],dt=[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17];I=document.getElementById("c").getContext("2d"),window.U=window.U||{},(u=window.U.context=I).imageSmoothingEnabled=!1,u.setTransform(1,0,0,1,0,0),(async()=>{{let t;for(t=0;t<26;t++)p["Key"+String.fromCharCode(t+65)]=String.fromCharCode(t+97);for(t=0;t<10;t++)p["Digit"+t]=p["Numpad"+t]=""+t;window.addEventListener("keydown",f),window.addEventListener("keyup",x)}await t("song1",b,ht),await t("explosion",R,at),await t("shoot",R,nt),await t("shoot2",R,ct),await t("typing",R,rt),await t("powerup",R,ot),await t("hit",R,dt),await t("transition",R,lt),await e("font.png"),await e("spritesheet.png"),await e("spritesheet16.png"),N("change-scene",(t,e)=>{var i;switch(i=["change-scene"],r=Object.keys(r).reduce((t,e)=>(i.includes(e)&&(t[e]=r[e]),t),{}),$.stop(),t){case"game":s=m();break;case"menu":s=y();break;case"game-over":console.log("game-over",e),s=function({L:t=0,Ja:e=localStorage.getItem("hiScore")||0}={}){F(["enter"],()=>{D("change-scene","menu")}),N("explosion",(e,i,s,h,a)=>{K(B.explosion);for(let t=0;t<s;t++)n.get({x:e,y:i,dx:L(-h/2,h/2),dy:L(-h/2,h/2),color:a,g:30*h})});const i=G(1),n=P({create:k,s:400}),s=z({x:128,y:32,text:"GAME OVER",align:"center",color:"red",v:2,I:4}),h=z({x:128,y:80,text:"YOUR SCORE:",color:"white",align:"center"}),a=z({x:128,y:96,text:""+t,color:"white",align:"center",v:2,I:2}),r=z({x:128,y:128,text:"NEW HIGH SCORE!",color:"yellow",align:"center"}),o=z({x:128,y:224,text:"ENTER TO CONTINUE",color:"lightgreen",align:"center"}),l=new Y({frame:0,children:[i,o,n]});return H(()=>{l.add(s),D("explosion",128,48,100,6,"red")},1e3),H(()=>{l.add(h)},2e3),H(()=>{l.add(a)},2500),e<t&&H(()=>{l.add(r),D("explosion",128,132,60,4,"yellow")},3e3),l}(e)}});let s=y();!function({update:t,o:e}){function i(){if(requestAnimationFrame(i),a=performance.now(),n=a-h,h=a,!(1e3<n)){for(s+=n;s>=1e3/60;)t(1/60),s-=1e3/60;r.clearRect(0,0,r.canvas.width,r.canvas.height),e()}}let s=0,h,a,n;const r=window.U.context;return{start(){h=performance.now(),requestAnimationFrame(i)}}}({update(t){s.update(t)},o(){s.o()}}).start()})()}();