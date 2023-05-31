precision highp float;
uniform sampler2D src;
uniform sampler2D previous;
varying vec2 uv;

float remap(float value, float start1, float stop1, float start2, float stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float cremap(float value, float start1, float stop1, float start2, float stop2) {
  float r = remap(value, start1, stop1, start2, stop2);
  return clamp(r, min(start2, stop2), max(start2, stop2));
}

void main(){
    vec4 srcData = texture2D(src, uv);
    vec2 srcDir = srcData.rg;
    float srcVel = length(srcData.rgb);
    srcVel = cremap(srcVel, 0.5, 1., 0., 1.);

    vec4 previousData = texture2D(previous, uv);
    float previousVel = previousData.b * 0.99;
    vec2 previousDir = previousData.rg;
  
    float vel = max(srcVel, previousVel);
    vec2 dir = srcVel > 0.0001 ? srcDir : previousDir;
    gl_FragColor = vec4(dir, vel, 1.);
}
