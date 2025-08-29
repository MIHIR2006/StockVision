# Production Deployment Guide for StockVision

## 🚨 Issues Fixed

### 1. Prisma Permission Error
- **Problem**: `prisma generate` was running during build, causing permission issues
- **Solution**: Moved `prisma generate` to `postinstall` script
- **Result**: Build process now works without permission errors

### 2. NextAuth Production Issues
- **Problem**: Missing production environment variables and configuration
- **Solution**: Added proper environment variable handling and production config
- **Result**: NextAuth now works in production environments

### 3. Database Configuration
- **Problem**: Using SQLite which doesn't work in production
- **Solution**: Updated schema to use PostgreSQL for production
- **Result**: Production-ready database configuration

## 🚀 Deployment Steps

### Step 1: Environment Setup
1. Create `.env.production` file in the frontend directory:
```bash
# Required Variables
NEXTAUTH_SECRET=your_very_long_random_secret_here_minimum_32_characters
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL="postgresql://username:password@host:port/database_name"
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional OAuth Variables
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

2. Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 2: Database Setup
1. Set up PostgreSQL database (recommended: Supabase, PlanetScale, or AWS RDS)
2. Update `DATABASE_URL` in `.env.production`
3. Run database migration:
```bash
npm run db:prod
```

### Step 3: Build and Deploy
1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:dev` - Push database schema (development)
- `npm run db:prod` - Push database schema (production)
- `npm run setup:prod` - Validate production environment
- `npm run db:studio` - Open Prisma Studio

## 🌐 Platform-Specific Deployment

### Vercel
- Already configured with `vercel.json`
- Set environment variables in Vercel dashboard
- Automatic deployments from Git

### Netlify
- Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

### Railway/Heroku
- Set environment variables in platform dashboard
- Use `npm start` as start command

## 🔍 Troubleshooting

### Build Issues
- Ensure `NODE_ENV=production` is set
- Check all required environment variables are present
- Run `npm run setup:prod` to validate environment

### NextAuth Issues
- Verify `NEXTAUTH_SECRET` is at least 32 characters
- Ensure `NEXTAUTH_URL` matches your domain exactly
- Check database connection with `npm run db:prod`

### Database Issues
- Verify PostgreSQL connection string format
- Ensure database is accessible from your deployment platform
- Check database permissions and firewall settings

## 📱 OAuth Provider Setup

### GitHub
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL to: `https://your-domain.com/api/auth/callback/github`

### Google
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID
3. Set Authorized redirect URIs to: `https://your-domain.com/api/auth/callback/google`

## 🛡️ Security Best Practices

- Use strong, unique secrets for each environment
- Enable HTTPS in production
- Set proper CORS policies
- Use environment-specific database credentials
- Regularly rotate secrets and credentials

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Run `npm run setup:prod` to validate environment
3. Check deployment platform logs
4. Verify all environment variables are set correctly
