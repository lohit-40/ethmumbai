import React, { useState, useEffect } from 'react';

export default function HeroSection({ children }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // 1. Track Mouse for Parallax Effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Calculate mouse position relative to center of screen
            const x = (e.clientX / window.innerWidth - 0.5) * 20; // Max move 20px
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-full h-[800px] md:h-screen overflow-hidden bg-[#E2231A] flex items-center justify-center">

            {/* LAYER 1: SKY & CLOUDS (Clean Red, moves slightly) */}
            {/* LAYER 1: SKY & CLOUDS (Clean Red, moves slightly) */}
            <div
                className="absolute inset-0 w-full h-full bg-no-repeat transition-transform duration-100 ease-out"
                style={{
                    backgroundImage: "url('/assets/bg-sky.png')",
                    backgroundSize: '95% auto',
                    backgroundPosition: 'center -50px',
                    transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
                }}
            ></div>

            {/* LAYER 1.5: BALLOON (Independent Float) */}
            <img
                src="/assets/balloon-layer.png"
                alt="Balloon"
                className="absolute top-[10%] left-[10%] w-[120px] md:w-[200px] object-contain animate-float-slow opacity-90 transition-transform duration-300 ease-out"
                style={{
                    transform: `translate(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px)`
                }}
            />
            {/* LAYER 2: CITY SKYLINE (Static or very slow move) */}
            {/* LAYER 2: CITY SKYLINE (Static or very slow move) */}
            {/* LAYER 2: CITY SKYLINE (Static or very slow move) */}
            {/* LAYER 2: CITY SKYLINE (Static or very slow move) */}
            {/* LAYER 2: CITY SKYLINE (Static or very slow move) */}
            <img
                src="/assets/city-layer.png"
                alt="City"
                // object-left-bottom ensures it sticks to the left
                className="absolute bottom-[50px] md:bottom-[60px] left-0 w-full h-auto max-h-[95vh] object-contain object-left-bottom transition-transform duration-200 ease-out"
                style={{
                    transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)`
                }}
            />

            {/* LAYER 3: THE BUS (Moving Hero) */}
            <div className="absolute bottom-[-80px] md:bottom-[-150px] z-20 pointer-events-none animate-slide-in-right">
                <img
                    src="/assets/bus-layer.png"
                    alt="ETHMumbai Bus"
                    className="w-[250px] md:w-[550px] object-contain animate-driving drop-shadow-2xl"
                    style={{
                        transform: `translateX(${mousePos.x * 2}px) translateY(${mousePos.y * 0.5}px)` // Move horizontally more
                    }}
                />
            </div>

            {/* LAYER 4: ROAD (Foreground Cover) */}
            <img
                src="/assets/road-layer.png"
                alt="Road"
                className="absolute bottom-0 w-full h-[30px] md:h-[50px] object-cover z-30 pointer-events-none"
            />

            {/* LAYER 5: OVERLAY CONTENT (Text/Buttons) */}
            <div className="absolute top-0 w-full h-full z-40 flex flex-col items-center justify-center pt-20">
                {children}
            </div>

            {/* STYLE FOR ANIMATION */}
            <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        @keyframes driving {
          0% { transform: translateY(1px); }
          50% { transform: translateY(-1px); }
          100% { transform: translateY(1px); }
        }
        .animate-driving {
          animation: driving 0.2s linear infinite; /* Engine vibration */
        }
        @keyframes slide-in-right {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 1.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
