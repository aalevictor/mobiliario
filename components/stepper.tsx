/** @format */

import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, {
	Children,
	HTMLAttributes,
	ReactNode,
	useRef,
	useState,
} from 'react';
import { Button } from './ui/button';

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	final?: ReactNode;
	submitButton?: ReactNode;
	initialStep?: number;
	onStepChange?: (step: number) => void;
	onFinalStepCompleted?: () => void;
	stepCircleContainerClassName?: string;
	stepContainerClassName?: string;
	contentClassName?: string;
	footerClassName?: string;
	backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	backButtonText?: string;
	nextButtonText?: string;
	completeButtonText?: string;
	disableStepIndicators?: boolean;
	disableNextButton?: boolean;
	renderStepIndicator?: (props: {
		step: number;
		currentStep: number;
		onStepClick: (clicked: number) => void;
	}) => ReactNode;
}

export default function Stepper({
	children,
	final,
	submitButton,
	initialStep = 1,
	onStepChange = () => {},
	onFinalStepCompleted = () => {},
	stepCircleContainerClassName = '',
	stepContainerClassName = '',
	contentClassName = '',
	footerClassName = '',
	backButtonProps = {},
	nextButtonProps = {},
	backButtonText = 'Back',
	nextButtonText = 'Continue',
	completeButtonText = 'Complete',
	disableStepIndicators = false,
	disableNextButton = false,
	renderStepIndicator,
	...rest
}: StepperProps) {
	const [currentStep, setCurrentStep] = useState<number>(initialStep);
	const [direction, setDirection] = useState<number>(0);
	const stepsArray = Children.toArray(children);
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
			className='flex flex-1 flex-col items-center justify-center p-4 gap-4'
			{...rest}>
			<div
				className={`${stepContainerClassName} flex w-full items-center p-4 bg-white rounded-[300px] shadow`}>
				{stepsArray.map((_, index) => {
					const stepNumber = index + 1;
					const isNotLastStep = index < totalSteps - 1;
					return (
						<React.Fragment key={stepNumber}>
							{renderStepIndicator ? (
								renderStepIndicator({
									step: stepNumber,
									currentStep,
									onStepClick: (clicked) => {
										setDirection(clicked > currentStep ? 1 : -1);
										updateStep(clicked);
									},
								})
							) : (
								<StepIndicator
									step={stepNumber}
									disableStepIndicators={disableStepIndicators}
									disableNextButton={disableNextButton}
									currentStep={currentStep}
									onClickStep={(clicked) => {
										setDirection(clicked > currentStep ? 1 : -1);
										updateStep(clicked);
									}}
								/>
							)}
							{isNotLastStep && (
								<StepConnector isComplete={currentStep > stepNumber} />
							)}
						</React.Fragment>
					);
				})}
			</div>
			<div
				className={`mx-auto w-full rounded-2xl shadow ${stepCircleContainerClassName}`}>
				<StepContentWrapper
					isCompleted={false}
					currentStep={currentStep}
					direction={direction}
					className={`space-y-2 h-full ${contentClassName}`}>
					{!isCompleted && stepsArray[currentStep - 1]}
					{isCompleted && final}
				</StepContentWrapper>

				{!isCompleted ? (
					<div className={`px-6 pb-8 ${footerClassName}`}>
						<div
							className={`flex ${
								currentStep !== 1 ? 'justify-between' : 'justify-end'
							}`}>
							{currentStep !== 1 && (
								<Button
									type='button'
									onClick={handleBack}
									variant='ghost'
									className={`duration-350 rounded px-2 py-1 transition ${
										currentStep === 1
											? 'pointer-events-none opacity-50 text-neutral-400'
											: 'text-neutral-400 hover:text-neutral-700'
									}`}
									{...backButtonProps}>
									{backButtonText}
								</Button>
							)}
							<Button
								type='button'
								onClick={isLastStep ? handleComplete : handleNext}
								disabled={disableNextButton}
								className='duration-350 tracking-tight transition'
								{...nextButtonProps}>
								{isLastStep ? completeButtonText : nextButtonText}
							</Button>
						</div>
					</div>
				) : (
					<div className={`px-8 pb-8 ${footerClassName}`}>
						<div
							className={`mt-10 flex ${
								currentStep !== 1 ? 'justify-between' : 'justify-end'
							}`}>
							{currentStep !== 1 && (
								<Button
									type='button'
									onClick={handleBack}
									variant='ghost'
									className={`duration-350 rounded px-2 py-1 transition ${
										currentStep === 1
											? 'pointer-events-none opacity-50 text-neutral-400'
											: 'text-neutral-400 hover:text-neutral-700'
									}`}
									{...backButtonProps}>
									Cancelar
								</Button>
							)}
							{submitButton}
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
	className = '',
}: StepContentWrapperProps) {
	// const [parentHeight, setParentHeight] = useState<number>(0);

	return (
		<motion.div
			transition={{ type: 'spring', duration: 0.4 }}
			className={`${className} relative`}>
			<AnimatePresence
				initial={false}
				mode='sync'
				custom={direction}>
				{!isCompleted && (
					<SlideTransition
						key={currentStep}
						direction={direction}
						// onHeightReady={(h) => setParentHeight(h)}
					>
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
	// onHeightReady: (height: number) => void;
}

function SlideTransition({
	children,
	direction,
}: // onHeightReady,
SlideTransitionProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<motion.div
			ref={containerRef}
			custom={direction}
			variants={stepVariants}
			initial='exit'
			animate='center'
			exit='enter'
			transition={{ duration: 0 }}
			style={{ left: 0, right: 0, top: 0 }}>
			{children}
		</motion.div>
	);
}

const stepVariants: Variants = {
	enter: (dir: number) => ({
		x: dir >= 0 ? '-100%' : '100%',
		opacity: 0,
	}),
	center: {
		x: '0%',
		opacity: 1,
	},
	exit: (dir: number) => ({
		x: dir >= 0 ? '50%' : '-50%',
		opacity: 0,
	}),
};

interface StepProps {
	children: ReactNode;
}

export function Step({ children }: StepProps) {
	return <div className=''>{children}</div>;
}

interface StepIndicatorProps {
	step: number;
	currentStep: number;
	onClickStep: (clicked: number) => void;
	disableStepIndicators?: boolean;
	disableNextButton?: boolean;
}

function StepIndicator({
	step,
	currentStep,
	onClickStep,
	disableStepIndicators = false,
	disableNextButton = false,
}: StepIndicatorProps) {
	const status =
		currentStep === step
			? 'active'
			: currentStep < step
			? 'inactive'
			: 'complete';

	const handleClick = () => {
		if (step !== currentStep && !disableStepIndicators) {
			if (step > currentStep && disableNextButton) return;
			onClickStep(step);
		}
	};

	return (
		<motion.div
			onClick={handleClick}
			className='relative cursor-pointer outline-none focus:outline-none'
			animate={status}
			initial={false}>
			<motion.div
				variants={{
					inactive: {
						scale: 1,
						backgroundColor: 'var(--muted)',
						color: 'var(--muted-foreground)',
					},
					active: {
						scale: 1,
						backgroundColor: 'var(--primary)',
						color: 'var(--primary)',
					},
					complete: {
						scale: 1,
						backgroundColor: 'var(--primary)',
						color: 'var(--primary)',
					},
				}}
				transition={{ duration: 0.3 }}
				className='flex h-8 w-8 items-center justify-center rounded-full font-semibold'>
				{status === 'complete' ? (
					<CheckIcon className='h-5 w-5 text-white' />
				) : status === 'active' ? (
					<div className='h-3 w-3 rounded-full bg-white' />
				) : (
					<span className='text-sm'>{step}</span>
				)}
			</motion.div>
		</motion.div>
	);
}

interface StepConnectorProps {
	isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
	const lineVariants: Variants = {
		incomplete: { width: 0, backgroundColor: 'transparent' },
		complete: { width: '100%', backgroundColor: 'var(--primary)' },
	};

	return (
		<div className='relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-muted'>
			<motion.div
				className='absolute left-0 top-0 h-full'
				variants={lineVariants}
				initial={false}
				animate={isComplete ? 'complete' : 'incomplete'}
				transition={{ duration: 0.4 }}
			/>
		</div>
	);
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CheckIconProps extends React.SVGProps<SVGSVGElement> {}

function CheckIcon(props: CheckIconProps) {
	return (
		<svg
			{...props}
			fill='none'
			stroke='currentColor'
			strokeWidth={4}
			viewBox='0 0 24 24'>
			<motion.path
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{
					delay: 0.1,
					type: 'tween',
					ease: 'easeOut',
					duration: 0.3,
				}}
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M5 13l4 4L19 7'
			/>
		</svg>
	);
}
