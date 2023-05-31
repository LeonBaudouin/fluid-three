import Common from "./Common";
import * as THREE from "three";

import Simulation from "./Simulation";
import face_vert from "./glsl/sim/face.vert";
import color_frag from "./glsl/sim/color.frag";

import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel';
import Stats from 'stats-js';

export default class Output{
    constructor(){
        this.init();
    }

    init(){
        this.simulation = new Simulation();

        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();

        this.output = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.RawShaderMaterial({
                vertexShader: face_vert,
                fragmentShader: color_frag,
                uniforms: {
                    fbo: {
                        value: this.simulation.fbos.accumulation_0.texture
                        // value: this.simulation.fbos.vel_0.texture
                    },
                    boundarySpace: {
                        value: new THREE.Vector2()
                    },
                    map: {
                        value: new THREE.TextureLoader().load('uv.png')
                    }
                },
            })
        );

        this.scene.add(this.output);


        const stats = new Stats();
        document.body.appendChild(stats.dom);
        const panel = new GPUStatsPanel(Common.renderer.getContext());
        this._statsGpuPanel = panel
        stats.addPanel(panel);

        this._stats = stats

    }
    addScene(mesh){
        this.scene.add(mesh);
    }

    resize(){
        this.simulation.resize();
    }

    render(){
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
    }

    update(){
        this._stats?.begin();

        this._statsGpuPanel?.startQuery();

        this.simulation.update();
        this.output.material.uniforms.fbo.value = this.simulation.accumulation.props.output.texture
        this.render();

        this._statsGpuPanel?.endQuery();

        this._stats?.end();
    }
}