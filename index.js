const canvas = document.getElementById("canvas01");
const ctx = canvas.getContext("2d");
let cWidth = canvas.width;
let cHeight = canvas.height;
let bool = false;
const mousedown = (e) => {
  canvas.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
  data = [];
  data.push([e.clientX - px, e.clientY - py]);
  bool = false;
};
const mousemove = (e) => {
  data.push([e.clientX - px, e.clientY - py]);
};
const mouseup = () => {
  canvas.removeEventListener("mousemove", mousemove);
  window.removeEventListener("mouseup", mouseup);
  // data = data.map((p) => [p[0] - px, p[1] - py]);
  data.reverse();
  fourier = dft(data);
  fourier.sort((a, b) => b.amp - a.amp);
  bool = true;
  time = 0;
};
canvas.addEventListener("mousedown", mousedown);
const dft = (d) => {
  const D = [];
  const N = d.length;
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      const x = Math.cos(phi);
      const y = Math.sin(phi);
      // (a+bi)*(c+di)
      // (ac-bd)+(bc+ad)i
      //re += d[n] * Math.cos(phi);
      //im -= d[n] * Math.sin(phi);
      re += d[n][0] * x - d[n][1] * y;
      im += d[n][1] * x + d[n][0] * y;
    }
    re /= N;
    im /= N;
    let freq = k;
    let amp = Math.sqrt(re * re + im * im);
    let phase = Math.atan2(im, re);
    D[k] = { re, im, freq, amp, phase };
  }
  return D;
};
let data = [];
const dataDraw = [];
let time = 0;
const px = 400;
const py = 300;
let fourier = [];
fourier = dft(data);
fourier.sort((a, b) => b.amp - a.amp);
const animate = () => {
  requestAnimationFrame(animate);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);
  if (bool) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < fourier.length; i++) {
      let prevx = x;
      let prevy = y;
      let freq = fourier[i].freq;
      let radius = fourier[i].amp;
      let phase = fourier[i].phase;
      x += radius * Math.cos(freq * time + phase);
      y += radius * Math.sin(freq * time + phase);

      ctx.strokeStyle = "#ff0000";
      ctx.beginPath();
      ctx.arc(px + prevx, py + prevy, radius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = "#00ff00";
      ctx.beginPath();
      ctx.moveTo(px + prevx, py + prevy);
      ctx.lineTo(px + x, py + y);
      ctx.stroke();
    }
  }
  // dataDraw.unshift([x, y]);
  // if (dataDraw.length > fourier.length) {
  //   dataDraw.pop();
  // }
  if (data.length > 1) {
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(px + data[0][0], py + data[0][1]);
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(px + data[i][0], py + data[i][1]);
    }
    ctx.stroke();
  }
  const dt = (2 * Math.PI) / fourier.length;
  time += dt;
};
animate();
