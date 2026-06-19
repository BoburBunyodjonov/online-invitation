"use client";

/* eslint-disable @next/next/no-img-element */
import { useTemplate } from "./TemplateContext";

export function PhotoGallery() {
  const { data } = useTemplate();
  if (!data.gallery?.length) return null;

  return (
    <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3">
      {data.gallery.map((src, i) => (
        <div
          key={i}
          className={`overflow-hidden rounded-2xl shadow-sm ${
            i % 3 === 0 ? "col-span-2 aspect-video" : "aspect-square"
          }`}
        >
          <img
            src={src}
            alt={`Gallery photo ${i + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
