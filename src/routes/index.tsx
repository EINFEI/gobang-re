import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <Link to="/game">
      <div
        className="w-screen min-h-screen mx-auto bg-[image:var(--bg-home)] bg-cover bg-center aspect-auto 
      flex flex-col justify-center items-center"
      >
        <p className="text-4xl font-bold text-white"> Click to Start</p>
      </div>
    </Link>
  )
}
