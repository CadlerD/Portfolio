# Cadler Dahiti — Portfolio Site

A single-page portfolio built with Python (Flask) showcasing the
"Energy Efficient AI & Ethical Studies" McNair research project: the
Structural–Computational Efficiency Framework (SCEF) and the Telio
measurement tool.

## Run it locally

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

## Project structure

```
portfolio/
├── app.py                 # Flask app (one route: "/")
├── requirements.txt
├── templates/
│   └── index.html         # Page content
└── static/
    ├── style.css           # Design system (colors, type, layout)
    └── script.js           # Live Telio-style readability demo
```

## Hero layout

The hero now follows a title-bar + split two-column format: the sticky
nav acts as the title/nav bar, and below it the hero splits into a
left copy column (eyebrow, name, lead paragraph, bold summary
paragraph, meta chips) and a right image panel, closed off by a thin
gradient bar.

The right panel is currently a placeholder (`.hero-image` in
`static/style.css`, markup in `templates/index.html`). To use a real
photo:

1. Drop an image file into `static/`, e.g. `static/hero.jpg`.
2. In `templates/index.html`, replace the `<div class="hero-image">…</div>`
   block with:
   ```html
   <div class="hero-image">
     <img src="{{ url_for('static', filename='hero.jpg') }}" alt="Cadler Dahiti">
   </div>
   ```
3. In `static/style.css`, add `.hero-image img { width:100%; height:100%; object-fit:cover; }`
   so it fills the panel the same way the placeholder does.

## Customize

- **Contact links** — replace the email, CV link, and GitHub link
  under `<footer id="contact">` in `templates/index.html`.
- **Colors / type** — all design tokens are CSS custom properties at
  the top of `static/style.css` (`:root { ... }`).
- **Timeline phase names** — the 7-phase / 14-week plan in the
  `#timeline` section is written generically; swap in your actual
  phase titles from the proposal if they differ.
- **Live readout demo** — now lives inside the Telio section
  (`static/script.js` implements a simplified version of Telio's
  three scoring dimensions client-side; clearly labeled as
  illustrative since the real Telio calls the Claude API).

## Deploying

This is a small enough app to deploy almost anywhere that runs
Python + Flask (Render, PythonAnywhere, Fly.io, a university server,
etc.). For production, run it behind a proper WSGI server (e.g.
`gunicorn app:app`) rather than `python app.py`.

