# 🏖️ Beach Box - Complete Beginner's Guide

Welcome! This is your complete guide to building Beach Box - a modern website for sunscreen vending machines that protect beachgoers across Florida. **Don't worry if you're new to coding** - we'll walk you through everything step by step!

## 🌊 What Is This Project?

This project contains two main things:

1. **Beach Box Website** - A beautiful marketing website for Beach Box sunscreen vending machines
2. **Unify UI Library** - A collection of pre-built components (like buttons, forms, etc.) that make building websites easier

Think of it like having a toolbox full of website parts that you can use to build amazing things!

## 🎯 What You'll Learn

By the end of this guide, you'll know how to:

- Start the entire project with one simple command
- Make changes and see them instantly in your browser
- Use AI to help you build features faster
- Deploy your website to the internet for free

## 📋 What You Need First (Prerequisites)

Before we start, you need to install these tools on your computer. Don't worry - they're all free!

### 1. Install Node.js 🟢

Node.js lets us run JavaScript on our computer and is needed for our development tools.

**Download here:** <https://nodejs.org/>

- Choose the **LTS version** (Long Term Support)
- Download the installer for your operating system
- Run the installer and follow the instructions

**How to check if it worked:**
Open your terminal/command prompt and type:

```bash
node --version
```

You should see something like "v20.0.0" or higher.

### 2. Install pnpm 📦

pnpm is a fast package manager that handles all our project dependencies.

**Install it by running this command:**

```bash
npm install -g pnpm
```

**How to check if it worked:**

```bash
pnpm --version
```

You should see something like "8.10.0"

### 3. Install Git 📂

Git helps us manage our code and download this project.

**Download here:** <https://git-scm.com/downloads>

**How to check if it worked:**

```bash
git --version
```

You should see something like "git version 2.40.0"

### 4. Get a Code Editor 💻

We recommend **Cursor** - it's like a super-smart text editor that helps you write code with AI.

**Download here:** <https://cursor.sh/>

Alternative: **VS Code** - <https://code.visualstudio.com/>

## 🚀 Quick Start (Simple Setup)

Now for the exciting part! Let's get everything running.

### Step 1: Download This Project

1. Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux)
2. Navigate to where you want to put the project (like your Desktop):

   ```bash
   cd Desktop
   ```

3. Download the project:

   ```bash
   git clone https://github.com/TimCrooker/Beach-Box-Monorepo.git
   cd Beach-Box-Monorepo
   ```

### Step 2: Install Dependencies 📦

Install all the project dependencies:

```bash
pnpm install
```

**What this does:**

- Downloads all the code libraries and tools needed
- Sets up the development environment
- Prepares everything for hot reloading

**First time?** It might take 2-3 minutes to download everything. Grab a coffee! ☕

### Step 3: Start the Development Server 🎉

Start the Beach Box website:

```bash
pnpm dev
```

**What this does:**

- Starts the Beach Box website with hot reloading
- Builds the component library in watch mode
- Enables instant updates when you make changes

### Step 4: Open Your Browser 🌐

Once you see messages like "Local: http://localhost:3003", open your browser and go to:

- **Beach Box Website**: <http://localhost:3003>

🎉 **Congratulations!** You now have the Beach Box website running!

### Step 5: Start Storybook (Optional) 📚

To explore the component library, open a **new terminal** and run:

```bash
pnpm storybook
```

Then open:

- **Component Library (Storybook)**: <http://localhost:6006>

This shows you all the available components you can use!

## 🔥 Making Changes (Hot Reloading Magic)

The coolest part? **You can see your changes instantly!**

1. Open the project in Cursor (or your code editor)
2. Navigate to `apps/beach-box-landing/src/routes/index.tsx`
3. Change some text, like the main heading
4. Save the file (Ctrl+S or Cmd+S)
5. Look at your browser - the change appears instantly! 🪄

**This works for:**

