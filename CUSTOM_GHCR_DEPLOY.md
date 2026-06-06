# Custom New API Frontend Deployment

This setup avoids building on the small server.

1. Push this source tree to your own GitHub repository.
2. In GitHub, open Actions -> Build custom New API image -> Run workflow.
3. After the workflow finishes, copy the image tag from the summary, for example:

```text
ghcr.io/YOUR_GITHUB_NAME/new-api:custom-latest
```

4. On the server, deploy it with:

```bash
/opt/new-api/deploy-ghcr-image.sh ghcr.io/YOUR_GITHUB_NAME/new-api:custom-latest
```

The deployment keeps using the existing SQLite database and logs:

- `/opt/new-api/data:/data`
- `/opt/new-api/logs:/app/logs`

Rollback to the upstream image:

```bash
/opt/new-api/deploy-ghcr-image.sh calciumion/new-api:latest
```

If the GHCR package is private, run `docker login ghcr.io` on the server first with a GitHub Personal Access Token that can read packages.
