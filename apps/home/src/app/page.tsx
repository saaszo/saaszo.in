import Link from "next/link";
import { ContactForm } from "@/components/digital/DigitalForms";
import { DigitalMarketingShell } from "@/components/digital/DigitalMarketingShell";
import { HashRedirectGuard } from "@/components/digital/HashRedirectGuard";
import {
  getDigitalBlogs,
  getDigitalBootstrap,
  industryPages,
  digitalAssetUrl,
  marketingContact,
  normalizeOldDigitalLink,
  servicePages,
} from "@/lib/digital-marketing";

const stats = [
  { value: "100+", label: "Active Clients" },
  { value: "50K+", label: "Leads Generated" },
  { value: "10Cr+", label: "Revenue Driven" },
  { value: "24/7", label: "Support System" },
];

const trusted = ["TechCorp", "FinGroup", "EcoHealth", "EduLearn", "PropEstate"];
const serviceIcons = [
  "track_changes",
  "trending_up",
  "forum",
  "web",
  "search",
  "payments",
];
const methodSteps = [
  "Deep Market Research & Strategy",
  "High-Converting Funnel Setup",
  "Optimization & Scaling",
];
const approachCards = [
  {
    icon: "biotech",
    title: "Research",
    text: "Competitor analysis and audience targeting.",
  },
  {
    icon: "bolt",
    title: "Launch",
    text: "Executing campaigns with precision.",
  },
  { icon: "bar_chart", title: "Analyze", text: "Data-driven decisions." },
  {
    icon: "rocket_launch",
    title: "Scale",
    text: "Increasing budget profitably.",
  },
];
const industryIcons = ["dentistry", "villa", "shopping_bag", "fitness_center"];

