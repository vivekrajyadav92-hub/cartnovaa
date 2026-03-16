import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import CaseStudyModal from './CaseStudyModal';

gsap.registerPlugin(ScrollTrigger);

const projects = [
    {
        id: 1,
        title: "Ethereal Echoes",
        category: "Creative Direction - Web Design",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        year: "2024",
        content: {
            overview: "A high-end digital experience for a luxury fragrance brand, focusing on sensory storytelling through interactive 3D elements and immersive soundscapes.",
            challenges: [
                "Translating the abstract concept of scent into a visual medium.",
                "Maintaining high performance with complex 3D assets on mobile devices."
            ],
            solutions: [
                "Developed a custom WebGL engine for fluid, organic particle systems that mimic scent clouds.",
                "Implemented sound-reactive environments that shift based on user cursor movement."
            ],
            results: "The landing page saw a 45% increase in average session duration and won 'Site of the Month' on Awwwards."
        }
    },
    {
        id: 2,
        title: "Neon Nexus",
        category: "UI/UX - 3D Development",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        year: "2023",
        content: {
            overview: "A futuristic management dashboard for decentralized energy grids, blending complex real-time data visualization with a cyberpunk-inspired aesthetic.",
            challenges: [
                "Managing massive real-time data flow without overwhelming the user interface.",
                "Ensuring accessibility within a high-contrast, neon-heavy design system."
            ],
            solutions: [
                "Built a custom data-viz library using D3.js integrated with Three.js for 3D grid monitoring.",
                "Implemented a 'Zen Mode' for focused monitoring during high-traffic grid events."
            ],
            results: "Successfully deployed across 12 smart cities, handling over 2M energy transactions daily with zero downtime."
        }
    },
    {
        id: 3,
        title: "Aura Architecture",
        category: "Brand Identity - Frontend",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=2655&auto=format&fit=crop",
        year: "2023",
        content: {
            overview: "A brand identity and web platform for a sustainable architecture firm, emphasizing the harmony between modern structures and natural environments.",
            challenges: [
                "Communicating the 'invisible' sustainability features of physical buildings online.",
                "Creating a layout that feels both strictly structured and organically flowing."
            ],
            solutions: [
                "Used a grid-based layout that breaks into organic flow sections using custom GSAP masks.",
                "Developed interactive 'Solar Heatmaps' to visualize architectural energy efficiency."
            ],
            results: "Helped the firm secure $50M in new contracts within the first 6 months of the platform's launch."
        }
    }
];

export default function FeaturedProjects() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const projectsRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openCaseStudy = (project: typeof projects[0]) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Header
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Animate Project Cards
            if (projectsRef.current) {
                const cards = projectsRef.current.children;
                gsap.fromTo(cards,
                    { opacity: 0, y: 100 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: projectsRef.current,
                            start: "top 85%",
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-24 bg-black text-white w-full relative z-30">
            <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24">
                <div>
                    <p className="text-gray-400 uppercase tracking-widest text-sm mb-4 font-semibold">Selected Work</p>
                    <h2 className="text-5xl md:text-7xl font-bold italic font-serif tracking-tight">Featured<br />Projects</h2>
                </div>
                <button className="interactable mt-8 md:mt-0 group flex items-center gap-3 text-lg border-b border-white pb-1 hover:text-gray-300 transition-colors">
                    View All Work
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>

            <div ref={projectsRef} className="flex flex-col gap-16 md:gap-32">
                {projects.map((project, index) => (
                    <div 
                        key={project.id} 
                        onClick={() => openCaseStudy(project)}
                        className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-col-reverse lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center group interactable cursor-pointer`}
                    >
                        <div className="w-full lg:w-3/5 overflow-hidden rounded-xl bg-gray-900 border border-white/5">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-[400px] md:h-[600px] object-cover transition-all duration-1000 group-hover:scale-110 filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                            />
                        </div>
                        <div className="w-full lg:w-2/5 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-6 overflow-hidden">
                                <span className="text-gray-300 tracking-[0.2em] uppercase text-[10px] font-bold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">{project.category}</span>
                                <span className="text-gray-400 font-serif italic transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">{project.year}</span>
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold mb-6 group-hover:text-gray-300 transition-colors tracking-tighter">{project.title}</h3>
                            <div className="flex items-center gap-4">
                                <button className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all group-hover:border-white">
                                    <ArrowUpRight className="w-6 h-6" />
                                </button>
                                <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-semibold">View Case Study</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CaseStudyModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                project={selectedProject} 
            />
        </section>
    );
}
