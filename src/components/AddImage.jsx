import { useState } from 'react';
import camera from '../../src/assets/camera.svg';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../Firebase/Firebase';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const AddImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [File, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const uploadImage = async () => {
    if (File) {
      setLoading(true);
      const storageRef = ref(storage, `images/${File.name}`);
      try {
        await uploadBytes(storageRef, File);
        const downloadUrl = await getDownloadURL(storageRef);

        const imageCollectionRef = collection(db, 'images');
        const newImageId = new Date().getTime().toString(); // Generate a custom ID
        const newImageRef = doc(imageCollectionRef, newImageId);

        await setDoc(newImageRef, {
          imageUrl: downloadUrl,
          id: newImageId,
        });

        console.log(
          'Image uploaded and Firestore document created with ID:',
          newImageRef.id
        );
        setLoading(false);
        setSelectedImage('');
        setFile('');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  console.log(selectedImage);
  return (
    <>
      <Link to="/getAllImages" className="text-blue-600 underline ml-2">
        Go To Images
      </Link>
      <h2 className="text-[32px] font-500 mb-4 mt-10 text-center">
        Add A Picture Of You
      </h2>
      <div className="w-full text-black flex flex-col gap-4">
        <div className="flex justify-center">
          <label
            htmlFor="img"
            className="w-[284px] h-[284px] border-[1px] border-black rounded-[16px] bg-[#FFF] flex flex-col items-center justify-center cursor-pointer"
          >
            <input
              type="file"
              onChange={handleImageChange}
              name="image"
              id="img"
              className="hidden"
            />
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected Image"
                className="max-w-full max-h-full"
              />
            ) : (
              <img
                src={camera}
                alt="Choose an image"
                className="max-w-full max-h-full"
              />
            )}
            {!selectedImage && (
              <span className="mt-2">Click to add an Image</span>
            )}
          </label>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <button
            onClick={uploadImage}
            className="bg-blue-400 text-white hover:scale-110 duration-300 font-semibold px-2 py-1 rounded-[4px] self-center"
          >
            Submit
          </button>
        )}
      </div>
    </>
  );
};

export default AddImage;
