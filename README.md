# SourceDepth.com

This repository contains the source code for [SourceDepth.com](https://sourcedepth.com), a server-side rendered (SSR) website built using React and TanStack.

## Technology Stack

- **React**: Frontend UI library
- **TanStack Start**: Full-stack React framework based on TanStack Router
- **Tailwind**: A utility-first CSS framework
- **MDX**: JSX in markdown solution

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Fork and clone the repository

    ```bash
    git clone https://github.com/yourusername/website-ssr.git
    cd website-ssr
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Run the development server

    ```bash
    npm run dev
    ```

## Building for Production

```bash
npm run build
node .output/server/index.mjs
```

## Project Structure

```
website-ssr/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── server/      # Server-side code
│   └── utils/       # Utility functions
└── README.md
```

## License

[MIT](LICENSE)