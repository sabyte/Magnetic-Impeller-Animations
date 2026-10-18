/* Magnetic Impeller — dependency-free SVG animations.
 * x = shaft axis; y = up; z = right in the common end view.
 * Ideal source dipole: m = (0, sin(theta), cos(theta)).
 * At the centered point below: B ∝ (0, 2 sin(theta), -cos(theta)).
 * Geometry and prescribed motion are educational, not a finite-magnet/CFD solution.
 */
(function (G) {
  'use strict';
  const TAU = Math.PI * 2;
  const C = {ink:'#17353c',muted:'#61777f',edge:'#bccdd2',faint:'#e5edef',paper:'#ffffff',surface:'#eff4f5',metal:'#9aafb7',north:'#d84646',south:'#2566bd',field:'#a77613',flow:'#16816c'};
  const n = x => Number(x.toFixed(2));
  const esc = s => String(s).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const text=(s,x,y,size=14,fill=C.ink,anchor='middle',weight=400)=>`<text x="${n(x)}" y="${n(y)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle" font-weight="${weight}">${esc(s)}</text>`;
  const line=(a,b,col=C.edge,width=1,dash='')=>`<path d="M${a.map(n)} L${b.map(n)}" fill="none" stroke="${col}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const poly=(pts,fill,stroke='',opacity=1)=>`<polygon points="${pts.map(p=>p.map(n).join(',')).join(' ')}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width=".7"`:''} opacity="${opacity}"/>`;
  const rect=(x,y,w,h,fill=C.surface,stroke=C.edge,rx=0)=>`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
  const circle=(x,y,r,fill='none',stroke=C.edge,width=1)=>`<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  function arrow(a,b,col=C.ink,width=2,dash=''){
    const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
    if(Math.hypot(b[0]-a[0],b[1]-a[1])<1) return '';
    return line(a,b,col,width,dash)+poly([b,[b[0]-8*Math.cos(ang-.45),b[1]-8*Math.sin(ang-.45)],[b[0]-8*Math.cos(ang+.45),b[1]-8*Math.sin(ang+.45)]],col);
  }
  function field(deg,direction){
    const sign=direction==='ccw'?1:-1,theta=sign*deg*Math.PI/180;
    const by=2*Math.sin(theta),bz=-Math.cos(theta),beta=Math.atan2(by,bz);
    return {sign,theta,by,bz,beta,robot:beta+sign*.20,sourceY:Math.sin(theta),sourceZ:Math.cos(theta)};
  }
  function turnArrow(cx,cy,r,ccw){
    const pts=[];
    for(let i=0;i<=40;i++){const a=(-.25+(ccw?1:-1)*i/40*1.6)*Math.PI;pts.push([cx+r*Math.cos(a),cy-r*Math.sin(a)]);}
    return `<polyline points="${pts.map(p=>p.map(n).join(',')).join(' ')}" fill="none" stroke="${C.muted}" stroke-width="1.5"/>`+arrow(pts[39],pts[40],C.muted,1.5);
  }
  function front(w,deg,direction){
    const f=field(deg,direction),x=w/2,sourceY=139,robotY=390;
    let s=text('EXTERNAL MAGNET',x,32,12,C.muted,'middle',600)+text(direction==='ccw'?'↺ Anticlockwise':'↻ Clockwise',x,59,17,C.ink,'middle',600);
    s+=circle(x,sourceY,52,'#f6f9fa',C.edge)+turnArrow(x,sourceY,69,direction==='ccw');
    s+=`<g transform="translate(${n(x)} ${sourceY}) rotate(${-f.theta*180/Math.PI})"><path d="M0,-49 A49,49 0 0 1 0,49 Z" fill="${C.north}"/><path d="M0,49 A49,49 0 0 1 0,-49 Z" fill="${C.south}"/></g>`;
    s+=text('N',x+28*Math.cos(f.theta),sourceY-28*Math.sin(f.theta),16,'#fff','middle',700)+text('S',x-28*Math.cos(f.theta),sourceY+28*Math.sin(f.theta),16,'#fff','middle',700);
    s+=text('Same end of both shafts',x,239,12,C.muted);
    s+=text('ROBOT / IMPELLER',x,273,12,C.muted,'middle',600)+text(direction==='ccw'?'↻ Clockwise':'↺ Anticlockwise',x,300,17,C.ink,'middle',600);
    s+=circle(x,robotY,59,'#f8fbfb',C.edge)+circle(x,robotY,52,'none',C.edge);
    for(let k=0;k<3;k++) s+=`<g transform="translate(${n(x)} ${robotY}) rotate(${-f.robot*180/Math.PI+k*120})"><path d="M0,0 Q34,-44 48,-6 Q43,20 12,12 Z" fill="#d9e4e7" stroke="#92adb6"/></g>`;
    // Both cubes overlap in this end projection; rectangular faces remain transverse.
    s+=`<g transform="translate(${n(x)} ${robotY}) rotate(${-f.robot*180/Math.PI})">${rect(-22,-12,22,24,C.south,'none')}${rect(0,-12,22,24,C.north,'none')}</g>`;
    s+=arrow([x,robotY],[x+49*Math.cos(f.beta),robotY-49*Math.sin(f.beta)],C.field,2.5);
    s+=arrow([x,robotY],[x+43*Math.cos(f.robot),robotY-43*Math.sin(f.robot)],C.ink,1.5,'4 3');
    s+=turnArrow(x,robotY,76,direction!=='ccw');
    s+=text('Parallel shafts · robot centered below magnet',x,480,w<380?12:14,C.muted);
    s+=text('Direction shown from the right-hand shaft ends',x,505,12,C.muted);
    return {body:s,height:530};
  }
  const project=(p,cy)=>[p[0]+.32*p[2],cy-p[1]-.12*p[2]];
  const rotate=(p,a)=>[p[0],p[1]*Math.cos(a)-p[2]*Math.sin(a),p[1]*Math.sin(a)+p[2]*Math.cos(a)];
  function ring(x,cy,r,stroke=C.edge,fill='none'){
    return `<ellipse cx="${n(x)}" cy="${n(cy)}" rx="${n(.32*r)}" ry="${n(r)}" fill="${fill}" stroke="${stroke}" transform="rotate(-2 ${n(x)} ${n(cy)})"/>`;
  }
  function cylinder(x1,x2,r,cy,angle,poles,opacity=1){
    let mesh=[],s='';
    for(let j=0;j<72;j++){
      const a=j*TAU/72,b=(j+1)*TAU/72,mid=(a+b)/2;
      const pts=[[x1,r*Math.cos(a),r*Math.sin(a)],[x2,r*Math.cos(a),r*Math.sin(a)],[x2,r*Math.cos(b),r*Math.sin(b)],[x1,r*Math.cos(b),r*Math.sin(b)]];
      mesh.push({pts,z:Math.sin(mid),fill:poles?(Math.cos(mid-angle)>=0?C.north:C.south):'#cfdbdf'});
    }
    mesh.sort((a,b)=>a.z-b.z).forEach(f=>{s+=poly(f.pts.map(p=>project(p,cy)),f.fill,f.fill);});
    for(let j=0;j<72;j++){
      const a=j*TAU/72,b=(j+1.1)*TAU/72;
      const fill=poles?(Math.cos((a+b)/2-angle)>=0?C.north:C.south):'#dfe8eb';
      s+=poly([[x2,0,0],[x2,r*Math.cos(a),r*Math.sin(a)],[x2,r*Math.cos(b),r*Math.sin(b)]].map(p=>project(p,cy)),fill,fill);
    }
    return `<g opacity="${opacity}">${s}</g>`+ring(x1,cy,r)+ring(x2,cy,r)+line([x1,cy-r],[x2,cy-r])+line([x1,cy+r],[x2,cy+r]);
  }
  function cubes(mid,cy,edge,angle){
    const faces=[];
    for(let k=0;k<2;k++){
      const l=mid+(k-1)*edge,r=l+edge,h=edge/2;
      const v=[[l,-h,-h],[r,-h,-h],[r,h,-h],[l,h,-h],[l,-h,h],[r,-h,h],[r,h,h],[l,h,h]].map(p=>rotate(p,angle));
      for(const [idx,fill] of [[[0,1,5,4],C.south],[[3,2,6,7],C.north],[[0,3,7,4],'#d3e0e5'],[[1,2,6,5],'#d3e0e5'],[[4,5,6,7],'#e1e9ed'],[[0,1,2,3],'#c8d7dd']]){
        const p=idx.map(i=>v[i]);faces.push({p,fill,z:p.reduce((s,p)=>s+p[2],0)/4});
      }
    }
    return faces.sort((a,b)=>a.z-b.z).map(f=>poly(f.p.map(p=>project(p,cy)),f.fill,'#617c88')).join('');
  }
  function side(w,deg,direction,cutaway=true){
    const f=field(deg,direction),small=w<500;
    const l=w*.44,r=w*.81,mid=(l+r)/2,magY=117,tubeY=390;
    const sourceAngle=Math.atan2(f.sourceZ,f.sourceY),robotAngle=Math.PI/2-f.robot;
    let s='';
    // Motor support is behind tubing in this projection.
    s+=rect(w*.045,489,w*.31,13,'#b8cbd1',C.edge,3)+rect(w*.12,173,w*.052,316,'#d9e4e7',C.edge,3)+rect(w*.085,157,w*.26,16,'#a9c0c9',C.edge,3);
    s+=rect(w*.10,91,w*.18,53,'#536e7b','#536e7b',7)+rect(w*.265,98,w*.068,38,'#b4a57b','#9f9169',2);
    for(let k=0;k<3;k++)s+=line([w*.12+k*7,104],[w*.12+k*7,129],'#92aab4',2);
    s+=line([w*.333,magY],[l,magY],'#8b9fa7',6);
    s+=text('N20 motor',w*.20,65,small?12:14,C.ink,'middle',600);
    s+=text('Stand',w*.09,465,12,C.muted);
    s+=text('DIAMETRIC MAGNET',mid,28,small?11:12,C.muted,'middle',600);
    s+=text('20 mm long · Ø9 mm',mid,52,small?12:14,C.ink);
    s+=cylinder(l,r,31,magY,sourceAngle,true);
    // Front-most side label; the two colors encode opposite semicylinders.
    s+=text(f.sourceZ>=0?'N':'S',mid+9,magY,17,'#fff','middle',700);
    s+=text(direction==='cw'?'External ↻ clockwise':'External ↺ anticlockwise',mid,190,small?13:16,C.ink,'middle',600);
    // Local field: side projection plus a depth symbol.
    const fy=267,by=f.by,bz=f.bz;
    s+=text('Local field B',mid,225,13,C.field,'middle',600);
    s+=arrow([mid,fy],[mid,fy-17*by],C.field,2);
    if(Math.abs(bz)>.04){s+=circle(mid,fy,8,'#fff',C.field,1.5);if(bz>0)s+=circle(mid,fy,2,C.field,C.field);else{s+=line([mid-4,fy-4],[mid+4,fy+4],C.field,1.5)+line([mid-4,fy+4],[mid+4,fy-4],C.field,1.5);}}
    s+=text(Math.abs(bz)<.04?(by>0?'↑ Upward':'↓ Downward'):bz>0?'⊙ Toward you':'⊗ Away from you',mid,313,12,C.muted);
    // Transparent tubing and support.
    const tubeL=w*.025,tubeR=w*.975;
    s+=rect(tubeL,tubeY-48,tubeR-tubeL,96,'#f0f7fa','#a9c5d0',4);
    s+=line([tubeL,tubeY-43],[tubeR,tubeY-43],'#d2e3e9')+line([tubeL,tubeY+43],[tubeR,tubeY+43],'#d2e3e9');
    s+=rect(w*.89,tubeY+49,w*.035,50,'#c4d7de',C.edge,2)+rect(w*.865,489,w*.09,13,'#b8cbd1',C.edge,2);
    // Prescribed advection; no CFD or measured velocity is implied.
    for(let i=0;i<34;i++){
      const phase=((i/34+f.sign*deg/360*.65)%1+1)%1;
      const px=tubeL+8+phase*(tubeR-tubeL-16),sgn=i%2?1:-1;
      const py=tubeY+sgn*(35+3*Math.sin(i*2+f.theta));
      s+=circle(px,py,small?1.8:2.3,C.flow,'none');
    }
    const hl=l-8,hr=r-5;
    s+=line([hl-20,tubeY],[hr+20,tubeY],'#6d8997',3);
    for(const x of [hl-15,hr+15]){s+=ring(x,tubeY,36,'#7a9aaa');s+=line([x,tubeY-34],[x,tubeY+34],'#7a9aaa',2)+circle(x,tubeY,5,'#dce8ed','#7a9aaa');}
    // Actual blade outlines are schematic, not an imported CAD mesh.
    s+=cylinder(hl,hr,19,tubeY,robotAngle,false,cutaway?.35:1);
    const bladeFaces=[];
    for(let k=0;k<3;k++)for(let j=0;j<32;j++){
      const q=j/32,Q=(j+1)/32,a=robotAngle+k*TAU/3+q*1.5,A=robotAngle+k*TAU/3+Q*1.5;
      const p=[[hl+(hr-hl)*q,19*Math.cos(a),19*Math.sin(a)],[hl+(hr-hl)*q,34*Math.cos(a),34*Math.sin(a)],[hl+(hr-hl)*Q,34*Math.cos(A),34*Math.sin(A)],[hl+(hr-hl)*Q,19*Math.cos(A),19*Math.sin(A)]];
      bladeFaces.push({p,z:p.reduce((s,v)=>s+v[2],0)/4});
    }
    s+=`<g opacity="${cutaway?.52:.94}">`;
    bladeFaces.sort((a,b)=>a.z-b.z).forEach(face=>{const fill=face.z>0?'#708e9e':'#aec2cd';s+=poly(face.p.map(p=>project(p,tubeY)),fill,fill);});
    s+='</g>';
    if(cutaway){
      s+=cubes(mid,tubeY,Math.min(19,(hr-hl)/5),robotAngle);
      s+=arrow(project([mid,0,0],tubeY),project(rotate([mid,32,0],robotAngle),tubeY),C.ink,1.4,'3 3');
    }
    s+=text(direction==='cw'?'Robot ↺ anticlockwise':'Robot ↻ clockwise',mid,465,small?13:16,C.ink,'middle',600);
    if(cutaway)s+=text(small?'2 touching cube magnets':'2 touching cubes · N–S across the shaft',mid,492,small?11:13,C.muted);
    const flowY=531,leftToRight=direction==='ccw';
    const a=[w*.08,flowY],b=[w*.31,flowY],c=[w*.76,flowY],d=[w*.94,flowY];
    s+=arrow(leftToRight?a:b,leftToRight?b:a,C.flow,2)+arrow(leftToRight?c:d,leftToRight?d:c,C.flow,2);
    s+=text(leftToRight?'Flow →':'← Flow',w*.53,flowY,14,C.flow,'middle',600);
    s+=text(leftToRight?'Inlet':'Outlet',w*.16,557,12,C.muted)+text(leftToRight?'Outlet':'Inlet',w*.85,557,12,C.muted);
    return {body:s,height:580};
  }
  function svgContents(render,width){
    return `<title>Magnetic impeller: educational animation</title><desc>Directions are viewed from the right-hand ends of parallel shafts. Ideal dipole field with prescribed follower motion.</desc><rect width="${n(width)}" height="${render.height}" fill="#ffffff"/><g font-family="Arial, Helvetica, sans-serif">${render.body}</g>`;
  }
  G.MagDemoGeometry={field,front,side,svgContents};
  if(typeof document==='undefined')return;
  const view=document.body.dataset.view;
  if(view==='home'){
    for(const [id,v] of [['front-preview','front'],['side-preview','side']]){
      const svg=document.getElementById(id),width=v==='front'?520:650;
      const r=v==='front'?front(width,25,'ccw'):side(width,28,'cw',true);
      svg.setAttribute('viewBox',`0 0 ${width} ${r.height}`);svg.innerHTML=svgContents(r,width);
    }
    return;
  }
  const $=id=>document.getElementById(id),svg=$('scene'),wrap=$('scene-wrap');
  const state={angle:0,direction:$('direction').value,speed:1,playing:false,cutaway:true,last:null};
  let width=800,exporting=false,animationId=null;
  function render(){
    const r=view==='front'?front(width,state.angle,state.direction):side(width,state.angle,state.direction,state.cutaway);
    svg.setAttribute('viewBox',`0 0 ${width} ${r.height}`);svg.setAttribute('height',r.height);svg.innerHTML=svgContents(r,width);
    $('angle').value=state.angle;$('angle-value').textContent=`${Math.round(state.angle)}°`;
    const cw=state.direction==='cw';
    $('readout').innerHTML=`<span>External <b>${cw?'↻ clockwise':'↺ anticlockwise'}</b></span><span>Robot <b>${cw?'↺ anticlockwise':'↻ clockwise'}</b></span>${view==='side'?`<span>Illustrated flow <b>${cw?'← right to left':'left to right →'}</b></span>`:''}`;
  }
  function stop(){state.playing=false;state.last=null;if(animationId!==null)cancelAnimationFrame(animationId);animationId=null;$('play').textContent='Play';$('play').setAttribute('aria-pressed','false');}
  function tick(now){
    if(!state.playing)return;
    if(state.last!==null)state.angle+=Math.min(now-state.last,100)*.045*state.speed;
    state.last=now;
    if(state.angle>=360){if($('loop').checked)state.angle%=360;else{state.angle=360;stop();}}
    render();if(state.playing)animationId=requestAnimationFrame(tick);
  }
  $('play').addEventListener('click',()=>{if(state.playing){stop();return;}if(state.angle>=360)state.angle=0;state.playing=true;state.last=null;$('play').textContent='Pause';$('play').setAttribute('aria-pressed','true');animationId=requestAnimationFrame(tick);});
  $('reset').addEventListener('click',()=>{stop();state.angle=0;render();});
  $('angle').addEventListener('input',()=>{stop();state.angle=Number($('angle').value);render();});
  $('direction').addEventListener('change',()=>{stop();state.direction=$('direction').value;state.angle=0;render();});
  $('speed').addEventListener('change',()=>{state.speed=Number($('speed').value);});
  if($('cutaway'))$('cutaway').addEventListener('change',()=>{state.cutaway=$('cutaway').checked;render();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  new ResizeObserver(()=>{width=Math.max(280,wrap.clientWidth-(innerWidth<650?8:24));render();}).observe(wrap);
  width=Math.max(280,wrap.clientWidth-(innerWidth<650?8:24));render();
  function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
  function snapshot(){
    // Export a full-size vector layout, independent of the mobile viewport.
    const ew=view==='front'?800:1100,r=view==='front'?front(ew,state.angle,state.direction):side(ew,state.angle,state.direction,state.cutaway);
    return {width:ew,height:r.height,xml:`<svg xmlns="http://www.w3.org/2000/svg" width="${ew}" height="${r.height}" viewBox="0 0 ${ew} ${r.height}">${svgContents(r,ew)}</svg>`};
  }
  $('svg-export').addEventListener('click',()=>{const s=snapshot();download(new Blob([s.xml],{type:'image/svg+xml'}),`${view}-view-${state.direction}-${Math.round(state.angle)}deg.svg`);$('export-status').textContent='SVG saved — scalable at any size.';});
  $('png-export').addEventListener('click',async()=>{
    if(exporting)return;exporting=true;$('png-export').disabled=true;const snap=snapshot(),filename=`${view}-view-${state.direction}-${Math.round(state.angle)}deg.png`;
    const u=URL.createObjectURL(new Blob([snap.xml],{type:'image/svg+xml'}));
    try{
      const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=u;});
      const canvas=document.createElement('canvas');canvas.width=snap.width*3;canvas.height=snap.height*3;canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG export failed');download(blob,filename);$('export-status').textContent=`PNG saved — ${canvas.width} × ${canvas.height} pixels.`;
    }catch(e){$('export-status').textContent='PNG export is unavailable in this browser. Try Download SVG instead.';}
    finally{URL.revokeObjectURL(u);exporting=false;$('png-export').disabled=false;}
  });
})(globalThis);
