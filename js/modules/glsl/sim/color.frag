precision highp float;
uniform sampler2D fbo;
uniform sampler2D map;
varying vec2 uv;

float remap(float value, float start1, float stop1, float start2, float stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float cremap(float value, float start1, float stop1, float start2, float stop2) {
  float r = remap(value, start1, stop1, start2, stop2);
  return clamp(r, min(start2, stop2), max(start2, stop2));
}

void main(){
  vec3 data = texture2D(fbo, uv).rgb;
  vec2 dir = data.rg;
  float vel = data.b;
  vec2 normDir = ((dir * vel) * 0.5) + 0.5;
  float offsetStrength = 0.1;
  vec2 newUv = uv + dir * offsetStrength * vel;
  vec3 tex = texture2D(map, newUv).rgb;
  // gl_FragColor = vec4(normDir, 1., 1.0);
  gl_FragColor = vec4(tex * vel, 1.0);
}
