import b4w from "blend4web";

var m_app       = b4w.app;
var m_cam       = b4w.camera;
var m_cfg       = b4w.config;
var m_cont      = b4w.container;
var m_ctl       = b4w.controls;
var m_data      = b4w.data;
var m_mouse     = b4w.mouse;
var m_math      = b4w.math;
var m_obj       = b4w.objects;
var m_phy       = b4w.physics;
var m_preloader = b4w.preloader;
var m_scenes    = b4w.scenes;
var m_trans     = b4w.transform;
var m_version   = b4w.version;
var m_vec3       = b4w.vec3;
var m_time       = b4w.time;
var m_ver       = b4w.version;

var m_quat = b4w.quat;

var DEBUG = (m_version.type() === "DEBUG");

var OUTLINE_COLOR_VALID = [0, 1, 0];
var OUTLINE_COLOR_ERROR = [1, 0, 0];
var FLOOR_PLANE_NORMAL = [0, 0, 1];


var ROT_ANGLE = Math.PI/20;
var SCALE = 20;//Math.PI/4

var WALL_X_MAX = 8;
var WALL_X_MIN = -8;
var WALL_Y_MAX = 8;
var WALL_Y_MIN = -8;

var ASSETS_PATH = m_cfg.get_std_assets_path() + "tutorials/cartoon_interior/";

var _obj_delta_xy = new Float32Array(2);
var spawner_pos = new Float32Array(3);
var _vec3_tmp = new Float32Array(3);
var _vec3_tmp2 = new Float32Array(3);
var _vec3_tmp3 = new Float32Array(3);
var _vec4_tmp = new Float32Array(4);
var _pline_tmp = m_math.create_pline();

var _drag_mode = false;
var _enable_camera_controls = true;

var _selected_obj = null;

export function init() {
    var show_fps = DEBUG;

    var url_params = m_app.get_url_params();

    if (url_params && "show_fps" in url_params)
        show_fps = true;

    m_app.init({
        canvas_container_id: "main_canvas_container",
        callback: init_cb,
        physics_enabled: true,
        show_fps: show_fps,
        alpha: true,
        assets_dds_available: !DEBUG,
        assets_min50_available: !DEBUG,
        console_verbose: DEBUG,
        //background_color: [1.0, 1.0, 1.0, 0.0]
    });
};

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    canvas_elem.addEventListener("mousedown", main_canvas_down);
    canvas_elem.addEventListener("touchstart", main_canvas_down);

    canvas_elem.addEventListener("mouseup", main_canvas_up);
    canvas_elem.addEventListener("touchend", main_canvas_up);

    canvas_elem.addEventListener("mousemove", main_canvas_move);
    canvas_elem.addEventListener("touchmove", main_canvas_move);

    window.onresize = m_cont.resize_to_container;
    m_cont.resize_to_container();
    load();
}

function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

function load() {
    m_data.load(ASSETS_PATH + "environment.json", load_cb, preloader_cb);
}

function load_cb(data_id) {
    m_app.enable_camera_controls(false, false, false, m_cont.get_canvas());
    init_controls();

    var spawner = m_scenes.get_object_by_name("spawner");
    m_trans.get_translation(spawner, spawner_pos);
    
     /* start anchor menuphu
    var my_design = document.getElementById("menuphu");
	var my_design_child = document.getElementById("menuphu_child");
	my_design.style.display = "block";
		
    my_design.addEventListener("click", function() {
		if (my_design_child.style.display == "block") {
			my_design_child.style.display = "visible";	
		} else {
			my_design_child.style.display = "block";
		}
		
    }, false);
     stop anchor menuphu*/
    
     /* start anchor hienthongtin*/
    var hienthongtin = document.getElementById("hienthongtin");
	var hienthongtin_childaudio = document.getElementById("hienthongtin_childaudio");
	 hienthongtin.style.display = "block";		   
    /* start anchor hienthongtin*/
    
    /* start anchor nuttat*/
    var nuttat = document.getElementById("nuttat");
    var nuttat_child = document.getElementById("nuttat_child");
    nuttat.style.display = "block";
    nuttat.addEventListener("click", function() {
       
        nuttat.style.bottom = "-100px";
        hienthongtin.style.top = "-100%";
        document.getElementById("noidungthongtin").src = "";
        document.getElementById("audio1").src = "";
		if (hienthongtin_childaudio.style.display == "none") {
			hienthongtin_childaudio.style.display = "none";	
		} else {
			hienthongtin_childaudio.style.display = "none";
		}
		
    }, false);
    /* start anchor hienthongtin*/
    
    /*start anchor diem1*/
    var diemthongtin = document.getElementById("diemthongtin");
	/*diemthongtin.style.display = "block";*/
    
    diemthongtin.addEventListener("click", function() {
        nuttat.style.bottom = "0px";
        hienthongtin.style.top = "45%";
        hienthongtin_childaudio.style.display = "none";
        document.getElementById("noidungthongtin").src = "https://dienmaycholon.vn/sofa/sofa-3-cho-bobby-v1212-xam";
        document.getElementById("audio1").src = "./assets/audio/hoboi-vitrinhin.mp3";
        
		if (hienthongtin_childaudio.style.display == "block") {
			hienthongtin_childaudio.style.display = "none";	
		} else {
			hienthongtin_childaudio.style.display = "block";
		}
		
    }, false); 
     /*  stop anchor diem1*/
    
}

