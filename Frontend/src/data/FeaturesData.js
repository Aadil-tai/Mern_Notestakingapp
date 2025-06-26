const featuresData = {
  "developmentJourney": [
    {
      "title": "API First Approach",
      "icon": "FiServer",
      "color": "purple",
      "items": [
        "Designed modular and RESTful API endpoints using Express.js",
        "Implemented secure JWT-based authentication for protected routes",
        "Tested all endpoints thoroughly using Postman and custom test cases",
        "Optimized MongoDB queries for performance and scalability",
        "Structured controllers and routes for clean API separation"
      ]
    }
    ,
    {
      "title": "MongoDB Integration",
      "icon": "FiDatabase",
      "color": "green",
      "items": [
        "Designed scalable schemas using Mongoose with validation and unique indexing",
        "Used pre-save hooks to securely hash passwords using bcrypt",
        "Added support for OTP-based account verification and password resets with expiry tracking",
        "Handled async CRUD operations with proper error handling and lean queries",
        "Used timestamps and schema-level defaults to streamline data lifecycle",
        "Integrated with MongoDB Atlas for cloud-hosted, scalable database access"
      ]
    }
    ,
    {
      "title": "React Implementation",
      "icon": "FiCode",
      "color": "indigo",
      "items": [
        "Built responsive UI using Tailwind CSS with reusable components",
        "Implemented client-side routing using React Router",
        "Connected frontend to Node.js backend using Axios with proper CORS handling",
        "Used react-hook-form for form management and validation",
        "Created modular form components like FormInput integrated with form context",
        "Integrated protected routes and redirection logic based on user roles",
        "Implemented animated UI interactions (e.g., 3D text flip effect, abstract card shapes)",
        "Managed global and local state using Redux and component-level state hooks"
      ]
    },
    {
      "title": "State Management with Redux",
      "icon": "SiRedux",
      "color": "indigo",
      "items": [
        "Managed authentication flow using Redux (login, register, verify, forgot password)",
        "Moved logic out of components into Redux action creators for cleaner separation",
        "Handled loading, success, and error states with action types (e.g., NOTES_CREATE_SUCCESS)",
        "Used Redux Thunk for async API requests with axios",
        "Implemented global alert handling using Redux and toast notifications",
        "Structured reducers for modularity across auth and note modules"
      ]
    },
    {
      "title": "Authentication and authorization",
      "icon": "SiSimplelogin",
      "color": "pink",
      "items": [
        "Implemented secure email verification using 6-digit OTP",
        "Prevented account duplication with unique email constraint",
        "Added forgot password and reset via OTP functionality",
        "Used middleware to protect routes and verify JWT tokens",
        "Blocked login before email verification is complete",
        "Integrated resend OTP feature for email confirmation",
        "Separated login, register, and verify logic using Redux actions",
        "Used HttpOnly JWT cookies for secure authentication (no localStorage)"
      ]
    },

    {
      "title": "Full Integration",
      "icon": "GrIntegration",
      "color": "pink",
      "items": [
        "Implemented full-stack authentication with email OTP verification and JWT cookies",
        "Created secure and role-based CRUD operations for notes",
        "Handled loading, error, and success states using Redux and toast notifications",
        "Integrated protected routes and middleware for secure user access",
        "Connected frontend to Express API using Axios with centralized error handling",
        "Optimized performance by avoiding redundant API calls and caching auth state"
      ]
    }

  ],

}


export default featuresData;