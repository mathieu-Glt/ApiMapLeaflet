let monToken = 'pk.eyJ1IjoiZmxvcmlhbi1mbG9jb24iLCJhIjoiY2tldjJ1a3A5NDB1ZTJzcGNpOGJ1OTRxcSJ9.kFHGE_fRa8nxG2UN7DAaNA';
let map;
let markers;

//navigator est un gros objet qui nous permet de manipuler les propriétés de votre navigateur.
//la géolocalisation se trouve dans cet objet
function getLocation() 
{
    console.log(navigator);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        alert('Votre navigateur ne supporte pas la Geolocalisation !')
    }
    
}

function showPosition(position)
{
    console.log(position)
    console.log("coord latitude: " + position.coords.latitude)
    console.log("coord longitude: " + position.coords.longitude)
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    //on initialise la map en lui passant notre position (appel de fonction)
    addMap(latitude, longitude)
    //on fait apparaitre le formulaire qui est caché au départ
    document.getElementById("search").classList.remove("hide")
    //lorsque l'on envoi une requète dans le formulaire (gestion d'event)
    document.getElementById("search").addEventListener("submit", (e)=>{
        //on enlève le comportement du navigateur par défault.
        e.preventDefault()
        //on initialise la map en lui passant notre position (appel de fonction)
        getInfoLocalizationShop(latitude, longitude);
    })
    
}



/*function mestouches(e) {
    console.log('mestouches')
    console.log(e.keyCode)
    e.preventDefault()
    
    if (e.keyCode == 32) {
        //alert('espace')
        getInfoLocalizationShop()
    } else {
        alert('rien a declare')
    }
}*/

function getInfoLocalizationShop(latitude, longitude) {
    console.log('Shop')
    // On recupère la valeur de l'input du formulaire
    let keyword = document.querySelector('#business').value
    console.log(keyword)
    console.log(latitude)
    console.log(longitude)
    // On initialise une requête ajax
    // On uovre la requête
    //on efface les anciens markers (voir leaflet)
    markers.clearLayers();
    //markers.clearLayers();
    fetch('https://nominatim.openstreetmap.org/search?q='+keyword+' '+latitude+','+longitude+'&format=geocodejson')
    .then(response => response.json())
    .then((places) => {
        //récupération des places
        console.log(places.features)
        let object = places.features
        console.log(object)
        for (const objects of object) {
                //on crée notre marker de position avec son icon et on ajoute à la map.
                var marker = L.marker([objects.geometry.coordinates[1], objects.geometry.coordinates[0]]).addTo(map);
                //on stock ce qu'on va afficher dans la popup
                let popupContent = '<p>'+objects.properties.geocoding.label+'</p>';
                let popupContentType = '<p>'+objects.properties.geocoding.type+'</p>';
                //création de la popup sur le marker
                marker.bindPopup(popupContent);
                //ajout du marker à la map
                markers.addLayer(marker);


        }
    })
    .catch(err=>console.log(err))

}

function addMap(latitude, longitude)
{
    console.log('addMap')
    /*Initialisation de la map
      on définit le centre géographique et le zoom de la map.*/
    map = L.map('map').setView([latitude, longitude], 13);
    //console.log(map)

    markers = L.layerGroup().addTo(map);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 1,
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: monToken,
    }).addTo(map);
    
    let goldIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    
      //on crée notre marker de position avec son icon et on ajoute à la map.
    let marker = L.marker([latitude, longitude, -0.09], {icon: goldIcon}).addTo(map);
    //on crée notre marker de type cercle, le pointer sur la carte
    /*var circle = L.circle([latitude, longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 1000
    }).addTo(map);*/
    /*var polygon = L.polygon([
        [latitude + 0.001, longitude -0.03],
        [latitude + 0.001, -0.06],
        [latitude + 0.01, -0.047]
    ]).addTo(map);*/
        //on initialise l'icon de notre position
        /*const myIcon = L.icon({
            iconUrl: 'img/donald.jpg',
            iconSize: [50, 50],
        });*/
            /*const myIcon = L.icon({
            iconUrl: 'img/bluecircle.png',
            iconSize: [10, 10],
        });
    
    
    
        L.marker([latitude, longitude], {icon: myIcon}).addTo(map)
        .bindTooltip("Je suis ton pire cauchemard")
        .bindPopup('La maison du Lord!')*/
    
    
    
    //on crée une pop up au-dessus de l'icone de la map
    let popup = L.popup()
        .setLatLng([latitude, longitude])
        .setContent("You're here.")
        .openOn(map);
}

window.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM entièrement chargé et analysé");
  });


  getLocation();