import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Crosshair, Camera, Upload, X, Loader2, ChevronDown } from "lucide-react";
import { CATEGORIES } from "../components/categories";
import { Button } from "../components/Button";
import { api, ApiError } from "../lib/api";
import type { Location } from "../types";
import { useApp } from "../context/AppContext";

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

export function Observe() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationId, setLocationId] = useState("jakkur");
  const [locatingGPS, setLocatingGPS] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.locations().then(({ locations }) => setLocations(locations));
  }, []);

  const activeLocation = locations.find((l) => l.id === locationId);

  function toggleCategory(id: string) {
    setCategories((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      showToast("Location access isn't available in this browser — pick a location instead.", "info");
      return;
    }
    setLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest = locations[0];
        let best = Infinity;
        for (const loc of locations) {
          const d = distanceKm(latitude, longitude, loc.lat, loc.lng);
          if (d < best) {
            best = d;
            nearest = loc;
          }
        }
        if (nearest) setLocationId(nearest.id);
        setLocatingGPS(false);
        showToast(`Using your location — nearest monitored site is ${nearest?.name}.`, "success");
      },
      () => {
        setLocatingGPS(false);
        showToast("Couldn't access your location. Pick one from the list instead.", "info");
      },
      { timeout: 6000 }
    );
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  }

  async function handleSubmit() {
    setError("");
    if (categories.length === 0) {
      setError("Select at least one observation category.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.submitObservation({
        locationId,
        categories,
        description,
        hasPhoto: !!photoName,
      });
      navigate("/verification", { state: result });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't submit your observation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pb-10 pt-5 md:px-8 md:pt-8">
      <h1 className="text-2xl text-aqua-900">Observe</h1>
      <p className="mt-1 text-sm text-aqua-900/60">What are you seeing?</p>

      {/* Location */}
      <section className="aqua-card mt-6 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-700">1. Location</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <button
              onClick={() => setPickerOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-aqua-100 bg-aqua-50 px-4 py-2.5 text-sm font-medium text-aqua-900"
            >
              <MapPin className="h-4 w-4 text-aqua-600" />
              {activeLocation?.name ?? "Choose location"}
              <ChevronDown className="h-3.5 w-3.5 text-aqua-900/40" />
            </button>
            {pickerOpen && (
              <div className="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-aqua-100 bg-white shadow-aqua-lg">
                {locations.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setLocationId(l.id);
                      setPickerOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-aqua-50 ${l.id === locationId ? "text-aqua-700 font-semibold" : "text-aqua-900/80"}`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleUseMyLocation} disabled={locatingGPS || locations.length === 0} className="flex items-center gap-1.5 text-sm font-semibold text-aqua-600 hover:text-aqua-800 disabled:opacity-50">
            {locatingGPS ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crosshair className="h-3.5 w-3.5" />}
            Use My Location
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="aqua-card mt-4 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-700">2. What do you observe?</p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c) => {
            const active = categories.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center text-xs font-medium transition-all duration-200 ${
                  active
                    ? "border-aqua-500 bg-aqua-50 text-aqua-800 shadow-aqua"
                    : "border-aqua-100 bg-white text-aqua-900/70 hover:-translate-y-0.5 hover:border-aqua-200 hover:shadow-aqua"
                }`}
              >
                <c.icon className={`h-5 w-5 ${active ? "text-aqua-600" : "text-aqua-400"}`} />
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Evidence */}
      <section className="aqua-card mt-4 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-700">3. Add evidence</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-aqua-100 bg-white px-4 py-3 text-sm font-medium text-aqua-800 hover:bg-aqua-50"
          >
            <Camera className="h-4 w-4" /> Take Photo
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-aqua-100 bg-white px-4 py-3 text-sm font-medium text-aqua-800 hover:bg-aqua-50"
          >
            <Upload className="h-4 w-4" /> Upload Photo
          </button>
        </div>
        {photoName && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-aqua-50 px-4 py-2.5 text-sm text-aqua-800">
            <span className="truncate">📷 {photoName}</span>
            <button onClick={() => setPhotoName(null)} aria-label="Remove photo" className="text-aqua-900/40 hover:text-aqua-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <p className="mt-2 text-xs text-aqua-900/40">Evidence adds +20 Impact Credits to a verified observation.</p>
      </section>

      {/* Description */}
      <section className="aqua-card mt-4 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-700">4. Anything else?</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe anything unusual you noticed..."
          rows={3}
          className="mt-3 w-full resize-none rounded-xl border border-aqua-100 bg-aqua-50/40 px-4 py-3 text-sm text-aqua-900 outline-none focus:border-aqua-500 focus:ring-2 focus:ring-aqua-100"
        />
      </section>

      {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>}

      <Button variant="primary" fullWidth className="mt-6" disabled={submitting} onClick={handleSubmit}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Observation"}
      </Button>
    </div>
  );
}
