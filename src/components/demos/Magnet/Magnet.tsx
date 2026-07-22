"use client";

// Envolve o conteudo em um campo magnetico: o elemento e atraido pelo
// cursor quando ele se aproxima. O rastreamento do mouse fica confinado
// ao proprio wrapper (a area de atracao vira padding interno), sem
// listeners globais em window ou document.

import React, { useState, useRef, ReactNode, HTMLAttributes } from "react";
import styles from "./Magnet.module.css";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 90,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !innerRef.current) return;

    const { left, top, width, height } = innerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    // Dentro da zona de atracao: desloca o conteudo em direcao ao cursor
    if (distX < width / 2 + padding && distY < height / 2 + padding) {
      setIsActive(true);
      const offsetX = (e.clientX - centerX) / magnetStrength;
      const offsetY = (e.clientY - centerY) / magnetStrength;
      setPosition({ x: offsetX, y: offsetY });
    } else {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setIsActive(false);
    setPosition({ x: 0, y: 0 });
  };

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  const conteudoPadrao = <span className={styles.demoPill}>Chega mais perto</span>;

  return (
    <div
      className={`${styles.wrapper} ${wrapperClassName}`}
      style={{ padding: `${padding}px` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={innerRef}
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform",
        }}
      >
        {children ?? conteudoPadrao}
      </div>
    </div>
  );
};

export default Magnet;
