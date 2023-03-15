---
sidebar_position: 3
---

# Connecting to a cluster

Ensure you're properly authenticated to your cluster.

You can do this by running `kubectl cluster-info` and verifying that you get a response. Follow the guide [here](https://kubernetes.io/docs/tasks/tools/#kubectl) to install `kubectl`. The response looks something like

```
➜  kube-knots git:(main) ✗ kubectl cluster-info
Kubernetes control plane is running at https://127.0.0.1
GLBCDefaultBackend is running at https://127.0.0.1/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
KubeDNS is running at https://127.0.0.1/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
KubeDNSUpstream is running at https://127.0.0.1/api/v1/namespaces/kube-system/services/kube-dns-upstream:dns/proxy
Metrics-server is running at https://127.0.0.1/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

Authenticating to a cluster is different for each cloud provider and require different setups/configurations. The follow sections covers the steps you need to configure each cloud provider.

## Amazon EKS

Prerequisites:

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- configure your AWS credentials by running `aws configure`

To authenticate to your EKS cluster, run the following command:

```
aws eks --region <region> update-kubeconfig --name <cluster-name>
```

## Google GKE

Prerequisites:

- Install [gcloud CLI](https://cloud.google.com/sdk/docs/install)
- Initialize gcloud by running `gcloud init` and follow the prompts
- Install [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl)

To authenticate to your GKE cluster, run the following command:

```
gcloud container clusters get-credentials CLUSTER_NAME --region=COMPUTE_REGION
```

## Azure AKS

Prerequisites:

- Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

To authenticate to your AKS cluster, run the following command:

```
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

## Minikube

Follow the guide [here](https://minikube.sigs.k8s.io/docs/start/) to install minikube and configure your cluster.

The cluster will be automatically detected by Kube Knots.

## Docker Desktop

Follow the guide [here](https://docs.docker.com/desktop/kubernetes/) to install Docker Desktop and configure your cluster.

The cluster will be automatically detected by Kube Knots.
