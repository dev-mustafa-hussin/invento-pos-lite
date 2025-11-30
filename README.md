# ShopFlow POS - Point of Sale & Inventory Management

A modern, responsive web application for managing products, sales, and inventory for retail stores.

## Features

- **Dashboard**: Real-time overview of sales metrics, low-stock alerts, and recent transactions
- **Product Management**: Complete CRUD operations for products with search and filtering
- **Point of Sale**: Interactive sales interface with cart management and discount support
- **Invoice History**: View and search all sales transactions
- **Daily Reports**: Analytics with top-selling products and export functionality
- **Settings**: Configure store information and system preferences

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn UI** for components
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for build tooling

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── DataTable.tsx   # Generic data table component
│   ├── StatCard.tsx    # Dashboard statistics card
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── TopBar.tsx      # Top navigation bar
│   └── ProductFormDialog.tsx  # Product create/edit form
├── layouts/
│   └── AppLayout.tsx   # Main application layout
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Products.tsx    # Product management
│   ├── Sales.tsx       # POS interface
│   ├── Invoices.tsx    # Sales history
│   ├── Reports.tsx     # Analytics and reports
│   └── Settings.tsx    # Application settings
├── services/
│   └── mockDataService.ts  # Mock API layer (TODO: Replace with real API)
├── types/
│   └── index.ts        # TypeScript interfaces
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm))

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Backend Integration (TODO)

The application currently uses in-memory mock data. To connect to your ASP.NET Core + PostgreSQL backend:

### 1. Update API Configuration

In `src/services/mockDataService.ts`, update the `API_BASE_URL`:

```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

### 2. Replace Mock Functions with Real API Calls

Example for products:

```typescript
// Before (Mock)
getAll: async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...products]), 100);
  });
}

// After (Real API)
getAll: async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}
```

### 3. API Endpoints to Implement

Your ASP.NET Core backend should provide these endpoints:

**Products:**
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/low-stock` - Get low stock products

**Sales:**
- `GET /api/sales` - Get all sales
- `GET /api/sales/{id}` - Get sale by ID
- `POST /api/sales` - Create new sale
- `GET /api/sales/today` - Get today's sales
- `GET /api/sales/date-range?start={date}&end={date}` - Get sales by date range

**Reports:**
- `GET /api/reports/daily?date={date}` - Get daily report
- `GET /api/reports/export/pdf?date={date}` - Export report as PDF
- `GET /api/reports/export/excel?date={date}` - Export report as Excel

**Dashboard:**
- `GET /api/dashboard/stats` - Get dashboard statistics

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Design System

The application uses a professional blue color scheme with semantic tokens defined in `src/index.css` and `tailwind.config.ts`. All colors use HSL format for consistency.

**Key colors:**
- Primary: Professional blue (`221 83% 53%`)
- Success: Green for positive metrics
- Warning: Amber for alerts
- Destructive: Red for errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.
