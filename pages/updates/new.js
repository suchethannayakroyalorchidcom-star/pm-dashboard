import {useState} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import useSWR from 'swr'

const fetcher = url => axios.get(url).then(r=>r.data)

export default function NewUpdate(){
  const { data: projects } = useSWR('/api/projects', fetcher, {fallbackData:[]})
  const [form,setForm]=useState({LinkedProject:'', UpdateDate:'', CivilPercent:'', MEPPercent:'', Issues:'', UpdateNotes:'', PhotoFile:null})
  const router = useRouter()

  const handleFileUpload = async () => {
    if(!form.PhotoFile) return null
    const fd = new FormData()
    fd.append('file', form.PhotoFile)
    try{
      const res = await axios.post('/api/upload', fd, { headers: {'Content-Type':'multipart/form-data'} })
      return res.data.secure_url || res.data.url || res.data.public_id || null
    }catch(e){
      console.error('Upload failed', e)
      return null
    }
  }

  const handle = async (e) => {
    e.preventDefault()
    let photoUrl = await handleFileUpload()
    const payload = {
      'Linked Project': form.LinkedProject,
      'Update Date': form.UpdateDate,
      'Civil %': form.CivilPercent,
      'MEP %': form.MEPPercent,
      'Issues': form.Issues,
      'Update Notes': form.UpdateNotes,
      'Photo URL': photoUrl
    }
    await axios.post('/api/updates', payload)
    router.push('/')
  }

  return (
    <div className="container">
      <header><h1>Add Site Update</h1></header>
      <div className="card">
        <form onSubmit={handle}>
          <label>Project
            <select value={form.LinkedProject} onChange={e=>setForm({...form,LinkedProject:e.target.value})}>
              <option value="">-- Select --</option>
              { (projects||[]).map((p,idx)=>(<option key={idx} value={p['Project Name']||p['Project ID']}>{p['Project Name']||('Project '+idx)}</option>)) }
            </select>
          </label>
          <label>Update Date<input type="date" value={form.UpdateDate} onChange={e=>setForm({...form,UpdateDate:e.target.value})} /></label>
          <label>Civil %<input value={form.CivilPercent} onChange={e=>setForm({...form,CivilPercent:e.target.value})} /></label>
          <label>MEP %<input value={form.MEPPercent} onChange={e=>setForm({...form,MEPPercent:e.target.value})} /></label>
          <label>Issues<textarea value={form.Issues} onChange={e=>setForm({...form,Issues:e.target.value})} /></label>
          <label>Notes<textarea value={form.UpdateNotes} onChange={e=>setForm({...form,UpdateNotes:e.target.value})} /></label>
          <label>Photo<input type="file" accept="image/*" onChange={e=>setForm({...form,PhotoFile:e.target.files[0]})} /></label>
          <div style={{marginTop:12}}><button className="btn">Submit Update</button></div>
        </form>
      </div>
    </div>
  )
}
