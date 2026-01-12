"use client";
import React, { useEffect, useState } from "react";

interface AnimatedBarProps {
  percentage: number; // 0-100
  color: string;
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ percentage, color }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-gray-200 h-4 rounded overflow-hidden">
      <div
        className="h-4 rounded transition-all duration-700"
        style={{ width: `${width}%`, backgroundColor: color }}
      ></div>
    </div>
  );
};

export default AnimatedBar;
