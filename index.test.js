const request = require('request');

test("Test obtención de una lista vacía.", ()=>{
    request({
        url: "http://localhost:3000/obtenerListas",
        method: "GET",
        json: true,
        headers: {}
    }, function (error, response, body){
        expect(response.body).toEqual([]);
    });
});

test("Test creación de una lista.", ()=>{
    request({
        url: "http://localhost:3000/crearLista",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 1"}
    }, function (error, response, body){
        expect(response.body).toEqual({"playlists":[ {"name": "Lista 1", "canciones":[]} ]});
    });
});

test("Test adición de una cancion a una lista (JSON).", ()=>{
    request({
        url: "http://localhost:3000/agregarCancionJ",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 1", cancion:'{"title":"cancion 1","artist":"artista 1","album":"album 1"}'}
    }, function (error, response, body){
        expect(response.body).toEqual([ {"name": "Lista 1", "canciones":[{"title":"cancion 1","artist":"artista 1","album":"album 1"}]} ]);
    });
});

test("Test adición de una cancion a una lista (Parametros).", ()=>{
    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 1", titulo: "cancion 2", 
                                        artista: "artista 1",
                                        album: "album 1"}
    }, function (error, response, body){
        expect(response.body).toEqual([ {"name": "Lista 1", "canciones":[{"title":"cancion 1","artist":"artista 1","album":"album 1"},{"title":"cancion 2","artist":"artista 1","album":"album 1"}]} ]);
    });
});

test("Test adición de una cancion a una lista que no fue creada (Parametros).", ()=>{
    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 2", titulo: "cancion 2", artista: "artista 1", album: "album 1"}
    }, function (error, response, body){
        expect(response.body).toEqual([ {"name": "Lista 1", "canciones":[{"title":"cancion 1","artist":"artista 1","album":"album 1"},{"title":"cancion 2","artist":"artista 1","album":"album 1"}]} ]);
    });
});

test("Test adición de una cancion a una lista que no fue creada (JSON).", ()=>{
    request({
        url: "http://localhost:3000/agregarCancionJ",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 2", cancion:'{"title":"cancion 1","artist":"artista 1","album":"album 1"}'}
    }, function (error, response, body){
        expect(response.body).toEqual([ {"name": "Lista 1", "canciones":[{"title":"cancion 1","artist":"artista 1","album":"album 1"},{"title":"cancion 2","artist":"artista 1","album":"album 1"}]} ]);
    });
});

test("Test remoción de una cancion de una lista (JSON).", ()=>{
    request({
        url: "http://localhost:3000/eliminarCancionJ",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 1", cancion:'{"title":"cancion 1","artist":"artista 1","album":"album 1"}'}
    }, function (error, response, body){
        expect(response.body).toEqual([ {"name": "Lista 1", "canciones":[{"title":"cancion 2","artist":"artista 1","album":"album 1"}]} ]);
    });
});

test("Test remoción de una cancion de una lista (Parametros).", ()=>{
    request({
        url: "http://localhost:3000/eliminarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 1", titulo: "cancion 2", artista: "artista 1", album: "album 1"}
    }, function (error, response, body){
        expect(response.body).toEqual([ {"name": "Lista 1", "canciones":[]} ]);
    });
});

test("Test buscar una cancion en lista (JSON).", ()=>{
    request({
        url: "http://localhost:3000/crearLista",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 2"}
    }, function (error, response, body){});

    request({
        url: "http://localhost:3000/crearLista",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 3"}
    }, function (error, response, body){});

    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 1", titulo: "cancion 1", 
                                        artista: "artista 1",
                                        album: "album 1"}
    }, function (error, response, body){ });

    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 1", titulo: "cancion 2", 
                                        artista: "artista 1",
                                        album: "album 1"}
    }, function (error, response, body){ });

    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 2", titulo: "cancion 1", 
                                        artista: "artista 2",
                                        album: "album 1"}
    }, function (error, response, body){ });
    
    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 2", titulo: "cancion 2", 
                                        artista: "artista 2",
                                        album: "album 1"}
    }, function (error, response, body){ });

    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 2", titulo: "cancion 3", 
                                        artista: "artista 2",
                                        album: "album 1"}
    }, function (error, response, body){ });

    request({
        url: "http://localhost:3000/agregarCancion",
        method: "POST",
        json: true,
        headers: {nombreLista:"Lista 3", titulo: "cancion 3", 
                                        artista: "artista 2",
                                        album: "album 1"}
    }, function (error, response, body){ });

    request({
        url: "http://localhost:3000/buscarCancionEnListasJ",
        method: "GET",
        json: true,
        headers: {cancion: '{"title":"cancion 3", "artist":"artista 2", "album":"album 1"}'}
    }, function (error, response, body){
        expect(response.body).toEqual({ "playlists":[ {"name":"Lista 2","canciones":[{"title":"cancion 2","artist":"artista 2","album":"album 1"},{"title":"cancion 1","artist":"artista 2","album":"album 1"},{"title":"cancion 3","artist":"artista 2","album":"album 1"}]},{"name":"Lista 3","canciones":[{"title":"cancion 3","artist":"artista 2","album":"album 1"}]}] });
    });
});

test("Test buscar una canción en lista (Parametros)", ()=>{
    request({
        url: "http://localhost:3000/buscarCancionEnListas",
        method: "GET",
        json: true,
        headers: {titulo: "cancion 3",
                 artista:"artista 2", 
                 album:"album 1"}
    }, function (error, response, body){
        expect(response.body).toEqual({ "playlists":[ {"name":"Lista 2","canciones":[{"title":"cancion 2","artist":"artista 2","album":"album 1"},{"title":"cancion 1","artist":"artista 2","album":"album 1"},{"title":"cancion 3","artist":"artista 2","album":"album 1"}]},{"name":"Lista 3","canciones":[{"title":"cancion 3","artist":"artista 2","album":"album 1"}]}] });
    });
});

test("Test eliminar una lista exitosamente", ()=>{
    request({
        url: "http://localhost:3000/eliminarLista",
        method: "POST",
        json: true,
        headers: {nombreLista: "Lista 1"}
    }, function (error, response, body){
        expect(response.body).toEqual({ "playlists":[{ "name":"Lista 2", "canciones":[  { "title":"cancion 1", "artist":"artista 2", "album":"album 1"  }, { "title":"cancion 2",   "artist":"artista 2", "album":"album 1" }, { "title":"cancion 3", "artist":"artista 2", "album":"album 1" } ]}, {  "name":"Lista 3",  "canciones":[ { "title":"cancion 3",  "artist":"artista 2", "album":"album 1"  } ] } ] });
    });
});

test("Test eliminar una lista que no existe (ya fue borrada)", ()=>{
    request({
        url: "http://localhost:3000/eliminarLista",
        method: "POST",
        json: true,
        headers: {nombreLista: "Lista 1"}
    }, function (error, response, body){
        expect(response.body).toEqual({ "playlists":[{ "name":"Lista 2", "canciones":[  { "title":"cancion 1", "artist":"artista 2", "album":"album 1"  }, { "title":"cancion 2",   "artist":"artista 2", "album":"album 1" }, { "title":"cancion 3", "artist":"artista 2", "album":"album 1" } ]}, {  "name":"Lista 3",  "canciones":[ { "title":"cancion 3",  "artist":"artista 2", "album":"album 1"  } ] } ] });
    });
});