# prasanth.space

Source for my portfolio site, [prasanth.space](https://prasanth.space).

## How it's served

```
Visitor ──HTTPS──► CloudFront (ACM certificate, caching) ──► S3 bucket (private)
                                                                  ▲
                                         GitHub Actions uploads site/ on every push
```

| Part | Purpose |
|---|---|
| **Amazon S3** | Stores the HTML and images. Private: public access is blocked. |
| **CloudFront** | Serves the site over HTTPS from edge locations and reads S3 through Origin Access Control. |
| **ACM** | Free TLS certificate for `prasanth.space` and `www.prasanth.space`. |
| **GitHub Actions** | Syncs `site/` to S3 and clears the CloudFront cache on every push to `master`. |

The S3 bucket, CloudFront distribution and certificate are built with Terraform in the [terraform](https://github.com/Prasanth1404/terraform) repository (`aws-portfolio/`).

## Repository layout

```
.
├── site/
│   ├── index.html
│   ├── 404.html
│   ├── favicon.svg
│   ├── eks-architecture.svg
│   └── vpc-architecture.svg
└── .github/workflows/deploy.yml
```

## Cost

A small static site stays within the S3 and CloudFront free usage, so it costs a few cents a month at most.
