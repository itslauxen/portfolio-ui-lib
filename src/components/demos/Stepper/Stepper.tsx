"use client";

// Assistente de passos (wizard) com transicoes deslizantes animadas via
// motion, indicadores clicaveis e conteudo padrao de demonstracao em PT-BR.

import { AnimatePresence, motion, type Variants } from "motion/react";
import React, {
  Children,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./Stepper.module.css";

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
  disableStepIndicators?: boolean;
  /** Cor de destaque dos indicadores e do botao principal. */
  accentColor?: string;
}

interface StepProps {
  children: ReactNode;
}

/** Um passo do assistente (qualquer conteudo). */
export function Step({ children }: StepProps) {
  return <div className={styles.stepDefault}>{children}</div>;
}

// Conteudo padrao da demo quando nenhum filho e informado.
function conteudoPadrao(): ReactNode[] {
  const passos = [
    ["Bem-vindo", "Este e um assistente de passos animado. Use os botoes ou clique nos indicadores para navegar."],
    ["Personalize", "Cada transicao desliza na direcao certa e a altura do conteudo se ajusta sozinha."],
    ["Quase la", "Os indicadores mostram o progresso: concluido, ativo e pendente."],
    ["Tudo pronto", "Clique em concluir para fechar o assistente."],
  ];
  return passos.map(([titulo, texto]) => (
    <Step key={titulo}>
      <h3 className={styles.demoTitle}>{titulo}</h3>
      <p className={styles.demoText}>{texto}</p>
    </Step>
  ));
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = "Voltar",
  nextButtonText = "Continuar",
  completeButtonText = "Concluir",
  disableStepIndicators = false,
  accentColor = "#c6ff3a",
  className = "",
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children ?? conteudoPadrao());
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) {
      onFinalStepCompleted();
    } else {
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className={`${styles.outerContainer} ${className}`}
      style={{ "--stepper-accent": accentColor } as React.CSSProperties}
      {...rest}
    >
      <div className={styles.stepCircleContainer}>
        <div className={styles.stepIndicatorRow}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                  step={stepNumber}
                  disableStepIndicators={disableStepIndicators}
                  currentStep={currentStep}
                  accentColor={accentColor}
                  onClickStep={(clicked) => {
                    setDirection(clicked > currentStep ? 1 : -1);
                    updateStep(clicked);
                  }}
                />
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} accentColor={accentColor} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={styles.stepContentDefault}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={styles.footerContainer}>
            <div className={`${styles.footerNav} ${currentStep !== 1 ? styles.spread : styles.end}`}>
              {currentStep !== 1 && (
                <button type="button" onClick={handleBack} className={styles.backButton}>
                  {backButtonText}
                </button>
              )}
              <button
                type="button"
                onClick={isLastStep ? handleComplete : handleNext}
                className={styles.nextButton}
              >
                {isLastStep ? completeButtonText : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState<number>(0);

  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators?: boolean;
  accentColor: string;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
  accentColor,
}: StepIndicatorProps) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className={styles.stepIndicator}
      style={disableStepIndicators ? { pointerEvents: "none", opacity: 0.5 } : {}}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: "#222222", color: "#a3a3a3" },
          active: { scale: 1, backgroundColor: accentColor, color: accentColor },
          complete: { scale: 1, backgroundColor: accentColor, color: accentColor },
        }}
        transition={{ duration: 0.3 }}
        className={styles.stepIndicatorInner}
      >
        {status === "complete" ? (
          <CheckIcon className={styles.checkIcon} />
        ) : status === "active" ? (
          <div className={styles.activeDot} />
        ) : (
          <span className={styles.stepNumber}>{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
  accentColor: string;
}

function StepConnector({ isComplete, accentColor }: StepConnectorProps) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: accentColor },
  };

  return (
    <div className={styles.stepConnector}>
      <motion.div
        className={styles.stepConnectorInner}
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
