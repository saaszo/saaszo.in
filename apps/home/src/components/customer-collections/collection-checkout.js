'use client';
let loading=null;
async function load() {
 if(window.Razorpay)return;
 if(!loading)loading=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://checkout.razorpay.com/v1/checkout.js';script.async=true;
  const fail=()=>{loading=null;script.remove();reject(new Error('Payment checkout could not load. Check the existing order before retrying.'));};
  script.onload=()=>window.Razorpay?resolve(undefined):fail();script.onerror=fail;document.head.appendChild(script);
 });
 await loading;
}
export async function openCollectionCheckout(order,onReturn,isCurrent) {
 if(order.checkout_allowed!==true||order.status!=='created'||!/^order_[A-Za-z0-9]+$/.test(String(order.provider_order_id))||typeof order.key_id!=='string'||!order.key_id||!Number.isSafeInteger(order.amount_minor)||order.amount_minor<=0||order.currency!=='INR')throw new Error('Checkout is unavailable for this order.');
 await load();if(!isCurrent())return;
 const checkout=new window.Razorpay({key:order.key_id,order_id:order.provider_order_id,amount:order.amount_minor,currency:'INR',name:order.merchant_name||'Business payment',description:'Bill payment',handler:onReturn,modal:{ondismiss:onReturn}});
 checkout.on('payment.failed',onReturn);checkout.open();
}
