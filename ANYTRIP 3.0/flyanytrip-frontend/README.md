# Flyantrip Frontend

This frontend is a React application built with Vite and Tailwind CSS. The current phase focuses exclusively on building the USER SIDE UI/UX, explicitly focusing on Flights, Hotels, Tours, and Visa redirects.

## Running the Application

- `npm start` or `npm run dev`: Start the Vite development server.

## Architecture

The project has been restructured for scalability and maintainability:

- `src/pages/`: Main page components mapping directly to application routes.
- `src/layouts/`: Global wrapper components (e.g., MainLayout with Navbar and Footer).
- `src/components/common/`: Reusable components used across features (Buttons, Cards, Modals, Loaders, Toasts).
- `src/components/flights/`: Flight-specific UI components.
- `src/components/forms/`: Reusable forms and form elements.
- `src/components/ui/`: Core UI building blocks (Tailwind utility components).
- `src/features/`: Complex, encapsulated business features grouped together (flights, hotels, tours, visa).
- `src/routes/`: Route configurations.
- `src/hooks/`: Custom React hooks for business logic and UI state.
- `src/utils/`: Helper functions and utility scripts.
- `src/constants/`: Global constants, standard text, and static configuration.
- `src/services/`: API communication layers (future integration with backend).
- `src/store/`: State management configurations.
- `src/validations/`: Form schema definitions and data validation rules.
- `src/assets/`: Static assets, images, and fonts.

## Available Routes & Pages

You can navigate to the following URLs in your local server (e.g., `http://localhost:5173/` or `http://localhost:3000/`) to view the page layouts and styling:

### Main Home Pages
- `/` - Main landing portal
- `/flights` - Flights Home Page (Pre-selects Flights tab)
- `/hotels` - Hotels Home Page (Pre-selects Hotels tab)
- `/tours` - Tours & Packages Home Page (Pre-selects Tours tab)
*(Note: Clicking on "Visa" from any home page will redirect externally to askvisa.in)*

### Flight Ticket Booking Flow Skeletons
- `/flight-details` - Detailed information about a selected flight
- `/booking-review` - Review booking before passenger details
- `/traveller-details` - Passenger form inputs
- `/seat-selection` - Seat map and selection
- `/addons` - Baggage, meals, and other add-ons
- `/payment` - Payment gateway UI
- `/booking-success` - Successful booking confirmation
- `/booking-failed` - Payment or booking error UI
- `/ticket-confirmation` - E-ticket view
- `/manage-booking` - View and manage an existing booking
- `/check-in` - Web check-in flow
- `/flight-status` - Check current flight status
- `/fare-calendar` - Month-wise fare view

### Other Public Pages
- `/offers` - Promotional offers
- `/destinations` - Popular destinations
- `/blog` - Travel blog
- `/about-us` - About the company
- `/contact-us` - Contact form and details
- `/faq` - Frequently Asked Questions
- `/terms` - Terms and Conditions
- `/privacy-policy` - Privacy Policy
- `/refund-policy` - Cancellation and Refund Policy

### Authentication Pages
- `/login` - User Login
- `/register` - User Registration
- `/forgot-password` - Password recovery
- `/otp-verification` - OTP input

### User Dashboard Pages
- `/dashboard/profile` - Manage user profile
- `/dashboard/bookings` - View past and upcoming trips
- `/dashboard/saved-travellers` - Saved co-passengers
- `/dashboard/wallet` - Digital wallet/credits
- `/dashboard/notifications` - Alert center
- `/dashboard/support` - Support tickets
- `/dashboard/settings` - Account preferences
