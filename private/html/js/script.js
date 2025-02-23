/**
 * Created by Arik on 2/25/2017.
 */

$(document).ready(function(){

});
let navbarApp = new Vue({
    el:'#navbarApp',
    data: {
        message: "Hello World!"
    },
    computed: {
        displayName: function() {
            return "Arik Ostler";
        }
    },
    methods: {
        notImplemented: function() {
            alert("Hi! I don't do anything yet!");
        }
    }
});

let switchboardApp = new Vue({
    el: '#switchboardApp',
    data: {

    },
    computed: {
        firstname: function(){
            return "Arik";
        }
    },
    methods: {

    }

})