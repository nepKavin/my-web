// Default contacts
const defaultContacts = [
    {
        name: "Bipassana Shakya",
        phone: "+977 9867331187",
        bloodGroup: "A+",
        address: "Butwal-2"
    },
    {
        name: "Dharma Shakya",
        phone: "+977 9847123456",
        bloodGroup: "B+",
        address: "Butwal-1"
    },
    {
        name: "Ratna Shakya",
        phone: "+977 9847987654",
        bloodGroup: "O+",
        address: "Butwal-3"
    },
    {
        name: "Sagar Shakya",
        phone: "+977 9867445566",
        bloodGroup: "AB+",
        address: "Butwal-4"
    },
    {
        name: "Manish Shakya",
        phone: "+977 9867112233",
        bloodGroup: "A+",
        address: "Butwal-5"
    }
];

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactList = document.getElementById('contactList');
const searchInput = document.getElementById('searchInput');
const addContactBtn = document.getElementById('addContactBtn');
const modal = document.getElementById('addContactModal');
const closeBtn = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');

// Initialize contacts
let contacts = JSON.parse(localStorage.getItem('contacts')) || defaultContacts;

// Save contacts to localStorage
const saveContacts = () => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
};

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Create contact card
const createContactCard = (contact) => {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.innerHTML = `
        <div class="contact-info">
            <h3>${contact.name}</h3>
            <p><i class="fas fa-phone"></i> ${contact.phone}</p>
            <p><i class="fas fa-tint"></i> ${contact.bloodGroup}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${contact.address}</p>
        </div>
        <div class="contact-actions">
            <a href="tel:${contact.phone.replace(/\s/g, '')}" class="btn-call">
                <i class="fas fa-phone"></i> Call
            </a>
            <a href="sms:${contact.phone.replace(/\s/g, '')}" class="btn-message">
                <i class="fas fa-sms"></i> Message
            </a>
        </div>
    `;
    return card;
};

// Display contacts
const displayContacts = (contactsToShow = contacts) => {
    contactList.innerHTML = '';
    contactsToShow.forEach(contact => {
        contactList.appendChild(createContactCard(contact));
    });
};

// Search contacts
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchTerm) ||
        contact.phone.includes(searchTerm) ||
        contact.bloodGroup.toLowerCase().includes(searchTerm) ||
        contact.address.toLowerCase().includes(searchTerm)
    );
    displayContacts(filteredContacts);
});

// Modal functionality
addContactBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Add new contact
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newContact = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        address: document.getElementById('address').value
    };
    
    contacts.push(newContact);
    saveContacts();
    displayContacts();
    
    contactForm.reset();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Initial display
displayContacts();
