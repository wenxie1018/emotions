const { GoogleGenerativeAI } = require('@google/generative-ai');
const functions = require('@google-cloud/functions-framework');

// 使用環境變數 GEMINI_API_KEY 管理 API 金鑰
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

functions.http('analyzeSentiment', async (req, res) => {
  // 設定 CORS 標頭
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // 處理 OPTIONS 預檢請求
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "請提供要分析的文字" });
  }

  try {
    // 取得指定模型
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
你是一個情感分析助手，請判斷以下文字屬於：正面、負面、中性。只回覆三個詞其中之一即可：
"${text}"
`;
    const result = await model.generateContent(prompt);
    const sentiment = result.response.text().trim();
    console.log(sentiment);

    res.status(200).json({ result: sentiment });
  } catch (error) {
    console.error("分析失敗：", error);
    res.status(500).json({ message: "情感分析失敗", error: error.message });
  }
});
