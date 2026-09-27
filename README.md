# yoankrastev.com

Personal essay site built with [Astro](https://astro.build).

```sh
npm install
npm run dev      # local preview at http://localhost:4321
npm run build    # production build into dist/
```

Everything you'd edit is markdown:

- **Essays:** one file per essay in `src/content/essays/`.
- **Page wording** (homepage, About, Newsletter, menu, buttons): `src/content/pages/`. Change the text under each `## Heading`; keep the headings as they are.

## Documentation

- [AGENTS.md](AGENTS.md) — conventions: file structure, adding an article, editing page wording, changing the palette, design rules, pitfalls. Also read by Claude Code (`CLAUDE.md` is a symlink to it).
- [docs/decisions.md](docs/decisions.md) — why the site is built this way.
- [docs/roadmap.md](docs/roadmap.md) — what is still placeholder, and upgrades worth doing.
- [docs/deployment.md](docs/deployment.md) — hosting and going live.
- [docs/images.md](docs/images.md) — social preview image and icons.
