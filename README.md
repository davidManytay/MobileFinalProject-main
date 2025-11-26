# Welcome to our Expo Lesson Plan Generator app 👋

This app serves as a very helpful tool for teachers especially to education students where their tedious and repetitive job gets taken care just by giving some information to the app.

Won't spoil you too much. Keep yourself updated for the outcome of this project. That's it for now...






<<<<<<< HEAD
==========================================
=======









=====================================================
>>>>>>> 1e966a389e8362773f38ad2b27f381f8e6d8d7bf
HOW TO RUN?

Terminal 1: Backend Server

  This terminal should already be running from before. If it's not, or if you closed it, run these commands:

   1. Navigate to the server directory:
        cd server
   2. Start the server:
        npm start
      (Leave this terminal running. You should see it connect to the database and listen on port 3000.)


 Terminal 2: Backend Tunnel (ngrok)

  This terminal should also already be running from before. If it's not, or if you closed it, run these commands:

   1. In a new terminal, navigate to the server directory again:
        cd server
   2. Start the ngrok tunnel:
        npm run tunnel
      (Leave this terminal running. It should display the "Forwarding" URL you provided earlier.)

  Terminal 3: Frontend Application

   1. In a third, new terminal, navigate to the root directory of your project (where the main package.json is):

        cd D:\...\LessonPlanGenerator
   2. Start the Expo frontend application with the tunnel:
<<<<<<< HEAD
        npx expo start --tunnel
=======
        npx expo start --tunnel
>>>>>>> 1e966a389e8362773f38ad2b27f381f8e6d8d7bf
