import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t-2 border-accent py-7 font-mono text-xs text-mute">
      <div className="wrap flex justify-between flex-wrap gap-3">
        <span>
          © {new Date().getFullYear()} {site.name} · {site.location}
        </span>
        <span className="flex gap-2">
          <a className="hover:text-accent-text" href={site.links.linkedin}>linkedin</a>·
          <a className="hover:text-accent-text" href={site.links.github}>github</a>·
          <a className="hover:text-accent-text" href={site.links.email}>e-post</a>
        </span>
        <span>håndkodet · ingen sporing</span>
      </div>
    </footer>
  );
}
