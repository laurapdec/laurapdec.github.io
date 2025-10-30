import PropTypes from 'prop-types'

export default function ProjectCard({ title, blurb, tags = [], thumbnail, onOpen }) {
  return (
    <article className="bg-white/95 dark:bg-[#071126] dark:border-gray-800 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-1 transition p-4 flex flex-col">
      {thumbnail ? (
        <div className="w-full h-40 mb-3 overflow-hidden rounded-md bg-gray-100">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        </div>
      ) : null}

      <div className="flex-1">
        <h3 className="text-lg font-semibold leading-snug text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-muted line-clamp-3">{blurb}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0,5).map((t, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-muted rounded">{t}</span>
          ))}
        </div>
        <button onClick={onOpen} className="text-sm text-accent hover:underline ml-3">Details</button>
      </div>
    </article>
  )
}

ProjectCard.propTypes = {
  title: PropTypes.string.isRequired,
  blurb: PropTypes.string,
  tags: PropTypes.array,
  thumbnail: PropTypes.string,
  onOpen: PropTypes.func
}
