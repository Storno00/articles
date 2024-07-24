'use server';

import prisma from "../_db/prisma";

export async function createComment(userId: string, articleId: string, body: string) {
    await prisma.comment.create({
        data: { userId, articleId, body }
    });
    return;
}
