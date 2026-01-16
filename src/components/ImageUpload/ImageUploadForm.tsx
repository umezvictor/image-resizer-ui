import "./ImageUpload.css";

function ImageUploadForm() {
  return (
    <>
      <div className="upload-container">
        <div className="wrapper">
          <div className="form-inputs">
            <input type="file" />
            <button type="button">Compress</button>
          </div>
          <div className="download">
            <button className="download-btn">Download</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageUploadForm;
