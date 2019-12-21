import * as THREE from '../../../node_modules/three-full';
import * as $ from "jquery";
import * as plans from "./plan";
import * as track from "./tracker";
import * as react from 'REACT';
import * as TWEEN from '@tweenjs/tween.js'
import { Tween, Easing } from '@tweenjs/tween.js';
import * as createjs from 'createjs-module';

import verticesdata from "./models/example";

export class Scene
{
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private plane: THREE.PlaneGeometry; 
    private wall01: THREE.PlaneGeometry; 
    private gridHelper: THREE.GridHelper;
    private axesHelper: THREE.AxesHelper;
    private light: THREE.PointLight;
    private light02: THREE.PointLight;
    private alight: THREE.AmbientLight;
    private sight: THREE.Vector2;
    private controls: THREE.OrbitControls;
    private raycaster: THREE.Raycaster;
    private floorplane: THREE.PlaneGeometry;
    private PSphere01: THREE.SphereGeometry;
    private PDot01: THREE.CircleGeometry;
    private p01m: THREE.MeshLambertMaterial;
    private p01mh: THREE.MeshLambertMaterial;
    private p01m2d: THREE.MeshBasicMaterial;

    private room01: THREE.Group;

    public constructor()
    {
        this.raycaster = new THREE.Raycaster();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 
        this.camera.lookAt(this.scene.position);
        this.room01 = new THREE.Group;
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
        this.controls = this.controls;
        this.controls.update();
        this.controls.maxDistance = 25;

        const container = document.getElementById('canvas');
        container.appendChild(this.renderer.domElement);

        this.floorplane = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(100, 100),
          new THREE.ShadowMaterial({ 
            color: 0xbbbbbb, transparent: true, opacity: 0.5
          })
        );
        
        this.floorplane.rotation.x = -Math.PI / 2;
        this.floorplane.receiveShadow = true;
        this.floorplane.position.set(0,-.4,0);
        this.scene.add( this.floorplane );

        this.light = new THREE.PointLight( 0xffffff, 1, 50 );
        this.light.position.set( 0, 10, 0 );
        this.light.castShadow = true;        
        this.scene.add( this.light );

        this.light02 = new THREE.PointLight( 0xffffff, 1, 50 );
        this.light02.position.set( 0, 10, 50 );
        this.scene.add( this.light02 );

        this.alight = new THREE.AmbientLight( 0xffffff, .6 );
        this.scene.add( this.alight );

        this.light.shadow.mapSize.width = 100;  
        this.light.shadow.mapSize.height = 100; 
        this.light.shadow.camera.near = 0.5;       
        this.light.shadow.camera.far = 500      

        this.scene.add( track.person01 );

        this.scene.add( plans.region01 );

        this.room01.add(
            plans.wall01,
            plans.wall02,
            plans.wall03,
            plans.wall04,
            plans.wall05,
            plans.object01
            );
        }

    public Init(): void
    {
        this.camera.position.z = -8;
        this.camera.position.y = 10;
        this.camera.position.x = -2;
        this.scene.add(this.room01);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.setClearColor( 0xffffff );
        const button2d = $("#2d");
        button2d.on("click", (evt) => this.two(evt) );
        const button3d = $("#3d");
        button3d.on("click", (evt) => this.three(evt) );
        this.controls.update();
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
    }

    private two(evt : any) : void 
    {
        const D = new TWEEN.Tween(this.camera.position).to({ x: 0,z: 0,y: 15 })
        .onUpdate((o: any) => { this.camera.lookAt(new THREE.Vector3(0,0,0));
        }).onComplete((o: any) => {
        this.controls.target = new THREE.Vector3(0,0,0);
        }).start();  
        const E = new TWEEN.Tween(this.room01.scale).to({ x: 1, z: 1, y: .01 }).start();
        const F = new TWEEN.Tween(this.camera.rotation).to({ z: 0 }).start();
        this.controls.enableZoom = false;
        this.controls.enableRotate = false;
        this.controls.enablePan = false;
        this.controls.update();
        this.renderer.shadowMap.enabled = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 
        this.scene.remove( this.floorplane );
        this.scene.remove( this.light );
        this.scene.remove( this.light02 );
        track.p01m.opacity = 0;
        track.p01mh.opacity = 0;
        track.p01m2d.opacity = 1;
    }

    private three(evt : any) : void 
    {   
        const D = new TWEEN.Tween(this.camera.position).to({ x: -2,z: -8, y: 10 })
        .onUpdate((o: any) => { this.camera.lookAt(new THREE.Vector3(0,0,0));
        })
        .onComplete((o: any) => {
        this.controls.target = new THREE.Vector3(0,0,0);
        }).start(); 
        const E = new TWEEN.Tween(this.room01.scale).to({ x: 1, z: 1, y: 1 }).start();  
        const F = new TWEEN.Tween(this.camera.rotation).to({ z: -2.9 }).start();
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = false;
        this.controls.update();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default 
        this.scene.add( this.floorplane );
        this.scene.add( this.light );
        this.scene.add( this.light02 );
        track.p01m.opacity = 1;
        track.p01mh.opacity = 1;
        track.p01m2d.opacity = 0;
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.controls.update();
    }

    public Animate(): void
    {
        this.renderer.render(this.scene, this.camera);
        TWEEN.update();
        if (this.camera.position.y < 2) {
            this.camera.position.y = 2
        }
        const center = new THREE.Vector3( 0,0,0 );
        this.raycaster.setFromCamera( center, this.camera );
        const intersects = this.raycaster.intersectObjects( this.room01.children );
        if (intersects.length > 0) {
          intersects[0].object.material.opacity = 0.5;
        }
        else{
        this.room01.traverse( function( node ) {
        if( node.material ) {
            node.material.opacity = 1;
            node.material.transparent = true;
            }
        });
        }
        requestAnimationFrame(() => this.Animate());
    }
}