function init_controls() {
    var controls_elem = document.getElementById("controls-container");
    controls_elem.style.display = "block";

    init_buttons();

    document.getElementById("caiban").addEventListener("click", function(e) {
        m_data.load(ASSETS_PATH + "bed.json", loaded_cb, null, null, true);
        
        
        
    });
    document.getElementById("caighe").addEventListener("click", function(e) {
        m_data.load(ASSETS_PATH + "chair.json", loaded_cb, null, null, true);
             
        
    });
    /*document.getElementById("load-3").addEventListener("click", function(e) {
        m_data.load(ASSETS_PATH + "commode_and_pot.json", loaded_cb, null, null, true);
    });
    document.getElementById("load-4").addEventListener("click", function(e) {
        m_data.load(ASSETS_PATH + "fan.json", loaded_cb, null, null, true);
    });
    document.getElementById("load-5").addEventListener("click", function(e) {
        m_data.load(ASSETS_PATH + "table.json", loaded_cb, null, null, true);
    });*/

    document.getElementById("delete").addEventListener("click", function(e) {
        if (_selected_obj) {
            var id = m_scenes.get_object_data_id(_selected_obj);
            m_data.unload(id);
            _selected_obj = null;
            
                
        }
      
        
    });
    document.getElementById("phongto").addEventListener("click", function(e) {
        if (_selected_obj)
            
            scale_object(_selected_obj, ++SCALE/20);           
        
    });
    document.getElementById("thunho").addEventListener("click", function(e) {
        if (_selected_obj)
            //rotate_object(_selected_obj, -ROT_ANGLE);
        scale_object(_selected_obj, --SCALE/20);
    });
    
    document.getElementById("xoay1").addEventListener("click", function(e) {
        if (_selected_obj)
            
           rotate_object(_selected_obj, ROT_ANGLE);         
        
    });
    document.getElementById("xoay2").addEventListener("click", function(e) {
        if (_selected_obj)
            //rotate_object(_selected_obj, -ROT_ANGLE);
        rotate_object(_selected_obj, -ROT_ANGLE);
    });
}

