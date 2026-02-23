// Get geolocation on page load
document.addEventListener('DOMContentLoaded', function() {
    const locationNotice = document.querySelector('.location-notice');
    const cityInput = document.getElementById('city');
    
    // Check if geolocation is available
    if (navigator.geolocation) {
        // Request user's location
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Use reverse geocoding to get city name from coordinates
                // Using Nominatim reverse geocoding
                const reverseGeoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                
                fetch(reverseGeoUrl)
                    .then(response => response.json())
                    .then(data => {
                        // Extract city name from the response
                        const city = data.address?.city || 
                                    data.address?.town || 
                                    data.address?.village || 
                                    data.address?.county ||
                                    data.name ||
                                    '';
                        
                        if (city) {
                            cityInput.value = city;
                            locationNotice.style.display = 'none';
                            
                            // Update location notice with success message
                            const successNotice = document.createElement('div');
                            successNotice.className = 'location-notice';
                            successNotice.style.background = 'rgba(76, 175, 80, 0.15)';
                            successNotice.style.color = '#4CAF50';
                            successNotice.style.borderLeft = '5px solid #4CAF50';
                            successNotice.innerHTML = '<i class="fas fa-check-circle"></i> Location detected: ' + city;
                            locationNotice.parentNode.insertBefore(successNotice, locationNotice);
                        }
                    })
                    .catch(error => {
                        console.log('Reverse geocoding error:', error);
                        showLocationError('Could not determine your city location');
                    });
            },
            function(error) {
                handleLocationError(error, locationNotice);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000 // Cache location for 5 minutes
            }
        );
    } else {
        // Geolocation not supported
        showLocationError('Geolocation is not supported by your browser');
    }
    
    // Add form input event listeners
    cityInput.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
    });
    
    cityInput.addEventListener('blur', function() {
        this.style.borderColor = '#e8e8f0';
    });
});

// Handle geolocation errors
function handleLocationError(error, locationNotice) {
    let errorMessage = '';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in browser settings.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        default:
            errorMessage = 'An error occurred while retrieving location.';
    }
    
    showLocationError(errorMessage);
}

// Show location error message
function showLocationError(message) {
    const locationNotice = document.querySelector('.location-notice');
    locationNotice.style.background = 'rgba(252, 92, 101, 0.15)';
    locationNotice.style.color = '#fc5c65';
    locationNotice.style.borderLeft = '5px solid #fc5c65';
    locationNotice.innerHTML = '<i class="fas fa-triangle-exclamation"></i> ' + message;
    locationNotice.style.marginBottom = '20px';
}