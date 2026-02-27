# Deployment Checklist for SaludValpa Application

## Overview
This checklist provides a step-by-step guide for deploying the SaludValpa application. Use this checklist to ensure all deployment steps are completed correctly.

## Legend
- ✅ **Completed**: Step has been successfully completed
- 🔄 **In Progress**: Step is currently being worked on
- ⏳ **Pending**: Step has not been started
- ❌ **Blocked**: Step cannot proceed due to dependencies

---

## Phase 1: Pre-Deployment Preparation

### 1.1 Repository Setup
- [ ] **Clone repository**
  ```bash
  git clone https://github.com/your-organization/saludvalpa-app.git
  cd saludvalpa-app
  ```
- [ ] **Verify project structure**
  - [ ] `package.json` exists
  - [ ] `vercel.json` exists
  - [ ] `.github/workflows/vercel-deploy.yml` exists
  - [ ] `.vercel/project.json` exists
  - [ ] `scripts/verify-deployment.sh` exists
- [ ] **Install dependencies**
  ```bash
  npm install
  ```
- [ ] **Build locally (optional verification)**
  ```bash
  npm run build
  ```

### 1.2 Account Verification
- [ ] **GitHub account** has access to repository
- [ ] **Vercel account** is active and accessible
- [ ] **Domain registrar account** has access to valpa.app

### 1.3 Environment Verification
- [ ] **Node.js 18+** is installed
  ```bash
  node --version
  ```
- [ ] **Git** is installed and configured
  ```bash
  git --version
  ```
- [ ] **Vercel CLI** is installed (optional)
  ```bash
  vercel --version
  ```

---

## Phase 2: Vercel Project Configuration

