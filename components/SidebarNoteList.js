import SidebarNoteItem from '@/components/SidebarNoteItem';
import { getAllNotes } from '@/lib/redis';
import { sleep } from '@/lib/utils';
import SidebarNoteListFilter from './SidebarNoteListFilter';

export default async function NoteList() {
  // await sleep(1000);
  const notes = await getAllNotes()
  const arr = Object.entries(notes);

  if (arr.length == 0) {
    return <div className="notes-empty">
      {'No notes created yet!'}
    </div>
  }

  return (
    <SidebarNoteListFilter>
      {Object.entries(notes).map(([noteId, note]) => {
        return <SidebarNoteItem key={noteId} noteId={noteId} note={JSON.parse(note)} />
    })}
    </SidebarNoteListFilter>
    )
}
