import face_vert from "./glsl/sim/face.vert"
import accumulation_frag from "./glsl/sim/accumulation.frag"

import ShaderPass from "./ShaderPass"

export default class Accumulation extends ShaderPass {
    constructor(simProps){

        super({
            material: {
                vertexShader: face_vert,
                fragmentShader: accumulation_frag,
                uniforms: {
                    src: {
                        value: simProps.src.texture
                    },
                    previous: {
                        value: simProps.dst_.texture
                    }
                }
            },
            output: simProps.dst
        })

        this.simProps = simProps

        this.init();
    }

    update({ pressure }) {
        this.props.output = this.simProps.dst
        this.uniforms.previous.value = this.simProps.dst_.texture
        this.uniforms.src.value = pressure.texture
        super.update()

        let tmpDst = this.simProps.dst
        this.simProps.dst = this.simProps.dst_
        this.simProps.dst_ = tmpDst
    }
}
