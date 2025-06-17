import { useEffect, useState } from "react";

export const useDimensions = (ref:React.RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      const handleResize = () => {
        setDimensions({
          width: ref.current?.offsetWidth || 0,
          height: ref.current?.offsetHeight || 0
        });
      };

      handleResize();

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [ref]);

  return dimensions;
};
