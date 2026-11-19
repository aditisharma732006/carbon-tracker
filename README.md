# 🌱 EcoTrack – Personal Carbon Footprint Tracker

**Track your impact. Understand your emissions. Build a greener future.**

EcoTrack is a full-stack web application designed to help individuals monitor, analyze, and reduce their carbon footprint through everyday activities. It allows users to calculate carbon emissions, track historical records, visualize emission patterns, set reduction goals, and receive personalized eco-friendly recommendations.

Built using the MERN stack, EcoTrack provides a personalized sustainability dashboard with secure authentication, interactive analytics, and an intuitive user interface.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected routes and API endpoints.
- User-specific data access.
- Secure activity and profile management.

### 📊 Carbon Footprint Calculator
Calculate carbon emissions based on everyday activities across multiple categories:

- Transportation
- Electricity consumption
- Cooking
- Food consumption
- Shopping

View calculated carbon emissions and understand the environmental impact of your lifestyle.

### 📈 Interactive Dashboard
A personalized dashboard providing an overview of your environmental impact.

- Total carbon emissions.
- Daily, weekly, and monthly statistics.
- Average daily emissions.
- Highest emission category.
- Recent activities.
- Personalized recommendations.
- Carbon reduction goal progress.

### 📉 Data Visualization & Analytics
Understand your carbon footprint through interactive visualizations.

- **Line Chart:** Track daily emission trends.
- **Doughnut Chart:** Visualize category-wise emission distribution.
- **Bar Chart:** Compare monthly emissions.
- **Progress Indicators:** Monitor carbon reduction goals.

### 📅 Activity History
Maintain a record of previous carbon footprint calculations.

- View historical activities.
- Search and filter records.
- Sort activities.
- View detailed activity information.
- Edit and delete existing records.
- Access personal activity history.

### 🎯 Carbon Reduction Goals
Encourage sustainable habits through personalized goals.

- Set monthly carbon emission targets.
- Track actual emissions against targets.
- Monitor goal completion percentage.
- View remaining emission allowance.
- Track progress through visual indicators.

### 🌿 Personalized Eco Recommendations
Receive actionable suggestions based on your emission patterns.

- Transportation improvement suggestions.
- Energy-saving recommendations.
- Sustainable food choices.
- Responsible shopping habits.

Recommendations are generated using rule-based logic based on the user's carbon emission data.

### 👤 User Profile
- View and update personal information.
- Manage account details.
- Change password.
- View personal carbon footprint statistics.

### 📑 Reports
Access carbon footprint summaries and emission breakdowns to understand your environmental impact over time.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js |
| Styling | CSS / Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, bcrypt |
| Data Visualization | Recharts |
| API Communication | Axios |
| Icons | Lucide React |
| Deployment | Vercel, Render |

---

## 🏗️ Project Architecture

EcoTrack follows a client-server architecture.

```text
EcoTrack/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── activityController.js
│   │   └── goalController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── user.js
│   │   ├── activity.js
│   │   └── goal.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── activityRoutes.js
│   │   └── goalRoutes.js
│   │
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── styles/
│       ├── App.js
│       └── index.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/aditisharma732006/carbon-tracker.git
```

```bash
cd carbon-tracker
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the placeholder values with your actual configuration. Use the exact environment variable names expected by your backend code.

Start the backend:

```bash
npm run dev
```

For production:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

Update the API URL according to your backend configuration.

Start the React application:

```bash
npm start
```

Open your browser:

```text
http://localhost:3000
```

---

## 🔒 Security

EcoTrack incorporates security practices including:

- Password hashing with bcrypt.
- JWT-based authentication.
- Protected API endpoints.
- User-level authorization.
- Ownership validation for user-specific records.
- Environment variables for sensitive configuration.

---

## 🌐 Deployment

The application uses separate deployment services:

| Component | Platform |
|---|---|
| React Frontend | Vercel |
| Node.js Backend | Render |
| Database | MongoDB Atlas |

---

## 🎯 Project Objectives

- Encourage awareness of individual carbon emissions.
- Help users understand the environmental impact of everyday activities.
- Provide meaningful insights through data visualization.
- Encourage sustainable lifestyle choices.
- Track progress toward personal carbon reduction goals.

---

## 🚀 Future Enhancements

- AI-powered sustainability assistant.
- Community-based sustainability challenges.
- Global and regional emission comparisons.
- Advanced environmental impact reports.
- Integration with external carbon emission datasets.

---

## 👩‍💻 Developer

**Aditi Sharma**

GitHub: [@aditisharma732006](https://github.com/aditisharma732006)

---

**EcoTrack – Small changes today, a greener tomorrow. 🌍**
