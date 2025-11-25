import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

export const config = { api: { bodyParser: false } }

function writeJson(p, d){ fs.writeFileSync(p, JSON.stringify(d,null,2)) }

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end()
  const form = new formidable.IncomingForm({ multiples: false })
  form.parse(req, async (err, fields, files) => {
    if(err) return res.status(500).json({error: err.message})
    const file = files.file
    if(!file) return res.status(400).json({error:'No file uploaded'})
    try{
      const wb = XLSX.readFile(file.filepath || file.path)
      const sheet = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(sheet, { header:1 })
      const projects = []
      for(let i=1;i<Math.min(500,data.length);i++){
        const row = data[i]
        if(!row || row.length===0) continue
        const name = String(row[0]||'').trim()
        const city = String(row[1]||'').trim()
        const state = String(row[2]||'').trim()
        if(name) projects.push({ 'Project ID': i, 'Project Name': name, 'City': city, 'State': state })
      }
      const dataDir = path.join(process.cwd(),'data')
      if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
      writeJson(path.join(dataDir,'projects.json'), projects)
      res.status(200).json({imported: projects.length})
    }catch(e){
      res.status(500).json({error: e.message})
    }
  })
}
