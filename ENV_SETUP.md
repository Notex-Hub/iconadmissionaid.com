# Environment Setup Guide

## Backend API Configuration

All backend URLs have been consolidated into environment variables for easier configuration across different environments.

### Setup Instructions

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment:**
   - For **development**: The `.env.local` file is already set to use `http://localhost:5000/api/v1`
   - For **production/staging**: Update the `NEXT_PUBLIC_API_BASE_URL` value in `.env.local`

### Environment Variables

| Variable                   | Description          | Default Value                                |
| -------------------------- | -------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api/v1` (development) |

### Examples

**Development (Local Backend):**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

**Staging:**

```env
NEXT_PUBLIC_API_BASE_URL=https://sandbox.iconadmissionaid.com/api/v1
```

**Production:**

```env
NEXT_PUBLIC_API_BASE_URL=https://api.iconadmissionaid.com/api/v1
```

### Files Updated

The following files have been updated to use the environment variable:

- `utils/axios.ts` - Main axios instance configuration
- `utils/urlBuilder.ts` - URL building utilities
- `app/admin/result/all-result/page.tsx`
- `app/admin/delivery-charge/all-delivery-charge/page.tsx`
- `app/admin/test/all-test/page.tsx`
- `app/admin/model-test/**/*.tsx` - All model test related pages
- And all other admin pages

### Important Notes

1. **Environment variables must start with `NEXT_PUBLIC_`** to be accessible in client-side code
2. **Restart the development server** after changing `.env.local` file
3. **Never commit `.env.local`** to version control (it's already in `.gitignore`)
4. **Use `.env.example`** as a template for team members

### Fallback Behavior

If the environment variable is not set, the application will fall back to:

```
https://sandbox.iconadmissionaid.com/api/v1
```

This ensures the application works even if the `.env.local` file is missing.
