# Deployment Guide for SaludValpa Application

## Overview

This guide provides comprehensive instructions for deploying the SaludValpa application to Vercel with automated CI/CD using GitHub Actions. The SaludValpa application is a professional healthcare management platform for multiple medical specialties.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Vercel Project Configuration](#vercel-project-configuration)
4. [GitHub Actions Setup](#github-actions-setup)
5. [Environment Variables](#environment-variables)
6. [Domain Configuration](#domain-configuration)
7. [Manual Deployment](#manual-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

### Required Accounts
- **GitHub Account**: For repository hosting and GitHub Actions
- **Vercel Account**: For application hosting and deployment
- **Domain Registrar Account**: For custom domain configuration (valpa.app, www.valpa.app)

### Required Tools
- **Node.js 18+**: For local development and build processes
- **Git**: For version control
- **Vercel CLI** (optional): For manual deployments and project linking

### Technical Knowledge
- Basic understanding of Git and GitHub
- Familiarity with environment variables
- Understanding of CI/CD concepts

## Repository Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-organization/saludvalpa-app.git
cd saludvalpa-app
```

### 2. Verify Project Structure
Ensure the following key files exist:
- `package.json` - Project dependencies and scripts
- `vercel.json` - Vercel configuration
- `.github/workflows/vercel-deploy.yml` - GitHub Actions workflow
- `.vercel/project.json` - Vercel project metadata
- `scripts/verify-deployment.sh` - Deployment verification script

### 3. Install Dependencies
```bash
npm install
```

### 4. Build Locally (Optional)
```bash
npm run build
```

## Vercel Project Configuration

### 1. Create Vercel Project
If not already created, create a new Vercel project:

**Option A: Using Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import from GitHub repository
4. Select the `saludvalpa-app` repository
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
cd saludvalpa-app
vercel link

# Deploy
vercel --prod
```

### 2. Obtain Vercel Credentials
After project creation, obtain the following credentials:

1. **Vercel Token**:
   - Go to Vercel Dashboard → Settings → Tokens
   - Click "Create Token"
   - Name: "GitHub Actions - SaludValpa"
   - Scope: Select all permissions
   - Copy the generated token

2. **Organization ID and Project ID**:
   - Check `.vercel/project.json` file:
   ```json
   {
     "projectId": "prj_zgXKB7Y2W6iUqf251gJEEtrHisJC",
     "orgId": "team_rCiDJuo2AYHX8ykqsvU3JtfU",
     "projectName": "saludvalpa-app"
   }
   ```
   - Or find in Vercel Dashboard → Project Settings → General

## GitHub Actions Setup

### 1. Configure GitHub Secrets
Add the following secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VERCEL_TOKEN` | Your Vercel token | Authentication token for Vercel API |
| `VERCEL_ORG_ID` | `team_rCiDJuo2AYHX8ykqsvU3JtfU` | Vercel organization ID |
| `VERCEL_PROJECT_ID_SALUDVALPA` | `prj_zgXKB7Y2W6iUqf251gJEEtrHisJC` | Vercel project ID for SaludValpa |

### 2. Verify Workflow Configuration
The GitHub Actions workflow is configured in `.github/workflows/vercel-deploy.yml`. Key features:

- **Automatic production deployments** on push to `main` branch
- **Preview deployments** for every pull request
- **Build validation** with TypeScript checking and ESLint
- **Deployment verification** with automated health checks

### 3. Test the Workflow
1. Push a change to the `main` branch
2. Go to GitHub repository → Actions tab
3. Verify the workflow runs successfully
4. Check Vercel dashboard for deployment status

## Environment Variables

### Required Environment Variables
Create a `.env.local` file for local development or set in Vercel project settings:

```env
# Application Configuration
VITE_APP_NAME=SaludValpa
VITE_APP_VERSION=3.0.0
VITE_API_BASE_URL=https://api.saludvalpa.com

# Feature Flags
VITE_ENABLE_EXPERIMENTAL_FEATURES=false
VITE_ENABLE_BETA_FEATURES=false

# Security
VITE_ENABLE_STRICT_MODE=true
VITE_ENABLE_CSP=true
```

### Setting Environment Variables in Vercel
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable with the exact name
3. For production, mark as "Production"
4. For preview deployments, mark as "Preview" as needed

## Domain Configuration

### 1. Configure Custom Domains
The application is configured to use the following domains:
- `valpa.app` (primary domain)
- `www.valpa.app` (redirect to primary)

### 2. Domain Setup in Vercel
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add domain `valpa.app`
3. Add domain `www.valpa.app`
4. Follow DNS configuration instructions

### 3. DNS Configuration
Configure DNS records with your domain registrar:

**For valpa.app:**
```
Type    Name    Value
A       @       76.76.21.21
AAAA    @       2606:4700:3030::6815:5b19
```

**For www.valpa.app (redirect):**
```
Type    Name    Value
CNAME   www     cname.vercel-dns.com
```

### 4. SSL/TLS Certificate
Vercel automatically provisions SSL certificates for all domains. Certificate renewal is automatic.

## Manual Deployment

### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

### Option 2: Using npm Scripts
```bash
# Build locally
npm run build

# Deploy using Vercel CLI (if configured)
npm run deploy
```

### Option 3: Direct from GitHub
1. Push changes to `main` branch
2. GitHub Actions will automatically deploy
3. Monitor deployment in GitHub Actions tab

## Automated Deployment Workflow

### Production Deployment Flow
```
Push to main branch
    ↓
GitHub Actions triggers
    ↓
Build and Test Job
    ├── TypeScript type checking
    ├── ESLint validation
    ├── Build application
    └── Run tests (if available)
    ↓
Deploy Production Job
    ├── Deploy to Vercel production
    ├── Configure domain aliases
    └── Generate deployment URL
    ↓
Verify Production Job
    ├── HTTP status verification
    ├── Content validation
    ├── Critical route checks
    └── PWA functionality verification
    ↓
Deployment Complete
```

### Preview Deployment Flow
```
Create/Update Pull Request
    ↓
GitHub Actions triggers
    ↓
Build and Test Job (same as above)
    ↓
Deploy Preview Job
    ├── Create preview deployment
    ├── Generate unique preview URL
    └── Post comment on PR
    ↓
Verify Preview Job
    ├── Basic health checks
    └── Report status
    ↓
Ready for Review
```

## Deployment Verification

### Automated Verification
The deployment includes automated verification via `scripts/verify-deployment.sh`:

```bash
# Run verification manually
./scripts/verify-deployment.sh --url https://saludvalpa-app.vercel.app

# With exit on failure
./scripts/verify-deployment.sh --url https://saludvalpa-app.vercel.app --exit-on-failure
```

### Manual Verification Checklist
After deployment, verify:

1. **Homepage Loads**: Visit `https://valpa.app`
2. **Critical Routes**:
   - `/dashboard` - Dashboard page
   - `/pacientes` - Patient management
   - `/agenda` - Appointment scheduling
   - `/configuracion` - Settings page
   - `/activar-licencia` - License activation
3. **PWA Features**:
   - Manifest loads: `https://valpa.app/manifest.webmanifest`
   - Service worker: `https://valpa.app/sw.js`
4. **Console Errors**: Check browser console for JavaScript errors
5. **Responsive Design**: Test on mobile and desktop

## Troubleshooting

### Common Issues

#### 1. Build Failures
**Symptoms**: GitHub Actions workflow fails during build step
**Solutions**:
- Check TypeScript errors locally: `npx tsc --noEmit`
- Verify dependencies: `npm ci`
- Check Node.js version compatibility

#### 2. Deployment Failures
**Symptoms**: Vercel deployment fails
**Solutions**:
- Check Vercel project limits (free tier limitations)
- Verify environment variables are set
- Check build output directory configuration

#### 3. Domain Issues
**Symptoms**: Custom domain not working
**Solutions**:
- Verify DNS propagation (can take up to 48 hours)
- Check domain configuration in Vercel dashboard
- Ensure SSL certificate is provisioned

#### 4. GitHub Actions Secrets
**Symptoms**: Workflow fails with authentication errors
**Solutions**:
- Verify all required secrets are set
- Check secret names match workflow file
- Regenerate Vercel token if expired

### Debugging Commands
```bash
# Check build locally
npm run build

# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Test deployment verification
./scripts/verify-deployment.sh --url http://localhost:5173 --verbose
```

## Monitoring and Maintenance

### 1. Performance Monitoring
- **Vercel Analytics**: Monitor performance metrics in Vercel dashboard
- **Google Analytics**: Integrated for user behavior tracking
- **Error Tracking**: Configure error monitoring service

### 2. Regular Maintenance Tasks
- **Dependency Updates**: Regularly update npm dependencies
- **Security Patches**: Monitor for security vulnerabilities
- **Backup Verification**: Ensure data backup systems are working

### 3. Scaling Considerations
- **Traffic Spikes**: Vercel automatically scales with traffic
- **Database Considerations**: Monitor database performance
- **CDN Optimization**: Leverage Vercel's global CDN

## Security Best Practices

### 1. Secret Management
- Never commit secrets to version control
- Use GitHub Secrets for CI/CD
- Rotate tokens regularly

### 2. Application Security
- Enable Content Security Policy (CSP)
- Implement proper CORS configuration
- Use HTTPS for all connections

### 3. Access Control
- Limit Vercel project access to authorized team members
- Use GitHub branch protection rules
- Implement code review processes

## Rollback Procedures

### 1. Automatic Rollback
Vercel provides automatic rollback on deployment failure. Previous deployments remain available.

### 2. Manual Rollback
1. Go to Vercel Dashboard → Project → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### 3. Emergency Procedures
If critical issues occur:
1. Immediately rollback to previous version
2. Disable problematic features via environment variables
3. Notify users if necessary

## Support and Resources

### Documentation
- **This Guide**: Complete deployment reference
- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Actions Documentation**: https://docs.github.com/en/actions

### Contact Information
- **Development Team**: [Team Contact Information]
- **Vercel Support**: https://vercel.com/support
- **GitHub Support**: https://support.github.com

### Emergency Contacts
- **Primary Contact**: [Name] - [Phone/Email]
- **Backup Contact**: [Name] - [Phone/Email]
- **Infrastructure Lead**: [Name] - [Phone/Email]

---

## Appendix

### A. File Reference
- `.github/workflows/vercel-deploy.yml` - Main deployment workflow
- `vercel.json` - Vercel configuration
- `.vercel/project.json` - Project metadata
- `scripts/verify-deployment.sh` - Verification script
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist

### B. Changelog
- **2026-02-27**: Initial deployment guide created
- **2026-02-27**: Updated for SaludValpa migration
- **2026-02-27**: Added domain configuration details

### C. Glossary
- **CI/CD**: Continuous Integration/Continuous Deployment
- **PWA**: Progressive Web Application
- **CDN**: Content Delivery Network
- **DNS**: Domain Name System
- **SSL/TLS**: Secure Sockets Layer/Transport Layer Security

---

*Last Updated: 2026-02-27*  
*Document Version: 1.0*  
*Maintained by: SaludValpa Development Team*