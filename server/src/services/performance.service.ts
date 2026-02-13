import { prisma } from "../config/prisma";

export const classifyInnovationStage = (params: {
  ideaClarity: number;
  technicalFeasibility: number;
  prototypeReadiness: number;
  marketValidation: number;
  improvementTrend: number;
}) => {
  const weighted =
    params.ideaClarity * 0.2 +
    params.technicalFeasibility * 0.25 +
    params.prototypeReadiness * 0.25 +
    params.marketValidation * 0.2 +
    params.improvementTrend * 0.1;

  if (weighted < 35) return "CONCEPT";
  if (weighted < 55) return "VALIDATED_IDEA";
  if (weighted < 75) return "PROTOTYPE";
  return "SCALABLE_INNOVATION";
};

export const calculateIPI = (p: {
  vivaScore: number;
  contributionPercentage: number;
  milestoneCompletion: number;
  mentorImprovementScore: number;
  punctualityPercentage: number;
}) =>
  p.vivaScore * 0.3 +
  p.contributionPercentage * 0.2 +
  p.milestoneCompletion * 0.2 +
  p.mentorImprovementScore * 0.15 +
  p.punctualityPercentage * 0.15;

export const calculateTISS = (p: {
  collaborationEfficiency: number;
  averageIpi: number;
  prototypeCompletionRate: number;
  juryPreliminaryScore: number;
}) =>
  p.collaborationEfficiency * 0.3 +
  p.averageIpi * 0.3 +
  p.prototypeCompletionRate * 0.2 +
  p.juryPreliminaryScore * 0.2;

export const calculateEPPI = (p: {
  registrationEfficiency: number;
  travelPunctuality: number;
  accommodationResolutionEfficiency: number;
  sessionPunctuality: number;
  juryFairnessScore: number;
}) =>
  p.registrationEfficiency * 0.25 +
  p.travelPunctuality * 0.25 +
  p.accommodationResolutionEfficiency * 0.2 +
  p.sessionPunctuality * 0.15 +
  p.juryFairnessScore * 0.15;

export const recomputeParticipantIpi = async (userId: string) => {
  const latest = await prisma.performanceIndex.findFirst({
    where: { userId, deletedAt: null },
    orderBy: { calculatedAt: "desc" }
  });

  if (!latest) return null;

  const ipi = calculateIPI({
    vivaScore: latest.vivaScore,
    contributionPercentage: latest.contributionPercentage,
    milestoneCompletion: latest.milestoneCompletion,
    mentorImprovementScore: latest.mentorImprovementScore,
    punctualityPercentage: latest.punctualityPercentage
  });

  return prisma.performanceIndex.update({
    where: { id: latest.id },
    data: { ipi }
  });
};
