# Cloud Run

## Deploy from Source

```bash
gcloud run deploy SERVICE_NAME \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

## Deploy from Container

### Build and Push

```bash
# Build with Cloud Build
gcloud builds submit --tag gcr.io/PROJECT_ID/SERVICE_NAME

# Or use Artifact Registry
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_ID/REPO/SERVICE_NAME
```

### Deploy

```bash
gcloud run deploy SERVICE_NAME \
  --image gcr.io/PROJECT_ID/SERVICE_NAME \
  --region us-central1 \
  --allow-unauthenticated
```

## Configuration

### Environment Variables

```bash
gcloud run deploy SERVICE_NAME \
  --set-env-vars "DATABASE_URL=xxx,API_KEY=yyy"
```

### Secrets

```bash
# Create secret
echo -n "secret-value" | gcloud secrets create MY_SECRET --data-file=-

# Use in Cloud Run
gcloud run deploy SERVICE_NAME \
  --set-secrets "MY_SECRET=MY_SECRET:latest"
```

### Memory and CPU

```bash
gcloud run deploy SERVICE_NAME \
  --memory 512Mi \
  --cpu 1
```

### Concurrency

```bash
gcloud run deploy SERVICE_NAME \
  --concurrency 80 \
  --max-instances 10 \
  --min-instances 1
```

## Manage Services

```bash
# List services
gcloud run services list

# Describe service
gcloud run services describe SERVICE_NAME

# View logs
gcloud logs read --service SERVICE_NAME

# Delete service
gcloud run services delete SERVICE_NAME
```

## Traffic Management

```bash
# Route traffic to revision
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions REVISION_NAME=100

# Split traffic
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions REVISION_A=50,REVISION_B=50
```

## Custom Domain

```bash
# Map domain
gcloud run domain-mappings create \
  --service SERVICE_NAME \
  --domain example.com \
  --region us-central1
```

## CI/CD with Cloud Build

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/my-service', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/my-service']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'my-service'
      - '--image=gcr.io/$PROJECT_ID/my-service'
      - '--region=us-central1'
```
