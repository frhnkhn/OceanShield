"use client";

import { useCallback, useEffect, useState } from "react";
import { createReport, getReport } from "@/services/reportService";
import { isFirebaseStorageConfigured } from "@/lib/firebase";
import { uploadReportImage } from "@/services/storageService";

import UploadBox from "./UploadBox";
import HazardSelector from "./HazardSelector";
import SeveritySlider from "./SeveritySlider";
import LocationPicker from "./LocationPicker";
import type { Report, ReportDraft } from "@/types/report";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState<File[]>([]);

  const [hazard, setHazard] = useState("Flood");

  const [severity, setSeverity] = useState(3);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [analysisReportId, setAnalysisReportId] = useState<number | null>(null);
  const [analysisReport, setAnalysisReport] = useState<Report | null>(null);

  useEffect(() => {
    if (analysisReportId === null) return;

    let cancelled = false;
    const checkAnalysis = async () => {
      try {
        const report = await getReport(analysisReportId);
        if (cancelled) return;
        setAnalysisReport(report);
        const isAnalysisRunning = report.ai_status === "queued" || report.ai_status === "processing";
        const isReasoningRunning = report.gemini_status === "queued" || report.gemini_status === "processing";
        if (isAnalysisRunning || isReasoningRunning) {
          window.setTimeout(checkAnalysis, 2500);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to retrieve analysis results.");
        }
      }
    };

    void checkAnalysis();
    return () => {
      cancelled = true;
    };
  }, [analysisReportId]);

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  }, []);

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setAnalysisReportId(null);
    setAnalysisReport(null);

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please add a title and a description.");
      return;
    }

    if (latitude === 0 && longitude === 0) {
      setErrorMessage("Please allow location access before submitting a report.");
      return;
    }

    const { isOnline, queueOfflineReport } = await import("@/services/offlineService");

    if (!isOnline()) {
      setIsSubmitting(true);
      try {
        const reportDraft: ReportDraft = {
          title,
          description,
          hazard,
          severity,
          latitude,
          longitude,
          image_url: null, // offline images stored in base64 queue
        };
        // queue first image for compatibility with offline services
        await queueOfflineReport(reportDraft, images[0] || null);
        setSuccessMessage("🚨 Device Offline: Report queued locally. It will upload automatically when internet connectivity returns.");
        setTitle("");
        setDescription("");
        setImages([]);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to queue offline report.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (images.length > 0 && !isFirebaseStorageConfigured) {
      setErrorMessage("Image upload needs Firebase Storage configuration. Add the Firebase values to .env.local, or submit this report without an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // upload primary image (images[0]) for the main report schema
      const image_url = images.length > 0 ? await uploadReportImage(images[0]) : null;
      const report: ReportDraft = {
        title,
        description,
        hazard,
        severity,
        latitude,
        longitude,
        image_url,
      };
      const result = await createReport(report);
      setSuccessMessage(`${result.message} Your report is now visible on the live map.`);
      if (result.ai_status !== "not_requested") {
        setAnalysisReportId(result.report_id);
      }
      setTitle("");
      setDescription("");
      setImages([]);

    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

 

  return (
    <div className="max-w-3xl mx-auto rounded-lg bg-white border border-slate-200 p-8 shadow-sm space-y-6">

      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        🌊 Report Coastal Hazard
      </h1>

      <p className="text-slate-550 text-sm">Share what you see so local responders can act faster.</p>

      {/* Title */}

      <input
        type="text"
        placeholder="Report Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-900 focus:outline-none"
      />

      {/* Description */}

      <textarea
        rows={5}
        placeholder="Describe the incident..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-900 focus:outline-none"
      />

      {/* Image Upload */}

      <UploadBox
        images={images}
        setImages={setImages}
        disabled={isSubmitting}
      />

      {!isFirebaseStorageConfigured && (
        <p className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-705 leading-normal">
          Image uploads are not configured yet. Reports can still be submitted without an image.
        </p>
      )}

      {/* Hazard */}

      <HazardSelector
        value={hazard}
        onChange={setHazard}
      />

      {/* Severity */}

      <SeveritySlider
        value={severity}
        onChange={setSeverity}
      />

      {/* GPS */}

      <LocationPicker
        onLocationChange={handleLocationChange}
      />

      {/* Submit */}

      {errorMessage && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700 leading-normal">{errorMessage}</p>}
      {successMessage && <p role="status" className="rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 leading-normal">{successMessage}</p>}
      {analysisReport && (
        <section className="rounded border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 space-y-2" aria-live="polite">
          <p className="font-bold text-slate-900">AI object detection: {analysisReport.ai_status}</p>
          {analysisReport.ai_status === "queued" || analysisReport.ai_status === "processing" ? (
            <p className="text-slate-500">Your evidence image is being analysed locally.</p>
          ) : null}
          {analysisReport.ai_status === "completed" && (
            <p className="text-slate-600">{analysisReport.ai_results?.detections.length ?? 0} object{(analysisReport.ai_results?.detections.length ?? 0) === 1 ? "" : "s"} detected by {analysisReport.ai_model}.</p>
          )}
          {analysisReport.ai_status === "failed" && (
            <p className="text-red-650 font-semibold">Analysis could not complete. The report was still saved.</p>
          )}
          {analysisReport.gemini_status === "queued" || analysisReport.gemini_status === "processing" ? (
            <p className="text-slate-500">Gemini is preparing an incident assessment.</p>
          ) : null}
          {analysisReport.gemini_status === "completed" && analysisReport.gemini_summary && (
            <div className="border-t border-slate-200 pt-3 mt-2">
              <p className="font-bold text-blue-900">Gemini incident assessment</p>
              <p className="mt-1 text-slate-655 leading-relaxed">{analysisReport.gemini_summary}</p>
            </div>
          )}
          {analysisReport.gemini_status === "not_configured" && (
            <p className="text-amber-705">Gemini is ready to use once its backend API key is configured.</p>
          )}
          {analysisReport.gemini_status === "failed" && (
            <p className="text-red-650 font-semibold">The Gemini assessment could not be generated. The report and YOLO results remain available.</p>
          )}
        </section>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full rounded bg-blue-900 py-3 font-bold text-white hover:bg-blue-800 transition disabled:cursor-not-allowed disabled:opacity-60 text-sm"
      >
        {isSubmitting ? "Submitting report…" : "Submit Report"}
      </button>
    </div>
  );
}
