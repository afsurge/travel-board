//////////////////////////////////
//      Comments Component      //
//////////////////////////////////

Vue.component("component-comments", {
    template: "#commentsTemplate",
    data: function () {
        return { comments: [], username: "", comment: "" };
    },
    props: ["imageId"],
    mounted: function () {
        console.log("this.imageId in comments component:", this.imageId);
        // console.log("Testing comments component mount!");
        var self = this;
        axios
            .get("/get-comments/" + this.imageId)
            .then(function (response) {
                console.log("Response of comments from server:", response.data);
                self.comments = response.data;
            })
            .catch(function (err) {
                console.log(
                    "Error in getting comments from server:",
                    err.message
                );
            });
    },

    watch: {
        imageId: function () {
            console.log("comments imageId changed to:", this.imageId);
            var self = this;
            axios
                .get("/get-comments/" + this.imageId)
                .then(function (response) {
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log(
                        "Error in getting rerouted comments from server:",
                        err.message
                    );
                });
        },
    },

    methods: {
        addComment: function () {
            console.log("id of image to add comment:", this.imageId);
            // console.log("User:", this.username);
            // console.log("Comment:", this.comment);
            var self = this;
            var fullComment = {
                username: this.username,
                comment: this.comment,
                image_id: this.imageId,
            };
            axios
                .post("/comment", fullComment)
                .then(function (response) {
                    self.comments.unshift(response.data);
                    self.username = "";
                    self.comment = "";
                })
                .catch(function (err) {
                    console.log("Error in getting all comments:", err.message);
                });
        },
    },
});

//////////////////////////////////
//        Modal Component       //
//////////////////////////////////

Vue.component("component-image-details", {
    template: "#imageDetailsTemplate",
    data: function () {
        return {
            url: "",
            title: "",
            description: "",
            username: "",
            created_at: "",
            nextImgId: "",
            prevImgId: "",
        };
    },

    props: ["imageId"],

    mounted: function () {
        console.log("this.imageId in modal component:", this.imageId);
        var self = this;
        axios
            .get("/images/" + this.imageId)
            .then(function (response) {
                // console.log(
                //     "Response received from server for selected image:",
                //     response.data[0]
                // );
                // console.log(self);
                self.url = response.data[0].url;
                self.title = response.data[0].title;
                self.description = response.data[0].description;
                self.username = response.data[0].username;
                self.created_at = response.data[0].created_at;
                self.nextImgId = response.data[0].nextImgId;
                self.prevImgId = response.data[0].prevImgId;
                // console.log("next image id:", response.data[0].nextImgId);
                // console.log("previous image id:", response.data[0].prevImgId);
            })
            .catch(function (err) {
                console.log(
                    "Error getting response for selected image:",
                    err.message
                );
            });
    },

    watch: {
        imageId: function () {
            console.log("modal imageId changed to:", this.imageId);
            var self = this;
            axios
                .get("/images/" + this.imageId)
                .then(function (response) {
                    self.url = response.data[0].url;
                    self.title = response.data[0].title;
                    self.description = response.data[0].description;
                    self.username = response.data[0].username;
                    self.created_at = response.data[0].created_at;
                    self.nextImgId = response.data[0].nextImgId;
                    self.prevImgId = response.data[0].prevImgId;
                })
                .catch(function (err) {
                    console.log(
                        "Error getting response for rerouted image:",
                        err.message
                    );
                    // close modal if requested image (id) not present
                    self.$emit("close");
                });
        },
    },

    methods: {
        closeDetails: function () {
            this.$emit("close");
        },

        deleteImage: function () {
            const delFilename = this.url.replace(
                "https://s3.amazonaws.com/spicedling/",
                ""
            );
            console.log("url to delete (script):", this.url);
            console.log(
                "Want to delete file (script):" +
                    delFilename +
                    " with id:" +
                    this.imageId
            );
            axios.get("/delete/" + [this.imageId, delFilename]);
            // this.$emit("delete");
        },
    },
});

//////////////////////////////////
//       Main Vue Instance      //
//////////////////////////////////

new Vue({
    el: "#main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        imageSelected: location.hash.slice(1),
        lastOnScreen: null,
    },
    mounted: function () {
        var self = this;
        // use axios to communicate with server
        axios
            .get("/images")
            .then(function (response) {
                self.images = response.data;
                // self.images = response.data.reverse();
                // reverse() to show last upload at first
                // use if not ordered in query already (DESC)
                // console.log(self.images);
            })
            .catch(function (err) {
                console.log("Error from GET req:", err.message);
            });

        window.addEventListener("hashchange", function () {
            self.imageSelected = location.hash.slice(1);
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

        selectImage: function (id) {
            // console.log("User selected an image");
            console.log("Image id clicked in main Vue instance:", id);
            this.imageSelected = id;
        },

        closeComponent: function () {
            // below hash added to return to start page
            // after requesting invalid image (#id)
            location.hash = "";
            this.imageSelected = null;
        },

        // deleteImage: function () {
        //     console.log("Want to delete image id:", this.imageSelected);
        //     axios
        //         .get("/delete/" + this.imageSelected)
        //         .then(function () {
        //             // console.log(response.data);
        //             // const delFilename = response.data.replace(
        //             //     "https://s3.amazonaws.com/spicedling/",
        //             //     ""
        //             // );
        //             // axios.post("/delete", response.data).then(function () {});
        //         })
        //         .catch(function (err) {
        //             console.log(
        //                 "Error getting url of image to delete in script:",
        //                 err.message
        //             );
        //         });
        // },

        getMoreImages: function () {
            // console.log("Give me MORE!");
            // console.log("All images on screen:", this.images);
            const lowestId = this.images[this.images.length - 1].id;
            // console.log("ID of last image on screen:", lowestId);
            var self = this;
            axios
                .get("/more/" + lowestId)
                .then((response) => {
                    console.log("Response for more images:", response.data);
                    var imagesWithMore = self.images.concat(response.data);
                    // can use for-loop for above also
                    self.images = imagesWithMore;
                    console.log(
                        "All images on screen after MORE:",
                        self.images
                    );
                    if (
                        self.images[self.images.length - 1].id ==
                        response.data[0].lowestId
                    ) {
                        self.lastOnScreen = true;
                        console.log("All images are shown on screen!");
                    }
                })
                .catch((err) => {
                    console.log(
                        "Error getting more images in script:",
                        err.message
                    );
                });
        },
    },
});
