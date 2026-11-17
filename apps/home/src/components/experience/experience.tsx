import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { product, suite } from "./product";
import s from "./experience.module.css";

const theme = { "--product-accent": product.color } as CSSProperties;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Mark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 2 5 5-5 5-5-5 5-5Zm0 10 5 5-5 5-5-5 5-5ZM2 12l5-5 5 5-5 5-5-5Zm10 0 5-5 5 5-5 5-5-5Z"
        fill="currentColor"
      />
    </svg>
  );
}
function Brand() {
  return (
    <Link className={s.brand} href="/" aria-label={`${product.name} home`}>
      <span className={s.mark}>
        <Mark />
      </span>
      <span>
        SaaSzo
        {product.key !== "home" ? (
          <strong>{product.name.replace("SaaSzo ", "")}</strong>
        ) : null}
      </span>
    </Link>
  );
}

export function ProductPreview({ compact = false }: { compact?: boolean }) {
  const key = product.key;
  return (
    <div className={`${s.preview} ${compact ? s.compact : ""}`}>
      <div className={s.windowBar}>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{product.name} workspace</span>
        <span className={s.previewLabel}>
          {product.planned ? "CONCEPT" : "ILLUSTRATION"}
        </span>
      </div>
      <div className={s.previewBody}>
        <aside className={s.previewSidebar} aria-hidden="true">
          <span className={s.miniMark}>
            <Mark />
          </span>
          <i />
          <i />
          <i />
          <i />
          <span className={s.sidebarBottom}>S</span>
        </aside>
        <div className={s.previewContent}>
          <div className={s.previewHeading}>
            <div>
              <small>YOUR WORKSPACE</small>
              <h3>
                {key === "home"
                  ? "Everything, in its place."
                  : product.features[0]}
              </h3>
            </div>
            <span className={s.avatar}>S</span>
          </div>
          {key === "home" ? (
            <div className={s.toolGrid}>
              {suite.slice(0, 6).map((item) => (
                <div key={item.key}>
                  <span style={{ background: item.color }}>
                    {item.name.charAt(7)}
                  </span>
                  <strong>{item.name.replace("SaaSzo ", "")}</strong>
                  <small>Workspace ↗</small>
                </div>
              ))}
            </div>
          ) : key === "connect" || key === "engage" ? (
            <div className={s.conversation}>
              <div className={s.channel}>
                #{" "}
                {key === "connect" ? "team-updates" : "customer-conversations"}
                <span>Workspace</span>
              </div>
              <div className={s.message}>
                <b>A</b>
                <p>
                  <strong>
                    {key === "connect"
                      ? "Team update"
                      : "Customer conversation"}
                  </strong>
                  <span>
                    {key === "connect"
                      ? "The project notes are ready to review."
                      : "Hello! Can you help me with my order?"}
                  </span>
                </p>
              </div>
              <div className={s.message}>
                <b>S</b>
                <p>
                  <strong>
                    {key === "connect" ? "Project team" : "Your team"}
                  </strong>
                  <span>
                    {key === "connect"
                      ? "Thanks! Let’s keep the next steps here."
                      : "Of course. Let’s look into it together."}
                  </span>
                </p>
              </div>
              <div className={s.composer}>
                Your next conversation starts here… <span>↑</span>
              </div>
            </div>
          ) : key === "task" ? (
            <div className={s.board}>
              {["To plan", "In progress", "Complete"].map((label, i) => (
                <div key={label}>
                  <small>
                    <i />
                    {label}
                  </small>
                  <article>
                    <span>
                      {["Project brief", "Design review", "Team checklist"][i]}
                    </span>
                    <p>
                      {
                        [
                          "Bring the details together",
                          "Keep work moving",
                          "Ready for the next step",
                        ][i]
                      }
                    </p>
                    <b>{["Planning", "Review", "Done"][i]}</b>
                  </article>
                  <div className={s.skeleton} />
                </div>
              ))}
            </div>
          ) : key === "mantanes" ? (
            <div className={s.property}>
              <div className={s.buildings} aria-hidden="true">
                <div>
                  {Array.from({ length: 12 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <div>
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <span />
              </div>
              <h4>One place for your properties.</h4>
              <p>Society · Commercial · Rental</p>
              <span className={s.statusPill}>
                Management modules coming soon
              </span>
            </div>
          ) : key === "pos" ? (
            <div className={s.posDemo}>
              <div className={s.menuGrid}>
                {["Coffee", "Sandwich", "Fresh juice", "Quick bites"].map(
                  (name, i) => (
                    <div key={name}>
                      <span aria-hidden="true">{["☕", "◒", "◉", "◇"][i]}</span>
                      <strong>{name}</strong>
                    </div>
                  ),
                )}
              </div>
              <div className={s.receipt}>
                <small>CURRENT ORDER</small>
                <h4>Ready at the counter</h4>
                <p>
                  Coffee <span>× 1</span>
                </p>
                <p>
                  Sandwich <span>× 1</span>
                </p>
                <div className={s.receiptLine} />
                <b>Review your bill →</b>
              </div>
            </div>
          ) : key === "studes" ? (
            <div className={s.learning}>
              {["Aa", "123", "अ आ"].map((letter, i) => (
                <div key={letter}>
                  <strong>{letter}</strong>
                  <span>{["English", "Numbers", "Hindi"][i]}</span>
                </div>
              ))}
              <p>Print. Play. Discover.</p>
            </div>
          ) : (
            <div className={s.tableDemo}>
              <div className={s.summaryCards}>
                {product.features.slice(0, 2).map((feature, i) => (
                  <div key={feature}>
                    <small>{feature}</small>
                    <strong>{["Organized.", "Connected."][i]}</strong>
                    <span className={s.meter}>
                      <i style={{ width: i ? "62%" : "84%" }} />
                    </span>
                  </div>
                ))}
              </div>
              <div className={s.tableHead}>
                <span>
                  {key === "invoice"
                    ? "CUSTOMER"
                    : key === "hrms"
                      ? "TEAM MEMBER"
                      : key === "seller"
                        ? "ORDER OVERVIEW"
                        : "WORKSPACE"}
                </span>
                <span>STATUS</span>
              </div>
              {[0, 1, 2].map((i) => (
                <div className={s.tableRow} key={i}>
                  <span className={s.rowIcon}>{["A", "B", "C"][i]}</span>
                  <span className={s.rowLines}>
                    <i />
                    <i />
                  </span>
                  <span className={s.statusPill}>
                    {["Ready", "Review", "Active"][i]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={s.previewFooter}>
        <span>
          <i /> Connected to SaaSzo
        </span>
        <span>
          {product.planned
            ? "Planned experience"
            : "Sample workspace · no customer data"}
        </span>
      </div>
    </div>
  );
}

export function ProductHome() {
  return (
    <div className={s.site} style={theme}>
      <a href="#main-content" className={s.skip}>
        Skip to content
      </a>
      <header className={s.header}>
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#features">
            {product.key === "home" ? "Products" : "Overview"}
          </a>
          <a className={s.suiteLink} href="https://www.saaszo.in">
            SaaSzo suite <Arrow />
          </a>
          <Link href={product.login} className={s.navLogin}>
            Sign in <Arrow />
          </Link>
        </nav>
      </header>
      <main id="main-content" className={s.main}>
        <section className={s.hero} aria-labelledby="home-title">
          <div className={s.heroCopy}>
            <p className={s.kicker}>
              <span />
              {product.kicker}
            </p>
            <h1 id="home-title">
              {product.title.split("\n").map((line, i) => (
                <span key={line} className={i ? s.accentLine : ""}>
                  {line}
                </span>
              ))}
            </h1>
            <p className={s.lead}>{product.description}</p>
            <div className={s.actions}>
              <Link className={s.primary} href={product.login}>
                {product.restricted
                  ? "Administrator sign in"
                  : product.planned
                    ? "Connect your account"
                    : "Open your workspace"}
                <Arrow />
              </Link>
              <a href="#features" className={s.textLink}>
                Take a closer look <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className={s.accountHint}>
              <span aria-hidden="true">◎</span>
              {product.restricted
                ? "Approved administrator accounts only"
                : "Your existing SaaSzo account. Your own workspace."}
            </p>
          </div>
          <div className={s.heroVisual}>
            <span className={s.orbitOne} />
            <span className={s.orbitTwo} />
            <ProductPreview />
            <div className={s.floatNote}>
              <span>✓</span>
              <div>
                <strong>One familiar account.</strong>
                <small>
                  {product.planned
                    ? "A connected foundation for what’s next."
                    : "A focused place to get things done."}
                </small>
              </div>
            </div>
          </div>
        </section>
        <div className={s.benefitStrip}>
          <span>PART OF THE SAASZO SUITE</span>
          <p>
            One account<span> / </span>Connected tools<span> / </span>A
            workspace of your own
          </p>
          <a href="https://www.saaszo.in/dashboard">
            Go to your SaaSzo hub <Arrow />
          </a>
        </div>
        <section id="features" className={s.features}>
          <div className={s.sectionHeading}>
            <p className={s.kicker}>
              {product.key === "home"
                ? "FIND YOUR NEXT WORKSPACE"
                : product.planned
                  ? "THE WORKSPACE WE’RE BUILDING"
                  : "ROOM FOR YOUR EVERYDAY WORK"}
            </p>
            <h2>
              {product.key === "home"
                ? "Different tools. One connected day."
                : product.planned
                  ? "Built around the places you manage."
                  : "The details, brought together."}
            </h2>
            <p>
              {product.planned
                ? "These management modules are planned. Account sign-in is available; the operational tools are still in development."
                : product.restricted
                  ? "Platform access is verified by the central server. Signing in does not grant administrator permissions."
                  : "Less switching between places. More clarity about what comes next."}
            </p>
          </div>
          {product.key === "home" ? (
            <div className={s.products}>
              {suite.map((item) => (
                <a key={item.key} href={`https://${item.key}.saaszo.in`}>
                  <span
                    className={s.productIcon}
                    style={{ background: item.color }}
                  >
                    {item.name.charAt(7)}
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className={s.productBottom}>
                    {item.planned
                      ? "Coming soon · account access"
                      : item.restricted
                        ? "Approved administrators"
                        : "Explore workspace"}
                    <Arrow />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className={s.featureGrid}>
              {product.features.map((feature, i) => (
                <article key={feature}>
                  <span className={s.featureNumber}>
                    0{i + 1}
                    <span aria-hidden="true">{["◇", "⊞", "↗"][i]}</span>
                  </span>
                  <h3>{feature}</h3>
                  <p>{product.featureDetails[i]}</p>
                  {product.planned ? (
                    <span className={s.planned}>Planned module</span>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
        <section className={s.accountSection}>
          <div>
            <p className={s.kicker}>ONE ACCOUNT. A CONNECTED SUITE.</p>
            <h2>
              Your work has a home.
              <br />
              Let’s get you there.
            </h2>
            <p>
              {product.restricted
                ? "Continue with your approved administrator account."
                : "Sign in with your SaaSzo account. Your permissions determine the workspaces and features you can access."}
            </p>
          </div>
          <Link href={product.login} className={s.primary}>
            Continue to{" "}
            {product.key === "home"
              ? "SaaSzo"
              : product.name.replace("SaaSzo ", "")}
            <Arrow />
          </Link>
        </section>
        <section className={s.faq}>
          <h2>A few things to know.</h2>
          <div>
            {[
              [
                "Do I need a separate account?",
                "Use your existing SaaSzo account. Your organization, subscription and assigned permissions determine what you can access.",
              ],
              [
                product.planned
                  ? "Can I manage properties today?"
                  : "Where do I sign in?",
                product.planned
                  ? "You can connect your account now. Building management features are in development and are not yet available for day-to-day operations."
                  : "Select Sign in or Open your workspace. You can use the product login page or choose the SaaSzo portal option.",
              ],
              [
                "How do I switch to another product?",
                "Open the SaaSzo hub to find the products available to your account. Each product keeps its own focused workspace.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <Brand />
        <p>A little more connected. A lot more focused.</p>
        <div>
          <a href="https://www.saaszo.in/privacy">Privacy</a>
          <a href="https://www.saaszo.in/terms">Terms</a>
          <a href="https://www.saaszo.in/contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export function ProductAuth({ children }: { children: ReactNode }) {
  return (
    <main className={s.auth} style={theme}>
      <section className={s.authStory}>
        <Brand />
        <div className={s.authStoryBody}>
          <p className={s.kicker}>{product.kicker}</p>
          <h1>{product.authTitle}</h1>
          <p>{product.authDescription}</p>
          <ProductPreview compact />
          <div className={s.authTags}>
            {product.features.map((item) => (
              <span key={item}>✓ {item}</span>
            ))}
          </div>
        </div>
        <a className={s.backToSuite} href="https://www.saaszo.in">
          Part of the SaaSzo suite <Arrow />
        </a>
      </section>
      <section className={s.authPanel} aria-label="Sign in">
        <div className={s.authTop}>
          <Link href="/">← Back to home</Link>
          <span>YOUR SAASZO ACCOUNT</span>
        </div>
        <div className={s.formFrame}>{children}</div>
        <p className={s.authFoot}>
          {product.restricted
            ? "Access is restricted to approved administrators."
            : "One SaaSzo account. A workspace of your own."}
          <a href="https://www.saaszo.in/privacy">Privacy</a>
        </p>
      </section>
    </main>
  );
}
