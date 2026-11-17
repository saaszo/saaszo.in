'use client';
import {useEffect,useState,useCallback} from 'react';
import CollectionCard from './customer-collections/collection-card';
import styles from './customer-collections/collection-card.module.css';
import {toAbsoluteApiUrl} from '@/lib/config';
const storage='saaszo_payer_link';
export default function PublicBillPayment(){
 const [token,setToken]=useState<string|null>(null),[ready,setReady]=useState(false);
 useEffect(()=>{const params=new URLSearchParams(window.location.hash.slice(1));const raw=params.get('link')||window.sessionStorage.getItem(storage)||'';if(/^[A-Za-z0-9_-]{32,160}$/.test(raw)){window.sessionStorage.setItem(storage,raw);setToken(raw);}else window.sessionStorage.removeItem(storage);window.history.replaceState(null,'',window.location.pathname);setReady(true);},[]);
 const identity=useCallback(()=>token||'',[token]);
 const transport=useCallback(async(path:string,init?:RequestInit)=>{
  if(!token||!path.startsWith('/api/platform/v1/collections/link'))throw new Error('Reopen the original payment link.');
  const response=await fetch(toAbsoluteApiUrl(path),{...init,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{Accept:'application/json','Content-Type':'application/json','X-Collection-Link':token}});
  const payload=await response.json().catch(()=>null);if(!response.ok||payload?.success!==true){const error=new Error(payload?.message||'Payment link could not be checked.') as Error&{status:number};error.status=response.status;throw error;}return payload.data;
 },[token]);
 return <main className={styles.page}><div className={styles.brand}>SaaSzo · Bill payment</div><p>Pay the business or society named on your bill. This payment does not purchase a SaaSzo subscription.</p>{!ready?<p>Opening your payment link…</p>:token?<CollectionCard key={token} publicLink transport={transport} getSessionIdentity={identity}/>:<section className={styles.card}><h1>Payment link required</h1><p>Open the payment link shared by your business or society. You do not need a SaaSzo business account.</p></section>}<p><small>Your receipt and balance update after server verification. If confirmation is pending, check the same order before paying again.</small></p></main>;
}
