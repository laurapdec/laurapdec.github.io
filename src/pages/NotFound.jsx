import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bg-1 to-bg-2 px-4">
      <div className="text-center">
        {/* Cute Robot Icon */}
        <div className="mb-8 flex justify-center">
          <svg
            className="w-32 h-32 text-accent animate-float"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16C13.1046 16 14 15.1046 14 14C14 12.8954 13.1046 12 12 12C10.8954 12 10 12.8954 10 14C10 15.1046 10.8954 16 12 16Z"
              fill="currentColor"
            />
            <path
              d="M19 15V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V15M19 15V9C19 7.89543 18.1046 7 17 7H7C5.89543 7 5 7.89543 5 9V15M19 15H5M12 7V3M8 3H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Add animated eyes */}
            <circle
              cx="9"
              cy="11"
              r="1"
              fill="currentColor"
              className="animate-blink"
            />
            <circle
              cx="15"
              cy="11"
              r="1"
              fill="currentColor"
              className="animate-blink"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-600 mb-6">
          Oops! Page not found
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for seems to have wandered off. Let's get you back on track!
        </p>
        <Link
          to="/cv"
          className="inline-flex items-center px-6 py-3 bg-accent text-black font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to CV
        </Link>
      </div>
    </div>
  )
}