export default async function Home() {
  const [bootstrap, blogs] = await Promise.all([
    getDigitalBootstrap(),
    getDigitalBlogs(),
  ]);
  const hero = bootstrap.hero_slides[0];
  const featuredBlogs = blogs.slice(0, 1);
  const featuredReviews = bootstrap.reviews.slice(0, 1);

  return (
    <DigitalMarketingShell>
      <HashRedirectGuard />
      <section className="digital-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-20">
          <div>
            <p className="hero-kicker">
              Performance marketing, SEO, and paid ads solutions built to
              increase visibility and generate consistent leads.
            </p>
            <h1>{hero?.heading || "Scale Your Business Online"}</h1>
            <p className="hero-copy">
              Experience the difference with our premium services designed to
              scale your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                className="digital-primary"
                href={normalizeOldDigitalLink(hero?.cta_link) || "/audit"}
              >
                Get Free Audit
                <span className="material-symbols-rounded text-base">
                  arrow_forward
                </span>
              </Link>
              <a
                className="hero-outline-button"
                href={
                  normalizeOldDigitalLink(hero?.cta_2_link) ||
                  marketingContact.whatsappHref
                }
              >
                Whatsapp Now
              </a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-dot-grid" />
            <div
              className="hero-visual-image"
              style={{
                backgroundImage: `url("${digitalAssetUrl(
                  "assets/images/19197419.webp",
                )}")`,
              }}
            />
            <span className="hero-visual-line" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="stats-strip">
            {stats.map((stat) => (
              <div className="stat-item" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trusted-strip">
        <p>Trusted by industry leaders</p>
        <div>
          {trusted.map((brand) => (
            <span key={brand}>{brand}</span>
          ))}
        </div>
      </section>

      <section className="home-section bg-[#f5f7fb]" id="tools">
        <div className="section-head section-head-split">
          <div>
            <p className="section-kicker">Our expertise</p>
            <h2>Everything You Need To Scale Your Business</h2>
          </div>
          <Link href="/services">View All Services</Link>
        </div>
        <div className="services-grid">
          {servicePages.map((service, index) => (
            <Link
              className={index === 1 ? "service-pill featured" : "service-pill"}
              href={`/services/${service.slug}`}
              key={service.slug}
            >
              <span className="service-icon material-symbols-rounded">
                {serviceIcons[index] || "add"}
              </span>
              <span>
                <strong>{service.title}</strong>
                <small>{service.summary}</small>
              </span>
              <span className="service-arrow material-symbols-rounded">
                arrow_forward
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="approach-section" id="approach">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="section-kicker text-indigo-300">Our methodology</p>
            <h2>We Don&apos;t Guess. We Engineer Growth.</h2>
            <p>
              Most agencies launch ads and hope for the best. We use a 6-step
              proven framework to ensure every campaign delivers maximum ROI.
            </p>
            <ol className="mt-7 grid gap-4">
              {methodSteps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <Link className="white-button mt-8" href="/about">
              View Full 6-Step Process
            </Link>
          </div>
          <div className="approach-card-grid">
            {approachCards.map((card) => (
              <div className="approach-card" key={card.title}>
                <span className="material-symbols-rounded">{card.icon}</span>
                <strong>{card.title}</strong>
                <small>{card.text}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-head text-center">
          <p className="section-kicker">Specialized niches</p>
          <h2>Industries We Dominate</h2>
          <p>
            We don&apos;t do &quot;everything for everyone&quot;. We build
            specialized growth engines for specific high-intent industries.
          </p>
        </div>
        <div className="industry-grid">
          {industryPages.slice(1, 5).map((industry, index) => (
            <Link
              className="industry-pill"
              href={`/industries/${industry.slug}`}
              key={industry.slug}
            >
              <span className="material-symbols-rounded">
                {industryIcons[index] || "business_center"}
              </span>
              <span>
                <strong>{industry.title}</strong>
                <small>Lead generation and growth systems</small>
              </span>
              <span className="material-symbols-rounded">arrow_forward</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link className="dark-button" href="/industries">
            See All Industries We Serve
            <span className="material-symbols-rounded text-base">
              arrow_forward
            </span>
          </Link>
        </div>
      </section>

      <section className="reviews-section">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="section-head text-center">
            <p className="section-kicker">Client stories</p>
            <h2>What Our Clients Say</h2>
            <p className="rating-line">★★★★★ 4.9/5.0 on Google Reviews</p>
          </div>
          <div className="review-card">
            {featuredReviews.length ? (
              featuredReviews.map((review) => (
                <div key={review.id}>
                  <div className="avatar">
                    {review.reviewer_name.slice(0, 1)}
                  </div>
                  <strong>{review.reviewer_name}</strong>
                  <span>
                    {review.reviewer_designation ||
                      review.review_source ||
                      "Client"}
                  </span>
                  <p>★★★★★</p>
                  <blockquote>&quot;{review.review_text}&quot;</blockquote>
                  <small>FEB 21, 2026</small>
                </div>
              ))
            ) : (
              <div>
                <div className="avatar">S</div>
                <strong>SaaSzo client</strong>
                <span>Growth partner</span>
                <p>★★★★★</p>
                <blockquote>&quot;Very good company.&quot;</blockquote>
                <small>FEB 21, 2026</small>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="section-kicker">Get in touch</p>
            <h2>
              Let&apos;s Build Your <span>Growth Engine</span>
            </h2>
            <p>
              Ready to scale? Fill out the form or reach out directly. We
              analyze your business and provide a custom growth plan.
            </p>
            <div className="contact-methods">
              <a href={marketingContact.phoneHref}>
                <span className="material-symbols-rounded">call</span>
                <strong>Call Us Directly</strong>
                <small>Mon-Sat, 10am - 7pm</small>
                <b>{marketingContact.phone}</b>
              </a>
              <a href={marketingContact.whatsappHref}>
                <span className="material-symbols-rounded">chat</span>
                <strong>WhatsApp Chat</strong>
                <small>Instant Response</small>
                <b>Chat Now</b>
              </a>
              <a href={`mailto:${marketingContact.email}`}>
                <span className="material-symbols-rounded">mail</span>
                <strong>Email Us</strong>
                <small>For Proposals & Inquiries</small>
                <b>{marketingContact.email}</b>
              </a>
            </div>
          </div>
          <div className="lead-form-card">
            <ContactForm source="/" />
            <p className="form-note">
              Your data is safe with us. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      {featuredBlogs.length ? (
        <section className="home-section pt-0">
          <div className="section-head section-head-split">
            <div>
              <p className="section-kicker">Latest blog</p>
              <h2>Growth ideas from SaaSzo Digital</h2>
            </div>
            <Link href="/blog">View Blog</Link>
          </div>
          {featuredBlogs.map((blog) => (
            <Link
              className="blog-preview"
              href={`/blog/${blog.slug}`}
              key={blog.id}
            >
              <span>{blog.category?.name || "Marketing"}</span>
              <strong>{blog.title}</strong>
              <p>{blog.excerpt || "Read the latest SaaSzo Digital update."}</p>
            </Link>
          ))}
        </section>
      ) : null}
    </DigitalMarketingShell>
  );
}
