// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const filterButtons = document.querySelectorAll('.filter-btn');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// Pagination Elements
const projectsContainer = document.getElementById('projectsContainer');
const projectSearch = document.getElementById('projectSearch');
const searchResults = document.getElementById('searchResults');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const projectsCount = document.getElementById('projectsCount');
const shownCount = document.getElementById('shownCount');
const totalCount = document.getElementById('totalCount');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const totalProjectsSpan = document.getElementById('totalProjects');

// Project Management Variables
let allProjects = [];
let filteredProjects = [];
let displayedProjects = [];
let currentFilter = 'all';
let currentSearch = '';
let projectsPerPage = 6;
let currentPage = 1;
let isLoading = false;

// Your Actual Projects Data
const actualProjects = [
    {
        id: 1,
        title: "Intelligent Water Purification System Mobile App",
        description: "Cross-platform mobile application for monitoring and controlling water purification systems with real-time data and alerts.",
        category: "flutter",
        technologies: ["Flutter", "Dart", "Firebase", "Provider"],
        image: "Mobile.jpg",
        github: "https://alihussain424.github.io/IWPS-Mobile-App/",
        demo: "#",
        date: "2024-03-01"
    },
    {
        id: 2,
        title: "Pizza Delivery Website",
        description: "Responsive food ordering website with menu browsing, cart functionality, and order tracking.",
        category: "web",
        technologies: ["HTML", "CSS", "JavaScript", "GitHub"],
        image: "pizza.jpg",
        github: "https://alihussain424.github.io/Pizza/",
        demo: "https://alihussain424.github.io/Pizza/",
        date: "2024-02-15"
    },
    {
        id: 3,
        title: "AI Driven Shopping Website",
        description: "Intelligent shopping platform with personalized recommendations and predictive analytics.",
        category: "web",
        technologies: ["HTML", "CSS", "JavaScript", "AI Integration"],
        image: "ai-shopping.jpg",
        github: "https://alihussain424.github.io/E-commerce-website/",
        demo: "https://alihussain424.github.io/E-commerce-website/",
        date: "2024-02-01"
    },
    {
        id: 4,
        title: "Gym & Fitness Website",
        description: "Complete fitness platform with workout plans, member management, and progress tracking.",
        category: "web",
        technologies: ["HTML", "CSS", "JavaScript", "Responsive"],
        image: "gym.jpg",
        github: " https://alihussain424.github.io/Gym-ai-intigrative-website/",
        demo: "#",
        date: "2024-01-20"
    },
    {
        id: 5,
        title: "MATLAB Signal Processing",
        description: "Digital signal processing algorithms for noise reduction in audio signals.",
        category: "matlab",
        technologies: ["MATLAB", "DSP", "Algorithms"],
        image: "Matlab.JPG",
        github: "https://github.com/Alihussain424",
        demo: "#",
        date: "2024-01-10"
    },
    {
        id: 6,
        title: "WordPress E-commerce Site",
        description: "Custom WordPress theme development with WooCommerce integration for online business.",
        category: "wordpress",
        technologies: ["WordPress", "PHP", "CSS", "WooCommerce"],
        image: "woocommerce.png",
        github: "#",
        demo: "#",
        date: "2024-01-05"
    },
    {
        id: 7,
        title: "Figma UI/UX Designs",
        description: "Complete design system and UI kits for various mobile and web applications.",
        category: "figma",
        technologies: ["Figma", "UI/UX", "Prototyping"],
        image: "figma.JPG",
        github: "#",
        demo: "#",
        date: "2024-01-01"
    }
];

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Submission with Formspree
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        const formData = new FormData(this);
        
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .catch(error => {
            alert('Oops! There was a problem. Please email me directly.');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ========== PROJECTS MANAGEMENT SYSTEM ==========

// Initialize Projects
function initializeProjects() {
    allProjects = [...actualProjects];
    filteredProjects = [...allProjects];
    displayProjects();
    updateProjectsCount();
}

// Filter Projects
function filterProjects() {
    let filtered = allProjects;
    
    // Apply search filter
    if (currentSearch.trim()) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(project => 
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
        );
    }
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(project => project.category === currentFilter);
    }
    
    return filtered;
}

// Display Projects
function displayProjects() {
    projectsContainer.innerHTML = '';
    
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    displayedProjects = filteredProjects.slice(startIndex, endIndex);
    
    if (displayedProjects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="no-results active">
                <i class="fas fa-search"></i>
                <h3>No projects found</h3>
                <p>Try changing your search or filter criteria</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    displayedProjects.forEach(project => {
        const template = document.getElementById('projectTemplate');
        const clone = template.content.cloneNode(true);
        const projectCard = clone.querySelector('.project-card');
        
        projectCard.setAttribute('data-category', project.category);
        projectCard.querySelector('.project-badge').textContent = 
            project.category.charAt(0).toUpperCase() + project.category.slice(1);
        
        const img = projectCard.querySelector('img');
        img.src = project.image;
        img.alt = project.title;
        
        // Add lazy loading for images
        img.loading = 'lazy';
        
        projectCard.querySelector('h3').textContent = project.title;
        projectCard.querySelector('p').textContent = project.description;
        
        const techContainer = projectCard.querySelector('.project-tech');
        project.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            techContainer.appendChild(span);
        });
        
        const linksContainer = projectCard.querySelector('.project-links');
        
        if (project.github && project.github !== '#') {
            const githubLink = document.createElement('a');
            githubLink.href = project.github;
            githubLink.target = '_blank';
            githubLink.innerHTML = '<i class="fab fa-github"></i> Code';
            linksContainer.appendChild(githubLink);
        }
        
        if (project.demo && project.demo !== '#') {
            const demoLink = document.createElement('a');
            demoLink.href = project.demo;
            demoLink.target = '_blank';
            demoLink.innerHTML = '<i class="fas fa-external-link-alt"></i> Live Demo';
            demoLink.className = 'project-demo';
            linksContainer.appendChild(demoLink);
        }
        
        projectsContainer.appendChild(projectCard);
    });
    
    updatePagination();
}

