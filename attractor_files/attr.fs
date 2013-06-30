#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform float uTime;
uniform sampler2D uSampler;

void main(void) {
	float c=fract(vTextureCoord.x-uTime)*0.85;
	c*=c;
	c*=0.5;
	//c+=0.1;
	//c*=c;
	vec4 tex=texture2D(uSampler, vec2(fract(vTextureCoord.y-uTime*0.5),0.5));
	tex=0.25+tex*0.5;
	gl_FragColor = vec4(tex.rgb*c, tex.a);//vec4(c*(1.0-vTextureCoord.y), c*fract(vTextureCoord.x/2.0-uTime/2.0), c*vTextureCoord.y, 1.0);
}