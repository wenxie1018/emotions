import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("https://asia-east1-identifying-emotions.cloudfunctions.net/analyzeSentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.message || "分析失敗");
      }
    } catch (err) {
      setError("伺服器錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">情感分析工具</h1>
        <textarea
          rows={4}
          className="w-full p-2 border rounded mb-4"
          placeholder="請輸入要分析的文字..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "分析中..." : "送出分析"}
        </button>

        {result && (
          <div className="mt-4 text-lg">
            分析結果：<span className="font-semibold">{result}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500">
            錯誤：{error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
