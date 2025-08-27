# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a research blog project designed to evolve through 3 phases:
1. **Phase 1**: Static Astro blog with markdown content
2. **Phase 2**: Are.na integration for content management
3. **Phase 3**: Telegram bot for frictionless posting

The architecture prioritizes static site generation throughout all phases for deployment to Hostinger shared hosting.

## Development Commands

Based on typical Astro projects, use these commands:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build static site for production
- `npm run preview` - Preview production build locally

## Key Architecture Principles

### Static-First Approach
- **Output**: Always static HTML files (no SSR)
- **Content**: Build-time fetching only (no runtime API calls)
- **Deployment**: FTP to Hostinger via GitHub Actions
- **Performance**: < 100KB pages, no required JavaScript

### Hostinger Deployment Constraints
- No Node.js runtime available
- No server-side code execution
- FTP deployment only
- All routes must be static HTML files
- Use `.htaccess` for clean URLs

### Are.na Integration Pattern
- Fetch content during build process only
- Transform Are.na blocks to markdown files
- Use Astro integration hooks for build-time operations
- Trigger rebuilds via GitHub Actions repository_dispatch

### Content Structure
- Markdown files with frontmatter (title, date, tags, description)
- Static pagination and tag filtering
- RSS feed generation
- Image optimization at build time

## Deployment Architecture

```
GitHub → Actions → Build → FTP → Hostinger
              ↑
         Triggered by:
         - Push to main
         - Are.na webhook
         - Telegram bot
```

The deployment workflow uses `SamKirkland/FTP-Deploy-Action` to upload the `./dist/` directory to Hostinger's `/public_html/research/` path.

## Important Files

- `prd.txt` - Complete product requirements document with detailed specifications
- `astro.config.mjs` - Must specify `output: 'static'` and `format: 'directory'`
- `.github/workflows/deploy.yml` - Deployment automation
- `.htaccess` - URL rewriting for clean URLs on shared hosting

## Future Integration Points

- Are.na API client for build-time content fetching
- Telegram bot service (runs separately, not in this repo)
- GitHub Actions webhook triggers for automated rebuilds
- ALWAYS use tailwind 3.4 defaults to write css. \
Only if styling is not covered point it out to me that you have to use something else ask me before implementing it.