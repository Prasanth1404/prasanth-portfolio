/*
  ============================================================
  PROJECTS DATA
  To add a new project: copy one object in the list below,
  give it a new unique "id", and fill in the fields.
  Screenshots go in images/projects/<id>/ (missing files are hidden).
  Logo: images/projects/<id>/logo.svg, .png, .webp or .jpg (the extension must match the real file type).
  logoBackground: optional colour behind a logo that has its own solid background.
  Diagram node kinds: user, git, aws, k8s, data, sec
  Wrap commands or file names in `backticks` to show them as code.
  ============================================================
*/
/* Simplified support diagram used for company products.
   It shows the kind of work I do, not the client's real architecture. */
function supportDiagram(app) {
  return {
    title: "How I support " + app,
    caption: "Simplified view of my role. Internal architecture is left out on purpose.",
    height: 460,
    nodes: [
      { id: "dev", x: 110, y: 100, label: "Developers", sub: "push code", kind: "user" },
      { id: "ci", x: 330, y: 100, label: "CI/CD pipeline", sub: "Jenkins, GitHub Actions", kind: "git", w: 180 },
      { id: "app", x: 560, y: 100, label: app, sub: "application servers", kind: "aws", w: 176 },
      { id: "db", x: 800, y: 100, label: "Database", sub: "backups, restore tests", kind: "data", w: 170 },
      { id: "users", x: 110, y: 300, label: "Customers", sub: "web and POS", kind: "user" },
      { id: "edge", x: 330, y: 300, label: "Reverse proxy + SSL", sub: "Nginx, HAProxy, Certbot", kind: "sec", w: 186 },
      { id: "mon", x: 800, y: 300, label: "Monitoring", sub: "Prometheus, Grafana, CloudWatch", kind: "k8s", w: 210 }
    ],
    edges: [
      { from: "dev", to: "ci" },
      { from: "ci", to: "app", label: "deploy" },
      { from: "app", to: "db" },
      { from: "users", to: "edge" },
      { from: "edge", to: "app", label: "HTTPS" },
      { from: "app", to: "mon", label: "metrics, logs", dashed: true }
    ]
  };
}

