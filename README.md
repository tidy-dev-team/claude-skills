# Tidy Skills

Tidy Dev Team's shared [Claude Code](https://claude.com/claude-code) skills,
packaged as an installable plugin via a marketplace.

## Install

In Claude Code:

```
/plugin marketplace add tidy-dev-team/claude-skills
/plugin install tidy-skills@tidy-skills-marketplace
```

Then restart Claude Code (or reload). The skills below become available; invoke
a skill with `/<skill-name>`.

## Skills

| Skill | What it does |
| --- | --- |
| `tidy-plugin-scaffold` | Scaffold a new standalone Figma plugin pre-wired to match the Tidy DS Toolbox architecture (React 19 + Vite UI, esbuild plugin thread, typed postMessage bridge, three-file module pattern, `@shell`/`@shared`/`@plugins` aliases, Vitest), so it can later be merged into the toolbox by copying one folder and adding three registration lines. |

## Repository layout

```
.claude-plugin/marketplace.json   ← lists the plugin(s)
tidy-skills/                      ← the plugin
  .claude-plugin/plugin.json
  skills/
    tidy-plugin-scaffold/
      SKILL.md
      template/                   ← scaffold files copied + token-substituted by the skill
```

## Adding a skill

1. Create `tidy-skills/skills/<name>/SKILL.md` (frontmatter: `name`, `description`)
   plus any support files the skill copies.
2. Bump `tidy-skills/.claude-plugin/plugin.json` `version`.
3. Commit and push. Installed users update via `/plugin` (or re-add the marketplace).

## Provenance

This repo contains only skills authored by the Tidy Dev Team. Third-party skills
we use locally (e.g. Matt Pocock's engineering skills, Chakra UI skills) are not
redistributed here — install those from their own sources.
