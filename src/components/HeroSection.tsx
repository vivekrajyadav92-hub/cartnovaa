import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./HeroSection.css"; // We'll move the vanilla CSS here

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            syncTouch: true,
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);

        // 2. Setup Canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            context.resetTransform();
            context.scale(dpr, dpr);
            render();
        };

        function drawImageProp(ctx: CanvasRenderingContext2D, img: HTMLImageElement, offsetX = 0.5, offsetY = 0.5) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            let iw = img.width,
                ih = img.height,
                r = Math.min(w / iw, h / ih),
                nw = iw * r,
                nh = ih * r,
                cx, cy, cw, ch, ar = 1;

            if (nw < w) ar = w / nw;
            if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
            nw *= ar;
            nh *= ar;

            cw = iw / (nw / w);
            ch = ih / (nh / h);
            cx = (iw - cw) * offsetX;
            cy = (ih - ch) * offsetY;

            if (cx < 0) cx = 0;
            if (cy < 0) cy = 0;
            if (cw > iw) cw = iw;
            if (ch > ih) ch = ih;

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
        }

        // 3. Define Sequences
        const sequences = [
            { folder: "s1", frameCount: 240, sectionId: "#section-1" },
            { folder: "s2", frameCount: 240, sectionId: "#section-2" },
            { folder: "s3", frameCount: 240, sectionId: "#section-3" },
        ];

        const allImages: HTMLImageElement[][] = [];
        let currentSeqIndex = 0;
        let currentFrameIndex = 0;

        const pad = (number: number, length: number) => {
            let str = "" + number;
            while (str.length < length) str = "0" + str;
            return str;
        };

        sequences.forEach((seq, seqIndex) => {
            const images: HTMLImageElement[] = [];
            for (let i = 1; i <= seq.frameCount; i++) {
                const img = new Image();
                images.push(img);

                // Immediately load the first 5 frames of the first sequence 
                // so the initial render and first tiny scrub is instant
                if (seqIndex === 0 && i <= 5) {
                    img.src = `/sequence/${seq.folder}/ezgif-frame-${pad(i, 3)}.jpg`;
                }
            }
            allImages.push(images);
        });

        // Defer loading the massive rest of the heavy sequence images 
        // to prevent network and main thread congestion on initial page load
        setTimeout(() => {
            let staggerDelay = 0;
            sequences.forEach((seq, seqIndex) => {
                for (let i = 1; i <= seq.frameCount; i++) {
                    if (seqIndex === 0 && i <= 5) continue;

                    setTimeout(() => {
                        const img = allImages[seqIndex][i - 1];
                        img.src = `/sequence/${seq.folder}/ezgif-frame-${pad(i, 3)}.jpg`;

                        // If we are currently on this frame and waiting for it, render it
                        img.onload = () => {
                            if (seqIndex === currentSeqIndex && (i - 1) === currentFrameIndex) {
                                render();
                            }
                        };
                    }, staggerDelay);
                    staggerDelay += 2; // Stagger slightly per frame
                }
            });
        }, 200);

        const render = () => {
            if (!allImages[currentSeqIndex]) return;
            const img = allImages[currentSeqIndex][currentFrameIndex];
            if (img && img.complete) {
                drawImageProp(context, img);
            } else if (img) {
                img.onload = render;
            }
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        if (allImages[0][0].complete) {
            render();
        } else {
            allImages[0][0].onload = render;
        }

        // 4. GSAP Frame Triggers
        const triggers: ScrollTrigger[] = [];

        sequences.forEach((seq, index) => {
            const obj = { frame: 0 };
            const trigger = gsap.to(obj, {
                frame: seq.frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                    trigger: seq.sectionId,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5,
                    onUpdate: () => {
                        currentSeqIndex = index;
                        currentFrameIndex = Math.round(obj.frame);
                        render();
                    },
                },
            });
            if (trigger.scrollTrigger) triggers.push(trigger.scrollTrigger);
        });

        // 5. GSAP Text Fades
        gsap.set("#text-1", { opacity: 1 });

        sequences.forEach((seq, index) => {
            const trigger = ScrollTrigger.create({
                trigger: seq.sectionId,
                start: "top 60%",
                end: "bottom 60%",
                onEnter: () => {
                    gsap.to(`#text-${index + 1}`, { opacity: 1, duration: 1, ease: "power2.out" });
                    gsap.fromTo(`#text-${index + 1} h2`, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" });
                    gsap.fromTo(`#text-${index + 1} p`, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: "power3.out" });
                },
                onLeave: () => gsap.to(`#text-${index + 1}`, { opacity: 0, duration: 1, ease: "power2.out" }),
                onEnterBack: () => {
                    gsap.to(`#text-${index + 1}`, { opacity: 1, duration: 1, ease: "power2.out" });
                    gsap.to(`#text-${index + 1} h2, #text-${index + 1} p`, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
                },
                onLeaveBack: () => {
                    if (index !== 0) gsap.to(`#text-${index + 1}`, { opacity: 0, duration: 1, ease: "power2.out" });
                },
            });
            triggers.push(trigger);
        });

        // 6. Scroll Indicator Fade
        const indicatorTrigger = ScrollTrigger.create({
            trigger: "#section-1",
            start: "top top",
            end: "bottom center",
            onLeave: () => gsap.to("#scroll-indicator", { opacity: 0, pointerEvents: "none", duration: 0.5 }),
            onEnterBack: () => gsap.to("#scroll-indicator", { opacity: 1, pointerEvents: "auto", duration: 0.5 }),
        });
        triggers.push(indicatorTrigger);

        // Cleanup
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            lenis.destroy();
            triggers.forEach(t => t.kill());
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className="hero-container">
            <div className="canvas-container relative h-[auto]">
                <canvas ref={canvasRef} id="hero-canvas"></canvas>
            </div>

            <div className="fixed-text-container">
                <div className="text-container fixed-text" id="text-1">
                    <h2>Hello! I am Pratyush Kumar</h2>
                    <p>Web Developer &amp; Digital Growth Consultant — Founder OF Cartnova.</p>
                </div>
                <div className="text-container fixed-text" id="text-2">
                    <h2>The Evolution</h2>
                    <p>Seamlessly transitioning into the next phase of innovation and sophisticated digital design.</p>
                </div>
                <div className="text-container fixed-text" id="text-3">
                    <h2>The Future</h2>
                    <p>Step into tomorrow with unmatched visual fidelity. The experience continues from here.</p>
                </div>
            </div>

            <main className="scroll-content">
                <section className="sequence-section" id="section-1"></section>
                <section className="sequence-section" id="section-2"></section>
                <section className="sequence-section" id="section-3"></section>
            </main>

            <div className="scroll-indicator" id="scroll-indicator">
                <span className="scroll-text">scroll down for detail</span>
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
            </div>
        </div>
    );
}
