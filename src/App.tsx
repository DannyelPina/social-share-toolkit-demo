import { useState, type ReactNode } from "react";
import { SocialShareBox, SocialShareButton } from "social-share-toolkit/react";
import { getShareUrl } from "social-share-toolkit";

import type {
	NetworkInfo,
	NetworkKey,
	SocialShareBoxProps,
} from "social-share-toolkit";

import "./App.css";

const VERSION = "1.2.0";
const REPO = "https://github.com/DannyelPina/social-share-toolkit";
const NPM = "https://www.npmjs.com/package/social-share-toolkit";

type Direction = NonNullable<SocialShareBoxProps["direction"]>;

// Empty inputs must be undefined (not ""), so title/body fall back to `text`
const opt = (v: string) => v.trim() || undefined;

type Field = "link" | "text" | "title" | "body" | "subject" | "media";

const NETWORKS: {
	key: NetworkKey;
	label: string;
	icon: string;
	uses: Field[];
	note?: string;
}[] = [
	{ key: "facebook", label: "Facebook", icon: "fab fa-facebook-f", uses: ["link"] },
	{ key: "twitter", label: "Twitter / X", icon: "fab fa-x-twitter", uses: ["link", "text"] },
	{ key: "linkedin", label: "LinkedIn", icon: "fab fa-linkedin-in", uses: ["link"] },
	{ key: "whatsapp", label: "WhatsApp", icon: "fab fa-whatsapp", uses: ["link", "text"] },
	{ key: "telegram", label: "Telegram", icon: "fab fa-telegram", uses: ["link", "text"] },
	{
		key: "pinterest",
		label: "Pinterest",
		icon: "fab fa-pinterest-p",
		uses: ["link", "title", "media"],
		note: "title falls back to text",
	},
	{
		key: "reddit",
		label: "Reddit",
		icon: "fab fa-reddit-alien",
		uses: ["link", "title"],
		note: "title falls back to text",
	},
	{
		key: "email",
		label: "Email",
		icon: "fas fa-envelope",
		uses: ["link", "subject", "body"],
		note: "body falls back to text; subject defaults to “Check this out”",
	},
	{
		key: "sms",
		label: "SMS",
		icon: "fas fa-comment-sms",
		uses: ["link", "body"],
		note: "body falls back to text",
	},
	{ key: "viber", label: "Viber", icon: "fab fa-viber", uses: ["link", "text"] },
];

const NET_ICON = Object.fromEntries(
	NETWORKS.map((n) => [n.key, n.icon]),
) as Record<NetworkKey, string>;

// The library ships no icons: this page supplies Font Awesome ones
const Icon = ({ network }: { network: NetworkKey }) => (
	<i className={NET_ICON[network]} aria-hidden="true" />
);
const renderIcon = (n: NetworkInfo) => <Icon network={n.key} />;
const shareOnLabel = (n: NetworkInfo) => `Share on ${n.label}`;

/* ---------- small building blocks ---------- */

function CopyButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			className="copy"
			onClick={() => {
				navigator.clipboard.writeText(value);
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			}}
		>
			{copied ? "Copied" : "Copy"}
		</button>
	);
}

const highlight = (c: string) =>
	c
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/(".*?")/g, '<span class="t-str">$1</span>')
		.replace(
			/\b(import|from|export|const|return|function|true|false|null)\b/g,
			'<span class="t-kw">$1</span>',
		)
		.replace(/(\/\/.*|\{\/\*.*?\*\/\})/g, '<span class="t-cm">$1</span>');

function Code({ code, lang = "tsx" }: { code: string; lang?: string }) {
	return (
		<div className="code">
			<div className="code-bar">
				<span>{lang}</span>
				<CopyButton value={code} />
			</div>
			<pre>
				<code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
			</pre>
		</div>
	);
}

function Example({ caption, children }: { caption: string; children: ReactNode }) {
	return (
		<figure className="example">
			<div className="example-stage">{children}</div>
			<figcaption>{caption}</figcaption>
		</figure>
	);
}

type PropRow = {
	name: string;
	type: string;
	def?: string;
	desc: string;
	required?: boolean;
	since?: string;
};

