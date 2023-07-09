import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import Stats from 'three/addons/libs/stats.module.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc7d4cb);

const light = new THREE.SpotLight()
light.position.set(20, 20, 20)
scene.add(light)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
)
camera.position.z = 3

// setup onClick events
var button_t1_dec = document.getElementById("button_t1_dec");
var button_t1_inc = document.getElementById("button_t1_inc");
var button_t2_dec = document.getElementById("button_t2_dec");
var button_t2_inc = document.getElementById("button_t2_inc");
var button_t3_dec = document.getElementById("button_t3_dec");
var button_t3_inc = document.getElementById("button_t3_inc");
var button_t4_dec = document.getElementById("button_t4_dec");
var button_t4_inc = document.getElementById("button_t4_inc");
var button_t5_dec = document.getElementById("button_t5_dec");
var button_t5_inc = document.getElementById("button_t5_inc");
var button_t6_dec = document.getElementById("button_t6_dec");
var button_t6_inc = document.getElementById("button_t6_inc");
var t1_rate_of_change = 0;
var t2_rate_of_change = 0;
var t3_rate_of_change = 0;
var t4_rate_of_change = 0;
var t5_rate_of_change = 0;
var t6_rate_of_change = 0;
button_t1_inc.addEventListener("mousedown", () => { t1_rate_of_change = 0.01; });
button_t1_inc.addEventListener("mouseup", () => { t1_rate_of_change = 0; });
button_t1_inc.addEventListener("mouseleave", () => { t1_rate_of_change = 0; });
button_t1_dec.addEventListener("mousedown", () => { t1_rate_of_change = -0.01; });
button_t1_dec.addEventListener("mouseup", () => { t1_rate_of_change = 0; });
button_t1_dec.addEventListener("mouseleave", () => { t1_rate_of_change = 0; });

button_t2_inc.addEventListener("mousedown", () => { t2_rate_of_change = 0.01; });
button_t2_inc.addEventListener("mouseup", () => { t2_rate_of_change = 0; });
button_t2_inc.addEventListener("mouseleave", () => { t2_rate_of_change = 0; });
button_t2_dec.addEventListener("mousedown", () => { t2_rate_of_change = -0.01; });
button_t2_dec.addEventListener("mouseup", () => { t2_rate_of_change = 0; });
button_t2_dec.addEventListener("mouseleave", () => { t2_rate_of_change = 0; });

button_t3_inc.addEventListener("mousedown", () => { t3_rate_of_change = 0.01; });
button_t3_inc.addEventListener("mouseup", () => { t3_rate_of_change = 0; });
button_t3_inc.addEventListener("mouseleave", () => { t3_rate_of_change = 0; });
button_t3_dec.addEventListener("mousedown", () => { t3_rate_of_change = -0.01; });
button_t3_dec.addEventListener("mouseup", () => { t3_rate_of_change = 0; });
button_t3_dec.addEventListener("mouseleave", () => { t3_rate_of_change = 0; });

button_t4_inc.addEventListener("mousedown", () => { t4_rate_of_change = 0.01; });
button_t4_inc.addEventListener("mouseup", () => { t4_rate_of_change = 0; });
button_t4_inc.addEventListener("mouseleave", () => { t4_rate_of_change = 0; });
button_t4_dec.addEventListener("mousedown", () => { t4_rate_of_change = -0.01; });
button_t4_dec.addEventListener("mouseup", () => { t4_rate_of_change = 0; });
button_t4_dec.addEventListener("mouseleave", () => { t4_rate_of_change = 0; });

button_t5_inc.addEventListener("mousedown", () => { t5_rate_of_change = 0.01; });
button_t5_inc.addEventListener("mouseup", () => { t5_rate_of_change = 0; });
button_t5_inc.addEventListener("mouseleave", () => { t5_rate_of_change = 0; });
button_t5_dec.addEventListener("mousedown", () => { t5_rate_of_change = -0.01; });
button_t5_dec.addEventListener("mouseup", () => { t5_rate_of_change = 0; });
button_t5_dec.addEventListener("mouseleave", () => { t5_rate_of_change = 0; });
button_t4_dec.addEventListener("mouseleave", () => { t4_rate_of_change = 0; });

button_t6_inc.addEventListener("mousedown", () => { t6_rate_of_change = 0.01; });
button_t6_inc.addEventListener("mouseup", () => { t6_rate_of_change = 0; });
button_t6_inc.addEventListener("mouseleave", () => { t6_rate_of_change = 0; });
button_t6_dec.addEventListener("mousedown", () => { t6_rate_of_change = -0.01; });
button_t6_dec.addEventListener("mouseup", () => { t6_rate_of_change = 0; });
button_t6_dec.addEventListener("mouseleave", () => { t6_rate_of_change = 0; });


let t1_value_dom = document.getElementById('value_t1');
let t2_value_dom = document.getElementById('value_t2');
let t3_value_dom = document.getElementById('value_t3');
let t4_value_dom = document.getElementById('value_t4');
let t5_value_dom = document.getElementById('value_t5');
let t6_value_dom = document.getElementById('value_t6');

const renderer = new THREE.WebGLRenderer()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const material = new THREE.MeshPhysicalMaterial({
    color: 0x5c5c5c,
    metalness: 0.25,
    roughness: 0.1,
    opacity: 1.0,
    transparent: true,
    transmission: 0.99,
    clearcoat: 1.0,
    clearcoatRoughness: 0.25
})

