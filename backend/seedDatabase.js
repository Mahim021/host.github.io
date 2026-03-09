/**
 * Database Seeding Script
 * Run this once to populate MongoDB with initial projects and experiences from your portfolio
 * 
 * Usage: node seedDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const Experience = require('./models/Experience');

// Sample projects data from your portfolio
const projects = [{
        title: "Project Aladin",
        description: "A food ordering Android application built with Flutter, featuring a modern and intuitive user interface for seamless food browsing, ordering, and payment. Includes real-time order tracking, cart management, and smooth navigation between different food categories.",
        technologies: ["Flutter", "Dart", "Mobile App", "UI/UX"],
        imageUrl: "../Assets/aladin-project1.jpeg",
        githubUrl: "https://github.com/Mahim021/Aladin",
        liveUrl: "",
        featured: true
    },
    {
        title: "Football Tournament Manager",
        description: "A database-driven web application for managing football tournaments. Built with HTML, CSS, and PHP, using XAMPP server and MySQL database. Features dynamic SQL queries to fetch and display tournament data including teams, matches, standings, and statistics with an intuitive admin panel.",
        technologies: ["PHP", "MySQL", "XAMPP", "SQL", "HTML/CSS"],
        imageUrl: "../Assets/db_project.png",
        githubUrl: "https://github.com/Mahim021/Football-Tournament",
        liveUrl: "",
        featured: true
    },
    {
        title: "Full-Stack Web Application",
        description: "Built a comprehensive web platform using MERN stack with user authentication, real-time updates, and responsive design for seamless user experience.",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        imageUrl: "",
        githubUrl: "#",
        liveUrl: "#",
        featured: false
    },
    {
        title: "Laravel Web Platform",
        description: "Developed a robust web application using Laravel framework with MVC architecture, featuring admin panel, user management, and database optimization.",
        technologies: ["Laravel", "PHP", "MySQL", "Bootstrap"],
        imageUrl: "",
        githubUrl: "#",
        liveUrl: "#",
        featured: false
    },
    {
        title: "Machine Learning Project",
        description: "Created an ML model using Python for data analysis and prediction, implementing various algorithms and data visualization techniques.",
        technologies: ["Python", "ML", "Pandas", "Scikit-learn"],
        imageUrl: "",
        githubUrl: "#",
        liveUrl: "#",
        featured: false
    },
    {
        title: "Flutter Cross-Platform App",
        description: "Designed and developed a beautiful cross-platform mobile application using Flutter with state management, custom animations, and API integration.",
        technologies: ["Flutter", "Dart", "Firebase"],
        imageUrl: "",
        githubUrl: "#",
        liveUrl: "#",
        featured: false
    },
    {
        title: "Open Source Contributions",
        description: "Active contributor to various open-source projects, collaborating with developers worldwide and improving codebases with bug fixes and feature implementations.",
        technologies: ["Git", "GitHub", "Collaboration"],
        imageUrl: "",
        githubUrl: "https://github.com/Mahim021",
        liveUrl: "",
        featured: false
    }
];

// Sample experiences data from your portfolio
const experiences = [{
        role: "Self-Driven Projects",
        company: "Independent Developer",
        duration: "Present",
        description: "Building personal projects across multiple technologies including MERN stack, Laravel, Flutter, and Machine Learning. Focusing on creating practical applications while mastering modern development practices and design patterns. Developed 10+ personal projects showcasing various tech stacks, implemented complex features like authentication, real-time updates, and API integrations, and contributed to open-source projects on GitHub.",
        technologies: ["React", "Node.js", "Laravel", "Flutter", "Python"],
        order: 1
    },
    {
        role: "Academic Projects",
        company: "Computer Science Student",
        duration: "Ongoing",
        description: "Completed various academic projects as part of coursework, applying theoretical knowledge to practical implementations. Collaborated with peers on team projects and gained experience in software development lifecycle. Built data structures and algorithms implementations, created database-driven applications with proper schema design, and developed OOP-based projects demonstrating design principles.",
        technologies: ["Java", "C++", "Python", "MySQL"],
        order: 2
    },
    {
        role: "Freelance Development",
        company: "Freelancer",
        duration: "2023 - Present",
        description: "Taking on freelance opportunities to build web and mobile applications for clients. Delivering custom solutions while managing project requirements, timelines, and client communication. Delivered responsive web applications meeting client specifications, maintained clear communication and met project deadlines, and provided post-deployment support and maintenance.",
        technologies: ["React", "PHP", "Laravel", "Flutter"],
        order: 3
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing data)
        await Project.deleteMany({});
        await Experience.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert projects
        const insertedProjects = await Project.insertMany(projects);
        console.log(`✅ Inserted ${insertedProjects.length} projects`);

        // Insert experiences
        const insertedExperiences = await Experience.insertMany(experiences);
        console.log(`✅ Inserted ${insertedExperiences.length} experiences`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\nSummary:');
        console.log(`- Projects: ${insertedProjects.length}`);
        console.log(`- Experiences: ${insertedExperiences.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase();