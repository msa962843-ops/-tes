import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, 'https://' + req.headers.host);
  const code = searchParams.get('folder');

  // Menggunakan variabel yang baru Anda simpan di Vercel
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  
  const { data, error } = await supabase.from('videos_list').select('*').eq('access_code', code).single();

  if (error || !data) {
    return res.status(404).send('Video tidak ditemukan');
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="${data.name || 'Video'}" />
        <meta property="og:image" content="${data.thumbnail_url || 'https://via.placeholder.com/600'}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta http-equiv="refresh" content="0; url=/player.html?folder=${code}" />
        <title>Loading...</title>
      </head>
      <body>Mengarahkan...</body>
    </html>
  `);
}
