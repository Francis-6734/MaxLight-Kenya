/** Renders a `<script type="application/ld+json">` block — safe since the payload is always our own generated data, never raw user input. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
