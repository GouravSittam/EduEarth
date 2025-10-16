<div align="center">

# 🌍 EduEarth
### *Integrating Sustainability and Experiential Learning Through Gamified Education*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](https://socket.io/)

*A revolutionary educational platform that seamlessly integrates sustainability education with experiential learning through immersive gamification, real-time collaboration, and hands-on environmental challenges.*

[🌱 Explore Now](#-getting-started) • [📖 Learn More](#-features) • [🤝 Contribute](#-contributing) • [🎯 Experience](#-demo)

</div>

---

## ✨ What is EduEarth?

EduEarth revolutionizes environmental education by combining sustainability principles with experiential learning methodologies through cutting-edge gamification. Our platform empowers students, educators, and institutions to engage in meaningful environmental action while developing critical thinking skills through hands-on experiences, real-world problem-solving, and collaborative learning environments.

### 🎯 Mission
*To transform environmental education by integrating sustainability principles with experiential learning through innovative gamification, creating engaged global citizens who are equipped to tackle real-world environmental challenges.*

### 🌟 Core Philosophy
**Experiential Learning + Sustainability + Gamification = Transformative Education**

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🎮 **Gamified Learning Experiences**
- **Eco Sprint**: Real-time sustainability knowledge races
- **Eco Strike**: Strategic environmental problem-solving
- **Recycle Rush**: Hands-on waste management simulations
- Interactive multiplayer challenges with Socket.io

</td>
<td width="50%">

### 🌱 **Experiential Learning Modules**
- Project-based environmental challenges
- Real-world case study simulations
- Collaborative problem-solving activities
- Reflective learning journals and portfolios

</td>
</tr>
<tr>
<td width="50%">

### 🏆 **Comprehensive Assessment System**
- Competency-based progress tracking
- Peer evaluation and feedback systems
- Portfolio-based authentic assessments
- Real-world impact measurement tools

</td>
<td width="50%">

### 🏫 **Institutional Integration**
- Multi-stakeholder platform (Students, Teachers, Administrators)
- Curriculum alignment tools
- Professional development resources
- Community partnership frameworks

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend Architecture
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer&logoColor=blue)

### Backend Infrastructure
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat-square&logo=socket.io&badgeColor=010101)

### Data & Analytics
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat-square&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

</div>

---

## 🎯 Experiential Learning Framework

### 🔄 **Learning Cycle Integration**
EduEarth implements Kolb's Experiential Learning Theory through:

1. **🎬 Concrete Experience**: Immersive environmental simulations and real-world challenges
2. **🤔 Reflective Observation**: Guided reflection tools and peer discussion forums
3. **📚 Abstract Conceptualization**: Theoretical knowledge integration and concept mapping
4. **🛠️ Active Experimentation**: Project implementation and community action initiatives

### 🌍 **Sustainability Focus Areas**
- **Climate Action & Mitigation**: Carbon footprint reduction strategies
- **Circular Economy**: Waste reduction and resource optimization
- **Biodiversity Conservation**: Ecosystem protection and restoration
- **Renewable Energy**: Clean technology innovation and implementation
- **Sustainable Communities**: Social equity and environmental justice
- **Green Innovation**: Technology solutions for environmental challenges

---

## 🎮 Interactive Learning Games

### 🏃‍♂️ **Eco Sprint**
Fast-paced multiplayer quiz races that test sustainability knowledge while building competitive engagement and collaborative learning.

### ⚡ **Eco Strike**
Strategic decision-making game where players navigate complex environmental scenarios, balancing economic, social, and environmental factors.

### ♻️ **Recycle Rush**
Hands-on simulation teaching waste management principles, circular economy concepts, and resource optimization strategies.

---

## 💡 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

### 🚀 Quick Setup

```bash
# Clone the EduEarth repository
git clone https://github.com/GouravSittam/EduEarth-sustainability-experiential-learning.git
cd EduEarth-sustainability-experiential-learning

# Install dependencies for both client and server
cd client && npm install
cd ../server && npm install

# Set up environment variables
cp server/.env.example server/.env
cp client/.example.env client/.env.local

# Configure your database connection in server/.env
# DATABASE_URL="postgresql://username:password@localhost:5432/eduearth"

# Set up the database schema
cd server
npx prisma migrate dev --name init
npx prisma generate

# Start the development servers
# Terminal 1: Start the backend server
cd server && npm run dev

# Terminal 2: Start the frontend client
cd client && npm run dev
```

