import "./App.css";
import Features from "./components/Features/Features";
import Footer from "./components/Footer/Footer";
import ImageUploadForm from "./components/ImageUpload/ImageUploadForm";
import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Intro />
      <ImageUploadForm />
      <Features />
      <Footer />
    </>
  );
}

export default App;
