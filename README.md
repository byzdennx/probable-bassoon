# EpannRouter AI

Multi-model AI platform with glassmorphism design, built with Express.js, PostgreSQL, Redis, and EJS.

## Features

- 🤖 **Multiple AI Models**: Gemini, GPT-4, Claude, Llama, Mistral, Cohere, and more
- 🔐 **Authentication**: JWT-based auth with session management
- 💳 **Billing**: Plan management (Free, Pro, Enterprise) with Stripe integration
- 📊 **Dashboard**: Usage stats and session overview
- 🔍 **Explore**: Filter models by provider, price, speed, and context
- 💬 **Playground**: Chat with AI models in real-time
- 📈 **Usage**: Track token consumption and session history
- ⚙️ **Settings**: Profile, password, API keys management
- 👤 **Profile**: View and manage your sessions
- 📚 **Docs**: Documentation with quick links
- ✨ **Glassmorphism Design**: Beautiful blue-themed UI

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Redis
- **Template**: EJS
- **Auth**: JWT, session-based
- **Design**: Glassmorphism, CSS custom properties
- **Hosting**: Railway (PostgreSQL + Redis)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/epannrouter-ai.git
cd epannrouter-ai
```

### 2. Install dependencies
```Bash
npm install
```

###3 . Configure environment variables
```Bash
cp .env.example .env
```
Edit .env with your configuration:
- PostgreSQL connection string
- Redis connection string
- JWT secret
- Stripe secret key

### 4. Start database (optional with Docker)
```Bash
docker-compose up -d
```

### 5. Run the application
```Bash
npm run dev
```

The app will run on http://localhost:3000

### 6. Create admin user
Run the following in the Node.js REPL or create a script:

```JavaScript

const User = require('./src/models/User');
const { hashPassword } = require('./src/utils/helpers');

(async () => {
  const hashed = await hashPassword('admin123');
  await User.create({
    name: 'Admin',
    email: 'admin@epannrouter.com',
    password: hashed,
    role: 'admin'
  });
  console.log('Admin user created');
})();
```

## Usage
Sign up at /register or log in at /login
Explore models at /explore
Start chatting at /playground
Track usage at /usage
Manage billing at /billing
Configure settings at /settings

## API Endpoints
Method	Endpoint	Description
POST	/auth/login	Login
POST	/auth/register	Register
GET	/auth/logout	Logout
GET	/dashboard	Dashboard
GET	/explore	Explore models
POST	/playground/chat	Chat with AI
GET	/usage	Usage stats
GET	/billing	Billing
POST	/settings/update	Update settings

## License
MIT
```text

---

## Deployment on Railway

### 1. Create Railway account and deploy:

```bash
# Install railway CLI
npm i -g railway

# Login
railway login

# Initialize
railway init

# Add environment variables
railway env set NODE_ENV=production
railway env set PG_HOST=...
railway env set PG_PORT=5432
railway env set PG_USER=postgres
railway env set PG_PASSWORD=...
railway env set PG_DATABASE=epannrouter
railway env set REDIS_URL=redis://...
railway env set JWT_SECRET=...
railway env set SESSION_SECRET=...
railway env set STRIPE_SECRET_KEY=...
railway env set STRIPE_PUBLISHABLE_KEY=...
railway env set PORT=3000

# Deploy
railway up
2. Database setup:
Railway will automatically provision PostgreSQL and Redis. The application will connect using the provided connection strings.

3. Run migrations:
The application uses sequelize.sync({ force: false }) to ensure tables exist. For production, use proper migrations.
```
