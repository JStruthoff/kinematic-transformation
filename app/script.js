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
var button_t1_inc = document.getElementById("button_t1_inc");
var button_t1_dec = document.getElementById("button_t1_dec");
var t1_rate_of_change = 0;
button_t1_inc.addEventListener("mousedown", () => { t1_rate_of_change = 0.01; });
button_t1_inc.addEventListener("mouseup", () => { t1_rate_of_change = 0; });
button_t1_inc.addEventListener("mouseleave", () => { t1_rate_of_change = 0; });
button_t1_dec.addEventListener("mousedown", () => { t1_rate_of_change = -0.01; });
button_t1_dec.addEventListener("mouseup", () => { t1_rate_of_change = 0; });
button_t1_dec.addEventListener("mouseleave", () => { t1_rate_of_change = 0; });


let t1_value_dom = document.getElementById('value_t1');
let t2_value_dom = document.getElementById('value_t2');
let t3_value_dom = document.getElementById('value_t3');
let t4_value_dom = document.getElementById('value_t4');
let t5_value_dom = document.getElementById('value_t5');

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
                scene.add(mesh)
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
    // console.log("inside", arms);
    let origin = new THREE.Matrix4();
    arms.forEach(item => {
        // console.log(JSON.stringify(origin));
        if(item.file)
            theta.push(item.next_joint.theta);
        if(item.mesh)
            item.mesh.geometry.applyMatrix4(origin);
        transform(origin, params_to_rad(item.next_joint));
        let axeshelper = new THREE.AxesHelper(100);
        axeshelper.geometry.applyMatrix4(origin);
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
    let origin = new THREE.Matrix4();
    arms.forEach((item, i) => {
        let params = item.next_joint;
        if(item.file){
            params = replace_theta(item.next_joint, theta[i])
        }
        if(item.mesh){
            item.mesh.matrixWorld = false;
            item.mesh.matrixWorldAutoUpdate = false;
            item.mesh.matrixWorld = origin; 
            item.mesh.matrix = origin; 
        }
        origin = transform(origin, params)
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