window.PROJECTS = [
  {
    id: "eks-gitops",
    category: "personal",
    title: "E-commerce platform on Amazon EKS with GitOps",
    short: "Terraform-built EKS cluster running an open-source shop, deployed entirely from Git with Argo CD.",
    summary: "An end-to-end deployment of the open-source Vendure e-commerce stack (Node.js API and Angular storefront) on AWS. The network and cluster are Terraform code, every deployment comes from Git through Argo CD, secrets are stored only in encrypted form, and new container images roll out automatically.",
    year: "2026",
    role: "Solo project: infrastructure, CI/CD, GitOps",
    status: "Built and tested",
    notice: "The EKS cluster is shut down between demos to save cost, so the live links may be offline.",
    tags: ["Terraform", "Amazon EKS", "EC2", "VPC", "ECR", "GitHub Actions", "Argo CD", "Kubernetes", "ingress-nginx", "cert-manager", "Sealed Secrets", "MySQL"],
    links: [
      { label: "Storefront", url: "https://sf.prasanth.space" },
      { label: "Admin dashboard", url: "https://api.prasanth.space/dashboard" },
      { label: "Argo CD", url: "https://argocd.prasanth.space" }
    ],
    highlights: [
      "Multi-AZ VPC and EKS cluster with a managed EC2 node group, built in two Terraform layers (network and cluster).",
      "GitHub Actions builds the API and storefront images and pushes them to Amazon ECR.",
      "Argo CD deploys every service from one manifest repository with automated sync, self-healing and pruning.",
      "Credentials are kept in GitHub Secrets and committed only as Sealed Secrets, re-sealed automatically for each cluster.",
      "One Network Load Balancer with host-based routing and Let's Encrypt certificates issued by cert-manager.",
      "Three-node MySQL Group Replication StatefulSet on encrypted gp3 EBS volumes.",
      "A CronJob authorised through EKS Pod Identity rolls out new images within a minute of reaching ECR."
    ],
    overview: {
      title: "The whole system at a glance",
      caption: "Code and manifests flow down from Git; visitor traffic flows across the bottom.",
      height: 520,
      nodes: [
        { id: "dev", x: 110, y: 90, label: "Developer", sub: "git push", kind: "user" },
        { id: "gha", x: 330, y: 90, label: "GitHub Actions", sub: "build images", kind: "git" },
        { id: "ecr", x: 560, y: 90, label: "Amazon ECR", sub: "vendure-api, vendure-sf", kind: "aws", w: 176 },
        { id: "watch", x: 800, y: 90, label: "ecr-watcher", sub: "CronJob, every minute", kind: "k8s", w: 176 },
        { id: "gitops", x: 330, y: 255, label: "argocd repo", sub: "manifests, sealed secrets", kind: "git", w: 176 },
        { id: "argo", x: 560, y: 255, label: "Argo CD", sub: "auto-sync, self-heal", kind: "k8s" },
        { id: "eks", x: 800, y: 255, label: "Amazon EKS", sub: "3 × t3.large nodes", kind: "aws" },
        { id: "users", x: 110, y: 425, label: "Visitors", sub: "browser", kind: "user" },
        { id: "nlb", x: 330, y: 425, label: "NLB + ingress-nginx", sub: "TLS by cert-manager", kind: "k8s", w: 186 },
        { id: "apps", x: 560, y: 425, label: "API + storefront", sub: "namespace vendure-ns", kind: "k8s", w: 176 },
        { id: "mysql", x: 800, y: 425, label: "MySQL", sub: "Group Replication × 3", kind: "data", w: 176 }
      ],
      edges: [
        { from: "dev", to: "gha" },
        { from: "gha", to: "ecr", label: "push" },
        { from: "ecr", to: "watch" },
        { from: "watch", to: "eks", label: "rollout" },
        { from: "dev", to: "gitops", dashed: true },
        { from: "gitops", to: "argo" },
        { from: "argo", to: "eks", label: "sync" },
        { from: "users", to: "nlb" },
        { from: "nlb", to: "apps" },
        { from: "apps", to: "mysql" },
        { from: "eks", to: "apps", dashed: true }
      ]
    },
    repos: [
      {
        name: "terraform",
        url: "https://github.com/Prasanth1404/terraform",
        tagline: "AWS network and EKS cluster as code, in two independent layers.",
        inside: [
          "`aws-common/`: VPC `172.16.0.0/16`, Internet Gateway, 3 public and 3 private subnets, route tables, security groups.",
          "`aws-eks/`: EKS cluster (Auto Mode off), managed node group, IAM roles, add-ons, access entries.",
          "`aws-eks-ecr-watcher.tf`: IAM role plus Pod Identity association for the image watcher.",
          "The cluster layer finds the VPC through data sources matched by `Name` tag, so each layer has its own state."
        ],
        steps: [
          "`aws-common` creates the VPC, gateway and subnets across ap-south-1a, 1b and 1c.",
          "`aws-eks` looks up those subnets and creates the control plane in the public subnets.",
          "Networking add-ons install first, then the node group joins, then CoreDNS and the EBS CSI driver.",
          "Pod Identity gives in-cluster workloads short-lived AWS credentials, with no access keys."
        ],
        diagram: {
          title: "Two Terraform layers",
          height: 520,
          zones: [
            { x: 24, y: 30, w: 432, h: 470, label: "aws-common (network layer)" },
            { x: 488, y: 30, w: 448, h: 470, label: "aws-eks (cluster layer)" }
          ],
          nodes: [
            { id: "igw", x: 240, y: 110, label: "Internet Gateway", sub: "lwp-gw", kind: "aws" },
            { id: "vpc", x: 240, y: 240, label: "VPC 172.16.0.0/16", sub: "3 AZs, DNS hostnames on", kind: "aws", w: 186 },
            { id: "pub", x: 130, y: 400, label: "Public subnets × 3", sub: "public IP, ELB tag", kind: "aws", w: 178 },
            { id: "pri", x: 350, y: 400, label: "Private subnets × 3", sub: "reserved, no NAT", kind: "aws", w: 178 },
            { id: "data", x: 600, y: 110, label: "Data sources", sub: "find VPC by Name tag", kind: "git", w: 170 },
            { id: "iam", x: 830, y: 110, label: "IAM roles", sub: "cluster, node, EBS, watcher", kind: "sec", w: 178 },
            { id: "eks", x: 715, y: 240, label: "EKS control plane", sub: "v1.36, Auto Mode off", kind: "aws", w: 180 },
            { id: "ng", x: 600, y: 400, label: "Node group", sub: "t3.large × 3, AL2023", kind: "k8s", w: 170 },
            { id: "addons", x: 830, y: 400, label: "Add-ons", sub: "CNI, CoreDNS, EBS CSI", kind: "k8s", w: 178 }
          ],
          edges: [
            { from: "igw", to: "vpc" },
            { from: "vpc", to: "pub" },
            { from: "vpc", to: "pri", dashed: true },
            { from: "pub", to: "data", label: "looked up", dashed: true },
            { from: "data", to: "eks" },
            { from: "iam", to: "eks" },
            { from: "eks", to: "ng" },
            { from: "eks", to: "addons" },
            { from: "ng", to: "addons", dashed: true }
          ]
        }
      },
      {
        name: "argocd",
        url: "https://github.com/Prasanth1404/argocd",
        tagline: "GitOps repository: every Kubernetes object, plus the workflow that seals the secrets.",
        inside: [
          "`vendure-api/`, `vendure-sf/`: Deployments, Services and Ingresses for the API and storefront.",
          "`mysql-standalone/`: Group Replication StatefulSet, headless and primary Services, ConfigMap, StorageClass.",
          "`phpmyadmin/`: database admin UI, allow-listed by source IP at the ingress.",
          "`ecr-watcher/`: CronJob that compares the running image digest with ECR `latest`.",
          "`common/`: Let's Encrypt ClusterIssuer and the Argo CD ingress.",
          "`.github/workflows/sealed-secret.yaml`: fills secret templates and encrypts them with `kubeseal`."
        ],
        steps: [
          "Secret values live only in GitHub environment secrets.",
          "The workflow fills the templates and seals them with the cluster's public certificate.",
          "Argo CD syncs the manifests; the Sealed Secrets controller decrypts them inside the cluster.",
          "ingress-nginx routes each domain to its service through one Network Load Balancer, with certificates from cert-manager."
        ],
        diagram: {
          title: "GitOps and secrets flow",
          height: 520,
          nodes: [
            { id: "sec", x: 110, y: 90, label: "GitHub Secrets", sub: "env: vendure-app", kind: "sec" },
            { id: "wf", x: 330, y: 90, label: "Seal workflow", sub: "sed + kubeseal", kind: "git" },
            { id: "repo", x: 560, y: 90, label: "argocd repo", sub: "sealed-*.yaml only", kind: "git" },
            { id: "argo", x: 800, y: 90, label: "Argo CD", sub: "automated sync", kind: "k8s" },
            { id: "cert", x: 110, y: 255, label: "cert-manager", sub: "Let's Encrypt", kind: "sec" },
            { id: "ing", x: 330, y: 255, label: "ingress-nginx", sub: "one NLB, host rules", kind: "k8s" },
            { id: "watch", x: 560, y: 255, label: "ecr-watcher", sub: "digest check", kind: "k8s" },
            { id: "ctrl", x: 800, y: 255, label: "Sealed Secrets", sub: "controller decrypts", kind: "sec" },
            { id: "sf", x: 110, y: 425, label: "vendure-sf", sub: "sf.prasanth.space", kind: "k8s" },
            { id: "api", x: 330, y: 425, label: "vendure-api", sub: "api.prasanth.space", kind: "k8s" },
            { id: "db", x: 560, y: 425, label: "MySQL", sub: "vendure-mysql:3306", kind: "data" },
            { id: "pma", x: 800, y: 425, label: "phpMyAdmin", sub: "IP allow-listed", kind: "k8s" }
          ],
          edges: [
            { from: "sec", to: "wf" },
            { from: "wf", to: "repo", label: "commit" },
            { from: "repo", to: "argo" },
            { from: "argo", to: "ctrl" },
            { from: "ctrl", to: "api", label: "Secret", dashed: true },
            { from: "argo", to: "watch", dashed: true },
            { from: "cert", to: "ing", label: "TLS" },
            { from: "ing", to: "sf" },
            { from: "ing", to: "api" },
            { from: "ing", to: "pma" },
            { from: "watch", to: "api", dashed: true },
            { from: "api", to: "db" },
            { from: "pma", to: "db" }
          ]
        }
      },
      {
        name: "vendure-back-api",
        url: "https://github.com/Prasanth1404/vendure-back-api",
        tagline: "Vendure API container, environment-driven configuration and the build pipeline to ECR.",
        inside: [
          "Production Dockerfile: builds the server and admin dashboard, runs `node dist/index.js`.",
          "The same image runs the background worker with `node dist/index-worker.js`.",
          "Database, CORS origins, asset URL and email transport (dev mailbox or SMTP such as SES) come from environment variables.",
          "`.github/workflows/vendure-api.yml`: builds on every push and tags the image with the run number and `latest`."
        ],
        steps: [
          "A push to `master` starts GitHub Actions, which builds the image and pushes it to ECR.",
          "Within a minute, the ecr-watcher sees the new `latest` digest and restarts the Deployment.",
          "Pods read their settings from the decrypted `vendure-secrets` Secret.",
          "The API and worker talk to the MySQL primary through the `vendure-mysql` service."
        ],
        diagram: {
          title: "Build, deploy and run",
          height: 520,
          nodes: [
            { id: "dev", x: 110, y: 95, label: "Developer", sub: "push to master", kind: "user" },
            { id: "gha", x: 330, y: 95, label: "GitHub Actions", sub: "docker build", kind: "git" },
            { id: "ecr", x: 560, y: 95, label: "Amazon ECR", sub: ":run_number, :latest", kind: "aws" },
            { id: "watch", x: 800, y: 95, label: "ecr-watcher", sub: "new digest?", kind: "k8s" },
            { id: "secret", x: 330, y: 260, label: "vendure-secrets", sub: "env variables", kind: "sec" },
            { id: "worker", x: 560, y: 260, label: "Worker", sub: "emails, search index", kind: "k8s" },
            { id: "api", x: 800, y: 260, label: "API pods", sub: "rollout restart", kind: "k8s" },
            { id: "admin", x: 110, y: 425, label: "Admin user", sub: "/dashboard", kind: "user" },
            { id: "ing", x: 330, y: 425, label: "api.prasanth.space", sub: "ingress + TLS", kind: "k8s", w: 176 },
            { id: "db", x: 800, y: 425, label: "MySQL primary", sub: "vendure-mysql", kind: "data" }
          ],
          edges: [
            { from: "dev", to: "gha" },
            { from: "gha", to: "ecr", label: "push" },
            { from: "ecr", to: "watch" },
            { from: "watch", to: "api", label: "restart" },
            { from: "secret", to: "api", dashed: true },
            { from: "secret", to: "worker", dashed: true },
            { from: "admin", to: "ing" },
            { from: "ing", to: "api" },
            { from: "api", to: "db" },
            { from: "worker", to: "db" }
          ]
        }
      },
      {
        name: "vendure-front-sf",
        url: "https://github.com/Prasanth1404/vendure-front-sf",
        tagline: "Angular storefront container and its build pipeline to ECR.",
        inside: [
          "Dockerfile for the storefront image.",
          "`src/environments/` points the storefront at `https://api.prasanth.space` on port 443.",
          "`.github/workflows/vendure-sf.yml`: builds on every push and pushes to ECR with the run number and `latest`."
        ],
        steps: [
          "A push builds the storefront image and the ecr-watcher rolls it out, the same way as the API.",
          "Shoppers reach `sf.prasanth.space` through the shared Network Load Balancer and ingress-nginx.",
          "The browser calls the Shop API at `api.prasanth.space`, allowed by the API's CORS list.",
          "Product images load from the API's asset server at `/assets`."
        ],
        diagram: {
          title: "Storefront delivery and requests",
          height: 520,
          nodes: [
            { id: "dev", x: 110, y: 95, label: "Developer", sub: "push to master", kind: "user" },
            { id: "gha", x: 330, y: 95, label: "GitHub Actions", sub: "docker build", kind: "git" },
            { id: "ecr", x: 560, y: 95, label: "Amazon ECR", sub: "vendure-sf", kind: "aws" },
            { id: "watch", x: 800, y: 95, label: "ecr-watcher", sub: "new digest?", kind: "k8s" },
            { id: "shopper", x: 110, y: 270, label: "Shopper", sub: "sf.prasanth.space", kind: "user" },
            { id: "nlb", x: 330, y: 270, label: "NLB + ingress-nginx", sub: "host routing, TLS", kind: "k8s", w: 186 },
            { id: "sf", x: 560, y: 270, label: "Storefront pods", sub: "Angular, 2 replicas", kind: "k8s", w: 172 },
            { id: "api", x: 560, y: 435, label: "Shop API", sub: "/shop-api, CORS", kind: "k8s" },
            { id: "assets", x: 800, y: 435, label: "Product images", sub: "/assets", kind: "data" }
          ],
          edges: [
            { from: "dev", to: "gha" },
            { from: "gha", to: "ecr", label: "push" },
            { from: "ecr", to: "watch" },
            { from: "watch", to: "sf", label: "rollout" },
            { from: "shopper", to: "nlb" },
            { from: "nlb", to: "sf" },
            { from: "sf", to: "api", label: "GraphQL" },
            { from: "api", to: "assets" }
          ]
        }
      }
    ],
    lessons: [
      { problem: "Nodes started but never joined the cluster.", fix: "They were in private subnets with no NAT Gateway, so they couldn't reach the EKS endpoint or ECR. Moved the node group to public subnets (production would add a NAT Gateway)." },
      { problem: "PVCs stayed Pending, so MySQL never started.", fix: "The StorageClass used the Auto Mode provisioner while the cluster ran the EBS CSI add-on. `provisioner` is immutable, so I deleted and recreated the StorageClass and the pending PVCs." },
      { problem: "MySQL pods in CrashLoopBackOff: `mysql.user` doesn't exist.", fix: "The EBS volume's `lost+found` folder broke the first initialisation, leaving a half-built data directory. Mounted the data with `subPath: mysql`, used `loose-` Group Replication options, and reinitialised." },
      { problem: "phpMyAdmin: Host is not allowed to connect (1130).", fix: "`MYSQL_ROOT_HOST` is read only on first start, and the first start used a wrong value. Created `root@'%'` inside the pod and fixed the GitHub secret for future clusters." },
      { problem: "No TLS certificate for the API, and no error anywhere.", fix: "The ingress annotation said `cluster.issuer` instead of `cluster-issuer`. Annotations aren't validated, so cert-manager silently ignored it." },
      { problem: "The storefront called `http://localhost:3000`.", fix: "The image ran the Angular dev server, which reads `environment.ts`, not `environment.prod.ts`. Pointed both at `https://api.prasanth.space`." }
    ],
    gallery: [
      { file: "argocd-applications.png", title: "Argo CD", text: "All applications synced and healthy." },
      { file: "storefront.png", title: "Storefront", text: "The shop running on sf.prasanth.space." },
      { file: "admin-dashboard.png", title: "Admin dashboard", text: "Vendure dashboard behind HTTPS." },
      { file: "github-actions.png", title: "GitHub Actions", text: "Image build and push to ECR." },
      { file: "phpmyadmin.png", title: "phpMyAdmin", text: "Database admin, IP allow-listed." },
      { file: "terraform-apply.png", title: "Terraform", text: "Cluster layer applied." },
      { file: "kubectl-pods.png", title: "Pods", text: "Workloads running in vendure-ns." }
    ]
  },

  {
    id: "portfolio-site",
    category: "personal",
    title: "This website: S3 and CloudFront with HTTPS",
    short: "A private S3 bucket served through CloudFront with a free certificate, deployed by GitHub Actions.",
    summary: "The site you're reading. Files sit in a private S3 bucket that only one CloudFront distribution can read. CloudFront serves them over HTTPS with an ACM certificate, and a GitHub Actions workflow uploads changes and clears the cache on every push.",
    year: "2026",
    role: "Solo project",
    status: "Live",
    tags: ["Amazon S3", "CloudFront", "ACM", "Origin Access Control", "IAM", "GitHub Actions", "DNS"],
    links: [
      { label: "prasanth.space", url: "https://prasanth.space" }
    ],
    highlights: [
      "S3 Block Public Access stays on; the bucket policy lets only this CloudFront distribution read files through Origin Access Control.",
      "Free ACM certificate for the root and www domains, validated through DNS records at Namecheap.",
      "HTTP redirects to HTTPS, responses are compressed and cached, and missing pages show a custom 404 page.",
      "The root domain uses a Namecheap ALIAS record, because a root domain can't be a CNAME.",
      "GitHub Actions deploys with an IAM user that can only write to this bucket and invalidate this distribution."
    ],
    overview: {
      title: "How a request reaches this page",
      caption: "Top row: a visitor's request. Bottom row: how updates are published.",
      height: 460,
      nodes: [
        { id: "v", x: 110, y: 110, label: "Visitor", sub: "https://prasanth.space", kind: "user", w: 176 },
        { id: "dns", x: 330, y: 110, label: "Namecheap DNS", sub: "ALIAS @, CNAME www", kind: "user", w: 176 },
        { id: "cf", x: 560, y: 110, label: "CloudFront", sub: "HTTPS, cache, 404 page", kind: "aws", w: 176 },
        { id: "s3", x: 800, y: 110, label: "S3 (private)", sub: "Block Public Access on", kind: "aws", w: 176 },
        { id: "acm", x: 560, y: 260, label: "ACM certificate", sub: "us-east-1, DNS validated", kind: "sec", w: 176 },
        { id: "oac", x: 800, y: 260, label: "Origin Access Control", sub: "policy: this CF only", kind: "sec", w: 186 },
        { id: "dev", x: 110, y: 390, label: "git push", sub: "site/ changed", kind: "user" },
        { id: "gha", x: 330, y: 390, label: "GitHub Actions", sub: "least-privilege IAM", kind: "git", w: 176 }
      ],
      edges: [
        { from: "v", to: "dns" },
        { from: "dns", to: "cf" },
        { from: "cf", to: "s3", label: "signed" },
        { from: "acm", to: "cf", dashed: true },
        { from: "oac", to: "s3", dashed: true },
        { from: "dev", to: "gha" },
        { from: "gha", to: "s3", label: "s3 sync" },
        { from: "gha", to: "cf", label: "invalidate", dashed: true }
      ]
    },
    repos: [
      {
        name: "portfolio",
        url: "https://github.com/Prasanth1404/portfolio",
        tagline: "Static HTML, CSS and JavaScript, plus the deploy workflow.",
        inside: [
          "`site/`: pages, styles, the interactive diagram script and this project data.",
          "`site/js/projects-data.js`: every project on this site is described here; adding one creates its page automatically.",
          "`.github/workflows/deploy.yml`: syncs `site/` to S3, then invalidates the CloudFront cache."
        ],
        steps: [
          "A push that changes `site/` starts the workflow.",
          "HTML uploads with `no-cache`, other files with a one-day cache.",
          "CloudFront's cache is cleared so visitors get the new version at once."
        ],
        diagram: null
      }
    ],
    lessons: [
      { problem: "403 AccessDenied on every file after the first automated deploy.", fix: "A private bucket answers 403, not 404, when a file is missing, so the error hides the real cause. I checked encryption, the bucket policy, Origin Access Control and the requested paths in turn until CloudFront asked for files that exist." },
      { problem: "The root domain couldn't point at CloudFront.", fix: "DNS doesn't allow a CNAME on a root domain. Used Namecheap's ALIAS record for `@` and a normal CNAME for `www`." }
    ],
    gallery: [
      { file: "cloudfront.png", title: "Live site", text: "prasanth.space served from S3 through CloudFront." },
      { file: "deploy-workflow.png", title: "Deploy workflow", text: "Sync to S3 and cache invalidation." }
    ]
  },

  /* ============================================================
     KLIOTECH PROJECTS (work at KlioTech LLP)
     Product descriptions are based on https://kliotech.com/our-work.
     Check every "highlights" line and change it to match exactly what you did.
     Keep internal details (servers, IPs, client data) out of this file.
     ============================================================ */
  {
    id: "smart-fds",
    category: "company",
    company: "KlioTech LLP",
    kind: "In-house product",
    title: "Smart FDS",
    short: "KlioTech's own SaaS platform for farms and dairies that deliver milk, produce and poultry to homes.",
    summary: "Smart FDS is KlioTech's in-house SaaS product. Farms and dairies use it to run home delivery end to end: taking orders and subscriptions, planning routes, tracking stock, collecting payments, and giving drivers a mobile app.",
    year: "2023 – present",
    role: "DevOps, as part of the KlioTech team",
    status: "Live product",
    notice: "Company product. This page describes the product and my role only; internal systems are not shown.",
    tags: ["AWS", "CI/CD", "Linux", "Nginx", "SSL automation", "Monitoring"],
    links: [ { label: "Product website", url: "https://farmdeliverysoftware.com/" } ],
    features: [
      "Route optimisation and delivery planning",
      "Subscriptions and recurring orders",
      "Customer portal for managing orders",
      "Real-time inventory tracking",
      "Payments and billing",
      "Mobile app for delivery drivers"
    ],
    highlights: [
      "Keep production and staging environments running and patched on AWS.",
      "Build and maintain Jenkins and GitHub Actions pipelines for releases without downtime.",
      "Automate SSL certificate issuance and renewal with Certbot and Let's Encrypt.",
      "Monitor health with Prometheus, Grafana and CloudWatch, and investigate incidents from logs.",
      "Run backups and restores, and manage IAM access with least privilege."
    ],
    overview: supportDiagram("Smart FDS"),
    repos: [], lessons: [], gallery: []
  },

  {
    id: "orchid-pos",
    category: "company",
    company: "KlioTech LLP",
    kind: "Client product",
    title: "Orchid POS",
    short: "A compliance-focused retail point-of-sale and eCommerce platform for firearm retailers in the US.",
    summary: "Orchid POS is a retail point-of-sale system built for firearm retailers, with eCommerce, compliance record-keeping and serialised inventory. It also handles transfers, trade-ins, work orders, special orders, layaways and multi-location stores with live distributor feeds.",
    year: "2023 – present",
    role: "DevOps, as part of the KlioTech team",
    status: "Live product",
    notice: "Client product. This page describes the product and my role only; internal systems are not shown.",
    tags: ["AWS", "CI/CD", "Linux", "HAProxy", "SSL automation", "Monitoring"],
    links: [ { label: "Product website", url: "https://orchidadvisors.com/gun-store-pos-software/" } ],
    features: [
      "Serialised inventory tracking",
      "Built-in compliance records and digital storage",
      "Dealer and private-party transfers",
      "Trade-ins and consignment",
      "Web store with live distributor feeds",
      "Work orders, special orders and layaways"
    ],
    highlights: [
      "Operate the AWS servers and services behind the platform at 99.9% uptime.",
      "Route traffic across frontend and backend servers with HAProxy and Nginx, with SSL on every endpoint.",
      "Ship releases through automated Jenkins and GitHub Actions pipelines.",
      "Monitor performance and errors, and coordinate fixes with the development team."
    ],
    overview: supportDiagram("Orchid POS"),
    repos: [], lessons: [], gallery: []
  },

  {
    id: "deal-memo-pro",
    category: "company",
    logoBackground: "#000000",   // the DMP logo is white on black, so the tile matches it
    company: "KlioTech LLP",
    kind: "Client product",
    title: "Deal Memo Pro",
    short: "A cloud system for modelling agencies to manage contracts, bookings, invoices and talent.",
    summary: "Deal Memo Pro is a cloud-based order and project management system for modelling agencies. It brings contracts, job bookings, invoicing and talent coordination into one place.",
    year: "2023 – present",
    role: "DevOps, as part of the KlioTech team",
    status: "Live product",
    notice: "Client product. This page describes the product and my role only; internal systems are not shown.",
    tags: ["AWS", "CI/CD", "Linux", "Nginx", "SSL automation", "Monitoring"],
    links: [],
    features: [
      "Digital contract management",
      "Talent booking and scheduling",
      "Automated invoicing and payments",
      "Client and project tracking"
    ],
    highlights: [
      "Maintain the application servers and their availability on AWS.",
      "Automate builds and deployments with CI/CD pipelines.",
      "Manage SSL certificates, DNS and reverse proxy configuration.",
      "Monitor the platform and respond to incidents."
    ],
    overview: supportDiagram("Deal Memo Pro"),
    repos: [], lessons: [], gallery: []
  },

  {
    id: "diveshop-360",
    category: "company",
    company: "KlioTech LLP",
    kind: "Client product, handed over",
    title: "DiveShop 360",
    short: "Point-of-sale and business software for dive shops, supported until the client took it in-house.",
    summary: "DiveShop 360 is point-of-sale and business management software for dive shops: retail, rentals, classes, certifications, trips and customer relationships in one platform, used by more than 1,000 dive shops. I supported it until the client moved it to their own team in December 2025.",
    year: "2023 – Dec 2025",
    role: "DevOps, as part of the KlioTech team",
    status: "Handed over to the client, December 2025",
    notice: "Client product, now run by the client's own team. This page describes the product and my role only.",
    tags: ["AWS", "CI/CD", "Linux", "SSL automation", "Monitoring", "Handover"],
    links: [ { label: "Product website", url: "https://diveshop360.com/" } ],
    features: [
      "Inventory for dive gear and equipment",
      "Student certification tracking with PADI and SSI",
      "Trip and travel bookings",
      "Equipment rental and servicing",
      "Customer relationship management",
      "Integrated eCommerce"
    ],
    highlights: [
      "Kept the platform's servers maintained, patched and monitored.",
      "Ran deployments, SSL renewals, backups and health checks.",
      "Supported the handover to the client's team in December 2025, including access transfer and documentation."
    ],
    overview: supportDiagram("DiveShop 360"),
    repos: [], lessons: [], gallery: []
  }
];
