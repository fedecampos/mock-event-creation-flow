"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface CapacityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}

export function CapacityModal({
  open,
  onOpenChange,
  value,
  onChange,
}: CapacityModalProps) {
  const [isLimited, setIsLimited] = useState(false);

  // Sync isLimited state when modal opens based on whether there's a value
  useEffect(() => {
    if (open) {
      setIsLimited(!!value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = () => {
    onOpenChange(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(numericValue);
  };

  const handleLimitToggle = (checked: boolean) => {
    setIsLimited(checked);
    if (!checked) {
      onChange("");
    }
  };

  const isSaveDisabled = isLimited && !value;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] max-w-[calc(100vw-16px)]">
        <DialogHeader>
          <DialogTitle>Event Capacity</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>

        <div className="px-4 md:px-6 py-4">
          <p className="text-base text-dark-gray mb-4">
            The capacity is shared across all ticket types linked to it.
          </p>

          <div className="flex items-center justify-between">
            <label
              htmlFor="limit-capacity"
              className="font-bold text-sm text-black"
            >
              Limit capacity
            </label>
            <Switch
              id="limit-capacity"
              checked={isLimited}
              onCheckedChange={handleLimitToggle}
            />
          </div>

          {isLimited && (
            <div className="flex flex-col gap-1.5 mt-4">
              <label className="font-bold text-sm text-black">Capacity</label>
              <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleInputChange}
                placeholder="1000"
                className="w-full h-[47px] md:h-[43px] px-4 text-base md:text-sm text-black placeholder:text-gray bg-transparent focus:outline-none border rounded-[14px]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pb-6 pt-2 px-4 md:px-6">
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="bg-tp-blue w-full cursor-pointer text-white font-bold text-base px-5 py-2.5 rounded-[36px] hover:bg-[#2288ee] transition-colors duration-200 ease active:scale-[0.98] transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
