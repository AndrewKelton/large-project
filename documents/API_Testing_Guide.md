# API Testing Guide

This document outlines the standard process for deploying and testing API endpoint changes on the staging server. Please follow these steps **exactly** and in order.

---

## Prerequisites

- Git installed and configured on your local machine
- Access to the repository with your branch already created (e.g., `api/<your-branch>`)
- [Postman](https://www.postman.com/downloads/) installed on your local machine

---

## Step 1: Push Your Changes

On your **local machine**, make sure all of your changes are committed and pushed to your branch:

```bash
git checkout api/<your-branch-here>

# Stage and commit your changes
git add .
git commit -m "describe your changes here"

# Push to remote
git push
```

> ⚠️ Replace `<your-branch-here>` with the actual name of your API branch (e.g., `api/login`, `api/courses`).

---

## Step 2: Merge Into Staging

Once your changes are pushed, merge your branch into `staging`:

```bash
git checkout staging
git merge api/<your-branch-here>
git push
```

After pushing to `staging`, **wait approximately 30 seconds** for the CI/CD pipeline to automatically deploy your changes to the server.

---

## Step 3: Test Your Endpoint in Postman

1. Open **Postman**.
2. Set the request method (e.g., `GET`, `POST`, `PUT`, `DELETE`) appropriate to your endpoint.
3. Enter the full URL using the base address below:

```
http://leandrovivares.com/api/<your-endpoint-here>
```

> **Example:** `http://leandrovivares.com/api/login` or `http://leandrovivares.com/api/courses`

4. Add any required headers or request body (e.g., JSON payload for `POST` requests).
5. Send the request and verify the response.

---

## Step 4: Screenshot and Document Results

- Take a **screenshot** of both the **request** (URL, method, headers, body) and the **response** (status code, response body) in Postman.
- Save these screenshots for submission or review.

---

## ⛔ Important: Do NOT SSH Into the Server

**Do not SSH into the server and make manual changes.** The deployment pipeline automatically handles setup and configuration. Making manual changes on the server will cause undefined behavior and may break the deployment for the entire team.

All changes must go through the Git workflow described above.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Commit and push changes to `api/<your-branch>` |
| 2 | Merge `api/<your-branch>` into `staging` and push |
| 3 | Wait ~30 seconds for auto-deployment |
| 4 | Test endpoint in Postman at `http://leandrovivares.com/api/<endpoint>` |
| 5 | Screenshot request and response for documentation |
