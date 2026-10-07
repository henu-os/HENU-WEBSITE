"use client";

import React, { useState } from "react";
import {
  updateVisionMissionAction,
  addChapterAction,
  updateChapterAction,
  deleteChapterAction,
  reorderChaptersAction,
  addTimelineEntryAction,
  updateTimelineEntryAction,
  deleteTimelineEntryAction,
  reorderTimelineEntriesAction,
} from "@/server/actions/about.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/form-field";
import type { AboutContent, AboutChapter, TimelineEntry } from "@/types/domain";

interface AboutEditorClientProps {
  initialContent: AboutContent;
}

export function AboutEditorClient({ initialContent }: AboutEditorClientProps) {
  const [content, setContent] = useState<AboutContent>(initialContent);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Vision & Mission local state
  const [visionStatement, setVisionStatement] = useState(content.vision_statement);
  const [missionStatement, setMissionStatement] = useState(content.mission_statement);

  // Chapter Modal / Form state
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterForm, setChapterForm] = useState({
    chapter_number: "",
    title: "",
    subtitle: "",
    content: "",
    tags: "",
    status: "published" as "published" | "draft",
  });

  // Timeline Modal / Form state
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [timelineForm, setTimelineForm] = useState({
    year: "",
    date_formatted: "",
    title: "",
    description: "",
    verified_source: "",
    verified_owner: "",
    status: "published" as "published" | "draft",
  });

  const chapters = (Array.isArray(content.chapters)
    ? content.chapters
    : []) as unknown as AboutChapter[];

  const timelineEntries = (Array.isArray(content.timeline_entries)
    ? content.timeline_entries
    : []) as unknown as TimelineEntry[];

  // --- 1. Vision & Mission Save ---
  const handleSaveVisionMission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await updateVisionMissionAction({
      vision_statement: visionStatement,
      mission_statement: missionStatement,
    });

    setIsSaving(false);
    if (res.success && res.data) {
      setContent(res.data);
      setMessage({ text: "Vision & Mission statements updated.", type: "success" });
    } else {
      setMessage({ text: res.error ?? "Failed to save vision and mission.", type: "error" });
    }
  };

  // --- 2. Chapter Operations ---
  const handleOpenAddChapter = () => {
    setEditingChapterId(null);
    setChapterForm({
      chapter_number: `0${chapters.length + 1}`,
      title: "",
      subtitle: "",
      content: "",
      tags: "",
      status: "published",
    });
    setShowChapterForm(true);
  };

  const handleOpenEditChapter = (chap: AboutChapter) => {
    setEditingChapterId(chap.id);
    setChapterForm({
      chapter_number: chap.chapter_number,
      title: chap.title,
      subtitle: chap.subtitle || "",
      content: chap.content,
      tags: (chap.tags || []).join(", "),
      status: chap.status,
    });
    setShowChapterForm(true);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const tagsArray = chapterForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      chapter_number: chapterForm.chapter_number,
      title: chapterForm.title,
      subtitle: chapterForm.subtitle || undefined,
      content: chapterForm.content,
      tags: tagsArray,
      status: chapterForm.status,
    };

    let res;
    if (editingChapterId) {
      res = await updateChapterAction(editingChapterId, payload);
    } else {
      res = await addChapterAction(payload);
    }

    setIsSaving(false);
    if (res.success && res.data) {
      setContent(res.data);
      setShowChapterForm(false);
      setMessage({
        text: editingChapterId ? "Chapter updated successfully." : "Chapter created successfully.",
        type: "success",
      });
    } else {
      setMessage({ text: res.error ?? "Failed to save chapter.", type: "error" });
    }
  };

  const handleDeleteChapter = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete chapter "${title}"?`)) return;
    setIsSaving(true);
    const res = await deleteChapterAction(id);
    setIsSaving(false);
    if (res.success && res.data) {
      setContent(res.data);
      setMessage({ text: "Chapter deleted.", type: "success" });
    } else {
      setMessage({ text: res.error ?? "Failed to delete chapter.", type: "error" });
    }
  };

  const handleMoveChapter = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;

    const list = [...chapters];
    const item = list[index]!;
    list.splice(index, 1);
    list.splice(targetIndex, 0, item);

    const orderedIds = list.map((c) => c.id);
    const res = await reorderChaptersAction(orderedIds);
    if (res.success && res.data) {
      setContent(res.data);
    }
  };

  // --- 3. Timeline Operations ---
  const handleOpenAddTimeline = () => {
    setEditingTimelineId(null);
    setTimelineForm({
      year: new Date().getFullYear().toString(),
      date_formatted: "",
      title: "",
      description: "",
      verified_source: "",
      verified_owner: "",
      status: "published",
    });
    setShowTimelineForm(true);
  };

  const handleOpenEditTimeline = (item: TimelineEntry) => {
    setEditingTimelineId(item.id);
    setTimelineForm({
      year: item.year,
      date_formatted: item.date_formatted || "",
      title: item.title,
      description: item.description,
      verified_source: item.verified_source,
      verified_owner: item.verified_owner,
      status: item.status,
    });
    setShowTimelineForm(true);
  };

  const handleSaveTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const payload = {
      year: timelineForm.year,
      date_formatted: timelineForm.date_formatted || undefined,
      title: timelineForm.title,
      description: timelineForm.description,
      verified_source: timelineForm.verified_source,
      verified_owner: timelineForm.verified_owner,
      status: timelineForm.status,
    };

    let res;
    if (editingTimelineId) {
      res = await updateTimelineEntryAction(editingTimelineId, payload);
    } else {
      res = await addTimelineEntryAction(payload);
    }

    setIsSaving(false);
    if (res.success && res.data) {
      setContent(res.data);
      setShowTimelineForm(false);
      setMessage({
        text: editingTimelineId ? "Timeline milestone updated." : "Timeline milestone created.",
        type: "success",
      });
    } else {
      setMessage({ text: res.error ?? "Failed to save timeline milestone.", type: "error" });
    }
  };

  const handleDeleteTimeline = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete milestone "${title}"?`)) return;
    setIsSaving(true);
    const res = await deleteTimelineEntryAction(id);
    setIsSaving(false);
    if (res.success && res.data) {
      setContent(res.data);
      setMessage({ text: "Timeline milestone deleted.", type: "success" });
    } else {
      setMessage({ text: res.error ?? "Failed to delete timeline milestone.", type: "error" });
    }
  };

  const handleMoveTimeline = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timelineEntries.length) return;

    const list = [...timelineEntries];
    const item = list[index]!;
    list.splice(index, 1);
    list.splice(targetIndex, 0, item);

    const orderedIds = list.map((t) => t.id);
    const res = await reorderTimelineEntriesAction(orderedIds);
    if (res.success && res.data) {
      setContent(res.data);
    }
  };

  return (
    <div className="space-y-12">
      {message && (
        <div
          role="alert"
          className={`p-4 rounded-lg font-mono text-xs ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 1. Vision & Mission Form */}
      <section className="border border-border-default rounded-xl p-6 bg-surface-primary space-y-6">
        <div className="border-b border-border-default pb-3">
          <h2 className="font-serif text-xl text-ink-primary font-normal">
            Institutional Vision & Mission Statements
          </h2>
          <p className="font-sans text-xs text-ink-secondary">
            High-level statements defining sovereign purpose and institutional durability.
          </p>
        </div>

        <form onSubmit={handleSaveVisionMission} className="space-y-4">
          <FormField
            id="vision_statement"
            label="Vision Statement *"
            hint="Defines the enduring sovereign goal."
          >
            <textarea
              id="vision_statement"
              name="vision_statement"
              rows={3}
              required
              value={visionStatement}
              onChange={(e) => setVisionStatement(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border-default bg-surface-primary text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-pine min-h-[44px]"
            />
          </FormField>

          <FormField
            id="mission_statement"
            label="Mission Statement *"
            hint="Defines the operational execution strategy."
          >
            <textarea
              id="mission_statement"
              name="mission_statement"
              rows={3}
              required
              value={missionStatement}
              onChange={(e) => setMissionStatement(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border-default bg-surface-primary text-ink-primary font-sans text-sm focus:outline-none focus:ring-2 focus:ring-accent-pine min-h-[44px]"
            />
          </FormField>

          <div className="pt-2">
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Statements"}
            </Button>
          </div>
        </form>
      </section>

      {/* 2. Narrative Chapters Management */}
      <section className="border border-border-default rounded-xl p-6 bg-surface-primary space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
          <div>
            <h2 className="font-serif text-xl text-ink-primary font-normal">
              Storytelling Chapters ({chapters.length})
            </h2>
            <p className="font-sans text-xs text-ink-secondary">
              Ordered editorial chapters describing origin, ecosystem architecture, craft, and pathways.
            </p>
          </div>
          <Button type="button" variant="primary" onClick={handleOpenAddChapter}>
            + Add Chapter
          </Button>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-ink-muted">
            No chapters configured. Click &quot;Add Chapter&quot; to begin.
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((chap, idx) => (
              <div
                key={chap.id}
                className="border border-border-default rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-secondary/30"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent-pine">
                      {chap.chapter_number}
                    </span>
                    <h3 className="font-serif text-base text-ink-primary font-semibold">
                      {chap.title}
                    </h3>
                    <Badge variant={chap.status === "published" ? "success" : "neutral"} size="sm">
                      {chap.status}
                    </Badge>
                  </div>
                  {chap.subtitle && (
                    <div className="font-mono text-[11px] text-ink-muted">{chap.subtitle}</div>
                  )}
                  <p className="font-sans text-xs text-ink-secondary line-clamp-2">
                    {chap.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label={`Move chapter ${chap.title} up`}
                    disabled={idx === 0}
                    onClick={() => handleMoveChapter(idx, "up")}
                    className="p-2 border border-border-default rounded text-xs hover:bg-surface-elevated disabled:opacity-30 min-w-[36px] min-h-[36px]"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    aria-label={`Move chapter ${chap.title} down`}
                    disabled={idx === chapters.length - 1}
                    onClick={() => handleMoveChapter(idx, "down")}
                    className="p-2 border border-border-default rounded text-xs hover:bg-surface-elevated disabled:opacity-30 min-w-[36px] min-h-[36px]"
                  >
                    &darr;
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditChapter(chap)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteChapter(chap.id, chap.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Chapter Form Modal / Drawer */}
      {showChapterForm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-sm"
        >
          <div className="w-full max-w-xl bg-surface-primary border border-border-default rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border-default pb-3">
              <h3 className="font-serif text-xl text-ink-primary">
                {editingChapterId ? "Edit Chapter" : "New Storytelling Chapter"}
              </h3>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField id="chap_num" label="Number *">
                  <input
                    id="chap_num"
                    required
                    value={chapterForm.chapter_number}
                    onChange={(e) =>
                      setChapterForm({ ...chapterForm, chapter_number: e.target.value })
                    }
                    placeholder="01"
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField id="chap_status" label="Status *">
                    <select
                      id="chap_status"
                      value={chapterForm.status}
                      onChange={(e) =>
                        setChapterForm({
                          ...chapterForm,
                          status: e.target.value as "published" | "draft",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                    >
                      <option value="published">Published (Public)</option>
                      <option value="draft">Draft (Private)</option>
                    </select>
                  </FormField>
                </div>
              </div>

              <FormField id="chap_title" label="Chapter Title *">
                <input
                  id="chap_title"
                  required
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                  placeholder="The Sovereign Computing Imperative"
                  className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                />
              </FormField>

              <FormField id="chap_subtitle" label="Subtitle (Optional)">
                <input
                  id="chap_subtitle"
                  value={chapterForm.subtitle}
                  onChange={(e) => setChapterForm({ ...chapterForm, subtitle: e.target.value })}
                  placeholder="Foundational Origin"
                  className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                />
              </FormField>

              <FormField id="chap_tags" label="Tags (Comma-separated)">
                <input
                  id="chap_tags"
                  value={chapterForm.tags}
                  onChange={(e) => setChapterForm({ ...chapterForm, tags: e.target.value })}
                  placeholder="Sovereignty, Architecture, Durability"
                  className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                />
              </FormField>

              <FormField id="chap_content" label="Chapter Narrative Body *">
                <textarea
                  id="chap_content"
                  rows={6}
                  required
                  value={chapterForm.content}
                  onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
                  placeholder="Detailed narrative describing this chapter..."
                  className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                />
              </FormField>

              <div className="pt-3 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowChapterForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Chapter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Verified Timeline Milestones Management */}
      <section className="border border-border-default rounded-xl p-6 bg-surface-primary space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
          <div>
            <h2 className="font-serif text-xl text-ink-primary font-normal">
              Verified Chronology Milestones ({timelineEntries.length})
            </h2>
            <p className="font-sans text-xs text-ink-secondary">
              Timeline entries require verifiable sources and internal owners (PRD §8 governance).
            </p>
          </div>
          <Button type="button" variant="primary" onClick={handleOpenAddTimeline}>
            + Add Milestone
          </Button>
        </div>

        {timelineEntries.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-ink-muted">
            No timeline milestones registered. Click &quot;Add Milestone&quot; to add a verified event.
          </div>
        ) : (
          <div className="space-y-4">
            {timelineEntries.map((item, idx) => (
              <div
                key={item.id}
                className="border border-border-default rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-secondary/30"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent-pine">
                      {item.date_formatted || item.year}
                    </span>
                    <h3 className="font-serif text-base text-ink-primary font-semibold">
                      {item.title}
                    </h3>
                    <Badge variant={item.status === "published" ? "success" : "neutral"} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="font-sans text-xs text-ink-secondary line-clamp-2">
                    {item.description}
                  </p>
                  <div className="font-mono text-[11px] text-ink-muted flex flex-wrap gap-x-4 pt-1">
                    <span>Source: {item.verified_source}</span>
                    <span>Owner: {item.verified_owner}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label={`Move milestone ${item.title} up`}
                    disabled={idx === 0}
                    onClick={() => handleMoveTimeline(idx, "up")}
                    className="p-2 border border-border-default rounded text-xs hover:bg-surface-elevated disabled:opacity-30 min-w-[36px] min-h-[36px]"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    aria-label={`Move milestone ${item.title} down`}
                    disabled={idx === timelineEntries.length - 1}
                    onClick={() => handleMoveTimeline(idx, "down")}
                    className="p-2 border border-border-default rounded text-xs hover:bg-surface-elevated disabled:opacity-30 min-w-[36px] min-h-[36px]"
                  >
                    &darr;
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditTimeline(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTimeline(item.id, item.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Timeline Form Modal / Drawer */}
      {showTimelineForm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-sm"
        >
          <div className="w-full max-w-xl bg-surface-primary border border-border-default rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border-default pb-3">
              <h3 className="font-serif text-xl text-ink-primary">
                {editingTimelineId ? "Edit Verified Milestone" : "New Verified Milestone"}
              </h3>
            </div>

            <form onSubmit={handleSaveTimeline} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField id="time_year" label="Year *">
                  <input
                    id="time_year"
                    required
                    value={timelineForm.year}
                    onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                  />
                </FormField>

                <FormField id="time_formatted" label="Date Label (e.g. Q3 2025)">
                  <input
                    id="time_formatted"
                    value={timelineForm.date_formatted}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, date_formatted: e.target.value })
                    }
                    placeholder="Q3 2025"
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                  />
                </FormField>

                <FormField id="time_status" label="Status *">
                  <select
                    id="time_status"
                    value={timelineForm.status}
                    onChange={(e) =>
                      setTimelineForm({
                        ...timelineForm,
                        status: e.target.value as "published" | "draft",
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </FormField>
              </div>

              <FormField id="time_title" label="Milestone Title *">
                <input
                  id="time_title"
                  required
                  value={timelineForm.title}
                  onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                  placeholder="Enterprise Housing ERP Deployment"
                  className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                />
              </FormField>

              <FormField id="time_desc" label="Description *">
                <textarea
                  id="time_desc"
                  rows={3}
                  required
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  placeholder="Operational details of this verified event..."
                  className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="time_source"
                  label="Verified Source Document *"
                  hint="Required by credibility governance."
                >
                  <input
                    id="time_source"
                    required
                    value={timelineForm.verified_source}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, verified_source: e.target.value })
                    }
                    placeholder="HENU Production Log Q3 2025"
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                  />
                </FormField>

                <FormField
                  id="time_owner"
                  label="Internal Verified Owner *"
                  hint="Staff member verifying this event."
                >
                  <input
                    id="time_owner"
                    required
                    value={timelineForm.verified_owner}
                    onChange={(e) =>
                      setTimelineForm({ ...timelineForm, verified_owner: e.target.value })
                    }
                    placeholder="HENU Operations Lead"
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-ink-primary text-sm min-h-[44px]"
                  />
                </FormField>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTimelineForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Milestone"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
