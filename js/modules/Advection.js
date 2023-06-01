import face_vert from "./glsl/sim/face.vert";

import advection_frag from "./glsl/sim/advection.frag";
import ShaderPass from "./ShaderPass";

import * as THREE from "three";
import Controls from "./Controls";


export default class Advection extends ShaderPass{
    constructor(simProps){
        super({
            material: {
                vertexShader: face_vert,
                fragmentShader: advection_frag,
                uniforms: {
                    boundarySpace: {
                        value: simProps.cellScale
                    },
                    fboSize: {
                        value: simProps.fboSize
                    },
                    velocity: {
                        value: simProps.src.texture
                    },
                    noise: {
                        value: new THREE.TextureLoader().load('/noise.png')
                    },
                    noisePower: {
                        value: 10,
                    },
                    noiseFactor: {
                        value: 100
                    },
                    dt: {
                        value: simProps.dt
                    },
                },
            },
            output: simProps.dst
        });

        this.init();


        Controls.instance.gui.add(this.material.uniforms.noisePower, 'value')
        Controls.instance.gui.add(this.material.uniforms.noiseFactor, 'value')
    }

    init(){
        super.init();
        this.createBoundary();
    }

    createBoundary(){
        const boundaryG = new THREE.BufferGeometry();
        const vertices_boundary = new Float32Array([
            // left
            -1, -1, 0,
            -1, 1, 0,

            // top
            -1, 1, 0,
            1, 1, 0,

            // right
            1, 1, 0,
            1, -1, 0,

            // bottom
            1, -1, 0,
            -1, -1, 0
        ]);
        boundaryG.setAttribute( 'position', new THREE.BufferAttribute( vertices_boundary, 3 ) );
    }

    update({ dt }){

        this.uniforms.dt.value = dt;

        super.update();
    }
}