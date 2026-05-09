import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { FileText, Download, Edit3, ArrowRight } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
        <p className="text-slate-400">Here's what's happening with your job search today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-300">Resumes Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-300">Cover Letters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-300">Credits Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-400">10</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Resumes</h2>
          <Link to="/dashboard/resumes" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Resume Card */}
          <Card className="bg-gradient-to-b from-[#151515] to-[#0a0a0a] border-white/10 hover:border-white/20 transition-colors group text-white">
            <CardHeader>
              <div className="w-full h-32 bg-white/5 rounded-md mb-4 flex items-center justify-center">
                <FileText className="w-10 h-10 text-slate-500" />
              </div>
              <CardTitle className="text-lg">Software Engineer</CardTitle>
              <CardDescription className="text-slate-400">Updated 2 days ago</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <button className="flex-1 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button className="p-2 border border-white/10 hover:bg-white/10 rounded-md text-slate-300 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
          
          {/* Action Card to create new */}
          <Link to="/builder">
            <Card className="h-full border-dashed border-2 border-white/10 bg-transparent hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-white min-h-[300px]">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                <div className="text-2xl font-light">+</div>
              </div>
              <h3 className="font-medium text-lg">Create New Resume</h3>
              <p className="text-slate-400 text-sm mt-1">From text, chat, or scratch</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
