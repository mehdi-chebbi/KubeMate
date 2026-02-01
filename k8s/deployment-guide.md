# KubeMate Kubernetes Deployment Guide

## Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured to access your cluster
- Longhorn storage class installed and configured
- Docker images built and pushed to Docker Hub:
  - `mehdino123/kubemate-front:latest`
  - `mehdino123/kubemate-back:latest`

## Quick Start

### 1. Create Namespace
```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Update Secrets (IMPORTANT!)
Edit `k8s/secrets.yaml` and replace all placeholder values with secure, randomly generated values:

```bash
# Generate secure values
openssl rand -hex 32  # for flask-secret-key
openssl rand -hex 32  # for encryption-key
openssl rand -hex 16  # for db-password
```

Update `k8s/secrets.yaml` with your generated values, then apply:
```bash
kubectl apply -f k8s/secrets.yaml -n kubemate
```

### 3. Deploy in Order

**Database:**
```bash
kubectl apply -f k8s/db/ -n kubemate
```

**ConfigMap:**
```bash
kubectl apply -f k8s/configmap.yaml -n kubemate
```

**Backend:**
```bash
kubectl apply -f k8s/backend/ -n kubemate
```

**Frontend:**
```bash
kubectl apply -f k8s/frontend/ -n kubemate
```

### 4. One-Line Deployment
After updating secrets, deploy everything:
```bash
kubectl apply -f k8s/ -n kubemate
```

## Verify Deployment

Check all pods are running:
```bash
kubectl get pods -n kubemate
```

Expected output:
```
NAME                                 READY   STATUS    RESTARTS   AGE
kubemate-backend-xxxxxxxxxx-xxxxx    1/1     Running   0          1m
kubemate-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
kubemate-postgres-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
```

Check services:
```bash
kubectl get services -n kubemate
```

View logs:
```bash
# Backend logs
kubectl logs -f -l app=kubemate-backend -n kubemate

# Frontend logs
kubectl logs -f -l app=kubemate-frontend -n kubemate

# Database logs
kubectl logs -f -l app=kubemate-postgres -n kubemate
```

## Accessing the Application

You'll need to expose the frontend service. Options:

### Option 1: Port Forward (for testing)
```bash
kubectl port-forward svc/kubemate-frontend 8080:80 -n kubemate
```
Then access at: http://localhost:8080

### Option 2: NodePort Service
Create a NodePort service or use your existing ingress solution.

### Option 3: LoadBalancer (if supported)
Add `type: LoadBalancer` to `k8s/frontend/service.yaml`

## Storage

- PostgreSQL data is stored on a Longhorn PVC
- PVC size: 10Gi (configurable in `k8s/db/pvc.yaml`)
- Storage class: `longhorn`

## Resource Limits

**PostgreSQL:**
- Request: 256Mi RAM, 100m CPU
- Limit: 1Gi RAM, 500m CPU

**Backend:**
- Request: 256Mi RAM, 100m CPU
- Limit: 1Gi RAM, 1000m CPU

**Frontend:**
- Request: 64Mi RAM, 50m CPU
- Limit: 256Mi RAM, 200m CPU

## Troubleshooting

**Pod not starting:**
```bash
kubectl describe pod <pod-name> -n kubemate
kubectl logs <pod-name> -n kubemate
```

**Database connection errors:**
```bash
# Check postgres pod is ready
kubectl get pods -l app=kubemate-postgres -n kubemate

# Test database connection from backend pod
kubectl exec -it <backend-pod> -n kubemate -- sh
# Inside pod:
curl kubemate-postgres:5432
```

**Backend failing health check:**
```bash
# Check backend logs
kubectl logs -l app=kubemate-backend -n kubemate

# Check environment variables
kubectl exec -it <backend-pod> -n kubemate -- env | grep DATABASE
```

## Scaling

**Scale backend:**
```bash
kubectl scale deployment kubemate-backend --replicas=3 -n kubemate
```

**Scale frontend:**
```bash
kubectl scale deployment kubemate-frontend --replicas=2 -n kubemate
```

Note: PostgreSQL is currently set to 1 replica. Scaling requires PostgreSQL HA setup.

## Upgrading

**Update images:**
```bash
# Edit deployment YAMLs to update image tags
kubectl set image deployment/kubemate-backend backend=mehdino123/kubemate-back:v2.0 -n kubemate
kubectl set image deployment/kubemate-frontend frontend=mehdino123/kubemate-front:v2.0 -n kubemate
```

**Rollback if needed:**
```bash
kubectl rollout undo deployment/kubemate-backend -n kubemate
kubectl rollout undo deployment/kubemate-frontend -n kubemate
```

## Security Notes

1. ⚠️ **Update secrets** before production deployment
2. Use strong, unique passwords and encryption keys
3. Consider using Sealed Secrets or external secret management
4. Enable network policies to restrict pod-to-pod communication
5. Consider adding Pod Security Policies or Pod Security Standards
6. Review and adjust resource limits based on your workload

## Cleanup

Remove all resources:
```bash
kubectl delete namespace kubemate
```

Or remove individual components:
```bash
kubectl delete -f k8s/ -n kubemate
```

Note: This will also delete the PostgreSQL PVC. Backup your data before deleting!
