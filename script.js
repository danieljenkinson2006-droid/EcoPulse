
document.addEventListener('DOMContentLoaded', () => {

    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    const fetchBtn = document.getElementById('fetchDataBtn');
    const cityInput = document.getElementById('cityInput');
    const apiResults = document.getElementById('apiResults');

    fetchBtn.addEventListener('click', async () => {
        const city = cityInput.value.trim();
        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        apiResults.classList.remove('hidden');
        apiResults.innerHTML = "<em>Fetching data...</em>";

        try {
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                apiResults.innerHTML = `<span style="color:red;">City not found. Please try again.</span>`;
                return;
            }

            const lat = geoData.results[0].latitude;
            const lon = geoData.results[0].longitude;
            const cityName = geoData.results[0].name;

            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const weatherData = await weatherResponse.json();
            const current = weatherData.current_weather;

            apiResults.innerHTML = `
                <h3>Current Weather in ${cityName}</h3>
                <p><strong>Temperature:</strong> ${current.temperature}°C</p>
                <p><strong>Wind Speed:</strong> ${current.windspeed} km/h</p>
            `;
        } catch (error) {
            console.error("API Error:", error);
            apiResults.innerHTML = `<span style="color:red;">Failed to connect to the climate database.</span>`;
        }
    });

    const ecoForm = document.getElementById('ecoForm');
    const formFeedback = document.getElementById('formFeedback');

    ecoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const commute = document.getElementById('commute').value;
        const meatOption = document.querySelector('input[name="meat"]:checked').value;
        
        let score = 0;
        let advice = "";

        if (commute === 'walk') score += 50;
        else if (commute === 'transit') score += 30;
        else if (commute === 'car') {
            score += 10;
            advice += "Consider carpooling or taking transit to reduce emissions. ";
        }

        if (meatOption === 'none') score += 50;
        else if (meatOption === 'low') score += 30;
        else if (meatOption === 'high') {
            score += 10;
            advice += "Try introducing 'Meatless Mondays' into your routine! ";
        }

        formFeedback.classList.remove('hidden');
        formFeedback.innerHTML = `
            <h3>Your Eco-Score: ${score} / 100</h3>
            <p><strong>Feedback:</strong> ${score >= 80 ? 'Excellent job! You live a highly sustainable lifestyle.' : 'You are making progress! ' + advice}</p>
        `;
        
    });
    const imageSliders = document.querySelectorAll('.image-slider');

    imageSliders.forEach(slider => {
        slider.addEventListener('input', (event) => {
            const sliderValue = event.target.value;
            const foregroundImg = event.target.previousElementSibling;
            
            const clipValue = 100 - sliderValue;
            
            foregroundImg.style.clipPath = `inset(0 ${clipValue}% 0 0)`;
        });
    });
});
