# Backend Setup Guide

## Detailed Backend Instructions

### Installation

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/hospital_management

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Adding Sample Data

You can add sample doctors and medicines via API requests:

**Add Doctor (POST /api/doctors):**
```json
{
  "name": "Dr. Raj Kumar",
  "email": "raj@hospital.com",
  "specialization": "Cardiology",
  "qualifications": "MBBS, MD",
  "experience": 10,
  "consultationFee": 500,
  "rating": 4.8,
  "phone": "9876543210"
}
```

**Add Medicine (POST /api/pharmacy/medicines):**
```json
{
  "name": "Aspirin",
  "genericName": "Acetylsalicylic Acid",
  "price": 50,
  "stock": 100,
  "category": "Pain Relief",
  "manufacturer": "Bayer",
  "dosage": "500mg"
}
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on: `http://localhost:5000`

## Health Check Endpoint

Use this endpoint to verify that both the API and MongoDB connection are healthy.

- Method: `GET`
- URL: `/api/health`
- Success status: `200`
- DB disconnected status: `503`

Sample response:

```json
{
  "success": true,
  "api": "ok",
  "database": "connected",
  "timestamp": "2026-04-27T10:00:00.000Z",
  "uptimeSeconds": 123
}
```

## Database Models Explanation

### User Model
- Stores patient and admin information
- Password is hashed but excluded from queries by default
- Role-based access control

### Doctor Model
- Contains doctor profiles with specialization
- Availability array for scheduling
- Rating system for quality assurance

### Appointment Model
- Links users with doctors
- Tracks appointment status
- Stores appointment date, time, and reason

### Medicine Model
- Pharmacy inventory management
- Prescription requirement flag
- Stock tracking with expiry dates

## API Testing

Use **Postman** or **cURL** to test endpoints:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get All Doctors
curl http://localhost:5000/api/doctors

# Health Check
curl http://localhost:5000/api/health

# Book Appointment (requires token)
curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId":"DOCTOR_ID",
    "appointmentDate":"2024-05-15",
    "appointmentTime":"10:00 AM",
    "reason":"General checkup"
  }'
```

## Error Handling

The backend includes comprehensive error handling:
- Validation errors return 400 status
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status

## Performance Tips

- MongoDB queries use indexing via Mongoose
- JWT tokens validate quickly
- Middleware chains optimize request processing
- Error responses are concise

---

**Backend is now ready! Proceed to frontend setup.**
