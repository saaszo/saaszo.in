'use client';
import {useState,useEffect,useRef} from 'react';
import CollectionCard from './collection-card';
import {positiveId,moneyMinor} from './collection-policy.mjs';
import s from './collection-card.module.css';
export default function CollectionManager({transport,getSessionIdentity}) {
 const [company,setCompany]=useState(0),[type,setType]=useState('invoice'),[search,setSearch]=useState(''),[items,setItems]=useState([]),[selected,setSelected]=useState(null),[manual,setManual]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(false);
 const generation=useRef(0),refs=useRef({transport,getSessionIdentity});refs.current={transport,getSessionIdentity};
 useEffect(()=>{let alive=true;const actor=refs.current.getSessionIdentity();setCompany(0);setItems([]);setSelected(null);if(!actor)return;
  void refs.current.transport('/api/auth/profile').then(profile=>{if(alive&&actor===refs.current.getSessionIdentity())setCompany(positiveId(profile.company?.id));}).catch(reason=>{if(alive)setError(reason.message||'Unable to load your workspace.');});return()=>{alive=false;generation.current++;};
 },[]);
 useEffect(()=>{generation.current++;setSelected(null);setItems([]);setError('');setLoading(false);},[type,company]);
 async function find(event) {event?.preventDefault();if(!company||loading)return;const epoch=++generation.current,actor=refs.current.getSessionIdentity();setLoading(true);setError('');setItems([]);
  try{const query=new URLSearchParams({reference_type:type,q:search,page:'1'});const data=await refs.current.transport(`/api/platform/v1/workspaces/${company}/collections/documents?${query}`);if(epoch!==generation.current||actor!==refs.current.getSessionIdentity())return;setItems(Array.isArray(data.items)?data.items:[]);}
  catch(reason){if(epoch===generation.current)setError(reason.message||'Unable to find current bills.');}finally{if(epoch===generation.current)setLoading(false);}
 }
 return <div><section className={s.card}><h2>Online customer collections</h2><p>Choose an existing bill to review dues, create a payer link and check verified receipts. Software subscription billing stays separate.</p>
 {error&&<p className={s.error} role="alert">{error}</p>}
 <form onSubmit={find}><label>Bill type<select value={type} onChange={e=>setType(e.target.value)}><option value="invoice">Invoice</option><option value="sale">POS sale</option></select></label><label>Find invoice / bill number<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Enter bill number"/></label><button disabled={!company||loading}>{loading?'Searching…':'Find bills'}</button></form>
 {items.length>0&&<label>Existing bill<select value={selected?.id||''} onChange={e=>setSelected(items.find(row=>String(row.id)===e.target.value)||null)}><option value="">Choose bill</option>{items.map(row=><option key={row.id} value={row.id}>{row.reference} · {moneyMinor(row.outstanding_minor)} outstanding</option>)}</select></label>}
 <details><summary>Open a known internal bill ID</summary><label>Internal bill ID<input inputMode="numeric" value={manual} onChange={e=>setManual(e.target.value)}/></label><button disabled={!company} onClick={()=>{try{setSelected({id:positiveId(manual),reference_type:type});setError('');}catch(reason){setError(reason.message);}}}>Open bill</button></details>
 </section>{company>0&&selected&&selected.reference_type===type&&<div style={{marginTop:16}}><CollectionCard key={`${company}:${type}:${selected.id}`} companyId={company} referenceType={type} referenceId={selected.id} transport={transport} getSessionIdentity={getSessionIdentity}/></div>}</div>;
}
