const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
       
            const projetosSection = document.querySelector('#projetos');
            if (projetosSection) {
                projetosSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);


document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('section, .card');
    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('#hero h2');
    
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerText = '';
        let i = 0;
        
        function typeEffect() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeEffect, 50);
            }
        }
        
        typeEffect();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const projectCount = cards.length;
 
    const projetosSection = document.querySelector('#projetos h2');
    if (projetosSection && projectCount > 0) {
        const subtitle = document.createElement('p');
        subtitle.style.fontSize = '1rem';
        subtitle.style.color = '#999';
        subtitle.style.marginTop = '10px';
        subtitle.innerText = `${projectCount} projetos criados`;
        projetosSection.parentElement.insertBefore(subtitle, projetosSection.nextElementSibling);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
  
    const contatoInfo = document.querySelector('.contato-info');
    
    if (contatoInfo) {
        const email = 'anselmovarela700@gmail.com';
        const phone = '939264345';
        
        const emailParagraph = Array.from(document.querySelectorAll('.contato-info p'))
            .find(p => p.innerText.includes('Email'));
        const phoneParagraph = Array.from(document.querySelectorAll('.contato-info p'))
            .find(p => p.innerText.includes('Telefone'));
        
        if (emailParagraph) {
            const emailLink = emailParagraph.querySelector('a') || 
                              emailParagraph.innerText.split(': ')[1];
            
            emailParagraph.innerHTML = `<strong>Email:</strong> <a href="mailto:${email}" style="color: #007BFF; text-decoration: none;">${email}</a>`;
        }
        
        if (phoneParagraph) {
            const phoneLink = phoneParagraph.querySelector('a') || 
                              phoneParagraph.innerText.split(': ')[1];
            
            phoneParagraph.innerHTML = `<strong>Telefone:</strong> <a href="tel:+351${phone}" style="color: #007BFF; text-decoration: none;">${phone}</a>`;
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTopBtn';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #007BFF, #00C6FF);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.6)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function animateCounter(element, target, duration = 1000) {
        let current = 0;
        const increment = target / (duration / 16);
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.innerText = target;
                clearInterval(counter);
            } else {
                element.innerText = Math.floor(current);
            }
        }, 16);
    }
    
});