function init_buttons() {
    var ids = ["delete", "phongto", "thunho","xoay1","xoay2"];

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];

        document.getElementById(id).addEventListener("mousedown", function(e) {
            var parent = e.target.parentNode;
            parent.classList.add("active");
            
        });
        document.getElementById(id).addEventListener("mouseup", function(e) {
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
        document.getElementById(id).addEventListener("touchstart", function(e) {
            var parent = e.target.parentNode;
            parent.classList.add("active");
            
        });
        document.getElementById(id).addEventListener("touchend", function(e) {
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
    }
}

function loaded_cb(data_id) {

    var objs = m_scenes.get_all_objects("ALL", data_id);
    for (var i = 0; i < objs.length; i++) {
        var obj = objs[i];

        if (m_phy.has_physics(obj)) {
            m_phy.enable_simulation(obj);

            // create sensors to detect collisions
            var sensor_col = m_ctl.create_collision_sensor(obj, "FURNITURE");
            var sensor_sel = m_ctl.create_selection_sensor(obj, true);

            if (obj == _selected_obj)
                m_ctl.set_custom_sensor(sensor_sel, 1);

            m_ctl.create_sensor_manifold(obj, "COLLISION", m_ctl.CT_CONTINUOUS, 
                    [sensor_col, sensor_sel], logic_func, trigger_outline);


            // spawn appended object at a certain position
            var obj_parent = m_obj.get_parent(obj);
            if (obj_parent && m_obj.is_armature(obj_parent))
                // translate the parent (armature) of the animated object
                m_trans.set_translation_v(obj_parent, spawner_pos);
            else
                m_trans.set_translation_v(obj, spawner_pos);
        }

        // show appended object
        if (m_obj.is_mesh(obj))
            m_scenes.show_object(obj);
    }
}

function logic_func(s) {
    return s[1];
}

function trigger_outline(obj, id, pulse) {
    if (pulse == 1) {
        // change outline color according to the  
        // first manifold sensor (collision sensor) status
        var has_collision = m_ctl.get_sensor_value(obj, id, 0);
        if (has_collision)
            m_scenes.set_outline_color(OUTLINE_COLOR_ERROR);
        else
            m_scenes.set_outline_color(OUTLINE_COLOR_VALID);
    }
}

function rotate_object(obj, angle) {
    var obj_parent = m_obj.get_parent(obj);
    
    if (obj_parent && m_obj.is_armature(obj_parent)) {
        // rotate the parent (armature) of the animated object
        var obj_quat = m_trans.get_rotation(obj_parent, _vec4_tmp);
        m_quat.rotateZ(obj_quat, angle, obj_quat);
        m_trans.set_rotation_v(obj_parent, obj_quat);
    } else {
        var obj_quat = m_trans.get_rotation(obj, _vec4_tmp);
        m_quat.rotateZ(obj_quat, angle, obj_quat);
        m_trans.set_rotation_v(obj, obj_quat);
    }
    limit_object_position(obj);
}
// them scale 
function scale_object(obj,ROT_ANGLE) {
       
      m_trans.set_scale_rel(obj,ROT_ANGLE);
     
    
}

// them scale 
function main_canvas_down(e) {
    _drag_mode = true;

    if (e.preventDefault)
        e.preventDefault();

    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);

    var obj = m_scenes.pick_object(x, y);

    // handling outline effect
    if (_selected_obj != obj) {
        if (_selected_obj)
            m_scenes.clear_outline_anim(_selected_obj);
        if (obj)
            m_scenes.apply_outline_anim(obj, 1, 1, 0);

        _selected_obj = obj;
    }

    // calculate delta in viewport coordinates
    if (_selected_obj) {
        var cam = m_scenes.get_active_camera();

        var obj_parent = m_obj.get_parent(_selected_obj);
        if (obj_parent && m_obj.is_armature(obj_parent))
            // get translation from the parent (armature) of the animated object
            m_trans.get_translation(obj_parent, _vec3_tmp);
        else
            m_trans.get_translation(_selected_obj, _vec3_tmp);
        m_cam.project_point(cam, _vec3_tmp, _obj_delta_xy);

        _obj_delta_xy[0] = x - _obj_delta_xy[0];
        _obj_delta_xy[1] = y - _obj_delta_xy[1];
    }
}

function main_canvas_up(e) {
    _drag_mode = false;
    // enable camera controls after releasing the object
    if (!_enable_camera_controls) {
        m_app.enable_camera_controls();
        _enable_camera_controls = true;
    }
}

function main_canvas_move(e) {
    if (_drag_mode)
        if (_selected_obj) {
            // disable camera controls while moving the object
            if (_enable_camera_controls) {
                m_app.disable_camera_controls();
                _enable_camera_controls = false;
            }

            // calculate viewport coordinates
            var cam = m_scenes.get_active_camera();

            var x = m_mouse.get_coords_x(e);
            var y = m_mouse.get_coords_y(e);

            if (x >= 0 && y >= 0) {
                x -= _obj_delta_xy[0];
                y -= _obj_delta_xy[1];

                // emit ray from the camera
                var pline = m_cam.calc_ray(cam, x, y, _pline_tmp);
                var camera_ray = m_math.get_pline_directional_vec(pline, _vec3_tmp);

                // calculate ray/floor_plane intersection point
                var cam_trans = m_trans.get_translation(cam, _vec3_tmp2);
                m_math.set_pline_initial_point(_pline_tmp, cam_trans);
                m_math.set_pline_directional_vec(_pline_tmp, camera_ray);
                var point = m_math.line_plane_intersect(FLOOR_PLANE_NORMAL, 0,
                        _pline_tmp, _vec3_tmp3);

                // do not process the parallel case and intersections behind the camera
                if (point && camera_ray[2] < 0) {
                    var obj_parent = m_obj.get_parent(_selected_obj);
                    if (obj_parent && m_obj.is_armature(obj_parent))
                        // translate the parent (armature) of the animated object
                        m_trans.set_translation_v(obj_parent, point);
                    else
                        m_trans.set_translation_v(_selected_obj, point);
                    limit_object_position(_selected_obj);
                }
            }
        }
}

function limit_object_position(obj) {
    var bb = m_trans.get_object_bounding_box(obj);

    var obj_parent = m_obj.get_parent(obj);
    if (obj_parent && m_obj.is_armature(obj_parent))
        // get translation from the parent (armature) of the animated object
        var obj_pos = m_trans.get_translation(obj_parent, _vec3_tmp);
    else
        var obj_pos = m_trans.get_translation(obj, _vec3_tmp);

    if (bb.max_x > WALL_X_MAX)
        obj_pos[0] -= bb.max_x - WALL_X_MAX;
    else if (bb.min_x < WALL_X_MIN)
        obj_pos[0] += WALL_X_MIN - bb.min_x;

    if (bb.max_y > WALL_Y_MAX)
        obj_pos[1] -= bb.max_y - WALL_Y_MAX;
    else if (bb.min_y < WALL_Y_MIN)
        obj_pos[1] += WALL_Y_MIN - bb.min_y;

    if (obj_parent && m_obj.is_armature(obj_parent))
        // translate the parent (armature) of the animated object
        m_trans.set_translation_v(obj_parent, obj_pos);
    else
        m_trans.set_translation_v(obj, obj_pos);
}



init();
