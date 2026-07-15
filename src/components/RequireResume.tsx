import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Upload, ArrowRight } from "lucide-react";
import { useHasResume } from "@/lib/resume-store";
import { Panel } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export function RequireResume({
  feature,
  description,
  children,
}: {
  feature: string;
  description?: string;
  children: ReactNode;
}) {
  const has = useHasResume();
  if (has) return <>{children}</>;

  return (
    <Panel className="text-center py-14">
      <div className="mx-auto max-w-md flex flex-col items-center gap-4">
        <div className="grid place-items-center h-14 w-14 rounded-2xl bg-brand-accent/15 text-brand-accent">
          <FileText className="h-7 w-7" />
        </div>
        <div className="mono-label text-brand-warning">Resume required</div>
        <h2 className="text-xl font-semibold text-foreground">
          Upload your resume to use {feature}
        </h2>
        <p className="text-sm text-muted-foreground">
          {description ??
            `We need to know your skills, experience, and background before ${feature} can personalize results for you.`}
        </p>
        <Button asChild className="gap-2 mt-2">
          <Link to="/candidate/resume">
            <Upload className="h-4 w-4" /> Go to Resume Studio <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}
