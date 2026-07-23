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
const createContactCard = (contact, index) => {
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
            <button class="btn-edit" onclick="editContact(${index})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" onclick="deleteContact(${index})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
};

// Display contacts
const displayContacts = (contactsToShow = contacts) => {
    contactList.innerHTML = '';
    contactsToShow.forEach((contact, index) => {
        contactList.appendChild(createContactCard(contact, index));
    });
};

// Delete contact
const deleteContact = (index) => {
    if (confirm('Are you sure you want to delete this contact?')) {
        contacts.splice(index, 1);
        saveContacts();
        displayContacts();
    }
};

// Edit contact
const editContact = (index) => {
    const contact = contacts[index];
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('bloodGroup').value = contact.bloodGroup;
    document.getElementById('address').value = contact.address;
    
    // Store the index being edited
    contactForm.dataset.editIndex = index;
    
    // Change form submit button text
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Contact';
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

// Handle form submission (new contact or edit)
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newContact = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        address: document.getElementById('address').value
    };
    
    const editIndex = contactForm.dataset.editIndex;
    if (editIndex !== undefined) {
        // Editing existing contact
        contacts[editIndex] = newContact;
        delete contactForm.dataset.editIndex;
    } else {
        // Adding new contact
        contacts.push(newContact);
    }
    
    saveContacts();
    displayContacts();
    
    // Reset form and close modal
    contactForm.reset();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Save Contact';
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Reset form when opening modal for new contact
addContactBtn.addEventListener('click', () => {
    contactForm.reset();
    delete contactForm.dataset.editIndex;
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Save Contact';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

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

// View switching functionality
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');
const compactViewBtn = document.getElementById('compactViewBtn');
const contactGrid = document.getElementById('contactList');

// Function to update view buttons state
const updateViewButtons = (activeBtn) => {
    [gridViewBtn, listViewBtn, compactViewBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
};

// Save view preference
const saveViewPreference = (view) => {
    localStorage.setItem('contactViewPreference', view);
};

// Load view preference
const loadViewPreference = () => {
    return localStorage.getItem('contactViewPreference') || 'grid';
};

// Apply view
const applyView = (view) => {
    contactGrid.className = 'contact-grid ' + view + '-view';
    saveViewPreference(view);
};

// Set initial view
const initialView = loadViewPreference();
applyView(initialView);
updateViewButtons(document.getElementById(initialView + 'ViewBtn'));

// View switching event listeners
gridViewBtn.addEventListener('click', () => {
    updateViewButtons(gridViewBtn);
    applyView('grid');
});

listViewBtn.addEventListener('click', () => {
    updateViewButtons(listViewBtn);
    applyView('list');
});

compactViewBtn.addEventListener('click', () => {
    updateViewButtons(compactViewBtn);
    applyView('compact');
});

// Initial display
displayContacts();
