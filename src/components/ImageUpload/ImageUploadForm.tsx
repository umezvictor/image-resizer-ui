import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import "./ImageUpload.css";

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
