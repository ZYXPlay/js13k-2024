(function(){function O(){return window.oa.context}function la(a){let {x:c=0,y:b=0,width:d,height:f}=a;c-=.5*d;b-=.5*f;0>d&&(c+=d,d*=-1);0>f&&(b+=f,f*=-1);return{x:c,y:b,width:d,height:f}}function za({update:a,o:c}){function b(){requestAnimationFrame(b);k=performance.now();z=k-r;r=k;if(!(1E3<z)){for(d+=z;d>=f;)a(n),d-=f;w.clearRect(0,0,w.canvas.width,w.canvas.height);c()}}let d=0,f=1E3/60,n=1/60,r,k,z;const w=O();return{start(){r=performance.now();requestAnimationFrame(b)}}}function ma(a=()=>{},c){a.xa&&
c.preventDefault();a(c)}function Aa(a){let c=U[a.code],b=ba[c];ca[c]=!0;ma(b,a)}function Ba(a){let c=U[a.code],b=da[c];ca[c]=!1;ma(b,a)}function V(a){return!![].concat(a).some(c=>ca[c])}function Z(a,c,{Da:b="keydown",preventDefault:d=!0}={}){let f="keydown"==b?ba:da;c.xa=d;[].concat(a).map(n=>f[n]=c)}function Ca(a,{Da:c="keydown"}={}){let b="keydown"==c?ba:da;[].concat(a).map(d=>delete b[d])}function na(a,c){return(new URL(a,c)).href}function oa(a){window.ua||(window.ua={Ka:na,Ia:G});return new Promise((c,
b)=>{let d,f;if(G[a])return c(G[a]);d=new Image;d.onload=()=>{f=na(a,window.location.href);G[f]=G[a]=d;c(d)};d.onerror=()=>{b()};d.src=a})}function H({name:a="",x:c=-100,y:b=-100,dx:d=0,dy:f=0,O:n=0,A:r=0,width:k=10,height:z=10,G:w=1,H:A=1,rotation:C=0,anchor:m={x:.5,y:.5},g:D=Infinity,color:v="white",V:L,update:B,o:M,j:x,image:R}={}){const I={V(q={}){Object.assign(this,q);this.qa&&this.qa()},advance(){this.x+=this.dx;this.y+=this.dy;this.dx+=this.O;this.dy+=this.A},N(){this.advance();this.frame++;
this.g--},update(){this.U?this.U():this.N()},ya(){const q=this.context;q.translate(this.x,this.y);this.rotation&&q.rotate(this.rotation);this.G&&this.H&&q.scale(this.G,this.H);q.translate(-this.width*m.x,-this.width*m.y);this.j()},o(){const q=this.context;q.save();this.T?(q.translate(this.x,this.y),this.T()):(this.ya(),q.restore())},wa(){const q=this.context;if(this.Z)return this.Z();q.fillStyle=this.color||"white";q.fillRect(0,0,this.width,this.height)},j(){this.Z?this.Z():this.wa()},W(){return 0<
this.g},...arguments[0]};I.V({name:a,x:c,y:b,dx:d,dy:f,O:n,A:r,width:k,height:z,G:w,H:A,rotation:C,anchor:m,g:D,color:v,frame:0,context:O(),qa:L,U:B,T:M,Z:x,image:R});return I}function W(a,c){Q[a]=Q[a]||[];Q[a].push(c)}function Da(a=[]){Q=Object.keys(Q).reduce((c,b)=>{a.includes(b)&&(c[b]=Q[b]);return c},{})}function y(a,...c){(Q[a]||[]).map(b=>b(...c))}function Ea(a={}){const c=[null,null,null,"purple","red","cyan","green","yellow","pink","orange"];return H({name:"enemy",x:-80,y:-80,image:G["spritesheet.png"],
s:4,ba:0,l:0,frame:0,G:.1,H:.1,h:2,m:!0,B:!1,parent:a.parent,$:a.$||0,R:!1,ia:30,ja:40,...a,ca(b){this.h-=b;this.l=1;0>=this.h&&!this.B&&this.u();N(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17])},u(){this.L&&this.L.la++;this.parent&&this.parent.Aa++;this.B=this.m=!0;this.g=10},update(){var b=this.path.getPointAtLength(this.frame);const d=this.path.getPointAtLength(this.frame+1);this.x=Math.floor(b.x);this.y=Math.floor(b.y);this.parent&&(this.x=this.parent.x+Math.cos(this.frame/this.parent.ja+
this.$)*this.parent.ia,this.y=this.parent.y+Math.sin(this.frame/this.parent.ja+this.$)*this.parent.ia);4<this.l&&(this.l=0);this.rotate&&(this.rotation=90*Math.PI/180+Math.atan2(d.y-b.y,d.x-b.x));!this.rotate&&(this.rotation=180*Math.PI/180);this.frame>=this.path.getTotalLength()&&(this.frame=0,!this.loop&&(this.L&&this.L.la++,this.g=0));b=Math.min(Math.max(0,this.frame/50),1);50>this.frame&&(b=this.frame/50);this.frame>this.path.getTotalLength()-50&&(b=(this.path.getTotalLength()-this.frame)/50);
50==this.frame&&(this.m=!1);this.G=this.H=b;.995<Math.random()&&y("enemy-fire",this,this.rotate?1:0);0<this.l&&this.l++;this.ba++;this.N();0>=this.g&&this.B&&y("explosion",this.x,this.y,20,5,c[this.s])},j(){const b=this.context;1<this.frame&&b.drawImage(this.image,8*this.s,0,8,8,0,0,this.R?16:8,this.R?16:8);if(1<this.frame&&this.R){const d=20*this.h/this.ra;b.save();b.translate(this.width/2,this.height/2);b.rotate(-this.rotation);b.fillStyle="white";b.fillRect(-12,-16,24,6);b.fillStyle="black";b.fillRect(-11,
-15,22,4);b.fillStyle="green";this.h<this.ra/4&&(b.fillStyle="red");b.fillRect(-10,-14,d,2);b.restore()}this.l&&(b.globalCompositeOperation="source-atop",b.fillStyle="white",b.fillRect(0,0,8,8),b.globalCompositeOperation="source-over")}})}function pa(a,c){switch(a){case 1:return ea(qa,c);case 2:return ea(Fa,c);default:return ea(qa,c)}}function Ga(a){const [c,b,d,f]=a;return{frame:c,Ha:b,pause:d,v:f}}function Ha(a){const [c,b,d,f,n]=a;return{frame:c,x:b,speed:d,type:f,value:n}}function ea(a,c){const b=
[];a.forEach(d=>{const [f,n,r,k,z,w,A,C,m,D,v,L=[]]=d;d=b.push;var B=0<L.length?z:z+Math.floor(c/4);const M=document.createElementNS("http://www.w3.org/2000/svg","svg"),x=document.createElementNS("http://www.w3.org/2000/svg","path");M.appendChild(x);x.setAttribute("d",m);x.setAttribute("fill","none");x.setAttribute("stroke","black");x.setAttribute("stroke-width","2");x.setAttribute("id","path");d.call(b,{frame:f,Ja:n,s:r,rotate:k,total:B,interval:w,loop:A,mode:C,path:x,Ba:D.map(Ga),Ea:v.map(Ha),count:0,
aa:!1,la:0,children:L})});return{ta:b}}function S({create:a,D:c=10}){return{i:[a({x:-100,y:-100})],D:c,size:0,va:a,get(b={}){if(this.size==this.i.length){if(this.size==this.D)return;for(var d=0;d<this.size&&this.i.length<this.D;d++)this.i.push(this.va())}d=this.i[this.size];this.size++;d.V(b);return d},update(){let b,d=!1;for(let f=this.size;f--;)b=this.i[f],b.update(),b.W()||(d=!0,this.size--);d&&this.i.sort((f,n)=>n.W()-f.W())},o(){for(let b=this.size;b--;)this.i[b].o()},P(){return this.i.slice(0,
this.size)}}}function fa({i:a=[],update:c,o:b}){const d={...arguments[0],V(f={}){Object.assign(this,f)},update(){this.U?this.U():this.i.forEach(f=>f.update())},o(){this.T&&this.T();this.i.forEach(f=>f.o())}};d.V({i:a,context:O(),U:c,T:b});return d}function Ia(){const a=O();return H({name:"ship",x:a.canvas.width/2,y:a.canvas.height+16,image:G["spritesheet.png"],s:1,ba:0,C:0,l:0,m:!0,B:!1,fa:!0,h:100,X:3,I:0,ca(c){this.m||(this.h-=c,this.l=1,0>=this.h&&this.u(),N(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,
.4,2,.5,.13,.89,.05,.17]))},u(){this.B||(this.B=this.m=!0,this.X--,this.g=5,0>=this.X&&y("game-over"))},Ga(){this.x=a.canvas.width/2;this.y=a.canvas.height+32;this.H=this.G=2;this.h=100;this.C=0;this.m=!0;this.B=!1;this.fa=!0;this.g=Infinity;this.dy=this.A=this.frame=0},Ca(){this.C++;3<this.C&&(this.C=3)},Fa(){this.h=100},update(){this.A=this.O=0;this.dx*=.96;this.dy*=.96;this.s=1;V("arrowright")&&5>this.dx&&(this.O=.2,this.s=2);V("arrowleft")&&-5<this.dx&&(this.O=-.2,this.s=0);V("space")&&0===this.ba%
(15/(1<this.C?2:1))&&(0==this.C?y("ship-fire",this.x-1):1==this.C?(y("ship-fire",this.x-2,1),y("ship-fire",this.x+2,1)):2==this.C?(y("ship-fire",this.x-3,1),setTimeout(()=>y("ship-fire",this.x-1,2),200),y("ship-fire",this.x+3,1)):3==this.C&&(y("ship-fire",this.x-2,1),setTimeout(()=>y("ship-fire",this.x+2,1),300),setTimeout(()=>y("ship-fire",this.x-4,2),200),setTimeout(()=>y("ship-fire",this.x+4,2),100)));this.fa||(V("arrowdown")&&5>this.dy&&(this.A=.2),V("arrowup")&&-5<this.dy&&(this.A=-.2));100>
this.frame&&(this.A=-.03,this.G=this.H=2-this.frame/100);0>=this.X&&(this.O=0,this.A=0,this.dx=0,this.dy=0);4<this.l&&(this.l=0);this.N();this.x>a.canvas.width&&(this.x=a.canvas.width);0>this.x&&(this.x=0);0<this.X&&!this.fa&&this.y>a.canvas.height&&(this.y=a.canvas.height);0>this.y&&(this.y=0);0>=this.h&&this.u();0>=this.g&&(y("explosion",this.x,this.y,30,6,"white"),this.Ga());100==this.frame&&(this.m=!1,this.fa=!1);this.ba++;0<this.l&&this.l++},j(){const c=this.context;c.drawImage(this.image,8*
this.s,0,8,8,0,0,8,8);100>this.frame&&this.m&&10>this.frame%20&&(c.globalCompositeOperation="source-atop",c.fillStyle="white",c.fillRect(0,0,8,8),c.globalCompositeOperation="source-over");this.l&&(c.globalCompositeOperation="source-atop",c.fillStyle="white",c.fillRect(0,0,8,8),c.globalCompositeOperation="source-over");let b=1;0>this.A&&(b=5>this.frame%10?2:3);c.fillStyle="#FFaa33";c.fillRect(3,7,2,b);c.fillStyle="#FF6633";c.fillRect(5>this.frame%10?3:4,7+b,1,b)}})}function E({x:a=0,y:c=0,text:b="",
color:d="white",align:f="left",lineHeight:n=8,scale:r=1}){const k=O(),z=8*b.split("\n").reduce((w,A)=>w.length>A.length?w:A).length;return H({x:a,y:c,width:z,height:8,anchor:{x:0,y:0},text:b,G:r,H:r,j(){const w=G["font.png"],A=this.text.split("\n");k.save();A.forEach(C=>{k.save();"center"===f&&k.translate(8*-C.length/2,0);"right"===f&&k.translate(8*-C.length,0);for(let D=0;D<C.length;D++){var m=C.charCodeAt(D);let v=0;65<=m&&90>=m?v=m-65:null;48<=m&&57>=m?v=m-22:null;32===m&&(v=-1);46===m&&(v=36);
44===m&&(v=37);63===m&&(v=38);33===m&&(v=39);58===m&&(v=40);64===m&&(v=41);-1!==v&&(m=8*D,k.drawImage(w,8*v,0,8,8,m,0,8,8),k.globalCompositeOperation="source-atop",k.fillStyle=d||"white",k.fillRect(m,0,8,8),k.globalCompositeOperation="source-over")}k.restore();k.translate(0,n)});k.restore()}})}function ra(a,c){let b=[],d=c.x+c.width/2;var f=c.y+c.height/2;c=a.y<f;f=a.y+a.height>=f;a.x<d&&(c&&b.push(0),f&&b.push(2));a.x+a.width>=d&&(c&&b.push(1),f&&b.push(3));return b}function ha(){function a(d){const f=
2*Math.random()+.1,n=96*f;b.get({id:"star",x:Math.random()*c.canvas.width,y:d,dx:0,dy:f,width:1,height:1,g:240/f,update(){this.advance();this.y>c.canvas.height&&(this.g=0)},j(){const r=this.context;r.fillStyle=`rgb(${n}, ${n}, ${n})`;r.fillRect(0,0,this.width,this.height)}})}const c=O(),b=S({create:H,D:300});for(let d=0;d<c.canvas.height;d+=2)a(d);return{update(){a(-1);b.update()},o(){b.o()}}}function sa(){const a=window.speechSynthesis,c=a.getVoices().filter(b=>"Grandpa (English (UK))"===b.name)[0];
return H({name:"dialog",x:8,y:248,image:G["spritesheet.png"],sa:[10,11,12,13,14],text:E({text:"",x:16,y:8,align:"left"}),K:0,v:[],S:0,ga:0,frame:0,anchor:{x:0,y:0},na:!1,ka:!1,ma:!1,start(b){this.ma=!1;setTimeout(()=>{this.ka=!0;this.v=["",...b.v];this.frame=0},1E3);this.dy=-2},stop(){this.ma=!0;this.text.text="        ";this.ka=!1;setTimeout(()=>{this.v=[];this.frame=this.K=this.S=0},1E3);this.dy=2},update(){224>this.y&&(this.dy=0,this.y=224);248<this.y&&(this.dy=0,this.y=248);if(0!=this.v.length){this.na=
!1;var b=this.v[this.S]+"      ";" "!==b[this.K]&&(this.na=!0);0==this.frame%5&&(this.K++," "!==b[this.K]&&N(...[1.5,,261,.01,.02,.08,1,1.5,-.5,,,-.5,,,,,.9,.05]));this.text.text=b.slice(0,this.K);this.frame++;this.K>=b.length&&(this.S++,this.K=this.frame=0,this.S<this.v.length&&(b=new SpeechSynthesisUtterance(this.v[this.S]),b.lang="en-US",b.pitch=1.2,b.rate=.8,b.volume=1,b.voice=c,a.speak(b)));this.S>=this.v.length&&!this.ma&&this.stop();this.na&&0==this.frame%5&&this.ga++;this.ga>=this.sa.length&&
(this.ga=0);this.N()}},j(){const b=this.context,d=this.image;b.fillStyle="white";b.fillRect(-2,-2,12,12);b.drawImage(d,8*this.sa[this.ga],0,8,8,0,0,8,8);b.translate(16,0);this.text.j()}})}function Ja(){function a(g,h){0!==g.length&&(h.Aa=0,h.ia=30,h.ja=100,h.R=!0,h.width=16,h.height=16,h.h=20,h.ra=20,g.forEach(l=>{for(let e=0;e<l[2];e++){const u=360/l[2]*e;m.get({s:l[0],rotate:l[1],g:Infinity,m:!0,B:!1,h:([5,6].includes(h.L.s)?4:2)*Math.floor(n/4),frame:0,R:!1,parent:h,loop:h.loop,path:h.path,$:u*
Math.PI/180,L:h.L})}}))}function c(g,h){g.forEach(l=>{void 0!==h&&h===l.frame&&w.start(l)})}function b(g,h){const l=[["powerup-fire","green",5],["powerup-shield","yellow",18]];g.forEach(e=>{if(void 0!==e.frame&&h===e.frame){const u=l[e.type];v.get({name:u[0],x:e.x,y:-8,width:8,height:8,color:u[1],dy:e.speed,image:G["font.png"],value:e.value,g:300,u(){k.I+=this.value;0===e.type&&N(...[1.6,,291,.01,.21,.35,,2.2,,,-136,.09,.03,,,.2,.2,.7,.28]);1===e.type&&N(...[.5,,375,.03,.07,.08,1,2.7,,,302,.05,.05,
,,,,.93,.01,,607]);this.g=0},j(){const p=this.context;10>this.frame%20&&(p.fillStyle=this.color,p.fillRect(-3,-3,this.width+6,this.height+6),p.fillStyle="black",p.fillRect(-2,-2,this.width+4,this.height+4));p.fillStyle=this.color;p.fillRect(-1,-1,this.width+2,this.height+2);p.drawImage(this.image,8*u[2],0,8,8,0,0,8,8)}})}})}function d(g,h,l=!0){g.ta.forEach(e=>{var u=h-e.frame;const p=e.frame+e.total*e.interval;h>=e.frame&&h<p&&e.count<e.total&&0===u%e.interval&&(e.aa=!1,e.count+=1,u=m.get({x:-100,
y:-100,path:e.path,rotate:e.rotate,loop:e.loop,g:Infinity,m:!0,B:!1,h:([5,6].includes(e.s)?4:2)*Math.floor(n/4),frame:0,s:e.s,parent:null,R:!1,L:e}),a(e.children||[],u));b(e.Ea,h);l&&c(e.Ba,h);e.aa||e.count!==e.total||e.la!==e.total||(e.aa=!0)})}function f(g,h){g.W()&&!g.m&&h.forEach(l=>{var e;if(e="enemy"!==g.name||"enemy"!==l.name)if(e=l.W()&&!g.m&&!l.m){e=la(l);let u=la(g);e=e.x<u.x+u.width&&e.x+e.width>u.x&&e.y<u.y+u.height&&e.y+e.height>u.y}e&&(!l.name.includes("powerup-")&&l.u(),"ship"==g.name&&
"enemy"==l.name?g.ca(50):"ship"==g.name&&"powerup-fire"==l.name?(g.Ca(l.value),l.u()):"ship"==g.name&&"powerup-shield"==l.name?(g.Fa(l.value),l.u()):"ship"==g.name&&g.ca(10),"enemy"==g.name&&(g.ca(1),k.I+=10))})}Z(["esc"],()=>{y("change-scene","menu")});let n=1,r=1;const k=Ia(),z=ha(),w=sa({x:8,y:224}),A=S({create:H,D:100}),C=S({create:H,D:100}),m=S({create:Ea,D:100}),D=S({create:H,D:300}),v=S({create:H,D:10}),L=E({x:8,y:8,text:"SCORE 0"}),B=E({x:224,y:8,text:"@@@",color:"red"}),M=E({x:8,y:224,text:"",
color:"yellow"}),x=E({x:128,y:120,text:`LEVEL ${n}`,color:"lightgreen",align:"center"}),R=H({x:192,y:8,width:24,height:8,anchor:{x:0,y:0},j(){const g=this.context,h=0<=k.h?k.h/5:0;g.strokeStyle="white";g.strokeRect(0,0,this.width,this.height);g.fillStyle="green";25>k.h&&(g.fillStyle="red");g.fillRect(2,2,h,this.height-4)}});W("ship-fire",(g,h=0)=>{A.get({name:"ship-bullet",x:g,y:k.y-4,dx:(1-2*Math.random())/(4-h),dy:-5,width:2,height:3,g:80,u(){this.g=0;this.y=this.x=-100},j(){const l=this.context;
l.fillStyle="white";l.fillRect(0,0,this.width,1);l.fillStyle="yellow";l.fillRect(0,1,this.width,1);l.fillStyle="red";l.fillRect(0,2,this.width,1)}});N(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237])});W("enemy-fire",({x:g,y:h},l=0)=>{const e=k.x-4-g,u=k.y-h,p=Math.hypot(e,u)/1;C.get({name:"enemy-bullet",x:g+4,y:h,dx:0==l?0:e/p,dy:0==l?1.5:u/p,width:2,height:2,g:400,u(){this.g=0;this.y=this.x=-100},j(){const F=this.context;F.fillStyle="red";F.fillRect(0,0,this.width,this.width)}});N(...[.3,
,222,.02,.04,.09,3,.3,11,10,,,,,15,,,.53,.17])});W("explosion",(g,h,l=50,e=3,u="white")=>{for(let p=0;p<l;p++){let F=360*Math.random(),P=e,T=Math.random()*P+P;D.get({name:"particle",x:g,y:h,dx:Math.cos(F*Math.PI/180)*T/10,dy:Math.sin(F*Math.PI/180)*T/10,width:1,height:1,g:30*P,color:u,update(){const t=256/30*P*(this.g/30);"white"==u&&(this.color=`rgb(${t},${t},${t})`);"red"==u&&(this.color=`rgb(${t},0,0)`);this.N()},j(){const t=this.context;t.fillStyle=this.color;t.fillRect(0,0,this.width,this.height)}});
D.get({name:"particle",x:g,y:h,dx:Math.cos(F*Math.PI/180)*T/20,dy:Math.sin(F*Math.PI/180)*T/20,width:2,height:2,g:10*P/2,update(){const t=256/(P/2)*(this.g/10);this.color=`rgb(${t},${t},${t})`;this.N()},j(){const t=this.context;t.fillStyle=this.color;t.beginPath();t.arc(0,0,2,0,2*Math.PI);t.fill()}})}N(...[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26])});W("game-over",()=>{setTimeout(()=>y("change-scene","game-over",{I:k.I}),2E3)});const I=new ia,q=new ia;return fa({i:[z,k,v,A,C,m,D,L,B,R,w],level:pa(r,
1),frame:0,update(){if(w.ka)w.update();else{d(this.level,this.frame,n==r);x.update();I.clear();I.add(k,m.P(),C.P(),v.P());f(k,I.get(k));q.clear();m.P().forEach(h=>{q.add(h,A.P());f(h,q.get(h))});var g=this.level.ta.filter(h=>!h.aa).length;0===g&&0===m.P().length&&(n++,r++,2<r&&(r=1),this.level=pa(r,n),this.frame=0,x.text=`LEVEL ${n}`,N(...[,,264,.07,.29,.06,1,3.7,,-30,-148,.07,.08,,,,,.76,.22,,-1240]));L.text=`SCORE ${k.I}`;B.text="@@@".slice(0,k.X);M.text=`${(this.frame+"").padStart(8,"0")} ${(g+
"").padStart(2,"0")}`;this.frame++;this.i.forEach(h=>h.update())}},o(){100>this.frame&&x.o()}})}function ta(){Z(["enter"],()=>{y("change-scene","game")});var a=localStorage.getItem("hiscore")||0;const c=ha(),b=E({text:"MICRO SHOOTER",x:128,y:48,align:"center",scale:2,color:"red"}),d=E({text:"JS13K 2024 EDITION",x:128,y:96,align:"center"});a=E({text:`HIGH SCORE ${a}`,x:128,y:120,align:"center",color:"yellow"});const f=E({text:"PRESS ENTER TO START",x:128,y:144,align:"center",color:"lightgreen"}),n=
E({text:"ARROWS TO MOVE\nSPACE TO SHOOT",x:128,y:192,align:"center"});return fa({i:[c,b,d,a,f,n]})}function Ka(a){a=a.I;const c=localStorage.getItem("hiscore")||0;Z(["enter"],()=>{y("change-scene","menu")});var b=ha(),d=E({text:"GAME OVER",x:128,y:48,align:"center",scale:2,color:"red"});const f=E({text:`SCORE ${a}`,x:128,y:96,align:"center"}),n=E({text:"PRESS ENTER TO CONTINUE",x:128,y:144,align:"center",color:"lightgreen"}),r=sa({x:8,y:224});b=fa({i:[b,d,f,n,r]});d=["GOOD BYE CAPTAIN @        ",
"THE ENEMY HAS WON","BUT... HEY!     ","THIS IS JUST A GAME"];a>c?d.push("YOU HAVE A NEW HIGH SCORE!"):d.push("TRY TO BEAT YOUR HIGH SCORE!");r.start({v:d});a>c&&(localStorage.setItem("hiscore",a),a=E({text:`NEW HIGH SCORE ${a}`,x:128,y:120,align:"center",color:"yellow"}),b.i.push(a));return b}function La(){const a=O();a.filter="url(#remove-alpha)"===a.filter?"none":"url(#remove-alpha)"}let ba={},da={},ca={},U={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",
ArrowDown:"arrowdown"},G={},Q={},ja=new AudioContext,N=(a=1,c=.05,b=220,d=0,f=0,n=.1,r=0,k=1,z=0,w=0,A=0,C=0,m=0,D=0,v=0,L=0,B=0,M=1,x=0,R=0,I=0)=>{let q=Math,g=2*q.PI,h=z*=500*g/44100/44100,l=b*=(1-c+2*c*q.random(c=[]))*g/44100,e=0,u=0,p=0,F=1,P=0,T=0,t=0,J=0>I?-1:1;var K=g*J*I*2/44100,X=q.cos(K);let Y=q.sin;var aa=Y(K)/4;K=1+aa;let Ma=-2*X/K;aa=(1-aa)/K;let ua=(1+J*X)/2/K;X=-(J+X)/K;let va=0,wa=0,xa=0,ya=0;d=44100*d+9;x*=44100;f*=44100;n*=44100;B*=44100;w*=500*g/44100**3;v*=g/44100;A*=g/44100;C*=
44100;m=44100*m|0;a*=.3;for(J=d+x+f+n+B|0;p<J;c[p++]=t*a)++T%(100*L|0)||(t=r?1<r?2<r?3<r?Y(e**3):q.max(q.min(q.tan(e),1),-1):1-(2*e/g%2+2)%2:1-4*q.abs(q.round(e/g)-e/g):Y(e),t=(m?1-R+R*Y(g*p/m):1)*(0>t?-1:1)*q.abs(t)**k*(p<d?p/d:p<d+x?1-(p-d)/x*(1-M):p<d+x+f?M:p<J-B?(J-p-B)/n*M:0),t=B?t/2+(B>p?0:(p<J-B?1:(J-p)/B)*c[p-B|0]/2/a):t,I?t=ya=ua*va+X*(va=wa)+ua*(wa=t)-aa*xa-Ma*(xa=ya):0),K=(b+=z+=w)*q.cos(v*u++),e+=K+K*D*Y(p**5),F&&++F>C&&(b+=A,l+=A,F=0),!m||++P%m||(b=l,z=h,F=F||1);a=ja.createBuffer(1,J,
44100);a.getChannelData(0).set(c);b=ja.createBufferSource();b.buffer=a;b.connect(ja.destination);b.start()};var qa=[[100,!1,4,!1,2,330,!1,0,"M1 1s162 189 172 199c11 10 30 35 59 24 29-12 9-54 0-65L120 37S99 11 71 15c-27 3-46 47-46 47S4 106 4 126s-3 67 11 77c15 10 55 41 79 9L247 1",[[99,0,!0,"CAPTAIN;WE HAVE DETECTED;SOME ENEMY SCOUTS;A FULL WAVE IS IMINENT;    ;PROCEED WITH CAUTION;AND GOOD LUCK!".split(";")],[420,0,!0,["WE DEPLOYED SOME POWERUPS","","TO ENHANCE YOUR FIRE POWER","AND RECHARGE YOUR SHIELD"]]],
[[410,120,1,0,10],[730,200,1,1,10]]],[400,!0,5,!0,3,60,!1,0,"M113.696 117.212C128.254 117.212 156.71 108.752 154.725 91.832C152.74 74.9117 136.196 52.5529 113.696 52.5529C91.1957 52.5529 64.7252 64.0345 54.7988 79.7461C44.8723 95.4577 38.9165 134.737 54.7988 152.261C70.6811 169.786 80.6075 172.807 105.755 172.203C130.902 171.599 155.387 160.117 170.607 149.24C185.828 138.363 203.034 112.378 202.372 91.832C201.71 71.286 207.004 45.9058 189.798 28.3813C172.593 10.8567 149.431 -0.625112 98.4751 1.18777C47.5194 3.00065 40.9017 23.5468 30.3135 38.0498C19.7253 52.5529 2.51948 78.5374 1.19596 112.378C-0.127568 146.219 5.16655 173.412 19.7253 189.728C34.2841 206.044 72.0046 225.381 98.4751 225.985C124.946 226.59 177.887 208.461 194.431 194.562C210.975 180.663 232.813 157.7 238.107 128.09C243.401 98.4791 244.725 70.6818 232.813 52.5529C220.901 34.424 207.666 18.7631 165.313 10.9072C122.96 3.05134 87.8869 18.1082 70.6811 31.4026C53.4752 44.697 19.7253 83.3718 19.7253 112.378C19.7253 141.384 25.6812 165.556 54.7988 186.102C83.9163 206.648 148.107 193.353 167.96 180.663C187.813 167.973 214.284 149.24 218.916 117.212C223.548 85.1847 199.725 59.2001 173.916 46.5099C148.107 33.8198 105.755 33.2155 83.9163 46.5099C62.0781 59.8043 40.24 93.0406 56.7841 128.09C73.3281 163.139 99.1369 163.139 115.681 156.492C132.225 149.844 167.96 141.384 173.916 112.378C179.872 83.3718 177.887 66.4517 142.151 59.2001C106.416 51.9485 79.284 62.2217 79.284 93.6449C79.284 125.068 98.4751 117.212 98.4751 117.212",
[],[]],[600,!0,6,!0,3,200,!1,0,"M241 228V23c0-29-40-29-40 0v186c0 36-30 25-37 0S140 7 116 7 82 168 77 206c-5 37-38 29-38 0V33C39-11 1-7 1 33v195",[],[]],[800,!0,7,!1,3,20,!1,0,"M235 1H13c-14 0-11 9 0 9h214c17 0 17 10 0 10H13c-18 0-14 12 0 12h214c20 0 19 15 0 15H13c-16 0-16 13 0 13h244",[],[]]],Fa=[[200,!1,9,!0,1,50,!0,0,"M131 57s-56 130 0 129c57 0 99-32 69-67s-33-85-69-75-71 38-71 75c1 37 25 52 64 51 39 0 61-22 60-51-1-30-21-46-47-47-25-1-56 17-56 47 0 29 12 32 43 29s39-11 39-29-6-25-26-25-32 4-36 25c-3 20 9 18 23 11 13-7 17-11 17-11",
[[99,0,!0,["SOMETHING BIG IS COMING"]]],[[200,120,.5,0,10],[400,200,1,1,10]],[[8,!0,16]]]];class ia{constructor({da:a=3,ea:c=25,F:b}={}){this.da=a;this.ea=c;a=O().canvas;this.F=b||{x:0,y:0,width:a.width,height:a.height};this.Y=!1;this.ha=0;this.M=[];this.J=[]}clear(){this.J.map(a=>{a.clear()});this.Y=!1;this.M.length=0}get(a){let c=new Set;for(;this.J.length&&this.Y;)return ra(a,this.F).map(b=>{this.J[b].get(a).map(d=>c.add(d))}),Array.from(c);return this.M.filter(b=>b!==a)}add(...a){a.flat().map(c=>
{this.Y?this.pa(c):(this.M.push(c),this.M.length>this.ea&&this.ha<this.da&&(this.za(),this.M.map(b=>this.pa(b)),this.M.length=0))})}pa(a){ra(a,this.F).map(c=>{this.J[c].add(a)})}za(){var a;this.Y=!0;if(!this.J.length){var c=this.F.width/2|0;var b=this.F.height/2|0;for(a=0;4>a;a++)this.J[a]=new ia({F:{x:this.F.x+(1==a%2?c:0),y:this.F.y+(2<=a?b:0),width:c,height:b},da:this.da,ea:this.ea}),this.J[a].ha=this.ha+1}}}const ka=function(a){window.oa=window.oa||{};return window.oa.context=a}(document.getElementById("c").getContext("2d"));
ka.imageSmoothingEnabled=!1;ka.setTransform(1,0,0,1,0,0);ka.filter="url(#remove-alpha)";(function(){let a;for(a=0;26>a;a++)U["Key"+String.fromCharCode(a+65)]=String.fromCharCode(a+97);for(a=0;10>a;a++)U["Digit"+a]=U["Numpad"+a]=""+a;window.addEventListener("keydown",Aa);window.addEventListener("keyup",Ba)})();(async()=>{await oa("font.png");await oa("spritesheet.png");Z("e",La);W("change-scene",(c,b)=>{Ca(["enter","esc"]);Da(["change-scene"]);"game"===c&&(a=Ja());"menu"===c&&(a=ta());"game-over"===
c&&(a=Ka(b))});let a=ta();za({update(){a.update()},o(){a.o()}}).start()})()})();
