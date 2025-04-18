# Welcome to your College ID Management System 

## Project info

**URL**: https://lovable.dev/projects/15bf00ee-a0a9-46f8-9614-915adf5839f0

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/15bf00ee-a0a9-46f8-9614-915adf5839f0) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Git Ignore Configuration

This project uses a global Git ignore configuration to prevent modifying read-only files.

To set up your local Git ignore:
1. Copy the contents of `~/.gitignore_global` to your global Git ignore file
2. Run: `git config --global core.excludesFile ~/.gitignore_global`

### Local Development Ignores

For project-specific ignores, create a `.git/info/exclude` file in your local repository:
```bash
# Create local excludes
touch .git/info/exclude
```

Add any local-only ignores to this file, which won't be committed to the repository.
