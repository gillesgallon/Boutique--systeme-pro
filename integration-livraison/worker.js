// SYSTÈME PRO — EXEMPLE NON DÉPLOYÉ. Ne pas activer sans essais Stripe test.
// Cloudflare Worker + KV (ENTITLEMENTS) + R2 (PACKAGES) + Resend.
// Secrets : STRIPE_WEBHOOK_SECRET, STRIPE_SECRET_KEY, RESEND_API_KEY, FROM_EMAIL, PUBLIC_WORKER_URL.
// AUCUN secret ne doit être enregistré sur GitHub.
const priceProducts = {
  "price_1UXcj8DNrV0hjYPlIy4Jvv0b": ["amigo"],
  "price_1UXcjEDNrV0hjYPl2ASzuGGo": ["totocalcio"],
  "price_1UXcjGDNrV0hjYPl1KwI9SP9": ["hippique"],
  "price_1UXcjRDNrV0hjYPlfUFh1pcm": ["amigo", "totocalcio", "hippique"]
};
const files = { amigo:"amigo/current.zip",totocalcio:"totocalcio/current.zip",hippique:"hippique/current.zip" };
const names = { amigo:"AMIGO SYSTÈME PRO",totocalcio:"TOTOCALCIO PRO",hippique:"HIPPIQUE SYSTÈME PRO" };
const encoder = new TextEncoder();
const json = (data,status=200) => new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json;charset=utf-8","cache-control":"no-store"}});
const hex = bytes => [...bytes].map(b=>b.toString(16).padStart(2,"0")).join("");
const safeEqual = (a,b) => a.length===b.length && [...a].reduce((n,c,i)=>n|(c.charCodeAt(0)^b.charCodeAt(i)),0)===0;
async function verifyStripe(payload, header, secret) {
  const t = header?.match(/(?:^|,)t=(\d+)/)?.[1];
  const signatures = [...(header||"").matchAll(/(?:^|,)v1=([a-f0-9]+)/g)].map(x=>x[1]);
  if(!t || !signatures.length || Math.abs(Date.now()/1000-Number(t))>300) return false;
  const key=await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const digest=hex(new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(t+"."+payload))));
  return signatures.some(sig=>safeEqual(sig,digest));
}
async function stripe(path,env) {
  const r=await fetch("https://api.stripe.com"+path,{headers:{authorization:"Bearer "+env.STRIPE_SECRET_KEY}});
  if(!r.ok)throw Error("Stripe API "+r.status);
  return r.json();
}
function randomToken(){const a=crypto.getRandomValues(new Uint8Array(32));return [...a].map(x=>x.toString(16).padStart(2,"0")).join("");}
async function fulfill(sessionId,env) {
  if(await env.ENTITLEMENTS.get("fulfilled:"+sessionId))return;
  const session=await stripe("/v1/checkout/sessions/"+encodeURIComponent(sessionId),env);
  if(session.mode!=="payment" || session.payment_status!=="paid")return;
  if(!session.customer_details?.email)throw Error("Missing email");
  const lineItems=await stripe("/v1/checkout/sessions/"+encodeURIComponent(sessionId)+"/line_items?limit=100",env);
  const products=new Set();
  for(const li of lineItems.data || []){
    const ids=priceProducts[li.price?.id];
    if(!ids)throw Error("Unknown price in this checkout; check product mapping");
    ids.forEach(id=>products.add(id));
  }
  if(products.size===0)throw Error("No products found");
  const links=[];
  for(const id of products){
    const obj=await env.PACKAGES.head(files[id]);
    if(!obj)throw Error("Missing R2 package "+files[id]);
    const token=randomToken();
    await env.ENTITLEMENTS.put("token:"+token,JSON.stringify({id,email:session.customer_details.email,sessionId}),{expirationTtl:604800});
    links.push({name:names[id],url:env.PUBLIC_WORKER_URL.replace(/\/$/,"")+"/download/"+token});
  }
  const body="Merci pour votre achat SYSTÈME PRO. Voici vos liens de téléchargement (valides 7 jours) :\n\n"+
    links.map(x=>x.name+" : "+x.url).join("\n")+"\n\nConservez vos sauvegardes avant toute mise à jour. Les mises à jour de vos logiciels sont gratuites à vie. Si un lien expire, contactez le vendeur pour un nouveau lien.";
  const sent=await fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:"Bearer "+env.RESEND_API_KEY,"content-type":"application/json"},body:JSON.stringify({from:env.FROM_EMAIL,to:[session.customer_details.email],subject:"Votre commande SYSTÈME PRO — téléchargement",text:body})});
  if(!sent.ok)throw Error("Email delivery "+sent.status);
  await env.ENTITLEMENTS.put("fulfilled:"+sessionId,JSON.stringify({email:session.customer_details.email,products:[...products],at:new Date().toISOString()}));
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==="POST" && url.pathname==="/stripe/webhook"){
   const raw=await request.text();
   if(!await verifyStripe(raw,request.headers.get("stripe-signature"),env.STRIPE_WEBHOOK_SECRET))return json({error:"Invalid signature"},400);
   let event;try{event=JSON.parse(raw)}catch{return json({error:"Invalid JSON"},400)}
   if(["checkout.session.completed","checkout.session.async_payment_succeeded"].includes(event.type)){
    try { await fulfill(event.data.object.id,env); }
    catch(error){console.error("Fulfillment error",String(error));return json({error:"Delivery failed; Stripe retry needed"},500)}
   }
   return json({received:true});
  }
  if(request.method==="GET" && url.pathname.startsWith("/download/")){
   const token=url.pathname.split("/")[2];
   if(!/^[a-f0-9]{64}$/.test(token||""))return new Response("Lien invalide",{status:404});
   const entry=await env.ENTITLEMENTS.get("token:"+token,"json");
   if(!entry || !files[entry.id])return new Response("Lien expiré ou invalide",{status:404});
   const object=await env.PACKAGES.get(files[entry.id]);
   if(!object)return new Response("Fichier indisponible",{status:503});
   return new Response(object.body,{headers:{"content-type":"application/zip","content-disposition":'attachment; filename="'+entry.id.toUpperCase()+"-SYSTEME-PRO.zip"+'"',"cache-control":"private,no-store","x-content-type-options":"nosniff"}});
  }
  return json({service:"SYSTÈME PRO",status:"backend example"});
 }
};