function PropTable({ rows }: { rows: PropRow[] }) {
	return (
		<div className="table-wrap">
			<table className="ref">
				<thead>
					<tr>
						<th>Prop</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => (
						<tr key={r.name}>
							<td>
								<code>{r.name}</code>
								{r.required && <span className="tag">required</span>}
								{r.since && <span className="tag tag-since">{r.since}</span>}
							</td>
							<td className="type" data-label="Type">{r.type}</td>
							<td className="type" data-label="Default">{r.def ?? "—"}</td>
							<td className="desc">{r.desc}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

const SHARE_FIELDS: PropRow[] = [
	{ name: "text", type: "string", def: '""', desc: "Message shared with the link (tweet text, WhatsApp message…)." },
	{ name: "title", type: "string", def: "text", desc: "Title for Reddit and Pinterest.", since: "1.1" },
	{ name: "body", type: "string", def: "text", desc: "Message body for Email and SMS.", since: "1.1" },
	{ name: "media", type: "string", desc: "Image URL for Pinterest.", since: "1.1" },
	{ name: "subject", type: "string", def: '"Check this out"', desc: "Email subject." },
];

const BOX_PROPS: PropRow[] = [
	{ name: "link", type: "string", desc: "URL to share.", required: true },
	{ name: "socials", type: "NetworkKey[]", def: "all", desc: "Networks to render, in this order." },
	...SHARE_FIELDS,
	{ name: "showLabel", type: "boolean", def: "true", desc: "Show a text label on each button." },
	{ name: "getLabel", type: "(network) => string", def: "network name", desc: "Label for each button.", since: "1.2" },
	{ name: "renderIcon", type: "(network) => ReactNode", desc: "Icon rendered before each label.", since: "1.2" },
	{ name: "direction", type: '"row" | "column"', def: '"row"', desc: "Layout of the buttons." },
	{ name: "gap", type: "string", def: '"8px"', desc: "Space between buttons (any CSS length)." },
	{ name: "buttonStyle", type: "CSSProperties", def: "{}", desc: "Inline styles applied to every button." },
	{ name: "className · style", type: "string · CSSProperties", desc: "Applied to the wrapper <div>." },
	{ name: "…rest", type: "HTMLAttributes<div>", desc: "id, aria-*, data-* and other attributes go to the wrapper.", since: "1.1" },
];

const BUTTON_PROPS: PropRow[] = [
	{ name: "network", type: "NetworkKey", desc: "Network to share to.", required: true },
	{ name: "link", type: "string", desc: "URL to share. When empty the button renders nothing.", required: true },
	...SHARE_FIELDS,
	{ name: "showLabel", type: "boolean", def: "true", desc: "Show the label. When off, the label becomes the aria-label." },
	{ name: "label", type: "string", def: "network name", desc: "Replaces the network name.", since: "1.2" },
	{ name: "children", type: "ReactNode", desc: "Rendered before the label — put your icon here." },
	{ name: "className · style", type: "string · CSSProperties", desc: "Applied to the <a>." },
	{ name: "…rest", type: "AnchorHTMLAttributes", desc: "onClick, aria-*, data-* and other attributes go to the <a>.", since: "1.1" },
];

const CHANGELOG = [
	{
		version: "1.2.0",
		date: "2026-11-11",
		items: [
			<>
				<code>renderIcon</code> on <code>SocialShareBox</code> renders an icon on every
				button (<code>#icon</code> slot in Vue).
			</>,
			<>
				<code>getLabel</code> on the box and <code>label</code> on a button replace the
				network name, including the aria-label of icon-only buttons.
			</>,
		],
	},
	{
		version: "1.1.0",
		date: "2026-11-11",
		items: [
			<>
				New share fields <code>title</code>, <code>body</code> and <code>media</code>; title
				and body fall back to <code>text</code>.
			</>,
			<>Extra HTML attributes are passed through to the &lt;a&gt; or wrapper &lt;div&gt;.</>,
			<>Icon-only buttons get an aria-label automatically.</>,
			<>
				<code>SocialShareButtonProps</code> and <code>SocialShareBoxProps</code> are exported.
			</>,
			<>An unknown network or empty link renders nothing instead of throwing.</>,
		],
	},
	{
		version: "1.0.0",
		date: "2026-05-13",
		items: [<>First release: React and Vue components for ten networks.</>],
	},
];

const SECTIONS = [
	{ id: "playground", title: "Playground" },
	{ id: "box", title: "SocialShareBox" },
	{ id: "button", title: "SocialShareButton" },
	{ id: "networks", title: "Networks" },
	{ id: "changelog", title: "Changelog" },
];

function Section({ index, id, title, lead, children }: {
	index: number;
	id: string;
	title: string;
	lead?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section id={id} className="section">
			<h2>
				<span className="num">{String(index + 1).padStart(2, "0")}</span>
				{title}
			</h2>
			{lead && <p className="lead">{lead}</p>}
			{children}
		</section>
	);
}

/* ---------- page ---------- */

export default function App() {
	const [url, setUrl] = useState("https://your-website.com");
	const [text, setText] = useState("Check this out!");
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [subject, setSubject] = useState("");
	const [media, setMedia] = useState("");
	const [showLabel, setShowLabel] = useState(true);
	const [showIcons, setShowIcons] = useState(true);
	const [shareOn, setShareOn] = useState(false);
	const [direction, setDir] = useState<Direction>("row");
	const [selected, setSel] = useState<NetworkKey[]>([
		"facebook",
		"twitter",
		"linkedin",
		"whatsapp",
		"reddit",
		"email",
	]);
	const [shares, setShares] = useState(0);

	const toggle = (key: NetworkKey) =>
		setSel((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

	// Keep the list in the canonical network order
	const socials = NETWORKS.map((n) => n.key).filter((k) => selected.includes(k));

	const shareOptions = {
		link: url,
		text,
		title: opt(title),
		body: opt(body),
		subject: opt(subject),
		media: opt(media),
	};

	const optionalProps = (
		[
			["title", title],
			["body", body],
			["subject", subject],
			["media", media],
		] as const
	).filter(([, v]) => opt(v));

	const boxProps = [
		`link="${url}"`,
		`socials={[${socials.map((s) => `"${s}"`).join(", ")}]}`,
		`text="${text}"`,
		...optionalProps.map(([k, v]) => `${k}="${v.trim()}"`),
		...(showLabel ? [] : ["showLabel={false}"]),
		...(shareOn ? ["getLabel={(n) => `Share on ${n.label}`}"] : []),
		...(showIcons ? ["renderIcon={(n) => <i className={icons[n.key]} />}"] : []),
		...(direction === "column" ? [`direction="column"`] : []),
	];

	const iconsDecl = showIcons
		? `// The library ships no icons — bring your own\nconst icons = { facebook: "fab fa-facebook-f", twitter: "fab fa-x-twitter" /* … */ };\n\n`
		: "";

	const boxCode = `import { SocialShareBox } from "social-share-toolkit/react";\n\n${iconsDecl}export function Share() {\n  return (\n    <SocialShareBox\n${boxProps.map((p) => `      ${p}`).join("\n")}\n    />\n  );\n}`;

	const btnCode = `import { SocialShareButton } from "social-share-toolkit/react";\n\nexport function Share() {\n  return (\n    <>\n      {/* children render before the label */}\n      <SocialShareButton network="twitter" link="${url}" text="${text}" label="Post on X">\n        <i className="fab fa-x-twitter" />\n      </SocialShareButton>\n\n      {/* icon-only: the label becomes the aria-label */}\n      <SocialShareButton network="reddit" link="${url}" showLabel={false}>\n        <i className="fab fa-reddit-alien" />\n      </SocialShareButton>\n\n      {/* other <a> attributes pass through */}\n      <SocialShareButton\n        network="whatsapp"\n        link="${url}"\n        onClick={() => track("whatsapp")}\n        data-track="share"\n      />\n    </>\n  );\n}`;

	const install = "npm install social-share-toolkit";

	return (
		<div className="page">
			<header className="top">
				<a href="#" className="wordmark">
					social-share-toolkit
				</a>
				<span className="ver">v{VERSION}</span>
				<nav className="top-links">
					<a href={NPM} target="_blank" rel="noopener noreferrer">
						npm
					</a>
					<a href={REPO} target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
				</nav>
			</header>

			<div className="intro">
				<div>
					<h1>Share buttons for React and&nbsp;Vue.</h1>
					<p className="intro-text">
						Ten networks, typed props, no runtime dependencies. Each button is a
						plain link to the network's share page, so there are no scripts or
						trackers to load. You bring the icons.
					</p>
					<div className="install">
						<code>
							<span className="prompt">$</span> {install}
						</code>
						<CopyButton value={install} />
					</div>
				</div>
				<div className="intro-demo">
					<SocialShareBox
						link={REPO}
						socials={["twitter", "linkedin", "reddit", "whatsapp"]}
						text="social-share-toolkit: share buttons for React and Vue"
						renderIcon={renderIcon}
						gap="8px"
						aria-label="Share social-share-toolkit"
					/>
					<p className="intro-demo-note">
						These are the real components, sharing this library's repository.
					</p>
				</div>
			</div>

			<div className="doc">
				<aside className="toc">
					<p className="toc-head">On this page</p>
					<ol>
						{SECTIONS.map((s) => (
							<li key={s.id}>
								<a href={`#${s.id}`}>{s.title}</a>
							</li>
						))}
					</ol>
				</aside>

				<main>
					<Section
						index={0}
						id="playground"
						title="Playground"
						lead="Change the options and the preview, the generated share links and the code update together."
					>
						<div className="playground">
							<form className="controls" onSubmit={(e) => e.preventDefault()}>
								<fieldset>
									<legend>Content</legend>
									<label className="field">
										<span>link</span>
										<input value={url} onChange={(e) => setUrl(e.target.value)} />
									</label>
									<label className="field">
										<span>text</span>
										<input value={text} onChange={(e) => setText(e.target.value)} />
									</label>
									<label className="field">
										<span>
											title <em>Reddit, Pinterest</em>
										</span>
										<input
											value={title}
											placeholder="falls back to text"
											onChange={(e) => setTitle(e.target.value)}
										/>
									</label>
									<label className="field">
										<span>
											body <em>Email, SMS</em>
										</span>
										<input
											value={body}
											placeholder="falls back to text"
											onChange={(e) => setBody(e.target.value)}
										/>
									</label>
									<label className="field">
										<span>
											subject <em>Email</em>
										</span>
										<input
											value={subject}
											placeholder="Check this out"
											onChange={(e) => setSubject(e.target.value)}
										/>
									</label>
									<label className="field">
										<span>
											media <em>Pinterest</em>
										</span>
										<input
											value={media}
											placeholder="https://…/image.png"
											onChange={(e) => setMedia(e.target.value)}
										/>
									</label>
								</fieldset>

								<fieldset>
									<legend>Display</legend>
									<label className="check">
										<input
											type="checkbox"
											checked={showLabel}
											onChange={(e) => setShowLabel(e.target.checked)}
										/>
										Show labels
									</label>
									<label className="check">
										<input
											type="checkbox"
											checked={showIcons}
											onChange={(e) => setShowIcons(e.target.checked)}
										/>
										Icons via <code>renderIcon</code>
									</label>
									<label className="check">
										<input
											type="checkbox"
											checked={shareOn}
											onChange={(e) => setShareOn(e.target.checked)}
										/>
										“Share on …” via <code>getLabel</code>
									</label>
									<div className="radios">
										{(["row", "column"] as const).map((d) => (
											<label key={d} className="check">
												<input
													type="radio"
													name="direction"
													checked={direction === d}
													onChange={() => setDir(d)}
												/>
												{d}
											</label>
										))}
									</div>
								</fieldset>

								<fieldset>
									<legend>Networks</legend>
									<div className="net-checks">
										{NETWORKS.map((n) => (
											<label key={n.key} className="check">
												<input
													type="checkbox"
													checked={selected.includes(n.key)}
													onChange={() => toggle(n.key)}
												/>
												<Icon network={n.key} />
												{n.label}
											</label>
										))}
									</div>
								</fieldset>
							</form>

							<div className="output">
								<div className="preview">
									{socials.length > 0 ? (
										<SocialShareBox
											socials={socials}
											{...shareOptions}
											showLabel={showLabel}
											getLabel={shareOn ? shareOnLabel : undefined}
											renderIcon={showIcons ? renderIcon : undefined}
											direction={direction}
											aria-label="Share this page"
										/>
									) : (
										<p className="muted">Pick at least one network.</p>
									)}
								</div>

								{url && socials.length > 0 && (
									<details className="links">
										<summary>Generated share links</summary>
										<ul>
											{socials.map((k) => (
												<li key={k}>
													<span className="links-key">{k}</span>
													<code>{getShareUrl(k, shareOptions)}</code>
												</li>
											))}
										</ul>
									</details>
								)}

								<Code code={boxCode} />
							</div>
						</div>
					</Section>

					<Section
						index={1}
						id="box"
						title="SocialShareBox"
						lead="A row or column of buttons sharing the same content. Use it when you want several networks with one component."
					>
						<div className="examples">
							<Example caption="Icon only: showLabel={false} with renderIcon. Each button gets the network name as its aria-label.">
								<SocialShareBox
									link={REPO}
									socials={["facebook", "twitter", "linkedin", "reddit", "email"]}
									text="Check out social-share-toolkit"
									showLabel={false}
									renderIcon={renderIcon}
									gap="6px"
									buttonStyle={{
										width: "38px",
										height: "38px",
										padding: 0,
										justifyContent: "center",
										borderRadius: "50%",
										fontSize: "15px",
									}}
								/>
							</Example>
							<Example caption='Column with getLabel={(n) => `Share on ${n.label}`}.'>
								<SocialShareBox
									link={REPO}
									socials={["facebook", "linkedin", "email"]}
									text="Check out social-share-toolkit"
									getLabel={shareOnLabel}
									renderIcon={renderIcon}
									direction="column"
									gap="6px"
									style={{ alignItems: "flex-start" }}
								/>
							</Example>
						</div>
						<PropTable rows={BOX_PROPS} />
					</Section>

					<Section
						index={2}
						id="button"
						title="SocialShareButton"
						lead="A single share link. Use it when buttons sit in different places, or each one needs its own label, icon or handler."
					>
						<div className="examples">
							<Example caption="Icons passed as children; label replaces the network name on the first button.">
								<div className="row">
									<SocialShareButton network="twitter" link={url} text={text} label="Post on X">
										<Icon network="twitter" />
									</SocialShareButton>
									<SocialShareButton network="whatsapp" link={url} text={text}>
										<Icon network="whatsapp" />
									</SocialShareButton>
									<SocialShareButton network="telegram" link={url} text={text}>
										<Icon network="telegram" />
									</SocialShareButton>
									<SocialShareButton network="reddit" link={url} text={text} showLabel={false}>
										<Icon network="reddit" />
									</SocialShareButton>
								</div>
							</Example>
							<Example caption={`onClick and data-* pass through to the <a>. Clicked ${shares} time${shares === 1 ? "" : "s"}.`}>
								<div className="row">
									{(["whatsapp", "email", "sms"] as const).map((n) => (
										<SocialShareButton
											key={n}
											network={n}
											{...shareOptions}
											onClick={() => setShares((s) => s + 1)}
											data-track="share"
										>
											<Icon network={n} />
										</SocialShareButton>
									))}
								</div>
							</Example>
						</div>
						<Code code={btnCode} />
						<PropTable rows={BUTTON_PROPS} />
					</Section>

					<Section
						index={3}
						id="networks"
						title="Networks"
						lead="Each network reads only some of the share fields. Fields it ignores are simply not sent."
					>
						<div className="table-wrap">
							<table className="ref">
								<thead>
									<tr>
										<th>Key</th>
										<th>Network</th>
										<th>Uses</th>
										<th>Notes</th>
									</tr>
								</thead>
								<tbody>
									{NETWORKS.map((n) => (
										<tr key={n.key}>
											<td>
												<code>{n.key}</code>
											</td>
											<td className="nowrap" data-label="Network">
												<Icon network={n.key} /> {n.label}
											</td>
											<td className="type" data-label="Uses">{n.uses.join(", ")}</td>
											<td className="desc">{n.note ?? "—"}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Section>

					<Section index={4} id="changelog" title="Changelog">
						<ol className="changelog">
							{CHANGELOG.map((c) => (
								<li key={c.version}>
									<div className="cl-head">
										<code>{c.version}</code>
										<time dateTime={c.date}>{c.date}</time>
									</div>
									<ul>
										{c.items.map((item, i) => (
											<li key={i}>{item}</li>
										))}
									</ul>
								</li>
							))}
						</ol>
					</Section>
				</main>
			</div>

			<footer className="foot">
				<span>MIT License</span>
				<a href="https://github.com/DannyelPina" target="_blank" rel="noopener noreferrer">
					DannyelPina
				</a>
			</footer>
		</div>
	);
}
