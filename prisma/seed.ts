import { prisma } from "../app/lib/prisma";
import { questions } from "../app/data/questions";
import { hashPassword } from "../app/lib/auth";

async function main() {
  const demoPassword = await hashPassword("demo1234");
  const demoUsers = Array.from({ length: 25 }, (_, index) => ({
    email: `user${index + 1}@demo.local`,
    passwordHash: demoPassword,
  }));

  await prisma.user.upsert({
    where: { email: "demo@demo.local" },
    update: {},
    create: {
      email: "demo@demo.local",
      passwordHash: demoPassword,
      emailVerifiedAt: new Date(),
    },
  });

  for (const user of demoUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        emailVerifiedAt: new Date(),
      },
    });
  }

  for (const question of questions) {
    await prisma.question.upsert({
      where: { id: question.id },
      update: {
        title: question.title,
        context: question.context,
        startsAt: new Date(question.startsAt),
        endsAt: new Date(question.endsAt),
      },
      create: {
        id: question.id,
        title: question.title,
        context: question.context,
        startsAt: new Date(question.startsAt),
        endsAt: new Date(question.endsAt),
      },
    });
  }

  const users = await prisma.user.findMany();
  const questionIds = questions.map((q) => q.id);
  const choices = ["YES", "NO", "UNDECIDED"] as const;

  const votes = [];
  for (const user of users) {
    for (const questionId of questionIds) {
      const randomIndex = (user.email.length + questionId.length) % choices.length;
      votes.push({
        userId: user.id,
        questionId,
        choice: choices[randomIndex],
      });
    }
  }

  await prisma.vote.createMany({
    data: votes,
    skipDuplicates: true,
  });

  for (const question of questions) {
    const forArgs = question.argumentsFor.slice(0, 2);
    const againstArgs = question.argumentsAgainst.slice(0, 2);

    for (const content of forArgs) {
      await prisma.argument.create({
        data: {
          userId: users[0].id,
          questionId: question.id,
          side: "FOR",
          content,
        },
      });
    }

    for (const content of againstArgs) {
      await prisma.argument.create({
        data: {
          userId: users[1]?.id ?? users[0].id,
          questionId: question.id,
          side: "AGAINST",
          content,
        },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
