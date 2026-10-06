/* cardápio em formato de carta (dados em js/data.js) */
const SEC=[
 {k:'Entradas',id:'entradas',photo:'hackepeter-1',p:'50% 50%',cap:'Hackepeter'},
 {k:'Saladas',id:'saladas',photo:'salada-mista',p:'50% 50%',cap:'Salada Mista'},
 {k:'Sopas · Panquecas · Lasanhas',id:'sopas-lasanhas',t:'Sopas, Panquecas e Lasanhas'},
 {k:'Massas',id:'massas',photo:'massa-molho',p:'50% 50%'},
 {k:'Risoto',id:'risoto',photo:'risoto-1',p:'50% 50%',cap:'Risoto ao Funghi'},
 {k:'Nhoque',id:'nhoque',photo:'nhoque-1',p:'50% 50%',cap:'Nhoque ao Molho Italiano'},
 {k:'Carnes',id:'carnes',photo:'file-parmegiana-1',p:'50% 50%',cap:'Filé à Parmegiana'},
 {k:'Frango',id:'frango',photo:'frango-creme',p:'50% 50%'},
 {k:'Mar',id:'mar',photo:'camarao-romanesca',p:'50% 50%',cap:'Camarão à Romanesca'},
 {k:'Sobremesas',id:'sobremesas',photo:'sobremesa-morango-1',p:'50% 50%'}];
/* Fotos dos pratos: "Seção|Nome do item" -> imagens (chaves de js/img.js). Para fotografar mais um prato, é só incluir uma linha aqui. */
const FOTOS={
 'Entradas|Hackpeter':['hackepeter-mesa','hackepeter-2','hackepeter-3','hackepeter-4'],
 'Entradas|Cesta de Pães com 3 Patês':['paes-1','paes-2'],
 'Entradas|Polenta Frita':['polenta-frita'],
 'Risoto|Risoto ao Funghi':['risoto-2'],
 'Nhoque|Molho Italiano':['nhoque-2','nhoque-3'],
 'Carnes|Filé à Parmegiana':['file-parmegiana-2'],
 'Carnes|Filé Mignon Picante':['file-picante'],
 'Mar|Bacalhau à Don Brunno':['bacalhau-1','bacalhau-2'],
 'Sobremesas|Morango Don Brunno':['sobremesa-morango-2','sobremesa-morango-3'],
 'Sobremesas|Petit Gâteau':['petit-gateau'],
 'Sobremesas|Sorvete com Cobertura de Chocolate':['sorvete-chocolate']};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const ORN='<i class="cb-orn" aria-hidden="true"></i>';
let html='';
SEC.forEach((s,n)=>{const rows=M[s.k],t=s.t||s.k;let tag='',call='',li='';
 rows.forEach(r=>{const[a,d]=r.split('|');
  if(a==='1 pessoa'){tag='<span class="cb-tag">1 pessoa</span>';return}
  if(a.startsWith('Opção')){call='<div class="cb-call"><b>'+esc(a)+'</b>'+(d?'<span>'+esc(d)+'</span>':'')+'</div>';return}
  const fo=FOTOS[s.k+'|'+a],tx='<h3>'+esc(a)+'</h3>'+(d?'<p>'+esc(d)+'</p>':'');
  li+=fo?'<li class="hf"><button type="button" class="cb-th" data-g="'+fo.join(',')+'" data-t="'+esc(a).replace(/"/g,'&quot;')+'" aria-label="Ver foto: '+esc(a).replace(/"/g,'&quot;')+'"><span class="ph" data-s="'+fo[0]+'" data-p="50% 50%"></span>'+(fo.length>1?'<b>'+fo.length+'</b>':'')+'</button><div>'+tx+'</div></li>':'<li>'+tx+'</li>'});
 html+='<section class="cb-s '+(n%2?'ti':'tw')+'" id="'+s.id+'"><div class="w">'+
  (s.photo?'<figure class="cb-ph rv"><div class="ph" data-s="'+s.photo+'" data-p="'+s.p+'" role="img" aria-label="'+(s.cap||t)+'"></div><figcaption>'+(s.cap||t)+'</figcaption></figure>':'')+
  '<header class="cb-h rv">'+ORN+'<h2>'+t+'</h2>'+tag+'</header>'+call+'<ul class="cb-g rv">'+li+'</ul></div></section>'});
