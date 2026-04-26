# Hospital Management System - Complete Full-Stack Application

A comprehensive hospital management system built with **React**, **Node.js/Express**, and **MongoDB** with JWT authentication.

## Features

✅ **User Authentication**
- JWT-based login/signup
- Secure password hashing with bcryptjs
- Protected routes for authenticated users
- Token refresh and expiration handling

✅ **Doctor Management**
- Browse doctors by specialization
- View doctor profiles and ratings
- Check availability and consultation fees

✅ **Appointment Booking**
- Book appointments with available doctors
- Schedule with date and time selection
- View appointment history
- Cancel pending appointments

✅ **Pharmacy System**
- Browse medicines by category
- Search medicines
- Add medicines to cart
- Manage shopping cart
- Price calculations with delivery fees

✅ **User Dashboard**
- Overview of appointments
- Health tips and reminders
- Quick access to main features
- Personalized user profile

✅ **Responsive Design**
- Mobile-friendly UI
- Adaptive layouts for all screen sizes
- Modern and clean interface

## Tech Stack

### Frontend
- **React** 18.2.0 - UI library with functional components and hooks
- **React Router** 6.8.0 - Client-side routing
- **Axios** 1.3.0 - HTTP client for API calls
- **CSS** - Custom responsive styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 7.0.0 - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing

## Project Structure

```
hospital-management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── Medicine.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   └── pharmacyController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── pharmacyRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Navbar.css
    │   │   ├── DoctorCard.js
    │   │   ├── DoctorCard.css
    │   │   ├── MedicineCard.js
    │   │   └── MedicineCard.css
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Home.css
    │   │   ├── Services.js
    │   │   ├── Services.css
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Auth.css
    │   │   ├── Dashboard.js
    │   │   ├── Dashboard.css
    │   │   ├── Profile.js
    │   │   ├── Profile.css
    │   │   ├── DoctorList.js
    │   │   ├── DoctorList.css
    │   │   ├── AppointmentForm.js
    │   │   ├── AppointmentForm.css
    │   │   ├── Pharmacy.js
    │   │   ├── Pharmacy.css
    │   │   ├── Cart.js
    │   │   └── Cart.css
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .gitignore
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd hospital-management/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/hospital_management
   JWT_SECRET=your_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the backend server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend will run on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd hospital-management/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (optional, for custom API URL):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the React app:**
   ```bash
   npm start
   ```

   The frontend will run on: `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- **POST** `/signup` - Register new user
- **POST** `/login` - Login user
- **GET** `/me` - Get current user (protected)

### Doctor Routes (`/api/doctors`)
- **GET** `/` - Get all doctors
- **GET** `/:id` - Get doctor by ID
- **POST** `/` - Create doctor (admin only)
- **PUT** `/:id` - Update doctor (admin only)
- **DELETE** `/:id` - Delete doctor (admin only)

### Appointment Routes (`/api/appointments`)
- **GET** `/` - Get appointments (protected)
- **POST** `/` - Book appointment (protected)
- **GET** `/:id` - Get appointment by ID (protected)
- **PUT** `/:id` - Update appointment (admin only)
- **DELETE** `/:id` - Cancel appointment (admin only)

### Pharmacy Routes (`/api/pharmacy`)
- **GET** `/medicines` - Get all medicines
- **GET** `/medicines/:id` - Get medicine by ID
- **POST** `/medicines` - Add medicine (admin only)
- **PUT** `/medicines/:id` - Update medicine (admin only)
- **DELETE** `/medicines/:id` - Delete medicine (admin only)
- **PUT** `/medicines/:id/stock` - Update stock (admin only)

## Database Models

### User Model
- name (String)
- email (String, unique)
- password (String, hashed)
- phone (String)
- role (String: 'patient', 'admin', 'doctor')
- address (String)
- age (Number)
- gender (String)
- timestamps

### Doctor Model
- name (String)
- email (String)
- specialization (String)
- qualifications (String)
- experience (Number)
- consultationFee (Number)
- rating (Number)
- availability (Array)
- phone (String)
- timestamps

### Appointment Model
- userId (ObjectId, ref: User)
- doctorId (ObjectId, ref: Doctor)
- appointmentDate (Date)
- appointmentTime (String)
- reason (String)
- status (String: 'pending', 'confirmed', 'completed', 'cancelled')
- notes (String)
- timestamps

### Medicine Model
- name (String)
- genericName (String)
- price (Number)
- stock (Number)
- description (String)
- manufacturer (String)
- category (String)
- dosage (String)
- expiryDate (Date)
- requiresPrescription (Boolean)
- timestamps

## Key Features Implementation

### JWT Authentication
```javascript
// Token stored in localStorage
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(userData));

// Auto-sent in request headers via Axios interceptor
Authorization: Bearer <token>
```

### Protected Routes
```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Cart Management
```javascript
// Uses localStorage to persist cart
localStorage.setItem('cart', JSON.stringify(cartItems));
```

### Appointment Booking
- Select doctor from list
- Choose date and time
- Provide reason for visit
- Confirmation via API

### Pharmacy
- Browse medicines by category
- Search functionality
- Add to cart with quantity
- Checkout with summary

## Testing the Application

### Test User Credentials
1. **Create a new account** via Sign Up page
2. **Login** with email and password

### Sample Data
The application supports:
- Multiple doctors with different specializations
- Various medicines in different categories
- Appointment management
- User profile management

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env` file
- Verify network connection

### API Connection Error
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify CORS is enabled

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Use `PORT=3001 npm start`

### Token Expired
- User will be automatically redirected to login
- Clear localStorage if needed

## Security Features

✅ **Password Encryption** - Bcryptjs hashing
✅ **JWT Authentication** - Secure token-based auth
✅ **Protected Routes** - Server-side authorization checks
✅ **Input Validation** - Mongoose schema validation
✅ **Error Handling** - Comprehensive try-catch blocks
✅ **CORS** - Cross-origin resource sharing configured

## Future Enhancements

- Email notifications for appointments
- Payment gateway integration
- Doctor ratings and reviews
- Prescription management
- Video consultation
- Admin dashboard analytics
- SMS reminders
- Mobile application

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## License

This project is open-source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.

---

**Happy coding! 🚀**
