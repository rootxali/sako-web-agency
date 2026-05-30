import { PrismaLibSql } from "@prisma/adapter-libsql";
const url = "libsql://sako-seharnoreen.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9";
const adapter = new PrismaLibSql({ url });
console.log("Success");
