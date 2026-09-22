# Martin Nguyen — portfolio source and setup guide

This is the complete, editable version of the cream-and-green portfolio, with the revised personal introduction, About → Experience → Projects layout, project carousel, filters, dialogs, mobile navigation, and an interactive CN Tower made from line particles.

**Start here:** extract the ZIP, then double-click `index.html` to preview the site. Double-click `START-HERE.html` for a browser-friendly copy of this guide. No installation is needed for that preview.

Nothing in this package has been published to your GitHub account. The separately hosted ChatGPT version remains private. Enabling GitHub Pages using the public-repository route below makes this exported version publicly accessible.

## What you are working with

| Term         | Meaning for this project                                      |
| ------------ | ------------------------------------------------------------- |
| Source code  | The files you can open, edit, and save.                       |
| Repository   | Your project's folder and change history on GitHub.           |
| GitHub Pages | The service that turns these files into a website.            |
| Domain       | The address people type to reach your website.                |
| DNS          | The domain settings that point that address toward your host. |
| Commit       | A saved snapshot of changes, with a short description.        |
| Push         | Sending your local commits to GitHub.                         |

The portfolio itself uses plain HTML, CSS, and JavaScript. The React, Flutter, and other technology labels on the page describe your experience and projects. They do not mean this portfolio requires those frameworks.

## Files in this package

| File                      | What it does                                                                                            | When you edit it                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `index.html`              | Page structure, introduction, biography, skills, project cards, contact links, and vector illustrations | To change text, links, or page sections                    |
| `style.css`               | Colors, fonts, spacing, responsive layouts, and hover/focus states                                      | To change the design                                       |
| `app.js`                  | Experience data, project details, carousel, filtering, menus, and demo interactions                     | To change detailed content or behavior                     |
| `tower-particles.js`      | CN Tower entrance, cursor/touch response, and reduced-motion support                                    | To adjust the particle effect                              |
| `assets/img/cn-tower.png` | Transparent tower silhouette sampled by the particle script                                             | To replace the image mask                                  |
| `assets/img/cn-tower.svg` | Editable original artwork and static fallback                                                           | To edit the silhouette                                     |
| `favicon.svg`             | The small icon in the browser tab                                                                       | To change the monogram                                     |
| `robots.txt`              | Lets search crawlers access the exported site                                                           | Usually leave it alone; this is not an access-control file |
| `.nojekyll`               | Tells GitHub Pages to serve the static site without Jekyll processing                                   | Keep it in the repository root                             |
| `.gitignore`              | Excludes local editor files and temporary files when using Git                                          | Usually leave it alone                                     |
| `README.md`               | This guide, also displayed on your GitHub repository page                                               | Optional documentation changes                             |
| `START-HERE.html`         | A readable browser version of this guide                                                                | Optional; not needed to run the portfolio                  |

There is no build step, package installation, API key, database, server application, or paid hosting requirement for this version. You do not need `npm install`, React, Vite, or a GitHub Actions workflow file.

All asset paths are relative, including `./tower-particles.js` and `./assets/img/cn-tower.png`. They work at both a main site address and a repository subfolder. Keep the files and the `assets` folder together.

## 1. Preview it on your Windows computer

1. Download `martin-nguyen-portfolio-github-pages.zip`.
2. Right-click it and choose **Extract All**.
3. Open the extracted `martin-nguyen-portfolio` folder.
4. Double-click `index.html`. It should open in your browser.
5. Try the project arrows, filter buttons, experience tabs, and project detail views.

Open the extracted files, not files still inside the ZIP. To edit code, use a text/code editor such as Visual Studio Code. In the editor, open the whole extracted folder so you can see all the files together.

When you save an edit, refresh the browser to see it. A double-click preview is local to your computer. Shareable project links using `?project=nba` are enabled when the site is served over HTTP or HTTPS.

If you already have Python installed, an optional preview server is:

```powershell
# Run from the folder containing index.html.
py -m http.server 8000 --bind 127.0.0.1
```

Then open `http://localhost:8000`. Press Ctrl+C in the terminal when finished. If `py` is not found, use the double-click preview; Python is not required to publish the site.

## 2. Choose your GitHub address

A main personal site uses a special repository name matching the account that owns it. The examples below are configurations you can create, not claims that these sites are already live.

| GitHub account you use | Repository name          | Resulting address                 |
| ---------------------- | ------------------------ | --------------------------------- |
| `mtnnguyen`            | `mtnnguyen.github.io`    | `https://mtnnguyen.github.io/`    |
| `Martin207dev`         | `martin207dev.github.io` | `https://martin207dev.github.io/` |

The instructions below use `mtnnguyen`, the account linked in your current portfolio. If you choose the other account, use its matching repository name and address. Also update the profile links in `index.html` if you want visitors to land on that account.

