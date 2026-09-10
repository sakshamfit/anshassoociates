// Property data for ANSH ASSOCIATES
const propertyData = [
    {
        id: 1,
        title: "Prestige Heights",
        location: "Bangalore, Karnataka",
        price: "₹2.5 Crores",
        image: "assets/img/properties/prestige-heights.jpg",
        features: ["4 BHK", "3 Bathrooms", "Balcony", "Parking"],
        description: "Luxury apartment with panoramic city views and premium amenities."
    },
    {
        id: 2,
        title: "Royal Palm Villas",
        location: "Mumbai, Maharashtra",
        price: "₹5.8 Crores",
        image: "assets/img/properties/royal-palm-villas.jpg",
        features: ["5 BHK", "4 Bathrooms", "Garden", "Pool"],
        description: "Spacious villa with private garden and swimming pool."
    },
    {
        id: 3,
        title: "Skyline Towers",
        location: "Hyderabad, Telangana",
        price: "₹1.9 Crores",
        image: "assets/img/properties/skyline-towers.jpg",
        features: ["3 BHK", "2 Bathrooms", "Balcony", "Gym"],
        description: "Modern high-rise with state-of-the-art fitness center."
    },
    {
        id: 4,
        title: "Heritage Manor",
        location: "Jaipur, Rajasthan",
        price: "₹3.2 Crores",
        image: "assets/img/properties/heritage-manor.jpg",
        features: ["4 BHK", "3 Bathrooms", "Terrace", "Heritage"],
        description: "Restored heritage property with modern amenities."
    }
];

// Function to populate property grid
function populatePropertyGrid() {
    const propGrid = document.getElementById('propGrid');
    const propCurrent = document.getElementById('propCurrent');

    if (!propGrid || !propCurrent) return;

    // Clear existing content
    propGrid.innerHTML = '';

    // Add property cards
    propertyData.forEach((property, index) => {
        const propertyCard = document.createElement('li');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}">
                <div class="property-overlay">
                    <div class="property-overlay-content">
                        <div class="property-overlay-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="property-overlay-text">View Details</div>
                    </div>
                </div>
            </div>
            <div class="property-content">
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${property.location}</span>
                </div>
                <div class="property-price">${property.price}</div>
                <div class="property-features">
                    ${property.features.map(feature => `<span class="property-feature">${feature}</span>`).join('')}
                </div>
                <p class="property-description">${property.description}</p>
            </div>
        `;

        // Add reveal animation attribute
        propertyCard.setAttribute('data-reveal', '');

        propGrid.appendChild(propertyCard);
    });

    // Update property counter
    propCurrent.textContent = `01`;
    // Total count would go in the second span, but we'll keep it static for now
    // In a real implementation, this would be dynamic based on total properties
}

// Initialize property data when DOM is loaded
document.addEventListener('DOMContentLoaded', populatePropertyGrid);

// Export for use in other modules if needed
window.propertyData = propertyData;
window.populatePropertyGrid = populatePropertyGrid;