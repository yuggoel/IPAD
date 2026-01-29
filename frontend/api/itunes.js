export default async function handler(req, res) {
  try {
    // Forward the query string directly to the iTunes Search API
    const qs = req.url.split('?')[1] || '';
    const target = `https://itunes.apple.com/search?${qs}`;

    const response = await fetch(target);
    const body = await response.text();

    // Pass through content-type from iTunes (usually application/json; charset=utf-8)
    const contentType = response.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);
    // Cache on CDN for short period
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    res.status(response.status).send(body);
  } catch (err) {
    console.error('api/itunes proxy error', err);
    res.status(500).json({ error: 'Proxy error' });
  }
}
