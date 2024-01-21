'use server'

import { redirect } from 'next/navigation'
import { addNote, updateNote, delNote } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { z } from "zod";
import { sleep } from '@/lib/utils';
import dayjs from 'dayjs';
import { join } from 'path'
import { stat, mkdir, writeFile } from 'fs/promises';
import mime from 'mime'

const schema = z.object({
  title: z.string(),
  content: z.string().min(1, '请填写内容').max(100, '字数最多 100')
});


export async function saveNote(prevState, formData) {

  const noteId = formData.get('noteId')

  const data = {
    title: formData.get('title'),
    content: formData.get('body'),
    updateTime: new Date()
  }

  // 校验数据
  const validated = schema.safeParse(data)
  if (!validated.success) {
    return {
      errors: validated.error.issues,
    }
  }


  // 为了让效果更明显
  await sleep(2000)

  if (noteId) {
    updateNote(noteId, JSON.stringify(data))
    revalidatePath('/', 'layout')
  } else {
    const res = await addNote(JSON.stringify(data))
    revalidatePath('/', 'layout')
  }
  return { message: `Add Success!` }
}

export async function deleteNote(formData) {
  const noteId = formData.get('noteId')
  delNote(noteId)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function importNode(formData) {
  const file = formData.get('file')

  if (!file) {
    return { error: 'File is required.' }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dayjs().format('YY-MM-DD')}`;
  const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

  try {
    await stat(uploadDir)
  } catch (error) {
    if (error.code === 'ENOENT') {
      await mkdir(uploadDir, { recursive: true })
    } else {
      console.error(e)
      return { error: "1111something went wrong" }
    }
  }

  try {
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
    const filename = file.name.replace(/\.[^/.]+$/, '');
    const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer)

    const res = await addNote(JSON.stringify({
      title: filename,
      content: buffer.toString('utf-8')
    }))

    revalidatePath('/', 'layout')

    return {
      fileUrl: `${relativeUploadDir}/${uniqueFilename}`,
      uid: res
    }
  } catch (error) {
    console.error(error)
    return { error: "222something went wrong" }
  }

}
