import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Image, Play, BarChart } from "lucide-react";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export default function DreamWeaverUI() {
  const [dreamText, setDreamText] = useState("");
  const [dreamAnalysis, setDreamAnalysis] = useState(null);
  const [dreamImage, setDreamImage] = useState(null);
  const [activeTab, setActiveTab] = useState("record");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedDream = localStorage.getItem("dreamText");
    if (savedDream) {
      setDreamText(savedDream);
      setWordCount(savedDream.split(" ").length);
    }
  }, []);

  const handleAnalyzeDream = async () => {
    setLoading(true);
    setError(null);
    setDreamAnalysis("Analyzing dream...");
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Analyze the dream text and provide a deep psychological interpretation including emotions, themes, and possible subconscious meanings." },
          { role: "user", content: dreamText }
        ],
      });
      setDreamAnalysis(response.choices[0].message.content);
    } catch (error) {
      setError("Error analyzing dream. Please check your API key and try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDreamArt = async () => {
    if (!dreamText) {
      setDreamImage("Please enter a dream description first.");
      return;
    }
    setLoading(true);
    setError(null);
    setDreamImage("Generating dream art...");
    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: `A surreal art representation of this dream: ${dreamText}`,
        n: 1,
        size: "512x512"
      });
      setDreamImage(response.data[0].url);
    } catch (error) {
      setError("Error generating dream art. Please check your API key and try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white min-h-screen relative flex flex-col justify-between">
      <h1 className="text-xl font-bold mb-4 text-center">🌙 DreamWeaver</h1>
      <div className="flex-grow flex flex-col items-center justify-center">
        {activeTab === "record" && (
          <Card className="mb-4 w-full">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-center">Record Your Dream</h2>
              <Textarea
                placeholder="Describe your dream here..."
                value={dreamText}
                onChange={(e) => {
                  setDreamText(e.target.value);
                  setWordCount(e.target.value.split(" ").length);
                }}
                className="mb-2"
              />
              <p className="text-sm text-gray-400 text-center">Word count: {wordCount}</p>
              <div className="flex flex-col gap-2 justify-center items-center">
                <Button variant="outline" className="w-full"><Mic size={18} /> Voice Record</Button>
                <Button variant="outline" onClick={handleAnalyzeDream} className="w-full" disabled={loading}><Send size={18} /> {loading ? "Analyzing..." : "Analyze Dream"}</Button>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
          </Card>
        )}

        {activeTab === "analysis" && dreamAnalysis && (
          <Card className="mb-4 w-full">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-center">AI Dream Interpretation</h2>
              <p className="mb-2">{dreamAnalysis}</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "tools" && (
          <Card className="mb-4 w-full">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2 text-center">Dream Tools</h2>
              <div className="flex flex-col gap-2 justify-center items-center">
                <Button variant="outline" className="w-full"><Play size={18} /> Play Lucid Cue</Button>
                <Button variant="outline" onClick={handleGenerateDreamArt} className="w-full" disabled={loading}><Image size={18} /> {loading ? "Generating..." : "Generate Dream Art"}</Button>
              </div>
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-lg shadow-md relative mt-4">
                {dreamImage && dreamImage !== "Generating dream art..." ? <img src={dreamImage} alt="Generated Dream Art" className="rounded-lg" /> : <p className="text-gray-400">{dreamImage || "Generated dream art will appear here"}</p>}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="ghost" onClick={() => setActiveTab("record")} className={activeTab === "record" ? "font-bold" : ""}>Record</Button>
        <Button variant="ghost" onClick={() => setActiveTab("analysis")} className={activeTab === "analysis" ? "font-bold" : ""}>Analysis</Button>
        <Button variant="ghost" onClick={() => setActiveTab("tools")} className={activeTab === "tools" ? "font-bold" : ""}>Tools</Button>
      </div>
    </div>
  );
}
