console.log("script linked!");

new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
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
    methods: {
        handleClick: function (e) {
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);
            // console.log("this.title: ", this.title);
            // console.log("this.description: ", this.description);
            // console.log("this.username: ", this.username);
            // console.log("this.file: ", this.file);
            axios
                .post("/uplaod", formData)
                .then(function (response) {
                    console.log("Response from post req:", response);
                })
                .catch(function (err) {
                    console.log("Error from post req:", err.message);
                });
        },
        handleChange: function (e) {
            console.log("e.target.files[0]:", e.target.files[0]);
            console.log("handle change is running!");
            this.file = e.target.files[0];
        },
    },
});
