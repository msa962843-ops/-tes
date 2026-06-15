import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
    const code = searchParams.get('folder');

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error("Environment Variables tidak ditemukan");
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    
    const { data, error } = await supabase
      .from('videos_list')
      .select('*')
      .eq('access_code', code)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Data tidak ada");

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="${data.name}" />
          <meta property="og:image" content="${data.thumbnail_url}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta http-equiv="refresh" content="0; url=/player.html?folder=${code}" />
          <title>Redirecting...</title>
        </head>
        <body>Mengarahkan...</body>
      </html>
    `);
  } catch (e) {
    res.status(500).send("Error Detail: " + e.message);
  }
}
