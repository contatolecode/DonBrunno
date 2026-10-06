/* recorta/pinta as imagens (.ph[data-s], opcional data-c="x,y,largura,altura") */
function paint(el,s,c){s=s||el.dataset.s;c=c||el.dataset.c;el.style.backgroundImage='url('+IMG[s]+')';
 if(!c){el.style.backgroundSize='cover';el.style.backgroundPosition=el.dataset.p||'center';return}
 const[x,y,w,h]=c.split(',').map(Number),[W,H]=D[s];el.style.backgroundSize=(W/w*100)+'% auto';
 el.style.backgroundPosition=(w==W?0:x/(W-w)*100)+'% '+(h==H?0:y/(H-h)*100)+'%';el.style.aspectRatio=w+'/'+h}
document.querySelectorAll('.ph[data-s]').forEach(e=>paint(e));
/* menu móvel */
const mm=document.getElementById('mm'),bg=document.getElementById('bg');
bg.onclick=()=>{mm.classList.toggle('o');bg.classList.toggle('o')};
mm.querySelectorAll('a').forEach(a=>a.onclick=()=>{mm.classList.remove('o');bg.classList.remove('o')});
/* aparecer ao rolar */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));

/* cabeçalho compacto ao rolar */
const hd=document.getElementById('hd');const onS=()=>hd.classList.toggle('sc',scrollY>40);addEventListener('scroll',onS,{passive:true});onS();

/* cardápio: logo grande desce devagar e encaixa na logo do cabeçalho */
(function(){
 const cl=document.querySelector('.cb-logo'),bd=document.querySelector('#hd .bdg');if(!cl||!bd)return;
 const fly=cl.cloneNode(true);fly.classList.remove('cb-logo');fly.classList.add('fly');fly.removeAttribute('role');fly.setAttribute('aria-hidden','true');
 document.body.appendChild(fly);
 const ease=t=>t*t*t*(t*(t*6-15)+10);   // suave no começo e no fim
 const SLOW=2.6;                         // quanto maior, mais lenta (mais rolagem para encaixar)
 let pd=0,init=false;
 function frame(){
  const cr=cl.getBoundingClientRect(),W=cr.width,sy=scrollY;
  const cx=cr.left+W/2,cy0=cr.top+W/2+sy;      // posição da logo na página (rolagem 0)
  const br=bd.getBoundingClientRect(),tw=br.width,tx=br.left+tw/2,ty=br.top+tw/2;
  const target=Math.min(1,Math.max(0,sy/(Math.max(1,cy0-ty)*SLOW)));
  pd=init?pd+(target-pd)*0.08:target;init=true;   // inércia: persegue a rolagem
  if(Math.abs(target-pd)<.0005)pd=target;
  const e=ease(pd),x=cx+(tx-cx)*e,y=cy0+(ty-cy0)*e,s=(W+(tw-W)*e)/W;
  fly.style.width=fly.style.height=W+'px';
  fly.style.transform='translate('+(x-W/2)+'px,'+(y-W/2)+'px) scale('+s+')';
  const docked=pd>=1;
  hd.classList.toggle('dk',docked);fly.classList.toggle('gone',docked||mm.classList.contains('o'));
  requestAnimationFrame(frame);
 }
 frame();
})();

/* banner: carrossel de fotos */
(function(){
 const sl=[...document.querySelectorAll('.hero .sl')],dots=[...document.querySelectorAll('.hero .hdots button')],cap=document.querySelector('.hero .hcap');
 if(sl.length<2||!cap)return;
 const cb=cap.querySelector('b'),ci=cap.querySelector('i');let k=0,t;
 const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 function go(n,first){k=(n+sl.length)%sl.length;
  sl.forEach((s,i)=>s.classList.toggle('on',i===k));dots.forEach((d,i)=>d.classList.toggle('on',i===k));
  const set=()=>{cb.textContent=sl[k].dataset.t;ci.textContent=sl[k].dataset.d};
  if(first){set();return}cap.classList.add('sw');setTimeout(()=>{set();cap.classList.remove('sw')},400)}
 function play(){clearInterval(t);if(!reduce)t=setInterval(()=>go(k+1),6500)}
 dots.forEach((d,i)=>d.onclick=()=>{go(i);play()});
 const hero=document.querySelector('.hero');let x0=null;
 hero.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
 hero.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>45){go(k+(dx<0?1:-1));play()}},{passive:true});
 document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(t):play());
 go(0,true);play();
})();
