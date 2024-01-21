'use client'

import React, { Suspense } from 'react'

export default function SidebarImport() {
  return (
    <form method="post" enctype="multipart/form-data">
      <div style={{ textAlign: "center" }}>
        <label for="file" style={{ cursor: 'pointer' }}>Import .md File</label>
        <input type="file" id="file" name="file" multiple style={{ position : "absolute", clip: "rect(0 0 0 0)" }} />
      </div>
    </form>
  )
}

