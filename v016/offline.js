(async()=>{
 const panel=document.createElement('p');panel.id='offline-status';panel.style.cssText='font-size:14px;color:#333';panel.setAttribute('role','status');
 const host=document.getElementById('main');host.append(panel);
 const show=s=>{panel.textContent=s;};show('Preparazione offline…');
 if(!('serviceWorker' in navigator)){show('Service Worker non disponibile: usare Safari tramite HTTPS.');return;}
 try{
 await navigator.serviceWorker.register('./sw.js',{scope:'./'});
 await navigator.serviceWorker.ready;
 if(!navigator.serviceWorker.controller)await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('Ricaricare la pagina online')),15000);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(t);resolve();},{once:true});if(navigator.serviceWorker.controller){clearTimeout(t);resolve();}});
 const ok=await new Promise((resolve,reject)=>{const ch=new MessageChannel();const t=setTimeout(()=>reject(new Error('Verifica cache non riuscita')),5000);ch.port1.onmessage=e=>{clearTimeout(t);resolve(e.data.ok);};navigator.serviceWorker.controller.postMessage('CHECK_OFFLINE',[ch.port2]);});
 show(ok?'Cache offline verificata. Prima dell’uso, provare in modalità aereo.':'Cache incompleta: ricaricare online.');
 }catch(e){show('Offline non verificato: '+e.message);}
})();