If you already have a site in the special repository, inspect it before replacing anything. You can use a separate repository named `portfolio` instead. On the `mtnnguyen` account, that produces a project-site address of `https://mtnnguyen.github.io/portfolio/`. This package supports that subfolder too.

## 3. Upload through GitHub — the simplest first upload

For this route, you do not need a terminal or Git installed.

1. Sign into the GitHub account that will own the site.
2. Use the **+** menu → **New repository**.
3. Select the correct owner. Enter `mtnnguyen.github.io` as the repository name, or your chosen account's matching name.
4. Choose **Public** for GitHub Pages on GitHub Free. This makes the uploaded source visible to other people. Review your displayed email, profile links, and portfolio text first.
5. Turn **Add README** on and create the repository.
6. Choose **Add file → Upload files**.
7. Open the extracted folder on your computer. Upload the files **inside it**, including `tower-particles.js`, the complete `assets` folder, and `.nojekyll`; do not upload the ZIP or wrap everything in another folder.
8. Use a commit message such as `Add portfolio website`, then save the upload to `main`. If GitHub routes you through a new branch and pull request, merge that pull request into `main`.

The included `README.md` can replace the initial README GitHub created. Check the repository's Code tab: `index.html`, `style.css`, and `app.js` should be directly visible at the top level.

**Root means the top level.** If you must click a `martin-nguyen-portfolio` folder before reaching `index.html`, you uploaded the outer folder instead of its contents. Move the contents to the repository root before enabling Pages.

If `.nojekyll` is absent, you can add a file with exactly that name using GitHub's **Add file → Create new file**. It does not need application code inside it.

## 4. Enable the website

In your repository, open **Settings → Pages**, then configure:

| Setting | Value                |
| ------- | -------------------- |
| Source  | Deploy from a branch |
| Branch  | main                 |
| Folder  | / (root)             |

Save. You are now choosing to publish this copy on GitHub Pages. Ordinary personal Pages sites are public; a private repository is not automatically a private website.

Return to **Settings → Pages** and use **Visit site** when the deployment completes. Publication can take several minutes; GitHub says changes may take up to ten minutes. You can inspect the repository's **Actions** tab for the Pages deployment result.

You do not need to select a Jekyll theme or create `_config.yml`. `index.html` is your homepage and `style.css` already supplies the design.

The GitHub-hosted address is enough to share on applications or a résumé once you have reviewed the live site. A custom domain is optional.

## 5. Understand how the code fits together

The browser loads `index.html` first. These lines connect the other files:

```html
<link rel="stylesheet" href="./style.css" />
<script src="./app.js" defer></script>
<script src="./tower-particles.js" defer></script>
```

The stylesheet controls appearance. The script adds behavior after the HTML has been read. The `defer` attribute lets the script wait until the page structure is available.

In `app.js`, `$` means “find one element” and `$$` means “find all matching elements.” They are tiny local helper functions, not an installed library.

For example, a project button has `data-open="nba"`. The click handler reads that key and opens the corresponding entry from `const projects`. This is why keys like `nba`, `northstar`, and `utfr` must match across the HTML and JavaScript.

The experience buttons work similarly. A `data-experience="surveilone"` button selects the `surveilone` entry from `const experiences`.

## 6. Make common edits

### Change your introduction or biography

Open `index.html` and search for `hero-title` or `about-copy`. Change the text between the HTML tags. Keep the surrounding tags and IDs in place.

For example:

```html
<h1 id="hero-title">Hi, I’m <em>Martin.</em></h1>
```

The `<em>` element gives the name its green serif styling. You can change the words while keeping that structure.

### Update your email or GitHub profile

Search `index.html` and `app.js` for the current contact address. Replace every occurrence, including `mailto:` links. Search `index.html` for `github.com/mtnnguyen` to update the profile links.

`mailto:` opens the visitor's configured email application. It is not a contact form and does not send messages automatically.

### Edit an experience

Open `app.js` and find `const experiences`. Each entry contains:

- `date`: the small date or context label;
- `role`: your role heading;
- `org`: the organization line;
- `bullets`: the list of contribution descriptions;
- `link`: an optional flag for the existing UTFR detail button.

Edit the text inside the quotation marks and keep the commas and brackets intact. Keep the entry key, such as `surveilone`, the same unless you also update its HTML button.

### Edit a project

Search for `const projects` in `app.js`. The `title`, `summary`, `tags`, and `sections` fields control the featured carousel and project detail view.

The small project cards below the carousel are written separately in `index.html`. Update those descriptions too when you change a project's story. For UTFR, the carousel intentionally uses the shorter label `UTFR Perception`; that label is in `renderFeatured()`.

