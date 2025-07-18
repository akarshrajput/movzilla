// models/movieModel.js
import mongoose from "mongoose";

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Movie must have a title"],
      minlength: [2, "Title must have at least 2 characters."],
      maxlength: [120, "Title must have less than 120 characters."],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    poster: {
      type: String,
      trim: true,
      required: [true, "Movie must have a poster"],
      default: "default-movie.jpg",
    },
    releaseDate: {
      type: Date,
      required: [true, "Movie must have a release date"],
    },
    duration: {
      type: String,
      trim: true,
      required: [true, "Movie must have a duration"],
      minlength: [2, "Duration must have at least 2 characters."],
      maxlength: [20, "Duration must have less than 20 characters."],
    },
    languages: {
      type: [String],
      required: [true, "Movie must have at least one language"],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Add at least one language",
      ],
    },
    quality: {
      type: [String],
      required: [true, "Movie must have at least one quality"],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Add at least one quality",
      ],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Movie must have a summary"],
      minlength: [30, "Summary must have more than 30 characters."],
      maxlength: [400, "Summary must have less than 400 characters."],
    },
    genres: {
      type: [String],
      required: [true, "Movie must have at least one genre"],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Add at least one genre",
      ],
    },
    tags: {
      type: [String],
      required: [true, "Movie must have at least one tag"],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Add at least one tag",
      ],
    },
    cast: {
      type: [String],
      required: [true, "Movie must have at least one cast member"],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Add at least one cast member",
      ],
    },
    isDubbed: {
      type: Boolean,
      default: false,
    },
    downloadLinks: {
      type: [
        {
          label: {
            type: String,
            required: [true, "Download link must have a label (e.g., '720p')"],
            trim: true,
            minlength: [2, "Label must have at least 2 characters."],
            maxlength: [20, "Label must have less than 20 characters."],
          },
          url: {
            type: String,
            required: [true, "Download link must have a URL"],
            trim: true,
            minlength: [10, "URL must have at least 10 characters."],
            maxlength: [500, "URL must have less than 500 characters."],
          },
          redirectCount: {
            type: Number,
            default: 3,
            min: [1, "Redirect count can't be less than 1"],
            max: [5, "Redirect count can't be more than 5"],
          },
        },
      ],
      default: [
        {
          label: "720p",
          url: "https://static-download.example.com/movie-720p.mp4",
          redirectCount: 3,
        },
        {
          label: "1080p",
          url: "https://static-download.example.com/movie-1080p.mp4",
          redirectCount: 3,
        },
      ],
      validate: [
        (arr) => Array.isArray(arr) && arr.length === 2,
        "There must be exactly 2 download links.",
      ],
    },
    views: {
      type: Number,
      default: 0,
    },
    demand: {
      type: Number,
      default: 0,
      min: [0, "Demand can't be negative"],
      max: [10, "Demand can't be more than 10"],
    },
    imdbRating: {
      type: Number,
      min: [0, "IMDb rating can't be below 0"],
      max: [10, "IMDb rating can't be above 10"],
      default: 0,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    trailer: {
      type: String,
      trim: true,
      maxlength: [300, "Trailer link must have less than 300 characters."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual: Read time estimate based on summary & tags & cast (silly example)
MovieSchema.virtual("infoLength").get(function () {
  if (!this.summary) return 0;
  return (
    Math.ceil(this.summary.split(/\s+/).length / 200) +
    Math.ceil((this.cast?.length || 0) / 10) +
    Math.ceil((this.tags?.length || 0) / 50)
  );
});

// Slug generation
MovieSchema.pre("save", function (next) {
  if (this.title && this.isModified("title")) {
    const slugBase = this.title
      .trim()
      .toLowerCase()
      .replace(/[\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    this.slug = `${slugBase}-${
      this._id?.toString().slice(-6) || Math.floor(Math.random() * 1000000)
    }`;
  }
  next();
});

const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

export default Movie;
