import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Button } from "./button";

type Option = { label: string; value: string };

type SelectWithCreateProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  onCreateOption: (val: string) => Promise<boolean>; // Returns true if created successfully
  createModalTitle?: string;
};

export function SelectWithCreate({
  label,
  placeholder = "Select...",
  options,
  value,
  onChange,
  onCreateOption,
  createModalTitle = "Create New",
}: SelectWithCreateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createValue, setCreateValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearch("");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createValue.trim()) return;
    setIsCreating(true);
    const success = await onCreateOption(createValue.trim());
    setIsCreating(false);
    if (success) {
      setIsCreateOpen(false);
      setCreateValue("");
      onChange(createValue.trim());
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <div
        className="flex min-h-10 w-full items-center justify-between rounded-xl border border-border bg-white px-3 py-2 text-sm ring-offset-background cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-ink" : "text-muted"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className="h-4 w-4 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-white p-1 shadow-md">
          <div className="p-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="h-8"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pl-3 pr-2 text-sm outline-none hover:bg-canvas"
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="py-2 text-center text-sm text-muted">
                No results found.
              </div>
            )}
          </div>
          <div className="border-t border-border mt-1 p-1">
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-brand hover:bg-canvas"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsCreateOpen(true);
                setCreateValue(search);
              }}
            >
              + Create new
            </button>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-ink">
              {createModalTitle}
            </h3>
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4 space-y-2">
                <Label>Name</Label>
                <Input
                  value={createValue}
                  onChange={(e) => setCreateValue(e.target.value)}
                  placeholder="Enter name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
