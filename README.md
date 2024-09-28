# Ivado Port

## The assignment

A new virus is spreading around the world.  It is hitting China and Italy with full force and is continuing its relentless progression. The lockdowns are abundant and occur at any time in different regions of the world. The whole supply chain is affected, the entire world is throwing  itself on toilet paper... why toilet paper more than anything else, nobody understands! 

Sound familiar? In this context, ports all over the world are overwhelmed and all their yards are chaotic. One of these ports approaches you and asks for your help in prioritizing the medical supplies arriving by ship.

They explain that the shortage of truckers is hitting them hard, and they need to encourage these carriers to pick up these valuable containers so that the medical contents can help save lives. Here are the main objectives they mention to you:

- They want to, through an artificial intelligence tool, validate the
containers identified by the algorithm as most likely to have medical
supplies. This tool is therefore a decision aid;
- They want to emphasize to shipping companies the importance of these containers.

For the assignment, consider the following questions:
1. What information are you missing in order to start sketching the user interface? If you want to do the whole assignment at once, you will have to give hypothetical answers to the questions asked in this question, in order to move on to questions 2-3 and 4;
2. What "Off The Shelf" tools would you use to quickly output a visualization of the data (both incoming and outgoing from the algorithm)?
3. What would an initial front-end interface look like? Please build a quick mock-up in whatever framework works best for you
4. What would the front-end architecture look like for the full application in production? How would you evolve over time the mockup to the full application?

## Notion

[Documentation](https://www.notion.so/Technical-Assignment-Prioritizing-Medical-Supplies-in-Overwhelmed-Ports-d1853202dd7d4ee5be5beb0e6a1618b4?pvs=4)

## Working like one

- We use prettier to keep consistency on code with `.prettierrc` and `.prettierignore`
- Set `Editor: Format on Save` to format on the flight

## Generate supabase type

- `npx supabase login`
- `npx supabase gen types typescript --project-id "SUPABASE_ID" --schema public > ./app/types/supabase.ts`

## Nuxt UI Pro

[![Nuxt UI Pro](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20Pro-00DC82?logo=nuxt.js&labelColor=020420)](https://ui.nuxt.com/pro)

- [Live demo](https://dashboard-template.nuxt.dev/)
- [Play on Stackblitz](https://stackblitz.com/github/nuxt-ui-pro/dashboard)
- [Documentation](https://ui.nuxt.com/pro/getting-started)


## Quick Start

- Copy `.env.local` in `.env` to run the project

```bash
npx nuxi init -t github:nuxt-ui-pro/dashboard
```

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build
```

Locally preview production build:

```bash
# pnpm
pnpm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
