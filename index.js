const canvas = document.getElementById("canvas01");
const ctx = canvas.getContext("2d");
let cWidth = canvas.width;
let cHeight = canvas.height;
const dft = (x) => {
  const X = [];
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const phi = (2 * Math.PI * k * n) / N;
      re += x[n] * Math.cos(phi);
      im -= x[n] * Math.sin(phi);
    }
    re /= N;
    im /= N;
    let freq = k;
    let amp = Math.sqrt(re * re + im * im);
    let phase = Math.atan2(im, re);
    X[k] = { re, im, freq, amp, phase };
  }
  return X;
};
//const dataY = [100, 100, 100, -100, -100, -100, 100, 100, 100, -100, -100, -100];
let dataY = [];
for (let i = 0; i < 200; i++) {
  // dataY.push(100 * Math.sin((2 * i * Math.PI) / 100));
  // dataY.push(100 * Math.random());
  //dataY.push(100 * Math.sin((2 * i * Math.PI) / 200));
  dataY.push(i);
}
const fourierY = dft(dataY);
fourierY.sort((a, b) => b.amp - a.amp);
const data = [];
let time = 0;
const px = 200;
const py = 300;
const animate = () => {
  requestAnimationFrame(animate);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);
  let x = 0;
  let y = 0;
  for (let i = 0; i < fourierY.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourierY[i].freq;
    let radius = fourierY[i].amp;
    let phase = fourierY[i].phase;
    x += radius * Math.cos(freq * time + phase + 0.5 * Math.PI);
    y += radius * Math.sin(freq * time + phase + 0.5 * Math.PI);

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
  data.unshift(y);
  if (data.length > 500) {
    data.pop();
  }

  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(px + x, py + y);
  ctx.lineTo(px + 100, py + data[0]);
  ctx.stroke();

  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(px + 100, py + data[0]);
  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(px + 100 + i * 1.5, py + data[i]);
  }
  ctx.stroke();
  const dt = (2 * Math.PI) / fourierY.length;
  time += dt;
};
animate();
