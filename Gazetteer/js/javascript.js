
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
    // // overlays

    var airports = L.markerClusterGroup({
        polygonOptions: {
            fillColor: "#fff",
            color: "#000",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.5
        }
    });

    var cities = L.markerClusterGroup({
        polygonOptions: {
            fillColor: "#fff",
            color: "#000",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.5
        }
    });

    var overlays = {
        Airports: airports,
        Cities: cities
    };

    // // icons

    var airportIcon = L.ExtraMarkers.icon({
        prefix: "fa",
        icon: "fa-plane",
        iconColor: "black",
        markerColor: "white",
        shape: "square"
    });
    var cityIcon = L.ExtraMarkers.icon({
        prefix: "fa",
        icon: "fa-city",
        markerColor: "green",
        shape: "square"
    });


    // Initialize Leaflet map
    var map = L.map('map', {
        layers: [streets, citygeoJSON]
    });
    map.setView([20.5937, 78.9629], 2);

    // Add layer control
    // var layerControl = L.control.layers(basemaps).addTo(map);
    var layerControl = L.control.layers(basemaps, overlays).addTo(map);
    layerControl.addTo(map);
    airports.addTo(map);
    cities.addTo(map);

    var infoBtn = L.easyButton({
        states: [{
            stateName: 'info ',
            title: 'Show Info',
            icon: 'fa-info ',
            onClick: function (btn, map) {
                $("#Modal").modal("show");
            }
        }]
    });

    var weatherBtn = L.easyButton({
        states: [{
            stateName: 'weather ',
            icon: 'fa-cloud-sun',
            title: 'Weather forecast',
            onClick: function (btn, map) {
                $("#Modal1").modal("show");
            }
        }]
    })
    var newsBtn = L.easyButton({
        states: [{
            stateName: 'news',
            icon: 'fa-newspaper',
            title: 'Breaking News',
            onClick: function (btn, map) {
                $("#Modal2").modal("show");
            }
        }]
    })
    var imagesBtn = L.easyButton({
        states: [{
            stateName: 'fa-images',
            icon: 'fa-image',
            title: 'Show country images',
            onClick: function (btn, map) {
                $("#Modal3").modal("show");
            }
        }]
    })
    var currncyBtn = L.easyButton({
        states: [{
            stateName: 'fa-currency',
            icon: 'fa-exchange-alt fa-pound-sign',
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
    getLocation();


    function getLocation() {
        if ("geolocation" in navigator) {
            //ask for permission
            if (confirm("Allow this site to access your location?")) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;

                    // Set map view to user's current location
                    map.setView([latitude, longitude], 7);

                    var geocoder = L.Control.Geocoder.nominatim();
                    geocoder.reverse(
                        L.latLng(latitude, longitude),
                        map.options.crs.scale(map.getZoom()),
                        function (results) {
                            if (results && results.length > 0) {
                                // Extract country from the reverse geocoding result
                                var selectElement = $('#country');
                                var selectedcountry = results[0].properties.address.country;
                                // console.log(country);
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
            //console.log(result.data); // Log country data to console

            // Populate select dropdown with country options
            $.each(result.data, function (index, country) {
                if (country.name == 'Kosovo') {
                    $('#country').append($("<option>", {
                        value: 'XK',
                        text: country.name
                    }));
                } else if ((country.name == 'N. Cyprus') || (country.name == 'Somaliland')) {
                    // console.log("skipped");
                } else {
                    $('#country').append($("<option>", {
                        value: country.code,
                        text: country.name
                    }));
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
        //console.log(countryCode)
        // filling the model(every model)(countryname)
        var modalElements = document.querySelectorAll('.modal');
        var selectElement = document.getElementById("country");

        // var modalHeader = document.querySelector('.modal-header');
        var countryName = selectElement.options[country.selectedIndex].text;
        // Select the element with the class "modal-title " from each model
        modalElements.forEach(function (modal) {
            var modalTitle = modal.querySelector('.modal-title');
            // // Change the text content of the element
            modalTitle.textContent = " " + countryName;
            // // Function to fetch and display a country flag
            function insertCountryFlag(countryCode) {
                var ElementImg = modal.querySelector('.country-flag');
                ElementImg.src = `https://flagcdn.com/108x81/${countryCode.toLowerCase()}.png`;
            }

            insertCountryFlag(countryCode);

        });
        /////call fetchCountryImages(country)///////////////////////////////////////////////////////////////////////////////////
        fetchCountryImages(countryName);
        fetchairports(countryCode, countryName);
        getCities(countryCode);
        fetchNews(countryCode);

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
                    $('.currencycode').html("From " + data.geonames[0].currencyCode);
                    $('#currencycodeF').val(data.geonames[0].currencyCode);
                    ////////////////
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
                    //console.log(cityName);
                    onweatherload(cityName);
                    getresultextchange("AED");
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
        newsBtn.addTo(map);
        currncyBtn.addTo(map);

        /////////////////////////////////////// Fetch country border data using AJAX
        $.ajax({
            url: 'php/data.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                // console.log(data)
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
                    // * Easy selector helper function*/
                    const select = (el, all = false) => {
                        el = el.trim()
                        if (all) {
                            return [...document.querySelectorAll(el)]
                        } else {
                            return document.querySelector(el)
                        }
                    }

                    /**
                * Preloader
                */
                    let preloader = select('#preloader');
                    if (preloader) {
                        window.addEventListener('load', () => {
                            preloader.remove()
                        });
                        preloader.remove();

                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching country data:', errorThrown);
            },


        });


    });

    // Function to fetch images for a selected country
    function onweatherload(cityName) {
        // console.log('enter function' + cityName);
        $.ajax({
            url: "php/weather.php",
            type: 'POST',
            dataType: 'json',
            data: {
                city: cityName,
            },
            success: function (response) {

                var resultCode = response.status.code
                // console.log(response);
                if (resultCode == 200) {

                    var d = response.data;
                    //console.log(d);

                    $('#weatherModalLabel').html(d.location.name + ", " + d.location.country);

                    $('#todayConditions').html(d.forecast.forecastday[0].day.condition.text);
                    $('#todayIcon').attr("src", d.forecast.forecastday[0].day.condition.icon);
                    $('#todayMaxTemp').html(Math.round(d.forecast.forecastday[0].day.maxtemp_c));
                    $('#todayMinTemp').html(Math.round(d.forecast.forecastday[0].day.mintemp_c));

                    $('#day1Date').text(new Date(d.forecast.forecastday[1].date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
                    $('#day1Icon').attr("src", d.forecast.forecastday[1].day.condition.icon);
                    $('#day1MinTemp').text(Math.round(d.forecast.forecastday[1].day.mintemp_c));
                    $('#day1MaxTemp').text(Math.round(d.forecast.forecastday[1].day.maxtemp_c));

                    $('#day2Date').text(new Date(d.forecast.forecastday[2].date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
                    $('#day2Icon').attr("src", d.forecast.forecastday[2].day.condition.icon);
                    $('#day2MinTemp').text(Math.round(d.forecast.forecastday[2].day.mintemp_c));
                    $('#day2MaxTemp').text(Math.round(d.forecast.forecastday[2].day.maxtemp_c));

                    $('#lastUpdated').text(new Date(d.current.last_updated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ", " + new Date(d.current.last_updated).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));

                    $('#pre-load').addClass("fadeOut");

                } else {
                    $('#Modal1 .modal-title').text("Error retrieving data");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error: ' + textStatus + ', ' + errorThrown);
                $('#Modal1 .modal-title').text("Error retrieving data");
            }
        });
    };




    $('#weatherModal').on('hidden.bs.modal', function (e) {

        $('#pre-load').removeClass("fadeOut");

        $('#todayConditions').html("");
        $('#todayIcon').attr("src", "");
        $('#todayMaxTemp').html("");
        $('#todayMinTemp').html("");

        $('#day1Date').text("");
        $('#day1Icon').attr("src", "");
        $('#day1MinTemp').text("");
        $('#day1MaxTemp').text("");

        $('#day2Date').text("");
        $('#day2Icon').attr("src", "");
        $('#day2MinTemp').text("");
        $('#day2MaxTemp').text("");

        $('#lastUpdated').text("");

    });


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
    function displayImages(images) {
        const imageContainer = document.getElementById('image-container');
        imageContainer.innerHTML = ''; // Clear previous images

        images.forEach(image => {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-container');

            const imgElement = document.createElement('img');
            imgElement.src = image.previewURL; // Use preview image URL
            imgElement.alt = image.tags;
            imgElement.classList.add('collage-image'); // Add a class for styling

            const popup = document.createElement('div');
            popup.classList.add('popup');
            popup.innerHTML = `${image.tags}<br><a href="${image.largeImageURL}" target="_blank"><u>Click</a></u> to see full image`;

            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(popup);

            // Add event listeners
            imgContainer.addEventListener('mouseover', () => {
                popup.style.display = 'block';
            });

            imgContainer.addEventListener('mouseout', () => {
                popup.style.display = 'none';
            });

            // Append image container to the main container
            imageContainer.appendChild(imgContainer);
        });
    }

    getCurrencyNames();
    function getCurrencyNames() {
        $.ajax({
            url: 'php/getcurrencyname.php',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                //console.log(response);
                $.each(response, function (code, name) {
                    $('.currencycodeTo').append($("<option>", {
                        value: code,
                        text: name
                    }));
                });



            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error: ' + textStatus + ', ' + errorThrown);
            }
        });
    }
    $('.currencycodeTo').change(function () {
        const tcurrency = $(this).val();
        getresultextchange(tcurrency);
    });


    function getresultextchange(Currency) {
        const baseCurrency = document.getElementById('currencycodeF').value;
        const targetCurrency = Currency; // Target currency for exchange rates
        //console.log("Change From", baseCurrency, "Change To", targetCurrency);

        $.ajax({
            url: 'php/getexchangerate.php',
            type: 'GET',
            dataType: 'json',
            data: {
                base: baseCurrency,
                target: targetCurrency
            },
            success: function (response) {
                if (response.rate) {
                    $('#Rate').val(response.rate);
                    $('#toAmount').val(numeral($('#amount').val() * $('#Rate').val()).format("0,0.00"));
                } else {
                    console.error('Error:', response.error);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error:', textStatus, errorThrown);
            }
        });
    };
    function calcResult() {

        $('#toAmount').val(numeral($('#amount').val() * $('#Rate').val()).format("0,0.00"));

    }

    $('#amount').on('keyup', function () {

        calcResult();

    })

    $('#amount').on('change', function () {

        calcResult();

    })

    $('#Rate').on('change', function () {

        calcResult();

    })
    $('#modal4').on('shown.bs.modal', function () {
        getresultextchange("AED");
    });





    //////////////////////////////////fetch airports and mark them to map

    function fetchairports(countrycode, countryName) {
        $.ajax({
            url: 'php/getairports.php',
            type: 'GET',
            dataType: 'json',
            data: {
                countrycode: countrycode
            },
            success: function (result) {
                //console.log(result); // Inspect the data fetched
                result.geonames.forEach(function (item) {
                    L.marker([item.lat, item.lng], { icon: airportIcon })
                        .bindTooltip(item.name, { direction: "top", sticky: true })
                        .addTo(airports);
                });

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('ERROR:', textStatus, errorThrown);
            }
        });
    }

    function getCities(countrycode) {
        $.ajax({
            url: "php/getCities.php",
            type: 'GET',
            dataType: 'json',
            data: {
                countrycode: countrycode
            },
            success: function (result) {

                result.geonames.forEach(function (item) {
                    L.marker([item.lat, item.lng], { icon: cityIcon })
                        .bindTooltip(
                            "<div class='col text-center'><strong>" +
                            item.name +
                            "</strong><br><i>(" +
                            numeral(item.population).format("0,0") +
                            ")</i></div>",
                            { direction: "top", sticky: true }
                        )
                        .addTo(cities);
                });

            },
            error: function (jqXHR, textStatus, errorThrown) {
                showToast("Cities - server error", 4000, false);
            }
        });
    }

    function showToast(message, duration, close) {
        Toastify({
            text: message,
            duration: duration,
            newWindow: true,
            close: close,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#870101"
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }
    //////////////////////////modal2 news 
    function fetchNews(country) {
        $.ajax({
            url: 'php/getnews.php',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                const articles = data.articles;
                const newsContainer = $('#news-container');
                newsContainer.empty(); // Clear previous news items

                articles.forEach(article => {
                    const newsItem = `
                        <table class="table table-borderless">
                            <tr>
                                <td rowspan="2" width="50%">
                                    <img class="img-fluid rounded" src="${article.urlToImage}" alt="${article.title}" title="${article.title}">
                                </td>
                                <td>
                                    <a href="${article.url}" class="fw-bold fs-6 text-black" target="_blank">${article.title}</a>
                                </td>
                            </tr>
                            <tr>
                                <td class="align-bottom pb-0">
                                    <p class="fw-light fs-6 mb-1">${article.source.name}</p>
                                </td>
                            </tr>
                        </table>
                        <hr>
                    `;

                    newsContainer.append(newsItem);
                });
            },
            error: function (xhr, status, error) {
                console.error('Error fetching news:', error);
            }
        });
    }
});


