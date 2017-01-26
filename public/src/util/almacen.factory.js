/*global angular $ */
angular.module('livepost')
    .factory('Almacen', function (localStorageService) {
    /* factory para almacen, en el cual se puede guardar informacion no volatil.
    para poder hacer uso se tiene de lo siguiente se tiene que abrir el
    almacen con la siguiente instruccion:
    AlmacenBoletos.open(''); donde lo que va dentro de las comillas
    simples es el nombre del almacen a utilizar una ves incializado,
    se pude traer lo que se encuentra en el con: AlmacenBoletos.read()*/
        'use strict';
        var almacen = {};
        var hashtable = {};
        var key = '';

        almacen.open = function (k) {
            if (!k) {
                console.error("LOCAL STORAGE ERROR: PLEASE ENTER A KEY");
                return;
            }
            key = k;
            hashtable = localStorageService.get(key)
                ? localStorageService.get(key)
                : {};
        };

        almacen.update = function (pkey) {
            key = pkey || key;
            localStorageService.set(key, hashtable);
        };

        almacen.write = function (data) {
            hashtable = data;
            almacen.update();
        };

        almacen.read = function (pkey) {
            key = pkey || key;
            almacen.open(key);
            return hashtable;
        };

        almacen.clean = function () {
            hashtable = {};
            almacen.update();
        };

        almacen.remove = function (pkey) {
            key = pkey || key;
            localStorageService.remove(key);
        };

        almacen.empty = function (pkey) {
            almacen.read(pkey);
            return $.isEmptyObject(hashtable);
        };
        return almacen;
    });