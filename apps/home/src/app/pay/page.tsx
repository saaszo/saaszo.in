import type {Metadata} from 'next';
import PublicBillPayment from '@/components/public-bill-payment';
export const metadata:Metadata={title:'Pay your bill',robots:{index:false,follow:false,nocache:true},referrer:'no-referrer'};
export default function Page(){return <PublicBillPayment/>;}
