import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'projects.json')

function readData(){ try{ return JSON.parse(fs.readFileSync(dataPath,'utf8')) }catch(e){return []} }
function writeData(d){ fs.writeFileSync(dataPath, JSON.stringify(d,null,2)) }

export default function handler(req,res){
  if(req.method === 'GET'){
    const data = readData()
    res.status(200).json(data)
  } else if(req.method === 'POST'){
    const body = req.body || {}
    const data = readData()
    const newId = (data.length>0? (Math.max(...data.map(p=> Number(p['Project ID']||0)))+1) : 1)
    const newItem = { 'Project ID': newId, ...body }
    data.push(newItem)
    writeData(data)
    res.status(201).json(newItem)
  } else if(req.method === 'PUT'){
    const body = req.body || {}
    const id = body['Project ID']
    let data = readData()
    data = data.map(p=> (p['Project ID']==id? {...p,...body}: p))
    writeData(data)
    res.status(200).json({updated:true})
  } else {
    res.status(405).end()
  }
}
