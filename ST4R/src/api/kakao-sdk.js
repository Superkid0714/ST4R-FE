// /api/kakao-sdk.js

export default async function handler(req, res) {
  const url =
    'https://dapi.kakao.com/v2/maps/sdk.js?appkey=5efbd2f844cb3d8609377a11750272bb&libraries=services&autoload=false';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).send('Failed to fetch kakao sdk.js');
      return;
    }
    const js = await response.text();
    res.setHeader('Content-Type', 'application/javascript');
    res.send(js);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
}
