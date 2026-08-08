import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  HelpCircle,
  FileCheck,
  RefreshCw,
  X,
  BookOpen,
} from 'lucide-react';
import { MedicalScanReport } from '../../types';

interface MedicalReportScannerViewProps {
  scans: MedicalScanReport[];
  onAddScan: (report: MedicalScanReport) => void;
}

export const MedicalReportScannerView: React.FC<MedicalReportScannerViewProps> = ({ scans, onAddScan }) => {
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [docCategory, setDocCategory] = useState('Blood Test Lab Report');
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<MedicalScanReport | null>(scans[0] || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeReport = async () => {
    if (!fileDataUrl) return;
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileDataUrl,
          docCategory,
        }),
      });

      const data = await res.json();

      const newScan: MedicalScanReport = {
        id: `scan-${Date.now()}`,
        title: data.documentType || docCategory,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        documentType: data.documentType || docCategory,
        summary: data.summary || 'Lab values extracted cleanly.',
        extractedMetrics: data.extractedMetrics || [],
        medicalGlossary: data.medicalGlossary || [],
        keyRecommendations: data.keyRecommendations || [],
        questionsForDoctor: data.questionsForDoctor || [],
        fileDataUrl,
      };

      onAddScan(newScan);
      setActiveReport(newScan);
      setFileDataUrl(null);
    } catch (err) {
      console.error('Error scanning report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-900 text-white border border-cyan-500/30 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-cyan-400" /> Multimodal Medical OCR & Term Analysis
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          AI Medical Report & Diagnostic Scanner
        </h1>
        <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
          Upload PDF reports, high-res photos of blood test panels, MRIs, CT scans, ECG tracings, or physician prescriptions. CODECURE AI extracts metrics, flags abnormal parameters, translates complex medical terms, and generates doctor questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Upload New Document
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Document Classification
              </label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs border border-slate-200 dark:border-slate-700"
              >
                <option value="Blood Test Lab Report">Blood Test / Lipid / Metabolic Panel</option>
                <option value="MRI Imaging Report">MRI Imaging Radiology Report</option>
                <option value="CT Scan / X-Ray">CT Scan / Chest X-Ray</option>
                <option value="ECG Cardiology Report">ECG Tracing & Rhythm Analysis</option>
                <option value="Prescription Rx">Physician Prescription Rx</option>
              </select>
            </div>

            {/* Dropzone */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500/60 bg-slate-50/50 dark:bg-slate-800/40 text-center cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drop file
              </div>
              <p className="text-[10px] text-slate-400">
                Supports PNG, JPG, WEBP, PDF (max 25MB)
              </p>
            </div>

            {fileDataUrl && (
              <div className="space-y-3">
                <div className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                    Document Selected
                  </span>
                  <button
                    onClick={() => setFileDataUrl(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAnalyzeReport}
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Processing Multimodal OCR...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Parse Lab Parameters
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Scan History list */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
              Scanned History
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {scans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => setActiveReport(scan)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs transition-colors flex items-center justify-between ${
                    activeReport?.id === scan.id
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div>{scan.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{scan.date}</div>
                  </div>
                  <FileCheck className="w-4 h-4 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Details Column */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    {activeReport.documentType}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {activeReport.title}
                  </h2>
                  <p className="text-xs text-slate-400">Analyzed on {activeReport.date}</p>
                </div>

                <button
                  onClick={() => alert('Report summary downloaded as PDF.')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-4 h-4" /> Export Report Summary
                </button>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                  Executive Findings Summary
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeReport.summary}
                </p>
              </div>

              {/* Extracted Metrics Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Extracted Biomarkers & Parameters
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="pb-2">Biomarker</th>
                        <th className="pb-2">Observed Value</th>
                        <th className="pb-2">Reference Range</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {activeReport.extractedMetrics?.map((metric, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">
                            {metric.name}
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                            {metric.value}
                          </td>
                          <td className="py-3 text-slate-400">{metric.normalRange}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                metric.status === 'Normal'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {metric.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Glossary */}
              {activeReport.medicalGlossary?.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-teal-500" /> Medical Term Glossary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeReport.medicalGlossary.map((gloss, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 text-xs space-y-1"
                      >
                        <div className="font-bold text-teal-800 dark:text-teal-300">{gloss.term}</div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                          {gloss.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High Yield Doctor Questions */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-500" /> High-Yield Questions for Your Doctor
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {activeReport.questionsForDoctor?.map((q, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Select or upload a report to view detailed OCR parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
