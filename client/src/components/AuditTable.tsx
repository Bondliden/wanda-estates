import { useState } from "react";
import { AUDIT_DATA } from "../constants";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AuditTable() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [insightContent, setInsightContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenVideo = (pillar: string) => {
    // In a real app, this would map to specific video URLs
    // For prototype, we'll use a placeholder or the same hero video
    setSelectedVideo("/attached_assets/generated_videos/Dec_11__0958_31s_202512111144_8qsab.mp4");
  };

  const handleOpenInsight = (strategicAction: string) => {
    setIsLoading(true);
    setIsInsightOpen(true);
    // Simulate AI thinking time
    setTimeout(() => {
      setInsightContent(`AI Analysis for: "${strategicAction}"\n\nImplementation Complexity: High\nExpected ROI: Very High (12-18 months)\n\nRecommended First Step: Audit current data infrastructure and establish a baseline for user behavior metrics.`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-[#2c3e50] p-6 text-white">
        <h2 className="text-2xl font-serif uppercase tracking-wider">{AUDIT_DATA.title}</h2>
        <p className="text-gray-300 mt-2 font-light">{AUDIT_DATA.description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-4 font-semibold">Strategic Pillar</th>
              <th className="p-4 font-semibold">Current Status</th>
              <th className="p-4 font-semibold">Gap Analysis</th>
              <th className="p-4 font-semibold">Strategic Action 2025</th>
              <th className="p-4 font-semibold">Projected Impact</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
            {AUDIT_DATA.items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-[#013b7a] align-top">{item.pillar}</td>
                <td className="p-4 align-top">{item.currentStatus}</td>
                <td className="p-4 text-red-500 align-top italic">{item.gapAnalysis}</td>
                <td className="p-4 font-medium text-[#2c3e50] align-top">{item.strategicAction}</td>
                <td className="p-4 text-[#e09900] font-semibold align-top">{item.impact2025}</td>
                <td className="p-4 align-top">
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenVideo(item.pillar)}
                      className="w-full flex items-center gap-2 text-xs uppercase tracking-wider hover:bg-[#2ea3f2] hover:text-white transition-all border-gray-200"
                    >
                      <Play className="w-3 h-3" /> Watch Video
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleOpenInsight(item.strategicAction)}
                      className="w-full flex items-center gap-2 text-xs uppercase tracking-wider text-[#e09900] hover:bg-[#e09900]/10 hover:text-[#e09900]"
                    >
                      <Sparkles className="w-3 h-3" /> AI Insight
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black overflow-hidden border-none">
             <div className="relative aspect-video">
                {selectedVideo && (
                    <video 
                        src="/attached_assets/generated_videos/Dec_11__0958_31s_202512111144_8qsab.mp4" 
                        controls 
                        autoPlay 
                        className="w-full h-full object-cover"
                    />
                )}
             </div>
        </DialogContent>
      </Dialog>

      {/* AI Insight Modal */}
      <Dialog open={isInsightOpen} onOpenChange={setIsInsightOpen}>
        <DialogContent className="sm:max-w-md bg-white border-none">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#2c3e50] font-serif uppercase tracking-wider">
                <Sparkles className="w-5 h-5 text-[#e09900]" />
                Veo AI Strategic Insight
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-100 min-h-[150px] flex items-center justify-center">
            {isLoading ? (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2ea3f2]" />
                    <span className="text-xs uppercase tracking-widest">Processing Data...</span>
                </div>
            ) : (
                <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">
                    {insightContent}
                </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}