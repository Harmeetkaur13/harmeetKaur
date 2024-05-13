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
    }).setView([20.5937, 78.9629], 2);


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
        }]
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
    document.getElementById("getLocationimg").addEventListener("click", getLocation);

    function getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                // Set map view to user's current location
                map.setView([latitude, longitude], 10);
                var marker = L.marker([latitude, longitude]).addTo(map);
            }, function (error) {
                console.error('Error getting user location:', error);
                // Default to a specific location if geolocation fails
                map.setView([39.8283, -98.5795], 6);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
            // Default to a specific location if geolocation is not supported
            map.setView([20.5937, 78.9629], 6);
        }
    }

    // Event listener for country select dropdown
    $('#country').change(function () {

        var countryCode = $(this).val();
        console.log(countryCode)
        // filling the model(countryname)
        var selectElement = document.getElementById("country");
        var countryName = selectElement.options[country.selectedIndex].text;
        // Select the element with the class "modal-title"
        var modalTitle = document.querySelector('.modal-title');
        var modalHeader = document.querySelector('.modal-header');
        // // Change the text content of the element
        modalTitle.textContent = countryName;
        // // Function to fetch and display a country flag
        function insertCountryFlag(countryCode) {
            var ElementImg = document.querySelector('.country-flag');
            ElementImg.src = `https://flagcdn.com/108x81/${countryCode.toLowerCase()}.png`;
        }
        insertCountryFlag(countryCode);

        ////////////////////////////////////////adding data to info button from countryinfo(geonames)

        const url = `http://api.geonames.org/countryInfoJSON?formatted=true&country=${countryCode}&username=harmeetkaur&style=full`;

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data.geonames[0]);
                $('#txtcurrencyCode').html(data.geonames[0].currencyCode);
                $('#txtCapital').html(data.geonames[0].capital);
                $('#txtLanguages').html(data.geonames[0].languages);
                $('#txtPopulation').html(data.geonames[0].population);
                $('#txtArea').html(data.geonames[0].areaInSqKm);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
            }
        });
        infoBtn.addTo(map); ////add after fetching the details
        weatherBtn.addTo(map);

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

    });


    // Fill the select option with available countries from the border data file

    $.ajax({
        url: "php/select.php",
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            // console.log(result.data); // Log country data to console

            // Populate select dropdown with country options
            $.each(result.data, function (index, country) {
                $('#country').append($("<option>", {
                    value: country.code,
                    text: country.name
                }));
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error fetching country data:', errorThrown);
        }
    });

});
