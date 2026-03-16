import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
    {
        id: 1,
        role: "Lead Web Development Intern",
        company: "Vidyavyukta",
        period: "2024",
        description: "Led development of multiple websites and collaborated with designers and developers to deliver production-ready web applications.",
    },
    {
        id: 2,
        role: "Freelance Web Developer",
        company: "Self-Employed",
        period: "2023 - Present",
        description: "Designed and developed custom websites for local businesses and startups. Delivered responsive, SEO-optimized web solutions using React, Next.js, and modern UI/UX principles.",
    },
    {
        id: 3,
        role: "Ecommerce Developer",
        company: "Cartnova",
        period: "2023 - Present",
        description: "Built and managed Shopify and WordPress ecommerce stores for clients. Handled store setup, theme customization, product listing optimization, and digital marketing integration.",
    },
    {
        id: 4,
        role: "UI/UX Designer & Frontend Developer",
        company: "Freelance Projects",
        period: "2022 - 2023",
        description: "Crafted user interfaces and prototypes in Figma, then implemented them as fully responsive, pixel-perfect frontends using HTML, CSS, and JavaScript for various client projects.",
    }
];

export default function Experiences() {
    const sectionRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".exp-header",
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                }
            );

            if (listRef.current) {
                const items = listRef.current.children;
                gsap.fromTo(items,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: listRef.current,
                            start: "top 75%",
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-24 bg-black text-white w-full relative z-30 border-t border-gray-900">
            <div className="flex flex-col lg:flex-row gap-16 md:gap-24">

                <div className="w-full lg:w-1/3 exp-header">
                    <p className="text-gray-400 uppercase tracking-widest text-sm mb-4 font-semibold">Career</p>
                    <h2 className="text-5xl md:text-7xl font-bold font-serif italic mb-8">Work<br />Experience</h2>
                    <p className="text-gray-400 leading-relaxed text-lg max-w-sm">
                        A timeline of my professional journey, building tools and experiences for millions of users worldwide.
                    </p>
                </div>

                <div ref={listRef} className="w-full lg:w-2/3 flex flex-col pt-8">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.id}
                            className={`flex flex-col md:flex-row gap-4 md:gap-12 py-10 interactable group cursor-pointer ${index !== experiences.length - 1 ? 'border-b border-gray-800' : ''}`}
                        >
                            <div className="md:w-1/4 pt-1">
                                <span className="text-gray-500 font-serif italic text-lg">{exp.period}</span>
                            </div>
                            <div className="md:w-3/4">
                                <h3 className="text-3xl font-bold mb-2 group-hover:text-gray-300 transition-colors">{exp.role}</h3>
                                <h4 className="text-xl text-gray-400 mb-6 group-hover:text-white transition-colors">{exp.company}</h4>
                                <p className="text-gray-500 leading-relaxed max-w-2xl group-hover:text-gray-400 transition-colors">
                                    {exp.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
