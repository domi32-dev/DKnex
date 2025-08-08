# Security Policy

## Supported Versions

We currently support security updates on the `main` branch.

## Reporting a Vulnerability

- Please email security reports to `domi.kinzel@gmail.com` with the subject "DkNex Security".
- Include a detailed description, reproduction steps, and potential impact.
- We aim to acknowledge reports within 72 hours and provide a remediation plan within 14 days.

## Disclosure Policy

- Please do not create public issues for security vulnerabilities.
- We will coordinate a responsible disclosure timeline and credit you upon request.

## Best Practices for Deployers

- Set strong secrets: `NEXTAUTH_SECRET`, database credentials, email credentials.
- Enable HTTPS and HSTS (middleware sets HSTS by default).
- Use a persistent rate-limiter (e.g., Redis) in production.
- Keep dependencies up to date and run `npm run lint` and tests in CI.