- Text changes
- Style changes
- Adding new components
- Everything!

## 🧱 Using the Component Library

The Unify UI library is your secret weapon - it has tons of pre-built components ready to use!

### What's Available?

**Basic Components:**

- Buttons, Forms, Cards, Navigation menus
- Charts, Tables, Modals, Tooltips

**Advanced Blocks:**

- Hero sections, Feature showcases, Testimonials
- Contact forms, Pricing cards, FAQ sections
- User profiles, Dashboards, Login forms

### How to Use Components

1. **Browse available components**: Go to <http://localhost:6006> (Storybook)
2. **Click through the components** to see what's available
3. **Copy the code** from the examples
4. **Paste into your project** and customize!

**Example - Adding a Button:**

```tsx
import { Button } from '@beach-box/unify-ui';

function MyPage() {
  return (
    <div>
      <Button>Click me!</Button>
    </div>
  );
}
```

## 🤖 Using AI to Build Faster (Cursor Guide)

Here's how to supercharge your development with AI:

### 1. Set Up Cursor AI

1. Open Cursor
2. Press `Ctrl+L` (or `Cmd+L` on Mac) to open the AI chat
3. You can now ask questions and get help with your code!

### 2. Best Practices for AI Coding

**🔑 The Secret Sauce: Include the Unify UI README in your context!**

When asking AI for help, always include this in your message:

```
I'm working on the Beach Box project. Here's the context about available components:

[Then copy and paste the content from packages/unify-ui/README.md]

Now, can you help me [your question]?
```

**Why this works:**

- The AI knows exactly what components are available
- It can suggest the perfect components for your needs
- It writes code using the actual components in your project

### 3. Example AI Conversations

**Instead of:** "How do I make a contact form?"

**Try this:** "I'm building a Beach Box contact form. Based on the available unify-ui components [paste README content], what's the best way to create a contact form with name, email, phone, and message fields?"

**Instead of:** "How do I make this look better?"

**Try this:** "Looking at the available unify-ui components [paste README content], how can I improve this hero section to make it more engaging for Beach Box customers?"

### 4. Common AI Prompts That Work Great

```
"Based on the unify-ui components available, help me create a pricing section for Beach Box"

"I need to add a testimonials section. What unify-ui components should I use and how?"

"Help me make this page responsive using the available layout components"

"I want to add a contact form that matches the Beach Box design. Show me the best approach"
```

## 🌐 Deploying to the Internet (Vercel)

Ready to show your work to the world? Let's deploy to Vercel (it's free!):

### Step 1: Create a Vercel Account

1. Go to <https://vercel.com>
2. Click "Sign Up"
3. Use your GitHub account to sign up

### Step 2: Connect Your Project

1. Push your code to GitHub:

   ```bash
   git add .
   git commit -m "My Beach Box improvements"
   git push origin main
   ```

2. In Vercel dashboard, click "New Project"
3. Import your GitHub repository
4. Choose "Beach Box Landing" as the project to deploy

### Step 3: Configure the Build

**Root Directory:** `apps/beach-box-landing`
**Build Command:** `pnpm build`
**Output Directory:** `dist`

### Step 4: Deploy

Click "Deploy" and wait 2-3 minutes. You'll get a free URL like `your-project.vercel.app`!

**🎉 Your website is now live on the internet!**

### Auto-Deploy Setup

Want your website to update automatically when you make changes?

1. In Vercel, go to your project settings
2. Enable "Auto-deploy" from the main branch
3. Now every time you push code, your site updates automatically!

## 🛠️ Useful Commands

Here are all the commands you might need:

```bash
# Install dependencies
pnpm install

# Start the Beach Box website (main command)
pnpm dev

# Start the component library explorer
pnpm storybook

# Build for production
pnpm build:landing

# Preview production build
pnpm preview:landing

# Format your code to look pretty
pnpm format

# Check for code issues
pnpm lint

# Stop the development server
Ctrl+C (or Cmd+C on Mac)
```

