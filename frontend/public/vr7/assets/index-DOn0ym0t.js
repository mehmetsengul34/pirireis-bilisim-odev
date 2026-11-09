(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Wo="174",$l=0,Ea=1,Jl=2,qc=1,Yc=2,gn=3,In=0,Le=1,Qe=2,Pn=0,Ai=1,Ta=2,ba=3,Aa=4,Kl=5,$n=100,jl=101,Ql=102,tu=103,eu=104,nu=200,iu=201,ru=202,su=203,Js=204,Ks=205,ou=206,au=207,cu=208,lu=209,uu=210,hu=211,fu=212,du=213,pu=214,js=0,Qs=1,to=2,Pi=3,eo=4,no=5,io=6,ro=7,Zc=0,mu=1,gu=2,Ln=0,_u=1,vu=2,xu=3,$c=4,Mu=5,Su=6,yu=7,Jc=300,Li=301,Di=302,so=303,oo=304,is=306,ao=1e3,Kn=1001,co=1002,en=1003,Eu=1004,dr=1005,on=1006,hs=1007,jn=1008,Sn=1009,Kc=1010,jc=1011,rr=1012,Xo=1013,Qn=1014,_n=1015,lr=1016,qo=1017,Yo=1018,Ui=1020,Qc=35902,tl=1021,el=1022,tn=1023,nl=1024,il=1025,wi=1026,Ii=1027,rl=1028,Zo=1029,sl=1030,$o=1031,Jo=1033,Wr=33776,Xr=33777,qr=33778,Yr=33779,lo=35840,uo=35841,ho=35842,fo=35843,po=36196,mo=37492,go=37496,_o=37808,vo=37809,xo=37810,Mo=37811,So=37812,yo=37813,Eo=37814,To=37815,bo=37816,Ao=37817,wo=37818,Ro=37819,Co=37820,Po=37821,Zr=36492,Lo=36494,Do=36495,ol=36283,Uo=36284,Io=36285,No=36286,Tu=3200,bu=3201,al=0,Au=1,Cn="",Pe="srgb",Ni="srgb-linear",Jr="linear",ie="srgb",oi=7680,wa=519,wu=512,Ru=513,Cu=514,cl=515,Pu=516,Lu=517,Du=518,Uu=519,Fo=35044,Ra="300 es",vn=2e3,Kr=2001;class zi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const r=n[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const Te=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fs=Math.PI/180,Oo=180/Math.PI;function xn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Te[i&255]+Te[i>>8&255]+Te[i>>16&255]+Te[i>>24&255]+"-"+Te[t&255]+Te[t>>8&255]+"-"+Te[t>>16&15|64]+Te[t>>24&255]+"-"+Te[e&63|128]+Te[e>>8&255]+"-"+Te[e>>16&255]+Te[e>>24&255]+Te[n&255]+Te[n>>8&255]+Te[n>>16&255]+Te[n>>24&255]).toLowerCase()}function Yt(i,t,e){return Math.max(t,Math.min(e,i))}function Iu(i,t){return(i%t+t)%t}function ds(i,t,e){return(1-e)*i+e*t}function sn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function re(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class ot{constructor(t=0,e=0){ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Yt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ht{constructor(t,e,n,r,s,o,a,c,l){Ht.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l)}set(t,e,n,r,s,o,a,c,l){const u=this.elements;return u[0]=t,u[1]=r,u[2]=a,u[3]=e,u[4]=s,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],m=n[5],g=n[8],v=r[0],p=r[3],f=r[6],A=r[1],T=r[4],S=r[7],L=r[2],R=r[5],w=r[8];return s[0]=o*v+a*A+c*L,s[3]=o*p+a*T+c*R,s[6]=o*f+a*S+c*w,s[1]=l*v+u*A+h*L,s[4]=l*p+u*T+h*R,s[7]=l*f+u*S+h*w,s[2]=d*v+m*A+g*L,s[5]=d*p+m*T+g*R,s[8]=d*f+m*S+g*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8];return e*o*u-e*a*l-n*s*u+n*a*c+r*s*l-r*o*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=u*o-a*l,d=a*c-u*s,m=l*s-o*c,g=e*h+n*d+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=h*v,t[1]=(r*l-u*n)*v,t[2]=(a*n-r*o)*v,t[3]=d*v,t[4]=(u*e-r*c)*v,t[5]=(r*s-a*e)*v,t[6]=m*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-r*l,r*c,-r*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ps.makeScale(t,e)),this}rotate(t){return this.premultiply(ps.makeRotation(-t)),this}translate(t,e){return this.premultiply(ps.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ps=new Ht;function ll(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function jr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Nu(){const i=jr("canvas");return i.style.display="block",i}const Ca={};function qn(i){i in Ca||(Ca[i]=!0,console.warn(i))}function Fu(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}function Ou(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Bu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Pa=new Ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),La=new Ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zu(){const i={enabled:!0,workingColorSpace:Ni,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===ie&&(r.r=Mn(r.r),r.g=Mn(r.g),r.b=Mn(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ie&&(r.r=Ri(r.r),r.g=Ri(r.g),r.b=Ri(r.b))),r},fromWorkingColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},toWorkingColorSpace:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Cn?Jr:this.spaces[r].transfer},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ni]:{primaries:t,whitePoint:n,transfer:Jr,toXYZ:Pa,fromXYZ:La,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Pe},outputColorSpaceConfig:{drawingBufferColorSpace:Pe}},[Pe]:{primaries:t,whitePoint:n,transfer:ie,toXYZ:Pa,fromXYZ:La,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Pe}}}),i}const Qt=zu();function Mn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ri(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ai;class Gu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ai===void 0&&(ai=jr("canvas")),ai.width=t.width,ai.height=t.height;const n=ai.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ai}return e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=jr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Mn(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Mn(e[n]/255)*255):e[n]=Mn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Vu=0;class Ko{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=xn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ms(r[o].image)):s.push(ms(r[o]))}else s=ms(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function ms(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ku=0;class De extends zi{constructor(t=De.DEFAULT_IMAGE,e=De.DEFAULT_MAPPING,n=Kn,r=Kn,s=on,o=jn,a=tn,c=Sn,l=De.DEFAULT_ANISOTROPY,u=Cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=xn(),this.name="",this.source=new Ko(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ao:t.x=t.x-Math.floor(t.x);break;case Kn:t.x=t.x<0?0:1;break;case co:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ao:t.y=t.y-Math.floor(t.y);break;case Kn:t.y=t.y<0?0:1;break;case co:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}De.DEFAULT_IMAGE=null;De.DEFAULT_MAPPING=Jc;De.DEFAULT_ANISOTROPY=1;class se{constructor(t=0,e=0,n=0,r=1){se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],u=c[4],h=c[8],d=c[1],m=c[5],g=c[9],v=c[2],p=c[6],f=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(l+1)/2,S=(m+1)/2,L=(f+1)/2,R=(u+d)/4,w=(h+v)/4,D=(g+p)/4;return T>S&&T>L?T<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(T),r=R/n,s=w/n):S>L?S<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),n=R/r,s=D/r):L<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(L),n=w/s,r=D/s),this.set(n,r,s,e),this}let A=Math.sqrt((p-g)*(p-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(A)<.001&&(A=1),this.x=(p-g)/A,this.y=(h-v)/A,this.z=(d-u)/A,this.w=Math.acos((l+m+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this.z=Yt(this.z,t.z,e.z),this.w=Yt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this.z=Yt(this.z,t,e),this.w=Yt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Hu extends zi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);const r={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new De(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const r=Object.assign({},t.textures[e].image);this.textures[e].source=new Ko(r)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ti extends Hu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ul extends De{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wu extends De{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class an{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let c=n[r+0],l=n[r+1],u=n[r+2],h=n[r+3];const d=s[o+0],m=s[o+1],g=s[o+2],v=s[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=m,t[e+2]=g,t[e+3]=v;return}if(h!==v||c!==d||l!==m||u!==g){let p=1-a;const f=c*d+l*m+u*g+h*v,A=f>=0?1:-1,T=1-f*f;if(T>Number.EPSILON){const L=Math.sqrt(T),R=Math.atan2(L,f*A);p=Math.sin(p*R)/L,a=Math.sin(a*R)/L}const S=a*A;if(c=c*p+d*S,l=l*p+m*S,u=u*p+g*S,h=h*p+v*S,p===1-a){const L=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=L,l*=L,u*=L,h*=L}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,r,s,o){const a=n[r],c=n[r+1],l=n[r+2],u=n[r+3],h=s[o],d=s[o+1],m=s[o+2],g=s[o+3];return t[e]=a*g+u*h+c*m-l*d,t[e+1]=c*g+u*d+l*h-a*m,t[e+2]=l*g+u*m+a*d-c*h,t[e+3]=u*g-a*h-c*d-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(r/2),h=a(s/2),d=c(n/2),m=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*u*h+l*m*g,this._y=l*m*h-d*u*g,this._z=l*u*g+d*m*h,this._w=l*u*h-d*m*g;break;case"YXZ":this._x=d*u*h+l*m*g,this._y=l*m*h-d*u*g,this._z=l*u*g-d*m*h,this._w=l*u*h+d*m*g;break;case"ZXY":this._x=d*u*h-l*m*g,this._y=l*m*h+d*u*g,this._z=l*u*g+d*m*h,this._w=l*u*h-d*m*g;break;case"ZYX":this._x=d*u*h-l*m*g,this._y=l*m*h+d*u*g,this._z=l*u*g-d*m*h,this._w=l*u*h+d*m*g;break;case"YZX":this._x=d*u*h+l*m*g,this._y=l*m*h+d*u*g,this._z=l*u*g-d*m*h,this._w=l*u*h-d*m*g;break;case"XZY":this._x=d*u*h-l*m*g,this._y=l*m*h-d*u*g,this._z=l*u*g+d*m*h,this._w=l*u*h+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],c=e[9],l=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-l)*m,this._z=(o-r)*m}else if(n>a&&n>h){const m=2*Math.sqrt(1+n-a-h);this._w=(u-c)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+l)/m}else if(a>h){const m=2*Math.sqrt(1+a-n-h);this._w=(s-l)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+h-n-a);this._w=(o-r)/m,this._x=(s+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Yt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+o*a+r*l-s*c,this._y=r*u+o*c+s*a-n*l,this._z=s*u+o*l+n*c-r*a,this._w=o*u-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*r+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-e)*u)/l,d=Math.sin(e*u)/l;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Da.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Da.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*r-a*n),u=2*(a*e-s*r),h=2*(s*n-o*e);return this.x=e+c*l+o*h-a*u,this.y=n+c*u+a*l-s*h,this.z=r+c*h+s*u-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this.z=Yt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this.z=Yt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,c=e.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return gs.copy(this).projectOnVector(t),this.sub(gs)}reflect(t){return this.sub(gs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Yt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const gs=new P,Da=new an;class Gi{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint($e.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint($e.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=$e.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,$e):$e.fromBufferAttribute(s,o),$e.applyMatrix4(t.matrixWorld),this.expandByPoint($e);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),pr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),pr.copy(n.boundingBox)),pr.applyMatrix4(t.matrixWorld),this.union(pr)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,$e),$e.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wi),mr.subVectors(this.max,Wi),ci.subVectors(t.a,Wi),li.subVectors(t.b,Wi),ui.subVectors(t.c,Wi),yn.subVectors(li,ci),En.subVectors(ui,li),zn.subVectors(ci,ui);let e=[0,-yn.z,yn.y,0,-En.z,En.y,0,-zn.z,zn.y,yn.z,0,-yn.x,En.z,0,-En.x,zn.z,0,-zn.x,-yn.y,yn.x,0,-En.y,En.x,0,-zn.y,zn.x,0];return!_s(e,ci,li,ui,mr)||(e=[1,0,0,0,1,0,0,0,1],!_s(e,ci,li,ui,mr))?!1:(gr.crossVectors(yn,En),e=[gr.x,gr.y,gr.z],_s(e,ci,li,ui,mr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,$e).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize($e).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(hn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),hn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),hn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),hn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),hn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),hn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),hn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),hn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(hn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const hn=[new P,new P,new P,new P,new P,new P,new P,new P],$e=new P,pr=new Gi,ci=new P,li=new P,ui=new P,yn=new P,En=new P,zn=new P,Wi=new P,mr=new P,gr=new P,Gn=new P;function _s(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Gn.fromArray(i,s);const a=r.x*Math.abs(Gn.x)+r.y*Math.abs(Gn.y)+r.z*Math.abs(Gn.z),c=t.dot(Gn),l=e.dot(Gn),u=n.dot(Gn);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const Xu=new Gi,Xi=new P,vs=new P;class jo{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Xu.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xi.subVectors(t,this.center);const e=Xi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Xi,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(vs.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xi.copy(t.center).add(vs)),this.expandByPoint(Xi.copy(t.center).sub(vs))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const fn=new P,xs=new P,_r=new P,Tn=new P,Ms=new P,vr=new P,Ss=new P;class hl{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=fn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(fn.copy(this.origin).addScaledVector(this.direction,e),fn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){xs.copy(t).add(e).multiplyScalar(.5),_r.copy(e).sub(t).normalize(),Tn.copy(this.origin).sub(xs);const s=t.distanceTo(e)*.5,o=-this.direction.dot(_r),a=Tn.dot(this.direction),c=-Tn.dot(_r),l=Tn.lengthSq(),u=Math.abs(1-o*o);let h,d,m,g;if(u>0)if(h=o*c-a,d=o*a-c,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,m=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=s,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*c)+l;else d=-s,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-c),s),m=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-s,-c),s),m=d*(d+2*c)+l):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-c),s),m=-h*h+d*(d+2*c)+l);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),m=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(xs).addScaledVector(_r,d),m}intersectSphere(t,e){fn.subVectors(t.center,this.origin);const n=fn.dot(this.direction),r=fn.dot(fn)-n*n,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),u>=0?(s=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(s=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(t.min.z-d.z)*h,c=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,c=(t.min.z-d.z)*h),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,fn)!==null}intersectTriangle(t,e,n,r,s){Ms.subVectors(e,t),vr.subVectors(n,t),Ss.crossVectors(Ms,vr);let o=this.direction.dot(Ss),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Tn.subVectors(this.origin,t);const c=a*this.direction.dot(vr.crossVectors(Tn,vr));if(c<0)return null;const l=a*this.direction.dot(Ms.cross(Tn));if(l<0||c+l>o)return null;const u=-a*Tn.dot(Ss);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,r,s,o,a,c,l,u,h,d,m,g,v,p){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l,u,h,d,m,g,v,p)}set(t,e,n,r,s,o,a,c,l,u,h,d,m,g,v,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=u,f[10]=h,f[14]=d,f[3]=m,f[7]=g,f[11]=v,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/hi.setFromMatrixColumn(t,0).length(),s=1/hi.setFromMatrixColumn(t,1).length(),o=1/hi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const d=o*u,m=o*h,g=a*u,v=a*h;e[0]=c*u,e[4]=-c*h,e[8]=l,e[1]=m+g*l,e[5]=d-v*l,e[9]=-a*c,e[2]=v-d*l,e[6]=g+m*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*u,m=c*h,g=l*u,v=l*h;e[0]=d+v*a,e[4]=g*a-m,e[8]=o*l,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=m*a-g,e[6]=v+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*u,m=c*h,g=l*u,v=l*h;e[0]=d-v*a,e[4]=-o*h,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*u,e[9]=v-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*u,m=o*h,g=a*u,v=a*h;e[0]=c*u,e[4]=g*l-m,e[8]=d*l+v,e[1]=c*h,e[5]=v*l+d,e[9]=m*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*u,e[4]=v-d*h,e[8]=g*h+m,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-l*u,e[6]=m*h+g,e[10]=d-v*h}else if(t.order==="XZY"){const d=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*u,e[4]=-h,e[8]=l*u,e[1]=d*h+v,e[5]=o*u,e[9]=m*h-g,e[2]=g*h-m,e[6]=a*u,e[10]=v*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qu,t,Yu)}lookAt(t,e,n){const r=this.elements;return Fe.subVectors(t,e),Fe.lengthSq()===0&&(Fe.z=1),Fe.normalize(),bn.crossVectors(n,Fe),bn.lengthSq()===0&&(Math.abs(n.z)===1?Fe.x+=1e-4:Fe.z+=1e-4,Fe.normalize(),bn.crossVectors(n,Fe)),bn.normalize(),xr.crossVectors(Fe,bn),r[0]=bn.x,r[4]=xr.x,r[8]=Fe.x,r[1]=bn.y,r[5]=xr.y,r[9]=Fe.y,r[2]=bn.z,r[6]=xr.z,r[10]=Fe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],m=n[13],g=n[2],v=n[6],p=n[10],f=n[14],A=n[3],T=n[7],S=n[11],L=n[15],R=r[0],w=r[4],D=r[8],y=r[12],x=r[1],C=r[5],z=r[9],O=r[13],W=r[2],$=r[6],H=r[10],Q=r[14],V=r[3],ut=r[7],_t=r[11],St=r[15];return s[0]=o*R+a*x+c*W+l*V,s[4]=o*w+a*C+c*$+l*ut,s[8]=o*D+a*z+c*H+l*_t,s[12]=o*y+a*O+c*Q+l*St,s[1]=u*R+h*x+d*W+m*V,s[5]=u*w+h*C+d*$+m*ut,s[9]=u*D+h*z+d*H+m*_t,s[13]=u*y+h*O+d*Q+m*St,s[2]=g*R+v*x+p*W+f*V,s[6]=g*w+v*C+p*$+f*ut,s[10]=g*D+v*z+p*H+f*_t,s[14]=g*y+v*O+p*Q+f*St,s[3]=A*R+T*x+S*W+L*V,s[7]=A*w+T*C+S*$+L*ut,s[11]=A*D+T*z+S*H+L*_t,s[15]=A*y+T*O+S*Q+L*St,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],c=t[9],l=t[13],u=t[2],h=t[6],d=t[10],m=t[14],g=t[3],v=t[7],p=t[11],f=t[15];return g*(+s*c*h-r*l*h-s*a*d+n*l*d+r*a*m-n*c*m)+v*(+e*c*m-e*l*d+s*o*d-r*o*m+r*l*u-s*c*u)+p*(+e*l*h-e*a*m-s*o*h+n*o*m+s*a*u-n*l*u)+f*(-r*a*u-e*c*h+e*a*d+r*o*h-n*o*d+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],u=t[8],h=t[9],d=t[10],m=t[11],g=t[12],v=t[13],p=t[14],f=t[15],A=h*p*l-v*d*l+v*c*m-a*p*m-h*c*f+a*d*f,T=g*d*l-u*p*l-g*c*m+o*p*m+u*c*f-o*d*f,S=u*v*l-g*h*l+g*a*m-o*v*m-u*a*f+o*h*f,L=g*h*c-u*v*c-g*a*d+o*v*d+u*a*p-o*h*p,R=e*A+n*T+r*S+s*L;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/R;return t[0]=A*w,t[1]=(v*d*s-h*p*s-v*r*m+n*p*m+h*r*f-n*d*f)*w,t[2]=(a*p*s-v*c*s+v*r*l-n*p*l-a*r*f+n*c*f)*w,t[3]=(h*c*s-a*d*s-h*r*l+n*d*l+a*r*m-n*c*m)*w,t[4]=T*w,t[5]=(u*p*s-g*d*s+g*r*m-e*p*m-u*r*f+e*d*f)*w,t[6]=(g*c*s-o*p*s-g*r*l+e*p*l+o*r*f-e*c*f)*w,t[7]=(o*d*s-u*c*s+u*r*l-e*d*l-o*r*m+e*c*m)*w,t[8]=S*w,t[9]=(g*h*s-u*v*s-g*n*m+e*v*m+u*n*f-e*h*f)*w,t[10]=(o*v*s-g*a*s+g*n*l-e*v*l-o*n*f+e*a*f)*w,t[11]=(u*a*s-o*h*s-u*n*l+e*h*l+o*n*m-e*a*m)*w,t[12]=L*w,t[13]=(u*v*r-g*h*r+g*n*d-e*v*d-u*n*p+e*h*p)*w,t[14]=(g*a*r-o*v*r-g*n*c+e*v*c+o*n*p-e*a*p)*w,t[15]=(o*h*r-u*a*r+u*n*c-e*h*c-o*n*d+e*a*d)*w,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,c=t.z,l=s*o,u=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,u*a+n,u*c-r*o,0,l*c-r*a,u*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,o=e._y,a=e._z,c=e._w,l=s+s,u=o+o,h=a+a,d=s*l,m=s*u,g=s*h,v=o*u,p=o*h,f=a*h,A=c*l,T=c*u,S=c*h,L=n.x,R=n.y,w=n.z;return r[0]=(1-(v+f))*L,r[1]=(m+S)*L,r[2]=(g-T)*L,r[3]=0,r[4]=(m-S)*R,r[5]=(1-(d+f))*R,r[6]=(p+A)*R,r[7]=0,r[8]=(g+T)*w,r[9]=(p-A)*w,r[10]=(1-(d+v))*w,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=hi.set(r[0],r[1],r[2]).length();const o=hi.set(r[4],r[5],r[6]).length(),a=hi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],Je.copy(this);const l=1/s,u=1/o,h=1/a;return Je.elements[0]*=l,Je.elements[1]*=l,Je.elements[2]*=l,Je.elements[4]*=u,Je.elements[5]*=u,Je.elements[6]*=u,Je.elements[8]*=h,Je.elements[9]*=h,Je.elements[10]*=h,e.setFromRotationMatrix(Je),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=vn){const c=this.elements,l=2*s/(e-t),u=2*s/(n-r),h=(e+t)/(e-t),d=(n+r)/(n-r);let m,g;if(a===vn)m=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===Kr)m=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=vn){const c=this.elements,l=1/(e-t),u=1/(n-r),h=1/(o-s),d=(e+t)*l,m=(n+r)*u;let g,v;if(a===vn)g=(o+s)*h,v=-2*h;else if(a===Kr)g=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const hi=new P,Je=new oe,qu=new P(0,0,0),Yu=new P(1,1,1),bn=new P,xr=new P,Fe=new P,Ua=new oe,Ia=new an;class Xe{constructor(t=0,e=0,n=0,r=Xe.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],u=r[9],h=r[2],d=r[6],m=r[10];switch(e){case"XYZ":this._y=Math.asin(Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Yt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ua.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ua,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ia.setFromEuler(this),this.setFromQuaternion(Ia,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xe.DEFAULT_ORDER="XYZ";class Qo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Zu=0;const Na=new P,fi=new an,dn=new oe,Mr=new P,qi=new P,$u=new P,Ju=new an,Fa=new P(1,0,0),Oa=new P(0,1,0),Ba=new P(0,0,1),za={type:"added"},Ku={type:"removed"},di={type:"childadded",child:null},ys={type:"childremoved",child:null};class ye extends zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zu++}),this.uuid=xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new P,e=new Xe,n=new an,r=new P(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new oe},normalMatrix:{value:new Ht}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return fi.setFromAxisAngle(t,e),this.quaternion.multiply(fi),this}rotateOnWorldAxis(t,e){return fi.setFromAxisAngle(t,e),this.quaternion.premultiply(fi),this}rotateX(t){return this.rotateOnAxis(Fa,t)}rotateY(t){return this.rotateOnAxis(Oa,t)}rotateZ(t){return this.rotateOnAxis(Ba,t)}translateOnAxis(t,e){return Na.copy(t).applyQuaternion(this.quaternion),this.position.add(Na.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Fa,t)}translateY(t){return this.translateOnAxis(Oa,t)}translateZ(t){return this.translateOnAxis(Ba,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(dn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Mr.copy(t):Mr.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dn.lookAt(qi,Mr,this.up):dn.lookAt(Mr,qi,this.up),this.quaternion.setFromRotationMatrix(dn),r&&(dn.extractRotation(r.matrixWorld),fi.setFromRotationMatrix(dn),this.quaternion.premultiply(fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(za),di.child=t,this.dispatchEvent(di),di.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ku),ys.child=t,this.dispatchEvent(ys),ys.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),dn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),dn.multiply(t.parent.matrixWorld)),t.applyMatrix4(dn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(za),di.child=t,this.dispatchEvent(di),di.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,t,$u),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,Ju,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];s(t.shapes,h)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}ye.DEFAULT_UP=new P(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ke=new P,pn=new P,Es=new P,mn=new P,pi=new P,mi=new P,Ga=new P,Ts=new P,bs=new P,As=new P,ws=new se,Rs=new se,Cs=new se;class We{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),Ke.subVectors(t,e),r.cross(Ke);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){Ke.subVectors(r,e),pn.subVectors(n,e),Es.subVectors(t,e);const o=Ke.dot(Ke),a=Ke.dot(pn),c=Ke.dot(Es),l=pn.dot(pn),u=pn.dot(Es),h=o*l-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,m=(l*c-a*u)*d,g=(o*u-a*c)*d;return s.set(1-m-g,g,m)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,mn)===null?!1:mn.x>=0&&mn.y>=0&&mn.x+mn.y<=1}static getInterpolation(t,e,n,r,s,o,a,c){return this.getBarycoord(t,e,n,r,mn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,mn.x),c.addScaledVector(o,mn.y),c.addScaledVector(a,mn.z),c)}static getInterpolatedAttribute(t,e,n,r,s,o){return ws.setScalar(0),Rs.setScalar(0),Cs.setScalar(0),ws.fromBufferAttribute(t,e),Rs.fromBufferAttribute(t,n),Cs.fromBufferAttribute(t,r),o.setScalar(0),o.addScaledVector(ws,s.x),o.addScaledVector(Rs,s.y),o.addScaledVector(Cs,s.z),o}static isFrontFacing(t,e,n,r){return Ke.subVectors(n,e),pn.subVectors(t,e),Ke.cross(pn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ke.subVectors(this.c,this.b),pn.subVectors(this.a,this.b),Ke.cross(pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return We.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return We.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return We.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return We.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return We.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let o,a;pi.subVectors(r,n),mi.subVectors(s,n),Ts.subVectors(t,n);const c=pi.dot(Ts),l=mi.dot(Ts);if(c<=0&&l<=0)return e.copy(n);bs.subVectors(t,r);const u=pi.dot(bs),h=mi.dot(bs);if(u>=0&&h<=u)return e.copy(r);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),e.copy(n).addScaledVector(pi,o);As.subVectors(t,s);const m=pi.dot(As),g=mi.dot(As);if(g>=0&&m<=g)return e.copy(s);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(mi,a);const p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return Ga.subVectors(s,r),a=(h-u)/(h-u+(m-g)),e.copy(r).addScaledVector(Ga,a);const f=1/(p+v+d);return o=v*f,a=d*f,e.copy(n).addScaledVector(pi,o).addScaledVector(mi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const fl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},An={h:0,s:0,l:0},Sr={h:0,s:0,l:0};function Ps(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Pe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=Qt.workingColorSpace){if(t=Iu(t,1),e=Yt(e,0,1),n=Yt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Ps(o,s,t+1/3),this.g=Ps(o,s,t),this.b=Ps(o,s,t-1/3)}return Qt.toWorkingColorSpace(this,r),this}setStyle(t,e=Pe){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Pe){const n=fl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Mn(t.r),this.g=Mn(t.g),this.b=Mn(t.b),this}copyLinearToSRGB(t){return this.r=Ri(t.r),this.g=Ri(t.g),this.b=Ri(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Pe){return Qt.fromWorkingColorSpace(be.copy(this),t),Math.round(Yt(be.r*255,0,255))*65536+Math.round(Yt(be.g*255,0,255))*256+Math.round(Yt(be.b*255,0,255))}getHexString(t=Pe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.fromWorkingColorSpace(be.copy(this),e);const n=be.r,r=be.g,s=be.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case n:c=(r-s)/h+(r<s?6:0);break;case r:c=(s-n)/h+2;break;case s:c=(n-r)/h+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=Qt.workingColorSpace){return Qt.fromWorkingColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=Pe){Qt.fromWorkingColorSpace(be.copy(this),t);const e=be.r,n=be.g,r=be.b;return t!==Pe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(An),this.setHSL(An.h+t,An.s+e,An.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(An),t.getHSL(Sr);const n=ds(An.h,Sr.h,e),r=ds(An.s,Sr.s,e),s=ds(An.l,Sr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const be=new qt;qt.NAMES=fl;let ju=0;class Vi extends zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=xn(),this.name="",this.type="Material",this.blending=Ai,this.side=In,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Js,this.blendDst=Ks,this.blendEquation=$n,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=Pi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oi,this.stencilZFail=oi,this.stencilZPass=oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ai&&(n.blending=this.blending),this.side!==In&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Js&&(n.blendSrc=this.blendSrc),this.blendDst!==Ks&&(n.blendDst=this.blendDst),this.blendEquation!==$n&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Pi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wa&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class je extends Vi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xe,this.combine=Zc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const pe=new P,yr=new ot;let Qu=0;class nn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Qu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fo,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)yr.fromBufferAttribute(this,e),yr.applyMatrix3(t),this.setXY(e,yr.x,yr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyMatrix3(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyMatrix4(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyNormalMatrix(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.transformDirection(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=sn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=re(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=sn(e,this.array)),e}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=sn(e,this.array)),e}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=sn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=sn(e,this.array)),e}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array),r=re(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=re(e,this.array),n=re(n,this.array),r=re(r,this.array),s=re(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Fo&&(t.usage=this.usage),t}}class dl extends nn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class pl extends nn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ce extends nn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let th=0;const He=new oe,Ls=new ye,gi=new P,Oe=new Gi,Yi=new Gi,xe=new P;class Ie extends zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:th++}),this.uuid=xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ll(t)?pl:dl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ht().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return He.makeRotationFromQuaternion(t),this.applyMatrix4(He),this}rotateX(t){return He.makeRotationX(t),this.applyMatrix4(He),this}rotateY(t){return He.makeRotationY(t),this.applyMatrix4(He),this}rotateZ(t){return He.makeRotationZ(t),this.applyMatrix4(He),this}translate(t,e,n){return He.makeTranslation(t,e,n),this.applyMatrix4(He),this}scale(t,e,n){return He.makeScale(t,e,n),this.applyMatrix4(He),this}lookAt(t){return Ls.lookAt(t),Ls.updateMatrix(),this.applyMatrix4(Ls.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gi).negate(),this.translate(gi.x,gi.y,gi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const o=t[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ce(n,3))}else{const n=Math.min(t.length,e.count);for(let r=0;r<n;r++){const s=t[r];e.setXYZ(r,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Gi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];Oe.setFromBufferAttribute(s),this.morphTargetsRelative?(xe.addVectors(this.boundingBox.min,Oe.min),this.boundingBox.expandByPoint(xe),xe.addVectors(this.boundingBox.max,Oe.max),this.boundingBox.expandByPoint(xe)):(this.boundingBox.expandByPoint(Oe.min),this.boundingBox.expandByPoint(Oe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(Oe.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];Yi.setFromBufferAttribute(a),this.morphTargetsRelative?(xe.addVectors(Oe.min,Yi.min),Oe.expandByPoint(xe),xe.addVectors(Oe.max,Yi.max),Oe.expandByPoint(xe)):(Oe.expandByPoint(Yi.min),Oe.expandByPoint(Yi.max))}Oe.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)xe.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(xe));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)xe.fromBufferAttribute(a,l),c&&(gi.fromBufferAttribute(t,l),xe.add(gi)),r=Math.max(r,n.distanceToSquared(xe))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let D=0;D<n.count;D++)a[D]=new P,c[D]=new P;const l=new P,u=new P,h=new P,d=new ot,m=new ot,g=new ot,v=new P,p=new P;function f(D,y,x){l.fromBufferAttribute(n,D),u.fromBufferAttribute(n,y),h.fromBufferAttribute(n,x),d.fromBufferAttribute(s,D),m.fromBufferAttribute(s,y),g.fromBufferAttribute(s,x),u.sub(l),h.sub(l),m.sub(d),g.sub(d);const C=1/(m.x*g.y-g.x*m.y);isFinite(C)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-m.y).multiplyScalar(C),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(C),a[D].add(v),a[y].add(v),a[x].add(v),c[D].add(p),c[y].add(p),c[x].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:t.count}]);for(let D=0,y=A.length;D<y;++D){const x=A[D],C=x.start,z=x.count;for(let O=C,W=C+z;O<W;O+=3)f(t.getX(O+0),t.getX(O+1),t.getX(O+2))}const T=new P,S=new P,L=new P,R=new P;function w(D){L.fromBufferAttribute(r,D),R.copy(L);const y=a[D];T.copy(y),T.sub(L.multiplyScalar(L.dot(y))).normalize(),S.crossVectors(R,y);const C=S.dot(c[D])<0?-1:1;o.setXYZW(D,T.x,T.y,T.z,C)}for(let D=0,y=A.length;D<y;++D){const x=A[D],C=x.start,z=x.count;for(let O=C,W=C+z;O<W;O+=3)w(t.getX(O+0)),w(t.getX(O+1)),w(t.getX(O+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new nn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const r=new P,s=new P,o=new P,a=new P,c=new P,l=new P,u=new P,h=new P;if(t)for(let d=0,m=t.count;d<m;d+=3){const g=t.getX(d+0),v=t.getX(d+1),p=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,p),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,m=e.count;d<m;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)xe.fromBufferAttribute(t,e),xe.normalize(),t.setXYZ(e,xe.x,xe.y,xe.z)}toNonIndexed(){function t(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let m=0,g=0;for(let v=0,p=c.length;v<p;v++){a.isInterleavedBufferAttribute?m=c[v]*a.data.stride+a.offset:m=c[v]*u;for(let f=0;f<u;f++)d[g++]=l[m++]}return new nn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,n=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=t(c,n);e.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],m=t(d,n);c.push(m)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const m=l[h];u.push(m.toJSON(t.data))}u.length>0&&(r[c]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(e))}const s=t.morphAttributes;for(const l in s){const u=[],h=s[l];for(let d=0,m=h.length;d<m;d++)u.push(h[d].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Va=new oe,Vn=new hl,Er=new jo,ka=new P,Tr=new P,br=new P,Ar=new P,Ds=new P,wr=new P,Ha=new P,Rr=new P;class Ot extends ye{constructor(t=new Ie,e=new je){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){wr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=a[c],h=s[c];u!==0&&(Ds.fromBufferAttribute(h,t),o?wr.addScaledVector(Ds,u):wr.addScaledVector(Ds.sub(e),u))}e.add(wr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Er.copy(n.boundingSphere),Er.applyMatrix4(s),Vn.copy(t.ray).recast(t.near),!(Er.containsPoint(Vn.origin)===!1&&(Vn.intersectSphere(Er,ka)===null||Vn.origin.distanceToSquared(ka)>(t.far-t.near)**2))&&(Va.copy(s).invert(),Vn.copy(t.ray).applyMatrix4(Va),!(n.boundingBox!==null&&Vn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Vn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,m=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const p=d[g],f=o[p.materialIndex],A=Math.max(p.start,m.start),T=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let S=A,L=T;S<L;S+=3){const R=a.getX(S),w=a.getX(S+1),D=a.getX(S+2);r=Cr(this,f,t,n,l,u,h,R,w,D),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(a.count,m.start+m.count);for(let p=g,f=v;p<f;p+=3){const A=a.getX(p),T=a.getX(p+1),S=a.getX(p+2);r=Cr(this,o,t,n,l,u,h,A,T,S),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const p=d[g],f=o[p.materialIndex],A=Math.max(p.start,m.start),T=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let S=A,L=T;S<L;S+=3){const R=S,w=S+1,D=S+2;r=Cr(this,f,t,n,l,u,h,R,w,D),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let p=g,f=v;p<f;p+=3){const A=p,T=p+1,S=p+2;r=Cr(this,o,t,n,l,u,h,A,T,S),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}}}function eh(i,t,e,n,r,s,o,a){let c;if(t.side===Le?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,t.side===In,a),c===null)return null;Rr.copy(a),Rr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Rr);return l<e.near||l>e.far?null:{distance:l,point:Rr.clone(),object:i}}function Cr(i,t,e,n,r,s,o,a,c,l){i.getVertexPosition(a,Tr),i.getVertexPosition(c,br),i.getVertexPosition(l,Ar);const u=eh(i,t,e,n,Tr,br,Ar,Ha);if(u){const h=new P;We.getBarycoord(Ha,Tr,br,Ar,h),r&&(u.uv=We.getInterpolatedAttribute(r,a,c,l,h,new ot)),s&&(u.uv1=We.getInterpolatedAttribute(s,a,c,l,h,new ot)),o&&(u.normal=We.getInterpolatedAttribute(o,a,c,l,h,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new P,materialIndex:0};We.getNormal(Tr,br,Ar,d.normal),u.face=d,u.barycoord=h}return u}class Be extends Ie{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,m=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,r,o,2),g("x","z","y",1,-1,t,n,-e,r,o,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new ce(l,3)),this.setAttribute("normal",new ce(u,3)),this.setAttribute("uv",new ce(h,2));function g(v,p,f,A,T,S,L,R,w,D,y){const x=S/w,C=L/D,z=S/2,O=L/2,W=R/2,$=w+1,H=D+1;let Q=0,V=0;const ut=new P;for(let _t=0;_t<H;_t++){const St=_t*C-O;for(let Nt=0;Nt<$;Nt++){const Kt=Nt*x-z;ut[v]=Kt*A,ut[p]=St*T,ut[f]=W,l.push(ut.x,ut.y,ut.z),ut[v]=0,ut[p]=0,ut[f]=R>0?1:-1,u.push(ut.x,ut.y,ut.z),h.push(Nt/w),h.push(1-_t/D),Q+=1}}for(let _t=0;_t<D;_t++)for(let St=0;St<w;St++){const Nt=d+St+$*_t,Kt=d+St+$*(_t+1),Y=d+(St+1)+$*(_t+1),st=d+(St+1)+$*_t;c.push(Nt,Kt,st),c.push(Kt,Y,st),V+=6}a.addGroup(m,V,y),m+=V,d+=Q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Be(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Fi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Re(i){const t={};for(let e=0;e<i.length;e++){const n=Fi(i[e]);for(const r in n)t[r]=n[r]}return t}function nh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ml(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}const ih={clone:Fi,merge:Re};var rh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Nn extends Vi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rh,this.fragmentShader=sh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fi(t.uniforms),this.uniformsGroups=nh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class gl extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=vn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const wn=new P,Wa=new ot,Xa=new ot;class ze extends gl{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Oo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Oo*2*Math.atan(Math.tan(fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(wn.x,wn.y).multiplyScalar(-t/wn.z),wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(wn.x,wn.y).multiplyScalar(-t/wn.z)}getViewSize(t,e){return this.getViewBounds(t,Wa,Xa),e.subVectors(Xa,Wa)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fs*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,e-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const _i=-90,vi=1;class oh extends ye{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new ze(_i,vi,t,e);r.layers=this.layers,this.add(r);const s=new ze(_i,vi,t,e);s.layers=this.layers,this.add(s);const o=new ze(_i,vi,t,e);o.layers=this.layers,this.add(o);const a=new ze(_i,vi,t,e);a.layers=this.layers,this.add(a);const c=new ze(_i,vi,t,e);c.layers=this.layers,this.add(c);const l=new ze(_i,vi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,c]=e;for(const l of e)this.remove(l);if(t===vn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Kr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(h,d,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class _l extends De{constructor(t,e,n,r,s,o,a,c,l,u){t=t!==void 0?t:[],e=e!==void 0?e:Li,super(t,e,n,r,s,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ah extends ti{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new _l(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:on}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Be(5,5,5),s=new Nn({name:"CubemapFromEquirect",uniforms:Fi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Le,blending:Pn});s.uniforms.tEquirect.value=e;const o=new Ot(r,s),a=e.minFilter;return e.minFilter===jn&&(e.minFilter=on),new oh(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}}class Me extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ch={type:"move"};class Us{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Me,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Me,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Me,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const p=e.getJointPose(v,n),f=this._getHandJoint(l,v);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),m=.02,g=.005;l.inputState.pinching&&d>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ch)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Me;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class lh extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xe,this.environmentIntensity=1,this.environmentRotation=new Xe,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class uh{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Fo,this.updateRanges=[],this.version=0,this.uuid=xn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let r=0,s=this.stride;r<s;r++)this.array[t+r]=e.array[n+r];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const we=new P;class Qr{constructor(t,e,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=sn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=re(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=re(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=sn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=sn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=sn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=sn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array),r=re(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=re(e,this.array),n=re(n,this.array),r=re(r,this.array),s=re(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return new nn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Qr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class vl extends Vi{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new qt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let xi;const Zi=new P,Mi=new P,Si=new P,yi=new ot,$i=new ot,xl=new oe,Pr=new P,Ji=new P,Lr=new P,qa=new ot,Is=new ot,Ya=new ot;class hh extends ye{constructor(t=new vl){if(super(),this.isSprite=!0,this.type="Sprite",xi===void 0){xi=new Ie;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new uh(e,5);xi.setIndex([0,1,2,0,2,3]),xi.setAttribute("position",new Qr(n,3,0,!1)),xi.setAttribute("uv",new Qr(n,2,3,!1))}this.geometry=xi,this.material=t,this.center=new ot(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Mi.setFromMatrixScale(this.matrixWorld),xl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Si.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Mi.multiplyScalar(-Si.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const o=this.center;Dr(Pr.set(-.5,-.5,0),Si,o,Mi,r,s),Dr(Ji.set(.5,-.5,0),Si,o,Mi,r,s),Dr(Lr.set(.5,.5,0),Si,o,Mi,r,s),qa.set(0,0),Is.set(1,0),Ya.set(1,1);let a=t.ray.intersectTriangle(Pr,Ji,Lr,!1,Zi);if(a===null&&(Dr(Ji.set(-.5,.5,0),Si,o,Mi,r,s),Is.set(0,1),a=t.ray.intersectTriangle(Pr,Lr,Ji,!1,Zi),a===null))return;const c=t.ray.origin.distanceTo(Zi);c<t.near||c>t.far||e.push({distance:c,point:Zi.clone(),uv:We.getInterpolation(Zi,Pr,Ji,Lr,qa,Is,Ya,new ot),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Dr(i,t,e,n,r,s){yi.subVectors(i,e).addScalar(.5).multiply(n),r!==void 0?($i.x=s*yi.x-r*yi.y,$i.y=r*yi.x+s*yi.y):$i.copy(yi),i.copy(t),i.x+=$i.x,i.y+=$i.y,i.applyMatrix4(xl)}const Ns=new P,fh=new P,dh=new Ht;class Yn{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Ns.subVectors(n,e).cross(fh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ns),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||dh.getNormalMatrix(t),r=this.coplanarPoint(Ns).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const kn=new jo,Ur=new P;class ta{constructor(t=new Yn,e=new Yn,n=new Yn,r=new Yn,s=new Yn,o=new Yn){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=vn){const n=this.planes,r=t.elements,s=r[0],o=r[1],a=r[2],c=r[3],l=r[4],u=r[5],h=r[6],d=r[7],m=r[8],g=r[9],v=r[10],p=r[11],f=r[12],A=r[13],T=r[14],S=r[15];if(n[0].setComponents(c-s,d-l,p-m,S-f).normalize(),n[1].setComponents(c+s,d+l,p+m,S+f).normalize(),n[2].setComponents(c+o,d+u,p+g,S+A).normalize(),n[3].setComponents(c-o,d-u,p-g,S-A).normalize(),n[4].setComponents(c-a,d-h,p-v,S-T).normalize(),e===vn)n[5].setComponents(c+a,d+h,p+v,S+T).normalize();else if(e===Kr)n[5].setComponents(a,h,v,T).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),kn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),kn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(kn)}intersectsSprite(t){return kn.center.set(0,0,0),kn.radius=.7071067811865476,kn.applyMatrix4(t.matrixWorld),this.intersectsSphere(kn)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Ur.x=r.normal.x>0?t.max.x:t.min.x,Ur.y=r.normal.y>0?t.max.y:t.min.y,Ur.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Ur)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ci extends De{constructor(t,e,n,r,s,o,a,c,l){super(t,e,n,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ml extends De{constructor(t,e,n,r,s,o,a,c,l,u=wi){if(u!==wi&&u!==Ii)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===wi&&(n=Qn),n===void 0&&u===Ii&&(n=Ui),super(null,r,s,o,a,c,u,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:en,this.minFilter=c!==void 0?c:en,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ko(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ln{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let r=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=n[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===o)return r/(s-1);const u=n[r],d=n[r+1]-u,m=(o-u)/d;return(r+m)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),c=e||(o.isVector2?new ot:new P);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new P,r=[],s=[],o=[],a=new P,c=new oe;for(let m=0;m<=t;m++){const g=m/t;r[m]=this.getTangentAt(g,new P)}s[0]=new P,o[0]=new P;let l=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=l&&(l=u,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let m=1;m<=t;m++){if(s[m]=s[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(r[m-1],r[m]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Yt(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(c.makeRotationAxis(a,g))}o[m].crossVectors(r[m],s[m])}if(e===!0){let m=Math.acos(Yt(s[0].dot(s[t]),-1,1));m/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(m=-m);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],m*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ea extends ln{constructor(t=0,e=0,n=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new ot){const n=e,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,m=l-this.aY;c=d*u-m*h+this.aX,l=d*h+m*u+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class ph extends ea{constructor(t,e,n,r,s,o){super(t,e,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function na(){let i=0,t=0,e=0,n=0;function r(s,o,a,c){i=s,t=a,e=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,u,h){let d=(o-s)/l-(a-s)/(l+u)+(a-o)/u,m=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,m*=u,r(o,a,d,m)},calc:function(s){const o=s*s,a=o*s;return i+t*s+e*o+n*a}}}const Ir=new P,Fs=new na,Os=new na,Bs=new na;class mh extends ln{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new P){const n=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,u;this.closed||a>0?l=r[(a-1)%s]:(Ir.subVectors(r[0],r[1]).add(r[0]),l=Ir);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(Ir.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Ir),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),m),v=Math.pow(h.distanceToSquared(d),m),p=Math.pow(d.distanceToSquared(u),m);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),Fs.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,g,v,p),Os.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,g,v,p),Bs.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,g,v,p)}else this.curveType==="catmullrom"&&(Fs.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),Os.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),Bs.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return n.set(Fs.calc(c),Os.calc(c),Bs.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new P().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Za(i,t,e,n,r){const s=(n-t)*.5,o=(r-e)*.5,a=i*i,c=i*a;return(2*e-2*n+s+o)*c+(-3*e+3*n-2*s-o)*a+s*i+e}function gh(i,t){const e=1-i;return e*e*t}function _h(i,t){return 2*(1-i)*i*t}function vh(i,t){return i*i*t}function er(i,t,e,n){return gh(i,t)+_h(i,e)+vh(i,n)}function xh(i,t){const e=1-i;return e*e*e*t}function Mh(i,t){const e=1-i;return 3*e*e*i*t}function Sh(i,t){return 3*(1-i)*i*i*t}function yh(i,t){return i*i*i*t}function nr(i,t,e,n,r){return xh(i,t)+Mh(i,e)+Sh(i,n)+yh(i,r)}class Sl extends ln{constructor(t=new ot,e=new ot,n=new ot,r=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new ot){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(nr(t,r.x,s.x,o.x,a.x),nr(t,r.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Eh extends ln{constructor(t=new P,e=new P,n=new P,r=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new P){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(nr(t,r.x,s.x,o.x,a.x),nr(t,r.y,s.y,o.y,a.y),nr(t,r.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yl extends ln{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Th extends ln{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class El extends ln{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(er(t,r.x,s.x,o.x),er(t,r.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class bh extends ln{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(er(t,r.x,s.x,o.x),er(t,r.y,s.y,o.y),er(t,r.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tl extends ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){const n=e,r=this.points,s=(r.length-1)*t,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return n.set(Za(a,c.x,l.x,u.x,h.x),Za(a,c.y,l.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new ot().fromArray(r))}return this}}var Bo=Object.freeze({__proto__:null,ArcCurve:ph,CatmullRomCurve3:mh,CubicBezierCurve:Sl,CubicBezierCurve3:Eh,EllipseCurve:ea,LineCurve:yl,LineCurve3:Th,QuadraticBezierCurve:El,QuadraticBezierCurve3:bh,SplineCurve:Tl});class Ah extends ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const o=r[s]-n,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const u=c[l];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new Bo[r.type]().fromJSON(r))}return this}}class $a extends Ah{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new yl(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new El(this.currentPoint.clone(),new ot(t,e),new ot(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,o){const a=new Sl(this.currentPoint.clone(),new ot(t,e),new ot(n,r),new ot(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Tl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,r,s,o),this}absarc(t,e,n,r,s,o){return this.absellipse(t,e,n,n,r,s,o),this}ellipse(t,e,n,r,s,o,a,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+l,e+u,n,r,s,o,a,c),this}absellipse(t,e,n,r,s,o,a,c){const l=new ea(t,e,n,r,s,o,a,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ir extends Ie{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],o=[],a=[],c=[],l=new P,u=new ot;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const m=n+h/e*r;l.x=t*Math.cos(m),l.y=t*Math.sin(m),o.push(l.x,l.y,l.z),a.push(0,0,1),u.x=(o[d]/t+1)/2,u.y=(o[d+1]/t+1)/2,c.push(u.x,u.y)}for(let h=1;h<=e;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new ce(o,3)),this.setAttribute("normal",new ce(a,3)),this.setAttribute("uv",new ce(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ir(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ce extends Ie{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],m=[];let g=0;const v=[],p=n/2;let f=0;A(),o===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(u),this.setAttribute("position",new ce(h,3)),this.setAttribute("normal",new ce(d,3)),this.setAttribute("uv",new ce(m,2));function A(){const S=new P,L=new P;let R=0;const w=(e-t)/n;for(let D=0;D<=s;D++){const y=[],x=D/s,C=x*(e-t)+t;for(let z=0;z<=r;z++){const O=z/r,W=O*c+a,$=Math.sin(W),H=Math.cos(W);L.x=C*$,L.y=-x*n+p,L.z=C*H,h.push(L.x,L.y,L.z),S.set($,w,H).normalize(),d.push(S.x,S.y,S.z),m.push(O,1-x),y.push(g++)}v.push(y)}for(let D=0;D<r;D++)for(let y=0;y<s;y++){const x=v[y][D],C=v[y+1][D],z=v[y+1][D+1],O=v[y][D+1];(t>0||y!==0)&&(u.push(x,C,O),R+=3),(e>0||y!==s-1)&&(u.push(C,z,O),R+=3)}l.addGroup(f,R,0),f+=R}function T(S){const L=g,R=new ot,w=new P;let D=0;const y=S===!0?t:e,x=S===!0?1:-1;for(let z=1;z<=r;z++)h.push(0,p*x,0),d.push(0,x,0),m.push(.5,.5),g++;const C=g;for(let z=0;z<=r;z++){const W=z/r*c+a,$=Math.cos(W),H=Math.sin(W);w.x=y*H,w.y=p*x,w.z=y*$,h.push(w.x,w.y,w.z),d.push(0,x,0),R.x=$*.5+.5,R.y=H*.5*x+.5,m.push(R.x,R.y),g++}for(let z=0;z<r;z++){const O=L+z,W=C+z;S===!0?u.push(W,W+1,O):u.push(W+1,W,O),D+=3}l.addGroup(f,D,S===!0?1:2),f+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ts extends $a{constructor(t){super(t),this.uuid=xn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new $a().fromJSON(r))}return this}}class wh{static triangulate(t,e,n=2){const r=e&&e.length,s=r?e[0]*n:t.length;let o=bl(t,0,s,n,!0);const a=[];if(!o||o.next===o.prev)return a;let c,l,u,h,d,m,g;if(r&&(o=Dh(t,e,o,n)),t.length>80*n){c=u=t[0],l=h=t[1];for(let v=n;v<s;v+=n)d=t[v],m=t[v+1],d<c&&(c=d),m<l&&(l=m),d>u&&(u=d),m>h&&(h=m);g=Math.max(u-c,h-l),g=g!==0?32767/g:0}return sr(o,a,n,c,l,g,0),a}}function bl(i,t,e,n,r){let s,o;if(r===Hh(i,t,e,n)>0)for(s=t;s<e;s+=n)o=Ja(s,i[s],i[s+1],o);else for(s=e-n;s>=t;s-=n)o=Ja(s,i[s],i[s+1],o);return o&&rs(o,o.next)&&(ar(o),o=o.next),o}function ei(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(rs(e,e.next)||le(e.prev,e,e.next)===0)){if(ar(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function sr(i,t,e,n,r,s,o){if(!i)return;!o&&s&&Oh(i,n,r,s);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,s?Ch(i,n,r,s):Rh(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),ar(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Ph(ei(i),t,e),sr(i,t,e,n,r,s,2)):o===2&&Lh(i,t,e,n,r,s):sr(ei(i),t,e,n,r,s,1);break}}}function Rh(i){const t=i.prev,e=i,n=i.next;if(le(t,e,n)>=0)return!1;const r=t.x,s=e.x,o=n.x,a=t.y,c=e.y,l=n.y,u=r<s?r<o?r:o:s<o?s:o,h=a<c?a<l?a:l:c<l?c:l,d=r>s?r>o?r:o:s>o?s:o,m=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=m&&Ti(r,a,s,c,o,l,g.x,g.y)&&le(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Ch(i,t,e,n){const r=i.prev,s=i,o=i.next;if(le(r,s,o)>=0)return!1;const a=r.x,c=s.x,l=o.x,u=r.y,h=s.y,d=o.y,m=a<c?a<l?a:l:c<l?c:l,g=u<h?u<d?u:d:h<d?h:d,v=a>c?a>l?a:l:c>l?c:l,p=u>h?u>d?u:d:h>d?h:d,f=zo(m,g,t,e,n),A=zo(v,p,t,e,n);let T=i.prevZ,S=i.nextZ;for(;T&&T.z>=f&&S&&S.z<=A;){if(T.x>=m&&T.x<=v&&T.y>=g&&T.y<=p&&T!==r&&T!==o&&Ti(a,u,c,h,l,d,T.x,T.y)&&le(T.prev,T,T.next)>=0||(T=T.prevZ,S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==r&&S!==o&&Ti(a,u,c,h,l,d,S.x,S.y)&&le(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;T&&T.z>=f;){if(T.x>=m&&T.x<=v&&T.y>=g&&T.y<=p&&T!==r&&T!==o&&Ti(a,u,c,h,l,d,T.x,T.y)&&le(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;S&&S.z<=A;){if(S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==r&&S!==o&&Ti(a,u,c,h,l,d,S.x,S.y)&&le(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function Ph(i,t,e){let n=i;do{const r=n.prev,s=n.next.next;!rs(r,s)&&Al(r,n,n.next,s)&&or(r,s)&&or(s,r)&&(t.push(r.i/e|0),t.push(n.i/e|0),t.push(s.i/e|0),ar(n),ar(n.next),n=i=s),n=n.next}while(n!==i);return ei(n)}function Lh(i,t,e,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Gh(o,a)){let c=wl(o,a);o=ei(o,o.next),c=ei(c,c.next),sr(o,t,e,n,r,s,0),sr(c,t,e,n,r,s,0);return}a=a.next}o=o.next}while(o!==i)}function Dh(i,t,e,n){const r=[];let s,o,a,c,l;for(s=0,o=t.length;s<o;s++)a=t[s]*n,c=s<o-1?t[s+1]*n:i.length,l=bl(i,a,c,n,!1),l===l.next&&(l.steiner=!0),r.push(zh(l));for(r.sort(Uh),s=0;s<r.length;s++)e=Ih(r[s],e);return e}function Uh(i,t){return i.x-t.x}function Ih(i,t){const e=Nh(i,t);if(!e)return t;const n=wl(e,i);return ei(n,n.next),ei(e,e.next)}function Nh(i,t){let e=t,n=-1/0,r;const s=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>n&&(n=d,r=e.x<e.next.x?e:e.next,d===s))return r}e=e.next}while(e!==t);if(!r)return null;const a=r,c=r.x,l=r.y;let u=1/0,h;e=r;do s>=e.x&&e.x>=c&&s!==e.x&&Ti(o<l?s:n,o,c,l,o<l?n:s,o,e.x,e.y)&&(h=Math.abs(o-e.y)/(s-e.x),or(e,i)&&(h<u||h===u&&(e.x>r.x||e.x===r.x&&Fh(r,e)))&&(r=e,u=h)),e=e.next;while(e!==a);return r}function Fh(i,t){return le(i.prev,i,t.prev)<0&&le(t.next,i,i.next)<0}function Oh(i,t,e,n){let r=i;do r.z===0&&(r.z=zo(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,Bh(r)}function Bh(i){let t,e,n,r,s,o,a,c,l=1;do{for(e=i,i=null,s=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(r=e,e=e.nextZ,a--):(r=n,n=n.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;e=n}s.nextZ=null,l*=2}while(o>1);return i}function zo(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function zh(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ti(i,t,e,n,r,s,o,a){return(r-o)*(t-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(n-a)}function Gh(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Vh(i,t)&&(or(i,t)&&or(t,i)&&kh(i,t)&&(le(i.prev,i,t.prev)||le(i,t.prev,t))||rs(i,t)&&le(i.prev,i,i.next)>0&&le(t.prev,t,t.next)>0)}function le(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function rs(i,t){return i.x===t.x&&i.y===t.y}function Al(i,t,e,n){const r=Fr(le(i,t,e)),s=Fr(le(i,t,n)),o=Fr(le(e,n,i)),a=Fr(le(e,n,t));return!!(r!==s&&o!==a||r===0&&Nr(i,e,t)||s===0&&Nr(i,n,t)||o===0&&Nr(e,i,n)||a===0&&Nr(e,t,n))}function Nr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Fr(i){return i>0?1:i<0?-1:0}function Vh(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Al(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function or(i,t){return le(i.prev,i,i.next)<0?le(i,t,i.next)>=0&&le(i,i.prev,t)>=0:le(i,t,i.prev)<0||le(i,i.next,t)<0}function kh(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function wl(i,t){const e=new Go(i.i,i.x,i.y),n=new Go(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Ja(i,t,e,n){const r=new Go(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function ar(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Go(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Hh(i,t,e,n){let r=0;for(let s=t,o=e-n;s<e;s+=n)r+=(i[o]-i[s])*(i[s+1]+i[o+1]),o=s;return r}class Dn{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return Dn.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];Ka(t),ja(n,t);let o=t.length;e.forEach(Ka);for(let c=0;c<e.length;c++)r.push(o),o+=e[c].length,ja(n,e[c]);const a=wh.triangulate(n,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}}function Ka(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function ja(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class ia extends Ie{constructor(t=new ts([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new ce(r,3)),this.setAttribute("uv",new ce(s,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,h=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,m=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:m-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,A=e.UVGenerator!==void 0?e.UVGenerator:Wh;let T,S=!1,L,R,w,D;f&&(T=f.getSpacedPoints(u),S=!0,d=!1,L=f.computeFrenetFrames(u,!1),R=new P,w=new P,D=new P),d||(p=0,m=0,g=0,v=0);const y=a.extractPoints(l);let x=y.shape;const C=y.holes;if(!Dn.isClockWise(x)){x=x.reverse();for(let nt=0,tt=C.length;nt<tt;nt++){const b=C[nt];Dn.isClockWise(b)&&(C[nt]=b.reverse())}}const O=Dn.triangulateShape(x,C),W=x;for(let nt=0,tt=C.length;nt<tt;nt++){const b=C[nt];x=x.concat(b)}function $(nt,tt,b){return tt||console.error("THREE.ExtrudeGeometry: vec does not exist"),nt.clone().addScaledVector(tt,b)}const H=x.length,Q=O.length;function V(nt,tt,b){let wt,it,gt;const at=nt.x-tt.x,It=nt.y-tt.y,ht=b.x-nt.x,E=b.y-nt.y,_=at*at+It*It,F=at*E-It*ht;if(Math.abs(F)>Number.EPSILON){const q=Math.sqrt(_),et=Math.sqrt(ht*ht+E*E),Z=tt.x-It/q,At=tt.y+at/q,X=b.x-E/et,K=b.y+ht/et,Ct=((X-Z)*E-(K-At)*ht)/(at*E-It*ht);wt=Z+at*Ct-nt.x,it=At+It*Ct-nt.y;const J=wt*wt+it*it;if(J<=2)return new ot(wt,it);gt=Math.sqrt(J/2)}else{let q=!1;at>Number.EPSILON?ht>Number.EPSILON&&(q=!0):at<-Number.EPSILON?ht<-Number.EPSILON&&(q=!0):Math.sign(It)===Math.sign(E)&&(q=!0),q?(wt=-It,it=at,gt=Math.sqrt(_)):(wt=at,it=It,gt=Math.sqrt(_/2))}return new ot(wt/gt,it/gt)}const ut=[];for(let nt=0,tt=W.length,b=tt-1,wt=nt+1;nt<tt;nt++,b++,wt++)b===tt&&(b=0),wt===tt&&(wt=0),ut[nt]=V(W[nt],W[b],W[wt]);const _t=[];let St,Nt=ut.concat();for(let nt=0,tt=C.length;nt<tt;nt++){const b=C[nt];St=[];for(let wt=0,it=b.length,gt=it-1,at=wt+1;wt<it;wt++,gt++,at++)gt===it&&(gt=0),at===it&&(at=0),St[wt]=V(b[wt],b[gt],b[at]);_t.push(St),Nt=Nt.concat(St)}for(let nt=0;nt<p;nt++){const tt=nt/p,b=m*Math.cos(tt*Math.PI/2),wt=g*Math.sin(tt*Math.PI/2)+v;for(let it=0,gt=W.length;it<gt;it++){const at=$(W[it],ut[it],wt);ct(at.x,at.y,-b)}for(let it=0,gt=C.length;it<gt;it++){const at=C[it];St=_t[it];for(let It=0,ht=at.length;It<ht;It++){const E=$(at[It],St[It],wt);ct(E.x,E.y,-b)}}}const Kt=g+v;for(let nt=0;nt<H;nt++){const tt=d?$(x[nt],Nt[nt],Kt):x[nt];S?(w.copy(L.normals[0]).multiplyScalar(tt.x),R.copy(L.binormals[0]).multiplyScalar(tt.y),D.copy(T[0]).add(w).add(R),ct(D.x,D.y,D.z)):ct(tt.x,tt.y,0)}for(let nt=1;nt<=u;nt++)for(let tt=0;tt<H;tt++){const b=d?$(x[tt],Nt[tt],Kt):x[tt];S?(w.copy(L.normals[nt]).multiplyScalar(b.x),R.copy(L.binormals[nt]).multiplyScalar(b.y),D.copy(T[nt]).add(w).add(R),ct(D.x,D.y,D.z)):ct(b.x,b.y,h/u*nt)}for(let nt=p-1;nt>=0;nt--){const tt=nt/p,b=m*Math.cos(tt*Math.PI/2),wt=g*Math.sin(tt*Math.PI/2)+v;for(let it=0,gt=W.length;it<gt;it++){const at=$(W[it],ut[it],wt);ct(at.x,at.y,h+b)}for(let it=0,gt=C.length;it<gt;it++){const at=C[it];St=_t[it];for(let It=0,ht=at.length;It<ht;It++){const E=$(at[It],St[It],wt);S?ct(E.x,E.y+T[u-1].y,T[u-1].x+b):ct(E.x,E.y,h+b)}}}Y(),st();function Y(){const nt=r.length/3;if(d){let tt=0,b=H*tt;for(let wt=0;wt<Q;wt++){const it=O[wt];Pt(it[2]+b,it[1]+b,it[0]+b)}tt=u+p*2,b=H*tt;for(let wt=0;wt<Q;wt++){const it=O[wt];Pt(it[0]+b,it[1]+b,it[2]+b)}}else{for(let tt=0;tt<Q;tt++){const b=O[tt];Pt(b[2],b[1],b[0])}for(let tt=0;tt<Q;tt++){const b=O[tt];Pt(b[0]+H*u,b[1]+H*u,b[2]+H*u)}}n.addGroup(nt,r.length/3-nt,0)}function st(){const nt=r.length/3;let tt=0;Et(W,tt),tt+=W.length;for(let b=0,wt=C.length;b<wt;b++){const it=C[b];Et(it,tt),tt+=it.length}n.addGroup(nt,r.length/3-nt,1)}function Et(nt,tt){let b=nt.length;for(;--b>=0;){const wt=b;let it=b-1;it<0&&(it=nt.length-1);for(let gt=0,at=u+p*2;gt<at;gt++){const It=H*gt,ht=H*(gt+1),E=tt+wt+It,_=tt+it+It,F=tt+it+ht,q=tt+wt+ht;Zt(E,_,F,q)}}}function ct(nt,tt,b){c.push(nt),c.push(tt),c.push(b)}function Pt(nt,tt,b){bt(nt),bt(tt),bt(b);const wt=r.length/3,it=A.generateTopUV(n,r,wt-3,wt-2,wt-1);$t(it[0]),$t(it[1]),$t(it[2])}function Zt(nt,tt,b,wt){bt(nt),bt(tt),bt(wt),bt(tt),bt(b),bt(wt);const it=r.length/3,gt=A.generateSideWallUV(n,r,it-6,it-3,it-2,it-1);$t(gt[0]),$t(gt[1]),$t(gt[3]),$t(gt[1]),$t(gt[2]),$t(gt[3])}function bt(nt){r.push(c[nt*3+0]),r.push(c[nt*3+1]),r.push(c[nt*3+2])}function $t(nt){s.push(nt.x),s.push(nt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Xh(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];n.push(a)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new Bo[r.type]().fromJSON(r)),new ia(n,t.options)}}const Wh={generateTopUV:function(i,t,e,n,r){const s=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[r*3],u=t[r*3+1];return[new ot(s,o),new ot(a,c),new ot(l,u)]},generateSideWallUV:function(i,t,e,n,r,s){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],u=t[n*3+1],h=t[n*3+2],d=t[r*3],m=t[r*3+1],g=t[r*3+2],v=t[s*3],p=t[s*3+1],f=t[s*3+2];return Math.abs(a-u)<Math.abs(o-l)?[new ot(o,1-c),new ot(l,1-h),new ot(d,1-g),new ot(v,1-f)]:[new ot(a,1-c),new ot(u,1-h),new ot(m,1-g),new ot(p,1-f)]}};function Xh(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Fn extends Ie{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(n),c=Math.floor(r),l=a+1,u=c+1,h=t/a,d=e/c,m=[],g=[],v=[],p=[];for(let f=0;f<u;f++){const A=f*d-o;for(let T=0;T<l;T++){const S=T*h-s;g.push(S,-A,0),v.push(0,0,1),p.push(T/a),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let A=0;A<a;A++){const T=A+l*f,S=A+l*(f+1),L=A+1+l*(f+1),R=A+1+l*f;m.push(T,S,R),m.push(S,L,R)}this.setIndex(m),this.setAttribute("position",new ce(g,3)),this.setAttribute("normal",new ce(v,3)),this.setAttribute("uv",new ce(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.width,t.height,t.widthSegments,t.heightSegments)}}class es extends Ie{constructor(t=.5,e=1,n=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:o},n=Math.max(3,n),r=Math.max(1,r);const a=[],c=[],l=[],u=[];let h=t;const d=(e-t)/r,m=new P,g=new ot;for(let v=0;v<=r;v++){for(let p=0;p<=n;p++){const f=s+p/n*o;m.x=h*Math.cos(f),m.y=h*Math.sin(f),c.push(m.x,m.y,m.z),l.push(0,0,1),g.x=(m.x/e+1)/2,g.y=(m.y/e+1)/2,u.push(g.x,g.y)}h+=d}for(let v=0;v<r;v++){const p=v*(n+1);for(let f=0;f<n;f++){const A=f+p,T=A,S=A+n+1,L=A+n+2,R=A+1;a.push(T,S,R),a.push(S,L,R)}}this.setIndex(a),this.setAttribute("position",new ce(c,3)),this.setAttribute("normal",new ce(l,3)),this.setAttribute("uv",new ce(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new es(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ra extends Ie{constructor(t=new ts([new ot(0,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],r=[],s=[],o=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let u=0;u<t.length;u++)l(t[u]),this.addGroup(a,c,u),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new ce(r,3)),this.setAttribute("normal",new ce(s,3)),this.setAttribute("uv",new ce(o,2));function l(u){const h=r.length/3,d=u.extractPoints(e);let m=d.shape;const g=d.holes;Dn.isClockWise(m)===!1&&(m=m.reverse());for(let p=0,f=g.length;p<f;p++){const A=g[p];Dn.isClockWise(A)===!0&&(g[p]=A.reverse())}const v=Dn.triangulateShape(m,g);for(let p=0,f=g.length;p<f;p++){const A=g[p];m=m.concat(A)}for(let p=0,f=m.length;p<f;p++){const A=m[p];r.push(A.x,A.y,0),s.push(0,0,1),o.push(A.x,A.y)}for(let p=0,f=v.length;p<f;p++){const A=v[p],T=A[0]+h,S=A[1]+h,L=A[2]+h;n.push(T,S,L),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return qh(e,t)}static fromJSON(t,e){const n=[];for(let r=0,s=t.shapes.length;r<s;r++){const o=e[t.shapes[r]];n.push(o)}return new ra(n,t.curveSegments)}}function qh(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const r=i[e];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t}class ni extends Ie{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new P,d=new P,m=[],g=[],v=[],p=[];for(let f=0;f<=n;f++){const A=[],T=f/n;let S=0;f===0&&o===0?S=.5/e:f===n&&c===Math.PI&&(S=-.5/e);for(let L=0;L<=e;L++){const R=L/e;h.x=-t*Math.cos(r+R*s)*Math.sin(o+T*a),h.y=t*Math.cos(o+T*a),h.z=t*Math.sin(r+R*s)*Math.sin(o+T*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),v.push(d.x,d.y,d.z),p.push(R+S,1-T),A.push(l++)}u.push(A)}for(let f=0;f<n;f++)for(let A=0;A<e;A++){const T=u[f][A+1],S=u[f][A],L=u[f+1][A],R=u[f+1][A+1];(f!==0||o>0)&&m.push(T,S,R),(f!==n-1||c<Math.PI)&&m.push(S,L,R)}this.setIndex(m),this.setAttribute("position",new ce(g,3)),this.setAttribute("normal",new ce(v,3)),this.setAttribute("uv",new ce(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ni(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class fe extends Vi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xe,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Yh extends Vi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Tu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Zh extends Vi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class sa extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}const zs=new oe,Qa=new P,tc=new P;class Rl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ta,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Qa.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qa),tc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tc),e.updateMatrixWorld(),zs.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zs),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(zs)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const ec=new oe,Ki=new P,Gs=new P;class $h extends Rl{constructor(){super(new ze(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ot(4,2),this._viewportCount=6,this._viewports=[new se(2,1,1,1),new se(0,1,1,1),new se(3,1,1,1),new se(1,1,1,1),new se(3,0,1,1),new se(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,r=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Ki.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ki),Gs.copy(n.position),Gs.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Gs),n.updateMatrixWorld(),r.makeTranslation(-Ki.x,-Ki.y,-Ki.z),ec.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ec)}}class Jh extends sa{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new $h}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Cl extends gl{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Kh extends Rl{constructor(){super(new Cl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class jh extends sa{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new Kh}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Qh extends sa{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class tf extends ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t,this.index=0}}class ef{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=nc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=nc();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function nc(){return performance.now()}const ic=new oe;class nf{constructor(t,e,n=0,r=1/0){this.ray=new hl(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new Qo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return ic.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ic),this}intersectObject(t,e=!0,n=[]){return Vo(t,this,n,e),n.sort(rc),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)Vo(t[r],this,n,e);return n.sort(rc),n}}function rc(i,t){return i.distance-t.distance}function Vo(i,t,e,n){let r=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)Vo(s[o],t,e,!0)}}function sc(i,t,e,n){const r=rf(n);switch(e){case tl:return i*t;case nl:return i*t;case il:return i*t*2;case rl:return i*t/r.components*r.byteLength;case Zo:return i*t/r.components*r.byteLength;case sl:return i*t*2/r.components*r.byteLength;case $o:return i*t*2/r.components*r.byteLength;case el:return i*t*3/r.components*r.byteLength;case tn:return i*t*4/r.components*r.byteLength;case Jo:return i*t*4/r.components*r.byteLength;case Wr:case Xr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case qr:case Yr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case uo:case fo:return Math.max(i,16)*Math.max(t,8)/4;case lo:case ho:return Math.max(i,8)*Math.max(t,8)/2;case po:case mo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case go:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _o:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case vo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case xo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Mo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case So:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case yo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case To:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ao:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case wo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ro:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Co:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Po:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Zr:case Lo:case Do:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ol:case Uo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Io:case No:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function rf(i){switch(i){case Sn:case Kc:return{byteLength:1,components:1};case rr:case jc:case lr:return{byteLength:2,components:1};case qo:case Yo:return{byteLength:2,components:4};case Qn:case Xo:case _n:return{byteLength:4,components:1};case Qc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Wo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Wo);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Pl(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function sf(i){const t=new WeakMap;function e(a,c){const l=a.array,u=a.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),a.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){const u=c.array,h=c.updateRanges;if(i.bindBuffer(l,a),h.length===0)i.bufferSubData(l,0,u);else{h.sort((m,g)=>m.start-g.start);let d=0;for(let m=1;m<h.length;m++){const g=h[d],v=h[m];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,h[d]=v)}h.length=d+1;for(let m=0,g=h.length;m<g;m++){const v=h[m];i.bufferSubData(l,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}var of=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,af=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,cf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,lf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ff=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,df=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,mf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_f=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,xf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Mf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Sf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,yf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,wf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Rf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Cf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Pf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Lf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Df=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Uf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,If=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ff="gl_FragColor = linearToOutputTexel( gl_FragColor );",Of=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,zf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Gf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,kf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Hf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Zf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$f=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Jf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,jf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Qf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,td=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ed=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,id=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,od=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ad=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cd=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ld=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ud=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,pd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,md=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_d=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Md=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,yd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ed=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Td=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,bd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ad=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Cd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ld=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ud=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Id=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Nd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Od=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,kd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Hd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Wd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Xd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qd=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Yd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$d=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Kd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,np=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,rp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,op=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ap=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,up=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,fp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,dp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,pp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_p=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Mp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ep=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Tp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ap=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,wp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Pp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ip=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Np=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Op=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Bp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Wt={alphahash_fragment:of,alphahash_pars_fragment:af,alphamap_fragment:cf,alphamap_pars_fragment:lf,alphatest_fragment:uf,alphatest_pars_fragment:hf,aomap_fragment:ff,aomap_pars_fragment:df,batching_pars_vertex:pf,batching_vertex:mf,begin_vertex:gf,beginnormal_vertex:_f,bsdfs:vf,iridescence_fragment:xf,bumpmap_pars_fragment:Mf,clipping_planes_fragment:Sf,clipping_planes_pars_fragment:yf,clipping_planes_pars_vertex:Ef,clipping_planes_vertex:Tf,color_fragment:bf,color_pars_fragment:Af,color_pars_vertex:wf,color_vertex:Rf,common:Cf,cube_uv_reflection_fragment:Pf,defaultnormal_vertex:Lf,displacementmap_pars_vertex:Df,displacementmap_vertex:Uf,emissivemap_fragment:If,emissivemap_pars_fragment:Nf,colorspace_fragment:Ff,colorspace_pars_fragment:Of,envmap_fragment:Bf,envmap_common_pars_fragment:zf,envmap_pars_fragment:Gf,envmap_pars_vertex:Vf,envmap_physical_pars_fragment:jf,envmap_vertex:kf,fog_vertex:Hf,fog_pars_vertex:Wf,fog_fragment:Xf,fog_pars_fragment:qf,gradientmap_pars_fragment:Yf,lightmap_pars_fragment:Zf,lights_lambert_fragment:$f,lights_lambert_pars_fragment:Jf,lights_pars_begin:Kf,lights_toon_fragment:Qf,lights_toon_pars_fragment:td,lights_phong_fragment:ed,lights_phong_pars_fragment:nd,lights_physical_fragment:id,lights_physical_pars_fragment:rd,lights_fragment_begin:sd,lights_fragment_maps:od,lights_fragment_end:ad,logdepthbuf_fragment:cd,logdepthbuf_pars_fragment:ld,logdepthbuf_pars_vertex:ud,logdepthbuf_vertex:hd,map_fragment:fd,map_pars_fragment:dd,map_particle_fragment:pd,map_particle_pars_fragment:md,metalnessmap_fragment:gd,metalnessmap_pars_fragment:_d,morphinstance_vertex:vd,morphcolor_vertex:xd,morphnormal_vertex:Md,morphtarget_pars_vertex:Sd,morphtarget_vertex:yd,normal_fragment_begin:Ed,normal_fragment_maps:Td,normal_pars_fragment:bd,normal_pars_vertex:Ad,normal_vertex:wd,normalmap_pars_fragment:Rd,clearcoat_normal_fragment_begin:Cd,clearcoat_normal_fragment_maps:Pd,clearcoat_pars_fragment:Ld,iridescence_pars_fragment:Dd,opaque_fragment:Ud,packing:Id,premultiplied_alpha_fragment:Nd,project_vertex:Fd,dithering_fragment:Od,dithering_pars_fragment:Bd,roughnessmap_fragment:zd,roughnessmap_pars_fragment:Gd,shadowmap_pars_fragment:Vd,shadowmap_pars_vertex:kd,shadowmap_vertex:Hd,shadowmask_pars_fragment:Wd,skinbase_vertex:Xd,skinning_pars_vertex:qd,skinning_vertex:Yd,skinnormal_vertex:Zd,specularmap_fragment:$d,specularmap_pars_fragment:Jd,tonemapping_fragment:Kd,tonemapping_pars_fragment:jd,transmission_fragment:Qd,transmission_pars_fragment:tp,uv_pars_fragment:ep,uv_pars_vertex:np,uv_vertex:ip,worldpos_vertex:rp,background_vert:sp,background_frag:op,backgroundCube_vert:ap,backgroundCube_frag:cp,cube_vert:lp,cube_frag:up,depth_vert:hp,depth_frag:fp,distanceRGBA_vert:dp,distanceRGBA_frag:pp,equirect_vert:mp,equirect_frag:gp,linedashed_vert:_p,linedashed_frag:vp,meshbasic_vert:xp,meshbasic_frag:Mp,meshlambert_vert:Sp,meshlambert_frag:yp,meshmatcap_vert:Ep,meshmatcap_frag:Tp,meshnormal_vert:bp,meshnormal_frag:Ap,meshphong_vert:wp,meshphong_frag:Rp,meshphysical_vert:Cp,meshphysical_frag:Pp,meshtoon_vert:Lp,meshtoon_frag:Dp,points_vert:Up,points_frag:Ip,shadow_vert:Np,shadow_frag:Fp,sprite_vert:Op,sprite_frag:Bp},dt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},rn={basic:{uniforms:Re([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Re([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Re([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Re([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Re([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Re([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Re([dt.points,dt.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Re([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Re([dt.common,dt.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Re([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Re([dt.sprite,dt.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distanceRGBA:{uniforms:Re([dt.common,dt.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distanceRGBA_vert,fragmentShader:Wt.distanceRGBA_frag},shadow:{uniforms:Re([dt.lights,dt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};rn.physical={uniforms:Re([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};const Or={r:0,b:0,g:0},Hn=new Xe,zp=new oe;function Gp(i,t,e,n,r,s,o){const a=new qt(0);let c=s===!0?0:1,l,u,h=null,d=0,m=null;function g(T){let S=T.isScene===!0?T.background:null;return S&&S.isTexture&&(S=(T.backgroundBlurriness>0?e:t).get(S)),S}function v(T){let S=!1;const L=g(T);L===null?f(a,c):L&&L.isColor&&(f(L,1),S=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(T,S){const L=g(S);L&&(L.isCubeTexture||L.mapping===is)?(u===void 0&&(u=new Ot(new Be(1,1,1),new Nn({name:"BackgroundCubeMaterial",uniforms:Fi(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Le,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,w,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Hn.copy(S.backgroundRotation),Hn.x*=-1,Hn.y*=-1,Hn.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(Hn.y*=-1,Hn.z*=-1),u.material.uniforms.envMap.value=L,u.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(zp.makeRotationFromEuler(Hn)),u.material.toneMapped=Qt.getTransfer(L.colorSpace)!==ie,(h!==L||d!==L.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=L,d=L.version,m=i.toneMapping),u.layers.enableAll(),T.unshift(u,u.geometry,u.material,0,0,null)):L&&L.isTexture&&(l===void 0&&(l=new Ot(new Fn(2,2),new Nn({name:"BackgroundMaterial",uniforms:Fi(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:In,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=L,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Qt.getTransfer(L.colorSpace)!==ie,L.matrixAutoUpdate===!0&&L.updateMatrix(),l.material.uniforms.uvTransform.value.copy(L.matrix),(h!==L||d!==L.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,h=L,d=L.version,m=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function f(T,S){T.getRGB(Or,ml(i)),n.buffers.color.setClear(Or.r,Or.g,Or.b,S,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(T,S=1){a.set(T),c=S,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(T){c=T,f(a,c)},render:v,addToRenderList:p,dispose:A}}function Vp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,o=!1;function a(x,C,z,O,W){let $=!1;const H=h(O,z,C);s!==H&&(s=H,l(s.object)),$=m(x,O,z,W),$&&g(x,O,z,W),W!==null&&t.update(W,i.ELEMENT_ARRAY_BUFFER),($||o)&&(o=!1,S(x,C,z,O),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(W).buffer))}function c(){return i.createVertexArray()}function l(x){return i.bindVertexArray(x)}function u(x){return i.deleteVertexArray(x)}function h(x,C,z){const O=z.wireframe===!0;let W=n[x.id];W===void 0&&(W={},n[x.id]=W);let $=W[C.id];$===void 0&&($={},W[C.id]=$);let H=$[O];return H===void 0&&(H=d(c()),$[O]=H),H}function d(x){const C=[],z=[],O=[];for(let W=0;W<e;W++)C[W]=0,z[W]=0,O[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:z,attributeDivisors:O,object:x,attributes:{},index:null}}function m(x,C,z,O){const W=s.attributes,$=C.attributes;let H=0;const Q=z.getAttributes();for(const V in Q)if(Q[V].location>=0){const _t=W[V];let St=$[V];if(St===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(St=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(St=x.instanceColor)),_t===void 0||_t.attribute!==St||St&&_t.data!==St.data)return!0;H++}return s.attributesNum!==H||s.index!==O}function g(x,C,z,O){const W={},$=C.attributes;let H=0;const Q=z.getAttributes();for(const V in Q)if(Q[V].location>=0){let _t=$[V];_t===void 0&&(V==="instanceMatrix"&&x.instanceMatrix&&(_t=x.instanceMatrix),V==="instanceColor"&&x.instanceColor&&(_t=x.instanceColor));const St={};St.attribute=_t,_t&&_t.data&&(St.data=_t.data),W[V]=St,H++}s.attributes=W,s.attributesNum=H,s.index=O}function v(){const x=s.newAttributes;for(let C=0,z=x.length;C<z;C++)x[C]=0}function p(x){f(x,0)}function f(x,C){const z=s.newAttributes,O=s.enabledAttributes,W=s.attributeDivisors;z[x]=1,O[x]===0&&(i.enableVertexAttribArray(x),O[x]=1),W[x]!==C&&(i.vertexAttribDivisor(x,C),W[x]=C)}function A(){const x=s.newAttributes,C=s.enabledAttributes;for(let z=0,O=C.length;z<O;z++)C[z]!==x[z]&&(i.disableVertexAttribArray(z),C[z]=0)}function T(x,C,z,O,W,$,H){H===!0?i.vertexAttribIPointer(x,C,z,W,$):i.vertexAttribPointer(x,C,z,O,W,$)}function S(x,C,z,O){v();const W=O.attributes,$=z.getAttributes(),H=C.defaultAttributeValues;for(const Q in $){const V=$[Q];if(V.location>=0){let ut=W[Q];if(ut===void 0&&(Q==="instanceMatrix"&&x.instanceMatrix&&(ut=x.instanceMatrix),Q==="instanceColor"&&x.instanceColor&&(ut=x.instanceColor)),ut!==void 0){const _t=ut.normalized,St=ut.itemSize,Nt=t.get(ut);if(Nt===void 0)continue;const Kt=Nt.buffer,Y=Nt.type,st=Nt.bytesPerElement,Et=Y===i.INT||Y===i.UNSIGNED_INT||ut.gpuType===Xo;if(ut.isInterleavedBufferAttribute){const ct=ut.data,Pt=ct.stride,Zt=ut.offset;if(ct.isInstancedInterleavedBuffer){for(let bt=0;bt<V.locationSize;bt++)f(V.location+bt,ct.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let bt=0;bt<V.locationSize;bt++)p(V.location+bt);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let bt=0;bt<V.locationSize;bt++)T(V.location+bt,St/V.locationSize,Y,_t,Pt*st,(Zt+St/V.locationSize*bt)*st,Et)}else{if(ut.isInstancedBufferAttribute){for(let ct=0;ct<V.locationSize;ct++)f(V.location+ct,ut.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let ct=0;ct<V.locationSize;ct++)p(V.location+ct);i.bindBuffer(i.ARRAY_BUFFER,Kt);for(let ct=0;ct<V.locationSize;ct++)T(V.location+ct,St/V.locationSize,Y,_t,St*st,St/V.locationSize*ct*st,Et)}}else if(H!==void 0){const _t=H[Q];if(_t!==void 0)switch(_t.length){case 2:i.vertexAttrib2fv(V.location,_t);break;case 3:i.vertexAttrib3fv(V.location,_t);break;case 4:i.vertexAttrib4fv(V.location,_t);break;default:i.vertexAttrib1fv(V.location,_t)}}}}A()}function L(){D();for(const x in n){const C=n[x];for(const z in C){const O=C[z];for(const W in O)u(O[W].object),delete O[W];delete C[z]}delete n[x]}}function R(x){if(n[x.id]===void 0)return;const C=n[x.id];for(const z in C){const O=C[z];for(const W in O)u(O[W].object),delete O[W];delete C[z]}delete n[x.id]}function w(x){for(const C in n){const z=n[C];if(z[x.id]===void 0)continue;const O=z[x.id];for(const W in O)u(O[W].object),delete O[W];delete z[x.id]}}function D(){y(),o=!0,s!==r&&(s=r,l(s.object))}function y(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:D,resetDefaultState:y,dispose:L,releaseStatesOfGeometry:R,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:p,disableUnusedAttributes:A}}function kp(i,t,e){let n;function r(l){n=l}function s(l,u){i.drawArrays(n,l,u),e.update(u,n,1)}function o(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),e.update(u,n,h))}function a(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,h);let m=0;for(let g=0;g<h;g++)m+=u[g];e.update(m,n,1)}function c(l,u,h,d){if(h===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*d[v];e.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Hp(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(w){return!(w!==tn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const D=w===lr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==Sn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==_n&&!D)}function c(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:m,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:A,maxVaryings:T,maxFragmentUniforms:S,vertexTextures:L,maxSamples:R}}function Wp(i){const t=this;let e=null,n=0,r=!1,s=!1;const o=new Yn,a=new Ht,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const m=h.length!==0||d||n!==0||r;return r=d,n=h.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,m){const g=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,f=i.get(h);if(!r||g===null||g.length===0||s&&!p)s?u(null):l();else{const A=s?0:n,T=A*4;let S=f.clippingState||null;c.value=S,S=u(g,d,T,m);for(let L=0;L!==T;++L)S[L]=e[L];f.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,m,g){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=c.value,g!==!0||p===null){const f=m+v*4,A=d.matrixWorldInverse;a.getNormalMatrix(A),(p===null||p.length<f)&&(p=new Float32Array(f));for(let T=0,S=m;T!==v;++T,S+=4)o.copy(h[T]).applyMatrix4(A,a),o.normal.toArray(p,S),p[S+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function Xp(i){let t=new WeakMap;function e(o,a){return a===so?o.mapping=Li:a===oo&&(o.mapping=Di),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===so||a===oo)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new ah(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",r),e(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}const bi=4,oc=[.125,.215,.35,.446,.526,.582],Jn=20,Vs=new Cl,ac=new qt;let ks=null,Hs=0,Ws=0,Xs=!1;const Zn=(1+Math.sqrt(5))/2,Ei=1/Zn,cc=[new P(-Zn,Ei,0),new P(Zn,Ei,0),new P(-Ei,0,Zn),new P(Ei,0,Zn),new P(0,Zn,-Ei),new P(0,Zn,Ei),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],qp=new P;class lc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100,s={}){const{size:o=256,position:a=qp}=s;ks=this._renderer.getRenderTarget(),Hs=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel(),Xs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,r,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ks,Hs,Ws),this._renderer.xr.enabled=Xs,t.scissorTest=!1,Br(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Li||t.mapping===Di?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ks=this._renderer.getRenderTarget(),Hs=this._renderer.getActiveCubeFace(),Ws=this._renderer.getActiveMipmapLevel(),Xs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:lr,format:tn,colorSpace:Ni,depthBuffer:!1},r=uc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=uc(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yp(s)),this._blurMaterial=Zp(s,t,e)}return r}_compileMaterial(t){const e=new Ot(this._lodPlanes[0],t);this._renderer.compile(e,Vs)}_sceneToCubeUV(t,e,n,r,s){const c=new ze(90,1,e,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,m=h.toneMapping;h.getClearColor(ac),h.toneMapping=Ln,h.autoClear=!1;const g=new je({name:"PMREM.Background",side:Le,depthWrite:!1,depthTest:!1}),v=new Ot(new Be,g);let p=!1;const f=t.background;f?f.isColor&&(g.color.copy(f),t.background=null,p=!0):(g.color.copy(ac),p=!0);for(let A=0;A<6;A++){const T=A%3;T===0?(c.up.set(0,l[A],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+u[A],s.y,s.z)):T===1?(c.up.set(0,0,l[A]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+u[A],s.z)):(c.up.set(0,l[A],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+u[A]));const S=this._cubeSize;Br(r,T*S,A>2?S:0,S,S),h.setRenderTarget(r),p&&h.render(v,c),h.render(t,c)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=m,h.autoClear=d,t.background=f}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===Li||t.mapping===Di;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=fc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hc());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Ot(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const c=this._cubeSize;Br(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Vs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=cc[(r-s-1)%cc.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Ot(this._lodPlanes[r],l),d=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Jn-1),v=s/g,p=isFinite(s)?1+Math.floor(u*v):Jn;p>Jn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Jn}`);const f=[];let A=0;for(let w=0;w<Jn;++w){const D=w/v,y=Math.exp(-D*D/2);f.push(y),w===0?A+=y:w<p&&(A+=2*y)}for(let w=0;w<f.length;w++)f[w]=f[w]/A;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:T}=this;d.dTheta.value=g,d.mipInt.value=T-n;const S=this._sizeLods[r],L=3*S*(r>T-bi?r-T+bi:0),R=4*(this._cubeSize-S);Br(e,L,R,3*S,2*S),c.setRenderTarget(e),c.render(h,Vs)}}function Yp(i){const t=[],e=[],n=[];let r=i;const s=i-bi+1+oc.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let c=1/a;o>i-bi?c=oc[o-i+bi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,v=3,p=2,f=1,A=new Float32Array(v*g*m),T=new Float32Array(p*g*m),S=new Float32Array(f*g*m);for(let R=0;R<m;R++){const w=R%3*2/3-1,D=R>2?0:-1,y=[w,D,0,w+2/3,D,0,w+2/3,D+1,0,w,D,0,w+2/3,D+1,0,w,D+1,0];A.set(y,v*g*R),T.set(d,p*g*R);const x=[R,R,R,R,R,R];S.set(x,f*g*R)}const L=new Ie;L.setAttribute("position",new nn(A,v)),L.setAttribute("uv",new nn(T,p)),L.setAttribute("faceIndex",new nn(S,f)),t.push(L),r>bi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function uc(i,t,e){const n=new ti(i,t,e);return n.texture.mapping=is,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Br(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Zp(i,t,e){const n=new Float32Array(Jn),r=new P(0,1,0);return new Nn({name:"SphericalGaussianBlur",defines:{n:Jn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function hc(){return new Nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function fc(){return new Nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function oa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function $p(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===so||c===oo,u=c===Li||c===Di;if(l||u){let h=t.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new lc(i)),h=l?e.fromEquirectangular(a,h):e.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),h.texture;if(h!==void 0)return h.texture;{const m=a.image;return l&&m&&m.height>0||u&&m&&r(m)?(e===null&&(e=new lc(i)),h=l?e.fromEquirectangular(a):e.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,t.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Jp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&qn("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Kp(i,t,e,n){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const m=s.get(d);m&&(t.remove(m),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,e.memory.geometries++),d}function c(h){const d=h.attributes;for(const m in d)t.update(d[m],i.ARRAY_BUFFER)}function l(h){const d=[],m=h.index,g=h.attributes.position;let v=0;if(m!==null){const A=m.array;v=m.version;for(let T=0,S=A.length;T<S;T+=3){const L=A[T+0],R=A[T+1],w=A[T+2];d.push(L,R,R,w,w,L)}}else if(g!==void 0){const A=g.array;v=g.version;for(let T=0,S=A.length/3-1;T<S;T+=3){const L=T+0,R=T+1,w=T+2;d.push(L,R,R,w,w,L)}}else return;const p=new(ll(d)?pl:dl)(d,1);p.version=v;const f=s.get(h);f&&t.remove(f),s.set(h,p)}function u(h){const d=s.get(h);if(d){const m=h.index;m!==null&&d.version<m.version&&l(h)}else l(h);return s.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function jp(i,t,e){let n;function r(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function c(d,m){i.drawElements(n,m,s,d*o),e.update(m,n,1)}function l(d,m,g){g!==0&&(i.drawElementsInstanced(n,m,s,d*o,g),e.update(m,n,g))}function u(d,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,s,d,0,g);let p=0;for(let f=0;f<g;f++)p+=m[f];e.update(p,n,1)}function h(d,m,g,v){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<d.length;f++)l(d[f]/o,m[f],v[f]);else{p.multiDrawElementsInstancedWEBGL(n,m,0,s,d,0,v,0,g);let f=0;for(let A=0;A<g;A++)f+=m[A]*v[A];e.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Qp(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function tm(i,t,e){const n=new WeakMap,r=new se;function s(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let x=function(){D.dispose(),n.delete(a),a.removeEventListener("dispose",x)};var m=x;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let S=0;g===!0&&(S=1),v===!0&&(S=2),p===!0&&(S=3);let L=a.attributes.position.count*S,R=1;L>t.maxTextureSize&&(R=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const w=new Float32Array(L*R*4*h),D=new ul(w,L,R,h);D.type=_n,D.needsUpdate=!0;const y=S*4;for(let C=0;C<h;C++){const z=f[C],O=A[C],W=T[C],$=L*R*4*C;for(let H=0;H<z.count;H++){const Q=H*y;g===!0&&(r.fromBufferAttribute(z,H),w[$+Q+0]=r.x,w[$+Q+1]=r.y,w[$+Q+2]=r.z,w[$+Q+3]=0),v===!0&&(r.fromBufferAttribute(O,H),w[$+Q+4]=r.x,w[$+Q+5]=r.y,w[$+Q+6]=r.z,w[$+Q+7]=0),p===!0&&(r.fromBufferAttribute(W,H),w[$+Q+8]=r.x,w[$+Q+9]=r.y,w[$+Q+10]=r.z,w[$+Q+11]=W.itemSize===4?r.w:1)}}d={count:h,texture:D,size:new ot(L,R)},n.set(a,d),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let p=0;p<l.length;p++)g+=l[p];const v=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function em(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,u=c.geometry,h=t.get(c,u);if(r.get(h)!==l&&(t.update(h),r.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return h}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}const Ll=new De,dc=new Ml(1,1),Dl=new ul,Ul=new Wu,Il=new _l,pc=[],mc=[],gc=new Float32Array(16),_c=new Float32Array(9),vc=new Float32Array(4);function ki(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=pc[r];if(s===void 0&&(s=new Float32Array(r),pc[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function ge(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function _e(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ss(i,t){let e=mc[t];e===void 0&&(e=new Int32Array(t),mc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function nm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function im(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2fv(this.addr,t),_e(e,t)}}function rm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ge(e,t))return;i.uniform3fv(this.addr,t),_e(e,t)}}function sm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4fv(this.addr,t),_e(e,t)}}function om(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;vc.set(n),i.uniformMatrix2fv(this.addr,!1,vc),_e(e,n)}}function am(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;_c.set(n),i.uniformMatrix3fv(this.addr,!1,_c),_e(e,n)}}function cm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;gc.set(n),i.uniformMatrix4fv(this.addr,!1,gc),_e(e,n)}}function lm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2iv(this.addr,t),_e(e,t)}}function hm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ge(e,t))return;i.uniform3iv(this.addr,t),_e(e,t)}}function fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4iv(this.addr,t),_e(e,t)}}function dm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function pm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2uiv(this.addr,t),_e(e,t)}}function mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ge(e,t))return;i.uniform3uiv(this.addr,t),_e(e,t)}}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4uiv(this.addr,t),_e(e,t)}}function _m(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(dc.compareFunction=cl,s=dc):s=Ll,e.setTexture2D(t||s,r)}function vm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Ul,r)}function xm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Il,r)}function Mm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Dl,r)}function Sm(i){switch(i){case 5126:return nm;case 35664:return im;case 35665:return rm;case 35666:return sm;case 35674:return om;case 35675:return am;case 35676:return cm;case 5124:case 35670:return lm;case 35667:case 35671:return um;case 35668:case 35672:return hm;case 35669:case 35673:return fm;case 5125:return dm;case 36294:return pm;case 36295:return mm;case 36296:return gm;case 35678:case 36198:case 36298:case 36306:case 35682:return _m;case 35679:case 36299:case 36307:return vm;case 35680:case 36300:case 36308:case 36293:return xm;case 36289:case 36303:case 36311:case 36292:return Mm}}function ym(i,t){i.uniform1fv(this.addr,t)}function Em(i,t){const e=ki(t,this.size,2);i.uniform2fv(this.addr,e)}function Tm(i,t){const e=ki(t,this.size,3);i.uniform3fv(this.addr,e)}function bm(i,t){const e=ki(t,this.size,4);i.uniform4fv(this.addr,e)}function Am(i,t){const e=ki(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function wm(i,t){const e=ki(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Rm(i,t){const e=ki(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Cm(i,t){i.uniform1iv(this.addr,t)}function Pm(i,t){i.uniform2iv(this.addr,t)}function Lm(i,t){i.uniform3iv(this.addr,t)}function Dm(i,t){i.uniform4iv(this.addr,t)}function Um(i,t){i.uniform1uiv(this.addr,t)}function Im(i,t){i.uniform2uiv(this.addr,t)}function Nm(i,t){i.uniform3uiv(this.addr,t)}function Fm(i,t){i.uniform4uiv(this.addr,t)}function Om(i,t,e){const n=this.cache,r=t.length,s=ss(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Ll,s[o])}function Bm(i,t,e){const n=this.cache,r=t.length,s=ss(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Ul,s[o])}function zm(i,t,e){const n=this.cache,r=t.length,s=ss(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Il,s[o])}function Gm(i,t,e){const n=this.cache,r=t.length,s=ss(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||Dl,s[o])}function Vm(i){switch(i){case 5126:return ym;case 35664:return Em;case 35665:return Tm;case 35666:return bm;case 35674:return Am;case 35675:return wm;case 35676:return Rm;case 5124:case 35670:return Cm;case 35667:case 35671:return Pm;case 35668:case 35672:return Lm;case 35669:case 35673:return Dm;case 5125:return Um;case 36294:return Im;case 36295:return Nm;case 36296:return Fm;case 35678:case 36198:case 36298:case 36306:case 35682:return Om;case 35679:case 36299:case 36307:return Bm;case 35680:case 36300:case 36308:case 36293:return zm;case 36289:case 36303:case 36311:case 36292:return Gm}}class km{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Sm(e.type)}}class Hm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Vm(e.type)}}class Wm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],n)}}}const qs=/(\w+)(\])?(\[|\.)?/g;function xc(i,t){i.seq.push(t),i.map[t.id]=t}function Xm(i,t,e){const n=i.name,r=n.length;for(qs.lastIndex=0;;){const s=qs.exec(n),o=qs.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){xc(e,l===void 0?new km(a,i,t):new Hm(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new Wm(a),xc(e,h)),e=h}}}class $r{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);Xm(s,o,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&n.push(o)}return n}}function Mc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const qm=37297;let Ym=0;function Zm(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Sc=new Ht;function $m(i){Qt._getMatrix(Sc,Qt.workingColorSpace,i);const t=`mat3( ${Sc.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(i)){case Jr:return[t,"LinearTransferOETF"];case ie:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function yc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+Zm(i.getShaderSource(t),o)}else return r}function Jm(i,t){const e=$m(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Km(i,t){let e;switch(t){case _u:e="Linear";break;case vu:e="Reinhard";break;case xu:e="Cineon";break;case $c:e="ACESFilmic";break;case Su:e="AgX";break;case yu:e="Neutral";break;case Mu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const zr=new P;function jm(){Qt.getLuminanceCoefficients(zr);const i=zr.x.toFixed(4),t=zr.y.toFixed(4),e=zr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Qm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tr).join(`
`)}function tg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function eg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function tr(i){return i!==""}function Ec(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Tc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ng=/^[ \t]*#include +<([\w\d./]+)>/gm;function ko(i){return i.replace(ng,rg)}const ig=new Map;function rg(i,t){let e=Wt[t];if(e===void 0){const n=ig.get(t);if(n!==void 0)e=Wt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ko(e)}const sg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bc(i){return i.replace(sg,og)}function og(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Ac(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function ag(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===qc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Yc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===gn&&(t="SHADOWMAP_TYPE_VSM"),t}function cg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Li:case Di:t="ENVMAP_TYPE_CUBE";break;case is:t="ENVMAP_TYPE_CUBE_UV";break}return t}function lg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Di:t="ENVMAP_MODE_REFRACTION";break}return t}function ug(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Zc:t="ENVMAP_BLENDING_MULTIPLY";break;case mu:t="ENVMAP_BLENDING_MIX";break;case gu:t="ENVMAP_BLENDING_ADD";break}return t}function hg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function fg(i,t,e,n){const r=i.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=ag(e),l=cg(e),u=lg(e),h=ug(e),d=hg(e),m=Qm(e),g=tg(s),v=r.createProgram();let p,f,A=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(tr).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(tr).join(`
`),f.length>0&&(f+=`
`)):(p=[Ac(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),f=[Ac(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ln?"#define TONE_MAPPING":"",e.toneMapping!==Ln?Wt.tonemapping_pars_fragment:"",e.toneMapping!==Ln?Km("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,Jm("linearToOutputTexel",e.outputColorSpace),jm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(tr).join(`
`)),o=ko(o),o=Ec(o,e),o=Tc(o,e),a=ko(a),a=Ec(a,e),a=Tc(a,e),o=bc(o),a=bc(a),e.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",e.glslVersion===Ra?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ra?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const T=A+p+o,S=A+f+a,L=Mc(r,r.VERTEX_SHADER,T),R=Mc(r,r.FRAGMENT_SHADER,S);r.attachShader(v,L),r.attachShader(v,R),e.index0AttributeName!==void 0?r.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function w(C){if(i.debug.checkShaderErrors){const z=r.getProgramInfoLog(v).trim(),O=r.getShaderInfoLog(L).trim(),W=r.getShaderInfoLog(R).trim();let $=!0,H=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if($=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,v,L,R);else{const Q=yc(r,L,"vertex"),V=yc(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+z+`
`+Q+`
`+V)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(O===""||W==="")&&(H=!1);H&&(C.diagnostics={runnable:$,programLog:z,vertexShader:{log:O,prefix:p},fragmentShader:{log:W,prefix:f}})}r.deleteShader(L),r.deleteShader(R),D=new $r(r,v),y=eg(r,v)}let D;this.getUniforms=function(){return D===void 0&&w(this),D};let y;this.getAttributes=function(){return y===void 0&&w(this),y};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(v,qm)),x},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ym++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=L,this.fragmentShader=R,this}let dg=0;class pg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new mg(t),e.set(t,n)),n}}class mg{constructor(t){this.id=dg++,this.code=t,this.usedTimes=0}}function gg(i,t,e,n,r,s,o){const a=new Qo,c=new pg,l=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let m=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return l.add(y),y===0?"uv":`uv${y}`}function p(y,x,C,z,O){const W=z.fog,$=O.geometry,H=y.isMeshStandardMaterial?z.environment:null,Q=(y.isMeshStandardMaterial?e:t).get(y.envMap||H),V=Q&&Q.mapping===is?Q.image.height:null,ut=g[y.type];y.precision!==null&&(m=r.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const _t=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,St=_t!==void 0?_t.length:0;let Nt=0;$.morphAttributes.position!==void 0&&(Nt=1),$.morphAttributes.normal!==void 0&&(Nt=2),$.morphAttributes.color!==void 0&&(Nt=3);let Kt,Y,st,Et;if(ut){const ne=rn[ut];Kt=ne.vertexShader,Y=ne.fragmentShader}else Kt=y.vertexShader,Y=y.fragmentShader,c.update(y),st=c.getVertexShaderID(y),Et=c.getFragmentShaderID(y);const ct=i.getRenderTarget(),Pt=i.state.buffers.depth.getReversed(),Zt=O.isInstancedMesh===!0,bt=O.isBatchedMesh===!0,$t=!!y.map,nt=!!y.matcap,tt=!!Q,b=!!y.aoMap,wt=!!y.lightMap,it=!!y.bumpMap,gt=!!y.normalMap,at=!!y.displacementMap,It=!!y.emissiveMap,ht=!!y.metalnessMap,E=!!y.roughnessMap,_=y.anisotropy>0,F=y.clearcoat>0,q=y.dispersion>0,et=y.iridescence>0,Z=y.sheen>0,At=y.transmission>0,X=_&&!!y.anisotropyMap,K=F&&!!y.clearcoatMap,Ct=F&&!!y.clearcoatNormalMap,J=F&&!!y.clearcoatRoughnessMap,lt=et&&!!y.iridescenceMap,vt=et&&!!y.iridescenceThicknessMap,Rt=Z&&!!y.sheenColorMap,ft=Z&&!!y.sheenRoughnessMap,Bt=!!y.specularMap,Lt=!!y.specularColorMap,Ft=!!y.specularIntensityMap,U=At&&!!y.transmissionMap,pt=At&&!!y.thicknessMap,k=!!y.gradientMap,j=!!y.alphaMap,Mt=y.alphaTest>0,xt=!!y.alphaHash,kt=!!y.extensions;let ue=Ln;y.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(ue=i.toneMapping);const Ee={shaderID:ut,shaderType:y.type,shaderName:y.name,vertexShader:Kt,fragmentShader:Y,defines:y.defines,customVertexShaderID:st,customFragmentShaderID:Et,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:bt,batchingColor:bt&&O._colorsTexture!==null,instancing:Zt,instancingColor:Zt&&O.instanceColor!==null,instancingMorph:Zt&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:Ni,alphaToCoverage:!!y.alphaToCoverage,map:$t,matcap:nt,envMap:tt,envMapMode:tt&&Q.mapping,envMapCubeUVHeight:V,aoMap:b,lightMap:wt,bumpMap:it,normalMap:gt,displacementMap:d&&at,emissiveMap:It,normalMapObjectSpace:gt&&y.normalMapType===Au,normalMapTangentSpace:gt&&y.normalMapType===al,metalnessMap:ht,roughnessMap:E,anisotropy:_,anisotropyMap:X,clearcoat:F,clearcoatMap:K,clearcoatNormalMap:Ct,clearcoatRoughnessMap:J,dispersion:q,iridescence:et,iridescenceMap:lt,iridescenceThicknessMap:vt,sheen:Z,sheenColorMap:Rt,sheenRoughnessMap:ft,specularMap:Bt,specularColorMap:Lt,specularIntensityMap:Ft,transmission:At,transmissionMap:U,thicknessMap:pt,gradientMap:k,opaque:y.transparent===!1&&y.blending===Ai&&y.alphaToCoverage===!1,alphaMap:j,alphaTest:Mt,alphaHash:xt,combine:y.combine,mapUv:$t&&v(y.map.channel),aoMapUv:b&&v(y.aoMap.channel),lightMapUv:wt&&v(y.lightMap.channel),bumpMapUv:it&&v(y.bumpMap.channel),normalMapUv:gt&&v(y.normalMap.channel),displacementMapUv:at&&v(y.displacementMap.channel),emissiveMapUv:It&&v(y.emissiveMap.channel),metalnessMapUv:ht&&v(y.metalnessMap.channel),roughnessMapUv:E&&v(y.roughnessMap.channel),anisotropyMapUv:X&&v(y.anisotropyMap.channel),clearcoatMapUv:K&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:Ct&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:lt&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:vt&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:Rt&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:ft&&v(y.sheenRoughnessMap.channel),specularMapUv:Bt&&v(y.specularMap.channel),specularColorMapUv:Lt&&v(y.specularColorMap.channel),specularIntensityMapUv:Ft&&v(y.specularIntensityMap.channel),transmissionMapUv:U&&v(y.transmissionMap.channel),thicknessMapUv:pt&&v(y.thicknessMap.channel),alphaMapUv:j&&v(y.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(gt||_),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!$.attributes.uv&&($t||j),fog:!!W,useFog:y.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Pt,skinning:O.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:St,morphTextureStride:Nt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ue,decodeVideoTexture:$t&&y.map.isVideoTexture===!0&&Qt.getTransfer(y.map.colorSpace)===ie,decodeVideoTextureEmissive:It&&y.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(y.emissiveMap.colorSpace)===ie,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Qe,flipSided:y.side===Le,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:kt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(kt&&y.extensions.multiDraw===!0||bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Ee.vertexUv1s=l.has(1),Ee.vertexUv2s=l.has(2),Ee.vertexUv3s=l.has(3),l.clear(),Ee}function f(y){const x=[];if(y.shaderID?x.push(y.shaderID):(x.push(y.customVertexShaderID),x.push(y.customFragmentShaderID)),y.defines!==void 0)for(const C in y.defines)x.push(C),x.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(A(x,y),T(x,y),x.push(i.outputColorSpace)),x.push(y.customProgramCacheKey),x.join()}function A(y,x){y.push(x.precision),y.push(x.outputColorSpace),y.push(x.envMapMode),y.push(x.envMapCubeUVHeight),y.push(x.mapUv),y.push(x.alphaMapUv),y.push(x.lightMapUv),y.push(x.aoMapUv),y.push(x.bumpMapUv),y.push(x.normalMapUv),y.push(x.displacementMapUv),y.push(x.emissiveMapUv),y.push(x.metalnessMapUv),y.push(x.roughnessMapUv),y.push(x.anisotropyMapUv),y.push(x.clearcoatMapUv),y.push(x.clearcoatNormalMapUv),y.push(x.clearcoatRoughnessMapUv),y.push(x.iridescenceMapUv),y.push(x.iridescenceThicknessMapUv),y.push(x.sheenColorMapUv),y.push(x.sheenRoughnessMapUv),y.push(x.specularMapUv),y.push(x.specularColorMapUv),y.push(x.specularIntensityMapUv),y.push(x.transmissionMapUv),y.push(x.thicknessMapUv),y.push(x.combine),y.push(x.fogExp2),y.push(x.sizeAttenuation),y.push(x.morphTargetsCount),y.push(x.morphAttributeCount),y.push(x.numDirLights),y.push(x.numPointLights),y.push(x.numSpotLights),y.push(x.numSpotLightMaps),y.push(x.numHemiLights),y.push(x.numRectAreaLights),y.push(x.numDirLightShadows),y.push(x.numPointLightShadows),y.push(x.numSpotLightShadows),y.push(x.numSpotLightShadowsWithMaps),y.push(x.numLightProbes),y.push(x.shadowMapType),y.push(x.toneMapping),y.push(x.numClippingPlanes),y.push(x.numClipIntersection),y.push(x.depthPacking)}function T(y,x){a.disableAll(),x.supportsVertexTextures&&a.enable(0),x.instancing&&a.enable(1),x.instancingColor&&a.enable(2),x.instancingMorph&&a.enable(3),x.matcap&&a.enable(4),x.envMap&&a.enable(5),x.normalMapObjectSpace&&a.enable(6),x.normalMapTangentSpace&&a.enable(7),x.clearcoat&&a.enable(8),x.iridescence&&a.enable(9),x.alphaTest&&a.enable(10),x.vertexColors&&a.enable(11),x.vertexAlphas&&a.enable(12),x.vertexUv1s&&a.enable(13),x.vertexUv2s&&a.enable(14),x.vertexUv3s&&a.enable(15),x.vertexTangents&&a.enable(16),x.anisotropy&&a.enable(17),x.alphaHash&&a.enable(18),x.batching&&a.enable(19),x.dispersion&&a.enable(20),x.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),x.fog&&a.enable(0),x.useFog&&a.enable(1),x.flatShading&&a.enable(2),x.logarithmicDepthBuffer&&a.enable(3),x.reverseDepthBuffer&&a.enable(4),x.skinning&&a.enable(5),x.morphTargets&&a.enable(6),x.morphNormals&&a.enable(7),x.morphColors&&a.enable(8),x.premultipliedAlpha&&a.enable(9),x.shadowMapEnabled&&a.enable(10),x.doubleSided&&a.enable(11),x.flipSided&&a.enable(12),x.useDepthPacking&&a.enable(13),x.dithering&&a.enable(14),x.transmission&&a.enable(15),x.sheen&&a.enable(16),x.opaque&&a.enable(17),x.pointsUvs&&a.enable(18),x.decodeVideoTexture&&a.enable(19),x.decodeVideoTextureEmissive&&a.enable(20),x.alphaToCoverage&&a.enable(21),y.push(a.mask)}function S(y){const x=g[y.type];let C;if(x){const z=rn[x];C=ih.clone(z.uniforms)}else C=y.uniforms;return C}function L(y,x){let C;for(let z=0,O=u.length;z<O;z++){const W=u[z];if(W.cacheKey===x){C=W,++C.usedTimes;break}}return C===void 0&&(C=new fg(i,x,y,s),u.push(C)),C}function R(y){if(--y.usedTimes===0){const x=u.indexOf(y);u[x]=u[u.length-1],u.pop(),y.destroy()}}function w(y){c.remove(y)}function D(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:S,acquireProgram:L,releaseProgram:R,releaseShaderCache:w,programs:u,dispose:D}}function _g(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,c){i.get(o)[a]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function vg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function wc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Rc(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(h,d,m,g,v,p){let f=i[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:m,groupOrder:g,renderOrder:h.renderOrder,z:v,group:p},i[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=v,f.group=p),t++,f}function a(h,d,m,g,v,p){const f=o(h,d,m,g,v,p);m.transmission>0?n.push(f):m.transparent===!0?r.push(f):e.push(f)}function c(h,d,m,g,v,p){const f=o(h,d,m,g,v,p);m.transmission>0?n.unshift(f):m.transparent===!0?r.unshift(f):e.unshift(f)}function l(h,d){e.length>1&&e.sort(h||vg),n.length>1&&n.sort(d||wc),r.length>1&&r.sort(d||wc)}function u(){for(let h=t,d=i.length;h<d;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:u,sort:l}}function xg(){let i=new WeakMap;function t(n,r){const s=i.get(n);let o;return s===void 0?(o=new Rc,i.set(n,[o])):r>=s.length?(o=new Rc,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Mg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new qt};break;case"SpotLight":e={position:new P,direction:new P,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function Sg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let yg=0;function Eg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Tg(i){const t=new Mg,e=Sg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);const r=new P,s=new oe,o=new oe;function a(l){let u=0,h=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let m=0,g=0,v=0,p=0,f=0,A=0,T=0,S=0,L=0,R=0,w=0;l.sort(Eg);for(let y=0,x=l.length;y<x;y++){const C=l[y],z=C.color,O=C.intensity,W=C.distance,$=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=z.r*O,h+=z.g*O,d+=z.b*O;else if(C.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(C.sh.coefficients[H],O);w++}else if(C.isDirectionalLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const Q=C.shadow,V=e.get(C);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,n.directionalShadow[m]=V,n.directionalShadowMap[m]=$,n.directionalShadowMatrix[m]=C.shadow.matrix,A++}n.directional[m]=H,m++}else if(C.isSpotLight){const H=t.get(C);H.position.setFromMatrixPosition(C.matrixWorld),H.color.copy(z).multiplyScalar(O),H.distance=W,H.coneCos=Math.cos(C.angle),H.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),H.decay=C.decay,n.spot[v]=H;const Q=C.shadow;if(C.map&&(n.spotLightMap[L]=C.map,L++,Q.updateMatrices(C),C.castShadow&&R++),n.spotLightMatrix[v]=Q.matrix,C.castShadow){const V=e.get(C);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,n.spotShadow[v]=V,n.spotShadowMap[v]=$,S++}v++}else if(C.isRectAreaLight){const H=t.get(C);H.color.copy(z).multiplyScalar(O),H.halfWidth.set(C.width*.5,0,0),H.halfHeight.set(0,C.height*.5,0),n.rectArea[p]=H,p++}else if(C.isPointLight){const H=t.get(C);if(H.color.copy(C.color).multiplyScalar(C.intensity),H.distance=C.distance,H.decay=C.decay,C.castShadow){const Q=C.shadow,V=e.get(C);V.shadowIntensity=Q.intensity,V.shadowBias=Q.bias,V.shadowNormalBias=Q.normalBias,V.shadowRadius=Q.radius,V.shadowMapSize=Q.mapSize,V.shadowCameraNear=Q.camera.near,V.shadowCameraFar=Q.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=$,n.pointShadowMatrix[g]=C.shadow.matrix,T++}n.point[g]=H,g++}else if(C.isHemisphereLight){const H=t.get(C);H.skyColor.copy(C.color).multiplyScalar(O),H.groundColor.copy(C.groundColor).multiplyScalar(O),n.hemi[f]=H,f++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const D=n.hash;(D.directionalLength!==m||D.pointLength!==g||D.spotLength!==v||D.rectAreaLength!==p||D.hemiLength!==f||D.numDirectionalShadows!==A||D.numPointShadows!==T||D.numSpotShadows!==S||D.numSpotMaps!==L||D.numLightProbes!==w)&&(n.directional.length=m,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=S+L-R,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=w,D.directionalLength=m,D.pointLength=g,D.spotLength=v,D.rectAreaLength=p,D.hemiLength=f,D.numDirectionalShadows=A,D.numPointShadows=T,D.numSpotShadows=S,D.numSpotMaps=L,D.numLightProbes=w,n.version=yg++)}function c(l,u){let h=0,d=0,m=0,g=0,v=0;const p=u.matrixWorldInverse;for(let f=0,A=l.length;f<A;f++){const T=l[f];if(T.isDirectionalLight){const S=n.directional[h];S.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),h++}else if(T.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),m++}else if(T.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),o.identity(),s.copy(T.matrixWorld),s.premultiply(p),o.extractRotation(s),S.halfWidth.set(T.width*.5,0,0),S.halfHeight.set(0,T.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(T.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(T.matrixWorld),S.position.applyMatrix4(p),d++}else if(T.isHemisphereLight){const S=n.hemi[v];S.direction.setFromMatrixPosition(T.matrixWorld),S.direction.transformDirection(p),v++}}}return{setup:a,setupView:c,state:n}}function Cc(i){const t=new Tg(i),e=[],n=[];function r(u){l.camera=u,e.length=0,n.length=0}function s(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function c(u){t.setupView(e,u)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function bg(i){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new Cc(i),t.set(r,[a])):s>=o.length?(a=new Cc(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const Ag=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Rg(i,t,e){let n=new ta;const r=new ot,s=new ot,o=new se,a=new Yh({depthPacking:bu}),c=new Zh,l={},u=e.maxTextureSize,h={[In]:Le,[Le]:In,[Qe]:Qe},d=new Nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:Ag,fragmentShader:wg}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Ie;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Ot(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qc;let f=this.type;this.render=function(R,w,D){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;const y=i.getRenderTarget(),x=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Pn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const O=f!==gn&&this.type===gn,W=f===gn&&this.type!==gn;for(let $=0,H=R.length;$<H;$++){const Q=R[$],V=Q.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Q,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const ut=V.getFrameExtents();if(r.multiply(ut),s.copy(V.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ut.x),r.x=s.x*ut.x,V.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ut.y),r.y=s.y*ut.y,V.mapSize.y=s.y)),V.map===null||O===!0||W===!0){const St=this.type!==gn?{minFilter:en,magFilter:en}:{};V.map!==null&&V.map.dispose(),V.map=new ti(r.x,r.y,St),V.map.texture.name=Q.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const _t=V.getViewportCount();for(let St=0;St<_t;St++){const Nt=V.getViewport(St);o.set(s.x*Nt.x,s.y*Nt.y,s.x*Nt.z,s.y*Nt.w),z.viewport(o),V.updateMatrices(Q,St),n=V.getFrustum(),S(w,D,V.camera,Q,this.type)}V.isPointLightShadow!==!0&&this.type===gn&&A(V,D),V.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(y,x,C)};function A(R,w){const D=t.update(v);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new ti(r.x,r.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(w,null,D,d,v,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(w,null,D,m,v,null)}function T(R,w,D,y){let x=null;const C=D.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(C!==void 0)x=C;else if(x=D.isPointLight===!0?c:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const z=x.uuid,O=w.uuid;let W=l[z];W===void 0&&(W={},l[z]=W);let $=W[O];$===void 0&&($=x.clone(),W[O]=$,w.addEventListener("dispose",L)),x=$}if(x.visible=w.visible,x.wireframe=w.wireframe,y===gn?x.side=w.shadowSide!==null?w.shadowSide:w.side:x.side=w.shadowSide!==null?w.shadowSide:h[w.side],x.alphaMap=w.alphaMap,x.alphaTest=w.alphaTest,x.map=w.map,x.clipShadows=w.clipShadows,x.clippingPlanes=w.clippingPlanes,x.clipIntersection=w.clipIntersection,x.displacementMap=w.displacementMap,x.displacementScale=w.displacementScale,x.displacementBias=w.displacementBias,x.wireframeLinewidth=w.wireframeLinewidth,x.linewidth=w.linewidth,D.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const z=i.properties.get(x);z.light=D}return x}function S(R,w,D,y,x){if(R.visible===!1)return;if(R.layers.test(w.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&x===gn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,R.matrixWorld);const O=t.update(R),W=R.material;if(Array.isArray(W)){const $=O.groups;for(let H=0,Q=$.length;H<Q;H++){const V=$[H],ut=W[V.materialIndex];if(ut&&ut.visible){const _t=T(R,ut,y,x);R.onBeforeShadow(i,R,w,D,O,_t,V),i.renderBufferDirect(D,null,O,_t,R,V),R.onAfterShadow(i,R,w,D,O,_t,V)}}}else if(W.visible){const $=T(R,W,y,x);R.onBeforeShadow(i,R,w,D,O,$,null),i.renderBufferDirect(D,null,O,$,R,null),R.onAfterShadow(i,R,w,D,O,$,null)}}const z=R.children;for(let O=0,W=z.length;O<W;O++)S(z[O],w,D,y,x)}function L(R){R.target.removeEventListener("dispose",L);for(const D in l){const y=l[D],x=R.target.uuid;x in y&&(y[x].dispose(),delete y[x])}}}const Cg={[js]:Qs,[to]:io,[eo]:ro,[Pi]:no,[Qs]:js,[io]:to,[ro]:eo,[no]:Pi};function Pg(i,t){function e(){let U=!1;const pt=new se;let k=null;const j=new se(0,0,0,0);return{setMask:function(Mt){k!==Mt&&!U&&(i.colorMask(Mt,Mt,Mt,Mt),k=Mt)},setLocked:function(Mt){U=Mt},setClear:function(Mt,xt,kt,ue,Ee){Ee===!0&&(Mt*=ue,xt*=ue,kt*=ue),pt.set(Mt,xt,kt,ue),j.equals(pt)===!1&&(i.clearColor(Mt,xt,kt,ue),j.copy(pt))},reset:function(){U=!1,k=null,j.set(-1,0,0,0)}}}function n(){let U=!1,pt=!1,k=null,j=null,Mt=null;return{setReversed:function(xt){if(pt!==xt){const kt=t.get("EXT_clip_control");pt?kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.ZERO_TO_ONE_EXT):kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.NEGATIVE_ONE_TO_ONE_EXT);const ue=Mt;Mt=null,this.setClear(ue)}pt=xt},getReversed:function(){return pt},setTest:function(xt){xt?ct(i.DEPTH_TEST):Pt(i.DEPTH_TEST)},setMask:function(xt){k!==xt&&!U&&(i.depthMask(xt),k=xt)},setFunc:function(xt){if(pt&&(xt=Cg[xt]),j!==xt){switch(xt){case js:i.depthFunc(i.NEVER);break;case Qs:i.depthFunc(i.ALWAYS);break;case to:i.depthFunc(i.LESS);break;case Pi:i.depthFunc(i.LEQUAL);break;case eo:i.depthFunc(i.EQUAL);break;case no:i.depthFunc(i.GEQUAL);break;case io:i.depthFunc(i.GREATER);break;case ro:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}j=xt}},setLocked:function(xt){U=xt},setClear:function(xt){Mt!==xt&&(pt&&(xt=1-xt),i.clearDepth(xt),Mt=xt)},reset:function(){U=!1,k=null,j=null,Mt=null,pt=!1}}}function r(){let U=!1,pt=null,k=null,j=null,Mt=null,xt=null,kt=null,ue=null,Ee=null;return{setTest:function(ne){U||(ne?ct(i.STENCIL_TEST):Pt(i.STENCIL_TEST))},setMask:function(ne){pt!==ne&&!U&&(i.stencilMask(ne),pt=ne)},setFunc:function(ne,Ye,un){(k!==ne||j!==Ye||Mt!==un)&&(i.stencilFunc(ne,Ye,un),k=ne,j=Ye,Mt=un)},setOp:function(ne,Ye,un){(xt!==ne||kt!==Ye||ue!==un)&&(i.stencilOp(ne,Ye,un),xt=ne,kt=Ye,ue=un)},setLocked:function(ne){U=ne},setClear:function(ne){Ee!==ne&&(i.clearStencil(ne),Ee=ne)},reset:function(){U=!1,pt=null,k=null,j=null,Mt=null,xt=null,kt=null,ue=null,Ee=null}}}const s=new e,o=new n,a=new r,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,m=[],g=null,v=!1,p=null,f=null,A=null,T=null,S=null,L=null,R=null,w=new qt(0,0,0),D=0,y=!1,x=null,C=null,z=null,O=null,W=null;const $=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Q=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=Q>=1):V.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=Q>=2);let ut=null,_t={};const St=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),Kt=new se().fromArray(St),Y=new se().fromArray(Nt);function st(U,pt,k,j){const Mt=new Uint8Array(4),xt=i.createTexture();i.bindTexture(U,xt),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let kt=0;kt<k;kt++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,j,0,i.RGBA,i.UNSIGNED_BYTE,Mt):i.texImage2D(pt+kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Mt);return xt}const Et={};Et[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),Et[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Et[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Et[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ct(i.DEPTH_TEST),o.setFunc(Pi),it(!1),gt(Ea),ct(i.CULL_FACE),b(Pn);function ct(U){u[U]!==!0&&(i.enable(U),u[U]=!0)}function Pt(U){u[U]!==!1&&(i.disable(U),u[U]=!1)}function Zt(U,pt){return h[U]!==pt?(i.bindFramebuffer(U,pt),h[U]=pt,U===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pt),U===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function bt(U,pt){let k=m,j=!1;if(U){k=d.get(pt),k===void 0&&(k=[],d.set(pt,k));const Mt=U.textures;if(k.length!==Mt.length||k[0]!==i.COLOR_ATTACHMENT0){for(let xt=0,kt=Mt.length;xt<kt;xt++)k[xt]=i.COLOR_ATTACHMENT0+xt;k.length=Mt.length,j=!0}}else k[0]!==i.BACK&&(k[0]=i.BACK,j=!0);j&&i.drawBuffers(k)}function $t(U){return g!==U?(i.useProgram(U),g=U,!0):!1}const nt={[$n]:i.FUNC_ADD,[jl]:i.FUNC_SUBTRACT,[Ql]:i.FUNC_REVERSE_SUBTRACT};nt[tu]=i.MIN,nt[eu]=i.MAX;const tt={[nu]:i.ZERO,[iu]:i.ONE,[ru]:i.SRC_COLOR,[Js]:i.SRC_ALPHA,[uu]:i.SRC_ALPHA_SATURATE,[cu]:i.DST_COLOR,[ou]:i.DST_ALPHA,[su]:i.ONE_MINUS_SRC_COLOR,[Ks]:i.ONE_MINUS_SRC_ALPHA,[lu]:i.ONE_MINUS_DST_COLOR,[au]:i.ONE_MINUS_DST_ALPHA,[hu]:i.CONSTANT_COLOR,[fu]:i.ONE_MINUS_CONSTANT_COLOR,[du]:i.CONSTANT_ALPHA,[pu]:i.ONE_MINUS_CONSTANT_ALPHA};function b(U,pt,k,j,Mt,xt,kt,ue,Ee,ne){if(U===Pn){v===!0&&(Pt(i.BLEND),v=!1);return}if(v===!1&&(ct(i.BLEND),v=!0),U!==Kl){if(U!==p||ne!==y){if((f!==$n||S!==$n)&&(i.blendEquation(i.FUNC_ADD),f=$n,S=$n),ne)switch(U){case Ai:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ta:i.blendFunc(i.ONE,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Aa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ai:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ta:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ba:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Aa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}A=null,T=null,L=null,R=null,w.set(0,0,0),D=0,p=U,y=ne}return}Mt=Mt||pt,xt=xt||k,kt=kt||j,(pt!==f||Mt!==S)&&(i.blendEquationSeparate(nt[pt],nt[Mt]),f=pt,S=Mt),(k!==A||j!==T||xt!==L||kt!==R)&&(i.blendFuncSeparate(tt[k],tt[j],tt[xt],tt[kt]),A=k,T=j,L=xt,R=kt),(ue.equals(w)===!1||Ee!==D)&&(i.blendColor(ue.r,ue.g,ue.b,Ee),w.copy(ue),D=Ee),p=U,y=!1}function wt(U,pt){U.side===Qe?Pt(i.CULL_FACE):ct(i.CULL_FACE);let k=U.side===Le;pt&&(k=!k),it(k),U.blending===Ai&&U.transparent===!1?b(Pn):b(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const j=U.stencilWrite;a.setTest(j),j&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),It(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):Pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(U){x!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),x=U)}function gt(U){U!==$l?(ct(i.CULL_FACE),U!==C&&(U===Ea?i.cullFace(i.BACK):U===Jl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pt(i.CULL_FACE),C=U}function at(U){U!==z&&(H&&i.lineWidth(U),z=U)}function It(U,pt,k){U?(ct(i.POLYGON_OFFSET_FILL),(O!==pt||W!==k)&&(i.polygonOffset(pt,k),O=pt,W=k)):Pt(i.POLYGON_OFFSET_FILL)}function ht(U){U?ct(i.SCISSOR_TEST):Pt(i.SCISSOR_TEST)}function E(U){U===void 0&&(U=i.TEXTURE0+$-1),ut!==U&&(i.activeTexture(U),ut=U)}function _(U,pt,k){k===void 0&&(ut===null?k=i.TEXTURE0+$-1:k=ut);let j=_t[k];j===void 0&&(j={type:void 0,texture:void 0},_t[k]=j),(j.type!==U||j.texture!==pt)&&(ut!==k&&(i.activeTexture(k),ut=k),i.bindTexture(U,pt||Et[U]),j.type=U,j.texture=pt)}function F(){const U=_t[ut];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function q(){try{i.compressedTexImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function et(){try{i.compressedTexImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{i.texSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function At(){try{i.texSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{i.compressedTexSubImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ct(){try{i.texStorage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{i.texStorage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function lt(){try{i.texImage2D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function vt(){try{i.texImage3D(...arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Rt(U){Kt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Kt.copy(U))}function ft(U){Y.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Y.copy(U))}function Bt(U,pt){let k=l.get(pt);k===void 0&&(k=new WeakMap,l.set(pt,k));let j=k.get(U);j===void 0&&(j=i.getUniformBlockIndex(pt,U.name),k.set(U,j))}function Lt(U,pt){const j=l.get(pt).get(U);c.get(pt)!==j&&(i.uniformBlockBinding(pt,j,U.__bindingPointIndex),c.set(pt,j))}function Ft(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ut=null,_t={},h={},d=new WeakMap,m=[],g=null,v=!1,p=null,f=null,A=null,T=null,S=null,L=null,R=null,w=new qt(0,0,0),D=0,y=!1,x=null,C=null,z=null,O=null,W=null,Kt.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ct,disable:Pt,bindFramebuffer:Zt,drawBuffers:bt,useProgram:$t,setBlending:b,setMaterial:wt,setFlipSided:it,setCullFace:gt,setLineWidth:at,setPolygonOffset:It,setScissorTest:ht,activeTexture:E,bindTexture:_,unbindTexture:F,compressedTexImage2D:q,compressedTexImage3D:et,texImage2D:lt,texImage3D:vt,updateUBOMapping:Bt,uniformBlockBinding:Lt,texStorage2D:Ct,texStorage3D:J,texSubImage2D:Z,texSubImage3D:At,compressedTexSubImage2D:X,compressedTexSubImage3D:K,scissor:Rt,viewport:ft,reset:Ft}}function Lg(i,t,e,n,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ot,u=new WeakMap;let h;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,_){return m?new OffscreenCanvas(E,_):jr("canvas")}function v(E,_,F){let q=1;const et=ht(E);if((et.width>F||et.height>F)&&(q=F/Math.max(et.width,et.height)),q<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const Z=Math.floor(q*et.width),At=Math.floor(q*et.height);h===void 0&&(h=g(Z,At));const X=_?g(Z,At):h;return X.width=Z,X.height=At,X.getContext("2d").drawImage(E,0,0,Z,At),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+Z+"x"+At+")."),X}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),E;return E}function p(E){return E.generateMipmaps}function f(E){i.generateMipmap(E)}function A(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(E,_,F,q,et=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let Z=_;if(_===i.RED&&(F===i.FLOAT&&(Z=i.R32F),F===i.HALF_FLOAT&&(Z=i.R16F),F===i.UNSIGNED_BYTE&&(Z=i.R8)),_===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.R8UI),F===i.UNSIGNED_SHORT&&(Z=i.R16UI),F===i.UNSIGNED_INT&&(Z=i.R32UI),F===i.BYTE&&(Z=i.R8I),F===i.SHORT&&(Z=i.R16I),F===i.INT&&(Z=i.R32I)),_===i.RG&&(F===i.FLOAT&&(Z=i.RG32F),F===i.HALF_FLOAT&&(Z=i.RG16F),F===i.UNSIGNED_BYTE&&(Z=i.RG8)),_===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RG8UI),F===i.UNSIGNED_SHORT&&(Z=i.RG16UI),F===i.UNSIGNED_INT&&(Z=i.RG32UI),F===i.BYTE&&(Z=i.RG8I),F===i.SHORT&&(Z=i.RG16I),F===i.INT&&(Z=i.RG32I)),_===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),F===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),F===i.UNSIGNED_INT&&(Z=i.RGB32UI),F===i.BYTE&&(Z=i.RGB8I),F===i.SHORT&&(Z=i.RGB16I),F===i.INT&&(Z=i.RGB32I)),_===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),F===i.UNSIGNED_INT&&(Z=i.RGBA32UI),F===i.BYTE&&(Z=i.RGBA8I),F===i.SHORT&&(Z=i.RGBA16I),F===i.INT&&(Z=i.RGBA32I)),_===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),_===i.RGBA){const At=et?Jr:Qt.getTransfer(q);F===i.FLOAT&&(Z=i.RGBA32F),F===i.HALF_FLOAT&&(Z=i.RGBA16F),F===i.UNSIGNED_BYTE&&(Z=At===ie?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function S(E,_){let F;return E?_===null||_===Qn||_===Ui?F=i.DEPTH24_STENCIL8:_===_n?F=i.DEPTH32F_STENCIL8:_===rr&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Qn||_===Ui?F=i.DEPTH_COMPONENT24:_===_n?F=i.DEPTH_COMPONENT32F:_===rr&&(F=i.DEPTH_COMPONENT16),F}function L(E,_){return p(E)===!0||E.isFramebufferTexture&&E.minFilter!==en&&E.minFilter!==on?Math.log2(Math.max(_.width,_.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?_.mipmaps.length:1}function R(E){const _=E.target;_.removeEventListener("dispose",R),D(_),_.isVideoTexture&&u.delete(_)}function w(E){const _=E.target;_.removeEventListener("dispose",w),x(_)}function D(E){const _=n.get(E);if(_.__webglInit===void 0)return;const F=E.source,q=d.get(F);if(q){const et=q[_.__cacheKey];et.usedTimes--,et.usedTimes===0&&y(E),Object.keys(q).length===0&&d.delete(F)}n.remove(E)}function y(E){const _=n.get(E);i.deleteTexture(_.__webglTexture);const F=E.source,q=d.get(F);delete q[_.__cacheKey],o.memory.textures--}function x(E){const _=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let et=0;et<_.__webglFramebuffer[q].length;et++)i.deleteFramebuffer(_.__webglFramebuffer[q][et]);else i.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)i.deleteFramebuffer(_.__webglFramebuffer[q]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const F=E.textures;for(let q=0,et=F.length;q<et;q++){const Z=n.get(F[q]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(F[q])}n.remove(E)}let C=0;function z(){C=0}function O(){const E=C;return E>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+r.maxTextures),C+=1,E}function W(E){const _=[];return _.push(E.wrapS),_.push(E.wrapT),_.push(E.wrapR||0),_.push(E.magFilter),_.push(E.minFilter),_.push(E.anisotropy),_.push(E.internalFormat),_.push(E.format),_.push(E.type),_.push(E.generateMipmaps),_.push(E.premultiplyAlpha),_.push(E.flipY),_.push(E.unpackAlignment),_.push(E.colorSpace),_.join()}function $(E,_){const F=n.get(E);if(E.isVideoTexture&&at(E),E.isRenderTargetTexture===!1&&E.version>0&&F.__version!==E.version){const q=E.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(F,E,_);return}}e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+_)}function H(E,_){const F=n.get(E);if(E.version>0&&F.__version!==E.version){Y(F,E,_);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+_)}function Q(E,_){const F=n.get(E);if(E.version>0&&F.__version!==E.version){Y(F,E,_);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+_)}function V(E,_){const F=n.get(E);if(E.version>0&&F.__version!==E.version){st(F,E,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+_)}const ut={[ao]:i.REPEAT,[Kn]:i.CLAMP_TO_EDGE,[co]:i.MIRRORED_REPEAT},_t={[en]:i.NEAREST,[Eu]:i.NEAREST_MIPMAP_NEAREST,[dr]:i.NEAREST_MIPMAP_LINEAR,[on]:i.LINEAR,[hs]:i.LINEAR_MIPMAP_NEAREST,[jn]:i.LINEAR_MIPMAP_LINEAR},St={[wu]:i.NEVER,[Uu]:i.ALWAYS,[Ru]:i.LESS,[cl]:i.LEQUAL,[Cu]:i.EQUAL,[Du]:i.GEQUAL,[Pu]:i.GREATER,[Lu]:i.NOTEQUAL};function Nt(E,_){if(_.type===_n&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===on||_.magFilter===hs||_.magFilter===dr||_.magFilter===jn||_.minFilter===on||_.minFilter===hs||_.minFilter===dr||_.minFilter===jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,ut[_.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,ut[_.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,ut[_.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,_t[_.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,_t[_.minFilter]),_.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,St[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===en||_.minFilter!==dr&&_.minFilter!==jn||_.type===_n&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");i.texParameterf(E,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Kt(E,_){let F=!1;E.__webglInit===void 0&&(E.__webglInit=!0,_.addEventListener("dispose",R));const q=_.source;let et=d.get(q);et===void 0&&(et={},d.set(q,et));const Z=W(_);if(Z!==E.__cacheKey){et[Z]===void 0&&(et[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),et[Z].usedTimes++;const At=et[E.__cacheKey];At!==void 0&&(et[E.__cacheKey].usedTimes--,At.usedTimes===0&&y(_)),E.__cacheKey=Z,E.__webglTexture=et[Z].texture}return F}function Y(E,_,F){let q=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=i.TEXTURE_3D);const et=Kt(E,_),Z=_.source;e.bindTexture(q,E.__webglTexture,i.TEXTURE0+F);const At=n.get(Z);if(Z.version!==At.__version||et===!0){e.activeTexture(i.TEXTURE0+F);const X=Qt.getPrimaries(Qt.workingColorSpace),K=_.colorSpace===Cn?null:Qt.getPrimaries(_.colorSpace),Ct=_.colorSpace===Cn||X===K?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct);let J=v(_.image,!1,r.maxTextureSize);J=It(_,J);const lt=s.convert(_.format,_.colorSpace),vt=s.convert(_.type);let Rt=T(_.internalFormat,lt,vt,_.colorSpace,_.isVideoTexture);Nt(q,_);let ft;const Bt=_.mipmaps,Lt=_.isVideoTexture!==!0,Ft=At.__version===void 0||et===!0,U=Z.dataReady,pt=L(_,J);if(_.isDepthTexture)Rt=S(_.format===Ii,_.type),Ft&&(Lt?e.texStorage2D(i.TEXTURE_2D,1,Rt,J.width,J.height):e.texImage2D(i.TEXTURE_2D,0,Rt,J.width,J.height,0,lt,vt,null));else if(_.isDataTexture)if(Bt.length>0){Lt&&Ft&&e.texStorage2D(i.TEXTURE_2D,pt,Rt,Bt[0].width,Bt[0].height);for(let k=0,j=Bt.length;k<j;k++)ft=Bt[k],Lt?U&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,ft.width,ft.height,lt,vt,ft.data):e.texImage2D(i.TEXTURE_2D,k,Rt,ft.width,ft.height,0,lt,vt,ft.data);_.generateMipmaps=!1}else Lt?(Ft&&e.texStorage2D(i.TEXTURE_2D,pt,Rt,J.width,J.height),U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,J.width,J.height,lt,vt,J.data)):e.texImage2D(i.TEXTURE_2D,0,Rt,J.width,J.height,0,lt,vt,J.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Lt&&Ft&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Rt,Bt[0].width,Bt[0].height,J.depth);for(let k=0,j=Bt.length;k<j;k++)if(ft=Bt[k],_.format!==tn)if(lt!==null)if(Lt){if(U)if(_.layerUpdates.size>0){const Mt=sc(ft.width,ft.height,_.format,_.type);for(const xt of _.layerUpdates){const kt=ft.data.subarray(xt*Mt/ft.data.BYTES_PER_ELEMENT,(xt+1)*Mt/ft.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,xt,ft.width,ft.height,1,lt,kt)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,0,ft.width,ft.height,J.depth,lt,ft.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,k,Rt,ft.width,ft.height,J.depth,0,ft.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Lt?U&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,k,0,0,0,ft.width,ft.height,J.depth,lt,vt,ft.data):e.texImage3D(i.TEXTURE_2D_ARRAY,k,Rt,ft.width,ft.height,J.depth,0,lt,vt,ft.data)}else{Lt&&Ft&&e.texStorage2D(i.TEXTURE_2D,pt,Rt,Bt[0].width,Bt[0].height);for(let k=0,j=Bt.length;k<j;k++)ft=Bt[k],_.format!==tn?lt!==null?Lt?U&&e.compressedTexSubImage2D(i.TEXTURE_2D,k,0,0,ft.width,ft.height,lt,ft.data):e.compressedTexImage2D(i.TEXTURE_2D,k,Rt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Lt?U&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,ft.width,ft.height,lt,vt,ft.data):e.texImage2D(i.TEXTURE_2D,k,Rt,ft.width,ft.height,0,lt,vt,ft.data)}else if(_.isDataArrayTexture)if(Lt){if(Ft&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Rt,J.width,J.height,J.depth),U)if(_.layerUpdates.size>0){const k=sc(J.width,J.height,_.format,_.type);for(const j of _.layerUpdates){const Mt=J.data.subarray(j*k/J.data.BYTES_PER_ELEMENT,(j+1)*k/J.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,J.width,J.height,1,lt,vt,Mt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,lt,vt,J.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Rt,J.width,J.height,J.depth,0,lt,vt,J.data);else if(_.isData3DTexture)Lt?(Ft&&e.texStorage3D(i.TEXTURE_3D,pt,Rt,J.width,J.height,J.depth),U&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,lt,vt,J.data)):e.texImage3D(i.TEXTURE_3D,0,Rt,J.width,J.height,J.depth,0,lt,vt,J.data);else if(_.isFramebufferTexture){if(Ft)if(Lt)e.texStorage2D(i.TEXTURE_2D,pt,Rt,J.width,J.height);else{let k=J.width,j=J.height;for(let Mt=0;Mt<pt;Mt++)e.texImage2D(i.TEXTURE_2D,Mt,Rt,k,j,0,lt,vt,null),k>>=1,j>>=1}}else if(Bt.length>0){if(Lt&&Ft){const k=ht(Bt[0]);e.texStorage2D(i.TEXTURE_2D,pt,Rt,k.width,k.height)}for(let k=0,j=Bt.length;k<j;k++)ft=Bt[k],Lt?U&&e.texSubImage2D(i.TEXTURE_2D,k,0,0,lt,vt,ft):e.texImage2D(i.TEXTURE_2D,k,Rt,lt,vt,ft);_.generateMipmaps=!1}else if(Lt){if(Ft){const k=ht(J);e.texStorage2D(i.TEXTURE_2D,pt,Rt,k.width,k.height)}U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,lt,vt,J)}else e.texImage2D(i.TEXTURE_2D,0,Rt,lt,vt,J);p(_)&&f(q),At.__version=Z.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function st(E,_,F){if(_.image.length!==6)return;const q=Kt(E,_),et=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+F);const Z=n.get(et);if(et.version!==Z.__version||q===!0){e.activeTexture(i.TEXTURE0+F);const At=Qt.getPrimaries(Qt.workingColorSpace),X=_.colorSpace===Cn?null:Qt.getPrimaries(_.colorSpace),K=_.colorSpace===Cn||At===X?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);const Ct=_.isCompressedTexture||_.image[0].isCompressedTexture,J=_.image[0]&&_.image[0].isDataTexture,lt=[];for(let j=0;j<6;j++)!Ct&&!J?lt[j]=v(_.image[j],!0,r.maxCubemapSize):lt[j]=J?_.image[j].image:_.image[j],lt[j]=It(_,lt[j]);const vt=lt[0],Rt=s.convert(_.format,_.colorSpace),ft=s.convert(_.type),Bt=T(_.internalFormat,Rt,ft,_.colorSpace),Lt=_.isVideoTexture!==!0,Ft=Z.__version===void 0||q===!0,U=et.dataReady;let pt=L(_,vt);Nt(i.TEXTURE_CUBE_MAP,_);let k;if(Ct){Lt&&Ft&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Bt,vt.width,vt.height);for(let j=0;j<6;j++){k=lt[j].mipmaps;for(let Mt=0;Mt<k.length;Mt++){const xt=k[Mt];_.format!==tn?Rt!==null?Lt?U&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt,0,0,xt.width,xt.height,Rt,xt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt,Bt,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Lt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt,0,0,xt.width,xt.height,Rt,ft,xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt,Bt,xt.width,xt.height,0,Rt,ft,xt.data)}}}else{if(k=_.mipmaps,Lt&&Ft){k.length>0&&pt++;const j=ht(lt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Bt,j.width,j.height)}for(let j=0;j<6;j++)if(J){Lt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,lt[j].width,lt[j].height,Rt,ft,lt[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Bt,lt[j].width,lt[j].height,0,Rt,ft,lt[j].data);for(let Mt=0;Mt<k.length;Mt++){const kt=k[Mt].image[j].image;Lt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt+1,0,0,kt.width,kt.height,Rt,ft,kt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt+1,Bt,kt.width,kt.height,0,Rt,ft,kt.data)}}else{Lt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Rt,ft,lt[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Bt,Rt,ft,lt[j]);for(let Mt=0;Mt<k.length;Mt++){const xt=k[Mt];Lt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt+1,0,0,Rt,ft,xt.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Mt+1,Bt,Rt,ft,xt.image[j])}}}p(_)&&f(i.TEXTURE_CUBE_MAP),Z.__version=et.version,_.onUpdate&&_.onUpdate(_)}E.__version=_.version}function Et(E,_,F,q,et,Z){const At=s.convert(F.format,F.colorSpace),X=s.convert(F.type),K=T(F.internalFormat,At,X,F.colorSpace),Ct=n.get(_),J=n.get(F);if(J.__renderTarget=_,!Ct.__hasExternalTextures){const lt=Math.max(1,_.width>>Z),vt=Math.max(1,_.height>>Z);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,Z,K,lt,vt,_.depth,0,At,X,null):e.texImage2D(et,Z,K,lt,vt,0,At,X,null)}e.bindFramebuffer(i.FRAMEBUFFER,E),gt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,et,J.__webglTexture,0,it(_)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,et,J.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ct(E,_,F){if(i.bindRenderbuffer(i.RENDERBUFFER,E),_.depthBuffer){const q=_.depthTexture,et=q&&q.isDepthTexture?q.type:null,Z=S(_.stencilBuffer,et),At=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=it(_);gt(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,X,Z,_.width,_.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,X,Z,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Z,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,At,i.RENDERBUFFER,E)}else{const q=_.textures;for(let et=0;et<q.length;et++){const Z=q[et],At=s.convert(Z.format,Z.colorSpace),X=s.convert(Z.type),K=T(Z.internalFormat,At,X,Z.colorSpace),Ct=it(_);F&&gt(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,K,_.width,_.height):gt(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ct,K,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,K,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pt(E,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,E),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(_.depthTexture);q.__renderTarget=_,(!q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),$(_.depthTexture,0);const et=q.__webglTexture,Z=it(_);if(_.depthTexture.format===wi)gt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(_.depthTexture.format===Ii)gt(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Zt(E){const _=n.get(E),F=E.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==E.depthTexture){const q=E.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){const et=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",et)};q.addEventListener("dispose",et),_.__depthDisposeCallback=et}_.__boundDepthTexture=q}if(E.depthTexture&&!_.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Pt(_.__webglFramebuffer,E)}else if(F){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=i.createRenderbuffer(),ct(_.__webglDepthbuffer[q],E,!1);else{const et=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=_.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,Z)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),ct(_.__webglDepthbuffer,E,!1);else{const q=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,et)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function bt(E,_,F){const q=n.get(E);_!==void 0&&Et(q.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Zt(E)}function $t(E){const _=E.texture,F=n.get(E),q=n.get(_);E.addEventListener("dispose",w);const et=E.textures,Z=E.isWebGLCubeRenderTarget===!0,At=et.length>1;if(At||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=_.version,o.memory.textures++),Z){F.__webglFramebuffer=[];for(let X=0;X<6;X++)if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer[X]=[];for(let K=0;K<_.mipmaps.length;K++)F.__webglFramebuffer[X][K]=i.createFramebuffer()}else F.__webglFramebuffer[X]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer=[];for(let X=0;X<_.mipmaps.length;X++)F.__webglFramebuffer[X]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(At)for(let X=0,K=et.length;X<K;X++){const Ct=n.get(et[X]);Ct.__webglTexture===void 0&&(Ct.__webglTexture=i.createTexture(),o.memory.textures++)}if(E.samples>0&&gt(E)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let X=0;X<et.length;X++){const K=et[X];F.__webglColorRenderbuffer[X]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[X]);const Ct=s.convert(K.format,K.colorSpace),J=s.convert(K.type),lt=T(K.internalFormat,Ct,J,K.colorSpace,E.isXRRenderTarget===!0),vt=it(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,vt,lt,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.RENDERBUFFER,F.__webglColorRenderbuffer[X])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),ct(F.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,_);for(let X=0;X<6;X++)if(_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Et(F.__webglFramebuffer[X][K],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,K);else Et(F.__webglFramebuffer[X],E,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);p(_)&&f(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(At){for(let X=0,K=et.length;X<K;X++){const Ct=et[X],J=n.get(Ct);e.bindTexture(i.TEXTURE_2D,J.__webglTexture),Nt(i.TEXTURE_2D,Ct),Et(F.__webglFramebuffer,E,Ct,i.COLOR_ATTACHMENT0+X,i.TEXTURE_2D,0),p(Ct)&&f(i.TEXTURE_2D)}e.unbindTexture()}else{let X=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(X=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(X,q.__webglTexture),Nt(X,_),_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Et(F.__webglFramebuffer[K],E,_,i.COLOR_ATTACHMENT0,X,K);else Et(F.__webglFramebuffer,E,_,i.COLOR_ATTACHMENT0,X,0);p(_)&&f(X),e.unbindTexture()}E.depthBuffer&&Zt(E)}function nt(E){const _=E.textures;for(let F=0,q=_.length;F<q;F++){const et=_[F];if(p(et)){const Z=A(E),At=n.get(et).__webglTexture;e.bindTexture(Z,At),f(Z),e.unbindTexture()}}}const tt=[],b=[];function wt(E){if(E.samples>0){if(gt(E)===!1){const _=E.textures,F=E.width,q=E.height;let et=i.COLOR_BUFFER_BIT;const Z=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,At=n.get(E),X=_.length>1;if(X)for(let K=0;K<_.length;K++)e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,At.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglFramebuffer);for(let K=0;K<_.length;K++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),X){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,At.__webglColorRenderbuffer[K]);const Ct=n.get(_[K]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ct,0)}i.blitFramebuffer(0,0,F,q,0,0,F,q,et,i.NEAREST),c===!0&&(tt.length=0,b.length=0,tt.push(i.COLOR_ATTACHMENT0+K),E.depthBuffer&&E.resolveDepthBuffer===!1&&(tt.push(Z),b.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,b)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,tt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),X)for(let K=0;K<_.length;K++){e.bindFramebuffer(i.FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,At.__webglColorRenderbuffer[K]);const Ct=n.get(_[K]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,At.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.TEXTURE_2D,Ct,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,At.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&c){const _=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function it(E){return Math.min(r.maxSamples,E.samples)}function gt(E){const _=n.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function at(E){const _=o.render.frame;u.get(E)!==_&&(u.set(E,_),E.update())}function It(E,_){const F=E.colorSpace,q=E.format,et=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||F!==Ni&&F!==Cn&&(Qt.getTransfer(F)===ie?(q!==tn||et!==Sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),_}function ht(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(l.width=E.naturalWidth||E.width,l.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(l.width=E.displayWidth,l.height=E.displayHeight):(l.width=E.width,l.height=E.height),l}this.allocateTextureUnit=O,this.resetTextureUnits=z,this.setTexture2D=$,this.setTexture2DArray=H,this.setTexture3D=Q,this.setTextureCube=V,this.rebindTextures=bt,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=nt,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=Zt,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=gt}function Dg(i,t){function e(n,r=Cn){let s;const o=Qt.getTransfer(r);if(n===Sn)return i.UNSIGNED_BYTE;if(n===qo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Yo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Qc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Kc)return i.BYTE;if(n===jc)return i.SHORT;if(n===rr)return i.UNSIGNED_SHORT;if(n===Xo)return i.INT;if(n===Qn)return i.UNSIGNED_INT;if(n===_n)return i.FLOAT;if(n===lr)return i.HALF_FLOAT;if(n===tl)return i.ALPHA;if(n===el)return i.RGB;if(n===tn)return i.RGBA;if(n===nl)return i.LUMINANCE;if(n===il)return i.LUMINANCE_ALPHA;if(n===wi)return i.DEPTH_COMPONENT;if(n===Ii)return i.DEPTH_STENCIL;if(n===rl)return i.RED;if(n===Zo)return i.RED_INTEGER;if(n===sl)return i.RG;if(n===$o)return i.RG_INTEGER;if(n===Jo)return i.RGBA_INTEGER;if(n===Wr||n===Xr||n===qr||n===Yr)if(o===ie)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Wr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Xr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===qr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Yr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Wr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Xr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===qr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Yr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===lo||n===uo||n===ho||n===fo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===lo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===uo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ho)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===fo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===po||n===mo||n===go)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===po||n===mo)return o===ie?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===go)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===_o||n===vo||n===xo||n===Mo||n===So||n===yo||n===Eo||n===To||n===bo||n===Ao||n===wo||n===Ro||n===Co||n===Po)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===_o)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===vo)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===xo)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Mo)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===So)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===yo)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Eo)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===To)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===bo)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ao)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wo)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ro)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Co)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Po)return o===ie?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Zr||n===Lo||n===Do)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Zr)return o===ie?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Lo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Do)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ol||n===Uo||n===Io||n===No)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Zr)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Uo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Io)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===No)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ui?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Ug=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ig=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Ng{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const r=new De,s=t.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Nn({vertexShader:Ug,fragmentShader:Ig,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ot(new Fn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fg extends zi{constructor(t,e){super();const n=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,m=null,g=null;const v=new Ng,p=e.getContextAttributes();let f=null,A=null;const T=[],S=[],L=new ot;let R=null;const w=new ze;w.viewport=new se;const D=new ze;D.viewport=new se;const y=[w,D],x=new tf;let C=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let st=T[Y];return st===void 0&&(st=new Us,T[Y]=st),st.getTargetRaySpace()},this.getControllerGrip=function(Y){let st=T[Y];return st===void 0&&(st=new Us,T[Y]=st),st.getGripSpace()},this.getHand=function(Y){let st=T[Y];return st===void 0&&(st=new Us,T[Y]=st),st.getHandSpace()};function O(Y){const st=S.indexOf(Y.inputSource);if(st===-1)return;const Et=T[st];Et!==void 0&&(Et.update(Y.inputSource,Y.frame,l||o),Et.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",W),r.removeEventListener("inputsourceschange",$);for(let Y=0;Y<T.length;Y++){const st=S[Y];st!==null&&(S[Y]=null,T[Y].disconnect(st))}C=null,z=null,v.reset(),t.setRenderTarget(f),m=null,d=null,h=null,r=null,A=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Y){l=Y},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(f=t.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",W),r.addEventListener("inputsourceschange",$),p.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(L),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let Et=null,ct=null,Pt=null;p.depth&&(Pt=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Et=p.stencil?Ii:wi,ct=p.stencil?Ui:Qn);const Zt={colorFormat:e.RGBA8,depthFormat:Pt,scaleFactor:s};h=new XRWebGLBinding(r,e),d=h.createProjectionLayer(Zt),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),A=new ti(d.textureWidth,d.textureHeight,{format:tn,type:Sn,depthTexture:new Ml(d.textureWidth,d.textureHeight,ct,void 0,void 0,void 0,void 0,void 0,void 0,Et),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Et={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,e,Et),r.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),A=new ti(m.framebufferWidth,m.framebufferHeight,{format:tn,type:Sn,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),Kt.setContext(r),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function $(Y){for(let st=0;st<Y.removed.length;st++){const Et=Y.removed[st],ct=S.indexOf(Et);ct>=0&&(S[ct]=null,T[ct].disconnect(Et))}for(let st=0;st<Y.added.length;st++){const Et=Y.added[st];let ct=S.indexOf(Et);if(ct===-1){for(let Zt=0;Zt<T.length;Zt++)if(Zt>=S.length){S.push(Et),ct=Zt;break}else if(S[Zt]===null){S[Zt]=Et,ct=Zt;break}if(ct===-1)break}const Pt=T[ct];Pt&&Pt.connect(Et)}}const H=new P,Q=new P;function V(Y,st,Et){H.setFromMatrixPosition(st.matrixWorld),Q.setFromMatrixPosition(Et.matrixWorld);const ct=H.distanceTo(Q),Pt=st.projectionMatrix.elements,Zt=Et.projectionMatrix.elements,bt=Pt[14]/(Pt[10]-1),$t=Pt[14]/(Pt[10]+1),nt=(Pt[9]+1)/Pt[5],tt=(Pt[9]-1)/Pt[5],b=(Pt[8]-1)/Pt[0],wt=(Zt[8]+1)/Zt[0],it=bt*b,gt=bt*wt,at=ct/(-b+wt),It=at*-b;if(st.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(It),Y.translateZ(at),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Pt[10]===-1)Y.projectionMatrix.copy(st.projectionMatrix),Y.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const ht=bt+at,E=$t+at,_=it-It,F=gt+(ct-It),q=nt*$t/E*ht,et=tt*$t/E*ht;Y.projectionMatrix.makePerspective(_,F,q,et,ht,E),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ut(Y,st){st===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(st.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let st=Y.near,Et=Y.far;v.texture!==null&&(v.depthNear>0&&(st=v.depthNear),v.depthFar>0&&(Et=v.depthFar)),x.near=D.near=w.near=st,x.far=D.far=w.far=Et,(C!==x.near||z!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),C=x.near,z=x.far),w.layers.mask=Y.layers.mask|2,D.layers.mask=Y.layers.mask|4,x.layers.mask=w.layers.mask|D.layers.mask;const ct=Y.parent,Pt=x.cameras;ut(x,ct);for(let Zt=0;Zt<Pt.length;Zt++)ut(Pt[Zt],ct);Pt.length===2?V(x,w,D):x.projectionMatrix.copy(w.projectionMatrix),_t(Y,x,ct)};function _t(Y,st,Et){Et===null?Y.matrix.copy(st.matrixWorld):(Y.matrix.copy(Et.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(st.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(st.projectionMatrix),Y.projectionMatrixInverse.copy(st.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Oo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&m===null))return c},this.setFoveation=function(Y){c=Y,d!==null&&(d.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(x)};let St=null;function Nt(Y,st){if(u=st.getViewerPose(l||o),g=st,u!==null){const Et=u.views;m!==null&&(t.setRenderTargetFramebuffer(A,m.framebuffer),t.setRenderTarget(A));let ct=!1;Et.length!==x.cameras.length&&(x.cameras.length=0,ct=!0);for(let bt=0;bt<Et.length;bt++){const $t=Et[bt];let nt=null;if(m!==null)nt=m.getViewport($t);else{const b=h.getViewSubImage(d,$t);nt=b.viewport,bt===0&&(t.setRenderTargetTextures(A,b.colorTexture,d.ignoreDepthValues?void 0:b.depthStencilTexture),t.setRenderTarget(A))}let tt=y[bt];tt===void 0&&(tt=new ze,tt.layers.enable(bt),tt.viewport=new se,y[bt]=tt),tt.matrix.fromArray($t.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray($t.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(nt.x,nt.y,nt.width,nt.height),bt===0&&(x.matrix.copy(tt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),ct===!0&&x.cameras.push(tt)}const Pt=r.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&h){const bt=h.getDepthInformation(Et[0]);bt&&bt.isValid&&bt.texture&&v.init(t,bt,r.renderState)}}for(let Et=0;Et<T.length;Et++){const ct=S[Et],Pt=T[Et];ct!==null&&Pt!==void 0&&Pt.update(ct,st,l||o)}St&&St(Y,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),g=null}const Kt=new Pl;Kt.setAnimationLoop(Nt),this.setAnimationLoop=function(Y){St=Y},this.dispose=function(){}}}const Wn=new Xe,Og=new oe;function Bg(i,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,ml(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function r(p,f,A,T,S){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(p,f):f.isMeshToonMaterial?(s(p,f),h(p,f)):f.isMeshPhongMaterial?(s(p,f),u(p,f)):f.isMeshStandardMaterial?(s(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,S)):f.isMeshMatcapMaterial?(s(p,f),g(p,f)):f.isMeshDepthMaterial?s(p,f):f.isMeshDistanceMaterial?(s(p,f),v(p,f)):f.isMeshNormalMaterial?s(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?c(p,f,A,T):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Le&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Le&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const A=t.get(f),T=A.envMap,S=A.envMapRotation;T&&(p.envMap.value=T,Wn.copy(S),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),p.envMapRotation.value.setFromMatrix4(Og.makeRotationFromEuler(Wn)),p.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,A,T){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*A,p.scale.value=T*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function u(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function h(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,A){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Le&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function v(p,f){const A=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function zg(i,t,e,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,T){const S=T.program;n.uniformBlockBinding(A,S)}function l(A,T){let S=r[A.id];S===void 0&&(g(A),S=u(A),r[A.id]=S,A.addEventListener("dispose",p));const L=T.program;n.updateUBOMapping(A,L);const R=t.render.frame;s[A.id]!==R&&(d(A),s[A.id]=R)}function u(A){const T=h();A.__bindingPointIndex=T;const S=i.createBuffer(),L=A.__size,R=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,L,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,S),S}function h(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(A){const T=r[A.id],S=A.uniforms,L=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let R=0,w=S.length;R<w;R++){const D=Array.isArray(S[R])?S[R]:[S[R]];for(let y=0,x=D.length;y<x;y++){const C=D[y];if(m(C,R,y,L)===!0){const z=C.__offset,O=Array.isArray(C.value)?C.value:[C.value];let W=0;for(let $=0;$<O.length;$++){const H=O[$],Q=v(H);typeof H=="number"||typeof H=="boolean"?(C.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,z+W,C.__data)):H.isMatrix3?(C.__data[0]=H.elements[0],C.__data[1]=H.elements[1],C.__data[2]=H.elements[2],C.__data[3]=0,C.__data[4]=H.elements[3],C.__data[5]=H.elements[4],C.__data[6]=H.elements[5],C.__data[7]=0,C.__data[8]=H.elements[6],C.__data[9]=H.elements[7],C.__data[10]=H.elements[8],C.__data[11]=0):(H.toArray(C.__data,W),W+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(A,T,S,L){const R=A.value,w=T+"_"+S;if(L[w]===void 0)return typeof R=="number"||typeof R=="boolean"?L[w]=R:L[w]=R.clone(),!0;{const D=L[w];if(typeof R=="number"||typeof R=="boolean"){if(D!==R)return L[w]=R,!0}else if(D.equals(R)===!1)return D.copy(R),!0}return!1}function g(A){const T=A.uniforms;let S=0;const L=16;for(let w=0,D=T.length;w<D;w++){const y=Array.isArray(T[w])?T[w]:[T[w]];for(let x=0,C=y.length;x<C;x++){const z=y[x],O=Array.isArray(z.value)?z.value:[z.value];for(let W=0,$=O.length;W<$;W++){const H=O[W],Q=v(H),V=S%L,ut=V%Q.boundary,_t=V+ut;S+=ut,_t!==0&&L-_t<Q.storage&&(S+=L-_t),z.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=S,S+=Q.storage}}}const R=S%L;return R>0&&(S+=L-R),A.__size=S,A.__cache={},this}function v(A){const T={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(T.boundary=4,T.storage=4):A.isVector2?(T.boundary=8,T.storage=8):A.isVector3||A.isColor?(T.boundary=16,T.storage=12):A.isVector4?(T.boundary=16,T.storage=16):A.isMatrix3?(T.boundary=48,T.storage=48):A.isMatrix4?(T.boundary=64,T.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),T}function p(A){const T=A.target;T.removeEventListener("dispose",p);const S=o.indexOf(T.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(r[T.id]),delete r[T.id],delete s[T.id]}function f(){for(const A in r)i.deleteBuffer(r[A]);o=[],r={},s={}}return{bind:c,update:l,dispose:f}}class Gg{constructor(t={}){const{canvas:e=Nu(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;const g=new Uint32Array(4),v=new Int32Array(4);let p=null,f=null;const A=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Pe,this.toneMapping=Ln,this.toneMappingExposure=1;const S=this;let L=!1,R=0,w=0,D=null,y=-1,x=null;const C=new se,z=new se;let O=null;const W=new qt(0);let $=0,H=e.width,Q=e.height,V=1,ut=null,_t=null;const St=new se(0,0,H,Q),Nt=new se(0,0,H,Q);let Kt=!1;const Y=new ta;let st=!1,Et=!1;this.transmissionResolutionScale=1;const ct=new oe,Pt=new oe,Zt=new P,bt=new se,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function tt(){return D===null?V:1}let b=n;function wt(M,I){return e.getContext(M,I)}try{const M={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Wo}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",xt,!1),b===null){const I="webgl2";if(b=wt(I,M),b===null)throw wt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let it,gt,at,It,ht,E,_,F,q,et,Z,At,X,K,Ct,J,lt,vt,Rt,ft,Bt,Lt,Ft,U;function pt(){it=new Jp(b),it.init(),Lt=new Dg(b,it),gt=new Hp(b,it,t,Lt),at=new Pg(b,it),gt.reverseDepthBuffer&&d&&at.buffers.depth.setReversed(!0),It=new Qp(b),ht=new _g,E=new Lg(b,it,at,ht,gt,Lt,It),_=new Xp(S),F=new $p(S),q=new sf(b),Ft=new Vp(b,q),et=new Kp(b,q,It,Ft),Z=new em(b,et,q,It),Rt=new tm(b,gt,E),J=new Wp(ht),At=new gg(S,_,F,it,gt,Ft,J),X=new Bg(S,ht),K=new xg,Ct=new bg(it),vt=new Gp(S,_,F,at,Z,m,c),lt=new Rg(S,Z,gt),U=new zg(b,It,gt,at),ft=new kp(b,it,It),Bt=new jp(b,it,It),It.programs=At.programs,S.capabilities=gt,S.extensions=it,S.properties=ht,S.renderLists=K,S.shadowMap=lt,S.state=at,S.info=It}pt();const k=new Fg(S,b);this.xr=k,this.getContext=function(){return b},this.getContextAttributes=function(){return b.getContextAttributes()},this.forceContextLoss=function(){const M=it.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=it.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(M){M!==void 0&&(V=M,this.setSize(H,Q,!1))},this.getSize=function(M){return M.set(H,Q)},this.setSize=function(M,I,B=!0){if(k.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=M,Q=I,e.width=Math.floor(M*V),e.height=Math.floor(I*V),B===!0&&(e.style.width=M+"px",e.style.height=I+"px"),this.setViewport(0,0,M,I)},this.getDrawingBufferSize=function(M){return M.set(H*V,Q*V).floor()},this.setDrawingBufferSize=function(M,I,B){H=M,Q=I,V=B,e.width=Math.floor(M*B),e.height=Math.floor(I*B),this.setViewport(0,0,M,I)},this.getCurrentViewport=function(M){return M.copy(C)},this.getViewport=function(M){return M.copy(St)},this.setViewport=function(M,I,B,G){M.isVector4?St.set(M.x,M.y,M.z,M.w):St.set(M,I,B,G),at.viewport(C.copy(St).multiplyScalar(V).round())},this.getScissor=function(M){return M.copy(Nt)},this.setScissor=function(M,I,B,G){M.isVector4?Nt.set(M.x,M.y,M.z,M.w):Nt.set(M,I,B,G),at.scissor(z.copy(Nt).multiplyScalar(V).round())},this.getScissorTest=function(){return Kt},this.setScissorTest=function(M){at.setScissorTest(Kt=M)},this.setOpaqueSort=function(M){ut=M},this.setTransparentSort=function(M){_t=M},this.getClearColor=function(M){return M.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor(...arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha(...arguments)},this.clear=function(M=!0,I=!0,B=!0){let G=0;if(M){let N=!1;if(D!==null){const rt=D.texture.format;N=rt===Jo||rt===$o||rt===Zo}if(N){const rt=D.texture.type,mt=rt===Sn||rt===Qn||rt===rr||rt===Ui||rt===qo||rt===Yo,yt=vt.getClearColor(),Tt=vt.getClearAlpha(),zt=yt.r,Gt=yt.g,Dt=yt.b;mt?(g[0]=zt,g[1]=Gt,g[2]=Dt,g[3]=Tt,b.clearBufferuiv(b.COLOR,0,g)):(v[0]=zt,v[1]=Gt,v[2]=Dt,v[3]=Tt,b.clearBufferiv(b.COLOR,0,v))}else G|=b.COLOR_BUFFER_BIT}I&&(G|=b.DEPTH_BUFFER_BIT),B&&(G|=b.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),b.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",xt,!1),vt.dispose(),K.dispose(),Ct.dispose(),ht.dispose(),_.dispose(),F.dispose(),Z.dispose(),Ft.dispose(),U.dispose(),At.dispose(),k.dispose(),k.removeEventListener("sessionstart",ga),k.removeEventListener("sessionend",_a),On.stop()};function j(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const M=It.autoReset,I=lt.enabled,B=lt.autoUpdate,G=lt.needsUpdate,N=lt.type;pt(),It.autoReset=M,lt.enabled=I,lt.autoUpdate=B,lt.needsUpdate=G,lt.type=N}function xt(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function kt(M){const I=M.target;I.removeEventListener("dispose",kt),ue(I)}function ue(M){Ee(M),ht.remove(M)}function Ee(M){const I=ht.get(M).programs;I!==void 0&&(I.forEach(function(B){At.releaseProgram(B)}),M.isShaderMaterial&&At.releaseShaderCache(M))}this.renderBufferDirect=function(M,I,B,G,N,rt){I===null&&(I=$t);const mt=N.isMesh&&N.matrixWorld.determinant()<0,yt=Hl(M,I,B,G,N);at.setMaterial(G,mt);let Tt=B.index,zt=1;if(G.wireframe===!0){if(Tt=et.getWireframeAttribute(B),Tt===void 0)return;zt=2}const Gt=B.drawRange,Dt=B.attributes.position;let Jt=Gt.start*zt,te=(Gt.start+Gt.count)*zt;rt!==null&&(Jt=Math.max(Jt,rt.start*zt),te=Math.min(te,(rt.start+rt.count)*zt)),Tt!==null?(Jt=Math.max(Jt,0),te=Math.min(te,Tt.count)):Dt!=null&&(Jt=Math.max(Jt,0),te=Math.min(te,Dt.count));const de=te-Jt;if(de<0||de===1/0)return;Ft.setup(N,G,yt,B,Tt);let he,jt=ft;if(Tt!==null&&(he=q.get(Tt),jt=Bt,jt.setIndex(he)),N.isMesh)G.wireframe===!0?(at.setLineWidth(G.wireframeLinewidth*tt()),jt.setMode(b.LINES)):jt.setMode(b.TRIANGLES);else if(N.isLine){let Ut=G.linewidth;Ut===void 0&&(Ut=1),at.setLineWidth(Ut*tt()),N.isLineSegments?jt.setMode(b.LINES):N.isLineLoop?jt.setMode(b.LINE_LOOP):jt.setMode(b.LINE_STRIP)}else N.isPoints?jt.setMode(b.POINTS):N.isSprite&&jt.setMode(b.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)qn("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),jt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(it.get("WEBGL_multi_draw"))jt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Ut=N._multiDrawStarts,Se=N._multiDrawCounts,ee=N._multiDrawCount,Ze=Tt?q.get(Tt).bytesPerElement:1,si=ht.get(G).currentProgram.getUniforms();for(let Ne=0;Ne<ee;Ne++)si.setValue(b,"_gl_DrawID",Ne),jt.render(Ut[Ne]/Ze,Se[Ne])}else if(N.isInstancedMesh)jt.renderInstances(Jt,de,N.count);else if(B.isInstancedBufferGeometry){const Ut=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Se=Math.min(B.instanceCount,Ut);jt.renderInstances(Jt,de,Se)}else jt.render(Jt,de)};function ne(M,I,B){M.transparent===!0&&M.side===Qe&&M.forceSinglePass===!1?(M.side=Le,M.needsUpdate=!0,fr(M,I,B),M.side=In,M.needsUpdate=!0,fr(M,I,B),M.side=Qe):fr(M,I,B)}this.compile=function(M,I,B=null){B===null&&(B=M),f=Ct.get(B),f.init(I),T.push(f),B.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),M!==B&&M.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const G=new Set;return M.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const rt=N.material;if(rt)if(Array.isArray(rt))for(let mt=0;mt<rt.length;mt++){const yt=rt[mt];ne(yt,B,N),G.add(yt)}else ne(rt,B,N),G.add(rt)}),f=T.pop(),G},this.compileAsync=function(M,I,B=null){const G=this.compile(M,I,B);return new Promise(N=>{function rt(){if(G.forEach(function(mt){ht.get(mt).currentProgram.isReady()&&G.delete(mt)}),G.size===0){N(M);return}setTimeout(rt,10)}it.get("KHR_parallel_shader_compile")!==null?rt():setTimeout(rt,10)})};let Ye=null;function un(M){Ye&&Ye(M)}function ga(){On.stop()}function _a(){On.start()}const On=new Pl;On.setAnimationLoop(un),typeof self<"u"&&On.setContext(self),this.setAnimationLoop=function(M){Ye=M,k.setAnimationLoop(M),M===null?On.stop():On.start()},k.addEventListener("sessionstart",ga),k.addEventListener("sessionend",_a),this.render=function(M,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),k.enabled===!0&&k.isPresenting===!0&&(k.cameraAutoUpdate===!0&&k.updateCamera(I),I=k.getCamera()),M.isScene===!0&&M.onBeforeRender(S,M,I,D),f=Ct.get(M,T.length),f.init(I),T.push(f),Pt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Y.setFromProjectionMatrix(Pt),Et=this.localClippingEnabled,st=J.init(this.clippingPlanes,Et),p=K.get(M,A.length),p.init(),A.push(p),k.enabled===!0&&k.isPresenting===!0){const rt=S.xr.getDepthSensingMesh();rt!==null&&ls(rt,I,-1/0,S.sortObjects)}ls(M,I,0,S.sortObjects),p.finish(),S.sortObjects===!0&&p.sort(ut,_t),nt=k.enabled===!1||k.isPresenting===!1||k.hasDepthSensing()===!1,nt&&vt.addToRenderList(p,M),this.info.render.frame++,st===!0&&J.beginShadows();const B=f.state.shadowsArray;lt.render(B,M,I),st===!0&&J.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=p.opaque,N=p.transmissive;if(f.setupLights(),I.isArrayCamera){const rt=I.cameras;if(N.length>0)for(let mt=0,yt=rt.length;mt<yt;mt++){const Tt=rt[mt];xa(G,N,M,Tt)}nt&&vt.render(M);for(let mt=0,yt=rt.length;mt<yt;mt++){const Tt=rt[mt];va(p,M,Tt,Tt.viewport)}}else N.length>0&&xa(G,N,M,I),nt&&vt.render(M),va(p,M,I);D!==null&&w===0&&(E.updateMultisampleRenderTarget(D),E.updateRenderTargetMipmap(D)),M.isScene===!0&&M.onAfterRender(S,M,I),Ft.resetDefaultState(),y=-1,x=null,T.pop(),T.length>0?(f=T[T.length-1],st===!0&&J.setGlobalState(S.clippingPlanes,f.state.camera)):f=null,A.pop(),A.length>0?p=A[A.length-1]:p=null};function ls(M,I,B,G){if(M.visible===!1)return;if(M.layers.test(I.layers)){if(M.isGroup)B=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(I);else if(M.isLight)f.pushLight(M),M.castShadow&&f.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Y.intersectsSprite(M)){G&&bt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Pt);const mt=Z.update(M),yt=M.material;yt.visible&&p.push(M,mt,yt,B,bt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Y.intersectsObject(M))){const mt=Z.update(M),yt=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),bt.copy(M.boundingSphere.center)):(mt.boundingSphere===null&&mt.computeBoundingSphere(),bt.copy(mt.boundingSphere.center)),bt.applyMatrix4(M.matrixWorld).applyMatrix4(Pt)),Array.isArray(yt)){const Tt=mt.groups;for(let zt=0,Gt=Tt.length;zt<Gt;zt++){const Dt=Tt[zt],Jt=yt[Dt.materialIndex];Jt&&Jt.visible&&p.push(M,mt,Jt,B,bt.z,Dt)}}else yt.visible&&p.push(M,mt,yt,B,bt.z,null)}}const rt=M.children;for(let mt=0,yt=rt.length;mt<yt;mt++)ls(rt[mt],I,B,G)}function va(M,I,B,G){const N=M.opaque,rt=M.transmissive,mt=M.transparent;f.setupLightsView(B),st===!0&&J.setGlobalState(S.clippingPlanes,B),G&&at.viewport(C.copy(G)),N.length>0&&hr(N,I,B),rt.length>0&&hr(rt,I,B),mt.length>0&&hr(mt,I,B),at.buffers.depth.setTest(!0),at.buffers.depth.setMask(!0),at.buffers.color.setMask(!0),at.setPolygonOffset(!1)}function xa(M,I,B,G){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[G.id]===void 0&&(f.state.transmissionRenderTarget[G.id]=new ti(1,1,{generateMipmaps:!0,type:it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float")?lr:Sn,minFilter:jn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace}));const rt=f.state.transmissionRenderTarget[G.id],mt=G.viewport||C;rt.setSize(mt.z*S.transmissionResolutionScale,mt.w*S.transmissionResolutionScale);const yt=S.getRenderTarget();S.setRenderTarget(rt),S.getClearColor(W),$=S.getClearAlpha(),$<1&&S.setClearColor(16777215,.5),S.clear(),nt&&vt.render(B);const Tt=S.toneMapping;S.toneMapping=Ln;const zt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),f.setupLightsView(G),st===!0&&J.setGlobalState(S.clippingPlanes,G),hr(M,B,G),E.updateMultisampleRenderTarget(rt),E.updateRenderTargetMipmap(rt),it.has("WEBGL_multisampled_render_to_texture")===!1){let Gt=!1;for(let Dt=0,Jt=I.length;Dt<Jt;Dt++){const te=I[Dt],de=te.object,he=te.geometry,jt=te.material,Ut=te.group;if(jt.side===Qe&&de.layers.test(G.layers)){const Se=jt.side;jt.side=Le,jt.needsUpdate=!0,Ma(de,B,G,he,jt,Ut),jt.side=Se,jt.needsUpdate=!0,Gt=!0}}Gt===!0&&(E.updateMultisampleRenderTarget(rt),E.updateRenderTargetMipmap(rt))}S.setRenderTarget(yt),S.setClearColor(W,$),zt!==void 0&&(G.viewport=zt),S.toneMapping=Tt}function hr(M,I,B){const G=I.isScene===!0?I.overrideMaterial:null;for(let N=0,rt=M.length;N<rt;N++){const mt=M[N],yt=mt.object,Tt=mt.geometry,zt=G===null?mt.material:G,Gt=mt.group;yt.layers.test(B.layers)&&Ma(yt,I,B,Tt,zt,Gt)}}function Ma(M,I,B,G,N,rt){M.onBeforeRender(S,I,B,G,N,rt),M.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),N.onBeforeRender(S,I,B,G,M,rt),N.transparent===!0&&N.side===Qe&&N.forceSinglePass===!1?(N.side=Le,N.needsUpdate=!0,S.renderBufferDirect(B,I,G,N,M,rt),N.side=In,N.needsUpdate=!0,S.renderBufferDirect(B,I,G,N,M,rt),N.side=Qe):S.renderBufferDirect(B,I,G,N,M,rt),M.onAfterRender(S,I,B,G,N,rt)}function fr(M,I,B){I.isScene!==!0&&(I=$t);const G=ht.get(M),N=f.state.lights,rt=f.state.shadowsArray,mt=N.state.version,yt=At.getParameters(M,N.state,rt,I,B),Tt=At.getProgramCacheKey(yt);let zt=G.programs;G.environment=M.isMeshStandardMaterial?I.environment:null,G.fog=I.fog,G.envMap=(M.isMeshStandardMaterial?F:_).get(M.envMap||G.environment),G.envMapRotation=G.environment!==null&&M.envMap===null?I.environmentRotation:M.envMapRotation,zt===void 0&&(M.addEventListener("dispose",kt),zt=new Map,G.programs=zt);let Gt=zt.get(Tt);if(Gt!==void 0){if(G.currentProgram===Gt&&G.lightsStateVersion===mt)return ya(M,yt),Gt}else yt.uniforms=At.getUniforms(M),M.onBeforeCompile(yt,S),Gt=At.acquireProgram(yt,Tt),zt.set(Tt,Gt),G.uniforms=yt.uniforms;const Dt=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Dt.clippingPlanes=J.uniform),ya(M,yt),G.needsLights=Xl(M),G.lightsStateVersion=mt,G.needsLights&&(Dt.ambientLightColor.value=N.state.ambient,Dt.lightProbe.value=N.state.probe,Dt.directionalLights.value=N.state.directional,Dt.directionalLightShadows.value=N.state.directionalShadow,Dt.spotLights.value=N.state.spot,Dt.spotLightShadows.value=N.state.spotShadow,Dt.rectAreaLights.value=N.state.rectArea,Dt.ltc_1.value=N.state.rectAreaLTC1,Dt.ltc_2.value=N.state.rectAreaLTC2,Dt.pointLights.value=N.state.point,Dt.pointLightShadows.value=N.state.pointShadow,Dt.hemisphereLights.value=N.state.hemi,Dt.directionalShadowMap.value=N.state.directionalShadowMap,Dt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Dt.spotShadowMap.value=N.state.spotShadowMap,Dt.spotLightMatrix.value=N.state.spotLightMatrix,Dt.spotLightMap.value=N.state.spotLightMap,Dt.pointShadowMap.value=N.state.pointShadowMap,Dt.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Gt,G.uniformsList=null,Gt}function Sa(M){if(M.uniformsList===null){const I=M.currentProgram.getUniforms();M.uniformsList=$r.seqWithValue(I.seq,M.uniforms)}return M.uniformsList}function ya(M,I){const B=ht.get(M);B.outputColorSpace=I.outputColorSpace,B.batching=I.batching,B.batchingColor=I.batchingColor,B.instancing=I.instancing,B.instancingColor=I.instancingColor,B.instancingMorph=I.instancingMorph,B.skinning=I.skinning,B.morphTargets=I.morphTargets,B.morphNormals=I.morphNormals,B.morphColors=I.morphColors,B.morphTargetsCount=I.morphTargetsCount,B.numClippingPlanes=I.numClippingPlanes,B.numIntersection=I.numClipIntersection,B.vertexAlphas=I.vertexAlphas,B.vertexTangents=I.vertexTangents,B.toneMapping=I.toneMapping}function Hl(M,I,B,G,N){I.isScene!==!0&&(I=$t),E.resetTextureUnits();const rt=I.fog,mt=G.isMeshStandardMaterial?I.environment:null,yt=D===null?S.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Ni,Tt=(G.isMeshStandardMaterial?F:_).get(G.envMap||mt),zt=G.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Gt=!!B.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Dt=!!B.morphAttributes.position,Jt=!!B.morphAttributes.normal,te=!!B.morphAttributes.color;let de=Ln;G.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(de=S.toneMapping);const he=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,jt=he!==void 0?he.length:0,Ut=ht.get(G),Se=f.state.lights;if(st===!0&&(Et===!0||M!==x)){const Ae=M===x&&G.id===y;J.setState(G,M,Ae)}let ee=!1;G.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==Se.state.version||Ut.outputColorSpace!==yt||N.isBatchedMesh&&Ut.batching===!1||!N.isBatchedMesh&&Ut.batching===!0||N.isBatchedMesh&&Ut.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ut.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ut.instancing===!1||!N.isInstancedMesh&&Ut.instancing===!0||N.isSkinnedMesh&&Ut.skinning===!1||!N.isSkinnedMesh&&Ut.skinning===!0||N.isInstancedMesh&&Ut.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ut.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ut.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ut.instancingMorph===!1&&N.morphTexture!==null||Ut.envMap!==Tt||G.fog===!0&&Ut.fog!==rt||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==J.numPlanes||Ut.numIntersection!==J.numIntersection)||Ut.vertexAlphas!==zt||Ut.vertexTangents!==Gt||Ut.morphTargets!==Dt||Ut.morphNormals!==Jt||Ut.morphColors!==te||Ut.toneMapping!==de||Ut.morphTargetsCount!==jt)&&(ee=!0):(ee=!0,Ut.__version=G.version);let Ze=Ut.currentProgram;ee===!0&&(Ze=fr(G,I,N));let si=!1,Ne=!1,Hi=!1;const ae=Ze.getUniforms(),Ve=Ut.uniforms;if(at.useProgram(Ze.program)&&(si=!0,Ne=!0,Hi=!0),G.id!==y&&(y=G.id,Ne=!0),si||x!==M){at.buffers.depth.getReversed()?(ct.copy(M.projectionMatrix),Ou(ct),Bu(ct),ae.setValue(b,"projectionMatrix",ct)):ae.setValue(b,"projectionMatrix",M.projectionMatrix),ae.setValue(b,"viewMatrix",M.matrixWorldInverse);const Ue=ae.map.cameraPosition;Ue!==void 0&&Ue.setValue(b,Zt.setFromMatrixPosition(M.matrixWorld)),gt.logarithmicDepthBuffer&&ae.setValue(b,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ae.setValue(b,"isOrthographic",M.isOrthographicCamera===!0),x!==M&&(x=M,Ne=!0,Hi=!0)}if(N.isSkinnedMesh){ae.setOptional(b,N,"bindMatrix"),ae.setOptional(b,N,"bindMatrixInverse");const Ae=N.skeleton;Ae&&(Ae.boneTexture===null&&Ae.computeBoneTexture(),ae.setValue(b,"boneTexture",Ae.boneTexture,E))}N.isBatchedMesh&&(ae.setOptional(b,N,"batchingTexture"),ae.setValue(b,"batchingTexture",N._matricesTexture,E),ae.setOptional(b,N,"batchingIdTexture"),ae.setValue(b,"batchingIdTexture",N._indirectTexture,E),ae.setOptional(b,N,"batchingColorTexture"),N._colorsTexture!==null&&ae.setValue(b,"batchingColorTexture",N._colorsTexture,E));const ke=B.morphAttributes;if((ke.position!==void 0||ke.normal!==void 0||ke.color!==void 0)&&Rt.update(N,B,Ze),(Ne||Ut.receiveShadow!==N.receiveShadow)&&(Ut.receiveShadow=N.receiveShadow,ae.setValue(b,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Ve.envMap.value=Tt,Ve.flipEnvMap.value=Tt.isCubeTexture&&Tt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&I.environment!==null&&(Ve.envMapIntensity.value=I.environmentIntensity),Ne&&(ae.setValue(b,"toneMappingExposure",S.toneMappingExposure),Ut.needsLights&&Wl(Ve,Hi),rt&&G.fog===!0&&X.refreshFogUniforms(Ve,rt),X.refreshMaterialUniforms(Ve,G,V,Q,f.state.transmissionRenderTarget[M.id]),$r.upload(b,Sa(Ut),Ve,E)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&($r.upload(b,Sa(Ut),Ve,E),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ae.setValue(b,"center",N.center),ae.setValue(b,"modelViewMatrix",N.modelViewMatrix),ae.setValue(b,"normalMatrix",N.normalMatrix),ae.setValue(b,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Ae=G.uniformsGroups;for(let Ue=0,us=Ae.length;Ue<us;Ue++){const Bn=Ae[Ue];U.update(Bn,Ze),U.bind(Bn,Ze)}}return Ze}function Wl(M,I){M.ambientLightColor.needsUpdate=I,M.lightProbe.needsUpdate=I,M.directionalLights.needsUpdate=I,M.directionalLightShadows.needsUpdate=I,M.pointLights.needsUpdate=I,M.pointLightShadows.needsUpdate=I,M.spotLights.needsUpdate=I,M.spotLightShadows.needsUpdate=I,M.rectAreaLights.needsUpdate=I,M.hemisphereLights.needsUpdate=I}function Xl(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(M,I,B){ht.get(M.texture).__webglTexture=I,ht.get(M.depthTexture).__webglTexture=B;const G=ht.get(M);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=B===void 0,G.__autoAllocateDepthBuffer||it.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,I){const B=ht.get(M);B.__webglFramebuffer=I,B.__useDefaultFramebuffer=I===void 0};const ql=b.createFramebuffer();this.setRenderTarget=function(M,I=0,B=0){D=M,R=I,w=B;let G=!0,N=null,rt=!1,mt=!1;if(M){const Tt=ht.get(M);if(Tt.__useDefaultFramebuffer!==void 0)at.bindFramebuffer(b.FRAMEBUFFER,null),G=!1;else if(Tt.__webglFramebuffer===void 0)E.setupRenderTarget(M);else if(Tt.__hasExternalTextures)E.rebindTextures(M,ht.get(M.texture).__webglTexture,ht.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const Dt=M.depthTexture;if(Tt.__boundDepthTexture!==Dt){if(Dt!==null&&ht.has(Dt)&&(M.width!==Dt.image.width||M.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(M)}}const zt=M.texture;(zt.isData3DTexture||zt.isDataArrayTexture||zt.isCompressedArrayTexture)&&(mt=!0);const Gt=ht.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Gt[I])?N=Gt[I][B]:N=Gt[I],rt=!0):M.samples>0&&E.useMultisampledRTT(M)===!1?N=ht.get(M).__webglMultisampledFramebuffer:Array.isArray(Gt)?N=Gt[B]:N=Gt,C.copy(M.viewport),z.copy(M.scissor),O=M.scissorTest}else C.copy(St).multiplyScalar(V).floor(),z.copy(Nt).multiplyScalar(V).floor(),O=Kt;if(B!==0&&(N=ql),at.bindFramebuffer(b.FRAMEBUFFER,N)&&G&&at.drawBuffers(M,N),at.viewport(C),at.scissor(z),at.setScissorTest(O),rt){const Tt=ht.get(M.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_CUBE_MAP_POSITIVE_X+I,Tt.__webglTexture,B)}else if(mt){const Tt=ht.get(M.texture),zt=I;b.framebufferTextureLayer(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,Tt.__webglTexture,B,zt)}else if(M!==null&&B!==0){const Tt=ht.get(M.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,Tt.__webglTexture,B)}y=-1},this.readRenderTargetPixels=function(M,I,B,G,N,rt,mt){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let yt=ht.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&mt!==void 0&&(yt=yt[mt]),yt){at.bindFramebuffer(b.FRAMEBUFFER,yt);try{const Tt=M.texture,zt=Tt.format,Gt=Tt.type;if(!gt.textureFormatReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!gt.textureTypeReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=M.width-G&&B>=0&&B<=M.height-N&&b.readPixels(I,B,G,N,Lt.convert(zt),Lt.convert(Gt),rt)}finally{const Tt=D!==null?ht.get(D).__webglFramebuffer:null;at.bindFramebuffer(b.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(M,I,B,G,N,rt,mt){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let yt=ht.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&mt!==void 0&&(yt=yt[mt]),yt){const Tt=M.texture,zt=Tt.format,Gt=Tt.type;if(!gt.textureFormatReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!gt.textureTypeReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=M.width-G&&B>=0&&B<=M.height-N){at.bindFramebuffer(b.FRAMEBUFFER,yt);const Dt=b.createBuffer();b.bindBuffer(b.PIXEL_PACK_BUFFER,Dt),b.bufferData(b.PIXEL_PACK_BUFFER,rt.byteLength,b.STREAM_READ),b.readPixels(I,B,G,N,Lt.convert(zt),Lt.convert(Gt),0);const Jt=D!==null?ht.get(D).__webglFramebuffer:null;at.bindFramebuffer(b.FRAMEBUFFER,Jt);const te=b.fenceSync(b.SYNC_GPU_COMMANDS_COMPLETE,0);return b.flush(),await Fu(b,te,4),b.bindBuffer(b.PIXEL_PACK_BUFFER,Dt),b.getBufferSubData(b.PIXEL_PACK_BUFFER,0,rt),b.deleteBuffer(Dt),b.deleteSync(te),rt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,I=null,B=0){M.isTexture!==!0&&(qn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,M=arguments[1]);const G=Math.pow(2,-B),N=Math.floor(M.image.width*G),rt=Math.floor(M.image.height*G),mt=I!==null?I.x:0,yt=I!==null?I.y:0;E.setTexture2D(M,0),b.copyTexSubImage2D(b.TEXTURE_2D,B,0,0,mt,yt,N,rt),at.unbindTexture()};const Yl=b.createFramebuffer(),Zl=b.createFramebuffer();this.copyTextureToTexture=function(M,I,B=null,G=null,N=0,rt=null){M.isTexture!==!0&&(qn("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,M=arguments[1],I=arguments[2],rt=arguments[3]||0,B=null),rt===null&&(N!==0?(qn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),rt=N,N=0):rt=0);let mt,yt,Tt,zt,Gt,Dt,Jt,te,de;const he=M.isCompressedTexture?M.mipmaps[rt]:M.image;if(B!==null)mt=B.max.x-B.min.x,yt=B.max.y-B.min.y,Tt=B.isBox3?B.max.z-B.min.z:1,zt=B.min.x,Gt=B.min.y,Dt=B.isBox3?B.min.z:0;else{const ke=Math.pow(2,-N);mt=Math.floor(he.width*ke),yt=Math.floor(he.height*ke),M.isDataArrayTexture?Tt=he.depth:M.isData3DTexture?Tt=Math.floor(he.depth*ke):Tt=1,zt=0,Gt=0,Dt=0}G!==null?(Jt=G.x,te=G.y,de=G.z):(Jt=0,te=0,de=0);const jt=Lt.convert(I.format),Ut=Lt.convert(I.type);let Se;I.isData3DTexture?(E.setTexture3D(I,0),Se=b.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(E.setTexture2DArray(I,0),Se=b.TEXTURE_2D_ARRAY):(E.setTexture2D(I,0),Se=b.TEXTURE_2D),b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,I.flipY),b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),b.pixelStorei(b.UNPACK_ALIGNMENT,I.unpackAlignment);const ee=b.getParameter(b.UNPACK_ROW_LENGTH),Ze=b.getParameter(b.UNPACK_IMAGE_HEIGHT),si=b.getParameter(b.UNPACK_SKIP_PIXELS),Ne=b.getParameter(b.UNPACK_SKIP_ROWS),Hi=b.getParameter(b.UNPACK_SKIP_IMAGES);b.pixelStorei(b.UNPACK_ROW_LENGTH,he.width),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,he.height),b.pixelStorei(b.UNPACK_SKIP_PIXELS,zt),b.pixelStorei(b.UNPACK_SKIP_ROWS,Gt),b.pixelStorei(b.UNPACK_SKIP_IMAGES,Dt);const ae=M.isDataArrayTexture||M.isData3DTexture,Ve=I.isDataArrayTexture||I.isData3DTexture;if(M.isDepthTexture){const ke=ht.get(M),Ae=ht.get(I),Ue=ht.get(ke.__renderTarget),us=ht.get(Ae.__renderTarget);at.bindFramebuffer(b.READ_FRAMEBUFFER,Ue.__webglFramebuffer),at.bindFramebuffer(b.DRAW_FRAMEBUFFER,us.__webglFramebuffer);for(let Bn=0;Bn<Tt;Bn++)ae&&(b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,ht.get(M).__webglTexture,N,Dt+Bn),b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,ht.get(I).__webglTexture,rt,de+Bn)),b.blitFramebuffer(zt,Gt,mt,yt,Jt,te,mt,yt,b.DEPTH_BUFFER_BIT,b.NEAREST);at.bindFramebuffer(b.READ_FRAMEBUFFER,null),at.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else if(N!==0||M.isRenderTargetTexture||ht.has(M)){const ke=ht.get(M),Ae=ht.get(I);at.bindFramebuffer(b.READ_FRAMEBUFFER,Yl),at.bindFramebuffer(b.DRAW_FRAMEBUFFER,Zl);for(let Ue=0;Ue<Tt;Ue++)ae?b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,ke.__webglTexture,N,Dt+Ue):b.framebufferTexture2D(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,ke.__webglTexture,N),Ve?b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,Ae.__webglTexture,rt,de+Ue):b.framebufferTexture2D(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,Ae.__webglTexture,rt),N!==0?b.blitFramebuffer(zt,Gt,mt,yt,Jt,te,mt,yt,b.COLOR_BUFFER_BIT,b.NEAREST):Ve?b.copyTexSubImage3D(Se,rt,Jt,te,de+Ue,zt,Gt,mt,yt):b.copyTexSubImage2D(Se,rt,Jt,te,zt,Gt,mt,yt);at.bindFramebuffer(b.READ_FRAMEBUFFER,null),at.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else Ve?M.isDataTexture||M.isData3DTexture?b.texSubImage3D(Se,rt,Jt,te,de,mt,yt,Tt,jt,Ut,he.data):I.isCompressedArrayTexture?b.compressedTexSubImage3D(Se,rt,Jt,te,de,mt,yt,Tt,jt,he.data):b.texSubImage3D(Se,rt,Jt,te,de,mt,yt,Tt,jt,Ut,he):M.isDataTexture?b.texSubImage2D(b.TEXTURE_2D,rt,Jt,te,mt,yt,jt,Ut,he.data):M.isCompressedTexture?b.compressedTexSubImage2D(b.TEXTURE_2D,rt,Jt,te,he.width,he.height,jt,he.data):b.texSubImage2D(b.TEXTURE_2D,rt,Jt,te,mt,yt,jt,Ut,he);b.pixelStorei(b.UNPACK_ROW_LENGTH,ee),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,Ze),b.pixelStorei(b.UNPACK_SKIP_PIXELS,si),b.pixelStorei(b.UNPACK_SKIP_ROWS,Ne),b.pixelStorei(b.UNPACK_SKIP_IMAGES,Hi),rt===0&&I.generateMipmaps&&b.generateMipmap(Se),at.unbindTexture()},this.copyTextureToTexture3D=function(M,I,B=null,G=null,N=0){return M.isTexture!==!0&&(qn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,G=arguments[1]||null,M=arguments[2],I=arguments[3],N=arguments[4]||0),qn('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,I,B,G,N)},this.initRenderTarget=function(M){ht.get(M).__webglFramebuffer===void 0&&E.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?E.setTextureCube(M,0):M.isData3DTexture?E.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?E.setTexture2DArray(M,0):E.setTexture2D(M,0),at.unbindTexture()},this.resetState=function(){R=0,w=0,D=null,at.reset(),Ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}}class Oi{static createButton(t,e={}){const n=document.createElement("button");function r(){let l=null;async function u(m){m.addEventListener("end",h),await t.xr.setSession(m),n.textContent="EXIT VR",l=m}function h(){l.removeEventListener("end",h),n.textContent="ENTER VR",l=null}n.style.display="",n.style.cursor="pointer",n.style.left="calc(50% - 50px)",n.style.width="100px",n.textContent="ENTER VR";const d={...e,optionalFeatures:["local-floor","bounded-floor","layers",...e.optionalFeatures||[]]};n.onmouseenter=function(){n.style.opacity="1.0"},n.onmouseleave=function(){n.style.opacity="0.5"},n.onclick=function(){l===null?navigator.xr.requestSession("immersive-vr",d).then(u):(l.end(),navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-vr",d).then(u).catch(m=>{console.warn(m)}))},navigator.xr.offerSession!==void 0&&navigator.xr.offerSession("immersive-vr",d).then(u).catch(m=>{console.warn(m)})}function s(){n.style.display="",n.style.cursor="auto",n.style.left="calc(50% - 75px)",n.style.width="150px",n.onmouseenter=null,n.onmouseleave=null,n.onclick=null}function o(){s(),n.textContent="VR NOT SUPPORTED"}function a(l){s(),console.warn("Exception when trying to call xr.isSessionSupported",l),n.textContent="VR NOT ALLOWED"}function c(l){l.style.position="absolute",l.style.bottom="20px",l.style.padding="12px 6px",l.style.border="1px solid #fff",l.style.borderRadius="4px",l.style.background="rgba(0,0,0,0.1)",l.style.color="#fff",l.style.font="normal 13px sans-serif",l.style.textAlign="center",l.style.opacity="0.5",l.style.outline="none",l.style.zIndex="999"}if("xr"in navigator)return n.id="VRButton",n.style.display="none",c(n),navigator.xr.isSessionSupported("immersive-vr").then(function(l){l?r():o(),l&&Oi.xrSessionIsGranted&&n.click()}).catch(a),n;{const l=document.createElement("a");return window.isSecureContext===!1?(l.href=document.location.href.replace(/^http:/,"https:"),l.innerHTML="WEBXR NEEDS HTTPS"):(l.href="https://immersiveweb.dev/",l.innerHTML="WEBXR NOT AVAILABLE"),l.style.left="calc(50% - 90px)",l.style.width="180px",l.style.textDecoration="none",c(l),l}}static registerSessionGrantedListener(){if(typeof navigator<"u"&&"xr"in navigator){if(/WebXRViewer\//i.test(navigator.userAgent))return;navigator.xr.addEventListener("sessiongranted",()=>{Oi.xrSessionIsGranted=!0})}}}Oi.xrSessionIsGranted=!1;Oi.registerSessionGrantedListener();const Ho=[{index:0,stringNum:6,name:"Mi (Kalın)",note:"E2",baseFreq:82.41,color:"#f59e0b",thickness:.0038,type:"wound"},{index:1,stringNum:5,name:"La",note:"A2",baseFreq:110,color:"#eab308",thickness:.0033,type:"wound"},{index:2,stringNum:4,name:"Re",note:"D3",baseFreq:146.83,color:"#84cc16",thickness:.0028,type:"wound"},{index:3,stringNum:3,name:"Sol",note:"G3",baseFreq:196,color:"#06b6d4",thickness:.0023,type:"plain"},{index:4,stringNum:2,name:"Si",note:"B3",baseFreq:246.94,color:"#3b82f6",thickness:.0019,type:"plain"},{index:5,stringNum:1,name:"Mi (İnce)",note:"E4",baseFreq:329.63,color:"#a855f7",thickness:.0015,type:"plain"}];function Vg(i,t){return t<0?0:i*Math.pow(2,t/12)}const ii=[{id:"C",name:"C",turkishName:"Do Majör",color:"#3b82f6",icon:"🔵",shortcut:"1",frets:[-1,3,2,0,1,0],fingerDots:[{string:5,fret:3,finger:"Yüzük (3)"},{string:4,fret:2,finger:"Orta (2)"},{string:2,fret:1,finger:"İşaret (1)"}],notes:["-","Do","Mi","Sol","Do","Mi"],description:"Neşeli, aydınlık ve temel Do Majör akoru"},{id:"G",name:"G",turkishName:"Sol Majör",color:"#10b981",icon:"🟢",shortcut:"2",frets:[3,2,0,0,3,3],fingerDots:[{string:6,fret:3,finger:"Orta (2)"},{string:5,fret:2,finger:"İşaret (1)"},{string:2,fret:3,finger:"Yüzük (3)"},{string:1,fret:3,finger:"Serçe (4)"}],notes:["Sol","Si","Re","Sol","Re","Sol"],description:"Geniş, coşkulu ve parlak Sol Majör akoru"},{id:"Am",name:"Am",turkishName:"La Minör",color:"#8b5cf6",icon:"🟣",shortcut:"3",frets:[-1,0,2,2,1,0],fingerDots:[{string:4,fret:2,finger:"Orta (2)"},{string:3,fret:2,finger:"Yüzük (3)"},{string:2,fret:1,finger:"İşaret (1)"}],notes:["-","La","Mi","La","Do","Mi"],description:"Duygusal, tatlı ve klasik çocuk şarkısı akoru"},{id:"F",name:"F",turkishName:"Fa Majör",color:"#ec4899",icon:"🌸",shortcut:"4",frets:[1,3,3,2,1,1],fingerDots:[{string:6,fret:1,finger:"İşaret (Barre)"},{string:5,fret:3,finger:"Yüzük (3)"},{string:4,fret:3,finger:"Serçe (4)"},{string:3,fret:2,finger:"Orta (2)"},{string:2,fret:1,finger:"İşaret (Barre)"},{string:1,fret:1,finger:"İşaret (Barre)"}],notes:["Fa","Do","Fa","La","Do","Fa"],description:"Zengin tınılı, güçlü Fa Majör akoru"},{id:"Em",name:"Em",turkishName:"Mi Minör",color:"#f59e0b",icon:"🟠",shortcut:"5",frets:[0,2,2,0,0,0],fingerDots:[{string:5,fret:2,finger:"Orta (2)"},{string:4,fret:2,finger:"Yüzük (3)"}],notes:["Mi","Si","Mi","Sol","Si","Mi"],description:"En kolay ve derin tınılı kamp ateşi akoru"},{id:"D",name:"D",turkishName:"Re Majör",color:"#06b6d4",icon:"💎",shortcut:"6",frets:[-1,-1,0,2,3,2],fingerDots:[{string:3,fret:2,finger:"İşaret (1)"},{string:2,fret:3,finger:"Yüzük (3)"},{string:1,fret:2,finger:"Orta (2)"}],notes:["-","-","Re","La","Re","Fa#"],description:"Tiz, neşeli ve kıpır kıpır Re Majör akoru"},{id:"Dm",name:"Dm",turkishName:"Re Minör",color:"#ef4444",icon:"🔴",shortcut:"7",frets:[-1,-1,0,2,3,1],fingerDots:[{string:3,fret:2,finger:"Orta (2)"},{string:2,fret:3,finger:"Yüzük (3)"},{string:1,fret:1,finger:"İşaret (1)"}],notes:["-","-","Re","La","Re","Fa"],description:"Hüzünlü ve masalsı Re Minör akoru"},{id:"A",name:"A",turkishName:"La Majör",color:"#14b8a6",icon:"🩵",shortcut:"8",frets:[-1,0,2,2,2,0],fingerDots:[{string:4,fret:2,finger:"İşaret (1)"},{string:3,fret:2,finger:"Orta (2)"},{string:2,fret:2,finger:"Yüzük (3)"}],notes:["-","La","Mi","La","Do#","Mi"],description:"Dinamik, sıcak ve enerjik La Majör akoru"}],Rn=[{id:"acoustic",name:"Akustik Gitar",subtitle:"Parlak Çelik Teller & Zengin Akustik Rezonans",icon:"🎸",color:"#d97706",bodyColor:12744760,backColor:5909778,damping:.992,brightness:1.25,stringType:"steel"},{id:"classical",name:"Klasik Gitar",subtitle:"Sıcak Naylon Teller & İspanyol Tınısı",icon:"🪕",color:"#ca8a04",bodyColor:14654292,backColor:4004870,damping:.985,brightness:.85,stringType:"nylon"},{id:"electric",name:"Elektro Gitar",subtitle:"Temiz Reverb & Sonsuz Sustain Tonu",icon:"⚡",color:"#ef4444",bodyColor:12131356,backColor:1973790,damping:.996,brightness:1.5,stringType:"electric"},{id:"twelve_string",name:"12 Telli Gitar",subtitle:"Çift Koro & Büyüleyici Zengin Çınlama",icon:"✨",color:"#a855f7",bodyColor:14723437,backColor:4528643,damping:.994,brightness:1.4,stringType:"12string"}];class kg{constructor(){this.ctx=null,this.masterGain=null,this.bodyResonanceLow=null,this.bodyResonanceMid=null,this.convolver=null,this.activeType="acoustic",this.isMuted=!1,this.stringBuffers=new Map}ensureContext(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;this.ctx=new t,this.masterGain=this.ctx.createGain(),this.masterGain.gain.setValueAtTime(.85,this.ctx.currentTime),this.bodyResonanceLow=this.ctx.createBiquadFilter(),this.bodyResonanceLow.type="peaking",this.bodyResonanceLow.frequency.setValueAtTime(105,this.ctx.currentTime),this.bodyResonanceLow.Q.setValueAtTime(3.5,this.ctx.currentTime),this.bodyResonanceLow.gain.setValueAtTime(4,this.ctx.currentTime),this.bodyResonanceMid=this.ctx.createBiquadFilter(),this.bodyResonanceMid.type="peaking",this.bodyResonanceMid.frequency.setValueAtTime(220,this.ctx.currentTime),this.bodyResonanceMid.Q.setValueAtTime(2.8,this.ctx.currentTime),this.bodyResonanceMid.gain.setValueAtTime(3.5,this.ctx.currentTime),this.bodyHighShelf=this.ctx.createBiquadFilter(),this.bodyHighShelf.type="highshelf",this.bodyHighShelf.frequency.setValueAtTime(3500,this.ctx.currentTime),this.bodyHighShelf.gain.setValueAtTime(1.5,this.ctx.currentTime),this.compressor=this.ctx.createDynamicsCompressor(),this.compressor.threshold.setValueAtTime(-14,this.ctx.currentTime),this.compressor.knee.setValueAtTime(20,this.ctx.currentTime),this.compressor.ratio.setValueAtTime(4,this.ctx.currentTime),this.compressor.attack.setValueAtTime(.005,this.ctx.currentTime),this.compressor.release.setValueAtTime(.18,this.ctx.currentTime),this.reverbNode=this.createStageReverb(1.6,.28),this.bodyResonanceLow.connect(this.bodyResonanceMid),this.bodyResonanceMid.connect(this.bodyHighShelf),this.bodyHighShelf.connect(this.compressor),this.compressor.connect(this.masterGain),this.compressor.connect(this.reverbNode),this.reverbNode.connect(this.masterGain),this.masterGain.connect(this.ctx.destination)}this.ctx.state==="suspended"&&this.ctx.resume()}setGuitarType(t){if(this.activeType=t,!this.ctx)return;const e=Rn.find(n=>n.id===t)||Rn[0];e.id==="classical"?(this.bodyResonanceLow.frequency.setTargetAtTime(98,this.ctx.currentTime,.05),this.bodyResonanceMid.frequency.setTargetAtTime(195,this.ctx.currentTime,.05),this.bodyHighShelf.gain.setTargetAtTime(-2,this.ctx.currentTime,.05)):e.id==="electric"?(this.bodyResonanceLow.frequency.setTargetAtTime(120,this.ctx.currentTime,.05),this.bodyResonanceMid.frequency.setTargetAtTime(320,this.ctx.currentTime,.05),this.bodyHighShelf.gain.setTargetAtTime(3.5,this.ctx.currentTime,.05)):(this.bodyResonanceLow.frequency.setTargetAtTime(105,this.ctx.currentTime,.05),this.bodyResonanceMid.frequency.setTargetAtTime(220,this.ctx.currentTime,.05),this.bodyHighShelf.gain.setTargetAtTime(2,this.ctx.currentTime,.05))}setMuted(t){this.isMuted=t,this.masterGain&&this.ctx&&this.masterGain.gain.setTargetAtTime(t?0:.85,this.ctx.currentTime,.05)}createStageReverb(t=1.5,e=.3){const n=this.ctx.sampleRate,r=n*t,s=this.ctx.createBuffer(2,r,n),o=s.getChannelData(0),a=s.getChannelData(1);for(let u=0;u<r;u++){const h=u/r,d=Math.pow(1-h,2.5);o[u]=(Math.random()*2-1)*d*.5,a[u]=(Math.random()*2-1)*d*.5}const c=this.ctx.createConvolver();c.buffer=s;const l=this.ctx.createGain();return l.gain.setValueAtTime(e,this.ctx.currentTime),c.connect(l),l}synthesizePluckedString(t,e=3.2,n=.85,r=.22){if(t<=0)return null;const s=Rn.find(f=>f.id===this.activeType)||Rn[0],o=this.ctx.sampleRate,a=Math.floor(o*e),c=this.ctx.createBuffer(1,a,o),l=c.getChannelData(0),u=Math.round(o/t);if(u<2)return null;const h=new Float32Array(u),d=Math.floor(u*r);for(let f=0;f<u;f++){let A=0;f<=d?A=f/(d||1):A=(u-f)/(u-d);const T=(Math.random()*2-1)*.25;h[f]=(A*.75+T)*n}const m=s.damping,g=new Float32Array(u);for(let f=0;f<u;f++)g[f]=h[f];let v=0,p=0;for(let f=0;f<a;f++){const A=g[v],T=.5*(A+p)*m;p=A,g[v]=T,l[f]=A,v++,v>=u&&(v=0)}return c}pluckString(t,e=null,n=.9,r=null){if(this.isMuted)return;this.ensureContext();const s=Ho[t];if(!s)return;let o=r;if(!o)if(e&&e.frets){const g=e.frets[t];if(g<0)return;o=Vg(s.baseFreq,g)}else o=s.baseFreq;const a=this.synthesizePluckedString(o,3.2,n);if(!a)return;const c=this.ctx.createBufferSource();c.buffer=a;const l=this.ctx.createStereoPanner?this.ctx.createStereoPanner():null,u=-.45+t/5*.9;l&&l.pan.setValueAtTime(u,this.ctx.currentTime);const h=this.ctx.createGain(),d=Rn.find(g=>g.id===this.activeType)||Rn[0],m=Math.min(1,n*d.brightness);h.gain.setValueAtTime(m,this.ctx.currentTime),l?(c.connect(l),l.connect(h)):c.connect(h),h.connect(this.bodyResonanceLow),c.start()}strumChord(t,e="down",n=.88,r=null){if(this.isMuted||(this.ensureContext(),!t))return;const s=e==="down"?[0,1,2,3,4,5]:[5,4,3,2,1,0],o=.019;s.forEach((a,c)=>{if(t.frets[a]<0)return;const u=c*(o*1e3);setTimeout(()=>{this.pluckString(a,t,n*(.92+Math.random()*.16)),r&&r(a)},u)})}playEffect(t){if(this.isMuted)return;this.ensureContext();const e=this.ctx.createOscillator(),n=this.ctx.createGain();e.connect(n),n.connect(this.masterGain);const r=this.ctx.currentTime;t==="chord_change"?(e.type="sine",e.frequency.setValueAtTime(587.33,r),e.frequency.exponentialRampToValueAtTime(880,r+.08),n.gain.setValueAtTime(.2,r),n.gain.exponentialRampToValueAtTime(.001,r+.12),e.start(r),e.stop(r+.13)):t==="success"&&(e.type="triangle",e.frequency.setValueAtTime(523.25,r),e.frequency.setValueAtTime(659.25,r+.08),e.frequency.setValueAtTime(783.99,r+.16),e.frequency.setValueAtTime(1046.5,r+.24),n.gain.setValueAtTime(.3,r),n.gain.exponentialRampToValueAtTime(.001,r+.45),e.start(r),e.stop(r+.46))}}const Ge=new kg;function Hg(i,t){const e=new Me;i.add(e);const n=document.createElement("canvas");n.width=1024,n.height=512;const r=n.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#0a0f1d"),s.addColorStop(.35,"#1e1b4b"),s.addColorStop(.7,"#311042"),s.addColorStop(.92,"#18181b"),s.addColorStop(1,"#09090b"),r.fillStyle=s,r.fillRect(0,0,1024,512);for(let L=0;L<200;L++)r.fillStyle=L%5===0?"#fde047":L%2===0?"#e0e7ff":"#94a3b8",r.beginPath(),r.arc(Math.random()*1024,Math.random()*340,1+Math.random()*2.2,0,Math.PI*2),r.fill();["rgba(245, 158, 11, 0.22)","rgba(56, 189, 248, 0.20)","rgba(168, 85, 247, 0.20)"].forEach((L,R)=>{r.strokeStyle=L,r.lineWidth=14,r.beginPath(),r.arc(512,500,370-R*22,Math.PI*1.05,Math.PI*1.95),r.stroke()});const a=new Ci(n);a.colorSpace=Pe;const c=new Ot(new ni(45,36,24),new je({map:a,side:Le}));e.add(c);const l=new Ot(new Fn(80,80),new fe({color:592139,roughness:.85}));l.rotation.x=-Math.PI/2,l.position.y=-.5,e.add(l);const u=new Ot(new Ce(3.6,3.8,.22,48),new fe({color:2565930,roughness:.6,metalness:.1}));u.position.set(0,-.2,-.7),u.receiveShadow=!0,e.add(u);const h=new Ot(new Ce(2.2,2.2,.03,36),new fe({color:1973067,roughness:.9}));h.position.set(0,-.07,-.65),h.receiveShadow=!0,e.add(h);const d=[],m=["🎵","🎶","🎼","⭐","✨"];for(let L=0;L<16;L++){const R=document.createElement("canvas");R.width=64,R.height=64;const w=R.getContext("2d");w.font='40px "Segoe UI Emoji", Arial',w.textAlign="center",w.textBaseline="middle",w.fillText(m[L%m.length],32,32);const D=new Ci(R),y=new vl({map:D,transparent:!0,opacity:.75}),x=new hh(y),C=L/16*Math.PI*2,z=1.4+Math.random()*1.6;x.position.set(Math.cos(C)*z,1.1+Math.sin(L*1.7)*.7,-.7+Math.sin(C)*z),x.scale.set(.18,.18,.18),e.add(x),d.push({sprite:x,baseY:x.position.y,speed:.8+Math.random()*1.2,phase:Math.random()*Math.PI*2})}const g=new Me;g.position.set(0,2.65,-3.2),e.add(g);const v=document.createElement("canvas");v.width=1200,v.height=420;const p=v.getContext("2d");function f(L="Özel Neşeli Minikler Anaokulu",R="0 (212) 555 01 23"){p.clearRect(0,0,1200,420),p.fillStyle="#0f172a",p.roundRect(10,10,1180,400,36),p.fill(),p.strokeStyle="#f59e0b",p.lineWidth=6,p.roundRect(14,14,1172,392,32),p.stroke(),p.textAlign="center",p.fillStyle="#38bdf8",p.font='bold 36px "Segoe UI", Arial, sans-serif',p.fillText("🏫 VR MÜZİK & SANAT ATÖLYESİ",600,75),p.fillStyle="#ffffff",p.font='900 62px "Segoe UI", Arial, sans-serif',p.fillText(L,600,160),p.fillStyle="#fde047",p.font='bold 36px "Segoe UI", Arial, sans-serif',p.fillText("✨ Sevgi, Sanat ve Teknolojiyle Yetişen Mutlu Çocuklar ✨",600,235),p.fillStyle="#1e293b",p.roundRect(240,280,720,90,45),p.fill(),p.strokeStyle="#38bdf8",p.lineWidth=3,p.roundRect(240,280,720,90,45),p.stroke(),p.fillStyle="#ffffff",p.font='bold 34px "Segoe UI", Arial, sans-serif',p.fillText(`📞 2026-2027 Erken Kayıt: ${R}`,600,338)}f();const A=new Ci(v);A.colorSpace=Pe;const T=new Ot(new Fn(3.6,1.26),new fe({map:A,roughness:.3}));g.add(T),[-1.6,1.6].forEach(L=>{const R=new Ot(new Ce(.04,.04,2.7,16),new fe({color:3359061,metalness:.8,roughness:.2}));R.position.set(L,-1.35,-.05),g.add(R)});function S(L,R){d.forEach(w=>{w.sprite.position.y=w.baseY+Math.sin(L*w.speed+w.phase)*.12}),t&&(t.intensity=1.6+Math.sin(L*2.2)*.25)}return{envGroup:e,update:S,updateBillboard:(L,R)=>{f(L,R),A.needsUpdate=!0}}}function Wg(i){const t=new Me;t.name="acousticGuitar",t.position.set(.06,1.1,-.62),t.rotation.set(.22,-.15,.42),i.add(t);const e=new fe({color:12744760,roughness:.28,metalness:.05,name:"topWoodMat"}),n=new fe({color:5514766,roughness:.35,metalness:.08}),r=new fe({color:7877903,roughness:.32}),s=new fe({color:1841431,roughness:.45}),o=new fe({color:13751771,roughness:.2,metalness:.85}),a=new fe({color:16096779,roughness:.25,metalness:.85}),c=new fe({color:16448249,roughness:.2}),l=new ts,u=.52;l.moveTo(0,-.55*u),l.bezierCurveTo(.38*u,-.55*u,.44*u,-.32*u,.42*u,-.12*u),l.bezierCurveTo(.4*u,.02*u,.24*u,.1*u,.26*u,.22*u),l.bezierCurveTo(.28*u,.34*u,.36*u,.44*u,.24*u,.58*u),l.bezierCurveTo(.12*u,.64*u,.04*u,.65*u,0,.65*u),l.bezierCurveTo(-.04*u,.65*u,-.12*u,.64*u,-.24*u,.58*u),l.bezierCurveTo(-.36*u,.44*u,-.28*u,.34*u,-.26*u,.22*u),l.bezierCurveTo(-.24*u,.1*u,-.4*u,.02*u,-.42*u,-.12*u),l.bezierCurveTo(-.44*u,-.32*u,-.38*u,-.55*u,0,-.55*u);const h={steps:1,depth:.115,bevelEnabled:!0,bevelThickness:.016,bevelSize:.014,bevelSegments:5},d=new ia(l,h);d.center();const m=new Ot(d,[e,n]);m.castShadow=!0,m.receiveShadow=!0,t.add(m);const g=new Me;g.position.set(0,.09,.06),t.add(g);const v=new Ce(.052,.052,.03,32),p=new je({color:328707}),f=new Ot(v,p);f.rotation.x=Math.PI/2,g.add(f),[7877903,16448249,165063,16096779,7877903].forEach((X,K)=>{const Ct=.054+K*.0035,J=Ct+.0028,lt=new es(Ct,J,40),vt=new fe({color:X,roughness:.3,side:Qe}),Rt=new Ot(lt,vt);Rt.position.z=.015,g.add(Rt)});const T=new ts;T.absarc(.065,.05,.05,-Math.PI/2,Math.PI/2,!1),T.quadraticCurveTo(.12,-.04,.08,-.09),T.quadraticCurveTo(.04,-.06,.04,0);const S=new ra(T),L=new fe({color:8591427,roughness:.15,metalness:.1}),R=new Ot(S,L);R.position.set(.01,.04,.016),g.add(R);const w=new Me;w.position.set(0,-.16,.062),t.add(w);const D=new Be(.16,.038,.012),y=new Ot(D,s);w.add(y);const x=new Be(.096,.006,.008),C=new Ot(x,c);C.position.set(0,.006,.008),w.add(C);for(let X=0;X<6;X++){const K=-.04+X*.016,Ct=new Ce(.0025,.002,.006,12),J=new Ot(Ct,c);J.rotation.x=Math.PI/2,J.position.set(K,-.008,.007),w.add(J)}const z=new Me;z.position.set(0,.32,.048),t.add(z);const O=.54,W=new Ce(.032,.038,O,20),$=new Ot(W,r);$.position.set(0,O/2,-.018),z.add($);const H=new Be(.068,O,.012),Q=new Ot(H,s);Q.position.set(0,O/2,.006),z.add(Q);const V=[];for(let X=1;X<=18;X++){const K=O*Math.pow(X/20,.88);V.push(K);const Ct=new Ce(.0012,.0012,.066,12),J=new Ot(Ct,o);J.rotation.z=Math.PI/2,J.position.set(0,K,.0125),z.add(J)}[3,5,7,9,12].forEach(X=>{const K=X-1,Ct=(V[K]+(V[K-1]||0))/2;if(X===12)[-.014,.014].forEach(J=>{const lt=new ir(.0032,16),vt=new Ot(lt,c);vt.position.set(J,Ct,.0128),z.add(vt)});else{const J=new ir(.0035,16),lt=new Ot(J,c);lt.position.set(0,Ct,.0128),z.add(lt)}});const _t=new Be(.068,.012,.014),St=new Ot(_t,c);St.position.set(0,O+.006,.007),z.add(St);const Nt=new Me;Nt.position.set(0,O+.012,0),z.add(Nt);const Kt=new Be(.076,.16,.024),Y=new Ot(Kt,r);Y.position.set(0,.08,-.012),Y.rotation.x=-.18,Nt.add(Y);for(let X=0;X<6;X++){const K=X<3?-1:1,J=.035+X%3*.045,lt=new Ce(.003,.003,.02,12),vt=new Ot(lt,a);vt.rotation.z=Math.PI/2,vt.position.set(K*.038,J,-.012),Nt.add(vt);const Rt=new Ce(.008,.008,.006,16),ft=new Ot(Rt,c);ft.rotation.x=Math.PI/2,ft.position.set(K*.052,J,-.012),Nt.add(ft)}const st=[],Et=.076,ct=-.154,Pt=.32+O+.006,Zt=.061;Ho.forEach((X,K)=>{const Ct=-.025+K*.01,J=-.04+K*.016,lt=new P(J,ct,Et),vt=new P(Ct,Pt,Zt),Rt=new P().subVectors(vt,lt),ft=Rt.length(),Bt=new Ce(X.thickness*1.3,X.thickness*1.3,ft,10,16),Lt=new fe({color:X.type==="wound"?14251782:14870768,metalness:.85,roughness:.25,emissive:new qt(X.color),emissiveIntensity:0}),Ft=new Ot(Bt,Lt);Ft.position.addVectors(lt,vt).multiplyScalar(.5),Ft.quaternion.setFromUnitVectors(new P(0,1,0),Rt.clone().normalize()),t.add(Ft),st.push({mesh:Ft,mat:Lt,info:X,startPt:lt,endPt:vt,dir:Rt,length:ft,vibAmp:0,vibPhase:0,origPos:Ft.position.clone()})});const bt=new Me;bt.position.set(0,.03,.075),t.add(bt);const $t=new Be(.24,.16,.05),nt=new je({color:3718648,transparent:!0,opacity:.04,wireframe:!0}),tt=new Ot($t,nt);tt.userData={type:"strum_zone"},bt.add(tt);const b=[];Ho.forEach((X,K)=>{const Ct=-.032+K*.013,J=new Be(.016,.14,.04),lt=new je({color:2278750,transparent:!0,opacity:0}),vt=new Ot(J,lt);vt.position.set(Ct,0,0),vt.userData={type:"string_strip",stringIndex:K,strInfo:X},bt.add(vt),b.push(vt)});const wt=[],it=new Me;it.position.set(-.065,.58,.04),t.add(it),ii.forEach((X,K)=>{const Ct=K%2,J=Math.floor(K/2),lt=Ct*-.055,vt=-J*.072,Rt=new Ce(.024,.024,.012,24),ft=new fe({color:new qt(X.color),roughness:.25,metalness:.1,emissive:new qt(X.color),emissiveIntensity:.25}),Bt=new Ot(Rt,ft);Bt.rotation.x=Math.PI/2,Bt.position.set(lt,vt,0),Bt.userData={type:"chord_pad",chord:X},it.add(Bt);const Lt=document.createElement("canvas");Lt.width=128,Lt.height=128;const Ft=Lt.getContext("2d");Ft.fillStyle=X.color,Ft.beginPath(),Ft.arc(64,64,60,0,Math.PI*2),Ft.fill(),Ft.strokeStyle="#ffffff",Ft.lineWidth=6,Ft.stroke(),Ft.fillStyle="#ffffff",Ft.textAlign="center",Ft.textBaseline="middle",Ft.font="bold 54px Arial, sans-serif",Ft.fillText(X.name,64,52),Ft.font="bold 22px Arial, sans-serif",Ft.fillText(X.turkishName.split(" ")[0],64,94);const U=new Ci(Lt),pt=new ir(.023,24),k=new je({map:U}),j=new Ot(pt,k);j.position.set(0,0,.007),Bt.add(j),wt.push({mesh:Bt,mat:ft,chord:X})});const gt=new Me;z.add(gt);function at(X){for(;gt.children.length>0;){const K=gt.children[0];gt.remove(K)}!X||!X.fingerDots||X.fingerDots.forEach(K=>{const Ct=K.string-1,J=K.fret;if(J<=0)return;const lt=-.025+Ct*.01,vt=J-1,Rt=(V[vt]+(V[vt-1]||0))/2,ft=new Ce(.0055,.0055,.006,16),Bt=new fe({color:new qt(X.color),emissive:new qt(X.color),emissiveIntensity:.9,roughness:.2}),Lt=new Ot(ft,Bt);Lt.rotation.x=Math.PI/2,Lt.position.set(lt,Rt,.014),gt.add(Lt)})}function It(X){const K=st[X];K&&(K.vibAmp=.014,K.vibPhase=0,K.mat.emissiveIntensity=.9)}const ht=new Ot(new ni(.08,12,12),new je({visible:!1}));ht.position.set(-.06,.42,.04),ht.userData={type:"guitar_neck_grab"},t.add(ht);const E=new Ot(new ni(.12,12,12),new je({visible:!1}));E.position.set(0,-.22,.05),E.userData={type:"guitar_body_grab"},t.add(E);const _=new es(.24,.26,32),F=new je({color:16096779,transparent:!0,opacity:0,side:Qe}),q=new Ot(_,F);q.position.set(0,0,.07),t.add(q);function et(X){F.opacity=X?.35:0}function Z(X){st.forEach(K=>{if(K.vibAmp>2e-4){K.vibPhase+=X*65;const Ct=Math.sin(K.vibPhase)*K.vibAmp;K.mesh.position.z=K.origPos.z+Ct,K.vibAmp*=.94,K.mat.emissiveIntensity=Math.max(0,K.mat.emissiveIntensity-X*3.5)}else K.mesh.position.copy(K.origPos),K.mat.emissiveIntensity=0})}function At(X){e.color.setHex(X.bodyColor),n.color.setHex(X.backColor),e.needsUpdate=!0,n.needsUpdate=!0}return{guitarGroup:t,stringMeshes:st,stringColliders:b,strumPlaneMesh:tt,chordTouchPads:wt,neckGrabAnchor:ht,bodyGrabAnchor:E,setGrabHighlight:et,updateFingerGuides:at,triggerStringVisual:It,updateStringVibrations:Z,applyGuitarType:At}}const qe=new lh,ri=new ze(70,window.innerWidth/window.innerHeight,.08,100);ri.position.set(0,1.4,0);const ve=new Gg({antialias:!0,alpha:!1});ve.setPixelRatio(Math.min(window.devicePixelRatio,2));ve.setSize(window.innerWidth,window.innerHeight);ve.xr.enabled=!0;ve.shadowMap.enabled=!0;ve.shadowMap.type=Yc;ve.toneMapping=$c;ve.toneMappingExposure=1.18;document.body.appendChild(ve.domElement);document.body.appendChild(Oi.createButton(ve,{optionalFeatures:["local-floor","bounded-floor","hand-tracking","layers"]}));const Xg=new Qh(16777215,1.35);qe.add(Xg);const aa=new jh(16775149,2);aa.position.set(4,9,5);aa.castShadow=!0;qe.add(aa);const ca=new Jh(16096779,1.8,12);ca.position.set(0,2.8,-.6);qe.add(ca);const qg=Hg(qe,ca),me=Wg(qe),Vt={activeChord:ii[0],activeType:Rn[0],activeSong:null,songStepIdx:0,score:0,lastStrumDir:null,isMuted:!1,holdMode:"handheld",isLeftHolding:!1};me.updateFingerGuides(Vt.activeChord);const os=new Me;os.position.set(0,1.95,-1.25);qe.add(os);const as=document.createElement("canvas");as.width=1200;as.height=290;const Xt=as.getContext("2d"),la=new Ci(as);la.colorSpace=Pe;function cn(i=null,t=null){Xt.clearRect(0,0,1200,290),Xt.fillStyle="#1e293b",Xt.roundRect(8,8,1184,274,38),Xt.fill(),Xt.fillStyle="#0f172a",Xt.roundRect(14,14,1172,262,32),Xt.fill();const e=Vt.activeChord;if(Xt.strokeStyle=e?e.color:"#f59e0b",Xt.lineWidth=5,Xt.roundRect(18,18,1164,254,28),Xt.stroke(),Xt.textAlign="center",Xt.textBaseline="middle",i)Xt.fillStyle="#f59e0b",Xt.font='900 44px "Segoe UI", Arial, sans-serif',Xt.fillText(i,600,95),Xt.fillStyle="#ffffff",Xt.font='bold 30px "Segoe UI", Arial, sans-serif',Xt.fillText(t||"",600,180);else if(Vt.activeSong){const n=Vt.activeSong,r=n.chordsSequence[Vt.songStepIdx],s=ii.find(o=>o.id===r.chordId)||ii[0];Xt.fillStyle="#ffffff",Xt.font='900 36px "Segoe UI", Arial, sans-serif',Xt.fillText(`${n.icon} ${n.title.toUpperCase()} (Adım: ${Vt.songStepIdx+1} / ${n.chordsSequence.length})`,600,72),Xt.fillStyle=s.color,Xt.roundRect(260,120,680,94,47),Xt.fill(),Xt.strokeStyle="#ffffff",Xt.lineWidth=4,Xt.roundRect(260,120,680,94,47),Xt.stroke(),Xt.fillStyle="#ffffff",Xt.font='900 42px "Segoe UI", Arial, sans-serif',Xt.fillText(`AKORU ÇAL: ${s.name} (${s.turkishName}) • ${r.cue}`,600,168)}else{const n=Vt.holdMode==="handheld"?"✋ ELDE TUTMA & ASKI MODU":"📌 SABİT SEHPA MODU";Xt.fillStyle=e?e.color:"#f59e0b",Xt.font='900 42px "Segoe UI", Arial, sans-serif',Xt.fillText(`🎸 NEŞELİ GİTAR • ${e.name} (${e.turkishName.toUpperCase()}) • ${n}`,600,88),Xt.fillStyle="#94a3b8",Xt.font='bold 26px "Segoe UI", Arial, sans-serif',Xt.fillText("Sol elinle gitar sapını tutup kaldır, sağ elinle telleri tara ve çal!",600,175)}la.needsUpdate=!0}const Nl=new Ot(new Fn(2.35,.58),new fe({map:la,roughness:.25}));Nl.rotation.x=.12;os.add(Nl);cn();const ua=new Me;ua.position.set(0,.4,0);os.add(ua);const Fl=[];Rn.forEach((i,t)=>{const e=-.75+t*.5,n=new Be(.44,.12,.04),r=new fe({color:new qt(i.color),roughness:.3,metalness:.1}),s=new Ot(n,r);s.position.set(e,0,0),s.userData={type:"guitar_type_btn",gType:i},ua.add(s),Fl.push(s);const o=document.createElement("canvas");o.width=320,o.height=96;const a=o.getContext("2d");a.fillStyle="#0f172a",a.fillRect(0,0,320,96),a.fillStyle="#ffffff",a.textAlign="center",a.textBaseline="middle",a.font="bold 36px Arial",a.fillText(`${i.icon} ${i.name}`,160,48);const c=new Ci(o),l=new Fn(.42,.11),u=new je({map:c}),h=new Ot(l,u);h.position.set(0,0,.022),s.add(h)});function cs(i){!i||Vt.activeChord===i||(Vt.activeChord=i,me.updateFingerGuides(i),Ge.playEffect("chord_change"),cn(),ur())}function Yg(i){i&&(Vt.activeType=i,me.applyGuitarType(i),Ge.setGuitarType(i.id),Ge.playEffect("success"),cn(`🎸 ${i.name} Seçildi!`,i.subtitle),setTimeout(()=>cn(),2500),ur())}function Ol(){Vt.holdMode=Vt.holdMode==="handheld"?"fixed":"handheld",Ge.playEffect("success");const i=Vt.holdMode==="handheld"?"✋ Elde Tutma & Askı Aktif! Gitar sol elinizle ve vücudunuzla hareket eder.":"📌 Sabit Sehpa Modu! Gitar bulunduğu noktada sabitlendi.";cn(i,"Gitarı elinize alabilir veya sehpadan çalabilirsiniz."),setTimeout(()=>cn(),2800),ur()}let Pc=0;function Un(i="down",t=.88){const e=performance.now();if(!(e-Pc<135)&&(Pc=e,Vt.lastStrumDir=i,Ge.strumChord(Vt.activeChord,i,t,n=>{me.triggerStringVisual(n)}),Vt.activeSong)){const n=Vt.activeSong,r=n.chordsSequence[Vt.songStepIdx];Vt.activeChord.id===r.chordId&&(Vt.score+=10,Vt.songStepIdx++,Vt.songStepIdx>=n.chordsSequence.length?(Vt.songStepIdx=0,Ge.playEffect("success"),cn(`🎉 TEBRİKLER! ${n.title} Tamamlandı!`,`Toplam Puan: ${Vt.score} ⭐⭐⭐`),setTimeout(()=>cn(),3800)):cn())}}function ha(i,t=.9){Ge.pluckString(i,Vt.activeChord,t),me.triggerStringVisual(i)}const ji=new P,Lc=new an,Dc=new Xe(0,0,0,"YXZ"),Qi=new P,Ys=new P,Gr=new P,Vr=new P,Xn=new P,kr=new P,Hr=new P,Uc=new oe,Ic=new an,Nc=new P;function Zg(i,t){if(Vt.holdMode==="fixed"||!ve.xr.isPresenting){me.setGrabHighlight(!1);return}ri.getWorldPosition(ji),ri.getWorldQuaternion(Lc),Dc.setFromQuaternion(Lc,"YXZ");const e=Dc.y;Qi.set(-Math.sin(e),0,-Math.cos(e)).normalize(),Ys.set(Qi.z,0,-Qi.x).normalize(),Vr.copy(ji).addScaledVector(Qi,.26).addScaledVector(Ys,.12),Vr.y=ji.y-.36;const n=i?i.joints.wrist:null,r=i?i.joints["middle-finger-metacarpal"]:null;if(n&&n.visible&&r&&r.visible){r.getWorldPosition(Gr);const u=Gr.distanceTo(Vr);if(u>.18&&u<.85){Xn.subVectors(Gr,Vr).normalize();const h=new P(0,1,0);Hr.crossVectors(Xn,h).normalize(),kr.crossVectors(Hr,Xn).normalize(),kr.applyAxisAngle(Xn,.42),Hr.crossVectors(Xn,kr).normalize(),Uc.makeBasis(Hr,Xn,kr),Ic.setFromRotationMatrix(Uc),Nc.copy(Gr).addScaledVector(Xn,-.48);const d=Math.min(1,t*12);me.guitarGroup.position.lerp(Nc,d),me.guitarGroup.quaternion.slerp(Ic,d),Vt.isLeftHolding=!0,me.setGrabHighlight(!0);return}}Vt.isLeftHolding=!1,me.setGrabHighlight(!1);const s=new P().copy(ji).addScaledVector(Qi,.4).addScaledVector(Ys,.05);s.y=ji.y-.36;const o=new an().setFromAxisAngle(new P(0,1,0),e),a=new an().setFromEuler(new Xe(.22,-.15,.42)),c=new an().multiplyQuaternions(o,a),l=Math.min(1,t*6);me.guitarGroup.position.lerp(s,l),me.guitarGroup.quaternion.slerp(c,l)}const Fc=["wrist","thumb-metacarpal","thumb-phalanx-proximal","thumb-phalanx-distal","thumb-tip","index-finger-metacarpal","index-finger-phalanx-proximal","index-finger-phalanx-intermediate","index-finger-phalanx-distal","index-finger-tip","middle-finger-metacarpal","middle-finger-phalanx-proximal","middle-finger-phalanx-intermediate","middle-finger-phalanx-distal","middle-finger-tip","ring-finger-metacarpal","ring-finger-phalanx-proximal","ring-finger-phalanx-intermediate","ring-finger-phalanx-distal","ring-finger-tip","pinky-finger-metacarpal","pinky-finger-phalanx-proximal","pinky-finger-phalanx-intermediate","pinky-finger-phalanx-distal","pinky-finger-tip"];function Bl(i,t="right"){const e=new Me;e.visible=!1,qe.add(e);const n=new fe({color:t==="right"?3718648:16096779,roughness:.35,metalness:.1}),r={};Fc.forEach(h=>{const m=h.includes("tip")?.012:.009,g=new Ot(new ni(m,12,10),n);e.add(g),r[h]=g});let s=null,o=0;const a=new P,c=new Gi,l=new P;function u(){if(!i)return!1;const h=i.joints.wrist;if(!h||!h.visible)return e.visible=!1,!1;e.visible=!0,Fc.forEach(g=>{const v=i.joints[g],p=r[g];v&&v.visible?(p.visible=!0,p.position.copy(v.position),p.quaternion.copy(v.quaternion)):p.visible=!1});const d=i.joints["index-finger-tip"],m=i.joints["thumb-tip"];if(t==="right"&&d&&d.visible)if(d.getWorldPosition(a),me.strumPlaneMesh.getWorldPosition(l),a.distanceTo(l)<.22){if(s!==null){const v=a.y-s;v<-.018?Un("down",.92):v>.018&&Un("up",.88)}s=a.y,me.stringColliders.forEach(v=>{if(c.setFromObject(v),c.containsPoint(a)){const p=v.userData;ha(p.stringIndex,.95)}})}else s=null;else if(t==="left"){const g=performance.now();if(g-o>300){const v=d&&d.visible?d:m;v&&v.visible&&(v.getWorldPosition(a),me.chordTouchPads.forEach(p=>{const f=new P;p.mesh.getWorldPosition(f),a.distanceTo(f)<.065&&(cs(p.chord),o=g)}))}}return!0}return{container:e,update:u,xrHand:i}}const cr=ve.xr.getHand?ve.xr.getHand(0):null,Bi=ve.xr.getHand?ve.xr.getHand(1):null;let fa=null;const Oc=cr?Bl(cr,"right"):null,Bc=Bi?Bl(Bi,"left"):null;cr&&qe.add(cr);Bi&&qe.add(Bi);[cr,Bi].forEach((i,t)=>{i&&i.addEventListener("connected",e=>{e.data.handedness==="left"&&(fa=i)})});fa=Bi;function zl(i=3718648){const t=new Me,e=new Ot(new Ce(.014,.018,.16,16),new fe({color:i,roughness:.3}));e.rotation.x=Math.PI/2,t.add(e);const n=new Ot(new ni(.02,16,14),new fe({color:16777215,emissive:i,emissiveIntensity:.5}));return n.position.set(0,0,-.09),t.add(n),t}const da=ve.xr.getController(0),Gl=zl(3718648);da.add(Gl);qe.add(da);const pa=ve.xr.getController(1),Vl=zl(16096779);pa.add(Vl);qe.add(pa);[da,pa].forEach(i=>{i.addEventListener("selectstart",()=>{Ge.ensureContext(),Un("down",.95)})});const zc=new nf,Zs=new ot;let ma=!1;window.addEventListener("mousedown",i=>{Ge.ensureContext(),!(i.target.closest("#hud-visor")||i.target.closest("#quest-modal"))&&(ma=!0,kl(i.clientX,i.clientY))});window.addEventListener("mousemove",i=>{ma&&kl(i.clientX,i.clientY,!0)});window.addEventListener("mouseup",()=>{ma=!1});function kl(i,t,e=!1){Zs.x=i/window.innerWidth*2-1,Zs.y=-(t/window.innerHeight)*2+1,zc.setFromCamera(Zs,ri);const n=[...Fl,me.strumPlaneMesh,...me.stringColliders,...me.chordTouchPads.map(s=>s.mesh)],r=zc.intersectObjects(n,!0);if(r.length>0){const o=r[0].object.userData;o.type==="strum_zone"?Un("down",.9):o.type==="string_strip"?ha(o.stringIndex,.95):o.type==="chord_pad"?cs(o.chord):o.type==="guitar_type_btn"&&Yg(o.gType)}}window.addEventListener("keydown",i=>{Ge.ensureContext();const t=i.key;if(t>="1"&&t<="8"){const n=parseInt(t)-1;ii[n]&&cs(ii[n]);return}if(i.code==="Space"||i.code==="Enter"){i.preventDefault(),Un("down",.95);return}if(i.code==="KeyM"){i.preventDefault(),Ol();return}if(i.code==="ArrowUp"){i.preventDefault(),Un("up",.9);return}if(i.code==="ArrowDown"){i.preventDefault(),Un("down",.95);return}const e={KeyQ:0,KeyW:1,KeyE:2,KeyR:3,KeyT:4,KeyY:5};e[i.code]!==void 0&&ha(e[i.code],.95)});function ur(){const i=Vt.activeChord,t=document.getElementById("hud-current-chord");t&&(t.innerText=`${i.name} (${i.turkishName})`,t.style.color=i.color);const e=document.getElementById("hud-current-type");e&&(e.innerText=Vt.activeType.name);const n=document.getElementById("btn-toggle-mode");n&&(n.innerHTML=Vt.holdMode==="handheld"?"✋ Elde Tut":"📌 Sabit",n.title=Vt.holdMode==="handheld"?"Elde Tutma & Askı Modu (Çift El Takibi)":"Sabit Sehpa Modu");const r=document.getElementById("hud-song-label");if(r)if(Vt.activeSong){const s=Vt.activeSong.chordsSequence[Vt.songStepIdx];r.innerText=`🎯 ${Vt.activeSong.title} • Sıradaki: ${s.chordId} (${s.cue})`}else{const s=Vt.holdMode==="handheld"?"Gitar Elde / Kucakta":"Sabit Sehpa";r.innerText=`🌈 Serbest Çalma • ${s}`}document.querySelectorAll(".chord-pill").forEach(s=>{s.classList.toggle("active",s.dataset.chordId===i.id)})}function $g(){const i=document.getElementById("chord-quick-bar");i&&(i.innerHTML="",ii.forEach(t=>{const e=document.createElement("button");e.className=`chord-pill ${t.id===Vt.activeChord.id?"active":""}`,e.dataset.chordId=t.id,e.style.setProperty("--chord-col",t.color),e.innerHTML=`<span class="pill-key">${t.shortcut}</span> <strong>${t.name}</strong> <small>${t.turkishName.split(" ")[0]}</small>`,e.addEventListener("click",()=>{Ge.ensureContext(),cs(t)}),i.appendChild(e)}))}$g();ur();const Gc=document.getElementById("btn-strum-down");Gc&&Gc.addEventListener("click",()=>{Ge.ensureContext(),Un("down",.95)});const $s=document.getElementById("btn-sound");$s&&$s.addEventListener("click",()=>{Vt.isMuted=!Vt.isMuted,Ge.setMuted(Vt.isMuted),$s.innerText=Vt.isMuted?"🔇":"🔊"});const Vc=document.getElementById("btn-toggle-mode");Vc&&Vc.addEventListener("click",()=>{Ol()});const kc=document.getElementById("btn-freeplay");kc&&kc.addEventListener("click",()=>{Vt.activeSong=null,Vt.songStepIdx=0,cn(),ur()});const Hc=document.getElementById("btn-open-guide"),ns=document.getElementById("quest-modal"),Wc=document.getElementById("btn-close-quest");Hc&&ns&&Hc.addEventListener("click",()=>ns.classList.add("visible"));Wc&&ns&&Wc.addEventListener("click",()=>ns.classList.remove("visible"));const Xc=new ef;ve.setAnimationLoop(()=>{const i=Xc.getDelta(),t=Xc.getElapsedTime();qg.update(t),Zg(fa,i),me.updateStringVibrations(i);const e=Oc?Oc.update():!1,n=Bc?Bc.update():!1;Gl.visible=!e,Vl.visible=!n,ve.render(qe,ri)});window.addEventListener("resize",()=>{ri.aspect=window.innerWidth/window.innerHeight,ri.updateProjectionMatrix(),ve.setSize(window.innerWidth,window.innerHeight)});
