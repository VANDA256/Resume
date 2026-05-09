import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { generateResumeWithAI } from "../lib/gemini";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, ArrowLeft, Upload, Copy, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Builder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inputData, setInputData] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null);

  const handleGenerate = async () => {
    if (!inputData.trim()) {
      toast.error("Please enter some text, chat logs, or voice transcripts.");
      return;
    }

    setIsGenerating(true);
    try {
      const resumeJson = await generateResumeWithAI(inputData);
      setGeneratedResume(resumeJson);
      toast.success("Resume generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate resume. Ensure AI limits aren't exceeded.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !generatedResume) return;
    try {
      await addDoc(collection(db, "resumes"), {
        userId: user.uid,
        title: generatedResume.personalInfo?.title || "My Auto-Generated Resume",
        content: JSON.stringify(generatedResume),
        templateId: "default",
        isPublic: false,
        atsScore: 85 + Math.floor(Math.random() * 10), // Mock ATS score based on AI generation
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Resume saved to your dashboard!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving resume", error);
      toast.error("Could not save resume. Make sure you are signed in.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans pb-20">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-50 flex items-center px-6">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="mx-auto font-bold text-lg flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <FileText className="w-3 h-3 text-white" />
          </div>
          Major Resume AI
        </div>
        <div className="w-16" /> {/* Spacer */}
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid lg:grid-cols-2 gap-8">
        {/* Input Region */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Chat to Resume</h1>
            <p className="text-slate-400 leading-relaxed">
              Paste your WhatsApp chat, rough notes, voice transcript, or bullet points here. Our AI will automatically extract, format, and ATS-optimize your experience.
            </p>
          </div>

          <Card className="bg-[#111] border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Raw Experience Data</CardTitle>
              <CardDescription className="text-slate-400">Information to be processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                className="min-h-[400px] font-mono text-sm bg-black/50 border-white/10 focus-visible:ring-blue-500 text-slate-300 resize-none"
                placeholder="Example: I worked at MTN for 2 years. I fixed network towers and led a team of 5 engineers. We increased uptime by 20%..."
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5 hover:text-white">
                  <Upload className="w-4 h-4 mr-2" /> Upload TXT File
                </Button>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !inputData.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                  ) : (
                    "Generate Resume"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Region */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Preview</h2>
            {generatedResume && (
              <div className="flex items-center gap-2">
                <Button onClick={handleSave} variant="secondary" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20">
                  <Save className="w-4 h-4 mr-2" /> Save to Dashboard
                </Button>
              </div>
            )}
          </div>

          {!generatedResume ? (
            <div className="h-[600px] border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center bg-white/[0.02]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 mx-auto flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500">Your generated resume will appear here.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white text-black p-8 rounded-xl shadow-2xl overflow-y-auto max-h-[800px] space-y-8">
              {/* Render generated JSON nicely as a resume */}
              <div className="text-center border-b pb-6">
                <h1 className="text-3xl font-serif font-bold uppercase tracking-wider">{generatedResume.personalInfo?.name || "Your Name"}</h1>
                <p className="text-blue-700 font-medium mt-1">{generatedResume.personalInfo?.title || "Professional Title"}</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600 mt-3">
                  <span>{generatedResume.personalInfo?.email}</span>
                  {generatedResume.personalInfo?.phone && (
                    <><span>•</span><span>{generatedResume.personalInfo?.phone}</span></>
                  )}
                </div>
              </div>

              {generatedResume.personalInfo?.summary && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black/10 pb-1 mb-3 uppercase tracking-wide text-slate-800">Professional Summary</h2>
                  <p className="text-sm leading-relaxed text-slate-700">{generatedResume.personalInfo.summary}</p>
                </div>
              )}

              {generatedResume.experience && generatedResume.experience.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black/10 pb-1 mb-4 uppercase tracking-wide text-slate-800">Experience</h2>
                  <div className="space-y-6">
                    {generatedResume.experience.map((exp: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-slate-900">{exp.role}</h3>
                          <span className="text-sm font-medium text-blue-700">{exp.startDate} - {exp.endDate}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {exp.description?.map((desc: string, j: number) => (
                            <li key={j} className="text-sm text-slate-700 leading-relaxed">{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {generatedResume.education && generatedResume.education.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black/10 pb-1 mb-4 uppercase tracking-wide text-slate-800">Education</h2>
                  <div className="space-y-4">
                    {generatedResume.education.map((edu: any, i: number) => (
                      <div key={i} className="flex justify-between items-baseline">
                        <div>
                          <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                          <div className="text-sm text-slate-600">{edu.institution}</div>
                        </div>
                        <span className="text-sm font-medium text-slate-500">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {generatedResume.skills && generatedResume.skills.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold border-b border-black/10 pb-1 mb-3 uppercase tracking-wide text-slate-800">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {generatedResume.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded shrink-0">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
