# 🌐 Next.js 14 Starter Template

This feature-rich Next.js 14 starter template is designed to optimize development workflows and ensure high-quality, maintainable code. It integrates a variety of development tools and custom configurations tailored for modern front-end development.

## 🚀 Features

- 📏 **[TypeScript](https://www.typescriptlang.org/docs/)**: Enhances developer experience and code quality by ensuring type safety.
- 🎨 **[Tailwind CSS](https://tailwindcss.com/docs)**: Accelerates UI development, integrated with [Prettier Plugin Tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) for automated CSS class sorting, enhancing readability.
- 🌿 **[Biome](https://biomejs.dev/guides/getting-started/)**: Provides lightning-fast linting and formatting, integrated into both the pre-commit hooks and the CI pipeline to maintain code quality without compromising on speed.
- 🐶 **[Husky](https://typicode.github.io/husky/get-started.html) and [lint-staged](https://github.com/lint-staged/lint-staged?tab=readme-ov-file#examples)**: Ensure that all committed code conforms to the formatting standards set by Biome, making pre-commit checks fast and efficient.
- ⚙️ **Custom GitHub Actions Workflows**: Implements parallel linting, type checking, and builds to streamline CI/CD processes.

## 🌟 Getting Started

### Prerequisites

- 📦 Node.js (v20)
- 🛠️ pnpm (v9)

### Setup

Instead of cloning the entire repository with its git history, you can create a new project based on this template:

- **Using GitHub Template Feature**: Click on the "Use this template" button on the GitHub repository page to create a new repository with the same directory structure and files.

- **Using degit**: If you prefer not to include the original git history, you can use `degit`:

```bash
pnpm dlx degit https://github.com/blazeshomida/nextjs14-starter-template <your-project-name>
cd <your-project-name>
pnpm install
```

### Running the Development Server

Start the server with:

```bash
pnpm dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view your application. Changes in the code will automatically refresh the page.

## ⚙️ Configuration Details

### 🔧 Why Custom Configurations?

- **Disabling Next.js Linting and Type Checking**: Linting and type checking by Next.js during builds are disabled to optimize build times. Our rigorous CI/CD processes handle these tasks in parallel, ensuring faster development cycles while maintaining code quality.

### [Biome](https://biomejs.dev/guides/getting-started/)

Configured in `biome.json`, Biome handles linting and formatting with optimized settings for speed:

- **Organize Imports**: Automatically organizes imports on save.
- **Linter and Formatter**: Ensures code consistency with minimal overhead, ignoring unnecessary files like `.vscode`, `node_modules`, and `.next`.

The configuration can be adjusted according to project needs by modifying `biome.json`.

### [Husky](https://typicode.github.io/husky/get-started.html) and [lint-staged](https://github.com/lint-staged/lint-staged?tab=readme-ov-file#examples)

Set up in the `.husky/pre-commit` hook, this combination ensures that all staged files are automatically formatted by Biome before they are committed, keeping the codebase consistent and clean.

### CI/CD with GitHub Actions

The `.github/workflows/ci.yaml` defines three main jobs:

- **Biome**: Runs linting and formatting checks.
- **Check Types**: Performs TypeScript checks to ensure type safety.
- **Build**: Compiles the application, dependent on the successful completion of the `Biome` and `Check Types` jobs.

This setup ensures that all merges into the main branch are reliable and tested.

## 🔄 Continuous Integration

Our CI processes are detailed and designed to catch issues early, allowing developers to focus on adding value without worrying about breaking changes.

## 🚀 Deployment

Ready to be deployed with [Vercel](https://vercel.com/new), this setup includes pre-configured previews for each pull request and automatic deployments to production on merge.

## 🔍 Learn More

Here are some useful resources for learning more about the technologies and tools used in this template:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prettier Plugin Tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [Biome](https://biomejs.dev/guides/getting-started/)
- [Lint-Staged](https://github.com/lint-staged/lint-staged?tab=readme-ov-file#examples)
- [Husky](https://typicode.github.io/husky/get-started.html)
