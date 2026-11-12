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
type Fw = "react" | "vue";

const FW_KEY = "sst-demo-framework";
// ?fw=vue in the URL wins (shareable links), then the visitor's last choice
const readFw = (): Fw => {
	const param = new URLSearchParams(window.location.search).get("fw");
	if (param === "vue" || param === "react") return param;
	try {
		return localStorage.getItem(FW_KEY) === "vue" ? "vue" : "react";
	} catch {
		return "react";
	}
};

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

/* ---------- code samples ---------- */

const ICONS_LINE =
	'const icons: Record<string, string> = { facebook: "fab fa-facebook-f", twitter: "fab fa-x-twitter" /* … */ };';

const SETUP_CODE: Record<Fw, { caption: string; code: string }[]> = {
	react: [
		{
			caption: "Import the components where you need them. Works with React 17 and later.",
			code: [
				'import { SocialShareBox, SocialShareButton } from "social-share-toolkit/react";',
				"",
				"export function Share() {",
				"  return (",
				"    <SocialShareBox",
				'      link="https://example.com"',
				'      socials={["facebook", "twitter", "whatsapp"]}',
				'      text="Check this out!"',
				"    />",
				"  );",
				"}",
			].join("\n"),
		},
	],
	vue: [
		{
			caption: "Register both components globally as a plugin. Works with Vue 3.",
			code: [
				"// main.ts",
				'import { createApp } from "vue";',
				'import SocialShare from "social-share-toolkit/vue";',
				'import App from "./App.vue";',
				"",
				'createApp(App).use(SocialShare).mount("#app");',
			].join("\n"),
		},
		{
			caption: "Or import them in the component that uses them.",
			code: [
				'<script setup lang="ts">',
				'import { SocialShareBox } from "social-share-toolkit/vue";',
				"</script>",
				"",
				"<template>",
				"  <SocialShareBox",
				'    link="https://example.com"',
				"    :socials=\"['facebook', 'twitter', 'whatsapp']\"",
				'    text="Check this out!"',
				"  />",
				"</template>",
			].join("\n"),
		},
	],
};

const BOX_CODE: Record<Fw, string> = {
	react: [
		'import { SocialShareBox } from "social-share-toolkit/react";',
		"",
		ICONS_LINE,
		"",
		"// Icon only",
		"<SocialShareBox",
		'  link="https://example.com"',
		'  socials={["facebook", "twitter", "linkedin"]}',
		"  showLabel={false}",
		"  renderIcon={(n) => <i className={icons[n.key]} />}",
		"/>",
		"",
		"// Column with custom labels",
		"<SocialShareBox",
		'  link="https://example.com"',
		'  socials={["facebook", "linkedin", "email"]}',
		'  direction="column"',
		"  getLabel={(n) => `Share on ${n.label}`}",
		"  renderIcon={(n) => <i className={icons[n.key]} />}",
		"/>",
	].join("\n"),
	vue: [
		'<script setup lang="ts">',
		'import { SocialShareBox } from "social-share-toolkit/vue";',
		"",
		ICONS_LINE,
		"</script>",
		"",
		"<template>",
		"  <!-- Icon only -->",
		"  <SocialShareBox",
		'    link="https://example.com"',
		"    :socials=\"['facebook', 'twitter', 'linkedin']\"",
		'    :show-label="false"',
		"  >",
		'    <template #icon="{ network }">',
		'      <i :class="icons[network.key]" />',
		"    </template>",
		"  </SocialShareBox>",
		"",
		"  <!-- Column with custom labels -->",
		"  <SocialShareBox",
		'    link="https://example.com"',
		"    :socials=\"['facebook', 'linkedin', 'email']\"",
		'    direction="column"',
		'    :get-label="(n) => `Share on ${n.label}`"',
		"  >",
		'    <template #icon="{ network }">',
		'      <i :class="icons[network.key]" />',
		"    </template>",
		"  </SocialShareBox>",
		"</template>",
	].join("\n"),
};

