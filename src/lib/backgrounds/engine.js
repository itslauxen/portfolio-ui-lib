/* eslint-disable */
// @ts-nocheck
// ============================================================================
// Motor de fundos animados, portado fielmente de myBackgrounds (index.html).
// Cada efeito é uma funcao pura: fn(canvas, getP) => { stop() }.
// getP() devolve os parametros atuais (lidos a cada frame => edicao ao vivo).
// NAO editar a mao: para adicionar efeitos, use reg({...}) no mesmo formato.
// ============================================================================

function PRELUDE_FN(){
  const W = (typeof window!=='undefined')?window:globalThis;
  W.TAU = Math.PI*2;
  W.clamp = (v,a,b)=>v<a?a:(v>b?b:v);
  W.lerp = (a,b,t)=>a+(b-a)*t;
  W.rand = (a,b)=> (b===undefined)? Math.random()*a : a+Math.random()*(b-a);
  W.randInt = (a,b)=>Math.floor(W.rand(a,b+1));
  W.pick = arr=>arr[Math.floor(Math.random()*arr.length)];
  W.hexToRgb = function(h){
    h=(h||'#000').replace('#','');
    if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    const n=parseInt(h,16);
    return {r:(n>>16)&255, g:(n>>8)&255, b:n&255};
  };
  W.rgbCss = (r,g,b,a)=> a===undefined? `rgb(${r|0},${g|0},${b|0})` : `rgba(${r|0},${g|0},${b|0},${a})`;
  W.lerpHex = function(h1,h2,t){
    const a=W.hexToRgb(h1), b=W.hexToRgb(h2);
    return [a.r+(b.r-a.r)*t, a.g+(b.g-a.g)*t, a.b+(b.b-a.b)*t];
  };
  // paleta a partir de N cores hex -> retorna [r,g,b] em t (0..1)
  W.paletteAt = function(cols, t){
    t=W.clamp(t,0,1)*(cols.length-1);
    const i=Math.floor(t), f=t-i;
    if(i>=cols.length-1) return W.hexToRgb(cols[cols.length-1]);
    return (function(){const v=W.lerpHex(cols[i],cols[i+1],f);return {r:v[0],g:v[1],b:v[2]};})();
  };
  W.setCol = function(gl,loc,hex){ const c=W.hexToRgb(hex); gl.uniform3f(loc, c.r/255,c.g/255,c.b/255); };
  W.rgbaHex = function(h,a){ const c=W.hexToRgb(h); return 'rgba('+(c.r|0)+','+(c.g|0)+','+(c.b|0)+','+a+')'; };
  W.lightenHex = function(h,t){ const c=W.hexToRgb(h); return 'rgb('+Math.round(c.r+(255-c.r)*t)+','+Math.round(c.g+(255-c.g)*t)+','+Math.round(c.b+(255-c.b)*t)+')'; };
  W.svgEl = function(n){ return document.createElementNS('http://www.w3.org/2000/svg', n); };
  // ---- canvas 2D fit (dpr-aware). retorna {w,h} em pixels do device ----
  W.MAXPIX = 8294400; // teto p/ efeitos 2D leves (4K, mantém nitidez em retina)
  W.fit = function(canvas, maxDpr, maxPix){
    maxDpr = maxDpr||2;
    maxPix = maxPix||W.MAXPIX;
    let dpr = Math.min(window.devicePixelRatio||1, maxDpr);
    const cw = canvas.clientWidth || canvas.width || 1;
    const ch = canvas.clientHeight || canvas.height || 1;
    let w = Math.max(1, Math.round(cw*dpr)), h = Math.max(1, Math.round(ch*dpr));
    if(w*h > maxPix){ const s=Math.sqrt(maxPix/(w*h)); w=Math.max(1,Math.round(w*s)); h=Math.max(1,Math.round(h*s)); }
    if(canvas.width!==w || canvas.height!==h){ canvas.width=w; canvas.height=h; }
    return {w:canvas.width, h:canvas.height, dpr:(w/cw)};
  };
  // ---- noise (simplex 2D/3D, Gustavson, compacto) ----
  W.Noise = (function(){
    const grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    const perm=new Uint8Array(512), p=new Uint8Array(256);
    for(let i=0;i<256;i++) p[i]=i;
    for(let i=255;i>0;i--){const n=Math.floor(Math.random()*(i+1));const t=p[i];p[i]=p[n];p[n]=t;}
    for(let i=0;i<512;i++) perm[i]=p[i&255];
    const F2=0.5*(Math.sqrt(3)-1), G2=(3-Math.sqrt(3))/6;
    const F3=1/3, G3=1/6;
    function dot2(g,x,y){return g[0]*x+g[1]*y;}
    function dot3(g,x,y,z){return g[0]*x+g[1]*y+g[2]*z;}
    function n2(xin,yin){
      let s=(xin+yin)*F2, i=Math.floor(xin+s), j=Math.floor(yin+s);
      let t=(i+j)*G2, X0=i-t, Y0=j-t, x0=xin-X0, y0=yin-Y0;
      let i1,j1; if(x0>y0){i1=1;j1=0;}else{i1=0;j1=1;}
      let x1=x0-i1+G2, y1=y0-j1+G2, x2=x0-1+2*G2, y2=y0-1+2*G2;
      let ii=i&255, jj=j&255;
      let g0=perm[ii+perm[jj]]%12, g1=perm[ii+i1+perm[jj+j1]]%12, g2=perm[ii+1+perm[jj+1]]%12;
      let t0=0.5-x0*x0-y0*y0, n0=t0<0?0:(t0*=t0,t0*t0*dot2(grad3[g0],x0,y0));
      let t1=0.5-x1*x1-y1*y1, n1=t1<0?0:(t1*=t1,t1*t1*dot2(grad3[g1],x1,y1));
      let t2=0.5-x2*x2-y2*y2, nn=t2<0?0:(t2*=t2,t2*t2*dot2(grad3[g2],x2,y2));
      return 70*(n0+n1+nn);
    }
    function n3(xin,yin,zin){
      let s=(xin+yin+zin)*F3, i=Math.floor(xin+s), j=Math.floor(yin+s), k=Math.floor(zin+s);
      let t=(i+j+k)*G3, x0=xin-(i-t), y0=yin-(j-t), z0=zin-(k-t);
      let i1,j1,k1,i2,j2,k2;
      if(x0>=y0){ if(y0>=z0){i1=1;j1=0;k1=0;i2=1;j2=1;k2=0;} else if(x0>=z0){i1=1;j1=0;k1=0;i2=1;j2=0;k2=1;} else {i1=0;j1=0;k1=1;i2=1;j2=0;k2=1;} }
      else { if(y0<z0){i1=0;j1=0;k1=1;i2=0;j2=1;k2=1;} else if(x0<z0){i1=0;j1=1;k1=0;i2=0;j2=1;k2=1;} else {i1=0;j1=1;k1=0;i2=1;j2=1;k2=0;} }
      let x1=x0-i1+G3,y1=y0-j1+G3,z1=z0-k1+G3, x2=x0-i2+2*G3,y2=y0-j2+2*G3,z2=z0-k2+2*G3, x3=x0-1+3*G3,y3=y0-1+3*G3,z3=z0-1+3*G3;
      let ii=i&255,jj=j&255,kk=k&255;
      let g0=perm[ii+perm[jj+perm[kk]]]%12, g1=perm[ii+i1+perm[jj+j1+perm[kk+k1]]]%12, g2=perm[ii+i2+perm[jj+j2+perm[kk+k2]]]%12, g3=perm[ii+1+perm[jj+1+perm[kk+1]]]%12;
      let t0=0.6-x0*x0-y0*y0-z0*z0, n0=t0<0?0:(t0*=t0,t0*t0*dot3(grad3[g0],x0,y0,z0));
      let t1=0.6-x1*x1-y1*y1-z1*z1, n1=t1<0?0:(t1*=t1,t1*t1*dot3(grad3[g1],x1,y1,z1));
      let t2=0.6-x2*x2-y2*y2-z2*z2, n2v=t2<0?0:(t2*=t2,t2*t2*dot3(grad3[g2],x2,y2,z2));
      let t3=0.6-x3*x3-y3*y3-z3*z3, n3v=t3<0?0:(t3*=t3,t3*t3*dot3(grad3[g3],x3,y3,z3));
      return 32*(n0+n1+n2v+n3v);
    }
    return {n2,n3};
  })();
  // ---- GLSL noise/fbm (interpolado no frag dos shaders) ----
  W.GNOISE = [
    'float hash21(vec2 p){p=fract(p*vec2(123.34,345.45));p+=dot(p,p+34.345);return fract(p.x*p.y);}',
    'float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);',
    ' float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));',
    ' return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}',
    'float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<6;i++){v+=a*vnoise(p);p*=2.02;a*=0.5;}return v;}'
  ].join('\n');
  // ---- WebGL fullscreen fragment-shader runner ----
  W.GLBG = function(canvas, getP, frag, setUniforms){
    const gl = canvas.getContext('webgl',{antialias:false,alpha:false,preserveDrawingBuffer:false}) || canvas.getContext('experimental-webgl');
    if(!gl){ const c=canvas.getContext('2d'); if(c){c.fillStyle='#101018';c.fillRect(0,0,canvas.width,canvas.height);} return {stop(){}}; }
    function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) console.error('shader',gl.getShaderInfoLog(s),src); return s;}
    const prog=gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}'));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER,'precision highp float;\n'+frag));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const aloc=gl.getAttribLocation(prog,'p'); gl.enableVertexAttribArray(aloc); gl.vertexAttribPointer(aloc,2,gl.FLOAT,false,0,0);
    const uCache={}; function u(name){ if(!(name in uCache)) uCache[name]=gl.getUniformLocation(prog,name); return uCache[name]; }
    let raf, stopped=false, start=performance.now();
    function frame(){
      if(stopped) return;
      W.fit(canvas, 1.5, 2000000);
      gl.viewport(0,0,canvas.width,canvas.height);
      const t=(performance.now()-start)/1000, P=getP()||{};
      gl.uniform1f(u('u_time'), t);
      gl.uniform2f(u('u_res'), canvas.width, canvas.height);
      try{ setUniforms({gl,u,P,t}); }catch(e){}
      gl.drawArrays(gl.TRIANGLES,0,3);
      raf=requestAnimationFrame(frame);
    }
    frame();
    return { stop(){ stopped=true; cancelAnimationFrame(raf);
      const ext=gl.getExtension('WEBGL_lose_context'); if(ext) ext.loseContext(); } };
  };
  // ---- gerador de shader raymarch (voo por túnel, iluminado, em loop) ----
  W.rmFrag = function(mapBody){
    return 'uniform float u_time,u_speed,u_density,u_glow;uniform vec2 u_res;uniform vec3 u_c1,u_c2,u_c3;'+
      'mat2 r2(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}'+
      'float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}'+
      'float sdTorus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}'+
      'float sdOct(vec3 p,float s){p=abs(p);return (p.x+p.y+p.z-s)*0.57735;}'+
      'float map(vec3 p){'+mapBody+'}'+
      'vec3 nrm(vec3 p){vec2 e=vec2(0.0025,0.0);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}'+
      'void main(){vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;float t=u_time*u_speed;'+
      'vec3 ro=vec3(sin(t*0.3)*0.5,cos(t*0.4)*0.5,mod(t*3.0,u_density));'+
      'vec3 ta=ro+vec3(sin(t*0.25)*0.3,sin(t*0.2)*0.3,1.0);'+
      'vec3 fwd=normalize(ta-ro);vec3 rgt=normalize(cross(vec3(0.0,1.0,0.0),fwd));vec3 up=cross(fwd,rgt);'+
      'vec3 rd=normalize(uv.x*rgt+uv.y*up+1.4*fwd);rd.xy*=r2(t*0.1);'+
      'float dd=0.0,g=0.0,hit=0.0;'+
      'for(int i=0;i<64;i++){vec3 p=ro+rd*dd;float m=map(p);g+=u_glow/(abs(m)+0.06);if(m<0.001){hit=1.0;break;}if(dd>40.0)break;dd+=m*0.8;}'+
      'vec3 col=u_c1*0.15;'+
      'if(hit>0.5){vec3 p=ro+rd*dd;vec3 n=nrm(p);float diff=clamp(dot(n,normalize(vec3(0.4,0.7,-0.5)))*0.5+0.5,0.0,1.0);'+
      'float fres=pow(1.0-clamp(dot(n,-rd),0.0,1.0),3.0);col=mix(u_c1,u_c2,diff)*diff+u_c3*fres*1.3;}'+
      'col+=u_c2*g*0.013;col*=1.0-clamp(dd*0.02,0.0,0.92);'+
      'gl_FragColor=vec4(col,1.0);}';
  };
  W.rmUniforms = function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);gl.uniform1f(g.u('u_density'),P.density);gl.uniform1f(g.u('u_glow'),P.glow);setCol(gl,g.u('u_c1'),P.c1);setCol(gl,g.u('u_c2'),P.c2);setCol(gl,g.u('u_c3'),P.c3);};
}
PRELUDE_FN();

/* =========================================================================
   Registro de fundos. Cada item:
   { id, name, cat, desc, params:[...], fn:function(canvas,getP){...return {stop}} }
   getP() devolve os parâmetros atuais (lidos a cada frame -> edição ao vivo).
   ========================================================================= */
