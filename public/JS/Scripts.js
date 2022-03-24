let photo_loaded = false;

function Show_uploaded_image () {
    let file = document.getElementById('photo-pvc').files[0];
    if (file) {
        let img_source = document.getElementById('image-pvc');
        img_source.src = URL.createObjectURL(file);
        localStorage.setItem('myImage', img_source);
        photo_loaded = true;
    }
    else {
        photo_loaded = false;
    }
}

const Show_div_image = () => {
    let image = document.getElementById('div-image');
    if (photo_loaded) {
        image.classList.toggle("active", true);
    }
}

function make_base() {
    Show_uploaded_image();
    let image = document.getElementById('image-pvc');
    image.onload = function(){
        let needed_width = image.width, needed_height = image.height;
        if (image.width >= window.innerWidth) {
            let needed_proportion = needed_width/needed_height;
            needed_width = window.innerWidth - 100;
            needed_height = needed_width/needed_proportion;
        }
        context_pvc.canvas.width = needed_width;
        context_pvc.canvas.height = needed_height;
        context_pvc.drawImage(image, 0, 0, needed_width, needed_height)
        context_rect.canvas.width = needed_width;
        context_rect.canvas.height = needed_height;
    }
    Show_div_image();
    rect_arr = [];
}

var canvas_pvc = document.getElementById('canvas-pvc'),
    context_pvc = canvas_pvc.getContext('2d');

var canvas_rect = document.getElementById('canvas-rect'),
    context_rect = canvas_rect.getContext('2d');

var x_left, x_right, y_left, y_right;
var draw = false;

function start_drawing() {
    canvas_rect.style.visibility = "visible";
    context_rect.clearRect(0,0, canvas_rect.width, canvas_rect.height);
    canvas_rect.addEventListener("mousedown", mouse_downed, true);
    canvas_rect.addEventListener("mousemove", mouse_moved, true);
    canvas_rect.addEventListener("mouseup", mouse_upped, true);
}

function  stop_drawing() {
    canvas_rect.removeEventListener("mouseup", mouse_upped, true);
    canvas_rect.removeEventListener("mousedown", mouse_downed, true);
    canvas_rect.removeEventListener("mousemove", mouse_moved, true);
    canvas_rect.style.visibility = "hidden";
}

var is_final_rec = false;

function mouse_downed(e) {
    is_final_rec = false;
    let rect = e.target.getBoundingClientRect();
    x_left = e.clientX - rect.left;
    y_left = e.clientY - rect.top;
    draw = true;
}

function  mouse_moved(e) {
    if(draw===true){
        is_final_rec = false;
        draw_rectangle(e);
    }
}

function mouse_upped(e) {
    is_final_rec = true;
    draw = false;
    draw_rectangle(e);
}
var temp;
var time;

class rect_class {
    constructor(time, temp, xl, yl, xr, yr) {
        this.time = time;
        this.temp = temp;
        this.xl = xl;
        this.yl = yl;
        this.xr = xr;
        this.yr = yr;
    }
}

function modal_save() {
    temp = document.getElementById('modal-temp').value;
    time = document.getElementById('modal-time').value;
    if (temp === "" || time === "") {

    }
    else {
        close_modal.click();
        rect_class_push();
    }
}

var rect_arr = [];

function draw_rectangle(e) {
    if (!is_final_rec) {
        context_rect.clearRect(0, 0, canvas_rect.width, canvas_rect.height);
    }
    let rect = e.target.getBoundingClientRect();
    x_right = e.clientX - rect.left;
    y_right = e.clientY - rect.top;
    let rect_w = Math.abs(x_right-x_left);
    let rect_h = Math.abs(y_left-y_right);
    if (!is_final_rec) {
        context_rect.strokeRect(x_left,y_left,rect_w,rect_h);
    }
    else {
        context_rect.strokeRect(x_left,y_left,rect_w,rect_h);
        context_pvc.strokeRect(x_left,y_left,rect_w,rect_h);
        let modal_call = document.getElementById('open_modal');
        modal_call.click();
    }
}

function rect_class_push() {
    let rect_class_temp = new rect_class(time, temp, x_left,y_left,x_right,y_right);
    rect_arr.push(rect_class_temp);
}
