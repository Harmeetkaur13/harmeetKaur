$(document).ready(function () {
    // Define tile layers
    var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    });

    var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    });
    // Layer to add country major city information  (helps to get exact location)
    citygeoJSON = L.geoJson([], {
        onEachFeature: function (cityFeature, layer) {

            layer.bindPopup(cityFeature.properties.popupContent);

        },
        pointToLayer: function (cityFeature, latlng) {

            var color,
                radius,
                pop;

            // pop uses the population. the replace feature is used to make the value into an integer as it could have the 
            // value of < 10,000 so " " , and < must be replaced with "" to make pop an integer through the parseInt which
            // converts it from a string to an int. This number is then divided by a million as some of the largest citiest 
            // have populations over billions. The value is then rounded up so smaller populated places go to a value of one.
            // The square is then taken so the difference between the much larger cities and smaller is not so different as
            // the gradient of y=sqrt(x) is less steep than y=x. the value is then multiplied by five so it can be seen by user
            pop = 5 * Math.sqrt(Math.ceil(parseInt(cityFeature.properties.population.replace(/,|<| /g, '')) / 1000000));
            color = 'black';
            radius = pop;

            return L.circleMarker(latlng, {
                color: color,
                radius: radius
            });

        }
    });


    // Define basemaps
    var basemaps = {
        "Streets": streets,
        "Satellite": satellite
    };

    // Initialize Leaflet map
    var map = L.map('map', {
        layers: [streets, citygeoJSON]
    });
    map.setView([20.5937, 78.9629], 2);

    // Add layer control
    var layerControl = L.control.layers(basemaps).addTo(map);


    var infoBtn = L.easyButton({
        states: [{
            stateName: 'fa-info',
            icon: '<img src="images/info.jpeg" style="width:1em;height:1em;">',
            title: 'Show Info',
            onClick: function (btn, map) {
                $("#Modal").modal("show");
            }
        }],
        className: 'custom-button'
    });

    var weatherBtn = L.easyButton({
        states: [{
            stateName: 'fa-weather',
            icon: '<img class ="imgicon" src="images/weather.jpeg" style="width:1em;height:1em;">',
            title: 'Show weather',
            onClick: function (btn, map) {
                $("#Modal1").modal("show");
            }
        }]
    })
    var timezoneBtn = L.easyButton({
        states: [{
            stateName: 'fa-timezone',
            icon: '<img class ="imgicon" src="images/timezone.jpeg" style="width:1em;height:1em;">',
            title: 'timezone',
            onClick: function (btn, map) {
                $("#Modal2").modal("show");
            }
        }]
    })
    var imagesBtn = L.easyButton({
        states: [{
            stateName: 'fa-images',
            icon: '<img class ="imgicon" src="images/gallery.jpeg" style="width:1em;height:1em;">',
            title: 'Show country images',
            onClick: function (btn, map) {
                $("#Modal3").modal("show");
            }
        }]
    })
    var currncyBtn = L.easyButton({
        states: [{
            stateName: 'fa-currency',
            icon: '<img class ="imgicon" src="images/currency.jpeg" style="width:1em;height:1em;">',
            title: 'currrency exchange',
            onClick: function (btn, map) {
                $("#Modal4").modal("show");
            }
        }]
    })
    ////////////////close button code
    // Select all modal elements with class 'modal'
    var modalElements = document.querySelectorAll('.modal');

    // Iterate over each modal element
    modalElements.forEach(function (modalElement) {
        // Find the close button inside each modal
        var closeButton = modalElement.querySelectorAll('.close-button');
        closeButton.forEach(function (Button) {
            // Attach click event listener to the close button
            Button.addEventListener('click', function () {
                // Hide the modal when the close button is clicked
                $('.modal').modal('hide');
            });
        });
    });
    ////////////////weather images style setting
    // Select all modal elements with class 'modal'
    var modalElement = document.querySelectorAll('.modal');

    // Iterate over each modal element
    modalElement.forEach(function (modalElement) {
        // // Find the close button inside each modal
        var img = modalElement.querySelectorAll('img')
        img.forEach(function (image) {
            // Adding styles to the image
            image.style.width = "40px"; // Set width
            image.style.height = "30px"; // Set height
        });

    });



    var countryLayer;
    // Get user's current location and set map view
    // JavaScript
    document.getElementById("getLocationimg").addEventListener("mouseenter", showDescription);
    document.getElementById("getLocationimg").addEventListener("mouseleave", hideDescription);
    function showDescription() {
        document.getElementById("description").style.visibility = "visible";
    }

    function hideDescription() {
        document.getElementById("description").style.visibility = "hidden";
    }

    setTimeout(getLocation, 50);
    document.getElementById("getLocationimg").addEventListener("click", getLocation);

    function getLocation() {
        if ("geolocation" in navigator) {
            //ask for permission
            if (confirm("Allow this site to access your location?")) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;

                    // Set map view to user's current location
                    map.setView([latitude, longitude], 7);
                    var marker = L.marker([latitude, longitude]).addTo(map);
                    var geocoder = L.Control.Geocoder.nominatim();
                    geocoder.reverse(
                        L.latLng(latitude, longitude),
                        map.options.crs.scale(map.getZoom()),
                        function (results) {
                            if (results && results.length > 0) {
                                // Extract country from the reverse geocoding result
                                var selectElement = $('#country');
                                var selectedcountry = results[0].properties.address.country;
                                console.log(country);
                                // Iterate over each option within the select element
                                selectElement.find('option').each(function () {
                                    // Compare the text of each option with the desired country name
                                    if ($(this).text() === selectedcountry) {
                                        // If the text matches, set the selected attribute of the option
                                        $(this).prop('selected', true);
                                        // Exit the loop since we found the matching option
                                        return false;
                                    }
                                });

                                // Trigger the change event to reflect the updated selection
                                selectElement.trigger('change');
                            }
                        }
                    );
                }, function (error) {
                    console.error('Error getting user location:', error);
                    // Default to a specific location if geolocation fails
                    map.setView([39.8283, -98.5795], 6);
                });
            }
        } else {
            console.error('Geolocation is not supported by this browser.');
            // Default to a specific location if geolocation is not supported
            map.setView([20.5937, 78.9629], 6);
        }
    }
    // Fill the select option with available countries from the border data file
    $.ajax({
        url: "php/select.php",
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            console.log(result.data); // Log country data to console

            // Populate select dropdown with country options
            $.each(result.data, function (index, country) {
                if (country.name == 'Kosovo') {
                    $('#country').append($("<option>", {
                        value: 'XK',
                        text: country.name
                    }));
                } else if ((country.name == 'N. Cyprus') || (country.name == 'Somaliland')) {
                    console.log("skipped");
                } else {
                    $('#country').append($("<option>", {
                        value: country.code,
                        text: country.name
                    }));
                }


            });
            var selecttofill = document.querySelector('#country');
            var options = selecttofill.querySelectorAll('option')
            options.forEach(function (option) {
                var countryName = option.text;
                if (countryName != 'Select Country') {
                    /////Populate selectcountryTo options in modal4 for currency exchange

                    $.ajax({
                        url: 'php/coordinates.php',
                        type: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            // console.log("the countryName is ", countryName, 'and currencyCode is', data[countryName]);
                            $('#currencycodeTo').append($("<option>", {
                                value: data[countryName].currencyCode,
                                text: countryName

                            }));
                        },

                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR, "problem in", countryName);
                        }
                    });
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching country data:', errorThrown);
        }
    });

    // Event listener for country select dropdown
    $('#country').change(function () {

        var countryCode = $(this).val();
        console.log(countryCode)
        // filling the model(every model)(countryname)
        var modalElements = document.querySelectorAll('.modal');
        var selectElement = document.getElementById("country");

        // var modalHeader = document.querySelector('.modal-header');
        var countryName = selectElement.options[country.selectedIndex].text;
        // Select the element with the class "modal-title " from each model
        modalElements.forEach(function (modal) {
            var modalTitle = modal.querySelector('.modal-title');
            // // Change the text content of the element
            modalTitle.textContent = countryName;
            // // Function to fetch and display a country flag
            function insertCountryFlag(countryCode) {
                var ElementImg = modal.querySelector('.country-flag');
                ElementImg.src = `https://flagcdn.com/108x81/${countryCode.toLowerCase()}.png`;
            }

            insertCountryFlag(countryCode);
        });
        /////call fetchCountryImages(country)///////////////////////////////////////////////////////////////////////////////////
        fetchCountryImages(countryName);
        fetchCoordinates(countryName);
        fetchairports(countryName);

        //////////////////////////////  /////////adding data to info button from countryinfo(geonames)/////////////////////////

        //const url = `http://api.geonames.org/countryInfoJSON?formatted=true&country=${countryCode}&username=harmeetkaur&style=full`;

        $.ajax({
            url: 'php/info.php',
            type: 'GET',
            dataType: 'json',
            data: {
                countryCode: countryCode
            },
            success: function (data) {
                if (data.geonames && data.geonames.length > 0) {
                    $('#txtcurrencyCode').html(data.geonames[0].currencyCode);
                    ///////filling currency selectFrom also 
                    $('#currencycodeFrom').html(data.geonames[0].currencyCode);
                    $('#txtCapital').html(data.geonames[0].capital);
                    $('#txtLanguages').html(data.geonames[0].languages);
                    var num = data.geonames[0].population;
                    function formatNumber(num) {
                        let str = num.toString().split('.');
                        str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        return str.join('.');
                    }
                    var population = formatNumber(num);
                    $('#txtPopulation').html(population);
                    var area = formatNumber(data.geonames[0].areaInSqKm);
                    $('#txtArea').html(area);
                    var cityName = data.geonames[0].capital;
                    console.log(cityName);
                    onweatherload(cityName);
                } else {
                    console.log('No data found');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        });

        infoBtn.addTo(map); ////add after fetching the details
        weatherBtn.addTo(map);
        imagesBtn.addTo(map);
        timezoneBtn.addTo(map);
        currncyBtn.addTo(map);

        /////////////////////////////////////// Fetch country border data using AJAX
        $.ajax({
            url: 'php/data.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data)
                var countryBorder = data.features.find(function (feature) {
                    return feature.properties.iso_a2 === countryCode;
                });

                if (countryBorder && countryBorder.geometry) {

                    // Remove existing country border layer
                    if (countryLayer) {
                        map.removeLayer(countryLayer);
                        map.setView([54.5, -4], 5);
                    }
                    // Create new country border layer and add to map
                    countryLayer = L.geoJSON(countryBorder.geometry, {
                        style: {
                            color: 'red', // Border color
                            weight: 1 // Border width
                        }
                    });

                    countryLayer.addTo(map);
                    // Fit map to country border bounds
                    map.fitBounds(countryLayer.getBounds());
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching country data:', errorThrown);
            },


        });

        async function fetchCoordinates(countryName) {
            try {
                // Fetch the JSON data from the PHP script
                let response = await fetch('php/coordinates.php');
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                let data = await response.json();
                console.log(data)
                console.log(countryName)
                // Check if the country exists in the data
                if (data.hasOwnProperty(countryName)) {

                    var latitude = data[countryName].latitude;
                    var longitude = data[countryName].longitude;
                    console.log(latitude, longitude);
                    //urltimezone = `http://api.geonames.org/timezoneJSON?formatted=true&lat=${latitude}&lng=${longitude}&username=harmeetkaur&style=full`;

                    /////////////////////////////////timezone getting for modal2
                    $.ajax({
                        url: "php/timezone.php",
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            latitude: latitude,
                            longitude: longitude
                        },
                        success: function (result) {

                            console.log(JSON.stringify(result));

                            if (result.status.name == "ok") {
                                $('#txtCountryc').html(result['data']['countryCode']);
                                $('#txtTimezoneid').html(result['data']['timezoneId']);
                                $('#txtcountryname').html(result['data']['countryName']);
                                $('#txttime').html(result['data']['time']);
                                $('#txtsunset').html(result['data']['sunset']);
                                $('#txtsunrise').html(result['data']['sunrise']);

                            }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(jqXHR)
                        }
                    });

                } else {
                    console.log('Country not found');
                }
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        }

    });
    function onweatherload(cityName) {
        ////////////////////get weather
        // Your OpenWeatherMap API key
        const apiKey = '5f3d65b1608a791d1d7629b27ff497fb';
        var selectElement = document.getElementById("country");
        var countryName = selectElement.options[country.selectedIndex].text;

        // Construct the URLs for current weather and forecast
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryName}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},${countryName}&appid=${apiKey}&units=metric`;
        // Make the API requests for current weather and forecast
        Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
            .then(responses => {
                // Parse the response data for current weather
                responses[0].json().then(currentWeatherData => {
                    // Handle the current weather data
                    var w = currentWeatherData.weather[0].description;
                    if (w.includes("cloud")) {
                        document.getElementById('currentimg').src = 'images/cloud.jpeg';
                    } else if (w.includes('rain')) {
                        document.getElementById('currentimg').src = 'images/rain.jpeg';
                    }
                    else if (w.includes('clear')) {
                        document.getElementById('currentimg').src = 'images/clear.jpeg';
                    } else { document.getElementById('currentimg').src = 'images/weather.jpeg'; }
                    document.getElementById('temperature').textContent = currentWeatherData.main.temp;
                    document.getElementById('feelslike').textContent = currentWeatherData.main.feels_like;
                    document.getElementById('maxtemp').textContent = currentWeatherData.main.temp_max;
                    document.getElementById('mintemp').textContent = currentWeatherData.main.temp_min;
                    document.getElementById('txtdescription').textContent = currentWeatherData.weather[0].description;

                });
                var today = new Date();
                console.log(today);
                // Parse the response data for forecast
                responses[1].json().then(forecastData => {
                    // Handle the forecast data
                    console.log('Forecast:', forecastData);
                    /////putting forcast images

                    const forecast = forecastData.list.slice(1, 4); // Extract first 3 items (next 3 days)
                    const imgday = ['day1img', 'day2img', 'day3img'];

                    for (let i = 0; i < imgday.length; i++) {
                        const day = forecast[i];
                        const we = day.weather[0].description; // Weather description

                        if (we.includes("cloud")) {
                            document.getElementById(imgday[i]).src = 'images/cloud.jpeg';
                        } else if (we.includes('rain')) {
                            document.getElementById(imgday[i]).src = 'images/rain.jpeg';
                        } else if (we.includes('clear')) {
                            document.getElementById(imgday[i]).src = 'images/clear.jpeg';
                        } else {
                            document.getElementById(imgday[i]).src = 'images/weather.jpeg';
                        }
                    }

                    document.getElementById('day1temp').textContent = forecastData.list[1].main.temp;
                    document.getElementById('day1desc').textContent = forecastData.list[1].weather[0].description;
                    document.getElementById('day2temp').textContent = forecastData.list[2].main.temp;
                    document.getElementById('day2desc').textContent = forecastData.list[2].weather[0].description;
                    document.getElementById('day3temp').textContent = forecastData.list[3].main.temp;
                    document.getElementById('day3desc').textContent = forecastData.list[3].weather[0].description;

                });
            })
            .catch(error => {
                // Handle errors
                console.error('Error fetching weather data:', error);
            });
    };
    //////////////////////modal3 pictues of selected country

    // Function to fetch images for a selected country
    function fetchCountryImages(country) {
        const apiKey = '43876912-55a11dcdbba58d1a16f418580';
        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(country)}&image_type=photo`;

        // Make a GET request to the Pixabay API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Process the response data
                displayImages(data.hits);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    // Function to display fetched images on the webpage in a collage-like layout
    function displayImages(images) {
        const imageContainer = document.getElementById('image-container');
        imageContainer.innerHTML = ''; // Clear previous images

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.previewURL; // Use preview image URL
            imgElement.alt = image.tags;
            imgElement.classList.add('collage-image'); // Add a class for styling

            // Append the image to the container
            imageContainer.appendChild(imgElement);
        });

        // Apply CSS for the collage layout
        imageContainer.classList.add('collage-container');
    }

    $('#currencycodeTo').change(function () {

        const apiKey = 'af7dd32b1b474dadbf3e55063a2fed53'; // Replace with your actual API key
        const baseCurrency = document.getElementById('currencycodeFrom').textContent; // Base currency for exchange rates
        const targetCurrency = $(this).val(); // Target currency for exchange rates
        console.log("chnage From", baseCurrency, "changeto", targetCurrency)
        const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}?symbols=${targetCurrency}&apikey=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch currency exchange rates');
                }
                return response.json();
            })
            .then(data => {
                const exchangeRate = data.rates[targetCurrency];
                document.querySelector('#currencySelected').innerHTML = targetCurrency;
                document.getElementById("convert").addEventListener("click", showResult);
                function showResult() {
                    var amount = document.querySelector('#amount').value;
                    console.log(amount, "amount", exchangeRate, "rate", " and result ", exchangeRate * amount);
                    document.querySelector('#amountResult').value = (exchangeRate * amount);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    })

    //////////////////////////////////fetch airports and mark them to map
    var airportMarkersLayer = L.layerGroup(); // Define a layer group to hold airport markers

    function fetchairports(countryName) {
        $.getJSON('files/airports.json', function (data) {
            console.log(data); // Inspect the data fetched

            // Clear existing markers
            airportMarkersLayer.clearLayers();

            // Filter airports by country
            const filteredAirports = data.filter(airport => airport.country === countryName).slice(0, 10);
            var markers = L.markerClusterGroup();

            // Check if L.ExtraMarkers.icon is available
            if (typeof L.ExtraMarkers !== 'undefined') {
                var airportIcon = L.ExtraMarkers.icon({
                    icon: 'fa-coffee',
                    markerColor: 'red',
                    shape: 'square',
                    prefix: 'fa'
                });
            } else {
                console.error('L.ExtraMarkers.icon is not defined or not loaded properly');
                return;
            }

            // Add markers for each filtered airport
            filteredAirports.forEach(airport => {
                var marker = L.marker([airport.latitude, airport.longitude], { icon: airportIcon })
                    .bindPopup(`<b>${airport.name}</b><br>${airport.city}`);
                markers.addLayer(marker);
            });

            airportMarkersLayer.addLayer(markers); // Add marker cluster group to the airportMarkersLayer
            map.addLayer(airportMarkersLayer); // Add airportMarkersLayer to the map

            // Adjust the view to the first airport in the list if available
            if (filteredAirports.length > 0) {
                const firstAirport = filteredAirports[0];
                map.setView([firstAirport.latitude, firstAirport.longitude], 5);
            }
        }).fail(function (jqxhr, textStatus, error) {
            console.error('Failed to fetch JSON:', textStatus, error);
        });
    }

});
