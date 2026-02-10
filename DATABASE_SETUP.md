# Database Setup Guide for SleekWheels

## 🚀 Quick Start with PostgreSQL

### Option 1: Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL:**
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Create Database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE sleekwheels;
   
   # Exit
   \q
   ```

3. **Set Environment Variables:**
   Create a `.env` file in your project root:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/sleekwheels
   NODE_ENV=development
   SESSION_SECRET=your-super-secret-session-key
   ```

### Option 2: Neon (Free Cloud PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string
4. Add to your `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/sleekwheels
   ```

### Option 3: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Add to your `.env` file

## 🔧 Database Operations

### Generate Migrations
```bash
npm run db:generate
```

### Apply Migrations
```bash
npm run db:push
```

### Reset Database
```bash
npm run db:reset
```

## 📊 Sample Data

The database will automatically be seeded with:
- **Admin User**: one initial admin account (credentials can be adjusted directly in the database for production)
- **Sample Cars**: 3 luxury vehicles with full specifications
- **Database Tables**: users, cars, contacts, sell_requests

## 🚨 Important Notes

- **Change default passwords** in production
- **Use environment variables** for sensitive data
- **Backup your database** regularly
- **Test migrations** in development first

## 🔍 Troubleshooting

### Connection Issues
- Check if PostgreSQL is running
- Verify connection string format
- Ensure database exists
- Check firewall settings

### Permission Issues
- Verify user has proper permissions
- Check database ownership
- Ensure user can create tables

## 📚 Next Steps

1. Start your server: `npm run dev`
2. Login with admin credentials
3. Add your first car through the admin panel
4. View cars on the public cars page

Your database is now ready to store real car data! 🎉
