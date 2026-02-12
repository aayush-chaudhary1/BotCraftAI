"use strict";
// Database seed file (optional)
// Run with: npm run prisma:seed
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Create a test user
    const hashedPassword = await bcryptjs_1.default.hash('password123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: { isEmailVerified: true },
        create: {
            email: 'test@example.com',
            password: hashedPassword,
            name: 'Test User',
            isEmailVerified: true,
            settings: {
                create: {
                    theme: 'light',
                    language: 'en',
                },
            },
        },
    });
    console.log('Created test user:', user.email);
    console.log('Seed completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map