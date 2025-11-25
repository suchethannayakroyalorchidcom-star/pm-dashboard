import {useState} from 'react'
import axios from 'axios'

export default function ImportUpload(){
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const handle = async (e) => {
    e.preventDefault()
    if(!file) return setStatus('Choose a file first')
    setStatus('Uploading...')
    const fd = new FormData()
    fd.append('file', file)
    try{
      const res = await axios.post('/api/import/upload', fd, { headers: {'Content-Type':'multipart/form-data'} })
      setStatus('Imported: '+ (res.data.imported || 0) + ' rows')
    }catch(err){
      console.error(err)
      setStatus('Import failed: '+ (err.response?.data?.error || err.message))
    }
  }
  return (
    <div className="container">
      <header><h1>Import Excel (Upload)</h1></header>
      <div className="card">
        <form onSubmit={handle}>
          <label>Excel File<input type="file" accept=".xlsx,.xls" onChange={e=>setFile(e.target.files[0])} /></label>
          <div style={{marginTop:12}}><button className="btn">Upload & Import</button></div>
        </form>
        <p>{status}</p>
      </div>
    </div>
  )
}