function load_arm(filename, onLoad)
{
    if(filename){
        loader.load(
            'models/' + filename,
            function (geometry) {
                const mesh = new THREE.Mesh(geometry, material)
                // scene.add(mesh)
                onLoad(mesh);
            },
            (xhr) => {
                // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        );
    }
    else{
        onLoad();
    }
}


function add_cylinder(radius, height, color)
{
    let cylindergeometry = new THREE.CylinderGeometry( radius, radius, height, 32 ); 
    let cylindermaterial = new THREE.MeshBasicMaterial( {color: color} ); 
    let cylinder = new THREE.Mesh( cylindergeometry, cylindermaterial );
    scene.add( cylinder );
}

function translate_z(d)
{
    return new THREE.Matrix4().makeTranslation(0.0, 0.0, d);
}

function rotate_z(theta)
{
    return new THREE.Matrix4().makeRotationZ(theta);
}

/// alpha: radians
function rotate_x(alpha)
{
    return new THREE.Matrix4().makeRotationX(alpha);
}

function translate_x(a)
{
    return new THREE.Matrix4().makeTranslation(a, 0.0, 0.0);
}

function transform(matrix, params)
{
    // Denavit Hartenberg convention: Tz Rz Rx Tx
    let transform = translate_z(params.d)
    .multiply(rotate_z(params.theta))
    .multiply(rotate_x(params.alpha))
    .multiply(translate_x(params.a));

    if(matrix)
        return matrix.multiply(transform);
    else
        return transform;
}

function params_to_rad(params)
{
    return {
        "theta": params.theta * Math.PI / 180.0,
        "d": params.d,
        "alpha": params.alpha * Math.PI / 180.0,
        "a": params.a
    };
}

const loader = new STLLoader()
// load_arm('models/03Arm1B35cm.stl')
// add_cylinder(1, 450, 0xff0000);

var arms = [];
var base = new THREE.Mesh();
fetch('models/dimensions.json')
.then((response) => response.json())
.then((json) => {
        console.log(json);
        json.forEach((item) => {
            console.log('Loading: ' + item.file);
            load_arm(item.file, (mesh)=>{
                item.mesh = mesh;
            });
        });
        arms = json;
    });
    
var theta = [];
var controls_avail = false;
setTimeout(()=>{
    // Transformation from current mesh to next mesh
    // arms[6].mesh.userData = params_to_rad(arms[6].next_joint);
    // arms[4].mesh.userData = [ params_to_rad(arms[4].next_joint), params_to_rad(arms[5].next_joint) ];
    // arms[3].mesh.userData = params_to_rad(arms[3].next_joint);
    arms[2].mesh.userData = params_to_rad(arms[2].next_joint);
    arms[1].mesh.userData = params_to_rad(arms[1].next_joint);
    arms[0].mesh.userData = params_to_rad(arms[0].next_joint);
    
    // set as child of preceding object
    arms[6].mesh.add(arms[7].mesh);
    arms[4].mesh.add(arms[6].mesh);
    arms[3].mesh.add(arms[4].mesh);
    arms[2].mesh.add(arms[3].mesh);
    arms[1].mesh.add(arms[2].mesh);
    arms[0].mesh.add(arms[1].mesh);   
    scene.add(arms[0].mesh);

    // console.log("inside", arms);
    let origin = new THREE.Matrix4();
    let axishelper;
    arms.forEach(item => {
        if(item.file)
            theta.push(item.next_joint.theta);

        transform(origin, params_to_rad(item.next_joint));
        let helper = new THREE.AxesHelper(100);
        helper.mastrix9
        helper.geometry.applyMatrix4(origin);
        scene.add(axeshelper);
    });


    controls_avail = true;
}, 1000.0);

console.log(arms);

function replace_theta(params, theta) 
{
    return {
        "theta": theta,
        "d": params.d,
        "alpha": params.alpha,
        "a": params.a
    };
}

function update_model_pose()
{

    // arms[6].mesh.userData.theta = theta[5];
    // arms[4].mesh.userData[0].theta = theta[4];
    // arms[3].mesh.userData.theta = theta[3];
    // arms[2].mesh.userData.theta = theta[2];
    arms[2].mesh.userData.theta = theta[1];
    arms[1].mesh.userData.theta = theta[0];
    arms[0].mesh.traverse((mesh) => {
        if(Object.keys(mesh.userData).length !== 0) {
            mesh.matrixAutoUpdate = false;
            var m;
            if( Array.isArray(mesh.userData) )
                m = transform(transform(undefined, mesh.userData[0]), mesh.userData[1]);
            else 
                m = transform(undefined, mesh.userData);
            mesh.matrix = m;
        }
    });
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
    if(controls_avail) {
        theta[0] = theta[0] + t1_rate_of_change;
        t1_value_dom.innerHTML = theta[0];
        theta[1] = theta[1] + t2_rate_of_change;
        t2_value_dom.innerHTML = theta[1];
        theta[2] = theta[2] + t3_rate_of_change;
        t3_value_dom.innerHTML = theta[2];
        theta[3] = theta[3] + t4_rate_of_change;
        t4_value_dom.innerHTML = theta[3];
        theta[4] = theta[4] + t5_rate_of_change;
        t5_value_dom.innerHTML = theta[4];
        theta[5] = theta[5] + t6_rate_of_change;
        t6_value_dom.innerHTML = theta[5];
        update_model_pose();
    }

    console.log(theta[0])

    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()