Adding a fourth project requires four matching pieces: a project entry in `app.js`, a card in `index.html`, an artwork template, and an appropriate filter category. For a first edit, updating the existing three is easier.

### Add a real project or repository link

Once you have verified the actual URL, add an anchor in the appropriate content block, such as:

```html
<a
  href="https://github.com/YOUR_USERNAME/YOUR_REPOSITORY"
  target="_blank"
  rel="noopener noreferrer"
>
  View source ↗
</a>
```

Replace both placeholders. Do not place an anchor inside an existing `<button>`; put it outside the button or in the project's detail view. The current GitHub links lead to your profile because exact individual project URLs were not verified.

### Change colors and spacing

Open `style.css`. The `:root` block contains the main colors:

```css
--paper: #f6f5ef;
--ink: #242b26;
--muted: #61695f;
--green: #2d543f;
--line: #d9dcd1;
```

Changing `--green` updates the main accent across the site. Other illustration and background shades are specified separately. Rules under `@media` adjust the layout for smaller screens; keep them if you want the mobile layout to remain responsive.

### Adjust the CN Tower animation

Open `tower-particles.js` and find `const SETTINGS` near the top. The supplied animation is already integrated; do not paste a second copy into `app.js`.

| Setting                          | What changing it does                                                     |
| -------------------------------- | ------------------------------------------------------------------------- |
| `scale`                          | Changes the tower size inside its canvas; start between `0.6` and `0.95`. |
| `rowGapDesktop` / `rowGapMobile` | Larger values create fewer, more widely spaced rows. Keep these positive. |
| `scatter`                        | Controls how far the line particles start from their final positions.     |
| `maxDist`                        | Sets the cursor/touch influence radius in pixels.                         |
| `repelStrength`                  | Controls how strongly the particles move away from the pointer.           |
| `fadeSeconds`                    | Sets how quickly the entrance fades in.                                   |

The tower uses the site's green accent (`--accent` points to `--green` in `style.css`). The animation runs once on entry and responds to your pointer. It pauses off-screen and stops drawing when settled. Visitors who request reduced motion see a static tower.

The transparent PNG and editable SVG are included, so there is no missing image to find. If you replace the PNG, use a transparent background: this effect treats every opaque pixel as part of the shape. Update the SVG static fallback too. The `FALLBACK_SHAPES` array in the script contains the original tower geometry for browsers that block pixel reading during a double-click (`file://`) preview; replacing that geometry is only needed if you want a different fallback shape. An HTTP preview uses your new PNG.

Anchor links scroll below the measured sticky header, update the URL hash when hosted, and highlight the current navigation item. Keyboard Tab navigation gets a clear focus outline. These behaviors live in `app.js`.

### Add your résumé

Put your reviewed PDF in the same folder, named `resume.pdf`, then add a link where you want it:

```html
<a href="./resume.pdf" target="_blank" rel="noopener noreferrer">
  View résumé ↗
</a>
```

A résumé is not included in this package. Do not add the link until the file exists. Review what contact details you want publicly available before uploading the PDF.

### Know what the previews represent

The shot dots are a fixed synthetic dataset, the map is an illustration, and the cones are an original annotation schematic. The captions disclose this. These interactions are not the full NBA Space Explorer or NorthStar applications, do not fetch live data, and do not show UTFR training images or model results.

## 7. Update the live website later

**Updating from the earlier download:** replace `index.html`, `style.css`, and `app.js`; add `tower-particles.js` and the complete `assets` folder. Upload the updated guide files if you want them in your repository. If you have already edited your own biography or links, carry those edits into the new files before replacing them. Keep any existing `CNAME` file for your custom domain.

For small changes, use GitHub's editor: open a file, edit it, and commit the change. For larger changes, edit the extracted folder locally, preview it, then upload the changed files again.

Once Pages is configured to use `main`, later changes committed to that branch can update the public website automatically. You do not need to change the Pages settings each time.

For repeated development, a local Git checkout is more convenient. If you use the browser-upload route first, this is an optional later workflow:

```powershell
# Run this from a folder where you want to keep your projects.
git clone https://github.com/mtnnguyen/mtnnguyen.github.io.git
cd mtnnguyen.github.io
```

Edit files in that cloned folder. Then:

```powershell
git status
git add .
git commit -m "Update portfolio content"
git push
```

Use your actual account and repository in the clone URL. If you also edited files on GitHub, run `git pull` before beginning the next local edit. Do not use force-push to resolve an unexpected history problem.

If Git reports permission denied, check which account is authenticated. Setting `git config user.name` changes commit attribution; it does not sign you into a different GitHub account. Do not embed passwords or access tokens into the site files.

## 8. Connect an optional custom domain

