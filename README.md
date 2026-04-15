# Large Project Group 7
KnightRate is a UCF-focused course and professor review platform for students to rate and discover classes. 
## App Description
The app consists of a web and mobile component.  The web and mobile components have the same functionalities and are intended to follow a similar layout and style theme.  The app is a course/professor assessment app that was built as part of the Large Project for the UCF course COP 4331 during the Spring 2026 semester.  The app allows both registered and unregister users access, but provides less functionality to unregistered users.  Users can select a course or course+professor pair and view ratings summaries of the selected course or course+professor pair.  Also displayed with the ratings summaries are a list of multiple-choice questionnaires (under both the course-only and course+professor pair sections), and a summary of past responses, that registered users have created through the app.  Othser registered user can respond to these multiple-choice questionnaires provided they have rated that course or course+professor pair, didn’t create the questionnaire, and haven’t already responded to the questionnaire.  Registered users can also create ratings for a selected course-only or course+professor pair.  Unregistered user only have the ability to view ratings summaries and questionnaire results.

## AI Assistance Disclosure

This project was developed with assistance from generative AI tools:

- **Tool**: ChatGPT 5.1 (OpenAI)
- **Dates**: April 4, 2026
- **Scope**: Generate App Logo
- **Use**: Used Chat to generate a logo for the "KnightRate" app.

- **Tool**: Claude Sonnet 4.6 (Anthropic)
- **Dates**: March 21 - April 13, 2026
- **Scope**: Function desgin, formatting, and React/TypeScript standards
- **Use**: Collaborated with Claude throughout the project to help understand
how to implement functions in TypeScript/React. For example, charts, updating
states "onChange"(s), etc.

- **Tool**: Claude Sonnet 4.6 (Anthropic)
- **Dates**: April 10 - April 12, 2026
- **Scope**: CSS Styling on Web App
- **Use**: Collaborated with Claude to help me match the styling of the mobile
app, given the context of the mobile app's layout and color schemes.

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- Andrew Kelton Frontend Developer


## Git Workflow

Follow this workflow when contributing to the project:

### 0. Clone the Repository (First Time Only)

If you haven't already, clone the repo to your local machine:

```bash
git clone https://github.com/AndrewKelton/large-project
cd large-project
```

### 1. Get the Most Recent Changes

Before starting any work, pull the latest changes from the `dev` branch:

```bash
git checkout dev
git pull origin dev
```

### 2. Create a Feature Branch

Create a new branch for your work. Use the naming convention based on what you're working on:

**Frontend developers:**
```bash
git checkout -b front-end/<feature-name>
```

**API developers:**
```bash
git checkout -b api/<feature-name>
```

**Database developers:**
```bash
git checkout -b database/<feature-name>
```

Replace `<feature-name>` with a descriptive name for the feature you're implementing (e.g., `front-end/user-authentication`, `api/database-optimization`, `database/user-table`).

### 3. Commit Changes Regularly

> 💡 **Before committing, always verify you're on the correct branch!** Run the following in your terminal to confirm:
> ```bash
> git branch
> ```
> Your current branch will be highlighted with a `*`. If you're not on the right branch, switch before committing.

As you work, commit your changes regularly with clear, descriptive commit messages:

```bash
git add .
git commit -m "Description of changes made"
```

### 4. Push Your Changes

Push your branch when you reach a good point in your work. A "good point" means:
- Your code compiles/runs without errors
- You've completed a logical unit of work (a complete feature or significant portion)
- Your changes are tested and working as intended
- You want to back up your work or share progress with the team

```bash
git push origin <your-branch-name>
```

or
```bash
git push
```

### 5. Create a Pull Request

The first time you push, you'll see a pull request link in the terminal. **CMD+click on this link** to open the pull request in your browser.

**⚠️ Important:** Make sure you set the base branch to `dev`, **NOT** `main`. This ensures your changes are reviewed and tested on the development branch before being merged to production.

### 6. Merge Into Dev

Once your feature is complete and reviewed, merge it into the `dev` branch:

```bash
git checkout dev
git merge <your-branch-name>
```

Alternatively, you can merge through the pull request interface on GitHub.

## Testing Features in Staging

Our `staging` branch is used for live deployment testing. Here's how to test your feature branches before merging to `dev`:

### Testing Your Feature Branch in Staging

1. **Push your feature branch to the staging branch:**
   ```bash
   git checkout staging
   git merge <your-feature-branch>
   git push origin staging
   ```

2. **Test your changes on the live server:**
   - Visit `<http://leandrovivares.com/>` to see your changes deployed
   - The deployment happens automatically via GitHub Actions

3. **Once testing is complete, reset staging:**
   ```bash
   git checkout staging
   git reset --hard origin/dev
   git push origin staging --force
   ```

### ⚠️ CRITICAL STAGING RULES

**NEVER do the following with the staging branch:**
- ❌ NEVER merge `staging` into `dev`
- ❌ NEVER merge `staging` into `main`
- ❌ NEVER open a Pull Request FROM `staging`
- ❌ NEVER keep experimental code in `staging` permanently

**Why?** The `staging` branch is a temporary testing environment. It should mirror `dev` when not actively testing features.

### Staging Workflow Best Practices

1. `staging` should normally mirror `dev`
2. Only merge feature branches into `staging` temporarily for testing
3. Always reset `staging` back to `dev` after testing
4. > ⚠️ **Only merge tested features from YOUR feature branch into `dev`, not from `staging`**

## Using VS Code Git Control

VS Code has built-in git tools that make version control easier without using the terminal:

### Accessing Git Control

1. Click the **Source Control** icon in the left sidebar (it looks like a branch)
2. Or use the keyboard shortcut: `Ctrl+Shift+G` (Windows/Linux) or `Cmd+Shift+G` (Mac)

### Basic Operations

**Staging Changes:**
- View all modified files in the "Changes" section
- Click the `+` icon next to a file to stage it for commit
- Or click the `+` icon in the "Changes" header to stage all files

**Committing Changes:**
- Enter a commit message in the text field at the top of the Source Control panel
- Click the checkmark icon to commit, or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)

**Viewing History:**
- Right-click a file in the Source Control panel and select "Open Timeline" to see commit history
- Or use the `Gitlens` extension for more advanced history viewing

### Creating a Branch in VS Code

1. Click the branch name at the bottom left
2. Select "Create New Branch..."
3. Enter your branch name following the convention: `front-end/<feature>` or `api/<feature>`
4. Select `dev` as the base branch when prompted

---
