var express = require('express');
var app = express();
var port = 3000;

var datos = 
{
	"playlists":[
		{
		  "name":"Lista 1",
		  "canciones":[
		     {
		        "title":"cancion 1",
		        "artist":"artista 1",
		        "album":"album 1"
		     },
		     {
		        "title":"cancion 2",
		        "artist":"artista 7",
		        "album":"album 3"
		     },
		     {
		        "title":"cancion 3",
		        "artist":"artista 2",
		        "album":"album 5"
		     }
		  ]
		},
		 {
		  "name":"Lista 2",
		  "canciones":[
		     {
		        "title":"cancion 4",
		        "artist":"artista 1",
		        "album":"album 1"
		     },
		     {
		        "title":"cancion 5",
		        "artist":"artista 7",
		        "album":"album 3"
		     },
		     {
		        "title":"cancion 6",
		        "artist":"artista 2",
		        "album":"album 5"
		     }
		  ]
		}
	]
};

app.listen(port, ()=>{
    console.log("Servidor corriendo en el puerto "+port+"\n");
}); 

app.get("/obtenerListas", (req, res)=> {
    res.send(datos.playlists);
});

app.post("/crearLista", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var lista = {"name":nombreLista, "canciones":[]};
	datos.playlists.push(lista);
	console.log("Se creó la lista: "+JSON.stringify(lista));
	res.send(datos.playlists);
}); // Se crea bajo un nombre dado, sin canciones
	// try{ req.headers.nombreLista != undefined }

app.post("/agregarCancionJ", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var cancion = JSON.parse(req.headers.cancion);
	var i = 0, index = 0, flag = 0;
	while( (i < datos.playlists.length) && (flag == 0) ){
		if(datos.playlists[i].name === nombreLista) {index = i; flag = 1};
		i++;
	};
	datos.playlists[index].canciones.push(cancion);
	console.log("Se agregó la cancion:"+JSON.stringify(cancion)+"a la lista: "+nombreLista);
	res.send(datos.playlists);
}); // Se agrega una canción a una lista dada. Si la lista no se encuentra, retorna un error.

app.post("/agregarCancion", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var titulo = req.headers.titulo;
	var artista = req.headers.artista;
	var album = req.headers.album;
	
	var cancion = {"title": titulo, "artist":artista, "album":album};
	var i = 0, index = 0, flag = 0;
	while( (i < datos.playlists.length) && (flag == 0) ){
		if(datos.playlists[i].name === nombreLista) {index = i; flag = 1};
		i++;
	};
	datos.playlists[index].canciones.push(cancion);
	console.log("Se agregó la cancion:"+JSON.stringify(cancion)+"a la lista: "+nombreLista);
	res.send(datos.playlists);
});

app.post("/eliminarCancion", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var titulo = req.headers.titulo;
	var artista = req.headers.artista;
	var album = req.headers.album;
	var cancion = {"title": titulo, "artist":artista, "album":album};

	var i = 0, index = 0, flag = 0;
	while( (i < datos.playlists.length) && (flag == 0) ){
		if(datos.playlists[i].name === nombreLista) {
			index = i; 
			flag = 1;
			var songPosition = findSongIndex(datos.playlists[i].canciones, cancion);
		};
		i++;
	};
	if( songPosition > -1 ) {
		datos.playlists[index].canciones.splice(songPosition,1);
		console.log("Se eliminó la cancion: \n\t"+JSON.stringify(cancion)+" \nde la lista: \""+nombreLista+"\"");
	} else {
		console.log("No se encontró la cancion dentro de la lista.");
	}
	res.send(datos.playlists);
});

app.post("/eliminarCancionJ", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var cancion = req.headers.cancion;

	var i = 0, index = 0, flag = 0;
	while( (i < datos.playlists.length) && (flag == 0) ){
		if(datos.playlists[i].name === nombreLista) {
			index = i; 
			flag = 1;
			var songPosition = findSongIndex(datos.playlists[i].canciones, cancion);
		};
		i++;
	};
	if( songPosition > -1 ) {
		datos.playlists[index].canciones.splice(songPosition,1);
		console.log("Se eliminó la cancion: \n\t"+JSON.stringify(cancion)+" \nde la lista: \""+nombreLista+"\"");
	} else {
		console.log("No se encontró la cancion dentro de la lista.");
	}
	res.send(datos.playlists);
});

app.post("/buscarCancionEnListas", (req, res) => {
	var cancion = req.headers.cancion;

	var i = 0, songPosition = -1;
	var response = {"playlists":[]};
	while( i < datos.playlists.length){
		songPosition = findSongIndex(datos.playlists[i].canciones, JSON.parse(cancion));
		if (songPosition > -1 ){
			response.playlists.push(datos.playlists[i]);
		}
		i++;
	};
	if( response.playlists.length>0 ) {
		console.log("Se encontró la canción: \n\t"+cancion+" \n\nen las listas: \n"+JSON.stringify(response.playlists)+"\n");
	} else {
		console.log("No se encontró la cancion dentro de las listas.");
	}
	res.send(response);
});

app.post("/eliminarLista", (req, res) => {
	var nombreLista = req.headers.nombrelista;

	var i = 0, index = -1, flag = 0;
	while( (i < datos.playlists.length) && (flag == 0) ){
		if(datos.playlists[i].name === nombreLista) {
			index = i; 
			flag = 1;
		};
		i++;
	};
	if(index > -1){
		datos.playlists.splice(index,1);
	} else {
		console.log("No se encontró la lista.");
	}
	res.send(datos.playlists);
});

//Agregar una variable constante afuera para guardar la lista.

// const findSongInPlaylist = (playlists, song)=>{
// 	while( (i < datos.playlists.length) && (flag == 0) ){
// 		if(datos.playlists[i].name === nombreLista) {
// 			index = i; 
// 			flag = 1;
// 			var songPosition = findSongIndex(datos.playlists[i].canciones, cancion);
// 		};
// 		i++;
// 	};
// };

const findSongIndex = (lista, cancion)=>{
	var index = -1, i = 0, flag = 0;
	while( i < lista.length && flag == 0){
		if(songsMatch(lista[i], cancion)){
			index = i;
			flag = 1;
		}
		i++;
	}
	return index;
};

const songsMatch = (song1, song2)=> {
	if(    (song1.title  == song2.title) 
		&& (song1.artist == song2.artist) 
		&& (song1.album  == song2.album)) 
			return true;
	return false;
};