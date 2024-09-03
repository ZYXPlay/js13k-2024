(function(){function N(){return window.ca.context}function ia(a){let {x:b=0,y:c=0,width:e,height:f}=a;b-=.5*e;c-=.5*f;0>e&&(b+=e,e*=-1);0>f&&(c+=f,f*=-1);return{x:b,y:c,width:e,height:f}}function wa({update:a,l:b}){function c(){requestAnimationFrame(c);n=performance.now();x=n-u;u=n;if(!(1E3<x)){for(e+=x;e>=f;)a(g),e-=f;p.clearRect(0,0,p.canvas.width,p.canvas.height);b()}}let e=0,f=1E3/60,g=1/60,u,n,x;const p=N();return{start(){u=performance.now();requestAnimationFrame(c)}}}function ja(a=()=>{},b){a.ka&&
b.preventDefault();a(b)}function xa(a){let b=S[a.code],c=Z[b];aa[b]=!0;ja(c,a)}function ya(a){let b=S[a.code],c=ba[b];aa[b]=!1;ja(c,a)}function T(a){return!![].concat(a).some(b=>aa[b])}function X(a,b,{oa:c="keydown",preventDefault:e=!0}={}){let f="keydown"==c?Z:ba;b.ka=e;[].concat(a).map(g=>f[g]=b)}function za(a,{oa:b="keydown"}={}){let c="keydown"==b?Z:ba;[].concat(a).map(e=>delete c[e])}function ka(a,b){return(new URL(a,b)).href}function la(a){window.ha||(window.ha={xa:ka,ua:K});return new Promise((b,
c)=>{let e,f;if(K[a])return b(K[a]);e=new Image;e.onload=()=>{f=ka(a,window.location.href);K[f]=K[a]=e;b(e)};e.onerror=()=>{c()};e.src=a})}function L({name:a="",x:b=-100,y:c=-100,dx:e=0,dy:f=0,K:g=0,v:u=0,width:n=10,height:x=10,F:p=1,G:z=1,rotation:B=0,anchor:l={x:.5,y:.5},g:E=Infinity,color:r="white",P:M,update:C,l:y,m:G,image:h}={}){const m={P(d={}){Object.assign(this,d);this.ea&&this.ea()},advance(){this.x+=this.dx;this.y+=this.dy;this.dx+=this.K;this.dy+=this.v},O(){this.advance();this.frame++;
this.g--},update(){this.N?this.N():this.O()},la(){const d=this.context;d.translate(this.x,this.y);this.rotation&&d.rotate(this.rotation);this.F&&this.G&&d.scale(this.F,this.G);d.translate(-this.width*l.x,-this.width*l.y);this.m()},l(){const d=this.context;d.save();this.M?(d.translate(this.x,this.y),this.M()):(this.la(),d.restore())},ja(){const d=this.context;if(this.U)return this.U();d.fillStyle=this.color||"white";d.fillRect(0,0,this.width,this.height)},m(){this.U?this.U():this.ja()},R(){return 0<
this.g},...arguments[0]};m.P({name:a,x:b,y:c,dx:e,dy:f,K:g,v:u,width:n,height:x,F:p,G:z,rotation:B,anchor:l,g:E,color:r,frame:0,context:N(),ea:M,N:C,M:y,U:G,image:h});return m}function U(a,b){Q[a]=Q[a]||[];Q[a].push(b)}function Aa(a=[]){Q=Object.keys(Q).reduce((b,c)=>{a.includes(c)&&(b[c]=Q[c]);return b},{})}function w(a,...b){(Q[a]||[]).map(c=>c(...b))}function Ba(a){const b=[null,null,null,"purple","red","cyan","green","yellow","pink","orange"];return L({name:"enemy",x:-80,y:-80,image:K["spritesheet.png"],
s:4,W:0,j:0,frame:0,F:.1,G:.1,i:2,o:!0,D:!1,...a,X(c){this.i-=c;this.j=1;0>=this.i&&!this.D&&this.u();O(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17])},u(){this.fa.ba++;this.D=this.o=!0;this.g=10},update(){var c=this.path.getPointAtLength(this.frame);const e=this.path.getPointAtLength(this.frame+1);this.x=Math.floor(c.x);this.y=Math.floor(c.y);4<this.j&&(this.j=0);this.rotate&&(this.rotation=90*Math.PI/180+Math.atan2(e.y-c.y,e.x-c.x));!this.rotate&&(this.rotation=180*Math.PI/180);this.frame>=
this.path.getTotalLength()&&(this.frame=0,!this.loop&&(this.fa.ba++,this.g=0));c=Math.min(Math.max(0,this.frame/50),1);50>this.frame&&(c=this.frame/50);this.frame>this.path.getTotalLength()-50&&(c=(this.path.getTotalLength()-this.frame)/50);50==this.frame&&(this.o=!1);this.F=this.G=c;.995<Math.random()&&w("enemy-fire",this,this.rotate?1:0);0<this.j&&this.j++;this.W++;this.O();0>=this.g&&this.D&&w("explosion",this.x,this.y,20,5,b[this.s])},m(){const c=this.context;1<this.frame&&c.drawImage(this.image,
8*this.s,0,8,8,0,0,8,8);this.j&&(c.globalCompositeOperation="source-atop",c.fillStyle="white",c.fillRect(0,0,8,8),c.globalCompositeOperation="source-over")}})}function ma(a,b){switch(a){case 1:return na(oa,b);default:return na(oa,b)}}function Ca(a){const [b,c,e,f]=a;return{frame:b,sa:c,pause:e,wa:f}}function Da(a){const [b,c,e,f,g]=a;return{frame:b,x:c,speed:e,type:f,value:g}}function na(a,b){const c=[];a.forEach(e=>{const [f,g,u,n,x,p,z,B,l,E,r]=e;e=c.push;var M=x+Math.floor(b/4);const C=document.createElementNS("http://www.w3.org/2000/svg",
"svg"),y=document.createElementNS("http://www.w3.org/2000/svg","path");C.appendChild(y);y.setAttribute("d",l);y.setAttribute("fill","none");y.setAttribute("stroke","black");y.setAttribute("stroke-width","2");y.setAttribute("id","path");e.call(c,{frame:f,va:g,s:u,rotate:n,total:M,interval:5<p-b?p-b:5,loop:z,mode:B,path:y,ta:E.map(Ca),pa:r.map(Da),count:0,V:!1,ba:0})});return{ga:c}}function R({create:a,B:b=10}){return{h:[a({x:-100,y:-100})],B:b,size:0,ia:a,get(c={}){if(this.size==this.h.length){if(this.size==
this.B)return;for(var e=0;e<this.size&&this.h.length<this.B;e++)this.h.push(this.ia())}e=this.h[this.size];this.size++;e.P(c);return e},update(){let c,e=!1;for(let f=this.size;f--;)c=this.h[f],c.update(),c.R()||(e=!0,this.size--);e&&this.h.sort((f,g)=>g.R()-f.R())},l(){for(let c=this.size;c--;)this.h[c].l()},L(){return this.h.slice(0,this.size)}}}function ca({h:a=[],update:b,l:c}){const e={...arguments[0],P(f={}){Object.assign(this,f)},update(){this.N&&this.N();this.h.forEach(f=>f.update())},l(){this.M&&
this.M();this.h.forEach(f=>f.l())}};e.P({h:a,context:N(),N:b,M:c});return e}function Ea(){const a=N();return L({name:"ship",x:a.canvas.width/2,y:a.canvas.height+16,image:K["spritesheet.png"],s:1,W:0,A:0,j:0,o:!0,D:!1,$:!0,i:100,S:3,H:0,X(b){this.o||(this.i-=b,this.j=1,0>=this.i&&this.u(),O(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17]))},u(){this.D||(this.D=this.o=!0,this.S--,this.g=5,0>=this.S&&w("game-over"))},ra(){this.x=a.canvas.width/2;this.y=a.canvas.height+32;this.G=this.F=2;
this.i=100;this.A=0;this.o=!0;this.D=!1;this.$=!0;this.g=Infinity;this.dy=this.v=this.frame=0},na(){this.A++;3<this.A&&(this.A=3)},qa(){this.i=100},update(){this.v=this.K=0;this.dx*=.96;this.dy*=.96;this.s=1;T("arrowright")&&5>this.dx&&(this.K=.2,this.s=2);T("arrowleft")&&-5<this.dx&&(this.K=-.2,this.s=0);T("space")&&0===this.W%(15/(1<this.A?2:1))&&(0==this.A?w("ship-fire",this.x-1):1==this.A?(w("ship-fire",this.x-2,1),w("ship-fire",this.x+2,1)):2==this.A?(w("ship-fire",this.x-3,1),setTimeout(()=>
w("ship-fire",this.x-1,2),200),w("ship-fire",this.x+3,1)):3==this.A&&(w("ship-fire",this.x-2,1),setTimeout(()=>w("ship-fire",this.x+2,1),300),setTimeout(()=>w("ship-fire",this.x-4,2),200),setTimeout(()=>w("ship-fire",this.x+4,2),100)));this.$||(T("arrowdown")&&5>this.dy&&(this.v=.2),T("arrowup")&&-5<this.dy&&(this.v=-.2));100>this.frame&&(this.v=-.03,this.F=this.G=2-this.frame/100);0>=this.S&&(this.K=0,this.v=0,this.dx=0,this.dy=0);4<this.j&&(this.j=0);this.O();this.x>a.canvas.width&&(this.x=a.canvas.width);
0>this.x&&(this.x=0);0<this.S&&!this.$&&this.y>a.canvas.height&&(this.y=a.canvas.height);0>this.y&&(this.y=0);0>=this.i&&this.u();0>=this.g&&(w("explosion",this.x,this.y,30,6,"white"),this.ra());100==this.frame&&(this.o=!1,this.$=!1);this.W++;0<this.j&&this.j++},m(){const b=this.context;b.drawImage(this.image,8*this.s,0,8,8,0,0,8,8);100>this.frame&&this.o&&10>this.frame%20&&(b.globalCompositeOperation="source-atop",b.fillStyle="white",b.fillRect(0,0,8,8),b.globalCompositeOperation="source-over");
this.j&&(b.globalCompositeOperation="source-atop",b.fillStyle="white",b.fillRect(0,0,8,8),b.globalCompositeOperation="source-over");let c=1;0>this.v&&(c=5>this.frame%10?2:3);b.fillStyle="#FFaa33";b.fillRect(3,7,2,c);b.fillStyle="#FF6633";b.fillRect(5>this.frame%10?3:4,7+c,1,c)}})}function F({x:a=0,y:b=0,text:c="",color:e="white",align:f="left",lineHeight:g=8,scale:u=1}){const n=N(),x=8*c.split("\n").reduce((p,z)=>p.length>z.length?p:z).length;return L({x:a,y:b,width:x,height:8,anchor:{x:0,y:0},text:c,
F:u,G:u,m(){const p=K["font.png"],z=this.text.split("\n");n.save();z.forEach(B=>{n.save();"center"===f&&n.translate(8*-B.length/2,0);"right"===f&&n.translate(8*-B.length,0);for(let E=0;E<B.length;E++){var l=B.charCodeAt(E);let r=0;65<=l&&90>=l?r=l-65:null;48<=l&&57>=l?r=l-22:null;32===l&&(r=-1);46===l&&(r=36);44===l&&(r=37);63===l&&(r=38);33===l&&(r=39);58===l&&(r=40);64===l&&(r=41);-1!==r&&(l=8*E,n.drawImage(p,8*r,0,8,8,l,0,8,8),n.globalCompositeOperation="source-atop",n.fillStyle=e||"white",n.fillRect(l,
0,8,8),n.globalCompositeOperation="source-over")}n.restore();n.translate(0,g)});n.restore()}})}function pa(a,b){let c=[],e=b.x+b.width/2;var f=b.y+b.height/2;b=a.y<f;f=a.y+a.height>=f;a.x<e&&(b&&c.push(0),f&&c.push(2));a.x+a.width>=e&&(b&&c.push(1),f&&c.push(3));return c}function da(){function a(e){const f=2*Math.random()+.1,g=96*f;c.get({id:"star",x:Math.random()*b.canvas.width,y:e,dx:0,dy:f,width:1,height:1,g:240/f,update(){this.advance();this.y>b.canvas.height&&(this.g=0)},m(){const u=this.context;
u.fillStyle=`rgb(${g}, ${g}, ${g})`;u.fillRect(0,0,this.width,this.height)}})}const b=N(),c=R({create:L,B:300});for(let e=0;e<b.canvas.height;e+=2)a(e);return{update(){a(-1);c.update()},l(){c.l()}}}function Fa(){function a(h,m){const d=[["powerup-fire","green",5],["powerup-shield","yellow",18]];h.forEach(k=>{if(void 0!==k.frame&&m===k.frame){const t=d[k.type];B.get({name:t[0],x:k.x,y:-8,width:8,height:8,color:t[1],dy:k.speed,image:K["font.png"],value:k.value,g:300,u(){g.H+=this.value;0===k.type&&
O(...[1.6,,291,.01,.21,.35,,2.2,,,-136,.09,.03,,,.2,.2,.7,.28]);1===k.type&&O(...[.5,,375,.03,.07,.08,1,2.7,,,302,.05,.05,,,,,.93,.01,,607]);this.g=0},m(){const A=this.context;10>this.frame%20&&(A.fillStyle=this.color,A.fillRect(-3,-3,this.width+6,this.height+6),A.fillStyle="black",A.fillRect(-2,-2,this.width+4,this.height+4));A.fillStyle=this.color;A.fillRect(-1,-1,this.width+2,this.height+2);A.drawImage(this.image,8*t[2],0,8,8,0,0,8,8)}})}})}function b(h,m){h.ga.forEach(d=>{const k=m-d.frame,t=
d.frame+d.total*d.interval;m>=d.frame&&m<t&&d.count<d.total&&0===k%d.interval&&(d.V=!1,d.count+=1,p.get({x:-100,y:-100,path:d.path,rotate:d.rotate,loop:d.loop,g:Infinity,o:!0,D:!1,i:([5,6].includes(d.s)?4:2)*Math.floor(e/4),frame:0,s:d.s,fa:d}));a(d.pa,m);d.V||d.count!==d.total||d.ba!==d.total||(d.V=!0)})}function c(h,m){h.R()&&!h.o&&m.forEach(d=>{var k;if(k="enemy"!==h.name||"enemy"!==d.name)if(k=d.R()&&!h.o&&!d.o){k=ia(d);let t=ia(h);k=k.x<t.x+t.width&&k.x+k.width>t.x&&k.y<t.y+t.height&&k.y+k.height>
t.y}k&&(!d.name.includes("powerup-")&&d.u(),"ship"==h.name&&"enemy"==d.name?h.X(50):"ship"==h.name&&"powerup-fire"==d.name?(h.na(d.value),d.u()):"ship"==h.name&&"powerup-shield"==d.name?(h.qa(d.value),d.u()):"ship"==h.name&&h.X(10),"enemy"==h.name&&(h.X(1),g.H+=10))})}X(["esc"],()=>{w("change-scene","menu")});let e=1,f=1;const g=Ea(),u=da(),n=R({create:L,B:100}),x=R({create:L,B:100}),p=R({create:Ba,B:100}),z=R({create:L,B:300}),B=R({create:L,B:10}),l=F({x:8,y:8,text:"SCORE 0"}),E=F({x:224,y:8,text:"@@@",
color:"red"}),r=F({x:8,y:224,text:"",color:"yellow"}),M=F({x:128,y:120,text:`LEVEL ${e}`,color:"lightgreen",align:"center"}),C=L({x:192,y:8,width:24,height:8,anchor:{x:0,y:0},m(){const h=this.context,m=0<=g.i?g.i/5:0;h.strokeStyle="white";h.strokeRect(0,0,this.width,this.height);h.fillStyle="green";25>g.i&&(h.fillStyle="red");h.fillRect(2,2,m,this.height-4)}});U("ship-fire",(h,m=0)=>{n.get({name:"ship-bullet",x:h,y:g.y-4,dx:(1-2*Math.random())/(4-m),dy:-5,width:2,height:3,g:80,u(){this.g=0;this.y=
this.x=-100},m(){const d=this.context;d.fillStyle="white";d.fillRect(0,0,this.width,1);d.fillStyle="yellow";d.fillRect(0,1,this.width,1);d.fillStyle="red";d.fillRect(0,2,this.width,1)}});O(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237])});U("enemy-fire",({x:h,y:m},d=0)=>{const k=g.x-4-h,t=g.y-m,A=Math.hypot(k,t)/1;x.get({name:"enemy-bullet",x:h+4,y:m,dx:0==d?0:k/A,dy:0==d?1.5:t/A,width:2,height:2,g:400,u(){this.g=0;this.y=this.x=-100},m(){const D=this.context;D.fillStyle="red";D.fillRect(0,
0,this.width,this.width)}});O(...[.3,,222,.02,.04,.09,3,.3,11,10,,,,,15,,,.53,.17])});U("explosion",(h,m,d=50,k=3,t="white")=>{for(let A=0;A<d;A++){let D=360*Math.random(),P=k,v=Math.random()*P+P;z.get({name:"particle",x:h,y:m,dx:Math.cos(D*Math.PI/180)*v/10,dy:Math.sin(D*Math.PI/180)*v/10,width:1,height:1,g:30*P,color:t,update(){const q=256/30*P*(this.g/30);"white"==t&&(this.color=`rgb(${q},${q},${q})`);"red"==t&&(this.color=`rgb(${q},0,0)`);this.O()},m(){const q=this.context;q.fillStyle=this.color;
q.fillRect(0,0,this.width,this.height)}});z.get({name:"particle",x:h,y:m,dx:Math.cos(D*Math.PI/180)*v/20,dy:Math.sin(D*Math.PI/180)*v/20,width:2,height:2,g:10*P/2,update(){const q=256/(P/2)*(this.g/10);this.color=`rgb(${q},${q},${q})`;this.O()},m(){const q=this.context;q.fillStyle=this.color;q.beginPath();q.arc(0,0,2,0,2*Math.PI);q.fill()}})}O(...[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26])});U("game-over",()=>{setTimeout(()=>w("change-scene","game-over",{H:g.H}),2E3)});const y=new ea,G=new ea;
return ca({h:[u,g,B,n,x,p,z,l,E,C,r],level:ma(f,1),frame:0,update(){b(this.level,this.frame);M.update();y.clear();y.add(g,p.L(),x.L(),B.L());c(g,y.get(g));G.clear();p.L().forEach(m=>{G.add(m,n.L());c(m,G.get(m))});const h=this.level.ga.filter(m=>!m.V).length;0===h&&0===p.L().length&&(e++,f++,1<f&&(f=1),this.level=ma(f,e),this.frame=0,M.text=`LEVEL ${e}`,O(...[,,264,.07,.29,.06,1,3.7,,-30,-148,.07,.08,,,,,.76,.22,,-1240]));l.text=`SCORE ${g.H}`;E.text="@@@".slice(0,g.S);r.text=`${(this.frame+"").padStart(8,
"0")} ${(h+"").padStart(2,"0")}`;this.frame++},l(){100>this.frame&&M.l()}})}function qa(){X(["enter"],()=>{w("change-scene","game")});var a=localStorage.getItem("hiscore")||0;const b=da(),c=F({text:"MICRO SHOOTER",x:128,y:48,align:"center",scale:2,color:"red"}),e=F({text:"JS13K 2024 EDITION",x:128,y:96,align:"center"});a=F({text:`HIGH SCORE ${a}`,x:128,y:120,align:"center",color:"yellow"});const f=F({text:"PRESS ENTER TO START",x:128,y:144,align:"center",color:"lightgreen"}),g=F({text:"ARROWS TO MOVE\nSPACE TO SHOOT",
x:128,y:192,align:"center"});return ca({h:[b,c,e,a,f,g]})}function Ga(a){a=a.H;const b=localStorage.getItem("hiscore")||0;X(["enter"],()=>{w("change-scene","menu")});var c=da();const e=F({text:"GAME OVER",x:128,y:48,align:"center",scale:2,color:"red"}),f=F({text:`SCORE ${a}`,x:128,y:96,align:"center"}),g=F({text:"PRESS ENTER TO CONTINUE",x:128,y:144,align:"center",color:"lightgreen"});c=ca({h:[c,e,f,g]});a>b&&(localStorage.setItem("hiscore",a),a=F({text:`NEW HIGH SCORE ${a}`,x:128,y:120,align:"center",
color:"yellow"}),c.h.push(a));return c}function Ha(){const a=N();a.filter="url(#remove-alpha)"===a.filter?"none":"url(#remove-alpha)"}let Z={},ba={},aa={},S={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",ArrowDown:"arrowdown"},K={},Q={},fa=new AudioContext,O=(a=1,b=.05,c=220,e=0,f=0,g=.1,u=0,n=1,x=0,p=0,z=0,B=0,l=0,E=0,r=0,M=0,C=0,y=1,G=0,h=0,m=0)=>{let d=Math,k=2*d.PI,t=x*=500*k/44100/44100,A=c*=(1-b+2*b*d.random(b=[]))*k/44100,D=0,P=0,v=
0,q=1,Ia=0,Ja=0,H=0,I=0>m?-1:1;var J=k*I*m*2/44100,V=d.cos(J);let W=d.sin;var Y=W(J)/4;J=1+Y;let Ka=-2*V/J;Y=(1-Y)/J;let ra=(1+I*V)/2/J;V=-(I+V)/J;let sa=0,ta=0,ua=0,va=0;e=44100*e+9;G*=44100;f*=44100;g*=44100;C*=44100;p*=500*k/44100**3;r*=k/44100;z*=k/44100;B*=44100;l=44100*l|0;a*=.3;for(I=e+G+f+g+C|0;v<I;b[v++]=H*a)++Ja%(100*M|0)||(H=u?1<u?2<u?3<u?W(D**3):d.max(d.min(d.tan(D),1),-1):1-(2*D/k%2+2)%2:1-4*d.abs(d.round(D/k)-D/k):W(D),H=(l?1-h+h*W(k*v/l):1)*(0>H?-1:1)*d.abs(H)**n*(v<e?v/e:v<e+G?1-(v-
e)/G*(1-y):v<e+G+f?y:v<I-C?(I-v-C)/g*y:0),H=C?H/2+(C>v?0:(v<I-C?1:(I-v)/C)*b[v-C|0]/2/a):H,m?H=va=ra*sa+V*(sa=ta)+ra*(ta=H)-Y*ua-Ka*(ua=va):0),J=(c+=x+=p)*d.cos(r*P++),D+=J+J*E*W(v**5),q&&++q>B&&(c+=z,A+=z,q=0),!l||++Ia%l||(c=A,x=t,q=q||1);a=fa.createBuffer(1,I,44100);a.getChannelData(0).set(b);c=fa.createBufferSource();c.buffer=a;c.connect(fa.destination);c.start()};var oa=[[100,!1,4,!1,3,330,!1,0,"M1 1s162 189 172 199c11 10 30 35 59 24 29-12 9-54 0-65L120 37S99 11 71 15c-27 3-46 47-46 47S4 106 4 126s-3 67 11 77c15 10 55 41 79 9L247 1",
[[99,0,!0,"CAPTAIN;WE HAVE DETECTED;SOME ENEMY SCOUTS;A FULL WAVE IS IMINENT;    ;PROCEED WITH CAUTION;AND GOOD LUCK!".split(";")]],[[410,120,1,0,10],[730,200,1,1,10]]],[200,!0,5,!0,3,60,!1,0,"M113.696 117.212C128.254 117.212 156.71 108.752 154.725 91.832C152.74 74.9117 136.196 52.5529 113.696 52.5529C91.1957 52.5529 64.7252 64.0345 54.7988 79.7461C44.8723 95.4577 38.9165 134.737 54.7988 152.261C70.6811 169.786 80.6075 172.807 105.755 172.203C130.902 171.599 155.387 160.117 170.607 149.24C185.828 138.363 203.034 112.378 202.372 91.832C201.71 71.286 207.004 45.9058 189.798 28.3813C172.593 10.8567 149.431 -0.625112 98.4751 1.18777C47.5194 3.00065 40.9017 23.5468 30.3135 38.0498C19.7253 52.5529 2.51948 78.5374 1.19596 112.378C-0.127568 146.219 5.16655 173.412 19.7253 189.728C34.2841 206.044 72.0046 225.381 98.4751 225.985C124.946 226.59 177.887 208.461 194.431 194.562C210.975 180.663 232.813 157.7 238.107 128.09C243.401 98.4791 244.725 70.6818 232.813 52.5529C220.901 34.424 207.666 18.7631 165.313 10.9072C122.96 3.05134 87.8869 18.1082 70.6811 31.4026C53.4752 44.697 19.7253 83.3718 19.7253 112.378C19.7253 141.384 25.6812 165.556 54.7988 186.102C83.9163 206.648 148.107 193.353 167.96 180.663C187.813 167.973 214.284 149.24 218.916 117.212C223.548 85.1847 199.725 59.2001 173.916 46.5099C148.107 33.8198 105.755 33.2155 83.9163 46.5099C62.0781 59.8043 40.24 93.0406 56.7841 128.09C73.3281 163.139 99.1369 163.139 115.681 156.492C132.225 149.844 167.96 141.384 173.916 112.378C179.872 83.3718 177.887 66.4517 142.151 59.2001C106.416 51.9485 79.284 62.2217 79.284 93.6449C79.284 125.068 98.4751 117.212 98.4751 117.212",
[],[]],[400,!0,6,!0,3,200,!1,0,"M241 228V23c0-29-40-29-40 0v186c0 36-30 25-37 0S140 7 116 7 82 168 77 206c-5 37-38 29-38 0V33C39-11 1-7 1 33v195",[],[]],[600,!0,7,!1,3,20,!1,0,"M235 1H13c-14 0-11 9 0 9h214c17 0 17 10 0 10H13c-18 0-14 12 0 12h214c20 0 19 15 0 15H13c-16 0-16 13 0 13h244",[],[]]];class ea{constructor({Y:a=3,Z:b=25,C:c}={}){this.Y=a;this.Z=b;a=N().canvas;this.C=c||{x:0,y:0,width:a.width,height:a.height};this.T=!1;this.aa=0;this.J=[];this.I=[]}clear(){this.I.map(a=>{a.clear()});this.T=
!1;this.J.length=0}get(a){let b=new Set;for(;this.I.length&&this.T;)return pa(a,this.C).map(c=>{this.I[c].get(a).map(e=>b.add(e))}),Array.from(b);return this.J.filter(c=>c!==a)}add(...a){a.flat().map(b=>{this.T?this.da(b):(this.J.push(b),this.J.length>this.Z&&this.aa<this.Y&&(this.ma(),this.J.map(c=>this.da(c)),this.J.length=0))})}da(a){pa(a,this.C).map(b=>{this.I[b].add(a)})}ma(){var a;this.T=!0;if(!this.I.length){var b=this.C.width/2|0;var c=this.C.height/2|0;for(a=0;4>a;a++)this.I[a]=new ea({C:{x:this.C.x+
(1==a%2?b:0),y:this.C.y+(2<=a?c:0),width:b,height:c},Y:this.Y,Z:this.Z}),this.I[a].aa=this.aa+1}}}const ha=function(a){window.ca=window.ca||{};return window.ca.context=a}(document.getElementById("c").getContext("2d"));ha.imageSmoothingEnabled=!1;ha.setTransform(1,0,0,1,0,0);ha.filter="url(#remove-alpha)";(function(){let a;for(a=0;26>a;a++)S["Key"+String.fromCharCode(a+65)]=String.fromCharCode(a+97);for(a=0;10>a;a++)S["Digit"+a]=S["Numpad"+a]=""+a;window.addEventListener("keydown",xa);window.addEventListener("keyup",
ya)})();(async()=>{await la("font.png");await la("spritesheet.png");X("e",Ha);U("change-scene",(b,c)=>{za(["enter","esc"]);Aa(["change-scene"]);"game"===b&&(a=Fa());"menu"===b&&(a=qa());"game-over"===b&&(a=Ga(c))});let a=qa();wa({update(){a.update()},l(){a.l()}}).start()})()})();
