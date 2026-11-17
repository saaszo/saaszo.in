'use client';
import {useState,useRef,useEffect,useCallback} from 'react';
import {positiveId,parseMinor,moneyMinor,minorAmount,documentQuery,safePaymentLink,orderMessage} from './collection-policy.mjs';
import {openCollectionCheckout} from './collection-checkout';
import s from './collection-card.module.css';
/** The transport returns the unwrapped server data and throws on any non-2xx response. */
export default function CollectionCard({companyId=0,referenceType='invoice',referenceId=0,propertyId=0,transport,getSessionIdentity,onUpdated=()=>{},publicLink=false}) {
 const scope=`${publicLink?'link':companyId}:${referenceType}:${referenceId}:${propertyId}`;
 const [document,setDocument]=useState(null),[quote,setQuote]=useState(null),[order,setOrder]=useState(null),[amount,setAmount]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[link,setLink]=useState(null),[ledger,setLedger]=useState(null),[opened,setOpened]=useState(publicLink),[uncertain,setUncertain]=useState(false);
 const generation=useRef(0),locked=useRef(false),identity=useRef(getSessionIdentity),keys=useRef(new Map()),lastNotice=useRef(''),callbacks=useRef({transport,onUpdated});
 identity.current=getSessionIdentity;callbacks.current={transport,onUpdated};
 const current=useCallback((epoch,actor)=>generation.current===epoch&&identity.current()===actor,[]);
 useEffect(()=>{generation.current++;locked.current=false;setBusy(false);setDocument(null);setQuote(null);setOrder(null);setLink(null);setLedger(null);setError('');setAmount('');setUncertain(false);setOpened(publicLink);keys.current.clear();lastNotice.current='';return()=>{generation.current++;};},[scope,publicLink]);
 const base=publicLink?'/api/platform/v1/collections/link':`/api/platform/v1/workspaces/${companyId}/collections`;
 const body=()=>({reference_type:referenceType,reference_id:positiveId(referenceId),...(propertyId?{property_id:positiveId(propertyId)}:{})});
 async function call(path,init){return callbacks.current.transport(path,init);}
 async function loadDocument(epoch,actor) {
  const data=await call(publicLink?base:`${base}/document?${documentQuery(referenceType,referenceId,propertyId)}`);
  minorAmount(data.outstanding_minor);if(!current(epoch,actor))return;
  setDocument(data);setAmount((data.outstanding_minor/100).toFixed(2));
 }
 async function action(work) {
  if(locked.current)return;const epoch=generation.current,actor=identity.current();if(!actor){setError('Your session changed. Sign in again or reopen the payment link.');return;}
  locked.current=true;setBusy(true);setError('');
  try{await work(epoch,actor);}catch(reason){if(current(epoch,actor)){setError(reason instanceof Error?reason.message:'Unable to complete the payment action.');if([401,403,404,410].includes(reason?.status)){setDocument(null);setQuote(null);setOrder(null);setLink(null);setLedger(null);}}}
  finally{if(current(epoch,actor)){locked.current=false;setBusy(false);}}
 }
 const refresh=()=>action(async(epoch,actor)=>{setOpened(true);await loadDocument(epoch,actor);});
 async function refreshOrder(epoch,actor,id) {
  const next=await call(`${base}/orders/${encodeURIComponent(id)}`);if(!current(epoch,actor))return;
  setOrder(next);const notice=`${next.order_id}:${next.status}:${next.allocated_minor}:${next.refunded_minor}`;
  if(['paid','captured','applied','partially_refunded','refunded','review_required'].includes(next.status)){
   if(notice!==lastNotice.current){lastNotice.current=notice;callbacks.current.onUpdated();}await loadDocument(epoch,actor);
  }
 }
 useEffect(()=>{if(!order?.order_id||!['created','processing','unknown','authorized'].includes(order.status))return;const epoch=generation.current,actor=identity.current();let requests=0,pending=false;const timer=setInterval(()=>{
  if(pending||requests>=24||!current(epoch,actor)||globalThis.document?.visibilityState==='hidden')return;pending=true;requests++;void refreshOrder(epoch,actor,order.order_id).catch(()=>{}).finally(()=>{pending=false;});
 },5000);return()=>clearInterval(timer);},[order?.order_id,order?.status,scope,current]);
 useEffect(()=>{if(publicLink)void refresh();},[scope,publicLink]);
 const review=()=>action(async(epoch,actor)=>{
  const amount_minor=parseMinor(amount);if(!document||amount_minor>document.outstanding_minor)throw new Error('Amount exceeds current outstanding.');
  const data=await call(`${base}/quotes`,{method:'POST',body:JSON.stringify({...(!publicLink?body():{}),amount_minor})});if(!current(epoch,actor))return;
  setQuote(data);setOrder(null);setUncertain(false);
 });
 const createOrder=()=>action(async(epoch,actor)=>{
  if(!quote?.quote_id)throw new Error('Review the current amount first.');
  const key=keys.current.get(quote.quote_id)||crypto.randomUUID();keys.current.set(quote.quote_id,key);
  setUncertain(true);
  let data;try{data=await call(`${base}/orders`,{method:'POST',body:JSON.stringify({quote_id:quote.quote_id,idempotency_key:key})});}catch(reason){if(current(epoch,actor)&&[400,409,422,503].includes(reason?.status)){setUncertain(false);setQuote(null);}throw reason;}if(!current(epoch,actor))return;
  setOrder(data);setUncertain(false);
  if(data.checkout_allowed===true)await openCollectionCheckout(data,()=>{if(current(epoch,actor))void refreshOrder(epoch,actor,data.order_id).catch(()=>{});},()=>current(epoch,actor));
 });
 const openExisting=()=>action(async(epoch,actor)=>{await refreshOrder(epoch,actor,order.order_id);if(!current(epoch,actor))return;const next=await call(`${base}/orders/${encodeURIComponent(order.order_id)}`);if(!current(epoch,actor))return;setOrder(next);if(next.checkout_allowed===true)await openCollectionCheckout(next,()=>{if(current(epoch,actor))void refreshOrder(epoch,actor,next.order_id).catch(()=>{});},()=>current(epoch,actor));});
 const createLink=()=>action(async(epoch,actor)=>{const data=await call(`${base}/payment-links`,{method:'POST',body:JSON.stringify({...body(),expires_in_hours:24})});if(!current(epoch,actor))return;setLink({...data,url:safePaymentLink(data.url)});});
 const revokeLink=()=>action(async(epoch,actor)=>{await call(`${base}/payment-links/${positiveId(link.id)}/revoke`,{method:'POST',body:'{}'});if(current(epoch,actor))setLink(null);});
 const showLedger=()=>action(async(epoch,actor)=>{const data=await call(`${base}/report?${documentQuery(referenceType,referenceId,propertyId)}`);if(current(epoch,actor))setLedger(data);});
 return <section className={s.card} aria-busy={busy}><h3>{publicLink?'Pay your bill':'Online bill collection'}</h3>
 {!opened?<><p>Review the bill and current outstanding before payment.</p><button onClick={refresh} disabled={busy}>Open payment details</button></>:<>
 <fieldset disabled={busy}>{error&&<p role="alert" className={s.error}>{error}</p>}
 {document?<><p><strong>{document.merchant_name||'Business bill'}</strong><br/>{document.reference||`Bill #${referenceId||''}`}</p>
 <div className={s.amounts}><div><span>Outstanding</span><strong>{moneyMinor(document.outstanding_minor)}</strong></div>{Number.isSafeInteger(document.paid_minor)&&<div><span>Paid</span><strong>{moneyMinor(document.paid_minor)}</strong></div>}</div>
 {document.ready!==true&&<div className={s.notice}>Online payment setup is pending.{Array.isArray(document.missing_setup_reasons)&&document.missing_setup_reasons.map(reason=><p key={reason}>{reason}</p>)}</div>}
 {document.outstanding_minor>0&&document.ready===true&&!order&&!uncertain&&<><label>Amount to pay (INR)<input inputMode="decimal" value={amount} onChange={e=>{setAmount(e.target.value);setQuote(null);}}/></label><div className={s.actions}><button onClick={review} className={s.primary}>Review payment</button></div></>}
 {quote&&!order&&<div className={s.notice}><p>Reviewed amount: <strong>{moneyMinor(quote.amount_minor)}</strong></p><small>The bill is marked paid only after server verification.</small><div className={s.actions}><button onClick={createOrder} className={s.primary}>{uncertain?'Check existing order':'Continue to payment'}</button></div></div>}
 {order&&<div className={s.status} role="status"><p>{orderMessage(order)}</p><small>Order: {order.order_id}</small><div className={s.actions}><button onClick={()=>action((e,a)=>refreshOrder(e,a,order.order_id))}>Check payment status</button>{order.checkout_allowed===true&&<button onClick={openExisting} className={s.primary}>Resume payment</button>}</div></div>}
 <div className={s.actions}><button onClick={refresh}>Refresh outstanding</button>{!publicLink&&document.can_create_link===true&&<button onClick={createLink}>Create payment link</button>}{!publicLink&&document.can_manage===true&&<button onClick={showLedger}>View collection ledger</button>}</div>
 {link&&<div className={s.notice}><p>Payment link ready. Share it only with the intended payer.</p><a href={link.url} target="_blank" rel="noreferrer">Open payer page</a><div className={s.actions}><button onClick={()=>void navigator.clipboard.writeText(link.url)}>Copy link</button><button onClick={revokeLink}>Revoke link</button></div>{link.expires_at&&<small>Expires: {new Date(link.expires_at).toLocaleString()}</small>}</div>}
 {ledger&&<div className={s.table}><h4>Collection ledger</h4>{Array.isArray(ledger.entries)&&ledger.entries.length?<table><thead><tr><th>Entry</th><th>Amount</th><th>Status</th></tr></thead><tbody>{ledger.entries.map(row=><tr key={row.id}><td>{row.event||row.entry_type}</td><td>{moneyMinor(row.amount_minor)}</td><td>{row.status||'Recorded'}</td></tr>)}</tbody></table>:<p className={s.empty}>No collection entries for this bill.</p>}</div>}
 </>:<><p>Load the current bill details to continue.</p><button onClick={refresh}>Load bill</button></>}
 </fieldset>{busy&&<p role="status">Checking your bill…</p>}</>}
 </section>;
}
