'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function SidebarImport(){
    const router = useRouter()
    const onChange = async (e) => {
        console.log('onChange', e.target)
        const fileInput = e.target;

        if(!fileInput.files || fileInput.files.length === 0){
            console.warn("file list is empty")
            return;
        }   

        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append('file', file)

        try {
            const response = await fetch('/api/upload', {
                method: "POST",
                body: formData,
            })
            if(!response.ok) {
                console.error("333something went wrong")
                return;
            }
            
            const data = await response.json();
            router.push(`/note/${data.uid}`)
        } catch (error) {
            console.error("4444something went wrong")
        }

        e.target.type = 'text';
        e.target.type = 'file';
    }

    return (
        <div style={{textAlign: 'center'}}>
            <label htmlFor='file' style={{cursor:'pointer'}}>Import .md File</label>
            <input onChange={onChange} type='file' id='file' name='file' style={{position:'absolute', clip:'rect(0,0,0,0)'}} accept='.md' />
        </div>
    )
}