"use client";
import type { PlatformOrder } from "./platform-client";

type CheckoutOptions = { key:string; order_id:string; amount:number; currency:string; name:string; description:string; handler:()=>void; modal:{ondismiss:()=>void} };
declare global { interface Window { Razorpay?: new(options:CheckoutOptions)=>{open():void;on(event:string,handler:()=>void):void}; } }
let loader:Promise<void>|null=null;
function loadCheckout():Promise<void> {
  if(window.Razorpay)return Promise.resolve();
  if(loader)return loader;
  loader=new Promise((resolve,reject)=>{
    const script=document.createElement("script");script.src="https://checkout.razorpay.com/v1/checkout.js";script.async=true;
    script.onload=()=>window.Razorpay?resolve():reject(new Error("Checkout could not be loaded."));
    script.onerror=()=>{loader=null;script.remove();reject(new Error("Checkout could not be loaded. Please retry."));};
    document.head.appendChild(script);
  });
  return loader;
}
/** Browser callbacks only request server status; they never activate a subscription. */
export async function openPlatformCheckout(order:PlatformOrder,onReturn:()=>void,isCurrent:()=>boolean):Promise<void> {
  if(!order.checkout_allowed||order.status!=="created"||!order.provider_order_id||!order.key_id||!Number.isSafeInteger(order.amount_minor)||order.amount_minor<=0)throw new Error("Checkout is not available for this order.");
  await loadCheckout();
  if (!isCurrent()) return;
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error("Checkout could not be loaded.");
  const checkout=new Razorpay({key:order.key_id,order_id:order.provider_order_id,amount:order.amount_minor,currency:order.currency,
    name:"SaaSzo",description:"Workspace product subscription",handler:onReturn,modal:{ondismiss:onReturn}});
  checkout.on("payment.failed",onReturn);checkout.open();
}