// Update Projects Count
function updateProjectsCount() {
    const total = filteredProjects.length;
    const shown = Math.min(currentPage * projectsPerPage, total);
    
    shownCount.textContent = shown;
    totalCount.textContent = total;
    totalProjectsSpan.textContent = total > 7 ? `${total}+` : total;
    
    // Update hero stats
    document.querySelector('.stat h3').textContent = total > 7 ? `${total}+` : total;
}

// Update Pagination
function updatePagination() {
    const total = filteredProjects.length;
    const totalPages = Math.ceil(total / projectsPerPage);
    
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    // Show/hide load more button
    if (currentPage < totalPages) {
        loadMoreBtn.style.display = 'flex';
    } else {
        loadMoreBtn.style.display = 'none';
    }
    
    updateProjectsCount();
}

// Load More Projects
loadMoreBtn.addEventListener('click', () => {
    if (isLoading) return;
    
    const total = filteredProjects.length;
    const totalPages = Math.ceil(total / projectsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        isLoading = true;
        
        // Show loading state
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            displayProjects();
            isLoading = false;
            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Projects';
            loadMoreBtn.disabled = false;
            
            // Smooth scroll to new projects
            const newProjects = document.querySelectorAll('.project-card');
            if (newProjects.length > projectsPerPage) {
                newProjects[newProjects.length - projectsPerPage].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 500);
    }
});

// Filter Buttons
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        currentFilter = button.getAttribute('data-filter');
        currentPage = 1;
        
        // Update filtered projects
        filteredProjects = filterProjects();
        displayProjects();
        
        // Hide search results
        searchResults.classList.remove('active');
    });
});

// Search Functionality
let searchTimeout;
projectSearch.addEventListener('input', () => {
    currentSearch = projectSearch.value;
    currentPage = 1;
    
    clearTimeout(searchTimeout);
    
    if (currentSearch.trim()) {
        searchTimeout = setTimeout(() => {
            // Show search results dropdown
            const searchLower = currentSearch.toLowerCase();
            const results = allProjects.filter(project => 
                project.title.toLowerCase().includes(searchLower) ||
                project.description.toLowerCase().includes(searchLower)
            ).slice(0, 5); // Show only top 5 results
            
            if (results.length > 0) {
                searchResults.innerHTML = '';
                results.forEach(project => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <h4>${project.title}</h4>
                        <p>${project.category.charAt(0).toUpperCase() + project.category.slice(1)} • ${project.technologies.slice(0, 2).join(', ')}</p>
                    `;
                    resultItem.addEventListener('click', () => {
                        projectSearch.value = project.title;
                        currentSearch = project.title;
                        searchResults.classList.remove('active');
                        filteredProjects = filterProjects();
                        displayProjects();
                    });
                    searchResults.appendChild(resultItem);
                });
                searchResults.classList.add('active');
            } else {
                searchResults.classList.remove('active');
            }
            
            // Update filtered projects
            filteredProjects = filterProjects();
            displayProjects();
        }, 300);
    } else {
        searchResults.classList.remove('active');
        filteredProjects = filterProjects();
        displayProjects();
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!projectSearch.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
    }
});

// Image Error Handling
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const parent = e.target.closest('.project-image');
            if (parent) {
                const badge = parent.querySelector('.project-badge');
                const category = badge ? badge.textContent.toLowerCase() : 'project';
                
                const gradients = {
                    'flutter': 'linear-gradient(135deg, #02569B, #0175C2)',
                    'web': 'linear-gradient(135deg, #F7DF1E, #000000)',
                    'wordpress': 'linear-gradient(135deg, #21759B, #464646)',
                    'matlab': 'linear-gradient(135deg, #0076A8, #000000)',
                    'figma': 'linear-gradient(135deg, #F24E1E, #FF7262)'
                };
                
                parent.style.background = gradients[category] || 'linear-gradient(135deg, var(--primary), var(--secondary))';
                parent.style.display = 'flex';
                parent.style.alignItems = 'center';
                parent.style.justifyContent = 'center';
                parent.style.color = 'white';
                parent.style.fontWeight = 'bold';
                parent.style.fontSize = '1.2rem';
                parent.textContent = e.target.alt || 'Project Image';
                e.target.style.display = 'none';
            }
        }
    }, true);
});

// Skill Bars Animation on Scroll
const skillBars = document.querySelectorAll('.skill-level');
const skillsSection = document.getElementById('skills');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.width = width;
        }, 100);
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (skillsSection) {
    observer.observe(skillsSection);
}

// Flutter Icon Style
const style = document.createElement('style');
style.textContent = `
    .fa-flutter {
        position: relative;
        font-style: normal;
    }
    .fa-flutter:before {
        content: 'Fl';
        font-weight: bold;
        font-family: 'Poppins', sans-serif;
    }
`;
document.head.appendChild(style);

// Hero Animation
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    heroTitle.style.opacity = '0';
    heroSubtitle.style.opacity = '0';
    heroButtons.style.opacity = '0';
    
    setTimeout(() => {
        heroTitle.style.transition = 'opacity 1s ease';
        heroTitle.style.opacity = '1';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 1s ease';
            heroSubtitle.style.opacity = '1';
            
            setTimeout(() => {
                heroButtons.style.transition = 'opacity 1s ease';
                heroButtons.style.opacity = '1';
            }, 300);
        }, 300);
    }, 500);
    
    // Initialize projects
    initializeProjects();

});

