// LIFF app configuration
const LIFF_ID = '2007060601-PvMk1EVZ'; // Replace with your LIFF ID
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrfm3f1wtSv0-HjwYHoN8WJz-2xqGLv_GqkSPMD4eBuDngtW-u1xnQdWZ4V2_dvdND7g/exec'; // Replace with your deployed Google Apps Script URL

// Initialize LIFF
document.addEventListener('DOMContentLoaded', () => {
    initializeLIFF();
});

async function initializeLIFF() {
    try {
        await liff.init({ liffId: LIFF_ID });
        
        // Check if user is logged in
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }

        // Get user profile and display it
        const profile = await liff.getProfile();
        displayProfile(profile);

        // Fetch membership data
        await fetchMembershipData(profile.userId);

    } catch (error) {
        console.error('Error initializing LIFF:', error);
        alert('Failed to initialize LIFF. Please try again.');
    }
}

function displayProfile(profile) {
    document.getElementById('profilePicture').src = profile.pictureUrl;
    document.getElementById('displayName').textContent = profile.displayName;
    document.getElementById('statusMessage').textContent = profile.statusMessage || 'No status message';
    
    // Show content and hide loading spinner
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('content').classList.remove('d-none');
}

async function fetchMembershipData(userId) {
    try {
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?userId=${userId}`, {
            method: 'GET',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch membership data');
        }

        const data = await response.json();
        displayMembershipData(data);

    } catch (error) {
        console.error('Error fetching membership data:', error);
        alert('Failed to fetch membership data. Please try again.');
    }
}

function displayMembershipData(data) {
    document.getElementById('membershipStatus').textContent = data.status;
    document.getElementById('memberSince').textContent = `Member since: ${data.memberSince}`;
    document.getElementById('points').textContent = `Points: ${data.points}`;
    document.getElementById('tier').textContent = `Tier: ${data.tier}`;
}
