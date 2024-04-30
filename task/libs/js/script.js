$('#btnRun').click(function () {

	$.ajax({
		url: "libs/php/getCountryInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: $('#selCountry').val(),
			lang: $('#selLanguage').val()
		},
		success: function (result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

				$('#txtContinent').html(result['data'][0]['continent']);
				$('#txtCapital').html(result['data'][0]['capital']);
				$('#txtLanguages').html(result['data'][0]['languages']);
				$('#txtPopulation').html(result['data'][0]['population']);
				$('#txtArea').html(result['data'][0]['areaInSqKm']);

			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	});

});

$('#btnRun1').click(function () {

	$.ajax({
		url: "libs/php/getTimezone.php",
		type: 'POST',
		dataType: 'json',
		data: {
			latitude: $('#latitude').val(),
			longitude: $('#longitude').val()
		},
		success: function (result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

				$('#txtCountrycode').html(result['data']['countryCode']);
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

});

$('#btnRun2').click(function () {

	$.ajax({
		url: "libs/php/getneighbourhood.php",
		type: 'POST',
		dataType: 'json',
		data: {
			lati: $('#lati').val(),
			longi: $('#longi').val()
		},

		success: function (result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

				$('#txtContCode').html(result['data']['neighbourhood']['countryCode']);
				$('#txtCName').html(result['data']['neighbourhood']['countryName']);
				$('#txtName').html(result['data']['neighbourhood']['name']);
				$('#txtcity').html(result['data']['neighbourhood']['city']);

			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR)
		}
	});

});
$('#btnRun3').click(function () {

	$.ajax({
		url: "libs/php/getfindNearbyPlaceName.php",
		type: 'POST',
		dataType: 'json',
		data: {
			longg: $('#longg').val(),
			latt: $('#latt').val()
		},
		success: function (result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

				$('#txtContID').html(result['data'][0]['countryId']);
				$('#txtTzone').html(result['data'][0]['timezone']['timeZoneId']);
				$('#txtdistance').html(result['data'][0]['distance']);
				$('#txtContName').html(result['data'][0]['countryName']);
				$('#txtContiCode').html(result['data'][0]['continentCode']);

			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	});

});