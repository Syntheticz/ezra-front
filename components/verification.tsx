"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { fetchUserInputIDbyEmail, verifyUser } from "@/lib/queries";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const session = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = await fetchUserInputIDbyEmail(session.data?.user.email || "");
    setIsSubmitting(true);
    setMessage(null);

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    // Simulating API call
    const formData = new FormData();
    formData.append("file", file);
    setMessage("File submitted successfully. Verification is being processed.");

    try {
      const response = await fetch(
        "http://localhost:5000/api/verify?applicantId=" + id,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        if (result.success) {
          setMessage(
            "Document verification successfull, you may now close this window."
          );

          await verifyUser(id);
          session.update({
            user: {
              ...session.data?.user,
              isVerified: true,
            },
          });
          router.push("/");
        }
      } else {
        setMessage(
          "Document verification unsuccessfull, please check the information that is in your document."
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 flex-col">
      <h1 className="text-4xl font-bold text-center py-4">
        One more step away!
      </h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Document Verification
          </CardTitle>
          <CardDescription className="text-center">
            Upload your PDF document for verification. We&apos;ll check the
            contents to ensure its validity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Upload PDF</Label>
              <Input onChange={handleFileChange} id="picture" type="file" />
            </div>
            <Button
              type="submit"
              disabled={!file || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Verify Document"}
            </Button>
          </form>
          {message && (
            <div className="mt-4 p-3 rounded-md bg-primary/10 text-primary flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <p>{message}</p>
            </div>
          )}
          <div className="mt-6 text-sm text-muted-foreground">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Upload your PDF document using the file input above.</li>
              <li>
                Click the &quot;Verify Document&quot; button to submit your
                file.
              </li>
              <li>
                Our system will process your document and verify its contents.
              </li>
              <li>Please wait patiently for the process to be completed.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
