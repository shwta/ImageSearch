var imageSearch = function() { 


};
imageSearch.prototype.init = function() { //Initialize
    this.page = 1;
    this.callPhotosApi(100);
    this.ApiSearchEventListener();
    this.loadPhotosOnScroll();
    this.lightBoxEvents();
    this.photosTileshtml = "";
    this.images = [];
    this.flag = true;
    this.PhotosTilesEvent();
    this.id = 0;


};

imageSearch.prototype.callPhotosApi = function(pageLimit) { //call Flickr Api for photos
    var that = this;
    var query = document.getElementById("input").value;
    var apiCall = {
        "api_key": "ab68352a9d6371078b61824647316c18",
        "pageLimit": pageLimit,
        "query": query,
        "page": this.page
    }
    fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
            apiCall.api_key + '&extras=url_c,url_m,url_n,url_o,url_b,url_sq&safe_search=1&text=' +
            apiCall.query + '&sort=relevance&per_page=' + apiCall.pageLimit + '&page=' + apiCall.page + '&format=json&nojsoncallback=?')


        .then(function(response) {

            return response.json();

        }).then(function(data) {
            that.photosTileshtml = "";
            that.photosTilesinnerHTML(data);

        });


};
imageSearch.prototype.photosTilesinnerHTML = function(data) { // layout of photos

    var photosArr = data.photos.photo;
    for (var i = 0; i < photosArr.length; i++) {

        var image = {

            id: photosArr[i].id,
            tileUrl_m: photosArr[i].url_m,
            tileUrl_n: photosArr[i].url_n,
            tileUrl_thumb: photosArr[i].url_sq,
            originalUrl: "https://farm3.staticflickr.com/" + photosArr[i].server + "/" +
                            photosArr[i].id + "_" + photosArr[i].secret + "_c.jpg"
        };

        this.photosTileshtml += "<div class='photo-tile-view' id='" + this.id + "'><img id='"
                                 + image.originalUrl + "' class='photo-tile-view-image' src='" 
                                 + image.tileUrl_m + "'></div>";


        this.images.push(image);
        this.id++;

    }
    if (!this.flag){
        document.getElementById("photo-list-container").innerHTML += this.photosTileshtml;
    
    }
    else{
        document.getElementById("photo-list-container").innerHTML = this.photosTileshtml;
    
        setTimeout(function() {
            document.getElementById("photo-list-container").classList.add("tile-active");

        }, 500);
    };



};
imageSearch.prototype.lightboxViewer = function() {  //Lightbox Content
    document.querySelector(".lightBox-Container").photosTilesinnerHTML = "";
    var LighBoxtConatinerElem = document.querySelector(".lightBox-Container");
    var fullViewImageHtml = "<div id='light-Box-Original-Image-Container'><div class='light-box-content'><img id='image' src='"
                             +this.images[this.index].originalUrl + "'></div></div>";

    var thumbnailHtml = "<div class='thumbContainer' id='thumbContainer'>";
    var numOfThumbNails = this.index + 10;
    var j = 0;
    for (var i = this.index; i < numOfThumbNails; i++) {

        var parentElems = document.getElementsByClassName("photo-tile-view");
        var parentId = parseInt(parentElems[i].id);
        thumbnailHtml += "<div class='thumbnail' id='" + parentId + "''><img id='" 
                        +this.images[i].originalUrl + "'class='thumb-image' src='" 
                        + this.images[i].tileUrl_thumb + "'></div>";

    }
    LighBoxtConatinerElem.innerHTML += fullViewImageHtml + thumbnailHtml + "</div>";
    this.openLightBox();
};

