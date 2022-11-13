$(".leaflet-container").css("height", "0vh")

$(document).ready(function(){
  $("form").submit(function(event){
      var settings = {
          url: "https://api-adresse.data.gouv.fr/search/?q=" + $('.input-search').val() + "&type=housenumber&autocomplete=1",
          method: "GET",
          timeout: 0,
      };
      var settings_input2 = {
          url: "https://api-adresse.data.gouv.fr/search/?q=" + $('.input-add').val() + "&type=housenumber&autocomplete=1",
          method: "GET",
          timeout: 0,
      };

      $(".leaflet-container").css("height", "90vh")
      $(".leaflet-container").hide(0)
      $(".leaflet-container").show(1000)

      function fichierJson(data){   
        const postData = {
            num : `${data.properties.housenumber}`,
            rue : `${data.properties.street}`,
            ville : `${data.properties.city}`,
            codePostal : `${data.properties.postcode}`,
            latitude : `${data.geometry.coordinates[1]}`,
            longitude : `${data.geometry.coordinates[0]}`
        }
        return JSON.stringify(postData)
    }

      const LeafletSelection = (data) => {
          const setViewArray = data[0].geometry.coordinates
          console.log(data)          
          var map = L.map("map").setView([setViewArray[1], setViewArray[0]], 5);
          data.forEach((element) =>{
                const marker = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]]).addTo(map)
                marker.bindPopup(element.properties.label)
            })
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);
            var popup = L.popup()
            .setLatLng([48.843368, 2.429642])
            .setContent("<h3><p><b> Là c'est F2I <b></p><h3>")
            .openOn(map);
            function onMapClick(e) {
                alert("Vous" + e.latlng);
            }
            
            map.on('click', onMapClick);
            var popup = L.popup();

            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent("vous" + e.latlng.toString())
                    .openOn(map);
            }

            map.on('click', onMapClick);
        };
     
        setTimeout(() => {
        $.ajax(settings).done(function (response) {
            var dataArray = []

            dataArray.push(response.features[0])
            $.ajax({
                type: 'POST',
                url: 'index.php',
                data: {connexion: fichierJson(response.features[0])} 
             });

            $.ajax(settings_input2).done(function (response) {
                dataArray.push(response.features[0])
                $.ajax({
                    type: 'POST',
                    url: 'index.php',
                    data: {connexion2: fichierJson(response.features[0])}
                 });

                LeafletSelection(dataArray)
            });
        });
    }, 2100);

      event.preventDefault();
  })
})

mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'Leaflet &copy; ' + mapLink + ', contribution', maxZoom: 18 }).addTo(map);

		var taxiIcon = L.icon({
			iconSize: [70, 70]
		})

		var marker = L.marker([48.843368, 2.429642], { icon: taxiIcon }).addTo(map);

		map.on('click', function (e) {
			console.log(e)

L.Routing.control({
    waypoints: [
        L.latLng(48.843368, 2.429642),
        L.latLng(e.latlng.latitude, e.latlng.longitude)
    ]
}).on('routesfound', function (e) {
    var routes = e.routes;
    console.log(routes);

    e.routes[0].coordinates.forEach(function (coord, index) {
        setTimeout(function () {
            marker.setLatLng([coord.latitude, coord.longitude]);
        }, 100 * index)
    })

}).addTo(map);

})








