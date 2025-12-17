"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogCloseButton,
} from "@/components/ui/dialog";
import type { Venue } from "./location-modal";

interface VenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVenue: (venue: Venue) => void;
}

export function VenueModal({
  open,
  onOpenChange,
  onCreateVenue,
}: VenueModalProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [xHandle, setXHandle] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setCapacity("");
    setLocation("");
    setImage(null);
    setDescription("");
    setInstagram("");
    setFacebook("");
    setXHandle("");
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    const newVenue: Venue = {
      id: `venue_${Date.now()}`,
      name: name.trim(),
      address: location,
      capacity: capacity || undefined,
      image: image || undefined,
      description: description || undefined,
      socials:
        instagram || facebook || xHandle
          ? {
              instagram: instagram || undefined,
              facebook: facebook || undefined,
              x: xHandle || undefined,
            }
          : undefined,
    };

    onCreateVenue(newVenue);
    resetForm();
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setCapacity(numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col max-w-[calc(100vw-16px)]">
        <DialogHeader>
          <DialogTitle>New Venue</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          <div className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Venue name"
                className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white focus:outline-none border border-border focus:border-tp-blue rounded-[16px] transition-colors duration-200 ease"
              />
            </div>

            {/* Capacity */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">Capacity</label>
              <input
                type="text"
                inputMode="numeric"
                value={capacity}
                onChange={handleCapacityChange}
                placeholder="Enter capacity"
                className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white focus:outline-none border border-border focus:border-tp-blue rounded-[16px] transition-colors duration-200 ease"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search for a location..."
                className="w-full h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white focus:outline-none border border-border focus:border-tp-blue rounded-[16px] transition-colors duration-200 ease"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {image ? (
                <div className="relative rounded-[16px] overflow-hidden">
                  <img
                    src={image}
                    alt="Venue"
                    className="w-full h-[120px] object-cover"
                  />
                  <button
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-xs transition-colors duration-200 ease cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="w-full bg-light-gray border-[1.5px] border-dashed border-border rounded-[16px] p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-gray transition-colors duration-200 ease"
                >
                  <Upload className="w-8 h-8 text-gray" />
                  <p className="text-xs text-dark-gray">
                    <span className="text-black underline">
                      Click to upload
                    </span>{" "}
                    or drag and drop a file
                  </p>
                  <p className="text-[10px] text-dark-gray">
                    Maximum file size: <span className="text-black">10mb</span>
                  </p>
                </button>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-black">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this venue..."
                rows={4}
                className="w-full px-4 py-3 text-sm text-black placeholder:text-gray bg-white focus:outline-none border border-border focus:border-tp-blue rounded-[16px] resize-none transition-colors duration-200 ease"
              />
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-3">
              <label className="font-bold text-sm text-black">Socials</label>
              <div className="flex flex-col gap-2">
                {/* Instagram */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="18" cy="6" r="1" fill="currentColor" />
                  </svg>
                  <div className="flex flex-1 items-center">
                    <div className="bg-soft-gray h-[47px] px-4 flex items-center rounded-l-[16px] shrink-0">
                      <span className="text-sm font-semibold text-dark">
                        instagram.com/
                      </span>
                    </div>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="username"
                      className="flex-1 h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white focus:outline-none border border-l-0 border-border focus:border-tp-blue rounded-r-[16px] transition-colors duration-200 ease"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  <div className="flex flex-1 items-center">
                    <div className="bg-soft-gray h-[47px] px-4 flex items-center rounded-l-[16px] shrink-0">
                      <span className="text-sm font-semibold text-dark">
                        facebook.com/
                      </span>
                    </div>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="username"
                      className="flex-1 h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white focus:outline-none border border-l-0 border-border focus:border-tp-blue rounded-r-[16px] transition-colors duration-200 ease"
                    />
                  </div>
                </div>

                {/* X (Twitter) */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <div className="flex flex-1 items-center">
                    <div className="bg-soft-gray h-[47px] px-4 flex items-center rounded-l-[16px] shrink-0">
                      <span className="text-sm font-semibold text-dark">
                        x.com/
                      </span>
                    </div>
                    <input
                      type="text"
                      value={xHandle}
                      onChange={(e) => setXHandle(e.target.value)}
                      placeholder="username"
                      className="flex-1 h-[47px] px-4 text-sm text-black placeholder:text-gray bg-white focus:outline-none border border-l-0 border-border focus:border-tp-blue rounded-r-[16px] transition-colors duration-200 ease"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-4">
          <button
            onClick={handleCancel}
            className="bg-light-gray text-black font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-soft-gray transition-colors duration-200 ease cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="bg-tp-blue text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