const EFFECTS = [];
function reg(o){ EFFECTS.push(o); }
/* ====================== 1. FLUIDO (enviado) ====================== */
reg({
  id:'fluid', name:'Simulação de Fluido', cat:'Fluido', heavy:true,
  desc:'Navier-Stokes na GPU (WebGL) com respingos coloridos automáticos. Reage ao mouse.',
  params:[
    {key:'simSpeed',label:'Velocidade do fluido',type:'range',min:0.15,max:1.5,step:0.05,default:1},
    {key:'auto',label:'Pulsos automáticos',type:'bool',default:true},
    {key:'trail',label:'Rastro de cor',type:'range',min:0.90,max:0.995,step:0.001,default:0.97},
    {key:'velDiss',label:'Dissipação',type:'range',min:0.90,max:0.999,step:0.001,default:0.98},
    {key:'curl',label:'Turbulência',type:'range',min:0,max:50,step:1,default:30},
    {key:'radius',label:'Raio do respingo',type:'range',min:0.05,max:0.6,step:0.01,default:0.25},
    {key:'force',label:'Força',type:'range',min:1000,max:10000,step:100,default:6000},
    {key:'interval',label:'Intervalo auto (s)',type:'range',min:0.1,max:1.5,step:0.05,default:0.55},
    {key:'bright',label:'Brilho',type:'range',min:0.3,max:2.5,step:0.05,default:1},
    {key:'mode',label:'Cores',type:'select',options:[['rainbow','Arco-íris'],['palette','Paleta']],default:'rainbow'},
    {key:'c1',label:'Cor 1',type:'color',default:'#ff3d81'},
    {key:'c2',label:'Cor 2',type:'color',default:'#3d6bff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#00e5ff'}
  ],
  fn:function(canvas, getP){
    const params={alpha:false,depth:false,stencil:false,antialias:false,preserveDrawingBuffer:false};
    let gl=canvas.getContext('webgl2',params); const isWebGL2=!!gl;
    if(!isWebGL2) gl=canvas.getContext('webgl',params)||canvas.getContext('experimental-webgl',params);
    if(!gl){ return {stop(){}}; }
    let halfFloat, supportLinearFiltering;
    if(isWebGL2){ gl.getExtension('EXT_color_buffer_float'); supportLinearFiltering=gl.getExtension('OES_texture_float_linear'); }
    else { halfFloat=gl.getExtension('OES_texture_half_float'); supportLinearFiltering=gl.getExtension('OES_texture_half_float_linear'); }
    gl.clearColor(0,0,0,1);
    const halfFloatTexType=isWebGL2?gl.HALF_FLOAT:(halfFloat?halfFloat.HALF_FLOAT_OES:0);
    function supF(internalFormat,format,type){
      const tex=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,internalFormat,4,4,0,format,type,null);
      const fbo=gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;
    }
    function getFmt(internalFormat,format,type){
      if(!supF(internalFormat,format,type)){
        if(isWebGL2){ if(internalFormat===gl.R16F) return getFmt(gl.RG16F,gl.RG,type);
          if(internalFormat===gl.RG16F) return getFmt(gl.RGBA16F,gl.RGBA,type); }
        return null;
      }
      return {internalFormat,format};
    }
    let rgba,rg,r;
    if(isWebGL2){ rgba=getFmt(gl.RGBA16F,gl.RGBA,halfFloatTexType); rg=getFmt(gl.RG16F,gl.RG,halfFloatTexType); r=getFmt(gl.R16F,gl.RED,halfFloatTexType); }
    else { rgba=getFmt(gl.RGBA,gl.RGBA,halfFloatTexType); rg=getFmt(gl.RGBA,gl.RGBA,halfFloatTexType); r=getFmt(gl.RGBA,gl.RGBA,halfFloatTexType); }
    function cs(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
    function cp(vs,fs){const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);return p;}
    function unis(p){const u={};const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const nm=gl.getActiveUniform(p,i).name;u[nm]=gl.getUniformLocation(p,nm);}return u;}
    function Prog(vs,fs){const o={program:cp(vs,fs)};o.uniforms=unis(o.program);o.bind=()=>gl.useProgram(o.program);return o;}
    const baseV=cs(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aPosition;varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;uniform vec2 texelSize;void main(){vUv=aPosition*0.5+0.5;vL=vUv-vec2(texelSize.x,0.0);vR=vUv+vec2(texelSize.x,0.0);vT=vUv+vec2(0.0,texelSize.y);vB=vUv-vec2(0.0,texelSize.y);gl_Position=vec4(aPosition,0.0,1.0);}`);
    const copyF=cs(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
    const dispF=cs(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture;void main(){vec3 c=texture2D(uTexture,vUv).rgb;float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`);
    const splatF=cs(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1.0);}`);
    const advF=cs(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity;uniform sampler2D uSource;uniform vec2 texelSize;uniform float dt;uniform float dissipation;void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;gl_FragColor=dissipation*texture2D(uSource,coord);gl_FragColor.a=1.0;}`);
    const divF=cs(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x;float R=texture2D(uVelocity,vR).x;float T=texture2D(uVelocity,vT).y;float B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.0)L=-C.x;if(vR.x>1.0)R=-C.x;if(vT.y>1.0)T=-C.y;if(vB.y<0.0)B=-C.y;float div=0.5*(R-L+T-B);gl_FragColor=vec4(div,0.0,0.0,1.0);}`);
    const curlF=cs(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y;float R=texture2D(uVelocity,vR).y;float T=texture2D(uVelocity,vT).x;float B=texture2D(uVelocity,vB).x;float vorticity=R-L-T+B;gl_FragColor=vec4(0.5*vorticity,0.0,0.0,1.0);}`);
    const vortF=cs(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;uniform sampler2D uVelocity;uniform sampler2D uCurl;uniform float curl;uniform float dt;void main(){float L=texture2D(uCurl,vL).x;float R=texture2D(uCurl,vR).x;float T=texture2D(uCurl,vT).x;float B=texture2D(uCurl,vB).x;float C=texture2D(uCurl,vUv).x;vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+0.0001;force*=curl*C;force.y*=-1.0;vec2 velocity=texture2D(uVelocity,vUv).xy;velocity+=force*dt;velocity=min(max(velocity,-1000.0),1000.0);gl_FragColor=vec4(velocity,0.0,1.0);}`);
    const presF=cs(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uPressure;uniform sampler2D uDivergence;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;float divergence=texture2D(uDivergence,vUv).x;float pressure=(L+R+B+T-divergence)*0.25;gl_FragColor=vec4(pressure,0.0,0.0,1.0);}`);
    const gradF=cs(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;uniform sampler2D uPressure;uniform sampler2D uVelocity;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;vec2 velocity=texture2D(uVelocity,vUv).xy;velocity.xy-=vec2(R-L,T-B);gl_FragColor=vec4(velocity,0.0,1.0);}`);
    const copyP=Prog(baseV,copyF),dispP=Prog(baseV,dispF),splatP=Prog(baseV,splatF),advP=Prog(baseV,advF),divP=Prog(baseV,divF),curlP=Prog(baseV,curlF),vortP=Prog(baseV,vortF),presP=Prog(baseV,presF),gradP=Prog(baseV,gradF);
    const blit=(()=>{gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(0);
      return t=>{ if(t==null){gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.bindFramebuffer(gl.FRAMEBUFFER,null);} else {gl.viewport(0,0,t.width,t.height);gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);} gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0); };})();
    let dye,velocity,divergence,curl,pressure;
    function cFBO(w,h,iF,f,ty,pa){const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,pa);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,pa);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,iF,w,h,0,f,ty,null);const fbo=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);gl.viewport(0,0,w,h);gl.clear(gl.COLOR_BUFFER_BIT);return{texture:tex,fbo,width:w,height:h,texelSizeX:1/w,texelSizeY:1/h,attach(id){gl.activeTexture(gl.TEXTURE0+id);gl.bindTexture(gl.TEXTURE_2D,tex);return id;}};}
    function cDFBO(w,h,iF,f,ty,pa){let f1=cFBO(w,h,iF,f,ty,pa),f2=cFBO(w,h,iF,f,ty,pa);return{width:w,height:h,texelSizeX:f1.texelSizeX,texelSizeY:f1.texelSizeY,get read(){return f1;},set read(v){f1=v;},get write(){return f2;},set write(v){f2=v;},swap(){const t=f1;f1=f2;f2=t;}};}
    function getRes(res){let ar=gl.drawingBufferWidth/gl.drawingBufferHeight;if(ar<1)ar=1/ar;const mn=Math.round(res),mx=Math.round(res*ar);return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx};}
    function initFBO(){const sr=getRes(128),dr=getRes(1024),ty=halfFloatTexType,fl=supportLinearFiltering?gl.LINEAR:gl.NEAREST;gl.disable(gl.BLEND);dye=cDFBO(dr.width,dr.height,rgba.internalFormat,rgba.format,ty,fl);velocity=cDFBO(sr.width,sr.height,rg.internalFormat,rg.format,ty,fl);divergence=cFBO(sr.width,sr.height,r.internalFormat,r.format,ty,gl.NEAREST);curl=cFBO(sr.width,sr.height,r.internalFormat,r.format,ty,gl.NEAREST);pressure=cDFBO(sr.width,sr.height,r.internalFormat,r.format,ty,gl.NEAREST);}
    const pointer={x:0,y:0,dx:0,dy:0,moved:false,color:[0,0,0]};
    function HSV(h,s,v){let r,g,b;const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);switch(i%6){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;break;}return{r,g,b};}
    function genColor(P){let c;if(P.mode==='palette'){const pc=paletteAt([P.c1,P.c2,P.c3],Math.random());c={r:pc.r/255,g:pc.g/255,b:pc.b/255};}else c=HSV(Math.random(),1,1);return{r:c.r*0.15,g:c.g*0.15,b:c.b*0.15};}
    function correctRadius(rd){const ar=canvas.width/canvas.height;if(ar>1)rd*=ar;return rd;}
    function splat(x,y,dx,dy,color,P){splatP.bind();gl.uniform1i(splatP.uniforms.uTarget,velocity.read.attach(0));gl.uniform1f(splatP.uniforms.aspectRatio,canvas.width/canvas.height);gl.uniform2f(splatP.uniforms.point,x,y);gl.uniform3f(splatP.uniforms.color,dx,dy,0);gl.uniform1f(splatP.uniforms.radius,correctRadius(P.radius/100));blit(velocity.write);velocity.swap();gl.uniform1i(splatP.uniforms.uTarget,dye.read.attach(0));gl.uniform3f(splatP.uniforms.color,color.r,color.g,color.b);blit(dye.write);dye.swap();}
    function randomSplat(P){const color=genColor(P);color.r*=10*P.bright;color.g*=10*P.bright;color.b*=10*P.bright;const x=Math.random(),y=Math.random(),a=Math.random()*TAU,fc=1000+Math.random()*1000;splat(x,y,Math.cos(a)*fc,Math.sin(a)*fc,color,P);}
    let last=Date.now(),autoTimer=0,raf,stopped=false,lastW=0,lastH=0;
    function dtime(){const n=Date.now();let dt=(n-last)/1000;dt=Math.min(dt,0.0166);last=n;return dt;}
    function resize(){const f=fit(canvas,2,2400000);if(f.w!==lastW||f.h!==lastH){lastW=f.w;lastH=f.h;return true;}return false;}
    function step(dt,P){gl.disable(gl.BLEND);
      curlP.bind();gl.uniform2f(curlP.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(curlP.uniforms.uVelocity,velocity.read.attach(0));blit(curl);
      vortP.bind();gl.uniform2f(vortP.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(vortP.uniforms.uVelocity,velocity.read.attach(0));gl.uniform1i(vortP.uniforms.uCurl,curl.attach(1));gl.uniform1f(vortP.uniforms.curl,P.curl);gl.uniform1f(vortP.uniforms.dt,dt);blit(velocity.write);velocity.swap();
      divP.bind();gl.uniform2f(divP.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(divP.uniforms.uVelocity,velocity.read.attach(0));blit(divergence);
      copyP.bind();gl.uniform1i(copyP.uniforms.uTexture,pressure.read.attach(0));blit(pressure.write);pressure.swap();
      presP.bind();gl.uniform2f(presP.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(presP.uniforms.uDivergence,divergence.attach(0));for(let i=0;i<20;i++){gl.uniform1i(presP.uniforms.uPressure,pressure.read.attach(1));blit(pressure.write);pressure.swap();}
      gradP.bind();gl.uniform2f(gradP.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(gradP.uniforms.uPressure,pressure.read.attach(0));gl.uniform1i(gradP.uniforms.uVelocity,velocity.read.attach(1));blit(velocity.write);velocity.swap();
      advP.bind();gl.uniform2f(advP.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY);gl.uniform1i(advP.uniforms.uVelocity,velocity.read.attach(0));gl.uniform1i(advP.uniforms.uSource,velocity.read.attach(0));gl.uniform1f(advP.uniforms.dt,dt);gl.uniform1f(advP.uniforms.dissipation,P.velDiss);blit(velocity.write);velocity.swap();
      gl.uniform1i(advP.uniforms.uVelocity,velocity.read.attach(0));gl.uniform1i(advP.uniforms.uSource,dye.read.attach(1));gl.uniform1f(advP.uniforms.dissipation,P.trail);blit(dye.write);dye.swap();}
    function render(){gl.disable(gl.BLEND);dispP.bind();gl.uniform1i(dispP.uniforms.uTexture,dye.read.attach(0));blit(null);}
    function loop(){if(stopped)return;const P=getP();const dt=dtime();if(resize())initFBO();
      if(P.auto){autoTimer+=dt;if(autoTimer>=P.interval){autoTimer=0;randomSplat(P);}}
      if(pointer.moved){pointer.moved=false;splat(pointer.x,pointer.y,pointer.dx*P.force,pointer.dy*P.force,{r:pointer.color[0],g:pointer.color[1],b:pointer.color[2]},P);}
      step(dt*(P.simSpeed===undefined?1:P.simSpeed),P);render();raf=requestAnimationFrame(loop);}
    function pmove(e){const rct=canvas.getBoundingClientRect();const px=(e.clientX-rct.left)/canvas.clientWidth,py=1-(e.clientY-rct.top)/canvas.clientHeight;const P=getP();if(pointer.color[0]===0&&pointer.color[1]===0&&pointer.color[2]===0||Math.random()<0.02){const c=genColor(P);pointer.color=[c.r*10*P.bright,c.g*10*P.bright,c.b*10*P.bright];}pointer.dx=(px-pointer.x)*5;pointer.dy=(py-pointer.y)*5;pointer.x=px;pointer.y=py;if(pointer.dx||pointer.dy)pointer.moved=true;}
    canvas.addEventListener('mousemove',pmove);
    resize(); initFBO(); { const P=getP(); for(let i=0;i<8;i++) randomSplat(P); } loop();
    return {stop(){stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('mousemove',pmove);const ext=gl.getExtension('WEBGL_lose_context');if(ext)ext.loseContext();}};
  }
});

/* ====================== 2. PIPELINE (enviado) ====================== */
reg({
  id:'pipeline', name:'Pipeline', cat:'Linhas',
  desc:'Tubos luminosos que percorrem a tela em curvas de 45°, deixando rastros (Ambient Canvas).',
  params:[
    {key:'count',label:'Qtd. de tubos',type:'range',min:5,max:90,step:1,default:30,reinit:true},
    {key:'speed',label:'Velocidade',type:'range',min:0.2,max:4,step:0.1,default:1},
    {key:'width',label:'Espessura',type:'range',min:1,max:10,step:0.5,default:4},
    {key:'hue',label:'Matiz base',type:'range',min:0,max:360,step:1,default:180},
    {key:'hueRange',label:'Variação matiz',type:'range',min:0,max:180,step:1,default:60},
    {key:'turn',label:'Curvas',type:'range',min:10,max:120,step:1,default:58},
    {key:'glow',label:'Intensidade',type:'range',min:0.03,max:0.4,step:0.005,default:0.125},
    {key:'blur',label:'Brilho/Blur',type:'range',min:0,max:26,step:1,default:12},
    {key:'bg',label:'Fundo',type:'color',default:'#000603'}
  ],
  fn:function(canvas, getP){
    const TO_RAD=Math.PI/180, HALF_PI=Math.PI/2;
    const ctxB=canvas.getContext('2d');
    const a=document.createElement('canvas'), ctxA=a.getContext('2d');
    let center=[0,0], tick=0, props, count=0, raf, stopped=false;
    const fade=(t,m)=>{const hm=0.5*m;return Math.abs((t+hm)%m-hm)/hm;};
    function build(n){count=n;props=new Float32Array(n*8);for(let i=0;i<props.length;i+=8)initPipe(i);}
    function initPipe(i){const P=getP();props[i]=rand(a.width||canvas.clientWidth);props[i+1]=center[1];props[i+2]=Math.round(Math.random())?HALF_PI:TAU-HALF_PI;props[i+3]=0.5+rand(1);props[i+4]=0;props[i+5]=100+rand(300);props[i+6]=2+rand(4);props[i+7]=P.hue+rand(P.hueRange);}
    function resize(){const f=fit(canvas,1.5);a.width=canvas.width;a.height=canvas.height;center=[a.width/2,a.height/2];}
    function draw(){if(stopped)return;const P=getP();tick++;
      for(let i=0;i<props.length;i+=8){const ttl=props[i+5],w=props[i+6]*(P.width/4),hue=props[i+7];
        ctxA.strokeStyle=`hsla(${hue},75%,55%,${fade(props[i+4],ttl)*P.glow})`;ctxA.lineWidth=1;ctxA.beginPath();ctxA.arc(props[i],props[i+1],w,0,TAU);ctxA.stroke();
        props[i+4]++;props[i]+=Math.cos(props[i+2])*props[i+3]*P.speed*1.6;props[i+1]+=Math.sin(props[i+2])*props[i+3]*P.speed*1.6;
        const tc=!(tick%Math.round(rand(P.turn)))&&(!(Math.round(props[i])%6)||!(Math.round(props[i+1])%6));
        props[i+2]+=tc?(Math.round(Math.random())?-1:1)*(360/8)*TO_RAD:0;
        if(props[i]>a.width)props[i]=0;if(props[i]<0)props[i]=a.width;if(props[i+1]>a.height)props[i+1]=0;if(props[i+1]<0)props[i+1]=a.height;
        if(props[i+4]>ttl)initPipe(i);}
      ctxB.fillStyle=P.bg;ctxB.fillRect(0,0,canvas.width,canvas.height);
      ctxB.save();ctxB.filter=`blur(${P.blur}px)`;ctxB.drawImage(a,0,0);ctxB.restore();
      ctxB.drawImage(a,0,0);
      if(count!==Math.round(P.count)){ctxA.clearRect(0,0,a.width,a.height);build(Math.round(P.count));}
      raf=requestAnimationFrame(draw);}
    resize();window.addEventListener('resize',resize);build(Math.round(getP().count));draw();
    return {stop(){stopped=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);}};
  }
});
/* ====================== GRADIENTE + BLUR + BLOBS ====================== */
reg({
  id:'mesh', name:'Mesh Gradient', cat:'Gradiente',
  desc:'Manchas de cor suaves que flutuam e se fundem com desfoque, gradiente em malha.',
  params:[
    {key:'count',label:'Qtd. de manchas',type:'range',min:3,max:14,step:1,default:6},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:0.2,max:1.3,step:0.02,default:0.75},
    {key:'blur',label:'Desfoque',type:'range',min:0,max:90,step:1,default:36},
    {key:'bg',label:'Fundo',type:'color',default:'#0a0a18'},
    {key:'c1',label:'Cor 1',type:'color',default:'#ff2e93'},
    {key:'c2',label:'Cor 2',type:'color',default:'#7c5cff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#00e5ff'},
    {key:'c4',label:'Cor 4',type:'color',default:'#22e3a0'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d'); const off=document.createElement('canvas'); const oc=off.getContext('2d');
    const seeds=[]; for(let i=0;i<20;i++) seeds.push({a:rand(TAU),b:rand(TAU),sa:rand(0.2,0.7),sb:rand(0.2,0.7),r:rand(0.6,1)});
    let raf,stopped=false,t=0;
    function frame(){ if(stopped)return; const P=getP(); const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;
      if(off.width!==W||off.height!==H){off.width=W;off.height=H;}
      t+=0.005*P.speed; const cols=[P.c1,P.c2,P.c3,P.c4],mn=Math.min(W,H),n=Math.round(P.count);
      oc.clearRect(0,0,W,H); oc.globalCompositeOperation='lighter';
      for(let i=0;i<n;i++){const s=seeds[i];const x=(0.5+0.42*Math.sin(t*s.sa+s.a))*W;const y=(0.5+0.42*Math.cos(t*s.sb+s.b))*H;const rad=P.size*mn*0.55*s.r;const col=cols[i%cols.length];const g=oc.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,rgbaHex(col,0.85));g.addColorStop(1,rgbaHex(col,0));oc.fillStyle=g;oc.fillRect(0,0,W,H);}
      ctx.globalCompositeOperation='source-over'; ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
      ctx.filter=P.blur?('blur('+(P.blur*dpr)+'px)'):'none'; ctx.drawImage(off,0,0); ctx.filter='none';
      raf=requestAnimationFrame(frame);}
    frame(); return {stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'blobs', name:'Lava / Blobs', cat:'Gradiente',
  desc:'Bolhas coloridas que sobem e flutuam como uma lâmpada de lava, bem desfocadas.',
  params:[
    {key:'count',label:'Qtd. de bolhas',type:'range',min:3,max:20,step:1,default:9},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:0.1,max:0.7,step:0.01,default:0.32},
    {key:'blur',label:'Desfoque',type:'range',min:0,max:90,step:1,default:48},
    {key:'bg',label:'Fundo',type:'color',default:'#06060f'},
    {key:'c1',label:'Cor 1',type:'color',default:'#ff5e3a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff2d95'},
    {key:'c3',label:'Cor 3',type:'color',default:'#9b5cff'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d'); const off=document.createElement('canvas'); const oc=off.getContext('2d');
    let blobs=[],raf,stopped=false;
    function mk(){return {x:rand(1),y:rand(1.2),vx:rand(-0.0006,0.0006),vy:-rand(0.0004,0.0016),r:rand(0.6,1.2),ci:Math.floor(rand(3))};}
    function ensure(n){while(blobs.length<n)blobs.push(mk());blobs.length=n;}
    function frame(){ if(stopped)return; const P=getP(); const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;
      if(off.width!==W||off.height!==H){off.width=W;off.height=H;}
      ensure(Math.round(P.count)); const cols=[P.c1,P.c2,P.c3],mn=Math.min(W,H);
      oc.clearRect(0,0,W,H); oc.globalCompositeOperation='lighter';
      for(const b of blobs){ b.x+=b.vx*P.speed; b.y+=b.vy*P.speed; if(b.y< -0.3){b.y=1.3;b.x=rand(1);} if(b.x<-0.2)b.x=1.2; if(b.x>1.2)b.x=-0.2;
        const x=b.x*W,y=b.y*H,rad=P.size*mn*b.r,col=cols[b.ci%cols.length];
        const g=oc.createRadialGradient(x,y,0,x,y,rad); g.addColorStop(0,rgbaHex(col,0.9)); g.addColorStop(0.6,rgbaHex(col,0.45)); g.addColorStop(1,rgbaHex(col,0)); oc.fillStyle=g; oc.fillRect(0,0,W,H);}
      ctx.globalCompositeOperation='source-over'; ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
      ctx.filter=P.blur?('blur('+(P.blur*dpr)+'px)'):'none'; ctx.drawImage(off,0,0); ctx.filter='none';
      raf=requestAnimationFrame(frame);}
    frame(); return {stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'aurora', name:'Aurora', cat:'Gradiente',
  desc:'Cortinas de luz onduladas como uma aurora boreal, suaves e desfocadas.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'amp',label:'Ondulação',type:'range',min:0.05,max:0.5,step:0.01,default:0.22},
    {key:'bands',label:'Camadas',type:'range',min:1,max:5,step:1,default:3},
    {key:'blur',label:'Desfoque',type:'range',min:0,max:60,step:1,default:22},
    {key:'bg',label:'Fundo',type:'color',default:'#02030a'},
    {key:'c1',label:'Cor 1',type:'color',default:'#27ffb0'},
    {key:'c2',label:'Cor 2',type:'color',default:'#3aa0ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#b85cff'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d'); const off=document.createElement('canvas'); const oc=off.getContext('2d');
    let raf,stopped=false,t=0;
    function frame(){ if(stopped)return; const P=getP(); const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;
      if(off.width!==W||off.height!==H){off.width=W;off.height=H;}
      t+=0.004*P.speed; const cols=[P.c1,P.c2,P.c3],L=Math.round(P.bands);
      oc.clearRect(0,0,W,H); oc.globalCompositeOperation='lighter';
      for(let k=0;k<L;k++){ const baseY=H*(0.32+0.13*k),amp=H*P.amp,col=cols[k%cols.length];
        oc.beginPath(); oc.moveTo(0,H);
        for(let x=0;x<=W;x+=W/90){ const nz=Noise.n2(x*0.0017+k*12, t+k*0.6); oc.lineTo(x, baseY+nz*amp); }
        oc.lineTo(W,H); oc.closePath();
        const g=oc.createLinearGradient(0,baseY-amp,0,H); g.addColorStop(0,rgbaHex(col,0)); g.addColorStop(0.45,rgbaHex(col,0.55)); g.addColorStop(1,rgbaHex(col,0)); oc.fillStyle=g; oc.fill(); }
      ctx.globalCompositeOperation='source-over'; ctx.fillStyle=P.bg; ctx.fillRect(0,0,W,H);
      ctx.filter=P.blur?('blur('+(P.blur*dpr)+'px)'):'none'; ctx.drawImage(off,0,0); ctx.filter='none';
      raf=requestAnimationFrame(frame);}
    frame(); return {stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'conic', name:'Gradiente Cônico', cat:'Gradiente',
  desc:'Leque de cores girando a partir do centro, com leve desfoque sedoso.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:-3,max:3,step:0.05,default:0.6},
    {key:'blur',label:'Desfoque',type:'range',min:0,max:60,step:1,default:8},
    {key:'cx',label:'Centro X',type:'range',min:0,max:1,step:0.01,default:0.5},
    {key:'cy',label:'Centro Y',type:'range',min:0,max:1,step:0.01,default:0.5},
    {key:'c1',label:'Cor 1',type:'color',default:'#ff3d81'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ffb000'},
    {key:'c3',label:'Cor 3',type:'color',default:'#00e5ff'},
    {key:'c4',label:'Cor 4',type:'color',default:'#7c5cff'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d'); let raf,stopped=false,t=0;
    function frame(){ if(stopped)return; const P=getP(); const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;
      t+=0.01*P.speed; const cx=P.cx*W,cy=P.cy*H,cols=[P.c1,P.c2,P.c3,P.c4,P.c1];
      ctx.filter=P.blur?('blur('+(P.blur*dpr)+'px)'):'none';
      if(ctx.createConicGradient){ const g=ctx.createConicGradient(t,cx,cy); for(let i=0;i<cols.length;i++)g.addColorStop(i/(cols.length-1),cols[i]); ctx.fillStyle=g; }
      else { const g=ctx.createLinearGradient(0,0,W,H); for(let i=0;i<cols.length;i++)g.addColorStop(i/(cols.length-1),cols[i]); ctx.fillStyle=g; }
      ctx.fillRect(-40,-40,W+80,H+80); ctx.filter='none';
      raf=requestAnimationFrame(frame);}
    frame(); return {stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});
/* ====================== PARTÍCULAS / LINHAS / REDE ====================== */
reg({
  id:'network', name:'Constelação', cat:'Partículas',
  desc:'Pontos que flutuam e se conectam por linhas quando próximos. Reage ao mouse.',
  params:[
    {key:'count',label:'Qtd. de pontos',type:'range',min:20,max:220,step:1,default:90},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'dist',label:'Alcance das linhas',type:'range',min:0.05,max:0.3,step:0.005,default:0.13},
    {key:'dotSize',label:'Tamanho do ponto',type:'range',min:0.5,max:3.5,step:0.1,default:1.6},
    {key:'dot',label:'Cor dos pontos',type:'color',default:'#ffffff'},
    {key:'line',label:'Cor das linhas',type:'color',default:'#7c5cff'},
    {key:'bg',label:'Fundo',type:'color',default:'#070710'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d'); let pts=[],raf,stopped=false; const mouse={x:-1e4,y:-1e4};
    function mk(W,H){return{x:rand(W),y:rand(H),vx:rand(-0.5,0.5),vy:rand(-0.5,0.5)};}
    function ensure(n,W,H){while(pts.length<n)pts.push(mk(W,H));pts.length=n;}
    function mv(e){const r=canvas.getBoundingClientRect();const d=Math.min(window.devicePixelRatio||1,2);mouse.x=(e.clientX-r.left)*d;mouse.y=(e.clientY-r.top)*d;}
    function lv(){mouse.x=-1e4;mouse.y=-1e4;}
    canvas.addEventListener('mousemove',mv);canvas.addEventListener('mouseleave',lv);
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h;ensure(Math.round(P.count),W,H);
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const dist=P.dist*Math.min(W,H),dc=hexToRgb(P.line);ctx.lineWidth=f.dpr;
      for(const p of pts){p.x+=p.vx*P.speed;p.y+=p.vy*P.speed;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
      for(let i=0;i<pts.length;i++){const a=pts[i];
        for(let j=i+1;j<pts.length;j++){const b=pts[j];const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<dist){ctx.strokeStyle='rgba('+dc.r+','+dc.g+','+dc.b+','+(1-d/dist)*0.55+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
        const mx=a.x-mouse.x,my=a.y-mouse.y,md=Math.hypot(mx,my);if(md<dist*1.5){ctx.strokeStyle='rgba('+dc.r+','+dc.g+','+dc.b+','+(1-md/(dist*1.5))*0.85+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();}}
      ctx.fillStyle=P.dot;for(const p of pts){ctx.beginPath();ctx.arc(p.x,p.y,P.dotSize*f.dpr,0,TAU);ctx.fill();}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('mousemove',mv);canvas.removeEventListener('mouseleave',lv);}};
  }
});

reg({
  id:'matrix', name:'Matrix Glitch', cat:'Partículas',
  desc:'Chuva digital de glifos caindo com falhas/glitch. Inspirado no componente MatrixGlitch.',
  params:[
    {key:'size',label:'Tamanho da fonte',type:'range',min:8,max:28,step:1,default:15},
    {key:'speed',label:'Velocidade',type:'range',min:0.2,max:3,step:0.05,default:1},
    {key:'fade',label:'Rastro',type:'range',min:0.03,max:0.4,step:0.01,default:0.09},
    {key:'glitch',label:'Glitch',type:'range',min:0,max:1,step:0.02,default:0.4},
    {key:'color',label:'Cor',type:'color',default:'#27ff7a'},
    {key:'bg',label:'Fundo',type:'color',default:'#020806'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');
    const POOL='アイウエオカキクケコサシスセソタチツテトナニヌネノﾊﾋﾌﾍﾎ0123456789ABCDFHKLMNXZ#$%&*<>=+:';
    let drops=[],cols=0,raf,stopped=false;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;const fs=P.size*dpr;const nc=Math.max(1,Math.floor(W/fs));
      if(cols!==nc){cols=nc;drops=[];for(let i=0;i<nc;i++)drops[i]=Math.random()*-(H/fs);}
      ctx.fillStyle=rgbaHex(P.bg,P.fade);ctx.fillRect(0,0,W,H);
      ctx.font=fs+'px monospace';ctx.textBaseline='top';const head=lightenHex(P.color,0.65);
      for(let i=0;i<nc;i++){const x=i*fs,y=drops[i]*fs;
        ctx.fillStyle=P.color;ctx.fillText(POOL[Math.floor(Math.random()*POOL.length)],x,y);
        ctx.fillStyle=head;ctx.fillText(POOL[Math.floor(Math.random()*POOL.length)],x,y);
        drops[i]+=P.speed*0.55;if(y>H&&Math.random()>0.975)drops[i]=Math.random()*-20;}
      if(Math.random()<P.glitch*0.07){const gy=rand(H),gh=rand(3,28)*dpr,dx=rand(-1,1)*24*dpr;try{ctx.drawImage(canvas,0,gy,W,gh,dx,gy,W,gh);}catch(e){}}
      if(Math.random()<P.glitch*0.04){ctx.fillStyle=rgbaHex(P.color,0.06);ctx.fillRect(0,rand(H),W,rand(1,3)*dpr);}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'starfield', name:'Hiperespaço', cat:'Partículas',
  desc:'Estrelas que correm em direção a você em velocidade de dobra, deixando rastros.',
  params:[
    {key:'count',label:'Qtd. de estrelas',type:'range',min:80,max:900,step:10,default:380},
    {key:'speed',label:'Velocidade',type:'range',min:0.1,max:4,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:0.5,max:4,step:0.1,default:2},
    {key:'spread',label:'Abertura',type:'range',min:0.4,max:2,step:0.05,default:1},
    {key:'trail',label:'Rastro',type:'range',min:0.08,max:0.6,step:0.02,default:0.32},
    {key:'color',label:'Cor',type:'color',default:'#cfe6ff'},
    {key:'bg',label:'Fundo',type:'color',default:'#01020a'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let stars=[],raf,stopped=false;
    function mk(){return{x:rand(-1,1),y:rand(-1,1),z:rand(0.02,1),pz:1};}
    function ensure(n){while(stars.length<n)stars.push(mk());stars.length=n;}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h;const cx=W/2,cy=H/2;ensure(Math.round(P.count));
      ctx.fillStyle=rgbaHex(P.bg,P.trail);ctx.fillRect(0,0,W,H);
      const col=hexToRgb(P.color),sp=P.speed*0.012,fl=Math.min(W,H)*P.spread;
      for(const s of stars){s.pz=s.z;s.z-=sp;if(s.z<=0.02){s.x=rand(-1,1);s.y=rand(-1,1);s.z=1;s.pz=1;}
        const sx=cx+(s.x/s.z)*fl,sy=cy+(s.y/s.z)*fl,px=cx+(s.x/s.pz)*fl,py=cy+(s.y/s.pz)*fl,r=(1-s.z)*P.size*f.dpr;
        ctx.strokeStyle='rgba('+col.r+','+col.g+','+col.b+','+(1-s.z)+')';ctx.lineWidth=Math.max(0.6,r);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(sx,sy);ctx.stroke();}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'fireflies', name:'Vaga-lumes', cat:'Partículas',
  desc:'Pontos de luz que vagam suavemente pelo ruído e cintilam no escuro.',
  params:[
    {key:'count',label:'Qtd.',type:'range',min:20,max:300,step:5,default:120},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:0.5,max:4,step:0.1,default:1.6},
    {key:'c1',label:'Cor 1',type:'color',default:'#ffe27a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#7afff0'},
    {key:'bg',label:'Fundo',type:'color',default:'#05060a'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let ps=[],raf,stopped=false,t=0;
    function mk(W,H){return{x:rand(W),y:rand(H),ph:rand(TAU),r:rand(0.6,1.5),ci:Math.random()<0.5?0:1};}
    function ensure(n,W,H){while(ps.length<n)ps.push(mk(W,H));ps.length=n;}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;ensure(Math.round(P.count),W,H);t+=0.01*P.speed;
      ctx.globalCompositeOperation='source-over';ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation='lighter';const cols=[P.c1,P.c2];
      for(const p of ps){const ang=Noise.n2(p.x*0.0012,p.y*0.0012+t)*TAU*2;p.x+=Math.cos(ang)*0.7*P.speed*dpr;p.y+=Math.sin(ang)*0.7*P.speed*dpr;
        if(p.x<0)p.x+=W;if(p.x>W)p.x-=W;if(p.y<0)p.y+=H;if(p.y>H)p.y-=H;
        const tw=0.35+0.65*Math.abs(Math.sin(t*2+p.ph)),rad=p.r*P.size*dpr*4*(0.6+0.4*tw),col=hexToRgb(cols[p.ci]);
        const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rad);g.addColorStop(0,'rgba('+col.r+','+col.g+','+col.b+','+tw+')');g.addColorStop(1,'rgba('+col.r+','+col.g+','+col.b+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,rad,0,TAU);ctx.fill();}
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'snow', name:'Neve', cat:'Partículas',
  desc:'Flocos caindo suavemente com balanço lateral. Tranquilo e minimalista.',
  params:[
    {key:'count',label:'Qtd. de flocos',type:'range',min:30,max:500,step:10,default:180},
    {key:'speed',label:'Velocidade',type:'range',min:0.2,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:0.5,max:4,step:0.1,default:1.8},
    {key:'wind',label:'Vento',type:'range',min:-2,max:2,step:0.1,default:0.4},
    {key:'color',label:'Cor',type:'color',default:'#ffffff'},
    {key:'bg',label:'Fundo',type:'color',default:'#0a1020'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let fk=[],raf,stopped=false;
    function mk(W,H){return{x:rand(W),y:rand(H),r:rand(0.5,1.5),sp:rand(0.5,1.5),ph:rand(TAU),sw:rand(0.3,1)};}
    function ensure(n,W,H){while(fk.length<n)fk.push(mk(W,H));fk.length=n;}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;ensure(Math.round(P.count),W,H);
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);ctx.fillStyle=P.color;
      for(const s of fk){s.y+=s.sp*P.speed*dpr;s.ph+=0.02*s.sw;s.x+=(Math.sin(s.ph)*s.sw+P.wind)*dpr;
        if(s.y>H+5){s.y=-5;s.x=rand(W);}if(s.x>W+5)s.x=-5;if(s.x<-5)s.x=W+5;
        ctx.globalAlpha=0.5+s.r*0.33;ctx.beginPath();ctx.arc(s.x,s.y,s.r*P.size*dpr,0,TAU);ctx.fill();}
      ctx.globalAlpha=1;raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'bubbles', name:'Bolhas', cat:'Partículas',
  desc:'Bolhas translúcidas que sobem com leve oscilação e brilho.',
  params:[
    {key:'count',label:'Qtd. de bolhas',type:'range',min:10,max:160,step:5,default:50},
    {key:'speed',label:'Velocidade',type:'range',min:0.2,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:2,max:30,step:1,default:12},
    {key:'c1',label:'Cor 1',type:'color',default:'#39d0ff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#a06bff'},
    {key:'bg',label:'Fundo',type:'color',default:'#04101c'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let bs=[],raf,stopped=false;
    function mk(W,H){return{x:rand(W),y:rand(H),r:rand(0.3,1),sp:rand(0.4,1.2),ph:rand(TAU),wob:rand(0.3,1),ci:Math.random()<0.5?0:1};}
    function ensure(n,W,H){while(bs.length<n)bs.push(mk(W,H));bs.length=n;}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;ensure(Math.round(P.count),W,H);
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);const cols=[P.c1,P.c2];
      for(const b of bs){b.y-=b.sp*P.speed*dpr;b.ph+=0.02;b.x+=Math.sin(b.ph)*b.wob*dpr;
        if(b.y< -30){b.y=H+30;b.x=rand(W);}
        const r=b.r*P.size*dpr,col=hexToRgb(cols[b.ci]);
        const g=ctx.createRadialGradient(b.x-r*0.3,b.y-r*0.3,r*0.1,b.x,b.y,r);
        g.addColorStop(0,'rgba('+col.r+','+col.g+','+col.b+',0.5)');g.addColorStop(0.7,'rgba('+col.r+','+col.g+','+col.b+',0.12)');g.addColorStop(1,'rgba('+col.r+','+col.g+','+col.b+',0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,r,0,TAU);ctx.fill();
        ctx.strokeStyle='rgba('+col.r+','+col.g+','+col.b+',0.4)';ctx.lineWidth=dpr;ctx.beginPath();ctx.arc(b.x,b.y,r,0,TAU);ctx.stroke();}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});
/* ====================== ONDAS / GEOMÉTRICO / LINHAS ====================== */
reg({
  id:'flowlines', name:'Campo de Fluxo', cat:'Geométrico',
  desc:'Milhares de partículas seguindo um campo de ruído, formando correntes sedosas.',
  params:[
    {key:'count',label:'Qtd.',type:'range',min:200,max:2200,step:50,default:800},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'scale',label:'Escala do campo',type:'range',min:0.0006,max:0.005,step:0.0001,default:0.0016},
    {key:'turns',label:'Curvatura',type:'range',min:1,max:5,step:0.1,default:2},
    {key:'step',label:'Passo',type:'range',min:0.5,max:3,step:0.1,default:1.4},
    {key:'width',label:'Espessura',type:'range',min:0.5,max:3,step:0.1,default:1},
    {key:'fade',label:'Rastro',type:'range',min:0.02,max:0.3,step:0.01,default:0.06},
    {key:'c1',label:'Cor 1',type:'color',default:'#00e5ff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff3d9a'},
    {key:'bg',label:'Fundo',type:'color',default:'#05060d'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let ps=[],raf,stopped=false,t=0;
    function mk(W,H){return{x:rand(W),y:rand(H),px:0,py:0,life:rand(20,160)};}
    function ensure(n,W,H){while(ps.length<n)ps.push(mk(W,H));ps.length=n;}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;ensure(Math.round(P.count),W,H);t+=0.003*P.speed;
      ctx.fillStyle=rgbaHex(P.bg,P.fade);ctx.fillRect(0,0,W,H);ctx.lineWidth=P.width*dpr;
      const c1=hexToRgb(P.c1),c2=hexToRgb(P.c2);
      for(const p of ps){const ang=Noise.n2(p.x*P.scale,p.y*P.scale+t)*TAU*P.turns;p.px=p.x;p.py=p.y;p.x+=Math.cos(ang)*P.step*P.speed*dpr;p.y+=Math.sin(ang)*P.step*P.speed*dpr;p.life--;
        const m=0.5+0.5*Math.sin(ang);
        ctx.strokeStyle='rgba('+((c1.r+(c2.r-c1.r)*m)|0)+','+((c1.g+(c2.g-c1.g)*m)|0)+','+((c1.b+(c2.b-c1.b)*m)|0)+',0.55)';
        ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.stroke();
        if(p.life<0||p.x<0||p.x>W||p.y<0||p.y>H){p.x=rand(W);p.y=rand(H);p.life=rand(20,160);}}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'sinewaves', name:'Ondas', cat:'Geométrico',
  desc:'Camadas de ondas senoidais translúcidas deslizando umas sobre as outras.',
  params:[
    {key:'layers',label:'Camadas',type:'range',min:1,max:6,step:1,default:3},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'amp',label:'Amplitude',type:'range',min:0.05,max:0.4,step:0.01,default:0.18},
    {key:'freq',label:'Frequência',type:'range',min:0.5,max:4,step:0.1,default:1.5},
    {key:'c1',label:'Cor 1',type:'color',default:'#7c5cff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#00e5ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ff4d9d'},
    {key:'bg',label:'Fundo',type:'color',default:'#06061a'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let raf,stopped=false,t=0;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h;t+=0.01*P.speed;
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);const cols=[P.c1,P.c2,P.c3],L=Math.round(P.layers);
      ctx.globalCompositeOperation='lighter';
      for(let k=0;k<L;k++){const col=cols[k%cols.length],amp=H*P.amp*(1-k*0.1),baseY=H*(0.5+(k-(L-1)/2)*0.07),fr=P.freq*(1+k*0.12),ph=t*(1+k*0.2)+k;
        ctx.beginPath();ctx.moveTo(0,H);
        for(let x=0;x<=W;x+=6){const y=baseY+Math.sin(x*fr*0.004+ph)*amp*Math.sin(x*0.0011+ph*0.4);ctx.lineTo(x,y);}
        ctx.lineTo(W,H);ctx.closePath();
        const g=ctx.createLinearGradient(0,baseY-amp,0,H);g.addColorStop(0,rgbaHex(col,0.5));g.addColorStop(1,rgbaHex(col,0));ctx.fillStyle=g;ctx.fill();}
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'lowpoly', name:'Low Poly', cat:'Geométrico',
  desc:'Malha de triângulos que ondula e muda de tom como um cristal animado.',
  params:[
    {key:'cell',label:'Tamanho do triângulo',type:'range',min:28,max:130,step:2,default:62},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'warp',label:'Distorção',type:'range',min:0,max:1,step:0.02,default:0.5},
    {key:'stroke',label:'Contorno',type:'bool',default:true},
    {key:'c1',label:'Cor 1',type:'color',default:'#1b1147'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff5ea8'},
    {key:'bg',label:'Fundo',type:'color',default:'#0a0a16'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let raf,stopped=false,t=0;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;t+=0.004*P.speed;
      const cell=P.cell*dpr,cn=Math.ceil(W/cell)+3,rn=Math.ceil(H/cell)+3,c1=hexToRgb(P.c1),c2=hexToRgb(P.c2);
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const gx=new Float32Array(cn*rn),gy=new Float32Array(cn*rn);
      for(let j=0;j<rn;j++)for(let i=0;i<cn;i++){const k=j*cn+i;gx[k]=i*cell-cell+Noise.n2(i*0.45,j*0.45+t)*cell*0.55*P.warp;gy[k]=j*cell-cell+Noise.n2(i*0.45+50,j*0.45+t)*cell*0.55*P.warp;}
      function tri(p,q,r){const mx=(gx[p]+gx[q]+gx[r])/3,my=(gy[p]+gy[q]+gy[r])/3,m=0.5+0.5*Noise.n2(mx*0.0022,my*0.0022+t*1.2);
        ctx.fillStyle='rgb('+((c1.r+(c2.r-c1.r)*m)|0)+','+((c1.g+(c2.g-c1.g)*m)|0)+','+((c1.b+(c2.b-c1.b)*m)|0)+')';
        ctx.beginPath();ctx.moveTo(gx[p],gy[p]);ctx.lineTo(gx[q],gy[q]);ctx.lineTo(gx[r],gy[r]);ctx.closePath();ctx.fill();
        if(P.stroke){ctx.strokeStyle='rgba(0,0,0,0.18)';ctx.lineWidth=dpr*0.6;ctx.stroke();}}
      for(let j=0;j<rn-1;j++)for(let i=0;i<cn-1;i++){const a=j*cn+i,b=a+1,c=a+cn,d=c+1;tri(a,b,c);tri(b,d,c);}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'hexpulse', name:'Favo Pulsante', cat:'Geométrico',
  desc:'Grade de hexágonos que pulsa em ondas a partir do centro.',
  params:[
    {key:'size',label:'Tamanho do hex',type:'range',min:14,max:64,step:2,default:28},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'glow',label:'Intensidade',type:'range',min:0.1,max:0.9,step:0.02,default:0.5},
    {key:'c1',label:'Cor 1',type:'color',default:'#0b1e3a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#22e5ff'},
    {key:'bg',label:'Fundo',type:'color',default:'#05080f'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let raf,stopped=false,t=0;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;t+=0.02*P.speed;
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const s=P.size*dpr,hw=Math.sqrt(3)*s,vh=1.5*s,c1=hexToRgb(P.c1),c2=hexToRgb(P.c2),cxc=W/2,cyc=H/2;
      function hex(cx,cy,r){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30),px=cx+r*Math.cos(a),py=cy+r*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
      let row=0;
      for(let y=-vh;y<H+vh;y+=vh,row++){const off=(row&1)?hw/2:0;
        for(let x=-hw;x<W+hw;x+=hw){const cx=x+off,d=Math.hypot(cx-cxc,y-cyc),pulse=0.5+0.5*Math.sin(t-d*0.012),m=pulse;
          ctx.fillStyle='rgba('+((c1.r+(c2.r-c1.r)*m)|0)+','+((c1.g+(c2.g-c1.g)*m)|0)+','+((c1.b+(c2.b-c1.b)*m)|0)+','+(0.12+pulse*P.glow)+')';
          hex(cx,y,s*0.9);ctx.fill();}}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'ripples', name:'Ondulações', cat:'Geométrico',
  desc:'Anéis concêntricos que se expandem pela tela. Reage ao mouse.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0.3,max:3,step:0.05,default:1},
    {key:'rate',label:'Frequência',type:'range',min:0.02,max:0.5,step:0.01,default:0.12},
    {key:'width',label:'Espessura',type:'range',min:0.5,max:4,step:0.1,default:1.5},
    {key:'c1',label:'Cor 1',type:'color',default:'#36e3ff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#b06bff'},
    {key:'bg',label:'Fundo',type:'color',default:'#04060e'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let rps=[],raf,stopped=false,acc=0;const mouse={x:0,y:0,on:false};
    function mv(e){const r=canvas.getBoundingClientRect();const d=Math.min(window.devicePixelRatio||1,1.5);mouse.x=(e.clientX-r.left)*d;mouse.y=(e.clientY-r.top)*d;mouse.on=true;}
    function lv(){mouse.on=false;}
    canvas.addEventListener('mousemove',mv);canvas.addEventListener('mouseleave',lv);
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;
      ctx.fillStyle=rgbaHex(P.bg,0.16);ctx.fillRect(0,0,W,H);
      acc+=P.rate;while(acc>=1){acc-=1;rps.push({x:rand(W),y:rand(H),r:0,life:1,ci:Math.random()<0.5?0:1});}
      if(mouse.on&&Math.random()<0.35)rps.push({x:mouse.x,y:mouse.y,r:0,life:1,ci:0});
      if(rps.length>500)rps.splice(0,rps.length-500);
      const cols=[P.c1,P.c2];ctx.lineWidth=P.width*dpr;
      for(let i=rps.length-1;i>=0;i--){const o=rps[i];o.r+=P.speed*2.6*dpr;o.life-=0.006*P.speed;if(o.life<=0){rps.splice(i,1);continue;}const c=hexToRgb(cols[o.ci]);ctx.strokeStyle='rgba('+c.r+','+c.g+','+c.b+','+(o.life*0.6)+')';ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,TAU);ctx.stroke();}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('mousemove',mv);canvas.removeEventListener('mouseleave',lv);}};
  }
});
reg({
  id:'synthgrid', name:'Grade Synthwave', cat:'Geométrico',
  desc:'Grade em perspectiva correndo até o horizonte com sol retrô. Estética anos 80.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'density',label:'Densidade',type:'range',min:6,max:30,step:1,default:14},
    {key:'grid',label:'Cor da grade',type:'color',default:'#ff3d9a'},
    {key:'sun1',label:'Sol (topo)',type:'color',default:'#ffe24d'},
    {key:'sun2',label:'Sol (base)',type:'color',default:'#ff2d95'},
    {key:'sky1',label:'Céu (topo)',type:'color',default:'#0a0524'},
    {key:'sky2',label:'Céu (horizonte)',type:'color',default:'#3a0f5e'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let raf,stopped=false,t=0;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;t+=0.02*P.speed;
      const hz=H*0.52;const sky=ctx.createLinearGradient(0,0,0,hz);sky.addColorStop(0,P.sky1);sky.addColorStop(1,P.sky2);ctx.fillStyle=sky;ctx.fillRect(0,0,W,hz);
      ctx.fillStyle=P.sky1;ctx.fillRect(0,hz,W,H-hz);
      const sunR=Math.min(W,H)*0.2,scx=W/2,scy=hz-sunR*0.15;
      ctx.save();ctx.beginPath();ctx.arc(scx,scy,sunR,0,TAU);ctx.clip();
      const sg=ctx.createLinearGradient(0,scy-sunR,0,scy+sunR);sg.addColorStop(0,P.sun1);sg.addColorStop(1,P.sun2);ctx.fillStyle=sg;ctx.fillRect(scx-sunR,scy-sunR,2*sunR,2*sunR);
      ctx.fillStyle=P.sky2;for(let i=0;i<7;i++){const yy=scy+sunR*0.1+i*sunR*0.22;ctx.fillRect(scx-sunR,yy,2*sunR,Math.max(1,(i+1)*1.1*dpr));}
      ctx.restore();
      ctx.strokeStyle=P.grid;ctx.lineWidth=dpr;const lines=16;
      for(let i=0;i<lines;i++){const z=(i+(t%1))/lines;const y=hz+(H-hz)*z*z;ctx.globalAlpha=Math.min(1,z*1.3);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      ctx.globalAlpha=0.85;const vN=Math.round(P.density);
      for(let i=-vN;i<=vN;i++){const fx=i/vN;ctx.beginPath();ctx.moveTo(W/2+fx*W*1.6,H);ctx.lineTo(W/2+fx*10*dpr,hz);ctx.stroke();}
      ctx.globalAlpha=1;raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'kaleido', name:'Caleidoscópio', cat:'Geométrico',
  desc:'Padrões coloridos espelhados em simetria radial, girando lentamente.',
  params:[
    {key:'segments',label:'Segmentos',type:'range',min:3,max:16,step:1,default:8},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'scale',label:'Escala',type:'range',min:0.5,max:1.6,step:0.05,default:1},
    {key:'blur',label:'Suavização (blur)',type:'range',min:0,max:40,step:1,default:3},
    {key:'c1',label:'Cor 1',type:'color',default:'#ff3d81'},
    {key:'c2',label:'Cor 2',type:'color',default:'#3dd6ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ffe14d'},
    {key:'bg',label:'Fundo',type:'color',default:'#08040f'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');const off=document.createElement('canvas');const oc=off.getContext('2d');
    let raf,stopped=false,t=0;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;t+=0.01*P.speed;
      if(off.width!==W||off.height!==H){off.width=W;off.height=H;}
      oc.setTransform(1,0,0,1,0,0);oc.clearRect(0,0,W,H);
      const R=Math.min(W,H)*0.55*P.scale,seg=Math.round(P.segments),cols=[P.c1,P.c2,P.c3];
      oc.translate(W/2,H/2);oc.rotate(t*0.2);
      for(let s=0;s<seg;s++){for(let mir=0;mir<2;mir++){
        oc.save();oc.rotate(s*TAU/seg);if(mir)oc.scale(1,-1);oc.globalCompositeOperation='lighter';
        for(let k=0;k<4;k++){const a=t*0.7+k*1.7,rr=R*(0.15+0.26*k),x=Math.cos(a)*rr,y=Math.sin(a*1.4)*rr*0.55,rad=R*(0.22-k*0.03),col=hexToRgb(cols[k%cols.length]);
          const g=oc.createRadialGradient(x,y,0,x,y,rad);g.addColorStop(0,'rgba('+col.r+','+col.g+','+col.b+',0.95)');g.addColorStop(0.62,'rgba('+col.r+','+col.g+','+col.b+',0.55)');g.addColorStop(1,'rgba('+col.r+','+col.g+','+col.b+',0)');oc.fillStyle=g;oc.beginPath();oc.arc(x,y,rad,0,TAU);oc.fill();}
        oc.restore();}}
      oc.setTransform(1,0,0,1,0,0);oc.globalCompositeOperation='source-over';
      ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      ctx.filter=P.blur?('blur('+(P.blur*dpr*0.5)+'px)'):'none';ctx.drawImage(off,0,0);ctx.filter='none';
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'voronoi', name:'Voronoi', cat:'Geométrico',
  desc:'Mosaico de células orgânicas que se movem e respiram, tipo vitral.',
  params:[
    {key:'count',label:'Qtd. de células',type:'range',min:4,max:32,step:1,default:13},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'edge',label:'Bordas',type:'range',min:0,max:1,step:0.02,default:0.55},
    {key:'blur',label:'Suavização (blur)',type:'range',min:0,max:18,step:1,default:5},
    {key:'c1',label:'Cor 1',type:'color',default:'#1a0b3a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff2e7e'},
    {key:'c3',label:'Cor 3',type:'color',default:'#21d4fd'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');const lr=document.createElement('canvas');const lc=lr.getContext('2d');
    let seeds=[],raf,stopped=false;
    function mk(){return{x:rand(1),y:rand(1),vx:rand(-0.0008,0.0008),vy:rand(-0.0008,0.0008),ci:Math.floor(rand(3))};}
    function ensure(n){while(seeds.length<n)seeds.push(mk());seeds.length=n;}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;ensure(Math.round(P.count));
      const lw=300,lh=Math.max(70,Math.round(300*H/W));if(lr.width!==lw||lr.height!==lh){lr.width=lw;lr.height=lh;}
      const cols=[hexToRgb(P.c1),hexToRgb(P.c2),hexToRgb(P.c3)];
      for(const s of seeds){s.x+=s.vx*P.speed;s.y+=s.vy*P.speed;if(s.x<0||s.x>1)s.vx*=-1;if(s.y<0||s.y>1)s.vy*=-1;}
      const img=lc.createImageData(lw,lh),d=img.data;
      for(let y=0;y<lh;y++)for(let x=0;x<lw;x++){const fx=x/lw,fy=y/lh;let d1=1e9,d2=1e9,ci=0;
        for(let i=0;i<seeds.length;i++){const s=seeds[i],dx=fx-s.x,dy=fy-s.y,dd=dx*dx+dy*dy;if(dd<d1){d2=d1;d1=dd;ci=s.ci;}else if(dd<d2)d2=dd;}
        const edge=Math.min(1,(Math.sqrt(d2)-Math.sqrt(d1))*22);const sh=1-(1-edge)*P.edge;const c=cols[ci],k=(y*lw+x)*4;
        d[k]=c.r*sh;d[k+1]=c.g*sh;d[k+2]=c.b*sh;d[k+3]=255;}
      lc.putImageData(img,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
      const pad=Math.ceil(P.blur*dpr)+2;ctx.filter=P.blur?('blur('+(P.blur*dpr)+'px)'):'none';
      ctx.drawImage(lr,0,0,lw,lh,-pad,-pad,W+2*pad,H+2*pad);ctx.filter='none';
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'spiro', name:'Spirograph', cat:'Geométrico',
  desc:'Curva harmonográfica luminosa que se redesenha em laços hipnóticos.',
  params:[
    {key:'freqA',label:'Frequência A',type:'range',min:1,max:7,step:1,default:3},
    {key:'freqB',label:'Frequência B',type:'range',min:1,max:7,step:1,default:4},
    {key:'loops',label:'Voltas',type:'range',min:1,max:9,step:1,default:5},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'width',label:'Espessura',type:'range',min:0.5,max:3,step:0.1,default:1.2},
    {key:'fade',label:'Rastro',type:'range',min:0.02,max:0.4,step:0.01,default:0.08},
    {key:'c1',label:'Cor 1',type:'color',default:'#00e5ff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff3d9a'},
    {key:'bg',label:'Fundo',type:'color',default:'#04040c'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let raf,stopped=false,t=0;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;t+=0.01*P.speed;
      ctx.fillStyle=rgbaHex(P.bg,P.fade);ctx.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.4,N=Math.round(P.loops*120);ctx.lineWidth=P.width*dpr;
      const c1=hexToRgb(P.c1),c2=hexToRgb(P.c2);
      ctx.beginPath();
      for(let i=0;i<=N;i++){const u=i/N*TAU*P.loops;const x=cx+R*(0.6*Math.sin(P.freqA*u+t)+0.4*Math.sin(P.freqB*u+t*0.6));const y=cy+R*(0.6*Math.cos(P.freqB*u+t*0.8)+0.4*Math.sin(P.freqA*u-t*0.5));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
      const m=0.5+0.5*Math.sin(t);ctx.strokeStyle='rgba('+((c1.r+(c2.r-c1.r)*m)|0)+','+((c1.g+(c2.g-c1.g)*m)|0)+','+((c1.b+(c2.b-c1.b)*m)|0)+',0.8)';ctx.stroke();
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});
/* ====================== SHADERS (WebGL) ====================== */
reg({
  id:'plasma', name:'Plasma', cat:'Shader',
  desc:'Plasma clássico de demoscene, ondas de cor fundindo-se na GPU.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'scale',label:'Escala',type:'range',min:2,max:40,step:1,default:12},
    {key:'c1',label:'Cor 1',type:'color',default:'#3a0ca3'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff3d81'},
    {key:'c3',label:'Cor 3',type:'color',default:'#00e5ff'}
  ],
  fn:function(canvas,getP){
    const frag='uniform float u_time;uniform vec2 u_res;uniform float u_speed,u_scale;uniform vec3 u_c1,u_c2,u_c3;'+
      'void main(){vec2 uv=gl_FragCoord.xy/u_res;float t=u_time*u_speed;float s=u_scale;'+
      'float v=sin(uv.x*s+t)+sin(uv.y*s+t*1.1)+sin((uv.x+uv.y)*s*0.7+t*0.8)+sin(length(uv-0.5)*s*1.6-t*1.2);v*=0.25;'+
      'vec3 col=mix(u_c1,u_c2,0.5+0.5*sin(v*3.14159));col=mix(col,u_c3,0.5+0.5*cos(v*3.14159*1.7+t*0.3));gl_FragColor=vec4(col,1.0);}';
    return GLBG(canvas,getP,frag,function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);gl.uniform1f(g.u('u_scale'),P.scale);setCol(gl,g.u('u_c1'),P.c1);setCol(gl,g.u('u_c2'),P.c2);setCol(gl,g.u('u_c3'),P.c3);});
  }
});

reg({
  id:'noiseflow', name:'Seda (Fluxo de Ruído)', cat:'Shader',
  desc:'Domain warping de ruído fractal, superfície sedosa que escorre devagar.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'scale',label:'Escala',type:'range',min:1,max:6,step:0.1,default:2.2},
    {key:'c1',label:'Cor 1',type:'color',default:'#06121f'},
    {key:'c2',label:'Cor 2',type:'color',default:'#1f7a8c'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ffd6a0'}
  ],
  fn:function(canvas,getP){
    const frag='uniform float u_time;uniform vec2 u_res;uniform float u_speed,u_scale;uniform vec3 u_c1,u_c2,u_c3;\n'+GNOISE+'\n'+
      'void main(){vec2 uv=gl_FragCoord.xy/u_res;uv.x*=u_res.x/u_res.y;float t=u_time*0.12*u_speed;vec2 p=uv*u_scale;'+
      'vec2 q=vec2(fbm(p+vec2(0.0,t)),fbm(p+vec2(5.2,1.3)-t));'+
      'vec2 r=vec2(fbm(p+4.0*q+vec2(1.7,9.2)+0.15*t),fbm(p+4.0*q+vec2(8.3,2.8)-0.12*t));'+
      'float v=fbm(p+4.0*r);'+
      'vec3 col=mix(u_c1,u_c2,clamp(v*v*1.9,0.0,1.0));col=mix(col,u_c3,clamp(length(r),0.0,1.0));gl_FragColor=vec4(col,1.0);}';
    return GLBG(canvas,getP,frag,function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);gl.uniform1f(g.u('u_scale'),P.scale);setCol(gl,g.u('u_c1'),P.c1);setCol(gl,g.u('u_c2'),P.c2);setCol(gl,g.u('u_c3'),P.c3);});
  }
});

reg({
  id:'tunnel', name:'Túnel', cat:'Shader',
  desc:'Mergulho infinito por um túnel listrado que gira e pulsa.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'rings',label:'Anéis',type:'range',min:3,max:20,step:1,default:8},
    {key:'twist',label:'Torção',type:'range',min:0,max:6,step:0.1,default:2},
    {key:'c1',label:'Cor 1',type:'color',default:'#10002b'},
    {key:'c2',label:'Cor 2',type:'color',default:'#e0aaff'}
  ],
  fn:function(canvas,getP){
    const frag='uniform float u_time;uniform vec2 u_res;uniform float u_speed,u_rings,u_twist;uniform vec3 u_c1,u_c2;'+
      'void main(){vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;float r=length(uv);float a=atan(uv.y,uv.x);float t=u_time*u_speed;'+
      'float u=0.35/r+t;float stripe=0.5+0.5*sin(u*u_rings);float ring=0.5+0.5*sin(a*u_twist+u*3.0);'+
      'vec3 col=mix(u_c1,u_c2,stripe*ring);col*=smoothstep(0.0,0.35,r);gl_FragColor=vec4(col,1.0);}';
    return GLBG(canvas,getP,frag,function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);gl.uniform1f(g.u('u_rings'),P.rings);gl.uniform1f(g.u('u_twist'),P.twist);setCol(gl,g.u('u_c1'),P.c1);setCol(gl,g.u('u_c2'),P.c2);});
  }
});

reg({
  id:'swirl', name:'Redemoinho', cat:'Shader',
  desc:'Vórtice de ruído que rodopia em torno do centro como tinta na água.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'scale',label:'Escala',type:'range',min:1,max:6,step:0.1,default:3},
    {key:'c1',label:'Cor 1',type:'color',default:'#0d1b2a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff6d00'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ffd60a'}
  ],
  fn:function(canvas,getP){
    const frag='uniform float u_time;uniform vec2 u_res;uniform float u_speed,u_scale;uniform vec3 u_c1,u_c2,u_c3;\n'+GNOISE+'\n'+
      'void main(){vec2 uv=(gl_FragCoord.xy-0.5*u_res)/u_res.y;float r=length(uv);float a=atan(uv.y,uv.x);float t=u_time*u_speed;'+
      'a+=(1.0/(r+0.25))*sin(t*0.7)*1.5+t*0.6;vec2 p=vec2(cos(a),sin(a))*r*u_scale;'+
      'float v=fbm(p+t*0.2);vec3 col=mix(u_c1,u_c2,v);col=mix(col,u_c3,0.5+0.5*sin(r*6.0-t));gl_FragColor=vec4(col,1.0);}';
    return GLBG(canvas,getP,frag,function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);gl.uniform1f(g.u('u_scale'),P.scale);setCol(gl,g.u('u_c1'),P.c1);setCol(gl,g.u('u_c2'),P.c2);setCol(gl,g.u('u_c3'),P.c3);});
  }
});

reg({
  id:'starnest', name:'Star Nest', cat:'Shader', heavy:true,
  desc:'Campo estelar fractal volumétrico, viagem cósmica infinita (shader clássico de Kali).',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'zoom',label:'Zoom',type:'range',min:0.4,max:1.4,step:0.02,default:0.8},
    {key:'tint',label:'Tonalidade',type:'color',default:'#ffffff'}
  ],
  fn:function(canvas,getP){
    const frag='uniform float u_time;uniform vec2 u_res;uniform float u_speed,u_zoom;uniform vec3 u_tint;'+
      'void main(){vec2 uv=gl_FragCoord.xy/u_res-0.5;uv.y*=u_res.y/u_res.x;vec3 dir=vec3(uv*u_zoom,1.0);'+
      'float time=u_time*0.05*u_speed+0.25;vec3 from=vec3(1.0,0.5,0.5)+vec3(time*2.0,time,-2.0);'+
      'float s=0.1,fade=1.0;vec3 v=vec3(0.0);'+
      'for(int r=0;r<12;r++){vec3 p=from+s*dir*0.5;p=abs(vec3(0.85)-mod(p,vec3(1.7)));'+
      'float pa=0.0,a=0.0;for(int i=0;i<13;i++){p=abs(p)/dot(p,p)-0.53;a+=abs(length(p)-pa);pa=length(p);}'+
      'float dm=max(0.0,0.3-a*a*0.001);a*=a*a;if(r>6)fade*=1.0-dm;'+
      'v+=fade;v+=vec3(s,s*s,s*s*s*s)*a*0.0015*fade;fade*=0.73;s+=0.1;}'+
      'v=mix(vec3(length(v)),v,0.85);vec3 col=v*0.012*u_tint;gl_FragColor=vec4(col,1.0);}';
    return GLBG(canvas,getP,frag,function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);gl.uniform1f(g.u('u_zoom'),P.zoom);setCol(gl,g.u('u_tint'),P.tint);});
  }
});

reg({
  id:'clouds', name:'Nuvens de Cor', cat:'Shader',
  desc:'Nuvens fractais suaves que se transformam lentamente entre três cores.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'scale',label:'Escala',type:'range',min:1,max:7,step:0.1,default:3},
    {key:'c1',label:'Cor 1',type:'color',default:'#0b1026'},
    {key:'c2',label:'Cor 2',type:'color',default:'#5465ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ffd6e0'}
  ],
  fn:function(canvas,getP){
    const frag='uniform float u_time;uniform vec2 u_res;uniform float u_speed,u_scale;uniform vec3 u_c1,u_c2,u_c3;\n'+GNOISE+'\n'+
      'void main(){vec2 uv=gl_FragCoord.xy/u_res;uv.x*=u_res.x/u_res.y;float t=u_time*0.05*u_speed;'+
      'float v=fbm(uv*u_scale+vec2(t,t*0.5));v=fbm(uv*u_scale+vec2(v*2.0)+vec2(-t*0.3,t*0.2));'+
      'vec3 col=mix(u_c1,u_c2,smoothstep(0.2,0.8,v));col=mix(col,u_c3,smoothstep(0.62,1.0,v));gl_FragColor=vec4(col,1.0);}';
    return GLBG(canvas,getP,frag,function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);gl.uniform1f(g.u('u_scale'),P.scale);setCol(gl,g.u('u_c1'),P.c1);setCol(gl,g.u('u_c2'),P.c2);setCol(gl,g.u('u_c3'),P.c3);});
  }
});
/* ====================== 3D VJ / FESTIVAL ====================== */
reg({
  id:'tunnel3d', name:'Túnel Neon 3D', cat:'3D',
  desc:'Voo infinito por um túnel de anéis neon que pulsam, clima de festival eletrônico.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'sides',label:'Lados',type:'range',min:3,max:10,step:1,default:4},
    {key:'count',label:'Anéis',type:'range',min:10,max:70,step:1,default:30},
    {key:'twist',label:'Torção',type:'range',min:-0.6,max:0.6,step:0.02,default:0.14},
    {key:'glow',label:'Brilho',type:'range',min:0,max:30,step:1,default:12},
    {key:'trail',label:'Rastro',type:'range',min:0.12,max:0.7,step:0.02,default:0.35},
    {key:'c1',label:'Cor 1',type:'color',default:'#ff2e9a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#00e5ff'},
    {key:'bg',label:'Fundo',type:'color',default:'#04030a'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let rings=[],raf,stopped=false,t=0;const FAR=22,NEAR=0.25;
    function ensure(n){if(rings.length!==n){rings=[];for(let i=0;i<n;i++)rings.push({z:NEAR+(i/n)*(FAR-NEAR),idx:i});}}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;t+=0.01*P.speed;ensure(Math.round(P.count));
      ctx.globalCompositeOperation='source-over';ctx.fillStyle=rgbaHex(P.bg,P.trail);ctx.fillRect(0,0,W,H);
      const focal=Math.min(W,H)*0.9,Rw=2.2,sides=Math.round(P.sides),c1=hexToRgb(P.c1),c2=hexToRgb(P.c2);
      const cx=W/2+Math.sin(t*0.7)*W*0.04,cy=H/2+Math.cos(t*0.5)*H*0.04;
      for(const r of rings){r.z-=P.speed*0.09;if(r.z<NEAR)r.z+=FAR-NEAR;}
      const order=rings.slice().sort((a,b)=>b.z-a.z);
      ctx.globalCompositeOperation='lighter';
      for(const r of order){const scale=focal/r.z,rad=Rw*scale,alpha=clamp(1-r.z/FAR,0,1)*0.9,m=0.5+0.5*Math.sin(r.idx*0.4+t*1.5);
        const R=(c1.r+(c2.r-c1.r)*m)|0,G=(c1.g+(c2.g-c1.g)*m)|0,B=(c1.b+(c2.b-c1.b)*m)|0,lw=clamp(scale*0.05,1,16)*dpr,rot=t*0.6+r.z*P.twist;
        ctx.beginPath();for(let s=0;s<=sides;s++){const a=rot+s/sides*TAU,x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad;s?ctx.lineTo(x,y):ctx.moveTo(x,y);}
        if(P.glow>0){ctx.strokeStyle='rgba('+R+','+G+','+B+','+(alpha*0.22)+')';ctx.lineWidth=lw+P.glow*0.5*dpr;ctx.stroke();}
        ctx.strokeStyle='rgba('+R+','+G+','+B+','+alpha+')';ctx.lineWidth=lw;ctx.stroke();}
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'terrain3d', name:'Voo sobre Terreno', cat:'3D',
  desc:'Sobrevoo de um relevo wireframe estilo synthwave, rolando até o horizonte.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'amp',label:'Relevo',type:'range',min:0.2,max:3,step:0.1,default:1.3},
    {key:'rough',label:'Detalhe',type:'range',min:0.12,max:0.6,step:0.02,default:0.3},
    {key:'glow',label:'Brilho',type:'range',min:0,max:20,step:1,default:8},
    {key:'c1',label:'Cor perto',type:'color',default:'#ff2e9a'},
    {key:'c2',label:'Cor longe',type:'color',default:'#3a2bff'},
    {key:'bg',label:'Fundo',type:'color',default:'#05030f'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let raf,stopped=false,scroll=0;const COLS=28,ROWS=20;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;scroll+=P.speed*0.04;
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const horizon=H*0.44,focal=Math.min(W,H)*1.0,camH=2.2,frac=scroll-Math.floor(scroll),base=Math.floor(scroll);
      const c1=hexToRgb(P.c1),c2=hexToRgb(P.c2),SX=new Array(COLS*ROWS),SY=new Array(COLS*ROWS),AL=new Array(ROWS);
      for(let iz=0;iz<ROWS;iz++){const z=0.7+(iz-frac)*0.95,rowId=iz+base;AL[iz]=clamp(1-iz/(ROWS-1),0,1);
        for(let ix=0;ix<COLS;ix++){const wx=(ix-(COLS-1)/2)*1.05,hgt=Noise.n2(ix*P.rough,rowId*P.rough)*P.amp+Noise.n2(ix*P.rough*2.3,rowId*P.rough*2.3)*P.amp*0.4,sc=focal/Math.max(0.2,z),k=iz*COLS+ix;SX[k]=W/2+wx*sc;SY[k]=horizon+(camH-hgt)*sc;}}
      ctx.globalCompositeOperation='lighter';
      for(let iz=0;iz<ROWS;iz++){const m=iz/(ROWS-1),col='rgba('+((c1.r+(c2.r-c1.r)*m)|0)+','+((c1.g+(c2.g-c1.g)*m)|0)+','+((c1.b+(c2.b-c1.b)*m)|0)+','+(AL[iz]*0.85)+')';
        ctx.strokeStyle=col;ctx.beginPath();for(let ix=0;ix<COLS;ix++){const k=iz*COLS+ix;ix?ctx.lineTo(SX[k],SY[k]):ctx.moveTo(SX[k],SY[k]);}
        if(P.glow>0){ctx.lineWidth=(1+P.glow*0.22)*dpr;ctx.globalAlpha=0.16;ctx.stroke();ctx.globalAlpha=1;}
        ctx.lineWidth=dpr;ctx.stroke();}
      ctx.strokeStyle='rgba('+c1.r+','+c1.g+','+c1.b+',0.12)';ctx.lineWidth=dpr;
      for(let ix=0;ix<COLS;ix++){ctx.beginPath();for(let iz=0;iz<ROWS;iz++){const k=iz*COLS+ix;iz?ctx.lineTo(SX[k],SY[k]):ctx.moveTo(SX[k],SY[k]);}ctx.stroke();}
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

reg({
  id:'solids3d', name:'Icosaedro Neon', cat:'3D',
  desc:'Poliedro neon girando em 3D com faces brilhantes e arestas que reluzem. Arraste para girar.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:0.4,max:1.3,step:0.05,default:0.85},
    {key:'faces',label:'Faces sólidas',type:'bool',default:true},
    {key:'glow',label:'Brilho',type:'range',min:0,max:30,step:1,default:14},
    {key:'c1',label:'Faces',type:'color',default:'#5b2bff'},
    {key:'c2',label:'Arestas',type:'color',default:'#00e5ff'},
    {key:'bg',label:'Fundo',type:'color',default:'#04040c'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');const t=1.6180339887;
    let V=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]];
    V=V.map(v=>{const l=Math.hypot(v[0],v[1],v[2]);return [v[0]/l,v[1]/l,v[2]/l];});
    const F=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
    let rx=0.4,ry=0.2,raf,stopped=false;let dragging=false,lastX=0,lastY=0;
    function onDown(e){dragging=true;lastX=e.clientX;lastY=e.clientY;}
    function onMove(e){if(dragging){ry+=(e.clientX-lastX)*0.01;rx+=(e.clientY-lastY)*0.01;lastX=e.clientX;lastY=e.clientY;}}
    function onUp(){dragging=false;}
    canvas.addEventListener('pointerdown',onDown);window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;
      if(!dragging){rx+=0.004*P.speed;ry+=0.006*P.speed;}
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.42*P.size,focal=4,cxr=Math.cos(rx),sxr=Math.sin(rx),cyr=Math.cos(ry),syr=Math.sin(ry);
      const pr=V.map(v=>{let y=v[1]*cxr-v[2]*sxr,z=v[1]*sxr+v[2]*cxr,x=v[0]*cyr+z*syr;z=-v[0]*syr+z*cyr;const s=focal/(focal+z);return {x:cx+x*R*s,y:cy+y*R*s,z:z,wx:x,wy:y,wz:z};});
      const c1=hexToRgb(P.c1),c2=hexToRgb(P.c2);
      const faces=F.map(fc=>{const a=pr[fc[0]],b=pr[fc[1]],c=pr[fc[2]],za=(a.z+b.z+c.z)/3;
        const ux=b.wx-a.wx,uy=b.wy-a.wy,uz=b.wz-a.wz,vx=c.wx-a.wx,vy=c.wy-a.wy,vz=c.wz-a.wz;
        const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,nl=Math.hypot(nx,ny,nz)||1;
        return {fc,za,shade:Math.max(0,-nz/nl)};});
      faces.sort((a,b)=>b.za-a.za);
      for(const ff of faces){const a=pr[ff.fc[0]],b=pr[ff.fc[1]],c=pr[ff.fc[2]];
        if(P.faces){const sh=0.16+0.84*ff.shade;ctx.globalCompositeOperation='source-over';ctx.fillStyle='rgba('+(c1.r*sh|0)+','+(c1.g*sh|0)+','+(c1.b*sh|0)+',0.95)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.fill();}
        ctx.globalCompositeOperation='lighter';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();
        if(P.glow>0){ctx.strokeStyle='rgba('+c2.r+','+c2.g+','+c2.b+',0.16)';ctx.lineWidth=(1.3+P.glow*0.4)*dpr;ctx.stroke();}
        ctx.strokeStyle='rgba('+c2.r+','+c2.g+','+c2.b+',0.95)';ctx.lineWidth=1.3*dpr;ctx.stroke();}
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',onDown);window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);}};
  }
});

reg({
  id:'bars3d', name:'Equalizador 3D', cat:'3D',
  desc:'Cidade de barras 3D pulsando como um espectro de áudio, clima de palco eletrônico.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'cols',label:'Colunas',type:'range',min:4,max:20,step:1,default:12},
    {key:'rows',label:'Fileiras',type:'range',min:2,max:14,step:1,default:8},
    {key:'height',label:'Altura',type:'range',min:0.5,max:4,step:0.1,default:2.2},
    {key:'glow',label:'Brilho',type:'range',min:0,max:24,step:1,default:10},
    {key:'c1',label:'Base',type:'color',default:'#1b2bff'},
    {key:'c2',label:'Topo',type:'color',default:'#ff2e9a'},
    {key:'bg',label:'Fundo',type:'color',default:'#04030c'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let raf,stopped=false,t=0;
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;t+=0.02*P.speed;
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const GX=Math.round(P.cols),GZ=Math.round(P.rows),horizon=H*0.52,focal=Math.min(W,H)*1.1,camY=3.0,cellW=1.1,cellD=1.35,c1=hexToRgb(P.c1),c2=hexToRgb(P.c2),bars=[];
      for(let iz=0;iz<GZ;iz++){const wz=2.5+iz*cellD;for(let ix=0;ix<GX;ix++){const wx=(ix-(GX-1)/2)*cellW,hgt=P.height*(0.12+0.88*Math.abs(Math.sin(t+ix*0.5)*Math.cos(t*0.8+iz*0.6+ix*0.2)));bars.push({wx,wz,hgt});}}
      bars.sort((a,b)=>b.wz-a.wz);ctx.globalCompositeOperation='lighter';
      for(const b of bars){const sc=focal/b.wz,half=cellW*0.34*sc,baseY=horizon+camY*sc,topY=horizon+(camY-b.hgt)*sc,xC=W/2+b.wx*sc,m=clamp(b.hgt/P.height,0,1);
        const col='rgba('+((c1.r+(c2.r-c1.r)*m)|0)+','+((c1.g+(c2.g-c1.g)*m)|0)+','+((c1.b+(c2.b-c1.b)*m)|0)+',0.92)';
        ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(xC-half,baseY);ctx.lineTo(xC+half,baseY);ctx.lineTo(xC+half,topY);ctx.lineTo(xC-half,topY);ctx.closePath();ctx.fill();
        const cap=Math.max(1,P.glow*0.14*dpr);ctx.fillStyle=lightenHex(P.c2,0.5);ctx.fillRect(xC-half,topY-cap,half*2,cap+dpr);}
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});

/* ====================== 3D / PARTÍCULAS (inspirado no nova-notes) ====================== */
reg({
  id:'particles3d', name:'Núcleo 3D / Galáxia', cat:'3D', heavy:true,
  desc:'Campo de partículas pseudo-3D formando galáxia, sistema solar, anéis, toro ou átomo. Arraste para girar.',
  params:[
    {key:'shape',label:'Forma',type:'select',options:[['galaxy','Galáxia'],['solar','Sistema solar'],['rings','Planeta + anéis'],['torus','Toro'],['atom','Átomo'],['auto','Alternar (auto)']],default:'galaxy'},
    {key:'count',label:'Partículas',type:'range',min:500,max:4000,step:100,default:2200},
    {key:'spin',label:'Rotação',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'tilt',label:'Inclinação',type:'range',min:0,max:1.4,step:0.02,default:0.42},
    {key:'size',label:'Tamanho do ponto',type:'range',min:0.3,max:3,step:0.1,default:1},
    {key:'color',label:'Cor',type:'color',default:'#22d3ee'},
    {key:'bg',label:'Fundo',type:'color',default:'#02030a'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');
    function buildGalaxy(R,N){const arms=4,p=[];for(let i=0;i<N;i++){const bulge=Math.random()<0.18;const r=bulge?Math.pow(Math.random(),2)*R*0.28:Math.sqrt(Math.random())*R;const base=((i%arms)/arms)*TAU,twist=(r/R)*3.2,spread=(Math.random()-0.5)*(bulge?1.6:0.5),a=base+twist+spread,thick=(Math.random()-0.5)*(bulge?R*0.18:R*0.04);p.push({x:Math.cos(a)*r,y:thick,z:Math.sin(a)*r});}return p;}
    function buildRings(R,N){const Rp=R*0.34,p=[];for(let i=0;i<N;i++){if(i<N*0.4){const u=Math.random()*TAU,v=Math.acos(2*Math.random()-1),rr=Rp*Math.cbrt(Math.random());p.push({x:rr*Math.sin(v)*Math.cos(u),y:rr*Math.cos(v),z:rr*Math.sin(v)*Math.sin(u)});}else{const a=Math.random()*TAU,rr=Rp*1.55+Math.random()*Rp*1.1;p.push({x:Math.cos(a)*rr,y:(Math.random()-0.5)*R*0.02,z:Math.sin(a)*rr});}}return p;}
    function buildSolar(R,N){const radii=[0.28,0.44,0.6,0.76,0.9,1.0].map(f=>f*R),p=[];for(let i=0;i<N;i++){if(i<N*0.12){const u=Math.random()*TAU,v=Math.acos(2*Math.random()-1),rr=R*0.11*Math.cbrt(Math.random());p.push({x:rr*Math.sin(v)*Math.cos(u),y:rr*Math.cos(v),z:rr*Math.sin(v)*Math.sin(u)});}else{const ring=radii[i%radii.length],a=Math.random()*TAU,rr=ring+(Math.random()-0.5)*R*0.03;p.push({x:Math.cos(a)*rr,y:(Math.random()-0.5)*R*0.02,z:Math.sin(a)*rr});}}return p;}
    function buildTorus(R,N){const Rmaj=R*0.66,Rmin=R*0.3,p=[];for(let i=0;i<N;i++){const u=Math.random()*TAU,v=Math.random()*TAU,rr=Rmaj+Rmin*Math.cos(v);p.push({x:rr*Math.cos(u),y:Rmin*Math.sin(v),z:rr*Math.sin(u)});}return p;}
    function buildAtom(R,N){const p=[];for(let i=0;i<N;i++){if(i<N*0.16){const u=Math.random()*TAU,v=Math.acos(2*Math.random()-1),rr=R*0.12*Math.cbrt(Math.random());p.push({x:rr*Math.sin(v)*Math.cos(u),y:rr*Math.cos(v),z:rr*Math.sin(v)*Math.sin(u)});}else{const k=i%3,a=Math.random()*TAU;let x=Math.cos(a)*R,y=Math.sin(a)*R,z=0;const phi=k*Math.PI/3,cy=Math.cos(phi),sy=Math.sin(phi);p.push({x,y:y*cy-z*sy,z:y*sy+z*cy});}}return p;}
    const GENS={galaxy:buildGalaxy,solar:buildSolar,rings:buildRings,torus:buildTorus,atom:buildAtom};
    const SPEED={galaxy:0.13,solar:0.14,rings:0.06,torus:0.18,atom:0.12},DIFF={galaxy:1,solar:1,rings:0,torus:0,atom:0};
    const AUTO=['galaxy','solar','rings','torus'];const INCL=0.35;
    let parts=[],W=0,H=0,maxR=0,raf,stopped=false,curShape='',autoIdx=0,autoTimer=0,t=0;
    const mouse={x:-1e5,y:-1e5};let dragging=false,lastX=0,lastY=0,userRot=0,userTilt=0;
    function makeParts(N){parts=[];for(let i=0;i<N;i++)parts.push({x:rand(W||300),y:rand(H||200),bx:0,by:0,bz:0,phase:rand(TAU),orbitR:1.2+rand(3),orbitSpeed:0.4+rand(1.1),size:0.9+rand(1.6),tw:rand(TAU)});}
    function applyScene(key){const pts=GENS[key](maxR,parts.length);for(let i=0;i<parts.length;i++){parts[i].bx=pts[i].x;parts[i].by=pts[i].y;parts[i].bz=pts[i].z;}curShape=key;}
    function resize(){const f=fit(canvas,2,1e9);W=f.w;H=f.h;maxR=Math.min(W,H)*0.42;}
    function dpr(){return canvas.clientWidth?(canvas.width/canvas.clientWidth):Math.min(window.devicePixelRatio||1,2);}
    function onDown(e){dragging=true;lastX=e.clientX;lastY=e.clientY;}
    function onMove(e){const r=canvas.getBoundingClientRect(),d=dpr();mouse.x=(e.clientX-r.left)*d;mouse.y=(e.clientY-r.top)*d;if(dragging){userRot+=(e.clientX-lastX)*0.006;userTilt=clamp(userTilt+(e.clientY-lastY)*0.004,-0.6,1.1);lastX=e.clientX;lastY=e.clientY;}}
    function onUp(){dragging=false;mouse.x=-1e5;mouse.y=-1e5;}
    canvas.addEventListener('pointerdown',onDown);window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);window.addEventListener('pointercancel',onUp);window.addEventListener('resize',resize);
    resize();const P0=getP();makeParts(Math.round(P0.count));applyScene(P0.shape==='auto'?'galaxy':P0.shape);
    function frame(){if(stopped)return;const P=getP();
      const ff=fit(canvas,2,1e9);if(ff.w!==W||ff.h!==H){W=ff.w;H=ff.h;maxR=Math.min(W,H)*0.42;applyScene((P.shape==='auto')?(curShape||'galaxy'):P.shape);}
      if(parts.length!==Math.round(P.count)){makeParts(Math.round(P.count));applyScene((P.shape==='auto')?(curShape||'galaxy'):P.shape);}
      if(P.shape==='auto'){autoTimer+=0.016;if(autoTimer>8){autoTimer=0;autoIdx=(autoIdx+1)%AUTO.length;applyScene(AUTO[autoIdx]);}}
      else if(P.shape!==curShape){applyScene(P.shape);}
      const d=dpr();if(!dragging)t+=0.016*P.spin;
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const base=SPEED[curShape]||0.13,diff=DIFF[curShape],tiltT=P.tilt+userTilt,cosI=Math.cos(tiltT),sinI=Math.sin(tiltT);
      const cx=W/2,cy=H/2,focal=maxR*2.4,col=hexToRgb(P.color);
      for(let i=0;i<parts.length;i++){const p=parts[i];const rad=Math.hypot(p.bx,p.bz);
        const spin=(diff?base*t/Math.max(0.4,rad/(maxR*0.5)):base*t)+userRot,cs=Math.cos(spin),sn=Math.sin(spin);
        const rx=p.bx*cs+p.bz*sn,rz=-p.bx*sn+p.bz*cs,ry=p.by;
        const z2=ry*sinI+rz*cosI,y2=ry*cosI-rz*sinI,scale=focal/(focal+z2),sx=cx+rx*scale,sy=cy+y2*scale;
        p.x+=(sx-p.x)*0.12;p.y+=(sy-p.y)*0.12;
        const mdx=p.x-mouse.x,mdy=p.y-mouse.y,md2=mdx*mdx+mdy*mdy,RR=9000*d*d;
        if(md2<RR){const fr=(RR-md2)/RR,dd=Math.sqrt(md2)||1;p.x+=(mdx/dd)*fr*6*d;p.y+=(mdy/dd)*fr*6*d;}
        const ox=Math.cos(t*p.orbitSpeed+p.phase)*p.orbitR*d,oy=Math.sin(t*p.orbitSpeed+p.phase)*p.orbitR*d;
        const depth=clamp((scale-0.7)/1.0,0,1),size=p.size*(0.5+depth*1.1)*P.size*d;
        const alpha=(0.28+depth*0.62)*(0.75+Math.sin(t*1.6+p.tw)*0.25),b=0.4+depth*0.9;
        ctx.fillStyle='rgba('+Math.min(255,col.r*b|0)+','+Math.min(255,col.g*b|0)+','+Math.min(255,col.b*b|0)+','+clamp(alpha,0,1)+')';
        ctx.beginPath();ctx.arc(p.x+ox,p.y+oy,Math.max(0.4,size),0,TAU);ctx.fill();}
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();
    return {stop(){stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',onDown);window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);window.removeEventListener('pointercancel',onUp);window.removeEventListener('resize',resize);}};
  }
});

reg({
  id:'cubecore', name:'Cubo Neon (Core)', cat:'3D',
  desc:'Cubos de arame neon aninhados girando em 3D, tipo um mini núcleo Jarvis. Arraste para girar.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:0.4,max:1.2,step:0.05,default:0.72},
    {key:'glow',label:'Brilho',type:'range',min:0,max:30,step:1,default:14},
    {key:'c1',label:'Cor externa',type:'color',default:'#22e5ff'},
    {key:'c2',label:'Cor interna',type:'color',default:'#ff3d9a'},
    {key:'bg',label:'Fundo',type:'color',default:'#04060d'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');
    const V=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    let rx=0.5,ry=0.5,raf,stopped=false;let dragging=false,lastX=0,lastY=0,vx=0,vy=0;
    function onDown(e){dragging=true;lastX=e.clientX;lastY=e.clientY;}
    function onMove(e){if(dragging){vy=(e.clientX-lastX)*0.01;vx=(e.clientY-lastY)*0.01;ry+=vy;rx+=vx;lastX=e.clientX;lastY=e.clientY;}}
    function onUp(){dragging=false;}
    canvas.addEventListener('pointerdown',onDown);window.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);
    function drawCube(W,H,scl,rotx,roty,color,glow,dpr){const cx=W/2,cy=H/2,R=Math.min(W,H)*0.5*scl,focal=4;
      const cxs=Math.cos(rotx),sxs=Math.sin(rotx),cys=Math.cos(roty),sys=Math.sin(roty),pr=[];
      for(const v of V){let y=v[1]*cxs-v[2]*sxs,z=v[1]*sxs+v[2]*cxs,x=v[0]*cys+z*sys;z=-v[0]*sys+z*cys;const s=focal/(focal+z);pr.push([cx+x*R*s,cy+y*R*s]);}
      const cc=hexToRgb(color);
      ctx.beginPath();for(const e of E){ctx.moveTo(pr[e[0]][0],pr[e[0]][1]);ctx.lineTo(pr[e[1]][0],pr[e[1]][1]);}
      if(glow>0){ctx.strokeStyle='rgba('+cc.r+','+cc.g+','+cc.b+',0.2)';ctx.lineWidth=(1.4+glow*0.4)*dpr;ctx.stroke();}
      ctx.strokeStyle=color;ctx.lineWidth=1.4*dpr;ctx.stroke();}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;
      ctx.shadowBlur=0;ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
      if(!dragging){rx+=0.006*P.speed;ry+=0.009*P.speed;}else{rx+=vx*0.0;}
      drawCube(W,H,P.size,rx,ry,P.c1,P.glow,dpr);
      drawCube(W,H,P.size*0.55,-rx*1.3,-ry*1.1,P.c2,P.glow,dpr);
      const cg=hexToRgb(P.c1),gr2=Math.max(6,P.glow*1.4*dpr),gr=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,gr2);gr.addColorStop(0,'rgba('+cg.r+','+cg.g+','+cg.b+',0.95)');gr.addColorStop(1,'rgba('+cg.r+','+cg.g+','+cg.b+',0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(W/2,H/2,gr2,0,TAU);ctx.fill();
      ctx.globalCompositeOperation='source-over';raf=requestAnimationFrame(frame);}
    frame();
    return {stop(){stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',onDown);window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);}};
  }
});

reg({
  id:'gradientwave', name:'Onda Gradiente', cat:'Shader',
  desc:'Gradiente fluido que ondula entre três cores, fundo calmo e moderno.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'c1',label:'Cor 1',type:'color',default:'#5465ff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#00d4ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ff5e9a'}
  ],
  fn:function(canvas,getP){
    const frag='uniform float u_time;uniform vec2 u_res;uniform float u_speed;uniform vec3 u_c1,u_c2,u_c3;'+
      'void main(){vec2 uv=gl_FragCoord.xy/u_res;float t=u_time*u_speed;'+
      'float g=uv.y+0.10*sin(uv.x*6.2831+t)+0.06*sin(uv.x*12.0-t*1.4);'+
      'vec3 col=mix(u_c1,u_c2,clamp(g,0.0,1.0));col=mix(col,u_c3,0.5+0.5*sin((uv.x+uv.y)*3.14159+t*0.8));gl_FragColor=vec4(col,1.0);}';
    return GLBG(canvas,getP,frag,function(g){const P=g.P,gl=g.gl;gl.uniform1f(g.u('u_speed'),P.speed);setCol(gl,g.u('u_c1'),P.c1);setCol(gl,g.u('u_c2'),P.c2);setCol(gl,g.u('u_c3'),P.c3);});
  }
});

reg({
  id:'confetti', name:'Confete', cat:'Partículas',
  desc:'Papéis coloridos girando enquanto caem. Festivo e cheio de cor.',
  params:[
    {key:'count',label:'Qtd.',type:'range',min:30,max:400,step:10,default:160},
    {key:'speed',label:'Velocidade',type:'range',min:0.2,max:3,step:0.05,default:1},
    {key:'size',label:'Tamanho',type:'range',min:3,max:16,step:1,default:7},
    {key:'c1',label:'Cor 1',type:'color',default:'#ff3d81'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ffd84d'},
    {key:'c3',label:'Cor 3',type:'color',default:'#3ddc97'},
    {key:'c4',label:'Cor 4',type:'color',default:'#4d9bff'},
    {key:'bg',label:'Fundo',type:'color',default:'#0a0a14'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');let ps=[],raf,stopped=false;
    function mk(W,H){return{x:rand(W),y:rand(H),r:rand(TAU),vr:rand(-0.1,0.1),vy:rand(0.5,1.5),vx:rand(-0.4,0.4),ci:Math.floor(rand(4)),w:rand(0.6,1.2)};}
    function ensure(n,W,H){while(ps.length<n)ps.push(mk(W,H));ps.length=n;}
    function frame(){if(stopped)return;const P=getP();const f=fit(canvas,1.5),W=f.w,H=f.h,dpr=f.dpr;ensure(Math.round(P.count),W,H);
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);const cols=[P.c1,P.c2,P.c3,P.c4];
      for(const p of ps){p.y+=p.vy*P.speed*dpr;p.x+=(p.vx+Math.sin(p.y*0.01)*0.5)*dpr;p.r+=p.vr*P.speed;
        if(p.y>H+10){p.y=-10;p.x=rand(W);}
        const s=P.size*p.w*dpr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=cols[p.ci];ctx.fillRect(-s/2,-s/4,s,s/2);ctx.restore();}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);}};
  }
});
/* ====================== RAYMARCH 3D (WebGL) ====================== */
reg({
  id:'raymarch', name:'Raymarch Infinito', cat:'Shader', heavy:true,
  desc:'Render 3D em tempo real (raymarching), campo infinito de objetos neon voando até você.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'density',label:'Densidade',type:'range',min:2.5,max:6,step:0.25,default:4},
    {key:'glow',label:'Brilho',type:'range',min:0.02,max:0.2,step:0.005,default:0.08},
    {key:'c1',label:'Cor 1',type:'color',default:'#2a0a4a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#00e5ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ff2e9a'}
  ],
  fn:function(canvas,getP){return GLBG(canvas,getP,rmFrag('float d=u_density;vec3 q=p;q.xy=mod(q.xy+0.5*d,d)-0.5*d;q.z=mod(q.z+0.5*d,d)-0.5*d;float boxes=sdBox(q,vec3(0.42))-0.08;float tube=length(p.xy)-d*0.42;return max(boxes,-tube);'),rmUniforms);}
});

reg({
  id:'rmspheres', name:'Túnel de Esferas', cat:'Shader', heavy:true,
  desc:'Voo por um campo infinito de esferas iluminadas, em loop contínuo.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'density',label:'Densidade',type:'range',min:2.5,max:6,step:0.25,default:4},
    {key:'glow',label:'Brilho',type:'range',min:0.02,max:0.2,step:0.005,default:0.08},
    {key:'c1',label:'Cor 1',type:'color',default:'#0a1a3a'},
    {key:'c2',label:'Cor 2',type:'color',default:'#2effd5'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ff5ea8'}
  ],
  fn:function(canvas,getP){return GLBG(canvas,getP,rmFrag('float d=u_density;vec3 q=p;q.xy=mod(q.xy+0.5*d,d)-0.5*d;q.z=mod(q.z+0.5*d,d)-0.5*d;float s=length(q)-d*0.22;float tube=length(p.xy)-d*0.42;return max(s,-tube);'),rmUniforms);}
});

reg({
  id:'rmrings', name:'Anéis Infinitos', cat:'Shader', heavy:true,
  desc:'Atravesse uma sucessão infinita de anéis (toros) neon que vêm na sua direção.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'density',label:'Espaçamento',type:'range',min:2.5,max:6,step:0.25,default:4},
    {key:'glow',label:'Brilho',type:'range',min:0.02,max:0.2,step:0.005,default:0.08},
    {key:'c1',label:'Cor 1',type:'color',default:'#1a0833'},
    {key:'c2',label:'Cor 2',type:'color',default:'#b06bff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#3df0ff'}
  ],
  fn:function(canvas,getP){return GLBG(canvas,getP,rmFrag('float d=u_density;float z=mod(p.z+0.5*d,d)-0.5*d;return sdTorus(vec3(p.x,z,p.y),vec2(d*0.5,d*0.13));'),rmUniforms);}
});

reg({
  id:'rmocta', name:'Túnel de Octaedros', cat:'Shader', heavy:true,
  desc:'Cristais octaédricos repetidos ao infinito, iluminados, em voo contínuo.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'density',label:'Densidade',type:'range',min:2.5,max:6,step:0.25,default:4},
    {key:'glow',label:'Brilho',type:'range',min:0.02,max:0.2,step:0.005,default:0.08},
    {key:'c1',label:'Cor 1',type:'color',default:'#06121f'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ffd84d'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ff4d6d'}
  ],
  fn:function(canvas,getP){return GLBG(canvas,getP,rmFrag('float d=u_density;vec3 q=p;q.xy=mod(q.xy+0.5*d,d)-0.5*d;q.z=mod(q.z+0.5*d,d)-0.5*d;float o=sdOct(q,d*0.32);float tube=length(p.xy)-d*0.42;return max(o,-tube);'),rmUniforms);}
});

reg({
  id:'rmcolumns', name:'Colunata Infinita', cat:'Shader', heavy:true,
  desc:'Corredor sem fim ladeado por colunas neon que passam dos dois lados.',
  params:[
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'density',label:'Espaçamento',type:'range',min:2.5,max:6,step:0.25,default:4},
    {key:'glow',label:'Brilho',type:'range',min:0.02,max:0.2,step:0.005,default:0.08},
    {key:'c1',label:'Cor 1',type:'color',default:'#0a0820'},
    {key:'c2',label:'Cor 2',type:'color',default:'#33e0ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ff7a3d'}
  ],
  fn:function(canvas,getP){return GLBG(canvas,getP,rmFrag('float d=u_density;vec2 c=mod(p.xz+0.5*d,d)-0.5*d;float cyl=length(c)-d*0.16;return max(cyl,d*0.42-abs(p.x));'),rmUniforms);}
});

/* ====================== SVG GEOMÉTRICO ====================== */
reg({
  id:'svgGeo', name:'Mandala Geométrica (SVG)', cat:'Geométrico',
  desc:'Animação vetorial em SVG: polígonos concêntricos girando em simetria, geometria pura e nítida.',
  params:[
    {key:'rings',label:'Anéis',type:'range',min:3,max:14,step:1,default:8},
    {key:'sides',label:'Lados',type:'range',min:3,max:10,step:1,default:6},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'stroke',label:'Espessura',type:'range',min:0.2,max:3,step:0.1,default:0.7},
    {key:'c1',label:'Cor 1',type:'color',default:'#00e5ff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#ff2e9a'},
    {key:'bg',label:'Fundo',type:'color',default:'#06030f'}
  ],
  fn:function(canvas,getP){
    const host=canvas.parentNode;const svg=svgEl('svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','xMidYMid slice');svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block';
    host.insertBefore(svg,canvas.nextSibling);
    const bg=svgEl('rect');bg.setAttribute('x','-10');bg.setAttribute('y','-10');bg.setAttribute('width','120');bg.setAttribute('height','120');svg.appendChild(bg);
    let polys=[],raf,stopped=false,t=0,curR=0,curS=0;
    function pth(cx,cy,r,sides,rot){let d='';for(let i=0;i<sides;i++){const a=rot+i/sides*TAU,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;d+=(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)+' ';}return d+'Z';}
    function rebuild(n){polys.forEach(p=>p.remove());polys=[];for(let i=0;i<n;i++){const p=svgEl('path');p.setAttribute('fill','none');svg.appendChild(p);polys.push(p);}}
    function frame(){if(stopped)return;const P=getP();t+=0.01*P.speed;const n=Math.round(P.rings),sides=Math.round(P.sides);
      if(n!==curR){rebuild(n);curR=n;}curS=sides;bg.setAttribute('fill',P.bg);const c1=hexToRgb(P.c1),c2=hexToRgb(P.c2),den=Math.max(1,polys.length-1);
      for(let i=0;i<polys.length;i++){const m=i/den,r=6+i*(46/den),rot=t*(1+i*0.15)*(i%2?1:-1)+i*0.2;
        polys[i].setAttribute('d',pth(50,50,r*(1+0.04*Math.sin(t*2+i)),sides,rot));
        polys[i].setAttribute('stroke','rgb('+((c1.r+(c2.r-c1.r)*m)|0)+','+((c1.g+(c2.g-c1.g)*m)|0)+','+((c1.b+(c2.b-c1.b)*m)|0)+')');
        polys[i].setAttribute('stroke-width',P.stroke.toFixed(2));}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);svg.remove();}};
  }
});

reg({
  id:'svgWaves', name:'Ondas Geométricas (SVG)', cat:'Geométrico',
  desc:'Camadas de ondas vetoriais (SVG) deslizando suavemente, translúcidas e sobrepostas.',
  params:[
    {key:'layers',label:'Camadas',type:'range',min:2,max:7,step:1,default:4},
    {key:'speed',label:'Velocidade',type:'range',min:0,max:3,step:0.05,default:1},
    {key:'amp',label:'Amplitude',type:'range',min:2,max:20,step:1,default:9},
    {key:'c1',label:'Cor 1',type:'color',default:'#5465ff'},
    {key:'c2',label:'Cor 2',type:'color',default:'#00d4ff'},
    {key:'c3',label:'Cor 3',type:'color',default:'#ff5e9a'},
    {key:'bg',label:'Fundo',type:'color',default:'#070617'}
  ],
  fn:function(canvas,getP){
    const host=canvas.parentNode;const svg=svgEl('svg');svg.setAttribute('viewBox','0 0 100 60');svg.setAttribute('preserveAspectRatio','none');svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;display:block';
    host.insertBefore(svg,canvas.nextSibling);
    const bg=svgEl('rect');bg.setAttribute('width','100');bg.setAttribute('height','60');svg.appendChild(bg);
    let paths=[],raf,stopped=false,t=0,cur=0;
    function rebuild(n){paths.forEach(p=>p.remove());paths=[];for(let i=0;i<n;i++){const p=svgEl('path');svg.appendChild(p);paths.push(p);}cur=n;}
    function frame(){if(stopped)return;const P=getP();t+=0.02*P.speed;const n=Math.round(P.layers);if(n!==cur)rebuild(n);
      bg.setAttribute('fill',P.bg);const cols=[P.c1,P.c2,P.c3];
      for(let i=0;i<paths.length;i++){const baseY=16+i*(40/Math.max(1,paths.length)),ph=t*(1+i*0.2)+i;let d='M0 60 L0 '+baseY.toFixed(2)+' ';
        for(let x=0;x<=100;x+=4){const y=baseY+Math.sin(x*0.12+ph)*P.amp*0.5+Math.sin(x*0.05-ph*0.7)*P.amp*0.5;d+='L'+x+' '+y.toFixed(2)+' ';}
        d+='L100 60 Z';paths[i].setAttribute('d',d);paths[i].setAttribute('fill',rgbaHex(cols[i%cols.length],0.45));}
      raf=requestAnimationFrame(frame);}
    frame();return{stop(){stopped=true;cancelAnimationFrame(raf);svg.remove();}};
  }
});

/* ====================== INTERATIVO: CAMPO DE VETORES ====================== */
reg({
  id:'vectorfield', name:'Vetores (apontam pro mouse)', cat:'Interativo',
  desc:'Uma malha de palitinhos que giram para apontar (ou fugir) do cursor, com retorno suave quando o mouse sai. Funciona com toque no mobile.',
  params:[
    {key:'gap',label:'Espacamento',type:'range',min:18,max:80,step:1,default:34,reinit:true},
    {key:'len',label:'Comprimento',type:'range',min:4,max:40,step:1,default:15},
    {key:'thick',label:'Espessura',type:'range',min:1,max:6,step:0.5,default:2},
    {key:'ease',label:'Suavidade',type:'range',min:0.02,max:0.4,step:0.01,default:0.16},
    {key:'reach',label:'Alcance do mouse',type:'range',min:60,max:900,step:10,default:340},
    {key:'idle',label:'Movimento ocioso',type:'range',min:0,max:1,step:0.05,default:0.3},
    {key:'mode',label:'Comportamento',type:'select',options:[['toward','Apontar para o mouse'],['away','Fugir do mouse']],default:'toward'},
    {key:'dot',label:'Ponto na ponta',type:'bool',default:true},
    {key:'c1',label:'Cor base',type:'color',default:'#5b4bd6'},
    {key:'c2',label:'Cor no mouse',type:'color',default:'#00e5ff'},
    {key:'bg',label:'Fundo',type:'color',default:'#07070d'}
  ],
  fn:function(canvas,getP){
    const ctx=canvas.getContext('2d');
    let raf,stopped=false,t=0,grid=[],lastGap=0,lastW=0,lastH=0;
    const mouse={x:-1e5,y:-1e5,on:false};
    function mv(e){const r=canvas.getBoundingClientRect();const d=Math.min(window.devicePixelRatio||1,2);mouse.x=(e.clientX-r.left)*d;mouse.y=(e.clientY-r.top)*d;mouse.on=true;}
    function lv(){mouse.on=false;}
    function tm(e){if(e.touches&&e.touches[0])mv(e.touches[0]);}
    canvas.addEventListener('mousemove',mv);
    canvas.addEventListener('mouseleave',lv);
    canvas.addEventListener('touchmove',tm,{passive:true});
    canvas.addEventListener('touchend',lv);
    function rebuild(W,H,gap){
      grid=[];const gw=Math.ceil(W/gap)+1,gh=Math.ceil(H/gap)+1;
      for(let j=0;j<gh;j++)for(let i=0;i<gw;i++)grid.push({x:i*gap+gap*0.5,y:j*gap+gap*0.5,a:rand(TAU),ph:rand(TAU),baseA:0});
      lastGap=gap;lastW=W;lastH=H;
    }
    function frame(){
      if(stopped)return;const P=getP();const f=fit(canvas,2),W=f.w,H=f.h,dpr=f.dpr;
      const gap=P.gap*dpr;
      if(gap!==lastGap||W!==lastW||H!==lastH)rebuild(W,H,gap);
      t+=0.02;
      ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);
      const len=P.len*dpr,reach=P.reach*dpr,c1=hexToRgb(P.c1),c2=hexToRgb(P.c2);
      ctx.lineWidth=P.thick*dpr;ctx.lineCap='round';
      for(let k=0;k<grid.length;k++){const g=grid[k];let target=g.baseA,inf=0;
        if(mouse.on){const dx=mouse.x-g.x,dy=mouse.y-g.y,dist=Math.hypot(dx,dy);
          if(dist<reach){inf=1-dist/reach;let ang=Math.atan2(dy,dx);if(P.mode==='away')ang+=Math.PI;target=ang;}}
        if(inf<0.001)target=g.baseA+Math.sin(t+g.ph)*0.7*P.idle;
        let da=target-g.a;da=Math.atan2(Math.sin(da),Math.cos(da));g.a+=da*P.ease;
        const ex=g.x+Math.cos(g.a)*len,ey=g.y+Math.sin(g.a)*len;
        const r=lerp(c1.r,c2.r,inf)|0,gg=lerp(c1.g,c2.g,inf)|0,b=lerp(c1.b,c2.b,inf)|0;
        ctx.strokeStyle='rgba('+r+','+gg+','+b+','+(0.32+0.68*inf)+')';
        ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(ex,ey);ctx.stroke();
        if(P.dot){ctx.fillStyle='rgb('+r+','+gg+','+b+')';ctx.beginPath();ctx.arc(ex,ey,ctx.lineWidth*0.7,0,TAU);ctx.fill();}
      }
      raf=requestAnimationFrame(frame);
    }
    frame();
    return {stop(){stopped=true;cancelAnimationFrame(raf);canvas.removeEventListener('mousemove',mv);canvas.removeEventListener('mouseleave',lv);canvas.removeEventListener('touchmove',tm);canvas.removeEventListener('touchend',lv);}};
  }
});
export { EFFECTS, PRELUDE_FN };
