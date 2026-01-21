# Kubemate Frontend

A modern, production-ready React application for Kubemate - the AI-powered Kubernetes assistant.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

---

## Features

- 🤖 **AI Chat Interface** - Natural language Kubernetes troubleshooting with streaming responses
- 🎨 **Kubernetes-themed Design** - Custom color scheme and animations inspired by K8s
- 🔐 **Authentication System** - Secure login with role-based access control
- 👥 **Admin Dashboard** - Full user management and system monitoring
- 📊 **Cluster Topology Viewer** - Interactive 2D visualization of your cluster
- 🔍 **Pod Browser** - Deep pod inspection with logs and file access
- 👤 **User Dashboard** - Personalized interface with real-time chat
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Modern Tech Stack** - React 18, Tailwind CSS, Lucide icons

---

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom K8s theme
- **Routing**: React Router v6
- **Icons**: Lucide React
- **API**: Axios for backend communication
- **Build**: Create React App

---

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

---

### Installation

```bash
cd main-app
npm install
```

---

### Development

```bash
npm start
```

The app will be available at `http://localhost:3000`

---

### Production Build

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/             # Page components
│   ├── LandingPage.js
│   ├── LoginPage.js
│   ├── SignUpPage.js
│   ├── AdminDashboard.js
│   ├── UserDashboard.js
│   ├── TopologyPage.js
│   └── PodBrowser.js
├── services/          # API services
│   ├── authService.js
│   └── apiService.js
├── utils/             # Utility functions
├── assets/            # Static assets
├── App.js             # Main app component
├── index.js           # Entry point
└── index.css          # Global styles
```

---

## Features Overview

### Landing Page

- Modern hero section with animated K8s logo
- Feature showcase with hover effects
- Call-to-action to login

---

### Authentication

- Secure login form with validation
- Password visibility toggle
- Sign-up functionality
- Error handling and loading states

---

### Admin Dashboard

- **System Overview**: Health monitoring of all components
- **User Management**: CRUD operations, ban/unban functionality
- **Kubeconfig Management**: Add, activate, and manage multiple clusters
- **Activity Logs**: Real-time system logs with filtering
- **API Key Configuration**: Configure LLM provider settings

---

### User Dashboard

- Personalized greeting based on time of day
- **AI Chat Interface**: Streaming responses from LLM
- **Conversation History**: View and continue past conversations
- **Quick Access**: Links to topology viewer and pod browser

---

### Cluster Topology Viewer

- **2D SVG Visualization**: Interactive cluster map
- **Drag-and-Drop**: Reorganize node positions
- **View Modes**: Nodes view, Pods view, Services (coming soon)
- **Namespace Filtering**: Focus on specific applications
- **Color-Coded Status**: Green (Ready), Red (NotReady), Yellow (Pending)
- **Click-to-Inspect**: Get detailed node and pod information

---

### Pod Browser

- **Namespace Tree View**: Expand/collapse namespaces
- **Real-Time Search**: Filter pods by name or namespace
- **Pod Logs**: View, copy, and download pod logs
- **Pod Description**: Full `kubectl describe` output
- **File Browser**: Navigate inside pods, read configuration files
- **Security**: Read-only file access, symlink and device blocking

---

### AI Chat

- **Natural Language Interface**: Ask questions in plain English
- **Streaming Responses**: See answers appear in real-time
- **Command Suggestions**: LLM suggests kubectl commands
- **Context Awareness**: Conversation history maintained
- **Safe Execution**: Only read-only kubectl commands

---

## Kubernetes Theme

The application features a custom Kubernetes-inspired design:

- **Colors**: K8s blue (#326CE5), cyan, dark backgrounds
- **Animations**: Floating logo, pulse effects, smooth transitions
- **Components**: Glass morphism effects, gradient backgrounds
- **Icons**: Lucide React with consistent styling

---

## API Integration

The frontend connects to your Flask backend at `http://localhost:5000` by default.

### Environment Variables

```bash
REACT_APP_API_URL=http://localhost:5000
```

### API Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /api/chat` - Send chat message (streaming)
- `GET /topology/nodes` - Get cluster nodes
- `GET /topology/pods` - Get pods for topology
- `GET /api/pods` - Get all pods grouped by namespace
- `GET /api/pods/<namespace>/<pod_name>/logs` - Get pod logs
- `GET /api/pods/<namespace>/<pod_name>/describe` - Describe pod
- `GET /api/pods/<namespace>/<pod_name>/files/<path>` - Browse files
- `GET /api/pods/<namespace>/<pod_name>/files/<path>/read` - Read file

---

## Security Features

- JWT-based authentication with HttpOnly cookies
- Role-based access control (Admin/User)
- Secure API communication
- Input validation and sanitization
- XSS protection
- HTTPS support in production

---

## Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes
- Custom scrollbars for dark theme

---

## License

Kubemate is licensed under **GNU General Public License v3**.

### What This Means

**You CAN:**
- ✅ Use Kubemate for free (personal or commercial)
- ✅ Study and modify the source code
- ✅ Distribute modified versions

**However, if you distribute a modified version:**
- ❌ You MUST make your source code publicly available
- ❌ You MUST license it under GPL v3
- ❌ You CANNOT make it proprietary/closed-source
- ❌ You CANNOT sell it as your own product without sharing code

This ensures that any improvements to Kubemate benefit the entire community and prevents unauthorized appropriation of the work as a closed-source product.

For full details, see the [LICENSE](../../LICENSE) file.

---

## Future Enhancements

- [ ] Real-time logs streaming (WebSocket)
- [ ] Services topology view
- [ ] Resource usage graphs
- [ ] Event timeline
- [ ] Deployment rollback suggestions
- [ ] ConfigMap/Secret viewer
- [ ] YAML generator
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Offline mode support

---

## Contributing

Contributions are welcome! Please read the main [README](../../README.md) for guidelines.

---

## Support

For issues, questions, or feature requests, please visit the [main repository](https://github.com/mehdi-chebbi/k8s-chat/issues).
