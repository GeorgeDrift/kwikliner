import React, { useState, useEffect } from 'react';

const VehicleSlider: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {images.map((img, idx) => (
                <img
                    key={idx}
                    src={img}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 scale-110 translate-x-0' : 'opacity-0 scale-100'}`}
                    style={{
                        transition: 'opacity 1s ease-in-out, transform 5s linear'
                    }}
                    alt="vehicle"
                />
            ))}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default VehicleSlider;
