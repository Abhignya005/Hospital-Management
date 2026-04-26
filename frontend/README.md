# Frontend Setup Guide

## Detailed Frontend Instructions

### Installation

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the frontend directory (optional):

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

If not specified, it defaults to `http://localhost:5000/api`

### Project Structure Explained

**Components** - Reusable UI components
- `Navbar.js` - Navigation bar with links and user menu
- `DoctorCard.js` - Individual doctor card component
- `MedicineCard.js` - Individual medicine card component

**Pages** - Full page components
- `Home.js` - Landing page with services overview
- `Services.js` - Detailed services information
- `Login.js` - User login form
- `Signup.js` - User registration form
- `Dashboard.js` - User overview after login
- `Profile.js` - User profile and appointment history
- `DoctorList.js` - Browse and filter doctors
- `AppointmentForm.js` - Book appointments
- `Pharmacy.js` - Browse medicines
- `Cart.js` - Shopping cart management

**Services** - API integration
- `api.js` - Axios instance with JWT token handling

### Running the Frontend

**Development mode:**
```bash
npm start
```

The app will open at: `http://localhost:3000`

**Build for production:**
```bash
npm run build
```

**Run tests:**
```bash
npm test
```

## Features Walkthrough

### 1. Home Page
- Hero section with CTA buttons
- Services overview
- Quick action buttons

### 2. Authentication
- Sign up with email and password
- Login with credentials
- Password validation
- Auto-redirect after login

### 3. Doctor List
- Browse all doctors
- Filter by specialization
- View doctor details and ratings
- Book appointments with one click

### 4. Dashboard
- Quick stats (upcoming appointments, past appointments, prescriptions)
- Health tips
- Quick action buttons to main features

### 5. Appointments
- Select doctor from dropdown
- Choose date (future dates only)
- Select time
- Provide reason for visit
- Confirmation message

### 6. Pharmacy
- Search medicines by name
- Filter by category
- Add to cart with quantity
- View medicine details

### 7. Shopping Cart
- View all cart items
- Modify quantities
- Remove items
- See order summary with total
- Delivery fee calculation

### 8. Profile
- View personal information
- See appointment history
- Cancel pending appointments
- Track appointment status

## Local Storage Usage

The app uses localStorage for:
- JWT token (key: `token`)
- User data (key: `user`)
- Shopping cart (key: `cart`)

## Styling Guide

All components use custom CSS with:
- Consistent color scheme (primary: #0066cc, secondary: #00a3e0)
- Responsive grid layouts
- Mobile-first design
- Modern hover effects

## Common Issues & Solutions

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### Cannot Connect to Backend
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in .env
- Verify network connectivity

### Styles Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Restart React dev server
- Check CSS file imports

### Auth Token Issues
- Clear localStorage manually
- Re-login to get new token
- Check JWT expiration time

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

✅ Component-based architecture for reusability
✅ Lazy loading with React Router
✅ localStorage for cart persistence
✅ Axios interceptors for efficient API calls
✅ CSS optimization with shared variables

## Development Tips

### Debugging
```javascript
// Check localStorage
console.log(localStorage.getItem('token'));

// API calls
// Check network tab in browser DevTools
```

### Adding New Features
1. Create new component in appropriate folder
2. Add routing in App.js
3. Create associated CSS file
4. Import and use the component

### State Management
- Uses React hooks (useState, useEffect)
- localStorage for persistence
- Props drilling for component communication

---

**Frontend is now ready with all pages, components, and styling!**
