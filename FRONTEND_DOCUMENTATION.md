# Higgs Workspace - Frontend Documentation

### Key Features
- **Multi-role Authentication**: User and admin login systems
- **Dashboard Management**: User and admin dashboards
- **Room Booking System**: Book and manage meeting rooms
- **Event Management**: Create, view, and manage events
- **User Management**: Admin tools for user administration
- **Organization Management**: Multi-organization support
- **Support Ticket System**: User support and admin ticket management
- **PWA Support**: Progressive Web App capabilities
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data synchronization

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (members)/         # Member routes (grouped)
│   │   └── dashboard/     # Member dashboard
│   ├── admin/             # Admin routes
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── login/         # Admin login
│   │   └── forgot-password/ # Admin password reset
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   │   ├── admin/         # Admin-specific components
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Shared components
│   │   ├── events/        # Event management components
│   │   ├── rooms/         # Room management components
│   │   ├── bookings/      # Booking components
│   │   ├── tickets/       # Support ticket components
│   │   ├── members/       # Member management components
│   │   ├── orgs/          # Organization components
│   │   ├── plans/         # Subscription plan components
│   │   ├── profile/       # User profile components
│   │   ├── room-types/    # Room type components
│   │   ├── search/        # Search functionality
│   │   └── member-book/   # Member directory
│   ├── contexts/          # React Context providers
│   ├── lib/               # Utility libraries
│   ├── events/            # Event pages
│   ├── login/             # User login
│   ├── signup/            # User registration
│   ├── forgot-password/   # Password reset
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── dockerfile             # Docker configuration
└── package.json           # Dependencies and scripts
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=https://api.higgs.in

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# ImageKit Configuration (for image uploads)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# PWA Configuration
NEXT_PUBLIC_PWA_NAME=Higgs Workspace
NEXT_PUBLIC_PWA_DESCRIPTION=Workspace management system

# Development
NODE_ENV=development
ANALYZE=false
```

## Architecture & Components

### Application Architecture

The application follows a **component-based architecture** with clear separation of concerns:

- **Pages**: Route-based components using Next.js App Router
- **Components**: Reusable UI components organized by feature
- **Contexts**: Global state management using React Context
- **Lib**: Utility functions and API clients
- **Styles**: CSS Modules for component-scoped styling

### Core Components

#### Authentication Components
- `LoginForm`: User and admin login forms
- `SignupForm`: User registration
- `ForgotPasswordForm`: Password reset
- `SignOutButton`: Logout functionality

#### Dashboard Components
- `UserDashboard`: Member workspace overview
- `AdminDashboard`: Administrative overview
- `DashboardStats`: Key metrics display

#### Room Management
- `RoomList`: Display available rooms
- `RoomCard`: Individual room information
- `RoomTypeManager`: Admin room type management
- `RoomAvailability`: Real-time availability checker

#### Event Management
- `EventList`: Display events
- `EventCard`: Individual event information
- `EventRegistrationManager`: Event registration handling
- `GuestRegistrationForm`: Guest event registration

#### Booking System
- `BookingForm`: Create new bookings
- `BookingList`: User booking history
- `BookingCalendar`: Visual booking interface
- `InviteGuests`: Guest invitation system

#### User Management
- `UserList`: Admin user overview
- `UserProfile`: User profile management
- `MemberBook`: User directory
- `OrganizationManager`: Org management

#### Support System
- `TicketList`: Support ticket overview
- `TicketForm`: Create new tickets
- `TicketDetails`: Ticket information and updates

## Authentication & Authorization

### Authentication Flow

1. **User Login**: Email/password authentication
2. **Admin Login**: Separate admin authentication system
3. **JWT Tokens**: Access and refresh token management
4. **Session Management**: React Context for session state
5. **Route Protection**: Middleware-based route guards

### Authorization Levels

```typescript
enum USER_ROLES {
  INDIVIDUAL_USER = 'INDIVIDUAL_USER',
  ORG_USER = 'ORG_USER',
  ORG_ADMIN = 'ORG_ADMIN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}
```

### Protected Routes

- **Public Routes**: Login, signup, public events
- **User Routes**: Dashboard, bookings, profile
- **Admin Routes**: Admin dashboard, user management
- **Super Admin Routes**: System-wide administration

## API Integration

### API Client

The application uses a centralized API client (`api.client.ts`) with:

- **Automatic token refresh**: JWT token management
- **Request/response interceptors**: Error handling
- **Authentication headers**: Automatic token inclusion
- **Retry logic**: Failed request handling

### 📡 API Endpoints

The frontend integrates with the backend API:

```typescript
// Example API calls
const apiClient = {
  // Authentication
  login: (credentials) => post('/api/auth/email-auth/login', credentials),
  refreshToken: (token) => post('/api/auth/refresh-token', { refreshToken: token }),
  
  // Bookings
  createBooking: (bookingData) => post('/api/bookings', bookingData),
  getUserBookings: () => get('/api/bookings'),
  
  // Events
  getEvents: () => get('/api/events'),
  registerForEvent: (eventId) => post(`/api/events/${eventId}/register`),
  
  // Admin endpoints
  getAllUsers: () => get('/api/admin/users'),
  createRoom: (roomData) => post('/api/admin/rooms', roomData)
};
```

## State Management

### Context Architecture

The application uses **React Context API** for state management:

```typescript
// Session Context
export const SessionContext = createContext<SessionContextType>({
  session: null,
  refreshSession: async () => {},
  refreshAccessToken: async () => null
});

// Usage
const { session, refreshSession } = useSessionContext();
```


