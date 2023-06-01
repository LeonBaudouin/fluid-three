precision highp float;
uniform sampler2D velocity;
uniform sampler2D noise;
uniform float noisePower;
uniform float noiseFactor;
uniform float dt;
// uniform float uvScale;
uniform vec2 fboSize;
varying vec2 uv;

void main(){
    vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;

    vec2 vel = texture2D(velocity, uv).xy;
    vec3 noiseData = texture2D(noise, uv).rgb;
    vec2 noiseDirection = normalize((noiseData.gb - 0.5) * 2.);
    // float na = (noiseData - 0.5) * 2.;
    // float ns = sign(na);
    // float v = pow(abs(na), 3.) * ns;
    // v = 1. + v * 0.1;
    float velocityFactor = pow(noiseData.r, noisePower) * noiseFactor;
    velocityFactor = mix(velocityFactor, 1., 0.2);
    // vec2 uv2 = uv - mix(vel, noiseDirection, velocityFactor) * dt * ratio;
    vec2 uv2 = uv - mix(vel, noiseDirection, 0.3) * dt * ratio * velocityFactor;
    vec2 newVel = texture2D(velocity, uv2).xy * 0.995;
    gl_FragColor = vec4(newVel, 0.0, 0.0);
}
