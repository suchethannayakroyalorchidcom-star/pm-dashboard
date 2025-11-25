import {useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'

export default function NewProject(){
  const [form,setForm]=useState({ProjectName:'', City:'', State:'', ClusterHead:''})
  const router = useRouter()

  const handle = async (e) => {
    e.preventDefault()
    const payload = {
      'Project Name': form.ProjectName,
      City: form.City,
      State: form.State,
      'Cluster Head': form.ClusterHead,
      'Work Status': 'Not Started'
    }
    await axios.post('/api/projects', payload)
    router.push('/projects')
  }

  return (
    <div className="container">
      <header><h1>Add Project</h1></header>
      <div className="card">
        <form onSubmit={handle}>
          <label>Project Name<input value={form.ProjectName} onChange={e=>setForm({...form,ProjectName:e.target.value})} /></label>
          <label>City<input value={form.City} onChange={e=>setForm({...form,City:e.target.value})} /></label>
          <label>State<input value={form.State} onChange={e=>setForm({...form,State:e.target.value})} /></label>
          <label>Cluster Head<input value={form.ClusterHead} onChange={e=>setForm({...form,ClusterHead:e.target.value})} /></label>
          <div style={{marginTop:12}}><button className="btn">Create Project</button></div>
        </form>
      </div>
    </div>
  )
}
