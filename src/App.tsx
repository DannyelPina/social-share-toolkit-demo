import { useState, useEffect, useRef } from "react";
import { SocialShareBox, SocialShareButton } from "social-share-toolkit/react";

import "./App.css";

const ALL_NETS = [
	{
		key: "facebook",
		label: "Facebook",
		color: "#1877F2",
		icon: "fab fa-facebook-f",
	},
	{
		key: "twitter",
		label: "Twitter / X",
		color: "#1DA1F2",
		icon: "fab fa-twitter",
	},
	{
		key: "linkedin",
		label: "LinkedIn",
		color: "#0A66C2",
		icon: "fab fa-linkedin-in",
	},
	{
		key: "whatsapp",
		label: "WhatsApp",
		color: "#25D366",
		icon: "fab fa-whatsapp",
	},
	{
		key: "telegram",
		label: "Telegram",
		color: "#229ED9",
		icon: "fab fa-telegram-plane",
	},
	{
		key: "pinterest",
		label: "Pinterest",
		color: "#E60023",
		icon: "fab fa-pinterest-p",
	},
	{
		key: "reddit",
		label: "Reddit",
		color: "#FF4500",
		icon: "fab fa-reddit-alien",
	},
	{ key: "email", label: "Email", color: "#6B7280", icon: "fas fa-envelope" },
	{ key: "sms", label: "SMS", color: "#34D399", icon: "fas fa-sms" },
	{ key: "viber", label: "Viber", color: "#7360F2", icon: "fab fa-viber" },
];

function CodeBlock({ code, lang = "jsx" }) {
	const [copied, setCopied] = useState(false);
	const copy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1800);
	};
	const hl = (c) =>
		c
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/(".*?")/g, '<span class="c-str">$1</span>')
			.replace(
				/\b(import|from|export|const|return|function|true|false|null)\b/g,
				'<span class="c-kw">$1</span>',
			)
			.replace(
				/\b(SocialShareBox|SocialShareButton)\b/g,
				'<span class="c-fn">$1</span>',
			)
			.replace(/(\/\/.*)/g, '<span class="c-cm">$1</span>');
	return (
		<div className="code-wrap">
			<div className="code-header">
				<span className="code-lang">{lang}</span>
				<button
					className={`code-copy${copied ? " copied" : ""}`}
					onClick={copy}
				>
					{copied ? "✓ Copied" : "Copy"}
				</button>
			</div>
			<pre>
				<code dangerouslySetInnerHTML={{ __html: hl(code) }} />
			</pre>
		</div>
	);
}

function Counter({ to, suffix = "" }) {
	const [v, setV] = useState(0);
	useEffect(() => {
		let n = 0;
		const s = to / 50;
		const t = setInterval(() => {
			n += s;
			if (n >= to) {
				setV(to);
				clearInterval(t);
			} else setV(Math.floor(n));
		}, 22);
		return () => clearInterval(t);
	}, [to]);
	return (
		<>
			{v}
			{suffix}
		</>
	);
}

