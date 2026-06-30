import React, { useState, useRef } from "react";
import { Upload, AlertTriangle, Sparkles, MapPin, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface ReportFormProps {
  onSubmitReport: (payload: {
    title: string;
    description: string;
    imageBase64?: string;
    mediaType?: string;
    latitude: number;
    longitude: number;
  }) => Promise<void>;
  isAnalyzing: boolean;
}

// Preset samples for testing
const SAMPLES = [
  {
    id: "sample_pothole",
    title: "Deep Pothole at Elm and 5th",
    description: "Extremely deep pothole that exposed structural gravel. Cars are swerving into oncoming traffic to avoid it. Extremely hazardous at night.",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
    latitude: 37.7712,
    longitude: -122.4215,
    tag: "Public Works"
  },
  {
    id: "sample_light",
    title: "Dark Lamppost #L-482 near Bakery",
    description: "The street light in front of the local bakery is completely out. It has been flickering for weeks and now is pitch black. Very risky for pedestrians.",
    imageUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=80",
    latitude: 37.7845,
    longitude: -122.4182,
    tag: "Streetlights"
  },
  {
    id: "sample_water",
    title: "Clogged stormwater sewer pooling",
    description: "Heavy pooling of stormwater near the curb storm drain due to debris and leaves blocking the grate. Hydroplaning hazard.",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
    latitude: 37.7788,
    longitude: -122.4255,
    tag: "Water & Sanitation"
  },
  {
    id: "sample_trash",
    title: "Overflowing Garbage and Litter",
    description: "Overfilled metal trash receptacle in children's playground. Wind is blowing trash across the lawn, attracting pests.",
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    latitude: 37.7812,
    longitude: -122.4111,
    tag: "Waste Management"
  }
];

export default function ReportForm({ onSubmitReport, isAnalyzing }: ReportFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [mediaType, setMediaType] = useState<string | undefined>(undefined);
  const [dragActive, setDragActive] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeSample, setActiveSample] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file import and base64 parsing
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please upload an image or video file.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageBase64(reader.result as string);
      setMediaType(file.type);
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Convert Unsplash image URL to Base64 (using a canvas helper to ensure we send base64 data to Gemini)
  const loadSampleAsBase64 = async (sample: typeof SAMPLES[0]) => {
    setActiveSample(sample.id);
    setTitle(sample.title);
    setDescription(sample.description);
    setLatitude(sample.latitude);
    setLongitude(sample.longitude);

    try {
      const response = await fetch(sample.imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
        setMediaType(blob.type);
      };
    } catch (err) {
      console.warn("Failed to fetch image as blob. Using direct URL placeholder.");
      // If fetching directly fails due to CORS, store direct Unsplash URL
      setImageBase64(sample.imageUrl);
      setMediaType("image/jpeg");
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setImageBase64(undefined);
    setMediaType(undefined);
    setLatitude(37.7749);
    setLongitude(-122.4194);
    setActiveSample(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      await onSubmitReport({
        title,
        description,
        imageBase64,
        mediaType,
        latitude,
        longitude,
      });
      setSuccessMsg("Civic report submitted successfully! Running multimodal AI analysis...");
      clearForm();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-indigo-400" />
          File New Civic Report
        </h3>
        <p className="text-xs text-zinc-400">Identify an issue, attach media, and launch automated municipal dispatch.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-medium animate-pulse">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
          {successMsg}
        </div>
      )}

      {/* Preset Testing Grid */}
      <div>
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-500 block mb-2">
          ⚡ Quick Presets (Ideal for Multimodal AI testing)
        </span>
        <div className="grid grid-cols-2 gap-2">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadSampleAsBase64(sample)}
              className={`text-left p-2.5 rounded-xl border text-[11px] transition-all flex flex-col gap-0.5 cursor-pointer ${
                activeSample === sample.id
                  ? "bg-indigo-600/10 border-indigo-500 text-indigo-100"
                  : "bg-zinc-950/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950/60"
              }`}
            >
              <span className="font-bold text-zinc-200 truncate">{sample.title}</span>
              <span className="text-[9px] text-zinc-500 font-mono">{sample.tag} Preset</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Report Title
          </label>
          <input
            type="text"
            required
            disabled={isAnalyzing}
            placeholder="e.g. Broken streetlight causing deep darkness"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Detailed Description
          </label>
          <textarea
            required
            disabled={isAnalyzing}
            rows={3}
            placeholder="Provide context, approximate dimensions, landmarks, safety hazards, and local conditions."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Media Drag and Drop */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Attach Photographic Evidence
          </label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] ${
              dragActive
                ? "border-indigo-500 bg-indigo-500/5"
                : imageBase64
                ? "border-zinc-700 bg-zinc-950/40"
                : "border-zinc-800 bg-zinc-950/20 hover:border-zinc-700 hover:bg-zinc-950/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*,video/*"
              className="hidden"
            />

            {imageBase64 ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-750 relative group">
                  <img
                    src={imageBase64}
                    alt="Upload Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Media Attached successfully
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageBase64(undefined);
                    setMediaType(undefined);
                    setActiveSample(null);
                  }}
                  className="text-[9px] font-mono text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Upload className="w-6 h-6 text-zinc-500 animate-pulse" />
                <span className="text-xs text-zinc-300 font-medium">Drag & drop files or click to browse</span>
                <span className="text-[9px] text-zinc-500 font-mono">Supports PNG, JPG, JPEG, MP4</span>
              </div>
            )}
          </div>
        </div>

        {/* Hyperlocal Grid Coordinates */}
        <div className="grid grid-cols-2 gap-3.5 border-t border-zinc-800 pt-3.5">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" />
              Latitude (Grid-Y)
            </label>
            <input
              type="number"
              step="0.0001"
              min="37.7650"
              max="37.7950"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400" />
              Longitude (Grid-X)
            </label>
            <input
              type="number"
              step="0.0001"
              min="-122.4350"
              max="-122.4050"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isAnalyzing || !title || !description}
          className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer ${
            isAnalyzing || !title || !description
              ? "bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide active:scale-98 shadow-lg shadow-indigo-600/15"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-white" />
              AI Multimodal Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              File & Run AI Analysis
            </>
          )}
        </button>
      </form>
    </div>
  );
}
