import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import "./ImageUpload.css";
import { useEffect, useRef } from "react";
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

  const submitHandler = async (data: CompressFileRequest) => {
    try {
      const formData = new FormData();
      if (data.file?.length) {
        formData.append("file", data.file[0]);
      }
      const response = await axios.post(
        "http://20.93.223.109:8080/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const SIGNALR_NEGOTIATE_URL =
    "https://imageresizer-h8cjegbuafcvh6c0.westeurope-01.azurewebsites.net/negotiate";

  //SignalR connection and event handlers
  useEffect(() => {
    const initConnection = async () => {
      try {
        // 1. Call negotiate endpoint
        const res = await fetch(SIGNALR_NEGOTIATE_URL, { method: "POST" });
        console.log("res");
        console.log(res);
        const info = await res.json();
        console.log("info");
        console.log(info);
        // info.url and info.accessToken are provided by the function

        // 2. Create SignalR connection using negotiated details
        const connection = new HubConnectionBuilder()
          .withUrl(info.url, {
            accessTokenFactory: () => info.accessToken,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 15000])
          .build();

        // 3. Start the connection
        await connection.start();
        console.log("Connection successful");
        connectionRef.current = connection;

        // 4. (Optional) Set up a handler for your SignalR events
        connection.on("resized-image", (downloadUrl) => {
          console.log("New image:", downloadUrl);
          // Handle the new image URL (e.g., update state or display UI)
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
              <button type="submit">Compress</button>
            </div>
          </form>
          <div className="download">
            <button className="download-btn">Download</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageUploadForm;
