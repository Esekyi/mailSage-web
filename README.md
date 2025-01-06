# ![mailSage](public/navbarLogo-dark.svg) Mailsage web Dashboard

A modern web dashboard for managing email configurations and monitoring email delivery services. Built with Next.js 14, TypeScript, and Tailwind CSS. 

## Overview

Mailsage Dashboard provides a centralized interface for:

- Managing SMTP configurations
- Monitoring email delivery status
- Testing email configurations
- Viewing analytics and usage statistics
- Managing API keys and access

## Features

### SMTP Management

- Create and manage multiple SMTP configurations
- Test SMTP connections and send test emails
- Set default SMTP servers
- Monitor daily usage and limits
- View delivery statistics and failure rates

### Dashboard Features

- Real-time status monitoring
- Usage analytics and graphs
- Activity logs and audit trails
- User management and permissions
- API key management

### Security

- JWT authentication
- Role-based access control
- Secure credential storage
- Activity logging and monitoring
- Session management

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod
- **Authentication**: JWT + NextAuth.js
- **API Integration**: Axios
- **Charts**: Recharts
- **Icons**: Lucide Icons

## Project Structure

```
src/
├── app/ # Next.js app router pages
├── components/ # Reusable React components
│ ├── ui/ # Base UI components
│ ├── smtp/ # SMTP related components
│ └── dashboard/ # Dashboard specific components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and services
├── styles/ # Global styles and Tailwind config
└── types/ # TypeScript type definitions
```

## Documentation - to be hosted on docs.mailsage.io

Detailed documentation for each feature:

- [SMTP Configuration](docs/smtp-config.md)
- [API Integration](docs/api-integration.md)
- [Authentication](docs/auth.md)
- [Component Library](docs/components.md)

## Testing

- Unit tests with Jest and React Testing Library
- Integration tests for API endpoints
- E2E tests with Cypress
- Component testing with Storybook

## Performance

- Server-side rendering for initial page loads
- Static page generation where possible
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Caching strategies for API responses

## Error Handling

- Global error boundary
- Form validation with detailed feedback
- API error handling with retry mechanisms
- Friendly error messages for users
- Logging and monitoring integration

## Security Considerations

- CSRF protection
- XSS prevention
- Secure credential handling
- Rate limiting
- Input sanitization

## Future Improvements

- [ ] Enhanced analytics dashboard
- [ ] Multi-factor authentication
- [ ] Webhook integrations
- [ ] Custom SMTP templates
- [ ] Advanced monitoring features

## AUTHORS and MAINTAINERS
- [Emmanuel Sekyi](https://github.com/Esekyi)

## Support

For internal support and questions:

- Slack: #mailsage-support
- Email: <support@mailsage.io>
