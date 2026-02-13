import { PrismaClient, RoleType } from "@prisma/client";
import { hashValue } from "../utils/hash";
import { calculateEPPI, calculateIPI, classifyInnovationStage } from "../services/performance.service";

const prisma = new PrismaClient();

async function main() {
  const roleTypes: RoleType[] = [
    "PARTICIPANT",
    "MENTOR",
    "JURY",
    "TRAVEL_COORDINATOR",
    "HOSPITALITY_MANAGER",
    "ADMIN"
  ];

  for (const roleType of roleTypes) {
    await prisma.role.upsert({
      where: { type: roleType },
      update: {},
      create: {
        type: roleType,
        description: `${roleType} role`
      }
    });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { type: "ADMIN" } });
  const participantRole = await prisma.role.findUniqueOrThrow({ where: { type: "PARTICIPANT" } });

  const adminPassword = await hashValue("Admin@123");
  const participantPassword = await hashValue("User@1234");

  const admin = await prisma.user.upsert({
    where: { email: "admin@innopulse360.com" },
    update: {},
    create: {
      fullName: "System Admin",
      email: "admin@innopulse360.com",
      phoneNumber: "9999999999",
      passwordHash: adminPassword,
      roleId: adminRole.id,
      state: "Karnataka",
      institution: "InnoPulse HQ",
      domainOfInterest: "Management",
      isVerified: true,
      isApproved: true
    }
  });

  const participant = await prisma.user.upsert({
    where: { email: "participant@innopulse360.com" },
    update: {},
    create: {
      fullName: "Priya Sharma",
      email: "participant@innopulse360.com",
      phoneNumber: "8888888888",
      passwordHash: participantPassword,
      roleId: participantRole.id,
      state: "Maharashtra",
      institution: "Innovation Institute",
      domainOfInterest: "AI",
      teamName: "IdeaForge",
      isVerified: true,
      isApproved: true
    }
  });

  const team = await prisma.team.upsert({
    where: { name: "IdeaForge" },
    update: {},
    create: {
      name: "IdeaForge",
      state: "Maharashtra",
      domain: "AI",
      createdById: admin.id
    }
  });

  await prisma.teamMember.upsert({
    where: { teamId_userId: { teamId: team.id, userId: participant.id } },
    update: {},
    create: {
      teamId: team.id,
      userId: participant.id,
      role: "LEAD"
    }
  });

  const stage = classifyInnovationStage({
    ideaClarity: 72,
    technicalFeasibility: 69,
    prototypeReadiness: 55,
    marketValidation: 48,
    improvementTrend: 78
  });

  await prisma.idea.create({
    data: {
      title: "AI Smart Routing for Hackathons",
      summary: "Predictive mentor assignment and participant support system",
      teamId: team.id,
      ownerId: participant.id,
      ideaClarity: 72,
      technicalFeasibility: 69,
      prototypeReadiness: 55,
      marketValidation: 48,
      improvementTrend: 78,
      maturityStage: stage
    }
  });

  const ipi = calculateIPI({
    vivaScore: 75,
    contributionPercentage: 80,
    milestoneCompletion: 70,
    mentorImprovementScore: 78,
    punctualityPercentage: 88
  });

  const eppi = calculateEPPI({
    registrationEfficiency: 90,
    travelPunctuality: 82,
    accommodationResolutionEfficiency: 85,
    sessionPunctuality: 87,
    juryFairnessScore: 79
  });

  await prisma.performanceIndex.create({
    data: {
      userId: participant.id,
      teamId: team.id,
      ipi,
      eppi,
      contributionPercentage: 80,
      milestoneCompletion: 70,
      mentorImprovementScore: 78,
      punctualityPercentage: 88,
      vivaScore: 75,
      collaborationEfficiency: 83,
      prototypeCompletionRate: 61,
      juryPreliminaryScore: 77,
      registrationEfficiency: 90,
      travelPunctuality: 82,
      accommodationResolution: 85,
      sessionPunctuality: 87,
      juryFairnessScore: 79
    }
  });

  await prisma.notification.create({
    data: {
      userId: participant.id,
      title: "Welcome to InnoPulse 360",
      message: "Track your innovation performance from one dashboard.",
      type: "SUCCESS"
    }
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
