import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DesignerForm } from "@/components/admin/designer-form";
import { updateDesignerAction } from "@/lib/actions/designer-actions";

export default async function EditDesignerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const designer = await db.designer.findUnique({ where: { id } });
  if (!designer) notFound();

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
      <h1 className="mt-1 font-heading text-3xl">Edit Designer</h1>
      <div className="mt-6">
        <DesignerForm action={updateDesignerAction.bind(null, designer.id)} initialValues={designer} />
      </div>
    </div>
  );
}
