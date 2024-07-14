# Zionews

Zionews is a straightforward and efficient service that allows you to create, log, and update users, while registering preferences to the database. It fetches news matching your preferences, uses a language model to filter and select the top three news items, and sends them to your email (work in progress). The project is divided into six microservices, with plans for a React front end. Currently, it operates as a pure API.

## Requirements

- Docker Compose
- JavaScript
- Node.js
- Express
- PostgreSQL
- Plans for React front end

## Installation

1. Install Docker.
2. Clone the repository:
   ```sh
   git clone https://github.com/scarywalker/zionews.git
3. Navigate to the project directory:
   ```sh
   cd microservices-version
4. Start the services using Docker Compose:
   ```sh
   docker compose up -d

## Usage

four(3.5) working external acces apis, the same that are described in the json with the postman collection

1 post http://localhost:4000/api/v1/auth/register remeber to put a json with name(varchar255), email(varchar255) we check if it looks emaily, password(varchar255) properly encrypted in the DB, and the preferences( array of texts) all fields are mandatory and checked, you will gain a uuid generated id to make other 2 api calls and a 1 hour lasting veryfication token that used to work, but now the veryfication has been temporaraly suspended

2 post http://localhost:4000/api/v1/auth/login/ remeber to put a json with email and password we check them and show you your user id and give you an hour lasting acces token( see previous point)

3 put http://localhost:4000/api/v1/dashboard/:id remeber to put a json with new name and preferensses( I think I forgot to check this one), login credentials WILL NEVER CHANGE

4 get http://localhost:4000/api/v1/news/:id it's get, no req.body, YAY, that is the main feature, the news fetching is great, the llm filtering could be better formatted but is fine, the email feature <del>maybe<del> will be fixed

## Credits

Thank those who helped make this possible. Mainly coffe and Indian youtubers.