## 🎨 Project Structure (What's What)

Here's what each folder does:

```
Beach-Box-Monorepo/
├── 🏖️ apps/
│   └── beach-box-landing/     # The main website
│       ├── src/routes/        # Website pages
│       ├── src/components/    # Custom components
│       └── public/           # Images and assets
├── 📦 packages/
│   └── unify-ui/             # Component library
│       ├── src/components/   # All the reusable components
│       └── stories/          # Storybook examples
└── 🔧 shared/                # Shared configuration
    ├── eslint-config/        # Code quality rules
    ├── schemas/              # Data validation
    └── tsconfig/             # TypeScript settings
```

**Focus on these folders:**

- `apps/beach-box-landing/src/routes/` - Website pages
- `packages/unify-ui/src/components/` - Available components

## 🔧 Troubleshooting

**Problem: `pnpm` command not found**

- Make sure you installed pnpm: `npm install -g pnpm`
- Restart your terminal after installation

**Problem: `node` command not found**

- Make sure Node.js is installed from <https://nodejs.org/>
- Restart your terminal after installation

**Problem: Port already in use**

- Something else is using port 3003
- Try stopping other development servers
- Or find and kill the process using that port

**Problem: Changes not showing up**

- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check the terminal for error messages
- Stop the server (Ctrl+C) and restart with `pnpm dev`

**Problem: Can't access the website**

- Make sure you're going to `http://localhost:3003`
- Check that `pnpm dev` is running without errors
- Look for "Local: http://localhost:3003" message in terminal

**Problem: Dependencies won't install**

- Delete `node_modules` folder and `pnpm-lock.yaml`
- Run `pnpm install` again
- Make sure you have a stable internet connection

**Problem: AI not helping much**

- Remember to include the unify-ui README in your context
- Be specific about what you're trying to build
- Ask for code examples, not just explanations

## 🎯 What to Do Next

Now that you have everything running, here are some fun things to try:

### Beginner Tasks

1. **Change the homepage text** - Edit `apps/beach-box-landing/src/routes/index.tsx`
2. **Add a new button** - Use a Button component from unify-ui
3. **Change colors** - Modify the Tailwind classes
4. **Add a new page** - Create a new file in the `routes` folder

### Intermediate Tasks

1. **Build a contact form** - Use the ContactForm components
2. **Add a testimonials section** - Use TestimonialsGrid
3. **Create a pricing page** - Use PricingCards
4. **Add animations** - Explore the animation components

### Advanced Tasks

1. **Connect to a database** - Add data persistence
2. **Add user authentication** - Use the auth components
3. **Build a dashboard** - Use the application blocks
4. **Add e-commerce** - Use the e-commerce components

## 🤝 Getting Help

**Stuck?** Here's how to get help:

1. **Use AI first** - Ask Cursor AI with the unify-ui context
2. **Check the browser console** - Press F12 to see error messages
3. **Look at the terminal** - Error messages appear here too
4. **Check the documentation** - Each component has examples in Storybook
5. **Ask the community** - Create an issue on GitHub

## 🏆 Pro Tips

1. **Always include unify-ui context** when asking AI for help
2. **Use Storybook** to explore components before coding
3. **Start small** - Make one change at a time
4. **Save often** - Use Ctrl+S frequently
5. **Use hot reloading** - Save and watch changes appear instantly
6. **Check the browser console** - It shows helpful error messages
7. **Deploy early** - Get your changes online quickly to see them in action

## 🎉 Congratulations

You now have:

- ✅ A complete development environment running
- ✅ A beautiful Beach Box website
- ✅ A component library with tons of pre-built parts
- ✅ AI assistance to help you build faster
- ✅ The ability to deploy to the internet

**You're ready to build amazing things!** 🚀

---

**Happy Coding!** 🏖️ Remember: Every expert was once a beginner. You've got this!
