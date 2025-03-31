PACE DINER - Retro-Themed Restaurant Management System
======================================================

![Space Diner Logo]([https://placehote](https://placehote/) restaurant management solution with a nostalgic retro-futuristic aesthetic inspired by 80s and 90s computer interfaces. Space Diner combines modern web technologies with a unique visual style to create an immersive restaurant management experience.

Features
--------

-   Retro UI: Pixel-perfect design with scanlines, flicker effects, and neon color schemes

-   Real-time Order Management: Track orders from creation to completion

-   Menu Management: Add, edit, and remove menu items with ease

-   Table Management: Assign orders to specific tables

-   Admin Dashboard: Monitor restaurant performance with visual statistics

-   Responsive Design: Works on desktop and mobile devices

-   Socket-based Notifications: Instant updates across all connected devices

Tech Stack
----------

Frontend
--------

-   React.js

-   CSS3 with custom animations

-   Socket.io Client

-   Axios for API requests

Admin Panel
-----------

-   React.js

-   Custom retro-themed CSS

-   Socket.io Client for real-time updates

-   Responsive design for all device sizes

Backend
-------

-   Node.js

-   Express.js

-   MongoDB

-   Socket.io for real-time communication

-   JWT Authentication

Project Structure
-----------------

text

`space-diner/ ├── backend/           # Server-side code ├── frontend/          # Customer-facing application └── admin-panel/       # Restaurant management interface `

Installation & Setup
--------------------

Prerequisites
-------------

-   Node.js (v14+)

-   MongoDB

-   npm or yarn

Backend Setup
-------------

bash

`# Navigate to backend directory  cd backend   # Install dependencies  npm  install    # Create .env file with the following variables  # PORT=5000  # MONGODB_URI=mongodb://localhost:27017/space-diner  # JWT_SECRET=your_jwt_secret    # Start development server  npm run dev # OR  nodemon server.js `

Frontend Setup
--------------

bash

`# Navigate to frontend directory  cd frontend   # Install dependencies  npm  install    # Create .env file with the following variables  # REACT_APP_API_URL=http://localhost:5000/api  # REACT_APP_SOCKET_URL=http://localhost:5000    # Start development server  npm run dev `

Admin Panel Setup
-----------------

bash

`# Navigate to admin-panel directory  cd admin-panel   # Install dependencies  npm  install    # Create .env file with the following variables  # REACT_APP_API_URL=http://localhost:5000/api  # REACT_APP_SOCKET_URL=http://localhost:5000    # Start development server  npm run dev `

Real-time Communication
-----------------------

Space Diner uses Socket.io for real-time updates across the platform:

1.  Order Notifications: Kitchen staff receive instant notifications when new orders are placed

2.  Status Updates: Waitstaff are notified when orders are ready for serving

3.  Admin Alerts: Managers receive important system notifications

Socket events include:

-   `new_order`: Triggered when a customer places an order

-   `status_update`: Sent when an order's status changes

-   `menu_update`: Broadcast when menu items are modified

UI Components
-------------

Space Diner features a custom-built retro UI with:

-   Scanline effects that mimic old CRT monitors

-   Subtle screen flicker animations

-   Neon color palette (primarily cyan, magenta, and green)

-   Pixelated fonts (Press Start 2P and VT323)

-   Gradient backgrounds reminiscent of 80s computer interfaces

Responsive Design
-----------------

The application is fully responsive with:

-   Mobile-first approach

-   Simplified views on smaller screens

-   Touch-friendly controls

-   Adaptive layouts that preserve the retro aesthetic

Authentication
--------------

-   JWT-based authentication system

-   Role-based access control (Admin, Manager, Staff)

-   Secure password hashing



Acknowledgements
----------------

-   Fonts provided by Google Fonts

-   Icons created custom for the retro aesthetic

-   Inspired by classic sci-fi interfaces from the 80s and 90s
