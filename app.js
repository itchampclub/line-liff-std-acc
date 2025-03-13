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

function fetchMembershipData(userId) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${GOOGLE_APPS_SCRIPT_URL}?userId=${userId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                displayMembershipData(data);
            } catch (error) {
                console.error('Error parsing membership data:', error);
                alert('Failed to parse membership data. Please try again.');
            }
        } else {
            console.error('Error fetching membership data:', xhr.statusText);
            alert('Failed to fetch membership data. Please try again.');
        }
    };

    xhr.onerror = function() {
        console.error('Network error occurred');
        alert('Network error occurred. Please check your connection and try again.');
    };

    xhr.send();
}

function displayMembershipData(data) {
    document.getElementById('membershipStatus').textContent = data.status;
    document.getElementById('memberSince').textContent = `Member since: ${data.memberSince}`;
    document.getElementById('points').textContent = `Points: ${data.points}`;
    document.getElementById('tier').textContent = `Tier: ${data.tier}`;
}
