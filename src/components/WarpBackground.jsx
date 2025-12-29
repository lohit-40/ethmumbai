import React, { useEffect, useRef } from 'react';

const WarpBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let animationFrameId;
        let particles = [];

        // Brand colors: Yellow, Red, Green, White
        const colors = ['#FFD700', '#D93025', '#00FF00', '#FFFFFF'];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.reset();
                // Start at random z to fill screen initially
                this.z = Math.random() * canvas.width;
            }

            reset() {
                this.x = (Math.random() - 0.5) * canvas.width * 2;
                this.y = (Math.random() - 0.5) * canvas.height * 2;
                this.z = canvas.width; // Start far away
                this.size = Math.random() * 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // Move closer (decrease z)
                // Speed increases as it gets closer for "warp" effect
                this.z -= 15;

                if (this.z <= 0) {
                    this.reset();
                }
            }

            draw() {
                // Perspective projection
                // x' = x / z * constant
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Map 3D coordinates to 2D screen
                // We use a Field of View factor. 
                // As Z gets smaller (closer), the factor gets huge.
                const fov = canvas.width / 2;
                const scale = fov / (this.z + 1); // Avoid div by zero

                const sx = centerX + this.x * scale;
                const sy = centerY + this.y * scale;

                // Size also scales
                const r = this.size * scale;

                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0, r), 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < 400; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            // Trail effect
            ctx.fillStyle = 'rgba(20, 20, 20, 0.4)'; // Dark background with slight transparency for trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        init();
        animate();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
            style={{ background: '#111' }}
        />
    );
};

export default WarpBackground;
