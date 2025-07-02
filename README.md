# 🚀 AI-Powered Blog Platform

A modern, AI-powered multilingual blog platform built with cutting-edge technologies including Next.js 14, Express.js, MongoDB, and featuring stunning 3D animations and real-time capabilities.

## ✨ Features

### 🎯 Core Features
- **🤖 AI-Powered**: Integrated OpenAI for content generation and smart recommendations
- **🌐 Multilingual**: Full support for English, Sinhala, and Tamil
- **⚡ Real-time**: Live comments, notifications, and collaborative editing
- **🎨 Modern UI**: Beautiful design with Tailwind CSS and custom animations
- **📱 Responsive**: Mobile-first design that works on all devices
- **🔒 Secure**: JWT authentication, bcrypt password hashing, and security middleware

### 🎭 Animations & Visual Effects
- **🌟 3D Animations**: Three.js powered 3D scenes and interactions
- **✨ Particle Effects**: Dynamic particle backgrounds with tsparticles
- **🎬 Smooth Transitions**: GSAP and Framer Motion animations
- **🌊 Parallax**: Multi-layer parallax scrolling effects
- **🎪 Interactive Elements**: Hover effects and micro-interactions

### 🛠 Technical Stack

#### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Three.js** for 3D effects
- **next-intl** for internationalization
- **Socket.io Client** for real-time features
- **SWR** for data fetching

#### Backend
- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Cloudinary** for image uploads
- **Nodemailer** for email services
- **OpenAI API** for AI features

#### DevOps & Tools
- **ESLint & Prettier** for code quality
- **Husky** for git hooks
- **Docker** support
- **Vercel** deployment ready
- **PWA** configuration

## 🚦 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Umesh080797668/ecommerce.git
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in the `.env` file.

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run dev:frontend  # http://localhost:3000
   npm run dev:backend   # http://localhost:8000
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blog-platform

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
```

## 📁 Project Structure

```
blog-platform/
├── frontend/                  # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js 14 App Router
│   │   │   ├── [locale]/     # Internationalized routes
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── page.tsx      # Root page
│   │   ├── components/       # React components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── blog/         # Blog-specific components
│   │   │   ├── auth/         # Authentication components
│   │   │   └── animations/   # Animation components
│   │   ├── lib/              # Utility libraries
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # CSS and styling
│   │   ├── messages/         # i18n translation files
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   ├── next.config.mjs       # Next.js configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json
├── backend/                   # Express.js backend application
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── utils/            # Utility functions
│   │   ├── config/           # Configuration files
│   │   └── server.ts         # Main server file
│   └── package.json
├── shared/                    # Shared types and constants
│   ├── src/
│   │   ├── types/            # TypeScript type definitions
│   │   └── constants/        # Shared constants
│   └── package.json
├── docker-compose.yml         # Docker configuration
├── .env.example              # Environment variables template
└── package.json              # Root package.json (workspace)
```

## 🎯 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all packages for production
- `npm run lint` - Run ESLint on all packages
- `npm run type-check` - Run TypeScript type checking

### Frontend
- `npm run dev:frontend` - Start Next.js development server
- `npm run build:frontend` - Build Next.js for production
- `npm run start:frontend` - Start Next.js production server

### Backend
- `npm run dev:backend` - Start Express.js development server
- `npm run build:backend` - Build Express.js for production
- `npm run start:backend` - Start Express.js production server

## 🌍 Internationalization

The platform supports three languages:
- **English (en)** - Default language
- **Sinhala (si)** - සිංහල
- **Tamil (ta)** - தமிழ்

Language detection is automatic based on browser settings, and users can manually switch languages.

## 🎨 Animations & Effects

### Three.js 3D Effects
- Floating geometric shapes
- Interactive 3D scenes
- Mouse-responsive animations
- WebGL-powered graphics

### Particle Systems
- Dynamic particle backgrounds
- Interactive particle connections
- Customizable particle properties
- Performance-optimized rendering

### CSS & Framer Motion
- Smooth page transitions
- Component entrance animations
- Hover effects and micro-interactions
- Scroll-triggered animations

## 🔐 Authentication

- JWT-based authentication
- Password hashing with bcrypt
- Email verification
- Password reset functionality
- Google OAuth integration (ready)
- Role-based access control

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

### Blog Posts
- `GET /api/posts` - Get all blog posts
- `POST /api/posts` - Create new blog post
- `GET /api/posts/:id` - Get blog post by ID
- `PUT /api/posts/:id` - Update blog post
- `DELETE /api/posts/:id` - Delete blog post

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Railway/Render (Backend)
1. Connect your GitHub repository
2. Configure environment variables
3. Set build command: `npm run build:backend`
4. Set start command: `npm run start:backend`

### Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Three.js for the 3D graphics library
- Framer Motion for the animation library
- All other open-source contributors

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation
2. Search existing issues on GitHub
3. Create a new issue if needed
4. Contact the development team

---

**Made with ❤️ by the AI Blog Platform Team**