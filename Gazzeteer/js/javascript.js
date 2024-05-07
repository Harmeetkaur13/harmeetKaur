$(document).ready(function () {
    // Define tile layers
    var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    });

    var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    });

    // Define basemaps
    var basemaps = {
        "Streets": streets,
        "Satellite": satellite
    };

    // Initialize Leaflet map
    var map = L.map('map', {
        layers: [streets]
    }).setView([54.5, -4], 6);

    // Add layer control
    var layerControl = L.control.layers(basemaps).addTo(map);

    // Add info button
    var infoBtn = L.easyButton("fa-info", function (btn, map) {
        $("#Modal").modal("show");
    }).addTo(map);

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

    // Event listener for country select dropdown
    $('#country').change(function () {
        var countryCode = $(this).val();

        // Fetch country border data using AJAX
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
                    if (map.hasLayer(countryLayer)) {
                        map.removeLayer(countryLayer);
                    }

                    // Create new country border layer and add to map
                    countryLayer = L.geoJSON(countryBorder.geometry, {
                        style: {
                            color: 'red', // Border color
                            weight: 2 // Border width
                        }
                    });
                    if (map.hasLayer(countryLayer)) {
                        map.removeLayer(countryLayer);
                    }

                    countryLayer.addTo(map);
                    // Fit map to country border bounds
                    map.fitBounds(countryLayer.getBounds());
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching country data:', errorThrown);
            }
        });
    });
});