imageSearch.prototype.openLightBox = function() {         //Open Lightbox 
    document.getElementById("lightBox").classList.add("light-active");
    document.getElementById("image").classList.add("image-active");
    document.body.style.overflow="hidden";

};
imageSearch.prototype.updateLightBoxthumbnails = function(index, j, length) { //Thumbnails in lightbox
    var thumbElems = document.getElementsByClassName("thumb-image");
    for (var i = index; i < length; i++) {
        thumbElems[j].src = this.images[i].tileUrl_thumb;
        thumbElems[j].parentNode.id = i;
        thumbElems[j++].id = this.images[i].originalUrl;
    }
}
imageSearch.prototype.lightBoxViewClose = function() {    //Close Lightbox
    
        document.getElementById('lightBox').classList.remove("light-active");
        document.getElementById('lightBox').classList.remove("image-active");
        document.body.style.overflow="auto";
        setTimeout(function() {
            document.querySelector(".lightBox-Container").innerHTML = "";
        }, 500);

    
};
imageSearch.prototype.lightBoxViewNext = function() {       //Next Button in lightbox
            var that=this,
                j = 0,
                i = this.index + 1,
                length = this.index + 11;
                this.updateLightBoxthumbnails(i, j, length);
                document.getElementById("image").classList.remove("image-active");

                setTimeout(function() {
                    document.getElementById("image").src = that.images[++that.index].originalUrl;
                    document.getElementById("image").classList.add("image-active");
                    
                }, 300);


};
imageSearch.prototype.lightBoxViewPrev = function() { //Prev Button in Lightbox
    var that=this,
    j = 0;
    if (this.index < 10){
        var i = 0,
            length = 10;
    }
     else
        i = this.index - 10, length = this.index;
        if (this.index != 0) {
            this.updateLightBoxthumbnails(i, j, length);
            document.getElementById("image").classList.remove("image-active");

            setTimeout(function() {
                document.getElementById("image").src = that.images[--that.index].originalUrl;
                document.getElementById("image").classList.add("image-active");
                    
            }, 300);

        }

};

imageSearch.prototype.lightBoxEvents = function() { 
    var that = this;
    document.getElementById("close")
    .addEventListener('click', this.lightBoxViewClose.bind(this));

    document.getElementById("lightBox").addEventListener('click',function(e){
      if(e.target.className === "next")
        
        that.lightBoxViewNext();
      
      if(e.target.className === "prev")

        that.lightBoxViewPrev();
      
    });
    document.addEventListener('keydown',function(e){
      if(document.getElementById("light-Box-Original-Image-Container")!=null){

        if(e.keyCode === 39)
            that.lightBoxViewNext();
        if(e.keyCode === 37)
            that.lightBoxViewPrev();
        if(e.keyCode === 27)
            that.lightBoxViewClose();

     }
   });
   document.getElementById("lightBox").addEventListener('click',function(e){
      if(e.target.className === 'thumb-image'){
            that.index = parseInt(e.target.parentNode.id);
            document.getElementById("image").classList.remove("image-active");
            setTimeout(function() {
                document.getElementById("image").src = e.target.id;
                document.getElementById("image").classList.add("image-active");
                        
            }, 300);

        }
    });
};

imageSearch.prototype.PhotosTilesEvent = function() {    //Click event for photos tiles in main page
    var that = this;
    var elem = document.getElementById("photo-list-container");
    elem.addEventListener('click', function(e){
        if (e.target.className === 'photo-tile-view-image') {
            var parentNode = e.target.parentNode;
            that.index = parseInt(parentNode.id);
            that.lightboxViewer();
        };
    });

};

imageSearch.prototype.ApiSearchEventListener = function() { //event for search query 
    var that = this;
    var searchElem = document.getElementById("input");
    searchElem.addEventListener("keypress", function(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            that.callPhotosApi(100);
            document.getElementById("photo-list-container").classList.remove("tile-active");
            that.flag = true;
            that.images = [];
            that.id = 0;

        }
    });

};
imageSearch.prototype.loadPhotosOnScroll = function() {   //event to load more photos on main page when scrolled.
    document.addEventListener('scroll', this.throttle(1000));
};
imageSearch.prototype.throttle = function(time) {    //throttle function to control scroll.

    var that = this;
    var timeOut = false;

    return function() {
        if (!timeOut) {
            that.page++;
            console.log("scrolled");
            that.callPhotosApi(50);
            that.flag = false;

            timeOut = true;
            setTimeout(function() {
                timeOut = false;
            }, time);
        }
    }
};
var imagesSearch = new imageSearch();
imagesSearch.init();
