import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addJob } from "@/lib/mock-data";

export const Route = createFileRoute("/recruiter/jobs/new")({
  head: () => ({
    meta: [
      { title: "New Job — AIHire Pro" },
      { name: "description", content: "Create a new role — title, description, required qualifications, and more." },
    ],
  }),
  component: NewJobPage,
});

function NewJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Remote · US");
  const [type, setType] = useState("Full-time");
  const [seniority, setSeniority] = useState("Senior");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState("");
  const [preferred, setPreferred] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !required.trim()) {
      toast.error("Please fill in title, description, and required qualifications.");
      return;
    }
    const req = required.split("\n").map((s) => s.trim()).filter(Boolean);
    const pref = preferred.split("\n").map((s) => s.trim()).filter(Boolean);
    const job = addJob({
      title: title.trim(),
      department: department.trim() || "General",
      location: location.trim() || "Remote",
      employmentType: type,
      status: "Draft",
      deadline: deadline || new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
      salary: salary.trim() || undefined,
      requiredSkills: req,
      preferredSkills: pref,
      experience: seniority,
      description: description.trim() + (responsibilities.trim() ? "\n\nResponsibilities:\n" + responsibilities.trim() : ""),
    });
    toast.success("Job created", { description: `${job.title} saved as Draft. Publish from the detail page.` });
    navigate({ to: "/recruiter/jobs/$jobId", params: { jobId: job.id } });
  };


  return (
    <div>
      <PageHeader
        eyebrow="New Role"
        title="Create a job"
        subtitle="Fill in the role explicitly. All fields are used by the agent to rank candidates and generate interview questions."
        actions={
          <Button variant="outline" className="gap-2" onClick={() => navigate({ to: "/recruiter/jobs" })}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel eyebrow="Basics" title="Role details">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <Label>Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="bg-brand-bg border-brand-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-brand-bg border-brand-border" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-brand-bg border-brand-border" />
              </div>
              <div className="space-y-2">
                <Label>Employment type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-brand-bg border-brand-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Seniority</Label>
                <Select value={seniority} onValueChange={setSeniority}>
                  <SelectTrigger className="bg-brand-bg border-brand-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Principal">Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Salary range</Label>
                <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="$160k – $210k" className="bg-brand-bg border-brand-border" />
              </div>
              <div className="space-y-2">
                <Label>Application deadline</Label>
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-brand-bg border-brand-border" />
              </div>
            </div>
          </Panel>

          <Panel eyebrow="About the role" title="Description *">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              placeholder="Describe the mission, team, and what success looks like."
              className="bg-brand-bg border-brand-border"
            />
          </Panel>

          <Panel eyebrow="Responsibilities" title="Day-to-day">
            <Textarea
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              rows={5}
              placeholder="One responsibility per line."
              className="bg-brand-bg border-brand-border font-mono text-xs"
            />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel eyebrow="Qualifications" title="Required *">
            <Textarea
              value={required}
              onChange={(e) => setRequired(e.target.value)}
              rows={6}
              placeholder={"React\nTypeScript\n5+ years experience\nSystem design"}
              className="bg-brand-bg border-brand-border font-mono text-xs"
            />
            <p className="mono-label mt-2">One skill / qualification per line</p>
          </Panel>

          <Panel eyebrow="Nice to have" title="Preferred">
            <Textarea
              value={preferred}
              onChange={(e) => setPreferred(e.target.value)}
              rows={4}
              placeholder={"GraphQL\nRust\nWeb3"}
              className="bg-brand-bg border-brand-border font-mono text-xs"
            />
          </Panel>

          <Button type="submit" className="w-full gap-2">
            <Save className="h-4 w-4" /> Create Job
          </Button>
        </div>
      </form>
    </div>
  );
}
