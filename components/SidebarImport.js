'use client'
import { importNode } from "@/actions";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useFormStatus } from 'react-dom'

function Submit() {
    const { pending } = useFormStatus();
    return <button disabled={pending}>{pending ? 'Submitting' : 'Submit'}</button>
}

export default function SidebarImport() {
    const router = useRouter();
    const formRef = useRef(null)

    const upload = async (formData) => {

        const file = formData.get('file')

        if (!file) {
            console.warn("files list is empty")
            return;
        }

        try {
            const data = await importNode(formData);
            router.push(`/note/${data.uid}`)
        } catch (error) {
            console.error('333something went wrong')
        }

        formRef.current?.reset()
    }

    return (
        <form style={{ textAlign: 'center' }} action={upload} ref={formRef}>
            <label htmlFor="file" style={{ cursor: 'pointer' }}> Import .md File</label>
            <input type="file" name="file" id="file" accept=".md" />
            <div><Submit /></div>
        </form>
    )
}