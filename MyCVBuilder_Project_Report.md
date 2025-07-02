# MyCVBuilder.co.uk
## Comprehensive Project Technical Report

---

**Project Name:** MyCVBuilder  
**Live URL:** https://mycvbuilder.co.uk  
**Report Date:** January 2025  
**Document Version:** 1.0  

**Prepared by:** James Ingleton  
**Technical Architecture Review**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Database Design](#5-database-design)
6. [Security Implementation](#6-security-implementation)
7. [Business Model & Analytics](#7-business-model--analytics)
8. [Deployment Infrastructure](#8-deployment-infrastructure)
9. [AI Integration](#9-ai-integration)
10. [User Experience Flow](#10-user-experience-flow)
11. [Payment Processing](#11-payment-processing)
12. [Performance & Monitoring](#12-performance--monitoring)
13. [Recent Improvements](#13-recent-improvements)
14. [Future Roadmap](#14-future-roadmap)
15. [Technical Specifications](#15-technical-specifications)

---

## 1. Executive Summary

**MyCVBuilder** is a comprehensive SaaS platform designed to revolutionize CV creation and optimization through AI-powered analysis. The platform combines modern web technologies with advanced artificial intelligence to provide users with professional CV templates, intelligent feedback, and career guidance.

### Key Achievements
- **Live Production Platform:** Successfully deployed at mycvbuilder.co.uk
- **Modern Architecture:** React frontend + Node.js backend + PostgreSQL database
- **AI Integration:** Multi-model AI analysis using Claude 3.5 Sonnet and GPT-4
- **Subscription Model:** Stripe-powered recurring billing system
- **Enterprise Security:** JWT authentication, 2FA, encryption at rest/transit
- **Real-time Analytics:** Google Analytics 4 with custom business intelligence

### Business Metrics
- **Technology Stack:** React 18.2, Node.js, PostgreSQL, Prisma ORM
- **Deployment:** Vercel (frontend) + Render (backend) + AWS RDS (database)
- **Security:** GDPR compliant, PCI DSS through Stripe, SOC 2 infrastructure
- **Performance:** Sub-3s page loads, 99.9% uptime target

---

## 2. Project Overview

### 2.1 Platform Purpose
MyCVBuilder addresses the critical challenge of CV optimization in today's competitive job market. The platform provides:

- **AI-Powered Analysis:** Advanced CV scoring using multiple AI models
- **ATS Optimization:** Applicant Tracking System compatibility checking
- **Industry-Specific Insights:** Tailored recommendations by role and sector
- **Professional Templates:** Modern, recruiter-approved CV designs
- **Career Guidance:** Personalized improvement recommendations

### 2.2 Target Market
- **Primary:** Job seekers requiring professional CV optimization
- **Secondary:** Career changers needing industry transition guidance
- **Tertiary:** Students and graduates entering the job market

### 2.3 Competitive Advantages
- **Multi-Model AI Analysis:** Combines Claude 3.5 Sonnet + GPT-4 for superior accuracy
- **Real-time Processing:** Instant CV analysis with progress tracking
- **Industry Intelligence:** 50+ role-specific analysis templates
- **Privacy-First:** GDPR compliant with data minimization principles
- **Freemium Model:** Accessible entry point with premium value-add features

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
Internet → Cloudflare DNS → Vercel Frontend → Render Backend → AWS RDS
                           ↓
                    Google Analytics 4
                           ↓
                    Stripe Payment Processing
```

### 3.2 Component Architecture

**Frontend (React SPA)**
- **Framework:** React 18.2 with Vite build system
- **Routing:** React Router v6 with lazy loading
- **State Management:** Context API with provider pattern
- **Styling:** Tailwind CSS with dark mode support
- **Analytics:** Google Analytics 4 with custom events

**Backend (Node.js API)**
- **Framework:** Express.js with middleware architecture
- **Authentication:** JWT with refresh tokens, 2FA support
- **Database:** Prisma ORM with PostgreSQL
- **AI Services:** OpenAI GPT-4 + Anthropic Claude integration
- **Payments:** Stripe API v2023-10-16

**Database (PostgreSQL)**
- **Provider:** AWS RDS with encryption at rest
- **ORM:** Prisma with type safety
- **Migrations:** Automated schema management
- **Backup:** Automated daily backups with point-in-time recovery

### 3.3 Communication Patterns
- **REST API:** JSON-based HTTP communication
- **WebSocket:** Real-time analysis progress updates
- **Event Streaming:** Server-sent events for notifications
- **Webhook Integration:** Stripe payment status updates

---

## 4. Technology Stack

### 4.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 6.3.5 | Build tool |
| React Router | 6.11.1 | Client-side routing |
| Tailwind CSS | 3.3.2 | Utility-first styling |
| Axios | 1.9.0 | HTTP client |
| React Hook Form | 7.43.9 | Form management |
| Chart.js | 4.3.0 | Data visualization |
| React Hot Toast | 2.5.2 | Notifications |

### 4.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 5.1.0 | Web framework |
| Prisma | 6.10.1 | Database ORM |
| PostgreSQL | 14+ | Primary database |
| JWT | 9.0.2 | Authentication |
| Stripe | 14.25.0 | Payment processing |
| Winston | 3.11.0 | Logging |
| Helmet | 7.1.0 | Security headers |

### 4.3 AI & Analytics

| Service | Purpose | Integration |
|---------|---------|-------------|
| OpenAI GPT-4 | CV analysis | REST API |
| Anthropic Claude 3.5 | Content enhancement | REST API |
| Google Analytics 4 | User tracking | gtag.js |
| Sentry | Error monitoring | SDK integration |

---

## 5. Database Design

### 5.1 Core Data Models

**User Model**
```sql
User {
  id: String (CUID)
  email: String (unique)
  password: String (bcrypt hashed)
  name: String
  role: String (user/admin/superuser)
  twoFactorEnabled: Boolean
  marketingConsent: Boolean
  createdAt: DateTime
  lastLogin: DateTime
}
```

**CV Model**
```sql
CV {
  id: String (CUID)
  title: String
  content: String (JSON)
  userId: String (foreign key)
  atsScore: Integer
  createdAt: DateTime
  updatedAt: DateTime
}
```

**Subscription Model**
```sql
Subscription {
  id: String (CUID)
  userId: String (foreign key)
  status: String
  stripeSubscriptionId: String (unique)
  currentPeriodStart: DateTime
  currentPeriodEnd: DateTime
  cancelAtPeriodEnd: Boolean
}
```

### 5.2 Analysis System Models

**CVAnalysis Model**
```sql
CVAnalysis {
  id: String (CUID)
  userId: String
  cvId: String (optional)
  overallScore: Integer
  atsScore: Integer
  contentScore: Integer
  strengths: String[]
  weaknesses: String[]
  recommendedImprovements: String[]
  aiModel: String
  processingTime: Integer
}
```

### 5.3 Relationship Mapping
- **User → CV:** One-to-many (user can have multiple CVs)
- **User → Subscription:** One-to-many (subscription history)
- **CV → CVAnalysis:** One-to-many (analysis history)
- **User → TemporaryAccess:** One-to-many (pay-per-use tracking)

---

## 6. Security Implementation

### 6.1 Authentication & Authorization

**JWT Implementation**
- **Access Tokens:** 15-minute expiration
- **Refresh Tokens:** 7-day expiration with rotation
- **Token Storage:** HttpOnly cookies for security
- **Signature Algorithm:** RS256 with rotating secrets

**Two-Factor Authentication**
- **TOTP Implementation:** 30-second time windows
- **Backup Codes:** 8-digit recovery codes
- **QR Code Generation:** Secure key provisioning
- **Rate Limiting:** Brute force protection

### 6.2 Data Protection

**Encryption Standards**
- **In Transit:** TLS 1.3 for all communications
- **At Rest:** AES-256 encryption via AWS RDS
- **Password Hashing:** bcrypt with 12 salt rounds
- **Sensitive Data:** Environment variable isolation

**Access Controls**
- **User Isolation:** Mandatory userId filtering in all queries
- **Admin Endpoints:** Role-based access control
- **CV Ownership:** Strict ownership validation
- **API Rate Limiting:** Request throttling by endpoint

### 6.3 Compliance Framework

**GDPR Compliance**
- **Data Minimization:** Collect only necessary information
- **Right to Deletion:** Complete data removal capability
- **Consent Management:** Explicit opt-in for marketing
- **Data Portability:** Export user data in JSON format

**Security Headers**
```javascript
{
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': 'strict-dynamic'
}
```

---

## 7. Business Model & Analytics

### 7.1 Revenue Streams

**Subscription Tiers**
- **Free Tier:** Basic CV templates, 1 analysis per month
- **Professional ($9.99/month):** Unlimited analyses, premium templates
- **Enterprise ($29.99/month):** Team features, API access, custom branding

**Pay-Per-Use Options**
- **Single Analysis:** $2.99 per comprehensive CV review
- **30-Day Access:** $14.99 for temporary premium access

### 7.2 Analytics Implementation

**Google Analytics 4 Events**
```javascript
// Business Intelligence Tracking
trackCVUpload(fileType, fileSize, uploadMethod)
trackCVAnalysis(analysisType, duration, score)
trackSubscriptionEvent(action, plan, value)
trackFeatureUsage(feature, engagement_level)
```

**Key Performance Indicators**
- **Conversion Funnel:** Landing → Upload → Analysis → Subscription
- **User Engagement:** Session duration, feature adoption, return visits
- **Revenue Metrics:** MRR, CAC, LTV, churn rate
- **Product Analytics:** Analysis accuracy, completion rates, user satisfaction

### 7.3 Business Intelligence Dashboard

**Real-time Metrics**
- Active users and session data
- Conversion events and revenue tracking
- Feature usage and engagement patterns
- Geographic user distribution

**Strategic Insights**
- Customer acquisition cost by channel
- Product-market fit indicators
- Feature adoption and retention correlation
- Competitive positioning analysis

---

## 8. Deployment Infrastructure

### 8.1 Production Architecture

**Vercel Frontend Deployment**
- **Platform:** Vercel edge network
- **Domain:** mycvbuilder.co.uk via Cloudflare DNS
- **Build Process:** Vite production build with tree shaking
- **CDN:** Global edge locations for static assets
- **SSL:** Automatic certificate provisioning

**Render Backend Deployment**
- **Platform:** Render cloud hosting
- **Auto-scaling:** Horizontal scaling based on demand
- **Health Checks:** Automated uptime monitoring
- **Environment:** Production-grade Node.js runtime
- **Logging:** Centralized log aggregation

**AWS RDS Database**
- **Engine:** PostgreSQL 14 with encryption at rest
- **Backup Strategy:** Automated daily backups with 7-day retention
- **High Availability:** Multi-AZ deployment for failover
- **Monitoring:** CloudWatch metrics and alerting
- **Security:** VPC isolation with security groups

### 8.2 CI/CD Pipeline

**GitHub Actions Workflow**
```yaml
Trigger: Push to main branch
Steps:
1. Run test suite
2. Build production assets
3. Deploy to staging environment
4. Run integration tests
5. Deploy to production
6. Notify team of deployment status
```

**Environment Management**
- **Development:** Local development with mock services
- **Staging:** Production-like environment for testing
- **Production:** Live environment with monitoring
- **Environment Variables:** Secure secret management

### 8.3 Monitoring & Alerting

**Application Monitoring**
- **Uptime Monitoring:** 99.9% availability target
- **Performance Metrics:** Response time tracking
- **Error Tracking:** Sentry integration for bug reporting
- **Resource Usage:** CPU, memory, and database performance

**Business Monitoring**
- **Revenue Tracking:** Stripe webhook integration
- **User Activity:** Real-time analytics dashboard
- **Conversion Tracking:** Funnel analysis and optimization
- **Customer Support:** Integrated help desk system

---

## 9. AI Integration

### 9.1 Multi-Model Analysis System

**Primary AI Models**
- **Claude 3.5 Sonnet:** Primary analysis engine for content evaluation
- **GPT-4:** Secondary analysis for validation and enhancement suggestions
- **Confidence Scoring:** Cross-model agreement analysis for accuracy

**Analysis Capabilities**
- **ATS Optimization:** Keyword matching and formatting analysis
- **Content Quality:** Writing style, clarity, and impact assessment
- **Industry Alignment:** Role-specific requirement matching
- **Career Transition:** Skill transferability analysis

### 9.2 AI Processing Pipeline

**Stage 1: Content Extraction**
```javascript
PDF/DOCX → Text Extraction → Structure Analysis → Data Normalization
```

**Stage 2: Multi-Model Analysis**
```javascript
Parallel Processing:
- Claude 3.5: Content analysis + scoring
- GPT-4: Enhancement suggestions + validation
- Confidence Calculation: Model agreement analysis
```

**Stage 3: Results Synthesis**
```javascript
Score Aggregation → Recommendation Generation → Action Plan Creation
```

### 9.3 AI Quality Assurance

**Outlier Detection**
- Automatic removal of unrealistic scores
- Cross-validation between models
- Hard limits based on industry standards

**Fallback Mechanisms**
- Enhanced mock analysis when AI services unavailable
- Graceful degradation with reduced features
- Error recovery and retry logic

---

## 10. User Experience Flow

### 10.1 User Journey Mapping

**Phase 1: Discovery**
1. Landing page visit with value proposition
2. Feature showcase and social proof
3. Free analysis offer to reduce friction

**Phase 2: Engagement**
1. CV upload with progress indication
2. Real-time analysis with animated progress tracker
3. Comprehensive results with actionable insights

**Phase 3: Conversion**
1. Freemium limitation discovery
2. Premium feature preview
3. Subscription flow with secure payment

**Phase 4: Retention**
1. Regular feature updates and improvements
2. Personalized recommendations and tips
3. Career progression tracking and insights

### 10.2 Interface Design Principles

**Accessibility**
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- High contrast mode availability

**Responsive Design**
- Mobile-first approach
- Progressive enhancement
- Touch-friendly interfaces
- Cross-browser compatibility

**Performance Optimization**
- Lazy loading for components
- Image optimization and compression
- Code splitting and tree shaking
- Service worker for offline functionality

---

## 11. Payment Processing

### 11.1 Stripe Integration

**Payment Security**
- **PCI DSS Compliance:** Level 1 through Stripe
- **Secure Tokenization:** No card data stored locally
- **3D Secure Support:** Enhanced fraud protection
- **Webhook Verification:** Cryptographic signature validation

**Subscription Management**
```javascript
Subscription Lifecycle:
1. Checkout session creation
2. Customer portal access
3. Automatic renewal handling
4. Proration and upgrades
5. Cancellation and refunds
```

### 11.2 Revenue Operations

**Billing Automation**
- Automated invoice generation
- Failed payment retry logic
- Dunning management for recovery
- Tax calculation and compliance

**Financial Reporting**
- Real-time revenue tracking
- Monthly recurring revenue (MRR) analysis
- Customer lifetime value calculation
- Churn prediction and prevention

---

## 12. Performance & Monitoring

### 12.1 Performance Metrics

**Frontend Performance**
- **Page Load Speed:** Target < 3 seconds
- **First Contentful Paint:** Target < 1.5 seconds
- **Largest Contentful Paint:** Target < 2.5 seconds
- **Cumulative Layout Shift:** Target < 0.1

**Backend Performance**
- **API Response Time:** Average < 200ms
- **Database Query Time:** Average < 50ms
- **Error Rate:** Target < 1%
- **Uptime:** Target 99.9%

### 12.2 Monitoring Stack

**Application Monitoring**
- **Sentry:** Error tracking and performance monitoring
- **Winston Logging:** Structured logging with log levels
- **Health Checks:** Automated endpoint monitoring
- **Database Monitoring:** Query performance analysis

**Business Monitoring**
- **Google Analytics 4:** User behavior and conversion tracking
- **Stripe Dashboard:** Revenue and payment analytics
- **Custom Dashboards:** Business KPI visualization
- **Alert System:** Automated notification for critical issues

---

## 13. Recent Improvements

### 13.1 Google Analytics Implementation (January 2025)
- **Problem:** Duplicate tracking causing inaccurate data
- **Solution:** Consolidated GA4 implementation with custom business events
- **Result:** Accurate real-time tracking and business intelligence

### 13.2 Backend Log Optimization (January 2025)
- **Problem:** JWT signature warnings flooding production logs
- **Solution:** Reduced log levels for routine token rotation events
- **Result:** Cleaner logs focused on actual issues

### 13.3 Multi-Model AI Upgrade (December 2024)
- **Enhancement:** Parallel processing with Claude 3.5 + GPT-4
- **Benefit:** 95% confidence scoring when models agree
- **Impact:** Significantly improved analysis accuracy

### 13.4 Security Enhancements (November 2024)
- **Two-Factor Authentication:** TOTP implementation with backup codes
- **Superuser Role System:** Enhanced admin controls
- **Rate Limiting:** Advanced protection against abuse

---

## 14. Future Roadmap

### 14.1 Short-term Enhancements (Q1 2025)
- **Mobile App Development:** Native iOS/Android applications
- **Advanced Templates:** Industry-specific CV designs
- **API Expansion:** Public API for third-party integrations
- **Collaboration Features:** Team CV review and feedback

### 14.2 Medium-term Developments (Q2-Q3 2025)
- **Machine Learning Pipeline:** Custom CV scoring models
- **Video CV Analysis:** AI-powered video interview preparation
- **Career Coaching:** Personalized career development plans
- **Integration Marketplace:** Job board and ATS connections

### 14.3 Long-term Vision (Q4 2025+)
- **AI Career Assistant:** Comprehensive career guidance platform
- **Enterprise Solutions:** Large organization CV management
- **Global Expansion:** Multi-language support and localization
- **Blockchain Verification:** Decentralized credential verification

---

## 15. Technical Specifications

### 15.1 System Requirements

**Frontend Requirements**
- Modern web browser with ES2020 support
- JavaScript enabled
- Minimum 1MB available memory
- Internet connection for real-time features

**Backend Requirements**
- Node.js 18+ runtime environment
- PostgreSQL 14+ database
- Minimum 512MB RAM
- 10GB storage for application files

### 15.2 API Specifications

**Authentication Endpoints**
```
POST /api/auth/register - User registration
POST /api/auth/login - User authentication
POST /api/auth/refresh - Token refresh
POST /api/auth/logout - Session termination
```

**CV Management Endpoints**
```
GET /api/cv - List user CVs
POST /api/cv - Create new CV
PUT /api/cv/:id - Update CV
DELETE /api/cv/:id - Delete CV
POST /api/cv/analyze - Analyze CV content
```

**Subscription Endpoints**
```
GET /api/subscription/plans - Available plans
POST /api/subscription/checkout - Create checkout session
GET /api/subscription/status - Current subscription status
POST /api/subscription/cancel - Cancel subscription
```

### 15.3 Environment Configuration

**Required Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Authentication
JWT_SECRET=your-secure-secret
JWT_REFRESH_SECRET=your-refresh-secret

# External Services
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...

# Application
FRONTEND_URL=https://mycvbuilder.co.uk
NODE_ENV=production
```

---

## Conclusion

MyCVBuilder represents a comprehensive, production-ready SaaS platform that successfully combines modern web technologies with advanced AI capabilities. The system demonstrates enterprise-level architecture, security, and scalability while maintaining user-friendly design and robust business analytics.

The platform's multi-model AI approach, secure payment processing, and comprehensive monitoring make it a competitive solution in the CV optimization market. With its solid technical foundation and clear roadmap for enhancement, MyCVBuilder is positioned for sustained growth and market expansion.

**Key Success Factors:**
- **Technical Excellence:** Modern, scalable architecture
- **Security Focus:** GDPR compliance and enterprise security
- **User Experience:** Intuitive design with powerful features
- **Business Intelligence:** Data-driven decision making
- **AI Innovation:** Cutting-edge analysis capabilities

---

*Report generated: January 2025*  
*Document version: 1.0*  
*Classification: Internal Technical Documentation* 