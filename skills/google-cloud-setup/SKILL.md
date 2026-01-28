---
name: google-cloud-setup
description: "Google Cloud using gcloud CLI. Cloud Run, Firebase Hosting, Cloud Functions. Use when deploying to GCP or configuring Google Cloud services. Triggers on: 'gcloud', 'google cloud', 'cloud run', 'GCP', 'google cloud functions'."
---

# Google Cloud Setup

Deploy and manage applications using the gcloud CLI.

## Prerequisites

### Install gcloud CLI

```bash
# macOS
brew install google-cloud-sdk

# Windows (installer)
# Download from: https://cloud.google.com/sdk/docs/install

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Initialize

```bash
gcloud init
# Follow prompts to:
# - Login to Google account
# - Select or create project
# - Set default region
```

### Verify Setup

```bash
gcloud config list
gcloud auth list
```

---

## Quick Reference

| Task | Command |
|------|---------|
| List projects | `gcloud projects list` |
| Set project | `gcloud config set project PROJECT_ID` |
| Deploy Cloud Run | `gcloud run deploy` |
| Deploy function | `gcloud functions deploy` |
| View logs | `gcloud logs read` |

---

## Cloud Run

### Deploy from Source

```bash
gcloud run deploy my-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy from Container

```bash
# Build and push to Artifact Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/my-service

# Deploy
gcloud run deploy my-service \
  --image gcr.io/PROJECT_ID/my-service \
  --region us-central1 \
  --allow-unauthenticated
```

### Set Environment Variables

```bash
gcloud run deploy my-service \
  --set-env-vars "DATABASE_URL=xxx,API_KEY=yyy"
```

### Update Service

```bash
gcloud run services update my-service \
  --set-env-vars "NEW_VAR=value"
```

### View Services

```bash
gcloud run services list
gcloud run services describe my-service
```

---

## Cloud Functions

### Deploy HTTP Function

```bash
gcloud functions deploy my-function \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point handler
```

### Example Function

```javascript
// index.js
exports.handler = (req, res) => {
  res.json({ message: 'Hello from Cloud Functions!' });
};
```

### Deploy Event-Triggered Function

```bash
gcloud functions deploy process-upload \
  --gen2 \
  --runtime nodejs20 \
  --trigger-bucket my-bucket \
  --entry-point processFile
```

### View Functions

```bash
gcloud functions list
gcloud functions describe my-function
gcloud functions logs read my-function
```

---

## Cloud Storage

### Create Bucket

```bash
gcloud storage buckets create gs://my-bucket --location=us-central1
```

### Upload Files

```bash
gcloud storage cp file.txt gs://my-bucket/
gcloud storage cp -r ./folder gs://my-bucket/
```

### Download Files

```bash
gcloud storage cp gs://my-bucket/file.txt .
```

### List Files

```bash
gcloud storage ls gs://my-bucket/
```

---

## Secret Manager

### Create Secret

```bash
echo -n "my-secret-value" | gcloud secrets create my-secret --data-file=-
```

### Access Secret

```bash
gcloud secrets versions access latest --secret=my-secret
```

### Use in Cloud Run

```bash
gcloud run deploy my-service \
  --set-secrets "API_KEY=my-secret:latest"
```

---

## IAM

### View Permissions

```bash
gcloud projects get-iam-policy PROJECT_ID
```

### Add Role

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:email@example.com" \
  --role="roles/viewer"
```

### Service Accounts

```bash
# Create
gcloud iam service-accounts create my-sa

# List
gcloud iam service-accounts list

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=my-sa@PROJECT_ID.iam.gserviceaccount.com
```

---

## Logs

### View Logs

```bash
# All logs
gcloud logs read

# Specific service
gcloud logs read --service=my-service

# Follow logs
gcloud logs tail

# Filter
gcloud logs read "severity>=ERROR"
```

---

## Project Configuration

### Create Project

```bash
gcloud projects create my-project-id --name="My Project"
```

### Set Default Project

```bash
gcloud config set project my-project-id
```

### Enable APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

---

## Reference Files

- `references/cli-setup.md` — Install gcloud, authenticate
- `references/cloud-run.md` — Deploy containers
- `references/firebase-hosting.md` — Static hosting
- `references/cloud-functions.md` — Serverless functions

---

## When to Use

- Deploying containerized applications
- Need serverless functions (Gen2)
- Want global CDN with Cloud CDN
- Building on Google infrastructure
- Need to integrate with other GCP services
