import React from 'react';

const FloatingTokens = () => {
    // Random positions and delays for a natural feel
    const tokens = [
        { id: 1, left: '10%', top: '20%', delay: '0s', duration: '15s', size: 'w-16 h-16' },
        { id: 2, left: '85%', top: '15%', delay: '2s', duration: '18s', size: 'w-24 h-24' },
        { id: 3, left: '75%', top: '60%', delay: '5s', duration: '20s', size: 'w-20 h-20' },
        { id: 4, left: '15%', top: '70%', delay: '1s', duration: '22s', size: 'w-14 h-14' },
        { id: 5, left: '45%', top: '40%', delay: '8s', duration: '25s', size: 'w-12 h-12' },
    ];

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden font-headline">
            {tokens.map((token) => (
                <div
                    key={token.id}
                    className={`absolute opacity-60 animate-float ${token.size} group`}
                    style={{
                        left: token.left,
                        top: token.top,
                        animationDelay: token.delay,
                        animationDuration: token.duration,
                    }}
                >
                    <div className="relative w-full h-full transform transition-transform duration-500 hover:scale-110">
                        {/* Coin Side/Edge for 3D effect */}
                        <div className="absolute inset-0 rounded-full bg-yellow-700 translate-y-1"></div>

                        {/* Coin Face */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 shadow-xl border-2 border-yellow-400/50 flex items-center justify-center">
                            <span className="text-[200%] md:text-[250%] text-yellow-100 drop-shadow-md pb-1">♦</span>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute top-1 left-2 right-2 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FloatingTokens;