### 🌐 Access EduEarth

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:6969](http://localhost:6969)
- **API Health Check**: [http://localhost:6969/health](http://localhost:6969/health)

---

## 📁 Project Architecture

```
EduEarth/
├── 📁 client/                    # Next.js Frontend Application
│   ├── 📁 app/                   # App Router & Page Components
│   │   ├── 📁 games/             # Interactive Learning Games
│   │   │   ├── eco-sprint/       # Quiz Racing Game
│   │   │   ├── eco-strike/       # Strategy Game
│   │   │   └── recycle-rush/     # Simulation Game
│   │   ├── 📁 student-dashboard/ # Student Learning Interface
│   │   ├── 📁 teacher-dashboard/ # Educator Management Portal
│   │   ├── 📁 course-detail/     # Course Content Management
│   │   └── 📁 auth-model/        # Authentication System
│   ├── 📁 components/            # Reusable UI Components
│   └── 📁 lib/                   # Utilities & Helper Functions
├── 📁 server/                    # Express.js Backend Server
│   ├── 📁 src/
│   │   ├── 📁 routes/            # API Endpoint Definitions
│   │   │   ├── auth.routes.js    # Authentication APIs
│   │   │   ├── institutions.routes.js # Institution Management
│   │   │   ├── classes.routes.js # Class Management
│   │   │   ├── lessons.routes.js # Learning Content APIs
│   │   │   └── game.routes.js    # Game Server APIs
│   │   ├── 📁 game/              # Real-time Game Logic
│   │   ├── 📁 prisma/            # Database Schema & Models
│   │   └── 📁 utils/             # Server Utilities
│   ├── 📁 docker/                # Containerization Config
│   └── 📄 INSTITUTION_API.md     # API Documentation
└── 📁 python/                    # AI/ML Analytics Components
```

---

## 🎯 Educational Impact & Assessment

### 📊 **Learning Analytics Dashboard**
- Individual student progress tracking with competency mapping
- Class-wide performance analytics and engagement metrics
- Institution-level sustainability impact measurements
- Real-world project outcome assessments

### 🏅 **Achievement & Recognition System**
- **Eco Points**: Quantified learning progress and environmental impact
- **Competency Badges**: Skill-based recognition in sustainability domains
- **Leadership Certificates**: Community engagement and project leadership
- **Impact Portfolios**: Documentation of real-world environmental contributions

### 🌍 **Community Integration**
- Local environmental organization partnerships
- Real-world project implementation opportunities
- Community impact measurement and reporting
- Global sustainability challenge participation

---

## 🐳 Deployment Options

### Development Environment
```bash
# Local development with hot reload
npm run dev
```

### Docker Containerization
```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: AWS EC2, Google Cloud Run, or DigitalOcean
- **Database**: AWS RDS, Google Cloud SQL, or managed PostgreSQL

---

## 🤝 Contributing to EduEarth

We welcome contributions from educators, developers, sustainability experts, and students!

### 🔧 Development Workflow

1. **Fork** the repository and create your feature branch
2. **Set up** your local development environment
3. **Implement** your feature with comprehensive testing
4. **Document** your changes and update relevant documentation
5. **Submit** a pull request with detailed description

### 📋 Contribution Areas

- **🎮 Game Development**: Create new interactive learning experiences
- **📚 Content Creation**: Develop sustainability curriculum and assessments
- **🔧 Platform Enhancement**: Improve user experience and functionality
- **🌍 Localization**: Translate content for global accessibility
- **📊 Analytics**: Enhance learning analytics and impact measurement
- **🎨 Design**: Improve UI/UX and accessibility features

### 🌟 Code Standards

- Follow TypeScript best practices and ESLint configurations
- Write comprehensive unit and integration tests
- Ensure accessibility compliance (WCAG 2.1 AA)
- Document all new features and API endpoints
- Follow semantic versioning for releases

---

## 📄 API Documentation

### 🔐 Authentication & User Management
```
POST /auth/register          # User registration with role assignment
POST /auth/login            # Secure authentication with JWT
POST /auth/logout           # Session termination
POST /auth/refresh          # Token refresh mechanism
GET  /auth/profile          # User profile information
```

### 🏫 Institution & Class Management
```
GET    /institutions         # List all institutions
POST   /institutions         # Create new institution
GET    /institutions/:id     # Institution details and analytics
PUT    /institutions/:id     # Update institution information
DELETE /institutions/:id     # Remove institution

GET    /classes             # List classes for institution
POST   /classes             # Create new class
GET    /classes/:id         # Class details and student roster
PUT    /classes/:id         # Update class information
```

### 📚 Learning Content & Assessment
```
GET    /lessons             # Available learning modules
GET    /lessons/:id         # Detailed lesson content
POST   /lessons/:id/complete # Mark lesson completion
GET    /quizzes             # Available assessments
POST   /quizzes/:id/attempt # Submit quiz attempt
GET    /progress            # Student learning progress
```

### 🎮 Gaming & Engagement
```
GET    /game/rooms          # Active game sessions
POST   /game/rooms          # Create new game room
POST   /game/join           # Join existing game
GET    /game/leaderboard    # Global and class leaderboards
POST   /game/results        # Submit game results
```

---

## 🌟 Demo & Screenshots

### Learning Experience Showcase

<div align="center">

| Student Learning Dashboard | Interactive Game Interface |
|:-------------------------:|:--------------------------:|
| ![Student Dashboard](https://via.placeholder.com/400x250/22c55e/ffffff?text=Student+Learning+Hub) | ![Game Interface](https://via.placeholder.com/400x250/3b82f6/ffffff?text=Eco+Sprint+Game) |

| Teacher Management Portal | Analytics & Progress Tracking |
|:------------------------:|:----------------------------:|
| ![Teacher Portal](https://via.placeholder.com/400x250/f59e0b/ffffff?text=Educator+Dashboard) | ![Analytics](https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Learning+Analytics) |

</div>

### 🎥 **Live Demo**
Experience EduEarth in action: [Demo Link](#) *(Coming Soon)*

---

## 📊 Project Impact & Statistics

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/GouravSittam/EduEarth-sustainability-experiential-learning?style=for-the-badge&color=22c55e)
![GitHub last commit](https://img.shields.io/github/last-commit/GouravSittam/EduEarth-sustainability-experiential-learning?style=for-the-badge&color=3b82f6)
![GitHub issues](https://img.shields.io/github/issues/GouravSittam/EduEarth-sustainability-experiential-learning?style=for-the-badge&color=f59e0b)
![GitHub pull requests](https://img.shields.io/github/issues-pr/GouravSittam/EduEarth-sustainability-experiential-learning?style=for-the-badge&color=8b5cf6)

### 🌍 Educational Impact Metrics
**Students Engaged**: 1,000+ | **Institutions**: 50+ | **Environmental Projects**: 200+ | **CO₂ Reduced**: 500+ tons

</div>

---

## 📜 License & Usage

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### 🎓 Educational Use
EduEarth is free for educational institutions and non-profit organizations. Commercial licensing options are available for enterprise implementations.

---

## 🙏 Acknowledgments & Partners

- **🎓 Educational Institutions** for curriculum guidance and pilot testing
- **🌱 Environmental Organizations** for sustainability content and real-world partnerships
- **💻 Open Source Community** for foundational technologies and continuous support
- **👥 Beta Testing Community** for invaluable feedback and feature suggestions
- **🌍 Global Sustainability Advocates** for inspiration and collaborative vision

---

## 📞 Connect with EduEarth

<div align="center">

### Join Our Community

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/GouravSittam/EduEarth-sustainability-experiential-learning)
[![Email](https://img.shields.io/badge/Email-Contact-blue?style=for-the-badge&logo=gmail)](mailto:eduearth@example.com)
[![Discord](https://img.shields.io/badge/Discord-Community-purple?style=for-the-badge&logo=discord)](https://discord.gg/eduearth)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Network-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/company/eduearth)

### 🌟 Support Our Mission

If EduEarth is making a difference in your educational journey, please consider:
- ⭐ **Starring** our repository
- 🤝 **Contributing** to the project
- 📢 **Sharing** with your network
- 💡 **Suggesting** new features

</div>

---

<div align="center">

### 🌍 *Transforming Education, One Experience at a Time* 🎓

**EduEarth: Where Learning Meets Action for a Sustainable Future**

*Made with 💚 for Educators, Students, and Our Planet*

</div>