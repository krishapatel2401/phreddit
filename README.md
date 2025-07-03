# Phreddit

**Phreddit** is a full-stack Reddit-style web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to create communities, post content, comment on posts or replies, and manage profiles. Admin users have additional privileges to manage users and content.

The project includes:
- User authentication using **JWT**
- Community and post management
- Nested comment support
- Role-based views (admin vs. regular user)
- Basic unit testing for client and server components

---

## 🛠 Technologies Used

- **Frontend**: React, HTML/CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Jest, React Testing Library, Supertest

---

## 🚀 How to Set Up and Run the Project

### Prerequisites

- Node.js and npm
- MongoDB installed and running locally
- GitBash (Windows) or Terminal (Mac/Linux)




1. install bcrypt on both server and client by typing in: npm install bcrypt
2. open GitBash (on windows) or Terminal (on Mac),
    3. to get mongodb running, type: mongod
    4. to open another instance of the GitBash or terminal
    5. Go to the directory where server of the project is in. For eg. cd /Users/ninad/CSE\ 316/project-19twentyone/server 

    6. then to initialise database, type in: node init.js mongodb://127.0.0.1:27017/phreddit admin@stonybrook.edu "Admin User" "adminpassword123"
    7. then to run it (as done in previous assignments):
        8. in a vs code terminal, type in: nodemon server/server.js
        9. in another vs code terminal type in: cd client
            10. then type in: npm start

# Project Info
This was a duo project for the Fundamentals of Software Development course at Stony Brook University.
It was built collaboratively as part of the final project to demonstrate full-stack development, version control, and test-driven design.