function NetBadge({ net, delay }) {
	const [vis, setVis] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) setTimeout(() => setVis(true), delay);
			},
			{ threshold: 0.1 },
		);
		obs.observe(ref.current);
		return () => obs.disconnect();
	}, []);
	return (
		<div ref={ref} className={`net-badge${vis ? " visible" : ""}`}>
			<div
				className="net-icon"
				style={{ background: `${net.color}22`, color: net.color }}
			>
				<i className={net.icon} />
			</div>
			<div>
				<div className="net-name">{net.label}</div>
				<div className="net-key">
					<code>{net.key}</code>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	const [url, setUrl] = useState("https://your-website.com");
	const [text, setText] = useState("Check this out!");
	const [showLabel, setShowLabel] = useState(true);
	const [direction, setDir] = useState("row");
	const [selected, setSel] = useState([
		"facebook",
		"twitter",
		"linkedin",
		"whatsapp",
		"telegram",
	]);
	const [activeTab, setTab] = useState("box");

	const toggle = (key) =>
		setSel((p) =>
			p.includes(key) ? p.filter((k) => k !== key) : [...p, key],
		);

	const boxCode = `import { SocialShareBox } from "social-share-toolkit/react";\n\nfunction App() {\n  return (\n    <SocialShareBox\n      link="${url}"\n      socials={[${selected.map((s) => `"${s}"`).join(", ")}]}\n      text="${text}"\n      showLabel={${showLabel}}\n      direction="${direction}"\n      gap="8px"\n    />\n  );\n}`;

	const btnCode = `import { SocialShareButton } from "social-share-toolkit/react";\n\nfunction App() {\n  return (\n    <>\n      <SocialShareButton network="twitter" link="${url}" text="${text}" />\n      <SocialShareButton\n        network="whatsapp"\n        link="${url}"\n        text="${text}"\n        showLabel={false}\n        style={{ borderRadius: "50px" }}\n      />\n    </>\n  );\n}`;

	return (
		<div className="app">
			<nav className="nav">
				<div className="nav-brand">
					<div className="nav-logo">
						<i className="fas fa-share-nodes" />
					</div>
					<span>social-share-toolkit</span>
				</div>
				<div className="nav-links">
					<a href="#demo">Demo</a>
					<a href="#components">Components</a>
					<a href="#networks">Networks</a>
				</div>
				<a
					className="nav-gh"
					href="https://github.com/DannyelPina/social-share-toolkit"
					target="_blank"
					rel="noopener noreferrer"
				>
					<i className="fab fa-github" /> GitHub
				</a>
			</nav>

			<section className="hero">
				<div className="hero-badge">
					<span className="badge-pill">v1.0.0</span> Zero dependencies
					· React &amp; Vue
				</div>
				<h1 className="hero-title">
					Share anything,
					<br />
					<span className="shimmer">everywhere.</span>
				</h1>
				<p className="hero-sub">
					Lightweight, fully typed social share buttons for React and
					Vue. Drop in a component, pick your networks, ship in
					minutes.
				</p>
				<div className="hero-actions">
					<a href="#demo" className="btn-primary">
						See it live ↓
					</a>
					<div className="install-pill">
						<i
							className="fab fa-npm"
							style={{ color: "#cb3837" }}
						/>
						<code>npm install social-share-toolkit</code>
					</div>
				</div>
				<div className="hero-preview">
					<div className="preview-label">
						Powered by the real library
					</div>
					<SocialShareBox
						link="https://github.com/DannyelPina/social-share-toolkit"
						socials={[
							"facebook",
							"twitter",
							"linkedin",
							"whatsapp",
							"telegram",
						]}
						text="Check out social-share-toolkit!"
						showLabel={true}
						direction="row"
						gap="8px"
					/>
				</div>
				<div className="hero-stats">
					{[
						{ val: 10, suffix: "", label: "Networks" },
						{ val: 0, suffix: " deps", label: "Runtime" },
						{ val: 100, suffix: "%", label: "TypeScript" },
					].map(({ val, suffix, label }) => (
						<div key={label} className="stat">
							<div className="stat-val">
								<Counter to={val} suffix={suffix} />
							</div>
							<div className="stat-lbl">{label}</div>
						</div>
					))}
				</div>
			</section>

			<section id="demo" className="section demo-section">
				<div className="section-inner">
					<h2 className="section-title">Interactive Demo</h2>
					<p className="section-sub">
						Tweak the options — the preview updates live using the
						real library
					</p>
					<div className="inputs-grid">
						{[
							{
								label: "URL to share",
								val: url,
								set: setUrl,
								ph: "https://your-website.com",
							},
							{
								label: "Share text",
								val: text,
								set: setText,
								ph: "Check this out!",
							},
						].map(({ label, val, set, ph }) => (
							<label key={label} className="field">
								<span>{label}</span>
								<input
									value={val}
									onChange={(e) => set(e.target.value)}
									placeholder={ph}
								/>
							</label>
						))}
					</div>
					<div className="toggles">
						<button
							className={`tog${showLabel ? " on" : ""}`}
							onClick={() => setShowLabel(!showLabel)}
						>
							{showLabel ? "Labels: On" : "Labels: Off"}
						</button>
						<button
							className={`tog${direction === "row" ? " on" : ""}`}
							onClick={() => setDir("row")}
						>
							Row
						</button>
						<button
							className={`tog${direction === "column" ? " on" : ""}`}
							onClick={() => setDir("column")}
						>
							Column
						</button>
					</div>
					<div className="picker-label">
						Networks ({selected.length} selected)
					</div>
					<div className="picker">
						{ALL_NETS.map((n) => (
							<button
								key={n.key}
								className={`pick-btn${selected.includes(n.key) ? " on" : ""}`}
								style={
									selected.includes(n.key)
										? {
												background: `${n.color}22`,
												borderColor: `${n.color}80`,
												color: n.color,
											}
										: {}
								}
								onClick={() => toggle(n.key)}
							>
								<i className={n.icon} />
								{n.label}
							</button>
						))}
					</div>
					<div className="live-box">
						<div className="live-label">
							Live Preview — <strong>real SocialShareBox</strong>
						</div>
						{selected.length > 0 ? (
							<SocialShareBox
								link={url}
								socials={selected}
								text={text}
								showLabel={showLabel}
								direction={direction}
								gap="8px"
							/>
						) : (
							<p className="empty">
								Select at least one network above
							</p>
						)}
					</div>
					<CodeBlock code={boxCode} lang="jsx" />
				</div>
			</section>

			<section id="components" className="section">
				<div className="section-inner">
					<h2 className="section-title">Components</h2>
					<p className="section-sub">
						Two components covering every use case
					</p>
					<div className="tabs">
						{[
							{ id: "box", label: "SocialShareBox" },
							{ id: "btn", label: "SocialShareButton" },
						].map((t) => (
							<button
								key={t.id}
								className={`tab${activeTab === t.id ? " on" : ""}`}
								onClick={() => setTab(t.id)}
							>
								{t.label}
							</button>
						))}
					</div>

					{activeTab === "box" && (
						<div>
							<div className="props-grid">
								{[
									{
										p: "link",
										t: "string",
										req: true,
										d: "URL to share",
									},
									{
										p: "socials",
										t: "NetworkKey[]",
										req: false,
										d: "Networks to show (default: all)",
									},
									{
										p: "text",
										t: "string",
										req: false,
										d: "Share text or tweet body",
									},
									{
										p: "showLabel",
										t: "boolean",
										req: false,
										d: "Show network name on buttons",
									},
									{
										p: "direction",
										t: '"row" | "column"',
										req: false,
										d: "Flex direction of the wrapper",
									},
									{
										p: "gap",
										t: "string",
										req: false,
										d: "Gap between buttons (CSS value)",
									},
									{
										p: "buttonStyle",
										t: "CSSProperties",
										req: false,
										d: "Inline styles for every button",
									},
									{
										p: "className",
										t: "string",
										req: false,
										d: "Extra class on the wrapper",
									},
								].map(({ p, t, req, d }) => (
									<div key={p} className="prop-card">
										<div className="prop-top">
											<code className="prop-name">
												{p}
											</code>
											{req && (
												<span className="req-badge">
													required
												</span>
											)}
										</div>
										<div className="prop-type">{t}</div>
										<div className="prop-desc">{d}</div>
									</div>
								))}
							</div>
							<div className="component-demo">
								<div className="live-label">
									Column layout · no labels · pill style
								</div>
								<SocialShareBox
									link="https://github.com/DannyelPina/social-share-toolkit"
									socials={["twitter", "linkedin", "reddit"]}
									text="Check out social-share-toolkit!"
									showLabel={false}
									direction="column"
									gap="6px"
									buttonStyle={{
										borderRadius: "50px",
										fontSize: "13px",
									}}
								/>
							</div>
						</div>
					)}

					{activeTab === "btn" && (
						<div>
							<div className="props-grid">
								{[
									{
										p: "network",
										t: "NetworkKey",
										req: true,
										d: "The social network to share to",
									},
									{
										p: "link",
										t: "string",
										req: true,
										d: "URL to share",
									},
									{
										p: "text",
										t: "string",
										req: false,
										d: "Share text or tweet body",
									},
									{
										p: "subject",
										t: "string",
										req: false,
										d: "Email subject (used with 'email')",
									},
									{
										p: "showLabel",
										t: "boolean",
										req: false,
										d: "Show network name next to icon",
									},
									{
										p: "style",
										t: "CSSProperties",
										req: false,
										d: "Override button inline styles",
									},
									{
										p: "className",
										t: "string",
										req: false,
										d: "Extra CSS class on the button",
									},
								].map(({ p, t, req, d }) => (
									<div key={p} className="prop-card">
										<div className="prop-top">
											<code className="prop-name">
												{p}
											</code>
											{req && (
												<span className="req-badge">
													required
												</span>
											)}
										</div>
										<div className="prop-type">{t}</div>
										<div className="prop-desc">{d}</div>
									</div>
								))}
							</div>
							<div className="component-demo">
								<div className="live-label">
									Individual SocialShareButton instances
								</div>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										gap: 8,
									}}
								>
									<SocialShareButton
										network="twitter"
										link={url}
										text={text}
									/>
									<SocialShareButton
										network="whatsapp"
										link={url}
										text={text}
										style={{ borderRadius: "50px" }}
									/>
									<SocialShareButton
										network="linkedin"
										link={url}
										showLabel={false}
									/>
									<SocialShareButton
										network="telegram"
										link={url}
										text={text}
										style={{ fontSize: "12px" }}
									/>
									<SocialShareButton
										network="reddit"
										link={url}
										text={text}
										showLabel={false}
										style={{ borderRadius: "50px" }}
									/>
								</div>
							</div>
							<CodeBlock code={btnCode} lang="jsx" />
						</div>
					)}
				</div>
			</section>

			<section id="networks" className="section networks-section">
				<div className="section-inner">
					<h2 className="section-title">10 Networks, Ready to Go</h2>
					<p className="section-sub">
						Every major platform out of the box
					</p>
					<div className="net-grid">
						{ALL_NETS.map((net, i) => (
							<NetBadge key={net.key} net={net} delay={i * 55} />
						))}
					</div>
				</div>
			</section>

			<section className="cta-section">
				<div className="cta-icon">
					<i className="fas fa-share-nodes" />
				</div>
				<h2 className="cta-title">Get started in seconds</h2>
				<p className="cta-sub">
					Zero runtime dependencies. React 17+ and Vue 3. Full
					TypeScript.
				</p>
				<CodeBlock
					code={`npm install social-share-toolkit`}
					lang="bash"
				/>
				<a
					className="gh-link"
					href="https://github.com/DannyelPina/social-share-toolkit"
					target="_blank"
					rel="noopener noreferrer"
				>
					<i className="fab fa-github" /> View on GitHub
				</a>
			</section>

			<footer className="footer">
				<span>social-share-toolkit · MIT License</span>
				<a
					href="https://github.com/DannyelPina"
					target="_blank"
					rel="noopener noreferrer"
				>
					by DannyelPina
				</a>
			</footer>
		</div>
	);
}