### 2.1 Project Creation
- [ ] **Create Vercel project** (if not exists)
  - [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
  - [ ] Click "Add New" → "Project"
  - [ ] Import from GitHub repository
  - [ ] Select `saludvalpa-app` repository
  - [ ] Configure project settings:
    - Framework Preset: **Vite**
    - Build Command: `npm run build`
    - Output Directory: `dist`
    - Install Command: `npm install`
  - [ ] Click "Deploy"

### 2.2 Obtain Credentials
- [ ] **Generate Vercel Token**
  - [ ] Go to Vercel Dashboard → Settings → Tokens
  - [ ] Click "Create Token"
  - [ ] Name: "GitHub Actions - SaludValpa"
  - [ ] Scope: Select all permissions
  - [ ] Copy the generated token
- [ ] **Find Organization and Project IDs**
  - [ ] Check `.vercel/project.json` file:
    ```json
    {
      "projectId": "prj_zgXKB7Y2W6iUqf251gJEEtrHisJC",
      "orgId": "team_rCiDJuo2AYHX8ykqsvU3JtfU",
      "projectName": "saludvalpa-app"
    }
    ```
  - [ ] Or find in Vercel Dashboard → Project Settings → General

---

## Phase 3: GitHub Actions Setup

### 3.1 Configure GitHub Secrets
- [ ] **Navigate to GitHub repository settings**
  - [ ] Go to repository → Settings → Secrets and variables → Actions
  - [ ] Click "New repository secret"

- [ ] **Add required secrets:**

| Secret Name | Value to Add | Status |
|-------------|--------------|--------|
| `VERCEL_TOKEN` | [Your Vercel token] | [ ] |
| `VERCEL_ORG_ID` | `team_rCiDJuo2AYHX8ykqsvU3JtfU` | [ ] |
| `VERCEL_PROJECT_ID_SALUDVALPA` | `prj_zgXKB7Y2W6iUqf251gJEEtrHisJC` | [ ] |

### 3.2 Verify Workflow Configuration
- [ ] **Review workflow file**: `.github/workflows/vercel-deploy.yml`
- [ ] **Verify triggers**:
  - [ ] Push to `main` branch triggers production deployment
  - [ ] Pull requests trigger preview deployments
- [ ] **Verify jobs**:
  - [ ] Build and Test job exists
  - [ ] Deploy Preview job exists
  - [ ] Deploy Production job exists
  - [ ] Verify jobs exist

### 3.3 Test Workflow
- [ ] **Make a test commit**
  ```bash
  git add .
  git commit -m "Test: Trigger deployment workflow"
  git push origin main
  ```
- [ ] **Monitor GitHub Actions**
  - [ ] Go to GitHub repository → Actions tab
  - [ ] Verify workflow runs successfully
  - [ ] Check each job completes without errors
- [ ] **Verify Vercel deployment**
  - [ ] Go to Vercel Dashboard → Project → Deployments
  - [ ] Verify new deployment appears
  - [ ] Check deployment status is "Ready"

---

## Phase 4: Environment Variables Configuration

### 4.1 Set Application Environment Variables
- [ ] **Navigate to Vercel environment variables**
  - [ ] Go to Vercel Dashboard → Project → Settings → Environment Variables
  - [ ] Click "Add New"

- [ ] **Add required variables:**

| Variable Name | Value | Environment | Status |
|---------------|-------|-------------|--------|
| `VITE_APP_NAME` | `SaludValpa` | Production | [ ] |
| `VITE_APP_VERSION` | `3.0.0` | Production | [ ] |
| `VITE_API_BASE_URL` | `https://api.saludvalpa.com` | Production | [ ] |
| `VITE_ENABLE_EXPERIMENTAL_FEATURES` | `false` | Production | [ ] |
| `VITE_ENABLE_BETA_FEATURES` | `false` | Production | [ ] |
| `VITE_ENABLE_STRICT_MODE` | `true` | Production | [ ] |
| `VITE_ENABLE_CSP` | `true` | Production | [ ] |

### 4.2 Verify Variable Propagation
- [ ] **Trigger new deployment** to apply variables
- [ ] **Verify variables in build logs**
- [ ] **Test application functionality** that depends on environment variables

---

## Phase 5: Domain Configuration

### 5.1 Add Domains to Vercel
- [ ] **Navigate to domain settings**
  - [ ] Go to Vercel Dashboard → Project → Settings → Domains
  - [ ] Click "Add Domain"

- [ ] **Add primary domain**
  - [ ] Domain: `valpa.app`
  - [ ] Click "Add"
  - [ ] Follow DNS configuration instructions

- [ ] **Add www subdomain**
  - [ ] Domain: `www.valpa.app`
  - [ ] Click "Add"
  - [ ] Configure as redirect to primary domain

### 5.2 Configure DNS Records
- [ ] **Configure DNS with domain registrar**

**For valpa.app:**
```
Type    Name    Value                    Status
A       @       76.76.21.21              [ ]
AAAA    @       2606:4700:3030::6815:5b19 [ ]
```

**For www.valpa.app (redirect):**
```
Type    Name    Value                    Status
CNAME   www     cname.vercel-dns.com     [ ]
```

### 5.3 Verify Domain Configuration
- [ ] **Wait for DNS propagation** (up to 48 hours)
- [ ] **Check domain status** in Vercel dashboard
- [ ] **Test domain accessibility**
  - [ ] `https://valpa.app` loads correctly
  - [ ] `https://www.valpa.app` redirects to `valpa.app`
- [ ] **Verify SSL certificate**
  - [ ] SSL certificate is automatically provisioned
  - [ ] HTTPS works without warnings

---

## Phase 6: Deployment Verification

### 6.1 Automated Verification
- [ ] **Run verification script**
  ```bash
  ./scripts/verify-deployment.sh --url https://saludvalpa-app.vercel.app --exit-on-failure
  ```
- [ ] **Check verification results**
  - [ ] HTTP status: 200 OK
  - [ ] Page content contains "SaludValpa"
  - [ ] JavaScript loads correctly
  - [ ] PWA manifest accessible
  - [ ] Service worker registered
  - [ ] Critical routes accessible
  - [ ] Build artifacts present

### 6.2 Manual Verification
- [ ] **Homepage verification**
  - [ ] Visit `https://valpa.app`
  - [ ] Page loads without errors
  - [ ] All visual elements display correctly
  - [ ] No console errors in browser

- [ ] **Critical route testing**
  - [ ] `/dashboard` - Dashboard page
  - [ ] `/pacientes` - Patient management
  - [ ] `/agenda` - Appointment scheduling
  - [ ] `/configuracion` - Settings page
  - [ ] `/activar-licencia` - License activation

- [ ] **PWA functionality**
  - [ ] Manifest loads: `https://valpa.app/manifest.webmanifest`
  - [ ] Service worker: `https://valpa.app/sw.js`
  - [ ] Installable as PWA (if supported)

- [ ] **Responsive design**
  - [ ] Test on desktop browser
  - [ ] Test on mobile device
  - [ ] Test on tablet device

- [ ] **Performance check**
  - [ ] Page load time under 3 seconds
  - [ ] No large resource warnings
  - [ ] Images optimized

---

## Phase 7: Post-Deployment Tasks

### 7.1 Monitoring Setup
- [ ] **Configure monitoring**
  - [ ] Set up Vercel Analytics
  - [ ] Configure Google Analytics
  - [ ] Set up error tracking (if applicable)

- [ ] **Performance baseline**
  - [ ] Record initial performance metrics
  - [ ] Document any known issues

### 7.2 Documentation Update
- [ ] **Update deployment records**
  - [ ] Document deployment date and version
  - [ ] Record any configuration changes
  - [ ] Update changelog if applicable

- [ ] **Team communication**
  - [ ] Notify team of successful deployment
  - [ ] Share deployment notes
  - [ ] Update status dashboard

### 7.3 Backup Verification
- [ ] **Verify backup systems**
  - [ ] Database backups working
  - [ ] File storage backups working
  - [ ] Configuration backups working

---

## Phase 8: Rollback Preparation

### 8.1 Rollback Procedures
- [ ] **Understand rollback options**
  - [ ] Vercel automatic rollback on failure
  - [ ] Manual promotion of previous deployment
  - [ ] Emergency procedures documented

- [ ] **Test rollback capability**
  - [ ] Identify previous stable deployment
  - [ ] Verify rollback procedure works
  - [ ] Document rollback steps

### 8.2 Emergency Contacts
- [ ] **Update contact information**
  - [ ] Primary contact: [Name] - [Phone/Email]
  - [ ] Backup contact: [Name] - [Phone/Email]
  - [ ] Infrastructure lead: [Name] - [Phone/Email]

---

## Troubleshooting Checklist

### Common Issues and Solutions

#### Issue: Build Failures
- [ ] **Check TypeScript errors**
  ```bash
  npx tsc --noEmit
  ```
- [ ] **Verify dependencies**
  ```bash
  npm ci
  ```
- [ ] **Check Node.js version**
  ```bash
  node --version
  ```

#### Issue: Deployment Failures
- [ ] **Check Vercel project limits**
- [ ] **Verify environment variables**
- [ ] **Check build output directory**

#### Issue: Domain Not Working
- [ ] **Check DNS propagation**
- [ ] **Verify domain configuration in Vercel**
- [ ] **Check SSL certificate status**

#### Issue: GitHub Actions Secrets
- [ ] **Verify all secrets are set**
- [ ] **Check secret names match workflow**
- [ ] **Regenerate Vercel token if expired**

---

## Final Verification

### Complete System Check
- [ ] **All checklist items completed**
- [ ] **No critical issues outstanding**
- [ ] **Documentation updated**
- [ ] **Team notified**
- [ ] **Monitoring active**
- [ ] **Backup systems verified**

### Sign-off
- [ ] **Deployment Lead**: ___________________ Date: ________
- [ ] **Quality Assurance**: ___________________ Date: ________
- [ ] **Infrastructure Lead**: ___________________ Date: ________

---

## Notes and Observations

### Deployment Details
- **Deployment Date**: ________
- **Deployment Version**: ________
- **Deployed By**: ________
- **Git Commit Hash**: ________
- **Vercel Deployment ID**: ________

### Issues Encountered
1. ________
   - Resolution: ________
2. ________
   - Resolution: ________

### Lessons Learned
1. ________
2. ________

### Recommendations for Future Deployments
1. ________
2. ________

---

*Checklist Version: 1.0*  
*Last Updated: 2026-02-27*  
*Maintained by: SaludValpa Development Team*