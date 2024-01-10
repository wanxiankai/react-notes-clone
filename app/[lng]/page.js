export default function Home({
  params: {
    lng
  }
}) {
  return (
    <div className="note--empty-state">
      <span className="note-text--empty-state">
        Click a {lng} note on the left to view something! 🥺
      </span>
    </div>
  )
}