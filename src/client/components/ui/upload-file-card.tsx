import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Empty, EmptyDescription, EmptyTitle } from "@/client/components/ui/empty";
import { ScrollArea, ScrollBar } from "@/client/components/ui/scroll-area";

interface UploadedFilesCardProps {
  uploadedFiles: File[];
}

export function UploadedFilesCard({ uploadedFiles }: UploadedFilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className="flex w-max space-x-2.5">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="relative aspect-video w-64">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    sizes="(min-width: 640px) 640px, 100vw"
                    loading="lazy"
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Empty>
            <EmptyTitle>No files uploaded</EmptyTitle>
            <EmptyDescription>Upload some files to see them here</EmptyDescription>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
