var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");

var preloader = {
  path: "images/",
  srcs: ["1.jpg", "2.jpg", "3.jpg"],
  createImage: function(i, src) {
    // jQuery creates the element using the native JavaScript .createElement() function
    var $img = $("<img />", { src: this.path + src});
    // use jQuery's window load event rather than a document ready event, which doesn't wait for images to be loaded
    $img.on("load", manipulator.process.bind(manipulator));
  },
  run: function() {
    $.each(this.srcs, $.proxy(this.createImage, this));  // identical with this.srcs.forEach(this.createImage.bind(this))
  },
};

var manipulator = {
  drawImage: function(img) {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  },
  convertGrayscale: function() {
    var image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var gray;
    
    for(var i = 0, len = image_data.data.length; i < len; i += 4) {
      gray = (image_data.data[i] * .3086 + image_data.data[i + 1] * .6094 + image_data.data[i + 2] * .0820);
      image_data.data[i] = gray;
      image_data.data[i + 1] = gray;
      image_data.data[i + 2] = gray;
    }
    ctx.putImageData(image_data, 0, 0);
  },
  writeImage: function() {
    var img = document.createElement("img");
    
    // set the src attribute and write the canvas image to it using canvas.toDataURL
    img.src = canvas.toDataURL();
    $(document.body).append(img);
  },
  process: function(e) {
    var img = e.target;
    this.drawImage(img);
    this.convertGrayscale();
    this.writeImage();
  },
};

$(preloader.run.bind(preloader));