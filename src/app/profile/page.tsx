import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <DashboardShell>
      <div className="min-h-screen bg-background text-foreground p-6 space-y-6">

        {/* Profile Header */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute bottom-[-30px] left-6 flex items-center space-x-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src="/your-avatar.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-2xl font-bold">Jaydon Frankie</div>
              <div className="text-sm text-gray-400">CTO</div>
            </div>
          </div>
        </div>

        {/* Profile navigation */}
        <div className="flex gap-4 mt-10">
          <Button variant="outline">Profile</Button>
          <Button variant="outline">Followers</Button>
          <Button variant="outline">Friends</Button>
          <Button variant="outline">Gallery</Button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">

          {/* Left column (About + Social links) */}
          <div className="flex flex-col gap-6 md:w-1/3">

            {/* About card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold mb-2">About</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Tart I love sugar plum I love oat cake. Sweet roll caramels...
                </div>
                <div className="space-y-2 text-sm">
                  <div>📍 United Kingdom</div>
                  <div>✉️ ashlynn.ohara62@gmail.com</div>
                  <div>🏢 CTO at Company</div>
                  <div>🎓 Studied at University</div>
                </div>
              </CardContent>
            </Card>

            {/* Social links card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-semibold mb-2">Social</div>
                <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <a href="#">🌐 Facebook</a>
                  <a href="#">📸 Instagram</a>
                  <a href="#">💼 LinkedIn</a>
                  <a href="#">🐦 Twitter</a>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right column (Posts and stats) */}
          <div className="flex flex-col gap-6 md:w-2/3">

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold">1,947</div>
                  <div className="text-muted-foreground text-sm">Followers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold">9,124</div>
                  <div className="text-muted-foreground text-sm">Following</div>
                </CardContent>
              </Card>
            </div>

            {/* Post input */}
            <Card>
              <CardContent className="p-6">
                <Input placeholder="Share what you are thinking here..." />
                <div className="flex gap-2 mt-4">
                  <Button variant="secondary">Image/Video</Button>
                  <Button variant="secondary">Streaming</Button>
                  <Button className="ml-auto">Post</Button>
                </div>
              </CardContent>
            </Card>

            {/* Last post */}
            <Card>
              <CardContent className="p-6">
                <div className="font-semibold">Jaydon Frankie</div>
                <div className="text-sm text-muted-foreground mb-4">27 Apr 2025</div>
                <div className="text-sm">
                  The sun slowly set over the horizon, painting the sky in vibrant hues...
                </div>
                <div className="mt-4">
                  <img src="/your-post-image.jpg" alt="Post image" className="rounded-lg" />
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </DashboardShell>
  );
}
