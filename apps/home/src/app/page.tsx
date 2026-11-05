import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Layers3, ShieldCheck, Grid2X2, ReceiptText, Users, MessageCircle, CheckCheck, ShoppingBag, Store } from "lucide-react";
import styles from "./hub.module.css";

export const metadata: Metadata = {
  title: "SaaSzo — A workspace for every part of your business",
  description: "Explore SaaSzo Invoice, POS, HRMS, Task, Seller, Connect and Engage. Access your business tools through the central SaaSzo workspace.",
  alternates: { canonical: "https://www.saaszo.in" },
  openGraph: { title: "SaaSzo — Your business, brought together", url: "https://www.saaszo.in", type: "website" },
};

const products = [
  {name:"Invoice", category:"Billing & finance", icon:ReceiptText, url:"https://invoice.saaszo.in", text:"Invoices, inventory, purchases and customer collections.", color:"#dbf0de", mark:"01"},
  {name:"POS", category:"Counter operations", icon:Store, url:"https://pos.saaszo.in", text:"Restaurant and retail counter workflows with a connected business account.", color:"#fde7ce", mark:"02"},
  {name:"HRMS", category:"People & teams", icon:Users, url:"https://hrms.saaszo.in", text:"A dedicated workspace for your people and HR operations.", color:"#e9e3fa", mark:"03"},
  {name:"Task", category:"Projects & work", icon:CheckCheck, url:"https://task.saaszo.in", text:"Organise projects, plan tasks and keep your team moving.", color:"#dcecfb", mark:"04"},
  {name:"Seller", category:"Commerce", icon:ShoppingBag, url:"https://seller.saaszo.in", text:"A focused workspace for seller operations and marketplace orders.", color:"#f5e0ea", mark:"05"},
  {name:"Connect", category:"Conversations", icon:MessageCircle, url:"https://connect.saaszo.in", text:"Manage customer contacts, conversations and follow-ups.", color:"#e4edcf", mark:"06"},
  {name:"Engage", category:"Customer engagement", icon:Layers3, url:"https://engage.saaszo.in", text:"Bring campaign and customer engagement work into one place.", color:"#e4e8ff", mark:"07"},
];

export default function Home() {
  return <div className={styles.page}>
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="SaaSzo home"><span className={styles.brandMark}>S</span>SaaSzo<span className={styles.brandNote}>Business, connected.</span></Link>
      <nav aria-label="Main navigation"><a href="#products">Products</a><a href="#workspace">How it works</a><Link href="/auth" className={styles.signIn}>Sign in <ArrowUpRight size={15}/></Link></nav>
    </header>
    <main>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><span/> THE SAASZO BUSINESS SUITE</span>
          <h1>Your business.<br/><em>All together.</em></h1>
          <p>From the first invoice to the next big project. Find the right tools for your business, with one place to manage your account and workspace.</p>
          <div className={styles.actions}><a href="#products" className={styles.primary}>Explore the products <ArrowRight size={18}/></a><Link href="/dashboard" className={styles.secondary}>Open your workspace <ArrowUpRight size={18}/></Link></div>
          <div className={styles.heroFoot}><ShieldCheck size={17}/> One SaaSzo account. Access based on your role and plan.</div>
        </div>
        <div className={styles.workspacePreview} aria-label="Illustration of the SaaSzo product workspace">
          <div className={styles.previewTop}><span><i/><i/><i/></span><small>YOUR WORKSPACE, CONNECTED</small><Grid2X2 size={16}/></div>
          <div className={styles.previewHeading}><div><small>Good work starts here</small><h2>Your next move.</h2></div><span className={styles.livePill}>Workspace preview</span></div>
          <div className={styles.previewGrid}>{products.slice(0,6).map(p=><a href={p.url} key={p.name} className={styles.previewTile}><span style={{background:p.color}}><p.icon size={23}/></span><strong>{p.name}</strong><small>{p.category}</small><ArrowUpRight size={14}/></a>)}</div>
          <div className={styles.previewBottom}><span className={styles.smallLogo}>S</span><span>One workspace.<br/><strong>Room for everything you do.</strong></span><span className={styles.dotLine}>● ● ●</span></div>
          <div className={styles.floatingNote}><ShieldCheck size={20}/><div>Connected by SaaSzo<small>Your team. Your workspace.</small></div></div>
        </div>
      </section>
      <div className={styles.ribbon}><span>LESS SWITCHING.</span><span>MORE CLARITY.</span><span>TOOLS THAT FIT YOUR WORK.</span><ArrowUpRight size={22}/></div>
      <section id="products" className={styles.products}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>FIND YOUR WORKSPACE</span><h2>One suite.<br/>Different ways to get things done.</h2></div><p>Choose a product to explore its workspace.<br/>Available features depend on your access and subscription.</p></div>
        <div className={styles.productGrid}>{products.map(p=><a href={p.url} className={styles.productCard} key={p.name}><div className={styles.productTop}><span className={styles.productIcon} style={{background:p.color}}><p.icon size={27}/></span><span>{p.mark}</span></div><small>{p.category}</small><h3>SaaSzo {p.name}</h3><p>{p.text}</p><strong>Explore {p.name} <ArrowUpRight size={17}/></strong></a>)}
          <article className={styles.moreCard}><Layers3 size={34}/><h3>Start with what you need.<br/>Grow from there.</h3><p>Manage your profile, team and product access from the central hub.</p><Link href="/dashboard">Go to your hub <ArrowRight size={18}/></Link></article>
        </div>
      </section>
      <section id="workspace" className={styles.how}><div><span className={styles.eyebrow}>A CLEARER WAY TO WORK</span><h2>Your account is the starting point.</h2><p>Keep your workspace and team settings together while each product gives its own work the space it deserves.</p><Link href="/auth" className={styles.primary}>Sign in to SaaSzo <ArrowRight size={18}/></Link></div><ol>{[
        ["01","Sign in once","Use your SaaSzo account to enter the central workspace."],
        ["02","Choose your product","Open tools assigned to your workspace and subscription."],
        ["03","Work with your team","Manage branches, staff and permissions from the Control Hub."],
      ].map(([n,title,text])=><li key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>
      <section className={styles.finalCta}><span className={styles.eyebrow}>READY FOR YOUR NEXT MOVE?</span><h2>Make room for better work.</h2><div className={styles.actions}><Link href="/auth" className={styles.primary}>Open SaaSzo <ArrowRight size={18}/></Link><a href="https://invoice.saaszo.in">Looking for Invoice? <ArrowUpRight size={17}/></a></div></section>
    </main>
    <footer className={styles.footer}><Link href="/" className={styles.brand}><span className={styles.brandMark}>S</span>SaaSzo</Link><span>Business tools. A connected workspace.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Contact</Link></div></footer>
  </div>;
}
