'use client';

import React, { useState, useEffect } from 'react';
import LogoLoop, { LogoItem } from '@/components/logoloop';

export interface LogoGridProps {
    columns?: number;
    logos: LogoItem[];
    speed?: number;
    logoHeight?: number;
    gap?: number;
    columnGap?: number;
    hoverSpeed?: number;
    fadeOut?: boolean;
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    className?: string;
}

const LogoGrid: React.FC<LogoGridProps> = ({
    columns = 3,
    logos,
    speed = 40,
    logoHeight = 64,
    gap = 32,
    columnGap = 24,
    hoverSpeed = 20,
    fadeOut = true,
    fadeOutColor = '#0000',
    scaleOnHover = true,
    className = '',
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Split logos into columns
    const logosPerColumn = Math.ceil(logos.length / columns);
    const columnLogos = Array.from({ length: columns }, (_, i) =>
        logos.slice(i * logosPerColumn, (i + 1) * logosPerColumn)
    );

    if (!isMounted) {
        // Render a static preview for SSR
        return (
            <div className={`flex items-start justify-center h-full ${className}`} style={{ gap: `${columnGap}px` }}>
                {columnLogos.map((columnItems, index) => (
                    <div key={index} className="flex-1 max-w-[200px] h-full flex flex-col gap-8 ">
                        {columnItems.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-center justify-center" style={{ height: `${logoHeight}px` }}>
                                {'node' in item ? item.node : null}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`flex items-start justify-center h-full ${className}`} style={{ gap: `${columnGap}px` }}>
            {columnLogos.map((columnItems, index) => (
                <div key={index} className="flex-1 max-w-[150px] h-full">
                    <LogoLoop
                        logos={columnItems}
                        speed={speed}
                        // Alternate direction: even columns go down, odd columns go up
                        direction={index % 2 === 0 ? 'down' : 'up'}
                        logoHeight={logoHeight}
                        gap={gap}
                        hoverSpeed={hoverSpeed}
                        fadeOut={fadeOut}
                        fadeOutColor={fadeOutColor}
                        scaleOnHover={scaleOnHover}
                        width="100%"
                    />
                </div>
            ))}
        </div>
    );
};

export default LogoGrid;
