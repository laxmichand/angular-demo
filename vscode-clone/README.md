# VS Code Clone - Production Ready

A production-ready Visual Studio Code clone built with Angular, TypeScript, and modern web technologies.

## Features

- **Editor Interface**: Full-featured code editor with syntax highlighting
- **File Explorer**: Navigate and manage project files
- **Terminal Integration**: Built-in terminal support
- **Extensions System**: Plugin architecture for extensibility
- **Theme Support**: Light/Dark/High Contrast themes
- **Performance Optimized**: Lazy loading, virtual scrolling, AOT compilation
- **Accessibility**: WCAG 2.1 AA compliant
- **PWA Support**: Works offline with service workers

## Tech Stack

- **Frontend**: Angular 19+, TypeScript 5+
- **Editor**: Monaco Editor
- **State Management**: NgRx
- **Testing**: Jasmine, Karma
- **Build**: Angular CLI, WebPack 5
- **Package Manager**: npm/yarn

## Project Structure

```
vscode-clone/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── shared/
│   │   ├── modules/
│   │   ├── store/
│   │   └── app.module.ts
│   ├── assets/
│   ├── styles/
│   ├── environments/
│   ├── main.ts
│   └── index.html
├── e2e/
├── dist/
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
# Clone the repository
git clone https://github.com/laxmichand/angular-demo.git
cd vscode-clone

# Install dependencies
npm install

# Development server
npm start

# Build for production
npm run build:prod

# Run tests
npm test

# E2E tests
npm run e2e
```

## Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture.
See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT