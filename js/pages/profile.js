export function profile() {
    return `
<div class="page" id="page-profile">
    <div class="profile-hero">
        <h1>My Profile</h1>
        <p>Manage your account details and shipping addresses</p>
    </div>
    <div class="profile-content">
        <div class="profile-form">
            <h2>Personal Details</h2>
            <form id="profileForm">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" id="profileName">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" id="profileEmail" disabled>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" id="profilePhone">
                </div>
                <button type="submit" class="save-btn">Save Changes</button>
            </form>
        </div>
        <div class="address-section">
            <h2>Shipping Address</h2>
            <form id="addressForm">
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" name="address" id="profileAddress">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" name="city" id="profileCity">
                    </div>
                    <div class="form-group">
                        <label>Postal Code</label>
                        <input type="text" name="postalCode" id="profilePostal">
                    </div>
                </div>
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" name="country" id="profileCountry" value="South Africa">
                </div>
                <button type="submit" class="save-btn">Save Address</button>
            </form>
        </div>
    </div>
</div>
    `;
}

export function initProfilePage() {
    const savedUser = localStorage.getItem('brotusphere-user');
    if (!savedUser) {
        window.location.href = '/';
        return;
    }
    
    const user = JSON.parse(savedUser);
    document.getElementById('profileName').value = user.name || '';
    document.getElementById('profileEmail').value = user.email || '';
    
    // Load additional profile data if available
    const profileData = localStorage.getItem('brotusphere-profile');
    if (profileData) {
        const data = JSON.parse(profileData);
        document.getElementById('profilePhone').value = data.phone || '';
        document.getElementById('profileAddress').value = data.address || '';
        document.getElementById('profileCity').value = data.city || '';
        document.getElementById('profilePostal').value = data.postalCode || '';
        document.getElementById('profileCountry').value = data.country || 'South Africa';
    }
    
    // Profile form
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('profileName').value;
        const updatedUser = { ...user, name };
        localStorage.setItem('brotusphere-user', JSON.stringify(updatedUser));
        document.getElementById('authText').textContent = name;
        alert('Profile saved!');
    });
    
    // Address form
    document.getElementById('addressForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const profileData = {
            phone: document.getElementById('profilePhone').value,
            address: document.getElementById('profileAddress').value,
            city: document.getElementById('profileCity').value,
            postalCode: document.getElementById('profilePostal').value,
            country: document.getElementById('profileCountry').value
        };
        localStorage.setItem('brotusphere-profile', JSON.stringify(profileData));
        alert('Address saved!');
    });
}