const buttonCode = (fw: Fw, url: string, text: string) =>
	fw === "react"
		? [
				'import { SocialShareButton } from "social-share-toolkit/react";',
				"",
				"export function Share() {",
				"  return (",
				"    <>",
				"      {/* children render before the label */}",
				`      <SocialShareButton network="twitter" link="${url}" text="${text}" label="Post on X">`,
				'        <i className="fab fa-x-twitter" />',
				"      </SocialShareButton>",
				"",
				"      {/* icon-only: the label becomes the aria-label */}",
				`      <SocialShareButton network="reddit" link="${url}" showLabel={false}>`,
				'        <i className="fab fa-reddit-alien" />',
				"      </SocialShareButton>",
				"",
				"      {/* other <a> attributes pass through */}",
				"      <SocialShareButton",
				'        network="whatsapp"',
				`        link="${url}"`,
				'        onClick={() => track("whatsapp")}',
				'        data-track="share"',
				"      />",
				"    </>",
				"  );",
				"}",
			].join("\n")
		: [
				'<script setup lang="ts">',
				'import { SocialShareButton } from "social-share-toolkit/vue";',
				"</script>",
				"",
				"<template>",
				"  <!-- the default slot renders before the label -->",
				`  <SocialShareButton network="twitter" link="${url}" text="${text}" label="Post on X">`,
				'    <i class="fab fa-x-twitter" />',
				"  </SocialShareButton>",
				"",
				"  <!-- icon-only: the label becomes the aria-label -->",
				`  <SocialShareButton network="reddit" link="${url}" :show-label="false">`,
				'    <i class="fab fa-reddit-alien" />',
				"  </SocialShareButton>",
				"",
				"  <!-- other attributes fall through to the <a> -->",
				"  <SocialShareButton",
				'    network="whatsapp"',
				`    link="${url}"`,
				"    @click=\"track('whatsapp')\"",
				'    data-track="share"',
				"  />",
				"</template>",
			].join("\n");

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

// One pass, left to right, so "//" inside a string is never treated as a comment
const TOKEN =
	/("[^"\n]*"|`[^`\n]*`)|(\/\/[^\n]*|<!--[\s\S]*?-->|\{\/\*[\s\S]*?\*\/\})|\b(import|from|export|const|return|function|true|false|null)\b/g;
const esc = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function highlight(code: string) {
	let out = "";
	let last = 0;
	for (const m of code.matchAll(TOKEN)) {
		const cls = m[1] ? "t-str" : m[2] ? "t-cm" : "t-kw";
		out += esc(code.slice(last, m.index)) + `<span class="${cls}">${esc(m[0])}</span>`;
		last = m.index + m[0].length;
	}
	return out + esc(code.slice(last));
}

