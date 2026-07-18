import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProjectAction } from "@/lib/actions/project-actions";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
      <h1 className="mt-1 font-heading text-3xl">Edit Project</h1>
      <div className="mt-6">
        <ProjectForm action={updateProjectAction.bind(null, project.id)} initialValues={project} />
      </div>
    </div>
  );
}
