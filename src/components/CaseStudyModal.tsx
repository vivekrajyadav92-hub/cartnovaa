import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CaseStudyModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        title: string;
        category: string;
        image: string;
        year: string;
        content: {
            overview: string;
            challenges: string[];
            solutions: string[];
            results: string;
        };
    } | null;
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose, project }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && project) {
            document.body.style.overflow = 'hidden';
            
            const tl = gsap.timeline();
            
            tl.to(overlayRef.current, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            })
            .fromTo(modalRef.current, 
                { x: '100%' },
                { x: '0%', duration: 0.8, ease: "expo.out" },
                "-=0.2"
            )
            .fromTo(contentRef.current?.children || [], 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
                "-=0.4"
            );
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, project]);

    const handleClose = () => {
        const tl = gsap.timeline({
            onComplete: onClose
        });

        tl.to(modalRef.current, {
            x: '100%',
            duration: 0.6,
            ease: "expo.in"
        })
        .to(overlayRef.current, {
            opacity: 0,
            duration: 0.3
        }, "-=0.4");
    };

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
            {/* Overlay */}
            <div 
                ref={overlayRef}
                onClick={handleClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0"
            />

            {/* Modal Panel */}
            <div 
                ref={modalRef}
                className="relative w-full md:w-[60%] lg:w-[45%] h-full bg-[#0a0a0a] border-l border-white/10 overflow-y-auto"
            >
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
                     style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
                />

                <div className="relative z-10 p-8 md:p-12 lg:p-16">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 font-serif italic">{project.year}</span>
                            <div className="w-12 h-[1px] bg-white/20" />
                            <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">{project.category}</span>
                        </div>
                        <button 
                            onClick={handleClose}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>

                    <div ref={contentRef}>
                        <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter leading-none">
                            {project.title}
                        </h2>

                        {/* Project Hero Image */}
                        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-white/5">
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover grayscale opacity-80"
                            />
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-16">
                            <section>
                                <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-6">Overview</h4>
                                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                                    {project.content.overview}
                                </p>
                            </section>

                            <div className="grid md:grid-cols-2 gap-12">
                                <section>
                                    <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-6">The Challenge</h4>
                                    <ul className="space-y-4">
                                        {project.content.challenges.map((challenge, i) => (
                                            <li key={i} className="flex gap-3 text-gray-400 text-lg">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                {challenge}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h4 className="text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-6">Solution</h4>
                                    <ul className="space-y-4">
                                        {project.content.solutions.map((solution, i) => (
                                            <li key={i} className="flex gap-3 text-gray-400 text-lg">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                                {solution}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            <section className="bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10">
                                <h4 className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-gray-500 font-bold mb-6">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    The Result
                                </h4>
                                <p className="text-2xl md:text-3xl font-medium text-white italic tracking-tight leading-tight">
                                    "{project.content.results}"
                                </p>
                            </section>

                            <button className="w-full py-6 rounded-2xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-3">
                                Visit Live Website
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyModal;
