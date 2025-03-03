# YogaVerse 🧘‍♂️📱
**Live Demo**: [YogaVerse](https://yogaverse.netlify.app/)

## 📋 Table of Contents
- [YogaVerse](#-yogaverse)
- [Features](#-features)
  - [Email and Google Login](#-email-and-google-login)
  - [User Profiles](#-user-profiles)
  - [Admin Panel](#-admin-panel)
  - [Yoga Tracking & Progress](#-yoga-tracking--progress)
  - [Challenges System](#-challenges-system)
- [Tech Stack](#-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
  - [Authentication](#authentication)
  - [Cloud Messaging](#cloud-messaging-optional-for-future-updates)

**YogaVerse** is a modern Yoga tracking and wellness application designed to empower users to maintain a healthy lifestyle through the practice of yoga. The app helps users log their Yogasanas, track their progress over time, and participate in community-driven challenges. YogaVerse aims to make yoga accessible and enjoyable for everyone, while promoting mindfulness, fitness, and overall well-being.

YogaVerse provides a comprehensive platform where users can create and maintain their profiles, track their yoga journey, set goals, and engage with a vibrant yoga community. Whether you are a beginner looking to start your yoga practice or an experienced yogi aiming to deepen your knowledge, YogaVerse has everything you need to stay motivated, track progress, and meet your wellness goals.





## 🚀 Features

### 🔹 **Email and Google Login**
- **Email/Password Login**: Users can register and log in using their email address and password. This feature ensures that each user has a secure and personalized account.
- **Google Login**: For a more streamlined experience, users can log in using their Google account, making the registration process quick and easy.
- **Email Verification**: After registering with an email address, users must verify their email before they can log in. This step ensures that all accounts are linked to valid email addresses, increasing security and reducing spam.
- **Password Reset**: In case users forget their password, they can easily reset it via an email link sent to their registered address. This feature provides an extra layer of security for users who want to regain access to their accounts.

### 🔹 **User Profiles**
- **Create Profile**: After logging in, users are prompted to complete their profiles by filling in personal details. This information helps YogaVerse provide tailored recommendations and track progress based on individual goals.
- **Private Data**: Each user’s data is kept private. This means that one user cannot access or view the profile data of another user. This feature ensures the privacy and confidentiality of all users.
- **Data Security**: Since all the personal data and yoga logs are stored securely in Firebase Firestore, users can be assured that their information is protected from unauthorized access.

### 🔹 **Admin Panel**
- **Admin Access**: The application includes an admin panel that allows administrators to manage user accounts and application data. Admins can perform actions such as adding new content, updating existing information, and deleting user profiles if necessary.
- **User Management**: Admins have the ability to delete user accounts, ensuring that only valid and active users remain in the system.
- **Content Management**: Admins can also manage the yoga challenges and user logs. They can update the challenges, add new challenges, and delete outdated or irrelevant content.
- **Moderation**: In addition to managing user data, the admin panel also provides tools for moderating the content that users generate, ensuring that all content adheres to the platform’s guidelines.

### 🔹 **Yoga Tracking & Progress**
- **Log Yogasanas**: YogaVerse enables users to log their completed Yogasanas, allowing them to track each session’s details, including the type of asana, duration, and any specific notes related to the practice.
- **Track Difficulty**: Users can rate the difficulty level of each yoga session they complete. This helps them track their growth over time and also provides valuable insights into their progress.
- **Progress Over Time**: By keeping a record of each completed session, YogaVerse allows users to track their progress over time. The app provides a visual representation of their achievements and helps users stay motivated as they see improvements.
- **Goal Setting**: Users can set personal goals related to the number of yoga sessions per week, the duration of each session, or specific asanas they want to master. The app will help them stay on track and provide reminders to meet their goals.

### 🔹 **Challenges System**
- **Create Challenges**: YogaVerse includes a robust challenge system where users can create their own yoga challenges. Challenges can be customized with a name, description, difficulty level, and duration. This allows users to create personalized challenges tailored to their specific goals.
- **Join Community Challenges**: In addition to creating their own challenges, users can join community challenges hosted by YogaVerse. These challenges allow users to compete and engage with others while staying motivated to achieve their wellness goals.
- **Active & Completed Challenges**: Users can track their participation in active challenges and see a record of the challenges they’ve completed. This provides a sense of accomplishment and allows users to reflect on their progress.
- **Discover New Challenges**: The app also provides a section where users can discover new challenges created by others. This fosters a sense of community and encourages users to take part in a variety of challenges to stay engaged with their yoga practice.

## 🛠️ Tech Stack

### **Frontend**: 
- **React**: The front end of YogaVerse is built using React, a popular JavaScript library for building user interfaces. React provides a seamless user experience by enabling the creation of interactive UI components that update in real-time based on user input.
  
### **Backend**:
- **Firebase**: YogaVerse uses Firebase as the backend service for user authentication, database storage, and real-time data syncing. Firebase allows for secure and scalable management of user accounts and data.

### **Database**:
- **Firestore**: The app uses Firestore, Firebase’s NoSQL database, to store user profiles, logs, challenges, and other application data. Firestore provides real-time syncing, ensuring that data is always up-to-date across all devices.
  
### **Authentication**:
- **Firebase Authentication**: Firebase Authentication is used for securely managing user sign-ins and registrations. It supports multiple authentication methods, including email/password, Google login, and password reset through email links.

### **Cloud Messaging** (Optional for Future Updates):
- **Firebase Cloud Messaging** (FCM): Though not currently used for notifications in this version, Firebase Cloud Messaging is a potential feature for future updates, allowing the app to send push notifications to users about new challenges, profile updates, or community events.