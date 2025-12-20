export default async function handler(req, res) {
  try {
    const response = await fetch("https://cronoplanbackend.onrender.com/health");

    if (!response.ok) {
      return res.status(500).json({ ok: false });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
}
