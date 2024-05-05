# Marketplace Application

This is a full-stack web application designed for buying and selling items in a marketplace environment. It allows users to list items for sale, edit and delete their own listings and browse items listed by other users. The platform aims to connect buyers and sellers in a user-friendly and secure environment.

# Deployment

The app is running at: https://kekesmarket.onrender.com/

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: Web application framework for Node.js, designed for building web applications and APIs.
- **SQLite**: SQL database engine, used here for data storage.
- **Passport.js**: Authentication middleware for Node.js.
- **OAuth2.0**: Provides a possibility for a Google login.

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Vite**: Frontend tooling for faster and leaner development.
- **CSS**: Styling of the web components.

### DevOps

- **Docker**: Containerization platform used to package the application and its dependencies into a container.
- **GitHub Actions**: CI/CD pipeline for automation software workflows.

### Testing

- **Jest and supertest**: JavaScript testing framework used for backend testing.

## Features

- **User Authentication**: Secure login and registration system for users.
- **Item Listing**: Users can list items they want to sell with details like title, description, price, and category.
- **Browse Items**: Users can browse listed items and filter them based on categories and price, also search by keywords.
- **User Profiles**: Users can view and edit (in the future) their profiles, and view their own listings.

## Installation

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- npm
  npm install npm@latest -g

- Docker (for containerization)

### Installation and running locally

1. Clone the repo
   git clone https://github.com/Keekki/KekesMarket.git

2. Navigate to the backend directory
   cd KekesMarket
   cd backend

3. Install NPM packages
   npm install

4. Start the application
   npm start

5. For frontend
   cd .. && cd frontend && npm install && npm run dev

## Usage

After installation, the application will be running on your local server. You can access the backend by navigating to `http://localhost:3000` in your web browser.

And the frontend `http://localhost:9000`
**NOTE you are missing env variables**

## Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Contact

Matias Frimodig - frimodigmatias@gmail.com

Project Link: [https://github.com/Keekki/KekesMarket](https://github.com/Keekki/KekesMarket)

## Acknowledgements

- [React Documentation](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
