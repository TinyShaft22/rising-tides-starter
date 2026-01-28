# CLI Setup

## Installation

### macOS

```bash
brew install google-cloud-sdk
```

### Windows

Download installer from: https://cloud.google.com/sdk/docs/install

### Linux

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

## Initialize

```bash
gcloud init
```

Follow prompts to:
1. Login to Google account
2. Select or create project
3. Set default region/zone

## Authentication

```bash
# Login
gcloud auth login

# Application default credentials
gcloud auth application-default login

# List accounts
gcloud auth list

# Switch account
gcloud config set account email@example.com
```

## Project Configuration

```bash
# List projects
gcloud projects list

# Set current project
gcloud config set project PROJECT_ID

# View current config
gcloud config list
```

## Enable APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## Regions and Zones

```bash
# Set default region
gcloud config set compute/region us-central1

# Set default zone
gcloud config set compute/zone us-central1-a

# List regions
gcloud compute regions list
```

## Useful Commands

```bash
# Current project
gcloud config get-value project

# View logs
gcloud logs read

# SSH to VM
gcloud compute ssh INSTANCE_NAME

# Copy files
gcloud compute scp local-file INSTANCE:remote-path
```
