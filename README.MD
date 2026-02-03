# Kubemate

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-1.25+-blue.svg)](https://kubernetes.io/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-green.svg)](https://www.python.org/)

> AI-powered Kubernetes assistant that acts as your personal DevOps engineer.

---

## 🎯 What is Kubemate?

**Kubemate** is an AI-powered Kubernetes assistant that combines natural language understanding, interactive visualization, and deep cluster inspection into one powerful tool.

Think of it as: **ChatGPT meets kubectl meets K8s Dashboard** - but safer, smarter, and easier to use.

---

## ✨ Features

### 1️⃣ AI Chat Assistant

**Talk to your cluster in plain English.**

- ✅ Natural language queries - no kubectl syntax required
- ✅ Real-time streaming responses
- ✅ Conversation history with context awareness
- ✅ LLM suggests appropriate kubectl commands
- ✅ Execute read-only commands safely
- ✅ Get intelligent analysis and actionable insights

**Example questions:**
- "Why is my nginx pod crashing?"
- "Show me all failing pods"
- "What's wrong with my deployment?"
- "Check logs for pod xyz-123"

---

### 2️⃣ Cluster Topology Viewer

**See your entire cluster at a glance.**

- 📊 Interactive 2D SVG visualization
- 🎨 Draggable nodes for custom layouts
- 👁 Multiple view modes (Nodes, Pods, Services)
- 🎯 Click-to-inspect for detailed information
- 🌈 Color-coded status indicators
- 🔄 Real-time updates

**View Modes:**
- **Nodes View**: Master/Worker nodes with health status
- **Pods View**: Pod distribution across nodes

---

### 3️⃣ Pod Browser

**Inspect pods without touching kubectl.**

- 🔍 Browse all pods across namespaces
- 📄 View real-time pod logs with copy/download
- 📋 Get full `kubectl describe` output
- 📁 Navigate inside pods (file browser)
- 📖 Read configuration files
- 🔒 Read-only file access with security protections

---

## 🛡️ Architecture

### Backend (Python/Flask)

```
├── app.py              # Main Flask application (2,652 lines)
├── k8s_client.py       # Kubernetes wrapper using kubectl
├── llm_client.py       # LLM integration (OpenRouter API)
├── database.py          # PostgreSQL manager (2,166 lines)
├── question_classifier.py # NLP intent classification
└── command_verifier.py # Security layer (read-only enforcement)
```

---

### Frontend (React)

```
src/
├── pages/
│   ├── LandingPage.js      # Landing page
│   ├── LoginPage.js        # Authentication
│   ├── AdminDashboard.js   # Admin panel
│   ├── UserDashboard.js    # Chat interface
│   ├── TopologyPage.js    # Cluster visualization
│   └── PodBrowser.js      # Pod inspection
├── components/         # Reusable UI components
├── services/           # API services
└── utils/              # Utility functions
```

---

### Infrastructure

```
┌─────────────────────────────────────────────────┐
│                    User Browser                │
└────────────────────┬─────────────────────────┘
                     │ HTTPS / HTTP
                     │
┌────────────────────┴─────────────────────────┐
│              React Frontend                 │
│          (Port 3000 / Nginx)            │
└────────────────────┬─────────────────────────┘
                     │
                     │ REST API + Streaming
                     │
┌────────────────────┴─────────────────────────┐
│              Flask Backend                 │
│            (Port 5000)                      │
└───┬──────────────┬───────────────┬───────────┘
    │              │               │
    │              │               │
┌───┴───┐    ┌───┴───┐    ┌───┴────────┐
│PostgreSQL│    │K8s API │    │OpenRouter │
│Database │    │(kubectl)│    │  (LLM)    │
└─────────┘    └──────────┘    └─────────────┘
```

---

## 🔐 Security

### Authentication & Authorization

- ✅ JWT-like session management
- ✅ HttpOnly session cookies (XSS protection)
- ✅ Role-based access control (Admin/User)
- ✅ Banned user enforcement
- ✅ Session expiration (24 hours)
- ✅ Password hashing with bcrypt

---

### Kubernetes Access Control

- ✅ Read-only kubectl commands only (get, describe, logs, top, events)
- ✅ Encrypted kubeconfig storage (Fernet: AES-128 + HMAC)
- ✅ Per-user kubeconfig management
- ✅ Multi-cluster support
- ✅ Command verification before execution

---

### Input Security

- ✅ Command injection prevention
- ✅ Path sanitization
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ File access restrictions

---

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (or local minikube/kind)
- kubectl configured with cluster access
- OpenRouter API key or self hosted model (for LLM features)

---

### Installation


### Kubernetes

**1. Add the Helm repository**


```bash
helm repo add kubemate https://mehdi-chebbi.github.io/KubeMate/
```

```bash
helm repo update
```

```bash
helm install kubemate kubemate/kubemate
```

**2. Accessing KubeMate**

```bash
kubectl port-forward svc/kubemate-frontend 3000:80 -n kubemate
```

Then open your browser to:
```bash
http://localhost:3000
```

**3. Default credentials**

- Username: `admin`
- Password: `admin123`

⚠️ **Change these immediately after first login!**

### Docker Compose

**1. Clone the repository**

```bash
git clone https://github.com/mehdi-chebbi/kubemate.git
cd kubemate
```

**2. Configure environment variables**

Create `.env` file in project root:

```bash
# Database (docker-compose handles these)
POSTGRES_DB=k8s_bot
POSTGRES_USER=bot_user
POSTGRES_PASSWORD=bot_password_123

```

**3. Start the application**

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Flask backend on port 5000
- React frontend on port 3000

**4. Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

**5. Default credentials**

- Username: `admin`
- Password: `admin123`

⚠️ **Change these immediately after first login!**

---

## 📚 API Reference

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login (sets HttpOnly cookie)
- `POST /auth/logout` - User logout

---

### Chat

- `POST /api/chat` - Send chat message (streaming response)
- `GET /api/conversations` - Get conversation history

---

### Topology

- `GET /topology/nodes` - Get all nodes with health info
- `GET /topology/namespaces` - Get all namespaces
- `GET /topology/pods?namespace=<name>` - Get pods by namespace

---

### Pods

- `GET /api/pods` - Get all pods grouped by namespace
- `GET /api/pods/<namespace>/<pod_name>/logs` - Get pod logs
- `GET /api/pods/<namespace>/<pod_name>/describe` - Describe pod
- `GET /api/pods/<namespace>/<pod_name>/files/<path>` - Browse files
- `GET /api/pods/<namespace>/<pod_name>/files/<path>/read` - Read file

---

### Admin (requires admin role)

- `GET /admin/users` - List all users
- `POST /admin/users` - Create user
- `PUT /admin/users/<id>/ban` - Ban/unban user
- `GET /admin/kubeconfigs` - List kubeconfigs
- `POST /admin/kubeconfigs` - Add kubeconfig
- `PUT /admin/kubeconfigs/<id>/activate` - Activate kubeconfig
- `DELETE /admin/kubeconfigs/<id>` - Delete kubeconfig
- `GET /admin/activity-logs` - Get activity logs

---

### Health

- `GET /health` - System health status

---

## 📝 Development Setup

### Backend (Python)

```bash
cd project
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend (React)

```bash
cd project/main-app
npm install
npm start
```

---

## 🌐 Production Deployment

### 1. Use Environment Variables

```bash
export FLASK_ENV=production
export SECRET_KEY=<strong_random_key>
export K8S_BOT_ENCRYPTION_KEY=<fernet_key>
export OPENROUTER_API_KEY=<your_key>
```

### 2. Update docker-compose.yml

- Change database passwords
- Use persistent volumes
- Configure health checks
- Set resource limits

### 3. Configure Reverse Proxy

Use Nginx or Caddy to:
- Handle SSL/TLS
- Terminate HTTPS
- Route frontend and backend
- Add security headers

### 4. Database Backups

```bash
# Backup
docker exec k8s-bot-postgres pg_dump -U bot_user k8s_bot > backup.sql

# Restore
docker exec -i k8s-bot-postgres psql -U bot_user k8s_bot < backup.sql
```

---

## ❓ FAQ

### General

**Q: What is Kubemate?**
A: An AI-powered Kubernetes assistant that lets you manage and troubleshoot your clusters through natural language, visualize topology, and inspect pods without knowing kubectl commands.

**Q: Is it free?**
A: The tool is open-source and free. You only need an OpenRouter API key for AI features (they offer free tier usage).

**Q: What Kubernetes versions are supported?**
A: Any Kubernetes version that supports kubectl CLI (generally 1.19+).

**Q: Can I use it with multiple clusters?**
A: Yes! Admin users can add multiple kubeconfigs and switch between them.

---

### Security

**Q: Can bot modify my cluster?**
A: No. It only executes read-only kubectl commands (get, describe, logs, top, events). No delete, apply, or edit operations.

**Q: How are kubeconfigs stored?**
A: All kubeconfigs are encrypted using Fernet (AES-128 + HMAC) before being stored in PostgreSQL.

**Q: Is my cluster data sent to AI?**
A: Only relevant command outputs (pod names, error messages) are sent to OpenRouter for analysis. No sensitive data like secrets or tokens is transmitted.

**Q: Can I use it without AI features?**
A: Yes, topology viewer and pod browser work without AI. The chat will fall back to basic kubectl command suggestions.

---

### Deployment

**Q: Do I need Docker?**
A: Docker Compose is easiest way to deploy, but you can run it manually with Python and Node.js.

**Q: Can I deploy to Kubernetes?**
A: Yes! You can containerize the app and deploy it to your cluster using Helm or Kubernetes manifests.

**Q: Database requirements?**
A: PostgreSQL 12+ is required. Docker Compose sets up PostgreSQL 15 by default.

**Q: How much resources does it need?**
A: Minimum: 1 CPU, 2GB RAM. Recommended: 2 CPUs, 4GB RAM for production.

---

### Features

**Q: What can I ask the chat bot?**
A: Anything related to Kubernetes troubleshooting:
- "Why are my pods failing?"
- "Show me unhealthy deployments"
- "What's consuming the most CPU?"
- "Check logs for pod xyz"
- "How many nodes are ready?"

**Q: Does it support custom CRDs?**
A: Partially. It can list and describe CRDs, but AI may not understand custom resource types without training.

**Q: Can I use it in air-gapped environments?**
A: The topology viewer and pod browser work offline. For AI features, you'd need to self-host an LLM or use an internal API.

**Q: Does it support Windows?**
A: The backend runs on Linux/macOS via Docker. Frontend works in any modern browser.

---

### Troubleshooting

**Q: "kubectl not found" error**
A: Ensure kubectl is installed and accessible. For Docker, mount your kubectl binary or use the official kubectl image.

**Q: Can't connect to cluster**
A: Check that your kubeconfig is valid and you have network access to the cluster. Verify with `kubectl cluster-info`.

**Q: AI responses are slow**
A: This depends on OpenRouter API response time. Check your API key quota and network connectivity.

**Q: Database connection failed**
A: Ensure PostgreSQL is running and credentials match environment variables. Check docker-compose logs.

---

## 🛣️ Roadmap

### Current Features

- ✅ AI chat with streaming
- ✅ Cluster topology viewer (nodes & pods)
- ✅ Pod browser with logs and file inspection
- ✅ Multi-cluster support
- ✅ Admin dashboard
- ✅ Encrypted credential storage

### Planned Features

- 🚧 Services topology view
- 🚧 Real-time logs streaming (WebSocket)
- 🚧 Resource usage graphs
- 🚧 Event timeline
- 🚧 Deployment rollback suggestions
- 🚧 ConfigMap/Secret viewer
- 🚧 YAML generator
- 🚧 Helm integration
- 🚧 Mobile app

---

## 🤝 Contributing

Contributions are welcome!

**How to contribute:**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Areas for contribution:**

- UI/UX improvements
- Additional AI providers
- More topology visualizations
- Enhanced security features
- Documentation
- Bug fixes
- Performance optimizations

---

## 📄 License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Kubemate is licensed under **MIT License**.

### What This Means

**You CAN:**
- ✅ Use Kubemate for free (personal or commercial)
- ✅ Study and modify the source code
- ✅ Distribute modified versions (open or closed source)
- ✅ Sell products or services using Kubemate
- ✅ Keep your modifications private (internal use)

**Requirements:**
- ✅ You MUST include the copyright notice in all copies
- ✅ You MUST keep the MIT license in all distributed copies
- ✅ You CANNOT claim you wrote the original software

This means you can use Kubemate in commercial products, even closed-source ones, as long as you credit the original author.

For full details, see the [LICENSE](LICENSE) file.

---

## ™️ Trademark

"Kubemate" and the Kubemate logo are trademarks of Mehdi Chebbi.

**What This Means:**
- ✅ You CAN use the Kubemate code under the MIT License
- ✅ You CAN refer to Kubemate to describe the origin of your code
- ❌ You CANNOT use "Kubemate" as your product name
- ❌ You CANNOT use the Kubemate logo or branding
- ❌ You CANNOT suggest your product is the official Kubemate

For example:
- ✅ "ClusterManager - A fork of Kubemate by Mehdi Chebbi"
- ❌ "Kubemate Enterprise Edition"

Please see the [TRADEMARK.md](TRADEMARK.md) file for the complete trademark policy.

---

