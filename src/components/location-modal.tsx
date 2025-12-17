"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from "@/components/ui/dialog";

export interface Venue {
  id: string;
  name: string;
  address: string;
  placeId?: string;
  // Additional venue details
  capacity?: string;
  city?: string;
  state?: string;
  zip?: string;
  image?: string;
  description?: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    x?: string;
  };
}

export interface LocationData {
  address: string;
  venue?: Venue;
}

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: LocationData | null;
  onChange: (value: LocationData | null) => void;
  savedVenues: Venue[];
  onSaveVenue: (venue: Venue) => void;
}

// Mock Google Places results
const mockGoogleResults = [
  {
    placeId: "google_1",
    address: "123 Main Street, San Francisco, CA 94102",
  },
  {
    placeId: "google_2",
    address: "456 Market Street, San Francisco, CA 94103",
  },
  {
    placeId: "google_3",
    address: "789 Mission Street, San Francisco, CA 94105",
  },
  {
    placeId: "google_4",
    address: "321 Howard Street, San Francisco, CA 94107",
  },
  {
    placeId: "google_5",
    address: "555 California Street, San Francisco, CA 94104",
  },
];

export function LocationModal({
  open,
  onOpenChange,
  value,
  onChange,
  savedVenues,
  onSaveVenue,
}: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(true);
  const [savingVenueId, setSavingVenueId] = useState<string | null>(null);
  const [venueName, setVenueName] = useState("");

  // Show saved venues only when not searching
  const showSavedVenues = !searchQuery.trim();

  // Filter mock Google results based on search (only show when there's a query)
  const googleResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return mockGoogleResults.filter((result) =>
      result.address.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectVenue = (venue: Venue) => {
    onChange({
      address: venue.address,
      venue,
    });
    onOpenChange(false);
    resetState();
  };

  const handleSelectGoogleResult = (result: {
    placeId: string;
    address: string;
  }) => {
    onChange({
      address: result.address,
    });
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setSearchQuery("");
    setIsSearchFocused(true);
    setSavingVenueId(null);
    setVenueName("");
  };

  const handleStartSaveVenue = (placeId: string) => {
    setSavingVenueId(placeId);
    setVenueName("");
  };

  const handleCancelSaveVenue = () => {
    setSavingVenueId(null);
    setVenueName("");
  };

  const handleConfirmSaveVenue = (placeId: string, address: string) => {
    if (!venueName.trim()) return;

    const newVenue: Venue = {
      id: `venue_${Date.now()}`,
      name: venueName.trim(),
      address,
      placeId,
    };

    onSaveVenue(newVenue);
    onChange({
      address,
      venue: newVenue,
    });
    onOpenChange(false);
    resetState();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[460px] max-h-[85vh] flex flex-col max-w-[calc(100vw-16px)] min-h-[360px] w-full">
        <DialogHeader>
          <DialogTitle>Event Location</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="px-4 md:px-6 py-4 flex flex-col gap-2.5 flex-1 overflow-hidden w-full">
          {/* Search Input */}
          <div className="relative w-full">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-3.5 md:h-3.5 text-gray transition-opacity duration-200 ease ${
                isSearchFocused || searchQuery ? "opacity-0" : "opacity-100"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search for a location..."
              className={`w-full h-[47px] md:h-[43px] pr-4 text-base md:text-sm text-black placeholder:text-gray bg-transparent focus:outline-none border rounded-[14px] transition-all duration-200 ease ${
                isSearchFocused || searchQuery
                  ? "pl-4 border-tp-blue"
                  : "pl-10 border-border"
              }`}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-soft-gray rounded-full flex items-center justify-center hover:text-black text-dark-gray transition-colors duration-200 ease"
              >
                <X className="w-3 h-3 " />
              </button>
            )}
          </div>

          {/* Scrollable Results */}
          <div className="flex-1 overflow-y-auto -mx-6 px-6 flex flex-col gap-1 w-[calc(100%+3rem)]">
            {/* Saved Venues Section - hide when searching */}
            {showSavedVenues && savedVenues.length > 0 && (
              <div className="w-full">
                <span className="text-[10px] font-semibold text-gray uppercase tracking-wide">
                  Saved Venues
                </span>
                <div className="flex flex-col">
                  {savedVenues.map((venue) => (
                    <button
                      key={venue.id}
                      onClick={() => handleSelectVenue(venue)}
                      className="w-full text-left py-1.5 cursor-pointer group relative before:absolute before:inset-y-0 before:-inset-x-2.5 before:rounded-[12px] before:bg-transparent before:transition-colors before:duration-200 before:ease hover:before:bg-light-gray"
                    >
                      <div className="font-semibold text-sm text-black relative">
                        {venue.name}
                      </div>
                      <div className="text-xs text-dark-gray mt-px relative">
                        {venue.address}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Google Results Section */}
            <div>
              <span className="text-[10px] font-semibold text-gray uppercase tracking-wide">
                Search Results
              </span>
              {googleResults.length > 0 ? (
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {googleResults.map((result) => (
                      <motion.div
                        key={result.placeId}
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {savingVenueId === result.placeId ? (
                          /* Save as Venue Form */
                          <div className="py-3 relative before:absolute before:inset-y-0 before:-inset-x-3 before:rounded-[12px] before:bg-light-gray">
                            <div className="text-sm text-black mb-2 relative">
                              {result.address}
                            </div>
                            <input
                              type="text"
                              value={venueName}
                              onChange={(e) => setVenueName(e.target.value)}
                              placeholder="Enter venue name..."
                              className="relative w-full h-9 px-3 text-sm text-black placeholder:text-gray bg-white focus:outline-none border rounded-[10px] mb-2"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleConfirmSaveVenue(
                                    result.placeId,
                                    result.address
                                  );
                                } else if (e.key === "Escape") {
                                  handleCancelSaveVenue();
                                }
                              }}
                            />
                            <div className="flex gap-4 justify-end relative pr-1">
                              <button
                                onClick={handleCancelSaveVenue}
                                className="px-0 py-0 text-sm font-semibold text-dark-gray hover:text-black transition-colors duration-200 ease cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() =>
                                  handleConfirmSaveVenue(
                                    result.placeId,
                                    result.address
                                  )
                                }
                                disabled={!venueName.trim()}
                                className="px-0 py-0 text-sm font-semibold text-tp-blue hover:text-[#2288ee] transition-colors duration-200 ease cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Regular Result Item */
                          <div className="flex items-center py-1.5 group relative before:absolute before:inset-y-0 before:-inset-x-3 before:rounded-[12px] before:bg-transparent before:transition-colors before:duration-200 before:ease hover:before:bg-light-gray">
                            <button
                              onClick={() => handleSelectGoogleResult(result)}
                              className="flex-1 text-left cursor-pointer relative"
                            >
                              <div className="text-sm text-black">
                                {result.address}
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                handleStartSaveVenue(result.placeId)
                              }
                              className="relative hidden md:block opacity-0 group-hover:opacity-100 px-0 py-1 text-sm font-semibold text-tp-blue hover:text-opacity-80 transition-all duration-200 ease cursor-pointer shrink-0"
                            >
                              Save as venue
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="py-1">
                  <p className="text-xs text-gray">
                    {searchQuery
                      ? `No results found for "${searchQuery}"`
                      : "Start typing to search for a location"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
