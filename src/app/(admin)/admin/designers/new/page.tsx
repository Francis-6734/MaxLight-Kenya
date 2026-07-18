import { DesignerForm } from "@/components/admin/designer-form";
import { createDesignerAction } from "@/lib/actions/designer-actions";

export default function NewDesignerPage() {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Content</p>
      <h1 className="mt-1 font-heading text-3xl">New Designer</h1>
      <div className="mt-6">
        <DesignerForm action={createDesignerAction} />
      </div>
    </div>
  );
}
