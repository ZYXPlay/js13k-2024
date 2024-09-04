(function(){function P(){return window.qa.context}function M(a){return a*Math.PI/180}function na(a){let {x:c=0,y:b=0,width:d,height:f}=a;c-=.5*d;b-=.5*f;0>d&&(c+=d,d*=-1);0>f&&(b+=f,f*=-1);return{x:c,y:b,width:d,height:f}}function Ba({update:a,s:c}){function b(){requestAnimationFrame(b);l=performance.now();B=l-q;q=l;if(!(1E3<B)){for(d+=B;d>=f;)a(n),d-=f;w.clearRect(0,0,w.canvas.width,w.canvas.height);c()}}let d=0,f=1E3/60,n=1/60,q,l,B;const w=P();return{start(){q=performance.now();requestAnimationFrame(b)}}}
function oa(a=()=>{},c){a.ya&&c.preventDefault();a(c)}function Ca(a){let c=V[a.code],b=ca[c];da[c]=!0;oa(b,a)}function Da(a){let c=V[a.code],b=ea[c];da[c]=!1;oa(b,a)}function W(a){return!![].concat(a).some(c=>da[c])}function X(a,c,{Ea:b="keydown",preventDefault:d=!0}={}){let f="keydown"==b?ca:ea;c.ya=d;[].concat(a).map(n=>f[n]=c)}function pa(a,{Ea:c="keydown"}={}){let b="keydown"==c?ca:ea;[].concat(a).map(d=>delete b[d])}function qa(a,c){return(new URL(a,c)).href}function fa(a){window.va||(window.va=
{Na:qa,La:G});return new Promise((c,b)=>{let d,f;if(G[a])return c(G[a]);d=new Image;d.onload=()=>{f=qa(a,window.location.href);G[f]=G[a]=d;c(d)};d.onerror=()=>{b()};d.src=a})}function H({name:a="",x:c=-100,y:b=-100,dx:d=0,dy:f=0,R:n=0,F:q=0,width:l=10,height:B=10,K:w=1,L:z=1,rotation:A=0,anchor:m={x:.5,y:.5},g:C=Infinity,color:v="white",X:Q,update:y,s:N,j:F,image:D}={}){const I={X(r={}){Object.assign(this,r);this.sa&&this.sa()},advance(){this.x+=this.dx;this.y+=this.dy;this.dx+=this.R;this.dy+=this.F},
D(){this.advance();this.frame++;this.g--},update(){this.W?this.W():this.D()},za(){const r=this.context;r.translate(this.x,this.y);this.rotation&&r.rotate(this.rotation);this.K&&this.L&&r.scale(this.K,this.L);r.translate(-this.width*m.x,-this.width*m.y);this.j()},s(){const r=this.context;r.save();this.V?(r.translate(this.x,this.y),this.V()):(this.za(),r.restore())},xa(){const r=this.context;if(this.aa)return this.aa();r.fillStyle=this.color||"white";r.fillRect(0,0,this.width,this.height)},j(){this.aa?
this.aa():this.xa()},Y(){return 0<this.g},...arguments[0]};I.X({name:a,x:c,y:b,dx:d,dy:f,R:n,F:q,width:l,height:B,K:w,L:z,rotation:A,anchor:m,g:C,color:v,frame:0,context:P(),sa:Q,W:y,V:N,aa:F,image:D});return I}function Y(a,c){S[a]=S[a]||[];S[a].push(c)}function Ea(a=[]){S=Object.keys(S).reduce((c,b)=>{a.includes(b)&&(c[b]=S[b]);return c},{})}function x(a,...c){(S[a]||[]).map(b=>b(...c))}function Fa(a={}){const c="pink orange white purple red cyan green yellow pink orange".split(" ");return H({name:"enemy",
x:-80,y:-80,image:G["spritesheet.png"],Fa:G["spritesheet16.png"],u:4,l:0,o:0,frame:0,K:.1,L:.1,h:2,na:2,m:!0,G:!1,parent:a.parent,ba:a.ba||0,v:!1,ja:30,ka:40,B:0,...a,da(b){this.h-=b;this.o=1;0>=this.h&&!this.G&&this.A();O(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17])},A(){this.U&&this.U.ma++;this.parent&&this.parent.Ba++;this.G=this.m=!0;this.g=10},update(){var b=this.path.getPointAtLength(this.frame);const d=this.path.getPointAtLength(this.frame+1);this.x=Math.floor(b.x);this.y=
Math.floor(b.y);this.parent&&(this.x=this.parent.x+Math.cos(this.frame/this.parent.ka+this.ba)*this.parent.ja,this.y=this.parent.y+Math.sin(this.frame/this.parent.ka+this.ba)*this.parent.ja);4<this.o&&(this.o=0);this.rotate&&(this.rotation=M(90)+Math.atan2(d.y-b.y,d.x-b.x));!this.rotate&&(this.rotation=M(180));this.frame>=this.path.getTotalLength()&&(this.frame=0,!this.loop&&(this.U&&this.U.ma++,this.g=0));b=Math.min(Math.max(0,this.frame/50),1);50>this.frame&&(b=this.frame/50);this.frame>this.path.getTotalLength()-
50&&(b=(this.path.getTotalLength()-this.frame)/50);50==this.frame&&(this.m=!1);this.K=this.L=b;2!==this.B&&.995<Math.random()&&x("enemy-fire",this,this.B);2!==this.B||20!=this.l&&40!=this.l&&60!=this.l||x("enemy-fire",this,this.B);300<this.l&&(this.l=0);0<this.o&&this.o++;50<this.frame&&this.l++;this.m=10<this.l&&70>this.l?!0:!1;2===this.B&&(10>this.l||70<this.l)&&this.D();2!==this.B&&this.D();0>=this.g&&this.G&&x("explosion",this.x,this.y,this.v?60:20,this.v?10:5,c[this.u])},j(){const b=this.context;
1<this.frame&&!this.v&&b.drawImage(this.image,8*this.u,0,8,8,0,0,8,8);1<this.frame&&this.v&&b.drawImage(this.Fa,16*this.u,0,16,16,0,0,16,16);if(1<this.frame&&this.v){const d=20*this.h/this.na;b.save();b.translate(this.width/2,this.height/2);b.rotate(-this.rotation);b.fillStyle="white";b.fillRect(-12,-16,24,6);b.fillStyle="black";b.fillRect(-11,-15,22,4);b.fillStyle="green";this.h<this.na/4&&(b.fillStyle="red");b.fillRect(-10,-14,d,2);b.restore()}this.o&&(b.globalCompositeOperation="source-atop",b.fillStyle=
"white",b.fillRect(0,0,this.v?16:8,this.v?16:8),b.globalCompositeOperation="source-over")}})}function ra(a,c){switch(a){case 1:return ha(sa,c);case 2:return ha(Ga,c);default:return ha(sa,c)}}function Ha(a){const [c,b,d,f]=a;return{frame:c,Ka:b,pause:d,C:f}}function Ia(a){const [c,b,d,f,n]=a;return{frame:c,x:b,speed:d,type:f,value:n}}function ha(a,c){const b=[];a.forEach(d=>{const [f,n,q,l,B,w,z,A,m,C,v,Q,y=[]]=d;d=b.push;var N=0<y.length?w:w+Math.floor(c/4);const F=document.createElementNS("http://www.w3.org/2000/svg",
"svg"),D=document.createElementNS("http://www.w3.org/2000/svg","path");F.appendChild(D);D.setAttribute("d",C);D.setAttribute("fill","none");D.setAttribute("stroke","black");D.setAttribute("stroke-width","2");D.setAttribute("id","path");d.call(b,{frame:f,Ma:n,u:q,rotate:l,h:B,total:N,interval:z,loop:A,B:m,path:D,Ca:v.map(Ha),Ga:Q.map(Ia),count:0,ca:!1,ma:0,children:y})});return{ua:b}}function T({create:a,I:c=10}){return{i:[a({x:-100,y:-100})],I:c,size:0,wa:a,get(b={}){if(this.size==this.i.length){if(this.size==
this.I)return;for(var d=0;d<this.size&&this.i.length<this.I;d++)this.i.push(this.wa())}d=this.i[this.size];this.size++;d.X(b);return d},update(){let b,d=!1;for(let f=this.size;f--;)b=this.i[f],b.update(),b.Y()||(d=!0,this.size--);d&&this.i.sort((f,n)=>n.Y()-f.Y())},s(){for(let b=this.size;b--;)this.i[b].s()},S(){return this.i.slice(0,this.size)}}}function ia({i:a=[],update:c,s:b}){const d={...arguments[0],X(f={}){Object.assign(this,f)},update(){this.W?this.W():this.i.forEach(f=>f.update())},s(){this.V&&
this.V();this.i.forEach(f=>f.s())}};d.X({i:a,context:P(),W:c,V:b});return d}function Ja(){const a=P();return H({name:"ship",x:a.canvas.width/2,y:a.canvas.height+16,image:G["spritesheet.png"],u:1,l:0,H:0,o:0,m:!0,G:!1,ga:!0,h:100,Z:3,M:0,da(c){this.m||(this.h-=c,this.o=1,0>=this.h&&this.A(),O(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17]))},A(){this.G||(this.G=this.m=!0,this.Z--,this.g=5,0>=this.Z&&x("game-over"))},Ja(){this.x=a.canvas.width/2;this.y=a.canvas.height+32;this.L=this.K=
2;this.h=100;this.H=0;this.m=!0;this.G=!1;this.ga=!0;this.g=Infinity;this.dy=this.F=this.frame=0},Da(){this.H++;3<this.H&&(this.H=3)},Ha(){this.h=100},update(){this.F=this.R=0;this.dx*=.96;this.dy*=.96;this.u=1;W("arrowright")&&5>this.dx&&(this.R=.2,this.u=2);W("arrowleft")&&-5<this.dx&&(this.R=-.2,this.u=0);W("space")&&0===this.l%(15/(1<this.H?2:1))&&(0==this.H?x("ship-fire",this.x-1):1==this.H?(x("ship-fire",this.x-2,1),x("ship-fire",this.x+2,1)):2==this.H?(x("ship-fire",this.x-3,1),setTimeout(()=>
x("ship-fire",this.x-1,2),200),x("ship-fire",this.x+3,1)):3==this.H&&(x("ship-fire",this.x-2,1),setTimeout(()=>x("ship-fire",this.x+2,1),300),setTimeout(()=>x("ship-fire",this.x-4,2),200),setTimeout(()=>x("ship-fire",this.x+4,2),100)));this.ga||(W("arrowdown")&&5>this.dy&&(this.F=.2),W("arrowup")&&-5<this.dy&&(this.F=-.2));100>this.frame&&(this.F=-.03,this.K=this.L=2-this.frame/100);0>=this.Z&&(this.R=0,this.F=0,this.dx=0,this.dy=0);4<this.o&&(this.o=0);this.D();this.x>a.canvas.width&&(this.x=a.canvas.width);
0>this.x&&(this.x=0);0<this.Z&&!this.ga&&this.y>a.canvas.height&&(this.y=a.canvas.height);0>this.y&&(this.y=0);0>=this.h&&this.A();0>=this.g&&(x("explosion",this.x,this.y,30,6,"white"),this.Ja());100==this.frame&&(this.m=!1,this.ga=!1);this.l++;0<this.o&&this.o++},j(){const c=this.context;c.drawImage(this.image,8*this.u,0,8,8,0,0,8,8);100>this.frame&&this.m&&10>this.frame%20&&(c.globalCompositeOperation="source-atop",c.fillStyle="white",c.fillRect(0,0,8,8),c.globalCompositeOperation="source-over");
this.o&&(c.globalCompositeOperation="source-atop",c.fillStyle="white",c.fillRect(0,0,8,8),c.globalCompositeOperation="source-over");let b=1;0>this.F&&(b=5>this.frame%10?2:3);c.fillStyle="#FFaa33";c.fillRect(3,7,2,b);c.fillStyle="#FF6633";c.fillRect(5>this.frame%10?3:4,7+b,1,b)}})}function E({x:a=0,y:c=0,text:b="",color:d="white",align:f="left",lineHeight:n=8,scale:q=1}){const l=P(),B=8*b.split("\n").reduce((w,z)=>w.length>z.length?w:z).length;return H({x:a,y:c,width:B,height:8,anchor:{x:0,y:0},text:b,
K:q,L:q,j(){const w=G["font.png"],z=this.text.split("\n");l.save();z.forEach(A=>{l.save();"center"===f&&l.translate(8*-A.length/2,0);"right"===f&&l.translate(8*-A.length,0);for(let C=0;C<A.length;C++){var m=A.charCodeAt(C);let v=0;65<=m&&90>=m?v=m-65:null;48<=m&&57>=m?v=m-22:null;32===m&&(v=-1);46===m&&(v=36);44===m&&(v=37);63===m&&(v=38);33===m&&(v=39);58===m&&(v=40);64===m&&(v=41);-1!==v&&(m=8*C,l.drawImage(w,8*v,0,8,8,m,0,8,8),l.globalCompositeOperation="source-atop",l.fillStyle=d||"white",l.fillRect(m,
0,8,8),l.globalCompositeOperation="source-over")}l.restore();l.translate(0,n)});l.restore()}})}function ta(a,c){let b=[],d=c.x+c.width/2;var f=c.y+c.height/2;c=a.y<f;f=a.y+a.height>=f;a.x<d&&(c&&b.push(0),f&&b.push(2));a.x+a.width>=d&&(c&&b.push(1),f&&b.push(3));return b}function ja(){function a(d){const f=2*Math.random()+.1,n=96*f;b.get({id:"star",x:Math.random()*c.canvas.width,y:d,dx:0,dy:f,width:1,height:1,g:240/f,update(){this.advance();this.y>c.canvas.height&&(this.g=0)},j(){const q=this.context;
q.fillStyle=`rgb(${n}, ${n}, ${n})`;q.fillRect(0,0,this.width,this.height)}})}const c=P(),b=T({create:H,I:300});for(let d=0;d<c.canvas.height;d+=2)a(d);return{update(){a(-1);b.update()},s(){b.s()}}}function ua(){return H({name:"dialog",x:8,y:248,image:G["spritesheet.png"],ta:[10,11,12,13,14],text:E({text:"",x:16,y:8,align:"left"}),N:0,C:[],T:0,ha:0,frame:0,anchor:{x:0,y:0},pa:!1,la:!1,oa:!1,Ia(){this.N=this.C[this.T].length},start(a){X(["space"],()=>this.Ia());this.oa=!1;setTimeout(()=>{this.la=!0;
this.C=["",...a.C];this.frame=0},2E3);this.dy=-2},stop(){pa(["space"]);this.oa=!0;this.text.text="        ";this.la=!1;setTimeout(()=>{this.C=[];this.frame=this.N=this.T=0},1E3);this.dy=2},update(){200>this.y&&(this.dy=0,this.y=200);248<this.y&&(this.dy=0,this.y=248);if(0!=this.C.length){this.pa=!1;var a=this.C[this.T]+"      ";" "!==a[this.N]&&(this.pa=!0);0==this.frame%5&&(this.N++," "!==a[this.N]&&O(...[1.5,,261,.01,.02,.08,1,1.5,-.5,,,-.5,,,,,.9,.05]));this.T<this.C.length&&(this.text.text=a.slice(0,
this.N));this.frame++;this.N>=a.length&&(this.T++,this.N=this.frame=0);this.T>=this.C.length&&!this.oa&&this.stop();this.pa&&0==this.frame%5&&this.ha++;this.ha>=this.ta.length&&(this.ha=0);this.D()}},j(){const a=this.context,c=this.image;a.fillStyle="white";a.fillRect(-2,-2,12,12);a.drawImage(c,8*this.ta[this.ha],0,8,8,0,0,8,8);a.translate(16,0);this.text.j()}})}function Ka(){return H({x:0,y:0,dx:0,dy:0,width:2,height:2,g:400,frame:0,A(){this.g=0;this.y=this.x=-100},update(){this.D();if(240<this.y||
0>this.y||256<this.x||0>this.x)this.g=0},j(){const a=this.context;a.fillStyle="red";a.fillRect(0,0,this.width,this.width)}})}function La(){function a(g,k){0!==g.length&&(k.Ba=0,k.ja=30,k.ka=100,k.v=!0,k.width=16,k.height=16,g.forEach(h=>{for(let e=0;e<h[3];e++)m.get({u:h[0],rotate:h[1],g:Infinity,m:!0,G:!1,h:h[2]+Math.floor(n/4),frame:0,v:!1,parent:k,loop:k.loop,path:k.path,ba:M(360/h[3]*e),B:h[4],U:k.U})}))}function c(g,k){g.forEach(h=>{void 0!==k&&k===h.frame&&w.start(h)})}function b(g,k){const h=
[["powerup-fire","green",5],["powerup-shield","yellow",18]];g.forEach(e=>{if(void 0!==e.frame&&k===e.frame){const t=h[e.type];v.get({name:t[0],x:e.x,y:-8,width:8,height:8,color:t[1],dy:e.speed,image:G["font.png"],value:e.value,g:Infinity,A(){l.M+=this.value;0===e.type&&O(...[1.6,,291,.01,.21,.35,,2.2,,,-136,.09,.03,,,.2,.2,.7,.28]);1===e.type&&O(...[.5,,375,.03,.07,.08,1,2.7,,,302,.05,.05,,,,,.93,.01,,607]);this.g=0},update(){this.D();240<this.y&&(this.g=0)},j(){const p=this.context;10>this.frame%
20&&(p.fillStyle=this.color,p.fillRect(-3,-3,this.width+6,this.height+6),p.fillStyle="black",p.fillRect(-2,-2,this.width+4,this.height+4));p.fillStyle=this.color;p.fillRect(-1,-1,this.width+2,this.height+2);p.drawImage(this.image,8*t[2],0,8,8,0,0,8,8)}})}})}function d(g,k,h=!0){g.ua.forEach(e=>{var t=k-e.frame;const p=e.frame+e.total*e.interval;k>=e.frame&&k<p&&e.count<e.total&&0===t%e.interval&&(e.ca=!1,e.count+=1,t=1<n/q?Math.floor(n/q*e.h*.2):0,t=m.get({x:-100,y:-100,path:e.path,rotate:e.rotate,
loop:e.loop,g:Infinity,m:!0,G:!1,h:e.h+t,na:e.h+t,frame:0,u:e.u,parent:null,v:!1,B:e.B,l:0,U:e}),a(e.children||[],t));b(e.Ga,k);h&&c(e.Ca,k);e.ca||e.count!==e.total||e.ma!==e.total||(e.ca=!0)})}function f(g,k){g.Y()&&!g.m&&k.forEach(h=>{var e;if(e="enemy"!==g.name||"enemy"!==h.name)if(e=h.Y()&&!g.m&&!h.m){e=na(h);let t=na(g);e=e.x<t.x+t.width&&e.x+e.width>t.x&&e.y<t.y+t.height&&e.y+e.height>t.y}e&&(h.name.includes("powerup-")||h.v||h.A(),"ship"==g.name&&"enemy"==h.name?g.da(50):"ship"==g.name&&"powerup-fire"==
h.name?(g.Da(h.value),h.A()):"ship"==g.name&&"powerup-shield"==h.name?(g.Ha(h.value),h.A()):"ship"==g.name&&g.da(10),"enemy"==g.name&&(g.da(1),l.M+=10))})}X(["esc"],()=>{x("change-scene","menu")});let n=1,q=1;const l=Ja(),B=ja(),w=ua({x:8,y:224}),z=T({create:H,I:100}),A=T({create:Ka,I:100}),m=T({create:Fa,I:100}),C=T({create:H,I:300}),v=T({create:H,I:10}),Q=E({x:8,y:8,text:"SCORE 0"}),y=E({x:224,y:8,text:"@@@",color:"red"}),N=E({x:8,y:224,text:"",color:"yellow"}),F=E({x:128,y:120,text:`LEVEL ${n}`,
color:"lightgreen",align:"center"}),D=H({x:192,y:8,width:24,height:8,anchor:{x:0,y:0},j(){const g=this.context,k=0<=l.h?l.h/5:0;g.strokeStyle="white";g.strokeRect(0,0,this.width,this.height);g.fillStyle="green";25>l.h&&(g.fillStyle="red");g.fillRect(2,2,k,this.height-4)}});Y("ship-fire",(g,k=0)=>{z.get({name:"ship-bullet",x:g,y:l.y-4,dx:(1-2*Math.random())/(4-k),dy:-5,width:2,height:3,g:80,A(){this.g=0;this.y=this.x=-100},j(){const h=this.context;h.fillStyle="white";h.fillRect(0,0,this.width,1);h.fillStyle=
"yellow";h.fillRect(0,1,this.width,1);h.fillStyle="red";h.fillRect(0,2,this.width,1)}});O(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237])});Y("enemy-fire",({x:g,y:k},h=0)=>{var e=l.x-4-g,t=l.y-k;const p=Math.hypot(e,t)/1;if(2===h)for(h=0;12>h;h++)e=1*Math.cos(M(30*h)),t=1*Math.sin(M(30*h)),A.get({name:"enemy-bullet",x:g,y:k,dx:e,dy:t,frame:0,g:400});else A.get({name:"enemy-bullet",x:g+4,y:k+4,dx:0==h?0:e/p,dy:0==h?1.5:t/p,frame:0,g:400});O(...[.3,,222,.02,.04,.09,3,.3,11,10,,,,,15,,,
.53,.17])});Y("explosion",(g,k,h=50,e=3,t="white")=>{for(let p=0;p<h;p++){let J=360*Math.random(),R=e,U=Math.random()*R+R;C.get({name:"particle",x:g,y:k,dx:Math.cos(M(J))*U/10,dy:Math.sin(M(J))*U/10,width:1,height:1,g:30*R,color:t,update(){const u=256/30*R*(this.g/30);"white"==t&&(this.color=`rgb(${u},${u},${u})`);"red"==t&&(this.color=`rgb(${u},0,0)`);this.D()},j(){const u=this.context;u.fillStyle=this.color;u.fillRect(0,0,this.width,this.height)}});C.get({name:"particle",x:g,y:k,dx:Math.cos(M(J))*
U/20,dy:Math.sin(M(J))*U/20,width:2,height:2,g:10*R/2,update(){const u=256/(R/2)*(this.g/10);this.color=`rgb(${u},${u},${u})`;this.D()},j(){const u=this.context;u.fillStyle=this.color;u.beginPath();u.arc(0,0,2,0,2*Math.PI);u.fill()}})}O(...[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26])});Y("game-over",()=>{setTimeout(()=>x("change-scene","game-over",{M:l.M}),2E3)});const I=new ka,r=new ka;return ia({i:[B,l,v,z,A,m,C,Q,y,D,w],level:ra(q,1),frame:0,update(){if(w.la)w.update();else{d(this.level,this.frame,
n==q);F.update();I.clear();I.add(l,m.S(),A.S(),v.S());f(l,I.get(l));r.clear();m.S().forEach(k=>{r.add(k,z.S());f(k,r.get(k))});var g=this.level.ua.filter(k=>!k.ca).length;0===g&&0===m.S().length&&(n++,q++,2<q&&(q=1),this.level=ra(q,n),this.frame=0,F.text=`LEVEL ${n}`,O(...[,,264,.07,.29,.06,1,3.7,,-30,-148,.07,.08,,,,,.76,.22,,-1240]));Q.text=`SCORE ${l.M}`;y.text="@@@".slice(0,l.Z);N.text=`${(this.frame+"").padStart(8,"0")} ${(g+"").padStart(2,"0")}`;this.frame++;this.i.forEach(k=>k.update())}},
s(){100>this.frame&&F.s()}})}function va(){X(["enter"],()=>{x("change-scene","game")});var a=localStorage.getItem("hiscore")||0;const c=ja(),b=E({text:"MICRO SHOOTER",x:128,y:48,align:"center",scale:2,color:"red"}),d=E({text:"JS13K 2024 EDITION",x:128,y:96,align:"center"});a=E({text:`HIGH SCORE ${a}`,x:128,y:120,align:"center",color:"yellow"});const f=E({text:"PRESS ENTER TO START",x:128,y:144,align:"center",color:"lightgreen"}),n=E({text:"ARROWS TO MOVE\nSPACE TO SHOOT",x:128,y:192,align:"center"});
return ia({i:[c,b,d,a,f,n]})}function Ma(a){a=a.M;const c=localStorage.getItem("hiscore")||0;X(["enter"],()=>{x("change-scene","menu")});var b=ja(),d=E({text:"GAME OVER",x:128,y:48,align:"center",scale:2,color:"red"});const f=E({text:`SCORE ${a}`,x:128,y:96,align:"center"}),n=E({text:"PRESS ENTER TO CONTINUE",x:128,y:144,align:"center",color:"lightgreen"}),q=ua({x:8,y:224});b=ia({i:[b,d,f,n,q]});d=["GOOD BYE CAPTAIN @        ","THE ENEMY HAS WON","BUT... HEY!     ","THIS IS JUST A GAME"];a>c?d.push("YOU HAVE A NEW HIGH SCORE!"):
d.push("TRY TO BEAT YOUR HIGH SCORE!");q.start({C:d});a>c&&(localStorage.setItem("hiscore",a),a=E({text:`NEW HIGH SCORE ${a}`,x:128,y:120,align:"center",color:"yellow"}),b.i.push(a));return b}function Na(){const a=P();a.filter="url(#remove-alpha)"===a.filter?"none":"url(#remove-alpha)"}let ca={},ea={},da={},V={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",ArrowDown:"arrowdown"},G={},S={},la=new AudioContext,O=(a=1,c=.05,b=220,d=0,f=0,n=.1,
q=0,l=1,B=0,w=0,z=0,A=0,m=0,C=0,v=0,Q=0,y=0,N=1,F=0,D=0,I=0)=>{let r=Math,g=2*r.PI,k=B*=500*g/44100/44100,h=b*=(1-c+2*c*r.random(c=[]))*g/44100,e=0,t=0,p=0,J=1,R=0,U=0,u=0,K=0>I?-1:1;var L=g*K*I*2/44100,Z=r.cos(L);let aa=r.sin;var ba=aa(L)/4;L=1+ba;let Oa=-2*Z/L;ba=(1-ba)/L;let wa=(1+K*Z)/2/L;Z=-(K+Z)/L;let xa=0,ya=0,za=0,Aa=0;d=44100*d+9;F*=44100;f*=44100;n*=44100;y*=44100;w*=500*g/44100**3;v*=g/44100;z*=g/44100;A*=44100;m=44100*m|0;a*=.3;for(K=d+F+f+n+y|0;p<K;c[p++]=u*a)++U%(100*Q|0)||(u=q?1<q?
2<q?3<q?aa(e**3):r.max(r.min(r.tan(e),1),-1):1-(2*e/g%2+2)%2:1-4*r.abs(r.round(e/g)-e/g):aa(e),u=(m?1-D+D*aa(g*p/m):1)*(0>u?-1:1)*r.abs(u)**l*(p<d?p/d:p<d+F?1-(p-d)/F*(1-N):p<d+F+f?N:p<K-y?(K-p-y)/n*N:0),u=y?u/2+(y>p?0:(p<K-y?1:(K-p)/y)*c[p-y|0]/2/a):u,I?u=Aa=wa*xa+Z*(xa=ya)+wa*(ya=u)-ba*za-Oa*(za=Aa):0),L=(b+=B+=w)*r.cos(v*t++),e+=L+L*C*aa(p**5),J&&++J>A&&(b+=z,h+=z,J=0),!m||++R%m||(b=h,B=k,J=J||1);a=la.createBuffer(1,K,44100);a.getChannelData(0).set(c);b=la.createBufferSource();b.buffer=a;b.connect(la.destination);
b.start()};var sa=[[100,!1,4,!1,1,2,330,!1,0,"M1 1s162 189 172 199c11 10 30 35 59 24 29-12 9-54 0-65L120 37S99 11 71 15c-27 3-46 47-46 47S4 106 4 126s-3 67 11 77c15 10 55 41 79 9L247 1",[[99,0,!0,"CAPTAIN;WE HAVE DETECTED;SOME ENEMY SCOUTS;A FULL WAVE IS IMINENT;    ;PROCEED WITH CAUTION;AND GOOD LUCK!".split(";")],[420,0,!0,["WE DEPLOYED SOME POWERUPS","","TO ENHANCE YOUR FIRE POWER","AND RECHARGE YOUR SHIELD"]]],[[410,120,1,0,10],[730,200,1,1,10]]],[400,!0,5,!0,2,3,60,!1,0,"M113.696 117.212C128.254 117.212 156.71 108.752 154.725 91.832C152.74 74.9117 136.196 52.5529 113.696 52.5529C91.1957 52.5529 64.7252 64.0345 54.7988 79.7461C44.8723 95.4577 38.9165 134.737 54.7988 152.261C70.6811 169.786 80.6075 172.807 105.755 172.203C130.902 171.599 155.387 160.117 170.607 149.24C185.828 138.363 203.034 112.378 202.372 91.832C201.71 71.286 207.004 45.9058 189.798 28.3813C172.593 10.8567 149.431 -0.625112 98.4751 1.18777C47.5194 3.00065 40.9017 23.5468 30.3135 38.0498C19.7253 52.5529 2.51948 78.5374 1.19596 112.378C-0.127568 146.219 5.16655 173.412 19.7253 189.728C34.2841 206.044 72.0046 225.381 98.4751 225.985C124.946 226.59 177.887 208.461 194.431 194.562C210.975 180.663 232.813 157.7 238.107 128.09C243.401 98.4791 244.725 70.6818 232.813 52.5529C220.901 34.424 207.666 18.7631 165.313 10.9072C122.96 3.05134 87.8869 18.1082 70.6811 31.4026C53.4752 44.697 19.7253 83.3718 19.7253 112.378C19.7253 141.384 25.6812 165.556 54.7988 186.102C83.9163 206.648 148.107 193.353 167.96 180.663C187.813 167.973 214.284 149.24 218.916 117.212C223.548 85.1847 199.725 59.2001 173.916 46.5099C148.107 33.8198 105.755 33.2155 83.9163 46.5099C62.0781 59.8043 40.24 93.0406 56.7841 128.09C73.3281 163.139 99.1369 163.139 115.681 156.492C132.225 149.844 167.96 141.384 173.916 112.378C179.872 83.3718 177.887 66.4517 142.151 59.2001C106.416 51.9485 79.284 62.2217 79.284 93.6449C79.284 125.068 98.4751 117.212 98.4751 117.212",
[],[]],[600,!0,6,!0,4,3,200,!1,0,"M241 228V23c0-29-40-29-40 0v186c0 36-30 25-37 0S140 7 116 7 82 168 77 206c-5 37-38 29-38 0V33C39-11 1-7 1 33v195",[],[]],[800,!0,7,!1,4,3,20,!1,0,"M235 1H13c-14 0-11 9 0 9h214c17 0 17 10 0 10H13c-18 0-14 12 0 12h214c20 0 19 15 0 15H13c-16 0-16 13 0 13h244",[],[]]],Ga=[[200,!1,0,!1,30,1,50,!0,2,"M131 57s-56 130 0 129c57 0 99-32 69-67s-33-85-69-75-71 38-71 75c1 37 25 52 64 51 39 0 61-22 60-51-1-30-21-46-47-47-25-1-56 17-56 47 0 29 12 32 43 29s39-11 39-29-6-25-26-25-32 4-36 25c-3 20 9 18 23 11 13-7 17-11 17-11",
[[99,0,!0,["SOMETHING BIG IS COMING"]]],[[200,120,.5,0,10],[400,200,1,1,10]],[[8,!0,2,8,1]]]];class ka{constructor({ea:a=3,fa:c=25,J:b}={}){this.ea=a;this.fa=c;a=P().canvas;this.J=b||{x:0,y:0,width:a.width,height:a.height};this.$=!1;this.ia=0;this.P=[];this.O=[]}clear(){this.O.map(a=>{a.clear()});this.$=!1;this.P.length=0}get(a){let c=new Set;for(;this.O.length&&this.$;)return ta(a,this.J).map(b=>{this.O[b].get(a).map(d=>c.add(d))}),Array.from(c);return this.P.filter(b=>b!==a)}add(...a){a.flat().map(c=>
{this.$?this.ra(c):(this.P.push(c),this.P.length>this.fa&&this.ia<this.ea&&(this.Aa(),this.P.map(b=>this.ra(b)),this.P.length=0))})}ra(a){ta(a,this.J).map(c=>{this.O[c].add(a)})}Aa(){var a;this.$=!0;if(!this.O.length){var c=this.J.width/2|0;var b=this.J.height/2|0;for(a=0;4>a;a++)this.O[a]=new ka({J:{x:this.J.x+(1==a%2?c:0),y:this.J.y+(2<=a?b:0),width:c,height:b},ea:this.ea,fa:this.fa}),this.O[a].ia=this.ia+1}}}const ma=function(a){window.qa=window.qa||{};return window.qa.context=a}(document.getElementById("c").getContext("2d"));
ma.imageSmoothingEnabled=!1;ma.setTransform(1,0,0,1,0,0);ma.filter="url(#remove-alpha)";(function(){let a;for(a=0;26>a;a++)V["Key"+String.fromCharCode(a+65)]=String.fromCharCode(a+97);for(a=0;10>a;a++)V["Digit"+a]=V["Numpad"+a]=""+a;window.addEventListener("keydown",Ca);window.addEventListener("keyup",Da)})();(async()=>{await fa("font.png");await fa("spritesheet.png");await fa("spritesheet16.png");X("e",Na);Y("change-scene",(c,b)=>{pa(["enter","esc"]);Ea(["change-scene"]);"game"===c&&(a=La());"menu"===
c&&(a=va());"game-over"===c&&(a=Ma(b))});let a=va();Ba({update(){a.update()},s(){a.s()}}).start()})()})();
