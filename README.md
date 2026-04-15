# Amplitude Account Intel

> AI-powered GTM intelligence tool for Amplitude account executives. Enter any account name and get a complete outreach plan in under 30 seconds.

---

## What it does

Enter a company name and the tool generates:

- **Company Overview** — growth strategy, AI initiatives, key metrics, and the specific Amplitude opportunity framed around their business
- **Tech Stack** — maps their analytics, data/ML, and cloud tools with a gap analysis showing exactly where Amplitude fits
- **Outreach Plan** — three persona cards (Champion, Economic Buyer, Influence) with pain points, Amplitude outcomes, discovery hooks, and one-click copyable emails + LinkedIn notes
- **Outreach Sequence** — a 7-step, 21-day multi-channel cadence
- **Warm Paths** — Amplitude alumni now at the account, and current Amplitude employees who came from there, with ready-to-use intro templates
- **Competitive** — likely incumbent tools, threat levels, and one-liner Amplitude wins

---

## Live app

Once deployed, your team accesses the tool at:

```
https://<your-github-username>.github.io/amplitude-account-intel/
```

No login required. No backend. Runs entirely in the browser.

---

## Quickstart — Deploy in 5 minutes

### Step 1: Create the GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `amplitude-account-intel`
3. Set visibility to **Private** (recommended for internal tools)
4. Click **Create repository**

### Step 2: Upload the files

**Option A — GitHub web UI (easiest, no terminal needed)**

1. In your new repo, click **Add file → Upload files**
2. Drag and drop all files from this project folder:
   - `index.html`
   - `README.md`
   - `.github/workflows/deploy.yml`
3. Click **Commit changes**

**Option B — Git CLI**

```bash
git clone https://github.com/<your-username>/amplitude-account-intel
cd amplitude-account-intel
# copy all project files into this folder
git add .
git commit -m "Initial deployment"
git push origin main
```

### Step 3: Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. The deploy workflow will run automatically on every push to `main`
4. After ~60 seconds, your app will be live at `https://<username>.github.io/amplitude-account-intel/`

### Step 4: Share with your team

Send the URL to your AE team. That's it — nothing to install, no accounts to create.

---

## Project structure

```
amplitude-account-intel/
├── index.html                  ← The entire app (single file)
├── README.md                   ← This file
└── .github/
    └── workflows/
        └── deploy.yml          ← Auto-deploys to GitHub Pages on push
```

The app is intentionally a single HTML file. This makes it:
- Easy to update (edit one file, push, live in 60 seconds)
- Easy to share (one URL, works on any device)
- Zero-dependency (no build step, no npm, no server)

---

## How to update the app

1. Open `index.html` in any text editor
2. Make your changes
3. Commit and push to `main`
4. GitHub Actions deploys automatically — live in ~60 seconds

To update via the GitHub web UI:
1. Open `index.html` in your repo
2. Click the pencil (edit) icon
3. Make changes
4. Click **Commit changes**

---

## Customizing for your team

### Adding more quick-chip accounts

In `index.html`, find the `.quick-chips` section and add chips:

```html
<span class="chip" onclick="setAccount('Your Account Name')">Your Account Name</span>
```

### Updating the messaging framework

The AI system prompt in `index.html` contains Amplitude's value proposition, persona definitions, and brand voice. Search for `const sys=` to find and edit it.

### Restricting access

GitHub Pages public repos are publicly accessible. For an internal-only tool:

1. Keep the repo **private** (you already did this in Step 1)
2. Go to **Settings → Pages → Visibility** and set to **Private** (requires GitHub Team or Enterprise plan)

Alternatively, add a simple password gate by wrapping the app in a login check — ask your IT/eng team to add Okta SSO or a basic password prompt if needed.

---

## Roadmap ideas

These are natural next enhancements once the team is using it:

| Feature | Effort | Value |
|---|---|---|
| Save account reports to history | Medium | High |
| Push personas directly to Outreach sequences | Medium | High |
| Integrate ZoomInfo contact data inline | Medium | High |
| Slack bot: `/intel [account]` | Medium | Medium |
| PDF export of full report | Low | Medium |
| Admin dashboard with usage analytics | High | Medium |

---

## Built with

- **Claude claude-sonnet-4-20250514** — account intelligence, messaging, warm paths
- **Anthropic Web Search** — real-time annual reports, news, tech stack signals
- **GitHub Pages** — zero-config hosting
- **Vanilla HTML/CSS/JS** — no framework, no build step, instant load

---

## Questions or issues

Open a GitHub Issue in this repo or ping the team Slack.
