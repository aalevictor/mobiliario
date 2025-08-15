/** @format */

import type React from 'react';
export type ParticipantStatus =
	| 'pending'
	| 'under_review'
	| 'approved'
	| 'rejected';
export type FinalDecision = 'approved' | 'rejected' | null;

export interface EvaluationCriteria {
	documentationComplete: boolean | null;
	meetsRequirements: boolean | null;
	eligibilityConfirmed: boolean | null;
	regulationsCompliance: boolean | null;
}

export interface Participant {
	id: number;
	name: string;
	email: string;
	submissionDate: string;
	status: ParticipantStatus;
	documents: string[];
	evaluation: EvaluationCriteria;
	comments: string;
	finalDecision: FinalDecision;
}

export interface CriteriaDefinition {
	id: keyof EvaluationCriteria;
	name: string;
	description: string;
}

export interface StatusConfig {
	label: string;
	variant: string;
	icon: React.ElementType;
	className: string;
}

export interface StatusConfigMap {
	[key: string]: StatusConfig;
}

export interface EvaluationDialogProps {
	participant: Participant | null;
}
