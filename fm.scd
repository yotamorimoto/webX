s.scope;
MIDIIn.connectAll;
// simp
(
MIDIFunc.noteOn { |v,n|
    {
        var car, mod, sig;
        mod = SinOsc.ar(n.midicps)*Env.perc.kr(0);
        sig = SinOsc.ar(n.midicps*mod*v.linlin(1,100,1,8));
        sig = sig*Env.perc.kr(2)*v.linlin(1,100,-30,-9).dbamp;
        Pan2.ar(sig, Rand(-1,1));
    }.play;
}
)
// piano
(
MIDIFunc.noteOn { |v,n|
    {
       var sig = PMOsc.ar(
            n.midicps,
			n.midicps*[1,2.3],
			Env.perc(0.005,0.05).kr(0).range(0,[2,1])
        )*Env.perc(0.005).kr(2)*v.linlin(1,100,-30,-9).dbamp;
		sig = Mix(sig*[1.3,0.3]);
        Pan2.ar(sig, Rand(-1,1));
    }.play;
}
)
// sitar?
(
MIDIFunc.noteOn { |v,n|
    {
       var sig = PMOsc.ar(
            n.midicps*[1,0.5],
            n.midicps*1.5,
            Env.triangle(0.5).kr(0).range(0,1)*v.linlin(1,100,0.5,3)
        )*Env.perc(0.005).kr(2)*v.linlin(1,100,-30,-9).dbamp;
        sig = Mix(sig);
        Pan2.ar(sig, Rand(-1,1));
    }.play;
}
)
// key
(
MIDIFunc.noteOn { |v,n|
	if(n > 60, {
		{
			var sig = PMOsc.ar(
				n.midicps*[1,0.5],
				n.midicps*1.5,
				Env.perc(0.005,0.1).kr(0).range(0,1)*v.linlin(1,100,0.5,0.8)
			)*Env.perc(0.005).kr(2)*v.linlin(1,100,-30,-9).dbamp;
			sig = Mix(sig);
			Pan2.ar(sig, Rand(-1,1));
		}.play;
	}, {
		{
			var sig = PMOsc.ar(
				n.midicps*[1,0.5],
				n.midicps*3,
				Env.perc(0.005,0.1).kr(0).range(0,1)*v.linlin(1,100,0.5,0.8)
			)*Env.perc(0.005).kr(2)*v.linlin(1,100,-30,-9).dbamp;
			sig = Mix(sig);
			Pan2.ar(sig, Rand(-1,1));
		}.play;
	});
}
)

{PMOsc.ar(200, 200*2, Env.linen(0.5,0.1,0.1).kr(0).range(5,1))*Env.perc.kr(2)*0.3}.play;
{PMOsc.ar(200, 200*(1.51), Env.triangle(1).kr(0).range(5,0))*Env.perc.kr(2)*0.3}.play;
{PMOsc.ar(200, 200*(1.333), Env.perc(0.01,0.01).kr(0).range(0,3))*Env.perc.kr(2)*0.3}.play;
{PMOsc.ar(1000, 1000*1.3, Env.perc(0.01,0.05).kr(0).range(0,1))*Env.perc.kr(2)*0.3}.play;
{PMOsc.ar(1000, 1000*1.3, Env.perc(0.1,0.05).kr(0).range(0,3))*Env.perc.kr(2)*0.3}.play;
{PMOsc.ar(200, 200*(2.01), Env.linen(0.5,0.1,0.1).kr(0).range(5,1))*Env.perc.kr(2)*0.3}.play;
6/5
