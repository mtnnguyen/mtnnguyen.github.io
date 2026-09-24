# Martin Nguyen — Personal Portfolio

My personal website showcasing my background, experience, and interests in data science, statistics, sports analytics, and geospatial applications.

**[Visit my portfolio](https://mtnnguyen.github.io/)**

## About the Website

- **About:** My background, interests, and technical toolkit.
- **Experience:** My work with UTFR, SurveilOne, and the Canadian Armed Forces Reserve.
- **Projects:** NBA Space Explorer, NorthStar, and my UTFR perception contribution.
- **Contact:** Links to connect with me.

The website includes an interactive particle portrait, project filters, a featured-project carousel, and project detail dialogs.

Project previews contain illustrative graphics and synthetic data rather than actual project screenshots or live results.

## Technologies

Built with HTML, CSS, and vanilla JavaScript, using SVG and the Canvas API. No dependencies or build step are required.

## Editing the Website

| Content | File |
| --- | --- |
| Introduction, About, toolkit, and contact links | `index.html` |
| Experience descriptions | `experiences` in `app.js` |
| Project details and tags | `projects` in `app.js` |
| Project cards and illustrations | `index.html` |
| Colours, typography, and layout | `style.css` |
| Animated portrait | `tower-particles.js` |
| Photos | `assets/img/` |

Keep project information consistent between `index.html` and `app.js`.

## Local Preview

With Python installed, run this from the repository folder:

    python -m http.server 8000

Then visit http://localhost:8000.

## License

See [LICENSE](LICENSE).