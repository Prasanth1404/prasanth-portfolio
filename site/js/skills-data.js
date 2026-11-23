/*
  SKILLS DATA
  icon: a Simple Icons slug (https://simpleicons.org), shown in brand colour.
  generic: a Lucide icon name (https://lucide.dev) for general concepts such as DNS or TLS.
  No icon? The tile shows short letters instead (set "short").
  To use your own logo file, put it in images/skills/<file> and set file: "<file>".
  For AWS and Azure services, download the official icon packs and save the SVGs here:
    AWS:   https://aws.amazon.com/architecture/icons/
    Azure: https://learn.microsoft.com/azure/architecture/icons/
  top: true → also shown in the strip on the home page.
*/
window.SKILLS = [
  {
    group: "AWS",
    tone: "aws",
    items: [
      { name: "Amazon EC2", short: "EC2", file: "aws-ec2.svg", top: true },
      { name: "Amazon VPC", short: "VPC", file: "aws-vpc.svg" },
      { name: "Amazon S3", short: "S3", file: "aws-s3.svg" },
      { name: "Amazon RDS", short: "RDS", file: "aws-rds.svg" },
      { name: "AWS IAM", short: "IAM", file: "aws-iam.svg" },
      { name: "AWS Lambda", short: "λ", file: "aws-lambda.svg" },
      { name: "Amazon EKS", short: "EKS", file: "aws-eks.svg", top: true },
      { name: "Amazon ECS Fargate", short: "ECS", file: "aws-ecs.svg" },
      { name: "Amazon ECR", short: "ECR", file: "aws-ecr.svg" },
      { name: "Application Load Balancer", short: "ALB", file: "aws-elb.svg" },
      { name: "Route 53", short: "R53", file: "aws-route53.svg" },
      { name: "CloudFront", short: "CF", file: "aws-cloudfront.svg" },
      { name: "CloudWatch", short: "CW", file: "aws-cloudwatch.svg" },
      { name: "CloudTrail", short: "CT", file: "aws-cloudtrail.svg" },
      { name: "SNS", short: "SNS", file: "aws-sns.svg" },
      { name: "SES", short: "SES", file: "aws-ses.svg" },
      { name: "Secrets Manager", short: "SM", file: "aws-secrets-manager.svg" },
      { name: "Certificate Manager", short: "ACM", file: "aws-acm.svg" },
      { name: "CodeDeploy", short: "CD", file: "aws-codedeploy.svg" },
      { name: "Billing and Cost", short: "$", file: "aws-billing.svg" }
    ]
  },
  {
    group: "Azure",
    tone: "azure",
    items: [
      { name: "Virtual Machines", short: "VM", file: "azure-vm.svg" },
      { name: "VM Scale Sets", short: "VMSS", file: "azure-vmss.svg" },
      { name: "Virtual Network", short: "VNet", file: "azure-vnet.svg" },
      { name: "Blob Storage", short: "Blob", file: "azure-blob.svg" },
      { name: "Application Gateway", short: "AGW", file: "azure-app-gateway.svg" },
      { name: "Front Door", short: "AFD", file: "azure-front-door.svg" },
      { name: "Traffic Manager", short: "TM", file: "azure-traffic-manager.svg" },
      { name: "Azure DNS", short: "DNS", file: "azure-dns.svg" },
      { name: "Azure WAF", short: "WAF", file: "azure-waf.svg" },
      { name: "Azure Monitor", short: "MON", file: "azure-monitor.svg" },
      { name: "Microsoft Entra ID", short: "ID", file: "azure-entra.svg" },
      { name: "Azure SQL Database", short: "SQL", file: "azure-sql.svg" },
      { name: "Communication Services", short: "ACS", file: "azure-acs.svg" }
    ]
  },
  {
    group: "CI/CD and GitOps",
    tone: "git",
    items: [
      { name: "Jenkins", icon: "jenkins", top: true },
      { name: "GitHub Actions", icon: "githubactions", top: true },
      { name: "Argo CD", icon: "argo", top: true },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "AWS CodeDeploy", short: "CD", file: "aws-codedeploy.svg" }
    ]
  },
  {
    group: "Infrastructure as code",
    tone: "git",
    items: [
      { name: "Terraform", icon: "terraform", top: true }
    ]
  },
  {
    group: "Containers and Kubernetes",
    tone: "k8s",
    items: [
      { name: "Docker", icon: "docker", top: true },
      { name: "Docker Compose", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes", top: true },
      { name: "Helm", icon: "helm" },
      { name: "ingress-nginx", icon: "nginx" },
      { name: "cert-manager", short: "CM", file: "cert-manager.svg" },
      { name: "Sealed Secrets", short: "SS", file: "sealed-secrets.svg" }
    ]
  },
  {
    group: "Monitoring and logging",
    tone: "data",
    items: [
      { name: "Prometheus", icon: "prometheus", top: true },
      { name: "Grafana", icon: "grafana", top: true },
      { name: "ELK Stack", icon: "elasticstack" },
      { name: "EFK Stack", icon: "fluentd" },
      { name: "CloudWatch", short: "CW", file: "aws-cloudwatch.svg" },
      { name: "Azure Monitor", short: "MON", file: "azure-monitor.svg" },
      { name: "Sentry", icon: "sentry" },
      { name: "StatusCake", short: "SC", file: "statuscake.webp" }
    ]
  },
  {
    group: "Operating systems and web servers",
    tone: "user",
    items: [
      { name: "Linux", icon: "linux", top: true },
      { name: "Ubuntu", icon: "ubuntu" },
      { name: "Windows Server", short: "WS", file: "windows-server.webp" },
      { name: "Nginx", icon: "nginx", top: true },
      { name: "Apache", icon: "apache" },
      { name: "HAProxy", short: "HA", file: "haproxy.svg" },
      { name: "OpenLiteSpeed", short: "OLS", file: "openlitespeed.png" },
      { name: "PM2", icon: "pm2" }
    ]
  },
  {
    group: "Networking and security",
    tone: "sec",
    items: [
      { name: "TCP/IP", short: "IP", generic: "network" },
      { name: "DNS", short: "DNS", generic: "globe" },
      { name: "SSL/TLS", short: "TLS", generic: "lock" },
      { name: "Let's Encrypt", icon: "letsencrypt" },
      { name: "Certbot", icon: "letsencrypt" },
      { name: "OpenVPN", icon: "openvpn" },
      { name: "AWS Client VPN", short: "VPN", file: "aws-client-vpn.svg" },
      { name: "WAF", short: "WAF", generic: "shield-check" },
      { name: "Backup and DR", short: "DR", generic: "database-backup" },
      { name: "Aikido Security", short: "AK", file: "aikido.svg" }
    ]
  },
  {
    group: "Databases and middleware",
    tone: "data",
    items: [
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "RabbitMQ", icon: "rabbitmq" },
      { name: "Apache Solr", icon: "apachesolr" },
      { name: "JasperReports", short: "JR", file: "jasperreports.png" }
    ]
  },
  {
    group: "Scripting",
    tone: "git",
    items: [
      { name: "Bash", icon: "gnubash", top: true },
      { name: "Python", icon: "python", top: true }
    ]
  },
  {
    group: "Collaboration",
    tone: "user",
    items: [
      { name: "Jira", icon: "jira" },
      { name: "Agile and Scrum", short: "AG", generic: "kanban" },
      { name: "OpenAI", short: "AI", file: "openai.svg" }
    ]
  }
];
