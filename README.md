QuickChat assistant 

Description - 
A simple AI chat application where users can sign up, log in, chat with AI, and view or delete chat history.

Tech Stack - 
HTML, CSS, JavaScript-frontend
Node.js, Express, MongoDB-backend

Features - 
User Login & Signup
Chat with AI
View chat history
Delete chat history

API - 
POST /signup
POST /login
POST /chat
GET /history
DELETE /history
text/message 

AI Integration - 
Groq API Free - very fast inference

Setup - 
Install dependencies: npm install
Add .env file with MongoDB URI and API key
Run server: node server.js
Open frontend in browser

Challenges Faced - Handling asynchronous API calls between frontend and backend without breaking the UI flow.
Debugging issues where chat data was not loading due to timing and state management problems.
Integrating AI API and structuring prompts to get meaningful and consistent responses.
Ensuring smooth user experience with features like chat switching, message rendering, and error handling.
Overall, these challenges helped improve my understanding of full-stack development, especially handling real-time interactions and state management.


Author
Kasula Vaishnavi
