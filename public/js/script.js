console.log("script linked!");

new Vue({
    el: "#main",
    data: {
        images: [],
    },
    mounted: function () {
        var self = this;
        // use axios to communicate with server
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
            })
            .catch(function (err) {
                console.log("Error:", err.message);
            });
    },
    methods: {},
});
