import "./Features.css";
function Features() {
  return (
    <>
      <div className="features">
        <div className="feature">
          <i className="fa-solid fa-medal fa-lg icon"></i>
          <h5 className="feature-title">Perfect Quality</h5>
          <p className="feature-description">
            The best online image resizer to resize your images at the highest
            quality.
          </p>
        </div>
        <div className="feature">
          <i className="fa-solid fa-bolt-lightning fa-lg icon"></i>
          <h5 className="feature-title">Lightning Fast</h5>
          <p className="feature-description">
            This cloud-hosted, highly scalable tool can resize your images
            within seconds!
          </p>
        </div>{" "}
        <div className="feature">
          <i className="fa-solid fa-pen-ruler fa-lg icon"></i>
          <h5 className="feature-title">Easy to use</h5>
          <p className="feature-description">
            Simply upload your image and enter a target size. It's as easy as
            that!.
          </p>
        </div>
      </div>
      <div className="features2">
        <div className="feature">
          <i className="fa-regular fa-lightbulb fa-lg icon"></i>
          <h5 className="feature-title">Works Anywhere</h5>
          <p className="feature-description">
            ImageResizer is browser-based (no software to install). It works on
            any platform (Windows, Linux, Mac)
          </p>
        </div>
        <div className="feature">
          <i className="fa-solid fa-lock fa-lg icon"></i>
          <h5 className="feature-title">Privacy Guaranteed</h5>
          <p className="feature-description">
            Your images are uploaded via a secure 256-bit encrypted SSL
            connection and deleted automatically within 6 hours.
          </p>
        </div>{" "}
        <div className="feature">
          <i className="fa-regular fa-heart fa-lg icon"></i>
          <h5 className="feature-title">Its Free</h5>
          <p className="feature-description">
            Since 2012 we have resized millions of images for free! There is no
            software to install, registrations, or watermarks.
          </p>
        </div>
      </div>
    </>
  );
}

export default Features;
