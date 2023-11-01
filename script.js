function getWeather()
{
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const long = urlParams.get('long');

    if(lat !== null && long !== null){
        putDataOnDocument(lat, long);
    }
    else {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            putDataOnDocument(latitude, longitude);
        });

    }
 
}

function putDataOnDocument(lat, long)
{
    const url= `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,windspeed_10m,cloudcover&timezone=America%2FSao_Paulo`;
   
    fetch(url)
    .then(response => response.json())
    .then(json => {
        const date = new Date();
        const dateParsed = JSON.stringify(date);
        const dateHour = dateParsed.substring(1,14) + ':00';
        const timeIndex = json.hourly.time.findIndex(time => time === dateHour);

        const data = {
            temperature: json.hourly.temperature_2m[timeIndex],
            humidity: json.hourly.relativehumidity_2m[timeIndex],
            precipitation: json.hourly.precipitation_probability[timeIndex],
            wind: json.hourly.windspeed_10m[timeIndex],
            cloud: json.hourly.cloudcover[timeIndex],
        }

        //const parsedData = JSON.stringify(data);
        //console.log(parsedData);
        document.getElementById('data').innerHTML = `
        <div class="vertical-center">
            <div style="display: flex; align-items: center;">
                <img src="./assets/${chooseIcon(data.precipitation, data.cloud)}.png" alt="Rain" width="168">
                <span class="color-white fs-lg fw-bold">${data.temperature}º</span>
            </div>
            <div class="" style="display: flex; flex-direction: column; justify-content: center; align-items: center;"> 
                <span class="color-white fs-sm">Precipitação: ${data.precipitation}%</span>
                <span class="color-white fs-sm">Humidade: ${data.humidity}%</span>
                <span class="color-white fs-sm">Vento: ${data.wind} Km/h</span>
                <span class="color-white fs-sm">Nuvens: ${data.cloud}%</span>
            </div>
        </div>
        `;
    });
}

function chooseIcon(precipitation, cloud){
    const body = document.getElementsByTagName('body')[0];
    body.className = '';

    if( precipitation < 30 ) {
        if(cloud <= 33) {
            body.classList.add('bg-blue');
            return 'sun';
        }
        else if( cloud <= 66 ){
            body.classList.add('bg-blue');
            return 'sun_cloud';
        }
        else {
            body.classList.add('bg-dark-green');
            return 'cloud';
        }
    }
    else if( precipitation <  60) {
        body.classList.add('bg-dark-green');
        return 'sun_rain'
    }
    else if( precipitation < 80) {
        body.classList.add('bg-dark-blue');
        return 'rain';
    }
    else {
        body.classList.add('bg-dark-blue');
        return 'rain_light';
    }
}

