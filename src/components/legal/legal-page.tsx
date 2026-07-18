export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated?: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container-max py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl text-balance">{title}</h1>
        {updated && <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>}
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-xl">{section.heading}</h2>
              <div className="mt-2 space-y-3 text-sm text-muted-foreground">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
