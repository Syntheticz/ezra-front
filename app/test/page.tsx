"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/verify?applicantId=d8644129-8135-44db-bec2-1599105d9091",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  useEffect(() => {}, []);

  return (
    <div>
      {" "}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">File</Label>
        <Input onChange={handleFileChange} id="picture" type="file" />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}
