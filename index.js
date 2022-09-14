var express = require('express');
var app = express();
var port = 3000;

// ------------------------- Esquema pre armado ------------------------- //
var mockDatosDePrueba = 
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
// -------------------------   Esquema vacío   ------------------------- //
var datos = {
	"playlists":[]
};

// ------------------------- Inicialización ------------------------- //
app.listen(port, ()=>{
    console.log("Servidor corriendo en el puerto "+port+"\n");
}); 

// ------------------------- Obtención ------------------------- //

app.get("/obtenerListas", (req, res)=> {
	console.log("[OL ] >> Se envió: "+JSON.stringify(datos.playlists));
    res.send(datos.playlists);
});

// ------------------------- Creación ------------------------- //

app.post("/crearLista", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var lista = {"name":nombreLista, "canciones":[]};
	datos.playlists.push(lista);
	console.log("[CL ] >> Se creó la lista: "+lista.name);
	res.send(datos);
});

// ------------------------- Modificación ------------------------- //
// En diversos encabezados, se denomina a las funciones con el subfijo "J" 
// para hacer referencia a que trabaja recibiendo un objeto JSON, y no parametros

app.post("/agregarCancionJ", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var cancion = JSON.parse(req.headers.cancion);
	var i = 0, index = -1, flag = 0;
	while( (i < datos.playlists.length) && (flag == 0) ){
		if(datos.playlists[i].name === nombreLista) {index = i; flag = 1};
		i++;
	};

	if(index > -1){
		datos.playlists[index].canciones.push(cancion);
		console.log("[ACj] >> Se agregó la cancion:"+cancion.title+" a la lista: "+nombreLista);
	} 
	else {
		console.log(">> [ACj] No se encontró la lista a la cual se quiere agregar.");
	}
	res.send(datos.playlists);
});

app.post("/agregarCancion", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var titulo = req.headers.titulo;
	var artista = req.headers.artista;
	var album = req.headers.album;
	
	var cancion = {"title": titulo, "artist":artista, "album":album};
	var i = 0, index = -1, flag = 0;
	while( (i < datos.playlists.length) && (flag == 0) ){
		if(datos.playlists[i].name === nombreLista) {index = i; flag = 1};
		i++;
	};
	if( index > -1){
		datos.playlists[index].canciones.push(cancion);
		console.log("[AC ] >> Se agregó la cancion:"+cancion.title+" a la lista: "+nombreLista);
	} 
	else {
		console.log(">> [AC ] No se encontró la lista a la cual se quiere agregar.");
	}
	res.send(datos.playlists);
});

app.post("/eliminarCancion", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var titulo = req.headers.titulo;
	var artista = req.headers.artista;
	var album = req.headers.album;
	var cancion = {"title": titulo, "artist":artista, "album":album};

	var i = 0, index = -1, flag = 0;
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
		console.log("[EC ] >> Se eliminó la cancion: "+cancion.title+" de la lista: \""+nombreLista+"\"");
	} else {
		console.log(">> [EC] No se pudo eliminar la canción porque no se encontró la cancion dentro de la lista.");
	}
	res.send(datos.playlists);
});

app.post("/eliminarCancionJ", (req, res) => {
	var nombreLista = req.headers.nombrelista;
	var cancion = JSON.parse(req.headers.cancion);
	var i = 0, index = -1, flag = 0;
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
		console.log("[ECj] >> Se eliminó la cancion: "+cancion.title+" de la lista: \""+nombreLista+"\"");
	} else {
		console.log(">> [ECj] No se pudo eliminar la canción porque no se encontró la cancion dentro de la lista.");
	}
	res.send(datos.playlists);
});

// ------------------------- Búsqueda ------------------------- //

app.get("/buscarCancionEnListas", (req, res) => {
	var titulo = req.headers.titulo;
	var artista = req.headers.artista;
	var album = req.headers.album;

	var cancion = {"title":titulo, "artist": artista, "album": album};
	var i = 0, songPosition = -1;
	var response = {"playlists":[]};
	while( i < datos.playlists.length){
		songPosition = findSongIndex(datos.playlists[i].canciones, cancion);
		if (songPosition > -1 ){
			response.playlists.push(datos.playlists[i]);
		}
		i++;
	};
	if( response.playlists.length > 0 ) {
		console.log("[BC ] >> Se encontró la canción: "+cancion.name+" en las listas,\n");
	} else {
		console.log(">> [BC ] No se encontró la cancion dentro de las listas.");
	}
	res.send(response);
});

app.get("/buscarCancionEnListasJ", (req, res) => {
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
	if( response.playlists.length > 0 ) {

		console.log("[BCj] >> Se encontró la canción: "+cancion.title+" en las listas.\n");
	} else {
		console.log(">> [BCj) No se encontró la cancion dentro de las listas.");
	}
	res.send(response);
});

// ------------------------- Remoción de lista ------------------------- //

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
		console.log("[EL ] >> Se eliminó exitosamente la lista: "+datos.playlists[index].name);
		datos.playlists.splice(index,1);
	} else {
		console.log(">> [EL ] No se pudo eliminar porque no se encontró la lista.");
	}
	res.send(datos.playlists);
});

// ------------------------- Funciones Auxiliares ------------------------- //

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