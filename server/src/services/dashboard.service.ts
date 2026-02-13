import { prisma } from "../config/prisma";
import { calculateEPPI, calculateTISS } from "./performance.service";

export const getParticipantDashboard = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      notifications: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 5 },
      participantSessions: { where: { deletedAt: null }, orderBy: { sessionDate: "desc" }, take: 5 },
      performanceIndexes: { where: { deletedAt: null }, orderBy: { calculatedAt: "desc" }, take: 10 },
      teamMemberships: { include: { team: true } }
    }
  });

  if (!user) return null;

  const latestPerformance = user.performanceIndexes[0];
  const improvementGraph = user.performanceIndexes
    .slice()
    .reverse()
    .map((p) => ({ date: p.calculatedAt, ipi: p.ipi ?? 0 }));

  const attendancePct = user.participantSessions.length
    ? (user.participantSessions.filter((s) => s.attended).length / user.participantSessions.length) * 100
    : 0;

  return {
    profile: {
      fullName: user.fullName,
      email: user.email,
      state: user.state,
      institution: user.institution,
      domainOfInterest: user.domainOfInterest
    },
    kpis: {
      ipi: latestPerformance?.ipi ?? 0,
      punctuality: latestPerformance?.punctualityPercentage ?? 0,
      attendance: Number(attendancePct.toFixed(2)),
      mentorImprovement: latestPerformance?.mentorImprovementScore ?? 0
    },
    mentorFeedback: user.participantSessions.map((session) => ({
      date: session.sessionDate,
      feedback: session.feedback,
      score: session.improvementScore
    })),
    vivaBreakdown: {
      score: latestPerformance?.vivaScore ?? 0,
      contribution: latestPerformance?.contributionPercentage ?? 0,
      milestone: latestPerformance?.milestoneCompletion ?? 0
    },
    improvementGraph,
    teams: user.teamMemberships.map((m) => m.team),
    notifications: user.notifications
  };
};

export const getAdminDashboard = async (filters?: { state?: string; domain?: string }) => {
  const userFilter = {
    deletedAt: null,
    ...(filters?.state ? { state: filters.state } : {}),
    ...(filters?.domain ? { domainOfInterest: filters.domain } : {})
  };

  const [
    totalUsers,
    pendingApprovals,
    verifiedUsers,
    travelRecords,
    accommodationRecords,
    mentorSessions,
    juryScores,
    latestIndexes
  ] = await Promise.all([
    prisma.user.count({ where: userFilter }),
    prisma.user.count({ where: { ...userFilter, isApproved: false } }),
    prisma.user.count({ where: { ...userFilter, isVerified: true } }),
    prisma.travel.findMany({ where: { deletedAt: null } }),
    prisma.accommodation.findMany({ where: { deletedAt: null } }),
    prisma.mentorSession.findMany({ where: { deletedAt: null } }),
    prisma.juryScore.findMany({ where: { deletedAt: null } }),
    prisma.performanceIndex.findMany({ where: { deletedAt: null }, orderBy: { calculatedAt: "desc" }, take: 200 })
  ]);

  const registrationEfficiency = totalUsers ? (verifiedUsers / totalUsers) * 100 : 0;
  const travelPunctuality = travelRecords.length
    ? travelRecords.reduce((sum, r) => sum + r.punctualityPercentage, 0) / travelRecords.length
    : 0;
  const accommodationResolutionEfficiency = accommodationRecords.length
    ? (accommodationRecords.filter((a) => a.issueResolved).length / accommodationRecords.length) * 100
    : 0;
  const sessionPunctuality = mentorSessions.length
    ? mentorSessions.reduce((sum, s) => sum + s.punctualityPercentage, 0) / mentorSessions.length
    : 0;
  const juryFairnessScore = juryScores.length
    ? juryScores.reduce((sum, s) => sum + s.fairnessScore, 0) / juryScores.length
    : 0;

  const eppi = calculateEPPI({
    registrationEfficiency,
    travelPunctuality,
    accommodationResolutionEfficiency,
    sessionPunctuality,
    juryFairnessScore
  });

  const avgIpi = latestIndexes.length
    ? latestIndexes.reduce((sum, i) => sum + (i.ipi ?? 0), 0) / latestIndexes.length
    : 0;

  const tiss = calculateTISS({
    collaborationEfficiency: latestIndexes.length
      ? latestIndexes.reduce((sum, i) => sum + i.collaborationEfficiency, 0) / latestIndexes.length
      : 0,
    averageIpi: avgIpi,
    prototypeCompletionRate: latestIndexes.length
      ? latestIndexes.reduce((sum, i) => sum + i.prototypeCompletionRate, 0) / latestIndexes.length
      : 0,
    juryPreliminaryScore: latestIndexes.length
      ? latestIndexes.reduce((sum, i) => sum + i.juryPreliminaryScore, 0) / latestIndexes.length
      : 0
  });

  return {
    stats: {
      totalUsers,
      pendingApprovals,
      registrationEfficiency: Number(registrationEfficiency.toFixed(2)),
      travelPunctuality: Number(travelPunctuality.toFixed(2)),
      accommodationResolutionEfficiency: Number(accommodationResolutionEfficiency.toFixed(2)),
      sessionPunctuality: Number(sessionPunctuality.toFixed(2)),
      juryFairnessScore: Number(juryFairnessScore.toFixed(2)),
      eppi: Number(eppi.toFixed(2)),
      aiInnovationMaturityIndex: Number(tiss.toFixed(2))
    },
    riskAlerts: [
      pendingApprovals > 25 ? "High pending user approvals" : null,
      travelPunctuality < 70 ? "Travel punctuality below threshold" : null,
      accommodationResolutionEfficiency < 75 ? "Accommodation resolution efficiency below target" : null
    ].filter(Boolean),
    heatmapData: latestIndexes.slice(0, 30).map((item) => ({
      label: item.calculatedAt.toISOString().slice(0, 10),
      ipi: item.ipi ?? 0,
      eppi: item.eppi ?? 0
    }))
  };
};
