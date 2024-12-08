import { useEffect, useRef } from 'react';

interface UsePullToSearchProps {
  onSearchShow: () => void;
  showSearch: boolean;
  setPullDistance: (distance: number) => void;
}

export const usePullToSearch = ({ onSearchShow, showSearch, setPullDistance }: UsePullToSearchProps) => {
  const pullStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (scrollRef.current?.scrollTop === 0 && !showSearch) {
      const pullMoveY = e.touches[0].clientY;
      const distance = Math.max(0, pullMoveY - pullStartY.current);
      setPullDistance(Math.min(distance, 100));
      
      if (distance > 60) {
        onSearchShow();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!showSearch) {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchmove', handleTouchMove);
      element.addEventListener('touchend', handleTouchEnd);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [showSearch, onSearchShow, setPullDistance]);

  return { scrollRef };
};