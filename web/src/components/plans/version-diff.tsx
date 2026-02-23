"use client";

interface VersionDiffProps {
  oldContent: string;
  newContent: string;
  oldVersion: number;
  newVersion: number;
}

export function VersionDiff({ oldContent, newContent, oldVersion, newVersion }: VersionDiffProps) {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  // Simple line-level diff
  const maxLen = Math.max(oldLines.length, newLines.length);
  const diffs: { old: string; new: string; type: "same" | "changed" | "added" | "removed" }[] = [];

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i] ?? "";
    const newLine = newLines[i] ?? "";

    if (oldLine === newLine) {
      diffs.push({ old: oldLine, new: newLine, type: "same" });
    } else if (!oldLine && newLine) {
      diffs.push({ old: "", new: newLine, type: "added" });
    } else if (oldLine && !newLine) {
      diffs.push({ old: oldLine, new: "", type: "removed" });
    } else {
      diffs.push({ old: oldLine, new: newLine, type: "changed" });
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 border-b bg-gray-50">
        <div className="px-4 py-2 text-sm font-medium text-gray-600 border-r">
          v{oldVersion}（旧版）
        </div>
        <div className="px-4 py-2 text-sm font-medium text-gray-600">
          v{newVersion}（新版）
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {diffs.map((d, i) => (
          <div key={i} className="grid grid-cols-2 text-xs font-mono">
            <div
              className={`px-4 py-0.5 border-r whitespace-pre-wrap ${
                d.type === "removed" || d.type === "changed"
                  ? "bg-red-50 text-red-800"
                  : "text-gray-700"
              }`}
            >
              {d.old}
            </div>
            <div
              className={`px-4 py-0.5 whitespace-pre-wrap ${
                d.type === "added" || d.type === "changed"
                  ? "bg-green-50 text-green-800"
                  : "text-gray-700"
              }`}
            >
              {d.new}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
