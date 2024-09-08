(function(){function oa(a){const b=document.createElementNS("http://www.w3.org/2000/svg","svg"),c=document.createElementNS("http://www.w3.org/2000/svg","path");b.appendChild(c);c.setAttribute("d",a);c.setAttribute("fill","none");c.setAttribute("stroke","black");c.setAttribute("stroke-width","2");c.setAttribute("id","path");return c}function pa(a){let {x:b=0,y:c=0,width:d,height:e}=a;b-=.5*d;c-=.5*e;0>d&&(b+=d,d*=-1);0>e&&(c+=e,e*=-1);return{x:b,y:c,width:d,height:e}}function t(a,b,...c){return setTimeout(a,
b,...c)}function H(a=0,b=1){return Math.random()*(b-a)+a}function Ca({update:a,C:b}){function c(){requestAnimationFrame(c);q=performance.now();l=q-f;f=q;if(!(1E3<l)){for(d+=l;d>=e;)a(h),d-=e;u.clearRect(0,0,u.canvas.width,u.canvas.height);b()}}let d=0,e=1E3/60,h=1/60,f,q,l;const u=window.T.context;return{start(){f=performance.now();requestAnimationFrame(c)}}}function A(a,b){U[a]=U[a]||[];U[a].push(b)}function Da(a=[]){U=Object.keys(U).reduce((b,c)=>{a.includes(c)&&(b[c]=U[c]);return b},{})}function m(a,
...b){(U[a]||[]).map(c=>c(...b))}function qa(a,b){return(new URL(a,b)).href}function ra(){window.Aa||(window.Aa={Ma:qa,Ka:K,d:V})}function sa(a,b,c){ra();if(V[a])return V[a];V[a]=b(...c)}function ba(a){ra();return new Promise((b,c)=>{let d,e;if(K[a])return b(K[a]);d=new Image;d.onload=()=>{e=qa(a,window.location.href);K[e]=K[a]=d;b(d)};d.onerror=()=>{c()};d.src=a})}function D(a){return new Ea(a)}function ta(a){return new Fa(a)}function ua(a=()=>{},b){a.Ba&&b.preventDefault();a(b)}function Ga(a){let b=
W[a.code],c=ca[b];da[b]=!0;ua(c,a)}function Ha(a){let b=W[a.code],c=ea[b];da[b]=!1;ua(c,a)}function Ia(){let a;for(a=0;26>a;a++)W["Key"+String.fromCharCode(a+65)]=String.fromCharCode(a+97);for(a=0;10>a;a++)W["Digit"+a]=W["Numpad"+a]=""+a;window.addEventListener("keydown",Ga);window.addEventListener("keyup",Ha)}function X(a){return!![].concat(a).some(b=>da[b])}function Y(a,b,{Fa:c="keydown",preventDefault:d=!0}={}){let e="keydown"==c?ca:ea;b.Ba=d;[].concat(a).map(h=>e[h]=b)}function Ja(a,{Fa:b="keydown"}=
{}){let c="keydown"==b?ca:ea;[].concat(a).map(d=>delete c[d])}function L(a){return new Ka(a)}function fa(a=1){const b=L({create:ha,m:241});b.La=function(c){this.o.forEach(d=>{d.dy*=c})};b.ua=function(){this.o.forEach(c=>{c.dy/=2})};b.Na=a;for(let c=0;240>c;c++){const d=H(1,3)*a,e=Math.floor(d/a*50)+50;b.get({x:Math.floor(H(0,256)),y:c,width:1,height:1,dy:d/4,color:`rgb(${e}, ${e}, ${e})`,update(){this.advance();240<this.y&&(this.y=0)}})}b.B=()=>!0;return b}function La(a){return new Ma(a)}function va(a,
b){let c=[],d=b.x+b.width/2;var e=b.y+b.height/2;b=a.y<e;e=a.y+a.height>=e;a.x<d&&(b&&c.push(0),e&&c.push(2));a.x+a.width>=d&&(b&&c.push(1),e&&c.push(3));return c}function Na(a){return new wa(a)}function Oa(a){return new Pa(a)}function ia(a,b){a.B()&&b.forEach(c=>{var d;if(d="enemy"!==a.name||"enemy"!==c.name)if(d=c.B()&&!a.j&&!c.j){d=pa(c);let e=pa(a);d=d.x<e.x+e.width&&d.x+d.width>e.x&&d.y<e.y+e.height&&d.y+d.height>e.y}d&&("ship-bullet"!=a.name||c.j||(a.g=0,c.S(1)),"ship"!=a.name||"asteroid"!=
c.name&&"boss"!=c.name||(a.F(),a.g=0,c.S(5)),"ship"==a.name&&"enemy"==c.name&&(c.F(),c.g=0,a.S(50)),"ship"==a.name&&"enemy-bullet"==c.name&&(c.g=0,a.S(10)),"ship"!=a.name||"powerup"!=c.name||c.ma||(c.F(),a.Ga(c)))})}function Qa(a){return new Ra(a)}function ja(a){a=ka[a];let b=Math.max(...Object.keys(a[0]),...Object.keys(a[1])),c=a[0][b];c??=a[1][b];return b+=c[1]/1E3*60*c[0]}function Sa(a=0,b=0,c=0,d=!1){const e=ka[b],h=ja(b);if(e[0][a]){const f=e[0][a];m("spawn-enemy",f[0],f[1],{l:f[2],rotate:f[3],
loop:f[4],h:f[5],Ea:f[6],V:f[7],path:oa(f[8])})}e[1][a]&&m("spawn-asteroid",...e[1][a]);e[2][a]&&m("spawn-powerup",...e[2][a]);e[3][a]&&m("set-dialog",...e[3][a]);0===e[4].length&&a>=h&&0===c&&m("next-level",b+1>=xa?0:b+1);0<e[4].length&&d&&0===c&&m("spawn-boss",...e[4])}function Ta(){Y(["esc"],()=>{m("change-scene","menu")});Y(["p"],()=>{m("pause")});Ja(["enter"]);la.play("song1");la.Ia(!0);const a=new Ua({x:120,y:248}),b=fa(20),c=new Va(void 0);Y(["enter"],()=>c.Ja());let d=0,e=0,h=0,f=!0,q=!1,
l=ja(d);const u=L({create:ta,m:400}),y=L({create:ha,m:40}),E=L({create:ha,m:400}),v=L({create:La,m:10}),w=L({create:Na,m:50}),B=L({create:Oa,m:4}),F=L({create:Qa,m:4}),z=D({text:"SCORE 00000",x:8,y:8}),M=D({x:224,y:8,text:"@@@",color:"red"}),I=D({x:128,y:120,text:"LEVEL 1",align:"center",color:"lightgreen"}),Q=new N({x:192,y:8,width:24,height:8,anchor:{x:0,y:0},v(){const g=this.context,k=0<=a.h?a.h/5:0;g.strokeStyle="white";g.lineWidth=2;g.strokeRect(0,0,this.width,this.height);g.fillStyle="green";
25>a.h&&(g.fillStyle="red");g.fillRect(2,2,k,this.height-4)}});A("hit",()=>{R(...[2.3,,330,,.06,.17,2,3.7,,,,,.05,.4,2,.5,.13,.89,.05,.17])});A("explosion",(g,k,p,n,r)=>{R(...[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26]);for(let G=0;G<p;G++)0==G%2&&u.get({x:g,y:k,dx:H(-1,1)/2,dy:H(-1,1)/2,color:null,g:30}),u.get({x:g,y:k,dx:H(-n/2,n/2),dy:H(-n/2,n/2),color:r,g:30*n})});A("ship-fire",(g,k,p)=>{R(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237]);y.get({name:"ship-bullet",x:g,y:k,width:2,
height:4,dy:-4,dx:p,color:null,l:17,g:100,update(){this.advance();0>this.y&&(this.g=0)}})});A("enemy-fire",(g,k)=>{R(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237]);const p=a.x-4-g,n=a.y-4-k,r=Math.hypot(p,n)/1;E.get({name:"enemy-bullet",x:g+4,y:k+4,dx:p/r,dy:n/r,width:2,height:2,color:"red",g:200})});A("boss-fire",(g,k)=>{R(...[.9,,413,,.05,.01,1,3.8,-3,-13.4,,,,,,,.11,.65,.07,,237]);for(let p=0;12>p;p++)E.get({name:"enemy-bullet",x:g,y:k,dx:1*Math.cos(30*p*Math.PI/180),dy:1*Math.sin(30*
p*Math.PI/180),width:2,height:2,color:"red",g:400})});A("score",g=>{a.J+=g});A("spawn-boss",(g,k,p,n,r,G,S,C,T,J)=>{q=!1;g=B.get({l:g,h:k,V:p,rotate:!1,loop:!0,j:!0,Z:"pink",ta:T,sa:r,path:oa(n)});m("spawn-enemy",G,0,{l:S,h:2,V:J,Ea:C,parent:g,path:null})});A("spawn-enemy",(g,k,p)=>{const n=1<(e+1)/(d+1)?Math.floor((e+1)/(d+1)*p.h*.2):0;for(let r=0;r<g;r++)t(G=>{w.get({...p,ra:G*Math.PI/180,h:p.h+n})},r*k,360/g*r)});A("spawn-asteroid",(g,k,p,n,r)=>{const G=1<(e+1)/(d+1)?Math.floor((e+1)/(d+1)*2):
0;let S=0;for(let C=0;C<g;C++)S>p.length-1&&(S=0),t((T,J)=>{v.get({x:p[J],y:-8,dx:n[J],dy:r[J],h:10+G})},C*k,C,S),S++});A("spawn-powerup",(g,k,p)=>{F.get({type:g,x:k,y:-8,dy:p})});A("set-dialog",(g,k)=>{c.start({D:k,ca:g})});A("next-level",g=>{d=g;e++;h=0;f=!1;l=ja(g)});A("boss-die",()=>{m("score",200);d++;d>=xa&&(d=0);m("next-level",d)});A("game-over",()=>{const g=localStorage.getItem("hiScore")||0;a.J>g&&localStorage.setItem("hiScore",a.J);m("change-scene","game-over",{J:a.J,Ha:g})});const x=new Z(void 0),
O=new Z(void 0),P=new Z(void 0);return new ma({children:[b,z,M,y,E,a,w,B,v,F,u,Q,c,I],wa:!1,update(){this.paused=!1;if(c.ia&&c.ca)c.update(),this.paused=!0;else{40>h&&(I.text=`LEVEL ${e+1}`,I.g=100);var g=w.size+v.size;h===l&&(q=!0);Sa(h,d,g,q);0>=a.ja&&!this.wa?(this.wa=!0,t(()=>m("game-over"),1E3)):(y.A().forEach(k=>{x.clear();x.add(k,v.A(),w.A(),B.A());ia(k,x.get(k))}),O.clear(),O.add(a,v.A(),w.A(),E.A(),B.A(),F.A()),ia(a,O.get(a)),P.clear(),P.add(v.A()),v.A().forEach(k=>{ia(k,P.get(k))}),z.text=
`SCORE ${a.J}`,M.text="@@@".slice(0,a.ja),f&&40<h&&140>h&&0===h%20&&b.ua(),h++)}}})}function ya(){Y(["enter"],()=>{m("change-scene","game")});const a=fa(20),b=D({x:128,y:32,text:"MICRO SHOOTER",align:"center",color:"red",s:2,H:4}),c=D({x:128,y:88,text:"JS13K 2024 EDITION",align:"center",color:"yellow"}),d=D({x:128,y:128,text:"A GAME BY\nMARCO FERNANDES",lineHeight:16,color:"white",align:"center"}),e=D({x:128,y:176,text:"ARROWS OR WASD TO MOVE\nSPACE TO SHOOT",lineHeight:16,align:"center"}),h=D({x:128,
y:224,text:"ENTER TO START",color:"lightgreen",align:"center"}),f=new ma({frame:0,children:[a,h],update(){40<this.frame&&140>this.frame&&0===this.frame%20&&a.ua();this.frame++}});t(()=>{f.add(b)},1E3);t(()=>{f.add(c)},2E3);t(()=>{f.add(d)},3E3);t(()=>{f.add(e)},4E3);return f}function Wa({J:a=0,Ha:b=localStorage.getItem("hiScore")||0}={}){Y(["enter"],()=>{m("change-scene","menu")});A("explosion",(y,E,v,w,B)=>{R(...[,,45,.03,.21,.6,4,.9,2,-3,,,,.2,,.9,,.45,.26]);for(let F=0;F<v;F++)d.get({x:y,y:E,dx:H(-w/
2,w/2),dy:H(-w/2,w/2),color:B,g:30*w})});const c=fa(1),d=L({create:ta,m:400}),e=D({x:128,y:32,text:"GAME OVER",align:"center",color:"red",s:2,H:4}),h=D({x:128,y:80,text:"YOUR SCORE:",color:"white",align:"center"}),f=D({x:128,y:96,text:`${a}`,color:"white",align:"center",s:2,H:2}),q=D({x:128,y:128,text:"NEW HIGH SCORE!",color:"yellow",align:"center"}),l=D({x:128,y:224,text:"ENTER TO CONTINUE",color:"lightgreen",align:"center"}),u=new ma({frame:0,children:[c,l,d]});t(()=>{u.add(e);m("explosion",128,
48,100,6,"red")},1E3);t(()=>{u.add(h)},2E3);t(()=>{u.add(f)},2500);a>b&&t(()=>{u.add(q);m("explosion",128,132,60,4,"yellow")},3E3);return u}let U={},K={},V={};class N{constructor(a){this.i(a)}i(a={}){Object.assign(this,{name:"",x:0,y:0,width:8,height:8,rotation:0,s:1,H:1,anchor:{x:0,y:0},color:"white",dx:0,dy:0,U:0,R:0,g:Infinity,frame:0,l:0,context:window.T.context,u:[K["spritesheet.png"],8,8],h:20,W:!1,M:a.update,ha:a.C,qa:a.v,...a})}S(a){m("hit");this.h-=a;this.W=!0;0>=this.h&&this.F&&this.F();
t(()=>this.W=!1,100)}advance(){this.x+=this.dx;this.y+=this.dy;this.dx+=this.U;this.dy+=this.R;this.g--;this.frame++}update(){this.M?this.M():this.advance()}C(){if(this.ha)return this.ha();const a=this.context,b=this.x,c=this.y,d=this.anchor,e=this.rotation,h=this.s,f=this.H,q=this.width,l=this.height;a.save();a.translate(b,c);e&&a.rotate(e);h&&f&&a.scale(h,f);a.translate(-q*d.x,-l*d.y);this.v();a.restore()}v(){if(this.qa)return this.qa();const a=this.context,b=this.color,c=this.width,d=this.height;
this.W&&(a.save(),a.translate(0,-1));this.color?(a.fillStyle=b,a.fillRect(0,0,c,d)):a.drawImage(this.u[0],this.l*this.u[1],0,c,d,0,0,c,d);this.W&&(a.globalCompositeOperation="source-atop",a.fillStyle="white",a.fillRect(0,0,c,d),a.globalCompositeOperation="source-over",a.restore())}B(){return 0<this.g}}const ha=a=>new N(a);class ma{constructor(a){this.i(a)}i(a={}){const b=Object.keys(a).reduce((c,d)=>{"function"!==typeof a[d]&&(c[d]=a[d]);return c},{});Object.assign(this,{id:"scene",context:window.T.context,
M:a.update,ha:a.C,children:[],paused:!1,...b})}add(a){this.children.push(a)}pause(){this.paused=!0}resume(){this.paused=!1}update(a){this.paused||(this.children.forEach(b=>{if(!b.B)return b.update(a);b.B()&&b.update(a)}),this.M&&this.M())}C(){this.context.save();this.M&&this.M();this.children.forEach(a=>{if(!a.B)return a.C();a.B()&&a.C()});this.context.restore()}}class Ea extends N{constructor(a={}){super({name:"text",x:0,y:0,text:"",color:"white",align:"left",lineHeight:8,scale:1,u:K["font.png"],
...a})}v(){const a=this.text.split("\n"),b=this.context,c=this.align,d=this.lineHeight,e=this.color;b.save();a.forEach(h=>{b.save();"center"===c&&b.translate(8*-h.length/2,0);"right"===c&&b.translate(8*-h.length,0);for(let q=0;q<h.length;q++){var f=h.charCodeAt(q);let l=0;65<=f&&90>=f?l=f-65:null;48<=f&&57>=f?l=f-22:null;32===f&&(l=-1);46===f&&(l=36);44===f&&(l=37);63===f&&(l=38);33===f&&(l=39);58===f&&(l=40);64===f&&(l=41);-1!==l&&(f=8*q,b.drawImage(this.u,8*l,0,8,8,f,0,8,8),b.globalCompositeOperation=
"source-atop",b.fillStyle=e||"white",b.fillRect(f,0,8,8),b.globalCompositeOperation="source-over")}b.restore();b.translate(0,d)});b.restore()}}class Fa extends N{constructor(a){super({name:"explosion-particle",color:"white",anchor:{x:.5,y:.5},...a})}update(){!this.color&&30>this.g&&(this.s=this.H=this.g/30);this.color&&60>this.g&&(this.s=this.H=this.g/60);this.advance()}v(){!this.color&&this.context.drawImage(this.u[0],128,0,8,8,0,0,8,8);this.color&&(this.context.fillStyle=this.color,this.context.fillRect(0,
0,1,1))}}let ca={},ea={},da={},W={Enter:"enter",Escape:"esc",Space:"space",ArrowLeft:"arrowleft",ArrowUp:"arrowup",ArrowRight:"arrowright",ArrowDown:"arrowdown"};class Ua extends N{i(a){super.i({name:"ship",da:!0,y:248,j:!1,Da:!1,h:100,ja:3,J:0,N:0,G:!1,anchor:{x:.5,y:.5},l:1,...a});this.ya()}Ga(a){"shield"===a.type&&(this.h+=50,100<this.h&&(this.h=100));"fire"===a.type&&(this.N++,3<this.N&&(this.N=3))}$(){this.G||(this.G=!0,m("ship-fire",this.x-1,this.y-8,H(-.3,.3)),0<this.N&&m("ship-fire",this.x-
1,this.y-8,H(-.5,.5)),1<this.N&&t(()=>{m("ship-fire",this.x-1,this.y-8,H(-.3,.3));m("ship-fire",this.x-1,this.y-8,H(-.5,.5))},100),2<this.N&&t(()=>{m("ship-fire",this.x-1,this.y-8,-2);m("ship-fire",this.x-1,this.y-8,2)},400),t(()=>{this.G=!1},200))}F(){m("explosion",this.x,this.y-4,60,4,"white");this.Da=!0;this.g=0;this.ja--;this.j=!0;this.U=this.dx=0;this.x=128;t(()=>{this.ya()},1E3)}ya(){this.da=this.j=!0;this.g=Infinity;this.y=248;this.frame=0;this.h=100;this.N=0;t(()=>{this.j=this.da=!1},1E3)}update(){this.R=
this.U=0;this.dx*=.96;this.dy*=.96;this.l=1;X(["d","arrowright"])&&5>this.dx&&(this.U=.2,this.l=2);X(["a","arrowleft"])&&-5<this.dx&&(this.U=-.2,this.l=0);this.da||(X(["s","arrowdown"])&&5>this.dy&&(this.R=.2),X(["w","arrowup"])&&-5<this.dy&&(this.R=-.2));!this.G&&X("space")&&this.$();this.da&&(this.R=-.03,this.s=this.H=Math.min(Math.max(1,2-this.frame/60),2));0>=this.h&&this.F();this.advance();4>this.x&&(this.x=4,this.dx=0);252<this.x&&(this.x=252,this.dx=0);4>this.y&&(this.y=4,this.dy=0);236<this.y&&
(this.y=236,this.dy=0)}v(){const a=this.context,b=this.width,c=this.height;a.drawImage(this.u[0],this.u[1]*this.l,0,b,c,0,0,b,c);let d=1;0>this.R&&(d=5>this.frame%10?2:3);a.fillStyle="#FFaa33";a.fillRect(3,7,2,d);a.fillStyle="#FF6633";a.fillRect(5>this.frame%10?3:4,7+d,1,d);this.W&&(a.globalCompositeOperation="source-atop",a.fillStyle="white",a.fillRect(0,0,b,c),a.globalCompositeOperation="source-over")}}class Ka{constructor({create:a,m:b=1024}={}){let c;if(!(a&&(c=a({id:""}))&&c.update&&c.i&&c.B&&
c.C))throw Error("Must provide create() function which returns an object with init(), update(), render(), and isAlive() functions");this.pa=a;this.o=[a({id:""})];this.size=0;this.m=b}get(a={}){if(this.size==this.o.length){if(this.size==this.m)return;for(var b=0;b<this.size&&this.o.length<this.m;b++)this.o.push(this.pa())}b=this.o[this.size];this.size++;b.i(a);return b}A(){return this.o.slice(0,this.size)}clear(){this.size=this.o.length=0;this.o.push(this.pa())}update(a){let b,c=!1;for(let d=this.size;d--;)b=
this.o[d],b.update(a),b.B()||(c=!0,this.size--);c&&this.o.sort((d,e)=>e.B()-d.B())}C(){for(let a=this.size;a--;)this.o[a].C()}}const R=(...a)=>za(Aa(...a)),za=(...a)=>{let b=na.createBufferSource(),c=na.createBuffer(a.length,a[0].length,44100);a.map((d,e)=>c.getChannelData(e).set(d));b.buffer=c;b.connect(na.destination);b.start();return b},Aa=(a=1,b=.05,c=220,d=0,e=0,h=.1,f=0,q=1,l=0,u=0,y=0,E=0,v=0,w=0,B=0,F=0,z=0,M=1,I=0,Q=0)=>{let x=2*Math.PI,O=l*=500*x/194481E4,P=(0<B?1:-1)*x/4;b=c*=(1+2*b*Math.random()-
b)*x/44100;let g=[],k=0,p=0,n=0,r=1,G=0,S=0,C=0,T,J;d=99+44100*d;I*=44100;e*=44100;h*=44100;z*=44100;u*=500*x/44100**3;B*=x/44100;y*=x/44100;E*=44100;v=44100*v|0;for(J=d+I+e+h+z|0;n<J;g[n++]=C)++S%(100*F|0)||(C=f?1<f?2<f?3<f?Math.sin((k%x)**3):Math.max(Math.min(Math.tan(k),1),-1):1-(2*k/x%2+2)%2:1-4*Math.abs(Math.round(k/x)-k/x):Math.sin(k),C=(v?1-Q+Q*Math.sin(2*Math.PI*n/v):1)*(0<C?1:-1)*Math.abs(C)**q*a*.3*(n<d?n/d:n<d+I?1-(n-d)/I*(1-M):n<d+I+e?M:n<J-z?(J-n-z)/h*M:0),C=z?C/2+(z>n?0:(n<J-z?1:(J-
n)/z)*g[n-z|0]/2):C),T=(c+=l+=u)*Math.sin(p*B-P),k+=T-T*w*(1-1E9*(Math.sin(n)+1)%2),p+=T-T*w*(1-1E9*(Math.sin(n)**2+1)%2),r&&++r>E&&(c+=y,b+=y,r=0),!v||++G%v||(c=b,l=O,r=r||1);return g},na=new (window.AudioContext||webkitAudioContext);class Ma extends N{i(a){super.i({name:"asteroid",u:[K["spritesheet16.png"],16,16],l:2,width:16,height:16,color:null,anchor:{x:.5,y:.5},h:10,...a})}F(){m("explosion",this.x,this.y,50,4,"white");m("score",10);this.g=0}update(){this.rotation=this.frame/(10/this.dy);this.advance();
0>this.x||264<this.x||248<this.y&&(this.g=0)}}class Z{constructor({aa:a=3,ba:b=25,I:c}={}){this.aa=a;this.ba=b;a=window.T.context.canvas;this.I=c||{x:0,y:0,width:a.width,height:a.height};this.Y=!1;this.ga=0;this.P=[];this.L=[]}clear(){this.L.map(a=>{a.clear()});this.Y=!1;this.P.length=0}get(a){let b=new Set;for(;this.L.length&&this.Y;)return va(a,this.I).map(c=>{this.L[c].get(a).map(d=>b.add(d))}),Array.from(b);return this.P.filter(c=>c!==a)}add(...a){a.flat().map(b=>{this.Y?this.oa(b):(this.P.push(b),
this.P.length>this.ba&&this.ga<this.aa&&(this.Ca(),this.P.map(c=>this.oa(c)),this.P.length=0))})}oa(a){va(a,this.I).map(b=>{this.L[b].add(a)})}Ca(){var a;this.Y=!0;if(!this.L.length){var b=this.I.width/2|0;var c=this.I.height/2|0;for(a=0;4>a;a++)this.L[a]=new Z({I:{x:this.I.x+(1==a%2?b:0),y:this.I.y+(2<=a?c:0),width:b,height:c},aa:this.aa,ba:this.ba}),this.L[a].ga=this.ga+1}}}class wa extends N{i(a){a={name:"enemy",l:3,color:null,anchor:{x:.5,y:.5},h:1,frame:0,loop:!0,va:!0,Z:"white",V:200,...a};
super.i(a);this.path&&(this.g=Math.floor(a.path.getTotalLength()));this.loop&&(this.g=Infinity)}$(){m("enemy-fire",this.x-4,this.y-4,this.rotation,3)}F(){m("explosion",this.x,this.y,30,3,this.Z);m("score",10);this.g=0}update(){this.rotation=180*Math.PI/180;if(this.path){const a=this.path.getPointAtLength(this.frame),b=this.path.getPointAtLength(this.frame+1);this.x=Math.floor(a.x);this.y=Math.floor(a.y);this.rotate&&(this.rotation=90*Math.PI/180+Math.atan2(b.y-a.y,b.x-a.x))}else this.x=this.parent.x+
Math.cos(this.frame/this.parent.ta+this.ra)*this.parent.sa,this.y=this.parent.y+Math.sin(this.frame/this.parent.ta+this.ra)*this.parent.sa;this.va&&(this.s=this.H=Math.min(Math.max(0,(this.frame+1)/100),1));!this.loop&&100>this.g&&(this.s=this.H=Math.min(Math.max(0,this.g/100),1));1>this.s&&(this.j=!0);1<=this.s&&(this.j=!1);1==this.s&&0===this.frame%this.V&&this.$();this.path&&this.frame>=this.path.getTotalLength()&&this.loop&&(this.frame=0,this.va=!1);this.frame++;this.g--}}class Pa extends wa{i(a){super.i({name:"boss",
u:[K["spritesheet16.png"],16,16],l:0,width:16,height:16,color:null,h:10,Z:"white",V:200,G:!1,loop:!1,j:!0,ka:!1,fa:[],...a});this.xa=this.h}S(a){super.S(a);this.ka=!0;t(()=>{this.ka=!1},1E3)}$(){this.G=!0;this.j=!1;this.fa[0]=t(()=>{m("boss-fire",this.x,this.y,this.rotation,3)},400);this.fa[1]=t(()=>{m("boss-fire",this.x,this.y,this.rotation,3)},800);this.fa[2]=t(()=>{m("boss-fire",this.x,this.y,this.rotation,3)},1200);t(()=>{this.G=!1;this.j=!0},1600)}F(){m("explosion",this.x,this.y,30,3,this.Z);
m("score",10);this.g=0;this.fa.map(a=>clearTimeout(a));m("boss-die")}update(){!this.G&&super.update();!this.G&&(this.j=!0)}v(){super.v();if(this.ka){var a=this.context,b=20*this.h/this.xa;a.save();a.translate(this.width/2,this.height/2);a.rotate(-this.rotation);a.fillStyle="white";a.fillRect(-12,-16,24,6);a.fillStyle="black";a.fillRect(-11,-15,22,4);a.fillStyle="green";this.h<this.xa/4&&(a.fillStyle="red");a.fillRect(-10,-14,b,2);a.restore()}}}class Va extends N{i(a){a={name:"dialog",x:-16,y:200,
za:[10,11,12,13,14],text:D({text:"",x:16,y:8,align:"left"}),K:0,D:[],O:0,ea:0,frame:0,anchor:{x:0,y:0},na:!1,ia:!1,la:!1,ca:!0,...a};super.i(a)}Ja(){0==this.D.length||this.O>this.D.length||(this.K=this.D[this.O].length)}start(a){this.la=!1;setTimeout(()=>{this.ia=!0;this.D=["",...a.D];this.frame=0;this.ca=a.ca},1E3);this.dx=2}stop(){this.la=!0;this.text.text="        ";this.ia=!1;setTimeout(()=>{this.D=[];this.frame=this.K=this.O=0},1E3);this.dx=-2}update(){8<this.x&&(this.dx=0,this.x=8);-16>this.y&&
(this.dx=0,this.x=-16);if(0!=this.D.length){this.na=!1;var a=this.D[this.O]+"      ";" "!==a[this.K]&&(this.na=!0);0==this.frame%5&&(this.K++," "!==a[this.K]&&R(...[1.5,,261,.01,.02,.08,1,1.5,-.5,,,-.5,,,,,.9,.05]));this.O<this.D.length&&(this.text.text=a.slice(0,this.K));this.frame++;this.K>=a.length&&(this.O++,this.K=this.frame=0);this.O>=this.D.length&&!this.la&&this.stop();this.na&&0==this.frame%5&&this.ea++;this.ea>=this.za.length&&(this.ea=0);super.update()}}v(){const a=this.context,b=this.u;
a.fillStyle="white";a.fillRect(-2,-2,12,12);a.drawImage(b[0],8*this.za[this.ea],0,8,8,0,0,8,8);a.translate(16,0);this.text.v()}}class Ra extends N{i(a){super.i({name:"powerup",type:"fire",width:16,height:16,ma:!1,g:600,anchor:{x:.5,y:.5},u:[K["font.png"],8,8],...a})}F(){this.ma=!0;this.g=10;this.frame=0;R(...[1.5,,1E3,,.1,.1,1,1.5,,,,,,,,.1,.5,.1])}v(){const a=this.context,b=this.type,c=this.ma,d=this.frame;let e,h;"shield"===b&&(e="yellow",h=18);"fire"===b&&(e="lightblue",h=15);a.strokeStyle=e;a.lineWidth=
2;10>d%20&&!c&&a.strokeRect(0,0,16,16);a.fillStyle=e;a.fillRect(3,3,10,10);a.drawImage(this.u[0],8*h,0,8,8,4,4,8,8);c&&(a.globalAlpha=1-this.frame/10,a.strokeRect(-this.frame,-this.frame,16+2*this.frame,16+2*this.frame),a.globalAlpha=1)}}const ka=[[{500:[1,1E3,6,!1,!1,1,0,130,"M287 13-21 61l293 46-293 31 293 48-290 52"]},{},{500:["fire",128,.6]},{500:[!1,["A FULL WAVE IS IMINENT","    "]]},[0,10,250,"M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z",
30,8,3,0,30,250]],[{2E3:[3,1E3,3,!0,!1,1,0,200,"M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27"],1E3:[5,1500,6,!1,!1,1,0,130,"M287 13-21 61l293 46-293 31 293 48-290 52"]},{},{500:["fire",128,.6],550:["shield",140,.3]},{},[0,10,200,"M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z",40,32,9,1,60,250]],[{2E3:[3,1E3,3,!0,!1,1,0,200,"M223-33v238c0 42-61 41-61 0V41c0-44-64-44-64 0v164c0 43-71 33-71 0V-27"],
1E3:[5,1500,6,!1,!1,1,0,130,"M287 13-21 61l293 46-293 31 293 48-290 52"],3E3:[5,1500,8,!0,!1,1,0,130,"M287 13-21 61l293 46-293 31 293 48-290 52"],4E3:[5,1500,6,!1,!1,1,0,130,"M287 13-21 61l293 46-293 31 293 48-290 52"],5E3:[5,1500,6,!1,!1,1,0,130,"M287 13-21 61l293 46-293 31 293 48-290 52"]},{2E3:[20,1E3,[20,200,120,180,60,220,180,40,120,60],[.1,-.1,0,-.1,.1,-.1,0,.1,0,.1],[1,.5,.7,.5,.9,.5,1,.8,.4,.7]]},{1500:["fire",128,.6],2500:["shield",140,.3],3500:["fire",128,.6],4500:["shield",140,.3]},{500:[!1,
["A FULL WAVE IS IMINENT","    "]]},[0,10,200,"M127 120V43c0-77 99 8 99 77 0 70-35 102-99 102S22 181 22 120s32-84 84-84 85 32 85 84c0 53-28 62-64 62-35 0-68-18-68-62 0-43 25-47 47-47 21 0 48 24 48 47 0 24-7 28-27 28s0-14 0-28Z",40,32,9,1,60,250]]],xa=ka.length,la={X:null,play(a){this.X=za(...V[a])},stop(){this.X&&this.X.stop()},Ia(a){this.X&&(this.X.loop=a)}};var Ba=zzfxM=(a,b,c,d=125)=>{let e,h,f,q,l,u,y,E,v,w,B,F,z,M,I=0,Q=[],x=[],O=[],P=0,g=0,k=1,p={},n=44100/d*60>>2;for(;k;P++)Q=[k=E=F=0],c.map((r,
G)=>{y=b[r][P]||[0,0,0];k|=!!b[r][P];M=F+(b[r][0].length-2-!E)*n;z=G==c.length-1;h=2;for(q=F;h<y.length+z;E=++h){l=y[h];v=h==y.length+z-1&&z||w!=(y[0]||0)|l|0;for(f=0;f<n&&E;f++>n-99&&v?B+=(1>B)/99:0)u=(1-B)*Q[I++]/2||0,x[q]=(x[q]||0)-u*g+u,O[q]=(O[q++]||0)+u*g+u;l&&(B=l%1,g=y[1]||0,(l|=0)&&(Q=p[[w=y[I=0]||0,l]]=p[[w,l]]||(e=[...a[w]],e[2]*=2**((l-12)/12),0<l?Aa(...e):[])))}F=M});return[x,O]},Xa=[[[,0,77,,,.7,2,.41,,,,,,,,.06],[,0,43,.01,,.3,2,,,,,,,,,.02,.01],[,0,170,.003,,.008,,.97,-35,53,,,,,,
.1],[.8,0,270,,,.12,3,1.65,-2,,,,,4.5,,.02],[,0,86,,,,,.7,,,,.5,,6.7,1,.05],[,0,41,,.05,.4,2,0,,,9,.01,,,,.08,.02],[,0,2200,,,.04,3,2,,,800,.02,,4.8,,.01,.1],[.3,0,16,,,.3,3]],[[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33],[3,1,22,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,24,,,,,,,,,,,,,,,,,,,,,,,,22,,22,,22,,,,],[5,-1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,
,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],[,1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,]],[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33],[3,1,24,,,,,,,,27,,,,,,,,,,,,,,,,27,,,,24,,,,24,,,,,,,,27,,,,,,,,,,,,,,,,24,,24,,24,,,,],[5,-1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],[,
1,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,24,,,,23,,,,,,,,,,,,,,,,,,,,,,,,24,,23,,21,,,,],[6,1,,,34,34,34,,,,,,34,34,,,,,34,,,,34,34,,,,,34,,,,34,,,,34,34,34,,,,,,34,,,,,,34,34,,,34,34,,,,,,,,,34,34],[4,1,,,,,,,24,,,,,,24,,24,,,,24,,,,24,,,,,,,,,,,,,,,,24,,,,,,24,,24,,,,24,,,,24,,,,,,,,,,]],[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,23,23,35,23,23,36,23,23,35,23,23,36,23,23,35,35,23,23,35,23,23,35,23,23,36,23,23,35,23,23,36,36],[5,-1,21,,,19,,,21,
,,,,,,,,,21,,,19,,,17,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[3,1,24,,,24,,,24,,,,,,,,,,24,,,24,,,24,,,,24.75,24.5,24.26,24.01,24.01,24.01,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25],[4,-1,,,,,,,,,,,,,,,,,,,,,,,,,,,24.75,24.5,24.26,24.01,24.01,24.01,24.01,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],[7,-1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,23,,21,23,,35,,23,,21,23,,35,,35,,23,,21,23,,35,,21,23,,35,,21,23,,,],[6,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34,36,34,,33,34,
34,36,31,36,34,,31,34,32,,33,36,34,,31,34,34,36,33,36,33,,31,,,]],[[1,-1,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,21,21,33,21,21,33,21,21,33,21,21,33,21,21,33,33,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29],[4,1,24,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],[7,-1,21,,19,21,,33,,21,,19,21,,33,,33,,21,,19,21,,33,,21,,19,21,,33,,33,,17,
,17,17,29,17,17,29,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29],[2,1,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,,,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,34,34,,34,,,],[6,1,,,36,,,,,,36,,36,,,,,,,,36,,,,,,36,,36,,,,,,,,36,,,,,,,,,,,,,,,,36,,,,,,36,,36,,,,,,],[3,1,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25,,,,,25,,,,,25,,,25,,,,,,,,25,,,,,,,,25,25,25,25]],[[1,-1,14,14,26,14,14,26,14,14,26,14,14,26,14,14,26,26,14,14,26,
14,14,26,14,14,26,14,14,26,14,14,26,26,17,17,29,17,17,29,17,17,29,17,17,29,17,17,29,29,19,19,31,19,19,31,19,19,31,19,19,31,19,19,31,31],[4,1,24,24,,24,24,,24,24,24,24,,24,24,,24,,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,24,24,24,24,,24,24,,36,,24,24,,24,24,,24,24,24,24,,24,24,,24,24],[7,-1,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,14,,14,14,26,14,14,26,17,,17,17,29,17,17,29,17,,17,17,29,17,17,29,19,,19,19,31,19,19,31,19,,19,19,31,19,19,31],[2,1,,36,36,36,,36,36,
36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,,,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,36,36,,36,,,],[3,1,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25,,,,,25,,,,,,,,25,,,,,,,,25,,,,,,,,25,25,25,25],[6,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34,,,,,,34,,34,,,,,,,,34,,,,,,34,,34,,,,,,]]],[0,1,1,2,3,4,4]],Ya=[[[.4,0,1E4,,,,,,,,,,.01,6.8,-.2],[1.4,0,84,,,,,.7,,,,.5,,6.7,1,.01],[,0,60,,.1,,2],[2,0,360,,,.12,2,2,,,,,,9,,.1],[.75,0,586,,,.25,6],[2,0,360,,,.375,2,3.5],[1.2,
0,490,,.25,.45,,,,,,,.2,,,,,,,.1],[.75,0,386,,,.25,6]],[[[,-1,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,],[2,-1,,20,8,8,20,8,,8,,20,,8,20,8,,20,,20,8,8,20,8,,8,,20,,8,20,8,,8,,20,8,8,20,8,,8,,20,,8,20,8,,8,,20,8,8,20,8,,8,,20,,8,20,8,,20],[,1,32,22,22,32,32,22,32,27,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,27,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,27,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,,20,,,20,
,,20,20.5,20,,,20,,,20,,20,,,20,,,20,20.5,20,,,20,,,20,,20,,,20,,,20,20.5,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[4,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,24.75,20.75,,,,,,,24.75,20.75,,,,21.75,20.75,,24.75,20.75,,,,,,,24.75,20.75,,,,21.75,20.75]],[[,-1,8,,,,,,8,,8,,,,,,8,,6,,,,,,6,,6,,,,,,6,,13,,,,,,13,,13,,,,,,13,,8,,,,,,8,,8,,,,,,8,,],[2,-1,,20,8,8,20,8,,8,,20,,8,20,8,,20,,18,6,6,18,6,,18,,18,,6,18,6,,6,,25,13,13,25,
13,,13,,25,13.75,13,25,13,,25,,20,8,8,20,8,,8,,20,,8,20,8,,20],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[5,1,20,20,
15,,18,,13,15,,11,,6,8,,18,20,11,11,13,,10,,13,18,23,23,22,,18,,13,,11,11,13,,25,,11,13,25,25,11,,13,,6,,8,,,,,,,,,,,,,,,,]],[[,-1,6,,,,,,6,,6,,,,,,6,,11,,,,,,11,,11,,,,,,11,,13,,,,,,13,,13,,,,,,13,,8,,,,,,8,,8,,,,,,8,,],[2,-1,,18,6,6,18,6,,6,,18,,6,18,6,,6,,23,11,11,23,11,,23,,23,,11,23,11,,11,,25,13,13,25,13,,13,,25,13.75,13,25,13,,25,,20,8,8,20,8,,8,,20,,8,20,8,,20],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,
22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[5,1,18,18,13,,11,,10,11,,11,,13,10,,11,13,23,23,22,,18,,13,,11,10,,18,11,,11,18,11,11,13,,25,,18,23,25,23,18,,23,23,18,,20,,20,18,11,,6,8,,,,,,,,,]],[[,-1,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,],[2,-1,
,20,8,8,20,8,,8,,20,,8,20,8,,20,,20,8,8,20,8,,8,,20,,8,20,8,,8],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.5,20,,,20,,,20,,20,,,20,,,20,20.5],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,]],[[,-1,11,,,,,,11,,11,,,,,,11,,11,,,,,,11,,11,,,,,,11,,16,,,,,,16,,16,,,,,,16,,16,,,,,,16,,16,,,,,,16,,],[2,-1,,23,11,11,23,11,,11,,23,,11,23,11,,23,,23,11,11,23,11,,11,,23,,11,23,11,,11,,28,16,16,28,16,,16,,28,,16,
28,16,,16,,28,16,16,28,16,,16,,28,,16,28,16,,16],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,15,,,,,,,,,,,,,,,,18,
,,,,,,,,,,,15,18,15,18,18,,,,20,,,,,,,,,,,,23,,,,,,,,,,,,20,23,20,23]],[[,-1,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,15,,,,,,15,,15,,,,,,15,,15,,,,,,15,,15,,,,,,15,,],[2,-1,,25,13,13,25,13,,25,,25,,13,25,13,,13,,25,13,13,25,13,,25,,25,,13,25,13,,25,,27,15,15,27,15,,27,,27,,15,27,15,,15,,27,15,15,27,15,,27,,27,,15,27,15,,15],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,
22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,25,,,,,,,,,,,,,,,,,,,,,,,,,,,,20,23,25,,27,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,]],[[2,-1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,
32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[4,1,3,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,,,,,,,,,],[7,1,,,,,,,,,,,,,,,,,,,,,,,,,18,18,,18,13,13,10,10]],[[,-1,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,],[2,-1,,16,4,4,16,4,,16,,16,,4,16,4,,16,,16,4,4,16,4,,4,,16,,4,16,4,,4,,25,13,13,25,13,,13,,25,,13,25,13,,13,,25,13,13,25,13,,25,,25,,13,25,13,,13],[,1,
32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,4,,,,,,11,,,,,,16,,,,21,,,,,,20,,,,,,20,,,,11,,,,,,13,,,,,,13,,,,11,,,,,
,13,,,13,,,11,11,13,13]],[[,-1,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,],[2,-1,,20,8,8,20,8,,8,,20,,8,20,8,,20,,20,8,8,20,8,,8,,20,,8,20,8,,8,,18,6,6,18,6,,18,,18,,6,18,6,,18,,18,6,6,18,6,,18,,18,,6,18,6,,18],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,
,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,8,,,,,,18,,,,,,,,,,11,,,,,,22,,,,,,,,,,,,,,18,,,,,,,,,,,,18,18,18,18,18,18,18,18,20,20,20,20,18,18,18,18]],[[,-1,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,],[2,-1,,16,4,4,16,4,,16,,16,,4,16,4,,16,,16,4,4,16,4,,4,,16,,4,16,4,,4,,25,13,13,25,13,,13,,25,,13,25,13,,13,,25,13,13,
25,13,,25,,25,,13,25,13,,13],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,4.25,,,,16,,16,,,,,,,,16,,,,18,,15,,,,13,
,11,,,,,,1,,,,16,,16,,,,,,,,21,,,,23,,20,,,,18,,16,,11,,9,,]],[[,-1,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,],[2,-1,,20,8,8,20,8,,8,,20,,8,20,8,,20,,20,8,8,20,8,,8,,20,,8,20,8,,8,,18,6,6,18,6,,18,,18,,6,18,6,,18,,18,6,6,18,6,,18,,18,,6,18,6,,18],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,
22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,11,,,,,,9,,,,,,8,,,,16,,,,,,15,,,,,,15,,,,6,,,,,,13,,,,,,18,,,,23,22.5,22.5,22.37,22.37,22.5,22.5,22.37,22.37,22.5,22.5,22.37,22.37,22.5,22.5,22.37]],[[,-1,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,],[2,-1,,16,4,4,16,4,,16,,16,,4,16,4,,16,
,16,4,4,16,4,,4,,16,,4,16,4,,4,,25,13,13,25,13,,13,,25,,13,25,13,,13,,25,13,13,25,13,,25,,25,,13,25,13,,13],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,
,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,4,,,,,,,,,,,,,,,,,16,16,16,15,16,16,16,15,16,16,16,4,,6,,8,,,,,,,,,,,,,,,,,20,20,20,19,20,20,20,19,20,20,20,8,,9,,]],[[,-1,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,],[2,-1,,20,8,8,20,8,,8,,20,,8,20,8,,20,,20,8,8,20,8,,8,,20,,8,20,8,,8,,18,6,6,18,6,,18,,18,,6,18,6,,18,,18,6,6,18,6,,18,,18,,6,18,6,,18],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,
22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,20,,,,,,21,,,,,,20,,,,16,,,,15,,11,,,,8,,,,,,6,,,,,,13,,,,,,18,,,,30,,,,,,25,,23,,22,,18,,13,,]],[[,-1,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,4,,,,,,4,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,,13,,,,,,13,
,],[2,-1,,16,4,4,16,4,,16,,16,,4,16,4,,16,,16,4,4,16,4,,4,,16,,4,16,4,,4,,25,13,13,25,13,,13,,25,,13,25,13,,13,,25,13,13,25,13,,25,,25,,13,25,13,,13],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,
,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,4.25,,3,,4,,11,,16,,,,23,,20,,8,,8.25,,20,,,,21,,,,23,,,,,,,,23,,,,21,,,,20,,8,8,8,1,3,,4,,8,,13,,16,,20,,21,,]],[[,-1,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,8,,,,,,8,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,6,,,,,,6,,],[2,-1,,20,8,8,20,8,,8,,20,,8,20,8,,20,,20,8,8,20,8,,8,,20,,8,20,8,,8,,18,6,6,18,6,,18,,18,,6,18,6,,18,,18,6,6,18,6,,18,,18,,6,18,6,,18],[,1,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,
32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32,32,22,22,32,32,22,32,22,32,22,22,32,32,22,32,32],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,],[6,1,11,,,,,,,,,,,,,,,,,23,23,23,22,23,21,,20,,15,,11,,8,,6,,,,,,8,,,,,,10,,,,11,,,,,,13,,,,,,16,,,,]],[[4,-1,15,15,15,,15,,15,15,,15,,15,15,,15,15,15,15,15,,
15,,15,15,27,15,,15,15,,15,15,15,15,15,,15,,15,15,15,15,15,,15,15,15,,15,,15,15,15,,15,15,,,,,,,,,],[1,-1,20,,,20,,,20,22.5,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25,20,,,20,,,20,,20,,,20,,,20,20.25],[,-1,,22,22,,,22,,,,22,22,,,22,,,,22,22,,,22,,22,,22,22,,,22,,,,22,22,,,22,,22,,22,22,,,22,,,,22,22,,,22,,22,,22,22,,,22,,,],[3,-1,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,,,,,32,,,,]]],[0,1,2,3,2,4,5,6,1,2,3,7,10,9,8,13,12,11,14,
4,5,15,6]];const aa=function(a){window.T=window.T||{};return window.T.context=a}(document.getElementById("c").getContext("2d"));aa.imageSmoothingEnabled=!1;aa.setTransform(1,0,0,1,0,0);aa.filter="url(#remove-alpha)";(async()=>{Ia();await sa("song1",Ba,Xa);await sa("song2",Ba,Ya);await ba("font.png");await ba("spritesheet.png");await ba("spritesheet16.png");A("change-scene",(b,c)=>{Da(["change-scene"]);aa.filter="url(#remove-alpha)";la.stop();switch(b){case "game":a=Ta();break;case "menu":a=ya();break;
case "game-over":console.log("game-over",c),a=Wa(c)}});let a=ya();Ca({update(b){a.update(b)},C(){a.C()}}).start()})()})();
