import { stat, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mime from 'mime'
import dayjs from "dayjs";
import { addNote } from "lib/redis";

export async function POST(request) {
    
    // 获取formData
    const formData = await request.formData();
    const file = formData.get('file')

    // 判断空值
    if (!file) {
        return NextResponse.json({ error: 'File is empty' }, { status: 400 })
    }

    // 创建上传目录
    const buffer = Buffer.from(await file.arrayBuffer());
    const relativeUploadDir = `/uploads/${dayjs().format('YY-MM-DD')}`
    const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

    try {
        await stat(uploadDir)
    } catch (e) {
        if (e.code === 'ENOENT') {
            await mkdir(uploadDir, { recursive: true })
        } else {
            console.error(e)
            return NextResponse.json({ error: '111Something went wrong' }, { status: 500 })
        }
    }

    try {
        // 写入文件
        const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
        const filename = file.name.replace(/\.[^/.]+$/, '')
        const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`
        await writeFile(`${uploadDir}/${uniqueFilename}`, buffer)

        // 调用接口，写入数据库
        const res = await addNote(JSON.stringify({ title: filename, content: buffer.toString('utf-8') }))

        revalidatePath('/', 'layout')

        return NextResponse.json({ fileUrl: `${relativeUploadDir}/${uniqueFilename}`, uid: res })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: '222Something went wrong' }, { status: 500 })
    }
}