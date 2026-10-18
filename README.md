# Magnetic Impeller Animations

Two interactive, vector-quality animations, ready for GitHub Pages. No installation, build command, API keys, account integration, or external libraries are required.

- **Front view:** external anticlockwise, internal clockwise by default. Both shafts are viewed from the same right-hand end.
- **Side view:** external clockwise, internal anticlockwise, illustrated right-to-left flow by default. Includes an N20 motor on a stand, a diametric cylinder above the tube, and two touching transverse-magnetized cubes inside the impeller.
- Both views include play/pause, reset, a full-turn scrubber, reversible rotation, playback speed, optional looping, and SVG/3× PNG frame export.
- The original experimental video is not included.

## Start locally

1. Extract the ZIP.
2. Open `index.html` in a current desktop or mobile browser.
3. Choose Front view or Side view.

Keep the files together. The HTML files reference the adjacent `styles.css` and `animations.js`. They do not need a local server.

## Upload and publish with GitHub Pages

1. Create a repository, for example `magnetic-impeller-animations`.
2. Select **Add file → Upload files**.
3. Upload the **contents of this extracted folder**, not the ZIP and not an extra enclosing folder. `index.html` must be at the repository's top level, alongside the CSS and JavaScript.
4. Commit the files to the `main` branch.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, select **Deploy from a branch**.
7. Select branch **main**, folder **/ (root)**, then **Save**.
8. When deployment finishes, Pages will show the website URL. It usually has this form:

   `https://YOUR-USERNAME.github.io/magnetic-impeller-animations/`

You do not need a GitHub Actions workflow for this package. The `.nojekyll` file disables Jekyll processing; if your file picker hides dotfiles, these ordinary HTML/CSS/JS files can still be served without it.

### Visibility

GitHub Pages normally makes the website publicly accessible, even if the source repository is private. A truly private Pages site requires supported GitHub Enterprise Cloud organization access controls. Publishing from a private repository and publishing a private website are different features. This ZIP has not been published for you.

### If the page does not work

- **404:** confirm `index.html` is at the top level of the selected publishing folder and check the repository's Pages deployment status.
- **Unstyled page or no motion:** confirm `styles.css` and `animations.js` were uploaded alongside the HTML files, preserving case and filenames.
- **Old version:** wait for the new deployment to finish, then refresh the browser cache.
- **ZIP shown instead of a website:** extract the ZIP and upload its contents.
- **Phone file manager won't open the site:** use a browser or open the GitHub Pages URL after publishing.

## Included files

| File | Purpose |
| --- | --- |
| `index.html` | Overview with links to both animations |
| `front-view.html` | End-on rotation comparison |
| `side-view.html` | Experimental side-view animation |
| `styles.css` | Responsive page layout and controls |
| `animations.js` | SVG drawing, physical model, animation, and exports |
| `MODEL-NOTES.md` | Coordinates, assumptions, and interpretation |
| `START-HERE.txt` | Short upload checklist |
| `.nojekyll` | Static hosting marker |
| `.gitignore` | Ignores operating-system metadata files |

## Quality and verification

All geometry is SVG and stays sharp when zoomed. Exported SVGs are self-contained; PNG exports use three times the export layout resolution (front: 2400 × 1590; side: 3300 × 1740 pixels). These are still-frame exports, not video exports. The site has no CDN/font dependencies, trackers, cookies, or network requests of its own.

The package was checked for JavaScript syntax, HTML asset links, magnetic-field rotation signs, finite SVG geometry across a full turn, and rendered sample frames. Interactive controls were exercised in a DOM simulation. A full browser interaction test was not available in the authoring environment.

## Model and editing

Read `MODEL-NOTES.md` before interpreting the animation as experimental evidence. The illustrations are not calibrated magnetic-field or fluid simulations.

Edit the colors/layout in `styles.css`; edit animation geometry, defaults, and physics in `animations.js` and the HTML controls. There is no build step. Upload edited files to the same repository to update the site.

## GitHub documentation

- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Pages access control](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)
