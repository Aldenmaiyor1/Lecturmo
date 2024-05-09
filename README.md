# COMPSCI 732 / SOFTENG 750 project - Team Quaint Quokkas

---

# **Lecturmo** 
>Empowering university students to share course reviews, promoting transparency and informed decision-making.

## Overview
<b>Lecturmo</b> is a comprehensive web application designed for universities, aimed at enhancing the university experience by fostering a transparent and informative environment for students to share their experiences and help others make informed decisions about their academic pursuits.

### Purpose
The purpose of Lecturmo is to empower students by providing a platform where they can share their insights and opinions through course reviews. By doing so, Lecturmo aims to create a valuable resource for both current and prospective students, enabling them to make informed decisions about their academic endeavors.

### Development Focus
<b>Lecturmo</b> focuses on several key features to achieve its goals

- **Verification Processes:** Ensuring the authenticity of reviewers through verification processes, which helps maintain the credibility of course reviews.

- **QR Code Attendance Tracking:** Enabling lecturers to generate QR codes for attendance tracking, streamlining the process and enhancing efficiency in monitoring student attendance.

- **Attendance Badges:** Implementing attendance badges to incentivize student participation and engagement, encouraging active involvement in courses.

- **AI-Driven Course Review Summaries:** Leveraging AI to enrich user experience and foster accountability within academia, particularly through automated review summarization, streamlining access to key insights.

Through these efforts, Lecturmo aims to provide a robust and user-friendly platform for students to share and access course reviews.

---
# 1. Features Overview

### User Identity Management Suite
- **Verification Processes:** 
Users initiate the verification process by providing their university email address. Subsequently, Lecturmo sends a verification email to the provided university email. Upon receiving the email, users are required to click on the verification link enclosed within the email to complete the verification process, thereby ensuring the authenticity and reliable of their identity.

- **User Login & Registration:** 
Providing secure login and registration processes for users to access and interact with the website.

- **User Profile Management:** 
Allow users to view and update their profile information for a personalized experience.

### Attendance Management Suite
- **QR Code Attendance Tracking:**
Lecturers initiate the QR code generation process within Lecturmo and present the generated QR code to students. Students then scan the QR code using their mobile devices as part of their attendance process. To enhance security, each QR code changes every second and expires after 30 seconds, ensuring real-time and secure attendance tracking.

- **Attendance Badges:**
Students are rewarded with badges based on their attendance record, ranging from none to bronze, silver, and gold. The badge hierarchy is determined by the number of classes attended, with students achieving a bronze badge after attending three lectures, a silver badge after eight classes, and a gold badge after attending 15 classes. This system incentivizes regular attendance and recognizes students for their commitment to their academic pursuits.

### Course Review Features Suite
- **Course Search:** 
Users can easily search for courses on Lecturmo's homepage, streamlining the process of finding relevant courses according to their academic interests and requirements.

- **AI-Driven Course Review Summaries:** 
Utilizing AI to generate concise summaries of course reviews for enhanced accessibility.

- **Write Reviews:**
Users can easily share their insights and experiences by writing reviews for courses they have attended, fostering transparency and informed decision-making within the academic community.

- **Like Reviews:**
Allows users to express appreciation for helpful reviews by liking them, fostering engagement and community interaction.

- **Sort Reviews:**
Enables users to organize reviews based on various criteria such as Newest, Highest Rating, Lowest Rating, Most popular, or Least popular, facilitating easier navigation and information retrieval.

---

# 2. Steps for Running the Project

1. ## Git Clone
Copy the respository URL and open the terminal in VScode:

    git clone https://github.com/UOA-CS732-SE750-Students-2024/project-group-quaint-quokkas.git

2. ## Open the Project
After clone into your own directory, open the direct repository that contains the codes of the program

**Alernatively**

    cd project-group-quaint-quokkas

3. ## MongoDB
env file is provided on Google form
### Backend env
> Add backend env to  `./backend` directory

### Frontend env
> Add frontend env to  `./frontend` directory

4. ## Start the Program
### Backend Command
> Only available for backend project, which is under `./backend` directory

**Open Backend Directory**

    cd backend

**Install the Dependencies**

    npm install

**Run the App**

    npm run dev

### Frontend Command
> Only available for frontend project, which is under `./frontend` directory

**Open Frontend Directory**

    cd frontend

**Install the Dependencies**

    npm install

**Run the App**

    npm run dev

---
# 3. Fabric Accounts
| Username       | Password       | Role          |
| -------------- | -------------- |-------------- |
|   user1        |  123           | Student       |
|   user2        |  123           | Student       |
|   user3        |  123           | Student       |
|   Lec1         |  123           | Lecturer      |
|   Lec2         |  123           | Lecturer      |
|   Lec3         |  123           | Lecturer      |
    
---
# 4. User Stories for Students and Lecturers
## As a student, I can:
1. **Find Relevant Courses Easily:** 
- Easily search for courses based on my interests and academic requirements.
- Access a single course page to gather comprehensive information about a specific course.
2. **Make Informed Decisions:** 
- Read concise summaries of course reviews generated by AI to quickly understand the key points and insights.
- Browse reviews written by other students to gain insights into their experiences and perspectives.
- Consider the reliability of reviews by verifying the reviewer's attendance badge, with higher attendance badges indicating more reliable reviews.
- Write reviews for courses I have attended to share my experiences and help other students make informed decisions.
3. **Attend Lectures Conveniently:** 
- Scan the QR code provided by the lecturer during the lecture to register my attendance quickly and seamlessly.
4. **Engage with Course Content:** 
- Like reviews that I find helpful to express my appreciation.
- Sort reviews based on criteria like Newest, Highest Rating, Lowest Rating, Most popular, or Least popular to quickly find the most relevant information.

## As a lecturer, I can:
1. **Track Attendance Efficiently:** 
- Initiate the QR code generation process within Lecturmo to facilitate attendance tracking in my classes.
- Present the generated QR code to students during class sessions for them to scan using their mobile devices.
2. **Ensure Security and Accuracy:** 
- Utilize QR codes that change every second and expire after 30 seconds to ensure real-time and secure attendance tracking.
- Monitor attendance records through the system to ensure accuracy and compliance.
3. **Incentivize Attendance:** 
Implement an attendance badge system where students are rewarded with badges based on their attendance records.
Define badge hierarchy based on the number of classes attended, providing incentives for students to attend regularly.

---
# 5. How to Test the Code

### Backend Test
**Open Backend Directory**

    cd backend

**Run Test**

    npm test


### Frontend Test
**Open Frontend Directory**

    cd Frontend
    
**Run Test**

    npm test

--- 

# 6. Deployment


---

# 7. Team members

- Alden Maiyor
- Tuocheng (Tony) Li
- Inez Yuan Ya Chong
- Yue (Carina) Qi
- Tone Xie
- Sienna Nguyen

---

# 8. Responsibility
- **Alden Maiyor:**
Alden has developed QR code generation and scanner feature.

- **Tuocheng (Tony) Li:** 

- **Inez Yuan Ya Chong:** 

- **Yue (Carina) Qi:** 

- **Tone Xie:** 

- **Sienna Nguyen:** 

![](./group-image/Quaint%20Quokkas.webp)