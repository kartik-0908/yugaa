"use server"
import { Storage } from "@google-cloud/storage";
import db from "../lib/db";

export async function uploadLogo(formData: FormData, shopDomain: any): Promise<string> {
    const file = formData.get("file") as File;
    console.log(file.name)
    const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY,
        },
    });
    const bucketName = process.env.LOGO_BUCKET_NAME || "";
    const bucket = storage.bucket(bucketName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const blob = bucket.file(`${shopDomain}/logo`);
    await new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                cacheControl: 'no-cache',
            },
        });

        blobStream
            .on("error", (err) => reject(err))
            .on("finish", () => resolve(true));

        blobStream.end(buffer);
    });
    return `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
}


export async function uploadDoc(formData: FormData, shopDomain: any) {
    const file = formData.get("file") as File;
    const fileName = file.name;
    const db_update = await db.document.create({
        data: {
            fileName: fileName,
            shopDomain: shopDomain,
            status: "uploading",
        }
    })
    console.log(file.name)
    const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY,
        },
    });
    const bucketName = process.env.FILES_BUCKET_NAME || "";
    const bucket = storage.bucket(bucketName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const blob = bucket.file(`${shopDomain}/${db_update.id}/${fileName}`);
    await new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                cacheControl: 'no-cache',
            },
        });

        blobStream
            .on("error", (err) => reject(err))
            .on("finish", () => resolve(true));

        blobStream.end(buffer);
    });
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    await db.document.update({
        where: {
            id: db_update.id,
        },
        data: {
            fileUrl: fileUrl,
            status: "uploaded",
        }
    })
}


export default async function getSignedUrl(id: string, name: string, shopDomain: string) {
    const storage = new Storage({
        projectId: process.env.PROJECT_ID,
        credentials: {
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY,
        },
    });
    const bucketName = process.env.FILES_BUCKET_NAME || "";
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(`${shopDomain}/${id}/${name}`);
    const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
    });
    return signedUrl;
}
