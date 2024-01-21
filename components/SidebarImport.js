'use client'
import { importNode } from "@/actions";
import { useRouter } from "next/navigation";

export default function SidebarImport(){
    const router = useRouter();
    const onChange = async (e) => {
        const fileInput = e.target;

        if(!fileInput.files || fileInput.files.length === 0) {
            console.warn("files is empty")
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData()
        formData.append('file', file)

        try {
            const data = await importNode(formData);
            router.push(`/note/${data.uid}`)
        } catch (error) {
            console.error('333something went wrong')
        }

        e.target.type = 'text'
        e.target.type = 'file'
    }

    return (
        <div style={{textAlign:'center'}}>
            <label htmlFor="file" style={{cursor:'pointer'}}> Import .md File</label>
            <input onChange={onChange} type="file" name="file" id="file" style={{position:'absolute', clip:'rect(0,0,0,0)'}} accept=".md"/>
        </div>
    )
}