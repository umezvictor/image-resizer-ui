import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import "./ImageUpload.css";
import { useEffect, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const fileSchema = z.object({
  file: z
    .any()
    .refine((files) => files && files.length === 1, "Image is required")
    .refine((files) => !files || files[0].size <= 5_000_000, "Max size is 5MB"),
});

type CompressFileRequest = z.infer<typeof fileSchema>;

function ImageUploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompressFileRequest>({
    resolver: zodResolver(fileSchema),
  });

  const connectionRef = useRef<HubConnection | null>(null);
  const [blobName, setBlobName] = useState("");
  const [isImageCompresionOK, setIsImageCompresionOK] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isImageCompresionOK) {
      setIsProcessing(false);
    }
  }, [isImageCompresionOK]);

  const submitHandler = async (data: CompressFileRequest) => {
    try {
      const formData = new FormData();
      if (data.file?.length) {
        formData.append("file", data.file[0]);
      }

      setIsProcessing(true);
      setIsImageCompresionOK(false);
      const response = await axios.post(
        "https://imageresizerapi-gedjbzfxfwbfg9ex.northeurope-01.azurewebsites.net/Image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Upload success:", response.data);
      if (response.data.blobUrl) {
      }
    } catch (error) {
      setIsProcessing(false);
      console.error("Error uploading file:", error);
    }
  };

  const handleDownload = async () => {
    if (!blobName) {
      alert("No file available for download yet.");
      return;
    }
    // Construct the download endpoint
    const url = `https://imageresizerapi-gedjbzfxfwbfg9ex.northeurope-01.azurewebsites.net/Image/download/${blobName}`;
    try {
      // Fetch the file as a blob
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();

      // Create a temporary anchor to initiate the download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = blobName; // sets the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl); // Clean up
    } catch (err) {
      alert("Download error: " + err);
    }
  };

  const SIGNALR_NEGOTIATE_URL =
    "https://imageresizer-h8cjegbuafcvh6c0.westeurope-01.azurewebsites.net/api/negotiate";

  useEffect(() => {
    const initConnection = async () => {
      try {
        // 1. Call negotiate endpoint
        const res = await fetch(SIGNALR_NEGOTIATE_URL, { method: "POST" });
        const info = await res.json();

        const connection = new HubConnectionBuilder()
          .withUrl(info.url, {
            accessTokenFactory: () => info.accessToken,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 15000])
          .build();

        await connection.start();
        console.log("Connection successful");
        connectionRef.current = connection;

        connection.on("compressed-images", (downloadUrl) => {
          const myUrl = new URL(downloadUrl);
          const parts = myUrl.pathname.split("/");
          const filename = parts[parts.length - 1];
          if (filename) {
            setBlobName(filename);
            setIsImageCompresionOK(true);
            console.log("filename:", filename);
          }
        });
      } catch (error) {
        console.error("SignalR connection failed:", error);
      }
    };

    initConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      <div className="upload-container">
        <div className="wrapper">
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="form-inputs">
              <input type="file" accept="image/*" {...register("file")} />
              {errors.file && <p>{errors.file.message as string}</p>}
              {/* <button type="submit" disabled={isProcessing}>
                Compress
              </button> */}
              <button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Compress"
                )}
              </button>
            </div>
          </form>
          <div className="download">
            <button
              className={
                isImageCompresionOK
                  ? "download-btn-active"
                  : "download-btn-inactive"
              }
              type="button"
              onClick={handleDownload}
              disabled={!isImageCompresionOK}
            >
              Download Compressed Image
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageUploadForm;
