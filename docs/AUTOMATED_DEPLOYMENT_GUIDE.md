# Automated Deployment Guide for SaludValpa App

## Overview

This document describes the automated CI/CD pipeline for SaludValpa application using GitHub Actions and Vercel. The system provides:

1. **Automatic production deployments** when code is pushed to the `main` branch
2. **Preview deployments** for every pull request
3. **TypeScript validation and linting** before deployment
4. **Build verification** to ensure code quality

## Architecture

```
GitHub Repository → GitHub Actions → Vercel Deployment
       │                    │
       ├─ Push to main ────┼──→ Production Deployment
       │                    │
       └─ Pull Request ────┼──→ Preview Deployment
```

## GitHub Actions Workflow

### File Location
- `.github/workflows/vercel-deploy.yml`

### Workflow Triggers
- **Push to main/master**: Triggers production deployment
- **Pull request to main/master**: Triggers preview deployment

### Jobs

#### 1. Build and Test Job
- Runs on: `ubuntu-latest`
- Steps:
  1. Checkout repository
  2. Setup Node.js 18
  3. Install dependencies with `npm ci`
  4. TypeScript type check
  5. ESLint code validation
  6. Build application with `npm run build`
  7. Run tests (if available)

#### 2. Deploy Preview Job
- Runs when: Pull request is opened
- Uses: `amondnet/vercel-action@v25`
- Creates: Preview deployment with unique URL
- Comments: Preview URL on the pull request

#### 3. Deploy Production Job
- Runs when: Push to main/master branch
- Uses: `amondnet/vercel-action@v25`
- Deploys: To production environment
- Aliases: `saludvalpa-app.vercel.app`

## Required Secrets

The following secrets must be configured in GitHub repository settings:

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `VERCEL_TOKEN` | Vercel authentication token | From Vercel dashboard: Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel organization ID | From `.vercel/project.json` or Vercel dashboard |
| `VERCEL_PROJECT_ID` | Vercel project ID | From `.vercel/project.json` or Vercel dashboard |

### Setting Up Secrets

1. **Generate Vercel Token**:
   ```bash
   # Login to Vercel CLI
   vercel login
   # Get token from Vercel dashboard
   # Settings → Tokens → Create Token
   ```

2. **Find Organization and Project IDs**:
   ```bash
   cd saludvalpa-app
   vercel link  # If not already linked
   # Check .vercel/project.json
   cat .vercel/project.json
   ```

3. **Add Secrets to GitHub**:
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add each secret with the exact names above

## Environment Variables

### Build-Time Environment Variables
The following environment variables are used during build:

```yaml
env:
  NODE_VERSION: 18
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Application Environment Variables
For application-specific environment variables, create a `.env.example` file and configure them in Vercel:

1. **Create `.env.example`**:
   ```
   VITE_APP_TITLE=SaludValpa App
   VITE_API_URL=https://api.example.com
   VITE_ENABLE_ANALYTICS=false
   ```

2. **Add to Vercel**:
   - Vercel dashboard → Project → Settings → Environment Variables
   - Add each variable for both Preview and Production environments

## TypeScript Configuration

### Current Configuration
- TypeScript version: 5.9.3
- Strict mode: Enabled
- Type checking: Runs before deployment
- Note: html2canvas v1.4.1 includes bundled TypeScript definitions - @types/html2canvas is deprecated and not required

### Type Definitions
```json
"@types/jspdf": "^2.5.4"
```

**Important**: html2canvas v1.4.1+ provides its own TypeScript definitions. The `@types/html2canvas` package is deprecated and should not be installed.

### Build Optimization
To improve build performance and fix warnings:

1. **Disable unused variable checks** (optional):
   ```json
   // tsconfig.app.json
   {
     "compilerOptions": {
       "noUnusedLocals": false,
       "noUnusedParameters": false
     }
   }
   ```

2. **Code splitting recommendations**:
   - Use dynamic imports for large components
   - Configure manual chunks in `vite.config.ts`

## Deployment Verification

### Automatic Verification Steps
1. **TypeScript compilation**: Ensures no type errors
2. **ESLint validation**: Enforces code style
3. **Build success**: Confirms application can be built
4. **Test execution**: Runs any available tests

### Manual Verification Checklist
After deployment, verify:

- [ ] Production site loads at `https://saludvalpa-app.vercel.app`
- [ ] All routes work correctly
- [ ] PWA installation works
- [ ] PDF generation functions
- [ ] License system operates correctly
- [ ] Database operations work

## Preview Deployments

### Features
- **Automatic**: Created for every pull request
- **Isolated**: Each PR gets its own deployment
- **Comment integration**: URL posted as PR comment
- **Cleanup**: Automatically removed when PR is closed

### Accessing Preview Deployments
1. Open a pull request
2. Wait for GitHub Actions to complete
3. Check the PR comments for the preview URL
4. Test the changes in isolation

## Troubleshooting

### Common Issues

#### 1. Build Fails Due to TypeScript Errors
**Solution**: Fix TypeScript errors or adjust `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

#### 2. Missing Vercel Secrets
**Error**: `VERCEL_TOKEN not found`
**Solution**: Add secrets to GitHub repository settings

#### 3. Large Bundle Size Warnings
**Warning**: "Some chunks are larger than 500 kB"
**Solution**: Implement code splitting:
```typescript
// Use dynamic imports
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

#### 4. Preview Deployments Not Working
**Check**:
- GitHub token permissions
- Vercel project linking
- Branch protection rules

### Debugging Workflow
1. Check GitHub Actions logs
2. Verify secret values are correct
3. Test locally with same Node.js version
4. Check Vercel deployment logs

## Monitoring and Alerts

### GitHub Actions Notifications
Configure notifications in repository settings:
- Success/failure notifications
- Slack/email integration

### Vercel Monitoring
- Deployment status in Vercel dashboard
- Performance metrics
- Error tracking

## Rollback Procedure

### Automatic Rollback
Vercel provides automatic rollback on failed deployments.

### Manual Rollback
1. **Via Vercel Dashboard**:
   - Go to project → Deployments
   - Find previous successful deployment
   - Click "Promote to Production"

2. **Via CLI**:
   ```bash
   cd saludvalpa-app
   vercel rollback <deployment-id>
   ```

## Performance Optimization

### Build Optimization
1. **Cache dependencies**:
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
       cache-dependency-path: saludvalpa-app/package-lock.json
   ```

2. **Parallel jobs**: Build and test run in parallel

### Bundle Optimization
1. **Code splitting**: Implement dynamic imports
2. **Tree shaking**: Ensure unused code is removed
3. **Compression**: Gzip compression enabled

## Security Considerations

### Secret Management
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Rotate Vercel tokens periodically

### Build Environment
- Use official GitHub Actions
- Pin action versions to specific tags
- Regular dependency updates

## Maintenance

### Regular Tasks
1. **Update dependencies**: Monthly security updates
2. **Review workflow logs**: Weekly review
3. **Rotate secrets**: Quarterly token rotation
4. **Update documentation**: As changes are made

### Version Updates
When updating Node.js or dependencies:
1. Update `NODE_VERSION` in workflow
2. Update `package.json` dependencies
3. Test locally before committing
4. Monitor deployment for issues

## Support

### Resources
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Contact
- **Repository**: GitHub repository issues
- **Deployment**: Vercel dashboard support
- **Development**: Team communication channels

---

*Last Updated: $(date +%Y-%m-%d)*
*Document Version: 1.0*