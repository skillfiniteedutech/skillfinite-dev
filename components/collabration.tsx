"use client"
import CursorArea from "./cursor-area"

export default function CollaborationDark() {
  // Color system (5 total):
  // 1) Primary: blue-400 (#60a5fa) - lighter for dark theme
  // 2-3-4) Neutrals: black, gray-100, gray-400
  // 5) Accent: emerald-400
  return (
    <section className="w-full bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {/* Label pill */}
        <div className="mb-3 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm hover:cursor-pointer hover:bg-muted transition-colors">
          Learning Community
        </div>

        {/* Heading + subcopy */}
        <h2 className="text-pretty text-2xl font-semibold text-foreground md:text-3xl hover:cursor-pointer">
          Join Our Thriving Learning Community
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground hover:cursor-pointer">
          Connect with fellow learners, share knowledge, and accelerate your growth together. Join thousands of students
          who are transforming their careers through collaborative learning.
        </p>

        {/* Features */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Feature
            title="Study Groups"
            description="Form study groups with peers, discuss course materials, and learn together in a supportive environment."
          />
          <Feature
            title="Knowledge Sharing"
            description="Share resources, notes, and insights with the community. Help others while reinforcing your own learning."
          />
          <Feature
            title="Peer Support"
            description="Get help when you're stuck, celebrate achievements together, and stay motivated throughout your learning journey."
          />
        </div>

        {/* Grid canvas with avatars - Custom cursor area */}
        <CursorArea>
          <div
            className="relative mt-10 rounded-xl border border-gray-700 hover:cursor-pointer hover:border-gray-600 transition-colors"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              backgroundPosition: "center",
            }}
          >
            <div className="h-[440px] w-full rounded-xl bg-card/50" />

            {/* Avatar cluster */}
            <div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-end gap-4 md:gap-6">
                {/* Left avatar */}
                <div className="hover:cursor-pointer hover:scale-105 transition-transform">
                  <AvatarCircle
                    alt="Community member avatar"
                    size={72}
                    ring="ring-border"
                    src="/left.png"
                  />
                </div>

                {/* Center avatar (primary focus) */}
                <div className="relative hover:cursor-pointer hover:scale-105 transition-transform">
                  {/* Tooltip */}
                  <div className="absolute -top-20 left-1/2 z-10 -translate-x-1/2">
                    <div className="rounded-md border border-border bg-card px-3 py-2 text-center shadow-md hover:shadow-lg transition-shadow hover:cursor-pointer">
                      <div className="text-sm font-semibold text-card-foreground">Sarah</div>
                      <div className="text-xs text-muted-foreground">Join the community</div>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="mx-auto h-2 w-2 rotate-45 border-b border-r border-border bg-card" />
                  </div>

                  <AvatarCircle
                    alt="Featured learner Sarah"
                    size={96}
                    ring="ring-primary"
                    src="/center.png"
                  />

                  <span className="sr-only">Join our learning community</span>
                </div>

                {/* Right avatar */}
                <div className="hover:cursor-pointer hover:scale-105 transition-transform">
                  <AvatarCircle
                    alt="Community member avatar"
                    size={72}
                    ring="ring-secondary"
                    src="/right.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </CursorArea>
      </div>
    </section>
  )
}

function Feature({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 hover:cursor-pointer hover:bg-muted p-3 rounded-lg transition-colors">
      {/* tiny circular icon */}
      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card hover:border-primary hover:cursor-pointer transition-colors">
        <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <div>
        <div className="text-sm font-semibold text-foreground hover:cursor-pointer">{title}</div>
        <p className="mt-1 text-xs leading-6 text-muted-foreground hover:cursor-pointer">{description}</p>
      </div>
    </div>
  )
}

function AvatarCircle({
  src,
  alt,
  size = 80,
  ring = "ring-border", // Updated default ring color for theme
}: {
  src: string
  alt: string
  size?: number
  ring?: string
}) {
  const dimension = `${size}px`

  return (
    <div
      className={`overflow-hidden rounded-full ring-4 ${ring} shadow-sm hover:shadow-md hover:cursor-pointer transition-shadow`}
      style={{ width: dimension, height: dimension }}
    >
      <img
        src={src || "/placeholder.svg"}
        width={size}
        height={size}
        alt={alt}
        className="h-full w-full object-cover hover:scale-110 hover:cursor-pointer transition-transform duration-300"
        onError={(e) => {
          console.error("Image failed to load:", src)
          // Try alternative paths
          if (!src.includes("placeholder")) {
            e.currentTarget.src = "/placeholder.svg"
          }
        }}
        onLoad={() => console.log("Image loaded successfully:", src)}
        style={{
          backgroundColor: "#374151", // Dark gray background as fallback
        }}
      />
    </div>
  )
}
