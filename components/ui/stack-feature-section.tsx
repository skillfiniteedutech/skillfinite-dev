"use client";

import {
    FaReact, FaAws, FaDocker, FaNodeJs, FaGithub,
    FaTwitter, FaLinkedin, FaInstagram, FaGoogle, FaApple
} from "react-icons/fa";
import {
    SiNextdotjs, SiVercel, SiRedux, SiTypescript, SiFacebook
} from "react-icons/si";

const fallbackUrls = [
    "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    "https://upload.wikimedia.org/wikipedia/commons/9/96/Among_Us_icon.png"
];

const iconConfigs = [
    { Icon: FaReact, color: "#61DAFB" },
    { Icon: FaAws, color: "#FF9900" },
    { Icon: FaDocker, color: "#2496ED" },
    { Icon: FaNodeJs, color: "#339933" },
    { Icon: SiNextdotjs, color: "#000000" },
    { Icon: SiVercel, color: "#000000" },
    { Icon: SiRedux, color: "#764ABC" },
    { Icon: SiTypescript, color: "#3178C6" },
    { Icon: FaGithub, color: "#181717" },
    { Icon: FaTwitter, color: "#1DA1F2" },
    { Icon: FaLinkedin, color: "#0077B5" },
    { Icon: FaInstagram, color: "#E1306C" },
    { Icon: FaGoogle, color: "#DB4437" },
    { Icon: FaApple, color: "#000000" },
    { Icon: SiFacebook, color: "#1877F2" },
    { Icon: null, img: fallbackUrls[0] },
    { Icon: null, img: fallbackUrls[1] },
];

export default function StackFeatureSection() {
    const orbitCount = 3;
    const orbitGap = 8; // rem between orbits
    const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

    return (
        <div className="relative w-full h-[30rem] flex items-center justify-center overflow-hidden rounded-3xl bg-white/5 dark:bg-black/5">
            <div className="relative w-[50rem] h-[50rem] flex items-center justify-center">
                {/* Center Circle */}
                <div className="w-24 h-24 rounded-full bg-orange-50 dark:bg-orange-900/20 shadow-lg flex items-center justify-center z-10">
                    <FaReact className="w-12 h-12 text-orange-500" />
                </div>

                {/* Generate Orbits */}
                {[...Array(orbitCount)].map((_, orbitIdx) => {
                    const size = `${12 + orbitGap * (orbitIdx + 1)}rem`; // equal spacing
                    const angleStep = (2 * Math.PI) / iconsPerOrbit;

                    return (
                        <div
                            key={orbitIdx}
                            className="absolute rounded-full border-2 border-dotted border-orange-200 dark:border-orange-800/30"
                            style={{
                                width: size,
                                height: size,
                                animation: `spin ${20 + orbitIdx * 10}s linear infinite`,
                            }}
                        >
                            {iconConfigs
                                .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                                .map((cfg, iconIdx) => {
                                    const angle = iconIdx * angleStep;
                                    const x = 50 + 50 * Math.cos(angle);
                                    const y = 50 + 50 * Math.sin(angle);

                                    return (
                                        <div
                                            key={iconIdx}
                                            className="absolute bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                                            style={{
                                                left: `${x}%`,
                                                top: `${y}%`,
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        >
                                            {cfg.Icon ? (
                                                <cfg.Icon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: cfg.color }} />
                                            ) : (
                                                <img
                                                    src={cfg.img}
                                                    alt="icon"
                                                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    );
                })}
            </div>

            {/* Animation keyframes */}
            <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
}
