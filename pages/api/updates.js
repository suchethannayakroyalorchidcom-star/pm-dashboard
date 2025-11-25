import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'updates.json')

function readData(){ try{ return JSON.parse(fs.readFileSync(dataPath,'utf8')) }catch(e){return []} }
function writeData(d){ fs.writeFileSync(dataPath, JSON.stringify(d,null,2)) }

export default function handler(req,res){
  if(req.method === 'GET'){
    const data = readData()
    res.status(200).json(data)
  } else if(req.method === 'POST'){
    const body = req.body || {}
    const data = readData()
    data.unshift(body)
    writeData(data)
    res.status(201).json(body)
  } else {
    res.status(405).end()
  }
}
