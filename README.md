# Social Sports Landing Page

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on AWS Amplify

This project is configured for deployment on AWS Amplify. To deploy the application:

1. Push your code to your Git repository
2. Log in to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home)
3. Click "New app" → "Host web app"
4. Connect your repository and branch
5. Configure build settings with the following build commands:

```bash
# Build commands for Next.js on Amplify
npm ci
npm run build
```

6. Review and save your settings
7. Deploy the application

For more information, see the [AWS Amplify documentation for Next.js](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html).
