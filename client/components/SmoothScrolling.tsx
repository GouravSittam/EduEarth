"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrolling({ children }: { children: ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const shouldAnimateRef = useRef(true);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            lerp: 0.08,
            smoothTouch: true,
            infinite: false,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            if (!shouldAnimateRef.current) {
                return;
            }
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        }

        const updateAnimationState = () => {
            const shouldAnimate = document.visibilityState === "visible";
            shouldAnimateRef.current = shouldAnimate;
            if (shouldAnimate && rafIdRef.current === null) {
                rafIdRef.current = requestAnimationFrame(raf);
            }
            if (!shouldAnimate && rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };

        updateAnimationState();
        document.addEventListener("visibilitychange", updateAnimationState);

        return () => {
            document.removeEventListener("visibilitychange", updateAnimationState);
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return <>{children}</>;
}