html+=`<section class="cb-s tw cb-end" id="venha"><div class="w"><div class="cb-ev">
 <div class="ph" data-s="mesas" data-p="50% 40%" role="img" aria-label="Salão da Cantina Don Brunno"></div>
 <div><i class="cb-orn" aria-hidden="true"></i><h2>Venha nos conhecer!</h2>
 <p>Ambiente acolhedor e familiar, com atendimento cuidadoso e personalizado.</p>
 <ul class="cb-info"><li><small>Telefones</small><a href="tel:+554730262156">(47) 3026-2156</a> · <a href="tel:+554734222156">(47) 3422-2156</a></li>
 <li><small>Horário</small>Segunda a sábado, das 18h às 23h</li></ul>
 <p class="cb-bt"><a class="btn sol" href="https://wa.me/5547996663839">Fazer pedido pelo WhatsApp</a></p></div></div></div></section>`;
document.getElementById('menu').innerHTML=html;
document.getElementById('tabs').innerHTML=SEC.map(s=>'<li><a href="#'+s.id+'">'+(s.t?'Sopas · Lasanhas':s.k)+'</a></li>').join('');
document.querySelectorAll('#menu .ph[data-s]').forEach(e=>paint(e));
document.querySelectorAll('#menu .rv').forEach(e=>io.observe(e));
/* categoria ativa nas abas */
const tabs=[...document.querySelectorAll('#tabs a')],ul=document.getElementById('tabs');
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){tabs.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id));
 const a=ul.querySelector('a.on');if(a)ul.scrollTo({left:a.offsetLeft-ul.clientWidth/2+a.offsetWidth/2,behavior:'smooth'})}}),{rootMargin:'-35% 0px -60% 0px'});
SEC.forEach(s=>spy.observe(document.getElementById(s.id)));
if(location.hash){const t=document.querySelector(location.hash);if(t)setTimeout(()=>t.scrollIntoView(),60)}

/* visualizador de fotos dos pratos */
(function(){
 const lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Foto do prato');
 lb.innerHTML='<button type="button" class="x" aria-label="Fechar">×</button><button type="button" class="pv" aria-label="Foto anterior">‹</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="nx" aria-label="Próxima foto">›</button>';
 document.body.appendChild(lb);
 const im=lb.querySelector('img'),cp=lb.querySelector('figcaption');let g=[],i=0,t='',last=null;
 const show=()=>{im.src=IMG[g[i]];im.alt=t;cp.textContent=g.length>1?t+' · '+(i+1)+'/'+g.length:t};
 const close=()=>{lb.classList.remove('o');document.body.style.overflow='';if(last)last.focus()};
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.cb-th');if(!b)return;
  g=b.dataset.g.split(',');i=0;t=b.dataset.t;last=b;lb.classList.toggle('u',g.length<2);show();lb.classList.add('o');document.body.style.overflow='hidden';lb.querySelector('.x').focus()});
 lb.querySelector('.x').onclick=close;lb.onclick=e=>{if(e.target===lb)close()};
 lb.querySelector('.pv').onclick=()=>{i=(i+g.length-1)%g.length;show()};lb.querySelector('.nx').onclick=()=>{i=(i+1)%g.length;show()};
 addEventListener('keydown',e=>{if(!lb.classList.contains('o'))return;if(e.key==='Escape')close();if(g.length>1&&e.key==='ArrowLeft')lb.querySelector('.pv').click();if(g.length>1&&e.key==='ArrowRight')lb.querySelector('.nx').click()});
})();
