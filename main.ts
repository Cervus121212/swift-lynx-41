// Tiny stack VM: exact reimplementation of the kit ISA (ISA.md/vm.mjs), all traps 2-11 included.
import{readdirSync as R,readFileSync as F,mkdirSync as K,writeFileSync as W}from'node:fs';
import{join as J}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of R(I).sort()){
const p=F(J(I,d,'program.bin')),q=F(J(I,d,'input.bin')),D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
let s=0,t=0,c=0,pc=0,g=0,j=0,e=0;const n=p.length;
L:for(;;){
if(g==1e6){e=10;break}
if(pc<0||pc>=n){e=9;break}
const x=p[pc];
if(x>0x53||x>7&&x<0x10||x>0x22&&x<0x30||x>0x34&&x<0x40||x>0x41&&x<0x50){e=5;break}
const m=x==1?1:x==2?4:x>=0x30&&x<=0x33?2:0;
if(pc+m>=n){e=9;break}
g++;
const z=x>=0x10&&x<=0x22,A=z&&x!=0x17&&x!=0x1b?2:x==7?3:x==5||x==6||x==0x41?2:x==3||x==4||x==0x17||x==0x1b||x==0x31||x==0x32||x==0x40||x==0x50||x==0x51||x==0x53?1:0,B=x==6||x==7?3:x==4||x==5?2:x==1||x==2||x==0x40||x==0x52||z?1:0;
if(s<A){e=2;break}if(s-A+B>256){e=3;break}
const v=pc+1+m;pc=v;
switch(x){
case 0:e=0;break L;
case 1:D[s++]=(p[v-1]<<24)>>24;break;
case 2:D[s++]=p[v-4]|p[v-3]<<8|p[v-2]<<16|p[v-1]<<24;break;
case 3:s--;break;
case 4:D[s]=D[s-1];s++;break;
case 5:{const a=D[s-1];D[s-1]=D[s-2];D[s-2]=a;break}
case 6:D[s]=D[s-2];s++;break;
case 7:{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;break}
case 0x17:D[s-1]=-D[s-1]|0;break;
case 0x1b:D[s-1]=~D[s-1];break;
case 0x10:case 0x11:case 0x12:case 0x13:case 0x14:case 0x15:case 0x16:case 0x18:case 0x19:case 0x1a:case 0x1c:case 0x1d:case 0x1e:case 0x20:case 0x21:case 0x22:{
const a=D[s-2],b=D[s-1];let r;
if(x==0x10)r=a+b|0;else if(x==0x11)r=a-b|0;else if(x==0x12)r=Math.imul(a,b);
else if(x==0x13){if(!b){e=4;break L}r=a==-2147483648&&b==-1?a:(a/b)|0}
else if(x==0x14){if(!b){e=4;break L}r=b==-1?0:a%b|0}
else if(x==0x15){if(!b){e=4;break L}r=Math.floor((a>>>0)/(b>>>0))|0}
else if(x==0x16){if(!b){e=4;break L}r=(a>>>0)%(b>>>0)|0}
else if(x==0x18)r=a&b;else if(x==0x19)r=a|b;else if(x==0x1a)r=a^b;
else if(x==0x1c)r=a<<(b&31);else if(x==0x1d)r=a>>(b&31);else if(x==0x1e)r=a>>>(b&31)|0;
else if(x==0x20)r=a==b?1:0;else if(x==0x21)r=a<b?1:0;else r=(a>>>0)<(b>>>0)?1:0;
s-=2;D[s++]=r;break}
case 0x30:case 0x31:case 0x32:{
const y=(p[v-2]|p[v-1]<<8)<<16>>16;let f=x==0x30;
if(!f){const w=D[--s];f=x==0x31?w==0:w!=0}
if(f)pc=v+y;break}
case 0x33:if(t==64){e=7;break L}C[t++]=v;pc=p[v-2]|p[v-1]<<8;break;
case 0x34:if(!t){e=8;break L}pc=C[--t];break;
case 0x40:{const a=D[s-1];if(a<0||a>255){e=6;break L}D[s-1]=M[a];break}
case 0x41:{const a=D[s-1],w=D[s-2];if(a<0||a>255){e=6;break L}s-=2;M[a]=w;break}
case 0x50:{const y=String(D[s-1]);if(c+y.length>65536){e=11;break L}for(const h of y)o[c++]=h.charCodeAt(0);s--;break}
case 0x51:if(c+1>65536){e=11;break L}o[c++]=D[--s]&255;break;
case 0x52:D[s++]=j<q.length?q[j++]:-1;break;
case 0x53:e=D[--s]&255;break L;
}
}
K(J(O,d),{recursive:true});
W(J(O,d,'stdout.bin'),o.subarray(0,c));
W(J(O,d,'exit.txt'),e+'\n');
}
