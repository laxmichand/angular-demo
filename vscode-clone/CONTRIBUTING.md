# Contributing to VS Code Clone

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`

## Development Guidelines

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Format with Prettier: `npm run format`
- Lint with ESLint: `npm run lint`

### Commit Messages

Use conventional commits:
```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes
refactor: refactor code
test: add/update tests
chore: maintenance
```

### Testing

- Write unit tests for all new features
- Maintain 85%+ code coverage
- Run tests: `npm test`

### Pull Request Process

1. Update CHANGELOG.md
2. Update documentation if needed
3. Run `npm test` and ensure all tests pass
4. Submit PR with clear description
5. Address review comments

## Directory Structure

```
src/app/
├── core/
│   ├── services/        # Core services
│   ├── guards/          # Route guards
│   └── interceptors/    # HTTP interceptors
├── shared/
│   ├── components/      # Shared components
│   ├── directives/      # Shared directives
│   ├── pipes/           # Shared pipes
│   └── models/          # Shared models
├── modules/
│   ├── editor/          # Editor feature module
│   ├── file-explorer/   # File explorer module
│   ├── terminal/        # Terminal module
│   └── settings/        # Settings module
├── store/               # NgRx store
└── app.component.ts     # Root component
```

## Performance Guidelines

- Use OnPush change detection
- Implement lazy loading
- Use virtual scrolling for large lists
- Optimize bundle size
- Profile with Chrome DevTools

## Reporting Issues

1. Search existing issues first
2. Provide clear reproduction steps
3. Include expected vs actual behavior
4. Add screenshots/logs if applicable

## Code Review

All submissions require review. We use GitHub Pull Requests for this purpose.

## License

By contributing, you agree your code will be licensed under MIT.