First get the free GitHub address working. A custom domain changes the address; GitHub Pages can remain the host. Domain registration and renewal are separate from hosting. Check the registrar's renewal price as well as its first-year price.

The examples below use `yourdomain.com` as a placeholder. Substitute a domain you actually own; no availability is implied.

### A. Verify ownership in account settings

Open your **GitHub profile menu → Settings → Pages → Add a domain**. Add your domain, then create the DNS TXT record GitHub supplies in your domain provider's DNS panel. Copy GitHub's exact record name and value rather than inventing them. Return to GitHub and verify. Keep that TXT record afterward.

These are account settings, not repository settings. GitHub recommends verification before attaching a domain to a repository.

### B. Attach it in repository settings

Open your **portfolio repository → Settings → Pages → Custom domain**. Enter `yourdomain.com` and save, without `https://` or a path.

Do this before directing the domain's web traffic to GitHub. With the branch-based setup in this guide, GitHub adds a `CNAME` file to the publishing branch. Keep it when you make later edits. If you maintain a local clone, pull that new commit before working locally.

No active `CNAME` is bundled here because you have not selected a domain.

### C. Set its DNS records

For a new domain dedicated to this portfolio, configure the following records at your DNS provider. `@` means the bare domain, and `www` means its www subdomain. Keep the default TTL unless your provider requires a value.

| Type  | Host/name | Value/target        |
| ----- | --------- | ------------------- |
| A     | @         | 185.199.108.153     |
| A     | @         | 185.199.109.153     |
| A     | @         | 185.199.110.153     |
| A     | @         | 185.199.111.153     |
| CNAME | www       | mtnnguyen.github.io |

Use your own account's `username.github.io` for the `www` target. Do not include `https://`, a slash, or the repository name. Even a project site uses the account-level hostname as its CNAME target.

The four A records are GitHub Pages' published IPv4 addresses checked on September 22, 2026. Refer to the official domain guide below if you are following this much later. IPv6 records are optional; the linked guide lists them.

Replace conflicting web records for the same host when switching it to GitHub. Preserve unrelated records, particularly existing email MX records and verification TXT records. Do not add a wildcard `*` record for this setup. If the domain already serves another website, moving its root records will move that website's address too; a dedicated subdomain can avoid that.

### D. Enable HTTPS and test both addresses

After GitHub's DNS check succeeds, enable **Enforce HTTPS** in the repository's Pages settings when available. DNS changes and certificate readiness can take time; GitHub allows up to 24 hours for the relevant changes/options.

Test `https://yourdomain.com` and `https://www.yourdomain.com`. With both DNS variants configured correctly, GitHub redirects the secondary variant to the custom domain you selected.

On Windows, an optional DNS check is:

```powershell
Resolve-DnsName yourdomain.com -Type A
Resolve-DnsName www.yourdomain.com -Type CNAME
```

## 9. Troubleshoot common issues

| Symptom                                             | Check                                                                                                             |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| GitHub address shows 404                            | Pages enabled, correct branch/folder, completed deployment, correct URL, and lowercase `index.html` in the root   |
| GitHub shows the guide instead of the portfolio     | Confirm `index.html` is at the publishing root; `README.md` is documentation, not your intended homepage          |
| Page is unstyled                                    | `style.css` is beside `index.html`; asset paths still begin with `./`; filename capitalization matches            |
| Buttons do nothing                                  | `app.js` uploaded beside the HTML; check the browser console for syntax errors after your edits                   |
| Changes seem missing                                | Check deployment completion, then hard-refresh with Ctrl+Shift+R                                                  |
| Mobile navigation looks wrong after edits           | Keep responsive CSS and the menu's IDs/data attributes consistent with `app.js`                                   |
| Email button does not send a message                | It opens a mail application; sending is the visitor's action                                                      |
| Custom domain fails                                 | Check repository Custom domain value, DNS targets, verification record, and propagation time                      |
| Local preview works but a project-site URL does not | Keep relative asset paths; use the URL containing the repository folder                                           |
| Git push is rejected                                | Confirm the authenticated account owns/has access to the repository, and reconcile remote changes before retrying |

## 10. Final review before sharing

Open the published address in a private/incognito browser window. Check the introduction, all three experience tabs, project arrows and filters, project dialogs, email link, and GitHub link. Resize to a phone width and check the mobile menu. Confirm the words describe your actual work and the contact details are what you intend to share.

This exported copy and the ChatGPT-hosted copy are separate. Editing files on GitHub will not automatically update the ChatGPT-hosted version, and changes here do not automatically sync back into your GitHub repository.

## Official references

Setup details were checked against GitHub's documentation on September 22, 2026. Product labels may change later.

- [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Choosing the publishing branch and folder](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Uploading repository files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Custom domain and DNS configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [HTTPS for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
