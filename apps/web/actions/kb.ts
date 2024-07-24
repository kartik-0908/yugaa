"use server"
import { KbTable } from "../app/admin/knowledge/columns";
import db from "../lib/db";

export async function fetchLinks({ shop }: { shop: string }) {
    const res = await db.knowledgeBase.findUnique({
        where: {
            shopDomain: shop
        },
        select: {
            urls: true
        }
    })

    return { faq: res?.urls?.find(url => url.urlType === "faq")?.url, tnc: res?.urls?.find(url => url.urlType === "tnc")?.url, privacy: res?.urls?.find(url => url.urlType === "privacy")?.url };
}

export async function fetchKb({ shop }: { shop: string }): Promise<KbTable[]> {
    const res = await db.knowledgeBase.findUnique({
        where: {
            shopDomain: shop
        },
        select: {
            urls: true,
            documents: true
        }
    })
    let formattedData: KbTable[] = [];
    const urls = res?.urls;
    const documents = res?.documents;
    urls?.map((url) => {
        formattedData.push({
            id: url.id.toString(),
            name: url.urlType,
            url: url.url,
            status: url.status,
            type: "link",
            shopDomain: shop
        })
    })
    documents?.map(doc => {
        formattedData.push({
            id: doc.id.toString(),
            name: doc.fileName,
            url: doc.fileUrl || "",
            status: doc.status,
            type: "doc",
            shopDomain: shop

        })
    })
    return formattedData;
}

export async function updateUrl(url: string, urlType: "faq" | "tnc" | "privacy", shopDomain: string) {
    await db.url.create({
        data: {
            url: url,
            urlType: urlType,
            shopDomain: shopDomain,
            status: "pending"
        }
    })
}

export async function uploadDoc(
    shopDomain: string,
    formData: FormData
) {
    const data = Object.fromEntries(formData);
    const image = data.image
}

export async function deleteLink(id: string) {
    await db.url.update({
        where: {
            id: parseInt(id)
        },
        data:{
            status: "deleting"
        }
    })
}

export async function deleteDoc(id: string) {
    await db.document.update({
        where: {
            id: parseInt(id)
        },
        data:{
            status: "deleting"
        }
    })
}