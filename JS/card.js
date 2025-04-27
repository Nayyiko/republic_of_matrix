document.addEventListener("DOMContentLoaded", () => {
	const cards = document.querySelectorAll(".deconstructed-card");

	cards.forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;

			const xDeg = (y - 0.5) * 8;
			const yDeg = (x - 0.5) * -8;

			card.style.transform = `perspective(1200px) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;

			const layers = card.querySelectorAll(".card-layer");

			layers.forEach((layer, index) => {
				const depth = 30 * (index + 1);
				const translateZ = depth;
				const offsetX = (x - 0.5) * 10 * (index + 1);
				const offsetY = (y - 0.5) * 10 * (index + 1);

				layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, ${translateZ}px)`;
			});

			const waveSvg = card.querySelector(".wave-svg");
			if (waveSvg) {
				const moveX = (x - 0.5) * -20;
				const moveY = (y - 0.5) * -20;
				waveSvg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;

				const wavePaths = waveSvg.querySelectorAll("path:not(:first-child)");
				wavePaths.forEach((path, index) => {
					const factor = 1 + index * 0.5;
					const waveX = moveX * factor * 0.5;
					const waveY = moveY * factor * 0.3;
					path.style.transform = `translate(${waveX}px, ${waveY}px)`;
				});
			}

			const bgObjects = card.querySelectorAll(".bg-object");
			bgObjects.forEach((obj, index) => {
				const factorX = (index + 1) * 10;
				const factorY = (index + 1) * 8;
				const moveX = (x - 0.5) * factorX;
				const moveY = (y - 0.5) * factorY;

				if (obj.classList.contains("square")) {
					obj.style.transform = `rotate(45deg) translate(${moveX}px, ${moveY}px)`;
				} else if (obj.classList.contains("triangle")) {
					obj.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px)) scale(1)`;
				} else {
					obj.style.transform = `translate(${moveX}px, ${moveY}px)`;
				}
			});
		});

		card.addEventListener("mouseleave", () => {
			card.style.transform = "";

			const layers = card.querySelectorAll(".card-layer");
			layers.forEach((layer) => {
				layer.style.transform = "";
			});

			const waveSvg = card.querySelector(".wave-svg");
			if (waveSvg) {
				waveSvg.style.transform = "";

				const wavePaths = waveSvg.querySelectorAll("path:not(:first-child)");
				wavePaths.forEach((path) => {
					path.style.transform = "";
				});
			}

			const bgObjects = card.querySelectorAll(".bg-object");
			bgObjects.forEach((obj) => {
				if (obj.classList.contains("square")) {
					obj.style.transform = "rotate(45deg) translateY(-20px)";
				} else if (obj.classList.contains("triangle")) {
					obj.style.transform = "translate(-50%, -50%) scale(0.5)";
				} else {
					obj.style.transform = "translateY(20px)";
				}
			});
		});
	});
});


 
 // 二进制流背景动画
 let canvas, ctx;
 let fontSize = 10;
 let columns, drops;
 const binaryChars = ['0', '1'];
 const streamSpeed = 5;
 const binaryColor = '#00AA00';

 function initCanvas() {
	 canvas = document.getElementById('canvas');
	 ctx = canvas.getContext('2d');
	 resizeCanvas();
	 
	 // 初始化drops数组
	 drops = new Array(columns).fill(1);
 }

 function resizeCanvas() {
	 canvas.width = window.innerWidth;
	 canvas.height = window.innerHeight;
	 columns = Math.floor(canvas.width / fontSize);
	 drops = new Array(columns).fill(1);
 }

 function draw() {
	 ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
	 ctx.fillRect(0, 0, canvas.width, canvas.height);

	 ctx.fillStyle = binaryColor;
	 ctx.font = fontSize + 'px monospace';

	 for (let i = 0; i < drops.length; i++) {
		 const text = binaryChars[Math.floor(Math.random() * binaryChars.length)];
		 ctx.fillText(text, i * fontSize, drops[i] * fontSize);

		 if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
			 drops[i] = 0;
		 }
		 drops[i] += streamSpeed / 5;
	 }
 }

 function animate() {
	 draw();
	 requestAnimationFrame(animate);
 }

 // 初始化并监听窗口大小变化
 window.addEventListener('load', () => {
	 initCanvas();
	 animate();
 });

 window.addEventListener('resize', () => {
	 resizeCanvas();
 });


// 光标动画样式
const cursor = document.createElement('div');
cursor.id = 'cursor';
document.body.appendChild(cursor);

let isVisible = false;
let animationPaused = false;

function updateCursorPosition(e) {
 cursor.style.left = e.clientX + 'px';
 cursor.style.top = e.clientY + 'px';
 isVisible = true;
 if (animationPaused) {
	 cursor.style.animationPlayState = 'running';
	 animationPaused = false;
 }
}

function hideCursor() {
 isVisible = false;
 cursor.style.animationPlayState = 'paused';
 animationPaused = true;
}

window.addEventListener('mousemove', updateCursorPosition);
window.addEventListener('mouseout', hideCursor);

function animateCursor() {
 cursor.style.display = isVisible ? 'block' : 'none';
 requestAnimationFrame(animateCursor);
}
animateCursor();

function animate() {
 draw();
 requestAnimationFrame(animate);
}

animate();




