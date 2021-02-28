// console.log("script linked!");

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
                self.images = response.data.reverse();
                // reverse() to show last upload at first
                // console.log(self.images);
            })
            .catch(function (err) {
                console.log("Error from GET req:", err.message);
            });
    },
    methods: {
        handleChange: function (e) {
            // runs when user selects image to upload
            // file details passed to this.file from e.target.files[0]
            // first index [0] of files array contains object with image details
            console.log("e.target.files[0]:", e.target.files[0]);
            console.log("handleChange() is running!");
            this.file = e.target.files[0];
        },

        handleClick: function (e) {
            // runs on click of submit/upload button after choosing image to upload
            // handleChange already ran before this
            // FormData API allows image upload via ajax
            // all details of image appended to formData object
            // post request to server /upload with formData
            var formData = new FormData();
            var self = this;
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);
            // console.log("this.title: ", this.title);
            // console.log("this.description: ", this.description);
            // console.log("this.username: ", this.username);
            // console.log("this.file: ", this.file);
            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log("Response from POST req:", response);
                    // once response(.data) received from post route with uploaded image info
                    // add all info to images array inside data to render to client
                    // unshift to add image to beginning of array (newest first)
                    self.images.unshift(response.data);
                })
                .catch(function (err) {
                    console.log("Error from POST req:", err.message);
                });
        },
    },
});
