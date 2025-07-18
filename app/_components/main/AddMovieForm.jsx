"use client";
import { useState, useRef } from "react";
import supabase from "@/app/_lib/supabase"; // <-- USE YOUR SHARED CLIENT
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function splitToArr(val) {
  if (typeof val === "string")
    return val
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  return Array.isArray(val) ? val : [];
}

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

const DEFAULT_DOWNLOAD_LINKS = [
  { label: "720p", url: "", redirectCount: 3 },
  { label: "1080p", url: "", redirectCount: 3 },
];

export default function AddMovieForm() {
  const [form, setForm] = useState({
    title: "",
    releaseDate: "",
    duration: "",
    languages: "",
    quality: "",
    summary: "",
    genres: "",
    tags: "",
    cast: "",
    isDubbed: false,
    imdbRating: "",
    demand: "",
    trailer: "",
    poster: null, // file
    screenshots: [], // array of files
    downloadLinks: [...DEFAULT_DOWNLOAD_LINKS],
  });
  const [loading, setLoading] = useState(false);

  const screenshotInputRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      if (name === "poster") {
        setForm((f) => ({ ...f, poster: files[0] }));
      } else if (name === "screenshots") {
        setForm((f) => ({ ...f, screenshots: Array.from(files) }));
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleDownloadLinkChange = (idx, field, value) => {
    setForm((f) => {
      const arr = [...f.downloadLinks];
      arr[idx][field] = field === "redirectCount" ? parseInt(value) : value;
      return { ...f, downloadLinks: arr };
    });
  };

  // ---- File upload helpers ----
  const uploadToStorage = async (bucket, file) => {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(-6)}.${ext}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { upsert: false });
    if (error) throw error;

    // getPublicUrl always returns valid data, even if bucket is public:
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return data.publicUrl;
  };

  function validate() {
    if (!form.title || form.title.length < 2) return "Title is required";
    if (!form.poster) return "Poster image is required";
    if (!form.releaseDate) return "Release date required";
    if (!form.duration) return "Duration required";
    if (!form.summary || form.summary.length < 30)
      return "Summary must be at least 30 chars";
    if (!form.downloadLinks.every((dl) => dl.label && isValidUrl(dl.url)))
      return "Download links and URLs required & must be valid";
    if (!form.languages) return "At least 1 language required";
    if (!form.quality) return "At least 1 quality required";
    if (!form.genres) return "At least 1 genre required";
    if (!form.tags) return "At least 1 tag required";
    if (!form.cast) return "At least 1 cast member required";
    if (form.imdbRating && (form.imdbRating < 0 || form.imdbRating > 10))
      return "IMDb rating must be 0-10";
    if (
      form.poster &&
      !["jpg", "jpeg", "png", "webp"].includes(
        form.poster.name.split(".").pop().toLowerCase()
      )
    ) {
      return "Poster should be jpg, jpeg, png, or webp";
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    setLoading(true);
    try {
      // upload poster
      let posterUrl;
      if (form.poster) {
        posterUrl = await uploadToStorage("poster-image", form.poster);
      }

      // upload screenshots
      let screenshotUrls = [];
      if (form.screenshots && form.screenshots.length) {
        screenshotUrls = await Promise.all(
          form.screenshots.map((file) =>
            uploadToStorage("screenshots-image", file)
          )
        );
      }

      const payload = {
        title: form.title.trim(),
        poster: posterUrl || "",
        releaseDate: new Date(form.releaseDate).toISOString(),
        duration: form.duration.trim(),
        languages: splitToArr(form.languages),
        quality: splitToArr(form.quality),
        summary: form.summary.trim(),
        genres: splitToArr(form.genres),
        tags: splitToArr(form.tags),
        cast: splitToArr(form.cast),
        isDubbed: form.isDubbed,
        imdbRating: form.imdbRating !== "" ? Number(form.imdbRating) : 0,
        demand: form.demand !== "" ? Number(form.demand) : 0,
        screenshots: screenshotUrls,
        trailer: form.trailer.trim(),
        downloadLinks: form.downloadLinks.map((dl) => ({
          label: dl.label.trim(),
          url: dl.url.trim(),
          redirectCount:
            typeof dl.redirectCount === "number"
              ? dl.redirectCount
              : parseInt(dl.redirectCount || "3"),
        })),
      };

      const resp = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(t || "Failed to submit movie");
      }
      toast.success("Movie uploaded successfully!");
      setForm({
        title: "",
        releaseDate: "",
        duration: "",
        languages: "",
        quality: "",
        summary: "",
        genres: "",
        tags: "",
        cast: "",
        isDubbed: false,
        imdbRating: "",
        demand: "",
        trailer: "",
        poster: null,
        screenshots: [],
        downloadLinks: [...DEFAULT_DOWNLOAD_LINKS],
      });
      if (screenshotInputRef.current) screenshotInputRef.current.value = "";
    } catch (err) {
      toast.error("Error: " + (err.message || err));
    }
    setLoading(false);
  };

  return (
    <form
      className="max-w-2xl mx-auto mt-12 bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-5"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4 text-pink-400">Add New Movie</h2>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="Movie Title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="poster">Poster image (.jpg/.webp/.png)</Label>
        <Input
          type="file"
          id="poster"
          accept=".jpg,.jpeg,.png,.webp"
          name="poster"
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="screenshots">Screenshots (multiple allowed)</Label>
        <Input
          type="file"
          id="screenshots"
          accept=".jpg,.jpeg,.png,.webp"
          name="screenshots"
          multiple
          ref={screenshotInputRef}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="releaseDate">Release Date</Label>
          <Input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={form.releaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="duration">Duration</Label>
          <Input
            type="text"
            id="duration"
            name="duration"
            placeholder="e.g. 2h 10m"
            value={form.duration}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="languages">Languages (comma-separated)</Label>
        <Input
          type="text"
          id="languages"
          name="languages"
          placeholder="English, Hindi, Japanese"
          value={form.languages}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="quality">Quality (comma-separated)</Label>
        <Input
          type="text"
          id="quality"
          name="quality"
          placeholder="720p, 1080p, WebRip"
          value={form.quality}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="genres">Genres (comma-separated)</Label>
        <Input
          type="text"
          id="genres"
          name="genres"
          placeholder="Action, Adventure"
          value={form.genres}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          type="text"
          id="tags"
          name="tags"
          placeholder="Thriller, Hacker, Espionage"
          value={form.tags}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="cast">Cast (comma-separated)</Label>
        <Input
          type="text"
          id="cast"
          name="cast"
          placeholder="Lisa Brooks, David Kim"
          value={form.cast}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          placeholder="Describe the movie..."
          value={form.summary}
          minLength={30}
          maxLength={400}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="trailer">Trailer URL (optional)</Label>
          <Input
            id="trailer"
            name="trailer"
            placeholder="https://youtube.com/..."
            value={form.trailer}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="imdbRating">IMDb Rating (0-10, optional)</Label>
          <Input
            id="imdbRating"
            name="imdbRating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="e.g. 8.5"
            value={form.imdbRating}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="demand">Demand (0-10, optional)</Label>
          <Input
            id="demand"
            name="demand"
            type="number"
            min="0"
            max="10"
            placeholder="e.g. 6"
            value={form.demand}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Switch
          checked={form.isDubbed}
          onCheckedChange={(v) => setForm((f) => ({ ...f, isDubbed: v }))}
          id="isDubbed"
        />
        <Label htmlFor="isDubbed">Is Dubbed?</Label>
      </div>
      <div>
        <h3 className="font-semibold text-lg mt-2 mb-2">Download Links</h3>
        <div className="flex flex-col gap-2">
          {form.downloadLinks.map((dl, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                className="w-28"
                placeholder="Label (e.g. 720p)"
                value={dl.label}
                onChange={(e) =>
                  handleDownloadLinkChange(idx, "label", e.target.value)
                }
                required
              />
              <Input
                className="flex-1"
                placeholder="Download URL"
                value={dl.url}
                onChange={(e) =>
                  handleDownloadLinkChange(idx, "url", e.target.value)
                }
                required
              />
              <Input
                className="w-20"
                type="number"
                min={1}
                max={5}
                placeholder="Redirects"
                value={dl.redirectCount}
                onChange={(e) =>
                  handleDownloadLinkChange(idx, "redirectCount", e.target.value)
                }
                required
              />
            </div>
          ))}
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-pink-700 hover:bg-pink-600 text-white font-semibold"
      >
        {loading ? "Uploading..." : "Add Movie"}
      </Button>
    </form>
  );
}
