# Inventory Management System - Development Guide

## Overview

This is a comprehensive inventory management web application built with Next.js 14, TypeScript, and Tailwind CSS. The application provides a modern interface for managing inventory items and processing orders, integrated with the Springboot java backend REST API, you can find [here](https://github.com/michaelmccabe/Inventory-backend).


## Runng this locally in for development

If you go [here](https://github.com/michaelmccabe/Inventory-backend/tree/main/local-dev), you can follow instructions to run the backend locally.


### Run this Application locally


1. **Clone the repository**

```bash
git clone https://github.com/michaelmccabe/Inventory-frontend.git
cd inventory
```


2. **Install dependencies**

```bash
npm install
```


3. **Configure environment**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```


4. **Start the development server**

```bash
npm run dev
```


5. **Open your browser**

Navigate to <http://localhost:3000>

You can then simply run

```bash
npm run dev
```

to run this Frontend App and view the UI at  <http://localhost:3000>

## Project Structure

```
inventory/
├── app/                      # Next.js App Router pages
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with sidebar navigation
│   ├── page.tsx             # Home page
│   ├── api/                 # Next.js API routes (proxy to backend)
│   │   ├── items/
│   │   │   ├── route.ts     # GET all items, POST create item
│   │   │   └── [id]/
│   │   │       └── route.ts # GET, PUT, DELETE specific item
│   │   └── orders/
│   │       ├── route.ts     # GET all orders, POST create order
│   │       └── [id]/
│   │           ├── route.ts # GET order detail, PUT update order
│   │           └── purchase/
│   │               └── route.ts # POST purchase order
│   ├── items/
│   │   └── page.tsx         # Inventory items management page
│   └── orders/
│       └── page.tsx         # Orders management page
├── components/               # React components
│   └── Sidebar.tsx          # Navigation sidebar component
├── lib/                     # Utility libraries
│   └── api-client.ts        # API client service
├── types/                   # TypeScript type definitions
│   └── api.ts               # API types from OpenAPI spec
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore file
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Technology Stack

### Frontend Framework

* **Next.js 14**: React framework with App Router for server-side rendering and routing
* **React 18**: UI library for building component-based interfaces
* **TypeScript**: Strongly typed JavaScript for better development experience

### Styling

* **Tailwind CSS**: Utility-first CSS framework for rapid UI development
* **PostCSS**: CSS processing with Autoprefixer
* **Custom Color Palette**: Primary blue theme for consistent branding

### HTTP Client

* **Axios**: Promise-based HTTP client for API communication

### Icons

* **Lucide React**: Modern icon library for UI elements

## Features

### 1. Inventory Items Management (`/items`)

* **View All Items**: Display all inventory items in a responsive table
* **Add New Items**: Create new inventory items with name and quantity
* **Edit Items**: Update existing item details
* **Delete Items**: Remove items from inventory with confirmation
* **Real-time Updates**: Immediate UI updates after API operations
* **Error Handling**: User-friendly error messages

### 2. Orders Management (`/orders`)

* **Assemble Orders**: Add items from available inventory to build new orders
* **Backend Sync**: Fetch and display all orders from the backend API with live status badges
* **Detail View**: Select an order to review items, quantities, and delivery address in a dedicated panel
* **Edit Existing Orders**: Load SAVED orders back into the builder and update them via the API
* **Purchase Orders**: Process orders (virtual or real purchase) directly from the detail view
* **Order Status Tracking**: Visual indicators and actions adapt to the order’s current status (SAVED, PURCHASED, HELD)

### 3. Navigation

* **Sidebar Navigation**: Persistent side menu with active page highlighting
* **Responsive Design**: Mobile-friendly layout
* **Home Dashboard**: Overview page with quick access cards

## API Integration

The application integrates with a backend REST API defined by the OpenAPI specification at:
`https://raw.githubusercontent.com/michaelmccabe/Inventory/refs/heads/main/src/main/resources/openapi.yaml`

### Endpoints Used

#### Items API

* `GET /api/items` - Get all inventory items
* `GET /api/items/{id}` - Get a specific item by ID
* `POST /api/items` - Create a new item
* `PUT /api/items/{id}` - Update an existing item
* `DELETE /api/items/{id}` - Delete an item

#### Orders API

* `GET /api/orders` - Get all orders
* `GET /api/orders/{id}` - Get an order by ID
* `POST /api/orders` - Create a new order
* `PUT /api/orders/{id}` - Update an existing order
* `POST /api/orders/{id}/purchase` - Purchase an order (with virtual flag)

### Solving CORS Issues with API Routes

To avoid Cross-Origin Resource Sharing (CORS) issues when the frontend calls the backend API directly from the browser,, and to ensure extra security when backend calls are authenticated, this application uses **Next.js API Routes as a proxy layer**.

#### Architecture

```
Browser → Next.js API Routes (Server-Side) → Backend API (Server-Side)
```

#### Implementation

The application includes API route handlers in the `app/api/` directory that mirror the backend API structure

* `app/api/items/route.ts` - Proxies GET (all items) and POST (create item)
* `app/api/items/[id]/route.ts` - Proxies GET, PUT, DELETE for specific items
* `app/api/orders/route.ts` - Proxies GET (all orders) and POST (create order)
* `app/api/orders/[id]/route.ts` - Proxies GET (order detail) and PUT (update order)
* `app/api/orders/[id]/purchase/route.ts` - Proxies POST (purchase order)

Each route handler:



1. Receives requests from the browser
2. Forwards them to the backend API using server-side fetch
3. Returns the response back to the browser

#### Example Route Handler

```typescript
export async function GET() {
  const response = await fetch(`${API_BASE_URL}/api/items`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
```

#### Benefits

* **No CORS Issues**: Server-to-server communication bypasses browser CORS restrictions
* **Security**: Backend URL not exposed to client-side code
* **Flexibility**: Can add authentication, rate limiting, or caching in the proxy layer
* **Transparent**: Frontend code remains unchanged

### API Client Implementation

The `lib/api-client.ts` file provides a centralized API client using Axios:

```typescript
class ApiClient {
  private client: AxiosInstance;
  
  // Calls Next.js API routes (e.g., /api/items) instead of backend directly
  // All requests go through the proxy layer to avoid CORS
  // Methods for all API endpoints with proper TypeScript types
}
```

### Type Safety

All API types are defined in `types/api.ts` based on the [OpenAPI schema](https://raw.githubusercontent.com/michaelmccabe/Inventory/refs/heads/main/src/main/resources/openapi.yaml)

* `Item`: Inventory item with id, name, quantity
* `OrderItem`: Item reference with quantity for orders
* `OrderRequest`: Request payload for creating/updating orders
* `OrderStatus`: Enum for order statuses (SAVED, PURCHASED, HELD)
* `Order`: Complete order with status and items

## Configuration

### Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

This configures the backend API URL. The default is `http://localhost:8080`.

### Next.js Configuration

* **React Strict Mode**: Enabled for better development practices
* **Environment Variables**: API base URL injected at build time

### TypeScript Configuration

* **Strict Mode**: Enabled for maximum type safety
* **Path Aliases**: `@/*` maps to project root for clean imports
* **Module Resolution**: Bundler mode for Next.js compatibility

## Getting Started

### Prerequisites

* Node.js 18+ installed
* Backend API running on `http://localhost:8080` (or configured URL)

### Installation



1. **Install Dependencies**

```bash
npm install
```

This installs all required packages including Next.js, React, TypeScript, Tailwind CSS, and other dependencies.


2\. **Configure Environment**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` to set your backend API URL if different from default.


3\. **Run Development Server**

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Available Scripts

* `npm run dev` - Start development server with hot reload
* `npm run build` - Build production-optimized bundle
* `npm start` - Start production server (after build)
* `npm run lint` - Run ESLint for code quality checks

## Design Decisions

### 1. App Router Architecture

* Used Next.js 14 App Router instead of Pages Router for better performance and modern patterns
* Server Components by default with Client Components (`'use client'`) for interactive features

### 2. Component Organization

* **Page Components**: Located in `app/` directory following App Router conventions
* **Shared Components**: Located in `components/` directory for reusability
* **Utility Functions**: Located in `lib/` for business logic separation

### 3. State Management

* React Hooks (`useState`, `useEffect`) for local component state
* No global state management library needed due to API-driven architecture
* Each page manages its own state independently

### 4. Styling Approach

* Tailwind CSS utility classes for rapid development
* Custom color palette in `tailwind.config.ts` for brand consistency
* No CSS modules - all styling inline with components for better co-location

### 5. Error Handling

* Try-catch blocks for all API calls
* User-friendly error messages displayed in UI
* Console logging for debugging purposes
* Loading states for async operations

### 6. User Experience

* Modal dialogs for item creation/editing to avoid page navigation
* Confirmation dialogs for destructive actions (delete)
* Success messages with auto-dismiss
* Loading indicators during API calls
* Disabled buttons during processing to prevent duplicate submissions

## UI Components

### Sidebar Navigation

* Fixed width (256px) sidebar with app branding
* Active route highlighting with primary color
* Icons from Lucide React for visual clarity
* Responsive design considerations

### Items Table

* Responsive table layout with hover effects
* Action buttons (Edit, Delete) inline with each row
* Empty state messaging when no items exist
* Loading spinner during data fetch

### Item Modal Form

* Overlay modal for add/edit operations
* Form validation with required fields
* Number input with min value for quantity
* Cancel and Submit buttons with proper labeling

### Order Assembly Interface

* Grid layout for available items
* Dynamic order item list with quantity controls
* Textarea for delivery address
* Visual distinction between order states

### Order Display

* Card-based layout for saved orders
* Status badges with color coding
* Expandable item lists
* Action buttons based on order status

## API Error Handling

The application handles various error scenarios:



1. **Backend Not Running**: Shows user-friendly message to check backend
2. **Network Errors**: Generic error message with console logging
3. **Validation Errors**: Form-level validation before API calls
4. **404 Errors**: Handle missing resources gracefully

## Future Enhancements

Potential improvements for the application:



 1. **Authentication & Authorization**: User login and role-based access
 2. **Search & Filtering**: Search items and orders by various criteria
 3. **Pagination**: Handle large datasets efficiently
 4. **Real-time Updates**: WebSocket integration for live updates
 5. **Export Functionality**: Export orders and inventory to CSV/PDF
 6. **Analytics Dashboard**: Charts and graphs for inventory insights
 7. **Notification System**: Alerts for low stock, order status changes
 8. **Multi-language Support**: Internationalization (i18n)
 9. **Dark Mode**: Theme toggle for user preference
10. **Audit Logs**: Track changes to inventory and orders

## Development Workflow

### Adding New Features



1. **Define Types**: Add TypeScript interfaces in `types/api.ts`
2. **Create API Methods**: Add methods to `lib/api-client.ts`
3. **Build UI Components**: Create components in `components/`
4. **Create Pages**: Add pages to `app/` directory
5. **Test Integration**: Verify API communication and error handling

### Code Quality

* TypeScript strict mode enforces type safety
* ESLint with Next.js configuration for code standards
* Consistent naming conventions (camelCase for variables, PascalCase for components)
* Comments for complex logic

## Troubleshooting

### Common Issues



1. **"Cannot find module 'next'"**
   * Solution: Run `npm install` to install dependencies
2. **API Connection Failed**
   * Check if backend is running
   * Verify `.env.local` has correct API URL
   * Check for CORS issues in backend configuration
3. **Build Errors**
   * Clear `.next` directory: `rm -rf .next`
   * Reinstall dependencies: `rm -rf node_modules && npm install`
4. **TypeScript Errors**
   * Ensure all types are properly imported
   * Check `tsconfig.json` configuration
   * Run `npm run lint` to identify issues

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Deployment Platforms

The application can be deployed to:

* **Vercel**: Optimized for Next.js (recommended)
* **Netlify**: With Next.js plugin
* **AWS**: Using Amplify or EC2 with Node.js
* **Docker**: Containerized deployment

### Environment Configuration

Set production environment variables on your deployment platform:

```
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

## Contributing

When contributing to this project:



1. Follow existing code structure and naming conventions
2. Add TypeScript types for all new code
3. Update this guide when adding significant features
4. Test API integration thoroughly
5. Ensure responsive design works on mobile devices

## License

This project is part of the Inventory Management system.

## Contact & Support

For issues or questions about the application

* Review the GitHub repository: https://github.com/michaelmccabe/Inventory-frontend
* Check API documentation in the OpenAPI spec
* Review Next.js documentation: https://nextjs.org/docs


**Last Updated**: November 7, 2025
**Version**: 1.0.0
**Built with**: Next.js 14, TypeScript, Tailwind CSS