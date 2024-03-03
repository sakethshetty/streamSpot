
//this is the file where we are crating the object for the prisma once and importing (using it) wherever we want it further.

//otherwise of this files we need to create the object again and again,just like a object of class

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;

