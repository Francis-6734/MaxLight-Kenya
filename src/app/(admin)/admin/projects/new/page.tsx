import { ProjectForm } from "@/components/admin/project-form";
import { createProjectAction } from "@/lib/actions/project-actions";

export default function NewProjectPage() {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
      <h1 className="mt-1 font-heading text-3xl">New Project</h1>
      <div className="mt-6">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  );
}
