import cloudinary from 'cloudinary'
import formidable from 'formidable'
import fs from 'fs'

export const config = { api: { bodyParser: false } }

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end()
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if(err) return res.status(500).json({error: err.message})
    const file = files.file
    if(!file) return res.status(400).json({error:'No file uploaded'})
    try{
      const result = await cloudinary.v2.uploader.upload(file.filepath || file.path, { folder: 'pm_dashboard' })
      res.status(200).json(result)
    }catch(e){
      res.status(500).json({error: e.message})
    }
  })
}
