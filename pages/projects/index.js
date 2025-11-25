import Link from 'next/link'
import useSWR from 'swr'
import axios from 'axios'
const fetcher = url => axios.get(url).then(r=>r.data)

export default function Projects() {
  const { data: projects } = useSWR('/api/projects', fetcher, {fallbackData: []})
  return (
    <div className="container">
      <header><h1>Projects</h1><Link href="/"><a>Back</a></Link></header>
      <div className="card">
        <table>
          <thead><tr><th>Project Name</th><th>City</th><th>State</th><th>Status</th></tr></thead>
          <tbody>
            { (projects||[]).map((p,idx)=>(
              <tr key={idx}>
                <td><Link href={'/projects/'+(p['Project ID']||idx)}><a>{p['Project Name']||'Untitled'}</a></Link></td>
                <td>{p['City']}</td>
                <td>{p['State']}</td>
                <td>{p['Work Status']}</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  )
}