function Code({ code, lang }: { code: string; lang: string }) {
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

function Example({ caption, children }: { caption: ReactNode; children: ReactNode }) {
	return (
		<figure className="example">
			<div className="example-stage">{children}</div>
			<figcaption>{caption}</figcaption>
		</figure>
	);
}

function FwSwitch({ fw, onChange }: { fw: Fw; onChange: (fw: Fw) => void }) {
	return (
		<div className="fw-switch" role="group" aria-label="Framework">
			{(["react", "vue"] as const).map((f) => (
				<button
					key={f}
					type="button"
					aria-pressed={fw === f}
					onClick={() => onChange(f)}
				>
					{f === "react" ? "React" : "Vue"}
				</button>
			))}
		</div>
	);
}

type PropRow = {
	name: string;
	type: string;
	def?: string;
	desc: string;
	required?: boolean;
	since?: string;
	only?: Fw;
};

function PropTable({ rows, fw }: { rows: PropRow[]; fw: Fw }) {
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
					{rows
						.filter((r) => !r.only || r.only === fw)
						.map((r) => (
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
	{ name: "renderIcon", type: "(network) => ReactNode", desc: "Icon rendered before each label.", since: "1.2", only: "react" },
	{ name: "#icon slot", type: "{ network: NetworkInfo }", desc: "Icon rendered before each label.", since: "1.2", only: "vue" },
	{ name: "direction", type: '"row" | "column"', def: '"row"', desc: "Layout of the buttons." },
	{ name: "gap", type: "string", def: '"8px"', desc: "Space between buttons (any CSS length)." },
	{ name: "buttonStyle", type: "CSSProperties", def: "{}", desc: "Inline styles applied to every button." },
	{ name: "className · style", type: "string · CSSProperties", desc: "Applied to the wrapper <div>.", only: "react" },
	{ name: "…rest", type: "HTMLAttributes<div>", desc: "id, aria-*, data-* and other attributes go to the wrapper.", since: "1.1", only: "react" },
	{ name: "class · style · attrs", type: "native attributes", desc: "Fall through to the wrapper <div> (id, aria-*, data-*, @click…).", only: "vue" },
];

const BUTTON_PROPS: PropRow[] = [
	{ name: "network", type: "NetworkKey", desc: "Network to share to.", required: true },
	{ name: "link", type: "string", desc: "URL to share. When empty the button renders nothing.", required: true },
	...SHARE_FIELDS,
	{ name: "showLabel", type: "boolean", def: "true", desc: "Show the label. When off, the label becomes the aria-label." },
	{ name: "label", type: "string", def: "network name", desc: "Replaces the network name.", since: "1.2" },
	{ name: "children", type: "ReactNode", desc: "Rendered before the label — put your icon here.", only: "react" },
	{ name: "default slot", type: "—", desc: "Rendered before the label — put your icon here.", only: "vue" },
	{ name: "className · style", type: "string · CSSProperties", desc: "Applied to the <a>.", only: "react" },
	{ name: "…rest", type: "AnchorHTMLAttributes", desc: "onClick, aria-*, data-* and other attributes go to the <a>.", since: "1.1", only: "react" },
	{ name: "customStyle", type: "CSSProperties", def: "{}", desc: "Inline styles merged over the button's defaults.", only: "vue" },
	{ name: "class · style · attrs", type: "native attributes", desc: "Fall through to the <a> (@click, aria-*, data-*…).", only: "vue" },
];

const DIFFERENCES: [string, ReactNode, ReactNode][] = [
	["Import from", <code>social-share-toolkit/react</code>, <><code>social-share-toolkit/vue</code> or the plugin</>],
	["Icon on a button", <>children</>, <>default slot</>],
	["Icons in a box", <code>{"renderIcon={(n) => …}"}</code>, <code>{'#icon="{ network }"'}</code>],
	["Prop names", <code>showLabel</code>, <><code>:show-label</code> (kebab-case in templates)</>],
	["Button inline styles", <code>style</code>, <><code>:custom-style</code> or native <code>style</code></>],
	["CSS classes", <code>className</code>, <code>class</code>],
	["Events and other attributes", <code>onClick, data-*, aria-*</code>, <><code>@click, data-*, aria-*</code> (fallthrough)</>],
];

const CHANGELOG = [
	{
		version: "1.2.0",
		date: "2026-11-11",
		items: [
			<>
				Icons on every button of a <code>SocialShareBox</code>: <code>renderIcon</code> in
				React, the <code>#icon</code> slot in Vue.
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
			<>React: extra HTML attributes are passed through to the &lt;a&gt; or wrapper &lt;div&gt;.</>,
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
	{ id: "setup", title: "Setup" },
	{ id: "playground", title: "Playground" },
	{ id: "box", title: "SocialShareBox" },
	{ id: "button", title: "SocialShareButton" },
	{ id: "networks", title: "Networks" },
	{ id: "changelog", title: "Changelog" },
];

function Section({ id, title, lead, children }: {
	id: string;
	title: string;
	lead?: ReactNode;
	children: ReactNode;
}) {
	const index = SECTIONS.findIndex((s) => s.id === id);
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
	const [fw, setFwState] = useState<Fw>(readFw);
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

	const setFw = (f: Fw) => {
		setFwState(f);
		try {
			localStorage.setItem(FW_KEY, f);
		} catch {
			// Storage can be blocked; the switch still works for this visit
		}
	};

	const isVue = fw === "vue";
	const lang = isVue ? "vue" : "tsx";

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

	const playgroundCode = isVue
		? (() => {
				const attrs = [
					`link="${url}"`,
					`:socials="[${socials.map((s) => `'${s}'`).join(", ")}]"`,
					`text="${text}"`,
					...optionalProps.map(([k, v]) => `${k}="${v.trim()}"`),
					...(showLabel ? [] : [':show-label="false"']),
					...(shareOn ? [':get-label="(n) => `Share on ${n.label}`"'] : []),
					...(direction === "column" ? ['direction="column"'] : []),
				];
				const slot = showIcons
					? `  >\n    <template #icon="{ network }">\n      <i :class="icons[network.key]" />\n    </template>\n  </SocialShareBox>`
					: "  />";
				return [
					'<script setup lang="ts">',
					'import { SocialShareBox } from "social-share-toolkit/vue";',
					...(showIcons ? ["", "// The library ships no icons — bring your own", ICONS_LINE] : []),
					"</script>",
					"",
					"<template>",
					"  <SocialShareBox",
					...attrs.map((a) => `    ${a}`),
					slot,
					"</template>",
				].join("\n");
			})()
		: [
				'import { SocialShareBox } from "social-share-toolkit/react";',
				"",
				...(showIcons ? ["// The library ships no icons — bring your own", ICONS_LINE, ""] : []),
				"export function Share() {",
				"  return (",
				"    <SocialShareBox",
				...[
					`link="${url}"`,
					`socials={[${socials.map((s) => `"${s}"`).join(", ")}]}`,
					`text="${text}"`,
					...optionalProps.map(([k, v]) => `${k}="${v.trim()}"`),
					...(showLabel ? [] : ["showLabel={false}"]),
					...(shareOn ? ["getLabel={(n) => `Share on ${n.label}`}"] : []),
					...(showIcons ? ["renderIcon={(n) => <i className={icons[n.key]} />}"] : []),
					...(direction === "column" ? ['direction="column"'] : []),
				].map((a) => `      ${a}`),
				"    />",
				"  );",
				"}",
			].join("\n");

	const install = "npm install social-share-toolkit";

	return (
		<div className="page">
			<header className="top">
				<a href="#" className="wordmark">
					social-share-toolkit
				</a>
				<span className="ver">v{VERSION}</span>
				<div className="top-right">
					<FwSwitch fw={fw} onChange={setFw} />
					<nav className="top-links">
						<a href={NPM} target="_blank" rel="noopener noreferrer">
							npm
						</a>
						<a href={REPO} target="_blank" rel="noopener noreferrer">
							GitHub
						</a>
					</nav>
				</div>
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
					<p className="toc-head">Framework</p>
					<FwSwitch fw={fw} onChange={setFw} />
					<p className="toc-head toc-head-gap">On this page</p>
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
						id="setup"
						title="Setup"
						lead={
							<>
								Same components and share options in both frameworks. Pick yours with
								the switch; every code sample on this page follows it.
							</>
						}
					>
						<div className="setup">
							{SETUP_CODE[fw].map((s) => (
								<div key={s.caption}>
									<p className="setup-caption">{s.caption}</p>
									<Code code={s.code} lang={s.code.startsWith("<") ? "vue" : isVue ? "ts" : "tsx"} />
								</div>
							))}
						</div>

						<h3 className="sub">React and Vue side by side</h3>
						<div className="table-wrap">
							<table className="ref diff">
								<thead>
									<tr>
										<th />
										<th className={isVue ? "" : "active"}>React</th>
										<th className={isVue ? "active" : ""}>Vue</th>
									</tr>
								</thead>
								<tbody>
									{DIFFERENCES.map(([what, react, vue]) => (
										<tr key={what}>
											<td className="diff-what">{what}</td>
											<td data-label="React" className={isVue ? "" : "active"}>
												{react}
											</td>
											<td data-label="Vue" className={isVue ? "active" : ""}>
												{vue}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Section>

					<Section
						id="playground"
						title="Playground"
						lead={
							<>
								Change the options and the preview, the generated share links and the{" "}
								{isVue ? "Vue" : "React"} code update together.
								{isVue && " The preview uses the React build; the Vue components render the same buttons."}
							</>
						}
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
										Icons via <code>{isVue ? "#icon" : "renderIcon"}</code>
									</label>
									<label className="check">
										<input
											type="checkbox"
											checked={shareOn}
											onChange={(e) => setShareOn(e.target.checked)}
										/>
										“Share on …” via <code>{isVue ? ":get-label" : "getLabel"}</code>
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

								<Code code={playgroundCode} lang={lang} />
							</div>
						</div>
					</Section>

					<Section
						id="box"
						title="SocialShareBox"
						lead="A row or column of buttons sharing the same content. Use it when you want several networks with one component."
					>
						<div className="examples">
							<Example
								caption={
									isVue ? (
										<>
											Icon only: <code>:show-label="false"</code> with the <code>#icon</code> slot. Each button gets the network name as its aria-label.
										</>
									) : (
										<>
											Icon only: <code>showLabel={"{false}"}</code> with <code>renderIcon</code>. Each button gets the network name as its aria-label.
										</>
									)
								}
							>
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
							<Example
								caption={
									<>
										Column with <code>{isVue ? ":get-label" : "getLabel"}</code> returning “Share on …”.
									</>
								}
							>
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
						<Code code={BOX_CODE[fw]} lang={lang} />
						{isVue && (
							<p className="note">
								In templates, write props in kebab-case (<code>:show-label</code>,{" "}
								<code>:get-label</code>, <code>:button-style</code>) and bind anything that
								isn't a plain string with <code>:</code>.
							</p>
						)}
						<PropTable rows={BOX_PROPS} fw={fw} />
					</Section>

					<Section
						id="button"
						title="SocialShareButton"
						lead="A single share link. Use it when buttons sit in different places, or each one needs its own label, icon or handler."
					>
						<div className="examples">
							<Example
								caption={
									<>
										Icons passed {isVue ? "in the default slot" : "as children"};{" "}
										<code>label</code> replaces the network name on the first button.
									</>
								}
							>
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
							<Example
								caption={
									<>
										<code>{isVue ? "@click" : "onClick"}</code> and <code>data-*</code>{" "}
										{isVue ? "fall" : "pass"} through to the &lt;a&gt;. Clicked {shares} time
										{shares === 1 ? "" : "s"}.
									</>
								}
							>
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
						<Code code={buttonCode(fw, url, text)} lang={lang} />
						<PropTable rows={BUTTON_PROPS} fw={fw} />
					</Section>

					<Section
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

					<Section id="changelog" title="Changelog">
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
