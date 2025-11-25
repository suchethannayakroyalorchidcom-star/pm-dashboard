import useSWR from 'swr'
import axios from 'axios'
import {useRouter} from 'next/router'

const fetcher = url => axios.get(url).then(r=>r.data)

export default function ProjectDetail(){
  const router = useRouter()
  const { id } = router.query
  const { data: projects } = useSWR('/api/projects', fetcher, {fallbackData:[]})
  const { data: updates } = useSWR('/api/updates', fetcher, {fallbackData:[]})
  const project = projects.find(p => (''+ (p['Project ID']||'')).toLowerCase()===(''+id).toLowerCase()) || projects[id] || null
  const projectUpdates = (updates||[]).filter(u => (u['Linked Project'] || '')===(project && (project['Project Name']||project['Project ID']||'')))

  if(!project) return <div className="container"><p>Loading...</p></div>

  return (
    <div className="container">
      <header><h1>{project['Project Name']}</h1><a href="/">Back</a></header>
      <div className="card">
        <h3>Basic Info</h3>
        <p><strong>City:</strong> {project['City']}</p>
        <p><strong>State:</strong> {project['State']}</p>
        <p><strong>Cluster Head:</strong> {project['Cluster Head']}</p>
        <p><strong>Status:</strong> {project['Work Status']}</p>
      </div>

      <div className="card">
        <h3>Progress / Updates</h3>
        {projectUpdates.length===0 && <p>No updates yet.</p>}
        <ul>
          {projectUpdates.map((u,idx)=>(<li key={idx}><strong>{u['Update Date']}</strong> - {u['Update Notes']||u['Issues']}</li>))}
        </ul>
      </div>
    </div>
  )
}
