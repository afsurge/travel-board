console.log("sanity???");

new Vue({
    el: "#main",
    data: {
        name: "Pizza",
        seen: false,
        cities: [
            // {
            //     id: 1,
            //     name: "Berlin",
            //     country: "Germany",
            // },
            // {
            //     id: 2,
            //     name: "Dhaka",
            //     country: "Bangaldesh",
            // },
            // {
            //     id: 3,
            //     name: "Venice",
            //     country: "Italy",
            // },
        ],
    },
    mounted: function () {
        console.log("My main vue instance has mounted!");
        // use axios to communicate with server
        console.log("this.cities:", this.cities);
        console.log("this:", this);
        var self = this;
        axios
            .get("/cities")
            .then(function (response) {
                console.log("response", response);
                console.log("this.cities after axios:", this.cities);
                console.log("this after axios:", this);
                console.log("self:", self);
                self.cities = response.data;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
    methods: {
        handleClick: function (city) {
            console.log("handleClick running!", city);
            this.seen = !this.seen;
        },
    },
});
