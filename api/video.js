import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, 'https://' + req.headers.host);
  const code = searchParams.get('folder');

  // Pastikan variabel ini tidak undefined
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    return res.status(500).send('Error: Environment variables missing');
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  
  try {
    const { data, error } = await supabase.from('videos_list').select('*').eq('access_code', code).single();

    if (error) throw error;
    if (!data) return res.status(404).send('Data tidak ditemukan');

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="${data.name || 'Video'}" />
          <meta property="og:image" content="${data.thumbnail_url || 'https://via.placeholder.com/600'}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta http-equiv="refresh" content="0; url=/player.html?folder=${code}" />
          <title>Mengarahkan...</title>
        </head>
        <body>Mengarahkan ke ${data.name}...</body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Error Database: ' + err.message);
  }
}
