/**
 * Controller: Translate (MVC - Controller Layer)
 * Xử lý dịch văn bản qua API bên ngoài
 */

// POST /api/translate
async function translate(req, res) {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Missing text or targetLang parameters' });
  }

  const cleanText = text.trim();
  const cleanTargetLang = targetLang.toLowerCase();

  try {
    // 1. Google Translate API key nếu được cung cấp
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: cleanText, target: cleanTargetLang })
      });
      const data = await response.json();
      if (data?.data?.translations?.[0]) {
        return res.json({ translatedText: data.data.translations[0].translatedText });
      }
    }

    // 2. DeepL API key nếu được cung cấp
    if (process.env.DEEPL_API_KEY) {
      const isFreeKey = process.env.DEEPL_API_KEY.endsWith(':fx');
      const url = isFreeKey ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: [cleanText], target_lang: cleanTargetLang.toUpperCase() })
      });
      const data = await response.json();
      if (data?.translations?.[0]) {
        return res.json({ translatedText: data.translations[0].text });
      }
    }

    // 3. Fallback: Google Translate miễn phí (gtx client)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${cleanTargetLang}&dt=t&q=${encodeURIComponent(cleanText)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Translate fallback failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data?.[0]) {
      const translatedText = data[0].map(item => item[0]).join('');
      return res.json({ translatedText });
    }

    throw new Error('Translation parsing error');
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(502).json({ error: 'Translation failed', details: error.message });
  }
}

module.exports = { translate };
