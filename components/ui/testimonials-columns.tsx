
import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Skillfinite's PMP course was a game-changer. The curriculum was perfectly structured, and the mock exams helped me clear the certification on my first attempt.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sarah Jenkins",
    role: "Project Manager",
  },
  {
    text: "The Agile Master's program is top-notch. The instructors are industry veterans who bring real-world examples to the classroom.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Michael Chen",
    role: "Scrum Master",
  },
  {
    text: "I transitioned from support to Data Science thanks to Skillfinite. The hands-on labs were exactly what I needed to build confidence.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Emily Rodriguez",
    role: "Data Analyst",
  },
  {
    text: "The Full Stack Bootcamp is intense but worth every penny. I landed a developer role at a tech unicorn within a month of graduating.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "David Park",
    role: "Software Engineer",
  },
  {
    text: "Great content for cloud certifications. Passed AWS Solutions Architect Associate with flying colors. Highly recommended!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Jessica Wong",
    role: "Cloud Engineer",
  },
  {
    text: "The corporate training they organized for our team was seamless. It standardized our Agile practices across departments.",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Robert Wilson",
    role: "Director of Engineering",
  },
  {
    text: "Flexible learning options allowed me to study while working full-time. The recorded sessions are a lifesaver.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Amanda Thomas",
    role: "Product Owner",
  },
  {
    text: "Best investment in my career. The CSPO certification opened doors I didn't know existed. Thank you Skillfinite!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "James Carter",
    role: "Product Manager",
  },
  {
    text: "The Python course for beginners is excellent. It assumes no prior Skill and builds up your skills logically.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Linda Martinez",
    role: "Business Analyst",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const TestimonialsColumn = ({
  className,
  testimonials,
  duration = 10,
}) => {
  return (
    <div className={className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-10 rounded-3xl border border-gray-100 shadow-lg shadow-orange-500/5 bg-white max-w-xs w-full"
                key={i}
              >
                <div className="text-gray-600 leading-relaxed">{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-bold tracking-tight leading-5 text-gray-900">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight text-sm text-gray-500">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="bg-white py-20 relative overflow-hidden">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-12"
        >
          <div className="flex justify-center">
            <div className="border border-orange-200 bg-orange-50 text-orange-700 py-1 px-4 rounded-full text-sm font-medium mb-4">
              Testimonials
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-gray-900">
            What our learners say
          </h2>
          <p className="text-center mt-4 text-gray-500 text-lg">
            Hear from professionals who have transformed their careers with us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
