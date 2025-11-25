import Link from 'next/link'
import useSWR from 'swr'
import axios from 'axios'
const fetcher = url => axios.get(url).then(r=>r.data)

export default function Home() {
  const { data: projects } = useSWR('/api/projects', fetcher, {fallbackData: []})
  const total = projects.length
  const completed = projects.filter(p => (p['Work Status']||'').toLowerCase()==='completed').length
  const inProgress = projects.filter(p => (p['Work Status']||'').toLowerCase()==='in progress').length
  const delayed = projects.filter(p => p['Target Completion Date'] && new Date(p['Target Completion Date']) < new Date() && (p['Work Status']||'').toLowerCase()!=='completed').length

  return (
    <div className="container">
      <header>
        <h1>Project Management Dashboard</h1>
        <nav>
          <Link href="/projects"><a className="btn">Projects</a></Link>
          <Link href="/projects/new"><a style={{marginLeft:8}} className="btn">Add Project</a></Link>
          <Link href="/updates/new"><a style={{marginLeft:8}} className="btn">Add Update</a></Link>
          <Link href="/import/upload"><a style={{marginLeft:8}} className="btn">Import</a></Link>
        </nav>
      </header>

      <div className="grid">
        <div className="card"><h3>Total Projects</h3><p style={{fontSize:24}}>{total}</p></div>
        <div className="card"><h3>Completed</h3><p style={{fontSize:24}}>{completed}</p></div>
        <div className="card"><h3>In Progress</h3><p style={{fontSize:24}}>{inProgress}</p></div>
        <div className="card"><h3>Delayed</h3><p style={{fontSize:24}}>{delayed}</p></div>
      </div>
    </div>
  )
}
