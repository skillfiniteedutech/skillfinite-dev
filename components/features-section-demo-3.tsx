import React from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";


export default function FeaturesSectionDemo() {
  const features = [
    {
      title: "Interactive Learning Dashboard",
      description:
        "Track your progress, manage assignments, and monitor your learning journey with our intuitive student dashboard.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Diverse Course Library",
      description:
        "Access thousands of courses across multiple disciplines, from programming to business and creative arts.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Video-Based Learning",
      description:
        "Learn from expert instructors through high-quality video lectures, tutorials, and hands-on demonstrations.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r  dark:border-neutral-800",
    },
    {
      title: "Global Learning Community",
      description:
        "Join millions of learners worldwide. Connect, collaborate, and grow with students from over 190 countries.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-black color-white">
         <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">  Everything You Need to </span> <span className="text-white">Succeed</span>
        </h4>

        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-600 dark:text-neutral-400 text-center font-normal">
          From interactive dashboards to video lectures and global community access,
          our platform provides all the tools you need for effective online learning.
        </p>
      </div>

      <div className="relative ">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-6 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug font-semibold mb-2">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="text-sm md:text-base max-w-sm text-left text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed mb-4">
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex items-center justify-center py-8 px-2 h-full">
      <div className="w-full max-w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl rounded-lg group h-full">
        <div className="flex flex-1 w-full h-full flex-col">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3000&auto=format&fit=crop"
            alt="learning dashboard analytics"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <div className="relative flex items-center justify-center h-full group/image cursor-pointer">
      <div className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col relative">
          <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto transition-transform group-hover/image:scale-110" />
          <img
            src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=3000&auto=format&fit=crop"
            alt="video learning"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTwo = () => {
  // Education-themed images: books, learning, studying
  const images = [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=3000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=3000&auto=format&fit=crop",
  ];

  // Use stable rotation values instead of Math.random()
  const rotations = [5, -3, 8, -6, 4, -7, 2, -4, 6, -2];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-center justify-center p-8 gap-10 h-full overflow-hidden">
      {/* TODO */}
      <div className="flex flex-row -ml-20">
        {images.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: rotations[idx],
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="course materials"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: rotations[idx + 5],
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="course materials"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60 flex flex-col items-center justify-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // Major education hubs around the world
        { location: [37.7595, -122.4367], size: 0.05 }, // San Francisco
        { location: [40.7128, -74.006], size: 0.08 }, // New York
        { location: [51.5074, -0.1278], size: 0.06 }, // London
        { location: [28.6139, 77.209], size: 0.07 }, // New Delhi
        { location: [35.6762, 139.6503], size: 0.06 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
        { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
        { location: [52.52, 13.405], size: 0.05 }, // Berlin
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
