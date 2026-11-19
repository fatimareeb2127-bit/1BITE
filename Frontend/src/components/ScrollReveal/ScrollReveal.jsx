import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ children, className = "" }) => {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: "0px 0px -35px 0px" });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className={`scrollReveal ${visible ? "isVisible" : ""} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
