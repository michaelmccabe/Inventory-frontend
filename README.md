# Inventory Management System

A modern, full-stack inventory management application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📦 **Inventory Management**: Add, edit, delete, and view inventory items
- 🛒 **Order Processing**: Build new orders, fetch existing ones from the backend, edit them, and complete purchases
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- 🔒 **Type-Safe**: Built with TypeScript for reliability
- 🚀 **Fast**: Powered by Next.js 14 with App Router

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Backend API running (see [Inventory Backend](https://github.com/michaelmccabe/Inventory-frontend))

### Installation

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

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
inventory/
├── app/                    # Next.js App Router pages
│   ├── items/             # Inventory items page
│   └── orders/            # Orders page
├── components/            # React components
├── lib/                   # Utilities and API client
├── types/                 # TypeScript type definitions
└── DEVELOPMENT_GUIDE.md   # Comprehensive development guide
```

## Documentation

For detailed information about the project architecture, API integration, and development workflow, see the [Development Guide](./DEVELOPMENT_GUIDE.md).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Screenshots

### Inventory Items Management
Manage your inventory with an intuitive table interface featuring add, edit, and delete functionality.

### Orders Processing
Create and process orders by selecting items, setting quantities, and specifying delivery addresses.

## Backend API

This application requires the Inventory Backend API. See the [OpenAPI specification](https://raw.githubusercontent.com/michaelmccabe/Inventory/refs/heads/main/src/main/resources/openapi.yaml) for details.

## Contributing

Contributions are welcome! Please see the [Development Guide](./DEVELOPMENT_GUIDE.md) for guidelines.

## License

This project is part of the Inventory Management system.

## Support

For issues or questions:
- Check the [Development Guide](./DEVELOPMENT_GUIDE.md)
- Review the [Backend Repository](https://github.com/michaelmccabe/Inventory-frontend)

---

Built with ❤️ using Next.js and TypeScript
